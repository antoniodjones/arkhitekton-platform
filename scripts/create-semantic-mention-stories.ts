import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { eq } from 'drizzle-orm';
import * as schema from '../shared/schema';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const db = drizzle(pool, { schema });

async function createSemanticMentionStories() {
  console.log('🏗️  Creating Semantic Mentions System User Stories...\n');

  // First, check if EPIC-WIKI-04 exists, if not create it
  const epicId = 'EPIC-WIKI-04';
  const [existingEpic] = await db.select().from(schema.epics).where(eq(schema.epics.id, epicId));

  if (!existingEpic) {
    console.log(`📋 Creating ${epicId}: Semantic Mentions System...`);
    await db.insert(schema.epics).values({
      id: epicId,
      name: 'Semantic Mentions System',
      description: `Implement platform-wide @mention system that creates live links to entities across the entire ARKHITEKTON application. This enables architects to create semantic connections between documentation and actual architecture artifacts, forming a living knowledge graph.
      
Key Features:
- Type @ to trigger entity picker
- Search across all entity types (stories, epics, defects, models, objects, applications, capabilities, pages)
- Status-aware rendering (green=active, orange=deprecated, red=sunset)
- Hover preview cards with entity details
- Click to navigate to entity
- Backlinks panel showing where entities are mentioned`,
      valueStream: 'Knowledge Management',
      status: 'backlog',
      priority: 'high',
      startDate: new Date().toISOString(),
      targetDate: new Date(new Date().setMonth(new Date().getMonth() + 2)).toISOString(),
      labels: ['wiki', 'semantic-linking', 'mentions', 'knowledge-graph', 'phase-2'],
    });
    console.log(`✅ Created ${epicId}\n`);
  } else {
    console.log(`✅ ${epicId} already exists. Updating description...\n`);
    await db.update(schema.epics)
      .set({
        description: `Implement platform-wide @mention system that creates live links to entities across the entire ARKHITEKTON application. This enables architects to create semantic connections between documentation and actual architecture artifacts, forming a living knowledge graph.
      
Key Features:
- Type @ to trigger entity picker
- Search across all entity types (stories, epics, defects, models, objects, applications, capabilities, pages)
- Status-aware rendering (green=active, orange=deprecated, red=sunset)
- Hover preview cards with entity details
- Click to navigate to entity
- Backlinks panel showing where entities are mentioned`,
      })
      .where(eq(schema.epics.id, epicId));
  }

  // Define all the stories
  const stories = [
    // Core @mention infrastructure
    {
      id: 'US-WIKI-050',
      title: 'Trigger mention picker with @ symbol',
      description: `As an architect editing a wiki page, I want to type "@" to trigger a mention picker so that I can quickly reference platform entities.`,
      acceptanceCriteria: `Scenario: Trigger mention picker with @ symbol
    Given I am editing a wiki page in the TipTap editor
    When I type the "@" character
    Then a mention picker dropdown should appear
    And it should be positioned near my cursor
    And it should show a search input with placeholder "Search entities..."
    And I should see recent/suggested entities
    
Scenario: Close mention picker
    Given the mention picker is open
    When I press Escape or click outside
    Then the mention picker should close
    And the "@" character should remain in the text`,
      epicId: epicId,
      storyPoints: 8,
      priority: 'high',
      labels: ['wiki', 'mentions', 'editor', 'phase-2', 'sprint-3a'],
      feature: 'Semantic Mentions',
    },
    {
      id: 'US-WIKI-051',
      title: 'Search and mention User Stories from Plan module',
      description: `As an architect, I want to @mention User Stories so that my documentation links to actual development work.`,
      acceptanceCriteria: `Scenario: Search for user story by ID
    Given the mention picker is open
    When I type "@US-"
    Then I should see matching user stories
    And each result should show: ID, Title, Status badge
    When I select "US-WIKI-001"
    Then a mention chip should be inserted
    And it should be styled based on status (in-progress=blue, done=green, backlog=gray)
    
Scenario: Search for user story by title
    Given the mention picker is open
    When I type "@payment"
    Then I should see user stories with "payment" in the title`,
      epicId: epicId,
      storyPoints: 5,
      priority: 'high',
      labels: ['wiki', 'mentions', 'plan-integration', 'phase-2', 'sprint-3a'],
      feature: 'Semantic Mentions',
    },
    {
      id: 'US-WIKI-052',
      title: 'Search and mention Epics from Plan module',
      description: `As an architect, I want to @mention Epics so that I can reference value streams and initiatives in my documentation.`,
      acceptanceCriteria: `Scenario: Search for epic
    Given the mention picker is open
    When I type "@EPIC-"
    Then I should see matching epics
    And each result should show: ID, Name, Status, Value Stream
    When I select an epic
    Then a mention chip should be inserted with epic styling`,
      epicId: epicId,
      storyPoints: 3,
      priority: 'high',
      labels: ['wiki', 'mentions', 'plan-integration', 'phase-2', 'sprint-3a'],
      feature: 'Semantic Mentions',
    },
    {
      id: 'US-WIKI-053',
      title: 'Search and mention Architectural Models from Canvas',
      description: `As an architect, I want to @mention Architectural Models (diagrams) so that my documentation links to visual representations.`,
      acceptanceCriteria: `Scenario: Search for model/diagram
    Given the mention picker is open
    When I type "@Payment System"
    Then I should see matching architectural models
    And each result should show: Name, Domain, Type, thumbnail preview
    When I select a model
    Then a mention chip should be inserted
    And clicking it should navigate to the canvas view`,
      epicId: epicId,
      storyPoints: 5,
      priority: 'high',
      labels: ['wiki', 'mentions', 'canvas-integration', 'phase-2', 'sprint-3a'],
      feature: 'Semantic Mentions',
    },
    {
      id: 'US-WIKI-054',
      title: 'Search and mention Architectural Objects within Models',
      description: `As an architect, I want to @mention specific Architectural Objects (components, services, etc.) so that I can reference individual elements within diagrams.`,
      acceptanceCriteria: `Scenario: Search for architectural object
    Given the mention picker is open
    When I type "@PaymentService"
    Then I should see matching architectural objects
    And each result should show: Name, Type (component/service/etc), Parent Model
    And it should show the object's status (active, deprecated, sunset)
    When I select an object
    Then a mention chip should be inserted with status-aware styling
    And clicking it should navigate to the object in context`,
      epicId: epicId,
      storyPoints: 5,
      priority: 'medium',
      labels: ['wiki', 'mentions', 'canvas-integration', 'phase-2', 'sprint-3b'],
      feature: 'Semantic Mentions',
    },
    {
      id: 'US-WIKI-055',
      title: 'Search and mention Wiki Pages',
      description: `As an architect, I want to @mention other Wiki pages so that I can create inter-document links and build a knowledge web.`,
      acceptanceCriteria: `Scenario: Search for wiki page
    Given the mention picker is open
    When I type "@Architecture Principles"
    Then I should see matching wiki pages
    And each result should show: Title, Category, Status (draft/published)
    When I select a page
    Then a link-style mention should be inserted
    And clicking it should navigate to that page`,
      epicId: epicId,
      storyPoints: 3,
      priority: 'high',
      labels: ['wiki', 'mentions', 'wiki-linking', 'phase-2', 'sprint-3a'],
      feature: 'Semantic Mentions',
    },
    {
      id: 'US-WIKI-056',
      title: 'Search and mention Requirements from Wiki',
      description: `As an architect, I want to @mention Requirements documents so that I can maintain traceability in my architecture docs.`,
      acceptanceCriteria: `Scenario: Search for requirement
    Given the mention picker is open
    When I type "@REQ-" or "@requirement"
    Then I should see wiki pages with template="Requirement"
    And results should show requirement ID and title
    When I select a requirement
    Then a mention chip should be inserted with requirement styling`,
      epicId: epicId,
      storyPoints: 3,
      priority: 'medium',
      labels: ['wiki', 'mentions', 'requirements', 'phase-2', 'sprint-3b'],
      feature: 'Semantic Mentions',
    },
    {
      id: 'US-WIKI-057',
      title: 'Search and mention ADRs (Architecture Decision Records)',
      description: `As an architect, I want to @mention ADRs so that I can reference architectural decisions in my documentation.`,
      acceptanceCriteria: `Scenario: Search for ADR
    Given the mention picker is open
    When I type "@ADR-" or "@decision"
    Then I should see wiki pages with template="ADR"
    And results should show ADR number and title
    And results should show status (Proposed, Accepted, Deprecated, Superseded)
    When I select an ADR
    Then a mention chip should be inserted with decision styling`,
      epicId: epicId,
      storyPoints: 3,
      priority: 'medium',
      labels: ['wiki', 'mentions', 'adr', 'decisions', 'phase-2', 'sprint-3b'],
      feature: 'Semantic Mentions',
    },
    {
      id: 'US-WIKI-058',
      title: 'Search and mention Users/Team Members',
      description: `As an architect, I want to @mention team members so that I can assign ownership or notify people about documentation.`,
      acceptanceCriteria: `Scenario: Search for user
    Given the mention picker is open
    When I type "@john" or "@smith"
    Then I should see matching users
    And each result should show: Name, Avatar, Role/Title
    When I select a user
    Then a user mention chip should be inserted
    And it should display the user's name with an avatar`,
      epicId: epicId,
      storyPoints: 5,
      priority: 'medium',
      labels: ['wiki', 'mentions', 'users', 'collaboration', 'phase-2', 'sprint-3b'],
      feature: 'Semantic Mentions',
    },
    
    // NEW STORIES - Filling the gaps
    {
      id: 'US-WIKI-065',
      title: 'Search and mention Defects from Quality Center',
      description: `As an architect, I want to @mention Defects so that I can link documentation to quality issues and bug tracking.`,
      acceptanceCriteria: `Scenario: Search for defect by ID
    Given the mention picker is open
    When I type "@DEF-" or the defect ID
    Then I should see matching defects
    And each result should show: ID, Title, Severity badge, Status
    And severity should be color-coded (critical=red, high=orange, medium=yellow, low=gray)
    When I select a defect
    Then a defect mention chip should be inserted
    And clicking it should navigate to the Quality Center defect detail
    
Scenario: Search defect by title
    Given the mention picker is open
    When I type "@login bug"
    Then I should see defects with matching titles`,
      epicId: epicId,
      storyPoints: 3,
      priority: 'high',
      labels: ['wiki', 'mentions', 'quality-center', 'defects', 'phase-2', 'sprint-3a', 'gap-fill'],
      feature: 'Semantic Mentions',
    },
    {
      id: 'US-WIKI-066',
      title: 'Search and mention Applications from APM/CMDB',
      description: `As an architect, I want to @mention Applications so that I can reference systems in the application portfolio.`,
      acceptanceCriteria: `Scenario: Search for application
    Given the mention picker is open
    When I type "@" followed by application name
    Then I should see matching applications from APM
    And each result should show: Name, Type, Status, Criticality badge
    When I select an application
    Then an application mention chip should be inserted
    And clicking it should navigate to the APM detail page`,
      epicId: epicId,
      storyPoints: 3,
      priority: 'high',
      labels: ['wiki', 'mentions', 'apm', 'applications', 'phase-2', 'sprint-3a', 'gap-fill'],
      feature: 'Semantic Mentions',
    },
    {
      id: 'US-WIKI-067',
      title: 'Search and mention Business Capabilities',
      description: `As an architect, I want to @mention Business Capabilities so that I can link technical docs to business context.`,
      acceptanceCriteria: `Scenario: Search for capability
    Given the mention picker is open
    When I type "@Order Management" or "@capability"
    Then I should see matching business capabilities
    And each result should show: Name, Level, Domain
    When I select a capability
    Then a capability mention chip should be inserted
    And clicking it should navigate to the Capabilities page`,
      epicId: epicId,
      storyPoints: 5,
      priority: 'medium',
      labels: ['wiki', 'mentions', 'capabilities', 'business', 'phase-2', 'sprint-3b', 'gap-fill'],
      feature: 'Semantic Mentions',
    },
    {
      id: 'US-WIKI-068',
      title: 'Search and mention Architecture Elements (Shape Library)',
      description: `As an architect, I want to @mention Architecture Elements so that I can reference standard patterns and shapes in documentation.`,
      acceptanceCriteria: `Scenario: Search for architecture element
    Given the mention picker is open
    When I type "@AWS Lambda" or "@microservice"
    Then I should see matching architecture elements
    And each result should show: Name, Framework (ArchiMate, AWS, etc), Icon
    When I select an element
    Then an element mention chip should be inserted with the element's icon`,
      epicId: epicId,
      storyPoints: 3,
      priority: 'low',
      labels: ['wiki', 'mentions', 'elements', 'shape-library', 'phase-2', 'sprint-3b', 'gap-fill'],
      feature: 'Semantic Mentions',
    },
    
    // Infrastructure stories
    {
      id: 'US-WIKI-070',
      title: 'Unified Entity Search API for @mentions',
      description: `As a developer, I need a unified search API endpoint that searches across all entity types so that the mention picker can provide comprehensive results.`,
      acceptanceCriteria: `Scenario: Unified search across entities
    Given I call GET /api/entities/search?q=payment
    Then I should receive results from all entity types:
      - User Stories matching "payment"
      - Epics matching "payment"
      - Defects matching "payment"
      - Models matching "payment"
      - Objects matching "payment"
      - Wiki Pages matching "payment"
      - Applications matching "payment"
    And each result should include: id, type, title, status, url
    And results should be grouped by entity type
    And results should be limited to 5 per type
    
Scenario: Type-filtered search
    Given I call GET /api/entities/search?q=payment&type=user_story
    Then I should only receive user story results`,
      epicId: epicId,
      storyPoints: 8,
      priority: 'high',
      labels: ['wiki', 'mentions', 'api', 'infrastructure', 'phase-2', 'sprint-3a'],
      feature: 'Semantic Mentions',
    },
    {
      id: 'US-WIKI-059',
      title: 'Render mentions as colored status-aware chips',
      description: `As an architect viewing a wiki page, I want mentions to render as colored chips that reflect entity status so that I can immediately see the health of referenced entities.`,
      acceptanceCriteria: `Scenario: Render active entity
    Given a mention "@PaymentService" with status "active"
    Then it should render as a chip with green background
    And it should show the entity icon
    
Scenario: Render deprecated entity
    Given a mention "@LegacyOrderSystem" with status "deprecated"
    Then it should render as a chip with orange background
    And it should show a warning indicator
    
Scenario: Render sunset entity
    Given a mention "@OldAuthService" with status "sunset"
    Then it should render as a chip with red background
    And it should show strikethrough styling`,
      epicId: epicId,
      storyPoints: 5,
      priority: 'high',
      labels: ['wiki', 'mentions', 'rendering', 'status', 'phase-2', 'sprint-3a'],
      feature: 'Semantic Mentions',
    },
    {
      id: 'US-WIKI-060',
      title: 'Hover preview cards for mentions',
      description: `As an architect, I want to hover over a mention to see a preview card with entity details so that I can quickly understand what's being referenced without navigating away.`,
      acceptanceCriteria: `Scenario: Show preview on hover
    Given I hover over "@PaymentService" mention
    Then after 500ms a preview card should appear
    And the card should show:
      - Entity name and type icon
      - Status badge
      - Description (truncated to 2 lines)
      - Key metadata (owner, last updated, etc)
      - "Click to view" hint
    When I move mouse away
    Then the preview card should disappear after 300ms
    
Scenario: Preview card position
    Given the mention is near the edge of the viewport
    Then the preview card should flip to stay visible`,
      epicId: epicId,
      storyPoints: 8,
      priority: 'high',
      labels: ['wiki', 'mentions', 'preview', 'ux', 'phase-2', 'sprint-3a'],
      feature: 'Semantic Mentions',
    },
    {
      id: 'US-WIKI-061',
      title: 'Navigate to entity on mention click',
      description: `As an architect, I want to click on a mention to navigate to that entity's detail page so that I can quickly access the referenced content.`,
      acceptanceCriteria: `Scenario: Click to navigate
    Given I click on "@US-WIKI-001" mention
    Then I should navigate to /plan?storyId=US-WIKI-001
    
Scenario: Navigate to different entity types
    | Mention Type | Navigation URL |
    | User Story | /plan?storyId={id} |
    | Epic | /plan?epicId={id} |
    | Defect | /defects/{id} |
    | Model | /studio/canvas?modelId={id} |
    | Wiki Page | /wiki-v2/{id} |
    | Application | /apm?appId={id} |
    
Scenario: Open in new tab
    Given I Cmd+click (Mac) or Ctrl+click (Windows) on a mention
    Then the entity should open in a new browser tab`,
      epicId: epicId,
      storyPoints: 3,
      priority: 'high',
      labels: ['wiki', 'mentions', 'navigation', 'phase-2', 'sprint-3a'],
      feature: 'Semantic Mentions',
    },
    {
      id: 'US-WIKI-062',
      title: 'Backlinks panel showing where entity is mentioned',
      description: `As an architect viewing an entity (story, model, etc), I want to see a backlinks panel showing all wiki pages that mention this entity so that I can discover related documentation.`,
      acceptanceCriteria: `Scenario: View backlinks for user story
    Given I am viewing US-WIKI-001 in the Plan module
    And this story is mentioned in 3 wiki pages
    Then I should see a "Backlinks" section
    And it should show the 3 wiki page titles
    And each should be clickable to navigate
    
Scenario: Backlinks in Wiki page sidebar
    Given I am viewing a wiki page
    Then the sidebar should show "Mentioned In" section
    And it should list other pages that link to this page`,
      epicId: epicId,
      storyPoints: 8,
      priority: 'medium',
      labels: ['wiki', 'mentions', 'backlinks', 'discovery', 'phase-2', 'sprint-3b'],
      feature: 'Semantic Mentions',
    },
    {
      id: 'US-WIKI-063',
      title: 'Auto-update mention status when entity changes',
      description: `As an architect, I want mentions to automatically reflect entity status changes so that my documentation stays current without manual updates.`,
      acceptanceCriteria: `Scenario: Status change propagation
    Given "@PaymentService" is mentioned in 5 wiki pages
    And PaymentService status changes from "active" to "deprecated"
    Then all 5 mentions should update to show orange (deprecated) styling
    And the entity_mentions.entityStatus should be updated
    
Scenario: Background sync job
    Given there are 1000 mentions in the system
    When the scheduled sync job runs (every 15 minutes)
    Then stale mention statuses should be updated
    And the lastCheckedAt timestamp should be updated`,
      epicId: epicId,
      storyPoints: 8,
      priority: 'medium',
      labels: ['wiki', 'mentions', 'sync', 'status', 'phase-2', 'sprint-3b'],
      feature: 'Semantic Mentions',
    },
    {
      id: 'US-WIKI-064',
      title: 'Store mentions as structured data in TipTap',
      description: `As a developer, I need mentions stored as structured JSON nodes in TipTap so that they can be rendered, searched, and updated programmatically.`,
      acceptanceCriteria: `Scenario: Mention JSON structure
    Given I insert "@PaymentService" mention
    Then the TipTap JSON should include:
    {
      "type": "mention",
      "attrs": {
        "id": "obj-uuid-123",
        "entityType": "object",
        "label": "PaymentService",
        "status": "active",
        "url": "/studio/canvas?objectId=obj-uuid-123"
      }
    }
    
Scenario: Extract mentions on save
    When I save a wiki page
    Then all mentions should be extracted from content
    And entity_mentions table should be updated
    And old mentions not in content should be deleted`,
      epicId: epicId,
      storyPoints: 5,
      priority: 'high',
      labels: ['wiki', 'mentions', 'data-structure', 'tiptap', 'phase-2', 'sprint-3a'],
      feature: 'Semantic Mentions',
    },
  ];

  console.log('📝 Creating User Stories for Semantic Mentions System...\n');
  
  let created = 0;
  let skipped = 0;
  let totalPoints = 0;

  for (const story of stories) {
    const [existing] = await db.select().from(schema.userStories).where(eq(schema.userStories.id, story.id));
    
    if (!existing) {
      try {
        await db.insert(schema.userStories).values({
          id: story.id,
          title: story.title,
          description: story.description,
          acceptanceCriteria: story.acceptanceCriteria,
          epicId: story.epicId,
          storyPoints: story.storyPoints,
          status: 'backlog',
          priority: story.priority,
          labels: story.labels,
          feature: story.feature,
          value: 'Platform-wide Semantic Linking',
          requirement: 'ARKDL-0011-B',
          assignee: null,
          productManager: null,
          techLead: null,
          githubCommits: [],
          screenshots: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        console.log(`✅ Created: ${story.id} - ${story.title} (${story.storyPoints}pts)`);
        created++;
        totalPoints += story.storyPoints;
      } catch (error: any) {
        console.error(`❌ Error creating ${story.id}:`, error.message);
      }
    } else {
      console.log(`⚠️  ${story.id} already exists. Skipping.`);
      skipped++;
      totalPoints += story.storyPoints;
    }
  }

  console.log('\n✨ Semantic Mentions Stories Creation Complete!\n');
  console.log('📊 Summary:');
  console.log(`  - Epic: ${epicId} (Semantic Mentions System)`);
  console.log(`  - Stories Created: ${created}`);
  console.log(`  - Stories Skipped: ${skipped}`);
  console.log(`  - Total Stories: ${stories.length}`);
  console.log(`  - Total Story Points: ${totalPoints}`);
  
  console.log('\n🎯 Sprint Breakdown:');
  const sprint3a = stories.filter(s => s.labels.includes('sprint-3a'));
  const sprint3b = stories.filter(s => s.labels.includes('sprint-3b'));
  console.log(`  - Sprint 3a (Core): ${sprint3a.length} stories, ${sprint3a.reduce((sum, s) => sum + s.storyPoints, 0)} points`);
  console.log(`  - Sprint 3b (Extended): ${sprint3b.length} stories, ${sprint3b.reduce((sum, s) => sum + s.storyPoints, 0)} points`);
  
  console.log('\n📋 Sprint 3a Stories (Core - 56 points):');
  sprint3a.forEach(s => console.log(`    ${s.id} (${s.storyPoints}pts): ${s.title}`));
  
  console.log('\n📋 Sprint 3b Stories (Extended - 40 points):');
  sprint3b.forEach(s => console.log(`    ${s.id} (${s.storyPoints}pts): ${s.title}`));

  await pool.end();
}

createSemanticMentionStories().catch(console.error);

