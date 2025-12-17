import React, { useState } from 'react';
import { DragDropContext, DropResult, DragStart } from '@hello-pangea/dnd';
import { KanbanColumn } from './kanban-column';
import { Circle, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Task {
  id: string;
  status: string;
  // ... other task properties handled by KanbanCard
  [key: string]: any;
}

interface KanbanBoardProps {
  tasks: Task[];
  onStatusChange: (taskId: string, newStatus: string) => Promise<void>;
  onTaskClick?: (task: Task) => void;
  isLoading?: boolean;
}

export function KanbanBoard({ tasks, onStatusChange, onTaskClick, isLoading }: KanbanBoardProps) {
  const { toast } = useToast();
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks);
  const [isDragging, setIsDragging] = useState(false);

  // Sync local state when prop changes (unless dragging)
  React.useEffect(() => {
    if (!isDragging) {
      setLocalTasks(tasks);
    }
  }, [tasks, isDragging]);

  const onDragStart = () => {
    setIsDragging(true);
  };

  const onDragEnd = async (result: DropResult) => {
    setIsDragging(false);
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newStatus = destination.droppableId;
    const oldStatus = source.droppableId;

    // 1. Optimistic Update
    const updatedTasks = [...localTasks];
    const taskIndex = updatedTasks.findIndex(t => t.id === draggableId);
    
    if (taskIndex === -1) return;

    // Update status in local state
    updatedTasks[taskIndex] = { ...updatedTasks[taskIndex], status: newStatus };
    setLocalTasks(updatedTasks);

    // 2. API Call
    try {
      if (newStatus !== oldStatus) {
        await onStatusChange(draggableId, newStatus);
      }
    } catch (error) {
      // 3. Rollback on failure
      setLocalTasks(tasks); // Revert to original prop state
      toast({
        title: "Failed to update status",
        description: "Moving the card back...",
        variant: "destructive",
      });
    }
  };

  const getTasksByStatus = (status: string) => {
    return localTasks.filter(t => t.status === status);
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading board...</div>
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
      <div className="flex flex-col lg:flex-row gap-4 h-full min-h-[500px] overflow-x-auto pb-4">
        
        {/* BACKLOG */}
        <KanbanColumn
          id="backlog"
          title="Backlog"
          icon={<Circle className="w-4 h-4 text-gray-400" />}
          tasks={getTasksByStatus('backlog')}
          onTaskClick={onTaskClick}
        />

        {/* SPRINT */}
        <KanbanColumn
          id="sprint"
          title="Sprint"
          icon={<AlertCircle className="w-4 h-4 text-purple-500" />}
          tasks={getTasksByStatus('sprint')}
          onTaskClick={onTaskClick}
        />

        {/* IN PROGRESS */}
        <KanbanColumn
          id="in-progress"
          title="In Progress"
          icon={<Clock className="w-4 h-4 text-blue-500" />}
          tasks={getTasksByStatus('in-progress')}
          onTaskClick={onTaskClick}
        />

        {/* REVIEW */}
        <KanbanColumn
          id="review"
          title="Review"
          icon={<AlertCircle className="w-4 h-4 text-amber-500" />}
          tasks={getTasksByStatus('review')}
          onTaskClick={onTaskClick}
        />

        {/* DONE */}
        <KanbanColumn
          id="done"
          title="Done"
          icon={<CheckCircle2 className="w-4 h-4 text-green-500" />}
          tasks={getTasksByStatus('done')}
          onTaskClick={onTaskClick}
        />
        
      </div>
    </DragDropContext>
  );
}

