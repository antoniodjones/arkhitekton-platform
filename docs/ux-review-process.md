# UX Agent Review Process

## How to Invoke the UX Experience Agent

The UX Agent is a specialized design consultant with 15 years of experience. Use the `architect` tool with UX-focused prompts to get expert design reviews and recommendations.

## When to Consult

### Always Before Completing
- ✅ Canvas or modeling features
- ✅ New UI components with complex interactions
- ✅ Collaboration features (real-time, comments, presence)
- ✅ Progressive disclosure implementations
- ✅ Palette or toolbox designs

### Optional But Recommended
- Properties panels and inspectors
- Multi-step workflows
- Navigation patterns
- Information architecture changes

## Invocation Template

```typescript
architect({
  task: `UX DESIGN REVIEW: [Feature Name]
  
  Context: [What we're building and why]
  
  Goals:
  - [Primary user goal 1]
  - [Primary user goal 2]
  
  Current Approach: [Brief description of implementation]
  
  UX Challenges:
  - [Challenge 1: e.g., "200+ shapes without overwhelming users"]
  - [Challenge 2: e.g., "Real-time collaboration with 10+ users"]
  
  Design Principles to Apply:
  - Progressive disclosure (Sparx power + Miro simplicity)
  - [Other relevant principles from ux-agent-persona.md]
  
  Deliverables Needed:
  - Interaction patterns and wireframe suggestions
  - Specific UI improvements for current implementation
  - Progressive disclosure strategy
  - Success metrics to track
  
  Reference Files: [List relevant files]
  `,
  relevant_files: ["path/to/component.tsx", "docs/ux-agent-persona.md"],
  responsibility: "evaluate_task" // or "plan" for new features
})
```

## Review Types

### 1. Implementation Review (After Building)
**Use:** `responsibility: "evaluate_task"`

```typescript
architect({
  task: `UX IMPLEMENTATION REVIEW: Instant Canvas
  
  Evaluate the current instant canvas against UX principles:
  1. Progressive disclosure - do users see minimal UI initially?
  2. Feature discoverability - can users find advanced features?
  3. Visual hierarchy - are important actions prominent?
  4. Interaction patterns - do they match Figma/Miro simplicity?
  
  Current implementation: vanilla JS canvas with shapes and connectors.
  Goal: Sparx Enterprise Architect power with Miro-like simplicity.
  
  Provide specific recommendations for next iteration.
  `,
  relevant_files: ["client/src/pages/instant-canvas.tsx", "docs/ux-agent-persona.md"],
  include_git_diff: true,
  responsibility: "evaluate_task"
})
```

### 2. Design Planning (Before Building)
**Use:** `responsibility: "plan"`

```typescript
architect({
  task: `UX DESIGN PLAN: Adaptive Palette System
  
  Design a palette system that:
  - Starts with 5 basic shapes (beginner mode)
  - Auto-expands to 50+ shapes as user demonstrates expertise
  - Switches context (AWS mode, BPMN mode) based on usage
  - Allows power users to access all 200+ elements on-demand
  
  Challenge: Organize Sparx-level depth with Miro-level simplicity
  
  Deliverables:
  1. Progressive disclosure strategy (when to show what)
  2. Interaction patterns (how users switch modes)
  3. Visual design approach (mockup/wireframe suggestions)
  4. Implementation breakdown (components needed)
  `,
  relevant_files: ["docs/ux-agent-persona.md"],
  responsibility: "plan"
})
```

### 3. Troubleshooting UX Issues
**Use:** `responsibility: "debug"`

```typescript
architect({
  task: `UX DEBUG: Users Can't Find Connection Feature
  
  Problem: Users are adding shapes but not discovering the "Connect Shapes" button.
  
  Current UI: Button in toolbar alongside "Add Service", "Add Database"
  User feedback: "I don't know how to link my architecture elements"
  
  Apply UX Agent expertise to diagnose:
  1. Is the affordance clear? (Does it look clickable/important?)
  2. Is it discoverable? (Right placement and visual weight?)
  3. What's the mental model gap? (What do users expect?)
  
  Recommend specific UI changes to improve discoverability.
  `,
  relevant_files: ["client/src/pages/instant-canvas.tsx", "docs/ux-agent-persona.md"],
  responsibility: "debug"
})
```

## Review Checklist

Before invoking UX Agent, verify you have:

- [ ] **Clear context** - What feature and why it exists
- [ ] **Specific challenges** - What UX problems need solving
- [ ] **Current approach** - What's implemented or proposed
- [ ] **Design principles** - Which ARKHITEKTON principles apply
- [ ] **Success metrics** - How to measure good UX
- [ ] **Reference files** - Relevant code and documentation

## Expected Deliverables

The UX Agent will provide:

### For Reviews (evaluate_task)
- ✅ Specific UI improvements with examples
- ✅ Progressive disclosure opportunities
- ✅ Interaction pattern recommendations
- ✅ Comparison to Sparx/Miro/Figma patterns
- ✅ Quick wins vs. long-term enhancements

### For Planning (plan)
- ✅ Detailed interaction flows
- ✅ Component breakdown
- ✅ Visual hierarchy suggestions
- ✅ Implementation approach
- ✅ Success metrics to track

### For Debugging (debug)
- ✅ Root cause analysis (why users struggle)
- ✅ Specific fixes with priority
- ✅ Alternative interaction patterns
- ✅ Testing recommendations

## Example: Real UX Agent Review

**Before (Current Implementation):**
```typescript
// Simple toolbar with all buttons visible
<Button onClick={addRect}>Add Service</Button>
<Button onClick={addCircle}>Add Database</Button>
<Button onClick={addText}>Add Label</Button>
<Button onClick={connectMode}>Connect Shapes</Button>
<Button onClick={exportCanvas}>Export PNG</Button>
```

**UX Agent Feedback:**
> "This works but lacks progressive disclosure. New users see 5 buttons immediately - cognitive load. Recommendation:
> 
> 1. **Primary action** (most important): '+ Add Element' - single button
> 2. **Secondary actions** (contextual): Appear after first element added
> 3. **Advanced features** (on-demand): Right-click menu or Cmd+K palette
> 
> Specific changes:
> - Show only '+ Add Element' initially
> - After 1st shape: Connect and Export appear
> - After 3+ shapes: Full toolbar unlocks
> - Power users: Cmd+K for instant access to all features
> 
> This matches Figma's progressive toolbar revelation."

**After (Improved Implementation):**
```typescript
// Adaptive toolbar based on canvas state
{shapes.length === 0 && <Button>+ Add Element</Button>}
{shapes.length > 0 && <PrimaryActions />}
{shapes.length > 2 && <AdvancedFeatures />}
```

## Integration with Task Workflow

### Standard Flow
1. **Build feature** → Complete implementation
2. **Call UX Agent** → Get design review
3. **Apply feedback** → Iterate on UX improvements
4. **Mark complete** → Feature is both functional AND well-designed

### For Complex Features
1. **Call UX Agent** (planning mode) → Get design approach
2. **Build feature** → Follow UX recommendations
3. **Call UX Agent** (review mode) → Verify implementation
4. **Mark complete** → Feature validated by UX expertise

## Success Indicators

You know the UX Agent is working when:

- ✅ Features feel intuitive without documentation
- ✅ New users complete tasks in <30 seconds
- ✅ Power users find advanced features easily
- ✅ UI stays clean even as features grow
- ✅ Collaboration feels natural, not forced
- ✅ User feedback: "It just works" and "Feels modern"

## Common Patterns to Request

### Progressive Disclosure
```
"Design progressive disclosure for [feature] that starts simple 
and reveals complexity based on user expertise"
```

### Interaction Patterns
```
"What's the best interaction pattern for [action] that matches 
Figma's simplicity but supports Sparx-level power?"
```

### Visual Hierarchy
```
"Review visual hierarchy for [component] - are the most important 
actions most prominent?"
```

### Collaboration UX
```
"Design real-time collaboration UX for [feature] with cursors, 
presence, and conflict resolution"
```

## Tips for Best Results

1. **Be specific** - "Review toolbar" vs. "Review entire canvas UX"
2. **Provide context** - Explain user goals and constraints
3. **Reference principles** - Mention relevant patterns from ux-agent-persona.md
4. **Include files** - Always add relevant code and documentation
5. **Ask for specifics** - Request concrete recommendations, not theory

## Next Steps

After UX review:
1. Apply recommended changes
2. Test with users (if possible)
3. Track success metrics
4. Iterate based on feedback
5. Document patterns in UX library

---

**Remember:** The UX Agent is a design partner, not a gatekeeper. Use it to elevate your work, not to block progress.
