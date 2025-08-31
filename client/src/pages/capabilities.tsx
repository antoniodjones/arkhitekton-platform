import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Target, 
  Plus, 
  Search, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Users,
  Building,
  Zap,
  Shield,
  Database,
  Code,
  Globe
} from 'lucide-react';
import { AppLayout } from '@/components/layout/app-layout';

interface BusinessCapability {
  id: string;
  name: string;
  description: string;
  level: 'L1' | 'L2' | 'L3';
  parentId?: string;
  maturityLevel: 'Initial' | 'Developing' | 'Defined' | 'Managed' | 'Optimizing';
  businessValue: 'Low' | 'Medium' | 'High' | 'Critical';
  technicalHealth: 'Poor' | 'Fair' | 'Good' | 'Excellent';
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  owner: string;
  stakeholders: string[];
  supportingApplications: string[];
  investmentLevel: 'Under-invested' | 'Adequate' | 'Over-invested';
  transformationPriority: 'Low' | 'Medium' | 'High' | 'Critical';
  lastAssessed: string;
  tags: string[];
  metrics: {
    availabilityPercent: number;
    performanceScore: number;
    securityScore: number;
    complianceScore: number;
  };
}

function CapabilitiesContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedMaturity, setSelectedMaturity] = useState<string>('all');
  const [selectedView, setSelectedView] = useState<'hierarchy' | 'matrix' | 'heatmap'>('hierarchy');

  // Mock capability data - would come from backend
  const capabilities: BusinessCapability[] = [
    {
      id: 'CAP-001',
      name: 'Customer Experience Management',
      description: 'End-to-end customer journey orchestration and experience optimization',
      level: 'L1',
      maturityLevel: 'Defined',
      businessValue: 'Critical',
      technicalHealth: 'Good',
      riskLevel: 'Medium',
      owner: 'Sarah Chen',
      stakeholders: ['Marketing', 'Sales', 'Customer Success'],
      supportingApplications: ['CRM', 'Marketing Automation', 'Analytics Platform'],
      investmentLevel: 'Adequate',
      transformationPriority: 'High',
      lastAssessed: '2024-08-15',
      tags: ['customer', 'experience', 'journey'],
      metrics: {
        availabilityPercent: 99.5,
        performanceScore: 85,
        securityScore: 92,
        complianceScore: 88
      }
    },
    {
      id: 'CAP-002',
      name: 'Digital Commerce',
      description: 'Online sales channels and e-commerce platform capabilities',
      level: 'L2',
      parentId: 'CAP-001',
      maturityLevel: 'Managed',
      businessValue: 'High',
      technicalHealth: 'Excellent',
      riskLevel: 'Low',
      owner: 'Michael Torres',
      stakeholders: ['E-commerce', 'Product', 'Finance'],
      supportingApplications: ['E-commerce Platform', 'Payment Gateway', 'Inventory Management'],
      investmentLevel: 'Over-invested',
      transformationPriority: 'Medium',
      lastAssessed: '2024-08-20',
      tags: ['commerce', 'sales', 'digital'],
      metrics: {
        availabilityPercent: 99.9,
        performanceScore: 95,
        securityScore: 98,
        complianceScore: 95
      }
    },
    {
      id: 'CAP-003',
      name: 'Data Analytics & Intelligence',
      description: 'Business intelligence, analytics, and data-driven decision making',
      level: 'L1',
      maturityLevel: 'Developing',
      businessValue: 'High',
      technicalHealth: 'Fair',
      riskLevel: 'High',
      owner: 'Elena Rodriguez',
      stakeholders: ['Analytics', 'Data Science', 'Business Intelligence'],
      supportingApplications: ['Data Warehouse', 'BI Platform', 'Analytics Tools'],
      investmentLevel: 'Under-invested',
      transformationPriority: 'Critical',
      lastAssessed: '2024-08-10',
      tags: ['analytics', 'intelligence', 'data'],
      metrics: {
        availabilityPercent: 96.2,
        performanceScore: 72,
        securityScore: 85,
        complianceScore: 78
      }
    },
    {
      id: 'CAP-004',
      name: 'Cybersecurity & Risk Management',
      description: 'Enterprise security, threat detection, and risk mitigation capabilities',
      level: 'L1',
      maturityLevel: 'Managed',
      businessValue: 'Critical',
      technicalHealth: 'Good',
      riskLevel: 'Medium',
      owner: 'David Kim',
      stakeholders: ['Security', 'IT', 'Compliance'],
      supportingApplications: ['SIEM', 'Identity Management', 'Security Tools'],
      investmentLevel: 'Adequate',
      transformationPriority: 'High',
      lastAssessed: '2024-08-25',
      tags: ['security', 'risk', 'compliance'],
      metrics: {
        availabilityPercent: 99.7,
        performanceScore: 88,
        securityScore: 96,
        complianceScore: 92
      }
    },
    {
      id: 'CAP-005',
      name: 'Cloud Infrastructure Management',
      description: 'Cloud platform operations, scaling, and infrastructure optimization',
      level: 'L2',
      parentId: 'CAP-004',
      maturityLevel: 'Optimizing',
      businessValue: 'High',
      technicalHealth: 'Excellent',
      riskLevel: 'Low',
      owner: 'Lisa Wang',
      stakeholders: ['Infrastructure', 'DevOps', 'Platform Engineering'],
      supportingApplications: ['Cloud Console', 'Monitoring Tools', 'Automation Platform'],
      investmentLevel: 'Adequate',
      transformationPriority: 'Medium',
      lastAssessed: '2024-08-28',
      tags: ['cloud', 'infrastructure', 'automation'],
      metrics: {
        availabilityPercent: 99.95,
        performanceScore: 94,
        securityScore: 93,
        complianceScore: 89
      }
    }
  ];

  const filteredCapabilities = capabilities.filter(capability => {
    const matchesSearch = searchQuery === '' || 
      capability.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      capability.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      capability.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesLevel = selectedLevel === 'all' || capability.level === selectedLevel;
    const matchesMaturity = selectedMaturity === 'all' || capability.maturityLevel === selectedMaturity;
    
    return matchesSearch && matchesLevel && matchesMaturity;
  });

  const getMaturityColor = (maturity: string) => {
    switch (maturity) {
      case 'Initial': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'Developing': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      case 'Defined': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300';
      case 'Managed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'Optimizing': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-300';
    }
  };

  const getBusinessValueColor = (value: string) => {
    switch (value) {
      case 'Critical': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      case 'High': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'Medium': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300';
      case 'Low': return 'bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-300';
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

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'Excellent': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Good': return <TrendingUp className="h-4 w-4 text-blue-600" />;
      case 'Fair': return <TrendingDown className="h-4 w-4 text-amber-600" />;
      case 'Poor': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <BarChart3 className="h-4 w-4 text-slate-600" />;
    }
  };

  const overallStats = {
    totalCapabilities: capabilities.length,
    criticalValue: capabilities.filter(c => c.businessValue === 'Critical').length,
    highRisk: capabilities.filter(c => c.riskLevel === 'High' || c.riskLevel === 'Critical').length,
    underInvested: capabilities.filter(c => c.investmentLevel === 'Under-invested').length,
    avgMaturity: Math.round(capabilities.reduce((sum, c) => {
      const maturityScore = { 'Initial': 1, 'Developing': 2, 'Defined': 3, 'Managed': 4, 'Optimizing': 5 }[c.maturityLevel] || 0;
      return sum + maturityScore;
    }, 0) / capabilities.length * 20) // Convert to percentage
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-emerald-800 dark:from-white dark:via-slate-200 dark:to-emerald-200 bg-clip-text text-transparent">
              Business Capability Assessment
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mt-2">
              Evaluate, track, and optimize your organization's business capabilities
            </p>
          </div>
          <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white">
            <Plus className="h-4 w-4 mr-2" />
            New Assessment
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Total Capabilities</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{overallStats.totalCapabilities}</p>
                </div>
                <Target className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Critical Value</p>
                  <p className="text-2xl font-bold text-purple-600">{overallStats.criticalValue}</p>
                </div>
                <Building className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">High Risk</p>
                  <p className="text-2xl font-bold text-red-600">{overallStats.highRisk}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Under-invested</p>
                  <p className="text-2xl font-bold text-amber-600">{overallStats.underInvested}</p>
                </div>
                <TrendingDown className="h-8 w-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Avg Maturity</p>
                  <p className="text-2xl font-bold text-green-600">{overallStats.avgMaturity}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search capabilities by name, description, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50"
              data-testid="input-search-capabilities"
            />
          </div>
          <Select value={selectedLevel} onValueChange={setSelectedLevel}>
            <SelectTrigger className="w-40 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="L1">Level 1</SelectItem>
              <SelectItem value="L2">Level 2</SelectItem>
              <SelectItem value="L3">Level 3</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedMaturity} onValueChange={setSelectedMaturity}>
            <SelectTrigger className="w-48 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
              <SelectValue placeholder="Maturity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Maturity</SelectItem>
              <SelectItem value="Initial">Initial</SelectItem>
              <SelectItem value="Developing">Developing</SelectItem>
              <SelectItem value="Defined">Defined</SelectItem>
              <SelectItem value="Managed">Managed</SelectItem>
              <SelectItem value="Optimizing">Optimizing</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Capabilities List */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {filteredCapabilities.map((capability) => (
            <Card key={capability.id} className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        {capability.name}
                      </h3>
                      <Badge variant="outline" className="text-xs">
                        {capability.level}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                      {capability.description}
                    </p>
                    <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                      <Users className="h-3 w-3" />
                      <span>{capability.owner}</span>
                      <span>•</span>
                      <span>Assessed {capability.lastAssessed}</span>
                    </div>
                  </div>
                  {getHealthIcon(capability.technicalHealth)}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-slate-600 dark:text-slate-300">Maturity</span>
                        <Badge className={getMaturityColor(capability.maturityLevel)} variant="outline">
                          {capability.maturityLevel}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-slate-600 dark:text-slate-300">Business Value</span>
                        <Badge className={getBusinessValueColor(capability.businessValue)} variant="outline">
                          {capability.businessValue}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-slate-600 dark:text-slate-300">Risk Level</span>
                        <Badge className={getRiskColor(capability.riskLevel)} variant="outline">
                          {capability.riskLevel}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-slate-600 dark:text-slate-300">Investment</span>
                        <span className="text-xs font-medium text-slate-900 dark:text-white">
                          {capability.investmentLevel}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600 dark:text-slate-300">Performance</span>
                      <span className="font-medium">{capability.metrics.performanceScore}%</span>
                    </div>
                    <Progress value={capability.metrics.performanceScore} className="h-1" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600 dark:text-slate-300">Security</span>
                      <span className="font-medium">{capability.metrics.securityScore}%</span>
                    </div>
                    <Progress value={capability.metrics.securityScore} className="h-1" />
                  </div>

                  <div className="pt-3 border-t border-slate-200/50 dark:border-slate-700/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
                        <Database className="h-3 w-3" />
                        <span>{capability.supportingApplications.length} apps</span>
                        <span>•</span>
                        <span>{capability.stakeholders.length} stakeholders</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {capability.tags.slice(0, 2).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {capability.tags.length > 2 && (
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            +{capability.tags.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCapabilities.length === 0 && (
          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
            <CardContent className="p-12 text-center">
              <Target className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No capabilities found</h3>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                No business capabilities match your current filters.
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

export function CapabilitiesPage() {
  return (
    <AppLayout>
      <CapabilitiesContent />
    </AppLayout>
  );
}

export default CapabilitiesPage;