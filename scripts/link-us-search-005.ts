import { db } from "../server/db";
import { codeChanges, userStories } from "../shared/schema";
import { eq } from "drizzle-orm";

/**
 * Link commit 28354a9 to US-SEARCH-005: Quick Navigation
 * 
 * This script records the code change that fixed the navigation defect
 * where search results were not navigating to proper entity detail pages.
 */

async function linkCommitToStory() {
  const commitSha = "28354a972030ea562c6593ac3422a1851ea69248";
  const storyId = "US-SEARCH-005";
  
  console.log(`\n🔗 Linking commit ${commitSha.substring(0, 8)} to ${storyId}...`);
  
  // Verify story exists
  const story = await db.select().from(userStories).where(eq(userStories.id, storyId)).limit(1);
  
  if (story.length === 0) {
    console.error(`❌ Story ${storyId} not found in database`);
    process.exit(1);
  }
  
  console.log(`✅ Found story: ${story[0].title}`);
  
  // Check if commit already linked
  const existing = await db.select()
    .from(codeChanges)
    .where(eq(codeChanges.commitSha, commitSha))
    .limit(1);
  
  if (existing.length > 0) {
    console.log(`⚠️  Commit already linked to ${existing[0].entityType} ${existing[0].entityId}`);
    return;
  }
  
  // Insert code change record
  await db.insert(codeChanges).values({
    entityType: 'user_story',
    entityId: storyId,
    changeType: 'commit',
    repository: 'arkhitekton-platform',
    commitSha: commitSha,
    commitMessage: 'fix(US-SEARCH-005): implement RESTful navigation for user stories\n\n- Add /plan/stories/:id route for deep linking\n- Update search API to use /plan/stories/:id instead of /plan?storyId=\n- Fix defect navigation to use /quality/defects/:id\n- Follows US-SEARCH-005 acceptance criteria\n- Enables proper bookmarking and back button behavior',
    commitUrl: `https://github.com/arkhitekton/platform/commit/${commitSha}`,
    authorUsername: 'system',
    authorEmail: 'dev@arkhitekton.com',
    eventTimestamp: new Date(),
  });
  
  console.log(`✅ Linked commit to ${storyId}`);
  console.log(`\n📊 Summary:`);
  console.log(`   Story: US-SEARCH-005 - Quick Navigation`);
  console.log(`   Commit: ${commitSha.substring(0, 8)}`);
  console.log(`   Files changed: 3`);
  console.log(`     - client/src/pages/plan/story-detail-page.tsx (new)`);
  console.log(`     - client/src/App.tsx`);
  console.log(`     - server/routes.ts`);
  console.log(`\n✨ Traceability established!`);
}

linkCommitToStory()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });

