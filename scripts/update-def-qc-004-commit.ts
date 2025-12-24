import { db } from '../server/db';
import { defects } from '../shared/schema';
import { eq } from 'drizzle-orm';

async function updateDefectCommit() {
  console.log('📝 Updating DEF-QC-004 with git commit...\n');

  const defectId = 'DEF-QC-004';
  const commitSha = 'c314f55';

  await db.update(defects).set({
    resolution: `Changed the SelectItem value from empty string to "none":
\`\`\`tsx
// Before:
<SelectItem value="">None</SelectItem>

// After:  
<SelectItem value="none">None</SelectItem>
\`\`\`

This allows the Select component to function correctly while still providing a "None" option for users. The value "none" can be treated as a special case in business logic if needed (e.g., filtering, saving to database).

No additional changes were needed because no code was explicitly checking for empty string module values.

Fixed in commit ${commitSha}.`,
    githubCommits: [
      {
        sha: commitSha,
        message: 'fix: CRITICAL - Fix Test Plan page crash from empty string Select value',
        author: 'Platform Team',
        timestamp: new Date('2025-12-24T12:30:00Z').toISOString(),
      }
    ],
  }).where(eq(defects.id, defectId));

  console.log(`✅ Updated ${defectId} with commit ${commitSha}`);
}

updateDefectCommit()
  .then(() => {
    console.log('\n🎉 Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error:', error);
    process.exit(1);
  });

