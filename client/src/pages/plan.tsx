import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Target, 
  CheckCircle2, 
  Circle, 
  Brain, 
  Palette, 
  Link2, 
  Sparkles,
  Trophy,
  Rocket,
  Zap,
  ArrowLeft,
  BookOpen,
  Search,
  Filter,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  GripVertical
} from 'lucide-react';
import { Link } from 'wouter';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  DragOverEvent,
  useDroppable
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  category: 'foundation' | 'knowledge-base' | 'ai' | 'modeling' | 'integration' | 'ux';
  status: 'todo' | 'in-progress' | 'completed';
  assignee?: string;
  dueDate?: string;
}

// Draggable Task Card Component
function DraggableTaskCard({ 
  task, 
  getCategoryBadgeColor, 
  getPriorityColor, 
  toggleTask, 
  updateTaskStatus 
}: {
  task: Task;
  getCategoryBadgeColor: (category: Task['category']) => string;
  getPriorityColor: (priority: Task['priority']) => string;
  toggleTask: (taskId: string) => void;
  updateTaskStatus: (taskId: string, newStatus: Task['status']) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group p-4 border rounded-lg hover:shadow-md transition-all cursor-grab active:cursor-grabbing ${
        isDragging ? 'opacity-50' : ''
      } ${
        task.status === 'completed' 
          ? 'bg-green-50/50 dark:bg-green-950/10 border-green-200 dark:border-green-800' 
          : task.status === 'in-progress'
          ? 'bg-blue-50/50 dark:bg-blue-950/10 border-blue-200 dark:border-blue-800'
          : 'bg-background'
      }`}
      data-testid={`task-card-${task.id}`}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-start gap-2 flex-1 pr-2">
          <GripVertical className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <h4 className={`font-medium text-sm leading-tight ${
            task.completed ? 'line-through text-muted-foreground' : ''
          }`}>
            {task.title}
          </h4>
        </div>
        <div className="flex items-center gap-1">
          {task.status !== 'in-progress' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                updateTaskStatus(task.id, 'in-progress');
              }}
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              data-testid={`move-to-progress-${task.id}`}
            >
              <Clock className="w-3 h-3" />
            </Button>
          )}
          {task.status === 'in-progress' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                updateTaskStatus(task.id, 'todo');
              }}
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              data-testid={`move-to-todo-${task.id}`}
            >
              <Circle className="w-3 h-3" />
            </Button>
          )}
          {task.status !== 'completed' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                updateTaskStatus(task.id, 'completed');
              }}
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              data-testid={`move-to-completed-${task.id}`}
            >
              <CheckCircle2 className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>
      <p className={`text-xs text-muted-foreground mb-3 line-clamp-2 ${
        task.completed ? 'line-through' : ''
      }`}>
        {task.description}
      </p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge className={`text-xs px-2 py-0.5 ${getCategoryBadgeColor(task.category)} ${
            task.completed ? 'opacity-60' : ''
          }`}>
            {task.category === 'knowledge-base' ? 'KB' : 
             task.category === 'ai' ? 'AI' : 
             task.category.charAt(0).toUpperCase() + task.category.slice(1)}
          </Badge>
          <Badge className={`text-xs px-2 py-0.5 ${getPriorityColor(task.priority)} ${
            task.completed ? 'opacity-60' : ''
          }`}>
            {task.priority}
          </Badge>
        </div>
        {task.completed ? (
          <CheckCircle2 className="w-4 h-4 text-green-500" />
        ) : (
          <Checkbox
            checked={task.completed}
            onCheckedChange={(e) => {
              e.stopPropagation?.();
              toggleTask(task.id);
            }}
            className="h-4 w-4"
            data-testid={`task-checkbox-${task.id}`}
            onClick={(e) => e.stopPropagation()}
          />
        )}
      </div>
    </div>
  );
}

// Droppable Column Component
function DroppableColumn({ 
  id, 
  title, 
  icon: Icon, 
  tasks, 
  iconColor,
  getCategoryBadgeColor,
  getPriorityColor,
  toggleTask,
  updateTaskStatus 
}: {
  id: string;
  title: string;
  icon: any;
  tasks: Task[];
  iconColor: string;
  getCategoryBadgeColor: (category: Task['category']) => string;
  getPriorityColor: (priority: Task['priority']) => string;
  toggleTask: (taskId: string) => void;
  updateTaskStatus: (taskId: string, newStatus: Task['status']) => void;
}) {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Icon className={`w-5 h-5 ${iconColor}`} />
            {title}
          </CardTitle>
          <Badge variant="outline" className="text-sm">
            {tasks.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent 
        ref={setNodeRef}
        className={`flex-1 space-y-3 min-h-32 transition-colors ${
          isOver ? 'bg-accent/50 ring-2 ring-primary/20 ring-inset' : ''
        }`}
      >
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <DraggableTaskCard
              key={task.id}
              task={task}
              getCategoryBadgeColor={getCategoryBadgeColor}
              getPriorityColor={getPriorityColor}
              toggleTask={toggleTask}
              updateTaskStatus={updateTaskStatus}
            />
          ))}
        </SortableContext>
        {tasks.length === 0 && (
          <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
            Drop tasks here
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function PlanPage() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([
    // Foundation Phase (Current)
    { 
      id: 'f1', 
      title: 'Core Application Structure', 
      description: 'React/TypeScript foundation with modern tooling',
      completed: true, 
      priority: 'high', 
      category: 'foundation',
      status: 'completed'
    },
    { 
      id: 'f2', 
      title: 'Orange Theme Implementation', 
      description: 'Warm orange architectural palette throughout UI',
      completed: true, 
      priority: 'high', 
      category: 'foundation',
      status: 'completed'
    },
    { 
      id: 'f3', 
      title: 'Navigation & Dashboard Framework', 
      description: 'Responsive sidebar navigation and dashboard layout',
      completed: true, 
      priority: 'high', 
      category: 'foundation',
      status: 'completed'
    },
    { 
      id: 'f4', 
      title: 'Apple-Style Theme Switcher', 
      description: 'Light/Dark/Auto mode switcher with system detection',
      completed: true, 
      priority: 'medium', 
      category: 'foundation',
      status: 'completed'
    },
    { 
      id: 'f5', 
      title: 'Basic Governance System', 
      description: 'Ticket system with JIRA-like functionality',
      completed: true, 
      priority: 'medium', 
      category: 'foundation',
      status: 'completed'
    },
    { 
      id: 'f6', 
      title: 'Logo Design Selection', 
      description: 'Choose final ARKHITEKTON visual identity',
      completed: false, 
      priority: 'medium', 
      category: 'foundation',
      status: 'todo'
    },
    { 
      id: 'f7', 
      title: 'Advanced Typography', 
      description: 'Implement geometric font system matching design vision',
      completed: false, 
      priority: 'low', 
      category: 'foundation',
      status: 'todo'
    },
    
    // Knowledge Base Platform - Enterprise Documentation System
    {
      id: 'kb1',
      title: 'Hierarchical Page Structure & Navigation',
      description: 'Create foundation with nested page organization, drag-and-drop reorganization, and smart breadcrumb navigation system',
      completed: true,
      priority: 'high',
      category: 'knowledge-base',
      status: 'completed'
    },
    {
      id: 'kb2',
      title: 'Rich WYSIWYG Editor',
      description: 'Build powerful editor with architecture-specific content blocks, code snippets, diagrams, tables, and advanced formatting',
      completed: false,
      priority: 'high',
      category: 'knowledge-base',
      status: 'in-progress'
    },
    {
      id: 'kb3',
      title: 'Architecture Template Library',
      description: 'Design template collection for ADRs, Implementation Guides, Best Practices, Project Showcases, and technical documentation',
      completed: false,
      priority: 'high',
      category: 'knowledge-base',
      status: 'todo'
    },
    {
      id: 'kb4',
      title: 'Advanced Search & Discovery',
      description: 'Implement intelligent search across all documentation with filters, tags, content recommendations, and semantic search',
      completed: false,
      priority: 'medium',
      category: 'knowledge-base',
      status: 'todo'
    },
    {
      id: 'kb5',
      title: 'Team Collaboration Features',
      description: 'Add commenting system, reviews, version history, change tracking, and approval workflows for enterprise collaboration',
      completed: false,
      priority: 'medium',
      category: 'knowledge-base',
      status: 'todo'
    },
    {
      id: 'kb6',
      title: 'Design Canvas Integration',
      description: 'Connect documentation to live architecture diagrams, embed models, sync design changes, and create living documentation',
      completed: false,
      priority: 'medium',
      category: 'knowledge-base',
      status: 'todo'
    },
    
    // Core Modeling Engine
    { 
      id: 'm1', 
      title: 'Visual Canvas Implementation', 
      description: 'Infinite canvas with smooth zooming/panning',
      completed: false, 
      priority: 'high', 
      category: 'modeling',
      status: 'todo'
    },
    { 
      id: 'm2', 
      title: 'Component Palette', 
      description: 'AWS, Azure, GCP, Oracle Cloud architecture elements',
      completed: false, 
      priority: 'high', 
      category: 'modeling',
      status: 'todo'
    },
    { 
      id: 'm3', 
      title: 'Drag-Drop Functionality', 
      description: 'Intuitive drag-drop with magnetic snap-to-grid',
      completed: false, 
      priority: 'high', 
      category: 'modeling',
      status: 'todo'
    },
    { 
      id: 'm4', 
      title: 'Object Relationship System', 
      description: 'Intelligent connections between architectural components',
      completed: false, 
      priority: 'high', 
      category: 'modeling',
      status: 'todo'
    },
    
    // AI Intelligence Layer
    { 
      id: 'ai1', 
      title: 'Smart Recommendation Engine', 
      description: 'AI-powered architecture suggestions and best practices',
      completed: false, 
      priority: 'high', 
      category: 'ai',
      status: 'todo'
    },
    { 
      id: 'ai2', 
      title: 'Intelligent Change Detection', 
      description: 'Automatic monitoring of architecture changes and impacts',
      completed: false, 
      priority: 'high', 
      category: 'ai',
      status: 'todo'
    },
    { 
      id: 'ai3', 
      title: 'Pattern Recognition System', 
      description: 'AI detection of architectural patterns and anti-patterns',
      completed: false, 
      priority: 'medium', 
      category: 'ai',
      status: 'todo'
    },
    { 
      id: 'ai4', 
      title: 'Natural Language Queries', 
      description: 'Ask architecture questions in plain English',
      completed: false, 
      priority: 'medium', 
      category: 'ai',
      status: 'todo'
    },
    
    // Integration Ecosystem
    { 
      id: 'i1', 
      title: 'Enterprise Tool Connectors', 
      description: 'Jira, Confluence, Azure DevOps integration',
      completed: false, 
      priority: 'medium', 
      category: 'integration',
      status: 'todo'
    },
    { 
      id: 'i2', 
      title: 'Code Editor Plugins', 
      description: 'VS Code, IntelliJ extensions for bi-directional sync',
      completed: false, 
      priority: 'medium', 
      category: 'integration',
      status: 'todo'
    },
    { 
      id: 'i3', 
      title: 'API Gateway', 
      description: 'RESTful APIs for third-party integrations',
      completed: false, 
      priority: 'low', 
      category: 'integration',
      status: 'todo'
    },
    
    // UX Excellence
    { 
      id: 'ux1', 
      title: 'Performance Optimization', 
      description: 'Sub-100ms response times and 60fps animations',
      completed: false, 
      priority: 'high', 
      category: 'ux',
      status: 'todo'
    },
    { 
      id: 'ux2', 
      title: 'Real-Time Collaboration', 
      description: 'Multi-user editing with live cursors and presence',
      completed: false, 
      priority: 'high', 
      category: 'ux',
      status: 'todo'
    },
    { 
      id: 'ux3', 
      title: 'Advanced Search & Discovery', 
      description: 'Global semantic search across all models',
      completed: false, 
      priority: 'medium', 
      category: 'ux',
      status: 'todo'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Task['category'] | 'all'>('all');

  // Drag and Drop Sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    setActiveId(active.id as string);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find the containers
    const activeTask = tasks.find(t => t.id === activeId);
    const activeContainer = activeTask?.status;

    // Check if we're over a column or a task
    const overTask = tasks.find(t => t.id === overId);
    let overContainer: Task['status'];
    
    if (overTask) {
      overContainer = overTask.status;
    } else {
      // We're over a column
      overContainer = overId as Task['status'];
    }

    if (!activeContainer || !overContainer) return;
    
    if (activeContainer === overContainer) return;

    setTasks((tasks) => {
      const activeItems = tasks.filter(t => t.status === activeContainer);
      const overItems = tasks.filter(t => t.status === overContainer);

      // Find the indexes
      const activeIndex = activeItems.findIndex(t => t.id === activeId);
      const overIndex = overTask ? overItems.findIndex(t => t.id === overId) : overItems.length;

      let newIndex: number;
      if (overId in tasks.map(t => t.status)) {
        // We're over a column
        newIndex = overItems.length + 1;
      } else {
        // We're over a task
        const isBelowOverItem = over && overIndex < overItems.length - 1;
        const modifier = isBelowOverItem ? 1 : 0;
        newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
      }

      return tasks.map(task => {
        if (task.id === activeId) {
          return {
            ...task,
            status: overContainer,
            completed: overContainer === 'completed'
          };
        }
        return task;
      });
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find the containers
    const activeTask = tasks.find(t => t.id === activeId);
    const overTask = tasks.find(t => t.id === overId);
    
    let overContainer: Task['status'] | undefined;
    
    if (overTask) {
      overContainer = overTask.status;
    } else {
      // Check if we're over a column
      if (['todo', 'in-progress', 'completed'].includes(overId)) {
        overContainer = overId as Task['status'];
      }
    }

    if (activeTask && overContainer && activeTask.status !== overContainer) {
      setTasks(tasks => tasks.map(task => {
        if (task.id === activeId) {
          return {
            ...task,
            status: overContainer!,
            completed: overContainer === 'completed'
          };
        }
        return task;
      }));
    }

    setActiveId(null);
  }

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const newCompleted = !task.completed;
        return { 
          ...task, 
          completed: newCompleted,
          status: newCompleted ? 'completed' : 'todo'
        };
      }
      return task;
    }));
  };

  const updateTaskStatus = (taskId: string, newStatus: Task['status']) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { 
        ...task, 
        status: newStatus,
        completed: newStatus === 'completed'
      } : task
    ));
  };

  const getCompletionStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const percentage = Math.round((completed / total) * 100);
    return { total, completed, percentage };
  };

  const getTasksByStatus = (status: Task['status']) => {
    return getFilteredTasks().filter(task => task.status === status);
  };

  const getFilteredTasks = () => {
    return tasks.filter(task => {
      const matchesSearch = searchTerm === '' || 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || task.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  };

  const getCategoryIcon = (category: Task['category']) => {
    switch (category) {
      case 'foundation': return Rocket;
      case 'knowledge-base': return BookOpen;
      case 'ai': return Brain;
      case 'modeling': return Palette;
      case 'integration': return Link2;
      case 'ux': return Sparkles;
      default: return Circle;
    }
  };

  const getCategoryColor = (category: Task['category']) => {
    switch (category) {
      case 'foundation': return 'bg-orange-500';
      case 'knowledge-base': return 'bg-indigo-500';
      case 'ai': return 'bg-purple-500';
      case 'modeling': return 'bg-blue-500';
      case 'integration': return 'bg-green-500';
      case 'ux': return 'bg-pink-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryBadgeColor = (category: Task['category']) => {
    switch (category) {
      case 'foundation': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      case 'knowledge-base': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300';
      case 'ai': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'modeling': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'integration': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'ux': return 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'low': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'todo': return Circle;
      case 'in-progress': return Clock;
      case 'completed': return CheckCircle2;
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'todo': return 'text-gray-400';
      case 'in-progress': return 'text-blue-500';
      case 'completed': return 'text-green-500';
    }
  };

  const stats = getCompletionStats();

  return (
    <div className="flex-1 space-y-8 p-8" data-testid="plan-page">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm" data-testid="back-to-dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">ARKHITEKTON Development Plan</h1>
            <p className="text-muted-foreground mt-1">
              Building the ultimate enterprise architecture platform - advanced, elegant, and simple
            </p>
          </div>
        </div>
        
        {/* Vision Statement */}
        <Card className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 border-orange-200 dark:border-orange-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-orange-800 dark:text-orange-200">
              <Trophy className="w-6 h-6" />
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-orange-700 dark:text-orange-300 leading-relaxed">
              Build ARKHITEKTON to be so <strong>advanced, elegant, and simple</strong> that every other enterprise 
              architecture tool becomes obsolete. We're not just building software - we're creating the future of 
              how architects design, collaborate, and transform complex systems into understandable excellence.
            </p>
            <div className="flex items-center gap-2 mt-4 text-sm text-orange-600 dark:text-orange-400">
              <Zap className="w-4 h-4" />
              <span>Making enterprise architecture tools that architects actually love to use</span>
            </div>
          </CardContent>
        </Card>
        
        {/* Progress Overview */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Overall Progress</CardTitle>
              <Badge variant="secondary" className="text-lg px-3 py-1">
                {stats.completed} / {stats.total} Complete
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Progress value={stats.percentage} className="h-3" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{stats.percentage}% Complete</span>
                <span>Making every other EA tool obsolete</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                  data-testid="search-tasks"
                />
              </div>
            </div>
            <div className="w-full sm:w-64">
              <Select value={selectedCategory} onValueChange={(value: Task['category'] | 'all') => setSelectedCategory(value)}>
                <SelectTrigger data-testid="filter-category">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="foundation">Foundation</SelectItem>
                  <SelectItem value="knowledge-base">Knowledge Base</SelectItem>
                  <SelectItem value="modeling">Modeling</SelectItem>
                  <SelectItem value="ai">AI Intelligence</SelectItem>
                  <SelectItem value="integration">Integration</SelectItem>
                  <SelectItem value="ux">UX Excellence</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Drag and Drop Kanban Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-96">
          <div id="todo">
            <DroppableColumn
              id="todo"
              title="To Do"
              icon={Circle}
              iconColor="text-gray-400"
              tasks={getTasksByStatus('todo')}
              getCategoryBadgeColor={getCategoryBadgeColor}
              getPriorityColor={getPriorityColor}
              toggleTask={toggleTask}
              updateTaskStatus={updateTaskStatus}
            />
          </div>

          <div id="in-progress">
            <DroppableColumn
              id="in-progress"
              title="In Progress"
              icon={Clock}
              iconColor="text-blue-500"
              tasks={getTasksByStatus('in-progress')}
              getCategoryBadgeColor={getCategoryBadgeColor}
              getPriorityColor={getPriorityColor}
              toggleTask={toggleTask}
              updateTaskStatus={updateTaskStatus}
            />
          </div>

          <div id="completed">
            <DroppableColumn
              id="completed"
              title="Completed"
              icon={CheckCircle2}
              iconColor="text-green-500"
              tasks={getTasksByStatus('completed')}
              getCategoryBadgeColor={getCategoryBadgeColor}
              getPriorityColor={getPriorityColor}
              toggleTask={toggleTask}
              updateTaskStatus={updateTaskStatus}
            />
          </div>
        </div>

        <DragOverlay>
          {activeId ? (
            <div className="opacity-95 rotate-3 scale-105">
              <DraggableTaskCard
                task={tasks.find(t => t.id === activeId)!}
                getCategoryBadgeColor={getCategoryBadgeColor}
                getPriorityColor={getPriorityColor}
                toggleTask={toggleTask}
                updateTaskStatus={updateTaskStatus}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}