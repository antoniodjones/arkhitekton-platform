# ARKHITEKTON Design System

> **Version:** 1.0  
> **Last Updated:** December 2025  
> **Status:** Active

---

## Core Philosophy

> *"Information density with breathing room. Every pixel serves clarity and decision-making for enterprise architects."*

The ARKHITEKTON design system draws inspiration from:
- **Linear's typography** — Clean, functional, developer-focused
- **Stripe's restraint** — Purposeful use of color and whitespace
- **Material Design's data visualization** — Clear hierarchy for complex information

The result: Enterprise-grade sophistication with bold amber accents.

---

## 1. Color System

### 1.1 Brand Colors

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| `brand-primary` | #F97316 | 249, 115, 22 | Primary actions, logo, key CTAs |
| `brand-secondary` | #F59E0B | 245, 158, 11 | Gradient end, hover states, accents |
| `brand-gradient` | #F97316 → #F59E0B | — | Buttons, hero elements, badges |

### 1.2 Semantic Colors

These colors maintain consistent meaning across light and dark modes.

| Token | Hex | Usage |
|-------|-----|-------|
| `success` | #4ADE80 | Validation pass, completion, positive states |
| `warning` | #FBBF24 | Caution, pending, attention needed |
| `error` | #EF4444 | Errors, destructive actions, critical issues |
| `info` | #60A5FA | Information, links, neutral highlights |
| `ai-purple` | #9F7AEA | AI features, agent indicators, processing |

### 1.3 Dark Mode (Default Application Theme)

Dark mode is the **default** theme for ARKHITEKTON, providing reduced eye strain during extended architecture sessions.

| Token | Hex | Usage |
|-------|-----|-------|
| `bg-primary` | #0A0A0A | Main application background |
| `bg-secondary` | #111111 | Subtle separation, alternate rows |
| `bg-surface` | #1A1A1A | Cards, modals, elevated surfaces |
| `bg-elevated` | #242424 | Popovers, dropdowns, tooltips |
| `border-subtle` | #2A2A2A | Card borders, dividers |
| `border-default` | #3A3A3A | Input borders, separators |
| `border-focus` | #F97316 | Focus rings, active states |
| `text-primary` | #FAFAFA | Headlines, primary content |
| `text-secondary` | #A1A1A1 | Descriptions, metadata, labels |
| `text-tertiary` | #6B6B6B | Placeholders, disabled text |
| `text-inverse` | #0A0A0A | Text on light/amber backgrounds |

#### Dark Mode Surface Hierarchy

```
┌─────────────────────────────────────────────┐
│  bg-primary (#0A0A0A) — Base layer          │
│  ┌───────────────────────────────────────┐  │
│  │  bg-surface (#1A1A1A) — Cards         │  │
│  │  ┌─────────────────────────────────┐  │  │
│  │  │  bg-elevated (#242424) — Popover│  │  │
│  │  └─────────────────────────────────┘  │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

### 1.4 Light Mode (Secondary Theme)

Light mode is available for users who prefer it or work in bright environments.

| Token | Hex | Usage |
|-------|-----|-------|
| `bg-primary` | #FFFFFF | Main application background |
| `bg-secondary` | #FAFAFA | Subtle separation, alternate rows |
| `bg-surface` | #FFFFFF | Cards, modals (with shadow) |
| `bg-elevated` | #FFFFFF | Popovers, dropdowns (with shadow) |
| `bg-muted` | #F5F5F5 | Disabled backgrounds, subtle fills |
| `border-subtle` | #E5E5E5 | Card borders, dividers |
| `border-default` | #D4D4D4 | Input borders, separators |
| `border-focus` | #F97316 | Focus rings, active states |
| `text-primary` | #171717 | Headlines, primary content |
| `text-secondary` | #525252 | Descriptions, metadata, labels |
| `text-tertiary` | #A3A3A3 | Placeholders, disabled text |
| `text-inverse` | #FAFAFA | Text on dark/amber backgrounds |

### 1.5 Contextual Tints (Light Mode Only)

Used for subtle background highlights in light mode.

| Token | Hex | Usage |
|-------|-----|-------|
| `tint-orange` | #FFF7ED | Orange/brand related sections |
| `tint-green` | #F0FDF4 | Success, validation, Gherkin specs |
| `tint-blue` | #EFF6FF | Information, IDE framework sections |
| `tint-purple` | #F3E8FF | AI/Agent related sections |
| `tint-red` | #FEF2F2 | Error, warning backgrounds |

### 1.6 Contextual Tints (Dark Mode)

Used for subtle background highlights in dark mode.

| Token | Hex | Usage |
|-------|-----|-------|
| `tint-orange` | #1C1106 | Orange/brand related sections |
| `tint-green` | #0D1912 | Success, validation, Gherkin specs |
| `tint-blue` | #0C1421 | Information, IDE framework sections |
| `tint-purple` | #160D21 | AI/Agent related sections |
| `tint-red` | #1C0F0F | Error, warning backgrounds |

### 1.7 Recency Color System

For indicating content freshness across the application.

| Timeframe | Light Mode | Dark Mode | Token |
|-----------|------------|-----------|-------|
| < 24 hours | #F97316 | #F97316 | `recency-day` |
| < 7 days | #4ADE80 | #4ADE80 | `recency-week` |
| < 30 days | #60A5FA | #60A5FA | `recency-month` |
| > 30 days | #9CA3AF | #6B7280 | `recency-old` |

---

## 2. Typography

### 2.1 Font Families

| Token | Font | Fallback | Usage |
|-------|------|----------|-------|
| `font-sans` | Inter | system-ui, sans-serif | Primary UI text |
| `font-mono` | JetBrains Mono | Consolas, monospace | Code, data, metrics |

**CDN Links:**
```html
<!-- Inter -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

<!-- JetBrains Mono -->
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
```

### 2.2 Type Scale

| Token | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| `text-display` | 32px | 700 | 40px (1.25) | Hero titles, landing pages |
| `text-h1` | 24px | 600 | 32px (1.33) | Page titles, section headers |
| `text-h2` | 18px | 600 | 26px (1.44) | Card titles, subsections |
| `text-h3` | 16px | 600 | 24px (1.5) | Group headers, labels |
| `text-body` | 14px | 400 | 22px (1.57) | Primary content, descriptions |
| `text-body-medium` | 14px | 500 | 22px (1.57) | Emphasized body text |
| `text-caption` | 12px | 500 | 18px (1.5) | Metadata, timestamps, badges |
| `text-small` | 11px | 500 | 16px (1.45) | Fine print, dense tables |

### 2.3 Monospace Scale

| Token | Size | Weight | Usage |
|-------|------|--------|-------|
| `mono-lg` | 14px | 500 | Code blocks, Gherkin specs |
| `mono-md` | 13px | 400 | Inline code, element IDs |
| `mono-sm` | 12px | 400 | Metrics, data values |
| `mono-xs` | 11px | 400 | Dense data tables |

---

## 3. Layout System

### 3.1 Application Shell

```
┌──────────────────────────────────────────────────────────────────┐
│  Top Bar (64px)                                            [🔔] │
├────────────┬─────────────────────────────────────────────────────┤
│            │                                                     │
│  Side Nav  │              Content Area                           │
│  (240px)   │              (max-width: 1440px)                    │
│            │                                                     │
│            │                                                     │
│            │                                                     │
│            │                                                     │
└────────────┴─────────────────────────────────────────────────────┘
```

| Zone | Dimension | Behavior |
|------|-----------|----------|
| Side Navigation | 240px fixed | Collapsible to 64px (icons only) |
| Top Bar | 64px height | Fixed, contains breadcrumbs + user menu |
| Content Area | max-width 1440px | Centered, responsive padding |
| Content Padding | 24px (desktop), 16px (tablet), 12px (mobile) | Responsive |

### 3.2 Design IDE Layout

The Design IDE uses a specialized six-zone layout inspired by VS Code.

```
┌────┬────────────┬─────────────────────────────┬────────────┐
│    │            │                             │            │
│ AB │  Primary   │       Editor Area           │ Secondary  │
│    │  Sidebar   │       (Canvas)              │  Sidebar   │
│48px│   240px    │       (flexible)            │   280px    │
│    │            │                             │            │
│    │            ├─────────────────────────────┤            │
│    │            │  Panel Area (150px)         │            │
├────┴────────────┴─────────────────────────────┴────────────┤
│  Status Bar (30px)                                         │
└────────────────────────────────────────────────────────────┘
```

| Zone | Default | Min | Max | Behavior |
|------|---------|-----|-----|----------|
| Activity Bar | 48px | 48px | 48px | Fixed width |
| Primary Sidebar | 240px | 180px | 400px | Resizable, collapsible |
| Secondary Sidebar | 280px | 200px | 400px | Resizable, hidden by default |
| Panel Area | 150px | 100px | 400px | Resizable, collapsed by default |
| Status Bar | 30px | 30px | 30px | Fixed height |
| Editor Area | Flexible | — | — | Fills remaining space |

### 3.3 Spacing Scale

Based on an 8px grid system with half-step additions for fine control.

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | 4px | Tight spacing, icon gaps |
| `space-2` | 8px | Component internal padding |
| `space-3` | 12px | Small gaps between elements |
| `space-4` | 16px | Standard padding, card spacing |
| `space-5` | 20px | Medium gaps |
| `space-6` | 24px | Section spacing, large padding |
| `space-8` | 32px | Major section breaks |
| `space-10` | 40px | Page section margins |
| `space-12` | 48px | Large separations |
| `space-16` | 64px | Hero spacing |

### 3.4 Breakpoints

| Token | Width | Target |
|-------|-------|--------|
| `screen-sm` | 640px | Mobile landscape |
| `screen-md` | 768px | Tablet portrait |
| `screen-lg` | 1024px | Tablet landscape / small laptop |
| `screen-xl` | 1280px | Desktop |
| `screen-2xl` | 1536px | Large desktop |

---

## 4. Components

### 4.1 Buttons

#### Primary Button
```css
/* Primary (Gradient) */
background: linear-gradient(135deg, #F97316, #F59E0B);
color: #0A0A0A;
height: 40px;
padding: 0 16px;
border-radius: 6px;
font-weight: 600;
font-size: 14px;

/* Hover */
filter: brightness(1.1);
transform: translateY(-1px);

/* Active */
filter: brightness(0.95);
transform: translateY(0);
```

#### Button Variants

| Variant | Background | Text | Border | Usage |
|---------|------------|------|--------|-------|
| Primary | Gradient | #0A0A0A | None | Main CTAs |
| Secondary | Transparent | #FAFAFA | #3A3A3A | Secondary actions |
| Ghost | Transparent | #A1A1A1 | None | Tertiary, cancel |
| Danger | #EF4444 | #FAFAFA | None | Destructive actions |

#### Button Sizes

| Size | Height | Padding | Font Size |
|------|--------|---------|-----------|
| Small | 32px | 0 12px | 13px |
| Default | 40px | 0 16px | 14px |
| Large | 48px | 0 20px | 16px |

### 4.2 Cards

```css
/* Dark Mode */
background: #1A1A1A;
border: 1px solid #2A2A2A;
border-radius: 8px;
padding: 16px;
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);

/* Light Mode */
background: #FFFFFF;
border: 1px solid #E5E5E5;
border-radius: 8px;
padding: 16px;
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);

/* Hover (Interactive Cards) */
border-color: #F97316;
box-shadow: 0 4px 12px rgba(249, 115, 22, 0.15);
```

### 4.3 Inputs

```css
/* Dark Mode */
background: #111111;
border: 1px solid #3A3A3A;
border-radius: 6px;
height: 40px;
padding: 0 12px;
color: #FAFAFA;

/* Focus */
border-color: #F97316;
box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.2);

/* Light Mode */
background: #FFFFFF;
border: 1px solid #D4D4D4;

/* Focus (Light) */
border-color: #F97316;
box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.15);
```

### 4.4 Tables

```css
/* Dense Table (Default) */
row-height: 40px;
header-height: 44px;
cell-padding: 8px 12px;
font-size: 13px;

/* Header */
background: #1A1A1A; /* Dark */
background: #F5F5F5; /* Light */
font-weight: 600;
position: sticky;
top: 0;

/* Rows */
border-bottom: 1px solid #2A2A2A; /* Dark */
border-bottom: 1px solid #E5E5E5; /* Light */

/* Alternating Rows (Optional) */
background: #111111; /* Dark - even rows */
background: #FAFAFA; /* Light - even rows */

/* Hover */
background: #242424; /* Dark */
background: #F0F0F0; /* Light */
```

#### Table Density Options

| Density | Row Height | Cell Padding | Use Case |
|---------|------------|--------------|----------|
| Compact | 32px | 4px 8px | Maximum density |
| Default | 40px | 8px 12px | Standard tables |
| Comfortable | 48px | 12px 16px | Relaxed reading |

### 4.5 Badges & Tags

```css
/* Base */
height: 24px;
padding: 0 8px;
border-radius: 4px;
font-size: 12px;
font-weight: 500;

/* Variants */
.badge-primary { background: #F97316; color: #0A0A0A; }
.badge-success { background: rgba(74, 222, 128, 0.15); color: #4ADE80; }
.badge-warning { background: rgba(251, 191, 36, 0.15); color: #FBBF24; }
.badge-error   { background: rgba(239, 68, 68, 0.15); color: #EF4444; }
.badge-info    { background: rgba(96, 165, 250, 0.15); color: #60A5FA; }
.badge-ai      { background: rgba(159, 122, 234, 0.15); color: #9F7AEA; }
```

### 4.6 Tooltips & Popovers

```css
/* Dark Mode */
background: #242424;
border: 1px solid #3A3A3A;
border-radius: 6px;
padding: 8px 12px;
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
font-size: 13px;
color: #FAFAFA;

/* Light Mode */
background: #FFFFFF;
border: 1px solid #E5E5E5;
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
color: #171717;
```

---

## 5. Iconography

### 5.1 Icon Sizes

| Token | Size | Stroke | Usage |
|-------|------|--------|-------|
| `icon-xs` | 14px | 1.5px | Inline with small text |
| `icon-sm` | 16px | 1.5px | Buttons, badges |
| `icon-md` | 20px | 2px | Navigation, actions |
| `icon-lg` | 24px | 2px | Section headers |
| `icon-xl` | 32px | 2px | Empty states, features |

### 5.2 Agent Mode Icons

| Mode | Icon | Color (Dark) | Color (Light) |
|------|------|--------------|---------------|
| Auto | Sparkles / Magic Wand | #9F7AEA | #7C3AED |
| Question | Question Circle | #60A5FA | #3B82F6 |
| Strategize | Lightbulb | #FBBF24 | #D97706 |
| Execute | Play Circle | #4ADE80 | #16A34A |
| Scenarios | Grid 2x2 | #F97316 | #EA580C |

### 5.3 Recommended Icon Library

**Lucide Icons** (MIT License)
- Consistent 24x24 grid
- 2px stroke default
- React, Vue, and vanilla JS support

```bash
npm install lucide-react
```

---

## 6. Motion & Animation

### 6.1 Timing Functions

| Token | Value | Usage |
|-------|-------|-------|
| `ease-default` | cubic-bezier(0.4, 0, 0.2, 1) | General transitions |
| `ease-in` | cubic-bezier(0.4, 0, 1, 1) | Elements entering |
| `ease-out` | cubic-bezier(0, 0, 0.2, 1) | Elements exiting |
| `ease-bounce` | cubic-bezier(0.34, 1.56, 0.64, 1) | Playful interactions |

### 6.2 Durations

| Token | Value | Usage |
|-------|-------|-------|
| `duration-fast` | 100ms | Micro-interactions |
| `duration-normal` | 200ms | Standard transitions |
| `duration-slow` | 300ms | Complex animations |
| `duration-slower` | 500ms | Page transitions |

### 6.3 Common Transitions

```css
/* Button hover */
transition: all 150ms ease-out;

/* Card hover */
transition: border-color 200ms, box-shadow 200ms ease-out;

/* Sidebar collapse */
transition: width 300ms ease-in-out;

/* Modal entrance */
animation: fadeIn 200ms ease-out, slideUp 300ms ease-out;
```

---

## 7. Accessibility

### 7.1 Color Contrast

All color combinations must meet WCAG 2.1 AA standards:
- **Normal text (< 18px):** 4.5:1 minimum
- **Large text (≥ 18px bold or ≥ 24px):** 3:1 minimum
- **UI components:** 3:1 minimum

| Combination | Contrast | Rating |
|-------------|----------|--------|
| #FAFAFA on #0A0A0A | 19.5:1 | AAA ✅ |
| #A1A1A1 on #0A0A0A | 7.1:1 | AAA ✅ |
| #F97316 on #0A0A0A | 6.2:1 | AA ✅ |
| #171717 on #FFFFFF | 18.1:1 | AAA ✅ |
| #F97316 on #FFFFFF | 3.0:1 | AA (large) ⚠️ |

### 7.2 Focus States

All interactive elements must have visible focus indicators:

```css
/* Focus ring */
outline: none;
box-shadow: 0 0 0 2px #0A0A0A, 0 0 0 4px #F97316;

/* For light mode */
box-shadow: 0 0 0 2px #FFFFFF, 0 0 0 4px #F97316;
```

### 7.3 Keyboard Navigation

| Key | Action |
|-----|--------|
| Tab | Move focus forward |
| Shift + Tab | Move focus backward |
| Enter / Space | Activate focused element |
| Escape | Close modal/popover |
| Arrow keys | Navigate within components |

---

## 8. Implementation Notes

### 8.1 CSS Custom Properties

```css
:root {
  /* Brand */
  --color-brand-primary: #F97316;
  --color-brand-secondary: #F59E0B;
  
  /* Semantic */
  --color-success: #4ADE80;
  --color-warning: #FBBF24;
  --color-error: #EF4444;
  --color-info: #60A5FA;
  --color-ai: #9F7AEA;
  
  /* Typography */
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', Consolas, monospace;
  
  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  
  /* Transitions */
  --transition-fast: 100ms ease-out;
  --transition-normal: 200ms ease-out;
}

/* Dark Mode (Default) */
:root, [data-theme="dark"] {
  --color-bg-primary: #0A0A0A;
  --color-bg-surface: #1A1A1A;
  --color-bg-elevated: #242424;
  --color-border-subtle: #2A2A2A;
  --color-border-default: #3A3A3A;
  --color-text-primary: #FAFAFA;
  --color-text-secondary: #A1A1A1;
  --color-text-tertiary: #6B6B6B;
}

/* Light Mode */
[data-theme="light"] {
  --color-bg-primary: #FFFFFF;
  --color-bg-surface: #FFFFFF;
  --color-bg-elevated: #FFFFFF;
  --color-border-subtle: #E5E5E5;
  --color-border-default: #D4D4D4;
  --color-text-primary: #171717;
  --color-text-secondary: #525252;
  --color-text-tertiary: #A3A3A3;
}
```

### 8.2 Tailwind CSS Configuration

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#F97316',
          secondary: '#F59E0B',
        },
        surface: {
          primary: 'var(--color-bg-primary)',
          card: 'var(--color-bg-surface)',
          elevated: 'var(--color-bg-elevated)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      spacing: {
        '18': '72px',
        '88': '352px',
      },
    },
  },
}
```

---

## 9. Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Dec 2025 | Initial design system with dark/light mode support |

---

## 10. Quick Reference

### Dark Mode Palette (Default)

| Role | Hex |
|------|-----|
| Background | #0A0A0A |
| Surface | #1A1A1A |
| Elevated | #242424 |
| Border | #2A2A2A |
| Text | #FAFAFA |
| Text Muted | #A1A1A1 |
| Accent | #F97316 |

### Light Mode Palette

| Role | Hex |
|------|-----|
| Background | #FFFFFF |
| Surface | #FFFFFF |
| Muted | #F5F5F5 |
| Border | #E5E5E5 |
| Text | #171717 |
| Text Muted | #525252 |
| Accent | #F97316 |

### Semantic Colors (Both Modes)

| Role | Hex |
|------|-----|
| Success | #4ADE80 |
| Warning | #FBBF24 |
| Error | #EF4444 |
| Info | #60A5FA |
| AI/Purple | #9F7AEA |
| Brand | #F97316 |

---

*ARKHITEKTON — The Master Builder's Toolkit*
