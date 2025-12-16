# ARKDL-0011: Vision & Strategy — Arkhitekton Knowledge Core (The "Wiki" Reimagined)

> **Status:** Draft  
> **Type:** Product Vision & Strategy  
> **Target Module:** Wiki (`/wiki`)  
> **Driver:** ARKDL-0010 Phase 2/3 Expansion  

---

## 1. Executive Summary: The "Confluence Killer" for Architects

The current Wiki module is a functional but static repository of documentation. The vision for **Arkhitekton Knowledge Core** is to transform this into a dynamic, "living" knowledge graph that bridges the gap between **unstructured documentation** (text, requirements) and **structured architecture** (models, diagrams, code).

We are not just building another text editor. We are building an **Architectural Knowledge Management System (AKMS)** where every sentence can be inextricably linked to the system it describes.

### The Problem
In tools like Confluence, documentation "rots" instantly. An architect writes "The Payment Service connects to Stripe," but when the engineering team changes the integration to PayPal, the wiki remains outdated. There is no semantic link between the *text* and the *actual architecture*.

### The Vision
In Arkhitekton, when you type `The @PaymentService connects to @Stripe`, those are not just words—they are live references to the model. If the `PaymentService` is deprecated in the Canvas module, the Wiki page automatically reflects that status (e.g., strikethrough or warning badge).

---

## 2. Strategic Pillars

### I. Unstructured $\leftrightarrow$ Structured Bridge
- **Concept:** Text should "know" about architecture.
- **Execution:** A "Smart Mention" system (`@`) that queries the entire platform (Stories, Epics, Diagrams, Elements, Code Repos) and embeds them as live data nodes within the document.

### II. The "Requirements-First" Methodology
- **Concept:** Architecture is driven by requirements.
- **Execution:** A dedicated "Requirements" engine that treats Business, Product, and Technical requirements as first-class citizens. Requirements are not just bullet points; they are entities that can be "satisfied by" an architectural component.

### III. Architect-Centric Authoring
- **Concept:** Architects need more than generic rich text. They need decision matrices, mermaid.js support, API specs, and ADR (Architecture Decision Record) templates built-in.
- **Execution:** A Block-Based Editor (similar to Notion/Confluence) specialized for technical content.

---

## 3. Product Roadmap

### Phase 1: The Foundation (Next Sprint)
*Goal: Replace the static page with a robust, block-based editor.*
- **Feature:** Implement **TipTap** (Headless Prosemirror) as the editor core.
- **Feature:** Support Markdown shortcuts (`#` for H1, `-` for lists).
- **Feature:** "Slash Commands" (`/`) menu to insert blocks (Tables, Images, Code Blocks).
- **Feature:** Basic CRUD for Pages and hierarchical Tree View navigation.

### Phase 2: The Semantic Graph (The "Smart Link")
*Goal: Connect the Wiki to the rest of the platform.*
- **Feature:** **Dynamic Mentions (`@`)**.
    - `@User Story` (Links to Plan Module)
    - `@Component` (Links to Design/Canvas Module)
    - `@Diagram` (Embeds a live thumbnail of a diagram)
- **Feature:** Hover Cards. Hovering over a mention shows its real-time status (e.g., "Status: In Progress", "Health: Critical").

### Phase 3: Requirements Engineering
*Goal: Formalize the requirements gathering process.*
- **Feature:** **Requirements Tab**. A dedicated view to manage requirements as data rows (ID, Description, Priority, Status).
- **Feature:** **Traceability Matrix**. Visually show which Architectural Components satisfy which Business Requirements.
- **Feature:** "Convert to Ticket". Highlight text in a meeting note and click "Create Story" to push it to the Plan module.

---

## 4. High-Level Requirements (Epics & Features)

### Epic 1: The Intelligent Editor (WIKI-E1)
**User Story:** "As an architect, I want a rich writing experience so I can document complex technical concepts without fighting formatting."

| Feature ID | Feature Name | Description | Priority |
| :--- | :--- | :--- | :--- |
| **FEAT-WIKI-001** | **Block-Based Editing** | Replace simple textarea with a block editor (TipTap). Support Drag & Drop blocks. | Critical |
| **FEAT-WIKI-002** | **Slash Commands** | Type `/` to open a menu for inserting Headers, Tables, Code Blocks, Callouts. | High |
| **FEAT-WIKI-003** | **Live Collaboration** | (Future) Real-time multi-user editing (Google Docs style) using WebSockets/Yjs. | Medium |
| **FEAT-WIKI-004** | **Rich Media Embeds** | Drag and drop images, paste screenshots directly from clipboard. | High |

### Epic 2: Dynamic Context & Mentions (WIKI-E2)
**User Story:** "As an architect, I want to link my documentation to specific diagram elements so that my docs verify the architecture."

| Feature ID | Feature Name | Description | Priority |
| :--- | :--- | :--- | :--- |
| **FEAT-WIKI-005** | **The `@` Omni-Search** | Typing `@` triggers a search across: Users, Stories, Epics, Diagrams, Catalog Elements. | Critical |
| **FEAT-WIKI-006** | **Live Data Nodes** | Selected mentions render as "Chips" (e.g., `[US-101: Payment Gateway]`) that change color based on the item's status. | Critical |
| **FEAT-WIKI-007** | **Backlinks** | If Page A mentions Component B, Component B's detail view should show "Referenced in Page A". | High |

### Epic 3: Requirements Management (WIKI-E3)
**User Story:** "As a Product Owner, I want to define requirements in a structured way so Architects can map them to solutions."

| Feature ID | Feature Name | Description | Priority |
| :--- | :--- | :--- | :--- |
| **FEAT-WIKI-008** | **Requirements Table** | A specialized table block where rows have metadata (ID, Priority, MoSCoW). | High |
| **FEAT-WIKI-009** | **Requirement Linking** | Ability to "Link" a Requirement row to a User Story (Plan) or Component (Design). | High |
| **FEAT-WIKI-010** | **Approval Workflow** | Status workflow for pages/requirements (Draft -> Review -> Approved). | Medium |

---

## 5. Technical Recommendation

### The Stack
1.  **Editor Engine:** **TipTap** (React). It is headless, fully customizable, and supports "Node Views" (rendering React components inside the text editor)—essential for the `@` mentions.
2.  **Data Structure:**
    - `WikiPage` (standard content).
    - `WikiRequirement` (structured data linked to a page).
    - `EntityReference` (junction table linking Wiki Page ID $\leftrightarrow$ External Entity ID).
3.  **Search Index:** Use a lightweight client-side fuzzy search (Fuse.js) for the `@` menu initially, scaling to server-side search later.

### Data Model Changes (Draft)

```typescript
// Proposed Schema Additions

interface WikiPage {
  id: string;
  content: JSON; // Tiptap JSON format, not plain string
  // ... existing fields
}

interface Requirement {
  id: string;
  pageId: string;
  identifier: string; // e.g., "REQ-BUS-001"
  type: 'Business' | 'Product' | 'Technical';
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Proposed' | 'Accepted' | 'Implemented';
  linkedStoryIds: string[]; // Link to Plan module
}
```

---

## 6. Migration Plan for Existing Page
The current `wiki.tsx` is a hardcoded "Mock" implementation.
1.  **Step 1:** Create `client/src/components/wiki/Editor.tsx` using TipTap.
2.  **Step 2:** Create the Database Schema for Wiki Pages (replacing the hardcoded array).
3.  **Step 3:** Implement the API routes (`GET /api/wiki`, `POST /api/wiki`).
4.  **Step 4:** Build the `@` mention extension connecting to the existing `useQuery` hooks for Stories and Architecture Elements.

