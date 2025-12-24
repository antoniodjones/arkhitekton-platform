/**
 * Seed defect for test case dialog bug
 */

import { db } from '../server/db';
import { defects } from '../shared/schema';
import { eq } from 'drizzle-orm';

async function seedTestCaseDialogDefect() {
  console.log('Seeding test case dialog defect\n');

  const defectData = {
    id: 'DEF-QC-005',
    userStoryId: 'US-QC-102',
    title: 'Test Case Dialog sends invalid tags field causing creation to fail',
    description: `**Bug Description:**
The Test Case Dialog component sends an invalid \`tags: []\` field when creating test cases, causing the API to reject the request with a validation error. The \`insertTestCaseSchema\` does not include a \`tags\` field.

**Steps to Reproduce:**
1. Navigate to Quality Center → Test Plan
2. Select a test suite
3. Click "New Test Case"
4. Fill in test case details (title, priority, steps)
5. Click "Create"
6. Error: "Failed to create test case"

**Expected Behavior:**
Test case should be created successfully without sending the \`tags\` field.

**Actual Behavior:**
Test case creation fails due to schema validation error on \`tags\` field.

**Root Cause:**
\`test-case-dialog.tsx\` line 135 includes \`tags: []\` in the data payload, but the schema does not define this field.

**Impact:**
- Severity: Critical (blocks test case creation)
- Users cannot create test cases
- Test Planning module is unusable`,
    severity: 'critical',
    type: 'bug',
    status: 'resolved',
    discoveredBy: 'User',
    assignedTo: 'Development Team',
    rootCause: 'Component sending field not defined in API schema. Missing validation between frontend type definitions and backend schema.',
    resolution: `**Fix Applied:**
1. Removed \`tags: []\` field from test case creation payload (line 135)
2. Improved error handling to show actual server validation errors instead of generic message
3. Applied same error handling improvement to update mutation

**Files Changed:**
- \`client/src/components/quality/test-case-dialog.tsx\` (lines 76, 89, 135)

**Prevention:**
- Add TypeScript strict mode to catch schema mismatches
- Consider using shared Zod schemas between frontend and backend
- Add integration tests for test case CRUD operations`,
    createdAt: new Date('2025-12-24'),
    resolvedAt: new Date('2025-12-24'),
  };

  const existing = await db
    .select()
    .from(defects)
    .where(eq(defects.id, defectData.id))
    .limit(1);

  if (existing.length === 0) {
    await db.insert(defects).values(defectData);
    console.log(`Created ${defectData.id}: ${defectData.title}`);
  } else {
    console.log(`${defectData.id} already exists`);
  }

  console.log('\nTest case dialog defect seeded successfully');
}

seedTestCaseDialogDefect()
  .then(() => {
    console.log('Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error seeding defect:', error);
    process.exit(1);
  });

