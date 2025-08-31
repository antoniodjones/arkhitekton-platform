import { useState, useEffect } from 'react';
import { useLocation, useRoute } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Save, 
  Send, 
  Plus, 
  X,
  Building, 
  Users, 
  FileText, 
  GitBranch,
  Calendar,
  AlertTriangle,
  Target,
  Clock,
  User,
  Tag,
  Link,
  History
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

function EditTicketContent() {
  const [, navigate] = useLocation();
  const [match, params] = useRoute('/tickets/:id/edit');
  const [ticket, setTicket] = useState<TicketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [currentReviewer, setCurrentReviewer] = useState('');
  const [currentWatcher, setCurrentWatcher] = useState('');
  const [currentLabel, setCurrentLabel] = useState('');
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    if (params?.id) {
      // In a real app, this would fetch from an API
      // For now, we'll simulate loading from localStorage
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

  const handleInputChange = (field: keyof TicketData, value: any) => {
    if (!ticket) return;
    setTicket(prev => prev ? {
      ...prev,
      [field]: value,
      updatedAt: new Date().toISOString()
    } : null);
  };

  const addToArray = (field: 'reviewers' | 'watchers' | 'labels', value: string) => {
    if (!ticket || !value || ticket[field].includes(value)) return;
    setTicket(prev => prev ? {
      ...prev,
      [field]: [...prev[field], value],
      updatedAt: new Date().toISOString()
    } : null);
  };

  const removeFromArray = (field: 'reviewers' | 'watchers' | 'labels', value: string) => {
    if (!ticket) return;
    setTicket(prev => prev ? {
      ...prev,
      [field]: prev[field].filter(item => item !== value),
      updatedAt: new Date().toISOString()
    } : null);
  };

  const handleSave = async () => {
    if (!ticket) return;
    
    setSaving(true);
    
    try {
      // In a real app, this would save to backend
      localStorage.setItem(`ticket-${ticket.id}`, JSON.stringify(ticket));
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      navigate('/tickets');
    } catch (error) {
      console.error('Error saving ticket:', error);
    } finally {
      setSaving(false);
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
                Edit Ticket
              </h1>
              <p className="text-slate-600 dark:text-slate-300 mt-2">
                Modify ticket details and update status
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
              onClick={handleSave}
              disabled={saving}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
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
            <TabsTrigger value="basic">Overview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="metadata">Metadata</TabsTrigger>
          </TabsList>

          {/* Basic Information Tab */}
          <TabsContent value="basic" className="mt-6">
            <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
              <CardHeader>
                <CardTitle>Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={ticket.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="bg-white/70 dark:bg-slate-800/70"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={ticket.status} onValueChange={(value) => handleInputChange('status', value)}>
                      <SelectTrigger className="bg-white/70 dark:bg-slate-800/70">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="under_review">Under Review</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                        <SelectItem value="on_hold">On Hold</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={ticket.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                      <SelectTrigger className="bg-white/70 dark:bg-slate-800/70">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="riskAssessment">Risk Assessment</Label>
                    <Select value={ticket.riskAssessment} onValueChange={(value) => handleInputChange('riskAssessment', value)}>
                      <SelectTrigger className="bg-white/70 dark:bg-slate-800/70">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low Risk</SelectItem>
                        <SelectItem value="medium">Medium Risk</SelectItem>
                        <SelectItem value="high">High Risk</SelectItem>
                        <SelectItem value="critical">Critical Risk</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={ticket.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className="bg-white/70 dark:bg-slate-800/70"
                  />
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
                  <Label htmlFor="businessJustification">Business Justification</Label>
                  <Textarea
                    id="businessJustification"
                    value={ticket.businessJustification}
                    onChange={(e) => handleInputChange('businessJustification', e.target.value)}
                    rows={3}
                    className="bg-white/70 dark:bg-slate-800/70"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="technicalImpact">Technical Impact</Label>
                  <Textarea
                    id="technicalImpact"
                    value={ticket.technicalImpact}
                    onChange={(e) => handleInputChange('technicalImpact', e.target.value)}
                    rows={3}
                    className="bg-white/70 dark:bg-slate-800/70"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="estimatedEffort">Estimated Effort</Label>
                    <Input
                      id="estimatedEffort"
                      value={ticket.estimatedEffort}
                      onChange={(e) => handleInputChange('estimatedEffort', e.target.value)}
                      className="bg-white/70 dark:bg-slate-800/70"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={ticket.dueDate}
                      onChange={(e) => handleInputChange('dueDate', e.target.value)}
                      className="bg-white/70 dark:bg-slate-800/70"
                    />
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
                  <Label htmlFor="assignee">Assignee</Label>
                  <Input
                    id="assignee"
                    value={ticket.assignee}
                    onChange={(e) => handleInputChange('assignee', e.target.value)}
                    className="bg-white/70 dark:bg-slate-800/70"
                  />
                </div>

                {/* Reviewers */}
                <div className="space-y-4">
                  <Label>Reviewers</Label>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add reviewer"
                      value={currentReviewer}
                      onChange={(e) => setCurrentReviewer(e.target.value)}
                      className="bg-white/70 dark:bg-slate-800/70"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addToArray('reviewers', currentReviewer);
                          setCurrentReviewer('');
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={() => {
                        addToArray('reviewers', currentReviewer);
                        setCurrentReviewer('');
                      }}
                      disabled={!currentReviewer}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {ticket.reviewers.map((reviewer, index) => (
                      <Badge key={index} variant="outline" className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{reviewer}</span>
                        <X
                          className="h-3 w-3 cursor-pointer hover:text-red-500"
                          onClick={() => removeFromArray('reviewers', reviewer)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Watchers */}
                <div className="space-y-4">
                  <Label>Watchers</Label>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add watcher"
                      value={currentWatcher}
                      onChange={(e) => setCurrentWatcher(e.target.value)}
                      className="bg-white/70 dark:bg-slate-800/70"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addToArray('watchers', currentWatcher);
                          setCurrentWatcher('');
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={() => {
                        addToArray('watchers', currentWatcher);
                        setCurrentWatcher('');
                      }}
                      disabled={!currentWatcher}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {ticket.watchers.map((watcher, index) => (
                      <Badge key={index} variant="outline" className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{watcher}</span>
                        <X
                          className="h-3 w-3 cursor-pointer hover:text-red-500"
                          onClick={() => removeFromArray('watchers', watcher)}
                        />
                      </Badge>
                    ))}
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
                {/* Labels */}
                <div className="space-y-4">
                  <Label>Labels</Label>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add label"
                      value={currentLabel}
                      onChange={(e) => setCurrentLabel(e.target.value)}
                      className="bg-white/70 dark:bg-slate-800/70"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addToArray('labels', currentLabel);
                          setCurrentLabel('');
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={() => {
                        addToArray('labels', currentLabel);
                        setCurrentLabel('');
                      }}
                      disabled={!currentLabel}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {ticket.labels.map((label, index) => (
                      <Badge key={index} variant="outline" className="flex items-center space-x-1">
                        <Tag className="h-3 w-3" />
                        <span>{label}</span>
                        <X
                          className="h-3 w-3 cursor-pointer hover:text-red-500"
                          onClick={() => removeFromArray('labels', label)}
                        />
                      </Badge>
                    ))}
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

export function EditTicketPage() {
  return (
    <AppLayout>
      <EditTicketContent />
    </AppLayout>
  );
}

export default EditTicketPage;