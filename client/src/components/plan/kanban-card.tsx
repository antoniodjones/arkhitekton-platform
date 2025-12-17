import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Circle, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle, 
  Calendar,
  MoreVertical,
  ArrowRight,
  CheckSquare
} from 'lucide-react';
import { format } from 'date-fns';
import { CodeChangesBadge } from '@/components/code-changes/code-changes-badge';

// Types (should eventually be shared)
interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  dueDate?: string;
  completed?: boolean;
  subtasks?: any[];
  dependencies?: any[];
}

interface KanbanCardProps {
  task: Task;
  index: number;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const getPriorityColor = (priority: string) => {
  switch (priority.toLowerCase()) {
    case 'high': return 'text-red-500 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
    case 'medium': return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
    case 'low': return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
    default: return 'text-gray-500 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700';
  }
};

const getCategoryColor = (category: string) => {
  switch (category.toLowerCase()) {
    case 'bug': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    case 'feature': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
    case 'enhancement': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    case 'documentation': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  }
};

export function KanbanCard({ task, index, onClick, onEdit, onDelete }: KanbanCardProps) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`mb-3 transition-transform ${snapshot.isDragging ? 'rotate-2 z-50' : ''}`}
          style={provided.draggableProps.style}
        >
          <Card 
            className={`
              cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow bg-white dark:bg-gray-800 
              ${snapshot.isDragging ? 'shadow-xl ring-2 ring-primary/20' : 'shadow-sm'}
            `}
            onClick={onClick}
          >
            <CardContent className="p-3 space-y-3">
              {/* Header: Priority & Category */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 overflow-hidden">
                  <Badge 
                    variant="outline" 
                    className={`text-[10px] h-5 px-1.5 font-medium border ${getPriorityColor(task.priority)}`}
                  >
                    {task.priority}
                  </Badge>
                  <Badge 
                    variant="secondary"
                    className={`text-[10px] h-5 px-1.5 ${getCategoryColor(task.category)}`}
                  >
                    {task.category}
                  </Badge>
                </div>
                
                {/* Actions (only visible on hover if we want cleaner UI, but keeping visible for utility) */}
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {/* Actions can go here if needed */}
                </div>
              </div>

              {/* Title */}
              <div>
                <h4 className="font-medium text-sm text-foreground line-clamp-2 leading-tight">
                  <span className="text-muted-foreground mr-1.5 font-normal">
                    {task.id.split('-').pop()?.substring(0, 4)}
                  </span>
                  {task.title}
                </h4>
              </div>

              {/* Footer Info */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-3 text-muted-foreground">
                  {/* Due Date */}
                  {task.dueDate && (
                    <div className="flex items-center gap-1 text-[10px]" title={`Due: ${format(new Date(task.dueDate), 'MMM d, yyyy')}`}>
                      <Calendar className="w-3 h-3" />
                      <span>{format(new Date(task.dueDate), 'MMM d')}</span>
                    </div>
                  )}

                  {/* Subtasks */}
                  {task.subtasks && task.subtasks.length > 0 && (
                    <div className="flex items-center gap-1 text-[10px]" title="Subtasks">
                      <CheckSquare className="w-3 h-3" />
                      <span>
                        {task.subtasks.filter((st: any) => st.completed).length}/{task.subtasks.length}
                      </span>
                    </div>
                  )}
                </div>

                {/* Code Changes Badge */}
                <CodeChangesBadge entityType="user_story" entityId={task.id} />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </Draggable>
  );
}

