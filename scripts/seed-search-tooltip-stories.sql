-- User Stories for Interactive Linked Items Tooltip (Option 1c)
-- Closes traceability gap for clickable hover tooltip enhancement

-- Product Story: US-SEARCH-007
INSERT INTO user_stories (
  id, epic_id, title, description, acceptance_criteria, story_points, status,
  priority, assignee, product_manager, tech_lead, feature, value,
  requirement, related_files, created_at, updated_at
) VALUES (
  'US-SEARCH-007',
  'EPIC-SEARCH-01',
  'Interactive Linked Items Tooltip in Search Results',
  '**As a** user searching for commits/PRs
**I want** to see and click on all linked items from a commit in search results
**So that** I can quickly navigate to related stories and defects without leaving the search context

**Context**:
When searching by commit SHA or PR number, the search returns the primary entity (usually a defect). However, that commit may be linked to multiple user stories and other defects. Currently, users see "+ X other stories" but cannot interact with it to view or navigate to those items.

**User Value**:
- Quick access to all related items from a single commit
- Stay in search context (no page navigation)
- Explore relationships between defects, stories, and code changes
- Better understanding of the scope of a code change

**Business Value**:
- Improved developer productivity
- Faster incident investigation
- Better code change traceability
- Enhanced search experience',
  'Feature: Interactive Linked Items Tooltip
  As a user searching for commits
  I want interactive tooltips for linked items
  So I can navigate to related entities quickly

  Scenario: Hover shows linked items popover
    Given I search for commit "3f4e05f"
    And the result shows "DEF-SEARCH-001" with "+ 3 other stories"
    When I hover over "+ 3 other stories"
    Then a popover should appear within 300ms
    And it should display "Also Linked To" as the header
    And it should list all 3 linked items (excluding the primary defect)

  Scenario: Linked items display correctly
    Given the popover is open with linked items
    Then each item should show an entity-type icon
    And each item should show the ID in monospace font
    And each item should show a truncated title (first 10 chars + "...")
    And the format should be: "US-SEARCH-006: Keyboard Sh..."

  Scenario: Click opens detail sheet
    Given the popover is open with linked items
    When I click on "US-SEARCH-006: Keyboard Sh..."
    Then the story detail sheet should open
    And the search modal should remain open behind it
    And the popover should close

  Scenario: Navigate between linked items
    Given I opened a story detail sheet from the popover
    When I close the sheet
    Then I return to the search results
    And I can immediately click another linked item
    And I do not need to re-search

  Scenario: Popover interaction
    Given the popover is open
    When I hover over the popover content
    Then the popover should stay open
    When I click outside the popover
    Then the popover should close
    When I press Escape
    Then the popover should close

  Scenario: Accessibility
    Given I am using keyboard navigation
    When I Tab to the "+ 3 other stories" button
    And I press Enter or Space
    Then the popover should open
    When I Tab within the popover
    Then I can focus on each linked item
    When I press Enter on a focused item
    Then the detail sheet should open

  Scenario: Only one linked item
    Given a search result has only 1 linked item (the primary)
    Then the "+ X other stories" button should not appear
    And no tooltip should be shown

  Scenario: Many linked items
    Given a search result has 10+ linked items
    Then all items should appear in the popover
    And the popover should be scrollable if needed

  Scenario: Mobile interaction
    Given I am on a mobile device
    When I tap "+ 3 other stories"
    Then the popover should appear (no hover required)
    When I tap a linked item
    Then the detail sheet should open',
  3,
  'done',
  'high',
  'system',
  'system',
  'system',
  'Global Search',
  'Quick access to all related items from commits, better traceability',
  'PRD-SEARCH-001, TDS-SEARCH-001',
  ARRAY[
    'client/src/components/search/search-result-card.tsx',
    'client/src/hooks/use-global-search.ts',
    'docs/Search_PR_Prototypes/Search_PR_Option_1c_ContextAware.html'
  ]::text[],
  NOW(),
  NOW()
),

-- Implementation Story: US-SEARCH-IMPL-007
(
  'US-SEARCH-IMPL-007',
  'EPIC-SEARCH-01',
  'Implement Interactive Linked Items Popover Component',
  '**As a** developer
**I want** to implement the interactive linked items popover with StoryDetailSheet integration
**So that** product story US-SEARCH-007 is fulfilled

**Technical Requirements**:

1. **Backend API Enhancement** (Already Complete)
   - Verify `/api/entities/search` returns `linkedItems` array
   - Each item includes: id, title, entityType, url
   - Primary item is included in the array

2. **Frontend Type Updates** (Already Complete)
   - Update `SearchResult.metadata` interface
   - Add `linkedItems` array type definition
   - Ensure TypeScript type safety

3. **React Component Implementation** (Already Complete)
   - Use shadcn `Popover` component
   - Import `StoryDetailSheet` from plan module
   - Add state management for selected story ID
   - Implement truncation utility (10 chars + "...")
   - Add entity type icon helper function
   - Handle event propagation (stopPropagation)
   - Integrate with wouter for client-side routing

4. **HTML Prototype Update** (Already Complete)
   - Make tooltip items clickable
   - Add onclick handlers with alerts (for demo)
   - Update CSS for hover states on links
   - Ensure tooltip stays open when hovering

**Implementation Details**:

**File**: `server/routes.ts`
- Lines 4164-4258: Already returns linkedItems array
- No changes needed

**File**: `client/src/hooks/use-global-search.ts`
- Lines 22-27: Interface already defined
- No changes needed

**File**: `client/src/components/search/search-result-card.tsx`
- Lines 1-8: Import Popover, StoryDetailSheet
- Lines 18-22: truncateTitle helper
- Lines 25-36: getIconForEntityType helper
- Lines 41: selectedStoryId state
- Lines 125-164: Popover + trigger + content
- Lines 167-175: StoryDetailSheet integration

**File**: `docs/Search_PR_Prototypes/Search_PR_Option_1c_ContextAware.html`
- Lines 474, 481, 488: onclick handlers
- Lines 326-368: Clickable tooltip styles
- Already complete

**Testing**:
- Verify popover appears on hover (~300ms delay)
- Verify all linked items display (excluding primary)
- Verify truncation works correctly
- Verify click opens StoryDetailSheet
- Verify search modal stays open
- Verify keyboard navigation works
- Verify mobile tap interaction works
- Verify accessibility (screen readers, focus management)',
  'Technical Acceptance Criteria:

### Backend ✅
- [ ] API returns linkedItems array with all details
- [ ] Each item has: id, title, entityType, url
- [ ] Response time < 200ms

### Frontend ✅
- [ ] Popover component imported from shadcn
- [ ] StoryDetailSheet imported from plan module
- [ ] selectedStoryId state added
- [ ] truncateTitle function implemented
- [ ] getIconForEntityType function implemented
- [ ] Event propagation handled correctly
- [ ] Filter excludes primary item from popover

### Component Rendering ✅
- [ ] Trigger button shows "+ X other stories"
- [ ] Popover content has "Also Linked To" header
- [ ] Each item shows icon, ID, truncated title
- [ ] Hover changes background color
- [ ] Click opens StoryDetailSheet
- [ ] Popover closes when clicking outside

### Integration ✅
- [ ] Search modal stays open when sheet opens
- [ ] Close sheet returns to search results
- [ ] Can open multiple sheets sequentially
- [ ] wouter client-side routing works

### Accessibility ✅
- [ ] Keyboard navigation (Tab, Enter, Escape)
- [ ] ARIA labels present
- [ ] Focus visible on all interactive elements
- [ ] Screen reader announcements work

### Prototype ✅
- [ ] HTML has onclick handlers
- [ ] Tooltip styles support clickable links
- [ ] Hover states work correctly
- [ ] Demo alerts show on click',
  3,
  'done',
  'high',
  'system',
  'system',
  'system',
  'Global Search',
  'Technical implementation of interactive tooltip',
  'TDS-SEARCH-001',
  ARRAY[
    'server/routes.ts',
    'client/src/hooks/use-global-search.ts',
    'client/src/components/search/search-result-card.tsx',
    'client/src/components/ui/popover.tsx',
    'client/src/components/plan/story-detail-sheet.tsx',
    'docs/Search_PR_Prototypes/Search_PR_Option_1c_ContextAware.html'
  ]::text[],
  NOW(),
  NOW()
);

-- Verify insertion
SELECT 
  id,
  title,
  story_points,
  status,
  epic_id
FROM user_stories
WHERE id IN ('US-SEARCH-007', 'US-SEARCH-IMPL-007')
ORDER BY id;

