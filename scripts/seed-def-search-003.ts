/**
 * Create DEF-SEARCH-003: No Search Results for Commit SHAs
 * Seed test data for PR/Commit search validation
 */

import { db } from '../server/db';
import { defects, codeChanges } from '../shared/schema';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';

async function seedDefectAndTestData() {
  console.log('🐛 Creating DEF-SEARCH-003: No Search Results for Commit SHAs\n');

  const defect = {
    id: 'DEF-SEARCH-003',
    title: 'Global Search Returns No Results for Commit SHAs',
    description: `When searching for commit SHAs (e.g., "3f4e05f" or "b2c6af7") in the global search, no results are returned even though the code change search logic is implemented correctly. The issue is that there is no test data in the codeChanges table to validate the search functionality.`,
    severity: 'medium' as const,
    status: 'open' as const,
    priority: 'high' as const,
    userStoryId: 'US-SEARCH-008',
    stepsToReproduce: `1. Open global search (CMD+K or CTRL+K)
2. Search for commit SHA: "3f4e05f"
3. Observe: "No results for '3f4e05f'"
4. Search for commit SHA: "b2c6af7"
5. Observe: "No results for 'b2c6af7'"`,
    expectedBehavior: `Search should return code change results showing:
- Primary linked entity (defect/story/epic)
- Commit SHA in metadata
- "+ X other stories" indicator if multiple items linked
- Clickable tooltip with all linked items`,
    actualBehavior: `Search returns "No results" message with suggestion to "Try different keywords or browse modules"`,
    rootCause: `The codeChanges table is empty. No test data exists to validate the PR/Commit search functionality that was implemented in US-SEARCH-007 and US-SEARCH-008.`,
    resolution: `Seed test data using scripts/seed-test-code-changes.ts to create code change records for commits 3f4e05f and b2c6af7 linked to relevant user stories and defects.`,
  };

  try {
    // Check if defect already exists
    const existing = await db
      .select()
      .from(defects)
      .where(eq(defects.id, defect.id))
      .limit(1);

    if (existing.length > 0) {
      console.log(`⚠️  Defect ${defect.id} already exists. Updating...\n`);
      
      await db
        .update(defects)
        .set({
          title: defect.title,
          description: defect.description,
          severity: defect.severity,
          status: defect.status,
          priority: defect.priority,
          userStoryId: defect.userStoryId,
          stepsToReproduce: defect.stepsToReproduce,
          expectedBehavior: defect.expectedBehavior,
          actualBehavior: defect.actualBehavior,
          rootCause: defect.rootCause,
          resolution: defect.resolution,
          updatedAt: new Date(),
        })
        .where(eq(defects.id, defect.id));
    } else {
      console.log(`✅ Creating defect: ${defect.id}\n`);
      
      await db.insert(defects).values({
        ...defect,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    console.log(`   🐛 ${defect.id}`);
    console.log(`   📋 ${defect.title}`);
    console.log(`   🔥 Severity: ${defect.severity}`);
    console.log(`   📊 Priority: ${defect.priority}`);
    console.log(`   🔗 User Story: ${defect.userStoryId}`);
    console.log(`   ✅ Status: ${defect.status}\n`);

    // Now seed test data for the two commits mentioned in the screenshots
    const testCommits = [
      {
        commitSha: '3f4e05f',
        prNumber: 123,
        branchName: 'feature/US-SEARCH-007-pr-commit-search',
        commitMessage: 'feat: US-SEARCH-007 - Add PR/Commit search to global search (Option 1c)',
        prTitle: 'Add PR/Commit search to global search',
        authorUsername: 'antoniodjones',
        entities: [
          { type: 'defect' as const, id: 'DEF-SEARCH-001' },
          { type: 'user_story' as const, id: 'US-SEARCH-006' },
          { type: 'user_story' as const, id: 'US-SEARCH-IMPL-001' },
          { type: 'user_story' as const, id: 'US-SEARCH-IMPL-002' },
        ],
      },
      {
        commitSha: 'b2c6af7',
        prNumber: 124,
        branchName: 'feature/US-SEARCH-006-keyboard-shortcuts',
        commitMessage: 'feat: US-SEARCH-006 - Implement keyboard shortcuts for global search',
        prTitle: 'Implement keyboard shortcuts (CMD+K/CTRL+K)',
        authorUsername: 'antoniodjones',
        entities: [
          { type: 'user_story' as const, id: 'US-SEARCH-006' },
          { type: 'defect' as const, id: 'DEF-SEARCH-001' },
        ],
      },
    ];

    console.log(`\n📝 Seeding test data for ${testCommits.length} commits...\n`);

    for (const commit of testCommits) {
      // Delete existing code changes for this commit to avoid duplicates
      await db
        .delete(codeChanges)
        .where(eq(codeChanges.commitSha, commit.commitSha));

      console.log(`   ✓ Commit: ${commit.commitSha}`);
      console.log(`     PR: #${commit.prNumber}`);
      console.log(`     Branch: ${commit.branchName}`);
      console.log(`     Linked to ${commit.entities.length} entities:`);

      for (const entity of commit.entities) {
        const id = randomUUID();
        
        await db.insert(codeChanges).values({
          id,
          entityType: entity.type,
          entityId: entity.id,
          changeType: 'pull_request',
          repository: 'antoniodjones/arkhitekton-platform',
          eventTimestamp: new Date(),
          commitSha: commit.commitSha,
          prNumber: commit.prNumber,
          branchName: commit.branchName,
          commitMessage: commit.commitMessage,
          prTitle: commit.prTitle,
          authorUsername: commit.authorUsername,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        console.log(`       - ${entity.type}: ${entity.id}`);
      }
      console.log('');
    }

    console.log(`\n✅ Successfully seeded defect and test data!`);
    console.log(`\n📝 Test Instructions:`);
    console.log(`   1. Open the app and press CMD+K (or CTRL+K)`);
    console.log(`   2. Search for: 3f4e05f`);
    console.log(`   3. You should see: DEF-SEARCH-001 (primary result)`);
    console.log(`   4. Look for "Fixed in: 3f4e05f" metadata`);
    console.log(`   5. Hover over "+ 3 other stories"`);
    console.log(`   6. Click on any linked item to open story detail sheet`);
    console.log(`   7. Search for: b2c6af7`);
    console.log(`   8. You should see: US-SEARCH-006 (primary result)`);
    console.log(`   9. Look for "Fixed in: b2c6af7" metadata`);
    console.log(`   10. Hover over "+ 1 other story"\n`);

  } catch (error) {
    console.error('❌ Error seeding defect and test data:', error);
    process.exit(1);
  }
}

seedDefectAndTestData();

