import { db } from "../server/db";
import { defects, userStories } from "../shared/schema";
import { eq } from "drizzle-orm";

/**
 * Create defects for Global Search issues
 * 
 * DEF-SEARCH-001: CMD+K keyboard shortcut not working
 * DEF-SEARCH-002: CMD+Click navigation goes to wrong page
 */

async function createSearchDefects() {
  console.log(`\n🐛 Creating Global Search defects...\n`);
  
  // Verify related user stories exist
  const story005 = await db.select().from(userStories).where(eq(userStories.id, "US-SEARCH-005")).limit(1);
  const story006 = await db.select().from(userStories).where(eq(userStories.id, "US-SEARCH-006")).limit(1);
  
  if (story005.length === 0) {
    console.error(`❌ US-SEARCH-005 not found`);
    process.exit(1);
  }
  
  if (story006.length === 0) {
    console.error(`❌ US-SEARCH-006 not found`);
    process.exit(1);
  }
  
  // Defect 1: CMD+K not working
  const defect1 = {
    id: "DEF-SEARCH-001",
    title: "CMD+K keyboard shortcut does not open search",
    description: `**Environment**: Production
    
**Steps to Reproduce**:
1. Navigate to any page in the application
2. Press CMD+K (Mac) or CTRL+K (Windows/Linux)

**Expected Behavior**:
- Global search input should appear
- Search input should be auto-focused
- User can immediately start typing

**Actual Behavior**:
- Nothing happens
- No search modal or input appears
- No visual feedback

**Related User Story**: US-SEARCH-006 (Keyboard Shortcuts)

**Acceptance Criteria Not Met**:
\`\`\`gherkin
Scenario: Open search with Cmd+K (Mac)
  Given I am on any page in ARKHITEKTON
  When I press "Cmd+K"
  Then the search modal should open  ❌ FAILING
  And the search input should be focused  ❌ FAILING
\`\`\`

**Possible Root Cause**:
- Keyboard shortcut handler not registered globally (only on Dashboard?)
- Event listener not attached to window/document
- Shortcut conflicting with browser default (Cmd+K opens browser search bar)
- Need to call \`event.preventDefault()\` to override browser behavior

**Severity**: High
**Priority**: High
**Impact**: Users cannot access global search from anywhere in the app`,
    severity: "high" as const,
    type: "bug" as const,
    status: "open" as const,
    userStoryId: "US-SEARCH-006",
    discoveredBy: "User Testing",
    assignedTo: null,
  };
  
  // Defect 2: CMD+Click navigation incorrect
  const defect2 = {
    id: "DEF-SEARCH-002",
    title: "CMD+Click on search result navigates to wrong page",
    description: `**Environment**: Production
    
**Steps to Reproduce**:
1. From the Dashboard/home page, search for a user story (e.g., "US-WIKI-RTF-002")
2. Hold CMD (Mac) or CTRL (Windows) and click on a search result
3. Observe the new window/tab that opens

**Expected Behavior**:
- New tab should open
- Should navigate to the specific story detail page (e.g., \`/plan/stories/US-WIKI-RTF-002\`)
- Story detail sheet should be visible
- Search dropdown on original tab should remain open

**Actual Behavior**:
- New tab opens
- Navigates to \`/plan/dashboard\` instead of the story detail page
- Story detail is not visible
- Incorrect route is used

**Related User Story**: US-SEARCH-005 (Quick Navigation)

**Acceptance Criteria Not Met**:
\`\`\`gherkin
Scenario: Open result in new tab
  Given I searched for "US-WIKI-RTF-002"
  And I see the result
  When I Cmd+Click the result (Mac)
  Then the page should open in a new tab  ✅ WORKING
  And I should navigate to "/plan/stories/US-WIKI-RTF-002"  ❌ FAILING (goes to /plan/dashboard)
\`\`\`

**Possible Root Cause**:
- The \`<Link>\` component's \`href\` prop is not being respected for CMD+Click
- \`handleClick\` function in SearchResultCard might be interfering
- The \`window.location.href = result.url\` in onClick handler might override default Link behavior
- Need to ensure Link's default behavior works for CMD/CTRL+Click

**Related Files**:
- \`client/src/components/search/search-result-card.tsx\` (lines 17-26)
- \`server/routes.ts\` (line 3772) - URL generation for user stories

**Severity**: Medium
**Priority**: High
**Impact**: Users cannot open search results in new tabs for multitasking`,
    severity: "medium" as const,
    type: "bug" as const,
    status: "open" as const,
    userStoryId: "US-SEARCH-005",
    discoveredBy: "User Testing",
    assignedTo: null,
  };
  
  // Insert defects
  try {
    // Check if defects already exist
    const existing1 = await db.select().from(defects).where(eq(defects.id, "DEF-SEARCH-001")).limit(1);
    const existing2 = await db.select().from(defects).where(eq(defects.id, "DEF-SEARCH-002")).limit(1);
    
    if (existing1.length === 0) {
      await db.insert(defects).values(defect1);
      console.log(`✅ Created DEF-SEARCH-001: CMD+K keyboard shortcut not working`);
      console.log(`   → Linked to: US-SEARCH-006 (Keyboard Shortcuts)`);
      console.log(`   → Severity: High | Priority: High | Status: Open\n`);
    } else {
      console.log(`⚠️  DEF-SEARCH-001 already exists\n`);
    }
    
    if (existing2.length === 0) {
      await db.insert(defects).values(defect2);
      console.log(`✅ Created DEF-SEARCH-002: CMD+Click navigation goes to wrong page`);
      console.log(`   → Linked to: US-SEARCH-005 (Quick Navigation)`);
      console.log(`   → Severity: Medium | Priority: High | Status: Open\n`);
    } else {
      console.log(`⚠️  DEF-SEARCH-002 already exists\n`);
    }
    
    console.log(`\n📊 Summary:`);
    console.log(`   Total Defects Created: 2`);
    console.log(`   Status: Open`);
    console.log(`   Module: Global Search & Discovery`);
    console.log(`   Epic: EPIC-SEARCH-001`);
    console.log(`\n🔍 View defects at: /quality/defects`);
    
  } catch (error) {
    console.error(`❌ Error creating defects:`, error);
    throw error;
  }
}

createSearchDefects()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Failed:", error);
    process.exit(1);
  });

