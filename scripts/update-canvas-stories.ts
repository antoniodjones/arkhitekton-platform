import { db } from '../server/db';
import { userStories, codeChanges } from '../shared/schema';
import { eq, and, like } from 'drizzle-orm';

/**
 * Update Canvas MVP User Stories and Implementation Stories
 * 
 * Links the recent git commits to the completed user stories
 */

async function updateCanvasStories() {
  console.log('🔍 Finding Canvas MVP user stories...\n');

  // Find all canvas-related user stories
  const canvasStories = await db.select()
    .from(userStories)
    .where(like(userStories.id, 'US-CVS-%'));

  console.log(`Found ${canvasStories.length} canvas stories:\n`);
  canvasStories.forEach(story => {
    console.log(`  ${story.id}: ${story.title} (${story.status})`);
  });

  // Stories we just completed
  const completedStories = [
    'US-CVS-001', // Infinite Canvas Pan/Zoom
    'US-CVS-004', // Shape Drag & Drop
    'US-CVS-006', // Connection Creation
    'US-CVS-008', // Multi-Selection
    'US-CVS-010', // Basic Shape Library
    'US-CVS-011', // Connection Routing
  ];

  console.log('\n📝 Updating completed stories...\n');

  for (const storyId of completedStories) {
    const story = canvasStories.find(s => s.id === storyId);
    if (story) {
      await db.update(userStories)
        .set({ status: 'done' })
        .where(eq(userStories.id, storyId));
      
      console.log(`  ✅ ${storyId}: ${story.title} → done`);
    } else {
      console.log(`  ⚠️  ${storyId}: Not found in database`);
    }
  }

  // Link implementation stories to git commits
  console.log('\n🔗 Linking git commits to stories...\n');

  const gitCommits = [
    {
      sha: 'ff6bfd3',
      message: 'fix(US-CVS-001-011): Fix infinite render loop',
      stories: ['US-CVS-001', 'US-CVS-004', 'US-CVS-006', 'US-CVS-011'],
      url: 'https://github.com/antoniodjones/arkhitekton-platform/commit/ff6bfd3',
    },
    {
      sha: '1b61fc9',
      message: 'fix(US-CVS-004): Enable shape dragging by removing Stage drag interference',
      stories: ['US-CVS-004'],
      url: 'https://github.com/antoniodjones/arkhitekton-platform/commit/1b61fc9',
    },
    {
      sha: '8cb2226',
      message: 'debug(US-CVS-006): Add detailed connection logging and switch to straight routing',
      stories: ['US-CVS-006', 'US-CVS-011'],
      url: 'https://github.com/antoniodjones/arkhitekton-platform/commit/8cb2226',
    },
    {
      sha: 'd92c549',
      message: 'feat(US-CVS-006,011): Add edge-based connections and routing options',
      stories: ['US-CVS-006', 'US-CVS-011'],
      url: 'https://github.com/antoniodjones/arkhitekton-platform/commit/d92c549',
    },
  ];

  for (const commit of gitCommits) {
    for (const storyId of commit.stories) {
      // Check if link already exists
      const existing = await db.select()
        .from(codeChanges)
        .where(
          and(
            eq(codeChanges.entityId, storyId),
            eq(codeChanges.commitSha, commit.sha)
          )
        );

      if (existing.length === 0) {
        await db.insert(codeChanges).values({
          entityType: 'user_story',
          entityId: storyId,
          changeType: 'commit',
          repository: 'arkhitekton-platform',
          commitSha: commit.sha,
          commitMessage: commit.message,
          commitUrl: commit.url,
          authorUsername: 'antoniodjones',
          eventTimestamp: new Date(),
        });

        console.log(`  🔗 Linked ${commit.sha} → ${storyId}`);
      } else {
        console.log(`  ℹ️  ${commit.sha} → ${storyId} (already linked)`);
      }
    }
  }

  console.log('\n✅ Canvas story updates complete!\n');
  
  // Show final status
  console.log('📊 Final Canvas Story Status:\n');
  const updatedStories = await db.select()
    .from(userStories)
    .where(like(userStories.id, 'US-CVS-%'));
  
  updatedStories.forEach(story => {
    const statusIcon = story.status === 'done' ? '✅' : story.status === 'in-progress' ? '🔄' : '⏸️';
    console.log(`  ${statusIcon} ${story.id}: ${story.title} (${story.status}) - ${story.storyPoints} pts`);
  });
}

updateCanvasStories()
  .then(() => {
    console.log('\n🎉 Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error updating canvas stories:', error);
    process.exit(1);
  });

