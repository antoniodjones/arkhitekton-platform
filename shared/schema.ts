import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, timestamp, integer, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { isValidGherkin } from "./gherkin-validator";

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
  vendor: text("vendor"), // Vendor who created the shape (e.g., 'AWS', 'Google Cloud', 'The Open Group')
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

export const insertObjectConnectionSchema = createInsertSchema(objectConnections).omit({
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

// Sprints - Agile Sprint Management (US-PLAN-101)
export const sprints = pgTable("sprints", {
  id: text("id").primaryKey(), // SPRINT-XXXXXXX format
  name: text("name").notNull(), // e.g., "Sprint 23", "Q4 2025 - Sprint 1"
  goal: text("goal"), // Sprint goal/objective
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  status: text("status").notNull().default("planning"), // 'planning', 'active', 'completed', 'cancelled'
  
  // Capacity planning
  teamVelocity: integer("team_velocity").notNull().default(30), // Average story points per sprint
  committedPoints: integer("committed_points").default(0), // Total points of stories in sprint
  completedPoints: integer("completed_points").default(0), // Points completed so far
  
  // Metadata
  notes: text("notes"), // Sprint planning notes, retro outcomes
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Sprint schema validation
export const insertSprintSchema = createInsertSchema(sprints).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  status: z.enum(['planning', 'active', 'completed', 'cancelled']).default('planning'),
  teamVelocity: z.number().int().min(1).max(200).default(30),
});

export const updateSprintSchema = insertSprintSchema.partial();

export type Sprint = typeof sprints.$inferSelect;
export type InsertSprint = z.infer<typeof insertSprintSchema>;

// User Stories - Enterprise story management
export const userStories = pgTable("user_stories", {
  id: text("id").primaryKey(), // US-XXXXXXX format
  epicId: text("epic_id").references(() => epics.id), // Epic assignment (EA Value Stream)
  sprintId: text("sprint_id").references(() => sprints.id), // Sprint assignment (US-PLAN-101)
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

  // Jira integration
  jiraIssueKey: text("jira_issue_key"), // PROJ-1234
  jiraIssueId: text("jira_issue_id"), // Numeric ID from Jira
  lastSyncedAt: timestamp("last_synced_at"),
  syncSource: text("sync_source"), // 'arkhitekton', 'jira', 'manual'
  syncStatus: text("sync_status"), // 'synced', 'pending', 'error', 'disabled'
  syncError: text("sync_error"), // Error message if sync failed

  // Labels and metadata
  labels: jsonb("labels").$type<string[]>().default([]),
  screenshots: jsonb("screenshots").$type<string[]>().default([]), // URLs to uploaded images

  // Traceability - Link stories to implementation and documentation
  relatedFiles: jsonb("related_files").$type<string[]>().default([]), // Files that implement this story
  documentationPageId: text("documentation_page_id"), // Link to knowledge base article

  // Enhancement Story Metadata (US-WW9SP8C)
  enhances: jsonb("enhances").$type<string[]>().default([]), // Story IDs this enhances
  enhancementType: text("enhancement_type"), // Feature Evolution, Bug Fix, UX Improvement, etc.
  rationale: text("rationale"), // Business justification for the enhancement

  // Planning Date Fields (US-8KE9R60)
  targetDate: timestamp("target_date"), // When should this be done
  startedAt: timestamp("started_at"), // When work actually began
  completedAt: timestamp("completed_at"), // When story was marked done

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
  // Gherkin format validation (US-XIGJUQ7)
  acceptanceCriteria: z.string()
    .min(1, "Acceptance criteria is required")
    .refine(isValidGherkin, {
      message: "Acceptance criteria must follow Gherkin format (Given/When/Then)"
    }),
  storyPoints: z.number().int().min(1).max(13).default(3), // Fibonacci scale limit
});

// Update schema that prevents modification of immutable fields and enforces business rules
export const updateUserStorySchema = insertUserStorySchema.partial().extend({
  // Optional validation for updates
  epicId: z.string().optional().nullable(), // Validate Epic ID format if provided (EPIC-XX)
  storyPoints: z.number().int().min(1).max(13).optional(),
  githubIssue: z.number().int().positive().optional().nullable(),
  // Enhancement Story Metadata (US-WW9SP8C)
  enhances: z.array(z.string()).optional().nullable(),
  enhancementType: z.enum(['feature-evolution', 'bug-fix', 'ux-improvement', 'performance', 'refactoring', 'security', 'accessibility', 'technical-debt']).optional().nullable(),
  rationale: z.string().optional().nullable(),
  // Planning Date Fields (US-8KE9R60)
  targetDate: z.string().datetime().optional().nullable(),
  startedAt: z.string().datetime().optional().nullable(),
  completedAt: z.string().datetime().optional().nullable(),
});

export type UserStory = typeof userStories.$inferSelect;
export type InsertUserStory = z.infer<typeof insertUserStorySchema>;
export type UpdateUserStory = z.infer<typeof updateUserStorySchema>;

// Defects - Quality assurance and bug tracking linked to user stories
export const defects = pgTable("defects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`), // DEF-XXXXXXX format
  userStoryId: text("user_story_id").references(() => userStories.id).notNull(), // Parent story

  title: text("title").notNull(),
  description: text("description").notNull(),

  // Classification
  severity: text("severity").notNull().default("medium"), // 'critical', 'high', 'medium', 'low'
  type: text("type").notNull().default("bug"), // 'bug', 'regression', 'performance', 'security', 'usability'
  status: text("status").notNull().default("open"), // 'open', 'in-progress', 'resolved', 'closed', 'rejected'

  // Assignment
  discoveredBy: text("discovered_by"), // Who found the defect
  assignedTo: text("assigned_to"), // Who should fix it

  // GitHub integration
  githubIssue: integer("github_issue"),
  githubCommits: jsonb("github_commits").$type<Array<{
    sha: string;
    message: string;
    author: string;
    timestamp: string;
  }>>().default([]),

  // Jira integration
  jiraIssueKey: text("jira_issue_key"), // PROJ-1234
  jiraIssueId: text("jira_issue_id"),
  lastSyncedAt: timestamp("last_synced_at"),
  syncSource: text("sync_source"), // 'arkhitekton', 'jira', 'manual'
  syncStatus: text("sync_status"), // 'synced', 'pending', 'error', 'disabled'

  // Resolution tracking
  rootCause: text("root_cause"), // Analysis of what caused the defect
  resolution: text("resolution"), // How it was fixed

  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  resolvedAt: timestamp("resolved_at"),
});

// Defect validation schemas
export const insertDefectSchema = createInsertSchema(defects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  resolvedAt: true,
}).extend({
  // Enforce enums
  severity: z.enum(['critical', 'high', 'medium', 'low']).default('medium'),
  type: z.enum(['bug', 'regression', 'performance', 'security', 'usability']).default('bug'),
  status: z.enum(['open', 'in-progress', 'resolved', 'closed', 'rejected']).default('open'),
  // Required fields
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  userStoryId: z.string().min(1, "User story ID is required"),
});

export const updateDefectSchema = insertDefectSchema.partial().extend({
  githubIssue: z.number().int().positive().optional().nullable(),
});

export type Defect = typeof defects.$inferSelect;
export type InsertDefect = z.infer<typeof insertDefectSchema>;
export type UpdateDefect = z.infer<typeof updateDefectSchema>;

// ============================================================
// TEST MANAGEMENT - Test Suites, Cases, Runs, Results
// ============================================================

// Test Suites - Hierarchical organization of test cases
export const testSuites = pgTable("test_suites", {
  id: text("id").primaryKey(), // TS-XXX format
  name: text("name").notNull(),
  description: text("description"),
  parentSuiteId: text("parent_suite_id").references((): any => testSuites.id, { onDelete: 'cascade' }),
  module: text("module"), // plan, wiki, quality, design
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Test Cases - Individual test scenarios with steps
export const testCases = pgTable("test_cases", {
  id: text("id").primaryKey(), // TC-XXX-## format
  suiteId: text("suite_id").references(() => testSuites.id, { onDelete: 'cascade' }).notNull(),
  title: text("title").notNull(),
  preconditions: text("preconditions"),
  steps: jsonb("steps").$type<Array<{
    step: string;
    expected: string;
  }>>().notNull().default([]),
  priority: text("priority").notNull().default("medium"), // critical, high, medium, low
  testType: text("test_type").notNull().default("functional"), // functional, regression, smoke, integration, e2e, manual
  tags: jsonb("tags").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Test Case to Story Links - Traceability junction table
export const testCaseStories = pgTable("test_case_stories", {
  testCaseId: text("test_case_id").references(() => testCases.id, { onDelete: 'cascade' }).notNull(),
  storyId: text("story_id").references(() => userStories.id, { onDelete: 'cascade' }).notNull(),
}, (table) => ({
  pk: { primaryKey: table.testCaseId, table.storyId },
}));

// Test Runs - Execution sessions for test suites
export const testRuns = pgTable("test_runs", {
  id: text("id").primaryKey(), // TR-XXX format
  suiteId: text("suite_id").references(() => testSuites.id, { onDelete: 'cascade' }).notNull(),
  name: text("name").notNull(),
  assignedTo: text("assigned_to"),
  environment: text("environment").default("staging"), // local, staging, production
  status: text("status").notNull().default("in-progress"), // in-progress, completed, cancelled
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Test Results - Individual test case execution records
export const testResults = pgTable("test_results", {
  id: text("id").primaryKey(),
  runId: text("run_id").references(() => testRuns.id, { onDelete: 'cascade' }).notNull(),
  caseId: text("case_id").references(() => testCases.id).notNull(),
  status: text("status").notNull().default("not-run"), // passed, failed, blocked, skipped, not-run
  notes: text("notes"),
  screenshotUrl: text("screenshot_url"),
  executedBy: text("executed_by"),
  executedAt: timestamp("executed_at"),
  durationMs: integer("duration_ms"), // Test execution time in milliseconds
  createdAt: timestamp("created_at").defaultNow(),
});

// Test Result Defects - Link failed tests to defects
export const testResultDefects = pgTable("test_result_defects", {
  resultId: text("result_id").references(() => testResults.id, { onDelete: 'cascade' }).notNull(),
  defectId: varchar("defect_id").references(() => defects.id, { onDelete: 'cascade' }).notNull(),
}, (table) => ({
  pk: { primaryKey: table.resultId, table.defectId },
}));

// Test Suite validation schemas
export const insertTestSuiteSchema = createInsertSchema(testSuites).omit({
  createdAt: true,
  updatedAt: true,
}).extend({
  module: z.enum(['plan', 'wiki', 'quality', 'design', 'canvas', 'agent']).optional().nullable(),
});

export const updateTestSuiteSchema = insertTestSuiteSchema.partial();

// Test Case validation schemas
export const insertTestCaseSchema = createInsertSchema(testCases).omit({
  createdAt: true,
  updatedAt: true,
}).extend({
  priority: z.enum(['critical', 'high', 'medium', 'low']).default('medium'),
  testType: z.enum(['functional', 'regression', 'smoke', 'integration', 'e2e', 'manual']).default('functional'),
  steps: z.array(z.object({
    step: z.string().min(1),
    expected: z.string().min(1),
  })).min(1, "At least one test step is required"),
});

export const updateTestCaseSchema = insertTestCaseSchema.partial();

// Test Run validation schemas
export const insertTestRunSchema = createInsertSchema(testRuns).omit({
  id: true,
  createdAt: true,
  startedAt: true,
  completedAt: true,
}).extend({
  environment: z.enum(['local', 'staging', 'production']).default('staging'),
  status: z.enum(['in-progress', 'completed', 'cancelled']).default('in-progress'),
});

export const updateTestRunSchema = insertTestRunSchema.partial();

// Test Result validation schemas
export const insertTestResultSchema = createInsertSchema(testResults).omit({
  id: true,
  createdAt: true,
  executedAt: true,
}).extend({
  status: z.enum(['passed', 'failed', 'blocked', 'skipped', 'not-run']).default('not-run'),
});

export const updateTestResultSchema = insertTestResultSchema.partial();

// Type exports
export type TestSuite = typeof testSuites.$inferSelect;
export type InsertTestSuite = z.infer<typeof insertTestSuiteSchema>;
export type UpdateTestSuite = z.infer<typeof updateTestSuiteSchema>;

export type TestCase = typeof testCases.$inferSelect;
export type InsertTestCase = z.infer<typeof insertTestCaseSchema>;
export type UpdateTestCase = z.infer<typeof updateTestCaseSchema>;

export type TestRun = typeof testRuns.$inferSelect;
export type InsertTestRun = z.infer<typeof insertTestRunSchema>;
export type UpdateTestRun = z.infer<typeof updateTestRunSchema>;

export type TestResult = typeof testResults.$inferSelect;
export type InsertTestResult = z.infer<typeof insertTestResultSchema>;
export type UpdateTestResult = z.infer<typeof updateTestResultSchema>;

// ============================================================
// CODE CHANGES - Links PRs, Commits, Branches to Work Items
// ============================================================

export const codeChanges = pgTable("code_changes", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Link to work items (polymorphic - either user story or defect)
  entityType: text("entity_type").notNull(), // 'user_story', 'defect', 'epic'
  entityId: text("entity_id").notNull(), // US-XXXXXXX or DEF-XXXXXXX or EPIC-XX
  
  // Change type
  changeType: text("change_type").notNull(), // 'pull_request', 'commit', 'branch'
  
  // GitHub/Git metadata
  provider: text("provider").notNull().default("github"), // 'github', 'gitlab', 'bitbucket', 'azure_devops'
  repository: text("repository").notNull(), // owner/repo format
  
  // For Pull Requests
  prNumber: integer("pr_number"),
  prTitle: text("pr_title"),
  prState: text("pr_state"), // 'open', 'closed', 'merged', 'draft'
  prUrl: text("pr_url"),
  prBaseBranch: text("pr_base_branch"), // target branch (e.g., 'main')
  prHeadBranch: text("pr_head_branch"), // source branch (e.g., 'feature/US-001')
  prMergedAt: timestamp("pr_merged_at"),
  prMergedBy: text("pr_merged_by"),
  
  // For Commits
  commitSha: text("commit_sha"),
  commitMessage: text("commit_message"),
  commitUrl: text("commit_url"),
  
  // For Branches
  branchName: text("branch_name"),
  branchUrl: text("branch_url"),
  
  // Author info
  authorUsername: text("author_username"),
  authorEmail: text("author_email"),
  authorAvatarUrl: text("author_avatar_url"),
  
  // Timestamps
  eventTimestamp: timestamp("event_timestamp").notNull(), // When the PR/commit/branch was created
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  
  // Sync metadata
  syncSource: text("sync_source").default("manual"), // 'webhook', 'manual', 'api_poll'
  externalId: text("external_id"), // GitHub's internal ID for deduplication
});

export const insertCodeChangeSchema = createInsertSchema(codeChanges).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  entityType: z.enum(['user_story', 'defect', 'epic']),
  changeType: z.enum(['pull_request', 'commit', 'branch']),
  provider: z.enum(['github', 'gitlab', 'bitbucket', 'azure_devops']).default('github'),
  prState: z.enum(['open', 'closed', 'merged', 'draft']).optional().nullable(),
});

export type CodeChange = typeof codeChanges.$inferSelect;
export type InsertCodeChange = z.infer<typeof insertCodeChangeSchema>;

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

  // Planning (Target/Planned dates)
  startDate: text("start_date"), // Planned start (text for flexibility: "2025-Q1", "2025-01-15")
  endDate: text("end_date"), // Planned end
  targetQuarter: text("target_quarter"), // Q1 2025, Q2 2025, etc.

  // Actual dates (US-8KE9R60) - auto-populated from stories
  actualStartDate: timestamp("actual_start_date"), // When first story started
  actualEndDate: timestamp("actual_end_date"), // When last story completed

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

// Applications - Application Portfolio Management (APM) / CMDB
export const applications = pgTable("applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),

  // Basic Information
  name: text("name").notNull(),
  description: text("description"),

  // Classification
  type: text("type").notNull().default("web_application"), // 'web_application', 'mobile_app', 'api_service', 'database', 'infrastructure', 'saas_tool', 'custom'
  category: text("category").notNull().default("business"), // 'business', 'technical', 'infrastructure', 'integration', 'data', 'security'

  // Technology Stack
  technologyStack: jsonb("technology_stack").$type<{
    frontend?: string[];
    backend?: string[];
    database?: string[];
    infrastructure?: string[];
    thirdParty?: string[];
  }>().default({}),

  // Ownership & Governance
  owner: text("owner"), // Primary owner/maintainer
  team: text("team"), // Owning team
  stakeholders: jsonb("stakeholders").$type<string[]>().default([]),

  // Business Context
  businessCapabilities: jsonb("business_capabilities").$type<string[]>().default([]),
  criticality: text("criticality").notNull().default("medium"), // 'low', 'medium', 'high', 'critical'
  businessValue: text("business_value"), // Description of business value

  // Technical Details
  hostingEnvironment: text("hosting_environment"), // 'on_premise', 'aws', 'azure', 'gcp', 'hybrid', 'multi_cloud'
  region: text("region"), // Geographic region/data center
  architecture: text("architecture"), // 'monolithic', 'microservices', 'serverless', 'event_driven'

  // Integration & Dependencies
  integrations: jsonb("integrations").$type<Array<{
    name: string;
    type: string;
    direction: 'inbound' | 'outbound' | 'bidirectional';
  }>>().default([]),
  dependencies: jsonb("dependencies").$type<string[]>().default([]), // Application IDs this app depends on

  // Performance & Operational Metrics
  metrics: jsonb("metrics").$type<{
    uptime?: number;
    responseTime?: number;
    errorRate?: number;
    throughput?: number;
    customMetrics?: Record<string, any>;
  }>().default({}),

  // Cost Management
  costCenter: text("cost_center"),
  annualCost: integer("annual_cost"), // Annual cost in dollars
  costBreakdown: jsonb("cost_breakdown").$type<{
    infrastructure?: number;
    licenses?: number;
    maintenance?: number;
    support?: number;
  }>().default({}),

  // Lifecycle Management
  status: text("status").notNull().default("active"), // 'active', 'deprecated', 'retired', 'planned', 'development'
  version: text("version").default("1.0.0"),
  deployedDate: text("deployed_date"), // ISO date string
  retirementDate: text("retirement_date"), // Planned retirement date

  // External References
  repositoryUrl: text("repository_url"),
  documentationUrl: text("documentation_url"),
  monitoringUrl: text("monitoring_url"),

  // Metadata
  tags: jsonb("tags").$type<string[]>().default([]),
  notes: text("notes"), // Additional notes or context

  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Application validation schemas
export const insertApplicationSchema = createInsertSchema(applications).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  name: z.string().min(1, "Application name is required"),
  type: z.enum(['web_application', 'mobile_app', 'api_service', 'database', 'infrastructure', 'saas_tool', 'custom']).default('web_application'),
  category: z.enum(['business', 'technical', 'infrastructure', 'integration', 'data', 'security']).default('business'),
  criticality: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  status: z.enum(['active', 'deprecated', 'retired', 'planned', 'development']).default('active'),
});

export const updateApplicationSchema = insertApplicationSchema.partial();

export type Application = typeof applications.$inferSelect;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type UpdateApplication = z.infer<typeof updateApplicationSchema>;

// Jira Integration - Native bi-directional sync infrastructure
// Each system maintains own IDs with mapping table approach

// ID Mapping table - Links ARKHITEKTON entities to Jira issues
export const jiraIntegrationMappings = pgTable("jira_integration_mappings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),

  // ARKHITEKTON entity
  arkhitektonId: varchar("arkhitekton_id").notNull(),
  arkhitektonType: varchar("arkhitekton_type").notNull(), // 'user_story', 'defect', 'epic'

  // Jira entity
  jiraIssueKey: varchar("jira_issue_key").notNull(), // PROJ-1234
  jiraIssueId: varchar("jira_issue_id").notNull(), // 10001 (numeric ID)
  jiraIssueType: varchar("jira_issue_type").notNull(), // 'Story', 'Bug', 'Epic'
  jiraProjectKey: varchar("jira_project_key").notNull(), // PROJ

  // Sync metadata
  syncDirection: varchar("sync_direction"), // 'to_jira', 'from_jira', 'bi_directional'
  lastSyncedAt: timestamp("last_synced_at").defaultNow(),
  syncStatus: varchar("sync_status").default("active"), // 'active', 'paused', 'error'

  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Sync audit logs - Track all sync operations for debugging and compliance
export const jiraSyncLogs = pgTable("jira_sync_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),

  // Mapping reference
  mappingId: varchar("mapping_id"),

  // Sync details
  syncDirection: varchar("sync_direction").notNull(), // 'to_jira', 'from_jira'
  syncType: varchar("sync_type").notNull(), // 'create', 'update', 'delete'
  syncSource: varchar("sync_source").notNull(), // 'webhook', 'manual', 'scheduled'

  // Payload
  requestPayload: jsonb("request_payload").$type<any>(),
  responsePayload: jsonb("response_payload").$type<any>(),

  // Status
  status: varchar("status").notNull(), // 'success', 'failed', 'pending', 'retrying'
  errorMessage: text("error_message"),
  errorCode: varchar("error_code"),

  // Performance
  durationMs: integer("duration_ms"),
  retryCount: integer("retry_count").default(0),

  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
});

// Webhook events - Store incoming Jira webhooks for processing
export const jiraWebhookEvents = pgTable("jira_webhook_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),

  // Webhook details
  webhookId: varchar("webhook_id"),
  eventType: varchar("event_type").notNull(), // 'issue:created', 'issue:updated', etc.
  jiraIssueKey: varchar("jira_issue_key").notNull(),

  // Payload
  rawPayload: jsonb("raw_payload").$type<any>().notNull(),

  // Processing
  processedAt: timestamp("processed_at"),
  processingStatus: varchar("processing_status").default("pending"), // 'pending', 'processed', 'failed', 'ignored'
  processingError: text("processing_error"),

  // Idempotency
  idempotencyKey: varchar("idempotency_key").unique(),

  // Timestamps
  receivedAt: timestamp("received_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Jira Integration validation schemas
export const insertJiraMappingSchema = createInsertSchema(jiraIntegrationMappings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertJiraSyncLogSchema = createInsertSchema(jiraSyncLogs).omit({
  id: true,
  createdAt: true,
});

export const insertJiraWebhookEventSchema = createInsertSchema(jiraWebhookEvents).omit({
  id: true,
  receivedAt: true,
  createdAt: true,
});

// Jira Integration types
export type JiraIntegrationMapping = typeof jiraIntegrationMappings.$inferSelect;
export type InsertJiraMapping = z.infer<typeof insertJiraMappingSchema>;
export type JiraSyncLog = typeof jiraSyncLogs.$inferSelect;
export type InsertJiraSyncLog = z.infer<typeof insertJiraSyncLogSchema>;
export type JiraWebhookEvent = typeof jiraWebhookEvents.$inferSelect;
export type InsertJiraWebhookEvent = z.infer<typeof insertJiraWebhookEventSchema>;

// ============================================================
// WIKI KNOWLEDGE CORE - Phase 1 Foundation
// ============================================================

// Wiki Pages - Core content pages with hierarchical organization
export const wikiPages = pgTable("wiki_pages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  // Basic Information
  title: text("title").notNull(),
  content: jsonb("content").$type<any>().notNull(), // TipTap JSON format
  
  // Hierarchical Organization
  parentId: varchar("parent_id"), // References another wiki page for tree structure
  path: text("path"), // Full path like /Architecture/Payment/Stripe for breadcrumbs
  sortOrder: integer("sort_order").default(0), // Order within parent
  
  // Categorization & Templates
  category: text("category"), // 'Governance', 'Standards', 'Procedures', 'Templates', 'Best Practices', 'Architecture Patterns'
  subcategory: text("subcategory"),
  template: text("template"), // 'ADR', 'Design', 'Requirement', 'Meeting', 'RFC', null for custom
  
  // Status & Workflow
  status: text("status").notNull().default("draft"), // 'draft', 'published', 'under_review', 'archived'
  
  // Ownership & Collaboration
  createdBy: varchar("created_by").notNull(),
  updatedBy: varchar("updated_by"),
  contributors: jsonb("contributors").$type<string[]>().default([]),
  
  // Engagement Metrics
  views: integer("views").default(0),
  likes: integer("likes").default(0),
  
  // Metadata & Tagging
  tags: jsonb("tags").$type<string[]>().default([]),
  metadata: jsonb("metadata").$type<Record<string, any>>().default({}),
  
  // External Links
  relatedPageIds: jsonb("related_page_ids").$type<string[]>().default([]), // Links to other wiki pages
  linkedDecisionIds: jsonb("linked_decision_ids").$type<string[]>().default([]), // ADR references
  linkedCapabilityIds: jsonb("linked_capability_ids").$type<string[]>().default([]), // Business capabilities
  attachments: jsonb("attachments").$type<Array<{
    name: string;
    url: string;
    size?: number;
    type?: string;
  }>>().default([]),
  
  // Versioning (basic for Phase 1, full version history in Phase 4)
  version: text("version").default("1.0"),
  
  // Project/Workspace Association
  projectId: varchar("project_id"), // Optional project association
  
  // Full-text search optimization
  searchVector: text("search_vector"), // PostgreSQL tsvector for full-text search
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  publishedAt: timestamp("published_at"),
  archivedAt: timestamp("archived_at"),
});

// Entity Mentions - Track all @mentions for semantic linking and backlinks
export const entityMentions = pgTable("entity_mentions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  // Page Reference
  pageId: varchar("page_id").references(() => wikiPages.id, { onDelete: 'cascade' }).notNull(),
  
  // Entity Reference (cross-module)
  entityType: text("entity_type").notNull(), // 'user_story', 'epic', 'component', 'diagram', 'page', 'requirement', 'adr', 'user', 'application'
  entityId: varchar("entity_id").notNull(), // ID of the mentioned entity
  
  // Display & Position
  text: text("text").notNull(), // Display text of the mention (e.g., "PaymentService")
  position: integer("position").notNull(), // Character offset in the TipTap document
  
  // Status Tracking (for status-aware mentions)
  entityStatus: text("entity_status"), // Cached status of the entity (active, deprecated, sunset)
  lastCheckedAt: timestamp("last_checked_at").defaultNow(), // When status was last updated
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
});

// Wiki Pages validation schemas
export const insertWikiPageSchema = createInsertSchema(wikiPages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  publishedAt: true,
  archivedAt: true,
}).extend({
  title: z.string().min(1, "Page title is required").max(255, "Title must be less than 255 characters"),
  content: z.any(), // TipTap JSON content
  status: z.enum(['draft', 'published', 'under_review', 'archived']).default('draft'),
  category: z.string().optional(),
  template: z.enum(['ADR', 'Design', 'Requirement', 'Meeting', 'RFC', 'Business_Case', 'Runbook', 'Onboarding']).optional().nullable(),
});

export const updateWikiPageSchema = insertWikiPageSchema.partial();

// Entity types supported for @mentions across the platform
export const MENTIONABLE_ENTITY_TYPES = [
  // Plan Module
  'user_story',      // User stories from Plan
  'epic',            // Epics from Plan
  'defect',          // Defects from Quality Center
  
  // Design Studio Module
  'model',           // Architectural models (canvas diagrams)
  'object',          // Architectural objects within models
  'element',         // Architecture elements (shape library)
  
  // Wiki Module
  'page',            // Wiki pages
  'requirement',     // Requirements (wiki pages with template=Requirement)
  'adr',             // Architecture Decision Records
  
  // APM/CMDB Module
  'application',     // Applications from portfolio
  
  // Governance Module
  'capability',      // Business capabilities
  'decision',        // Decisions (alias for ADR)
  
  // People & Teams
  'user',            // System users
  'team',            // Teams (future)
  
  // Legacy (for backward compatibility)
  'component',       // Alias for 'object'
  'diagram',         // Alias for 'model'
] as const;

export type MentionableEntityType = typeof MENTIONABLE_ENTITY_TYPES[number];

export const insertEntityMentionSchema = createInsertSchema(entityMentions).omit({
  id: true,
  createdAt: true,
}).extend({
  entityType: z.enum(MENTIONABLE_ENTITY_TYPES),
  entityId: z.string().min(1, "Entity ID is required"),
  text: z.string().min(1, "Mention text is required"),
  position: z.number().int().min(0),
});

// Wiki types
export type WikiPage = typeof wikiPages.$inferSelect;
export type InsertWikiPage = z.infer<typeof insertWikiPageSchema>;
export type UpdateWikiPage = z.infer<typeof updateWikiPageSchema>;
export type EntityMention = typeof entityMentions.$inferSelect;
export type InsertEntityMention = z.infer<typeof insertEntityMentionSchema>;

// ============================================================
// KNOWLEDGE BASE (Legacy - to be migrated to Wiki)
// ============================================================

// Keeping existing KnowledgeBasePage for backward compatibility
// Will migrate to wikiPages in future sprint
