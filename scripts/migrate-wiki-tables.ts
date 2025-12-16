import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import { sql } from 'drizzle-orm';

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const db = drizzle(pool);

async function migrateWikiTables() {
  console.log('🏗️  Migrating Wiki Knowledge Core tables...\n');

  try {
    // Drop existing tables (for clean migration)
    console.log('📦 Dropping existing tables if they exist...');
    await db.execute(sql`DROP TABLE IF EXISTS entity_mentions CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS wiki_pages CASCADE`);
    console.log('✅ Old tables dropped\n');

    // Create wiki_pages table
    console.log('📝 Creating wiki_pages table...');
    await db.execute(sql`
      CREATE TABLE wiki_pages (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
        
        -- Basic Information
        title TEXT NOT NULL,
        content JSONB NOT NULL,
        
        -- Hierarchical Organization
        parent_id VARCHAR REFERENCES wiki_pages(id) ON DELETE SET NULL,
        path TEXT,
        sort_order INTEGER DEFAULT 0,
        
        -- Categorization & Templates
        category TEXT,
        subcategory TEXT,
        template TEXT,
        
        -- Status & Workflow
        status TEXT NOT NULL DEFAULT 'draft',
        
        -- Ownership & Collaboration
        created_by VARCHAR NOT NULL,
        updated_by VARCHAR,
        contributors JSONB DEFAULT '[]'::jsonb,
        
        -- Engagement Metrics
        views INTEGER DEFAULT 0,
        likes INTEGER DEFAULT 0,
        
        -- Metadata & Tagging
        tags JSONB DEFAULT '[]'::jsonb,
        metadata JSONB DEFAULT '{}'::jsonb,
        
        -- External Links
        related_page_ids JSONB DEFAULT '[]'::jsonb,
        linked_decision_ids JSONB DEFAULT '[]'::jsonb,
        linked_capability_ids JSONB DEFAULT '[]'::jsonb,
        attachments JSONB DEFAULT '[]'::jsonb,
        
        -- Versioning
        version TEXT DEFAULT '1.0',
        
        -- Project/Workspace Association
        project_id VARCHAR,
        
        -- Full-text search optimization
        search_vector TEXT,
        
        -- Timestamps
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        published_at TIMESTAMP,
        archived_at TIMESTAMP
      )
    `);
    console.log('✅ wiki_pages table created\n');

    // Create entity_mentions table
    console.log('📝 Creating entity_mentions table...');
    await db.execute(sql`
      CREATE TABLE entity_mentions (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
        
        -- Page Reference
        page_id VARCHAR NOT NULL REFERENCES wiki_pages(id) ON DELETE CASCADE,
        
        -- Entity Reference (cross-module)
        entity_type TEXT NOT NULL,
        entity_id VARCHAR NOT NULL,
        
        -- Display & Position
        text TEXT NOT NULL,
        position INTEGER NOT NULL,
        
        -- Status Tracking
        entity_status TEXT,
        last_checked_at TIMESTAMP DEFAULT NOW(),
        
        -- Timestamps
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('✅ entity_mentions table created\n');

    // Create indexes
    console.log('🔍 Creating indexes for performance...');
    await db.execute(sql`CREATE INDEX idx_wiki_pages_parent_id ON wiki_pages(parent_id)`);
    await db.execute(sql`CREATE INDEX idx_wiki_pages_category ON wiki_pages(category)`);
    await db.execute(sql`CREATE INDEX idx_wiki_pages_status ON wiki_pages(status)`);
    await db.execute(sql`CREATE INDEX idx_wiki_pages_created_by ON wiki_pages(created_by)`);
    await db.execute(sql`CREATE INDEX idx_wiki_pages_created_at ON wiki_pages(created_at DESC)`);
    await db.execute(sql`CREATE INDEX idx_entity_mentions_page_id ON entity_mentions(page_id)`);
    await db.execute(sql`CREATE INDEX idx_entity_mentions_entity ON entity_mentions(entity_type, entity_id)`);
    await db.execute(sql`CREATE INDEX idx_wiki_pages_search ON wiki_pages USING gin(to_tsvector('english', title || ' ' || COALESCE(tags::text, '')))`);
    console.log('✅ All indexes created\n');

    console.log('✨ Wiki Knowledge Core migration complete!\n');
    console.log('📊 Summary:');
    console.log('  - wiki_pages table: ✅ Created');
    console.log('  - entity_mentions table: ✅ Created');
    console.log('  - Performance indexes: ✅ Created (8 indexes)');
    console.log('  - Full-text search: ✅ Enabled');
    console.log('\n🚀 Ready for API testing!');

  } catch (error: any) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  } finally {
    await pool.end();
  }
}

migrateWikiTables().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

