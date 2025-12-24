# PRD-QC-003: Structured Reproduction Steps

**Module:** Quality Center  
**Epic:** EPIC-QC-001 (Quality Command Center)  
**Status:** Approved  
**Created:** 2025-12-24  
**Owner:** Product Team  

---

## Executive Summary

Transform the "Steps to Reproduce" field from a free-form textarea into a structured, traceable step management system where each step has a unique identifier, enabling better defect analysis, test case generation, and cross-reference traceability.

---

## Problem Statement

### Current State
- Steps to Reproduce is a single textarea field
- No structure or formatting enforcement
- No unique identifiers for individual steps
- Cannot reorder steps without copy/paste
- Cannot trace specific steps across defects or test cases
- Difficult to reference a specific step in comments or analysis

### User Pain Points
1. **QA Engineers**: Cannot easily reference specific steps when discussing defects
2. **Developers**: Hard to identify which step fails during debugging
3. **Test Automation**: Cannot map reproduction steps to automated test steps
4. **Analytics**: Cannot identify common failure patterns across defects
5. **Traceability**: No way to link a specific step to a fix or code change

---

## Product Vision

Enable QA engineers and developers to create, manage, and trace individual reproduction steps with unique identifiers, improving defect analysis accuracy and collaboration efficiency.

---

## Strategic Goals

1. **Traceability**: Every step has a unique, persistent identifier
2. **Usability**: Intuitive step management (add, remove, reorder)
3. **Structure**: Enforce consistent step documentation
4. **Integration**: Steps can be referenced in test cases, comments, commits
5. **Analytics**: Enable pattern analysis across defects

---

## Features

### Feature 1: Individual Step Management
Each reproduction step is treated as a distinct entity with its own ID, description, and metadata.

**Key Capabilities:**
- Unique step ID generation (e.g., `DEF-REF-009-S001`, `DEF-REF-009-S002`)
- Step description (rich text or markdown)
- Step sequence/order number
- Created/updated timestamps per step
- Optional expected result per step

### Feature 2: Step Creation & Deletion
Users can dynamically add and remove steps with proper ID management.

**Key Capabilities:**
- "+Add Step" button to append new steps
- Inline step creation with auto-generated ID
- Remove button per step with confirmation
- Preserve step IDs even after deletion (soft delete or tombstone)
- Bulk import from existing textarea (migration)

### Feature 3: Step Reordering
Users can reorder steps via drag-and-drop or arrow buttons.

**Key Capabilities:**
- Drag handle for drag-and-drop reordering
- Up/Down arrow buttons for keyboard users
- Visual feedback during drag
- Automatic sequence number updates
- Step IDs remain stable (only sequence changes)

### Feature 4: Step Traceability
Steps can be referenced and linked throughout the application.

**Key Capabilities:**
- Copy step ID to clipboard
- Deep link to specific step (e.g., `/defects/DEF-003?step=S002`)
- Reference steps in comments, test cases, code commits
- Show where a step is referenced (backlinks)
- Export steps for external systems

---

## User Stories

### Epic: EPIC-QC-003 - Structured Reproduction Steps
**Description:** Enable structured, traceable reproduction step management for defects  
**Priority:** High  
**Estimated Points:** 34

---

### US-QC-010: Individual Step Creation with Unique IDs

**As a** QA Engineer  
**I want to** create individual reproduction steps with unique IDs  
**So that** each step can be traced, referenced, and analyzed independently

**Acceptance Criteria:**

```gherkin
Scenario: Create first reproduction step
  Given I am viewing a defect detail page
  And the Steps to Reproduce section is empty
  When I click the "+Add Step" button
  Then a new step input field appears
  And the step is automatically assigned ID "<DEFECT_ID>-S001"
  And the step has a sequence number "1"
  And I can enter step description text
  And the step is saved when I blur the input or click save

Scenario: Create additional reproduction steps
  Given I have 2 existing steps (S001, S002)
  When I click "+Add Step"
  Then a new step appears with ID "<DEFECT_ID>-S003"
  And the sequence number is "3"
  And the new step is appended to the end of the list

Scenario: View step IDs for reference
  Given I have 5 reproduction steps
  When I view the Steps to Reproduce section
  Then each step displays its ID badge (e.g., "S001", "S002")
  And the ID is visually distinct from the description
  And I can copy the step ID to clipboard by clicking the badge

Scenario: Edit existing step description
  Given I have a step with ID "DEF-003-S002"
  When I click the edit icon for that step
  Then the step description becomes editable
  And I can update the text
  And the step ID remains unchanged
  And the updated timestamp is recorded
```

**Priority:** High  
**Estimated Points:** 8

---

### US-QC-011: Remove Reproduction Steps

**As a** QA Engineer  
**I want to** remove incorrect or duplicate reproduction steps  
**So that** the defect analysis remains accurate and concise

**Acceptance Criteria:**

```gherkin
Scenario: Remove a single step
  Given I have 5 reproduction steps (S001-S005)
  When I click the remove icon on step "S003"
  Then a confirmation dialog appears
  And the dialog shows "Remove step S003? This cannot be undone."
  When I confirm the removal
  Then step S003 is removed from the list
  And the remaining steps maintain their original IDs
  And sequence numbers are recalculated (1, 2, 3, 4)

Scenario: Prevent accidental deletion
  Given I have 1 reproduction step
  When I click the remove icon
  Then a confirmation dialog appears
  And the dialog warns "This is the last step. Remove anyway?"
  And I must explicitly confirm to proceed

Scenario: Remove middle step preserves IDs
  Given I have steps S001, S002, S003, S004
  When I remove step S002
  Then the remaining steps are S001, S003, S004
  And their IDs do not change
  And sequence numbers are 1, 2, 3
  And any references to S002 show as "deleted" or "removed"

Scenario: Cannot remove step if referenced
  Given step S002 is referenced in a test case or commit
  When I attempt to remove step S002
  Then the system shows a warning "This step is referenced in 2 places"
  And lists the references (test case TC-123, commit abc123)
  And I can force remove with acknowledgment
```

**Priority:** High  
**Estimated Points:** 5

---

### US-QC-012: Reorder Reproduction Steps

**As a** QA Engineer  
**I want to** reorder reproduction steps via drag-and-drop or arrow buttons  
**So that** the steps reflect the correct sequence without recreating them

**Acceptance Criteria:**

```gherkin
Scenario: Drag-and-drop reordering
  Given I have steps S001, S002, S003, S004, S005
  When I drag step S004 to position 2
  Then the new order is S001, S004, S002, S003, S005
  And the step IDs remain unchanged
  And the sequence numbers update to 1, 2, 3, 4, 5
  And the database reflects the new sequence

Scenario: Use up arrow to move step
  Given I have steps S001, S002, S003
  And step S003 is currently sequence #3
  When I click the up arrow on step S003
  Then step S003 moves to sequence #2
  And the order becomes S001, S003, S002
  And step IDs remain S001, S002, S003

Scenario: Use down arrow to move step
  Given I have steps S001, S002, S003
  And step S001 is currently sequence #1
  When I click the down arrow on step S001
  Then step S001 moves to sequence #2
  And the order becomes S002, S001, S003
  And step IDs remain S001, S002, S003

Scenario: Disable arrows at boundaries
  Given I have steps S001, S002, S003
  When viewing step S001 (first in sequence)
  Then the up arrow is disabled
  When viewing step S003 (last in sequence)
  Then the down arrow is disabled

Scenario: Visual feedback during drag
  Given I am dragging step S003
  Then the step has a "dragging" visual style
  And a drop target indicator shows where the step will be placed
  And other steps shift to show the new position
```

**Priority:** High  
**Estimated Points:** 8

---

### US-QC-013: Copy and Reference Individual Steps

**As a** Developer or QA Engineer  
**I want to** copy step IDs and reference them in comments, commits, or test cases  
**So that** I can precisely communicate which step is failing or being addressed

**Acceptance Criteria:**

```gherkin
Scenario: Copy step ID to clipboard
  Given I am viewing step S003
  When I click the step ID badge "S003"
  Then the full step ID "DEF-003-S003" is copied to clipboard
  And a toast notification confirms "Step ID copied: DEF-003-S003"

Scenario: Deep link to specific step
  Given a defect URL "/quality/defects/DEF-003"
  When I append "?step=S003"
  Then the page loads and scrolls to step S003
  And step S003 is highlighted for 2 seconds

Scenario: Reference step in commit message
  Given I am committing a fix for defect DEF-003
  When I reference "DEF-003-S003" in the commit message
  Then the system detects the reference
  And creates a backlink from the step to the commit
  And the step shows "Referenced in commit abc123"

Scenario: Show step references
  Given step S002 is referenced in 3 places
  When I hover over or click the step ID
  Then a popover shows all references:
    - Test Case TC-456 (step 2)
    - Commit abc123 (line 45)
    - Comment by @dev1 on 12/20/2025
```

**Priority:** Medium  
**Estimated Points:** 5

---

### US-QC-014: Migrate Existing Textarea Steps to Structured Format

**As a** System Administrator  
**I want to** automatically migrate existing textarea reproduction steps to structured steps  
**So that** historical defects gain the benefits of structured steps without manual rework

**Acceptance Criteria:**

```gherkin
Scenario: Auto-detect numbered steps in textarea
  Given a defect has Steps to Reproduce as textarea:
    """
    1. Open the login page
    2. Enter invalid credentials
    3. Click submit
    4. Observe error message
    """
  When I click "Convert to Structured Steps"
  Then the system creates 4 steps with IDs S001-S004
  And each step description matches the original text
  And the sequence numbers are 1, 2, 3, 4

Scenario: Handle unstructured textarea
  Given a defect has Steps to Reproduce:
    """
    Open the page, enter data, and submit the form.
    Check that the error appears.
    """
  When I click "Convert to Structured Steps"
  Then the system creates 2 steps by detecting sentence boundaries
  And each step is assigned an ID
  And I can manually edit and split further if needed

Scenario: Preserve original textarea as backup
  Given I convert textarea steps to structured steps
  Then the original textarea is stored in a "legacy_steps" field
  And I can view the original via a "Show Original" link
  And I can revert if the conversion was incorrect
```

**Priority:** Medium  
**Estimated Points:** 8

---

## Implementation Stories

### US-QC-IMPL-010: Database Schema for Reproduction Steps

**Description:** Create database table and relationships for individual reproduction steps

**Tasks:**
- Create `reproduction_steps` table with columns:
  - `id` (UUID primary key)
  - `defect_id` (foreign key to defects)
  - `step_id` (e.g., "S001", unique within defect)
  - `sequence` (integer, for ordering)
  - `description` (TEXT)
  - `expected_result` (TEXT, optional)
  - `created_at`, `updated_at`
  - `deleted_at` (nullable, for soft delete)
- Add index on `defect_id`
- Add unique constraint on `(defect_id, step_id)`
- Create migration script
- Update Drizzle schema

**Acceptance Criteria:**
- ✅ Table created with proper constraints
- ✅ Foreign key cascades on defect deletion
- ✅ Indexes optimize step retrieval by defect
- ✅ Soft delete preserves step IDs for references

**Priority:** High  
**Estimated Points:** 3  
**Implements:** US-QC-010

---

### US-QC-IMPL-011: API Endpoints for Step CRUD Operations

**Description:** Create RESTful API endpoints for managing reproduction steps

**Endpoints:**
- `GET /api/defects/:defectId/steps` - List all steps for defect
- `POST /api/defects/:defectId/steps` - Create new step
- `PUT /api/defects/:defectId/steps/:stepId` - Update step description
- `DELETE /api/defects/:defectId/steps/:stepId` - Delete step (soft)
- `PUT /api/defects/:defectId/steps/reorder` - Bulk update sequences

**Acceptance Criteria:**
- ✅ All endpoints return proper JSON responses
- ✅ Step ID auto-generation follows format `<DEFECT_ID>-S###`
- ✅ Reorder endpoint validates sequence integrity
- ✅ Delete endpoint performs soft delete
- ✅ API enforces step ownership by defect

**Priority:** High  
**Estimated Points:** 5  
**Implements:** US-QC-010, US-QC-011, US-QC-012

---

### US-QC-IMPL-012: React Component - StepManager

**Description:** Create React component for managing structured reproduction steps

**Component Features:**
- Step list with drag-and-drop
- "+Add Step" button
- Inline edit for step descriptions
- Remove button per step with confirmation
- Up/Down arrow buttons for reordering
- Step ID badge with copy-to-clipboard
- Loading and error states

**Acceptance Criteria:**
- ✅ Component renders list of steps with sequence numbers
- ✅ Drag-and-drop uses `react-beautiful-dnd` or `dnd-kit`
- ✅ Add/remove operations update local state and API
- ✅ Optimistic UI updates with rollback on error
- ✅ Accessible (keyboard navigation, ARIA labels)

**Priority:** High  
**Estimated Points:** 8  
**Implements:** US-QC-010, US-QC-011, US-QC-012

---

### US-QC-IMPL-013: Step Reference Detection & Backlinks

**Description:** Implement step reference detection in commits, comments, test cases

**Tasks:**
- Create regex pattern for step ID detection (`/DEF-\w+-S\d{3}/g`)
- Create `step_references` table with columns:
  - `id`, `step_id` (FK), `reference_type` (commit|comment|test_case)
  - `reference_id`, `reference_url`, `created_at`
- Background job to scan commits and create references
- API endpoint to get references for a step
- UI component to display references (popover or panel)

**Acceptance Criteria:**
- ✅ System detects step IDs in commit messages
- ✅ References are stored in database
- ✅ UI shows reference count badge on step
- ✅ Clicking badge shows reference list with links
- ✅ Deep links work (e.g., `/defects/DEF-003?step=S002`)

**Priority:** Medium  
**Estimated Points:** 8  
**Implements:** US-QC-013

---

### US-QC-IMPL-014: Migration Tool - Textarea to Structured Steps

**Description:** Build migration utility to convert existing textarea steps

**Tasks:**
- Create parser for numbered lists (1. 2. 3. format)
- Create parser for bullet lists (- * • format)
- Create sentence-boundary detection fallback
- Migration script to process all existing defects
- UI button: "Convert to Structured Steps"
- Store original textarea in `legacy_steps_to_reproduce` column

**Acceptance Criteria:**
- ✅ Parser handles common step formats (numbered, bullets)
- ✅ Script successfully migrates 95%+ of defects
- ✅ Original text preserved in legacy field
- ✅ Manual conversion UI allows editing before save
- ✅ Conversion logs success/failure for audit

**Priority:** Medium  
**Estimated Points:** 5  
**Implements:** US-QC-014

---

## Database Schema

### Table: `reproduction_steps`

```sql
CREATE TABLE reproduction_steps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  defect_id VARCHAR(50) NOT NULL REFERENCES defects(id) ON DELETE CASCADE,
  step_id VARCHAR(10) NOT NULL, -- e.g., "S001", "S002"
  sequence INTEGER NOT NULL,
  description TEXT NOT NULL,
  expected_result TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP,
  CONSTRAINT unique_defect_step UNIQUE (defect_id, step_id)
);

CREATE INDEX idx_repro_steps_defect ON reproduction_steps(defect_id);
CREATE INDEX idx_repro_steps_sequence ON reproduction_steps(defect_id, sequence);
```

### Table: `step_references`

```sql
CREATE TABLE step_references (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  step_id UUID NOT NULL REFERENCES reproduction_steps(id) ON DELETE CASCADE,
  reference_type VARCHAR(50) NOT NULL, -- 'commit', 'comment', 'test_case'
  reference_id VARCHAR(100) NOT NULL,
  reference_url TEXT,
  reference_text TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_step_refs_step ON step_references(step_id);
CREATE INDEX idx_step_refs_type ON step_references(reference_type, reference_id);
```

---

## UI Mockup (Text-Based)

```
┌─────────────────────────────────────────────────────────────┐
│ Steps to Reproduce                          [+Add Step]      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ⠿  1  [S001]  Open the login page                    ↑ ↓ ✕ │
│                                                               │
│  ⠿  2  [S002]  Enter invalid credentials              ↑ ↓ ✕ │
│         (Referenced in: TC-456, commit abc123)              │
│                                                               │
│  ⠿  3  [S003]  Click the submit button                ↑ ↓ ✕ │
│                                                               │
│  ⠿  4  [S004]  Observe error message "Invalid creds"  ↑ ↓ ✕ │
│                                                               │
└─────────────────────────────────────────────────────────────┘

Legend:
⠿ = Drag handle
[S001] = Step ID badge (click to copy)
↑ ↓ = Move up/down
✕ = Remove step
```

---

## Success Metrics

1. **Adoption Rate**: 80% of new defects use structured steps within 2 weeks
2. **Step Traceability**: 30% of steps are referenced in commits or test cases
3. **Time Savings**: 25% reduction in defect clarification time
4. **Migration Success**: 95%+ of historical defects successfully migrated
5. **User Satisfaction**: 4.5/5 rating for step management feature

---

## Dependencies

- ✅ DEF-QC-007 resolved (Steps to Reproduce field exists)
- ✅ US-QC-001 complete (Defect Detail Page working)
- Drag-and-drop library: `@dnd-kit/core` or `react-beautiful-dnd`
- UUID generation for step IDs

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|----------|
| Complex UI with drag-and-drop | High | Use proven library, extensive testing |
| Migration failures on legacy data | Medium | Manual fallback option, preserve original |
| Step ID conflicts on concurrent edits | Low | Use UUID + step_id composite, optimistic locking |
| Performance with 100+ steps per defect | Low | Pagination or virtualization for large lists |

---

## Open Questions

1. Should steps support markdown or rich text formatting?
2. Should we allow attachments per step (screenshots)?
3. Should steps have sub-steps (nested structure)?
4. Should we auto-generate test cases from reproduction steps?

---

## Revision History

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2025-12-24 | 1.0 | Initial PRD creation | Product Team |

