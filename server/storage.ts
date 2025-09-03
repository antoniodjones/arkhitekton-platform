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
  type InsertTask
} from "@shared/schema";
import { randomUUID } from "crypto";

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
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private architectureElements: Map<string, ArchitectureElement>;
  private recentElements: Map<string, RecentElement>;
  private knowledgeBasePages: Map<string, KnowledgeBasePage>;
  private tasks: Map<string, Task>;

  constructor() {
    this.users = new Map();
    this.architectureElements = new Map();
    this.recentElements = new Map();
    this.knowledgeBasePages = new Map();
    this.tasks = new Map();
    
    // Initialize with some sample architecture elements
    this.initializeArchitectureElements();
    // Initialize with sample knowledge base pages
    this.initializeKnowledgeBasePages();
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
      usedAt: new Date()
    };
    this.recentElements.set(id, recentElement);
    return recentElement;
  }

  private initializeKnowledgeBasePages() {
    const samplePages: InsertKnowledgeBasePage[] = [
      {
        title: 'Getting Started',
        slug: 'getting-started',
        path: '/getting-started',
        depth: 0,
        order: 0,
        content: {
          blocks: [
            { type: 'paragraph', content: 'Welcome to the ARKHITEKTON Knowledge Base! This is your central hub for all architecture documentation, best practices, and implementation guides.' }
          ],
          embeddings: [],
          template: 'documentation'
        },
        pageType: 'documentation',
        category: 'architecture',
        tags: ['introduction', 'onboarding'],
        status: 'published',
        authorId: 'system',
        visibility: 'team'
      },
      {
        title: 'Architecture Patterns',
        slug: 'architecture-patterns',
        path: '/architecture-patterns',
        depth: 0,
        order: 1,
        content: {
          blocks: [
            { type: 'paragraph', content: 'Comprehensive guide to enterprise architecture patterns used in modern systems.' }
          ],
          embeddings: [],
          template: 'guide'
        },
        pageType: 'guide',
        category: 'architecture',
        tags: ['patterns', 'design'],
        status: 'published',
        authorId: 'system',
        visibility: 'team'
      }
    ];

    samplePages.forEach(page => {
      const id = randomUUID();
      const fullPage: KnowledgeBasePage = {
        ...page,
        id,
        parentPageId: null,
        linkedModelIds: [],
        collaborators: [],
        reviewers: [],
        externalSync: null,
        searchKeywords: null,
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
}

export const storage = new MemStorage();
