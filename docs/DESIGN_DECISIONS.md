# ARKHITEKTON Design Decisions

## Purpose
This document captures key architectural and design decisions for ARKHITEKTON, ensuring alignment with our core principles and tracking any technical debt with clear mitigation paths.

---

## Core Design Principles

### Principle 1: Alignment Before Action
**Decision**: Always align on design patterns and architectural decisions before proceeding with implementation.

**Rationale**: 
- Prevents technical debt accumulation
- Ensures consistency across the platform
- Maintains architectural integrity
- Reduces rework and refactoring costs

**Implementation**:
1. Document design decisions before implementation
2. Review against existing patterns and principles
3. If deviation is necessary, explicitly document why
4. Always connect technical debt to mitigation stories

### Principle 2: Technical Debt Management
**Decision**: If we must take on technical debt, we log it explicitly and create user stories to mitigate and eliminate it.

**Rationale**:
- Technical debt is sometimes necessary for velocity
- Untracked debt compounds and becomes unmaintainable
- Explicit tracking ensures accountability
- Mitigation stories prevent debt from becoming permanent

**Implementation**:
1. Create a defect or user story documenting the technical debt
2. Tag with severity (technical-debt label/category)
3. Link to the story/feature that introduced the debt
4. Create mitigation story(ies) with acceptance criteria
5. Set target sprint/milestone for debt elimination

**Example**:
```
Story: US-DEBT-001 - Remove deprecated tasks table
Description: Tasks table exists alongside user stories, creating duplication
Root Cause: Legacy system before Epic-based architecture
Mitigation: 
  - Story US-MIGRATE-001: Migrate all tasks to user stories with Epic mapping
  - Story US-CLEANUP-001: Remove tasks schema, storage, routes, and UI
Target: Sprint 3
```

---

## Decision Log

### DD-001: Unified Story Management (October 10, 2025)

**Context**: 
ARKHITEKTON had two parallel work tracking systems:
- Legacy "tasks" table (96 items) with category-based organization
- Modern "user_stories" table (150 items) with Epic-based EA Value Stream alignment

**Decision**: 
Migrate all tasks to user stories and remove the tasks table entirely for uniformity.

**Migration Strategy - Option A (Smart Epic Mapping)**:
Map legacy task categories to appropriate Epics:
- `foundation`, `ux` → EPIC-2 (Architecture Design & Modeling)
- `ai` → EPIC-5 (Operations & Intelligence)
- `knowledge-base` → EPIC-6 (Knowledge & Collaboration)
- `modeling` → EPIC-2 (Architecture Design & Modeling)
- `integration` → EPIC-4 (Development & Implementation)

**Rationale**:
1. **Single Source of Truth**: One unified work tracking system
2. **EA Alignment**: User stories align with Enterprise Architecture Value Streams
3. **Traceability**: Epic-based organization enables better portfolio visibility
4. **Consistency**: All work items follow same structure (Gherkin acceptance criteria, defect tracking, etc.)

**Implementation Stories**:
- US-MIGRATE-TASKS: Create migration script with category-to-Epic mapping
- US-CLEANUP-TASKS: Remove tasks table, storage interface, routes, and UI components

**Impact**:
- Eliminates confusion between tasks and stories
- Simplifies UI (remove redundant task views)
- Aligns all work with EA Value Streams
- Enables unified search, reporting, and governance

**Status**: In Progress

---

## Design Pattern Registry

### Pattern: Epic-Based Work Organization
- **All work items** organized under 6 strategic Epics aligned with EA Value Streams
- **No ad-hoc categorization** - every story belongs to an Epic
- **Epic ownership** - each Epic has clear value stream and target personas

### Pattern: Gherkin Acceptance Criteria
- **All user stories** must have valid Gherkin format (Given/When/Then)
- **Real-time validation** prevents status changes without valid criteria
- **Enforcement** ensures testability and clarity

### Pattern: Defect Lifecycle Management
- **Defects linked to stories** - all bugs tracked within story context
- **Severity-based prioritization** - critical/high/medium/low
- **Story blocking** - stories cannot be marked done with open defects
- **Resolution tracking** - root cause analysis and resolution notes required

---

## Technical Debt Register

| ID | Description | Introduced | Severity | Mitigation Story | Target |
|----|-------------|------------|----------|------------------|--------|
| TD-001 | Tasks table duplication | Legacy | Medium | US-MIGRATE-TASKS, US-CLEANUP-TASKS | Current Sprint |

---

## Future Considerations

### Under Review
- Keyboard navigation for unified search (accessibility enhancement)
- GitHub Actions integration for story-to-commit traceability
- Multi-agent AI development team architecture


### DD-002: Deprecation of tldraw for Custom Canvas (December 8, 2025)

**Context**: 
Initial spikes (`spike-tldraw.tsx`) used `tldraw` SDK. While powerful, `tldraw`'s commercial licensing requires per-user fees that conflict with our "per-application" business model and open-core strategy.

**Decision**: 
Deprecate `tldraw` immediately and standardize on `react-konva` for the Graph/Canvas engine.

**Rationale**:
1.  **Licensing**: `react-konva` is MIT licensed, allowing unlimited redistribution.
2.  **Control**: We need fine-grained control over "Data Binding" (where a shape *is* a database record). `tldraw`'s internal state management is optimized for whiteboarding, not structured modeling.
3.  **Performance**: Direct integration with our internal React state management and `tanstack/react-query` is simplified without the `tldraw` store abstraction.

**Consequences**:
- We must build standard UI features (selection handles, zooming, minimap) from scratch.
- `spike-tldraw.tsx` will be removed from the codebase.
- The "Canvas" will be a strict "View" of the `architectural_objects` table, not a separate document store.

**Status**: Accepted

### Deferred
- None currently

---

**Document Maintainers**: All contributors
**Last Updated**: October 10, 2025
**Review Cadence**: Updated with each major architectural decision
