# Overview

ARKHITEKTON is an enterprise-grade, AI-first systems design modeling platform designed for systems architects to perform end-to-end architecture design. It aims to combine the expressiveness of code, the intuitiveness of visual representation, and the power of AI to create, build, and evolve complex systems.

The vision is to create a universal design and modeling platform that surpasses existing tools by offering comprehensive capabilities for various designers, from systems architects to business analysts. It integrates enterprise architecture modeling with general-purpose design, features distributed version control at the model and component level, and provides portfolio views for design leadership. ARKHITEKTON is positioned as an advanced competitor in enterprise architecture and general design & collaboration markets, bridging technical architecture with creative design workflows.

The platform currently provides a comprehensive design palette interface supporting cloud architecture elements (AWS, Azure, GCP, Oracle Cloud) and standard frameworks (ArchiMate 3.0, TOGAF, BPMN), built on an object-oriented model design with intelligent connections.

# User Preferences

Preferred communication style: Simple, everyday language.
Design Preference: Unique ARKHITEKTON identity with sophisticated, elegant design language inspired by the concept of master builders.

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