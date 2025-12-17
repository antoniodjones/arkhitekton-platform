/**
 * Migration: Add Wiki Auto-Save Draft Fields
 * Story: US-WIKI-001 - Auto-save drafts every 30 seconds
 * 
 * This migration adds:
 * - content_draft: JSONB column to store draft content
 * - last_auto_saved_at: TIMESTAMP for tracking when draft was saved
 */

import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function migrate() {
  const client = await pool.connect();

  try {
    console.log('🚀 Starting Wiki Drafts Migration (US-WIKI-001)...\n');

    // Add content_draft column if it doesn't exist
    await client.query(`
      ALTER TABLE wiki_pages 
      ADD COLUMN IF NOT EXISTS content_draft JSONB;
    `);
    console.log('✅ Added content_draft column');

    // Add last_auto_saved_at column if it doesn't exist
    await client.query(`
      ALTER TABLE wiki_pages 
      ADD COLUMN IF NOT EXISTS last_auto_saved_at TIMESTAMP;
    `);
    console.log('✅ Added last_auto_saved_at column');

    console.log('\n✅ Wiki Drafts Migration Complete!');
    console.log('📝 Auto-save feature is now ready to use.');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch(console.error);
