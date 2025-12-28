/**
 * Mark US-QC-015 and US-QC-IMPL-015 as complete
 * Automatically uses the latest commit SHA from git log
 * 
 * Usage: npx tsx scripts/complete-defect-id-column-latest.ts
 * 
 * Prerequisites:
 * - DATABASE_URL must be set (either in .env file or environment variable)
 * - Git repository must have commits
 */

import 'dotenv/config';
import { db } from '../server/db';
import { userStories, codeChanges } from '../shared/schema';
import { eq } from 'drizzle-orm';
import { execSync } from 'child_process';

async function completeStories() {
  // Check for DATABASE_URL
  if (!process.env.DATABASE_URL) {
    console.error('\n❌ DATABASE_URL is not set!\n');
    console.log('📝 To fix this, create a .env file in the project root with:\n');
    console.log('   DATABASE_URL=your_postgresql_connection_string\n');
    console.log('   Example: DATABASE_URL=postgresql://user:password@localhost:5432/arkhitekton\n');
    console.log('🔍 Or set it as an environment variable:\n');
    console.log('   export DATABASE_URL="postgresql://user:password@localhost:5432/arkhitekton"\n');
    process.exit(1);
  }

  console.log('✅ Completing Defect ID Column user stories...\n');

  // Get the latest commit SHA automatically
  let commitSha: string;
  try {
    commitSha = execSync('git log -1 --format="%H"', { encoding: 'utf-8' }).trim();
    console.log(`📝 Using latest commit: ${commitSha.substring(0, 8)}...\n`);
  } catch (error) {
    console.error('❌ Failed to get git commit SHA');
    console.error('Please ensure you are in a git repository with commits.');
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
    console.error('\nIf this is a database connection error, verify:');
    console.error('  1. DATABASE_URL is set correctly');
    console.error('  2. Database is running and accessible');
    console.error('  3. Database credentials are correct\n');
    process.exit(1);
  });
