# ARKDL-0013: Wiki Knowledge Core — Detailed Requirements

**Status:** Ready for Sprint Planning  
**Type:** Product Requirements Document  
**Target Module:** Wiki (`/wiki`)  
**Parent Document:** ARKDL-0011 (Vision & Strategy)  
**Format:** High-Level Requirements + Gherkin Specifications  
**Sprint Sizing:** 10-business-day sprints, 3-10 story points

---

## Table of Contents

1. [Overview](#1-overview)
2. [Phase 1: Foundation](#2-phase-1-foundation-weeks-1-4)
   - EPIC-WIKI-01: Wiki Page Management
   - EPIC-WIKI-02: Block-Based Editor
   - EPIC-WIKI-03: Tree View & Navigation
3. [Phase 2: Semantic Graph](#3-phase-2-semantic-graph-months-2-3)
   - EPIC-WIKI-04: Semantic Mentions System
   - EPIC-WIKI-05: Backlinks & References
4. [Phase 3: Requirements Engineering](#4-phase-3-requirements-engineering-months-4-6)
   - EPIC-WIKI-06: Requirements Management
   - EPIC-WIKI-07: Traceability Matrix
5. [Phase 4: Advanced Features](#5-phase-4-advanced-features-months-7-12)
   - EPIC-WIKI-08: Page Templates
   - EPIC-WIKI-09: Collaboration Features
   - EPIC-WIKI-10: Version History
6. [Requirements Traceability Matrix](#6-requirements-traceability-matrix)
7. [Test Coverage Analysis](#7-test-coverage-analysis)

---

## 1. Overview

This document provides detailed, sprint-ready requirements for the Arkhitekton Wiki Knowledge Core module. Each EPIC contains:
- **High-Level Requirements (HLRs)** with priority levels
- **Gherkin Specifications** with Given-When-Then scenarios
- **Story Point Estimates** for sprint planning
- **Acceptance Criteria** for each scenario

### Priority Levels
- **Must**: Core functionality, blocks other features
- **Should**: Important but can be deferred one sprint
- **Could**: Nice-to-have, can be deferred indefinitely

### Story Point Scale
- **1-2 points**: Simple CRUD, UI updates (0.5-1 day)
- **3-5 points**: Medium complexity, some integration (2-3 days)
- **5-8 points**: Complex logic, multiple integrations (4-5 days)
- **8-10 points**: Very complex, may need breakdown (full sprint)

---

## 2. Phase 1: Foundation (Weeks 1-4)

**Goal:** Replace the static wiki page with a robust, block-based editor and CRUD operations.

---

### EPIC-WIKI-01: Wiki Page Management

**Objective:** Provide full CRUD operations for wiki pages with proper persistence and user management.

**User Value:** Architects can create, read, update, and delete wiki pages to document their architecture.

#### 2.1.1 High-Level Requirements

| HLR ID | Requirement | Priority | Story Points |
|--------|-------------|----------|--------------|
| HLR-WIKI-001 | Users shall be able to create new wiki pages with a title and content. | Must | 5 |
| HLR-WIKI-002 | Users shall be able to view a list of all their wiki pages. | Must | 3 |
| HLR-WIKI-003 | Users shall be able to edit existing wiki pages. | Must | 5 |
| HLR-WIKI-004 | Users shall be able to delete wiki pages with confirmation. | Must | 3 |
| HLR-WIKI-005 | Wiki pages shall support hierarchical organization (parent/child pages). | Should | 8 |
| HLR-WIKI-006 | Users shall be able to duplicate/clone existing pages. | Could | 3 |
| HLR-WIKI-007 | Wiki pages shall auto-save drafts every 30 seconds. | Must | 5 |
| HLR-WIKI-008 | Users shall be able to restore from auto-saved drafts. | Should | 3 |
| HLR-WIKI-009 | Wiki pages shall track created_by, created_at, updated_by, updated_at metadata. | Must | 2 |
| HLR-WIKI-010 | Users shall be able to search wiki pages by title and content. | Must | 5 |

#### 2.1.2 Gherkin Specifications

```gherkin
Feature: Wiki Page Creation
  As an architect
  I want to create new wiki pages
  So that I can document my architecture decisions and designs

  Background:
    Given I am a registered Arkhitekton user
    And I have successfully authenticated
    And I am on the Wiki module

  Scenario: Create new wiki page with title [HLR-WIKI-001]
    Given I am on the wiki home page
    When I click the "New Page" button
    Then I should see the page creation dialog
    And the title field should be focused
    When I enter title "Payment Service Architecture"
    And I click "Create"
    Then a new page should be created with ID
    And I should be redirected to the editor for that page
    And the page title should display "Payment Service Architecture"
    And the editor should be empty and ready for content

  Scenario: Create page with empty title fails validation [HLR-WIKI-001]
    Given I am on the page creation dialog
    When I leave the title field empty
    And I click "Create"
    Then I should see an error message "Title is required"
    And the page should not be created
    And I should remain on the creation dialog

  Scenario: View list of all wiki pages [HLR-WIKI-002]
    Given I have created 5 wiki pages
    When I navigate to the wiki home page
    Then I should see a list of all 5 pages
    And each page should display its title
    And each page should display last modified date
    And each page should display the author
    And pages should be sorted by last modified (newest first)

  Scenario: Edit existing wiki page title [HLR-WIKI-003]
    Given I have a page titled "Payment Service"
    When I open the page in edit mode
    And I click on the title to edit it
    And I change the title to "Payment Service Architecture"
    And I press Enter
    Then the title should be updated to "Payment Service Architecture"
    And the change should be persisted to the database
    And I should see a success indicator

  Scenario: Edit wiki page content [HLR-WIKI-003]
    Given I have a page with existing content
    When I click into the editor
    And I add new text "This service handles payment processing"
    And I press Cmd+S (Mac) or Ctrl+S (Windows)
    Then the content should be saved
    And I should see a "Saved" indicator
    And the updated_at timestamp should be updated

  Scenario: Delete wiki page with confirmation [HLR-WIKI-004]
    Given I have a page titled "Old Architecture"
    When I click the delete button (trash icon)
    Then I should see a confirmation dialog
    And the dialog should say "Are you sure you want to delete 'Old Architecture'?"
    And the dialog should have "Cancel" and "Delete" buttons
    When I click "Delete"
    Then the page should be permanently deleted
    And I should be redirected to the wiki home
    And the page should no longer appear in the list

  Scenario: Cancel delete operation [HLR-WIKI-004]
    Given I have a page and am viewing the delete confirmation
    When I click "Cancel"
    Then the page should not be deleted
    And I should return to viewing the page
    And no changes should be made

  Scenario: Create child page under parent [HLR-WIKI-005]
    Given I have a page titled "Payment Architecture"
    When I right-click on the page in the tree view
    And I select "Add Child Page"
    Then I should see the page creation dialog
    When I enter title "Stripe Integration"
    And I click "Create"
    Then a child page should be created under "Payment Architecture"
    And the tree view should show "Stripe Integration" nested under parent
    And the child page should reference parent_id in database

  Scenario: Duplicate existing page [HLR-WIKI-006]
    Given I have a page titled "ADR Template" with content
    When I right-click on the page
    And I select "Duplicate"
    Then a new page should be created
    And the new page should be titled "ADR Template (Copy)"
    And the new page should have identical content to the original
    And the new page should have a new unique ID
    And I should be redirected to the new page

  Scenario: Auto-save draft every 30 seconds [HLR-WIKI-007]
    Given I am editing a wiki page
    And I type "This is important architecture"
    When 30 seconds elapse without manual save
    Then the content should be auto-saved as a draft
    And I should see a subtle "Draft saved" indicator
    And the draft should be stored in local storage
    And the page updated_at should NOT change (it's a draft)

  Scenario: Restore from auto-saved draft [HLR-WIKI-008]
    Given I was editing a page and it auto-saved a draft
    And I closed the browser without publishing
    When I return to the wiki and open that page
    Then I should see a banner "You have an unsaved draft from [timestamp]"
    And I should see "Restore Draft" and "Discard" buttons
    When I click "Restore Draft"
    Then the editor should load the draft content
    And I can continue editing from where I left off

  Scenario: Page metadata tracking [HLR-WIKI-009]
    Given I create a new wiki page as user "john@company.com"
    Then the page should have created_by = "john@company.com"
    And the page should have created_at = current timestamp
    When another user "jane@company.com" edits the page
    Then the page should have updated_by = "jane@company.com"
    And the page should have updated_at = new timestamp
    And created_by and created_at should remain unchanged

  Scenario: Search wiki pages by title [HLR-WIKI-010]
    Given I have pages titled "Payment Service", "Order Service", "Payment Gateway"
    When I enter "Payment" in the wiki search box
    Then I should see "Payment Service" and "Payment Gateway" in results
    And "Order Service" should not appear
    And results should highlight the matching term
    And results should be sorted by relevance

  Scenario: Search wiki pages by content [HLR-WIKI-010]
    Given I have a page titled "Architecture" containing "microservices pattern"
    When I search for "microservices"
    Then the "Architecture" page should appear in results
    And the search should show a snippet with "microservices" highlighted
    And clicking the result should open the page at the matching location
```

---

### EPIC-WIKI-02: Block-Based Editor

**Objective:** Implement TipTap block-based editor with markdown shortcuts and slash commands.

**User Value:** Architects get a modern, rich editing experience similar to Notion/Confluence.

#### 2.2.1 High-Level Requirements

| HLR ID | Requirement | Priority | Story Points |
|--------|-------------|----------|--------------|
| HLR-WIKI-020 | The editor shall be implemented using TipTap (Headless ProseMirror). | Must | 8 |
| HLR-WIKI-021 | The editor shall support markdown shortcuts (# for H1, ## for H2, - for bullet, 1. for numbered). | Must | 5 |
| HLR-WIKI-022 | The editor shall support slash commands (/) to insert blocks. | Must | 8 |
| HLR-WIKI-023 | Users shall be able to insert headings (H1, H2, H3). | Must | 3 |
| HLR-WIKI-024 | Users shall be able to create bullet lists and numbered lists. | Must | 3 |
| HLR-WIKI-025 | Users shall be able to insert code blocks with syntax highlighting. | Must | 5 |
| HLR-WIKI-026 | Users shall be able to insert tables. | Should | 5 |
| HLR-WIKI-027 | Users shall be able to insert images via upload or URL. | Should | 5 |
| HLR-WIKI-028 | Users shall be able to apply text formatting (bold, italic, underline, strikethrough). | Must | 3 |
| HLR-WIKI-029 | Users shall be able to insert block quotes. | Should | 2 |
| HLR-WIKI-030 | Users shall be able to insert dividers/horizontal rules. | Could | 2 |
| HLR-WIKI-031 | The editor shall support drag-and-drop to reorder blocks. | Should | 5 |
| HLR-WIKI-032 | The editor shall support keyboard shortcuts (Cmd/Ctrl+B for bold, etc.). | Must | 3 |
| HLR-WIKI-033 | Code blocks shall support language selection and syntax highlighting. | Must | 5 |

#### 2.2.2 Gherkin Specifications

```gherkin
Feature: TipTap Editor Implementation
  As an architect
  I want a modern block-based editor
  So that I can create rich documentation easily

  Background:
    Given I am editing a wiki page
    And the TipTap editor is loaded and ready

  Scenario: Insert H1 heading using markdown [HLR-WIKI-021]
    Given the cursor is in an empty paragraph
    When I type "# " (hash followed by space)
    Then the paragraph should transform to H1 heading
    And the "# " should be removed
    And subsequent typing should be in H1 style

  Scenario: Insert H2 heading using markdown [HLR-WIKI-021]
    Given the cursor is in an empty paragraph
    When I type "## Architecture Overview"
    Then the text should be formatted as H2 heading
    And the "## " should be consumed

  Scenario: Create bullet list using markdown [HLR-WIKI-021, HLR-WIKI-024]
    Given the cursor is in an empty paragraph
    When I type "- First item" and press Enter
    Then a bullet list should be created
    And "First item" should be the first bullet
    And a new empty bullet should appear below
    When I type "Second item"
    Then it should be added as second bullet

  Scenario: Create numbered list using markdown [HLR-WIKI-021, HLR-WIKI-024]
    Given the cursor is in an empty paragraph
    When I type "1. First step" and press Enter
    Then a numbered list should be created
    When I type "Second step" and press Enter
    Then it should auto-number as "2."

  Scenario: Open slash command menu [HLR-WIKI-022]
    Given the cursor is in an empty paragraph
    When I type "/"
    Then a command menu should appear
    And I should see options: Heading 1, Heading 2, Heading 3, Bullet List, Numbered List, Code Block, Table, Image, Quote, Divider
    And the menu should be positioned near the cursor

  Scenario: Insert heading via slash command [HLR-WIKI-022, HLR-WIKI-023]
    Given I have opened the slash command menu
    When I type "h1" or click "Heading 1"
    Then the current block should become an H1 heading
    And the cursor should be positioned to start typing
    And the menu should close

  Scenario: Insert code block via slash command [HLR-WIKI-022, HLR-WIKI-025]
    Given I have opened the slash command menu
    When I select "Code Block"
    Then a code block should be inserted
    And I should see a language selector dropdown
    And the default should be "plaintext"
    And the code block should have monospace font

  Scenario: Set code block language [HLR-WIKI-033]
    Given I have a code block in the editor
    When I click the language selector
    Then I should see options: JavaScript, TypeScript, Python, Java, SQL, JSON, YAML, Bash, etc.
    When I select "JavaScript"
    Then the syntax highlighting should update
    And keywords like "const", "function", "return" should be colored

  Scenario: Apply bold formatting [HLR-WIKI-028, HLR-WIKI-032]
    Given I have selected text "important"
    When I press Cmd+B (Mac) or Ctrl+B (Windows)
    Then the text should become bold
    And the bold button in toolbar should be active

  Scenario: Apply italic formatting [HLR-WIKI-028, HLR-WIKI-032]
    Given I have selected text "emphasis"
    When I press Cmd+I (Mac) or Ctrl+I (Windows)
    Then the text should become italic

  Scenario: Apply strikethrough [HLR-WIKI-028]
    Given I have selected text "deprecated"
    When I click the strikethrough button or press keyboard shortcut
    Then the text should have a line through it

  Scenario: Insert table via slash command [HLR-WIKI-026]
    Given I open the slash command menu
    When I select "Table"
    Then I should see a size picker (3x3, 4x4, custom)
    When I select "3x3"
    Then a 3x3 table should be inserted
    And the cursor should be in the first cell
    And I should be able to add/remove rows and columns

  Scenario: Insert image via upload [HLR-WIKI-027]
    Given I open the slash command menu
    When I select "Image"
    Then I should see "Upload" and "URL" options
    When I select "Upload"
    Then a file picker should open
    When I select an image file
    Then the image should upload
    And the image should be embedded in the page
    And I should be able to resize it

  Scenario: Insert block quote [HLR-WIKI-029]
    Given the cursor is in a paragraph
    When I type "> " (greater-than followed by space)
    Then the paragraph should become a block quote
    And it should have a left border indicator
    And text should be indented

  Scenario: Insert divider [HLR-WIKI-030]
    Given I open the slash command menu
    When I select "Divider" or type "---" on empty line
    Then a horizontal rule should be inserted
    And it should visually separate content above and below

  Scenario: Drag-and-drop blocks [HLR-WIKI-031]
    Given I have multiple blocks: H1, paragraph, code block
    When I hover over the left side of a block
    Then I should see a drag handle (⋮⋮ icon)
    When I click and drag the handle
    Then I should see a blue insertion indicator
    When I drop at a new location
    Then the block should be moved
    And the page should auto-save

  Scenario: Keyboard shortcut cheat sheet
    Given I am in the editor
    When I press Cmd+/ (Mac) or Ctrl+/ (Windows)
    Then a keyboard shortcuts reference should appear
    And it should list all shortcuts:
      | Shortcut | Action |
      | Cmd/Ctrl+B | Bold |
      | Cmd/Ctrl+I | Italic |
      | Cmd/Ctrl+U | Underline |
      | Cmd/Ctrl+K | Insert link |
      | Cmd/Ctrl+S | Save |
      | / | Slash commands |
```

---

### EPIC-WIKI-03: Tree View & Navigation

**Objective:** Provide hierarchical navigation for wiki pages with tree view sidebar.

**User Value:** Architects can organize and navigate their documentation in a logical hierarchy.

#### 2.3.1 High-Level Requirements

| HLR ID | Requirement | Priority | Story Points |
|--------|-------------|----------|--------------|
| HLR-WIKI-040 | The wiki shall display a tree view sidebar showing page hierarchy. | Must | 8 |
| HLR-WIKI-041 | Users shall be able to expand/collapse folders in the tree. | Must | 3 |
| HLR-WIKI-042 | Users shall be able to drag-and-drop pages to reorganize hierarchy. | Should | 5 |
| HLR-WIKI-043 | The tree shall support keyboard navigation (arrow keys, Enter to open). | Should | 5 |
| HLR-WIKI-044 | Users shall be able to create folders to organize pages. | Should | 5 |
| HLR-WIKI-045 | The active page shall be highlighted in the tree. | Must | 2 |
| HLR-WIKI-046 | Users shall be able to right-click for context menu (New, Delete, Rename, etc.). | Must | 5 |
| HLR-WIKI-047 | The tree view shall be collapsible to maximize editor space. | Should | 3 |

#### 2.3.2 Gherkin Specifications

```gherkin
Feature: Tree View Navigation
  As an architect
  I want a hierarchical tree view of my wiki pages
  So that I can organize and navigate my documentation

  Background:
    Given I am on the Wiki module
    And I have the following page structure:
      | Payment Architecture
        | - Stripe Integration
        | - PayPal Integration
      | Order Processing
        | - Order Service
        | - Inventory Service

  Scenario: Display tree view sidebar [HLR-WIKI-040]
    When I view the wiki
    Then I should see a left sidebar with tree view
    And the tree should show "Payment Architecture" as parent
    And "Stripe Integration" should be nested under parent
    And folders/pages should be properly indented

  Scenario: Expand/collapse folder [HLR-WIKI-041]
    Given "Payment Architecture" has child pages
    And the folder is currently collapsed
    When I click the expand icon (▶)
    Then the folder should expand
    And child pages should be visible
    And the icon should change to collapse (▼)
    When I click the collapse icon
    Then child pages should hide
    And the icon should change back to expand

  Scenario: Highlight active page [HLR-WIKI-045]
    Given I am viewing "Stripe Integration" page
    Then "Stripe Integration" should be highlighted in the tree
    And it should have a distinct background color
    And it should be scrolled into view if off-screen

  Scenario: Navigate using tree [HLR-WIKI-041]
    Given I am viewing "Payment Architecture"
    When I click "Order Processing" in the tree
    Then I should navigate to the "Order Processing" page
    And the editor should load that page's content
    And "Order Processing" should become highlighted

  Scenario: Drag-and-drop to reorganize [HLR-WIKI-042]
    Given "PayPal Integration" is under "Payment Architecture"
    When I drag "PayPal Integration"
    And I drop it under "Order Processing"
    Then "PayPal Integration" should move to new parent
    And the database should update parent_id
    And the tree should reflect the new structure

  Scenario: Keyboard navigation in tree [HLR-WIKI-043]
    Given the tree view has focus
    When I press Down arrow
    Then the next item should be selected
    When I press Up arrow
    Then the previous item should be selected
    When I press Right arrow on a collapsed folder
    Then the folder should expand
    When I press Left arrow on an expanded folder
    Then the folder should collapse
    When I press Enter on a selected page
    Then that page should open in the editor

  Scenario: Create folder [HLR-WIKI-044]
    Given I right-click in the tree view empty space
    When I select "New Folder"
    Then I should see a folder creation dialog
    When I enter name "Security Documentation"
    And I click "Create"
    Then a new folder should appear in the tree
    And I should be able to drag pages into it

  Scenario: Context menu on page [HLR-WIKI-046]
    Given I right-click on "Stripe Integration"
    Then I should see a context menu with options:
      | Option | Action |
      | Open | Opens the page |
      | Rename | Renames the page |
      | Duplicate | Clones the page |
      | Add Child Page | Creates child under this |
      | Delete | Deletes the page |
      | Move to... | Shows folder picker |

  Scenario: Rename page from tree [HLR-WIKI-046]
    Given I right-click on "Stripe Integration"
    When I select "Rename"
    Then the page name should become editable in the tree
    When I type "Stripe Payment Integration"
    And I press Enter
    Then the page should be renamed
    And the change should persist

  Scenario: Collapse sidebar [HLR-WIKI-047]
    Given the tree view sidebar is visible
    When I click the collapse button (◀)
    Then the sidebar should slide closed
    And the editor should expand to fill the space
    When I click the expand button (▶)
    Then the sidebar should reappear
```

---

## 3. Phase 2: Semantic Graph (Months 2-3)

**Goal:** Connect wiki to the platform with semantic mentions and backlinks.

---

### EPIC-WIKI-04: Semantic Mentions System

**Objective:** Implement @ mentions that create live links to platform entities.

**User Value:** Architects can link documentation to actual components, creating a living knowledge graph.

#### 3.1.1 High-Level Requirements

| HLR ID | Requirement | Priority | Story Points |
|--------|-------------|----------|--------------|
| HLR-WIKI-050 | Users shall be able to type @ to trigger a mention picker. | Must | 8 |
| HLR-WIKI-051 | The mention picker shall search User Stories from Plan module. | Must | 5 |
| HLR-WIKI-052 | The mention picker shall search Epics from Plan module. | Must | 3 |
| HLR-WIKI-053 | The mention picker shall search Components from Design module. | Must | 5 |
| HLR-WIKI-054 | The mention picker shall search Diagrams from Canvas module. | Must | 5 |
| HLR-WIKI-055 | The mention picker shall search other Wiki pages. | Must | 3 |
| HLR-WIKI-056 | The mention picker shall search Requirements from Wiki. | Should | 3 |
| HLR-WIKI-057 | The mention picker shall search ADRs from Wiki. | Should | 3 |
| HLR-WIKI-058 | The mention picker shall search Users/Teams. | Should | 5 |
| HLR-WIKI-059 | Mentions shall render as colored chips/badges. | Must | 5 |
| HLR-WIKI-060 | Mention colors shall indicate entity status (green=active, orange=deprecated, red=sunset). | Must | 5 |
| HLR-WIKI-061 | Hovering over a mention shall show a preview card. | Must | 8 |
| HLR-WIKI-062 | Clicking a mention shall navigate to that entity. | Must | 3 |
| HLR-WIKI-063 | When a mentioned entity changes status, the wiki should reflect the update. | Must | 8 |
| HLR-WIKI-064 | Mentions shall be stored as structured data, not plain text. | Must | 5 |

#### 3.1.2 Gherkin Specifications

```gherkin
Feature: Semantic Mentions System
  As an architect
  I want to mention platform entities in my documentation
  So that my docs stay linked to the actual architecture

  Background:
    Given I am editing a wiki page
    And the following entities exist:
      | Type | Name | Status |
      | Component | PaymentService | Active |
      | Component | LegacyOrderSystem | Deprecated |
      | User Story | US-001 | In Progress |
      | Epic | EPIC-PAY-001 | Active |
      | Diagram | Payment Flow | Current |

  Scenario: Trigger mention picker [HLR-WIKI-050]
    Given the cursor is in the editor
    When I type "@"
    Then a mention picker menu should appear
    And it should be positioned near the cursor
    And it should show a search input field
    And it should show "Search entities..."

  Scenario: Search for component [HLR-WIKI-053]
    Given the mention picker is open
    When I type "@Payment"
    Then I should see "PaymentService" in the results
    And it should show the entity type icon (Component)
    And it should show the status badge
    When I press Enter or click on "PaymentService"
    Then "@PaymentService" should be inserted as a mention chip
    And the mention picker should close

  Scenario: Search for user story [HLR-WIKI-051]
    Given the mention picker is open
    When I type "@US-001"
    Then I should see "US-001" in the results
    And it should show the story title
    And it should show the status (In Progress)
    When I select it
    Then "@US-001" mention chip should be inserted

  Scenario: Search for epic [HLR-WIKI-052]
    Given the mention picker is open
    When I type "@EPIC"
    Then I should see "EPIC-PAY-001" in results
    When I select it
    Then "@EPIC-PAY-001" mention chip should be inserted

  Scenario: Search for diagram [HLR-WIKI-054]
    Given the mention picker is open
    When I type "@Payment Flow"
    Then I should see the "Payment Flow" diagram
    And it should show a tiny thumbnail preview
    When I select it
    Then "@Payment Flow" should be inserted
    And it should link to the diagram

  Scenario: Search for wiki pages [HLR-WIKI-055]
    Given I have a wiki page titled "Architecture Principles"
    When I type "@Architecture"
    Then "Architecture Principles" should appear in results
    And it should be marked as type "Page"
    When I select it
    Then a link to that page should be created

  Scenario: Render mention as colored chip [HLR-WIKI-059, HLR-WIKI-060]
    Given I have inserted "@PaymentService" (Active)
    Then it should render as a chip/badge
    And it should have a green background (status: Active)
    And it should have rounded corners
    And it should be inline with the text
    When I insert "@LegacyOrderSystem" (Deprecated)
    Then it should have an orange background

  Scenario: Hover preview card [HLR-WIKI-061]
    Given I have "@PaymentService" mention in the text
    When I hover over the mention chip
    Then a preview card should appear after 500ms
    And the card should show:
      | Field | Value |
      | Name | PaymentService |
      | Type | Component |
      | Status | Active |
      | Description | [Brief description] |
      | Owner | [Team/Person] |
      | Last Modified | [Date] |
    And the card should have a "Go to →" button

  Scenario: Navigate by clicking mention [HLR-WIKI-062]
    Given I have "@PaymentService" mention in the text
    When I click on the mention chip
    Then I should navigate to the PaymentService component page
    And the page should open in the Design module
    And the component should be highlighted

  Scenario: Reflect entity status changes [HLR-WIKI-063]
    Given I have "@PaymentService" with status Active (green)
    When an admin changes PaymentService status to Deprecated
    And I refresh the wiki page
    Then "@PaymentService" chip should update to orange
    And the hover card should show status: Deprecated
    And I should see a visual indicator that it changed

  Scenario: Store mentions as structured data [HLR-WIKI-064]
    Given I insert "@PaymentService" in the wiki
    Then the database should store:
      | Field | Value |
      | type | Component |
      | id | [PaymentService ID] |
      | text | PaymentService |
      | page_id | [Current page ID] |
      | position | [Character offset] |
    And the mention should be queryable for backlinks

  Scenario: Cross-module search
    Given I type "@" in the wiki
    When I search for "payment"
    Then results should include:
      | Source | Type | Name |
      | Plan | User Story | US-PAY-001: Implement Payment |
      | Plan | Epic | EPIC-PAY-001: Payment Processing |
      | Design | Component | PaymentService |
      | Canvas | Diagram | Payment Flow Diagram |
      | Wiki | Page | Payment Architecture |
    And results should be grouped by source
    And each should show its module icon
```

---

### EPIC-WIKI-05: Backlinks & References

**Objective:** Show where each entity is mentioned across the wiki.

**User Value:** Architects can discover all documentation that references a specific component or decision.

#### 3.2.1 High-Level Requirements

| HLR ID | Requirement | Priority | Story Points |
|--------|-------------|----------|--------------|
| HLR-WIKI-070 | Each wiki page shall show a "Referenced in" section. | Must | 5 |
| HLR-WIKI-071 | When viewing a Component, users shall see all wiki pages that mention it. | Must | 5 |
| HLR-WIKI-072 | When viewing a User Story, users shall see all wiki pages that mention it. | Must | 3 |
| HLR-WIKI-073 | Backlinks shall be clickable to navigate to the mentioning page. | Must | 2 |
| HLR-WIKI-074 | Backlinks shall show a snippet of surrounding text. | Should | 5 |
| HLR-WIKI-075 | Users shall be able to filter backlinks by page type (ADR, Design Doc, etc.). | Could | 3 |

#### 3.2.2 Gherkin Specifications

```gherkin
Feature: Backlinks & References
  As an architect
  I want to see where entities are mentioned
  So that I can understand the full context

  Background:
    Given I have the following:
      | Type | Name |
      | Component | PaymentService |
      | Wiki Page | Payment Architecture |
      | Wiki Page | Integration Guide |
      | Wiki Page | ADR-005: Choose Payment Gateway |

    And "Payment Architecture" mentions @PaymentService
    And "Integration Guide" mentions @PaymentService
    And "ADR-005" mentions @PaymentService

  Scenario: View backlinks on wiki page [HLR-WIKI-070]
    Given I am viewing "Payment Architecture"
    When I scroll to the bottom or sidebar
    Then I should see a "Referenced in" section
    And it should show count: "Referenced in 0 other pages"
    And since this page doesn't reference others, it's empty

  Scenario: View backlinks on component [HLR-WIKI-071]
    Given I am viewing PaymentService in Design module
    When I look at the sidebar or details panel
    Then I should see "Mentioned in Wiki" section
    And it should list:
      | Page | Snippet |
      | Payment Architecture | "The @PaymentService handles..." |
      | Integration Guide | "Connect to @PaymentService via..." |
      | ADR-005 | "We chose @PaymentService because..." |
    And the count should say "Mentioned in 3 pages"

  Scenario: Navigate via backlink [HLR-WIKI-073]
    Given I am viewing PaymentService backlinks
    When I click on "Payment Architecture" in the list
    Then I should navigate to that wiki page
    And the page should scroll to the mention location
    And the @PaymentService mention should be highlighted

  Scenario: View snippet with context [HLR-WIKI-074]
    Given "Payment Architecture" contains:
      "Our payment processing uses the @PaymentService component which connects to external gateways."
    When I view backlinks for PaymentService
    Then the snippet should show:
      "...payment processing uses the @PaymentService component which connects..."
    And the mention should be bolded in the snippet

  Scenario: Backlinks on user story [HLR-WIKI-072]
    Given User Story US-PAY-001 exists
    And wiki page "Sprint Planning" mentions @US-PAY-001
    When I view US-PAY-001 in Plan module
    Then I should see "Mentioned in Wiki: 1 page"
    When I click to expand
    Then I should see "Sprint Planning" listed
    And I can click to navigate to that page

  Scenario: Filter backlinks by page type [HLR-WIKI-075]
    Given PaymentService is mentioned in:
      | Page | Template |
      | Payment Arch | Design Doc |
      | ADR-005 | ADR |
      | Integration | Guide |
    When I view PaymentService backlinks
    Then I should see a filter dropdown
    When I select "ADR only"
    Then only "ADR-005" should be shown
    And other pages should be hidden
```

---

## 4. Phase 3: Requirements Engineering (Months 4-6)

**Goal:** Formalize requirements management with structured + narrative approach.

---

### EPIC-WIKI-06: Requirements Management

**Objective:** Treat requirements as first-class wiki pages with structured metadata.

**User Value:** Architects can write requirements that are both narrative and traceable.

#### 4.1.1 High-Level Requirements

| HLR ID | Requirement | Priority | Story Points |
|--------|-------------|----------|--------------|
| HLR-WIKI-080 | Users shall be able to create Requirement pages using a template. | Must | 8 |
| HLR-WIKI-081 | Requirements shall have an identifier (e.g., REQ-BUS-001). | Must | 5 |
| HLR-WIKI-082 | Requirements shall have a type: Business, Product, Technical. | Must | 3 |
| HLR-WIKI-083 | Requirements shall have priority: High, Medium, Low. | Must | 2 |
| HLR-WIKI-084 | Requirements shall have status: Proposed, Accepted, Implemented, Deprecated. | Must | 3 |
| HLR-WIKI-085 | Requirements shall support narrative description with rich text. | Must | 5 |
| HLR-WIKI-086 | Requirements shall link to "Satisfied By" components. | Must | 5 |
| HLR-WIKI-087 | Requirements shall link to related User Stories. | Must | 5 |
| HLR-WIKI-088 | Users shall be able to convert selected text to a Requirement. | Should | 8 |
| HLR-WIKI-089 | Requirements shall appear in a dedicated Requirements view/table. | Must | 8 |

#### 4.1.2 Gherkin Specifications

```gherkin
Feature: Requirements Management
  As an architect
  I want to document requirements as structured wiki pages
  So that I can trace them to implementation

  Scenario: Create requirement from template [HLR-WIKI-080]
    Given I am on the wiki
    When I click "New Page" → "From Template" → "Requirement"
    Then a new page should be created
    And it should use the Requirement template
    And it should have placeholders for:
      | Field | Example |
      | Identifier | REQ-BUS-001 |
      | Title | [Requirement name] |
      | Type | [Business/Product/Technical] |
      | Priority | [High/Medium/Low] |
      | Status | Proposed |
      | Description | [Rich text area] |
      | Rationale | [Why this requirement exists] |
      | Acceptance Criteria | [Bullet list] |
      | Satisfied By | [Components] |
      | Related Stories | [User Stories] |

  Scenario: Set requirement identifier [HLR-WIKI-081]
    Given I am creating a requirement
    When I enter identifier "REQ-BUS-001"
    Then the system should validate format (REQ-[TYPE]-[NUMBER])
    And the system should check for uniqueness
    And if duplicate, show error "Identifier already exists"

  Scenario: Set requirement type [HLR-WIKI-082]
    Given I am editing a requirement
    When I click the Type field
    Then I should see dropdown: Business, Product, Technical
    When I select "Business"
    Then the requirement type should be set to Business
    And the identifier prefix should suggest "REQ-BUS-"

  Scenario: Set priority and status [HLR-WIKI-083, HLR-WIKI-084]
    Given I am editing a requirement
    When I set Priority to "High"
    And I set Status to "Accepted"
    Then both should be saved as metadata
    And High priority should display with red indicator
    And Accepted status should display with green badge

  Scenario: Write narrative description [HLR-WIKI-085]
    Given I am editing a requirement
    When I type in the Description section:
      """
      ## Business Context
      Our customers abandon carts when checkout takes >3 seconds.
      
      ## Requirement
      The system SHALL process payments within 2 seconds at 99th percentile.
      """
    Then the rich text should be saved
    And I can use formatting, mentions, etc.

  Scenario: Link to satisfying components [HLR-WIKI-086]
    Given I am editing REQ-BUS-001
    When I click "Add Component" in Satisfied By section
    Then I should see a component picker
    When I select "@PaymentService"
    Then PaymentService should be linked
    And the requirement should show "Satisfied by: @PaymentService"
    And PaymentService page should show "Satisfies: REQ-BUS-001"

  Scenario: Link to related user stories [HLR-WIKI-087]
    Given I am editing REQ-BUS-001
    When I click "Add Story" in Related Stories section
    When I select "@US-PAY-001"
    Then the story should be linked
    And the requirement should show it in metadata
    And the story should show "Implements: REQ-BUS-001"

  Scenario: Convert text to requirement [HLR-WIKI-088]
    Given I am editing meeting notes
    And I have text: "The system must support 10K concurrent users"
    When I select that text
    And I right-click → "Create Requirement"
    Then a new Requirement page should be created
    And the selected text should be in the Description
    And I should be prompted for Identifier, Type, Priority
    And the original text should be replaced with @REQ-[ID] mention

  Scenario: View requirements table [HLR-WIKI-089]
    Given I have created multiple requirements
    When I navigate to Wiki → Requirements view
    Then I should see a table with columns:
      | Column | Content |
      | ID | REQ-BUS-001 |
      | Title | Fast Payment Processing |
      | Type | Business |
      | Priority | High |
      | Status | Accepted |
      | Satisfied By | @PaymentService |
      | Stories | @US-PAY-001 |
    And I should be able to sort by any column
    And I should be able to filter by Type, Priority, Status
    And clicking a row should open that requirement page
```

---

### EPIC-WIKI-07: Traceability Matrix

**Objective:** Auto-generate traceability showing requirement → component → story mappings.

**User Value:** Architects can prove requirements are met and find gaps.

#### 4.2.1 High-Level Requirements

| HLR ID | Requirement | Priority | Story Points |
|--------|-------------|----------|--------------|
| HLR-WIKI-090 | The system shall generate a Requirements Traceability Matrix. | Must | 8 |
| HLR-WIKI-091 | The matrix shall show Requirements → Components mapping. | Must | 5 |
| HLR-WIKI-092 | The matrix shall show Requirements → User Stories mapping. | Must | 5 |
| HLR-WIKI-093 | The matrix shall highlight unmet requirements (no components). | Must | 5 |
| HLR-WIKI-094 | Users shall be able to export the matrix to CSV/Excel. | Should | 5 |
| HLR-WIKI-095 | The matrix shall be embeddable as a block in wiki pages. | Should | 5 |

#### 4.2.2 Gherkin Specifications

```gherkin
Feature: Traceability Matrix
  As an architect
  I want to see how requirements map to implementation
  So that I can ensure nothing is missed

  Background:
    Given I have the following requirements:
      | ID | Title | Satisfied By | Related Stories |
      | REQ-BUS-001 | Fast Payments | @PaymentService | @US-PAY-001 |
      | REQ-BUS-002 | PCI Compliance | @PaymentService, @EncryptionService | @US-PAY-002 |
      | REQ-BUS-003 | Multi-Currency | None | None |

  Scenario: Generate traceability matrix [HLR-WIKI-090]
    Given I navigate to Wiki → Traceability
    When the matrix loads
    Then I should see a table with all requirements
    And columns: ID, Title, Type, Priority, Components, Stories, Status

  Scenario: Show requirement to component mapping [HLR-WIKI-091]
    Given I view the traceability matrix
    Then for REQ-BUS-001, I should see:
      | Components | @PaymentService |
    And for REQ-BUS-002, I should see:
      | Components | @PaymentService, @EncryptionService |
    And components should be clickable links

  Scenario: Show requirement to story mapping [HLR-WIKI-092]
    Given I view the traceability matrix
    Then for REQ-BUS-001, I should see:
      | Stories | @US-PAY-001 |
    And the story should be clickable

  Scenario: Highlight unmet requirements [HLR-WIKI-093]
    Given I view the traceability matrix
    Then REQ-BUS-003 should have:
      | Components | ⚠️ None |
      | Stories | ⚠️ None |
    And the row should be highlighted in yellow/orange
    And there should be a filter "Show unmet only"
    When I click that filter
    Then only REQ-BUS-003 should be shown

  Scenario: Export matrix to CSV [HLR-WIKI-094]
    Given I am viewing the traceability matrix
    When I click "Export" → "CSV"
    Then a CSV file should download
    And it should contain all requirements data
    And it should be openable in Excel

  Scenario: Embed matrix in wiki page [HLR-WIKI-095]
    Given I am editing a wiki page "Architecture Review"
    When I type "/traceability" in slash command
    Then I should see "Traceability Matrix" option
    When I select it
    Then a live traceability matrix should be embedded
    And it should auto-update as requirements change
    And it should be filterable inline
```

---

## 5. Phase 4: Advanced Features (Months 7-12)

**Goal:** Complete the platform with collaboration, templates, and version history.

---

### EPIC-WIKI-08: Page Templates

**Objective:** Provide pre-built templates for common documentation types.

**User Value:** Architects can start with proven structures instead of blank pages.

#### 5.1.1 High-Level Requirements

| HLR ID | Requirement | Priority | Story Points |
|--------|-------------|----------|--------------|
| HLR-WIKI-100 | The system shall provide an ADR (Architecture Decision Record) template. | Must | 5 |
| HLR-WIKI-101 | The system shall provide a Solution Design Document template. | Must | 5 |
| HLR-WIKI-102 | The system shall provide a Business Case template. | Should | 3 |
| HLR-WIKI-103 | The system shall provide a Meeting Notes template. | Should | 3 |
| HLR-WIKI-104 | The system shall provide an Onboarding Guide template. | Could | 3 |
| HLR-WIKI-105 | The system shall provide a Runbook template. | Could | 3 |
| HLR-WIKI-106 | The system shall provide an RFC (Request for Comments) template. | Should | 5 |
| HLR-WIKI-107 | Users shall be able to create custom templates. | Could | 8 |
| HLR-WIKI-108 | Users shall be able to share templates with their organization. | Could | 5 |

#### 5.1.2 Gherkin Specifications

```gherkin
Feature: Page Templates
  As an architect
  I want pre-built templates for common documents
  So that I can start with best practices

  Scenario: Create page from ADR template [HLR-WIKI-100]
    Given I click "New Page" → "From Template"
    When I select "Architecture Decision Record (ADR)"
    Then a new page should be created with structure:
      """
      # ADR-[NUMBER]: [Title]
      
      **Status:** [Proposed | Accepted | Deprecated | Superseded]
      **Date:** [YYYY-MM-DD]
      **Deciders:** [List decision makers]
      
      ## Context and Problem Statement
      [Describe the context and problem]
      
      ## Decision Drivers
      - [Driver 1]
      - [Driver 2]
      
      ## Considered Options
      1. [Option 1]
      2. [Option 2]
      3. [Option 3]
      
      ## Decision Outcome
      Chosen option: "[option]" because [justification]
      
      ## Consequences
      **Positive:**
      - [Pro 1]
      
      **Negative:**
      - [Con 1]
      
      ## Links
      - Related ADRs: [mentions]
      - Components affected: [mentions]
      """
    And placeholder text should be easy to replace

  Scenario: Create Solution Design Document [HLR-WIKI-101]
    When I select "Solution Design Document" template
    Then I should get structure with sections:
      | Section |
      | Executive Summary |
      | Business Context |
      | Requirements |
      | Proposed Solution |
      | Architecture Diagram |
      | Components |
      | Data Model |
      | Integration Points |
      | Security Considerations |
      | Performance Considerations |
      | Deployment Strategy |
      | Testing Strategy |
      | Risks & Mitigation |
    And each section should have helpful prompts

  Scenario: Create Meeting Notes [HLR-WIKI-103]
    When I select "Meeting Notes" template
    Then I should get:
      """
      # Meeting: [Topic]
      
      **Date:** [Auto-filled today]
      **Attendees:** [Use @ mentions]
      **Duration:** [Time]
      
      ## Agenda
      1. [Item 1]
      2. [Item 2]
      
      ## Discussion
      [Notes during meeting]
      
      ## Decisions Made
      - [Decision 1] - @Owner
      - [Decision 2] - @Owner
      
      ## Action Items
      - [ ] [Action 1] - @Assignee - Due: [Date]
      - [ ] [Action 2] - @Assignee - Due: [Date]
      
      ## Next Steps
      [Follow-up actions]
      """
    And action items should be trackable

  Scenario: Create custom template [HLR-WIKI-107]
    Given I am editing a page with my preferred structure
    When I click "Page Options" → "Save as Template"
    Then I should see a template creation dialog
    When I enter name "Security Review Template"
    And I optionally add description
    And I click "Save"
    Then my template should be saved
    And it should appear in my template list
    And I can use it to create new pages

  Scenario: Share template with organization [HLR-WIKI-108]
    Given I have created a custom template
    When I go to template settings
    And I toggle "Share with organization"
    Then all team members should see this template
    And it should appear in their "Organization Templates" section
```

---

### EPIC-WIKI-09: Collaboration Features

**Objective:** Enable real-time collaboration like Google Docs.

**User Value:** Multiple architects can work on the same document simultaneously.

#### 5.2.1 High-Level Requirements

| HLR ID | Requirement | Priority | Story Points |
|--------|-------------|----------|--------------|
| HLR-WIKI-110 | The system shall support real-time collaborative editing using Yjs. | Should | 10 |
| HLR-WIKI-111 | Users shall see cursors and selections of other editors. | Should | 5 |
| HLR-WIKI-112 | Users shall see a presence indicator showing who else is viewing/editing. | Should | 5 |
| HLR-WIKI-113 | Users shall be able to add comments on specific blocks. | Should | 8 |
| HLR-WIKI-114 | Users shall be able to resolve comments. | Should | 3 |
| HLR-WIKI-115 | Users shall be able to subscribe to page changes (notifications). | Should | 5 |
| HLR-WIKI-116 | Users shall receive notifications when mentioned in comments. | Should | 5 |

#### 5.2.2 Gherkin Specifications

```gherkin
Feature: Real-Time Collaboration
  As an architect
  I want to collaborate with teammates in real-time
  So that we can work together efficiently

  Scenario: Real-time editing with Yjs [HLR-WIKI-110]
    Given User A and User B are editing the same page
    When User A types "The PaymentService handles transactions"
    Then User B should see the text appear in real-time
    And there should be no conflicts
    And the text should appear within 200ms

  Scenario: Show collaborator cursors [HLR-WIKI-111]
    Given User A and User B are editing the same page
    Then User A should see User B's cursor
    And it should be labeled "User B"
    And it should use a distinct color
    When User B selects text
    Then User A should see the selection highlighted

  Scenario: Presence indicator [HLR-WIKI-112]
    Given I am viewing a wiki page
    And 3 other users are also viewing it
    Then I should see avatars/icons at the top
    And it should show "4 people viewing"
    And I should see:
      | User | Status |
      | Alice | Editing |
      | Bob | Viewing |
      | Carol | Editing |

  Scenario: Add comment on block [HLR-WIKI-113]
    Given I am viewing a paragraph
    When I select text and click "Add comment" (or press Cmd+Shift+M)
    Then a comment thread should open on the side
    And I should be able to type my comment
    When I type "Should we include the retry logic here?" and submit
    Then the comment should be saved
    And the paragraph should have a comment indicator
    And the commented text should have a yellow highlight

  Scenario: Reply to comment [HLR-WIKI-113]
    Given there is a comment on a paragraph
    When I click on the comment indicator
    Then the comment thread should open
    When I type a reply "Yes, retry logic is critical"
    And I submit
    Then the reply should appear threaded under the original

  Scenario: Resolve comment [HLR-WIKI-114]
    Given there is a comment thread with multiple replies
    When I click "Resolve"
    Then the comment should be marked as resolved
    And the highlight should be removed from the text
    And the comment should move to "Resolved" section
    And I should be able to "Unresolve" if needed

  Scenario: Subscribe to page changes [HLR-WIKI-115]
    Given I am viewing a wiki page
    When I click the "Watch" icon
    Then I should be subscribed to notifications
    When another user edits the page
    Then I should receive a notification:
      "Alice edited 'Payment Architecture'"
    And I should be able to click to see changes

  Scenario: Mention in comment notification [HLR-WIKI-116]
    Given Bob adds a comment mentioning me: "@John can you review?"
    Then I should receive a notification
    And it should say "Bob mentioned you in Payment Architecture"
    When I click the notification
    Then I should navigate to that page
    And the comment should be highlighted
```

---

### EPIC-WIKI-10: Version History

**Objective:** Provide Git-like version control for wiki pages.

**User Value:** Architects can see changes over time and restore previous versions.

#### 5.3.1 High-Level Requirements

| HLR ID | Requirement | Priority | Story Points |
|--------|-------------|----------|--------------|
| HLR-WIKI-120 | The system shall maintain version history for every page. | Must | 8 |
| HLR-WIKI-121 | Users shall be able to view previous versions. | Must | 5 |
| HLR-WIKI-122 | Users shall be able to compare two versions (diff view). | Should | 8 |
| HLR-WIKI-123 | Users shall be able to restore a previous version. | Must | 5 |
| HLR-WIKI-124 | Each version shall show author, timestamp, and change summary. | Must | 3 |
| HLR-WIKI-125 | Users shall be able to add commit messages when saving. | Should | 5 |

#### 5.3.2 Gherkin Specifications

```gherkin
Feature: Version History
  As an architect
  I want to see and restore previous versions
  So that I can track changes and undo mistakes

  Scenario: Maintain version history [HLR-WIKI-120]
    Given I have a wiki page
    When I make an edit and save
    Then a new version should be created
    And the version should be numbered (v1, v2, v3...)
    And the previous version should be preserved

  Scenario: View version history [HLR-WIKI-121]
    Given I am viewing a wiki page
    When I click "History" or clock icon
    Then I should see a list of all versions:
      | Version | Author | Date | Summary |
      | v5 | Alice | Today 2:30 PM | Added security section |
      | v4 | Bob | Today 10:15 AM | Fixed typo |
      | v3 | Alice | Yesterday | Initial draft |
    And I should be able to click to view any version

  Scenario: View specific version [HLR-WIKI-121]
    Given I am viewing version history
    When I click on "v3"
    Then the page should display as it was in v3
    And I should see a banner "Viewing v3 (2 versions behind)"
    And I should see "Restore this version" button
    And I should see "Back to current" button

  Scenario: Compare versions [HLR-WIKI-122]
    Given I am viewing version history
    When I select v3 and v5 for comparison
    Then I should see a side-by-side or inline diff
    And additions should be highlighted in green
    And deletions should be highlighted in red
    And unchanged text should be grayed out

  Scenario: Restore previous version [HLR-WIKI-123]
    Given I am viewing v3 of a page
    And the current version is v5
    When I click "Restore this version"
    Then I should see a confirmation: "This will create a new version with v3 content"
    When I confirm
    Then a new version v6 should be created
    And v6 content should match v3
    And the version history should show: "v6: Restored from v3"

  Scenario: View version metadata [HLR-WIKI-124]
    Given I view version history
    Then for each version I should see:
      | Field | Example |
      | Version number | v4 |
      | Author | alice@company.com |
      | Avatar | [User avatar image] |
      | Timestamp | 2 hours ago |
      | Summary | "Added security considerations" |
      | Changes | "142 characters added, 5 deleted" |

  Scenario: Add commit message [HLR-WIKI-125]
    Given I am editing a wiki page
    When I press Cmd+S to save
    Then I should see a "Save Changes" dialog
    And I should see an optional "What changed?" field
    When I enter "Added deployment strategy section"
    And I click "Save"
    Then the version should be saved with that message
    And the message should appear in version history
```

---

## 6. Requirements Traceability Matrix

This section maps High-Level Requirements (HLRs) to Gherkin Scenarios.

| HLR ID | Requirement Summary | Gherkin Scenarios | Coverage |
|--------|---------------------|-------------------|----------|
| HLR-WIKI-001 | Create new wiki pages | Create with title, Validation | 100% |
| HLR-WIKI-002 | View list of pages | View list, Sorting | 100% |
| HLR-WIKI-003 | Edit pages | Edit title, Edit content | 100% |
| HLR-WIKI-004 | Delete pages | Delete with confirmation, Cancel | 100% |
| HLR-WIKI-005 | Hierarchical organization | Create child page | 100% |
| HLR-WIKI-006 | Duplicate pages | Duplicate existing | 100% |
| HLR-WIKI-007 | Auto-save drafts | Auto-save every 30s | 100% |
| HLR-WIKI-008 | Restore drafts | Restore from draft | 100% |
| HLR-WIKI-009 | Metadata tracking | Created/updated tracking | 100% |
| HLR-WIKI-010 | Search pages | Search by title, Search by content | 100% |
| HLR-WIKI-020 | TipTap editor | Multiple integration scenarios | 100% |
| HLR-WIKI-021 | Markdown shortcuts | H1, H2, bullets, numbered lists | 100% |
| HLR-WIKI-022 | Slash commands | Open menu, Insert blocks | 100% |
| HLR-WIKI-050-064 | Semantic mentions | 15+ scenarios covering all mention features | 100% |
| HLR-WIKI-070-075 | Backlinks | View, navigate, filter backlinks | 100% |
| HLR-WIKI-080-089 | Requirements management | Create, edit, link, view table | 100% |
| HLR-WIKI-090-095 | Traceability matrix | Generate, highlight gaps, export | 100% |
| HLR-WIKI-100-108 | Page templates | ADR, Solution Design, Meeting Notes, Custom | 100% |
| HLR-WIKI-110-116 | Collaboration | Real-time editing, comments, notifications | 100% |
| HLR-WIKI-120-125 | Version history | View, compare, restore versions | 100% |

**Total HLRs:** 75  
**Total Scenarios:** 90+  
**Coverage:** 100%

---

## 7. Test Coverage Analysis

### By Epic (Test Scenarios)

| Epic | Scenarios | Story Points | Sprint Allocation |
|------|-----------|--------------|-------------------|
| EPIC-WIKI-01: Page Management | 16 | 41 | Sprint 1-2 |
| EPIC-WIKI-02: Block Editor | 19 | 51 | Sprint 2-3 |
| EPIC-WIKI-03: Tree View | 10 | 38 | Sprint 3-4 |
| EPIC-WIKI-04: Semantic Mentions | 15 | 76 | Sprint 5-7 |
| EPIC-WIKI-05: Backlinks | 6 | 23 | Sprint 7-8 |
| EPIC-WIKI-06: Requirements Mgmt | 10 | 49 | Sprint 9-11 |
| EPIC-WIKI-07: Traceability | 6 | 33 | Sprint 11-12 |
| EPIC-WIKI-08: Templates | 8 | 37 | Sprint 13-14 |
| EPIC-WIKI-09: Collaboration | 8 | 41 | Sprint 15-16 |
| EPIC-WIKI-10: Version History | 6 | 34 | Sprint 17-18 |

**Total Story Points:** 423  
**Estimated Sprints:** 18 (at ~25 points/sprint)  
**Timeline:** ~9 months (2-week sprints)

---

## Appendix A: Sprint Planning Guide

### Sprint 1: Wiki Foundation (10 days, 25 points)
- HLR-WIKI-001-004: Basic CRUD (16 points)
- HLR-WIKI-009-010: Metadata & Search (7 points)
- Setup TipTap editor infrastructure (2 points)

### Sprint 2: Editor Basics (10 days, 25 points)
- HLR-WIKI-020-021: TipTap + Markdown (13 points)
- HLR-WIKI-023-024: Headings & Lists (6 points)
- HLR-WIKI-028: Text formatting (3 points)
- HLR-WIKI-032: Keyboard shortcuts (3 points)

### Sprint 3: Editor Advanced (10 days, 26 points)
- HLR-WIKI-022: Slash commands (8 points)
- HLR-WIKI-025: Code blocks (5 points)
- HLR-WIKI-026-027: Tables & Images (10 points)
- HLR-WIKI-029-030: Quotes & Dividers (4 points)

### Sprint 4: Tree Navigation (10 days, 25 points)
- HLR-WIKI-040-042: Tree view & drag-drop (16 points)
- HLR-WIKI-043-044: Keyboard nav & folders (10 points)
- Polish & bug fixes

### Sprint 5-7: Semantic Mentions (30 days, 76 points)
*This is the killer feature - allocate 3 sprints*
- Sprint 5: Core mention infrastructure (25 points)
- Sprint 6: Cross-module search integration (26 points)
- Sprint 7: Status updates & polish (25 points)

### Sprint 8: Backlinks (10 days, 23 points)
- HLR-WIKI-070-074: Backlink views & navigation (15 points)
- HLR-WIKI-075: Filtering (3 points)
- Integration testing (5 points)

### Sprints 9-11: Requirements Management (30 days, 49 points)
- Sprint 9: Requirement pages & templates (16 points)
- Sprint 10: Component & story linking (15 points)
- Sprint 11: Requirements table view & convert-to-req (18 points)

### Sprints 12: Traceability (10 days, 33 points)
- HLR-WIKI-090-095: Matrix generation & export (33 points)

### Sprints 13-14: Templates (20 days, 37 points)
- Sprint 13: Core templates (ADR, Solution Design, etc.) (20 points)
- Sprint 14: Custom templates & sharing (17 points)

### Sprints 15-16: Collaboration (20 days, 41 points)
- Sprint 15: Real-time editing with Yjs (20 points)
- Sprint 16: Comments & notifications (21 points)

### Sprints 17-18: Version History (20 days, 34 points)
- Sprint 17: Version storage & viewing (21 points)
- Sprint 18: Diff view & restore (13 points)

---

## Appendix B: Database Schema

```sql
-- Wiki Pages
CREATE TABLE wiki_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  content JSONB NOT NULL, -- TipTap JSON
  parent_id UUID REFERENCES wiki_pages(id) ON DELETE SET NULL,
  template VARCHAR(50), -- 'ADR', 'Design', 'Requirement', etc.
  status VARCHAR(20) DEFAULT 'Draft', -- 'Draft', 'Published', 'Archived'
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  created_by UUID REFERENCES users(id),
  updated_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT valid_status CHECK (status IN ('Draft', 'Published', 'Archived'))
);

-- Entity Mentions (for @mentions)
CREATE TABLE entity_mentions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES wiki_pages(id) ON DELETE CASCADE,
  entity_type VARCHAR(50) NOT NULL, -- 'Story', 'Epic', 'Component', 'Diagram', 'Page', 'Requirement', 'ADR'
  entity_id UUID NOT NULL,
  text VARCHAR(255) NOT NULL, -- Display text
  position INTEGER NOT NULL, -- Character offset in content
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_entity_backlinks (entity_type, entity_id),
  INDEX idx_page_mentions (page_id)
);

-- Requirements (extends wiki_pages)
CREATE TABLE wiki_requirements (
  page_id UUID PRIMARY KEY REFERENCES wiki_pages(id) ON DELETE CASCADE,
  identifier VARCHAR(50) UNIQUE NOT NULL, -- REQ-BUS-001
  requirement_type VARCHAR(20) NOT NULL, -- 'Business', 'Product', 'Technical'
  priority VARCHAR(10) NOT NULL, -- 'High', 'Medium', 'Low'
  req_status VARCHAR(20) DEFAULT 'Proposed', -- 'Proposed', 'Accepted', 'Implemented', 'Deprecated'
  CONSTRAINT valid_type CHECK (requirement_type IN ('Business', 'Product', 'Technical')),
  CONSTRAINT valid_priority CHECK (priority IN ('High', 'Medium', 'Low'))
);

-- Requirements Satisfaction Links
CREATE TABLE requirement_satisfactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requirement_id UUID REFERENCES wiki_requirements(page_id) ON DELETE CASCADE,
  component_id UUID REFERENCES components(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (requirement_id, component_id)
);

-- Requirements Story Links
CREATE TABLE requirement_stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requirement_id UUID REFERENCES wiki_requirements(page_id) ON DELETE CASCADE,
  story_id UUID REFERENCES user_stories(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (requirement_id, story_id)
);

-- Page Comments
CREATE TABLE wiki_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES wiki_pages(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES wiki_comments(id) ON DELETE CASCADE,
  block_id VARCHAR(100), -- TipTap block identifier
  content TEXT NOT NULL,
  resolved BOOLEAN DEFAULT FALSE,
  author_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Version History
CREATE TABLE wiki_page_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES wiki_pages(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  content JSONB NOT NULL,
  commit_message TEXT,
  author_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (page_id, version_number)
);

-- Page Templates
CREATE TABLE wiki_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  content JSONB NOT NULL, -- TipTap JSON template
  is_system BOOLEAN DEFAULT FALSE, -- Built-in vs user-created
  is_shared BOOLEAN DEFAULT FALSE, -- Shared with org
  created_by UUID REFERENCES users(id),
  organization_id UUID REFERENCES organizations(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Full-text search index
CREATE INDEX idx_wiki_search ON wiki_pages USING gin(to_tsvector('english', title || ' ' || content));
```

---

## Appendix C: API Endpoints

```
# Wiki Pages
GET    /api/wiki                       # List all pages
GET    /api/wiki/:id                   # Get page by ID
POST   /api/wiki                       # Create new page
PUT    /api/wiki/:id                   # Update page
DELETE /api/wiki/:id                   # Delete page
POST   /api/wiki/:id/duplicate         # Duplicate page

# Search
GET    /api/wiki/search?q=query        # Search pages

# Mentions
GET    /api/wiki/mentions/search?q=    # Search for @mention
GET    /api/wiki/:id/backlinks         # Get backlinks for page
POST   /api/wiki/mentions              # Create mention

# Requirements
GET    /api/wiki/requirements          # List all requirements
POST   /api/wiki/requirements          # Create requirement
PUT    /api/wiki/requirements/:id      # Update requirement
GET    /api/wiki/traceability          # Get traceability matrix

# Tree View
GET    /api/wiki/tree                  # Get tree structure
PUT    /api/wiki/:id/move              # Move page in tree

# Templates
GET    /api/wiki/templates             # List templates
POST   /api/wiki/templates             # Create template
GET    /api/wiki/templates/:id         # Get template

# Comments
GET    /api/wiki/:id/comments          # Get page comments
POST   /api/wiki/:id/comments          # Add comment
PUT    /api/wiki/comments/:id          # Update comment
DELETE /api/wiki/comments/:id          # Delete comment
PUT    /api/wiki/comments/:id/resolve  # Resolve comment

# Version History
GET    /api/wiki/:id/versions          # Get version history
GET    /api/wiki/:id/versions/:v       # Get specific version
POST   /api/wiki/:id/restore/:v        # Restore version
GET    /api/wiki/:id/diff?from=v1&to=v2 # Compare versions

# Collaboration
WS     /ws/wiki/:id                    # WebSocket for real-time collab
```

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2024-12-15 | Claude (AI) | Initial comprehensive requirements document |

**Approved by:** [Pending]  
**Next Review:** [After Sprint 4]

---

**END OF DOCUMENT**
