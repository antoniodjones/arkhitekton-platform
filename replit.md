# Overview

ARKHITEKTON is an enterprise-grade, AI-first systems design modeling platform for systems architects. It combines code expressiveness, visual intuitiveness, and AI power to create, build, and evolve complex systems. Its vision is to be a universal design and modeling platform, integrating enterprise architecture modeling with general-purpose design, distributed version control at the model and component level, and portfolio views for design leadership. The platform supports cloud architecture elements (AWS, Azure, GCP, Oracle Cloud) and standard frameworks (ArchiMate 3.0, TOGAF, BPMN) on an object-oriented model with intelligent connections. It aims to be a leading competitor in enterprise architecture and general design & collaboration markets, bridging technical architecture with creative design.

# User Preferences

Preferred communication style: Simple, everyday language.
Design Preference: Unique ARKHITEKTON identity with sophisticated, elegant design language inspired by the concept of master builders.

# System Architecture

## Core Architectural Principles
- **Object-Oriented Model Design**: Components are objects with intelligent connection capabilities, intuitive linking, and full traceability.
- **State Management & Versioning**: Single current state, multiple transition states with architect-defined checkpoints, Git-like merging, and traceability.
- **AI-Powered Guidance**: Contextual suggestions based on architectural patterns and best practices.
- **Enterprise Tool Integration**: Native integration with tools like Jira, Confluence, Aha!, Azure DevOps, Figma, and code editors for bi-directional sync.
- **End-to-End Development Lifecycle Mapping**: Traceability from strategy to deployment, including forward/reverse engineering and impact analysis.
- **Code Editor Integration**: Plugin architecture for major IDEs for code generation, reverse engineering, and synchronization.

## UI/UX Decisions
The application features a sophisticated, elegant design. The frontend uses React 18 with TypeScript, a component-based architecture, shadcn/ui with Radix UI for accessibility, and Tailwind CSS for styling with a custom design system.

**GovernanceHeader Component**: All pages (except home/dashboard) use a consistent GovernanceHeader component that provides:
- ARKHITEKTON branding with orange gradient logo
- Module-specific title and icon
- Breadcrumb navigation (Home > Module Name)
- User profile and theme toggle controls
- Consistent flex layout with overflow handling (h-full overflow-hidden flex flex-col → GovernanceHeader → flex-1 overflow-auto wrapper)

## Technical Implementations
- **Frontend**: React 18, TypeScript, shadcn/ui, Radix UI, Tailwind CSS, Wouter for routing, React Hook Form with Zod for validation, TanStack Query for server state.
- **Backend**: Express.js with TypeScript (ESM), simple REST API, interface-based storage layer, Drizzle ORM for PostgreSQL.
- **Data Storage**: Hybrid approach with Drizzle ORM for PostgreSQL (in-memory for development). Schema includes users, user_stories, epics, defects, architecture_elements, recent_elements, knowledge_base_pages, and sessions, with JSON fields for flexibility.
- **Build System**: Vite for frontend, esbuild for backend.

## Feature Specifications
- **Cloud Architecture Support**: Design palettes for AWS, Azure, GCP, Oracle Cloud, ArchiMate 3.0, TOGAF, and BPMN.
- **Application Portfolio Management (APM)**: Comprehensive asset management for tools, technologies, and physical resources. APM objects are used throughout the platform for modeling, analytics, performance tracking, cost management, and resource optimization. Enables complete visibility and governance of the application and technology portfolio.
- **Enterprise Architecture Governance**: Integrated ticket system, Architecture Review Requests, Architect Assignment Requests, and an enhanced ADR system with state management. Includes AI change detection and object linkage for real-time impact alerts and notifications.
- **Gherkin Acceptance Criteria Validation**: Comprehensive Gherkin format validation for user story acceptance criteria with multi-format support, real-time UI validation feedback, backend schema enforcement, and status change prevention.
- **Defect Management System**: Complete defect tracking and management integrated into user story workflow with severity levels and types, real-time defect badges, status tracking with resolution notes and root cause analysis, and story status blocking.
- **Epic Structure**: Features are organized into 7 strategic Epics: 6 aligned with Enterprise Architecture Value Streams (Strategy & Business Planning, Architecture Design & Modeling, Governance & Decision Management, Development & Implementation, Operations & Intelligence, Knowledge & Collaboration) plus Application Foundations for core infrastructure and cross-cutting improvements. User stories are exclusively used for uniformity and EA Value Stream alignment, replacing a separate task management system.

## System Design Choices
- **Strategic Cloud Platform**: GCP is the primary platform, leveraging Vertex AI, BigQuery, and Google's AI innovation.
- **Storage Strategy**: MemStorage for development and DatabaseStorage (PostgreSQL) for production.
- **Date Handling Strategy**: API returns ISO dates; HTML inputs expect YYYY-MM-DD, requiring explicit conversion utilities.

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