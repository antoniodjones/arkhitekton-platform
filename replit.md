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