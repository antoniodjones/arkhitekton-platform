# ARKDL-0011-V2: Vision & Strategy — Arkhitekton Knowledge Core
## The Competitive Advantage No One Else Has

> **Status:** Strategic Vision  
> **Type:** Product Vision & Competitive Strategy  
> **Target Module:** Wiki (`/wiki`)  
> **Updated:** Based on competitive analysis Dec 2024  
> **Key Insight:** We're not building a wiki feature. We're solving the fundamental problem that breaks every EA tool.

---

## 1. Executive Summary: The Problem Every Architect Faces

### The Universal Workflow (That Everyone Hates)

**Step 1:** Model your architecture in Sparx/LeanIX/Ardoq  
**Step 2:** Write requirements in JIRA  
**Step 3:** Document decisions in Confluence  
**Step 4:** Create business cases in PowerPoint  
**Step 5:** Write technical specs in Word  
**Step 6:** Hold design reviews, people reference all 5 tools  
**Step 7:** Model changes, docs don't update  
**Step 8:** Export model to Word for the 47th time  
**Step 9:** Manually synchronize everything (fail)  
**Step 10:** Repeat forever, cry internally

### The Real Problem

**Documentation lives everywhere EXCEPT where the architecture is.**

- Sparx EA: Export to Word/PDF/HTML
- LeanIX: Fill in metadata fields, generate reports
- Ardoq: Sync data, create dashboards  
- MEGA HOPEX: Compliance reports, audit trails
- BiZZdesign: Text fields on objects

**What they all have in common:**
1. Architecture is IN the tool
2. Documentation is GENERATED FROM the tool
3. Knowledge is SCATTERED ACROSS 10 other tools

### Our Insight

**The missing piece isn't better modeling. It's integrated knowledge.**

Every EA tool makes you choose:
- Do I model this in the tool?
- Or document it in Confluence?
- Or both, and manually keep them in sync?

**Arkhitekton's answer: Neither. We unified them.**

---

## 2. What We Learned from Competitive Research

### Discovery #1: No One Has Living Documentation

**What competitors call "documentation":**
- Sparx: Generate HTML/PDF/Word reports
- LeanIX: Structured fact sheets (metadata)
- Ardoq: Data collection surveys
- MEGA: Compliance reporting
- BiZZdesign: Object property fields

**What's missing everywhere:**
- Collaborative narrative writing
- Semantic links between text and models
- Documentation that updates when models change
- A place to write design rationale
- Integrated ADRs, business cases, meeting notes
- Confluence-style wiki that "knows" the architecture

### Discovery #2: The Export Workflow Is Universal

**Everyone does this:**
```
Model → Generate Report → Export to Word → Distribute → Out of date
```

**Why it fails:**
- Exported docs rot instantly
- No bidirectional sync
- Version chaos ("which Word doc is latest?")
- Manual updates when model changes
- Context switching nightmare

**Our opportunity:**
```
Model + Document together → Share link → Always current → Never export
```

### Discovery #3: Semantic Linking Doesn't Exist

**What exists:**
- Object properties/metadata
- References to external docs
- Links to Confluence pages

**What doesn't exist:**
- Text that "knows" about architecture
- Mentions that link to live components
- Documentation that shows component status
- Narrative text that stays in sync with models

**Example from competitors:**

*BiZZdesign:* "The Payment Service connects to Stripe"  
- Just text in a field
- Not linked to Payment Service component
- Won't update if component changes
- Can't navigate from text to model

*Arkhitekton:* "The @PaymentService connects to @Stripe"  
- `@PaymentService` links to actual component
- Shows component status (active/deprecated)
- Click navigates to architecture
- Updates if component changes

**This is our moat.**

### Discovery #4: Requirements Are Disconnected

**Current state:**
- Requirements in Excel/JIRA
- Models in EA tool
- Manually trace relationships
- No narrative context
- Can't explain WHY

**What's missing:**
- Requirements that are BOTH structured AND narrative
- Traceability that includes the story
- Links between business case → requirement → solution
- Design rationale attached to requirements
- "Convert meeting note to requirement" workflow

---

## 3. Strategic Pillars (Revised with Competitive Insights)

### I. The Bridge Between Unstructured and Structured

**The Problem No One Solves:**
- Structured data (models) lives in EA tools
- Unstructured knowledge (text) lives in Confluence
- Never the twain shall meet

**Our Solution:**
- **Unstructured:** Narrative text, meeting notes, design rationale, ADRs
- **Structured:** Architecture models, components, flows, capabilities
- **The Bridge:** Semantic mentions that link them bidirectionally

**Example:**

```markdown
## Payment Processing Architecture

Our payment architecture uses @StripeAPI to process transactions through 
the @PaymentService which connects to our @OrderManagementSystem. 

This decision was made in @ADR-005 based on @REQ-PAY-001 which requires 
PCI compliance and sub-2-second processing times.

The @PaymentService is implemented as shown in @Diagram-PaymentFlow and 
depends on these components:
- @StripeAPI (external)
- @PaymentDatabase (internal)  
- @FraudDetectionService (internal)

Last reviewed: @MeetingNote-2024-12-10
```

**Every `@mention` is a live link that:**
- Navigates to the referenced item
- Shows current status/health
- Updates if the item changes
- Appears in backlinks
- Enables hover previews

### II. Requirements-First, But Make It Smart

**The Problem:**
- Requirements are tables in Excel
- Or tickets in JIRA
- Or cards in Miro
- But never WITH the architecture

**Our Solution: Hybrid Requirements**

**Structured View:**
| ID | Type | Description | Priority | Status | Satisfies |
|----|------|-------------|----------|--------|-----------|
| REQ-001 | Business | Process payments <2s | High | Implemented | @PaymentService |
| REQ-002 | Technical | PCI DSS compliant | Critical | In Progress | @StripeAPI |

**Narrative View:**
```markdown
## REQ-001: Fast Payment Processing

### Business Context
Our customers abandon carts when checkout takes >3 seconds. Market 
research shows we lose 15% conversion for every additional second.

### Requirement
The system SHALL process payment transactions within 2 seconds from 
form submission to confirmation, at 99th percentile.

### Architecture Solution  
Implemented via @PaymentService using @StripeAPI. See @ADR-005 for 
rationale on choosing Stripe over PayPal.

### Test Strategy
Load test: @TestCase-PAY-001  
Production monitoring: @Dashboard-PaymentMetrics

### Links
- Business case: @BusinessCase-FastCheckout
- Design: @Diagram-PaymentFlow
- Implementation: @CodeRepo-PaymentService
```

**The magic:**
- Start with a simple requirement
- Add narrative context
- Link to architecture
- Link to tests
- Link to business case
- Everything traceable, everything explained

### III. Architect-Centric Authoring (Not Generic Wiki)

**The Problem:**
- Confluence: Great for meeting notes, terrible for architecture
- Notion: Great for documentation, no architecture awareness
- Wiki tools: Generic, no EA concepts

**Our Solution: Architecture-Native Blocks**

Standard blocks everyone has:
- Headings, paragraphs, lists
- Images, tables, code
- Slash commands

**Our special sauce:**
- `@Component` mentions with hover cards
- Capability heatmaps embedded inline
- Traceability matrices as live tables
- ADR template with standard sections
- Requirements table with traceability
- Mermaid.js diagrams (for quick sketches)
- Live diagram embeds from Canvas
- Decision matrix blocks
- RACI chart blocks
- API spec blocks

**Example: Architecture Decision Record Block**

```
/adr "Migrate to Microservices"
```

Auto-creates:
```markdown
# ADR-006: Migrate to Microservices

**Status:** Proposed  
**Date:** 2024-12-14  
**Deciders:** @TechLead, @SolutionArchitect  
**Affected Components:** @Monolith, @PaymentService, @OrderService

## Context and Problem Statement
[Fill in: What's the issue we're trying to solve?]

## Decision Drivers
- [ ] Scalability
- [ ] Team autonomy  
- [ ] Technology diversity
- [ ] Deployment independence

## Considered Options
1. Continue with monolith
2. Migrate to microservices
3. Modular monolith (middle ground)

## Decision Outcome
Chosen option: [To be decided]

## Consequences
**Positive:**
- [Fill in]

**Negative:**  
- [Fill in]

## Links
- Requirements: [Add @REQ mentions]
- Components: [Add @Component mentions]
- Related ADRs: [Add @ADR mentions]
```

---

## 4. Product Roadmap (Competitive-Informed)

### Phase 1: The Foundation ✅ (Weeks 1-4)
*Goal: Build what everyone else has, but better*

- **TipTap editor** with block-based editing
- **Markdown shortcuts** (# for H1, - for lists)
- **Slash commands** (/, insert blocks)
- **Basic CRUD** for pages
- **Tree view** navigation
- **Rich media** (images, code blocks, tables)

**Why this matters:** Prove we can match Confluence's core UX before we surpass it.

### Phase 2: The Killer Feature 🎯 (Months 2-3)  
*Goal: Do what NO competitor can*

**Semantic Mentions System (`@`)**

**Search when typing `@`:**
- User stories from Plan module
- Epics from Plan module
- Components from Design module
- Diagrams from Canvas module
- Other wiki pages
- Requirements from wiki
- ADRs from wiki
- Users/teams

**Live Data Nodes:**
- Mentions render as colored chips
- Color indicates status (green=active, orange=deprecated, red=sunset)
- Hover shows preview card with key info
- Click navigates to the item
- Status updates automatically

**Backlinks:**
- Every mentioned component shows "Referenced in:"
- List of wiki pages that mention it
- Enables discoverability
- "Where is this used?"

**This is our competitive moat. No one else has this.**

### Phase 3: Requirements Revolution (Months 4-6)
*Goal: Kill Excel, JIRA, and Confluence for requirements*

**Requirements Engine:**
- **Requirements table block** (structured data)
- **Requirements page template** (narrative + structure)
- **Traceability matrix block** (auto-generated)
- **Convert text to requirement** ("Create REQ from selection")
- **Link requirements to:**
  - User stories (Plan)
  - Components (Design)  
  - Test cases (future)
  - Business cases (Wiki)

**The workflow:**
1. Write meeting notes in wiki
2. Highlight key requirement from notes
3. Click "Create Requirement"
4. System creates REQ page with links
5. Requirement links back to meeting notes
6. Full traceability, zero manual work

### Phase 4: Total Platform Integration (Months 7-12)
*Goal: "Never leave Arkhitekton" becomes reality*

**Deep Integration:**
- **Plan module:** Sprint notes link to @UserStory, backlog pages
- **Design module:** Component detail pages have "Documentation" tab (wiki page)
- **Canvas module:** Diagram notes link to wiki explanations
- **Every entity:** Gets a wiki page automatically
- **Cross-module search:** Find by mention across everything

**Advanced Features:**
- **Live collaboration** (Google Docs style, Yjs)
- **Change notifications** (subscribe to components/pages)
- **Version history** (Git-like for wiki pages)
- **Approval workflows** (Draft → Review → Approved)
- **Publishing** (public wiki for stakeholders)
- **Offline mode** (edit wiki offline, sync later)

**Page Templates:**
- Architecture Decision Records (ADRs)
- Solution Design Documents
- Business Cases
- Meeting Notes
- Onboarding Guides
- Runbooks
- RFCs

---

## 5. Competitive Positioning & Messaging

### Core Positioning

**Category Creation:**
> "Arkhitekton is the first **Architecture Intelligence Platform** that unifies modeling and knowledge management into a single source of truth."

**Against Sparx EA:**
> "Sparx makes you export to Word. Arkhitekton makes Word obsolete."

**Against LeanIX:**
> "LeanIX manages metadata. Arkhitekton manages knowledge."

**Against Ardoq:**
> "Ardoq automates data sync. Arkhitekton automates documentation."

**Against Confluence:**
> "Confluence is for teams. Arkhitekton is for architects."

**Universal message:**
> "Stop choosing between modeling and documenting. Arkhitekton unifies them."

### Key Differentiators

**1. Living Documentation**
- Not exported, lives in-app
- Updates when models change
- Semantic links can't break
- Always current, never stale

**2. Semantic Mentions**
- `@Component` links to actual architecture
- Status-aware (shows health/state)
- Bidirectional (backlinks)
- Cross-module (Plan ↔ Design ↔ Wiki)

**3. Never Export Workflow**
- Share links, not files
- Collaborate in-app
- Real-time like Google Docs
- No version confusion

**4. Requirements Evolution**
- Structured + narrative
- Traceability built-in
- Links to business case
- Links to solution
- Full story, not just data

**5. Confluence Killer**
- Architecture-native
- Not generic wiki
- Specialized blocks
- EA vocabulary built-in
- No plugin hell

### Messaging Framework

**Problem:** "Documentation lives everywhere except where the architecture is"

**Agitate:** 
- Export to Word for the 47th time
- "Which version is latest?"
- Model changed, docs didn't
- Requirements in Excel, models in EA tool, never the twain shall meet

**Solution:** "Arkhitekton unifies architecture and knowledge"

**How It Works:**
1. Model your architecture in Canvas/Design
2. Document it right there in Wiki
3. Link them with `@mentions`
4. Everything stays in sync
5. Share a link, not a file

**Proof:**
- Demo: Change component status, watch wiki update
- Demo: Type `@` and see cross-module search
- Demo: Requirements traceability in one click
- Demo: "Never exported" workflow

---

## 6. Success Metrics

### User Adoption Metrics
- **Wiki pages created per user** (target: 10+/month)
- **@mentions used per page** (target: 5+/page)
- **Backlink navigation** (target: 20% click-through)
- **Cross-module references** (Wiki ↔ Plan ↔ Design)

### Business Impact Metrics  
- **Time to documentation** (current: hours in Word, target: minutes in wiki)
- **Documentation freshness** (% of docs updated in last 30 days)
- **Tool consolidation** (# of tools replaced: Confluence, Word exports, Excel requirements)
- **Search effectiveness** (find rate for architecture decisions)

### Competitive Metrics
- **Confluence replacement rate** (% of customers who cancel Confluence)
- **Feature parity** (can do everything Confluence does + architecture)
- **"Never export" adoption** (% using share links vs exports)

---

## 7. Technical Strategy

### The Stack (Phase 1-2)

**Editor:** TipTap (React)
- Headless ProseMirror
- Block-based editing
- Custom node views for mentions
- Real-time collaboration ready (Yjs)

**Data Model:**
```typescript
interface WikiPage {
  id: string;
  title: string;
  content: JSONContent; // TipTap JSON, not plain text
  mentions: EntityMention[]; // @references in page
  backlinks: WikiPage[]; // Pages that mention this
  status: 'Draft' | 'Review' | 'Approved';
  template?: 'ADR' | 'Design' | 'Meeting' | 'Requirement' | null;
  createdBy: User;
  updatedAt: Date;
}

interface EntityMention {
  type: 'Story' | 'Epic' | 'Component' | 'Diagram' | 'Requirement' | 'ADR' | 'Page';
  id: string;
  text: string; // Display text
  pageId: string; // Page containing the mention
  position: number; // Character position
}

interface Requirement extends WikiPage {
  template: 'Requirement';
  identifier: string; // REQ-BUS-001
  requirementType: 'Business' | 'Product' | 'Technical';
  priority: 'High' | 'Medium' | 'Low';
  status: 'Proposed' | 'Accepted' | 'Implemented';
  satisfiedBy: string[]; // Component IDs
  linkedStories: string[]; // Story IDs
}
```

**Search Index:**
- Client-side: Fuse.js (for `@` menu)
- Server-side: PostgreSQL full-text search
- Future: Elasticsearch for advanced semantic search

**Real-time Collaboration:**
- Yjs for CRDT-based sync
- WebSocket connections
- Operational transformation
- Presence awareness (who's editing)

### Integration Points

**Plan Module:**
```typescript
// When user types @ in wiki
WikiMentionSearch({
  sources: [
    'userStories',    // from Plan module
    'epics',          // from Plan module
    'components',     // from Design module
    'diagrams',       // from Canvas module
    'requirements',   // from Wiki module
    'adrs',          // from Wiki module
    'pages'          // from Wiki module
  ]
})
```

**Design Module:**
```typescript
// Component detail view
Component {
  ...existingFields,
  wikiPage?: WikiPage, // Auto-created wiki page
  mentionedIn: WikiPage[] // Pages that @mention this component
}
```

**Backlink System:**
```typescript
// When saving a wiki page with @mentions
onWikiPageSave(page: WikiPage) => {
  const mentions = extractMentions(page.content);
  
  mentions.forEach(mention => {
    // Update the mentioned entity
    updateEntity(mention.type, mention.id, {
      backlinks: [...existing, page.id]
    });
  });
}
```

---

## 8. Migration Path for Existing Hardcoded Wiki

**Current State:** `wiki.tsx` is a static mock implementation

**Step 1: Backend (Week 1)**
```bash
# Database schema
CREATE TABLE wiki_pages (
  id UUID PRIMARY KEY,
  title VARCHAR(255),
  content JSONB, -- TipTap JSON
  status VARCHAR(20),
  template VARCHAR(50),
  project_id UUID,
  created_by UUID,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE TABLE entity_mentions (
  id UUID PRIMARY KEY,
  page_id UUID REFERENCES wiki_pages(id),
  entity_type VARCHAR(50),
  entity_id UUID,
  text VARCHAR(255),
  position INTEGER
);

CREATE INDEX idx_mentions_entity ON entity_mentions(entity_type, entity_id);
CREATE INDEX idx_page_search ON wiki_pages USING gin(to_tsvector('english', title || ' ' || content));
```

**Step 2: Frontend (Week 2)**
```typescript
// Create Editor component
/src/components/wiki/Editor.tsx

// Implement TipTap
// Add mention extension
// Add slash commands
```

**Step 3: API Routes (Week 2)**
```typescript
GET  /api/wiki - List pages
GET  /api/wiki/:id - Get page
POST /api/wiki - Create page  
PUT  /api/wiki/:id - Update page
DEL  /api/wiki/:id - Delete page

GET  /api/wiki/search?q=query - Search pages
GET  /api/wiki/:id/backlinks - Get backlinks
POST /api/wiki/mentions - Search for @mention
```

**Step 4: Integration (Week 3-4)**
```typescript
// Connect to Plan module
// Connect to Design module
// Implement @mention search
// Build hover cards
// Add backlinks
```

---

## 9. The Pitch: Why This Matters

### To Architects

> "Stop fighting with Word. Stop hunting through Confluence. Stop exporting your model for the 47th time. 
> 
> **Document your architecture right where you build it.** 
> 
> Write `@PaymentService` and it links to the actual component. Update the model and the docs update too. Share a link, not a file. Collaborate in real-time. 
> 
> **This is the tool you've been waiting for.**"

### To Engineering Leaders

> "Your architects spend 30% of their time on documentation that goes out of date the moment it's created.
> 
> **We eliminate that waste.**
> 
> Models and docs in one place. Semantic linking keeps them in sync. Requirements trace to solutions automatically. No more version confusion.
> 
> **ROI: 15+ hours/week per architect, zero tool switching, one source of truth.**"

### To Executives

> "Every EA tool makes the same mistake: treating documentation as an export.
> 
> **We made it part of the architecture.**
> 
> Your teams model in one tool, write in another, present in a third. Knowledge is scattered. Decisions are lost. Onboarding takes months.
> 
> **Arkhitekton unifies it all.**
> 
> Architecture and knowledge, together. Always current, never exported, fully traceable.
> 
> **This is the competitive advantage you need.**"

---

## 10. The Bottom Line

**Every EA tool has the same fundamental flaw:**
They force you to choose between modeling and documenting.

**We're the first to solve it.**

- Not just a wiki
- Not just an EA tool
- **The first platform where architecture and knowledge are unified**

**This is not a feature. This is a paradigm shift.**

And once architects experience it, they'll never go back to the export workflow.

**That's our moat. That's our advantage. That's why we win.**
