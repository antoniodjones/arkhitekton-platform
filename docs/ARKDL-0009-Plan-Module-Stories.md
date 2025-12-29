# Plan Module - Product Vision & Backlog

**Document ID:** ARKDL-0009  
**Version:** 1.1 (Comprehensive)  
**Status:** Approved  
**Total Stories:** 22 (5 Foundation + 17 Enhancements)  
**Total Points:** ~120+

---

## 1. Product Vision & Strategy

### Vision
The Plan Module transforms the platform from a simple task tracker into a **Competitive Agile Planning Engine**. It empowers teams to move beyond "to-do lists" into structured, ritual-based software delivery, integrating Sprint Management, Strategic Roadmapping, and Team Ceremonies into a single cohesive experience.

### Strategic Value
- **Execution Discipline:** Enforces Sprint mechanics (capacity, velocity, commitment) to improve predictability.
- **Strategic Alignment:** Visualizes how daily work connects to long-term Epics via the Roadmap.
- **Team Health:** Built-in tools for Retrospectives and Poker Planning foster collaboration and unbiased estimation.
- **Traceability:** Seamlessly links Planning (Stories) with Execution (Code/Tasks) and Documentation (Wiki).

### Key Capabilities
1.  **Sprint Engine:** Time-boxed iteration management with capacity tracking and burndown analytics.
2.  **Strategic Roadmap:** Gantt-style timeline views for Epics and Releases with multi-level grouping.
3.  **Agile Ceremonies:** Integrated tools for Retrospectives (real-time boards) and Poker Planning (gamified estimation).
4.  **Task Management (Foundation):** Robust Kanban board, backlog management, and story CRUD operations.

---

## 2. Epic Definitions

| Epic ID | Name | Value Stream | Description |
| :--- | :--- | :--- | :--- |
| **EPIC-04** | **Development & Implementation** | Execution | (Foundation) Core task management, views, and basic project tracking. |
| **EPIC-11** | **Sprint Lifecycle Management** | Execution | Core mechanics to create, plan, start, and close sprints with velocity tracking. |
| **EPIC-12** | **Strategic Roadmapping** | Strategy | High-level timeline visualizations for Epics and Releases across time horizons. |
| **EPIC-13** | **Team Rituals (Ceremonies)** | Collaboration | Interactive tools for Retrospectives, Stand-ups, and Demos. |
| **EPIC-14** | **Gamified Estimation** | Planning | "Poker Planning" tools to facilitate unbiased story point estimation. |

---

## 3. Detailed User Stories & Acceptance Criteria

### A. Foundation Stories (EPIC-04)
*Focus: Existing core capabilities that underpin the advanced features.*

#### US-PLAN-BASE-001: Task/Story CRUD (Task Form)
- **Type:** Foundation (Legacy: US-TM016)
- **Priority:** Critical | **Points:** 5
- **Description:** Create, read, update, and delete tasks/stories with essential fields (Title, Description, Status, Priority, Assignee).
- **Acceptance Criteria:**
  - Create new task via modal or inline add.
  - Edit task details including rich text description.
  - Delete task with confirmation.
  - Assign users from the team list.

#### US-PLAN-BASE-002: Backlog List View
- **Type:** Foundation (Legacy: US-TM017)
- **Priority:** Critical | **Points:** 5
- **Description:** View tasks in a flat list format with sorting and column customization.
- **Acceptance Criteria:**
  - Display tasks in a table/list layout.
  - Sort by Priority, Due Date, Created Date.
  - Pagination or infinite scroll for large lists.

#### US-PLAN-BASE-003: Kanban Board Layout
- **Type:** Foundation (Legacy: US-TM021)
- **Priority:** Critical | **Points:** 8
- **Description:** Visualize work in progress using a columnar Kanban board.
- **Acceptance Criteria:**
  - Columns for statuses (e.g., Todo, In Progress, Done).
  - Cards display key info (Title, ID, Avatar).
  - Responsive layout adjusting columns based on screen width.

#### US-PLAN-BASE-004: Drag-and-Drop Interaction
- **Type:** Foundation (Legacy: US-TM022)
- **Priority:** Critical | **Points:** 8
- **Description:** Move items between statuses using drag-and-drop.
- **Acceptance Criteria:**
  - Drag card from one column to another to change status.
  - Visual feedback during drag operation.
  - (Enhanced by US-PLAN-ENH-001 for persistence/optimistic UI).

#### US-PLAN-BASE-005: Filtering & Search
- **Type:** Foundation (Legacy: US-TM024)
- **Priority:** High | **Points:** 5
- **Description:** Find specific items using text search and property filters.
- **Acceptance Criteria:**
  - Text search filters title and description.
  - Filter by Assignee, Priority, Status, and Labels.
  - "Clear All" filters action.

---

### B. Sprint Lifecycle Management (EPIC-11)
*Focus: The "Engine Room" of agile execution.*

#### US-PLAN-ENH-001: Revive and Professionalize Kanban
- **Type:** Enhancement
- **Priority:** High | **Points:** 8
- **Description:** The current Kanban board lacks functional drag-and-drop and persistence. This story implements a robust DnD engine with optimistic UI updates.
- **Acceptance Criteria:**
  - Dragging a card updates its status visually immediately (Optimistic UI).
  - Background API call persists the change; reverts on failure.
  - Reordering cards within a column persists the new sort order.

#### US-PLAN-ENH-002: Transform Task List into Sprint Backlog
- **Type:** Enhancement
- **Priority:** Medium | **Points:** 5
- **Description:** The current flat list view is insufficient for sprint planning. We need a "Split View" (Sprint vs. Backlog) and inline editing.
- **Acceptance Criteria:**
  - View shows two distinct collapsible sections: "Current Sprint" and "Backlog".
  - Dragging items between sections updates their Sprint assignment.
  - Inline editing for Priority and Status fields without opening modals.

#### US-PLAN-ENH-003: Agile Estimation Fields
- **Type:** Enhancement
- **Priority:** High | **Points:** 3
- **Description:** The generic "Task" form lacks agile-specific fields necessary for velocity tracking.
- **Acceptance Criteria:**
  - "Story Points" field with Fibonacci selector (1, 2, 3, 5, 8, 13).
  - "Epic Link" dropdown to associate stories with parent Epics.
  - Description field supports Gherkin syntax highlighting.

#### US-PLAN-101: Sprint Engine (Logic & State)
- **Type:** New Feature
- **Priority:** High | **Points:** 8
- **Description:** The backend logic to define Sprints as distinct time-boxed entities with capacity tracking.
- **Acceptance Criteria:**
  - Define Start Date and End Date for Sprints.
  - Calculate "Sprint Capacity" based on team velocity (default: 30 pts).
  - Visual "Capacity Bar" fills as stories are added.
  - Warning indicator if Total Points assigned > Sprint Capacity.

---

### C. Strategic Roadmapping (EPIC-12)
*Focus: Long-term visibility and planning.*

#### US-PLAN-201: Epic Timeline View (Roadmap)
- **Type:** New Feature
- **Priority:** High | **Points:** 13
- **Description:** A Gantt-style chart visualizing Epic duration and sequencing.
- **Acceptance Criteria:**
  - Plot Epics against a monthly calendar timeline.
  - Bar length derived from Earliest Story Start and Latest Story Due Date.
  - Filter view by "Value Stream" or "Team".

#### US-PLAN-202: Roadmap Colorful Swimlanes
- **Type:** Enhancement
- **Priority:** Low | **Points:** 5
- **Description:** Add vibrant gradient colors to each swimlane row for visual distinction and better UX.
- **Acceptance Criteria:**
  - Each Sprint/Epic row has a unique gradient background.
  - Colors cycle through a vibrant palette (rose, orange, emerald, blue, violet).
  - Story bars within rows inherit coordinated accent colors.

#### US-PLAN-203: Roadmap Expandable Hierarchy
- **Type:** Enhancement
- **Priority:** Medium | **Points:** 8
- **Description:** Add collapsible/expandable rows so users can drill down from group level to individual stories.
- **Acceptance Criteria:**
  - Clicking a Sprint/Epic row expands to show child stories.
  - "Expand All" / "Collapse All" global controls.
  - Chevron indicators show current expansion state.

#### US-PLAN-204: Roadmap Grouping Modes
- **Type:** Enhancement
- **Priority:** Medium | **Points:** 5
- **Description:** Allow users to toggle between different grouping modes for the roadmap view.
- **Acceptance Criteria:**
  - "Group By" dropdown with options: Sprint, Epic, Flat.
  - Changing selection regroups stories immediately.
  - Visual hierarchy adapts to selected grouping.

#### US-PLAN-205: Roadmap Extended Views
- **Type:** Enhancement
- **Priority:** Low | **Points:** 3
- **Description:** Add longer time horizon options for planning beyond a single month.
- **Acceptance Criteria:**
  - "View" dropdown options: Month (Current), Quarter (3 Months), 6 Months.
  - Timeline header scale adjusts to fit the selected range.

#### US-PLAN-206: Roadmap Progress Indicators
- **Type:** Enhancement
- **Priority:** Medium | **Points:** 3
- **Description:** Show progress statistics per group row to visualize completion status.
- **Acceptance Criteria:**
  - Each row displays: Story Count, Total Points, Completion %.
  - Completion badge turns green at 100%.
  - Metrics update dynamically as stories are completed.

#### US-PLAN-207: Roadmap Story Tooltips
- **Type:** Enhancement
- **Priority:** Low | **Points:** 3
- **Description:** Rich tooltips on hover showing story details without leaving the roadmap context.
- **Acceptance Criteria:**
  - Hovering a story bar shows a tooltip.
  - Tooltip content: ID, Title, Points, Status, Target Date.

#### US-PLAN-208: Roadmap Line Connection Styles
- **Type:** Enhancement
- **Priority:** Low | **Points:** 5
- **Description:** Add visual connection lines from story bars to milestone markers.
- **Acceptance Criteria:**
  - Connection lines extend from story bars to timeline edge.
  - Line styles alternate (solid, zig-zag, dotted) for visual variety.
  - Lines terminate with matching colored markers.

---

### D. Team Rituals (EPIC-13)
*Focus: Collaboration and continuous improvement.*

#### US-PLAN-301: The Retro Board
- **Type:** New Feature
- **Priority:** High | **Points:** 8
- **Description:** A real-time collaborative board for sprint retrospectives.
- **Acceptance Criteria:**
  - Columns: "Went Well", "Needs Improvement", "Action Items".
  - Cards are blurred/hidden to others until "Reveal" is clicked.
  - One-click conversion of Action Items into User Stories.

#### US-PLAN-302: Retro Session Management
- **Type:** New Feature
- **Priority:** Medium | **Points:** 5
- **Description:** Create and manage retrospective sessions tied to specific sprints.
- **Acceptance Criteria:**
  - "New Retro" action auto-links to current sprint.
  - "Start Session" activates timer and live board.
  - "End Session" disables voting and archives the board.

#### US-PLAN-303: Retro Voting & Grouping
- **Type:** New Feature
- **Priority:** Medium | **Points:** 5
- **Description:** Upvote retro cards and group related items to prioritize discussion.
- **Acceptance Criteria:**
  - Upvote button on cards (max votes per user logic).
  - Drag-and-drop cards to merge into groups.
  - Group headers show total combined votes.

#### US-PLAN-304: Convert Retro Action to Story
- **Type:** New Feature
- **Priority:** Low | **Points:** 3
- **Description:** Streamlined workflow to turn retro outcomes into backlog items.
- **Acceptance Criteria:**
  - "Create Story" action on retro cards.
  - Creates new Story in Backlog with "retro-action" label.
  - Original card shows link to the generated story.

---

### E. Gamified Estimation (EPIC-14)
*Focus: Unbiased planning and team consensus.*

#### US-PLAN-401: Poker Planning Session
- **Type:** New Feature
- **Priority:** High | **Points:** 13
- **Description:** Gamified estimation tool to prevent anchoring bias during planning.
- **Acceptance Criteria:**
  - Select a card (Fibonacci) -> Status changes to "Voted" (value hidden).
  - Moderator reveals all votes simultaneously.
  - System highlights Average, Mode, and Spread.
  - Outliers (High/Low) prompted for discussion.

#### US-PLAN-402: Poker Session Management
- **Type:** New Feature
- **Priority:** Medium | **Points:** 5
- **Description:** Create and manage planning poker sessions.
- **Acceptance Criteria:**
  - Create session: Name, Story Selection, Participants, Deck Type.
  - Start session reveals first story.
  - Configurable decks (Fibonacci, T-Shirt, Powers of 2).

#### US-PLAN-403: Poker Vote Reveal & Consensus
- **Type:** New Feature
- **Priority:** Medium | **Points:** 5
- **Description:** Logic for revealing votes and reaching consensus.
- **Acceptance Criteria:**
  - "Reveal" action shows all participant votes/avatars.
  - Highlight consensus score (if reached).
  - "Accept" action updates Story Points field on the user story.
