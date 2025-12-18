# GitHub Traceability Guidelines

> **Guiding Principle**: Every code change should be traceable to a user story, defect, or epic.

## Naming Conventions

### Branch Names
Include the story ID in the branch name:
```
feature/US-WIKI-007-autosave
fix/DEF-0042-null-category
epic/EPIC-12-wiki-transformation
```

### Commit Messages
Use conventional commits with story ID:
```
feat(US-WIKI-007): Implement auto-save every 30 seconds
fix(DEF-0042): Handle undefined category in Kanban card
docs(US-WIKI-001): Update API documentation
refactor(US-PLAN-101): Extract sprint service
```

### Pull Request Titles
Mirror the commit convention:
```
feat(US-WIKI-007): Auto-save drafts implementation
fix(DEF-0042): Resolve Kanban card crash on empty category
```

---

## Traceability Strategy

### One PR Per Story (Recommended) ✅

| Scenario | Approach |
|----------|----------|
| **Independent stories** | 1 PR per story |
| **Tightly coupled stories** | 1 PR, multiple story IDs in title |
| **Bug fix during feature work** | Separate PR for the defect |
| **Refactoring across stories** | 1 PR, reference all affected stories |

### Why One PR Per Story?

1. **Clean Traceability** - 1:1 mapping between PR and story
2. **Easy Reverts** - Roll back a single story without affecting others
3. **Focused Reviews** - Code review is scoped to one logical unit
4. **Automatic Status** - PR merged → story marked "done"

---

## Workflow Examples

### Single Story Workflow
```bash
# Create feature branch with story ID
git checkout -b feature/US-WIKI-007-autosave

# Make commits referencing the story
git commit -m "feat(US-WIKI-007): Add draft saving logic"
git commit -m "feat(US-WIKI-007): Add auto-save interval"
git commit -m "test(US-WIKI-007): Add unit tests"

# Push and create PR
git push -u origin feature/US-WIKI-007-autosave
# PR Title: "feat(US-WIKI-007): Auto-save drafts every 30 seconds"
```

### Multiple Stories (When Necessary)
```bash
# When stories are tightly coupled
git checkout -b feature/wiki-editor-foundation

# Commits reference their specific stories
git commit -m "feat(US-WIKI-011): Implement TipTap editor"
git commit -m "feat(US-WIKI-012): Add markdown shortcuts"

# PR title includes all stories
# PR Title: "feat(US-WIKI-011, US-WIKI-012): Editor foundation"
```

### Defect Fix During Feature Work
```bash
# You're working on US-WIKI-007 and find a bug
# DON'T fix it in the same PR!

# Stash your work
git stash

# Create separate branch for defect
git checkout -b fix/DEF-0043-editor-crash
git commit -m "fix(DEF-0043): Handle null content in editor"
git push -u origin fix/DEF-0043-editor-crash
# Create separate PR for defect

# Return to feature work
git checkout feature/US-WIKI-007-autosave
git stash pop
```

---

## Automatic Integrations

When you follow these conventions, the platform automatically:

| Action | Result |
|--------|--------|
| Push commit with story ID | Commit linked to story |
| Create branch with story ID | Branch linked, story → "in-progress" |
| Open PR with story ID | PR linked, story → "review" |
| Merge PR | Story → "done" |

---

## Story ID Formats

The system recognizes these patterns:

| Type | Pattern | Example |
|------|---------|---------|
| User Story | `US-*` | `US-WIKI-007`, `US-PLAN-101` |
| Defect | `DEF-*` | `DEF-0042`, `DEF-PLAN-001` |
| Epic | `EPIC-*` | `EPIC-12`, `EPIC-WIKI` |

---

## Code Review Checklist

Before approving a PR, verify:

- [ ] PR title contains story ID
- [ ] All commits reference appropriate story IDs
- [ ] Defects are in separate PRs (not bundled with features)
- [ ] Branch name follows naming convention
- [ ] Story acceptance criteria is met

---

## Anti-Patterns to Avoid

❌ **Don't**: Mix unrelated stories in one PR
```
# Bad: Two unrelated features in one PR
feat(US-WIKI-007, US-PLAN-101): Random stuff
```

❌ **Don't**: Commit without story ID
```
# Bad: No traceability
git commit -m "Fixed the thing"
```

❌ **Don't**: Fix bugs in feature PRs
```
# Bad: Defect buried in feature PR
feat(US-WIKI-007): Auto-save and also fix that crash
```

✅ **Do**: Keep it clean and traceable
```
# Good: Clear, single-purpose, traceable
feat(US-WIKI-007): Implement auto-save drafts
```

---

*Last Updated: December 2024*

