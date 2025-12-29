import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useLocation } from 'wouter';
import { QualityLayout } from '@/components/quality/quality-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  Bug, 
  Search, 
  Filter, 
  Plus, 
  Download, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  XCircle,
  ArrowUpDown,
  ExternalLink
} from 'lucide-react';
import { format } from 'date-fns';

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
  createdAt: string;
  updatedAt: string;
}

interface UserStory {
  id: string;
  title: string;
}

export default function QualityDefectsPage() {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const searchParams = new URLSearchParams(location.split('?')[1]);
  const storyIdFilter = searchParams.get('storyId');
  const showCreate = searchParams.get('create') === 'true';

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [isCreateOpen, setIsCreateOpen] = useState(showCreate);
  const [newDefect, setNewDefect] = useState({
    title: '',
    description: '',
    severity: 'medium' as const,
    userStoryId: storyIdFilter || ''
  });

  // Fetch defects
  const { data: defectsResponse, isLoading } = useQuery<{ data: Defect[] }>({
    queryKey: ['/api/defects'],
    queryFn: async () => {
      const response = await fetch('/api/defects');
      if (!response.ok) throw new Error('Failed to fetch defects');
      return response.json();
    },
  });

  const defects = defectsResponse?.data || [];

  // Fetch user stories for reference
  const { data: storiesResponse } = useQuery<{ items: UserStory[] }>({
    queryKey: ['/api/user-stories'],
    queryFn: async () => {
      const response = await fetch('/api/user-stories');
      if (!response.ok) throw new Error('Failed to fetch user stories');
      return response.json();
    },
  });

  const stories = storiesResponse?.items || [];
  const storyMap = new Map(stories.map(s => [s.id, s]));

  // Create defect mutation
  const createMutation = useMutation({
    mutationFn: async (data: typeof newDefect) => {
      const response = await apiRequest('POST', '/api/defects', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/defects'] });
      setIsCreateOpen(false);
      setNewDefect({ title: '', description: '', severity: 'medium', userStoryId: '' });
      toast({ title: 'Defect created successfully' });
    },
    onError: () => {
      toast({ title: 'Failed to create defect', variant: 'destructive' });
    }
  });

  // Filter defects
  const filteredDefects = defects.filter(defect => {
    if (storyIdFilter && defect.userStoryId !== storyIdFilter) return false;
    if (searchQuery && !defect.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (statusFilter !== 'all' && defect.status !== statusFilter) return false;
    if (severityFilter !== 'all' && defect.severity !== severityFilter) return false;
    return true;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'in-progress': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'resolved': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'closed': return <CheckCircle2 className="w-4 h-4 text-gray-500" />;
      case 'rejected': return <XCircle className="w-4 h-4 text-gray-400" />;
      default: return null;
    }
  };

  return (
    <QualityLayout>
      <div className="space-y-4">
        {/* Header & Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search defects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {filteredDefects.length} defects
            </span>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Defect
            </Button>
          </div>
        </div>

        {/* Defects Table */}
        <Card className="overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase w-[140px]">Defect</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Severity</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Title</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Story</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Created</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    Loading defects...
                  </td>
                </tr>
              ) : filteredDefects.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    No defects found
                  </td>
                </tr>
              ) : (
                filteredDefects.map((defect) => (
                  <tr 
                    key={defect.id} 
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
                    onClick={() => navigate(`/quality/defects/${defect.id}`)}
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/quality/defects/${defect.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="font-mono text-sm text-blue-600 hover:text-blue-800 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        {defect.id}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(defect.status)}
                        <span className="text-sm capitalize">{defect.status}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={getSeverityColor(defect.severity)}>
                        {defect.severity}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium truncate max-w-md">{defect.title}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-mono text-muted-foreground">
                        {defect.userStoryId}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(defect.createdAt), 'MMM d, yyyy')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/quality/defects/${defect.id}`);
                        }}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Card>

        {/* Create Defect Dialog */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Bug className="w-5 h-5 text-red-500" />
                Report New Defect
              </DialogTitle>
              <DialogDescription>
                Create a new defect and link it to a user story for traceability.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="defect-title">Title *</Label>
                <Input
                  id="defect-title"
                  value={newDefect.title}
                  onChange={(e) => setNewDefect({ ...newDefect, title: e.target.value })}
                  placeholder="Brief description of the issue"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="defect-description">Description</Label>
                <Textarea
                  id="defect-description"
                  value={newDefect.description}
                  onChange={(e) => setNewDefect({ ...newDefect, description: e.target.value })}
                  placeholder="Steps to reproduce, expected vs actual behavior..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Severity *</Label>
                  <Select 
                    value={newDefect.severity} 
                    onValueChange={(v: any) => setNewDefect({ ...newDefect, severity: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Linked Story *</Label>
                  <Select 
                    value={newDefect.userStoryId} 
                    onValueChange={(v) => setNewDefect({ ...newDefect, userStoryId: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select story..." />
                    </SelectTrigger>
                    <SelectContent>
                      {stories.slice(0, 50).map(story => (
                        <SelectItem key={story.id} value={story.id}>
                          {story.id} - {story.title.substring(0, 40)}...
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={() => createMutation.mutate(newDefect)}
                disabled={!newDefect.title || !newDefect.userStoryId || createMutation.isPending}
              >
                {createMutation.isPending ? 'Creating...' : 'Create Defect'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </QualityLayout>
  );
}

