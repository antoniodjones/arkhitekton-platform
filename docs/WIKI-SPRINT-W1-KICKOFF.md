# Wiki Sprint W1: Foundation Polish - Kickoff Document

**Sprint:** W1 (Wiki Sprint 1)  
**Duration:** 10 business days  
**Target Date:** January 3, 2026  
**Status:** ✅ **READY TO START**  
**Points:** 30 story points  

---

## 🎯 Sprint Goal

**Complete Phase 1 - All CRUD operations robust and polished**

Deliver a wiki experience that matches Confluence core functionality:
- Auto-save keeps work safe
- Search finds everything
- Editor is powerful yet intuitive
- Navigation is effortless

---

## 📋 User Stories (8 stories, 30 points)

| ID | Title | Points | Epic | Status |
|----|-------|--------|------|--------|
| US-WIKI-001 | Auto-save drafts every 30 seconds | 5 | EPIC-WIKI-01 | ✅ **Test Ready** |
| US-WIKI-002 | Restore from auto-saved drafts | 3 | EPIC-WIKI-01 | ✅ **Test Ready** |
| US-WIKI-003 | Duplicate/clone existing pages | 3 | EPIC-WIKI-01 | ✅ **Test Ready** |
| US-WIKI-004 | Delete with confirmation dialog | 3 | EPIC-WIKI-01 | ✅ **Test Ready** |
| US-WIKI-005 | Full-text search (title + content) | 5 | EPIC-WIKI-01 | ✅ **Test Ready** |
| US-WIKI-006 | Keyboard shortcuts reference (Cmd+/) | 3 | EPIC-WIKI-02 | ✅ **Test Ready** |
| US-WIKI-007 | Block drag-and-drop reordering | 5 | EPIC-WIKI-02 | ✅ **Test Ready** |
| US-WIKI-008 | Context menu (right-click) on tree | 5 | EPIC-WIKI-03 | ✅ **Test Ready** |

---

## ✅ Test Coverage: 100%

### Test Suites (5 suites, 20 test cases)

#### TS-WIKI-001: Auto-Save & Draft Recovery
**Stories Covered:** US-WIKI-001, US-WIKI-002  
**Test Cases:** 5
- Auto-save triggers after 30s of inactivity
- Auto-save doesn't trigger during continuous typing
- Manual save supersedes auto-save timer
- Restore draft after browser crash (CRITICAL)
- Discard draft and load published version

#### TS-WIKI-002: Page Operations
**Stories Covered:** US-WIKI-003, US-WIKI-004  
**Test Cases:** 4
- Duplicate page from context menu
- Duplicate preserves all content and formatting (CRITICAL)
- Delete page shows confirmation dialog
- Delete page removes it permanently (CRITICAL)

#### TS-WIKI-003: Search & Navigation
**Stories Covered:** US-WIKI-005  
**Test Cases:** 3
- Search finds pages by title
- Search finds pages by content
- Search shows no results for non-existent content

#### TS-WIKI-004: Editor Enhancements
**Stories Covered:** US-WIKI-006, US-WIKI-007  
**Test Cases:** 4
- Cmd+/ opens keyboard shortcuts modal
- Keyboard shortcuts are functional
- Drag block to reorder within page
- Drag-and-drop works with complex blocks

#### TS-WIKI-005: Tree Context Menu
**Stories Covered:** US-WIKI-008  
**Test Cases:** 4
- Right-click shows context menu
- Context menu "Open" navigates to page
- Context menu "Add Child Page" creates nested page
- Context menu integrates with duplicate and delete

---

## 🏗️ Technical Foundation

### ✅ Already Built (Sprint 0)
- Database schema: `wiki_pages`, `entity_mentions`
- CRUD API: `/api/wiki/*`
- TipTap editor (basic)
- Tree navigation
- Breadcrumb navigation
- @Mentions system
- Hover previews
- Backlinks panel

### 🔨 To Build (This Sprint)
- Auto-save mechanism (30s debounce)
- Draft storage (localStorage or backend)
- Duplicate page API + UI
- Delete confirmation modal
- Full-text search (PostgreSQL ILIKE or ts_vector)
- Keyboard shortcuts modal
- Block drag-and-drop (TipTap DragHandle extension)
- Context menu component

---

## 📊 Development Approach: Test-Driven

### Workflow Per Story

1. **Review Test Cases**
   - Open Quality Center → Test Plan
   - Select suite for current story
   - Read all test cases to understand acceptance criteria

2. **Implement Feature**
   - Write code to pass test cases
   - Use test cases as your development checklist
   - Ensure all edge cases are covered

3. **Execute Tests**
   - Create test run for completed story
   - Manually execute each test case
   - Mark as passed/failed/blocked
   - Report bugs for failures

4. **Track Coverage**
   - View Reports → Coverage Dashboard
   - Verify coverage increases as stories complete
   - Target: 100% coverage for Sprint W1

5. **Link Code**
   - Create GitHub PR for story
   - Link PR to user story in description
   - Merge when all tests pass

---

## 🚀 Sprint Plan by Day

### Days 1-2: Auto-Save & Drafts (US-WIKI-001, 002) - 8 points
**Deliverable:** Auto-save working, drafts restorable after crash

**Tasks:**
- Implement auto-save debounce logic (30s)
- Create draft storage mechanism
- Build draft restore banner UI
- Handle restore/discard actions
- Execute 5 test cases in TS-WIKI-001

### Days 3-4: Page Operations (US-WIKI-003, 004) - 6 points
**Deliverable:** Duplicate and delete with proper UX

**Tasks:**
- Create duplicate page API endpoint
- Build duplicate dialog UI
- Create delete confirmation modal
- Implement delete logic with cascade
- Execute 4 test cases in TS-WIKI-002

### Days 5-6: Search (US-WIKI-005) - 5 points
**Deliverable:** Full-text search finds pages by title or content

**Tasks:**
- Implement search API (PostgreSQL full-text)
- Build search UI (Cmd+K dialog)
- Add search results list
- Handle result selection
- Execute 3 test cases in TS-WIKI-003

### Day 7-8: Editor Enhancements (US-WIKI-006, 007) - 8 points
**Deliverable:** Keyboard shortcuts and drag-drop working

**Tasks:**
- Create keyboard shortcuts modal
- Implement shortcut handlers
- Add TipTap DragHandle extension
- Build drag-drop UI feedback
- Execute 4 test cases in TS-WIKI-004

### Day 9-10: Context Menu (US-WIKI-008) - 5 points + Polish
**Deliverable:** Right-click context menu on tree

**Tasks:**
- Create context menu component
- Implement menu actions
- Integrate with tree
- Execute 4 test cases in TS-WIKI-005
- **Final Polish & Bug Fixes**

---

## 📈 Success Metrics

| Metric | Target | Tracking |
|--------|--------|----------|
| **Test Coverage** | 100% | Reports → Coverage Dashboard |
| **Stories Completed** | 8/8 | Plan → Stories tab |
| **Test Cases Passed** | 20/20 | Quality → Test Plan → Test Runs |
| **Defects Found** | < 5 | Quality → Defects tab |
| **Velocity** | 30 points | Plan → Dashboard |

---

## 🎯 Definition of Done

A story is **DONE** when:

✅ **Code Complete**
- Feature implemented and working
- Edge cases handled
- Error states covered

✅ **Tests Passed**
- All test cases executed
- All test cases marked as "passed"
- No critical defects open

✅ **GitHub Linked**
- PR created and merged
- PR linked to user story
- Code reviewed (if applicable)

✅ **Coverage Updated**
- Story shows in Coverage Dashboard as "covered"
- Test cases linked to story in Plan module

---

## 🔗 Quick Links

- **Test Plan:** `/quality/test-plan` → Select TS-WIKI-001 to TS-WIKI-005
- **Test Coverage:** `/quality/reports` → View Wiki Sprint W1 metrics
- **User Stories:** `/plan/stories` → Filter by `US-WIKI-00*`
- **Roadmap:** `/plan/roadmap` → View Sprint W1 timeline
- **Requirements:** `docs/ARKDL-0013-Wiki-Knowledge-Core-Requirements.md`
- **Sprint Plan:** `docs/ARKDL-0017-Wiki-Development-Sprint-Plan.md`

---

## 🚦 Pre-Sprint Checklist

✅ **Test Management Ready**
- Sprint Zero complete
- Test Plan module functional
- 5 test suites created
- 20 test cases written
- All test cases linked to stories

✅ **Infrastructure Ready**
- Database schema exists
- API endpoints functional
- TipTap editor integrated
- Tree navigation working
- Development environment stable

✅ **Team Ready**
- Sprint goal understood
- Stories prioritized
- Test cases reviewed
- Development approach agreed

---

## 🎉 Ready to Start!

**All systems green. Sprint W1 is a GO!**

### Next Steps:

1. **Start with US-WIKI-001** (Auto-save drafts)
2. **Open Test Suite TS-WIKI-001** in Quality Center
3. **Review test cases** before coding
4. **Implement feature** to pass tests
5. **Execute test run** and mark results
6. **Track progress** in Coverage Dashboard

---

## 🏆 Sprint W1 Vision

By the end of this sprint, the Wiki will:

- **Never lose work** (auto-save + draft recovery)
- **Find anything instantly** (full-text search)
- **Feel professional** (keyboard shortcuts + drag-drop)
- **Be easy to navigate** (context menu + tree operations)

**This is the foundation for world-class documentation.**

Let's build it! 🚀

---

**Document Version:** 1.0  
**Created:** December 17, 2025  
**Author:** Arkhitekton Development Team  
**Status:** Active Sprint

