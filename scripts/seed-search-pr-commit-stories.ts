/**
 * Seed user stories for Global Search: PR/Commit Integration
 * US-SEARCH-007, US-SEARCH-IMPL-003, US-SEARCH-IMPL-004
 */

import { db } from '../server/db';
import { userStories, epics } from '../shared/schema';
import { eq } from 'drizzle-orm';

const EPIC_ID = 'EPIC-SEARCH-001';

const stories = [
  {
    id: 'US-SEARCH-007',
    epicId: EPIC_ID,
    title: 'Search Pull Requests and Commits',
    description: `As a developer, I want to search for Pull Requests and Commits by SHA, PR number, message, branch name, or author, so that I can quickly find code changes related to my work.`,
    acceptanceCriteria: `Feature: Search Pull Requests and Commits
  As a developer
  I want to search for code changes
  So that I can find PRs and commits quickly

  Scenario: Search by commit SHA (partial)
    Given I am on any page in ARKHITEKTON
    When I press "Cmd+K" to open global search
    And I type "3f4e05f" in the search input
    Then I should see results containing commit "3f4e05f"
    And the result should show the primary linked item (defect or story)
    And the commit SHA should be visible in the metadata section

  Scenario: Search by commit SHA (full)
    Given I am on any page in ARKHITEKTON
    When I press "Cmd+K" to open global search
    And I type the full commit SHA
    Then I should see the exact commit result
    And it should be ranked highest in relevance

  Scenario: Search by PR number with hash
    Given I am on any page in ARKHITEKTON
    When I press "Cmd+K" to open global search
    And I type "#123"
    Then I should see results for PR number 123
    And the result should show the PR title
    And linked items should be visible

  Scenario: Search by PR number without hash
    Given I am on any page in ARKHITEKTON
    When I press "Cmd+K" to open global search
    And I type "123"
    Then I should see results for PR number 123
    And the result should match the same as "#123"

  Scenario: Search by commit message
    Given I am on any page in ARKHITEKTON
    When I press "Cmd+K" to open global search
    And I type "fix import path"
    Then I should see commits with matching messages
    And results should be ranked by relevance
    And commit messages should be visible in descriptions

  Scenario: Search by PR title
    Given I am on any page in ARKHITEKTON
    When I press "Cmd+K" to open global search
    And I type "global search modal"
    Then I should see PRs with matching titles
    And PR titles should be prominently displayed

  Scenario: Search by branch name
    Given I am on any page in ARKHITEKTON
    When I press "Cmd+K" to open global search
    And I type "feature/US-SEARCH"
    Then I should see commits from that branch
    And branch name should be visible in metadata

  Scenario: Search by author username
    Given I am on any page in ARKHITEKTON
    When I press "Cmd+K" to open global search
    And I type "antoniodjones"
    Then I should see commits by that author
    And author name should be visible

  Scenario: Search by author with @ symbol
    Given I am on any page in ARKHITEKTON
    When I press "Cmd+K" to open global search
    And I type "@antoniodjones"
    Then I should see commits by that author
    And results should match the same as without @

  Scenario: Context-aware display (Option 1c)
    Given a commit is linked to multiple items
    When I search for that commit
    Then I should see the most relevant item (defect > story > epic)
    And the commit SHA should appear in "Fixed in:" section
    And I should see "+ X other stories" indicator
    And hovering should show all linked items

  Scenario: Navigate to primary item
    Given I see a search result with code change metadata
    When I click on the result
    Then I should navigate to the primary linked item
    And not to a dedicated code change page`,
    storyPoints: 8,
    priority: 'high',
    status: 'done',
    assignee: 'Development Team',
    labels: ['search', 'github', 'commits', 'prs', 'feature'],
    technicalNotes: `**Search Fields:**
1. commitSha (partial or full match)
2. prNumber (with or without # prefix)
3. commitMessage (text search)
4. prTitle (text search)
5. branchName (partial match)
6. authorUsername (with or without @ prefix)

**Priority Logic:**
- Defects > User Stories > Epics
- Show primary item with code change as metadata
- Display linked items count

**UX Pattern:**
- Option 1c: Smart Context-Aware (Recommended)
- Primary item displayed with commit in metadata
- Hover/click for more linked items`,
    implementationDetails: `**Backend Changes:**
- server/storage.ts: getAllCodeChanges(), getCodeChangeById()
- server/routes.ts: Code change search logic in /api/entities/search

**Frontend Changes:**
- client/src/hooks/use-global-search.ts: Add code_change entity type
- client/src/components/search/search-result-card.tsx: Code change metadata display

**Search Algorithm:**
- Filter code changes by 6 search fields
- Fetch linked entities for each match
- Determine primary entity by priority
- Enrich results with code change metadata`,
    requirement: 'EPIC-SEARCH-001',
    createdAt: new Date('2025-12-24'),
    updatedAt: new Date('2025-12-24'),
  },
  {
    id: 'US-SEARCH-IMPL-003',
    epicId: EPIC_ID,
    title: '[IMPL] Add Code Changes to Global Search API',
    description: `**Technical Implementation Story**

Implement backend search logic for code changes (commits/PRs) across all 6 searchable fields.

**Parent Story:** US-SEARCH-007 (Search Pull Requests and Commits)

**Technical Requirements:**
- Add getAllCodeChanges() to server/storage.ts
- Add getCodeChangeById() to server/storage.ts
- Add getCodeChangesByEntity() to server/storage.ts
- Implement code change search in /api/entities/search
- Search across: commitSha, prNumber, commitMessage, prTitle, branchName, authorUsername
- Handle PR number formats: "#123" and "123"
- Fetch linked entities to determine primary item
- Enrich results with code change metadata

**Acceptance Criteria:**
- Storage methods return code changes from database
- API searches all 6 fields correctly
- PR number search works with and without #
- Author search works with and without @
- Primary entity determined by priority (defect > story > epic)
- Results include code change metadata
- No performance degradation on large datasets`,
    acceptanceCriteria: `Feature: Code Change Search API
  As a backend developer
  I want code change search implemented
  So that frontend can search commits and PRs

  Scenario: Storage methods work correctly
    Given the database has code changes
    When getAllCodeChanges() is called
    Then all code changes should be returned
    And they should be ordered by eventTimestamp descending

  Scenario: Search by commit SHA
    Given a code change with SHA "3f4e05f"
    When I search for "3f4e05f"
    Then the API should return that code change
    And the primary linked entity should be included

  Scenario: Search by PR number with hash
    Given a code change with PR number 123
    When I search for "#123"
    Then the API should return that PR
    And the hash should be stripped before matching

  Scenario: Primary entity priority
    Given a commit linked to a defect and a story
    When the search returns that commit
    Then the defect should be the primary entity
    And the story should be in linkedItemsCount`,
    storyPoints: 5,
    priority: 'high',
    status: 'done',
    assignee: 'Backend Team',
    labels: ['implementation', 'backend', 'api', 'search', 'database'],
    technicalNotes: `**Files Modified:**
- server/storage.ts (+35 lines)
  - getAllCodeChanges()
  - getCodeChangeById()
  - getCodeChangesByEntity()

- server/routes.ts (+90 lines)
  - Code change search logic
  - Primary entity determination
  - Result enrichment

**Database Queries:**
- SELECT from codeChanges table
- JOIN with defects/userStories/epics for primary entity
- Filter by 6 search fields with OR conditions

**Performance:**
- Index on commitSha, prNumber, branchName
- Limit results to prevent large dataset issues
- Async/await for parallel entity fetching`,
    implementationDetails: `**Implementation Steps:**
1. Add storage methods to PostgresStorage class
2. Import CodeChange type from schema
3. Add code change search block after element search
4. Implement 6-field search logic with toLowerCase()
5. Strip # and @ prefixes where appropriate
6. Fetch linked entities with Promise.all
7. Determine primary entity by type priority
8. Enrich results with code change metadata
9. Test with real commit data (3f4e05f)`,
    requirement: 'US-SEARCH-007',
    createdAt: new Date('2025-12-24'),
    updatedAt: new Date('2025-12-24'),
  },
  {
    id: 'US-SEARCH-IMPL-004',
    epicId: EPIC_ID,
    title: '[IMPL] Create PR/Commit Search Result UI (Option 1c)',
    description: `**Technical Implementation Story**

Implement Option 1c (Smart Context-Aware) UI pattern for displaying code changes in search results.

**Parent Story:** US-SEARCH-007 (Search Pull Requests and Commits)
**Depends On:** US-SEARCH-IMPL-003

**Technical Requirements:**
- Update SearchResult interface to include code_change entity type
- Add code change metadata fields to SearchResult.metadata
- Update SearchResultCard to display code change metadata
- Implement "Fixed in:" section with commit SHA
- Show "+ X other stories" indicator
- Add GitBranch and Zap icons from lucide-react
- Style commit SHA with monospace font and cyan color
- Ensure responsive design

**Acceptance Criteria:**
- SearchResult interface includes code_change type
- Metadata includes: commitSha, prNumber, branchName, authorUsername, linkedItemsCount
- SearchResultCard renders code change metadata when present
- Commit SHA displayed in monospace with cyan color
- Linked items count shown when > 1
- No layout shift or visual bugs
- Works in light and dark modes`,
    acceptanceCriteria: `Feature: Code Change Search Result UI
  As a frontend developer
  I want code change UI implemented
  So that users see commit metadata in search

  Scenario: Display commit metadata
    Given a search result with commitSha metadata
    When the result is rendered
    Then I should see a "Fixed in:" section
    And the commit SHA should be in monospace font
    And the SHA should be cyan colored
    And a GitBranch icon should be visible

  Scenario: Display linked items count
    Given a commit linked to 4 items
    When the result is rendered
    Then I should see "+ 3 other stories"
    And a Zap icon should be visible

  Scenario: No metadata section for non-commits
    Given a search result without commitSha
    When the result is rendered
    Then no code change metadata section should appear
    And the card should render normally`,
    storyPoints: 3,
    priority: 'high',
    status: 'done',
    assignee: 'Frontend Team',
    labels: ['implementation', 'frontend', 'ui', 'react', 'search'],
    technicalNotes: `**Files Modified:**
- client/src/hooks/use-global-search.ts
  - Updated SearchResult interface
  - Added code_change to entityType union
  - Added metadata type definition

- client/src/components/search/search-result-card.tsx
  - Imported GitBranch, Zap icons
  - Added code change metadata section
  - Conditional rendering based on commitSha presence

**Styling:**
- Border-top separator for metadata section
- Purple GitBranch icon
- Cyan commit SHA in code tag
- Muted background for linked items badge
- Responsive flex layout

**Icons:**
- GitBranch (lucide-react) for commit indicator
- Zap (lucide-react) for linked items indicator`,
    implementationDetails: `**Implementation Steps:**
1. Update SearchResult interface with code_change type
2. Add metadata type definition with code change fields
3. Import GitBranch and Zap from lucide-react
4. Add conditional metadata section after badges
5. Style commit SHA with monospace and cyan
6. Calculate linked items count (linkedItemsCount - 1)
7. Show Zap icon with "+ X other stories" text
8. Test with real data (3f4e05f commit)
9. Verify responsive design
10. Test light and dark modes`,
    requirement: 'US-SEARCH-007',
    createdAt: new Date('2025-12-24'),
    updatedAt: new Date('2025-12-24'),
  },
];

async function seedSearchPRCommitStories() {
  console.log('\n🔍 Seeding Global Search: PR/Commit Integration Stories\n');

  try {
    // Verify epic exists
    const epicExists = await db
      .select()
      .from(epics)
      .where(eq(epics.id, EPIC_ID))
      .limit(1);

    if (epicExists.length === 0) {
      console.error(`❌ Epic ${EPIC_ID} not found. Please seed global search epic first.`);
      process.exit(1);
    }

    let created = 0;
    let skipped = 0;

    for (const story of stories) {
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
    console.log(`   Total: ${stories.length}`);
    console.log(`   Epic: ${EPIC_ID}`);
    console.log(`   Total Story Points: 16 (8 + 5 + 3)`);
    console.log(`\n🔍 View stories at: /plan`);
  } catch (error) {
    console.error('❌ Error seeding stories:', error);
    throw error;
  }
}

seedSearchPRCommitStories()
  .then(() => {
    console.log('\n✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });

