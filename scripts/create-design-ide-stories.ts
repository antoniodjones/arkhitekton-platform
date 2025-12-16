import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { eq } from 'drizzle-orm';
import * as schema from '../shared/schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const db = drizzle(pool, { schema });

async function createDesignIDEStories() {
  console.log('🏗️  Creating Design IDE EPICs and User Stories...\n');

  // Create EPICs
  const epics = [
    {
      id: 'EPIC-IDE-01',
      name: 'Core IDE Framework',
      description: 'VS Code-inspired six-zone layout with Activity Bar, Sidebars, Editor Area, Panel, and Status Bar. Includes multi-tab support, command palette, keyboard shortcuts, and theme customization.',
      valueStream: 'Design Studio',
      status: 'backlog' as const,
      priority: 'high' as const,
      startDate: new Date().toISOString(),
      targetDate: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString(),
      labels: ['design-ide', 'foundation', 'layout', 'mvp']
    },
    {
      id: 'EPIC-IDE-02',
      name: 'Modeling Canvas Engine',
      description: 'Infinite canvas with pan/zoom, grid snapping, smart guides, drag-drop elements, connection system, undo/redo, multi-selection, and export to PNG/SVG/PDF.',
      valueStream: 'Design Studio',
      status: 'backlog' as const,
      priority: 'high' as const,
      startDate: new Date().toISOString(),
      targetDate: new Date(new Date().setMonth(new Date().getMonth() + 4)).toISOString(),
      labels: ['design-ide', 'canvas', 'modeling', 'mvp']
    },
    {
      id: 'EPIC-IDE-03',
      name: 'Element Library',
      description: '200+ architecture elements (AWS, Azure, GCP, ArchiMate, Generic) with search, filtering, favorites, and recents. Organized by category with drag-drop support.',
      valueStream: 'Design Studio',
      status: 'backlog' as const,
      priority: 'high' as const,
      startDate: new Date().toISOString(),
      targetDate: new Date(new Date().setMonth(new Date().getMonth() + 2)).toISOString(),
      labels: ['design-ide', 'elements', 'palette', 'mvp']
    },
    {
      id: 'EPIC-IDE-04',
      name: 'AI Modeling Agents',
      description: 'Cursor-style AI agents with mode selection (Auto, Question, Strategize, Execute, Scenarios), inline AI (Cmd+K), specialized architects (@SecurityArch, @DataArch, @CloudArch), context awareness, and diff view for changes.',
      valueStream: 'Design Studio',
      status: 'backlog' as const,
      priority: 'high' as const,
      startDate: new Date().toISOString(),
      targetDate: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString(),
      labels: ['design-ide', 'ai', 'agents', 'intelligence', 'cursor-style']
    },
    {
      id: 'EPIC-IDE-05',
      name: 'Validation & Quality',
      description: 'Real-time validation engine checking connections, naming, properties, and patterns. Problems panel with errors/warnings/info, and quick fix actions with AI suggestions.',
      valueStream: 'Design Studio',
      status: 'backlog' as const,
      priority: 'medium' as const,
      startDate: new Date().toISOString(),
      targetDate: new Date(new Date().setMonth(new Date().getMonth() + 5)).toISOString(),
      labels: ['design-ide', 'validation', 'quality', 'intelligence']
    }
  ];

  console.log('Creating EPICs...');
  for (const epic of epics) {
    try {
      await db.insert(schema.epics).values(epic);
      console.log(`✅ Created: ${epic.id} - ${epic.name}`);
    } catch (error: any) {
      if (error.message.includes('duplicate key')) {
        console.log(`⚠️  ${epic.id} already exists, skipping.`);
      } else {
        console.error(`❌ Error creating ${epic.id}:`, error.message);
      }
    }
  }

  console.log('\n📝 Creating User Stories...\n');

  // User Stories
  const stories = [
    // EPIC-IDE-01: Core IDE Framework (6 stories, 39 points)
    {
      id: 'US-IDE-001',
      epicId: 'EPIC-IDE-01',
      title: 'Six-Zone IDE Layout Shell',
      description: 'As a technology architect, I want the Design IDE to display a six-zone layout when I click \'+New Model\' so that I have a familiar, VS Code-style workspace for modeling.',
      acceptanceCriteria: `GIVEN I am on the Design Studio Home page
WHEN I click the '+New Model' button
THEN the Design IDE should launch within 2 seconds
AND display six distinct zones:
  - Activity Bar (Left edge, 48px) - Visible
  - Primary Sidebar (Left, 240px) - Visible
  - Editor Area (Center) - Visible, empty canvas
  - Secondary Sidebar (Right, 280px) - Collapsed
  - Panel Area (Bottom, 150px) - Collapsed
  - Status Bar (Bottom edge, 30px) - Visible
AND the layout should be responsive to window resizing`,
      status: 'backlog' as const,
      priority: 'high' as const,
      storyPoints: 8,
      feature: 'FTR-IDE-001: IDE Layout & Navigation',
      value: 'Familiar VS Code-style interface',
      requirement: 'HLR-IDE-001, HLR-IDE-002',
      labels: ['design-ide', 'layout', 'foundation', 'mvp']
    },
    {
      id: 'US-IDE-002',
      epicId: 'EPIC-IDE-01',
      title: 'Activity Bar Navigation',
      description: 'As a technology architect, I want to navigate between IDE views using the Activity Bar so that I can quickly switch contexts without losing my place.',
      acceptanceCriteria: `GIVEN I am in the Design IDE
WHEN I view the Activity Bar
THEN I should see icons for:
  - Explorer (Model Explorer, Cmd+Shift+E)
  - Search (Search Elements, Cmd+Shift+F)
  - Agents (AI Agents, Cmd+Shift+A)
  - Views (Diagram Views)
  - Settings (IDE Settings)
AND clicking an icon should highlight it with an accent bar
AND open the corresponding panel in the Primary Sidebar`,
      status: 'backlog' as const,
      priority: 'high' as const,
      storyPoints: 5,
      feature: 'FTR-IDE-001: IDE Layout & Navigation',
      value: 'Quick context switching',
      requirement: 'HLR-IDE-003, HLR-IDE-004',
      labels: ['design-ide', 'navigation', 'activity-bar', 'foundation']
    },
    {
      id: 'US-IDE-003',
      epicId: 'EPIC-IDE-01',
      title: 'Resizable Sidebar Panels',
      description: 'As a technology architect, I want to resize sidebar panels by dragging their edges so that I can customize my workspace for different tasks.',
      acceptanceCriteria: `GIVEN I am in the Design IDE
WHEN I hover over the edge between Primary Sidebar and Editor Area
THEN my cursor should change to a resize cursor
AND I should be able to drag to resize between 180px and 400px
AND the Editor Area should adjust accordingly
AND my size preference should persist across sessions`,
      status: 'backlog' as const,
      priority: 'medium' as const,
      storyPoints: 5,
      feature: 'FTR-IDE-001: IDE Layout & Navigation',
      value: 'Customizable workspace',
      requirement: 'HLR-IDE-005',
      labels: ['design-ide', 'layout', 'resize', 'foundation']
    },
    {
      id: 'US-IDE-004',
      epicId: 'EPIC-IDE-01',
      title: 'Multi-Tab Model Editor',
      description: 'As a technology architect, I want to open multiple models in tabs so that I can work on related diagrams simultaneously without losing context.',
      acceptanceCriteria: `GIVEN I have a model open in the Editor Area
WHEN I open another model from the Explorer
THEN it should open in a new tab
AND the tab bar should show both model names with icons
AND I should be able to:
  - Switch tabs by clicking
  - Close tabs with the x button
  - Reorder tabs by dragging
  - See unsaved indicators (dot) on modified tabs
AND Cmd+W should close the active tab`,
      status: 'backlog' as const,
      priority: 'high' as const,
      storyPoints: 8,
      feature: 'FTR-IDE-002: Multi-Tab Model Editor',
      value: 'Multi-model workflow',
      requirement: 'HLR-IDE-010, HLR-IDE-011',
      labels: ['design-ide', 'tabs', 'editor', 'foundation']
    },
    {
      id: 'US-IDE-005',
      epicId: 'EPIC-IDE-01',
      title: 'Command Palette Core',
      description: 'As a technology architect, I want to access all IDE commands through a searchable palette so that I can quickly execute actions without navigating menus.',
      acceptanceCriteria: `GIVEN I am in the Design IDE
WHEN I press Cmd+K (Mac) or Ctrl+K (Windows)
THEN a Command Palette should appear centered at top of Editor Area
AND I should see a search input with placeholder 'Type a command...'
AND typing should filter available commands with fuzzy matching
AND I should see commands organized by category:
  - File: Save, Export, Close
  - Edit: Undo, Redo, Copy, Paste
  - View: Zoom In, Zoom Out, Toggle Grid
  - AI: Ask AI, Generate Diagram
AND pressing Enter should execute the selected command
AND pressing Escape should close the palette`,
      status: 'backlog' as const,
      priority: 'high' as const,
      storyPoints: 8,
      feature: 'FTR-IDE-003: Command Palette',
      value: 'Keyboard-driven workflow',
      requirement: 'HLR-IDE-020, HLR-IDE-021, HLR-IDE-022',
      labels: ['design-ide', 'command-palette', 'keyboard', 'foundation']
    },
    {
      id: 'US-IDE-006',
      epicId: 'EPIC-IDE-01',
      title: 'Theme Switching',
      description: 'As a technology architect, I want to switch between light and dark themes so that I can work comfortably in different lighting conditions.',
      acceptanceCriteria: `GIVEN I am in the Design IDE
WHEN I open Settings > Appearance
THEN I should see theme options:
  - Light: Light backgrounds, dark text
  - Dark: Dark backgrounds, light text
  - System: Follow OS preference
AND selecting a theme should apply immediately
AND my preference should persist across sessions
AND the canvas grid should adapt to the theme`,
      status: 'backlog' as const,
      priority: 'low' as const,
      storyPoints: 5,
      feature: 'FTR-IDE-005: Theme & Customization',
      value: 'User comfort',
      requirement: 'HLR-IDE-030',
      labels: ['design-ide', 'themes', 'customization', 'foundation']
    },

    // EPIC-IDE-02: Modeling Canvas Engine (9 stories, 59 points)
    {
      id: 'US-CVS-001',
      epicId: 'EPIC-IDE-02',
      title: 'Infinite Canvas Pan and Zoom',
      description: 'As a technology architect, I want to pan and zoom on an infinite canvas so that I can navigate large architecture diagrams smoothly.',
      acceptanceCriteria: `GIVEN I am on the modeling canvas
WHEN I hold Space and drag with the mouse
THEN the canvas should pan smoothly at 60fps minimum
AND when I release Space, I return to select mode

WHEN I hold Ctrl/Cmd and scroll the mouse wheel
THEN the canvas should zoom in/out centered on cursor position
AND zoom range should be 10% to 400%
AND zoom level should display in the Status Bar
AND Cmd+0 should reset to 100% zoom`,
      status: 'backlog' as const,
      priority: 'high' as const,
      storyPoints: 8,
      feature: 'FTR-CVS-001: Infinite Canvas',
      value: 'Smooth navigation',
      requirement: 'HLR-CVS-001, HLR-CVS-002, HLR-CVS-003',
      labels: ['design-ide', 'canvas', 'pan', 'zoom', 'foundation']
    },
    {
      id: 'US-CVS-002',
      epicId: 'EPIC-IDE-02',
      title: 'Grid and Snap System',
      description: 'As a technology architect, I want elements to snap to a grid so that I can create well-aligned, professional diagrams.',
      acceptanceCriteria: `GIVEN I am on the modeling canvas
WHEN grid snapping is enabled (default)
THEN dragged elements should snap to 10px grid intersections
AND a subtle grid should be visible on the canvas
AND I should be able to toggle grid visibility with Cmd+G
AND I should be able to toggle snapping with Cmd+Shift+G
AND grid size should be configurable: 5px, 10px, 20px`,
      status: 'backlog' as const,
      priority: 'high' as const,
      storyPoints: 5,
      feature: 'FTR-CVS-001: Infinite Canvas',
      value: 'Professional alignment',
      requirement: 'HLR-CVS-004, HLR-CVS-005',
      labels: ['design-ide', 'canvas', 'grid', 'snap', 'foundation']
    },
    {
      id: 'US-CVS-003',
      epicId: 'EPIC-IDE-02',
      title: 'Smart Alignment Guides',
      description: 'As a technology architect, I want smart alignment guides to appear when moving elements so that I can easily align components with each other.',
      acceptanceCriteria: `GIVEN I have multiple elements on the canvas
WHEN I drag an element near another element
THEN alignment guides should appear showing:
  - Center horizontal: Blue horizontal line
  - Center vertical: Blue vertical line
  - Top edge: Magenta line at top
  - Bottom edge: Magenta line at bottom
  - Left edge: Magenta line at left
  - Right edge: Magenta line at right
AND the dragged element should snap to the guide position
AND guides should disappear when I release the element`,
      status: 'backlog' as const,
      priority: 'medium' as const,
      storyPoints: 5,
      feature: 'FTR-CVS-001: Infinite Canvas',
      value: 'Easy alignment',
      requirement: 'HLR-CVS-006',
      labels: ['design-ide', 'canvas', 'alignment', 'guides', 'foundation']
    },
    {
      id: 'US-CVS-004',
      epicId: 'EPIC-IDE-02',
      title: 'Element Drag and Drop',
      description: 'As a technology architect, I want to drag elements from the palette onto the canvas so that I can quickly build diagrams.',
      acceptanceCriteria: `GIVEN I am viewing the Element Palette
WHEN I drag an element (e.g., AWS Lambda icon) from the palette
THEN a ghost preview should follow my cursor
AND when I drop it on the canvas
THEN the element should be created at the drop position
AND the element should be automatically selected
AND the Properties panel should show element details
AND I should be able to undo with Cmd+Z`,
      status: 'backlog' as const,
      priority: 'high' as const,
      storyPoints: 8,
      feature: 'FTR-CVS-002: Element Manipulation',
      value: 'Quick diagram building',
      requirement: 'HLR-CVS-010, HLR-CVS-011',
      labels: ['design-ide', 'canvas', 'drag-drop', 'elements', 'foundation']
    },
    {
      id: 'US-CVS-005',
      epicId: 'EPIC-IDE-02',
      title: 'Element Resize and Rotate',
      description: 'As a technology architect, I want to resize and rotate elements so that I can customize their appearance for my diagrams.',
      acceptanceCriteria: `GIVEN I have selected an element on the canvas
THEN I should see resize handles at corners and edges
AND I should see a rotation handle above the element

WHEN I drag a corner handle
THEN the element should resize proportionally
AND when I hold Shift while dragging
THEN the aspect ratio should be maintained

WHEN I drag the rotation handle
THEN the element should rotate around its center
AND holding Shift should snap to 15 degree increments`,
      status: 'backlog' as const,
      priority: 'high' as const,
      storyPoints: 5,
      feature: 'FTR-CVS-002: Element Manipulation',
      value: 'Custom element appearance',
      requirement: 'HLR-CVS-012, HLR-CVS-013',
      labels: ['design-ide', 'canvas', 'resize', 'rotate', 'foundation']
    },
    {
      id: 'US-CVS-006',
      epicId: 'EPIC-IDE-02',
      title: 'Connection Creation',
      description: 'As a technology architect, I want to create connections between elements so that I can show relationships and data flows.',
      acceptanceCriteria: `GIVEN I have elements on the canvas
WHEN I hover over an element
THEN connection anchor points should appear at top, right, bottom, left

WHEN I drag from an anchor point
THEN a connection line should follow my cursor
AND when I release over another element's anchor
THEN a connection should be created
AND connections should:
  - Auto-route around other elements
  - Update when elements are moved
  - Support arrow heads (start, end, both, none)
  - Be selectable and deletable`,
      status: 'backlog' as const,
      priority: 'high' as const,
      storyPoints: 10,
      feature: 'FTR-CVS-003: Connection System',
      value: 'Show relationships',
      requirement: 'HLR-CVS-020, HLR-CVS-021, HLR-CVS-022',
      labels: ['design-ide', 'canvas', 'connections', 'foundation']
    },
    {
      id: 'US-CVS-007',
      epicId: 'EPIC-IDE-02',
      title: 'Undo/Redo System',
      description: 'As a technology architect, I want to undo and redo my actions so that I can safely experiment and recover from mistakes.',
      acceptanceCriteria: `GIVEN I have made changes to a model
WHEN I press Cmd+Z
THEN the last action should be undone
AND the action should be added to the redo stack

WHEN I press Cmd+Shift+Z
THEN the last undone action should be redone
AND the system should:
  - Support at least 100 operations in history
  - Group rapid consecutive actions (e.g., typing)
  - Show undo/redo state in Edit menu
  - Clear redo stack when new action is performed`,
      status: 'backlog' as const,
      priority: 'high' as const,
      storyPoints: 8,
      feature: 'FTR-CVS-005: Undo/Redo & History',
      value: 'Safe experimentation',
      requirement: 'HLR-CVS-030, HLR-CVS-031',
      labels: ['design-ide', 'canvas', 'undo', 'redo', 'history', 'foundation']
    },
    {
      id: 'US-CVS-008',
      epicId: 'EPIC-IDE-02',
      title: 'Multi-Selection Operations',
      description: 'As a technology architect, I want to select multiple elements and perform bulk operations so that I can efficiently organize my diagrams.',
      acceptanceCriteria: `GIVEN I am on the modeling canvas
WHEN I drag a selection box (marquee)
THEN all elements within the box should be selected
AND selected elements should have a combined bounding box

WHEN I Shift+click additional elements
THEN they should be added to the selection

WHEN I have multiple elements selected
THEN I should be able to:
  - Move them together
  - Delete them with one keystroke
  - Align them (top, bottom, left, right, center)
  - Distribute them evenly (horizontal, vertical)`,
      status: 'backlog' as const,
      priority: 'high' as const,
      storyPoints: 5,
      feature: 'FTR-CVS-004: Multi-Selection & Actions',
      value: 'Efficient organization',
      requirement: 'HLR-CVS-040, HLR-CVS-041',
      labels: ['design-ide', 'canvas', 'selection', 'bulk', 'foundation']
    },
    {
      id: 'US-CVS-009',
      epicId: 'EPIC-IDE-02',
      title: 'Export to PNG/SVG/PDF',
      description: 'As a technology architect, I want to export my diagrams as images so that I can include them in presentations and documents.',
      acceptanceCriteria: `GIVEN I have a diagram on the canvas
WHEN I select File > Export or press Cmd+E
THEN I should see export options:
  - PNG: Resolution: 1x, 2x, 3x
  - SVG: Include fonts: Yes/No
  - PDF: Page size: A4, Letter, Auto
AND I should be able to:
  - Export entire canvas
  - Export only selected elements
  - Choose background: Transparent, White, Canvas color
AND the exported file should download to my device`,
      status: 'backlog' as const,
      priority: 'medium' as const,
      storyPoints: 5,
      feature: 'FTR-CVS-006: Export & Sharing',
      value: 'Shareable diagrams',
      requirement: 'HLR-CVS-050, HLR-CVS-051',
      labels: ['design-ide', 'canvas', 'export', 'png', 'svg', 'foundation']
    },

    // EPIC-IDE-03: Element Library (3 stories, 16 points)
    {
      id: 'US-PAL-001',
      epicId: 'EPIC-IDE-03',
      title: 'Element Palette Display',
      description: 'As a technology architect, I want a categorized element palette so that I can quickly find and add architecture components to my diagrams.',
      acceptanceCriteria: `GIVEN I am in the Design IDE
WHEN I click the Explorer icon in the Activity Bar
THEN I should see the Element Palette in the Primary Sidebar
AND elements should be organized by category:
  - AWS: 50+ icons
  - Azure: 50+ icons
  - GCP: 50+ icons
  - ArchiMate: 60+ shapes
  - Generic: 20+ shapes
AND each category should be collapsible
AND elements should display as a grid of icons with labels`,
      status: 'backlog' as const,
      priority: 'high' as const,
      storyPoints: 8,
      feature: 'FTR-PAL-001: Element Palette',
      value: '200+ architecture elements',
      requirement: 'HLR-PAL-001, HLR-PAL-002',
      labels: ['design-ide', 'palette', 'elements', 'foundation']
    },
    {
      id: 'US-PAL-002',
      epicId: 'EPIC-IDE-03',
      title: 'Element Search',
      description: 'As a technology architect, I want to search for elements by name or tag so that I can quickly find specific components.',
      acceptanceCriteria: `GIVEN I am viewing the Element Palette
WHEN I type in the search box
THEN results should filter in real-time (debounced 150ms)
AND matching should include:
  - Element name (e.g., 'Lambda' -> AWS Lambda)
  - Tags (e.g., 'compute' -> EC2, Lambda, ECS)
  - Category (e.g., 'aws' -> all AWS elements)
AND search should support fuzzy matching ('lmbd' -> Lambda)
AND results should highlight matching characters
AND pressing Escape should clear the search`,
      status: 'backlog' as const,
      priority: 'high' as const,
      storyPoints: 5,
      feature: 'FTR-PAL-002: Search & Filter',
      value: 'Fast element discovery',
      requirement: 'HLR-PAL-010, HLR-PAL-011',
      labels: ['design-ide', 'palette', 'search', 'filter', 'foundation']
    },
    {
      id: 'US-PAL-003',
      epicId: 'EPIC-IDE-03',
      title: 'Favorites and Recents',
      description: 'As a technology architect, I want quick access to my favorite and recently used elements so that I can work faster.',
      acceptanceCriteria: `GIVEN I am viewing the Element Palette
THEN I should see sections at the top:
  - Favorites: Elements I've starred (max 12)
  - Recent: Last 8 elements I've used

WHEN I right-click an element
THEN I should see 'Add to Favorites' option
AND favorites should persist across sessions
AND recently used elements should update automatically
AND I should be able to clear recent history`,
      status: 'backlog' as const,
      priority: 'medium' as const,
      storyPoints: 3,
      feature: 'FTR-PAL-005: Favorites & Recents',
      value: 'Faster workflow',
      requirement: 'HLR-PAL-020, HLR-PAL-021',
      labels: ['design-ide', 'palette', 'favorites', 'recents', 'intelligence']
    },

    // EPIC-IDE-04: AI Modeling Agents (16 stories, 112 points)
    // Phase 2: Basic AI (6 stories)
    {
      id: 'US-AGT-001',
      epicId: 'EPIC-IDE-04',
      title: 'AI Chat Panel UI',
      description: 'As a technology architect, I want an AI chat panel in the Secondary Sidebar so that I can have conversations with the AI assistant.',
      acceptanceCriteria: `GIVEN I am in the Design IDE
WHEN I click the AI icon in the Activity Bar or press Cmd+Shift+A
THEN the Secondary Sidebar should open
AND display the AI Chat Panel with:
  - Header showing 'AI Assistant' and current model (Claude)
  - Agent Mode dropdown selector
  - Scrollable message history area
  - Message input field at bottom
  - Send button (or Enter to send)
AND messages should display with:
  - User messages aligned right
  - AI responses aligned left with avatar
  - Timestamps on hover`,
      status: 'backlog' as const,
      priority: 'high' as const,
      storyPoints: 5,
      feature: 'FTR-AGT-001: AI Chat Panel',
      value: 'AI conversation interface',
      requirement: 'HLR-AGT-001, HLR-AGT-002',
      labels: ['design-ide', 'ai', 'chat', 'ui', 'intelligence']
    },
    {
      id: 'US-AGT-002',
      epicId: 'EPIC-IDE-04',
      title: 'AI Context Awareness - Canvas State',
      description: 'As a technology architect, I want the AI to understand my current canvas state so that its suggestions are relevant to my work.',
      acceptanceCriteria: `GIVEN I have an architecture diagram on the canvas
WHEN I ask the AI 'What do you see?'
THEN the AI should describe:
  - Elements present (e.g., 'I see an API Gateway connected to 3 Lambda functions')
  - Relationships between elements
  - Overall architecture pattern detected

GIVEN I have elements selected on the canvas
WHEN I ask 'How can I improve this?'
THEN the AI should focus its recommendations on the selected elements
AND reference them by name in its response`,
      status: 'backlog' as const,
      priority: 'high' as const,
      storyPoints: 8,
      feature: 'FTR-AGT-007: Context Awareness',
      value: 'Context-aware AI',
      requirement: 'HLR-AGT-010, HLR-AGT-011',
      labels: ['design-ide', 'ai', 'context', 'canvas', 'intelligence']
    },
    {
      id: 'US-AGT-003',
      epicId: 'EPIC-IDE-04',
      title: 'AI Context Awareness - Selection Focus',
      description: 'As a technology architect, I want the AI to focus on my selected elements when I ask questions so that I get targeted advice.',
      acceptanceCriteria: `GIVEN I have selected an AWS Lambda element
WHEN I ask 'Add error handling'
THEN the AI should:
  - Recognize the selected Lambda
  - Suggest DLQ (Dead Letter Queue) addition
  - Propose CloudWatch alarms
  - Offer to add these elements to the canvas

GIVEN I have selected multiple elements
WHEN I ask 'Secure this section'
THEN the AI should analyze the selected group as a unit
AND provide security recommendations specific to those components`,
      status: 'backlog' as const,
      priority: 'high' as const,
      storyPoints: 5,
      feature: 'FTR-AGT-007: Context Awareness',
      value: 'Targeted AI advice',
      requirement: 'HLR-AGT-012, HLR-AGT-013',
      labels: ['design-ide', 'ai', 'context', 'selection', 'intelligence']
    },
    {
      id: 'US-AGT-004',
      epicId: 'EPIC-IDE-04',
      title: 'Inline AI Prompt (Cmd+K)',
      description: 'As a technology architect, I want to invoke AI directly on the canvas with Cmd+K so that I can get quick assistance without leaving my workflow.',
      acceptanceCriteria: `GIVEN I am working on the canvas
WHEN I press Cmd+K (or Ctrl+K)
THEN an inline prompt should appear at the cursor position
AND the prompt should show:
  - Text input field with placeholder 'Ask AI...'
  - Context indicator (e.g., '3 elements selected')
  - Recent AI commands dropdown

WHEN I type a command and press Enter
THEN the AI should process the request
AND show a loading indicator
AND display results inline or in the chat panel

WHEN I press Escape
THEN the inline prompt should close`,
      status: 'backlog' as const,
      priority: 'high' as const,
      storyPoints: 8,
      feature: 'FTR-AGT-002: Inline AI Suggestions',
      value: 'Quick AI access',
      requirement: 'HLR-AGT-020, HLR-AGT-021',
      labels: ['design-ide', 'ai', 'inline', 'cmd-k', 'intelligence']
    },
    {
      id: 'US-AGT-005',
      epicId: 'EPIC-IDE-04',
      title: 'AI Element Generation',
      description: 'As a technology architect, I want AI to generate elements from natural language so that I can quickly build diagrams by describing what I need.',
      acceptanceCriteria: `GIVEN I have invoked inline AI with Cmd+K
WHEN I type 'Add a load balancer connected to 3 web servers'
AND press Enter
THEN the AI should:
  - Create 1 ALB element
  - Create 3 EC2 web server elements
  - Create connections from ALB to each server
  - Position elements in a logical layout (ALB above, servers below)
AND all generated elements should be selected
AND I should be able to undo the entire operation with Cmd+Z

WHEN I type 'Add Redis cache between Lambda and DynamoDB'
THEN the AI should:
  - Identify existing Lambda and DynamoDB elements
  - Create ElastiCache Redis element
  - Insert it between with appropriate connections`,
      status: 'backlog' as const,
      priority: 'high' as const,
      storyPoints: 10,
      feature: 'FTR-AGT-002: Inline AI Suggestions',
      value: 'Natural language diagram building',
      requirement: 'HLR-AGT-022, HLR-AGT-023',
      labels: ['design-ide', 'ai', 'generation', 'elements', 'intelligence']
    },
    {
      id: 'US-AGT-006',
      epicId: 'EPIC-IDE-04',
      title: 'AI Explain Selection',
      description: 'As a technology architect, I want AI to explain selected architecture components so that I can document and understand my designs.',
      acceptanceCriteria: `GIVEN I have selected elements on the canvas
WHEN I invoke Cmd+K and type 'Explain'
THEN the AI should provide in the chat panel:
  - Overview: What the selected components do together
  - Components: Description of each element
  - Relationships: How they connect and data flows
  - Patterns: Architectural patterns detected
  - Considerations: Potential issues or improvements
AND the explanation should be formatted with headers
AND I should be able to copy the explanation as markdown`,
      status: 'backlog' as const,
      priority: 'medium' as const,
      storyPoints: 5,
      feature: 'FTR-AGT-002: Inline AI Suggestions',
      value: 'AI-powered documentation',
      requirement: 'HLR-AGT-024',
      labels: ['design-ide', 'ai', 'explain', 'documentation', 'intelligence']
    },

    // Agent Mode Selection (3 stories)
    {
      id: 'US-AGT-014',
      epicId: 'EPIC-IDE-04',
      title: 'Agent Mode Dropdown',
      description: 'As a technology architect, I want to select an Agent Mode from a dropdown so that I can control how the AI responds to my requests.',
      acceptanceCriteria: `GIVEN I am in the AI Chat Panel
THEN I should see an Agent Mode dropdown in the header area
AND the dropdown should contain options:
  - Auto (magic wand) - AI selects best mode (default)
  - Question (question mark) - Q&A and explanations
  - Strategize (lightbulb) - Architecture plans and decisions
  - Execute (play) - Make canvas changes with approval
  - Scenarios (grid) - Generate alternative options

WHEN I select a mode
THEN the mode indicator should update
AND the placeholder text should reflect the mode
AND my selection should persist during the session`,
      status: 'backlog' as const,
      priority: 'high' as const,
      storyPoints: 5,
      feature: 'FTR-AGT-003: Agent Mode Selection',
      value: 'Controlled AI behavior',
      requirement: 'HLR-AGT-060, HLR-AGT-061, HLR-AGT-062',
      labels: ['design-ide', 'ai', 'mode-selection', 'dropdown', 'intelligence']
    },
    {
      id: 'US-AGT-015',
      epicId: 'EPIC-IDE-04',
      title: 'Auto Mode Routing',
      description: 'As a technology architect, I want Auto mode to intelligently route my prompts so that I get the right type of response without manually selecting modes.',
      acceptanceCriteria: `GIVEN Agent Mode is set to 'Auto' (default)
WHEN I submit a prompt
THEN the AI should analyze the intent and route to the appropriate mode:
  - 'What is...', 'Explain...' -> Question
  - 'Plan...', 'Design...' -> Strategize
  - 'Add...', 'Build...', 'Connect...' -> Execute
  - 'What are my options...' -> Scenarios
AND the response should show 'Routed to [Mode]' indicator

WHEN in Question mode
THEN responses should be conversational
AND should NOT modify the canvas

WHEN in Strategize mode
THEN responses should include:
  - Structured steps or phases
  - Considerations and tradeoffs
  - Optionally exportable as ADR or markdown`,
      status: 'backlog' as const,
      priority: 'high' as const,
      storyPoints: 8,
      feature: 'FTR-AGT-003: Agent Mode Selection',
      value: 'Intelligent routing',
      requirement: 'HLR-AGT-063, HLR-AGT-064, HLR-AGT-065, HLR-AGT-066',
      labels: ['design-ide', 'ai', 'auto-mode', 'routing', 'intelligence']
    },
    {
      id: 'US-AGT-016',
      epicId: 'EPIC-IDE-04',
      title: 'Scenarios Mode - Pattern Options',
      description: 'As a technology architect, I want Scenarios mode to generate multiple architecture alternatives so that I can compare options before committing to a design.',
      acceptanceCriteria: `GIVEN Agent Mode is set to 'Scenarios'
WHEN I submit 'What are my options for handling user authentication?'
THEN the AI should generate 2-4 alternative scenarios
AND each scenario should be displayed as a card with:
  - Pattern Name (e.g., 'Cognito with Social Login')
  - Visual Preview (Thumbnail)
  - Description (2-3 sentences)
  - Pros (Bullet list)
  - Cons (Bullet list)
  - Complexity (Low/Medium/High)
  - Apply Button
AND scenarios should source from:
  - Built-in pattern library
  - User's previous models
  - Web search for best practices

WHEN I click 'Apply This Option'
THEN the system should switch to Execute mode
AND show the diff view for the selected scenario`,
      status: 'backlog' as const,
      priority: 'high' as const,
      storyPoints: 10,
      feature: 'FTR-AGT-006: Scenarios Mode',
      value: 'Architecture alternatives',
      requirement: 'HLR-AGT-070, HLR-AGT-071, HLR-AGT-072, HLR-AGT-073',
      labels: ['design-ide', 'ai', 'scenarios', 'patterns', 'options', 'expertise']
    },

    // Execute Mode & Diff View (3 stories)
    {
      id: 'US-AGT-007',
      epicId: 'EPIC-IDE-04',
      title: 'Execute Mode Toggle',
      description: 'As a technology architect, I want Execute mode to be available via the dropdown so that I can make canvas changes with approval workflow.',
      acceptanceCriteria: `GIVEN I select 'Execute' from the Agent Mode dropdown
THEN the mode indicator should show Execute is active
AND the placeholder should change to 'Describe what to build...'
AND any prompt I submit should:
  - Analyze the current architecture
  - Generate a plan for changes
  - Show proposed changes in diff view
AND Execute mode preferences should:
  - Remember state across sessions
  - Show a first-time explanation tooltip`,
      status: 'backlog' as const,
      priority: 'medium' as const,
      storyPoints: 3,
      feature: 'FTR-AGT-005: Execute Mode & Diff View',
      value: 'Controlled canvas changes',
      requirement: 'HLR-AGT-067',
      labels: ['design-ide', 'ai', 'execute-mode', 'toggle', 'expertise']
    },
    {
      id: 'US-AGT-008',
      epicId: 'EPIC-IDE-04',
      title: 'Execute Mode Multi-Step Planning',
      description: 'As a technology architect, I want Execute mode to show me its plan before executing so that I understand and approve what it will do.',
      acceptanceCriteria: `GIVEN Execute mode is selected
WHEN I submit 'Refactor this monolith to microservices'
THEN the Agent should:
  - Analyze the current architecture
  - Generate a multi-step plan showing steps
  - Display plan with 'Start' and 'Cancel' buttons

WHEN I click 'Start'
THEN the Agent should begin executing
AND show progress indicator for each step
AND pause at configurable checkpoints for approval`,
      status: 'backlog' as const,
      priority: 'medium' as const,
      storyPoints: 10,
      feature: 'FTR-AGT-005: Execute Mode & Diff View',
      value: 'Multi-step planning',
      requirement: 'HLR-AGT-067',
      labels: ['design-ide', 'ai', 'execute-mode', 'planning', 'expertise']
    },
    {
      id: 'US-AGT-009',
      epicId: 'EPIC-IDE-04',
      title: 'Execute Mode Diff View',
      description: 'As a technology architect, I want to see a diff view of Execute mode changes before applying them so that I can review and approve modifications.',
      acceptanceCriteria: `GIVEN Execute mode has completed its analysis
WHEN it proposes changes
THEN a Diff View overlay should appear showing:
  - New elements: Green highlight + '+' badge
  - Removed elements: Red strikethrough + '-' badge
  - Modified elements: Yellow outline + '~' badge
  - Moved elements: Blue dashed line to new position
AND I should see:
  - Summary: 'Adding 5 elements, removing 2, modifying 3'
  - 'Accept All' button (green)
  - 'Reject All' button (red)
  - Ability to click individual changes to accept/reject`,
      status: 'backlog' as const,
      priority: 'medium' as const,
      storyPoints: 10,
      feature: 'FTR-AGT-005: Execute Mode & Diff View',
      value: 'Visual change approval',
      requirement: 'HLR-AGT-067, HLR-AGT-068',
      labels: ['design-ide', 'ai', 'execute-mode', 'diff', 'expertise']
    },

    // Specialized Agents (4 stories)
    {
      id: 'US-AGT-010',
      epicId: 'EPIC-IDE-04',
      title: 'Specialized Agent - Security Architect',
      description: 'As a technology architect, I want to invoke a Security Architect agent so that I get specialized security analysis and recommendations.',
      acceptanceCriteria: `GIVEN I am in the AI Chat Panel
WHEN I type '@SecurityArch' followed by my question
THEN the Security Architect agent should respond
AND responses should:
  - Display Security Architect avatar/icon
  - Show 'Answered by Security Architect'
  - Focus on security concerns:
    - Threat modeling, attack vectors
    - Compliance (OWASP, PCI-DSS, SOC2, HIPAA)
    - Best practices (Zero trust, defense in depth)
    - AWS Security (IAM, WAF, Security Groups, KMS)

WHEN I ask 'Review authentication flow'
THEN the agent should analyze auth-related elements
AND provide security-specific recommendations

NOTE: Specialists work with any Mode (e.g., 'Scenarios + @SecurityArch')`,
      status: 'backlog' as const,
      priority: 'medium' as const,
      storyPoints: 8,
      feature: 'FTR-AGT-004: Specialized Architect Agents',
      value: 'Security expertise',
      requirement: 'HLR-AGT-040, HLR-AGT-041',
      labels: ['design-ide', 'ai', 'agents', 'security', 'specialized', 'expertise']
    },
    {
      id: 'US-AGT-011',
      epicId: 'EPIC-IDE-04',
      title: 'Specialized Agent - Data Architect',
      description: 'As a technology architect, I want to invoke a Data Architect agent so that I get specialized data modeling and governance advice.',
      acceptanceCriteria: `GIVEN I am in the AI Chat Panel
WHEN I type '@DataArch' followed by my question
THEN the Data Architect agent should respond
AND responses should focus on:
  - Data modeling (Schema design, normalization)
  - Storage selection (SQL vs NoSQL, data lakes)
  - Data governance (Lineage, quality, privacy)
  - Performance (Indexing, partitioning, caching)

WHEN I ask 'Best database for 10M daily transactions?'
THEN the agent should provide data-focused analysis
AND recommend appropriate storage solutions with reasoning`,
      status: 'backlog' as const,
      priority: 'medium' as const,
      storyPoints: 8,
      feature: 'FTR-AGT-004: Specialized Architect Agents',
      value: 'Data expertise',
      requirement: 'HLR-AGT-042, HLR-AGT-043',
      labels: ['design-ide', 'ai', 'agents', 'data', 'specialized', 'expertise']
    },
    {
      id: 'US-AGT-012',
      epicId: 'EPIC-IDE-04',
      title: 'Specialized Agent - Cloud Architect',
      description: 'As a technology architect, I want to invoke a Cloud Architect agent so that I get specialized cloud infrastructure guidance.',
      acceptanceCriteria: `GIVEN I am in the AI Chat Panel
WHEN I type '@CloudArch' followed by my question
THEN the Cloud Architect agent should respond
AND responses should focus on:
  - AWS/Azure/GCP service selection and best practices
  - Cost optimization (Right-sizing, reserved instances)
  - Availability (Multi-AZ, multi-region, failover)
  - Scalability (Auto-scaling, load balancing, CDN)
  - Well-Architected Framework
AND the agent should detect which cloud provider is in use
AND tailor recommendations accordingly`,
      status: 'backlog' as const,
      priority: 'medium' as const,
      storyPoints: 8,
      feature: 'FTR-AGT-004: Specialized Architect Agents',
      value: 'Cloud expertise',
      requirement: 'HLR-AGT-044, HLR-AGT-045',
      labels: ['design-ide', 'ai', 'agents', 'cloud', 'specialized', 'expertise']
    },
    {
      id: 'US-AGT-013',
      epicId: 'EPIC-IDE-04',
      title: 'Agent Auto-Routing',
      description: 'As a technology architect, I want the AI to automatically route my questions to the appropriate specialized agent so that I get expert answers without knowing which agent to invoke.',
      acceptanceCriteria: `GIVEN I ask a question without specifying an agent
WHEN the question is domain-specific
THEN the system should auto-route:
  - 'security, threat, compliance' -> @SecurityArch
  - 'database, schema, data model' -> @DataArch
  - 'AWS, Azure, cloud, scaling' -> @CloudArch
  - 'network, VPC, firewall' -> @InfraArch
  - 'API, integration, messaging' -> @IntegrationArch
AND display 'Answered by [Agent Name]' in the response
AND allow user to redirect: 'Ask @DataArch instead'`,
      status: 'backlog' as const,
      priority: 'low' as const,
      storyPoints: 5,
      feature: 'FTR-AGT-004: Specialized Architect Agents',
      value: 'Automatic expertise routing',
      requirement: 'HLR-AGT-050, HLR-AGT-051',
      labels: ['design-ide', 'ai', 'agents', 'routing', 'auto', 'expertise']
    },

    // EPIC-IDE-05: Validation & Quality (3 stories, 21 points)
    {
      id: 'US-VAL-001',
      epicId: 'EPIC-IDE-05',
      title: 'Real-time Validation Engine',
      description: 'As a technology architect, I want real-time validation of my diagrams so that I catch errors and maintain quality standards.',
      acceptanceCriteria: `GIVEN I am modeling on the canvas
THEN the validation engine should continuously check for:
  - Connections: Invalid relationship types
  - Naming: Missing or duplicate names
  - Properties: Required fields not set
  - Patterns: Anti-patterns detected
  - Completeness: Orphaned elements, dead ends
AND validation should run:
  - On element creation
  - On element modification
  - On connection changes
  - Debounced at 500ms for performance
AND validation issues should appear:
  - As visual indicators on affected elements
  - In the Problems Panel`,
      status: 'backlog' as const,
      priority: 'high' as const,
      storyPoints: 8,
      feature: 'FTR-VAL-001: Real-time Validation',
      value: 'Quality assurance',
      requirement: 'HLR-VAL-001, HLR-VAL-002, HLR-VAL-003',
      labels: ['design-ide', 'validation', 'real-time', 'quality', 'intelligence']
    },
    {
      id: 'US-VAL-002',
      epicId: 'EPIC-IDE-05',
      title: 'Problems Panel Display',
      description: 'As a technology architect, I want to see all validation issues in a Problems Panel so that I can systematically address them.',
      acceptanceCriteria: `GIVEN I have validation issues in my model
WHEN I click 'Problems' in the Panel Area tabs
THEN I should see a list of issues with:
  - Severity: Error (red), Warning (yellow), Info (blue)
  - Message: Description of the issue
  - Element: Name of affected element
  - Location: Click to select element on canvas
AND issues should be sortable by severity
AND I should see counts: '1 Error, 3 Warnings, 2 Info'
AND clicking an issue should select and zoom to the element`,
      status: 'backlog' as const,
      priority: 'high' as const,
      storyPoints: 5,
      feature: 'FTR-VAL-002: Problems Panel',
      value: 'Issue tracking',
      requirement: 'HLR-VAL-010, HLR-VAL-011',
      labels: ['design-ide', 'validation', 'problems-panel', 'quality', 'intelligence']
    },
    {
      id: 'US-VAL-003',
      epicId: 'EPIC-IDE-05',
      title: 'Quick Fix Actions',
      description: 'As a technology architect, I want quick fix suggestions for validation issues so that I can resolve problems efficiently.',
      acceptanceCriteria: `GIVEN I have a validation issue
WHEN I hover over the issue in Problems Panel
THEN I should see a lightbulb icon for available fixes
AND clicking should show quick fix options:
  - Missing name: 'Add default name', 'Edit properties'
  - Invalid connection: 'Change type to X', 'Remove connection'
  - Orphaned element: 'Connect to nearest', 'Delete element'
  - Missing encryption: 'Add KMS encryption', 'Ignore this time'
AND clicking a fix should apply it immediately
AND the fix should be undoable with Cmd+Z
AND AI-suggested fixes should be marked with sparkle icon`,
      status: 'backlog' as const,
      priority: 'medium' as const,
      storyPoints: 8,
      feature: 'FTR-VAL-004: Quick Fixes',
      value: 'Quick issue resolution',
      requirement: 'HLR-VAL-020, HLR-VAL-021',
      labels: ['design-ide', 'validation', 'quick-fix', 'quality', 'intelligence']
    }
  ];

  // Insert stories
  for (const story of stories) {
    try {
      await db.insert(schema.userStories).values({
        id: story.id,
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
        assignee: null,
        productManager: null,
        techLead: null,
        githubCommits: [],
        screenshots: [],
      });
      console.log(`✅ ${story.id} - ${story.title}`);
    } catch (error: any) {
      if (error.message.includes('duplicate key')) {
        console.log(`⚠️  ${story.id} already exists, skipping.`);
      } else {
        console.error(`❌ Error creating ${story.id}:`, error.message);
      }
    }
  }

  console.log('\n✨ Design IDE stories setup complete!\n');
  console.log('📊 Summary:');
  console.log(`  - EPICs: 5`);
  console.log(`  - User Stories: 37`);
  console.log(`  - Total Story Points: 247`);
  console.log(`\n🎯 EPICs Created:`);
  console.log(`  - EPIC-IDE-01: Core IDE Framework (6 stories, 39 points)`);
  console.log(`  - EPIC-IDE-02: Modeling Canvas Engine (9 stories, 59 points)`);
  console.log(`  - EPIC-IDE-03: Element Library (3 stories, 16 points)`);
  console.log(`  - EPIC-IDE-04: AI Modeling Agents (16 stories, 112 points)`);
  console.log(`  - EPIC-IDE-05: Validation & Quality (3 stories, 21 points)`);
  
  await pool.end();
}

createDesignIDEStories().catch(console.error);

