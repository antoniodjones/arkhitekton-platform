import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek, parseISO, isWithinInterval, addDays } from 'date-fns';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { formatDateForInput, formatDateForAPI, formatDateForDisplay } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  ExternalLink
} from 'lucide-react';
import { Link } from 'wouter';
import { GovernanceHeader } from '@/components/layout/governance-header';
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
  parentTaskId: string;
  title: string;
  description?: string;
  acceptanceCriteria: string; // Gherkin format
  storyPoints: number;
  status: 'backlog' | 'sprint' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee?: string;
  labels: string[];
  
  // GitHub Integration
  githubRepo?: string;
  githubBranch?: string;
  githubIssue?: number;
  githubCommits: string[];
  
  // Media
  screenshots: string[]; // URLs to uploaded images
  
  createdAt: string;
  updatedAt: string;
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
  const filteredTasks = allTasks.filter(t => 
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

  const generateUserStories = (task: Task): Array<UserStory> => {
    // Auto-generate user stories based on task category and description
    const baseStories = {
      'foundation': [
        { 
          title: `As a developer, I want to set up the foundation for ${task.title.toLowerCase()}`, 
          storyPoints: 3, 
          status: 'backlog' as const,
          acceptanceCriteria: `Given I am setting up the foundation
When I implement the basic structure
Then the foundation should be ready for development

Scenario: Foundation Setup
  Given the development environment is ready
  When I create the basic project structure
  Then all dependencies should be properly configured
  And the foundation should pass initial tests`
        },
        { 
          title: `As an architect, I want to define the core structure for ${task.title.toLowerCase()}`, 
          storyPoints: 5, 
          status: 'backlog' as const,
          acceptanceCriteria: `Given I need to define the architecture
When I design the core structure
Then the structure should be scalable and maintainable

Scenario: Architecture Definition
  Given the requirements are clear
  When I create the architectural design
  Then the design should follow best practices
  And the structure should support future enhancements`
        }
      ],
      'modeling': [
        { 
          title: `As an architect, I want to design the visual components for ${task.title.toLowerCase()}`, 
          storyPoints: 5, 
          status: 'backlog' as const,
          acceptanceCriteria: `Given I need visual components
When I design the UI elements
Then the components should be reusable and accessible

Scenario: Component Design
  Given the design requirements
  When I create the visual components
  Then they should follow the design system
  And they should be responsive across devices`
        },
        { 
          title: `As a user, I want to interact with ${task.title.toLowerCase()} intuitively`, 
          storyPoints: 3, 
          status: 'backlog' as const,
          acceptanceCriteria: `Given I want to use the feature
When I interact with the interface
Then the interaction should be intuitive and efficient

Scenario: User Interaction
  Given I access the feature
  When I perform common actions
  Then the interface should respond appropriately
  And provide clear feedback for all actions`
        },
        { 
          title: `As a developer, I want to implement the core logic for ${task.title.toLowerCase()}`, 
          storyPoints: 8, 
          status: 'backlog' as const,
          acceptanceCriteria: `Given I need to implement the logic
When I write the core functionality
Then the implementation should be robust and tested

Scenario: Logic Implementation
  Given the design is finalized
  When I implement the core features
  Then all business rules should be enforced
  And the code should be well-tested and documented`
        }
      ],
      'ux': [
        { 
          title: `As a user, I want an intuitive interface for ${task.title.toLowerCase()}`, 
          storyPoints: 5, 
          status: 'backlog' as const,
          acceptanceCriteria: `Given I need to use the interface
When I navigate through the features
Then the interface should be user-friendly

Scenario: Interface Usability
  Given I access the application
  When I use the interface
  Then navigation should be clear and logical
  And I should accomplish tasks efficiently`
        },
        { 
          title: `As a designer, I want to create responsive layouts for ${task.title.toLowerCase()}`, 
          storyPoints: 3, 
          status: 'backlog' as const,
          acceptanceCriteria: `Given I need responsive design
When I create layouts for different screen sizes
Then the layout should adapt appropriately

Scenario: Responsive Design
  Given different device sizes
  When I view the interface
  Then the layout should be optimized for each device
  And content should remain accessible and readable`
        }
      ],
      'ai': [
        { 
          title: `As a user, I want AI-powered suggestions for ${task.title.toLowerCase()}`, 
          storyPoints: 8, 
          status: 'backlog' as const,
          acceptanceCriteria: `Given I want AI assistance
When I use the feature
Then I should receive relevant AI suggestions

Scenario: AI Suggestions
  Given I perform an action
  When the AI analyzes the context
  Then it should provide helpful suggestions
  And the suggestions should improve my workflow`
        },
        { 
          title: `As a developer, I want to integrate ML models for ${task.title.toLowerCase()}`, 
          storyPoints: 13, 
          status: 'backlog' as const,
          acceptanceCriteria: `Given I need ML integration
When I implement the ML features
Then the models should perform accurately

Scenario: ML Integration
  Given trained models are available
  When I integrate them into the system
  Then predictions should be accurate and fast
  And the system should handle edge cases gracefully`
        }
      ]
    };

    const stories = baseStories[task.category as keyof typeof baseStories] || [
      { 
        title: `As a user, I want to utilize ${task.title.toLowerCase()}`, 
        storyPoints: 5, 
        status: 'backlog' as const,
        acceptanceCriteria: `Given I want to use this feature
When I access the functionality
Then it should work as expected

Scenario: Feature Usage
  Given the feature is available
  When I use it according to the documentation
  Then it should perform the intended function
  And provide appropriate feedback`
      }
    ];

    // Convert to full UserStory objects
    return stories.map((story, index) => ({
      id: `${task.id}-story-${index}`,
      parentTaskId: task.id,
      title: story.title,
      description: `Generated story for ${task.title}`,
      acceptanceCriteria: story.acceptanceCriteria,
      storyPoints: story.storyPoints,
      status: story.status,
      priority: 'medium' as const,
      assignee: task.assignee || undefined,
      labels: [task.category],
      githubRepo: undefined,
      githubBranch: undefined,
      githubIssue: undefined,
      githubCommits: [],
      screenshots: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));
  };

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

  const editStory = (story: UserStory) => {
    setEditingStory(story);
    setIsStoryDialogOpen(true);
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">User Stories</h3>
        <div className="text-sm text-muted-foreground">
          {tasks.length} Epic{tasks.length !== 1 ? 's' : ''} • {tasks.reduce((acc, task) => acc + generateUserStories(task).length, 0)} Stories
        </div>
      </div>

      {tasks.map((task: Task) => {
        const userStories = generateUserStories(task);
        const isExpanded = expandedTasks.has(task.id);
        const totalPoints = userStories.reduce((sum, story) => sum + story.points, 0);

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

      {tasks.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No tasks found. Create tasks first to generate user stories.
        </div>
      )}

      {/* Story Edit Dialog */}
      <Dialog open={isStoryDialogOpen} onOpenChange={setIsStoryDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Edit User Story
            </DialogTitle>
          </DialogHeader>
          
          {editingStory && (
            <div className="space-y-4 mt-4">
              {/* Story Title */}
              <div className="space-y-2">
                <Label htmlFor="story-title">User Story</Label>
                <Input
                  id="story-title"
                  value={editingStory.title}
                  onChange={(e) => setEditingStory({...editingStory, title: e.target.value})}
                  placeholder="As a [user role], I want [goal] so that [benefit]"
                  className="text-sm"
                  data-testid="input-story-title"
                />
              </div>

              {/* Story Details Row */}
              <div className="grid grid-cols-4 gap-4">
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

                <div className="space-y-2">
                  <Label htmlFor="story-assignee">Assignee</Label>
                  <Input
                    id="story-assignee"
                    value={editingStory.assignee || ''}
                    onChange={(e) => setEditingStory({...editingStory, assignee: e.target.value})}
                    placeholder="Developer name"
                    data-testid="input-story-assignee"
                  />
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
                  onChange={(e) => setEditingStory({...editingStory, acceptanceCriteria: e.target.value})}
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
              </div>

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
                  // TODO: Save story changes to backend
                  console.log('Saving story:', editingStory);
                  setIsStoryDialogOpen(false);
                }} data-testid="button-save-story">
                  Save Story
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Main Plan Page Component
// Cache busting - v2.0 - Force browser reload
export default function PlanPage() {
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
    const task = typeof taskOrId === 'string' ? tasks.find(t => t.id === taskOrId) : taskOrId;
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
                      `End: ${new Date(task.endDate).toLocaleDateString()}`
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