import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocation } from 'wouter';
import { AppLayout } from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  FileText,
  ArrowUpDown,
  Calendar
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
  rootCause: string | null;
  resolution: string | null;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
}

interface UserStory {
  id: string;
  title: string;
}

export default function QualityDefectsPage() {
  const [location, navigate] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1]);
  const storyIdFilter = searchParams.get('storyId');

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'createdAt' | 'severity' | 'updatedAt'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Fetch all defects
  const { data: defectsResponse, isLoading } = useQuery<{data: Defect[]}>({
    queryKey: ['/api/defects'],
    queryFn: async () => {
      const response = await fetch('/api/defects');
      if (!response.ok) throw new Error('Failed to fetch defects');
      return response.json();
    },
  });

  const defects = defectsResponse?.data || [];

  // Fetch user stories for reference
  const { data: storiesResponse } = useQuery<{items: UserStory[]}>({
    queryKey: ['/api/user-stories'],
    queryFn: async () => {
      const response = await fetch('/api/user-stories');
      if (!response.ok) throw new Error('Failed to fetch user stories');
      return response.json();
    },
  });

  const stories = storiesResponse?.items || [];

  // Filter and sort defects
  const filteredDefects = defects
    .filter(defect => {
      // Search filter
      if (searchQuery && !defect.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !defect.description.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      // Story filter
      if (storyIdFilter && defect.userStoryId !== storyIdFilter) {
        return false;
      }
      // Status filter
      if (statusFilter !== 'all' && defect.status !== statusFilter) {
        return false;
      }
      // Severity filter
      if (severityFilter !== 'all' && defect.severity !== severityFilter) {
        return false;
      }
      // Type filter
      if (typeFilter !== 'all' && defect.type !== typeFilter) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'severity') {
        const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        comparison = severityOrder[a.severity] - severityOrder[b.severity];
      } else if (sortBy === 'createdAt') {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortBy === 'updatedAt') {
        comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const getSeverityBadge = (severity: Defect['severity']) => {
    const variants = {
      critical: { variant: 'destructive' as const, color: 'bg-red-600' },
      high: { variant: 'destructive' as const, color: 'bg-orange-600' },
      medium: { variant: 'default' as const, color: 'bg-yellow-600' },
      low: { variant: 'secondary' as const, color: 'bg-gray-500' },
    };
    return <Badge variant={variants[severity].variant}>{severity.toUpperCase()}</Badge>;
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

  const exportToCSV = () => {
    const headers = ['ID', 'Title', 'Status', 'Severity', 'Type', 'Story ID', 'Discovered By', 'Assigned To', 'Created At'];
    const rows = filteredDefects.map(d => [
      d.id,
      d.title,
      d.status,
      d.severity,
      d.type,
      d.userStoryId,
      d.discoveredBy || '',
      d.assignedTo || '',
      format(new Date(d.createdAt), 'yyyy-MM-dd HH:mm')
    ]);
    
    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `defects-export-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  const openDefects = filteredDefects.filter(d => d.status === 'open' || d.status === 'in-progress');
  const resolvedDefects = filteredDefects.filter(d => d.status === 'resolved' || d.status === 'closed');

  return (
    <AppLayout>
      <div className="flex flex-col h-screen">
        <div className="flex-1 overflow-auto">
          <div className="container mx-auto py-8 px-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-amber-100 dark:bg-amber-950/30">
                  <Bug className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">Quality Command Center</h1>
                  <p className="text-sm text-muted-foreground">Defect tracking, triage, and resolution management</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={exportToCSV}>
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
                <Button onClick={() => navigate('/defects/new')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Defect
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Defects</p>
                    <p className="text-2xl font-bold">{defects.length}</p>
                  </div>
                  <Bug className="w-8 h-8 text-gray-400" />
                </div>
              </Card>
              <Card className="p-4 border-red-200 bg-red-50 dark:bg-red-950/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-red-700 dark:text-red-400">Open</p>
                    <p className="text-2xl font-bold text-red-900 dark:text-red-300">{openDefects.length}</p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
              </Card>
              <Card className="p-4 border-amber-200 bg-amber-50 dark:bg-amber-950/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-amber-700 dark:text-amber-400">Critical/High</p>
                    <p className="text-2xl font-bold text-amber-900 dark:text-amber-300">
                      {defects.filter(d => d.severity === 'critical' || d.severity === 'high').length}
                    </p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-amber-500" />
                </div>
              </Card>
              <Card className="p-4 border-green-200 bg-green-50 dark:bg-green-950/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-700 dark:text-green-400">Resolved</p>
                    <p className="text-2xl font-bold text-green-900 dark:text-green-300">{resolvedDefects.length}</p>
                  </div>
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
              </Card>
            </div>

            {/* Filters */}
            <Card className="p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search defects..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={severityFilter} onValueChange={setSeverityFilter}>
                  <SelectTrigger>
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
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="bug">Bug</SelectItem>
                    <SelectItem value="regression">Regression</SelectItem>
                    <SelectItem value="performance">Performance</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                    <SelectItem value="usability">Usability</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt">Created Date</SelectItem>
                    <SelectItem value="updatedAt">Updated Date</SelectItem>
                    <SelectItem value="severity">Severity</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                >
                  <ArrowUpDown className="w-4 h-4 mr-2" />
                  {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                </Button>
                {(searchQuery || statusFilter !== 'all' || severityFilter !== 'all' || typeFilter !== 'all') && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('all');
                      setSeverityFilter('all');
                      setTypeFilter('all');
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </Card>

            {/* Defects List */}
            {isLoading ? (
              <div className="text-center py-12">
                <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-spin" />
                <p className="text-muted-foreground">Loading defects...</p>
              </div>
            ) : filteredDefects.length === 0 ? (
              <Card className="p-12 text-center">
                <Bug className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No defects found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery || statusFilter !== 'all' || severityFilter !== 'all' || typeFilter !== 'all'
                    ? 'Try adjusting your filters'
                    : 'Create your first defect to start tracking issues'}
                </p>
              </Card>
            ) : (
              <div className="space-y-3">
                {filteredDefects.map((defect) => {
                  const story = stories.find(s => s.id === defect.userStoryId);
                  return (
                    <Link key={defect.id} href={`/defects/${defect.id}`}>
                      <Card className="p-4 hover:border-orange-300 dark:hover:border-orange-700 transition-colors cursor-pointer">
                        <div className="flex items-start gap-4">
                          <div className="mt-1">
                            {getStatusIcon(defect.status)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 mb-2">
                              <div className="flex-1">
                                <h3 className="font-semibold text-lg mb-1">{defect.title}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-2">{defect.description}</p>
                              </div>
                              <div className="flex flex-col gap-2 items-end">
                                {getSeverityBadge(defect.severity)}
                                <Badge variant="outline" className="text-xs">{defect.type}</Badge>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <FileText className="w-3 h-3" />
                                {defect.id}
                              </span>
                              {story && (
                                <span className="flex items-center gap-1">
                                  Story: {story.id}
                                </span>
                              )}
                              {defect.assignedTo && (
                                <span>Assigned: {defect.assignedTo}</span>
                              )}
                              {defect.discoveredBy && (
                                <span>Reported: {defect.discoveredBy}</span>
                              )}
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {format(new Date(defect.createdAt), 'MMM d, yyyy')}
                              </span>
                              <Badge variant="secondary" className="text-xs">
                                {defect.status.replace('-', ' ').toUpperCase()}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

