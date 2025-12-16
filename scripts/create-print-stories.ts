import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../shared/schema';

// Load environment variables
config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const db = drizzle(pool, { schema });

const printStories = [
  {
    id: 'US-PRINT-001',
    title: 'Print Single User Story to Local/Network Printer',
    description: 'As a product manager, I want to print a user story to my local or network printer with professional formatting so that I can use physical copies for sprint planning, wall boards, or stakeholder meetings.',
    acceptanceCriteria: `Given I am viewing a user story in the plan module
When I click the "Print Story" button or use browser print (Ctrl+P / Cmd+P)
Then the browser print dialog should open with:
- Print-optimized layout matching the PDF template
- Header on each page: Story Name | Story ID | Feature (orange background)
- Clean, professional styling without navigation or UI chrome
- All story metadata in a formatted grid
- Acceptance criteria in a code-block style format
- Proper page breaks for multi-page content
- Standard margins for A4/Letter paper
- Page numbers in footer
And the print preview should show a properly formatted document ready for printing`,
    epicId: 'EPIC-UAW',
    status: 'backlog',
    priority: 'high',
    storyPoints: 3,
    feature: 'Print',
    value: 'Enable physical documentation for agile ceremonies and meetings',
    requirement: 'Provide browser-native printing with professional formatting',
    labels: ['printing', 'browser-print', 'css', 'documentation']
  },
  {
    id: 'US-PRINT-002',
    title: 'Optimize Print CSS for Story Dialog',
    description: 'As a developer, I want to create print-specific CSS styles that match the PDF template so that printed stories have the same professional appearance as exported PDFs.',
    acceptanceCriteria: `Given the print CSS is implemented
When a user prints a story
Then the print output should include:
- @media print styles that hide navigation, buttons, and UI elements
- Orange header bar with white text (Story Name | ID | Feature)
- Metadata grid with light gray background
- Proper typography (font sizes, line heights, margins)
- Code-block styling for acceptance criteria
- Page break rules to prevent awkward content splits
- Footer with generation timestamp and page numbers
- Black and white friendly color scheme option
And the styling should match the jsPDF template design`,
    epicId: 'EPIC-UAW',
    status: 'backlog',
    priority: 'high',
    storyPoints: 5,
    feature: 'Print',
    value: 'Ensure consistent branding across print and PDF outputs',
    requirement: 'Implement comprehensive print CSS stylesheet',
    labels: ['printing', 'css', 'styling', 'responsive-design']
  },
  {
    id: 'US-PRINT-003',
    title: 'Print Multiple User Stories in Batch',
    description: 'As a product manager, I want to print multiple selected user stories in a single print job so that I can efficiently create physical copies for sprint planning sessions.',
    acceptanceCriteria: `Given I have selected multiple user stories
When I click "Print Selected Stories"
Then the system should:
- Open a print preview with all selected stories
- Include a cover page with export metadata (total stories, date)
- Place each story on its own page with proper page breaks
- Maintain consistent header format across all pages
- Number pages sequentially (Page X of Y)
- Include a table of contents on the second page
- Apply the same styling as single story print
And the browser print dialog should open automatically`,
    epicId: 'EPIC-UAW',
    status: 'backlog',
    priority: 'medium',
    storyPoints: 8,
    feature: 'Print',
    value: 'Streamline batch printing for sprint planning and team sessions',
    requirement: 'Support multi-story printing with pagination',
    labels: ['printing', 'bulk-operations', 'sprint-planning', 'pagination']
  },
  {
    id: 'US-PRINT-004',
    title: 'Print Settings and Layout Options',
    description: 'As a user, I want to customize print settings before printing so that I can optimize the output for my specific printer and paper size.',
    acceptanceCriteria: `Given I am about to print a story
When I access print settings
Then I should be able to configure:
- Paper size (A4, Letter, Legal)
- Orientation (Portrait, Landscape)
- Margins (Normal, Narrow, Wide)
- Color mode (Color, Grayscale, Black & White)
- Include/exclude sections (Description, Labels, Metadata)
- Font size adjustment (Small, Medium, Large)
- Header/footer visibility
And these settings should persist for the session`,
    epicId: 'EPIC-UAW',
    status: 'backlog',
    priority: 'low',
    storyPoints: 5,
    feature: 'Print',
    value: 'Provide flexibility for different printing needs and preferences',
    requirement: 'Implement configurable print settings interface',
    labels: ['printing', 'settings', 'customization', 'user-preferences']
  },
  {
    id: 'US-PRINT-005',
    title: 'Print Epic Summary with All Related Stories',
    description: 'As a product manager, I want to print an epic summary with all its related user stories so that I can provide comprehensive documentation for stakeholder reviews.',
    acceptanceCriteria: `Given I am viewing an epic
When I click "Print Epic Report"
Then the print output should include:
- Epic overview page with name, description, and goals
- Epic header: Epic Name | Epic ID | Status
- Summary metrics (total stories, completion %, story points)
- All related user stories grouped by status
- Each story with the standard header format
- Epic-level metrics and progress indicators
- Page breaks between major sections
- Comprehensive table of contents
And the document should be print-ready for stakeholder meetings`,
    epicId: 'EPIC-UAW',
    status: 'backlog',
    priority: 'medium',
    storyPoints: 8,
    feature: 'Print',
    value: 'Enable comprehensive epic documentation for stakeholders',
    requirement: 'Support epic-level printing with hierarchical structure',
    labels: ['printing', 'epic-reporting', 'stakeholder-reporting', 'documentation']
  },
  {
    id: 'US-PRINT-006',
    title: 'Quick Print Button in Story Card',
    description: 'As a user, I want a quick print button directly on story cards so that I can print stories without opening the edit dialog.',
    acceptanceCriteria: `Given I am viewing user stories in the plan module
When I see a story card
Then there should be a print icon button that:
- Is visible on hover or in the actions menu
- Triggers immediate print dialog when clicked
- Uses the same print formatting as the main print feature
- Works from list view, board view, and calendar view
- Doesn't require opening the story edit dialog
And the print should include all story details from the database`,
    epicId: 'EPIC-UAW',
    status: 'backlog',
    priority: 'low',
    storyPoints: 3,
    feature: 'Print',
    value: 'Improve user experience with quick access to print functionality',
    requirement: 'Add contextual print buttons throughout the UI',
    labels: ['printing', 'ux-enhancement', 'quick-actions', 'accessibility']
  }
];

async function createPrintStories() {
  console.log('🖨️  Creating Print user stories...\n');

  try {
    for (const story of printStories) {
      console.log(`Creating story: ${story.id} - ${story.title}`);
      
      await db.insert(schema.userStories).values({
        ...story,
        createdAt: new Date(),
        updatedAt: new Date()
      }).onConflictDoUpdate({
        target: schema.userStories.id,
        set: {
          title: story.title,
          description: story.description,
          acceptanceCriteria: story.acceptanceCriteria,
          epicId: story.epicId,
          status: story.status,
          priority: story.priority,
          storyPoints: story.storyPoints,
          feature: story.feature,
          value: story.value,
          requirement: story.requirement,
          labels: story.labels,
          updatedAt: new Date()
        }
      });

      console.log(`✅ Created/Updated: ${story.id}\n`);
    }

    console.log('✨ Successfully created all Print user stories!');
    console.log('\n📊 Summary:');
    console.log(`- Total Stories: ${printStories.length}`);
    console.log(`- Epic: EPIC-UAW (Unified Archway)`);
    console.log(`- Total Story Points: ${printStories.reduce((sum, s) => sum + s.storyPoints, 0)}`);
    console.log(`- Priority Breakdown:`);
    console.log(`  - High: ${printStories.filter(s => s.priority === 'high').length}`);
    console.log(`  - Medium: ${printStories.filter(s => s.priority === 'medium').length}`);
    console.log(`  - Low: ${printStories.filter(s => s.priority === 'low').length}`);
    
    console.log('\n🎯 Key Features:');
    console.log('  - Browser-native printing (Ctrl+P / Cmd+P)');
    console.log('  - Print CSS matching PDF template design');
    console.log('  - Batch printing for multiple stories');
    console.log('  - Epic-level printing with all stories');
    console.log('  - Customizable print settings');
    console.log('  - Quick print buttons in UI');

  } catch (error) {
    console.error('❌ Error creating stories:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

createPrintStories();

