import { db } from '../server/db';
import { defects, codeChanges } from '../shared/schema';

/**
 * Create defects for reference code bugs (Typos + Critical Security Vulnerability)
 */

async function createSecurityAndTypoDefects() {
  console.log('🐛 Creating defects for reference code typos and security vulnerability...\n');

  const defectsToCreate = [
    {
      id: 'DEF-REF-006',
      title: 'Typos in error messages and default values',
      description: `**Location**: CodeOptions/nextjs-google-docs-master/convex/documents.ts:31, 39

**Issue**: Multiple typos in user-facing strings:
1. Line 31: \`"Unathorized"\` → should be \`"Unauthorized"\`
2. Line 39: \`"Untitled coument"\` → should be \`"Untitled document"\`

**Impact**: 
- Error messages contain spelling mistakes, appearing unprofessional to users
- Default document titles have typos, visible in document lists and UI
- Reduces user confidence in application quality

**Root Cause**: Simple spelling errors in string literals.

**Code Snippets**:
\`\`\`typescript
// Line 31 - Error message typo
if (!user) {
  throw new ConvexError("Unathorized"); // TYPO
}

// Line 39 - Default value typo
return await ctx.db.insert("documents", {
  title: args.title ?? "Untitled coument", // TYPO
  ownerId: user.subject,
  organizationId,
  initialContent: args.initialContent,
});
\`\`\``,
      severity: 'low',
      priority: 'low',
      status: 'resolved',
      stepsToReproduce: `1. Attempt to create a document without authentication
2. Observe error message: "Unathorized" (missing 'u')
3. Create a new document without providing a title
4. Observe default title: "Untitled coument" (typo)`,
      expectedBehavior: 'Error messages and default values should be spelled correctly: "Unauthorized" and "Untitled document".',
      actualBehavior: 'Typos appear in user-facing strings: "Unathorized" and "Untitled coument".',
      environment: 'Reference Code (Next.js Google Docs)',
      affectedStoryId: 'US-REF-001',
      resolvedAt: new Date(),
    },
    {
      id: 'DEF-REF-007',
      title: 'CRITICAL: Missing authorization check allows unauthorized document access',
      description: `**Location**: CodeOptions/nextjs-google-docs-master/convex/documents.ts:160-171

**Severity**: CRITICAL - Data Exposure Vulnerability

**Issue**: The \`getById\` query has NO authorization check. It only verifies:
- If the document exists
- ~~If the user is authenticated~~ ❌ NOT CHECKED
- ~~If the user owns the document~~ ❌ NOT CHECKED
- ~~If the user is in the document's organization~~ ❌ NOT CHECKED

**Attack Vector**: 
The \`/api/liveblocks-auth/route.ts\` endpoint calls \`getById\` at line 24, exposing this vulnerability:

\`\`\`typescript
// liveblocks-auth/route.ts:22-28
const { room } = await req.json();
const document = await convex.query(api.documents.getById, { id: room });
// ⚠️ getById returns document to ANY authenticated user
// Authorization check happens AFTER data is already exposed
\`\`\`

**Exploitation Steps**:
1. Attacker authenticates to the application
2. Attacker guesses or enumerates valid document IDs
3. Attacker calls Liveblocks auth endpoint with target document ID
4. \`getById\` returns full document metadata (ownerId, organizationId, title, initialContent, roomId)
5. Even though subsequent checks reject access, sensitive metadata is already exposed

**Data Exposed**:
- \`ownerId\`: User ID of document owner
- \`organizationId\`: Organization ID (if applicable)
- \`title\`: Document title
- \`initialContent\`: Document content
- \`roomId\`: Liveblocks room identifier

**Impact**: 
- **Confidentiality Breach**: Any authenticated user can retrieve metadata for ANY document
- **Privacy Violation**: User IDs, organization IDs, and document titles are exposed
- **Potential Data Leak**: Initial content may contain sensitive information
- **OWASP Category**: A01:2021 – Broken Access Control

**Root Cause**: Missing authentication and authorization checks in the \`getById\` query.

**Original Code (VULNERABLE)**:
\`\`\`typescript
export const getById = query({
  args: { id: v.id("documents") },
  handler: async (ctx, { id }) => {
    const document = await ctx.db.get(id);

    if (!document) {
      throw new ConvexError("Document not found");
    }

    return document; // ❌ NO AUTHORIZATION CHECK
  },
});
\`\`\`

**Fixed Code**:
\`\`\`typescript
export const getById = query({
  args: { id: v.id("documents") },
  handler: async (ctx, { id }) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new ConvexError("Unauthorized");
    }

    const document = await ctx.db.get(id);

    if (!document) {
      throw new ConvexError("Document not found");
    }

    const isOwner = document.ownerId === user.subject;
    const isOrganizationMember = 
      !!(document.organizationId && document.organizationId === user.organization_id);

    if (!isOwner && !isOrganizationMember) {
      throw new ConvexError("Unauthorized");
    }

    return document; // ✅ Only after authorization
  },
});
\`\`\`

**Related Files**:
- \`convex/documents.ts:160-171\` (vulnerable query)
- \`src/app/api/liveblocks-auth/route.ts:22-28\` (exposes vulnerability)`,
      severity: 'critical',
      priority: 'critical',
      status: 'resolved',
      stepsToReproduce: `1. User A creates a document (gets document ID)
2. User B (different user/org) authenticates to the application
3. User B calls POST /api/liveblocks-auth with {"room": "<User A's document ID>"}
4. getById query returns full document metadata to User B
5. User B now has access to sensitive metadata (ownerId, organizationId, title)
6. Even though Liveblocks access is denied, metadata is already exposed`,
      expectedBehavior: 'getById should verify the authenticated user is either the document owner OR a member of the document\'s organization before returning any data. Unauthorized users should receive an "Unauthorized" error without seeing document metadata.',
      actualBehavior: 'getById returns full document metadata to ANY authenticated user, regardless of ownership or organization membership. Authorization check happens AFTER data exposure.',
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
    sha: '3df92d5',
    message: 'fix: Critical security fix - Add authorization to getById and fix typos',
    url: 'https://github.com/antoniodjones/arkhitekton-platform/commit/3df92d5',
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

  console.log('\n✅ Security and typo defects created and linked!\n');

  // Summary
  console.log('📊 Summary:\n');
  console.log('  User Story: US-REF-001 (Reference Code: Document Management)');
  console.log('  Defects Created: 2');
  console.log('  - DEF-REF-006: Typos in error messages (Severity: Low)');
  console.log('  - DEF-REF-007: Missing authorization check (Severity: CRITICAL 🔴)');
  console.log('  Fix Commit: 3df92d5');
  console.log('  Status: All resolved');
  console.log('\n  🚨 CRITICAL SECURITY FIX 🚨');
  console.log('  - Vulnerability: Broken Access Control (OWASP A01:2021)');
  console.log('  - Data Exposed: Document metadata (ownerId, organizationId, title, content)');
  console.log('  - Attack Vector: Liveblocks auth endpoint + unauthenticated getById query');
  console.log('  - Fix: Added authentication + ownership verification to getById');
  console.log('\n  Total Reference Code Defects: 7 (DEF-REF-001 through DEF-REF-007)\n');
}

createSecurityAndTypoDefects()
  .then(() => {
    console.log('🎉 Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error creating defects:', error);
    process.exit(1);
  });

