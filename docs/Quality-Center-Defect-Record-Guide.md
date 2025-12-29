# Quality Center: Defect Record Guide

## 📋 Overview

**Purpose**: Track software bugs/issues from discovery through resolution, enabling quality assurance teams to manage, prioritize, and resolve defects systematically while maintaining full traceability to user stories and code changes.

**Module**: Quality Center  
**Entity Type**: Defect  
**Lifecycle**: Open → In Progress → Resolved → Closed

---

## 👥 Personas & Use Cases

### 1. **QA Engineer**
- **Primary User**: Creates and tracks defects during testing
- **Key Actions**:
  - Log new defects with detailed steps to reproduce
  - Verify fixes and update status to resolved/closed
  - Track defect trends and quality metrics
  - Link defects to test cases and user stories

### 2. **Software Developer**
- **Role**: Investigates and fixes defects
- **Key Actions**:
  - Review assigned defects and understand reproduction steps
  - Document root cause analysis
  - Implement fixes and link to GitHub PRs/commits
  - Update resolution details

### 3. **Product Manager**
- **Role**: Prioritizes defects and assesses business impact
- **Key Actions**:
  - Review critical/high severity defects
  - Prioritize defects for upcoming sprints
  - Track resolution timelines and quality trends
  - Communicate with stakeholders about quality status

### 4. **Project Manager**
- **Role**: Tracks defect metrics and team performance
- **Key Actions**:
  - Monitor defect burn-down rates
  - Identify bottlenecks in resolution process
  - Report on quality metrics to leadership
  - Forecast release readiness based on defect counts

### 5. **Business Analyst**
- **Role**: Links defects to affected requirements
- **Key Actions**:
  - Connect defects to user stories
  - Document business impact of defects
  - Validate that fixes meet acceptance criteria
  - Update requirements if defects reveal gaps

---

## 🏗️ Field Breakdown

### Core Identity Fields

| Field | Description | Type | Required | Example |
|-------|-------------|------|----------|---------|
| **ID** | Unique defect identifier | `string` | ✅ Yes | `DEF-SEARCH-003` |
| **Title** | Brief, descriptive summary | `string (100 chars)` | ✅ Yes | `Global Search Returns No Results for Commit SHAs` |
| **Description** | Detailed explanation of the defect | `text (markdown)` | ❌ No | See full template below |

**Description Template**:
```markdown
## Issue
When searching for commit SHAs (e.g., "3f4e05f") in the global search,
no results are returned even though the code change search logic is implemented.

## Environment
- Browser: Chrome 120
- OS: macOS 14.1
- Environment: Development

## Additional Context
- Feature was recently implemented in US-SEARCH-007
- Backend search logic appears correct
- Database may be missing test data
```

### Severity & Priority

| Field | Description | Possible Values | Required | Business Impact |
|-------|-------------|-----------------|----------|-----------------|
| **Severity** | Technical impact on system functionality | <ul><li>`critical`: System down, data loss</li><li>`high`: Major feature broken</li><li>`medium`: Feature partially impaired</li><li>`low`: Minor issue, cosmetic</li></ul> | ✅ Yes | How badly is the system affected? |
| **Priority** | Business urgency for fixing | <ul><li>`critical`: Fix immediately (< 24h)</li><li>`high`: Fix this sprint</li><li>`medium`: Fix next sprint</li><li>`low`: Fix when convenient</li></ul> | ✅ Yes | How soon must this be fixed? |

**Priority Matrix**:
```
┌──────────────────────────────────────────────────────┐
│ Severity vs Priority Matrix                         │
├──────────────────────────────────────────────────────┤
│           │  Critical  │   High    │  Medium  │ Low │
├──────────────────────────────────────────────────────┤
│ Critical  │  P0 (Now)  │  P1 (24h) │  P2 (48h)│ P3  │
│ High      │  P1 (24h)  │  P2 (48h) │  P3      │ P4  │
│ Medium    │  P2 (48h)  │  P3       │  P4      │ P5  │
│ Low       │  P3        │  P4       │  P5      │ P6  │
└──────────────────────────────────────────────────────┘
```

### Status & Lifecycle

| Field | Description | Possible Values | Transitions |
|-------|-------------|-----------------|-------------|
| **Status** | Current state in defect lifecycle | <ul><li>`open`: Just logged, not started</li><li>`in_progress`: Actively being fixed</li><li>`resolved`: Fix implemented, needs verification</li><li>`closed`: Verified and complete</li><li>`rejected`: Not a defect (by design)</li><li>`deferred`: Will fix in future release</li></ul> | <ul><li>`open` → `in_progress`</li><li>`in_progress` → `resolved`</li><li>`resolved` → `closed`</li><li>`any` → `rejected` / `deferred`</li></ul> |

**Status Workflow**:
```
┌────────┐                                      
│  Open  │──────┐                               
└────────┘      │                               
      │         ▼                                
      │    ┌──────────┐                          
      └───>│ Rejected │                          
           └──────────┘                          
      │                                          
      ▼                                          
┌──────────────┐      ┌──────────┐      ┌────────┐
│ In Progress  │─────>│ Resolved │─────>│ Closed │
└──────────────┘      └──────────┘      └────────┘
      │                                          
      ▼                                          
┌──────────┐                                     
│ Deferred │                                     
└──────────┘                                     
```

### Analysis Fields

| Field | Description | When to Fill | Example | Schema Column |
|-------|-------------|--------------|---------|---------------|
| **Steps to Reproduce** | Numbered steps to recreate the bug | **At logging** (QA Engineer) | `1. Open app\n2. Press CMD+K\n3. Search "3f4e05f"\n4. Observe: No results` | `stepsToReproduce` |
| **Expected Behavior** | What should happen (correct behavior) | **At logging** (QA Engineer) | `Search should return DEF-SEARCH-001 with commit metadata and linked stories` | `expectedBehavior` |
| **Actual Behavior** | What actually happens (incorrect behavior) | **At logging** (QA Engineer) | `Search returns "No results for '3f4e05f'" message` | `actualBehavior` |
| **Root Cause** | Technical reason for the defect | **After investigation** (Developer) | `The codeChanges table is empty. No test data exists to validate the PR/Commit search functionality.` | `rootCause` |
| **Resolution** | How the defect was fixed | **After fix** (Developer) | `Seeded test data using scripts/seed-def-search-003.ts. Created 6 code change records linking commits 3f4e05f and b2c6af7 to relevant stories.` | `resolution` |

### Relationship Fields

| Field | Description | Purpose | Possible Values | Schema Column |
|-------|-------------|---------|-----------------|---------------|
| **Linked Story** | User story this defect relates to | Traceability to requirements | `US-SEARCH-008`, `US-PLAN-101`, etc. | `userStoryId` |
| **Discovered By** | Person who found the defect | Accountability & follow-up | User ID or name | `discoveredBy` |
| **Assigned To** | Person responsible for fixing | Work allocation | User ID or name | `assignedTo` |

### Code Change Links

| Field | Description | Source | Example |
|-------|-------------|--------|---------|
| **GitHub PR** | Pull request that fixed this defect | Automatically linked via commit messages | `PR #125: fix: DEF-SEARCH-003` |
| **Commit SHA** | Git commit that resolved the defect | Parsed from PR | `b3c985f` |
| **Related Stories** | Other stories in the same commit | Derived from code changes | `US-SEARCH-008`, `DEF-SEARCH-001` |

### Metadata Fields

| Field | Description | Type | Auto-Generated | Format |
|-------|-------------|------|----------------|--------|
| **Created** | When defect was first logged | `timestamp` | ✅ Yes | `Dec 24, 2025 10:30 AM` |
| **Updated** | Last modification timestamp | `timestamp` | ✅ Yes (on any update) | `Dec 24, 2025 2:45 PM` |
| **Resolved At** | When status changed to resolved | `timestamp` | ✅ Yes (on status change) | `Dec 24, 2025 5:00 PM` |

---

## 📊 Quality Metrics

### Defect KPIs

| Metric | Formula | Target | Purpose |
|--------|---------|--------|---------|
| **Defect Density** | `Total Defects / Story Points Delivered` | `< 0.1` (1 defect per 10 points) | Measure code quality |
| **Defect Detection Rate** | `Defects Found in Testing / Total Defects` | `> 80%` | Measure test effectiveness |
| **Mean Time to Resolve (MTTR)** | `Avg(Resolved At - Created At)` | `< 3 days` | Measure fix efficiency |
| **Defect Escape Rate** | `Production Defects / Total Defects` | `< 10%` | Measure QA effectiveness |
| **Reopen Rate** | `Reopened Defects / Total Resolved` | `< 5%` | Measure fix quality |

### Severity Distribution Target
```
Critical: < 5%   ████░░░░░░░░░░░░░░░░  (5%)
High:     < 15%  ███████░░░░░░░░░░░░░ (15%)
Medium:   30-40% ████████████░░░░░░░░ (35%)
Low:      40-60% ████████████████░░░░ (45%)
```

---

## ✅ Best Practices

### 1. **Writing Clear Defect Titles**
❌ **Bad**: "Search doesn't work"  
✅ **Good**: "Global Search Returns No Results for Commit SHAs"

❌ **Bad**: "Button bug"  
✅ **Good**: "Save Button Disabled When Form Is Valid"

### 2. **Detailed Steps to Reproduce**
Include:
- ✅ Numbered steps (1, 2, 3...)
- ✅ Exact values entered (e.g., "3f4e05f" not "commit hash")
- ✅ Navigation path (Dashboard → Quality Center → Defects)
- ✅ User role/permissions if relevant
- ✅ Browser/environment details

### 3. **Root Cause Analysis Format**
```markdown
## Root Cause
**Category**: Data Issue  
**Component**: codeChanges table  
**Reason**: The table was empty because no test data was seeded after implementing the PR/Commit search feature in US-SEARCH-007.

**Why it happened**:
1. Feature was implemented and tested manually
2. Manual test used developer's local data
3. No seed script was created to populate test data
4. CI/CD pipeline runs against clean database
5. Search returned no results in clean environment

**Prevention**:
- Add seed script creation to definition of done
- Include database state verification in integration tests
- Document test data requirements in user stories
```

### 4. **Resolution Documentation**
```markdown
## Resolution
**Fix**: Created `scripts/seed-def-search-003.ts` to seed test data

**Changes Made**:
1. Added defect record `DEF-SEARCH-003` to track this issue
2. Created 6 code change records:
   - 4 records for commit `3f4e05f` (linked to DEF-SEARCH-001 + 3 stories)
   - 2 records for commit `b2c6af7` (linked to US-SEARCH-006 + DEF-SEARCH-001)
3. Verified search now returns expected results

**Verification**:
- ✅ Search "3f4e05f" returns DEF-SEARCH-001 as primary result
- ✅ Tooltip shows "+ 3 other stories"
- ✅ Search "b2c6af7" returns US-SEARCH-006 as primary result
- ✅ Tooltip shows "+ 1 other story"

**Commit**: `b3c985f`
**Files Changed**: 2 files (+171 lines)
```

---

## 🔗 Related Documentation

- [Quality Center Product Overview](./Quality-Center-Product-Overview.md)
- [Quality Center Technical Specification](./TDS-QC-001-Quality-Center-Technical-Specification.md)
- [Defect Management Vision](./ARKDL-0012-Defect-Management-Vision.md)
- [Test Management Guide](./Quality-Center-Test-Management-Guide.md)

---

## 🐛 Common Defect Patterns

### Pattern 1: Data Not Displaying
**Symptoms**: UI shows "No data" or empty states  
**Common Causes**:
- API response not unwrapped (`{ data: ... }` vs direct object)
- Database table empty or incorrect query
- Frontend expecting different data structure

**Fix**: Verify API contract matches frontend expectations

### Pattern 2: Feature Works Locally, Fails in Production
**Symptoms**: Works on dev machine, breaks in CI/CD  
**Common Causes**:
- Missing seed data or migrations
- Environment variable not set
- Database schema out of sync

**Fix**: Ensure database state is reproducible via migrations/seeds

### Pattern 3: Search Returns No Results
**Symptoms**: Search query returns empty array  
**Common Causes**:
- No matching data in database
- Search fields not indexed
- Case sensitivity mismatch
- Incorrect field names in query

**Fix**: Add test data, verify field names, check indexes

---

*Last Updated: December 24, 2025*  
*Version: 1.0*

