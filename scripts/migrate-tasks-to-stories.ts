/**
 * Migration Script: Tasks → User Stories
 * 
 * Strategy: Option A - Smart Epic Mapping
 * Maps legacy task categories to appropriate Epics based on EA Value Streams
 * 
 * Category Mapping:
 * - foundation, ux → EPIC-2 (Architecture Design & Modeling)
 * - ai → EPIC-5 (Operations & Intelligence)
 * - knowledge-base → EPIC-6 (Knowledge & Collaboration)
 * - modeling → EPIC-2 (Architecture Design & Modeling)
 * - integration → EPIC-4 (Development & Implementation)
 * 
 * Technical Approach:
 * - Uses shared insertUserStorySchema for LOCAL validation before API calls
 * - Generates proper Gherkin format with Scenario line
 * - Lets system auto-generate story IDs (no custom ID collisions)
 * - Preserves traceability via labels (original task ID, category)
 */

import { insertUserStorySchema, type InsertUserStory } from '../shared/schema';

const API_BASE = 'http://localhost:5000';

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: string;
  category: string;
  status: string;
  assignee: string | null;
  dueDate: string | null;
  createdAt: string;
}

interface MigrationResult {
  success: number;
  failed: number;
  errors: Array<{ taskId: string; taskTitle: string; error: string }>;
  mappings: Array<{ taskId: string; storyId: string; epic: string; originalCategory: string }>;
}

// Category to Epic mapping (Option A)
const CATEGORY_TO_EPIC: Record<string, string> = {
  'foundation': 'EPIC-2',
  'ux': 'EPIC-2',
  'ai': 'EPIC-5',
  'knowledge-base': 'EPIC-6',
  'modeling': 'EPIC-2',
  'integration': 'EPIC-4',
};

// Task status to Story status mapping
const STATUS_MAPPING: Record<string, string> = {
  'todo': 'backlog',
  'in-progress': 'in-progress',
  'completed': 'done',
};

// Priority mapping (keep same)
const PRIORITY_MAPPING: Record<string, string> = {
  'high': 'high',
  'medium': 'medium',
  'low': 'low',
};

/**
 * Convert task to proper Gherkin acceptance criteria with Scenario line
 * Follows format required by isValidGherkin validator
 */
function generateAcceptanceCriteria(task: Task): string {
  const description = task.description || task.title;
  
  // Proper Gherkin format with Scenario line (required by validator)
  return `Scenario: Migrated task functionality

Given the system has the legacy task "${task.title}"
When the feature is implemented as a user story
Then ${description}`;
}

/**
 * Map task to Epic ID based on category
 */
function mapTaskToEpic(task: Task): string {
  const epic = CATEGORY_TO_EPIC[task.category];
  if (!epic) {
    console.warn(`⚠️  Unknown category "${task.category}" for task ${task.id}, defaulting to EPIC-4`);
    return 'EPIC-4'; // Default to Development & Implementation
  }
  return epic;
}

/**
 * Fetch all tasks from API
 */
async function fetchAllTasks(): Promise<Task[]> {
  const response = await fetch(`${API_BASE}/api/tasks`);
  if (!response.ok) {
    throw new Error(`Failed to fetch tasks: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Create user story from task with LOCAL validation before API call
 * Returns the created story with system-generated ID
 */
async function createStoryFromTask(
  task: Task,
  epicId: string
): Promise<{ id: string; title: string }> {
  // Build story payload matching InsertUserStory type
  // NOTE: ID is NOT included - system generates it automatically
  const storyPayload = {
    epicId: epicId,
    title: task.title,
    description: task.description || `Migrated from legacy task: ${task.title}`,
    acceptanceCriteria: generateAcceptanceCriteria(task),
    status: STATUS_MAPPING[task.status] as 'backlog' | 'sprint' | 'in-progress' | 'review' | 'done',
    priority: PRIORITY_MAPPING[task.priority] as 'low' | 'medium' | 'high',
    assignee: task.assignee || undefined,
    storyPoints: 3, // Default story points (required, 1-13)
    labels: [
      'migrated-from-task',
      `original-task-id:${task.id}`,
      `original-category:${task.category}`,
      ...(task.completed ? ['originally-completed'] : [])
    ],
  };

  // CRITICAL: Validate locally BEFORE sending to API
  // This catches validation errors before the API call
  try {
    insertUserStorySchema.parse(storyPayload);
  } catch (validationError) {
    throw new Error(`Local validation failed: ${validationError instanceof Error ? validationError.message : String(validationError)}`);
  }

  // Validation passed, now send to API
  const response = await fetch(`${API_BASE}/api/user-stories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(storyPayload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error: ${errorText}`);
  }

  const createdStory = await response.json();
  return { id: createdStory.id, title: createdStory.title };
}

/**
 * Main migration function
 */
async function migrateTasks(): Promise<MigrationResult> {
  console.log('🚀 Starting Task → User Story Migration (Option A: Smart Epic Mapping)');
  console.log('');

  const result: MigrationResult = {
    success: 0,
    failed: 0,
    errors: [],
    mappings: [],
  };

  try {
    // Fetch all tasks
    console.log('📥 Fetching all tasks...');
    const tasks = await fetchAllTasks();
    console.log(`✅ Found ${tasks.length} tasks to migrate`);
    console.log('');

    // Analyze category distribution
    const categoryStats: Record<string, number> = {};
    tasks.forEach(task => {
      categoryStats[task.category] = (categoryStats[task.category] || 0) + 1;
    });

    console.log('📊 Category Distribution:');
    Object.entries(categoryStats).forEach(([category, count]) => {
      const epic = CATEGORY_TO_EPIC[category] || 'EPIC-4 (default)';
      console.log(`   ${category.padEnd(20)} → ${epic.padEnd(15)} (${count} tasks)`);
    });
    console.log('');

    // Migrate each task
    console.log('🔄 Migrating tasks to user stories...');
    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];
      const epicId = mapTaskToEpic(task);

      try {
        const createdStory = await createStoryFromTask(task, epicId);
        result.success++;
        result.mappings.push({
          taskId: task.id,
          storyId: createdStory.id,
          epic: epicId,
          originalCategory: task.category,
        });
        process.stdout.write(`\r   Progress: ${result.success}/${tasks.length} ✅`);
      } catch (error) {
        result.failed++;
        result.errors.push({
          taskId: task.id,
          taskTitle: task.title,
          error: error instanceof Error ? error.message : String(error),
        });
        console.log(`\n   ❌ Failed: ${task.title} - ${error}`);
      }
    }

    console.log('\n');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }

  return result;
}

/**
 * Print migration summary
 */
function printSummary(result: MigrationResult): void {
  console.log('');
  console.log('═══════════════════════════════════════════');
  console.log('📋 Migration Summary');
  console.log('═══════════════════════════════════════════');
  console.log(`✅ Successfully migrated: ${result.success}`);
  console.log(`❌ Failed: ${result.failed}`);
  console.log('');

  if (result.errors.length > 0) {
    console.log('❌ Errors:');
    result.errors.forEach(({ taskTitle, error }) => {
      console.log(`   - ${taskTitle}: ${error}`);
    });
    console.log('');
  }

  // Epic distribution
  const epicStats: Record<string, number> = {};
  result.mappings.forEach(({ epic }) => {
    epicStats[epic] = (epicStats[epic] || 0) + 1;
  });

  console.log('📊 Stories Created by Epic:');
  Object.entries(epicStats)
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([epic, count]) => {
      console.log(`   ${epic}: ${count} stories`);
    });
  console.log('');

  console.log('✨ Migration complete! Next steps:');
  console.log('   1. Review migrated stories in the Plan page');
  console.log('   2. Verify Epic assignments are correct');
  console.log('   3. Run cleanup script to remove tasks table');
  console.log('');
}

/**
 * Entry point
 */
async function main() {
  try {
    const result = await migrateTasks();
    printSummary(result);
    
    if (result.failed > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  }
}

main();
