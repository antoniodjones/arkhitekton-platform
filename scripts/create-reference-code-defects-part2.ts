import { db } from '../server/db';
import { defects, codeChanges } from '../shared/schema';

/**
 * Create additional defects for reference code bugs (CSS and promise chain)
 */

async function createAdditionalDefects() {
  console.log('🐛 Creating additional defects for reference code bugs...\n');

  const defectsToCreate = [
    {
      id: 'DEF-REF-004',
      title: 'Invalid CSS variable syntax breaks table cell selection styling',
      description: `**Location**: CodeOptions/nextjs-google-docs-master/src/app/globals.css:141-142

**Issue**: The CSS uses invalid syntax \`var(#959596)\` for the background property. The \`var()\` function expects a CSS variable name (e.g., \`--color-name\`), not a hex color value.

**Impact**: Table cell selection styling does not apply correctly. When users select cells in a table within the editor, the visual selection indicator (background overlay) fails to render, making it unclear which cells are selected.

**Root Cause**: Incorrect CSS variable syntax mixing \`var()\` function with direct hex color value.

**Code Snippet**:
\`\`\`css
.selectedCell:after {
  background: var(#959596); /* INVALID - var() needs a variable name */
  content: "";
  left: 0; right: 0; top: 0; bottom: 0;
}
\`\`\`

**Correct Syntax Options**:
1. Direct hex: \`background: #959596;\`
2. CSS variable: \`background: var(--selection-color);\``,
      severity: 'medium',
      priority: 'medium',
      status: 'resolved',
      stepsToReproduce: `1. Open a document with a table in the editor
2. Click to select a table cell
3. Observe the cell selection
4. Inspect the element - background styling will not be applied
5. Check browser console for potential CSS parsing errors`,
      expectedBehavior: 'Selected table cells should show a semi-transparent gray background overlay (#959596) to indicate selection state.',
      actualBehavior: 'No background overlay appears on selected cells due to invalid CSS syntax. Selection state is not visually indicated.',
      environment: 'Reference Code (Next.js Google Docs)',
      affectedStoryId: 'US-REF-001',
      resolvedAt: new Date(),
    },
    {
      id: 'DEF-REF-005',
      title: 'Document rename shows both error and success toasts on failure',
      description: `**Location**: CodeOptions/nextjs-google-docs-master/src/components/rename-dialog.tsx:37-44

**Issue**: The \`.catch()\` handler is placed before \`.then()\` in the promise chain. When document rename fails, \`.catch()\` returns undefined, causing \`.then()\` to still execute and show a success toast alongside the error toast.

**Impact**: Users see conflicting messages - both "Something went wrong" and "Document updated" toasts appear simultaneously when rename fails. This creates confusion about whether the operation succeeded or failed.

**Root Cause**: Incorrect promise chain order: \`.catch().then().finally()\` instead of \`.then().catch().finally()\`

**Code Snippet**:
\`\`\`typescript
update({ id: documentId, title: title.trim() || "Untitled" })
  .catch(() => toast.error("Something went wrong")) // Returns undefined
  .then(() => toast.success("Document updated")) // Executes even on error!
  .finally(() => {
    setIsUpdating(false);
    setOpen(false);
  });
\`\`\`

**Related Defects**: This is the same pattern as DEF-REF-001, DEF-REF-002, and DEF-REF-003.`,
      severity: 'medium',
      priority: 'medium',
      status: 'resolved',
      stepsToReproduce: `1. Open a document
2. Click to rename the document
3. Cause a rename failure (e.g., network error, permission denied, server error)
4. Observe both error and success toasts appear
5. Dialog closes despite the operation failing`,
      expectedBehavior: 'When rename fails, user should see only the error toast ("Something went wrong") and the dialog should remain open or handle the error gracefully. No success message should appear.',
      actualBehavior: 'Both error and success toasts appear simultaneously. The dialog closes despite the operation failing, and the document title remains unchanged, creating a confusing user experience.',
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
    sha: 'bbfa773',
    message: 'fix: Correct CSS variable syntax and promise chain in reference code',
    url: 'https://github.com/antoniodjones/arkhitekton-platform/commit/bbfa773',
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

  console.log('\n✅ Additional reference code defects created and linked!\n');

  // Summary
  console.log('📊 Summary:\n');
  console.log('  User Story: US-REF-001 (Reference Code: Document Management)');
  console.log('  Defects Created: 2');
  console.log('  - DEF-REF-004: Invalid CSS variable syntax');
  console.log('  - DEF-REF-005: Document rename toast confusion');
  console.log('  Fix Commit: bbfa773');
  console.log('  Status: All resolved');
  console.log('\n  Total Reference Code Defects: 5 (DEF-REF-001 through DEF-REF-005)\n');
}

createAdditionalDefects()
  .then(() => {
    console.log('🎉 Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error creating defects:', error);
    process.exit(1);
  });

