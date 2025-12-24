import { db } from '../server/db';
import { defects, epics, userStories } from '../shared/schema';
import { eq } from 'drizzle-orm';

async function seedQualityCenterDefects() {
  console.log('🐛 Seeding Quality Center UI Defects...\n');

  // Ensure parent epic exists
  const epicId = 'EPIC-QC-001';
  let epic = await db.query.epics.findFirst({ where: eq(epics.id, epicId) });
  if (!epic) {
    console.log(`Creating epic: ${epicId}...`);
    await db.insert(epics).values({
      id: epicId,
      name: 'Quality Center: Defect Management',
      description: 'Full-featured defect tracking and quality management system for tracking bugs, regressions, and quality issues across all modules.',
      valueStream: 'Quality & Testing',
      status: 'in-progress',
      priority: 'high',
      createdAt: new Date('2025-12-24T11:00:00Z'),
      updatedAt: new Date('2025-12-24T11:00:00Z'),
    });
    console.log(`✅ Created epic: ${epicId}\n`);
  } else {
    console.log(`ℹ️  Epic already exists: ${epicId}\n`);
  }

  // Ensure parent user story exists
  const userStoryId = 'US-QC-001';
  let userStory = await db.query.userStories.findFirst({ where: eq(userStories.id, userStoryId) });
  if (!userStory) {
    console.log(`Creating user story: ${userStoryId}...`);
    await db.insert(userStories).values({
      id: userStoryId,
      epicId: epicId,
      title: 'Defect Detail View and Management',
      description: `As a quality engineer, I need to view detailed information about defects including descriptions, root causes, resolutions, and linked stories, so that I can effectively track, diagnose, and resolve quality issues.`,
      acceptanceCriteria: `Given I am viewing the Quality Center defect list
When I click on a specific defect
Then I should see the defect detail page with all information including:
- Title, ID, status, severity, type
- Full description with markdown support
- Root cause analysis
- Resolution details
- Linked user story with navigation link
- Timeline (created, updated, resolved dates)
- Assignment information (discovered by, assigned to)
And all fields should display their data correctly
And the page should support editing all fields
And changes should persist to the database.`,
      storyPoints: 8,
      status: 'done',
      priority: 'high',
      createdAt: new Date('2025-12-24T11:00:00Z'),
      updatedAt: new Date('2025-12-24T11:00:00Z'),
    });
    console.log(`✅ Created user story: ${userStoryId}\n`);
  } else {
    console.log(`ℹ️  User story already exists: ${userStoryId}\n`);
  }

  // Defect data
  const defectsData = [
    {
      id: 'DEF-QC-001',
      title: 'CRITICAL: Defect detail page does not unwrap API response data property',
      description: `**Location**: client/src/pages/quality/defect-detail.tsx (line 52-60)

**Issue**: The defect detail page queries /api/defects/:id which returns { data: defect }, but the query handler does not unwrap the data property before returning. This causes the entire component to receive undefined for the defect object, resulting in empty fields throughout the UI.

**Steps to Reproduce**:
1. Navigate to Quality Center → Defects
2. Click on any defect to view detail page
3. Observe that all fields are empty despite database containing data

**Expected Behavior**: Defect detail page should display all fields populated with data from the database (title, description, root cause, resolution, etc.)

**Actual Behavior**: All defect fields appear empty. Console may show "Defect not found" or fields render with placeholder text like "No description" even though data exists.

**Root Cause**: API endpoint returns \`{ data: defect }\` wrapper object, but useQuery handler returns \`response.json()\` directly without unwrapping the \`data\` property.

**Evidence**: The defects list page correctly handles this on line 78: \`const defects = defectsResponse?.data || [];\` but the detail page does not.`,
      severity: 'critical' as const,
      type: 'bug' as const,
      status: 'open' as const,
      rootCause: 'Inconsistent API response handling. The single defect endpoint was updated to return { data: defect } for consistency with list endpoints, but the detail page query handler was not updated to unwrap the data property.',
      resolution: null,
      discoveredBy: 'User Testing',
      assignedTo: null,
    },
    {
      id: 'DEF-QC-002',
      title: 'Defect list table should display defect ID, not internal database ID',
      description: `**Location**: client/src/pages/quality/defects.tsx (line 242-244)

**Issue**: The defects table "Story" column displays the userStoryId field, but there is no column showing the actual defect ID (e.g., DEF-REF-001, DEF-QC-001). Users need to see the defect ID to reference and link defects in conversations, tickets, and documentation.

**Steps to Reproduce**:
1. Navigate to Quality Center → Defects
2. Observe the table columns
3. Note that there is no "Defect ID" column visible

**Expected Behavior**: Table should have a column showing the defect ID (e.g., DEF-REF-001) prominently, ideally as the first or second column after status.

**Actual Behavior**: Defect ID is not visible in the table. Users must click into each defect to see its ID on the detail page.

**Impact**: Medium - Users can still access defects and see the ID on the detail page, but this makes it harder to quickly reference defect IDs when triaging or discussing issues in meetings.`,
      severity: 'medium' as const,
      type: 'usability' as const,
      status: 'open' as const,
      rootCause: 'Table design oversight. The original implementation prioritized showing linked story ID over the defect ID itself.',
      resolution: null,
      discoveredBy: 'User Feedback',
      assignedTo: null,
    },
    {
      id: 'DEF-QC-003',
      title: 'Defect description field does not preserve markdown formatting',
      description: `**Location**: client/src/pages/quality/defect-detail.tsx (line 244-246)

**Issue**: Defect descriptions are stored with markdown formatting (e.g., **bold**, bullet points, code blocks) but are displayed as plain text with whitespace-pre-wrap. This loses visual hierarchy and makes long descriptions harder to read.

**Steps to Reproduce**:
1. Create or view a defect with markdown in the description (e.g., **Location**, **Issue**, bullet points)
2. Observe that markdown syntax is displayed literally instead of being rendered

**Expected Behavior**: Markdown should be rendered with proper formatting: bold text, headings, lists, code blocks, etc.

**Actual Behavior**: Raw markdown syntax is displayed (e.g., **Location** shows as "**Location**" instead of bold text).

**Impact**: Medium - Information is still readable but less organized and professional-looking. Long defect descriptions become harder to scan quickly.`,
      severity: 'medium' as const,
      type: 'usability' as const,
      status: 'open' as const,
      rootCause: 'Description field uses plain <p> tag with whitespace-pre-wrap instead of a markdown renderer component.',
      resolution: null,
      discoveredBy: 'UI Review',
      assignedTo: null,
    }
  ];

  // Insert defects
  for (const defectData of defectsData) {
    const existing = await db.query.defects.findFirst({ where: eq(defects.id, defectData.id) });
    
    if (!existing) {
      console.log(`Creating defect: ${defectData.id}...`);
      await db.insert(defects).values({
        ...defectData,
        userStoryId: userStoryId,
        createdAt: new Date('2025-12-24T11:30:00Z'),
        updatedAt: new Date('2025-12-24T11:30:00Z'),
      });
      console.log(`✅ Created defect: ${defectData.id}`);
    } else {
      console.log(`ℹ️  Defect already exists: ${defectData.id}`);
    }
  }

  console.log('\n✅ All Quality Center UI defects seeded successfully!');
}

seedQualityCenterDefects()
  .then(() => {
    console.log('\n🎉 Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error:', error);
    process.exit(1);
  });

