CREATE TABLE "achievements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"category" text NOT NULL,
	"tier" text NOT NULL,
	"iconName" text NOT NULL,
	"color" text NOT NULL,
	"criteria" jsonb NOT NULL,
	"basePoints" integer NOT NULL,
	"bonusMultiplier" integer DEFAULT 1,
	"prerequisites" jsonb DEFAULT '[]'::jsonb,
	"isHidden" integer DEFAULT 0,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "application_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" text NOT NULL,
	"value" text NOT NULL,
	"category" text NOT NULL,
	"is_sensitive" integer DEFAULT 1 NOT NULL,
	"description" text,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "application_settings_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "architectural_models" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"domain" text NOT NULL,
	"type" text NOT NULL,
	"version" text DEFAULT '1.0.0',
	"state" text DEFAULT 'master' NOT NULL,
	"parentModelId" uuid,
	"ownerId" varchar NOT NULL,
	"stakeholders" jsonb DEFAULT '[]'::jsonb,
	"canvasData" jsonb,
	"documentationPages" jsonb DEFAULT '[]'::jsonb,
	"metrics" jsonb DEFAULT '{}'::jsonb,
	"externalRefs" jsonb DEFAULT '{}'::jsonb,
	"status" text DEFAULT 'active' NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "architectural_objects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"modelId" uuid NOT NULL,
	"name" text NOT NULL,
	"objectType" text NOT NULL,
	"domain" text NOT NULL,
	"category" text NOT NULL,
	"visual" jsonb NOT NULL,
	"semantics" jsonb DEFAULT '{"purpose":"","responsibilities":[],"constraints":[],"patterns":[]}'::jsonb,
	"lifecycle" jsonb DEFAULT '{"state":"draft","milestones":[],"decisions":[],"changes":[]}'::jsonb,
	"metrics" jsonb DEFAULT '{}'::jsonb,
	"implementation" jsonb DEFAULT '{}'::jsonb,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "architecture_elements" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"category" text NOT NULL,
	"framework" text DEFAULT 'archimate' NOT NULL,
	"description" text NOT NULL,
	"usageGuidelines" text,
	"iconName" text,
	"color" text NOT NULL,
	"shape" text NOT NULL,
	"relationships" jsonb DEFAULT '[]'::jsonb,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "documentation_pages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"modelId" uuid,
	"title" text NOT NULL,
	"content" jsonb NOT NULL,
	"parentPageId" uuid,
	"order" integer DEFAULT 0,
	"authorId" varchar NOT NULL,
	"collaborators" jsonb DEFAULT '[]'::jsonb,
	"externalSync" jsonb,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "epics" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text DEFAULT '',
	"value_stream" text NOT NULL,
	"target_personas" jsonb DEFAULT '[]'::jsonb,
	"core_capabilities" jsonb DEFAULT '[]'::jsonb,
	"key_features" jsonb DEFAULT '[]'::jsonb,
	"status" text DEFAULT 'planned' NOT NULL,
	"priority" text DEFAULT 'medium' NOT NULL,
	"owner" text,
	"stakeholders" jsonb DEFAULT '[]'::jsonb,
	"start_date" text,
	"end_date" text,
	"target_quarter" text,
	"completion_percentage" integer DEFAULT 0,
	"total_story_points" integer DEFAULT 0,
	"completed_story_points" integer DEFAULT 0,
	"business_goals" jsonb DEFAULT '[]'::jsonb,
	"success_metrics" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "integration_channels" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"toolId" text NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"directionality" text NOT NULL,
	"capabilities" jsonb DEFAULT '[]'::jsonb,
	"connectionConfig" jsonb NOT NULL,
	"version" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"documentation" text,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	CONSTRAINT "integration_channels_toolId_unique" UNIQUE("toolId")
);
--> statement-breakpoint
CREATE TABLE "knowledge_base_pages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"slug" text,
	"content" text DEFAULT '' NOT NULL,
	"category" text DEFAULT 'General',
	"status" text DEFAULT 'draft',
	"tags" jsonb DEFAULT '[]'::jsonb,
	"parentPageId" uuid,
	"order" integer DEFAULT 0,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "leaderboards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"type" text NOT NULL,
	"scope" text NOT NULL,
	"startDate" timestamp,
	"endDate" timestamp,
	"rankings" jsonb DEFAULT '[]'::jsonb,
	"maxParticipants" integer DEFAULT 100,
	"isActive" integer DEFAULT 1,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "model_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"modelId" uuid NOT NULL,
	"version" text NOT NULL,
	"commitMessage" text,
	"authorId" varchar NOT NULL,
	"parentVersionId" uuid,
	"modelSnapshot" jsonb NOT NULL,
	"changes" jsonb,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "object_connections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sourceObjectId" uuid NOT NULL,
	"targetObjectId" uuid NOT NULL,
	"relationshipType" text NOT NULL,
	"direction" text DEFAULT 'directed' NOT NULL,
	"visual" jsonb,
	"properties" jsonb DEFAULT '{}'::jsonb,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "object_sync_flows" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"integrationChannelId" uuid NOT NULL,
	"objectTypes" jsonb DEFAULT '[]'::jsonb,
	"sourceScope" text NOT NULL,
	"targetScope" text NOT NULL,
	"stateTransitions" jsonb DEFAULT '[]'::jsonb,
	"conflictResolution" jsonb DEFAULT '{"strategy":"manual","mergePatterns":[],"reviewRequired":true}'::jsonb,
	"currentState" text DEFAULT 'draft' NOT NULL,
	"stateVersion" integer DEFAULT 1,
	"lastSyncAt" timestamp,
	"syncMetrics" jsonb DEFAULT '{"successCount":0,"errorCount":0,"avgSyncTime":0,"objectsProcessed":0}'::jsonb,
	"isActive" integer DEFAULT 1,
	"syncTriggers" jsonb DEFAULT '[]'::jsonb,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "page_comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pageId" uuid NOT NULL,
	"parentCommentId" uuid,
	"content" text NOT NULL,
	"authorId" varchar NOT NULL,
	"blockId" text,
	"position" integer,
	"isResolved" integer DEFAULT 0,
	"resolvedBy" varchar,
	"resolvedAt" timestamp,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "page_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pageId" uuid NOT NULL,
	"versionNumber" integer NOT NULL,
	"title" text NOT NULL,
	"content" jsonb NOT NULL,
	"changeLog" text,
	"authorId" varchar NOT NULL,
	"changes" jsonb DEFAULT '[]'::jsonb,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "recent_elements" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" varchar NOT NULL,
	"elementId" varchar NOT NULL,
	"usedAt" timestamp DEFAULT now(),
	"usageCount" integer DEFAULT 1
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"completed" integer DEFAULT 0 NOT NULL,
	"priority" text DEFAULT 'medium' NOT NULL,
	"category" text NOT NULL,
	"status" text DEFAULT 'todo' NOT NULL,
	"assignee" text,
	"due_date" text,
	"start_date" text,
	"end_date" text,
	"dependencies" jsonb DEFAULT '[]'::jsonb,
	"subtasks" jsonb DEFAULT '[]'::jsonb,
	"abilities" jsonb DEFAULT '[]'::jsonb,
	"comments" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "user_achievements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" varchar NOT NULL,
	"achievementId" uuid NOT NULL,
	"currentProgress" integer DEFAULT 0,
	"maxProgress" integer NOT NULL,
	"isUnlocked" integer DEFAULT 0,
	"modelId" uuid,
	"triggerData" jsonb DEFAULT '{}'::jsonb,
	"pointsEarned" integer DEFAULT 0,
	"bonusEarned" integer DEFAULT 0,
	"firstProgressAt" timestamp DEFAULT now(),
	"unlockedAt" timestamp,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_game_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" varchar NOT NULL,
	"totalPoints" integer DEFAULT 0,
	"currentLevel" integer DEFAULT 1,
	"experiencePoints" integer DEFAULT 0,
	"nextLevelThreshold" integer DEFAULT 100,
	"achievementsUnlocked" integer DEFAULT 0,
	"bronzeCount" integer DEFAULT 0,
	"silverCount" integer DEFAULT 0,
	"goldCount" integer DEFAULT 0,
	"platinumCount" integer DEFAULT 0,
	"diamondCount" integer DEFAULT 0,
	"modelingStats" jsonb DEFAULT '{"totalModels":0,"totalObjects":0,"totalConnections":0,"averageComplexity":0,"semanticDepthScore":0,"patternDiversityScore":0,"consistencyScore":0,"collaborationScore":0}'::jsonb,
	"currentStreak" integer DEFAULT 0,
	"longestStreak" integer DEFAULT 0,
	"lastActivityAt" timestamp DEFAULT now(),
	"celebrationEnabled" integer DEFAULT 1,
	"leaderboardVisible" integer DEFAULT 1,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	CONSTRAINT "user_game_profiles_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE "user_stories" (
	"id" text PRIMARY KEY NOT NULL,
	"parent_task_id" uuid,
	"epic_id" text,
	"title" text NOT NULL,
	"description" text DEFAULT '',
	"acceptance_criteria" text NOT NULL,
	"story_points" integer DEFAULT 3 NOT NULL,
	"status" text DEFAULT 'backlog' NOT NULL,
	"priority" text DEFAULT 'medium' NOT NULL,
	"assignee" text,
	"product_manager" text,
	"tech_lead" text,
	"feature" text,
	"value" text,
	"requirement" text,
	"github_repo" text,
	"github_branch" text,
	"github_issue" integer,
	"github_commits" jsonb DEFAULT '[]'::jsonb,
	"labels" jsonb DEFAULT '[]'::jsonb,
	"screenshots" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "architectural_objects" ADD CONSTRAINT "architectural_objects_modelId_architectural_models_id_fk" FOREIGN KEY ("modelId") REFERENCES "public"."architectural_models"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documentation_pages" ADD CONSTRAINT "documentation_pages_modelId_architectural_models_id_fk" FOREIGN KEY ("modelId") REFERENCES "public"."architectural_models"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "model_versions" ADD CONSTRAINT "model_versions_modelId_architectural_models_id_fk" FOREIGN KEY ("modelId") REFERENCES "public"."architectural_models"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "object_connections" ADD CONSTRAINT "object_connections_sourceObjectId_architectural_objects_id_fk" FOREIGN KEY ("sourceObjectId") REFERENCES "public"."architectural_objects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "object_connections" ADD CONSTRAINT "object_connections_targetObjectId_architectural_objects_id_fk" FOREIGN KEY ("targetObjectId") REFERENCES "public"."architectural_objects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "object_sync_flows" ADD CONSTRAINT "object_sync_flows_integrationChannelId_integration_channels_id_fk" FOREIGN KEY ("integrationChannelId") REFERENCES "public"."integration_channels"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page_comments" ADD CONSTRAINT "page_comments_pageId_knowledge_base_pages_id_fk" FOREIGN KEY ("pageId") REFERENCES "public"."knowledge_base_pages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page_versions" ADD CONSTRAINT "page_versions_pageId_knowledge_base_pages_id_fk" FOREIGN KEY ("pageId") REFERENCES "public"."knowledge_base_pages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_achievements" ADD CONSTRAINT "user_achievements_achievementId_achievements_id_fk" FOREIGN KEY ("achievementId") REFERENCES "public"."achievements"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_achievements" ADD CONSTRAINT "user_achievements_modelId_architectural_models_id_fk" FOREIGN KEY ("modelId") REFERENCES "public"."architectural_models"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_stories" ADD CONSTRAINT "user_stories_parent_task_id_tasks_id_fk" FOREIGN KEY ("parent_task_id") REFERENCES "public"."tasks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_stories" ADD CONSTRAINT "user_stories_epic_id_epics_id_fk" FOREIGN KEY ("epic_id") REFERENCES "public"."epics"("id") ON DELETE no action ON UPDATE no action;