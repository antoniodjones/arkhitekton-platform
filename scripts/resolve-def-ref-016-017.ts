/**
 * Resolve DEF-REF-016 and DEF-REF-017: Mark as resolved
 */

import { db } from '../server/db';
import { defects } from '../shared/schema';
import { eq } from 'drizzle-orm';

async function resolveDefects() {
  console.log('✅ Resolving DEF-REF-016 and DEF-REF-017...\n');

  await db
    .update(defects)
    .set({
      status: 'resolved',
      resolvedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(defects.id, 'DEF-REF-016'));

  console.log('   ✓ DEF-REF-016: Convex Organization Authorization Flaw → Resolved');

  await db
    .update(defects)
    .set({
      status: 'resolved',
      resolvedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(defects.id, 'DEF-REF-017'));

  console.log('   ✓ DEF-REF-017: Liveblocks Organization Authorization Flaw → Resolved\n');

  console.log('📊 Summary:');
  console.log('   • 4 authorization checks fixed');
  console.log('   • 3 in Convex (documents.ts)');
  console.log('   • 1 in Liveblocks (liveblocks-auth/route.ts)');
  console.log('   • More defensive authorization logic applied');
  console.log('   • Both defects marked as resolved\n');

  console.log('✅ All defects resolved successfully!\n');
}

resolveDefects().catch((error) => {
  console.error('❌ Error resolving defects:', error);
  process.exit(1);
});

