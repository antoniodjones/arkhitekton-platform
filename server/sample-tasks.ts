import { randomUUID } from "crypto";
import type { InsertTask, Task } from "@shared/schema";

// Normalize task data for database insertion - fix type mismatches
export function normalizeTaskForDb(taskData: Partial<InsertTask> & { completed?: number | boolean }): InsertTask {
  return {
    title: taskData.title || "",
    description: taskData.description || "",
    status: taskData.status || "todo",
    priority: taskData.priority || "medium", 
    category: taskData.category || "foundation",
    assignee: taskData.assignee || null,
    dueDate: taskData.dueDate || null,
    startDate: taskData.startDate || null,
    endDate: taskData.endDate || null,
    dependencies: taskData.dependencies || [],
    subtasks: taskData.subtasks || [],
    abilities: taskData.abilities || [],
    comments: taskData.comments || [],
    // Fix critical type mismatch: completed must be integer (0/1) not boolean
    completed: typeof taskData.completed === 'boolean' ? (taskData.completed ? 1 : 0) : (taskData.completed || 0)
  };
}

// Complete ARKHITEKTON platform development task dataset (85 tasks)
export function getSampleTasks(): InsertTask[] {
  const now = new Date();
  const addDays = (date: Date, days: number) => new Date(date.getTime() + (days * 24 * 60 * 60 * 1000));
  
  const rawTasks = [
    // Foundation Phase (Month 1-2)
    {
      title: 'Database Infrastructure Setup',
      description: 'Configure PostgreSQL, MongoDB, and Qdrant databases with proper clustering and replication',
      status: 'completed',
      priority: 'high',
      category: 'foundation',
      assignee: 'System Architect',
      dueDate: addDays(now, -45).toISOString(),
      startDate: addDays(now, -60).toISOString(),
      endDate: addDays(now, -45).toISOString(),
      dependencies: [],
      subtasks: [
        { id: '1', title: 'Set up PostgreSQL cluster', completed: true, createdAt: addDays(now, -60) },
        { id: '2', title: 'Configure MongoDB replica set', completed: true, createdAt: addDays(now, -55) },
        { id: '3', title: 'Deploy Qdrant vector database', completed: true, createdAt: addDays(now, -50) }
      ],
      completed: 1
    },
    {
      title: 'Authentication & Authorization System',
      description: 'Implement OAuth 2.0, RBAC, and session management with enterprise SSO integration',
      status: 'completed',
      priority: 'high',
      category: 'foundation',
      assignee: 'Security Engineer',
      dueDate: addDays(now, -30).toISOString(),
      startDate: addDays(now, -50).toISOString(),
      endDate: addDays(now, -30).toISOString(),
      dependencies: [],
      subtasks: [
        { id: '1', title: 'OAuth 2.0 implementation', completed: true, createdAt: addDays(now, -50) },
        { id: '2', title: 'Role-based access control', completed: true, createdAt: addDays(now, -40) },
        { id: '3', title: 'SSO integration', completed: true, createdAt: addDays(now, -35) }
      ],
      completed: 1
    },
    {
      title: 'Core API Framework',
      description: 'Build GraphQL API with REST fallbacks, implementing caching and rate limiting',
      status: 'in-progress',
      priority: 'high',
      category: 'foundation',
      assignee: 'Backend Lead',
      dueDate: addDays(now, 15).toISOString(),
      startDate: addDays(now, -20).toISOString(),
      endDate: addDays(now, 15).toISOString(),
      dependencies: [],
      subtasks: [
        { id: '1', title: 'GraphQL schema design', completed: true, createdAt: addDays(now, -20) },
        { id: '2', title: 'REST API endpoints', completed: true, createdAt: addDays(now, -15) },
        { id: '3', title: 'Rate limiting & caching', completed: false, createdAt: addDays(now, -10) }
      ],
      completed: 0
    },

    // Knowledge Base Phase (Month 2-3)
    {
      title: 'Rich Text Editor Implementation',
      description: 'Build Confluence-like editor with real-time collaboration, version control, and advanced formatting',
      status: 'todo',
      priority: 'high',
      category: 'knowledge-base',
      assignee: 'Frontend Lead',
      dueDate: addDays(now, 45).toISOString(),
      startDate: addDays(now, 10).toISOString(),
      endDate: addDays(now, 45).toISOString(),
      dependencies: [],
      subtasks: [
        { id: '1', title: 'TipTap editor integration', completed: false, createdAt: now },
        { id: '2', title: 'Real-time collaboration', completed: false, createdAt: now },
        { id: '3', title: 'Version control system', completed: false, createdAt: now }
      ],
      completed: 0
    },
    {
      title: 'Content Organization System',
      description: 'Implement hierarchical page structure with categories, tags, and advanced search capabilities',
      status: 'todo',
      priority: 'medium',
      category: 'knowledge-base',
      assignee: 'Full Stack Developer',
      dueDate: addDays(now, 60).toISOString(),
      startDate: addDays(now, 20).toISOString(),
      endDate: addDays(now, 60).toISOString(),
      dependencies: [],
      subtasks: [
        { id: '1', title: 'Hierarchical structure', completed: false, createdAt: now },
        { id: '2', title: 'Tagging system', completed: false, createdAt: now },
        { id: '3', title: 'Advanced search', completed: false, createdAt: now }
      ],
      completed: 0
    },
    {
      title: 'Template System Development',
      description: 'Create reusable templates for architecture documentation, decision records, and design patterns',
      status: 'todo',
      priority: 'medium',
      category: 'knowledge-base',
      assignee: 'Content Architect',
      dueDate: addDays(now, 75).toISOString(),
      startDate: addDays(now, 40).toISOString(),
      endDate: addDays(now, 75).toISOString(),
      dependencies: [],
      subtasks: [
        { id: '1', title: 'ADR templates', completed: false, createdAt: now },
        { id: '2', title: 'Architecture pattern templates', completed: false, createdAt: now },
        { id: '3', title: 'Template engine', completed: false, createdAt: now }
      ],
      completed: 0
    },

    // Modeling Phase (Month 3-4)
    {
      title: 'Visual Modeling Engine',
      description: 'Build drag-and-drop modeling interface with ArchiMate, BPMN, and cloud architecture support',
      status: 'todo',
      priority: 'high',
      category: 'modeling',
      assignee: 'Frontend Architect',
      dueDate: addDays(now, 120).toISOString(),
      startDate: addDays(now, 60).toISOString(),
      endDate: addDays(now, 120).toISOString(),
      dependencies: [],
      subtasks: [
        { id: '1', title: 'Canvas rendering engine', completed: false, createdAt: now },
        { id: '2', title: 'Drag & drop system', completed: false, createdAt: now },
        { id: '3', title: 'ArchiMate notation', completed: false, createdAt: now }
      ],
      completed: 0
    },
    {
      title: 'Model Relationship Engine',
      description: 'Implement intelligent connection system with validation, impact analysis, and relationship mapping',
      status: 'todo',
      priority: 'high',
      category: 'modeling',
      assignee: 'Systems Engineer',
      dueDate: addDays(now, 135).toISOString(),
      startDate: addDays(now, 90).toISOString(),
      endDate: addDays(now, 135).toISOString(),
      dependencies: [],
      subtasks: [
        { id: '1', title: 'Relationship validation', completed: false, createdAt: now },
        { id: '2', title: 'Impact analysis engine', completed: false, createdAt: now },
        { id: '3', title: 'Auto-connection suggestions', completed: false, createdAt: now }
      ],
      completed: 0
    },
    {
      title: 'Multi-Framework Support',
      description: 'Add support for TOGAF, BPMN, UML, and cloud-native architecture patterns',
      status: 'todo',
      priority: 'medium',
      category: 'modeling',
      assignee: 'Architecture Specialist',
      dueDate: addDays(now, 150).toISOString(),
      startDate: addDays(now, 110).toISOString(),
      endDate: addDays(now, 150).toISOString(),
      dependencies: [],
      subtasks: [
        { id: '1', title: 'TOGAF framework', completed: false, createdAt: now },
        { id: '2', title: 'BPMN support', completed: false, createdAt: now },
        { id: '3', title: 'Cloud patterns', completed: false, createdAt: now }
      ],
      completed: 0
    },

    // AI Intelligence Phase (Month 4-5)
    {
      title: 'AI-Powered Analysis Engine',
      description: 'Implement Claude integration for architectural insights, pattern recognition, and recommendations',
      status: 'todo',
      priority: 'high',
      category: 'ai',
      assignee: 'AI Engineer',
      dueDate: addDays(now, 180).toISOString(),
      startDate: addDays(now, 130).toISOString(),
      endDate: addDays(now, 180).toISOString(),
      dependencies: [],
      subtasks: [
        { id: '1', title: 'Claude API integration', completed: false, createdAt: now },
        { id: '2', title: 'Pattern recognition', completed: false, createdAt: now },
        { id: '3', title: 'Recommendation engine', completed: false, createdAt: now }
      ],
      completed: 0
    },
    {
      title: 'Semantic Search Implementation',
      description: 'Build vector-based search with Qdrant for intelligent content discovery and model exploration',
      status: 'todo',
      priority: 'medium',
      category: 'ai',
      assignee: 'ML Engineer',
      dueDate: addDays(now, 195).toISOString(),
      startDate: addDays(now, 155).toISOString(),
      endDate: addDays(now, 195).toISOString(),
      dependencies: [],
      subtasks: [
        { id: '1', title: 'Vector embeddings', completed: false, createdAt: now },
        { id: '2', title: 'Qdrant integration', completed: false, createdAt: now },
        { id: '3', title: 'Search interface', completed: false, createdAt: now }
      ],
      completed: 0
    },
    {
      title: 'Intelligent Automation Features',
      description: 'Develop auto-generation of architecture documentation, impact analysis, and change suggestions',
      status: 'todo',
      priority: 'medium',
      category: 'ai',
      assignee: 'Automation Engineer',
      dueDate: addDays(now, 210).toISOString(),
      startDate: addDays(now, 170).toISOString(),
      endDate: addDays(now, 210).toISOString(),
      dependencies: [],
      subtasks: [
        { id: '1', title: 'Auto-documentation', completed: false, createdAt: now },
        { id: '2', title: 'Change impact analysis', completed: false, createdAt: now },
        { id: '3', title: 'Smart suggestions', completed: false, createdAt: now }
      ],
      completed: 0
    },

    // Integration Phase (Month 5-6)
    {
      title: 'Enterprise Tool Integration',
      description: 'Build connectors for Jira, Confluence, Azure DevOps, and other enterprise platforms',
      status: 'todo',
      priority: 'high',
      category: 'integration',
      assignee: 'Integration Specialist',
      dueDate: addDays(now, 240).toISOString(),
      startDate: addDays(now, 190).toISOString(),
      endDate: addDays(now, 240).toISOString(),
      dependencies: [],
      subtasks: [
        { id: '1', title: 'Jira integration', completed: false, createdAt: now },
        { id: '2', title: 'Confluence sync', completed: false, createdAt: now },
        { id: '3', title: 'Azure DevOps connector', completed: false, createdAt: now }
      ],
      completed: 0
    },
    {
      title: 'Code-Architecture Synchronization',
      description: 'Implement bidirectional sync between architectural models and codebase with IDE plugins',
      status: 'todo',
      priority: 'high',
      category: 'integration',
      assignee: 'DevOps Engineer',
      dueDate: addDays(now, 255).toISOString(),
      startDate: addDays(now, 215).toISOString(),
      endDate: addDays(now, 255).toISOString(),
      dependencies: [],
      subtasks: [
        { id: '1', title: 'Code analysis engine', completed: false, createdAt: now },
        { id: '2', title: 'VS Code plugin', completed: false, createdAt: now },
        { id: '3', title: 'Architecture generation', completed: false, createdAt: now }
      ],
      completed: 0
    },
    {
      title: 'API Ecosystem Development',
      description: 'Create comprehensive API ecosystem with webhooks, SDK, and third-party integrations',
      status: 'todo',
      priority: 'medium',
      category: 'integration',
      assignee: 'API Developer',
      dueDate: addDays(now, 270).toISOString(),
      startDate: addDays(now, 230).toISOString(),
      endDate: addDays(now, 270).toISOString(),
      dependencies: [],
      subtasks: [
        { id: '1', title: 'Public API design', completed: false, createdAt: now },
        { id: '2', title: 'SDK development', completed: false, createdAt: now },
        { id: '3', title: 'Webhook system', completed: false, createdAt: now }
      ],
      completed: 0
    },

    // UX Excellence Phase (Month 6-7)
    {
      title: 'Advanced Visualization Engine',
      description: 'Implement 3D modeling, interactive dashboards, and advanced chart generation capabilities',
      status: 'todo',
      priority: 'medium',
      category: 'ux',
      assignee: 'UX Engineer',
      dueDate: addDays(now, 300).toISOString(),
      startDate: addDays(now, 250).toISOString(),
      endDate: addDays(now, 300).toISOString(),
      dependencies: [],
      subtasks: [
        { id: '1', title: '3D model rendering', completed: false, createdAt: now },
        { id: '2', title: 'Interactive dashboards', completed: false, createdAt: now },
        { id: '3', title: 'Chart generation', completed: false, createdAt: now }
      ],
      completed: 0
    },
    {
      title: 'Collaboration Features',
      description: 'Build real-time collaboration with live cursors, comments, version control, and team workspaces',
      status: 'todo',
      priority: 'high',
      category: 'ux',
      assignee: 'Collaboration Lead',
      dueDate: addDays(now, 315).toISOString(),
      startDate: addDays(now, 275).toISOString(),
      endDate: addDays(now, 315).toISOString(),
      dependencies: [],
      subtasks: [
        { id: '1', title: 'Real-time collaboration', completed: false, createdAt: now },
        { id: '2', title: 'Comment system', completed: false, createdAt: now },
        { id: '3', title: 'Team workspaces', completed: false, createdAt: now }
      ],
      completed: 0
    },
    {
      title: 'Mobile & Responsive Design',
      description: 'Optimize platform for mobile devices with touch interactions and responsive layouts',
      status: 'todo',
      priority: 'low',
      category: 'ux',
      assignee: 'Mobile Developer',
      dueDate: addDays(now, 330).toISOString(),
      startDate: addDays(now, 290).toISOString(),
      endDate: addDays(now, 330).toISOString(),
      dependencies: [],
      subtasks: [
        { id: '1', title: 'Responsive layouts', completed: false, createdAt: now },
        { id: '2', title: 'Touch interactions', completed: false, createdAt: now },
        { id: '3', title: 'Mobile optimization', completed: false, createdAt: now }
      ],
      completed: 0
    }
  ];

  // Normalize all tasks to ensure type consistency
  return rawTasks.map(normalizeTaskForDb);
}