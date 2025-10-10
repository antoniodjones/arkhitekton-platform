import { 
  type User, 
  type InsertUser, 
  type ArchitectureElement, 
  type InsertArchitectureElement, 
  type RecentElement, 
  type InsertRecentElement,
  type KnowledgeBasePage,
  type InsertKnowledgeBasePage,
  type Task,
  type InsertTask,
  type UserStory,
  type InsertUserStory,
  type Epic,
  type InsertEpic,
  type IntegrationChannel,
  type InsertIntegrationChannel,
  type ObjectSyncFlow,
  type InsertObjectSyncFlow,
  type ApplicationSetting,
  type InsertApplicationSetting
} from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq } from "drizzle-orm";
import * as schema from "@shared/schema";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Architecture Elements
  getArchitectureElements(): Promise<ArchitectureElement[]>;
  getArchitectureElementsByCategory(category: string): Promise<ArchitectureElement[]>;
  getArchitectureElementsByFramework(framework: string): Promise<ArchitectureElement[]>;
  createArchitectureElement(element: InsertArchitectureElement): Promise<ArchitectureElement>;
  
  // Recent Elements
  getRecentElementsByUser(userId: string): Promise<RecentElement[]>;
  addRecentElement(recentElement: InsertRecentElement): Promise<RecentElement>;
  
  // Knowledge Base Pages
  getAllKnowledgeBasePages(): Promise<KnowledgeBasePage[]>;
  getRootKnowledgeBasePages(): Promise<KnowledgeBasePage[]>;
  getChildKnowledgeBasePages(parentId: string): Promise<KnowledgeBasePage[]>;
  getKnowledgeBasePage(id: string): Promise<KnowledgeBasePage | undefined>;
  getKnowledgeBasePagesByCategory(category: string): Promise<KnowledgeBasePage[]>;
  searchKnowledgeBasePages(query: string): Promise<KnowledgeBasePage[]>;
  createKnowledgeBasePage(page: InsertKnowledgeBasePage): Promise<KnowledgeBasePage>;
  updateKnowledgeBasePage(id: string, updates: Partial<KnowledgeBasePage>): Promise<KnowledgeBasePage | undefined>;
  deleteKnowledgeBasePage(id: string): Promise<boolean>;
  getPageBreadcrumbs(id: string): Promise<{ id: string; title: string; path: string }[]>;
  moveKnowledgeBasePage(id: string, newParentId: string | null, newOrder?: number): Promise<boolean>;

  // Tasks
  getAllTasks(): Promise<Task[]>;
  getTask(id: string): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, updates: Partial<Task>): Promise<Task | undefined>;
  deleteTask(id: string): Promise<boolean>;

  // User Stories
  getAllUserStories(): Promise<UserStory[]>;
  getUserStory(id: string): Promise<UserStory | undefined>;
  getUserStoriesByTask(taskId: string): Promise<UserStory[]>;
  getUserStoriesByAssignee(assignee: string): Promise<UserStory[]>;
  getUserStoriesByEpic(epicId: string): Promise<UserStory[]>;
  createUserStory(story: InsertUserStory): Promise<UserStory>;
  updateUserStory(id: string, updates: Partial<UserStory>): Promise<UserStory | undefined>;
  deleteUserStory(id: string): Promise<boolean>;

  // Epics - Enterprise Architecture Value Streams
  getAllEpics(): Promise<Epic[]>;
  getEpic(id: string): Promise<Epic | undefined>;
  getEpicsByValueStream(valueStream: string): Promise<Epic[]>;
  getEpicsByStatus(status: string): Promise<Epic[]>;
  createEpic(epic: InsertEpic): Promise<Epic>;
  updateEpic(id: string, updates: Partial<Epic>): Promise<Epic | undefined>;
  deleteEpic(id: string): Promise<boolean>;

  // Developer Integration Channels
  getAllIntegrationChannels(): Promise<IntegrationChannel[]>;
  getIntegrationChannel(id: string): Promise<IntegrationChannel | undefined>;
  getIntegrationChannelByTool(toolId: string): Promise<IntegrationChannel | undefined>;
  getIntegrationChannelsByType(type: string): Promise<IntegrationChannel[]>;
  createIntegrationChannel(channel: InsertIntegrationChannel): Promise<IntegrationChannel>;
  updateIntegrationChannel(id: string, updates: Partial<IntegrationChannel>): Promise<IntegrationChannel | undefined>;
  deleteIntegrationChannel(id: string): Promise<boolean>;

  // Object Sync Flows
  getAllObjectSyncFlows(): Promise<ObjectSyncFlow[]>;
  getObjectSyncFlow(id: string): Promise<ObjectSyncFlow | undefined>;
  getObjectSyncFlowsByChannel(channelId: string): Promise<ObjectSyncFlow[]>;
  getObjectSyncFlowsByState(state: string): Promise<ObjectSyncFlow[]>;
  createObjectSyncFlow(flow: InsertObjectSyncFlow): Promise<ObjectSyncFlow>;
  updateObjectSyncFlow(id: string, updates: Partial<ObjectSyncFlow>): Promise<ObjectSyncFlow | undefined>;
  updateSyncFlowState(id: string, state: string, stateVersion: number): Promise<ObjectSyncFlow | undefined>;
  deleteObjectSyncFlow(id: string): Promise<boolean>;

  // Application Settings
  getAllSettings(): Promise<ApplicationSetting[]>;
  getSetting(key: string): Promise<ApplicationSetting | undefined>;
  getSettingsByCategory(category: string): Promise<ApplicationSetting[]>;
  createSetting(setting: InsertApplicationSetting): Promise<ApplicationSetting>;
  updateSetting(key: string, updates: Partial<ApplicationSetting>): Promise<ApplicationSetting | undefined>;
  deleteSetting(key: string): Promise<boolean>;
}

// Standardized User Story ID generator with collision detection
export function generateUserStoryId(): string {
  // Generate exactly 7 characters using timestamp and random characters
  const timestamp = Date.now().toString(36); // Base36 timestamp
  const random = Math.random().toString(36).substr(2, 4); // 4 random chars
  const combined = (timestamp + random).substr(-7).toUpperCase(); // Last 7 chars, uppercase
  return `US-${combined}`;
}

// Generate unique ID with collision detection for storage
export async function generateUniqueUserStoryId(storage: IStorage): Promise<string> {
  let attempts = 0;
  const maxAttempts = 10; // Prevent infinite loops
  
  while (attempts < maxAttempts) {
    const id = generateUserStoryId();
    const existing = await storage.getUserStory(id);
    if (!existing) {
      return id;
    }
    attempts++;
  }
  
  throw new Error("Failed to generate unique user story ID after maximum attempts");
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private architectureElements: Map<string, ArchitectureElement>;
  private recentElements: Map<string, RecentElement>;
  private knowledgeBasePages: Map<string, KnowledgeBasePage>;
  private tasks: Map<string, Task>;
  private userStories: Map<string, UserStory>;
  private epics: Map<string, Epic>;
  private integrationChannels: Map<string, IntegrationChannel>;
  private objectSyncFlows: Map<string, ObjectSyncFlow>;
  private applicationSettings: Map<string, ApplicationSetting>;

  constructor() {
    this.users = new Map();
    this.architectureElements = new Map();
    this.recentElements = new Map();
    this.knowledgeBasePages = new Map();
    this.tasks = new Map();
    this.applicationSettings = new Map();
    this.userStories = new Map();
    this.epics = new Map();
    this.integrationChannels = new Map();
    this.objectSyncFlows = new Map();
    
    // Initialize with some sample architecture elements
    this.initializeArchitectureElements();
    // Initialize with sample knowledge base pages
    this.initializeKnowledgeBasePages();
    // Initialize with sample tasks with realistic dates
    this.initializeSampleTasks();
    // Initialize with sample user stories (async)
    this.initializeSampleUserStories().catch(console.error);
    // Initialize with sample developer integration data
    this.initializeDeveloperIntegrations();
  }

  private initializeArchitectureElements() {
    const sampleElements: InsertArchitectureElement[] = [
      {
        name: 'Business Actor',
        type: 'structural',
        category: 'business',
        framework: 'archimate',
        description: 'An organizational entity that is capable of performing behavior.',
        usageGuidelines: 'Use to represent individuals, organizational units, or external organizations that perform business behavior.',
        iconName: 'User',
        color: 'hsl(12 76% 61%)',
        shape: 'rectangular',
        relationships: ['Business Role', 'Business Process', 'Business Object']
      },
      {
        name: 'Business Process',
        type: 'behavioral',
        category: 'business',
        framework: 'archimate',
        description: 'A sequence of business behaviors that achieves a specific result.',
        usageGuidelines: 'Use to model end-to-end business processes. Should represent meaningful business outcomes.',
        iconName: 'Cog',
        color: 'hsl(173 58% 39%)',
        shape: 'rounded',
        relationships: ['Business Actor', 'Business Role', 'Business Object', 'Business Service']
      }
    ];

    sampleElements.forEach(element => {
      const id = randomUUID();
      const fullElement: ArchitectureElement = {
        ...element,
        id,
        createdAt: new Date()
      };
      this.architectureElements.set(id, fullElement);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getArchitectureElements(): Promise<ArchitectureElement[]> {
    return Array.from(this.architectureElements.values());
  }

  async getArchitectureElementsByCategory(category: string): Promise<ArchitectureElement[]> {
    return Array.from(this.architectureElements.values()).filter(
      element => element.category === category
    );
  }

  async getArchitectureElementsByFramework(framework: string): Promise<ArchitectureElement[]> {
    return Array.from(this.architectureElements.values()).filter(
      element => element.framework === framework
    );
  }

  async createArchitectureElement(insertElement: InsertArchitectureElement): Promise<ArchitectureElement> {
    const id = randomUUID();
    const element: ArchitectureElement = {
      ...insertElement,
      id,
      createdAt: new Date()
    };
    this.architectureElements.set(id, element);
    return element;
  }

  async getRecentElementsByUser(userId: string): Promise<RecentElement[]> {
    return Array.from(this.recentElements.values())
      .filter(element => element.userId === userId)
      .sort((a, b) => b.usedAt!.getTime() - a.usedAt!.getTime());
  }

  async addRecentElement(insertRecentElement: InsertRecentElement): Promise<RecentElement> {
    const id = randomUUID();
    const recentElement: RecentElement = {
      ...insertRecentElement,
      id,
      usedAt: new Date(),
      usageCount: insertRecentElement.usageCount ?? 1
    };
    this.recentElements.set(id, recentElement);
    return recentElement;
  }

  private initializeKnowledgeBasePages() {
    const samplePages: InsertKnowledgeBasePage[] = [
      {
        title: 'Getting Started',
        slug: 'getting-started',
        content: 'Welcome to the ARKHITEKTON Knowledge Base! This is your central hub for all architecture documentation, best practices, and implementation guides.',
        category: 'architecture',
        status: 'published'
      },
      {
        title: 'Architecture Patterns',
        slug: 'architecture-patterns',
        content: 'Comprehensive guide to enterprise architecture patterns used in modern systems.',
        category: 'architecture',
        status: 'published'
      }
    ];

    samplePages.forEach(page => {
      const id = randomUUID();
      const fullPage: KnowledgeBasePage = {
        ...page,
        id,
        parentPageId: null,
        order: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.knowledgeBasePages.set(id, fullPage);
    });
  }

  private initializeSampleTasks() {
    // Use shared sample tasks module for consistency  
    const { getSampleTasks } = require('./sample-tasks');
    const sampleTasks = getSampleTasks();

    sampleTasks.forEach(taskData => {
      const id = randomUUID();
      const task: Task = {
        ...taskData,
        id,
        createdAt: new Date(),
        updatedAt: new Date(),
        completedAt: taskData.completed === 1 ? new Date() : null
      };
      this.tasks.set(id, task);
    });
  }

  // Knowledge Base Pages Implementation
  async getAllKnowledgeBasePages(): Promise<KnowledgeBasePage[]> {
    return Array.from(this.knowledgeBasePages.values());
  }

  async getRootKnowledgeBasePages(): Promise<KnowledgeBasePage[]> {
    return Array.from(this.knowledgeBasePages.values())
      .filter(page => !page.parentPageId)
      .sort((a, b) => a.order - b.order);
  }

  async getChildKnowledgeBasePages(parentId: string): Promise<KnowledgeBasePage[]> {
    return Array.from(this.knowledgeBasePages.values())
      .filter(page => page.parentPageId === parentId)
      .sort((a, b) => a.order - b.order);
  }

  async getKnowledgeBasePage(id: string): Promise<KnowledgeBasePage | undefined> {
    return this.knowledgeBasePages.get(id);
  }

  async getKnowledgeBasePagesByCategory(category: string): Promise<KnowledgeBasePage[]> {
    return Array.from(this.knowledgeBasePages.values())
      .filter(page => page.category === category);
  }

  async searchKnowledgeBasePages(query: string): Promise<KnowledgeBasePage[]> {
    const searchTerm = query.toLowerCase();
    return Array.from(this.knowledgeBasePages.values())
      .filter(page => 
        page.title.toLowerCase().includes(searchTerm) ||
        page.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        (page.searchKeywords && page.searchKeywords.toLowerCase().includes(searchTerm))
      );
  }

  async createKnowledgeBasePage(pageData: InsertKnowledgeBasePage): Promise<KnowledgeBasePage> {
    const id = randomUUID();
    const page: KnowledgeBasePage = {
      ...pageData,
      id,
      parentPageId: pageData.parentPageId || null,
      linkedModelIds: pageData.linkedModelIds || [],
      collaborators: pageData.collaborators || [],
      reviewers: pageData.reviewers || [],
      externalSync: pageData.externalSync || null,
      searchKeywords: pageData.searchKeywords || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.knowledgeBasePages.set(id, page);
    return page;
  }

  async updateKnowledgeBasePage(id: string, updates: Partial<KnowledgeBasePage>): Promise<KnowledgeBasePage | undefined> {
    const existingPage = this.knowledgeBasePages.get(id);
    if (!existingPage) {
      return undefined;
    }

    const updatedPage = {
      ...existingPage,
      ...updates,
      updatedAt: new Date()
    };

    this.knowledgeBasePages.set(id, updatedPage);
    return updatedPage;
  }

  async deleteKnowledgeBasePage(id: string): Promise<boolean> {
    // Also delete all child pages
    const childPages = await this.getChildKnowledgeBasePages(id);
    for (const child of childPages) {
      await this.deleteKnowledgeBasePage(child.id);
    }

    return this.knowledgeBasePages.delete(id);
  }

  async getPageBreadcrumbs(id: string): Promise<{ id: string; title: string; path: string }[]> {
    const breadcrumbs: { id: string; title: string; path: string }[] = [];
    let currentPage = await this.getKnowledgeBasePage(id);

    while (currentPage) {
      breadcrumbs.unshift({
        id: currentPage.id,
        title: currentPage.title,
        path: currentPage.path
      });

      if (currentPage.parentPageId) {
        currentPage = await this.getKnowledgeBasePage(currentPage.parentPageId);
      } else {
        currentPage = undefined;
      }
    }

    return breadcrumbs;
  }

  async moveKnowledgeBasePage(id: string, newParentId: string | null, newOrder?: number): Promise<boolean> {
    const page = await this.getKnowledgeBasePage(id);
    if (!page) {
      return false;
    }

    // Update parent and recalculate path/depth
    let newPath = `/${page.slug}`;
    let newDepth = 0;

    if (newParentId) {
      const newParent = await this.getKnowledgeBasePage(newParentId);
      if (newParent) {
        newPath = `${newParent.path}/${page.slug}`;
        newDepth = newParent.depth + 1;
      }
    }

    const updates = {
      parentPageId: newParentId,
      path: newPath,
      depth: newDepth,
      order: newOrder !== undefined ? newOrder : page.order
    };

    const updatedPage = await this.updateKnowledgeBasePage(id, updates);
    return updatedPage !== undefined;
  }

  // Task implementation
  async getAllTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values());
  }

  async getTask(id: string): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async createTask(taskData: InsertTask): Promise<Task> {
    const id = randomUUID();
    const task: Task = {
      ...taskData,
      id,
      completed: taskData.completed || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      completedAt: taskData.completed === 1 ? new Date() : null
    };
    this.tasks.set(id, task);
    return task;
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task | undefined> {
    const existingTask = this.tasks.get(id);
    if (!existingTask) {
      return undefined;
    }

    const updatedTask: Task = {
      ...existingTask,
      ...updates,
      updatedAt: new Date(),
      completedAt: updates.completed === 1 || updates.status === 'completed' ? new Date() : 
                   updates.completed === 0 || updates.status !== 'completed' ? null :
                   existingTask.completedAt
    };

    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  async deleteTask(id: string): Promise<boolean> {
    return this.tasks.delete(id);
  }

  // User Stories Implementation
  async getAllUserStories(): Promise<UserStory[]> {
    return Array.from(this.userStories.values());
  }

  async getUserStory(id: string): Promise<UserStory | undefined> {
    return this.userStories.get(id);
  }

  async getUserStoriesByTask(taskId: string): Promise<UserStory[]> {
    return Array.from(this.userStories.values()).filter(story => story.parentTaskId === taskId);
  }

  async getUserStoriesByAssignee(assignee: string): Promise<UserStory[]> {
    return Array.from(this.userStories.values()).filter(story => 
      story.assignee === assignee || 
      story.productManager === assignee || 
      story.techLead === assignee
    );
  }

  async createUserStory(storyData: InsertUserStory): Promise<UserStory> {
    // Always generate server-side ID with collision detection
    const id = await generateUniqueUserStoryId(this);
    const story: UserStory = {
      ...storyData,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.userStories.set(id, story);
    return story;
  }

  async updateUserStory(id: string, updates: Partial<UserStory>): Promise<UserStory | undefined> {
    const existingStory = this.userStories.get(id);
    if (!existingStory) {
      return undefined;
    }

    const updatedStory: UserStory = {
      ...existingStory,
      ...updates,
      updatedAt: new Date()
    };

    this.userStories.set(id, updatedStory);
    return updatedStory;
  }

  async deleteUserStory(id: string): Promise<boolean> {
    return this.userStories.delete(id);
  }

  async getUserStoriesByEpic(epicId: string): Promise<UserStory[]> {
    return Array.from(this.userStories.values()).filter(story => story.epicId === epicId);
  }

  // Epic CRUD Operations
  async getAllEpics(): Promise<Epic[]> {
    return Array.from(this.epics.values());
  }

  async getEpic(id: string): Promise<Epic | undefined> {
    return this.epics.get(id);
  }

  async getEpicsByValueStream(valueStream: string): Promise<Epic[]> {
    return Array.from(this.epics.values()).filter(epic => epic.valueStream === valueStream);
  }

  async getEpicsByStatus(status: string): Promise<Epic[]> {
    return Array.from(this.epics.values()).filter(epic => epic.status === status);
  }

  async createEpic(epic: InsertEpic): Promise<Epic> {
    // Check for duplicate ID to ensure consistency with DatabaseStorage
    if (this.epics.has(epic.id)) {
      const error: any = new Error(`Epic with id ${epic.id} already exists`);
      error.code = '23505'; // PostgreSQL duplicate key error code
      throw error;
    }
    
    const newEpic: Epic = {
      ...epic,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.epics.set(newEpic.id, newEpic);
    return newEpic;
  }

  async updateEpic(id: string, updates: Partial<Epic>): Promise<Epic | undefined> {
    const epic = this.epics.get(id);
    if (!epic) return undefined;

    const updatedEpic: Epic = {
      ...epic,
      ...updates,
      id,
      updatedAt: new Date()
    };
    this.epics.set(id, updatedEpic);
    return updatedEpic;
  }

  async deleteEpic(id: string): Promise<boolean> {
    return this.epics.delete(id);
  }

  // Initialize sample user stories
  private async initializeSampleUserStories() {
    const sampleStories: InsertUserStory[] = [
      {
        parentTaskId: null, // Independent story
        title: "As a systems architect, I want to create enterprise architecture models, so that I can design scalable systems",
        description: "This story covers the basic architecture modeling capability",
        acceptanceCriteria: `Given I am a systems architect
When I access the modeling interface
Then I can create comprehensive architecture models

Scenario: Model Creation
  Given I have access to the design canvas
  When I drag and drop architectural components
  Then I can build complete system models
  And the models should follow enterprise standards`,
        storyPoints: 8,
        status: "backlog",
        priority: "high",
        assignee: "Sarah Chen",
        productManager: "Emily Davis",
        techLead: "Alex Johnson",
        labels: ["foundation", "architecture"],
        feature: "Core modeling capability",
        value: "Enable enterprise-grade system design",
        requirement: "Scalable architecture modeling platform"
      },
      {
        parentTaskId: null,
        title: "As a product manager, I want to manage user stories with team assignments, so that I can coordinate development work effectively",
        description: "Complete story management with searchable team assignment capabilities",
        acceptanceCriteria: `Given I am a product manager
When I create and manage user stories
Then I can assign developers, PMs, and tech leads

Scenario: Team Assignment
  Given I have a user story to assign
  When I search for team members by role
  Then I can assign the right people to the work
  And track progress across the team`,
        storyPoints: 5,
        status: "in-progress", 
        priority: "high",
        assignee: "Mike Rodriguez",
        productManager: "Emily Davis",
        techLead: "David Kim",
        labels: ["ux", "management"],
        feature: "Story management",
        value: "Improve team coordination and visibility",
        requirement: "Enterprise team assignment system"
      }
    ];

    // Create stories with proper ID generation
    for (const storyData of sampleStories) {
      await this.createUserStory(storyData);
    }
  }

  private initializeDeveloperIntegrations() {
    const sampleIntegrationChannels: InsertIntegrationChannel[] = [
      {
        toolId: 'vscode',
        name: 'Visual Studio Code',
        type: 'ide',
        directionality: 'bidirectional',
        capabilities: ['model_sync', 'code_gen', 'reverse_eng', 'real_time'],
        connectionConfig: {
          authMethod: 'oauth' as const,
          syncFrequency: 'real_time' as const,
          requiredScopes: ['workspace', 'extensions']
        },
        version: '1.0.0',
        documentation: 'ARKHITEKTON VS Code extension for real-time model synchronization'
      },
      {
        toolId: 'intellij',
        name: 'IntelliJ IDEA',
        type: 'ide',
        directionality: 'bidirectional',
        capabilities: ['model_sync', 'code_gen', 'reverse_eng'],
        connectionConfig: {
          authMethod: 'token' as const,
          syncFrequency: 'on_demand' as const,
          apiEndpoint: 'https://api.jetbrains.com'
        },
        version: '1.0.0',
        documentation: 'ARKHITEKTON IntelliJ plugin for architecture modeling'
      },
      {
        toolId: 'github',
        name: 'GitHub',
        type: 'vcs',
        directionality: 'bidirectional',
        capabilities: ['model_sync', 'webhook', 'ci_cd'],
        connectionConfig: {
          authMethod: 'oauth' as const,
          syncFrequency: 'real_time' as const,
          webhookUrl: 'https://api.github.com/webhooks',
          requiredScopes: ['repo', 'admin:repo_hook']
        },
        version: '1.0.0',
        documentation: 'GitHub integration for version control and CI/CD'
      },
      {
        toolId: 'gitlab',
        name: 'GitLab',
        type: 'vcs',
        directionality: 'bidirectional',
        capabilities: ['model_sync', 'webhook', 'ci_cd'],
        connectionConfig: {
          authMethod: 'token' as const,
          syncFrequency: 'real_time' as const,
          apiEndpoint: 'https://gitlab.com/api/v4'
        },
        version: '1.0.0',
        documentation: 'GitLab integration for enterprise version control'
      }
    ];

    sampleIntegrationChannels.forEach(channel => {
      const id = randomUUID();
      const fullChannel: IntegrationChannel = {
        ...channel,
        id,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.integrationChannels.set(id, fullChannel);

      // Create sample sync flows for each channel
      const sampleSyncFlow: InsertObjectSyncFlow = {
        name: `${channel.name} Object Sync`,
        description: `Git-like object synchronization for ${channel.name}`,
        integrationChannelId: id,
        objectTypes: ['component', 'service', 'interface', 'data_model'],
        sourceScope: 'workspace',
        targetScope: 'repository',
        stateTransitions: [
          {
            from: 'draft',
            to: 'staged',
            trigger: 'auto_save',
            actions: ['validate', 'generate_code']
          },
          {
            from: 'staged',
            to: 'committed',
            trigger: 'commit',
            actions: ['update_docs', 'notify_team']
          },
          {
            from: 'committed',
            to: 'merged',
            trigger: 'merge',
            actions: ['deploy', 'update_tracking']
          }
        ],
        conflictResolution: {
          strategy: 'manual',
          mergePatterns: ['semantic_merge', 'three_way_merge'],
          reviewRequired: true
        },
        currentState: 'draft',
        stateVersion: 1,
        syncMetrics: {
          successCount: 0,
          errorCount: 0,
          avgSyncTime: 0,
          objectsProcessed: 0
        },
        isActive: 1,
        syncTriggers: ['on_save', 'on_commit']
      };

      const syncFlowId = randomUUID();
      const fullSyncFlow: ObjectSyncFlow = {
        ...sampleSyncFlow,
        id: syncFlowId,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.objectSyncFlows.set(syncFlowId, fullSyncFlow);
    });
  }

  // Developer Integration Channels Implementation
  async getAllIntegrationChannels(): Promise<IntegrationChannel[]> {
    return Array.from(this.integrationChannels.values());
  }

  async getIntegrationChannel(id: string): Promise<IntegrationChannel | undefined> {
    return this.integrationChannels.get(id);
  }

  async getIntegrationChannelByTool(toolId: string): Promise<IntegrationChannel | undefined> {
    return Array.from(this.integrationChannels.values()).find(channel => channel.toolId === toolId);
  }

  async getIntegrationChannelsByType(type: string): Promise<IntegrationChannel[]> {
    return Array.from(this.integrationChannels.values()).filter(channel => channel.type === type);
  }

  async createIntegrationChannel(channelData: InsertIntegrationChannel): Promise<IntegrationChannel> {
    const id = randomUUID();
    const channel: IntegrationChannel = {
      ...channelData,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.integrationChannels.set(id, channel);
    return channel;
  }

  async updateIntegrationChannel(id: string, updates: Partial<IntegrationChannel>): Promise<IntegrationChannel | undefined> {
    const channel = this.integrationChannels.get(id);
    if (!channel) return undefined;
    
    const updatedChannel: IntegrationChannel = {
      ...channel,
      ...updates,
      updatedAt: new Date()
    };
    this.integrationChannels.set(id, updatedChannel);
    return updatedChannel;
  }

  async deleteIntegrationChannel(id: string): Promise<boolean> {
    return this.integrationChannels.delete(id);
  }

  // Object Sync Flows Implementation
  async getAllObjectSyncFlows(): Promise<ObjectSyncFlow[]> {
    return Array.from(this.objectSyncFlows.values());
  }

  async getObjectSyncFlow(id: string): Promise<ObjectSyncFlow | undefined> {
    return this.objectSyncFlows.get(id);
  }

  async getObjectSyncFlowsByChannel(channelId: string): Promise<ObjectSyncFlow[]> {
    return Array.from(this.objectSyncFlows.values()).filter(flow => flow.integrationChannelId === channelId);
  }

  async getObjectSyncFlowsByState(state: string): Promise<ObjectSyncFlow[]> {
    return Array.from(this.objectSyncFlows.values()).filter(flow => flow.currentState === state);
  }

  async createObjectSyncFlow(flowData: InsertObjectSyncFlow): Promise<ObjectSyncFlow> {
    const id = randomUUID();
    const flow: ObjectSyncFlow = {
      ...flowData,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.objectSyncFlows.set(id, flow);
    return flow;
  }

  async updateObjectSyncFlow(id: string, updates: Partial<ObjectSyncFlow>): Promise<ObjectSyncFlow | undefined> {
    const flow = this.objectSyncFlows.get(id);
    if (!flow) return undefined;
    
    const updatedFlow: ObjectSyncFlow = {
      ...flow,
      ...updates,
      updatedAt: new Date()
    };
    this.objectSyncFlows.set(id, updatedFlow);
    return updatedFlow;
  }

  async updateSyncFlowState(id: string, state: string, stateVersion: number): Promise<ObjectSyncFlow | undefined> {
    const flow = this.objectSyncFlows.get(id);
    if (!flow || flow.stateVersion !== stateVersion) return undefined;
    
    const updatedFlow: ObjectSyncFlow = {
      ...flow,
      currentState: state,
      stateVersion: stateVersion + 1,
      updatedAt: new Date()
    };
    this.objectSyncFlows.set(id, updatedFlow);
    return updatedFlow;
  }

  async deleteObjectSyncFlow(id: string): Promise<boolean> {
    return this.objectSyncFlows.delete(id);
  }

  // Application Settings
  async getAllSettings(): Promise<ApplicationSetting[]> {
    return Array.from(this.applicationSettings.values());
  }

  async getSetting(key: string): Promise<ApplicationSetting | undefined> {
    return this.applicationSettings.get(key);
  }

  async getSettingsByCategory(category: string): Promise<ApplicationSetting[]> {
    return Array.from(this.applicationSettings.values()).filter(
      (setting) => setting.category === category
    );
  }

  async createSetting(setting: InsertApplicationSetting): Promise<ApplicationSetting> {
    const newSetting: ApplicationSetting = {
      id: randomUUID(),
      key: setting.key,
      value: setting.value,
      category: setting.category,
      isSensitive: setting.isSensitive ?? 1,
      description: setting.description ?? null,
      metadata: setting.metadata ?? null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.applicationSettings.set(newSetting.key, newSetting);
    return newSetting;
  }

  async updateSetting(key: string, updates: Partial<ApplicationSetting>): Promise<ApplicationSetting | undefined> {
    const setting = this.applicationSettings.get(key);
    if (!setting) return undefined;
    
    const updated: ApplicationSetting = {
      ...setting,
      ...updates,
      key: setting.key, // Ensure key doesn't change
      updatedAt: new Date()
    };
    this.applicationSettings.set(key, updated);
    return updated;
  }

  async deleteSetting(key: string): Promise<boolean> {
    return this.applicationSettings.delete(key);
  }
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(schema.users).where(eq(schema.users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(schema.users).where(eq(schema.users.username, username));
    return user || undefined;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db
      .insert(schema.users)
      .values(userData)
      .returning();
    return user;
  }

  // Architecture Elements (stub implementations - using memory for now)
  async getArchitectureElements(): Promise<ArchitectureElement[]> {
    // For now, fallback to memory storage for these features
    const memStorage = new MemStorage();
    return memStorage.getArchitectureElements();
  }

  async getArchitectureElementsByCategory(category: string): Promise<ArchitectureElement[]> {
    const memStorage = new MemStorage();
    return memStorage.getArchitectureElementsByCategory(category);
  }

  async getArchitectureElementsByFramework(framework: string): Promise<ArchitectureElement[]> {
    const memStorage = new MemStorage();
    return memStorage.getArchitectureElementsByFramework(framework);
  }

  async createArchitectureElement(element: InsertArchitectureElement): Promise<ArchitectureElement> {
    const memStorage = new MemStorage();
    return memStorage.createArchitectureElement(element);
  }

  // Recent Elements (stub implementations)
  async getRecentElementsByUser(userId: string): Promise<RecentElement[]> {
    const memStorage = new MemStorage();
    return memStorage.getRecentElementsByUser(userId);
  }

  async addRecentElement(recentElement: InsertRecentElement): Promise<RecentElement> {
    const memStorage = new MemStorage();
    return memStorage.addRecentElement(recentElement);
  }

  // Knowledge Base Pages - Using Database
  async getAllKnowledgeBasePages(): Promise<KnowledgeBasePage[]> {
    return await db.select().from(schema.knowledgeBasePages);
  }

  async getRootKnowledgeBasePages(): Promise<KnowledgeBasePage[]> {
    return await db.select()
      .from(schema.knowledgeBasePages)
      .where(eq(schema.knowledgeBasePages.parentId, ''));
  }

  async getChildKnowledgeBasePages(parentId: string): Promise<KnowledgeBasePage[]> {
    return await db.select()
      .from(schema.knowledgeBasePages)
      .where(eq(schema.knowledgeBasePages.parentId, parentId));
  }

  async getKnowledgeBasePage(id: string): Promise<KnowledgeBasePage | undefined> {
    const [page] = await db.select()
      .from(schema.knowledgeBasePages)
      .where(eq(schema.knowledgeBasePages.id, id));
    return page || undefined;
  }

  async getKnowledgeBasePagesByCategory(category: string): Promise<KnowledgeBasePage[]> {
    return await db.select()
      .from(schema.knowledgeBasePages)
      .where(eq(schema.knowledgeBasePages.category, category));
  }

  async searchKnowledgeBasePages(query: string): Promise<KnowledgeBasePage[]> {
    // Simple text search implementation
    const allPages = await db.select().from(schema.knowledgeBasePages);
    return allPages.filter(page => 
      page.title.toLowerCase().includes(query.toLowerCase()) ||
      page.content.toLowerCase().includes(query.toLowerCase())
    );
  }

  async createKnowledgeBasePage(pageData: InsertKnowledgeBasePage): Promise<KnowledgeBasePage> {
    const [page] = await db
      .insert(schema.knowledgeBasePages)
      .values(pageData)
      .returning();
    return page;
  }

  async updateKnowledgeBasePage(id: string, updates: Partial<KnowledgeBasePage>): Promise<KnowledgeBasePage | undefined> {
    const [updatedPage] = await db
      .update(schema.knowledgeBasePages)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(schema.knowledgeBasePages.id, id))
      .returning();
    return updatedPage || undefined;
  }

  async deleteKnowledgeBasePage(id: string): Promise<boolean> {
    const result = await db
      .delete(schema.knowledgeBasePages)
      .where(eq(schema.knowledgeBasePages.id, id));
    return result.rowCount > 0;
  }

  async getPageBreadcrumbs(id: string): Promise<{ id: string; title: string; path: string }[]> {
    // Simple breadcrumb implementation
    const page = await this.getKnowledgeBasePage(id);
    if (!page) return [];
    
    const breadcrumbs = [{ id: page.id, title: page.title, path: `/knowledge-base/${page.id}` }];
    
    if (page.parentId) {
      const parentBreadcrumbs = await this.getPageBreadcrumbs(page.parentId);
      return [...parentBreadcrumbs, ...breadcrumbs];
    }
    
    return breadcrumbs;
  }

  async moveKnowledgeBasePage(id: string, newParentId: string | null, newOrder?: number): Promise<boolean> {
    const updateData: Partial<KnowledgeBasePage> = {
      parentId: newParentId || '',
      updatedAt: new Date()
    };
    
    if (newOrder !== undefined) {
      updateData.order = newOrder;
    }
    
    const [updatedPage] = await db
      .update(schema.knowledgeBasePages)
      .set(updateData)
      .where(eq(schema.knowledgeBasePages.id, id))
      .returning();
    
    return !!updatedPage;
  }

  // Tasks - Using Database
  async getAllTasks(): Promise<Task[]> {
    const tasks = await db.select().from(schema.tasks);
    return tasks.map(task => ({
      ...task,
      completed: Boolean(task.completed),
      abilities: Array.isArray(task.abilities) ? task.abilities : []
    }));
  }

  async getTask(id: string): Promise<Task | undefined> {
    const [task] = await db.select()
      .from(schema.tasks)
      .where(eq(schema.tasks.id, id));
    
    if (!task) return undefined;
    
    return {
      ...task,
      completed: Boolean(task.completed),
      abilities: Array.isArray(task.abilities) ? task.abilities : []
    };
  }

  async createTask(taskData: InsertTask): Promise<Task> {
    const [task] = await db
      .insert(schema.tasks)
      .values({
        ...taskData,
        completed: taskData.completed ? 1 : 0,
        abilities: JSON.stringify(taskData.abilities || []),
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    
    return {
      ...task,
      completed: Boolean(task.completed),
      abilities: Array.isArray(task.abilities) ? task.abilities : []
    };
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task | undefined> {
    const updateData: any = {
      updatedAt: new Date()
    };
    
    // Handle text fields explicitly (no timestamp conversion)
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.priority !== undefined) updateData.priority = updates.priority;
    if (updates.category !== undefined) updateData.category = updates.category;
    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.assignee !== undefined) updateData.assignee = updates.assignee;
    
    // Handle date text fields as strings (no conversion)
    if (updates.startDate !== undefined) updateData.startDate = updates.startDate;
    if (updates.endDate !== undefined) updateData.endDate = updates.endDate;
    if (updates.dueDate !== undefined) updateData.dueDate = updates.dueDate;
    
    // Handle arrays and JSON fields
    if (updates.dependencies !== undefined) updateData.dependencies = updates.dependencies;
    if (updates.subtasks !== undefined) updateData.subtasks = updates.subtasks;
    if (updates.abilities !== undefined) updateData.abilities = updates.abilities;
    if (updates.comments !== undefined) updateData.comments = updates.comments;
    
    // Handle completed status
    if (updates.completed !== undefined) {
      updateData.completed = updates.completed ? 1 : 0;
      updateData.completedAt = updates.completed ? new Date() : null;
    }
    
    // Handle completedAt from status changes
    if (updates.completedAt === null) {
      updateData.completedAt = null;
    } else if (updates.completedAt) {
      updateData.completedAt = typeof updates.completedAt === 'string' ? new Date(updates.completedAt) : new Date(updates.completedAt);
    }

    const [updatedTask] = await db
      .update(schema.tasks)
      .set(updateData)
      .where(eq(schema.tasks.id, id))
      .returning();
    
    if (!updatedTask) return undefined;
    
    return {
      ...updatedTask,
      completed: Boolean(updatedTask.completed),
      abilities: Array.isArray(updatedTask.abilities) ? updatedTask.abilities : []
    };
  }

  async deleteTask(id: string): Promise<boolean> {
    const result = await db
      .delete(schema.tasks)
      .where(eq(schema.tasks.id, id));
    return result.rowCount > 0;
  }

  // User Stories Implementation - Database
  async getAllUserStories(): Promise<UserStory[]> {
    const stories = await db.select().from(schema.userStories);
    return stories;
  }

  async getUserStory(id: string): Promise<UserStory | undefined> {
    const [story] = await db.select()
      .from(schema.userStories)
      .where(eq(schema.userStories.id, id));
    return story || undefined;
  }

  async getUserStoriesByTask(taskId: string): Promise<UserStory[]> {
    const stories = await db.select()
      .from(schema.userStories)
      .where(eq(schema.userStories.parentTaskId, taskId));
    return stories;
  }

  async getUserStoriesByAssignee(assignee: string): Promise<UserStory[]> {
    // Note: This is a simplified query. In a real implementation, you might want to use OR conditions
    const stories = await db.select()
      .from(schema.userStories)
      .where(eq(schema.userStories.assignee, assignee));
    return stories;
  }

  async createUserStory(storyData: InsertUserStory): Promise<UserStory> {
    // Always generate server-side ID with collision detection
    const id = await generateUniqueUserStoryId(this);
    const [story] = await db
      .insert(schema.userStories)
      .values({
        ...storyData,
        id,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    return story;
  }

  async updateUserStory(id: string, updates: Partial<UserStory>): Promise<UserStory | undefined> {
    const [story] = await db
      .update(schema.userStories)
      .set({
        ...updates,
        updatedAt: new Date()
      })
      .where(eq(schema.userStories.id, id))
      .returning();
    return story || undefined;
  }

  async deleteUserStory(id: string): Promise<boolean> {
    const result = await db
      .delete(schema.userStories)
      .where(eq(schema.userStories.id, id));
    return result.rowCount! > 0;
  }

  async getUserStoriesByEpic(epicId: string): Promise<UserStory[]> {
    const stories = await db.select()
      .from(schema.userStories)
      .where(eq(schema.userStories.epicId, epicId));
    return stories;
  }

  // Epic CRUD Operations
  async getAllEpics(): Promise<Epic[]> {
    const epics = await db.select().from(schema.epics);
    return epics;
  }

  async getEpic(id: string): Promise<Epic | undefined> {
    const [epic] = await db.select()
      .from(schema.epics)
      .where(eq(schema.epics.id, id));
    return epic || undefined;
  }

  async getEpicsByValueStream(valueStream: string): Promise<Epic[]> {
    const epics = await db.select()
      .from(schema.epics)
      .where(eq(schema.epics.valueStream, valueStream));
    return epics;
  }

  async getEpicsByStatus(status: string): Promise<Epic[]> {
    const epics = await db.select()
      .from(schema.epics)
      .where(eq(schema.epics.status, status));
    return epics;
  }

  async createEpic(epicData: InsertEpic): Promise<Epic> {
    const [epic] = await db
      .insert(schema.epics)
      .values({
        ...epicData,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    return epic;
  }

  async updateEpic(id: string, updates: Partial<Epic>): Promise<Epic | undefined> {
    const [epic] = await db
      .update(schema.epics)
      .set({
        ...updates,
        updatedAt: new Date()
      })
      .where(eq(schema.epics.id, id))
      .returning();
    return epic || undefined;
  }

  async deleteEpic(id: string): Promise<boolean> {
    const result = await db
      .delete(schema.epics)
      .where(eq(schema.epics.id, id));
    return result.rowCount! > 0;
  }

  // Developer Integration Channels (stub implementations - using memory for demo)
  async getAllIntegrationChannels(): Promise<IntegrationChannel[]> {
    const memStorage = new MemStorage();
    return memStorage.getAllIntegrationChannels();
  }

  async getIntegrationChannel(id: string): Promise<IntegrationChannel | undefined> {
    const memStorage = new MemStorage();
    return memStorage.getIntegrationChannel(id);
  }

  async getIntegrationChannelByTool(toolId: string): Promise<IntegrationChannel | undefined> {
    const memStorage = new MemStorage();
    return memStorage.getIntegrationChannelByTool(toolId);
  }

  async getIntegrationChannelsByType(type: string): Promise<IntegrationChannel[]> {
    const memStorage = new MemStorage();
    return memStorage.getIntegrationChannelsByType(type);
  }

  async createIntegrationChannel(channel: InsertIntegrationChannel): Promise<IntegrationChannel> {
    const memStorage = new MemStorage();
    return memStorage.createIntegrationChannel(channel);
  }

  async updateIntegrationChannel(id: string, updates: Partial<IntegrationChannel>): Promise<IntegrationChannel | undefined> {
    const memStorage = new MemStorage();
    return memStorage.updateIntegrationChannel(id, updates);
  }

  async deleteIntegrationChannel(id: string): Promise<boolean> {
    const memStorage = new MemStorage();
    return memStorage.deleteIntegrationChannel(id);
  }

  // Object Sync Flows (stub implementations - using memory for demo)
  async getAllObjectSyncFlows(): Promise<ObjectSyncFlow[]> {
    const memStorage = new MemStorage();
    return memStorage.getAllObjectSyncFlows();
  }

  async getObjectSyncFlow(id: string): Promise<ObjectSyncFlow | undefined> {
    const memStorage = new MemStorage();
    return memStorage.getObjectSyncFlow(id);
  }

  async getObjectSyncFlowsByChannel(channelId: string): Promise<ObjectSyncFlow[]> {
    const memStorage = new MemStorage();
    return memStorage.getObjectSyncFlowsByChannel(channelId);
  }

  async getObjectSyncFlowsByState(state: string): Promise<ObjectSyncFlow[]> {
    const memStorage = new MemStorage();
    return memStorage.getObjectSyncFlowsByState(state);
  }

  async createObjectSyncFlow(flow: InsertObjectSyncFlow): Promise<ObjectSyncFlow> {
    const memStorage = new MemStorage();
    return memStorage.createObjectSyncFlow(flow);
  }

  async updateObjectSyncFlow(id: string, updates: Partial<ObjectSyncFlow>): Promise<ObjectSyncFlow | undefined> {
    const memStorage = new MemStorage();
    return memStorage.updateObjectSyncFlow(id, updates);
  }

  async updateSyncFlowState(id: string, state: string, stateVersion: number): Promise<ObjectSyncFlow | undefined> {
    const memStorage = new MemStorage();
    return memStorage.updateSyncFlowState(id, state, stateVersion);
  }

  async deleteObjectSyncFlow(id: string): Promise<boolean> {
    const memStorage = new MemStorage();
    return memStorage.deleteObjectSyncFlow(id);
  }

  // Application Settings (Database implementations)
  async getAllSettings(): Promise<ApplicationSetting[]> {
    const settings = await db.select().from(schema.applicationSettings);
    return settings;
  }

  async getSetting(key: string): Promise<ApplicationSetting | undefined> {
    const [setting] = await db
      .select()
      .from(schema.applicationSettings)
      .where(eq(schema.applicationSettings.key, key));
    return setting || undefined;
  }

  async getSettingsByCategory(category: string): Promise<ApplicationSetting[]> {
    const settings = await db
      .select()
      .from(schema.applicationSettings)
      .where(eq(schema.applicationSettings.category, category));
    return settings;
  }

  async createSetting(setting: InsertApplicationSetting): Promise<ApplicationSetting> {
    const [newSetting] = await db
      .insert(schema.applicationSettings)
      .values({
        ...setting,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    return newSetting;
  }

  async updateSetting(key: string, updates: Partial<ApplicationSetting>): Promise<ApplicationSetting | undefined> {
    const [updated] = await db
      .update(schema.applicationSettings)
      .set({
        ...updates,
        updatedAt: new Date()
      })
      .where(eq(schema.applicationSettings.key, key))
      .returning();
    return updated || undefined;
  }

  async deleteSetting(key: string): Promise<boolean> {
    const result = await db
      .delete(schema.applicationSettings)
      .where(eq(schema.applicationSettings.key, key));
    return result.rowCount! > 0;
  }
}

export const storage = new DatabaseStorage();
