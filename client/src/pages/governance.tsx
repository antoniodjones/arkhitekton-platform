import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  Users,
  FileText,
  Target,
  Scale,
  BookOpen,
  GitBranch,
  Home,
  Settings,
  Sparkles
} from 'lucide-react';

export function GovernancePage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('month');

  // Mock governance data - would come from backend
  const governanceMetrics = {
    overallScore: 87,
    complianceRate: 94,
    riskLevel: 'Medium',
    activeReviews: 12,
    pendingDecisions: 5,
    technicalDebt: 23
  };

  const riskAssessments = [
    {
      id: '1',
      title: 'Cloud Migration Strategy',
      riskLevel: 'High',
      score: 68,
      category: 'Technical',
      lastUpdated: '2 hours ago',
      owner: 'Architecture Team'
    },
    {
      id: '2', 
      title: 'Legacy System Integration',
      riskLevel: 'Medium',
      score: 75,
      category: 'Strategic',
      lastUpdated: '1 day ago',
      owner: 'Enterprise Architects'
    },
    {
      id: '3',
      title: 'Data Privacy Compliance',
      riskLevel: 'Low', 
      score: 92,
      category: 'Compliance',
      lastUpdated: '3 days ago',
      owner: 'Security Team'
    }
  ];

  const recentDecisions = [
    {
      id: 'ADR-001',
      title: 'Adopt Microservices Architecture',
      status: 'Approved',
      impact: 'High',
      technicalDebt: 'Low',
      decidedDate: '2024-08-29',
      architect: 'Sarah Chen'
    },
    {
      id: 'ADR-002', 
      title: 'Database Consolidation Strategy',
      status: 'Under Review',
      impact: 'Medium',
      technicalDebt: 'Medium',
      decidedDate: '2024-08-28',
      architect: 'Michael Torres'
    },
    {
      id: 'ADR-003',
      title: 'API Gateway Implementation',
      status: 'Approved',
      impact: 'High',
      technicalDebt: 'High',
      decidedDate: '2024-08-27',
      architect: 'Elena Rodriguez'
    }
  ];

  const policyCompliance = [
    { name: 'Security Standards', compliance: 98, trend: 'up' },
    { name: 'Data Governance', compliance: 89, trend: 'up' },
    { name: 'Cloud First Policy', compliance: 76, trend: 'down' },
    { name: 'API Standards', compliance: 94, trend: 'up' },
    { name: 'Documentation Requirements', compliance: 82, trend: 'up' }
  ];

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'medium': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'under review': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <header className="backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/50 dark:border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                    <div className="w-5 h-5 bg-white/90 rounded-lg transform rotate-45" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-800 dark:from-white dark:via-slate-200 dark:to-slate-300 bg-clip-text text-transparent tracking-tight">
                    ARKITEKTON
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium tracking-wide">GOVERNANCE</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
                  <Home className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Governance Overview */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-emerald-800 dark:from-white dark:via-slate-200 dark:to-emerald-200 bg-clip-text text-transparent">
                Enterprise Architecture Governance
              </h2>
              <p className="text-slate-600 dark:text-slate-300 mt-2">
                Monitor compliance, assess risks, and track architecture decisions across your enterprise
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <select 
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
              >
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="quarter">Last Quarter</option>
                <option value="year">Last Year</option>
              </select>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
            <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-300">Governance Score</p>
                    <p className="text-2xl font-bold text-emerald-600">{governanceMetrics.overallScore}%</p>
                  </div>
                  <Shield className="h-8 w-8 text-emerald-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-300">Compliance Rate</p>
                    <p className="text-2xl font-bold text-blue-600">{governanceMetrics.complianceRate}%</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-300">Risk Level</p>
                    <p className="text-2xl font-bold text-amber-600">{governanceMetrics.riskLevel}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-amber-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-300">Active Reviews</p>
                    <p className="text-2xl font-bold text-purple-600">{governanceMetrics.activeReviews}</p>
                  </div>
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-300">Pending Decisions</p>
                    <p className="text-2xl font-bold text-orange-600">{governanceMetrics.pendingDecisions}</p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-300">Technical Debt</p>
                    <p className="text-2xl font-bold text-red-600">{governanceMetrics.technicalDebt}</p>
                  </div>
                  <GitBranch className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="risks">Risk Assessment</TabsTrigger>
            <TabsTrigger value="policies">Policy Compliance</TabsTrigger>
            <TabsTrigger value="decisions">Decision Records</TabsTrigger>
            <TabsTrigger value="wiki">Governance Wiki</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Risk Summary */}
              <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-amber-600" />
                    Risk Assessment Summary
                  </CardTitle>
                  <CardDescription>Current architecture risks across the portfolio</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {riskAssessments.slice(0, 3).map((risk) => (
                      <div key={risk.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-slate-900 dark:text-white">{risk.title}</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-300">{risk.category} • {risk.lastUpdated}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <p className="text-sm font-medium">{risk.score}%</p>
                            <Badge className={getRiskColor(risk.riskLevel)}>{risk.riskLevel}</Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Decisions */}
              <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-blue-600" />
                    Recent Architecture Decisions
                  </CardTitle>
                  <CardDescription>Latest ADRs and their impact assessment</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentDecisions.slice(0, 3).map((decision) => (
                      <div key={decision.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-slate-900 dark:text-white">{decision.title}</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-300">{decision.id} • {decision.architect}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(decision.status)}>{decision.status}</Badge>
                          <Badge variant="outline" className="text-xs">
                            TD: {decision.technicalDebt}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="risks" className="space-y-6">
            <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
              <CardHeader>
                <CardTitle>Risk Assessment Framework</CardTitle>
                <CardDescription>Comprehensive risk analysis across all architecture domains</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {riskAssessments.map((risk) => (
                    <div key={risk.id} className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-slate-900 dark:text-white">{risk.title}</h4>
                        <Badge className={getRiskColor(risk.riskLevel)}>{risk.riskLevel}</Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600 dark:text-slate-300">Risk Score</span>
                          <span className="font-medium">{risk.score}%</span>
                        </div>
                        <Progress value={risk.score} className="h-2" />
                        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                          <span>{risk.category}</span>
                          <span>{risk.lastUpdated}</span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300">Owner: {risk.owner}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="policies" className="space-y-6">
            <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
              <CardHeader>
                <CardTitle>Policy Compliance Dashboard</CardTitle>
                <CardDescription>Monitor adherence to enterprise architecture standards and policies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {policyCompliance.map((policy, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-slate-900 dark:text-white">{policy.name}</h4>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">{policy.compliance}%</span>
                            {policy.trend === 'up' ? (
                              <TrendingUp className="h-4 w-4 text-green-600" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-red-600" />
                            )}
                          </div>
                        </div>
                        <Progress value={policy.compliance} className="h-3" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="decisions" className="space-y-6">
            <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Architecture Decision Records (ADRs)</CardTitle>
                    <CardDescription>Track design decisions, rationale, and technical debt impact</CardDescription>
                  </div>
                  <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white">
                    <FileText className="h-4 w-4 mr-2" />
                    New ADR
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentDecisions.map((decision) => (
                    <div key={decision.id} className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <h4 className="font-semibold text-slate-900 dark:text-white">{decision.title}</h4>
                          <Badge className={getStatusColor(decision.status)}>{decision.status}</Badge>
                        </div>
                        <span className="text-sm text-slate-500 dark:text-slate-400">{decision.id}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-slate-600 dark:text-slate-300">Impact: </span>
                          <span className="font-medium">{decision.impact}</span>
                        </div>
                        <div>
                          <span className="text-slate-600 dark:text-slate-300">Technical Debt: </span>
                          <span className="font-medium">{decision.technicalDebt}</span>
                        </div>
                        <div>
                          <span className="text-slate-600 dark:text-slate-300">Architect: </span>
                          <span className="font-medium">{decision.architect}</span>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                        Decided: {decision.decidedDate}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wiki" className="space-y-6">
            <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <BookOpen className="h-5 w-5 mr-2 text-emerald-600" />
                      Governance Wiki
                    </CardTitle>
                    <CardDescription>Document and maintain your organization's governance model and standards</CardDescription>
                  </div>
                  <Button variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Add Documentation
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                    <Scale className="h-8 w-8 text-blue-600 mb-3" />
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Governance Framework</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">Core governance principles and processes</p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                    <Target className="h-8 w-8 text-emerald-600 mb-3" />
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Architecture Standards</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">Technical standards and best practices</p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                    <Users className="h-8 w-8 text-purple-600 mb-3" />
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Review Processes</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">Architecture review board procedures</p>
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

export default GovernancePage;