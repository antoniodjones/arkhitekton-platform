-- Log Reference Code Defects 018-020
-- These were fixed in commit 0e088f9 but need defect records for traceability

-- DEF-REF-018: Promise chain ordering in templates-gallery.tsx
INSERT INTO defects (
  id, title, description, severity, priority, status, type,
  user_story_id, discovered_by, assigned_to, root_cause, resolution,
  steps_to_reproduce, expected_behavior, actual_behavior,
  affected_files, resolved_at, created_at, updated_at
) VALUES (
  'DEF-REF-018',
  'Promise Chain Error Handling in Templates Gallery',
  '**Module**: Google Docs Clone - Templates Gallery
**Impact**: Failed template creation shows success toast and attempts invalid navigation

The promise chain in `onTemplateClick` has `.catch()` placed after `.then()`, meaning `.catch()` only catches errors from the `.then()` callback, not from the original `create()` promise. When `create()` fails, it returns `undefined` to `.then()`, causing `router.push(undefined)` and showing "Document created" toast on failure.

**Code Location**: `CodeOptions/nextjs-google-docs-master/src/app/(home)/templates-gallery.tsx:26-32`

**Related to**: DEF-REF-001 through DEF-REF-005 (same promise chain pattern)',
  'medium',
  'medium',
  'resolved',
  'defect',
  'US-REF-CODE-001',
  'Code Review',
  'Platform Team',
  'Incorrect promise chain ordering: `.catch().then()` instead of `.then().catch()`.

**Why this happens:**
```typescript
// ❌ WRONG: .catch() before .then()
create({ title, initialContent })
  .catch(() => toast.error("Something went wrong"))  // Returns undefined
  .then((documentId) => {                            // Receives undefined on error
    toast.success("Document created")                // Shows success on failure!
    router.push(`/documents/${documentId}`);         // router.push(undefined)
  })
```

Promises pass rejection values to `.catch()`, but if `.catch()` is before `.then()`, it swallows the error and returns `undefined` to the next handler.',
  'Changed promise chain from `.catch().then()` to `.then().catch()`:

```typescript
// ✅ CORRECT
create({ title, initialContent })
  .then((documentId) => {
    toast.success("Document created")
    router.push(`/documents/${documentId}`);
  })
  .catch(() => toast.error("Something went wrong"))
  .finally(() => {
    setIsCreating(false);
  });
```

Now errors from `create()` skip `.then()` and go directly to `.catch()`.

**Fixed in commit**: 0e088f977f6feb6f234497188e0cdd4422143afc',
  ARRAY[
    '1. Trigger a template creation that fails (e.g., network error, backend validation)',
    '2. Observe that success toast appears',
    '3. Navigation attempts to /documents/undefined',
    '4. User sees confusing UI state'
  ]::text[],
  'Failed template creation should show error toast and NOT navigate',
  'Success toast appears and navigation is attempted with undefined ID',
  ARRAY['CodeOptions/nextjs-google-docs-master/src/app/(home)/templates-gallery.tsx']::text[],
  NOW(),
  NOW(),
  NOW()
),

-- DEF-REF-019: Invalid CSS var() syntax
(
  'DEF-REF-019',
  'Invalid CSS var() Syntax for Selected Cell Background',
  '**Module**: Google Docs Clone - Table Editor CSS
**Impact**: Table cell selection background color is invalid/transparent

Line 141 in `globals.css` uses `var(#959596)` which is invalid CSS syntax. The `var()` function expects a CSS custom property name (like `--color-name`), not a hex color value directly.

**Code Location**: `CodeOptions/nextjs-google-docs-master/src/app/globals.css:141`

**Affected Component**: `.selectedCell:after` pseudo-element for table cell selection highlighting',
  'low',
  'medium',
  'resolved',
  'defect',
  'US-REF-CODE-001',
  'Code Review',
  'Platform Team',
  'Misunderstanding of CSS `var()` function syntax. The `var()` function is for referencing CSS custom properties (CSS variables), not for wrapping raw color values.

**Invalid syntax:**
```css
.selectedCell:after {
  background: var(#959596);  /* ❌ Wrong: var() expects --variable-name */
}
```

**What `var()` actually does:**
```css
:root {
  --my-color: #959596;  /* Define custom property */
}
.element {
  background: var(--my-color);  /* ✅ Reference it with var() */
}
```',
  'Removed `var()` wrapper and used hex color directly:

```css
.selectedCell:after {
  background: #959596;  /* ✅ Direct hex value */
  content: "";
  left: 0; right: 0; top: 0; bottom: 0;
  pointer-events: none;
  position: absolute;
  z-index: 2;
}
```

**Fixed in commit**: 0e088f977f6feb6f234497188e0cdd4422143afc',
  ARRAY[
    '1. Open Google Docs clone document editor',
    '2. Insert a table',
    '3. Select a table cell',
    '4. Inspect the cell with browser DevTools',
    '5. Observe that `.selectedCell:after` has invalid `background` property',
    '6. Selection highlight may be transparent or not render'
  ]::text[],
  'Selected table cells should have a gray (#959596) background overlay',
  'Background property is invalid, resulting in no visible selection highlight',
  ARRAY['CodeOptions/nextjs-google-docs-master/src/app/globals.css']::text[],
  NOW(),
  NOW(),
  NOW()
),

-- DEF-REF-020: Operator precedence in toolbar heading button
(
  'DEF-REF-020',
  'Incorrect Operator Precedence in Heading Button Highlight',
  '**Module**: Google Docs Clone - Toolbar Heading Level Button
**Impact**: Heading level button highlight state is incorrect due to operator precedence

The conditional expression at line 500 is missing parentheses around the `||` operator. Without parentheses, the `&&` operator binds tighter than `||`, causing incorrect evaluation.

**Code Location**: `CodeOptions/nextjs-google-docs-master/src/app/documents/[documentId]/toolbar.tsx:500`

**Current (broken) evaluation:**
```typescript
// ❌ Evaluates as: (value === 0 && !editor?.isActive("heading")) || (editor?.isActive("heading", { level: value }) && "bg-neutral-200/80")
(value === 0 && !editor?.isActive("heading")) || editor?.isActive("heading", { level: value }) && "bg-neutral-200/80"
```

**Intended evaluation:**
```typescript
// ✅ Evaluates as: ((value === 0 && !editor?.isActive("heading")) || editor?.isActive("heading", { level: value })) && "bg-neutral-200/80"
((value === 0 && !editor?.isActive("heading")) || editor?.isActive("heading", { level: value })) && "bg-neutral-200/80"
```',
  'low',
  'medium',
  'resolved',
  'defect',
  'US-REF-CODE-001',
  'Code Review',
  'Platform Team',
  'JavaScript operator precedence: `&&` has higher precedence than `||`, so the expression is evaluated incorrectly without explicit parentheses.

**Operator precedence (high to low):**
1. `&&` (AND)
2. `||` (OR)

**What was happening:**
```typescript
// Without parens:
(value === 0 && !editor?.isActive("heading")) || editor?.isActive("heading", { level: value }) && "bg-neutral-200/80"

// JavaScript evaluates as:
(value === 0 && !editor?.isActive("heading")) 
|| 
(editor?.isActive("heading", { level: value }) && "bg-neutral-200/80")
```

This means the className is only added when BOTH heading is active AND level matches, but the first condition alone can make it truthy without adding the class.',
  'Added explicit parentheses to enforce correct evaluation order:

```typescript
className={cn(
  "flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-200/80",
  ((value === 0 && !editor?.isActive("heading")) || editor?.isActive("heading", { level: value })) && "bg-neutral-200/80"
)}
```

Now the button is highlighted when EITHER:
- `value === 0` AND no heading is active (Normal text)
- OR heading is active with matching level (H1, H2, etc.)

**Fixed in commit**: 0e088f977f6feb6f234497188e0cdd4422143afc',
  ARRAY[
    '1. Open Google Docs clone document editor',
    '2. Select text and apply Heading 1 (H1)',
    '3. Open the Heading Level dropdown in toolbar',
    '4. Observe that H1 button may not highlight correctly',
    '5. Try switching between Normal text and headings',
    '6. Button highlight state is inconsistent'
  ]::text[],
  'The heading button should highlight when the selected text matches that heading level, or when "Normal" is selected and no heading is active',
  'Button highlight state is incorrect due to operator precedence causing wrong boolean evaluation',
  ARRAY['CodeOptions/nextjs-google-docs-master/src/app/documents/[documentId]/toolbar.tsx']::text[],
  NOW(),
  NOW(),
  NOW()
);

-- Verify insertions
SELECT 
  id,
  title,
  severity,
  status,
  LEFT(resolution, 50) || '...' as resolution_preview
FROM defects
WHERE id IN ('DEF-REF-018', 'DEF-REF-019', 'DEF-REF-020')
ORDER BY id;

