# ARKDL-0015: ArchLens - Contextual Intelligence & Traceability

**Version:** 1.0
**Status:** Draft
**Date:** December 16, 2025
**Author:** Arkhitekton Platform Team

## 1. Executive Summary
**ArchLens** is the "X-Ray Vision" capability of the Arkhitekton platform. It connects the dots between Requirements (Plan), Documentation (Wiki), Architecture (Design), and Implementation (Code). 

Unlike standard "Git Blame" which only looks at lines of code, ArchLens provides **semantic attribution** across the entire lifecycle. It answers the question: *"Why does this box exist in the diagram, who approved it, and what code implements it?"*

---

## 2. Strategic Vision

ArchLens operates in three phases, scaling from simple data tracking to complex visual intelligence.

| Phase | Module Focus | Capability | Value Prop |
| :--- | :--- | :--- | :--- |
| **Phase 1** | **Plan & Wiki** | **"The Story Lens"** | Trace code changes (PRs) back to User Stories and Requirements. |
| **Phase 2** | **Design Studio** | **"The Visual Lens"** | Track visual changes in diagrams (e.g., "Added Database") and link to ADRs. |
| **Phase 3** | **Global** | **"The Impact Lens"** | Predictive analysis (e.g., "Changing this Requirement will break 3 Diagrams"). |

---

## 3. Detailed Requirements (Phase 1 & 2)

### EPIC-15: Core Traceability Engine (Phase 1)
**Goal:** Establish the data model and linkage between Plan items and Code.

#### Feature 15.1: The Lens Data Model
*   **Description:** A unified schema to store "Change Events" from disparate sources (GitHub, User Actions, System Events).
*   **Requirement:** Must support polymorphic associations (can link to Story, Page, Object, or Element).

**User Stories:**

**US-LENS-001: Unified Change Log Schema**
*   **Points:** 5
*   **Acceptance Criteria:**
    ```gherkin
    Given a change event occurs (Code Commit, Wiki Edit, Diagram Change)
    Then it should be stored in a `change_events` table
    And it must capture: `actor_id`, `timestamp`, `event_type`, `source_system` (GitHub/App), and `linked_entities`
    ```

#### Feature 15.2: The Story Lens (Plan Module Integration)
*   **Description:** Visualizing code activity directly on the User Story card.
*   **Requirement:** Users must see "Work in Progress" without leaving the board.

**User Stories:**

**US-LENS-002: Story Card Code Indicators**
*   **Points:** 5
*   **Acceptance Criteria:**
    ```gherkin
    Given I am viewing the Kanban Board
    When a User Story has active PRs or recent commits
    Then a "Code Activity" badge should appear on the card
    And hovering should show: "PR #123 (Open) - 2 mins ago"
    ```

**US-LENS-003: Smart Status Automation**
*   **Points:** 8
*   **Acceptance Criteria:**
    ```gherkin
    Given a User Story is in "To Do"
    When a branch is created matching `feat/US-123`
    Then the Story status should auto-move to "In Progress"
    
    When the PR is merged
    Then the Story status should auto-move to "Done" (or "Review")
    ```

---

### EPIC-16: Visual Intelligence (Phase 2 - Design Studio)
**Goal:** Bring "Git Blame" to the Canvas.

#### Feature 16.1: Object History
*   **Description:** Tracking the evolution of specific architectural objects (e.g., "Payment Service").

**User Stories:**

**US-LENS-010: Object Change History**
*   **Points:** 8
*   **Acceptance Criteria:**
    ```gherkin
    Given I selected a "Database" object on the canvas
    When I open the "ArchLens" panel
    Then I should see a timeline of changes for this specific object
    And it should show: "Created by Alice", "Renamed by Bob", "Linked to US-101 by Charlie"
    ```

#### Feature 16.2: Visual Diffing
*   **Description:** Comparing two versions of a diagram visually.

**User Stories:**

**US-LENS-011: Diagram Version Comparison**
*   **Points:** 13
*   **Acceptance Criteria:**
    ```gherkin
    Given I am viewing V2 of a diagram
    When I select "Compare with V1"
    Then the canvas should overlay both versions
    And added objects should be Green
    And removed objects should be Red
    And moved objects should show a "Ghost" trail
    ```

---

## 4. Technical Architecture

### The "Lens Service"
We will decouple this logic into a specialized service module (even if monolithic in deployment).

*   **Ingestion:** Webhooks (GitHub), Event Bus (Internal App Events).
*   **Storage:** `change_events` table (Time-series optimized).
*   **Querying:** A unified GraphQL or REST endpoint (`GET /api/lens?entityId=...`) that aggregates data from all sources.

### Traceability Rules
1.  **Strict Mode:** All architectural changes *should* link to a User Story or ADR.
2.  **Loose Mode:** "Quick edits" are allowed but flagged as "Unlinked" in the Lens audit report.

