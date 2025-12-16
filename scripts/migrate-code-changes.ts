/**
 * Migration script to create code_changes table
 * Links PRs, commits, and branches to user stories and defects
 */

import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { sql } from 'drizzle-orm';
import pg from 'pg';

const { Pool } = pg;

async function migrate() {
  console.log('🔧 Starting code_changes table migration...\n');

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const db = drizzle(pool);

  try {
    // Create code_changes table
    console.log('📝 Creating code_changes table...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS code_changes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        
        -- Link to work items (polymorphic)
        entity_type TEXT NOT NULL,
        entity_id TEXT NOT NULL,
        
        -- Change type
        change_type TEXT NOT NULL,
        
        -- GitHub/Git metadata
        provider TEXT NOT NULL DEFAULT 'github',
        repository TEXT NOT NULL,
        
        -- For Pull Requests
        pr_number INTEGER,
        pr_title TEXT,
        pr_state TEXT,
        pr_url TEXT,
        pr_base_branch TEXT,
        pr_head_branch TEXT,
        pr_merged_at TIMESTAMP,
        pr_merged_by TEXT,
        
        -- For Commits
        commit_sha TEXT,
        commit_message TEXT,
        commit_url TEXT,
        
        -- For Branches
        branch_name TEXT,
        branch_url TEXT,
        
        -- Author info
        author_username TEXT,
        author_email TEXT,
        author_avatar_url TEXT,
        
        -- Timestamps
        event_timestamp TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        
        -- Sync metadata
        sync_source TEXT DEFAULT 'manual',
        external_id TEXT
      )
    `);
    console.log('✅ code_changes table created\n');

    // Create indexes
    console.log('📝 Creating indexes...');
    
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_code_changes_entity 
      ON code_changes(entity_type, entity_id)
    `);
    console.log('  ✅ Entity index created');

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_code_changes_type 
      ON code_changes(change_type)
    `);
    console.log('  ✅ Change type index created');

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_code_changes_repository 
      ON code_changes(repository)
    `);
    console.log('  ✅ Repository index created');

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_code_changes_pr_number 
      ON code_changes(pr_number) WHERE pr_number IS NOT NULL
    `);
    console.log('  ✅ PR number index created');

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_code_changes_commit_sha 
      ON code_changes(commit_sha) WHERE commit_sha IS NOT NULL
    `);
    console.log('  ✅ Commit SHA index created');

    await db.execute(sql`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_code_changes_external_id 
      ON code_changes(external_id) WHERE external_id IS NOT NULL
    `);
    console.log('  ✅ External ID unique index created');

    console.log('\n✨ Migration complete!');
    console.log('\n📊 Table created:');
    console.log('  - code_changes: Links PRs, commits, branches to work items');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

migrate().catch(console.error);

