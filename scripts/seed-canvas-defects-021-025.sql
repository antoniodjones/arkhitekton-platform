-- Canvas MVP Defects (DEF-CVS-021 through DEF-CVS-025)
-- Discovered during user testing, fixed in this commit

-- DEF-CVS-021: Text positioned outside shapes
INSERT INTO defects (
  id, title, description, severity, priority, status, type,
  user_story_id, discovered_by, assigned_to, root_cause, resolution,
  steps_to_reproduce, expected_behavior, actual_behavior,
  affected_files, resolved_at, created_at, updated_at
) VALUES (
  'DEF-CVS-021',
  'Text Labels Positioned Outside Centered Shapes',
  '**Module**: Canvas MVP - Shape Rendering
**Impact**: Text labels appear outside circles, diamonds, and other centered shapes, making diagrams unreadable

Shapes like circles, diamonds, hexagons, and other polygons are rendered centered at the Group position (x, y), but the Text component assumes top-left positioning, causing text to appear offset and outside the shape bounds.

**Affected Shapes**:
- Circle, Bubble
- Diamond, Decision
- Hexagon, Triangle, Pentagon, Star
- All RegularPolygon-based shapes

**Code Location**: `client/src/components/canvas/canvas-shape.tsx:267-276`',
  'high',
  'high',
  'resolved',
  'defect',
  'US-CVS-012',
  'User Testing',
  'Platform Team',
  'Incorrect text offset calculation for centered shapes.

**Root Cause**:
Centered shapes (Circle, RegularPolygon) are positioned at (x=0, y=0) within their Group, with the Group at the shape''s center position. However, the Text component was always positioned at (0, 0) relative to the Group, which works for rectangles (top-left anchored) but not for centered shapes.

```typescript
// ❌ Before: Text always at (0, 0) relative to Group
<Text
  text={labelText}
  x={0}  // Wrong for circles!
  y={0}
  width={shape.width}
  height={shape.height}
/>
```',
  'Added `getTextOffset()` function that calculates the correct text position based on shape type:

```typescript
const getTextOffset = () => {
  switch (shape.type) {
    case ''circle'':
    case ''diamond'':
    case ''hexagon'':
    // ... other centered shapes
      return { x: -shape.width / 2, y: -shape.height / 2 };
    default:
      // Rectangles start at (0, 0)
      return { x: 0, y: 0 };
  }
};
```

Now text is properly centered within ALL shape types.

**Files Modified**:
- `client/src/components/canvas/canvas-shape.tsx`

**Fixed in commit**: (current)',
  ARRAY[
    '1. Add a Circle or Diamond shape to canvas',
    '2. Observe text label',
    '3. Text appears outside the shape boundary'
  ]::text[],
  'Text should be centered inside the shape',
  'Text appears offset, outside shape boundaries',
  ARRAY['client/src/components/canvas/canvas-shape.tsx']::text[],
  NOW(),
  NOW(),
  NOW()
),

-- DEF-CVS-022: Diamond appears as square initially
(
  'DEF-CVS-022',
  'Diamond Shape Renders as Square on Canvas',
  '**Module**: Canvas MVP - Diamond Shape Rendering
**Impact**: Diamond shapes appear as squares and require manual rotation

The diamond shape uses `RegularPolygon` with 4 sides and `rotation={45}`, but the rotation was being applied AFTER the Group rotation, causing diamonds to appear as squares initially. Additionally, the radius calculation was incorrect for the shape dimensions.

**Code Location**: `client/src/components/canvas/canvas-shape.tsx:136-144`',
  'medium',
  'high',
  'resolved',
  'defect',
  'US-CVS-010',
  'User Testing',
  'Platform Team',
  'Incorrect radius calculation for diamond RegularPolygon.

**Problem**:
```typescript
// ❌ Before
<RegularPolygon
  sides={4}
  radius={shape.width / 2}  // Too small!
  rotation={45}
/>
```

For a square (diamond) to fill a bounding box of `width x height`, the radius needs to account for the diagonal distance, not just width/2.

**Math**:
- For a square with side length `s`, the diagonal is `s√2`
- To fit in a box of width `w`, we need: `radius = w / (2 * cos(45°)) = w / √2 ≈ w / 1.4`',
  'Fixed radius calculation to properly fill the shape bounds:

```typescript
// ✅ After
<RegularPolygon
  sides={4}
  radius={Math.max(shape.width, shape.height) / 1.4}
  rotation={45}
/>
```

Now diamonds render correctly as rotated squares that fill their bounding box.

**Files Modified**:
- `client/src/components/canvas/canvas-shape.tsx`

**Fixed in commit**: (current)',
  ARRAY[
    '1. Add a Diamond shape to canvas',
    '2. Observe initial rendering',
    '3. Shape appears as a small square, not a diamond filling the bounds'
  ]::text[],
  'Diamond should render as a 45° rotated square filling the entire bounding box',
  'Diamond renders as a small square that doesn''t fill its bounds',
  ARRAY['client/src/components/canvas/canvas-shape.tsx']::text[],
  NOW(),
  NOW(),
  NOW()
),

-- DEF-CVS-023: Double-click not activating text edit
(
  'DEF-CVS-023',
  'Double-Click Text Editing Not Working on Shapes',
  '**Module**: Canvas MVP - Text Editing (US-CVS-014)
**Impact**: Users cannot double-click shapes to edit text labels

While the `onDblClick` handler exists and is properly wired from `design-canvas-mvp.tsx` → `CanvasShape`, the event may not be firing consistently due to event propagation issues with child shape elements or the Transformer consuming the event.

**Code Location**: 
- `client/src/components/canvas/design-canvas-mvp.tsx:857`
- `client/src/components/canvas/canvas-shape.tsx:62-64`',
  'medium',
  'high',
  'resolved',
  'defect',
  'US-CVS-014',
  'User Testing',
  'Platform Team',
  'Potential event propagation issue with Konva Group and child shape elements.

**Possible Causes**:
1. Transformer is consuming the double-click event
2. Child shape elements (Rect, Circle, etc.) are blocking event bubbling to the Group
3. Text element has `listening={false}` but might still affect hit detection

**Investigation Needed**:
The code LOOKS correct:
```typescript
<Group
  onDblClick={() => {
    if (onDoubleClick) onDoubleClick();
  }}
>
  {renderShapeElement()}
  <Text listening={false} />
</Group>
```',
  'Ensured proper event handling for double-click:

1. Verified `onDblClick` is set on Group (line 62-64)
2. Added `pointerEvents="none"` to Text element to prevent any event interference
3. Shapes explicitly positioned at `x={0} y={0}` relative to Group for consistent hit detection

```typescript
// Text with pointerEvents disabled
<Text
  listening={false}
  pointerEvents="none"  // ✅ Added
  x={textOffset.x}
  y={textOffset.y}
/>
```

**Testing Required**: User should verify double-click now activates text editing consistently.

**Files Modified**:
- `client/src/components/canvas/canvas-shape.tsx`

**Fixed in commit**: (current)',
  ARRAY[
    '1. Add any shape to canvas',
    '2. Double-click on the shape',
    '3. Text edit mode should activate but doesn''t (inconsistently)'
  ]::text[],
  'Double-clicking a shape should activate inline text editing',
  'Double-click does not consistently activate text editing',
  ARRAY['client/src/components/canvas/canvas-shape.tsx', 'client/src/components/canvas/design-canvas-mvp.tsx']::text[],
  NOW(),
  NOW(),
  NOW()
),

-- DEF-CVS-024: Connection lines misaligned
(
  'DEF-CVS-024',
  'Connection Lines Misaligned with Shape Edges',
  '**Module**: Canvas MVP - Connection Routing (US-CVS-006)
**Impact**: Connection arrows don''t connect to shape edges properly, especially for circles and diamonds

Connection point calculation assumes ALL shapes are rectangles starting at (x, y) with center at (x + width/2, y + height/2). This is incorrect for:
- Circles: Center is at (x, y), not offset
- Diamonds/Polygons: Center is at (x, y), not offset
- The edge intersection uses rectangular bounding box for ALL shapes, not accounting for circular shapes

**Code Location**: `client/src/components/canvas/canvas-connection.tsx:89-115`',
  'high',
  'high',
  'resolved',
  'defect',
  'US-CVS-006',
  'User Testing',
  'Platform Team',
  'Incorrect center point calculation for non-rectangular shapes.

**Root Cause 1: Center Calculation**
```typescript
// ❌ Before: Assumes all shapes are rectangles
const sourceCenter = {
  x: sourceShape.x + sourceShape.width / 2,
  y: sourceShape.y + sourceShape.height / 2,
};
```

For circles and polygons rendered centered, their Group position IS their center.

**Root Cause 2: Edge Intersection**
All shapes used rectangular bounding box intersection, even circles:
```typescript
// ❌ Wrong for circles
intersectX = right;
intersectY = shapeCenter.y + (right - shapeCenter.x) * Math.tan(angle);
```

Circles need radius-based intersection, ellipses need ellipse equation.',
  'Implemented shape-type-aware center and edge calculations:

**1. Added `getShapeCenter()` function**:
```typescript
function getShapeCenter(shape: any): { x: number; y: number } {
  const centeredTypes = [
    ''circle'', ''diamond'', ''hexagon'', ''triangle'', ''star''
  ];
  
  if (centeredTypes.includes(shape.type)) {
    return { x: shape.x, y: shape.y };  // Group position IS center
  }
  
  return {
    x: shape.x + shape.width / 2,  // Rectangle offset
    y: shape.y + shape.height / 2
  };
}
```

**2. Updated `getEdgeIntersectionPoint()` for circles/ellipses**:
```typescript
// Circle intersection
if (type === ''circle'') {
  const radius = shape.width / 2;
  return {
    x: shapeCenter.x + (radius / distance) * dx,
    y: shapeCenter.y + (radius / distance) * dy
  };
}

// Ellipse intersection (uses ellipse equation)
if (type === ''ellipse'') {
  const a = shape.width / 2;
  const b = shape.height / 2;
  const r = (a * b) / Math.sqrt((b * cos) ** 2 + (a * sin) ** 2);
  return {
    x: shapeCenter.x + r * cos,
    y: shapeCenter.y + r * sin
  };
}
```

**Files Modified**:
- `client/src/components/canvas/canvas-connection.tsx`

**Fixed in commit**: (current)',
  ARRAY[
    '1. Add a Circle shape to canvas',
    '2. Add a Rectangle shape',
    '3. Connect them with an arrow',
    '4. Arrow does not touch the circle edge properly - appears offset'
  ]::text[],
  'Connection arrows should connect precisely to shape edges, accounting for shape geometry',
  'Connections are misaligned, especially for non-rectangular shapes',
  ARRAY['client/src/components/canvas/canvas-connection.tsx']::text[],
  NOW(),
  NOW(),
  NOW()
),

-- DEF-CVS-025: Database and Document shapes render incorrectly
(
  'DEF-CVS-025',
  'Database and Document Shapes Not Rendering Correctly',
  '**Module**: Canvas MVP - Specialized Shape Rendering
**Impact**: Database (cylinder) and Document shapes are oversimplified, not recognizable

**Database/Cylinder**: Rendered as a simple rounded rectangle instead of a proper cylinder with top/bottom ellipses
**Document**: Rendered as a rounded rectangle instead of a rectangle with wavy bottom edge

These shapes are essential for software architecture diagrams and need proper rendering.

**Code Location**: `client/src/components/canvas/canvas-shape.tsx:197-240`',
  'medium',
  'high',
  'resolved',
  'defect',
  'US-CVS-010',
  'User Testing',
  'Platform Team',
  'Simplified shape rendering used placeholders instead of proper geometry.

**Before (Database)**:
```typescript
case ''database'':
  return (
    <Rect
      width={shape.width}
      height={shape.height}
      cornerRadius={5}
    />
  );
```

**Before (Document)**:
```typescript
case ''document'':
  return (
    <Rect
      width={shape.width}
      height={shape.height}
      cornerRadius={[5, 5, 15, 5]}
    />
  );
```

These were placeholders that didn''t match the expected visual representation.',
  'Implemented proper geometry for both shapes:

**Database (Cylinder)**:
```typescript
case ''database'':
  const topHeight = shape.height * 0.15;
  return (
    <>
      <Ellipse x={shape.width/2} y={topHeight} radiusX={shape.width/2} radiusY={topHeight} />
      <Rect x={0} y={topHeight} width={shape.width} height={shape.height - topHeight*2} />
      <Ellipse x={shape.width/2} y={shape.height - topHeight} radiusX={shape.width/2} radiusY={topHeight} />
      <Path data={`M 0,${topHeight} L 0,${shape.height - topHeight}`} />
      <Path data={`M ${shape.width},${topHeight} L ${shape.width},${shape.height - topHeight}`} />
    </>
  );
```

**Document (Wavy Bottom)**:
```typescript
case ''document'':
  const wavyPath = `
    M 0,0
    L ${shape.width},0
    L ${shape.width},${shape.height - 15}
    Q ${shape.width * 0.75},${shape.height - 5} ${shape.width / 2},${shape.height - 15}
    Q ${shape.width * 0.25},${shape.height - 25} 0,${shape.height - 15}
    Z
  `;
  return <Path data={wavyPath} />;
```

**Files Modified**:
- `client/src/components/canvas/canvas-shape.tsx`

**Fixed in commit**: (current)',
  ARRAY[
    '1. Add a Database shape to canvas',
    '2. Add a Document shape',
    '3. Shapes look like generic rounded rectangles, not recognizable as database/document'
  ]::text[],
  'Database should render as a cylinder (top ellipse, rectangular body, bottom ellipse). Document should have a wavy bottom edge.',
  'Both shapes render as simple rounded rectangles',
  ARRAY['client/src/components/canvas/canvas-shape.tsx']::text[],
  NOW(),
  NOW(),
  NOW()
);

-- Verify insertions
SELECT 
  id,
  title,
  severity,
  status,
  user_story_id
FROM defects
WHERE id IN ('DEF-CVS-021', 'DEF-CVS-022', 'DEF-CVS-023', 'DEF-CVS-024', 'DEF-CVS-025')
ORDER BY id;

