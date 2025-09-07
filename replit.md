# Overview

ARKHITEKTON is an enterprise-grade, AI-first systems design modeling platform that empowers systems architects to perform end-to-end architecture design (from business to technology) with unprecedented elegance and intelligence. Named after the ancient Greek word for "master builder" or "chief of works," ARKHITEKTON combines the expressiveness of code, the intuitiveness of visual representation, and the power of AI to create, build, and evolve complex systems.

## Vision Statement
To create the ultimate universal design and modeling platform that empowers any designer or modeler - from systems architects to business analysts to creative designers - with comprehensive capabilities that surpass existing tools like Figma, Miro, Mural, Lucidchart, and Visio. The platform combines enterprise architecture modeling with general-purpose design capabilities, featuring distributed version control at the model and component level (similar to Git) and providing portfolio views for design leadership across all disciplines.

## Competitive Positioning
ARKHITEKTON is designed as an advanced competitor spanning multiple design and modeling categories:
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

**September 7, 2025**: Task Management UI Enhancement & Critical Date Handling Fix
- Fixed critical recurring issue: Edit Task dialog date field disappearing (ISO to YYYY-MM-DD conversion)
- Implemented comprehensive task view enhancements: Board, List, and Table views with proper date displays
- Added task ID visibility with (first8chars) format across all views for better traceability
- Fixed dark mode form control visibility issues with custom CSS overrides
- Added date columns to List and Table views with calendar icons and proper formatting
- Implemented double-click editing functionality for task titles in List and Table views
- **CRITICAL STORAGE PATTERN**: System uses MemStorage for development (has sample tasks with dates) vs DatabaseStorage (no sample data initialization)
- **DATE HANDLING PATTERN**: API returns ISO dates (2025-07-09T22:01:48.124Z), HTML inputs expect YYYY-MM-DD format
- **FORM VALIDATION PATTERN**: Edit dialogs must convert between ISO strings and input formats to prevent data loss

**August 31, 2025**: Revolutionary Enterprise Architecture Governance System with AI-Powered Ticketing
- Implemented comprehensive ticket system with JIRA-like functionality but more elegant and integrated
- Created Architecture Review Request service with sophisticated workflow management
- Built Architect Assignment Request system for project resource allocation
- Enhanced ADR system with full ticket capabilities, state management, and traceability
- Added intelligent AI change detection system that automatically monitors code changes
- Implemented object linkage system for configurable associations between tickets and architecture components
- Integrated change detection with workspace for real-time architecture impact alerts
- Added notification badges and alerts for critical architecture changes
- Created comprehensive ticket states: open, in_progress, under_review, approved, rejected, closed, on_hold
- Built sophisticated metadata schemas for different ticket types with full context capture

# User Preferences

Preferred communication style: Simple, everyday language.
Design Preference: Unique ARKHITEKTON identity with sophisticated, elegant design language inspired by the concept of master builders.

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
- **tasks**: Project management tasks with full metadata (title, description, dates, status, priority, dependencies, subtasks)
- **sessions**: Session storage for PostgreSQL-backed session management

**Key Design Decisions:**
- **ORM Choice**: Drizzle ORM for type safety and performance
- **Schema Design**: JSON fields for flexible relationship and metadata storage
- **Migration Strategy**: Drizzle Kit for schema migrations
- **Storage Strategy**: MemStorage (development with sample data) vs DatabaseStorage (production with PostgreSQL)
- **Date Format Strategy**: API uses ISO strings, forms use YYYY-MM-DD, conversion utilities required

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

# Development Patterns & Anti-Patterns

## Critical Patterns to Follow

### Date Handling Pattern
**Problem**: Edit Task dialog dates disappear due to format mismatch
**Root Cause**: API returns ISO strings (2025-07-09T22:01:48.124Z), HTML date inputs expect YYYY-MM-DD
**Solution Pattern**:
```typescript
// Always use utility functions for date conversion
const formatDateForInput = (isoString: string | null) => {
  if (!isoString) return '';
  return new Date(isoString).toISOString().split('T')[0];
};

const formatDateForAPI = (dateString: string | null) => {
  if (!dateString) return null;
  return new Date(dateString).toISOString();
};
```

### Storage Configuration Pattern
**Problem**: Switching between MemStorage and DatabaseStorage causes data inconsistencies
**Root Cause**: Only MemStorage initializes sample tasks with proper dates in constructor
**Solution Pattern**:
- Use MemStorage for development (has initializeSampleTasks() method)
- Use DatabaseStorage for production (requires manual data seeding)
- Always check storage type before implementing task-related features

### Form Validation Pattern
**Problem**: Edit dialogs lose data when validation fails or form initializes incorrectly
**Root Cause**: React Hook Form default values must match exact format expected by inputs
**Solution Pattern**:
```typescript
// Always set proper default values using format conversion
const form = useForm({
  defaultValues: {
    startDate: formatDateForInput(task?.startDate),
    endDate: formatDateForInput(task?.endDate),
    // ... other fields
  }
});
```

## Critical Anti-Patterns to Avoid

1. **Never modify date data without format conversion**
2. **Never assume storage type - always check which implementation is active**
3. **Never skip form default value initialization for edit dialogs**
4. **Never implement task features without testing edit dialog functionality**

## Pre-Implementation Checklist

Before making ANY changes to task management:
1. ✅ Check current storage implementation (MemStorage vs DatabaseStorage)
2. ✅ Verify date format conversion utilities exist and are used
3. ✅ Test Edit Task dialog with real task data
4. ✅ Ensure form default values are properly formatted
5. ✅ Update this documentation with any new patterns discovered