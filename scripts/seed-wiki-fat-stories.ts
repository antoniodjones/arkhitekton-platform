import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { eq } from 'drizzle-orm';
import * as schema from '../shared/schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });

const EPIC_ID = 'EPIC-WIKI-006';

const epicData = {
  id: EPIC_ID,
  name: 'Content Accessibility & Sharing',
  description: 'Provide intuitive, contextual actions for wiki page content through a floating toolbar that follows modern document editing paradigms (Google Docs, Notion, Confluence). Increases user engagement through accessible AI assistance, text-to-speech for accessibility, and streamlined sharing/collaboration.',
  valueStream: 'knowledge',
  status: 'completed' as const,
  priority: 'high' as const,
  targetQuarter: 'Q4 2025',
  completionPercentage: 100,
  totalStoryPoints: 43,
  completedStoryPoints: 43,
  businessGoals: ['Improve accessibility', 'Increase collaboration', 'Enable AI-assisted content creation', 'Quick edit/save workflow'],
  labels: ['wiki', 'accessibility', 'collaboration', 'ai', 'edit', 'save']
};

const stories = [
  {
    id: 'US-WIKI-FAT-001',
    epicId: EPIC_ID,
    title: 'Floating Toolbar Display',
    description: 'As a wiki user, I want a floating action toolbar visible when viewing page content so that I can quickly access common actions without navigating menus.',
    acceptanceCriteria: `Feature: Floating Action Toolbar Display

  Background:
    Given I am logged into ARKHITEKTON
    And I am on the Wiki module

  Scenario: Toolbar appears when viewing a page
    Given I have navigated to a wiki page with content
    When the page content is fully loaded
    Then I should see a floating toolbar on the right side of the screen
    And the toolbar should be vertically centered
    And the toolbar should have a rounded pill shape
    And the toolbar should contain exactly 4 action buttons

  Scenario: Toolbar visual design matches Google Docs aesthetic
    Given I am viewing a wiki page
    When I observe the floating toolbar
    Then the toolbar should have:
      | Property       | Value                          |
      | Background     | White (light) / Slate-800 (dark) |
      | Shadow         | Subtle drop shadow             |
      | Border Radius  | Fully rounded (pill)           |
      | Icon Color     | Blue-600                       |
    And each button should be 40x40 pixels
    And buttons should have hover states

  Scenario: Toolbar respects dark mode
    Given I have dark mode enabled in settings
    When I view a wiki page
    Then the toolbar background should be slate-800
    And the icons should be blue-400
    And hover states should use blue-950 background`,
    storyPoints: 3,
    status: 'done' as const,
    priority: 'high' as const,
    feature: 'Floating Toolbar UI',
    value: 'Quick access to common actions',
    requirement: 'HLR-WIKI-050',
    labels: ['wiki', 'toolbar', 'ui', 'accessibility']
  },
  {
    id: 'US-WIKI-FAT-002',
    epicId: EPIC_ID,
    title: 'AI Assist Quick Action',
    description: 'As a wiki author, I want to quickly invoke AI assistance from the toolbar so that I can get help improving, summarizing, or expanding my content without leaving the page.',
    acceptanceCriteria: `Feature: AI Assist Quick Action

  Background:
    Given I am viewing a wiki page with content
    And the floating toolbar is visible

  Scenario: AI Assist button is prominently displayed
    When I look at the floating toolbar
    Then I should see an AI Assist button at the top
    And the button should display a sparkles + pencil icon
    And the icon should be blue colored
    And hovering should show tooltip "AI Assist"

  Scenario: Clicking AI Assist triggers assistant
    Given I am viewing a wiki page
    When I click the AI Assist button
    Then the system should display a toast notification
    And the notification should say "AI Assistant"
    And the notification description should indicate analysis is starting

  Scenario: AI Assist with selected text
    Given I have selected a paragraph of text
    When I click the AI Assist button
    Then the AI should focus on the selected text
    And provide contextual suggestions for:
      | Action Type   | Description                    |
      | Improve       | Grammar and clarity suggestions |
      | Expand        | Add more detail                |
      | Summarize     | Create executive summary       |
      | Explain       | Simplify technical content     |`,
    storyPoints: 5,
    status: 'done' as const,
    priority: 'high' as const,
    feature: 'AI Quick Action',
    value: 'AI-assisted content improvement',
    requirement: 'HLR-WIKI-051',
    labels: ['wiki', 'ai', 'toolbar', 'intelligence']
  },
  {
    id: 'US-WIKI-FAT-003',
    epicId: EPIC_ID,
    title: 'Read Aloud Text-to-Speech',
    description: 'As a user with visual impairments or multitasking needs, I want to listen to wiki content read aloud so that I can consume documentation hands-free or while doing other tasks.',
    acceptanceCriteria: `Feature: Read Aloud Text-to-Speech

  Background:
    Given I am viewing a wiki page with text content
    And the floating toolbar is visible
    And my browser supports Web Speech API

  Scenario: Starting text-to-speech
    Given the page has readable text content
    When I click the Read Aloud button
    Then the system should begin reading the page content
    And the button icon should change to Pause
    And a toast should confirm "Reading Aloud"
    And the speech should use default rate 1.0

  Scenario: Stopping text-to-speech
    Given text-to-speech is currently playing
    When I click the Read Aloud button (now showing Pause)
    Then the speech should stop immediately
    And the button icon should change back to Play
    And a toast should confirm "Reading Stopped"

  Scenario: Empty content handling
    Given the wiki page has no text content
    When I click the Read Aloud button
    Then a toast should display "No Content"
    And the description should say "There is no text content to read."
    And the toast variant should be "destructive"`,
    storyPoints: 5,
    status: 'done' as const,
    priority: 'high' as const,
    feature: 'Text-to-Speech',
    value: 'Accessibility and hands-free consumption',
    requirement: 'HLR-WIKI-052',
    labels: ['wiki', 'accessibility', 'tts', 'a11y']
  },
  {
    id: 'US-WIKI-FAT-004',
    epicId: EPIC_ID,
    title: 'Quick Comment Action',
    description: 'As a reviewer or collaborator, I want to quickly add comments to wiki content so that I can provide feedback without disrupting the document flow.',
    acceptanceCriteria: `Feature: Quick Comment Action

  Background:
    Given I am viewing a wiki page
    And the floating toolbar is visible

  Scenario: Add Comment button display
    When I look at the floating toolbar
    Then I should see an Add Comment button
    And the button should display MessageSquarePlus icon
    And hovering should show tooltip "Add Comment"

  Scenario: Clicking Add Comment without selection
    Given no text is selected
    When I click the Add Comment button
    Then a toast should display "Comments"
    And the description should say "Select text and click again to add a comment."

  Scenario: Clicking Add Comment with text selected
    Given I have selected a portion of text
    When I click the Add Comment button
    Then a comment input should appear near the selection
    And I should be able to type my comment
    And pressing Enter should save the comment
    And pressing Escape should cancel`,
    storyPoints: 3,
    status: 'done' as const,
    priority: 'medium' as const,
    feature: 'Inline Comments',
    value: 'Collaborative feedback on content',
    requirement: 'HLR-WIKI-053',
    labels: ['wiki', 'comments', 'collaboration']
  },
  {
    id: 'US-WIKI-FAT-005',
    epicId: EPIC_ID,
    title: 'Share & Export Dropdown',
    description: 'As a wiki author, I want to quickly share or export my documentation so that I can distribute content to stakeholders who may not have ARKHITEKTON access.',
    acceptanceCriteria: `Feature: Share and Export Dropdown

  Background:
    Given I am viewing a wiki page
    And the floating toolbar is visible

  Scenario: Share dropdown options
    Given I click the Share button
    When the dropdown opens
    Then I should see the following options:
      | Option          | Icon     |
      | Copy Link       | Link     |
      | Share via Email | Mail     |
      | Export as PDF   | FileDown |
    And there should be a separator before Export

  Scenario: Copy Link action
    Given the Share dropdown is open
    When I click "Copy Link"
    Then the current page URL should be copied to clipboard
    And a toast should confirm "Link Copied"
    And the description should say "Page link copied to clipboard."

  Scenario: Share via Email action
    Given the Share dropdown is open
    And the page title is "Architecture Decision Record"
    When I click "Share via Email"
    Then my default email client should open
    And the subject should be "Check out: Architecture Decision Record"
    And the body should contain the page URL

  Scenario: Export as PDF action
    Given the Share dropdown is open
    When I click "Export as PDF"
    Then a toast should confirm "Export"
    And the description should say "Exporting page as PDF..."`,
    storyPoints: 5,
    status: 'done' as const,
    priority: 'high' as const,
    feature: 'Share & Export',
    value: 'Easy content distribution',
    requirement: 'HLR-WIKI-054',
    labels: ['wiki', 'share', 'export', 'collaboration']
  },
  {
    id: 'US-WIKI-FAT-006',
    epicId: EPIC_ID,
    title: 'Edit Mode Toggle Button',
    description: 'As a wiki author, I want to quickly toggle edit mode from the floating toolbar so that I can start editing content without navigating to the page header actions.',
    acceptanceCriteria: `Feature: Edit Mode Toggle Button

  Background:
    Given I am logged into ARKHITEKTON
    And I have edit permissions for the current wiki page
    And the floating toolbar is visible

  Scenario: Edit button display when in view mode
    Given I am viewing a wiki page in read-only mode
    When I look at the floating toolbar
    Then I should see an Edit button with Pencil icon
    And hovering should show tooltip "Edit Page"
    And the button should be blue colored

  Scenario: Clicking Edit enters edit mode
    Given I am viewing a wiki page in read-only mode
    When I click the Edit button
    Then the page should enter edit mode
    And the TipTap editor should become editable
    And the Edit button should change to display a Save icon
    And the tooltip should change to "Save Changes"

  Scenario: Unsaved changes indicator
    Given I am in edit mode
    And I have made changes to the content
    When I look at the Edit/Save button
    Then the button should show a visual indicator (dot or pulse)
    And the tooltip should say "Save Changes (unsaved)"`,
    storyPoints: 5,
    status: 'done' as const,
    priority: 'high' as const,
    feature: 'Edit Mode Toggle',
    value: 'Quick edit access from toolbar',
    requirement: 'HLR-WIKI-055',
    labels: ['wiki', 'edit', 'toolbar', 'content-management']
  },
  {
    id: 'US-WIKI-FAT-007',
    epicId: EPIC_ID,
    title: 'Quick Save Action',
    description: 'As a wiki author, I want to quickly save my changes from the floating toolbar so that I can persist my work without scrolling to find save buttons.',
    acceptanceCriteria: `Feature: Quick Save Action

  Background:
    Given I am logged into ARKHITEKTON
    And I am editing a wiki page
    And the floating toolbar is visible

  Scenario: Save button display when in edit mode
    Given I am in edit mode
    When I look at the floating toolbar
    Then I should see a Save button with Save icon (floppy disk)
    And hovering should show tooltip "Save Changes"

  Scenario: Saving content successfully
    Given I have made changes to the page content
    When I click the Save button
    Then the content should be saved to the server
    And a success toast should display "Page Saved"
    And the description should say "Your changes have been saved."
    And the page should remain in edit mode

  Scenario: Save with keyboard shortcut
    Given I am in edit mode
    When I press Cmd+S (or Ctrl+S on Windows)
    Then the content should be saved
    And the keyboard shortcut should be prevented from browser default

  Scenario: Save error handling
    Given I have made changes to the page content
    And the server is unreachable
    When I click the Save button
    Then an error toast should display "Save Failed"
    And the description should explain the error
    And the unsaved changes should be preserved`,
    storyPoints: 3,
    status: 'done' as const,
    priority: 'high' as const,
    feature: 'Quick Save',
    value: 'Fast save from toolbar',
    requirement: 'HLR-WIKI-056',
    labels: ['wiki', 'save', 'toolbar', 'content-management']
  },
  {
    id: 'US-WIKI-FAT-008',
    epicId: EPIC_ID,
    title: 'Print Page Action',
    description: 'As a wiki user, I want to quickly print a wiki page from both the floating toolbar and the page header so that I can create physical copies of documentation for meetings, reviews, or offline reference.',
    acceptanceCriteria: `Feature: Print Page Action

  Background:
    Given I am logged into ARKHITEKTON
    And I am viewing a wiki page with content

  Scenario: Print button in floating toolbar
    Given the floating toolbar is visible
    When I look at the toolbar
    Then I should see a Print button with Printer icon
    And the button should be positioned after the Edit/Save button
    And hovering should show tooltip "Print Page"

  Scenario: Print button in page header
    Given I am viewing a wiki page
    When I look at the page header actions
    Then I should see a Print button with Printer icon
    And the button should be positioned to the right of the Save button

  Scenario: Clicking Print opens print dialog
    Given I am viewing a wiki page
    When I click the Print button (toolbar or header)
    Then the browser's native print dialog should open
    And the page content should be formatted for printing`,
    storyPoints: 5,
    status: 'done' as const,
    priority: 'medium' as const,
    feature: 'Print Page',
    value: 'Physical documentation for meetings',
    requirement: 'HLR-WIKI-057',
    labels: ['wiki', 'print', 'toolbar', 'export']
  },
  {
    id: 'US-WIKI-FAT-IMPL-001',
    epicId: EPIC_ID,
    title: 'Implement Print Button in Floating Toolbar',
    description: 'As a developer, I need to implement a Print button in the FloatingActionToolbar component so that users can print wiki pages from the contextual toolbar.',
    acceptanceCriteria: `Feature: Floating Toolbar Print Button Implementation

  Scenario: Add Printer icon import
    Given I am modifying floating-action-toolbar.tsx
    When I update the lucide-react imports
    Then I should add 'Printer' to the import statement

  Scenario: Add onPrint prop to interface
    Given the FloatingActionToolbarProps interface exists
    When I add the print functionality
    Then I should add: onPrint?: () => void

  Scenario: Implement handlePrint function
    Given the component has handler functions
    When I add the print handler
    Then it should call window.print() or onPrint callback

  Scenario: Add Print button to toolbar JSX
    Given the toolbar buttons are rendered
    When I add the Print button
    Then it should be positioned after the Edit/Save button
    And use Printer icon from lucide-react`,
    storyPoints: 3,
    status: 'done' as const,
    priority: 'high' as const,
    feature: 'Print Implementation',
    value: 'Technical implementation',
    requirement: '',
    labels: ['wiki', 'print', 'implementation', 'frontend']
  },
  {
    id: 'US-WIKI-FAT-IMPL-002',
    epicId: EPIC_ID,
    title: 'Implement Print Button in Wiki Page Header',
    description: 'As a developer, I need to implement a Print button in the wiki page header action bar so that users can print directly from the page controls.',
    acceptanceCriteria: `Feature: Wiki Header Print Button Implementation

  Scenario: Add Printer icon import to wiki-v2.tsx
    Given I am modifying wiki-v2.tsx
    When I update the lucide-react imports
    Then I should add 'Printer' to the import statement

  Scenario: Add Print button next to Save Draft
    Given the page header has action buttons
    When I add the Print button
    Then it should be positioned after the Save Draft button
    And use Button variant="outline" size="sm"
    And call window.print() on click`,
    storyPoints: 2,
    status: 'done' as const,
    priority: 'high' as const,
    feature: 'Print Implementation',
    value: 'Technical implementation',
    requirement: '',
    labels: ['wiki', 'print', 'implementation', 'frontend']
  },
  {
    id: 'US-WIKI-FAT-IMPL-003',
    epicId: EPIC_ID,
    title: 'Implement Print-Specific CSS Styling',
    description: 'As a developer, I need to implement print-specific CSS media queries so that wiki pages print cleanly without UI chrome.',
    acceptanceCriteria: `Feature: Print CSS Media Query Implementation

  Scenario: Add wiki-print-mode body class
    Given the handlePrint function is called
    When printing is triggered
    Then document.body should have 'wiki-print-mode' class
    And the class should be removed after printing completes

  Scenario: Hide non-content elements when printing
    Given the user triggers window.print()
    When the print dialog opens
    Then the following should be hidden:
      - Floating Action Toolbar
      - Sidebar and navigation
      - Buttons and action controls
      - Resizable handles

  Scenario: Show wiki content when printing
    Given print styles are applied via wiki-print-mode
    When the page content is printed
    Then main content area should be visible
    And ProseMirror editor content should display
    And content should use full page width
    And headings should have proper sizing
    And code blocks should preserve styling`,
    storyPoints: 4,
    status: 'done' as const,
    priority: 'medium' as const,
    feature: 'Print CSS',
    value: 'Clean print output',
    requirement: '',
    labels: ['wiki', 'print', 'implementation', 'css']
  }
];

async function seedWikiFATStories() {
  console.log('🚀 Seeding Wiki Floating Action Toolbar Stories...\n');

  try {
    // Check if epic exists
    const existingEpic = await db.query.epics.findFirst({
      where: eq(schema.epics.id, EPIC_ID)
    });

    if (!existingEpic) {
      console.log(`📌 Creating Epic: ${EPIC_ID}`);
      await db.insert(schema.epics).values(epicData);
      console.log(`   ✅ Epic created: ${epicData.name}`);
    } else {
      console.log(`📌 Epic already exists: ${EPIC_ID}`);
    }

    // Insert stories
    console.log('\n📝 Creating User Stories...');
    let created = 0;
    let skipped = 0;

    for (const story of stories) {
      const existing = await db.query.userStories.findFirst({
        where: eq(schema.userStories.id, story.id)
      });

      if (!existing) {
        await db.insert(schema.userStories).values(story);
        console.log(`   ✅ ${story.id}: ${story.title} (${story.storyPoints} pts)`);
        created++;
      } else {
        console.log(`   ⏭️  ${story.id}: Already exists, skipping`);
        skipped++;
      }
    }

    console.log('\n📊 Summary:');
    console.log(`   Epic: ${EPIC_ID} - ${epicData.name}`);
    console.log(`   Stories Created: ${created}`);
    console.log(`   Stories Skipped: ${skipped}`);
    console.log(`   Total Points: ${stories.reduce((sum, s) => sum + s.storyPoints, 0)}`);
    console.log('\n✅ Done!');

  } catch (error) {
    console.error('❌ Error seeding stories:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

seedWikiFATStories();

