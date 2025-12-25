/**
 * Seed user stories for Defect ID column feature
 * 
 * Product Requirement: Add DEFECT column to defects list page
 */

import { db } from '../server/db';
import { userStories, epics } from '../shared/schema';
import { eq } from 'drizzle-orm';

async function seedDefectIdColumnStories() {
  console.log('📝 Seeding Defect ID Column user stories...\n');

  // Verify parent epic exists
  const epic = await db
    .select()
    .from(epics)
    .where(eq(epics.id, 'EPIC-QC-001'))
    .limit(1);

  if (epic.length === 0) {
    console.error('❌ Parent epic EPIC-QC-001 not found. Please create it first.');
    process.exit(1);
  }

  console.log(`✅ Found parent epic: ${epic[0].name}\n`);

  // Product User Story
  const productStory = {
    id: 'US-QC-015',
    epicId: 'EPIC-QC-001',
    title: 'Display Defect ID in Defects List',
    description: `**As a** QA Engineer or Developer
**I want** to see the defect ID prominently displayed in the defects list
**So that** I can quickly identify, reference, and communicate about specific defects

### Background
Currently, the defects list page does not display the unique defect identifier (e.g., DEF-QC-001) in a dedicated column, making it difficult for users to reference specific defects in discussions, reports, or traceability documentation.

### Business Value
- **Improved Communication**: Teams can reference defects by ID in meetings, emails, and documentation
- **Better Traceability**: Defect IDs can be linked to commits, user stories, and test cases
- **Enhanced Searchability**: Users can search for specific defects by ID
- **Professional Standards**: Industry-standard defect tracking includes visible defect identifiers

### User Impact
- QA Engineers need to copy defect IDs for test reports and status updates
- Developers reference defect IDs in commit messages and code reviews
- Product Managers track defects by ID in release notes and stakeholder communications
- Support teams reference defect IDs when communicating with customers`,
    acceptanceCriteria: `**Scenario 1: Defect ID Column Display**
Given I am viewing the defects list page in Quality Center
When the page loads
Then I should see a "DEFECT" column as the first column in the table
And each row should display its unique defect ID (e.g., "DEF-QC-001")
And the defect ID should be left-aligned in the column
And the column header should read "DEFECT" or "ID"

**Scenario 2: Defect ID Formatting**
Given I am viewing the defects list
When I see a defect ID in the DEFECT column
Then the ID should follow the format: [PREFIX]-[MODULE]-[NUMBER]
And the ID should use a monospace font for better readability
And the ID should be clearly visible with appropriate contrast

**Scenario 3: Defect ID as Primary Identifier**
Given I am viewing a defect row in the list
When I need to identify a specific defect
Then the defect ID should be the primary way to uniquely identify the defect
And the ID should be displayed before the title/description columns
And the ID should remain visible when scrolling horizontally (if applicable)

**Scenario 4: Clickable Defect ID**
Given I am viewing the defects list
When I click on a defect ID in the DEFECT column
Then I should navigate to the defect detail page
And the defect ID should be visually indicated as clickable (e.g., underline on hover)
And the cursor should change to pointer on hover

**Scenario 5: Defect ID in Empty State**
Given there are no defects in the current view
When I see the empty state message
Then the DEFECT column header should still be visible
And the empty state should explain that no defects match the current filters

**Scenario 6: Responsive Behavior**
Given I am viewing the defects list on a smaller screen
When the table adjusts for mobile/tablet view
Then the DEFECT column should remain visible
And the defect ID should not be truncated
And the column should have appropriate width on all screen sizes`,
    priority: 'high',
    status: 'todo',
    storyPoints: 5,
    createdAt: new Date(),
  };

  // Implementation User Story
  const implementationStory = {
    id: 'US-QC-IMPL-015',
    epicId: 'EPIC-QC-001',
    title: '[IMPL] Add Defect ID Column to Defects Table Component',
    description: `**Technical Implementation**
Add a "DEFECT" column as the first column in the defects list table to display the unique defect identifier.

### Technical Requirements

**1. Database Query Updates**
- Ensure defect ID is included in the SELECT query for defects list
- Verify ID field is not null and follows correct format

**2. Frontend Component Changes**
**File**: \`client/src/pages/quality/defects.tsx\`
- Add new column definition to table configuration
- Position DEFECT column as the first column (leftmost)
- Apply monospace font styling for defect IDs

**3. Column Configuration**
\`\`\`typescript
{
  header: "DEFECT",
  accessorKey: "id",
  cell: ({ row }) => (
    <Link
      to={\`/quality/defects/\${row.original.id}\`}
      className="font-mono text-sm text-blue-600 hover:text-blue-800 hover:underline"
    >
      {row.original.id}
    </Link>
  ),
  size: 140, // Fixed width for consistent display
}
\`\`\`

**4. Styling Requirements**
- Use \`font-mono\` class for defect IDs
- Apply link styling (blue color, underline on hover)
- Ensure sufficient contrast ratio (WCAG AA)
- Fixed column width to prevent layout shifts

**5. Accessibility**
- Ensure defect ID links have proper ARIA labels
- Maintain keyboard navigation support
- Ensure screen reader compatibility

**6. Testing Checklist**
- [ ] Defect ID displays correctly in first column
- [ ] Click on defect ID navigates to detail page
- [ ] Monospace font applied to IDs
- [ ] Hover state shows underline
- [ ] Column width consistent across different data
- [ ] Responsive behavior on mobile/tablet
- [ ] Empty state shows column header
- [ ] Sorting works on defect ID column (if enabled)
- [ ] Accessibility standards met

**7. Edge Cases**
- Handle null or missing defect IDs gracefully
- Truncate very long IDs with ellipsis if needed
- Ensure column remains visible when horizontal scrolling`,
    acceptanceCriteria: `**Technical Acceptance Criteria**

1. **Column Definition Added**
   - DEFECT column added to table columns array
   - Column positioned as first column (index 0)
   - accessorKey set to "id"

2. **Rendering Implemented**
   - Defect ID renders as clickable link
   - Link uses \`/quality/defects/:id\` route
   - Monospace font applied (\`font-mono\`)

3. **Styling Applied**
   - Text color: \`text-blue-600\`
   - Hover color: \`text-blue-800\`
   - Hover decoration: \`hover:underline\`
   - Font size: \`text-sm\`

4. **Column Sizing**
   - Fixed width: 140px
   - No truncation of standard defect IDs
   - Consistent spacing maintained

5. **Navigation Works**
   - Click navigates to defect detail page
   - Browser back button works correctly
   - Cmd/Ctrl+Click opens in new tab

6. **Code Quality**
   - TypeScript types updated if needed
   - No console errors or warnings
   - Linter passes with no new issues
   - Follows existing code patterns`,
    priority: 'high',
    status: 'todo',
    storyPoints: 3,
    parentStoryId: 'US-QC-015',
    createdAt: new Date(),
  };

  // Insert product story
  const existingProduct = await db
    .select()
    .from(userStories)
    .where(eq(userStories.id, productStory.id))
    .limit(1);

  if (existingProduct.length === 0) {
    await db.insert(userStories).values(productStory);
    console.log(`✅ Created ${productStory.id}: ${productStory.title}`);
  } else {
    console.log(`⚠️  ${productStory.id} already exists, skipping...`);
  }

  // Insert implementation story
  const existingImpl = await db
    .select()
    .from(userStories)
    .where(eq(userStories.id, implementationStory.id))
    .limit(1);

  if (existingImpl.length === 0) {
    await db.insert(userStories).values(implementationStory);
    console.log(`✅ Created ${implementationStory.id}: ${implementationStory.title}`);
  } else {
    console.log(`⚠️  ${implementationStory.id} already exists, skipping...`);
  }

  console.log('\n📊 Summary:');
  console.log(`   Product Story: US-QC-015 (5 points)`);
  console.log(`   Implementation Story: US-QC-IMPL-015 (3 points)`);
  console.log(`   Total Story Points: 8`);
  console.log(`   Epic: EPIC-QC-001 (Quality Center)`);
  console.log('\n✅ Defect ID column stories seeded successfully!\n');
}

seedDefectIdColumnStories()
  .then(() => {
    console.log('🎉 Script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error seeding stories:', error);
    process.exit(1);
  });

