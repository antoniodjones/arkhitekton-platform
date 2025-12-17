/**
 * Migration: Add Planning Date Fields (US-8KE9R60)
 * 
 * Adds date fields to user_stories and epics for roadmap and planning:
 * - User Stories: targetDate, startedAt, completedAt
 * - Epics: actualStartDate, actualEndDate
 * 
 * Run with: npx tsx scripts/migrate-planning-dates.ts
 */

import { config } from 'dotenv';
config();

import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function migrate() {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Starting Planning Date Fields migration...');
    
    // User Stories: Add targetDate
    await client.query(`
      ALTER TABLE user_stories 
      ADD COLUMN IF NOT EXISTS target_date TIMESTAMP
    `);
    console.log('✅ Added target_date to user_stories');

    // User Stories: Add startedAt
    await client.query(`
      ALTER TABLE user_stories 
      ADD COLUMN IF NOT EXISTS started_at TIMESTAMP
    `);
    console.log('✅ Added started_at to user_stories');

    // User Stories: Add completedAt
    await client.query(`
      ALTER TABLE user_stories 
      ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP
    `);
    console.log('✅ Added completed_at to user_stories');

    // Epics: Add actualStartDate
    await client.query(`
      ALTER TABLE epics 
      ADD COLUMN IF NOT EXISTS actual_start_date TIMESTAMP
    `);
    console.log('✅ Added actual_start_date to epics');

    // Epics: Add actualEndDate
    await client.query(`
      ALTER TABLE epics 
      ADD COLUMN IF NOT EXISTS actual_end_date TIMESTAMP
    `);
    console.log('✅ Added actual_end_date to epics');

    // Defects: Add targetDate
    await client.query(`
      ALTER TABLE defects 
      ADD COLUMN IF NOT EXISTS target_date TIMESTAMP
    `);
    console.log('✅ Added target_date to defects');

    // Create indexes for date queries (useful for roadmap/timeline views)
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_user_stories_target_date ON user_stories(target_date)
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_user_stories_started_at ON user_stories(started_at)
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_user_stories_completed_at ON user_stories(completed_at)
    `);
    console.log('✅ Created date indexes');

    console.log('\n🎉 Migration completed successfully!');
    console.log('\nNew fields:');
    console.log('  user_stories: target_date, started_at, completed_at');
    console.log('  epics: actual_start_date, actual_end_date');
    console.log('  defects: target_date');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch(console.error);

