# ARKHITEKTON | ARKDL-0008 APM Integration & Portfolio Binding v1.0

# ARKHITEKTON
## APM Integration & Portfolio Binding
### Product Requirements Specification

**EPICs | Features | High-Level Requirements | User Stories | Gherkin Specifications**

| Field | Value |
|-------|-------|
| **Document ID** | ARKDL-0008 |
| **Version** | 1.0 |
| **Date** | December 2025 |
| **Status** | Draft |
| **Module** | APM Integration |
| **Parent Modules** | Design IDE (TIDE), Application Portfolio Management (APM) |
| **Related Documents** | ARKDL-0006 (Design IDE), ARKDL-0007 (Element Library) |
| **Target Users** | Technology Architects, Enterprise Architects, Portfolio Managers |

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [The Technology Architect's Pain Points](#2-the-technology-architects-pain-points)
3. [Product Vision & Business Context](#3-product-vision--business-context)
4. [APM Data Model Overview](#4-apm-data-model-overview)
5. [Integration Architecture](#5-integration-architecture)
6. [EPIC & Feature Definitions](#6-epic--feature-definitions)
7. [High-Level Requirements](#7-high-level-requirements)
8. [User Stories with Gherkin Specifications](#8-user-stories-with-gherkin-specifications)
9. [Requirements Traceability Matrix](#9-requirements-traceability-matrix)
10. [Appendix: API Specifications](#10-appendix-api-specifications)

---

## 1. Executive Summary

### 1.1 The Problem We're Solving

Every enterprise has an application portfolio—hundreds or thousands of applications that power the business. These applications live in spreadsheets, ServiceNow CMDBs, LeanIX inventories, or custom databases. When architects draw diagrams, they create shapes and label them with application names. **But those shapes have no connection to reality.**

The diagram says "Order Management System" but the portfolio says "OMS-PROD-001" with a tech lead named Sarah, a decommission date in 2026, and a dependency on three other systems. The architect's diagram and the enterprise's truth exist in parallel universes.

**APM Integration bridges these worlds.** When an architect places an application on the canvas, they're not just drawing a box—they're placing a **live reference** to the enterprise's source of truth. Properties sync. Changes propagate. Diagrams become trustworthy.

### 1.2 Vision Statement

> "Every application on the canvas is a living link to the enterprise portfolio. Architects design with reality, not imagination. Stakeholders trust what they see because it reflects what exists."

### 1.3 The Two Integration Modes

| Mode | Flow | Use Case |
|------|------|----------|
| **APM → Canvas** | Drag from portfolio browser to canvas | "I want to show our existing Order Service in this diagram" |
| **Canvas → APM** | Link existing shape to portfolio OR create draft entry | "This shape represents our Order Service—let me connect it" |

### 1.4 What This Enables

| Capability | Without APM Integration | With APM Integration |
|------------|------------------------|---------------------|
| **Application identification** | Free-text label | Linked to APM record with unique ID |
| **Property accuracy** | Architect's memory | Auto-synced from portfolio |
| **Owner information** | Often missing | Always available from APM |
| **Tech stack** | Inconsistent capture | Standardized from portfolio |
| **Lifecycle status** | Outdated on diagrams | Real-time from APM |
| **Impact analysis** | Manual search | "Where is this app used?" across all models |
| **Governance compliance** | Manual review | Automated portfolio alignment check |

### 1.5 Business Value

| Metric | Current State | With APM Integration |
|--------|---------------|---------------------|
| Diagram accuracy vs. reality | ~60% (decays over time) | 95%+ (live sync) |
| Time to document an application | 15-20 minutes (research) | 30 seconds (drag from APM) |
| Portfolio coverage in diagrams | Unknown | Trackable (% of apps modeled) |
| Orphan shapes (not in portfolio) | Common, undetected | Flagged and actionable |
| Impact analysis time | Days (manual search) | Minutes (cross-model query) |

---

## 2. The Technology Architect's Pain Points

### 2.1 The Daily Struggle

Technology architects don't just model systems—they **communicate the enterprise's application landscape** to stakeholders, project teams, and governance boards. But their diagrams are disconnected from the systems they represent.

**Pain Point #1: The Naming Nightmare**
> "We have three diagrams that mention 'Customer Portal.' One architect called it 'Customer Portal,' another called it 'CP-Web,' and a third called it 'CustomerPortal_v2.' Are these the same application? I have no idea."
> — Enterprise Architect, Banking

**Pain Point #2: The Stale Diagram**
> "I presented a diagram to the CIO showing our integration architecture. She asked about the payment gateway. I said it was owned by Platform Team. Turns out they transferred ownership six months ago. My diagram was lying to her."
> — Solution Architect, E-commerce

**Pain Point #3: The Ghost Applications**
> "My team created 20 application components on our diagrams. When I tried to map them to the portfolio, only 12 existed in ServiceNow. Where did the other 8 come from? Were they decommissioned? Never real? Nobody knows."
> — Technology Strategist, Healthcare

**Pain Point #4: The Property Vacuum**
> "I need to show the tech stack of each microservice on this diagram. I have to open ServiceNow, search for each app, copy the data, paste it into the diagram properties. Repeat 30 times. There has to be a better way."
> — Platform Architect, SaaS

**Pain Point #5: The Impact Mystery**
> "The security team asked: 'Which systems would be affected if we deprecated the Legacy Auth Service?' I have no idea. That app appears on maybe 50 diagrams across 10 architects. Finding them would take weeks."
> — Chief Architect, Financial Services

### 2.2 How APM Integration Solves These

| Pain Point | APM Integration Solution |
|------------|-------------------------|
| **Naming Nightmare** | Canonical APM ID and name; aliases resolve to same record |
| **Stale Diagrams** | Bi-directional sync updates diagrams when portfolio changes |
| **Ghost Applications** | Unlinked shapes flagged; "Create in APM" workflow available |
| **Property Vacuum** | Properties auto-populated from APM on placement |
| **Impact Mystery** | "Where is this app used?" query across all models |

### 2.3 User Personas for APM Integration

**Persona 1: The Solution Architect**
- **Task**: Design a new microservices architecture using existing platform services
- **APM Need**: Browse existing services, drag to canvas, see current tech stack
- **Outcome**: Diagram reflects real services with accurate properties

**Persona 2: The Enterprise Architect**
- **Task**: Create a capability-to-application mapping
- **APM Need**: Bulk-link canvas shapes to APM entries, validate coverage
- **Outcome**: Complete and auditable mapping for governance

**Persona 3: The Application Portfolio Manager**
- **Task**: Understand where each application is documented
- **APM Need**: View "Where used?" for any APM entry across all models
- **Outcome**: Portfolio coverage metrics, identify undocumented apps

**Persona 4: The Technology Strategist**
- **Task**: Plan migration roadmap showing current vs. target state
- **APM Need**: See lifecycle status, planned decommission dates on diagram
- **Outcome**: Roadmap reflects actual portfolio timelines

---

## 3. Product Vision & Business Context

### 3.1 How Architects Will Use APM Integration

**Scenario 1: Building a New System Context Diagram**

1. Architect opens TIDE with a new model
2. Opens APM Browser panel in Primary Sidebar
3. Searches "order" → Sees Order Service, Order API, Order DB
4. Drags "Order Service" to canvas
5. Element appears with:
   - Name: "Order Service" (from APM)
   - Owner: "Platform Team" (from APM)
   - Status: "Production" (from APM)
   - Tech Stack: "Node.js, PostgreSQL" (from APM)
6. Properties Panel shows APM Link: `APM-2847 | Last sync: Just now`
7. Architect connects to other elements and continues modeling

**Scenario 2: Linking Existing Shapes to APM**

1. Architect has a diagram with 15 generic "Application Component" shapes
2. Selects "Payment Gateway" shape
3. Clicks "Link to APM" in Properties Panel
4. Search dialog appears → Types "payment"
5. Selects "PAY-GW-001: Payment Gateway Service"
6. Shape updates:
   - Properties populated from APM
   - Link indicator appears on shape
   - Sync status shows in Properties Panel
7. Repeats for remaining shapes

**Scenario 3: Creating a New APM Entry from Canvas**

1. Architect is designing a new system not yet in portfolio
2. Creates "New Fraud Detection Service" shape on canvas
3. Clicks "Create in APM" in Properties Panel
4. Draft APM entry form appears:
   - Name: "Fraud Detection Service" (from shape)
   - Type: "Application Service"
   - Owner: (architect fills in)
   - Domain: (architect selects)
5. Submits draft → Entry created with status "Draft - Pending Approval"
6. Shape now linked to draft entry
7. When APM team approves, status updates automatically

**Scenario 4: Handling APM Changes**

1. Portfolio manager updates "Order Service" owner in APM
2. Architect opens diagram containing Order Service
3. Sync indicator shows "1 change available"
4. Architect clicks to review:
   - Owner changed: "Platform Team" → "Commerce Team"
5. Accepts change → Diagram updates
6. Or rejects → Diagram keeps old value, conflict noted

### 3.2 The Integration Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    APM INTEGRATION ARCHITECTURE                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────────┐         ┌──────────────────┐                  │
│  │   APM MODULE     │◄───────►│  DESIGN IDE      │                  │
│  │   (Source of     │  Sync   │  (TIDE)          │                  │
│  │    Truth)        │  Layer  │                  │                  │
│  └────────┬─────────┘         └────────┬─────────┘                  │
│           │                            │                             │
│           ▼                            ▼                             │
│  ┌──────────────────┐         ┌──────────────────┐                  │
│  │ APM Database     │         │ Model Database   │                  │
│  │                  │         │                  │                  │
│  │ • Applications   │         │ • Canvas Elements│                  │
│  │ • Services       │         │ • APM Links      │                  │
│  │ • Integrations   │         │ • Properties     │                  │
│  │ • Owners         │         │ • Relationships  │                  │
│  │ • Tech Stack     │         │                  │                  │
│  │ • Lifecycle      │         │                  │                  │
│  └──────────────────┘         └──────────────────┘                  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                    APM LINK RECORD                            │   │
│  ├──────────────────────────────────────────────────────────────┤   │
│  │  Canvas Element ID: elm-abc-123                              │   │
│  │  APM Application ID: APM-2847                                │   │
│  │  Link Status: Active                                         │   │
│  │  Sync Direction: APM → Canvas                                │   │
│  │  Last Sync: 2025-12-13T14:30:00Z                            │   │
│  │  Sync Conflicts: None                                        │   │
│  │  Property Overrides: { description: "Custom" }               │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.3 Integration with TIDE Zones

| TIDE Zone | APM Integration Component |
|-----------|--------------------------|
| **Z1 - Activity Bar** | "APM" icon opens APM Browser |
| **Z2 - Primary Sidebar** | APM Browser panel with portfolio search |
| **Z3 - Canvas** | Linked elements show APM indicator badge |
| **Z4 - Properties Panel** | APM Link section with sync controls |
| **Z5 - Panel Area** | APM Sync tab showing all linked elements |
| **Z6 - Status Bar** | APM connection status indicator |

---

## 4. APM Data Model Overview

### 4.1 APM Application Record (40+ Attributes)

The APM module stores comprehensive application data. When linking elements to APM, these attributes become available:

#### Identity Group

| Attribute | Type | Description |
|-----------|------|-------------|
| `apm_id` | string | Unique identifier (e.g., APM-2847) |
| `name` | string | Official application name |
| `display_name` | string | Human-friendly name |
| `description` | text | What the application does |
| `aliases` | array | Alternative names |
| `version` | string | Current version |

#### Classification Group

| Attribute | Type | Description |
|-----------|------|-------------|
| `type` | enum | Application, Service, Component, API, Database |
| `category` | enum | Core, Supporting, Enabling |
| `criticality` | enum | Critical, High, Medium, Low |
| `domain` | reference | Business domain |
| `capability` | reference | Business capability supported |

#### Technology Stack Group

| Attribute | Type | Description |
|-----------|------|-------------|
| `primary_language` | enum | Java, Python, JavaScript, etc. |
| `frameworks` | array | Spring, React, Django, etc. |
| `runtime` | enum | JVM, Node.js, .NET, etc. |
| `database` | array | PostgreSQL, MongoDB, etc. |
| `hosting` | enum | AWS, Azure, GCP, On-Prem |
| `container_platform` | enum | Kubernetes, ECS, etc. |

#### Ownership Group

| Attribute | Type | Description |
|-----------|------|-------------|
| `owner_team` | reference | Owning team |
| `owner_individual` | reference | Technical owner |
| `product_manager` | reference | Business owner |
| `escalation_contact` | string | Emergency contact |
| `support_group` | reference | Support team |

#### Business Context Group

| Attribute | Type | Description |
|-----------|------|-------------|
| `business_domain` | reference | Business domain |
| `value_stream` | reference | Value stream participation |
| `capabilities_supported` | array | Business capabilities |
| `revenue_impact` | enum | Direct, Indirect, Supporting |
| `customer_facing` | boolean | Is customer-facing? |

#### Integration Group

| Attribute | Type | Description |
|-----------|------|-------------|
| `upstream_dependencies` | array | Apps this depends on |
| `downstream_consumers` | array | Apps that depend on this |
| `apis_exposed` | array | APIs provided |
| `apis_consumed` | array | APIs used |
| `data_flows` | array | Data flow mappings |

#### Metrics Group

| Attribute | Type | Description |
|-----------|------|-------------|
| `monthly_transactions` | number | Transaction volume |
| `avg_response_time_ms` | number | Performance metric |
| `uptime_sla` | number | SLA percentage |
| `incident_count_30d` | number | Recent incidents |
| `last_deployment` | date | Most recent deploy |

#### Cost Group

| Attribute | Type | Description |
|-----------|------|-------------|
| `annual_cost` | currency | Total cost of ownership |
| `infrastructure_cost` | currency | Hosting costs |
| `license_cost` | currency | Software licenses |
| `support_cost` | currency | Maintenance costs |
| `cost_center` | string | Financial allocation |

#### Lifecycle Group

| Attribute | Type | Description |
|-----------|------|-------------|
| `status` | enum | Planning, Development, Production, Sunset, Retired |
| `phase` | enum | Invest, Maintain, Migrate, Eliminate |
| `go_live_date` | date | Production launch |
| `planned_sunset_date` | date | Planned retirement |
| `last_major_update` | date | Last significant change |

#### Reference Group

| Attribute | Type | Description |
|-----------|------|-------------|
| `documentation_url` | url | Docs link |
| `repository_url` | url | Code repository |
| `monitoring_url` | url | Monitoring dashboard |
| `runbook_url` | url | Operations runbook |
| `architecture_diagram` | reference | Link to Arkhitekton model |

### 4.2 Properties Synced to Canvas Elements

When an element is linked to APM, these properties auto-populate:

| Canvas Property | APM Source | Sync Direction |
|----------------|------------|----------------|
| Name | `name` | APM → Canvas (authoritative) |
| Description | `description` | Bi-directional |
| Owner | `owner_team.name` | APM → Canvas |
| Status | `status` | APM → Canvas |
| Technology | `primary_language`, `frameworks` | APM → Canvas |
| Criticality | `criticality` | APM → Canvas |
| Domain | `business_domain.name` | APM → Canvas |
| Custom Properties | N/A | Canvas only |

---

## 5. Integration Architecture

### 5.1 APM Browser Panel

```
┌─────────────────────────────────────────────────────────────────┐
│ APM BROWSER                                        [↻] [⚙] [×] │
├─────────────────────────────────────────────────────────────────┤
│ 🔍 Search applications...                                       │
├─────────────────────────────────────────────────────────────────┤
│ FILTERS                                                         │
│ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐          │
│ │ Domain ▾      │ │ Status ▾      │ │ Owner ▾       │          │
│ │ All Domains   │ │ All           │ │ All Teams     │          │
│ └───────────────┘ └───────────────┘ └───────────────┘          │
├─────────────────────────────────────────────────────────────────┤
│ RESULTS (47 applications)                                       │
├─────────────────────────────────────────────────────────────────┤
│ ▼ CUSTOMER DOMAIN (12)                                          │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │ 📦 Customer Portal           [Production] [Drag ≡]      │  │
│   │    APM-1001 • Platform Team • React, Node.js            │  │
│   ├─────────────────────────────────────────────────────────┤  │
│   │ 📦 Customer API              [Production] [Drag ≡]      │  │
│   │    APM-1002 • API Team • Java, Spring                   │  │
│   ├─────────────────────────────────────────────────────────┤  │
│   │ 📦 Identity Service          [Production] [Drag ≡]      │  │
│   │    APM-1003 • Security Team • Go                        │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│ ▼ ORDER DOMAIN (8)                                              │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │ 📦 Order Service             [Production] [Drag ≡]      │  │
│   │    APM-2847 • Commerce Team • Node.js, PostgreSQL       │  │
│   ├─────────────────────────────────────────────────────────┤  │
│   │ 📦 Order API                 [Production] [Drag ≡]      │  │
│   │    APM-2848 • Commerce Team • Node.js                   │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│ ▶ PAYMENT DOMAIN (7)                                            │
│ ▶ INFRASTRUCTURE (15)                                           │
│ ▶ INTEGRATION (5)                                               │
├─────────────────────────────────────────────────────────────────┤
│ 💡 Drag items to canvas to create linked elements               │
│    or select an existing element and click "Link to APM"        │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 Properties Panel APM Section

```
┌─────────────────────────────────────────────────────────────────┐
│ PROPERTIES                              [Order Service] ▾       │
├─────────────────────────────────────────────────────────────────┤
│ ▼ IDENTITY                                                      │
│   Name: Order Service                                           │
│   Description: Manages order lifecycle                          │
│   Type: Application Component                                   │
│                                                                 │
│ ▼ APM LINK                                    [● Linked]       │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │ 🔗 APM-2847: Order Service                              │  │
│   │    ─────────────────────────────────────────────────    │  │
│   │    Owner: Commerce Team                                 │  │
│   │    Status: Production                                   │  │
│   │    Domain: Order Management                             │  │
│   │    Criticality: High                                    │  │
│   │    ─────────────────────────────────────────────────    │  │
│   │    Last Sync: 2 min ago              [↻ Sync Now]       │  │
│   │    Sync Status: ✓ Up to date                            │  │
│   │    ─────────────────────────────────────────────────    │  │
│   │    [View in APM]  [Unlink]  [View Changes]              │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│   SYNC SETTINGS                                                 │
│   ☑ Auto-sync name                                             │
│   ☑ Auto-sync status                                           │
│   ☑ Auto-sync owner                                            │
│   ☐ Auto-sync description (I prefer my own)                    │
│                                                                 │
│ ▼ TECHNOLOGY (from APM)                                         │
│   Primary Language: Node.js                                     │
│   Frameworks: Express, TypeORM                                  │
│   Database: PostgreSQL                                          │
│   Hosting: AWS ECS                                              │
│                                                                 │
│ ▼ LIFECYCLE (from APM)                                          │
│   Status: Production                                            │
│   Phase: Maintain                                               │
│   Go-Live: 2023-06-15                                          │
│   Planned Sunset: (none)                                        │
│                                                                 │
│ ▼ CUSTOM PROPERTIES                                             │
│   (local to this diagram)                                       │
│   [ + Add Property ]                                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 5.3 Link States & Visual Indicators

| State | Badge | Description | Actions |
|-------|-------|-------------|---------|
| **Unlinked** | (none) | Shape has no APM connection | "Link to APM" |
| **Linked** | 🔗 | Active connection, in sync | "Unlink", "View in APM" |
| **Draft** | 📝 | Linked to draft APM entry | "Submit for Approval" |
| **Stale** | ⚠️ | APM changed, pending review | "Review Changes" |
| **Conflict** | ❌ | Local override conflicts with APM | "Resolve Conflict" |
| **Orphan** | 👻 | APM entry was deleted | "Relink or Remove" |

### 5.4 Sync Behavior Rules

| Scenario | Behavior |
|----------|----------|
| APM name changes | Canvas name updates automatically (if auto-sync enabled) |
| APM owner changes | Canvas property updates, notification shown |
| APM status changes | Canvas property updates, visual style may change (e.g., Retired = gray) |
| Canvas description edited | Local override stored, APM not updated |
| APM entry deleted | Element marked as "Orphan", architect notified |
| Element deleted from canvas | APM link removed, APM entry unchanged |
| New APM entry created | Does not auto-appear on canvas |

---

## 6. EPIC & Feature Definitions

### 6.1 EPIC Overview

| EPIC ID | Name | Description | Stories | Points |
|---------|------|-------------|---------|--------|
| EPIC-APM-01 | APM Browser Panel | Portfolio browser in Primary Sidebar | 6 | 42 |
| EPIC-APM-02 | Drag-to-Link Flow | Drag from APM Browser to canvas | 4 | 32 |
| EPIC-APM-03 | Shape-to-APM Binding | Link existing shapes to APM | 5 | 38 |
| EPIC-APM-04 | Property Sync Engine | Bi-directional sync with conflict handling | 6 | 52 |
| EPIC-APM-05 | Draft APM Entries | Create APM entries from canvas | 4 | 28 |
| EPIC-APM-06 | APM Sync Panel | Status overview, bulk operations | 4 | 26 |
| EPIC-APM-07 | Impact Analysis | Where-used queries across models | 4 | 32 |
| **TOTAL** | | | **33** | **250** |

### 6.2 EPIC-APM-01: APM Browser Panel

| Feature ID | Feature Name | Description |
|------------|--------------|-------------|
| FTR-APM-001 | APM Browser UI | Collapsible panel in Primary Sidebar |
| FTR-APM-002 | Application Search | Full-text search across APM fields |
| FTR-APM-003 | Filter by Domain | Filter by business domain |
| FTR-APM-004 | Filter by Status | Filter by lifecycle status |
| FTR-APM-005 | Filter by Owner | Filter by owning team |
| FTR-APM-006 | Application Preview | Tooltip with key attributes |

### 6.3 EPIC-APM-02: Drag-to-Link Flow

| Feature ID | Feature Name | Description |
|------------|--------------|-------------|
| FTR-APM-010 | Drag from Browser | Drag APM item to canvas creates linked element |
| FTR-APM-011 | Smart Element Type | Element type matches APM application type |
| FTR-APM-012 | Property Population | Properties auto-fill from APM |
| FTR-APM-013 | Link Confirmation | Visual confirmation of successful link |

### 6.4 EPIC-APM-03: Shape-to-APM Binding

| Feature ID | Feature Name | Description |
|------------|--------------|-------------|
| FTR-APM-020 | Link to APM Action | Context menu and Properties Panel action |
| FTR-APM-021 | APM Search Dialog | Search and select APM entry |
| FTR-APM-022 | AI Matching | AI suggests APM entries based on shape name |
| FTR-APM-023 | Bulk Linking | Select multiple shapes, link in batch |
| FTR-APM-024 | Unlink Action | Remove APM link, keep element |

### 6.5 EPIC-APM-04: Property Sync Engine

| Feature ID | Feature Name | Description |
|------------|--------------|-------------|
| FTR-APM-030 | Initial Sync | Populate properties on link creation |
| FTR-APM-031 | Change Detection | Detect APM changes since last sync |
| FTR-APM-032 | Auto-Sync Rules | Configurable auto-sync per property |
| FTR-APM-033 | Manual Sync | "Sync Now" action |
| FTR-APM-034 | Local Overrides | Store canvas-specific values |
| FTR-APM-035 | Conflict Resolution | UI to resolve sync conflicts |

### 6.6 EPIC-APM-05: Draft APM Entries

| Feature ID | Feature Name | Description |
|------------|--------------|-------------|
| FTR-APM-040 | Create in APM | Create draft entry from canvas element |
| FTR-APM-041 | Draft Form | Pre-filled form with element data |
| FTR-APM-042 | Approval Workflow | Submit draft for APM team review |
| FTR-APM-043 | Draft Status Sync | Update element when draft approved |

### 6.7 EPIC-APM-06: APM Sync Panel

| Feature ID | Feature Name | Description |
|------------|--------------|-------------|
| FTR-APM-050 | Sync Panel UI | Tab in Panel Area showing all linked elements |
| FTR-APM-051 | Status Overview | Count of linked, stale, orphan elements |
| FTR-APM-052 | Bulk Sync | Sync all elements at once |
| FTR-APM-053 | Filter by Status | Show only stale or orphan items |

### 6.8 EPIC-APM-07: Impact Analysis

| Feature ID | Feature Name | Description |
|------------|--------------|-------------|
| FTR-APM-060 | Where Used Query | Find all models containing an APM entry |
| FTR-APM-061 | Cross-Model Search | Search linked elements across workspace |
| FTR-APM-062 | Usage Report | Export APM usage across diagrams |
| FTR-APM-063 | Dependency Visualization | Show upstream/downstream on canvas |

---

## 7. High-Level Requirements

### 7.1 EPIC-APM-01: APM Browser Panel

| HLR ID | Requirement | Priority | Story |
|--------|-------------|----------|-------|
| HLR-APM-001 | APM Browser shall display in Primary Sidebar when APM icon clicked | Must | US-APM-001 |
| HLR-APM-002 | Browser shall show applications grouped by domain | Must | US-APM-001 |
| HLR-APM-003 | Search shall return results within 200ms | Must | US-APM-002 |
| HLR-APM-004 | Search shall match name, aliases, APM ID, and description | Must | US-APM-002 |
| HLR-APM-005 | Browser shall filter by domain, status, and owner | Should | US-APM-003 |
| HLR-APM-006 | Application hover shall show preview tooltip | Should | US-APM-004 |
| HLR-APM-007 | Browser shall paginate results (50 per page) | Should | US-APM-005 |
| HLR-APM-008 | Browser shall show connection status indicator | Must | US-APM-006 |

### 7.2 EPIC-APM-02: Drag-to-Link Flow

| HLR ID | Requirement | Priority | Story |
|--------|-------------|----------|-------|
| HLR-APM-009 | Drag from browser shall create element at drop position | Must | US-APM-007 |
| HLR-APM-010 | Created element shall be pre-linked to APM entry | Must | US-APM-007 |
| HLR-APM-011 | Element type shall match APM application type | Should | US-APM-008 |
| HLR-APM-012 | Properties shall auto-populate from APM | Must | US-APM-009 |
| HLR-APM-013 | Link indicator shall appear on element | Must | US-APM-010 |

### 7.3 EPIC-APM-03: Shape-to-APM Binding

| HLR ID | Requirement | Priority | Story |
|--------|-------------|----------|-------|
| HLR-APM-014 | "Link to APM" shall be available in context menu | Must | US-APM-011 |
| HLR-APM-015 | "Link to APM" shall be available in Properties Panel | Must | US-APM-011 |
| HLR-APM-016 | Link dialog shall allow search and selection | Must | US-APM-012 |
| HLR-APM-017 | AI shall suggest APM matches based on element name | Should | US-APM-013 |
| HLR-APM-018 | Multiple elements shall be linkable in batch | Should | US-APM-014 |
| HLR-APM-019 | Unlinking shall preserve element, remove APM connection | Must | US-APM-015 |

### 7.4 EPIC-APM-04: Property Sync Engine

| HLR ID | Requirement | Priority | Story |
|--------|-------------|----------|-------|
| HLR-APM-020 | Initial link shall populate all APM properties | Must | US-APM-016 |
| HLR-APM-021 | System shall detect APM changes since last sync | Must | US-APM-017 |
| HLR-APM-022 | Auto-sync rules shall be configurable per property | Should | US-APM-018 |
| HLR-APM-023 | "Sync Now" shall refresh all linked properties | Must | US-APM-019 |
| HLR-APM-024 | Local overrides shall be preserved during sync | Must | US-APM-020 |
| HLR-APM-025 | Conflicts shall be surfaced with resolution UI | Must | US-APM-021 |
| HLR-APM-026 | Deleted APM entries shall mark elements as orphan | Must | US-APM-022 |

### 7.5 EPIC-APM-05: Draft APM Entries

| HLR ID | Requirement | Priority | Story |
|--------|-------------|----------|-------|
| HLR-APM-027 | "Create in APM" shall open draft entry form | Should | US-APM-023 |
| HLR-APM-028 | Form shall pre-fill from element properties | Should | US-APM-023 |
| HLR-APM-029 | Draft shall link to element immediately | Should | US-APM-024 |
| HLR-APM-030 | Approval status shall sync to element | Should | US-APM-025 |

### 7.6 EPIC-APM-06: APM Sync Panel

| HLR ID | Requirement | Priority | Story |
|--------|-------------|----------|-------|
| HLR-APM-031 | Panel shall show all linked elements in current model | Must | US-APM-026 |
| HLR-APM-032 | Panel shall show sync status counts | Should | US-APM-027 |
| HLR-APM-033 | "Sync All" shall update all linked elements | Should | US-APM-028 |
| HLR-APM-034 | Filters shall show stale, orphan, or all items | Should | US-APM-029 |

### 7.7 EPIC-APM-07: Impact Analysis

| HLR ID | Requirement | Priority | Story |
|--------|-------------|----------|-------|
| HLR-APM-035 | "Where Used" shall show all models containing APM entry | Should | US-APM-030 |
| HLR-APM-036 | Results shall link to specific elements in models | Should | US-APM-030 |
| HLR-APM-037 | Usage report shall be exportable | Could | US-APM-031 |
| HLR-APM-038 | Dependencies from APM shall be visualizable on canvas | Could | US-APM-032 |

---

## 8. User Stories with Gherkin Specifications

### 8.1 EPIC-APM-01: APM Browser Panel

#### US-APM-001: APM Browser Panel UI

| Field | Value |
|-------|-------|
| **Story ID** | US-APM-001 |
| **Title** | APM Browser Panel UI |
| **Epic** | EPIC-APM-01: APM Browser Panel |
| **Story Points** | 8 |
| **Priority** | High |
| **HLR Trace** | HLR-APM-001, HLR-APM-002 |

**As a** technology architect,
**I want** to browse my organization's application portfolio from within TIDE,
**So that** I can quickly find and use real applications in my diagrams.

**Acceptance Criteria:**

```gherkin
Feature: APM Browser Panel UI

  Scenario: Open APM Browser
    Given I am in the Design IDE with a model open
    When I click the "APM" icon in the Activity Bar
    Then the Primary Sidebar shows the APM Browser panel
    And the browser displays a search box
    And the browser shows applications grouped by domain

  Scenario: View Domain Groups
    Given the APM Browser is open
    Then I see collapsible domain groups:
      | Domain | Count |
      | Customer Domain | 12 |
      | Order Domain | 8 |
      | Payment Domain | 7 |
    When I expand "Order Domain"
    Then I see applications in that domain

  Scenario: Application Item Display
    Given the APM Browser is open
    And "Order Domain" is expanded
    Then each application shows:
      | Field | Example |
      | Icon | 📦 |
      | Name | Order Service |
      | APM ID | APM-2847 |
      | Owner | Commerce Team |
      | Status Badge | [Production] |
      | Drag Handle | [≡] |
```

---

#### US-APM-002: APM Search

| Field | Value |
|-------|-------|
| **Story ID** | US-APM-002 |
| **Title** | APM Search |
| **Epic** | EPIC-APM-01: APM Browser Panel |
| **Story Points** | 5 |
| **Priority** | High |
| **HLR Trace** | HLR-APM-003, HLR-APM-004 |

**As a** technology architect,
**I want** to search for applications by name, ID, or keyword,
**So that** I can quickly find the specific application I need.

**Acceptance Criteria:**

```gherkin
Feature: APM Search

  Scenario: Search by Name
    Given the APM Browser is open
    When I type "order" in the search box
    Then results appear within 200ms
    And I see "Order Service", "Order API", "Order Processing"

  Scenario: Search by APM ID
    Given the APM Browser is open
    When I type "APM-2847"
    Then I see "Order Service" in the results

  Scenario: Search by Alias
    Given "Order Service" has alias "OMS"
    When I type "OMS" in search
    Then I see "Order Service" in the results

  Scenario: No Results
    Given the APM Browser is open
    When I type "xyznonexistent"
    Then I see "No applications found"
    And I see "Try a different search term"
```

---

### 8.2 EPIC-APM-02: Drag-to-Link Flow

#### US-APM-007: Drag APM Application to Canvas

| Field | Value |
|-------|-------|
| **Story ID** | US-APM-007 |
| **Title** | Drag APM Application to Canvas |
| **Epic** | EPIC-APM-02: Drag-to-Link Flow |
| **Story Points** | 8 |
| **Priority** | High |
| **HLR Trace** | HLR-APM-009, HLR-APM-010 |

**As a** technology architect,
**I want** to drag an application from the APM Browser to the canvas,
**So that** I can quickly add portfolio applications to my diagram.

**Acceptance Criteria:**

```gherkin
Feature: Drag APM Application to Canvas

  Scenario: Drag and Drop Creates Linked Element
    Given the APM Browser is open
    And I see "Order Service" (APM-2847) in the list
    When I drag "Order Service" from the browser
    And I drop it on the canvas at position (400, 300)
    Then a new element appears at (400, 300)
    And the element name is "Order Service"
    And the element is linked to APM-2847
    And a link indicator (🔗) appears on the element

  Scenario: Element Type Matches APM Type
    Given "Order Service" is classified as "Microservice" in APM
    When I drag "Order Service" to the canvas
    Then the created element type is "Application Component"
    Because Microservice maps to Application Component

  Scenario: Properties Auto-Populate
    Given I have dragged "Order Service" to the canvas
    Then the Properties Panel shows:
      | Property | Value | Source |
      | Name | Order Service | APM |
      | Owner | Commerce Team | APM |
      | Status | Production | APM |
      | Technology | Node.js | APM |
      | APM Link | APM-2847 ✓ | |
```

---

### 8.3 EPIC-APM-03: Shape-to-APM Binding

#### US-APM-011: Link Existing Shape to APM

| Field | Value |
|-------|-------|
| **Story ID** | US-APM-011 |
| **Title** | Link Existing Shape to APM |
| **Epic** | EPIC-APM-03: Shape-to-APM Binding |
| **Story Points** | 8 |
| **Priority** | High |
| **HLR Trace** | HLR-APM-014, HLR-APM-015 |

**As a** technology architect,
**I want** to link an existing diagram element to an APM application,
**So that** I can connect my existing diagrams to the portfolio.

**Acceptance Criteria:**

```gherkin
Feature: Link Existing Shape to APM

  Scenario: Link via Context Menu
    Given I have an unlinked "Payment Gateway" element on canvas
    When I right-click the element
    And I select "Link to APM..."
    Then a search dialog appears
    And I can search for APM applications

  Scenario: Link via Properties Panel
    Given I have selected an unlinked element
    And the Properties Panel shows "APM Link: Not linked"
    When I click "Link to APM"
    Then the APM search dialog appears

  Scenario: Complete the Link
    Given the APM search dialog is open
    When I search for "payment"
    And I select "PAY-GW-001: Payment Gateway Service"
    And I click "Link"
    Then the dialog closes
    And the element shows link indicator (🔗)
    And the Properties Panel shows "APM Link: PAY-GW-001 ✓"
    And properties are populated from APM
```

---

#### US-APM-013: AI-Suggested APM Matches

| Field | Value |
|-------|-------|
| **Story ID** | US-APM-013 |
| **Title** | AI-Suggested APM Matches |
| **Epic** | EPIC-APM-03: Shape-to-APM Binding |
| **Story Points** | 8 |
| **Priority** | Medium |
| **HLR Trace** | HLR-APM-017 |

**As a** technology architect,
**I want** AI to suggest APM applications that match my element,
**So that** I can quickly link without manual searching.

**Acceptance Criteria:**

```gherkin
Feature: AI-Suggested APM Matches

  Scenario: AI Suggests Based on Name
    Given I have an element named "Order Management System"
    When I click "Link to APM"
    Then the dialog shows "Suggested Matches":
      | Confidence | APM Entry | Reason |
      | 95% | APM-2847: Order Service | Name similarity |
      | 72% | APM-2901: Order Processing | Name similarity |

  Scenario: AI Suggests Based on Context
    Given my diagram contains "Payment Gateway" and "Checkout Service"
    And I have an element named "Card Processor"
    When I click "Link to APM"
    Then suggestions include payment-related applications
    Because context suggests payment domain

  Scenario: Accept AI Suggestion
    Given the AI suggests "APM-2847: Order Service" at 95%
    When I click the suggestion
    Then the element links to APM-2847
    And properties populate from APM
```

---

### 8.4 EPIC-APM-04: Property Sync Engine

#### US-APM-017: Detect APM Changes

| Field | Value |
|-------|-------|
| **Story ID** | US-APM-017 |
| **Title** | Detect APM Changes |
| **Epic** | EPIC-APM-04: Property Sync Engine |
| **Story Points** | 10 |
| **Priority** | High |
| **HLR Trace** | HLR-APM-021 |

**As a** technology architect,
**I want** to be notified when APM data changes,
**So that** I can keep my diagrams accurate.

**Acceptance Criteria:**

```gherkin
Feature: Detect APM Changes

  Scenario: APM Change Detected on Open
    Given "Order Service" element is linked to APM-2847
    And the APM owner was changed from "Platform Team" to "Commerce Team"
    When I open the model
    Then the element shows stale indicator (⚠️)
    And the Properties Panel shows "1 change available"

  Scenario: View Pending Changes
    Given an element shows "1 change available"
    When I click "View Changes"
    Then I see:
      | Property | Current | APM Value |
      | Owner | Platform Team | Commerce Team |
    And I see "Accept" and "Keep Mine" buttons

  Scenario: Accept APM Change
    Given I am viewing pending changes
    When I click "Accept"
    Then the element owner updates to "Commerce Team"
    And the stale indicator disappears
    And sync status shows "Up to date"

  Scenario: Reject APM Change
    Given I am viewing pending changes
    When I click "Keep Mine"
    Then the element owner stays "Platform Team"
    And the stale indicator disappears
    And property shows "Local override" badge
```

---

#### US-APM-021: Conflict Resolution

| Field | Value |
|-------|-------|
| **Story ID** | US-APM-021 |
| **Title** | Conflict Resolution |
| **Epic** | EPIC-APM-04: Property Sync Engine |
| **Story Points** | 8 |
| **Priority** | High |
| **HLR Trace** | HLR-APM-025 |

**As a** technology architect,
**I want** to resolve conflicts between my diagram and APM,
**So that** I maintain control over my documentation.

**Acceptance Criteria:**

```gherkin
Feature: Conflict Resolution

  Scenario: Conflict on Same Property
    Given element description is "Handles all orders"
    And APM description changed to "Order lifecycle management"
    And element shows conflict indicator (❌)
    When I click "Resolve Conflict"
    Then I see:
      | Source | Value |
      | Your Diagram | Handles all orders |
      | APM | Order lifecycle management |
    And options: "Use APM", "Keep Mine", "Edit"

  Scenario: Resolve Using APM Value
    Given I am resolving a description conflict
    When I select "Use APM"
    Then description updates to "Order lifecycle management"
    And conflict indicator disappears

  Scenario: Resolve Keeping Local
    Given I am resolving a description conflict
    When I select "Keep Mine"
    Then description stays "Handles all orders"
    And property shows "Local override" badge
    And conflict indicator disappears

  Scenario: Resolve with Custom Edit
    Given I am resolving a description conflict
    When I select "Edit"
    Then I can type a new value
    When I enter "Manages order lifecycle and history"
    And click "Save"
    Then description updates to my custom value
    And property shows "Local override" badge
```

---

### 8.5 EPIC-APM-05: Draft APM Entries

#### US-APM-023: Create APM Entry from Canvas

| Field | Value |
|-------|-------|
| **Story ID** | US-APM-023 |
| **Title** | Create APM Entry from Canvas |
| **Epic** | EPIC-APM-05: Draft APM Entries |
| **Story Points** | 8 |
| **Priority** | Medium |
| **HLR Trace** | HLR-APM-027, HLR-APM-028 |

**As a** technology architect,
**I want** to create a new APM entry from my diagram element,
**So that** new systems I design get added to the portfolio.

**Acceptance Criteria:**

```gherkin
Feature: Create APM Entry from Canvas

  Scenario: Open Create in APM Form
    Given I have an unlinked element "Fraud Detection Service"
    When I click "Create in APM" in the Properties Panel
    Then a draft APM entry form appears
    And the form is pre-filled:
      | Field | Value |
      | Name | Fraud Detection Service |
      | Type | (from element type) |
      | Description | (from element if available) |

  Scenario: Complete and Submit Draft
    Given the APM draft form is open
    When I fill in:
      | Field | Value |
      | Owner | Risk Team |
      | Domain | Fraud Management |
      | Criticality | High |
    And I click "Submit for Approval"
    Then a draft APM entry is created
    And the element links to the draft
    And element shows draft indicator (📝)
    And Properties Panel shows "APM Status: Draft - Pending Approval"

  Scenario: Draft Approved
    Given element is linked to draft APM entry
    When the APM team approves the entry
    Then the element updates to "APM Status: Approved"
    And the draft indicator changes to link indicator (🔗)
    And the element now has a real APM ID
```

---

### 8.6 EPIC-APM-07: Impact Analysis

#### US-APM-030: Where Is This Application Used?

| Field | Value |
|-------|-------|
| **Story ID** | US-APM-030 |
| **Title** | Where Is This Application Used? |
| **Epic** | EPIC-APM-07: Impact Analysis |
| **Story Points** | 10 |
| **Priority** | Medium |
| **HLR Trace** | HLR-APM-035, HLR-APM-036 |

**As a** technology architect or portfolio manager,
**I want** to find all diagrams that reference an application,
**So that** I can assess impact before making changes.

**Acceptance Criteria:**

```gherkin
Feature: Where Is This Application Used?

  Scenario: Query from APM Browser
    Given the APM Browser is open
    When I right-click "Order Service" (APM-2847)
    And select "Where Used?"
    Then a panel shows all models referencing APM-2847:
      | Model | Element | Owner | Last Modified |
      | Order Flow Architecture | Order Service | @john | 2 days ago |
      | Microservices Overview | Order Service | @sarah | 1 week ago |
      | Integration Landscape | Order API Wrapper | @mike | 3 weeks ago |

  Scenario: Navigate to Usage
    Given the Where Used results are showing
    When I click "Order Flow Architecture"
    Then that model opens
    And the canvas pans to the "Order Service" element
    And the element is selected

  Scenario: Query from Canvas
    Given I have selected a linked element
    When I right-click and select "Where Else Used?"
    Then I see other models containing this APM entry
    And current model is excluded from results
```

---

## 9. Requirements Traceability Matrix

### 9.1 Story-to-HLR Mapping

| Story ID | Title | HLRs | Points |
|----------|-------|------|--------|
| US-APM-001 | APM Browser Panel UI | HLR-APM-001, HLR-APM-002 | 8 |
| US-APM-002 | APM Search | HLR-APM-003, HLR-APM-004 | 5 |
| US-APM-003 | APM Filters | HLR-APM-005 | 5 |
| US-APM-004 | Application Preview | HLR-APM-006 | 5 |
| US-APM-005 | Pagination | HLR-APM-007 | 5 |
| US-APM-006 | Connection Status | HLR-APM-008 | 5 |
| US-APM-007 | Drag APM to Canvas | HLR-APM-009, HLR-APM-010 | 8 |
| US-APM-008 | Smart Element Type | HLR-APM-011 | 5 |
| US-APM-009 | Property Auto-Population | HLR-APM-012 | 8 |
| US-APM-010 | Link Indicator | HLR-APM-013 | 5 |
| US-APM-011 | Link Existing Shape | HLR-APM-014, HLR-APM-015 | 8 |
| US-APM-012 | APM Search Dialog | HLR-APM-016 | 5 |
| US-APM-013 | AI-Suggested Matches | HLR-APM-017 | 8 |
| US-APM-014 | Bulk Linking | HLR-APM-018 | 8 |
| US-APM-015 | Unlink Action | HLR-APM-019 | 5 |
| US-APM-016 | Initial Sync | HLR-APM-020 | 8 |
| US-APM-017 | Detect APM Changes | HLR-APM-021 | 10 |
| US-APM-018 | Auto-Sync Rules | HLR-APM-022 | 8 |
| US-APM-019 | Manual Sync | HLR-APM-023 | 5 |
| US-APM-020 | Local Overrides | HLR-APM-024 | 8 |
| US-APM-021 | Conflict Resolution | HLR-APM-025 | 8 |
| US-APM-022 | Orphan Detection | HLR-APM-026 | 5 |
| US-APM-023 | Create in APM | HLR-APM-027, HLR-APM-028 | 8 |
| US-APM-024 | Draft Linking | HLR-APM-029 | 5 |
| US-APM-025 | Approval Status Sync | HLR-APM-030 | 5 |
| US-APM-026 | APM Sync Panel | HLR-APM-031 | 8 |
| US-APM-027 | Status Counts | HLR-APM-032 | 5 |
| US-APM-028 | Sync All | HLR-APM-033 | 5 |
| US-APM-029 | Status Filters | HLR-APM-034 | 5 |
| US-APM-030 | Where Used Query | HLR-APM-035, HLR-APM-036 | 10 |
| US-APM-031 | Usage Report | HLR-APM-037 | 5 |
| US-APM-032 | Dependency Visualization | HLR-APM-038 | 8 |

### 9.2 Coverage Summary

| EPIC | Stories | Points | HLRs | Coverage |
|------|---------|--------|------|----------|
| EPIC-APM-01 | 6 | 33 | 8 | 100% |
| EPIC-APM-02 | 4 | 26 | 5 | 100% |
| EPIC-APM-03 | 5 | 34 | 6 | 100% |
| EPIC-APM-04 | 7 | 52 | 7 | 100% |
| EPIC-APM-05 | 3 | 18 | 4 | 100% |
| EPIC-APM-06 | 4 | 23 | 4 | 100% |
| EPIC-APM-07 | 3 | 23 | 4 | 100% |
| **TOTAL** | **32** | **209** | **38** | **100%** |

---

## 10. Appendix: API Specifications

### 10.1 APM Integration API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/apm/applications` | GET | List applications with pagination and filters |
| `/api/apm/applications/{id}` | GET | Get single application details |
| `/api/apm/applications/search` | POST | Full-text search across applications |
| `/api/apm/applications/{id}/where-used` | GET | Find models referencing this application |
| `/api/apm/drafts` | POST | Create draft application entry |
| `/api/apm/drafts/{id}` | GET/PUT | Manage draft entry |

### 10.2 Element Link API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/elements/{id}/apm-link` | POST | Create link to APM application |
| `/api/elements/{id}/apm-link` | DELETE | Remove APM link |
| `/api/elements/{id}/apm-link/sync` | POST | Trigger manual sync |
| `/api/elements/{id}/apm-link/changes` | GET | Get pending changes |
| `/api/elements/{id}/apm-link/resolve` | POST | Resolve conflict |

### 10.3 Sample API Responses

#### Application List Response

```json
{
  "applications": [
    {
      "apm_id": "APM-2847",
      "name": "Order Service",
      "display_name": "Order Service",
      "type": "Microservice",
      "domain": {
        "id": "DOM-001",
        "name": "Order Management"
      },
      "owner_team": {
        "id": "TEAM-042",
        "name": "Commerce Team"
      },
      "status": "Production",
      "criticality": "High",
      "tech_stack": {
        "primary_language": "Node.js",
        "frameworks": ["Express", "TypeORM"],
        "database": "PostgreSQL",
        "hosting": "AWS ECS"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 50,
    "total": 247
  }
}
```

#### Element Link Record

```json
{
  "link_id": "link-abc-123",
  "element_id": "elm-def-456",
  "apm_id": "APM-2847",
  "status": "active",
  "sync_direction": "apm_to_canvas",
  "last_sync": "2025-12-13T14:30:00Z",
  "sync_status": "up_to_date",
  "property_overrides": {
    "description": "Custom description for this diagram"
  },
  "auto_sync_rules": {
    "name": true,
    "owner": true,
    "status": true,
    "description": false
  }
}
```

---

**Document End**

*ARKDL-0008 | APM Integration & Portfolio Binding | Version 1.0 | December 2025*
*32 User Stories | 209 Story Points | 38 HLRs | 7 EPICs*
