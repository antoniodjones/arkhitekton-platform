import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../shared/schema';

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const db = drizzle(pool, { schema });

const phase1Stories = [
  {
    id: 'US-DEFECT-001',
    title: 'Defect List View - Quality Command Center',
    description: `As a QA Engineer, I want a dedicated defect management view so that I can see all defects across projects in one place and manage quality holistically.

**Context:**
Currently, defects are hidden inside user story dialogs. This makes it impossible to:
- Get a "big picture" view of quality
- Answer questions like "How many critical security defects are open?"
- Manage defects independently from stories

**Acceptance Criteria:**
This story creates the foundation of the Quality Command Center at /plan/quality/defects.`,
    acceptanceCriteria: `Scenario: Navigate to Quality Command Center
Given I am on the Plan module
When I click the "Quality" tab in the navigation
Then I should be taken to /plan/quality/defects
And I should see a table view of all defects

Scenario: View defect list with key information
Given I am on the /plan/quality/defects page
When the page loads
Then I should see a table with columns: ID, Title, Severity, Status, Type, Assignee, Age, Story
And each row should be clickable to view defect details
And I should see pagination controls if there are more than 25 defects

Scenario: Basic filtering by severity
Given I am viewing the defect list
When I select "Critical" from the severity filter
Then I should only see defects with Critical severity
And the filter should persist if I navigate away and return

Scenario: Basic filtering by status
Given I am viewing the defect list
When I select "Open" from the status filter
Then I should only see defects with Open or In Progress status
And I should see a count of filtered results

Scenario: Quick access from story card preserved
Given I am viewing a user story
When I see the DefectBadge showing "3 open defects"
And I click on the badge
Then I should be taken to /plan/quality/defects with filters pre-applied for that story
And I should see only the defects linked to that story

Scenario: "Add Defect" button preserved on story cards
Given I am viewing a user story in the plan module
When I open the story dialog
Then I should see the existing "Log Defect" button in the Defects & Issues section
And clicking it should open the defect creation dialog
And the userStoryId should be pre-populated

Scenario: Empty state for new projects
Given I am on /plan/quality/defects
And there are no defects in the system
Then I should see an empty state message: "No defects logged yet. Quality looks good! ✨"
And I should see a "Create First Defect" button`,
    epicId: 'EPIC-3', // Quality & Compliance
    status: 'backlog',
    priority: 'high',
    storyPoints: 5,
    feature: 'Quality Command Center',
    labels: ['defect-management', 'quality', 'phase-1', 'foundation'],
    productManager: 'Product Team',
    techLead: 'Tech Lead',
  },
  {
    id: 'US-DEFECT-002',
    title: 'Defect Detail Page - Comprehensive Defect View',
    description: `As a Developer, I want to see all information about a defect in one place so that I can understand the issue, see its history, and fix it efficiently.

**Context:**
The current defect UI is minimal—just basic fields in a list. Developers need:
- Full defect history (status changes, edits)
- Linked items (story, test cases, components)
- Activity timeline
- Rich description with reproduction steps

**Acceptance Criteria:**
This story creates the dedicated defect detail page at /plan/quality/defects/:id.`,
    acceptanceCriteria: `Scenario: Navigate to defect detail page
Given I am on the defect list page
When I click on a defect row
Then I should be navigated to /plan/quality/defects/{defectId}
And I should see the full defect details

Scenario: View defect header information
Given I am viewing a defect detail page
When the page loads
Then I should see the defect ID prominently displayed
And I should see the defect title
And I should see severity badge (color-coded: Critical=red, High=orange, Medium=yellow, Low=gray)
And I should see status badge
And I should see type badge

Scenario: View defect metadata
Given I am viewing a defect detail page
Then I should see editable fields:
  - Title
  - Description (with rich text formatting)
  - Reproduction steps
  - Severity (dropdown)
  - Type (dropdown)
  - Status (dropdown)
  - Assignee (user dropdown)
  - Reported by
And I should see read-only fields:
  - Created at (timestamp)
  - Updated at (timestamp)
  - Age (e.g., "3 days old")

Scenario: View linked user story
Given I am viewing a defect detail page
And the defect is linked to a user story
When I look at the "Linked Story" section
Then I should see the story ID and title
And clicking the link should navigate to the story
And I should see the story status and priority

Scenario: Inline editing of defect fields
Given I am viewing a defect detail page
When I click on the "Status" field
Then it should become editable (dropdown)
When I select a new status and click outside
Then the status should update immediately
And I should see a success toast: "Defect updated"
And the "Last Updated" timestamp should refresh

Scenario: Activity timeline
Given I am viewing a defect detail page
When I scroll to the activity section
Then I should see a chronological timeline of:
  - Defect created event
  - Status change events (with old -> new values)
  - Field change events (who changed what, when)
  - Assignment changes
And each event should show: timestamp, user, action, and changes

Scenario: Quick actions toolbar
Given I am viewing a defect detail page
When I look at the top-right toolbar
Then I should see action buttons:
  - "Change Status" (dropdown)
  - "Assign" (user picker)
  - "Export PDF" (downloads defect as PDF)
  - "Delete" (with confirmation)
And buttons should be disabled if I don't have permission

Scenario: Breadcrumb navigation
Given I am viewing a defect detail page
When I look at the top of the page
Then I should see breadcrumbs: "Plan > Quality > Defects > DEF-001"
And clicking "Defects" should take me back to the list view
And clicking "Quality" should take me to /plan/quality (future dashboard)

Scenario: Navigate between defects
Given I am viewing a defect detail page
And there are multiple defects in the list
When I look at the header
Then I should see "Previous" and "Next" buttons
And clicking "Next" should navigate to the next defect in the filtered list
And clicking "Previous" should navigate to the previous defect`,
    epicId: 'EPIC-3',
    status: 'backlog',
    priority: 'high',
    storyPoints: 5,
    feature: 'Quality Command Center',
    labels: ['defect-management', 'quality', 'phase-1', 'detail-view'],
    productManager: 'Product Team',
    techLead: 'Tech Lead',
  },
  {
    id: 'US-DEFECT-003',
    title: 'Advanced Defect Filtering & Search',
    description: `As a QA Manager, I want advanced filtering and search capabilities so that I can quickly find specific defects and create custom views for different workflows.

**Context:**
US-DEFECT-001 provides basic single-select filters. This story adds:
- Multi-select filters (e.g., show Critical AND High severity)
- Saved filter presets (e.g., "My Critical Defects")
- Free-text search across title and description
- Compound filters (multiple criteria at once)

**Acceptance Criteria:**
This story enhances the defect list with professional-grade filtering.`,
    acceptanceCriteria: `Scenario: Multi-select severity filter
Given I am on the defect list page
When I click the "Severity" filter dropdown
Then I should see checkboxes for: Critical, High, Medium, Low
When I check "Critical" and "High"
And I click "Apply"
Then I should see only defects with Critical OR High severity
And the filter badge should show "Severity: 2 selected"

Scenario: Multi-select status filter
Given I am on the defect list page
When I click the "Status" filter dropdown
Then I should see checkboxes for: Open, In Progress, Resolved, Closed, Rejected
When I check "Open" and "In Progress"
Then I should see only defects with those statuses
And the active filter should be visible as a chip with an "X" to remove

Scenario: Filter by assignee
Given I am on the defect list page
When I click the "Assignee" filter
Then I should see a dropdown of all users who have defects assigned
And I should see an option for "Unassigned"
When I select "John Doe"
Then I should see only defects assigned to John Doe

Scenario: Filter by defect type
Given I am on the defect list page
When I click the "Type" filter
Then I should see checkboxes for: Bug, Regression, Performance, Security, Usability
When I select multiple types
Then I should see defects matching any of those types

Scenario: Date range filter
Given I am on the defect list page
When I click "Created Date" filter
Then I should see a date range picker
When I select "Last 7 days"
Then I should see only defects created in the past week
And the filter should show "Created: Last 7 days"

Scenario: Free-text search
Given I am on the defect list page
When I type "authentication" in the search box
Then I should see defects with "authentication" in the title OR description
And the search should be case-insensitive
And the search should highlight matching text in results

Scenario: Compound filters (multiple criteria)
Given I am on the defect list page
When I apply filters: Severity=Critical, Status=Open, Assignee=Me
Then I should see only defects matching ALL three criteria
And I should see active filter chips for each criterion
And I should see the result count: "Showing 5 defects"

Scenario: Clear all filters
Given I have multiple filters applied
When I click "Clear All Filters" button
Then all filters should be removed
And I should see the unfiltered defect list
And the URL query parameters should be cleared

Scenario: Save custom filter preset
Given I have applied multiple filters
When I click "Save Filter" button
And I enter preset name "My Critical Security Defects"
Then the filter preset should be saved
And I should see it in the "Saved Filters" dropdown
And the preset should remember: Severity=Critical, Type=Security, Assignee=Me

Scenario: Apply saved filter preset
Given I have a saved filter preset "My Critical Security Defects"
When I select it from the "Saved Filters" dropdown
Then all the preset filters should be applied automatically
And I should see the filtered results
And the preset name should be highlighted

Scenario: Quick filter shortcuts
Given I am on the defect list page
When I look at the top of the page
Then I should see quick filter buttons:
  - "My Defects" (assigned to me)
  - "Critical" (severity=critical)
  - "Open Security" (status=open, type=security)
  - "Needs Verification" (status=pending verification)
When I click "My Defects"
Then the filter should apply instantly

Scenario: Filter persistence in URL
Given I have applied filters
When I copy the page URL and open it in a new tab
Then the same filters should be applied
And I should see the same filtered results
(URL example: /plan/quality/defects?severity=critical&status=open)

Scenario: Sort by column
Given I am viewing the defect list
When I click on the "Age" column header
Then the list should sort by age (oldest first)
When I click again
Then the list should sort by age (newest first)
And I should see a sort indicator arrow

Scenario: Filter result count
Given I have filters applied
When the results load
Then I should see "Showing 12 of 48 defects"
And if no results match: "No defects match your filters. Clear filters to see all."`,
    epicId: 'EPIC-3',
    status: 'backlog',
    priority: 'high',
    storyPoints: 3,
    feature: 'Quality Command Center',
    labels: ['defect-management', 'quality', 'phase-1', 'filtering'],
    productManager: 'Product Team',
    techLead: 'Tech Lead',
  },
  {
    id: 'US-DEFECT-004',
    title: 'Defect Export - PDF and CSV',
    description: `As a QA Manager, I want to export defects as PDF or CSV so that I can share quality reports with stakeholders and analyze data in spreadsheets.

**Context:**
Stakeholders need defect reports for:
- Executive briefings (PDF format)
- Data analysis in Excel (CSV format)
- Audit trails
- Sprint retrospectives

The PDF export should follow the same high-quality format as the User Story PDF export (US-PRINT-001).

**Acceptance Criteria:**
This story adds export functionality to the defect list and detail views.`,
    acceptanceCriteria: `Scenario: Export single defect as PDF
Given I am viewing a defect detail page
When I click the "Export PDF" button in the toolbar
Then a PDF should be generated and downloaded
And the PDF should have a header: "Defect Report | {Defect ID} | {Severity}"
And the PDF should include:
  - Defect ID, title, severity, status, type
  - Description and reproduction steps
  - Metadata (assignee, reported by, created date, age)
  - Linked story information
  - Activity timeline
And the PDF should use the ARKHITEKTON orange theme
And the filename should be: "{DefectID}_{DefectTitle}.pdf"

Scenario: Export filtered defect list as PDF
Given I am on the defect list page
And I have filters applied (e.g., Severity=Critical, Status=Open)
When I click "Export" > "Export as PDF"
Then a PDF should be generated with all filtered defects
And the PDF should have a cover page showing:
  - Title: "Defect Report"
  - Filters applied
  - Generated date
  - Total defect count
And each defect should have:
  - ID, Title, Severity, Status, Type, Assignee, Age, Story
  - Brief description (first 200 chars)
And defects should be grouped by severity (Critical first)

Scenario: Export defect list as CSV
Given I am on the defect list page
When I click "Export" > "Export as CSV"
Then a CSV file should be downloaded
And the CSV should have columns:
  ID, Title, Description, Severity, Status, Type, Assignee, Reported By, Story ID, Story Title, Created At, Updated At, Age (days), Root Cause, Resolution
And the CSV should respect the current filters
And the filename should be: "defects_{date}.csv"

Scenario: Export all defects (no filters)
Given I am on the defect list page
And I have no filters applied
When I click "Export" > "Export as CSV"
Then I should see a confirmation: "Export all 248 defects?"
When I confirm
Then the CSV should be generated with all defects
And I should see a toast: "Exported 248 defects to CSV"

Scenario: PDF export format matches user story PDF
Given I am exporting a defect as PDF
Then the PDF should use the same visual style as US-PRINT-001:
  - ARKHITEKTON orange header (#ea580c)
  - Clean typography (Helvetica)
  - Metadata grid layout
  - Page numbers and footer
  - Professional formatting

Scenario: Export button on defect list page
Given I am on /plan/quality/defects
When I look at the toolbar
Then I should see an "Export" dropdown button with:
  - "Export as PDF" option
  - "Export as CSV" option
And the button should show the count of defects that will be exported
(e.g., "Export (12 defects)")

Scenario: Export respects permissions
Given I am a user without export permissions
When I look at the defect list or detail page
Then I should not see the "Export" button
And if I try to access the export API directly, I should get a 403 error

Scenario: Handle large exports gracefully
Given I am exporting 1000+ defects
When I click "Export as PDF"
Then I should see a loading indicator: "Generating PDF... (this may take a minute)"
And the browser should not freeze
And the PDF should be generated in chunks if necessary
And I should see a success toast when complete

Scenario: CSV export includes all data
Given I export defects as CSV
Then the CSV should include:
  - All visible columns from the table
  - Hidden metadata (root cause, resolution)
  - Linked story ID and title
  - Calculated fields (age in days)
And text fields should be properly escaped (quotes, commas, newlines)
And dates should be in ISO format: YYYY-MM-DD HH:MM:SS`,
    epicId: 'EPIC-3',
    status: 'backlog',
    priority: 'high',
    storyPoints: 2,
    feature: 'Quality Command Center',
    labels: ['defect-management', 'quality', 'phase-1', 'export', 'pdf', 'csv'],
    productManager: 'Product Team',
    techLead: 'Tech Lead',
  },
];

async function createPhase1Stories() {
  console.log('🐛 Creating Defect Management Phase 1 user stories...\n');

  for (const story of phase1Stories) {
    try {
      await db.insert(schema.userStories).values({
        id: story.id,
        title: story.title,
        description: story.description,
        acceptanceCriteria: story.acceptanceCriteria,
        epicId: story.epicId,
        status: story.status,
        priority: story.priority,
        storyPoints: story.storyPoints,
        feature: story.feature,
        labels: story.labels,
        productManager: story.productManager,
        techLead: story.techLead,
        assignee: null,
        value: null,
        requirement: null,
        githubRepo: null,
        githubBranch: null,
        githubIssue: null,
        githubCommits: [],
        screenshots: [],
        relatedFiles: [],
        documentationPageId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      console.log(`✅ Created story: ${story.id} - ${story.title}`);
    } catch (error: any) {
      console.log(`⚠️  Skipping ${story.id}: ${error.message}`);
    }
  }

  console.log('\n✨ Defect Management Phase 1 stories created successfully!');
  console.log('\n📊 Summary:');
  console.log(`- Total stories: ${phase1Stories.length}`);
  console.log(`- Epic: EPIC-3 (Quality & Compliance)`);
  console.log(`- Total story points: ${phase1Stories.reduce((sum, s) => sum + s.storyPoints, 0)}`);
  console.log(`- Feature: Quality Command Center`);
  
  console.log('\n🎯 Phase 1 Overview:');
  console.log('US-DEFECT-001: Defect List View (5 pts) - Foundation table view with pagination');
  console.log('US-DEFECT-002: Defect Detail Page (5 pts) - Comprehensive single-defect view');
  console.log('US-DEFECT-003: Advanced Filtering (3 pts) - Multi-select filters & search');
  console.log('US-DEFECT-004: Defect Export (2 pts) - PDF/CSV export functionality');
  
  console.log('\n📝 Key Design Notes:');
  console.log('1. Preserve existing "Log Defect" button in story dialog for quick creation');
  console.log('2. Update DefectBadge to link to /plan/quality/defects?storyId={id}');
  console.log('3. Add "Quality" tab to Plan navigation');
  console.log('4. Use same PDF template as User Story export (US-PRINT-001)');
  console.log('5. Route structure: /plan/quality/defects (list), /plan/quality/defects/:id (detail)');
  
  console.log('\n🚀 Next Steps:');
  console.log('1. Review stories in Plan view (/plan)');
  console.log('2. Create navigation tab for "Quality" in Plan module');
  console.log('3. Build US-DEFECT-001 first (foundation)');
  console.log('4. Update DefectBadge component to route to new module');
  console.log('5. Preserve quick-create button but update its visual design');
  
  await pool.end();
}

createPhase1Stories().catch(console.error);

