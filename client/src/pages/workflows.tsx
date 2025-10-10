import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Workflow, 
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
  ThumbsUp,
  ThumbsDown,
  GitBranch,
  Building,
  Target,
  Shield
} from 'lucide-react';
import { AppLayout } from '@/components/layout/app-layout';
import { GovernanceHeader } from '@/components/layout/governance-header';

interface ReviewWorkflow {
  id: string;
  title: string;
  description: string;
  type: 'Architecture Review' | 'Design Review' | 'Security Review' | 'Compliance Review' | 'Change Request';
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'Requires Changes';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  submitter: string;
  assignedReviewers: string[];
  approvals: number;
  rejections: number;
  totalReviewers: number;
  submittedDate: string;
  dueDate: string;
  completedDate?: string;
  estimatedEffort: string;
  actualEffort?: string;
  relatedDecisions: string[];
  affectedCapabilities: string[];
  riskAssessment: 'Low' | 'Medium' | 'High' | 'Critical';
  stakeholders: string[];
  comments: {
    reviewer: string;
    date: string;
    comment: string;
    type: 'feedback' | 'approval' | 'rejection' | 'question';
  }[];
  artifacts: string[];
  tags: string[];
}

function WorkflowsContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  // Mock workflow data - would come from backend
  const workflows: ReviewWorkflow[] = [
    {
      id: 'RW-001',
      title: 'Microservices Architecture Transition Plan',
      description: 'Comprehensive review of proposed microservices architecture for customer platform modernization initiative',
      type: 'Architecture Review',
      status: 'Under Review',
      priority: 'High',
      submitter: 'Sarah Chen',
      assignedReviewers: ['Michael Torres', 'Elena Rodriguez', 'David Kim', 'Lisa Wang'],
      approvals: 2,
      rejections: 0,
      totalReviewers: 4,
      submittedDate: '2024-08-25',
      dueDate: '2024-09-05',
      estimatedEffort: '4-6 hours',
      relatedDecisions: ['ADR-001'],
      affectedCapabilities: ['Customer Experience Management', 'Digital Commerce'],
      riskAssessment: 'Medium',
      stakeholders: ['Engineering', 'Product', 'Operations'],
      comments: [
        {
          reviewer: 'Michael Torres',
          date: '2024-08-27',
          comment: 'Architecture approach looks solid. Consider adding more detail on service communication patterns and error handling strategies.',
          type: 'feedback'
        },
        {
          reviewer: 'Elena Rodriguez',
          date: '2024-08-28',
          comment: 'Data consistency patterns need clarification. How will we handle distributed transactions?',
          type: 'question'
        },
        {
          reviewer: 'David Kim',
          date: '2024-08-29',
          comment: 'Security boundaries are well-defined. Approved from security perspective.',
          type: 'approval'
        }
      ],
      artifacts: ['architecture-diagram.pdf', 'service-boundaries.md', 'migration-plan.xlsx'],
      tags: ['microservices', 'modernization', 'customer-platform']
    },
    {
      id: 'RW-002',
      title: 'Zero Trust Security Model Implementation',
      description: 'Security review for comprehensive zero trust architecture rollout across enterprise systems',
      type: 'Security Review',
      status: 'Approved',
      priority: 'Critical',
      submitter: 'Michael Torres',
      assignedReviewers: ['David Kim', 'Sarah Chen', 'Lisa Wang'],
      approvals: 3,
      rejections: 0,
      totalReviewers: 3,
      submittedDate: '2024-08-20',
      dueDate: '2024-08-30',
      completedDate: '2024-08-28',
      estimatedEffort: '6-8 hours',
      actualEffort: '7 hours',
      relatedDecisions: ['ADR-002'],
      affectedCapabilities: ['Cybersecurity & Risk Management', 'Cloud Infrastructure Management'],
      riskAssessment: 'High',
      stakeholders: ['Security', 'IT Operations', 'Compliance'],
      comments: [
        {
          reviewer: 'David Kim',
          date: '2024-08-22',
          comment: 'Comprehensive security model. Identity management approach is particularly strong.',
          type: 'approval'
        },
        {
          reviewer: 'Sarah Chen',
          date: '2024-08-24',
          comment: 'Implementation timeline is realistic. Resource allocation looks appropriate.',
          type: 'approval'
        },
        {
          reviewer: 'Lisa Wang',
          date: '2024-08-26',
          comment: 'Infrastructure changes are well-planned. Network segmentation strategy is sound.',
          type: 'approval'
        }
      ],
      artifacts: ['zero-trust-model.pdf', 'implementation-roadmap.md', 'risk-assessment.xlsx'],
      tags: ['security', 'zero-trust', 'infrastructure']
    },
    {
      id: 'RW-003',
      title: 'Data Analytics Platform Consolidation',
      description: 'Design review for unified data lakehouse architecture and analytics platform migration strategy',
      type: 'Design Review',
      status: 'Requires Changes',
      priority: 'High',
      submitter: 'Elena Rodriguez',
      assignedReviewers: ['Sarah Chen', 'Michael Torres', 'David Kim'],
      approvals: 1,
      rejections: 1,
      totalReviewers: 3,
      submittedDate: '2024-08-22',
      dueDate: '2024-09-01',
      estimatedEffort: '5-7 hours',
      relatedDecisions: ['ADR-003'],
      affectedCapabilities: ['Data Analytics & Intelligence'],
      riskAssessment: 'High',
      stakeholders: ['Data Engineering', 'Analytics', 'Business Intelligence'],
      comments: [
        {
          reviewer: 'Sarah Chen',
          date: '2024-08-24',
          comment: 'Data migration strategy needs more detail. What about downtime during transition?',
          type: 'feedback'
        },
        {
          reviewer: 'Michael Torres',
          date: '2024-08-26',
          comment: 'Architecture is solid but performance benchmarks are missing. Need to validate scalability claims.',
          type: 'rejection'
        },
        {
          reviewer: 'David Kim',
          date: '2024-08-27',
          comment: 'Security and compliance aspects are well-addressed. Data governance model is comprehensive.',
          type: 'approval'
        }
      ],
      artifacts: ['lakehouse-architecture.pdf', 'migration-strategy.md', 'performance-analysis.xlsx'],
      tags: ['data', 'analytics', 'consolidation']
    },
    {
      id: 'RW-004',
      title: 'API Gateway Standards and Governance',
      description: 'Compliance review for enterprise API gateway standards and governance framework',
      type: 'Compliance Review',
      status: 'Draft',
      priority: 'Medium',
      submitter: 'David Kim',
      assignedReviewers: ['Sarah Chen', 'Elena Rodriguez'],
      approvals: 0,
      rejections: 0,
      totalReviewers: 2,
      submittedDate: '2024-08-30',
      dueDate: '2024-09-10',
      estimatedEffort: '3-4 hours',
      relatedDecisions: ['ADR-004'],
      affectedCapabilities: [],
      riskAssessment: 'Low',
      stakeholders: ['Engineering', 'Architecture', 'Compliance'],
      comments: [],
      artifacts: ['api-standards.pdf', 'governance-framework.md'],
      tags: ['api', 'governance', 'standards']
    },
    {
      id: 'RW-005',
      title: 'Cloud Infrastructure Scaling Strategy',
      description: 'Change request for auto-scaling policies and infrastructure optimization across cloud environments',
      type: 'Change Request',
      status: 'Submitted',
      priority: 'Medium',
      submitter: 'Lisa Wang',
      assignedReviewers: ['Michael Torres', 'David Kim'],
      approvals: 0,
      rejections: 0,
      totalReviewers: 2,
      submittedDate: '2024-08-29',
      dueDate: '2024-09-08',
      estimatedEffort: '2-3 hours',
      relatedDecisions: [],
      affectedCapabilities: ['Cloud Infrastructure Management'],
      riskAssessment: 'Low',
      stakeholders: ['Infrastructure', 'DevOps', 'Operations'],
      comments: [],
      artifacts: ['scaling-policies.yaml', 'cost-analysis.xlsx'],
      tags: ['infrastructure', 'scaling', 'optimization']
    }
  ];

  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = searchQuery === '' || 
      workflow.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workflow.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workflow.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = selectedStatus === 'all' || workflow.status === selectedStatus;
    const matchesType = selectedType === 'all' || workflow.type === selectedType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'Under Review': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'Rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'Requires Changes': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300';
      case 'Submitted': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      case 'Draft': return 'bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-300';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'High': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      case 'Medium': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300';
      case 'Low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-300';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Critical': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'High': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      case 'Medium': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300';
      case 'Low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Under Review': return <Eye className="h-4 w-4 text-blue-600" />;
      case 'Rejected': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'Requires Changes': return <AlertTriangle className="h-4 w-4 text-amber-600" />;
      case 'Submitted': return <Clock className="h-4 w-4 text-purple-600" />;
      case 'Draft': return <FileText className="h-4 w-4 text-slate-600" />;
      default: return <FileText className="h-4 w-4 text-slate-600" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Architecture Review': return Building;
      case 'Design Review': return Target;
      case 'Security Review': return Shield;
      case 'Compliance Review': return CheckCircle;
      case 'Change Request': return GitBranch;
      default: return FileText;
    }
  };

  const overallStats = {
    totalWorkflows: workflows.length,
    underReview: workflows.filter(w => w.status === 'Under Review').length,
    approved: workflows.filter(w => w.status === 'Approved').length,
    pendingAction: workflows.filter(w => w.status === 'Requires Changes' || w.status === 'Submitted').length,
    avgReviewTime: '3.2 days',
    approvalRate: Math.round((workflows.filter(w => w.status === 'Approved').length / workflows.filter(w => w.status !== 'Draft').length) * 100)
  };

  return (
    <div className="h-full overflow-hidden flex flex-col">
      <GovernanceHeader 
        moduleTitle="Business Workflows" 
        moduleIcon={GitBranch} 
      />
      
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Total Reviews</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{overallStats.totalWorkflows}</p>
                </div>
                <Workflow className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Under Review</p>
                  <p className="text-2xl font-bold text-blue-600">{overallStats.underReview}</p>
                </div>
                <Eye className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Approved</p>
                  <p className="text-2xl font-bold text-green-600">{overallStats.approved}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Pending Action</p>
                  <p className="text-2xl font-bold text-amber-600">{overallStats.pendingAction}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Avg Review Time</p>
                  <p className="text-2xl font-bold text-purple-600">{overallStats.avgReviewTime}</p>
                </div>
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Approval Rate</p>
                  <p className="text-2xl font-bold text-emerald-600">{overallStats.approvalRate}%</p>
                </div>
                <ThumbsUp className="h-8 w-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search reviews by title, description, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50"
              data-testid="input-search-workflows"
            />
          </div>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-48 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="Submitted">Submitted</SelectItem>
              <SelectItem value="Under Review">Under Review</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
              <SelectItem value="Requires Changes">Requires Changes</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-48 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Architecture Review">Architecture Review</SelectItem>
              <SelectItem value="Design Review">Design Review</SelectItem>
              <SelectItem value="Security Review">Security Review</SelectItem>
              <SelectItem value="Compliance Review">Compliance Review</SelectItem>
              <SelectItem value="Change Request">Change Request</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Workflow List */}
        <div className="space-y-6">
          {filteredWorkflows.map((workflow) => {
            const TypeIcon = getTypeIcon(workflow.type);
            const approvalProgress = (workflow.approvals / workflow.totalReviewers) * 100;
            
            return (
              <Card key={workflow.id} className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-lg flex items-center justify-center">
                        <TypeIcon className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white truncate">
                            {workflow.title}
                          </h3>
                          <Badge className={getStatusColor(workflow.status)}>{workflow.status}</Badge>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                          {workflow.description}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-300">
                          <span className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            {workflow.submitter}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            Due {workflow.dueDate}
                          </span>
                          <span className="font-medium text-slate-900 dark:text-white">{workflow.id}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      {getStatusIcon(workflow.status)}
                      <Badge className={getPriorityColor(workflow.priority)} variant="outline">
                        {workflow.priority}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-slate-600 dark:text-slate-300">Review Progress</span>
                          <span className="font-medium">
                            {workflow.approvals}/{workflow.totalReviewers} approvals
                          </span>
                        </div>
                        <Progress value={approvalProgress} className="h-2" />
                        <div className="flex items-center space-x-4 mt-2 text-xs text-slate-500 dark:text-slate-400">
                          <span className="flex items-center">
                            <ThumbsUp className="h-3 w-3 mr-1 text-green-600" />
                            {workflow.approvals}
                          </span>
                          <span className="flex items-center">
                            <ThumbsDown className="h-3 w-3 mr-1 text-red-600" />
                            {workflow.rejections}
                          </span>
                          <span className="flex items-center">
                            <MessageCircle className="h-3 w-3 mr-1" />
                            {workflow.comments.length} comments
                          </span>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-slate-900 dark:text-white text-sm mb-2">Review Details</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-600 dark:text-slate-300">Type</span>
                            <span className="font-medium">{workflow.type}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600 dark:text-slate-300">Risk Level</span>
                            <Badge className={getRiskColor(workflow.riskAssessment)} variant="outline">
                              {workflow.riskAssessment}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600 dark:text-slate-300">Estimated Effort</span>
                            <span className="font-medium">{workflow.estimatedEffort}</span>
                          </div>
                          {workflow.actualEffort && (
                            <div className="flex justify-between">
                              <span className="text-slate-600 dark:text-slate-300">Actual Effort</span>
                              <span className="font-medium">{workflow.actualEffort}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-slate-900 dark:text-white text-sm mb-2">Assigned Reviewers</h4>
                        <div className="space-y-1">
                          {workflow.assignedReviewers.map((reviewer, index) => {
                            const hasApproved = workflow.comments.some(c => c.reviewer === reviewer && c.type === 'approval');
                            const hasRejected = workflow.comments.some(c => c.reviewer === reviewer && c.type === 'rejection');
                            
                            return (
                              <div key={index} className="flex items-center justify-between text-sm">
                                <span className="text-slate-600 dark:text-slate-300">{reviewer}</span>
                                <div className="flex items-center space-x-1">
                                  {hasApproved && <CheckCircle className="h-3 w-3 text-green-600" />}
                                  {hasRejected && <XCircle className="h-3 w-3 text-red-600" />}
                                  {!hasApproved && !hasRejected && <Clock className="h-3 w-3 text-slate-400" />}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {workflow.comments.length > 0 && (
                        <div>
                          <h4 className="font-medium text-slate-900 dark:text-white text-sm mb-2">Recent Comments</h4>
                          <div className="space-y-2">
                            {workflow.comments.slice(-2).map((comment, index) => (
                              <div key={index} className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="text-xs font-medium text-slate-900 dark:text-white">{comment.reviewer}</span>
                                  <span className="text-xs text-slate-500 dark:text-slate-400">{comment.date}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {comment.type}
                                  </Badge>
                                </div>
                                <p className="text-xs text-slate-600 dark:text-slate-300">{comment.comment}</p>
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
                        {workflow.relatedDecisions.length > 0 && (
                          <span className="flex items-center">
                            <GitBranch className="h-3 w-3 mr-1" />
                            {workflow.relatedDecisions.length} linked ADRs
                          </span>
                        )}
                        {workflow.affectedCapabilities.length > 0 && (
                          <span className="flex items-center">
                            <Target className="h-3 w-3 mr-1" />
                            {workflow.affectedCapabilities.length} capabilities
                          </span>
                        )}
                        <span className="flex items-center">
                          <FileText className="h-3 w-3 mr-1" />
                          {workflow.artifacts.length} artifacts
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {workflow.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredWorkflows.length === 0 && (
          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
            <CardContent className="p-12 text-center">
              <Workflow className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No workflows found</h3>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                No review workflows match your current filters.
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

export function WorkflowsPage() {
  return (
    <AppLayout>
      <WorkflowsContent />
    </AppLayout>
  );
}

export default WorkflowsPage;