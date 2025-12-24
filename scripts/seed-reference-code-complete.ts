import { db } from '../server/db';
import { userStories, epics, defects, codeChanges } from '../shared/schema';
import { eq } from 'drizzle-orm';

/**
 * Complete seeding for reference code:
 * 1. Create parent epic (if needed)
 * 2. Create US-REF-001 user story
 * 3. Create all 14 defects
 * 4. Link to GitHub commits
 */

async function seedReferenceCodeComplete() {
  console.log('🌱 Seeding complete reference code tracking...\n');

  // Step 1: Create or verify parent epic exists
  console.log('Step 1: Creating parent epic...');
  
  const epicId = 'EPIC-REF-001';
  const existingEpic = await db.select().from(epics).where(eq(epics.id, epicId)).limit(1);
  
  if (existingEpic.length === 0) {
    await db.insert(epics).values({
      id: epicId,
      name: 'Reference Code Analysis & Bug Fixes',
      description: 'Analyze reference codebases (Next.js Google Docs, Storage Management) to identify bugs, security issues, and code quality improvements. Document findings as defects for learning and best practices.',
      status: 'completed',
      priority: 'high',
      valueStream: 'knowledge',
      startDate: '2025-12-24',
    });
    console.log(`✅ Created epic: ${epicId}`);
  } else {
    console.log(`ℹ️  Epic already exists: ${epicId}`);
  }

  // Step 2: Create parent user story US-REF-001
  console.log('\nStep 2: Creating parent user story...');
  
  const storyId = 'US-REF-001';
  const existingStory = await db.select().from(userStories).where(eq(userStories.id, storyId)).limit(1);
  
  if (existingStory.length === 0) {
    await db.insert(userStories).values({
      id: storyId,
      title: 'Reference Code: Document Management - Bug Analysis',
      description: `As a developer, I want to analyze the reference Next.js Google Docs codebase to identify bugs, security vulnerabilities, and code quality issues, so that I can learn from these mistakes and apply best practices to the Arkhitekton platform.

**Reference Codebase**: CodeOptions/nextjs-google-docs-master

**Analysis Focus**:
- Authentication & Authorization
- Data validation & type safety
- Error handling
- Promise chains and async/await patterns
- CSS syntax
- User experience (toasts, routing)

**Acceptance Criteria**:
Given I analyze the reference codebase
When I review documents.ts, actions.ts, and UI components
Then I should identify and document all bugs, vulnerabilities, and issues
And create defect tickets for traceability
And fix similar issues in Arkhitekton platform`,
      acceptanceCriteria: `Given I analyze the reference codebase
When I review documents.ts, actions.ts, and UI components  
Then I should identify and document all bugs, vulnerabilities, and issues
And create defect tickets for traceability
And fix similar issues in Arkhitekton platform`,
      storyPoints: 13,
      status: 'done',
      priority: 'high',
      epicId: epicId,
      feature: 'Code Quality',
      value: 'Learn from reference code mistakes to prevent similar issues in production',
    });
    console.log(`✅ Created user story: ${storyId}`);
  } else {
    console.log(`ℹ️  User story already exists: ${storyId}`);
  }

  // Step 3: Create all 14 defects
  console.log('\nStep 3: Creating all 14 defects...\n');

  const allDefects = [
    // DEF-REF-001 to DEF-REF-003 (Promise chain bugs - commit 096098d)
    {
      id: 'DEF-REF-001',
      title: 'Template creation routing fails due to incorrect promise chain',
      description: 'The createDocument mutation promise chain in templates-gallery.tsx has .catch() before .then(), causing router.push() to execute with undefined when an error is caught.',
      severity: 'high' as const,
      priority: 'high' as const,
      status: 'resolved' as const,
      stepsToReproduce: '1. Click any template in gallery\n2. If error occurs, promise catch returns undefined\n3. Subsequent .then() receives undefined\n4. router.push(undefined) navigates to /documents/undefined',
      expectedBehavior: 'Should navigate to /documents/{documentId} on success, stay on page on error',
      actualBehavior: 'Navigates to /documents/undefined when error caught',
      environment: 'Reference Code (Next.js Google Docs)',
      userStoryId: storyId,
      resolvedAt: new Date('2025-12-24'),
    },
    {
      id: 'DEF-REF-002',
      title: 'Document deletion routing fails due to incorrect promise chain',
      description: 'The removeDocument mutation promise chain in remove-dialog.tsx has .catch() before .then(), causing router.push() to execute with undefined.',
      severity: 'high' as const,
      priority: 'high' as const,
      status: 'resolved' as const,
      stepsToReproduce: '1. Delete a document\n2. If error occurs, catch returns undefined\n3. router.push(undefined) navigates to invalid path',
      expectedBehavior: 'Should navigate to home page / on success, show error on failure',
      actualBehavior: 'Navigates to /undefined when error caught',
      environment: 'Reference Code (Next.js Google Docs)',
      userStoryId: storyId,
      resolvedAt: new Date('2025-12-24'),
    },
    {
      id: 'DEF-REF-003',
      title: 'New document creation routing fails due to incorrect promise chain',
      description: 'The createDocument mutation promise chain in navbar.tsx has .catch() before .then(), causing router.push() to execute with undefined.',
      severity: 'high' as const,
      priority: 'high' as const,
      status: 'resolved' as const,
      stepsToReproduce: '1. Click "New Document" button\n2. If error occurs, catch returns undefined\n3. router.push(undefined) navigates to /documents/undefined',
      expectedBehavior: 'Should navigate to /documents/{documentId} on success, show error on failure',
      actualBehavior: 'Navigates to /documents/undefined when error caught',
      environment: 'Reference Code (Next.js Google Docs)',
      userStoryId: storyId,
      resolvedAt: new Date('2025-12-24'),
    },

    // DEF-REF-004 to DEF-REF-005 (CSS and UI bugs - commit bbfa773)
    {
      id: 'DEF-REF-004',
      title: 'Invalid CSS variable syntax breaks dark mode styling',
      description: 'globals.css uses (--radius - 2) which is invalid CSS syntax. Should be calc(var(--radius) - 2px).',
      severity: 'medium' as const,
      priority: 'medium' as const,
      status: 'resolved' as const,
      stepsToReproduce: '1. Inspect computed CSS\n2. Border radius not applied correctly\n3. Dark mode styling inconsistent',
      expectedBehavior: 'CSS variables should use valid calc() syntax',
      actualBehavior: 'Invalid syntax (--radius - 2) is ignored by browser',
      environment: 'Reference Code (Next.js Google Docs)',
      userStoryId: storyId,
      resolvedAt: new Date('2025-12-24'),
    },
    {
      id: 'DEF-REF-005',
      title: 'Document rename toast shows "deleted" instead of "renamed"',
      description: 'rename-dialog.tsx displays "Document deleted" toast after successful rename operation, causing user confusion.',
      severity: 'medium' as const,
      priority: 'medium' as const,
      status: 'resolved' as const,
      stepsToReproduce: '1. Rename a document\n2. Success toast displays "Document deleted"\n3. User thinks document was deleted instead of renamed',
      expectedBehavior: 'Should display "Document renamed" toast',
      actualBehavior: 'Displays "Document deleted" toast',
      environment: 'Reference Code (Next.js Google Docs)',
      userStoryId: storyId,
      resolvedAt: new Date('2025-12-24'),
    },

    // DEF-REF-006 to DEF-REF-007 (Typos and critical security - commit 3df92d5)
    {
      id: 'DEF-REF-006',
      title: 'Typos in error messages: "Unathorized" and "Untitled coument"',
      description: 'documents.ts contains two typos in user-facing messages: "Unathorized" (should be "Unauthorized") and "Untitled coument" (should be "Untitled document").',
      severity: 'low' as const,
      priority: 'low' as const,
      status: 'resolved' as const,
      stepsToReproduce: '1. Trigger unauthorized access -> Error shows "Unathorized"\n2. Create new document -> Default title is "Untitled coument"',
      expectedBehavior: 'Should show "Unauthorized" and "Untitled document"',
      actualBehavior: 'Shows "Unathorized" and "Untitled coument"',
      environment: 'Reference Code (Next.js Google Docs)',
      userStoryId: storyId,
      resolvedAt: new Date('2025-12-24'),
    },
    {
      id: 'DEF-REF-007',
      title: 'CRITICAL: getById query missing authorization check - exposes all documents',
      description: 'The getById query in documents.ts retrieves documents without verifying user ownership or organization membership. Any authenticated user can access any document by ID.',
      severity: 'critical' as const,
      priority: 'critical' as const,
      status: 'resolved' as const,
      type: 'security',
      stepsToReproduce: '1. User A creates private document (gets ID)\n2. User B (different user, no shared org) authenticates\n3. User B calls getById with User A document ID\n4. Query returns full document without authorization check\n5. User B accesses User A private document',
      expectedBehavior: 'getById should verify user is document owner OR in same organization',
      actualBehavior: 'getById returns document to ANY authenticated user without authorization',
      environment: 'Reference Code (Next.js Google Docs)',
      userStoryId: storyId,
      resolvedAt: new Date('2025-12-24'),
    },

    // DEF-REF-008 to DEF-REF-009 (Auth ID mismatch and operator precedence - commit fb8dbd5)
    {
      id: 'DEF-REF-008',
      title: 'CRITICAL: Owner ID mismatch between Convex and Clerk breaks authorization',
      description: 'Convex stores ownerId as user.subject but Liveblocks auth route compares with user.id. Document owners are denied access to their own documents during real-time collaboration.',
      severity: 'critical' as const,
      priority: 'critical' as const,
      status: 'resolved' as const,
      type: 'security',
      stepsToReproduce: '1. User creates document (Convex stores user.subject as ownerId)\n2. User opens document editor (Liveblocks checks user.id for authorization)\n3. Authorization fails: user.subject !== user.id\n4. Document owner locked out of their own document',
      expectedBehavior: 'Should use consistent ID field (user.subject) across Convex and Clerk integrations',
      actualBehavior: 'Convex uses user.subject, Liveblocks uses user.id - mismatch denies legitimate access',
      environment: 'Reference Code (Next.js Google Docs)',
      userStoryId: storyId,
      resolvedAt: new Date('2025-12-24'),
    },
    {
      id: 'DEF-REF-009',
      title: 'Heading button styling broken due to operator precedence',
      description: 'toolbar.tsx uses editor.isActive("heading", { level }) || level without proper object syntax, causing incorrect operator precedence in active state check.',
      severity: 'medium' as const,
      priority: 'medium' as const,
      status: 'resolved' as const,
      stepsToReproduce: '1. Select heading level 2\n2. Button active state incorrect\n3. isActive check evaluates incorrectly due to || precedence with incomplete object',
      expectedBehavior: 'Should use editor.isActive("heading", { level: level }) with proper syntax',
      actualBehavior: 'Uses editor.isActive("heading", { level }) || level with ambiguous precedence',
      environment: 'Reference Code (Next.js Google Docs)',
      userStoryId: storyId,
      resolvedAt: new Date('2025-12-24'),
    },

    // DEF-REF-010 (Org ID field mismatch - commit 7c25029)
    {
      id: 'DEF-REF-010',
      title: 'CRITICAL: Organization ID field inconsistency creates authorization vulnerability',
      description: 'Convex create mutation uses user.org_id while getById uses user.organization_id. Field name mismatch breaks authorization for organization documents.',
      severity: 'critical' as const,
      priority: 'critical' as const,
      status: 'resolved' as const,
      type: 'security',
      stepsToReproduce: '1. User creates doc in organization (stored with user.org_id)\n2. User tries to access doc (checked with user.organization_id)\n3. Field mismatch: org_id !== organization_id\n4. Authorization check fails OR bypassed depending on implementation',
      expectedBehavior: 'Should consistently use user.org_id everywhere (matches Clerk JWT claim)',
      actualBehavior: 'create uses org_id, getById uses organization_id - inconsistent field names',
      environment: 'Reference Code (Next.js Google Docs)',
      userStoryId: storyId,
      resolvedAt: new Date('2025-12-24'),
    },

    // DEF-REF-011 to DEF-REF-012 (getByIds and remaining org_id - commit c14fe8a)
    {
      id: 'DEF-REF-011',
      title: 'CRITICAL: getByIds query has NO authorization - exposes all documents',
      description: 'The getByIds query has ZERO authentication or authorization checks. Any authenticated user can query arbitrary document IDs and retrieve titles and metadata.',
      severity: 'critical' as const,
      priority: 'critical' as const,
      status: 'resolved' as const,
      type: 'security',
      stepsToReproduce: '1. User A creates private documents\n2. User B authenticates to app\n3. User B calls getByIds([docId1, docId2, ...])\n4. Query returns ALL document IDs and titles without authorization\n5. User B enumerates and maps document database',
      expectedBehavior: 'getByIds should authenticate user AND check authorization for EACH document in array',
      actualBehavior: 'getByIds returns all requested documents without ANY authorization checks',
      environment: 'Reference Code (Next.js Google Docs)',
      userStoryId: storyId,
      resolvedAt: new Date('2025-12-24'),
    },
    {
      id: 'DEF-REF-012',
      title: 'CRITICAL: Remaining org_id inconsistencies break document operations',
      description: 'DEF-REF-010 only fixed create and getById. Functions get, removeById, and updateById still use organization_id instead of org_id, locking org members out of shared documents.',
      severity: 'critical' as const,
      priority: 'critical' as const,
      status: 'resolved' as const,
      type: 'bug',
      stepsToReproduce: '1. Create doc in org (uses org_id correctly)\n2. Try to delete doc (removeById checks organization_id)\n3. Field mismatch causes authorization failure\n4. Legitimate org member denied access to shared document',
      expectedBehavior: 'ALL functions should use user.org_id consistently across entire codebase',
      actualBehavior: 'get, removeById, updateById still use organization_id - breaks org document operations',
      environment: 'Reference Code (Next.js Google Docs)',
      userStoryId: storyId,
      resolvedAt: new Date('2025-12-24'),
    },

    // DEF-REF-013 to DEF-REF-014 (Auth pattern and type cast - commit 42f9160)
    {
      id: 'DEF-REF-013',
      title: 'Inconsistent authorization pattern across document operations',
      description: 'removeById and updateById create intermediate organizationId variable, while getById and getByIds compare directly to user.org_id. Inconsistency violates DRY and creates maintenance burden.',
      severity: 'medium' as const,
      priority: 'medium' as const,
      status: 'resolved' as const,
      type: 'bug',
      stepsToReproduce: '1. Review documents.ts authorization checks\n2. getById/getByIds: document.organizationId === user.org_id\n3. removeById/updateById: const organizationId = user.org_id ?? undefined; then compare\n4. Same logic, different patterns',
      expectedBehavior: 'All functions should use identical authorization pattern for consistency',
      actualBehavior: 'Different patterns: direct comparison vs redundant intermediate variable',
      environment: 'Reference Code (Next.js Google Docs)',
      userStoryId: storyId,
      resolvedAt: new Date('2025-12-24'),
    },
    {
      id: 'DEF-REF-014',
      title: 'CRITICAL: Unsafe type cast in getUsers() causes API failures',
      description: 'getUsers() unsafely casts sessionClaims?.org_id to string using "as string". When user not in organization, passes [undefined] to Clerk API, causing failures or wrong results.',
      severity: 'critical' as const,
      priority: 'critical' as const,
      status: 'resolved' as const,
      type: 'bug',
      stepsToReproduce: '1. Personal user (no organization) opens document\n2. Share dialog calls getUsers()\n3. getUsers() executes: getUserList({ organizationId: [sessionClaims?.org_id as string] })\n4. org_id is undefined, becomes [undefined]\n5. Clerk API receives invalid parameter, fails or returns wrong users',
      expectedBehavior: 'Should conditionally call API: with organizationId if user in org, without filter if personal user',
      actualBehavior: 'Unsafely casts undefined to string, passes [undefined] to Clerk API',
      environment: 'Reference Code (Next.js Google Docs)',
      userStoryId: storyId,
      resolvedAt: new Date('2025-12-24'),
    },
  ];

  let inserted = 0;
  let updated = 0;

  for (const defect of allDefects) {
    try {
      const existing = await db.select().from(defects).where(eq(defects.id, defect.id)).limit(1);

      if (existing.length === 0) {
        await db.insert(defects).values(defect);
        console.log(`✅ Inserted: ${defect.id} - ${defect.title.substring(0, 50)}...`);
        inserted++;
      } else {
        await db.update(defects).set(defect).where(eq(defects.id, defect.id));
        console.log(`♻️  Updated: ${defect.id}`);
        updated++;
      }
    } catch (error) {
      console.error(`❌ Failed ${defect.id}:`, error);
    }
  }

  console.log(`\n📊 Defects: ${inserted} inserted, ${updated} updated\n`);

  // Step 4: Link commits
  console.log('Step 4: Linking GitHub commits...\n');

  const commits = [
    { sha: '096098d', defects: ['DEF-REF-001', 'DEF-REF-002', 'DEF-REF-003'], message: 'fix: Promise chain bugs' },
    { sha: 'bbfa773', defects: ['DEF-REF-004', 'DEF-REF-005'], message: 'fix: CSS syntax and UI toast' },
    { sha: '3df92d5', defects: ['DEF-REF-006', 'DEF-REF-007'], message: 'fix: Typos and missing authorization' },
    { sha: 'fb8dbd5', defects: ['DEF-REF-008', 'DEF-REF-009'], message: 'fix: Owner ID mismatch and operator precedence' },
    { sha: '7c25029', defects: ['DEF-REF-010'], message: 'fix: Organization ID field inconsistency' },
    { sha: 'c14fe8a', defects: ['DEF-REF-011', 'DEF-REF-012'], message: 'fix: getByIds authorization and remaining org_id bugs' },
    { sha: '42f9160', defects: ['DEF-REF-013', 'DEF-REF-014'], message: 'fix: Auth pattern inconsistency and unsafe type cast' },
  ];

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
            commitMessage: commit.message,
            commitUrl: `https://github.com/antoniodjones/arkhitekton-platform/commit/${commit.sha}`,
            authorUsername: 'antoniodjones',
            eventTimestamp: new Date('2025-12-24'),
          });
          console.log(`  🔗 ${commit.sha} → ${defectId}`);
        }
      } catch (error) {
        console.error(`  ❌ Failed to link ${commit.sha} → ${defectId}`);
      }
    }
  }

  console.log('\n✅ Complete! All reference code defects seeded and linked.\n');
  
  // Summary
  console.log('📋 Summary:');
  console.log(`  Epic: ${epicId}`);
  console.log(`  Story: ${storyId}`);
  console.log(`  Defects: 14 (DEF-REF-001 through DEF-REF-014)`);
  console.log(`  Commits: 7 linked`);
  console.log(`  Status: All resolved\n`);
}

seedReferenceCodeComplete()
  .then(() => {
    console.log('🎉 Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error:', error);
    process.exit(1);
  });

