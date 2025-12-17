/**
 * Seed Roadmap Enhancement Stories
 * These are retroactive requirements for the roadmap features built
 */

import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { eq } from 'drizzle-orm';
import * as schema from '../shared/schema';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema });

const roadmapEnhancements = [
  {
    id: 'US-PLAN-202',
    title: 'Roadmap Colorful Swimlanes',
    description: `**Type:** Enhancement
**Enhances:** US-PLAN-201
**Epic:** EPIC-12

Add vibrant gradient colors to each swimlane row for visual distinction and fun.

## Acceptance Criteria

\`\`\`gherkin
Given I am viewing the Roadmap
Then each Sprint/Epic row should have a unique gradient color
And the colors should cycle through a palette of 10 vibrant options (rose, orange, emerald, blue, violet, etc.)
And the story bars within should also use coordinated colors
\`\`\``,
    status: 'done',
    priority: 'medium',
    storyPoints: 5,
    epicId: null, // EPIC-12 (Strategic Roadmapping) - will link when epic exists
    feature: 'Plan Enhancements',
    enhances: ['US-PLAN-201'],
    enhancementType: 'ui-improvement',
    targetDate: new Date('2025-12-17'),
    completedAt: new Date('2025-12-17'),
  },
  {
    id: 'US-PLAN-203',
    title: 'Roadmap Expandable Hierarchy',
    description: `**Type:** Enhancement
**Enhances:** US-PLAN-201

Add collapsible/expandable rows so users can drill down from group to individual stories.

## Acceptance Criteria

\`\`\`gherkin
Given I am viewing the Roadmap grouped by Sprint
When I click on a Sprint row
Then the stories under that Sprint should expand/collapse
And there should be "Expand All" / "Collapse All" buttons
And the expand state should show a chevron indicator
\`\`\``,
    status: 'done',
    priority: 'medium',
    storyPoints: 8,
    epicId: null,
    feature: 'Plan Enhancements',
    enhances: ['US-PLAN-201'],
    enhancementType: 'functional-extension',
    targetDate: new Date('2025-12-17'),
    completedAt: new Date('2025-12-17'),
  },
  {
    id: 'US-PLAN-204',
    title: 'Roadmap Grouping Modes',
    description: `**Type:** Enhancement
**Enhances:** US-PLAN-201

Allow users to toggle between different grouping modes for the roadmap view.

## Acceptance Criteria

\`\`\`gherkin
Given I am viewing the Roadmap
Then I should see a "Group By" dropdown with options:
  | Option | Description |
  | Sprint | Group by feature/sprint label |
  | Epic | Group by parent epic |
  | Flat | No grouping, flat list |
And changing the selection should regroup the stories immediately
\`\`\``,
    status: 'done',
    priority: 'medium',
    storyPoints: 5,
    epicId: null,
    feature: 'Plan Enhancements',
    enhances: ['US-PLAN-201'],
    enhancementType: 'functional-extension',
    targetDate: new Date('2025-12-17'),
    completedAt: new Date('2025-12-17'),
  },
  {
    id: 'US-PLAN-205',
    title: 'Roadmap Extended Views',
    description: `**Type:** Enhancement
**Enhances:** US-PLAN-201

Add longer time horizon options for planning beyond a single month.

## Acceptance Criteria

\`\`\`gherkin
Given I am viewing the Roadmap
Then I should see a "View" dropdown with options:
  | Option | Range |
  | Month | Current month |
  | Quarter | 3 months |
  | 6 Months | 6 months |
And the timeline header should adjust to show the selected range
\`\`\``,
    status: 'done',
    priority: 'low',
    storyPoints: 3,
    epicId: null,
    feature: 'Plan Enhancements',
    enhances: ['US-PLAN-201'],
    enhancementType: 'ui-improvement',
    targetDate: new Date('2025-12-17'),
    completedAt: new Date('2025-12-17'),
  },
  {
    id: 'US-PLAN-206',
    title: 'Roadmap Progress Indicators',
    description: `**Type:** Enhancement
**Enhances:** US-PLAN-201

Show progress statistics per group row.

## Acceptance Criteria

\`\`\`gherkin
Given I am viewing the Roadmap
Then each Sprint/Epic row should display:
  | Indicator | Format |
  | Story Count | "X stories" badge |
  | Total Points | "Y pts" badge |
  | Completion % | "Z%" badge (green if 100%) |
And these should update as stories are completed
\`\`\``,
    status: 'done',
    priority: 'medium',
    storyPoints: 3,
    epicId: null,
    feature: 'Plan Enhancements',
    enhances: ['US-PLAN-201'],
    enhancementType: 'functional-extension',
    targetDate: new Date('2025-12-17'),
    completedAt: new Date('2025-12-17'),
  },
  {
    id: 'US-PLAN-207',
    title: 'Roadmap Story Tooltips',
    description: `**Type:** Enhancement
**Enhances:** US-PLAN-201

Rich tooltips on hover showing story details without leaving the roadmap.

## Acceptance Criteria

\`\`\`gherkin
Given I am viewing the Roadmap
When I hover over a story bar
Then a tooltip should appear showing:
  | Field | Value |
  | ID | Story ID |
  | Title | Full story title |
  | Points | Story points |
  | Status | Current status |
  | Target Date | If set |
  | Started | If set |
  | Completed | If set |
\`\`\``,
    status: 'done',
    priority: 'low',
    storyPoints: 3,
    epicId: null,
    feature: 'Plan Enhancements',
    enhances: ['US-PLAN-201'],
    enhancementType: 'ui-improvement',
    targetDate: new Date('2025-12-17'),
    completedAt: new Date('2025-12-17'),
  },
];

async function seedRoadmapEnhancements() {
  console.log('🗺️  Seeding Roadmap Enhancement Stories...\n');

  let inserted = 0;
  let skipped = 0;

  for (const story of roadmapEnhancements) {
    // Check if exists
    const existing = await db.select()
      .from(schema.userStories)
      .where(eq(schema.userStories.id, story.id))
      .limit(1);

    if (existing.length > 0) {
      console.log(`⏭️  Skipping ${story.id} - already exists`);
      skipped++;
      continue;
    }

    // Insert
    await db.insert(schema.userStories).values({
      id: story.id,
      title: story.title,
      description: story.description,
      acceptanceCriteria: 'See description for Gherkin acceptance criteria.',
      status: story.status,
      priority: story.priority,
      storyPoints: story.storyPoints,
      epicId: story.epicId,
      feature: story.feature,
      enhances: story.enhances,
      enhancementType: story.enhancementType,
      targetDate: story.targetDate,
      completedAt: story.completedAt,
      labels: ['plan', 'roadmap', 'enhancement'],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log(`✅ Inserted ${story.id}: ${story.title}`);
    inserted++;
  }

  console.log(`\n📊 Summary:`);
  console.log(`   Inserted: ${inserted} stories`);
  console.log(`   Skipped:  ${skipped} stories (already exist)`);
  console.log(`   Total:    ${roadmapEnhancements.length} stories`);
  console.log('\n✅ Done!');

  await pool.end();
}

seedRoadmapEnhancements().catch(console.error);

