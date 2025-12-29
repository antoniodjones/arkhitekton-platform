import { db } from '../server/db';
import { defects } from '../shared/schema';
import { eq } from 'drizzle-orm';

async function updateDefectCommit() {
  console.log('📝 Updating DEF-REF-015 with git commit...\n');

  const defectId = 'DEF-REF-015';
  const commitSha = '50c8864';

  await db.update(defects).set({
    resolution: `Added \`callbackRef = useRef(callback)\` to store the callback reference, and updated \`callbackRef.current = callback\` on every render. Changed the \`useCallback\` dependency array from \`[callback, delay]\` to \`[delay]\` only. The setTimeout now calls \`callbackRef.current(...args)\` instead of \`callback(...args)\`.

This ensures:
1. The debounced function remains stable across renders
2. The latest callback is always invoked when the timeout fires
3. Inline callbacks work correctly without breaking debounce

Fixed in commit ${commitSha}.`,
    githubCommits: [
      {
        sha: commitSha,
        message: 'fix: Fix useDebounce hook dependency array breaking debounce mechanism',
        author: 'Platform Team',
        timestamp: new Date('2025-12-24T12:00:00Z').toISOString(),
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

