-- Migration: Drop parent_task_id column from user_stories
-- Epic-based organization replaces parent-child task hierarchy
-- Date: 2025-10-10

ALTER TABLE "user_stories" DROP COLUMN IF EXISTS "parent_task_id";
ALTER TABLE "user_stories" DROP CONSTRAINT IF EXISTS "user_stories_parent_task_id_tasks_id_fk";
