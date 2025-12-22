# Design Canvas MVP - Implementation Plan
## Minimal Canvas with Basic Shapes (Option C)

---

| Field | Value |
|-------|-------|
| **Plan ID** | CANVAS-MVP-001 |
| **Version** | 1.0 |
| **Date** | December 22, 2025 |
| **Sprint Capacity** | 41 points (6 stories) |
| **Target Duration** | 1 sprint (2 weeks) |
| **Module** | Design Studio - Canvas |
| **Epic** | EPIC-IDE-02: Modeling Canvas Engine |

---

## 1. Executive Summary

This plan delivers a **functional diagramming canvas** with draw.io-style basic shapes, focusing on universal diagramming needs before adding framework-specific libraries (AWS, Azure, BPMN).

**Key Deliverable**: Users can create professional diagrams with basic geometric shapes and smart connections in 2 weeks.

---

## 2. Strategic Context

### 2.1 Why Basic Shapes First?

| Approach | Pros | Cons | Decision |
|----------|------|------|----------|
| **Framework Icons First** (AWS, BPMN) | Impressive demos, EA-specific | Complex, 170+ icons, slow to build | ❌ Deferred |
| **Basic Shapes First** (Draw.io style) | Fast to build, universal use, proven UX | Less "wow" factor | ✅ **Selected** |

**Rationale**:
- ✅ Faster time-to-value (2 weeks vs 8+ weeks)
- ✅ Works for ANY diagram type (flowcharts, wireframes, org charts)
- ✅ Proven UX pattern (Draw.io, Lucidchart, Visio)
- ✅ Foundation for framework libraries (Phase 2)

### 2.2 What This Enables

**Immediate Use Cases**:
1. Flowcharts and process diagrams
2. System architecture diagrams (high-level)
3. Org charts and hierarchies
4. Wireframes and mockups
5. Mind maps and concept diagrams

**Foundation For**:
- Phase 2: AWS/Azure/GCP icon libraries
- Phase 2: BPMN/ArchiMate frameworks
- Phase 3: AI-powered diagramming
- Phase 3: Real-time collaboration

---

## 3. User Stories Breakdown (41 points)

### 3.1 Core Stories (Sequenced)

| # | Story ID | Feature | Points | Dependencies | Status |
|---|----------|---------|--------|--------------|--------|
| 1 | US-CVS-001 | Infinite Canvas Pan/Zoom | 8 | None | 🔲 Backlog |
| 2 | US-CVS-010 | Basic Shape Library | 5 | US-CVS-001 | 🔲 Backlog |
| 3 | US-CVS-004 | Shape Drag & Drop | 8 | US-CVS-010 | 🔲 Backlog |
| 4 | US-CVS-006 | Connection Creation | 10 | US-CVS-004 | 🔲 Backlog |
| 5 | US-CVS-011 | Connection Routing | 5 | US-CVS-006 | 🔲 Backlog |
| 6 | US-CVS-008 | Multi-Selection | 5 | US-CVS-004 | 🔲 Backlog |

**Parallel Work Possible**:
- US-CVS-001 (Canvas) can be built independently
- US-CVS-010 (Shapes) can start once canvas shell exists
- US-CVS-004, US-CVS-006, US-CVS-008 are sequential

---

## 4. Technical Architecture

### 4.1 Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Canvas Engine** | React Konva | High-performance 2D rendering |
| **State Management** | React hooks + Context | Canvas state, shapes, connections |
| **Routing Algorithm** | Custom (Orthogonal) | Smart connection paths |
| **Data Persistence** | PostgreSQL + Drizzle | Save/load diagrams |
| **Export** | Konva.toDataURL() | PNG/SVG export |

### 4.2 Component Hierarchy

```
DesignCanvas (main container)
├── CanvasToolbar (top bar: zoom, undo, export)
├── ShapePalette (left sidebar)
│   ├── ShapeCategory (Geometric, Flowchart, Containers)
│   └── ShapeButton (individual shape triggers)
├── KonvaStage (React Konva canvas)
│   ├── GridLayer (background grid)
│   ├── ShapesLayer
│   │   ├── BasicShape (Rectangle, Circle, Diamond, etc.)
│   │   └── TextShape (labels and text boxes)
│   └── ConnectionsLayer
│       └── Connection (arrows with routing)
└── PropertiesPanel (right sidebar - Phase 2)
```

### 4.3 Data Model

```typescript
// Shape definition
interface Shape {
  id: string;
  type: 'rectangle' | 'circle' | 'diamond' | 'hexagon' | 'cylinder' | 
        'ellipse' | 'triangle' | 'process' | 'decision' | 'database' | 
        'document' | 'cloud' | 'text';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number; // degrees
  fill: string; // hex color
  stroke: string;
  strokeWidth: number;
  text?: string;
  fontSize?: number;
  zIndex: number;
}

// Connection definition
interface Connection {
  id: string;
  sourceShapeId: string;
  targetShapeId: string;
  sourceAnchor: 'top' | 'right' | 'bottom' | 'left' | 'center';
  targetAnchor: 'top' | 'right' | 'bottom' | 'left' | 'center';
  routingType: 'straight' | 'orthogonal' | 'curved';
  lineStyle: 'solid' | 'dashed' | 'dotted';
  arrowType: 'single' | 'bidirectional' | 'none';
  color: string;
  thickness: number;
  points: number[]; // calculated path [x1, y1, x2, y2, ...]
}

// Canvas state
interface CanvasState {
  shapes: Shape[];
  connections: Connection[];
  selectedShapeIds: string[];
  selectedConnectionIds: string[];
  zoom: number; // 0.1 to 5.0
  pan: { x: number; y: number };
  gridVisible: boolean;
  snapToGrid: boolean;
}
```

---

## 5. Implementation Phases

### 5.1 Phase 1A: Canvas Foundation (Days 1-3)

**Stories**: US-CVS-001 (8 pts)

**Tasks**:
- [x] Set up React Konva Stage and Layer
- [ ] Implement pan (click+drag empty space)
- [ ] Implement zoom (Ctrl+scroll, zoom buttons)
- [ ] Add grid background (dots or lines)
- [ ] Add zoom level indicator
- [ ] Test performance (smooth 60fps with 100+ shapes)

**Acceptance**: Can pan and zoom smoothly across infinite canvas

---

### 5.2 Phase 1B: Shape Library (Days 3-5)

**Stories**: US-CVS-010 (5 pts)

**Tasks**:
- [ ] Create `ShapePalette.tsx` sidebar component
- [ ] Implement 12 basic shapes using Konva primitives:
  - **Geometric**: Rectangle, Rounded Rectangle, Circle, Ellipse, Diamond, Triangle, Hexagon, Cylinder
  - **Flowchart**: Process Box (rectangle), Decision (diamond), Database (cylinder), Document
  - **Containers**: Cloud, Frame
  - **Text**: Text Box
- [ ] Add shape icons (SVG or Lucide React)
- [ ] Add collapsible categories
- [ ] Style palette (Material Design or Shadcn UI)

**Acceptance**: Left sidebar displays 12 shapes in organized categories

---

### 5.3 Phase 1C: Drag & Drop (Days 5-7)

**Stories**: US-CVS-004 (8 pts)

**Tasks**:
- [ ] Implement drag from palette to canvas
- [ ] Drop shape at cursor position
- [ ] Implement shape dragging (move existing shapes)
- [ ] Add visual feedback (cursor changes, highlight)
- [ ] Set default sizes for each shape type
- [ ] Add shape to canvas state
- [ ] Persist shapes to database

**Acceptance**: Can drag shapes from palette and reposition them

---

### 5.4 Phase 1D: Connections (Days 7-10)

**Stories**: US-CVS-006 (10 pts) + US-CVS-011 (5 pts)

**Tasks**:
- [ ] Implement "connection mode" (click shape → click shape)
- [ ] Detect anchor points on shapes (8 points: N, NE, E, SE, S, SW, W, NW)
- [ ] Create `Connection.tsx` Konva component (Arrow)
- [ ] Implement **orthogonal routing algorithm**:
  - Calculate entry/exit sides
  - Add 90° bends to avoid shape overlap
  - Minimize total path length
- [ ] Implement **straight routing** (fallback)
- [ ] Update connections when shapes move
- [ ] Add connection styling (solid/dashed, color, thickness)
- [ ] Persist connections to database

**Acceptance**: Can create arrows between shapes with smart routing

---

### 5.5 Phase 1E: Multi-Selection (Days 10-12)

**Stories**: US-CVS-008 (5 pts)

**Tasks**:
- [ ] Implement marquee selection (click+drag on empty space)
- [ ] Add Shift+click for multi-select
- [ ] Show selection indicators (blue border, handles)
- [ ] Enable delete multiple shapes (Delete key)
- [ ] Enable move multiple shapes together
- [ ] Handle connection updates for moved shapes

**Acceptance**: Can select and manipulate multiple shapes at once

---

### 5.6 Phase 1F: Polish & Testing (Days 12-14)

**Tasks**:
- [ ] Add keyboard shortcuts (Delete, Esc, Ctrl+Z prep)
- [ ] Add export to PNG (Konva.toDataURL)
- [ ] Add save/load diagram (database)
- [ ] Performance testing (100+ shapes, smooth interactions)
- [ ] Bug fixes and edge cases
- [ ] Write user documentation

**Acceptance**: Production-ready canvas with all 6 stories complete

---

## 6. API & Database Schema

### 6.1 New Tables

```sql
-- architectural_models table (already exists, reuse)
-- Stores diagram metadata

-- canvas_shapes (new)
CREATE TABLE canvas_shapes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id UUID NOT NULL REFERENCES architectural_models(id) ON DELETE CASCADE,
  shape_type VARCHAR(50) NOT NULL, -- 'rectangle', 'circle', etc.
  x DECIMAL NOT NULL,
  y DECIMAL NOT NULL,
  width DECIMAL NOT NULL,
  height DECIMAL NOT NULL,
  rotation DECIMAL DEFAULT 0,
  fill VARCHAR(20) DEFAULT '#f0f0f0',
  stroke VARCHAR(20) DEFAULT '#333333',
  stroke_width INTEGER DEFAULT 2,
  text TEXT,
  font_size INTEGER DEFAULT 14,
  z_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- canvas_connections (new)
CREATE TABLE canvas_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id UUID NOT NULL REFERENCES architectural_models(id) ON DELETE CASCADE,
  source_shape_id UUID NOT NULL REFERENCES canvas_shapes(id) ON DELETE CASCADE,
  target_shape_id UUID NOT NULL REFERENCES canvas_shapes(id) ON DELETE CASCADE,
  source_anchor VARCHAR(20) DEFAULT 'center',
  target_anchor VARCHAR(20) DEFAULT 'center',
  routing_type VARCHAR(20) DEFAULT 'orthogonal',
  line_style VARCHAR(20) DEFAULT 'solid',
  arrow_type VARCHAR(20) DEFAULT 'single',
  color VARCHAR(20) DEFAULT '#333333',
  thickness INTEGER DEFAULT 2,
  points JSONB, -- calculated path
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 6.2 API Endpoints

```typescript
// Shapes
GET    /api/models/:modelId/shapes
POST   /api/models/:modelId/shapes
PATCH  /api/shapes/:id
DELETE /api/shapes/:id
POST   /api/shapes/bulk-update (for multi-select moves)

// Connections
GET    /api/models/:modelId/connections
POST   /api/models/:modelId/connections
PATCH  /api/connections/:id
DELETE /api/connections/:id

// Export
GET    /api/models/:modelId/export?format=png|svg
```

---

## 7. Success Criteria

### 7.1 Functional Requirements

| Requirement | Test Method | Status |
|-------------|-------------|--------|
| Pan across 10,000px canvas | Manual test | 🔲 |
| Zoom from 10% to 500% | Manual test | 🔲 |
| Drag all 12 shape types | Manual test | 🔲 |
| Create connections with orthogonal routing | Manual test | 🔲 |
| Select 10+ shapes with marquee | Manual test | 🔲 |
| Delete multiple shapes | Manual test | 🔲 |
| Export diagram to PNG | Manual test | 🔲 |
| Save and reload diagram | Manual test | 🔲 |

### 7.2 Non-Functional Requirements

| Requirement | Target | Measurement |
|-------------|--------|-------------|
| **Performance** | 60fps pan/zoom | React Profiler |
| **Responsiveness** | < 100ms interaction lag | Manual timing |
| **Scalability** | 100+ shapes smooth | Stress test |
| **Browser Support** | Chrome, Firefox, Safari, Edge | Manual test |

---

## 8. Phase 2 Preview (Not in This Sprint)

**Deferred Features** (estimate: +60 pts / 3 sprints):
- US-CVS-005: Resize handles and rotation
- US-CVS-007: Undo/Redo stack
- US-CVS-003: Smart alignment guides
- US-CVS-002: Snap to grid
- US-CVS-009: Export to SVG/PDF
- Properties panel for shape styling
- Framework libraries (AWS, Azure, BPMN)
- Keyboard shortcuts (Cmd+C, Cmd+V)
- Grouping and containers

---

## 9. Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| **React Konva performance issues** | High | Virtualization, layer optimization, use `React.memo` |
| **Orthogonal routing complexity** | Medium | Start with simple algorithm, iterate |
| **Browser compatibility** | Low | Test early on all browsers, use Konva fallbacks |
| **Scope creep** | Medium | Strict adherence to 6 stories, defer Phase 2 |

---

## 10. Team & Timeline

### 10.1 Sprint Schedule (14 days)

| Days | Phase | Stories | Points |
|------|-------|---------|--------|
| 1-3 | Canvas Foundation | US-CVS-001 | 8 |
| 3-5 | Shape Library | US-CVS-010 | 5 |
| 5-7 | Drag & Drop | US-CVS-004 | 8 |
| 7-10 | Connections | US-CVS-006, US-CVS-011 | 15 |
| 10-12 | Multi-Selection | US-CVS-008 | 5 |
| 12-14 | Polish & Testing | - | - |

### 10.2 Developer Assignment

| Role | Developer | Responsibility |
|------|-----------|----------------|
| **Lead** | TBD | Overall architecture, connections algorithm |
| **Frontend** | TBD | React Konva components, shape library |
| **Backend** | TBD | API endpoints, database schema |
| **QA** | TBD | Testing, bug reporting |

---

## 11. Definition of Done

**Story is DONE when**:
- ✅ Code is written and peer-reviewed
- ✅ All Gherkin scenarios pass
- ✅ Manual testing completed
- ✅ No critical bugs
- ✅ Database migrations run successfully
- ✅ API endpoints tested with Postman/curl
- ✅ Performance targets met (60fps)
- ✅ User documentation updated

**Sprint is DONE when**:
- ✅ All 6 stories are DONE
- ✅ Demo-able to stakeholders
- ✅ Deployed to staging environment
- ✅ Retrospective completed

---

## 12. Next Steps

1. ✅ **Stories Created** - US-CVS-010, US-CVS-011 seeded
2. ⏳ **Start Implementation** - Begin with US-CVS-001 (Canvas Foundation)
3. ⏳ **Daily Standups** - Track progress against 14-day plan
4. ⏳ **Mid-Sprint Demo** - Day 7 checkpoint (Connections working)
5. ⏳ **Sprint Review** - Day 14 final demo

---

**Document Owner**: AI Assistant (Cursor)  
**Last Updated**: December 22, 2025  
**Status**: Ready for Implementation 🚀

