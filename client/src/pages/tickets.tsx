import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { 
  Ticket, 
  Plus, 
  Search, 
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Users,
  Calendar,
  MessageCircle,
  FileText,
  Eye,
  GitBranch,
  Building,
  Target,
  Shield,
  Code,
  Zap,
  Bot,
  User,
  Link,
  ArrowRight,
  Flag,
  Archive,
  Play,
  Pause,
  Edit,
  MoreHorizontal,
  Wrench
} from 'lucide-react';
import { AppLayout } from '@/components/layout/app-layout';
import { GovernanceHeader } from '@/components/layout/governance-header';

interface TicketData {
  id: string;
  ticketNumber: string;
  type: 'architecture_review' | 'architect_request' | 'adr' | 'change_request' | 'technical_debt';
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'under_review' | 'approved' | 'rejected' | 'closed' | 'on_hold';
  priority: 'low' | 'medium' | 'high' | 'critical' | 'urgent';
  severity?: 'minor' | 'major' | 'critical' | 'blocker';
  reporter: string;
  assignee?: string;
  reviewers: string[];
  watchers: string[];
  labels: string[];
  businessJustification?: string;
  technicalImpact?: string;
  riskAssessment?: 'low' | 'medium' | 'high' | 'critical';
  estimatedEffort?: string;
  actualEffort?: string;
  dueDate?: string;
  targetResolution?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  closedAt?: string;
  linkedObjects: {
    type: string;
    id: string;
    name: string;
    linkType: string;
  }[];
  comments: {
    id: string;
    author: string;
    content: string;
    type: 'comment' | 'status_change' | 'assignment' | 'approval' | 'rejection';
    createdAt: string;
  }[];
  attachments: {
    id: string;
    fileName: string;
    uploadedBy: string;
    uploadedAt: string;
  }[];
  stateHistory: {
    fromStatus?: string;
    toStatus: string;
    actor: string;
    reason?: string;
    automatedChange: boolean;
    transitionedAt: string;
  }[];
  metadata?: any;
}

function TicketsContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'kanban' | 'list' | 'timeline'>('kanban');

  // Mock ticket data - would come from backend
  const tickets: TicketData[] = [
    {
      id: 'TKT-001',
      ticketNumber: 'ARR-2024-001',
      type: 'architecture_review',
      title: 'Review Microservices Architecture for Customer Platform',
      description: 'Comprehensive architecture review requested for the proposed microservices transition of the customer platform. Need evaluation of service boundaries, data consistency, and operational complexity.',
      status: 'under_review',
      priority: 'high',
      severity: 'major',
      reporter: 'Sarah Chen',
      assignee: 'Michael Torres',
      reviewers: ['Elena Rodriguez', 'David Kim', 'Lisa Wang'],
      watchers: ['Sarah Chen', 'Michael Torres'],
      labels: ['microservices', 'customer-platform', 'modernization'],
      businessJustification: 'Improve development velocity and system scalability to support growing customer base',
      technicalImpact: 'Major architecture change affecting all customer-facing services',
      riskAssessment: 'medium',
      estimatedEffort: '4-6 weeks',
      dueDate: '2024-09-15',
      targetResolution: '2024-09-10',
      createdAt: '2024-08-20',
      updatedAt: '2024-08-29',
      linkedObjects: [
        { type: 'adr', id: 'ADR-001', name: 'Adopt Microservices Architecture', linkType: 'implements' },
        { type: 'capability', id: 'CAP-001', name: 'Customer Experience Management', linkType: 'affects' },
        { type: 'architecture_model', id: 'AM-001', name: 'Customer Platform Architecture', linkType: 'reviews' }
      ],
      comments: [
        {
          id: 'CMT-001',
          author: 'Elena Rodriguez',
          content: 'Initial review complete. Service boundaries look well-defined, but need more clarity on data consistency patterns.',
          type: 'comment',
          createdAt: '2024-08-25'
        },
        {
          id: 'CMT-002',
          author: 'David Kim',
          content: 'Security review approved. Zero trust principles are properly incorporated.',
          type: 'approval',
          createdAt: '2024-08-27'
        }
      ],
      attachments: [
        { id: 'ATT-001', fileName: 'microservices-architecture.pdf', uploadedBy: 'Sarah Chen', uploadedAt: '2024-08-20' },
        { id: 'ATT-002', fileName: 'service-boundaries.drawio', uploadedBy: 'Sarah Chen', uploadedAt: '2024-08-21' }
      ],
      stateHistory: [
        { toStatus: 'open', actor: 'Sarah Chen', automatedChange: false, transitionedAt: '2024-08-20' },
        { fromStatus: 'open', toStatus: 'in_progress', actor: 'Michael Torres', automatedChange: false, transitionedAt: '2024-08-22' },
        { fromStatus: 'in_progress', toStatus: 'under_review', actor: 'Michael Torres', automatedChange: false, transitionedAt: '2024-08-25' }
      ],
      metadata: {
        projectName: 'Customer Platform Modernization',
        businessDomain: 'Customer Experience',
        proposedSolution: 'Transition from monolithic to microservices architecture',
        linkedArchitectureModels: ['customer-platform-current', 'customer-platform-target']
      }
    },
    {
      id: 'TKT-002',
      ticketNumber: 'ARCH-2024-001',
      type: 'architect_request',
      title: 'Senior Cloud Architect Needed for Data Platform Project',
      description: 'Seeking experienced cloud architect for 6-month data platform modernization project. Must have expertise in Azure, data lakehouse patterns, and real-time analytics.',
      status: 'open',
      priority: 'critical',
      reporter: 'Elena Rodriguez',
      reviewers: [],
      watchers: ['Elena Rodriguez', 'Sarah Chen'],
      labels: ['architect-request', 'data-platform', 'azure', 'urgent'],
      businessJustification: 'Critical project to consolidate analytics platforms and reduce operational costs',
      riskAssessment: 'high',
      estimatedEffort: '6 months',
      dueDate: '2024-09-05',
      targetResolution: '2024-09-01',
      createdAt: '2024-08-25',
      updatedAt: '2024-08-29',
      linkedObjects: [
        { type: 'capability', id: 'CAP-003', name: 'Data Analytics & Intelligence', linkType: 'supports' },
        { type: 'adr', id: 'ADR-003', name: 'Consolidate Data Analytics Platforms', linkType: 'implements' }
      ],
      comments: [
        {
          id: 'CMT-003',
          author: 'Sarah Chen',
          content: 'High priority request. Will review available architects and external consultants.',
          type: 'comment',
          createdAt: '2024-08-26'
        }
      ],
      attachments: [
        { id: 'ATT-003', fileName: 'project-requirements.docx', uploadedBy: 'Elena Rodriguez', uploadedAt: '2024-08-25' }
      ],
      stateHistory: [
        { toStatus: 'open', actor: 'Elena Rodriguez', automatedChange: false, transitionedAt: '2024-08-25' }
      ],
      metadata: {
        projectName: 'Data Platform Modernization',
        projectDuration: '6 months',
        teamSize: 8,
        requiredSkills: ['Azure', 'Data Lakehouse', 'Real-time Analytics', 'Data Engineering'],
        complexityLevel: 'expert'
      }
    },
    {
      id: 'TKT-003',
      ticketNumber: 'ADR-2024-002',
      type: 'adr',
      title: 'Decision: Adopt Event-Driven Architecture for Real-time Analytics',
      description: 'Architecture decision record for implementing event-driven patterns to support real-time analytics requirements across the data platform.',
      status: 'approved',
      priority: 'medium',
      reporter: 'Elena Rodriguez',
      assignee: 'David Kim',
      reviewers: ['Michael Torres', 'Sarah Chen'],
      watchers: ['Elena Rodriguez', 'David Kim'],
      labels: ['adr', 'event-driven', 'real-time', 'analytics'],
      businessJustification: 'Enable real-time decision making and improve customer experience through faster insights',
      technicalImpact: 'Introduction of event streaming infrastructure and modified data processing patterns',
      riskAssessment: 'medium',
      estimatedEffort: '3-4 weeks',
      actualEffort: '3 weeks',
      createdAt: '2024-08-15',
      updatedAt: '2024-08-28',
      resolvedAt: '2024-08-28',
      linkedObjects: [
        { type: 'architecture_model', id: 'AM-002', name: 'Data Platform Architecture', linkType: 'modifies' },
        { type: 'capability', id: 'CAP-003', name: 'Data Analytics & Intelligence', linkType: 'enhances' }
      ],
      comments: [
        {
          id: 'CMT-004',
          author: 'Michael Torres',
          content: 'Event-driven approach is sound. Kafka implementation plan looks comprehensive.',
          type: 'approval',
          createdAt: '2024-08-26'
        },
        {
          id: 'CMT-005',
          author: 'Sarah Chen',
          content: 'Approved. Monitoring and observability strategy is well-defined.',
          type: 'approval',
          createdAt: '2024-08-28'
        }
      ],
      attachments: [
        { id: 'ATT-004', fileName: 'event-driven-architecture.pdf', uploadedBy: 'Elena Rodriguez', uploadedAt: '2024-08-15' }
      ],
      stateHistory: [
        { toStatus: 'open', actor: 'Elena Rodriguez', automatedChange: false, transitionedAt: '2024-08-15' },
        { fromStatus: 'open', toStatus: 'under_review', actor: 'David Kim', automatedChange: false, transitionedAt: '2024-08-18' },
        { fromStatus: 'under_review', toStatus: 'approved', actor: 'Sarah Chen', automatedChange: false, transitionedAt: '2024-08-28' }
      ],
      metadata: {
        decisionCategory: 'technical',
        architecturalLayer: 'data',
        scope: 'enterprise',
        technicalDebtScore: 25,
        affectedSystems: ['Analytics Platform', 'Data Warehouse', 'Real-time Dashboard']
      }
    },
    {
      id: 'TKT-004',
      ticketNumber: 'CHG-2024-001',
      type: 'change_request',
      title: 'AI-Detected: API Breaking Changes in Customer Service Module',
      description: 'Automated system detected breaking changes in customer service API that may impact downstream services and integrations. Immediate architecture review recommended.',
      status: 'open',
      priority: 'urgent',
      severity: 'blocker',
      reporter: 'ARKITEKTON System Agent',
      reviewers: [],
      watchers: [],
      labels: ['ai-detected', 'breaking-change', 'api', 'customer-service', 'urgent'],
      technicalImpact: 'Breaking API changes affecting 8 downstream services and 3 external integrations',
      riskAssessment: 'critical',
      createdAt: '2024-08-29',
      updatedAt: '2024-08-29',
      linkedObjects: [
        { type: 'code_component', id: 'CC-001', name: 'CustomerService.API', linkType: 'changed' },
        { type: 'architecture_model', id: 'AM-003', name: 'API Integration Map', linkType: 'impacts' }
      ],
      comments: [],
      attachments: [],
      stateHistory: [
        { toStatus: 'open', actor: 'ARKITEKTON System Agent', automatedChange: true, transitionedAt: '2024-08-29' }
      ],
      metadata: {
        changeType: 'api_change',
        detectionMethod: 'automated_scan',
        sourceLocation: 'src/services/customer/api/',
        changedFiles: ['CustomerController.cs', 'CustomerResponse.cs', 'ICustomerService.cs'],
        impactAnalysis: {
          affectedComponents: ['OrderService', 'BillingService', 'NotificationService'],
          architecturalLayers: ['application', 'integration'],
          riskLevel: 'critical',
          recommendedActions: ['Immediate review', 'Impact assessment', 'Communication plan']
        },
        confidence: 95,
        detectedAt: '2024-08-29T10:30:00Z'
      }
    }
  ];

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = searchQuery === '' || 
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.labels.some(label => label.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = selectedType === 'all' || ticket.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || ticket.status === selectedStatus;
    const matchesPriority = selectedPriority === 'all' || ticket.priority === selectedPriority;
    
    return matchesSearch && matchesType && matchesStatus && matchesPriority;
  });

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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      case 'medium': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-300';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'architecture_review': return Building;
      case 'architect_request': return Users;
      case 'adr': return FileText;
      case 'change_request': return GitBranch;
      case 'technical_debt': return Wrench;
      default: return Ticket;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'architecture_review': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'architect_request': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      case 'adr': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300';
      case 'change_request': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300';
      case 'technical_debt': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <FileText className="h-4 w-4 text-blue-600" />;
      case 'in_progress': return <Play className="h-4 w-4 text-purple-600" />;
      case 'under_review': return <Eye className="h-4 w-4 text-amber-600" />;
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'closed': return <Archive className="h-4 w-4 text-slate-600" />;
      case 'on_hold': return <Pause className="h-4 w-4 text-orange-600" />;
      default: return <FileText className="h-4 w-4 text-slate-600" />;
    }
  };

  const overallStats = {
    totalTickets: tickets.length,
    openTickets: tickets.filter(t => t.status === 'open').length,
    inProgressTickets: tickets.filter(t => t.status === 'in_progress' || t.status === 'under_review').length,
    closedTickets: tickets.filter(t => t.status === 'approved' || t.status === 'closed').length,
    urgentTickets: tickets.filter(t => t.priority === 'urgent' || t.priority === 'critical').length,
    aiDetectedTickets: tickets.filter(t => t.reporter === 'ARKITEKTON System Agent').length
  };

  return (
    <div className="h-full overflow-hidden flex flex-col">
      <GovernanceHeader 
        moduleTitle="Governance Tickets" 
        moduleIcon={Ticket} 
      />
      
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-end mb-8">
          <div className="flex space-x-3">
            <Button variant="outline" className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
              <Bot className="h-4 w-4 mr-2" />
              AI Insights
            </Button>
            <Button 
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
              onClick={() => window.location.href = '/tickets/new'}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Ticket
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Total Tickets</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{overallStats.totalTickets}</p>
                </div>
                <Ticket className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Open</p>
                  <p className="text-2xl font-bold text-blue-600">{overallStats.openTickets}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">In Progress</p>
                  <p className="text-2xl font-bold text-purple-600">{overallStats.inProgressTickets}</p>
                </div>
                <Play className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Resolved</p>
                  <p className="text-2xl font-bold text-green-600">{overallStats.closedTickets}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Urgent</p>
                  <p className="text-2xl font-bold text-red-600">{overallStats.urgentTickets}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">AI Detected</p>
                  <p className="text-2xl font-bold text-emerald-600">{overallStats.aiDetectedTickets}</p>
                </div>
                <Bot className="h-8 w-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search tickets by title, description, number, or labels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50"
              data-testid="input-search-tickets"
            />
          </div>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-48 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="architecture_review">Architecture Review</SelectItem>
              <SelectItem value="architect_request">Architect Request</SelectItem>
              <SelectItem value="adr">ADR</SelectItem>
              <SelectItem value="change_request">Change Request</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-48 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="under_review">Under Review</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
              <SelectItem value="on_hold">On Hold</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedPriority} onValueChange={setSelectedPriority}>
            <SelectTrigger className="w-40 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Ticket List */}
        <div className="space-y-6">
          {filteredTickets.map((ticket) => {
            const TypeIcon = getTypeIcon(ticket.type);
            const isAiDetected = ticket.reporter === 'ARKITEKTON System Agent';
            
            return (
              <Card key={ticket.id} className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-lg flex items-center justify-center">
                        <TypeIcon className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white truncate">
                            {ticket.title}
                          </h3>
                          {isAiDetected && (
                            <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300">
                              <Bot className="h-3 w-3 mr-1" />
                              AI Detected
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 mb-3">
                          <Badge className={getTypeColor(ticket.type)} variant="outline">
                            {ticket.type.replace('_', ' ')}
                          </Badge>
                          <Badge className={getStatusColor(ticket.status)}>{ticket.status.replace('_', ' ')}</Badge>
                          <Badge className={getPriorityColor(ticket.priority)} variant="outline">
                            {ticket.priority}
                          </Badge>
                          {ticket.severity && (
                            <Badge variant="outline" className="text-red-700 border-red-200 bg-red-50 dark:text-red-300 dark:border-red-800 dark:bg-red-900/20">
                              {ticket.severity}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                          {ticket.description}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
                          <span className="flex items-center">
                            {isAiDetected ? <Bot className="h-3 w-3 mr-1" /> : <User className="h-3 w-3 mr-1" />}
                            {ticket.reporter}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {ticket.createdAt}
                          </span>
                          <span className="font-medium text-slate-900 dark:text-white">{ticket.ticketNumber}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      {getStatusIcon(ticket.status)}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => window.location.href = `/tickets/${ticket.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => window.location.href = `/tickets/${ticket.id}/edit`}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Ticket
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Add Comment
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      {ticket.assignee && (
                        <div>
                          <h4 className="font-medium text-slate-900 dark:text-white text-sm mb-2">Assignment</h4>
                          <div className="flex items-center space-x-2 text-sm">
                            <Users className="h-3 w-3 text-slate-400" />
                            <span className="text-slate-600 dark:text-slate-300">Assigned to:</span>
                            <span className="font-medium text-slate-900 dark:text-white">{ticket.assignee}</span>
                          </div>
                        </div>
                      )}

                      {ticket.reviewers.length > 0 && (
                        <div>
                          <h4 className="font-medium text-slate-900 dark:text-white text-sm mb-2">Reviewers</h4>
                          <div className="flex flex-wrap gap-1">
                            {ticket.reviewers.map((reviewer, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {reviewer}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {ticket.linkedObjects.length > 0 && (
                        <div>
                          <h4 className="font-medium text-slate-900 dark:text-white text-sm mb-2">Linked Objects</h4>
                          <div className="space-y-1">
                            {ticket.linkedObjects.map((obj, index) => (
                              <div key={index} className="flex items-center text-sm">
                                <Link className="h-3 w-3 text-slate-400 mr-2" />
                                <span className="text-slate-600 dark:text-slate-300">{obj.linkType}</span>
                                <ArrowRight className="h-3 w-3 text-slate-400 mx-1" />
                                <span className="font-medium text-slate-900 dark:text-white">{obj.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      {ticket.technicalImpact && (
                        <div>
                          <h4 className="font-medium text-slate-900 dark:text-white text-sm mb-2">Technical Impact</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-300">{ticket.technicalImpact}</p>
                        </div>
                      )}

                      {ticket.riskAssessment && (
                        <div>
                          <h4 className="font-medium text-slate-900 dark:text-white text-sm mb-2">Risk Assessment</h4>
                          <Badge className={getPriorityColor(ticket.riskAssessment)} variant="outline">
                            {ticket.riskAssessment} risk
                          </Badge>
                        </div>
                      )}

                      {ticket.comments.length > 0 && (
                        <div>
                          <h4 className="font-medium text-slate-900 dark:text-white text-sm mb-2">Recent Activity</h4>
                          <div className="space-y-2">
                            {ticket.comments.slice(-2).map((comment, index) => (
                              <div key={index} className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="text-xs font-medium text-slate-900 dark:text-white">{comment.author}</span>
                                  <span className="text-xs text-slate-500 dark:text-slate-400">{comment.createdAt}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {comment.type}
                                  </Badge>
                                </div>
                                <p className="text-xs text-slate-600 dark:text-slate-300">{comment.content}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200/50 dark:border-slate-700/50 mt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-xs text-slate-500 dark:text-slate-400">
                        {ticket.attachments.length > 0 && (
                          <span className="flex items-center">
                            <FileText className="h-3 w-3 mr-1" />
                            {ticket.attachments.length} attachments
                          </span>
                        )}
                        {ticket.watchers.length > 0 && (
                          <span className="flex items-center">
                            <Eye className="h-3 w-3 mr-1" />
                            {ticket.watchers.length} watchers
                          </span>
                        )}
                        {ticket.dueDate && (
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            Due {ticket.dueDate}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        {ticket.labels.slice(0, 3).map((label, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {label}
                          </Badge>
                        ))}
                        {ticket.labels.length > 3 && (
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            +{ticket.labels.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredTickets.length === 0 && (
          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
            <CardContent className="p-12 text-center">
              <Ticket className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No tickets found</h3>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                No tickets match your current filters.
              </p>
              <Button variant="outline">
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
        </div>
      </div>
    </div>
  );
}

export function TicketsPage() {
  return (
    <AppLayout>
      <TicketsContent />
    </AppLayout>
  );
}

export default TicketsPage;