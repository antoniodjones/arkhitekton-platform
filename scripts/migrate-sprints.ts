/**
 * Migration Script: Sprints Table (US-PLAN-101)
 * 
 * This script creates the sprints table and adds sprintId to user_stories.
 * Run with: npx tsx scripts/migrate-sprints.ts
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
    console.log('🚀 Starting Sprint tables migration...');
    
    // Create sprints table
    await client.query(`
      CREATE TABLE IF NOT EXISTS sprints (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        goal TEXT,
        start_date TIMESTAMP NOT NULL,
        end_date TIMESTAMP NOT NULL,
        status TEXT NOT NULL DEFAULT 'planning',
        team_velocity INTEGER NOT NULL DEFAULT 30,
        committed_points INTEGER DEFAULT 0,
        completed_points INTEGER DEFAULT 0,
        notes TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Created sprints table');
    
    // Add index for status queries
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_sprints_status ON sprints(status);
    `);
    console.log('✅ Created sprints status index');
    
    // Add index for date range queries
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_sprints_dates ON sprints(start_date, end_date);
    `);
    console.log('✅ Created sprints date range index');
    
    // Add sprintId column to user_stories if it doesn't exist
    const columnCheck = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'user_stories' AND column_name = 'sprint_id';
    `);
    
    if (columnCheck.rows.length === 0) {
      await client.query(`
        ALTER TABLE user_stories 
        ADD COLUMN sprint_id TEXT REFERENCES sprints(id) ON DELETE SET NULL;
      `);
      console.log('✅ Added sprint_id column to user_stories');
      
      // Add index for sprint assignment queries
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_user_stories_sprint ON user_stories(sprint_id);
      `);
      console.log('✅ Created user_stories sprint_id index');
    } else {
      console.log('ℹ️ sprint_id column already exists in user_stories');
    }
    
    // Insert sample sprint for testing
    const existingSprints = await client.query(`SELECT COUNT(*) FROM sprints;`);
    if (parseInt(existingSprints.rows[0].count) === 0) {
      const today = new Date();
      const twoWeeksFromNow = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);
      
      await client.query(`
        INSERT INTO sprints (id, name, goal, start_date, end_date, status, team_velocity)
        VALUES (
          'SPRINT-0000001',
          'Sprint 1: The Fix',
          'Revive Kanban board and add agile estimation fields',
          $1,
          $2,
          'planning',
          30
        );
      `, [today, twoWeeksFromNow]);
      console.log('✅ Created sample sprint');
    }
    
    console.log('\n🎉 Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch(console.error);

