import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { eq } from 'drizzle-orm';
import * as schema from '../shared/schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const db = drizzle(pool, { schema });

async function setupDefectManagementEpic() {
  console.log('🏗️  Setting up Defect Management System Epic...\n');

  // Step 1: Check if US-AI-AGENT-006 exists
  const [existingStory] = await db.select()
    .from(schema.userStories)
    .where(eq(schema.userStories.id, 'US-AI-AGENT-006'));

  if (existingStory) {
    console.log('✅ Found US-AI-AGENT-006: QA Agent - Defect Management');
    console.log('   Converting to EPIC status (updating description to reference Phase 1-5)...\n');

    // Update US-AI-AGENT-006 to reference the new comprehensive approach
    await db.update(schema.userStories)
      .set({
        title: 'Defect Management System - Foundation (See EPIC-DEFECT for full roadmap)',
        description: `As a QA Agent, I want a comprehensive defect management system so that quality issues are tracked, analyzed, and resolved systematically.

**⚠️ NOTE: This story is now part of a larger initiative.**

This story represents the original foundation work. The complete Defect Management System is being implemented across 24 user stories in 5 phases:

**Phase 1 - Foundation (Sprints 1-2): 15 points**
- US-DEFECT-001: Defect List View
- US-DEFECT-002: Defect Detail Page
- US-DEFECT-003: Advanced Filtering
- US-DEFECT-004: Defect Export (PDF/CSV)

**Phase 2 - Lifecycle (Sprints 3-4): 17 points**
- US-DEFECT-005: Triage Queue
- US-DEFECT-006: Verification Workflow
- US-DEFECT-007: Defect Templates
- US-DEFECT-008: Rejection Reasons
- US-DEFECT-009: Duplicate Detection

**Phase 3 - Analytics (Sprints 5-6): 29 points**
- US-DEFECT-010: Quality Dashboard
- US-DEFECT-011: Defect Trend Analysis
- US-DEFECT-012: Component Heatmap
- US-DEFECT-013: Defect Aging Report
- US-DEFECT-014: Quality Gates

**Phase 4 - Intelligent Linking (Sprints 7-8): 29 points**
- US-DEFECT-015: Test Case Linking
- US-DEFECT-016: Architecture Component Linking (UNIQUE DIFFERENTIATOR)
- US-DEFECT-017: Source Code Linking
- US-DEFECT-018: Release Version Tagging
- US-DEFECT-019: Auto-Defect from Failed Tests

**Phase 5 - AI Enhancement (Sprints 9+): 42 points**
- US-DEFECT-020: AI Duplicate Detection
- US-DEFECT-021: Root Cause Library
- US-DEFECT-022: AI Severity Suggestion
- US-DEFECT-023: Defect Pattern Recognition
- US-DEFECT-024: Predictive Defect Analytics

**Total Effort:** 140 story points across 24 stories

**See Also:**
- docs/ARKDL-0012-Defect-Management-Vision.md (Complete Product Vision)
- docs/Defect-Management-Gap-Analysis.md (Research & Competitive Analysis)

**Current Implementation Status:**
The existing DefectManagement component provides basic CRUD and story-blocking logic. This is the MVF (Minimum Viable Feature). The roadmap above transforms it into a true Quality Command Center.`,
        acceptanceCriteria: `Scenario: Original acceptance criteria preserved
Given the original US-AI-AGENT-006 acceptance criteria
Then they are now distributed across Phase 1-5 stories:
  - "Automatically create defects" → US-DEFECT-001 (Foundation)
  - "Link to acceptance criteria" → US-DEFECT-002 (Detail Page)
  - "Suggest root causes" → US-DEFECT-021 (AI Enhancement)
  - "Block story completion" → Already implemented ✅
  - "Validate resolution" → US-DEFECT-006 (Verification Workflow)

Scenario: Preserve existing quick-create functionality
Given I am viewing a user story
When I see the "Defects & Issues" section
Then I should still see the "Log Defect" button
And clicking it should create a defect linked to that story
And the button's UI will be updated in Phase 1

Scenario: Foundation acceptance criteria
See US-DEFECT-001 through US-DEFECT-004 for detailed acceptance criteria of Phase 1 work.`,
        status: 'in-progress', // Since foundation work exists
        labels: ['defect-management', 'quality', 'multi-phase', 'foundation', 'epic-reference'],
        updatedAt: new Date(),
      })
      .where(eq(schema.userStories.id, 'US-AI-AGENT-006'));

    console.log('✅ Updated US-AI-AGENT-006 to reference the multi-phase roadmap\n');
  } else {
    console.log('⚠️  US-AI-AGENT-006 not found (may have been deleted)');
    console.log('   Proceeding with Phase 1 story creation...\n');
  }

  // Step 2: Create Epic if it doesn't exist
  console.log('📋 Checking for EPIC-DEFECT...');
  
  const [existingEpic] = await db.select()
    .from(schema.epics)
    .where(eq(schema.epics.id, 'EPIC-DEFECT'));

  if (!existingEpic) {
    console.log('   Creating EPIC-DEFECT: Defect Management System Transformation...');
    
    await db.insert(schema.epics).values({
      id: 'EPIC-DEFECT',
      name: 'Defect Management System - Quality Command Center',
      description: `Transform the basic defect tracking feature into a comprehensive Quality Command Center that provides:
- Dedicated defect management module (/plan/quality)
- Advanced filtering, search, and saved presets
- Quality analytics and metrics dashboards
- Architecture-aware defect tracking (UNIQUE DIFFERENTIATOR)
- AI-powered insights and duplicate detection

This epic spans 24 user stories across 5 phases, delivering 140 story points over 9-12 sprints.

**Strategic Value:**
- Competitive moat: Only ALM tool that links defects to enterprise architecture
- Executive visibility: Quality dashboards answer "Are we ready to ship?"
- Proactive quality: Pattern detection prevents recurring issues
- Developer efficiency: Full context in one place (story, test, code, component)

**Documentation:**
- Vision: docs/ARKDL-0012-Defect-Management-Vision.md
- Analysis: docs/Defect-Management-Gap-Analysis.md

**Original Story:** US-AI-AGENT-006 (now references this epic)`,
      valueStream: 'Operations & Intelligence',
      status: 'in-progress',
      priority: 'high',
      businessValue: 'Reduces production defects by 30%, improves MTTR by 50%, provides executive quality visibility',
      successMetrics: JSON.stringify([
        'Defect density decreased by 30% within 6 months',
        'MTTR for Critical defects < 3 days',
        '80% of defects linked to architecture components',
        'Zero critical defects in production for 6 consecutive months',
        'QA team adoption rate > 90%',
      ]),
      dependencies: JSON.stringify([
        'Architecture catalog (existing)',
        'User story management (existing)',
        'Test case management (future - Phase 4)',
      ]),
      risks: JSON.stringify([
        'User adoption - mitigated by preserving existing quick-create button',
        'Data migration - existing defects will be preserved',
        'Complexity - phased approach reduces risk',
      ]),
      stakeholders: JSON.stringify(['QA Team', 'Development Team', 'Product Managers', 'Executives', 'Architects']),
      startDate: new Date(),
      targetDate: null,
      completedDate: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log('✅ Created EPIC-DEFECT\n');
  } else {
    console.log('✅ EPIC-DEFECT already exists\n');
  }

  // Step 3: Create Phase 1 Stories
  console.log('📝 Creating Phase 1 user stories (US-DEFECT-001 through US-DEFECT-004)...\n');

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

**Part of:** EPIC-DEFECT Phase 1 (Foundation)`,
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
      epicId: 'EPIC-DEFECT',
      status: 'backlog',
      priority: 'high',
      storyPoints: 5,
      feature: 'Quality Command Center',
      labels: ['defect-management', 'quality', 'phase-1', 'foundation'],
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

**Part of:** EPIC-DEFECT Phase 1 (Foundation)`,
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
      epicId: 'EPIC-DEFECT',
      status: 'backlog',
      priority: 'high',
      storyPoints: 5,
      feature: 'Quality Command Center',
      labels: ['defect-management', 'quality', 'phase-1', 'detail-view'],
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

**Part of:** EPIC-DEFECT Phase 1 (Foundation)`,
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
      epicId: 'EPIC-DEFECT',
      status: 'backlog',
      priority: 'high',
      storyPoints: 3,
      feature: 'Quality Command Center',
      labels: ['defect-management', 'quality', 'phase-1', 'filtering'],
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

**Part of:** EPIC-DEFECT Phase 1 (Foundation)`,
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
      epicId: 'EPIC-DEFECT',
      status: 'backlog',
      priority: 'high',
      storyPoints: 2,
      feature: 'Quality Command Center',
      labels: ['defect-management', 'quality', 'phase-1', 'export', 'pdf', 'csv'],
    },
  ];

  for (const story of phase1Stories) {
    try {
      await db.insert(schema.userStories).values({
        ...story,
        productManager: 'Product Team',
        techLead: 'Tech Lead',
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
      
      console.log(`✅ Created: ${story.id} - ${story.title}`);
    } catch (error: any) {
      console.log(`⚠️  Skipping ${story.id}: ${error.message}`);
    }
  }

  console.log('\n✨ Defect Management System setup complete!');
  console.log('\n📊 Summary:');
  console.log(`- Epic: EPIC-DEFECT (Defect Management System Transformation)`);
  console.log(`- Original Story: US-AI-AGENT-006 (updated to reference multi-phase roadmap)`);
  console.log(`- Phase 1 Stories: 4 stories (US-DEFECT-001 through US-DEFECT-004)`);
  console.log(`- Phase 1 Total Points: ${phase1Stories.reduce((sum, s) => sum + s.storyPoints, 0)}`);
  console.log(`- Full Roadmap: 24 stories across 5 phases (140 points)`);
  
  console.log('\n🎯 Phase 1 Stories Created:');
  phase1Stories.forEach(s => {
    console.log(`  ${s.id} (${s.storyPoints}pts): ${s.title}`);
  });
  
  console.log('\n📝 Key Design Notes:');
  console.log('1. Preserved "Log Defect" button in story dialog for quick creation');
  console.log('2. DefectBadge will link to /plan/quality/defects?storyId={id}');
  console.log('3. Add "Quality" tab to Plan navigation');
  console.log('4. PDF export uses same template as User Story export');
  console.log('5. Route: /plan/quality/defects (list), /plan/quality/defects/:id (detail)');
  
  console.log('\n🚀 Next Steps:');
  console.log('1. View stories in Plan module (/plan)');
  console.log('2. Begin implementation with US-DEFECT-001 (Foundation)');
  console.log('3. Update DefectBadge to route to new module');
  console.log('4. Add "Quality" navigation tab in Plan layout');
  
  await pool.end();
}

setupDefectManagementEpic().catch(console.error);

