# ARKHITEKTON | ARKDL-0006 Design IDE v1.1

# ARKHITEKTON
## Design IDE
### Product Requirements Specification

**EPICs | Features | High-Level Requirements | User Stories | Gherkin Specifications**

| Field | Value |
|-------|-------|
| **Document ID** | ARKDL-0006-COMBINED |
| **Version** | 1.1 |
| **Date** | December 2025 |
| **Status** | Draft |
| **Module** | Design IDE |
| **Parent Module** | Design Studio |
| **Total User Stories** | 37 |
| **Total Story Points** | 247 |
| **Target Users** | Technology Architects, Solution Architects, Enterprise Architects |

### Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Dec 2025 | Initial release with 34 user stories |
| 1.1 | Dec 2025 | Added Agent Mode Selection (Auto, Question, Strategize, Execute, Scenarios) - 3 new stories |

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Release Phases Overview](#2-release-phases-overview)
3. [EPIC & Feature Definitions](#3-epic--feature-definitions)
4. [High-Level Requirements](#4-high-level-requirements)
5. [User Stories with Gherkin Specifications](#5-user-stories-with-gherkin-specifications)
6. [Requirements Traceability Matrix](#6-requirements-traceability-matrix)
7. [Appendix: Visual Design Guidelines](#7-appendix-visual-design-guidelines)

---

## 1. Executive Summary

The Design IDE is the intelligent heart of Arkhitekton - a VS Code-inspired, AI-powered modeling environment that launches when architects click '+New Model' from the Design Studio Home. It transforms architecture modeling from a solitary drafting exercise into a collaborative design experience with specialized AI agents.

### 1.1 Vision Statement

> "The Design IDE transforms architecture modeling from a solitary drafting exercise into an intelligent, AI-assisted design experience where architects collaborate with specialized AI agents to create, validate, and optimize architectural blueprints."

### 1.2 Design Philosophy

The Design IDE differentiates Arkhitekton through three core principles:

1. **Familiar & Professional:** VS Code-inspired layout reduces learning curve
2. **AI-First Modeling:** Cursor-style AI agents as co-pilots with mode selection
3. **Professional Output:** Export-ready diagrams with validation and best practices

### 1.3 Inspiration & Reference

| Source | Inspiration |
|--------|-------------|
| **VS Code IDE** | Six-zone layout: Activity Bar, Primary/Secondary Sidebars, Editor Area, Panel, Status Bar |
| **Cursor AI** | Agent mode dropdown, inline AI (Cmd+K), multi-model support, diff view, context awareness |
| **Windsurf/Antigravity** | Multi-step flows, terminal integration, autonomous task completion |

### 1.4 Agent Mode Selection

The AI Chat Panel includes a mode dropdown (similar to Cursor) enabling architects to control AI behavior:

| Mode | Purpose | Output |
|------|---------|--------|
| **Auto** (default) | AI determines best mode from prompt | Varies based on intent |
| **Question** | Q&A, explanations, documentation lookup | Conversational response in chat |
| **Strategize** | Architecture plans, design decisions, ADRs | Structured plan with steps & tradeoffs |
| **Execute** | Make canvas changes with approval | Canvas modifications + diff view |
| **Scenarios** | Generate pattern-based alternatives | 2-4 option cards with pros/cons |

**Mode + Specialist:** Users can combine modes with specialized agents (e.g., 'Scenarios + @CloudArch' for cloud architecture alternatives).

### 1.5 Business Value

| Metric | Current State | With Design IDE |
|--------|---------------|-----------------|
| Time to First Diagram | 30-60 minutes | Under 5 minutes with AI |
| Validation Errors | Found in review | Real-time prevention |
| Best Practice Adoption | Manual research | AI-suggested patterns |
| Architecture Options | Single approach | Multiple scenarios to compare |

---

## 2. Release Phases Overview

Requirements are organized into three delivery phases, enabling incremental value delivery.

### 2.1 Phase Summary

| Phase | Name | Focus | EPICs |
|-------|------|-------|-------|
| Phase 1 | Foundation (MVP) | Core IDE, canvas, elements, basic AI | IDE-01, IDE-02, IDE-03 |
| Phase 2 | Intelligence | AI chat, mode selection, inline AI, validation | IDE-04 (basic), IDE-05 |
| Phase 3 | Expertise | Execute mode, Scenarios, specialized architects | IDE-04 (advanced) |

### 2.2 Phase 1: Foundation (MVP)

Delivers a functional, professional Design IDE with core modeling capabilities.

**Success Criteria:** The user can launch the IDE, create models using drag-and-drop, connect elements, and export diagrams.

### 2.3 Phase 2: Intelligence

Elevates the experience with AI chat, Agent Mode Selection (Auto, Question, Strategize), inline AI, and validation.

**Success Criteria:** AI responds to context, mode dropdown works, generates elements from prompts, and validates in real-time.

### 2.4 Phase 3: Expertise

Completes the AI vision with Execute mode (diff view), Scenarios mode (pattern options), and specialized architect agents.

**Success Criteria:** Execute mode shows diff before applying, Scenarios present 2-4 alternatives, specialized agents provide domain expertise.

---

## 3. EPIC & Feature Definitions

### 3.1 EPIC Overview

| EPIC ID | Name | Description | Stories | Points |
|---------|------|-------------|---------|--------|
| EPIC-IDE-01 | Core IDE Framework | Layout, navigation, tabs, commands | 6 | 39 |
| EPIC-IDE-02 | Modeling Canvas Engine | Infinite canvas, elements, connections | 9 | 59 |
| EPIC-IDE-03 | Element Library | 200+ elements, search, favorites | 3 | 16 |
| EPIC-IDE-04 | AI Modeling Agents | Mode selection, chat, specialists, scenarios | 16 | 112 |
| EPIC-IDE-05 | Validation & Quality | Real-time validation, problems panel | 3 | 21 |
| **TOTAL** | | | **37** | **247** |

### 3.2 EPIC-IDE-01: Core IDE Framework

| Feature ID | Feature Name | Description |
|------------|--------------|-------------|
| FTR-IDE-001 | IDE Layout & Navigation | Six-zone layout with Activity Bar, Sidebars, Editor, Panel, Status Bar |
| FTR-IDE-002 | Multi-Tab Model Editor | Tabbed interface for multiple models, split view, tab management |
| FTR-IDE-003 | Command Palette | Cmd/Ctrl+K command interface for all operations |
| FTR-IDE-004 | Keyboard Shortcuts | Comprehensive keyboard navigation matching VS Code |
| FTR-IDE-005 | Theme & Customization | Light/Dark themes, panel resizing, layout persistence |

### 3.3 EPIC-IDE-02: Modeling Canvas Engine

| Feature ID | Feature Name | Description |
|------------|--------------|-------------|
| FTR-CVS-001 | Infinite Canvas | Pan, zoom 10-400%, minimap, grid snapping, smart guides |
| FTR-CVS-002 | Element Manipulation | Drag-drop, resize, rotate, align, distribute |
| FTR-CVS-003 | Connection System | Smart routing, anchor points, relationship types |
| FTR-CVS-004 | Multi-Selection & Actions | Box select, Shift+click, bulk operations |
| FTR-CVS-005 | Undo/Redo & History | 100+ operation history, branching undo |
| FTR-CVS-006 | Export & Sharing | PNG, SVG, PDF export, link sharing |

### 3.4 EPIC-IDE-03: Element Library

| Feature ID | Feature Name | Description |
|------------|--------------|-------------|
| FTR-PAL-001 | Element Palette | 200+ elements: ArchiMate, AWS, Azure, GCP, Generic |
| FTR-PAL-002 | Search & Filter | Real-time search, category filters, tag-based discovery |
| FTR-PAL-005 | Favorites & Recents | Pin frequently used elements, quick access |

### 3.5 EPIC-IDE-04: AI Modeling Agents

*Updated in v1.1: Added Agent Mode Selection with Question, Strategize, Execute, and Scenarios modes.*

| Feature ID | Feature Name | Description |
|------------|--------------|-------------|
| FTR-AGT-001 | AI Chat Panel | Persistent chat with model context, history, mode dropdown |
| FTR-AGT-002 | Inline AI Suggestions | Cmd+K inline prompts for quick generation |
| FTR-AGT-003 | Agent Mode Selection | Dropdown: Auto, Question, Strategize, Execute, Scenarios |
| FTR-AGT-004 | Specialized Architect Agents | @SecurityArch, @DataArch, @CloudArch, @InfraArch, @IntegrationArch |
| FTR-AGT-005 | Execute Mode & Diff View | Canvas modifications with visual diff and approval workflow |
| FTR-AGT-006 | Scenarios Mode | Pattern-based alternatives from multiple sources |
| FTR-AGT-007 | Context Awareness | Agent understands canvas, selection, history, project context |

### 3.6 EPIC-IDE-05: Validation & Quality

| Feature ID | Feature Name | Description |
|------------|--------------|-------------|
| FTR-VAL-001 | Real-time Validation | Continuous checking of relationships, naming, properties |
| FTR-VAL-002 | Problems Panel | VS Code-style panel showing errors, warnings, info |
| FTR-VAL-004 | Quick Fixes | One-click corrections with AI suggestions |

---

## 4. High-Level Requirements

HLRs define testable requirements mapped to User Stories. Detailed Gherkin specifications are in Section 5.

### 4.1 EPIC-IDE-01: Core IDE Framework

| HLR ID | Requirement | Priority | Story |
|--------|-------------|----------|-------|
| HLR-IDE-001 | IDE shall launch within 2 seconds when clicking '+New Model' | Must | US-IDE-001 |
| HLR-IDE-002 | IDE shall display six-zone layout (Activity Bar, Sidebars, Editor, Panel, Status) | Must | US-IDE-001 |
| HLR-IDE-003 | Activity Bar shall display icons: Explorer, Search, Agents, Views, Settings | Must | US-IDE-002 |
| HLR-IDE-004 | Clicking Activity Bar icon shall highlight with accent bar and open panel | Must | US-IDE-002 |
| HLR-IDE-005 | Sidebars shall be resizable by dragging edges (180px-400px) | Must | US-IDE-003 |
| HLR-IDE-010 | Editor Area shall support multiple model tabs | Must | US-IDE-004 |
| HLR-IDE-011 | Tabs shall show unsaved indicator (dot) for modified models | Must | US-IDE-004 |
| HLR-IDE-020 | Command Palette shall be accessible via Cmd/Ctrl+K | Must | US-IDE-005 |
| HLR-IDE-021 | Command Palette shall support fuzzy search matching | Should | US-IDE-005 |
| HLR-IDE-022 | Commands shall be organized by category (File, Edit, View, AI) | Should | US-IDE-005 |
| HLR-IDE-030 | IDE shall support Light, Dark, and System themes | Should | US-IDE-006 |

### 4.2 EPIC-IDE-02: Modeling Canvas Engine

| HLR ID | Requirement | Priority | Story |
|--------|-------------|----------|-------|
| HLR-CVS-001 | Canvas shall support smooth panning at 60fps minimum | Must | US-CVS-001 |
| HLR-CVS-002 | Canvas shall support zoom levels from 10% to 400% | Must | US-CVS-001 |
| HLR-CVS-003 | Zoom shall center on cursor position (Ctrl/Cmd+scroll) | Must | US-CVS-001 |
| HLR-CVS-004 | Elements shall snap to configurable grid (5px, 10px, 20px) | Must | US-CVS-002 |
| HLR-CVS-005 | Grid visibility shall be toggleable (Cmd+G) | Should | US-CVS-002 |
| HLR-CVS-006 | Smart alignment guides shall appear when elements align | Should | US-CVS-003 |
| HLR-CVS-010 | Elements shall be draggable from palette to canvas | Must | US-CVS-004 |
| HLR-CVS-011 | Dropped elements shall be auto-selected with Properties visible | Should | US-CVS-004 |
| HLR-CVS-012 | Elements shall support resize via corner and edge handles | Must | US-CVS-005 |
| HLR-CVS-013 | Rotation handle shall rotate element; Shift snaps to 15 degrees | Should | US-CVS-005 |
| HLR-CVS-020 | Connections shall use anchor points (top, right, bottom, left) | Must | US-CVS-006 |
| HLR-CVS-021 | Connections shall auto-route around other elements | Should | US-CVS-006 |
| HLR-CVS-022 | Connections shall support arrow heads (start, end, both, none) | Must | US-CVS-006 |
| HLR-CVS-030 | Undo/Redo shall support at least 100 operations | Must | US-CVS-007 |
| HLR-CVS-031 | Rapid consecutive actions shall be grouped for undo | Should | US-CVS-007 |
| HLR-CVS-040 | Marquee selection shall select all elements within box | Must | US-CVS-008 |
| HLR-CVS-041 | Multi-selection shall support move, delete, align, distribute | Must | US-CVS-008 |
| HLR-CVS-050 | Export shall support PNG (1x/2x/3x), SVG, PDF formats | Must | US-CVS-009 |
| HLR-CVS-051 | Export shall allow selection-only or entire canvas | Should | US-CVS-009 |

### 4.3 EPIC-IDE-03: Element Library

| HLR ID | Requirement | Priority | Story |
|--------|-------------|----------|-------|
| HLR-PAL-001 | Palette shall display 200+ elements (AWS, Azure, GCP, ArchiMate, Generic) | Must | US-PAL-001 |
| HLR-PAL-002 | Categories shall be collapsible with elements as icon grid | Must | US-PAL-001 |
| HLR-PAL-010 | Search shall filter elements in real-time (150ms debounce) | Must | US-PAL-002 |
| HLR-PAL-011 | Search shall support fuzzy matching and tag-based discovery | Should | US-PAL-002 |
| HLR-PAL-020 | Favorites section shall display starred elements (max 12) | Should | US-PAL-003 |
| HLR-PAL-021 | Recents section shall show last 8 used elements | Should | US-PAL-003 |

### 4.4 EPIC-IDE-04: AI Modeling Agents

*Updated in v1.1: Added HLRs for Agent Mode Selection (HLR-AGT-060 through HLR-AGT-072).*

| HLR ID | Requirement | Priority | Story |
|--------|-------------|----------|-------|
| HLR-AGT-001 | AI Chat Panel shall be accessible in Secondary Sidebar | Must | US-AGT-001 |
| HLR-AGT-002 | Chat shall show message history, input field, model indicator | Must | US-AGT-001 |
| HLR-AGT-010 | AI shall understand current canvas elements and relationships | Must | US-AGT-002 |
| HLR-AGT-011 | AI shall describe architecture when asked 'What do you see?' | Must | US-AGT-002 |
| HLR-AGT-012 | AI shall focus on selected elements when answering | Must | US-AGT-003 |
| HLR-AGT-013 | AI shall reference elements by name in responses | Should | US-AGT-003 |
| HLR-AGT-020 | Inline AI shall be invocable via Cmd/Ctrl+K on canvas | Must | US-AGT-004 |
| HLR-AGT-021 | Inline prompt shall show context indicator and recent commands | Should | US-AGT-004 |
| HLR-AGT-022 | AI shall generate elements from natural language descriptions | Must | US-AGT-005 |
| HLR-AGT-023 | Generated elements shall be positioned logically with connections | Must | US-AGT-005 |
| HLR-AGT-024 | AI shall explain selected components with patterns and considerations | Should | US-AGT-006 |

#### Agent Mode Selection (NEW in v1.1)

| HLR ID | Requirement | Priority | Story |
|--------|-------------|----------|-------|
| HLR-AGT-060 | AI Chat Panel shall include Agent Mode dropdown selector | Must | US-AGT-014 |
| HLR-AGT-061 | Dropdown options: Auto (default), Question, Strategize, Execute, Scenarios | Must | US-AGT-014 |
| HLR-AGT-062 | Selected mode shall persist during session and show indicator | Should | US-AGT-014 |
| HLR-AGT-063 | Auto mode shall analyze prompt and route to appropriate mode | Must | US-AGT-015 |
| HLR-AGT-064 | Auto mode shall display 'Routed to [Mode]' indicator in response | Should | US-AGT-015 |
| HLR-AGT-065 | Question mode shall provide conversational responses without canvas changes | Must | US-AGT-015 |
| HLR-AGT-066 | Strategize mode shall output structured plans with steps and tradeoffs | Must | US-AGT-015 |
| HLR-AGT-067 | Execute mode shall show diff view before applying canvas changes | Must | US-AGT-008, US-AGT-009 |
| HLR-AGT-068 | Execute mode shall allow Accept All, Reject All, or individual selection | Must | US-AGT-009 |
| HLR-AGT-070 | Scenarios mode shall generate 2-4 alternative architecture options | Must | US-AGT-016 |
| HLR-AGT-071 | Each scenario shall include pattern name, description, and pros/cons | Must | US-AGT-016 |
| HLR-AGT-072 | Scenarios shall source from built-in patterns, user models, and web search | Should | US-AGT-016 |
| HLR-AGT-073 | User shall select a scenario to apply or request more options | Should | US-AGT-016 |

#### Specialized Architect Agents

| HLR ID | Requirement | Priority | Story |
|--------|-------------|----------|-------|
| HLR-AGT-040 | Security Architect agent shall be invocable via @SecurityArch | Must | US-AGT-010 |
| HLR-AGT-041 | Security Agent shall focus on threats, compliance, best practices | Must | US-AGT-010 |
| HLR-AGT-042 | Data Architect agent shall be invocable via @DataArch | Must | US-AGT-011 |
| HLR-AGT-043 | Data Agent shall focus on schema, storage, governance | Must | US-AGT-011 |
| HLR-AGT-044 | Cloud Architect agent shall be invocable via @CloudArch | Must | US-AGT-012 |
| HLR-AGT-045 | Cloud Agent shall detect provider and tailor recommendations | Should | US-AGT-012 |
| HLR-AGT-050 | System shall auto-route prompts to appropriate specialized agent | Should | US-AGT-013 |
| HLR-AGT-051 | User shall be able to redirect: 'Ask @DataArch instead' | Should | US-AGT-013 |

### 4.5 EPIC-IDE-05: Validation & Quality

| HLR ID | Requirement | Priority | Story |
|--------|-------------|----------|-------|
| HLR-VAL-001 | Validation shall run continuously on element/connection changes | Must | US-VAL-001 |
| HLR-VAL-002 | Validation shall check connections, naming, properties, patterns | Must | US-VAL-001 |
| HLR-VAL-003 | Validation shall be debounced at 500ms for performance | Should | US-VAL-001 |
| HLR-VAL-010 | Problems Panel shall show issues with severity (Error/Warning/Info) | Must | US-VAL-002 |
| HLR-VAL-011 | Clicking issue shall select and zoom to affected element | Must | US-VAL-002 |
| HLR-VAL-020 | Quick Fix lightbulb shall appear for issues with available fixes | Should | US-VAL-003 |
| HLR-VAL-021 | Quick fixes shall be undoable; AI suggestions marked with sparkle | Should | US-VAL-003 |

---

## 5. User Stories with Gherkin Specifications

User stories are sized for 10-day sprints using the Fibonacci scale (3, 5, 8, 10 points).

| Points | Complexity | Duration | Count |
|--------|------------|----------|-------|
| 3 | Small, well-understood | 1-2 days | 3 stories (8%) |
| 5 | Medium complexity | 3-4 days | 13 stories (35%) |
| 8 | Larger feature | 5-7 days | 15 stories (41%) |
| 10 | Full sprint feature | 8-10 days | 6 stories (16%) |

---

### 5.1 EPIC-IDE-01: Core IDE Framework

**6 stories | 39 points | Features: Layout, Tabs, Command Palette, Themes**

#### US-IDE-001: Six-Zone IDE Layout Shell

| Field | Value |
|-------|-------|
| **Story ID** | US-IDE-001 |
| **Title** | Six-Zone IDE Layout Shell |
| **Epic** | EPIC-IDE-01: Core IDE Framework |
| **Feature** | FTR-IDE-001: IDE Layout & Navigation |
| **Story Points** | 8 |
| **Priority** | High |
| **Labels** | design-ide, layout, foundation, mvp |
| **HLR Trace** | HLR-IDE-001, HLR-IDE-002 |

**Description:** As a technology architect, I want the Design IDE to display a six-zone layout when I click '+New Model' so that I have a familiar, VS Code-style workspace for modeling.

**Acceptance Criteria:**

```gherkin
GIVEN I am on the Design Studio Home page
WHEN I click the '+New Model' button
THEN the Design IDE should launch within 2 seconds
AND display six distinct zones:
  | Zone              | Location           | Initial State     |
  | Activity Bar      | Left edge (48px)   | Visible           |
  | Primary Sidebar   | Left (240px)       | Visible           |
  | Editor Area       | Center             | Visible, empty canvas |
  | Secondary Sidebar | Right (280px)      | Collapsed         |
  | Panel Area        | Bottom (150px)     | Collapsed         |
  | Status Bar        | Bottom edge (30px) | Visible           |
AND the layout should be responsive to window resizing
```

---

#### US-IDE-002: Activity Bar Navigation

| Field | Value |
|-------|-------|
| **Story ID** | US-IDE-002 |
| **Title** | Activity Bar Navigation |
| **Epic** | EPIC-IDE-01: Core IDE Framework |
| **Feature** | FTR-IDE-001: IDE Layout & Navigation |
| **Story Points** | 5 |
| **Priority** | High |
| **Labels** | design-ide, navigation, activity-bar, foundation |
| **HLR Trace** | HLR-IDE-003, HLR-IDE-004 |

**Description:** As a technology architect, I want to navigate between IDE views using the Activity Bar so that I can quickly switch contexts without losing my place.

**Acceptance Criteria:**

```gherkin
GIVEN I am in the Design IDE
WHEN I view the Activity Bar
THEN I should see icons for:
  | Icon     | View           | Tooltip       |
  | Explorer | Model Explorer | Cmd+Shift+E   |
  | Search   | Search Elements| Cmd+Shift+F   |
  | Agents   | AI Agents      | Cmd+Shift+A   |
  | Views    | Diagram Views  |               |
  | Settings | IDE Settings   |               |
AND clicking an icon should highlight it with an accent bar
AND open the corresponding panel in the Primary Sidebar
```

---

#### US-IDE-003: Resizable Sidebar Panels

| Field | Value |
|-------|-------|
| **Story ID** | US-IDE-003 |
| **Title** | Resizable Sidebar Panels |
| **Epic** | EPIC-IDE-01: Core IDE Framework |
| **Feature** | FTR-IDE-001: IDE Layout & Navigation |
| **Story Points** | 5 |
| **Priority** | Medium |
| **Labels** | design-ide, layout, resize, foundation |
| **HLR Trace** | HLR-IDE-005 |

**Description:** As a technology architect, I want to resize sidebar panels by dragging their edges so that I can customize my workspace for different tasks.

**Acceptance Criteria:**

```gherkin
GIVEN I am in the Design IDE
WHEN I hover over the edge between Primary Sidebar and Editor Area
THEN my cursor should change to a resize cursor
AND I should be able to drag to resize between 180px and 400px
AND the Editor Area should adjust accordingly
AND my size preference should persist across sessions
```

---

#### US-IDE-004: Multi-Tab Model Editor

| Field | Value |
|-------|-------|
| **Story ID** | US-IDE-004 |
| **Title** | Multi-Tab Model Editor |
| **Epic** | EPIC-IDE-01: Core IDE Framework |
| **Feature** | FTR-IDE-002: Multi-Tab Model Editor |
| **Story Points** | 8 |
| **Priority** | High |
| **Labels** | design-ide, tabs, editor, foundation |
| **HLR Trace** | HLR-IDE-010, HLR-IDE-011 |

**Description:** As a technology architect, I want to open multiple models in tabs so that I can work on related diagrams simultaneously without losing context.

**Acceptance Criteria:**

```gherkin
GIVEN I have a model open in the Editor Area
WHEN I open another model from the Explorer
THEN it should open in a new tab
AND the tab bar should show both model names with icons
AND I should be able to:
  - Switch tabs by clicking
  - Close tabs with the x button
  - Reorder tabs by dragging
  - See unsaved indicators (dot) on modified tabs
AND Cmd+W should close the active tab
```

---

#### US-IDE-005: Command Palette Core

| Field | Value |
|-------|-------|
| **Story ID** | US-IDE-005 |
| **Title** | Command Palette Core |
| **Epic** | EPIC-IDE-01: Core IDE Framework |
| **Feature** | FTR-IDE-003: Command Palette |
| **Story Points** | 8 |
| **Priority** | High |
| **Labels** | design-ide, command-palette, keyboard, foundation |
| **HLR Trace** | HLR-IDE-020, HLR-IDE-021, HLR-IDE-022 |

**Description:** As a technology architect, I want to access all IDE commands through a searchable palette so that I can quickly execute actions without navigating menus.

**Acceptance Criteria:**

```gherkin
GIVEN I am in the Design IDE
WHEN I press Cmd+K (Mac) or Ctrl+K (Windows)
THEN a Command Palette should appear centered at top of Editor Area
AND I should see a search input with placeholder 'Type a command...'
AND typing should filter available commands with fuzzy matching
AND I should see commands organized by category:
  | Category | Example Commands        |
  | File     | Save, Export, Close     |
  | Edit     | Undo, Redo, Copy, Paste |
  | View     | Zoom In, Zoom Out, Toggle Grid |
  | AI       | Ask AI, Generate Diagram |
AND pressing Enter should execute the selected command
AND pressing Escape should close the palette
```

---

#### US-IDE-006: Theme Switching

| Field | Value |
|-------|-------|
| **Story ID** | US-IDE-006 |
| **Title** | Theme Switching |
| **Epic** | EPIC-IDE-01: Core IDE Framework |
| **Feature** | FTR-IDE-005: Theme & Customization |
| **Story Points** | 5 |
| **Priority** | Low |
| **Labels** | design-ide, themes, customization, foundation |
| **HLR Trace** | HLR-IDE-030 |

**Description:** As a technology architect, I want to switch between light and dark themes so that I can work comfortably in different lighting conditions.

**Acceptance Criteria:**

```gherkin
GIVEN I am in the Design IDE
WHEN I open Settings > Appearance
THEN I should see theme options:
  | Theme  | Description              |
  | Light  | Light backgrounds, dark text |
  | Dark   | Dark backgrounds, light text |
  | System | Follow OS preference     |
AND selecting a theme should apply immediately
AND my preference should persist across sessions
AND the canvas grid should adapt to the theme
```

---

### 5.2 EPIC-IDE-02: Modeling Canvas Engine

**9 stories | 59 points | Features: Canvas, Elements, Connections, History, Export**

#### US-CVS-001: Infinite Canvas Pan and Zoom

| Field | Value |
|-------|-------|
| **Story ID** | US-CVS-001 |
| **Title** | Infinite Canvas Pan and Zoom |
| **Epic** | EPIC-IDE-02: Modeling Canvas Engine |
| **Feature** | FTR-CVS-001: Infinite Canvas |
| **Story Points** | 8 |
| **Priority** | High |
| **Labels** | design-ide, canvas, pan, zoom, foundation |
| **HLR Trace** | HLR-CVS-001, HLR-CVS-002, HLR-CVS-003 |

**Description:** As a technology architect, I want to pan and zoom on an infinite canvas so that I can navigate large architecture diagrams smoothly.

**Acceptance Criteria:**

```gherkin
GIVEN I am on the modeling canvas
WHEN I hold Space and drag with the mouse
THEN the canvas should pan smoothly at 60fps minimum
AND when I release Space, I return to select mode

WHEN I hold Ctrl/Cmd and scroll the mouse wheel
THEN the canvas should zoom in/out centered on cursor position
AND zoom range should be 10% to 400%
AND zoom level should display in the Status Bar
AND Cmd+0 should reset to 100% zoom
```

---

#### US-CVS-002: Grid and Snap System

| Field | Value |
|-------|-------|
| **Story ID** | US-CVS-002 |
| **Title** | Grid and Snap System |
| **Epic** | EPIC-IDE-02: Modeling Canvas Engine |
| **Feature** | FTR-CVS-001: Infinite Canvas |
| **Story Points** | 5 |
| **Priority** | High |
| **Labels** | design-ide, canvas, grid, snap, foundation |
| **HLR Trace** | HLR-CVS-004, HLR-CVS-005 |

**Description:** As a technology architect, I want elements to snap to a grid so that I can create well-aligned, professional diagrams.

**Acceptance Criteria:**

```gherkin
GIVEN I am on the modeling canvas
WHEN grid snapping is enabled (default)
THEN dragged elements should snap to 10px grid intersections
AND a subtle grid should be visible on the canvas
AND I should be able to toggle grid visibility with Cmd+G
AND I should be able to toggle snapping with Cmd+Shift+G
AND grid size should be configurable: 5px, 10px, 20px
```

---

#### US-CVS-003: Smart Alignment Guides

| Field | Value |
|-------|-------|
| **Story ID** | US-CVS-003 |
| **Title** | Smart Alignment Guides |
| **Epic** | EPIC-IDE-02: Modeling Canvas Engine |
| **Feature** | FTR-CVS-001: Infinite Canvas |
| **Story Points** | 5 |
| **Priority** | Medium |
| **Labels** | design-ide, canvas, alignment, guides, foundation |
| **HLR Trace** | HLR-CVS-006 |

**Description:** As a technology architect, I want smart alignment guides to appear when moving elements so that I can easily align components with each other.

**Acceptance Criteria:**

```gherkin
GIVEN I have multiple elements on the canvas
WHEN I drag an element near another element
THEN alignment guides should appear showing:
  | Alignment Type    | Visual                   |
  | Center horizontal | Blue horizontal line     |
  | Center vertical   | Blue vertical line       |
  | Top edge          | Magenta line at top      |
  | Bottom edge       | Magenta line at bottom   |
  | Left edge         | Magenta line at left     |
  | Right edge        | Magenta line at right    |
AND the dragged element should snap to the guide position
AND guides should disappear when I release the element
```

---

#### US-CVS-004: Element Drag and Drop

| Field | Value |
|-------|-------|
| **Story ID** | US-CVS-004 |
| **Title** | Element Drag and Drop |
| **Epic** | EPIC-IDE-02: Modeling Canvas Engine |
| **Feature** | FTR-CVS-002: Element Manipulation |
| **Story Points** | 8 |
| **Priority** | High |
| **Labels** | design-ide, canvas, drag-drop, elements, foundation |
| **HLR Trace** | HLR-CVS-010, HLR-CVS-011 |

**Description:** As a technology architect, I want to drag elements from the palette onto the canvas so that I can quickly build diagrams.

**Acceptance Criteria:**

```gherkin
GIVEN I am viewing the Element Palette
WHEN I drag an element (e.g., AWS Lambda icon) from the palette
THEN a ghost preview should follow my cursor
AND when I drop it on the canvas
THEN the element should be created at the drop position
AND the element should be automatically selected
AND the Properties panel should show element details
AND I should be able to undo with Cmd+Z
```

---

#### US-CVS-005: Element Resize and Rotate

| Field | Value |
|-------|-------|
| **Story ID** | US-CVS-005 |
| **Title** | Element Resize and Rotate |
| **Epic** | EPIC-IDE-02: Modeling Canvas Engine |
| **Feature** | FTR-CVS-002: Element Manipulation |
| **Story Points** | 5 |
| **Priority** | High |
| **Labels** | design-ide, canvas, resize, rotate, foundation |
| **HLR Trace** | HLR-CVS-012, HLR-CVS-013 |

**Description:** As a technology architect, I want to resize and rotate elements so that I can customize their appearance for my diagrams.

**Acceptance Criteria:**

```gherkin
GIVEN I have selected an element on the canvas
THEN I should see resize handles at corners and edges
AND I should see a rotation handle above the element

WHEN I drag a corner handle
THEN the element should resize proportionally
AND when I hold Shift while dragging
THEN the aspect ratio should be maintained

WHEN I drag the rotation handle
THEN the element should rotate around its center
AND holding Shift should snap to 15 degree increments
```

---

#### US-CVS-006: Connection Creation

| Field | Value |
|-------|-------|
| **Story ID** | US-CVS-006 |
| **Title** | Connection Creation |
| **Epic** | EPIC-IDE-02: Modeling Canvas Engine |
| **Feature** | FTR-CVS-003: Connection System |
| **Story Points** | 10 |
| **Priority** | High |
| **Labels** | design-ide, canvas, connections, foundation |
| **HLR Trace** | HLR-CVS-020, HLR-CVS-021, HLR-CVS-022 |

**Description:** As a technology architect, I want to create connections between elements so that I can show relationships and data flows.

**Acceptance Criteria:**

```gherkin
GIVEN I have elements on the canvas
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
  - Be selectable and deletable
```

---

#### US-CVS-007: Undo/Redo System

| Field | Value |
|-------|-------|
| **Story ID** | US-CVS-007 |
| **Title** | Undo/Redo System |
| **Epic** | EPIC-IDE-02: Modeling Canvas Engine |
| **Feature** | FTR-CVS-005: Undo/Redo & History |
| **Story Points** | 8 |
| **Priority** | High |
| **Labels** | design-ide, canvas, undo, redo, history, foundation |
| **HLR Trace** | HLR-CVS-030, HLR-CVS-031 |

**Description:** As a technology architect, I want to undo and redo my actions so that I can safely experiment and recover from mistakes.

**Acceptance Criteria:**

```gherkin
GIVEN I have made changes to a model
WHEN I press Cmd+Z
THEN the last action should be undone
AND the action should be added to the redo stack

WHEN I press Cmd+Shift+Z
THEN the last undone action should be redone
AND the system should:
  - Support at least 100 operations in history
  - Group rapid consecutive actions (e.g., typing)
  - Show undo/redo state in Edit menu
  - Clear redo stack when new action is performed
```

---

#### US-CVS-008: Multi-Selection Operations

| Field | Value |
|-------|-------|
| **Story ID** | US-CVS-008 |
| **Title** | Multi-Selection Operations |
| **Epic** | EPIC-IDE-02: Modeling Canvas Engine |
| **Feature** | FTR-CVS-004: Multi-Selection & Actions |
| **Story Points** | 5 |
| **Priority** | High |
| **Labels** | design-ide, canvas, selection, bulk, foundation |
| **HLR Trace** | HLR-CVS-040, HLR-CVS-041 |

**Description:** As a technology architect, I want to select multiple elements and perform bulk operations so that I can efficiently organize my diagrams.

**Acceptance Criteria:**

```gherkin
GIVEN I am on the modeling canvas
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
  - Distribute them evenly (horizontal, vertical)
```

---

#### US-CVS-009: Export to PNG/SVG

| Field | Value |
|-------|-------|
| **Story ID** | US-CVS-009 |
| **Title** | Export to PNG/SVG |
| **Epic** | EPIC-IDE-02: Modeling Canvas Engine |
| **Feature** | FTR-CVS-006: Export & Sharing |
| **Story Points** | 5 |
| **Priority** | Medium |
| **Labels** | design-ide, canvas, export, png, svg, foundation |
| **HLR Trace** | HLR-CVS-050, HLR-CVS-051 |

**Description:** As a technology architect, I want to export my diagrams as images so that I can include them in presentations and documents.

**Acceptance Criteria:**

```gherkin
GIVEN I have a diagram on the canvas
WHEN I select File > Export or press Cmd+E
THEN I should see export options:
  | Format | Options                      |
  | PNG    | Resolution: 1x, 2x, 3x       |
  | SVG    | Include fonts: Yes/No        |
  | PDF    | Page size: A4, Letter, Auto  |
AND I should be able to:
  - Export entire canvas
  - Export only selected elements
  - Choose background: Transparent, White, Canvas color
AND the exported file should download to my device
```

---

### 5.3 EPIC-IDE-03: Element Library

**3 stories | 16 points | Features: Palette, Search, Favorites**

#### US-PAL-001: Element Palette Display

| Field | Value |
|-------|-------|
| **Story ID** | US-PAL-001 |
| **Title** | Element Palette Display |
| **Epic** | EPIC-IDE-03: Element Library |
| **Feature** | FTR-PAL-001: Element Palette |
| **Story Points** | 8 |
| **Priority** | High |
| **Labels** | design-ide, palette, elements, foundation |
| **HLR Trace** | HLR-PAL-001, HLR-PAL-002 |

**Description:** As a technology architect, I want a categorized element palette so that I can quickly find and add architecture components to my diagrams.

**Acceptance Criteria:**

```gherkin
GIVEN I am in the Design IDE
WHEN I click the Explorer icon in the Activity Bar
THEN I should see the Element Palette in the Primary Sidebar
AND elements should be organized by category:
  | Category  | Element Count |
  | AWS       | 50+ icons     |
  | Azure     | 50+ icons     |
  | GCP       | 50+ icons     |
  | ArchiMate | 60+ shapes    |
  | Generic   | 20+ shapes    |
AND each category should be collapsible
AND elements should display as a grid of icons with labels
```

---

#### US-PAL-002: Element Search

| Field | Value |
|-------|-------|
| **Story ID** | US-PAL-002 |
| **Title** | Element Search |
| **Epic** | EPIC-IDE-03: Element Library |
| **Feature** | FTR-PAL-002: Search & Filter |
| **Story Points** | 5 |
| **Priority** | High |
| **Labels** | design-ide, palette, search, filter, foundation |
| **HLR Trace** | HLR-PAL-010, HLR-PAL-011 |

**Description:** As a technology architect, I want to search for elements by name or tag so that I can quickly find specific components.

**Acceptance Criteria:**

```gherkin
GIVEN I am viewing the Element Palette
WHEN I type in the search box
THEN results should filter in real-time (debounced 150ms)
AND matching should include:
  - Element name (e.g., 'Lambda' -> AWS Lambda)
  - Tags (e.g., 'compute' -> EC2, Lambda, ECS)
  - Category (e.g., 'aws' -> all AWS elements)
AND search should support fuzzy matching ('lmbd' -> Lambda)
AND results should highlight matching characters
AND pressing Escape should clear the search
```

---

#### US-PAL-003: Favorites and Recents

| Field | Value |
|-------|-------|
| **Story ID** | US-PAL-003 |
| **Title** | Favorites and Recents |
| **Epic** | EPIC-IDE-03: Element Library |
| **Feature** | FTR-PAL-005: Favorites & Recents |
| **Story Points** | 3 |
| **Priority** | Medium |
| **Labels** | design-ide, palette, favorites, recents, intelligence |
| **HLR Trace** | HLR-PAL-020, HLR-PAL-021 |

**Description:** As a technology architect, I want quick access to my favorite and recently used elements so that I can work faster.

**Acceptance Criteria:**

```gherkin
GIVEN I am viewing the Element Palette
THEN I should see sections at the top:
  | Section   | Content                        |
  | Favorites | Elements I've starred (max 12) |
  | Recent    | Last 8 elements I've used      |

WHEN I right-click an element
THEN I should see 'Add to Favorites' option
AND favorites should persist across sessions
AND recently used elements should update automatically
AND I should be able to clear recent history
```

---

### 5.4 EPIC-IDE-04: AI Modeling Agents

**16 stories | 112 points | Features: Chat, Mode Selection, Inline AI, Execute, Scenarios, Specialists (Updated v1.1)**

#### US-AGT-001: AI Chat Panel UI

| Field | Value |
|-------|-------|
| **Story ID** | US-AGT-001 |
| **Title** | AI Chat Panel UI |
| **Epic** | EPIC-IDE-04: AI Modeling Agents |
| **Feature** | FTR-AGT-001: AI Chat Panel |
| **Story Points** | 5 |
| **Priority** | High |
| **Labels** | design-ide, ai, chat, ui, intelligence |
| **HLR Trace** | HLR-AGT-001, HLR-AGT-002 |

**Description:** As a technology architect, I want an AI chat panel in the Secondary Sidebar so that I can have conversations with the AI assistant.

**Acceptance Criteria:**

```gherkin
GIVEN I am in the Design IDE
WHEN I click the AI icon in the Activity Bar or press Cmd+Shift+A
THEN the Secondary Sidebar should open
AND display the AI Chat Panel with:
  - Header showing 'AI Assistant' and current model (Claude)
  - Agent Mode dropdown selector (see US-AGT-014)
  - Scrollable message history area
  - Message input field at bottom
  - Send button (or Enter to send)
AND messages should display with:
  - User messages aligned right
  - AI responses aligned left with avatar
  - Timestamps on hover
```

---

#### US-AGT-002: AI Context Awareness - Canvas State

| Field | Value |
|-------|-------|
| **Story ID** | US-AGT-002 |
| **Title** | AI Context Awareness - Canvas State |
| **Epic** | EPIC-IDE-04: AI Modeling Agents |
| **Feature** | FTR-AGT-007: Context Awareness |
| **Story Points** | 8 |
| **Priority** | High |
| **Labels** | design-ide, ai, context, canvas, intelligence |
| **HLR Trace** | HLR-AGT-010, HLR-AGT-011 |

**Description:** As a technology architect, I want the AI to understand my current canvas state so that its suggestions are relevant to my work.

**Acceptance Criteria:**

```gherkin
GIVEN I have an architecture diagram on the canvas
WHEN I ask the AI 'What do you see?'
THEN the AI should describe:
  - Elements present (e.g., 'I see an API Gateway connected to 3 Lambda functions')
  - Relationships between elements
  - Overall architecture pattern detected

GIVEN I have elements selected on the canvas
WHEN I ask 'How can I improve this?'
THEN the AI should focus its recommendations on the selected elements
AND reference them by name in its response
```

---

#### US-AGT-003: AI Context Awareness - Selection Focus

| Field | Value |
|-------|-------|
| **Story ID** | US-AGT-003 |
| **Title** | AI Context Awareness - Selection Focus |
| **Epic** | EPIC-IDE-04: AI Modeling Agents |
| **Feature** | FTR-AGT-007: Context Awareness |
| **Story Points** | 5 |
| **Priority** | High |
| **Labels** | design-ide, ai, context, selection, intelligence |
| **HLR Trace** | HLR-AGT-012, HLR-AGT-013 |

**Description:** As a technology architect, I want the AI to focus on my selected elements when I ask questions so that I get targeted advice.

**Acceptance Criteria:**

```gherkin
GIVEN I have selected an AWS Lambda element
WHEN I ask 'Add error handling'
THEN the AI should:
  - Recognize the selected Lambda
  - Suggest DLQ (Dead Letter Queue) addition
  - Propose CloudWatch alarms
  - Offer to add these elements to the canvas

GIVEN I have selected multiple elements
WHEN I ask 'Secure this section'
THEN the AI should analyze the selected group as a unit
AND provide security recommendations specific to those components
```

---

#### US-AGT-004: Inline AI Prompt (Cmd+K)

| Field | Value |
|-------|-------|
| **Story ID** | US-AGT-004 |
| **Title** | Inline AI Prompt (Cmd+K) |
| **Epic** | EPIC-IDE-04: AI Modeling Agents |
| **Feature** | FTR-AGT-002: Inline AI Suggestions |
| **Story Points** | 8 |
| **Priority** | High |
| **Labels** | design-ide, ai, inline, cmd-k, intelligence |
| **HLR Trace** | HLR-AGT-020, HLR-AGT-021 |

**Description:** As a technology architect, I want to invoke AI directly on the canvas with Cmd+K so that I can get quick assistance without leaving my workflow.

**Acceptance Criteria:**

```gherkin
GIVEN I am working on the canvas
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
THEN the inline prompt should close
```

---

#### US-AGT-005: AI Element Generation

| Field | Value |
|-------|-------|
| **Story ID** | US-AGT-005 |
| **Title** | AI Element Generation |
| **Epic** | EPIC-IDE-04: AI Modeling Agents |
| **Feature** | FTR-AGT-002: Inline AI Suggestions |
| **Story Points** | 10 |
| **Priority** | High |
| **Labels** | design-ide, ai, generation, elements, intelligence |
| **HLR Trace** | HLR-AGT-022, HLR-AGT-023 |

**Description:** As a technology architect, I want AI to generate elements from natural language so that I can quickly build diagrams by describing what I need.

**Acceptance Criteria:**

```gherkin
GIVEN I have invoked inline AI with Cmd+K
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
  - Insert it between with appropriate connections
```

---

#### US-AGT-006: AI Explain Selection

| Field | Value |
|-------|-------|
| **Story ID** | US-AGT-006 |
| **Title** | AI Explain Selection |
| **Epic** | EPIC-IDE-04: AI Modeling Agents |
| **Feature** | FTR-AGT-002: Inline AI Suggestions |
| **Story Points** | 5 |
| **Priority** | Medium |
| **Labels** | design-ide, ai, explain, documentation, intelligence |
| **HLR Trace** | HLR-AGT-024 |

**Description:** As a technology architect, I want AI to explain selected architecture components so that I can document and understand my designs.

**Acceptance Criteria:**

```gherkin
GIVEN I have selected elements on the canvas
WHEN I invoke Cmd+K and type 'Explain'
THEN the AI should provide in the chat panel:
  | Section        | Content                                    |
  | Overview       | What the selected components do together   |
  | Components     | Description of each element                |
  | Relationships  | How they connect and data flows            |
  | Patterns       | Architectural patterns detected            |
  | Considerations | Potential issues or improvements           |
AND the explanation should be formatted with headers
AND I should be able to copy the explanation as markdown
```

---

#### US-AGT-014: Agent Mode Dropdown

| Field | Value |
|-------|-------|
| **Story ID** | US-AGT-014 |
| **Title** | Agent Mode Dropdown |
| **Epic** | EPIC-IDE-04: AI Modeling Agents |
| **Feature** | FTR-AGT-003: Agent Mode Selection |
| **Story Points** | 5 |
| **Priority** | High |
| **Labels** | design-ide, ai, mode-selection, dropdown, intelligence |
| **HLR Trace** | HLR-AGT-060, HLR-AGT-061, HLR-AGT-062 |

**Description:** As a technology architect, I want to select an Agent Mode from a dropdown so that I can control how the AI responds to my requests.

**Acceptance Criteria:**

```gherkin
GIVEN I am in the AI Chat Panel
THEN I should see an Agent Mode dropdown in the header area
AND the dropdown should contain options:
  | Mode       | Icon          | Description                    |
  | Auto       | magic wand    | AI selects best mode (default) |
  | Question   | question mark | Q&A and explanations           |
  | Strategize | lightbulb     | Architecture plans and decisions |
  | Execute    | play          | Make canvas changes with approval |
  | Scenarios  | grid          | Generate alternative options   |

WHEN I select a mode
THEN the mode indicator should update
AND the placeholder text should reflect the mode:
  | Mode       | Placeholder                          |
  | Auto       | Ask anything...                      |
  | Question   | Ask a question...                    |
  | Strategize | Describe what you want to plan...    |
  | Execute    | Describe what to build...            |
  | Scenarios  | What options should I explore?       |
AND my selection should persist during the session
```

---

#### US-AGT-015: Auto Mode Routing

| Field | Value |
|-------|-------|
| **Story ID** | US-AGT-015 |
| **Title** | Auto Mode Routing |
| **Epic** | EPIC-IDE-04: AI Modeling Agents |
| **Feature** | FTR-AGT-003: Agent Mode Selection |
| **Story Points** | 8 |
| **Priority** | High |
| **Labels** | design-ide, ai, auto-mode, routing, intelligence |
| **HLR Trace** | HLR-AGT-063, HLR-AGT-064, HLR-AGT-065, HLR-AGT-066 |

**Description:** As a technology architect, I want Auto mode to intelligently route my prompts so that I get the right type of response without manually selecting modes.

**Acceptance Criteria:**

```gherkin
GIVEN Agent Mode is set to 'Auto' (default)
WHEN I submit a prompt
THEN the AI should analyze the intent and route to the appropriate mode:
  | Prompt Pattern                          | Routed To  |
  | 'What is...', 'Explain...', 'How does...' | Question   |
  | 'Plan...', 'Design...', 'Create strategy for...' | Strategize |
  | 'Add...', 'Build...', 'Connect...', 'Refactor...' | Execute    |
  | 'What are my options...', 'Show alternatives...' | Scenarios  |
AND the response should show 'Routed to [Mode]' indicator
AND I should be able to click to switch modes if needed

WHEN in Question mode
THEN responses should be conversational
AND should NOT modify the canvas

WHEN in Strategize mode
THEN responses should include:
  - Structured steps or phases
  - Considerations and tradeoffs
  - Optionally exportable as ADR or markdown
```

---

#### US-AGT-016: Scenarios Mode - Pattern Options

| Field | Value |
|-------|-------|
| **Story ID** | US-AGT-016 |
| **Title** | Scenarios Mode - Pattern Options |
| **Epic** | EPIC-IDE-04: AI Modeling Agents |
| **Feature** | FTR-AGT-006: Scenarios Mode |
| **Story Points** | 10 |
| **Priority** | High |
| **Labels** | design-ide, ai, scenarios, patterns, options, expertise |
| **HLR Trace** | HLR-AGT-070, HLR-AGT-071, HLR-AGT-072, HLR-AGT-073 |

**Description:** As a technology architect, I want Scenarios mode to generate multiple architecture alternatives so that I can compare options before committing to a design.

**Acceptance Criteria:**

```gherkin
GIVEN Agent Mode is set to 'Scenarios'
WHEN I submit 'What are my options for handling user authentication?'
THEN the AI should generate 2-4 alternative scenarios
AND each scenario should be displayed as a card:
  | Card Element   | Content                              |
  | Pattern Name   | e.g., 'Cognito with Social Login'    |
  | Visual Preview | Thumbnail of proposed architecture   |
  | Description    | 2-3 sentence summary                 |
  | Pros           | Bullet list of advantages            |
  | Cons           | Bullet list of disadvantages         |
  | Complexity     | Low / Medium / High indicator        |
  | Apply Button   | 'Apply This Option'                  |
AND scenarios should source from:
  - Built-in pattern library (AWS Well-Architected, Azure patterns)
  - User's previous models (if enabled)
  - Web search for current best practices

WHEN I click 'Apply This Option'
THEN the system should switch to Execute mode
AND show the diff view for the selected scenario

WHEN I click 'Show More Options'
THEN the AI should generate additional alternatives
```

---

#### US-AGT-007: Execute Mode Toggle

| Field | Value |
|-------|-------|
| **Story ID** | US-AGT-007 |
| **Title** | Execute Mode Toggle |
| **Epic** | EPIC-IDE-04: AI Modeling Agents |
| **Feature** | FTR-AGT-005: Execute Mode & Diff View |
| **Story Points** | 3 |
| **Priority** | Medium |
| **Labels** | design-ide, ai, execute-mode, toggle, expertise |
| **HLR Trace** | HLR-AGT-067 |

**Description:** As a technology architect, I want Execute mode to be available via the dropdown so that I can make canvas changes with approval workflow.

**Acceptance Criteria:**

```gherkin
GIVEN I select 'Execute' from the Agent Mode dropdown
THEN the mode indicator should show Execute is active
AND the placeholder should change to 'Describe what to build...'
AND any prompt I submit should:
  - Analyze the current architecture
  - Generate a plan for changes
  - Show proposed changes in diff view (see US-AGT-009)
AND Execute mode preferences should:
  - Remember state across sessions (per user preference)
  - Show a first-time explanation tooltip
```

---

#### US-AGT-008: Execute Mode Multi-Step Planning

| Field | Value |
|-------|-------|
| **Story ID** | US-AGT-008 |
| **Title** | Execute Mode Multi-Step Planning |
| **Epic** | EPIC-IDE-04: AI Modeling Agents |
| **Feature** | FTR-AGT-005: Execute Mode & Diff View |
| **Story Points** | 10 |
| **Priority** | Medium |
| **Labels** | design-ide, ai, execute-mode, planning, expertise |
| **HLR Trace** | HLR-AGT-067 |

**Description:** As a technology architect, I want Execute mode to show me its plan before executing so that I understand and approve what it will do.

**Acceptance Criteria:**

```gherkin
GIVEN Execute mode is selected
WHEN I submit 'Refactor this monolith to microservices'
THEN the Agent should:
  - Analyze the current architecture
  - Generate a multi-step plan
  - Display the plan in the chat:
    | Step | Action                    |
    | 1    | Identify bounded contexts |
    | 2    | Create service boundaries |
    | 3    | Add API Gateway           |
    | 4    | Create message queue      |
    | 5    | Update connections        |
  - Show 'Start' and 'Cancel' buttons

WHEN I click 'Start'
THEN the Agent should begin executing
AND show progress indicator for each step
AND pause at configurable checkpoints for approval
```

---

#### US-AGT-009: Execute Mode Diff View

| Field | Value |
|-------|-------|
| **Story ID** | US-AGT-009 |
| **Title** | Execute Mode Diff View |
| **Epic** | EPIC-IDE-04: AI Modeling Agents |
| **Feature** | FTR-AGT-005: Execute Mode & Diff View |
| **Story Points** | 10 |
| **Priority** | Medium |
| **Labels** | design-ide, ai, execute-mode, diff, expertise |
| **HLR Trace** | HLR-AGT-067, HLR-AGT-068 |

**Description:** As a technology architect, I want to see a diff view of Execute mode changes before applying them so that I can review and approve modifications.

**Acceptance Criteria:**

```gherkin
GIVEN Execute mode has completed its analysis
WHEN it proposes changes
THEN a Diff View overlay should appear showing:
  | Change Type       | Visual Indicator                |
  | New elements      | Green highlight + '+' badge     |
  | Removed elements  | Red strikethrough + '-' badge   |
  | Modified elements | Yellow outline + '~' badge      |
  | Moved elements    | Blue dashed line to new position |
AND I should see:
  - Summary: 'Adding 5 elements, removing 2, modifying 3'
  - 'Accept All' button (green)
  - 'Reject All' button (red)
  - Ability to click individual changes to accept/reject
```

---

#### US-AGT-010: Specialized Agent - Security Architect

| Field | Value |
|-------|-------|
| **Story ID** | US-AGT-010 |
| **Title** | Specialized Agent - Security Architect |
| **Epic** | EPIC-IDE-04: AI Modeling Agents |
| **Feature** | FTR-AGT-004: Specialized Architect Agents |
| **Story Points** | 8 |
| **Priority** | Medium |
| **Labels** | design-ide, ai, agents, security, specialized, expertise |
| **HLR Trace** | HLR-AGT-040, HLR-AGT-041 |

**Description:** As a technology architect, I want to invoke a Security Architect agent so that I get specialized security analysis and recommendations.

**Acceptance Criteria:**

```gherkin
GIVEN I am in the AI Chat Panel
WHEN I type '@SecurityArch' followed by my question
THEN the Security Architect agent should respond
AND responses should:
  - Display Security Architect avatar/icon
  - Show 'Answered by Security Architect'
  - Focus on security concerns:
    | Domain         | Examples                            |
    | Threat modeling| Attack vectors, vulnerabilities     |
    | Compliance     | OWASP, PCI-DSS, SOC2, HIPAA         |
    | Best practices | Zero trust, defense in depth        |
    | AWS Security   | IAM, WAF, Security Groups, KMS      |

WHEN I ask 'Review authentication flow'
THEN the agent should analyze auth-related elements
AND provide security-specific recommendations

NOTE: Specialists work with any Mode (e.g., 'Scenarios + @SecurityArch')
```

---

#### US-AGT-011: Specialized Agent - Data Architect

| Field | Value |
|-------|-------|
| **Story ID** | US-AGT-011 |
| **Title** | Specialized Agent - Data Architect |
| **Epic** | EPIC-IDE-04: AI Modeling Agents |
| **Feature** | FTR-AGT-004: Specialized Architect Agents |
| **Story Points** | 8 |
| **Priority** | Medium |
| **Labels** | design-ide, ai, agents, data, specialized, expertise |
| **HLR Trace** | HLR-AGT-042, HLR-AGT-043 |

**Description:** As a technology architect, I want to invoke a Data Architect agent so that I get specialized data modeling and governance advice.

**Acceptance Criteria:**

```gherkin
GIVEN I am in the AI Chat Panel
WHEN I type '@DataArch' followed by my question
THEN the Data Architect agent should respond
AND responses should focus on:
  | Domain          | Examples                                 |
  | Data modeling   | Schema design, normalization, relationships |
  | Storage selection | SQL vs NoSQL, data lakes, warehouses    |
  | Data governance | Lineage, quality, privacy, retention     |
  | Performance     | Indexing, partitioning, caching strategies |

WHEN I ask 'Best database for 10M daily transactions?'
THEN the agent should provide data-focused analysis
AND recommend appropriate storage solutions with reasoning
```

---

#### US-AGT-012: Specialized Agent - Cloud Architect

| Field | Value |
|-------|-------|
| **Story ID** | US-AGT-012 |
| **Title** | Specialized Agent - Cloud Architect |
| **Epic** | EPIC-IDE-04: AI Modeling Agents |
| **Feature** | FTR-AGT-004: Specialized Architect Agents |
| **Story Points** | 8 |
| **Priority** | Medium |
| **Labels** | design-ide, ai, agents, cloud, specialized, expertise |
| **HLR Trace** | HLR-AGT-044, HLR-AGT-045 |

**Description:** As a technology architect, I want to invoke a Cloud Architect agent so that I get specialized cloud infrastructure guidance.

**Acceptance Criteria:**

```gherkin
GIVEN I am in the AI Chat Panel
WHEN I type '@CloudArch' followed by my question
THEN the Cloud Architect agent should respond
AND responses should focus on:
  | Domain           | Examples                              |
  | AWS/Azure/GCP    | Service selection, best practices     |
  | Cost optimization| Right-sizing, reserved instances, spot |
  | Availability     | Multi-AZ, multi-region, failover      |
  | Scalability      | Auto-scaling, load balancing, CDN     |
  | Well-Architected | Security, reliability, performance, cost |
AND the agent should detect which cloud provider is in use
AND tailor recommendations accordingly
```

---

#### US-AGT-013: Agent Auto-Routing

| Field | Value |
|-------|-------|
| **Story ID** | US-AGT-013 |
| **Title** | Agent Auto-Routing |
| **Epic** | EPIC-IDE-04: AI Modeling Agents |
| **Feature** | FTR-AGT-004: Specialized Architect Agents |
| **Story Points** | 5 |
| **Priority** | Low |
| **Labels** | design-ide, ai, agents, routing, auto, expertise |
| **HLR Trace** | HLR-AGT-050, HLR-AGT-051 |

**Description:** As a technology architect, I want the AI to automatically route my questions to the appropriate specialized agent so that I get expert answers without knowing which agent to invoke.

**Acceptance Criteria:**

```gherkin
GIVEN I ask a question without specifying an agent
WHEN the question is domain-specific
THEN the system should auto-route:
  | Question Keywords                          | Routed To        |
  | security, threat, compliance, IAM          | @SecurityArch    |
  | database, schema, data model, storage      | @DataArch        |
  | AWS, Azure, cloud, scaling, availability   | @CloudArch       |
  | network, VPC, firewall, DNS, load balancer | @InfraArch       |
  | API, integration, messaging, events        | @IntegrationArch |
AND display 'Answered by [Agent Name]' in the response
AND allow user to redirect: 'Ask @DataArch instead'
```

---

### 5.5 EPIC-IDE-05: Validation & Quality

**3 stories | 21 points | Features: Validation Engine, Problems Panel, Quick Fixes**

#### US-VAL-001: Real-time Validation Engine

| Field | Value |
|-------|-------|
| **Story ID** | US-VAL-001 |
| **Title** | Real-time Validation Engine |
| **Epic** | EPIC-IDE-05: Validation & Quality |
| **Feature** | FTR-VAL-001: Real-time Validation |
| **Story Points** | 8 |
| **Priority** | High |
| **Labels** | design-ide, validation, real-time, quality, intelligence |
| **HLR Trace** | HLR-VAL-001, HLR-VAL-002, HLR-VAL-003 |

**Description:** As a technology architect, I want real-time validation of my diagrams so that I catch errors and maintain quality standards.

**Acceptance Criteria:**

```gherkin
GIVEN I am modeling on the canvas
THEN the validation engine should continuously check for:
  | Category     | Example Rules                 |
  | Connections  | Invalid relationship types    |
  | Naming       | Missing or duplicate names    |
  | Properties   | Required fields not set       |
  | Patterns     | Anti-patterns detected        |
  | Completeness | Orphaned elements, dead ends  |
AND validation should run:
  - On element creation
  - On element modification
  - On connection changes
  - Debounced at 500ms for performance
AND validation issues should appear:
  - As visual indicators on affected elements
  - In the Problems Panel
```

---

#### US-VAL-002: Problems Panel Display

| Field | Value |
|-------|-------|
| **Story ID** | US-VAL-002 |
| **Title** | Problems Panel Display |
| **Epic** | EPIC-IDE-05: Validation & Quality |
| **Feature** | FTR-VAL-002: Problems Panel |
| **Story Points** | 5 |
| **Priority** | High |
| **Labels** | design-ide, validation, problems-panel, quality, intelligence |
| **HLR Trace** | HLR-VAL-010, HLR-VAL-011 |

**Description:** As a technology architect, I want to see all validation issues in a Problems Panel so that I can systematically address them.

**Acceptance Criteria:**

```gherkin
GIVEN I have validation issues in my model
WHEN I click 'Problems' in the Panel Area tabs
THEN I should see a list of issues with:
  | Column   | Content                        |
  | Severity | Error (red), Warning (yellow), Info (blue) |
  | Message  | Description of the issue       |
  | Element  | Name of affected element       |
  | Location | Click to select element on canvas |
AND issues should be sortable by severity
AND I should see counts: '1 Error, 3 Warnings, 2 Info'
AND clicking an issue should select and zoom to the element
```

---

#### US-VAL-003: Quick Fix Actions

| Field | Value |
|-------|-------|
| **Story ID** | US-VAL-003 |
| **Title** | Quick Fix Actions |
| **Epic** | EPIC-IDE-05: Validation & Quality |
| **Feature** | FTR-VAL-004: Quick Fixes |
| **Story Points** | 8 |
| **Priority** | Medium |
| **Labels** | design-ide, validation, quick-fix, quality, intelligence |
| **HLR Trace** | HLR-VAL-020, HLR-VAL-021 |

**Description:** As a technology architect, I want quick fix suggestions for validation issues so that I can resolve problems efficiently.

**Acceptance Criteria:**

```gherkin
GIVEN I have a validation issue
WHEN I hover over the issue in Problems Panel
THEN I should see a lightbulb icon for available fixes
AND clicking should show quick fix options:
  | Issue Type         | Quick Fix Options                     |
  | Missing name       | 'Add default name', 'Edit properties' |
  | Invalid connection | 'Change type to X', 'Remove connection' |
  | Orphaned element   | 'Connect to nearest', 'Delete element' |
  | Missing encryption | 'Add KMS encryption', 'Ignore this time' |
AND clicking a fix should apply it immediately
AND the fix should be undoable with Cmd+Z
AND AI-suggested fixes should be marked with sparkle icon
```

---

## 6. Requirements Traceability Matrix

Complete mapping from User Stories to HLRs for test validation. *Updated in v1.1 with Agent Mode Selection stories.*

### 6.1 Story-to-HLR Traceability

| Story ID | Story Title | HLR IDs |
|----------|-------------|---------|
| US-IDE-001 | Six-Zone IDE Layout Shell | HLR-IDE-001, HLR-IDE-002 |
| US-IDE-002 | Activity Bar Navigation | HLR-IDE-003, HLR-IDE-004 |
| US-IDE-003 | Resizable Sidebar Panels | HLR-IDE-005 |
| US-IDE-004 | Multi-Tab Model Editor | HLR-IDE-010, HLR-IDE-011 |
| US-IDE-005 | Command Palette Core | HLR-IDE-020, HLR-IDE-021, HLR-IDE-022 |
| US-IDE-006 | Theme Switching | HLR-IDE-030 |
| US-CVS-001 | Infinite Canvas Pan and Zoom | HLR-CVS-001, HLR-CVS-002, HLR-CVS-003 |
| US-CVS-002 | Grid and Snap System | HLR-CVS-004, HLR-CVS-005 |
| US-CVS-003 | Smart Alignment Guides | HLR-CVS-006 |
| US-CVS-004 | Element Drag and Drop | HLR-CVS-010, HLR-CVS-011 |
| US-CVS-005 | Element Resize and Rotate | HLR-CVS-012, HLR-CVS-013 |
| US-CVS-006 | Connection Creation | HLR-CVS-020, HLR-CVS-021, HLR-CVS-022 |
| US-CVS-007 | Undo/Redo System | HLR-CVS-030, HLR-CVS-031 |
| US-CVS-008 | Multi-Selection Operations | HLR-CVS-040, HLR-CVS-041 |
| US-CVS-009 | Export to PNG/SVG | HLR-CVS-050, HLR-CVS-051 |
| US-PAL-001 | Element Palette Display | HLR-PAL-001, HLR-PAL-002 |
| US-PAL-002 | Element Search | HLR-PAL-010, HLR-PAL-011 |
| US-PAL-003 | Favorites and Recents | HLR-PAL-020, HLR-PAL-021 |
| US-AGT-001 | AI Chat Panel UI | HLR-AGT-001, HLR-AGT-002 |
| US-AGT-002 | AI Context Awareness - Canvas State | HLR-AGT-010, HLR-AGT-011 |
| US-AGT-003 | AI Context Awareness - Selection Focus | HLR-AGT-012, HLR-AGT-013 |
| US-AGT-004 | Inline AI Prompt (Cmd+K) | HLR-AGT-020, HLR-AGT-021 |
| US-AGT-005 | AI Element Generation | HLR-AGT-022, HLR-AGT-023 |
| US-AGT-006 | AI Explain Selection | HLR-AGT-024 |
| US-AGT-007 | Execute Mode Toggle | HLR-AGT-067 |
| US-AGT-008 | Execute Mode Multi-Step Planning | HLR-AGT-067 |
| US-AGT-009 | Execute Mode Diff View | HLR-AGT-067, HLR-AGT-068 |
| US-AGT-010 | Specialized Agent - Security Architect | HLR-AGT-040, HLR-AGT-041 |
| US-AGT-011 | Specialized Agent - Data Architect | HLR-AGT-042, HLR-AGT-043 |
| US-AGT-012 | Specialized Agent - Cloud Architect | HLR-AGT-044, HLR-AGT-045 |
| US-AGT-013 | Agent Auto-Routing | HLR-AGT-050, HLR-AGT-051 |
| US-AGT-014 | Agent Mode Dropdown (NEW) | HLR-AGT-060, HLR-AGT-061, HLR-AGT-062 |
| US-AGT-015 | Auto Mode Routing (NEW) | HLR-AGT-063 to HLR-AGT-066 |
| US-AGT-016 | Scenarios Mode - Pattern Options (NEW) | HLR-AGT-070 to HLR-AGT-073 |
| US-VAL-001 | Real-time Validation Engine | HLR-VAL-001, HLR-VAL-002, HLR-VAL-003 |
| US-VAL-002 | Problems Panel Display | HLR-VAL-010, HLR-VAL-011 |
| US-VAL-003 | Quick Fix Actions | HLR-VAL-020, HLR-VAL-021 |

### 6.2 Coverage Summary

| EPIC | Stories | Points | HLRs | Coverage |
|------|---------|--------|------|----------|
| EPIC-IDE-01: Core IDE | 6 | 39 | 11 | 100% |
| EPIC-IDE-02: Canvas | 9 | 59 | 19 | 100% |
| EPIC-IDE-03: Elements | 3 | 16 | 6 | 100% |
| EPIC-IDE-04: AI Agents | 16 | 112 | 38 | 100% |
| EPIC-IDE-05: Validation | 3 | 21 | 7 | 100% |
| **TOTAL** | **37** | **247** | **81** | **100%** |

---

## 7. Appendix: Visual Design Guidelines

### 7.1 Brand Color Palette

| Color Name | Hex | Usage |
|------------|-----|-------|
| **Primary Orange** | #F97316 | Logo, primary actions, AI icon, active indicators |
| **Light Green** | #4ADE80 | Success states, validation pass, 7-day recency |
| **Light Blue** | #60A5FA | Information states, links, 30-day recency |
| **Purple** | #9F7AEA | AI/Agent elements, processing states |
| **Text Primary** | #1E293B | Headlines, titles, primary content |
| **Text Secondary** | #64748B | Descriptions, metadata, timestamps |

### 7.2 Agent Mode Icons

| Mode | Icon | Visual Treatment |
|------|------|------------------|
| **Auto** | Magic Wand / Sparkles | Purple (#9F7AEA) - indicates AI intelligence |
| **Question** | Question Mark / Help | Blue (#60A5FA) - indicates inquiry |
| **Strategize** | Lightbulb / Map | Yellow/Gold (#F59E0B) - indicates planning |
| **Execute** | Play / Build | Green (#4ADE80) - indicates action |
| **Scenarios** | Grid / Cards | Orange (#F97316) - indicates options |

### 7.3 IDE Zone Dimensions

| Zone | Default | Min | Max |
|------|---------|-----|-----|
| Activity Bar | 48px | 48px | 48px (fixed) |
| Primary Sidebar | 240px | 180px | 400px |
| Secondary Sidebar | 280px | 200px | 400px |
| Panel Area | 150px | 100px | 400px |
| Status Bar | 30px | 30px | 30px (fixed) |

### 7.4 Keyboard Shortcuts

| Action | Mac | Windows |
|--------|-----|---------|
| Command Palette / Inline AI | Cmd+K | Ctrl+K |
| Toggle Primary Sidebar | Cmd+B | Ctrl+B |
| Toggle Secondary Sidebar | Cmd+Option+B | Ctrl+Alt+B |
| Toggle Panel | Cmd+J | Ctrl+J |
| Save Model | Cmd+S | Ctrl+S |
| Undo | Cmd+Z | Ctrl+Z |
| Redo | Cmd+Shift+Z | Ctrl+Shift+Z |
| Delete Selection | Delete/Backspace | Delete/Backspace |
| Select All | Cmd+A | Ctrl+A |
| Duplicate | Cmd+D | Ctrl+D |
| Group Selection | Cmd+G | Ctrl+G |
| Zoom In / Out | Cmd++ / Cmd+- | Ctrl++ / Ctrl+- |
| Fit to Screen | Cmd+0 | Ctrl+0 |
| Pan Canvas | Space + Drag | Space + Drag |
| Open AI Chat | Cmd+Shift+A | Ctrl+Shift+A |
| Export | Cmd+E | Ctrl+E |

---

**— End of Document —**

*Version 1.1 | December 2025 | 37 User Stories | 247 Story Points*
