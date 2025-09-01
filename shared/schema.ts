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
  usageGuidelines: text("usage_guidelines"),
  iconName: text("icon_name"),
  color: text("color").notNull(),
  shape: text("shape").notNull(), // 'rectangular', 'rounded', 'diamond'
  relationships: jsonb("relationships").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

export const recentElements = pgTable("recent_elements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  elementId: varchar("element_id").notNull(),
  usedAt: timestamp("used_at").defaultNow(),
  usageCount: integer("usage_count").default(1),
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
export const architecturalModels = pgTable("architectural_models", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  domain: text("domain").notNull(), // 'software', 'data', 'infrastructure', 'integration', 'security', 'business'
  type: text("type").notNull(), // 'system', 'component', 'service', 'process', 'capability', 'custom'
  version: text("version").default("1.0.0"),
  
  // Master state vs transition state
  state: text("state").notNull().default("master"), // 'master', 'transition', 'archived'
  parentModelId: uuid("parent_model_id").references(() => architecturalModels.id), // For transition states
  
  // Model ownership and governance
  ownerId: varchar("owner_id").notNull(),
  stakeholders: jsonb("stakeholders").$type<string[]>().default([]),
  
  // Visual canvas data
  canvasData: jsonb("canvas_data").$type<{
    objects: any[];
    connections: any[];
    viewport: any;
    layouts: any[];
  }>(),
  
  // Documentation integration
  documentationPages: jsonb("documentation_pages").$type<string[]>().default([]),
  
  // Metrics and outcomes
  metrics: jsonb("metrics").$type<Record<string, any>>().default({}),
  
  // External integrations
  externalRefs: jsonb("external_refs").$type<{
    confluence?: string[];
    sharepoint?: string[];
    notion?: string[];
    custom?: Record<string, string>;
  }>().default({}),
  
  // Lifecycle
  status: text("status").notNull().default("active"), // 'active', 'deprecated', 'retired'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Architectural Objects - Universal intelligent objects
export const architecturalObjects = pgTable("architectural_objects", {
  id: uuid("id").primaryKey().defaultRandom(),
  modelId: uuid("model_id").references(() => architecturalModels.id).notNull(),
  name: text("name").notNull(),
  
  // Object classification
  objectType: text("object_type").notNull(), // 'standard', 'custom', 'derived'
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
  }>().default({}),
  
  // Lifecycle tracking
  lifecycle: jsonb("lifecycle").$type<{
    state: string;
    milestones: any[];
    decisions: string[];
    changes: any[];
  }>().default({}),
  
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
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Object connections and relationships
export const objectConnections = pgTable("object_connections", {
  id: uuid("id").primaryKey().defaultRandom(),
  sourceObjectId: uuid("source_object_id").references(() => architecturalObjects.id).notNull(),
  targetObjectId: uuid("target_object_id").references(() => architecturalObjects.id).notNull(),
  
  // Connection semantics
  relationshipType: text("relationship_type").notNull(), // 'depends_on', 'implements', 'calls', 'stores_in', 'deployed_on'
  direction: text("direction").notNull().default("directed"), // 'directed', 'bidirectional', 'undirected'
  
  // Visual representation
  visual: jsonb("visual").$type<{
    path: any[];
    styling: any;
    labels: any[];
  }>(),
  
  // Connection metadata
  properties: jsonb("properties").$type<Record<string, any>>().default({}),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Documentation pages with model embedding
export const documentationPages = pgTable("documentation_pages", {
  id: uuid("id").primaryKey().defaultRandom(),
  modelId: uuid("model_id").references(() => architecturalModels.id),
  title: text("title").notNull(),
  
  // Rich text content with embedded references
  content: jsonb("content").$type<{
    blocks: any[];
    embeddings: { type: string; id: string; position: number }[];
  }>().notNull(),
  
  // Page metadata
  parentPageId: uuid("parent_page_id").references(() => documentationPages.id),
  order: integer("order").default(0),
  
  // Collaboration
  authorId: varchar("author_id").notNull(),
  collaborators: jsonb("collaborators").$type<string[]>().default([]),
  
  // External sync
  externalSync: jsonb("external_sync").$type<{
    confluence?: { spaceId: string; pageId: string; lastSync: string };
    sharepoint?: { siteId: string; listId: string; itemId: string; lastSync: string };
    notion?: { databaseId: string; pageId: string; lastSync: string };
  }>(),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Version control for models
export const modelVersions = pgTable("model_versions", {
  id: uuid("id").primaryKey().defaultRandom(),
  modelId: uuid("model_id").references(() => architecturalModels.id).notNull(),
  version: text("version").notNull(),
  
  // Version metadata
  commitMessage: text("commit_message"),
  authorId: varchar("author_id").notNull(),
  parentVersionId: uuid("parent_version_id").references(() => modelVersions.id),
  
  // Snapshot of model state
  modelSnapshot: jsonb("model_snapshot").$type<{
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
  
  createdAt: timestamp("created_at").defaultNow()
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

// Gamified Achievement System for Modeling Complexity
export const achievements = pgTable("achievements", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Achievement definition
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // 'complexity', 'collaboration', 'quality', 'consistency', 'innovation'
  tier: text("tier").notNull(), // 'bronze', 'silver', 'gold', 'platinum', 'diamond'
  
  // Visual representation
  iconName: text("icon_name").notNull(),
  color: text("color").notNull(),
  
  // Scoring criteria
  criteria: jsonb("criteria").$type<{
    metric: string; // 'object_count', 'connection_density', 'semantic_depth', 'pattern_usage'
    threshold: number;
    operator: 'gte' | 'lte' | 'eq'; // greater than equal, less than equal, equal
    weight: number; // scoring weight
  }[]>().notNull(),
  
  // Points awarded
  basePoints: integer("base_points").notNull(),
  bonusMultiplier: integer("bonus_multiplier").default(1),
  
  // Progression requirements  
  prerequisites: jsonb("prerequisites").$type<string[]>().default([]), // Achievement IDs required first
  isHidden: integer("is_hidden").default(0), // 0 = visible, 1 = hidden until unlocked
  
  createdAt: timestamp("created_at").defaultNow()
});

// User achievement progress and unlocks
export const userAchievements = pgTable("user_achievements", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").notNull(),
  achievementId: uuid("achievement_id").references(() => achievements.id).notNull(),
  
  // Progress tracking
  currentProgress: integer("current_progress").default(0),
  maxProgress: integer("max_progress").notNull(),
  isUnlocked: integer("is_unlocked").default(0), // 0 = in progress, 1 = unlocked
  
  // Achievement context
  modelId: uuid("model_id").references(() => architecturalModels.id), // Model that triggered achievement
  triggerData: jsonb("trigger_data").$type<Record<string, any>>().default({}),
  
  // Rewards
  pointsEarned: integer("points_earned").default(0),
  bonusEarned: integer("bonus_earned").default(0),
  
  // Timestamps
  firstProgressAt: timestamp("first_progress_at").defaultNow(),
  unlockedAt: timestamp("unlocked_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// User gamification profile
export const userGameProfiles = pgTable("user_game_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").notNull().unique(),
  
  // Experience and progression
  totalPoints: integer("total_points").default(0),
  currentLevel: integer("current_level").default(1),
  experiencePoints: integer("experience_points").default(0),
  nextLevelThreshold: integer("next_level_threshold").default(100),
  
  // Achievement statistics
  achievementsUnlocked: integer("achievements_unlocked").default(0),
  bronzeCount: integer("bronze_count").default(0),
  silverCount: integer("silver_count").default(0),
  goldCount: integer("gold_count").default(0),
  platinumCount: integer("platinum_count").default(0),
  diamondCount: integer("diamond_count").default(0),
  
  // Modeling complexity metrics
  modelingStats: jsonb("modeling_stats").$type<{
    totalModels: number;
    totalObjects: number;
    totalConnections: number;
    averageComplexity: number;
    semanticDepthScore: number;
    patternDiversityScore: number;
    consistencyScore: number;
    collaborationScore: number;
  }>().default({}),
  
  // Streaks and engagement
  currentStreak: integer("current_streak").default(0), // Days of consecutive modeling
  longestStreak: integer("longest_streak").default(0),
  lastActivityAt: timestamp("last_activity_at").defaultNow(),
  
  // Preferences
  celebrationEnabled: integer("celebration_enabled").default(1), // 0 = disabled, 1 = enabled
  leaderboardVisible: integer("leaderboard_visible").default(1),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
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
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  
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
  maxParticipants: integer("max_participants").default(100),
  isActive: integer("is_active").default(1),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
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
