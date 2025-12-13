# ARKHITEKTON | ARKDL-0007 Element Library & Notation Framework v1.0

# ARKHITEKTON
## Element Library & Notation Framework
### Product Requirements Specification

**EPICs | Features | High-Level Requirements | User Stories | Gherkin Specifications**

| Field | Value |
|-------|-------|
| **Document ID** | ARKDL-0007 |
| **Version** | 1.0 |
| **Date** | December 2025 |
| **Status** | Draft |
| **Module** | Element Library |
| **Parent Module** | Design IDE (TIDE) |
| **Related Documents** | ARKDL-0006 (Design IDE), ARKDL-0008 (APM Integration) |
| **Target Users** | Technology Architects, Solution Architects, Enterprise Architects |

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [The Technology Architect's Pain Points](#2-the-technology-architects-pain-points)
3. [Product Vision & Business Context](#3-product-vision--business-context)
4. [Framework & Notation Catalog](#4-framework--notation-catalog)
5. [Element Schema Architecture](#5-element-schema-architecture)
6. [EPIC & Feature Definitions](#6-epic--feature-definitions)
7. [High-Level Requirements](#7-high-level-requirements)
8. [User Stories with Gherkin Specifications](#8-user-stories-with-gherkin-specifications)
9. [Requirements Traceability Matrix](#9-requirements-traceability-matrix)
10. [Appendix: Complete Element Catalog](#10-appendix-complete-element-catalog)

---

## 1. Executive Summary

### 1.1 The Problem We're Solving

Technology architects face a fragmented tooling landscape. They use Visio for network diagrams, Lucidchart for cloud architectures, Archi for ArchiMate models, and draw.io for everything else. Each tool has its own icon library, its own property schema, and its own export format. The result? **Inconsistent diagrams, wasted time hunting for icons, and models that don't connect to enterprise reality.**

The Element Library & Notation Framework is Arkhitekton's answer to this chaos. It provides a **unified, semantically-rich catalog of 170+ architectural elements** spanning enterprise architecture (ArchiMate, TOGAF), business process (BPMN), software design (UML, C4), cloud infrastructure (AWS, Azure, GCP, OCI), container orchestration (Kubernetes), networking (Cisco), and standard shapes—all in one place, all with consistent properties, all with intelligent connection rules.

### 1.2 Vision Statement

> "Every element on the canvas has meaning. Every connection has rules. Every diagram tells a story that the AI understands, the enterprise can validate, and stakeholders can trust."

### 1.3 What Makes This Different

| Traditional Tools | Arkhitekton Element Library |
|-------------------|----------------------------|
| Shapes are just shapes | Elements are **semantic objects** with type, properties, and behavior |
| Icons scattered across stencil packs | **Unified catalog** with 170+ elements, searchable and categorized |
| No connection rules | **Intelligent validation** - ArchiMate elements only connect to valid targets |
| Properties are free-form text | **Typed properties** with required fields, dropdowns, and validation |
| AI doesn't understand your diagram | AI reads the **semantic model**, not just pixels |
| Export loses meaning | **ARKDL export** preserves full element definitions |

### 1.4 Business Value

| Metric | Current State | With Element Library |
|--------|---------------|---------------------|
| Time to find correct icon | 5-10 minutes | Under 10 seconds (search + favorites) |
| Connection errors caught | At review (days later) | Real-time validation |
| Diagram consistency | Manual enforcement | Automatic notation compliance |
| AI understanding | Guesses from shape names | Full semantic context |
| Cross-framework modeling | Not possible | Supported with adapters |

---

## 2. The Technology Architect's Pain Points

### 2.1 The Daily Struggle

Technology architects don't just draw diagrams—they **communicate complex systems** to executives, developers, operations teams, and auditors. Each audience needs different views, different levels of detail, and different notations. Yet the tools haven't kept up.

**Pain Point #1: Icon Hunt**
> "I spent 20 minutes looking for the right AWS icon. Then I found three different versions and didn't know which was current. By the time I finished, I'd lost my train of thought on the architecture."
> — Senior Solutions Architect, Financial Services

**Pain Point #2: Notation Confusion**
> "My ArchiMate model has UML classes mixed in because Archi didn't stop me. Now governance is rejecting the diagram and I have to redo it."
> — Enterprise Architect, Healthcare

**Pain Point #3: Property Chaos**
> "Every architect on my team documents components differently. Some put the owner in 'Description', some in 'Notes', some don't capture it at all. We can't report on what we have."
> — Chief Architect, Manufacturing

**Pain Point #4: Framework Silos**
> "I need to show how our business capabilities map to cloud services. But my capability model is in TOGAF and my infrastructure is in AWS icons. I literally cannot draw the connection."
> — Technology Strategist, Retail

**Pain Point #5: AI Blindness**
> "I asked the AI to 'add a database for user data' and it just drew a generic cylinder. It didn't know I was doing a C4 Container diagram and needed a specific element type."
> — Platform Architect, SaaS Startup

### 2.2 How Arkhitekton Solves These

| Pain Point | Element Library Solution |
|------------|-------------------------|
| **Icon Hunt** | Searchable catalog with favorites, recents, and AI-suggested elements |
| **Notation Confusion** | Framework-aware validation warns when mixing incompatible elements |
| **Property Chaos** | Standardized property schemas per element type with required fields |
| **Framework Silos** | Cross-framework adapters and semantic mapping layers |
| **AI Blindness** | AI reads element types, relationships, and properties—not just shapes |

### 2.3 User Personas

**Persona 1: The Enterprise Architect (EA)**
- **Frameworks**: ArchiMate 3.x, TOGAF, Capability Maps
- **Goal**: Document business-IT alignment, present to C-suite
- **Needs**: Consistent notation, governance-ready exports, business language

**Persona 2: The Solution Architect (SA)**
- **Frameworks**: C4 Model, AWS/Azure/GCP, UML
- **Goal**: Design systems for development teams
- **Needs**: Detailed technical properties, code-like precision, developer handoff

**Persona 3: The Infrastructure Architect (IA)**
- **Frameworks**: Cloud provider icons, Kubernetes, Cisco, Network diagrams
- **Goal**: Design and document infrastructure topology
- **Needs**: Accurate vendor icons, port/protocol properties, deployment views

**Persona 4: The Process Analyst (PA)**
- **Frameworks**: BPMN 2.0, Swimlanes, Flowcharts
- **Goal**: Model business processes for optimization
- **Needs**: BPMN compliance, process metrics, handoff to BPM tools

---

## 3. Product Vision & Business Context

### 3.1 How Architects Will Use the Element Library

**Scenario 1: Starting a New Cloud Architecture**

1. Architect clicks '+New Model' → Selects "AWS Architecture" template
2. Element Palette auto-filters to show AWS icons prominently
3. Architect types "lambda" in search → AWS Lambda icon appears instantly
4. Drags Lambda to canvas → Properties panel shows: Name, Runtime, Memory, Timeout, VPC
5. AI suggests: "Connect to API Gateway? Most Lambda architectures include one."

**Scenario 2: Modeling Business Capabilities**

1. Architect opens Palette → Navigates to Business Architecture category
2. Expands BizBOK / Capability Maps section
3. Drags "Business Capability" element to canvas
4. Properties panel shows: Capability Name, Level (L0/L1/L2/L3), Owner, Maturity, Strategic Importance
5. Right-clicks → "Decompose into Sub-Capabilities" creates child hierarchy

**Scenario 3: Creating an ArchiMate Model**

1. Architect switches viewpoint to "Application Cooperation Viewpoint"
2. Palette auto-filters to show only valid ArchiMate Application layer elements
3. Drags "Application Component" to canvas
4. Attempts to connect to "Business Actor" → **Validation warning**: "Direct connection not allowed in ArchiMate. Did you mean to use an Application Service?"
5. Architect adds Application Service as intermediary → Validation passes

**Scenario 4: Cross-Framework Integration**

1. Architect has ArchiMate Application Component on canvas
2. Wants to show it runs on AWS ECS
3. Opens cross-framework adapter → Links ArchiMate component to AWS ECS element
4. Both elements now show link indicator
5. Properties panel shows: "Implements: ArchiMate > Application Component > Order Service"

### 3.2 The Element Lifecycle

```
┌─────────────────────────────────────────────────────────────────────┐
│                    ELEMENT LIFECYCLE IN TIDE                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  1. DISCOVERY                                                        │
│     ┌──────────────────────────────────────────────────────────┐    │
│     │ • Search by name: "lambda", "gateway", "service"         │    │
│     │ • Browse by framework: ArchiMate > Application Layer     │    │
│     │ • Browse by vendor: AWS > Compute                        │    │
│     │ • AI suggestion: "Based on your model, consider adding..." │   │
│     │ • Recent/Favorites: Quick access to frequently used      │    │
│     └──────────────────────────────────────────────────────────┘    │
│                              │                                       │
│                              ▼                                       │
│  2. PLACEMENT                                                        │
│     ┌──────────────────────────────────────────────────────────┐    │
│     │ • Drag from palette to canvas                            │    │
│     │ • Right-click canvas > Insert > Select element           │    │
│     │ • Cmd+K > "Add [element name]"                           │    │
│     │ • AI: "Add an API Gateway" → Creates with smart defaults │    │
│     └──────────────────────────────────────────────────────────┘    │
│                              │                                       │
│                              ▼                                       │
│  3. CONFIGURATION                                                    │
│     ┌──────────────────────────────────────────────────────────┐    │
│     │ • Properties Panel: Edit name, type-specific attributes  │    │
│     │ • Style Panel: Override colors, size, label position     │    │
│     │ • APM Link: Connect to portfolio application (ARKDL-0008)│    │
│     │ • Custom Properties: Add user-defined key-value pairs    │    │
│     └──────────────────────────────────────────────────────────┘    │
│                              │                                       │
│                              ▼                                       │
│  4. CONNECTION                                                       │
│     ┌──────────────────────────────────────────────────────────┐    │
│     │ • Drag from anchor point to target element               │    │
│     │ • Validation: Check if connection type is allowed        │    │
│     │ • Relationship Properties: Label, type, direction        │    │
│     │ • AI: "This looks like a data flow. Should I label it?"  │    │
│     └──────────────────────────────────────────────────────────┘    │
│                              │                                       │
│                              ▼                                       │
│  5. VALIDATION                                                       │
│     ┌──────────────────────────────────────────────────────────┐    │
│     │ • Real-time: Notation compliance, required properties    │    │
│     │ • On-demand: Full model validation                       │    │
│     │ • Problems Panel: Errors, warnings, suggestions          │    │
│     │ • Quick Fix: One-click corrections                       │    │
│     └──────────────────────────────────────────────────────────┘    │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.3 Integration with TIDE Zones

| TIDE Zone | Element Library Integration |
|-----------|----------------------------|
| **Z1 - Activity Bar** | "Elements" icon opens Palette in Primary Sidebar |
| **Z2 - Primary Sidebar** | Element Palette with search, categories, favorites |
| **Z3 - Canvas** | Elements placed, styled, connected here |
| **Z4 - Properties Panel** | Element-specific properties, APM link, custom fields |
| **Z5 - Panel Area** | Validation errors from notation rules |
| **Z6 - Status Bar** | Current notation/viewpoint indicator |

---

## 4. Framework & Notation Catalog

### 4.1 Framework Summary

| Framework | Element Count | Vendor/Source | Primary Use Case |
|-----------|---------------|---------------|------------------|
| **ArchiMate 3.x** | 60+ | The Open Group | Enterprise architecture modeling |
| **TOGAF** | 4 | The Open Group | Architecture governance, ADM |
| **BPMN 2.0** | 29 | OMG | Business process modeling |
| **UML 2.5** | 15+ | OMG | Software design (future release) |
| **C4 Model** | 8 | Simon Brown | Software architecture documentation |
| **AWS** | 8+ (initial) | Amazon | Cloud infrastructure (AWS) |
| **Azure** | 8+ (initial) | Microsoft | Cloud infrastructure (Azure) |
| **GCP** | 8+ (initial) | Google | Cloud infrastructure (Google Cloud) |
| **OCI** | 20+ | Oracle | Cloud infrastructure (Oracle Cloud) |
| **Kubernetes** | 12+ | CNCF | Container orchestration |
| **Cisco** | 15+ | Cisco | Network topology |
| **BizBOK** | 6+ | IIBA | Business capability modeling |
| **Patterns** | 5 | Arkhitekton | Architecture patterns |
| **Shapes** | 28+ | Arkhitekton | Generic diagramming |
| **TOTAL** | **~170+** | | |

### 4.2 ArchiMate 3.x Elements (60+ Elements)

ArchiMate is the primary enterprise architecture notation in Arkhitekton, covering Business, Application, Technology, Strategy, and Motivation layers.

#### Business Layer (20 Elements)

| Element | Icon | Color | Description | Usage |
|---------|------|-------|-------------|-------|
| Business Actor | Person icon | Yellow (#F7DC6F) | Individual, team, or organization | Customer, Employee, Partner |
| Business Role | Hat icon | Yellow (#F7DC6F) | Responsibility assigned to actors | Account Manager, Approver |
| Business Collaboration | Overlapping figures | Yellow (#F7DC6F) | Aggregate of roles working together | Sales Team, Review Board |
| Business Interface | Vertical line | Yellow (#F7DC6F) | Access point for business services | Help Desk, Web Portal |
| Business Process | Rounded rectangle + arrow | Yellow (#F7DC6F) | Sequence of business behaviors | Order Fulfillment, Onboarding |
| Business Function | Rounded rectangle | Yellow (#F7DC6F) | Group of business behaviors | Finance, Marketing |
| Business Interaction | Double-headed arrow | Yellow (#F7DC6F) | Unit of behavior between roles | Negotiation, Collaboration |
| Business Event | Rounded rectangle + lightning | Yellow (#F7DC6F) | Something that happens | Order Received, Claim Filed |
| Business Service | Rounded rectangle + line | Yellow (#F7DC6F) | Externally visible behavior | Account Opening, Claims Processing |
| Business Object | Rectangle | Yellow (#F7DC6F) | Passive element with meaning | Contract, Invoice, Policy |
| Contract | Rectangle + lines | Yellow (#F7DC6F) | Formal agreement | SLA, Employment Contract |
| Representation | Document icon | Yellow (#F7DC6F) | Perceptible form of business object | PDF Report, Email |
| Product | Box icon | Yellow (#F7DC6F) | Coherent collection of services | Insurance Package, Software Suite |
| Value | Star icon | Yellow (#F7DC6F) | Relative worth, utility, importance | Customer Satisfaction, Revenue |
| Meaning | Speech bubble | Yellow (#F7DC6F) | Knowledge or expertise | Policy Interpretation |
| Location | Map pin | Yellow (#F7DC6F) | Place or position | Headquarters, Data Center |
| Grouping | Dashed rectangle | Gray (#BDC3C7) | Arbitrary aggregation | Regional Operations |
| Junction | Circle (AND/OR) | Gray (#BDC3C7) | Combine or split relationships | Process gateway |

#### Application Layer (12 Elements)

| Element | Icon | Color | Description | Usage |
|---------|------|-------|-------------|-------|
| Application Component | Square with corners | Blue (#5DADE2) | Modular, deployable software | Microservice, Module |
| Application Collaboration | Overlapping squares | Blue (#5DADE2) | Components working together | Service Mesh |
| Application Interface | Vertical line + square | Blue (#5DADE2) | Access point for app services | API, Web Interface |
| Application Function | Rounded square | Blue (#5DADE2) | Internal behavior | Calculate Premium |
| Application Interaction | Double-headed arrow + square | Blue (#5DADE2) | Unit of behavior between apps | API Call |
| Application Process | Rounded square + arrow | Blue (#5DADE2) | Sequence of app behaviors | ETL Pipeline |
| Application Event | Square + lightning | Blue (#5DADE2) | Application state change | Message Received |
| Application Service | Rounded square + line | Blue (#5DADE2) | Externally visible behavior | Authentication Service |
| Data Object | Rectangle + fold | Blue (#5DADE2) | Data accessed/created by app | Customer Record |

#### Technology Layer (15 Elements)

| Element | Icon | Color | Description | Usage |
|---------|------|-------|-------------|-------|
| Node | 3D box | Green (#58D68D) | Computational resource | Server, VM, Container |
| Device | 3D box + base | Green (#58D68D) | Physical hardware | Router, Laptop, IoT Device |
| System Software | 3D box + layer | Green (#58D68D) | Software platform | OS, DBMS, Middleware |
| Technology Collaboration | Overlapping 3D boxes | Green (#58D68D) | Nodes working together | Cluster, Farm |
| Technology Interface | Line + 3D box | Green (#58D68D) | Access point for tech services | JDBC, REST Endpoint |
| Path | Line | Green (#58D68D) | Link between nodes | Network Connection |
| Communication Network | Line + nodes | Green (#58D68D) | Set of structures for communication | LAN, WAN, VPN |
| Technology Function | Rounded 3D box | Green (#58D68D) | Internal tech behavior | Load Balancing |
| Technology Process | Rounded 3D box + arrow | Green (#58D68D) | Sequence of tech behaviors | Backup Process |
| Technology Interaction | Double arrow + 3D box | Green (#58D68D) | Unit of tech behavior | Protocol Exchange |
| Technology Event | 3D box + lightning | Green (#58D68D) | Tech state change | Server Down |
| Technology Service | Rounded 3D box + line | Green (#58D68D) | Externally visible tech behavior | Hosting Service |
| Artifact | Document + fold | Green (#58D68D) | Piece of data | Config File, JAR, Docker Image |
| Equipment | Hardware icon | Green (#58D68D) | Physical equipment | Firewall Appliance |
| Facility | Building icon | Green (#58D68D) | Physical structure | Data Center, Office |
| Distribution Network | Lines + box | Green (#58D68D) | Physical distribution | Power Grid, Cabling |
| Material | Package icon | Green (#58D68D) | Tangible physical matter | Server Hardware |

#### Strategy & Motivation Layer (13 Elements)

| Element | Icon | Color | Description | Usage |
|---------|------|-------|-------------|-------|
| Stakeholder | Person + lines | Purple (#AF7AC5) | Individual or group with interest | CIO, Regulator, Customer |
| Driver | Arrow up | Purple (#AF7AC5) | External or internal condition | Competition, Regulation |
| Assessment | Checkmark | Purple (#AF7AC5) | Analysis of driver | SWOT Item |
| Goal | Target | Purple (#AF7AC5) | End state to be achieved | Increase Market Share |
| Outcome | Flag | Purple (#AF7AC5) | Result that was achieved | Revenue Growth |
| Principle | Book | Purple (#AF7AC5) | Qualitative statement of intent | API-First, Cloud-Native |
| Requirement | List | Purple (#AF7AC5) | Statement of need | GDPR Compliance |
| Constraint | Barrier | Purple (#AF7AC5) | Restriction | Budget Limit, Legacy System |
| Resource | Cube | Orange (#E67E22) | Asset owned or controlled | Budget, Team, Patent |
| Capability | Rounded rectangle + star | Orange (#E67E22) | Ability possessed | Data Analytics |
| Value Stream | Arrow flow | Orange (#E67E22) | Sequence of activities | Order-to-Cash |
| Course of Action | Path with arrow | Orange (#E67E22) | Approach to achieve goal | Migrate to Cloud |
| Gap | Bracket | Orange (#E67E22) | Difference between baseline & target | Missing Skills |

### 4.3 Cloud Provider Elements

#### AWS Elements (8+ Initial)

| Element | Icon | Color | Description |
|---------|------|-------|-------------|
| EC2 Instance | Orange server | #FF9900 | Virtual compute server |
| Lambda | Lambda symbol | #FF9900 | Serverless function |
| S3 Bucket | Bucket icon | #569A31 | Object storage |
| RDS Instance | Database icon | #3B48CC | Managed relational database |
| DynamoDB | Table icon | #3B48CC | NoSQL database |
| API Gateway | Gateway icon | #9D5025 | Managed API service |
| VPC | Cloud outline | #1E8900 | Virtual private cloud |
| CloudFront | Globe | #8C4FFF | CDN distribution |

#### Azure Elements (8+ Initial)

| Element | Icon | Color | Description |
|---------|------|-------|-------------|
| Virtual Machine | VM icon | #0078D4 | Compute instance |
| Functions | Lightning bolt | #0078D4 | Serverless function |
| Blob Storage | Container icon | #0078D4 | Object storage |
| SQL Database | Database icon | #0078D4 | Managed SQL |
| Cosmos DB | Globe database | #0078D4 | Multi-model database |
| API Management | Gateway icon | #0078D4 | API gateway |
| Virtual Network | Network icon | #0078D4 | Virtual network |
| Front Door | Globe icon | #0078D4 | CDN and WAF |

#### GCP Elements (8+ Initial)

| Element | Icon | Color | Description |
|---------|------|-------|-------------|
| Compute Engine | VM icon | #4285F4 | Virtual machine |
| Cloud Functions | Functions icon | #4285F4 | Serverless function |
| Cloud Storage | Storage bucket | #4285F4 | Object storage |
| Cloud SQL | Database icon | #4285F4 | Managed SQL |
| Firestore | Document icon | #4285F4 | Document database |
| Cloud Endpoints | API icon | #4285F4 | API gateway |
| VPC Network | Network icon | #4285F4 | Virtual network |
| Cloud CDN | Globe icon | #4285F4 | Content delivery |

#### OCI Elements (20+ Initial)

| Element | Icon | Color | Description |
|---------|------|-------|-------------|
| Compute Instance | Server icon | #F80000 | Virtual machine |
| Functions | Function icon | #F80000 | Serverless function |
| Object Storage | Bucket icon | #F80000 | Object storage |
| Autonomous Database | Database icon | #F80000 | Self-managing database |
| NoSQL Database | Document icon | #F80000 | NoSQL database |
| API Gateway | Gateway icon | #F80000 | API management |
| VCN | Network icon | #F80000 | Virtual cloud network |
| Load Balancer | Balance icon | #F80000 | Traffic distribution |
| Container Engine | Container icon | #F80000 | Kubernetes service |
| Registry | Registry icon | #F80000 | Container registry |

### 4.4 BPMN 2.0 Elements (29 Elements)

#### Events (11 Elements)

| Element | Icon | Color | Description |
|---------|------|-------|-------------|
| Start Event | Thin circle | Green (#27AE60) | Process beginning |
| End Event | Thick circle | Red (#E74C3C) | Process termination |
| Intermediate Event | Double circle | Orange (#F39C12) | Mid-process event |
| Message Start Event | Circle + envelope | Green | Triggered by message |
| Message End Event | Circle + envelope | Red | Sends message |
| Timer Start Event | Circle + clock | Green | Triggered by time |
| Timer Intermediate Event | Double circle + clock | Orange | Wait for time |
| Error End Event | Circle + lightning | Red | Error thrown |
| Signal Event | Circle + triangle | Orange | Broadcast signal |
| Terminate End Event | Circle + filled | Red | Terminate all |
| Compensation Event | Circle + rewind | Orange | Compensation triggered |

#### Activities (6 Elements)

| Element | Icon | Color | Description |
|---------|------|-------|-------------|
| Task | Rounded rectangle | Blue (#3498DB) | Atomic work unit |
| User Task | Rounded rect + person | Blue | Human task |
| Service Task | Rounded rect + gear | Blue | Automated task |
| Script Task | Rounded rect + scroll | Blue | Script execution |
| Send Task | Rounded rect + envelope | Blue | Send message |
| Receive Task | Rounded rect + envelope | Blue | Receive message |
| Subprocess | Rounded rect + plus | Blue | Embedded process |
| Call Activity | Rounded rect + thick border | Blue | Reusable process |

#### Gateways (5 Elements)

| Element | Icon | Color | Description |
|---------|------|-------|-------------|
| Exclusive Gateway | Diamond + X | Yellow (#F1C40F) | XOR decision |
| Parallel Gateway | Diamond + plus | Yellow | AND split/join |
| Inclusive Gateway | Diamond + circle | Yellow | OR split/join |
| Event-Based Gateway | Diamond + pentagon | Yellow | Event-driven branch |
| Complex Gateway | Diamond + asterisk | Yellow | Complex conditions |

#### Artifacts & Swimlanes (7 Elements)

| Element | Icon | Color | Description |
|---------|------|-------|-------------|
| Data Object | Document | Gray (#7F8C8D) | Process data |
| Data Store | Cylinder | Gray | Persistent storage |
| Annotation | Text bracket | Gray | Documentation |
| Group | Dashed rectangle | Gray | Visual grouping |
| Pool | Container | Blue border | Participant |
| Lane | Row in pool | Blue border | Role/department |
| Message Flow | Dashed arrow | Black | Inter-pool message |

### 4.5 Generic Shapes (28+ Elements)

#### Basic Shapes

| Shape | Description | Use Case |
|-------|-------------|----------|
| Rectangle | Standard rectangle | Generic containers |
| Rounded Rectangle | Soft corners | Modern UI containers |
| Square | Equal sides | Icons, grids |
| Circle | Perfect circle | Status indicators |
| Ellipse | Oval shape | Decisions, emphasis |
| Triangle | Three-sided | Hierarchy indicators |
| Diamond | Rotated square | Decision points |
| Hexagon | Six-sided | Process steps |
| Octagon | Eight-sided | Stop/warning |
| Star | Multi-pointed | Highlights |
| Arrow | Directional | Flow indication |
| Line | Simple line | Connections |
| Bracket | Square bracket | Grouping |
| Brace | Curly bracket | Annotations |

#### Flowchart Shapes

| Shape | Description | Standard Use |
|-------|-------------|--------------|
| Process | Rectangle | Activity step |
| Decision | Diamond | Yes/No branch |
| Terminator | Rounded rectangle | Start/End |
| Document | Wavy bottom | Document output |
| Multi-Document | Stacked documents | Multiple outputs |
| Manual Input | Slanted top | User input |
| Manual Operation | Trapezoid | Manual process |
| Data | Parallelogram | Data I/O |
| Database | Cylinder | Data storage |
| Internal Storage | Rectangle + corners | Memory |
| Predefined Process | Rectangle + lines | Subroutine |
| On-Page Reference | Circle | Same-page link |
| Off-Page Reference | Pentagon | Different-page link |
| Merge | Triangle point up | Flow merge |

---

## 5. Element Schema Architecture

### 5.1 Universal Element Schema

Every element in the Arkhitekton library follows this schema:

```typescript
interface ArchitecturalElement {
  // Identity
  id: string;                    // Unique identifier (e.g., "archimate-app-001")
  name: string;                  // Display name (e.g., "Application Component")
  type: string;                  // Element type key (e.g., "application-component")
  category: string;              // Category (e.g., "Application Layer")
  framework: string;             // Framework (e.g., "ArchiMate 3.x")
  version: string;               // Framework version (e.g., "3.1")
  
  // Display
  description: string;           // What this element represents
  usageGuidelines: string;       // When to use this element
  icon: SVGPath;                 // SVG icon definition
  color: HexColor;               // Default fill color
  strokeColor: HexColor;         // Default border color
  shape: ShapeType;              // Base shape (rectangle, rounded, custom)
  defaultSize: { w: number, h: number };
  
  // Behavior
  relationships: {
    allowedSources: RelationshipRule[];
    allowedTargets: RelationshipRule[];
  };
  properties: PropertyDefinition[];
  validationRules: ValidationRule[];
  
  // Metadata
  tags: string[];                // Searchable tags
  aliases: string[];             // Alternative names for search
  vendor?: string;               // Vendor if applicable (AWS, Microsoft, etc.)
  documentationUrl?: string;     // External reference
}
```

### 5.2 Property Definition Schema

```typescript
interface PropertyDefinition {
  key: string;                   // Property key (e.g., "owner")
  name: string;                  // Display name (e.g., "Owner")
  type: PropertyType;            // string, number, date, enum, multiselect, reference
  required: boolean;             // Is this property required?
  defaultValue?: any;            // Default value
  placeholder?: string;          // Input placeholder
  validation?: ValidationRule;   // Validation rules
  options?: string[];            // For enum/multiselect types
  referenceType?: string;        // For reference type (e.g., "APM-Application")
  group: string;                 // Property group (Identity, Technical, Business, etc.)
}
```

### 5.3 Relationship Rule Schema

```typescript
interface RelationshipRule {
  targetType: string;            // Target element type
  relationshipType: string;      // Relationship type (composition, aggregation, flow, etc.)
  cardinality: string;           // "1:1", "1:n", "n:m"
  description: string;           // What this relationship means
  required: boolean;             // Is at least one instance required?
  validationMessage?: string;    // Custom validation message
}
```

### 5.4 Standard Property Groups

All elements have these standard property groups:

| Group | Properties | Description |
|-------|------------|-------------|
| **Identity** | Name, Description, Type, Tags | Core identification |
| **Classification** | Framework, Category, Layer | Taxonomy placement |
| **Ownership** | Owner, Team, Contact | Who's responsible |
| **Lifecycle** | Status, Phase, Version | Current state |
| **Business Context** | Domain, Capability, Value Stream | Business alignment |
| **Technical** | (varies by element type) | Technical specifics |
| **APM Link** | APM ID, Sync Status, Last Sync | Portfolio binding |
| **Custom** | User-defined key-value pairs | Extensions |

### 5.5 Element-Specific Properties

#### ArchiMate Application Component Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| Name | string | Yes | Component name |
| Description | text | No | What it does |
| Type | enum | No | Microservice, Monolith, Library, Module |
| Technology | multiselect | No | Java, .NET, Python, Node.js, etc. |
| Owner | string | No | Owning team |
| Status | enum | No | Production, Development, Deprecated |
| APM Link | reference | No | Link to APM application |
| APIs Exposed | number | No | Count of public APIs |
| Dependencies | number | No | Count of dependencies |

#### AWS Lambda Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| Name | string | Yes | Function name |
| Description | text | No | What it does |
| Runtime | enum | No | Node.js 18.x, Python 3.11, etc. |
| Memory (MB) | number | No | 128-10240 |
| Timeout (sec) | number | No | 1-900 |
| VPC Attached | boolean | No | Is in VPC? |
| Environment Variables | text | No | Key-value pairs |
| Layers | multiselect | No | Lambda layers |
| Triggers | multiselect | No | API Gateway, S3, SQS, etc. |

#### BPMN User Task Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| Name | string | Yes | Task name |
| Description | text | No | What the user does |
| Assignee | string | No | Who performs |
| Candidate Groups | multiselect | No | Eligible roles |
| Due Date Expression | string | No | Duration expression |
| Priority | enum | No | Low, Medium, High, Critical |
| Form Key | string | No | Form reference |
| Documentation | text | No | Instructions |

---

## 6. EPIC & Feature Definitions

### 6.1 EPIC Overview

| EPIC ID | Name | Description | Stories | Points |
|---------|------|-------------|---------|--------|
| EPIC-ELM-01 | Element Palette & Browser | Searchable, categorized element palette | 8 | 56 |
| EPIC-ELM-02 | Element Schema & Properties | Typed properties, validation, property panel | 7 | 52 |
| EPIC-ELM-03 | Notation Framework Registry | Framework definitions, versioning, compliance | 5 | 38 |
| EPIC-ELM-04 | Connection Rules Engine | Relationship validation, cross-framework adapters | 6 | 48 |
| EPIC-ELM-05 | Viewpoint & Filtering | Layer filters, viewpoint presets, element visibility | 4 | 28 |
| EPIC-ELM-06 | Custom Elements & Extensions | User-defined elements, icon upload, property templates | 5 | 42 |
| **TOTAL** | | | **35** | **264** |

### 6.2 EPIC-ELM-01: Element Palette & Browser

| Feature ID | Feature Name | Description |
|------------|--------------|-------------|
| FTR-ELM-001 | Element Palette Panel | Collapsible palette in Primary Sidebar with search and categories |
| FTR-ELM-002 | Category Navigation | Tree navigation: Framework > Category > Layer > Element |
| FTR-ELM-003 | Element Search | Real-time search with fuzzy matching and aliases |
| FTR-ELM-004 | Favorites & Recents | Pin frequently used elements, show recent placements |
| FTR-ELM-005 | AI Element Suggestions | AI recommends elements based on canvas context |
| FTR-ELM-006 | Drag-to-Canvas | Drag element from palette to canvas position |

### 6.3 EPIC-ELM-02: Element Schema & Properties

| Feature ID | Feature Name | Description |
|------------|--------------|-------------|
| FTR-ELM-010 | Properties Panel Integration | Element-specific properties in Secondary Sidebar |
| FTR-ELM-011 | Typed Property Inputs | String, number, date, enum, multiselect, reference inputs |
| FTR-ELM-012 | Required Property Validation | Visual indicators for required fields, validation errors |
| FTR-ELM-013 | Property Groups | Collapsible groups: Identity, Technical, Business, APM |
| FTR-ELM-014 | Custom Properties | Add user-defined key-value properties |
| FTR-ELM-015 | Property Templates | Save and apply property presets |

### 6.4 EPIC-ELM-03: Notation Framework Registry

| Feature ID | Feature Name | Description |
|------------|--------------|-------------|
| FTR-ELM-020 | Framework Definitions | Pluggable framework definitions (ArchiMate, BPMN, etc.) |
| FTR-ELM-021 | Framework Versioning | Support multiple versions (ArchiMate 3.0, 3.1) |
| FTR-ELM-022 | Model Framework Assignment | Assign primary framework to model |
| FTR-ELM-023 | Notation Compliance Mode | Strict vs. flexible notation enforcement |
| FTR-ELM-024 | Framework Documentation | Built-in reference for notation rules |

### 6.5 EPIC-ELM-04: Connection Rules Engine

| Feature ID | Feature Name | Description |
|------------|--------------|-------------|
| FTR-ELM-030 | Allowed Connections | Define valid source-target-relationship combinations |
| FTR-ELM-031 | Connection Validation | Real-time validation when creating connections |
| FTR-ELM-032 | Relationship Type Selection | Dropdown to select relationship type when connecting |
| FTR-ELM-033 | Cross-Framework Adapters | Generic adapters to link elements across frameworks |
| FTR-ELM-034 | Derivation Rules | ArchiMate derived relationship calculation |
| FTR-ELM-035 | Connection Properties | Properties panel for relationships |

### 6.6 EPIC-ELM-05: Viewpoint & Filtering

| Feature ID | Feature Name | Description |
|------------|--------------|-------------|
| FTR-ELM-040 | Framework Filter | Show only elements from selected framework(s) |
| FTR-ELM-041 | Layer Filter | Filter by ArchiMate layer, cloud provider, etc. |
| FTR-ELM-042 | Viewpoint Presets | ArchiMate viewpoints, custom viewpoints |
| FTR-ELM-043 | Element Visibility | Hide/show element types on canvas |

### 6.7 EPIC-ELM-06: Custom Elements & Extensions

| Feature ID | Feature Name | Description |
|------------|--------------|-------------|
| FTR-ELM-050 | Custom Element Builder | Create user-defined element types |
| FTR-ELM-051 | Icon Upload | Upload custom SVG icons |
| FTR-ELM-052 | Property Schema Builder | Define custom property schemas |
| FTR-ELM-053 | Element Templates | Save configured elements as templates |
| FTR-ELM-054 | Organization Element Library | Shared custom elements across organization |

---

## 7. High-Level Requirements

### 7.1 EPIC-ELM-01: Element Palette & Browser

| HLR ID | Requirement | Priority | Story |
|--------|-------------|----------|-------|
| HLR-ELM-001 | Element Palette shall display in Primary Sidebar when Elements icon clicked | Must | US-ELM-001 |
| HLR-ELM-002 | Palette shall organize elements by Framework > Category > Layer | Must | US-ELM-001 |
| HLR-ELM-003 | Search shall return results within 100ms for queries 3+ characters | Must | US-ELM-002 |
| HLR-ELM-004 | Search shall match element name, aliases, and tags | Must | US-ELM-002 |
| HLR-ELM-005 | Favorites shall persist across sessions for signed-in users | Should | US-ELM-003 |
| HLR-ELM-006 | Recents shall show last 20 placed elements | Should | US-ELM-003 |
| HLR-ELM-007 | AI shall suggest elements based on current canvas content | Could | US-ELM-004 |
| HLR-ELM-008 | Drag from palette shall create element at drop position | Must | US-ELM-005 |
| HLR-ELM-009 | Element tooltip shall show name, description, and framework | Should | US-ELM-005 |
| HLR-ELM-010 | Palette shall support keyboard navigation (arrow keys, Enter) | Should | US-ELM-006 |

### 7.2 EPIC-ELM-02: Element Schema & Properties

| HLR ID | Requirement | Priority | Story |
|--------|-------------|----------|-------|
| HLR-ELM-011 | Properties Panel shall display element-specific properties | Must | US-ELM-007 |
| HLR-ELM-012 | Properties shall be grouped into collapsible sections | Must | US-ELM-007 |
| HLR-ELM-013 | Required properties shall be visually indicated | Must | US-ELM-008 |
| HLR-ELM-014 | Missing required properties shall show validation error | Must | US-ELM-008 |
| HLR-ELM-015 | Enum properties shall display as dropdowns | Must | US-ELM-009 |
| HLR-ELM-016 | Multiselect properties shall display as tag inputs | Must | US-ELM-009 |
| HLR-ELM-017 | Reference properties shall show search/select dialog | Must | US-ELM-009 |
| HLR-ELM-018 | Custom properties shall allow key-value pair addition | Should | US-ELM-010 |
| HLR-ELM-019 | Property changes shall update canvas in real-time | Must | US-ELM-011 |
| HLR-ELM-020 | Property templates shall be saveable and reusable | Could | US-ELM-012 |

### 7.3 EPIC-ELM-03: Notation Framework Registry

| HLR ID | Requirement | Priority | Story |
|--------|-------------|----------|-------|
| HLR-ELM-021 | System shall support pluggable framework definitions | Must | US-ELM-013 |
| HLR-ELM-022 | Framework shall define elements, relationships, and rules | Must | US-ELM-013 |
| HLR-ELM-023 | Model shall have assigned primary framework | Must | US-ELM-014 |
| HLR-ELM-024 | Strict mode shall prevent non-compliant elements | Should | US-ELM-015 |
| HLR-ELM-025 | Flexible mode shall warn but allow non-compliant elements | Must | US-ELM-015 |
| HLR-ELM-026 | Framework documentation shall be accessible from elements | Should | US-ELM-016 |

### 7.4 EPIC-ELM-04: Connection Rules Engine

| HLR ID | Requirement | Priority | Story |
|--------|-------------|----------|-------|
| HLR-ELM-027 | System shall validate connections against framework rules | Must | US-ELM-017 |
| HLR-ELM-028 | Invalid connections shall show error with explanation | Must | US-ELM-017 |
| HLR-ELM-029 | Connection creation shall offer valid relationship types | Must | US-ELM-018 |
| HLR-ELM-030 | Cross-framework adapters shall enable linking across notations | Should | US-ELM-019 |
| HLR-ELM-031 | Adapter shall show both source and target element types | Should | US-ELM-019 |
| HLR-ELM-032 | ArchiMate derived relationships shall be calculated | Could | US-ELM-020 |
| HLR-ELM-033 | Relationships shall have configurable properties | Must | US-ELM-021 |

### 7.5 EPIC-ELM-05: Viewpoint & Filtering

| HLR ID | Requirement | Priority | Story |
|--------|-------------|----------|-------|
| HLR-ELM-034 | Palette shall filter by selected framework | Must | US-ELM-022 |
| HLR-ELM-035 | Palette shall filter by layer/category | Must | US-ELM-022 |
| HLR-ELM-036 | ArchiMate viewpoints shall preset element visibility | Should | US-ELM-023 |
| HLR-ELM-037 | Custom viewpoints shall be saveable | Could | US-ELM-024 |
| HLR-ELM-038 | Canvas shall hide/show elements by type | Should | US-ELM-025 |

### 7.6 EPIC-ELM-06: Custom Elements & Extensions

| HLR ID | Requirement | Priority | Story |
|--------|-------------|----------|-------|
| HLR-ELM-039 | User shall create custom element types | Should | US-ELM-026 |
| HLR-ELM-040 | Custom elements shall have icon, color, shape, properties | Should | US-ELM-026 |
| HLR-ELM-041 | User shall upload SVG icons for custom elements | Should | US-ELM-027 |
| HLR-ELM-042 | User shall define property schemas for custom elements | Should | US-ELM-028 |
| HLR-ELM-043 | Configured elements shall be saveable as templates | Could | US-ELM-029 |
| HLR-ELM-044 | Organization shall share custom elements across users | Could | US-ELM-030 |

---

## 8. User Stories with Gherkin Specifications

### 8.1 EPIC-ELM-01: Element Palette & Browser

#### US-ELM-001: Element Palette Panel

| Field | Value |
|-------|-------|
| **Story ID** | US-ELM-001 |
| **Title** | Element Palette Panel |
| **Epic** | EPIC-ELM-01: Element Palette & Browser |
| **Story Points** | 8 |
| **Priority** | High |
| **HLR Trace** | HLR-ELM-001, HLR-ELM-002 |

**As a** technology architect,
**I want** to browse a categorized palette of architectural elements,
**So that** I can quickly find the correct element type for my diagram.

**Acceptance Criteria:**

```gherkin
Feature: Element Palette Panel

  Scenario: Open Element Palette
    Given I am in the Design IDE with a model open
    When I click the "Elements" icon in the Activity Bar
    Then the Primary Sidebar shows the Element Palette
    And the palette displays framework categories

  Scenario: Navigate Categories
    Given the Element Palette is open
    When I expand "ArchiMate 3.x"
    Then I see layer categories: Business, Application, Technology, Strategy
    When I expand "Application Layer"
    Then I see elements: Application Component, Application Service, etc.

  Scenario: Element Preview
    Given the Element Palette is open
    When I hover over "Application Component"
    Then I see a tooltip with:
      | Field | Value |
      | Name | Application Component |
      | Framework | ArchiMate 3.x |
      | Description | A modular, deployable, and replaceable part... |
```

---

#### US-ELM-002: Element Search

| Field | Value |
|-------|-------|
| **Story ID** | US-ELM-002 |
| **Title** | Element Search |
| **Epic** | EPIC-ELM-01: Element Palette & Browser |
| **Story Points** | 5 |
| **Priority** | High |
| **HLR Trace** | HLR-ELM-003, HLR-ELM-004 |

**As a** technology architect,
**I want** to search for elements by name or keyword,
**So that** I can find the right element without browsing categories.

**Acceptance Criteria:**

```gherkin
Feature: Element Search

  Scenario: Search by Name
    Given the Element Palette is open
    When I type "lambda" in the search box
    Then results appear within 100ms
    And I see "AWS Lambda" in the results
    And I see "Lambda Architecture Pattern" if available

  Scenario: Search by Alias
    Given the Element Palette is open
    When I type "serverless"
    Then I see "AWS Lambda", "Azure Functions", "Cloud Functions"
    Because these elements have "serverless" as an alias

  Scenario: Search with Typo
    Given the Element Palette is open
    When I type "applicaton" (typo)
    Then I see "Application Component", "Application Service"
    Because fuzzy matching handles typos

  Scenario: No Results
    Given the Element Palette is open
    When I type "xyznonexistent"
    Then I see "No elements found"
    And I see "Try a different search term or browse categories"
```

---

#### US-ELM-003: Favorites & Recents

| Field | Value |
|-------|-------|
| **Story ID** | US-ELM-003 |
| **Title** | Favorites & Recents |
| **Epic** | EPIC-ELM-01: Element Palette & Browser |
| **Story Points** | 5 |
| **Priority** | Medium |
| **HLR Trace** | HLR-ELM-005, HLR-ELM-006 |

**As a** technology architect,
**I want** quick access to my frequently used elements,
**So that** I don't waste time searching for common elements.

**Acceptance Criteria:**

```gherkin
Feature: Favorites & Recents

  Scenario: Add to Favorites
    Given the Element Palette is open
    When I right-click "Application Component"
    And I select "Add to Favorites"
    Then the element appears in the Favorites section

  Scenario: View Recent Elements
    Given I have placed elements on the canvas
    When I view the "Recent" section in the palette
    Then I see the last 20 placed elements
    And most recent appears first

  Scenario: Favorites Persist
    Given I have favorited "AWS Lambda"
    When I close and reopen the browser
    And I open the Element Palette
    Then "AWS Lambda" is still in my Favorites
```

---

#### US-ELM-005: Drag-to-Canvas Element Placement

| Field | Value |
|-------|-------|
| **Story ID** | US-ELM-005 |
| **Title** | Drag-to-Canvas Element Placement |
| **Epic** | EPIC-ELM-01: Element Palette & Browser |
| **Story Points** | 8 |
| **Priority** | High |
| **HLR Trace** | HLR-ELM-008, HLR-ELM-009 |

**As a** technology architect,
**I want** to drag elements from the palette to the canvas,
**So that** I can quickly build my architecture diagram.

**Acceptance Criteria:**

```gherkin
Feature: Drag-to-Canvas Element Placement

  Scenario: Drag and Drop Element
    Given the Element Palette is open
    When I drag "Application Component" from the palette
    And I drop it on the canvas at position (500, 300)
    Then a new Application Component appears at (500, 300)
    And it has default size (120x60)
    And it is selected

  Scenario: Element with Default Properties
    Given I have dragged "AWS Lambda" to the canvas
    Then the element has these default properties:
      | Property | Default Value |
      | Name | Lambda Function |
      | Runtime | (empty) |
      | Memory | 128 |
      | Timeout | 3 |

  Scenario: Smart Positioning with Grid Snap
    Given grid snapping is enabled (8px grid)
    When I drop an element at position (503, 297)
    Then the element snaps to (504, 296)
```

---

### 8.2 EPIC-ELM-02: Element Schema & Properties

#### US-ELM-007: Properties Panel for Elements

| Field | Value |
|-------|-------|
| **Story ID** | US-ELM-007 |
| **Title** | Properties Panel for Elements |
| **Epic** | EPIC-ELM-02: Element Schema & Properties |
| **Story Points** | 8 |
| **Priority** | High |
| **HLR Trace** | HLR-ELM-011, HLR-ELM-012 |

**As a** technology architect,
**I want** to view and edit element-specific properties,
**So that** I can document detailed information about each component.

**Acceptance Criteria:**

```gherkin
Feature: Properties Panel for Elements

  Scenario: View Element Properties
    Given I have selected an "Application Component" on the canvas
    Then the Properties Panel shows in the Secondary Sidebar
    And I see property groups:
      | Group | Properties |
      | Identity | Name, Description, Tags |
      | Classification | Framework, Category, Type |
      | Ownership | Owner, Team, Contact |
      | Lifecycle | Status, Phase, Version |
      | Technical | Technology, APIs, Dependencies |
      | APM Link | (See ARKDL-0008) |
      | Custom | User-defined properties |

  Scenario: Collapse/Expand Groups
    Given the Properties Panel is showing
    When I click the "Technical" group header
    Then the group collapses
    And other groups remain as-is

  Scenario: No Selection
    Given no element is selected
    Then the Properties Panel shows "Select an element to view properties"
```

---

#### US-ELM-009: Typed Property Inputs

| Field | Value |
|-------|-------|
| **Story ID** | US-ELM-009 |
| **Title** | Typed Property Inputs |
| **Epic** | EPIC-ELM-02: Element Schema & Properties |
| **Story Points** | 8 |
| **Priority** | High |
| **HLR Trace** | HLR-ELM-015, HLR-ELM-016, HLR-ELM-017 |

**As a** technology architect,
**I want** property inputs appropriate to their data type,
**So that** I can enter data efficiently and accurately.

**Acceptance Criteria:**

```gherkin
Feature: Typed Property Inputs

  Scenario: Enum Property as Dropdown
    Given I have selected an "AWS Lambda" element
    When I click the "Runtime" property
    Then I see a dropdown with options:
      | Option |
      | Node.js 18.x |
      | Node.js 20.x |
      | Python 3.11 |
      | Python 3.12 |
      | Java 17 |
      | Java 21 |

  Scenario: Multiselect Property as Tags
    Given I have selected an "Application Component"
    When I click the "Technology" property
    Then I see a tag input
    When I type "Java"
    Then I see suggestions: "Java", "JavaScript", "Java EE"
    When I select "Java"
    Then "Java" appears as a tag in the input
    And I can add more technologies

  Scenario: Number Property with Validation
    Given I have selected an "AWS Lambda"
    When I enter "15000" in the "Memory (MB)" field
    Then I see validation error: "Maximum value is 10240"

  Scenario: Reference Property
    Given I have selected an element
    When I click the "APM Link" reference field
    Then I see a search dialog for APM applications
    And I can search and select an application
```

---

### 8.3 EPIC-ELM-04: Connection Rules Engine

#### US-ELM-017: Connection Validation

| Field | Value |
|-------|-------|
| **Story ID** | US-ELM-017 |
| **Title** | Connection Validation |
| **Epic** | EPIC-ELM-04: Connection Rules Engine |
| **Story Points** | 10 |
| **Priority** | High |
| **HLR Trace** | HLR-ELM-027, HLR-ELM-028 |

**As a** technology architect,
**I want** the system to validate connections against notation rules,
**So that** my diagrams are compliant with ArchiMate/BPMN standards.

**Acceptance Criteria:**

```gherkin
Feature: Connection Validation

  Scenario: Valid ArchiMate Connection
    Given I have an "Application Component" on the canvas
    And I have an "Application Service" on the canvas
    When I draw a connection from Component to Service
    Then the connection is created
    And it defaults to "Realization" relationship type
    And no validation error appears

  Scenario: Invalid ArchiMate Connection
    Given I have an "Application Component" on the canvas
    And I have a "Business Actor" on the canvas
    When I attempt to draw a direct connection
    Then I see a validation warning:
      "Direct connection from Application Component to Business Actor"
      "is not valid in ArchiMate."
      "Consider using an Application Service as an intermediary."

  Scenario: Cross-Framework Warning
    Given model framework is "ArchiMate 3.x"
    And I have an "Application Component" on the canvas
    And I have an "AWS Lambda" on the canvas
    When I draw a connection between them
    Then I see an informational message:
      "Cross-framework connection detected."
      "This connection is allowed but not part of standard ArchiMate."
```

---

#### US-ELM-019: Cross-Framework Adapters

| Field | Value |
|-------|-------|
| **Story ID** | US-ELM-019 |
| **Title** | Cross-Framework Adapters |
| **Epic** | EPIC-ELM-04: Connection Rules Engine |
| **Story Points** | 10 |
| **Priority** | Medium |
| **HLR Trace** | HLR-ELM-030, HLR-ELM-031 |

**As a** technology architect,
**I want** to formally link elements across frameworks,
**So that** I can show how ArchiMate components map to AWS infrastructure.

**Acceptance Criteria:**

```gherkin
Feature: Cross-Framework Adapters

  Scenario: Create Implementation Link
    Given I have an ArchiMate "Application Component" (Order Service)
    And I have an AWS "Lambda" element on the canvas
    When I select both elements
    And I choose "Create Implementation Link"
    Then a special "Implements" adapter connection is created
    And the Lambda shows: "Implements: Order Service (ArchiMate)"
    And the Component shows: "Implemented by: Lambda (AWS)"

  Scenario: View Cross-Framework Mappings
    Given I have multiple implementation links
    When I open "View > Cross-Framework Mappings"
    Then I see a table:
      | ArchiMate Element | Implementation | Framework |
      | Order Service | order-service-lambda | AWS |
      | User Service | user-service-vm | Azure |
      | Payment Gateway | payment-api | GCP |

  Scenario: Navigate to Linked Element
    Given Order Service is linked to order-service-lambda
    When I right-click Order Service
    And select "Go to Implementation"
    Then the canvas pans to and selects order-service-lambda
```

---

## 9. Requirements Traceability Matrix

### 9.1 Story-to-HLR Mapping

| Story ID | Title | HLRs | Points |
|----------|-------|------|--------|
| US-ELM-001 | Element Palette Panel | HLR-ELM-001, HLR-ELM-002 | 8 |
| US-ELM-002 | Element Search | HLR-ELM-003, HLR-ELM-004 | 5 |
| US-ELM-003 | Favorites & Recents | HLR-ELM-005, HLR-ELM-006 | 5 |
| US-ELM-004 | AI Element Suggestions | HLR-ELM-007 | 8 |
| US-ELM-005 | Drag-to-Canvas Placement | HLR-ELM-008, HLR-ELM-009 | 8 |
| US-ELM-006 | Keyboard Navigation | HLR-ELM-010 | 5 |
| US-ELM-007 | Properties Panel | HLR-ELM-011, HLR-ELM-012 | 8 |
| US-ELM-008 | Required Property Validation | HLR-ELM-013, HLR-ELM-014 | 5 |
| US-ELM-009 | Typed Property Inputs | HLR-ELM-015 to HLR-ELM-017 | 8 |
| US-ELM-010 | Custom Properties | HLR-ELM-018 | 5 |
| US-ELM-011 | Real-time Property Updates | HLR-ELM-019 | 5 |
| US-ELM-012 | Property Templates | HLR-ELM-020 | 8 |
| US-ELM-013 | Framework Registry | HLR-ELM-021, HLR-ELM-022 | 10 |
| US-ELM-014 | Model Framework Assignment | HLR-ELM-023 | 5 |
| US-ELM-015 | Notation Compliance Mode | HLR-ELM-024, HLR-ELM-025 | 8 |
| US-ELM-016 | Framework Documentation | HLR-ELM-026 | 5 |
| US-ELM-017 | Connection Validation | HLR-ELM-027, HLR-ELM-028 | 10 |
| US-ELM-018 | Relationship Type Selection | HLR-ELM-029 | 5 |
| US-ELM-019 | Cross-Framework Adapters | HLR-ELM-030, HLR-ELM-031 | 10 |
| US-ELM-020 | Derived Relationships | HLR-ELM-032 | 8 |
| US-ELM-021 | Relationship Properties | HLR-ELM-033 | 5 |
| US-ELM-022 | Framework Filtering | HLR-ELM-034, HLR-ELM-035 | 5 |
| US-ELM-023 | Viewpoint Presets | HLR-ELM-036 | 8 |
| US-ELM-024 | Custom Viewpoints | HLR-ELM-037 | 5 |
| US-ELM-025 | Element Visibility | HLR-ELM-038 | 5 |
| US-ELM-026 | Custom Element Builder | HLR-ELM-039, HLR-ELM-040 | 10 |
| US-ELM-027 | Icon Upload | HLR-ELM-041 | 5 |
| US-ELM-028 | Property Schema Builder | HLR-ELM-042 | 8 |
| US-ELM-029 | Element Templates | HLR-ELM-043 | 5 |
| US-ELM-030 | Organization Library | HLR-ELM-044 | 8 |

### 9.2 Coverage Summary

| EPIC | Stories | Points | HLRs | Coverage |
|------|---------|--------|------|----------|
| EPIC-ELM-01 | 6 | 39 | 10 | 100% |
| EPIC-ELM-02 | 6 | 39 | 10 | 100% |
| EPIC-ELM-03 | 4 | 28 | 6 | 100% |
| EPIC-ELM-04 | 5 | 38 | 7 | 100% |
| EPIC-ELM-05 | 4 | 23 | 5 | 100% |
| EPIC-ELM-06 | 5 | 36 | 6 | 100% |
| **TOTAL** | **30** | **203** | **44** | **100%** |

---

## 10. Appendix: Complete Element Catalog

### 10.1 ArchiMate Relationship Types

| Relationship | Symbol | Description | Example |
|--------------|--------|-------------|---------|
| **Composition** | Filled diamond | Part-of relationship | Component contains Module |
| **Aggregation** | Empty diamond | Has-a relationship | Team aggregates Members |
| **Assignment** | Solid line + circle | Allocation | Actor assigned to Role |
| **Realization** | Dashed line + triangle | Implementation | Service realizes Interface |
| **Serving** | Solid line + arrow | Provides functionality | Service serves Actor |
| **Access** | Dashed line + arrow | Read/Write | Process accesses Data |
| **Influence** | Dashed line + open arrow | Affects | Driver influences Goal |
| **Association** | Simple line | Generic relationship | Any to Any |
| **Triggering** | Solid line + filled arrow | Causes | Event triggers Process |
| **Flow** | Dashed line + filled arrow | Data/Material transfer | Data flows between |
| **Specialization** | Solid line + hollow triangle | Is-a | Subtype of Type |

### 10.2 BPMN Relationship Types

| Relationship | Symbol | Description |
|--------------|--------|-------------|
| **Sequence Flow** | Solid arrow | Activity order |
| **Message Flow** | Dashed arrow + envelope | Inter-pool message |
| **Association** | Dotted line | Artifact link |
| **Data Association** | Dotted arrow | Data input/output |

### 10.3 Element Icon Color Palette

| Framework | Primary Color | Secondary Color | Accent |
|-----------|--------------|-----------------|--------|
| ArchiMate Business | #F7DC6F (Yellow) | #FCF3CF | #F4D03F |
| ArchiMate Application | #5DADE2 (Blue) | #D6EAF8 | #3498DB |
| ArchiMate Technology | #58D68D (Green) | #D5F5E3 | #27AE60 |
| ArchiMate Strategy | #AF7AC5 (Purple) | #E8DAEF | #8E44AD |
| ArchiMate Motivation | #E67E22 (Orange) | #FAE5D3 | #D35400 |
| AWS | #FF9900 (Orange) | #FFEDD5 | #EC7211 |
| Azure | #0078D4 (Blue) | #E6F2FA | #005BA1 |
| GCP | #4285F4 (Blue) | #E8F0FE | #1A73E8 |
| OCI | #F80000 (Red) | #FFE5E5 | #C74634 |
| BPMN | #3498DB (Blue) | #EBF5FB | #2980B9 |
| Shapes | #7F8C8D (Gray) | #F2F3F4 | #566573 |

---

**Document End**

*ARKDL-0007 | Element Library & Notation Framework | Version 1.0 | December 2025*
*30 User Stories | 203 Story Points | 44 HLRs | 6 EPICs*
