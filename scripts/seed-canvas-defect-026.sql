-- Canvas Defect DEF-CVS-026: Connection Mode Reset on Shape Lookup Failure
-- Discovered during code review, fixed in this commit

INSERT INTO defects (
  id, title, description, severity, status, type,
  user_story_id, discovered_by, assigned_to, root_cause, resolution,
  steps_to_reproduce, expected_behavior, actual_behavior,
  affected_files, resolved_at, created_at, updated_at
) VALUES (
  'DEF-CVS-026',
  'Connection Mode Prematurely Reset When Shape Lookup Fails',
  '**Module**: Canvas MVP & Studio Canvas - Connection Creation (US-CVS-006)
**Impact**: Users lose connection creation state without feedback when shape lookup fails, forcing them to restart the entire connection process

When creating a connection between two shapes, if either the source or target shape cannot be found in the shapes array, the code still exits connection mode and resets all connection state. This means the user loses their work and must restart the entire connection creation process from scratch, without any indication of what went wrong.

**Affected User Stories**:
- US-CVS-006: Connection Creation (10 pts)
- US-CVS-011: Connection Routing (5 pts)

**Code Locations**:
- `client/src/components/canvas/DesignCanvas.tsx:145-147`
- `client/src/components/canvas/design-canvas-mvp.tsx:183-186`',
  'medium',
  'resolved',
  'defect',
  'US-CVS-006',
  'Code Review',
  'Platform Team',
  'State reset logic placed outside conditional block for successful connection creation.

**Root Cause**:
The connection mode reset logic was placed OUTSIDE the `if (sourceShape && targetShape)` conditional block, causing it to execute regardless of whether the shapes were found.

**Before (DesignCanvas.tsx)**:
```typescript
if (sourceShape && targetShape) {
  // Create connection...
  setConnections(prev => [...prev, newConnection]);
}

// ❌ This runs even when shapes are NOT found!
setConnectionMode(''none'');
setConnectionSource(null);
onObjectSelect([]);
```

**Before (design-canvas-mvp.tsx)**:
```typescript
setShapes(currentShapes => {
  const sourceShape = currentShapes.find(s => s.id === connectionSource);
  const targetShape = currentShapes.find(s => s.id === shapeId);
  
  if (sourceShape && targetShape) {
    // Create connection...
  } else {
    console.error(''Could not find shapes'');
  }
  
  return currentShapes;
});

// ❌ This runs even when shapes are NOT found!
setConnectionMode(''none'');
setConnectionSource(null);
setSelectedShapeId(null);
```

**Why This Is Bad**:
1. User clicks shape A to start connection
2. User clicks shape B (but B was just deleted or not found due to race condition)
3. Connection mode resets without creating connection
4. User has no idea what happened or why
5. User must start over from scratch',
  'Fixed by moving state reset logic inside the success conditional block.

**Solution for DesignCanvas.tsx**:
```typescript
if (sourceShape && targetShape) {
  const points = calculateConnectionPoints(
    sourceShape,
    targetShape,
    connectionRoutingType
  );
  
  const newConnection: CanvasConnectionData = {
    id: `conn-${Date.now()}`,
    sourceShapeId: connectionSource,
    targetShapeId: shapeId,
    routingType: connectionRoutingType,
    lineStyle: ''solid'',
    arrowType: connectionArrowType,
    points,
  };
  
  setConnections(prev => [...prev, newConnection]);
  
  // ✅ Only reset after successful creation
  setConnectionMode(''none'');
  setConnectionSource(null);
  onObjectSelect([]);
} else {
  // ✅ Provide feedback but keep connection mode active
  console.warn(''Could not create connection: source or target shape not found'', {
    connectionSource,
    targetShapeId: shapeId,
    sourceFound: !!sourceShape,
    targetFound: !!targetShape
  });
  // User can try again or press Escape to cancel
}
```

**Solution for design-canvas-mvp.tsx**:
```typescript
let connectionCreated = false;

setShapes(currentShapes => {
  const sourceShape = currentShapes.find(s => s.id === connectionSource);
  const targetShape = currentShapes.find(s => s.id === shapeId);
  
  if (sourceShape && targetShape) {
    // Create connection...
    setConnections(prev => [...prev, newConnection]);
    connectionCreated = true;
  } else {
    console.error(''❌ Could not find shapes for connection'');
  }
  
  return currentShapes;
});

// ✅ Only reset if connection was successfully created
if (connectionCreated) {
  setConnectionMode(''none'');
  setConnectionSource(null);
  setSelectedShapeId(null);
} else {
  console.warn(''Connection mode still active - user can try again or press Escape to cancel'');
}
```

**Benefits**:
1. User keeps connection mode active after failed attempt
2. User can immediately try clicking another shape
3. Console logging provides debugging feedback
4. More resilient to race conditions
5. Better user experience

**Files Modified**:
- `client/src/components/canvas/DesignCanvas.tsx`
- `client/src/components/canvas/design-canvas-mvp.tsx`

**Fixed in commit**: (current)',
  ARRAY[
    '1. Start the canvas and add two shapes',
    '2. Click "Add Connection" to enter connection mode',
    '3. Click the first shape to set it as source',
    '4. Delete the first shape (or cause it to be removed from state)',
    '5. Click the second shape',
    '6. Observe: Connection mode exits without creating connection',
    '7. Observe: No error message or feedback',
    '8. User must restart entire connection process'
  ]::text[],
  'If shape lookup fails, connection mode should remain active so user can try again. Error feedback should be logged to console for debugging.',
  'Connection mode immediately exits when shape lookup fails, forcing user to restart the entire connection creation process without any indication of what went wrong.',
  ARRAY[
    'client/src/components/canvas/DesignCanvas.tsx',
    'client/src/components/canvas/design-canvas-mvp.tsx'
  ]::text[],
  NOW(),
  NOW(),
  NOW()
);

-- Verify insertion
SELECT 
  id,
  title,
  severity,
  status,
  user_story_id
FROM defects
WHERE id = 'DEF-CVS-026';

