# Overview

ARKITEKTON is an enterprise-grade, AI-first systems design modeling platform that empowers systems architects to perform end-to-end architecture design (from business to technology) with unprecedented elegance and intelligence. Named after the ancient Greek word for "master builder" or "chief of works," ARKITEKTON combines the expressiveness of code, the intuitiveness of visual representation, and the power of AI to create, build, and evolve complex systems.

## Vision Statement
To create the ultimate universal design and modeling platform that empowers any designer or modeler - from systems architects to business analysts to creative designers - with comprehensive capabilities that surpass existing tools like Figma, Miro, Mural, Lucidchart, and Visio. The platform combines enterprise architecture modeling with general-purpose design capabilities, featuring distributed version control at the model and component level (similar to Git) and providing portfolio views for design leadership across all disciplines.

## Competitive Positioning
ARKITEKTON is designed as an advanced competitor spanning multiple design and modeling categories:
- **Enterprise Architecture**: Mega, SoftwareAG's Aries & Alphabet, Ardoq, BlueDolphin, Avolution, Sparx Enterprise Architect, LeanIX
- **General Design & Collaboration**: Miro, Mural, Lucidchart, Visio, Figma
- **Unified Platform**: No existing tool combines enterprise architecture depth with general design flexibility

The platform's unique position bridges technical architecture modeling with creative design workflows, providing AI-first capabilities and superior user experience across all design disciplines.

## Core Architecture Principles

### Object-Oriented Model Design
Every component in the model is an object with intelligent connection capabilities, intuitive linking to other objects, and full traceability between states. Each object tells a story through its relationships and state transitions.

### State Management & Versioning
- **Single Current State**: One authoritative current state of the architecture model
- **Multiple Transition States**: Project-specific transition states with architect-defined checkpoints (monthly, quarterly, semi-annual, annual)
- **Git-like Merging**: Ability to merge transition states into main with differential views
- **Clear Traceability**: Complete visibility of state transitions and evolution paths

### AI-Powered Guidance
AI provides contextual suggestions and guidance to architects on how to proceed, similar to an intelligent assistant that understands architectural patterns and best practices.

### Enterprise Tool Integration
Native integration with enterprise tools including:
- Jira (project management and tracking)
- Confluence (documentation and collaboration)
- Aha! (product roadmapping)
- Azure DevOps (development lifecycle)
- Figma (design collaboration)
- Code Editors (VS Code, IntelliJ, etc.) for bi-directional code-architecture sync
- Additional tools providing inputs for optimal architectural outcomes

### End-to-End Development Lifecycle Mapping
Complete traceability across the entire software development lifecycle:
- **Strategy** → **Requirements** → **UX Design** → **Technical Design** → **Code** → **Test Cases** → **Deployment Components**
- Bi-directional synchronization ensuring changes in any layer propagate appropriately
- Forward engineering: Generate code snippets from proposed architecture
- Reverse engineering: Build architecture models from existing codebases
- Impact analysis across all layers when changes occur

### Code Editor Integration
- Plugin architecture for major IDEs and code editors
- Generate code snippets from architectural designs
- Reverse engineer architecture models from existing code
- Real-time synchronization between code changes and architectural models
- Support for refactoring scenarios where no existing architecture documentation exists

## Current State
The application currently provides a comprehensive design palette interface supporting cloud architecture elements from AWS, Azure, Google Cloud Platform, and Oracle Cloud, alongside traditional ArchiMate 3.0, TOGAF, and BPMN frameworks. This foundation supports the object-oriented model design with intelligent connections and relationships between architectural elements.

# Recent Changes

**August 31, 2025**: Major enhancement with cloud provider elements and unique ARKITEKTON design system
- Added comprehensive AWS, Azure, and Google Cloud Platform architecture elements
- Implemented sophisticated design system with emerald-to-teal gradients and glassmorphism effects
- Created multi-cloud and modern architecture pattern elements
- Enhanced visual styling with premium gradients, shadows, and smooth animations
- Added framework-specific color coding and visual indicators
- Updated interface to support 7 frameworks: ArchiMate, TOGAF, BPMN, AWS, Azure, GCP, Cloud Patterns
- Redesigned branding with custom ARKITEKTON logo and sophisticated typography

# User Preferences

Preferred communication style: Simple, everyday language.
Design Preference: Unique ARKITEKTON identity with sophisticated, elegant design language inspired by the concept of master builders.

# System Architecture

## Frontend Architecture
The client is built with React 18 using TypeScript and follows a component-based architecture. The UI leverages shadcn/ui component library with Radix UI primitives for accessibility and consistent design patterns. Styling is handled through Tailwind CSS with a custom design system using CSS variables for theming.

**Key Design Decisions:**
- **Component Structure**: Modular components organized by feature areas (palette/, ui/)
- **State Management**: React hooks with TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with custom theme variables for consistent design tokens
- **Form Handling**: React Hook Form with Zod validation schemas

## Backend Architecture
The server uses Express.js with TypeScript in ESM module format. The architecture follows a simple REST API pattern with in-memory storage that can be extended to use PostgreSQL with Drizzle ORM.

**Key Design Decisions:**
- **API Layer**: RESTful endpoints for architecture elements and user recent activity
- **Storage Abstraction**: Interface-based storage layer (IStorage) allowing swap between memory and database implementations
- **Database Schema**: Drizzle ORM with PostgreSQL dialect for type-safe database operations
- **Request Logging**: Custom middleware for API request logging and response capture

## Data Storage
The application uses a hybrid storage approach with Drizzle ORM configured for PostgreSQL but currently running with in-memory storage for development.

**Database Schema:**
- **users**: User authentication (id, username, password)
- **architecture_elements**: Core element catalog with metadata, relationships, and visual properties
- **recent_elements**: User activity tracking for recently accessed elements

**Key Design Decisions:**
- **ORM Choice**: Drizzle ORM for type safety and performance
- **Schema Design**: JSON fields for flexible relationship and metadata storage
- **Migration Strategy**: Drizzle Kit for schema migrations

## Build System
The project uses Vite for frontend bundling with esbuild for backend compilation, optimized for both development and production environments.

**Key Design Decisions:**
- **Development**: Vite dev server with HMR and custom middleware integration
- **Production**: Static file serving with Express for SPA deployment
- **TypeScript**: Strict configuration with path mapping for clean imports
- **Asset Handling**: Vite handles frontend assets, Express serves production builds

# External Dependencies

## UI Framework
- **shadcn/ui + Radix UI**: Provides accessible, customizable component primitives
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Lucide Icons**: Icon library for consistent visual elements

## Data Management
- **TanStack Query**: Server state management with caching and synchronization
- **Drizzle ORM**: Type-safe PostgreSQL ORM with migration support
- **Neon Database**: Serverless PostgreSQL provider (@neondatabase/serverless)

## Development Tools
- **Vite**: Frontend build tool with HMR and plugin ecosystem
- **TypeScript**: Type safety across frontend and backend
- **Replit Integration**: Development environment plugins for Replit platform

## Framework Dependencies
- **React**: Frontend framework with hooks and modern patterns
- **Express**: Backend web framework with middleware support
- **Wouter**: Lightweight client-side routing
- **React Hook Form + Zod**: Form handling with runtime validation