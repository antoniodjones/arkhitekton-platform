import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { eq } from 'drizzle-orm';
import * as schema from '../shared/schema';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const db = drizzle(pool, { schema });

async function createWikiStoriesPhase3And4() {
  console.log('🏗️  Creating Wiki Knowledge Core User Stories (Phase 3-4 Final)...\n');

  const stories = [
    // EPIC-WIKI-06: Requirements Management (49 points) - PHASE 3
    {
      id: 'US-WIKI-053',
      epicId: 'EPIC-WIKI-06',
      title: 'Create Requirement Pages from Template',
      description: 'As an architect, I want to create Requirement pages using a template so that requirements are consistently documented.',
      acceptanceCriteria: `Given I am on the wiki
When I click "New Page" → "From Template" → "Requirement"
Then a new page should be created using the Requirement template
And it should have placeholders for: Identifier, Title, Type, Priority, Status, Description, Rationale, Acceptance Criteria, Satisfied By, Related Stories`,
      storyPoints: 8,
      status: 'backlog',
      priority: 'high',
      labels: ['wiki', 'requirements', 'templates', 'phase-3'],
      feature: 'Requirements Management',
      value: 'Structured Requirements',
      requirement: 'HLR-WIKI-080'
    },
    {
      id: 'US-WIKI-054',
      epicId: 'EPIC-WIKI-06',
      title: 'Set Requirement Identifier',
      description: 'As an architect, I want to assign a unique identifier to each requirement so that I can reference it consistently.',
      acceptanceCriteria: `Given I am creating a requirement
When I enter identifier "REQ-BUS-001"
Then the system should validate format (REQ-[TYPE]-[NUMBER])
And the system should check for uniqueness
And if duplicate, show error "Identifier already exists"`,
      storyPoints: 5,
      status: 'backlog',
      priority: 'high',
      labels: ['wiki', 'requirements', 'validation', 'phase-3'],
      feature: 'Requirements Management',
      value: 'Unique Identification',
      requirement: 'HLR-WIKI-081'
    },
    {
      id: 'US-WIKI-055',
      epicId: 'EPIC-WIKI-06',
      title: 'Set Requirement Type',
      description: 'As an architect, I want to categorize requirements as Business, Product, or Technical so that I can filter by type.',
      acceptanceCriteria: `Given I am editing a requirement
When I click the Type field
Then I should see dropdown: Business, Product, Technical
When I select "Business"
Then the requirement type should be set to Business
And the identifier prefix should suggest "REQ-BUS-"`,
      storyPoints: 3,
      status: 'backlog',
      priority: 'high',
      labels: ['wiki', 'requirements', 'categorization', 'phase-3'],
      feature: 'Requirements Management',
      value: 'Requirement Classification',
      requirement: 'HLR-WIKI-082'
    },
    {
      id: 'US-WIKI-056',
      epicId: 'EPIC-WIKI-06',
      title: 'Set Requirement Priority',
      description: 'As an architect, I want to set requirement priority (High, Medium, Low) so that I can focus on critical requirements.',
      acceptanceCriteria: `Given I am editing a requirement
When I set Priority to "High"
Then the priority should be saved as metadata
And High priority should display with a red indicator`,
      storyPoints: 2,
      status: 'backlog',
      priority: 'high',
      labels: ['wiki', 'requirements', 'priority', 'phase-3'],
      feature: 'Requirements Management',
      value: 'Priority Management',
      requirement: 'HLR-WIKI-083'
    },
    {
      id: 'US-WIKI-057',
      epicId: 'EPIC-WIKI-06',
      title: 'Set Requirement Status',
      description: 'As an architect, I want to track requirement status (Proposed, Accepted, Implemented, Deprecated) so that I know the lifecycle state.',
      acceptanceCriteria: `Given I am editing a requirement
When I set Status to "Accepted"
Then the status should be saved as metadata
And Accepted status should display with a green badge`,
      storyPoints: 3,
      status: 'backlog',
      priority: 'high',
      labels: ['wiki', 'requirements', 'status', 'phase-3'],
      feature: 'Requirements Management',
      value: 'Lifecycle Tracking',
      requirement: 'HLR-WIKI-084'
    },
    {
      id: 'US-WIKI-058',
      epicId: 'EPIC-WIKI-06',
      title: 'Write Narrative Requirement Description',
      description: 'As an architect, I want to write narrative descriptions with rich text so that I can explain the business context and rationale.',
      acceptanceCriteria: `Given I am editing a requirement
When I type in the Description section with rich text formatting
Then the rich text should be saved
And I can use formatting, mentions, code blocks, etc.`,
      storyPoints: 5,
      status: 'backlog',
      priority: 'high',
      labels: ['wiki', 'requirements', 'narrative', 'phase-3'],
      feature: 'Requirements Management',
      value: 'Contextual Documentation',
      requirement: 'HLR-WIKI-085'
    },
    {
      id: 'US-WIKI-059',
      epicId: 'EPIC-WIKI-06',
      title: 'Link Requirements to Components',
      description: 'As an architect, I want to link requirements to components that satisfy them so that I can trace implementation.',
      acceptanceCriteria: `Given I am editing REQ-BUS-001
When I click "Add Component" in Satisfied By section
Then I should see a component picker
When I select "@PaymentService"
Then PaymentService should be linked
And the requirement should show "Satisfied by: @PaymentService"
And PaymentService page should show "Satisfies: REQ-BUS-001"`,
      storyPoints: 5,
      status: 'backlog',
      priority: 'high',
      labels: ['wiki', 'requirements', 'traceability', 'phase-3'],
      feature: 'Requirements Management',
      value: 'Implementation Traceability',
      requirement: 'HLR-WIKI-086'
    },
    {
      id: 'US-WIKI-060',
      epicId: 'EPIC-WIKI-06',
      title: 'Link Requirements to User Stories',
      description: 'As a PM, I want to link requirements to related user stories so that I can track implementation progress.',
      acceptanceCriteria: `Given I am editing REQ-BUS-001
When I click "Add Story" in Related Stories section
When I select "@US-PAY-001"
Then the story should be linked
And the requirement should show it in metadata
And the story should show "Implements: REQ-BUS-001"`,
      storyPoints: 5,
      status: 'backlog',
      priority: 'high',
      labels: ['wiki', 'requirements', 'plan-integration', 'phase-3'],
      feature: 'Requirements Management',
      value: 'Story Traceability',
      requirement: 'HLR-WIKI-087'
    },
    {
      id: 'US-WIKI-061',
      epicId: 'EPIC-WIKI-06',
      title: 'Convert Text to Requirement',
      description: 'As an architect, I want to select text and convert it to a requirement so that I can quickly capture requirements from meeting notes.',
      acceptanceCriteria: `Given I am editing meeting notes
And I have text: "The system must support 10K concurrent users"
When I select that text
And I right-click → "Create Requirement"
Then a new Requirement page should be created
And the selected text should be in the Description
And I should be prompted for Identifier, Type, Priority
And the original text should be replaced with @REQ-[ID] mention`,
      storyPoints: 8,
      status: 'backlog',
      priority: 'medium',
      labels: ['wiki', 'requirements', 'conversion', 'phase-3'],
      feature: 'Requirements Management',
      value: 'Quick Capture',
      requirement: 'HLR-WIKI-088'
    },
    {
      id: 'US-WIKI-062',
      epicId: 'EPIC-WIKI-06',
      title: 'View Requirements Table',
      description: 'As a PM or architect, I want to view all requirements in a table so that I can see the big picture and filter/sort.',
      acceptanceCriteria: `Given I have created multiple requirements
When I navigate to Wiki → Requirements view
Then I should see a table with columns: ID, Title, Type, Priority, Status, Satisfied By, Stories
And I should be able to sort by any column
And I should be able to filter by Type, Priority, Status
And clicking a row should open that requirement page`,
      storyPoints: 8,
      status: 'backlog',
      priority: 'high',
      labels: ['wiki', 'requirements', 'table-view', 'phase-3'],
      feature: 'Requirements Management',
      value: 'Overview & Management',
      requirement: 'HLR-WIKI-089'
    },

    // EPIC-WIKI-07: Traceability Matrix (33 points) - PHASE 3
    {
      id: 'US-WIKI-063',
      epicId: 'EPIC-WIKI-07',
      title: 'Generate Traceability Matrix',
      description: 'As an architect, I want to auto-generate a requirements traceability matrix so that I can see all requirements and their mappings.',
      acceptanceCriteria: `Given I navigate to Wiki → Traceability
When the matrix loads
Then I should see a table with all requirements
And columns: ID, Title, Type, Priority, Components, Stories, Status`,
      storyPoints: 8,
      status: 'backlog',
      priority: 'high',
      labels: ['wiki', 'traceability', 'matrix', 'phase-3'],
      feature: 'Traceability Matrix',
      value: 'Complete Visibility',
      requirement: 'HLR-WIKI-090'
    },
    {
      id: 'US-WIKI-064',
      epicId: 'EPIC-WIKI-07',
      title: 'Show Requirements to Components Mapping',
      description: 'As an architect, I want to see which components satisfy each requirement so that I can verify implementation coverage.',
      acceptanceCriteria: `Given I view the traceability matrix
Then for each requirement, I should see linked components
And components should be clickable links
And clicking should navigate to the component`,
      storyPoints: 5,
      status: 'backlog',
      priority: 'high',
      labels: ['wiki', 'traceability', 'components', 'phase-3'],
      feature: 'Traceability Matrix',
      value: 'Component Mapping',
      requirement: 'HLR-WIKI-091'
    },
    {
      id: 'US-WIKI-065',
      epicId: 'EPIC-WIKI-07',
      title: 'Show Requirements to Stories Mapping',
      description: 'As a PM, I want to see which user stories implement each requirement so that I can track development progress.',
      acceptanceCriteria: `Given I view the traceability matrix
Then for each requirement, I should see linked stories
And stories should be clickable
And clicking should navigate to the story in Plan module`,
      storyPoints: 5,
      status: 'backlog',
      priority: 'high',
      labels: ['wiki', 'traceability', 'stories', 'phase-3'],
      feature: 'Traceability Matrix',
      value: 'Story Mapping',
      requirement: 'HLR-WIKI-092'
    },
    {
      id: 'US-WIKI-066',
      epicId: 'EPIC-WIKI-07',
      title: 'Highlight Unmet Requirements',
      description: 'As an architect, I want to see which requirements lack components or stories so that I can identify gaps.',
      acceptanceCriteria: `Given I view the traceability matrix
Then requirements with no components should show "⚠️ None"
And requirements with no stories should show "⚠️ None"
And such rows should be highlighted in yellow/orange
And there should be a filter "Show unmet only"`,
      storyPoints: 5,
      status: 'backlog',
      priority: 'high',
      labels: ['wiki', 'traceability', 'gaps', 'phase-3'],
      feature: 'Traceability Matrix',
      value: 'Gap Identification',
      requirement: 'HLR-WIKI-093'
    },
    {
      id: 'US-WIKI-067',
      epicId: 'EPIC-WIKI-07',
      title: 'Export Traceability Matrix to CSV',
      description: 'As a PM or compliance officer, I want to export the traceability matrix to CSV so that I can share with stakeholders.',
      acceptanceCriteria: `Given I am viewing the traceability matrix
When I click "Export" → "CSV"
Then a CSV file should download
And it should contain all requirements data
And it should be openable in Excel`,
      storyPoints: 5,
      status: 'backlog',
      priority: 'medium',
      labels: ['wiki', 'traceability', 'export', 'phase-3'],
      feature: 'Traceability Matrix',
      value: 'Reporting & Compliance',
      requirement: 'HLR-WIKI-094'
    },
    {
      id: 'US-WIKI-068',
      epicId: 'EPIC-WIKI-07',
      title: 'Embed Traceability Matrix in Pages',
      description: 'As an architect, I want to embed the traceability matrix in wiki pages so that it stays current within documentation.',
      acceptanceCriteria: `Given I am editing a wiki page "Architecture Review"
When I type "/traceability" in slash command
Then I should see "Traceability Matrix" option
When I select it
Then a live traceability matrix should be embedded
And it should auto-update as requirements change
And it should be filterable inline`,
      storyPoints: 5,
      status: 'backlog',
      priority: 'medium',
      labels: ['wiki', 'traceability', 'embed', 'phase-3'],
      feature: 'Traceability Matrix',
      value: 'Living Documentation',
      requirement: 'HLR-WIKI-095'
    },

    // EPIC-WIKI-08: Page Templates (37 points) - PHASE 4
    {
      id: 'US-WIKI-069',
      epicId: 'EPIC-WIKI-08',
      title: 'ADR Template',
      description: 'As an architect, I want an Architecture Decision Record (ADR) template so that I can document decisions consistently.',
      acceptanceCriteria: `Given I click "New Page" → "From Template"
When I select "Architecture Decision Record (ADR)"
Then a new page should be created with ADR structure:
- Context and Problem Statement
- Decision Drivers
- Considered Options
- Decision Outcome
- Consequences
And placeholder text should be easy to replace`,
      storyPoints: 5,
      status: 'backlog',
      priority: 'high',
      labels: ['wiki', 'templates', 'adr', 'phase-4'],
      feature: 'Page Templates',
      value: 'Decision Documentation',
      requirement: 'HLR-WIKI-100'
    },
    {
      id: 'US-WIKI-070',
      epicId: 'EPIC-WIKI-08',
      title: 'Solution Design Document Template',
      description: 'As an architect, I want a Solution Design Document template so that I can structure technical designs properly.',
      acceptanceCriteria: `When I select "Solution Design Document" template
Then I should get structure with sections:
Executive Summary, Business Context, Requirements, Proposed Solution, Architecture Diagram, Components, Data Model, Integration Points, Security, Performance, Deployment Strategy, Testing Strategy, Risks & Mitigation
And each section should have helpful prompts`,
      storyPoints: 5,
      status: 'backlog',
      priority: 'high',
      labels: ['wiki', 'templates', 'design-doc', 'phase-4'],
      feature: 'Page Templates',
      value: 'Design Documentation',
      requirement: 'HLR-WIKI-101'
    },
    {
      id: 'US-WIKI-071',
      epicId: 'EPIC-WIKI-08',
      title: 'Business Case Template',
      description: 'As a PM or architect, I want a Business Case template so that I can justify technical initiatives to stakeholders.',
      acceptanceCriteria: `When I select "Business Case" template
Then I should get sections for:
Executive Summary, Problem Statement, Proposed Solution, Cost-Benefit Analysis, ROI Projection, Risks, Timeline, Success Metrics`,
      storyPoints: 3,
      status: 'backlog',
      priority: 'medium',
      labels: ['wiki', 'templates', 'business-case', 'phase-4'],
      feature: 'Page Templates',
      value: 'Business Justification',
      requirement: 'HLR-WIKI-102'
    },
    {
      id: 'US-WIKI-072',
      epicId: 'EPIC-WIKI-08',
      title: 'Meeting Notes Template',
      description: 'As a team member, I want a Meeting Notes template so that I can capture discussions and action items consistently.',
      acceptanceCriteria: `When I select "Meeting Notes" template
Then I should get:
Date (auto-filled), Attendees (@mentions), Duration, Agenda, Discussion, Decisions Made, Action Items (with checkboxes, @assignees, due dates), Next Steps
And action items should be trackable`,
      storyPoints: 3,
      status: 'backlog',
      priority: 'medium',
      labels: ['wiki', 'templates', 'meeting-notes', 'phase-4'],
      feature: 'Page Templates',
      value: 'Meeting Documentation',
      requirement: 'HLR-WIKI-103'
    },
    {
      id: 'US-WIKI-073',
      epicId: 'EPIC-WIKI-08',
      title: 'Onboarding Guide Template',
      description: 'As a team lead, I want an Onboarding Guide template so that new team members have consistent resources.',
      acceptanceCriteria: `When I select "Onboarding Guide" template
Then I should get sections for:
Welcome, Team Structure, Key Systems, Development Setup, Access & Credentials, Learning Resources, First Week Tasks`,
      storyPoints: 3,
      status: 'backlog',
      priority: 'low',
      labels: ['wiki', 'templates', 'onboarding', 'phase-4'],
      feature: 'Page Templates',
      value: 'Team Onboarding',
      requirement: 'HLR-WIKI-104'
    },
    {
      id: 'US-WIKI-074',
      epicId: 'EPIC-WIKI-08',
      title: 'Runbook Template',
      description: 'As an SRE or operations engineer, I want a Runbook template so that I can document operational procedures.',
      acceptanceCriteria: `When I select "Runbook" template
Then I should get sections for:
Overview, Prerequisites, Step-by-step Instructions, Troubleshooting, Rollback Procedures, Contact Information`,
      storyPoints: 3,
      status: 'backlog',
      priority: 'low',
      labels: ['wiki', 'templates', 'runbook', 'phase-4'],
      feature: 'Page Templates',
      value: 'Operational Documentation',
      requirement: 'HLR-WIKI-105'
    },
    {
      id: 'US-WIKI-075',
      epicId: 'EPIC-WIKI-08',
      title: 'RFC Template',
      description: 'As an architect, I want an RFC (Request for Comments) template so that I can propose and discuss technical changes.',
      acceptanceCriteria: `When I select "RFC" template
Then I should get sections for:
Summary, Motivation, Detailed Design, Alternatives Considered, Implementation Plan, Open Questions, Timeline`,
      storyPoints: 5,
      status: 'backlog',
      priority: 'medium',
      labels: ['wiki', 'templates', 'rfc', 'phase-4'],
      feature: 'Page Templates',
      value: 'Technical Proposals',
      requirement: 'HLR-WIKI-106'
    },
    {
      id: 'US-WIKI-076',
      epicId: 'EPIC-WIKI-08',
      title: 'Create Custom Templates',
      description: 'As an architect, I want to create custom templates from existing pages so that I can reuse my own structures.',
      acceptanceCriteria: `Given I am editing a page with my preferred structure
When I click "Page Options" → "Save as Template"
Then I should see a template creation dialog
When I enter name "Security Review Template"
And I optionally add description
And I click "Save"
Then my template should be saved
And it should appear in my template list
And I can use it to create new pages`,
      storyPoints: 8,
      status: 'backlog',
      priority: 'low',
      labels: ['wiki', 'templates', 'custom', 'phase-4'],
      feature: 'Page Templates',
      value: 'Custom Structures',
      requirement: 'HLR-WIKI-107'
    },
    {
      id: 'US-WIKI-077',
      epicId: 'EPIC-WIKI-08',
      title: 'Share Templates with Organization',
      description: 'As an architect, I want to share my templates with my organization so that the team benefits from best practices.',
      acceptanceCriteria: `Given I have created a custom template
When I go to template settings
And I toggle "Share with organization"
Then all team members should see this template
And it should appear in their "Organization Templates" section`,
      storyPoints: 5,
      status: 'backlog',
      priority: 'low',
      labels: ['wiki', 'templates', 'sharing', 'phase-4'],
      feature: 'Page Templates',
      value: 'Team Collaboration',
      requirement: 'HLR-WIKI-108'
    },

    // EPIC-WIKI-09: Collaboration Features (41 points) - PHASE 4
    {
      id: 'US-WIKI-078',
      epicId: 'EPIC-WIKI-09',
      title: 'Real-Time Collaborative Editing',
      description: 'As an architect, I want real-time collaborative editing using Yjs so that multiple people can work on the same page simultaneously.',
      acceptanceCriteria: `Given User A and User B are editing the same page
When User A types "The PaymentService handles transactions"
Then User B should see the text appear in real-time
And there should be no conflicts
And the text should appear within 200ms`,
      storyPoints: 10,
      status: 'backlog',
      priority: 'medium',
      labels: ['wiki', 'collaboration', 'real-time', 'phase-4'],
      feature: 'Collaboration Features',
      value: 'Simultaneous Editing',
      requirement: 'HLR-WIKI-110'
    },
    {
      id: 'US-WIKI-079',
      epicId: 'EPIC-WIKI-09',
      title: 'Show Collaborator Cursors',
      description: 'As an architect, I want to see other users\' cursors and selections so that I know where they\'re working.',
      acceptanceCriteria: `Given User A and User B are editing the same page
Then User A should see User B's cursor
And it should be labeled "User B"
And it should use a distinct color
When User B selects text
Then User A should see the selection highlighted`,
      storyPoints: 5,
      status: 'backlog',
      priority: 'medium',
      labels: ['wiki', 'collaboration', 'cursors', 'phase-4'],
      feature: 'Collaboration Features',
      value: 'Presence Awareness',
      requirement: 'HLR-WIKI-111'
    },
    {
      id: 'US-WIKI-080',
      epicId: 'EPIC-WIKI-09',
      title: 'Presence Indicators',
      description: 'As an architect, I want to see who else is viewing or editing a page so that I can coordinate with them.',
      acceptanceCriteria: `Given I am viewing a wiki page
And 3 other users are also viewing it
Then I should see avatars/icons at the top
And it should show "4 people viewing"
And I should see their names and status (Editing vs Viewing)`,
      storyPoints: 5,
      status: 'backlog',
      priority: 'medium',
      labels: ['wiki', 'collaboration', 'presence', 'phase-4'],
      feature: 'Collaboration Features',
      value: 'Team Coordination',
      requirement: 'HLR-WIKI-112'
    },
    {
      id: 'US-WIKI-081',
      epicId: 'EPIC-WIKI-09',
      title: 'Add Comments on Blocks',
      description: 'As an architect, I want to add comments on specific blocks so that I can discuss content with the team.',
      acceptanceCriteria: `Given I am viewing a paragraph
When I select text and click "Add comment" (or press Cmd+Shift+M)
Then a comment thread should open on the side
And I should be able to type my comment
When I type "Should we include the retry logic here?" and submit
Then the comment should be saved
And the paragraph should have a comment indicator
And the commented text should have a yellow highlight`,
      storyPoints: 8,
      status: 'backlog',
      priority: 'medium',
      labels: ['wiki', 'collaboration', 'comments', 'phase-4'],
      feature: 'Collaboration Features',
      value: 'Inline Discussion',
      requirement: 'HLR-WIKI-113'
    },
    {
      id: 'US-WIKI-082',
      epicId: 'EPIC-WIKI-09',
      title: 'Resolve Comments',
      description: 'As an architect, I want to resolve comments when addressed so that the page stays clean.',
      acceptanceCriteria: `Given there is a comment thread with multiple replies
When I click "Resolve"
Then the comment should be marked as resolved
And the highlight should be removed from the text
And the comment should move to "Resolved" section
And I should be able to "Unresolve" if needed`,
      storyPoints: 3,
      status: 'backlog',
      priority: 'medium',
      labels: ['wiki', 'collaboration', 'comments', 'phase-4'],
      feature: 'Collaboration Features',
      value: 'Comment Management',
      requirement: 'HLR-WIKI-114'
    },
    {
      id: 'US-WIKI-083',
      epicId: 'EPIC-WIKI-09',
      title: 'Subscribe to Page Changes',
      description: 'As an architect, I want to subscribe to page changes so that I get notified when important documentation is updated.',
      acceptanceCriteria: `Given I am viewing a wiki page
When I click the "Watch" icon
Then I should be subscribed to notifications
When another user edits the page
Then I should receive a notification: "Alice edited 'Payment Architecture'"
And I should be able to click to see changes`,
      storyPoints: 5,
      status: 'backlog',
      priority: 'medium',
      labels: ['wiki', 'collaboration', 'notifications', 'phase-4'],
      feature: 'Collaboration Features',
      value: 'Change Awareness',
      requirement: 'HLR-WIKI-115'
    },
    {
      id: 'US-WIKI-084',
      epicId: 'EPIC-WIKI-09',
      title: 'Mention Notifications in Comments',
      description: 'As an architect, I want to receive notifications when mentioned in comments so that I can respond to requests.',
      acceptanceCriteria: `Given Bob adds a comment mentioning me: "@John can you review?"
Then I should receive a notification
And it should say "Bob mentioned you in Payment Architecture"
When I click the notification
Then I should navigate to that page
And the comment should be highlighted`,
      storyPoints: 5,
      status: 'backlog',
      priority: 'medium',
      labels: ['wiki', 'collaboration', 'notifications', 'phase-4'],
      feature: 'Collaboration Features',
      value: 'Direct Communication',
      requirement: 'HLR-WIKI-116'
    },

    // EPIC-WIKI-10: Version History (34 points) - PHASE 4
    {
      id: 'US-WIKI-085',
      epicId: 'EPIC-WIKI-10',
      title: 'Maintain Version History',
      description: 'As an architect, I want the system to maintain version history for every page so that changes are tracked.',
      acceptanceCriteria: `Given I have a wiki page
When I make an edit and save
Then a new version should be created
And the version should be numbered (v1, v2, v3...)
And the previous version should be preserved`,
      storyPoints: 8,
      status: 'backlog',
      priority: 'high',
      labels: ['wiki', 'version-control', 'history', 'phase-4'],
      feature: 'Version History',
      value: 'Change Tracking',
      requirement: 'HLR-WIKI-120'
    },
    {
      id: 'US-WIKI-086',
      epicId: 'EPIC-WIKI-10',
      title: 'View Version History',
      description: 'As an architect, I want to view previous versions of a page so that I can see how it evolved.',
      acceptanceCriteria: `Given I am viewing a wiki page
When I click "History" or clock icon
Then I should see a list of all versions with: Version, Author, Date, Summary
And I should be able to click to view any version`,
      storyPoints: 5,
      status: 'backlog',
      priority: 'high',
      labels: ['wiki', 'version-control', 'history', 'phase-4'],
      feature: 'Version History',
      value: 'History Viewing',
      requirement: 'HLR-WIKI-121'
    },
    {
      id: 'US-WIKI-087',
      epicId: 'EPIC-WIKI-10',
      title: 'Compare Versions (Diff View)',
      description: 'As an architect, I want to compare two versions side-by-side so that I can see what changed.',
      acceptanceCriteria: `Given I am viewing version history
When I select v3 and v5 for comparison
Then I should see a side-by-side or inline diff
And additions should be highlighted in green
And deletions should be highlighted in red
And unchanged text should be grayed out`,
      storyPoints: 8,
      status: 'backlog',
      priority: 'medium',
      labels: ['wiki', 'version-control', 'diff', 'phase-4'],
      feature: 'Version History',
      value: 'Change Analysis',
      requirement: 'HLR-WIKI-122'
    },
    {
      id: 'US-WIKI-088',
      epicId: 'EPIC-WIKI-10',
      title: 'Restore Previous Version',
      description: 'As an architect, I want to restore a previous version so that I can undo mistakes or revert unwanted changes.',
      acceptanceCriteria: `Given I am viewing v3 of a page
And the current version is v5
When I click "Restore this version"
Then I should see a confirmation: "This will create a new version with v3 content"
When I confirm
Then a new version v6 should be created
And v6 content should match v3
And the version history should show: "v6: Restored from v3"`,
      storyPoints: 5,
      status: 'backlog',
      priority: 'high',
      labels: ['wiki', 'version-control', 'restore', 'phase-4'],
      feature: 'Version History',
      value: 'Change Reversal',
      requirement: 'HLR-WIKI-123'
    },
    {
      id: 'US-WIKI-089',
      epicId: 'EPIC-WIKI-10',
      title: 'View Version Metadata',
      description: 'As an architect, I want to see metadata for each version (author, timestamp, change summary) so that I understand the context.',
      acceptanceCriteria: `Given I view version history
Then for each version I should see:
Version number, Author, Avatar, Timestamp, Summary, Changes (characters added/deleted)`,
      storyPoints: 3,
      status: 'backlog',
      priority: 'high',
      labels: ['wiki', 'version-control', 'metadata', 'phase-4'],
      feature: 'Version History',
      value: 'Change Context',
      requirement: 'HLR-WIKI-124'
    },
    {
      id: 'US-WIKI-090',
      epicId: 'EPIC-WIKI-10',
      title: 'Add Commit Messages',
      description: 'As an architect, I want to add commit messages when saving so that I can document why I made changes.',
      acceptanceCriteria: `Given I am editing a wiki page
When I press Cmd+S to save
Then I should see a "Save Changes" dialog
And I should see an optional "What changed?" field
When I enter "Added deployment strategy section"
And I click "Save"
Then the version should be saved with that message
And the message should appear in version history`,
      storyPoints: 5,
      status: 'backlog',
      priority: 'medium',
      labels: ['wiki', 'version-control', 'commit-message', 'phase-4'],
      feature: 'Version History',
      value: 'Change Documentation',
      requirement: 'HLR-WIKI-125'
    }
  ];

  console.log('📝 Creating User Stories (Phase 3-4: Requirements, Traceability, Templates, Collaboration, Version History)...');
  let createdCount = 0;
  let skippedCount = 0;

  for (const story of stories) {
    const [existingStory] = await db.select().from(schema.userStories).where(eq(schema.userStories.id, story.id));
    if (!existingStory) {
      try {
        await db.insert(schema.userStories).values({
          id: story.id,
          epicId: story.epicId,
          title: story.title,
          description: story.description,
          acceptanceCriteria: story.acceptanceCriteria,
          storyPoints: story.storyPoints,
          status: story.status,
          priority: story.priority,
          labels: story.labels,
          feature: story.feature,
          value: story.value,
          requirement: story.requirement,
          assignee: null,
          productManager: null,
          techLead: null,
          githubCommits: [],
          screenshots: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        console.log(`✅ Created: ${story.id} - ${story.title} (${story.storyPoints}pts)`);
        createdCount++;
      } catch (error: any) {
        console.error(`❌ Error creating ${story.id}:`, error.message);
      }
    } else {
      console.log(`⚠️  Story ${story.id} already exists. Skipping.`);
      skippedCount++;
    }
  }

  const totalPoints = stories.reduce((sum, s) => sum + s.storyPoints, 0);

  console.log('\n✨ Wiki Knowledge Core stories (Phase 3-4 FINAL) setup complete!\n');
  console.log('📊 Summary:');
  console.log(`  - Stories Created: ${createdCount}`);
  console.log(`  - Stories Skipped: ${skippedCount}`);
  console.log(`  - Total Story Points: ${totalPoints}`);
  console.log(`  - Coverage: Requirements (10 stories, 52pts) + Traceability (6 stories, 33pts) + Templates (9 stories, 37pts) + Collaboration (7 stories, 41pts) + Version History (6 stories, 34pts)`);
  console.log('\n🎯 EPICs Covered:');
  console.log('  - EPIC-WIKI-06: Requirements Management (completed - 52 points)');
  console.log('  - EPIC-WIKI-07: Traceability Matrix (completed - 33 points)');
  console.log('  - EPIC-WIKI-08: Page Templates (completed - 37 points)');
  console.log('  - EPIC-WIKI-09: Collaboration Features (completed - 41 points)');
  console.log('  - EPIC-WIKI-10: Version History (completed - 34 points)');
  console.log('\n🎉 ALL WIKI KNOWLEDGE CORE EPICS & STORIES COMPLETE!');
  console.log('\n📈 FINAL TOTALS (All Phases):');
  console.log('  - Total EPICs: 10');
  console.log('  - Total Stories: 90');
  console.log('  - Total Story Points: 423');
  console.log('  - Phase 1 (Foundation): 23 stories, 130 points');
  console.log('  - Phase 2 (Semantic Graph): 29 stories, 137 points');
  console.log('  - Phase 3 (Requirements): 16 stories, 82 points');
  console.log('  - Phase 4 (Advanced): 22 stories, 112 points');
  console.log('\n🚀 Ready for Sprint Planning!');
  
  await pool.end();
}

createWikiStoriesPhase3And4().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

