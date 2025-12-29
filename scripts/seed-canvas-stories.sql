-- Seed Canvas Enhancement User Stories
-- 7 Product Stories + 7 Implementation Stories = 14 total
-- All linked to EPIC-IDE-02 (Modeling Canvas Engine)

-- Feature 1: Text Labels
INSERT INTO user_stories (
  id, epic_id, title, description, acceptance_criteria, story_points, 
  status, priority, assignee, feature, value, requirement, created_at, updated_at
) VALUES (
  'US-CVS-012',
  'EPIC-IDE-02',
  'Shape Text Labels',
  '**As an** architect creating diagrams
**I want** text labels on all shapes
**So that** I can identify and document each element in my diagram

**Context**:
Every shape needs a label to make diagrams meaningful. This story adds automatic text labeling with sensible defaults and centered alignment.

**User Value**:
- Immediate shape identification
- Professional-looking diagrams
- Clear communication of architecture',
  'Feature: Shape Text Labels
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

  Scenario: Labels are part of the shape
    Given I have a labeled rectangle on the canvas
    When I drag the shape to a new position
    Then the label should move with the shape
    When I resize the shape
    Then the label should remain centered',
  3,
  'done',
  'high',
  NULL,
  'Design Canvas - Text Labels',
  'Self-documenting diagrams with clear element identification',
  'TRS-CANVAS-001',
  NOW(),
  NOW()
);

INSERT INTO user_stories (
  id, epic_id, title, description, acceptance_criteria, story_points, 
  status, priority, assignee, feature, value, requirement, created_at, updated_at
) VALUES (
  'US-CVS-IMPL-012',
  'EPIC-IDE-02',
  'IMPL: Implement Shape Text Labels with Konva Group',
  '**Technical Implementation** for US-CVS-012

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
- client/src/components/canvas/design-canvas-mvp.tsx',
  'Technical Acceptance:
  ✅ Group component wraps shape + text
  ✅ Text is centered and readable
  ✅ Labels move with shapes
  ✅ Labels resize with shapes
  ✅ No console errors or warnings',
  3,
  'done',
  'high',
  'Platform Team',
  'Design Canvas - Text Labels',
  'Technical foundation for labeled shapes',
  'TDS-CANVAS-002',
  NOW(),
  NOW()
);

-- Feature 2: Resize & Transform Handles
INSERT INTO user_stories (
  id, epic_id, title, description, acceptance_criteria, story_points, 
  status, priority, assignee, feature, value, requirement, created_at, updated_at
) VALUES (
  'US-CVS-013',
  'EPIC-IDE-02',
  'Shape Resize and Transform Handles',
  '**As an** architect creating diagrams
**I want** to resize and rotate shapes visually
**So that** I can adjust diagram elements to fit my layout needs

**Context**:
Professional diagramming tools provide visual handles for resizing and rotating. This enables precise layout control without manual property editing.

**User Value**:
- Intuitive shape manipulation
- Precise sizing control
- Professional diagram layouts
- Faster diagram creation',
  'Feature: Shape Resize and Transform
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

  Scenario: Multi-selection transform
    Given I have selected multiple shapes (Shift+Click)
    When transform handles appear
    Then I can resize all shapes together',
  5,
  'done',
  'high',
  NULL,
  'Design Canvas - Transform',
  'Precise visual control over shape dimensions and orientation',
  'TRS-CANVAS-001',
  NOW(),
  NOW()
);

INSERT INTO user_stories (
  id, epic_id, title, description, acceptance_criteria, story_points, 
  status, priority, assignee, feature, value, requirement, created_at, updated_at
) VALUES (
  'US-CVS-IMPL-013',
  'EPIC-IDE-02',
  'IMPL: Konva Transformer for Shape Resize/Rotate',
  '**Technical Implementation** for US-CVS-013

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
- client/src/components/canvas/canvas-shape.tsx',
  'Technical Acceptance:
  ✅ Transformer attaches to selected shapes
  ✅ Resize handles appear on selection
  ✅ Width/height update on transform
  ✅ Minimum size enforced (5px)
  ✅ Multi-selection support
  ✅ Connections update during transform',
  5,
  'done',
  'high',
  'Platform Team',
  'Design Canvas - Transform',
  'Visual manipulation API for shapes',
  'TDS-CANVAS-002',
  NOW(),
  NOW()
);

-- Feature 3: Inline Text Editing
INSERT INTO user_stories (
  id, epic_id, title, description, acceptance_criteria, story_points, 
  status, priority, assignee, feature, value, requirement, created_at, updated_at
) VALUES (
  'US-CVS-014',
  'EPIC-IDE-02',
  'Inline Text Editing for Shapes',
  '**As an** architect creating diagrams
**I want** to edit shape text by double-clicking
**So that** I can quickly label elements without opening property panels

**Context**:
Quick text editing is essential for fast diagram creation. Double-click interaction is the standard pattern in professional tools.

**User Value**:
- Fast text editing workflow
- No context switching to property panels
- Familiar interaction pattern
- Increased productivity',
  'Feature: Inline Text Editing
  As an architect
  I want to double-click shapes to edit text
  So that I can quickly label diagram elements

  Scenario: Double-click opens text editor
    Given I have a rectangle labeled "Rectangle"
    When I double-click the shape
    Then a text input should appear over the shape
    And the input should be pre-filled with "Rectangle"
    And the input should be focused and text selected

  Scenario: Save text on Enter key
    Given I have opened the text editor on a shape
    When I type "User Service"
    And I press Enter
    Then the editor should close
    And the shape label should update to "User Service"

  Scenario: Cancel editing with Escape
    Given I have opened the text editor
    When I type "New Label"
    And I press Escape
    Then the editor should close
    And the original label should be restored',
  3,
  'done',
  'high',
  NULL,
  'Design Canvas - Text Editing',
  'Fast, intuitive text labeling workflow',
  'TRS-CANVAS-001',
  NOW(),
  NOW()
);

INSERT INTO user_stories (
  id, epic_id, title, description, acceptance_criteria, story_points, 
  status, priority, assignee, feature, value, requirement, created_at, updated_at
) VALUES (
  'US-CVS-IMPL-014',
  'EPIC-IDE-02',
  'IMPL: HTML Input Overlay for Text Editing',
  '**Technical Implementation** for US-CVS-014

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
- client/src/components/canvas/canvas-shape.tsx',
  'Technical Acceptance:
  ✅ Double-click triggers edit mode
  ✅ Input appears at correct position
  ✅ Input scales with canvas zoom
  ✅ Enter key saves changes
  ✅ Escape key cancels
  ✅ Blur event saves changes',
  3,
  'done',
  'high',
  'Platform Team',
  'Design Canvas - Text Editing',
  'Inline editing capability',
  'TDS-CANVAS-002',
  NOW(),
  NOW()
);

-- Feature 4: Connection Visual Feedback
INSERT INTO user_stories (
  id, epic_id, title, description, acceptance_criteria, story_points, 
  status, priority, assignee, feature, value, requirement, created_at, updated_at
) VALUES (
  'US-CVS-015',
  'EPIC-IDE-02',
  'Connection Creation Visual Feedback',
  '**As an** architect creating diagrams
**I want** visual feedback while creating connections
**So that** I can see where my connection will go before confirming

**Context**:
When creating connections between shapes, users need real-time visual feedback to understand what they are creating.

**User Value**:
- Clear connection creation process
- Reduced errors in connections
- Better spatial awareness
- Improved user confidence',
  'Feature: Connection Visual Feedback
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
    And a solid connection should appear between shapes',
  2,
  'done',
  'medium',
  NULL,
  'Design Canvas - Connections',
  'Clear visual feedback during connection creation',
  'TRS-CANVAS-001',
  NOW(),
  NOW()
);

INSERT INTO user_stories (
  id, epic_id, title, description, acceptance_criteria, story_points, 
  status, priority, assignee, feature, value, requirement, created_at, updated_at
) VALUES (
  'US-CVS-IMPL-015',
  'EPIC-IDE-02',
  'IMPL: Preview Line During Connection Creation',
  '**Technical Implementation** for US-CVS-015

**Objective**: Add visual preview line while creating connections

**Implementation Details**:
1. Track mouse position during connection mode
2. Render temporary connection from source to cursor
3. Use dashed line style for preview
4. Remove preview on connection complete or cancel

**Technical Approach**:
- mousePosition state tracks cursor in canvas coordinates
- onMouseMove updates position when connectionMode === creating
- Render preview CanvasConnection with id=preview
- Preview uses connectionArrowType setting
- Preview removed when connection completes or mode exits

**Files Modified**:
- client/src/components/canvas/design-canvas-mvp.tsx',
  'Technical Acceptance:
  ✅ Mouse position tracked in connection mode
  ✅ Preview line renders from source to cursor
  ✅ Preview uses dashed line style
  ✅ Preview respects arrow type setting
  ✅ Preview removed on completion
  ✅ Preview removed on cancel',
  2,
  'done',
  'medium',
  'Platform Team',
  'Design Canvas - Connections',
  'Enhanced connection creation UX',
  'TDS-CANVAS-002',
  NOW(),
  NOW()
);

-- Feature 5: Keyboard Shortcuts
INSERT INTO user_stories (
  id, epic_id, title, description, acceptance_criteria, story_points, 
  status, priority, assignee, feature, value, requirement, created_at, updated_at
) VALUES (
  'US-CVS-016',
  'EPIC-IDE-02',
  'Canvas Keyboard Shortcuts (Undo/Redo/Copy/Paste)',
  '**As an** architect working in the canvas
**I want** standard keyboard shortcuts for common actions
**So that** I can work efficiently without reaching for the mouse

**Context**:
Professional tools provide keyboard shortcuts for power users. Standard shortcuts are muscle memory for most users.

**User Value**:
- Faster diagram creation
- Reduced mouse usage
- Familiar workflow patterns
- Professional tool experience',
  'Feature: Canvas Keyboard Shortcuts
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

  Scenario: Copy and paste shapes
    Given I have selected 2 shapes
    When I press Ctrl+C then Ctrl+V
    Then 2 new shapes should appear with 20px offset',
  5,
  'done',
  'high',
  NULL,
  'Design Canvas - Shortcuts',
  'Power user productivity with standard keyboard workflow',
  'TRS-CANVAS-001',
  NOW(),
  NOW()
);

INSERT INTO user_stories (
  id, epic_id, title, description, acceptance_criteria, story_points, 
  status, priority, assignee, feature, value, requirement, created_at, updated_at
) VALUES (
  'US-CVS-IMPL-016',
  'EPIC-IDE-02',
  'IMPL: Keyboard Event Handling for Undo/Redo/Copy/Paste',
  '**Technical Implementation** for US-CVS-016

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
- handleUndo/Redo: navigate history array
- clipboard: stores selected shapes
- handleCopy/Paste: clone shapes with offset
- Check editingShapeId to skip during text edit

**Files Modified**:
- client/src/components/canvas/design-canvas-mvp.tsx',
  'Technical Acceptance:
  ✅ History array stores canvas snapshots
  ✅ Undo navigates backward in history
  ✅ Redo navigates forward in history
  ✅ Copy stores shapes in clipboard state
  ✅ Paste clones shapes with offset
  ✅ Shortcuts disabled during text editing
  ✅ Cross-platform support (Ctrl/Cmd)',
  5,
  'done',
  'high',
  'Platform Team',
  'Design Canvas - Shortcuts',
  'Complete keyboard workflow implementation',
  'TDS-CANVAS-002',
  NOW(),
  NOW()
);

-- Feature 6: Studio Canvas Port
INSERT INTO user_stories (
  id, epic_id, title, description, acceptance_criteria, story_points, 
  status, priority, assignee, feature, value, requirement, created_at, updated_at
) VALUES (
  'US-CVS-017',
  'EPIC-IDE-02',
  'Port Canvas Engine to Design Studio',
  '**As an** enterprise architect
**I want** the improved canvas engine in the Design Studio
**So that** I can use all the new features with my architecture models

**Context**:
The canvas MVP has proven features that should be available in the main Design Studio. This unifies the canvas experience across the platform.

**User Value**:
- Consistent canvas experience
- All features available in studio
- Better ArchiMate element handling
- Professional diagramming in EA context',
  'Feature: Studio Canvas Upgrade
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
    And they should support all transformations',
  8,
  'done',
  'high',
  NULL,
  'Design Studio - Canvas Integration',
  'Enterprise-grade canvas in production environment',
  'TRS-CANVAS-001, TDS-CANVAS-002',
  NOW(),
  NOW()
);

INSERT INTO user_stories (
  id, epic_id, title, description, acceptance_criteria, story_points, 
  status, priority, assignee, feature, value, requirement, created_at, updated_at
) VALUES (
  'US-CVS-IMPL-017',
  'EPIC-IDE-02',
  'IMPL: Replace DesignCanvas with New Engine',
  '**Technical Implementation** for US-CVS-017

**Objective**: Replace old DesignCanvas with new Konva-based engine

**Implementation Details**:
1. Rewrite client/src/components/canvas/DesignCanvas.tsx
2. Adapt to ArchitecturalObject type instead of CanvasShapeData
3. Convert object.visual properties to canvas shape format
4. Maintain existing props interface for compatibility
5. Add all new features (transform, edit, shortcuts, etc.)

**Technical Approach**:
- Kept existing DesignCanvas props interface
- Map ArchitecturalObject to CanvasShapeData internally
- Extract shape type from visual.shape property
- Use visual.position/size/color for rendering
- All new canvas features now available in studio

**Files Modified**:
- client/src/components/canvas/DesignCanvas.tsx (complete rewrite)',
  'Technical Acceptance:
  ✅ DesignCanvas uses new Konva engine
  ✅ ArchitecturalObject rendering works
  ✅ All transform features available
  ✅ Text editing works
  ✅ Keyboard shortcuts work
  ✅ No breaking changes to studio layout
  ✅ Properties panel still receives selections',
  8,
  'done',
  'high',
  'Platform Team',
  'Design Studio - Canvas Integration',
  'Production canvas with all features',
  'TDS-CANVAS-002',
  NOW(),
  NOW()
);

-- Feature 7: ArchiMate Shape Support
INSERT INTO user_stories (
  id, epic_id, title, description, acceptance_criteria, story_points, 
  status, priority, assignee, feature, value, requirement, created_at, updated_at
) VALUES (
  'US-CVS-018',
  'EPIC-IDE-02',
  'ArchiMate Element Shape Support',
  '**As an** enterprise architect
**I want** shapes to render according to ArchiMate notation
**So that** my diagrams follow enterprise architecture standards

**Context**:
ArchiMate defines specific shapes for different element types. The canvas should respect these shape definitions.

**User Value**:
- Standards-compliant diagrams
- Proper ArchiMate notation
- Professional EA documentation
- Framework interoperability',
  'Feature: ArchiMate Shape Types
  As an enterprise architect
  I want elements to use ArchiMate shapes
  So that my diagrams are standards-compliant

  Scenario: ArchiMate shape types are supported
    Given the canvas supports shape types
    Then it should handle: rectangular, rounded, circular, oval,
         hexagonal, pentagonal, triangular, parallelogram

  Scenario: Business Actor renders as rectangle
    Given I have a Business Actor element
    When it renders on the canvas
    Then it should appear as a rectangle
    And it should use the ArchiMate business color

  Scenario: Shapes map from element definitions
    Given an element has shape hexagonal
    When it renders on the canvas
    Then it should appear as a hexagon',
  3,
  'done',
  'high',
  NULL,
  'Design Canvas - ArchiMate',
  'Standards-compliant enterprise architecture diagrams',
  'TRS-CANVAS-001, TDS-CANVAS-002',
  NOW(),
  NOW()
);

INSERT INTO user_stories (
  id, epic_id, title, description, acceptance_criteria, story_points, 
  status, priority, assignee, feature, value, requirement, created_at, updated_at
) VALUES (
  'US-CVS-IMPL-018',
  'EPIC-IDE-02',
  'IMPL: Extend Shape Renderer for ArchiMate Types',
  '**Technical Implementation** for US-CVS-IMPL-018

**Objective**: Add ArchiMate shape type support to canvas renderer

**Implementation Details**:
1. Extend ShapeType union with ArchiMate types
2. Add switch cases for new shape types
3. Map ArchiMate types to Konva components
4. Handle shape rendering with correct geometry

**Technical Approach**:
- Extended ShapeType with ArchiMate values
- Added rendering cases for all ArchiMate types
- Map rectangular, rounded, circular, oval, hexagonal, etc.
- DesignCanvas maps visual.shape to type

**Files Modified**:
- client/src/components/canvas/shape-palette.tsx
- client/src/components/canvas/canvas-shape.tsx
- client/src/components/canvas/DesignCanvas.tsx',
  'Technical Acceptance:
  ✅ ShapeType includes all ArchiMate types
  ✅ All types render correctly
  ✅ Transformations work on all types
  ✅ Text labels work on all types
  ✅ Connections work with all types
  ✅ No console errors for any shape type',
  3,
  'done',
  'high',
  'Platform Team',
  'Design Canvas - ArchiMate',
  'Complete ArchiMate shape rendering',
  'TDS-CANVAS-002',
  NOW(),
  NOW()
);

-- Verify the inserts
SELECT 
  id, 
  title, 
  story_points, 
  status, 
  feature 
FROM user_stories 
WHERE id LIKE 'US-CVS-%' 
ORDER BY id;

