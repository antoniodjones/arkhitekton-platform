import { db } from '../server/db';
import { defects, codeChanges } from '../shared/schema';

/**
 * Create defects for getByIds authorization bypass and remaining org_id inconsistencies
 */

async function createGetByIdsAndOrgIdDefects() {
  console.log('🐛 Creating defects for getByIds and remaining org_id issues...\n');

  const defectsToCreate = [
    {
      id: 'DEF-REF-011',
      title: 'CRITICAL: getByIds query has no authorization - exposes all documents',
      description: `**Location**: CodeOptions/nextjs-google-docs-master/convex/documents.ts:6-23

**Severity**: CRITICAL - Authorization Bypass / Data Exposure

**Issue**: The \`getByIds\` query has **NO authentication or authorization checks**. Any authenticated user can call it with arbitrary document IDs and retrieve information about ANY document in the system, including:
- Other users' private documents
- Organization documents they don't belong to
- Deleted documents (shows "[Removed]")

**Original Code (VULNERABLE)**:
\`\`\`typescript
export const getByIds = query({
  args: { ids: v.array(v.id("documents")) },
  handler: async (ctx, { ids }) => {
    const documents = [];

    for (const id of ids) {
      const document = await ctx.db.get(id);

      if (document) {
        documents.push({ id: document._id, name: document.title });
        // ❌ NO AUTHORIZATION CHECK!
      } else {
        documents.push({ id, name: "[Removed]" })
      }
    }

    return documents;
  },
});
\`\`\`

**Attack Vector**:
1. Attacker authenticates to the application
2. Attacker enumerates or guesses document IDs (UUIDs can be brute-forced or leaked)
3. Attacker calls \`getByIds\` with array of target document IDs
4. Query returns \`{ id, name }\` for ALL documents, regardless of ownership or org membership
5. Attacker now has document IDs and titles for documents they don't own

**Exposed Data**:
- Document IDs (\`document._id\`)
- Document titles (\`document.title\`)
- Document existence (vs "[Removed]")

**Where Called From**:
- \`src/app/documents/[documentId]/actions.ts\` (or similar)
- Used to fetch multiple documents at once
- Direct exposure to client-side code

**Impact**:
- **Confidentiality Breach**: Document titles may contain sensitive information
- **Privacy Violation**: Users can see other users' document titles
- **Enumeration Attack**: Attackers can map the document database
- **OWASP Category**: A01:2021 – Broken Access Control

**Fixed Code**:
\`\`\`typescript
export const getByIds = query({
  args: { ids: v.array(v.id("documents")) },
  handler: async (ctx, { ids }) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new ConvexError("Unauthorized");
    }

    const documents = [];

    for (const id of ids) {
      const document = await ctx.db.get(id);

      if (document) {
        // ✅ Check authorization for each document
        const isOwner = document.ownerId === user.subject;
        const isOrganizationMember = 
          !!(document.organizationId && document.organizationId === user.org_id);

        if (isOwner || isOrganizationMember) {
          documents.push({ id: document._id, name: document.title });
        } else {
          // User not authorized to see this document
          documents.push({ id, name: "[Removed]" });
        }
      } else {
        documents.push({ id, name: "[Removed]" })
      }
    }

    return documents;
  },
});
\`\`\`

**Security Principles Violated**:
- **Fail Secure**: Should deny by default, not expose
- **Zero Trust**: Should verify authorization for every request
- **Least Privilege**: Users should only access documents they own or share`,
      severity: 'critical',
      priority: 'critical',
      status: 'resolved',
      stepsToReproduce: `1. User A creates a private document (gets document ID: doc_abc123)
2. User B (different user, no shared org) authenticates
3. User B calls getByIds query with ids: ["doc_abc123"]
4. Query returns: [{ id: "doc_abc123", name: "User A's Private Document" }]
5. User B now has access to User A's document title without authorization
6. User B can enumerate many document IDs to map the database`,
      expectedBehavior: 'getByIds should authenticate the user, then check authorization for EACH document in the array. Only documents the user owns or has org access to should return real data. Unauthorized documents should return "[Removed]" or be filtered out entirely.',
      actualBehavior: 'getByIds returns document IDs and titles for ALL requested documents without any authorization checks. Any authenticated user can query any document ID and retrieve its title, regardless of ownership or organization membership.',
      environment: 'Reference Code (Next.js Google Docs)',
      affectedStoryId: 'US-REF-001',
      resolvedAt: new Date(),
    },
    {
      id: 'DEF-REF-012',
      title: 'CRITICAL: Remaining org_id field inconsistencies break document operations',
      description: `**Location**: 
- CodeOptions/nextjs-google-docs-master/convex/documents.ts:56 (get query)
- CodeOptions/nextjs-google-docs-master/convex/documents.ts:107 (removeById)
- CodeOptions/nextjs-google-docs-master/convex/documents.ts:138 (updateById)

**Severity**: CRITICAL - Authorization Failure / Broken Functionality

**Issue**: Previous fix (DEF-REF-010) only updated \`create\` and \`getById\` to use \`user.org_id\`, but THREE other functions still used \`user.organization_id\`. This creates a critical mismatch:

| Function | Line | Field Used | Status |
|----------|------|------------|--------|
| \`create\` | 34 | \`user.org_id\` | ✅ Fixed (DEF-REF-010) |
| \`get\` | 56 | \`user.organization_id\` | ❌ BROKEN |
| \`removeById\` | 107 | \`user.organization_id\` | ❌ BROKEN |
| \`updateById\` | 138 | \`user.organization_id\` | ❌ BROKEN |
| \`getById\` | 145 | \`user.org_id\` | ✅ Fixed (DEF-REF-010) |
| \`getByIds\` | 6 | (no org check) | ❌ BROKEN (DEF-REF-011) |

**Critical Flow Breakdown**:

1. **Document Creation** (\`create\` mutation):
   \`\`\`typescript
   const organizationId = user.org_id;  // ✅ Stores "org_2abc123"
   await ctx.db.insert("documents", { organizationId });
   \`\`\`

2. **Document Deletion** (\`removeById\` mutation):
   \`\`\`typescript
   const organizationId = user.organization_id;  // ❌ undefined or wrong value
   const isOrganizationMember = 
     document.organizationId === organizationId;  // "org_2abc123" === undefined → FALSE
   // Authorization check FAILS!
   \`\`\`

3. **Document Update** (\`updateById\` mutation):
   \`\`\`typescript
   const organizationId = user.organization_id;  // ❌ undefined or wrong value
   const isOrganizationMember = 
     document.organizationId === organizationId;  // "org_2abc123" === undefined → FALSE
   // Authorization check FAILS!
   \`\`\`

4. **Document List** (\`get\` query):
   \`\`\`typescript
   const organizationId = user.organization_id;  // ❌ undefined or wrong value
   // Queries for documents with organizationId === undefined
   // Returns EMPTY array (no org documents found)
   \`\`\`

**Impact Scenarios**:

### Scenario 1: Organization Members Locked Out
1. User creates document in organization (stored with \`org_id\`)
2. Organization member tries to delete document
3. \`removeById\` checks \`organization_id\` (undefined)
4. Authorization fails → "Unauthorized" error
5. Legitimate org member CANNOT delete shared document

### Scenario 2: Empty Document Lists
1. User navigates to organization documents
2. \`get\` query searches for \`organizationId === undefined\`
3. NO documents returned (all stored with real org ID)
4. User sees empty list despite having org documents

### Scenario 3: Unable to Rename Org Documents
1. User tries to rename organization document
2. \`updateById\` checks \`organization_id\` (undefined)
3. Authorization fails → "Unauthorized" error
4. Document title cannot be changed

**Root Cause**:
Incomplete fix in DEF-REF-010. Only \`create\` and \`getById\` were updated to use \`user.org_id\`, leaving three other critical functions with the wrong field name.

**Clerk JWT Structure** (reminder):
\`\`\`json
{
  "sub": "user_2abc123xyz",
  "org_id": "org_2def456abc",  // ✅ This is the correct field
  // "organization_id" does NOT exist ❌
}
\`\`\`

**Fixed Code**:
All functions now use \`user.org_id\`:

\`\`\`typescript
// ✅ ALL FIXED - Consistent org_id usage
const organizationId = (user.org_id ?? undefined) as string | undefined;
\`\`\`

**Why This is Critical**:
- Core CRUD operations broken for organization documents
- Creates deny-of-service for legitimate org members
- Breaks fundamental collaboration features
- Data isolation failure (org docs behave like personal docs)`,
      severity: 'critical',
      priority: 'critical',
      status: 'resolved',
      stepsToReproduce: `1. User A creates document while in organization "org_2abc123"
2. Document stored with organizationId = "org_2abc123" (from user.org_id)
3. User B (same organization) tries to delete document
4. removeById reads user.organization_id (undefined or wrong field)
5. Authorization check: "org_2abc123" === undefined → FALSE
6. User B receives "Unauthorized" error despite being in same org
7. Similarly, updateById fails and get query returns empty list`,
      expectedBehavior: 'All Convex functions should consistently use user.org_id to read the organization ID from the Clerk JWT. Documents created in organizations should be accessible to all organization members for viewing, editing, and deleting.',
      actualBehavior: 'Three functions (get, removeById, updateById) use user.organization_id (wrong/nonexistent field), causing authorization checks to fail. Organization members are denied access to shared documents, and organization document lists appear empty.',
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
    sha: 'c14fe8a',
    message: 'fix: CRITICAL - Add authorization to getByIds and fix remaining org_id inconsistencies',
    url: 'https://github.com/antoniodjones/arkhitekton-platform/commit/c14fe8a',
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

  console.log('\n✅ getByIds and org_id defects created and linked!\n');

  // Summary
  console.log('📊 Summary:\n');
  console.log('  User Story: US-REF-001 (Reference Code: Document Management)');
  console.log('  Defects Created: 2');
  console.log('  - DEF-REF-011: getByIds no authorization (Severity: CRITICAL 🔴)');
  console.log('  - DEF-REF-012: Remaining org_id inconsistencies (Severity: CRITICAL 🔴)');
  console.log('  Fix Commit: c14fe8a');
  console.log('  Status: All resolved');
  console.log('\n  🚨 CRITICAL SECURITY & FUNCTIONALITY BUGS 🚨');
  console.log('  DEF-REF-011:');
  console.log('  - Issue: getByIds had NO authorization checks');
  console.log('  - Impact: ANY user could query ANY document titles');
  console.log('  - Attack: Enumeration, data exposure, privacy breach');
  console.log('  - Fix: Added per-document authorization in loop');
  console.log('\n  DEF-REF-012:');
  console.log('  - Issue: get, removeById, updateById still used organization_id');
  console.log('  - Impact: Org members LOCKED OUT of shared documents');
  console.log('  - Broken: Delete, rename, and list operations');
  console.log('  - Fix: Changed all to user.org_id for consistency');
  console.log('\n  Total Reference Code Defects: 12 (DEF-REF-001 through DEF-REF-012)\n');
}

createGetByIdsAndOrgIdDefects()
  .then(() => {
    console.log('🎉 Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error creating defects:', error);
    process.exit(1);
  });

