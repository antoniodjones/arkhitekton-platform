/**
 * Seed Wiki Sprint Stories into the Plan Module
 * 
 * This script creates all 50 user stories for the Wiki Knowledge Core
 * development plan, organized by sprint and linked to their EPICs.
 * 
 * Run: npx tsx scripts/seed-wiki-sprint-stories.ts
 */

import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../shared/schema';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const db = drizzle(pool, { schema });

interface StoryData {
  id: string;
  title: string;
  description: string;
  acceptanceCriteria: string;
  epicId: string;
  storyPoints: number;
  priority: 'high' | 'medium' | 'low';
  status: 'backlog' | 'sprint' | 'in-progress' | 'review' | 'done';
  labels: string[];
  sprint: string;
  hlr: string;
  targetDate?: Date;
}

async function seedWikiStories() {
  console.log('🏗️  Seeding Wiki Sprint Stories...\n');

  // Sprint W1: Foundation Polish - Target Jan 3, 2026
  const sprintW1Target = new Date('2026-01-03');
  
  // Sprint W2: Semantic Mentions - Target Jan 17, 2026
  const sprintW2Target = new Date('2026-01-17');
  
  // Sprint W3: Requirements Foundation - Target Jan 31, 2026
  const sprintW3Target = new Date('2026-01-31');
  
  // Sprint W4: Traceability - Target Feb 14, 2026
  const sprintW4Target = new Date('2026-02-14');
  
  // Sprint W5: Templates & Comments - Target Feb 28, 2026
  const sprintW5Target = new Date('2026-02-28');
  
  // Sprint W6: Real-time Collab - Target Mar 14, 2026
  const sprintW6Target = new Date('2026-03-14');
  
  // Sprint W7: Version History - Target Mar 28, 2026
  const sprintW7Target = new Date('2026-03-28');

  const stories: StoryData[] = [
    // ============ SPRINT W1: Foundation Polish (30 points) ============
    {
      id: 'US-WIKI-001',
      title: 'Auto-save drafts every 30 seconds',
      description: 'Implement automatic draft saving to prevent data loss. Store drafts in local storage with timestamp.',
      acceptanceCriteria: `Given I am editing a wiki page
And I type "This is important architecture"
When 30 seconds elapse without manual save
Then the content should be auto-saved as a draft
And I should see a subtle "Draft saved" indicator
And the draft should be stored in local storage
And the page updated_at should NOT change (it's a draft)`,
      epicId: 'EPIC-WIKI-01',
      storyPoints: 5,
      priority: 'high',
      status: 'backlog',
      labels: ['wiki', 'phase-1', 'auto-save', 'sprint-w1'],
      sprint: 'Sprint W1',
      hlr: 'HLR-WIKI-007',
      targetDate: sprintW1Target
    },
    {
      id: 'US-WIKI-002',
      title: 'Restore from auto-saved drafts',
      description: 'Allow users to restore content from auto-saved drafts when returning to a page.',
      acceptanceCriteria: `Given I was editing a page and it auto-saved a draft
And I closed the browser without publishing
When I return to the wiki and open that page
Then I should see a banner "You have an unsaved draft from [timestamp]"
And I should see "Restore Draft" and "Discard" buttons
When I click "Restore Draft"
Then the editor should load the draft content`,
      epicId: 'EPIC-WIKI-01',
      storyPoints: 3,
      priority: 'high',
      status: 'backlog',
      labels: ['wiki', 'phase-1', 'draft-restore', 'sprint-w1'],
      sprint: 'Sprint W1',
      hlr: 'HLR-WIKI-008',
      targetDate: sprintW1Target
    },
    {
      id: 'US-WIKI-003',
      title: 'Duplicate/clone existing pages',
      description: 'Allow users to create a copy of an existing wiki page with all its content.',
      acceptanceCriteria: `Given I have a page titled "ADR Template" with content
When I right-click on the page
And I select "Duplicate"
Then a new page should be created
And the new page should be titled "ADR Template (Copy)"
And the new page should have identical content to the original
And the new page should have a new unique ID
And I should be redirected to the new page`,
      epicId: 'EPIC-WIKI-01',
      storyPoints: 3,
      priority: 'medium',
      status: 'backlog',
      labels: ['wiki', 'phase-1', 'duplicate', 'sprint-w1'],
      sprint: 'Sprint W1',
      hlr: 'HLR-WIKI-006',
      targetDate: sprintW1Target
    },
    {
      id: 'US-WIKI-004',
      title: 'Delete with confirmation dialog',
      description: 'Implement safe deletion with a confirmation dialog to prevent accidental deletions.',
      acceptanceCriteria: `Given I have a page titled "Old Architecture"
When I click the delete button (trash icon)
Then I should see a confirmation dialog
And the dialog should say "Are you sure you want to delete 'Old Architecture'?"
And the dialog should have "Cancel" and "Delete" buttons
When I click "Delete"
Then the page should be permanently deleted
And I should be redirected to the wiki home`,
      epicId: 'EPIC-WIKI-01',
      storyPoints: 3,
      priority: 'high',
      status: 'backlog',
      labels: ['wiki', 'phase-1', 'delete', 'sprint-w1'],
      sprint: 'Sprint W1',
      hlr: 'HLR-WIKI-004',
      targetDate: sprintW1Target
    },
    {
      id: 'US-WIKI-005',
      title: 'Full-text search (title + content)',
      description: 'Implement comprehensive search that searches both page titles and content.',
      acceptanceCriteria: `Given I have pages titled "Payment Service", "Order Service", "Payment Gateway"
When I enter "Payment" in the wiki search box
Then I should see "Payment Service" and "Payment Gateway" in results
And "Order Service" should not appear
And results should highlight the matching term
And results should be sorted by relevance`,
      epicId: 'EPIC-WIKI-01',
      storyPoints: 5,
      priority: 'high',
      status: 'backlog',
      labels: ['wiki', 'phase-1', 'search', 'sprint-w1'],
      sprint: 'Sprint W1',
      hlr: 'HLR-WIKI-010',
      targetDate: sprintW1Target
    },
    {
      id: 'US-WIKI-006',
      title: 'Keyboard shortcuts reference (Cmd+/)',
      description: 'Display a keyboard shortcuts cheat sheet when pressing Cmd+/ or Ctrl+/.',
      acceptanceCriteria: `Given I am in the editor
When I press Cmd+/ (Mac) or Ctrl+/ (Windows)
Then a keyboard shortcuts reference should appear
And it should list all shortcuts:
| Cmd/Ctrl+B | Bold |
| Cmd/Ctrl+I | Italic |
| Cmd/Ctrl+S | Save |
| / | Slash commands |`,
      epicId: 'EPIC-WIKI-02',
      storyPoints: 3,
      priority: 'medium',
      status: 'backlog',
      labels: ['wiki', 'phase-1', 'keyboard', 'sprint-w1'],
      sprint: 'Sprint W1',
      hlr: 'HLR-WIKI-032',
      targetDate: sprintW1Target
    },
    {
      id: 'US-WIKI-007',
      title: 'Block drag-and-drop reordering',
      description: 'Allow users to drag blocks to reorder content within the editor.',
      acceptanceCriteria: `Given I have multiple blocks: H1, paragraph, code block
When I hover over the left side of a block
Then I should see a drag handle (⋮⋮ icon)
When I click and drag the handle
Then I should see a blue insertion indicator
When I drop at a new location
Then the block should be moved
And the page should auto-save`,
      epicId: 'EPIC-WIKI-02',
      storyPoints: 5,
      priority: 'medium',
      status: 'backlog',
      labels: ['wiki', 'phase-1', 'drag-drop', 'sprint-w1'],
      sprint: 'Sprint W1',
      hlr: 'HLR-WIKI-031',
      targetDate: sprintW1Target
    },
    {
      id: 'US-WIKI-008',
      title: 'Context menu (right-click) on tree',
      description: 'Implement a context menu when right-clicking pages in the tree navigation.',
      acceptanceCriteria: `Given I right-click on "Stripe Integration" in the tree
Then I should see a context menu with options:
| Open | Opens the page |
| Rename | Renames the page |
| Duplicate | Clones the page |
| Add Child Page | Creates child under this |
| Delete | Deletes the page |
| Move to... | Shows folder picker |`,
      epicId: 'EPIC-WIKI-03',
      storyPoints: 5,
      priority: 'high',
      status: 'backlog',
      labels: ['wiki', 'phase-1', 'context-menu', 'sprint-w1'],
      sprint: 'Sprint W1',
      hlr: 'HLR-WIKI-046',
      targetDate: sprintW1Target
    },

    // ============ SPRINT W2: Semantic Mentions Complete (30 points) ============
    {
      id: 'US-WIKI-009',
      title: 'Real-time status updates on mentions',
      description: 'When a mentioned entity changes status, update the mention chip color automatically.',
      acceptanceCriteria: `Given I have "@PaymentService" with status Active (green)
When an admin changes PaymentService status to Deprecated
And I refresh the wiki page
Then "@PaymentService" chip should update to orange
And the hover card should show status: Deprecated
And I should see a visual indicator that it changed`,
      epicId: 'EPIC-WIKI-04',
      storyPoints: 8,
      priority: 'high',
      status: 'backlog',
      labels: ['wiki', 'phase-2', 'mentions', 'real-time', 'sprint-w2'],
      sprint: 'Sprint W2',
      hlr: 'HLR-WIKI-063',
      targetDate: sprintW2Target
    },
    {
      id: 'US-WIKI-010',
      title: 'Search ADRs in mention picker',
      description: 'Enable searching for Architecture Decision Records in the @mention picker.',
      acceptanceCriteria: `Given the mention picker is open
When I type "@ADR-"
Then I should see matching ADR pages in results
And they should be marked with an ADR icon
When I select one
Then it should insert as a mention linking to that ADR`,
      epicId: 'EPIC-WIKI-04',
      storyPoints: 3,
      priority: 'medium',
      status: 'backlog',
      labels: ['wiki', 'phase-2', 'mentions', 'adr', 'sprint-w2'],
      sprint: 'Sprint W2',
      hlr: 'HLR-WIKI-057',
      targetDate: sprintW2Target
    },
    {
      id: 'US-WIKI-011',
      title: 'Search Requirements in mention picker',
      description: 'Enable searching for Requirement pages in the @mention picker.',
      acceptanceCriteria: `Given the mention picker is open
When I type "@REQ-"
Then I should see matching Requirement pages in results
And they should show the requirement type (Business/Product/Technical)
When I select one
Then it should insert as a clickable mention`,
      epicId: 'EPIC-WIKI-04',
      storyPoints: 3,
      priority: 'medium',
      status: 'backlog',
      labels: ['wiki', 'phase-2', 'mentions', 'requirements', 'sprint-w2'],
      sprint: 'Sprint W2',
      hlr: 'HLR-WIKI-056',
      targetDate: sprintW2Target
    },
    {
      id: 'US-WIKI-012',
      title: 'Search Users/Teams in mention picker',
      description: 'Enable searching for users and teams to @mention them in documentation.',
      acceptanceCriteria: `Given the mention picker is open
When I type "@john"
Then I should see matching users (john@company.com)
And they should show avatar and role
When I select a user
Then it should insert as a people mention
And the user should be notified`,
      epicId: 'EPIC-WIKI-04',
      storyPoints: 5,
      priority: 'medium',
      status: 'backlog',
      labels: ['wiki', 'phase-2', 'mentions', 'users', 'sprint-w2'],
      sprint: 'Sprint W2',
      hlr: 'HLR-WIKI-058',
      targetDate: sprintW2Target
    },
    {
      id: 'US-WIKI-013',
      title: 'Backlink snippets with context',
      description: 'Show surrounding text context in backlink lists to understand how entities are referenced.',
      acceptanceCriteria: `Given "Payment Architecture" contains:
"Our payment processing uses the @PaymentService component which connects to external gateways."
When I view backlinks for PaymentService
Then the snippet should show:
"...payment processing uses the @PaymentService component which connects..."
And the mention should be bolded in the snippet`,
      epicId: 'EPIC-WIKI-05',
      storyPoints: 5,
      priority: 'medium',
      status: 'backlog',
      labels: ['wiki', 'phase-2', 'backlinks', 'context', 'sprint-w2'],
      sprint: 'Sprint W2',
      hlr: 'HLR-WIKI-074',
      targetDate: sprintW2Target
    },
    {
      id: 'US-WIKI-014',
      title: 'Filter backlinks by page type',
      description: 'Allow filtering backlinks by the type of page (ADR, Design Doc, Guide, etc.).',
      acceptanceCriteria: `Given PaymentService is mentioned in ADR, Design Doc, and Guide pages
When I view PaymentService backlinks
Then I should see a filter dropdown
When I select "ADR only"
Then only ADR pages should be shown
And other page types should be hidden`,
      epicId: 'EPIC-WIKI-05',
      storyPoints: 3,
      priority: 'low',
      status: 'backlog',
      labels: ['wiki', 'phase-2', 'backlinks', 'filter', 'sprint-w2'],
      sprint: 'Sprint W2',
      hlr: 'HLR-WIKI-075',
      targetDate: sprintW2Target
    },
    {
      id: 'US-WIKI-015',
      title: 'Show backlinks on User Stories (Plan)',
      description: 'Display wiki backlinks on user stories in the Plan module.',
      acceptanceCriteria: `Given User Story US-PAY-001 is mentioned in wiki page "Sprint Planning"
When I view US-PAY-001 in Plan module
Then I should see "Mentioned in Wiki: 1 page"
When I click to expand
Then I should see "Sprint Planning" listed
And I can click to navigate to that page`,
      epicId: 'EPIC-WIKI-05',
      storyPoints: 3,
      priority: 'high',
      status: 'backlog',
      labels: ['wiki', 'phase-2', 'backlinks', 'plan-integration', 'sprint-w2'],
      sprint: 'Sprint W2',
      hlr: 'HLR-WIKI-072',
      targetDate: sprintW2Target
    },

    // ============ SPRINT W3: Requirements Foundation (32 points) ============
    {
      id: 'US-WIKI-016',
      title: 'Requirement page template',
      description: 'Create a structured template for requirement pages with all necessary fields.',
      acceptanceCriteria: `Given I click "New Page" → "From Template" → "Requirement"
Then a new page should be created with structure:
| Identifier | REQ-BUS-001 |
| Title | [Requirement name] |
| Type | [Business/Product/Technical] |
| Priority | [High/Medium/Low] |
| Status | Proposed |
| Description | [Rich text area] |
| Rationale | [Why this requirement exists] |
| Satisfied By | [Components] |
| Related Stories | [User Stories] |`,
      epicId: 'EPIC-WIKI-06',
      storyPoints: 8,
      priority: 'high',
      status: 'backlog',
      labels: ['wiki', 'phase-3', 'requirements', 'template', 'sprint-w3'],
      sprint: 'Sprint W3',
      hlr: 'HLR-WIKI-080',
      targetDate: sprintW3Target
    },
    {
      id: 'US-WIKI-017',
      title: 'Requirement identifier validation',
      description: 'Validate requirement identifiers follow the format REQ-[TYPE]-[NUMBER].',
      acceptanceCriteria: `Given I am creating a requirement
When I enter identifier "REQ-BUS-001"
Then the system should validate format (REQ-[TYPE]-[NUMBER])
And the system should check for uniqueness
And if duplicate, show error "Identifier already exists"`,
      epicId: 'EPIC-WIKI-06',
      storyPoints: 5,
      priority: 'high',
      status: 'backlog',
      labels: ['wiki', 'phase-3', 'requirements', 'validation', 'sprint-w3'],
      sprint: 'Sprint W3',
      hlr: 'HLR-WIKI-081',
      targetDate: sprintW3Target
    },
    {
      id: 'US-WIKI-018',
      title: 'Requirement type selector (Bus/Prod/Tech)',
      description: 'Add a type selector dropdown for Business, Product, or Technical requirements.',
      acceptanceCriteria: `Given I am editing a requirement
When I click the Type field
Then I should see dropdown: Business, Product, Technical
When I select "Business"
Then the requirement type should be set to Business
And the identifier prefix should suggest "REQ-BUS-"`,
      epicId: 'EPIC-WIKI-06',
      storyPoints: 3,
      priority: 'high',
      status: 'backlog',
      labels: ['wiki', 'phase-3', 'requirements', 'type', 'sprint-w3'],
      sprint: 'Sprint W3',
      hlr: 'HLR-WIKI-082',
      targetDate: sprintW3Target
    },
    {
      id: 'US-WIKI-019',
      title: 'Requirement priority & status fields',
      description: 'Add priority (High/Medium/Low) and status (Proposed/Accepted/Implemented/Deprecated) fields.',
      acceptanceCriteria: `Given I am editing a requirement
When I set Priority to "High"
And I set Status to "Accepted"
Then both should be saved as metadata
And High priority should display with red indicator
And Accepted status should display with green badge`,
      epicId: 'EPIC-WIKI-06',
      storyPoints: 5,
      priority: 'high',
      status: 'backlog',
      labels: ['wiki', 'phase-3', 'requirements', 'status', 'sprint-w3'],
      sprint: 'Sprint W3',
      hlr: 'HLR-WIKI-083-084',
      targetDate: sprintW3Target
    },
    {
      id: 'US-WIKI-020',
      title: 'Rich text description with @mentions',
      description: 'Allow rich text formatting and @mentions in requirement descriptions.',
      acceptanceCriteria: `Given I am editing a requirement
When I type in the Description section with markdown and @mentions
Then the rich text should be saved
And I can use formatting (headers, lists, code blocks)
And I can use @mentions to link to components/stories`,
      epicId: 'EPIC-WIKI-06',
      storyPoints: 5,
      priority: 'high',
      status: 'backlog',
      labels: ['wiki', 'phase-3', 'requirements', 'rich-text', 'sprint-w3'],
      sprint: 'Sprint W3',
      hlr: 'HLR-WIKI-085',
      targetDate: sprintW3Target
    },
    {
      id: 'US-WIKI-021',
      title: 'Link requirements to components',
      description: 'Allow linking requirements to components in the "Satisfied By" section.',
      acceptanceCriteria: `Given I am editing REQ-BUS-001
When I click "Add Component" in Satisfied By section
Then I should see a component picker
When I select "@PaymentService"
Then PaymentService should be linked
And the requirement should show "Satisfied by: @PaymentService"
And PaymentService page should show "Satisfies: REQ-BUS-001"`,
      epicId: 'EPIC-WIKI-06',
      storyPoints: 5,
      priority: 'high',
      status: 'backlog',
      labels: ['wiki', 'phase-3', 'requirements', 'linking', 'sprint-w3'],
      sprint: 'Sprint W3',
      hlr: 'HLR-WIKI-086',
      targetDate: sprintW3Target
    },
    {
      id: 'US-WIKI-022',
      title: 'Link requirements to user stories',
      description: 'Allow linking requirements to user stories in the "Related Stories" section.',
      acceptanceCriteria: `Given I am editing REQ-BUS-001
When I click "Add Story" in Related Stories section
When I select "@US-PAY-001"
Then the story should be linked
And the requirement should show it in metadata
And the story should show "Implements: REQ-BUS-001"`,
      epicId: 'EPIC-WIKI-06',
      storyPoints: 5,
      priority: 'high',
      status: 'backlog',
      labels: ['wiki', 'phase-3', 'requirements', 'stories', 'sprint-w3'],
      sprint: 'Sprint W3',
      hlr: 'HLR-WIKI-087',
      targetDate: sprintW3Target
    },

    // ============ SPRINT W4: Traceability (32 points) ============
    {
      id: 'US-WIKI-023',
      title: 'Convert text to requirement',
      description: 'Allow users to highlight text and convert it to a requirement with one click.',
      acceptanceCriteria: `Given I am editing meeting notes
And I have text: "The system must support 10K concurrent users"
When I select that text
And I right-click → "Create Requirement"
Then a new Requirement page should be created
And the selected text should be in the Description
And I should be prompted for Identifier, Type, Priority
And the original text should be replaced with @REQ-[ID] mention`,
      epicId: 'EPIC-WIKI-06',
      storyPoints: 8,
      priority: 'medium',
      status: 'backlog',
      labels: ['wiki', 'phase-3', 'requirements', 'convert', 'sprint-w4'],
      sprint: 'Sprint W4',
      hlr: 'HLR-WIKI-088',
      targetDate: sprintW4Target
    },
    {
      id: 'US-WIKI-024',
      title: 'Requirements table view',
      description: 'Create a dedicated table view showing all requirements with sortable/filterable columns.',
      acceptanceCriteria: `Given I have created multiple requirements
When I navigate to Wiki → Requirements view
Then I should see a table with columns:
| ID | REQ-BUS-001 |
| Title | Fast Payment Processing |
| Type | Business |
| Priority | High |
| Status | Accepted |
| Satisfied By | @PaymentService |
| Stories | @US-PAY-001 |
And I should be able to sort by any column
And I should be able to filter by Type, Priority, Status`,
      epicId: 'EPIC-WIKI-06',
      storyPoints: 8,
      priority: 'high',
      status: 'backlog',
      labels: ['wiki', 'phase-3', 'requirements', 'table', 'sprint-w4'],
      sprint: 'Sprint W4',
      hlr: 'HLR-WIKI-089',
      targetDate: sprintW4Target
    },
    {
      id: 'US-WIKI-025',
      title: 'Generate traceability matrix',
      description: 'Auto-generate a traceability matrix showing REQ → Component → Story mappings.',
      acceptanceCriteria: `Given I navigate to Wiki → Traceability
When the matrix loads
Then I should see a table with all requirements
And columns: ID, Title, Type, Priority, Components, Stories, Status
And I should see linking relationships displayed`,
      epicId: 'EPIC-WIKI-07',
      storyPoints: 8,
      priority: 'high',
      status: 'backlog',
      labels: ['wiki', 'phase-3', 'traceability', 'matrix', 'sprint-w4'],
      sprint: 'Sprint W4',
      hlr: 'HLR-WIKI-090',
      targetDate: sprintW4Target
    },
    {
      id: 'US-WIKI-026',
      title: 'Highlight unmet requirements',
      description: 'Highlight requirements that have no linked components or stories.',
      acceptanceCriteria: `Given I view the traceability matrix
Then REQ-BUS-003 (with no links) should have:
| Components | ⚠️ None |
| Stories | ⚠️ None |
And the row should be highlighted in yellow/orange
And there should be a filter "Show unmet only"`,
      epicId: 'EPIC-WIKI-07',
      storyPoints: 5,
      priority: 'high',
      status: 'backlog',
      labels: ['wiki', 'phase-3', 'traceability', 'unmet', 'sprint-w4'],
      sprint: 'Sprint W4',
      hlr: 'HLR-WIKI-093',
      targetDate: sprintW4Target
    },
    {
      id: 'US-WIKI-027',
      title: 'Export matrix to CSV',
      description: 'Allow exporting the traceability matrix to CSV for external reporting.',
      acceptanceCriteria: `Given I am viewing the traceability matrix
When I click "Export" → "CSV"
Then a CSV file should download
And it should contain all requirements data
And it should be openable in Excel`,
      epicId: 'EPIC-WIKI-07',
      storyPoints: 5,
      priority: 'medium',
      status: 'backlog',
      labels: ['wiki', 'phase-3', 'traceability', 'export', 'sprint-w4'],
      sprint: 'Sprint W4',
      hlr: 'HLR-WIKI-094',
      targetDate: sprintW4Target
    },
    {
      id: 'US-WIKI-028',
      title: 'Embed matrix in wiki pages',
      description: 'Allow embedding a live traceability matrix as a block in wiki pages.',
      acceptanceCriteria: `Given I am editing a wiki page "Architecture Review"
When I type "/traceability" in slash command
Then I should see "Traceability Matrix" option
When I select it
Then a live traceability matrix should be embedded
And it should auto-update as requirements change`,
      epicId: 'EPIC-WIKI-07',
      storyPoints: 5,
      priority: 'low',
      status: 'backlog',
      labels: ['wiki', 'phase-3', 'traceability', 'embed', 'sprint-w4'],
      sprint: 'Sprint W4',
      hlr: 'HLR-WIKI-095',
      targetDate: sprintW4Target
    },

    // ============ SPRINT W5: Templates & Comments (40 points) ============
    {
      id: 'US-WIKI-029',
      title: 'ADR template',
      description: 'Create an Architecture Decision Record template with all standard sections.',
      acceptanceCriteria: `Given I click "New Page" → "From Template" → "ADR"
Then a page should be created with sections:
- Status, Date, Deciders
- Context and Problem Statement
- Decision Drivers
- Considered Options
- Decision Outcome
- Consequences (Positive/Negative)
- Links`,
      epicId: 'EPIC-WIKI-08',
      storyPoints: 5,
      priority: 'high',
      status: 'backlog',
      labels: ['wiki', 'phase-4', 'templates', 'adr', 'sprint-w5'],
      sprint: 'Sprint W5',
      hlr: 'HLR-WIKI-100',
      targetDate: sprintW5Target
    },
    {
      id: 'US-WIKI-030',
      title: 'Solution Design Document template',
      description: 'Create a comprehensive solution design document template.',
      acceptanceCriteria: `Given I select "Solution Design Document" template
Then I should get structure with sections:
| Executive Summary |
| Business Context |
| Requirements |
| Proposed Solution |
| Architecture Diagram |
| Components |
| Data Model |
| Integration Points |
| Security Considerations |
| Risks & Mitigation |`,
      epicId: 'EPIC-WIKI-08',
      storyPoints: 5,
      priority: 'high',
      status: 'backlog',
      labels: ['wiki', 'phase-4', 'templates', 'design-doc', 'sprint-w5'],
      sprint: 'Sprint W5',
      hlr: 'HLR-WIKI-101',
      targetDate: sprintW5Target
    },
    {
      id: 'US-WIKI-031',
      title: 'Meeting Notes template',
      description: 'Create a meeting notes template with agenda, decisions, and action items.',
      acceptanceCriteria: `Given I select "Meeting Notes" template
Then I should get:
- Meeting Topic, Date (auto-filled), Attendees (@mentions)
- Agenda items
- Discussion notes
- Decisions Made with @Owner
- Action Items with checkboxes, @Assignee, Due Date`,
      epicId: 'EPIC-WIKI-08',
      storyPoints: 3,
      priority: 'medium',
      status: 'backlog',
      labels: ['wiki', 'phase-4', 'templates', 'meeting', 'sprint-w5'],
      sprint: 'Sprint W5',
      hlr: 'HLR-WIKI-103',
      targetDate: sprintW5Target
    },
    {
      id: 'US-WIKI-032',
      title: 'Business Case template',
      description: 'Create a business case template for proposing new initiatives.',
      acceptanceCriteria: `Given I select "Business Case" template
Then I should get sections:
- Executive Summary
- Problem Statement
- Proposed Solution
- Cost/Benefit Analysis
- Risks
- Success Metrics
- Timeline`,
      epicId: 'EPIC-WIKI-08',
      storyPoints: 3,
      priority: 'medium',
      status: 'backlog',
      labels: ['wiki', 'phase-4', 'templates', 'business-case', 'sprint-w5'],
      sprint: 'Sprint W5',
      hlr: 'HLR-WIKI-102',
      targetDate: sprintW5Target
    },
    {
      id: 'US-WIKI-033',
      title: 'RFC template',
      description: 'Create a Request for Comments template for technical proposals.',
      acceptanceCriteria: `Given I select "RFC" template
Then I should get:
- RFC Number, Title, Author, Status
- Summary
- Motivation
- Detailed Design
- Drawbacks
- Alternatives
- Open Questions`,
      epicId: 'EPIC-WIKI-08',
      storyPoints: 5,
      priority: 'medium',
      status: 'backlog',
      labels: ['wiki', 'phase-4', 'templates', 'rfc', 'sprint-w5'],
      sprint: 'Sprint W5',
      hlr: 'HLR-WIKI-106',
      targetDate: sprintW5Target
    },
    {
      id: 'US-WIKI-034',
      title: 'Custom template creation',
      description: 'Allow users to save any page structure as a reusable template.',
      acceptanceCriteria: `Given I am editing a page with my preferred structure
When I click "Page Options" → "Save as Template"
Then I should see a template creation dialog
When I enter name "Security Review Template"
And I click "Save"
Then my template should be saved
And it should appear in my template list`,
      epicId: 'EPIC-WIKI-08',
      storyPoints: 8,
      priority: 'medium',
      status: 'backlog',
      labels: ['wiki', 'phase-4', 'templates', 'custom', 'sprint-w5'],
      sprint: 'Sprint W5',
      hlr: 'HLR-WIKI-107',
      targetDate: sprintW5Target
    },
    {
      id: 'US-WIKI-035',
      title: 'Share templates with org',
      description: 'Allow sharing custom templates with the organization.',
      acceptanceCriteria: `Given I have created a custom template
When I go to template settings
And I toggle "Share with organization"
Then all team members should see this template
And it should appear in their "Organization Templates" section`,
      epicId: 'EPIC-WIKI-08',
      storyPoints: 5,
      priority: 'low',
      status: 'backlog',
      labels: ['wiki', 'phase-4', 'templates', 'share', 'sprint-w5'],
      sprint: 'Sprint W5',
      hlr: 'HLR-WIKI-108',
      targetDate: sprintW5Target
    },
    {
      id: 'US-WIKI-036',
      title: 'Add comments on blocks',
      description: 'Allow users to add comments on specific blocks/paragraphs.',
      acceptanceCriteria: `Given I am viewing a wiki page
When I hover over a paragraph
Then I should see a comment icon
When I click it and type "Need to clarify this"
Then the comment should be saved
And a yellow highlight should appear
And others should see the comment thread`,
      epicId: 'EPIC-WIKI-09',
      storyPoints: 8,
      priority: 'high',
      status: 'backlog',
      labels: ['wiki', 'phase-4', 'comments', 'sprint-w5'],
      sprint: 'Sprint W5',
      hlr: 'HLR-WIKI-113',
      targetDate: sprintW5Target
    },

    // ============ SPRINT W6: Real-time Collaboration (41 points) ============
    {
      id: 'US-WIKI-037',
      title: 'Real-time collaborative editing (Yjs)',
      description: 'Implement real-time multi-user editing using Yjs CRDT library.',
      acceptanceCriteria: `Given User A and User B are editing the same page
When User A types "The PaymentService handles transactions"
Then User B should see the text appear in real-time
And there should be no conflicts
And the text should appear within 200ms`,
      epicId: 'EPIC-WIKI-09',
      storyPoints: 10,
      priority: 'high',
      status: 'backlog',
      labels: ['wiki', 'phase-4', 'collaboration', 'yjs', 'sprint-w6'],
      sprint: 'Sprint W6',
      hlr: 'HLR-WIKI-110',
      targetDate: sprintW6Target
    },
    {
      id: 'US-WIKI-038',
      title: 'Collaborator cursors/selections',
      description: 'Show other users cursors and text selections in real-time.',
      acceptanceCriteria: `Given User A and User B are editing the same page
Then User A should see User B's cursor
And it should be labeled "User B"
And it should use a distinct color
When User B selects text
Then User A should see the selection highlighted`,
      epicId: 'EPIC-WIKI-09',
      storyPoints: 5,
      priority: 'medium',
      status: 'backlog',
      labels: ['wiki', 'phase-4', 'collaboration', 'cursors', 'sprint-w6'],
      sprint: 'Sprint W6',
      hlr: 'HLR-WIKI-111',
      targetDate: sprintW6Target
    },
    {
      id: 'US-WIKI-039',
      title: 'Presence indicators (who viewing)',
      description: 'Show avatars of users currently viewing or editing the page.',
      acceptanceCriteria: `Given I am viewing a wiki page
And 3 other users are also viewing it
Then I should see avatars/icons at the top
And it should show "4 people viewing"
And I should see who is Editing vs Viewing`,
      epicId: 'EPIC-WIKI-09',
      storyPoints: 5,
      priority: 'medium',
      status: 'backlog',
      labels: ['wiki', 'phase-4', 'collaboration', 'presence', 'sprint-w6'],
      sprint: 'Sprint W6',
      hlr: 'HLR-WIKI-112',
      targetDate: sprintW6Target
    },
    {
      id: 'US-WIKI-040',
      title: 'Resolve comments',
      description: 'Allow users to mark comments as resolved.',
      acceptanceCriteria: `Given a comment thread exists on a block
When I click "Resolve"
Then the comment should be marked resolved
And the yellow highlight should fade
And I should see who resolved it and when`,
      epicId: 'EPIC-WIKI-09',
      storyPoints: 3,
      priority: 'medium',
      status: 'backlog',
      labels: ['wiki', 'phase-4', 'comments', 'resolve', 'sprint-w6'],
      sprint: 'Sprint W6',
      hlr: 'HLR-WIKI-114',
      targetDate: sprintW6Target
    },
    {
      id: 'US-WIKI-041',
      title: 'Subscribe to page changes',
      description: 'Allow users to subscribe to notifications when a page is updated.',
      acceptanceCriteria: `Given I am viewing a wiki page
When I click "Subscribe" (bell icon)
Then I should be subscribed to that page
When someone else edits the page
Then I should receive a notification
And I can choose to be notified on edits, comments, or mentions`,
      epicId: 'EPIC-WIKI-09',
      storyPoints: 5,
      priority: 'medium',
      status: 'backlog',
      labels: ['wiki', 'phase-4', 'notifications', 'subscribe', 'sprint-w6'],
      sprint: 'Sprint W6',
      hlr: 'HLR-WIKI-115',
      targetDate: sprintW6Target
    },
    {
      id: 'US-WIKI-042',
      title: '@mention notifications in comments',
      description: 'Notify users when they are @mentioned in comments.',
      acceptanceCriteria: `Given I add a comment "@john please review this"
When I post the comment
Then john@company.com should receive a notification
And the notification should link directly to the comment
And the mention should be highlighted`,
      epicId: 'EPIC-WIKI-09',
      storyPoints: 5,
      priority: 'medium',
      status: 'backlog',
      labels: ['wiki', 'phase-4', 'notifications', 'mentions', 'sprint-w6'],
      sprint: 'Sprint W6',
      hlr: 'HLR-WIKI-116',
      targetDate: sprintW6Target
    },
    {
      id: 'US-WIKI-043',
      title: 'Runbook template',
      description: 'Create a runbook template for operational procedures.',
      acceptanceCriteria: `Given I select "Runbook" template
Then I should get:
- Runbook Title, Service
- Prerequisites
- Step-by-step procedures
- Rollback steps
- Troubleshooting
- Contacts`,
      epicId: 'EPIC-WIKI-08',
      storyPoints: 3,
      priority: 'low',
      status: 'backlog',
      labels: ['wiki', 'phase-4', 'templates', 'runbook', 'sprint-w6'],
      sprint: 'Sprint W6',
      hlr: 'HLR-WIKI-105',
      targetDate: sprintW6Target
    },
    {
      id: 'US-WIKI-044',
      title: 'Onboarding Guide template',
      description: 'Create an onboarding guide template for new team members.',
      acceptanceCriteria: `Given I select "Onboarding Guide" template
Then I should get:
- Welcome section
- Team overview
- Key contacts
- Setup instructions
- Important links
- FAQ`,
      epicId: 'EPIC-WIKI-08',
      storyPoints: 3,
      priority: 'low',
      status: 'backlog',
      labels: ['wiki', 'phase-4', 'templates', 'onboarding', 'sprint-w6'],
      sprint: 'Sprint W6',
      hlr: 'HLR-WIKI-104',
      targetDate: sprintW6Target
    },

    // ============ SPRINT W7: Version History (34 points) ============
    {
      id: 'US-WIKI-045',
      title: 'Maintain version history',
      description: 'Automatically save a new version each time a page is published.',
      acceptanceCriteria: `Given I edit and save a wiki page
Then a new version should be created
And it should have a version number (incrementing)
And it should store the full content snapshot
And it should record who saved and when`,
      epicId: 'EPIC-WIKI-10',
      storyPoints: 8,
      priority: 'high',
      status: 'backlog',
      labels: ['wiki', 'phase-4', 'versioning', 'history', 'sprint-w7'],
      sprint: 'Sprint W7',
      hlr: 'HLR-WIKI-120',
      targetDate: sprintW7Target
    },
    {
      id: 'US-WIKI-046',
      title: 'View previous versions',
      description: 'Allow users to browse and view previous versions of a page.',
      acceptanceCriteria: `Given a page has 5 versions
When I click "Version History" (clock icon)
Then I should see a list of all versions
And each version should show: version number, author, date
When I click on version 3
Then I should see the page as it was in version 3`,
      epicId: 'EPIC-WIKI-10',
      storyPoints: 5,
      priority: 'high',
      status: 'backlog',
      labels: ['wiki', 'phase-4', 'versioning', 'view', 'sprint-w7'],
      sprint: 'Sprint W7',
      hlr: 'HLR-WIKI-121',
      targetDate: sprintW7Target
    },
    {
      id: 'US-WIKI-047',
      title: 'Compare versions (diff view)',
      description: 'Allow users to compare two versions side-by-side with highlighted differences.',
      acceptanceCriteria: `Given I am viewing version history
When I select version 3 and version 5
And I click "Compare"
Then I should see a side-by-side diff view
And additions should be highlighted in green
And deletions should be highlighted in red
And I should be able to switch to inline diff mode`,
      epicId: 'EPIC-WIKI-10',
      storyPoints: 8,
      priority: 'high',
      status: 'backlog',
      labels: ['wiki', 'phase-4', 'versioning', 'diff', 'sprint-w7'],
      sprint: 'Sprint W7',
      hlr: 'HLR-WIKI-122',
      targetDate: sprintW7Target
    },
    {
      id: 'US-WIKI-048',
      title: 'Restore previous version',
      description: 'Allow users to restore a page to a previous version.',
      acceptanceCriteria: `Given I am viewing version 3 of a page
When I click "Restore this version"
Then I should see a confirmation dialog
When I confirm
Then the page should be restored to version 3 content
And a new version (6) should be created with the restored content
And the history should show "Restored from version 3"`,
      epicId: 'EPIC-WIKI-10',
      storyPoints: 5,
      priority: 'high',
      status: 'backlog',
      labels: ['wiki', 'phase-4', 'versioning', 'restore', 'sprint-w7'],
      sprint: 'Sprint W7',
      hlr: 'HLR-WIKI-123',
      targetDate: sprintW7Target
    },
    {
      id: 'US-WIKI-049',
      title: 'Version metadata (author, timestamp)',
      description: 'Display comprehensive metadata for each version.',
      acceptanceCriteria: `Given I view version history
Then each version should show:
- Version number
- Author name and avatar
- Timestamp (relative and absolute)
- Commit message (if provided)
- Size/changes summary`,
      epicId: 'EPIC-WIKI-10',
      storyPoints: 3,
      priority: 'medium',
      status: 'backlog',
      labels: ['wiki', 'phase-4', 'versioning', 'metadata', 'sprint-w7'],
      sprint: 'Sprint W7',
      hlr: 'HLR-WIKI-124',
      targetDate: sprintW7Target
    },
    {
      id: 'US-WIKI-050',
      title: 'Commit messages when saving',
      description: 'Allow users to add optional commit messages when saving pages.',
      acceptanceCriteria: `Given I am saving a wiki page
When I press Cmd+S or click Save
Then I should see an optional "Commit message" field
When I enter "Added security considerations section"
Then the version should include that message
And the message should appear in version history`,
      epicId: 'EPIC-WIKI-10',
      storyPoints: 5,
      priority: 'medium',
      status: 'backlog',
      labels: ['wiki', 'phase-4', 'versioning', 'commit-message', 'sprint-w7'],
      sprint: 'Sprint W7',
      hlr: 'HLR-WIKI-125',
      targetDate: sprintW7Target
    }
  ];

  console.log(`📝 Preparing to insert ${stories.length} user stories...\n`);

  let insertedCount = 0;
  let skippedCount = 0;

  for (const story of stories) {
    try {
      // Check if story already exists
      const existing = await db.select()
        .from(schema.userStories)
        .where(schema.eq(schema.userStories.id, story.id))
        .limit(1);

      if (existing.length > 0) {
        console.log(`⏭️  Skipping ${story.id} - already exists`);
        skippedCount++;
        continue;
      }

      // Insert story
      await db.insert(schema.userStories).values({
        id: story.id,
        title: story.title,
        description: story.description,
        acceptanceCriteria: story.acceptanceCriteria,
        epicId: story.epicId,
        storyPoints: story.storyPoints,
        priority: story.priority,
        status: story.status,
        labels: story.labels,
        feature: story.sprint,
        requirement: story.hlr,
        targetDate: story.targetDate,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      console.log(`✅ Created ${story.id}: ${story.title.substring(0, 50)}...`);
      insertedCount++;

    } catch (error: any) {
      console.error(`❌ Error inserting ${story.id}: ${error.message}`);
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   Inserted: ${insertedCount} stories`);
  console.log(`   Skipped:  ${skippedCount} stories (already exist)`);
  console.log(`   Total:    ${stories.length} stories`);

  await pool.end();
  console.log('\n✅ Done!');
}

seedWikiStories().catch(console.error);

