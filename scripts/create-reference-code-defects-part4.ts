import { db } from '../server/db';
import { defects, codeChanges } from '../shared/schema';

/**
 * Create defects for reference code bugs (Auth ID mismatch + Operator precedence)
 */

async function createAuthAndOperatorDefects() {
  console.log('🐛 Creating defects for auth ID mismatch and operator precedence...\n');

  const defectsToCreate = [
    {
      id: 'DEF-REF-008',
      title: 'CRITICAL: Owner authorization always fails due to ID mismatch',
      description: `**Location**: 
- CodeOptions/nextjs-google-docs-master/src/app/api/liveblocks-auth/route.ts:30
- CodeOptions/nextjs-google-docs-master/convex/documents.ts:40

**Severity**: CRITICAL - Authentication Bypass / Authorization Failure

**Issue**: The backend stores the owner ID as \`user.subject\` (from Convex authentication), but the Liveblocks auth route compares it against \`user.id\` (from Clerk's \`currentUser()\`). These are different ID values with different formats, causing the owner authorization check to **ALWAYS fail**.

**ID Mismatch**:
- **Convex Auth** (\`documents.ts:40\`): Stores \`ownerId: user.subject\`
  - Format: JWT subject claim (e.g., \`"user_2abc123xyz"\`)
- **Clerk API** (\`route.ts:30\`): Compares \`document.ownerId === user.id\`
  - Format: Clerk user ID (e.g., \`"user_2def456abc"\`)
- **Result**: \`user.subject !== user.id\` → owner check always returns \`false\`

**Impact**: 
- **Broken Access Control**: Document owners cannot access their own documents via Liveblocks
- **Users locked out**: Every user attempting to edit a document they own will receive "Unauthorized" (401)
- **Collaboration broken**: Liveblocks real-time collaboration is inaccessible for document owners
- **Only workaround**: Users must be in the same organization as themselves (which doesn't work for personal docs)

**Attack Surface**: 
- This is NOT a security vulnerability (doesn't expose data)
- It's an authorization logic error that **denies** access rather than granting it

**Code Comparison**:

\`\`\`typescript
// documents.ts:40 - STORES user.subject
return await ctx.db.insert("documents", {
  title: args.title ?? "Untitled document",
  ownerId: user.subject, // ← Convex JWT subject
  organizationId,
  initialContent: args.initialContent,
});

// route.ts:30 - COMPARES against user.id (WRONG!)
const isOwner = document.ownerId === user.id; // ← Clerk user ID
// These IDs have different formats and will NEVER match
\`\`\`

**Correct Fix**:
\`\`\`typescript
// route.ts:30 - Use sessionClaims.sub (matches user.subject)
const isOwner = document.ownerId === sessionClaims.sub; // ✅ Matches Convex
\`\`\`

**Why \`sessionClaims.sub\` is correct**:
- \`sessionClaims\` comes from \`auth()\` at line 13
- \`sessionClaims.sub\` is the JWT subject claim
- Convex's \`user.subject\` is derived from the same JWT token
- Therefore: \`sessionClaims.sub === user.subject\` (in Convex context)

**Related Code**:
- ✅ Line 32 correctly uses \`sessionClaims.org_id\` for organization check
- ❌ Line 30 incorrectly uses \`user.id\` instead of \`sessionClaims.sub\``,
      severity: 'critical',
      priority: 'critical',
      status: 'resolved',
      stepsToReproduce: `1. User creates a document (becomes owner)
2. Document is stored with ownerId = user.subject (Convex JWT)
3. User attempts to access document via Liveblocks
4. Liveblocks auth route calls POST /api/liveblocks-auth
5. Route compares document.ownerId (user.subject) === user.id (Clerk ID)
6. Comparison fails because these are different ID formats
7. User receives "Unauthorized" (401) error
8. User cannot access their own document for real-time editing`,
      expectedBehavior: 'Document owners should be able to access their own documents through Liveblocks. The authorization check should correctly identify the user as the owner by comparing sessionClaims.sub (JWT subject) with document.ownerId (also JWT subject from Convex).',
      actualBehavior: 'Document owners are denied access due to ID mismatch. The route compares Clerk user.id against Convex user.subject, which are different ID formats that never match. Users are locked out of their own documents.',
      environment: 'Reference Code (Next.js Google Docs)',
      affectedStoryId: 'US-REF-001',
      resolvedAt: new Date(),
    },
    {
      id: 'DEF-REF-009',
      title: 'Incorrect heading button styling due to operator precedence',
      description: `**Location**: CodeOptions/nextjs-google-docs-master/src/app/documents/[documentId]/toolbar.tsx:501

**Issue**: The conditional expression for heading button styling mixes \`||\` and \`&&\` operators without parentheses, causing incorrect evaluation due to operator precedence.

**Operator Precedence Problem**:
JavaScript evaluates \`&&\` (logical AND) with higher precedence than \`||\` (logical OR), so:

\`\`\`typescript
// WRITTEN CODE (line 501):
(value === 0 && !editor?.isActive("heading")) || 
editor?.isActive("heading", { level: value }) && "bg-neutral-200/80"

// ACTUAL EVALUATION (due to precedence):
(value === 0 && !editor?.isActive("heading")) || 
(editor?.isActive("heading", { level: value }) && "bg-neutral-200/80")
\`\`\`

**Return Value Types**:
1. **Left side**: \`(value === 0 && !editor?.isActive("heading"))\` → returns \`boolean\`
2. **Right side**: \`(editor?.isActive("heading", { level: value }) && "bg-neutral-200/80")\` → returns \`boolean\` OR \`string\`
3. **Combined with \`||\`**: Can return \`true\`, \`false\`, OR \`"bg-neutral-200/80"\`

**Impact**:
- The \`cn()\` function (from \`clsx\` + \`twMerge\`) expects consistent boolean values for conditional classes
- When the expression returns a **string** instead of a **boolean**, the class is applied unconditionally
- When the expression returns \`true\` (boolean), the class is NOT applied (because \`cn()\` expects the string as the truthy value)
- Result: Heading level buttons show incorrect active states

**Scenarios**:

| Condition | Current Evaluation | Return Type | Expected |
|-----------|-------------------|-------------|----------|
| Normal text (value=0) | \`true \|\| false\` | \`true\` | Should return \`"bg-neutral-200/80"\` |
| Heading active (value=1) | \`false \|\| "bg-neutral-200/80"\` | \`string\` | Correct ✅ |
| Heading inactive (value=1) | \`false \|\| false\` | \`false\` | Correct ✅ |

**Problem**: When normal text is selected (value=0), the expression returns \`true\` (boolean) instead of the CSS class string, so \`cn()\` doesn't apply the background.

**Root Cause**: Missing parentheses to group the boolean condition before applying \`&&\` with the class string.

**Original Code (BROKEN)**:
\`\`\`typescript
className={cn(
  "flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-200/80",
  (value === 0 && !editor?.isActive("heading")) || 
  editor?.isActive("heading", { level: value }) && "bg-neutral-200/80"
)}
\`\`\`

**Fixed Code**:
\`\`\`typescript
className={cn(
  "flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-200/80",
  ((value === 0 && !editor?.isActive("heading")) || 
   editor?.isActive("heading", { level: value })) && "bg-neutral-200/80"
)}
\`\`\`

**Explanation of Fix**:
- Wrapped the entire boolean condition in parentheses
- Now evaluates as: \`(boolean_condition) && "bg-neutral-200/80"\`
- Always returns either \`false\` (no class) or \`"bg-neutral-200/80"\` (apply class)
- Consistent return type for \`cn()\``,
      severity: 'medium',
      priority: 'medium',
      status: 'resolved',
      stepsToReproduce: `1. Open a document in the editor
2. Select normal text (not a heading)
3. Open the heading dropdown menu
4. Observe the "Normal text" button
5. Expected: Button should have active background (bg-neutral-200/80)
6. Actual: Button does not have active background due to type mismatch
7. Alternatively: Click various heading levels and observe inconsistent active states`,
      expectedBehavior: 'Heading level buttons should show consistent active states with the correct background color (bg-neutral-200/80) when their corresponding level is active or when normal text is selected (value=0 and not a heading).',
      actualBehavior: 'Due to operator precedence, the expression returns inconsistent types (boolean vs string), causing the cn() function to apply styling incorrectly. Normal text button may not show active state.',
      environment: 'Reference Code (Next.js Google Docs)',
      affectedStoryId: 'US-REF-001',
      resolvedAt: new Date(),
    },
  ];

  // Create the defects
  for (const defect of defectsToCreate) {
    const existing = await db.select()
      .from(defects)
      .where(defects.id === defect.id)
      .limit(1);

    if (existing.length === 0) {
      await db.insert(defects).values(defect);
      console.log(`✅ Created defect: ${defect.id} - ${defect.title}`);
    } else {
      console.log(`ℹ️  Defect already exists: ${defect.id}`);
    }
  }

  // Link to the fix commit
  console.log('\n🔗 Linking defects to fix commit...\n');

  const fixCommit = {
    sha: 'fb8dbd5',
    message: 'fix: Critical auth bug and operator precedence issue',
    url: 'https://github.com/antoniodjones/arkhitekton-platform/commit/fb8dbd5',
  };

  for (const defect of defectsToCreate) {
    const existing = await db.select()
      .from(codeChanges)
      .where(codeChanges.entityId === defect.id)
      .where(codeChanges.commitSha === fixCommit.sha)
      .limit(1);

    if (existing.length === 0) {
      await db.insert(codeChanges).values({
        entityType: 'defect',
        entityId: defect.id,
        changeType: 'commit',
        repository: 'arkhitekton-platform',
        commitSha: fixCommit.sha,
        commitMessage: fixCommit.message,
        commitUrl: fixCommit.url,
        authorUsername: 'antoniodjones',
        eventTimestamp: new Date(),
      });
      console.log(`  🔗 Linked ${fixCommit.sha} → ${defect.id}`);
    } else {
      console.log(`  ℹ️  ${fixCommit.sha} → ${defect.id} (already linked)`);
    }
  }

  console.log('\n✅ Auth and operator defects created and linked!\n');

  // Summary
  console.log('📊 Summary:\n');
  console.log('  User Story: US-REF-001 (Reference Code: Document Management)');
  console.log('  Defects Created: 2');
  console.log('  - DEF-REF-008: Owner auth always fails - ID mismatch (Severity: CRITICAL 🔴)');
  console.log('  - DEF-REF-009: Heading button styling - operator precedence (Severity: Medium)');
  console.log('  Fix Commit: fb8dbd5');
  console.log('  Status: All resolved');
  console.log('\n  🚨 CRITICAL AUTH BUG 🚨');
  console.log('  - Issue: Convex stores user.subject, route compares user.id');
  console.log('  - Impact: Document owners LOCKED OUT of their own documents');
  console.log('  - Affected: Liveblocks real-time collaboration');
  console.log('  - Fix: Use sessionClaims.sub to match Convex user.subject');
  console.log('\n  Total Reference Code Defects: 9 (DEF-REF-001 through DEF-REF-009)\n');
}

createAuthAndOperatorDefects()
  .then(() => {
    console.log('🎉 Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error creating defects:', error);
    process.exit(1);
  });

