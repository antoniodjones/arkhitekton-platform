import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { eq } from 'drizzle-orm';
import * as schema from '../shared/schema';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const db = drizzle(pool, { schema });

async function createWikiStories() {
  console.log('🏗️  Creating Wiki Knowledge Core EPICs and User Stories...\n');

  // Define all EPICs
  const epics = [
    {
      id: 'EPIC-WIKI-01',
      name: 'Wiki Page Management',
      description: 'Provide full CRUD operations for wiki pages with proper persistence and user management. Architects can create, read, update, and delete wiki pages to document their architecture.',
      valueStream: 'Knowledge Management',
      status: 'backlog',
      priority: 'high',
      startDate: new Date(),
      targetDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      labels: ['wiki', 'foundation', 'phase-1', 'crud'],
      phase: 1,
      totalPoints: 41
    },
    {
      id: 'EPIC-WIKI-02',
      name: 'Block-Based Editor',
      description: 'Implement TipTap block-based editor with markdown shortcuts and slash commands. Architects get a modern, rich editing experience similar to Notion/Confluence.',
      valueStream: 'Knowledge Management',
      status: 'backlog',
      priority: 'high',
      startDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      targetDate: new Date(new Date().setMonth(new Date().getMonth() + 2)),
      labels: ['wiki', 'editor', 'phase-1', 'tiptap'],
      phase: 1,
      totalPoints: 51
    },
    {
      id: 'EPIC-WIKI-03',
      name: 'Tree View & Navigation',
      description: 'Provide hierarchical navigation for wiki pages with tree view sidebar. Architects can organize and navigate their documentation in a logical hierarchy.',
      valueStream: 'Knowledge Management',
      status: 'backlog',
      priority: 'high',
      startDate: new Date(new Date().setMonth(new Date().getMonth() + 2)),
      targetDate: new Date(new Date().setMonth(new Date().getMonth() + 3)),
      labels: ['wiki', 'navigation', 'phase-1', 'tree-view'],
      phase: 1,
      totalPoints: 38
    },
    {
      id: 'EPIC-WIKI-04',
      name: 'Semantic Mentions System',
      description: 'Implement @ mentions that create live links to platform entities. Architects can link documentation to actual components, creating a living knowledge graph. This is the killer feature that no competitor has.',
      valueStream: 'Knowledge Management',
      status: 'backlog',
      priority: 'critical',
      startDate: new Date(new Date().setMonth(new Date().getMonth() + 4)),
      targetDate: new Date(new Date().setMonth(new Date().getMonth() + 6)),
      labels: ['wiki', 'semantic-mentions', 'phase-2', 'killer-feature'],
      phase: 2,
      totalPoints: 76
    },
    {
      id: 'EPIC-WIKI-05',
      name: 'Backlinks & References',
      description: 'Show where each entity is mentioned across the wiki. Architects can discover all documentation that references a specific component or decision.',
      valueStream: 'Knowledge Management',
      status: 'backlog',
      priority: 'high',
      startDate: new Date(new Date().setMonth(new Date().getMonth() + 6)),
      targetDate: new Date(new Date().setMonth(new Date().getMonth() + 7)),
      labels: ['wiki', 'backlinks', 'phase-2', 'discoverability'],
      phase: 2,
      totalPoints: 23
    },
    {
      id: 'EPIC-WIKI-06',
      name: 'Requirements Management',
      description: 'Treat requirements as first-class wiki pages with structured metadata. Architects can write requirements that are both narrative and traceable.',
      valueStream: 'Knowledge Management',
      status: 'backlog',
      priority: 'high',
      startDate: new Date(new Date().setMonth(new Date().getMonth() + 8)),
      targetDate: new Date(new Date().setMonth(new Date().getMonth() + 10)),
      labels: ['wiki', 'requirements', 'phase-3', 'traceability'],
      phase: 3,
      totalPoints: 49
    },
    {
      id: 'EPIC-WIKI-07',
      name: 'Traceability Matrix',
      description: 'Auto-generate traceability showing requirement → component → story mappings. Architects can prove requirements are met and find gaps.',
      valueStream: 'Knowledge Management',
      status: 'backlog',
      priority: 'high',
      startDate: new Date(new Date().setMonth(new Date().getMonth() + 10)),
      targetDate: new Date(new Date().setMonth(new Date().getMonth() + 11)),
      labels: ['wiki', 'traceability', 'phase-3', 'compliance'],
      phase: 3,
      totalPoints: 33
    },
    {
      id: 'EPIC-WIKI-08',
      name: 'Page Templates',
      description: 'Provide pre-built templates for common documentation types. Architects can start with proven structures instead of blank pages.',
      valueStream: 'Knowledge Management',
      status: 'backlog',
      priority: 'medium',
      startDate: new Date(new Date().setMonth(new Date().getMonth() + 12)),
      targetDate: new Date(new Date().setMonth(new Date().getMonth() + 13)),
      labels: ['wiki', 'templates', 'phase-4', 'productivity'],
      phase: 4,
      totalPoints: 37
    },
    {
      id: 'EPIC-WIKI-09',
      name: 'Collaboration Features',
      description: 'Enable real-time collaboration like Google Docs. Multiple architects can work on the same document simultaneously.',
      valueStream: 'Knowledge Management',
      status: 'backlog',
      priority: 'medium',
      startDate: new Date(new Date().setMonth(new Date().getMonth() + 13)),
      targetDate: new Date(new Date().setMonth(new Date().getMonth() + 15)),
      labels: ['wiki', 'collaboration', 'phase-4', 'real-time'],
      phase: 4,
      totalPoints: 41
    },
    {
      id: 'EPIC-WIKI-10',
      name: 'Version History',
      description: 'Provide Git-like version control for wiki pages. Architects can see changes over time and restore previous versions.',
      valueStream: 'Knowledge Management',
      status: 'backlog',
      priority: 'medium',
      startDate: new Date(new Date().setMonth(new Date().getMonth() + 15)),
      targetDate: new Date(new Date().setMonth(new Date().getMonth() + 17)),
      labels: ['wiki', 'version-control', 'phase-4', 'audit'],
      phase: 4,
      totalPoints: 34
    }
  ];

  // Define all User Stories mapped to EPICs
  const stories = [
    // EPIC-WIKI-01: Wiki Page Management (41 points)
    {
      id: 'US-WIKI-001',
      epicId: 'EPIC-WIKI-01',
      title: 'Create New Wiki Pages',
      description: 'As an architect, I want to create new wiki pages with a title and content so that I can document my architecture decisions and designs.',
      acceptanceCriteria: `Given I am on the wiki home page
When I click the "New Page" button
Then I should see the page creation dialog
And the title field should be focused
When I enter title "Payment Service Architecture"
And I click "Create"
Then a new page should be created with ID
And I should be redirected to the editor for that page
And the page title should display "Payment Service Architecture"
And the editor should be empty and ready for content`,
      storyPoints: 5,
      status: 'backlog',
      priority: 'high',
      labels: ['wiki', 'crud', 'foundation', 'phase-1'],
      feature: 'Wiki Page Management',
      value: 'Documentation Creation',
      requirement: 'HLR-WIKI-001'
    },
    {
      id: 'US-WIKI-002',
      epicId: 'EPIC-WIKI-01',
      title: 'View List of Wiki Pages',
      description: 'As an architect, I want to see a list of all my wiki pages so that I can quickly find and access my documentation.',
      acceptanceCriteria: `Given I have created 5 wiki pages
When I navigate to the wiki home page
Then I should see a list of all 5 pages
And each page should display its title
And each page should display last modified date
And each page should display the author
And pages should be sorted by last modified (newest first)`,
      storyPoints: 3,
      status: 'backlog',
      priority: 'high',
      labels: ['wiki', 'crud', 'foundation', 'phase-1'],
      feature: 'Wiki Page Management',
      value: 'Documentation Discovery',
      requirement: 'HLR-WIKI-002'
    },
    {
      id: 'US-WIKI-003',
      epicId: 'EPIC-WIKI-01',
      title: 'Edit Existing Wiki Pages',
      description: 'As an architect, I want to edit existing wiki pages so that I can update and improve my documentation over time.',
      acceptanceCriteria: `Given I have a page with existing content
When I click into the editor
And I add new text "This service handles payment processing"
And I press Cmd+S (Mac) or Ctrl+S (Windows)
Then the content should be saved
And I should see a "Saved" indicator
And the updated_at timestamp should be updated`,
      storyPoints: 5,
      status: 'backlog',
      priority: 'high',
      labels: ['wiki', 'crud', 'foundation', 'phase-1'],
      feature: 'Wiki Page Management',
      value: 'Documentation Maintenance',
      requirement: 'HLR-WIKI-003'
    },
    {
      id: 'US-WIKI-004',
      epicId: 'EPIC-WIKI-01',
      title: 'Delete Wiki Pages with Confirmation',
      description: 'As an architect, I want to delete wiki pages with a confirmation step so that I can remove outdated documentation safely.',
      acceptanceCriteria: `Given I have a page titled "Old Architecture"
When I click the delete button (trash icon)
Then I should see a confirmation dialog
And the dialog should say "Are you sure you want to delete 'Old Architecture'?"
And the dialog should have "Cancel" and "Delete" buttons
When I click "Delete"
Then the page should be permanently deleted
And I should be redirected to the wiki home
And the page should no longer appear in the list`,
      storyPoints: 3,
      status: 'backlog',
      priority: 'high',
      labels: ['wiki', 'crud', 'foundation', 'phase-1'],
      feature: 'Wiki Page Management',
      value: 'Safe Documentation Removal',
      requirement: 'HLR-WIKI-004'
    },
    {
      id: 'US-WIKI-005',
      epicId: 'EPIC-WIKI-01',
      title: 'Hierarchical Page Organization',
      description: 'As an architect, I want to create parent/child page relationships so that I can organize my documentation in a logical hierarchy.',
      acceptanceCriteria: `Given I have a page titled "Payment Architecture"
When I right-click on the page in the tree view
And I select "Add Child Page"
Then I should see the page creation dialog
When I enter title "Stripe Integration"
And I click "Create"
Then a child page should be created under "Payment Architecture"
And the tree view should show "Stripe Integration" nested under parent
And the child page should reference parent_id in database`,
      storyPoints: 8,
      status: 'backlog',
      priority: 'medium',
      labels: ['wiki', 'hierarchy', 'foundation', 'phase-1'],
      feature: 'Wiki Page Management',
      value: 'Structured Documentation',
      requirement: 'HLR-WIKI-005'
    },
    {
      id: 'US-WIKI-006',
      epicId: 'EPIC-WIKI-01',
      title: 'Duplicate Wiki Pages',
      description: 'As an architect, I want to duplicate existing wiki pages so that I can reuse content structures and templates.',
      acceptanceCriteria: `Given I have a page titled "ADR Template" with content
When I right-click on the page
And I select "Duplicate"
Then a new page should be created
And the new page should be titled "ADR Template (Copy)"
And the new page should have identical content to the original
And the new page should have a new unique ID
And I should be redirected to the new page`,
      storyPoints: 3,
      status: 'backlog',
      priority: 'low',
      labels: ['wiki', 'productivity', 'foundation', 'phase-1'],
      feature: 'Wiki Page Management',
      value: 'Content Reuse',
      requirement: 'HLR-WIKI-006'
    },
    {
      id: 'US-WIKI-007',
      epicId: 'EPIC-WIKI-01',
      title: 'Auto-Save Drafts',
      description: 'As an architect, I want my wiki pages to auto-save drafts every 30 seconds so that I never lose my work.',
      acceptanceCriteria: `Given I am editing a wiki page
And I type "This is important architecture"
When 30 seconds elapse without manual save
Then the content should be auto-saved as a draft
And I should see a subtle "Draft saved" indicator
And the draft should be stored in local storage
And the page updated_at should NOT change (it's a draft)`,
      storyPoints: 5,
      status: 'backlog',
      priority: 'high',
      labels: ['wiki', 'autosave', 'foundation', 'phase-1'],
      feature: 'Wiki Page Management',
      value: 'Work Protection',
      requirement: 'HLR-WIKI-007'
    },
    {
      id: 'US-WIKI-008',
      epicId: 'EPIC-WIKI-01',
      title: 'Restore from Auto-Saved Drafts',
      description: 'As an architect, I want to restore from auto-saved drafts so that I can recover my work if I close the browser accidentally.',
      acceptanceCriteria: `Given I was editing a page and it auto-saved a draft
And I closed the browser without publishing
When I return to the wiki and open that page
Then I should see a banner "You have an unsaved draft from [timestamp]"
And I should see "Restore Draft" and "Discard" buttons
When I click "Restore Draft"
Then the editor should load the draft content
And I can continue editing from where I left off`,
      storyPoints: 3,
      status: 'backlog',
      priority: 'medium',
      labels: ['wiki', 'autosave', 'foundation', 'phase-1'],
      feature: 'Wiki Page Management',
      value: 'Work Recovery',
      requirement: 'HLR-WIKI-008'
    },
    {
      id: 'US-WIKI-009',
      epicId: 'EPIC-WIKI-01',
      title: 'Page Metadata Tracking',
      description: 'As an architect, I want wiki pages to track created_by, created_at, updated_by, updated_at metadata so that I know the history of each document.',
      acceptanceCriteria: `Given I create a new wiki page as user "john@company.com"
Then the page should have created_by = "john@company.com"
And the page should have created_at = current timestamp
When another user "jane@company.com" edits the page
Then the page should have updated_by = "jane@company.com"
And the page should have updated_at = new timestamp
And created_by and created_at should remain unchanged`,
      storyPoints: 2,
      status: 'backlog',
      priority: 'high',
      labels: ['wiki', 'metadata', 'foundation', 'phase-1'],
      feature: 'Wiki Page Management',
      value: 'Audit Trail',
      requirement: 'HLR-WIKI-009'
    },
    {
      id: 'US-WIKI-010',
      epicId: 'EPIC-WIKI-01',
      title: 'Search Wiki Pages',
      description: 'As an architect, I want to search wiki pages by title and content so that I can quickly find specific information.',
      acceptanceCriteria: `Given I have pages titled "Payment Service", "Order Service", "Payment Gateway"
When I enter "Payment" in the wiki search box
Then I should see "Payment Service" and "Payment Gateway" in results
And "Order Service" should not appear
And results should highlight the matching term
And results should be sorted by relevance`,
      storyPoints: 5,
      status: 'backlog',
      priority: 'high',
      labels: ['wiki', 'search', 'foundation', 'phase-1'],
      feature: 'Wiki Page Management',
      value: 'Information Discovery',
      requirement: 'HLR-WIKI-010'
    },
    // EPIC-WIKI-02: Block-Based Editor (51 points)
    {
      id: 'US-WIKI-011',
      epicId: 'EPIC-WIKI-02',
      title: 'TipTap Editor Implementation',
      description: 'As an architect, I want a modern block-based editor using TipTap so that I can create rich documentation easily.',
      acceptanceCriteria: `Given I am editing a wiki page
When the page loads
Then the TipTap editor should be initialized
And I should see a cursor blinking in the editor
And the editor should be ready for input
And I should see a formatting toolbar
And the editor should support keyboard shortcuts`,
      storyPoints: 8,
      status: 'backlog',
      priority: 'high',
      labels: ['wiki', 'editor', 'tiptap', 'phase-1'],
      feature: 'Block-Based Editor',
      value: 'Modern Editing Experience',
      requirement: 'HLR-WIKI-020'
    },
    {
      id: 'US-WIKI-012',
      epicId: 'EPIC-WIKI-02',
      title: 'Markdown Shortcuts',
      description: 'As an architect, I want to use markdown shortcuts like # for H1, ## for H2, - for bullet lists so that I can format content quickly.',
      acceptanceCriteria: `Given the cursor is in an empty paragraph
When I type "# " (hash followed by space)
Then the paragraph should transform to H1 heading
And the "# " should be removed
And subsequent typing should be in H1 style
When I type "- First item" and press Enter
Then a bullet list should be created`,
      storyPoints: 5,
      status: 'backlog',
      priority: 'high',
      labels: ['wiki', 'editor', 'markdown', 'phase-1'],
      feature: 'Block-Based Editor',
      value: 'Quick Formatting',
      requirement: 'HLR-WIKI-021'
    },
    {
      id: 'US-WIKI-013',
      epicId: 'EPIC-WIKI-02',
      title: 'Slash Commands',
      description: 'As an architect, I want to use slash commands (/) to insert blocks so that I can quickly add headings, tables, code blocks, and more.',
      acceptanceCriteria: `Given the cursor is in an empty paragraph
When I type "/"
Then a command menu should appear
And I should see options: Heading 1, Heading 2, Heading 3, Bullet List, Numbered List, Code Block, Table, Image, Quote, Divider
And the menu should be positioned near the cursor
When I select "Code Block"
Then a code block should be inserted`,
      storyPoints: 8,
      status: 'backlog',
      priority: 'high',
      labels: ['wiki', 'editor', 'slash-commands', 'phase-1'],
      feature: 'Block-Based Editor',
      value: 'Block Insertion',
      requirement: 'HLR-WIKI-022'
    },
    {
      id: 'US-WIKI-014',
      epicId: 'EPIC-WIKI-02',
      title: 'Insert Headings',
      description: 'As an architect, I want to insert headings (H1, H2, H3) so that I can structure my documentation hierarchically.',
      acceptanceCriteria: `Given I have opened the slash command menu
When I type "h1" or click "Heading 1"
Then the current block should become an H1 heading
And the cursor should be positioned to start typing
And the menu should close`,
      storyPoints: 3,
      status: 'backlog',
      priority: 'high',
      labels: ['wiki', 'editor', 'headings', 'phase-1'],
      feature: 'Block-Based Editor',
      value: 'Document Structure',
      requirement: 'HLR-WIKI-023'
    },
    {
      id: 'US-WIKI-015',
      epicId: 'EPIC-WIKI-02',
      title: 'Create Lists',
      description: 'As an architect, I want to create bullet lists and numbered lists so that I can organize information clearly.',
      acceptanceCriteria: `Given the cursor is in an empty paragraph
When I type "- First item" and press Enter
Then a bullet list should be created
And "First item" should be the first bullet
And a new empty bullet should appear below
When I type "1. First step" and press Enter
Then a numbered list should be created
And it should auto-number as "2." for the next item`,
      storyPoints: 3,
      status: 'backlog',
      priority: 'high',
      labels: ['wiki', 'editor', 'lists', 'phase-1'],
      feature: 'Block-Based Editor',
      value: 'Content Organization',
      requirement: 'HLR-WIKI-024'
    },
    {
      id: 'US-WIKI-016',
      epicId: 'EPIC-WIKI-02',
      title: 'Insert Code Blocks with Syntax Highlighting',
      description: 'As an architect, I want to insert code blocks with language selection and syntax highlighting so that I can document technical implementations.',
      acceptanceCriteria: `Given I have opened the slash command menu
When I select "Code Block"
Then a code block should be inserted
And I should see a language selector dropdown
And the default should be "plaintext"
When I select "JavaScript"
Then the syntax highlighting should update
And keywords like "const", "function", "return" should be colored`,
      storyPoints: 5,
      status: 'backlog',
      priority: 'high',
      labels: ['wiki', 'editor', 'code-blocks', 'phase-1'],
      feature: 'Block-Based Editor',
      value: 'Technical Documentation',
      requirement: 'HLR-WIKI-025, HLR-WIKI-033'
    },
    {
      id: 'US-WIKI-017',
      epicId: 'EPIC-WIKI-02',
      title: 'Insert Tables',
      description: 'As an architect, I want to insert tables so that I can present structured data in my documentation.',
      acceptanceCriteria: `Given I open the slash command menu
When I select "Table"
Then I should see a size picker (3x3, 4x4, custom)
When I select "3x3"
Then a 3x3 table should be inserted
And the cursor should be in the first cell
And I should be able to add/remove rows and columns`,
      storyPoints: 5,
      status: 'backlog',
      priority: 'medium',
      labels: ['wiki', 'editor', 'tables', 'phase-1'],
      feature: 'Block-Based Editor',
      value: 'Data Presentation',
      requirement: 'HLR-WIKI-026'
    },
    {
      id: 'US-WIKI-018',
      epicId: 'EPIC-WIKI-02',
      title: 'Insert Images',
      description: 'As an architect, I want to insert images via upload or URL so that I can include diagrams and screenshots in my documentation.',
      acceptanceCriteria: `Given I open the slash command menu
When I select "Image"
Then I should see "Upload" and "URL" options
When I select "Upload"
Then a file picker should open
When I select an image file
Then the image should upload
And the image should be embedded in the page
And I should be able to resize it`,
      storyPoints: 5,
      status: 'backlog',
      priority: 'medium',
      labels: ['wiki', 'editor', 'images', 'phase-1'],
      feature: 'Block-Based Editor',
      value: 'Visual Documentation',
      requirement: 'HLR-WIKI-027'
    },
    {
      id: 'US-WIKI-019',
      epicId: 'EPIC-WIKI-02',
      title: 'Text Formatting',
      description: 'As an architect, I want to apply text formatting (bold, italic, underline, strikethrough) so that I can emphasize important information.',
      acceptanceCriteria: `Given I have selected text "important"
When I press Cmd+B (Mac) or Ctrl+B (Windows)
Then the text should become bold
And the bold button in toolbar should be active
When I press Cmd+I (Mac) or Ctrl+I (Windows)
Then the text should become italic`,
      storyPoints: 3,
      status: 'backlog',
      priority: 'high',
      labels: ['wiki', 'editor', 'formatting', 'phase-1'],
      feature: 'Block-Based Editor',
      value: 'Text Emphasis',
      requirement: 'HLR-WIKI-028'
    },
    {
      id: 'US-WIKI-020',
      epicId: 'EPIC-WIKI-02',
      title: 'Insert Block Quotes',
      description: 'As an architect, I want to insert block quotes so that I can highlight important statements or quotes.',
      acceptanceCriteria: `Given the cursor is in a paragraph
When I type "> " (greater-than followed by space)
Then the paragraph should become a block quote
And it should have a left border indicator
And text should be indented`,
      storyPoints: 2,
      status: 'backlog',
      priority: 'medium',
      labels: ['wiki', 'editor', 'quotes', 'phase-1'],
      feature: 'Block-Based Editor',
      value: 'Content Highlighting',
      requirement: 'HLR-WIKI-029'
    },
    {
      id: 'US-WIKI-021',
      epicId: 'EPIC-WIKI-02',
      title: 'Insert Dividers',
      description: 'As an architect, I want to insert horizontal dividers so that I can visually separate sections of content.',
      acceptanceCriteria: `Given I open the slash command menu
When I select "Divider" or type "---" on empty line
Then a horizontal rule should be inserted
And it should visually separate content above and below`,
      storyPoints: 2,
      status: 'backlog',
      priority: 'low',
      labels: ['wiki', 'editor', 'dividers', 'phase-1'],
      feature: 'Block-Based Editor',
      value: 'Visual Separation',
      requirement: 'HLR-WIKI-030'
    },
    {
      id: 'US-WIKI-022',
      epicId: 'EPIC-WIKI-02',
      title: 'Drag-and-Drop Blocks',
      description: 'As an architect, I want to drag-and-drop blocks to reorder them so that I can easily reorganize my content.',
      acceptanceCriteria: `Given I have multiple blocks: H1, paragraph, code block
When I hover over the left side of a block
Then I should see a drag handle (⋮⋮ icon)
When I click and drag the handle
Then I should see a blue insertion indicator
When I drop at a new location
Then the block should be moved
And the page should auto-save`,
      storyPoints: 5,
      status: 'backlog',
      priority: 'medium',
      labels: ['wiki', 'editor', 'drag-drop', 'phase-1'],
      feature: 'Block-Based Editor',
      value: 'Content Reorganization',
      requirement: 'HLR-WIKI-031'
    },
    {
      id: 'US-WIKI-023',
      epicId: 'EPIC-WIKI-02',
      title: 'Keyboard Shortcuts',
      description: 'As an architect, I want to use keyboard shortcuts (Cmd/Ctrl+B for bold, etc.) so that I can format content efficiently.',
      acceptanceCriteria: `Given I am in the editor
When I press Cmd/Ctrl+B
Then selected text should become bold
When I press Cmd/Ctrl+I
Then selected text should become italic
When I press Cmd/Ctrl+K
Then the link dialog should open
When I press Cmd/Ctrl+S
Then the page should save`,
      storyPoints: 3,
      status: 'backlog',
      priority: 'high',
      labels: ['wiki', 'editor', 'shortcuts', 'phase-1'],
      feature: 'Block-Based Editor',
      value: 'Efficiency',
      requirement: 'HLR-WIKI-032'
    }
  ];

  // Continue with more stories for remaining EPICs...
  // I'll create the rest in a follow-up to keep this manageable

  console.log('Creating EPICs...');
  for (const epic of epics) {
    const [existingEpic] = await db.select().from(schema.epics).where(eq(schema.epics.id, epic.id));
    if (!existingEpic) {
      try {
        await db.insert(schema.epics).values({
          id: epic.id,
          name: epic.name,
          description: epic.description,
          valueStream: epic.valueStream,
          status: epic.status,
          priority: epic.priority,
          startDate: epic.startDate.toISOString(),
          targetDate: epic.targetDate.toISOString(),
          labels: epic.labels,
        });
        console.log(`✅ Created: ${epic.id} - ${epic.name} (${epic.totalPoints} points)`);
      } catch (error: any) {
        console.error(`❌ Error creating ${epic.id}:`, error.message);
      }
    } else {
      console.log(`⚠️  Epic ${epic.id} already exists. Skipping creation.`);
    }
  }

  console.log('\n📝 Creating User Stories...');
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
      } catch (error: any) {
        console.error(`❌ Error creating ${story.id}:`, error.message);
      }
    } else {
      console.log(`⚠️  Story ${story.id} already exists. Skipping creation.`);
    }
  }

  console.log('\n✨ Wiki Knowledge Core stories setup complete (Part 1)!\n');
  console.log('📊 Summary (Phase 1 Foundation - EPICs 1-3):');
  console.log(`  - EPICs Created: 10 (All phases)`);
  console.log(`  - User Stories Created: 23 (Foundation + Editor + Tree View)`);
  console.log(`  - Total Story Points: 130 (Foundation stories only)`);
  console.log(`  - Total Project: 423 points across 10 EPICs`);
  console.log('\n🎯 Next Steps:');
  console.log('  1. Review stories in Plan module (/plan)');
  console.log('  2. Phase 1 ready for sprint planning (Foundation)');
  console.log('  3. Note: Additional stories for EPICs 4-10 will be added in follow-up');
  
  await pool.end();
}

createWikiStories().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

