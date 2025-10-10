// Migration script to assign existing user stories to appropriate Epics based on content analysis
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface Story {
  id: string;
  title: string;
  description: string | null;
  feature: string | null;
  epicId: string | null;
}

interface Epic {
  id: string;
  name: string;
  valueStream: string;
  description: string;
}

const EPICS: Epic[] = [
  {
    id: "EPIC-1",
    name: "Strategy & Business Planning",
    valueStream: "strategy",
    description: "Business strategy, portfolio management, capability assessment, strategic initiatives, business-to-technology mapping, ROI analysis"
  },
  {
    id: "EPIC-2",
    name: "Architecture Design & Modeling",
    valueStream: "design",
    description: "Visual design, modeling workspace, drag-drop canvas, component palettes (ArchiMate, TOGAF, BPMN), cloud architecture (AWS, Azure, GCP, Oracle), object-oriented model design, model versioning"
  },
  {
    id: "EPIC-3",
    name: "Governance & Decision Management",
    valueStream: "governance",
    description: "Architecture Decision Records (ADRs), review workflows, approvals, compliance tracking, policy enforcement, risk assessment, technical debt, audit trails, tickets"
  },
  {
    id: "EPIC-4",
    name: "Development & Implementation",
    valueStream: "development",
    description: "User story management, Gherkin acceptance criteria, Epic organization, GitHub integration, commit-to-story traceability, sprint planning, task management, IDE plugins, forward/reverse engineering"
  },
  {
    id: "EPIC-5",
    name: "Operations & Intelligence",
    valueStream: "operations",
    description: "AI-powered recommendations, intelligent impact analysis, predictive analytics, pattern recognition, change detection, monitoring, natural language queries, performance optimization, cost optimization"
  },
  {
    id: "EPIC-6",
    name: "Knowledge & Collaboration",
    valueStream: "knowledge",
    description: "Hierarchical wiki, documentation pages, version history, threaded comments, full-text search, templates, best practices library, integration with external docs (Confluence, SharePoint), real-time collaboration"
  }
];

async function categorizeStory(story: Story): Promise<string> {
  const storyContext = `
Title: ${story.title}
Description: ${story.description || 'N/A'}
Feature: ${story.feature || 'N/A'}
  `.trim();

  const prompt = `You are analyzing a user story for an Enterprise Architecture platform called ARKHITEKTON. Based on the story content, assign it to ONE of these 6 Epics:

${EPICS.map(e => `${e.id}: ${e.name} - ${e.description}`).join('\n\n')}

User Story:
${storyContext}

Respond with ONLY the Epic ID (e.g., EPIC-1, EPIC-2, etc.) that best matches this story's content. No explanation needed.`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 20,
    messages: [{
      role: 'user',
      content: prompt
    }]
  });

  const epicId = response.content[0].type === 'text' 
    ? response.content[0].text.trim() 
    : 'EPIC-4';

  // Validate Epic ID
  if (!EPICS.find(e => e.id === epicId)) {
    console.warn(`Invalid Epic ID ${epicId} for story ${story.id}, defaulting to EPIC-4`);
    return 'EPIC-4';
  }

  return epicId;
}

async function migrateStories() {
  console.log('🚀 Starting story migration to Epics...\n');

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

  // Process stories in batches to avoid rate limits
  const batchSize = 5;
  const epicCounts: Record<string, number> = {};

  for (let i = 0; i < storiesToMigrate.length; i += batchSize) {
    const batch = storiesToMigrate.slice(i, i + batchSize);
    
    await Promise.all(batch.map(async (story) => {
      try {
        // Use AI to categorize
        const epicId = await categorizeStory(story);
        
        // Update story
        const updateResponse = await fetch(`http://localhost:5000/api/user-stories/${story.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ epicId })
        });

        if (updateResponse.ok) {
          epicCounts[epicId] = (epicCounts[epicId] || 0) + 1;
          console.log(`✅ ${story.id}: "${story.title.substring(0, 50)}..." → ${epicId}`);
        } else {
          console.error(`❌ Failed to update ${story.id}: ${updateResponse.statusText}`);
        }
      } catch (error) {
        console.error(`❌ Error processing ${story.id}:`, error);
      }
    }));

    // Small delay between batches
    if (i + batchSize < storiesToMigrate.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  console.log('\n📈 Migration Summary:');
  EPICS.forEach(epic => {
    const count = epicCounts[epic.id] || 0;
    console.log(`  ${epic.id}: ${epic.name} - ${count} stories`);
  });
  
  console.log('\n🎉 Migration complete!');
}

migrateStories().catch(console.error);
