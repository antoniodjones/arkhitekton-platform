# ARKDL-0013: Wiki Knowledge Core — Complete Rebuild Plan

**Status:** Implementation Roadmap  
**Type:** Technical Strategy & Execution Plan  
**Module:** Wiki (`/wiki`)  
**Created:** 2024-12-15  
**Based On:** ARKDL-0011 Vision, ARKDL-0011-B Requirements, ARKDL-0011-V2 Strategy  
**Roadmap:** 90 User Stories, 423 Story Points, 18 Sprints (~9 months)

---

## Executive Summary: From Mock to Market Leader

### Current State Analysis

**What Exists Today (Static MVP):**
```typescript
// Current: client/src/pages/wiki.tsx (904 lines)
✅ Basic card/list view for pages
✅ Search and filtering by category/status
✅ Mock hardcoded data (10 wiki pages)
✅ Stats dashboard (views, likes, contributors)
✅ Tab-based navigation (Overview, User Guide, Tech Strategy, Integration, Data)
✅ Visual design (orange theme, good UX)
```

**What's Missing (Everything That Matters):**
```typescript
❌ No database backend (100% hardcoded)
❌ No editor (can't create or edit pages)
❌ No tree navigation (no hierarchy)
❌ No semantic mentions (@mentions system)
❌ No cross-module linking
❌ No version history
❌ No collaboration features
❌ No requirements management
❌ No templates (ADR, Design Docs, etc.)
❌ No traceability
```

### The Gap: Where We Are vs. Where We Need to Be

| Feature | Current State | Vision State | Gap Size |
|---------|---------------|--------------|----------|
| **Editor** | None | TipTap block-based with slash commands, markdown, drag-drop | 🔴 **CRITICAL** |
| **Data Layer** | Hardcoded arrays | PostgreSQL with Drizzle ORM, full CRUD API | 🔴 **CRITICAL** |
| **Semantic Mentions** | None | @mentions across all modules, live status updates | 🔴 **CRITICAL** (Killer Feature) |
| **Tree Navigation** | None | Hierarchical sidebar with expand/collapse, drag-drop | 🟠 **HIGH** |
| **Requirements** | None | Structured + narrative, traceability matrix | 🟠 **HIGH** |
| **Collaboration** | None | Real-time editing, comments, presence awareness | 🟡 **MEDIUM** |
| **Templates** | None | ADR, Design Docs, Business Case, RFC, etc. | 🟡 **MEDIUM** |
| **Version History** | None | Git-like versioning, diff view, restore | 🟡 **MEDIUM** |
| **Backlinks** | None | Bidirectional references, "Referenced in" | 🟠 **HIGH** |

**Bottom Line:** This is a **complete rebuild**, not an enhancement. Only the visual design and basic UI patterns are reusable. Everything else needs to be built from scratch.

---

## Strategic Priorities: What Makes Us Different

### 🎯 **Priority 1: The Killer Feature (Phase 2)**

**Semantic Mentions System (`@mentions`)** — This is our competitive moat.

**Why This Matters:**
- **No competitor has this**: Sparx, LeanIX, Ardoq, MEGA, BiZZdesign all export static docs
- **Living Documentation**: Text that updates when architecture changes
- **Cross-Module Magic**: Wiki → Plan → Design → Canvas, all linked
- **Status Awareness**: `@PaymentService` shows green (active), orange (deprecated), red (sunset)

**Example:**
```markdown
## Payment Architecture

The @PaymentService connects to @StripeAPI and depends on @PaymentDatabase.
This decision was documented in @ADR-005 and implements @REQ-PAY-001.

Current status: @US-PAY-001 is in-progress, ETA: Sprint 12.

See architecture diagram: @Diagram-PaymentFlow
```

**Every `@` mention is:**
- ✅ Live link to the entity
- ✅ Shows current status/health
- ✅ Clickable → navigates to module
- ✅ Tracked as backlink
- ✅ Enables hover preview card

**Impact:** Architects never export to Word again. Documentation is always current.

### 🎯 **Priority 2: Foundation (Phase 1)**

**Get to Confluence Parity First**

Before we surpass competitors, we need to match Confluence's core:
- TipTap editor (rich text, blocks, formatting)
- Tree navigation (hierarchy, folders)
- CRUD operations (create, edit, delete, search)
- Basic collaboration (comments, watch pages)

**Why This Matters:** Prove we can do what everyone else does, then blow past them.

### 🎯 **Priority 3: Requirements Revolution (Phase 3)**

**Kill Excel & JIRA for Requirements**

- **Hybrid Approach**: Structured (table) + Narrative (rich text)
- **Traceability Built-In**: REQ → Component → Story → Code
- **Convert Text to REQ**: Highlight meeting note → Create Requirement
- **Auto-Generate Matrix**: See what's unmet, export to CSV

**Why This Matters:** Every EA tool treats requirements as an afterthought. We make them first-class.

---

## Technical Architecture: The Rebuild

### Current Architecture (What We Have)

```
client/src/pages/wiki.tsx (904 lines)
├── WikiContent component
│   ├── Hardcoded mock data (pages[], implementationDocs[])
│   ├── Search & filter logic (client-side only)
│   ├── Card grid view
│   └── Tab-based content areas
└── No backend, no database, no API

Reusable:
✅ Visual design (orange theme, glassmorphism cards)
✅ GovernanceHeader component
✅ Search/filter UI patterns
✅ Stats dashboard layout
✅ Icon usage (Lucide icons)

Must Replace:
❌ Everything else
```

### Target Architecture (What We Need)

```
Database Layer (PostgreSQL + Drizzle ORM)
├── wiki_pages (id, title, content JSONB, status, template, parent_id, project_id, timestamps, metadata)
├── entity_mentions (id, page_id, entity_type, entity_id, text, position)
├── wiki_requirements (page_id, identifier, requirement_type, priority, req_status)
├── requirement_satisfactions (requirement_id, component_id)
├── requirement_stories (requirement_id, story_id)
├── wiki_comments (id, page_id, parent_comment_id, block_id, content, resolved, timestamps)
├── wiki_page_versions (id, page_id, version_number, content JSONB, commit_message, timestamps)
└── wiki_templates (id, name, description, content JSONB, is_system, is_shared, timestamps)

API Layer (Express + TypeScript)
├── GET    /api/wiki                      # List all pages
├── GET    /api/wiki/:id                  # Get page by ID
├── POST   /api/wiki                      # Create new page
├── PUT    /api/wiki/:id                  # Update page
├── DELETE /api/wiki/:id                  # Delete page
├── POST   /api/wiki/:id/duplicate        # Duplicate page
├── GET    /api/wiki/search?q=query       # Search pages
├── GET    /api/wiki/mentions/search?q=   # Search for @mention
├── GET    /api/wiki/:id/backlinks        # Get backlinks for page
├── POST   /api/wiki/mentions             # Create mention
├── GET    /api/wiki/requirements         # List all requirements
├── POST   /api/wiki/requirements         # Create requirement
├── PUT    /api/wiki/requirements/:id     # Update requirement
├── GET    /api/wiki/traceability         # Get traceability matrix
├── GET    /api/wiki/tree                 # Get tree structure
├── PUT    /api/wiki/:id/move             # Move page in tree
├── GET    /api/wiki/templates            # List templates
├── POST   /api/wiki/templates            # Create template
├── GET    /api/wiki/:id/comments         # Get page comments
├── POST   /api/wiki/:id/comments         # Add comment
├── PUT    /api/wiki/comments/:id/resolve # Resolve comment
├── GET    /api/wiki/:id/versions         # Get version history
├── GET    /api/wiki/:id/versions/:v      # Get specific version
├── POST   /api/wiki/:id/restore/:v       # Restore version
├── GET    /api/wiki/:id/diff?from=v1&to=v2 # Compare versions
└── WS     /ws/wiki/:id                   # WebSocket for real-time collab

Frontend Layer (React + TipTap + TanStack Query)
client/src/
├── pages/
│   └── wiki.tsx (Rebuild: List view, stats, navigation)
├── components/wiki/
│   ├── Editor.tsx                        # TipTap editor with extensions
│   ├── TreeSidebar.tsx                   # Hierarchical navigation
│   ├── PageHeader.tsx                    # Title, breadcrumbs, actions
│   ├── MentionPicker.tsx                 # @ mention search modal
│   ├── MentionChip.tsx                   # Rendered @mention with status
│   ├── HoverCard.tsx                     # Hover preview for mentions
│   ├── SearchBar.tsx                     # Full-text search
│   ├── RequirementsTable.tsx             # Structured requirements view
│   ├── TraceabilityMatrix.tsx            # Auto-generated traceability
│   ├── CommentThread.tsx                 # Comment sidebar
│   ├── VersionHistory.tsx                # Git-like version list
│   ├── DiffView.tsx                      # Side-by-side comparison
│   ├── TemplateLibrary.tsx               # Template selection
│   └── PresenceAvatars.tsx               # Who's editing/viewing
├── lib/wiki/
│   ├── tiptap-extensions.ts              # Custom TipTap extensions
│   ├── mention-resolver.ts               # Cross-module mention search
│   ├── backlink-tracker.ts               # Backlink updates
│   └── collaboration-provider.ts         # Yjs for real-time collab
└── hooks/
    ├── useWikiPage.ts                    # Page CRUD operations
    ├── useMentions.ts                    # Mention search & insertion
    ├── useBacklinks.ts                   # Backlink queries
    ├── useRequirements.ts                # Requirements management
    └── useVersionHistory.ts              # Version operations
```

### Key Technology Choices

| Layer | Technology | Why |
|-------|------------|-----|
| **Editor** | **TipTap** (Headless ProseMirror) | Block-based, extensible, supports custom node views for @mentions, real-time collab ready (Yjs) |
| **Data Storage** | **PostgreSQL + Drizzle ORM** | Type-safe queries, JSONB for flexible content storage, full-text search, already in use |
| **State Management** | **TanStack Query** | Server state caching, optimistic updates, already integrated |
| **Search** | **Fuse.js (client)** + **PostgreSQL FTS (server)** | Fast client-side filtering for @mentions, powerful server-side full-text search |
| **Real-Time** | **Yjs + WebSockets** (Phase 4) | CRDT-based conflict-free collaboration, industry standard |
| **Backlinks** | **Junction Table** (`entity_mentions`) | Track every @mention, enable bidirectional queries |

---

## Implementation Phases: The 18-Sprint Roadmap

### 📦 **PHASE 1: Foundation (Sprints 1-4) — 130 Points**

**Goal:** Build infrastructure and get to Confluence parity.

#### **Sprint 1: Database & API Foundation (25 points)**
- ✅ Create database schema (wiki_pages, entity_mentions)
- ✅ Implement Drizzle models
- ✅ Build API routes (GET, POST, PUT, DELETE /api/wiki)
- ✅ Add full-text search endpoint
- ✅ Migration scripts

**Deliverables:**
- Working CRUD API
- Database tables with indexes
- Basic search functionality

#### **Sprint 2: TipTap Editor Basics (25 points)**
- ✅ Integrate TipTap editor
- ✅ Markdown shortcuts (# for H1, - for bullets)
- ✅ Text formatting (bold, italic, underline)
- ✅ Basic blocks (headings, paragraphs, lists)
- ✅ Keyboard shortcuts (Cmd+B, Cmd+I, Cmd+S)

**Deliverables:**
- Functional rich text editor
- Create/edit pages
- Auto-save drafts

#### **Sprint 3: Editor Advanced + Tree Nav (26 points)**
- ✅ Slash commands (/) for block insertion
- ✅ Code blocks with syntax highlighting
- ✅ Tables and images
- ✅ Block drag-and-drop
- ✅ Tree sidebar navigation
- ✅ Expand/collapse folders

**Deliverables:**
- Full-featured editor matching Notion/Confluence
- Hierarchical navigation

#### **Sprint 4: CRUD + Search Polish (25 points)**
- ✅ Page deletion with confirmation
- ✅ Duplicate pages
- ✅ Hierarchical page creation (parent/child)
- ✅ Advanced search (content + metadata)
- ✅ Metadata tracking (created_by, updated_by, timestamps)

**Deliverables:**
- Complete page management
- Polished search experience
- Phase 1 complete

**Phase 1 Success Criteria:**
- [ ] Architects can create, edit, delete wiki pages
- [ ] Rich text editing with all standard formatting
- [ ] Tree navigation works smoothly
- [ ] Search returns relevant results
- [ ] Auto-save prevents data loss
- [ ] **We've matched Confluence's core features**

---

### 🚀 **PHASE 2: The Killer Feature (Sprints 5-8) — 137 Points**

**Goal:** Build the semantic mentions system — our competitive moat.

#### **Sprint 5: Mention Infrastructure (25 points)**
- ✅ TipTap mention extension
- ✅ `@` trigger for mention picker
- ✅ entity_mentions database table
- ✅ API: POST /api/wiki/mentions
- ✅ API: GET /api/wiki/mentions/search
- ✅ Cross-module search (Plan, Design, Canvas, Wiki)

**Deliverables:**
- Type `@` → search modal appears
- Search across User Stories, Epics, Components, Diagrams, Wiki Pages

#### **Sprint 6: Mention Rendering + Status (26 points)**
- ✅ Render mentions as colored chips
- ✅ Status-aware colors (green=active, orange=deprecated, red=sunset)
- ✅ Real-time status updates (when component status changes, wiki updates)
- ✅ Click mention → navigate to entity
- ✅ Hover preview card (shows key info without navigating)

**Deliverables:**
- Living documentation: text that knows about architecture
- Status awareness: see component health in docs

#### **Sprint 7: Cross-Module Integration (25 points)**
- ✅ Integrate with Plan module (search Stories, Epics)
- ✅ Integrate with Design module (search Components)
- ✅ Integrate with Canvas module (search Diagrams)
- ✅ Search Requirements (within Wiki)
- ✅ Search ADRs (within Wiki)
- ✅ Search Users/Teams

**Deliverables:**
- Universal search: find anything from anywhere
- Seamless cross-module navigation

#### **Sprint 8: Backlinks + Polish (23 points)**
- ✅ Backlink tracking ("Referenced in" section)
- ✅ Show backlinks on Components (in Design module)
- ✅ Show backlinks on User Stories (in Plan module)
- ✅ Navigate via backlinks (click → jump to mention)
- ✅ Backlink snippets (show context)
- ✅ Filter backlinks by page type

**Deliverables:**
- Bidirectional linking complete
- Discover all documentation for any entity
- Phase 2 complete

**Phase 2 Success Criteria:**
- [ ] Type `@PaymentService` → links to actual component
- [ ] Mention chips show component status (green/orange/red)
- [ ] Click mention → navigate to Design module
- [ ] Hover mention → see preview card
- [ ] Component pages show "Mentioned in Wiki: 3 pages"
- [ ] **We've surpassed every EA tool on the market**

---

### 📋 **PHASE 3: Requirements Revolution (Sprints 9-12) — 85 Points**

**Goal:** Transform how requirements are documented and traced.

#### **Sprint 9: Requirements Pages (16 points)**
- ✅ Requirement page template
- ✅ Set requirement identifier (REQ-BUS-001, validation)
- ✅ Set type (Business/Product/Technical)
- ✅ Set priority (High/Medium/Low)
- ✅ Set status (Proposed/Accepted/Implemented/Deprecated)

**Deliverables:**
- Create requirements as wiki pages
- Structured metadata

#### **Sprint 10: Requirements Linking (15 points)**
- ✅ Link requirements to components ("Satisfied By")
- ✅ Link requirements to user stories
- ✅ requirement_satisfactions table
- ✅ requirement_stories table
- ✅ Bidirectional links (REQ ↔ Component ↔ Story)

**Deliverables:**
- Full traceability
- See which components satisfy which requirements

#### **Sprint 11: Requirements UI + Convert (18 points)**
- ✅ Requirements table view (sortable, filterable)
- ✅ Convert text to requirement (highlight → Create REQ)
- ✅ Narrative + structured (rich text description + metadata)
- ✅ Search requirements by ID, type, priority

**Deliverables:**
- Easy requirement management
- Quick capture from meeting notes

#### **Sprint 12: Traceability Matrix (33 points)**
- ✅ Auto-generate traceability matrix
- ✅ Show REQ → Components mapping
- ✅ Show REQ → Stories mapping
- ✅ Highlight unmet requirements (no components/stories)
- ✅ Export to CSV
- ✅ Embed matrix in wiki pages

**Deliverables:**
- Complete visibility into requirement coverage
- Find gaps instantly
- Export for compliance
- Phase 3 complete

**Phase 3 Success Criteria:**
- [ ] Requirements have both structure (metadata) and story (rich text)
- [ ] Link REQ → Component → Story → Code
- [ ] See unmet requirements highlighted
- [ ] Export traceability matrix to CSV
- [ ] Convert meeting notes to requirements in 2 clicks
- [ ] **We've replaced Excel & JIRA for requirements**

---

### ✨ **PHASE 4: Polish & Scale (Sprints 13-18) — 112 Points**

**Goal:** Complete the platform with templates, collaboration, and version control.

#### **Sprints 13-14: Templates (37 points)**
- ✅ ADR template (Architecture Decision Records)
- ✅ Solution Design Document template
- ✅ Business Case template
- ✅ Meeting Notes template
- ✅ Onboarding Guide template
- ✅ Runbook template
- ✅ RFC template (Request for Comments)
- ✅ Create custom templates
- ✅ Share templates with organization

**Deliverables:**
- Pre-built templates for common docs
- Team can create/share custom templates

#### **Sprints 15-16: Collaboration (41 points)**
- ✅ Real-time collaborative editing (Yjs)
- ✅ Show collaborator cursors
- ✅ Presence indicators (who's editing/viewing)
- ✅ Add comments on blocks
- ✅ Resolve comments
- ✅ Subscribe to page changes (notifications)
- ✅ Mention notifications in comments (@john → notify John)

**Deliverables:**
- Google Docs-style collaboration
- Team can work together in real-time

#### **Sprints 17-18: Version History (34 points)**
- ✅ Maintain version history for every page
- ✅ View previous versions
- ✅ Compare versions (diff view)
- ✅ Restore previous version
- ✅ View version metadata (author, timestamp, changes)
- ✅ Add commit messages when saving

**Deliverables:**
- Git-like version control
- Never lose work, always traceable
- Phase 4 complete

**Phase 4 Success Criteria:**
- [ ] Create ADR from template in 10 seconds
- [ ] Multiple architects edit same page simultaneously
- [ ] See collaborator cursors in real-time
- [ ] Restore previous version if mistake made
- [ ] View diff between v3 and v5
- [ ] **We've matched Google Docs + Confluence + EA tools combined**

---

## Migration Strategy: From Mock to Production

### Step 1: Database Setup (Week 1)

```bash
# Create database schema
cd /Users/antonio.d.jones/Desktop/Engineer/arkhitekton-platform

# Run migration script (to be created)
npx drizzle-kit generate:pg
npx drizzle-kit push:pg

# Verify tables created
psql $DATABASE_URL -c "\dt wiki_*"
```

### Step 2: API Layer (Week 1-2)

```typescript
// server/routes.ts - Add Wiki endpoints
app.get('/api/wiki', async (req, res) => {
  const pages = await storage.getWikiPages();
  res.json({ data: pages });
});

app.post('/api/wiki', async (req, res) => {
  const page = await storage.createWikiPage(req.body);
  res.json({ data: page });
});

// ... more endpoints
```

### Step 3: Frontend Rebuild (Week 2-4)

```typescript
// client/src/pages/wiki.tsx - Rebuild
// KEEP: Visual design, stats dashboard, search UI
// REPLACE: Hardcoded data → TanStack Query + API calls

import { useQuery, useMutation } from '@tanstack/react-query';
import { WikiEditor } from '@/components/wiki/Editor';
import { TreeSidebar } from '@/components/wiki/TreeSidebar';

export function WikiPage() {
  const { data: pages, isLoading } = useQuery({
    queryKey: ['/api/wiki'],
    queryFn: async () => {
      const res = await fetch('/api/wiki');
      return res.json();
    }
  });

  return (
    <AppLayout>
      <div className="flex">
        <TreeSidebar pages={pages} />
        <WikiEditor pageId={selectedPageId} />
      </div>
    </AppLayout>
  );
}
```

### Step 4: Incremental Rollout

**Week 1-4: Foundation**
- Deploy database + API
- Deploy basic editor
- Internal testing only

**Week 5-8: Killer Feature**
- Deploy @mentions system
- Enable cross-module linking
- Beta testing with select users

**Week 9-12: Requirements**
- Deploy requirements features
- Migrate existing requirements to new system
- GA (General Availability)

**Week 13-18: Polish**
- Roll out templates
- Enable collaboration
- Enable version history

---

## Success Metrics: How We Know We've Won

### User Adoption Metrics
- **Wiki pages created per user**: Target 10+/month
- **@mentions used per page**: Target 5+/page
- **Backlink navigation**: Target 20% click-through
- **Cross-module references**: Target 50% of pages link to Plan/Design/Canvas

### Business Impact Metrics
- **Time to documentation**: Current: 2-4 hours in Word, Target: 15 minutes in Wiki
- **Documentation freshness**: Target: 80% of docs updated in last 30 days
- **Tool consolidation**: Target: Replace Confluence + Word exports + Excel requirements
- **Search effectiveness**: Target: 90% find rate for architecture decisions

### Competitive Metrics
- **Confluence replacement rate**: Target: 50% of customers cancel Confluence after Wiki launch
- **Feature parity**: Target: 100% of Confluence features + semantic mentions (unique)
- **"Never export" adoption**: Target: 80% using share links vs exports

---

## Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| **TipTap learning curve** | 🟠 Medium | Start with basic config, incrementally add extensions, reference TipTap docs |
| **Cross-module integration complexity** | 🔴 High | Build mention resolver early, test with each module, mock data initially |
| **Real-time collab complexity** | 🟡 Low (Phase 4) | Use battle-tested Yjs library, defer to Phase 4, plenty of examples |
| **Performance with large pages** | 🟠 Medium | Pagination, lazy loading, JSONB indexing, monitor query performance |
| **Data migration from mock to real** | 🟢 Low | Mock data is minimal, easy to recreate manually or via seed script |
| **Scope creep** | 🔴 High | Stick to 18-sprint plan, defer "nice-to-haves" to Phase 5 (future) |

---

## Next Steps: Week 1 Action Plan

### Day 1-2: Database Schema
```bash
# Create migration files
1. wiki_pages table
2. entity_mentions table
3. wiki_requirements table
4. Add indexes for full-text search
5. Run migrations
```

### Day 3-5: API Layer
```bash
# Build core endpoints
1. GET /api/wiki (list pages)
2. GET /api/wiki/:id (get page)
3. POST /api/wiki (create page)
4. PUT /api/wiki/:id (update page)
5. DELETE /api/wiki/:id (delete page)
6. GET /api/wiki/search?q= (search)
7. Test with Postman/curl
```

### Day 6-7: TipTap Integration
```bash
# Frontend groundwork
1. npm install @tiptap/react @tiptap/starter-kit
2. Create client/src/components/wiki/Editor.tsx
3. Basic TipTap setup (no extensions yet)
4. Connect to API (load/save)
5. Test: Can create and edit a page
```

**Week 1 Goal:** Working CRUD with basic editor. Can create/edit/delete pages. Ready for Sprint 2 (advanced editor features).

---

## Appendix: File Structure

```
docs/
├── ARKDL-0011-Wiki-Knowledge-Core-Vision.md              (Vision)
├── ARKDL-0011-V2-wiki-Strategic-Vision.md                (Strategy)
├── ARKDL-0011-B-Wiki-Knowledge-Core-Requirements.md      (Requirements)
└── ARKDL-0013-Wiki-Rebuild-Plan.md                       (This document)

shared/
└── schema.ts                                             (Add wiki_pages, entity_mentions, etc.)

server/
├── db.ts                                                 (Database connection)
├── storage.ts                                            (Add IStorage methods for wiki)
└── routes.ts                                             (Add /api/wiki endpoints)

client/src/
├── pages/
│   └── wiki.tsx                                          (Rebuild: integrate Editor + TreeSidebar)
├── components/wiki/
│   ├── Editor.tsx                                        (NEW: TipTap editor)
│   ├── TreeSidebar.tsx                                   (NEW: Hierarchical navigation)
│   ├── MentionPicker.tsx                                 (NEW: @ search modal)
│   ├── MentionChip.tsx                                   (NEW: Rendered @mention)
│   ├── RequirementsTable.tsx                             (NEW: Requirements view)
│   └── TraceabilityMatrix.tsx                            (NEW: Traceability)
├── lib/wiki/
│   ├── tiptap-extensions.ts                              (NEW: Custom extensions)
│   └── mention-resolver.ts                               (NEW: Cross-module search)
└── hooks/
    ├── useWikiPage.ts                                    (NEW: Page CRUD)
    ├── useMentions.ts                                    (NEW: Mention operations)
    └── useRequirements.ts                                (NEW: Requirements operations)

scripts/
├── create-wiki-stories.ts                                (✅ Already created)
├── create-wiki-stories-phase2-4.ts                       (✅ Already created)
├── create-wiki-stories-phase3-4-final.ts                 (✅ Already created)
└── migrate-wiki-data.ts                                  (NEW: Seed real data)
```

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2024-12-15 | AI Assistant | Initial comprehensive rebuild plan based on vision, requirements, and current state analysis |

**Approved by:** [Pending]  
**Next Review:** After Sprint 4 (Phase 1 complete)

---

**END OF DOCUMENT**

*This plan transforms the wiki from a static mockup into the competitive advantage that makes ARKHITEKTON the market leader. Semantic mentions + living documentation = paradigm shift for enterprise architecture.*

