import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Bug, CheckCircle2, Clock, Plus, X, XCircle, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'wouter';
import { CodeChangesBadge } from '@/components/code-changes/code-changes-badge';

interface Defect {
  id: string;
  userStoryId: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  type: 'bug' | 'regression' | 'performance' | 'security' | 'usability';
  status: 'open' | 'in-progress' | 'resolved' | 'closed' | 'rejected';
  discoveredBy: string | null;
  assignedTo: string | null;
  rootCause: string | null;
  resolution: string | null;
  createdAt: string;
  resolvedAt: string | null;
}

interface DefectManagementProps {
  userStoryId: string;
  userStoryTitle: string;
}

export function DefectManagement({ userStoryId, userStoryTitle }: DefectManagementProps) {
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newDefect, setNewDefect] = useState({
    title: '',
    description: '',
    severity: 'medium' as Defect['severity'],
    type: 'bug' as Defect['type'],
    discoveredBy: '',
  });

  // Fetch defects for this story
  const { data: defects, isLoading } = useQuery<Defect[]>({
    queryKey: ['/api/user-stories', userStoryId, 'defects'],
    queryFn: async () => {
      const response = await fetch(`/api/user-stories/${userStoryId}/defects`);
      if (!response.ok) throw new Error('Failed to fetch defects');
      return response.json();
    },
  });

  // Create defect mutation
  const createDefectMutation = useMutation({
    mutationFn: async (defectData: typeof newDefect) => {
      return apiRequest('POST', '/api/defects', {
        ...defectData,
        userStoryId,
        status: 'open',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user-stories', userStoryId, 'defects'] });
      toast({
        title: 'Defect created',
        description: 'The defect has been logged successfully.',
      });
      setIsCreateDialogOpen(false);
        setNewDefect({
          title: '',
          description: '',
          severity: 'medium',
          type: 'bug',
          discoveredBy: '',
        });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to create defect. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Update defect status mutation
  const updateDefectMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Defect['status'] }) => {
      return apiRequest('PATCH', `/api/defects/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user-stories', userStoryId, 'defects'] });
      toast({
        title: 'Defect updated',
        description: 'The defect status has been updated.',
      });
    },
  });

  // Resolve defect mutation
  const resolveDefectMutation = useMutation({
    mutationFn: async ({ id, rootCause, resolution }: { id: string; rootCause: string; resolution: string }) => {
      return apiRequest('POST', `/api/defects/${id}/resolve`, { rootCause, resolution });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user-stories', userStoryId, 'defects'] });
      toast({
        title: 'Defect resolved',
        description: 'The defect has been marked as resolved.',
      });
    },
  });

  const getSeverityBadge = (severity: Defect['severity']) => {
    const variants = {
      critical: 'destructive',
      high: 'destructive',
      medium: 'default',
      low: 'secondary',
    };
    return <Badge variant={variants[severity] as any}>{severity}</Badge>;
  };

  const getStatusIcon = (status: Defect['status']) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-amber-500" />;
      case 'resolved':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'closed':
        return <CheckCircle2 className="w-4 h-4 text-gray-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const handleCreateDefect = () => {
    if (!newDefect.title || !newDefect.description) {
      toast({
        title: 'Validation error',
        description: 'Title and description are required.',
        variant: 'destructive',
      });
      return;
    }
    createDefectMutation.mutate(newDefect);
  };

  const openDefects = defects?.filter(d => d.status === 'open' || d.status === 'in-progress') || [];
  const resolvedDefects = defects?.filter(d => d.status === 'resolved' || d.status === 'closed' || d.status === 'rejected') || [];

  return (
    <div className="space-y-4 border rounded-lg p-4 bg-amber-50 dark:bg-amber-950/10">
      <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
              <Bug className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <h4 className="font-semibold text-amber-900 dark:text-amber-100">Defects & Issues</h4>
              {openDefects.length > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {openDefects.length} Open
                </Badge>
              )}
            </div>
            <div className="flex gap-2">
              <Link href="/defects">
                <Button size="sm" variant="ghost" data-testid="button-view-all-defects">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Quality Center
                </Button>
              </Link>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="default" data-testid="button-create-defect" className="bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Log Defect
                  </Button>
                </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Log New Defect</DialogTitle>
              <p className="text-sm text-muted-foreground">
                Story: {userStoryTitle}
              </p>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="defect-title">Defect Title</Label>
                <Input
                  id="defect-title"
                  value={newDefect.title}
                  onChange={(e) => setNewDefect({ ...newDefect, title: e.target.value })}
                  placeholder="Brief description of the defect"
                  data-testid="input-defect-title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="defect-description">Description & Reproduction Steps</Label>
                <Textarea
                  id="defect-description"
                  value={newDefect.description}
                  onChange={(e) => setNewDefect({ ...newDefect, description: e.target.value })}
                  placeholder="Detailed description, steps to reproduce, expected vs actual results..."
                  rows={5}
                  data-testid="textarea-defect-description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="defect-severity">Severity</Label>
                  <Select value={newDefect.severity} onValueChange={(value) => setNewDefect({ ...newDefect, severity: value as Defect['severity'] })}>
                    <SelectTrigger data-testid="select-defect-severity">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical - System Down</SelectItem>
                      <SelectItem value="high">High - Major Feature Broken</SelectItem>
                      <SelectItem value="medium">Medium - Feature Impaired</SelectItem>
                      <SelectItem value="low">Low - Minor Issue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="defect-type">Type</Label>
                  <Select value={newDefect.type} onValueChange={(value) => setNewDefect({ ...newDefect, type: value as Defect['type'] })}>
                    <SelectTrigger data-testid="select-defect-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bug">Bug</SelectItem>
                      <SelectItem value="regression">Regression</SelectItem>
                      <SelectItem value="performance">Performance</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                      <SelectItem value="usability">Usability</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

                  <div className="space-y-2">
                    <Label htmlFor="defect-discovered-by">Discovered By</Label>
                    <Input
                      id="defect-discovered-by"
                      value={newDefect.discoveredBy}
                      onChange={(e) => setNewDefect({ ...newDefect, discoveredBy: e.target.value })}
                      placeholder="Your name or email"
                      data-testid="input-defect-discovered-by"
                    />
                  </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} data-testid="button-cancel-defect">
                  Cancel
                </Button>
                <Button onClick={handleCreateDefect} disabled={createDefectMutation.isPending} data-testid="button-submit-defect">
                  {createDefectMutation.isPending ? 'Creating...' : 'Create Defect'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading defects...</p>
      ) : (
        <div className="space-y-3">
          {/* Open Defects */}
          {openDefects.length > 0 && (
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-amber-800 dark:text-amber-200">Open Defects</h5>
              {openDefects.map((defect) => (
                <div key={defect.id} className="border rounded p-3 bg-white dark:bg-gray-900" data-testid={`defect-card-${defect.id}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(defect.status)}
                        <h6 className="font-medium text-sm">{defect.title}</h6>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{defect.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            {getSeverityBadge(defect.severity)}
                            <Badge variant="outline">{defect.type}</Badge>
                            <CodeChangesBadge entityType="defect" entityId={defect.id} />
                            {defect.discoveredBy && (
                              <span className="text-xs text-muted-foreground">by {defect.discoveredBy}</span>
                            )}
                          </div>
                    </div>
                    <div className="flex gap-1">
                      <Select value={defect.status} onValueChange={(value) => updateDefectMutation.mutate({ id: defect.id, status: value as Defect['status'] })}>
                        <SelectTrigger className="h-8 text-xs w-32" data-testid={`select-defect-status-${defect.id}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="open">Open</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Resolved Defects */}
          {resolvedDefects.length > 0 && (
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-gray-600 dark:text-gray-400">Resolved Defects ({resolvedDefects.length})</h5>
              {resolvedDefects.map((defect) => (
                <div key={defect.id} className="border rounded p-3 bg-gray-50 dark:bg-gray-900/50 opacity-75" data-testid={`defect-card-${defect.id}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(defect.status)}
                        <h6 className="font-medium text-sm line-through">{defect.title}</h6>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        {getSeverityBadge(defect.severity)}
                        <Badge variant="outline">{defect.type}</Badge>
                        <Badge variant="secondary">{defect.status}</Badge>
                        <CodeChangesBadge entityType="defect" entityId={defect.id} compact />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!defects || defects.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No defects logged for this story. Quality looks good! ✨
            </p>
          )}
        </div>
      )}

      {/* Blocking Warning */}
      {openDefects.length > 0 && (
        <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded">
          <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-900 dark:text-red-100">Story Blocked</p>
            <p className="text-xs text-red-700 dark:text-red-300 mt-1">
              This story cannot be marked as "Done" or "Review" until all open defects are resolved or rejected.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Defect Badge for Story Cards - Now clickable and routes to Quality Center
export function DefectBadge({ userStoryId }: { userStoryId: string }) {
  const { data: defects } = useQuery<Defect[]>({
    queryKey: ['/api/user-stories', userStoryId, 'defects'],
    queryFn: async () => {
      const response = await fetch(`/api/user-stories/${userStoryId}/defects`);
      if (!response.ok) return [];
      return response.json();
    },
  });

  const openDefects = defects?.filter(d => d.status === 'open' || d.status === 'in-progress') || [];
  const criticalCount = openDefects.filter(d => d.severity === 'critical').length;
  const highCount = openDefects.filter(d => d.severity === 'high').length;

  if (openDefects.length === 0) return null;

  return (
    <Link href={`/defects?storyId=${userStoryId}`}>
      <Badge 
        variant="destructive" 
        className="gap-1 cursor-pointer hover:bg-red-700 transition-colors" 
        data-testid={`badge-defects-${userStoryId}`}
      >
        <Bug className="w-3 h-3" />
        {criticalCount > 0 && <span className="font-bold">{criticalCount}C</span>}
        {highCount > 0 && <span>{highCount}H</span>}
        {criticalCount === 0 && highCount === 0 && <span>{openDefects.length}</span>}
      </Badge>
    </Link>
  );
}
