// Migration script to assign existing user stories to Epics using keyword pattern matching
interface Story {
  id: string;
  title: string;
  description: string | null;
  feature: string | null;
  epicId: string | null;
}

function categorizeByKeywords(story: Story): string {
  const text = `${story.title} ${story.description || ''} ${story.feature || ''}`.toLowerCase();
  
  // EPIC-1: Strategy & Business Planning
  if (text.match(/strategic|strategy|business|portfolio|capability|gap analysis|roi|value stream|planning|roadmap|assessment|transformation/)) {
    return 'EPIC-1';
  }
  
  // EPIC-2: Architecture Design & Modeling
  if (text.match(/architecture|model|design|canvas|workspace|drag.drop|palette|archimate|togaf|bpmn|cloud|aws|azure|gcp|oracle|visual|diagram|component/)) {
    return 'EPIC-2';
  }
  
  // EPIC-3: Governance & Decision Management  
  if (text.match(/governance|adr|decision record|review|approval|compliance|policy|risk|audit|ticket|jira|technical debt/)) {
    return 'EPIC-3';
  }
  
  // EPIC-5: Operations & Intelligence
  if (text.match(/ai|artificial intelligence|analytics|impact analysis|prediction|recommendation|insight|optimization|monitoring|intelligence|natural language/)) {
    return 'EPIC-5';
  }
  
  // EPIC-6: Knowledge & Collaboration
  if (text.match(/wiki|knowledge|documentation|comment|collaboration|search|template|best practice|confluence|sharepoint|version history/)) {
    return 'EPIC-6';
  }
  
  // EPIC-4: Development & Implementation (default for dev-related)
  if (text.match(/github|commit|user story|epic|gherkin|acceptance criteria|sprint|task|ide|code|development|implementation|traceability/)) {
    return 'EPIC-4';
  }
  
  // Default to EPIC-4 if no clear match
  return 'EPIC-4';
}

async function migrateStories() {
  console.log('🚀 Starting story migration to Epics using keyword matching...\n');

  // Fetch all stories
  const response = await fetch('http://localhost:5000/api/user-stories?pageSize=200');
  const data = await response.json();
  const stories: Story[] = data.items;

  console.log(`📊 Found ${stories.length} total stories`);
  
  // Filter stories without epicId
  const storiesToMigrate = stories.filter(s => !s.epicId);
  console.log(`📝 ${storiesToMigrate.length} stories need Epic assignment\n`);

  if (storiesToMigrate.length === 0) {
    console.log('✅ All stories already have Epics assigned!');
    return;
  }

  const epicCounts: Record<string, number> = {};
  let successCount = 0;
  let failCount = 0;

  // Process all stories
  for (const story of storiesToMigrate) {
    try {
      const epicId = categorizeByKeywords(story);
      
      // Update story
      const updateResponse = await fetch(`http://localhost:5000/api/user-stories/${story.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ epicId })
      });

      if (updateResponse.ok) {
        epicCounts[epicId] = (epicCounts[epicId] || 0) + 1;
        successCount++;
        const title = story.title.substring(0, 60);
        console.log(`✅ ${story.id}: "${title}${title.length === 60 ? '...' : ''}" → ${epicId}`);
      } else {
        failCount++;
        console.error(`❌ Failed to update ${story.id}: ${updateResponse.statusText}`);
      }
    } catch (error) {
      failCount++;
      console.error(`❌ Error processing ${story.id}:`, error);
    }
  }

  console.log('\n📈 Migration Summary:');
  console.log(`  EPIC-1: Strategy & Business Planning - ${epicCounts['EPIC-1'] || 0} stories`);
  console.log(`  EPIC-2: Architecture Design & Modeling - ${epicCounts['EPIC-2'] || 0} stories`);
  console.log(`  EPIC-3: Governance & Decision Management - ${epicCounts['EPIC-3'] || 0} stories`);
  console.log(`  EPIC-4: Development & Implementation - ${epicCounts['EPIC-4'] || 0} stories`);
  console.log(`  EPIC-5: Operations & Intelligence - ${epicCounts['EPIC-5'] || 0} stories`);
  console.log(`  EPIC-6: Knowledge & Collaboration - ${epicCounts['EPIC-6'] || 0} stories`);
  
  console.log(`\n✅ Successfully migrated: ${successCount} stories`);
  if (failCount > 0) {
    console.log(`❌ Failed: ${failCount} stories`);
  }
  
  console.log('\n🎉 Migration complete!');
}

migrateStories().catch(console.error);
