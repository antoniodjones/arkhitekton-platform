# ARKDL-0020: Product Development Lifecycle

> **Document ID**: ARKDL-0020  
> **Version**: 1.0  
> **Status**: Draft  
> **Created**: December 2024  
> **Author**: Arkhitekton Platform Team

---

## 1. Executive Summary

This document defines the Product Development Lifecycle (PDLC) for the Arkhitekton platform. It establishes the phases, gates, story types, and testing strategy that govern how features move from concept to production.

---

## 2. Lifecycle Overview

```
┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│   IDEATION   │ → │ TECH DESIGN  │ → │ DEVELOPMENT  │ → │  QA TESTING  │ → │     UAT      │ → │   RELEASE    │
│              │   │              │   │              │   │              │   │              │   │              │
│ Product      │   │ Tech Lead    │   │ Developer    │   │ QA Engineer  │   │ Stakeholder  │   │ Release Mgr  │
│ Owner        │   │              │   │              │   │              │   │              │   │              │
└──────────────┘   └──────────────┘   └──────────────┘   └──────────────┘   └──────────────┘   └──────────────┘
```

---

## 3. Story Types

### 3.1 Product Story (US-*)

**Purpose**: Defines WHAT to build from a user/business perspective.

| Field | Description | Required |
|-------|-------------|----------|
| `id` | Unique identifier (US-MODULE-NNN) | Yes |
| `title` | User story title | Yes |
| `description` | "As a [user], I want [goal], so that [benefit]" | Yes |
| `acceptanceCriteria` | Gherkin format (Given/When/Then) | Yes |
| `priority` | High, Medium, Low | Yes |
| `storyPoints` | Business complexity estimate | Yes |
| `epicId` | Parent epic reference | No |
| `labels` | Categorization tags | No |

**Example**:
```
US-WIKI-007: Block Drag-and-Drop Reordering

As a documentation author,
I want to drag content blocks to reorder them,
So that I can quickly reorganize my documentation structure.

Acceptance Criteria:
Given I am editing a wiki page
When I hover over a content block
Then I see a drag handle appear
And I can drag the block to a new position
```

---

### 3.2 Implementation Story (IMP-*)

**Purpose**: Defines HOW to build from a technical perspective.

| Field | Description | Required |
|-------|-------------|----------|
| `id` | Unique identifier (IMP-MODULE-NNN-SSS) | Yes |
| `title` | Technical implementation title | Yes |
| `linkedProductStory` | Parent product story (US-*) | Yes |
| `technicalApproach` | Detailed technical solution | Yes |
| `componentsAffected` | List of files/components to modify | Yes |
| `dependencies` | External libraries, APIs, services | No |
| `storyPoints` | Technical effort estimate | Yes |
| `linkedTechnicalDesign` | Reference to Design Studio artifact | No |
| `linkedADR` | Architecture Decision Record reference | No |
| `unitTestRequirements` | Unit tests the developer must write | Yes |

**Example**:
```
IMP-WIKI-007-001: TipTap DragHandle Extension

Linked Product Story: US-WIKI-007

Technical Approach:
- Create ProseMirror plugin using @tiptap/pm/state
- Add decoration widgets for drag handles
- Implement dragstart, dragover, drop event handlers
- Position handles relative to block elements

Components Affected:
- client/src/components/wiki/drag-handle-extension.tsx (new)
- client/src/components/wiki/tiptap-editor.tsx (modify)

Dependencies:
- @tiptap/pm/state
- @tiptap/pm/view

Unit Test Requirements:
- Test handle visibility on block hover
- Test node selection during drag
- Test transaction creation on drop
- Test position calculation for reordering

Story Points: 5
```

---

### 3.3 Defect (DEF-*)

**Purpose**: Documents bugs found during testing.

| Field | Description | Required |
|-------|-------------|----------|
| `id` | Unique identifier (DEF-NNNN) | Yes |
| `title` | Brief description of the bug | Yes |
| `description` | Detailed steps to reproduce | Yes |
| `severity` | Critical, High, Medium, Low | Yes |
| `linkedStory` | Product or Implementation story | No |
| `linkedTestCase` | Test case that found the bug | No |
| `environment` | Where bug was found | Yes |
| `status` | Open, In Progress, Fixed, Verified, Closed | Yes |

---

## 4. Story Status Flow

### 4.1 Status Definitions

| Status | Description | Owner | Exit Criteria |
|--------|-------------|-------|---------------|
| **Backlog** | Story created, awaiting prioritization | Product Owner | Prioritized for sprint |
| **Tech Design** | Technical design in progress | Tech Lead | Implementation stories created, pointed |
| **Ready for Dev** | Tech design approved, ready to code | Tech Lead | Developer assigned |
| **In Progress** | Active development | Developer | PR created, unit tests passing |
| **Code Review** | PR submitted, awaiting review | Developer/Reviewer | PR approved, merged to staging |
| **QA** | Quality assurance testing | QA Engineer | All QA tests passing |
| **UAT** | User acceptance testing | Stakeholder | UAT approved |
| **Done** | Shipped to production | Release Manager | Deployed, verified in production |

### 4.2 Status Transitions

```
                    ┌─────────────────────────────────────────┐
                    │                                         │
                    ▼                                         │
┌─────────┐   ┌───────────┐   ┌─────────────┐   ┌───────────┐ │
│ Backlog │ → │Tech Design│ → │Ready for Dev│ → │In Progress│ │
└─────────┘   └───────────┘   └─────────────┘   └───────────┘ │
                    │                                   │     │
                    │                                   ▼     │
                    │                           ┌───────────┐ │
                    │                           │Code Review│ │
                    │                           └───────────┘ │
                    │                                   │     │
                    │         ┌─────────────────────────┘     │
                    │         │                               │
                    │         ▼                               │
                    │   ┌──────────┐                          │
                    │   │    QA    │──── Defect Found ────────┘
                    │   └──────────┘
                    │         │
                    │         ▼
                    │   ┌──────────┐
                    │   │   UAT    │──── Rejected ────────────┐
                    │   └──────────┘                          │
                    │         │                               │
                    │         ▼                               │
                    │   ┌──────────┐                          │
                    └── │   Done   │ ◄────────────────────────┘
                        └──────────┘
```

---

## 5. Development Phases

### 5.1 Phase 1: Ideation & Product Definition

**Owner**: Product Owner

**Activities**:
- Define user needs and business value
- Write Product Stories (US-*)
- Define acceptance criteria in Gherkin format
- Prioritize in product backlog
- Assign to Epic/Feature

**Deliverables**:
- Product Story with acceptance criteria
- Priority and initial business estimate

**Exit Gate**: Story approved for Tech Design

---

### 5.2 Phase 2: Technical Design

**Owner**: Tech Lead / Senior Developer

**Activities**:
- Analyze product story requirements
- Design technical solution
- Create Implementation Stories (IMP-*)
- Identify components affected
- Document dependencies
- Estimate technical effort (story points)
- Create/update Technical Design in Design Studio (future)
- Document architecture decisions (ADR) if needed

**Deliverables**:
- Implementation Story(ies) linked to Product Story
- Technical approach documented
- Components and dependencies identified
- Story points assigned
- Unit test requirements defined

**Exit Gate**: Tech design reviewed and approved

---

### 5.3 Phase 3: Development

**Owner**: Developer

**Activities**:
- Create feature branch following naming convention
- Implement solution per Implementation Story
- Write unit tests (developer responsibility)
- Ensure all unit tests pass
- Create Pull Request with story references
- Self-review code quality

**Branch Naming**: `feature/IMP-MODULE-NNN-description`

**Commit Convention**: `feat(IMP-MODULE-NNN): Description`

**Developer Gates** (must pass before PR):
- [ ] Code compiles without errors
- [ ] Unit tests written
- [ ] Unit tests passing
- [ ] Code follows style guidelines
- [ ] No console errors/warnings

**Deliverables**:
- Working code implementation
- Unit tests with coverage
- Pull Request ready for review

**Exit Gate**: PR submitted with all developer gates passing

---

### 5.4 Phase 4: Code Review

**Owner**: Peer Developer / Tech Lead

**Activities**:
- Review code quality
- Verify unit test coverage
- Check adherence to technical design
- Verify naming conventions
- Approve or request changes

**Review Checklist**:
- [ ] Code matches implementation story approach
- [ ] Unit tests cover key scenarios
- [ ] No hardcoded values or secrets
- [ ] Error handling implemented
- [ ] Code is readable and maintainable
- [ ] Story IDs in commit messages and PR title

**Deliverables**:
- Approved Pull Request
- Code merged to staging/QA branch

**Exit Gate**: PR merged, deployed to QA environment

---

### 5.5 Phase 5: QA Testing

**Owner**: QA Engineer

**Activities**:
- Execute test cases linked to story
- Perform exploratory testing
- Log defects against failed tests
- Verify fixes
- Regression testing

**Test Types** (QA-owned):

| Test Type | Purpose | When |
|-----------|---------|------|
| **Integration Test** | Components work together | After merge |
| **System Test** | End-to-end user flows | Full feature |
| **Regression Test** | Existing features unbroken | Before release |
| **Smoke Test** | Critical paths work | After deployment |

**Deliverables**:
- Test execution results
- Defects logged (if any)
- QA sign-off

**Exit Gate**: All QA tests passing, no open Critical/High defects

---

### 5.6 Phase 6: User Acceptance Testing (UAT)

**Owner**: Product Owner / Stakeholder

**Activities**:
- Verify acceptance criteria are met
- Test from user perspective
- Validate business value delivered
- Approve or reject

**UAT Test Type**:

| Field | Description |
|-------|-------------|
| Type | User Acceptance Test |
| Executor | Product Owner / Stakeholder |
| Criteria | Acceptance criteria from Product Story |
| Result | Approved / Rejected with feedback |

**Deliverables**:
- UAT sign-off
- Feedback documented (if rejected)

**Exit Gate**: UAT approved by stakeholder

---

### 5.7 Phase 7: Release

**Owner**: Release Manager / DevOps

**Activities**:
- Deploy to production
- Verify deployment success
- Monitor for issues
- Close all related stories

**Deliverables**:
- Production deployment
- Release notes
- Stories marked Done

**Exit Gate**: Verified in production

---

## 6. Traceability Matrix

```
Product Story (US-*)
    │
    ├── Implementation Story (IMP-*)
    │       │
    │       ├── Code Changes (Commits, PRs)
    │       │
    │       └── Unit Tests (Developer-owned)
    │
    ├── Test Cases (TC-*)
    │       │
    │       └── Test Results
    │               │
    │               └── Defects (DEF-*)
    │
    └── UAT Sign-off
```

---

## 7. Roles and Responsibilities

| Role | Responsibilities |
|------|------------------|
| **Product Owner** | Define product stories, prioritize backlog, UAT approval |
| **Tech Lead** | Technical design, implementation stories, architecture decisions |
| **Developer** | Implementation, unit tests, code quality, PR creation |
| **QA Engineer** | Test case creation, test execution, defect logging |
| **Stakeholder** | UAT testing, sign-off |
| **Release Manager** | Deployment, release coordination |

---

## 8. Schema Requirements

### 8.1 Implementation Stories Table

```sql
CREATE TABLE implementation_stories (
    id VARCHAR(50) PRIMARY KEY,           -- IMP-MODULE-NNN-SSS
    title VARCHAR(255) NOT NULL,
    linked_product_story VARCHAR(50) NOT NULL REFERENCES user_stories(id),
    technical_approach TEXT NOT NULL,
    components_affected JSONB,            -- ["file1.tsx", "file2.tsx"]
    dependencies JSONB,                   -- ["@tiptap/core", "lodash"]
    unit_test_requirements TEXT,
    story_points INTEGER,
    linked_technical_design VARCHAR(50),  -- Future: Design Studio reference
    linked_adr VARCHAR(50),               -- ADR reference
    status VARCHAR(50) DEFAULT 'backlog',
    assignee VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### 8.2 Updated Story Statuses

```typescript
const STORY_STATUSES = [
    'backlog',
    'tech-design',
    'ready-for-dev',
    'in-progress',
    'code-review',
    'qa',
    'uat',
    'done'
];
```

### 8.3 Test Types Enum

```typescript
const TEST_TYPES = [
    'integration',
    'system',
    'regression',
    'smoke',
    'uat'           // NEW: User Acceptance Test
];
```

---

## 9. User Stories for Implementation

### EPIC: Product Development Lifecycle

#### US-PDLC-001: Implementation Stories Entity
**As a** Tech Lead,  
**I want** to create Implementation Stories linked to Product Stories,  
**So that** I can document HOW features will be built.

**Acceptance Criteria**:
```gherkin
Given I am viewing a Product Story
When I click "Add Implementation Story"
Then I can create an IMP-* story linked to this product story
And I can specify technical approach, components, and dependencies
And the implementation story appears in the story's linked items
```

**Story Points**: 8

---

#### US-PDLC-002: Tech Design Status
**As a** Developer,  
**I want** to see when a story is in Tech Design phase,  
**So that** I know it's not ready for development yet.

**Acceptance Criteria**:
```gherkin
Given a Product Story exists
When the Tech Lead moves it to "Tech Design" status
Then the story shows "Tech Design" badge
And developers cannot move it to "In Progress" until it's "Ready for Dev"
```

**Story Points**: 3

---

#### US-PDLC-003: UAT Test Type
**As a** Product Owner,  
**I want** to create UAT test cases,  
**So that** I can formally verify acceptance criteria are met.

**Acceptance Criteria**:
```gherkin
Given I am creating a test case
When I select test type "UAT"
Then the test case is marked for stakeholder execution
And requires sign-off approval
And links to product story acceptance criteria
```

**Story Points**: 5

---

#### US-PDLC-004: Story Status Workflow
**As a** Team Member,  
**I want** the system to enforce proper status transitions,  
**So that** stories follow the defined lifecycle.

**Acceptance Criteria**:
```gherkin
Given a story is in "Backlog"
When I try to move it directly to "In Progress"
Then I am warned that "Tech Design" is required first
And I can override with justification (emergency fix)
```

**Story Points**: 5

---

#### US-PDLC-005: Implementation Story in Story Detail
**As a** Developer,  
**I want** to see linked Implementation Stories in the Story Detail Sheet,  
**So that** I understand the technical approach before coding.

**Acceptance Criteria**:
```gherkin
Given I open a Product Story detail sheet
When the story has linked Implementation Stories
Then I see a "Tech Design" tab
And I can view all linked IMP-* stories
And I can see technical approach, components, and dependencies
```

**Story Points**: 5

---

## 10. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Stories with Tech Design | 100% | All stories in Dev+ have IMP-* linked |
| UAT Pass Rate | >90% | UAT approved on first attempt |
| Defect Escape Rate | <5% | Defects found after UAT |
| Cycle Time | -20% | Time from Backlog to Done |

---

## 11. Appendix

### A. Story ID Formats

| Type | Format | Example |
|------|--------|---------|
| Product Story | US-MODULE-NNN | US-WIKI-007 |
| Implementation Story | IMP-MODULE-NNN-SSS | IMP-WIKI-007-001 |
| Defect | DEF-NNNN | DEF-0042 |
| Test Case | TC-MODULE-NNN | TC-WIKI-007 |
| Epic | EPIC-NN | EPIC-12 |

### B. Gherkin Template

```gherkin
Feature: [Feature Name]

  Scenario: [Scenario Name]
    Given [precondition]
    And [additional precondition]
    When [action]
    And [additional action]
    Then [expected result]
    And [additional expected result]
```

---

*Document Control: This document should be reviewed and updated quarterly or when significant process changes occur.*

