/**
 * Update existing Wiki stories with their target dates
 */

import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { eq, isNull, like, or } from 'drizzle-orm';
import * as schema from '../shared/schema';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema });

// Map features to sprint dates
const featureToDate: Record<string, Date> = {
  // Sprint W1 - Foundation (Jan 2026)
  'Wiki Page Management': new Date('2026-01-10'),
  'Block-Based Editor': new Date('2026-01-10'),
  'Tree View & Navigation': new Date('2026-01-10'),
  
  // Sprint W2 - Semantic Mentions (Jan 2026)
  'Semantic Mentions System': new Date('2026-01-24'),
  'Backlinks & References': new Date('2026-01-24'),
  
  // Sprint W3 - Requirements (Feb 2026)
  'Requirements Management': new Date('2026-02-07'),
  'Traceability Matrix': new Date('2026-02-07'),
  
  // Sprint W4 - Templates (Feb 2026)
  'Page Templates': new Date('2026-02-21'),
  
  // Sprint W5 - Collaboration (Mar 2026)
  'Collaboration Features': new Date('2026-03-07'),
  
  // Sprint W6 - Version History (Mar 2026)
  'Version History': new Date('2026-03-21'),
  
  // Plan module - Done in Dec 2025
  'Plan Enhancements': new Date('2025-12-17'),
  'Enhancement Story Traceability': new Date('2025-12-17'),
  'Planning Date Fields': new Date('2025-12-17'),
  'Quality Center Navigation': new Date('2025-12-17'),
  'Quality Command Center': new Date('2025-12-17'),
  'Defect Creation Shortcut': new Date('2025-12-17'),
};

// Fallback: Assign dates based on story category
const categoryDates: Record<string, Date> = {
  'wiki': new Date('2026-02-01'),
  'plan': new Date('2025-12-20'),
  'quality': new Date('2025-12-20'),
  'agent': new Date('2026-04-01'),
  'canvas': new Date('2026-05-01'),
};

async function updateStoryDates() {
  console.log('📅 Updating story target dates...\n');

  // Get all stories without targetDate
  const stories = await db.select()
    .from(schema.userStories)
    .where(isNull(schema.userStories.targetDate));

  console.log(`Found ${stories.length} stories without targetDate\n`);

  let updated = 0;
  let skipped = 0;

  for (const story of stories) {
    let targetDate: Date | null = null;

    // First try exact feature match
    if (story.feature && featureToDate[story.feature]) {
      targetDate = featureToDate[story.feature];
    }
    // Then try ID-based assignment
    else if (story.id.startsWith('US-WIKI-')) {
      const num = parseInt(story.id.replace('US-WIKI-', ''), 10);
      if (num <= 8) targetDate = new Date('2026-01-10');       // Sprint W1
      else if (num <= 15) targetDate = new Date('2026-01-24');  // Sprint W2
      else if (num <= 22) targetDate = new Date('2026-02-07');  // Sprint W3
      else if (num <= 28) targetDate = new Date('2026-02-21');  // Sprint W4
      else if (num <= 38) targetDate = new Date('2026-03-07');  // Sprint W5
      else if (num <= 46) targetDate = new Date('2026-03-21');  // Sprint W6
      else targetDate = new Date('2026-04-04');                 // Sprint W7
    }
    else if (story.id.startsWith('US-PLAN-')) {
      targetDate = new Date('2025-12-20');
    }
    else if (story.id.startsWith('US-QC-') || story.id.startsWith('DEF-')) {
      targetDate = new Date('2025-12-20');
    }

    if (targetDate) {
      await db.update(schema.userStories)
        .set({ 
          targetDate: targetDate,
          updatedAt: new Date()
        })
        .where(eq(schema.userStories.id, story.id));
      
      console.log(`✅ ${story.id}: ${targetDate.toISOString().split('T')[0]}`);
      updated++;
    } else {
      skipped++;
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   Updated: ${updated} stories`);
  console.log(`   Skipped: ${skipped} stories (no date mapping)`);
  console.log('✅ Done!');

  await pool.end();
}

updateStoryDates().catch(console.error);
