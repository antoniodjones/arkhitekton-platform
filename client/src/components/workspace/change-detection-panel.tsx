import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bot, 
  AlertTriangle, 
  Code, 
  GitBranch, 
  FileText, 
  Clock, 
  Target, 
  Zap,
  Eye,
  Plus,
  RefreshCw,
  TrendingUp,
  Database,
  Settings
} from 'lucide-react';

interface ChangeDetection {
  id: string;
  changeType: 'code_change' | 'dependency_change' | 'configuration_change' | 'api_change';
  title: string;
  description: string;
  detectionMethod: 'automated_scan' | 'manual_report' | 'integration_webhook';
  sourceLocation: string;
  changedFiles: string[];
  impactAnalysis: {
    affectedComponents: string[];
    architecturalLayers: string[];
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    recommendedActions: string[];
  };
  confidence: number;
  detectedAt: string;
  status: 'new' | 'reviewed' | 'ticket_created' | 'ignored';
  ticketId?: string;
}

interface ChangeDetectionPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTicket: (change: ChangeDetection) => void;
}

export function ChangeDetectionPanel({ isOpen, onClose, onCreateTicket }: ChangeDetectionPanelProps) {
  const [activeTab, setActiveTab] = useState('recent');
  const [isScanning, setIsScanning] = useState(false);

  // Mock change detection data - would come from backend
  const recentChanges: ChangeDetection[] = [
    {
      id: 'CHG-001',
      changeType: 'api_change',
      title: 'Breaking Changes in Customer Service API',
      description: 'Detected removal of deprecated endpoints and modification of response schemas in CustomerService.API',
      detectionMethod: 'automated_scan',
      sourceLocation: 'src/services/customer/api/',
      changedFiles: ['CustomerController.cs', 'CustomerResponse.cs', 'ICustomerService.cs'],
      impactAnalysis: {
        affectedComponents: ['OrderService', 'BillingService', 'NotificationService', 'Mobile App', 'Web Portal'],
        architecturalLayers: ['application', 'integration', 'presentation'],
        riskLevel: 'critical',
        recommendedActions: [
          'Immediate impact assessment required',
          'Create architecture review ticket',
          'Notify downstream service owners',
          'Plan backward compatibility strategy'
        ]
      },
      confidence: 95,
      detectedAt: '2024-08-29T10:30:00Z',
      status: 'new'
    },
    {
      id: 'CHG-002',
      changeType: 'dependency_change',
      title: 'Security Vulnerability in Authentication Library',
      description: 'Critical security vulnerability detected in JWT authentication library (version 2.1.4 → 3.0.1 required)',
      detectionMethod: 'automated_scan',
      sourceLocation: 'package.json, packages.config',
      changedFiles: ['package.json', 'AuthenticationService.cs'],
      impactAnalysis: {
        affectedComponents: ['AuthenticationService', 'UserManagement', 'API Gateway'],
        architecturalLayers: ['security', 'application'],
        riskLevel: 'critical',
        recommendedActions: [
          'Immediate security review required',
          'Update dependency to secure version',
          'Security impact assessment',
          'Coordinate with security team'
        ]
      },
      confidence: 98,
      detectedAt: '2024-08-29T09:15:00Z',
      status: 'ticket_created',
      ticketId: 'TKT-005'
    },
    {
      id: 'CHG-003',
      changeType: 'configuration_change',
      title: 'Database Connection Pool Configuration Modified',
      description: 'Significant changes to database connection pooling settings detected in production configuration',
      detectionMethod: 'automated_scan',
      sourceLocation: 'config/database.json',
      changedFiles: ['database.json', 'connectionPool.config'],
      impactAnalysis: {
        affectedComponents: ['DataAccessLayer', 'UserService', 'OrderService'],
        architecturalLayers: ['data', 'application'],
        riskLevel: 'medium',
        recommendedActions: [
          'Performance impact assessment',
          'Load testing recommended',
          'Monitor connection metrics',
          'Review with DBA team'
        ]
      },
      confidence: 88,
      detectedAt: '2024-08-29T08:45:00Z',
      status: 'reviewed'
    },
    {
      id: 'CHG-004',
      changeType: 'code_change',
      title: 'New Data Processing Algorithm Implementation',
      description: 'Major changes to core data processing algorithms in analytics engine with potential performance implications',
      detectionMethod: 'automated_scan',
      sourceLocation: 'src/analytics/processing/',
      changedFiles: ['DataProcessor.cs', 'AnalyticsEngine.cs', 'MetricsCalculator.cs'],
      impactAnalysis: {
        affectedComponents: ['AnalyticsEngine', 'ReportingService', 'RealTimeDashboard'],
        architecturalLayers: ['application', 'data'],
        riskLevel: 'high',
        recommendedActions: [
          'Performance testing required',
          'Architecture review for scalability',
          'Update documentation',
          'Monitor system metrics'
        ]
      },
      confidence: 92,
      detectedAt: '2024-08-29T07:20:00Z',
      status: 'new'
    }
  ];

  const getChangeTypeIcon = (type: string) => {
    switch (type) {
      case 'api_change': return Code;
      case 'dependency_change': return Database;
      case 'configuration_change': return Settings;
      case 'code_change': return GitBranch;
      default: return FileText;
    }
  };

  const getChangeTypeColor = (type: string) => {
    switch (type) {
      case 'api_change': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'dependency_change': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      case 'configuration_change': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300';
      case 'code_change': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-300';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      case 'medium': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'reviewed': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300';
      case 'ticket_created': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'ignored': return 'bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-300';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-300';
    }
  };

  const handleScan = async () => {
    setIsScanning(true);
    // Simulate scanning process
    setTimeout(() => {
      setIsScanning(false);
    }, 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl h-[90vh] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50">
        <CardHeader className="border-b border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-lg flex items-center justify-center">
                <Bot className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">AI Change Detection</CardTitle>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Intelligent monitoring of code and architecture changes
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleScan}
                disabled={isScanning}
                className="bg-white/70 dark:bg-slate-800/70"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isScanning ? 'animate-spin' : ''}`} />
                {isScanning ? 'Scanning...' : 'Scan Now'}
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                ×
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 h-full">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-4 m-4 mb-0">
              <TabsTrigger value="recent">Recent Changes</TabsTrigger>
              <TabsTrigger value="high-risk">High Risk</TabsTrigger>
              <TabsTrigger value="tickets">Created Tickets</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            
            <div className="flex-1 overflow-hidden">
              <TabsContent value="recent" className="h-full m-0">
                <ScrollArea className="h-full p-4">
                  <div className="space-y-4">
                    {recentChanges.map((change) => {
                      const ChangeIcon = getChangeTypeIcon(change.changeType);
                      
                      return (
                        <Card key={change.id} className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-3 flex-1">
                                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-lg flex items-center justify-center">
                                  <ChangeIcon className="h-4 w-4 text-emerald-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                                    {change.title}
                                  </h3>
                                  <div className="flex items-center space-x-2 mb-2">
                                    <Badge className={getChangeTypeColor(change.changeType)} variant="outline">
                                      {change.changeType.replace('_', ' ')}
                                    </Badge>
                                    <Badge className={getRiskColor(change.impactAnalysis.riskLevel)}>
                                      {change.impactAnalysis.riskLevel} risk
                                    </Badge>
                                    <Badge className={getStatusColor(change.status)} variant="outline">
                                      {change.status.replace('_', ' ')}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                                    {change.description}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2 ml-4">
                                <div className="text-right">
                                  <div className="text-sm font-medium text-slate-900 dark:text-white">
                                    {change.confidence}% confidence
                                  </div>
                                  <div className="text-xs text-slate-500 dark:text-slate-400">
                                    {new Date(change.detectedAt).toLocaleString()}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium text-slate-900 dark:text-white text-sm mb-2">Impact Analysis</h4>
                                <div className="space-y-2 text-sm">
                                  <div>
                                    <span className="text-slate-600 dark:text-slate-300">Affected Components:</span>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {change.impactAnalysis.affectedComponents.slice(0, 3).map((component, index) => (
                                        <Badge key={index} variant="outline" className="text-xs">
                                          {component}
                                        </Badge>
                                      ))}
                                      {change.impactAnalysis.affectedComponents.length > 3 && (
                                        <span className="text-xs text-slate-500 dark:text-slate-400">
                                          +{change.impactAnalysis.affectedComponents.length - 3} more
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div>
                                    <span className="text-slate-600 dark:text-slate-300">Location:</span>
                                    <span className="font-mono text-xs ml-2 text-slate-900 dark:text-white">
                                      {change.sourceLocation}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="font-medium text-slate-900 dark:text-white text-sm mb-2">Recommended Actions</h4>
                                <ul className="space-y-1 text-sm">
                                  {change.impactAnalysis.recommendedActions.slice(0, 3).map((action, index) => (
                                    <li key={index} className="flex items-start">
                                      <span className="w-1 h-1 bg-emerald-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                                      <span className="text-slate-600 dark:text-slate-300">{action}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between pt-4 border-t border-slate-200/50 dark:border-slate-700/50 mt-4">
                              <div className="flex items-center space-x-3 text-xs text-slate-500 dark:text-slate-400">
                                <span className="flex items-center">
                                  <FileText className="h-3 w-3 mr-1" />
                                  {change.changedFiles.length} files
                                </span>
                                <span className="flex items-center">
                                  <Target className="h-3 w-3 mr-1" />
                                  {change.impactAnalysis.affectedComponents.length} components
                                </span>
                                {change.ticketId && (
                                  <span className="flex items-center">
                                    <Eye className="h-3 w-3 mr-1" />
                                    Ticket {change.ticketId}
                                  </span>
                                )}
                              </div>
                              <div className="flex space-x-2">
                                {change.status === 'new' && (
                                  <Button
                                    size="sm"
                                    onClick={() => onCreateTicket(change)}
                                    className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
                                  >
                                    <Plus className="h-3 w-3 mr-1" />
                                    Create Ticket
                                  </Button>
                                )}
                                <Button variant="outline" size="sm">
                                  <Eye className="h-3 w-3 mr-1" />
                                  View Details
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="high-risk" className="h-full m-0">
                <ScrollArea className="h-full p-4">
                  <div className="space-y-4">
                    {recentChanges
                      .filter(change => change.impactAnalysis.riskLevel === 'critical' || change.impactAnalysis.riskLevel === 'high')
                      .map((change) => {
                        const ChangeIcon = getChangeTypeIcon(change.changeType);
                        
                        return (
                          <Card key={change.id} className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-red-200/50 dark:border-red-700/50">
                            <CardHeader className="pb-3">
                              <div className="flex items-center space-x-3">
                                <AlertTriangle className="h-5 w-5 text-red-600" />
                                <div>
                                  <h3 className="font-semibold text-slate-900 dark:text-white">
                                    {change.title}
                                  </h3>
                                  <p className="text-sm text-slate-600 dark:text-slate-300">
                                    {change.description}
                                  </p>
                                </div>
                              </div>
                            </CardHeader>
                          </Card>
                        );
                      })}
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="tickets" className="h-full m-0">
                <ScrollArea className="h-full p-4">
                  <div className="space-y-4">
                    {recentChanges
                      .filter(change => change.status === 'ticket_created')
                      .map((change) => (
                        <Card key={change.id} className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold text-slate-900 dark:text-white">
                                {change.title}
                              </h3>
                              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                                Ticket {change.ticketId}
                              </Badge>
                            </div>
                          </CardHeader>
                        </Card>
                      ))}
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="analytics" className="h-full m-0">
                <ScrollArea className="h-full p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg">Detection Summary</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600 dark:text-slate-300">Total Changes</span>
                            <span className="font-semibold text-slate-900 dark:text-white">{recentChanges.length}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600 dark:text-slate-300">High Risk</span>
                            <span className="font-semibold text-red-600">
                              {recentChanges.filter(c => c.impactAnalysis.riskLevel === 'critical' || c.impactAnalysis.riskLevel === 'high').length}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600 dark:text-slate-300">Tickets Created</span>
                            <span className="font-semibold text-green-600">
                              {recentChanges.filter(c => c.status === 'ticket_created').length}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg">Detection Trends</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="h-5 w-5 text-emerald-600" />
                          <span className="text-sm text-slate-600 dark:text-slate-300">
                            15% increase in automated detections this week
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg">Confidence Score</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-emerald-600">
                          {Math.round(recentChanges.reduce((sum, c) => sum + c.confidence, 0) / recentChanges.length)}%
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-300">Average detection confidence</p>
                      </CardContent>
                    </Card>
                  </div>
                </ScrollArea>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}