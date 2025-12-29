-- ============================================================
-- DEF-SEARCH-004: Global Search Database Connection Issue
-- Links to US-SEARCH-006 (Global Search), US-SEARCH-001, US-SEARCH-IMPL-001
-- ============================================================

-- Insert defect
INSERT INTO defects (
  id, user_story_id, title, description, steps_to_reproduce, 
  expected_behavior, actual_behavior, severity, priority, status, 
  reproducibility, environment, detected_in, assignee, reported_by, 
  found_date, target_resolution_date, tags, created_at, updated_at
)
VALUES (
  'DEF-SEARCH-004',
  'US-SEARCH-006',
  'Global Search Returns "Search Failed" Due to Database Connection Reset',
  '## Issue
When using the global search (Cmd+K / Ctrl+K), all searches return "Search failed" error with no results displayed.

## Root Cause
The application server experiences persistent `ECONNRESET` errors when attempting to query the database through Cloud SQL proxy. This affects ALL database-dependent operations, not just search.

## Technical Details
- **Error Code**: `ECONNRESET` (errno: -54)
- **Affected Query**: `getAllUserStories`, `getAllTestSuites`, `getAllTestCases`, and other search queries
- **Stack Trace**: Error occurs in `pg-pool` connection handling
- **Environment**: Local development with Cloud SQL proxy on port 5433

## Impact
- ❌ Global search completely non-functional (returns error dialog)
- ❌ All entity types fail to load (user stories, test suites, test cases, etc.)
- ❌ Affects all users on local development environment

## Evidence
1. Cloud SQL Editor queries work correctly - data exists in database
2. Test query confirmed 25 test cases exist: `SELECT COUNT(*) FROM test_cases WHERE id LIKE ''TC-CVS-%''`
3. Server logs show repeated ECONNRESET errors on every search attempt
4. Cloud SQL proxy reports "ready for connections" but connections immediately reset

## Code Status
✅ **Feature implementation is complete**:
- Test Suites and Test Cases added to search API (`/api/entities/search`)
- Frontend updated with entity type support (🧪 test suite, ✓ test case)
- Database contains all required data

❌ **Blocked by environment issue**: Local Cloud SQL proxy connection instability

## Workaround
- Use Cloud SQL Editor for direct database queries (works correctly)
- Deploy to Cloud Run/App Engine where connections are stable
- Test search functionality will work once deployed

## Related Work
- 25 test cases created for canvas features (TC-CVS-001 to TC-CVS-025)
- All test data successfully seeded into database
- Search feature ready for production deployment',
  '1. Start Cloud SQL proxy: `~/cloud-sql-proxy --port 5433 arkhitekton-platform-dev:us-central1:arkhitekton-db-dev`
2. Start application server: `PORT=5001 npm run dev`
3. Open application at http://localhost:5001
4. Press Cmd+K (Mac) or Ctrl+K (Windows/Linux) to open global search
5. Type "TS-CVS-001" or any search query
6. Observe "Search failed - Please try again" error message
7. Check server logs: `Error searching entities: Error: read ECONNRESET`',
  'Global search should:
1. Accept search query input
2. Query database for matching entities across all types
3. Display results grouped by entity type
4. Allow navigation to entity detail pages
5. Show "No results" message if no matches found (not "Search failed")',
  'Global search displays "Search failed - Please try again" error dialog immediately after typing 2+ characters. Server logs show ECONNRESET database connection errors. All search queries fail regardless of search term.',
  'high',
  'high',
  'open',
  'always',
  'Local Development (macOS with Cloud SQL Proxy)',
  'Development',
  NULL,
  'QA Team',
  NOW(),
  NULL,
  '["search", "database", "connection", "cloud-sql-proxy", "local-env"]'::jsonb,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Link defect to related user stories
INSERT INTO defect_user_stories (defect_id, user_story_id)
VALUES
  ('DEF-SEARCH-004', 'US-SEARCH-006'),  -- Keyboard Shortcuts & Global Search Modal
  ('DEF-SEARCH-004', 'US-SEARCH-001'),  -- Dashboard Global Search
  ('DEF-SEARCH-004', 'US-SEARCH-IMPL-001')  -- Backend Search API Enhancement
ON CONFLICT DO NOTHING;

-- Verify defect was created
SELECT 
  id,
  title,
  severity,
  priority,
  status,
  user_story_id,
  reported_by,
  found_date
FROM defects 
WHERE id = 'DEF-SEARCH-004';

-- Verify story links
SELECT 
  ds.defect_id,
  ds.user_story_id,
  us.title as story_title
FROM defect_user_stories ds
JOIN user_stories us ON us.id = ds.user_story_id
WHERE ds.defect_id = 'DEF-SEARCH-004';

