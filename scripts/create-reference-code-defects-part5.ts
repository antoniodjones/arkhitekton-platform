import { db } from '../server/db';
import { defects, codeChanges } from '../shared/schema';

/**
 * Create defect for organization ID field name inconsistency
 */

async function createOrgIdFieldDefect() {
  console.log('🐛 Creating defect for organization ID field name inconsistency...\n');

  const defectsToCreate = [
    {
      id: 'DEF-REF-010',
      title: 'CRITICAL: Organization ID field name mismatch causes authorization failures',
      description: `**Location**: 
- CodeOptions/nextjs-google-docs-master/convex/documents.ts:34 (create mutation)
- CodeOptions/nextjs-google-docs-master/convex/documents.ts:177 (getById query)

**Severity**: CRITICAL - Authorization Vulnerability / Inconsistency

**Issue**: The Convex backend uses **different JWT claim names** for organization ID than the Liveblocks auth endpoint, causing authorization checks to use mismatched field values.

**Field Name Inconsistency**:

| Context | Field Name | Location |
|---------|-----------|----------|
| **Convex Create** | \`user.organization_id\` | documents.ts:34 |
| **Convex GetById** | \`user.organization_id\` | documents.ts:177 |
| **Liveblocks Auth** | \`sessionClaims.org_id\` | liveblocks-auth/route.ts:32 |

**Root Cause**: 
Clerk's JWT token uses the claim name \`org_id\` (without the "organization_" prefix). Both Convex and the Liveblocks route read from the same Clerk-issued JWT, but:
- **Convex** incorrectly reads \`user.organization_id\` (which may be undefined or a different field)
- **Liveblocks** correctly reads \`sessionClaims.org_id\` (the actual Clerk claim)

**Impact Scenarios**:

### Scenario 1: Document Creation
\`\`\`typescript
// documents.ts:34 - Create mutation
const organizationId = user.organization_id;  // ❌ Reads wrong field
// May store undefined or incorrect org ID
await ctx.db.insert("documents", {
  organizationId,  // Stored value may be wrong
});
\`\`\`

### Scenario 2: Authorization in Convex
\`\`\`typescript
// documents.ts:177 - GetById query
const isOrganizationMember = 
  document.organizationId === user.organization_id;  // ❌ Comparing wrong field
// May deny access to legitimate org members
\`\`\`

### Scenario 3: Authorization in Liveblocks
\`\`\`typescript
// liveblocks-auth/route.ts:32
const isOrganizationMember = 
  document.organizationId === sessionClaims.org_id;  // ✅ Correct field
// But document.organizationId may have been stored with wrong value
\`\`\`

**Authorization Failures**:

1. **Denial of Service**: 
   - If \`user.organization_id\` is undefined or wrong in Convex
   - Documents stored with incorrect/missing org ID
   - Legitimate org members denied access in both Convex and Liveblocks

2. **Authorization Bypass** (less likely):
   - If \`user.organization_id\` happens to match a different value
   - Users could gain access to documents in orgs they don't belong to

3. **Inconsistent State**:
   - Document created in one org (or with undefined org)
   - Authorization checks fail or succeed unpredictably
   - Different behavior between Convex queries and Liveblocks access

**JWT Token Structure** (Clerk):
\`\`\`json
{
  "sub": "user_2abc123xyz",        // ✅ Used correctly as user.subject
  "org_id": "org_2def456abc",      // ✅ Should use this
  // "organization_id" does NOT exist in Clerk JWT ❌
}
\`\`\`

**Original Code (BROKEN)**:
\`\`\`typescript
// documents.ts:34 - Create
const organizationId = (user.organization_id ?? undefined) as string | undefined;
// ❌ Reads non-existent or wrong field

// documents.ts:177 - GetById
const isOrganizationMember = 
  !!(document.organizationId && document.organizationId === user.organization_id);
// ❌ Compares against wrong field

// liveblocks-auth/route.ts:32 - Liveblocks
const isOrganizationMember = 
  !!(document.organizationId && document.organizationId === sessionClaims.org_id);
// ✅ Correct, but document.organizationId may be wrong
\`\`\`

**Fixed Code**:
\`\`\`typescript
// documents.ts:34 - Create
const organizationId = (user.org_id ?? undefined) as string | undefined;
// ✅ Now reads correct Clerk claim

// documents.ts:177 - GetById
const isOrganizationMember = 
  !!(document.organizationId && document.organizationId === user.org_id);
// ✅ Now matches Clerk claim

// liveblocks-auth/route.ts:32 - Liveblocks (unchanged)
const isOrganizationMember = 
  !!(document.organizationId && document.organizationId === sessionClaims.org_id);
// ✅ Already correct, now consistent with Convex
\`\`\`

**Why This Matters**:
- Both Convex and Liveblocks read from the **same Clerk-issued JWT**
- The JWT claim is \`org_id\`, NOT \`organization_id\`
- All authorization layers MUST use the same claim name
- Field name consistency is critical for zero-trust security

**Related Defects**:
- **DEF-REF-008**: Fixed owner ID mismatch (\`user.id\` → \`sessionClaims.sub\`)
- **DEF-REF-010** (this): Fixed org ID mismatch (\`user.organization_id\` → \`user.org_id\`)

**Testing Impact**:
- Existing documents may have incorrect/undefined \`organizationId\`
- May require data migration to fix stored values
- Test cases needed for org-level authorization`,
      severity: 'critical',
      priority: 'critical',
      status: 'resolved',
      stepsToReproduce: `1. User belongs to an organization (e.g., "org_2def456abc")
2. User creates a document while in that organization
3. Document is stored with organizationId = user.organization_id (may be undefined or wrong)
4. User attempts to access document via Convex getById query
5. Authorization check: document.organizationId === user.organization_id (both potentially wrong)
6. User attempts to access document via Liveblocks
7. Authorization check: document.organizationId === sessionClaims.org_id (document value may be wrong)
8. Authorization may fail unpredictably or allow unintended access`,
      expectedBehavior: 'All authorization layers (Convex create, Convex getById, Liveblocks auth) should use the same JWT claim name (org_id) to ensure consistent organization membership checks. Documents should be stored with the correct organization ID from the JWT, and all authorization checks should verify against the same field.',
      actualBehavior: 'Convex uses user.organization_id (wrong/nonexistent field), while Liveblocks uses sessionClaims.org_id (correct Clerk field). This causes authorization inconsistencies, potential denial of service for legitimate org members, or authorization bypass vulnerabilities.',
      environment: 'Reference Code (Next.js Google Docs)',
      affectedStoryId: 'US-REF-001',
      resolvedAt: new Date(),
    },
  ];

  // Create the defect
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
  console.log('\n🔗 Linking defect to fix commit...\n');

  const fixCommit = {
    sha: '7c25029',
    message: 'fix: CRITICAL - Fix organization ID field name inconsistency',
    url: 'https://github.com/antoniodjones/arkhitekton-platform/commit/7c25029',
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

  console.log('\n✅ Organization ID field defect created and linked!\n');

  // Summary
  console.log('📊 Summary:\n');
  console.log('  User Story: US-REF-001 (Reference Code: Document Management)');
  console.log('  Defect Created: DEF-REF-010');
  console.log('  - Organization ID field name mismatch (Severity: CRITICAL 🔴)');
  console.log('  Fix Commit: 7c25029');
  console.log('  Status: Resolved');
  console.log('\n  🚨 CRITICAL AUTHORIZATION BUG 🚨');
  console.log('  - Issue: Convex used user.organization_id, should be user.org_id');
  console.log('  - Impact: Authorization inconsistency across Convex and Liveblocks');
  console.log('  - Risk: Org members denied access OR potential authorization bypass');
  console.log('  - Fix: Changed to user.org_id to match Clerk JWT claim');
  console.log('\n  Total Reference Code Defects: 10 (DEF-REF-001 through DEF-REF-010)\n');
}

createOrgIdFieldDefect()
  .then(() => {
    console.log('🎉 Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error creating defect:', error);
    process.exit(1);
  });

