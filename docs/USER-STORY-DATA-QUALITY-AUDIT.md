# User Story Data Quality Audit Report
**Date:** December 17, 2025  
**Auditor:** AI Assistant  
**Database:** Arkhitekton Production  
**Stories Analyzed:** 200

---

## 1. User Story Attributes Reference

| Attribute | Description | Field Type | Acceptable Values | Required | Notes |
|-----------|-------------|------------|-------------------|----------|-------|
| **id** | Unique story identifier | TEXT (PK) | Format: `US-XXXXXXX` | ✅ Yes | Auto-generated |
| **title** | Story title | TEXT | Any non-empty string | ✅ Yes | Max ~200 chars recommended |
| **description** | Detailed story description | TEXT | Markdown-formatted text | ❌ No | Should contain user story format: "As a... I want... so that..." |
| **acceptanceCriteria** | Gherkin-formatted acceptance criteria | TEXT | Must follow Gherkin format (Given/When/Then) | ✅ Yes | Should be in this field, NOT in description |
| **storyPoints** | Effort estimation | INTEGER | 1-13 (Fibonacci) | ✅ Yes | Default: 3 |
| **status** | Current workflow state | TEXT (ENUM) | `backlog`, `sprint`, `in-progress`, `review`, `done` | ✅ Yes | Default: `backlog` |
| **priority** | Story priority | TEXT (ENUM) | `low`, `medium`, `high` | ✅ Yes | Default: `medium` |
| **epicId** | Parent epic reference | TEXT (FK) | Format: `EPIC-XX` or `EPIC-XXXX-XX` | ❌ No | Must exist in `epics` table |
| **sprintId** | Sprint assignment | TEXT (FK) | Sprint ID from `sprints` table | ❌ No | Null if not in sprint |
| **assignee** | Developer assigned | TEXT | Email or name | ❌ No | - |
| **productManager** | Product owner | TEXT | Email or name | ❌ No | - |
| **techLead** | Technical lead | TEXT | Email or name | ❌ No | - |
| **feature** | Feature/capability name | TEXT | Plain text feature name | ❌ No | Used for grouping/sprint labels |
| **value** | Business value statement | TEXT | Plain text | ❌ No | - |
| **requirement** | Related requirement ID | TEXT | Requirement identifier (e.g., HLR-WIKI-001) | ❌ No | - |
| **enhances** | Stories this enhances | JSONB | Array of story IDs: `["US-XXX", "US-YYY"]` | ❌ No | For enhancement stories only |
| **enhancementType** | Type of enhancement | TEXT (ENUM) | `feature-evolution`, `bug-fix`, `ux-improvement`, `performance`, `refactoring`, `security`, `accessibility`, `technical-debt` | ❌ No | Required if `enhances` is populated |
| **rationale** | Enhancement justification | TEXT | Plain text | ❌ No | Business reason for enhancement |
| **targetDate** | Planned completion date | TIMESTAMP | ISO 8601 datetime | ❌ No | For roadmap planning |
| **startedAt** | Actual start date | TIMESTAMP | ISO 8601 datetime | ❌ No | Auto-set when status → `in-progress` |
| **completedAt** | Actual completion date | TIMESTAMP | ISO 8601 datetime | ❌ No | Auto-set when status → `done` |
| **githubRepo** | GitHub repository | TEXT | Repo name (e.g., `org/repo`) | ❌ No | - |
| **githubBranch** | Git branch name | TEXT | Branch name | ❌ No | - |
| **githubIssue** | GitHub issue number | INTEGER | Positive integer | ❌ No | - |
| **githubCommits** | Linked commits | JSONB | Array of commit objects | ❌ No | Auto-populated via webhook |
| **labels** | Story tags/labels | JSONB | Array of strings: `["wiki", "backend"]` | ❌ No | Default: `[]` |
| **screenshots** | Attached images | JSONB | Array of URLs | ❌ No | Default: `[]` |
| **relatedFiles** | Implementation files | JSONB | Array of file paths | ❌ No | Default: `[]` |
| **jiraIssueKey** | Jira integration | TEXT | Format: `PROJ-1234` | ❌ No | For synced stories |
| **documentationPageId** | Linked wiki page | TEXT | Page ID | ❌ No | - |
| **createdAt** | Creation timestamp | TIMESTAMP | ISO 8601 datetime | ✅ Yes | Auto-generated |
| **updatedAt** | Last update timestamp | TIMESTAMP | ISO 8601 datetime | ✅ Yes | Auto-updated |

---

## 2. Data Quality Metrics

### Overall Stats
| Metric | Count | Percentage |
|--------|-------|------------|
| **Total Stories** | 200 | 100% |
| **With Proper Acceptance Criteria** | 194 | 97% |
| **With Enhancement Type** | 10 | 5% |
| **With Epic Assignment** | 142 | 71% |
| **With Target Date** | 104 | 52% |

---

## 3. Data Quality Issues Found

### 🔴 CRITICAL ISSUES

#### Issue #1: Acceptance Criteria in Wrong Field
**Count:** 6 stories  
**Story IDs:** US-PLAN-202, US-PLAN-203, US-PLAN-204, US-PLAN-205, US-PLAN-206, US-PLAN-207

**Problem:**
- These stories have Gherkin acceptance criteria embedded in the `description` field
- The `acceptanceCriteria` field contains placeholder text: `"See description for Gherkin acceptance criteria."`
- This breaks Gherkin validation and prevents proper tooling integration

**Example (US-PLAN-202):**
```
description: "**Type:** Enhancement
**Enhances:** US-PLAN-201
**Epic:** EPIC-12

Add vibrant gradient colors...

## Acceptance Criteria

```gherkin
Given I am viewing the Roadmap
Then each Sprint/Epic row should have a unique gradient color
And the colors should cycle through a palette of 10 vibrant options
```"

acceptanceCriteria: "See description for Gherkin acceptance criteria."
```

**Expected:**
```
description: "**Type:** Enhancement
**Enhances:** US-PLAN-201

Add vibrant gradient colors to each swimlane row for visual distinction and fun."

acceptanceCriteria: "Given I am viewing the Roadmap
Then each Sprint/Epic row should have a unique gradient color
And the colors should cycle through a palette of 10 vibrant options
And the story bars within should also use coordinated colors"
```

---

#### Issue #2: Epic Reference in Description Instead of Field
**Count:** 1 story  
**Story ID:** US-PLAN-202

**Problem:**
- Story has `**Epic:** EPIC-12` in the description
- The `epicId` field is `null`
- This breaks epic-story relationships and prevents proper hierarchy queries

**Example (US-PLAN-202):**
```
description: "**Type:** Enhancement
**Enhances:** US-PLAN-201
**Epic:** EPIC-12  <-- Should be in epicId field

Add vibrant gradient colors..."

epicId: null  <-- Should be "EPIC-12"
```

**Expected:**
```
description: "**Type:** Enhancement
**Enhances:** US-PLAN-201

Add vibrant gradient colors..."

epicId: "EPIC-12"
```

---

### 🟡 MEDIUM ISSUES

#### Issue #3: Enhancement Metadata in Description
**Count:** 6 stories  
**Story IDs:** US-PLAN-202, US-PLAN-203, US-PLAN-204, US-PLAN-205, US-PLAN-206, US-PLAN-207

**Problem:**
- Stories have `**Type:** Enhancement` and `**Enhances:** US-XXX` in description
- These are structured metadata that should be in dedicated fields
- The `enhances` field IS properly populated, but description is redundant

**Example:**
```
description: "**Type:** Enhancement  <-- Redundant, already in enhancementType field
**Enhances:** US-PLAN-201  <-- Redundant, already in enhances array

Add vibrant gradient colors..."

enhances: ["US-PLAN-201"]  <-- Already stored here
enhancementType: "ui-improvement"  <-- Already stored here
```

**Expected:**
```
description: "Add vibrant gradient colors to each swimlane row for visual distinction and fun.

This enhancement extends the base roadmap by providing visual variety and making it easier to distinguish between different sprints/epics at a glance."

enhances: ["US-PLAN-201"]
enhancementType: "ui-improvement"
```

---

#### Issue #4: Missing Target Dates
**Count:** 96 stories (48%)

**Problem:**
- Nearly half of all stories lack `targetDate`
- This prevents proper roadmap visualization and sprint planning
- Stories cannot appear on timeline views

**Impact:**
- Roadmap shows "No stories with dates"
- Sprint velocity calculations may be inaccurate
- Cannot track planned vs actual delivery

**Recommendation:**
- Backlog stories: Set tentative target dates based on priority
- Sprint stories: Set target date = sprint end date
- Done stories: Set target date = completed date (retroactive)

---

#### Issue #5: Missing Epic Assignments
**Count:** 58 stories (29%)

**Problem:**
- Stories exist without epic context
- Makes it difficult to track epic progress and dependencies
- Breaks down feature-level planning

**Affected Story Patterns:**
- Most US-PLAN-* stories (Plan module enhancements)
- Some older stories from initial development

**Recommendation:**
- Review unassigned stories and link to appropriate epics
- Create new epics if needed for coherent grouping

---

### 🟢 LOW ISSUES

#### Issue #6: Inconsistent Description Format
**Count:** Variable

**Problem:**
- Some stories use markdown headers (`##`, `###`)
- Others use bold text (`**Title:**`)
- User story format ("As a... I want... so that...") not consistently applied

**Example Variations:**
```
// Good - User story format
"As an architect, I want to view previous versions of a page so that I can see how it evolved."

// Acceptable - Direct description
"Add vibrant gradient colors to each swimlane row for visual distinction and fun."

// Poor - Markdown bloat
"**Type:** Enhancement
**Enhances:** US-PLAN-201
**Epic:** EPIC-12

## Description
Add vibrant gradient colors...

## Acceptance Criteria
```gherkin
...
```"
```

**Recommendation:**
- Use structured fields (epicId, enhances, enhancementType) instead of markdown metadata
- Keep description focused on the "what" and "why"
- Reserve markdown for formatting within the description (lists, code, emphasis)

---

## 4. Data Cleansing Strategy

### Phase 1: Critical Fixes (Immediate)
1. **Extract Gherkin from Description → acceptanceCriteria** (6 stories)
   - US-PLAN-202, US-PLAN-203, US-PLAN-204, US-PLAN-205, US-PLAN-206, US-PLAN-207
   - Parse `## Acceptance Criteria` section from description
   - Extract Gherkin block
   - Update `acceptanceCriteria` field
   - Remove Gherkin section from description

2. **Move Epic Reference to Field** (1 story)
   - US-PLAN-202
   - Extract `**Epic:** EPIC-12` from description
   - Set `epicId = "EPIC-12"`
   - Remove epic line from description

### Phase 2: Enhancement Cleanup (High Priority)
3. **Remove Redundant Enhancement Metadata from Description** (6 stories)
   - Remove `**Type:** Enhancement` lines (data already in `enhancementType`)
   - Remove `**Enhances:** US-XXX` lines (data already in `enhances` array)
   - Keep only the core description text

### Phase 3: Backfill Missing Data (Medium Priority)
4. **Add Target Dates to Stories** (96 stories)
   - Backlog: Set tentative dates based on priority and sprint capacity
   - Done: Use `completedAt` as `targetDate` (retroactive)
   - In-progress: Set based on current sprint end date

5. **Assign Stories to Epics** (58 stories)
   - Group by feature/theme
   - Link to existing or new epics

### Phase 4: Description Standardization (Low Priority)
6. **Standardize Description Format**
   - Apply user story format where appropriate
   - Remove markdown headers and metadata blocks
   - Keep descriptions concise and value-focused

---

## 5. Proposed Cleanup Script

### Option A: Automated Script
Create a migration script (`scripts/cleanup-story-data.ts`) that:
1. Identifies affected stories
2. Parses and extracts misplaced data
3. Updates fields correctly
4. Logs all changes for review
5. Creates a backup before applying changes

### Option B: Manual Review
Export affected stories to CSV/JSON for manual review and correction.

### Option C: Hybrid Approach
1. Auto-fix obvious issues (Gherkin extraction, epic references)
2. Manual review for target dates and epic assignments
3. Bulk update descriptions after review

---

## 6. Prevention Measures

### Immediate Actions:
1. ✅ Update seed scripts to use proper field structure
2. ✅ Enhance UI validation to prevent Gherkin in description
3. ⬜ Add database constraints for required relationships
4. ⬜ Create story templates with proper field structure

### Future Enhancements:
1. Add real-time validation in StoryDetailSheet
2. Show warnings when metadata is detected in description
3. Provide "Extract to Fields" button when issues are detected
4. Add data quality dashboard showing field completeness

---

## 7. Summary

### Stories Requiring Cleanup: **106 / 200 (53%)**

| Issue Category | Count | Priority |
|----------------|-------|----------|
| Gherkin in wrong field | 6 | 🔴 Critical |
| Epic in description | 1 | 🔴 Critical |
| Enhancement metadata in description | 6 | 🟡 Medium |
| Missing target dates | 96 | 🟡 Medium |
| Missing epic assignments | 58 | 🟡 Medium |
| Inconsistent description format | Variable | 🟢 Low |

### Recommendation:
**Proceed with automated cleanup for Critical issues (7 stories), followed by manual review for Medium issues.**

---

## 8. Next Steps

Awaiting your decision on:
1. Which issues to fix (all, critical only, specific categories)
2. Approach (automated, manual, hybrid)
3. Backup strategy before making changes
4. Whether to update existing stories or just fix going forward


