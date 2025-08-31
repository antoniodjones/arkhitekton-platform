import { useState, useEffect } from 'react';
import { useLocation, useRoute } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Building, 
  Users, 
  FileText, 
  GitBranch,
  Calendar,
  User,
  Tag,
  Link,
  History,
  Edit,
  X
} from 'lucide-react';
import { AppLayout } from '@/components/layout/app-layout';

interface TicketData {
  id: string;
  ticketNumber: string;
  type: 'architecture_review' | 'architect_request' | 'adr' | 'change_request';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical' | 'urgent';
  severity?: 'minor' | 'major' | 'critical' | 'blocker';
  status: 'open' | 'in_progress' | 'under_review' | 'approved' | 'rejected' | 'closed' | 'on_hold';
  businessJustification: string;
  technicalImpact: string;
  riskAssessment: 'low' | 'medium' | 'high' | 'critical';
  estimatedEffort: string;
  dueDate: string;
  targetResolution: string;
  assignee: string;
  reviewers: string[];
  watchers: string[];
  labels: string[];
  reporter: string;
  createdAt: string;
  updatedAt: string;
  metadata?: any;
}

function ViewTicketContent() {
  const [, navigate] = useLocation();
  const [match, params] = useRoute('/tickets/:id');
  const [ticket, setTicket] = useState<TicketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (params?.id) {
      // In a real app, this would fetch from an API
      const savedTicket = localStorage.getItem(`ticket-${params.id}`);
      if (savedTicket) {
        setTicket(JSON.parse(savedTicket));
      }
      setLoading(false);
    }
  }, [params?.id]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'architecture_review': return Building;
      case 'architect_request': return Users;
      case 'adr': return FileText;
      case 'change_request': return GitBranch;
      default: return FileText;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'architecture_review': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'architect_request': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      case 'adr': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300';
      case 'change_request': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'in_progress': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      case 'under_review': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300';
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'closed': return 'bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-300';
      case 'on_hold': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-300';
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-300">Loading ticket...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!ticket) {
    return (
      <AppLayout>
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">Ticket Not Found</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              The ticket you're looking for doesn't exist or has been deleted.
            </p>
            <Button onClick={() => navigate('/tickets')}>
              Back to Tickets
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  const TypeIcon = getTypeIcon(ticket.type);

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/tickets')}
              className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tickets
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-emerald-800 dark:from-white dark:via-slate-200 dark:to-emerald-200 bg-clip-text text-transparent">
                View Ticket
              </h1>
              <p className="text-slate-600 dark:text-slate-300 mt-2">
                Viewing ticket details in read-only mode
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={() => navigate(`/tickets/${ticket.id}/history`)}
              className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm"
            >
              <History className="h-4 w-4 mr-2" />
              View History
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate(`/tickets/${ticket.id}/edit`)}
              className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Ticket
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/tickets')}
              className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-700"
            >
              <X className="h-4 w-4 mr-2" />
              Close
            </Button>
          </div>
        </div>

        {/* Ticket Header */}
        <Card className="mb-8 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-lg flex items-center justify-center">
                  <TypeIcon className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <Badge className={getTypeColor(ticket.type)} variant="outline">
                      {ticket.type.replace('_', ' ')}
                    </Badge>
                    <Badge className={getStatusColor(ticket.status)}>
                      {ticket.status.replace('_', ' ')}
                    </Badge>
                    <span className="font-mono text-sm text-slate-600 dark:text-slate-300">
                      {ticket.ticketNumber}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                    {ticket.title}
                  </h2>
                  <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400 mt-2">
                    <span>Created by {ticket.reporter}</span>
                    <span>•</span>
                    <span>Created {new Date(ticket.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>Updated {new Date(ticket.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="metadata">Metadata</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6">
            <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
              <CardHeader>
                <CardTitle>Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Title</label>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-md text-slate-900 dark:text-white">
                      {ticket.title}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-md">
                      <Badge className={getStatusColor(ticket.status)}>
                        {ticket.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Priority</label>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-md text-slate-900 dark:text-white capitalize">
                      {ticket.priority}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Risk Assessment</label>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-md text-slate-900 dark:text-white capitalize">
                      {ticket.riskAssessment} Risk
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-md text-slate-900 dark:text-white whitespace-pre-wrap">
                    {ticket.description}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Details Tab */}
          <TabsContent value="details" className="mt-6">
            <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
              <CardHeader>
                <CardTitle>Detailed Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Business Justification</label>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-md text-slate-900 dark:text-white whitespace-pre-wrap">
                    {ticket.businessJustification}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Technical Impact</label>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-md text-slate-900 dark:text-white whitespace-pre-wrap">
                    {ticket.technicalImpact}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Estimated Effort</label>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-md text-slate-900 dark:text-white">
                      {ticket.estimatedEffort}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Due Date</label>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-md text-slate-900 dark:text-white">
                      {ticket.dueDate ? new Date(ticket.dueDate).toLocaleDateString() : 'Not set'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Assignments Tab */}
          <TabsContent value="assignments" className="mt-6">
            <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
              <CardHeader>
                <CardTitle>Assignments & People</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Assignee</label>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-md text-slate-900 dark:text-white">
                    {ticket.assignee || 'Unassigned'}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Reviewers</label>
                  <div className="flex flex-wrap gap-2">
                    {ticket.reviewers.length > 0 ? (
                      ticket.reviewers.map((reviewer, index) => (
                        <Badge key={index} variant="outline" className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span>{reviewer}</span>
                        </Badge>
                      ))
                    ) : (
                      <span className="text-slate-500 dark:text-slate-400">No reviewers assigned</span>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Watchers</label>
                  <div className="flex flex-wrap gap-2">
                    {ticket.watchers.length > 0 ? (
                      ticket.watchers.map((watcher, index) => (
                        <Badge key={index} variant="outline" className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span>{watcher}</span>
                        </Badge>
                      ))
                    ) : (
                      <span className="text-slate-500 dark:text-slate-400">No watchers assigned</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Metadata Tab */}
          <TabsContent value="metadata" className="mt-6">
            <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
              <CardHeader>
                <CardTitle>Labels & Metadata</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Labels</label>
                  <div className="flex flex-wrap gap-2">
                    {ticket.labels.length > 0 ? (
                      ticket.labels.map((label, index) => (
                        <Badge key={index} variant="outline" className="flex items-center space-x-1">
                          <Tag className="h-3 w-3" />
                          <span>{label}</span>
                        </Badge>
                      ))
                    ) : (
                      <span className="text-slate-500 dark:text-slate-400">No labels assigned</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export function ViewTicketPage() {
  return (
    <AppLayout>
      <ViewTicketContent />
    </AppLayout>
  );
}

export default ViewTicketPage;