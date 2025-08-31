# Overview

This is an architecture modeling application called "ArchModel Pro" that provides a design palette interface for enterprise architecture modeling. The application focuses on ArchiMate 3.0 framework elements but also supports TOGAF and BPMN frameworks. Users can browse, search, and select various architecture elements across different categories (business, application, data, technology) with detailed properties and usage guidelines.

# User Preferences

Preferred communication style: Simple, everyday language.

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