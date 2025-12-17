# ARKDL-0018: Wiki Sprint W1 — Test Plan & Test Cases

**Sprint:** W1 - Foundation Polish  
**Version:** 1.0  
**Date:** December 17, 2025  
**Target Completion:** January 3, 2026  
**Test Lead:** QA Team  
**Status:** Ready for Development

---

## 1. Sprint Overview

### Sprint Goal
Complete Phase 1 foundation - all CRUD operations robust and polished, matching Confluence core functionality.

### User Stories in Scope (32 points)

| Story ID | Title | Points | Epic | Status |
|----------|-------|--------|------|--------|
| US-WIKI-001 | Auto-save drafts every 30 seconds | 5 | EPIC-WIKI-01 | 🟡 Ready |
| US-WIKI-002 | Restore from auto-saved drafts | 3 | EPIC-WIKI-01 | 🟡 Ready |
| US-WIKI-003 | Duplicate/clone existing pages | 3 | EPIC-WIKI-01 | 🟡 Ready |
| US-WIKI-004 | Delete with confirmation dialog | 3 | EPIC-WIKI-01 | 🟡 Ready |
| US-WIKI-005 | Full-text search (title + content) | 5 | EPIC-WIKI-01 | 🟡 Ready |
| US-WIKI-006 | Keyboard shortcuts reference (Cmd+/) | 3 | EPIC-WIKI-02 | 🟡 Ready |
| US-WIKI-007 | Block drag-and-drop reordering | 5 | EPIC-WIKI-02 | 🟡 Ready |
| US-WIKI-008 | Context menu (right-click) on tree | 5 | EPIC-WIKI-03 | 🟡 Ready |

### GitHub Integration Requirements
- ✅ Each story must have a linked GitHub issue
- ✅ Development branch: `feature/wiki-sprint-w1`
- ✅ Pull requests must reference story ID in title: `[US-WIKI-001] Auto-save drafts`
- ✅ Commits must include story ID: `feat(wiki): add auto-save timer [US-WIKI-001]`
- ✅ PR must be approved and linked to story before closing

---

## 2. Test Strategy

### Test Levels

| Level | Scope | Tools | Coverage Target |
|-------|-------|-------|-----------------|
| **Unit Tests** | Individual functions, components | Vitest, React Testing Library | 80% |
| **Integration Tests** | API + Database | Supertest, Vitest | 100% of endpoints |
| **Component Tests** | React components in isolation | React Testing Library | Key user flows |
| **E2E Tests** | Full user journeys | Playwright | Critical paths |
| **Manual QA** | UX, edge cases, exploratory | Browser | 100% of acceptance criteria |

### Test Environment

| Environment | Purpose | URL | Database |
|-------------|---------|-----|----------|
| **Local Dev** | Development + Unit tests | `localhost:5001` | PostgreSQL (local) |
| **Staging** | Integration + E2E tests | `staging.arkhitekton.com` | Cloud SQL (test) |
| **Production** | Smoke tests only | `app.arkhitekton.com` | Cloud SQL (prod) |

### Entry Criteria
- ✅ All user stories have acceptance criteria in Gherkin format
- ✅ Database schema changes are reviewed
- ✅ API contracts are documented
- ✅ GitHub issues are created and linked to stories
- ✅ Test data is prepared

### Exit Criteria
- ✅ All test cases pass (0 failures)
- ✅ Code coverage ≥ 80%
- ✅ No P0/P1 defects open
- ✅ All PRs merged to main
- ✅ Documentation updated
- ✅ Demo to product owner approved

---

## 3. Test Cases by User Story

### US-WIKI-001: Auto-save drafts every 30 seconds

**Story Link:** `US-WIKI-001`  
**Epic:** EPIC-WIKI-01  
**Priority:** P1 (Critical)  
**HLR:** HLR-WIKI-007

#### Acceptance Criteria (Gherkin)
```gherkin
Feature: Auto-save Draft Functionality

Background:
  Given I am logged into Arkhitekton Wiki
  And I have navigated to a wiki page editor

Scenario: Auto-save triggers after 30 seconds of inactivity
  Given I am editing a wiki page
  And the page has unsaved changes
  When 30 seconds pass without typing
  Then a draft should be saved automatically
  And I should see a "Draft saved at HH:MM" indicator
  And the draft should be stored in local storage

Scenario: Auto-save does not trigger during active typing
  Given I am editing a wiki page
  And I am continuously typing
  When less than 30 seconds pass since the last keystroke
  Then no auto-save should occur
  And the "unsaved changes" indicator should remain visible

Scenario: Auto-save includes all editor content
  Given I am editing a page with:
    | Content Type | Value |
    | Title | Architecture Decision Record |
    | Body | # Context\nWe need to choose... |
    | @Mentions | @US-WIKI-001, @component-auth |
  When the auto-save triggers
  Then all content should be saved to the draft
  And retrieving the draft should restore exact content

Scenario: Multiple drafts per page (versioning)
  Given I have an auto-saved draft from 2 minutes ago
  When I make additional changes
  And another auto-save occurs
  Then the newest draft should be stored
  And the old draft should be retained (up to 5 versions)
```

#### Test Cases

**TC-WIKI-001-01: Auto-save Timer Activation**
- **Type:** Functional
- **Priority:** P1
- **Steps:**
  1. Open wiki page editor
  2. Type "Test content"
  3. Stop typing and wait 30 seconds
  4. Observe auto-save indicator
- **Expected:** Draft saved message appears within 1 second of 30s mark
- **Data:** New blank page
- **Automated:** ✅ Yes (E2E)

**TC-WIKI-001-02: Auto-save Timer Reset on Keystroke**
- **Type:** Functional
- **Priority:** P1
- **Steps:**
  1. Start editing
  2. Wait 25 seconds
  3. Type one character
  4. Wait 10 seconds (total 35s from first edit)
- **Expected:** No auto-save occurs (timer reset)
- **Automated:** ✅ Yes (E2E)

**TC-WIKI-001-03: Auto-save Data Integrity**
- **Type:** Integration
- **Priority:** P1
- **Steps:**
  1. Create page with title, body, @mentions, images
  2. Trigger auto-save
  3. Inspect localStorage
- **Expected:** All content serialized correctly as JSON
- **Automated:** ✅ Yes (Integration)

**TC-WIKI-001-04: Auto-save with Network Failure**
- **Type:** Negative
- **Priority:** P2
- **Steps:**
  1. Edit page
  2. Disconnect network
  3. Trigger auto-save
- **Expected:** Fallback to localStorage only, no error shown
- **Automated:** ⬜ Manual

**TC-WIKI-001-05: Auto-save Performance (Large Page)**
- **Type:** Performance
- **Priority:** P2
- **Steps:**
  1. Create page with 10,000 words + 50 images
  2. Edit and trigger auto-save
  3. Measure time to save
- **Expected:** Auto-save completes in < 500ms
- **Automated:** ✅ Yes (Performance test)

---

### US-WIKI-002: Restore from auto-saved drafts

**Story Link:** `US-WIKI-002`  
**Epic:** EPIC-WIKI-01  
**Priority:** P1  
**HLR:** HLR-WIKI-008

#### Acceptance Criteria (Gherkin)
```gherkin
Feature: Restore Auto-saved Drafts

Scenario: Show draft recovery prompt on page load
  Given I have an auto-saved draft from 2 minutes ago
  When I navigate to that wiki page
  Then I should see a yellow banner: "You have an unsaved draft from 2 minutes ago"
  And I should see buttons: [Restore Draft] [Discard Draft]

Scenario: Restore draft content
  Given I see the draft recovery prompt
  When I click "Restore Draft"
  Then the editor should load the draft content
  And the "unsaved changes" indicator should appear
  And I should be able to continue editing

Scenario: Discard draft
  Given I see the draft recovery prompt
  When I click "Discard Draft"
  Then the draft should be deleted from storage
  And the prompt should disappear
  And the published page content should load

Scenario: Draft older than 7 days auto-expires
  Given I have a draft saved 8 days ago
  When I navigate to that page
  Then no draft prompt should appear
  And the draft should be cleaned up from storage
```

#### Test Cases

**TC-WIKI-002-01: Draft Recovery Banner Display**
- **Type:** UI
- **Priority:** P1
- **Steps:**
  1. Create draft via US-WIKI-001
  2. Navigate away and return to page
- **Expected:** Yellow banner appears with timestamp
- **Automated:** ✅ Yes (E2E)

**TC-WIKI-002-02: Restore Draft Button**
- **Type:** Functional
- **Priority:** P1
- **Steps:**
  1. Click "Restore Draft" on banner
  2. Verify editor content matches draft
- **Expected:** All draft content loaded correctly
- **Automated:** ✅ Yes (E2E)

**TC-WIKI-002-03: Discard Draft Button**
- **Type:** Functional
- **Priority:** P1
- **Steps:**
  1. Click "Discard Draft"
  2. Check localStorage
- **Expected:** Draft removed, published content shown
- **Automated:** ✅ Yes (E2E)

**TC-WIKI-002-04: Draft Expiration (7 days)**
- **Type:** Functional
- **Priority:** P2
- **Steps:**
  1. Manually create draft with timestamp 8 days ago
  2. Load page
- **Expected:** No banner, draft cleaned up
- **Automated:** ✅ Yes (Integration)

**TC-WIKI-002-05: Multiple Draft Versions**
- **Type:** Functional
- **Priority:** P2
- **Steps:**
  1. Create 5 draft versions
  2. Restore should show most recent
- **Expected:** Latest draft loaded, option to view older versions
- **Automated:** ⬜ Manual

---

### US-WIKI-003: Duplicate/clone existing pages

**Story Link:** `US-WIKI-003`  
**Epic:** EPIC-WIKI-01  
**Priority:** P2  
**HLR:** HLR-WIKI-006

#### Acceptance Criteria (Gherkin)
```gherkin
Feature: Page Duplication

Scenario: Duplicate page from toolbar
  Given I am viewing a wiki page "API Guidelines v1"
  When I click the "..." menu in toolbar
  And I select "Duplicate Page"
  Then a new page should be created with:
    | Field | Value |
    | Title | API Guidelines v1 (Copy) |
    | Content | Exact copy of source |
    | Parent | Same parent as source |
  And I should be redirected to edit the new page

Scenario: Duplicate page preserves @mentions
  Given the source page contains @US-WIKI-001 and @component-api
  When I duplicate the page
  Then the new page should contain the same mentions
  And the mentions should remain functional (clickable, hover)

Scenario: Duplicate page with hierarchy
  Given page "Architecture" has child pages "Backend", "Frontend"
  When I duplicate "Architecture"
  Then only the root page should be copied (no children)
  And I should see a message: "Note: Child pages are not duplicated"
```

#### Test Cases

**TC-WIKI-003-01: Basic Page Duplication**
- **Type:** Functional
- **Priority:** P1
- **Steps:**
  1. Open page with title "Test Page"
  2. Click "..." → "Duplicate Page"
  3. Verify new page created
- **Expected:** Title = "Test Page (Copy)", content identical
- **Automated:** ✅ Yes (E2E)

**TC-WIKI-003-02: Duplicate Preserves Formatting**
- **Type:** Functional
- **Priority:** P1
- **Steps:**
  1. Create page with headings, lists, code blocks, images
  2. Duplicate
- **Expected:** All formatting preserved exactly
- **Automated:** ✅ Yes (E2E)

**TC-WIKI-003-03: Duplicate with @Mentions**
- **Type:** Integration
- **Priority:** P1
- **Steps:**
  1. Create page with @US-WIKI-001, @component-auth
  2. Duplicate
  3. Test mention hover and click
- **Expected:** Mentions functional in duplicated page
- **Automated:** ✅ Yes (E2E)

**TC-WIKI-003-04: Duplicate Does Not Copy Children**
- **Type:** Functional
- **Priority:** P2
- **Steps:**
  1. Create parent with 3 child pages
  2. Duplicate parent
- **Expected:** Only parent duplicated, warning shown
- **Automated:** ✅ Yes (Integration)

---

### US-WIKI-004: Delete with confirmation dialog

**Story Link:** `US-WIKI-004`  
**Epic:** EPIC-WIKI-01  
**Priority:** P1  
**HLR:** HLR-WIKI-004

#### Acceptance Criteria (Gherkin)
```gherkin
Feature: Safe Page Deletion

Scenario: Delete page with confirmation
  Given I am viewing a wiki page "Old Documentation"
  When I click the "..." menu and select "Delete Page"
  Then I should see a confirmation dialog with:
    | Element | Text |
    | Title | Delete "Old Documentation"? |
    | Warning | This action cannot be undone |
    | Buttons | [Cancel] [Delete] |

Scenario: Cancel deletion
  Given I see the delete confirmation dialog
  When I click "Cancel" or press ESC
  Then the dialog should close
  And the page should remain unchanged

Scenario: Confirm deletion
  Given I see the delete confirmation dialog
  When I click "Delete"
  Then the page should be removed from the database
  And I should be redirected to the parent page or home
  And I should see a success toast: "Page deleted successfully"

Scenario: Delete page with children shows warning
  Given page "Architecture" has 3 child pages
  When I attempt to delete "Architecture"
  Then I should see an error: "Cannot delete page with children"
  And the delete should be blocked
```

#### Test Cases

**TC-WIKI-004-01: Delete Confirmation Dialog Display**
- **Type:** UI
- **Priority:** P1
- **Steps:**
  1. Click "..." → "Delete Page"
- **Expected:** Modal appears with correct warning text
- **Automated:** ✅ Yes (E2E)

**TC-WIKI-004-02: Cancel Deletion**
- **Type:** Functional
- **Priority:** P1
- **Steps:**
  1. Open delete dialog
  2. Click "Cancel"
  3. Verify page still exists
- **Expected:** Dialog closes, no deletion
- **Automated:** ✅ Yes (E2E)

**TC-WIKI-004-03: Confirm Deletion**
- **Type:** Functional
- **Priority:** P1
- **Steps:**
  1. Open delete dialog
  2. Click "Delete"
  3. Check database
- **Expected:** Page removed, redirected to parent
- **Automated:** ✅ Yes (Integration)

**TC-WIKI-004-04: Block Deletion of Parent with Children**
- **Type:** Negative
- **Priority:** P1
- **Steps:**
  1. Attempt to delete parent with children
- **Expected:** Error message, deletion blocked
- **Automated:** ✅ Yes (Integration)

**TC-WIKI-004-05: Delete Updates Backlinks**
- **Type:** Integration
- **Priority:** P2
- **Steps:**
  1. Page A mentions Page B
  2. Delete Page B
  3. Check Page A's mentions
- **Expected:** Mention becomes inactive/grayed
- **Automated:** ✅ Yes (Integration)

---

### US-WIKI-005: Full-text search (title + content)

**Story Link:** `US-WIKI-005`  
**Epic:** EPIC-WIKI-01  
**Priority:** P1  
**HLR:** HLR-WIKI-010

#### Acceptance Criteria (Gherkin)
```gherkin
Feature: Wiki Full-Text Search

Scenario: Search by title
  Given I have pages: "API Design", "API Testing", "Database Schema"
  When I type "API" in the search box
  Then I should see results: "API Design", "API Testing"
  And results should be sorted by relevance

Scenario: Search by content
  Given page "Backend Guide" contains "PostgreSQL database connection"
  When I search for "PostgreSQL"
  Then "Backend Guide" should appear in results
  And the matching snippet should be highlighted

Scenario: Search with @mentions
  Given page "Architecture" contains @component-auth
  When I search for "@component-auth"
  Then "Architecture" should appear in results

Scenario: No results found
  Given no pages match "xyz123"
  When I search for "xyz123"
  Then I should see "No pages found"
  And a suggestion: "Try different keywords"

Scenario: Real-time search (debounced)
  Given I start typing "arc"
  When I pause for 300ms
  Then search results should update
  But no search should occur while typing rapidly
```

#### Test Cases

**TC-WIKI-005-01: Search by Title**
- **Type:** Functional
- **Priority:** P1
- **Steps:**
  1. Create 5 pages with different titles
  2. Search for keyword in title
- **Expected:** Matching pages returned, sorted by relevance
- **Automated:** ✅ Yes (Integration)

**TC-WIKI-005-02: Search by Content**
- **Type:** Functional
- **Priority:** P1
- **Steps:**
  1. Create page with specific keyword in body
  2. Search for that keyword
- **Expected:** Page found, snippet shown with highlight
- **Automated:** ✅ Yes (Integration)

**TC-WIKI-005-03: Search with Special Characters**
- **Type:** Functional
- **Priority:** P2
- **Steps:**
  1. Search for "@component", "user-story", "API/v2"
- **Expected:** Special chars handled correctly
- **Automated:** ✅ Yes (Integration)

**TC-WIKI-005-04: Empty Search**
- **Type:** Negative
- **Priority:** P2
- **Steps:**
  1. Clear search box
  2. Submit search
- **Expected:** Show all pages or helpful message
- **Automated:** ⬜ Manual

**TC-WIKI-005-05: Search Performance (1000+ pages)**
- **Type:** Performance
- **Priority:** P2
- **Steps:**
  1. Seed 1000 pages
  2. Perform search
  3. Measure response time
- **Expected:** Results in < 200ms
- **Automated:** ✅ Yes (Load test)

---

### US-WIKI-006: Keyboard shortcuts reference (Cmd+/)

**Story Link:** `US-WIKI-006`  
**Epic:** EPIC-WIKI-02  
**Priority:** P2  
**HLR:** HLR-WIKI-032

#### Acceptance Criteria (Gherkin)
```gherkin
Feature: Keyboard Shortcuts Panel

Scenario: Open shortcuts panel
  Given I am in the wiki editor
  When I press Cmd+/ (Mac) or Ctrl+/ (Windows)
  Then a modal should appear showing all keyboard shortcuts
  And shortcuts should be grouped by category:
    | Category | Example Shortcuts |
    | Editor | Cmd+B (Bold), Cmd+I (Italic) |
    | Navigation | Cmd+K (Insert link) |
    | Page | Cmd+S (Save) |

Scenario: Close shortcuts panel
  Given the shortcuts panel is open
  When I press ESC or click outside
  Then the panel should close

Scenario: Search shortcuts
  Given the shortcuts panel is open
  When I type "bold" in the search box
  Then only "Cmd+B - Bold" should be visible
```

#### Test Cases

**TC-WIKI-006-01: Open Shortcuts with Cmd+/**
- **Type:** Functional
- **Priority:** P1
- **Steps:**
  1. Press Cmd+/ in editor
- **Expected:** Modal appears with shortcuts list
- **Automated:** ✅ Yes (E2E)

**TC-WIKI-006-02: Cross-Platform Shortcuts**
- **Type:** Functional
- **Priority:** P1
- **Steps:**
  1. Test on Mac (Cmd) and Windows (Ctrl)
- **Expected:** Correct modifier key shown
- **Automated:** ⬜ Manual

**TC-WIKI-006-03: Search Shortcuts**
- **Type:** Functional
- **Priority:** P2
- **Steps:**
  1. Open panel, search "save"
- **Expected:** Only Cmd+S shown
- **Automated:** ✅ Yes (E2E)

---

### US-WIKI-007: Block drag-and-drop reordering

**Story Link:** `US-WIKI-007`  
**Epic:** EPIC-WIKI-02  
**Priority:** P1  
**HLR:** HLR-WIKI-031

#### Acceptance Criteria (Gherkin)
```gherkin
Feature: Block Drag-and-Drop

Scenario: Drag block to reorder
  Given I have a page with blocks:
    | Position | Type | Content |
    | 1 | Heading | Introduction |
    | 2 | Paragraph | Text A |
    | 3 | Paragraph | Text B |
  When I drag block 3 above block 2
  Then the order should become:
    | Position | Type | Content |
    | 1 | Heading | Introduction |
    | 2 | Paragraph | Text B |
    | 3 | Paragraph | Text A |

Scenario: Visual drag feedback
  Given I start dragging a block
  When I move the cursor
  Then I should see:
    - A ghost preview of the block
    - A blue insertion line where it will drop
    - Other blocks shift to make space

Scenario: Drop to cancel
  Given I am dragging a block
  When I press ESC or release outside editor
  Then the drag should cancel
  And blocks should return to original positions
```

#### Test Cases

**TC-WIKI-007-01: Basic Block Reordering**
- **Type:** Functional
- **Priority:** P1
- **Steps:**
  1. Create 5 blocks
  2. Drag block 5 to position 2
  3. Verify order
- **Expected:** Blocks reordered correctly
- **Automated:** ✅ Yes (E2E)

**TC-WIKI-007-02: Drag Feedback UI**
- **Type:** UI
- **Priority:** P1
- **Steps:**
  1. Drag a block
  2. Observe ghost preview and insertion line
- **Expected:** Visual feedback clear and smooth
- **Automated:** ⬜ Manual

**TC-WIKI-007-03: Cancel Drag with ESC**
- **Type:** Functional
- **Priority:** P2
- **Steps:**
  1. Start dragging
  2. Press ESC
- **Expected:** Drag cancelled, no changes
- **Automated:** ✅ Yes (E2E)

---

### US-WIKI-008: Context menu (right-click) on tree

**Story Link:** `US-WIKI-008`  
**Epic:** EPIC-WIKI-03  
**Priority:** P1  
**HLR:** HLR-WIKI-046

#### Acceptance Criteria (Gherkin)
```gherkin
Feature: Tree Context Menu

Scenario: Right-click on tree item
  Given I am viewing the wiki tree sidebar
  When I right-click on a page "API Guidelines"
  Then I should see a context menu with options:
    | Option | Icon |
    | Open in new tab | 🔗 |
    | Duplicate | 📄 |
    | Move to... | 📁 |
    | Delete | 🗑️ |
    | Add child page | ➕ |

Scenario: Open in new tab
  Given I right-click on "API Guidelines"
  When I select "Open in new tab"
  Then the page should open in a new browser tab

Scenario: Add child page from context menu
  Given I right-click on "Backend"
  When I select "Add child page"
  Then a new blank page should be created under "Backend"
  And I should be taken to the editor
```

#### Test Cases

**TC-WIKI-008-01: Context Menu Display**
- **Type:** UI
- **Priority:** P1
- **Steps:**
  1. Right-click tree item
- **Expected:** Menu appears with all options
- **Automated:** ✅ Yes (E2E)

**TC-WIKI-008-02: Open in New Tab**
- **Type:** Functional
- **Priority:** P1
- **Steps:**
  1. Right-click → "Open in new tab"
- **Expected:** New tab opens with page
- **Automated:** ✅ Yes (E2E)

**TC-WIKI-008-03: Add Child Page**
- **Type:** Functional
- **Priority:** P1
- **Steps:**
  1. Right-click → "Add child page"
- **Expected:** New page created under parent
- **Automated:** ✅ Yes (Integration)

**TC-WIKI-008-04: Context Menu Keyboard Navigation**
- **Type:** Accessibility
- **Priority:** P2
- **Steps:**
  1. Open context menu
  2. Use arrow keys to navigate
  3. Press Enter to select
- **Expected:** Keyboard navigation works
- **Automated:** ⬜ Manual

---

## 4. Integration Test Scenarios

### INT-WIKI-001: Auto-save + Restore Flow
**Stories:** US-WIKI-001, US-WIKI-002  
**Priority:** P1

**Scenario:**
1. Create new page
2. Type content, trigger auto-save
3. Navigate away without saving
4. Return to page
5. Restore draft
6. Save page

**Expected:** Full flow works end-to-end

---

### INT-WIKI-002: Search + Delete + Backlinks
**Stories:** US-WIKI-004, US-WIKI-005  
**Priority:** P1

**Scenario:**
1. Create Page A mentioning Page B
2. Search for Page B
3. Delete Page B
4. Search again
5. Check Page A's mentions

**Expected:** Search updated, mentions handled gracefully

---

### INT-WIKI-003: Duplicate + Drag-Drop + Context Menu
**Stories:** US-WIKI-003, US-WIKI-007, US-WIKI-008  
**Priority:** P2

**Scenario:**
1. Create page with 5 blocks
2. Duplicate page
3. Reorder blocks via drag-drop
4. Right-click in tree → Add child

**Expected:** All operations work on duplicated page

---

## 5. GitHub Integration Checklist

### Per Story Requirements

**Before Development:**
- [ ] GitHub issue created with title: `[US-WIKI-XXX] Story Title`
- [ ] Issue has labels: `wiki`, `sprint-w1`, `type:feature`
- [ ] Issue linked to Epic milestone: `EPIC-WIKI-XX`
- [ ] Issue assigned to developer

**During Development:**
- [ ] Feature branch created: `feature/us-wiki-xxx-short-desc`
- [ ] Commits reference story: `feat(wiki): add feature [US-WIKI-XXX]`
- [ ] PR created with title: `[US-WIKI-XXX] Story Title`
- [ ] PR description includes:
  - Link to story
  - Summary of changes
  - Screenshots/video
  - How to test

**After Development:**
- [ ] PR approved by 1+ reviewer
- [ ] All CI checks pass
- [ ] PR merged to `main`
- [ ] GitHub issue linked to PR (auto or manual)
- [ ] Story status updated to "Done"

### Branch Strategy
```
main (protected)
  └─ feature/wiki-sprint-w1
      ├─ feature/us-wiki-001-auto-save
      ├─ feature/us-wiki-002-restore-draft
      ├─ feature/us-wiki-003-duplicate
      ├─ feature/us-wiki-004-delete
      ├─ feature/us-wiki-005-search
      ├─ feature/us-wiki-006-shortcuts
      ├─ feature/us-wiki-007-drag-drop
      └─ feature/us-wiki-008-context-menu
```

---

## 6. Test Data Requirements

### Pages for Testing
```json
[
  {
    "id": "test-page-001",
    "title": "API Design Guidelines",
    "content": "# REST API Standards\n@US-WIKI-001 references auto-save",
    "parentId": null
  },
  {
    "id": "test-page-002",
    "title": "Backend Architecture",
    "content": "PostgreSQL database with @component-auth",
    "parentId": "test-page-001",
    "children": ["test-page-003", "test-page-004"]
  },
  {
    "id": "test-page-003",
    "title": "Database Schema",
    "content": "Table definitions...",
    "parentId": "test-page-002"
  }
]
```

### Test Users
- **Developer:** `dev@arkhitekton.com` (create, edit, delete)
- **Viewer:** `viewer@arkhitekton.com` (read-only)
- **Admin:** `admin@arkhitekton.com` (full access)

---

## 7. Non-Functional Requirements

### Performance Targets
| Metric | Target | Measurement |
|--------|--------|-------------|
| **Auto-save time** | < 500ms | Time from trigger to saved |
| **Search response** | < 200ms | Time to return 100 results |
| **Page load** | < 1s | Time to render editor |
| **Drag-drop lag** | < 16ms | Frame rate during drag |

### Browser Support
- ✅ Chrome 120+ (primary)
- ✅ Firefox 121+
- ✅ Safari 17+
- ✅ Edge 120+

### Accessibility (WCAG 2.1 AA)
- ✅ Keyboard navigation for all features
- ✅ Screen reader support
- ✅ Color contrast ratio ≥ 4.5:1
- ✅ Focus indicators visible

---

## 8. Defect Management

### Severity Levels
| Level | Description | Response Time |
|-------|-------------|---------------|
| **P0 - Critical** | Blocks release, data loss | Immediate |
| **P1 - High** | Major feature broken | 24 hours |
| **P2 - Medium** | Minor feature issue | 3 days |
| **P3 - Low** | Cosmetic, enhancement | Backlog |

### Defect Reporting Template
```
Title: [US-WIKI-XXX] Brief description
Priority: P1
Steps to Reproduce:
1. ...
2. ...
Expected: ...
Actual: ...
Environment: Chrome 120, macOS 14
Screenshots: [attach]
Related Story: US-WIKI-XXX
```

---

## 9. Test Execution Schedule

### Week 1 (Dec 18-22)
- **Mon-Tue:** Unit tests written alongside development
- **Wed-Thu:** Component tests + Integration tests
- **Fri:** Code review + merge PRs

### Week 2 (Dec 25-29)
- **Mon-Tue:** E2E tests for all stories
- **Wed:** Regression testing
- **Thu:** Performance + accessibility testing
- **Fri:** Bug fixes

### Week 3 (Jan 2-3)
- **Fri Jan 3:** Final manual QA + Sprint demo

---

## 10. Sign-Off Criteria

### Development Complete When:
- ✅ All 8 user stories implemented
- ✅ All PRs merged to main
- ✅ No P0/P1 defects open

### Testing Complete When:
- ✅ All test cases executed (0 failures)
- ✅ Code coverage ≥ 80%
- ✅ Performance benchmarks met
- ✅ Accessibility audit passed

### Sprint Complete When:
- ✅ Product owner demo approved
- ✅ Documentation updated
- ✅ Retrospective completed
- ✅ GitHub issues closed with PR links

---

## 11. Risks & Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| TipTap auto-save conflicts with manual save | High | Medium | Debounce logic, clear state machine |
| Search performance with large datasets | Medium | High | Add pagination, optimize queries, consider Elasticsearch |
| Drag-drop browser compatibility issues | Medium | Low | Use battle-tested library (@hello-pangea/dnd) |
| Context menu conflicts with browser menu | Low | Medium | preventDefault on right-click, provide fallback |

---

## 12. Contact & Escalation

| Role | Name | Email | Slack |
|------|------|-------|-------|
| **Test Lead** | QA Team | qa@arkhitekton.com | #wiki-testing |
| **Dev Lead** | Tech Lead | tech@arkhitekton.com | #wiki-dev |
| **Product Owner** | PM | pm@arkhitekton.com | #wiki |
| **Escalation** | Engineering Manager | em@arkhitekton.com | DM |

---

**Approval:**
- [ ] Product Owner: _________________________  Date: __________
- [ ] Engineering Lead: _________________________  Date: __________
- [ ] QA Lead: _________________________  Date: __________


