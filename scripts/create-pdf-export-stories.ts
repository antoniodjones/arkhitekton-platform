import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../shared/schema';

// Load environment variables
config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const db = drizzle(pool, { schema });

const pdfExportStories = [
  {
    id: 'US-PDF-001',
    title: 'Export Single User Story as PDF',
    description: 'As a product manager, I want to export a single user story as a PDF document so that I can share it with stakeholders, include it in presentations, or maintain offline documentation.',
    acceptanceCriteria: `Given I am viewing a user story in the plan module
When I click the "Export to PDF" button
Then the system should generate a PDF document with:
- Header containing: Story Name | Story ID | Feature
- Story title and description
- Acceptance criteria in Gherkin format
- Story metadata (status, priority, story points, assignee)
- Epic information (if linked)
- Labels and tags
- Creation and last updated dates
- Related defects (if any)
And the PDF should download automatically with filename format: {story-id}_{story-title}.pdf`,
    epicId: 'EPIC-UAW',
    status: 'backlog',
    priority: 'high',
    storyPoints: 5,
    feature: 'PDF Export',
    value: 'Enable offline documentation and stakeholder sharing',
    requirement: 'Support PDF export functionality for user stories',
    labels: ['pdf-export', 'documentation', 'reporting', 'ux-enhancement']
  },
  {
    id: 'US-PDF-002',
    title: 'Bulk Export User Stories as PDF',
    description: 'As a product manager, I want to export multiple user stories as a single PDF document so that I can share sprint planning documentation or epic summaries with the team.',
    acceptanceCriteria: `Given I have selected multiple user stories from the plan module
When I click the "Export Selected to PDF" button
Then the system should generate a single PDF document with:
- Cover page with export metadata (date, total stories, filter criteria)
- Table of contents with story IDs and titles
- Each story on a separate page with full details
- Consistent header on each page: Story Name | Story ID | Feature
- Page numbers in footer
- Summary statistics at the end (total stories by status, priority distribution)
And the PDF should download with filename format: user-stories-export_{timestamp}.pdf`,
    epicId: 'EPIC-UAW',
    status: 'backlog',
    priority: 'medium',
    storyPoints: 8,
    feature: 'PDF Export',
    value: 'Streamline sprint planning and team collaboration',
    requirement: 'Support bulk PDF export functionality',
    labels: ['pdf-export', 'bulk-operations', 'sprint-planning', 'documentation']
  },
  {
    id: 'US-PDF-003',
    title: 'Customize PDF Header Layout and Branding',
    description: 'As a platform administrator, I want to customize the PDF header layout and branding so that exported documents align with our organization\'s standards and visual identity.',
    acceptanceCriteria: `Given I am in the PDF export settings
When I configure the header customization options
Then I should be able to:
- Set custom header format (e.g., "Story Name | Story ID | Feature" or alternate layouts)
- Upload organization logo for header/footer
- Configure color scheme (primary, secondary, accent colors)
- Set font family and sizes for headers and body text
- Define page margins and spacing
- Preview changes before applying
- Save custom templates for reuse
And these settings should persist across all PDF exports`,
    epicId: 'EPIC-UAW',
    status: 'backlog',
    priority: 'low',
    storyPoints: 5,
    feature: 'PDF Export',
    value: 'Ensure brand consistency and professional documentation',
    requirement: 'Provide PDF customization and branding options',
    labels: ['pdf-export', 'customization', 'branding', 'settings']
  },
  {
    id: 'US-PDF-004',
    title: 'Export Epic with All Related Stories as PDF Report',
    description: 'As a product manager, I want to export an entire epic with all its related user stories as a comprehensive PDF report so that I can provide stakeholders with a complete view of the value stream.',
    acceptanceCriteria: `Given I am viewing an epic in the plan module
When I click "Export Epic to PDF"
Then the system should generate a PDF report with:
- Epic overview page (name, description, goals, timeline, progress)
- Epic header: Epic Name | Epic ID | Status
- Summary dashboard (total stories, completion %, story points burned)
- All related user stories grouped by status
- Each story with header: Story Name | Story ID | Feature
- Dependencies and relationships visualization
- Burndown chart or progress tracking
- Key milestones and deliverables
And the PDF should download with filename format: epic-{epic-id}_{epic-name}_report.pdf`,
    epicId: 'EPIC-UAW',
    status: 'backlog',
    priority: 'high',
    storyPoints: 13,
    feature: 'PDF Export',
    value: 'Provide comprehensive reporting for epics and value streams',
    requirement: 'Support epic-level PDF report generation',
    labels: ['pdf-export', 'epic-reporting', 'analytics', 'stakeholder-reporting']
  },
  {
    id: 'US-PDF-005',
    title: 'Include Attachments and Screenshots in PDF Export',
    description: 'As a product manager, I want to include story attachments and screenshots in the PDF export so that all relevant context is preserved in the exported document.',
    acceptanceCriteria: `Given I am exporting a user story that has attachments or screenshots
When the PDF is generated
Then the PDF should include:
- All screenshots embedded inline within the story section
- Attachments listed with icons and links (if PDF supports hyperlinks)
- Thumbnail preview of image attachments
- File metadata (name, type, size, upload date)
- Proper image scaling to fit page width
- Captions for screenshots indicating what they demonstrate
And the total PDF file size should be optimized for email transmission (<10MB)`,
    epicId: 'EPIC-UAW',
    status: 'backlog',
    priority: 'medium',
    storyPoints: 5,
    feature: 'PDF Export',
    value: 'Preserve all story context in exported documentation',
    requirement: 'Support embedding attachments and screenshots in PDF',
    labels: ['pdf-export', 'attachments', 'images', 'documentation']
  },
  {
    id: 'US-PDF-006',
    title: 'Print User Stories Directly from Browser',
    description: 'As a user, I want to print user stories directly from my browser with optimized formatting so that I can quickly create physical copies for workshops or wall boards.',
    acceptanceCriteria: `Given I am viewing a user story or list of stories
When I use the browser print function (Ctrl+P / Cmd+P)
Then the page should render in print-optimized format with:
- Header on each page: Story Name | Story ID | Feature
- Clean, minimal styling without navigation elements
- Page breaks between stories (for multi-story views)
- Proper margins for standard paper (A4/Letter)
- Black and white friendly color scheme
- Print-specific CSS that hides UI chrome (buttons, sidebars)
- Footer with page numbers
And the browser print dialog should show a properly formatted preview`,
    epicId: 'EPIC-UAW',
    status: 'backlog',
    priority: 'medium',
    storyPoints: 3,
    feature: 'PDF Export',
    value: 'Enable quick physical documentation for agile ceremonies',
    requirement: 'Optimize user story pages for browser printing',
    labels: ['pdf-export', 'printing', 'css', 'ux-enhancement']
  }
];

async function createPDFExportStories() {
  console.log('🚀 Creating PDF Export user stories...\n');

  try {
    for (const story of pdfExportStories) {
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

    console.log('✨ Successfully created all PDF Export user stories!');
    console.log('\n📊 Summary:');
    console.log(`- Total Stories: ${pdfExportStories.length}`);
    console.log(`- Epic: EPIC-UAW (Unified Archway)`);
    console.log(`- Total Story Points: ${pdfExportStories.reduce((sum, s) => sum + s.storyPoints, 0)}`);
    console.log(`- Priority Breakdown:`);
    console.log(`  - High: ${pdfExportStories.filter(s => s.priority === 'high').length}`);
    console.log(`  - Medium: ${pdfExportStories.filter(s => s.priority === 'medium').length}`);
    console.log(`  - Low: ${pdfExportStories.filter(s => s.priority === 'low').length}`);

  } catch (error) {
    console.error('❌ Error creating stories:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

createPDFExportStories();

