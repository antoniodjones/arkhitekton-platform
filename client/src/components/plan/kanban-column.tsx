import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { KanbanCard } from './kanban-card';
import { cn } from '@/lib/utils';
import { MoreHorizontal, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface KanbanColumnProps {
  id: string;
  title: string;
  tasks: any[];
  icon?: React.ReactNode;
  color?: string; // e.g. "bg-blue-500"
  onTaskClick?: (task: any) => void;
  onAddTask?: () => void;
}

export function KanbanColumn({ 
  id, 
  title, 
  tasks, 
  icon, 
  color = "bg-gray-500",
  onTaskClick,
  onAddTask
}: KanbanColumnProps) {
  return (
    <div className="flex flex-col h-full bg-gray-50/50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-800 min-w-[280px] w-full">
      {/* Column Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-t-lg sticky top-0 z-10">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="font-semibold text-sm text-foreground">{title}</h3>
          <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs px-2 py-0.5 rounded-full font-medium">
            {tasks.length}
          </span>
        </div>
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
          {onAddTask && (
            <Button onClick={onAddTask} variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
              <Plus className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Droppable Area */}
      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={cn(
              "flex-1 p-2 overflow-y-auto transition-colors min-h-[150px]",
              snapshot.isDraggingOver ? "bg-primary/5 dark:bg-primary/10" : ""
            )}
          >
            {tasks.map((task, index) => (
              <KanbanCard 
                key={task.id} 
                task={task} 
                index={index} 
                onClick={() => onTaskClick?.(task)}
              />
            ))}
            {provided.placeholder}
            
            {/* Empty State */}
            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <div className="flex flex-col items-center justify-center h-24 text-muted-foreground border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-md m-1">
                <p className="text-xs">No tasks</p>
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
}

