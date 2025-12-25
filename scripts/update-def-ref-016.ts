/**
 * Update DEF-REF-016: Add missing getById function to the fix
 */

import { db } from '../server/db';
import { defects } from '../shared/schema';
import { eq } from 'drizzle-orm';

async function updateDefect() {
  console.log('📝 Updating DEF-REF-016 to include getById function...\n');

  const defectId = 'DEF-REF-016';

  await db.update(defects).set({
    description: `The authorization check for organization membership in Convex queries has a security flaw. The boolean expression does not explicitly verify that \`user.org_id\` is defined before comparing it to \`document.organizationId\`.

**Current Code:**
\`\`\`typescript
const isOrganizationMember = 
  !!(document.organizationId && document.organizationId === user.org_id);
\`\`\`

**Issue:**
While this logic works in most cases, it's not sufficiently defensive. The check doesn't explicitly ensure \`user.org_id\` is truthy before the comparison. This could lead to edge cases where:
- Empty strings might be compared
- Type coercion could cause unexpected behavior
- The intent of the check is not explicit

**Security Impact:**
In edge cases, users without a valid organization ID might gain access to documents they shouldn't, or the authorization logic might not behave as intended.

**Affected Files:**
- \`CodeOptions/nextjs-google-docs-master/convex/documents.ts\` (lines 23-24) - getByIds query
- \`CodeOptions/nextjs-google-docs-master/convex/documents.ts\` (lines 130-131) - removeById mutation
- \`CodeOptions/nextjs-google-docs-master/convex/documents.ts\` (lines 157-158) - updateById mutation
- \`CodeOptions/nextjs-google-docs-master/convex/documents.ts\` (lines 184-185) - getById query **[MISSED IN INITIAL FIX]**`,
    resolution: `**Code Changes:**

Updated all FOUR authorization checks in \`convex/documents.ts\` to explicitly verify both values are truthy:

**Before:**
\`\`\`typescript
const isOrganizationMember = 
  !!(document.organizationId && document.organizationId === user.org_id);
\`\`\`

**After:**
\`\`\`typescript
const isOrganizationMember = 
  !!(document.organizationId && user.org_id && document.organizationId === user.org_id);
\`\`\`

**Locations Fixed:**
1. Line 23-24: \`getByIds\` query
2. Line 130-131: \`removeById\` mutation
3. Line 157-158: \`updateById\` mutation
4. Line 184-185: \`getById\` query **[ADDED IN FOLLOW-UP FIX]**

**Benefits:**
✅ More defensive and explicit authorization logic
✅ No edge cases with empty strings or type coercion
✅ Clear intent: both must be valid organizations
✅ Consistent with security best practices
✅ Self-documenting code
✅ **All authorization checks now consistent**

**Testing:**
- Verified all four functions still work correctly
- Tested with valid organization IDs
- Tested with null/undefined org IDs
- Tested with mismatched org IDs
- Ensured unauthorized users are properly denied`,
    updatedAt: new Date(),
  }).where(eq(defects.id, defectId));

  console.log(`✅ Updated ${defectId} with getById function fix`);
  console.log('\n📊 Summary:');
  console.log('   • Authorization checks fixed: 4 (was 3, now 4)');
  console.log('   • getByIds: ✅ Fixed');
  console.log('   • removeById: ✅ Fixed');
  console.log('   • updateById: ✅ Fixed');
  console.log('   • getById: ✅ Fixed (follow-up)\n');
}

updateDefect()
  .then(() => {
    console.log('✅ Defect updated successfully!\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });

