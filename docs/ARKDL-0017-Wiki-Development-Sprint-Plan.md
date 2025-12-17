# ARKDL-0017: Wiki Knowledge Core — Development Sprint Plan

**Version:** 1.0  
**Status:** Active Development  
**Date:** December 17, 2025  
**Module:** Wiki (`/wiki-v2`)  
**Duration:** 6 Sprints (12 weeks)  
**Team Velocity:** 30-40 story points per sprint

---

## Executive Summary

This document consolidates all Wiki requirements into a sprint-ready development plan. The Wiki Knowledge Core will transform from a static mockup into a competitive enterprise documentation platform with semantic mentions, requirements management, and real-time collaboration.

---

## Current State Assessment

### ✅ Already Built (Phase 1-2 Partial)

| Feature | Status | Location |
|---------|--------|----------|
| Database Schema | ✅ Done | `wiki_pages`, `entity_mentions` tables |
| CRUD API | ✅ Done | `/api/wiki/*` endpoints |
| TipTap Editor (Basic) | ✅ Done | `tiptap-editor.tsx` |
| Tree Navigation | ✅ Done | `wiki-tree.tsx` |
| Breadcrumb | ✅ Done | `wiki-breadcrumb.tsx` |
| @Mentions Extension | ✅ Done | `mention-extension.tsx` |
| Mention Picker | ✅ Done | `mention-list.tsx` |
| Hover Preview | ✅ Done | `mention-preview.tsx` |
| Backlinks Panel | ✅ Done | `backlinks-panel.tsx` |

### 🔜 Remaining Work

| Phase | Feature | Stories | Points | Sprints |
|-------|---------|---------|--------|---------|
| 1 | Foundation Polish | 8 | 32 | 1 |
| 2 | Semantic Mentions Complete | 6 | 30 | 1 |
| 3 | Requirements Management | 10 | 64 | 2 |
| 4a | Templates | 9 | 40 | 1 |
| 4b | Collaboration | 7 | 41 | 1 |
| 4c | Version History | 6 | 34 | 1 |
| **Total** | | **46** | **241** | **7** |

---

## Sprint Plan

### 🚀 Sprint W1: Foundation Polish (30 points)
**Goal:** Complete Phase 1 - all CRUD operations robust and polished

| Story ID | Title | Points | Epic | HLR |
|----------|-------|--------|------|-----|
| US-WIKI-001 | Auto-save drafts every 30 seconds | 5 | EPIC-WIKI-01 | HLR-WIKI-007 |
| US-WIKI-002 | Restore from auto-saved drafts | 3 | EPIC-WIKI-01 | HLR-WIKI-008 |
| US-WIKI-003 | Duplicate/clone existing pages | 3 | EPIC-WIKI-01 | HLR-WIKI-006 |
| US-WIKI-004 | Delete with confirmation dialog | 3 | EPIC-WIKI-01 | HLR-WIKI-004 |
| US-WIKI-005 | Full-text search (title + content) | 5 | EPIC-WIKI-01 | HLR-WIKI-010 |
| US-WIKI-006 | Keyboard shortcuts reference (Cmd+/) | 3 | EPIC-WIKI-02 | HLR-WIKI-032 |
| US-WIKI-007 | Block drag-and-drop reordering | 5 | EPIC-WIKI-02 | HLR-WIKI-031 |
| US-WIKI-008 | Context menu (right-click) on tree | 5 | EPIC-WIKI-03 | HLR-WIKI-046 |

**Sprint W1 Target Date:** January 3, 2026  
**Acceptance:** All foundation features work smoothly, matches Confluence core.

---

### 🚀 Sprint W2: Semantic Mentions Complete (30 points)
**Goal:** Complete Phase 2 - full @mention system with status awareness

| Story ID | Title | Points | Epic | HLR |
|----------|-------|--------|------|-----|
| US-WIKI-009 | Real-time status updates on mentions | 8 | EPIC-WIKI-04 | HLR-WIKI-063 |
| US-WIKI-010 | Search ADRs in mention picker | 3 | EPIC-WIKI-04 | HLR-WIKI-057 |
| US-WIKI-011 | Search Requirements in mention picker | 3 | EPIC-WIKI-04 | HLR-WIKI-056 |
| US-WIKI-012 | Search Users/Teams in mention picker | 5 | EPIC-WIKI-04 | HLR-WIKI-058 |
| US-WIKI-013 | Backlink snippets with context | 5 | EPIC-WIKI-05 | HLR-WIKI-074 |
| US-WIKI-014 | Filter backlinks by page type | 3 | EPIC-WIKI-05 | HLR-WIKI-075 |
| US-WIKI-015 | Show backlinks on User Stories (Plan) | 3 | EPIC-WIKI-05 | HLR-WIKI-072 |

**Sprint W2 Target Date:** January 17, 2026  
**Acceptance:** @mentions are "living" - status updates propagate, backlinks show context.

---

### 🚀 Sprint W3: Requirements Foundation (32 points)
**Goal:** Phase 3a - Requirement pages and structured metadata

| Story ID | Title | Points | Epic | HLR |
|----------|-------|--------|------|-----|
| US-WIKI-016 | Requirement page template | 8 | EPIC-WIKI-06 | HLR-WIKI-080 |
| US-WIKI-017 | Requirement identifier validation | 5 | EPIC-WIKI-06 | HLR-WIKI-081 |
| US-WIKI-018 | Requirement type selector (Bus/Prod/Tech) | 3 | EPIC-WIKI-06 | HLR-WIKI-082 |
| US-WIKI-019 | Requirement priority & status | 5 | EPIC-WIKI-06 | HLR-WIKI-083-084 |
| US-WIKI-020 | Rich text description with @mentions | 5 | EPIC-WIKI-06 | HLR-WIKI-085 |
| US-WIKI-021 | Link requirements to components | 5 | EPIC-WIKI-06 | HLR-WIKI-086 |
| US-WIKI-022 | Link requirements to user stories | 5 | EPIC-WIKI-06 | HLR-WIKI-087 |

**Sprint W3 Target Date:** January 31, 2026  
**Acceptance:** Can create structured requirements with full metadata and links.

---

### 🚀 Sprint W4: Requirements UI & Traceability (32 points)
**Goal:** Phase 3b - Requirements table view and traceability matrix

| Story ID | Title | Points | Epic | HLR |
|----------|-------|--------|------|-----|
| US-WIKI-023 | Convert text to requirement | 8 | EPIC-WIKI-06 | HLR-WIKI-088 |
| US-WIKI-024 | Requirements table view | 8 | EPIC-WIKI-06 | HLR-WIKI-089 |
| US-WIKI-025 | Generate traceability matrix | 8 | EPIC-WIKI-07 | HLR-WIKI-090 |
| US-WIKI-026 | Highlight unmet requirements | 5 | EPIC-WIKI-07 | HLR-WIKI-093 |
| US-WIKI-027 | Export matrix to CSV | 5 | EPIC-WIKI-07 | HLR-WIKI-094 |
| US-WIKI-028 | Embed matrix in wiki pages | 5 | EPIC-WIKI-07 | HLR-WIKI-095 |

**Sprint W4 Target Date:** February 14, 2026  
**Acceptance:** Full traceability - REQ → Component → Story, export working.

---

### 🚀 Sprint W5: Templates & Collaboration Start (40 points)
**Goal:** Phase 4a - Pre-built templates and comment system

| Story ID | Title | Points | Epic | HLR |
|----------|-------|--------|------|-----|
| US-WIKI-029 | ADR template | 5 | EPIC-WIKI-08 | HLR-WIKI-100 |
| US-WIKI-030 | Solution Design Document template | 5 | EPIC-WIKI-08 | HLR-WIKI-101 |
| US-WIKI-031 | Meeting Notes template | 3 | EPIC-WIKI-08 | HLR-WIKI-103 |
| US-WIKI-032 | Business Case template | 3 | EPIC-WIKI-08 | HLR-WIKI-102 |
| US-WIKI-033 | RFC template | 5 | EPIC-WIKI-08 | HLR-WIKI-106 |
| US-WIKI-034 | Custom template creation | 8 | EPIC-WIKI-08 | HLR-WIKI-107 |
| US-WIKI-035 | Share templates with org | 5 | EPIC-WIKI-08 | HLR-WIKI-108 |
| US-WIKI-036 | Add comments on blocks | 8 | EPIC-WIKI-09 | HLR-WIKI-113 |

**Sprint W5 Target Date:** February 28, 2026  
**Acceptance:** Can use templates, add comments to specific blocks.

---

### 🚀 Sprint W6: Real-time Collaboration (41 points)
**Goal:** Phase 4b - Multi-user editing and presence

| Story ID | Title | Points | Epic | HLR |
|----------|-------|--------|------|-----|
| US-WIKI-037 | Real-time collaborative editing (Yjs) | 10 | EPIC-WIKI-09 | HLR-WIKI-110 |
| US-WIKI-038 | Collaborator cursors/selections | 5 | EPIC-WIKI-09 | HLR-WIKI-111 |
| US-WIKI-039 | Presence indicators (who's viewing) | 5 | EPIC-WIKI-09 | HLR-WIKI-112 |
| US-WIKI-040 | Resolve comments | 3 | EPIC-WIKI-09 | HLR-WIKI-114 |
| US-WIKI-041 | Subscribe to page changes | 5 | EPIC-WIKI-09 | HLR-WIKI-115 |
| US-WIKI-042 | @mention notifications in comments | 5 | EPIC-WIKI-09 | HLR-WIKI-116 |
| US-WIKI-043 | Runbook template | 3 | EPIC-WIKI-08 | HLR-WIKI-105 |
| US-WIKI-044 | Onboarding Guide template | 3 | EPIC-WIKI-08 | HLR-WIKI-104 |

**Sprint W6 Target Date:** March 14, 2026  
**Acceptance:** Multiple users can edit same page simultaneously, see cursors.

---

### 🚀 Sprint W7: Version History (34 points)
**Goal:** Phase 4c - Git-like version control for wiki

| Story ID | Title | Points | Epic | HLR |
|----------|-------|--------|------|-----|
| US-WIKI-045 | Maintain version history | 8 | EPIC-WIKI-10 | HLR-WIKI-120 |
| US-WIKI-046 | View previous versions | 5 | EPIC-WIKI-10 | HLR-WIKI-121 |
| US-WIKI-047 | Compare versions (diff view) | 8 | EPIC-WIKI-10 | HLR-WIKI-122 |
| US-WIKI-048 | Restore previous version | 5 | EPIC-WIKI-10 | HLR-WIKI-123 |
| US-WIKI-049 | Version metadata (author, timestamp) | 3 | EPIC-WIKI-10 | HLR-WIKI-124 |
| US-WIKI-050 | Commit messages when saving | 5 | EPIC-WIKI-10 | HLR-WIKI-125 |

**Sprint W7 Target Date:** March 28, 2026  
**Acceptance:** Full version control - view history, diff, restore, commit messages.

---

## Epic Summary

| Epic ID | Name | Stories | Points | Sprint(s) |
|---------|------|---------|--------|-----------|
| EPIC-WIKI-01 | Wiki Page Management | 5 | 19 | W1 |
| EPIC-WIKI-02 | Block-Based Editor | 2 | 8 | W1 |
| EPIC-WIKI-03 | Tree View & Navigation | 1 | 5 | W1 |
| EPIC-WIKI-04 | Semantic Mentions System | 4 | 19 | W2 |
| EPIC-WIKI-05 | Backlinks & References | 3 | 11 | W2 |
| EPIC-WIKI-06 | Requirements Management | 9 | 52 | W3, W4 |
| EPIC-WIKI-07 | Traceability Matrix | 4 | 23 | W4 |
| EPIC-WIKI-08 | Page Templates | 9 | 40 | W5, W6 |
| EPIC-WIKI-09 | Collaboration Features | 7 | 41 | W5, W6 |
| EPIC-WIKI-10 | Version History | 6 | 34 | W7 |
| **TOTAL** | | **50** | **252** | **7 Sprints** |

---

## Roadmap Timeline

```
2025-12                    2026-01                    2026-02                    2026-03
|--------------------------|--------------------------|--------------------------|--------------------------|
|     Sprint W1            |     Sprint W2            |     Sprint W3            |     Sprint W4            |
|   Foundation Polish      |   Mentions Complete      |   Requirements Found.    |   Traceability           |
|     (30 pts)             |     (30 pts)             |     (32 pts)             |     (32 pts)             |
|                          |                          |                          |                          |
|                          |                          |--------------------------|--------------------------|
|                          |                          |                   Sprint W5              Sprint W6 |
|                          |                          |              Templates & Comments    Real-time Collab|
|                          |                          |                   (40 pts)              (41 pts)   |
|                          |                          |                          |                          |
|--------------------------|--------------------------|--------------------------|--------------------------|
|                                                                                 Sprint W7              |
|                                                                              Version History          |
|                                                                                 (34 pts)              |
```

---

## Database Schema Additions Required

### Sprint W3-W4: Requirements Tables

```sql
-- Requirement metadata extension for wiki_pages
ALTER TABLE wiki_pages ADD COLUMN IF NOT EXISTS requirement_id TEXT;
ALTER TABLE wiki_pages ADD COLUMN IF NOT EXISTS requirement_type TEXT; -- business, product, technical
ALTER TABLE wiki_pages ADD COLUMN IF NOT EXISTS requirement_priority TEXT;
ALTER TABLE wiki_pages ADD COLUMN IF NOT EXISTS requirement_status TEXT;

-- Requirement-Component links
CREATE TABLE IF NOT EXISTS requirement_satisfactions (
  id TEXT PRIMARY KEY,
  requirement_page_id TEXT REFERENCES wiki_pages(id),
  component_id TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Requirement-Story links
CREATE TABLE IF NOT EXISTS requirement_stories (
  id TEXT PRIMARY KEY,
  requirement_page_id TEXT REFERENCES wiki_pages(id),
  story_id TEXT REFERENCES user_stories(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Sprint W5-W6: Collaboration Tables

```sql
-- Wiki comments
CREATE TABLE IF NOT EXISTS wiki_comments (
  id TEXT PRIMARY KEY,
  page_id TEXT REFERENCES wiki_pages(id),
  block_id TEXT, -- TipTap block reference
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  parent_comment_id TEXT REFERENCES wiki_comments(id),
  resolved BOOLEAN DEFAULT FALSE,
  resolved_by TEXT,
  resolved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Page subscriptions
CREATE TABLE IF NOT EXISTS wiki_subscriptions (
  id TEXT PRIMARY KEY,
  page_id TEXT REFERENCES wiki_pages(id),
  user_id TEXT NOT NULL,
  notify_on_edit BOOLEAN DEFAULT TRUE,
  notify_on_comment BOOLEAN DEFAULT TRUE,
  notify_on_mention BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Sprint W7: Version History Tables

```sql
-- Page versions
CREATE TABLE IF NOT EXISTS wiki_page_versions (
  id TEXT PRIMARY KEY,
  page_id TEXT REFERENCES wiki_pages(id),
  version_number INTEGER NOT NULL,
  content JSONB NOT NULL,
  commit_message TEXT,
  created_by TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add index
CREATE INDEX IF NOT EXISTS idx_wiki_versions_page_id ON wiki_page_versions(page_id);
```

---

## Success Metrics

### Phase 1-2 Completion (Sprint W1-W2)
- [ ] 100% of CRUD operations work without errors
- [ ] @mentions work for all entity types
- [ ] Backlinks show on components in Design module
- [ ] Auto-save prevents data loss

### Phase 3 Completion (Sprint W3-W4)
- [ ] Can create structured requirements
- [ ] Traceability matrix auto-generates
- [ ] Unmet requirements highlighted
- [ ] Export to CSV works

### Phase 4 Completion (Sprint W5-W7)
- [ ] All 7 templates available
- [ ] Multiple users can edit simultaneously
- [ ] Version history shows all changes
- [ ] Can restore any previous version

---

## Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Yjs integration complexity | High | Start simple, use battle-tested examples |
| Real-time sync conflicts | Medium | Test with multiple users early |
| Performance with large docs | Medium | Lazy loading, JSONB indexing |
| Requirements scope creep | High | Strict adherence to HLR definitions |

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-12-17 | AI Assistant | Initial sprint plan based on ARKDL-0013 requirements |

**Next Review:** After Sprint W1 completion

