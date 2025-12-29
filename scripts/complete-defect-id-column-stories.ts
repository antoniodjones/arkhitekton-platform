/**
 * Mark US-QC-015 and US-QC-IMPL-015 as complete
 * Link commit to stories for traceability
 */

import { db } from '../server/db';
import { userStories, codeChanges } from '../shared/schema';
import { eq } from 'drizzle-orm';

async function completeStories() {
  console.log('✅ Completing Defect ID Column user stories...\n');

  // Get the latest commit SHA (user will need to provide this after pushing)
  const commitSha = process.argv[2];
  
  if (!commitSha) {
    console.error('❌ Please provide commit SHA as argument');
    console.error('Usage: npx tsx scripts/complete-defect-id-column-stories.ts <commit-sha>');
    process.exit(1);
  }

  // Update product story status
  await db
    .update(userStories)
    .set({
      status: 'done',
      updatedAt: new Date(),
    })
    .where(eq(userStories.id, 'US-QC-015'));

  console.log('✅ Updated US-QC-015 status to "done"');

  // Update implementation story status
  await db
    .update(userStories)
    .set({
      status: 'done',
      updatedAt: new Date(),
    })
    .where(eq(userStories.id, 'US-QC-IMPL-015'));

  console.log('✅ Updated US-QC-IMPL-015 status to "done"');

  // Link commit to implementation story
  await db.insert(codeChanges).values({
    entityType: 'user_story',
    entityId: 'US-QC-IMPL-015',
    changeType: 'commit',
    repository: 'arkhitekton-platform',
    commitSha: commitSha,
    commitMessage: `feat(US-QC-015): Add Defect ID column to defects list

- Add DEFECT column as first column in table
- Display defect ID with monospace font
- Make defect ID clickable link to detail page
- Apply blue link styling with hover underline
- Fixed column width (140px) for consistency
- Update colspan from 6 to 7 for loading/empty states
- Implements US-QC-015 and US-QC-IMPL-015`,
    commitUrl: `https://github.com/antoniodjones/arkhitekton-platform/commit/${commitSha}`,
    authorUsername: 'antoniodjones',
    authorEmail: 'dev@arkhitekton.com',
    eventTimestamp: new Date(),
  });

  console.log(`✅ Linked commit ${commitSha.substring(0, 8)} to US-QC-IMPL-015`);

  console.log('\n📊 Summary:');
  console.log('   ✓ US-QC-015: Display Defect ID in Defects List → Done');
  console.log('   ✓ US-QC-IMPL-015: Add Defect ID Column → Done');
  console.log(`   ✓ Commit ${commitSha.substring(0, 8)} linked for traceability`);
  console.log('\n✨ Implementation complete!\n');
}

completeStories()
  .then(() => {
    console.log('🎉 Stories updated successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error updating stories:', error);
    process.exit(1);
  });

