/**
 * Add Structured Reproduction Steps stories to active sprint
 */

import { db } from '../server/db';
import { sprints, userStories } from '../shared/schema';
import { eq, and, or, isNull } from 'drizzle-orm';

async function addStoriesToSprint() {
  console.log('📅 Adding Structured Reproduction Steps stories to sprint backlog\n');

  // Find or create active sprint
  const activeSprints = await db
    .select()
    .from(sprints)
    .where(
      or(
        eq(sprints.status, 'active'),
        eq(sprints.status, 'planned')
      )
    )
    .orderBy(sprints.startDate)
    .limit(1);

  let sprintId: string;

  if (activeSprints.length === 0) {
    // Create new sprint
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 10); // 10 business days

    const newSprint = {
      id: `SPRINT-${Date.now()}`,
      name: 'Quality Center - Structured Steps Sprint',
      goal: 'Implement structured reproduction steps with unique IDs, add/remove/reorder capabilities, and traceability',
      startDate,
      endDate,
      status: 'active' as const,
      capacity: 63, // Total story points
      createdAt: new Date(),
    };

    await db.insert(sprints).values(newSprint);
    sprintId = newSprint.id;
    console.log(`✅ Created new sprint: ${sprintId}\n`);
  } else {
    sprintId = activeSprints[0].id;
    console.log(`✅ Using existing sprint: ${sprintId} (${activeSprints[0].name})\n`);
  }

  // Update all stories with sprint ID
  const storyIds = [
    'US-QC-010',
    'US-QC-011',
    'US-QC-012',
    'US-QC-013',
    'US-QC-014',
    'US-QC-IMPL-010',
    'US-QC-IMPL-011',
    'US-QC-IMPL-012',
    'US-QC-IMPL-013',
    'US-QC-IMPL-014',
  ];

  console.log('📝 Adding stories to sprint...\n');
  for (const storyId of storyIds) {
    await db
      .update(userStories)
      .set({ sprintId })
      .where(eq(userStories.id, storyId));
    console.log(`   ✓ Added ${storyId} to sprint`);
  }

  console.log('\n✅ All stories added to sprint backlog!\n');
  console.log('📊 Sprint Summary:');
  console.log(`   Sprint ID: ${sprintId}`);
  console.log(`   Stories: 10 (5 product + 5 implementation)`);
  console.log(`   Total Points: 63`);
  console.log(`   Status: ${activeSprints.length > 0 ? activeSprints[0].status : 'active'}\n`);
}

addStoriesToSprint().catch((error) => {
  console.error('❌ Error adding stories to sprint:', error);
  process.exit(1);
});

