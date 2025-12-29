import 'dotenv/config';
import { db } from '../server/db';
import { testSuites, testCases, testCaseStories } from '../shared/schema';
import { eq } from 'drizzle-orm';

async function seedCanvasTestCases() {
  console.log('🧪 Seeding Canvas Test Cases...\n');

  try {
    // Create Test Suites
    const suites = [
      {
        id: 'TS-CVS-MVP',
        name: 'Canvas MVP - Core Features',
        description: 'Test suite for Canvas MVP basic shape manipulation and interaction features',
        module: 'design',
      },
      {
        id: 'TS-CVS-STUDIO',
        name: 'Design Studio Canvas - Integration',
        description: 'Test suite for Design Studio canvas integration with ArchiMate and backend',
        module: 'design',
      },
    ];

    for (const suite of suites) {
      await db.insert(testSuites).values(suite).onConflictDoNothing();
      console.log(`✓ Test Suite: ${suite.id} - ${suite.name}`);
    }

    console.log('\n📝 Seeding Test Cases...\n');

    // Test Cases
    const testCasesData = [
      // ============================================================
      // TC-CVS-001: Shape Text Labels (US-CVS-012)
      // ============================================================
      {
        id: 'TC-CVS-001',
        suiteId: 'TS-CVS-MVP',
        title: 'Verify shapes display default text labels upon creation',
        preconditions: 'User is on Canvas MVP page (/studio/canvas-mvp)',
        steps: [
          {
            step: 'Navigate to /studio/canvas-mvp',
            expected: 'Canvas page loads with shape palette visible on the left',
          },
          {
            step: 'Click on "Rectangle" shape in the palette',
            expected: 'Rectangle shape is selected/highlighted',
          },
          {
            step: 'Click on the canvas to add the rectangle',
            expected: 'Rectangle appears with default text "Rectangle" centered inside',
          },
          {
            step: 'Add a "Circle" shape from the palette',
            expected: 'Circle appears with default text "Circle" centered inside',
          },
          {
            step: 'Add a "Diamond" shape from the palette',
            expected: 'Diamond appears with default text "Diamond" centered inside',
          },
        ],
        priority: 'high',
        testType: 'functional',
        tags: ['canvas', 'shapes', 'text-labels', 'US-CVS-012'],
        relatedStories: ['US-CVS-012', 'US-CVS-IMPL-012'],
      },

      {
        id: 'TC-CVS-002',
        suiteId: 'TS-CVS-MVP',
        title: 'Verify text labels are readable and properly styled',
        preconditions: 'Canvas has multiple shapes with text labels',
        steps: [
          {
            step: 'Add shapes of different types (rectangle, circle, hexagon)',
            expected: 'All shapes display their respective text labels',
          },
          {
            step: 'Verify text is horizontally centered in each shape',
            expected: 'Text is centered horizontally within shape bounds',
          },
          {
            step: 'Verify text is vertically centered in each shape',
            expected: 'Text is centered vertically within shape bounds',
          },
          {
            step: 'Zoom in to 200%',
            expected: 'Text remains readable and scales proportionally',
          },
          {
            step: 'Zoom out to 50%',
            expected: 'Text remains visible and readable',
          },
        ],
        priority: 'medium',
        testType: 'functional',
        tags: ['canvas', 'text-labels', 'zoom', 'US-CVS-012'],
        relatedStories: ['US-CVS-012', 'US-CVS-IMPL-012'],
      },

      // ============================================================
      // TC-CVS-003-006: Shape Resize and Transform (US-CVS-013)
      // ============================================================
      {
        id: 'TC-CVS-003',
        suiteId: 'TS-CVS-MVP',
        title: 'Verify shape selection displays transform handles',
        preconditions: 'Canvas has at least one shape',
        steps: [
          {
            step: 'Click on a shape to select it',
            expected: 'Shape is selected with blue highlight',
          },
          {
            step: 'Verify transform handles are visible',
            expected: '8 resize handles (corners and edges) and rotation handle are visible',
          },
          {
            step: 'Click on empty canvas area',
            expected: 'Transform handles disappear, shape is deselected',
          },
          {
            step: 'Select the shape again',
            expected: 'Transform handles reappear',
          },
        ],
        priority: 'critical',
        testType: 'functional',
        tags: ['canvas', 'selection', 'transform', 'US-CVS-013'],
        relatedStories: ['US-CVS-013', 'US-CVS-IMPL-013'],
      },

      {
        id: 'TC-CVS-004',
        suiteId: 'TS-CVS-MVP',
        title: 'Verify shape can be resized using corner handles',
        preconditions: 'Canvas has a selected rectangle shape',
        steps: [
          {
            step: 'Select the rectangle shape',
            expected: 'Transform handles appear',
          },
          {
            step: 'Drag the bottom-right corner handle outward',
            expected: 'Shape grows proportionally, text label remains centered',
          },
          {
            step: 'Drag the top-left corner handle inward',
            expected: 'Shape shrinks proportionally, text label adjusts size',
          },
          {
            step: 'Verify minimum size constraint',
            expected: 'Shape cannot be resized smaller than 50x50 pixels',
          },
        ],
        priority: 'critical',
        testType: 'functional',
        tags: ['canvas', 'resize', 'transform', 'US-CVS-013'],
        relatedStories: ['US-CVS-013', 'US-CVS-IMPL-013'],
      },

      {
        id: 'TC-CVS-005',
        suiteId: 'TS-CVS-MVP',
        title: 'Verify shape can be rotated using rotation handle',
        preconditions: 'Canvas has a selected shape',
        steps: [
          {
            step: 'Select a rectangle shape',
            expected: 'Transform handles appear with rotation handle on top',
          },
          {
            step: 'Drag the rotation handle clockwise',
            expected: 'Shape rotates smoothly around its center point',
          },
          {
            step: 'Rotate shape to approximately 45 degrees',
            expected: 'Shape is visibly rotated, text label rotates with shape',
          },
          {
            step: 'Rotate shape to 90 degrees',
            expected: 'Shape is now vertical, text remains readable',
          },
        ],
        priority: 'high',
        testType: 'functional',
        tags: ['canvas', 'rotation', 'transform', 'US-CVS-013'],
        relatedStories: ['US-CVS-013', 'US-CVS-IMPL-013'],
      },

      {
        id: 'TC-CVS-006',
        suiteId: 'TS-CVS-MVP',
        title: 'Verify shape maintains properties after transform',
        preconditions: 'Canvas has shapes that have been resized and rotated',
        steps: [
          {
            step: 'Resize a shape to 200x150 pixels',
            expected: 'Shape is resized, text label adjusts',
          },
          {
            step: 'Rotate the shape to 30 degrees',
            expected: 'Shape rotates smoothly',
          },
          {
            step: 'Deselect and reselect the shape',
            expected: 'Shape maintains its size (200x150) and rotation (30 degrees)',
          },
          {
            step: 'Drag the shape to a new position',
            expected: 'Shape moves while maintaining size and rotation',
          },
        ],
        priority: 'medium',
        testType: 'functional',
        tags: ['canvas', 'transform', 'persistence', 'US-CVS-013'],
        relatedStories: ['US-CVS-013', 'US-CVS-IMPL-013'],
      },

      // ============================================================
      // TC-CVS-007-009: Inline Text Editing (US-CVS-014)
      // ============================================================
      {
        id: 'TC-CVS-007',
        suiteId: 'TS-CVS-MVP',
        title: 'Verify double-click activates text editing mode',
        preconditions: 'Canvas has a shape with default text label',
        steps: [
          {
            step: 'Double-click on the shape',
            expected: 'Text editing mode activates with text input field visible',
          },
          {
            step: 'Verify the current text is selected/editable',
            expected: 'Existing text "Rectangle" is highlighted and ready to edit',
          },
          {
            step: 'Type "User Service"',
            expected: 'Text updates in real-time as you type',
          },
          {
            step: 'Press Enter',
            expected: 'Text editing mode exits, shape displays "User Service"',
          },
        ],
        priority: 'critical',
        testType: 'functional',
        tags: ['canvas', 'text-editing', 'interaction', 'US-CVS-014'],
        relatedStories: ['US-CVS-014', 'US-CVS-IMPL-014'],
      },

      {
        id: 'TC-CVS-008',
        suiteId: 'TS-CVS-MVP',
        title: 'Verify text editing supports multiline text',
        preconditions: 'Canvas has a large rectangle shape',
        steps: [
          {
            step: 'Double-click on the rectangle to edit text',
            expected: 'Text editing mode activates',
          },
          {
            step: 'Type "User" then press Shift+Enter',
            expected: 'Cursor moves to new line (multiline input supported)',
          },
          {
            step: 'Type "Authentication Service"',
            expected: 'Text displays on two lines within the shape',
          },
          {
            step: 'Press Enter to exit editing',
            expected: 'Shape displays multiline text correctly centered',
          },
        ],
        priority: 'medium',
        testType: 'functional',
        tags: ['canvas', 'text-editing', 'multiline', 'US-CVS-014'],
        relatedStories: ['US-CVS-014', 'US-CVS-IMPL-014'],
      },

      {
        id: 'TC-CVS-009',
        suiteId: 'TS-CVS-MVP',
        title: 'Verify text editing can be cancelled with Escape',
        preconditions: 'Canvas has a shape with text "Original Text"',
        steps: [
          {
            step: 'Double-click on the shape to edit',
            expected: 'Text editing mode activates',
          },
          {
            step: 'Type "Modified Text"',
            expected: 'Text updates as you type',
          },
          {
            step: 'Press Escape key',
            expected: 'Text editing mode exits, changes are saved',
          },
          {
            step: 'Verify the shape text',
            expected: 'Shape displays "Modified Text"',
          },
        ],
        priority: 'medium',
        testType: 'functional',
        tags: ['canvas', 'text-editing', 'keyboard', 'US-CVS-014'],
        relatedStories: ['US-CVS-014', 'US-CVS-IMPL-014'],
      },

      // ============================================================
      // TC-CVS-010-011: Connection Visual Feedback (US-CVS-015)
      // ============================================================
      {
        id: 'TC-CVS-010',
        suiteId: 'TS-CVS-MVP',
        title: 'Verify connection creation shows visual feedback',
        preconditions: 'Canvas has two shapes (Shape A and Shape B)',
        steps: [
          {
            step: 'Click the "Create Connection" button in the toolbar',
            expected: 'Connection mode is activated, button is highlighted',
          },
          {
            step: 'Click on Shape A',
            expected: 'Shape A is highlighted as the connection source',
          },
          {
            step: 'Move mouse toward Shape B without clicking',
            expected: 'Dashed preview line follows cursor from Shape A',
          },
          {
            step: 'Verify preview line is visible and dashed',
            expected: 'Blue dashed line (#0ea5e9) connects Shape A center to cursor',
          },
          {
            step: 'Click on Shape B',
            expected: 'Solid connection line is created, preview line disappears',
          },
        ],
        priority: 'high',
        testType: 'functional',
        tags: ['canvas', 'connections', 'visual-feedback', 'US-CVS-015'],
        relatedStories: ['US-CVS-015', 'US-CVS-IMPL-015'],
      },

      {
        id: 'TC-CVS-011',
        suiteId: 'TS-CVS-MVP',
        title: 'Verify connection preview updates dynamically',
        preconditions: 'Canvas has shapes, connection mode is active with source selected',
        steps: [
          {
            step: 'Activate connection mode and select Shape A as source',
            expected: 'Shape A is highlighted',
          },
          {
            step: 'Move mouse in a circular motion around the canvas',
            expected: 'Dashed preview line follows cursor smoothly and dynamically',
          },
          {
            step: 'Move cursor near Shape B',
            expected: 'Preview line snaps to nearest edge of Shape B',
          },
          {
            step: 'Press Escape to cancel connection',
            expected: 'Connection mode exits, preview line disappears',
          },
        ],
        priority: 'medium',
        testType: 'functional',
        tags: ['canvas', 'connections', 'preview', 'US-CVS-015'],
        relatedStories: ['US-CVS-015', 'US-CVS-IMPL-015'],
      },

      // ============================================================
      // TC-CVS-012-016: Keyboard Shortcuts (US-CVS-016)
      // ============================================================
      {
        id: 'TC-CVS-012',
        suiteId: 'TS-CVS-MVP',
        title: 'Verify Undo/Redo keyboard shortcuts (Ctrl+Z / Ctrl+Shift+Z)',
        preconditions: 'Canvas is empty',
        steps: [
          {
            step: 'Add a rectangle shape to the canvas',
            expected: 'Rectangle appears on canvas',
          },
          {
            step: 'Add a circle shape to the canvas',
            expected: 'Circle appears on canvas (2 shapes total)',
          },
          {
            step: 'Press Ctrl+Z (or Cmd+Z on Mac)',
            expected: 'Circle disappears (undo last action)',
          },
          {
            step: 'Press Ctrl+Z again',
            expected: 'Rectangle disappears (canvas is empty)',
          },
          {
            step: 'Press Ctrl+Shift+Z (or Cmd+Shift+Z)',
            expected: 'Rectangle reappears (redo)',
          },
          {
            step: 'Press Ctrl+Shift+Z again',
            expected: 'Circle reappears (canvas back to 2 shapes)',
          },
        ],
        priority: 'critical',
        testType: 'functional',
        tags: ['canvas', 'keyboard', 'undo-redo', 'US-CVS-016'],
        relatedStories: ['US-CVS-016', 'US-CVS-IMPL-016'],
      },

      {
        id: 'TC-CVS-013',
        suiteId: 'TS-CVS-MVP',
        title: 'Verify Copy/Paste keyboard shortcuts (Ctrl+C / Ctrl+V)',
        preconditions: 'Canvas has a rectangle shape at position (100, 100)',
        steps: [
          {
            step: 'Select the rectangle shape',
            expected: 'Rectangle is selected with blue highlight',
          },
          {
            step: 'Press Ctrl+C (or Cmd+C on Mac)',
            expected: 'Shape is copied to clipboard (no visible change)',
          },
          {
            step: 'Press Ctrl+V (or Cmd+V on Mac)',
            expected: 'New rectangle appears at offset position (120, 120)',
          },
          {
            step: 'Verify new shape text label',
            expected: 'New shape has text "Copy of Rectangle"',
          },
          {
            step: 'Press Ctrl+V again',
            expected: 'Another copy appears at further offset (140, 140)',
          },
        ],
        priority: 'critical',
        testType: 'functional',
        tags: ['canvas', 'keyboard', 'copy-paste', 'US-CVS-016'],
        relatedStories: ['US-CVS-016', 'US-CVS-IMPL-016'],
      },

      {
        id: 'TC-CVS-014',
        suiteId: 'TS-CVS-MVP',
        title: 'Verify Delete keyboard shortcut removes selected shapes',
        preconditions: 'Canvas has multiple shapes',
        steps: [
          {
            step: 'Select a shape',
            expected: 'Shape is selected with blue highlight',
          },
          {
            step: 'Press Delete (or Backspace)',
            expected: 'Selected shape is removed from canvas',
          },
          {
            step: 'Add two shapes and select both (Shift+Click)',
            expected: 'Both shapes are selected with blue highlight',
          },
          {
            step: 'Press Delete',
            expected: 'Both selected shapes are removed',
          },
        ],
        priority: 'critical',
        testType: 'functional',
        tags: ['canvas', 'keyboard', 'delete', 'US-CVS-016'],
        relatedStories: ['US-CVS-016', 'US-CVS-IMPL-016'],
      },

      {
        id: 'TC-CVS-015',
        suiteId: 'TS-CVS-MVP',
        title: 'Verify Escape key deselects shapes and cancels modes',
        preconditions: 'Canvas has shapes',
        steps: [
          {
            step: 'Select a shape',
            expected: 'Shape is selected with blue highlight',
          },
          {
            step: 'Press Escape',
            expected: 'Shape is deselected, no shapes selected',
          },
          {
            step: 'Activate connection mode',
            expected: 'Connection mode is active',
          },
          {
            step: 'Press Escape',
            expected: 'Connection mode is cancelled, returns to normal mode',
          },
        ],
        priority: 'high',
        testType: 'functional',
        tags: ['canvas', 'keyboard', 'escape', 'US-CVS-016'],
        relatedStories: ['US-CVS-016', 'US-CVS-IMPL-016'],
      },

      {
        id: 'TC-CVS-016',
        suiteId: 'TS-CVS-MVP',
        title: 'Verify multi-selection with Shift+Click',
        preconditions: 'Canvas has 3+ shapes',
        steps: [
          {
            step: 'Click on Shape A',
            expected: 'Shape A is selected',
          },
          {
            step: 'Hold Shift and click on Shape B',
            expected: 'Both Shape A and B are selected (blue highlight)',
          },
          {
            step: 'Hold Shift and click on Shape C',
            expected: 'All three shapes are selected',
          },
          {
            step: 'Hold Shift and click on Shape B again',
            expected: 'Shape B is deselected, A and C remain selected',
          },
          {
            step: 'Press Ctrl+C then Ctrl+V',
            expected: 'Copies of Shape A and C are created (multi-copy works)',
          },
        ],
        priority: 'high',
        testType: 'functional',
        tags: ['canvas', 'keyboard', 'multi-select', 'US-CVS-016'],
        relatedStories: ['US-CVS-016', 'US-CVS-IMPL-016'],
      },

      // ============================================================
      // TC-CVS-017-019: Design Studio Canvas Integration (US-CVS-017)
      // ============================================================
      {
        id: 'TC-CVS-017',
        suiteId: 'TS-CVS-STUDIO',
        title: 'Verify Design Studio canvas loads with VSCode-style UI',
        preconditions: 'User has access to Design Studio',
        steps: [
          {
            step: 'Navigate to /studio/canvas',
            expected: 'Design Studio loads with VSCode-style layout',
          },
          {
            step: 'Verify activity bar is visible on the left',
            expected: 'Activity bar with icons (Explorer, Palette, AI, etc.) is visible',
          },
          {
            step: 'Verify primary sidebar is visible',
            expected: 'Primary sidebar shows element explorer or palette',
          },
          {
            step: 'Verify canvas area is visible in center',
            expected: 'Main canvas area is visible with grid background',
          },
          {
            step: 'Verify secondary sidebar can be toggled',
            expected: 'AI/Properties sidebar on right can be shown/hidden',
          },
        ],
        priority: 'critical',
        testType: 'functional',
        tags: ['design-studio', 'canvas', 'ui-layout', 'US-CVS-017'],
        relatedStories: ['US-CVS-017', 'US-CVS-IMPL-017'],
      },

      {
        id: 'TC-CVS-018',
        suiteId: 'TS-CVS-STUDIO',
        title: 'Verify canvas features work in Design Studio',
        preconditions: 'User is on /studio/canvas page',
        steps: [
          {
            step: 'Add a shape from the palette',
            expected: 'Shape appears on canvas with default text label',
          },
          {
            step: 'Select the shape and resize it',
            expected: 'Transform handles appear, shape can be resized',
          },
          {
            step: 'Double-click to edit text',
            expected: 'Text editing mode activates',
          },
          {
            step: 'Test keyboard shortcuts (Ctrl+Z, Ctrl+C, Ctrl+V)',
            expected: 'All keyboard shortcuts work as in Canvas MVP',
          },
          {
            step: 'Create a connection between two shapes',
            expected: 'Connection is created with visual preview',
          },
        ],
        priority: 'critical',
        testType: 'integration',
        tags: ['design-studio', 'canvas', 'feature-parity', 'US-CVS-017'],
        relatedStories: ['US-CVS-017', 'US-CVS-IMPL-017'],
      },

      {
        id: 'TC-CVS-019',
        suiteId: 'TS-CVS-STUDIO',
        title: 'Verify canvas state persists across navigation',
        preconditions: 'User is on Design Studio canvas with shapes',
        steps: [
          {
            step: 'Add multiple shapes and connections to canvas',
            expected: 'Canvas has visible content',
          },
          {
            step: 'Note the position and content of shapes',
            expected: 'Canvas layout is recorded mentally/screenshot',
          },
          {
            step: 'Navigate to a different page (e.g., /studio)',
            expected: 'Navigation successful',
          },
          {
            step: 'Navigate back to /studio/canvas',
            expected: 'Canvas loads with all shapes and connections preserved',
          },
        ],
        priority: 'high',
        testType: 'integration',
        tags: ['design-studio', 'canvas', 'persistence', 'US-CVS-017'],
        relatedStories: ['US-CVS-017', 'US-CVS-IMPL-017'],
      },

      // ============================================================
      // TC-CVS-020-022: ArchiMate Element Support (US-CVS-018)
      // ============================================================
      {
        id: 'TC-CVS-020',
        suiteId: 'TS-CVS-STUDIO',
        title: 'Verify ArchiMate elements can be added to canvas',
        preconditions: 'User is on Design Studio canvas, backend has ArchiMate elements',
        steps: [
          {
            step: 'Open the ArchiMate palette in the sidebar',
            expected: 'Palette displays ArchiMate categories (Business, Application, etc.)',
          },
          {
            step: 'Select "Business Actor" element',
            expected: 'Business Actor is highlighted/selected',
          },
          {
            step: 'Click on canvas to place the element',
            expected: 'Business Actor appears as a rounded rectangle with person icon',
          },
          {
            step: 'Add "Application Component" element',
            expected: 'Application Component appears as a rectangle with correct color',
          },
          {
            step: 'Verify ArchiMate-specific styling is applied',
            expected: 'Elements use standard ArchiMate colors and shapes',
          },
        ],
        priority: 'critical',
        testType: 'integration',
        tags: ['design-studio', 'archimate', 'elements', 'US-CVS-018'],
        relatedStories: ['US-CVS-018', 'US-CVS-IMPL-018'],
      },

      {
        id: 'TC-CVS-021',
        suiteId: 'TS-CVS-STUDIO',
        title: 'Verify ArchiMate elements sync with backend',
        preconditions: 'Design Studio canvas is open',
        steps: [
          {
            step: 'Add an ArchiMate "Business Process" element to canvas',
            expected: 'Element appears on canvas',
          },
          {
            step: 'Edit the element name to "Order Processing"',
            expected: 'Text updates on canvas',
          },
          {
            step: 'Verify backend API call is made (check Network tab)',
            expected: 'PUT/PATCH request sent to update object in backend',
          },
          {
            step: 'Refresh the page',
            expected: 'Canvas loads with "Order Processing" element preserved',
          },
        ],
        priority: 'critical',
        testType: 'integration',
        tags: ['design-studio', 'archimate', 'backend', 'persistence', 'US-CVS-018'],
        relatedStories: ['US-CVS-018', 'US-CVS-IMPL-018'],
      },

      {
        id: 'TC-CVS-022',
        suiteId: 'TS-CVS-STUDIO',
        title: 'Verify ArchiMate relationships can be created',
        preconditions: 'Canvas has two ArchiMate elements (e.g., Actor and Process)',
        steps: [
          {
            step: 'Activate connection mode',
            expected: 'Connection mode is active',
          },
          {
            step: 'Select "Business Actor" as source',
            expected: 'Actor is highlighted',
          },
          {
            step: 'Select "Business Process" as target',
            expected: 'Connection is created between Actor and Process',
          },
          {
            step: 'Verify connection is an ArchiMate relationship',
            expected: 'Connection follows ArchiMate notation (e.g., solid line with arrow)',
          },
          {
            step: 'Check backend for relationship record',
            expected: 'Backend has ObjectConnection record linking the two objects',
          },
        ],
        priority: 'high',
        testType: 'integration',
        tags: ['design-studio', 'archimate', 'relationships', 'US-CVS-018'],
        relatedStories: ['US-CVS-018', 'US-CVS-IMPL-018'],
      },

      // ============================================================
      // TC-CVS-023-025: Cross-Browser and Edge Cases
      // ============================================================
      {
        id: 'TC-CVS-023',
        suiteId: 'TS-CVS-MVP',
        title: 'Verify canvas works in different browsers',
        preconditions: 'Access to Chrome, Firefox, Safari',
        steps: [
          {
            step: 'Open Canvas MVP in Chrome',
            expected: 'All canvas features work correctly',
          },
          {
            step: 'Test shape creation, resizing, text editing',
            expected: 'All features work as expected',
          },
          {
            step: 'Repeat tests in Firefox',
            expected: 'All features work consistently with Chrome',
          },
          {
            step: 'Repeat tests in Safari',
            expected: 'All features work consistently',
          },
        ],
        priority: 'medium',
        testType: 'regression',
        tags: ['canvas', 'cross-browser', 'compatibility'],
        relatedStories: ['US-CVS-012', 'US-CVS-013', 'US-CVS-014'],
      },

      {
        id: 'TC-CVS-024',
        suiteId: 'TS-CVS-MVP',
        title: 'Verify canvas performance with many shapes',
        preconditions: 'Canvas MVP is open',
        steps: [
          {
            step: 'Add 50 shapes to the canvas',
            expected: 'All shapes render correctly',
          },
          {
            step: 'Test drag operation on a shape',
            expected: 'Dragging is smooth without lag',
          },
          {
            step: 'Test zoom in/out with 50 shapes',
            expected: 'Zoom is responsive, no performance degradation',
          },
          {
            step: 'Add 50 more shapes (100 total)',
            expected: 'Canvas remains responsive',
          },
          {
            step: 'Create 20 connections between shapes',
            expected: 'Connections render correctly, no lag',
          },
        ],
        priority: 'high',
        testType: 'smoke',
        tags: ['canvas', 'performance', 'stress-test'],
        relatedStories: ['US-CVS-017'],
      },

      {
        id: 'TC-CVS-025',
        suiteId: 'TS-CVS-MVP',
        title: 'Verify canvas handles edge cases gracefully',
        preconditions: 'Canvas MVP is open',
        steps: [
          {
            step: 'Try to resize a shape smaller than minimum (50x50)',
            expected: 'Shape stops at minimum size, does not break',
          },
          {
            step: 'Drag a shape off the visible canvas area',
            expected: 'Shape can be dragged off-canvas and retrieved by panning',
          },
          {
            step: 'Perform undo when history is empty',
            expected: 'No error, undo button is disabled or does nothing gracefully',
          },
          {
            step: 'Perform redo when redo stack is empty',
            expected: 'No error, redo button is disabled or does nothing gracefully',
          },
          {
            step: 'Delete shape while text editing is active',
            expected: 'Text editing exits, shape is deleted safely',
          },
        ],
        priority: 'medium',
        testType: 'functional',
        tags: ['canvas', 'edge-cases', 'error-handling'],
        relatedStories: ['US-CVS-012', 'US-CVS-013', 'US-CVS-014', 'US-CVS-016'],
      },
    ];

    // Insert test cases
    for (const tc of testCasesData) {
      const { relatedStories, ...testCaseData } = tc;
      await db.insert(testCases).values(testCaseData).onConflictDoNothing();
      console.log(`  ✓ ${tc.id}: ${tc.title}`);

      // Link test case to user stories
      if (relatedStories && relatedStories.length > 0) {
        for (const storyId of relatedStories) {
          await db.insert(testCaseStories).values({
            testCaseId: tc.id,
            storyId: storyId,
          }).onConflictDoNothing();
        }
      }
    }

    console.log('\n✅ Canvas test cases seeded successfully!');
    console.log(`\n📊 Summary:`);
    console.log(`   - Test Suites: ${suites.length}`);
    console.log(`   - Test Cases: ${testCasesData.length}`);
    console.log(`   - Coverage: 7 user stories (US-CVS-012 to US-CVS-018)`);

  } catch (error) {
    console.error('❌ Error seeding test cases:', error);
    throw error;
  }
}

seedCanvasTestCases().catch((error) => {
  console.error('Script failed:', error);
  process.exit(1);
});

