-- ============================================================
-- WIKI KNOWLEDGE CORE - Phase 1 Foundation
-- Database Migration Script
-- ============================================================

-- Drop tables if they exist (for clean migration)
DROP TABLE IF EXISTS entity_mentions CASCADE;
DROP TABLE IF EXISTS wiki_pages CASCADE;

-- Create wiki_pages table
CREATE TABLE IF NOT EXISTS wiki_pages (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  
  -- Basic Information
  title TEXT NOT NULL,
  content JSONB NOT NULL, -- TipTap JSON format
  
  -- Hierarchical Organization
  parent_id VARCHAR REFERENCES wiki_pages(id) ON DELETE SET NULL,
  path TEXT,
  sort_order INTEGER DEFAULT 0,
  
  -- Categorization & Templates
  category TEXT,
  subcategory TEXT,
  template TEXT, -- 'ADR', 'Design', 'Requirement', 'Meeting', 'RFC', etc.
  
  -- Status & Workflow
  status TEXT NOT NULL DEFAULT 'draft', -- 'draft', 'published', 'under_review', 'archived'
  
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
);

-- Create entity_mentions table
CREATE TABLE IF NOT EXISTS entity_mentions (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  
  -- Page Reference
  page_id VARCHAR NOT NULL REFERENCES wiki_pages(id) ON DELETE CASCADE,
  
  -- Entity Reference (cross-module)
  entity_type TEXT NOT NULL, -- 'user_story', 'epic', 'component', 'diagram', 'page', 'requirement', 'adr', 'user', 'application'
  entity_id VARCHAR NOT NULL,
  
  -- Display & Position
  text TEXT NOT NULL,
  position INTEGER NOT NULL,
  
  -- Status Tracking (for status-aware mentions)
  entity_status TEXT,
  last_checked_at TIMESTAMP DEFAULT NOW(),
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_wiki_pages_parent_id ON wiki_pages(parent_id);
CREATE INDEX IF NOT EXISTS idx_wiki_pages_category ON wiki_pages(category);
CREATE INDEX IF NOT EXISTS idx_wiki_pages_status ON wiki_pages(status);
CREATE INDEX IF NOT EXISTS idx_wiki_pages_created_by ON wiki_pages(created_by);
CREATE INDEX IF NOT EXISTS idx_wiki_pages_created_at ON wiki_pages(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_entity_mentions_page_id ON entity_mentions(page_id);
CREATE INDEX IF NOT EXISTS idx_entity_mentions_entity ON entity_mentions(entity_type, entity_id);

-- Create full-text search index (PostgreSQL tsvector)
-- This will be used in Phase 1 for enhanced search
CREATE INDEX IF NOT EXISTS idx_wiki_pages_search ON wiki_pages USING gin(to_tsvector('english', title || ' ' || COALESCE(tags::text, '')));

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Wiki Knowledge Core tables created successfully!';
  RAISE NOTICE '📊 Tables: wiki_pages, entity_mentions';
  RAISE NOTICE '🔍 Indexes: Created for performance optimization';
  RAISE NOTICE '🚀 Ready for Sprint 1 implementation!';
END $$;

