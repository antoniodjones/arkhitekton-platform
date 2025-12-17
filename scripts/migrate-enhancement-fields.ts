/**
 * Migration: Add Enhancement Story Metadata Fields (US-WW9SP8C)
 * 
 * Adds three new fields to user_stories table:
 * - enhances: JSONB array of story IDs this story enhances
 * - enhancement_type: Text field for enhancement category
 * - rationale: Text field for business justification
 * 
 * Run with: npx tsx scripts/migrate-enhancement-fields.ts
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
    console.log('🚀 Starting Enhancement Fields migration...');
    
    // Add enhances column (JSONB array)
    await client.query(`
      ALTER TABLE user_stories 
      ADD COLUMN IF NOT EXISTS enhances JSONB DEFAULT '[]'::jsonb
    `);
    console.log('✅ Added enhances column');

    // Add enhancement_type column
    await client.query(`
      ALTER TABLE user_stories 
      ADD COLUMN IF NOT EXISTS enhancement_type TEXT
    `);
    console.log('✅ Added enhancement_type column');

    // Add rationale column
    await client.query(`
      ALTER TABLE user_stories 
      ADD COLUMN IF NOT EXISTS rationale TEXT
    `);
    console.log('✅ Added rationale column');

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

