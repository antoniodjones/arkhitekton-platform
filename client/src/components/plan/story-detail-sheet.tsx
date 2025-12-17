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
  AlertCircle,
  Link2,
  Image,
  Trash2,
  Plus,
  Printer,
  AlertTriangle,
  CheckCheck,
  Bug
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { CodeChangesBadge } from '@/components/code-changes/code-changes-badge';

interface Epic {
  id: string;
  title: string;
}

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
  githubRepo?: string;
  githubBranch?: string;
  screenshots?: string[];
  // Enhancement Story Metadata
  enhances?: string[];
  enhancementType?: string;
  rationale?: string;
  // Planning Date Fields
  targetDate?: string;
  startedAt?: string;
  completedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Enhancement type options
const ENHANCEMENT_TYPES = [
  { value: 'feature-evolution', label: 'Feature Evolution' },
  { value: 'bug-fix', label: 'Bug Fix' },
  { value: 'ux-improvement', label: 'UX Improvement' },
  { value: 'performance', label: 'Performance' },
  { value: 'refactoring', label: 'Refactoring' },
  { value: 'security', label: 'Security' },
  { value: 'accessibility', label: 'Accessibility' },
  { value: 'technical-debt', label: 'Technical Debt' },
];

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

// Gherkin validation helper
function validateGherkinFormat(text: string): { isValid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  if (!text || text.trim().length === 0) {
    return { isValid: true, errors: [], warnings: [] };
  }
  
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const keywords = ['Given', 'When', 'Then', 'And', 'But', 'Scenario', 'Feature', 'Background', 'Example', 'Examples'];
  
  let hasGiven = false, hasWhen = false, hasThen = false;
  
  for (const line of lines) {
    if (line.startsWith('Given')) hasGiven = true;
    if (line.startsWith('When')) hasWhen = true;
    if (line.startsWith('Then')) hasThen = true;
  }
  
  if (!hasGiven && !hasWhen && !hasThen) {
    warnings.push('Consider using Gherkin keywords: Given, When, Then');
  } else {
    if (!hasGiven) warnings.push('Missing "Given" step');
    if (!hasWhen) warnings.push('Missing "When" step');
    if (!hasThen) warnings.push('Missing "Then" step');
  }
  
  return { isValid: errors.length === 0, errors, warnings };
}

export function StoryDetailSheet({ storyId, open, onOpenChange }: StoryDetailSheetProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editedStory, setEditedStory] = useState<Partial<Story>>({});
  const [newLabel, setNewLabel] = useState('');
  const [isReportBugOpen, setIsReportBugOpen] = useState(false);
  const [newDefect, setNewDefect] = useState({ title: '', description: '', severity: 'medium' as const });
  const [enhancesSearch, setEnhancesSearch] = useState('');
  const [isEnhancesOpen, setIsEnhancesOpen] = useState(false);

  // Fetch story details
  const { data: story, isLoading } = useQuery<Story>({
    queryKey: [`/api/user-stories/${storyId}`],
    enabled: !!storyId && open,
  });

  // Fetch epics for dropdown
  const { data: epicsResponse } = useQuery<{ data: Epic[], total: number }>({
    queryKey: ['/api/epics'],
  });
  const epics = epicsResponse?.data || [];

  // Fetch all stories for Enhances dropdown
  const { data: allStoriesResponse } = useQuery<{ items: { id: string; title: string }[] }>({
    queryKey: ['/api/user-stories', { pageSize: 200 }],
    queryFn: async () => {
      const response = await fetch('/api/user-stories?pageSize=200');
      return response.json();
    },
  });
  const allStories = allStoriesResponse?.items || [];

  // Filter stories for search
  const filteredStories = allStories.filter(s => 
    s.id !== storyId && // Exclude current story
    (s.id.toLowerCase().includes(enhancesSearch.toLowerCase()) ||
     s.title.toLowerCase().includes(enhancesSearch.toLowerCase()))
  ).slice(0, 10);

  // Gherkin validation
  const gherkinValidation = editedStory.acceptanceCriteria 
    ? validateGherkinFormat(editedStory.acceptanceCriteria)
    : { isValid: true, errors: [], warnings: [] };

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

  // Create defect mutation
  const createDefectMutation = useMutation({
    mutationFn: async (data: { title: string; description: string; severity: string; userStoryId: string }) => {
      const response = await apiRequest('POST', '/api/defects', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/defects'] });
      setIsReportBugOpen(false);
      setNewDefect({ title: '', description: '', severity: 'medium' });
      toast({ 
        title: "Defect reported successfully",
        description: "View it in the Quality Center"
      });
    },
    onError: () => {
      toast({ title: "Failed to create defect", variant: "destructive" });
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
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="criteria">Acceptance</TabsTrigger>
                <TabsTrigger value="team">Team</TabsTrigger>
                <TabsTrigger value="links">Links</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4 mt-4">
                {/* Epic Connection */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Link2 className="w-4 h-4" />
                    Connected Epic
                  </Label>
                  {isEditing ? (
                    <Select 
                      value={editedStory.epicId || 'independent'} 
                      onValueChange={(v) => setEditedStory({ ...editedStory, epicId: v === 'independent' ? undefined : v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select epic..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="independent">Independent Story</SelectItem>
                        {epics.map(epic => (
                          <SelectItem key={epic.id} value={epic.id}>{epic.title}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-sm">
                      {story.epicId 
                        ? epics.find(e => e.id === story.epicId)?.title || story.epicId
                        : <span className="text-muted-foreground italic">Independent story</span>
                      }
                    </p>
                  )}
                </div>

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
                <div className="grid grid-cols-1 gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-100 dark:border-blue-900">
                  <Label className="text-xs font-medium text-blue-700 dark:text-blue-300">Story Composition</Label>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Feature (What functionality?)</Label>
                      {isEditing ? (
                        <Input
                          value={editedStory.feature || ''}
                          onChange={(e) => setEditedStory({ ...editedStory, feature: e.target.value })}
                          placeholder="e.g., drag-and-drop interface, AI suggestions"
                        />
                      ) : (
                        <p className="text-sm">{story.feature || <span className="text-muted-foreground italic">—</span>}</p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Value (What benefit?)</Label>
                      {isEditing ? (
                        <Input
                          value={editedStory.value || ''}
                          onChange={(e) => setEditedStory({ ...editedStory, value: e.target.value })}
                          placeholder="e.g., save time, improve accuracy"
                        />
                      ) : (
                        <p className="text-sm">{story.value || <span className="text-muted-foreground italic">—</span>}</p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Requirement (What specific need?)</Label>
                      {isEditing ? (
                        <Input
                          value={editedStory.requirement || ''}
                          onChange={(e) => setEditedStory({ ...editedStory, requirement: e.target.value })}
                          placeholder="e.g., model complex systems, visualize data flows"
                        />
                      ) : (
                        <p className="text-sm">{story.requirement || <span className="text-muted-foreground italic">—</span>}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Labels */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Labels
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {(editedStory.labels || story.labels || []).map((label, idx) => (
                      <Badge key={idx} variant="secondary" className="gap-1">
                        {label}
                        {isEditing && (
                          <button
                            onClick={() => setEditedStory({
                              ...editedStory,
                              labels: (editedStory.labels || []).filter((_, i) => i !== idx)
                            })}
                            className="ml-1 hover:text-red-500"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </Badge>
                    ))}
                    {isEditing && (
                      <div className="flex items-center gap-1">
                        <Input
                          value={newLabel}
                          onChange={(e) => setNewLabel(e.target.value)}
                          placeholder="Add label..."
                          className="h-7 w-28 text-xs"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && newLabel.trim()) {
                              setEditedStory({
                                ...editedStory,
                                labels: [...(editedStory.labels || []), newLabel.trim()]
                              });
                              setNewLabel('');
                            }
                          }}
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0"
                          onClick={() => {
                            if (newLabel.trim()) {
                              setEditedStory({
                                ...editedStory,
                                labels: [...(editedStory.labels || []), newLabel.trim()]
                              });
                              setNewLabel('');
                            }
                          }}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                    {!isEditing && (!story.labels || story.labels.length === 0) && (
                      <span className="text-sm text-muted-foreground italic">No labels</span>
                    )}
                  </div>
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

                {/* Enhancement Story Metadata */}
                <div className="space-y-4 p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-100 dark:border-purple-900">
                  <Label className="text-xs font-medium text-purple-700 dark:text-purple-300 flex items-center gap-2">
                    <Link2 className="w-3 h-3" />
                    Enhancement Traceability
                  </Label>
                  
                  {/* Enhances Field - Searchable Multi-select */}
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Enhances (linked stories)</Label>
                    <div className="space-y-2">
                      {/* Selected stories as badges */}
                      <div className="flex flex-wrap gap-1">
                        {(editedStory.enhances || story.enhances || []).map((storyId, idx) => {
                          const linkedStory = allStories.find(s => s.id === storyId);
                          return (
                            <Badge 
                              key={idx} 
                              variant="outline" 
                              className="gap-1 bg-purple-100 dark:bg-purple-900/30 border-purple-300 text-purple-700 dark:text-purple-300"
                            >
                              {storyId}
                              {linkedStory && (
                                <span className="text-xs opacity-70 max-w-24 truncate">
                                  - {linkedStory.title}
                                </span>
                              )}
                              {isEditing && (
                                <button
                                  onClick={() => setEditedStory({
                                    ...editedStory,
                                    enhances: (editedStory.enhances || []).filter((_, i) => i !== idx)
                                  })}
                                  className="ml-1 hover:text-red-500"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              )}
                            </Badge>
                          );
                        })}
                        {!isEditing && (!story.enhances || story.enhances.length === 0) && (
                          <span className="text-xs text-muted-foreground italic">No linked stories</span>
                        )}
                      </div>

                      {/* Search and add stories */}
                      {isEditing && (
                        <Popover open={isEnhancesOpen} onOpenChange={setIsEnhancesOpen}>
                          <PopoverTrigger asChild>
                            <Button variant="outline" size="sm" className="w-full justify-start">
                              <Plus className="w-3 h-3 mr-2" />
                              Add linked story...
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80 p-0" align="start">
                            <Command>
                              <CommandInput 
                                placeholder="Search stories..." 
                                value={enhancesSearch}
                                onValueChange={setEnhancesSearch}
                              />
                              <CommandList>
                                <CommandEmpty>No stories found</CommandEmpty>
                                <CommandGroup>
                                  {filteredStories.map(s => (
                                    <CommandItem
                                      key={s.id}
                                      value={s.id}
                                      onSelect={() => {
                                        if (!(editedStory.enhances || []).includes(s.id)) {
                                          setEditedStory({
                                            ...editedStory,
                                            enhances: [...(editedStory.enhances || []), s.id]
                                          });
                                        }
                                        setIsEnhancesOpen(false);
                                        setEnhancesSearch('');
                                      }}
                                    >
                                      <span className="font-mono text-xs mr-2">{s.id}</span>
                                      <span className="truncate text-sm">{s.title}</span>
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      )}
                    </div>
                  </div>

                  {/* Enhancement Type Dropdown */}
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Enhancement Type</Label>
                    {isEditing ? (
                      <Select 
                        value={editedStory.enhancementType || ''} 
                        onValueChange={(v) => setEditedStory({ ...editedStory, enhancementType: v })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type..." />
                        </SelectTrigger>
                        <SelectContent>
                          {ENHANCEMENT_TYPES.map(type => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-sm">
                        {story.enhancementType 
                          ? ENHANCEMENT_TYPES.find(t => t.value === story.enhancementType)?.label || story.enhancementType
                          : <span className="text-muted-foreground italic">Not specified</span>
                        }
                      </p>
                    )}
                  </div>

                  {/* Rationale Text Area */}
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Rationale</Label>
                    {isEditing ? (
                      <Textarea
                        value={editedStory.rationale || ''}
                        onChange={(e) => setEditedStory({ ...editedStory, rationale: e.target.value })}
                        rows={3}
                        placeholder="Why is this enhancement needed? What business value does it provide?"
                        className="text-sm"
                      />
                    ) : (
                      <p className="text-sm p-2 bg-white dark:bg-gray-800 rounded border">
                        {story.rationale || <span className="text-muted-foreground italic">No rationale provided</span>}
                      </p>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="criteria" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Acceptance Criteria (Gherkin)
                  </Label>
                  {isEditing ? (
                    <>
                      <Textarea
                        value={editedStory.acceptanceCriteria || ''}
                        onChange={(e) => setEditedStory({ ...editedStory, acceptanceCriteria: e.target.value })}
                        rows={12}
                        className="font-mono text-sm"
                        placeholder="Given...&#10;When...&#10;Then..."
                      />
                      {/* Gherkin Validation */}
                      {editedStory.acceptanceCriteria && editedStory.acceptanceCriteria.trim().length > 0 && (
                        <div className="space-y-1">
                          {gherkinValidation.errors.length > 0 && (
                            <div className="flex items-start gap-2 p-2 bg-red-50 dark:bg-red-950/20 rounded text-xs text-red-600">
                              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                              <div>{gherkinValidation.errors.join(', ')}</div>
                            </div>
                          )}
                          {gherkinValidation.warnings.length > 0 && (
                            <div className="flex items-start gap-2 p-2 bg-amber-50 dark:bg-amber-950/20 rounded text-xs text-amber-600">
                              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                              <div>{gherkinValidation.warnings.join(', ')}</div>
                            </div>
                          )}
                          {gherkinValidation.isValid && gherkinValidation.warnings.length === 0 && (
                            <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-950/20 rounded text-xs text-green-600">
                              <CheckCheck className="w-4 h-4" />
                              Valid Gherkin format
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  ) : (
                    <pre className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-sm font-mono whitespace-pre-wrap overflow-x-auto max-h-96 overflow-y-auto">
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

                {/* Planning Dates */}
                <div className="space-y-4 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-100 dark:border-green-900">
                  <Label className="text-xs font-medium text-green-700 dark:text-green-300 flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    Planning Timeline
                  </Label>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Target Date</Label>
                      {isEditing ? (
                        <Input
                          type="date"
                          value={editedStory.targetDate ? new Date(editedStory.targetDate).toISOString().split('T')[0] : ''}
                          onChange={(e) => setEditedStory({ 
                            ...editedStory, 
                            targetDate: e.target.value ? new Date(e.target.value).toISOString() : undefined 
                          })}
                          className="text-sm"
                        />
                      ) : (
                        <p className="text-sm">
                          {story.targetDate 
                            ? new Date(story.targetDate).toLocaleDateString()
                            : <span className="text-muted-foreground italic">Not set</span>
                          }
                        </p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Started</Label>
                      {isEditing ? (
                        <Input
                          type="date"
                          value={editedStory.startedAt ? new Date(editedStory.startedAt).toISOString().split('T')[0] : ''}
                          onChange={(e) => setEditedStory({ 
                            ...editedStory, 
                            startedAt: e.target.value ? new Date(e.target.value).toISOString() : undefined 
                          })}
                          className="text-sm"
                        />
                      ) : (
                        <p className="text-sm">
                          {story.startedAt 
                            ? new Date(story.startedAt).toLocaleDateString()
                            : <span className="text-muted-foreground italic">Not started</span>
                          }
                        </p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Completed</Label>
                      {isEditing ? (
                        <Input
                          type="date"
                          value={editedStory.completedAt ? new Date(editedStory.completedAt).toISOString().split('T')[0] : ''}
                          onChange={(e) => setEditedStory({ 
                            ...editedStory, 
                            completedAt: e.target.value ? new Date(e.target.value).toISOString() : undefined 
                          })}
                          className="text-sm"
                        />
                      ) : (
                        <p className="text-sm">
                          {story.completedAt 
                            ? new Date(story.completedAt).toLocaleDateString()
                            : <span className="text-muted-foreground italic">Not completed</span>
                          }
                        </p>
                      )}
                    </div>
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

              <TabsContent value="links" className="space-y-4 mt-4">
                {/* GitHub Integration */}
                <div className="space-y-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <GitBranch className="w-4 h-4" />
                    GitHub Integration
                  </Label>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Repository</Label>
                      {isEditing ? (
                        <Input
                          value={editedStory.githubRepo || ''}
                          onChange={(e) => setEditedStory({ ...editedStory, githubRepo: e.target.value })}
                          placeholder="owner/repo"
                        />
                      ) : (
                        <p className="text-sm font-mono">
                          {story.githubRepo ? (
                            <a 
                              href={`https://github.com/${story.githubRepo}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {story.githubRepo}
                            </a>
                          ) : (
                            <span className="text-muted-foreground italic">Not linked</span>
                          )}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Branch</Label>
                      {isEditing ? (
                        <Input
                          value={editedStory.githubBranch || ''}
                          onChange={(e) => setEditedStory({ ...editedStory, githubBranch: e.target.value })}
                          placeholder="feature/story-123"
                        />
                      ) : (
                        <p className="text-sm font-mono">
                          {story.githubBranch ? (
                            <a 
                              href={`https://github.com/${story.githubRepo}/tree/${story.githubBranch}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {story.githubBranch}
                            </a>
                          ) : (
                            <span className="text-muted-foreground italic">No branch</span>
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Code Changes (Auto-linked PRs/Commits) */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <GitBranch className="w-4 h-4" />
                    Linked Code Changes
                  </Label>
                  <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <CodeChangesBadge entityType="user_story" entityId={story.id} showDetails />
                  </div>
                </div>

                {/* Screenshots */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Image className="w-4 h-4" />
                    Screenshots
                  </Label>
                  {story.screenshots && story.screenshots.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                      {story.screenshots.map((screenshot, idx) => (
                        <div key={idx} className="relative group">
                          <img 
                            src={screenshot} 
                            alt={`Screenshot ${idx + 1}`}
                            className="rounded border w-full h-32 object-cover"
                          />
                          {isEditing && (
                            <button
                              onClick={() => setEditedStory({
                                ...editedStory,
                                screenshots: (editedStory.screenshots || []).filter((_, i) => i !== idx)
                              })}
                              className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      No screenshots attached
                    </p>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="pt-4 border-t space-y-2">
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => setIsReportBugOpen(true)}
                    className="w-full"
                  >
                    <Bug className="w-4 h-4 mr-2" />
                    Report Bug
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.print()}
                    className="w-full"
                  >
                    <Printer className="w-4 h-4 mr-2" />
                    Print Story Card
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            {/* Report Bug Dialog */}
            <Dialog open={isReportBugOpen} onOpenChange={setIsReportBugOpen}>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Bug className="w-5 h-5 text-red-500" />
                    Report Bug for {story.id}
                  </DialogTitle>
                  <DialogDescription>
                    Create a defect linked to this user story. It will appear in the Quality Center.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="bug-title">Title *</Label>
                    <Input
                      id="bug-title"
                      value={newDefect.title}
                      onChange={(e) => setNewDefect({ ...newDefect, title: e.target.value })}
                      placeholder="Brief description of the bug"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bug-description">Description</Label>
                    <Textarea
                      id="bug-description"
                      value={newDefect.description}
                      onChange={(e) => setNewDefect({ ...newDefect, description: e.target.value })}
                      placeholder="Steps to reproduce, expected vs actual behavior..."
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Severity</Label>
                    <Select 
                      value={newDefect.severity} 
                      onValueChange={(v: any) => setNewDefect({ ...newDefect, severity: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="critical">Critical - System down</SelectItem>
                        <SelectItem value="high">High - Major feature broken</SelectItem>
                        <SelectItem value="medium">Medium - Feature impaired</SelectItem>
                        <SelectItem value="low">Low - Minor issue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm">
                    <span className="text-muted-foreground">Linked to:</span>
                    <span className="ml-2 font-mono">{story.id}</span>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsReportBugOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    variant="destructive"
                    onClick={() => createDefectMutation.mutate({
                      ...newDefect,
                      userStoryId: story.id
                    })}
                    disabled={!newDefect.title || createDefectMutation.isPending}
                  >
                    {createDefectMutation.isPending ? 'Creating...' : 'Report Bug'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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

