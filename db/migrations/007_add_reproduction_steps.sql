-- Migration: Add Structured Reproduction Steps
-- US-QC-IMPL-010: Database Schema for Reproduction Steps
-- Date: 2025-12-24

-- Step 1: Add new fields to defects table (DEF-QC-007)
ALTER TABLE defects 
  ADD COLUMN IF NOT EXISTS steps_to_reproduce TEXT,
  ADD COLUMN IF NOT EXISTS expected_behavior TEXT,
  ADD COLUMN IF NOT EXISTS actual_behavior TEXT,
  ADD COLUMN IF NOT EXISTS legacy_steps_to_reproduce TEXT;

COMMENT ON COLUMN defects.steps_to_reproduce IS 'Detailed reproduction steps (legacy textarea, deprecated in favor of reproduction_steps table)';
COMMENT ON COLUMN defects.expected_behavior IS 'What should happen in the correct scenario';
COMMENT ON COLUMN defects.actual_behavior IS 'What actually happens (the bug)';
COMMENT ON COLUMN defects.legacy_steps_to_reproduce IS 'Original textarea content before migration to structured steps';

-- Step 2: Create reproduction_steps table
CREATE TABLE IF NOT EXISTS reproduction_steps (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  defect_id VARCHAR NOT NULL REFERENCES defects(id) ON DELETE CASCADE,
  step_id VARCHAR(10) NOT NULL, -- "S001", "S002", etc.
  sequence INTEGER NOT NULL, -- 1, 2, 3, etc. for ordering
  description TEXT NOT NULL,
  expected_result TEXT, -- Optional: what should happen at this step
  
  -- Soft delete support
  deleted_at TIMESTAMP,
  
  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT unique_defect_step UNIQUE (defect_id, step_id)
);

-- Indexes for reproduction_steps
CREATE INDEX IF NOT EXISTS idx_repro_steps_defect ON reproduction_steps(defect_id);
CREATE INDEX IF NOT EXISTS idx_repro_steps_sequence ON reproduction_steps(defect_id, sequence);
CREATE INDEX IF NOT EXISTS idx_repro_steps_deleted ON reproduction_steps(deleted_at) WHERE deleted_at IS NULL;

-- Comments
COMMENT ON TABLE reproduction_steps IS 'Structured, traceable reproduction steps for defects with unique IDs (US-QC-010)';
COMMENT ON COLUMN reproduction_steps.step_id IS 'Step identifier within defect (e.g., S001, S002). Combined with defect_id forms unique reference like DEF-003-S001';
COMMENT ON COLUMN reproduction_steps.sequence IS 'Display order of steps. Can be changed via reordering without affecting step_id';
COMMENT ON COLUMN reproduction_steps.deleted_at IS 'Soft delete timestamp. Preserves step IDs for historical references';

-- Step 3: Create step_references table for traceability
CREATE TABLE IF NOT EXISTS step_references (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  step_id VARCHAR NOT NULL REFERENCES reproduction_steps(id) ON DELETE CASCADE,
  
  -- Reference metadata
  reference_type VARCHAR(50) NOT NULL, -- 'commit', 'comment', 'test_case', 'pull_request'
  reference_id VARCHAR(100) NOT NULL, -- Commit SHA, comment ID, test case ID, etc.
  reference_url TEXT, -- Link to the reference
  reference_text TEXT, -- Excerpt or context
  
  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes for step_references
CREATE INDEX IF NOT EXISTS idx_step_refs_step ON step_references(step_id);
CREATE INDEX IF NOT EXISTS idx_step_refs_type ON step_references(reference_type, reference_id);

-- Comments
COMMENT ON TABLE step_references IS 'Tracks where reproduction steps are referenced (commits, test cases, comments) for traceability (US-QC-013)';
COMMENT ON COLUMN step_references.reference_type IS 'Type of reference: commit, comment, test_case, pull_request';
COMMENT ON COLUMN step_references.reference_id IS 'External identifier (e.g., commit SHA, test case ID)';

-- Step 4: Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_reproduction_steps_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER reproduction_steps_updated_at
  BEFORE UPDATE ON reproduction_steps
  FOR EACH ROW
  EXECUTE FUNCTION update_reproduction_steps_updated_at();

-- Step 5: Grant permissions (if needed)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON reproduction_steps TO your_app_user;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON step_references TO your_app_user;

-- Migration complete
-- Next steps:
-- 1. Run this migration: psql -d your_database -f 007_add_reproduction_steps.sql
-- 2. Verify tables: \d reproduction_steps; \d step_references;
-- 3. Test with sample data
-- 4. Proceed to US-QC-IMPL-011 (API endpoints)

