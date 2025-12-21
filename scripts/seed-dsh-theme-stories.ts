/**
 * Seed Script: Design Studio Home Theme Compliance Stories
 * 
 * Creates US-DSH-001 and implementation stories for theme/dark mode compliance.
 * Links to existing stories for traceability.
 */

import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import { userStories } from '../shared/schema';
import { eq } from 'drizzle-orm';

config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(client);

const EPIC_ID = 'EPIC-IDE-01';

const stories = [
  {
    id: 'US-DSH-001',
    epicId: EPIC_ID,
    title: 'Theme-Compliant Design Studio Home',
    description: `As a user of ARKHITEKTON, I want the Design Studio Home page to respect my theme preference, so that I have a consistent experience across all modules.

This story supersedes US-D1YSEOH and implements the theme switching requirement from US-IDE-006.`,
    acceptanceCriteria: `Feature: Design Studio Home Theme Compliance
  Background:
    Given I am on the Design Studio Home page (/studio)

  Scenario: Dark mode displays correctly
    Given I have dark mode enabled
    When the page loads
    Then the background should use dark theme colors
    And the text should be light-colored for readability
    And the logo should use the orange brand gradient

  Scenario: Light mode displays correctly
    Given I have light mode enabled
    When the page loads
    Then the background should use light theme colors
    And the text should be dark-colored for readability
    And the logo should use the orange brand gradient

  Scenario: Theme switch updates page dynamically
    Given I am viewing the page in light mode
    When I toggle the theme to dark mode
    Then all page elements should update immediately
    And no hardcoded light colors should remain visible`,
    storyPoints: 5,
    status: 'in-progress' as const,
    priority: 'high' as const,
    feature: 'Design Studio',
    value: 'Consistent user experience across all modules with proper theme support',
    requirement: 'US-IDE-006, US-UI-001',
    labels: ['design-studio', 'theme', 'dark-mode', 'ui-consistency']
  },
  {
    id: 'US-DSH-IMPL-001',
    epicId: EPIC_ID,
    title: 'Update Hardcoded Colors to CSS Variables',
    description: `Implementation story for US-DSH-001.

Replace 14 hardcoded light-mode color classes in design-studio-home.tsx with semantic CSS variables that respond to theme changes.

Changes:
- bg-[#f9f9fa] → bg-background
- bg-white → bg-card
- text-slate-* → text-foreground / text-muted-foreground
- bg-slate-100 → bg-muted
- border-slate-* → border-border`,
    acceptanceCriteria: `Feature: CSS Variable Migration
  Scenario: All hardcoded colors replaced
    Given the design-studio-home.tsx file
    When I search for bg-white, bg-[#f9f9fa], text-slate-*, bg-slate-100
    Then no matches should be found
    And all colors should use semantic variables (bg-background, bg-card, text-foreground, etc.)`,
    storyPoints: 3,
    status: 'pending' as const,
    priority: 'high' as const,
    feature: 'Design Studio',
    value: 'Proper dark mode support through CSS variables',
    requirement: 'US-DSH-001',
    labels: ['design-studio', 'theme', 'implementation', 'css']
  },
  {
    id: 'US-DSH-IMPL-002',
    epicId: EPIC_ID,
    title: 'Fix Logo Branding Consistency',
    description: `Implementation story for US-DSH-001.

Fix the logo gradient in Design Studio Home to use the correct ARKHITEKTON orange brand colors instead of purple/indigo.

Change:
- from-indigo-500 to-purple-500 → from-orange-400 to-orange-600
- shadow-indigo-200 → shadow-orange-200/50 dark:shadow-orange-900/30`,
    acceptanceCriteria: `Feature: Logo Branding
  Scenario: Logo uses correct brand colors
    Given I am on the Design Studio Home page
    When I view the logo in the header
    Then it should display an orange gradient (not purple)
    And it should match the logo on other pages`,
    storyPoints: 2,
    status: 'pending' as const,
    priority: 'high' as const,
    feature: 'Design Studio',
    value: 'Consistent brand identity across all pages',
    requirement: 'US-DSH-001',
    labels: ['design-studio', 'branding', 'implementation', 'logo']
  },
  {
    id: 'US-DSH-IMPL-003',
    epicId: EPIC_ID,
    title: 'Update ModelCard and Footer Theme Support',
    description: `Implementation story for US-DSH-001.

Audit and fix theme support in child components:
- model-card.tsx
- footer.tsx
- command-bar.tsx

Ensure all components use semantic CSS variables instead of hardcoded colors.`,
    acceptanceCriteria: `Feature: Child Component Theme Support
  Scenario: ModelCard supports dark mode
    Given I view a ModelCard in dark mode
    Then it should have appropriate dark theme colors
    And text should be readable

  Scenario: Footer supports dark mode
    Given I view the footer in dark mode
    Then it should have appropriate dark theme colors

  Scenario: CommandBar supports dark mode
    Given I open the command bar in dark mode
    Then it should have appropriate dark theme colors`,
    storyPoints: 3,
    status: 'pending' as const,
    priority: 'medium' as const,
    feature: 'Design Studio',
    value: 'Complete theme support for all Design Studio components',
    requirement: 'US-DSH-001',
    labels: ['design-studio', 'theme', 'implementation', 'components']
  }
];

async function seedDSHStories() {
  console.log('🚀 Seeding Design Studio Home Theme Stories...\n');
  await client.connect();

  let created = 0;
  let skipped = 0;

  for (const story of stories) {
    const existing = await db.select({ id: userStories.id })
      .from(userStories)
      .where(eq(userStories.id, story.id))
      .limit(1);

    if (existing.length > 0) {
      console.log(`⏭️  ${story.id}: Already exists, skipping`);
      skipped++;
    } else {
      await db.insert(userStories).values({
        ...story,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log(`✅ ${story.id}: ${story.title} (${story.storyPoints} pts)`);
      created++;
    }
  }

  console.log('\n📊 Summary:');
  console.log(`   Stories Created: ${created}`);
  console.log(`   Stories Skipped: ${skipped}`);
  console.log(`   Total Points: ${stories.reduce((sum, s) => sum + s.storyPoints, 0)}`);
  console.log('\n✅ Done!');

  await client.end();
}

seedDSHStories().catch(console.error);

