import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek, parseISO, isWithinInterval, addDays } from 'date-fns';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { UserStory as BackendUserStory, Epic } from '@shared/schema';
import { validateGherkinFormat } from '@shared/gherkin-validator';
import { formatDateForInput, formatDateForAPI, formatDateForDisplay } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  GripVertical,
  Edit,
  Edit2,
  ArrowLeft,
  Archive,
  Trash2,
  LayoutGrid,
  List,
  BarChart3,
  Calendar,
  Table,
  Search,
  Filter,
  GitBranch,
  CheckCircle,
  ArrowRight,
  CheckSquare,
  Plus,
  Printer,
  Upload,
  Image,
  Code2,
  FileText,
  ExternalLink,
  Check,
  ChevronsUpDown,
  User,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { GovernanceHeader } from '@/components/layout/governance-header';
import { AppLayout } from '@/components/layout/app-layout';
import { DefectManagement, DefectBadge } from '@/components/defect-management';
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
  useDroppable
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// User Story interface for enhanced functionality
interface UserStory {
  id: string;
  epicId?: string | null; // Link to Epic (EA Value Stream)
  title: string;
  description: string | null;
  acceptanceCriteria: string; // Gherkin format
  storyPoints: number;
  status: 'backlog' | 'sprint' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee: string | null;
  productManager?: string;
  techLead?: string;
  labels: string[];
  
  // Story composition guidance fields
  feature: string | null;
  value: string | null;
  requirement: string | null;
  
  // GitHub Integration
  githubRepo?: string;
  githubBranch?: string;
  githubIssue?: number;
  githubCommits: { sha: string; message: string; author: string; email: string; timestamp: string; url: string; }[];
  
  // Media
  screenshots: string[]; // URLs to uploaded images
  
  createdAt: string;
  updatedAt: string;
}

// User Story Count Component - Optimized to avoid unnecessary API calls
function UserStoryCount({ taskId, disabled = false }: { taskId: string; disabled?: boolean }) {
  const { data: response, isLoading } = useQuery<{ data: UserStory[] }>({
    queryKey: ['/api/user-stories?taskId=' + taskId],
    enabled: false, // Temporarily disabled to avoid unnecessary API calls during Stories view optimization
    staleTime: 60000 // Cache for 1 minute to reduce unnecessary requests
  });

  if (disabled) {
    return null; // Don't render anything when disabled
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-1 text-xs text-muted-foreground pt-2 border-t">
        <BookOpen className="w-3 h-3" />
        <span>Loading stories...</span>
      </div>
    );
  }

  const storyCount = response?.data?.length || 0;
  
  if (storyCount === 0) {
    return null; // Don't show anything if no stories
  }

  return (
    <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 pt-2 border-t">
      <BookOpen className="w-3 h-3" />
      <span>{storyCount} user stor{storyCount !== 1 ? 'ies' : 'y'}</span>
    </div>
  );
}

// Task type based on the schema
interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  category: 'foundation' | 'knowledge-base' | 'modeling' | 'ai' | 'integration' | 'ux';
  assignee?: string | null;
  dueDate?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  dependencies?: string[] | null; // Array of task IDs this task depends on (max 1)
  subtasks?: Array<{ id: string; title: string; completed: boolean; createdAt: string }> | null;
  abilities?: string[] | null;
  completed: number; // 0 = false, 1 = true (matches database schema)
  createdAt?: Date | null;
  updatedAt?: Date | null;
  completedAt?: Date | null;
  comments?: Array<{ id: string; text: string; timestamp: Date; author: string }> | null;
}

// Task Form Dialog Component
function TaskDialog({ 
  open, 
  onClose, 
  task, 
  onSave,
  allTasks 
}: { 
  open: boolean; 
  onClose: () => void; 
  task?: Task; 
  onSave: (data: Omit<Task, 'id'>) => void; 
  allTasks: Task[];
}) {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState<Task['priority']>(task?.priority || 'medium');
  const [category, setCategory] = useState<Task['category']>(task?.category || 'foundation');
  const [status, setStatus] = useState<Task['status']>(task?.status || 'todo');
  const [dependency, setDependency] = useState<string | null>((task?.dependencies && task.dependencies.length > 0) ? task.dependencies[0] : null);
  const [subtasks, setSubtasks] = useState<Array<{ id: string; title: string; completed: boolean; createdAt: string }>>(task?.subtasks || []);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [dependencySearch, setDependencySearch] = useState('');
  const [showDependencyResults, setShowDependencyResults] = useState(false);
  const [startDate, setStartDate] = useState(formatDateForInput(task?.startDate));
  const [endDate, setEndDate] = useState(formatDateForInput(task?.endDate));

  // Update form state when task prop changes
  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setPriority(task.priority || 'medium');
      setCategory(task.category || 'foundation');
      setStatus(task.status || 'todo');
      setDependency((task.dependencies && task.dependencies.length > 0) ? task.dependencies[0] : null);
      setSubtasks(task.subtasks || []);
      setStartDate(formatDateForInput(task.startDate));
      setEndDate(formatDateForInput(task.endDate));
    } else {
      // Reset form for new task
      setTitle('');
      setDescription('');
      setPriority('medium');
      setCategory('foundation');
      setStatus('todo');
      setDependency(null);
      setSubtasks([]);
      setStartDate('');
      setEndDate('');
    }
  }, [task]);

  // Circular dependency detection
  const wouldCreateCircularDependency = (newDepId: string): boolean => {
    if (!task?.id || newDepId === task.id) return true;
    
    const checkCircular = (taskId: string, visited: Set<string>): boolean => {
      if (visited.has(taskId)) return true;
      
      const currentTask = allTasks.find(t => t.id === taskId);
      if (!currentTask?.dependencies || currentTask.dependencies.length === 0) return false;
      
      visited.add(taskId);
      return checkCircular(currentTask.dependencies[0], new Set(visited));
    };
    
    return checkCircular(newDepId, new Set());
  };

  // Filter tasks for dependency search
  const filteredTasks = allTasks.filter((t: Task) => 
    t.id !== task?.id && 
    t.id !== dependency &&
    !wouldCreateCircularDependency(t.id) &&
    t.title.toLowerCase().includes(dependencySearch.toLowerCase())
  );

  const setDependencyTask = (taskId: string) => {
    setDependency(taskId);
    setDependencySearch('');
    setShowDependencyResults(false);
  };

  const clearDependency = () => {
    setDependency(null);
  };

  const addSubtask = () => {
    if (newSubtaskTitle.trim()) {
      setSubtasks([...subtasks, {
        id: Date.now().toString(),
        title: newSubtaskTitle,
        completed: false,
        createdAt: new Date().toISOString()
      }]);
      setNewSubtaskTitle('');
    }
  };

  const removeSubtask = (subtaskId: string) => {
    setSubtasks(subtasks.filter(st => st.id !== subtaskId));
  };

  const toggleSubtaskComplete = (subtaskId: string) => {
    setSubtasks(subtasks.map(st => 
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepare the task data - only include fields that should be updated
    const taskData: any = {
      title,
      description,
      priority,
      category,
      status,
      dependencies: dependency ? [dependency] : [],
      subtasks: subtasks.map(st => ({
        ...st,
        createdAt: typeof st.createdAt === 'string' ? st.createdAt : new Date().toISOString()
      })),
      completed: status === 'completed' ? 1 : 0, // Convert boolean to integer for schema
      abilities: task?.abilities || [],
      assignee: task?.assignee || null,
      dueDate: task?.dueDate || null,
      startDate: formatDateForAPI(startDate),
      endDate: formatDateForAPI(endDate),
      comments: task?.comments || null,
    };

    // For new tasks, the database will handle createdAt and updatedAt automatically
    // For existing tasks, only include completedAt if status is completed
    if (status === 'completed' && task?.status !== 'completed') {
      // Task just got completed, set completedAt
      taskData.completedAt = new Date().toISOString();
    } else if (status !== 'completed') {
      // Task is not completed, clear completedAt
      taskData.completedAt = null;
    }

    onSave(taskData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'Create Task'}</DialogTitle>
          <DialogDescription>
            {task ? 'Update the task details below.' : 'Create a new task for your development plan.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {task && (
            <div>
              <Label htmlFor="taskId">Task ID</Label>
              <Input
                id="taskId"
                value={task.id.substring(0, 8)}
                readOnly
                className="bg-muted text-muted-foreground cursor-not-allowed"
                data-testid="input-task-id"
              />
            </div>
          )}
          
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              data-testid="input-task-title"
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              data-testid="input-task-description"
            />
          </div>

          <div>
            <Label htmlFor="priority">Priority</Label>
            <Select value={priority} onValueChange={(value: Task['priority']) => setPriority(value)}>
              <SelectTrigger data-testid="select-priority">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={(value: Task['category']) => setCategory(value)}>
              <SelectTrigger data-testid="select-category">
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

          {/* Date Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                data-testid="input-start-date"
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                data-testid="input-end-date"
              />
            </div>
          </div>

          {/* Dependencies Section */}
          <div>
            <Label>Dependencies</Label>
            <div className="space-y-2">
              <div className="relative">
                <Input
                  placeholder="Search for a task to set as dependency..."
                  value={dependencySearch}
                  onChange={(e) => {
                    setDependencySearch(e.target.value);
                    setShowDependencyResults(e.target.value.length > 0);
                  }}
                  onFocus={() => setShowDependencyResults(dependencySearch.length > 0)}
                  onBlur={() => setTimeout(() => setShowDependencyResults(false), 150)}
                  data-testid="input-dependency-search"
                />
                {showDependencyResults && filteredTasks.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border rounded-md shadow-lg max-h-40 overflow-y-auto">
                    {filteredTasks.slice(0, 10).map(t => (
                      <button
                        key={t.id}
                        type="button"
                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setDependencyTask(t.id)}
                        data-testid={`dependency-option-${t.id}`}
                      >
                        <div className="font-medium">{t.title}</div>
                        <div className="text-xs text-gray-500">{t.category} • {t.priority}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {dependency && (
                <div className="flex flex-wrap gap-1">
                  {(() => {
                    const depTask = allTasks.find(t => t.id === dependency);
                    return depTask ? (
                      <div className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 px-2 py-1 rounded text-xs">
                        <span>{depTask.title}</span>
                        <button
                          type="button"
                          onClick={clearDependency}
                          className="hover:text-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ) : null;
                  })()} 
                </div>
              )}
            </div>
          </div>

          {/* Subtasks Section */}
          <div>
            <Label>Subtasks</Label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  placeholder="Add a subtask..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSubtask())}
                  data-testid="input-subtask"
                />
                <Button type="button" onClick={addSubtask} size="sm" data-testid="button-add-subtask">
                  Add
                </Button>
              </div>
              {subtasks.length > 0 && (
                <div className="space-y-1">
                  {subtasks.map(subtask => (
                    <div key={subtask.id} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <input
                        type="checkbox"
                        checked={subtask.completed}
                        onChange={() => toggleSubtaskComplete(subtask.id)}
                        className="rounded"
                      />
                      <span className={`flex-1 text-sm ${subtask.completed ? 'line-through text-gray-500' : ''}`}>
                        {subtask.title}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeSubtask(subtask.id)}
                        className="text-red-600 hover:text-red-800 text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={(value: Task['status']) => setStatus(value)}>
              <SelectTrigger data-testid="select-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} data-testid="button-cancel">
              Cancel
            </Button>
            <Button type="submit" data-testid="button-save">
              {task ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Draggable Task Card Component
function TaskCard({ 
  task, 
  onEdit, 
  onArchive, 
  onDelete,
  onToggleComplete 
}: { 
  task: Task; 
  onEdit: (task: Task) => void;
  onArchive: (task: Task) => void;
  onDelete: (task: Task) => void;
  onToggleComplete: (task: Task) => void;
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

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getCategoryColor = (category: Task['category']) => {
    switch (category) {
      case 'foundation': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'knowledge-base': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      case 'modeling': return 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-300';
      case 'ai': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300';
      case 'integration': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      case 'ux': return 'bg-teal-100 text-teal-800 dark:bg-teal-900/20 dark:text-teal-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group p-4 border rounded-lg hover:shadow-md transition-all ${
        isDragging ? 'opacity-50' : ''
      } ${task.completed ? 'bg-green-50/50 dark:bg-green-950/10 border-green-200 dark:border-green-800' : 'bg-background'}`}
      data-testid={`task-card-${task.id}`}
      onDoubleClick={() => onEdit(task)}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-start gap-2 flex-1">
          <div
            className="cursor-grab active:cursor-grabbing"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          </div>
          <h4 className={`font-medium text-sm leading-tight ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
            ({task.id.substring(0, 8)}) {task.title}
          </h4>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onToggleComplete(task);
            }}
            className={`h-6 w-6 p-0 transition-all ${
              task.completed 
                ? 'text-green-600 hover:text-green-700 opacity-100' 
                : 'opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-green-600'
            }`}
            data-testid={`toggle-complete-task-${task.id}`}
            title={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
          >
            <CheckCircle className={`w-4 h-4 ${task.completed ? 'fill-current' : ''}`} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onEdit(task);
            }}
            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            data-testid={`edit-task-${task.id}`}
          >
            <Edit className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onArchive(task);
            }}
            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            data-testid={`archive-task-${task.id}`}
          >
            <Archive className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onDelete(task);
            }}
            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
            data-testid={`delete-task-${task.id}`}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>
      
      <p className={`text-xs text-muted-foreground mb-3 line-clamp-2 ${task.completed ? 'line-through' : ''}`}>
        {task.description}
      </p>

      {/* Date Range Display */}
      {(task.startDate || task.endDate) && (
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
          <Calendar className="w-3 h-3" />
          <span>
            {task.startDate && task.endDate ? (
              `${formatDateForDisplay(task.startDate, 'full')} - ${formatDateForDisplay(task.endDate, 'full')}`
            ) : task.startDate ? (
              `Start: ${formatDateForDisplay(task.startDate, 'full')}`
            ) : (
              `End: ${formatDateForDisplay(task.endDate, 'full')}`
            )}
          </span>
        </div>
      )}

      {/* Dependencies and Subtasks Indicators */}
      {(task.dependencies?.length || task.subtasks?.length) && (
        <div className="flex items-center gap-2 mb-3">
          {task.dependencies && task.dependencies.length > 0 && (
            <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
              <span className="text-blue-500">🔗</span>
              <span>{task.dependencies.length} dep{task.dependencies.length !== 1 ? 's' : ''}</span>
            </div>
          )}
          {task.subtasks && task.subtasks.length > 0 && (
            <div className="flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400">
              <span className="text-purple-500">📋</span>
              <span>
                {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length} subtasks
              </span>
            </div>
          )}
        </div>
      )}

      {/* User Stories Count Indicator */}
      <UserStoryCount taskId={task.id} />
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge className={`text-xs px-2 py-0.5 ${getCategoryColor(task.category)}`}>
            {task.category}
          </Badge>
          <Badge className={`text-xs px-2 py-0.5 ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </Badge>
        </div>
      </div>
    </div>
  );
}

// Droppable Column Component
function TaskColumn({ 
  id, 
  title, 
  icon: Icon, 
  iconColor, 
  tasks, 
  onEdit,
  onArchive,
  onDelete,
  onToggleComplete
}: { 
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  tasks: Task[];
  onEdit: (task: Task) => void;
  onArchive: (task: Task) => void;
  onDelete: (task: Task) => void;
  onToggleComplete: (task: Task) => void;
}) {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
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
            <TaskCard key={task.id} task={task} onEdit={onEdit} onArchive={onArchive} onDelete={onDelete} onToggleComplete={onToggleComplete} />
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

// Pagination Controls Component
interface PaginationControlsProps {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

function PaginationControls({ 
  page, 
  pageSize, 
  total, 
  totalPages, 
  isLoading = false,
  onPageChange, 
  onPageSizeChange 
}: PaginationControlsProps) {
  const [customPageSize, setCustomPageSize] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  
  const startItem = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, total);
  
  const handlePageSizeChange = (value: string) => {
    if (value === 'custom') {
      setShowCustomInput(true);
      return;
    }
    const newPageSize = parseInt(value);
    if (!isNaN(newPageSize)) {
      onPageSizeChange(newPageSize);
      setShowCustomInput(false);
    }
  };
  
  const handleCustomPageSizeSubmit = () => {
    const newPageSize = parseInt(customPageSize);
    if (!isNaN(newPageSize) && newPageSize >= 1 && newPageSize <= 200) {
      onPageSizeChange(newPageSize);
      setShowCustomInput(false);
      setCustomPageSize('');
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCustomPageSizeSubmit();
    } else if (e.key === 'Escape') {
      setShowCustomInput(false);
      setCustomPageSize('');
    }
  };
  
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Rows per page:</span>
        <Select 
          value={showCustomInput ? 'custom' : pageSize.toString()} 
          onValueChange={handlePageSizeChange}
          disabled={isLoading}
        >
          <SelectTrigger className="h-8 w-20" data-testid="pagination-page-size-select">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="25">25</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
            <SelectItem value="custom">Custom...</SelectItem>
          </SelectContent>
        </Select>
        
        {showCustomInput && (
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min="1"
              max="200"
              value={customPageSize}
              onChange={(e) => setCustomPageSize(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="1-200"
              className="h-8 w-20"
              data-testid="pagination-custom-page-size-input"
              autoFocus
            />
            <Button
              size="sm"
              onClick={handleCustomPageSizeSubmit}
              disabled={!customPageSize || isNaN(parseInt(customPageSize))}
              data-testid="pagination-custom-page-size-apply"
            >
              Apply
            </Button>
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-4">
        <div className="text-sm text-muted-foreground" data-testid="pagination-info">
          {total === 0 ? 'No items' : `${startItem}–${endItem} of ${total}`}
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(1)}
            disabled={page <= 1 || isLoading}
            data-testid="pagination-first-page"
            className="h-8 w-8 p-0"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1 || isLoading}
            data-testid="pagination-previous-page"
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center gap-1 px-2">
            <span className="text-sm">Page</span>
            <span className="text-sm font-medium" data-testid="pagination-current-page">
              {page}
            </span>
            <span className="text-sm">of</span>
            <span className="text-sm" data-testid="pagination-total-pages">
              {totalPages || 1}
            </span>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages || isLoading}
            data-testid="pagination-next-page"
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(totalPages)}
            disabled={page >= totalPages || isLoading}
            data-testid="pagination-last-page"
            className="h-8 w-8 p-0"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Stories View Component
function StoriesView({ tasks, onEditTask }: { tasks: Task[]; onEditTask: (task: Task) => void }) {
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());

  const toggleTaskExpansion = (taskId: string) => {
    const newExpanded = new Set(expandedTasks);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
    }
    setExpandedTasks(newExpanded);
  };

  const [editingStory, setEditingStory] = useState<UserStory | null>(null);
  const [isStoryDialogOpen, setIsStoryDialogOpen] = useState(false);
  const [gherkinValidation, setGherkinValidation] = useState<{isValid: boolean; errors: string[]; warnings: string[]}>({ isValid: true, errors: [], warnings: [] });
  
  // Validate Gherkin format when story is opened for editing (US-XIGJUQ7)
  useEffect(() => {
    if (editingStory && editingStory.acceptanceCriteria) {
      const validation = validateGherkinFormat(editingStory.acceptanceCriteria);
      setGherkinValidation(validation);
    } else {
      setGherkinValidation({ isValid: true, errors: [], warnings: [] });
    }
  }, [editingStory?.id]); // Only re-validate when the story ID changes (story opened)
  
  // Search states for all role assignments
  const [assigneeSearch, setAssigneeSearch] = useState('');
  const [isAssigneeOpen, setIsAssigneeOpen] = useState(false);
  const [productManagerSearch, setProductManagerSearch] = useState('');
  const [isProductManagerOpen, setIsProductManagerOpen] = useState(false);
  const [techLeadSearch, setTechLeadSearch] = useState('');
  const [isTechLeadOpen, setIsTechLeadOpen] = useState(false);

  // Pagination state with URL synchronization
  const [location, setLocation] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1] || '');
  
  // Get initial values from URL or defaults
  const [page, setPage] = useState(() => {
    const urlPage = parseInt(searchParams.get('page') || '1');
    return urlPage >= 1 ? urlPage : 1;
  });
  
  const [pageSize, setPageSize] = useState(() => {
    // Try URL first, then localStorage, then default
    const urlPageSize = parseInt(searchParams.get('pageSize') || '');
    if (urlPageSize >= 10 && urlPageSize <= 200) return urlPageSize;
    
    const savedPageSize = localStorage.getItem('userStories-pageSize');
    if (savedPageSize) {
      const parsed = parseInt(savedPageSize);
      if (parsed >= 10 && parsed <= 200) return parsed;
    }
    
    return 25; // default
  });
  
  // Update URL when pagination changes
  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', page.toString());
    newSearchParams.set('pageSize', pageSize.toString());
    
    const newUrl = location.split('?')[0] + '?' + newSearchParams.toString();
    setLocation(newUrl, { replace: true });
    
    // Save pageSize preference
    localStorage.setItem('userStories-pageSize', pageSize.toString());
  }, [page, pageSize]);

  // Epic filter state (must be declared before useQuery that uses it)
  const [epicFilter, setEpicFilter] = useState<string>('all');

  // Fetch user stories with pagination
  const queryClient = useQueryClient();
  const { data: storiesResponse, isLoading: isLoadingStories } = useQuery<{ items: UserStory[]; total: number; totalPages: number }>({
    queryKey: [`/api/user-stories?page=${page}&pageSize=${pageSize}${epicFilter !== 'all' ? `&epicId=${epicFilter}` : ''}`],
    placeholderData: (previousData) => previousData,
    staleTime: 30000
  });

  const allStories = storiesResponse?.items || [];
  const total = storiesResponse?.total || 0;
  const totalPages = storiesResponse?.totalPages || 1;

  // Pagination handlers
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    // Scroll to top on page change for better UX
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1); // Reset to first page when changing page size
  };
  const [csvUploadOpen, setCsvUploadOpen] = useState(false);

  // Mutations for story management using apiRequest
  const createStoryMutation = useMutation({
    mutationFn: async (storyData: Partial<BackendUserStory>) => {
      const response = await apiRequest('POST', '/api/user-stories', storyData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        predicate: (query) => 
          Array.isArray(query.queryKey) && 
          typeof query.queryKey[0] === 'string' && 
          query.queryKey[0].startsWith('/api/user-stories')
      });
    }
  });

  const updateStoryMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<BackendUserStory> }) => {
      const response = await apiRequest('PATCH', `/api/user-stories/${id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        predicate: (query) => 
          Array.isArray(query.queryKey) && 
          typeof query.queryKey[0] === 'string' && 
          query.queryKey[0].startsWith('/api/user-stories')
      });
    }
  });

  const deleteStoryMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest('DELETE', `/api/user-stories/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        predicate: (query) => 
          Array.isArray(query.queryKey) && 
          typeof query.queryKey[0] === 'string' && 
          query.queryKey[0].startsWith('/api/user-stories')
      });
    }
  });

  // Fetch Epics (Enterprise Architecture Value Streams)
  const { data: epicsResponse } = useQuery<{ data: Epic[] }>({
    queryKey: ['/api/epics'],
    staleTime: 60000
  });
  const epics = epicsResponse?.data || [];

  // Epic mutations
  const createEpicMutation = useMutation({
    mutationFn: async (epicData: Partial<Epic>) => {
      const response = await apiRequest('POST', '/api/epics', epicData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/epics'] });
    }
  });

  const updateEpicMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Epic> }) => {
      const response = await apiRequest('PATCH', `/api/epics/${id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/epics'] });
    }
  });

  // Epic dialog state
  const [editingEpic, setEditingEpic] = useState<Epic | null>(null);
  const [isEpicDialogOpen, setIsEpicDialogOpen] = useState(false);

  // Mock developer list - in real app this would come from your team management system
  const developers = [
    'Alex Johnson', 'Sarah Chen', 'Mike Rodriguez', 'Emily Davis', 'David Kim',
    'Jessica Brown', 'Robert Miller', 'Amanda Wilson', 'Christopher Lee', 'Nicole Taylor',
    'Daniel Thompson', 'Stephanie Garcia', 'Kevin Martinez', 'Ashley Anderson', 'Brian Clark',
    'Michelle Lewis', 'Ryan Walker', 'Jennifer Hall', 'Justin Allen', 'Laura Young',
    'Matthew King', 'Samantha Wright', 'Andrew Lopez', 'Rachel Hill', 'Jonathan Scott',
    'Megan Green', 'Tyler Adams', 'Kimberly Baker', 'Nathan Gonzalez', 'Brittany Nelson',
    'Brandon Carter', 'Courtney Mitchell', 'Austin Perez', 'Christina Roberts', 'Gregory Turner',
    'Morgan Phillips', 'Sean Campbell', 'Danielle Parker', 'Eric Evans', 'Vanessa Edwards',
    'Marcus Collins', 'Alexis Stewart', 'Jordan Sanchez', 'Hannah Morris', 'Zachary Rogers',
    'Kayla Reed', 'Trevor Cook', 'Jasmine Bailey', 'Cameron Rivera', 'Natalie Cooper',
    'Blake Richardson', 'Melanie Cox', 'Connor Ward', 'Brooke Torres', 'Ethan Peterson',
    'Sydney Gray', 'Mason Ramirez', 'Paige James', 'Caleb Watson', 'Jenna Brooks',
    'Noah Kelly', 'Mariah Sanders', 'Isaac Price', 'Destiny Bennett', 'Owen Wood',
    'Gabrielle Barnes', 'Liam Ross', 'Ariana Henderson', 'Cole Coleman', 'Jade Jenkins',
    'Aiden Perry', 'Autumn Powell', 'Ian Long', 'Sierra Patterson', 'Hunter Hughes',
    'Diamond Flores', 'Eli Washington', 'Genesis Butler', 'Landon Simmons', 'Journey Foster',
    'Sebastian Gonzales', 'Amaya Bryant', 'Xavier Alexander', 'Aliyah Russell', 'Roman Griffin',
    'Serenity Diaz', 'Camden Hayes', 'Harmony Myers', 'Grayson Ford', 'Trinity Hamilton',
    'Bentley Graham', 'Nevaeh Sullivan', 'Easton Wallace', 'Lydia Woods', 'Colton Crawford',
    'Faith McNeal', 'Jaxon Stone', 'Hope Fisher', 'Bryson Porter', 'Scarlett Mason'
  ].sort();

  // Helper to convert backend stories to frontend format
  const convertBackendStory = (story: BackendUserStory): UserStory => ({
    id: story.id,
    epicId: story.epicId || null,
    title: story.title,
    description: story.description || '',
    acceptanceCriteria: story.acceptanceCriteria,
    storyPoints: story.storyPoints,
    status: story.status as UserStory['status'],
    priority: story.priority as UserStory['priority'],
    assignee: story.assignee || undefined,
    productManager: story.productManager || undefined,
    techLead: story.techLead || undefined,
    labels: story.labels || [],
    feature: story.feature || undefined,
    value: story.value || undefined,
    requirement: story.requirement || undefined,
    githubRepo: story.githubRepo || undefined,
    githubBranch: story.githubBranch || undefined,
    githubIssue: story.githubIssue || undefined,
    githubCommits: story.githubCommits || [],
    screenshots: story.screenshots || [],
    createdAt: typeof story.createdAt === 'string' ? story.createdAt : new Date().toISOString(),
    updatedAt: typeof story.updatedAt === 'string' ? story.updatedAt : new Date().toISOString()
  });

  // Stories are now organized by Epic, not by individual tasks
  // All stories retrieved from backend are already filtered if epicId is provided

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'backlog': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'sprint': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'review': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'done': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const editStory = (story: UserStory) => {
    setEditingStory(story);
    setIsStoryDialogOpen(true);
  };

  // Helper function to get all stories for a task  
  const getAllStoriesForTask = (taskId: string): UserStory[] => {
    const task = tasks.find(t => t.id === taskId);
    const taskStories = task ? generateUserStories(task) : [];
    return taskStories;
  };

  const createGitHubBranch = (story: UserStory) => {
    // Simple GitHub integration - create branch from story
    const branchName = story.title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);
    
    console.log(`Creating branch: feature/${branchName}`);
    // TODO: Integrate with GitHub API
    alert(`Would create branch: feature/${branchName}\n(GitHub integration coming soon!)`);
  };

  const createGitHubCommit = (story: UserStory) => {
    // Simple GitHub integration - create commit for story
    const commitMessage = `feat: ${story.title}`;
    
    console.log(`Creating commit: ${commitMessage}`);
    // TODO: Integrate with GitHub API
    alert(`Would create commit: ${commitMessage}\n(GitHub integration coming soon!)`);
  };

  const createNewStory = () => {
    const newStory: UserStory = {
      id: `US-${Date.now().toString().slice(-7)}`,
      epicId: null, // Will be set in dialog
      title: '',
      description: '',
      acceptanceCriteria: `Given [context]
When [action]
Then [expected outcome]

Scenario: [scenario name]
  Given [precondition]
  When [action]
  Then [expected result]
  And [additional verification]`,
      storyPoints: 3,
      status: 'backlog',
      priority: 'medium',
      assignee: undefined,
      productManager: undefined,
      techLead: undefined,
      labels: [],
      feature: '',
      value: '',
      requirement: '',
      githubRepo: undefined,
      githubBranch: undefined,
      githubIssue: undefined,
      githubCommits: [],
      screenshots: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setEditingStory(newStory);
    setIsStoryDialogOpen(true);
  };

  const saveStory = (story: UserStory) => {
    // Update existing or create new story via backend API
    const existingStory = allStories.find((s: BackendUserStory) => s.id === story.id);
    if (existingStory) {
      // Update existing story - exclude date fields as they're auto-handled
      const { createdAt, updatedAt, ...updates } = story;
      updateStoryMutation.mutate({ 
        id: story.id, 
        updates 
      });
    } else {
      // Create new story - exclude date fields as they're auto-generated
      const { createdAt, updatedAt, ...storyData } = story;
      createStoryMutation.mutate(storyData);
    }
    setIsStoryDialogOpen(false);
  };

  const handleCsvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const csv = e.target?.result as string;
      const lines = csv.split('\n');
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      const newStories: UserStory[] = [];
      
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        if (values.length < 2) continue; // Skip empty lines
        
        const story: UserStory = {
          id: `US-${Date.now().toString().slice(-7)}${i.toString().padStart(2, '0')}`,
          epicId: getValue(values, headers, 'epic_id') || null,
          title: getValue(values, headers, 'title') || getValue(values, headers, 'user_story') || '',
          description: getValue(values, headers, 'description') || '',
          acceptanceCriteria: getValue(values, headers, 'acceptance_criteria') || getValue(values, headers, 'gherkin') || 
            `Given [context]
When [action]
Then [expected outcome]`,
          storyPoints: parseInt(getValue(values, headers, 'story_points') || getValue(values, headers, 'points') || '3'),
          status: (getValue(values, headers, 'status') || 'backlog') as UserStory['status'],
          priority: (getValue(values, headers, 'priority') || 'medium') as UserStory['priority'],
          assignee: getValue(values, headers, 'assignee') || getValue(values, headers, 'developer'),
          productManager: getValue(values, headers, 'product_manager') || getValue(values, headers, 'pm'),
          techLead: getValue(values, headers, 'tech_lead') || getValue(values, headers, 'architect'),
          labels: getValue(values, headers, 'labels')?.split(';') || [],
          feature: getValue(values, headers, 'feature'),
          value: getValue(values, headers, 'value'),
          requirement: getValue(values, headers, 'requirement'),
          githubRepo: getValue(values, headers, 'github_repo'),
          githubBranch: getValue(values, headers, 'github_branch'),
          githubIssue: undefined,
          githubCommits: [],
          screenshots: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        if (story.title) {
          newStories.push(story);
        }
      }
      
      // Import stories via backend API
      for (const newStory of newStories) {
        const { createdAt, updatedAt, ...storyData } = newStory;
        createStoryMutation.mutate(storyData);
      }
      alert(`Successfully imported ${newStories.length} stories from CSV!`);
    };
    
    reader.readAsText(file);
    event.target.value = ''; // Reset input
  };

  const getValue = (values: string[], headers: string[], fieldName: string): string | undefined => {
    const index = headers.indexOf(fieldName);
    return index >= 0 ? values[index]?.trim() : undefined;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">User Stories</h3>
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            {total > 0 && `${total} Total Stories`}
          </div>
          <div className="flex items-center gap-2">
            {/* Epic Filter */}
            <Select value={epicFilter} onValueChange={setEpicFilter}>
              <SelectTrigger className="w-[200px]" data-testid="select-epic-filter">
                <SelectValue placeholder="All Epics" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Epics</SelectItem>
                {epics.map(epic => (
                  <SelectItem key={epic.id} value={epic.id}>{epic.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setEditingEpic(null);
                setIsEpicDialogOpen(true);
              }}
              data-testid="button-create-epic"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Epic
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setCsvUploadOpen(true)}
              data-testid="button-upload-csv"
            >
              <Upload className="w-4 h-4 mr-2" />
              Import CSV
            </Button>
            <Button 
              variant="default" 
              size="sm"
              onClick={createNewStory}
              data-testid="button-create-story"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Story
            </Button>
          </div>
        </div>
      </div>

      {/* Top Pagination Controls */}
      <PaginationControls
        page={page}
        pageSize={pageSize}
        total={total}
        totalPages={totalPages}
        isLoading={isLoadingStories}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />

      {/* Stories Content */}
      <div className="min-h-[400px]">
        {isLoadingStories ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-sm text-muted-foreground">Loading stories...</div>
          </div>
        ) : allStories.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-sm text-muted-foreground">No stories found.</div>
          </div>
        ) : (
          <div className="space-y-4">
            {allStories.map((story: BackendUserStory) => {
              const convertedStory = convertBackendStory(story);
              return (
                <div 
                  key={story.id} 
                  className="bg-white dark:bg-gray-800 rounded-lg border p-4 cursor-pointer hover:shadow-md transition-shadow"
                  onDoubleClick={() => {
                    const convertedStory = convertBackendStory(story);
                    setEditingStory(convertedStory);
                    setIsStoryDialogOpen(true);
                  }}
                  data-testid={`story-card-${story.id.substring(0, 8)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">{story.title}</span>
                        <Badge variant="outline" className={getStatusColor(story.status)}>
                          {story.status}
                        </Badge>
                        <Badge variant="outline" className={getPriorityColor(story.priority)}>
                          {story.priority}
                        </Badge>
                        {story.storyPoints && (
                          <Badge variant="secondary">
                            {story.storyPoints} pts
                          </Badge>
                        )}
                        <DefectBadge userStoryId={story.id} />
                        {story.epicId && (() => {
                          const epic = epics.find(e => e.id === story.epicId);
                          return epic ? (
                            <Badge variant="outline" className="bg-orange-50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800">
                              {epic.name}
                            </Badge>
                          ) : null;
                        })()}
                      </div>
                      {story.description && (
                        <p className="text-sm text-muted-foreground mb-2">{story.description}</p>
                      )}
                      {story.acceptanceCriteria && (
                        <div className="text-sm">
                          <span className="font-medium">Acceptance Criteria:</span>
                          <p className="text-muted-foreground mt-1">{story.acceptanceCriteria}</p>
                        </div>
                      )}
                      {story.assignee && (
                        <div className="flex items-center gap-2 mt-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{story.assignee}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingStory(convertedStory);
                          setIsStoryDialogOpen(true);
                        }}
                        data-testid={`button-edit-story-${story.id.substring(0, 8)}`}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteStoryMutation.mutate(story.id)}
                        data-testid={`button-delete-story-${story.id.substring(0, 8)}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Pagination Controls */}
      <PaginationControls
        page={page}
        pageSize={pageSize}
        total={total}
        totalPages={totalPages}
        isLoading={isLoadingStories}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />

      {/* Legacy Epic-based view - remove the old tasks.map section */}
      {false && tasks.map((task: Task) => {
        const userStories = generateUserStories(task);
        const isExpanded = expandedTasks.has(task.id);
        const totalPoints = userStories.reduce((sum, story) => sum + story.storyPoints, 0);

        return (
          <div key={task.id} className="bg-white dark:bg-gray-800 rounded-lg border">
            {/* Epic Header */}
            <div 
              className="p-4 border-b cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50"
              onClick={() => toggleTaskExpansion(task.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Epic: {task.title}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200`}>
                        {task.category}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {userStories.length} stories • {totalPoints} points
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditTask(task);
                  }}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* User Stories List */}
            {isExpanded && (
              <div className="p-4 space-y-3">
                {userStories.map((story, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{story.title}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(story.status)}`}>
                          {story.status}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {story.storyPoints} point{story.storyPoints !== 1 ? 's' : ''}
                        </span>
                        {story.githubBranch && (
                          <span className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1">
                            <GitBranch className="w-3 h-3" />
                            {story.githubBranch}
                          </span>
                        )}
                      </div>
                      {story.screenshots && story.screenshots.length > 0 && (
                        <div className="flex items-center gap-1 mt-1">
                          <Image className="w-3 h-3 text-gray-500" />
                          <span className="text-xs text-gray-500">{story.screenshots.length} screenshot{story.screenshots.length !== 1 ? 's' : ''}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {/* GitHub Integration Buttons - matching your screenshot style */}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-xs h-7 px-2"
                        onClick={() => createGitHubBranch(story)}
                        data-testid={`button-create-branch-${story.id}`}
                      >
                        <GitBranch className="w-3 h-3 mr-1" />
                        Create branch
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-xs h-7 px-2"
                        onClick={() => createGitHubCommit(story)}
                        data-testid={`button-create-commit-${story.id}`}
                      >
                        <Code2 className="w-3 h-3 mr-1" />
                        Create commit
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 px-2"
                        onClick={() => editStory(story)}
                        data-testid={`button-edit-story-${story.id}`}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                {/* Add Story Button */}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-3"
                  data-testid={`button-add-story-${task.id}`}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add User Story
                </Button>
              </div>
            )}
          </div>
        );
      })}

      {total === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No stories found. Create your first story or import from CSV to get started.
        </div>
      )}

      {/* Story Edit Dialog */}
      <Dialog open={isStoryDialogOpen} onOpenChange={setIsStoryDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Edit User Story
              {editingStory && (
                <span className="ml-2 text-sm font-mono text-muted-foreground">
                  {editingStory.id}
                </span>
              )}
            </DialogTitle>
          </DialogHeader>
          
          {editingStory && (
            <div className="space-y-4 mt-4">
              {/* Epic Connection */}
              <div className="space-y-2">
                <Label htmlFor="epic-connection">Connected Epic (Optional)</Label>
                <Select 
                  value={editingStory.epicId || "independent"} 
                  onValueChange={(value) => setEditingStory({...editingStory, epicId: value === "independent" ? null : value})}
                >
                  <SelectTrigger data-testid="select-epic-connection">
                    <SelectValue placeholder="Select an Epic (or leave independent)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="independent">Independent Story (No Epic)</SelectItem>
                    {epics.map((epic) => (
                      <SelectItem key={epic.id} value={epic.id}>
                        {epic.name} ({epic.valueStream})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Story Guidance Fields */}
              <div className="space-y-4 p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
                <h4 className="font-medium text-blue-900 dark:text-blue-100">Story Composition Guidance</h4>
                <div className="grid grid-cols-1 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="story-feature" className="text-xs text-blue-700 dark:text-blue-300">Feature (What functionality?)</Label>
                    <Input
                      id="story-feature"
                      value={editingStory.feature || ''}
                      onChange={(e) => setEditingStory({...editingStory, feature: e.target.value})}
                      placeholder="e.g., drag-and-drop interface, AI suggestions, search functionality"
                      className="text-sm"
                      data-testid="input-story-feature"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="story-value" className="text-xs text-blue-700 dark:text-blue-300">Value (What benefit or outcome?)</Label>
                    <Input
                      id="story-value"
                      value={editingStory.value || ''}
                      onChange={(e) => setEditingStory({...editingStory, value: e.target.value})}
                      placeholder="e.g., save time, improve accuracy, increase productivity"
                      className="text-sm"
                      data-testid="input-story-value"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="story-requirement" className="text-xs text-blue-700 dark:text-blue-300">Requirement (What specific need?)</Label>
                    <Input
                      id="story-requirement"
                      value={editingStory.requirement || ''}
                      onChange={(e) => setEditingStory({...editingStory, requirement: e.target.value})}
                      placeholder="e.g., model complex systems, visualize data flows, collaborate with team"
                      className="text-sm"
                      data-testid="input-story-requirement"
                    />
                  </div>
                </div>
              </div>

              {/* Story Title */}
              <div className="space-y-2">
                <Label htmlFor="story-title">User Story</Label>
                <div className="text-xs text-muted-foreground mb-2">
                  Format: As a [persona/role], I want [feature], so that I can [value/requirement]
                </div>
                <Input
                  id="story-title"
                  value={editingStory.title}
                  onChange={(e) => setEditingStory({...editingStory, title: e.target.value})}
                  placeholder="As a [persona/role], I want [description], so that I can [benefit or value statement]"
                  className="text-sm"
                  data-testid="input-story-title"
                />
              </div>

              {/* Story Details Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="story-status">Status</Label>
                  <Select value={editingStory.status} onValueChange={(value) => setEditingStory({...editingStory, status: value as UserStory['status']})}>
                    <SelectTrigger data-testid="select-story-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="backlog">Backlog</SelectItem>
                      <SelectItem value="sprint">Sprint</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="review">Review</SelectItem>
                      <SelectItem value="done">Done</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="story-points">Story Points</Label>
                  <Select value={editingStory.storyPoints.toString()} onValueChange={(value) => setEditingStory({...editingStory, storyPoints: parseInt(value)})}>
                    <SelectTrigger data-testid="select-story-points">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="8">8</SelectItem>
                      <SelectItem value="13">13</SelectItem>
                      <SelectItem value="21">21</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Priority */}
              <div className="space-y-2">
                <Label htmlFor="story-priority">Priority</Label>
                <Select value={editingStory.priority} onValueChange={(value) => setEditingStory({...editingStory, priority: value as UserStory['priority']})}>
                  <SelectTrigger data-testid="select-story-priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Team Assignment Row */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="story-assignee">Developer (Assignee)</Label>
                  <Popover open={isAssigneeOpen} onOpenChange={setIsAssigneeOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={isAssigneeOpen}
                        className="w-full justify-between text-sm"
                        data-testid="select-story-assignee"
                      >
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          {editingStory.assignee || "Select developer..."}
                        </div>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput 
                          placeholder="Search developers..." 
                          value={assigneeSearch}
                          onValueChange={setAssigneeSearch}
                        />
                        <CommandList>
                          <CommandEmpty>No developers found.</CommandEmpty>
                          <CommandGroup>
                            <CommandItem
                              value=""
                              onSelect={() => {
                                setEditingStory({...editingStory, assignee: undefined});
                                setIsAssigneeOpen(false);
                                setAssigneeSearch('');
                              }}
                            >
                              <Check
                                className={`mr-2 h-4 w-4 ${!editingStory.assignee ? "opacity-100" : "opacity-0"}`}
                              />
                              Unassigned
                            </CommandItem>
                            {developers
                              .filter((dev: string) => dev.toLowerCase().includes(assigneeSearch.toLowerCase()))
                              .map((developer: string) => (
                              <CommandItem
                                key={developer}
                                value={developer}
                                onSelect={() => {
                                  setEditingStory({...editingStory, assignee: developer});
                                  setIsAssigneeOpen(false);
                                  setAssigneeSearch('');
                                }}
                              >
                                <Check
                                  className={`mr-2 h-4 w-4 ${editingStory.assignee === developer ? "opacity-100" : "opacity-0"}`}
                                />
                                {developer}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="story-product-manager">Product Manager/Owner</Label>
                  <Popover open={isProductManagerOpen} onOpenChange={setIsProductManagerOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={isProductManagerOpen}
                        className="w-full justify-between text-sm"
                        data-testid="select-story-product-manager"
                      >
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          {editingStory.productManager || "Select PM..."}
                        </div>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput 
                          placeholder="Search product managers..." 
                          value={productManagerSearch}
                          onValueChange={setProductManagerSearch}
                        />
                        <CommandList>
                          <CommandEmpty>No product managers found.</CommandEmpty>
                          <CommandGroup>
                            <CommandItem
                              value=""
                              onSelect={() => {
                                setEditingStory({...editingStory, productManager: undefined});
                                setIsProductManagerOpen(false);
                                setProductManagerSearch('');
                              }}
                            >
                              <Check
                                className={`mr-2 h-4 w-4 ${!editingStory.productManager ? "opacity-100" : "opacity-0"}`}
                              />
                              Unassigned
                            </CommandItem>
                            {developers
                              .filter((dev: string) => dev.toLowerCase().includes(productManagerSearch.toLowerCase()))
                              .map((developer: string) => (
                              <CommandItem
                                key={developer}
                                value={developer}
                                onSelect={() => {
                                  setEditingStory({...editingStory, productManager: developer});
                                  setIsProductManagerOpen(false);
                                  setProductManagerSearch('');
                                }}
                              >
                                <Check
                                  className={`mr-2 h-4 w-4 ${editingStory.productManager === developer ? "opacity-100" : "opacity-0"}`}
                                />
                                {developer}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="story-tech-lead">Tech Lead/Architect</Label>
                  <Popover open={isTechLeadOpen} onOpenChange={setIsTechLeadOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={isTechLeadOpen}
                        className="w-full justify-between text-sm"
                        data-testid="select-story-tech-lead"
                      >
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          {editingStory.techLead || "Select tech lead..."}
                        </div>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput 
                          placeholder="Search tech leads..." 
                          value={techLeadSearch}
                          onValueChange={setTechLeadSearch}
                        />
                        <CommandList>
                          <CommandEmpty>No tech leads found.</CommandEmpty>
                          <CommandGroup>
                            <CommandItem
                              value=""
                              onSelect={() => {
                                setEditingStory({...editingStory, techLead: undefined});
                                setIsTechLeadOpen(false);
                                setTechLeadSearch('');
                              }}
                            >
                              <Check
                                className={`mr-2 h-4 w-4 ${!editingStory.techLead ? "opacity-100" : "opacity-0"}`}
                              />
                              Unassigned
                            </CommandItem>
                            {developers
                              .filter((dev: string) => dev.toLowerCase().includes(techLeadSearch.toLowerCase()))
                              .map((developer: string) => (
                              <CommandItem
                                key={developer}
                                value={developer}
                                onSelect={() => {
                                  setEditingStory({...editingStory, techLead: developer});
                                  setIsTechLeadOpen(false);
                                  setTechLeadSearch('');
                                }}
                              >
                                <Check
                                  className={`mr-2 h-4 w-4 ${editingStory.techLead === developer ? "opacity-100" : "opacity-0"}`}
                                />
                                {developer}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="story-description">Description</Label>
                <Textarea
                  id="story-description"
                  value={editingStory.description || ''}
                  onChange={(e) => setEditingStory({...editingStory, description: e.target.value})}
                  placeholder="Detailed description of the user story..."
                  rows={3}
                  data-testid="textarea-story-description"
                />
              </div>

              {/* Gherkin Acceptance Criteria */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="acceptance-criteria">Acceptance Criteria (Gherkin)</Label>
                  <Button variant="ghost" size="sm" className="text-xs h-6 px-2">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Gherkin Guide
                  </Button>
                </div>
                <Textarea
                  id="acceptance-criteria"
                  value={editingStory.acceptanceCriteria}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    setEditingStory({...editingStory, acceptanceCriteria: newValue});
                    // Real-time Gherkin validation (US-XIGJUQ7)
                    const validation = validateGherkinFormat(newValue);
                    setGherkinValidation(validation);
                  }}
                  placeholder={`Given [context]
When [action]
Then [expected outcome]

Scenario: [scenario name]
  Given [precondition]
  When [action]
  Then [expected result]
  And [additional verification]`}
                  rows={12}
                  className="font-mono text-sm"
                  data-testid="textarea-acceptance-criteria"
                />
                {/* Gherkin Validation Feedback (US-XIGJUQ7) */}
                {gherkinValidation.errors.length > 0 && (
                  <div className="text-sm text-red-600 dark:text-red-400 mt-1" data-testid="gherkin-errors">
                    {gherkinValidation.errors.map((error, idx) => (
                      <div key={idx}>• {error}</div>
                    ))}
                  </div>
                )}
                {gherkinValidation.warnings.length > 0 && gherkinValidation.errors.length === 0 && (
                  <div className="text-sm text-amber-600 dark:text-amber-400 mt-1" data-testid="gherkin-warnings">
                    {gherkinValidation.warnings.map((warning, idx) => (
                      <div key={idx}>⚠ {warning}</div>
                    ))}
                  </div>
                )}
                {gherkinValidation.isValid && gherkinValidation.warnings.length === 0 && editingStory.acceptanceCriteria.trim().length > 0 && (
                  <div className="text-sm text-green-600 dark:text-green-400 mt-1" data-testid="gherkin-valid">
                    ✓ Valid Gherkin format
                  </div>
                )}
              </div>

              {/* Defect Management */}
              <DefectManagement 
                userStoryId={editingStory.id} 
                userStoryTitle={editingStory.title}
              />

              {/* GitHub Integration */}
              <div className="space-y-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-900">
                <h4 className="font-medium flex items-center gap-2">
                  <GitBranch className="w-4 h-4" />
                  GitHub Integration
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="github-repo">Repository</Label>
                    <Input
                      id="github-repo"
                      value={editingStory.githubRepo || ''}
                      onChange={(e) => setEditingStory({...editingStory, githubRepo: e.target.value})}
                      placeholder="owner/repository"
                      data-testid="input-github-repo"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="github-branch">Branch</Label>
                    <Input
                      id="github-branch"
                      value={editingStory.githubBranch || ''}
                      onChange={(e) => setEditingStory({...editingStory, githubBranch: e.target.value})}
                      placeholder="feature/story-branch"
                      data-testid="input-github-branch"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => createGitHubBranch(editingStory)}>
                    <GitBranch className="w-4 h-4 mr-2" />
                    Create Branch
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => createGitHubCommit(editingStory)}>
                    <Code2 className="w-4 h-4 mr-2" />
                    Create Commit
                  </Button>
                </div>
              </div>

              {/* Screenshots/Images */}
              <div className="space-y-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-900">
                <h4 className="font-medium flex items-center gap-2">
                  <Image className="w-4 h-4" />
                  Screenshots & Diagrams
                </h4>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full" data-testid="button-upload-screenshot">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Figma Mockup / UX Diagram
                  </Button>
                  {editingStory.screenshots && editingStory.screenshots.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {editingStory.screenshots.map((screenshot, index) => (
                        <div key={index} className="relative group">
                          <img src={screenshot} alt={`Screenshot ${index + 1}`} className="w-full h-20 object-cover rounded border" />
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                            onClick={() => {
                              const newScreenshots = editingStory.screenshots.filter((_, i) => i !== index);
                              setEditingStory({...editingStory, screenshots: newScreenshots});
                            }}
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsStoryDialogOpen(false)} data-testid="button-cancel-story">
                  Cancel
                </Button>
                <Button onClick={() => {
                  if (editingStory) {
                    saveStory(editingStory);
                  }
                }} data-testid="button-save-story">
                  Save Story
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* CSV Upload Dialog */}
      <Dialog open={csvUploadOpen} onOpenChange={setCsvUploadOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Import Stories from CSV
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">CSV Format Guidelines</h4>
              <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <p><strong>Required columns:</strong> title (or user_story)</p>
                <p><strong>Optional columns:</strong> description, acceptance_criteria, story_points, status, priority, assignee, product_manager, tech_lead, epic_id, feature, value, requirement</p>
                <p><strong>Example header:</strong></p>
                <code className="block mt-1 p-2 bg-white dark:bg-gray-800 rounded text-xs">
                  title,description,story_points,status,assignee,epic_id
                </code>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="csv-file">Select CSV File</Label>
              <Input
                id="csv-file"
                type="file"
                accept=".csv"
                onChange={handleCsvUpload}
                data-testid="input-csv-file"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setCsvUploadOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Epic Dialog */}
      <Dialog open={isEpicDialogOpen} onOpenChange={setIsEpicDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingEpic ? 'Edit Epic' : 'Create Epic'}</DialogTitle>
            <DialogDescription>
              {editingEpic ? 'Update the Epic details below.' : 'Create a new Epic (EA Value Stream) for organizing user stories.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const epicData = {
              name: formData.get('name') as string,
              description: formData.get('description') as string || null,
              valueStream: formData.get('valueStream') as string,
              status: 'planned',
              priority: 'medium'
            };
            
            if (editingEpic) {
              updateEpicMutation.mutate({ id: editingEpic.id, updates: epicData });
            } else {
              createEpicMutation.mutate(epicData);
            }
            setIsEpicDialogOpen(false);
          }} className="space-y-4 mt-4">
            <div>
              <Label htmlFor="epic-name">Epic Name *</Label>
              <Input id="epic-name" name="name" defaultValue={editingEpic?.name || ''} required data-testid="input-epic-name" />
            </div>
            
            <div>
              <Label htmlFor="epic-valueStream">Enterprise Architecture Value Stream *</Label>
              <Select name="valueStream" defaultValue={editingEpic?.valueStream || 'strategy'} required>
                <SelectTrigger data-testid="select-epic-valuestream">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="strategy">Strategy & Business Planning</SelectItem>
                  <SelectItem value="design">Architecture Design & Modeling</SelectItem>
                  <SelectItem value="governance">Governance & Decision Management</SelectItem>
                  <SelectItem value="development">Development & Implementation</SelectItem>
                  <SelectItem value="operations">Operations & Intelligence</SelectItem>
                  <SelectItem value="knowledge">Knowledge & Collaboration</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="epic-description">Description</Label>
              <Textarea id="epic-description" name="description" defaultValue={editingEpic?.description || ''} rows={3} data-testid="input-epic-description" />
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsEpicDialogOpen(false)} data-testid="button-cancel-epic">
                Cancel
              </Button>
              <Button type="submit" data-testid="button-save-epic">
                {editingEpic ? 'Update' : 'Create'} Epic
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Plan Content Component
function PlanContent() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [currentView, setCurrentView] = useState<'board' | 'list' | 'gantt' | 'calendar' | 'table' | 'stories'>('board');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');

  const queryClient = useQueryClient();

  // Fetch tasks from API
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['/api/tasks', 'v2'], // Force cache break
    queryFn: async () => {
      console.log('🔄 FETCHING TASKS (NEW VERSION)');
      const response = await fetch('/api/tasks');
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data = await response.json();
      console.log('📊 LOADED TASKS:', data.length, 'tasks');
      return data;
    },
  });

  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: async (newTask: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });
      if (!response.ok) throw new Error('Failed to create task');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
    },
  });

  // Update task mutation
  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<Task>) => {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update task');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete task');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
    },
  });

  // Drag and drop setup
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Print function for List view - moved to after filteredTasks is defined

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeTask = tasks.find((t: Task) => t.id === active.id);
    if (!activeTask) return;

    const newStatus = over.id as Task['status'];
    if (activeTask.status !== newStatus) {
      updateTaskMutation.mutate({
        id: activeTask.id,
        status: newStatus,
        completed: newStatus === 'completed' ? 1 : 0
      });
    }
  };

  // Task management handlers
  const handleCreateTask = () => {
    setEditingTask(undefined);
    setIsDialogOpen(true);
  };

  const handleEditTask = (task: Task) => {
    console.log('🚀 EDIT CLICK (NEW VERSION):', task.id, task.title);
    console.log('📝 Setting editing task:', task);
    setEditingTask(task);
    setIsDialogOpen(true);
    console.log('✅ Dialog should be open now');
  };

  const handleArchiveTask = (task: Task) => {
    // For now, we'll update the status to 'completed' as an archive simulation
    updateTaskMutation.mutate({
      id: task.id,
      status: 'completed',
      completed: 1
    });
  };

  const handleDeleteTask = (taskOrId: Task | string) => {
    const task = typeof taskOrId === 'string' ? tasks.find((t: Task) => t.id === taskOrId) : taskOrId;
    const taskId = typeof taskOrId === 'string' ? taskOrId : taskOrId.id;
    const taskTitle = task?.title || 'this task';
    
    // Add confirmation before deleting
    if (window.confirm(`Are you sure you want to delete "${taskTitle}"? This action cannot be undone.`)) {
      deleteTaskMutation.mutate(taskId);
    }
  };

  // Toggle task completion status and update database
  const handleToggleTaskComplete = (task: Task) => {
    updateTaskMutation.mutate({
      id: task.id,
      completed: task.completed ? 0 : 1,
      status: task.completed ? 'todo' : 'completed'
    });
  };

  const handleSaveTask = (taskData: Omit<Task, 'id'>) => {
    if (editingTask) {
      updateTaskMutation.mutate({ id: editingTask.id, ...taskData });
    } else {
      createTaskMutation.mutate(taskData);
    }
    setIsDialogOpen(false);
    setEditingTask(undefined);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingTask(undefined);
  };

  // Filter tasks by status
  const getTasksByStatus = (status: Task['status']) => {
    return filteredTasks.filter((task: Task) => task.status === status);
  };

  // Helper functions for styling
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'foundation': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'modeling': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'knowledge-base': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
      case 'ai': return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200';
      case 'integration': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'ux': return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  // Filter tasks based on search and category
  const filteredTasks = tasks.filter((task: Task) => {
    const matchesSearch = searchQuery === '' || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      task.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'All Categories' || task.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  // Print function for List view
  const handlePrintList = () => {
    try {
      const printWindow = window.open('', '', 'height=600,width=800');
      if (!printWindow) {
        alert('Print function requires popup permission. Please allow popups and try again.');
        return;
      }
      
      printWindow.document.write(`
        <html>
          <head>
            <title>ARKHITEKTON Development Plan - Task List</title>
            <style>
              body { font-family: system-ui, sans-serif; margin: 20px; line-height: 1.5; }
              .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
              .task-item { border: 1px solid #e5e7eb; margin-bottom: 12px; padding: 15px; border-radius: 8px; page-break-inside: avoid; }
              .task-title { font-weight: 600; margin-bottom: 8px; font-size: 16px; }
              .task-id { color: #6b7280; font-size: 12px; font-family: monospace; }
              .task-priority, .task-category { display: inline-block; padding: 4px 10px; border-radius: 12px; font-size: 11px; margin-right: 8px; font-weight: 500; }
              .priority-high { background-color: #fef2f2; color: #dc2626; border: 1px solid #fca5a5; }
              .priority-medium { background-color: #fffbeb; color: #d97706; border: 1px solid #fcd34d; }
              .priority-low { background-color: #f0fdf4; color: #16a34a; border: 1px solid #86efac; }
              .category { background-color: #f3f4f6; color: #374151; border: 1px solid #d1d5db; }
              .task-description { color: #6b7280; margin: 10px 0; font-size: 14px; }
              .task-dates { color: #6b7280; font-size: 13px; margin: 8px 0; }
              .task-meta { margin-top: 10px; color: #6b7280; font-size: 12px; }
              .completed { text-decoration: line-through; opacity: 0.7; }
              .stats { text-align: center; margin-bottom: 20px; font-size: 14px; }
              @media print { 
                body { margin: 0; } 
                .task-item { page-break-inside: avoid; }
                @page { margin: 1in; }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>ARKHITEKTON Development Plan</h1>
              <h2>Task List Report</h2>
            </div>
            <div class="stats">
              <p><strong>Generated on:</strong> ${new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
              <p><strong>Total Tasks:</strong> ${filteredTasks.length}</p>
              <p><strong>Completed:</strong> ${filteredTasks.filter((t: Task) => t.completed).length} | 
                 <strong>In Progress:</strong> ${filteredTasks.filter((t: Task) => t.status === 'in-progress').length} | 
                 <strong>Todo:</strong> ${filteredTasks.filter((t: Task) => t.status === 'todo').length}</p>
            </div>
            <hr>
            ${filteredTasks.map((task: Task) => `
              <div class="task-item ${task.completed ? 'completed' : ''}">
                <div class="task-title">
                  <span class="task-id">(${task.id.substring(0, 8)})</span> ${task.title.replace(/[<>&"']/g, (char: string) => {
                    const escapeMap: Record<string, string> = { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#39;' };
                    return escapeMap[char];
                  })}
                  <span class="task-priority priority-${task.priority}">${task.priority.toUpperCase()}</span>
                  <span class="task-category category">${task.category.toUpperCase()}</span>
                </div>
                ${task.description ? `<div class="task-description">${task.description.replace(/[<>&"']/g, (char: string) => {
                  const escapeMap: Record<string, string> = { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#39;' };
                  return escapeMap[char];
                })}</div>` : ''}
                ${task.startDate || task.endDate ? `
                  <div class="task-dates">
                    📅 ${task.startDate && task.endDate ? 
                      `${new Date(task.startDate).toLocaleDateString()} - ${new Date(task.endDate).toLocaleDateString()}` :
                      task.startDate ? `Start: ${new Date(task.startDate).toLocaleDateString()}` :
                      task.endDate ? `End: ${new Date(task.endDate).toLocaleDateString()}` : 'No dates set'
                    }
                  </div>
                ` : ''}
                ${task.dependencies?.length || task.subtasks?.length ? `
                  <div class="task-meta">
                    ${task.dependencies?.length ? `🔗 Dependencies: ${task.dependencies.length} task(s)` : ''}
                    ${task.dependencies?.length && task.subtasks?.length ? ' • ' : ''}
                    ${task.subtasks?.length ? `✅ Subtasks: ${task.subtasks.filter((st: any) => st.completed).length}/${task.subtasks.length}` : ''}
                  </div>
                ` : ''}
              </div>
            `).join('')}
            <hr style="margin-top: 40px;">
            <p style="text-align: center; font-size: 12px; color: #6b7280;">
              Generated by ARKHITEKTON - Enterprise Architecture Platform
            </p>
          </body>
        </html>
      `);
      
      printWindow.document.close();
      printWindow.focus();
      
      // Give the window time to load before printing
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    } catch (error) {
      console.error('Print error:', error);
      alert('Unable to print. Please try again or check browser settings.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading tasks...</p>
        </div>
      </div>
    );
  }

  // Calculate overall progress
  const completedTasks = tasks.filter((task: Task) => task.status === 'completed').length;
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="h-full overflow-hidden flex flex-col">
      <GovernanceHeader 
        moduleTitle="Development Plan" 
        moduleIcon={GitBranch} 
      />

      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Create Task Button */}
        <div className="flex justify-end">
          <Button onClick={handleCreateTask} data-testid="button-create-task">
            <span className="mr-2">+</span>
            Create Task
          </Button>
        </div>

      {/* Mission Section */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 rounded-lg p-6 border border-orange-200 dark:border-orange-800">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-orange-100 dark:bg-orange-900 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-orange-600 dark:text-orange-400 text-sm">🏆</span>
          </div>
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-orange-900 dark:text-orange-100">Our Mission</h2>
            <p className="text-orange-800 dark:text-orange-200 leading-relaxed">
              Build ARKHITEKTON to be so <span className="font-semibold text-orange-900 dark:text-orange-100">advanced, elegant, and simple</span> that every other enterprise architecture tool becomes obsolete. We're not just building software - we're creating the future of how architects design, collaborate, and transform complex systems into understandable excellence.
            </p>
            <div className="flex items-center gap-2 mt-4">
              <span className="text-orange-600 dark:text-orange-400 text-sm">⚡</span>
              <span className="text-orange-700 dark:text-orange-300 text-sm font-medium">Making enterprise architecture tools that architects actually love to use</span>
            </div>
          </div>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="bg-card dark:bg-card border border-border dark:border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground dark:text-foreground">Overall Progress</h3>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-foreground dark:text-foreground">{completedTasks}/{totalTasks}</span>
            <span className="text-muted-foreground dark:text-muted-foreground">Complete</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="w-full bg-muted dark:bg-muted rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-orange-500 to-amber-500 h-3 rounded-full transition-all duration-500" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-foreground dark:text-foreground font-medium">{progressPercentage}% Complete</span>
            <span className="text-muted-foreground dark:text-muted-foreground">Making every other EA tool obsolete</span>
          </div>
        </div>
      </div>


      {/* View Selection and Filters */}
      <div className="space-y-4">
        {/* View Selection Tabs */}
        <div className="flex items-center gap-1 bg-muted p-1 rounded-lg w-fit">
          <Button
            variant={currentView === 'board' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setCurrentView('board')}
            className="flex items-center gap-2"
          >
            <LayoutGrid className="w-4 h-4" />
            Board
          </Button>
          <Button
            variant={currentView === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setCurrentView('list')}
            className="flex items-center gap-2"
          >
            <List className="w-4 h-4" />
            List
          </Button>
          <Button
            variant={currentView === 'gantt' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setCurrentView('gantt')}
            className="flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            Gantt
          </Button>
          <Button
            variant={currentView === 'calendar' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setCurrentView('calendar')}
            className="flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Calendar
          </Button>
          <Button
            variant={currentView === 'table' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setCurrentView('table')}
            className="flex items-center gap-2"
          >
            <Table className="w-4 h-4" />
            Table
          </Button>
          <Button
            variant={currentView === 'stories' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setCurrentView('stories')}
            className="flex items-center gap-2"
            data-testid="button-view-stories"
          >
            <GitBranch className="w-4 h-4" />
            Stories
          </Button>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search tasks by title, description, or task ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search-tasks"
            />
          </div>

          {/* Time Filter */}
          <Select defaultValue="all-time">
            <SelectTrigger className="w-32">
              <SelectValue placeholder="All Time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-time">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
            </SelectContent>
          </Select>

          {/* Category Filter */}
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Categories">All Categories</SelectItem>
              <SelectItem value="foundation">Foundation</SelectItem>
              <SelectItem value="modeling">Modeling</SelectItem>
              <SelectItem value="knowledge-base">Knowledge Base</SelectItem>
              <SelectItem value="architecture">Architecture</SelectItem>
              <SelectItem value="ui-ux">UI/UX</SelectItem>
              <SelectItem value="development">Development</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Content Based on Current View */}
      {currentView === 'board' && (
        <>{/* Kanban Board */}
        <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-96">
          <TaskColumn
            id="todo"
            title="To Do"
            icon={Circle}
            iconColor="text-gray-400"
            tasks={getTasksByStatus('todo')}
            onEdit={handleEditTask}
            onArchive={handleArchiveTask}
            onDelete={handleDeleteTask}
            onToggleComplete={handleToggleTaskComplete}
          />
          
          <TaskColumn
            id="in-progress"
            title="In Progress"
            icon={Clock}
            iconColor="text-blue-500"
            tasks={getTasksByStatus('in-progress')}
            onEdit={handleEditTask}
            onArchive={handleArchiveTask}
            onDelete={handleDeleteTask}
            onToggleComplete={handleToggleTaskComplete}
          />
          
          <TaskColumn
            id="completed"
            title="Completed"
            icon={CheckCircle2}
            iconColor="text-green-500"
            tasks={getTasksByStatus('completed')}
            onEdit={handleEditTask}
            onArchive={handleArchiveTask}
            onDelete={handleDeleteTask}
            onToggleComplete={handleToggleTaskComplete}
          />
        </div>

        <DragOverlay>
          {activeId ? (
            <div className="opacity-95 rotate-3 scale-105">
              <TaskCard 
                task={tasks.find((t: Task) => t.id === activeId)!} 
                onEdit={handleEditTask}
                onArchive={handleArchiveTask}
                onDelete={handleDeleteTask}
                onToggleComplete={handleToggleTaskComplete}
              />
            </div>
          ) : null}
        </DragOverlay>
        </DndContext>
        </>
      )}

      {/* List View */}
      {currentView === 'list' && (
        <div className="space-y-4">
          {/* List View Header with Print Button */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Task List</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrintList}
              className="flex items-center gap-2"
              data-testid="button-print-list"
            >
              <Printer className="w-4 h-4" />
              Print
            </Button>
          </div>
          
          {/* Task List Content */}
          <div className="space-y-2" id="list-view-content">
          {filteredTasks.map((task: Task) => (
            <div key={task.id} className="bg-white dark:bg-gray-800 rounded-lg border p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <button
                    onClick={() => handleToggleTaskComplete(task)}
                    className="flex-shrink-0"
                    data-testid={`button-toggle-complete-${task.id}`}
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 
                        className={`font-medium cursor-pointer hover:text-primary ${task.completed ? 'line-through text-muted-foreground' : ''}`}
                        onDoubleClick={() => handleEditTask(task)}
                        data-testid={`list-task-title-${task.id}`}
                      >
                        ({task.id.substring(0, 8)}) {task.title}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(task.category)}`}>
                        {task.category}
                      </span>
                    </div>
                    {task.description && (
                      <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                    )}
                    
                    {/* Date Range Display */}
                    {(task.startDate || task.endDate) && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {task.startDate && task.endDate ? (
                            `${formatDateForDisplay(task.startDate, 'full')} - ${formatDateForDisplay(task.endDate, 'full')}`
                          ) : task.startDate ? (
                            `Start: ${formatDateForDisplay(task.startDate, 'full')}`
                          ) : (
                            `End: ${formatDateForDisplay(task.endDate, 'full')}`
                          )}
                        </span>
                      </div>
                    )}
                    
                    {/* Dependencies and Subtasks indicators */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {task.dependencies && task.dependencies.length > 0 && (
                        <span className="flex items-center gap-1">
                          <ArrowRight className="w-3 h-3" />
                          Depends on {task.dependencies.length} task
                        </span>
                      )}
                      {task.subtasks && task.subtasks.length > 0 && (
                        <span className="flex items-center gap-1">
                          <CheckSquare className="w-3 h-3" />
                          {task.subtasks.filter((st: any) => st.completed).length}/{task.subtasks.length} subtasks
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditTask(task)}
                    data-testid={`button-edit-task-${task.id}`}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteTask(task)}
                    className="text-red-500 hover:text-red-700"
                    data-testid={`button-delete-task-${task.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          
          {filteredTasks.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No tasks found matching your filters.
            </div>
          )}
          </div>
        </div>
      )}

      {/* Table View */}
      {currentView === 'table' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Task
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Start Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    End Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Dependencies
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Subtasks
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {filteredTasks.map((task: Task) => (
                  <tr key={task.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleTaskComplete(task)}
                        data-testid={`button-toggle-complete-${task.id}`}
                      >
                        {task.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="max-w-sm">
                        <div 
                          className={`font-medium cursor-pointer hover:text-primary ${task.completed ? 'line-through text-muted-foreground' : ''}`}
                          onDoubleClick={() => handleEditTask(task)}
                          data-testid={`table-task-title-${task.id}`}
                        >
                          ({task.id.substring(0, 8)}) {task.title}
                        </div>
                        {task.description && (
                          <div className="text-sm text-muted-foreground truncate mt-1">
                            {task.description}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(task.category)}`}>
                        {task.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {task.startDate ? new Date(task.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' }) : '—'}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {task.endDate ? new Date(task.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' }) : '—'}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {task.dependencies && task.dependencies.length > 0 ? `${task.dependencies.length} task` : '—'}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {task.subtasks && task.subtasks.length > 0 
                        ? `${task.subtasks.filter((st: any) => st.completed).length}/${task.subtasks.length}` 
                        : '—'
                      }
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditTask(task)}
                          data-testid={`button-edit-task-${task.id}`}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTask(task)}
                          className="text-red-500 hover:text-red-700"
                          data-testid={`button-delete-task-${task.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredTasks.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No tasks found matching your filters.
            </div>
          )}
        </div>
      )}

      {/* Calendar View */}
      {currentView === 'calendar' && (
        <CalendarView tasks={filteredTasks} onEditTask={handleEditTask} />
      )}

      {/* Gantt Chart View */}
      {currentView === 'gantt' && (
        <GanttView tasks={filteredTasks} onEditTask={handleEditTask} />
      )}

      {/* Stories View */}
      {currentView === 'stories' && (
        <StoriesView tasks={filteredTasks} onEditTask={handleEditTask} />
      )}

      {/* Task Dialog */}
      <TaskDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        task={editingTask}
        onSave={handleSaveTask}
        allTasks={tasks}
      />
      </div>
    </div>
  );
}

// Calendar View Component
function CalendarView({ tasks, onEditTask }: { tasks: Task[]; onEditTask: (task: Task) => void }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => {
      if (task.dueDate && isSameDay(parseISO(task.dueDate), date)) return true;
      if (task.startDate && isSameDay(parseISO(task.startDate), date)) return true;
      if (task.endDate && isSameDay(parseISO(task.endDate), date)) return true;
      
      // Check if date is within task duration
      if (task.startDate && task.endDate) {
        const start = parseISO(task.startDate);
        const end = parseISO(task.endDate);
        return isWithinInterval(date, { start, end });
      }
      
      return false;
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border">
      {/* Calendar Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-lg font-semibold">{format(currentMonth, 'MMMM yyyy')}</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={prevMonth}>
            ← Previous
          </Button>
          <Button variant="outline" size="sm" onClick={nextMonth}>
            Next →
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map(day => {
            const dayTasks = getTasksForDate(day);
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isToday = isSameDay(day, new Date());

            return (
              <div
                key={day.toISOString()}
                className={`min-h-[120px] p-2 border rounded-lg ${
                  isCurrentMonth ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'
                } ${isToday ? 'ring-2 ring-orange-500' : ''}`}
              >
                <div className={`text-sm font-medium mb-1 ${
                  isCurrentMonth ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400'
                }`}>
                  {format(day, 'd')}
                </div>
                
                <div className="space-y-1">
                  {dayTasks.slice(0, 3).map(task => (
                    <div
                      key={task.id}
                      onClick={() => onEditTask(task)}
                      className={`text-xs p-1 rounded cursor-pointer hover:shadow-sm ${
                        getPriorityColor(task.priority)
                      }`}
                      title={`(${task.id.substring(0, 8)}) ${task.title}`}
                    >
                      {`(${task.id.substring(0, 8)}) ${task.title}`.length > 20 ? `(${task.id.substring(0, 8)}) ${task.title.substring(0, 10)}...` : `(${task.id.substring(0, 8)}) ${task.title}`}
                    </div>
                  ))}
                  {dayTasks.length > 3 && (
                    <div className="text-xs text-gray-500">+{dayTasks.length - 3} more</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Sortable Task Row Component for Gantt Chart
function SortableTaskRow({ task, timelineDates, oneMonthAgo, twoMonthsLater, onEditTask, onTaskUpdate }: {
  task: Task;
  timelineDates: Date[];
  oneMonthAgo: Date;
  twoMonthsLater: Date;
  onEditTask: (task: Task) => void;
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getTaskBarWidth = (task: Task) => {
    if (!task.startDate || !task.endDate) return '0%';
    
    const start = parseISO(task.startDate);
    const end = parseISO(task.endDate);
    const totalDays = Math.max(1, Math.abs(twoMonthsLater.getTime() - oneMonthAgo.getTime()) / (1000 * 60 * 60 * 24));
    const taskDays = Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    
    return `${Math.min(100, (taskDays / totalDays) * 100)}%`;
  };

  const getTaskBarPosition = (task: Task) => {
    if (!task.startDate) return '0%';
    
    const start = parseISO(task.startDate);
    const totalDays = Math.abs(twoMonthsLater.getTime() - oneMonthAgo.getTime()) / (1000 * 60 * 60 * 24);
    const offsetDays = Math.abs(start.getTime() - oneMonthAgo.getTime()) / (1000 * 60 * 60 * 24);
    
    return `${Math.max(0, (offsetDays / totalDays) * 100)}%`;
  };

  return (
    <div ref={setNodeRef} style={style} className="flex hover:bg-gray-50 dark:hover:bg-gray-700/50">
      <div className="w-64 p-3 border-r flex items-center gap-2">
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
          <GripVertical className="h-4 w-4 text-gray-400" />
        </div>
        <div className="flex-1">
          <div className="font-medium text-sm">({task.id.substring(0, 8)}) {task.title}</div>
          <div className="text-xs text-gray-500">
            {task.startDate && task.endDate && (
              <>
                {format(parseISO(task.startDate), 'MMM d')} - {format(parseISO(task.endDate), 'MMM d')}
              </>
            )}
          </div>
        </div>
      </div>
      <div className="flex-1 p-3 relative min-w-[600px]">
        <div className="relative h-6">
          <div
            className={`absolute h-4 rounded cursor-pointer hover:shadow-lg transition-shadow ${
              getPriorityColor(task.priority)
            }`}
            style={{
              left: getTaskBarPosition(task),
              width: getTaskBarWidth(task),
              top: '2px'
            }}
            onClick={() => onEditTask(task)}
            title={`(${task.id.substring(0, 8)}) ${task.title} (${task.priority} priority)`}
          >
            <div className="px-2 py-1 text-xs font-medium overflow-hidden">
              ({task.id.substring(0, 8)}) {task.title}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Gantt Chart View Component  
function GanttView({ tasks, onEditTask }: { tasks: Task[]; onEditTask: (task: Task) => void }) {
  const today = new Date();
  const oneMonthAgo = subMonths(today, 1);
  const twoMonthsLater = addMonths(today, 2);
  
  // Generate timeline dates (weekly intervals)
  const timelineDates = eachDayOfInterval({ start: oneMonthAgo, end: twoMonthsLater })
    .filter((_, index) => index % 7 === 0); // Show every 7th day for weekly view

  // Only show tasks with start and end dates
  const [ganttTasks, setGanttTasks] = useState(tasks.filter(task => task.startDate && task.endDate));

  // Update local state when props change
  useEffect(() => {
    setGanttTasks(tasks.filter(task => task.startDate && task.endDate));
  }, [tasks]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setGanttTasks((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over?.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleTaskUpdate = (taskId: string, updates: Partial<Task>) => {
    // This would trigger a mutation to update the task
    console.log('Updating task:', taskId, updates);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Gantt Chart</h2>
        <p className="text-sm text-gray-500 mt-1">
          Showing tasks with start and end dates ({ganttTasks.length} of {tasks.length} tasks)
        </p>
      </div>

      <div className="overflow-x-auto">
        {/* Timeline Header */}
        <div className="flex bg-gray-50 dark:bg-gray-700 border-b">
          <div className="w-64 p-3 font-medium border-r">Task</div>
          <div className="flex-1 relative min-w-[600px]">
            <div className="flex">
              {timelineDates.map(date => (
                <div key={date.toISOString()} className="flex-1 p-2 text-xs text-center border-r">
                  {format(date, 'MMM d')}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Task Rows with Drag and Drop */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={ganttTasks.map(task => task.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="divide-y">
              {ganttTasks.map(task => (
                <SortableTaskRow
                  key={task.id}
                  task={task}
                  timelineDates={timelineDates}
                  oneMonthAgo={oneMonthAgo}
                  twoMonthsLater={twoMonthsLater}
                  onEditTask={onEditTask}
                  onTaskUpdate={handleTaskUpdate}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {ganttTasks.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>No tasks with start and end dates found.</p>
            <p className="text-sm mt-1">Add start and end dates to tasks to see them in the Gantt chart.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Main Plan Page Component
export default function PlanPage() {
  return (
    <AppLayout>
      <PlanContent />
    </AppLayout>
  );
}