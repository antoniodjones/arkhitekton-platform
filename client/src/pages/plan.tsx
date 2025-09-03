import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
  GripVertical,
  List,
  BarChart3,
  Calendar,
  Table,
  Columns3,
  Edit,
  MessageSquare,
  Send
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

interface TaskComment {
  id: string;
  text: string;
  timestamp: Date;
  author: string;
}

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
  createdAt?: Date;
  updatedAt?: Date;
  completedAt?: Date;
  comments?: TaskComment[];
  abilities?: string[];
}

// Task Dialog Component for Add/Edit
function TaskDialog({ 
  task, 
  isOpen, 
  onClose, 
  onSave 
}: { 
  task?: Task; 
  isOpen: boolean; 
  onClose: () => void; 
  onSave: (task: Omit<Task, 'id'>) => void; 
}) {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    category: task?.category || 'foundation' as Task['category'],
    priority: task?.priority || 'medium' as Task['priority'],
    status: task?.status || 'todo' as Task['status'],
    dueDate: task?.dueDate || '',
    assignee: task?.assignee || '',
    abilities: task?.abilities || []
  });
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<TaskComment[]>(task?.comments || []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title.trim()) {
      onSave({
        ...formData,
        completed: formData.status === 'completed',
        createdAt: task?.createdAt || new Date(),
        updatedAt: new Date(),
        completedAt: formData.status === 'completed' ? new Date() : undefined,
        comments: comments
      });
      onClose();
    }
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: TaskComment = {
        id: `comment-${Date.now()}`,
        text: newComment.trim(),
        timestamp: new Date(),
        author: 'Current User'
      };
      setComments([...comments, comment]);
      setNewComment('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle data-testid="task-dialog-title">
            {task ? 'Edit Task' : 'Create New Task'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter task title..."
              required
              data-testid="input-task-title"
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter task description..."
              className="min-h-[100px]"
              data-testid="textarea-task-description"
            />
          </div>

          {/* Category and Priority Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value: Task['category']) => setFormData({ ...formData, category: value })}>
                <SelectTrigger data-testid="select-task-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="foundation">Foundation</SelectItem>
                  <SelectItem value="knowledge-base">Knowledge Base</SelectItem>
                  <SelectItem value="modeling">Modeling</SelectItem>
                  <SelectItem value="ai">AI Intelligence</SelectItem>
                  <SelectItem value="integration">Integration</SelectItem>
                  <SelectItem value="ux">UX Excellence</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(value: Task['priority']) => setFormData({ ...formData, priority: value })}>
                <SelectTrigger data-testid="select-task-priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Status and Due Date Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value: Task['status']) => setFormData({ ...formData, status: value })}>
                <SelectTrigger data-testid="select-task-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                data-testid="input-task-due-date"
              />
            </div>
          </div>

          {/* Assignee */}
          <div>
            <Label htmlFor="assignee">Assignee</Label>
            <Input
              id="assignee"
              value={formData.assignee}
              onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
              placeholder="Enter assignee name..."
              data-testid="input-task-assignee"
            />
          </div>

          {/* Abilities */}
          <div>
            <Label htmlFor="abilities">Abilities</Label>
            <Input
              id="abilities"
              value={formData.abilities.join(', ')}
              onChange={(e) => setFormData({ 
                ...formData, 
                abilities: e.target.value.split(',').map(a => a.trim()).filter(a => a) 
              })}
              placeholder="Enter abilities (e.g., React, TypeScript, Design)..."
              data-testid="input-task-abilities"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Separate abilities with commas
            </p>
          </div>

          {/* Comments Section */}
          <div className="border-t pt-6">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-4 h-4" />
              <Label className="text-base font-medium">Comments & Updates</Label>
            </div>
            
            {/* Existing Comments */}
            <div className="space-y-3 mb-4">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-muted/50 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{comment.author}</span>
                    <span className="text-xs text-muted-foreground">
                      {comment.timestamp.toLocaleDateString()} {comment.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-sm">{comment.text}</p>
                </div>
              ))}
            </div>

            {/* Add New Comment */}
            <div className="flex gap-2">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment or update..."
                className="flex-1"
                rows={2}
                data-testid="textarea-new-comment"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                data-testid="button-add-comment"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-2 border-t pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              data-testid="button-cancel-task"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              data-testid="button-save-task"
            >
              {task ? 'Update Task' : 'Create Task'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Draggable Task Card Component
function DraggableTaskCard({ 
  task, 
  getCategoryBadgeColor, 
  getPriorityColor, 
  toggleTask, 
  updateTaskStatus,
  onEditTask
}: {
  task: Task;
  getCategoryBadgeColor: (category: Task['category']) => string;
  getPriorityColor: (priority: Task['priority']) => string;
  toggleTask: (taskId: string) => void;
  updateTaskStatus: (taskId: string, newStatus: Task['status']) => void;
  onEditTask: (task: Task) => void;
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
      onDoubleClick={() => onEditTask(task)}
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
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEditTask(task);
            }}
            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            data-testid={`edit-task-${task.id}`}
          >
            <Edit className="w-3 h-3" />
          </Button>
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
            onCheckedChange={(checked) => {
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
  updateTaskStatus,
  onEditTask
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
  onEditTask: (task: Task) => void;
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
              onEditTask={onEditTask}
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

type ViewMode = 'board' | 'list' | 'gantt' | 'calendar' | 'table';

export default function PlanPage() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<ViewMode>('board');
  const [dateRangeFilter, setDateRangeFilter] = useState<'all' | 'last-12-months' | 'last-6-months' | 'last-3-months'>('all');
  
  // Helper function to generate historical dates
  const getHistoricalDate = (monthsAgo: number, dayOffset: number = 0) => {
    const date = new Date();
    date.setMonth(date.getMonth() - monthsAgo);
    date.setDate(date.getDate() + dayOffset);
    return date;
  };

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
  
  // Dialog state for task creation/editing
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

  // Task dialog handlers
  const handleCreateTask = () => {
    setEditingTask(undefined);
    setIsTaskDialogOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsTaskDialogOpen(false);
    setEditingTask(undefined);
  };

  const handleSaveTask = (taskData: Omit<Task, 'id'>) => {
    if (editingTask) {
      // Update existing task
      setTasks(tasks.map(task =>
        task.id === editingTask.id ? { ...taskData, id: editingTask.id } : task
      ));
    } else {
      // Create new task
      const newTask: Task = {
        ...taskData,
        id: `task-${Date.now()}`
      };
      setTasks([...tasks, newTask]);
    }
  };

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
      
      // Date range filtering
      const matchesDateRange = (() => {
        if (dateRangeFilter === 'all') return true;
        
        // For tasks without dates, show them in current view for now
        if (!task.createdAt && !task.updatedAt) return true;
        
        const now = new Date();
        const monthsToSubtract = {
          'last-3-months': 3,
          'last-6-months': 6,
          'last-12-months': 12
        }[dateRangeFilter] || 0;
        
        const cutoffDate = new Date();
        cutoffDate.setMonth(cutoffDate.getMonth() - monthsToSubtract);
        
        // Check if task was created, updated, or completed within the range
        const taskDate = task.updatedAt || task.createdAt;
        return taskDate instanceof Date ? taskDate >= cutoffDate : true;
      })();
      
      return matchesSearch && matchesCategory && matchesDateRange;
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
        <div className="flex items-center justify-between">
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
          <Button onClick={handleCreateTask} className="flex items-center gap-2" data-testid="button-new-task">
            <Plus className="w-4 h-4" />
            New Task
          </Button>
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

      {/* View Selector */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            {/* View Mode Selector */}
            <div className="flex items-center gap-2">
              <Button
                variant={currentView === 'board' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentView('board')}
                className="flex items-center gap-2"
                data-testid="view-board"
              >
                <Columns3 className="w-4 h-4" />
                Board
              </Button>
              <Button
                variant={currentView === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentView('list')}
                className="flex items-center gap-2"
                data-testid="view-list"
              >
                <List className="w-4 h-4" />
                List
              </Button>
              <Button
                variant={currentView === 'gantt' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentView('gantt')}
                className="flex items-center gap-2"
                data-testid="view-gantt"
              >
                <BarChart3 className="w-4 h-4" />
                Gantt
              </Button>
              <Button
                variant={currentView === 'calendar' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentView('calendar')}
                className="flex items-center gap-2"
                data-testid="view-calendar"
              >
                <Calendar className="w-4 h-4" />
                Calendar
              </Button>
              <Button
                variant={currentView === 'table' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentView('table')}
                className="flex items-center gap-2"
                data-testid="view-table"
              >
                <Table className="w-4 h-4" />
                Table
              </Button>
            </div>

            {/* Filters and Search */}
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
              <div className="w-full sm:w-48">
                <Select value={dateRangeFilter} onValueChange={(value: 'all' | 'last-12-months' | 'last-6-months' | 'last-3-months') => setDateRangeFilter(value)}>
                  <SelectTrigger data-testid="filter-date-range">
                    <Calendar className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Date Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="last-12-months">Last 12 Months</SelectItem>
                    <SelectItem value="last-6-months">Last 6 Months</SelectItem>
                    <SelectItem value="last-3-months">Last 3 Months</SelectItem>
                  </SelectContent>
                </Select>
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
          </div>
        </CardContent>
      </Card>

      {/* Dynamic View Content */}
      {currentView === 'board' && (
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
                onEditTask={handleEditTask}
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
                onEditTask={handleEditTask}
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
                onEditTask={handleEditTask}
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
                  onEditTask={handleEditTask}
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      {currentView === 'list' && (
        <Tabs defaultValue="foundation" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="foundation" className="flex items-center gap-2">
              <Rocket className="w-4 h-4" />
              Foundation
            </TabsTrigger>
            <TabsTrigger value="knowledge-base" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Knowledge Base
            </TabsTrigger>
            <TabsTrigger value="modeling" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Modeling
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              AI Intelligence
            </TabsTrigger>
            <TabsTrigger value="integration" className="flex items-center gap-2">
              <Link2 className="w-4 h-4" />
              Integration
            </TabsTrigger>
            <TabsTrigger value="ux" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              UX Excellence
            </TabsTrigger>
          </TabsList>

          {(['foundation', 'knowledge-base', 'modeling', 'ai', 'integration', 'ux'] as const).map(category => {
            const categoryTasks = getFilteredTasks().filter(task => task.category === category);
            const categoryCompleted = categoryTasks.filter(t => t.completed).length;
            const categoryProgress = Math.round((categoryCompleted / categoryTasks.length) * 100);
            
            return (
              <TabsContent key={category} value={category} className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-3 capitalize">
                        {(() => {
                          const IconComponent = getCategoryIcon(category);
                          return <IconComponent className="w-5 h-5" />;
                        })()}
                        {category === 'ai' ? 'AI Intelligence Layer' : 
                         category === 'ux' ? 'UX Excellence' : 
                         category === 'knowledge-base' ? 'Knowledge Base Platform' :
                         category.charAt(0).toUpperCase() + category.slice(1)} Phase
                      </CardTitle>
                      <Badge variant="outline">
                        {categoryCompleted} / {categoryTasks.length} Complete
                      </Badge>
                    </div>
                    <Progress value={categoryProgress} className="h-2 mt-2" />
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {categoryTasks.map(task => (
                      <div 
                        key={task.id} 
                        className="flex items-start gap-3 p-3 rounded-lg border transition-colors hover:bg-accent/50"
                      >
                        <Checkbox
                          checked={task.completed}
                          onCheckedChange={() => toggleTask(task.id)}
                          className="mt-1"
                          data-testid={`task-checkbox-${task.id}`}
                        />
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                              {task.title}
                            </h4>
                            <Badge className={`text-xs px-2 py-0.5 ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </Badge>
                            <Badge className={`text-xs px-2 py-0.5 ${task.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : task.status === 'in-progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'}`}>
                              {task.status === 'in-progress' ? 'In Progress' : task.status === 'todo' ? 'To Do' : 'Completed'}
                            </Badge>
                          </div>
                          <p className={`text-sm ${task.completed ? 'line-through text-muted-foreground' : 'text-muted-foreground'}`}>
                            {task.description}
                          </p>
                        </div>
                        {task.completed && (
                          <CheckCircle2 className="w-5 h-5 text-green-500 mt-1" />
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            );
          })}
        </Tabs>
      )}

      {currentView === 'table' && (
        <Card>
          <CardHeader>
            <CardTitle>Task Table</CardTitle>
            <CardDescription>
              Comprehensive view of all development tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-semibold">✓</th>
                    <th className="text-left p-3 font-semibold">Task</th>
                    <th className="text-left p-3 font-semibold">Category</th>
                    <th className="text-left p-3 font-semibold">Priority</th>
                    <th className="text-left p-3 font-semibold">Status</th>
                    <th className="text-left p-3 font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {getFilteredTasks().map(task => (
                    <tr key={task.id} className="border-b hover:bg-accent/50 transition-colors">
                      <td className="p-3">
                        <Checkbox
                          checked={task.completed}
                          onCheckedChange={() => toggleTask(task.id)}
                          data-testid={`task-checkbox-${task.id}`}
                        />
                      </td>
                      <td className="p-3">
                        <span className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                          {task.title}
                        </span>
                      </td>
                      <td className="p-3">
                        <Badge className={`text-xs px-2 py-0.5 ${getCategoryBadgeColor(task.category)}`}>
                          {task.category === 'knowledge-base' ? 'Knowledge Base' : 
                           task.category === 'ai' ? 'AI Intelligence' : 
                           task.category.charAt(0).toUpperCase() + task.category.slice(1)}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Badge className={`text-xs px-2 py-0.5 ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Select value={task.status} onValueChange={(value: Task['status']) => updateTaskStatus(task.id, value)}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="todo">To Do</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-3 max-w-xs">
                        <span className={`text-sm ${task.completed ? 'line-through text-muted-foreground' : 'text-muted-foreground'}`}>
                          {task.description}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {currentView === 'gantt' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Gantt Chart
            </CardTitle>
            <CardDescription>
              Project timeline and task dependencies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center py-12 text-muted-foreground">
                <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Gantt Chart View</h3>
                <p className="text-sm max-w-md mx-auto">
                  Interactive timeline view showing task dependencies, durations, and project milestones. 
                  Coming soon with drag-and-drop scheduling capabilities.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {currentView === 'calendar' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Calendar View
            </CardTitle>
            <CardDescription>
              Schedule and manage task deadlines
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center py-12 text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Calendar View</h3>
                <p className="text-sm max-w-md mx-auto">
                  Monthly and weekly calendar views for scheduling tasks, setting deadlines, 
                  and tracking project milestones across different time periods.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Task Dialog */}
      <TaskDialog 
        task={editingTask}
        isOpen={isTaskDialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSaveTask}
      />
    </div>
  );
}