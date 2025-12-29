/**
 * Seed User Stories for Clickable Hover Tooltip Enhancement (US-SEARCH-008)
 * Product story + 3 implementation stories
 */

import { db } from '../server/db';
import { userStories } from '../shared/schema';
import { eq } from 'drizzle-orm';

async function seedSearchTooltipStories() {
  console.log('📝 Seeding user stories for Clickable Hover Tooltip Enhancement...\n');

  const epicId = "EPIC-SEARCH-001";

  // Product User Story
  const productStory = {
  id: "US-SEARCH-008",
  title: "Interactive Linked Items Tooltip in PR/Commit Search Results",
  description: `As a developer searching for commits/PRs, I want to see and interact with all linked work items in a hover tooltip, so that I can quickly navigate to related stories without leaving the search context.`,
  acceptanceCriteria: `
GIVEN I have searched for a commit that is linked to multiple work items
WHEN I see the search result with "+ X other stories" indicator
THEN I should be able to hover over it to see a tooltip with all linked items

GIVEN the tooltip is displayed
WHEN I see the linked items
THEN each item should show: icon, story ID, and truncated title (first 10 chars)

GIVEN I click on a linked item in the tooltip
WHEN the item is a user story or defect
THEN a story detail sheet should open without navigating away from search

GIVEN the story detail sheet is open
WHEN I close it (X button or click outside)
THEN I should return to the search results without re-searching

GIVEN the story detail sheet is open
WHEN I click the "Edit" button
THEN I should navigate to the full story page

GIVEN the tooltip has multiple items
WHEN I hover over each one
THEN the item should highlight on hover

GIVEN the search result shows code change metadata
WHEN there is only 1 linked item
THEN no tooltip should appear (no "+ X other stories" indicator)
`,
  priority: "high",
  status: "done",
  points: 5,
    epicId: epicId,
  };

  // Implementation Stories
  const implementationStories = [
  {
    id: "US-SEARCH-IMPL-005",
    title: "Backend: Return Full Linked Items Array in Search Results",
    description: `Enhance the /api/entities/search endpoint to return full details of all linked work items for code changes, not just the count.`,
    acceptanceCriteria: `
GIVEN a code change search result
WHEN fetching search results from the API
THEN the response should include a linkedItems array in metadata

GIVEN multiple work items are linked to the same commit
WHEN processing the search result
THEN all linked items should be fetched and included with: id, title, entityType, url

GIVEN the linked items are being determined
WHEN checking priority
THEN defects should be primary, then user stories, then epics

GIVEN the API returns linked items
WHEN there are 10+ linked items
THEN all items should be returned (no artificial limit)

GIVEN the API response time is measured
WHEN returning linked items
THEN response time should be < 300ms for up to 20 linked items
`,
    priority: "high",
    status: "done",
    points: 5,
    epicId: epicId,
    implementationOf: "US-SEARCH-008",
  },
  {
    id: "US-SEARCH-IMPL-006",
    title: "Frontend: Interactive Popover with StoryDetailSheet Integration",
    description: `Create an interactive popover component that displays linked items and opens StoryDetailSheet on click, keeping search context.`,
    acceptanceCriteria: `
GIVEN the search result card component
WHEN linkedItems array is present with 2+ items
THEN display a "+ X other stories" button with Zap icon

GIVEN the user hovers over the button
WHEN the hover delay (~300ms) elapses
THEN show a Popover with "Also Linked To" header

GIVEN the Popover is displayed
WHEN rendering linked items
THEN exclude the primary item from the list

GIVEN each linked item in the Popover
WHEN rendering
THEN show: entity icon, story ID (monospace), truncated title (10 chars + ...)

GIVEN the user clicks a linked item
WHEN the click event fires
THEN open StoryDetailSheet with the selected story ID

GIVEN StoryDetailSheet is open
WHEN the user closes it
THEN return to search results with search modal still open

GIVEN the user closes StoryDetailSheet and clicks another linked item
WHEN navigating between items
THEN no re-search should occur (stay in search context)

GIVEN the Popover is rendered
WHEN checking keyboard accessibility
THEN Tab, Enter, and Esc keys should work properly

GIVEN the component is tested in both themes
WHEN switching between light and dark mode
THEN all colors and styles should be appropriate
`,
    priority: "high",
    status: "done",
    points: 8,
    epicId: epicId,
    implementationOf: "US-SEARCH-008",
  },
  {
    id: "US-SEARCH-IMPL-007",
    title: "Design Prototype: Update HTML Mockup with Clickable Links",
    description: `Update the Option 1c HTML prototype to demonstrate clickable linked items with proper styling and interactions.`,
    acceptanceCriteria: `
GIVEN the HTML prototype file
WHEN updating the tooltip items
THEN each item should be clickable with onclick handler

GIVEN a tooltip item
WHEN rendering
THEN display: icon, story ID (monospace), truncated title

GIVEN the user hovers over a tooltip item
WHEN the mouse enters the item
THEN the background should change to indicate hover state

GIVEN the user clicks a tooltip item
WHEN the click event fires
THEN show an alert demonstrating the intended behavior

GIVEN the prototype is viewed in a browser
WHEN testing interactions
THEN all hover effects and click handlers should work

GIVEN the prototype styling
WHEN compared to the React implementation
THEN the visual design should match closely
`,
    priority: "medium",
    status: "done",
    points: 2,
    epicId: epicId,
      implementationOf: "US-SEARCH-008",
    },
  ];

  try {
    // Check if stories already exist
    const existingProductStory = await db
      .select()
      .from(userStories)
      .where(eq(userStories.id, productStory.id))
      .limit(1);
    
    if (existingProductStory.length > 0) {
      console.log(`⚠️  Product story ${productStory.id} already exists. Updating...\n`);
      
      await db
        .update(userStories)
        .set({
          title: productStory.title,
          description: productStory.description,
          acceptanceCriteria: productStory.acceptanceCriteria,
          priority: productStory.priority,
          status: productStory.status,
          storyPoints: productStory.points,
          epicId: productStory.epicId,
          updatedAt: new Date(),
        })
        .where(eq(userStories.id, productStory.id));
    } else {
      console.log(`✅ Creating product story: ${productStory.id}\n`);
      
      await db.insert(userStories).values({
        id: productStory.id,
        title: productStory.title,
        description: productStory.description,
        acceptanceCriteria: productStory.acceptanceCriteria,
        priority: productStory.priority,
        status: productStory.status,
        storyPoints: productStory.points,
        epicId: productStory.epicId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    console.log(`   📦 ${productStory.id}`);
    console.log(`   📋 ${productStory.title}`);
    console.log(`   📊 ${productStory.points} story points`);
    console.log(`   🎯 Epic: ${productStory.epicId}`);
    console.log(`   ✅ Status: ${productStory.status}\n`);

    console.log(`\n📝 Creating ${implementationStories.length} implementation stories...\n`);

    for (const story of implementationStories) {
      const existing = await db
        .select()
        .from(userStories)
        .where(eq(userStories.id, story.id))
        .limit(1);
      
      if (existing.length > 0) {
        console.log(`   ⚠️  ${story.id} already exists. Updating...`);
        
        await db
          .update(userStories)
          .set({
            title: story.title,
            description: story.description,
            acceptanceCriteria: story.acceptanceCriteria,
            priority: story.priority,
            status: story.status,
            storyPoints: story.points,
            epicId: story.epicId,
            implementationOf: story.implementationOf,
            updatedAt: new Date(),
          })
          .where(eq(userStories.id, story.id));
      } else {
        console.log(`   ✓ Creating ${story.id}`);
        
        await db.insert(userStories).values({
          id: story.id,
          title: story.title,
          description: story.description,
          acceptanceCriteria: story.acceptanceCriteria,
          priority: story.priority,
          status: story.status,
          storyPoints: story.points,
          epicId: story.epicId,
          implementationOf: story.implementationOf,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      console.log(`      📋 ${story.title}`);
      console.log(`      📊 ${story.points} points | Status: ${story.status}`);
      console.log(`      🔗 Implements: ${story.implementationOf}\n`);
    }

    // Calculate totals
    const totalPoints = productStory.points + implementationStories.reduce((sum, s) => sum + s.points, 0);

    console.log(`\n✅ Successfully seeded user stories!`);
    console.log(`\n📊 Summary:`);
    console.log(`   • 1 Product Story: ${productStory.id} (${productStory.points} pts)`);
    console.log(`   • ${implementationStories.length} Implementation Stories (${implementationStories.reduce((sum, s) => sum + s.points, 0)} pts)`);
    console.log(`   • Total Story Points: ${totalPoints}`);
    console.log(`   • Epic: ${epicId}`);
    console.log(`   • All stories marked as "done"`);
    console.log(`\n🔗 Story Relationships:`);
    console.log(`   US-SEARCH-008 (Product Story)`);
    console.log(`   ├─ US-SEARCH-IMPL-005 (Backend: Linked Items API) - 5 pts`);
    console.log(`   ├─ US-SEARCH-IMPL-006 (Frontend: Popover + Sheet) - 8 pts`);
    console.log(`   └─ US-SEARCH-IMPL-007 (HTML Prototype Update) - 2 pts\n`);

  } catch (error) {
    console.error("❌ Error seeding stories:", error);
    process.exit(1);
  }
}

seedSearchTooltipStories();

