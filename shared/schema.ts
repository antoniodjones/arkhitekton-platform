import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, timestamp, integer, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const architectureElements = pgTable("architecture_elements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'structural', 'behavioral', 'motivational', 'passive'
  category: text("category").notNull(), // 'business', 'application', 'data', 'technology'
  framework: text("framework").notNull().default('archimate'), // 'archimate', 'togaf', 'bpmn'
  description: text("description").notNull(),
  usageGuidelines: text("usageGuidelines"),
  iconName: text("iconName"),
  color: text("color").notNull(),
  shape: text("shape").notNull(), // 'rectangular', 'rounded', 'diamond'
  relationships: jsonb("relationships").$type<string[]>().default([]),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const recentElements = pgTable("recent_elements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("userId").notNull(),
  elementId: varchar("elementId").notNull(),
  usedAt: timestamp("usedAt").defaultNow(),
  usageCount: integer("usageCount").default(1),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertArchitectureElementSchema = createInsertSchema(architectureElements).omit({
  id: true,
  createdAt: true,
});

export const insertRecentElementSchema = createInsertSchema(recentElements).omit({
  id: true,
  usedAt: true,
});

// Unified Architectural Models - Core of ARKHITEKTON ecosystem
export const architecturalModels: any = pgTable("architectural_models", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  domain: text("domain").notNull(), // 'software', 'data', 'infrastructure', 'integration', 'security', 'business'
  type: text("type").notNull(), // 'system', 'component', 'service', 'process', 'capability', 'custom'
  version: text("version").default("1.0.0"),
  
  // Master state vs transition state
  state: text("state").notNull().default("master"), // 'master', 'transition', 'archived'
  parentModelId: uuid("parentModelId"), // For transition states
  
  // Model ownership and governance
  ownerId: varchar("ownerId").notNull(),
  stakeholders: jsonb("stakeholders").$type<string[]>().default([]),
  
  // Visual canvas data
  canvasData: jsonb("canvasData").$type<{
    objects: any[];
    connections: any[];
    viewport: any;
    layouts: any[];
  }>(),
  
  // Documentation integration
  documentationPages: jsonb("documentationPages").$type<string[]>().default([]),
  
  // Metrics and outcomes
  metrics: jsonb("metrics").$type<Record<string, any>>().default({}),
  
  // External integrations
  externalRefs: jsonb("externalRefs").$type<{
    confluence?: string[];
    sharepoint?: string[];
    notion?: string[];
    custom?: Record<string, string>;
  }>().default({}),
  
  // Lifecycle
  status: text("status").notNull().default("active"), // 'active', 'deprecated', 'retired'
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow()
});

// Architectural Objects - Universal intelligent objects
export const architecturalObjects = pgTable("architectural_objects", {
  id: uuid("id").primaryKey().defaultRandom(),
  modelId: uuid("modelId").references(() => architecturalModels.id).notNull(),
  name: text("name").notNull(),
  
  // Object classification
  objectType: text("objectType").notNull(), // 'standard', 'custom', 'derived'
  domain: text("domain").notNull(),
  category: text("category").notNull(),
  
  // Visual representation
  visual: jsonb("visual").$type<{
    shape: any;
    position: { x: number; y: number };
    size: { width: number; height: number };
    styling: any;
    ports: any[];
    annotations: any[];
  }>().notNull(),
  
  // Architectural semantics
  semantics: jsonb("semantics").$type<{
    purpose: string;
    responsibilities: string[];
    constraints: any[];
    patterns: string[];
  }>().default({
    purpose: "",
    responsibilities: [],
    constraints: [],
    patterns: []
  }),
  
  // Lifecycle tracking
  lifecycle: jsonb("lifecycle").$type<{
    state: string;
    milestones: any[];
    decisions: string[];
    changes: any[];
  }>().default({
    state: "draft",
    milestones: [],
    decisions: [],
    changes: []
  }),
  
  // Metrics and measurement
  metrics: jsonb("metrics").$type<{
    performance?: Record<string, number>;
    reliability?: Record<string, number>;
    security?: Record<string, number>;
    cost?: Record<string, number>;
    businessValue?: Record<string, number>;
    custom?: Record<string, any>;
  }>().default({}),
  
  // Real-world implementation links
  implementation: jsonb("implementation").$type<{
    codeRepositories?: string[];
    deployments?: string[];
    infrastructure?: string[];
    dependencies?: string[];
    apis?: string[];
  }>().default({}),
  
  // Custom metadata
  metadata: jsonb("metadata").$type<Record<string, any>>().default({}),
  
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow()
});

// Object connections and relationships
export const objectConnections = pgTable("object_connections", {
  id: uuid("id").primaryKey().defaultRandom(),
  sourceObjectId: uuid("sourceObjectId").references(() => architecturalObjects.id).notNull(),
  targetObjectId: uuid("targetObjectId").references(() => architecturalObjects.id).notNull(),
  
  // Connection semantics
  relationshipType: text("relationshipType").notNull(), // 'depends_on', 'implements', 'calls', 'stores_in', 'deployed_on'
  direction: text("direction").notNull().default("directed"), // 'directed', 'bidirectional', 'undirected'
  
  // Visual representation
  visual: jsonb("visual").$type<{
    path: any[];
    styling: any;
    labels: any[];
  }>(),
  
  // Connection metadata
  properties: jsonb("properties").$type<Record<string, any>>().default({}),
  
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow()
});

// Knowledge Base Pages - Simplified documentation system
export const knowledgeBasePages = pgTable("knowledge_base_pages", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Essential fields only
  title: text("title").notNull(),
  slug: text("slug"), // Optional - will auto-generate
  content: text("content").notNull().default(""), // Simple text content
  
  // Basic organization
  category: text("category").default("General"),
  status: text("status").default("draft"), // 'draft', 'published'
  tags: jsonb("tags").$type<string[]>().default([]),
  
  // Optional hierarchy
  parentPageId: uuid("parentPageId"),
  order: integer("order").default(0),
  
  // Timestamps
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow()
});

// Page comments for collaboration
export const pageComments = pgTable("page_comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  pageId: uuid("pageId").references(() => knowledgeBasePages.id).notNull(),
  parentCommentId: uuid("parentCommentId"), // For threaded comments
  
  // Comment content
  content: text("content").notNull(),
  authorId: varchar("authorId").notNull(),
  
  // Position in document (for inline comments)
  blockId: text("blockId"), // Which content block this comment is attached to
  position: integer("position"), // Character position within block
  
  // Comment status
  isResolved: integer("isResolved").default(0), // 0 = open, 1 = resolved
  resolvedBy: varchar("resolvedBy"),
  resolvedAt: timestamp("resolvedAt"),
  
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow()
});

// Page version history
export const pageVersions = pgTable("page_versions", {
  id: uuid("id").primaryKey().defaultRandom(),
  pageId: uuid("pageId").references(() => knowledgeBasePages.id).notNull(),
  versionNumber: integer("versionNumber").notNull(),
  
  // Version metadata
  title: text("title").notNull(),
  content: jsonb("content").notNull(),
  changeLog: text("changeLog"), // Summary of changes
  authorId: varchar("authorId").notNull(),
  
  // Change tracking
  changes: jsonb("changes").$type<{
    type: 'create' | 'update' | 'delete';
    field: string;
    oldValue?: any;
    newValue?: any;
  }[]>().default([]),
  
  createdAt: timestamp("createdAt").defaultNow()
});

// Legacy documentation pages (keeping for backward compatibility)
export const documentationPages: any = pgTable("documentation_pages", {
  id: uuid("id").primaryKey().defaultRandom(),
  modelId: uuid("modelId").references(() => architecturalModels.id),
  title: text("title").notNull(),
  
  // Rich text content with embedded references
  content: jsonb("content").$type<{
    blocks: any[];
    embeddings: { type: string; id: string; position: number }[];
  }>().notNull(),
  
  // Page metadata
  parentPageId: uuid("parentPageId"),
  order: integer("order").default(0),
  
  // Collaboration
  authorId: varchar("authorId").notNull(),
  collaborators: jsonb("collaborators").$type<string[]>().default([]),
  
  // External sync
  externalSync: jsonb("externalSync").$type<{
    confluence?: { spaceId: string; pageId: string; lastSync: string };
    sharepoint?: { siteId: string; listId: string; itemId: string; lastSync: string };
    notion?: { databaseId: string; pageId: string; lastSync: string };
  }>(),
  
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow()
});

// Version control for models
export const modelVersions: any = pgTable("model_versions", {
  id: uuid("id").primaryKey().defaultRandom(),
  modelId: uuid("modelId").references(() => architecturalModels.id).notNull(),
  version: text("version").notNull(),
  
  // Version metadata
  commitMessage: text("commitMessage"),
  authorId: varchar("authorId").notNull(),
  parentVersionId: uuid("parentVersionId"),
  
  // Snapshot of model state
  modelSnapshot: jsonb("modelSnapshot").$type<{
    objects: any[];
    connections: any[];
    documentation: any[];
    metadata: any;
  }>().notNull(),
  
  // Change tracking
  changes: jsonb("changes").$type<{
    added: string[];
    modified: string[];
    deleted: string[];
    summary: string;
  }>(),
  
  createdAt: timestamp("createdAt").defaultNow()
});

// Schema definitions and types
export const insertArchitecturalModelSchema = createInsertSchema(architecturalModels).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertArchitecturalObjectSchema = createInsertSchema(architecturalObjects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDocumentationPageSchema = createInsertSchema(documentationPages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Knowledge Base schema exports
export const insertKnowledgeBasePageSchema = createInsertSchema(knowledgeBasePages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPageCommentSchema = createInsertSchema(pageComments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPageVersionSchema = createInsertSchema(pageVersions).omit({
  id: true,
  createdAt: true,
});

// Type exports
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type ArchitectureElement = typeof architectureElements.$inferSelect;
export type InsertArchitectureElement = z.infer<typeof insertArchitectureElementSchema>;
export type RecentElement = typeof recentElements.$inferSelect;
export type InsertRecentElement = z.infer<typeof insertRecentElementSchema>;

// New unified model types
export type ArchitecturalModel = typeof architecturalModels.$inferSelect;
export type InsertArchitecturalModel = z.infer<typeof insertArchitecturalModelSchema>;
export type ArchitecturalObject = typeof architecturalObjects.$inferSelect;
export type InsertArchitecturalObject = z.infer<typeof insertArchitecturalObjectSchema>;
export type ObjectConnection = typeof objectConnections.$inferSelect;
export type DocumentationPage = typeof documentationPages.$inferSelect;
export type InsertDocumentationPage = z.infer<typeof insertDocumentationPageSchema>;
export type ModelVersion = typeof modelVersions.$inferSelect;

// Knowledge Base types
export type KnowledgeBasePage = typeof knowledgeBasePages.$inferSelect;
export type InsertKnowledgeBasePage = z.infer<typeof insertKnowledgeBasePageSchema>;
export type PageComment = typeof pageComments.$inferSelect;
export type InsertPageComment = z.infer<typeof insertPageCommentSchema>;
export type PageVersion = typeof pageVersions.$inferSelect;
export type InsertPageVersion = z.infer<typeof insertPageVersionSchema>;

// Gamified Achievement System for Modeling Complexity
export const achievements = pgTable("achievements", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Achievement definition
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // 'complexity', 'collaboration', 'quality', 'consistency', 'innovation'
  tier: text("tier").notNull(), // 'bronze', 'silver', 'gold', 'platinum', 'diamond'
  
  // Visual representation
  iconName: text("iconName").notNull(),
  color: text("color").notNull(),
  
  // Scoring criteria
  criteria: jsonb("criteria").$type<{
    metric: string; // 'object_count', 'connection_density', 'semantic_depth', 'pattern_usage'
    threshold: number;
    operator: 'gte' | 'lte' | 'eq'; // greater than equal, less than equal, equal
    weight: number; // scoring weight
  }[]>().notNull(),
  
  // Points awarded
  basePoints: integer("basePoints").notNull(),
  bonusMultiplier: integer("bonusMultiplier").default(1),
  
  // Progression requirements  
  prerequisites: jsonb("prerequisites").$type<string[]>().default([]), // Achievement IDs required first
  isHidden: integer("isHidden").default(0), // 0 = visible, 1 = hidden until unlocked
  
  createdAt: timestamp("createdAt").defaultNow()
});

// User achievement progress and unlocks
export const userAchievements = pgTable("user_achievements", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("userId").notNull(),
  achievementId: uuid("achievementId").references(() => achievements.id).notNull(),
  
  // Progress tracking
  currentProgress: integer("currentProgress").default(0),
  maxProgress: integer("maxProgress").notNull(),
  isUnlocked: integer("isUnlocked").default(0), // 0 = in progress, 1 = unlocked
  
  // Achievement context
  modelId: uuid("modelId").references(() => architecturalModels.id), // Model that triggered achievement
  triggerData: jsonb("triggerData").$type<Record<string, any>>().default({}),
  
  // Rewards
  pointsEarned: integer("pointsEarned").default(0),
  bonusEarned: integer("bonusEarned").default(0),
  
  // Timestamps
  firstProgressAt: timestamp("firstProgressAt").defaultNow(),
  unlockedAt: timestamp("unlockedAt"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow()
});

// User gamification profile
export const userGameProfiles = pgTable("user_game_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("userId").notNull().unique(),
  
  // Experience and progression
  totalPoints: integer("totalPoints").default(0),
  currentLevel: integer("currentLevel").default(1),
  experiencePoints: integer("experiencePoints").default(0),
  nextLevelThreshold: integer("nextLevelThreshold").default(100),
  
  // Achievement statistics
  achievementsUnlocked: integer("achievementsUnlocked").default(0),
  bronzeCount: integer("bronzeCount").default(0),
  silverCount: integer("silverCount").default(0),
  goldCount: integer("goldCount").default(0),
  platinumCount: integer("platinumCount").default(0),
  diamondCount: integer("diamondCount").default(0),
  
  // Modeling complexity metrics
  modelingStats: jsonb("modelingStats").$type<{
    totalModels: number;
    totalObjects: number;
    totalConnections: number;
    averageComplexity: number;
    semanticDepthScore: number;
    patternDiversityScore: number;
    consistencyScore: number;
    collaborationScore: number;
  }>().default({
    totalModels: 0,
    totalObjects: 0,
    totalConnections: 0,
    averageComplexity: 0,
    semanticDepthScore: 0,
    patternDiversityScore: 0,
    consistencyScore: 0,
    collaborationScore: 0
  }),
  
  // Streaks and engagement
  currentStreak: integer("currentStreak").default(0), // Days of consecutive modeling
  longestStreak: integer("longestStreak").default(0),
  lastActivityAt: timestamp("lastActivityAt").defaultNow(),
  
  // Preferences
  celebrationEnabled: integer("celebrationEnabled").default(1), // 0 = disabled, 1 = enabled
  leaderboardVisible: integer("leaderboardVisible").default(1),
  
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow()
});

// Team leaderboards and competitions
export const leaderboards = pgTable("leaderboards", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Leaderboard configuration
  name: text("name").notNull(),
  description: text("description"),
  type: text("type").notNull(), // 'global', 'team', 'department', 'time-period'
  scope: text("scope").notNull(), // 'points', 'achievements', 'complexity', 'collaboration'
  
  // Time period (for time-based leaderboards)
  startDate: timestamp("startDate"),
  endDate: timestamp("endDate"),
  
  // Participants and rankings
  rankings: jsonb("rankings").$type<{
    userId: string;
    displayName: string;
    score: number;
    rank: number;
    change: number; // +/- position change from previous period
    achievements: string[];
  }[]>().default([]),
  
  // Configuration
  maxParticipants: integer("maxParticipants").default(100),
  isActive: integer("isActive").default(1),
  
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow()
});

// Achievement schema exports
export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
  createdAt: true,
});

export const insertUserAchievementSchema = createInsertSchema(userAchievements).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserGameProfileSchema = createInsertSchema(userGameProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLeaderboardSchema = createInsertSchema(leaderboards).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Achievement system types
export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type UserAchievement = typeof userAchievements.$inferSelect;
export type InsertUserAchievement = z.infer<typeof insertUserAchievementSchema>;
export type UserGameProfile = typeof userGameProfiles.$inferSelect;
export type InsertUserGameProfile = z.infer<typeof insertUserGameProfileSchema>;
export type Leaderboard = typeof leaderboards.$inferSelect;
export type InsertLeaderboard = z.infer<typeof insertLeaderboardSchema>;

// Development Plan Tasks - Project management system
export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  completed: integer("completed").notNull().default(0), // 0 = false, 1 = true
  priority: text("priority").notNull().default("medium"), // 'high', 'medium', 'low'
  category: text("category").notNull(), // 'foundation', 'knowledge-base', 'ai', 'modeling', 'integration', 'ux'
  status: text("status").notNull().default("todo"), // 'todo', 'in-progress', 'completed'
  assignee: text("assignee"),
  dueDate: text("due_date"),
  startDate: text("start_date"), // Task start date for Gantt chart
  endDate: text("end_date"), // Task end date for Gantt chart  
  dependencies: jsonb("dependencies").$type<string[]>().default([]), // Array of task IDs this task depends on
  subtasks: jsonb("subtasks").$type<{
    id: string;
    title: string;
    completed: boolean;
    createdAt: Date;
  }[]>().default([]), // Array of subtasks
  abilities: jsonb("abilities").$type<string[]>().default([]),
  comments: jsonb("comments").$type<{
    id: string;
    text: string;
    timestamp: Date;
    author: string;
  }[]>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  completedAt: timestamp("completed_at")
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;

// User Stories - Enterprise story management
export const userStories = pgTable("user_stories", {
  id: text("id").primaryKey(), // US-XXXXXXX format
  parentTaskId: uuid("parent_task_id").references(() => tasks.id), // Optional task connection (legacy)
  epicId: text("epic_id").references(() => epics.id), // Epic assignment (EA Value Stream)
  title: text("title").notNull(),
  description: text("description").default(""),
  acceptanceCriteria: text("acceptance_criteria").notNull(),
  storyPoints: integer("story_points").notNull().default(3),
  status: text("status").notNull().default("backlog"), // 'backlog', 'sprint', 'in-progress', 'review', 'done'
  priority: text("priority").notNull().default("medium"), // 'low', 'medium', 'high'
  
  // Team assignments
  assignee: text("assignee"), // Developer
  productManager: text("product_manager"), // Product Manager/Owner
  techLead: text("tech_lead"), // Tech Lead/Architect
  
  // Story composition guidance
  feature: text("feature"),
  value: text("value"),
  requirement: text("requirement"),
  
  // GitHub integration
  githubRepo: text("github_repo"),
  githubBranch: text("github_branch"),
  githubIssue: integer("github_issue"),
  githubCommits: jsonb("github_commits").$type<Array<{
    sha: string;
    message: string;
    author: string;
    email: string;
    timestamp: string;
    url: string;
  }>>().default([]),
  
  // Labels and metadata
  labels: jsonb("labels").$type<string[]>().default([]),
  screenshots: jsonb("screenshots").$type<string[]>().default([]), // URLs to uploaded images
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// User Story validation schemas with enterprise-grade controls
export const insertUserStorySchema = createInsertSchema(userStories).omit({
  id: true, // Server generates standardized US-XXXXXXX IDs
  createdAt: true,
  updatedAt: true,
}).extend({
  // Enforce status enum validation
  status: z.enum(['backlog', 'sprint', 'in-progress', 'review', 'done']).default('backlog'),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  // Ensure required fields
  title: z.string().min(1, "Title is required"),
  acceptanceCriteria: z.string().min(1, "Acceptance criteria is required"),
  storyPoints: z.number().int().min(1).max(13).default(3), // Fibonacci scale limit
});

// Update schema that prevents modification of immutable fields and enforces business rules
export const updateUserStorySchema = insertUserStorySchema.partial().extend({
  // Optional validation for updates
  parentTaskId: z.string().uuid().optional().nullable(), // Validate UUID format if provided
  epicId: z.string().optional().nullable(), // Validate Epic ID format if provided (EPIC-XX)
  storyPoints: z.number().int().min(1).max(13).optional(),
  githubIssue: z.number().int().positive().optional().nullable(),
});

export type UserStory = typeof userStories.$inferSelect;
export type InsertUserStory = z.infer<typeof insertUserStorySchema>;
export type UpdateUserStory = z.infer<typeof updateUserStorySchema>;

// Epics - Enterprise Architecture Value Stream Epics
export const epics = pgTable("epics", {
  id: text("id").primaryKey(), // EPIC-XX format (1-6 for EA Value Streams)
  name: text("name").notNull(),
  description: text("description").default(""),
  
  // EA Value Stream alignment
  valueStream: text("value_stream").notNull(), // 'strategy', 'design', 'governance', 'development', 'operations', 'knowledge'
  targetPersonas: jsonb("target_personas").$type<string[]>().default([]),
  coreCapabilities: jsonb("core_capabilities").$type<string[]>().default([]),
  keyFeatures: jsonb("key_features").$type<string[]>().default([]),
  
  // Epic metadata
  status: text("status").notNull().default("planned"), // 'planned', 'in-progress', 'completed'
  priority: text("priority").notNull().default("medium"), // 'low', 'medium', 'high', 'critical'
  
  // Ownership
  owner: text("owner"),
  stakeholders: jsonb("stakeholders").$type<string[]>().default([]),
  
  // Planning
  startDate: text("start_date"),
  endDate: text("end_date"),
  targetQuarter: text("target_quarter"), // Q1 2025, Q2 2025, etc.
  
  // Progress tracking (auto-calculated from stories)
  completionPercentage: integer("completion_percentage").default(0),
  totalStoryPoints: integer("total_story_points").default(0),
  completedStoryPoints: integer("completed_story_points").default(0),
  
  // Goals and outcomes
  businessGoals: jsonb("business_goals").$type<string[]>().default([]),
  successMetrics: jsonb("success_metrics").$type<{
    metric: string;
    target: string;
    current: string;
  }[]>().default([]),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const insertEpicSchema = createInsertSchema(epics).omit({
  id: true, // Server generates EPIC-XX format
  createdAt: true,
  updatedAt: true,
  completionPercentage: true, // Auto-calculated
  totalStoryPoints: true, // Auto-calculated
  completedStoryPoints: true, // Auto-calculated
}).extend({
  name: z.string().min(1, "Name is required"),
  valueStream: z.enum(['strategy', 'design', 'governance', 'development', 'operations', 'knowledge']),
  status: z.enum(['planned', 'in-progress', 'completed']).default('planned'),
  priority: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
});

export type Epic = typeof epics.$inferSelect;
export type InsertEpic = z.infer<typeof insertEpicSchema>;

// Developer Integration Channels - IDE, Code Editor, and Version Control Integrations
export const integrationChannels = pgTable("integration_channels", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Tool identification
  toolId: text("toolId").notNull().unique(), // 'vscode', 'intellij', 'github', 'gitlab', 'bitbucket'
  name: text("name").notNull(),
  type: text("type").notNull(), // 'ide', 'editor', 'vcs', 'ci_cd', 'collaboration'
  
  // Integration capabilities
  directionality: text("directionality").notNull(), // 'bidirectional', 'push_only', 'pull_only'
  capabilities: jsonb("capabilities").$type<string[]>().default([]), // ['model_sync', 'code_gen', 'reverse_eng', 'real_time']
  
  // Connection configuration
  connectionConfig: jsonb("connectionConfig").$type<{
    apiEndpoint?: string;
    authMethod: 'oauth' | 'token' | 'ssh' | 'webhook';
    webhookUrl?: string;
    requiredScopes?: string[];
    syncFrequency?: 'real_time' | 'on_demand' | 'scheduled';
  }>().notNull(),
  
  // Integration metadata
  version: text("version").notNull(),
  status: text("status").notNull().default("active"), // 'active', 'deprecated', 'beta'
  documentation: text("documentation"),
  
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow()
});

// Object Sync Flows - Git-like state management for architectural objects
export const objectSyncFlows = pgTable("object_sync_flows", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Flow identification
  name: text("name").notNull(),
  description: text("description"),
  integrationChannelId: uuid("integrationChannelId").references(() => integrationChannels.id).notNull(),
  
  // Sync scope
  objectTypes: jsonb("objectTypes").$type<string[]>().default([]), // ['component', 'service', 'interface', 'data_model']
  sourceScope: text("sourceScope").notNull(), // 'workspace', 'model', 'object', 'repository'
  targetScope: text("targetScope").notNull(),
  
  // Git-like state transitions
  stateTransitions: jsonb("stateTransitions").$type<{
    from: 'draft' | 'staged' | 'committed' | 'branched' | 'merged' | 'tagged';
    to: 'draft' | 'staged' | 'committed' | 'branched' | 'merged' | 'tagged';
    trigger: 'manual' | 'auto_save' | 'commit' | 'push' | 'merge' | 'review';
    actions: string[]; // ['validate', 'generate_code', 'update_docs', 'notify_team']
  }[]>().default([]),
  
  // Conflict resolution
  conflictResolution: jsonb("conflictResolution").$type<{
    strategy: 'manual' | 'auto_merge' | 'source_wins' | 'target_wins' | 'crdt';
    mergePatterns: string[];
    reviewRequired: boolean;
  }>().default({
    strategy: 'manual',
    mergePatterns: [],
    reviewRequired: true
  }),
  
  // State tracking
  currentState: text("currentState").notNull().default("draft"), // Git-like state
  stateVersion: integer("stateVersion").default(1), // Optimistic concurrency control
  lastSyncAt: timestamp("lastSyncAt"),
  
  // Sync metadata
  syncMetrics: jsonb("syncMetrics").$type<{
    successCount: number;
    errorCount: number;
    lastError?: string;
    avgSyncTime: number;
    objectsProcessed: number;
  }>().default({
    successCount: 0,
    errorCount: 0,
    avgSyncTime: 0,
    objectsProcessed: 0
  }),
  
  // Configuration
  isActive: integer("isActive").default(1), // 0 = inactive, 1 = active
  syncTriggers: jsonb("syncTriggers").$type<string[]>().default([]), // ['on_save', 'on_commit', 'scheduled', 'webhook']
  
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow()
});

// Developer Integration schema exports
export const insertIntegrationChannelSchema = createInsertSchema(integrationChannels).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertObjectSyncFlowSchema = createInsertSchema(objectSyncFlows).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Developer Integration types
export type IntegrationChannel = typeof integrationChannels.$inferSelect;
export type InsertIntegrationChannel = z.infer<typeof insertIntegrationChannelSchema>;
export type ObjectSyncFlow = typeof objectSyncFlows.$inferSelect;
export type InsertObjectSyncFlow = z.infer<typeof insertObjectSyncFlowSchema>;

// Application Settings - Encrypted configuration storage
export const applicationSettings = pgTable("application_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Setting identification
  key: text("key").notNull().unique(), // e.g., "github.token", "jira.api_key"
  value: text("value").notNull(), // Encrypted for sensitive fields
  category: text("category").notNull(), // 'github', 'jira', 'automation', 'preferences'
  
  // Security and metadata
  isSensitive: integer("is_sensitive").notNull().default(1), // 1 = encrypt, 0 = plain text
  description: text("description"),
  
  // Additional configuration
  metadata: jsonb("metadata").$type<Record<string, any>>().default({}),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const insertApplicationSettingSchema = createInsertSchema(applicationSettings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type ApplicationSetting = typeof applicationSettings.$inferSelect;
export type InsertApplicationSetting = z.infer<typeof insertApplicationSettingSchema>;
