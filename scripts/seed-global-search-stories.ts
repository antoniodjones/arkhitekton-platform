/**
 * Seed Global Search & Discovery User Stories
 * 
 * Creates EPIC-SEARCH-001 and associated user stories for the global search feature.
 * 
 * Run with: npx tsx scripts/seed-global-search-stories.ts
 */

import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { epics, userStories } from '../shared/schema';
import { eq } from 'drizzle-orm';

const { Pool } = pg;

const EPIC_ID = 'EPIC-SEARCH-001';

const epicData = {
  id: EPIC_ID,
  name: 'Global Search & Discovery',
  description: 'Unified search interface enabling users to find any entity (User Stories, Epics, Applications, Wiki Pages, Models) from the Dashboard using intelligent ranking, fuzzy matching, and cross-module navigation.',
  valueStream: 'operations',
  status: 'planned',
  priority: 'critical',
  owner: 'Product Team',
  targetQuarter: 'Q1 2025',
  completionPercentage: 0,
  totalStoryPoints: 48,
  completedStoryPoints: 0,
  coreCapabilities: [
    'Unified Entity Search',
    'Cross-Module Discovery',
    'Fuzzy Matching',
    'Intelligent Ranking',
    'Type Filtering',
    'Keyboard Shortcuts'
  ],
  keyFeatures: [
    'Dashboard global search bar',
    'Search across User Stories, Epics, Defects, Applications, Initiatives, Wiki Pages, Models',
    'Real-time autocomplete with < 500ms response',
    'Entity type filtering',
    'Typo tolerance and partial matching',
    'Relevance-based ranking',
    'Quick navigation to entity detail pages',
    'Cmd/Ctrl+K keyboard shortcut',
    'Search result highlighting'
  ],
  businessGoals: [
    'Reduce time to find entities by 40%',
    'Increase cross-module discoverability',
    'Improve user satisfaction and platform adoption',
    'Enable power users with keyboard-first workflows'
  ],
};

const stories = [
  // =========================================
  // PRODUCT / USER-FACING STORIES
  // =========================================
  {
    id: 'US-SEARCH-001',
    epicId: EPIC_ID,
    title: 'Dashboard Global Search',
    description: `As a platform user, I want to search for any entity from the Dashboard, so that I can quickly find User Stories, Epics, Applications, and other objects without navigating to specific modules.`,
    acceptanceCriteria: `Feature: Dashboard Global Search
  As a platform user
  I want global search from the Dashboard
  So that I can find any entity quickly

  Background:
    Given I am on the Dashboard home page
    And the database contains:
      | Type         | ID              | Title                          | Status |
      | User Story   | US-WIKI-RTF-002 | Paragraph Indentation Controls | done   |
      | Epic         | EPIC-WIKI-007   | Word-Style RTF Toolbar         | completed |
      | Application  | APP-123         | Customer Portal                | active |
      | Wiki Page    | WIKI-456        | Architecture Standards         | published |
      | Model        | MODEL-789       | Payment System Design          | active |

  Scenario: Search by exact User Story ID
    Given the search bar is empty
    When I type "US-WIKI-RTF-002"
    Then I should see a dropdown with 1 result
    And the result should display:
      | Field       | Value                          |
      | ID          | US-WIKI-RTF-002                |
      | Type Badge  | User Story                     |
      | Status      | Done                           |
      | Title       | Paragraph Indentation Controls |
    And the result should be clickable

  Scenario: Search by partial match
    Given the search bar is empty
    When I type "wiki-rtf"
    Then I should see results containing "US-WIKI-RTF-*"
    And results should include "US-WIKI-RTF-002"
    And results should be sorted by relevance

  Scenario: Search by title keyword
    Given the search bar is empty
    When I type "indentation"
    Then I should see "US-WIKI-RTF-002" in results
    And the matching keyword "indentation" should be highlighted
    And the description should show a preview

  Scenario: No results found
    Given the search bar is empty
    When I type "nonexistent-xyz-12345"
    Then I should see "No elements found for 'nonexistent-xyz-12345'"
    And I should see helpful suggestions`,
    storyPoints: 8,
    status: 'backlog',
    priority: 'high',
    feature: 'Global Search',
    value: 'Enable users to find any entity across all modules from a single interface',
    requirement: 'HLR-SEARCH-001, HLR-SEARCH-002, HLR-SEARCH-003',
    labels: ['search', 'dashboard', 'discovery', 'ux']
  },
  {
    id: 'US-SEARCH-002',
    epicId: EPIC_ID,
    title: 'Entity Type Filtering',
    description: `As a platform user, I want to filter search results by entity type, so that I can narrow down results when searching for a specific type of object.`,
    acceptanceCriteria: `Feature: Entity Type Filtering
  As a platform user
  I want to filter search results
  So that I can find specific entity types

  Background:
    Given I am on the Dashboard
    And I searched for "payment"
    And results include:
      | Type        | Title                  |
      | User Story  | Payment Gateway Setup  |
      | Application | Payment Processing API |
      | Model       | Payment System Design  |
      | Wiki Page   | Payment Architecture   |

  Scenario: Display filter options
    Given I see mixed search results
    Then I should see filter chips:
      | Filter      | Count |
      | All         | 4     |
      | User Story  | 1     |
      | Application | 1     |
      | Model       | 1     |
      | Wiki Page   | 1     |

  Scenario: Filter to User Stories only
    Given I see 4 mixed results
    When I click "User Story" filter
    Then I should see only 1 result
    And the result should be "Payment Gateway Setup"
    And the filter chip "User Story" should be highlighted

  Scenario: Clear filter
    Given I filtered to "User Story" only
    When I click "All" filter
    Then I should see all 4 results again`,
    storyPoints: 5,
    status: 'backlog',
    priority: 'high',
    feature: 'Search Filtering',
    value: 'Allow users to narrow search results to specific entity types',
    requirement: 'HLR-SEARCH-002',
    labels: ['search', 'filtering', 'ux']
  },
  {
    id: 'US-SEARCH-003',
    epicId: EPIC_ID,
    title: 'Fuzzy Matching & Typo Tolerance',
    description: `As a platform user, I want the search to handle typos and partial matches, so that I can still find entities even if I misspell the ID or title.`,
    acceptanceCriteria: `Feature: Fuzzy Matching
  As a platform user
  I want typo-tolerant search
  So that I can find entities despite minor mistakes

  Scenario: Handle typo in User Story ID
    Given a user story "US-WIKI-RTF-002" exists
    When I type "us-wik-rtf-002" (typo: missing "i")
    Then I should see "US-WIKI-RTF-002" in results
    And a note should say "Showing results for 'us-wiki-rtf-002'"

  Scenario: Handle case insensitivity
    Given a user story "US-WIKI-RTF-002" exists
    When I type "Us-WiKi-RtF-002"
    Then I should see exact match "US-WIKI-RTF-002"

  Scenario: Handle partial ID match
    Given user stories exist: "US-WIKI-RTF-001" through "US-WIKI-RTF-010"
    When I type "wiki-rtf"
    Then I should see all 10 matching stories
    And they should be sorted by ID ascending`,
    storyPoints: 5,
    status: 'backlog',
    priority: 'medium',
    feature: 'Fuzzy Search',
    value: 'Improve search success rate by handling typos and partial matches',
    requirement: 'HLR-SEARCH-001',
    labels: ['search', 'fuzzy-matching', 'algorithm']
  },
  {
    id: 'US-SEARCH-004',
    epicId: EPIC_ID,
    title: 'Search Result Ranking',
    description: `As a platform user, I want search results ranked by relevance, so that the most likely matches appear first.`,
    acceptanceCriteria: `Feature: Relevance Ranking
  As a platform user
  I want intelligent result ranking
  So that I find what I need faster

  Scenario: Exact match ranks highest
    Given stories exist: "US-WIKI-001", "US-WIKI-002", "US-WIKI-RTF-002"
    When I search "US-WIKI-RTF-002"
    Then "US-WIKI-RTF-002" should be the first result
    And other partial matches should rank lower

  Scenario: Recent activity boosts rank
    Given two stories match "payment":
      | ID        | Title         | Last Updated |
      | US-001    | Payment Setup | 1 hour ago   |
      | US-999    | Payment Flow  | 30 days ago  |
    When I search "payment"
    Then "US-001" should rank higher than "US-999"

  Scenario: Status affects ranking
    Given two stories match "login":
      | ID     | Title       | Status   |
      | US-100 | Login Page  | done     |
      | US-200 | Login Modal | archived |
    When I search "login"
    Then "US-100" should rank higher than "US-200"`,
    storyPoints: 5,
    status: 'backlog',
    priority: 'medium',
    feature: 'Search Ranking',
    value: 'Surface the most relevant results first to reduce search time',
    requirement: 'HLR-SEARCH-001',
    labels: ['search', 'ranking', 'algorithm']
  },
  {
    id: 'US-SEARCH-005',
    epicId: EPIC_ID,
    title: 'Quick Navigation',
    description: `As a platform user, I want to navigate directly to an entity from search results, so that I can access the entity's detail page immediately.`,
    acceptanceCriteria: `Feature: Quick Navigation
  As a platform user
  I want to navigate from search results
  So that I can view entity details quickly

  Scenario: Click result to navigate
    Given I searched for "US-WIKI-RTF-002"
    And I see the result in the dropdown
    When I click the result
    Then I should navigate to "/plan/stories/US-WIKI-RTF-002"
    And the search dropdown should close

  Scenario: Open result in new tab
    Given I searched for "US-WIKI-RTF-002"
    And I see the result
    When I Cmd+Click the result (Mac)
    Or I Ctrl+Click the result (Windows)
    Then the page should open in a new tab
    And the search dropdown should remain open

  Scenario: Browser back button preserves search
    Given I searched for "payment"
    And I clicked "US-001 Payment Setup"
    And I am now on "/plan/stories/US-001"
    When I click the browser back button
    Then I should return to the Dashboard
    And the search bar should still contain "payment"`,
    storyPoints: 3,
    status: 'backlog',
    priority: 'high',
    feature: 'Navigation',
    value: 'Enable seamless navigation from search to entity detail pages',
    requirement: 'HLR-SEARCH-004',
    labels: ['search', 'navigation', 'ux']
  },
  {
    id: 'US-SEARCH-006',
    epicId: EPIC_ID,
    title: 'Keyboard Shortcuts',
    description: `As a power user, I want keyboard shortcuts to trigger search, so that I can search without using my mouse.`,
    acceptanceCriteria: `Feature: Keyboard Shortcuts
  As a power user
  I want keyboard shortcuts
  So that I can search efficiently

  Scenario: Open search with Cmd+K (Mac)
    Given I am on any page in ARKHITEKTON
    When I press "Cmd+K"
    Then the search modal should open
    And the search input should be focused
    And the cursor should be ready for typing

  Scenario: Open search with Ctrl+K (Windows/Linux)
    Given I am on any page in ARKHITEKTON
    When I press "Ctrl+K"
    Then the search modal should open
    And the search input should be focused

  Scenario: Navigate results with arrow keys
    Given the search modal is open
    And I typed "payment"
    And 5 results are displayed
    When I press "Down Arrow"
    Then the first result should be highlighted
    When I press "Down Arrow" 2 more times
    Then the third result should be highlighted`,
    storyPoints: 3,
    status: 'backlog',
    priority: 'low',
    feature: 'Keyboard Shortcuts',
    value: 'Enable power users to search efficiently without mouse',
    requirement: 'HLR-SEARCH-004',
    labels: ['search', 'keyboard', 'accessibility', 'ux']
  },
  
  // =========================================
  // IMPLEMENTATION STORIES
  // =========================================
  {
    id: 'US-SEARCH-IMPL-001',
    epicId: EPIC_ID,
    title: 'Backend Search API Enhancement',
    description: `As a developer, I need to enhance the existing /api/entities/search endpoint, so that it supports fuzzy matching, filtering, and ranking.`,
    acceptanceCriteria: `Feature: Backend API Enhancement

  Scenario: API supports query parameters
    Given the API endpoint is "/api/entities/search"
    Then it should accept query parameters:
      | Parameter | Type   | Required | Default |
      | q         | string | Yes      | -       |
      | type      | string | No       | all     |
      | limit     | number | No       | 10      |
      | offset    | number | No       | 0       |

  Scenario: API returns structured results
    When I call "/api/entities/search?q=payment&limit=5"
    Then the response should include:
      - query string
      - total results count
      - array of results with id, type, title, description, status, score, url
      - highlighted text for matches

  Scenario: API performance meets SLA
    Given 10,000 entities exist in the database
    When I call "/api/entities/search?q=test"
    Then the response time should be < 500ms (p95)`,
    storyPoints: 8,
    status: 'backlog',
    priority: 'high',
    feature: 'Backend API',
    value: 'Provide performant search API for frontend integration',
    requirement: 'US-SEARCH-001, US-SEARCH-003, US-SEARCH-004',
    labels: ['search', 'api', 'backend', 'implementation', 'performance']
  },
  {
    id: 'US-SEARCH-IMPL-002',
    epicId: EPIC_ID,
    title: 'Dashboard UI Integration',
    description: `As a developer, I need to connect the Dashboard search bar to the backend API, so that users see real search results instead of mock data.`,
    acceptanceCriteria: `Feature: Dashboard UI Integration

  Scenario: Replace mock data with API call
    Given the Dashboard is loaded
    When I type "us-wiki" in the search bar
    Then the UI should call "GET /api/entities/search?q=us-wiki"
    And the response should be displayed in the dropdown
    And mock data should no longer be used

  Scenario: Handle loading state
    When I type "architecture"
    Then a loading spinner should appear
    And placeholder text should say "Analyzing architecture..."

  Scenario: Handle error state
    Given the API is unavailable
    When I search for "payment"
    Then I should see an error message
    And a retry button should be available`,
    storyPoints: 5,
    status: 'backlog',
    priority: 'high',
    feature: 'Frontend Integration',
    value: 'Connect UI to real search API for production functionality',
    requirement: 'US-SEARCH-001',
    labels: ['search', 'frontend', 'dashboard', 'implementation', 'react']
  },
  {
    id: 'US-SEARCH-IMPL-003',
    epicId: EPIC_ID,
    title: 'Search Result Component',
    description: `As a developer, I need to create a reusable SearchResult component, so that results are displayed consistently.`,
    acceptanceCriteria: `Feature: SearchResult Component

  Scenario: Component displays entity data
    Given a search result for "US-WIKI-RTF-002"
    Then the component should render:
      - Entity ID
      - Entity type badge
      - Status badge
      - Title
      - Description (truncated to 80 chars)
      - Icon based on entity type

  Scenario: Component handles click events
    When the user clicks the result
    Then an onClick callback should be fired
    And navigation should occur

  Scenario: Component supports keyboard navigation
    When the component is focused
    And the user presses Enter
    Then the onClick callback should fire`,
    storyPoints: 3,
    status: 'backlog',
    priority: 'medium',
    feature: 'UI Components',
    value: 'Provide reusable component for consistent search result display',
    requirement: 'US-SEARCH-001, US-SEARCH-005',
    labels: ['search', 'components', 'react', 'implementation', 'ui']
  },
  {
    id: 'US-SEARCH-IMPL-004',
    epicId: EPIC_ID,
    title: 'Keyboard Shortcut Handler',
    description: `As a developer, I need to implement global keyboard shortcuts, so that users can open search with Cmd/Ctrl+K.`,
    acceptanceCriteria: `Feature: Keyboard Handler

  Scenario: Register global shortcut
    Given the application is loaded
    When the user is on any page
    Then "Cmd+K" (Mac) should open search
    And "Ctrl+K" (Windows) should open search

  Scenario: Handle arrow key navigation
    Given search results are visible
    When the user presses "Down Arrow"
    Then the next result should be highlighted
    When the user presses "Up Arrow"
    Then the previous result should be highlighted

  Scenario: Handle Enter key
    Given a result is highlighted
    When the user presses "Enter"
    Then navigation to that result should occur`,
    storyPoints: 3,
    status: 'backlog',
    priority: 'low',
    feature: 'Keyboard Shortcuts',
    value: 'Enable keyboard-first workflow for power users',
    requirement: 'US-SEARCH-006',
    labels: ['search', 'keyboard', 'accessibility', 'implementation', 'ux']
  },
];

async function seedGlobalSearchStories() {
  console.log('🔍 Seeding Global Search & Discovery Stories...\n');

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const db = drizzle(pool);

  try {
    // Check if epic exists
    const existingEpic = await db.select().from(epics).where(eq(epics.id, EPIC_ID)).limit(1);
    
    if (existingEpic.length === 0) {
      console.log(`📌 Creating Epic: ${EPIC_ID}`);
      await db.insert(epics).values(epicData as any);
      console.log(`   ✅ ${epicData.name}`);
    } else {
      console.log(`📌 Epic already exists: ${EPIC_ID}`);
    }

    console.log('\n📝 Creating User Stories...');
    let created = 0;
    let skipped = 0;

    for (const story of stories) {
      const existing = await db.select().from(userStories).where(eq(userStories.id, story.id)).limit(1);
      
      if (existing.length > 0) {
        console.log(`   ⏭️  ${story.id}: Already exists, skipping`);
        skipped++;
        continue;
      }

      await db.insert(userStories).values({
        id: story.id,
        epicId: story.epicId,
        title: story.title,
        description: story.description,
        acceptanceCriteria: story.acceptanceCriteria,
        storyPoints: story.storyPoints,
        status: story.status,
        priority: story.priority,
        feature: story.feature,
        value: story.value,
        requirement: story.requirement,
        labels: story.labels,
      } as any);

      console.log(`   ✅ ${story.id}: ${story.title} (${story.storyPoints} pts)`);
      created++;
    }

    console.log(`\n📊 Summary:`);
    console.log(`   Epic: ${EPIC_ID} - ${epicData.name}`);
    console.log(`   Stories Created: ${created}`);
    console.log(`   Stories Skipped: ${skipped}`);
    console.log(`   Total Story Points: ${epicData.totalStoryPoints}`);
    console.log(`   \n   Breakdown:`);
    console.log(`     - Product Stories: 6 (29 points)`);
    console.log(`     - Implementation Stories: 4 (19 points)`);
    console.log('\n✅ Done!');

  } catch (error) {
    console.error('❌ Error seeding stories:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

seedGlobalSearchStories().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

