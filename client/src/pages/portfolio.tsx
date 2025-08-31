import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Briefcase, 
  Plus, 
  Search, 
  TrendingUp, 
  TrendingDown,
  Clock,
  DollarSign,
  Users,
  Calendar,
  Target,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  GitBranch,
  Building,
  Zap
} from 'lucide-react';
import { AppLayout } from '@/components/layout/app-layout';

interface TransformationInitiative {
  id: string;
  name: string;
  description: string;
  status: 'Planning' | 'In Progress' | 'On Hold' | 'Completed' | 'Cancelled';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  type: 'Digital Transformation' | 'Process Improvement' | 'Technology Modernization' | 'Organizational Change' | 'Infrastructure Upgrade';
  sponsor: string;
  programManager: string;
  stakeholders: string[];
  startDate: string;
  targetDate: string;
  actualEndDate?: string;
  budget: number;
  spentBudget: number;
  progressPercent: number;
  healthStatus: 'Green' | 'Yellow' | 'Red';
  businessValue: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  dependencies: string[];
  capabilities: string[];
  milestones: {
    name: string;
    targetDate: string;
    status: 'Not Started' | 'In Progress' | 'Completed' | 'At Risk';
  }[];
  kpis: {
    name: string;
    target: number;
    current: number;
    unit: string;
  }[];
  tags: string[];
}

function PortfolioContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedView, setSelectedView] = useState<'cards' | 'timeline' | 'roadmap'>('cards');

  // Mock portfolio data - would come from backend
  const initiatives: TransformationInitiative[] = [
    {
      id: 'TI-001',
      name: 'Customer Experience Platform Modernization',
      description: 'Modernize customer-facing platforms to improve user experience and operational efficiency',
      status: 'In Progress',
      priority: 'Critical',
      type: 'Digital Transformation',
      sponsor: 'Sarah Chen',
      programManager: 'Michael Torres',
      stakeholders: ['Customer Success', 'Engineering', 'Product', 'Marketing'],
      startDate: '2024-06-01',
      targetDate: '2024-12-31',
      budget: 2500000,
      spentBudget: 1200000,
      progressPercent: 65,
      healthStatus: 'Green',
      businessValue: 15000000,
      riskLevel: 'Medium',
      dependencies: ['Security Infrastructure Upgrade', 'Data Platform Consolidation'],
      capabilities: ['Customer Experience Management', 'Digital Commerce'],
      milestones: [
        { name: 'Requirements Analysis', targetDate: '2024-07-15', status: 'Completed' },
        { name: 'Platform Selection', targetDate: '2024-08-30', status: 'Completed' },
        { name: 'MVP Development', targetDate: '2024-10-15', status: 'In Progress' },
        { name: 'User Testing', targetDate: '2024-11-30', status: 'Not Started' },
        { name: 'Production Rollout', targetDate: '2024-12-31', status: 'Not Started' }
      ],
      kpis: [
        { name: 'Customer Satisfaction', target: 90, current: 82, unit: '%' },
        { name: 'Page Load Time', target: 2, current: 3.2, unit: 'sec' },
        { name: 'Conversion Rate', target: 8.5, current: 6.2, unit: '%' }
      ],
      tags: ['customer', 'modernization', 'experience']
    },
    {
      id: 'TI-002',
      name: 'Data Analytics Platform Consolidation',
      description: 'Consolidate multiple analytics platforms into unified data lakehouse architecture',
      status: 'Planning',
      priority: 'High',
      type: 'Technology Modernization',
      sponsor: 'Elena Rodriguez',
      programManager: 'David Kim',
      stakeholders: ['Data Engineering', 'Analytics', 'Business Intelligence', 'Finance'],
      startDate: '2024-09-01',
      targetDate: '2025-03-31',
      budget: 1800000,
      spentBudget: 150000,
      progressPercent: 15,
      healthStatus: 'Yellow',
      businessValue: 8500000,
      riskLevel: 'High',
      dependencies: ['Cloud Infrastructure Upgrade'],
      capabilities: ['Data Analytics & Intelligence'],
      milestones: [
        { name: 'Current State Assessment', targetDate: '2024-09-30', status: 'In Progress' },
        { name: 'Target Architecture Design', targetDate: '2024-10-31', status: 'Not Started' },
        { name: 'Migration Planning', targetDate: '2024-11-30', status: 'Not Started' },
        { name: 'Platform Implementation', targetDate: '2025-02-28', status: 'Not Started' },
        { name: 'Data Migration', targetDate: '2025-03-31', status: 'Not Started' }
      ],
      kpis: [
        { name: 'Data Processing Speed', target: 10, current: 3, unit: 'x faster' },
        { name: 'Operational Cost Reduction', target: 40, current: 0, unit: '%' },
        { name: 'Self-Service Analytics', target: 80, current: 35, unit: '%' }
      ],
      tags: ['data', 'analytics', 'consolidation']
    },
    {
      id: 'TI-003',
      name: 'Zero Trust Security Implementation',
      description: 'Implement comprehensive zero trust security architecture across all systems',
      status: 'In Progress',
      priority: 'Critical',
      type: 'Infrastructure Upgrade',
      sponsor: 'Michael Torres',
      programManager: 'Lisa Wang',
      stakeholders: ['Security', 'IT Operations', 'Compliance', 'All Departments'],
      startDate: '2024-07-01',
      targetDate: '2025-01-31',
      budget: 3200000,
      spentBudget: 1600000,
      progressPercent: 45,
      healthStatus: 'Yellow',
      businessValue: 12000000,
      riskLevel: 'High',
      dependencies: [],
      capabilities: ['Cybersecurity & Risk Management', 'Cloud Infrastructure Management'],
      milestones: [
        { name: 'Security Assessment', targetDate: '2024-08-15', status: 'Completed' },
        { name: 'Identity Management Rollout', targetDate: '2024-10-31', status: 'In Progress' },
        { name: 'Network Segmentation', targetDate: '2024-12-15', status: 'At Risk' },
        { name: 'Endpoint Protection', targetDate: '2025-01-15', status: 'Not Started' },
        { name: 'Compliance Validation', targetDate: '2025-01-31', status: 'Not Started' }
      ],
      kpis: [
        { name: 'Security Incidents', target: 5, current: 12, unit: 'per month' },
        { name: 'Compliance Score', target: 95, current: 78, unit: '%' },
        { name: 'Mean Time to Detect', target: 15, current: 45, unit: 'minutes' }
      ],
      tags: ['security', 'zero-trust', 'compliance']
    },
    {
      id: 'TI-004',
      name: 'Agile Transformation Program',
      description: 'Transform development practices to agile methodologies across all teams',
      status: 'Completed',
      priority: 'Medium',
      type: 'Organizational Change',
      sponsor: 'David Kim',
      programManager: 'Sarah Chen',
      stakeholders: ['Development', 'Product', 'QA', 'Project Management'],
      startDate: '2024-01-01',
      targetDate: '2024-06-30',
      actualEndDate: '2024-06-15',
      budget: 500000,
      spentBudget: 480000,
      progressPercent: 100,
      healthStatus: 'Green',
      businessValue: 3200000,
      riskLevel: 'Low',
      dependencies: [],
      capabilities: [],
      milestones: [
        { name: 'Training Program', targetDate: '2024-02-29', status: 'Completed' },
        { name: 'Pilot Team Implementation', targetDate: '2024-04-15', status: 'Completed' },
        { name: 'Organization Rollout', targetDate: '2024-06-15', status: 'Completed' },
        { name: 'Process Optimization', targetDate: '2024-06-30', status: 'Completed' }
      ],
      kpis: [
        { name: 'Development Velocity', target: 30, current: 35, unit: '% increase' },
        { name: 'Code Quality Score', target: 85, current: 88, unit: '%' },
        { name: 'Time to Market', target: 25, current: 30, unit: '% reduction' }
      ],
      tags: ['agile', 'transformation', 'methodology']
    }
  ];

  const filteredInitiatives = initiatives.filter(initiative => {
    const matchesSearch = searchQuery === '' || 
      initiative.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      initiative.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      initiative.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = selectedStatus === 'all' || initiative.status === selectedStatus;
    const matchesType = selectedType === 'all' || initiative.type === selectedType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'In Progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'Planning': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      case 'On Hold': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300';
      case 'Cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
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

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'Green': return 'bg-green-500';
      case 'Yellow': return 'bg-amber-500';
      case 'Red': return 'bg-red-500';
      default: return 'bg-slate-500';
    }
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'Green': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Yellow': return <Clock className="h-4 w-4 text-amber-600" />;
      case 'Red': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <BarChart3 className="h-4 w-4 text-slate-600" />;
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const overallStats = {
    totalInitiatives: initiatives.length,
    activeInitiatives: initiatives.filter(i => i.status === 'In Progress' || i.status === 'Planning').length,
    completedInitiatives: initiatives.filter(i => i.status === 'Completed').length,
    totalInvestment: initiatives.reduce((sum, i) => sum + i.budget, 0),
    totalBusinessValue: initiatives.reduce((sum, i) => sum + i.businessValue, 0),
    avgProgress: Math.round(initiatives.reduce((sum, i) => sum + i.progressPercent, 0) / initiatives.length),
    atRiskInitiatives: initiatives.filter(i => i.healthStatus === 'Red' || i.healthStatus === 'Yellow').length
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-emerald-800 dark:from-white dark:via-slate-200 dark:to-emerald-200 bg-clip-text text-transparent">
              Portfolio Management
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mt-2">
              Track and manage transformation initiatives across the enterprise
            </p>
          </div>
          <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white">
            <Plus className="h-4 w-4 mr-2" />
            New Initiative
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-6 mb-8">
          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Total Initiatives</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{overallStats.totalInitiatives}</p>
                </div>
                <Briefcase className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Active</p>
                  <p className="text-2xl font-bold text-blue-600">{overallStats.activeInitiatives}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{overallStats.completedInitiatives}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">At Risk</p>
                  <p className="text-2xl font-bold text-amber-600">{overallStats.atRiskInitiatives}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Investment</p>
                  <p className="text-lg font-bold text-purple-600">{formatCurrency(overallStats.totalInvestment / 1000000)}M</p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Business Value</p>
                  <p className="text-lg font-bold text-emerald-600">{formatCurrency(overallStats.totalBusinessValue / 1000000)}M</p>
                </div>
                <Target className="h-8 w-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Avg Progress</p>
                  <p className="text-2xl font-bold text-teal-600">{overallStats.avgProgress}%</p>
                </div>
                <BarChart3 className="h-8 w-8 text-teal-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search initiatives by name, description, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50"
              data-testid="input-search-initiatives"
            />
          </div>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-48 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Planning">Planning</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="On Hold">On Hold</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-56 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Digital Transformation">Digital Transformation</SelectItem>
              <SelectItem value="Process Improvement">Process Improvement</SelectItem>
              <SelectItem value="Technology Modernization">Technology Modernization</SelectItem>
              <SelectItem value="Organizational Change">Organizational Change</SelectItem>
              <SelectItem value="Infrastructure Upgrade">Infrastructure Upgrade</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Initiatives Grid */}
        <div className="space-y-6">
          {filteredInitiatives.map((initiative) => (
            <Card key={initiative.id} className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        {initiative.name}
                      </h3>
                      <Badge className={getStatusColor(initiative.status)}>{initiative.status}</Badge>
                      <Badge className={getPriorityColor(initiative.priority)} variant="outline">
                        {initiative.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                      {initiative.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
                      <span className="flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        {initiative.programManager}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {initiative.startDate} - {initiative.targetDate}
                      </span>
                      <span className="font-medium text-slate-900 dark:text-white">{initiative.id}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    {getHealthIcon(initiative.healthStatus)}
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      {initiative.healthStatus}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-600 dark:text-slate-300">Progress</span>
                        <span className="font-medium">{initiative.progressPercent}%</span>
                      </div>
                      <Progress value={initiative.progressPercent} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-600 dark:text-slate-300">Budget Utilization</span>
                        <span className="font-medium">
                          {Math.round((initiative.spentBudget / initiative.budget) * 100)}%
                        </span>
                      </div>
                      <Progress 
                        value={(initiative.spentBudget / initiative.budget) * 100} 
                        className="h-2" 
                      />
                      <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
                        <span>Spent: {formatCurrency(initiative.spentBudget)}</span>
                        <span>Budget: {formatCurrency(initiative.budget)}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-slate-900 dark:text-white text-sm">Key Metrics</h4>
                      {initiative.kpis.slice(0, 2).map((kpi, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-slate-600 dark:text-slate-300">{kpi.name}</span>
                          <span className="font-medium">
                            {kpi.current}{kpi.unit} / {kpi.target}{kpi.unit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-white text-sm mb-2">Current Milestones</h4>
                      <div className="space-y-2">
                        {initiative.milestones.filter(m => m.status === 'In Progress' || m.status === 'At Risk').slice(0, 3).map((milestone, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span className="text-slate-600 dark:text-slate-300 truncate">{milestone.name}</span>
                            <Badge 
                              variant="outline" 
                              className={
                                milestone.status === 'At Risk' 
                                  ? 'text-red-700 border-red-200 bg-red-50 dark:text-red-300 dark:border-red-800 dark:bg-red-900/20' 
                                  : 'text-blue-700 border-blue-200 bg-blue-50 dark:text-blue-300 dark:border-blue-800 dark:bg-blue-900/20'
                              }
                            >
                              {milestone.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-white text-sm mb-2">Business Impact</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600 dark:text-slate-300">Expected Value</span>
                          <span className="font-medium text-emerald-600">
                            {formatCurrency(initiative.businessValue)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600 dark:text-slate-300">ROI</span>
                          <span className="font-medium">
                            {Math.round((initiative.businessValue / initiative.budget - 1) * 100)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600 dark:text-slate-300">Risk Level</span>
                          <Badge className={getRiskColor(initiative.riskLevel)} variant="outline">
                            {initiative.riskLevel}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200/50 dark:border-slate-700/50 mt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center">
                        <Building className="h-3 w-3 mr-1" />
                        {initiative.stakeholders.length} stakeholders
                      </span>
                      {initiative.dependencies.length > 0 && (
                        <span className="flex items-center">
                          <GitBranch className="h-3 w-3 mr-1" />
                          {initiative.dependencies.length} dependencies
                        </span>
                      )}
                      {initiative.capabilities.length > 0 && (
                        <span className="flex items-center">
                          <Target className="h-3 w-3 mr-1" />
                          {initiative.capabilities.length} capabilities
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-1">
                      {initiative.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredInitiatives.length === 0 && (
          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
            <CardContent className="p-12 text-center">
              <Briefcase className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No initiatives found</h3>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                No transformation initiatives match your current filters.
              </p>
              <Button variant="outline">
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export function PortfolioPage() {
  return (
    <AppLayout>
      <PortfolioContent />
    </AppLayout>
  );
}

export default PortfolioPage;