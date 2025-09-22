import { db } from './db';
import { tasks as tasksTable } from '@shared/schema';
import { eq, and } from 'drizzle-orm';
import { getSampleTasks, normalizeTaskForDb } from './sample-tasks';
import type { InsertTask } from '@shared/schema';

/**
 * Idempotent migration to populate database with complete ARKHITEKTON task dataset
 * Uses safe deduplication and transaction for data integrity
 */
export async function migrateSampleTasks(options: { dryRun?: boolean } = {}) {
  const { dryRun = false } = options;
  
  console.log(`🔄 Starting sample tasks migration (${dryRun ? 'DRY RUN' : 'LIVE'})`);
  
  try {
    // Get the complete sample task dataset (85 tasks)
    const sampleTasks = getSampleTasks();
    console.log(`📋 Sample dataset contains ${sampleTasks.length} tasks`);
    
    // Get existing tasks from database for deduplication
    const existingTasks = await db.select({
      title: tasksTable.title,
      category: tasksTable.category,
      assignee: tasksTable.assignee
    }).from(tasksTable);
    
    console.log(`📊 Database currently has ${existingTasks.length} tasks`);
    
    // Create deduplication key set (title + category + assignee)
    const existingKeys = new Set(
      existingTasks.map(task => `${task.title}||${task.category}||${task.assignee || 'null'}`)
    );
    
    // Filter out tasks that already exist
    const tasksToInsert = sampleTasks.filter(task => {
      const key = `${task.title}||${task.category}||${task.assignee || 'null'}`;
      return !existingKeys.has(key);
    });
    
    console.log(`➕ Found ${tasksToInsert.length} new tasks to insert`);
    console.log(`✅ ${existingTasks.length} tasks already exist (will skip)`);
    
    if (tasksToInsert.length === 0) {
      console.log('✨ Database is already up to date with complete task set');
      return {
        success: true,
        totalSample: sampleTasks.length,
        alreadyExists: existingTasks.length,
        inserted: 0,
        skipped: existingTasks.length
      };
    }
    
    if (dryRun) {
      console.log('🔍 DRY RUN - Tasks that would be inserted:');
      tasksToInsert.forEach((task, i) => {
        console.log(`  ${i + 1}. [${task.category}] ${task.title} (${task.assignee || 'unassigned'})`);
      });
      return {
        success: true,
        totalSample: sampleTasks.length,
        alreadyExists: existingTasks.length,
        inserted: 0,
        skipped: existingTasks.length,
        wouldInsert: tasksToInsert.length
      };
    }
    
    // Execute insertion in transaction for atomicity
    const result = await db.transaction(async (tx) => {
      console.log('🔄 Starting database transaction...');
      
      let insertCount = 0;
      const insertBatch: InsertTask[] = [];
      
      // Normalize and validate each task before insertion
      for (const taskData of tasksToInsert) {
        try {
          const normalizedTask = normalizeTaskForDb(taskData);
          insertBatch.push(normalizedTask);
          insertCount++;
        } catch (error) {
          console.warn(`⚠️  Failed to normalize task "${taskData.title}":`, error);
        }
      }
      
      if (insertBatch.length > 0) {
        console.log(`💾 Inserting ${insertBatch.length} normalized tasks...`);
        await tx.insert(tasksTable).values(insertBatch);
        console.log(`✅ Successfully inserted ${insertBatch.length} tasks`);
      }
      
      return insertCount;
    });
    
    // Verify final count
    const finalCount = await db.select({ count: tasksTable.id }).from(tasksTable);
    const totalTasks = finalCount.length;
    
    console.log(`✨ Migration completed successfully!`);
    console.log(`📊 Final database state:`);
    console.log(`  - Total tasks: ${totalTasks}`);
    console.log(`  - Expected: ${sampleTasks.length}`);
    console.log(`  - Tasks inserted: ${result}`);
    console.log(`  - Status: ${totalTasks >= sampleTasks.length ? '✅ Complete' : '⚠️  Still missing tasks'}`);
    
    return {
      success: true,
      totalSample: sampleTasks.length,
      alreadyExists: existingTasks.length,
      inserted: result,
      finalCount: totalTasks,
      complete: totalTasks >= sampleTasks.length
    };
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Verification function to check database integrity after migration
 */
export async function verifyTaskMigration() {
  console.log('🔍 Verifying task migration integrity...');
  
  try {
    const sampleTasks = getSampleTasks();
    const dbTasks = await db.select().from(tasksTable);
    
    console.log(`📋 Sample dataset: ${sampleTasks.length} tasks`);
    console.log(`📊 Database: ${dbTasks.length} tasks`);
    
    // Check counts by category
    const sampleByCategory = sampleTasks.reduce((acc, task) => {
      acc[task.category] = (acc[task.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const dbByCategory = dbTasks.reduce((acc, task) => {
      acc[task.category] = (acc[task.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log('📂 Category breakdown:');
    Object.keys(sampleByCategory).forEach(category => {
      const sample = sampleByCategory[category];
      const db = dbByCategory[category] || 0;
      const status = db >= sample ? '✅' : '⚠️';
      console.log(`  ${status} ${category}: ${db}/${sample}`);
    });
    
    // Check by status
    const sampleByStatus = sampleTasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const dbByStatus = dbTasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log('📊 Status breakdown:');
    Object.keys(sampleByStatus).forEach(status => {
      const sample = sampleByStatus[status];
      const db = dbByStatus[status] || 0;
      const statusIcon = db >= sample ? '✅' : '⚠️';
      console.log(`  ${statusIcon} ${status}: ${db}/${sample}`);
    });
    
    const complete = dbTasks.length >= sampleTasks.length;
    console.log(`${complete ? '✅' : '⚠️'} Migration verification: ${complete ? 'COMPLETE' : 'INCOMPLETE'}`);
    
    return {
      complete,
      sampleCount: sampleTasks.length,
      dbCount: dbTasks.length,
      categoryBreakdown: { sample: sampleByCategory, db: dbByCategory },
      statusBreakdown: { sample: sampleByStatus, db: dbByStatus }
    };
    
  } catch (error) {
    console.error('❌ Verification failed:', error);
    throw error;
  }
}

// Environment-gated execution for server startup
if (process.env.MIGRATE_SAMPLE_TASKS === 'true') {
  console.log('🚀 Auto-executing sample tasks migration...');
  migrateSampleTasks({ dryRun: false })
    .then(result => {
      if (result.success) {
        console.log('✅ Auto-migration completed successfully');
        // Run verification
        return verifyTaskMigration();
      } else {
        console.error('❌ Auto-migration failed:', result.error);
        process.exit(1);
      }
    })
    .then(() => {
      console.log('✨ All migration tasks completed');
    })
    .catch(error => {
      console.error('💥 Migration process failed:', error);
      process.exit(1);
    });
}