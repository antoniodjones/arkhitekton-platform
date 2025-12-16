# Semantic Mentions System - Gap Analysis

## 🔍 Analysis Summary

The current Wiki requirements (ARKDL-0011-B) define the @mention system for **limited entity types**, but the ARKHITEKTON platform has **significantly more entities** that should be mentionable for a truly platform-wide semantic linking system.

---

## 📊 Current State: Entity Types in Requirements

The current `entityMentions` schema supports:
```typescript
entityType: z.enum([
  'user_story',    // ✅ Covered in HLR-WIKI-051
  'epic',          // ✅ Covered in HLR-WIKI-052
  'component',     // ✅ Covered in HLR-WIKI-053
  'diagram',       // ✅ Covered in HLR-WIKI-054
  'page',          // ✅ Covered in HLR-WIKI-055
  'requirement',   // ✅ Covered in HLR-WIKI-056
  'adr',           // ✅ Covered in HLR-WIKI-057
  'user',          // ✅ Covered in HLR-WIKI-058
  'application'    // ⚠️ NOT in requirements
])
```

---

## 🏗️ Complete Entity Inventory (from Codebase Analysis)

### API Entities (Routes)
| API Route | Entity Type | In Schema? | In Requirements? | Module |
|-----------|-------------|------------|------------------|--------|
| `/api/user-stories` | User Story | ✅ | ✅ HLR-WIKI-051 | Plan |
| `/api/epics` | Epic | ✅ | ✅ HLR-WIKI-052 | Plan |
| `/api/defects` | Defect | ❌ | ❌ | Quality Center |
| `/api/applications` | Application | ✅ | ❌ | APM/CMDB |
| `/api/architectural-models` | Model | ❌ | ⚠️ (as Diagram) | Design Studio |
| `/api/architectural-objects` | Object | ❌ | ⚠️ (as Component) | Design Studio |
| `/api/architecture-elements` | Element | ❌ | ❌ | Shape Library |
| `/api/knowledge-base/pages` | KB Page | ✅ (page) | ✅ HLR-WIKI-055 | Wiki (Legacy) |
| `/api/wiki` | Wiki Page | ✅ (page) | ✅ HLR-WIKI-055 | Wiki (New) |
| `/api/settings` | Setting | ❌ | ❌ | Settings |
| `/api/integrations/developer/channels` | Channel | ❌ | ❌ | Integrations |
| `/api/integrations/developer/sync-flows` | Sync Flow | ❌ | ❌ | Integrations |

### Database Tables (Schema)
| Table | Entity Type | Mentionable? | Business Value |
|-------|-------------|--------------|----------------|
| `users` | User | ✅ (user) | Assign, notify, tag people |
| `userStories` | User Story | ✅ | Link docs to requirements |
| `epics` | Epic | ✅ | Link docs to value streams |
| `defects` | Defect | ❌ **GAP** | Link docs to quality issues |
| `applications` | Application | ✅ | Link to APM/CMDB systems |
| `architecturalModels` | Model | ❌ **GAP** | Link to canvas diagrams |
| `architecturalObjects` | Object | ❌ **GAP** | Link to specific components |
| `architectureElements` | Element | ❌ **GAP** | Reference shape library |
| `wikiPages` | Page | ✅ | Inter-wiki linking |
| `knowledgeBasePages` | KB Page | ✅ | Legacy wiki linking |
| `integrationChannels` | Channel | ❌ **GAP** | Reference dev tool integrations |
| `objectSyncFlows` | Sync Flow | ❌ **LOW** | Technical reference |

### Conceptual Entities (Not in DB yet but referenced)
| Entity | Currently Stored In | Mentionable? | Business Value |
|--------|---------------------|--------------|----------------|
| ADR | Wiki Pages (template) | ✅ (adr) | Link to decisions |
| Requirement | Wiki Pages (template) | ✅ | Traceability |
| Business Capability | Capabilities Page | ❌ **GAP** | Business linkage |
| Technology Service | APM/Applications | ⚠️ | Technology mapping |
| Team/Squad | Not implemented | ❌ **GAP** | Org structure |
| Project | Not implemented | ❌ **GAP** | Project context |
| Initiative | Epics (via value stream) | ⚠️ | Strategic alignment |

---

## 🚨 Critical Gaps Identified

### 1. **Defects (Quality Center)** - HIGH PRIORITY
- **Entity**: `defects` table exists
- **Status**: NOT mentionable
- **Impact**: QA team cannot link defects in documentation
- **Use Case**: "This design change addresses @DEF-001 which caused production outages"

### 2. **Architectural Models** - HIGH PRIORITY
- **Entity**: `architecturalModels` table exists
- **Status**: NOT mentionable (only "diagram" in requirements)
- **Impact**: Cannot reference specific canvas models in docs
- **Use Case**: "See @PaymentSystemModel for the current architecture"

### 3. **Architectural Objects** - MEDIUM PRIORITY
- **Entity**: `architecturalObjects` table exists
- **Status**: Only "component" is vaguely covered
- **Impact**: Cannot reference specific elements within models
- **Use Case**: "The @PaymentService object in the diagram handles..."

### 4. **Business Capabilities** - MEDIUM PRIORITY
- **Entity**: Exists in Capabilities page (mock data)
- **Status**: NOT in schema or requirements
- **Impact**: Cannot link to business capability maps
- **Use Case**: "This system supports the @OrderManagement capability"

### 5. **Architecture Elements (Shape Library)** - LOW PRIORITY
- **Entity**: `architectureElements` table exists (2000+ shapes)
- **Status**: NOT mentionable
- **Impact**: Cannot reference standard patterns/shapes
- **Use Case**: "We use the @AWSLambda pattern for serverless"

---

## 📝 Recommended Schema Update

### Expanded Entity Types Enum
```typescript
entityType: z.enum([
  // Plan Module
  'user_story',
  'epic',
  'defect',           // ← NEW
  
  // Design Studio Module
  'model',            // ← NEW (architectural model)
  'object',           // ← NEW (architectural object)
  'element',          // ← NEW (shape library element)
  
  // Wiki Module
  'page',
  'adr',
  'requirement',
  
  // APM/CMDB Module
  'application',
  
  // Governance Module
  'capability',       // ← NEW (business capability)
  'decision',         // ← NEW (ADR alias for clarity)
  
  // People & Teams
  'user',
  'team',             // ← NEW (future)
  
  // Integration Module
  'channel',          // ← LOW PRIORITY
  'project',          // ← FUTURE
])
```

---

## 📋 Updated User Stories Required

### New Stories to Add

| Story ID | Title | Priority | Points |
|----------|-------|----------|--------|
| US-WIKI-065 | @mention Defects from Quality Center | Must | 3 |
| US-WIKI-066 | @mention Architectural Models from Canvas | Must | 5 |
| US-WIKI-067 | @mention Architectural Objects within Models | Should | 5 |
| US-WIKI-068 | @mention Business Capabilities | Should | 5 |
| US-WIKI-069 | @mention Architecture Elements (Shape Library) | Could | 3 |
| US-WIKI-070 | Unified Entity Search API for @mentions | Must | 8 |

### Existing Stories to Modify

| Story ID | Current | Change |
|----------|---------|--------|
| HLR-WIKI-053 | "Search Components from Design module" | Expand to "Models and Objects from Design Studio" |
| HLR-WIKI-054 | "Search Diagrams from Canvas module" | Clarify this IS architecturalModels |

---

## 🏛️ Architectural Recommendation

### Option A: Expand Current Schema (Quick)
- Add new entity types to the enum
- Keep the current `entity_mentions` table structure
- Implement per-entity-type search endpoints

### Option B: Entity Registry Pattern (Robust)
- Create an `entity_registry` table that maps entity types to:
  - Search endpoint URL
  - Detail page URL pattern
  - Status field mapping
  - Icon/color configuration
- Makes the system extensible without schema changes

### Recommendation: **Option B (Entity Registry)**
The ARKHITEKTON platform will continue to grow. Having a registry allows:
1. Adding new entity types without schema migration
2. Plugin architecture for new modules
3. Consistent behavior across all mention types

---

## 📊 Implementation Impact

### Current Sprint 3 Scope (as planned)
- Entity types: 9 (user_story, epic, component, diagram, page, requirement, adr, user, application)
- Story points: ~76 points

### Revised Sprint 3 Scope (with gaps filled)
- Entity types: 14 (+5 new)
- Additional stories: 6 new
- Additional points: ~29 points
- **Total Sprint 3+**: ~105 points (split into Sprint 3a and 3b)

---

## 🎯 Recommended Action

1. **Update Schema**: Add `defect`, `model`, `object`, `capability` to entity types
2. **Create Entity Registry**: Build extensible pattern for future growth
3. **Create Stories**: Add 6 new user stories for the missing entities
4. **Prioritize**: 
   - Sprint 3a: Core mentions (existing + defects + models)
   - Sprint 3b: Extended mentions (objects, capabilities, elements)

---

## 📖 Next Steps

1. Review this analysis and confirm additional entity types needed
2. Update `shared/schema.ts` with new entity types
3. Create database migration for entity_mentions
4. Add new user stories to Plan module
5. Proceed with Sprint 3 implementation

---

**Analysis Date**: December 15, 2025  
**Analyst**: ARKHITEKTON AI Agent  
**Document**: SEMANTIC-MENTIONS-GAP-ANALYSIS.md

