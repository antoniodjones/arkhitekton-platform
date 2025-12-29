import 'dotenv/config';
import { db } from '../server/db';
import { userStories } from '../shared/schema';
import { eq } from 'drizzle-orm';

/**
 * Seed User Stories for Canvas Enhancements
 * Features completed:
 * - Text labels on shapes
 * - Resize handles/transformers
 * - Text editing (double-click)
 * - Connection visual feedback
 * - Keyboard shortcuts (undo/redo/copy/paste)
 * - Studio canvas port
 * - ArchiMate element support
 */

async function seedCanvasEnhancementsStories() {
  console.log('\n🎨 Seeding Canvas Enhancement User Stories...\n');

  const stories = [
    // Product Story: Text Labels
    {
      id: 'US-CVS-012',
      epicId: 'EPIC-IDE-02',
      title: 'Shape Text Labels',
      description: `**As an** architect creating diagrams
**I want** text labels on all shapes
**So that** I can identify and document each element in my diagram

**Context**:
Every shape needs a label to make diagrams meaningful. This story adds automatic text labeling with sensible defaults and centered alignment.

**User Value**:
- Immediate shape identification
- Professional-looking diagrams
- Clear communication of architecture`,
      acceptanceCriteria: `Feature: Shape Text Labels
  As an architect creating diagrams
  I want automatic text labels on shapes
  So that diagrams are self-documenting

  Scenario: New shape has default label
    Given I add a new rectangle to the canvas
    Then it should display "Rectangle" as the default label
    And the text should be centered horizontally
    And the text should be centered vertically
    And the text should be readable (14px, dark color)

  Scenario: Different shape types have appropriate labels
    Given I add a circle to the canvas
    Then it should display "Circle" as the label
    When I add a diamond shape
    Then it should display "Diamond" as the label
    When I add a database shape
    Then it should display "Database" as the label

  Scenario: Labels are part of the shape
    Given I have a labeled rectangle on the canvas
    When I drag the shape to a new position
    Then the label should move with the shape
    When I resize the shape
    Then the label should remain centered
    And the text should not overflow the shape bounds`,
      storyPoints: 3,
      status: 'done' as const,
      priority: 'high' as const,
      assignee: null,
      feature: 'Design Canvas - Text Labels',
      value: 'Self-documenting diagrams with clear element identification',
      requirement: 'TRS-CANVAS-001',
    },

    // Implementation Story: Text Labels
    {
      id: 'US-CVS-IMPL-012',
      epicId: 'EPIC-IDE-02',
      title: 'IMPL: Implement Shape Text Labels with Konva Group',
      description: `**Technical Implementation** for US-CVS-012

**Objective**: Add text labels to all canvas shapes using Konva Group component

**Implementation Details**:
1. Wrap shape + text in Konva Group for unified movement
2. Add Text component with center alignment
3. Default label = formatted shape type name
4. Support custom text via shape.text property

**Technical Approach**:
- Changed from individual shapes to Group container
- Text renders on top of shape with listening={false}
- Group handles dragging/transforming for both elements
- Updated CanvasShapeData interface with text/fontSize/textColor

**Files Modified**:
- client/src/components/canvas/canvas-shape.tsx
- client/src/components/canvas/design-canvas-mvp.tsx`,
      acceptanceCriteria: `Technical Acceptance:
  ✅ Group component wraps shape + text
  ✅ Text is centered and readable
  ✅ Labels move with shapes
  ✅ Labels resize with shapes
  ✅ No console errors or warnings`,
      storyPoints: 3,
      status: 'done' as const,
      priority: 'high' as const,
      assignee: 'Platform Team',
      feature: 'Design Canvas - Text Labels',
      value: 'Technical foundation for labeled shapes',
      requirement: 'TDS-CANVAS-002',
    },

    // Product Story: Resize Handles
    {
      id: 'US-CVS-013',
      epicId: 'EPIC-IDE-02',
      title: 'Shape Resize and Transform Handles',
      description: `**As an** architect creating diagrams
**I want** to resize and rotate shapes visually
**So that** I can adjust diagram elements to fit my layout needs

**Context**:
Professional diagramming tools provide visual handles for resizing and rotating. This enables precise layout control without manual property editing.

**User Value**:
- Intuitive shape manipulation
- Precise sizing control
- Professional diagram layouts
- Faster diagram creation`,
      acceptanceCriteria: `Feature: Shape Resize and Transform
  As an architect
  I want visual handles to resize shapes
  So that I can control shape dimensions precisely

  Scenario: Selected shape shows transform handles
    Given I have a rectangle on the canvas
    When I click to select the rectangle
    Then I should see 8 resize handles (corners and edges)
    And I should see a rotation handle at the top
    And the shape should have a blue selection border

  Scenario: Resize shape by dragging corner handle
    Given I have a selected rectangle (120px × 80px)
    When I drag the bottom-right corner handle outward
    Then the shape should grow proportionally
    And width and height should update in real-time
    When I release the mouse
    Then the new size should be persisted

  Scenario: Maintain minimum size
    Given I have a selected shape
    When I try to resize smaller than 5px × 5px
    Then the resize should stop at minimum dimensions
    And the shape should remain selectable

  Scenario: Multi-selection transform
    Given I have selected multiple shapes (Shift+Click)
    When transform handles appear
    Then I can resize all shapes together
    And their relative positions should be maintained`,
      storyPoints: 5,
      status: 'done' as const,
      priority: 'high' as const,
      assignee: null,
      feature: 'Design Canvas - Transform',
      value: 'Precise visual control over shape dimensions and orientation',
      requirement: 'TRS-CANVAS-001',
    },

    // Implementation Story: Resize Handles
    {
      id: 'US-CVS-IMPL-013',
      epicId: 'EPIC-IDE-02',
      title: 'IMPL: Konva Transformer for Shape Resize/Rotate',
      description: `**Technical Implementation** for US-CVS-013

**Objective**: Integrate Konva Transformer component for visual shape manipulation

**Implementation Details**:
1. Add Transformer component to shapes layer
2. Attach transformer to selected shape(s) via refs
3. Handle onTransformEnd to update shape dimensions
4. Support multi-selection transforms
5. Enforce minimum size constraints

**Technical Approach**:
- Created shapeRefs Map to track shape node references
- transformerRef updates nodes array based on selection
- handleShapeTransformEnd extracts scale and applies to width/height
- Reset scale to 1 after applying to prevent accumulation
- boundBoxFunc enforces minimum 5px dimensions

**Files Modified**:
- client/src/components/canvas/design-canvas-mvp.tsx
- client/src/components/canvas/canvas-shape.tsx`,
      acceptanceCriteria: `Technical Acceptance:
  ✅ Transformer attaches to selected shapes
  ✅ Resize handles appear on selection
  ✅ Width/height update on transform
  ✅ Minimum size enforced (5px)
  ✅ Multi-selection support
  ✅ Connections update during transform`,
      storyPoints: 5,
      status: 'done' as const,
      priority: 'high' as const,
      assignee: 'Platform Team',
      feature: 'Design Canvas - Transform',
      value: 'Visual manipulation API for shapes',
      requirement: 'TDS-CANVAS-002',
    },

    // Product Story: Text Editing
    {
      id: 'US-CVS-014',
      epicId: 'EPIC-IDE-02',
      title: 'Inline Text Editing for Shapes',
      description: `**As an** architect creating diagrams
**I want** to edit shape text by double-clicking
**So that** I can quickly label elements without opening property panels

**Context**:
Quick text editing is essential for fast diagram creation. Double-click interaction is the standard pattern in professional tools.

**User Value**:
- Fast text editing workflow
- No context switching to property panels
- Familiar interaction pattern
- Increased productivity`,
      acceptanceCriteria: `Feature: Inline Text Editing
  As an architect
  I want to double-click shapes to edit text
  So that I can quickly label diagram elements

  Scenario: Double-click opens text editor
    Given I have a rectangle labeled "Rectangle"
    When I double-click the shape
    Then a text input should appear over the shape
    And the input should be pre-filled with "Rectangle"
    And the input should be focused and text selected
    And the input should match the shape's width

  Scenario: Save text on Enter key
    Given I have opened the text editor on a shape
    When I type "User Service"
    And I press Enter
    Then the editor should close
    And the shape label should update to "User Service"
    And the shape should remain selected

  Scenario: Cancel editing with Escape
    Given I have opened the text editor
    When I type "New Label"
    And I press Escape
    Then the editor should close
    And the original label should be restored
    And no changes should be saved

  Scenario: Save text on blur (click away)
    Given I have opened the text editor
    When I type "Database"
    And I click outside the editor
    Then the editor should close
    And the new label "Database" should be saved

  Scenario: Text editor scales with zoom
    Given the canvas is zoomed to 150%
    When I double-click a shape to edit text
    Then the text input should scale proportionally
    And the font size should match the zoom level`,
      storyPoints: 3,
      status: 'done' as const,
      priority: 'high' as const,
      assignee: null,
      feature: 'Design Canvas - Text Editing',
      value: 'Fast, intuitive text labeling workflow',
      requirement: 'TRS-CANVAS-001',
    },

    // Implementation Story: Text Editing
    {
      id: 'US-CVS-IMPL-014',
      epicId: 'EPIC-IDE-02',
      title: 'IMPL: HTML Input Overlay for Text Editing',
      description: `**Technical Implementation** for US-CVS-014

**Objective**: Add double-click text editing with HTML input overlay

**Implementation Details**:
1. Track editing state (editingShapeId, editingText)
2. Handle onDblClick event on shapes
3. Render positioned HTML input on double-click
4. Calculate screen position from canvas coordinates
5. Handle Enter/Escape/Blur events for save/cancel

**Technical Approach**:
- HTML input positioned absolutely over canvas
- Calculate screen position: (shape.x * scale + offset)
- Input width matches shape width at current zoom
- onBlur saves changes, Escape cancels
- editingShapeId prevents other interactions during edit

**Files Modified**:
- client/src/components/canvas/design-canvas-mvp.tsx
- client/src/components/canvas/canvas-shape.tsx (onDblClick prop)`,
      acceptanceCriteria: `Technical Acceptance:
  ✅ Double-click triggers edit mode
  ✅ Input appears at correct position
  ✅ Input scales with canvas zoom
  ✅ Enter key saves changes
  ✅ Escape key cancels
  ✅ Blur event saves changes`,
      storyPoints: 3,
      status: 'done' as const,
      priority: 'high' as const,
      assignee: 'Platform Team',
      feature: 'Design Canvas - Text Editing',
      value: 'Inline editing capability',
      requirement: 'TDS-CANVAS-002',
    },

    // Product Story: Connection Preview
    {
      id: 'US-CVS-015',
      epicId: 'EPIC-IDE-02',
      title: 'Connection Creation Visual Feedback',
      description: `**As an** architect creating diagrams
**I want** visual feedback while creating connections
**So that** I can see where my connection will go before confirming

**Context**:
When creating connections between shapes, users need real-time visual feedback to understand what they're creating.

**User Value**:
- Clear connection creation process
- Reduced errors in connections
- Better spatial awareness
- Improved user confidence`,
      acceptanceCriteria: `Feature: Connection Visual Feedback
  As an architect
  I want to see a preview while creating connections
  So that I know where my connection will go

  Scenario: Preview line appears after selecting source
    Given I click the connection tool
    When I click a source shape
    Then a dashed blue line should follow my cursor
    And the line should extend from the source shape center
    And the line should update as I move the mouse

  Scenario: Preview line disappears on connection complete
    Given I have clicked a source shape for connection
    And a preview line is following my cursor
    When I click a target shape
    Then the preview line should disappear
    And a solid connection should appear between shapes

  Scenario: Preview line disappears on cancel
    Given I have a connection preview line active
    When I press Escape
    Then the preview line should disappear
    And connection mode should exit
    When I click empty canvas space
    Then the preview line should also disappear

  Scenario: Preview respects current connection settings
    Given I have set connection arrow type to "bidirectional"
    When I create a connection preview
    Then the preview should show bidirectional arrows`,
      storyPoints: 2,
      status: 'done' as const,
      priority: 'medium' as const,
      assignee: null,
      feature: 'Design Canvas - Connections',
      value: 'Clear visual feedback during connection creation',
      requirement: 'TRS-CANVAS-001',
    },

    // Implementation Story: Connection Preview
    {
      id: 'US-CVS-IMPL-015',
      epicId: 'EPIC-IDE-02',
      title: 'IMPL: Preview Line During Connection Creation',
      description: `**Technical Implementation** for US-CVS-015

**Objective**: Add visual preview line while creating connections

**Implementation Details**:
1. Track mouse position during connection mode
2. Render temporary connection from source to cursor
3. Use dashed line style for preview
4. Remove preview on connection complete or cancel

**Technical Approach**:
- mousePosition state tracks cursor in canvas coordinates
- onMouseMove updates position when connectionMode === 'creating'
- Render preview CanvasConnection with id='preview'
- Preview uses connectionArrowType setting
- Preview removed when connection completes or mode exits

**Files Modified**:
- client/src/components/canvas/design-canvas-mvp.tsx`,
      acceptanceCriteria: `Technical Acceptance:
  ✅ Mouse position tracked in connection mode
  ✅ Preview line renders from source to cursor
  ✅ Preview uses dashed line style
  ✅ Preview respects arrow type setting
  ✅ Preview removed on completion
  ✅ Preview removed on cancel`,
      storyPoints: 2,
      status: 'done' as const,
      priority: 'medium' as const,
      assignee: 'Platform Team',
      feature: 'Design Canvas - Connections',
      value: 'Enhanced connection creation UX',
      requirement: 'TDS-CANVAS-002',
    },

    // Product Story: Keyboard Shortcuts
    {
      id: 'US-CVS-016',
      epicId: 'EPIC-IDE-02',
      title: 'Canvas Keyboard Shortcuts (Undo/Redo/Copy/Paste)',
      description: `**As an** architect working in the canvas
**I want** standard keyboard shortcuts for common actions
**So that** I can work efficiently without reaching for the mouse

**Context**:
Professional tools provide keyboard shortcuts for power users. Standard shortcuts (Ctrl+Z, Ctrl+C, Ctrl+V) are muscle memory for most users.

**User Value**:
- Faster diagram creation
- Reduced mouse usage
- Familiar workflow patterns
- Professional tool experience`,
      acceptanceCriteria: `Feature: Canvas Keyboard Shortcuts
  As an architect
  I want standard keyboard shortcuts
  So that I can work efficiently

  Scenario: Undo last action (Ctrl+Z)
    Given I have added 3 shapes to the canvas
    When I press Ctrl+Z (or Cmd+Z on Mac)
    Then the last shape should be removed
    When I press Ctrl+Z again
    Then the second-to-last shape should be removed

  Scenario: Redo undone action (Ctrl+Shift+Z)
    Given I have undone an action
    When I press Ctrl+Shift+Z (or Cmd+Shift+Z)
    Then the action should be redone
    And the shape should reappear

  Scenario: Copy selected shapes (Ctrl+C)
    Given I have selected 2 shapes
    When I press Ctrl+C (or Cmd+C)
    Then the shapes should be copied to clipboard
    And I should see a confirmation (console or toast)

  Scenario: Paste shapes (Ctrl+V)
    Given I have copied 2 shapes
    When I press Ctrl+V (or Cmd+V)
    Then 2 new shapes should appear on the canvas
    And they should be offset 20px down and right
    And the new shapes should be selected

  Scenario: Multiple paste operations
    Given I have copied a shape
    When I press Ctrl+V three times
    Then 3 copies should appear
    And each should be offset from the previous

  Scenario: Keyboard shortcuts don't interfere with text editing
    Given I am editing text in a shape
    When I press Ctrl+C
    Then the text should be copied (not the shape)
    And shape-level copy should not trigger`,
      storyPoints: 5,
      status: 'done' as const,
      priority: 'high' as const,
      assignee: null,
      feature: 'Design Canvas - Shortcuts',
      value: 'Power user productivity with standard keyboard workflow',
      requirement: 'TRS-CANVAS-001',
    },

    // Implementation Story: Keyboard Shortcuts
    {
      id: 'US-CVS-IMPL-016',
      epicId: 'EPIC-IDE-02',
      title: 'IMPL: Keyboard Event Handling for Undo/Redo/Copy/Paste',
      description: `**Technical Implementation** for US-CVS-016

**Objective**: Implement keyboard shortcuts with history management

**Implementation Details**:
1. Add history state array to track changes
2. Implement undo/redo with history navigation
3. Add clipboard state for copy/paste
4. Handle keyboard events with proper modifiers
5. Disable shortcuts during text editing

**Technical Approach**:
- history state: array of {shapes, connections} snapshots
- historyIndex: current position in history
- saveToHistory(): add snapshot after changes
- handleUndo/Redo: navigate history array
- clipboard: stores selected shapes
- handleCopy: filter selected shapes to clipboard
- handlePaste: clone shapes with offset
- Check editingShapeId to skip during text edit

**Files Modified**:
- client/src/components/canvas/design-canvas-mvp.tsx`,
      acceptanceCriteria: `Technical Acceptance:
  ✅ History array stores canvas snapshots
  ✅ Undo navigates backward in history
  ✅ Redo navigates forward in history
  ✅ Copy stores shapes in clipboard state
  ✅ Paste clones shapes with offset
  ✅ Shortcuts disabled during text editing
  ✅ Cross-platform support (Ctrl/Cmd)`,
      storyPoints: 5,
      status: 'done' as const,
      priority: 'high' as const,
      assignee: 'Platform Team',
      feature: 'Design Canvas - Shortcuts',
      value: 'Complete keyboard workflow implementation',
      requirement: 'TDS-CANVAS-002',
    },

    // Product Story: Studio Canvas Port
    {
      id: 'US-CVS-017',
      epicId: 'EPIC-IDE-02',
      title: 'Port Canvas Engine to Design Studio',
      description: `**As an** enterprise architect
**I want** the improved canvas engine in the Design Studio
**So that** I can use all the new features with my architecture models

**Context**:
The canvas MVP has proven features that should be available in the main Design Studio. This unifies the canvas experience across the platform.

**User Value**:
- Consistent canvas experience
- All features available in studio
- Better ArchiMate element handling
- Professional diagramming in EA context`,
      acceptanceCriteria: `Feature: Studio Canvas Upgrade
  As an enterprise architect
  I want the new canvas in Design Studio
  So that I can model architectures professionally

  Scenario: Design Studio uses new canvas
    Given I navigate to /studio/canvas
    Then I should see the upgraded canvas
    And all shape features should be available
    And all connection features should be available
    And keyboard shortcuts should work

  Scenario: ArchiMate elements work in new canvas
    Given I have ArchiMate objects in my model
    When they render on the canvas
    Then they should use correct shapes
    And they should support all transformations
    And connections should work between elements

  Scenario: Canvas integrates with studio layout
    Given I am in the Design Studio
    Then the canvas should fit the workspace layout
    And the palette sidebar should remain functional
    And the properties panel should update with selections`,
      storyPoints: 8,
      status: 'done' as const,
      priority: 'high' as const,
      assignee: null,
      feature: 'Design Studio - Canvas Integration',
      value: 'Enterprise-grade canvas in production environment',
      requirement: 'TRS-CANVAS-001, TDS-CANVAS-002',
    },

    // Implementation Story: Studio Canvas Port
    {
      id: 'US-CVS-IMPL-017',
      epicId: 'EPIC-IDE-02',
      title: 'IMPL: Replace DesignCanvas with New Engine',
      description: `**Technical Implementation** for US-CVS-017

**Objective**: Replace old DesignCanvas with new Konva-based engine

**Implementation Details**:
1. Rewrite client/src/components/canvas/DesignCanvas.tsx
2. Adapt to ArchitecturalObject type instead of CanvasShapeData
3. Convert object.visual properties to canvas shape format
4. Maintain existing props interface for compatibility
5. Add all new features (transform, edit, shortcuts, etc.)

**Technical Approach**:
- Kept existing DesignCanvas props interface
- Map ArchitecturalObject → CanvasShapeData internally
- Extract shape type from visual.shape property
- Use visual.position/size/color for rendering
- All new canvas features now available in studio
- Maintains backward compatibility with studio layout

**Files Modified**:
- client/src/components/canvas/DesignCanvas.tsx (complete rewrite)`,
      acceptanceCriteria: `Technical Acceptance:
  ✅ DesignCanvas uses new Konva engine
  ✅ ArchitecturalObject rendering works
  ✅ All transform features available
  ✅ Text editing works
  ✅ Keyboard shortcuts work
  ✅ No breaking changes to studio layout
  ✅ Properties panel still receives selections`,
      storyPoints: 8,
      status: 'done' as const,
      priority: 'high' as const,
      assignee: 'Platform Team',
      feature: 'Design Studio - Canvas Integration',
      value: 'Production canvas with all features',
      requirement: 'TDS-CANVAS-002',
    },

    // Product Story: ArchiMate Shapes
    {
      id: 'US-CVS-018',
      epicId: 'EPIC-IDE-02',
      title: 'ArchiMate Element Shape Support',
      description: `**As an** enterprise architect
**I want** shapes to render according to ArchiMate notation
**So that** my diagrams follow enterprise architecture standards

**Context**:
ArchiMate defines specific shapes for different element types (rectangular, rounded, circular, etc.). The canvas should respect these shape definitions.

**User Value**:
- Standards-compliant diagrams
- Proper ArchiMate notation
- Professional EA documentation
- Framework interoperability`,
      acceptanceCriteria: `Feature: ArchiMate Shape Types
  As an enterprise architect
  I want elements to use ArchiMate shapes
  So that my diagrams are standards-compliant

  Scenario: ArchiMate shape types are supported
    Given the canvas supports shape types
    Then it should handle these types:
      | Type | Visual |
      | rectangular | Rectangle with sharp corners |
      | rounded | Rectangle with rounded corners |
      | circular | Perfect circle |
      | oval | Ellipse shape |
      | hexagonal | Six-sided polygon |
      | pentagonal | Five-sided polygon |
      | triangular | Triangle shape |
      | parallelogram | Skewed rectangle |

  Scenario: Business Actor renders as rectangle
    Given I have a Business Actor element
    When it renders on the canvas
    Then it should appear as a rectangle
    And it should use the ArchiMate business color

  Scenario: Application Component renders as rounded
    Given I have an Application Component element
    When it renders on the canvas
    Then it should appear as a rounded rectangle
    And it should use the ArchiMate application color

  Scenario: Shapes map from element definitions
    Given an element has shape: "hexagonal"
    When it renders on the canvas
    Then it should appear as a hexagon
    And transformations should work correctly`,
      storyPoints: 3,
      status: 'done' as const,
      priority: 'high' as const,
      assignee: null,
      feature: 'Design Canvas - ArchiMate',
      value: 'Standards-compliant enterprise architecture diagrams',
      requirement: 'TRS-CANVAS-001, TDS-CANVAS-002',
    },

    // Implementation Story: ArchiMate Shapes
    {
      id: 'US-CVS-IMPL-018',
      epicId: 'EPIC-IDE-02',
      title: 'IMPL: Extend Shape Renderer for ArchiMate Types',
      description: `**Technical Implementation** for US-CVS-018

**Objective**: Add ArchiMate shape type support to canvas renderer

**Implementation Details**:
1. Extend ShapeType union with ArchiMate types
2. Add switch cases for new shape types
3. Map ArchiMate types to Konva components
4. Handle shape rendering with correct geometry

**Technical Approach**:
- Extended ShapeType with ArchiMate values
- Added cases in renderShapeElement():
  - rectangular → Rect (no radius)
  - rounded → Rect (cornerRadius: 10)
  - circular → Circle
  - oval → Ellipse
  - hexagonal → RegularPolygon (6 sides)
  - pentagonal → RegularPolygon (5 sides)
  - triangular/arrow → RegularPolygon (3 sides)
  - parallelogram → Rect (skewX: 15)
- DesignCanvas maps visual.shape to type

**Files Modified**:
- client/src/components/canvas/shape-palette.tsx (ShapeType)
- client/src/components/canvas/canvas-shape.tsx (renderShapeElement)
- client/src/components/canvas/DesignCanvas.tsx (shape mapping)`,
      acceptanceCriteria: `Technical Acceptance:
  ✅ ShapeType includes all ArchiMate types
  ✅ All types render correctly
  ✅ Transformations work on all types
  ✅ Text labels work on all types
  ✅ Connections work with all types
  ✅ No console errors for any shape type`,
      storyPoints: 3,
      status: 'done' as const,
      priority: 'high' as const,
      assignee: 'Platform Team',
      feature: 'Design Canvas - ArchiMate',
      value: 'Complete ArchiMate shape rendering',
      requirement: 'TDS-CANVAS-002',
    },
  ];

  console.log(`📊 Preparing to create ${stories.length} stories (${stories.length / 2} features)...\n`);

  let createdCount = 0;
  let skippedCount = 0;

  for (const story of stories) {
    try {
      const existing = await db.select()
        .from(userStories)
        .where(eq(userStories.id, story.id))
        .limit(1);

      if (existing.length === 0) {
        await db.insert(userStories).values(story);
        console.log(`✅ Created ${story.id}: ${story.title}`);
        console.log(`   → Points: ${story.storyPoints} | Status: ${story.status}`);
        createdCount++;
      } else {
        console.log(`⚠️  ${story.id} already exists, skipping`);
        skippedCount++;
      }
    } catch (error) {
      console.error(`❌ Error creating ${story.id}:`, error);
    }
  }

  // Calculate totals
  const productStories = stories.filter(s => !s.id.includes('IMPL'));
  const implStories = stories.filter(s => s.id.includes('IMPL'));
  const totalPoints = stories.reduce((sum, s) => sum + s.storyPoints, 0);

  console.log(`\n📊 Summary:`);
  console.log(`   Stories Created: ${createdCount}`);
  console.log(`   Stories Skipped: ${skippedCount}`);
  console.log(`   Product Stories: ${productStories.length} (${productStories.reduce((sum, s) => sum + s.storyPoints, 0)} points)`);
  console.log(`   Implementation Stories: ${implStories.length} (${implStories.reduce((sum, s) => sum + s.storyPoints, 0)} points)`);
  console.log(`   Total Points: ${totalPoints}`);
  console.log(`   Epic: EPIC-IDE-02 (Modeling Canvas Engine)`);

  console.log(`\n🎯 Canvas Enhancement Features Completed:`);
  console.log(`   US-CVS-012: Shape Text Labels (3 pts) ✅`);
  console.log(`   US-CVS-013: Resize & Transform Handles (5 pts) ✅`);
  console.log(`   US-CVS-014: Inline Text Editing (3 pts) ✅`);
  console.log(`   US-CVS-015: Connection Visual Feedback (2 pts) ✅`);
  console.log(`   US-CVS-016: Keyboard Shortcuts (5 pts) ✅`);
  console.log(`   US-CVS-017: Studio Canvas Port (8 pts) ✅`);
  console.log(`   US-CVS-018: ArchiMate Shape Support (3 pts) ✅`);
  console.log(`   ----------------------------------------`);
  console.log(`   TOTAL: 29 points (7 features)`);

  console.log(`\n📝 Traceability:`);
  console.log(`   ✅ Each feature has Product + Implementation story`);
  console.log(`   ✅ All stories linked to EPIC-IDE-02`);
  console.log(`   ✅ Acceptance criteria defined`);
  console.log(`   ✅ Technical implementation documented`);
  console.log(`   ✅ All stories marked as "done"`);

  console.log(`\n🚀 Next Steps:`);
  console.log(`   1. Link git commits to implementation stories`);
  console.log(`   2. Update canvas documentation`);
  console.log(`   3. Create demo video/screenshots`);
}

seedCanvasEnhancementsStories()
  .then(() => {
    console.log('\n✅ Canvas enhancement stories seeded successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error seeding stories:', error);
    process.exit(1);
  });

