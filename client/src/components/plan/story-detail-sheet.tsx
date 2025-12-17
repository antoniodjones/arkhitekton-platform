import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Edit2, 
  Save, 
  X, 
  User, 
  Calendar,
  Tag,
  FileText,
  GitBranch,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { CodeChangesBadge } from '@/components/code-changes/code-changes-badge';

interface Story {
  id: string;
  title: string;
  description?: string;
  acceptanceCriteria?: string;
  status: string;
  priority: string;
  storyPoints: number;
  assignee?: string;
  productManager?: string;
  techLead?: string;
  epicId?: string;
  sprintId?: string;
  labels?: string[];
  feature?: string;
  value?: string;
  requirement?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface StoryDetailSheetProps {
  storyId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'done': return 'bg-green-100 text-green-700 border-green-200';
    case 'in-progress': return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'review': return 'bg-purple-100 text-purple-700 border-purple-200';
    case 'sprint': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
    default: return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority?.toLowerCase()) {
    case 'high': return 'bg-red-100 text-red-700 border-red-200';
    case 'medium': return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'low': return 'bg-blue-100 text-blue-700 border-blue-200';
    default: return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

export function StoryDetailSheet({ storyId, open, onOpenChange }: StoryDetailSheetProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editedStory, setEditedStory] = useState<Partial<Story>>({});

  // Fetch story details
  const { data: story, isLoading } = useQuery<Story>({
    queryKey: [`/api/user-stories/${storyId}`],
    enabled: !!storyId && open,
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (updates: Partial<Story>) => {
      const response = await apiRequest('PATCH', `/api/user-stories/${storyId}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user-stories'] });
      queryClient.invalidateQueries({ queryKey: [`/api/user-stories/${storyId}`] });
      setIsEditing(false);
      toast({ title: "Story updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update story", variant: "destructive" });
    }
  });

  // Reset edit state when story changes
  useEffect(() => {
    if (story) {
      setEditedStory(story);
    }
  }, [story]);

  const handleSave = () => {
    updateMutation.mutate(editedStory);
  };

  const handleCancel = () => {
    setEditedStory(story || {});
    setIsEditing(false);
  };

  if (!storyId) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-pulse text-muted-foreground">Loading story...</div>
          </div>
        ) : story ? (
          <>
            <SheetHeader className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <SheetDescription className="text-xs font-mono">
                    {story.id}
                  </SheetDescription>
                  <SheetTitle className="text-xl pr-8">
                    {isEditing ? (
                      <Input
                        value={editedStory.title || ''}
                        onChange={(e) => setEditedStory({ ...editedStory, title: e.target.value })}
                        className="text-xl font-semibold"
                      />
                    ) : (
                      story.title
                    )}
                  </SheetTitle>
                </div>
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <>
                      <Button size="sm" variant="ghost" onClick={handleCancel}>
                        <X className="w-4 h-4 mr-1" />
                        Cancel
                      </Button>
                      <Button size="sm" onClick={handleSave} disabled={updateMutation.isPending}>
                        <Save className="w-4 h-4 mr-1" />
                        Save
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                      <Edit2 className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  )}
                </div>
              </div>

              {/* Status & Priority Badges */}
              <div className="flex items-center gap-2 flex-wrap">
                {isEditing ? (
                  <>
                    <Select 
                      value={editedStory.status} 
                      onValueChange={(v) => setEditedStory({ ...editedStory, status: v })}
                    >
                      <SelectTrigger className="w-32 h-8">
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
                    <Select 
                      value={editedStory.priority} 
                      onValueChange={(v) => setEditedStory({ ...editedStory, priority: v })}
                    >
                      <SelectTrigger className="w-28 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </>
                ) : (
                  <>
                    <Badge variant="outline" className={cn("", getStatusColor(story.status))}>
                      {story.status === 'done' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                      {story.status === 'in-progress' && <Clock className="w-3 h-3 mr-1" />}
                      {story.status}
                    </Badge>
                    <Badge variant="outline" className={cn("", getPriorityColor(story.priority))}>
                      {story.priority === 'high' && <AlertCircle className="w-3 h-3 mr-1" />}
                      {story.priority}
                    </Badge>
                  </>
                )}
                <Badge variant="secondary">{story.storyPoints} pts</Badge>
                <CodeChangesBadge entityType="user_story" entityId={story.id} />
              </div>
            </SheetHeader>

            <Tabs defaultValue="details" className="mt-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="criteria">Acceptance</TabsTrigger>
                <TabsTrigger value="team">Team</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4 mt-4">
                {/* Description */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Description
                  </Label>
                  {isEditing ? (
                    <Textarea
                      value={editedStory.description || ''}
                      onChange={(e) => setEditedStory({ ...editedStory, description: e.target.value })}
                      rows={4}
                      placeholder="Describe the story..."
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg text-sm">
                      {story.description || <span className="text-muted-foreground italic">No description</span>}
                    </div>
                  )}
                </div>

                {/* Feature / Value / Requirement */}
                <div className="grid grid-cols-1 gap-4">
                  {(story.feature || isEditing) && (
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Feature</Label>
                      {isEditing ? (
                        <Input
                          value={editedStory.feature || ''}
                          onChange={(e) => setEditedStory({ ...editedStory, feature: e.target.value })}
                          placeholder="What functionality?"
                        />
                      ) : (
                        <p className="text-sm">{story.feature}</p>
                      )}
                    </div>
                  )}
                  {(story.value || isEditing) && (
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Value</Label>
                      {isEditing ? (
                        <Input
                          value={editedStory.value || ''}
                          onChange={(e) => setEditedStory({ ...editedStory, value: e.target.value })}
                          placeholder="What benefit?"
                        />
                      ) : (
                        <p className="text-sm">{story.value}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Points (editable) */}
                {isEditing && (
                  <div className="space-y-2">
                    <Label>Story Points</Label>
                    <Select 
                      value={String(editedStory.storyPoints)} 
                      onValueChange={(v) => setEditedStory({ ...editedStory, storyPoints: parseInt(v) })}
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 5, 8, 13, 21].map(n => (
                          <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="criteria" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Acceptance Criteria (Gherkin)
                  </Label>
                  {isEditing ? (
                    <Textarea
                      value={editedStory.acceptanceCriteria || ''}
                      onChange={(e) => setEditedStory({ ...editedStory, acceptanceCriteria: e.target.value })}
                      rows={12}
                      className="font-mono text-sm"
                      placeholder="Given...&#10;When...&#10;Then..."
                    />
                  ) : (
                    <pre className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-sm font-mono whitespace-pre-wrap overflow-x-auto">
                      {story.acceptanceCriteria || <span className="text-muted-foreground italic">No acceptance criteria</span>}
                    </pre>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="team" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Assignee (Developer)
                    </Label>
                    {isEditing ? (
                      <Input
                        value={editedStory.assignee || ''}
                        onChange={(e) => setEditedStory({ ...editedStory, assignee: e.target.value })}
                        placeholder="Developer name"
                      />
                    ) : (
                      <p className="text-sm">{story.assignee || <span className="text-muted-foreground">Unassigned</span>}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Product Manager</Label>
                    {isEditing ? (
                      <Input
                        value={editedStory.productManager || ''}
                        onChange={(e) => setEditedStory({ ...editedStory, productManager: e.target.value })}
                        placeholder="PM name"
                      />
                    ) : (
                      <p className="text-sm">{story.productManager || <span className="text-muted-foreground">Not assigned</span>}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Tech Lead</Label>
                    {isEditing ? (
                      <Input
                        value={editedStory.techLead || ''}
                        onChange={(e) => setEditedStory({ ...editedStory, techLead: e.target.value })}
                        placeholder="Tech lead name"
                      />
                    ) : (
                      <p className="text-sm">{story.techLead || <span className="text-muted-foreground">Not assigned</span>}</p>
                    )}
                  </div>
                </div>

                {/* Metadata */}
                <div className="pt-4 border-t text-xs text-muted-foreground space-y-1">
                  {story.createdAt && (
                    <p>Created: {new Date(story.createdAt).toLocaleDateString()}</p>
                  )}
                  {story.updatedAt && (
                    <p>Updated: {new Date(story.updatedAt).toLocaleDateString()}</p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Story not found</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

