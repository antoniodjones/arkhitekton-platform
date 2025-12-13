# Arkhitekton Application Portfolio Management (APM) Model

## Executive Summary

The Arkhitekton APM Model provides a comprehensive data structure for managing enterprise application portfolios as **intelligent, temporal objects** within living architectural ecosystems. Unlike traditional CMDB approaches that treat applications as static inventory records, the APM model captures the full lifecycle, relationships, and evolution of applications over time.

---

## Data Model Overview

### Application Entity Schema

| Attribute Group | Field | Type | Description |
|----------------|-------|------|-------------|
| **Identity** | `id` | UUID | Unique identifier |
| | `name` | String (required) | Application name |
| | `description` | Text | Detailed description |
| **Classification** | `type` | Enum | `web_application`, `mobile_app`, `api_service`, `database`, `infrastructure`, `saas_tool`, `custom` |
| | `category` | Enum | `business`, `technical`, `infrastructure`, `integration`, `data`, `security` |
| **Technology Stack** | `technologyStack.frontend` | String[] | Frontend technologies (React, Angular, Vue, etc.) |
| | `technologyStack.backend` | String[] | Backend technologies (Node.js, Python, Java, etc.) |
| | `technologyStack.database` | String[] | Database technologies (PostgreSQL, MongoDB, etc.) |
| | `technologyStack.infrastructure` | String[] | Infrastructure (AWS, Azure, Kubernetes, etc.) |
| | `technologyStack.thirdParty` | String[] | Third-party integrations |
| **Ownership** | `owner` | String | Primary owner/maintainer |
| | `team` | String | Owning team |
| | `stakeholders` | String[] | List of stakeholder identifiers |
| **Business Context** | `businessCapabilities` | String[] | Mapped business capabilities |
| | `criticality` | Enum | `low`, `medium`, `high`, `critical` |
| | `businessValue` | Text | Description of business value delivered |
| **Technical Details** | `hostingEnvironment` | Enum | `on_premise`, `aws`, `azure`, `gcp`, `hybrid`, `multi_cloud` |
| | `region` | String | Geographic region/data center |
| | `architecture` | Enum | `monolithic`, `microservices`, `serverless`, `event_driven` |
| **Integrations** | `integrations` | Object[] | Integration mappings with `name`, `type`, `direction` |
| | `dependencies` | String[] | Application IDs this app depends on |
| **Metrics** | `metrics.uptime` | Number | Uptime percentage |
| | `metrics.responseTime` | Number | Average response time (ms) |
| | `metrics.errorRate` | Number | Error rate percentage |
| | `metrics.throughput` | Number | Requests per second |
| | `metrics.customMetrics` | Object | Custom metric key-value pairs |
| **Cost** | `costCenter` | String | Cost center code |
| | `annualCost` | Integer | Annual cost in USD |
| | `costBreakdown.infrastructure` | Number | Infrastructure costs |
| | `costBreakdown.licenses` | Number | License costs |
| | `costBreakdown.maintenance` | Number | Maintenance costs |
| | `costBreakdown.support` | Number | Support costs |
| **Lifecycle** | `status` | Enum | `active`, `deprecated`, `retired`, `planned`, `development` |
| | `version` | String | Current version (semver) |
| | `deployedDate` | Date | Initial deployment date |
| | `retirementDate` | Date | Planned retirement date |
| **References** | `repositoryUrl` | URL | Code repository |
| | `documentationUrl` | URL | Documentation link |
| | `monitoringUrl` | URL | Monitoring dashboard |
| **Metadata** | `tags` | String[] | Custom tags for filtering |
| | `notes` | Text | Additional context |
| **Timestamps** | `createdAt` | Timestamp | Record creation date |
| | `updatedAt` | Timestamp | Last modification date |

---

## How Technology Architects Use the APM Model

### 1. Portfolio Visualization & Analysis

| Use Case | How It's Done |
|----------|---------------|
| **Application Inventory** | Query all applications by `type`, `category`, or `status` to get a complete view of the portfolio |
| **Technology Landscape** | Aggregate `technologyStack` fields to understand technology distribution and identify standardization opportunities |
| **Dependency Mapping** | Visualize `dependencies` and `integrations` to understand application interconnections |
| **Geographic Distribution** | Filter by `hostingEnvironment` and `region` to map global deployment topology |

### 2. Lifecycle Management

| Use Case | How It's Done |
|----------|---------------|
| **Modernization Planning** | Use `status` = `deprecated` with `retirementDate` to plan migration timelines |
| **Version Tracking** | Monitor `version` field to track deployment currency and identify outdated applications |
| **Sunset Management** | Query `retirementDate` to proactively plan decommissioning activities |
| **State Transitions** | Update `status` as applications move from `planned` → `development` → `active` → `deprecated` → `retired` |

### 3. Business Alignment

| Use Case | How It's Done |
|----------|---------------|
| **Capability Mapping** | Link applications to `businessCapabilities` to identify coverage gaps and overlaps |
| **Criticality Assessment** | Use `criticality` ratings to prioritize investments and risk mitigation |
| **Value Justification** | Document `businessValue` to justify application costs and investments |
| **Strategic Alignment** | Filter by `category` to analyze portfolio alignment with business domains |

### 4. Cost Optimization

| Use Case | How It's Done |
|----------|---------------|
| **TCO Analysis** | Aggregate `annualCost` and `costBreakdown` to calculate total cost of ownership |
| **Budget Planning** | Group by `costCenter` to allocate IT budgets across business units |
| **Rationalization** | Identify duplicate or low-value applications using `businessValue` and `metrics` |
| **Cloud Optimization** | Analyze `hostingEnvironment` costs to optimize cloud spending |

### 5. Governance & Compliance

| Use Case | How It's Done |
|----------|---------------|
| **Ownership Accountability** | Enforce `owner` and `team` assignments for all applications |
| **Stakeholder Communication** | Use `stakeholders` list for change notifications and approvals |
| **Audit Trail** | Track `createdAt` and `updatedAt` for compliance reporting |
| **Documentation Compliance** | Ensure `documentationUrl` is populated for critical applications |

### 6. Operational Excellence

| Use Case | How It's Done |
|----------|---------------|
| **Health Monitoring** | Track `metrics.uptime`, `responseTime`, and `errorRate` for SLA management |
| **Performance Optimization** | Analyze `metrics.throughput` to identify bottlenecks |
| **Incident Correlation** | Use `monitoringUrl` links for quick access during incidents |
| **Integration Troubleshooting** | Reference `integrations` with direction to trace data flow issues |

---

## Business Value & Benefits

### Quantifiable Benefits

| Benefit Area | Impact | How APM Enables It |
|--------------|--------|-------------------|
| **Time Savings** | 90% reduction in architectural impact analysis | Instant dependency queries vs. manual research |
| **Cost Savings** | 15-30% reduction in portfolio costs | Identification of redundant applications and optimization opportunities |
| **Risk Reduction** | 80% fewer project conflicts | Early detection of dependency impacts before changes are made |
| **Decision Speed** | 10x faster architecture reviews | Complete application context available instantly |

### Strategic Benefits

| Benefit | Description |
|---------|-------------|
| **Single Source of Truth** | Eliminates spreadsheet proliferation and data silos across architecture, operations, and business teams |
| **Temporal Intelligence** | Understand application evolution with historical states and planned future changes |
| **AI-Ready Foundation** | Data structure designed for AI analysis, pattern recognition, and predictive insights |
| **Semantic Understanding** | Rich metadata enables AI to comprehend what applications actually do, not just store records |

### Operational Benefits

| Benefit | Description |
|---------|-------------|
| **Faster Onboarding** | New architects instantly understand the application landscape |
| **Change Impact Analysis** | Quickly identify blast radius of proposed changes |
| **Compliance Automation** | Automated reporting for audits and regulatory requirements |
| **Portfolio Health Dashboards** | Real-time visibility into application status, costs, and performance |

### Governance Benefits

| Benefit | Description |
|---------|-------------|
| **Clear Accountability** | Every application has defined ownership and stakeholders |
| **Lifecycle Visibility** | Track applications from inception through retirement |
| **Investment Justification** | Business value documentation for budget conversations |
| **Standardization Tracking** | Technology stack visibility enables technology roadmap enforcement |

---

## AI-Enhanced Capabilities

The APM model is designed to leverage AI for advanced capabilities:

| Capability | Description |
|------------|-------------|
| **Duplicate Detection** | AI identifies functionally redundant applications through semantic analysis |
| **Impact Prediction** | Predict cascading effects of changes across dependencies and time |
| **Optimization Recommendations** | AI suggests consolidation, modernization, and cost optimization opportunities |
| **Natural Language Queries** | Ask questions like "Show me all critical applications using deprecated Java versions" |
| **Anomaly Detection** | AI monitors metrics to identify applications with unusual behavior patterns |

---

## Integration with Arkhitekton Platform

| Platform Module | Integration Point |
|-----------------|-------------------|
| **Design Studio** | Applications can be visualized as architectural elements in diagrams |
| **Governance** | ADRs and ARB reviews linked to impacted applications |
| **Capabilities** | Business capability model maps to `businessCapabilities` field |
| **Workflows** | Application lifecycle transitions trigger workflow automation |
| **AI Agents** | Specialized agents (@Cloud, @Security, @Data) understand application context |

---

## Getting Started

### Creating an Application Record

```typescript
const newApplication: InsertApplication = {
  name: "Customer Portal",
  description: "Self-service customer portal for account management",
  type: "web_application",
  category: "business",
  technologyStack: {
    frontend: ["React", "TypeScript"],
    backend: ["Node.js", "Express"],
    database: ["PostgreSQL"],
    infrastructure: ["AWS ECS", "CloudFront"]
  },
  owner: "Platform Team",
  team: "Digital Experience",
  criticality: "high",
  businessCapabilities: ["Customer Self-Service", "Account Management"],
  hostingEnvironment: "aws",
  architecture: "microservices",
  status: "active",
  version: "2.3.1"
};
```

### Querying the Portfolio

| Query | Purpose |
|-------|---------|
| `status = 'deprecated'` | Find applications requiring migration planning |
| `criticality = 'critical'` | Identify business-critical applications for priority support |
| `hostingEnvironment = 'on_premise'` | Find cloud migration candidates |
| `technologyStack.backend CONTAINS 'Java 8'` | Identify applications needing technology upgrades |

---

## Summary

The Arkhitekton APM Model transforms application portfolio management from passive inventory tracking to active architectural intelligence. By capturing rich metadata about applications, their relationships, and their evolution over time, technology architects gain:

- **Complete Visibility** into the application landscape
- **Actionable Insights** for optimization and governance
- **AI-Ready Data** for predictive analysis and automation
- **Business Alignment** through capability mapping and value documentation
- **Operational Excellence** through metrics and monitoring integration

This model serves as the foundation for intelligent application portfolio management that scales from individual architects to enterprise-wide governance.

---

## Appendix: Element & Icon Library

Arkhitekton includes a comprehensive library of **180+ architectural elements** spanning enterprise architecture frameworks, cloud providers, and generic diagramming shapes. Each element includes semantic metadata for AI-enhanced understanding.

### Element Schema

| Attribute | Type | Description |
|-----------|------|-------------|
| `id` | String | Unique identifier |
| `name` | String | Display name |
| `type` | Enum | `structural`, `behavioral`, `motivational`, `passive` |
| `category` | Enum | `business`, `application`, `data`, `technology`, `basic`, `flowchart`, `network`, `ui`, `brainstorm`, `org` |
| `framework` | Enum | Source framework (see below) |
| `vendor` | String | Original vendor/standard body |
| `description` | Text | Semantic description for AI understanding |
| `usageGuidelines` | Text | When and how to use this element |
| `iconName` | String | Lucide icon reference |
| `color` | HSL | Default color for rendering |
| `shape` | Enum | `rectangular`, `rounded`, `diamond`, `circular`, `triangular`, `hexagonal`, `cylinder`, `cloud`, etc. |
| `relationships` | String[] | Common relationship targets |

---

### Framework Categories

| Framework | Vendor | Element Count | Use Cases |
|-----------|--------|---------------|-----------|
| **ArchiMate** | The Open Group | 60+ | Enterprise Architecture modeling (Business, Application, Technology layers) |
| **TOGAF** | The Open Group | 4 | Architecture governance, roadmaps, views, gap analysis |
| **BPMN** | OMG | 29 | Business process modeling, workflows, events |
| **AWS** | Amazon Web Services | 8+ | AWS cloud architecture (EC2, Lambda, S3, RDS, VPC, etc.) |
| **Azure** | Microsoft | 8+ | Azure cloud architecture (VMs, Functions, Storage, SQL, etc.) |
| **GCP** | Google Cloud | 8+ | Google Cloud architecture (Compute, Functions, Storage, BigQuery, etc.) |
| **OCI** | Oracle | 20+ | Oracle Cloud infrastructure (Compute, Bare Metal, Autonomous DB, etc.) |
| **Patterns** | Arkhitekton | 5 | Architectural patterns (ETL, Streaming, Pipelines) |
| **Shapes** | Arkhitekton | 28+ | Basic shapes, flowchart symbols, UI components |

---

### ArchiMate Elements (60+)

The complete ArchiMate 3.1 specification organized by layer:

#### Business Layer
| Element | Type | Icon | Description |
|---------|------|------|-------------|
| Business Actor | Structural | 👤 | Organizational entity capable of performing behavior |
| Business Role | Structural | 👥 | Responsibility for performing specific behavior |
| Business Collaboration | Structural | 🤝 | Aggregate of business actors working together |
| Business Interface | Structural | 🔌 | Access point for business services |
| Location | Structural | 📍 | Physical or conceptual place |
| Capability | Structural | 🧩 | Ability that an active structure possesses |
| Business Process | Behavioral | ⚙️ | Sequence of business behaviors |
| Business Function | Behavioral | 📋 | Internal behavior grouped by required skills |
| Business Interaction | Behavioral | 🔄 | Behavior between two or more business actors |
| Business Event | Behavioral | ⚡ | Something that happens and triggers behavior |
| Business Service | Behavioral | 🎯 | Externally visible behavior unit |
| Business Object | Passive | 📦 | Concept within the business domain |
| Contract | Passive | 📄 | Agreement between business actors |
| Representation | Passive | 📊 | Perceptible form of a business object |
| Product | Passive | 🏷️ | Coherent collection of services with a contract |

#### Application Layer
| Element | Type | Icon | Description |
|---------|------|------|-------------|
| Application Component | Structural | 🔧 | Modular, deployable software unit |
| Application Collaboration | Structural | 🔗 | Aggregate of application components |
| Application Interface | Structural | 🌐 | Access point for application services |
| Application Process | Behavioral | ▶️ | Sequence of application behaviors |
| Application Function | Behavioral | λ | Internal behavior of an application component |
| Application Interaction | Behavioral | ↔️ | Behavior between application components |
| Application Event | Behavioral | 📨 | Application state change that triggers behavior |
| Application Service | Behavioral | 🖥️ | Externally visible application unit |
| Data Object | Passive | 💾 | Data structured for automated processing |

#### Technology Layer
| Element | Type | Icon | Description |
|---------|------|------|-------------|
| Node | Structural | 🖧 | Computational resource for software |
| Device | Structural | 📱 | Physical IT resource |
| System Software | Structural | ⚙️ | Software for node execution and services |
| Technology Collaboration | Structural | 🔌 | Aggregate of nodes |
| Technology Interface | Structural | 🔀 | Access point for technology services |
| Path | Structural | ➡️ | Link for data transmission between nodes |
| Communication Network | Structural | 📡 | Set of paths for data transmission |
| Technology Process | Behavioral | 🔄 | Sequence of technology behaviors |
| Technology Function | Behavioral | 🛠️ | Internal behavior of a technology node |
| Technology Interaction | Behavioral | ⇄ | Behavior between nodes |
| Technology Event | Behavioral | 📟 | Technology state change |
| Technology Service | Behavioral | 🏗️ | Externally visible technology unit |
| Artifact | Passive | 📁 | Physical piece of data |
| Material | Passive | 🧱 | Tangible physical element |
| Facility | Passive | 🏢 | Physical structure or environment |
| Distribution Network | Passive | 🚚 | Physical medium for material transport |
| Equipment | Passive | ⚒️ | Physical machines for production |

#### Strategy & Motivation Layer
| Element | Type | Icon | Description |
|---------|------|------|-------------|
| Stakeholder | Motivational | 👔 | Individual, team, or organization with interests |
| Driver | Motivational | 🎯 | Something that creates, motivates change |
| Assessment | Motivational | 📋 | Outcome of analysis regarding a driver |
| Goal | Motivational | 🏁 | High-level end state |
| Outcome | Motivational | ✅ | End result from a goal |
| Principle | Motivational | 📜 | Normative property of systems |
| Requirement | Motivational | ✓ | Need that must be realized |
| Constraint | Motivational | 🚫 | Restriction on the way systems are realized |
| Meaning | Motivational | 💡 | Knowledge or expertise |
| Value | Motivational | 💎 | Relative worth or importance |

---

### Cloud Provider Icons

#### AWS (Amazon Web Services)
| Element | Category | Color | Description |
|---------|----------|-------|-------------|
| EC2 Instance | Technology | 🟠 Orange | Virtual compute servers |
| Lambda Function | Application | 🟠 Orange | Serverless compute |
| S3 Bucket | Data | 🟠 Orange | Object storage |
| RDS Database | Data | 🟠 Orange | Managed relational databases |
| Virtual Private Cloud | Technology | 🟠 Orange | Isolated network environment |
| Elastic Load Balancer | Technology | 🟠 Orange | Traffic distribution |
| API Gateway | Application | 🟠 Orange | API management |
| CloudFront CDN | Technology | 🟠 Orange | Content delivery network |

#### Azure (Microsoft)
| Element | Category | Color | Description |
|---------|----------|-------|-------------|
| Virtual Machine | Technology | 🔵 Blue | Windows/Linux VMs |
| Azure Functions | Application | 🔵 Blue | Serverless compute |
| Storage Account | Data | 🔵 Blue | Blob, file, queue, table storage |
| Azure SQL Database | Data | 🔵 Blue | Managed SQL database |
| Virtual Network | Technology | 🔵 Blue | Isolated network |
| App Service | Application | 🔵 Blue | Web app hosting |
| Cosmos DB | Data | 🔵 Blue | NoSQL database |
| Azure CDN | Technology | 🔵 Blue | Content delivery |

#### Google Cloud Platform (GCP)
| Element | Category | Color | Description |
|---------|----------|-------|-------------|
| Compute Engine | Technology | 🔵 Blue | Virtual machines |
| Cloud Functions | Application | 🔵 Blue | Serverless functions |
| Cloud Storage | Data | 🔵 Blue | Object storage |
| Cloud SQL | Data | 🔵 Blue | Managed SQL databases |
| BigQuery | Data | 🔵 Blue | Serverless data warehouse |
| Kubernetes Engine (GKE) | Application | 🔵 Blue | Managed Kubernetes |
| App Engine | Application | 🔵 Blue | PaaS for web apps |
| Cloud CDN | Technology | 🔵 Blue | Content delivery |

#### Oracle Cloud Infrastructure (OCI)
| Element | Category | Color | Description |
|---------|----------|-------|-------------|
| Compute Instance | Technology | 🔴 Red | Virtual machines |
| Bare Metal Instance | Technology | 🔴 Red | Dedicated physical servers |
| Oracle Functions | Application | 🔴 Red | Serverless (Fn Project) |
| Container Engine (OKE) | Application | 🔴 Red | Managed Kubernetes |
| Object Storage | Data | 🔴 Red | Object storage with tiers |
| Block Volumes | Data | 🔴 Red | High-performance block storage |
| Autonomous Database | Data | 🔴 Red | Self-managing database |
| VCN | Technology | 🔴 Red | Virtual cloud network |

---

### BPMN Elements (29)

Business Process Model and Notation for workflow diagrams:

| Category | Elements |
|----------|----------|
| **Events** | Start Event, End Event, Timer Event, Message Event, Error Event, Signal Event, Terminate Event, Conditional Event |
| **Activities** | Task, User Task, Service Task, Script Task, Manual Task, Receive Task, Send Task, Business Rule Task |
| **Gateways** | Exclusive Gateway (XOR), Parallel Gateway (AND), Inclusive Gateway (OR), Event-Based Gateway, Complex Gateway |
| **Artifacts** | Data Object, Data Store, Group, Text Annotation, Association |
| **Swimlanes** | Pool, Lane |

---

### Generic Shapes (28+)

#### Basic Shapes
| Shape | Icon | Use Case |
|-------|------|----------|
| Rectangle | ▢ | Containers, labels, general content |
| Circle | ○ | Processes, endpoints, events |
| Triangle | △ | Warnings, directional indicators |
| Diamond | ◇ | Decision points, conditions |
| Hexagon | ⬡ | Preparation steps, special processes |
| Pentagon | ⬠ | Special indicators |
| Star | ★ | Highlights, favorites |
| Arrow Right | → | Flow direction |
| Arrow Left | ← | Reverse flow |

#### Flowchart Shapes
| Shape | Symbol | Use Case |
|-------|--------|----------|
| Process | ▭ | Standard process step |
| Decision | ◇ | Yes/No branching |
| Start/End | ⬭ | Terminator (rounded rectangle) |
| Data | ▱ | Input/output parallelogram |
| Document | 📄 | Document or report |
| Database | 🛢️ | Data storage cylinder |
| Manual Input | ⌨️ | User input step |
| Display | 🖥️ | Display output |
| Connector | ○ | On-page connector |
| Off-Page Connector | ⬠ | Cross-page reference |
| Predefined Process | ⧈ | Subroutine call |
| Manual Operation | ⏢ | Manual step |
| Preparation | ⬡ | Preparation/initialization |
| Delay | ⊃ | Wait time |
| Stored Data | ⌓ | General data storage |
| Internal Storage | ⊡ | Memory/internal storage |
| Loop Limit | ⧇ | Loop boundary |
| Multiple Documents | 📑 | Collection of documents |
| Collate | ⋈ | Sorting operation |
| Sort | ⧫ | Ordering operation |

---

### Relationship Types

Connections between elements follow semantic relationship types:

| Relationship | Style | Description |
|--------------|-------|-------------|
| Association | Solid gray | Unspecified relationship |
| Assignment | Solid orange | Allocation of responsibility |
| Realization | Solid teal | Implementation relationship |
| Serving | Solid dark blue | Service dependency |
| Flow | Solid amber | Transfer or exchange |
| Access | Dashed | Read/write access |
| Triggering | Arrow | Cause and effect |
| Influence | Dashed arrow | Positive or negative impact |
| Specialization | Arrow with triangle | Inheritance/specialization |
| Aggregation | Diamond endpoint | Part-whole relationship |
| Composition | Filled diamond | Strong containment |

---

### Using Elements in the Design IDE

1. **Element Palette** (Primary Sidebar)
   - Browse by framework category (ArchiMate, AWS, Azure, etc.)
   - Search by name or tag
   - Favorites section for frequently used elements (max 12)
   - Recents section showing last 8 used

2. **Drag and Drop**
   - Drag from palette to canvas
   - Element auto-snaps to grid
   - Properties panel shows element details

3. **AI Integration**
   - Elements have semantic descriptions for AI understanding
   - AI can suggest appropriate elements based on context
   - Natural language commands like "Add an AWS Lambda function" work

4. **Properties**
   - Each element has configurable identity, technology, lifecycle, and governance properties
   - Properties are persisted with the model

