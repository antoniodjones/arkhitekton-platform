import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { 
  ChevronDown, 
  ChevronRight, 
  Target, 
  Inbox, 
  GripVertical,
  Clock,
  User,
  Flag,
  Zap
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useToast } from '@/hooks/use-toast';

interface Story {
  id: string;
  title: string;
  status: string;
  priority: string;
  storyPoints: number;
  sprintId?: string | null;
  assignee?: string | null;
  epicId?: string | null;
}

interface Sprint {
  id: string;
  name: string;
  goal?: string;
  status: string;
  teamVelocity: number;
  committedPoints: number;
  completedPoints: number;
}

interface SprintBacklogSplitProps {
  onStoryClick?: (story: Story) => void;
}

const getPriorityColor = (priority: string) => {
  switch (priority.toLowerCase()) {
    case 'high': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 border-red-200';
    case 'medium': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200';
    case 'low': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200';
    default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'done': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
    case 'in-progress': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
    case 'review': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
    case 'sprint': return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300';
    default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
  }
};

// Inline editable priority cell
function InlinePriorityEditor({ 
  story, 
  onUpdate 
}: { 
  story: Story; 
  onUpdate: (id: string, priority: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <Select 
        value={story.priority} 
        onValueChange={(value) => {
          onUpdate(story.id, value);
          setIsEditing(false);
        }}
        onOpenChange={(open) => !open && setIsEditing(false)}
        defaultOpen
      >
        <SelectTrigger className="h-6 w-20 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="low">Low</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="high">High</SelectItem>
        </SelectContent>
      </Select>
    );
  }

  return (
    <Badge 
      variant="outline"
      className={cn("cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all", getPriorityColor(story.priority))}
      onClick={() => setIsEditing(true)}
    >
      {story.priority}
    </Badge>
  );
}

// Story row component
function StoryRow({ 
  story, 
  index,
  onPriorityUpdate,
  onClick 
}: { 
  story: Story; 
  index: number;
  onPriorityUpdate: (id: string, priority: string) => void;
  onClick?: () => void;
}) {
  return (
    <Draggable draggableId={story.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={cn(
            "flex items-center gap-3 p-3 bg-white dark:bg-gray-800 border rounded-lg mb-2 group",
            "hover:shadow-md transition-all cursor-pointer",
            snapshot.isDragging && "shadow-lg ring-2 ring-primary/30 rotate-1"
          )}
          onClick={onClick}
        >
          {/* Drag Handle */}
          <div 
            {...provided.dragHandleProps}
            className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical className="w-4 h-4" />
          </div>

          {/* Story ID */}
          <span className="text-xs font-mono text-muted-foreground w-24 shrink-0">
            {story.id.split('-').slice(-1)[0]?.substring(0, 7)}
          </span>

          {/* Title */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{story.title}</p>
          </div>

          {/* Priority (Inline Editable) */}
          <div onClick={(e) => e.stopPropagation()}>
            <InlinePriorityEditor story={story} onUpdate={onPriorityUpdate} />
          </div>

          {/* Status */}
          <Badge variant="secondary" className={cn("text-xs", getStatusColor(story.status))}>
            {story.status}
          </Badge>

          {/* Points */}
          <Badge variant="outline" className="w-12 justify-center">
            {story.storyPoints} pts
          </Badge>

          {/* Assignee */}
          {story.assignee && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <User className="w-3 h-3" />
              <span className="max-w-20 truncate">{story.assignee.split(' ')[0]}</span>
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
}

// Collapsible section component
function CollapsibleSection({
  title,
  icon: Icon,
  iconColor,
  count,
  points,
  capacity,
  children,
  droppableId,
  defaultOpen = true,
  accentColor = "blue"
}: {
  title: string;
  icon: any;
  iconColor: string;
  count: number;
  points: number;
  capacity?: number;
  children: React.ReactNode;
  droppableId: string;
  defaultOpen?: boolean;
  accentColor?: string;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const capacityPercent = capacity ? Math.min((points / capacity) * 100, 100) : 0;
  const isOverCapacity = capacity && points > capacity;

  return (
    <div className="border rounded-lg overflow-hidden bg-gray-50/50 dark:bg-gray-900/50">
      {/* Section Header */}
      <button
        className={cn(
          "w-full flex items-center justify-between p-4 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors",
          `border-l-4 border-l-${accentColor}-500`
        )}
        style={{ borderLeftColor: accentColor === 'green' ? '#22c55e' : accentColor === 'purple' ? '#a855f7' : '#3b82f6' }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          {isOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          <Icon className={cn("w-5 h-5", iconColor)} />
          <span className="font-semibold text-lg">{title}</span>
          <Badge variant="secondary" className="ml-2">
            {count} {count === 1 ? 'story' : 'stories'}
          </Badge>
        </div>

        <div className="flex items-center gap-4">
          {/* Capacity Bar (for Sprint section) */}
          {capacity && (
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full transition-all",
                    isOverCapacity ? "bg-red-500" : "bg-green-500"
                  )}
                  style={{ width: `${capacityPercent}%` }}
                />
              </div>
              <span className={cn(
                "text-sm font-medium",
                isOverCapacity ? "text-red-600" : "text-muted-foreground"
              )}>
                {points}/{capacity} pts
              </span>
            </div>
          )}
          
          {!capacity && (
            <span className="text-sm text-muted-foreground">
              {points} pts total
            </span>
          )}
        </div>
      </button>

      {/* Section Content */}
      {isOpen && (
        <Droppable droppableId={droppableId}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={cn(
                "p-4 min-h-[100px] transition-colors",
                snapshot.isDraggingOver && "bg-primary/5"
              )}
            >
              {children}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      )}
    </div>
  );
}

export function SprintBacklogSplit({ onStoryClick }: SprintBacklogSplitProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch active sprint
  const { data: activeSprint } = useQuery<Sprint>({
    queryKey: ['/api/sprints/active'],
    retry: false,
  });

  // Fetch all stories
  const { data: storiesResponse, isLoading } = useQuery<{ items: Story[] }>({
    queryKey: ['/api/user-stories?pageSize=500'],
  });

  const stories = storiesResponse?.items || [];

  // Update story mutation
  const updateStoryMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Story> }) => {
      const response = await apiRequest('PATCH', `/api/user-stories/${id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user-stories'] });
      queryClient.invalidateQueries({ queryKey: ['/api/sprints'] });
    },
  });

  // Handle priority update (inline edit)
  const handlePriorityUpdate = (storyId: string, priority: string) => {
    updateStoryMutation.mutate(
      { id: storyId, updates: { priority } },
      {
        onSuccess: () => {
          toast({
            title: "Priority updated",
            description: `Changed to ${priority}`,
          });
        },
      }
    );
  };

  // Handle drag end
  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const newStatus = destination.droppableId === 'sprint' ? 'sprint' : 'backlog';
    const newSprintId = destination.droppableId === 'sprint' ? activeSprint?.id : null;

    try {
      await updateStoryMutation.mutateAsync({
        id: draggableId,
        updates: { 
          status: newStatus,
          sprintId: newSprintId 
        }
      });

      toast({
        title: newStatus === 'sprint' ? "Added to Sprint" : "Moved to Backlog",
        description: `Story moved successfully`,
      });
    } catch (error) {
      toast({
        title: "Failed to move story",
        variant: "destructive",
      });
    }
  };

  // Split stories
  const sprintStories = stories.filter(s => 
    s.sprintId === activeSprint?.id || 
    s.status === 'sprint' || 
    s.status === 'in-progress' || 
    s.status === 'review'
  );
  const backlogStories = stories.filter(s => 
    s.status === 'backlog' && !s.sprintId
  );

  const sprintPoints = sprintStories.reduce((sum, s) => sum + (s.storyPoints || 0), 0);
  const backlogPoints = backlogStories.reduce((sum, s) => sum + (s.storyPoints || 0), 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-muted-foreground">Loading stories...</div>
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="space-y-6">
        {/* Active Sprint Header */}
        {activeSprint && (
          <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-indigo-500" />
                <div>
                  <h3 className="font-semibold text-lg">{activeSprint.name}</h3>
                  {activeSprint.goal && (
                    <p className="text-sm text-muted-foreground">{activeSprint.goal}</p>
                  )}
                </div>
              </div>
              <Badge variant="outline" className="bg-indigo-100 text-indigo-700 border-indigo-200">
                {activeSprint.status}
              </Badge>
            </div>
          </div>
        )}

        {!activeSprint && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-amber-500" />
              <div>
                <h3 className="font-medium">No Active Sprint</h3>
                <p className="text-sm text-muted-foreground">Create a sprint to start planning your work.</p>
              </div>
            </div>
          </div>
        )}

        {/* Sprint Section */}
        <CollapsibleSection
          title="Current Sprint"
          icon={Target}
          iconColor="text-indigo-500"
          count={sprintStories.length}
          points={sprintPoints}
          capacity={activeSprint?.teamVelocity || 30}
          droppableId="sprint"
          accentColor="purple"
        >
          {sprintStories.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
              <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Drag stories here to add to sprint</p>
            </div>
          ) : (
            sprintStories.map((story, index) => (
              <StoryRow
                key={story.id}
                story={story}
                index={index}
                onPriorityUpdate={handlePriorityUpdate}
                onClick={() => onStoryClick?.(story)}
              />
            ))
          )}
        </CollapsibleSection>

        {/* Backlog Section */}
        <CollapsibleSection
          title="Backlog"
          icon={Inbox}
          iconColor="text-gray-500"
          count={backlogStories.length}
          points={backlogPoints}
          droppableId="backlog"
          accentColor="blue"
        >
          {backlogStories.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
              <Inbox className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No stories in backlog</p>
            </div>
          ) : (
            backlogStories.map((story, index) => (
              <StoryRow
                key={story.id}
                story={story}
                index={index}
                onPriorityUpdate={handlePriorityUpdate}
                onClick={() => onStoryClick?.(story)}
              />
            ))
          )}
        </CollapsibleSection>
      </div>
    </DragDropContext>
  );
}

