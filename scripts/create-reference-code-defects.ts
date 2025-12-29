import { db } from '../server/db';
import { defects, userStories, codeChanges } from '../shared/schema';

/**
 * Create defects for the reference code promise chain bugs
 * Links them to the appropriate user stories
 */

async function createReferenceCodeDefects() {
  console.log('🐛 Creating defects for reference code promise chain bugs...\n');

  // Check if we have a document management story, or create a placeholder reference
  const referenceStory = {
    id: 'US-REF-001',
    title: 'Reference Code: Document Management',
    description: 'Google Docs-style document CRUD operations (create, read, update, delete)',
    status: 'reference' as const,
  };

  // Try to find or create the reference story
  let story = await db.select()
    .from(userStories)
    .where(userStories.id === referenceStory.id)
    .limit(1);

  if (story.length === 0) {
    console.log('Creating reference user story...');
    await db.insert(userStories).values({
      id: referenceStory.id,
      title: referenceStory.title,
      description: referenceStory.description,
      acceptanceCriteria: 'N/A - Reference code from external project',
      storyPoints: 0,
      status: 'reference',
      priority: 'medium',
      epicId: null,
      feature: 'Reference Code',
    });
    console.log(`✅ Created story: ${referenceStory.id}\n`);
  } else {
    console.log(`✅ Found existing story: ${referenceStory.id}\n`);
  }

  // Define the defects
  const defectsToCreate = [
    {
      id: 'DEF-REF-001',
      title: 'Promise chain causes routing to /documents/undefined on error',
      description: `**Location**: CodeOptions/nextjs-google-docs-master/src/app/(home)/templates-gallery.tsx:26-35

**Issue**: The .catch() handler is placed before .then() in the promise chain. When an error occurs, .catch() returns undefined, causing .then() to execute with undefined as the resolved value. This results in invalid routing like \`/documents/undefined\`.

**Impact**: Users see error toast but are incorrectly routed to invalid URLs when document creation fails.

**Root Cause**: Incorrect promise chain order: \`.catch().then().finally()\` instead of \`.then().catch().finally()\`

**Code Snippet**:
\`\`\`typescript
create({ title, initialContent })
  .catch(() => toast.error("Something went wrong")) // Returns undefined
  .then((documentId) => {
    toast.success("Document created")
    router.push(\`/documents/\${documentId}\`); // documentId is undefined on error!
  })
\`\`\``,
      severity: 'high',
      priority: 'high',
      status: 'resolved',
      stepsToReproduce: `1. Navigate to templates gallery
2. Cause a document creation failure (e.g., network error, invalid data)
3. Observe error toast appears
4. Observe browser routes to /documents/undefined instead of staying on current page`,
      expectedBehavior: 'When document creation fails, user should see error toast and remain on current page. No routing should occur.',
      actualBehavior: 'Error toast appears, but browser incorrectly routes to /documents/undefined',
      environment: 'Reference Code (Next.js Google Docs)',
      affectedStoryId: referenceStory.id,
      resolvedAt: new Date(),
    },
    {
      id: 'DEF-REF-002',
      title: 'Document deletion routes to home with undefined on error',
      description: `**Location**: CodeOptions/nextjs-google-docs-master/src/components/remove-dialog.tsx:54-61

**Issue**: The .catch() handler is placed before .then() in the promise chain. When document deletion fails, .catch() returns undefined, and .then() still executes, attempting to show success toast and route to home page.

**Impact**: On deletion failure, users see both error and success toasts, and are incorrectly routed away from the current page.

**Root Cause**: Incorrect promise chain order: \`.catch().then().finally()\` instead of \`.then().catch().finally()\`

**Code Snippet**:
\`\`\`typescript
remove({ id: documentId })
  .catch(() => toast.error("Something went wrong")) // Returns undefined
  .then(() => {
    toast.success("Document removed"); // Executes even on error!
    router.push("/"); // Routes even on error!
  })
\`\`\``,
      severity: 'high',
      priority: 'high',
      status: 'resolved',
      stepsToReproduce: `1. Open delete confirmation dialog
2. Cause a deletion failure (e.g., permission denied, network error)
3. Observe both error and success toasts appear
4. Observe browser incorrectly routes to home page despite failure`,
      expectedBehavior: 'When deletion fails, user should see error toast and remain on current page. No success toast or routing should occur.',
      actualBehavior: 'Both error and success toasts appear, and browser routes to home page despite the operation failing',
      environment: 'Reference Code (Next.js Google Docs)',
      affectedStoryId: referenceStory.id,
      resolvedAt: new Date(),
    },
    {
      id: 'DEF-REF-003',
      title: 'New document creation routes to /documents/undefined on error',
      description: `**Location**: CodeOptions/nextjs-google-docs-master/src/app/documents/[documentId]/navbar.tsx:60-69

**Issue**: The .catch() handler is placed before .then() in the promise chain. When creating a new document fails, .catch() returns undefined, causing .then() to execute with undefined as the document ID.

**Impact**: Users see error toast but are incorrectly routed to /documents/undefined when new document creation fails.

**Root Cause**: Incorrect promise chain order: \`.catch().then()\` instead of \`.then().catch()\`

**Code Snippet**:
\`\`\`typescript
mutation({ title: "Untitled document", initialContent: "" })
  .catch(() => toast.error("Something went wrong")) // Returns undefined
  .then((id) => {
    toast.success("Document created");
    router.push(\`/documents/\${id}\`); // id is undefined on error!
  });
\`\`\``,
      severity: 'high',
      priority: 'high',
      status: 'resolved',
      stepsToReproduce: `1. Click "New Document" button in navbar
2. Cause a document creation failure (e.g., network error, database error)
3. Observe error toast appears
4. Observe browser routes to /documents/undefined instead of staying on current page`,
      expectedBehavior: 'When document creation fails, user should see error toast and remain on current page. No routing should occur.',
      actualBehavior: 'Error toast appears, but browser incorrectly routes to /documents/undefined',
      environment: 'Reference Code (Next.js Google Docs)',
      affectedStoryId: referenceStory.id,
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

  // Link to the git commit that fixed them
  console.log('\n🔗 Linking defects to fix commit...\n');

  const fixCommit = {
    sha: '096098d',
    message: 'fix: Correct promise chain order in reference code',
    url: 'https://github.com/antoniodjones/arkhitekton-platform/commit/096098d',
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

  console.log('\n✅ Reference code defects created and linked!\n');

  // Summary
  console.log('📊 Summary:\n');
  console.log('  User Story: US-REF-001 (Reference Code: Document Management)');
  console.log('  Defects Created: 3');
  console.log('  - DEF-REF-001: Template creation routing bug');
  console.log('  - DEF-REF-002: Document deletion routing bug');
  console.log('  - DEF-REF-003: New document creation routing bug');
  console.log('  Fix Commit: 096098d');
  console.log('  Status: All resolved\n');
}

createReferenceCodeDefects()
  .then(() => {
    console.log('🎉 Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error creating defects:', error);
    process.exit(1);
  });

