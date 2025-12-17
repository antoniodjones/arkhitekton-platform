# ARKDL-0016: Quality Center Enhancements - Test Planning & Release Management

**Version:** 1.0
**Status:** Draft
**Date:** December 17, 2025
**Author:** Arkhitekton Platform Team

---

## 1. Executive Summary

The Quality Center currently provides defect tracking capabilities. To become a comprehensive quality management system, we need to add **Test Planning** capabilities and **Release & Launch Management** as a dedicated module.

---

## 2. Strategic Epics

| Epic ID | Epic Name | Description | Value Stream |
| :--- | :--- | :--- | :--- |
| **EPIC-QC-01** | **Test Planning & Execution** | Define, organize, and execute test cases with traceability to requirements. | Quality |
| **EPIC-QC-02** | **Release & Launch Management** | Coordinate release activities, launch checklists, and go-live decisions. | Delivery |

---

## 3. Module Structure

```
Quality Center (existing)
├── Dashboard ✅ (existing)
├── Defects ✅ (existing)
├── Test Plan (NEW - Tab within Quality Center)
│   ├── Test Suites
│   ├── Test Cases
│   └── Test Runs
└── Reports ✅ (existing)

Release & Launches (NEW - Left Nav Node under Quality)
├── Dashboard
├── Releases
├── Launch Checklists
└── Go/No-Go Board
```

---

## 4. User Stories

### A. TEST PLAN (Tab within Quality Center)

#### US-QC-101: Test Suite Management
* **Type:** New Feature
* **Epic:** EPIC-QC-01
* **Points:** 8
* **Description:**
    Create and organize test cases into hierarchical test suites for systematic coverage.
* **Acceptance Criteria:**
    ```gherkin
    Given I am on the Quality Center > Test Plan tab
    When I click "Create Test Suite"
    Then I should see a form with fields:
      | Field | Type |
      | Name | Text (required) |
      | Description | Rich Text |
      | Parent Suite | Dropdown (optional - for nesting) |
      | Associated Epic | Multi-select |
      | Associated Requirement | Multi-select |
    
    Given I have created test suites
    Then they should display in a collapsible tree view
    And show counts: Total Cases, Passed, Failed, Not Run
    ```

#### US-QC-102: Test Case Definition
* **Type:** New Feature
* **Epic:** EPIC-QC-01
* **Points:** 5
* **Description:**
    Define individual test cases with steps, expected results, and requirement traceability.
* **Acceptance Criteria:**
    ```gherkin
    Given I am creating a Test Case
    Then I should see fields:
      | Field | Type |
      | Title | Text (required) |
      | Preconditions | Rich Text |
      | Test Steps | Ordered list with Step/Expected Result pairs |
      | Priority | Dropdown: Critical, High, Medium, Low |
      | Test Type | Dropdown: Functional, Regression, Smoke, Integration, E2E |
      | Linked Requirements | Multi-select @mention |
      | Linked User Stories | Multi-select @mention |
    
    Given I save a test case
    Then it should appear under its parent Test Suite
    And the linked stories should show "Test Cases" in their Links tab
    ```

#### US-QC-103: Test Run Execution
* **Type:** New Feature
* **Epic:** EPIC-QC-01
* **Points:** 8
* **Description:**
    Execute test cases and record results with pass/fail status and evidence.
* **Acceptance Criteria:**
    ```gherkin
    Given I am executing a Test Run
    When I select a Test Suite
    Then I should see all Test Cases in a checklist format
    
    For each Test Case I should be able to:
      | Action | Result |
      | Mark as Passed | Green checkmark, timestamp recorded |
      | Mark as Failed | Red X, must provide notes, can attach screenshot |
      | Mark as Blocked | Yellow warning, must provide blocker reason |
      | Skip | Gray, excluded from metrics |
    
    Given I mark a test as Failed
    When I click "Create Defect"
    Then a defect should be auto-created with:
      - Title: "Test Failure: {Test Case Title}"
      - Linked Test Case ID
      - Linked User Story (from test case)
      - Attached screenshot (if provided)
    ```

#### US-QC-104: Test Coverage Matrix
* **Type:** New Feature
* **Epic:** EPIC-QC-01
* **Points:** 5
* **Description:**
    Visualize test coverage against requirements and user stories.
* **Acceptance Criteria:**
    ```gherkin
    Given I am on the Test Coverage Matrix
    Then I should see a grid:
      | Rows | Requirements or User Stories |
      | Columns | Test Cases |
      | Cells | Pass/Fail/Not Run status |
    
    And I should see a coverage percentage at the top
    And rows without any linked test cases should be highlighted in yellow (Untested)
    ```

---

### B. RELEASE & LAUNCHES (New Left Nav Module)

#### US-REL-101: Release Definition
* **Type:** New Feature
* **Epic:** EPIC-QC-02
* **Points:** 5
* **Description:**
    Define releases as containers for features, stories, and launch criteria.
* **Acceptance Criteria:**
    ```gherkin
    Given I am on Release & Launches > Releases
    When I create a new Release
    Then I should provide:
      | Field | Type |
      | Version | Text (e.g., "v2.1.0") |
      | Name | Text (e.g., "Winter 2025 Release") |
      | Target Date | Date picker |
      | Release Type | Dropdown: Major, Minor, Patch, Hotfix |
      | Description | Rich Text |
      | Included Epics | Multi-select |
      | Included Stories | Auto-populated from Epics + manual add |
    
    Given I view a Release
    Then I should see:
      - Completion percentage (Done stories / Total stories)
      - Defect count by severity
      - Test pass rate
    ```

#### US-REL-102: Launch Checklist
* **Type:** New Feature
* **Epic:** EPIC-QC-02
* **Points:** 8
* **Description:**
    Define and track launch readiness criteria with accountability.
* **Acceptance Criteria:**
    ```gherkin
    Given I am viewing a Release
    When I open the "Launch Checklist" tab
    Then I should see predefined categories:
      | Category | Example Items |
      | Development | All stories Done, No Critical defects |
      | QA | All test suites passed, Regression complete |
      | Documentation | Release notes, API docs updated |
      | Infrastructure | Deployment scripts tested, Rollback plan ready |
      | Stakeholders | Demo completed, Sign-off received |
    
    Each checklist item should have:
      - Checkbox (Complete/Not Complete)
      - Owner (assignee)
      - Due Date
      - Evidence/Link
      - Notes
    
    Given I complete all Critical items
    Then the release status should change to "Ready for Launch"
    ```

#### US-REL-103: Go/No-Go Decision Board
* **Type:** New Feature
* **Epic:** EPIC-QC-02
* **Points:** 5
* **Description:**
    A visual dashboard for launch decision meetings.
* **Acceptance Criteria:**
    ```gherkin
    Given I am on the Go/No-Go Board for a Release
    Then I should see:
      | Section | Content |
      | Release Health | Story completion %, Critical defects, Blockers |
      | Checklist Status | Category-by-category completion |
      | Risk Summary | Open risks with mitigation status |
      | Stakeholder Votes | Go/No-Go from each stakeholder |
    
    When all required stakeholders vote "Go"
    And all Critical checklist items are complete
    Then the "Launch" button should become enabled
    
    When I click "Launch"
    Then the Release status changes to "Released"
    And a Release Note is auto-generated
    And linked stories move to "Released" status
    ```

#### US-REL-104: Release Dashboard
* **Type:** New Feature
* **Epic:** EPIC-QC-02
* **Points:** 5
* **Description:**
    Overview of all releases with timeline and status.
* **Acceptance Criteria:**
    ```gherkin
    Given I am on Release & Launches > Dashboard
    Then I should see:
      - Upcoming Releases timeline (Gantt-style)
      - Current Release health card
      - Recent Releases history
      - Release velocity metrics (avg time from first commit to launch)
    ```

---

## 5. Enhancement Report (Plan Module Addition - Already Built)

#### US-PLAN-202: Enhancement Traceability Report
* **Type:** New Feature
* **Epic:** EPIC-11 (Sprint Lifecycle Management)
* **Points:** 5
* **Enhances:** US-WW9SP8C (Enhancement Story Metadata)
* **Description:**
    A dedicated tab to view all enhancement stories grouped by what they improve.
* **Acceptance Criteria:**
    ```gherkin
    Given I am on Plan > Enhancements tab
    Then I should see:
      - Stats by enhancement type (Feature Evolution, Bug Fix, UX, etc.)
      - Grouped view: Original stories with their enhancements listed
      - Flat table view with filters by Type, Status, Search
    
    Given I filter by "Bug Fix"
    Then only enhancement stories with type "Bug Fix" should display
    ```
* **Status:** ✅ IMPLEMENTED

---

## 6. Implementation Plan

**Sprint 1: Test Planning Foundation**
* US-QC-101 (Test Suite Management)
* US-QC-102 (Test Case Definition)

**Sprint 2: Test Execution**
* US-QC-103 (Test Run Execution)
* US-QC-104 (Test Coverage Matrix)

**Sprint 3: Release Management**
* US-REL-101 (Release Definition)
* US-REL-102 (Launch Checklist)

**Sprint 4: Launch Orchestration**
* US-REL-103 (Go/No-Go Board)
* US-REL-104 (Release Dashboard)

---

## 7. Database Schema Additions

### Test Management Tables

```sql
-- Test Suites
CREATE TABLE test_suites (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  parent_suite_id TEXT REFERENCES test_suites(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Test Cases
CREATE TABLE test_cases (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  suite_id TEXT REFERENCES test_suites(id),
  preconditions TEXT,
  steps JSONB, -- [{step: "", expected: ""}, ...]
  priority TEXT DEFAULT 'medium',
  test_type TEXT DEFAULT 'functional',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Test Runs
CREATE TABLE test_runs (
  id TEXT PRIMARY KEY,
  suite_id TEXT REFERENCES test_suites(id),
  release_id TEXT REFERENCES releases(id),
  run_by TEXT,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  status TEXT DEFAULT 'in-progress'
);

-- Test Results
CREATE TABLE test_results (
  id TEXT PRIMARY KEY,
  run_id TEXT REFERENCES test_runs(id),
  case_id TEXT REFERENCES test_cases(id),
  status TEXT, -- passed, failed, blocked, skipped
  notes TEXT,
  screenshot_url TEXT,
  executed_at TIMESTAMP
);
```

### Release Management Tables

```sql
-- Releases
CREATE TABLE releases (
  id TEXT PRIMARY KEY,
  version TEXT NOT NULL,
  name TEXT,
  description TEXT,
  target_date TIMESTAMP,
  actual_date TIMESTAMP,
  release_type TEXT DEFAULT 'minor',
  status TEXT DEFAULT 'planning', -- planning, development, testing, ready, released
  created_at TIMESTAMP DEFAULT NOW()
);

-- Release Stories (junction)
CREATE TABLE release_stories (
  release_id TEXT REFERENCES releases(id),
  story_id TEXT REFERENCES user_stories(id),
  PRIMARY KEY (release_id, story_id)
);

-- Launch Checklist Items
CREATE TABLE launch_checklist_items (
  id TEXT PRIMARY KEY,
  release_id TEXT REFERENCES releases(id),
  category TEXT NOT NULL,
  item TEXT NOT NULL,
  is_critical BOOLEAN DEFAULT FALSE,
  is_complete BOOLEAN DEFAULT FALSE,
  owner TEXT,
  due_date TIMESTAMP,
  evidence_url TEXT,
  notes TEXT,
  completed_at TIMESTAMP
);

-- Stakeholder Votes
CREATE TABLE stakeholder_votes (
  id TEXT PRIMARY KEY,
  release_id TEXT REFERENCES releases(id),
  stakeholder TEXT NOT NULL,
  vote TEXT, -- go, no-go, pending
  reason TEXT,
  voted_at TIMESTAMP
);
```

