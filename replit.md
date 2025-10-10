# Overview

ARKHITEKTON is an enterprise-grade, AI-first systems design modeling platform designed for systems architects to perform end-to-end architecture design. It aims to combine the expressiveness of code, the intuitiveness of visual representation, and the power of AI to create, build, and evolve complex systems.

The vision is to create a universal design and modeling platform that surpasses existing tools by offering comprehensive capabilities for various designers, from systems architects to business analysts. It integrates enterprise architecture modeling with general-purpose design, features distributed version control at the model and component level, and provides portfolio views for design leadership. ARKHITEKTON is positioned as an advanced competitor in enterprise architecture and general design & collaboration markets, bridging technical architecture with creative design workflows.

The platform currently provides a comprehensive design palette interface supporting cloud architecture elements (AWS, Azure, GCP, Oracle Cloud) and standard frameworks (ArchiMate 3.0, TOGAF, BPMN), built on an object-oriented model design with intelligent connections.

# User Preferences

Preferred communication style: Simple, everyday language.
Design Preference: Unique ARKHITEKTON identity with sophisticated, elegant design language inspired by the concept of master builders.

# Epic Structure (EA Value Streams)

**Last Updated**: October 10, 2025

ARKHITEKTON organizes all features and user stories into 6 strategic Epics aligned with Enterprise Architecture Value Streams:

## EPIC 1: Strategy & Business Planning
**Epic ID**: EPIC-1  
**Story Count**: 11 stories  
**Value Stream**: Business strategy to architecture alignment  
**Target Personas**: Enterprise Architects, Business Analysts, Portfolio Managers  
**Core Capabilities**: 
- Portfolio management and transformation tracking
- Capability assessment and gap analysis
- Strategic initiatives planning
- Business-to-technology mapping
- ROI and value stream analysis

**Key Features**: Dashboard, Portfolio, Capability Assessment, Strategic Planning

## EPIC 2: Architecture Design & Modeling
**Epic ID**: EPIC-2  
**Story Count**: 55 stories  
**Value Stream**: Visual design and architectural modeling  
**Target Personas**: Enterprise Architects, System Architects, Solution Architects  
**Core Capabilities**:
- Visual canvas with drag-drop modeling
- Component palettes (ArchiMate 3.0, TOGAF, BPMN)
- Cloud architecture elements (AWS, Azure, GCP, Oracle)
- Object-oriented model design with intelligent connections
- Model versioning and state management (master/transition)
- Multi-layer views (Business, Application, Technology)

**Key Features**: Modeling Workspace, Design Palette, Cloud Architecture Pages, Object/Connection Management

## EPIC 3: Governance & Decision Management
**Epic ID**: EPIC-3  
**Story Count**: 13 stories  
**Value Stream**: Architectural governance and compliance  
**Target Personas**: Enterprise Architects, Security Engineers, Compliance Officers  
**Core Capabilities**:
- Architecture Decision Records (ADRs)
- Review workflows and approvals
- Compliance tracking and policy enforcement
- Risk assessment and mitigation
- Technical debt management
- Audit trails and change tracking

**Key Features**: Governance Dashboard, ADR System, Review Workflows, Tickets System, Compliance Tracking

## EPIC 4: Development & Implementation
**Epic ID**: EPIC-4  
**Story Count**: 33 stories  
**Value Stream**: Architecture to code realization  
**Target Personas**: Developers, Tech Leads, DevOps Engineers, Product Managers  
**Core Capabilities**:
- User story management with Gherkin acceptance criteria
- Epic-based story organization
- GitHub integration for commit-to-story traceability
- Sprint planning and task management
- Story enforcement (acceptance criteria validation)
- IDE plugins (VS Code, IntelliJ)
- Forward/reverse engineering

**Key Features**: Plan (Kanban/List/Table/Calendar/Stories), GitHub Integration, Task Management, Story-to-Code Mapping

## EPIC 5: Operations & Intelligence
**Epic ID**: EPIC-5  
**Story Count**: 10 stories  
**Value Stream**: AI-powered insights and operational excellence  
**Target Personas**: Enterprise Architects, AI Engineers, Data Analysts  
**Core Capabilities**:
- AI-powered architecture recommendations
- Intelligent impact analysis
- Predictive analytics for architecture decisions
- Pattern recognition and best practice suggestions
- Change detection and monitoring
- Natural language architecture queries
- Performance and cost optimization insights

**Key Features**: AI Assistant, Element Analysis, Recommendation Engine, Impact Analysis Dashboard

## EPIC 6: Knowledge & Collaboration
**Epic ID**: EPIC-6  
**Story Count**: 9 stories  
**Value Stream**: Documentation and organizational learning  
**Target Personas**: All Users, Knowledge Managers, Documentation Specialists  
**Core Capabilities**:
- Hierarchical wiki with documentation pages
- Version history and change tracking
- Threaded comments and collaboration
- Full-text search and discovery
- Templates and best practices library
- Integration with external docs (Confluence, SharePoint)
- Real-time collaboration features

**Key Features**: Knowledge Base, Wiki Pages, Search, Comments, Version Control, Templates

## Epic Migration & Story Distribution

**Migration Date**: October 10, 2025

All 131 user stories have been successfully migrated to the 6 Epic structure using keyword-based pattern matching:

**Migration Approach**:
- **Method**: Keyword-based categorization analyzing story titles, descriptions, and features
- **Tool**: `scripts/migrate-stories-keyword.ts` - Automated migration script with Epic mapping logic
- **Validation**: Full referential integrity with epicId foreign keys to epics table
- **Coverage**: 100% of stories assigned to appropriate Epics (no orphaned stories)

**Final Distribution**:
- **EPIC-1** (Strategy & Business Planning): 11 stories (8%)
- **EPIC-2** (Architecture Design & Modeling): 55 stories (42%) - Largest epic reflecting core platform focus
- **EPIC-3** (Governance & Decision Management): 13 stories (10%)
- **EPIC-4** (Development & Implementation): 33 stories (25%)
- **EPIC-5** (Operations & Intelligence): 10 stories (8%)
- **EPIC-6** (Knowledge & Collaboration): 9 stories (7%)

**Technical Implementation**:
- Epic schema with ID generation (EPIC-{number} format with atomic retry logic)
- Epic status tracking: 'planning', 'in-progress', 'completed', 'on-hold'
- Epic value streams aligned with EA practice areas
- UI features: Epic filter dropdown, Create Epic dialog, Epic badges on story cards
- Bug fixes: Relaxed story ID validation to support varied formats (US-WS001, US-AI-F002, etc.)

**Schema Evolution - parentTaskId Deprecation** (October 10, 2025):
- **Deprecated Field**: `parentTaskId` (legacy task-based hierarchy) → Replaced with `epicId` (EA Value Stream alignment)
- **Migration**: 0001_drop_parent_task_id.sql removes parent_task_id column from user_stories table
- **Migration History**: Historical migrations (0000) retain parent_task_id references as immutable audit trail
- **Organization Model**: Stories now organized by Epic only (no parent/child task relationships)
- **Full Stack Update**: Schema, storage interface, API routes, and frontend all updated to use epicId
- **Rationale**: Epic-based organization provides cleaner EA Value Stream alignment and eliminates redundant hierarchy

# System Architecture

## Core Architectural Principles
- **Object-Oriented Model Design**: Every component is an object with intelligent connection capabilities, intuitive linking, and full traceability.
- **State Management & Versioning**: Single current state, multiple transition states with architect-defined checkpoints, Git-like merging, and clear traceability.
- **AI-Powered Guidance**: Contextual suggestions and guidance based on architectural patterns and best practices.
- **Enterprise Tool Integration**: Native integration with tools like Jira, Confluence, Aha!, Azure DevOps, Figma, and code editors for bi-directional sync.
- **End-to-End Development Lifecycle Mapping**: Traceability from strategy to deployment, including forward and reverse engineering, and impact analysis.
- **Code Editor Integration**: Plugin architecture for major IDEs to generate code, reverse engineer architecture, and synchronize changes.

## UI/UX Decisions
The application aims for a sophisticated, elegant design. The frontend uses React 18 with TypeScript, a component-based architecture, shadcn/ui with Radix UI for accessibility, and Tailwind CSS for styling with a custom design system.

## Technical Implementations
- **Frontend**: React 18, TypeScript, shadcn/ui, Radix UI, Tailwind CSS, Wouter for routing, React Hook Form with Zod for validation, TanStack Query for server state.
- **Backend**: Express.js with TypeScript (ESM format), simple REST API, interface-based storage layer, Drizzle ORM for PostgreSQL.
- **Data Storage**: Hybrid approach with Drizzle ORM configured for PostgreSQL, currently using in-memory storage for development. Schema includes users, architecture_elements, recent_elements, tasks, and sessions. Data is designed with JSON fields for flexibility.
- **Build System**: Vite for frontend bundling, esbuild for backend compilation.

## Feature Specifications
- **Cloud Architecture Support**: Comprehensive design palettes for AWS, Azure, GCP, and Oracle Cloud, along with ArchiMate 3.0, TOGAF, and BPMN frameworks.
- **Task Management**: Comprehensive task views (Board, List, Table) with date handling, ID visibility, and double-click editing. Critical date handling ensures conversion between ISO and YYYY-MM-DD formats.
- **Enterprise Architecture Governance**: Integrated ticket system with JIRA-like functionality, Architecture Review Requests, Architect Assignment Requests, and an enhanced ADR system with state management. Includes AI change detection and object linkage for real-time impact alerts and notifications.
- **Gherkin Acceptance Criteria Validation** (US-XIGJUQ7 - Completed October 10, 2025): Comprehensive Gherkin format validation for user story acceptance criteria with multi-format support (multi-line, single-line, Scenario headers). Features real-time UI validation feedback, backend schema enforcement, and status change prevention (blocks in-progress without valid Given/When/Then format). Implemented in shared/gherkin-validator.ts with validation utilities and error reporting.

## System Design Choices
- **Strategic Cloud Platform**: GCP is the primary platform for ARKHITEKTON's core infrastructure, leveraging Vertex AI, BigQuery, and Google's AI innovation.
- **Storage Strategy**: MemStorage for development (with sample data) and DatabaseStorage for production (PostgreSQL).
- **Date Handling Strategy**: API returns ISO dates, HTML inputs expect YYYY-MM-DD, requiring explicit conversion utilities.

# External Dependencies

## UI Framework
- **shadcn/ui + Radix UI**: Accessible, customizable component primitives.
- **Tailwind CSS**: Utility-first CSS framework.
- **Lucide Icons**: Icon library.

## Data Management
- **TanStack Query**: Server state management.
- **Drizzle ORM**: Type-safe PostgreSQL ORM.
- **Neon Database**: Serverless PostgreSQL provider.

## Development Tools
- **Vite**: Frontend build tool.
- **TypeScript**: Type safety across the stack.
- **Replit Integration**: Development environment plugins.

## Framework Dependencies
- **React**: Frontend framework.
- **Express**: Backend web framework.
- **Wouter**: Lightweight client-side routing.
- **React Hook Form + Zod**: Form handling and validation.