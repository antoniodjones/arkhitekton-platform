# Story-to-Code Mapping - Dashboard Components

This document maps user stories to their implementation in the codebase, ensuring complete traceability from requirements to code.

## Dashboard Stories

### US-ARKPRJ7 - Dashboard Layout and Navigation ✅

**Status**: Done  
**Priority**: High  
**Story Points**: 5

**Acceptance Criteria** (Gherkin):
```gherkin
Given I am logged into ARKHITEKTON
When I navigate to the dashboard home page
Then I should see a header with ARKHITEKTON branding and navigation
And I should see a search bar for discovering architecture insights
And I should see four key statistics displayed (Active Initiatives, Architecture Models, Capabilities Mapped, Stakeholders)
And I should see three main content sections in a grid layout (Strategic Priorities, Quick Actions, Architecture Models)
And all sections should be horizontally aligned with consistent spacing
```

**Implementation**:
- **File**: `client/src/pages/dashboard.tsx`
- **Lines**: 1-524
- **Components**:
  - Header with ARKHITEKTON branding (lines 227-294)
  - Search bar with autocomplete (lines 311-387)
  - Stats grid (lines 390-412)
  - Main content grid layout (lines 425-665)

**Key Code Sections**:
```typescript
// Header Implementation (lines 227-294)
<header className={`backdrop-blur-md ${palette.headerBg} ${palette.cardBorder} border-b sticky top-0 z-50`}>
  <div className="flex items-center space-x-3">
    <h1 className={`text-2xl font-bold ${palette.headerText} tracking-tight`}>
      ARKHITEKTON
    </h1>
  </div>
</header>

// Search Implementation (lines 311-387)
<Input
  placeholder="Discover architecture insights, capabilities, and strategic opportunities..."
  className="pl-14 pr-6 py-6 text-lg"
/>

// Stats Grid (lines 390-412)
<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
  {stats.map((stat, index) => (
    // Stat card rendering
  ))}
</div>

// Main Grid Layout (lines 425-665)
<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
  {/* Three main sections */}
</div>
```

---

### US-L80IUS5 - Strategic Priorities Cards Display ✅

**Status**: Done  
**Priority**: High  
**Story Points**: 3

**Acceptance Criteria** (Gherkin):
```gherkin
Given I am on the dashboard home page
When I view the Strategic Priorities section
Then I should see cards displaying recent strategic tasks
And each card should show the task title, description, and time ago
And each card should display a badge indicating the task type (Strategy, Assessment, Planning)
And high priority tasks should display a "Critical" badge
And all cards should have uniform height (140px) and width
And all cards should be horizontally aligned across the grid
And the section should include "Model-driven Apps Rationalization" card
```

**Implementation**:
- **File**: `client/src/pages/dashboard.tsx`
- **Lines**: 141-170 (data), 445-656 (UI)
- **Data Structure**:
```typescript
const recentTasks = [
  {
    title: "Strategic Architecture Review",
    description: "Assess enterprise transformation roadmap",
    type: "Strategy",
    timeAgo: "2 hours ago",
    priority: "high"
  },
  {
    title: "Digital Capability Mapping",
    description: "Map core digital capabilities and gaps",
    type: "Assessment",
    timeAgo: "1 day ago",
    priority: "medium"
  },
  {
    title: "Technology Modernization",
    description: "Define future-state technology vision",
    type: "Planning",
    timeAgo: "3 days ago",
    priority: "low"
  },
  {
    title: "Model-driven Apps Rationalization",
    description: "Optimize and consolidate application portfolio",
    type: "Planning",
    timeAgo: "5 days ago",
    priority: "medium"
  }
];
```

**Card Implementation** (lines 447-461):
```typescript
<div className="group relative h-[140px]">
  <div className={`relative ${palette.cardBg} backdrop-blur-sm border ${palette.cardBorder} rounded-xl p-5 shadow-lg h-full flex flex-col justify-between`}>
    <div className="flex items-start justify-between mb-3">
      <div className="flex-1">
        <h4 className={`font-semibold ${palette.textPrimary} mb-1`}>{task.title}</h4>
        <p className={`text-sm ${palette.textSecondary} line-clamp-2`}>{task.description}</p>
      </div>
      <span className="text-xs text-slate-500 dark:text-slate-400 ml-2 flex-shrink-0">{task.timeAgo}</span>
    </div>
    <div className="flex items-center gap-2">
      <Badge variant="secondary" className="text-xs">{task.type}</Badge>
      {task.priority === 'high' && (
        <Badge className="text-xs bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300">Critical</Badge>
      )}
    </div>
  </div>
</div>
```

**Design Specifications**:
- Fixed height: 140px
- Responsive grid: `grid-cols-1 lg:grid-cols-3`
- Gradient overlay on hover
- Flexbox layout for content alignment

---

### US-4QSL6TK - Quick Actions Cards Display ✅

**Status**: Done  
**Priority**: Medium  
**Story Points**: 3

**Acceptance Criteria** (Gherkin):
```gherkin
Given I am on the dashboard home page
When I view the Quick Actions section
Then I should see actionable cards with icons and descriptions
And each card should be clickable and navigate to the corresponding feature
And cards should include: Create Architecture Model, Governance Dashboard, Innovation Portfolio, and Strategic Planning
And each card should display an icon on the left and text on the right
And all cards should have uniform height (140px) and width
And all cards should align horizontally with Strategic Priorities cards
And hover effects should provide visual feedback
```

**Implementation**:
- **File**: `client/src/pages/dashboard.tsx`
- **Lines**: 172-191 (data), 465-478 (UI per card)
- **Data Structure**:
```typescript
const quickLinks = [
  {
    title: "Create Architecture Model",
    description: "Design your enterprise architecture",
    icon: Sparkles,
    color: palette.accent,
    href: "/workspace"
  },
  {
    title: "Governance Dashboard",
    description: "Monitor compliance and risk assessment",
    icon: Shield,
    color: palette.accent,
    href: "/governance"
  },
  {
    title: "Innovation Portfolio",
    description: "Track transformation initiatives",
    icon: Zap,
    color: palette.accent,
    href: "/innovation"
  },
  {
    title: "Strategic Planning",
    description: "Define architectural roadmaps",
    icon: TrendingUp,
    color: palette.accent,
    href: "/strategy"
  }
];
```

**Card Implementation** (example from Row 1):
```typescript
<Link href="/workspace">
  <div className="group relative cursor-pointer h-[140px]">
    <div className={`relative ${palette.cardBg} backdrop-blur-sm border ${palette.cardBorder} rounded-xl p-5 shadow-lg h-full flex items-center`}>
      <div className="flex items-center w-full">
        <Sparkles className={`h-6 w-6 mr-4 ${palette.accent} flex-shrink-0`} />
        <div className="flex-1">
          <h4 className={`font-semibold ${palette.textPrimary}`}>Create Architecture Model</h4>
          <p className={`text-sm ${palette.textSecondary}`}>Design your enterprise architecture</p>
        </div>
      </div>
    </div>
  </div>
</Link>
```

**Navigation Targets**:
- `/workspace` - Architecture model creation
- `/governance` - Governance dashboard
- `/innovation` - Innovation portfolio
- `/strategy` - Strategic planning

---

### US-5L7DHNW - Architecture Models Cards Display ✅

**Status**: Done  
**Priority**: Medium  
**Story Points**: 3

**Acceptance Criteria** (Gherkin):
```gherkin
Given I am on the dashboard home page
When I view the Architecture Models section
Then I should see cards displaying recent architecture models
And each card should show the model title and description
And each card should display a type badge (Strategic, Technical, Business)
And each card should show collaborator count and last modified time
And cards should include: Digital Transformation Blueprint, Cloud-Native Platform Design, and Customer Experience Journey
And all cards should have uniform height (140px) and width
And all cards should align horizontally with Strategic Priorities and Quick Actions cards
And clicking a card should navigate to the workspace for that model
```

**Implementation**:
- **File**: `client/src/pages/dashboard.tsx`
- **Lines**: 193-215 (data), 481-500 (UI per card)
- **Data Structure**:
```typescript
const recentModels = [
  {
    title: "Digital Transformation Blueprint",
    description: "Enterprise-wide transformation architecture",
    type: "Strategic",
    modified: "2 hours ago",
    collaborators: 8
  },
  {
    title: "Cloud-Native Platform Design",
    description: "Modern application platform architecture",
    type: "Technical",
    modified: "1 day ago",
    collaborators: 12
  },
  {
    title: "Customer Experience Journey",
    description: "End-to-end customer interaction model",
    type: "Business",
    modified: "2 days ago",
    collaborators: 6
  }
];
```

**Card Implementation** (example from Row 1):
```typescript
<Link href="/workspace">
  <div className="group relative cursor-pointer h-[140px]" data-testid="card-recent-model-0">
    <div className={`relative ${palette.cardBg} backdrop-blur-sm border ${palette.cardBorder} rounded-xl p-5 shadow-lg h-full flex flex-col justify-between`}>
      <div>
        <h4 className={`font-semibold ${palette.textPrimary} mb-1`}>Digital Transformation Blueprint</h4>
        <p className={`text-sm ${palette.textSecondary} mb-3 line-clamp-2`}>Enterprise-wide transformation architecture</p>
      </div>
      <div className="flex items-center justify-between">
        <Badge variant="outline" className="text-xs">Strategic</Badge>
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <Users className="h-3 w-3" />
          <span>8</span>
          <span>•</span>
          <span>2 hours ago</span>
        </div>
      </div>
    </div>
  </div>
</Link>
```

---

## Horizontal Alignment Implementation

All three sections use a unified grid system to ensure perfect alignment:

**Grid Structure** (lines 425-665):
```typescript
<div>
  {/* Section Headers */}
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-6">
    <h3>Strategic Priorities</h3>
    <h3>Quick Actions</h3>
    <h3>Architecture Models</h3>
  </div>

  {/* Cards Grid - Aligned Horizontally */}
  <div className="space-y-4">
    {/* Row 1 */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Card 1 from each section */}
    </div>
    
    {/* Row 2 */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Card 2 from each section */}
    </div>
    
    {/* Row 3 */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Card 3 from each section */}
    </div>
    
    {/* Row 4 */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Card 4 from Strategic Priorities, Quick Actions, empty space */}
    </div>
  </div>
</div>
```

**Key Alignment Features**:
1. **Uniform Height**: All cards use `h-[140px]` class
2. **Grid System**: Each row uses `grid grid-cols-1 lg:grid-cols-3 gap-8`
3. **Consistent Spacing**: `space-y-4` between rows, `gap-8` between columns
4. **Responsive Design**: Stacks vertically on mobile (`grid-cols-1`), three columns on desktop (`lg:grid-cols-3`)

---

## Testing & Validation

### Manual Test Cases

**Test Case 1: Visual Alignment**
```gherkin
Given I am on the dashboard
When I view the three sections side by side
Then all cards in the same row should align at the same vertical position
And all cards should have identical heights
```

**Test Case 2: Card Content**
```gherkin
Given I view Strategic Priorities
When I look for "Model-driven Apps Rationalization"
Then I should find it as the fourth card
And it should show type "Planning" and time "5 days ago"
```

**Test Case 3: Interactive Elements**
```gherkin
Given I am on the dashboard
When I click a Quick Actions card
Then I should navigate to the corresponding page
```

### Data-testid Attributes

For automated testing, cards include test IDs:
- Architecture Models: `data-testid="card-recent-model-{index}"`
- Design options: `data-testid="design-option-{name}"`
- Global search: `data-testid="input-global-search"`

---

## Design System Compliance

### Colors & Theming
- Uses ARKHITEKTON orange/amber gradient (`from-orange-500 via-orange-400 to-amber-500`)
- Supports 4 design options: Current, Elegant, Delta, Minimal
- Dark mode compatible with proper contrast ratios

### Component Standards
- **shadcn/ui** Card, Badge, Button components
- **Lucide Icons** for visual indicators
- **Tailwind CSS** for styling with custom design system
- **Responsive breakpoints**: mobile (< 768px), tablet (768-1024px), desktop (> 1024px)

### Typography
- Card titles: `font-semibold` with primary text color
- Descriptions: `text-sm` with secondary text color
- Time stamps: `text-xs` with muted color
- Badges: `text-xs` with appropriate variant

---

## Future Enhancements

Based on the user stories, potential improvements include:

1. **Dynamic Data** (US-ARKPRJ7):
   - Connect to real API endpoints for tasks, actions, and models
   - Real-time updates for statistics

2. **Customization** (US-L80IUS5, US-4QSL6TK, US-5L7DHNW):
   - Allow users to reorder cards via drag-and-drop
   - Pin/unpin cards based on user preference
   - Custom card filtering and sorting

3. **Enhanced Interactions**:
   - Card preview on hover
   - Quick actions menu on card right-click
   - Inline editing for task properties

---

## Commit References

All dashboard card implementations should reference these stories in commit messages:

```bash
feat: Implement dashboard layout and navigation [US-ARKPRJ7]
feat: Add strategic priorities cards with alignment [US-L80IUS5]
feat: Add quick actions cards with navigation [US-4QSL6TK]
feat: Add architecture models cards display [US-5L7DHNW]
```

## Traceability Matrix

| Story ID | Feature | File | Lines | Status |
|----------|---------|------|-------|--------|
| US-ARKPRJ7 | Dashboard Layout | `client/src/pages/dashboard.tsx` | 1-524 | ✅ Done |
| US-L80IUS5 | Strategic Priorities | `client/src/pages/dashboard.tsx` | 141-170, 445-656 | ✅ Done |
| US-4QSL6TK | Quick Actions | `client/src/pages/dashboard.tsx` | 172-191, 465-478 | ✅ Done |
| US-5L7DHNW | Architecture Models | `client/src/pages/dashboard.tsx` | 193-215, 481-500 | ✅ Done |

---

**Last Updated**: October 10, 2025  
**Maintained By**: ARKHITEKTON Development Team
