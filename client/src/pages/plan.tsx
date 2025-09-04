import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
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
  CheckCircle
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
  dependencies?: string[] | null; // Array of task IDs this task depends on
  subtasks?: Array<{ id: string; title: string; completed: boolean; createdAt: Date }> | null;
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
  const [dependencies, setDependencies] = useState<string[]>(task?.dependencies || []);
  const [subtasks, setSubtasks] = useState<Array<{ id: string; title: string; completed: boolean; createdAt: Date }>>(task?.subtasks || []);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [dependencySearch, setDependencySearch] = useState('');
  const [showDependencyResults, setShowDependencyResults] = useState(false);

  // Update form state when task prop changes
  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setPriority(task.priority || 'medium');
      setCategory(task.category || 'foundation');
      setStatus(task.status || 'todo');
      setDependencies(task.dependencies || []);
      setSubtasks(task.subtasks || []);
    } else {
      // Reset form for new task
      setTitle('');
      setDescription('');
      setPriority('medium');
      setCategory('foundation');
      setStatus('todo');
      setDependencies([]);
      setSubtasks([]);
    }
  }, [task]);

  // Circular dependency detection
  const wouldCreateCircularDependency = (newDepId: string): boolean => {
    if (!task?.id || newDepId === task.id) return true;
    
    const checkCircular = (taskId: string, visited: Set<string>): boolean => {
      if (visited.has(taskId)) return true;
      
      const currentTask = allTasks.find(t => t.id === taskId);
      if (!currentTask?.dependencies) return false;
      
      visited.add(taskId);
      return currentTask.dependencies.some(depId => checkCircular(depId, new Set(visited)));
    };
    
    return checkCircular(newDepId, new Set());
  };

  // Filter tasks for dependency search
  const filteredTasks = allTasks.filter(t => 
    t.id !== task?.id && 
    !dependencies.includes(t.id) &&
    !wouldCreateCircularDependency(t.id) &&
    t.title.toLowerCase().includes(dependencySearch.toLowerCase())
  );

  const addDependency = (taskId: string) => {
    setDependencies([...dependencies, taskId]);
    setDependencySearch('');
    setShowDependencyResults(false);
  };

  const removeDependency = (taskId: string) => {
    setDependencies(dependencies.filter(id => id !== taskId));
  };

  const addSubtask = () => {
    if (newSubtaskTitle.trim()) {
      setSubtasks([...subtasks, {
        id: Date.now().toString(),
        title: newSubtaskTitle,
        completed: false,
        createdAt: new Date()
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
    onSave({
      title,
      description,
      priority,
      category,
      status,
      dependencies,
      subtasks,
      completed: status === 'completed' ? 1 : 0, // Convert boolean to integer for schema
      abilities: [],
      assignee: null,
      dueDate: null,
      comments: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      completedAt: status === 'completed' ? new Date() : null
    });
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

          {/* Dependencies Section */}
          <div>
            <Label>Dependencies</Label>
            <div className="space-y-2">
              <div className="relative">
                <Input
                  placeholder="Search for tasks to add as dependencies..."
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
                        onClick={() => addDependency(t.id)}
                        data-testid={`dependency-option-${t.id}`}
                      >
                        <div className="font-medium">{t.title}</div>
                        <div className="text-xs text-gray-500">{t.category} • {t.priority}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {dependencies.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {dependencies.map(depId => {
                    const depTask = allTasks.find(t => t.id === depId);
                    return depTask ? (
                      <div key={depId} className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 px-2 py-1 rounded text-xs">
                        <span>{depTask.title}</span>
                        <button
                          type="button"
                          onClick={() => removeDependency(depId)}
                          className="hover:text-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ) : null;
                  })}
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
            {task.title}
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

// Main Plan Page Component
// Cache busting - v2.0 - Force browser reload
export default function PlanPage() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [currentView, setCurrentView] = useState<'board' | 'list' | 'gantt' | 'calendar' | 'table'>('board');
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

  const handleDeleteTask = (task: Task) => {
    // Add confirmation before deleting
    if (window.confirm(`Are you sure you want to delete "${task.title}"? This action cannot be undone.`)) {
      deleteTaskMutation.mutate(task.id);
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
    return tasks.filter((task: Task) => task.status === status);
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
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search tasks..."
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

      {/* Other Views - Coming Soon */}
      {currentView !== 'board' && (
        <div className="text-center py-12">
          <div className="text-muted-foreground">
            <div className="text-lg font-medium mb-2">
              {currentView.charAt(0).toUpperCase() + currentView.slice(1)} View
            </div>
            <p>Coming soon! This view is under development.</p>
          </div>
        </div>
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