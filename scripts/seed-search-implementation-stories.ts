/**
 * Seed implementation stories for Global Search Modal (US-SEARCH-006)
 * Fixes DEF-SEARCH-001: CMD+K not working
 */

import { db } from '../server/db';
import { userStories, epics } from '../shared/schema';
import { eq } from 'drizzle-orm';

const EPIC_ID = 'EPIC-SEARCH-001';

const implementationStories = [
  {
    id: 'US-SEARCH-IMPL-001',
    epicId: EPIC_ID,
    title: '[IMPL] Create Global Search Modal Component',
    description: `**Technical Implementation Story**

Create a reusable GlobalSearchModal component that can be triggered from anywhere in the application.

**Parent Story:** US-SEARCH-006 (Keyboard Shortcuts)
**Fixes:** DEF-SEARCH-001 (CMD+K not working)

**Technical Requirements:**
- Create \`client/src/components/search/global-search-modal.tsx\`
- Use shadcn Dialog component for modal UI
- Integrate with \`useGlobalSearch\` hook
- Implement debounced search (300ms delay)
- Add auto-focus on search input
- Include keyboard navigation (↑↓, Enter, Esc)
- Display search results with SearchResultCard
- Show loading/error/empty states
- Make responsive for mobile/desktop

**Acceptance Criteria:**
- Component can be mounted anywhere in app
- Opens/closes via \`open\` prop
- Auto-focuses input on open
- Shows real-time search results
- Handles loading and error states
- Closes on Esc key or result selection`,
    acceptanceCriteria: `Feature: Global Search Modal Component
  As a developer
  I want a reusable search modal component
  So that users can search from anywhere

  Scenario: Modal opens and focuses input
    Given the GlobalSearchModal is mounted
    When the open prop changes to true
    Then the modal should appear
    And the search input should be focused
    And the cursor should be in the input field

  Scenario: Search results display correctly
    Given the modal is open
    When I type "US-WIKI" in the search input
    And the debounce completes (300ms)
    Then API should be called with query "US-WIKI"
    And results should display using SearchResultCard
    And result count should show at top

  Scenario: Keyboard navigation works
    Given the modal is open with search results
    When I press "Down Arrow"
    Then the first result should be highlighted
    When I press "Enter"
    Then I should navigate to the selected result
    And the modal should close

  Scenario: Close modal with Escape
    Given the modal is open
    When I press "Esc"
    Then the modal should close
    And the search query should be cleared`,
    storyPoints: 5,
    priority: 'high',
    status: 'done',
    assignee: 'Development Team',
    labels: ['implementation', 'search', 'ui', 'react', 'keyboard'],
    technicalNotes: `**Component Architecture:**
\`\`\`typescript
interface GlobalSearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
\`\`\`

**Key Dependencies:**
- shadcn/ui Dialog
- useGlobalSearch hook
- useDebouncedSearch hook
- SearchResultCard component
- wouter (navigation)

**State Management:**
- searchQuery (controlled input)
- selectedIndex (keyboard navigation)
- Auto-reset on close

**Performance:**
- Debounced search to limit API calls
- Lazy loading for large result sets
- Auto-focus with setTimeout to ensure DOM ready`,
    implementationDetails: `**Files Created:**
- client/src/components/search/global-search-modal.tsx (270 lines)

**Component Features:**
1. Dialog wrapper with custom positioning (top 15%)
2. Search input header with shortcut hint
3. Results section with scroll
4. Empty state with keyboard shortcut guide
5. Loading state with spinner
6. Error state with retry message
7. Keyboard navigation with visual highlights

**Integration Points:**
- useGlobalSearch: API data fetching
- useDebouncedSearch: Input debouncing
- SearchResultCard: Result display
- wouter: Client-side navigation`,
    requirement: 'US-SEARCH-006',
    createdAt: new Date('2025-12-24'),
    updatedAt: new Date('2025-12-24'),
  },
  {
    id: 'US-SEARCH-IMPL-002',
    epicId: EPIC_ID,
    title: '[IMPL] Integrate Global Search into AppLayout',
    description: `**Technical Implementation Story**

Integrate the GlobalSearchModal into AppLayout to make it accessible from all pages.

**Parent Story:** US-SEARCH-006 (Keyboard Shortcuts)
**Fixes:** DEF-SEARCH-001 (CMD+K not working)
**Depends On:** US-SEARCH-IMPL-001

**Technical Requirements:**
- Modify \`client/src/components/layout/app-layout.tsx\`
- Register \`useSearchShortcut\` hook at layout level
- Manage modal open/close state
- Render GlobalSearchModal in layout
- Ensure it works with and without sidebar

**Acceptance Criteria:**
- Modal state managed at AppLayout level
- Keyboard shortcut registered globally
- Modal renders in both sidebar modes
- Works across all pages/routes
- No console errors or warnings`,
    acceptanceCriteria: `Feature: Global Search in AppLayout
  As a developer
  I want search integrated at layout level
  So that it works across all pages

  Scenario: Keyboard shortcut triggers modal
    Given I am on any page in ARKHITEKTON
    When I press "Cmd+K" (or "Ctrl+K")
    Then the useSearchShortcut hook should fire
    And setSearchOpen(true) should be called
    And the GlobalSearchModal should appear

  Scenario: Modal works without sidebar
    Given the page has showSidebar=false
    When the layout renders
    Then the GlobalSearchModal should still be present
    And the keyboard shortcut should still work

  Scenario: Modal state persists across navigation
    Given the modal is open on Dashboard
    When I navigate to Quality Center
    Then the modal should remain open
    And the search query should persist
    And the shortcut handler should not remount`,
    storyPoints: 2,
    priority: 'high',
    status: 'done',
    assignee: 'Development Team',
    labels: ['implementation', 'search', 'layout', 'react', 'hooks'],
    technicalNotes: `**Integration Pattern:**
\`\`\`typescript
const [searchOpen, setSearchOpen] = useState(false);

useSearchShortcut({
  onOpen: () => setSearchOpen(true),
  onClose: () => setSearchOpen(false),
  enabled: true,
});

return (
  <>
    {/* ... layout content ... */}
    <GlobalSearchModal open={searchOpen} onOpenChange={setSearchOpen} />
  </>
);
\`\`\`

**Hook Lifecycle:**
- useSearchShortcut registers window event listener
- Listener persists as long as AppLayout is mounted
- Works across all child routes
- No unmounting/remounting on navigation`,
    implementationDetails: `**Files Modified:**
- client/src/components/layout/app-layout.tsx (+8 lines)

**Changes Made:**
1. Added useState for searchOpen state
2. Imported GlobalSearchModal and useSearchShortcut
3. Registered keyboard shortcut in layout
4. Rendered modal in both sidebar modes
5. Passed state handlers to modal

**Testing:**
- Verified modal opens from Dashboard
- Verified modal opens from Quality Center
- Verified modal opens from all pages
- Verified no duplicate shortcuts
- Verified no memory leaks`,
    requirement: 'US-SEARCH-006',
    createdAt: new Date('2025-12-24'),
    updatedAt: new Date('2025-12-24'),
  },
];

async function seedImplementationStories() {
  console.log('\n📝 Seeding Global Search Implementation Stories\n');

  try {
    // Verify epic exists
    const epicExists = await db
      .select()
      .from(epics)
      .where(eq(epics.id, EPIC_ID))
      .limit(1);

    if (epicExists.length === 0) {
      console.error(`❌ Epic ${EPIC_ID} not found. Please seed global search stories first.`);
      process.exit(1);
    }

    // Verify parent story exists
    const parentStory = await db
      .select()
      .from(userStories)
      .where(eq(userStories.id, 'US-SEARCH-006'))
      .limit(1);

    if (parentStory.length === 0) {
      console.error('❌ US-SEARCH-006 not found. Please seed global search stories first.');
      process.exit(1);
    }

    let created = 0;
    let skipped = 0;

    for (const story of implementationStories) {
      const existing = await db
        .select()
        .from(userStories)
        .where(eq(userStories.id, story.id))
        .limit(1);

      if (existing.length === 0) {
        await db.insert(userStories).values(story as any);
        console.log(`✅ ${story.id}: ${story.title}`);
        console.log(`   Points: ${story.storyPoints} | Status: ${story.status}`);
        created++;
      } else {
        console.log(`⚠️  ${story.id} already exists`);
        skipped++;
      }
    }

    console.log('\n📊 Summary:');
    console.log(`   Created: ${created}`);
    console.log(`   Skipped: ${skipped}`);
    console.log(`   Total: ${implementationStories.length}`);
    console.log(`   Epic: ${EPIC_ID}`);
    console.log(`   Parent: US-SEARCH-006`);
    console.log(`   Fixes: DEF-SEARCH-001`);
    console.log(`\n🔍 View stories at: /plan`);
  } catch (error) {
    console.error('❌ Error seeding stories:', error);
    throw error;
  }
}

seedImplementationStories()
  .then(() => {
    console.log('\n✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });

