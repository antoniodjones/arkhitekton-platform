/**
 * Seed Wiki Rich Text Formatting (Word-Style Toolbar) User Stories
 * 
 * This script creates the epic and user stories for the Word-style
 * rich text formatting toolbar feature in the wiki editor.
 * 
 * Run with: npx tsx scripts/seed-wiki-rtf-stories.ts
 */

import dotenv from 'dotenv';
dotenv.config();

import { db } from '../server/db';
import { epics, userStories } from '../shared/schema';
import { eq } from 'drizzle-orm';

const EPIC_ID = 'EPIC-WIKI-007';

const epicData = {
  id: EPIC_ID,
  name: 'Word-Style Rich Text Formatting Toolbar',
  description: 'Transform the ARKHITEKTON wiki editor into a professional-grade document authoring experience that matches the familiarity and power of Microsoft Word. Enterprise users expect the formatting controls they know from desktop applications.',
  valueStream: 'knowledge',
  status: 'completed',
  priority: 'high',
  owner: 'Product Team',
  targetQuarter: 'Q4 2024',
  completionPercentage: 100,
  totalStoryPoints: 58,
  completedStoryPoints: 58,
  coreCapabilities: [
    'Text Alignment',
    'Paragraph Indentation',
    'Subscript/Superscript',
    'Change Case',
    'Clear Formatting',
    'Highlight Colors',
    'Font Size Control',
    'Format Painter',
    'Style Presets'
  ],
  keyFeatures: [
    'Left/Center/Right/Justify alignment with keyboard shortcuts',
    'Multi-level paragraph indentation with Tab/Shift+Tab',
    'Scientific notation support via subscript/superscript',
    'Quick case transformation (upper/lower/title/sentence)',
    'One-click formatting reset',
    '8-color highlight palette',
    'Font size dropdown with +/- increment buttons',
    'Format painter for copying styles between selections',
    'Predefined style presets (Normal, Title, Heading, Quote, Code)'
  ],
  businessGoals: [
    'Match Microsoft Word formatting capabilities',
    'Reduce learning curve for enterprise users',
    'Enable creation of publication-quality documentation',
    'Increase wiki adoption and user satisfaction'
  ],
};

const stories = [
  {
    id: 'US-WIKI-RTF-001',
    epicId: EPIC_ID,
    title: 'Text Alignment Controls',
    description: 'As a wiki author, I want to align text left, center, right, or justified so that I can create professionally formatted documents with proper visual structure.',
    acceptanceCriteria: `Feature: Text Alignment Controls

  Background:
    Given I am editing a wiki page
    And the formatting toolbar is visible

  Scenario: Display alignment buttons in toolbar
    When I look at the formatting toolbar
    Then I should see Left Align button with AlignLeft icon
    And I should see Center Align button with AlignCenter icon
    And I should see Right Align button with AlignRight icon
    And I should see Justify button with AlignJustify icon

  Scenario: Left align paragraph
    Given I have cursor in a paragraph
    When I click the Left Align button
    Then the paragraph should align to the left
    And the Left Align button should appear pressed/active

  Scenario: Center align paragraph
    Given I have cursor in a paragraph
    When I click the Center Align button
    Then the paragraph should be centered horizontally

  Scenario: Keyboard shortcuts for alignment
    Given I have cursor in a paragraph
    When I press "Ctrl+Shift+L" Then left align
    When I press "Ctrl+Shift+E" Then center align
    When I press "Ctrl+Shift+R" Then right align
    When I press "Ctrl+Shift+J" Then justify`,
    storyPoints: 5,
    status: 'done' as const,
    priority: 'high' as const,
    feature: 'Text Alignment',
    value: 'Professional document formatting',
    requirement: 'HLR-WIKI-RTF-001',
    labels: ['wiki', 'formatting', 'alignment', 'toolbar']
  },
  {
    id: 'US-WIKI-RTF-002',
    epicId: EPIC_ID,
    title: 'Paragraph Indentation Controls',
    description: 'As a wiki author, I want to indent and outdent paragraphs so that I can create visual hierarchy and structure in my documents.',
    acceptanceCriteria: `Feature: Paragraph Indentation Controls

  Scenario: Increase paragraph indent
    Given I have cursor in a paragraph with no indent
    When I click the Increase Indent button
    Then the paragraph should move 24 pixels to the right

  Scenario: Multiple indent levels
    Given I have cursor in a paragraph with indent level 1
    When I click the Increase Indent button
    Then the indent level should be 2

  Scenario: Maximum indent level
    Given I have paragraph with indent level 10
    When I click Increase Indent
    Then indent should remain at 10

  Scenario: Keyboard shortcuts for indent
    When I press "Tab" Then increase indent
    When I press "Shift+Tab" Then decrease indent`,
    storyPoints: 4,
    status: 'done' as const,
    priority: 'high' as const,
    feature: 'Paragraph Indentation',
    value: 'Visual hierarchy in documents',
    requirement: 'HLR-WIKI-RTF-002',
    labels: ['wiki', 'formatting', 'indent', 'toolbar']
  },
  {
    id: 'US-WIKI-RTF-003',
    epicId: EPIC_ID,
    title: 'Subscript Text Formatting',
    description: 'As a wiki author documenting technical content, I want to format text as subscript so that I can write chemical formulas (H₂O) correctly.',
    acceptanceCriteria: `Feature: Subscript Text Formatting

  Scenario: Apply subscript to selected text
    Given I have selected the text "2" in "H2O"
    When I click the Subscript button
    Then "2" should render as subscript: H₂O

  Scenario: Toggle subscript off
    Given I have subscript text selected
    When I click the Subscript button
    Then the text should return to normal baseline

  Scenario: Keyboard shortcut for subscript
    Given I have text selected
    When I press "Ctrl+,"
    Then the selected text should toggle subscript`,
    storyPoints: 3,
    status: 'done' as const,
    priority: 'medium' as const,
    feature: 'Subscript',
    value: 'Scientific notation support',
    requirement: 'HLR-WIKI-RTF-003',
    labels: ['wiki', 'formatting', 'subscript', 'toolbar']
  },
  {
    id: 'US-WIKI-RTF-004',
    epicId: EPIC_ID,
    title: 'Superscript Text Formatting',
    description: 'As a wiki author, I want to format text as superscript so that I can write exponents (x²), footnotes, and trademark symbols correctly.',
    acceptanceCriteria: `Feature: Superscript Text Formatting

  Scenario: Apply superscript to selected text
    Given I have selected the text "2" in "x2"
    When I click the Superscript button
    Then "2" should render as superscript: x²

  Scenario: Toggle superscript off
    Given I have superscript text selected
    When I click the Superscript button
    Then the text should return to normal baseline

  Scenario: Keyboard shortcut for superscript
    Given I have text selected
    When I press "Ctrl+."
    Then the selected text should toggle superscript`,
    storyPoints: 3,
    status: 'done' as const,
    priority: 'medium' as const,
    feature: 'Superscript',
    value: 'Mathematical notation support',
    requirement: 'HLR-WIKI-RTF-004',
    labels: ['wiki', 'formatting', 'superscript', 'toolbar']
  },
  {
    id: 'US-WIKI-RTF-005',
    epicId: EPIC_ID,
    title: 'Change Text Case',
    description: 'As a wiki author, I want to quickly change the case of selected text so that I can fix capitalization errors without retyping.',
    acceptanceCriteria: `Feature: Change Text Case

  Scenario: Convert to uppercase
    Given I have selected the text "hello world"
    When I click Change Case > UPPERCASE
    Then the text should become "HELLO WORLD"

  Scenario: Convert to lowercase
    Given I have selected the text "HELLO WORLD"
    When I click Change Case > lowercase
    Then the text should become "hello world"

  Scenario: Convert to title case
    Given I have selected the text "hello world example"
    When I click Change Case > Title Case
    Then the text should become "Hello World Example"

  Scenario: Convert to sentence case
    Given I have selected the text "HELLO WORLD EXAMPLE"
    When I click Change Case > Sentence case
    Then the text should become "Hello world example"`,
    storyPoints: 4,
    status: 'done' as const,
    priority: 'medium' as const,
    feature: 'Change Case',
    value: 'Quick capitalization fix',
    requirement: 'HLR-WIKI-RTF-005',
    labels: ['wiki', 'formatting', 'case', 'toolbar']
  },
  {
    id: 'US-WIKI-RTF-006',
    epicId: EPIC_ID,
    title: 'Clear All Formatting',
    description: 'As a wiki author, I want to quickly remove all formatting from selected text so that I can start fresh or clean up pasted content.',
    acceptanceCriteria: `Feature: Clear All Formatting

  Scenario: Clear formatting removes all marks
    Given I have selected text with Bold, Italic, Underline, Highlight, Color
    When I click the Clear Formatting button
    Then all marks should be removed

  Scenario: Clear formatting removes text styles
    Given I have selected text with Font Size, Font Family, Text Color
    When I click the Clear Formatting button
    Then the text should reset to default styles

  Scenario: Clear formatting removes alignment
    Given I have a centered paragraph selected
    When I click the Clear Formatting button
    Then the paragraph should reset to left alignment`,
    storyPoints: 3,
    status: 'done' as const,
    priority: 'high' as const,
    feature: 'Clear Formatting',
    value: 'Quick formatting reset',
    requirement: 'HLR-WIKI-RTF-006',
    labels: ['wiki', 'formatting', 'clear', 'toolbar']
  },
  {
    id: 'US-WIKI-RTF-007',
    epicId: EPIC_ID,
    title: 'Highlight Color Picker',
    description: 'As a wiki author, I want to highlight text with different colors so that I can visually categorize information.',
    acceptanceCriteria: `Feature: Highlight Color Picker

  Scenario: Open highlight color picker
    When I click the Highlight button
    Then a popover should open with 8 colors:
      Yellow, Green, Blue, Pink, Orange, Purple, Red, Cyan

  Scenario: Apply highlight color to text
    Given I have text selected
    When I click Yellow in the picker
    Then the text should have yellow background

  Scenario: Remove highlight
    Given I have highlighted text selected
    When I click "Remove Highlight"
    Then the highlight should be removed`,
    storyPoints: 4,
    status: 'done' as const,
    priority: 'medium' as const,
    feature: 'Highlight Colors',
    value: 'Visual categorization',
    requirement: 'HLR-WIKI-RTF-007',
    labels: ['wiki', 'formatting', 'highlight', 'colors', 'toolbar']
  },
  {
    id: 'US-WIKI-RTF-008',
    epicId: EPIC_ID,
    title: 'Font Size Dropdown with Increment Controls',
    description: 'As a wiki author, I want to select font sizes from a dropdown or use increment buttons for precise text sizing.',
    acceptanceCriteria: `Feature: Font Size Dropdown

  Scenario: Open font size dropdown
    When I click the font size dropdown
    Then I should see sizes: 8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 72

  Scenario: Select font size from dropdown
    Given I have text selected
    When I click "24" in dropdown
    Then the text should be 24px

  Scenario: Increase font size with button
    Given I have text at size 16
    When I click the "+" button
    Then the text size should become 17px

  Scenario: Decrease font size with button
    Given I have text at size 16
    When I click the "-" button
    Then the text size should become 15px`,
    storyPoints: 4,
    status: 'done' as const,
    priority: 'high' as const,
    feature: 'Font Size Control',
    value: 'Precise text sizing',
    requirement: 'HLR-WIKI-RTF-008',
    labels: ['wiki', 'formatting', 'font-size', 'toolbar']
  },
  {
    id: 'US-WIKI-RTF-009',
    epicId: EPIC_ID,
    title: 'Format Painter',
    description: 'As a wiki author, I want to copy formatting from one selection and apply it to another for consistent styling.',
    acceptanceCriteria: `Feature: Format Painter

  Scenario: Activate format painter
    Given I have styled text selected (bold, italic, red, 18px)
    When I click the Format Painter button
    Then the button should become active
    And the stored format should include all marks

  Scenario: Apply copied format to new selection
    Given the format painter is active
    When I select different text
    Then the stored formatting should be applied
    And the format painter should deactivate

  Scenario: Cancel format painter
    Given the format painter is active
    When I click the Format Painter button again
    Then it should deactivate without applying`,
    storyPoints: 5,
    status: 'done' as const,
    priority: 'high' as const,
    feature: 'Format Painter',
    value: 'Consistent styling efficiency',
    requirement: 'HLR-WIKI-RTF-009',
    labels: ['wiki', 'formatting', 'format-painter', 'productivity', 'toolbar']
  },
  {
    id: 'US-WIKI-RTF-010',
    epicId: EPIC_ID,
    title: 'Style Presets Dropdown',
    description: 'As a wiki author, I want to apply predefined style presets for quick consistent formatting.',
    acceptanceCriteria: `Feature: Style Presets Dropdown

  Scenario: Open style presets menu
    When I click the Styles dropdown
    Then I should see: Normal, Title, Heading 1, Heading 2, Subtitle, Quote, Code

  Scenario: Apply Normal style
    Given I have formatted text selected
    When I click Styles > Normal
    Then the text should reset to 16px normal weight

  Scenario: Apply Title style
    Given I have text selected
    When I click Styles > Title
    Then the text should become 28px bold

  Scenario: Apply Code style
    Given I have text selected
    When I click Styles > Code
    Then the text should be 13px Courier New with pink color`,
    storyPoints: 5,
    status: 'done' as const,
    priority: 'medium' as const,
    feature: 'Style Presets',
    value: 'Quick consistent formatting',
    requirement: 'HLR-WIKI-RTF-010',
    labels: ['wiki', 'formatting', 'styles', 'presets', 'toolbar']
  },
  {
    id: 'US-WIKI-RTF-IMPL-001',
    epicId: EPIC_ID,
    title: 'Implement TextAlign TipTap Extension',
    description: 'As a developer, I need to create the TextAlign extension for TipTap to enable paragraph alignment.',
    acceptanceCriteria: `Feature: TextAlign Extension Implementation

  Scenario: Create extension file
    Given I create extensions/text-align.ts
    Then it should export TextAlignExtension
    And provide setTextAlign and unsetTextAlign commands

  Scenario: Define keyboard shortcuts
    Then it should register:
      Mod-Shift-l for left
      Mod-Shift-e for center
      Mod-Shift-r for right
      Mod-Shift-j for justify`,
    storyPoints: 3,
    status: 'done' as const,
    priority: 'high' as const,
    feature: 'Extension Implementation',
    value: 'Technical implementation',
    requirement: '',
    labels: ['wiki', 'implementation', 'tiptap', 'extension']
  },
  {
    id: 'US-WIKI-RTF-IMPL-002',
    epicId: EPIC_ID,
    title: 'Implement Indent TipTap Extension',
    description: 'As a developer, I need to create the Indent extension for TipTap to enable paragraph indentation.',
    acceptanceCriteria: `Feature: Indent Extension Implementation

  Scenario: Create extension file
    Given I create extensions/indent.ts
    Then it should export IndentExtension
    And provide indent, outdent, setIndent, unsetIndent commands

  Scenario: Define options
    Then it should have:
      minIndent: 0
      maxIndent: 10
      indentUnit: 24px

  Scenario: Define keyboard shortcuts
    Then Tab should indent
    And Shift-Tab should outdent`,
    storyPoints: 4,
    status: 'done' as const,
    priority: 'high' as const,
    feature: 'Extension Implementation',
    value: 'Technical implementation',
    requirement: '',
    labels: ['wiki', 'implementation', 'tiptap', 'extension']
  },
  {
    id: 'US-WIKI-RTF-IMPL-003',
    epicId: EPIC_ID,
    title: 'Implement Subscript and Superscript Extensions',
    description: 'As a developer, I need to create Subscript and Superscript mark extensions for TipTap.',
    acceptanceCriteria: `Feature: Subscript/Superscript Extensions

  Scenario: Create Subscript extension
    Given I create extensions/subscript.ts
    Then it should render as <sub> element
    And provide toggleSubscript command
    And use Mod-, keyboard shortcut

  Scenario: Create Superscript extension
    Given I create extensions/superscript.ts
    Then it should render as <sup> element
    And provide toggleSuperscript command
    And use Mod-. keyboard shortcut`,
    storyPoints: 3,
    status: 'done' as const,
    priority: 'medium' as const,
    feature: 'Extension Implementation',
    value: 'Technical implementation',
    requirement: '',
    labels: ['wiki', 'implementation', 'tiptap', 'extension', 'marks']
  },
  {
    id: 'US-WIKI-RTF-IMPL-004',
    epicId: EPIC_ID,
    title: 'Integrate New Controls into Toolbar',
    description: 'As a developer, I need to add all new formatting controls to the TipTap editor toolbar.',
    acceptanceCriteria: `Feature: Toolbar Integration

  Scenario: Import new extensions and icons
    Given I edit tiptap-editor.tsx
    Then I import TextAlignExtension, IndentExtension, SubscriptExtension, SuperscriptExtension
    And import AlignLeft, AlignCenter, AlignRight, AlignJustify, Indent, Outdent, Subscript, Superscript, CaseSensitive, RemoveFormatting, Paintbrush, Sparkles icons

  Scenario: Add toolbar button groups
    Then I add sections for:
      Format Painter and Clear Formatting
      Style Presets dropdown
      Change Case dropdown
      Alignment buttons
      Indentation buttons
      Font Size dropdown with +/- buttons
      Highlight color picker`,
    storyPoints: 8,
    status: 'done' as const,
    priority: 'high' as const,
    feature: 'Toolbar Integration',
    value: 'Technical implementation',
    requirement: '',
    labels: ['wiki', 'implementation', 'toolbar', 'ui']
  }
];

async function seedWikiRTFStories() {
  console.log('🚀 Seeding Wiki Rich Text Formatting Stories...\n');

  // Check if epic exists
  const existingEpic = await db.select().from(epics).where(eq(epics.id, EPIC_ID)).limit(1);
  
  if (existingEpic.length === 0) {
    console.log(`📌 Creating Epic: ${EPIC_ID}`);
    await db.insert(epics).values(epicData as any);
  } else {
    console.log(`📌 Epic already exists: ${EPIC_ID}`);
  }

  console.log('\n📝 Creating User Stories...');
  let created = 0;
  let skipped = 0;

  for (const story of stories) {
    const existing = await db.select().from(userStories).where(eq(userStories.id, story.id)).limit(1);
    
    if (existing.length > 0) {
      console.log(`   ⏭️  ${story.id}: Already exists, skipping`);
      skipped++;
      continue;
    }

    await db.insert(userStories).values({
      id: story.id,
      epicId: story.epicId,
      title: story.title,
      description: story.description,
      acceptanceCriteria: story.acceptanceCriteria,
      storyPoints: story.storyPoints,
      status: story.status,
      priority: story.priority,
      feature: story.feature,
      value: story.value,
      requirement: story.requirement,
      labels: story.labels,
    } as any);

    console.log(`   ✅ ${story.id}: ${story.title} (${story.storyPoints} pts)`);
    created++;
  }

  console.log(`\n📊 Summary:`);
  console.log(`   Epic: ${EPIC_ID} - Word-Style Rich Text Formatting Toolbar`);
  console.log(`   Stories Created: ${created}`);
  console.log(`   Stories Skipped: ${skipped}`);
  console.log(`   Total Points: 58`);
  console.log('\n✅ Done!');

  process.exit(0);
}

seedWikiRTFStories().catch((error) => {
  console.error('❌ Error seeding stories:', error);
  process.exit(1);
});

