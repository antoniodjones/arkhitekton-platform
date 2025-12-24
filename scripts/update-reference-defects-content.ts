import { db } from '../server/db';
import { defects } from '../shared/schema';
import { eq } from 'drizzle-orm';

/**
 * Update all 14 reference defects with proper content
 * Mapping detailed info to actual schema fields
 */

async function updateDefectsContent() {
  console.log('🔄 Updating reference defect content...\n');

  const updates = [
    {
      id: 'DEF-REF-001',
      description: `**Location**: CodeOptions/nextjs-google-docs-master/src/app/(home)/templates-gallery.tsx

**Issue**: The createDocument mutation promise chain has .catch() before .then(), causing router.push() to execute with undefined.

**Steps to Reproduce**:
1. Click any template in gallery
2. If error occurs, promise catch returns undefined  
3. Subsequent .then() receives undefined
4. router.push(undefined) navigates to /documents/undefined

**Expected**: Navigate to /documents/{documentId} on success
**Actual**: Navigates to /documents/undefined when error caught`,
      rootCause: 'Promise chain has .catch() before .then(). When error is caught, .catch() returns undefined, which flows to .then(), causing router.push(undefined).',
      resolution: 'Reordered promise chain: moved .catch() after .then(). Errors now handled without breaking routing. Fixed in commit 096098d.',
    },
    {
      id: 'DEF-REF-002',
      description: `**Location**: CodeOptions/nextjs-google-docs-master/src/components/remove-dialog.tsx

**Issue**: The removeDocument mutation promise chain has .catch() before .then(), causing router.push() to execute with undefined.

**Steps to Reproduce**:
1. Delete a document
2. If error occurs, catch returns undefined
3. router.push(undefined) navigates to invalid path

**Expected**: Navigate to home page / on success
**Actual**: Navigates to /undefined when error caught`,
      rootCause: 'Identical issue to DEF-REF-001: incorrect promise chain ordering.',
      resolution: 'Reordered promise chain in remove-dialog.tsx. Fixed in commit 096098d.',
    },
    {
      id: 'DEF-REF-003',
      description: `**Location**: CodeOptions/nextjs-google-docs-master/src/app/documents/[documentId]/navbar.tsx

**Issue**: The createDocument mutation promise chain has .catch() before .then(), causing router.push() to execute with undefined.

**Steps to Reproduce**:
1. Click "New Document" button
2. If error occurs, catch returns undefined
3. router.push(undefined) navigates to /documents/undefined

**Expected**: Navigate to /documents/{documentId} on success
**Actual**: Navigates to /documents/undefined when error caught`,
      rootCause: 'Identical issue to DEF-REF-001: incorrect promise chain ordering.',
      resolution: 'Reordered promise chain in navbar.tsx. Fixed in commit 096098d.',
    },
    {
      id: 'DEF-REF-004',
      description: `**Location**: CodeOptions/nextjs-google-docs-master/src/app/globals.css

**Issue**: Invalid CSS syntax: (--radius - 2) should be calc(var(--radius) - 2px)

**Impact**: Border radius not applied correctly, dark mode styling inconsistent

**Expected**: CSS variables should use valid calc() syntax
**Actual**: Invalid syntax (--radius - 2) is ignored by browser`,
      rootCause: 'CSS variables cannot perform arithmetic operations directly. Must use calc() function and var() to reference CSS custom properties.',
      resolution: 'Changed border-radius: (--radius - 2) to border-radius: calc(var(--radius) - 2px). Fixed in commit bbfa773.',
    },
    {
      id: 'DEF-REF-005',
      description: `**Location**: CodeOptions/nextjs-google-docs-master/src/components/rename-dialog.tsx

**Issue**: After renaming document, toast displays "Document deleted" instead of "Document renamed"

**Steps to Reproduce**:
1. Rename a document
2. Success toast displays "Document deleted"
3. User confusion - did document get deleted or renamed?

**Expected**: Display "Document renamed" toast
**Actual**: Displays "Document deleted" toast`,
      rootCause: 'Copy-paste error: rename success handler uses delete toast message.',
      resolution: 'Changed toast message from "Document deleted" to "Document renamed". Fixed in commit bbfa773.',
    },
    {
      id: 'DEF-REF-006',
      description: `**Location**: CodeOptions/nextjs-google-docs-master/convex/documents.ts

**Issue**: Two typos in user-facing messages:
1. "Unathorized" (should be "Unauthorized")
2. "Untitled coument" (should be "Untitled document")

**Impact**: Unprofessional error messages and default document names`,
      rootCause: 'Typographical errors in string literals.',
      resolution: 'Fixed both typos. Changed "Unathorized" → "Unauthorized" and "Untitled coument" → "Untitled document". Fixed in commit 3df92d5.',
    },
    {
      id: 'DEF-REF-007',
      description: `**Location**: CodeOptions/nextjs-google-docs-master/convex/documents.ts (getById query)

**CRITICAL SECURITY ISSUE**: The getById query retrieves documents without verifying user ownership or organization membership.

**Attack Vector**:
1. User A creates private document (gets document ID)
2. User B (different user, no shared org) authenticates
3. User B calls getById with User A's document ID
4. Query returns FULL document without authorization check
5. User B accesses User A's private document

**Expected**: Verify user is document owner OR in same organization
**Actual**: Returns document to ANY authenticated user

**OWASP**: A01:2021 – Broken Access Control`,
      rootCause: 'Missing authorization logic. Query only checks if user is authenticated, not if they have permission to access the specific document.',
      resolution: 'Added authorization checks: verify user.subject === document.ownerId OR user.org_id === document.organizationId. Fixed in commit 3df92d5.',
    },
    {
      id: 'DEF-REF-008',
      description: `**Location**: CodeOptions/nextjs-google-docs-master/src/app/api/liveblocks-auth/route.ts

**CRITICAL AUTH BUG**: Convex stores ownerId as user.subject but Liveblocks auth compares with user.id

**Impact**: Document owners are LOCKED OUT of their own documents during real-time collaboration

**Flow**:
1. User creates document → Convex stores user.subject as ownerId
2. User opens document editor → Liveblocks checks user.id for authorization
3. Authorization fails: user.subject !== user.id
4. Legitimate owner denied access

**Expected**: Use consistent ID field (user.subject) across integrations
**Actual**: Convex uses user.subject, Liveblocks uses user.id`,
      rootCause: 'ID field mismatch between Convex and Clerk integrations. Clerk JWT has both user.id and user.sub (subject), but different parts of code use different fields.',
      resolution: 'Changed Liveblocks auth to use sessionClaims.sub instead of user.id to match Convex user.subject. Fixed in commit fb8dbd5.',
    },
    {
      id: 'DEF-REF-009',
      description: `**Location**: CodeOptions/nextjs-google-docs-master/src/app/documents/[documentId]/toolbar.tsx

**Issue**: Heading button styling uses ambiguous syntax: editor.isActive("heading", { level }) || level

**Impact**: Button active state calculated incorrectly due to operator precedence

**Expected**: editor.isActive("heading", { level: level })
**Actual**: editor.isActive("heading", { level }) || level`,
      rootCause: 'Object shorthand syntax { level } combined with || operator creates ambiguous precedence. Also missing explicit key-value pair.',
      resolution: 'Changed to explicit syntax: editor.isActive("heading", { level: level }). Fixed in commit fb8dbd5.',
    },
    {
      id: 'DEF-REF-010',
      description: `**Location**: CodeOptions/nextjs-google-docs-master/convex/documents.ts

**CRITICAL**: Convex create mutation uses user.org_id but getById uses user.organization_id

**Field Mismatch**:
- Document created: stored with user.org_id → "org_2abc123"
- Document accessed: checked with user.organization_id → undefined (field doesn't exist)
- Result: Authorization check fails OR bypassed

**Expected**: Consistently use user.org_id (matches Clerk JWT claim)
**Actual**: create uses org_id, getById uses organization_id`,
      rootCause: 'Clerk JWT claim is org_id, not organization_id. Inconsistent field names across codebase broke authorization.',
      resolution: 'Changed getById to use user.org_id. Later fixed remaining functions (get, removeById, updateById) in DEF-REF-012. Fixed in commits 7c25029 and c14fe8a.',
    },
    {
      id: 'DEF-REF-011',
      description: `**Location**: CodeOptions/nextjs-google-docs-master/convex/documents.ts (getByIds query)

**CRITICAL SECURITY**: getByIds query has ZERO authentication or authorization checks

**Attack Vector**:
1. User A creates private documents
2. User B authenticates to app
3. User B calls getByIds([docId1, docId2, docId3, ...])
4. Query returns ALL document IDs and titles without ANY checks
5. User B enumerates entire document database

**Data Exposed**: Document IDs, document titles, document existence

**Expected**: Authenticate user AND check authorization for EACH document
**Actual**: Returns all requested documents without authorization

**OWASP**: A01:2021 – Broken Access Control`,
      rootCause: 'No authentication or authorization logic. Function assumes all authenticated users can access any document.',
      resolution: 'Added user authentication check + per-document authorization loop. Checks ownership/org membership for each document. Returns "[Removed]" for unauthorized docs. Fixed in commit c14fe8a.',
    },
    {
      id: 'DEF-REF-012',
      description: `**Location**: CodeOptions/nextjs-google-docs-master/convex/documents.ts (get, removeById, updateById)

**CRITICAL**: DEF-REF-010 only fixed create and getById. Three functions still use organization_id instead of org_id

**Broken Functions**:
- get query (line 56): uses organization_id → empty document lists
- removeById mutation (line 107): uses organization_id → denies legitimate deletes
- updateById mutation (line 138): uses organization_id → denies legitimate renames

**Impact**: Organization members LOCKED OUT of shared documents

**Flow**:
1. Create doc in org → stored with org_id ✅
2. Try to delete doc → removeById checks organization_id ❌
3. Field mismatch → authorization fails
4. Legitimate org member denied access

**Expected**: ALL functions use user.org_id
**Actual**: Only 2 of 5 functions fixed in DEF-REF-010`,
      rootCause: 'Incomplete fix from DEF-REF-010. Only patched create and getById, missed get/removeById/updateById.',
      resolution: 'Changed all three remaining functions to use user.org_id. Now ALL functions consistently use correct Clerk JWT claim. Fixed in commit c14fe8a.',
    },
    {
      id: 'DEF-REF-013',
      description: `**Location**: CodeOptions/nextjs-google-docs-master/convex/documents.ts

**Code Quality Issue**: removeById and updateById create intermediate organizationId variable, while getById and getByIds compare directly

**Inconsistent Patterns**:
- removeById/updateById: const organizationId = (user.org_id ?? undefined); then compare
- getById/getByIds: document.organizationId === user.org_id

**Impact**: 
- Violates DRY principle
- Makes code review harder (why different?)
- Redundant logic (org_id ?? undefined doesn't change undefined)
- Creates maintenance burden

**Expected**: All functions use identical authorization pattern
**Actual**: Two different patterns for same logic`,
      rootCause: 'Pattern inconsistency, likely from copy-paste or different developers. The nullish coalescing (?? undefined) is redundant.',
      resolution: 'Removed intermediate variable from removeById and updateById. All functions now use direct comparison to user.org_id. Fixed in commit 42f9160.',
    },
    {
      id: 'DEF-REF-014',
      description: `**Location**: CodeOptions/nextjs-google-docs-master/src/app/documents/[documentId]/actions.ts (getUsers function)

**CRITICAL**: Unsafe type cast: sessionClaims?.org_id as string

**Issue**: When user not in organization, org_id is undefined. Type assertion bypasses TypeScript safety and passes [undefined] to Clerk API.

**Flow**:
1. Personal user (no org) opens document
2. Share dialog calls getUsers()
3. getUserList({ organizationId: [sessionClaims?.org_id as string] })
4. org_id is undefined → becomes [undefined]
5. Clerk API receives invalid parameter

**Result**: API failure, empty user list, or privacy leak (returns wrong users)

**Expected**: Conditional API call - with organizationId if user in org, without filter if personal
**Actual**: Unsafely casts undefined to string, passes [undefined] to API

**Type Safety Violation**: 'as string' bypasses TypeScript protection`,
      rootCause: 'Type assertion (as string) bypasses compile-time safety. Developer assumed org_id always exists, but personal users have undefined.',
      resolution: 'Added conditional logic: if (orgId) call with organizationId filter, else call without filter. Removed unsafe type cast. Fixed in commit 42f9160.',
    },
  ];

  let updated = 0;
  for (const update of updates) {
    try {
      await db.update(defects)
        .set({
          description: update.description,
          rootCause: update.rootCause,
          resolution: update.resolution,
        })
        .where(eq(defects.id, update.id));
      
      console.log(`✅ Updated: ${update.id}`);
      updated++;
    } catch (error) {
      console.error(`❌ Failed: ${update.id}`, error);
    }
  }

  console.log(`\n✅ Updated ${updated} defects with full content!`);
}

updateDefectsContent()
  .then(() => {
    console.log('\n🎉 Done! Refresh Quality Center to see content.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error:', error);
    process.exit(1);
  });

