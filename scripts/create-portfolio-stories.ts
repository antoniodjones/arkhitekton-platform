/**
 * Portfolio Management Module - User Stories with Gherkin Scenarios
 * 
 * Creates 78 comprehensive user stories for Portfolio Management across 6 sub-epics:
 * 1. Foundation & CRUD (12 stories)
 * 2. Detail Views & Navigation (14 stories)
 * 3. Analytics & Dashboards (12 stories)
 * 4. Integrations & Dependencies (14 stories)
 * 5. Governance & Workflows (12 stories)
 * 6. AI & Intelligence (10 stories)
 * + Buffer: Polish & Accessibility (4 stories)
 * 
 * Run with: npx tsx scripts/create-portfolio-stories.ts
 */

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

// ============================================================================
// EPIC DEFINITION
// ============================================================================

const PORTFOLIO_EPIC = {
  id: 'EPIC-PORTFOLIO',
  name: 'Portfolio Management System',
  description: `Enterprise Portfolio Management module consolidating Application Portfolio Management (APM/CMDB) 
with Strategic Initiative tracking and Dependency visualization.

**Business Value:**
- Single source of truth for application inventory and strategic programs
- Enable data-driven investment decisions through initiative analytics
- Reduce risk through dependency and impact analysis
- Improve governance with approval workflows and audit trails

**Key Capabilities:**
- Applications: CMDB-style inventory with lifecycle, costs, and technology stack
- Initiatives: Strategic program tracking with budgets, milestones, and KPIs
- Dependencies: Cross-reference matrix showing initiative-application relationships

**Target Users:**
- Enterprise Architects
- Portfolio Managers
- Program Managers
- Technology Owners
- Executive Leadership`,
  status: 'planned',
  priority: 'high',
  valueStream: 'Enterprise Architecture',
  targetQuarter: 'Q1 2025',
  owner: 'Enterprise Architecture Team',
};

// ============================================================================
// SUB-EPIC 1: FOUNDATION & CRUD (12 stories)
// ============================================================================

const FOUNDATION_STORIES = [
  {
    id: 'US-PORT-001',
    title: 'Initiative CRUD Validation & Error Handling',
    storyPoints: 5,
    priority: 'high',
    description: `As a **Portfolio Manager**,
I want comprehensive validation and error handling when creating/editing initiatives,
So that data integrity is maintained and users receive clear feedback on input errors.

**Acceptance Criteria:**
- All required fields are validated before submission
- Clear error messages appear next to invalid fields
- Form prevents submission until all validation passes
- Server-side validation provides consistent error responses
- Validation rules match business requirements

**Gherkin Scenarios:**

\`\`\`gherkin
Feature: Initiative CRUD Validation
  As a Portfolio Manager
  I want proper validation when managing initiatives
  So that only valid data enters the system

  Background:
    Given I am logged in as a Portfolio Manager
    And I am on the Initiatives tab

  Scenario: Validate required fields on initiative creation
    Given I click the "Add Initiative" button
    When I try to submit the form without filling required fields
    Then I should see validation errors for:
      | field | message |
      | name  | Initiative name is required |
    And the form should not be submitted
    And focus should move to the first invalid field

  Scenario: Validate budget is a positive number
    Given I am creating a new initiative
    When I enter "-50000" in the budget field
    And I try to submit the form
    Then I should see an error "Budget must be a positive number"
    And the budget field should be highlighted in red

  Scenario: Validate date range consistency
    Given I am creating a new initiative
    When I set the start date to "2025-06-01"
    And I set the target date to "2025-01-01"
    And I try to submit the form
    Then I should see an error "Target date must be after start date"

  Scenario: Handle server-side validation errors gracefully
    Given I am creating a new initiative with valid data
    When the server returns a validation error for duplicate name
    Then I should see a toast notification with the error message
    And the form should remain open with data preserved
    And the name field should be highlighted

  Scenario: Successfully create initiative with all valid data
    Given I fill in all required fields with valid data:
      | field | value |
      | name | Digital Transformation 2025 |
      | type | digital_transformation |
      | priority | high |
      | status | planning |
    When I click "Create Initiative"
    Then the initiative should be created successfully
    And I should see a success toast notification
    And the new initiative should appear in the list
\`\`\``,
  },
  {
    id: 'US-PORT-002',
    title: 'Application Technology Stack Editor',
    storyPoints: 8,
    priority: 'high',
    description: `As a **Technology Owner**,
I want to manage the technology stack of an application with a structured editor,
So that I can accurately document frontend, backend, database, and infrastructure technologies.

**Acceptance Criteria:**
- Multi-select chips for each technology category
- Autocomplete suggestions from common technologies
- Custom technology entry support
- Visual grouping by category (frontend, backend, database, infrastructure, third-party)
- Technology icons where available

**Gherkin Scenarios:**

\`\`\`gherkin
Feature: Application Technology Stack Editor
  As a Technology Owner
  I want to edit application technology stacks
  So that I can maintain accurate technology documentation

  Background:
    Given I am logged in as a Technology Owner
    And I am editing application "Customer Portal"

  Scenario: Add frontend technology with autocomplete
    Given I am in the Technology Stack section
    When I click on the Frontend technologies field
    And I type "React"
    Then I should see autocomplete suggestions including "React", "React Native"
    When I select "React"
    Then "React" should appear as a chip in the Frontend section
    And the React icon should be displayed on the chip

  Scenario: Add multiple technologies to a category
    Given I have "React" in the Frontend section
    When I add "TypeScript" to the Frontend section
    And I add "Tailwind CSS" to the Frontend section
    Then all three technologies should appear as chips
    And they should be displayed in alphabetical order

  Scenario: Remove a technology from the stack
    Given the Frontend section contains "React", "TypeScript", "Vue.js"
    When I click the remove button on "Vue.js"
    Then "Vue.js" should be removed from the list
    And only "React" and "TypeScript" should remain

  Scenario: Add custom technology not in suggestions
    Given I am in the Backend technologies field
    When I type "InternalFramework v2"
    And no autocomplete suggestions match
    And I press Enter
    Then "InternalFramework v2" should be added as a custom technology
    And it should appear with a generic technology icon

  Scenario: Save technology stack changes
    Given I have modified the technology stack
    When I click "Save Changes"
    Then the application should be updated with the new stack
    And I should see a success notification
    And the technology stack should persist on page refresh
\`\`\``,
  },
  {
    id: 'US-PORT-003',
    title: 'Application Integration Manager',
    storyPoints: 8,
    priority: 'high',
    description: `As an **Enterprise Architect**,
I want to document and manage integrations for each application,
So that I can understand data flows and system dependencies.

**Acceptance Criteria:**
- Add/edit/remove integrations for an application
- Specify integration direction (inbound, outbound, bidirectional)
- Define integration type (API, file transfer, database, message queue, etc.)
- Link to other applications in the portfolio
- Visual integration diagram

**Gherkin Scenarios:**

\`\`\`gherkin
Feature: Application Integration Manager
  As an Enterprise Architect
  I want to manage application integrations
  So that I can document system interconnections

  Background:
    Given I am logged in as an Enterprise Architect
    And I am viewing application "Order Management System"
    And I navigate to the Integrations tab

  Scenario: Add a new outbound API integration
    Given I click "Add Integration"
    When I fill in the integration details:
      | field | value |
      | name | Payment Processing |
      | type | REST API |
      | direction | outbound |
      | target | Payment Gateway |
      | description | Order payment submission |
    And I click "Save Integration"
    Then the integration should appear in the integrations list
    And it should show an outbound arrow icon
    And the integration count should increase by 1

  Scenario: Edit an existing integration
    Given the application has an integration "Inventory Sync"
    When I click edit on "Inventory Sync"
    And I change the direction from "bidirectional" to "inbound"
    And I save the changes
    Then the integration should show an inbound arrow icon
    And the changes should be persisted

  Scenario: Delete an integration with confirmation
    Given the application has 3 integrations
    When I click delete on "Legacy CRM Sync"
    Then I should see a confirmation dialog
    When I confirm the deletion
    Then "Legacy CRM Sync" should be removed
    And the integration count should be 2

  Scenario: Link integration to another portfolio application
    Given I am adding a new integration
    When I select "Target Application" field
    Then I should see a dropdown of all applications in the portfolio
    When I select "Customer Portal"
    Then the integration should be linked to "Customer Portal"
    And it should appear in Customer Portal's integrations as well

  Scenario: View integration diagram
    Given the application has 5 integrations
    When I click "View Diagram"
    Then I should see a visual diagram showing:
      | element | display |
      | current app | center node |
      | integrations | connected nodes |
      | arrows | direction indicators |
    And I should be able to zoom and pan the diagram
\`\`\``,
  },
  {
    id: 'US-PORT-004',
    title: 'Milestone Management for Initiatives',
    storyPoints: 5,
    priority: 'high',
    description: `As a **Program Manager**,
I want to create, edit, and track milestones within an initiative,
So that I can monitor progress against key deliverables.

**Acceptance Criteria:**
- Add milestones with name, target date, and status
- Edit existing milestones inline
- Delete milestones with confirmation
- Milestone status options: not_started, in_progress, completed, at_risk
- Visual timeline of milestones
- Overdue milestone highlighting

**Gherkin Scenarios:**

\`\`\`gherkin
Feature: Initiative Milestone Management
  As a Program Manager
  I want to manage initiative milestones
  So that I can track progress against key deliverables

  Background:
    Given I am logged in as a Program Manager
    And I am viewing initiative "Customer Platform Modernization"
    And I am on the Milestones section

  Scenario: Add a new milestone
    Given I click "Add Milestone"
    When I enter milestone details:
      | field | value |
      | name | MVP Release |
      | targetDate | 2025-03-15 |
      | status | not_started |
    And I save the milestone
    Then the milestone should appear in the list
    And it should show "Not Started" status badge
    And the timeline should update to include this milestone

  Scenario: Update milestone status to completed
    Given there is a milestone "Requirements Complete" with status "in_progress"
    When I change the status to "completed"
    Then the milestone should show a green checkmark
    And the completion date should be set to today
    And the initiative progress should recalculate

  Scenario: Mark milestone as at risk
    Given there is a milestone "User Testing" with status "in_progress"
    And the target date is in 3 days
    When I change the status to "at_risk"
    Then the milestone should show a red warning indicator
    And it should appear in the initiative health assessment

  Scenario: Highlight overdue milestones
    Given there is a milestone with target date in the past
    And the status is not "completed"
    Then the milestone should be highlighted in red
    And an "Overdue" badge should be displayed
    And it should affect the initiative health status

  Scenario: Reorder milestones by drag and drop
    Given there are 4 milestones in the list
    When I drag "Production Rollout" above "User Testing"
    Then the order should be updated
    And the timeline visualization should reflect the new order
\`\`\``,
  },
  {
    id: 'US-PORT-005',
    title: 'KPI Management for Initiatives',
    storyPoints: 5,
    priority: 'high',
    description: `As a **Portfolio Manager**,
I want to define and track KPIs for each initiative,
So that I can measure success against defined metrics.

**Acceptance Criteria:**
- Add KPIs with name, target value, current value, and unit
- Visual progress indicator (gauge or bar)
- KPI trend over time
- Red/yellow/green status based on target achievement
- Aggregate KPI dashboard

**Gherkin Scenarios:**

\`\`\`gherkin
Feature: Initiative KPI Management
  As a Portfolio Manager
  I want to manage initiative KPIs
  So that I can measure and track success metrics

  Background:
    Given I am logged in as a Portfolio Manager
    And I am viewing initiative "Zero Trust Security"
    And I am on the KPIs section

  Scenario: Add a new KPI
    Given I click "Add KPI"
    When I enter KPI details:
      | field | value |
      | name | Security Incidents |
      | target | 5 |
      | current | 12 |
      | unit | per month |
    And I save the KPI
    Then the KPI should appear in the list
    And it should show a red status (current > target for reduction KPI)
    And a progress bar should show 42% to target

  Scenario: Update KPI current value
    Given there is a KPI "Compliance Score" with current value 78
    When I update the current value to 85
    Then the progress indicator should update
    And the status should change from yellow to green
    And the update timestamp should be recorded

  Scenario: View KPI trend chart
    Given the KPI "Response Time" has historical values
    When I click on the trend icon
    Then I should see a line chart showing values over time
    And the target line should be displayed
    And I should see the trend direction indicator

  Scenario: KPI affects initiative health
    Given 3 out of 5 KPIs are showing red status
    When I view the initiative summary
    Then the initiative health should show "Yellow"
    And the health tooltip should reference KPI performance

  Scenario: Delete a KPI with historical data
    Given there is a KPI with 6 months of historical data
    When I click delete on the KPI
    Then I should see a warning about data loss
    When I confirm deletion
    Then the KPI and its history should be removed
\`\`\``,
  },
  {
    id: 'US-PORT-006',
    title: 'Stakeholder Management',
    storyPoints: 5,
    priority: 'medium',
    description: `As a **Program Manager**,
I want to manage stakeholders for initiatives and applications,
So that I can track who is involved and their roles.

**Acceptance Criteria:**
- Add stakeholders with name/team and role
- Role suggestions (Sponsor, Owner, Contributor, Reviewer, etc.)
- Link to user directory if available
- Stakeholder communication preferences
- RACI matrix view

**Gherkin Scenarios:**

\`\`\`gherkin
Feature: Stakeholder Management
  As a Program Manager
  I want to manage stakeholders
  So that I can track involvement and responsibilities

  Background:
    Given I am logged in as a Program Manager
    And I am viewing initiative "Data Platform Consolidation"

  Scenario: Add a stakeholder with role
    Given I am in the Stakeholders section
    When I click "Add Stakeholder"
    And I search for "Sarah Chen"
    And I select the role "Executive Sponsor"
    And I save the stakeholder
    Then "Sarah Chen" should appear with "Executive Sponsor" role
    And she should be notified of her assignment

  Scenario: Update stakeholder role
    Given "Michael Torres" is listed as "Contributor"
    When I change his role to "Program Manager"
    Then the role should be updated
    And the change should be logged in the audit trail

  Scenario: View RACI matrix
    Given the initiative has 8 stakeholders with various roles
    When I click "View RACI Matrix"
    Then I should see a matrix with:
      | stakeholder | Responsible | Accountable | Consulted | Informed |
    And checkmarks should indicate each stakeholder's RACI assignment

  Scenario: Remove stakeholder with reassignment
    Given "John Smith" is the only "Technical Lead"
    When I try to remove "John Smith"
    Then I should see a warning about required role coverage
    And I should be prompted to assign another Technical Lead

  Scenario: Filter stakeholders by role
    Given there are 12 stakeholders
    When I filter by role "Reviewer"
    Then only stakeholders with "Reviewer" role should be displayed
\`\`\``,
  },
  {
    id: 'US-PORT-007',
    title: 'Bulk Delete Operations',
    storyPoints: 3,
    priority: 'medium',
    description: `As a **Portfolio Administrator**,
I want to delete multiple entities at once,
So that I can efficiently clean up obsolete data.

**Acceptance Criteria:**
- Multi-select checkboxes on list views
- Bulk delete button appears when items selected
- Confirmation dialog with count and impact warning
- Cascade delete handling for dependencies
- Undo option within time window

**Gherkin Scenarios:**

\`\`\`gherkin
Feature: Bulk Delete Operations
  As a Portfolio Administrator
  I want to delete multiple items at once
  So that I can efficiently manage the portfolio

  Background:
    Given I am logged in as a Portfolio Administrator

  Scenario: Select multiple applications for deletion
    Given I am on the Applications tab
    And there are 20 applications listed
    When I check the checkbox on 5 applications
    Then the bulk action bar should appear
    And it should show "5 items selected"
    And the "Delete Selected" button should be enabled

  Scenario: Confirm bulk deletion with impact warning
    Given I have selected 3 retired applications
    When I click "Delete Selected"
    Then I should see a confirmation dialog showing:
      | Applications to delete | 3 |
      | Linked dependencies | 7 |
      | Affected initiatives | 2 |
    And a warning about permanent deletion

  Scenario: Cancel bulk deletion
    Given I am on the bulk delete confirmation dialog
    When I click "Cancel"
    Then the dialog should close
    And no applications should be deleted
    And my selections should be preserved

  Scenario: Execute bulk deletion
    Given I confirm the bulk deletion of 3 applications
    When the deletion completes
    Then I should see a success message "3 applications deleted"
    And the applications should be removed from the list
    And related dependency links should be removed

  Scenario: Undo bulk deletion within time window
    Given I just deleted 3 applications
    And the success toast shows "Undo" button
    When I click "Undo" within 10 seconds
    Then the applications should be restored
    And their dependency links should be restored
\`\`\``,
  },
  {
    id: 'US-PORT-008',
    title: 'Inline Editing for Quick Updates',
    storyPoints: 5,
    priority: 'medium',
    description: `As a **Technology Owner**,
I want to edit common fields directly in the list view,
So that I can make quick updates without opening forms.

**Acceptance Criteria:**
- Double-click or edit icon to enable inline edit
- Editable fields: status, owner, criticality, priority
- Escape to cancel, Enter to save
- Visual feedback during edit mode
- Optimistic updates with rollback on error

**Gherkin Scenarios:**

\`\`\`gherkin
Feature: Inline Editing
  As a Technology Owner
  I want to edit fields inline
  So that I can make quick updates efficiently

  Background:
    Given I am logged in as a Technology Owner
    And I am on the Applications list view

  Scenario: Enable inline edit mode
    Given I see application "Order System" with status "active"
    When I double-click on the status cell
    Then the cell should transform into an editable dropdown
    And the current value "active" should be selected

  Scenario: Change status inline
    Given I am editing the status of "Order System"
    When I select "deprecated" from the dropdown
    And I press Enter
    Then the status should update to "deprecated"
    And I should see a brief success indicator
    And the change should be saved to the server

  Scenario: Cancel inline edit with Escape
    Given I am editing the owner field
    And I have typed "New Owner"
    When I press Escape
    Then the edit should be cancelled
    And the original value should be restored

  Scenario: Handle save error gracefully
    Given I am editing the criticality field
    When I change the value
    And the server returns an error
    Then the original value should be restored
    And I should see an error toast notification

  Scenario: Edit multiple fields in sequence
    Given I just saved a status change
    When I tab to the next editable field
    Then that field should enter edit mode
    And I can continue editing without extra clicks
\`\`\``,
  },
  {
    id: 'US-PORT-009',
    title: 'Form Validation with Gherkin Test Scenarios',
    storyPoints: 3,
    priority: 'medium',
    description: `As a **QA Engineer**,
I want validation scenarios documented in Gherkin format,
So that I can create automated tests for all form validations.

**Acceptance Criteria:**
- All form fields have documented validation rules
- Gherkin scenarios cover positive and negative cases
- Edge cases are documented (empty, max length, special chars)
- Validation messages are consistent across forms

**Gherkin Scenarios:**

\`\`\`gherkin
Feature: Form Validation Comprehensive Coverage
  As a QA Engineer
  I want complete validation coverage
  So that all edge cases are tested

  Scenario Outline: Validate initiative name field
    Given I am creating a new initiative
    When I enter "<name>" in the name field
    Then I should see "<result>"

    Examples:
      | name | result |
      |  | Error: Initiative name is required |
      | A | Valid |
      | A very long name that exceeds the 200 character limit... | Error: Name must be 200 characters or less |
      | Test<script>alert('xss')</script> | Sanitized and accepted |
      | Initiative 2025 | Valid |
      | @#$%^& | Valid (special chars allowed) |

  Scenario Outline: Validate budget field
    Given I am creating a new initiative
    When I enter "<budget>" in the budget field
    Then I should see "<result>"

    Examples:
      | budget | result |
      | 0 | Valid |
      | -100 | Error: Budget must be positive |
      | 1000000000000 | Valid (large numbers supported) |
      | abc | Error: Budget must be a number |
      | 100.50 | Rounded to 100 (integer only) |

  Scenario: Validate all required fields together
    Given I submit an initiative form with all fields empty
    Then I should see errors for:
      | field | message |
      | name | Required |
    And the form should not submit

  Scenario: Successful validation clears previous errors
    Given I previously saw a validation error on "name"
    When I enter a valid name
    And I blur the field
    Then the error message should disappear
    And the field should show a valid state
\`\`\``,
  },
  {
    id: 'US-PORT-010',
    title: 'Duplicate Application Detection',
    storyPoints: 5,
    priority: 'medium',
    description: `As a **Portfolio Administrator**,
I want the system to detect potential duplicate applications,
So that I can prevent redundant entries and consolidate records.

**Acceptance Criteria:**
- Check for duplicates on name similarity
- Check for duplicates on repository URL
- Warning displayed before saving potential duplicate
- Option to view existing similar applications
- Merge functionality for confirmed duplicates

**Gherkin Scenarios:**

\`\`\`gherkin
Feature: Duplicate Application Detection
  As a Portfolio Administrator
  I want duplicate detection
  So that the portfolio remains clean

  Background:
    Given I am logged in as a Portfolio Administrator
    And there is an existing application "Customer Portal"

  Scenario: Detect exact name match
    Given I am creating a new application
    When I enter "Customer Portal" as the name
    Then I should see a warning "An application with this name already exists"
    And I should see a link to view the existing application

  Scenario: Detect similar name match
    Given I am creating a new application
    When I enter "Customer Portal v2" as the name
    Then I should see a warning "Similar applications exist: Customer Portal"
    And I can choose to continue or view existing

  Scenario: Detect duplicate repository URL
    Given "Customer Portal" has repository URL "github.com/org/customer-portal"
    When I create an application with the same repository URL
    Then I should see a warning "This repository is already linked to: Customer Portal"

  Scenario: Proceed despite duplicate warning
    Given I see a duplicate warning
    When I click "Create Anyway"
    Then the application should be created
    And a note should be added about potential duplicate

  Scenario: Merge duplicate applications
    Given I have identified "Customer Portal" and "Customer Portal v2" as duplicates
    When I initiate a merge operation
    Then I should see a comparison of both applications
    And I can select which fields to keep from each
    When I confirm the merge
    Then one application should remain with merged data
    And all dependencies should be redirected
\`\`\``,
  },
  {
    id: 'US-PORT-011',
    title: 'Tags and Labels Management',
    storyPoints: 3,
    priority: 'low',
    description: `As a **Portfolio Manager**,
I want to add tags and labels to applications and initiatives,
So that I can categorize and filter items flexibly.

**Acceptance Criteria:**
- Add multiple tags to any entity
- Tag autocomplete from existing tags
- Create new tags on the fly
- Filter by tags across all views
- Tag management (rename, delete, merge)

**Gherkin Scenarios:**

\`\`\`gherkin
Feature: Tags and Labels Management
  As a Portfolio Manager
  I want to manage tags
  So that I can categorize portfolio items

  Background:
    Given I am logged in as a Portfolio Manager

  Scenario: Add tag to an application
    Given I am editing application "Payment Gateway"
    When I click the tags field
    And I type "payment"
    Then I should see suggestions including existing "payments" tag
    When I select "payments"
    Then the tag should be added to the application

  Scenario: Create a new tag
    Given I am adding tags to an initiative
    When I type "q1-2025" which doesn't exist
    And I press Enter
    Then a new tag "q1-2025" should be created
    And it should be applied to this initiative
    And it should be available for future use

  Scenario: Filter applications by tag
    Given there are 50 applications
    And 10 have the tag "critical-infrastructure"
    When I click on the "critical-infrastructure" tag filter
    Then only those 10 applications should be displayed
    And the filter should be shown in the active filters section

  Scenario: Remove tag from entity
    Given an application has tags "legacy", "payment", "core"
    When I click the X on "legacy" tag
    Then the tag should be removed from this application
    But the "legacy" tag should still exist for other items

  Scenario: Merge duplicate tags
    Given there are tags "api" and "apis" with similar usage
    When I open tag management
    And I select "Merge api into apis"
    Then all items tagged "api" should now have "apis"
    And the "api" tag should be deleted
\`\`\``,
  },
  {
    id: 'US-PORT-012',
    title: 'Notes and Comments on Entities',
    storyPoints: 5,
    priority: 'medium',
    description: `As a **Team Member**,
I want to add notes and comments to applications and initiatives,
So that I can capture context and collaborate with the team.

**Acceptance Criteria:**
- Rich text notes field on entities
- Comment thread for discussions
- @mention team members
- Comment notifications
- Comment history and edit tracking

**Gherkin Scenarios:**

\`\`\`gherkin
Feature: Notes and Comments
  As a Team Member
  I want to add notes and comments
  So that I can collaborate with the team

  Background:
    Given I am logged in as a Team Member
    And I am viewing application "Legacy CRM"

  Scenario: Add a note to an application
    Given I am in the Notes section
    When I type a note "Scheduled for retirement Q2 2025. Migration plan in progress."
    And I save the note
    Then the note should be visible on the application
    And it should show my name and timestamp

  Scenario: Add a comment with @mention
    Given I am in the Comments section
    When I type "Need input from @Sarah Chen on migration timeline"
    And I post the comment
    Then the comment should appear in the thread
    And Sarah Chen should receive a notification

  Scenario: Reply to a comment
    Given there is a comment "What's the data migration strategy?"
    When I click Reply
    And I type "We're using incremental sync. Details in confluence."
    And I post the reply
    Then my reply should appear indented under the original comment

  Scenario: Edit a comment
    Given I posted a comment 5 minutes ago
    When I click Edit on my comment
    And I modify the text
    And I save the edit
    Then the comment should show "(edited)" indicator
    And the edit history should be viewable

  Scenario: View comment activity stream
    Given the application has 15 comments over 3 months
    When I view the activity stream
    Then comments should be sorted newest first
    And I should see who commented and when
    And I can filter by date range
\`\`\``,
  },
];

// ============================================================================
// SUB-EPIC 2: DETAIL VIEWS & NAVIGATION (14 stories)
// ============================================================================

const DETAIL_VIEW_STORIES = [
  {
    id: 'US-PORT-013',
    title: 'Initiative Detail Page',
    storyPoints: 8,
    priority: 'high',
    description: `As a **Program Manager**,
I want a comprehensive detail page for each initiative,
So that I can view all information and manage the initiative effectively.

**Acceptance Criteria:**
- Full initiative details in organized sections
- Milestones timeline visualization
- KPI dashboard cards
- Linked applications list
- Stakeholder matrix
- Activity feed
- Quick actions (edit, archive, duplicate)

**Gherkin Scenarios:**

\`\`\`gherkin
Feature: Initiative Detail Page
  As a Program Manager
  I want a comprehensive initiative detail page
  So that I can manage initiatives effectively

  Background:
    Given I am logged in as a Program Manager
    And initiative "Digital Transformation 2025" exists

  Scenario: Navigate to initiative detail page
    Given I am on the Initiatives list
    When I click on "Digital Transformation 2025"
    Then I should be navigated to /portfolio/initiatives/[id]
    And I should see the full initiative details

  Scenario: View initiative header section
    Given I am on the initiative detail page
    Then I should see:
      | element | content |
      | title | Digital Transformation 2025 |
      | status badge | In Progress |
      | priority badge | High |
      | health indicator | Green |
      | progress bar | 65% |

  Scenario: View milestones timeline
    Given the initiative has 5 milestones
    Then I should see a visual timeline with all milestones
    And completed milestones should show checkmarks
    And at-risk milestones should be highlighted
    And I can click a milestone to view details

  Scenario: View linked applications
    Given the initiative impacts 4 applications
    Then I should see a "Linked Applications" section
    And each application should show:
      | field | example |
      | name | Customer Portal |
      | impact type | modernized |
      | status | active |
    And I can click to navigate to the application

  Scenario: Quick edit from detail page
    Given I am viewing the initiative details
    When I click the "Edit" button
    Then the edit dialog should open
    And it should be pre-populated with current values
\`\`\``,
  },
  {
    id: 'US-PORT-014',
    title: 'Application Detail Page',
    storyPoints: 8,
    priority: 'high',
    description: `As a **Technology Owner**,
I want a comprehensive detail page for each application,
So that I can view and manage all application information.

**Acceptance Criteria:**
- Application overview with key metrics
- Technology stack visualization
- Integration diagram
- Cost breakdown
- Lifecycle timeline
- Related initiatives
- Dependency graph

**Gherkin Scenarios:**

\`\`\`gherkin
Feature: Application Detail Page
  As a Technology Owner
  I want a comprehensive application detail page
  So that I can manage applications effectively

  Background:
    Given I am logged in as a Technology Owner
    And application "Order Management System" exists

  Scenario: View application header
    Given I navigate to the application detail page
    Then I should see:
      | element | content |
      | name | Order Management System |
      | type | Web Application |
      | status | Active |
      | criticality | Critical |
      | owner | Commerce Team |

  Scenario: View technology stack section
    Given the application has a defined technology stack
    Then I should see technology grouped by category:
      | category | technologies |
      | Frontend | React, TypeScript |
      | Backend | Node.js, Express |
      | Database | PostgreSQL |
    And each technology should have an icon

  Scenario: View cost breakdown
    Given the application has cost data
    Then I should see a cost breakdown chart showing:
      | category | amount |
      | Infrastructure | $50,000 |
      | Licenses | $20,000 |
      | Maintenance | $15,000 |
    And the total annual cost should be displayed

  Scenario: View related initiatives
    Given the application is linked to 2 initiatives
    Then I should see a "Related Initiatives" section
    And each initiative should show impact type and status

  Scenario: View lifecycle timeline
    Given the application has lifecycle dates
    Then I should see a timeline showing:
      | event | date |
      | Deployed | 2020-03-15 |
      | Last Updated | 2024-11-01 |
      | Planned Retirement | 2026-12-31 |
\`\`\``,
  },
  {
    id: 'US-PORT-015',
    title: 'Dependency Detail View',
    storyPoints: 5,
    priority: 'medium',
    description: `As an **Enterprise Architect**,
I want to view detailed information about a dependency link,
So that I can understand the relationship between initiatives and applications.

**Acceptance Criteria:**
- Full link details in a side panel or modal
- Impact type with description
- Historical changes to the link
- Notes and context
- Quick actions (edit impact type, remove link)

**Gherkin Scenarios:**

\`\`\`gherkin
Feature: Dependency Detail View
  As an Enterprise Architect
  I want detailed dependency information
  So that I can understand relationships

  Background:
    Given there is a dependency link between "CX Modernization" and "Customer Portal"

  Scenario: Open dependency detail panel
    Given I am on the Dependencies tab
    When I click on the dependency row
    Then a detail panel should slide in from the right
    And I should see full link information

  Scenario: View impact details
    Given the dependency has impact type "modernized"
    Then I should see:
      | field | value |
      | Impact Type | Modernized |
      | Description | Application is being upgraded as part of this initiative |
      | Created | 2024-09-15 |
      | Created By | Michael Torres |

  Scenario: Edit impact type from detail view
    Given I am viewing the dependency detail
    When I click "Change Impact Type"
    And I select "replaced"
    And I add a note "Moving to new platform"
    And I save
    Then the impact type should update to "replaced"
    And the change should be logged

  Scenario: View change history
    Given the dependency has been modified 3 times
    When I click "View History"
    Then I should see a timeline of changes:
      | date | change | by |
      | 2024-11-01 | Impact changed to modernized | Sarah Chen |
      | 2024-10-15 | Note added | Michael Torres |
      | 2024-09-15 | Link created | Michael Torres |
\`\`\``,
  },
  {
    id: 'US-PORT-016',
    title: 'Breadcrumb Navigation',
    storyPoints: 3,
    priority: 'medium',
    description: `As a **User**,
I want breadcrumb navigation throughout the portfolio module,
So that I can understand my location and navigate back easily.

**Acceptance Criteria:**
- Breadcrumbs on all detail pages
- Clickable path segments
- Current page highlighted
- Consistent placement and styling

**Gherkin Scenarios:**

\`\`\`gherkin
Feature: Breadcrumb Navigation
  As a User
  I want breadcrumb navigation
  So that I can navigate the portfolio easily

  Scenario: View breadcrumbs on initiative detail
    Given I am on initiative "Digital Transformation 2025" detail page
    Then I should see breadcrumbs: "Portfolio > Initiatives > Digital Transformation 2025"
    And "Digital Transformation 2025" should not be a link (current page)

  Scenario: Navigate back via breadcrumb
    Given I am on application "Customer Portal" detail page
    When I click "Applications" in the breadcrumb
    Then I should navigate to the Portfolio page with Applications tab active

  Scenario: Breadcrumb from nested context
    Given I navigated: Portfolio > Initiatives > CX Modernization > Customer Portal
    Then breadcrumbs should show the full path
    And I can click any segment to navigate back

  Scenario: Breadcrumb updates on navigation
    Given I am on initiative detail with breadcrumbs shown
    When I click on a linked application
    Then breadcrumbs should update to show the new path
\`\`\``,
  },
  {
    id: 'US-PORT-017',
    title: 'Initiative Timeline View',
    storyPoints: 8,
    priority: 'high',
    description: `As a **Program Manager**,
I want a timeline view of initiative milestones and events,
So that I can visualize progress over time.

**Acceptance Criteria:**
- Horizontal timeline with milestones
- Today marker
- Milestone status colors
- Zoom in/out capability
- Event details on hover/click
- Print-friendly view

**Gherkin Scenarios:**

\`\`\`gherkin
Feature: Initiative Timeline View
  As a Program Manager
  I want a timeline view
  So that I can visualize initiative progress

  Background:
    Given I am viewing initiative "Zero Trust Security"
    And it has milestones from 2024-07-01 to 2025-01-31

  Scenario: Display milestone timeline
    Given the initiative has 5 milestones
    Then I should see a horizontal timeline
    And each milestone should be positioned by date
    And completed milestones should be green
    And at-risk milestones should be red

  Scenario: View today marker
    Given today is 2024-11-15
    Then I should see a "Today" marker on the timeline
    And it should be positioned at the correct date

  Scenario: Hover for milestone details
    Given I hover over milestone "Identity Management Rollout"
    Then I should see a tooltip with:
      | Target Date | 2024-10-31 |
      | Status | In Progress |
      | Owner | Lisa Wang |

  Scenario: Zoom timeline view
    Given the timeline shows 6 months
    When I click the zoom in button
    Then the view should show a 3 month window
    And I can pan left/right to see other dates

  Scenario: Print timeline
    When I click "Print Timeline"
    Then a print-optimized view should open
    And it should fit on a single page
    And colors should be print-friendly
\`\`\``,
  },
  {
    id: 'US-PORT-018',
    title: 'Application Lifecycle Timeline',
    storyPoints: 5,
    priority: 'medium',
    description: `As a **Technology Owner**,
I want to see the lifecycle timeline of an application,
So that I can understand its history and plan for its future.

**Acceptance Criteria:**
- Timeline showing key lifecycle events
- Deployed date, major versions, planned retirement
- Status change history
- Future planned events

**Gherkin Scenarios:**

\`\`\`gherkin
Feature: Application Lifecycle Timeline
  As a Technology Owner
  I want to see application lifecycle
  So that I can understand history and plan ahead

  Background:
    Given I am viewing application "Legacy CRM"
    And I navigate to the Lifecycle tab

  Scenario: View lifecycle events
    Then I should see a timeline with events:
      | date | event |
      | 2015-06-01 | Deployed |
      | 2018-03-15 | Major upgrade to v2.0 |
      | 2022-01-01 | Marked as deprecated |
      | 2025-06-30 | Planned retirement |

  Scenario: View status change history
    Given the application status has changed 3 times
    Then I should see status transitions:
      | from | to | date | by |
      | development | active | 2015-06-01 | System |
      | active | deprecated | 2022-01-01 | Sarah Chen |

  Scenario: Add planned event
    Given I have edit permissions
    When I click "Add Event"
    And I enter:
      | field | value |
      | type | Planned Upgrade |
      | date | 2024-12-01 |
      | description | Upgrade to v2.5 |
    Then the event should appear on the timeline as a future event
\`\`\``,
  },
  {
    id: 'US-PORT-019',
    title: 'Side Panel Quick View',
    storyPoints: 5,
    priority: 'medium',
    description: `As a **User**,
I want a side panel quick view for items in lists,
So that I can preview details without leaving the list.

**Acceptance Criteria:**
- Click row to open side panel (not navigate away)
- Side panel shows key information
- Quick actions available in panel
- Keyboard navigation (arrow keys to cycle)
- Close panel to return to list

**Gherkin Scenarios:**

\`\`\`gherkin
Feature: Side Panel Quick View
  As a User
  I want a quick view panel
  So that I can preview without navigating

  Background:
    Given I am on the Applications list

  Scenario: Open side panel from list
    Given I see 20 applications listed
    When I click on "Customer Portal" row
    Then a side panel should open on the right
    And the list should remain visible (but narrowed)
    And the panel should show Customer Portal details

  Scenario: Navigate between items with keyboard
    Given the side panel is open showing "Customer Portal"
    When I press the down arrow key
    Then the panel should update to show the next application
    And the list selection should move down

  Scenario: Quick actions in side panel
    Given the side panel is showing an application
    Then I should see quick action buttons:
      | action |
      | Edit |
      | View Full Details |
      | Copy Link |
    When I click "Edit"
    Then the edit dialog should open

  Scenario: Close side panel
    Given the side panel is open
    When I click the X button or press Escape
    Then the panel should close
    And the list should return to full width
\`\`\``,
  },
  {
    id: 'US-PORT-020',
    title: 'Tab Persistence with URL Sync',
    storyPoints: 3,
    priority: 'medium',
    description: `As a **User**,
I want my tab selection to be reflected in the URL,
So that I can bookmark and share specific views.

**Acceptance Criteria:**
- URL updates when switching tabs
- Direct URL access loads correct tab
- Browser back/forward works correctly
- Filters also persisted in URL

**Gherkin Scenarios:**

\`\`\`gherkin
Feature: Tab Persistence with URL
  As a User
  I want tabs synced to URL
  So that I can bookmark views

  Scenario: URL updates on tab switch
    Given I am on /portfolio (Initiatives tab)
    When I click the "Dependencies" tab
    Then the URL should change to /portfolio?tab=dependencies
    And the Dependencies tab should be active

  Scenario: Direct URL access
    Given I navigate directly to /portfolio?tab=applications
    Then the Portfolio page should load
    And the Applications tab should be active

  Scenario: Browser back button
    Given I navigated from Initiatives to Dependencies to Applications
    When I click the browser back button
    Then I should see the Dependencies tab
    When I click back again
    Then I should see the Initiatives tab

  Scenario: Filters in URL
    Given I am on Applications tab
    When I filter by status "deprecated"
    Then the URL should include "status=deprecated"
    When I share this URL and someone opens it
    Then they should see the filtered view
\`\`\``,
  },
  {
    id: 'US-PORT-021',
    title: 'Keyboard Navigation Support',
    storyPoints: 3,
    priority: 'low',
    description: `As a **Power User**,
I want keyboard shortcuts for common actions,
So that I can work efficiently without using the mouse.

**Acceptance Criteria:**
- Tab navigation through interactive elements
- Enter to activate buttons/links
- Escape to close dialogs
- Shortcut keys for common actions
- Keyboard shortcut help dialog

**Gherkin Scenarios:**

\`\`\`gherkin
Feature: Keyboard Navigation
  As a Power User
  I want keyboard shortcuts
  So that I can work efficiently

  Scenario: Tab through form fields
    Given I am in the initiative form
    When I press Tab
    Then focus should move to the next form field
    And the focused element should have a visible outline

  Scenario: Use keyboard shortcuts
    Given I am on the Applications list
    When I press "n"
    Then the "New Application" dialog should open
    When I press Escape
    Then the dialog should close

  Scenario: View keyboard shortcuts help
    Given I am on the Portfolio page
    When I press "?"
    Then a help dialog should show available shortcuts:
      | shortcut | action |
      | n | New item |
      | / | Focus search |
      | ? | Show help |
      | Esc | Close dialog |

  Scenario: Navigate list with arrow keys
    Given I am on the list with focus on first item
    When I press Down Arrow
    Then focus should move to the next item
    When I press Enter
    Then the item detail should open
\`\`\``,
  },
  {
    id: 'US-PORT-022',
    title: 'Initiative Roadmap View',
    storyPoints: 8,
    priority: 'high',
    description: `As an **Executive**,
I want a roadmap view showing all initiatives across time,
So that I can see the strategic portfolio at a glance.

**Acceptance Criteria:**
- Swimlane view by quarter or month
- Initiatives shown as bars spanning their duration
- Color coding by status/health
- Filter by type, priority, owner
- Export to image/PDF

**Gherkin Scenarios:**

\`\`\`gherkin
Feature: Initiative Roadmap View
  As an Executive
  I want a portfolio roadmap
  So that I can see strategic initiatives over time

  Background:
    Given I am logged in as an Executive
    And there are 10 initiatives spanning 2024-2025

  Scenario: View quarterly roadmap
    Given I navigate to Portfolio > Roadmap
    Then I should see a Gantt-style view with quarters as columns
    And each initiative should be a horizontal bar
    And bar length should represent initiative duration

  Scenario: Color coding by health status
    Given initiatives have various health statuses
    Then green initiatives should have green bars
    And yellow initiatives should have yellow bars
    And red initiatives should have red bars

  Scenario: Filter roadmap by priority
    Given I click the priority filter
    When I select "Critical"
    Then only critical priority initiatives should be displayed
    And the view should update immediately

  Scenario: Hover for initiative details
    Given I hover over an initiative bar
    Then I should see a tooltip with:
      | Initiative | CX Modernization |
      | Duration | Jun 2024 - Dec 2024 |
      | Progress | 65% |
      | Health | Green |

  Scenario: Export roadmap to PDF
    When I click "Export" and select "PDF"
    Then a PDF should be generated with the current roadmap view
    And it should include the legend and filters applied
\`\`\``,
  },
  {
    id: 'US-PORT-023',
    title: 'Application Dependency Graph',
    storyPoints: 8,
    priority: 'high',
    description: `As an **Enterprise Architect**,
I want a visual dependency graph for applications,
So that I can understand system interconnections.

**Acceptance Criteria:**
- Network graph visualization
- Nodes represent applications
- Edges represent integrations/dependencies
- Click node to view application details
- Highlight paths from selected node
- Search and filter capabilities

**Gherkin Scenarios:**

\`\`\`gherkin
Feature: Application Dependency Graph
  As an Enterprise Architect
  I want a visual dependency graph
  So that I can understand system architecture

  Background:
    Given there are 20 applications with 35 integration links
    And I navigate to Portfolio > Applications > Dependency Graph

  Scenario: View dependency graph
    Then I should see a network graph with:
      | element | representation |
      | applications | nodes/circles |
      | integrations | connecting edges |
    And nodes should be sized by criticality
    And edges should show direction arrows

  Scenario: Select a node
    When I click on the "Customer Portal" node
    Then the node should be highlighted
    And all connected nodes should be highlighted
    And unconnected nodes should be dimmed

  Scenario: View edge details
    When I click on an edge between two applications
    Then I should see the integration details:
      | from | Customer Portal |
      | to | Payment Gateway |
      | type | REST API |
      | direction | Outbound |

  Scenario: Search for an application
    When I type "Order" in the graph search
    Then matching nodes should be highlighted
    And the view should center on "Order Management System"

  Scenario: Filter by application type
    When I filter by type "API Service"
    Then only API Service applications should be shown
    And their connections to other (hidden) apps should show dotted lines
\`\`\``,
  },
  {
    id: 'US-PORT-024',
    title: 'Cross-Reference Cards',
    storyPoints: 5,
    priority: 'medium',
    description: `As a **User**,
I want to see linked items as cards on detail pages,
So that I can quickly navigate related entities.

**Acceptance Criteria:**
- Show linked applications on initiative detail
- Show linked initiatives on application detail
- Cards show key info (name, status, impact type)
- Click card to navigate to that entity
- Count badge when many items

**Gherkin Scenarios:**

\`\`\`gherkin
Feature: Cross-Reference Cards
  As a User
  I want to see linked items
  So that I can navigate related entities

  Scenario: View linked applications on initiative
    Given initiative "CX Modernization" is linked to 4 applications
    And I am on the initiative detail page
    Then I should see a "Linked Applications" section
    And I should see 4 application cards with:
      | app | impact | status |
      | Customer Portal | modernized | active |
      | Mobile App | modernized | active |
      | Order System | modernized | active |
      | Legacy CRM | replaced | deprecated |

  Scenario: Navigate from card
    Given I see the linked application cards
    When I click on "Customer Portal" card
    Then I should navigate to the Customer Portal detail page

  Scenario: View linked initiatives on application
    Given application "Identity Service" is linked to 2 initiatives
    And I am on the application detail page
    Then I should see a "Related Initiatives" section
    And each initiative should show impact type

  Scenario: Expand when many items
    Given an initiative is linked to 15 applications
    Then I should see 6 cards initially
    And a "Show all 15" button
    When I click "Show all 15"
    Then all linked applications should be displayed
\`\`\``,
  },
  {
    id: 'US-PORT-025',
    title: 'Initiative Gantt Chart',
    storyPoints: 8,
    priority: 'medium',
    description: `As a **Program Manager**,
I want a Gantt chart for initiative milestones,
So that I can see detailed scheduling and dependencies.

**Acceptance Criteria:**
- Milestones as bars on timeline
- Dependencies shown as arrows
- Critical path highlighting
- Drag to adjust dates
- Export to image/PDF

**Gherkin Scenarios:**

\`\`\`gherkin
Feature: Initiative Gantt Chart
  As a Program Manager
  I want a Gantt chart
  So that I can manage scheduling

  Background:
    Given initiative "Data Platform" has 8 milestones
    And I am on the Gantt Chart view

  Scenario: Display Gantt chart
    Then I should see milestones as horizontal bars
    And bars should be positioned by start/end date
    And today should be marked with a vertical line

  Scenario: Show milestone dependencies
    Given milestone "Data Migration" depends on "Platform Setup"
    Then an arrow should connect the two bars
    And "Data Migration" should start after "Platform Setup" ends

  Scenario: Highlight critical path
    When I click "Show Critical Path"
    Then the longest dependency chain should be highlighted in red
    And non-critical milestones should be dimmed

  Scenario: Drag to adjust dates
    Given I have edit permissions
    When I drag the end of "Platform Setup" bar 1 week later
    Then the date should update
    And dependent milestones should shift accordingly

  Scenario: Export Gantt chart
    When I click "Export" and select "PNG"
    Then an image of the current Gantt view should be downloaded
\`\`\``,
  },
  {
    id: 'US-PORT-026',
    title: 'Print-Friendly Views',
    storyPoints: 5,
    priority: 'low',
    description: `As a **User**,
I want print-friendly versions of portfolio pages,
So that I can print reports for meetings.

**Acceptance Criteria:**
- Print styles hide navigation
- Content optimized for paper
- Page breaks at logical points
- Charts render in print-friendly colors
- Option to include/exclude sections

**Gherkin Scenarios:**

\`\`\`gherkin
Feature: Print-Friendly Views
  As a User
  I want print-friendly views
  So that I can print reports

  Scenario: Print initiative detail
    Given I am on initiative "CX Modernization" detail page
    When I press Ctrl+P or click Print
    Then the print preview should show:
      | element | visibility |
      | navigation | hidden |
      | header | visible |
      | content | visible |
      | footer with date | visible |
    And colors should be print-friendly

  Scenario: Print portfolio summary
    Given I am on the Portfolio dashboard
    When I print
    Then charts should be rendered in grayscale-friendly colors
    And the summary should fit on 1-2 pages

  Scenario: Configure print sections
    Given I click "Print Options"
    Then I should be able to toggle:
      | section | default |
      | Overview | checked |
      | Milestones | checked |
      | KPIs | checked |
      | Stakeholders | unchecked |
\`\`\``,
  },
];

// ============================================================================
// Continue in Part 2...
// ============================================================================

console.log('Story definitions loaded. Part 1 of 3 ready.');
console.log('Foundation stories:', FOUNDATION_STORIES.length);
console.log('Detail view stories:', DETAIL_VIEW_STORIES.length);

export { PORTFOLIO_EPIC, FOUNDATION_STORIES, DETAIL_VIEW_STORIES };

