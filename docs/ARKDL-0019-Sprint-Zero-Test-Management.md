# ARKDL-0019: Sprint Zero — Test Management Foundation

**Sprint:** Sprint 0 (Before Wiki Sprint W1)  
**Version:** 1.0  
**Date:** December 17, 2025  
**Target Completion:** December 27, 2025 (10 days)  
**Team Velocity:** 30-35 story points  
**Status:** 🟡 Ready to Start

---

## Executive Summary

**The Situation:** We created a comprehensive test plan for Wiki Sprint W1, but we have no test management system to execute it in! 🤦‍♂️

**The Solution:** Build a minimal but functional Test Management system in **10 days** so we can properly test the Wiki (and everything else).

**The Scope:** Test Suites, Test Cases, Test Runs, and basic traceability to User Stories. NO Release Management (that's Sprint 3-4).

---

## Strategic Goals

1. ✅ **Eat Our Own Dog Food** — Use Arkhitekton to test Arkhitekton
2. ✅ **Traceability** — Link test cases to user stories for coverage tracking
3. ✅ **Efficiency** — Quick test execution with pass/fail tracking
4. ✅ **Quality Gates** — Block releases if critical tests fail
5. ✅ **Ship Fast** — Deliver in 10 days, iterate later

---

## User Stories (32 points)

### 📦 Phase 1: Foundation (15 points)

#### US-QC-101: Test Suite Management
**Points:** 5  
**Epic:** EPIC-QC-01  
**Priority:** P0 (Critical)

**Description:**
Create hierarchical test suites to organize test cases by feature, module, or sprint.

**Acceptance Criteria:**
```gherkin
Feature: Test Suite Management

Background:
  Given I am on Quality Center > Test Plan tab

Scenario: Create a test suite
  When I click "New Test Suite"
  Then I should see a form with fields:
    | Field | Type | Required |
    | Name | Text | Yes |
    | Description | Rich Text | No |
    | Parent Suite | Dropdown | No |
    | Module | Dropdown: Plan, Wiki, Quality, Design | No |
  
  When I save with name "Wiki Sprint W1 Tests"
  Then the suite should appear in the suite tree
  And it should show counts: 0 cases, 0 passed, 0 failed

Scenario: Create nested suites
  Given I have a suite "Wiki Sprint W1"
  When I create a child suite "Auto-save Tests" under it
  Then the tree should show:
    📁 Wiki Sprint W1 (0 cases)
      └─ 📁 Auto-save Tests (0 cases)

Scenario: Suite metrics auto-update
  Given suite "Auto-save Tests" has 5 test cases
  And 3 have passed, 1 has failed, 1 is not run
  Then the suite should display:
    ✅ 3 passed | ❌ 1 failed | ⚪ 1 not run | 📊 60% pass rate
```

---

#### US-QC-102: Test Case Definition
**Points:** 5  
**Epic:** EPIC-QC-01  
**Priority:** P0 (Critical)

**Description:**
Define test cases with steps, expected results, and traceability to user stories.

**Acceptance Criteria:**
```gherkin
Feature: Test Case Definition

Scenario: Create a test case
  Given I am in test suite "Auto-save Tests"
  When I click "New Test Case"
  Then I should see a form with:
    | Field | Type | Required |
    | ID | Auto-generated (TC-XXX-##) | Yes |
    | Title | Text | Yes |
    | Preconditions | Rich Text | No |
    | Test Steps | Ordered list | Yes |
    | Priority | Dropdown: Critical, High, Medium, Low | Yes |
    | Test Type | Dropdown: Functional, Regression, Smoke, Integration, E2E, Manual | Yes |
    | Linked Stories | Multi-select @mention | No |
    | Tags | Multi-select | No |

Scenario: Add test steps with expected results
  Given I am creating test case "Auto-save triggers after 30s"
  When I add steps:
    | Step | Expected Result |
    | Open wiki page editor | Editor loads |
    | Type "Test content" | Content appears |
    | Wait 30 seconds | Draft saved indicator appears |
  Then the steps should be numbered automatically
  And I should be able to reorder via drag-drop

Scenario: Link test case to user story
  Given I am creating a test case
  When I type "@US-WIKI-001" in the Linked Stories field
  Then the mention picker should appear
  And selecting it should create a link
  
  Given I save the test case
  When I view US-WIKI-001 in the Plan module
  Then I should see a "Test Cases" tab
  And this test case should appear in the list

Scenario: Auto-generate test ID
  Given I create a test case in suite "TC-WIKI-001"
  Then the ID should be "TC-WIKI-001-01"
  And the next case should be "TC-WIKI-001-02"
```

---

#### US-QC-103: Test Case Detail View
**Points:** 3  
**Epic:** EPIC-QC-01  
**Priority:** P1 (High)

**Description:**
View and edit test case details in a clean, readable format.

**Acceptance Criteria:**
```gherkin
Feature: Test Case Detail View

Scenario: View test case details
  Given I click on test case "TC-WIKI-001-01"
  Then I should see a detail panel with tabs:
    | Tab | Content |
    | Details | Steps, preconditions, expected results |
    | Execution History | Past test runs with results |
    | Links | Linked user stories and requirements |
  
Scenario: Edit test case inline
  Given I am viewing a test case
  When I click the "Edit" button
  Then all fields should become editable
  And I should see [Save] [Cancel] buttons

Scenario: Copy test case
  Given I am viewing test case "TC-WIKI-001-01"
  When I click "..." → "Duplicate"
  Then a new test case should be created: "TC-WIKI-001-02"
  With identical steps and fields
```

---

#### US-QC-104: Test Suite Tree Navigation
**Points:** 2  
**Epic:** EPIC-QC-01  
**Priority:** P1

**Description:**
Collapsible tree view for navigating test suites with search and filters.

**Acceptance Criteria:**
```gherkin
Feature: Test Suite Navigation

Scenario: Collapse/expand suites
  Given I have nested suites
  When I click the chevron icon
  Then the suite should collapse/expand
  And the state should persist on page refresh

Scenario: Search test cases
  Given I type "auto-save" in the search box
  Then matching test cases should be highlighted
  And non-matching cases should be dimmed

Scenario: Filter by status
  Given I select filter "Failed Tests Only"
  Then only test cases with failed last run should show
  And the count should update: "3 of 50 cases"
```

---

### 🧪 Phase 2: Test Execution (12 points)

#### US-QC-105: Test Run Creation
**Points:** 3  
**Epic:** EPIC-QC-01  
**Priority:** P0

**Description:**
Create a test run to execute a suite of test cases.

**Acceptance Criteria:**
```gherkin
Feature: Test Run Creation

Scenario: Start a new test run
  Given I am viewing test suite "Wiki Sprint W1"
  When I click "Run Tests"
  Then I should see a dialog:
    | Field | Type |
    | Run Name | Text (auto: "Run on Dec 17, 2025") |
    | Test Suite | Pre-filled |
    | Assigned To | User picker |
    | Environment | Dropdown: Local, Staging, Production |
  
  When I click "Start Run"
  Then a test run should be created with status "In Progress"
  And I should navigate to the execution screen

Scenario: Test run inherits suite cases
  Given suite "Auto-save Tests" has 5 test cases
  When I start a test run
  Then all 5 cases should be listed as "Not Run"
  And I should see progress: 0/5 executed (0%)
```

---

#### US-QC-106: Test Execution Interface
**Points:** 5  
**Epic:** EPIC-QC-01  
**Priority:** P0

**Description:**
Execute test cases one-by-one, marking pass/fail/blocked status.

**Acceptance Criteria:**
```gherkin
Feature: Test Execution Interface

Scenario: Execute a test case
  Given I am in an active test run
  When I view test case "TC-WIKI-001-01"
  Then I should see:
    - Test steps with checkboxes
    - Expected results for each step
    - Action buttons: [Pass] [Fail] [Block] [Skip]

Scenario: Mark test as Passed
  Given I am executing a test case
  When I click "Pass"
  Then the status should change to "✅ Passed"
  And a timestamp should be recorded
  And the test should be marked as complete
  And progress should update: 1/5 executed (20%)

Scenario: Mark test as Failed
  Given I am executing a test case
  When I click "Fail"
  Then I should see a required field: "Failure Notes"
  And an optional field: "Screenshot Upload"
  
  When I provide notes and click "Submit"
  Then the status should change to "❌ Failed"
  And I should see a button: "Create Defect"

Scenario: Create defect from failed test
  Given I have marked a test as Failed
  When I click "Create Defect"
  Then a defect should be pre-filled with:
    | Field | Value |
    | Title | "Test Failure: {Test Case Title}" |
    | Description | Test steps + Expected vs Actual |
    | Linked Test Case | TC-WIKI-001-01 |
    | Linked User Story | US-WIKI-001 (from test case) |
    | Severity | Critical |
  And I should be taken to the defect form to complete it

Scenario: Mark test as Blocked
  Given I am executing a test case
  When I click "Block"
  Then I should provide: "Blocker Reason"
  And the status should change to "🚫 Blocked"
  And it should not count toward pass/fail rate

Scenario: Skip test
  Given I am executing a test case
  When I click "Skip"
  Then the status should change to "⊘ Skipped"
  And it should not count toward pass/fail rate
```

---

#### US-QC-107: Test Run Results & Reporting
**Points:** 4  
**Epic:** EPIC-QC-01  
**Priority:** P1

**Description:**
View test run results with metrics, charts, and export capability.

**Acceptance Criteria:**
```gherkin
Feature: Test Run Results

Scenario: View test run summary
  Given I have completed a test run
  When I view the run summary
  Then I should see:
    | Metric | Value |
    | Total Cases | 50 |
    | Passed | 42 (84%) |
    | Failed | 5 (10%) |
    | Blocked | 2 (4%) |
    | Skipped | 1 (2%) |
    | Duration | 2h 15m |
    | Pass Rate | 84% |
  
  And I should see a pie chart of results
  And a list of failed tests with links

Scenario: Filter results
  Given I am viewing test run results
  When I click "Show Failed Only"
  Then only the 5 failed tests should display
  And each should show failure notes and screenshots

Scenario: Export test results
  Given I am viewing test run results
  When I click "Export"
  Then I should get options:
    - CSV (for spreadsheet)
    - PDF (for reports)
    - JSON (for CI/CD integration)
  
  When I select CSV
  Then a file should download with:
    Test ID | Title | Status | Executed By | Executed At | Notes
```

---

### 🔗 Phase 3: Traceability (5 points)

#### US-QC-108: Test Coverage Dashboard
**Points:** 3  
**Epic:** EPIC-QC-01  
**Priority:** P1

**Description:**
Visualize test coverage across user stories and features.

**Acceptance Criteria:**
```gherkin
Feature: Test Coverage Dashboard

Scenario: View overall coverage
  Given I am on Quality Center > Dashboard
  Then I should see a "Test Coverage" card with:
    | Metric | Value |
    | Total User Stories | 200 |
    | Stories with Test Cases | 150 (75%) |
    | Stories without Tests | 50 (25% - Warning) |
    | Total Test Cases | 320 |
    | Last Test Run | Dec 17, 2025 - 84% pass |

Scenario: View coverage by module
  Given I am on the coverage dashboard
  Then I should see a breakdown:
    | Module | Stories | Tests | Coverage |
    | Plan | 50 | 45 | 90% ✅ |
    | Wiki | 50 | 35 | 70% 🟡 |
    | Quality | 30 | 20 | 67% 🟡 |
    | Design | 70 | 50 | 71% 🟡 |

Scenario: Identify untested stories
  Given I click "Show Untested Stories"
  Then I should see a list of 50 stories
  With a warning: "These stories have no test cases"
  And a button: "Create Test Cases"
```

---

#### US-QC-109: Test Cases Tab in Story Detail
**Points:** 2  
**Epic:** EPIC-QC-01  
**Priority:** P1

**Description:**
Show linked test cases directly in the user story detail view.

**Acceptance Criteria:**
```gherkin
Feature: Test Cases in Story Detail

Scenario: View linked test cases
  Given I open user story "US-WIKI-001"
  When I click the "Test Cases" tab
  Then I should see all linked test cases:
    | Test ID | Title | Type | Last Result | Last Run |
    | TC-WIKI-001-01 | Auto-save triggers after 30s | Functional | ✅ Passed | Dec 16 |
    | TC-WIKI-001-02 | Auto-save during typing | Functional | ❌ Failed | Dec 16 |
  
  And I should see a summary:
    2 test cases | 1 passed, 1 failed | 50% pass rate

Scenario: Navigate to test case
  Given I am viewing the Test Cases tab
  When I click on "TC-WIKI-001-01"
  Then I should navigate to the test case detail view

Scenario: Create test case from story
  Given I am on the Test Cases tab for a story
  When I click "New Test Case"
  Then a test case should be pre-filled with:
    - Linked Story: US-WIKI-001
    - Title: "[Story Title] - Test Case"
    - Suite: Auto-detect from story's module
```

---

## Database Schema

```sql
-- Test Suites
CREATE TABLE test_suites (
  id TEXT PRIMARY KEY, -- TS-XXX format
  name TEXT NOT NULL,
  description TEXT,
  parent_suite_id TEXT REFERENCES test_suites(id),
  module TEXT, -- plan, wiki, quality, design
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Test Cases
CREATE TABLE test_cases (
  id TEXT PRIMARY KEY, -- TC-XXX-## format
  suite_id TEXT REFERENCES test_suites(id) NOT NULL,
  title TEXT NOT NULL,
  preconditions TEXT,
  steps JSONB NOT NULL, -- [{step: "", expected: ""}, ...]
  priority TEXT DEFAULT 'medium', -- critical, high, medium, low
  test_type TEXT DEFAULT 'functional', -- functional, regression, smoke, integration, e2e, manual
  tags JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Test Case to Story Links (junction table)
CREATE TABLE test_case_stories (
  test_case_id TEXT REFERENCES test_cases(id) ON DELETE CASCADE,
  story_id TEXT REFERENCES user_stories(id) ON DELETE CASCADE,
  PRIMARY KEY (test_case_id, story_id)
);

-- Test Runs
CREATE TABLE test_runs (
  id TEXT PRIMARY KEY, -- TR-XXX format
  suite_id TEXT REFERENCES test_suites(id) NOT NULL,
  name TEXT NOT NULL,
  assigned_to TEXT,
  environment TEXT DEFAULT 'staging', -- local, staging, production
  status TEXT DEFAULT 'in-progress', -- in-progress, completed, cancelled
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Test Results (execution records)
CREATE TABLE test_results (
  id TEXT PRIMARY KEY,
  run_id TEXT REFERENCES test_runs(id) ON DELETE CASCADE NOT NULL,
  case_id TEXT REFERENCES test_cases(id) NOT NULL,
  status TEXT NOT NULL, -- passed, failed, blocked, skipped, not-run
  notes TEXT,
  screenshot_url TEXT,
  executed_by TEXT,
  executed_at TIMESTAMP,
  duration_ms INTEGER, -- how long the test took
  created_at TIMESTAMP DEFAULT NOW()
);

-- Test Result Defects (link failed tests to defects)
CREATE TABLE test_result_defects (
  result_id TEXT REFERENCES test_results(id) ON DELETE CASCADE,
  defect_id TEXT REFERENCES defects(id) ON DELETE CASCADE,
  PRIMARY KEY (result_id, defect_id)
);
```

---

## API Endpoints

### Test Suites
- `GET /api/test-suites` — List all suites (tree)
- `GET /api/test-suites/:id` — Get suite details
- `POST /api/test-suites` — Create suite
- `PATCH /api/test-suites/:id` — Update suite
- `DELETE /api/test-suites/:id` — Delete suite

### Test Cases
- `GET /api/test-cases?suiteId=TS-001` — List cases in suite
- `GET /api/test-cases/:id` — Get case details
- `POST /api/test-cases` — Create case
- `PATCH /api/test-cases/:id` — Update case
- `DELETE /api/test-cases/:id` — Delete case
- `GET /api/test-cases/:id/executions` — Get execution history

### Test Runs
- `GET /api/test-runs` — List all runs
- `GET /api/test-runs/:id` — Get run details + results
- `POST /api/test-runs` — Create/start run
- `PATCH /api/test-runs/:id` — Update run (complete, cancel)
- `POST /api/test-runs/:id/results` — Record test result
- `GET /api/test-runs/:id/summary` — Get metrics

### Coverage
- `GET /api/test-coverage/dashboard` — Overall coverage metrics
- `GET /api/test-coverage/stories` — Stories with/without tests
- `GET /api/test-coverage/modules` — Coverage by module

---

## Implementation Plan

### Day 1-2: Database & API (Backend)
- [ ] Create schema migration
- [ ] Implement storage layer (Drizzle ORM)
- [ ] Build API endpoints
- [ ] Unit tests for API

### Day 3-4: Test Suite & Case Management (Frontend)
- [ ] Test Plan tab in Quality Center
- [ ] Test Suite tree component
- [ ] Test Case form & detail view
- [ ] Link test cases to stories

### Day 5-6: Test Execution
- [ ] Test Run creation flow
- [ ] Test execution interface
- [ ] Pass/Fail/Block/Skip actions
- [ ] Create defect from failed test

### Day 7-8: Results & Reporting
- [ ] Test run summary view
- [ ] Results filtering & search
- [ ] Export to CSV/PDF
- [ ] Test Cases tab in StoryDetailSheet

### Day 9: Coverage & Polish
- [ ] Coverage dashboard
- [ ] Untested stories list
- [ ] UI polish & bug fixes

### Day 10: Testing & Documentation
- [ ] Test the test system (meta! 🤯)
- [ ] Update documentation
- [ ] Demo & sign-off

---

## Success Criteria

Sprint Zero is DONE when:
- ✅ Can create test suites and test cases
- ✅ Can link test cases to user stories
- ✅ Can execute a test run and record results
- ✅ Failed tests can create defects
- ✅ Test coverage dashboard shows metrics
- ✅ Story detail view shows linked test cases
- ✅ **We can use it to test Wiki Sprint W1!**

---

## GitHub Integration

**Branch:** `feature/sprint-0-test-management`  
**Milestone:** Sprint 0  
**Labels:** `quality-center`, `test-management`, `sprint-0`

**Story Branches:**
- `feature/us-qc-101-test-suites`
- `feature/us-qc-102-test-cases`
- `feature/us-qc-103-test-detail`
- `feature/us-qc-104-suite-navigation`
- `feature/us-qc-105-test-runs`
- `feature/us-qc-106-test-execution`
- `feature/us-qc-107-results-reporting`
- `feature/us-qc-108-coverage-dashboard`
- `feature/us-qc-109-story-test-tab`

---

## Out of Scope (Future Sprints)

- ❌ Release Management (Sprint 3-4)
- ❌ Launch Checklists (Sprint 3-4)
- ❌ Automated test execution (later)
- ❌ CI/CD integration (later)
- ❌ Performance testing (later)
- ❌ Test data management (later)

---

## Notes

This is a **MINIMUM VIABLE TEST SYSTEM**. We're building just enough to properly test the Wiki, then we'll iterate based on real usage. The goal is 10 days, not perfection.

**Let's eat our own dog food! 🐕🍽️**


