import {
  type User,
  type InsertUser,
  type ArchitectureElement,
  type InsertArchitectureElement,
  type RecentElement,
  type InsertRecentElement,
  type KnowledgeBasePage,
  type InsertKnowledgeBasePage,
  type UserStory,
  type InsertUserStory,
  type Defect,
  type InsertDefect,
  type TestSuite,
  type InsertTestSuite,
  type TestCase,
  type InsertTestCase,
  type TestRun,
  type InsertTestRun,
  type TestResult,
  type InsertTestResult,
  type Epic,
  type InsertEpic,
  type Sprint,
  type InsertSprint,
  type IntegrationChannel,
  type InsertIntegrationChannel,
  type ObjectSyncFlow,
  type InsertObjectSyncFlow,
  type ApplicationSetting,
  type InsertApplicationSetting,
  type Application,
  type InsertApplication,
  type UpdateApplication,
  type ArchitecturalModel,
  type InsertArchitecturalModel,
  type ArchitecturalObject,
  type InsertArchitecturalObject,
  type ObjectConnection,
  type WikiPage,
  type InsertWikiPage,
  type UpdateWikiPage,
  type EntityMention,
  type InsertEntityMention,
  type CodeChange,
  type InsertCodeChange
} from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq, isNull, and, desc } from "drizzle-orm";
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

  // User Stories
  getAllUserStories(): Promise<UserStory[]>;
  getUserStory(id: string): Promise<UserStory | undefined>;
  getUserStoriesByAssignee(assignee: string): Promise<UserStory[]>;
  getUserStoriesByEpic(epicId: string): Promise<UserStory[]>;
  createUserStory(story: InsertUserStory): Promise<UserStory>;
  updateUserStory(id: string, updates: Partial<UserStory>): Promise<UserStory | undefined>;
  deleteUserStory(id: string): Promise<boolean>;

  // Defects - Quality assurance and bug tracking
  getAllDefects(): Promise<Defect[]>;
  getDefect(id: string): Promise<Defect | undefined>;
  getDefectsByStory(userStoryId: string): Promise<Defect[]>;
  getOpenDefectsByStory(userStoryId: string): Promise<Defect[]>;
  getDefectsBySeverity(severity: string): Promise<Defect[]>;
  getDefectsByAssignee(assignee: string): Promise<Defect[]>;
  createDefect(defect: InsertDefect): Promise<Defect>;
  updateDefect(id: string, updates: Partial<Defect>): Promise<Defect | undefined>;
  resolveDefect(id: string, resolution: string, rootCause?: string): Promise<Defect | undefined>;
  deleteDefect(id: string): Promise<boolean>;

  // Test Management - Test Suites, Cases, Runs, Results
  getAllTestSuites(): Promise<TestSuite[]>;
  getTestSuite(id: string): Promise<TestSuite | undefined>;
  getTestSuitesByModule(module: string): Promise<TestSuite[]>;
  getChildTestSuites(parentId: string): Promise<TestSuite[]>;
  createTestSuite(suite: InsertTestSuite): Promise<TestSuite>;
  updateTestSuite(id: string, updates: Partial<TestSuite>): Promise<TestSuite | undefined>;
  deleteTestSuite(id: string): Promise<boolean>;

  getAllTestCases(): Promise<TestCase[]>;
  getTestCase(id: string): Promise<TestCase | undefined>;
  getTestCasesBySuite(suiteId: string): Promise<TestCase[]>;
  getTestCasesByStory(storyId: string): Promise<TestCase[]>;
  createTestCase(testCase: InsertTestCase): Promise<TestCase>;
  updateTestCase(id: string, updates: Partial<TestCase>): Promise<TestCase | undefined>;
  deleteTestCase(id: string): Promise<boolean>;
  linkTestCaseToStory(testCaseId: string, storyId: string): Promise<boolean>;
  unlinkTestCaseFromStory(testCaseId: string, storyId: string): Promise<boolean>;

  getAllTestRuns(): Promise<TestRun[]>;
  getTestRun(id: string): Promise<TestRun | undefined>;
  getTestRunsBySuite(suiteId: string): Promise<TestRun[]>;
  createTestRun(testRun: InsertTestRun): Promise<TestRun>;
  updateTestRun(id: string, updates: Partial<TestRun>): Promise<TestRun | undefined>;
  completeTestRun(id: string): Promise<TestRun | undefined>;
  deleteTestRun(id: string): Promise<boolean>;

  getAllTestResults(): Promise<TestResult[]>;
  getTestResult(id: string): Promise<TestResult | undefined>;
  getTestResultsByRun(runId: string): Promise<TestResult[]>;
  getTestResultsByCase(caseId: string): Promise<TestResult[]>;
  createTestResult(result: InsertTestResult): Promise<TestResult>;
  updateTestResult(id: string, updates: Partial<TestResult>): Promise<TestResult | undefined>;
  deleteTestResult(id: string): Promise<boolean>;
  linkTestResultToDefect(resultId: string, defectId: string): Promise<boolean>;

  // Epics - Enterprise Architecture Value Streams
  getAllEpics(): Promise<Epic[]>;
  getEpic(id: string): Promise<Epic | undefined>;
  getEpicsByValueStream(valueStream: string): Promise<Epic[]>;
  getEpicsByStatus(status: string): Promise<Epic[]>;
  createEpic(epic: InsertEpic): Promise<Epic>;
  updateEpic(id: string, updates: Partial<Epic>): Promise<Epic | undefined>;
  deleteEpic(id: string): Promise<boolean>;

  // Sprints - Agile Sprint Management (US-PLAN-101)
  getAllSprints(): Promise<Sprint[]>;
  getSprint(id: string): Promise<Sprint | undefined>;
  getSprintsByStatus(status: string): Promise<Sprint[]>;
  getActiveSprint(): Promise<Sprint | undefined>;
  createSprint(sprint: InsertSprint): Promise<Sprint>;
  updateSprint(id: string, updates: Partial<Sprint>): Promise<Sprint | undefined>;
  deleteSprint(id: string): Promise<boolean>;
  recalculateSprintPoints(sprintId: string): Promise<Sprint | undefined>;

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

  // Applications - APM/CMDB
  getAllApplications(): Promise<Application[]>;
  getApplication(id: string): Promise<Application | undefined>;
  getApplicationsByStatus(status: string): Promise<Application[]>;
  getApplicationsByType(type: string): Promise<Application[]>;
  getApplicationsByOwner(owner: string): Promise<Application[]>;
  getApplicationsByTeam(team: string): Promise<Application[]>;
  searchApplications(query: string): Promise<Application[]>;
  createApplication(application: InsertApplication): Promise<Application>;
  updateApplication(id: string, updates: UpdateApplication): Promise<Application | undefined>;
  deleteApplication(id: string): Promise<boolean>;

  // Jira Integration - Native bi-directional sync
  getJiraWebhookEventByIdempotency(idempotencyKey: string): Promise<any | undefined>;
  createJiraWebhookEvent(event: any): Promise<string>;
  updateJiraWebhookEvent(id: string, updates: any): Promise<void>;
  getJiraMappingByArkhitektonId(arkhitektonId: string): Promise<any | undefined>;
  getJiraMappingByIssueKey(jiraIssueKey: string): Promise<any | undefined>;
  createJiraMapping(mapping: any): Promise<any>;
  createJiraSyncLog(log: any): Promise<void>;

  getJiraSyncStats(): Promise<any>;

  // Wiki Pages - Knowledge Core
  getAllWikiPages(): Promise<WikiPage[]>;
  getRootWikiPages(): Promise<WikiPage[]>;
  getChildWikiPages(parentId: string): Promise<WikiPage[]>;
  getWikiPage(id: string): Promise<WikiPage | undefined>;
  getWikiPagesByCategory(category: string): Promise<WikiPage[]>;
  getWikiPagesByStatus(status: string): Promise<WikiPage[]>;
  searchWikiPages(query: string): Promise<WikiPage[]>;
  createWikiPage(page: InsertWikiPage): Promise<WikiPage>;
  updateWikiPage(id: string, updates: UpdateWikiPage): Promise<WikiPage | undefined>;
  deleteWikiPage(id: string): Promise<boolean>;
  duplicateWikiPage(id: string): Promise<WikiPage | undefined>;
  moveWikiPage(id: string, newParentId: string | null, newSortOrder?: number): Promise<boolean>;
  incrementWikiPageViews(id: string): Promise<void>;
  saveWikiPageDraft(id: string, content: any): Promise<void>;
  getWikiPageDraft(id: string): Promise<any | null>;

  // Entity Mentions - Semantic Linking
  getEntityMentionsByPage(pageId: string): Promise<EntityMention[]>;
  getEntityMentionsByEntity(entityType: string, entityId: string): Promise<EntityMention[]>;
  createEntityMention(mention: InsertEntityMention): Promise<EntityMention>;
  updateEntityMentionStatus(entityType: string, entityId: string, newStatus: string): Promise<void>;
  deleteEntityMentionsByPage(pageId: string): Promise<void>;

  // Code Changes - Link PRs, Commits, Branches to Work Items
  getCodeChangesByEntity(entityType: string, entityId: string): Promise<CodeChange[]>;
  getCodeChangesByRepository(repository: string): Promise<CodeChange[]>;
  getCodeChangeByExternalId(externalId: string): Promise<CodeChange | undefined>;
  createCodeChange(change: InsertCodeChange): Promise<CodeChange>;
  updateCodeChange(id: string, updates: Partial<CodeChange>): Promise<CodeChange | undefined>;
  deleteCodeChange(id: string): Promise<boolean>;
  getRecentCodeChanges(limit?: number): Promise<CodeChange[]>;

  // Architectural Models
  getArchitecturalModels(): Promise<ArchitecturalModel[]>;
  getArchitecturalModel(id: string): Promise<ArchitecturalModel | undefined>;
  createArchitecturalModel(model: InsertArchitecturalModel): Promise<ArchitecturalModel>;
  updateArchitecturalModel(id: string, updates: Partial<ArchitecturalModel>): Promise<ArchitecturalModel | undefined>;

  // Architectural Objects
  getArchitecturalObjects(modelId: string): Promise<ArchitecturalObject[]>;
  createArchitecturalObject(object: InsertArchitecturalObject): Promise<ArchitecturalObject>;
  updateArchitecturalObject(id: string, updates: Partial<ArchitecturalObject>): Promise<ArchitecturalObject | undefined>;

  // Object Connections
  getObjectConnections(modelId: string): Promise<ObjectConnection[]>;
  createObjectConnection(connection: any): Promise<ObjectConnection>;
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
  private userStories: Map<string, UserStory>;
  private defects: Map<string, Defect>;
  private testSuites: Map<string, TestSuite>;
  private testCases: Map<string, TestCase>;
  private testRuns: Map<string, TestRun>;
  private testResults: Map<string, TestResult>;
  private epics: Map<string, Epic>;
  private integrationChannels: Map<string, IntegrationChannel>;
  private objectSyncFlows: Map<string, ObjectSyncFlow>;
  private applicationSettings: Map<string, ApplicationSetting>;
  private architecturalModels: Map<string, ArchitecturalModel>;
  private architecturalObjects: Map<string, ArchitecturalObject>;
  private objectConnections: Map<string, ObjectConnection>;
  private applications: Map<string, Application>;


  constructor() {
    this.users = new Map();
    this.architectureElements = new Map();
    this.recentElements = new Map();
    this.knowledgeBasePages = new Map();
    this.applicationSettings = new Map();
    this.userStories = new Map();
    this.defects = new Map();
    this.testSuites = new Map();
    this.testCases = new Map();
    this.testRuns = new Map();
    this.testResults = new Map();
    this.epics = new Map();
    this.integrationChannels = new Map();
    this.objectSyncFlows = new Map();
    this.architecturalModels = new Map();
    this.architecturalObjects = new Map();
    this.objectConnections = new Map();
    this.applications = new Map();


    // Initialize with some sample architecture elements
    this.initializeArchitectureElements();
    // Initialize with sample knowledge base pages
    this.initializeKnowledgeBasePages();
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
        framework: (element.framework as string) || 'archimate',
        vendor: element.vendor || null,
        usageGuidelines: element.usageGuidelines || null,
        iconName: element.iconName || null,
        relationships: (element.relationships as any) || [],
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

  // User Stories Implementation
  async getAllUserStories(): Promise<UserStory[]> {
    return Array.from(this.userStories.values());
  }

  async getUserStory(id: string): Promise<UserStory | undefined> {
    return this.userStories.get(id);
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

  // Defect CRUD Operations
  async getAllDefects(): Promise<Defect[]> {
    return Array.from(this.defects.values());
  }

  async getDefect(id: string): Promise<Defect | undefined> {
    return this.defects.get(id);
  }

  async getDefectsByStory(userStoryId: string): Promise<Defect[]> {
    return Array.from(this.defects.values()).filter(defect => defect.userStoryId === userStoryId);
  }

  async getOpenDefectsByStory(userStoryId: string): Promise<Defect[]> {
    return Array.from(this.defects.values()).filter(
      defect => defect.userStoryId === userStoryId &&
        defect.status !== 'resolved' &&
        defect.status !== 'closed' &&
        defect.status !== 'rejected'
    );
  }

  async getDefectsBySeverity(severity: string): Promise<Defect[]> {
    return Array.from(this.defects.values()).filter(defect => defect.severity === severity);
  }

  async getDefectsByAssignee(assignee: string): Promise<Defect[]> {
    return Array.from(this.defects.values()).filter(defect => defect.assignedTo === assignee);
  }

  async createDefect(defectData: InsertDefect): Promise<Defect> {
    const id = randomUUID();
    const defect: Defect = {
      ...defectData,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      resolvedAt: null
    };
    this.defects.set(id, defect);
    return defect;
  }

  async updateDefect(id: string, updates: Partial<Defect>): Promise<Defect | undefined> {
    const defect = this.defects.get(id);
    if (!defect) return undefined;

    const updatedDefect: Defect = {
      ...defect,
      ...updates,
      updatedAt: new Date()
    };
    this.defects.set(id, updatedDefect);
    return updatedDefect;
  }

  async resolveDefect(id: string, resolution: string, rootCause?: string): Promise<Defect | undefined> {
    const defect = this.defects.get(id);
    if (!defect) return undefined;

    const resolvedDefect: Defect = {
      ...defect,
      status: 'resolved',
      resolution,
      rootCause: rootCause || defect.rootCause,
      resolvedAt: new Date(),
      updatedAt: new Date()
    };
    this.defects.set(id, resolvedDefect);
    return resolvedDefect;
  }

  async deleteDefect(id: string): Promise<boolean> {
    return this.defects.delete(id);
  }

  // Test Management - Stub implementations (not persisted in memory)
  async getAllTestSuites(): Promise<TestSuite[]> {
    return Array.from(this.testSuites.values());
  }

  async getTestSuite(id: string): Promise<TestSuite | undefined> {
    return this.testSuites.get(id);
  }

  async getTestSuitesByModule(module: string): Promise<TestSuite[]> {
    return Array.from(this.testSuites.values()).filter(s => s.module === module);
  }

  async getChildTestSuites(parentId: string): Promise<TestSuite[]> {
    return Array.from(this.testSuites.values()).filter(s => s.parentSuiteId === parentId);
  }

  async createTestSuite(suite: InsertTestSuite): Promise<TestSuite> {
    const id = `TS-${String(this.testSuites.size + 1).padStart(3, '0')}`;
    const newSuite: TestSuite = {
      ...suite,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    } as TestSuite;
    this.testSuites.set(id, newSuite);
    return newSuite;
  }

  async updateTestSuite(id: string, updates: Partial<TestSuite>): Promise<TestSuite | undefined> {
    const suite = this.testSuites.get(id);
    if (!suite) return undefined;
    const updated = { ...suite, ...updates, updatedAt: new Date() };
    this.testSuites.set(id, updated);
    return updated;
  }

  async deleteTestSuite(id: string): Promise<boolean> {
    return this.testSuites.delete(id);
  }

  async getAllTestCases(): Promise<TestCase[]> {
    return Array.from(this.testCases.values());
  }

  async getTestCase(id: string): Promise<TestCase | undefined> {
    return this.testCases.get(id);
  }

  async getTestCasesBySuite(suiteId: string): Promise<TestCase[]> {
    return Array.from(this.testCases.values()).filter(c => c.suiteId === suiteId);
  }

  async getTestCasesByStory(storyId: string): Promise<TestCase[]> {
    // Note: MemStorage doesn't support junction table queries
    return [];
  }

  async createTestCase(testCase: InsertTestCase): Promise<TestCase> {
    const existingCasesInSuite = await this.getTestCasesBySuite(testCase.suiteId);
    const id = `${testCase.suiteId}-${String(existingCasesInSuite.length + 1).padStart(2, '0')}`;
    const newCase: TestCase = {
      ...testCase,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    } as TestCase;
    this.testCases.set(id, newCase);
    return newCase;
  }

  async updateTestCase(id: string, updates: Partial<TestCase>): Promise<TestCase | undefined> {
    const testCase = this.testCases.get(id);
    if (!testCase) return undefined;
    const updated = { ...testCase, ...updates, updatedAt: new Date() };
    this.testCases.set(id, updated);
    return updated;
  }

  async deleteTestCase(id: string): Promise<boolean> {
    return this.testCases.delete(id);
  }

  async linkTestCaseToStory(testCaseId: string, storyId: string): Promise<boolean> {
    // MemStorage doesn't persist junction table data
    return true;
  }

  async unlinkTestCaseFromStory(testCaseId: string, storyId: string): Promise<boolean> {
    return true;
  }

  async getAllTestRuns(): Promise<TestRun[]> {
    return Array.from(this.testRuns.values());
  }

  async getTestRun(id: string): Promise<TestRun | undefined> {
    return this.testRuns.get(id);
  }

  async getTestRunsBySuite(suiteId: string): Promise<TestRun[]> {
    return Array.from(this.testRuns.values()).filter(r => r.suiteId === suiteId);
  }

  async createTestRun(testRun: InsertTestRun): Promise<TestRun> {
    const id = `TR-${String(this.testRuns.size + 1).padStart(3, '0')}`;
    const newRun: TestRun = {
      ...testRun,
      id,
      startedAt: new Date(),
      createdAt: new Date()
    } as TestRun;
    this.testRuns.set(id, newRun);
    return newRun;
  }

  async updateTestRun(id: string, updates: Partial<TestRun>): Promise<TestRun | undefined> {
    const run = this.testRuns.get(id);
    if (!run) return undefined;
    const updated = { ...run, ...updates };
    this.testRuns.set(id, updated);
    return updated;
  }

  async completeTestRun(id: string): Promise<TestRun | undefined> {
    return this.updateTestRun(id, { status: 'completed', completedAt: new Date() });
  }

  async deleteTestRun(id: string): Promise<boolean> {
    return this.testRuns.delete(id);
  }

  async getAllTestResults(): Promise<TestResult[]> {
    return Array.from(this.testResults.values());
  }

  async getTestResult(id: string): Promise<TestResult | undefined> {
    return this.testResults.get(id);
  }

  async getTestResultsByRun(runId: string): Promise<TestResult[]> {
    return Array.from(this.testResults.values()).filter(r => r.runId === runId);
  }

  async getTestResultsByCase(caseId: string): Promise<TestResult[]> {
    return Array.from(this.testResults.values()).filter(r => r.caseId === caseId);
  }

  async createTestResult(result: InsertTestResult): Promise<TestResult> {
    const id = crypto.randomUUID();
    const newResult: TestResult = {
      ...result,
      id,
      createdAt: new Date()
    } as TestResult;
    this.testResults.set(id, newResult);
    return newResult;
  }

  async updateTestResult(id: string, updates: Partial<TestResult>): Promise<TestResult | undefined> {
    const result = this.testResults.get(id);
    if (!result) return undefined;
    const updated = { ...result, ...updates };
    this.testResults.set(id, updated);
    return updated;
  }

  async deleteTestResult(id: string): Promise<boolean> {
    return this.testResults.delete(id);
  }

  async linkTestResultToDefect(resultId: string, defectId: string): Promise<boolean> {
    return true;
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

  // Sprint CRUD Operations (stub for MemStorage)
  private sprints: Map<string, Sprint> = new Map();

  async getAllSprints(): Promise<Sprint[]> {
    return Array.from(this.sprints.values());
  }

  async getSprint(id: string): Promise<Sprint | undefined> {
    return this.sprints.get(id);
  }

  async getSprintsByStatus(status: string): Promise<Sprint[]> {
    return Array.from(this.sprints.values()).filter(s => s.status === status);
  }

  async getActiveSprint(): Promise<Sprint | undefined> {
    return Array.from(this.sprints.values()).find(s => s.status === 'active');
  }

  async createSprint(sprintData: InsertSprint): Promise<Sprint> {
    const id = `SPRINT-${Date.now().toString().slice(-7)}`;
    const sprint: Sprint = {
      id,
      ...sprintData,
      committedPoints: 0,
      completedPoints: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.sprints.set(id, sprint);
    return sprint;
  }

  async updateSprint(id: string, updates: Partial<Sprint>): Promise<Sprint | undefined> {
    const sprint = this.sprints.get(id);
    if (!sprint) return undefined;
    const updated = { ...sprint, ...updates, updatedAt: new Date() };
    this.sprints.set(id, updated);
    return updated;
  }

  async deleteSprint(id: string): Promise<boolean> {
    return this.sprints.delete(id);
  }

  async recalculateSprintPoints(sprintId: string): Promise<Sprint | undefined> {
    const sprint = this.sprints.get(sprintId);
    if (!sprint) return undefined;
    // Stub: would calculate points from stories
    return sprint;
  }

  // Initialize sample user stories
  private async initializeSampleUserStories() {
    const sampleStories: InsertUserStory[] = [
      {
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

    sampleIntegrationChannels.forEach(sampleChannel => {
      const id = randomUUID();
      const fullChannel: IntegrationChannel = {
        ...sampleChannel,
        id,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.integrationChannels.set(id, fullChannel);

      // Create sample sync flows for each channel
      const flowId = randomUUID();
      const sampleSyncFlow: InsertObjectSyncFlow = {
        name: `${sampleChannel.name} Object Sync`,
        description: `Git-like object synchronization for ${sampleChannel.name}`,
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
            action: 'updated'
          }
        ]
      };

      // Add flow to channel capabilities if not present
      const channel = this.integrationChannels.get(id);
      if (channel) {
        if (!channel.capabilities) channel.capabilities = [];
        if (!channel.capabilities.includes('model_sync')) {
          channel.capabilities.push('model_sync');
        }
      }

      this.objectSyncFlows.set(flowId, sampleSyncFlow as ObjectSyncFlow);
    });
  }

  // Architectural Models
  async getArchitecturalModels(): Promise<ArchitecturalModel[]> {
    return Array.from(this.architecturalModels.values());
  }

  async getArchitecturalModel(id: string): Promise<ArchitecturalModel | undefined> {
    return this.architecturalModels.get(id);
  }

  async createArchitecturalModel(modelData: InsertArchitecturalModel): Promise<ArchitecturalModel> {
    const id = randomUUID();
    const model: ArchitecturalModel = {
      ...modelData,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      // Ensure defaults for JSONB fields
      stakeholders: (modelData.stakeholders as any) || [],
      canvasData: (modelData.canvasData as any) || { objects: [], connections: [], viewport: { x: 0, y: 0, zoom: 1 }, layouts: [] },
      documentationPages: (modelData.documentationPages as any) || [],
      metrics: (modelData.metrics as any) || {},
      externalRefs: (modelData.externalRefs as any) || {},
      version: modelData.version || "1.0.0",
      state: modelData.state || "master",
      status: modelData.status || "active",
      parentModelId: modelData.parentModelId || null
    };
    this.architecturalModels.set(id, model);
    return model;
  }

  async updateArchitecturalModel(id: string, updates: Partial<ArchitecturalModel>): Promise<ArchitecturalModel | undefined> {
    const existing = this.architecturalModels.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...updates, updatedAt: new Date() };
    this.architecturalModels.set(id, updated);
    return updated;
  }

  // Architectural Objects
  async getArchitecturalObjects(modelId: string): Promise<ArchitecturalObject[]> {
    return Array.from(this.architecturalObjects.values()).filter(o => o.modelId === modelId);
  }

  async createArchitecturalObject(objectData: InsertArchitecturalObject): Promise<ArchitecturalObject> {
    const id = randomUUID();
    const object: ArchitecturalObject = {
      ...objectData,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      // Ensure defaults
      semantics: (objectData.semantics as any) || { purpose: "", responsibilities: [], constraints: [], patterns: [] },
      lifecycle: (objectData.lifecycle as any) || { state: "draft", milestones: [], decisions: [], changes: [] },
      metrics: (objectData.metrics as any) || {},
      implementation: (objectData.implementation as any) || {},
      metadata: (objectData.metadata as any) || {}
    };
    this.architecturalObjects.set(id, object);
    return object;
  }

  async updateArchitecturalObject(id: string, updates: Partial<ArchitecturalObject>): Promise<ArchitecturalObject | undefined> {
    const existing = this.architecturalObjects.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...updates, updatedAt: new Date() };
    this.architecturalObjects.set(id, updated);
    return updated;
  }

  // Object Connections
  async getObjectConnections(modelId: string): Promise<ObjectConnection[]> {
    // Find objects in the model
    const modelObjectIds = new Set(
      Array.from(this.architecturalObjects.values())
        .filter(o => o.modelId === modelId)
        .map(o => o.id)
    );

    // Return connections where both source and target are in the model
    return Array.from(this.objectConnections.values()).filter(c =>
      modelObjectIds.has(c.sourceObjectId) && modelObjectIds.has(c.targetObjectId)
    );
  }

  async createObjectConnection(connData: any): Promise<ObjectConnection> {
    const id = randomUUID();
    const conn: ObjectConnection = {
      ...connData,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      properties: connData.properties || {},
      visual: connData.visual || { path: [], styling: {}, labels: [] }
    };
    this.objectConnections.set(id, conn);
    return conn;
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

  // Applications
  async getAllApplications(): Promise<Application[]> { return Array.from(this.applications.values()); }
  async getApplication(id: string): Promise<Application | undefined> { return this.applications.get(id); }
  async getApplicationsByStatus(status: string): Promise<Application[]> { return Array.from(this.applications.values()).filter(a => a.status === status); }
  async getApplicationsByType(type: string): Promise<Application[]> { return Array.from(this.applications.values()).filter(a => a.type === type); }
  async getApplicationsByOwner(owner: string): Promise<Application[]> { return Array.from(this.applications.values()).filter(a => a.owner === owner); }
  async getApplicationsByTeam(team: string): Promise<Application[]> { return Array.from(this.applications.values()).filter(a => a.team === team); }
  async searchApplications(query: string): Promise<Application[]> { return Array.from(this.applications.values()).filter(a => a.name.includes(query)); }
  async createApplication(app: InsertApplication): Promise<Application> {
    const id = randomUUID();
    const newApp: Application = { ...app, id, createdAt: new Date(), updatedAt: new Date(), description: app.description || null, owner: app.owner || null, team: app.team || null, status: app.status || 'active', type: app.type || 'web_application', hostingEnvironment: null, region: null, architecture: null, businessCapabilities: [], criticality: app.criticality || 'medium', businessValue: null, technologyStack: {}, integrations: [], dependencies: [], metrics: {}, costCenter: null, annualCost: null, costBreakdown: {}, version: "1.0.0", deployedDate: null, retirementDate: null, repositoryUrl: null, documentationUrl: null, monitoringUrl: null, tags: (app.tags as any) || [], notes: null, stakeholders: (app.stakeholders as any) || [] };
    this.applications.set(id, newApp);
    return newApp;
  }
  async updateApplication(id: string, updates: UpdateApplication): Promise<Application | undefined> {
    const existing = this.applications.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...updates, updatedAt: new Date() };
    this.applications.set(id, updated);
    return updated;
  }
  async deleteApplication(id: string): Promise<boolean> { return this.applications.delete(id); }

  // Jira Integration (Stub)
  async getJiraWebhookEventByIdempotency(idempotencyKey: string): Promise<any | undefined> { return undefined; }
  async createJiraWebhookEvent(event: any): Promise<string> { return randomUUID(); }
  async updateJiraWebhookEvent(id: string, updates: any): Promise<void> { }
  async getJiraMappingByArkhitektonId(arkhitektonId: string): Promise<any | undefined> { return undefined; }
  async getJiraMappingByIssueKey(jiraIssueKey: string): Promise<any | undefined> { return undefined; }
  async createJiraMapping(mapping: any): Promise<any> { return mapping; }
  async createJiraSyncLog(log: any): Promise<void> { }
  async getJiraSyncStats(): Promise<any> { return { totalMappings: 0, activeSyncs: 0, errorSyncs: 0, totalSyncLogs: 0, successfulSyncs: 0, failedSyncs: 0, successRate: "0%" }; }

  // Wiki Drafts (Stub)
  async saveWikiPageDraft(id: string, content: any): Promise<void> { }
  async getWikiPageDraft(id: string): Promise<any | null> { return null; }
}


export const memStorage = new MemStorage();

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

  // Architectural Models (stub - using memory)
  async getArchitecturalModels(): Promise<ArchitecturalModel[]> { return memStorage.getArchitecturalModels(); }
  async getArchitecturalModel(id: string): Promise<ArchitecturalModel | undefined> { return memStorage.getArchitecturalModel(id); }
  async createArchitecturalModel(model: InsertArchitecturalModel): Promise<ArchitecturalModel> { return memStorage.createArchitecturalModel(model); }
  async updateArchitecturalModel(id: string, updates: Partial<ArchitecturalModel>): Promise<ArchitecturalModel | undefined> { return memStorage.updateArchitecturalModel(id, updates); }

  // Architectural Objects (stub)
  // Architectural Objects (stub)
  async getArchitecturalObjects(modelId: string): Promise<ArchitecturalObject[]> { return memStorage.getArchitecturalObjects(modelId); }
  async createArchitecturalObject(obj: InsertArchitecturalObject): Promise<ArchitecturalObject> { return memStorage.createArchitecturalObject(obj); }
  async updateArchitecturalObject(id: string, updates: Partial<ArchitecturalObject>): Promise<ArchitecturalObject | undefined> { return memStorage.updateArchitecturalObject(id, updates); }

  // Object Connections (stub)
  // Object Connections (stub)
  async getObjectConnections(modelId: string): Promise<ObjectConnection[]> { return memStorage.getObjectConnections(modelId); }
  async createObjectConnection(conn: any): Promise<ObjectConnection> { return memStorage.createObjectConnection(conn); }

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
      .where(isNull(schema.knowledgeBasePages.parentPageId));
  }

  async getChildKnowledgeBasePages(parentId: string): Promise<KnowledgeBasePage[]> {
    return await db.select()
      .from(schema.knowledgeBasePages)
      .where(eq(schema.knowledgeBasePages.parentPageId, parentId));
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
      .values({
        ...pageData,
        tags: (pageData.tags as any) || []
      })
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
      parentPageId: newParentId || null,
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
        githubCommits: (storyData.githubCommits as any) || [],
        labels: (storyData.labels as any) || [],
        screenshots: (storyData.screenshots as any) || [],
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    return story;
  }

  async updateUserStory(id: string, updates: Partial<UserStory>): Promise<UserStory | undefined> {
    // Auto-populate dates based on status changes (US-8KE9R60)
    const enrichedUpdates = { ...updates };
    
    if (updates.status) {
      // Get current story to check existing dates
      const existingStory = await this.getUserStory(id);
      
      if (existingStory) {
        // Auto-set startedAt when moving to in-progress (if not already set)
        if (updates.status === 'in-progress' && !existingStory.startedAt && !updates.startedAt) {
          enrichedUpdates.startedAt = new Date();
        }
        
        // Auto-set completedAt when moving to done (if not already set)
        if (updates.status === 'done' && !existingStory.completedAt && !updates.completedAt) {
          enrichedUpdates.completedAt = new Date();
        }
        
        // Clear completedAt if moving away from done (story reopened)
        if (updates.status !== 'done' && existingStory.status === 'done' && existingStory.completedAt) {
          enrichedUpdates.completedAt = null;
        }
      }
    }
    
    const [story] = await db
      .update(schema.userStories)
      .set({
        ...enrichedUpdates,
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

  // Defect CRUD Operations - Database
  async getAllDefects(): Promise<Defect[]> {
    const defects = await db.select().from(schema.defects);
    return defects;
  }

  async getDefect(id: string): Promise<Defect | undefined> {
    const [defect] = await db.select()
      .from(schema.defects)
      .where(eq(schema.defects.id, id));
    return defect || undefined;
  }

  async getDefectsByStory(userStoryId: string): Promise<Defect[]> {
    const defects = await db.select()
      .from(schema.defects)
      .where(eq(schema.defects.userStoryId, userStoryId));
    return defects;
  }

  async getOpenDefectsByStory(userStoryId: string): Promise<Defect[]> {
    const defects = await db.select()
      .from(schema.defects)
      .where(eq(schema.defects.userStoryId, userStoryId));

    return defects.filter(d =>
      d.status !== 'resolved' &&
      d.status !== 'closed' &&
      d.status !== 'rejected'
    );
  }

  async getDefectsBySeverity(severity: string): Promise<Defect[]> {
    const defects = await db.select()
      .from(schema.defects)
      .where(eq(schema.defects.severity, severity));
    return defects;
  }

  async getDefectsByAssignee(assignee: string): Promise<Defect[]> {
    const defects = await db.select()
      .from(schema.defects)
      .where(eq(schema.defects.assignedTo, assignee));
    return defects;
  }

  async createDefect(defectData: InsertDefect): Promise<Defect> {
    const [defect] = await db
      .insert(schema.defects)
      .values({
        ...defectData,
        githubCommits: (defectData.githubCommits as any) || [],
        createdAt: new Date(),
        updatedAt: new Date(),
        resolvedAt: null
      })
      .returning();
    return defect;
  }

  async updateDefect(id: string, updates: Partial<Defect>): Promise<Defect | undefined> {
    const [defect] = await db
      .update(schema.defects)
      .set({
        ...updates,
        updatedAt: new Date()
      })
      .where(eq(schema.defects.id, id))
      .returning();
    return defect || undefined;
  }

  async resolveDefect(id: string, resolution: string, rootCause?: string): Promise<Defect | undefined> {
    const [defect] = await db
      .update(schema.defects)
      .set({
        status: 'resolved',
        resolution,
        rootCause: rootCause || undefined,
        resolvedAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(schema.defects.id, id))
      .returning();
    return defect || undefined;
  }

  async deleteDefect(id: string): Promise<boolean> {
    const result = await db
      .delete(schema.defects)
      .where(eq(schema.defects.id, id));
    return result.rowCount! > 0;
  }

  // Test Suite CRUD Operations
  async getAllTestSuites(): Promise<TestSuite[]> {
    const suites = await db.select().from(schema.testSuites);
    return suites;
  }

  async getTestSuite(id: string): Promise<TestSuite | undefined> {
    const [suite] = await db.select()
      .from(schema.testSuites)
      .where(eq(schema.testSuites.id, id));
    return suite || undefined;
  }

  async getTestSuitesByModule(module: string): Promise<TestSuite[]> {
    const suites = await db.select()
      .from(schema.testSuites)
      .where(eq(schema.testSuites.module, module));
    return suites;
  }

  async getChildTestSuites(parentId: string): Promise<TestSuite[]> {
    const suites = await db.select()
      .from(schema.testSuites)
      .where(eq(schema.testSuites.parentSuiteId, parentId));
    return suites;
  }

  async createTestSuite(suite: InsertTestSuite): Promise<TestSuite> {
    // Generate ID: TS-001, TS-002, etc.
    const existingSuites = await this.getAllTestSuites();
    const nextNum = existingSuites.length + 1;
    const id = `TS-${String(nextNum).padStart(3, '0')}`;

    const [newSuite] = await db
      .insert(schema.testSuites)
      .values({ ...suite, id })
      .returning();
    return newSuite!;
  }

  async updateTestSuite(id: string, updates: Partial<TestSuite>): Promise<TestSuite | undefined> {
    const [suite] = await db
      .update(schema.testSuites)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(schema.testSuites.id, id))
      .returning();
    return suite || undefined;
  }

  async deleteTestSuite(id: string): Promise<boolean> {
    const result = await db
      .delete(schema.testSuites)
      .where(eq(schema.testSuites.id, id));
    return result.rowCount! > 0;
  }

  // Test Case CRUD Operations
  async getAllTestCases(): Promise<TestCase[]> {
    const cases = await db.select().from(schema.testCases);
    return cases;
  }

  async getTestCase(id: string): Promise<TestCase | undefined> {
    const [testCase] = await db.select()
      .from(schema.testCases)
      .where(eq(schema.testCases.id, id));
    return testCase || undefined;
  }

  async getTestCasesBySuite(suiteId: string): Promise<TestCase[]> {
    const cases = await db.select()
      .from(schema.testCases)
      .where(eq(schema.testCases.suiteId, suiteId));
    return cases;
  }

  async getTestCasesByStory(storyId: string): Promise<TestCase[]> {
    const cases = await db
      .select({ testCases: schema.testCases })
      .from(schema.testCases)
      .innerJoin(schema.testCaseStories, eq(schema.testCases.id, schema.testCaseStories.testCaseId))
      .where(eq(schema.testCaseStories.storyId, storyId));
    return cases.map(c => c.testCases);
  }

  async createTestCase(testCase: InsertTestCase): Promise<TestCase> {
    // Generate ID: TC-XXX-01, TC-XXX-02, etc.
    const existingCasesInSuite = await this.getTestCasesBySuite(testCase.suiteId);
    const nextNum = existingCasesInSuite.length + 1;
    const id = `${testCase.suiteId}-${String(nextNum).padStart(2, '0')}`;

    const [newCase] = await db
      .insert(schema.testCases)
      .values({ ...testCase, id })
      .returning();
    return newCase!;
  }

  async updateTestCase(id: string, updates: Partial<TestCase>): Promise<TestCase | undefined> {
    const [testCase] = await db
      .update(schema.testCases)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(schema.testCases.id, id))
      .returning();
    return testCase || undefined;
  }

  async deleteTestCase(id: string): Promise<boolean> {
    const result = await db
      .delete(schema.testCases)
      .where(eq(schema.testCases.id, id));
    return result.rowCount! > 0;
  }

  async linkTestCaseToStory(testCaseId: string, storyId: string): Promise<boolean> {
    try {
      await db.insert(schema.testCaseStories)
        .values({ testCaseId, storyId });
      return true;
    } catch (error) {
      return false; // Already exists or invalid IDs
    }
  }

  async unlinkTestCaseFromStory(testCaseId: string, storyId: string): Promise<boolean> {
    const result = await db
      .delete(schema.testCaseStories)
      .where(
        and(
          eq(schema.testCaseStories.testCaseId, testCaseId),
          eq(schema.testCaseStories.storyId, storyId)
        )
      );
    return result.rowCount! > 0;
  }

  // Test Run CRUD Operations
  async getAllTestRuns(): Promise<TestRun[]> {
    const runs = await db.select().from(schema.testRuns);
    return runs;
  }

  async getTestRun(id: string): Promise<TestRun | undefined> {
    const [run] = await db.select()
      .from(schema.testRuns)
      .where(eq(schema.testRuns.id, id));
    return run || undefined;
  }

  async getTestRunsBySuite(suiteId: string): Promise<TestRun[]> {
    const runs = await db.select()
      .from(schema.testRuns)
      .where(eq(schema.testRuns.suiteId, suiteId))
      .orderBy(desc(schema.testRuns.startedAt));
    return runs;
  }

  async createTestRun(testRun: InsertTestRun): Promise<TestRun> {
    // Generate ID: TR-001, TR-002, etc.
    const existingRuns = await this.getAllTestRuns();
    const nextNum = existingRuns.length + 1;
    const id = `TR-${String(nextNum).padStart(3, '0')}`;

    const [newRun] = await db
      .insert(schema.testRuns)
      .values({ ...testRun, id })
      .returning();
    return newRun!;
  }

  async updateTestRun(id: string, updates: Partial<TestRun>): Promise<TestRun | undefined> {
    const [run] = await db
      .update(schema.testRuns)
      .set(updates)
      .where(eq(schema.testRuns.id, id))
      .returning();
    return run || undefined;
  }

  async completeTestRun(id: string): Promise<TestRun | undefined> {
    const [run] = await db
      .update(schema.testRuns)
      .set({
        status: 'completed',
        completedAt: new Date()
      })
      .where(eq(schema.testRuns.id, id))
      .returning();
    return run || undefined;
  }

  async deleteTestRun(id: string): Promise<boolean> {
    const result = await db
      .delete(schema.testRuns)
      .where(eq(schema.testRuns.id, id));
    return result.rowCount! > 0;
  }

  // Test Result CRUD Operations
  async getAllTestResults(): Promise<TestResult[]> {
    const results = await db.select().from(schema.testResults);
    return results;
  }

  async getTestResult(id: string): Promise<TestResult | undefined> {
    const [result] = await db.select()
      .from(schema.testResults)
      .where(eq(schema.testResults.id, id));
    return result || undefined;
  }

  async getTestResultsByRun(runId: string): Promise<TestResult[]> {
    const results = await db.select()
      .from(schema.testResults)
      .where(eq(schema.testResults.runId, runId));
    return results;
  }

  async getTestResultsByCase(caseId: string): Promise<TestResult[]> {
    const results = await db.select()
      .from(schema.testResults)
      .where(eq(schema.testResults.caseId, caseId))
      .orderBy(desc(schema.testResults.executedAt));
    return results;
  }

  async createTestResult(result: InsertTestResult): Promise<TestResult> {
    // Generate ID: random UUID
    const id = crypto.randomUUID();

    const [newResult] = await db
      .insert(schema.testResults)
      .values({ ...result, id })
      .returning();
    return newResult!;
  }

  async updateTestResult(id: string, updates: Partial<TestResult>): Promise<TestResult | undefined> {
    const [result] = await db
      .update(schema.testResults)
      .set(updates)
      .where(eq(schema.testResults.id, id))
      .returning();
    return result || undefined;
  }

  async deleteTestResult(id: string): Promise<boolean> {
    const result = await db
      .delete(schema.testResults)
      .where(eq(schema.testResults.id, id));
    return result.rowCount! > 0;
  }

  async linkTestResultToDefect(resultId: string, defectId: string): Promise<boolean> {
    try {
      await db.insert(schema.testResultDefects)
        .values({ resultId, defectId });
      return true;
    } catch (error) {
      return false;
    }
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

  // Sprint CRUD Operations (US-PLAN-101)
  async getAllSprints(): Promise<Sprint[]> {
    const sprints = await db.select().from(schema.sprints).orderBy(desc(schema.sprints.startDate));
    return sprints;
  }

  async getSprint(id: string): Promise<Sprint | undefined> {
    const [sprint] = await db.select().from(schema.sprints).where(eq(schema.sprints.id, id));
    return sprint || undefined;
  }

  async getSprintsByStatus(status: string): Promise<Sprint[]> {
    const sprints = await db.select().from(schema.sprints).where(eq(schema.sprints.status, status));
    return sprints;
  }

  async getActiveSprint(): Promise<Sprint | undefined> {
    const [sprint] = await db.select().from(schema.sprints).where(eq(schema.sprints.status, 'active'));
    return sprint || undefined;
  }

  async createSprint(sprintData: InsertSprint): Promise<Sprint> {
    const id = `SPRINT-${Date.now().toString().slice(-7)}`;
    const [sprint] = await db
      .insert(schema.sprints)
      .values({
        ...sprintData,
        id,
        committedPoints: 0,
        completedPoints: 0,
      })
      .returning();
    return sprint;
  }

  async updateSprint(id: string, updates: Partial<Sprint>): Promise<Sprint | undefined> {
    const [sprint] = await db
      .update(schema.sprints)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(schema.sprints.id, id))
      .returning();
    return sprint || undefined;
  }

  async deleteSprint(id: string): Promise<boolean> {
    // First, unassign all stories from this sprint
    await db
      .update(schema.userStories)
      .set({ sprintId: null, status: 'backlog' })
      .where(eq(schema.userStories.sprintId, id));
    
    const result = await db
      .delete(schema.sprints)
      .where(eq(schema.sprints.id, id));
    return result.rowCount! > 0;
  }

  async recalculateSprintPoints(sprintId: string): Promise<Sprint | undefined> {
    // Get all stories in this sprint
    const stories = await db.select().from(schema.userStories).where(eq(schema.userStories.sprintId, sprintId));
    
    const committedPoints = stories.reduce((sum, s) => sum + (s.storyPoints || 0), 0);
    const completedPoints = stories
      .filter(s => s.status === 'done')
      .reduce((sum, s) => sum + (s.storyPoints || 0), 0);
    
    const [sprint] = await db
      .update(schema.sprints)
      .set({ committedPoints, completedPoints, updatedAt: new Date() })
      .where(eq(schema.sprints.id, sprintId))
      .returning();
    
    return sprint || undefined;
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

  // Applications - APM/CMDB
  async getAllApplications(): Promise<Application[]> {
    const applications = await db.select().from(schema.applications);
    return applications;
  }

  async getApplication(id: string): Promise<Application | undefined> {
    const [application] = await db
      .select()
      .from(schema.applications)
      .where(eq(schema.applications.id, id));
    return application || undefined;
  }

  async getApplicationsByStatus(status: string): Promise<Application[]> {
    const applications = await db
      .select()
      .from(schema.applications)
      .where(eq(schema.applications.status, status));
    return applications;
  }

  async getApplicationsByType(type: string): Promise<Application[]> {
    const applications = await db
      .select()
      .from(schema.applications)
      .where(eq(schema.applications.type, type));
    return applications;
  }

  async getApplicationsByOwner(owner: string): Promise<Application[]> {
    const applications = await db
      .select()
      .from(schema.applications)
      .where(eq(schema.applications.owner, owner));
    return applications;
  }

  async getApplicationsByTeam(team: string): Promise<Application[]> {
    const applications = await db
      .select()
      .from(schema.applications)
      .where(eq(schema.applications.team, team));
    return applications;
  }

  async searchApplications(query: string): Promise<Application[]> {
    const applications = await db.select().from(schema.applications);
    const searchLower = query.toLowerCase();
    return applications.filter(app =>
      app.name.toLowerCase().includes(searchLower) ||
      (app.description && app.description.toLowerCase().includes(searchLower)) ||
      (app.owner && app.owner.toLowerCase().includes(searchLower)) ||
      (app.team && app.team.toLowerCase().includes(searchLower))
    );
  }

  async createApplication(application: InsertApplication): Promise<Application> {
    const [newApp] = await db
      .insert(schema.applications)
      .values({
        ...application,
        tags: (application.tags as any) || [],
        stakeholders: (application.stakeholders as any) || [],
        businessCapabilities: (application.businessCapabilities as any) || [],
        technologyStack: (application.technologyStack as any) || {},
        integrations: (application.integrations as any) || [],
        metrics: (application.metrics as any) || {},
        costBreakdown: (application.costBreakdown as any) || {},
        dependencies: (application.dependencies as any) || [],
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    return newApp;
  }

  async updateApplication(id: string, updates: UpdateApplication): Promise<Application | undefined> {

    const [updated] = await db
      .update(schema.applications)
      .set({
        ...updates,
        tags: updates.tags ? ((updates.tags as any) || []) : undefined,
        stakeholders: updates.stakeholders ? ((updates.stakeholders as any) || []) : undefined,
        businessCapabilities: updates.businessCapabilities ? ((updates.businessCapabilities as any) || []) : undefined,
        technologyStack: updates.technologyStack ? ((updates.technologyStack as any) || {}) : undefined,
        integrations: updates.integrations ? ((updates.integrations as any) || []) : undefined,
        metrics: updates.metrics ? ((updates.metrics as any) || {}) : undefined,
        costBreakdown: updates.costBreakdown ? ((updates.costBreakdown as any) || {}) : undefined,
        dependencies: updates.dependencies ? ((updates.dependencies as any) || []) : undefined,
        screenshots: updates.screenshots ? ((updates.screenshots as any) || []) : undefined, // Added casting for screenshots
        updatedAt: new Date()
      })
      .where(eq(schema.applications.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteApplication(id: string): Promise<boolean> {
    const result = await db
      .delete(schema.applications)
      .where(eq(schema.applications.id, id));
    return result.rowCount! > 0;
  }

  // Jira Integration Methods
  async getJiraWebhookEventByIdempotency(idempotencyKey: string): Promise<any | undefined> {
    const [event] = await db
      .select()
      .from(schema.jiraWebhookEvents)
      .where(eq(schema.jiraWebhookEvents.idempotencyKey, idempotencyKey))
      .limit(1);
    return event || undefined;
  }

  async createJiraWebhookEvent(event: any): Promise<string> {
    const [newEvent] = await db
      .insert(schema.jiraWebhookEvents)
      .values({
        ...event,
        createdAt: new Date(),
        receivedAt: new Date()
      })
      .returning();
    return newEvent.id;
  }

  async updateJiraWebhookEvent(id: string, updates: any): Promise<void> {
    await db
      .update(schema.jiraWebhookEvents)
      .set(updates)
      .where(eq(schema.jiraWebhookEvents.id, id));
  }

  async getJiraMappingByArkhitektonId(arkhitektonId: string): Promise<any | undefined> {
    const [mapping] = await db
      .select()
      .from(schema.jiraIntegrationMappings)
      .where(eq(schema.jiraIntegrationMappings.arkhitektonId, arkhitektonId))
      .limit(1);
    return mapping || undefined;
  }

  async getJiraMappingByIssueKey(jiraIssueKey: string): Promise<any | undefined> {
    const [mapping] = await db
      .select()
      .from(schema.jiraIntegrationMappings)
      .where(eq(schema.jiraIntegrationMappings.jiraIssueKey, jiraIssueKey))
      .limit(1);
    return mapping || undefined;
  }

  async createJiraMapping(mapping: any): Promise<any> {
    const [newMapping] = await db
      .insert(schema.jiraIntegrationMappings)
      .values({
        ...mapping,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    return newMapping;
  }

  async createJiraSyncLog(log: any): Promise<void> {
    await db
      .insert(schema.jiraSyncLogs)
      .values({
        ...log,
        createdAt: new Date()
      });
  }

  async getJiraSyncStats(): Promise<any> {
    // Get total mappings
    const mappings = await db.select().from(schema.jiraIntegrationMappings);
    const syncLogs = await db.select().from(schema.jiraSyncLogs);

    const activeSyncs = mappings.filter(m => m.syncStatus === 'active').length;
    const errorSyncs = mappings.filter(m => m.syncStatus === 'error').length;
    const successfulSyncs = syncLogs.filter(l => l.status === 'success').length;
    const failedSyncs = syncLogs.filter(l => l.status === 'failed').length;

    return {
      totalMappings: mappings.length,
      activeSyncs,
      errorSyncs,
      totalSyncLogs: syncLogs.length,
      successfulSyncs,
      failedSyncs,
      successRate: syncLogs.length > 0 ? (successfulSyncs / syncLogs.length * 100).toFixed(2) + '%' : '0%'
    };
  }

  // ============================================================
  // WIKI PAGES - Knowledge Core (Phase 1)
  // ============================================================

  async getAllWikiPages(): Promise<WikiPage[]> {
    const pages = await db.select().from(schema.wikiPages);
    return pages;
  }

  async getRootWikiPages(): Promise<WikiPage[]> {
    const pages = await db
      .select()
      .from(schema.wikiPages)
      .where(isNull(schema.wikiPages.parentId))
      .orderBy(schema.wikiPages.sortOrder);
    return pages;
  }

  async getChildWikiPages(parentId: string): Promise<WikiPage[]> {
    const pages = await db
      .select()
      .from(schema.wikiPages)
      .where(eq(schema.wikiPages.parentId, parentId))
      .orderBy(schema.wikiPages.sortOrder);
    return pages;
  }

  async getWikiPage(id: string): Promise<WikiPage | undefined> {
    const [page] = await db
      .select()
      .from(schema.wikiPages)
      .where(eq(schema.wikiPages.id, id));
    return page || undefined;
  }

  async getWikiPagesByCategory(category: string): Promise<WikiPage[]> {
    const pages = await db
      .select()
      .from(schema.wikiPages)
      .where(eq(schema.wikiPages.category, category));
    return pages;
  }

  async getWikiPagesByStatus(status: string): Promise<WikiPage[]> {
    const pages = await db
      .select()
      .from(schema.wikiPages)
      .where(eq(schema.wikiPages.status, status));
    return pages;
  }

  async searchWikiPages(query: string): Promise<WikiPage[]> {
    // Basic search implementation - will be enhanced with full-text search in Phase 1
    const pages = await db.select().from(schema.wikiPages);
    const lowercaseQuery = query.toLowerCase();
    
    return pages.filter(page => 
      page.title.toLowerCase().includes(lowercaseQuery) ||
      (page.tags && page.tags.some((tag: string) => tag.toLowerCase().includes(lowercaseQuery)))
    );
  }

  async createWikiPage(pageData: InsertWikiPage): Promise<WikiPage> {
    const [page] = await db
      .insert(schema.wikiPages)
      .values({
        ...pageData,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return page;
  }

  async updateWikiPage(id: string, updates: UpdateWikiPage): Promise<WikiPage | undefined> {
    const [page] = await db
      .update(schema.wikiPages)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(schema.wikiPages.id, id))
      .returning();
    return page || undefined;
  }

  async deleteWikiPage(id: string): Promise<boolean> {
    const result = await db
      .delete(schema.wikiPages)
      .where(eq(schema.wikiPages.id, id));
    return true;
  }

  async duplicateWikiPage(id: string): Promise<WikiPage | undefined> {
    const original = await this.getWikiPage(id);
    if (!original) return undefined;

    const duplicate: InsertWikiPage = {
      title: `${original.title} (Copy)`,
      content: original.content,
      parentId: original.parentId,
      category: original.category,
      subcategory: original.subcategory,
      template: original.template,
      status: 'draft', // Always start as draft
      createdBy: original.createdBy,
      tags: original.tags,
      metadata: original.metadata,
    };

    return this.createWikiPage(duplicate);
  }

  async moveWikiPage(id: string, newParentId: string | null, newSortOrder?: number): Promise<boolean> {
    const updates: any = { parentId: newParentId };
    if (newSortOrder !== undefined) {
      updates.sortOrder = newSortOrder;
    }
    
    const result = await this.updateWikiPage(id, updates);
    return !!result;
  }

  async incrementWikiPageViews(id: string): Promise<void> {
    const page = await this.getWikiPage(id);
    if (page) {
      await db
        .update(schema.wikiPages)
        .set({ views: (page.views || 0) + 1 })
        .where(eq(schema.wikiPages.id, id));
    }
  }

  async saveWikiPageDraft(id: string, content: any): Promise<void> {
    await db
      .update(schema.wikiPages)
      .set({
        contentDraft: content,
        lastAutoSavedAt: new Date(),
      })
      .where(eq(schema.wikiPages.id, id));
  }

  async getWikiPageDraft(id: string): Promise<any | null> {
    const page = await db.query.wikiPages.findFirst({
      where: eq(schema.wikiPages.id, id),
    });
    return page?.contentDraft || null;
  }

  // ============================================================
  // ENTITY MENTIONS - Semantic Linking (Phase 2 prep)
  // ============================================================

  async getEntityMentionsByPage(pageId: string): Promise<EntityMention[]> {
    const mentions = await db
      .select()
      .from(schema.entityMentions)
      .where(eq(schema.entityMentions.pageId, pageId));
    return mentions;
  }

  async getEntityMentionsByEntity(entityType: string, entityId: string): Promise<EntityMention[]> {
    const mentions = await db
      .select()
      .from(schema.entityMentions)
      .where(eq(schema.entityMentions.entityType, entityType))
      .where(eq(schema.entityMentions.entityId, entityId));
    return mentions;
  }

  async createEntityMention(mentionData: InsertEntityMention): Promise<EntityMention> {
    const [mention] = await db
      .insert(schema.entityMentions)
      .values({
        ...mentionData,
        createdAt: new Date(),
      })
      .returning();
    return mention;
  }

  async updateEntityMentionStatus(entityType: string, entityId: string, newStatus: string): Promise<void> {
    await db
      .update(schema.entityMentions)
      .set({
        entityStatus: newStatus,
        lastCheckedAt: new Date(),
      })
      .where(eq(schema.entityMentions.entityType, entityType))
      .where(eq(schema.entityMentions.entityId, entityId));
  }

  async deleteEntityMentionsByPage(pageId: string): Promise<void> {
    await db
      .delete(schema.entityMentions)
      .where(eq(schema.entityMentions.pageId, pageId));
  }

  // ============================================================
  // CODE CHANGES - Link PRs, Commits, Branches to Work Items
  // ============================================================

  async getCodeChangesByEntity(entityType: string, entityId: string): Promise<CodeChange[]> {
    const changes = await db
      .select()
      .from(schema.codeChanges)
      .where(
        and(
          eq(schema.codeChanges.entityType, entityType),
          eq(schema.codeChanges.entityId, entityId)
        )
      )
      .orderBy(desc(schema.codeChanges.eventTimestamp));
    return changes;
  }

  async getCodeChangesByRepository(repository: string): Promise<CodeChange[]> {
    const changes = await db
      .select()
      .from(schema.codeChanges)
      .where(eq(schema.codeChanges.repository, repository))
      .orderBy(desc(schema.codeChanges.eventTimestamp));
    return changes;
  }

  async getCodeChangeByExternalId(externalId: string): Promise<CodeChange | undefined> {
    const [change] = await db
      .select()
      .from(schema.codeChanges)
      .where(eq(schema.codeChanges.externalId, externalId));
    return change;
  }

  async createCodeChange(change: InsertCodeChange): Promise<CodeChange> {
    const [newChange] = await db
      .insert(schema.codeChanges)
      .values(change)
      .returning();
    return newChange;
  }

  async updateCodeChange(id: string, updates: Partial<CodeChange>): Promise<CodeChange | undefined> {
    const [updatedChange] = await db
      .update(schema.codeChanges)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(schema.codeChanges.id, id))
      .returning();
    return updatedChange;
  }

  async deleteCodeChange(id: string): Promise<boolean> {
    const result = await db
      .delete(schema.codeChanges)
      .where(eq(schema.codeChanges.id, id));
    return true;
  }

  async getRecentCodeChanges(limit: number = 20): Promise<CodeChange[]> {
    const changes = await db
      .select()
      .from(schema.codeChanges)
      .orderBy(desc(schema.codeChanges.eventTimestamp))
      .limit(limit);
    return changes;
  }
}

export const storage = new DatabaseStorage();
