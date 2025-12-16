# ARKDL-0014: Plan Module Enhancements - Agile Ceremonies & Advanced Planning

**Version:** 1.1 (Revised)
**Status:** Approved for Backlog
**Date:** December 16, 2025
**Author:** Arkhitekton Platform Team

## 1. Executive Summary
The Plan module currently relies on a foundational "Task Management" (TM) implementation. To evolve into a competitive Agile Planning tool, we must enhance existing features (Kanban, List View) and introduce new ceremonies (Sprint Planning, Retro, Poker).

**Traceability Strategy:**
*   Existing "Done" stories (e.g., `US-TM022`) are preserved as-is.
*   New functionality is defined in **Enhancement Stories** that link back to their predecessors.
*   Completely new features (Roadmap, Retro) get new Story IDs.

---

## 2. Strategic Epics

| Epic ID | Epic Name | Description | Value Stream |
| :--- | :--- | :--- | :--- |
| **EPIC-11** | **Sprint Lifecycle Management** | Features to create, plan, start, and close sprints. | Execution |
| **EPIC-12** | **Strategic Roadmapping** | High-level timeline views for Epics and Releases. | Strategy |
| **EPIC-13** | **Team Rituals (Ceremonies)** | Tools for Retrospectives, Stand-ups, and Demos. | Collaboration |
| **EPIC-14** | **Gamified Estimation** | "Poker Planning" for unbiased story point estimation. | Planning |

---

## 3. Detailed User Stories

### A. ENHANCEMENT STORIES (Modifying Existing Features)

#### US-PLAN-ENH-001: Revive and Professionalize Kanban
*   **Type:** Enhancement
*   **Refers To:** `US-TM021` (Layout), `US-TM022` (Drag-Drop) - *Both marked Done but functionality is missing/broken.*
*   **Points:** 8
*   **Epic:** EPIC-11
*   **Description:**
    The current Kanban board lacks functional drag-and-drop and persistence. This story implements a robust DnD engine.
*   **Acceptance Criteria:**
    ```gherkin
    Given I am on the Kanban Board view
    When I drag a card from "In Progress" to "Done"
    Then the card should visually snap into the new column immediately (Optimistic UI)
    And the status update API call should fire in the background
    And if the API fails, the card should snap back with an error toast
    
    Given I reorder cards within the same column
    When I drop a card to a new position
    Then the new sort order should be persisted to the database
    ```

#### US-PLAN-ENH-002: Transform Task List into Sprint Backlog
*   **Type:** Enhancement
*   **Refers To:** `US-TM017` (List View), `US-TM024` (Filtering)
*   **Points:** 5
*   **Epic:** EPIC-11
*   **Description:**
    The current flat list view is insufficient for sprint planning. We need a "Split View" (Sprint vs. Backlog) and inline editing.
*   **Acceptance Criteria:**
    ```gherkin
    Given I am on the "Plan" tab
    Then I should see two distinct collapsible sections: "Current Sprint" and "Backlog"
    
    Given I am viewing the list
    When I click on a "Priority" cell
    Then it should turn into a dropdown selector (Inline Edit)
    And selecting a new priority should save immediately without opening a modal
    ```

#### US-PLAN-ENH-003: Agile Estimation Fields
*   **Type:** Enhancement
*   **Refers To:** `US-TM016` (Task Form)
*   **Points:** 3
*   **Epic:** EPIC-11
*   **Description:**
    The generic "Task" form lacks agile-specific fields.
*   **Acceptance Criteria:**
    ```gherkin
    Given I am creating or editing a User Story
    Then I should see a "Story Points" field (Fibonacci selector: 1, 2, 3, 5, 8, 13)
    And I should see an "Epic Link" dropdown to associate the story with an Epic
    And the "Description" field should support Gherkin syntax highlighting
    ```

---

### B. NEW FEATURE STORIES (New Functionality)

#### US-PLAN-101: Sprint Engine (Logic & State)
*   **Type:** New Feature (Note: Updates logic for placeholder `US-1XDWFUS`)
*   **Epic:** EPIC-11
*   **Points:** 8
*   **Description:**
    The backend logic to define Sprints as distinct time-boxed entities with capacity tracking.
*   **Acceptance Criteria:**
    ```gherkin
    Given I am a Product Owner
    When I create a new Sprint
    Then I must define a Start Date and End Date
    And the system should calculate "Sprint Capacity" based on team velocity (default: 30 pts)
    And as I add stories, a "Capacity Bar" should fill up
    And the bar should turn red if Total Points > Capacity
    ```

#### US-PLAN-201: Epic Timeline View (Roadmap)
*   **Type:** New Feature
*   **Epic:** EPIC-12
*   **Points:** 13
*   **Description:**
    A Gantt-style chart visualizing Epic duration.
*   **Acceptance Criteria:**
    ```gherkin
    Given I am on the Roadmap tab
    Then I should see Epics plotted against a monthly calendar
    And the bar length should be derived from the Earliest Story Start Date and Latest Story Due Date in that Epic
    And I should be able to filter by "Value Stream"
    ```

#### US-PLAN-301: The Retro Board
*   **Type:** New Feature
*   **Epic:** EPIC-13
*   **Points:** 8
*   **Description:**
    A real-time collaborative board for sprint retrospectives.
*   **Acceptance Criteria:**
    ```gherkin
    Given a Retro session is active
    Then I should see columns: "Went Well", "Needs Improvement", "Action Items"
    And cards I add should be blurred/hidden to others until "Reveal" is clicked
    And I should be able to convert a card into a User Story (Action Item) with one click
    ```

#### US-PLAN-401: Poker Planning Session
*   **Type:** New Feature
*   **Epic:** EPIC-14
*   **Points:** 13
*   **Description:**
    Gamified estimation tool to prevent anchoring bias.
*   **Acceptance Criteria:**
    ```gherkin
    Given I am in a Poker Session for "US-101"
    When I select a card (e.g., "5")
    Then my status should change to "Voted"
    And my vote value should remain hidden
    
    When the moderator reveals votes
    Then all values should be displayed
    And the system should suggest the Consensus Score
    ```

---

## 4. Implementation Plan

**Phase 1: The Fix (Sprint 1)**
*   `US-PLAN-ENH-001` (Fix Kanban)
*   `US-PLAN-ENH-003` (Add Points/Epic Fields)
*   `US-PLAN-101` (Sprint Engine Backend)

**Phase 2: The Planner (Sprint 2)**
*   `US-PLAN-ENH-002` (Backlog Split View)
*   `US-PLAN-201` (Roadmap)

**Phase 3: The Rituals (Sprint 3)**
*   `US-PLAN-301` (Retro Board)
*   `US-PLAN-401` (Poker Planning)
