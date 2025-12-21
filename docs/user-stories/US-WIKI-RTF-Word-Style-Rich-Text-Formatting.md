# Word-Style Rich Text Formatting Toolbar - User Stories

## Overview

| Field | Value |
|-------|-------|
| **Epic ID** | EPIC-WIKI-007 |
| **Epic Name** | Word-Style Rich Text Formatting Toolbar |
| **Module** | Knowledge Core (Wiki) |
| **Priority** | High |
| **Story Count** | 14 stories |
| **Total Story Points** | 58 |

## Feature Vision

Transform the ARKHITEKTON wiki editor into a professional-grade document authoring experience that matches the familiarity and power of Microsoft Word. Enterprise users expect the formatting controls they know from desktop applications - providing this reduces the learning curve, increases adoption, and enables creation of publication-quality documentation.

## Feature Strategy

1. **Phase 1 - Core Formatting (Complete)**: Text alignment, indent/outdent, subscript/superscript
2. **Phase 2 - Advanced Controls (Complete)**: Change case, clear formatting, highlight colors
3. **Phase 3 - Productivity Features (Complete)**: Format painter, style presets, font size dropdown
4. **Phase 4 - Future**: Tables, columns, section breaks, page layout

---

## User Stories

### US-WIKI-RTF-001: Text Alignment Controls

| Field | Value |
|-------|-------|
| **Story ID** | US-WIKI-RTF-001 |
| **Title** | Text Alignment Controls |
| **Epic** | EPIC-WIKI-007: Word-Style Rich Text Formatting |
| **Story Points** | 5 |
| **Priority** | High |
| **Status** | Done |
| **Labels** | wiki, formatting, alignment, toolbar |

**User Story:**
As a wiki author, I want to align text left, center, right, or justified so that I can create professionally formatted documents with proper visual structure.

**Acceptance Criteria:**

```gherkin
Feature: Text Alignment Controls

  Background:
    Given I am editing a wiki page
    And the formatting toolbar is visible

  Scenario: Display alignment buttons in toolbar
    When I look at the formatting toolbar
    Then I should see Left Align button with AlignLeft icon
    And I should see Center Align button with AlignCenter icon
    And I should see Right Align button with AlignRight icon
    And I should see Justify button with AlignJustify icon

  Scenario: Left align paragraph
    Given I have cursor in a paragraph
    When I click the Left Align button
    Then the paragraph should align to the left
    And the Left Align button should appear pressed/active

  Scenario: Center align paragraph
    Given I have cursor in a paragraph
    When I click the Center Align button
    Then the paragraph should be centered horizontally
    And the Center Align button should appear pressed/active

  Scenario: Right align paragraph
    Given I have cursor in a paragraph
    When I click the Right Align button
    Then the paragraph should align to the right
    And the Right Align button should appear pressed/active

  Scenario: Justify paragraph
    Given I have cursor in a paragraph
    When I click the Justify button
    Then the paragraph should stretch to fill the full width
    And the Justify button should appear pressed/active

  Scenario: Keyboard shortcuts for alignment
    Given I have cursor in a paragraph
    When I press "Ctrl+Shift+L"
    Then the paragraph should left align
    When I press "Ctrl+Shift+E"
    Then the paragraph should center align
    When I press "Ctrl+Shift+R"
    Then the paragraph should right align
    When I press "Ctrl+Shift+J"
    Then the paragraph should justify

  Scenario: Alignment persists on save
    Given I have centered a paragraph
    When I save the wiki page
    And I reload the page
    Then the paragraph should still be centered
```

**Technical Implementation:**
- Extension: `TextAlignExtension` in `extensions/text-align.ts`
- Commands: `setTextAlign('left'|'center'|'right'|'justify')`, `unsetTextAlign()`
- Applies to: Paragraph and Heading nodes
- CSS: `text-align` style attribute

---

### US-WIKI-RTF-002: Paragraph Indentation Controls

| Field | Value |
|-------|-------|
| **Story ID** | US-WIKI-RTF-002 |
| **Title** | Paragraph Indentation Controls |
| **Epic** | EPIC-WIKI-007: Word-Style Rich Text Formatting |
| **Story Points** | 4 |
| **Priority** | High |
| **Status** | Done |
| **Labels** | wiki, formatting, indent, toolbar |

**User Story:**
As a wiki author, I want to indent and outdent paragraphs so that I can create visual hierarchy and structure in my documents.

**Acceptance Criteria:**

```gherkin
Feature: Paragraph Indentation Controls

  Background:
    Given I am editing a wiki page
    And the formatting toolbar is visible

  Scenario: Display indent buttons in toolbar
    When I look at the formatting toolbar
    Then I should see an Increase Indent button with Indent icon
    And I should see a Decrease Indent button with Outdent icon

  Scenario: Increase paragraph indent
    Given I have cursor in a paragraph with no indent
    When I click the Increase Indent button
    Then the paragraph should move 24 pixels to the right
    And the indent level should be 1

  Scenario: Multiple indent levels
    Given I have cursor in a paragraph with indent level 1
    When I click the Increase Indent button
    Then the paragraph should move another 24 pixels to the right
    And the indent level should be 2

  Scenario: Maximum indent level
    Given I have cursor in a paragraph with indent level 10
    When I click the Increase Indent button
    Then the indent level should remain at 10
    And no further indentation should occur

  Scenario: Decrease paragraph indent
    Given I have cursor in a paragraph with indent level 2
    When I click the Decrease Indent button
    Then the paragraph should move 24 pixels to the left
    And the indent level should be 1

  Scenario: Cannot outdent below zero
    Given I have cursor in a paragraph with no indent
    When I click the Decrease Indent button
    Then nothing should happen
    And the paragraph should remain at the left margin

  Scenario: Keyboard shortcuts for indent
    Given I have cursor in a paragraph
    When I press "Tab"
    Then the paragraph should increase indent by one level
    When I press "Shift+Tab"
    Then the paragraph should decrease indent by one level
```

**Technical Implementation:**
- Extension: `IndentExtension` in `extensions/indent.ts`
- Commands: `indent()`, `outdent()`, `setIndent(level)`, `unsetIndent()`
- Config: `minIndent: 0`, `maxIndent: 10`, `indentUnit: 24px`
- CSS: `margin-left` style attribute

---

### US-WIKI-RTF-003: Subscript Text Formatting

| Field | Value |
|-------|-------|
| **Story ID** | US-WIKI-RTF-003 |
| **Title** | Subscript Text Formatting |
| **Epic** | EPIC-WIKI-007: Word-Style Rich Text Formatting |
| **Story Points** | 3 |
| **Priority** | Medium |
| **Status** | Done |
| **Labels** | wiki, formatting, subscript, toolbar |

**User Story:**
As a wiki author documenting technical or scientific content, I want to format text as subscript so that I can write chemical formulas (H₂O) and mathematical expressions correctly.

**Acceptance Criteria:**

```gherkin
Feature: Subscript Text Formatting

  Background:
    Given I am editing a wiki page
    And the formatting toolbar is visible

  Scenario: Display subscript button in toolbar
    When I look at the text formatting section
    Then I should see a Subscript button with Subscript icon
    And hovering should show tooltip "Subscript (Ctrl+,)"

  Scenario: Apply subscript to selected text
    Given I have selected the text "2" in "H2O"
    When I click the Subscript button
    Then "2" should render as subscript: H₂O
    And the Subscript button should appear pressed/active

  Scenario: Toggle subscript off
    Given I have subscript text selected
    When I click the Subscript button
    Then the text should return to normal baseline
    And the Subscript button should no longer be pressed

  Scenario: Keyboard shortcut for subscript
    Given I have text selected
    When I press "Ctrl+,"
    Then the selected text should toggle subscript formatting

  Scenario: Subscript and superscript are mutually exclusive
    Given I have superscript text selected
    When I apply subscript
    Then the superscript should be removed
    And the text should become subscript
```

**Technical Implementation:**
- Extension: `SubscriptExtension` in `extensions/subscript.ts`
- Mark type: `<sub>` HTML element
- Commands: `setSubscript()`, `toggleSubscript()`, `unsetSubscript()`
- Keyboard: `Mod-,`

---

### US-WIKI-RTF-004: Superscript Text Formatting

| Field | Value |
|-------|-------|
| **Story ID** | US-WIKI-RTF-004 |
| **Title** | Superscript Text Formatting |
| **Epic** | EPIC-WIKI-007: Word-Style Rich Text Formatting |
| **Story Points** | 3 |
| **Priority** | Medium |
| **Status** | Done |
| **Labels** | wiki, formatting, superscript, toolbar |

**User Story:**
As a wiki author documenting technical or scientific content, I want to format text as superscript so that I can write exponents (x²), footnote references, and trademark symbols (™) correctly.

**Acceptance Criteria:**

```gherkin
Feature: Superscript Text Formatting

  Background:
    Given I am editing a wiki page
    And the formatting toolbar is visible

  Scenario: Display superscript button in toolbar
    When I look at the text formatting section
    Then I should see a Superscript button with Superscript icon
    And hovering should show tooltip "Superscript (Ctrl+.)"

  Scenario: Apply superscript to selected text
    Given I have selected the text "2" in "x2"
    When I click the Superscript button
    Then "2" should render as superscript: x²
    And the Superscript button should appear pressed/active

  Scenario: Toggle superscript off
    Given I have superscript text selected
    When I click the Superscript button
    Then the text should return to normal baseline
    And the Superscript button should no longer be pressed

  Scenario: Keyboard shortcut for superscript
    Given I have text selected
    When I press "Ctrl+."
    Then the selected text should toggle superscript formatting
```

**Technical Implementation:**
- Extension: `SuperscriptExtension` in `extensions/superscript.ts`
- Mark type: `<sup>` HTML element
- Commands: `setSuperscript()`, `toggleSuperscript()`, `unsetSuperscript()`
- Keyboard: `Mod-.`

---

### US-WIKI-RTF-005: Change Text Case

| Field | Value |
|-------|-------|
| **Story ID** | US-WIKI-RTF-005 |
| **Title** | Change Text Case |
| **Epic** | EPIC-WIKI-007: Word-Style Rich Text Formatting |
| **Story Points** | 4 |
| **Priority** | Medium |
| **Status** | Done |
| **Labels** | wiki, formatting, case, toolbar |

**User Story:**
As a wiki author, I want to quickly change the case of selected text so that I can fix capitalization errors or apply consistent styling without retyping.

**Acceptance Criteria:**

```gherkin
Feature: Change Text Case

  Background:
    Given I am editing a wiki page
    And the formatting toolbar is visible

  Scenario: Display change case dropdown in toolbar
    When I look at the formatting toolbar
    Then I should see a Change Case dropdown button
    And it should display the CaseSensitive icon

  Scenario: Open change case menu
    When I click the Change Case dropdown
    Then I should see the following options:
      | Option         |
      | UPPERCASE      |
      | lowercase      |
      | Title Case     |
      | Sentence case  |

  Scenario: Convert to uppercase
    Given I have selected the text "hello world"
    When I click Change Case > UPPERCASE
    Then the text should become "HELLO WORLD"

  Scenario: Convert to lowercase
    Given I have selected the text "HELLO WORLD"
    When I click Change Case > lowercase
    Then the text should become "hello world"

  Scenario: Convert to title case
    Given I have selected the text "hello world example"
    When I click Change Case > Title Case
    Then the text should become "Hello World Example"

  Scenario: Convert to sentence case
    Given I have selected the text "HELLO WORLD EXAMPLE"
    When I click Change Case > Sentence case
    Then the text should become "Hello world example"

  Scenario: No selection shows no effect
    Given I have no text selected
    When I click Change Case > UPPERCASE
    Then nothing should change
```

**Technical Implementation:**
- Function: `changeCase(caseType: 'upper'|'lower'|'title'|'sentence')`
- Uses selection text manipulation via ProseMirror transaction
- Preserves formatting marks on the text

---

### US-WIKI-RTF-006: Clear All Formatting

| Field | Value |
|-------|-------|
| **Story ID** | US-WIKI-RTF-006 |
| **Title** | Clear All Formatting |
| **Epic** | EPIC-WIKI-007: Word-Style Rich Text Formatting |
| **Story Points** | 3 |
| **Priority** | High |
| **Status** | Done |
| **Labels** | wiki, formatting, clear, toolbar |

**User Story:**
As a wiki author, I want to quickly remove all formatting from selected text so that I can start fresh or clean up pasted content.

**Acceptance Criteria:**

```gherkin
Feature: Clear All Formatting

  Background:
    Given I am editing a wiki page
    And the formatting toolbar is visible

  Scenario: Display clear formatting button in toolbar
    When I look at the formatting toolbar
    Then I should see a Clear Formatting button
    And it should display the RemoveFormatting icon

  Scenario: Clear formatting removes all marks
    Given I have selected text with:
      | Format     |
      | Bold       |
      | Italic     |
      | Underline  |
      | Highlight  |
      | Color      |
    When I click the Clear Formatting button
    Then all marks should be removed
    And the text should be plain/unstyled

  Scenario: Clear formatting removes text styles
    Given I have selected text with:
      | Style       |
      | Font Size   |
      | Font Family |
      | Text Color  |
    When I click the Clear Formatting button
    Then the text should reset to default styles

  Scenario: Clear formatting removes alignment
    Given I have a centered paragraph selected
    When I click the Clear Formatting button
    Then the paragraph should reset to left alignment

  Scenario: Clear formatting removes indentation
    Given I have an indented paragraph selected
    When I click the Clear Formatting button
    Then the paragraph should reset to no indentation
```

**Technical Implementation:**
- Function: `clearFormatting()`
- Calls: `unsetAllMarks()`, `clearNodes()`, `unsetFontSize()`, `unsetFontFamily()`, `unsetColor()`, `unsetTextAlign()`, `unsetIndent()`

---

### US-WIKI-RTF-007: Highlight Color Picker

| Field | Value |
|-------|-------|
| **Story ID** | US-WIKI-RTF-007 |
| **Title** | Highlight Color Picker |
| **Epic** | EPIC-WIKI-007: Word-Style Rich Text Formatting |
| **Story Points** | 4 |
| **Priority** | Medium |
| **Status** | Done |
| **Labels** | wiki, formatting, highlight, colors, toolbar |

**User Story:**
As a wiki author, I want to highlight text with different colors so that I can visually categorize and emphasize different types of information.

**Acceptance Criteria:**

```gherkin
Feature: Highlight Color Picker

  Background:
    Given I am editing a wiki page
    And the formatting toolbar is visible

  Scenario: Display highlight color picker in toolbar
    When I look at the formatting toolbar
    Then I should see a Highlight button with color indicator
    And the indicator should show the current/default highlight color

  Scenario: Open highlight color picker
    When I click the Highlight button
    Then a popover should open
    And I should see a grid of highlight colors:
      | Color  | Hex     |
      | Yellow | #fef08a |
      | Green  | #bbf7d0 |
      | Blue   | #bfdbfe |
      | Pink   | #fbcfe8 |
      | Orange | #fed7aa |
      | Purple | #e9d5ff |
      | Red    | #fecaca |
      | Cyan   | #a5f3fc |
    And I should see a "Remove Highlight" button

  Scenario: Apply highlight color to text
    Given I have text selected
    When I open the Highlight picker
    And I click the Yellow color
    Then the selected text should have a yellow background
    And the picker should close

  Scenario: Change highlight color
    Given I have yellow-highlighted text selected
    When I open the Highlight picker
    And I click the Blue color
    Then the highlight should change to blue

  Scenario: Remove highlight
    Given I have highlighted text selected
    When I open the Highlight picker
    And I click "Remove Highlight"
    Then the highlight should be removed
    And the text should have no background color

  Scenario: Selected color shows ring indicator
    Given I have text with blue highlight selected
    When I open the Highlight picker
    Then the Blue color button should show a ring/border indicator
```

**Technical Implementation:**
- Uses TipTap `Highlight` extension with `multicolor: true`
- Color palette: 8 pastel highlight colors
- Popover UI with color grid
- Remove button calls `unsetHighlight()`

---

### US-WIKI-RTF-008: Font Size Dropdown

| Field | Value |
|-------|-------|
| **Story ID** | US-WIKI-RTF-008 |
| **Title** | Font Size Dropdown with Increment Controls |
| **Epic** | EPIC-WIKI-007: Word-Style Rich Text Formatting |
| **Story Points** | 4 |
| **Priority** | High |
| **Status** | Done |
| **Labels** | wiki, formatting, font-size, toolbar |

**User Story:**
As a wiki author, I want to select font sizes from a dropdown or use increment buttons so that I can precisely control text sizing like in Word.

**Acceptance Criteria:**

```gherkin
Feature: Font Size Dropdown with Increment Controls

  Background:
    Given I am editing a wiki page
    And the formatting toolbar is visible

  Scenario: Display font size controls in toolbar
    When I look at the formatting toolbar
    Then I should see a "-" decrease button
    And I should see a font size dropdown showing current size
    And I should see a "+" increase button

  Scenario: Open font size dropdown
    When I click the font size dropdown
    Then I should see a scrollable list of sizes:
      | 8 | 9 | 10 | 11 | 12 | 14 | 16 | 18 | 20 | 24 | 28 | 32 | 36 | 48 | 72 |

  Scenario: Select font size from dropdown
    Given I have text selected
    When I open the font size dropdown
    And I click "24"
    Then the selected text should be 24px
    And the dropdown should show "24"

  Scenario: Increase font size with button
    Given I have text at size 16 selected
    When I click the "+" button
    Then the text size should become 17px
    And the dropdown should show "17"

  Scenario: Decrease font size with button
    Given I have text at size 16 selected
    When I click the "-" button
    Then the text size should become 15px
    And the dropdown should show "15"

  Scenario: Minimum font size limit
    Given I have text at size 8 selected
    When I click the "-" button
    Then the text size should remain 8px

  Scenario: Maximum font size limit
    Given I have text at size 72 selected
    When I click the "+" button
    Then the text size should remain 72px

  Scenario: Current selection size indicator
    Given the dropdown shows "16" as default
    When I select text that is 24px
    Then the dropdown should update to show "24"
```

**Technical Implementation:**
- Uses existing `FontSizeExtension`
- Dropdown shows predefined sizes array
- +/- buttons increment by 1px
- Limits: min 8px, max 72px

---

### US-WIKI-RTF-009: Format Painter

| Field | Value |
|-------|-------|
| **Story ID** | US-WIKI-RTF-009 |
| **Title** | Format Painter |
| **Epic** | EPIC-WIKI-007: Word-Style Rich Text Formatting |
| **Story Points** | 5 |
| **Priority** | High |
| **Status** | Done |
| **Labels** | wiki, formatting, format-painter, productivity, toolbar |

**User Story:**
As a wiki author, I want to copy formatting from one text selection and apply it to another so that I can quickly maintain consistent styling throughout my document.

**Acceptance Criteria:**

```gherkin
Feature: Format Painter

  Background:
    Given I am editing a wiki page
    And the formatting toolbar is visible

  Scenario: Display format painter button in toolbar
    When I look at the formatting toolbar
    Then I should see a Format Painter button with Paintbrush icon
    And it should appear in normal/unpressed state

  Scenario: Activate format painter
    Given I have styled text selected (bold, italic, red, 18px)
    When I click the Format Painter button
    Then the button should become active/pressed
    And the button should have a distinctive color (primary)
    And the stored format should include:
      | Property   | Value    |
      | bold       | true     |
      | italic     | true     |
      | color      | red      |
      | fontSize   | 18px     |

  Scenario: Apply copied format to new selection
    Given the format painter is active with stored formatting
    When I select different text
    Then the stored formatting should be applied to the new text
    And the format painter should deactivate
    And the button should return to normal state

  Scenario: Cancel format painter
    Given the format painter is active
    When I click the Format Painter button again
    Then the format painter should deactivate
    And no formatting should be applied
    And the stored format should be cleared

  Scenario: Format painter copies all marks
    Given I have text with:
      | Mark        |
      | Bold        |
      | Italic      |
      | Underline   |
      | Strike      |
      | Highlight   |
      | Subscript   |
      | Superscript |
    When I activate format painter
    Then all marks should be stored for application

  Scenario: Visual feedback while active
    Given the format painter is active
    Then the button should be visually distinct
    And the cursor should indicate paint mode (if possible)
```

**Technical Implementation:**
- State: `formatPainterActive`, `storedFormat`
- Function: `copyFormat()` - captures current marks and styles
- Function: `applyFormat()` - applies stored marks to new selection
- Uses `editor.on('selectionUpdate')` to trigger application

---

### US-WIKI-RTF-010: Style Presets

| Field | Value |
|-------|-------|
| **Story ID** | US-WIKI-RTF-010 |
| **Title** | Style Presets Dropdown |
| **Epic** | EPIC-WIKI-007: Word-Style Rich Text Formatting |
| **Story Points** | 5 |
| **Priority** | Medium |
| **Status** | Done |
| **Labels** | wiki, formatting, styles, presets, toolbar |

**User Story:**
As a wiki author, I want to apply predefined style presets so that I can quickly format text consistently without manually setting each attribute.

**Acceptance Criteria:**

```gherkin
Feature: Style Presets Dropdown

  Background:
    Given I am editing a wiki page
    And the formatting toolbar is visible

  Scenario: Display style presets dropdown in toolbar
    When I look at the formatting toolbar
    Then I should see a "Styles" dropdown button
    And it should have a Sparkles icon

  Scenario: Open style presets menu
    When I click the Styles dropdown
    Then I should see the following presets:
      | Preset     | Preview Style              |
      | Normal     | 16px, normal weight        |
      | Title      | 28px, bold                 |
      | Heading 1  | 24px, bold                 |
      | Heading 2  | 20px, bold                 |
      | Subtitle   | 14px, gray color           |
      | Quote      | 14px, gray, italic         |
      | Code       | 13px, monospace, pink      |

  Scenario: Apply Normal style
    Given I have formatted text selected
    When I click Styles > Normal
    Then the text should reset to 16px normal weight
    And previous formatting should be cleared

  Scenario: Apply Title style
    Given I have text selected
    When I click Styles > Title
    Then the text should become 28px bold

  Scenario: Apply Quote style
    Given I have text selected
    When I click Styles > Quote
    Then the text should become 14px, gray, and italic

  Scenario: Apply Code style
    Given I have text selected
    When I click Styles > Code
    Then the text should become 13px
    And use Courier New font
    And have pink/magenta color

  Scenario: Preset menu shows styled previews
    When I open the Styles dropdown
    Then each menu item should display in its own style
    And users can visually preview how the style looks
```

**Technical Implementation:**
- Constant: `STYLE_PRESETS` array with style definitions
- Function: `applyStylePreset(preset)`
- Clears existing marks before applying
- Menu items styled with inline styles matching preset

---

### US-WIKI-RTF-IMPL-001: TextAlign Extension Implementation

| Field | Value |
|-------|-------|
| **Story ID** | US-WIKI-RTF-IMPL-001 |
| **Title** | Implement TextAlign TipTap Extension |
| **Epic** | EPIC-WIKI-007: Word-Style Rich Text Formatting |
| **Story Points** | 3 |
| **Priority** | High |
| **Status** | Done |
| **Labels** | wiki, implementation, tiptap, extension |

**Implementation Details:**

```gherkin
Feature: TextAlign Extension Implementation

  Scenario: Create extension file
    Given I am creating extensions/text-align.ts
    Then it should export TextAlignExtension
    And extend from TipTap Extension

  Scenario: Define commands
    Given the extension is created
    Then it should provide commands:
      | Command        | Parameter                    |
      | setTextAlign   | 'left'|'center'|'right'|'justify' |
      | unsetTextAlign | none                         |

  Scenario: Define global attributes
    Given the extension is created
    Then it should add textAlign attribute to:
      | Node Type |
      | paragraph |
      | heading   |

  Scenario: Define keyboard shortcuts
    Given the extension is created
    Then it should register shortcuts:
      | Shortcut     | Action           |
      | Mod-Shift-l  | setTextAlign left    |
      | Mod-Shift-e  | setTextAlign center  |
      | Mod-Shift-r  | setTextAlign right   |
      | Mod-Shift-j  | setTextAlign justify |
```

**File:** `client/src/components/wiki/extensions/text-align.ts`

---

### US-WIKI-RTF-IMPL-002: Indent Extension Implementation

| Field | Value |
|-------|-------|
| **Story ID** | US-WIKI-RTF-IMPL-002 |
| **Title** | Implement Indent TipTap Extension |
| **Epic** | EPIC-WIKI-007: Word-Style Rich Text Formatting |
| **Story Points** | 4 |
| **Priority** | High |
| **Status** | Done |
| **Labels** | wiki, implementation, tiptap, extension |

**Implementation Details:**

```gherkin
Feature: Indent Extension Implementation

  Scenario: Create extension file
    Given I am creating extensions/indent.ts
    Then it should export IndentExtension
    And extend from TipTap Extension

  Scenario: Define commands
    Given the extension is created
    Then it should provide commands:
      | Command     | Description                    |
      | indent      | Increase indent by 1 level     |
      | outdent     | Decrease indent by 1 level     |
      | setIndent   | Set specific indent level      |
      | unsetIndent | Reset to no indentation        |

  Scenario: Define options
    Given the extension is created
    Then it should have options:
      | Option     | Value |
      | minIndent  | 0     |
      | maxIndent  | 10    |
      | indentUnit | 24px  |

  Scenario: Define keyboard shortcuts
    Given the extension is created
    Then it should register shortcuts:
      | Shortcut   | Action  |
      | Tab        | indent  |
      | Shift-Tab  | outdent |
```

**File:** `client/src/components/wiki/extensions/indent.ts`

---

### US-WIKI-RTF-IMPL-003: Subscript/Superscript Extensions

| Field | Value |
|-------|-------|
| **Story ID** | US-WIKI-RTF-IMPL-003 |
| **Title** | Implement Subscript and Superscript Extensions |
| **Epic** | EPIC-WIKI-007: Word-Style Rich Text Formatting |
| **Story Points** | 3 |
| **Priority** | Medium |
| **Status** | Done |
| **Labels** | wiki, implementation, tiptap, extension, marks |

**Implementation Details:**

```gherkin
Feature: Subscript and Superscript Extensions

  Scenario: Create Subscript extension
    Given I am creating extensions/subscript.ts
    Then it should export SubscriptExtension
    And extend from TipTap Mark

  Scenario: Subscript HTML rendering
    Given the extension is created
    Then it should render as <sub> element
    And parse <sub> elements from HTML

  Scenario: Create Superscript extension
    Given I am creating extensions/superscript.ts
    Then it should export SuperscriptExtension
    And extend from TipTap Mark

  Scenario: Superscript HTML rendering
    Given the extension is created
    Then it should render as <sup> element
    And parse <sup> elements from HTML

  Scenario: Keyboard shortcuts
    Given both extensions are created
    Then Subscript should use Mod-,
    And Superscript should use Mod-.
```

**Files:**
- `client/src/components/wiki/extensions/subscript.ts`
- `client/src/components/wiki/extensions/superscript.ts`

---

### US-WIKI-RTF-IMPL-004: Toolbar Integration

| Field | Value |
|-------|-------|
| **Story ID** | US-WIKI-RTF-IMPL-004 |
| **Title** | Integrate New Controls into Toolbar |
| **Epic** | EPIC-WIKI-007: Word-Style Rich Text Formatting |
| **Story Points** | 8 |
| **Priority** | High |
| **Status** | Done |
| **Labels** | wiki, implementation, toolbar, ui |

**Implementation Details:**

```gherkin
Feature: Toolbar Integration

  Scenario: Import new extensions
    Given I am editing tiptap-editor.tsx
    When I update imports
    Then I should import:
      | Extension           |
      | TextAlignExtension  |
      | IndentExtension     |
      | SubscriptExtension  |
      | SuperscriptExtension|

  Scenario: Import new icons
    Given I am updating lucide-react imports
    Then I should import:
      | Icon            |
      | AlignLeft       |
      | AlignCenter     |
      | AlignRight      |
      | AlignJustify    |
      | Indent          |
      | Outdent         |
      | Subscript       |
      | Superscript     |
      | CaseSensitive   |
      | RemoveFormatting|
      | Paintbrush      |
      | Sparkles        |

  Scenario: Register extensions with editor
    Given the editor is configured
    Then I should add to extensions array:
      | Extension            |
      | TextAlignExtension   |
      | IndentExtension      |
      | SubscriptExtension   |
      | SuperscriptExtension |

  Scenario: Add toolbar button groups
    Given the toolbar JSX is rendered
    Then I should add sections for:
      | Section           | Buttons                           |
      | Format Painter    | Paintbrush, Clear Formatting      |
      | Style Presets     | Styles dropdown                   |
      | Change Case       | Case dropdown                     |
      | Text Formatting   | +Sub, +Super, +Highlight picker   |
      | Alignment         | Left, Center, Right, Justify      |
      | Indentation       | Outdent, Indent                   |
      | Font Size         | -, Dropdown, +                    |
```

**File:** `client/src/components/wiki/tiptap-editor.tsx`

---

## Implementation Summary

| Story ID | Component | Points | Status |
|----------|-----------|--------|--------|
| US-WIKI-RTF-001 | Text Alignment | 5 | Done |
| US-WIKI-RTF-002 | Indentation | 4 | Done |
| US-WIKI-RTF-003 | Subscript | 3 | Done |
| US-WIKI-RTF-004 | Superscript | 3 | Done |
| US-WIKI-RTF-005 | Change Case | 4 | Done |
| US-WIKI-RTF-006 | Clear Formatting | 3 | Done |
| US-WIKI-RTF-007 | Highlight Colors | 4 | Done |
| US-WIKI-RTF-008 | Font Size Dropdown | 4 | Done |
| US-WIKI-RTF-009 | Format Painter | 5 | Done |
| US-WIKI-RTF-010 | Style Presets | 5 | Done |
| US-WIKI-RTF-IMPL-001 | TextAlign Extension | 3 | Done |
| US-WIKI-RTF-IMPL-002 | Indent Extension | 4 | Done |
| US-WIKI-RTF-IMPL-003 | Sub/Super Extensions | 3 | Done |
| US-WIKI-RTF-IMPL-004 | Toolbar Integration | 8 | Done |
| **Total** | | **58** | |

## Traceability Matrix

| User Story | Extension File | Toolbar Section | Keyboard Shortcut |
|------------|----------------|-----------------|-------------------|
| US-WIKI-RTF-001 | text-align.ts | Alignment | Ctrl+Shift+L/E/R/J |
| US-WIKI-RTF-002 | indent.ts | Indentation | Tab, Shift+Tab |
| US-WIKI-RTF-003 | subscript.ts | Text Formatting | Ctrl+, |
| US-WIKI-RTF-004 | superscript.ts | Text Formatting | Ctrl+. |
| US-WIKI-RTF-005 | - (function) | Change Case | - |
| US-WIKI-RTF-006 | - (function) | Format Painter | - |
| US-WIKI-RTF-007 | highlight (config) | Text Formatting | - |
| US-WIKI-RTF-008 | font-size.ts | Font Size | - |
| US-WIKI-RTF-009 | - (state) | Format Painter | - |
| US-WIKI-RTF-010 | - (constant) | Style Presets | - |

