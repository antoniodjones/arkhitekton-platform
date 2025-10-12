# UX Experience Agent - Quick Start Guide

## What is the UX Agent?

A specialized AI design consultant with **15 years of experience** in:
- Enterprise UX (IBM, Microsoft, SAP-level tools)
- Collaborative platforms (Figma, Miro-style experiences)
- Progressive disclosure patterns
- Information architecture

## Mission

Ensure ARKHITEKTON achieves **"Sparx Enterprise Architect power with Miro/Figma simplicity"**

## How to Use

### 1. Quick Invocation (Copy-Paste Template)

```typescript
architect({
  task: `UX DESIGN REVIEW: [Feature Name]
  
  Context: [What we're building]
  
  UX Challenges:
  - [Challenge 1]
  - [Challenge 2]
  
  Apply UX Agent expertise to provide:
  - Specific UI improvements
  - Progressive disclosure strategy
  - Interaction pattern recommendations
  
  Reference UX Agent persona with 15 years experience.
  `,
  relevant_files: ["path/to/file.tsx", "docs/ux-agent-persona.md"],
  include_git_diff: true,
  responsibility: "evaluate_task" // or "plan" for new features
})
```

### 2. When to Consult

✅ **Always review:**
- Canvas or modeling features
- Palette and toolbox designs
- Collaboration features (real-time editing, cursors)
- Complex workflows

✅ **Recommended for:**
- Properties panels
- Multi-step processes
- Navigation patterns

### 3. What You Get

**For Reviews (evaluate_task):**
- ✅ Specific UI improvements with examples
- ✅ Progressive disclosure opportunities
- ✅ Quick wins vs long-term enhancements

**For Planning (plan):**
- ✅ Detailed interaction flows
- ✅ Component breakdown
- ✅ Visual hierarchy suggestions

**For Debugging (debug):**
- ✅ Root cause analysis (why users struggle)
- ✅ Specific fixes with priority
- ✅ Alternative patterns

## Core Principles

The UX Agent ensures every feature follows:

1. **Start Minimal** - New users see only what they need
2. **Grow Organically** - Features unlock based on usage
3. **Never Hide Power** - Advanced capabilities always accessible
4. **Guide, Don't Constrain** - AI suggests, user decides

## Example: Instant Canvas Review

**We asked:**
> "Review the instant canvas for UX improvements. Challenge: Add 200+ cloud icons without overwhelming users."

**UX Agent provided:**
- ✅ Toolbar redesign with progressive disclosure
- ✅ Adaptive palette strategy (5 shapes → 200+ on-demand)
- ✅ Connection interaction improvements
- ✅ Cloud icon integration roadmap
- ✅ Quick wins + long-term plan

**Result:** Clear actionable roadmap in `docs/ux-canvas-recommendations.md`

## Success Metrics

The UX Agent tracks:
- **Time to first action:** <30 seconds for new users
- **Feature discoverability:** 80% find advanced features without training
- **Interaction latency:** <100ms perceived performance
- **User feedback:** "It just works" and "Feels modern"

## Key Patterns Library

### 1. Adaptive Palette
Single palette that morphs based on context (beginner → expert mode)

### 2. Inline Smart Properties
Properties appear only when needed, slide in from right (Figma-style)

### 3. Contextual Validation
Gentle inline guidance without blocking error dialogs

### 4. Collaborative Cursors
Professional presence indicators with activity feeds

### 5. AI-Powered Shortcuts
Natural language command palette (Cmd+K) for complex actions

## Documentation

**Full Guides:**
- `docs/ux-agent-persona.md` - Complete agent profile and expertise
- `docs/ux-review-process.md` - Detailed invocation patterns
- `docs/ux-canvas-recommendations.md` - Example review output

**Updated:**
- `replit.md` - System architecture now includes UX Agent

## Quick Tips

1. **Be specific** - "Review toolbar" vs "Review entire UI"
2. **Provide context** - Explain user goals and constraints
3. **Reference principles** - Mention Sparx/Miro/Figma inspirations
4. **Include files** - Always add relevant code
5. **Ask for specifics** - Request concrete recommendations

## Next Steps

After UX review:
1. Apply recommended changes
2. Track success metrics
3. Iterate based on feedback
4. Call UX Agent again to validate improvements

---

**Remember:** The UX Agent is a design partner, not a gatekeeper. Use it to elevate your work and ensure ARKHITEKTON delivers Sparx power with Miro simplicity.
