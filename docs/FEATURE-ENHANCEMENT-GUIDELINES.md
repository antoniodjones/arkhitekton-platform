# Feature Enhancements & Traceability Guidelines

**Version:** 1.0
**Date:** December 16, 2025
**Scope:** All Arkhitekton Modules (Plan, Wiki, Design, APM, etc.)

## 1. The Core Philosophy: "Evolution, Not Revision"

In a regulated or enterprise-grade environment (and simply for good engineering hygiene), **we do not rewrite history.** When a feature that was previously marked "Done" requires significant modification, improvement, or fixing, we do **not** reopen and edit the original User Story.

Instead, we create an **Enhancement Story** that links back to the original.

### Why?
1.  **Preserve Context:** The original story represented the requirements *at that time*. Changing it erases the decision-making context of the past.
2.  **Git Traceability:** Commits are often linked to Story IDs (e.g., `feat(US-123): ...`). If you repurpose `US-123` for new work, the old commits become confusingly mislabeled.
3.  **Audit Trail:** We can clearly see "Phase 1 delivered X" and "Phase 2 improved it to Y."

---

## 2. The Enhancement Workflow

### Step 1: Identify the Original Story
Before building a new feature or improvement, search the `Done` stories to see if a foundation already exists.
*   *Example:* We want to fix the broken Kanban Drag-and-Drop.
*   *Search:* Found `US-TM022: Add Drag-Drop Board Functionality` (Status: Done).

### Step 2: Create the Enhancement Story
Create a new User Story with a clear "Enhancement" tag or naming convention.

**Format:**
*   **Title:** `[Enhancement] {Feature Name}: {Specific Improvement}`
*   **Description:** clearly state *what* is changing and *why*.
*   **Traceability Link:** explicitly reference the parent story.

**Example Gherkin Payload:**
```json
{
  "title": "[Enhancement] Kanban Board: Optimistic Drag-and-Drop",
  "description": "Improve the existing Kanban board (US-TM022) by implementing optimistic UI updates and persistent column ordering.",
  "labels": ["enhancement", "plan-module", "refers-to:US-TM022"],
  "acceptanceCriteria": "..."
}
```

### Step 3: Define "Improves" vs. "Updates"

| Scenario | Action | Traceability Method |
| :--- | :--- | :--- |
| **Story is DONE** but needs changes | **Create New Story** | Label: `refers-to:US-XXXX` |
| **Story is BACKLOG** (Never started) | **Update Existing Story** | No new ID needed. Update description/AC directly. |
| **Story is IN-PROGRESS** | **Discuss with Team** | Usually update existing, unless scope creep is massive. |
| **Bug/Regression** | **Create Defect** | Link Defect to Original Story (`US-XXXX`). |

---

## 3. Implementation Guidelines

### Naming Conventions
*   **Enhancement IDs:** Use the standard project sequence (e.g., `US-PLAN-105`), but internally or in the title, you may denote it as an enhancement.
*   **Branch Names:** `feat/US-PLAN-105-kanban-dnd-v2`

### Code Comments
When modifying code originally written for a previous story, add a reference:

```typescript
// Originally implemented for US-TM022
// Enhanced for US-PLAN-ENH-001: Added optimistic update logic
function onDragEnd(result) {
  // ...
}
```

## 4. Documentation Strategy (The "Living Spec")

While User Stories track *work*, the **Wiki** tracks the *Product State*.

1.  **Wiki Requirements Page:** When an Enhancement Story is completed, update the corresponding **Requirements Page** in the Wiki.
    *   *Old:* "The Kanban board supports basic drag and drop."
    *   *New:* "The Kanban board supports optimistic drag and drop with persistence."
2.  **Traceability Matrix:** The Plan module should eventually visualize this chain:
    *   `US-TM022 (v1)` → `US-PLAN-ENH-001 (v2)` → `US-PLAN-ENH-005 (v3)`

---

## 5. Summary Checklist for Engineers

- [ ] **Search:** Did a story for this feature exist before?
- [ ] **Check Status:** Is that story "Done"?
- [ ] **Create:** If "Done", create a NEW story. Do not edit the old one.
- [ ] **Link:** Add a `refers-to:US-XXXX` label or note in the description.
- [ ] **Implement:** Code the enhancement.
- [ ] **Update Wiki:** Update the functional spec to reflect the new reality.

