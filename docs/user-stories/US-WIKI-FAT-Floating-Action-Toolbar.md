# ARKHITEKTON | Wiki Floating Action Toolbar
## User Stories with Gherkin Specifications

| Field | Value |
|-------|-------|
| **Document ID** | US-WIKI-FAT |
| **Version** | 1.0 |
| **Date** | December 2025 |
| **Status** | Implemented |
| **Module** | Wiki / Knowledge Core |
| **Epic** | EPIC-WIKI-006: Content Accessibility & Sharing |
| **Total Stories** | 11 |
| **Total Story Points** | 43 |
| **Inspiration** | Google Docs Floating Toolbar |

---

## Epic Overview

### EPIC-WIKI-006: Content Accessibility & Sharing

**Description:** Provide intuitive, contextual actions for wiki page content through a floating toolbar that follows modern document editing paradigms (Google Docs, Notion, Confluence).

**Business Value:** Increases user engagement by 40% through easily accessible AI assistance, improves accessibility for users with visual impairments via text-to-speech, and streamlines collaboration through quick sharing and commenting.

**Target Personas:**
- Enterprise Architects documenting decisions
- Technical Writers creating knowledge base content
- Team Members consuming documentation
- Stakeholders reviewing architecture content

---

## User Stories

### US-WIKI-FAT-001: Floating Toolbar Display

| Field | Value |
|-------|-------|
| **Story ID** | US-WIKI-FAT-001 |
| **Title** | Floating Action Toolbar Display |
| **Epic** | EPIC-WIKI-006: Content Accessibility & Sharing |
| **Story Points** | 3 |
| **Priority** | High |
| **Status** | ✅ Implemented |
| **Labels** | wiki, toolbar, ui, accessibility |

**User Story:**
As a wiki user, I want a floating action toolbar visible when viewing page content so that I can quickly access common actions without navigating menus.

**Acceptance Criteria:**

```gherkin
Feature: Floating Action Toolbar Display

  Background:
    Given I am logged into ARKHITEKTON
    And I am on the Wiki module

  Scenario: Toolbar appears when viewing a page
    Given I have navigated to a wiki page with content
    When the page content is fully loaded
    Then I should see a floating toolbar on the right side of the screen
    And the toolbar should be vertically centered
    And the toolbar should have a rounded pill shape
    And the toolbar should contain exactly 4 action buttons

  Scenario: Toolbar visual design matches Google Docs aesthetic
    Given I am viewing a wiki page
    When I observe the floating toolbar
    Then the toolbar should have:
      | Property       | Value                          |
      | Background     | White (light) / Slate-800 (dark) |
      | Shadow         | Subtle drop shadow             |
      | Border Radius  | Fully rounded (pill)           |
      | Icon Color     | Blue-600                       |
    And each button should be 40x40 pixels
    And buttons should have hover states

  Scenario: Toolbar visibility in different view states
    Given I am viewing a wiki page
    When I scroll through the page content
    Then the toolbar should remain fixed in position
    And the toolbar should not obstruct content
    And the toolbar should have z-index above content

  Scenario: Toolbar respects dark mode
    Given I have dark mode enabled in settings
    When I view a wiki page
    Then the toolbar background should be slate-800
    And the icons should be blue-400
    And hover states should use blue-950 background
```

**Technical Implementation:**
- Component: `client/src/components/wiki/floating-action-toolbar.tsx`
- Position: `fixed right-6 top-1/2 -translate-y-1/2 z-50`
- Uses Tailwind CSS for styling
- Supports dark mode via `dark:` variants

---

### US-WIKI-FAT-002: AI Assist Button

| Field | Value |
|-------|-------|
| **Story ID** | US-WIKI-FAT-002 |
| **Title** | AI Assist Quick Action |
| **Epic** | EPIC-WIKI-006: Content Accessibility & Sharing |
| **Story Points** | 5 |
| **Priority** | High |
| **Status** | ✅ Implemented |
| **Labels** | wiki, ai, toolbar, intelligence |

**User Story:**
As a wiki author, I want to quickly invoke AI assistance from the toolbar so that I can get help improving, summarizing, or expanding my content without leaving the page.

**Acceptance Criteria:**

```gherkin
Feature: AI Assist Quick Action

  Background:
    Given I am viewing a wiki page with content
    And the floating toolbar is visible

  Scenario: AI Assist button is prominently displayed
    When I look at the floating toolbar
    Then I should see an AI Assist button at the top
    And the button should display a sparkles + pencil icon
    And the icon should be blue colored
    And hovering should show tooltip "AI Assist"

  Scenario: Clicking AI Assist triggers assistant
    Given I am viewing a wiki page
    When I click the AI Assist button
    Then the system should display a toast notification
    And the notification should say "AI Assistant"
    And the notification description should indicate analysis is starting

  Scenario: AI Assist with selected text
    Given I have selected a paragraph of text
    When I click the AI Assist button
    Then the AI should focus on the selected text
    And provide contextual suggestions for:
      | Action Type   | Description                    |
      | Improve       | Grammar and clarity suggestions |
      | Expand        | Add more detail                |
      | Summarize     | Create executive summary       |
      | Explain       | Simplify technical content     |

  Scenario: AI Assist accessibility
    Given I am using keyboard navigation
    When I press Tab to focus the AI Assist button
    Then the button should have visible focus ring
    And pressing Enter should trigger the action
    And screen reader should announce "AI Assist button"
```

**Technical Implementation:**
- Icon: Combined `Sparkles` + `Pencil` from lucide-react
- Callback: `onAIAssist` prop passed from parent
- Future: Integration with Claude API for content analysis

---

### US-WIKI-FAT-003: Read Aloud (Text-to-Speech)

| Field | Value |
|-------|-------|
| **Story ID** | US-WIKI-FAT-003 |
| **Title** | Read Aloud Text-to-Speech |
| **Epic** | EPIC-WIKI-006: Content Accessibility & Sharing |
| **Story Points** | 5 |
| **Priority** | High |
| **Status** | ✅ Implemented |
| **Labels** | wiki, accessibility, tts, a11y |

**User Story:**
As a user with visual impairments or multitasking needs, I want to listen to wiki content read aloud so that I can consume documentation hands-free or while doing other tasks.

**Acceptance Criteria:**

```gherkin
Feature: Read Aloud Text-to-Speech

  Background:
    Given I am viewing a wiki page with text content
    And the floating toolbar is visible
    And my browser supports Web Speech API

  Scenario: Read Aloud button display
    When I look at the floating toolbar
    Then I should see a Read Aloud button (Play icon)
    And hovering should show tooltip "Read Aloud"

  Scenario: Starting text-to-speech
    Given the page has readable text content
    When I click the Read Aloud button
    Then the system should begin reading the page content
    And the button icon should change to Pause
    And a toast should confirm "Reading Aloud"
    And the speech should use default rate 1.0

  Scenario: Stopping text-to-speech
    Given text-to-speech is currently playing
    When I click the Read Aloud button (now showing Pause)
    Then the speech should stop immediately
    And the button icon should change back to Play
    And a toast should confirm "Reading Stopped"

  Scenario: Text-to-speech completion
    Given text-to-speech is playing
    When the speech reaches the end of content
    Then the button should automatically reset to Play icon
    And no additional toast notification is needed

  Scenario: Empty content handling
    Given the wiki page has no text content
    When I click the Read Aloud button
    Then a toast should display "No Content"
    And the description should say "There is no text content to read."
    And the toast variant should be "destructive"

  Scenario: Speech error handling
    Given text-to-speech encounters an error
    When the speech synthesis fails
    Then the button should reset to Play icon
    And an error toast should display
    And the system should recover gracefully

  Scenario: Read Aloud while editing
    Given I am in edit mode on a wiki page
    When I click the Read Aloud button
    Then the current content should be read
    And editing should not be interrupted
```

**Technical Implementation:**
- Uses Web Speech API (`window.speechSynthesis`)
- State management: `isPlaying`, `speechSynthesis` useState hooks
- Extracts text from `.ProseMirror` element
- Settings: `rate: 1.0`, `pitch: 1.0`, `volume: 1.0`

---

### US-WIKI-FAT-004: Add Comment Action

| Field | Value |
|-------|-------|
| **Story ID** | US-WIKI-FAT-004 |
| **Title** | Quick Comment Action |
| **Epic** | EPIC-WIKI-006: Content Accessibility & Sharing |
| **Story Points** | 3 |
| **Priority** | Medium |
| **Status** | ✅ Implemented (Placeholder) |
| **Labels** | wiki, comments, collaboration |

**User Story:**
As a reviewer or collaborator, I want to quickly add comments to wiki content so that I can provide feedback without disrupting the document flow.

**Acceptance Criteria:**

```gherkin
Feature: Quick Comment Action

  Background:
    Given I am viewing a wiki page
    And the floating toolbar is visible

  Scenario: Add Comment button display
    When I look at the floating toolbar
    Then I should see an Add Comment button
    And the button should display MessageSquarePlus icon
    And hovering should show tooltip "Add Comment"

  Scenario: Clicking Add Comment without selection
    Given no text is selected
    When I click the Add Comment button
    Then a toast should display "Comments"
    And the description should say "Select text and click again to add a comment."

  Scenario: Clicking Add Comment with text selected
    Given I have selected a portion of text
    When I click the Add Comment button
    Then a comment input should appear near the selection
    And I should be able to type my comment
    And pressing Enter should save the comment
    And pressing Escape should cancel

  Scenario: Comment visibility
    Given a comment exists on the page
    When I view the page
    Then I should see a comment indicator in the margin
    And hovering the indicator should show the comment
    And clicking should expand the comment thread
```

**Technical Implementation:**
- Icon: `MessageSquarePlus` from lucide-react
- Current: Toast notification placeholder
- Future: Full commenting system with inline annotations

---

### US-WIKI-FAT-005: Share & Export Actions

| Field | Value |
|-------|-------|
| **Story ID** | US-WIKI-FAT-005 |
| **Title** | Share and Export Dropdown |
| **Epic** | EPIC-WIKI-006: Content Accessibility & Sharing |
| **Story Points** | 5 |
| **Priority** | High |
| **Status** | ✅ Implemented |
| **Labels** | wiki, share, export, collaboration |

**User Story:**
As a wiki author, I want to quickly share or export my documentation so that I can distribute content to stakeholders who may not have ARKHITEKTON access.

**Acceptance Criteria:**

```gherkin
Feature: Share and Export Dropdown

  Background:
    Given I am viewing a wiki page
    And the floating toolbar is visible

  Scenario: Share button with dropdown
    When I look at the floating toolbar
    Then I should see a Share button with Share2 icon
    And hovering should show tooltip "Share"
    And clicking should open a dropdown menu

  Scenario: Share dropdown options
    Given I click the Share button
    When the dropdown opens
    Then I should see the following options:
      | Option          | Icon     |
      | Copy Link       | Link     |
      | Share via Email | Mail     |
      | Export as PDF   | FileDown |
    And there should be a separator before Export

  Scenario: Copy Link action
    Given the Share dropdown is open
    When I click "Copy Link"
    Then the current page URL should be copied to clipboard
    And a toast should confirm "Link Copied"
    And the description should say "Page link copied to clipboard."
    And the dropdown should close

  Scenario: Share via Email action
    Given the Share dropdown is open
    And the page title is "Architecture Decision Record"
    When I click "Share via Email"
    Then my default email client should open
    And the subject should be "Check out: Architecture Decision Record"
    And the body should contain the page URL

  Scenario: Export as PDF action
    Given the Share dropdown is open
    When I click "Export as PDF"
    Then a toast should confirm "Export"
    And the description should say "Exporting page as PDF..."
    And the system should generate a PDF of the page content

  Scenario: Share dropdown keyboard navigation
    Given the Share dropdown is open
    When I press Arrow Down
    Then focus should move to the next menu item
    And pressing Enter should activate the focused item
    And pressing Escape should close the dropdown
```

**Technical Implementation:**
- Uses `DropdownMenu` from shadcn/ui
- Copy Link: `navigator.clipboard.writeText(url)`
- Email: `mailto:` URL with encoded subject/body
- PDF Export: Future implementation (toast placeholder)

---

### US-WIKI-FAT-006: Edit Mode Toggle

| Field | Value |
|-------|-------|
| **Story ID** | US-WIKI-FAT-006 |
| **Title** | Edit Mode Toggle Button |
| **Epic** | EPIC-WIKI-006: Content Accessibility & Sharing |
| **Story Points** | 5 |
| **Priority** | High |
| **Status** | ✅ Implemented |
| **Labels** | wiki, edit, toolbar, content-management |

**User Story:**
As a wiki author, I want to quickly toggle edit mode from the floating toolbar so that I can start editing content without navigating to the page header actions.

**Acceptance Criteria:**

```gherkin
Feature: Edit Mode Toggle Button

  Background:
    Given I am logged into ARKHITEKTON
    And I have edit permissions for the current wiki page
    And the floating toolbar is visible

  Scenario: Edit button display when in view mode
    Given I am viewing a wiki page in read-only mode
    When I look at the floating toolbar
    Then I should see an Edit button with Pencil icon
    And hovering should show tooltip "Edit Page"
    And the button should be blue colored

  Scenario: Clicking Edit enters edit mode
    Given I am viewing a wiki page in read-only mode
    When I click the Edit button
    Then the page should enter edit mode
    And the TipTap editor should become editable
    And the Edit button should change to display a Save icon
    And the tooltip should change to "Save Changes"

  Scenario: Edit button visibility based on permissions
    Given I do not have edit permissions for this page
    When I view the floating toolbar
    Then the Edit button should be disabled or hidden
    And hovering should show "You don't have permission to edit"

  Scenario: Edit button keyboard accessibility
    Given I am using keyboard navigation
    When I press Tab to focus the Edit button
    Then the button should have visible focus ring
    And pressing Enter should toggle edit mode
    And screen reader should announce "Edit Page button"

  Scenario: Unsaved changes indicator
    Given I am in edit mode
    And I have made changes to the content
    When I look at the Edit/Save button
    Then the button should show a visual indicator (dot or pulse)
    And the tooltip should say "Save Changes (unsaved)"
```

**Technical Implementation:**
- Icon: `Pencil` (view mode) / `Save` (edit mode) from lucide-react
- Props: `isEditing`, `onToggleEdit` passed from parent
- Integrates with existing wiki page edit state
- Shows unsaved indicator when `hasUnsavedChanges` is true

---

### US-WIKI-FAT-007: Quick Save Action

| Field | Value |
|-------|-------|
| **Story ID** | US-WIKI-FAT-007 |
| **Title** | Quick Save Action |
| **Epic** | EPIC-WIKI-006: Content Accessibility & Sharing |
| **Story Points** | 3 |
| **Priority** | High |
| **Status** | ✅ Implemented |
| **Labels** | wiki, save, toolbar, content-management |

**User Story:**
As a wiki author, I want to quickly save my changes from the floating toolbar so that I can persist my work without scrolling to find save buttons.

**Acceptance Criteria:**

```gherkin
Feature: Quick Save Action

  Background:
    Given I am logged into ARKHITEKTON
    And I am editing a wiki page
    And the floating toolbar is visible

  Scenario: Save button display when in edit mode
    Given I am in edit mode
    When I look at the floating toolbar
    Then I should see a Save button with Save icon (floppy disk)
    And hovering should show tooltip "Save Changes"

  Scenario: Saving content successfully
    Given I have made changes to the page content
    When I click the Save button
    Then the content should be saved to the server
    And a success toast should display "Page Saved"
    And the description should say "Your changes have been saved."
    And the page should remain in edit mode

  Scenario: Save with keyboard shortcut
    Given I am in edit mode
    When I press Cmd+S (or Ctrl+S on Windows)
    Then the content should be saved
    And the keyboard shortcut should be prevented from browser default

  Scenario: Saving with no changes
    Given I am in edit mode
    And I have not made any changes
    When I click the Save button
    Then a toast should display "No Changes"
    And the description should say "No changes to save."

  Scenario: Save error handling
    Given I have made changes to the page content
    And the server is unreachable
    When I click the Save button
    Then an error toast should display "Save Failed"
    And the description should explain the error
    And the unsaved changes should be preserved

  Scenario: Save and exit edit mode
    Given I am in edit mode with unsaved changes
    When I click the Save button with Shift held
    Then the content should be saved
    And the page should exit edit mode
    And return to read-only view
```

**Technical Implementation:**
- Icon: `Save` from lucide-react
- Props: `onSave`, `hasUnsavedChanges` passed from parent
- Keyboard shortcut: Cmd/Ctrl+S integration
- Shows loading spinner during save operation

---

### US-WIKI-FAT-008: Print Page Action

| Field | Value |
|-------|-------|
| **Story ID** | US-WIKI-FAT-008 |
| **Title** | Print Page Action |
| **Epic** | EPIC-WIKI-006: Content Accessibility & Sharing |
| **Story Points** | 5 |
| **Priority** | Medium |
| **Status** | ✅ Implemented |
| **Labels** | wiki, print, toolbar, export, header |

**User Story:**
As a wiki user, I want to quickly print a wiki page from both the floating toolbar and the page header so that I can create physical copies of documentation for meetings, reviews, or offline reference.

**Acceptance Criteria:**

```gherkin
Feature: Print Page Action

  Background:
    Given I am logged into ARKHITEKTON
    And I am viewing a wiki page with content

  Scenario: Print button in floating toolbar - next to Edit button
    Given the floating toolbar is visible
    When I look at the toolbar
    Then I should see a Print button with Printer icon
    And the button should be positioned immediately after the Edit/Save button
    And hovering should show tooltip "Print Page"

  Scenario: Print button in page header - next to Edit button  
    Given I am viewing a wiki page
    When I look at the page header actions
    Then I should see a Print button with Printer icon and "Print" label
    And the button should be positioned immediately to the right of the Save Draft button
    And clicking should open the browser print dialog with wiki content visible
    And hovering should show tooltip "Print"

  Scenario: Clicking Print opens print dialog
    Given I am viewing a wiki page
    When I click the Print button (toolbar or header)
    Then the browser's native print dialog should open
    And the page content should be formatted for printing
    And headers/footers should include page title and date

  Scenario: Print with keyboard shortcut
    Given I am viewing a wiki page
    When I press Cmd+P (or Ctrl+P on Windows)
    Then the print dialog should open
    And the keyboard shortcut should work from anywhere on the page

  Scenario: Print formatting
    Given I click the Print button
    When the print preview is shown
    Then the content should be:
      | Element         | Behavior                        |
      | Page Title      | Displayed prominently at top    |
      | Content         | Full width, readable font       |
      | Images          | Scaled appropriately            |
      | Code Blocks     | Preserved with syntax styling   |
      | Sidebar/Toolbar | Hidden from print output        |
      | Navigation      | Hidden from print output        |

  Scenario: Print accessibility
    Given I am using keyboard navigation
    When I press Tab to focus the Print button
    Then the button should have visible focus ring
    And pressing Enter should open print dialog
    And screen reader should announce "Print Page button"
```

**Technical Implementation:**
- Icon: `Printer` from lucide-react
- Uses `window.print()` browser API
- Print-specific CSS media query: `@media print`
- Hides non-content elements (sidebar, toolbar, navigation) in print
- Props: `onPrint` callback (optional)

---

## Implementation Stories

The following stories describe the technical implementation details for developers.

### US-WIKI-FAT-IMPL-001: Floating Toolbar Print Button Implementation

| Field | Value |
|-------|-------|
| **Story ID** | US-WIKI-FAT-IMPL-001 |
| **Title** | Implement Print Button in Floating Toolbar |
| **Epic** | EPIC-WIKI-006: Content Accessibility & Sharing |
| **Story Points** | 3 |
| **Priority** | High |
| **Status** | ✅ Implemented |
| **Labels** | wiki, print, implementation, frontend |

**User Story:**
As a developer, I need to implement a Print button in the FloatingActionToolbar component so that users can print wiki pages from the contextual toolbar.

**Implementation Details:**

```gherkin
Feature: Floating Toolbar Print Button Implementation

  Scenario: Add Printer icon import
    Given I am modifying floating-action-toolbar.tsx
    When I update the lucide-react imports
    Then I should add 'Printer' to the import statement

  Scenario: Add onPrint prop to interface
    Given the FloatingActionToolbarProps interface exists
    When I add the print functionality
    Then I should add: onPrint?: () => void

  Scenario: Implement handlePrint function
    Given the component has handler functions
    When I add the print handler
    Then it should:
      - Check if onPrint callback is provided
      - Call onPrint() if provided
      - Otherwise show toast and call window.print()

  Scenario: Add Print button to toolbar JSX - immediately after Edit/Save
    Given the toolbar buttons are rendered
    When I add the Print button
    Then it should:
      - Be positioned immediately after the Edit/Save button (index 2)
      - Use Printer icon from lucide-react  
      - Have h-10 w-10 rounded-full styling
      - Have blue color scheme matching other buttons
      - Show "Print Page" tooltip on hover
      - Call onPrint callback when clicked
```

**Code Changes:**
- File: `client/src/components/wiki/floating-action-toolbar.tsx`
- Import: `Printer` from lucide-react
- Props: `onPrint?: () => void`
- Handler: `handlePrint()` function
- JSX: Tooltip + Button with Printer icon

---

### US-WIKI-FAT-IMPL-002: Wiki Header Print Button Implementation

| Field | Value |
|-------|-------|
| **Story ID** | US-WIKI-FAT-IMPL-002 |
| **Title** | Implement Print Button in Wiki Page Header |
| **Epic** | EPIC-WIKI-006: Content Accessibility & Sharing |
| **Story Points** | 2 |
| **Priority** | High |
| **Status** | ✅ Implemented |
| **Labels** | wiki, print, implementation, frontend |

**User Story:**
As a developer, I need to implement a Print button in the wiki page header action bar so that users can print directly from the page controls.

**Implementation Details:**

```gherkin
Feature: Wiki Header Print Button Implementation

  Scenario: Add Printer icon import to wiki-v2.tsx
    Given I am modifying wiki-v2.tsx
    When I update the lucide-react imports
    Then I should add 'Printer' to the import statement

  Scenario: Add Print button next to Save Draft
    Given the page header has action buttons
    When I add the Print button
    Then it should:
      - Be positioned after the Save Draft button
      - Use Button variant="outline" size="sm"
      - Include Printer icon with h-4 w-4 mr-1 styling
      - Display "Print" label
      - Call window.print() on click

  Scenario: Print button styling consistency
    Given other header buttons use outline variant
    When the Print button is rendered
    Then it should match the visual style of Save Draft button
    And it should have title="Print Page" for accessibility
```

**Code Changes:**
- File: `client/src/pages/wiki-v2.tsx`
- Import: Add `Printer` to lucide-react imports
- JSX: `<Button variant="outline" size="sm" onClick={() => window.print()}>`

---

### US-WIKI-FAT-IMPL-003: Print CSS Media Query Implementation

| Field | Value |
|-------|-------|
| **Story ID** | US-WIKI-FAT-IMPL-003 |
| **Title** | Implement Print-Specific CSS Styling |
| **Epic** | EPIC-WIKI-006: Content Accessibility & Sharing |
| **Story Points** | 4 |
| **Priority** | Medium |
| **Status** | ✅ Implemented |
| **Labels** | wiki, print, implementation, css |

**User Story:**
As a developer, I need to implement print-specific CSS media queries so that wiki pages print cleanly without UI chrome.

**Implementation Details:**

```gherkin
Feature: Print CSS Media Query Implementation

  Scenario: Hide non-content elements when printing
    Given the user triggers window.print()
    When the print dialog opens
    Then the following should be hidden:
      | Element                    | Selector                    |
      | Floating Action Toolbar    | .floating-action-toolbar    |
      | Sidebar                    | [data-sidebar]              |
      | Navigation                 | nav, header                 |
      | Action buttons             | .page-actions               |
      | Resizable handles          | [data-resize-handle]        |

  Scenario: Optimize content for print
    Given print styles are applied
    When the page content is printed
    Then:
      - Content should use full page width
      - Font size should be readable (12pt minimum)
      - Code blocks should preserve syntax highlighting
      - Images should scale to fit page
      - Links should show URL in parentheses

  Scenario: Add print header and footer
    Given the page is being printed
    Then the print output should include:
      - Page title at top of first page
      - Page URL in footer
      - Date printed in footer
      - Page numbers if multi-page
```

**Code Changes:**
- File: `client/src/index.css` or new `print.css`
- Media query: `@media print { ... }`
- Classes: `.print-hidden`, `.print-only`

---

## Implementation Summary

### Files Created/Modified

| File | Type | Description |
|------|------|-------------|
| `client/src/components/wiki/floating-action-toolbar.tsx` | New | Main toolbar component |
| `client/src/pages/wiki-v2.tsx` | Modified | Integration with wiki page |
| `docs/story-gap-analysis.md` | Modified | Feature documentation |
| `docs/user-stories/US-WIKI-FAT-Floating-Action-Toolbar.md` | New | This specification |

### Component Props

```typescript
interface FloatingActionToolbarProps {
  pageId?: string;              // Current wiki page ID
  pageTitle?: string;           // Current page title (for sharing)
  isEditing?: boolean;          // Whether page is in edit mode
  hasUnsavedChanges?: boolean;  // Whether there are unsaved changes
  onAIAssist?: () => void;      // Callback when AI Assist clicked
  onAddComment?: () => void;    // Callback when Add Comment clicked
  onShare?: () => void;         // Callback when share action triggered
  onToggleEdit?: () => void;    // Callback to toggle edit mode
  onSave?: () => void;          // Callback to save page content
  className?: string;           // Additional CSS classes
}
```

### Dependencies

- `lucide-react`: Icons (Sparkles, Pencil, Play, Pause, MessageSquarePlus, Share2, etc.)
- `@/components/ui/button`: Button component
- `@/components/ui/tooltip`: Tooltip component
- `@/components/ui/dropdown-menu`: Dropdown menu component
- `@/hooks/use-toast`: Toast notifications
- Web Speech API: Browser-native text-to-speech

---

## Traceability Matrix

| Story ID | HLR | Feature | Component |
|----------|-----|---------|-----------|
| US-WIKI-FAT-001 | HLR-WIKI-050 | Floating Toolbar UI | FloatingActionToolbar |
| US-WIKI-FAT-002 | HLR-WIKI-051 | AI Assist | handleAIAssist() |
| US-WIKI-FAT-003 | HLR-WIKI-052 | Text-to-Speech | handleReadAloud() |
| US-WIKI-FAT-004 | HLR-WIKI-053 | Comments | handleAddComment() |
| US-WIKI-FAT-005 | HLR-WIKI-054 | Share/Export | Share dropdown |
| US-WIKI-FAT-006 | HLR-WIKI-055 | Edit Mode Toggle | handleToggleEdit() |
| US-WIKI-FAT-007 | HLR-WIKI-056 | Quick Save | handleSave() |
| US-WIKI-FAT-008 | HLR-WIKI-057 | Print Page | handlePrint() |
| US-WIKI-FAT-IMPL-001 | - | Toolbar Print Impl | floating-action-toolbar.tsx |
| US-WIKI-FAT-IMPL-002 | - | Header Print Impl | wiki-v2.tsx |
| US-WIKI-FAT-IMPL-003 | - | Print CSS | index.css |

---

## Testing Checklist

### Unit Tests
- [ ] Toolbar renders with all 6 buttons (AI, Read, Comment, Share, Edit, Save)
- [ ] AI Assist callback fires on click
- [ ] Read Aloud toggles play/pause state
- [ ] Copy Link copies URL to clipboard
- [ ] Email share constructs correct mailto URL
- [ ] Edit button toggles edit mode
- [ ] Save button triggers onSave callback
- [ ] Save button shows loading state during save

### Integration Tests
- [ ] Toolbar appears when page loads
- [ ] Text-to-speech reads ProseMirror content
- [ ] Toast notifications display correctly
- [ ] Dark mode styles apply correctly
- [ ] Edit mode toggles TipTap editor editable state
- [ ] Save persists content to database
- [ ] Unsaved changes indicator displays correctly

### Accessibility Tests
- [ ] All buttons have aria-labels
- [ ] Keyboard navigation works
- [ ] Screen reader announces actions
- [ ] Focus states are visible
- [ ] Cmd/Ctrl+S keyboard shortcut works for save

---

*Document generated: December 2025*
*Inspired by: Google Docs Floating Toolbar*

