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

#### US-PLAN-302: Retro Session Management
*   **Type:** New Feature
*   **Epic:** EPIC-13
*   **Points:** 5
*   **Description:**
    Create and manage retrospective sessions tied to sprints.
*   **Acceptance Criteria:**
    ```gherkin
    Given I am a Scrum Master
    When I click "New Retro" from the Sprint view
    Then a Retro session should be created with:
      | Field | Value |
      | Sprint | Auto-linked to current sprint |
      | Status | Draft |
      | Participants | Auto-added from sprint team |
    
    Given I am managing a Retro
    When I click "Start Session"
    Then the status changes to "In Progress"
    And the timer starts (configurable: 30/45/60 min)
    And participants see the live board
    
    When I click "End Session"
    Then voting is disabled
    And Action Items can be finalized
    And the session is archived
    ```

#### US-PLAN-303: Retro Voting & Grouping
*   **Type:** New Feature
*   **Epic:** EPIC-13
*   **Points:** 5
*   **Description:**
    Upvote retro cards and group related items.
*   **Acceptance Criteria:**
    ```gherkin
    Given I am in an active Retro session
    When I click the upvote button on a card
    Then my vote is added (max 3 votes per person)
    And the vote count is visible to all
    
    Given I am the facilitator
    When I drag one card onto another
    Then they should merge into a group
    And the group shows total votes
    And the group can have a custom label
    ```

#### US-PLAN-304: Convert Retro Action to Story
*   **Type:** New Feature
*   **Epic:** EPIC-13
*   **Points:** 3
*   **Description:**
    One-click conversion of action items to user stories.
*   **Acceptance Criteria:**
    ```gherkin
    Given I am viewing an Action Item card
    When I click "Create Story"
    Then a new User Story is created with:
      - Title: Action item text
      - Description: "From Retro: {Sprint Name}"
      - Labels: ["retro-action"]
      - Status: Backlog
    And the Action Item shows a link to the story
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

#### US-PLAN-402: Poker Session Management
*   **Type:** New Feature
*   **Epic:** EPIC-14
*   **Points:** 5
*   **Description:**
    Create and manage planning poker sessions.
*   **Acceptance Criteria:**
    ```gherkin
    Given I am a Product Owner or Scrum Master
    When I click "New Poker Session"
    Then I should provide:
      | Field | Type |
      | Session Name | Text (e.g., "Sprint 12 Planning") |
      | Stories to Estimate | Multi-select from Backlog |
      | Participants | Multi-select from team |
      | Card Deck | Dropdown: Fibonacci, T-Shirt, Powers of 2 |
    
    Given I start a Poker session
    Then all participants see the first unestimated story
    And they can read the story details
    And they see the card deck to vote
    ```

#### US-PLAN-403: Poker Deck Options
*   **Type:** New Feature
*   **Epic:** EPIC-14
*   **Points:** 3
*   **Description:**
    Support multiple estimation scales.
*   **Acceptance Criteria:**
    ```gherkin
    Given I am configuring a Poker session
    Then I can choose from:
      | Deck | Values |
      | Fibonacci | 0, 1, 2, 3, 5, 8, 13, 21, ?, ☕ |
      | T-Shirt | XS, S, M, L, XL, XXL, ?, ☕ |
      | Powers of 2 | 0, 1, 2, 4, 8, 16, 32, ?, ☕ |
      | Linear | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, ?, ☕ |
    
    And "?" means "Need more info"
    And "☕" means "Need a break"
    ```

#### US-PLAN-404: Poker Vote Reveal & Consensus
*   **Type:** New Feature
*   **Epic:** EPIC-14
*   **Points:** 5
*   **Description:**
    Reveal votes simultaneously and calculate consensus.
*   **Acceptance Criteria:**
    ```gherkin
    Given all participants have voted
    When the moderator clicks "Reveal"
    Then all votes are shown with participant avatars
    And the system displays:
      - Average: e.g., "4.2"
      - Mode: e.g., "5 (3 votes)"
      - Spread: "High" if range > 5 points
    
    Given there is high spread
    Then the system prompts: "Discuss high/low outliers"
    And allows re-vote after discussion
    
    Given consensus is reached
    When moderator clicks "Accept"
    Then the story's Story Points field is updated
    And the session moves to the next story
    ```

#### US-PLAN-405: Poker Session History
*   **Type:** New Feature
*   **Epic:** EPIC-14
*   **Points:** 3
*   **Description:**
    View estimation history for velocity analysis.
*   **Acceptance Criteria:**
    ```gherkin
    Given I am viewing a completed Poker session
    Then I should see:
      | Story ID | Final Estimate | Initial Average | Re-votes |
      | US-101 | 5 | 4.2 | 1 |
      | US-102 | 8 | 8.0 | 0 |
    
    Given I am viewing a Story
    Then I should see its estimation history:
      "Estimated in Session 'Sprint 12 Planning': 5 pts (consensus after 1 re-vote)"
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
