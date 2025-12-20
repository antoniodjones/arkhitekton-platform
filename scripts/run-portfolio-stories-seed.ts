/**
 * Portfolio Management Module - Story Seeder
 * 
 * Inserts all 78 user stories into the database for the Portfolio Management module.
 * 
 * Run with: npx tsx scripts/run-portfolio-stories-seed.ts
 * 
 * Stories are organized into 6 sub-epics:
 * 1. Foundation & CRUD (12 stories) - US-PORT-001 to US-PORT-012
 * 2. Detail Views & Navigation (14 stories) - US-PORT-013 to US-PORT-026
 * 3. Analytics & Dashboards (12 stories) - US-PORT-027 to US-PORT-038
 * 4. Integrations & Dependencies (14 stories) - US-PORT-039 to US-PORT-052
 * 5. Governance & Workflows (12 stories) - US-PORT-053 to US-PORT-064
 * 6. AI & Intelligence (10 stories) - US-PORT-065 to US-PORT-074
 * + Buffer: Polish & Accessibility (4 stories) - US-PORT-075 to US-PORT-078
 */

import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { eq } from 'drizzle-orm';
import * as schema from '../shared/schema';
import { epics, userStories } from '../shared/schema';

import { PORTFOLIO_EPIC, FOUNDATION_STORIES, DETAIL_VIEW_STORIES } from './create-portfolio-stories';
import { ANALYTICS_STORIES, INTEGRATION_STORIES } from './create-portfolio-stories-part2';
import { GOVERNANCE_STORIES, AI_STORIES, POLISH_STORIES } from './create-portfolio-stories-part3';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });

// Combine all stories
const ALL_STORIES = [
  ...FOUNDATION_STORIES,
  ...DETAIL_VIEW_STORIES,
  ...ANALYTICS_STORIES,
  ...INTEGRATION_STORIES,
  ...GOVERNANCE_STORIES,
  ...AI_STORIES,
  ...POLISH_STORIES,
];

// Sub-epic definitions
const SUB_EPICS = [
  {
    id: 'EPIC-PORT-FOUNDATION',
    name: 'Foundation & CRUD',
    description: 'Core CRUD operations, validation, and data management for applications and initiatives.',
    storyIds: FOUNDATION_STORIES.map(s => s.id),
    targetQuarter: 'Q1 2025 Sprint 1',
    priority: 'high' as const,
  },
  {
    id: 'EPIC-PORT-DETAIL',
    name: 'Detail Views & Navigation',
    description: 'Comprehensive detail pages, timeline views, navigation, and information architecture.',
    storyIds: DETAIL_VIEW_STORIES.map(s => s.id),
    targetQuarter: 'Q1 2025 Sprint 2',
    priority: 'high' as const,
  },
  {
    id: 'EPIC-PORT-ANALYTICS',
    name: 'Analytics & Dashboards',
    description: 'Portfolio analytics, dashboards, charts, and executive reporting capabilities.',
    storyIds: ANALYTICS_STORIES.map(s => s.id),
    targetQuarter: 'Q1 2025 Sprint 3',
    priority: 'high' as const,
  },
  {
    id: 'EPIC-PORT-INTEGRATION',
    name: 'Integrations & Dependencies',
    description: 'Dependency management, external integrations (Jira, ServiceNow), import/export.',
    storyIds: INTEGRATION_STORIES.map(s => s.id),
    targetQuarter: 'Q1 2025 Sprint 4',
    priority: 'medium' as const,
  },
  {
    id: 'EPIC-PORT-GOVERNANCE',
    name: 'Governance & Workflows',
    description: 'Approval workflows, audit trails, compliance, and governance controls.',
    storyIds: GOVERNANCE_STORIES.map(s => s.id),
    targetQuarter: 'Q2 2025 Sprint 5',
    priority: 'medium' as const,
  },
  {
    id: 'EPIC-PORT-AI',
    name: 'AI & Intelligence',
    description: 'AI-powered features: predictions, recommendations, natural language search.',
    storyIds: AI_STORIES.map(s => s.id),
    targetQuarter: 'Q2 2025 Sprint 6',
    priority: 'medium' as const,
  },
  {
    id: 'EPIC-PORT-POLISH',
    name: 'Polish & Accessibility',
    description: 'Responsive design, accessibility compliance, dark mode, and performance optimization.',
    storyIds: POLISH_STORIES.map(s => s.id),
    targetQuarter: 'Q2 2025 Buffer',
    priority: 'low' as const,
  },
];

async function seedPortfolioStories() {
  console.log('🚀 Starting Portfolio Management Story Seed');
  console.log('='.repeat(60));
  console.log(`📊 Total stories to create: ${ALL_STORIES.length}`);
  console.log('');

  try {
    // 1. Check/Create Parent Epic
    console.log('1️⃣  Checking/Creating Parent Epic...');
    const existingEpic = await db.select().from(epics).where(eq(epics.id, PORTFOLIO_EPIC.id));
    
    let parentEpicId = PORTFOLIO_EPIC.id;
    if (existingEpic.length === 0) {
      // Use raw insert to bypass schema id omission, include required valueStream
      await db.insert(epics).values({
        id: PORTFOLIO_EPIC.id,
        name: PORTFOLIO_EPIC.name,
        description: PORTFOLIO_EPIC.description,
        valueStream: 'governance', // Portfolio aligns with governance value stream
        status: 'planned',
        priority: 'high',
        targetQuarter: 'Q1 2025',
      } as any);
      console.log(`   ✅ Created parent epic: ${PORTFOLIO_EPIC.id}`);
    } else {
      console.log(`   ℹ️  Parent epic already exists: ${PORTFOLIO_EPIC.id}`);
    }

    // 2. Create Sub-Epics
    console.log('');
    console.log('2️⃣  Creating Sub-Epics...');
    for (const subEpic of SUB_EPICS) {
      const existing = await db.select().from(epics).where(eq(epics.id, subEpic.id));
      if (existing.length === 0) {
        // Use raw insert to bypass schema id omission
        await db.insert(epics).values({
          id: subEpic.id,
          name: subEpic.name,
          description: subEpic.description,
          valueStream: 'governance', // Portfolio sub-epics align with governance
          status: 'planned',
          priority: subEpic.priority,
          targetQuarter: subEpic.targetQuarter,
        } as any);
        console.log(`   ✅ Created sub-epic: ${subEpic.id} (${subEpic.storyIds.length} stories)`);
      } else {
        console.log(`   ℹ️  Sub-epic already exists: ${subEpic.id}`);
      }
    }

    // 3. Create Stories
    console.log('');
    console.log('3️⃣  Creating User Stories...');
    
    let created = 0;
    let skipped = 0;
    
    for (const story of ALL_STORIES) {
      // Find which sub-epic this story belongs to
      const subEpic = SUB_EPICS.find(se => se.storyIds.includes(story.id));
      const epicId = subEpic?.id || parentEpicId;
      
      // Check if story exists
      const existing = await db.select().from(userStories).where(eq(userStories.id, story.id));
      
      if (existing.length === 0) {
        // Use raw insert to bypass schema id omission and Gherkin validation
        await db.insert(userStories).values({
          id: story.id,
          title: story.title,
          description: story.description,
          status: 'backlog',
          priority: story.priority,
          storyPoints: story.storyPoints,
          epicId: epicId,
          acceptanceCriteria: story.description, // Full Gherkin scenarios are in description
        } as any);
        created++;
        
        // Print progress every 10 stories
        if (created % 10 === 0) {
          console.log(`   📝 Progress: ${created}/${ALL_STORIES.length} stories created...`);
        }
      } else {
        skipped++;
      }
    }
    
    console.log('');
    console.log('='.repeat(60));
    console.log('✅ SEED COMPLETE');
    console.log('='.repeat(60));
    console.log(`   Stories Created: ${created}`);
    console.log(`   Stories Skipped (already exist): ${skipped}`);
    console.log(`   Total Stories: ${ALL_STORIES.length}`);
    console.log('');
    console.log('📋 Story Breakdown by Sub-Epic:');
    for (const subEpic of SUB_EPICS) {
      console.log(`   • ${subEpic.name}: ${subEpic.storyIds.length} stories`);
    }
    console.log('');
    console.log('📊 Story Point Distribution:');
    const pointDist: Record<number, number> = {};
    for (const story of ALL_STORIES) {
      pointDist[story.storyPoints] = (pointDist[story.storyPoints] || 0) + 1;
    }
    const totalPoints = ALL_STORIES.reduce((sum, s) => sum + s.storyPoints, 0);
    Object.entries(pointDist).sort(([a], [b]) => Number(a) - Number(b)).forEach(([points, count]) => {
      console.log(`   ${points} points: ${count} stories`);
    });
    console.log(`   TOTAL: ${totalPoints} story points`);
    console.log('');
    console.log('🎯 Sprint Capacity Estimate (8 team members @ 8 pts each = 64 pts/sprint):');
    console.log(`   Estimated Sprints: ${Math.ceil(totalPoints / 64)} sprints`);
    
  } catch (error) {
    console.error('❌ Error seeding stories:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run the seeder
seedPortfolioStories()
  .then(() => {
    console.log('');
    console.log('🎉 Done! Portfolio stories are ready for sprint planning.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });

