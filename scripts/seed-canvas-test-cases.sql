-- ============================================================
-- CANVAS QA TEST CASES
-- Comprehensive test cases for Canvas MVP and Design Studio features
-- ============================================================

-- Test Suites
INSERT INTO test_suites (id, name, description, module, created_at, updated_at)
VALUES
('TS-CVS-MVP', 'Canvas MVP - Core Features', 'Test suite for Canvas MVP basic shape manipulation and interaction features', 'design', NOW(), NOW()),
('TS-CVS-STUDIO', 'Design Studio Canvas - Integration', 'Test suite for Design Studio canvas integration with ArchiMate and backend', 'design', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- TC-CVS-001-002: Shape Text Labels (US-CVS-012)
-- ============================================================

INSERT INTO test_cases (id, suite_id, title, preconditions, steps, priority, test_type, tags, created_at, updated_at)
VALUES
('TC-CVS-001', 'TS-CVS-MVP', 'Verify shapes display default text labels upon creation', 
'User is on Canvas MVP page (/studio/canvas-mvp)',
'[
  {"step": "Navigate to /studio/canvas-mvp", "expected": "Canvas page loads with shape palette visible on the left"},
  {"step": "Click on \"Rectangle\" shape in the palette", "expected": "Rectangle shape is selected/highlighted"},
  {"step": "Click on the canvas to add the rectangle", "expected": "Rectangle appears with default text \"Rectangle\" centered inside"},
  {"step": "Add a \"Circle\" shape from the palette", "expected": "Circle appears with default text \"Circle\" centered inside"},
  {"step": "Add a \"Diamond\" shape from the palette", "expected": "Diamond appears with default text \"Diamond\" centered inside"}
]'::jsonb,
'high', 'functional', '["canvas", "shapes", "text-labels", "US-CVS-012"]'::jsonb, NOW(), NOW()),

('TC-CVS-002', 'TS-CVS-MVP', 'Verify text labels are readable and properly styled',
'Canvas has multiple shapes with text labels',
'[
  {"step": "Add shapes of different types (rectangle, circle, hexagon)", "expected": "All shapes display their respective text labels"},
  {"step": "Verify text is horizontally centered in each shape", "expected": "Text is centered horizontally within shape bounds"},
  {"step": "Verify text is vertically centered in each shape", "expected": "Text is centered vertically within shape bounds"},
  {"step": "Zoom in to 200%", "expected": "Text remains readable and scales proportionally"},
  {"step": "Zoom out to 50%", "expected": "Text remains visible and readable"}
]'::jsonb,
'medium', 'functional', '["canvas", "text-labels", "zoom", "US-CVS-012"]'::jsonb, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Link to user stories
INSERT INTO test_case_stories (test_case_id, story_id)
VALUES
('TC-CVS-001', 'US-CVS-012'),
('TC-CVS-001', 'US-CVS-IMPL-012'),
('TC-CVS-002', 'US-CVS-012'),
('TC-CVS-002', 'US-CVS-IMPL-012')
ON CONFLICT DO NOTHING;

-- ============================================================
-- TC-CVS-003-006: Shape Resize and Transform (US-CVS-013)
-- ============================================================

INSERT INTO test_cases (id, suite_id, title, preconditions, steps, priority, test_type, tags, created_at, updated_at)
VALUES
('TC-CVS-003', 'TS-CVS-MVP', 'Verify shape selection displays transform handles',
'Canvas has at least one shape',
'[
  {"step": "Click on a shape to select it", "expected": "Shape is selected with blue highlight"},
  {"step": "Verify transform handles are visible", "expected": "8 resize handles (corners and edges) and rotation handle are visible"},
  {"step": "Click on empty canvas area", "expected": "Transform handles disappear, shape is deselected"},
  {"step": "Select the shape again", "expected": "Transform handles reappear"}
]'::jsonb,
'critical', 'functional', '["canvas", "selection", "transform", "US-CVS-013"]'::jsonb, NOW(), NOW()),

('TC-CVS-004', 'TS-CVS-MVP', 'Verify shape can be resized using corner handles',
'Canvas has a selected rectangle shape',
'[
  {"step": "Select the rectangle shape", "expected": "Transform handles appear"},
  {"step": "Drag the bottom-right corner handle outward", "expected": "Shape grows proportionally, text label remains centered"},
  {"step": "Drag the top-left corner handle inward", "expected": "Shape shrinks proportionally, text label adjusts size"},
  {"step": "Verify minimum size constraint", "expected": "Shape cannot be resized smaller than 50x50 pixels"}
]'::jsonb,
'critical', 'functional', '["canvas", "resize", "transform", "US-CVS-013"]'::jsonb, NOW(), NOW()),

('TC-CVS-005', 'TS-CVS-MVP', 'Verify shape can be rotated using rotation handle',
'Canvas has a selected shape',
'[
  {"step": "Select a rectangle shape", "expected": "Transform handles appear with rotation handle on top"},
  {"step": "Drag the rotation handle clockwise", "expected": "Shape rotates smoothly around its center point"},
  {"step": "Rotate shape to approximately 45 degrees", "expected": "Shape is visibly rotated, text label rotates with shape"},
  {"step": "Rotate shape to 90 degrees", "expected": "Shape is now vertical, text remains readable"}
]'::jsonb,
'high', 'functional', '["canvas", "rotation", "transform", "US-CVS-013"]'::jsonb, NOW(), NOW()),

('TC-CVS-006', 'TS-CVS-MVP', 'Verify shape maintains properties after transform',
'Canvas has shapes that have been resized and rotated',
'[
  {"step": "Resize a shape to 200x150 pixels", "expected": "Shape is resized, text label adjusts"},
  {"step": "Rotate the shape to 30 degrees", "expected": "Shape rotates smoothly"},
  {"step": "Deselect and reselect the shape", "expected": "Shape maintains its size (200x150) and rotation (30 degrees)"},
  {"step": "Drag the shape to a new position", "expected": "Shape moves while maintaining size and rotation"}
]'::jsonb,
'medium', 'functional', '["canvas", "transform", "persistence", "US-CVS-013"]'::jsonb, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO test_case_stories (test_case_id, story_id)
VALUES
('TC-CVS-003', 'US-CVS-013'),
('TC-CVS-003', 'US-CVS-IMPL-013'),
('TC-CVS-004', 'US-CVS-013'),
('TC-CVS-004', 'US-CVS-IMPL-013'),
('TC-CVS-005', 'US-CVS-013'),
('TC-CVS-005', 'US-CVS-IMPL-013'),
('TC-CVS-006', 'US-CVS-013'),
('TC-CVS-006', 'US-CVS-IMPL-013')
ON CONFLICT DO NOTHING;

-- ============================================================
-- TC-CVS-007-009: Inline Text Editing (US-CVS-014)
-- ============================================================

INSERT INTO test_cases (id, suite_id, title, preconditions, steps, priority, test_type, tags, created_at, updated_at)
VALUES
('TC-CVS-007', 'TS-CVS-MVP', 'Verify double-click activates text editing mode',
'Canvas has a shape with default text label',
'[
  {"step": "Double-click on the shape", "expected": "Text editing mode activates with text input field visible"},
  {"step": "Verify the current text is selected/editable", "expected": "Existing text \"Rectangle\" is highlighted and ready to edit"},
  {"step": "Type \"User Service\"", "expected": "Text updates in real-time as you type"},
  {"step": "Press Enter", "expected": "Text editing mode exits, shape displays \"User Service\""}
]'::jsonb,
'critical', 'functional', '["canvas", "text-editing", "interaction", "US-CVS-014"]'::jsonb, NOW(), NOW()),

('TC-CVS-008', 'TS-CVS-MVP', 'Verify text editing supports multiline text',
'Canvas has a large rectangle shape',
'[
  {"step": "Double-click on the rectangle to edit text", "expected": "Text editing mode activates"},
  {"step": "Type \"User\" then press Shift+Enter", "expected": "Cursor moves to new line (multiline input supported)"},
  {"step": "Type \"Authentication Service\"", "expected": "Text displays on two lines within the shape"},
  {"step": "Press Enter to exit editing", "expected": "Shape displays multiline text correctly centered"}
]'::jsonb,
'medium', 'functional', '["canvas", "text-editing", "multiline", "US-CVS-014"]'::jsonb, NOW(), NOW()),

('TC-CVS-009', 'TS-CVS-MVP', 'Verify text editing can be cancelled with Escape',
'Canvas has a shape with text "Original Text"',
'[
  {"step": "Double-click on the shape to edit", "expected": "Text editing mode activates"},
  {"step": "Type \"Modified Text\"", "expected": "Text updates as you type"},
  {"step": "Press Escape key", "expected": "Text editing mode exits, changes are saved"},
  {"step": "Verify the shape text", "expected": "Shape displays \"Modified Text\""}
]'::jsonb,
'medium', 'functional', '["canvas", "text-editing", "keyboard", "US-CVS-014"]'::jsonb, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO test_case_stories (test_case_id, story_id)
VALUES
('TC-CVS-007', 'US-CVS-014'),
('TC-CVS-007', 'US-CVS-IMPL-014'),
('TC-CVS-008', 'US-CVS-014'),
('TC-CVS-008', 'US-CVS-IMPL-014'),
('TC-CVS-009', 'US-CVS-014'),
('TC-CVS-009', 'US-CVS-IMPL-014')
ON CONFLICT DO NOTHING;

-- ============================================================
-- TC-CVS-010-011: Connection Visual Feedback (US-CVS-015)
-- ============================================================

INSERT INTO test_cases (id, suite_id, title, preconditions, steps, priority, test_type, tags, created_at, updated_at)
VALUES
('TC-CVS-010', 'TS-CVS-MVP', 'Verify connection creation shows visual feedback',
'Canvas has two shapes (Shape A and Shape B)',
'[
  {"step": "Click the \"Create Connection\" button in the toolbar", "expected": "Connection mode is activated, button is highlighted"},
  {"step": "Click on Shape A", "expected": "Shape A is highlighted as the connection source"},
  {"step": "Move mouse toward Shape B without clicking", "expected": "Dashed preview line follows cursor from Shape A"},
  {"step": "Verify preview line is visible and dashed", "expected": "Blue dashed line (#0ea5e9) connects Shape A center to cursor"},
  {"step": "Click on Shape B", "expected": "Solid connection line is created, preview line disappears"}
]'::jsonb,
'high', 'functional', '["canvas", "connections", "visual-feedback", "US-CVS-015"]'::jsonb, NOW(), NOW()),

('TC-CVS-011', 'TS-CVS-MVP', 'Verify connection preview updates dynamically',
'Canvas has shapes, connection mode is active with source selected',
'[
  {"step": "Activate connection mode and select Shape A as source", "expected": "Shape A is highlighted"},
  {"step": "Move mouse in a circular motion around the canvas", "expected": "Dashed preview line follows cursor smoothly and dynamically"},
  {"step": "Move cursor near Shape B", "expected": "Preview line snaps to nearest edge of Shape B"},
  {"step": "Press Escape to cancel connection", "expected": "Connection mode exits, preview line disappears"}
]'::jsonb,
'medium', 'functional', '["canvas", "connections", "preview", "US-CVS-015"]'::jsonb, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO test_case_stories (test_case_id, story_id)
VALUES
('TC-CVS-010', 'US-CVS-015'),
('TC-CVS-010', 'US-CVS-IMPL-015'),
('TC-CVS-011', 'US-CVS-015'),
('TC-CVS-011', 'US-CVS-IMPL-015')
ON CONFLICT DO NOTHING;

-- ============================================================
-- TC-CVS-012-016: Keyboard Shortcuts (US-CVS-016)
-- ============================================================

INSERT INTO test_cases (id, suite_id, title, preconditions, steps, priority, test_type, tags, created_at, updated_at)
VALUES
('TC-CVS-012', 'TS-CVS-MVP', 'Verify Undo/Redo keyboard shortcuts (Ctrl+Z / Ctrl+Shift+Z)',
'Canvas is empty',
'[
  {"step": "Add a rectangle shape to the canvas", "expected": "Rectangle appears on canvas"},
  {"step": "Add a circle shape to the canvas", "expected": "Circle appears on canvas (2 shapes total)"},
  {"step": "Press Ctrl+Z (or Cmd+Z on Mac)", "expected": "Circle disappears (undo last action)"},
  {"step": "Press Ctrl+Z again", "expected": "Rectangle disappears (canvas is empty)"},
  {"step": "Press Ctrl+Shift+Z (or Cmd+Shift+Z)", "expected": "Rectangle reappears (redo)"},
  {"step": "Press Ctrl+Shift+Z again", "expected": "Circle reappears (canvas back to 2 shapes)"}
]'::jsonb,
'critical', 'functional', '["canvas", "keyboard", "undo-redo", "US-CVS-016"]'::jsonb, NOW(), NOW()),

('TC-CVS-013', 'TS-CVS-MVP', 'Verify Copy/Paste keyboard shortcuts (Ctrl+C / Ctrl+V)',
'Canvas has a rectangle shape at position (100, 100)',
'[
  {"step": "Select the rectangle shape", "expected": "Rectangle is selected with blue highlight"},
  {"step": "Press Ctrl+C (or Cmd+C on Mac)", "expected": "Shape is copied to clipboard (no visible change)"},
  {"step": "Press Ctrl+V (or Cmd+V on Mac)", "expected": "New rectangle appears at offset position (120, 120)"},
  {"step": "Verify new shape text label", "expected": "New shape has text \"Copy of Rectangle\""},
  {"step": "Press Ctrl+V again", "expected": "Another copy appears at further offset (140, 140)"}
]'::jsonb,
'critical', 'functional', '["canvas", "keyboard", "copy-paste", "US-CVS-016"]'::jsonb, NOW(), NOW()),

('TC-CVS-014', 'TS-CVS-MVP', 'Verify Delete keyboard shortcut removes selected shapes',
'Canvas has multiple shapes',
'[
  {"step": "Select a shape", "expected": "Shape is selected with blue highlight"},
  {"step": "Press Delete (or Backspace)", "expected": "Selected shape is removed from canvas"},
  {"step": "Add two shapes and select both (Shift+Click)", "expected": "Both shapes are selected with blue highlight"},
  {"step": "Press Delete", "expected": "Both selected shapes are removed"}
]'::jsonb,
'critical', 'functional', '["canvas", "keyboard", "delete", "US-CVS-016"]'::jsonb, NOW(), NOW()),

('TC-CVS-015', 'TS-CVS-MVP', 'Verify Escape key deselects shapes and cancels modes',
'Canvas has shapes',
'[
  {"step": "Select a shape", "expected": "Shape is selected with blue highlight"},
  {"step": "Press Escape", "expected": "Shape is deselected, no shapes selected"},
  {"step": "Activate connection mode", "expected": "Connection mode is active"},
  {"step": "Press Escape", "expected": "Connection mode is cancelled, returns to normal mode"}
]'::jsonb,
'high', 'functional', '["canvas", "keyboard", "escape", "US-CVS-016"]'::jsonb, NOW(), NOW()),

('TC-CVS-016', 'TS-CVS-MVP', 'Verify multi-selection with Shift+Click',
'Canvas has 3+ shapes',
'[
  {"step": "Click on Shape A", "expected": "Shape A is selected"},
  {"step": "Hold Shift and click on Shape B", "expected": "Both Shape A and B are selected (blue highlight)"},
  {"step": "Hold Shift and click on Shape C", "expected": "All three shapes are selected"},
  {"step": "Hold Shift and click on Shape B again", "expected": "Shape B is deselected, A and C remain selected"},
  {"step": "Press Ctrl+C then Ctrl+V", "expected": "Copies of Shape A and C are created (multi-copy works)"}
]'::jsonb,
'high', 'functional', '["canvas", "keyboard", "multi-select", "US-CVS-016"]'::jsonb, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO test_case_stories (test_case_id, story_id)
VALUES
('TC-CVS-012', 'US-CVS-016'),
('TC-CVS-012', 'US-CVS-IMPL-016'),
('TC-CVS-013', 'US-CVS-016'),
('TC-CVS-013', 'US-CVS-IMPL-016'),
('TC-CVS-014', 'US-CVS-016'),
('TC-CVS-014', 'US-CVS-IMPL-016'),
('TC-CVS-015', 'US-CVS-016'),
('TC-CVS-015', 'US-CVS-IMPL-016'),
('TC-CVS-016', 'US-CVS-016'),
('TC-CVS-016', 'US-CVS-IMPL-016')
ON CONFLICT DO NOTHING;

-- ============================================================
-- TC-CVS-017-019: Design Studio Canvas Integration (US-CVS-017)
-- ============================================================

INSERT INTO test_cases (id, suite_id, title, preconditions, steps, priority, test_type, tags, created_at, updated_at)
VALUES
('TC-CVS-017', 'TS-CVS-STUDIO', 'Verify Design Studio canvas loads with VSCode-style UI',
'User has access to Design Studio',
'[
  {"step": "Navigate to /studio/canvas", "expected": "Design Studio loads with VSCode-style layout"},
  {"step": "Verify activity bar is visible on the left", "expected": "Activity bar with icons (Explorer, Palette, AI, etc.) is visible"},
  {"step": "Verify primary sidebar is visible", "expected": "Primary sidebar shows element explorer or palette"},
  {"step": "Verify canvas area is visible in center", "expected": "Main canvas area is visible with grid background"},
  {"step": "Verify secondary sidebar can be toggled", "expected": "AI/Properties sidebar on right can be shown/hidden"}
]'::jsonb,
'critical', 'functional', '["design-studio", "canvas", "ui-layout", "US-CVS-017"]'::jsonb, NOW(), NOW()),

('TC-CVS-018', 'TS-CVS-STUDIO', 'Verify canvas features work in Design Studio',
'User is on /studio/canvas page',
'[
  {"step": "Add a shape from the palette", "expected": "Shape appears on canvas with default text label"},
  {"step": "Select the shape and resize it", "expected": "Transform handles appear, shape can be resized"},
  {"step": "Double-click to edit text", "expected": "Text editing mode activates"},
  {"step": "Test keyboard shortcuts (Ctrl+Z, Ctrl+C, Ctrl+V)", "expected": "All keyboard shortcuts work as in Canvas MVP"},
  {"step": "Create a connection between two shapes", "expected": "Connection is created with visual preview"}
]'::jsonb,
'critical', 'integration', '["design-studio", "canvas", "feature-parity", "US-CVS-017"]'::jsonb, NOW(), NOW()),

('TC-CVS-019', 'TS-CVS-STUDIO', 'Verify canvas state persists across navigation',
'User is on Design Studio canvas with shapes',
'[
  {"step": "Add multiple shapes and connections to canvas", "expected": "Canvas has visible content"},
  {"step": "Note the position and content of shapes", "expected": "Canvas layout is recorded mentally/screenshot"},
  {"step": "Navigate to a different page (e.g., /studio)", "expected": "Navigation successful"},
  {"step": "Navigate back to /studio/canvas", "expected": "Canvas loads with all shapes and connections preserved"}
]'::jsonb,
'high', 'integration', '["design-studio", "canvas", "persistence", "US-CVS-017"]'::jsonb, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO test_case_stories (test_case_id, story_id)
VALUES
('TC-CVS-017', 'US-CVS-017'),
('TC-CVS-017', 'US-CVS-IMPL-017'),
('TC-CVS-018', 'US-CVS-017'),
('TC-CVS-018', 'US-CVS-IMPL-017'),
('TC-CVS-019', 'US-CVS-017'),
('TC-CVS-019', 'US-CVS-IMPL-017')
ON CONFLICT DO NOTHING;

-- ============================================================
-- TC-CVS-020-022: ArchiMate Element Support (US-CVS-018)
-- ============================================================

INSERT INTO test_cases (id, suite_id, title, preconditions, steps, priority, test_type, tags, created_at, updated_at)
VALUES
('TC-CVS-020', 'TS-CVS-STUDIO', 'Verify ArchiMate elements can be added to canvas',
'User is on Design Studio canvas, backend has ArchiMate elements',
'[
  {"step": "Open the ArchiMate palette in the sidebar", "expected": "Palette displays ArchiMate categories (Business, Application, etc.)"},
  {"step": "Select \"Business Actor\" element", "expected": "Business Actor is highlighted/selected"},
  {"step": "Click on canvas to place the element", "expected": "Business Actor appears as a rounded rectangle with person icon"},
  {"step": "Add \"Application Component\" element", "expected": "Application Component appears as a rectangle with correct color"},
  {"step": "Verify ArchiMate-specific styling is applied", "expected": "Elements use standard ArchiMate colors and shapes"}
]'::jsonb,
'critical', 'integration', '["design-studio", "archimate", "elements", "US-CVS-018"]'::jsonb, NOW(), NOW()),

('TC-CVS-021', 'TS-CVS-STUDIO', 'Verify ArchiMate elements sync with backend',
'Design Studio canvas is open',
'[
  {"step": "Add an ArchiMate \"Business Process\" element to canvas", "expected": "Element appears on canvas"},
  {"step": "Edit the element name to \"Order Processing\"", "expected": "Text updates on canvas"},
  {"step": "Verify backend API call is made (check Network tab)", "expected": "PUT/PATCH request sent to update object in backend"},
  {"step": "Refresh the page", "expected": "Canvas loads with \"Order Processing\" element preserved"}
]'::jsonb,
'critical', 'integration', '["design-studio", "archimate", "backend", "persistence", "US-CVS-018"]'::jsonb, NOW(), NOW()),

('TC-CVS-022', 'TS-CVS-STUDIO', 'Verify ArchiMate relationships can be created',
'Canvas has two ArchiMate elements (e.g., Actor and Process)',
'[
  {"step": "Activate connection mode", "expected": "Connection mode is active"},
  {"step": "Select \"Business Actor\" as source", "expected": "Actor is highlighted"},
  {"step": "Select \"Business Process\" as target", "expected": "Connection is created between Actor and Process"},
  {"step": "Verify connection is an ArchiMate relationship", "expected": "Connection follows ArchiMate notation (e.g., solid line with arrow)"},
  {"step": "Check backend for relationship record", "expected": "Backend has ObjectConnection record linking the two objects"}
]'::jsonb,
'high', 'integration', '["design-studio", "archimate", "relationships", "US-CVS-018"]'::jsonb, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO test_case_stories (test_case_id, story_id)
VALUES
('TC-CVS-020', 'US-CVS-018'),
('TC-CVS-020', 'US-CVS-IMPL-018'),
('TC-CVS-021', 'US-CVS-018'),
('TC-CVS-021', 'US-CVS-IMPL-018'),
('TC-CVS-022', 'US-CVS-018'),
('TC-CVS-022', 'US-CVS-IMPL-018')
ON CONFLICT DO NOTHING;

-- ============================================================
-- TC-CVS-023-025: Cross-Browser and Edge Cases
-- ============================================================

INSERT INTO test_cases (id, suite_id, title, preconditions, steps, priority, test_type, tags, created_at, updated_at)
VALUES
('TC-CVS-023', 'TS-CVS-MVP', 'Verify canvas works in different browsers',
'Access to Chrome, Firefox, Safari',
'[
  {"step": "Open Canvas MVP in Chrome", "expected": "All canvas features work correctly"},
  {"step": "Test shape creation, resizing, text editing", "expected": "All features work as expected"},
  {"step": "Repeat tests in Firefox", "expected": "All features work consistently with Chrome"},
  {"step": "Repeat tests in Safari", "expected": "All features work consistently"}
]'::jsonb,
'medium', 'regression', '["canvas", "cross-browser", "compatibility"]'::jsonb, NOW(), NOW()),

('TC-CVS-024', 'TS-CVS-MVP', 'Verify canvas performance with many shapes',
'Canvas MVP is open',
'[
  {"step": "Add 50 shapes to the canvas", "expected": "All shapes render correctly"},
  {"step": "Test drag operation on a shape", "expected": "Dragging is smooth without lag"},
  {"step": "Test zoom in/out with 50 shapes", "expected": "Zoom is responsive, no performance degradation"},
  {"step": "Add 50 more shapes (100 total)", "expected": "Canvas remains responsive"},
  {"step": "Create 20 connections between shapes", "expected": "Connections render correctly, no lag"}
]'::jsonb,
'high', 'smoke', '["canvas", "performance", "stress-test"]'::jsonb, NOW(), NOW()),

('TC-CVS-025', 'TS-CVS-MVP', 'Verify canvas handles edge cases gracefully',
'Canvas MVP is open',
'[
  {"step": "Try to resize a shape smaller than minimum (50x50)", "expected": "Shape stops at minimum size, does not break"},
  {"step": "Drag a shape off the visible canvas area", "expected": "Shape can be dragged off-canvas and retrieved by panning"},
  {"step": "Perform undo when history is empty", "expected": "No error, undo button is disabled or does nothing gracefully"},
  {"step": "Perform redo when redo stack is empty", "expected": "No error, redo button is disabled or does nothing gracefully"},
  {"step": "Delete shape while text editing is active", "expected": "Text editing exits, shape is deleted safely"}
]'::jsonb,
'medium', 'functional', '["canvas", "edge-cases", "error-handling"]'::jsonb, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO test_case_stories (test_case_id, story_id)
VALUES
('TC-CVS-023', 'US-CVS-012'),
('TC-CVS-023', 'US-CVS-013'),
('TC-CVS-023', 'US-CVS-014'),
('TC-CVS-024', 'US-CVS-017'),
('TC-CVS-025', 'US-CVS-012'),
('TC-CVS-025', 'US-CVS-013'),
('TC-CVS-025', 'US-CVS-014'),
('TC-CVS-025', 'US-CVS-016')
ON CONFLICT DO NOTHING;

-- Verification Query
SELECT 
  ts.id AS suite_id,
  ts.name AS suite_name,
  COUNT(tc.id) AS test_case_count
FROM test_suites ts
LEFT JOIN test_cases tc ON tc.suite_id = ts.id
WHERE ts.id IN ('TS-CVS-MVP', 'TS-CVS-STUDIO')
GROUP BY ts.id, ts.name
ORDER BY ts.id;

SELECT 
  tc.id,
  tc.title,
  tc.priority,
  tc.test_type,
  STRING_AGG(tcs.story_id, ', ' ORDER BY tcs.story_id) AS linked_stories
FROM test_cases tc
LEFT JOIN test_case_stories tcs ON tc.id = tcs.test_case_id
WHERE tc.id LIKE 'TC-CVS-%'
GROUP BY tc.id, tc.title, tc.priority, tc.test_type
ORDER BY tc.id;

