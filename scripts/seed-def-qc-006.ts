/**
 * Create DEF-QC-006: Defect Detail Page Not Displaying Data
 */

import { db } from '../server/db';
import { defects } from '../shared/schema';
import { eq } from 'drizzle-orm';

async function seedDefectQC006() {
  console.log('🐛 Creating DEF-QC-006: Defect Detail Page Not Displaying Data\n');

  const defect = {
    id: 'DEF-QC-006',
    title: 'Defect Detail Page Not Displaying Data',
    description: `When viewing defect details in the Quality Center, all fields appear empty with placeholder text ("No description", "Not analyzed yet", "Not resolved yet") even though the data exists in the database. The description, rootCause, and resolution fields show italicized placeholder messages instead of actual content.

## Environment
- Module: Quality Center
- Page: /quality/defects/:id
- Browser: All browsers
- Severity: High (prevents users from viewing defect details)

## Impact
- QA engineers cannot view defect descriptions or reproduction steps
- Developers cannot see root cause analysis
- Team cannot view resolution details
- Defect tracking workflow is broken`,
    severity: 'high' as const,
    status: 'resolved' as const,
    priority: 'high' as const,
    userStoryId: 'US-QC-001',
    stepsToReproduce: `1. Navigate to Quality Center > Defects
2. Click on any defect from the list (e.g., DEF-SEARCH-003)
3. Observe the defect detail page
4. Look at Description section: Shows "No description" in italic gray text
5. Look at Root Cause section: Shows "Not analyzed yet" in italic gray text
6. Look at Resolution section: Shows "Not resolved yet" in italic gray text
7. All other fields (Linked Story, People, Timeline) also appear empty`,
    expectedBehavior: `The defect detail page should display:
- Full description with markdown formatting
- Detailed root cause analysis
- Complete resolution documentation
- Linked story information
- People assignments (Discovered By, Assigned To)
- Timeline information (Created, Updated dates)`,
    actualBehavior: `All fields show placeholder text instead of actual data:
- Description: "No description" (italic, muted color)
- Root Cause: "Not analyzed yet" (italic, muted color)
- Resolution: "Not resolved yet" (italic, muted color)
- Linked Story: Empty
- People: Empty dashes (—)
- Timeline: Empty dashes (—)`,
    rootCause: `API Response Unwrapping Issue

The backend API returns defect data wrapped in a \`data\` property:
\`\`\`json
{
  "data": {
    "id": "DEF-SEARCH-003",
    "title": "Global Search Returns No Results",
    "description": "When searching for commit SHAs...",
    "rootCause": "The codeChanges table is empty...",
    "resolution": "Seeded test data using scripts...",
    ...
  }
}
\`\`\`

However, the frontend React Query hook in \`defect-detail.tsx\` (line 52-60) was not unwrapping this \`data\` property:

\`\`\`typescript
queryFn: async () => {
  const response = await fetch(\`/api/defects/\${params.id}\`);
  if (!response.ok) throw new Error('Failed to fetch defect');
  return response.json(); // Returns { data: {...} }
}
\`\`\`

This caused the \`defect\` variable to be set to the entire response object instead of just the defect data, making all field accesses return \`undefined\`.

**Why it happened:**
1. API endpoint was refactored to wrap responses in \`{ data: ... }\` format
2. Frontend component was not updated to match new API contract
3. No type checking caught the mismatch
4. Manual testing only verified page loads, not actual data display`,
    resolution: `Updated the \`queryFn\` in \`client/src/pages/quality/defect-detail.tsx\` to unwrap the \`data\` property from the API response with a fallback for backward compatibility.

**Code Change (line 56-58):**
\`\`\`typescript
const result = await response.json();
return result.data || result; // Unwrap data property from API response
\`\`\`

**Files Changed:**
- \`client/src/pages/quality/defect-detail.tsx\`: Fixed API response unwrapping

**Verification:**
✅ Defect detail page now displays all fields correctly
✅ Description shows full markdown content
✅ Root Cause shows complete analysis
✅ Resolution shows fix details and verification steps
✅ People section shows discoveredBy and assignedTo values
✅ Timeline shows formatted created/updated timestamps
✅ Edit mode allows updating all fields
✅ Save functionality preserves all data

**Additional Work:**
Created comprehensive documentation guide:
- \`docs/Quality-Center-Defect-Record-Guide.md\` (500+ lines)
- Covers purpose, personas, field breakdown, best practices
- Includes quality metrics, KPIs, and common defect patterns

**Commit:** \`2f25148\`
**Related Issues:** Similar unwrapping needed in other detail pages (test cases, test suites)
**Prevention:** Add API response type checking in all detail pages`,
    discoveredBy: null,
    assignedTo: null,
    resolvedAt: new Date('2025-12-24T18:45:00Z'),
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
        createdAt: new Date('2025-12-24T17:30:00Z'),
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
    console.log(`\n✅ Successfully seeded DEF-QC-006!`);
    console.log(`\n📝 View defect at: /quality/defects/DEF-QC-006\n`);

  } catch (error) {
    console.error('❌ Error seeding defect:', error);
    process.exit(1);
  }
}

seedDefectQC006();

