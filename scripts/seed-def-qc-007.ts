/**
 * Create DEF-QC-007: Missing Analysis Fields in Defect Detail Page
 * Update existing defects with proper stepsToReproduce, expectedBehavior, actualBehavior
 */

import { db } from '../server/db';
import { defects } from '../shared/schema';
import { eq } from 'drizzle-orm';

async function seedDefectQC007() {
  console.log('🐛 Creating DEF-QC-007: Missing Analysis Fields in Defect Detail Page\n');

  const defect = {
    id: 'DEF-QC-007',
    title: 'Missing Analysis Fields in Defect Detail Page',
    description: `The defect detail page is missing three critical analysis fields that exist in the database schema but are not rendered in the UI:

1. **Steps to Reproduce** - Essential for QA to document reproduction steps
2. **Expected Behavior** - What should happen in the correct scenario
3. **Actual Behavior** - What actually happens (the bug)

Without these fields visible in the UI, users cannot:
- Document proper reproduction steps for developers
- Clearly articulate expected vs actual behavior
- Follow standard defect management best practices
- Provide complete defect analysis

## Environment
- Module: Quality Center
- Page: /quality/defects/:id
- Component: DefectDetailPage
- Severity: Medium (fields exist in DB, just not shown in UI)

## Impact
- QA engineers cannot log reproduction steps in the UI
- Developers must rely only on description field
- Defect analysis is incomplete and unstructured
- Standard defect workflow is broken`,
    severity: 'medium' as const,
    status: 'resolved' as const,
    priority: 'high' as const,
    userStoryId: 'US-QC-001',
    stepsToReproduce: `1. Navigate to Quality Center > Defects
2. Click on any defect (e.g., DEF-SEARCH-003)
3. Observe the defect detail page layout
4. Look for "Steps to Reproduce" section → NOT FOUND
5. Look for "Expected Behavior" section → NOT FOUND
6. Look for "Actual Behavior" section → NOT FOUND
7. Only see: Description, Root Cause, Resolution
8. Check database schema → Fields exist: stepsToReproduce, expectedBehavior, actualBehavior
9. Check TypeScript interface in defect-detail.tsx → Fields missing from interface`,
    expectedBehavior: `The defect detail page should display all analysis fields in this order:

1. **Description** (full width) - High-level overview
2. **Steps to Reproduce** (full width) - Numbered reproduction steps
3. **Expected Behavior** (left half) - What should happen
4. **Actual Behavior** (right half) - What actually happens
5. **Root Cause** (left half) - Why it happened
6. **Resolution** (right half) - How it was fixed

Each field should:
- Support edit mode with textarea
- Display placeholder text when empty
- Preserve whitespace/formatting
- Save data to database`,
    actualBehavior: `The defect detail page only shows:
1. Description (full width)
2. Root Cause (left half)
3. Resolution (right half)

Missing sections:
- ❌ Steps to Reproduce
- ❌ Expected Behavior
- ❌ Actual Behavior

The TypeScript interface was missing these three fields, so they were never rendered in the UI even though they exist in the database schema.`,
    rootCause: `**Incomplete TypeScript Interface**

The \`Defect\` interface in \`client/src/pages/quality/defect-detail.tsx\` (lines 28-43) was missing three fields that exist in the database schema:

\`\`\`typescript
interface Defect {
  id: string;
  userStoryId: string;
  title: string;
  description: string;
  // ... other fields ...
  rootCause: string | null;
  resolution: string | null;
  // ❌ Missing: stepsToReproduce
  // ❌ Missing: expectedBehavior
  // ❌ Missing: actualBehavior
}
\`\`\`

**Why it happened:**
1. Initial implementation focused on minimal fields (description, root cause, resolution)
2. Database schema was later enhanced with additional analysis fields
3. Frontend interface was never updated to match schema
4. No UI components were created to render these fields
5. No type checking caught the mismatch between DB schema and UI interface

**Schema vs Interface Mismatch:**
- Database has: \`steps_to_reproduce TEXT\`
- Database has: \`expected_behavior TEXT\`
- Database has: \`actual_behavior TEXT\`
- TypeScript interface: Missing all three fields`,
    resolution: `**Code Changes:**

1. **Updated TypeScript Interface** (lines 28-43):
   Added three missing fields to match database schema:
   \`\`\`typescript
   interface Defect {
     // ... existing fields ...
     stepsToReproduce: string | null;
     expectedBehavior: string | null;
     actualBehavior: string | null;
     rootCause: string | null;
     resolution: string | null;
   }
   \`\`\`

2. **Added UI Sections** (after Description, before Root Cause):
   
   **Steps to Reproduce** (full width):
   - Card with "Steps to Reproduce" title
   - Textarea with 5 rows in edit mode
   - Placeholder: "1. Navigate to...\\n2. Click on...\\n3. Observe..."
   - Displays with whitespace preservation
   
   **Expected Behavior** (left half):
   - Card with "Expected Behavior" title
   - Textarea with 4 rows in edit mode
   - Placeholder: "What should happen..."
   - Side-by-side with Actual Behavior
   
   **Actual Behavior** (right half):
   - Card with "Actual Behavior" title
   - Textarea with 4 rows in edit mode
   - Placeholder: "What actually happens..."
   - Side-by-side with Expected Behavior

3. **Layout Flow:**
   - Description (full width)
   - Steps to Reproduce (full width)
   - Expected Behavior + Actual Behavior (side-by-side)
   - Root Cause + Resolution (side-by-side)

**Files Changed:**
- \`client/src/pages/quality/defect-detail.tsx\`:
  * Added 3 fields to Defect interface
  * Added 3 new Card sections with edit/view modes
  * Maintained consistent styling and placeholders
  * Grid layout for side-by-side fields

**Verification:**
✅ All three fields now visible in defect detail page
✅ Edit mode allows updating all fields
✅ Placeholders show when fields are empty
✅ Data persists to database on save
✅ Whitespace/formatting preserved in display mode
✅ Layout follows standard defect workflow order

**Commit:** \`9154cfa\`
**Related:** US-QC-001, DEF-QC-006, EPIC-QC-001`,
    discoveredBy: 'antoniodjones',
    assignedTo: 'antoniodjones',
    resolvedAt: new Date('2025-12-24T19:15:00Z'),
  };

  try {
    const existing = await db
      .select()
      .from(defects)
      .where(eq(defects.id, defect.id))
      .limit(1);

    if (existing.length > 0) {
      console.log(`⚠️  Defect ${defect.id} already exists. Updating...\n`);
      
      await db
        .update(defects)
        .set({
          ...defect,
          updatedAt: new Date(),
        })
        .where(eq(defects.id, defect.id));
    } else {
      console.log(`✅ Creating defect: ${defect.id}\n`);
      
      await db.insert(defects).values({
        ...defect,
        createdAt: new Date('2025-12-24T18:50:00Z'),
        updatedAt: new Date(),
      });
    }

    console.log(`   🐛 ${defect.id}`);
    console.log(`   📋 ${defect.title}`);
    console.log(`   🔥 Severity: ${defect.severity}`);
    console.log(`   📊 Priority: ${defect.priority}`);
    console.log(`   🔗 User Story: ${defect.userStoryId}`);
    console.log(`   ✅ Status: ${defect.status}`);
    console.log(`   🎯 Resolved At: ${defect.resolvedAt?.toISOString()}`);
    console.log(`\n✅ Successfully seeded DEF-QC-007!`);
    console.log(`\n📝 View defect at: /quality/defects/DEF-QC-007\n`);

  } catch (error) {
    console.error('❌ Error seeding defect:', error);
    process.exit(1);
  }
}

seedDefectQC007();

