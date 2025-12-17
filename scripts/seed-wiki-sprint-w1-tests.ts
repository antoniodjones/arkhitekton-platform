/**
 * Seed Test Suites and Test Cases for Wiki Sprint W1
 * Creates comprehensive test coverage for US-WIKI-001 to US-WIKI-008
 */

import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function seed() {
  const client = await pool.connect();

  try {
    console.log('🧪 Seeding Wiki Sprint W1 Test Suites and Test Cases...\n');

    await client.query('BEGIN');

    // ============================================================
    // Test Suite 1: Auto-Save & Draft Recovery (US-WIKI-001, 002)
    // ============================================================
    console.log('Creating Test Suite: Auto-Save & Draft Recovery...');
    const suiteAutoSave = await client.query(`
      INSERT INTO test_suites (id, name, description, module)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `, ['TS-WIKI-001', 'Auto-Save & Draft Recovery', 'Test auto-save functionality and draft restoration for wiki pages', 'wiki']);

    // Test Cases for US-WIKI-001: Auto-save drafts every 30 seconds
    await client.query(`
      INSERT INTO test_cases (id, suite_id, title, preconditions, steps, priority, test_type, tags)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [
      'TS-WIKI-001-01',
      'TS-WIKI-001',
      'Auto-save triggers after 30 seconds of inactivity',
      'User is logged in and viewing a wiki page in edit mode',
      JSON.stringify([
        { step: 'Open a wiki page for editing', expected: 'Editor loads in edit mode' },
        { step: 'Type some content in the editor', expected: 'Content appears in the editor' },
        { step: 'Stop typing and wait 30 seconds', expected: 'Auto-save indicator appears (e.g., "Saving..." then "Saved")' },
        { step: 'Check browser DevTools Network tab', expected: 'POST/PATCH request to /api/wiki/* with draft content' }
      ]),
      'high',
      'functional',
      JSON.stringify(['auto-save', 'US-WIKI-001'])
    ]);

    await client.query(`
      INSERT INTO test_cases (id, suite_id, title, preconditions, steps, priority, test_type, tags)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [
      'TS-WIKI-001-02',
      'TS-WIKI-001',
      'Auto-save does not trigger during continuous typing',
      'User is editing a wiki page',
      JSON.stringify([
        { step: 'Open a wiki page for editing', expected: 'Editor loads' },
        { step: 'Type continuously for 45 seconds without pausing', expected: 'Content appears as typed' },
        { step: 'Observe auto-save indicator', expected: 'No auto-save triggered during continuous typing' },
        { step: 'Stop typing and wait 30 seconds', expected: 'Auto-save triggers after 30 seconds of inactivity' }
      ]),
      'medium',
      'functional',
      JSON.stringify(['auto-save', 'US-WIKI-001'])
    ]);

    await client.query(`
      INSERT INTO test_cases (id, suite_id, title, preconditions, steps, priority, test_type, tags)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [
      'TS-WIKI-001-03',
      'TS-WIKI-001',
      'Manual save supersedes auto-save timer',
      'User is editing a wiki page',
      JSON.stringify([
        { step: 'Open a wiki page for editing', expected: 'Editor loads' },
        { step: 'Type some content', expected: 'Content appears' },
        { step: 'Wait 20 seconds (before auto-save)', expected: 'No auto-save yet' },
        { step: 'Click "Save" button manually', expected: 'Page saves immediately, auto-save timer resets' },
        { step: 'Wait 30 more seconds', expected: 'New auto-save triggers if content changed' }
      ]),
      'medium',
      'functional',
      JSON.stringify(['auto-save', 'US-WIKI-001'])
    ]);

    // Test Cases for US-WIKI-002: Restore from auto-saved drafts
    await client.query(`
      INSERT INTO test_cases (id, suite_id, title, preconditions, steps, priority, test_type, tags)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [
      'TS-WIKI-001-04',
      'TS-WIKI-001',
      'Restore draft after browser crash',
      'User has unsaved changes auto-saved as draft',
      JSON.stringify([
        { step: 'Open a wiki page for editing', expected: 'Editor loads' },
        { step: 'Type content and wait for auto-save', expected: 'Content auto-saved' },
        { step: 'Force close browser (simulating crash)', expected: 'Browser closes without manual save' },
        { step: 'Reopen browser and navigate to the same wiki page', expected: 'Banner appears: "Unsaved draft found. Restore?"' },
        { step: 'Click "Restore" button', expected: 'Draft content loads into editor' }
      ]),
      'critical',
      'functional',
      JSON.stringify(['draft-recovery', 'US-WIKI-002'])
    ]);

    await client.query(`
      INSERT INTO test_cases (id, suite_id, title, preconditions, steps, priority, test_type, tags)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [
      'TS-WIKI-001-05',
      'TS-WIKI-001',
      'Discard draft and load published version',
      'User has unsaved draft available',
      JSON.stringify([
        { step: 'Open a wiki page with auto-saved draft', expected: 'Draft restore banner appears' },
        { step: 'Click "Discard" button', expected: 'Draft is deleted' },
        { step: 'Verify editor content', expected: 'Editor loads last published version, not draft' },
        { step: 'Refresh page', expected: 'No draft restore banner appears' }
      ]),
      'high',
      'functional',
      JSON.stringify(['draft-recovery', 'US-WIKI-002'])
    ]);

    // ============================================================
    // Test Suite 2: Page Operations (US-WIKI-003, 004)
    // ============================================================
    console.log('Creating Test Suite: Page Operations...');
    await client.query(`
      INSERT INTO test_suites (id, name, description, module)
      VALUES ($1, $2, $3, $4)
    `, ['TS-WIKI-002', 'Page Operations', 'Test duplicate, clone, and delete operations for wiki pages', 'wiki']);

    // Test Cases for US-WIKI-003: Duplicate/clone existing pages
    await client.query(`
      INSERT INTO test_cases (id, suite_id, title, preconditions, steps, priority, test_type, tags)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [
      'TS-WIKI-002-01',
      'TS-WIKI-002',
      'Duplicate page from context menu',
      'User has a wiki page open',
      JSON.stringify([
        { step: 'Right-click on a wiki page in the tree', expected: 'Context menu appears' },
        { step: 'Click "Duplicate" option', expected: 'Dialog appears: "Duplicate Page"' },
        { step: 'Enter new page title: "My Page (Copy)"', expected: 'Title field accepts input' },
        { step: 'Click "Duplicate" button', expected: 'New page created with same content, new title, and "(Copy)" appended' },
        { step: 'Verify new page in tree', expected: 'New page appears in tree under same parent' }
      ]),
      'high',
      'functional',
      JSON.stringify(['duplicate', 'US-WIKI-003'])
    ]);

    await client.query(`
      INSERT INTO test_cases (id, suite_id, title, preconditions, steps, priority, test_type, tags)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [
      'TS-WIKI-002-02',
      'TS-WIKI-002',
      'Duplicate preserves all content and formatting',
      'User has a wiki page with rich content (headings, lists, mentions)',
      JSON.stringify([
        { step: 'Open a wiki page with complex content', expected: 'Page loads with all formatting' },
        { step: 'Duplicate the page', expected: 'Duplicate dialog appears' },
        { step: 'Create duplicate with title "Test Copy"', expected: 'Duplicate created' },
        { step: 'Open the duplicate page', expected: 'All content preserved: headings, lists, @mentions, formatting' },
        { step: 'Verify @mentions work', expected: '@mentions are clickable and link to original entities' }
      ]),
      'critical',
      'functional',
      JSON.stringify(['duplicate', 'US-WIKI-003'])
    ]);

    // Test Cases for US-WIKI-004: Delete with confirmation dialog
    await client.query(`
      INSERT INTO test_cases (id, suite_id, title, preconditions, steps, priority, test_type, tags)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [
      'TS-WIKI-002-03',
      'TS-WIKI-002',
      'Delete page shows confirmation dialog',
      'User has a wiki page to delete',
      JSON.stringify([
        { step: 'Right-click on a wiki page in the tree', expected: 'Context menu appears' },
        { step: 'Click "Delete" option', expected: 'Confirmation dialog appears with warning message' },
        { step: 'Verify dialog shows page title', expected: 'Dialog displays: "Delete [Page Title]?"' },
        { step: 'Click "Cancel"', expected: 'Dialog closes, page NOT deleted' },
        { step: 'Verify page still exists', expected: 'Page still visible in tree' }
      ]),
      'high',
      'functional',
      JSON.stringify(['delete', 'US-WIKI-004'])
    ]);

    await client.query(`
      INSERT INTO test_cases (id, suite_id, title, preconditions, steps, priority, test_type, tags)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [
      'TS-WIKI-002-04',
      'TS-WIKI-002',
      'Delete page removes it permanently',
      'User has a wiki page to delete',
      JSON.stringify([
        { step: 'Right-click on a wiki page', expected: 'Context menu appears' },
        { step: 'Click "Delete"', expected: 'Confirmation dialog appears' },
        { step: 'Click "Delete" in confirmation', expected: 'Page deleted, dialog closes' },
        { step: 'Check tree view', expected: 'Page no longer appears in tree' },
        { step: 'Try to navigate to deleted page URL', expected: '404 or "Page not found" message' }
      ]),
      'critical',
      'functional',
      JSON.stringify(['delete', 'US-WIKI-004'])
    ]);

    // ============================================================
    // Test Suite 3: Search & Navigation (US-WIKI-005)
    // ============================================================
    console.log('Creating Test Suite: Search & Navigation...');
    await client.query(`
      INSERT INTO test_suites (id, name, description, module)
      VALUES ($1, $2, $3, $4)
    `, ['TS-WIKI-003', 'Search & Navigation', 'Test full-text search across wiki pages', 'wiki']);

    // Test Cases for US-WIKI-005: Full-text search (title + content)
    await client.query(`
      INSERT INTO test_cases (id, suite_id, title, preconditions, steps, priority, test_type, tags)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [
      'TS-WIKI-003-01',
      'TS-WIKI-003',
      'Search finds pages by title',
      'Wiki has multiple pages with different titles',
      JSON.stringify([
        { step: 'Open wiki search (Cmd+K or search bar)', expected: 'Search dialog appears' },
        { step: 'Type partial page title: "Arch"', expected: 'Autocomplete shows matching pages: "Architecture Overview", "Arkhitekton Design"' },
        { step: 'Select "Architecture Overview" from results', expected: 'Selected page opens' },
        { step: 'Verify correct page loaded', expected: 'Page title matches selection' }
      ]),
      'high',
      'functional',
      JSON.stringify(['search', 'US-WIKI-005'])
    ]);

    await client.query(`
      INSERT INTO test_cases (id, suite_id, title, preconditions, steps, priority, test_type, tags)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [
      'TS-WIKI-003-02',
      'TS-WIKI-003',
      'Search finds pages by content',
      'Wiki has pages with specific content',
      JSON.stringify([
        { step: 'Create a page with unique content: "TipTap editor integration"', expected: 'Page saved' },
        { step: 'Open search', expected: 'Search dialog appears' },
        { step: 'Type: "TipTap editor"', expected: 'Search results show the page containing this text' },
        { step: 'Click on result', expected: 'Page opens and search term is highlighted (optional enhancement)' }
      ]),
      'high',
      'functional',
      JSON.stringify(['search', 'US-WIKI-005'])
    ]);

    await client.query(`
      INSERT INTO test_cases (id, suite_id, title, preconditions, steps, priority, test_type, tags)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [
      'TS-WIKI-003-03',
      'TS-WIKI-003',
      'Search shows no results for non-existent content',
      'User is on wiki page',
      JSON.stringify([
        { step: 'Open search', expected: 'Search dialog appears' },
        { step: 'Type: "ZZZNONEXISTENT123"', expected: 'Search executes' },
        { step: 'Verify results', expected: 'Message displays: "No pages found" or empty results list' }
      ]),
      'medium',
      'functional',
      JSON.stringify(['search', 'US-WIKI-005'])
    ]);

    // ============================================================
    // Test Suite 4: Editor Enhancements (US-WIKI-006, 007)
    // ============================================================
    console.log('Creating Test Suite: Editor Enhancements...');
    await client.query(`
      INSERT INTO test_suites (id, name, description, module)
      VALUES ($1, $2, $3, $4)
    `, ['TS-WIKI-004', 'Editor Enhancements', 'Test keyboard shortcuts and block drag-and-drop', 'wiki']);

    // Test Cases for US-WIKI-006: Keyboard shortcuts reference (Cmd+/)
    await client.query(`
      INSERT INTO test_cases (id, suite_id, title, preconditions, steps, priority, test_type, tags)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [
      'TS-WIKI-004-01',
      'TS-WIKI-004',
      'Cmd+/ opens keyboard shortcuts modal',
      'User is in the wiki editor',
      JSON.stringify([
        { step: 'Open a wiki page for editing', expected: 'Editor loads' },
        { step: 'Press Cmd+/ (Mac) or Ctrl+/ (Windows)', expected: 'Keyboard shortcuts modal appears' },
        { step: 'Verify modal shows shortcuts list', expected: 'Modal displays shortcuts: Cmd+S (Save), Cmd+K (Search), etc.' },
        { step: 'Press Esc or click outside', expected: 'Modal closes' }
      ]),
      'medium',
      'functional',
      JSON.stringify(['keyboard-shortcuts', 'US-WIKI-006'])
    ]);

    await client.query(`
      INSERT INTO test_cases (id, suite_id, title, preconditions, steps, priority, test_type, tags)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [
      'TS-WIKI-004-02',
      'TS-WIKI-004',
      'Keyboard shortcuts are functional',
      'User is in the wiki editor',
      JSON.stringify([
        { step: 'Open a wiki page', expected: 'Editor loads' },
        { step: 'Press Cmd+S', expected: 'Page saves (save indicator appears)' },
        { step: 'Press Cmd+K', expected: 'Search dialog opens' },
        { step: 'Press Cmd+B in editor', expected: 'Selected text becomes bold' },
        { step: 'Press Cmd+I in editor', expected: 'Selected text becomes italic' }
      ]),
      'high',
      'functional',
      JSON.stringify(['keyboard-shortcuts', 'US-WIKI-006'])
    ]);

    // Test Cases for US-WIKI-007: Block drag-and-drop reordering
    await client.query(`
      INSERT INTO test_cases (id, suite_id, title, preconditions, steps, priority, test_type, tags)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [
      'TS-WIKI-004-03',
      'TS-WIKI-004',
      'Drag block to reorder within page',
      'User has a wiki page with multiple blocks (paragraphs, headings)',
      JSON.stringify([
        { step: 'Open a wiki page in edit mode', expected: 'Editor loads with multiple blocks' },
        { step: 'Hover over a block handle (⋮⋮ icon)', expected: 'Cursor changes to grab/move cursor' },
        { step: 'Click and drag block to new position', expected: 'Visual feedback shows block being moved (ghost/preview)' },
        { step: 'Drop block in new position', expected: 'Block moves to new position, content re-orders' },
        { step: 'Save page', expected: 'New order persists after save' }
      ]),
      'high',
      'functional',
      JSON.stringify(['drag-drop', 'US-WIKI-007'])
    ]);

    await client.query(`
      INSERT INTO test_cases (id, suite_id, title, preconditions, steps, priority, test_type, tags)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [
      'TS-WIKI-004-04',
      'TS-WIKI-004',
      'Drag-and-drop works with complex blocks',
      'User has a page with different block types (heading, list, code, image)',
      JSON.stringify([
        { step: 'Open a wiki page with: Heading 1, List, Code Block, Paragraph', expected: 'Editor shows all blocks' },
        { step: 'Drag Code Block above Heading 1', expected: 'Code Block moves to top' },
        { step: 'Drag List below Paragraph', expected: 'List moves to bottom' },
        { step: 'Verify all blocks maintain formatting', expected: 'Headings, lists, code all render correctly after reorder' }
      ]),
      'medium',
      'functional',
      JSON.stringify(['drag-drop', 'US-WIKI-007'])
    ]);

    // ============================================================
    // Test Suite 5: Tree Context Menu (US-WIKI-008)
    // ============================================================
    console.log('Creating Test Suite: Tree Context Menu...');
    await client.query(`
      INSERT INTO test_suites (id, name, description, module)
      VALUES ($1, $2, $3, $4)
    `, ['TS-WIKI-005', 'Tree Context Menu', 'Test right-click context menu on wiki tree navigation', 'wiki']);

    // Test Cases for US-WIKI-008: Context menu (right-click) on tree
    await client.query(`
      INSERT INTO test_cases (id, suite_id, title, preconditions, steps, priority, test_type, tags)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [
      'TS-WIKI-005-01',
      'TS-WIKI-005',
      'Right-click shows context menu',
      'User is viewing wiki tree',
      JSON.stringify([
        { step: 'Navigate to wiki tree sidebar', expected: 'Tree shows wiki pages' },
        { step: 'Right-click on any wiki page node', expected: 'Context menu appears with options' },
        { step: 'Verify menu options', expected: 'Menu shows: Open, Edit, Duplicate, Delete, Add Child Page' },
        { step: 'Click outside menu', expected: 'Menu closes' }
      ]),
      'high',
      'functional',
      JSON.stringify(['context-menu', 'US-WIKI-008'])
    ]);

    await client.query(`
      INSERT INTO test_cases (id, suite_id, title, preconditions, steps, priority, test_type, tags)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [
      'TS-WIKI-005-02',
      'TS-WIKI-005',
      'Context menu "Open" navigates to page',
      'User has wiki tree visible',
      JSON.stringify([
        { step: 'Right-click on a wiki page', expected: 'Context menu appears' },
        { step: 'Click "Open" option', expected: 'Page opens in main content area' },
        { step: 'Verify page loaded', expected: 'Page content displays correctly' }
      ]),
      'high',
      'functional',
      JSON.stringify(['context-menu', 'US-WIKI-008'])
    ]);

    await client.query(`
      INSERT INTO test_cases (id, suite_id, title, preconditions, steps, priority, test_type, tags)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [
      'TS-WIKI-005-03',
      'TS-WIKI-005',
      'Context menu "Add Child Page" creates nested page',
      'User has a wiki page in tree',
      JSON.stringify([
        { step: 'Right-click on a parent page', expected: 'Context menu appears' },
        { step: 'Click "Add Child Page"', expected: 'New page dialog appears or inline input field' },
        { step: 'Enter child page title: "Child Page 1"', expected: 'Title accepted' },
        { step: 'Save/Create', expected: 'New child page created under parent' },
        { step: 'Verify tree structure', expected: 'Child page appears indented under parent in tree' }
      ]),
      'high',
      'functional',
      JSON.stringify(['context-menu', 'US-WIKI-008'])
    ]);

    await client.query(`
      INSERT INTO test_cases (id, suite_id, title, preconditions, steps, priority, test_type, tags)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [
      'TS-WIKI-005-04',
      'TS-WIKI-005',
      'Context menu integrates with duplicate and delete',
      'User has a wiki page',
      JSON.stringify([
        { step: 'Right-click on a page', expected: 'Context menu appears' },
        { step: 'Click "Duplicate"', expected: 'Duplicate dialog appears (from US-WIKI-003)' },
        { step: 'Cancel and right-click again', expected: 'Context menu reappears' },
        { step: 'Click "Delete"', expected: 'Delete confirmation appears (from US-WIKI-004)' }
      ]),
      'medium',
      'integration',
      JSON.stringify(['context-menu', 'US-WIKI-008'])
    ]);

    // ============================================================
    // Link Test Cases to User Stories
    // ============================================================
    console.log('\n📎 Linking test cases to user stories...');

    const testCaseStoryLinks = [
      // US-WIKI-001: Auto-save drafts
      ['TS-WIKI-001-01', 'US-WIKI-001'],
      ['TS-WIKI-001-02', 'US-WIKI-001'],
      ['TS-WIKI-001-03', 'US-WIKI-001'],
      // US-WIKI-002: Restore drafts
      ['TS-WIKI-001-04', 'US-WIKI-002'],
      ['TS-WIKI-001-05', 'US-WIKI-002'],
      // US-WIKI-003: Duplicate
      ['TS-WIKI-002-01', 'US-WIKI-003'],
      ['TS-WIKI-002-02', 'US-WIKI-003'],
      // US-WIKI-004: Delete
      ['TS-WIKI-002-03', 'US-WIKI-004'],
      ['TS-WIKI-002-04', 'US-WIKI-004'],
      // US-WIKI-005: Search
      ['TS-WIKI-003-01', 'US-WIKI-005'],
      ['TS-WIKI-003-02', 'US-WIKI-005'],
      ['TS-WIKI-003-03', 'US-WIKI-005'],
      // US-WIKI-006: Keyboard shortcuts
      ['TS-WIKI-004-01', 'US-WIKI-006'],
      ['TS-WIKI-004-02', 'US-WIKI-006'],
      // US-WIKI-007: Drag-drop
      ['TS-WIKI-004-03', 'US-WIKI-007'],
      ['TS-WIKI-004-04', 'US-WIKI-007'],
      // US-WIKI-008: Context menu
      ['TS-WIKI-005-01', 'US-WIKI-008'],
      ['TS-WIKI-005-02', 'US-WIKI-008'],
      ['TS-WIKI-005-03', 'US-WIKI-008'],
      ['TS-WIKI-005-04', 'US-WIKI-008'],
    ];

    for (const [testCaseId, storyId] of testCaseStoryLinks) {
      await client.query(`
        INSERT INTO test_case_stories (test_case_id, story_id)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING
      `, [testCaseId, storyId]);
    }

    await client.query('COMMIT');

    console.log('\n✅ Wiki Sprint W1 Test Suites and Test Cases seeded successfully!');
    console.log('\n📊 Summary:');
    console.log('  - 5 Test Suites created');
    console.log('  - 20 Test Cases created');
    console.log('  - 20 Test Case-Story Links created');
    console.log('  - Coverage: 8 User Stories (US-WIKI-001 to US-WIKI-008)');
    console.log('\n🎯 Next Steps:');
    console.log('  1. Open Quality Center → Test Plan');
    console.log('  2. View test suites: TS-WIKI-001 to TS-WIKI-005');
    console.log('  3. Create test runs for each suite');
    console.log('  4. Execute tests during Wiki Sprint W1 development');
    console.log('  5. Track coverage in Reports tab');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch(console.error);

