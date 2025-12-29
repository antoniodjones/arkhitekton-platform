-- Link Bug Fixes Commit to User Stories
-- Commit: 0e088f977f6feb6f234497188e0cdd4422143afc
-- Date: 2025-12-29
-- Description: Comprehensive bug fixes and feature enhancements

-- Insert code change records linking commit to relevant user stories

-- Canvas Enhancement Stories (US-CVS-012 through US-CVS-018)
INSERT INTO code_changes (
  entity_type, entity_id, change_type, repository,
  commit_sha, commit_message, commit_url,
  author_username, author_email, event_timestamp, created_at
) VALUES 
-- US-CVS-012: Text Labels
(
  'user_story', 'US-CVS-IMPL-012', 'commit', 'arkhitekton-platform',
  '0e088f977f6feb6f234497188e0cdd4422143afc',
  'fix: Canvas stack overflow and stale closure bugs',
  'https://github.com/antoniodjones/arkhitekton-platform/commit/0e088f977f6feb6f234497188e0cdd4422143afc',
  'antoniodjones', 'antoniodjones@gmail.com', NOW(), NOW()
),
-- US-CVS-013: Resize/Transform
(
  'user_story', 'US-CVS-IMPL-013', 'commit', 'arkhitekton-platform',
  '0e088f977f6feb6f234497188e0cdd4422143afc',
  'fix: Canvas handleShapeSelect stale closure (missing dependencies)',
  'https://github.com/antoniodjones/arkhitekton-platform/commit/0e088f977f6feb6f234497188e0cdd4422143afc',
  'antoniodjones', 'antoniodjones@gmail.com', NOW(), NOW()
),
-- Search Stories
(
  'user_story', 'US-SEARCH-IMPL-001', 'commit', 'arkhitekton-platform',
  '0e088f977f6feb6f234497188e0cdd4422143afc',
  'fix: SearchResultCard bypassing wouter client-side routing',
  'https://github.com/antoniodjones/arkhitekton-platform/commit/0e088f977f6feb6f234497188e0cdd4422143afc',
  'antoniodjones', 'antoniodjones@gmail.com', NOW(), NOW()
),
-- Quality Center Stories (Test Suite Dialog fixes)
(
  'user_story', 'US-QC-IMPL-001', 'commit', 'arkhitekton-platform',
  '0e088f977f6feb6f234497188e0cdd4422143afc',
  'fix: Test suite dialog Select state mismatch (empty string to none)',
  'https://github.com/antoniodjones/arkhitekton-platform/commit/0e088f977f6feb6f234497188e0cdd4422143afc',
  'antoniodjones', 'antoniodjones@gmail.com', NOW(), NOW()
);

-- Verify insertions
SELECT 
  entity_id,
  change_type,
  SUBSTRING(commit_sha, 1, 8) as commit_short,
  commit_message,
  event_timestamp
FROM code_changes
WHERE commit_sha = '0e088f977f6feb6f234497188e0cdd4422143afc'
ORDER BY entity_id;

-- Update user stories status to 'done' if needed
UPDATE user_stories 
SET status = 'done', updated_at = NOW()
WHERE id IN ('US-CVS-IMPL-012', 'US-CVS-IMPL-013', 'US-SEARCH-IMPL-001', 'US-QC-IMPL-001')
  AND status != 'done';

-- Show final status
SELECT id, title, status, updated_at
FROM user_stories
WHERE id IN ('US-CVS-IMPL-012', 'US-CVS-IMPL-013', 'US-SEARCH-IMPL-001', 'US-QC-IMPL-001')
ORDER BY id;

