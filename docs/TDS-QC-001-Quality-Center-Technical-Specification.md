# TDS-QC-001: Quality Center Technical Specification

**Version:** 1.0  
**Status:** Approved  
**Date:** December 24, 2025  
**Author:** Arkhitekton Platform Team  
**Related Documents:**
- ARKDL-0012: Defect Management Vision
- ARKDL-0016: Quality Center Enhancements
- Quality-Center-Product-Overview.md

---

## 1. Executive Summary

The Quality Center is a comprehensive quality management platform encompassing three major subsystems:

1. **Defect Management** - Full lifecycle tracking from triage to resolution
2. **Test Planning & Execution** - Test suites, cases, runs, and coverage
3. **Release & Launch Management** - Release coordination and go/no-go decisions

This Technical Design Specification defines the architecture, data models, APIs, and implementation strategy for transforming the Quality Center from a basic defect tracker (~40% complete) to a world-class quality intelligence platform (100% complete).

**Current Implementation Status:**
- Defect Management: ~15% (basic CRUD, minimal UI)
- Test Planning: ~95% (fully implemented, stories not seeded)
- Release Management: 0% (not started)

**Target State:** Enterprise-grade quality management with AI-powered insights, architecture component linking, and predictive analytics.

---

## 2. System Architecture

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    ARKHITEKTON PLATFORM                          │
├─────────────────────────────────────────────────────────────────┤
│  Plan Module  │  Wiki Module  │  Design Studio  │  Portfolio   │
└────────┬──────┴───────┬───────┴────────┬────────┴──────┬────────┘
         │              │                │               │
         └──────────────┴────────────────┴───────────────┘
                              │
                   ┌──────────▼───────────┐
                   │   QUALITY CENTER     │
                   │   (Main Module)      │
                   └──────────┬───────────┘
                              │
         ┌────────────────────┼────────────────────┐
         │                    │                    │
    ┌────▼─────┐     ┌───────▼────────┐   ┌──────▼──────┐
    │ Defect   │     │ Test Planning  │   │  Release &  │
    │ Mgmt     │     │ & Execution    │   │  Launch     │
    └────┬─────┘     └───────┬────────┘   └──────┬──────┘
         │                   │                    │
         └───────────────────┴────────────────────┘
                              │
                   ┌──────────▼───────────┐
                   │    DATA LAYER        │
                   │   (PostgreSQL)       │
                   └──────────────────────┘
```

### 2.2 Module Integration Points

**Quality Center integrates with:**

| Module | Integration Type | Purpose |
|--------|------------------|---------|
| **Plan Module** | Bi-directional | Link defects/tests to user stories, epics, sprints |
| **Wiki Module** | Reference | Link defects to documentation, requirements |
| **Design Studio** | Bi-directional | Link defects to architecture components (UNIQUE!) |
| **Portfolio Module** | Reference | Link releases to initiatives, applications |
| **GitHub** | External | Commit linking, PR tracking, CI/CD hooks |
| **Jira** | External | Bi-directional defect sync |
| **AI (Claude)** | External | Duplicate detection, severity suggestion, pattern analysis |

---

## 3. Database Schema

### 3.1 Current Schema (Implemented)

#### Defects Table
```sql
CREATE TABLE defects (
  id VARCHAR PRIMARY KEY,              -- DEF-XXX format
  user_story_id TEXT NOT NULL,         -- FK to user_stories
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  
  -- Classification
  severity TEXT NOT NULL DEFAULT 'medium',  -- critical, high, medium, low
  type TEXT NOT NULL DEFAULT 'bug',         -- bug, regression, performance, security, usability
  status TEXT NOT NULL DEFAULT 'open',      -- open, in-progress, resolved, closed, rejected
  
  -- Assignment
  discovered_by TEXT,
  assigned_to TEXT,
  
  -- GitHub Integration
  github_issue INTEGER,
  github_commits JSONB DEFAULT '[]',
  
  -- Jira Integration
  jira_issue_key TEXT,
  jira_issue_id TEXT,
  last_synced_at TIMESTAMP,
  sync_source TEXT,
  sync_status TEXT,
  
  -- Resolution
  root_cause TEXT,
  resolution TEXT,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP
);

CREATE INDEX idx_defects_user_story ON defects(user_story_id);
CREATE INDEX idx_defects_severity ON defects(severity);
CREATE INDEX idx_defects_status ON defects(status);
CREATE INDEX idx_defects_assigned_to ON defects(assigned_to);
```

#### Test Management Tables
```sql
CREATE TABLE test_suites (
  id TEXT PRIMARY KEY,                 -- TS-XXX format
  name TEXT NOT NULL,
  description TEXT,
  parent_suite_id TEXT,                -- FK to test_suites (hierarchical)
  module TEXT,                         -- plan, wiki, quality, design, canvas, agent
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE test_cases (
  id TEXT PRIMARY KEY,                 -- TC-XXX-## format
  suite_id TEXT NOT NULL,              -- FK to test_suites
  title TEXT NOT NULL,
  preconditions TEXT,
  steps JSONB,                         -- [{step: "", expected: ""}, ...]
  priority TEXT DEFAULT 'medium',
  test_type TEXT DEFAULT 'functional',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE test_case_stories (
  test_case_id TEXT NOT NULL,          -- FK to test_cases
  story_id TEXT NOT NULL,              -- FK to user_stories
  PRIMARY KEY (test_case_id, story_id)
);

CREATE TABLE test_runs (
  id TEXT PRIMARY KEY,                 -- TR-XXX format
  suite_id TEXT NOT NULL,              -- FK to test_suites
  name TEXT NOT NULL,
  assigned_to TEXT,
  environment TEXT DEFAULT 'staging',
  status TEXT DEFAULT 'in-progress',   -- in-progress, completed, cancelled
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE test_results (
  id TEXT PRIMARY KEY,
  run_id TEXT NOT NULL,                -- FK to test_runs
  case_id TEXT NOT NULL,               -- FK to test_cases
  status TEXT DEFAULT 'not-run',       -- passed, failed, blocked, skipped, not-run
  notes TEXT,
  screenshot_url TEXT,
  executed_by TEXT,
  executed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE test_result_defects (
  result_id TEXT NOT NULL,             -- FK to test_results
  defect_id VARCHAR NOT NULL,          -- FK to defects
  PRIMARY KEY (result_id, defect_id)
);
```

### 3.2 Phase 1-2 Schema Additions (Defect Lifecycle)

```sql
-- Phase 1: Advanced Filtering
CREATE TABLE user_preferences (
  user_id TEXT NOT NULL,
  key TEXT NOT NULL,
  value JSONB NOT NULL,
  PRIMARY KEY (user_id, key)
);

-- Phase 2: Defect Lifecycle
ALTER TABLE defects ADD COLUMN triage_status TEXT DEFAULT 'pending';
ALTER TABLE defects ADD COLUMN rejection_reason TEXT;
ALTER TABLE defects ADD COLUMN verified_by TEXT;
ALTER TABLE defects ADD COLUMN verified_at TIMESTAMP;
ALTER TABLE defects ADD COLUMN reopen_count INTEGER DEFAULT 0;
ALTER TABLE defects ADD COLUMN reopen_reason TEXT;
ALTER TABLE defects ADD COLUMN duplicate_of_id VARCHAR REFERENCES defects(id);

CREATE TABLE defect_templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  template_fields JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_defects_triage_status ON defects(triage_status);
CREATE INDEX idx_defects_verified_by ON defects(verified_by);
```

### 3.3 Phase 3 Schema Additions (Analytics)

```sql
ALTER TABLE defects ADD COLUMN component_ids TEXT[];
ALTER TABLE defects ADD COLUMN time_to_triage INTERVAL;
ALTER TABLE defects ADD COLUMN time_to_resolve INTERVAL;
ALTER TABLE defects ADD COLUMN severity_change_log JSONB DEFAULT '[]';

CREATE TABLE quality_gates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,              -- defect_count, mttr, severity, coverage
  threshold JSONB NOT NULL,
  status TEXT DEFAULT 'pass',      -- pass, fail, warning
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_defects_component_ids ON defects USING GIN(component_ids);
```

### 3.4 Phase 4 Schema Additions (Release Management)

```sql
CREATE TABLE releases (
  id TEXT PRIMARY KEY,                 -- REL-XXX format
  version TEXT NOT NULL,
  name TEXT,
  description TEXT,
  target_date TIMESTAMP,
  actual_date TIMESTAMP,
  release_type TEXT DEFAULT 'minor',   -- major, minor, patch, hotfix
  status TEXT DEFAULT 'planning',      -- planning, development, testing, ready, released
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE release_stories (
  release_id TEXT NOT NULL,            -- FK to releases
  story_id TEXT NOT NULL,              -- FK to user_stories
  PRIMARY KEY (release_id, story_id)
);

CREATE TABLE launch_checklist_items (
  id TEXT PRIMARY KEY,
  release_id TEXT NOT NULL,            -- FK to releases
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

CREATE TABLE stakeholder_votes (
  id TEXT PRIMARY KEY,
  release_id TEXT NOT NULL,            -- FK to releases
  stakeholder TEXT NOT NULL,
  vote TEXT,                           -- go, no-go, pending
  reason TEXT,
  voted_at TIMESTAMP
);

ALTER TABLE defects ADD COLUMN found_in_version TEXT;
ALTER TABLE defects ADD COLUMN fixed_in_version TEXT;

CREATE INDEX idx_releases_status ON releases(status);
CREATE INDEX idx_releases_target_date ON releases(target_date);
```

### 3.5 Phase 5 Schema Additions (Intelligent Linking)

```sql
ALTER TABLE defects ADD COLUMN affected_files TEXT[];

CREATE TABLE defect_components (
  defect_id VARCHAR NOT NULL,          -- FK to defects
  component_id UUID NOT NULL,          -- FK to architectural_models
  impact_level TEXT DEFAULT 'primary', -- primary, secondary
  PRIMARY KEY (defect_id, component_id)
);

CREATE INDEX idx_defect_components_component ON defect_components(component_id);
```

### 3.6 Phase 6 Schema Additions (AI Enhancement)

```sql
-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

ALTER TABLE defects ADD COLUMN embedding_vector vector(1536);
ALTER TABLE defects ADD COLUMN similar_defect_ids TEXT[];
ALTER TABLE defects ADD COLUMN suggested_root_cause TEXT;

CREATE TABLE root_cause_library (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  template TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Vector similarity index (IVFFlat for performance)
CREATE INDEX defects_embedding_idx ON defects 
  USING ivfflat (embedding_vector vector_cosine_ops)
  WITH (lists = 100);
```

### 3.7 Complete Entity Relationship Diagram

See [docs/diagrams/TDS-QC-001-database-schema.svg](diagrams/TDS-QC-001-database-schema.svg)

---

## 4. API Architecture

### 4.1 RESTful API Design Principles

1. **Resource-Based URLs**: `/api/{resource}` or `/api/{resource}/{id}`
2. **HTTP Methods**: GET (read), POST (create), PATCH (update), DELETE (delete)
3. **Status Codes**: 200 (OK), 201 (Created), 400 (Bad Request), 404 (Not Found), 500 (Server Error)
4. **Pagination**: `?page=1&limit=25` for list endpoints
5. **Filtering**: Query parameters for filters (e.g., `?severity=critical&status=open`)
6. **Response Format**: `{ data: T }` for single resources, `{ data: T[], total: number }` for lists

### 4.2 Existing API Endpoints (Implemented)

#### Defects API
```typescript
GET    /api/defects                    // List all defects (with filters)
GET    /api/defects/:id                // Get single defect
POST   /api/defects                    // Create defect
PATCH  /api/defects/:id                // Update defect
POST   /api/defects/:id/resolve        // Resolve defect
DELETE /api/defects/:id                // Delete defect

// Filters: ?userStoryId=X&severity=critical&assignee=user&open=true&search=keyword
```

#### Test Management API
```typescript
// Test Suites
GET    /api/test-suites                // List test suites (?module=plan&parentId=X)
GET    /api/test-suites/:id            // Get suite with children and cases
POST   /api/test-suites                // Create suite
PATCH  /api/test-suites/:id            // Update suite
DELETE /api/test-suites/:id            // Delete suite

// Test Cases
GET    /api/test-cases                 // List test cases (?suiteId=X&storyId=Y)
GET    /api/test-cases/:id             // Get test case
POST   /api/test-cases                 // Create test case
PATCH  /api/test-cases/:id             // Update test case
DELETE /api/test-cases/:id             // Delete test case
POST   /api/test-cases/:testCaseId/stories/:storyId    // Link to story
DELETE /api/test-cases/:testCaseId/stories/:storyId    // Unlink from story

// Test Runs
GET    /api/test-runs                  // List test runs (?suiteId=X)
GET    /api/test-runs/:id              // Get test run with results
POST   /api/test-runs                  // Create test run
PATCH  /api/test-runs/:id              // Update test run
POST   /api/test-runs/:id/complete     // Mark run as complete
DELETE /api/test-runs/:id              // Delete test run

// Test Results
GET    /api/test-results               // List test results (?runId=X&caseId=Y)
POST   /api/test-results               // Create/update test result
PATCH  /api/test-results/:id           // Update test result
POST   /api/test-results/:resultId/defects/:defectId  // Link to defect

// Test Coverage
GET    /api/test-coverage/dashboard    // Coverage metrics
```

### 4.3 Phase 1-2 API Additions (Defect Lifecycle)

```typescript
// Phase 1: Export & Preferences
GET    /api/defects/export/csv         // Export defects as CSV
GET    /api/defects/export/pdf         // Export defects as PDF
POST   /api/user-preferences           // Save filter preset
GET    /api/user-preferences/:key      // Get saved preference
DELETE /api/user-preferences/:key      // Delete preference

// Phase 2: Triage & Verification
POST   /api/defects/:id/triage         // Confirm/reject defect
       // Body: { action: 'confirm' | 'reject', reason?: string, assignTo?: string }
POST   /api/defects/:id/verify         // QA verification
       // Body: { verified: boolean, notes?: string }
POST   /api/defects/:id/reopen         // Reopen defect
       // Body: { reason: string }
GET    /api/defects/duplicates         // Find potential duplicates
       // Query: ?title=...&threshold=0.8
POST   /api/defects/bulk/triage        // Bulk triage
       // Body: { defectIds: string[], action: string, reason?: string }
POST   /api/defects/bulk/assign        // Bulk assign
       // Body: { defectIds: string[], assignTo: string }
GET    /api/defect-templates           // Get all templates
POST   /api/defect-templates           // Create template
```

### 4.4 Phase 3 API Additions (Analytics)

```typescript
GET    /api/defects/metrics            // Aggregate quality metrics
       // Response: { total, open, resolved, mttr, density, escapeRate }
GET    /api/defects/trends             // Time-series data
       // Query: ?interval=daily|weekly|monthly&from=DATE&to=DATE
       // Response: { dates: [], created: [], resolved: [] }
GET    /api/defects/aging              // Defects by age buckets
       // Response: { under30days, days30to60, days60to90, over90days }
GET    /api/components/:id/defects     // Defects for architecture component
GET    /api/quality-gates              // All quality gates
POST   /api/quality-gates              // Create quality gate
PATCH  /api/quality-gates/:id          // Update quality gate
POST   /api/quality-gates/:id/evaluate // Evaluate gate
```

### 4.5 Phase 4 API Additions (Release Management)

```typescript
// Releases CRUD
GET    /api/releases                   // List releases
GET    /api/releases/:id               // Get release with stories, defects, checklist
POST   /api/releases                   // Create release
PATCH  /api/releases/:id               // Update release
DELETE /api/releases/:id               // Delete release

// Release Stories
POST   /api/releases/:id/stories/:storyId     // Add story to release
DELETE /api/releases/:id/stories/:storyId     // Remove story from release
GET    /api/releases/:id/stories              // Get release stories

// Launch Checklist
GET    /api/releases/:id/checklist     // Get checklist items
POST   /api/releases/:id/checklist     // Add checklist item
PATCH  /api/launch-checklist/:itemId   // Update checklist item
DELETE /api/launch-checklist/:itemId   // Delete checklist item

// Stakeholder Votes
GET    /api/releases/:id/votes         // Get votes
POST   /api/releases/:id/votes         // Cast vote
PATCH  /api/stakeholder-votes/:voteId  // Update vote

// Release Actions
POST   /api/releases/:id/launch        // Mark release as launched
GET    /api/releases/:id/release-notes // Generate release notes
GET    /api/releases/:id/health        // Get release health metrics
```

### 4.6 Phase 5 API Additions (Intelligent Linking)

```typescript
POST   /api/defects/:id/components     // Link defect to architecture components
       // Body: { componentId: UUID, impactLevel: 'primary' | 'secondary' }
DELETE /api/defects/:id/components/:componentId
POST   /api/defects/:id/test-cases     // Link defect to test case
DELETE /api/defects/:id/test-cases/:testCaseId
POST   /api/test-runs/:id/create-defects  // Auto-create defects from failed tests
       // Body: { failedResults: [{ caseId, notes, screenshot }] }
```

### 4.7 Phase 6 API Additions (AI Enhancement)

```typescript
GET    /api/defects/:id/similar        // Find similar defects (semantic)
       // Response: { similar: [{ id, title, similarity }] }
POST   /api/defects/:id/suggest-rootcause  // AI root cause suggestion
       // Response: { suggestedRootCause: string, confidence: number }
POST   /api/defects/:id/suggest-severity   // AI severity suggestion
       // Response: { suggestedSeverity: string, reasoning: string }
GET    /api/defects/patterns           // Defect pattern analysis
       // Response: { patterns: [{ type, count, components }] }
GET    /api/defects/predictions        // Predictive analytics
       // Response: { atRiskComponents: [], projectedDefects }
GET    /api/root-cause-library         // Get root cause categories
```

### 4.8 API Response Schemas

#### Defect Response
```typescript
interface DefectResponse {
  id: string;
  userStoryId: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  type: 'bug' | 'regression' | 'performance' | 'security' | 'usability';
  status: 'open' | 'in-progress' | 'resolved' | 'closed' | 'rejected';
  triageStatus?: 'pending' | 'confirmed' | 'rejected';
  discoveredBy: string | null;
  assignedTo: string | null;
  verifiedBy?: string | null;
  rootCause: string | null;
  resolution: string | null;
  githubCommits?: Array<{ sha: string; message: string; author: string }>;
  componentIds?: string[];
  affectedFiles?: string[];
  foundInVersion?: string;
  fixedInVersion?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
  verifiedAt?: string | null;
}
```

#### Quality Metrics Response
```typescript
interface QualityMetricsResponse {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  resolutionRate: number;
  mttr: {
    critical: number;  // Hours
    high: number;
    medium: number;
    low: number;
  };
  defectDensity: number;  // Per 1000 story points
  escapeRate: number;     // % found in production
  agingBuckets: {
    under30days: number;
    days30to60: number;
    days60to90: number;
    over90days: number;
  };
}
```

---

## 5. Component Architecture

### 5.1 React Component Hierarchy

```
<QualityCenter>
├── <QualityLayout>                     // Shared layout with nav
│   ├── <QualityNav>                    // Tab navigation
│   └── <Outlet>                        // Route content
│
├── /quality/dashboard
│   └── <QualityDashboard>
│       ├── <MetricsCards>
│       ├── <SeverityChart>
│       └── <RecentDefectsList>
│
├── /quality/defects
│   └── <DefectsPage>
│       ├── <DefectsFilter>
│       ├── <DefectsTable>
│       └── <DefectsPagination>
│
├── /quality/defects/:id
│   └── <DefectDetailPage>
│       ├── <DefectHeader>
│       ├── <DefectBody>
│       ├── <DefectTimeline>
│       └── <DefectSidebar>
│
├── /quality/triage (Phase 2)
│   └── <TriageQueue>
│       ├── <TriageFilters>
│       ├── <TriageList>
│       └── <BulkActions>
│
├── /quality/test-plan
│   └── <TestPlanPage>
│       ├── <TestSuiteTree>
│       ├── <TestCaseList>
│       └── <TestRunDialog>
│
├── /quality/reports
│   └── <QualityReports>
│       └── <TestCoverageDashboard>
│
└── /releases (Phase 4)
    ├── <ReleasesDashboard>
    ├── <ReleaseDetail>
    │   ├── <ReleaseHeader>
    │   ├── <StoriesList>
    │   ├── <LaunchChecklist>
    │   └── <GoNoGoBoard>
    └── <ReleaseTimeline>
```

### 5.2 State Management Strategy

**React Query for Server State:**
- All API calls use React Query hooks
- Automatic caching, refetching, and error handling
- Query keys: `['/api/defects', filters]`, `['/api/defects', id]`

**Local State:**
- Form state: React Hook Form
- UI state: useState (modals, filters, selections)
- Global UI state: Zustand (if needed for cross-component state)

**No Redux** - React Query + local state is sufficient

### 5.3 Routing Structure

```typescript
// Quality Center Routes
/quality/dashboard              → QualityDashboard
/quality/defects                → DefectsPage
/quality/defects/:id            → DefectDetailPage
/quality/triage                 → TriageQueue (Phase 2)
/quality/verification           → VerificationQueue (Phase 2)
/quality/test-plan              → TestPlanPage
/quality/reports                → QualityReports

// Release Management Routes (Phase 4)
/releases                       → ReleasesDashboard
/releases/:id                   → ReleaseDetail
/releases/:id/checklist         → LaunchChecklist
/releases/:id/go-no-go          → GoNoGoBoard
```

See [docs/diagrams/TDS-QC-001-component-hierarchy.svg](diagrams/TDS-QC-001-component-hierarchy.svg)

---

## 6. Integration Architecture

### 6.1 GitHub Integration

**Purpose:** Link defects to commits, PRs, and CI/CD results

**Implementation:**
```typescript
// Current: Manual commit linking
interface GitHubCommit {
  sha: string;
  message: string;
  author: string;
  timestamp: string;
}

// Phase 5: Auto-linking via commit messages
// Commit message: "fix: Login button not responding (DEF-AUTH-042)"
// Parser extracts DEF-AUTH-042 and auto-links commit
```

**API Endpoints:**
- POST /api/defects/:id/github/commits - Link commit to defect
- GET /api/defects/:id/github/prs - Get related PRs
- POST /api/github/webhook - Receive commit/PR events

### 6.2 Jira Integration

**Purpose:** Bi-directional sync of defects with Jira issues

**Schema:**
```typescript
defects.jiraIssueKey: string;     // e.g., "PROJ-1234"
defects.jiraIssueId: string;
defects.lastSyncedAt: timestamp;
defects.syncSource: 'arkhitekton' | 'jira' | 'manual';
defects.syncStatus: 'synced' | 'pending' | 'error' | 'disabled';
```

**Sync Strategy:**
1. **Push to Jira**: When defect created/updated in Arkhitekton, push to Jira
2. **Pull from Jira**: Webhook receives Jira updates, updates Arkhitekton defect
3. **Conflict Resolution**: Last-write-wins with sync_source tracking

**Tables:**
```sql
jira_integration_mappings (
  arkhitekton_defect_id VARCHAR,
  jira_issue_key TEXT,
  jira_issue_id TEXT,
  field_mappings JSONB
);

jira_sync_logs (
  id UUID,
  defect_id VARCHAR,
  operation TEXT,
  status TEXT,
  error_message TEXT,
  synced_at TIMESTAMP
);
```

### 6.3 AI Integration (Claude API)

**Purpose:** Intelligent defect analysis and suggestions

**Phase 6 Features:**

1. **Duplicate Detection**
   ```typescript
   POST /api/defects/:id/suggest-similar
   // Generate embedding, vector search for similar defects
   ```

2. **Severity Suggestion**
   ```typescript
   POST /api/defects/:id/suggest-severity
   // Analyze description, suggest severity with reasoning
   ```

3. **Root Cause Prediction**
   ```typescript
   POST /api/defects/:id/suggest-rootcause
   // Based on description + historical patterns
   ```

4. **Pattern Recognition**
   ```typescript
   GET /api/defects/patterns
   // Cluster defects, identify trends
   ```

**Implementation:**
- Store embeddings in PostgreSQL using pgvector
- Use Claude API for text analysis
- Cache results to minimize API calls

### 6.4 Test Automation Integration (CI/CD)

**Purpose:** Auto-create defects from failed automated tests

**Flow:**
```
CI/CD Test Run → Test Fails → Webhook to Arkhitekton
→ POST /api/test-runs/:id/create-defects
→ Auto-create defect with test details
→ Link to test case and user story
```

**Webhook Payload:**
```typescript
{
  runId: string;
  failedTests: Array<{
    testCaseId: string;
    testName: string;
    errorMessage: string;
    stackTrace: string;
    screenshot?: string;
  }>;
}
```

See [docs/diagrams/TDS-QC-001-integration-architecture.svg](diagrams/TDS-QC-001-integration-architecture.svg)

---

## 7. Performance Considerations

### 7.1 Database Performance

**Indexing Strategy:**
```sql
-- Essential indexes (already implemented)
CREATE INDEX idx_defects_user_story ON defects(user_story_id);
CREATE INDEX idx_defects_severity ON defects(severity);
CREATE INDEX idx_defects_status ON defects(status);
CREATE INDEX idx_defects_assigned_to ON defects(assigned_to);

-- Phase 2+ indexes
CREATE INDEX idx_defects_triage_status ON defects(triage_status);
CREATE INDEX idx_defects_created_at ON defects(created_at DESC);
CREATE INDEX idx_defects_component_ids ON defects USING GIN(component_ids);

-- Full-text search (Phase 1)
CREATE INDEX idx_defects_search ON defects USING GIN(
  to_tsvector('english', title || ' ' || description)
);

-- Vector search (Phase 6)
CREATE INDEX defects_embedding_idx ON defects 
  USING ivfflat (embedding_vector vector_cosine_ops)
  WITH (lists = 100);
```

**Query Optimization:**
- Use pagination for all list endpoints (LIMIT 25 OFFSET X)
- Eager load related data (JOIN user_stories, test_cases)
- Use connection pooling (pg-pool)
- Cache expensive queries (Redis for metrics)

### 7.2 API Performance

**Response Time Targets:**
- List endpoints: <200ms (p95)
- Detail endpoints: <100ms (p95)
- Analytics endpoints: <500ms (p95)
- Search endpoints: <300ms (p95)

**Optimization Techniques:**
1. **Pagination**: Default 25 items, max 100
2. **Field Selection**: Allow `?fields=id,title,status` to reduce payload
3. **ETags**: Cache-Control headers for unchanged resources
4. **Rate Limiting**: 1000 requests/hour per user (Phase 2+)
5. **Compression**: gzip responses >1KB

### 7.3 Frontend Performance

**Code Splitting:**
```typescript
// Lazy load heavy components
const TriageQueue = lazy(() => import('./triage-queue'));
const ComponentHeatmap = lazy(() => import('./component-heatmap'));
```

**React Query Caching:**
```typescript
// Cache list queries for 5 minutes
useQuery(['/api/defects'], fetchDefects, {
  staleTime: 5 * 60 * 1000,
  cacheTime: 10 * 60 * 1000,
});
```

**Virtual Scrolling:**
- Use `react-window` for lists >100 items
- Render only visible rows

---

## 8. Security Model

### 8.1 Authentication & Authorization

**Current:** Basic authentication (no RBAC)

**Phase 2+ RBAC:**

| Role | Permissions |
|------|-------------|
| **QA Engineer** | Create/edit/triage defects, create/run tests, view all reports |
| **Developer** | View defects, edit assigned defects, link commits |
| **Product Owner** | View all, approve verification, manage releases |
| **QA Manager** | Full access to Quality Center, configure quality gates |
| **Executive** | Read-only access to dashboards and reports |

**Implementation:**
```typescript
// Middleware
const requireRole = (roles: string[]) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
};

// Usage
app.post('/api/defects/:id/triage', requireRole(['QA Manager', 'QA Engineer']), ...);
```

### 8.2 Data Validation

**Input Validation (Zod schemas):**
```typescript
const createDefectSchema = z.object({
  userStoryId: z.string().regex(/^US-[A-Z0-9-]+$/),
  title: z.string().min(5).max(200),
  description: z.string().min(20),
  severity: z.enum(['critical', 'high', 'medium', 'low']),
  type: z.enum(['bug', 'regression', 'performance', 'security', 'usability']),
  assignedTo: z.string().optional(),
});
```

### 8.3 SQL Injection Prevention

**Parameterized Queries (Drizzle ORM):**
```typescript
// SAFE (using Drizzle)
await db.select().from(defects).where(eq(defects.id, defectId));

// UNSAFE (raw SQL - NEVER DO THIS)
await db.execute(`SELECT * FROM defects WHERE id = '${defectId}'`);
```

### 8.4 XSS Protection

**Markdown Sanitization:**
```typescript
import DOMPurify from 'dompurify';
import marked from 'marked';

const renderMarkdown = (text: string) => {
  const html = marked(text);
  return DOMPurify.sanitize(html);
};
```

---

## 9. Non-Functional Requirements

### 9.1 Performance

- **Response Time**: <200ms (p95) for list, <500ms for analytics
- **Throughput**: 1000 requests/minute
- **Concurrent Users**: 100+ simultaneous users
- **Database Queries**: <50ms (p95)

### 9.2 Scalability

- **Horizontal Scaling**: Stateless API servers (load balancer)
- **Database Scaling**: Read replicas for reporting queries
- **Caching**: Redis for frequently accessed data (metrics, dashboards)

### 9.3 Availability

- **Uptime**: 99.5% (excluding planned maintenance)
- **Backup**: Daily PostgreSQL backups, 30-day retention
- **Disaster Recovery**: RTO <4 hours, RPO <1 hour

### 9.4 Data Retention

- **Defects**: Retain indefinitely (historical data valuable)
- **Test Runs**: Retain 90 days (or link to release, then indefinite)
- **Audit Logs**: Retain 1 year
- **Metrics**: Aggregate to daily/weekly after 90 days

### 9.5 Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (last 2 versions)
- **No IE Support**: Focus on modern standards

---

## 10. Implementation Phases

### Phase 0: Foundation (Sprint 0)
- **Status**: In Progress
- **Deliverables**:
  - ✅ TDS-QC-001 (this document)
  - ⏳ Architecture diagrams (4 SVGs)
  - ⏳ Seed Test Planning stories (US-QC-101 to US-QC-104)
  - ⏳ Seed Release Management stories (US-REL-101 to US-REL-104)

### Phase 1: Complete Defect Foundation (Sprint 1-2)
- **Effort**: 5 story points (~2.5 days)
- **User Stories**: US-DEFECT-003, US-DEFECT-004
- **Features**: Advanced filtering, saved presets, CSV/PDF export

### Phase 2: Defect Lifecycle & Triage (Sprint 3-4)
- **Effort**: 20 story points (~10 days)
- **User Stories**: US-DEFECT-005 to US-DEFECT-009
- **Features**: Triage queue, verification workflow, templates, duplicate detection

### Phase 3: Quality Analytics & Intelligence (Sprint 5-6)
- **Effort**: 29 story points (~14.5 days)
- **User Stories**: US-DEFECT-010 to US-DEFECT-014
- **Features**: MTTR, defect density, component heatmap, quality gates

### Phase 4: Release & Launch Management (Sprint 7-9)
- **Effort**: 23 story points (~11.5 days)
- **User Stories**: US-REL-101 to US-REL-104
- **Features**: Release definition, launch checklists, go/no-go board

### Phase 5: Intelligent Linking (Sprint 10-11)
- **Effort**: 29 story points (~14.5 days)
- **User Stories**: US-DEFECT-015 to US-DEFECT-019
- **Features**: Test/component linking, auto-defect from CI/CD

### Phase 6: AI Enhancement (Sprint 12-14)
- **Effort**: 42 story points (~21 days)
- **User Stories**: US-DEFECT-020 to US-DEFECT-024
- **Features**: AI duplicate detection, severity suggestion, pattern recognition

**Total Timeline:** ~6 months (12-14 sprints)

---

## 11. Risks & Mitigation

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Schema changes break existing features | Medium | High | Comprehensive migration testing, rollback scripts |
| AI features underperform | Medium | Medium | Start with rule-based, iterate with AI |
| Release module scope creep | High | Medium | Stick to MVP, defer advanced features to Phase 4.5 |
| Performance degradation | Low | High | Load testing, proper indexing, caching strategy |
| User adoption resistance | Medium | High | Involve QA team early, comprehensive training |

---

## 12. Success Metrics

### Phase 1-2 (6 months)
- ✅ Defect Management used by 100% of QA team
- ✅ 90% of defects triaged within 24 hours
- ✅ MTTR <5 days for High/Critical defects

### Phase 3-4 (1 year)
- ✅ Defect density decreased by 30%
- ✅ Zero critical defects in production for 6 months
- ✅ 80% of defects linked to architecture components

### Phase 5-6 (18 months)
- ✅ AI duplicate detection accuracy >85%
- ✅ 5+ high-risk components identified proactively per quarter
- ✅ 50% reduction in defect reopens

---

## 13. References

- [ARKDL-0012: Defect Management Vision](ARKDL-0012-Defect-Management-Vision.md)
- [ARKDL-0016: Quality Center Enhancements](ARKDL-0016-Quality-Center-Enhancements.md)
- [Quality Center Product Overview](Quality-Center-Product-Overview.md)
- [TDS-SEARCH-001: Global Search Technical Specification](TDS-SEARCH-001-Global-Search-Technical-Specification.md)

---

**Document Control:**
- **Version History**:
  - v1.0 (2025-12-24): Initial version
- **Approvers**: Product Owner, Tech Lead, QA Manager
- **Next Review**: 2026-01-31

