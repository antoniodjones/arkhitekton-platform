import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { eq } from 'drizzle-orm';
import * as schema from '../shared/schema';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const db = drizzle(pool, { schema });

async function createWikiStoriesPhase2To4() {
  console.log('🏗️  Creating Wiki Knowledge Core User Stories (Phase 2-4)...\n');

  const stories = [
    // EPIC-WIKI-03: Tree View & Navigation (38 points) - Continuing from Phase 1
    {
      id: 'US-WIKI-024',
      epicId: 'EPIC-WIKI-03',
      title: 'Tree View Sidebar',
      description: 'As an architect, I want a tree view sidebar showing page hierarchy so that I can navigate my documentation structure.',
      acceptanceCriteria: `Given I am on the Wiki module
And I have pages in a hierarchy
When I view the wiki
Then I should see a left sidebar with tree view
And the tree should show parent pages
And child pages should be nested under parents
And folders/pages should be properly indented`,
      storyPoints: 8,
      status: 'backlog',
      priority: 'high',
      labels: ['wiki', 'tree-view', 'navigation', 'phase-1'],
      feature: 'Tree View & Navigation',
      value: 'Hierarchical Navigation',
      requirement: 'HLR-WIKI-040'
    },
    {
      id: 'US-WIKI-025',
      epicId: 'EPIC-WIKI-03',
      title: 'Expand/Collapse Folders',
      description: 'As an architect, I want to expand and collapse folders in the tree view so that I can focus on relevant sections.',
      acceptanceCriteria: `Given a parent page has child pages
And the folder is currently collapsed
When I click the expand icon (▶)
Then the folder should expand
And child pages should be visible
And the icon should change to collapse (▼)
When I click the collapse icon
Then child pages should hide`,
      storyPoints: 3,
      status: 'backlog',
      priority: 'high',
      labels: ['wiki', 'tree-view', 'navigation', 'phase-1'],
      feature: 'Tree View & Navigation',
      value: 'Focus & Clarity',
      requirement: 'HLR-WIKI-041'
    },
    {
      id: 'US-WIKI-026',
      epicId: 'EPIC-WIKI-03',
      title: 'Drag-and-Drop Pages in Tree',
      description: 'As an architect, I want to drag-and-drop pages to reorganize the hierarchy so that I can restructure my documentation easily.',
      acceptanceCriteria: `Given I have pages in a hierarchy
When I drag a page from one location
And I drop it under a different parent
Then the page should move to the new parent
And the database should update parent_id
And the tree should reflect the new structure`,
      storyPoints: 5,
      status: 'backlog',
      priority: 'medium',
      labels: ['wiki', 'tree-view', 'drag-drop', 'phase-1'],
      feature: 'Tree View & Navigation',
      value: 'Easy Reorganization',
      requirement: 'HLR-WIKI-042'
    },
    {
      id: 'US-WIKI-027',
      epicId: 'EPIC-WIKI-03',
      title: 'Keyboard Navigation in Tree',
      description: 'As an architect, I want to use keyboard shortcuts to navigate the tree view so that I can quickly access pages without a mouse.',
      acceptanceCriteria: `Given the tree view has focus
When I press Down arrow
Then the next item should be selected
When I press Right arrow on a collapsed folder
Then the folder should expand
When I press Left arrow on an expanded folder
Then the folder should collapse
When I press Enter on a selected page
Then that page should open in the editor`,
      storyPoints: 5,
      status: 'backlog',
      priority: 'medium',
      labels: ['wiki', 'tree-view', 'keyboard', 'phase-1'],
      feature: 'Tree View & Navigation',
      value: 'Keyboard Efficiency',
      requirement: 'HLR-WIKI-043'
    },
    {
      id: 'US-WIKI-028',
      epicId: 'EPIC-WIKI-03',
      title: 'Create Folders',
      description: 'As an architect, I want to create folders to organize pages so that I can group related documentation.',
      acceptanceCriteria: `Given I right-click in the tree view empty space
When I select "New Folder"
Then I should see a folder creation dialog
When I enter name "Security Documentation"
And I click "Create"
Then a new folder should appear in the tree
And I should be able to drag pages into it`,
      storyPoints: 5,
      status: 'backlog',
      priority: 'medium',
      labels: ['wiki', 'tree-view', 'folders', 'phase-1'],
      feature: 'Tree View & Navigation',
      value: 'Documentation Organization',
      requirement: 'HLR-WIKI-044'
    },
    {
      id: 'US-WIKI-029',
      epicId: 'EPIC-WIKI-03',
      title: 'Highlight Active Page',
      description: 'As an architect, I want the active page to be highlighted in the tree view so that I always know where I am.',
      acceptanceCriteria: `Given I am viewing a specific wiki page
Then that page should be highlighted in the tree
And it should have a distinct background color
And it should be scrolled into view if off-screen`,
      storyPoints: 2,
      status: 'backlog',
      priority: 'high',
      labels: ['wiki', 'tree-view', 'navigation', 'phase-1'],
      feature: 'Tree View & Navigation',
      value: 'Context Awareness',
      requirement: 'HLR-WIKI-045'
    },
    {
      id: 'US-WIKI-030',
      epicId: 'EPIC-WIKI-03',
      title: 'Context Menu on Pages',
      description: 'As an architect, I want to right-click on pages in the tree view to access actions so that I can quickly perform operations.',
      acceptanceCriteria: `Given I right-click on a page in the tree
Then I should see a context menu with options:
- Open
- Rename
- Duplicate
- Add Child Page
- Delete
- Move to...
When I select "Rename"
Then the page name should become editable in the tree`,
      storyPoints: 5,
      status: 'backlog',
      priority: 'high',
      labels: ['wiki', 'tree-view', 'context-menu', 'phase-1'],
      feature: 'Tree View & Navigation',
      value: 'Quick Actions',
      requirement: 'HLR-WIKI-046'
    },
    {
      id: 'US-WIKI-031',
      epicId: 'EPIC-WIKI-03',
      title: 'Collapsible Sidebar',
      description: 'As an architect, I want to collapse the tree view sidebar so that I can maximize editor space when needed.',
      acceptanceCriteria: `Given the tree view sidebar is visible
When I click the collapse button (◀)
Then the sidebar should slide closed
And the editor should expand to fill the space
When I click the expand button (▶)
Then the sidebar should reappear`,
      storyPoints: 3,
      status: 'backlog',
      priority: 'medium',
      labels: ['wiki', 'tree-view', 'ui', 'phase-1'],
      feature: 'Tree View & Navigation',
      value: 'Space Management',
      requirement: 'HLR-WIKI-047'
    },

    // EPIC-WIKI-04: Semantic Mentions System (76 points) - PHASE 2 KILLER FEATURE
    {
      id: 'US-WIKI-032',
      epicId: 'EPIC-WIKI-04',
      title: '@ Mention Picker Trigger',
      description: 'As an architect, I want to type @ to trigger a mention picker so that I can link to platform entities.',
      acceptanceCriteria: `Given the cursor is in the editor
When I type "@"
Then a mention picker menu should appear
And it should be positioned near the cursor
And it should show a search input field
And it should show "Search entities..."`,
      storyPoints: 8,
      status: 'backlog',
      priority: 'critical',
      labels: ['wiki', 'semantic-mentions', 'killer-feature', 'phase-2'],
      feature: 'Semantic Mentions System',
      value: 'Entity Linking',
      requirement: 'HLR-WIKI-050'
    },
    {
      id: 'US-WIKI-033',
      epicId: 'EPIC-WIKI-04',
      title: 'Search User Stories in Mentions',
      description: 'As an architect, I want to search and mention User Stories from the Plan module so that I can link documentation to implementation.',
      acceptanceCriteria: `Given the mention picker is open
When I type "@US-"
Then I should see User Stories from Plan module in results
And each should show the story title
And each should show the status
When I select a story
Then @US-XXX mention chip should be inserted`,
      storyPoints: 5,
      status: 'backlog',
      priority: 'critical',
      labels: ['wiki', 'semantic-mentions', 'plan-integration', 'phase-2'],
      feature: 'Semantic Mentions System',
      value: 'Plan Integration',
      requirement: 'HLR-WIKI-051'
    },
    {
      id: 'US-WIKI-034',
      epicId: 'EPIC-WIKI-04',
      title: 'Search Epics in Mentions',
      description: 'As an architect, I want to search and mention Epics from the Plan module so that I can reference strategic initiatives.',
      acceptanceCriteria: `Given the mention picker is open
When I type "@EPIC"
Then I should see Epics from Plan module
And each should show the epic name
When I select an epic
Then @EPIC-XXX mention chip should be inserted`,
      storyPoints: 3,
      status: 'backlog',
      priority: 'high',
      labels: ['wiki', 'semantic-mentions', 'plan-integration', 'phase-2'],
      feature: 'Semantic Mentions System',
      value: 'Epic Linking',
      requirement: 'HLR-WIKI-052'
    },
    {
      id: 'US-WIKI-035',
      epicId: 'EPIC-WIKI-04',
      title: 'Search Components in Mentions',
      description: 'As an architect, I want to search and mention Components from the Design module so that I can link documentation to architecture.',
      acceptanceCriteria: `Given the mention picker is open
When I type "@Payment"
Then I should see Components like "PaymentService"
And it should show the entity type icon (Component)
And it should show the status badge
When I select "PaymentService"
Then @PaymentService mention chip should be inserted`,
      storyPoints: 5,
      status: 'backlog',
      priority: 'critical',
      labels: ['wiki', 'semantic-mentions', 'design-integration', 'phase-2'],
      feature: 'Semantic Mentions System',
      value: 'Architecture Linking',
      requirement: 'HLR-WIKI-053'
    },
    {
      id: 'US-WIKI-036',
      epicId: 'EPIC-WIKI-04',
      title: 'Search Diagrams in Mentions',
      description: 'As an architect, I want to search and mention Diagrams from the Canvas module so that I can reference visual architecture.',
      acceptanceCriteria: `Given the mention picker is open
When I type "@Payment Flow"
Then I should see diagrams like "Payment Flow"
And it should show a tiny thumbnail preview
When I select it
Then @Payment Flow mention should be inserted
And it should link to the diagram`,
      storyPoints: 5,
      status: 'backlog',
      priority: 'high',
      labels: ['wiki', 'semantic-mentions', 'canvas-integration', 'phase-2'],
      feature: 'Semantic Mentions System',
      value: 'Diagram Linking',
      requirement: 'HLR-WIKI-054'
    },
    {
      id: 'US-WIKI-037',
      epicId: 'EPIC-WIKI-04',
      title: 'Search Wiki Pages in Mentions',
      description: 'As an architect, I want to search and mention other Wiki pages so that I can cross-reference documentation.',
      acceptanceCriteria: `Given I have a wiki page titled "Architecture Principles"
When I type "@Architecture"
Then "Architecture Principles" should appear in results
And it should be marked as type "Page"
When I select it
Then a link to that page should be created`,
      storyPoints: 3,
      status: 'backlog',
      priority: 'high',
      labels: ['wiki', 'semantic-mentions', 'cross-reference', 'phase-2'],
      feature: 'Semantic Mentions System',
      value: 'Documentation Linking',
      requirement: 'HLR-WIKI-055'
    },
    {
      id: 'US-WIKI-038',
      epicId: 'EPIC-WIKI-04',
      title: 'Search Requirements in Mentions',
      description: 'As an architect, I want to search and mention Requirements so that I can trace decisions back to requirements.',
      acceptanceCriteria: `Given I have requirements in the wiki
When I type "@REQ-"
Then I should see requirements matching the pattern
And each should show requirement type and priority
When I select one
Then @REQ-XXX mention should be inserted`,
      storyPoints: 3,
      status: 'backlog',
      priority: 'medium',
      labels: ['wiki', 'semantic-mentions', 'requirements', 'phase-2'],
      feature: 'Semantic Mentions System',
      value: 'Requirements Traceability',
      requirement: 'HLR-WIKI-056'
    },
    {
      id: 'US-WIKI-039',
      epicId: 'EPIC-WIKI-04',
      title: 'Search ADRs in Mentions',
      description: 'As an architect, I want to search and mention Architecture Decision Records so that I can reference key decisions.',
      acceptanceCriteria: `Given I have ADR pages in the wiki
When I type "@ADR-"
Then I should see ADRs matching the pattern
And each should show decision title and status
When I select one
Then @ADR-XXX mention should be inserted`,
      storyPoints: 3,
      status: 'backlog',
      priority: 'medium',
      labels: ['wiki', 'semantic-mentions', 'adr', 'phase-2'],
      feature: 'Semantic Mentions System',
      value: 'Decision Linking',
      requirement: 'HLR-WIKI-057'
    },
    {
      id: 'US-WIKI-040',
      epicId: 'EPIC-WIKI-04',
      title: 'Search Users/Teams in Mentions',
      description: 'As an architect, I want to mention users and teams so that I can reference people and notify them.',
      acceptanceCriteria: `Given I type "@john"
Then I should see users matching "john"
And each should show name and avatar
When I select a user
Then @John mention should be inserted
And the user may be notified (future feature)`,
      storyPoints: 5,
      status: 'backlog',
      priority: 'medium',
      labels: ['wiki', 'semantic-mentions', 'users', 'phase-2'],
      feature: 'Semantic Mentions System',
      value: 'People Tagging',
      requirement: 'HLR-WIKI-058'
    },
    {
      id: 'US-WIKI-041',
      epicId: 'EPIC-WIKI-04',
      title: 'Render Mentions as Colored Chips',
      description: 'As an architect, I want mentions to render as colored chips so that I can visually distinguish entity types.',
      acceptanceCriteria: `Given I have inserted "@PaymentService"
Then it should render as a chip/badge
And it should have a background color
And it should have rounded corners
And it should be inline with the text
And different entity types should have different colors`,
      storyPoints: 5,
      status: 'backlog',
      priority: 'critical',
      labels: ['wiki', 'semantic-mentions', 'ui', 'phase-2'],
      feature: 'Semantic Mentions System',
      value: 'Visual Clarity',
      requirement: 'HLR-WIKI-059'
    },
    {
      id: 'US-WIKI-042',
      epicId: 'EPIC-WIKI-04',
      title: 'Status-Aware Mention Colors',
      description: 'As an architect, I want mention colors to indicate entity status so that I can see if components are active, deprecated, or sunset.',
      acceptanceCriteria: `Given I have "@PaymentService" with status Active
Then the chip should have a green background
When PaymentService status changes to Deprecated
Then the chip should update to orange background
When status is Sunset
Then the chip should have a red background`,
      storyPoints: 5,
      status: 'backlog',
      priority: 'critical',
      labels: ['wiki', 'semantic-mentions', 'status', 'phase-2'],
      feature: 'Semantic Mentions System',
      value: 'Living Documentation',
      requirement: 'HLR-WIKI-060'
    },
    {
      id: 'US-WIKI-043',
      epicId: 'EPIC-WIKI-04',
      title: 'Hover Preview Card',
      description: 'As an architect, I want to see a preview card when hovering over mentions so that I can quickly understand the entity without navigating.',
      acceptanceCriteria: `Given I have "@PaymentService" mention in the text
When I hover over the mention chip
Then a preview card should appear after 500ms
And the card should show: Name, Type, Status, Description, Owner, Last Modified
And the card should have a "Go to →" button`,
      storyPoints: 8,
      status: 'backlog',
      priority: 'high',
      labels: ['wiki', 'semantic-mentions', 'preview', 'phase-2'],
      feature: 'Semantic Mentions System',
      value: 'Quick Context',
      requirement: 'HLR-WIKI-061'
    },
    {
      id: 'US-WIKI-044',
      epicId: 'EPIC-WIKI-04',
      title: 'Navigate by Clicking Mention',
      description: 'As an architect, I want to click on mentions to navigate to the entity so that I can explore the architecture.',
      acceptanceCriteria: `Given I have "@PaymentService" mention in the text
When I click on the mention chip
Then I should navigate to the PaymentService component page
And the page should open in the Design module
And the component should be highlighted`,
      storyPoints: 3,
      status: 'backlog',
      priority: 'critical',
      labels: ['wiki', 'semantic-mentions', 'navigation', 'phase-2'],
      feature: 'Semantic Mentions System',
      value: 'Cross-Module Navigation',
      requirement: 'HLR-WIKI-062'
    },
    {
      id: 'US-WIKI-045',
      epicId: 'EPIC-WIKI-04',
      title: 'Real-Time Status Updates',
      description: 'As an architect, I want mentions to reflect entity status changes in real-time so that my documentation stays current.',
      acceptanceCriteria: `Given I have "@PaymentService" with status Active (green)
When an admin changes PaymentService status to Deprecated
And I refresh the wiki page
Then "@PaymentService" chip should update to orange
And the hover card should show status: Deprecated
And I should see a visual indicator that it changed`,
      storyPoints: 8,
      status: 'backlog',
      priority: 'high',
      labels: ['wiki', 'semantic-mentions', 'real-time', 'phase-2'],
      feature: 'Semantic Mentions System',
      value: 'Always Current',
      requirement: 'HLR-WIKI-063'
    },
    {
      id: 'US-WIKI-046',
      epicId: 'EPIC-WIKI-04',
      title: 'Store Mentions as Structured Data',
      description: 'As a system, I need to store mentions as structured data so that backlinks and queries are possible.',
      acceptanceCriteria: `Given I insert "@PaymentService" in the wiki
Then the database should store:
- type: Component
- id: [PaymentService ID]
- text: PaymentService
- page_id: [Current page ID]
- position: [Character offset]
And the mention should be queryable for backlinks`,
      storyPoints: 5,
      status: 'backlog',
      priority: 'critical',
      labels: ['wiki', 'semantic-mentions', 'data-model', 'phase-2'],
      feature: 'Semantic Mentions System',
      value: 'Queryable Knowledge',
      requirement: 'HLR-WIKI-064'
    },

    // EPIC-WIKI-05: Backlinks & References (23 points) - PHASE 2
    {
      id: 'US-WIKI-047',
      epicId: 'EPIC-WIKI-05',
      title: 'Show "Referenced in" on Wiki Pages',
      description: 'As an architect, I want to see which other pages reference the current page so that I can understand its impact.',
      acceptanceCriteria: `Given I am viewing a wiki page
When I scroll to the bottom or sidebar
Then I should see a "Referenced in" section
And it should show count: "Referenced in X pages"
And it should list the pages that mention this one`,
      storyPoints: 5,
      status: 'backlog',
      priority: 'high',
      labels: ['wiki', 'backlinks', 'references', 'phase-2'],
      feature: 'Backlinks & References',
      value: 'Impact Analysis',
      requirement: 'HLR-WIKI-070'
    },
    {
      id: 'US-WIKI-048',
      epicId: 'EPIC-WIKI-05',
      title: 'Show Wiki Mentions on Components',
      description: 'As an architect, I want to see which wiki pages mention a component so that I can find related documentation.',
      acceptanceCriteria: `Given I am viewing PaymentService in Design module
When I look at the sidebar or details panel
Then I should see "Mentioned in Wiki" section
And it should list pages that mention @PaymentService
And each should show a snippet with context
And the count should say "Mentioned in X pages"`,
      storyPoints: 5,
      status: 'backlog',
      priority: 'high',
      labels: ['wiki', 'backlinks', 'design-integration', 'phase-2'],
      feature: 'Backlinks & References',
      value: 'Documentation Discovery',
      requirement: 'HLR-WIKI-071'
    },
    {
      id: 'US-WIKI-049',
      epicId: 'EPIC-WIKI-05',
      title: 'Show Wiki Mentions on User Stories',
      description: 'As a PM or developer, I want to see which wiki pages mention a user story so that I can find context and requirements.',
      acceptanceCriteria: `Given User Story US-PAY-001 exists
And wiki page "Sprint Planning" mentions @US-PAY-001
When I view US-PAY-001 in Plan module
Then I should see "Mentioned in Wiki: 1 page"
When I click to expand
Then I should see "Sprint Planning" listed
And I can click to navigate to that page`,
      storyPoints: 3,
      status: 'backlog',
      priority: 'high',
      labels: ['wiki', 'backlinks', 'plan-integration', 'phase-2'],
      feature: 'Backlinks & References',
      value: 'Context Discovery',
      requirement: 'HLR-WIKI-072'
    },
    {
      id: 'US-WIKI-050',
      epicId: 'EPIC-WIKI-05',
      title: 'Navigate via Backlinks',
      description: 'As an architect, I want to click on backlinks to navigate and see the mention in context.',
      acceptanceCriteria: `Given I am viewing PaymentService backlinks
And one backlink is "Payment Architecture" page
When I click on "Payment Architecture" in the list
Then I should navigate to that wiki page
And the page should scroll to the mention location
And the @PaymentService mention should be highlighted`,
      storyPoints: 2,
      status: 'backlog',
      priority: 'high',
      labels: ['wiki', 'backlinks', 'navigation', 'phase-2'],
      feature: 'Backlinks & References',
      value: 'Contextual Navigation',
      requirement: 'HLR-WIKI-073'
    },
    {
      id: 'US-WIKI-051',
      epicId: 'EPIC-WIKI-05',
      title: 'Show Snippets with Context',
      description: 'As an architect, I want backlinks to show snippets of surrounding text so that I can understand the context without opening the page.',
      acceptanceCriteria: `Given "Payment Architecture" contains:
"Our payment processing uses the @PaymentService component which connects to external gateways."
When I view backlinks for PaymentService
Then the snippet should show:
"...payment processing uses the @PaymentService component which connects..."
And the mention should be bolded in the snippet`,
      storyPoints: 5,
      status: 'backlog',
      priority: 'medium',
      labels: ['wiki', 'backlinks', 'snippets', 'phase-2'],
      feature: 'Backlinks & References',
      value: 'Quick Context',
      requirement: 'HLR-WIKI-074'
    },
    {
      id: 'US-WIKI-052',
      epicId: 'EPIC-WIKI-05',
      title: 'Filter Backlinks by Page Type',
      description: 'As an architect, I want to filter backlinks by page type (ADR, Design Doc, etc.) so that I can focus on specific documentation.',
      acceptanceCriteria: `Given PaymentService is mentioned in multiple page types
When I view PaymentService backlinks
Then I should see a filter dropdown
When I select "ADR only"
Then only ADR pages should be shown
And other pages should be hidden`,
      storyPoints: 3,
      status: 'backlog',
      priority: 'low',
      labels: ['wiki', 'backlinks', 'filtering', 'phase-2'],
      feature: 'Backlinks & References',
      value: 'Focused Discovery',
      requirement: 'HLR-WIKI-075'
    }
  ];

  console.log('📝 Creating User Stories (Phase 2-4: Tree View completion + Semantic Mentions + Backlinks)...');
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

  console.log('\n✨ Wiki Knowledge Core stories (Phase 2 Part 1) setup complete!\n');
  console.log('📊 Summary:');
  console.log(`  - Stories Created: ${createdCount}`);
  console.log(`  - Stories Skipped: ${skippedCount}`);
  console.log(`  - Total Story Points: ${totalPoints}`);
  console.log(`  - Coverage: Tree View completion (8 stories, 38pts) + Semantic Mentions (15 stories, 76pts) + Backlinks (6 stories, 23pts)`);
  console.log('\n🎯 EPICs Covered:');
  console.log('  - EPIC-WIKI-03: Tree View & Navigation (completed - 38 points)');
  console.log('  - EPIC-WIKI-04: Semantic Mentions System (completed - 76 points) 🚀 KILLER FEATURE');
  console.log('  - EPIC-WIKI-05: Backlinks & References (completed - 23 points)');
  console.log('\n📝 Remaining EPICs (Phase 3-4): Requirements Management, Traceability, Templates, Collaboration, Version History');
  console.log('  - Will be added in next script');
  
  await pool.end();
}

createWikiStoriesPhase2To4().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

