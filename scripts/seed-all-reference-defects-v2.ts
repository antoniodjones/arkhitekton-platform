import { db } from '../server/db';
import { defects, codeChanges } from '../shared/schema';
import { eq } from 'drizzle-orm';

/**
 * Seed ALL 14 reference code defects in one go
 * Uses upsert logic to avoid duplicates
 */

async function seedAllReferenceDefects() {
  console.log('🌱 Seeding all 14 reference code defects...\n');

  const allDefects = [
    // DEF-REF-001 to DEF-REF-003 (Promise chain bugs)
    {
      id: 'DEF-REF-001',
      title: 'Template creation routing fails due to incorrect promise chain',
      description: 'The createDocument mutation promise chain in templates-gallery.tsx has .catch() before .then(), causing router.push() to execute with undefined.',
      severity: 'high' as const,
      priority: 'high' as const,
      status: 'resolved' as const,
      stepsToReproduce: '1. Click any template in gallery\n2. Promise resolves but catch returns undefined\n3. router.push(undefined) navigates to /documents/undefined',
      expectedBehavior: 'Should navigate to /documents/{documentId}',
      actualBehavior: 'Navigates to /documents/undefined',
      environment: 'Reference Code (Next.js Google Docs)',
      userStoryId: 'US-REF-001',
      resolvedAt: new Date('2025-12-24'),
    },
    {
      id: 'DEF-REF-002',
      title: 'Document deletion routing fails due to incorrect promise chain',
      description: 'The removeDocument mutation promise chain in remove-dialog.tsx has .catch() before .then(), causing router.push() to execute with undefined.',
      severity: 'high' as const,
      priority: 'high' as const,
      status: 'resolved' as const,
      stepsToReproduce: '1. Delete a document\n2. Promise resolves but catch returns undefined\n3. router.push(undefined) navigates to invalid path',
      expectedBehavior: 'Should navigate to home page /',
      actualBehavior: 'Navigates to /undefined',
      environment: 'Reference Code (Next.js Google Docs)',
      userStoryId: 'US-REF-001',
      resolvedAt: new Date('2025-12-24'),
    },
    {
      id: 'DEF-REF-003',
      title: 'New document creation routing fails due to incorrect promise chain',
      description: 'The createDocument mutation promise chain in navbar.tsx has .catch() before .then(), causing router.push() to execute with undefined.',
      severity: 'high' as const,
      priority: 'high' as const,
      status: 'resolved' as const,
      stepsToReproduce: '1. Click "New Document" button\n2. Promise resolves but catch returns undefined\n3. router.push(undefined) navigates to /documents/undefined',
      expectedBehavior: 'Should navigate to /documents/{documentId}',
      actualBehavior: 'Navigates to /documents/undefined',
      environment: 'Reference Code (Next.js Google Docs)',
      userStoryId: 'US-REF-001',
      resolvedAt: new Date('2025-12-24'),
    },

    // DEF-REF-004 to DEF-REF-005 (CSS and UI bugs)
    {
      id: 'DEF-REF-004',
      title: 'Invalid CSS variable syntax breaks dark mode styling',
      description: 'globals.css uses (--radius - 2) which is invalid. Should be calc(var(--radius) - 2px).',
      severity: 'medium' as const,
      priority: 'medium' as const,
      status: 'resolved' as const,
      stepsToReproduce: '1. Inspect computed CSS\n2. Border radius not applied correctly\n3. Dark mode styling inconsistent',
      expectedBehavior: 'CSS variables should use valid calc() syntax',
      actualBehavior: 'Invalid syntax (--radius - 2) is ignored by browser',
      environment: 'Reference Code (Next.js Google Docs)',
      userStoryId: 'US-REF-001',
      resolvedAt: new Date('2025-12-24'),
    },
    {
      id: 'DEF-REF-005',
      title: 'Document rename toast shows "deleted" instead of "renamed"',
      description: 'rename-dialog.tsx displays "Document deleted" toast after rename, causing user confusion.',
      severity: 'medium' as const,
      priority: 'medium' as const,
      status: 'resolved' as const,
      stepsToReproduce: '1. Rename a document\n2. Success toast displays "Document deleted"\n3. User thinks document was deleted instead of renamed',
      expectedBehavior: 'Should display "Document renamed" toast',
      actualBehavior: 'Displays "Document deleted" toast',
      environment: 'Reference Code (Next.js Google Docs)',
      userStoryId: 'US-REF-001',
      resolvedAt: new Date('2025-12-24'),
    },

    // DEF-REF-006 to DEF-REF-007 (Typos and critical security)
    {
      id: 'DEF-REF-006',
      title: 'Typos in error messages: "Unathorized" and "Untitled coument"',
      description: 'documents.ts contains two typos in user-facing error messages.',
      severity: 'low' as const,
      priority: 'low' as const,
      status: 'resolved' as const,
      stepsToReproduce: '1. Trigger unauthorized access\n2. Error message shows "Unathorized"\n3. Create new document\n4. Default title is "Untitled coument"',
      expectedBehavior: 'Should show "Unauthorized" and "Untitled document"',
      actualBehavior: 'Shows "Unathorized" and "Untitled coument"',
      environment: 'Reference Code (Next.js Google Docs)',
      userStoryId: 'US-REF-001',
      resolvedAt: new Date('2025-12-24'),
    },
    {
      id: 'DEF-REF-007',
      title: 'CRITICAL: getById query has NO authorization check - exposes all documents',
      description: 'The getById query in documents.ts retrieves documents without verifying user ownership or organization membership, allowing any authenticated user to access any document.',
      severity: 'critical' as const,
      priority: 'critical' as const,
      status: 'resolved' as const,
      stepsToReproduce: '1. User A creates private document\n2. User B (different user) calls getById with User A document ID\n3. Query returns document without authorization check\n4. User B can access User A private document',
      expectedBehavior: 'getById should verify user is either document owner or in same organization',
      actualBehavior: 'getById returns document to any authenticated user without authorization',
      environment: 'Reference Code (Next.js Google Docs)',
      userStoryId: 'US-REF-001',
      resolvedAt: new Date('2025-12-24'),
    },

    // DEF-REF-008 to DEF-REF-009 (Auth ID mismatch and operator precedence)
    {
      id: 'DEF-REF-008',
      title: 'CRITICAL: Owner ID mismatch between Convex and Clerk breaks authorization',
      description: 'Convex stores ownerId as user.subject but Liveblocks auth route compares with user.id, causing document owners to be denied access.',
      severity: 'critical' as const,
      priority: 'critical' as const,
      status: 'resolved' as const,
      stepsToReproduce: '1. Create document (Convex stores user.subject)\n2. Open document editor (Liveblocks checks user.id)\n3. Authorization fails because user.subject !== user.id\n4. Document owner locked out of their own document',
      expectedBehavior: 'Should use consistent ID field (user.subject) across Convex and Clerk',
      actualBehavior: 'Convex uses user.subject, Liveblocks uses user.id - mismatch denies access',
      environment: 'Reference Code (Next.js Google Docs)',
      userStoryId: 'US-REF-001',
      resolvedAt: new Date('2025-12-24'),
    },
    {
      id: 'DEF-REF-009',
      title: 'Heading button styling broken due to operator precedence',
      description: 'toolbar.tsx uses editor.isActive("heading", { level }) || level without parentheses, causing incorrect precedence.',
      severity: 'medium' as const,
      priority: 'medium' as const,
      status: 'resolved' as const,
      stepsToReproduce: '1. Select heading level 2\n2. Button active state incorrect\n3. isActive check evaluates incorrectly due to || precedence',
      expectedBehavior: 'Should use editor.isActive("heading", { level: level })',
      actualBehavior: 'Uses editor.isActive("heading", { level }) || level with wrong precedence',
      environment: 'Reference Code (Next.js Google Docs)',
      userStoryId: 'US-REF-001',
      resolvedAt: new Date('2025-12-24'),
    },

    // DEF-REF-010 (Org ID field mismatch)
    {
      id: 'DEF-REF-010',
      title: 'CRITICAL: Organization ID field name inconsistency creates authorization vulnerability',
      description: 'Convex create mutation uses user.org_id while getById uses user.organization_id, creating field mismatch that breaks authorization.',
      severity: 'critical' as const,
      priority: 'critical' as const,
      status: 'resolved' as const,
      stepsToReproduce: '1. User creates doc in org (stored with org_id)\n2. User tries to access doc (checked with organization_id)\n3. Field mismatch: org_id !== organization_id\n4. Authorization check fails or bypassed',
      expectedBehavior: 'Should consistently use user.org_id everywhere',
      actualBehavior: 'create uses org_id, getById uses organization_id - inconsistent',
      environment: 'Reference Code (Next.js Google Docs)',
      userStoryId: 'US-REF-001',
      resolvedAt: new Date('2025-12-24'),
    },

    // DEF-REF-011 to DEF-REF-012 (getByIds authorization and remaining org_id bugs)
    {
      id: 'DEF-REF-011',
      title: 'CRITICAL: getByIds query has no authorization - exposes all documents',
      description: 'The getByIds query has NO authentication or authorization checks. Any authenticated user can call it with arbitrary document IDs.',
      severity: 'critical' as const,
      priority: 'critical' as const,
      status: 'resolved' as const,
      stepsToReproduce: '1. User A creates private document\n2. User B calls getByIds([docIdA])\n3. Query returns document ID and title without authorization\n4. User B can enumerate documents',
      expectedBehavior: 'getByIds should check authorization for EACH document',
      actualBehavior: 'getByIds returns all requested documents without any authorization',
      environment: 'Reference Code (Next.js Google Docs)',
      userStoryId: 'US-REF-001',
      resolvedAt: new Date('2025-12-24'),
    },
    {
      id: 'DEF-REF-012',
      title: 'CRITICAL: Remaining org_id field inconsistencies break document operations',
      description: 'DEF-REF-010 only fixed create and getById. But get, removeById, updateById still use organization_id instead of org_id.',
      severity: 'critical' as const,
      priority: 'critical' as const,
      status: 'resolved' as const,
      stepsToReproduce: '1. Create doc in org (uses org_id correctly)\n2. Try to delete doc (removeById checks organization_id)\n3. Field mismatch causes authorization failure\n4. Org member denied access to shared document',
      expectedBehavior: 'ALL functions should use user.org_id consistently',
      actualBehavior: 'get, removeById, updateById still use organization_id - breaks org docs',
      environment: 'Reference Code (Next.js Google Docs)',
      userStoryId: 'US-REF-001',
      resolvedAt: new Date('2025-12-24'),
    },

    // DEF-REF-013 to DEF-REF-014 (Auth pattern and type cast)
    {
      id: 'DEF-REF-013',
      title: 'Inconsistent authorization pattern across document operations',
      description: 'removeById and updateById create intermediate organizationId variable, while getById and getByIds compare directly to user.org_id.',
      severity: 'medium' as const,
      priority: 'medium' as const,
      status: 'resolved' as const,
      stepsToReproduce: '1. Compare authorization checks in documents.ts\n2. getById: document.organizationId === user.org_id\n3. removeById: document.organizationId === organizationId (where organizationId = user.org_id ?? undefined)\n4. Inconsistent patterns',
      expectedBehavior: 'All functions should use same authorization pattern',
      actualBehavior: 'Different patterns: direct comparison vs intermediate variable',
      environment: 'Reference Code (Next.js Google Docs)',
      userStoryId: 'US-REF-001',
      resolvedAt: new Date('2025-12-24'),
    },
    {
      id: 'DEF-REF-014',
      title: 'CRITICAL: Unsafe type cast in getUsers() causes API failures',
      description: 'getUsers() unsafely casts sessionClaims?.org_id to string, passing [undefined] to Clerk API when user not in organization.',
      severity: 'critical' as const,
      priority: 'critical' as const,
      status: 'resolved' as const,
      stepsToReproduce: '1. Personal user (no org) opens document\n2. getUsers() executes with org_id = undefined\n3. API receives getUserList({ organizationId: [undefined] })\n4. API fails or returns wrong user list',
      expectedBehavior: 'Should conditionally call API with/without organizationId filter',
      actualBehavior: 'Unsafely casts undefined to string, passes [undefined] to API',
      environment: 'Reference Code (Next.js Google Docs)',
      userStoryId: 'US-REF-001',
      resolvedAt: new Date('2025-12-24'),
    },
  ];

  const commits = [
    { sha: '096098d', defects: ['DEF-REF-001', 'DEF-REF-002', 'DEF-REF-003'] },
    { sha: 'bbfa773', defects: ['DEF-REF-004', 'DEF-REF-005'] },
    { sha: '3df92d5', defects: ['DEF-REF-006', 'DEF-REF-007'] },
    { sha: 'fb8dbd5', defects: ['DEF-REF-008', 'DEF-REF-009'] },
    { sha: '7c25029', defects: ['DEF-REF-010'] },
    { sha: 'c14fe8a', defects: ['DEF-REF-011', 'DEF-REF-012'] },
    { sha: '42f9160', defects: ['DEF-REF-013', 'DEF-REF-014'] },
  ];

  let inserted = 0;
  let updated = 0;

  for (const defect of allDefects) {
    try {
      // Check if exists
      const existing = await db.select().from(defects).where(eq(defects.id, defect.id)).limit(1);

      if (existing.length === 0) {
        // Insert new
        await db.insert(defects).values(defect);
        console.log(`✅ Inserted: ${defect.id} - ${defect.title.substring(0, 60)}...`);
        inserted++;
      } else {
        // Update existing
        await db.update(defects).set(defect).where(eq(defects.id, defect.id));
        console.log(`♻️  Updated: ${defect.id} - ${defect.title.substring(0, 60)}...`);
        updated++;
      }
    } catch (error) {
      console.error(`❌ Failed to upsert ${defect.id}:`, error);
    }
  }

  console.log(`\n📊 Summary: ${inserted} inserted, ${updated} updated\n`);

  // Link commits
  console.log('🔗 Linking commits to defects...\n');

  for (const commit of commits) {
    for (const defectId of commit.defects) {
      try {
        const existing = await db.select()
          .from(codeChanges)
          .where(eq(codeChanges.entityId, defectId))
          .where(eq(codeChanges.commitSha, commit.sha))
          .limit(1);

        if (existing.length === 0) {
          await db.insert(codeChanges).values({
            entityType: 'defect',
            entityId: defectId,
            changeType: 'commit',
            repository: 'arkhitekton-platform',
            commitSha: commit.sha,
            commitMessage: `fix: Reference code bugs (${defectId})`,
            commitUrl: `https://github.com/antoniodjones/arkhitekton-platform/commit/${commit.sha}`,
            authorUsername: 'antoniodjones',
            eventTimestamp: new Date('2025-12-24'),
          });
          console.log(`  🔗 Linked ${commit.sha} → ${defectId}`);
        }
      } catch (error) {
        console.error(`  ❌ Failed to link ${commit.sha} → ${defectId}:`, error);
      }
    }
  }

  console.log('\n✅ All reference defects seeded!');
}

seedAllReferenceDefects()
  .then(() => {
    console.log('\n🎉 Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error:', error);
    process.exit(1);
  });

