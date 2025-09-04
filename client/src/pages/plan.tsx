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
  Trash2
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
  onSave 
}: { 
  open: boolean; 
  onClose: () => void; 
  task?: Task; 
  onSave: (data: Omit<Task, 'id'>) => void; 
}) {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState<Task['priority']>(task?.priority || 'medium');
  const [category, setCategory] = useState<Task['category']>(task?.category || 'foundation');
  const [status, setStatus] = useState<Task['status']>(task?.status || 'todo');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      description,
      priority,
      category,
      status,
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
      <DialogContent className="max-w-md">
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
  onDelete 
}: { 
  task: Task; 
  onEdit: (task: Task) => void;
  onArchive: (task: Task) => void;
  onDelete: (task: Task) => void;
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
  onDelete
}: { 
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  tasks: Task[];
  onEdit: (task: Task) => void;
  onArchive: (task: Task) => void;
  onDelete: (task: Task) => void;
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
            <TaskCard key={task.id} task={task} onEdit={onEdit} onArchive={onArchive} onDelete={onDelete} />
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm" data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">DEVELOPMENT PLAN</h1>
            <p className="text-muted-foreground">Comprehensive task management and progress tracking</p>
          </div>
        </div>
        <Button onClick={handleCreateTask} data-testid="button-create-task">
          <span className="mr-2">+</span>
          Create Task
        </Button>
      </div>

      {/* Kanban Board */}
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
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Task Dialog */}
      <TaskDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        task={editingTask}
        onSave={handleSaveTask}
      />
    </div>
  );
}