import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import { 
  ArrowLeft,
  ArrowRight,
  Cloud,
  Server,
  Database,
  Shield,
  Zap,
  Globe,
  Network,
  Code,
  Monitor,
  Users,
  Lock,
  TrendingUp,
  Layers,
  GitBranch,
  Activity,
  Cpu,
  HardDrive,
  CloudDrizzle,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  Clock,
  Settings,
  Building,
  Key,
  FileText
} from "lucide-react";

export default function ArkhitektonArchitectureAzure() {
  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-indigo-50/20 to-cyan-50/30 dark:from-blue-950/10 dark:via-indigo-950/5 dark:to-cyan-950/10">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center mb-6">
              <Link href="/arkhitekton-architecture">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 mr-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Overview
                </Button>
              </Link>
              <div className="p-2 rounded-lg bg-white/20">
                <Cloud className="h-6 w-6" />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold mb-4">ARKHITEKTON on Microsoft Azure</h1>
            <p className="text-xl text-blue-100 max-w-4xl">
              Enterprise-first architecture leveraging Azure's deep Microsoft ecosystem integration, advanced hybrid cloud 
              capabilities, and enterprise-grade identity management for seamless organizational deployment.
            </p>
            
            <div className="flex items-center mt-6 space-x-6">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                60+ Regions Worldwide
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                Azure AD Integration
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                Hybrid Cloud Ready
              </Badge>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-12">
          
          {/* Architecture Overview */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">Architecture Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Building className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Enterprise Integration</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Deep Microsoft ecosystem integration with Office 365 and Teams</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Network className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Hybrid Cloud</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Seamless on-premises to cloud integration with Azure Arc</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800">
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Key className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Zero Trust Security</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Azure AD with conditional access and identity protection</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border-orange-200 dark:border-orange-800">
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Zap className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Cognitive Services</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Azure OpenAI Service with enterprise data protection</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Detailed Architecture Tabs */}
          <Tabs defaultValue="infrastructure" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 h-auto">
              <TabsTrigger value="infrastructure" className="flex flex-col items-center p-3">
                <Server className="h-4 w-4 mb-1" />
                <span className="text-xs">Infrastructure</span>
              </TabsTrigger>
              <TabsTrigger value="data" className="flex flex-col items-center p-3">
                <Database className="h-4 w-4 mb-1" />
                <span className="text-xs">Data Layer</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex flex-col items-center p-3">
                <Shield className="h-4 w-4 mb-1" />
                <span className="text-xs">Security</span>
              </TabsTrigger>
              <TabsTrigger value="ai" className="flex flex-col items-center p-3">
                <Zap className="h-4 w-4 mb-1" />
                <span className="text-xs">AI/ML</span>
              </TabsTrigger>
              <TabsTrigger value="devops" className="flex flex-col items-center p-3">
                <GitBranch className="h-4 w-4 mb-1" />
                <span className="text-xs">DevOps</span>
              </TabsTrigger>
              <TabsTrigger value="costs" className="flex flex-col items-center p-3">
                <DollarSign className="h-4 w-4 mb-1" />
                <span className="text-xs">Cost Model</span>
              </TabsTrigger>
            </TabsList>

            {/* Infrastructure Architecture */}
            <TabsContent value="infrastructure" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Server className="h-5 w-5 mr-2 text-blue-600" />
                    Containerized Infrastructure & Networking
                  </CardTitle>
                  <CardDescription>
                    Azure Container Apps with global load balancing and intelligent auto-scaling for enterprise workloads
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* Frontend Tier */}
                  <div className="border border-blue-200 dark:border-blue-800 rounded-lg p-6 bg-gradient-to-r from-blue-50/50 to-cyan-50/50 dark:from-blue-950/10 dark:to-cyan-950/10">
                    <h4 className="text-lg font-semibold mb-4 text-blue-900 dark:text-blue-100 flex items-center">
                      <Globe className="h-4 w-4 mr-2" />
                      Frontend Tier - Azure Front Door CDN
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded border">
                          <span className="font-medium">Azure Front Door</span>
                          <Badge variant="outline">Global CDN</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded border">
                          <span className="font-medium">React 18 SPA (Blob Storage)</span>
                          <Badge variant="outline">Static Hosting</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded border">
                          <span className="font-medium">Azure DNS</span>
                          <Badge variant="outline">99.99% SLA</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded border">
                          <span className="font-medium">Custom Domains</span>
                          <Badge variant="outline">SSL/TLS</Badge>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h5 className="font-medium text-slate-900 dark:text-white">Enterprise Features:</h5>
                        <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                          <li>• 120+ global edge locations</li>
                          <li>• Anycast IP for performance</li>
                          <li>• Web Application Firewall integration</li>
                          <li>• Real-time metrics and analytics</li>
                          <li>• Azure AD authentication at edge</li>
                          <li>• Traffic acceleration &amp; compression</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Application Tier */}
                  <div className="border border-indigo-200 dark:border-indigo-800 rounded-lg p-6 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/10 dark:to-purple-950/10">
                    <h4 className="text-lg font-semibold mb-4 text-indigo-900 dark:text-indigo-100 flex items-center">
                      <Layers className="h-4 w-4 mr-2" />
                      Application Tier - Container Apps Environment
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h5 className="font-medium text-slate-900 dark:text-white">Microservices Architecture</h5>
                        <div className="space-y-2">
                          <div className="p-3 bg-white dark:bg-slate-800 rounded border">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">API Gateway Service</span>
                              <Badge variant="secondary">Express.js</Badge>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">RESTful API with Azure AD authentication and request routing</p>
                          </div>
                          <div className="p-3 bg-white dark:bg-slate-800 rounded border">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">Architecture Engine</span>
                              <Badge variant="secondary">Node.js</Badge>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Diagram processing, template management, and enterprise integration</p>
                          </div>
                          <div className="p-3 bg-white dark:bg-slate-800 rounded border">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">Collaboration Hub</span>
                              <Badge variant="secondary">SignalR</Badge>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Real-time collaboration with Microsoft Teams integration</p>
                          </div>
                          <div className="p-3 bg-white dark:bg-slate-800 rounded border">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">Enterprise Sync</span>
                              <Badge variant="secondary">Integration</Badge>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Office 365, SharePoint, and Power Platform integration</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h5 className="font-medium text-slate-900 dark:text-white">Container Orchestration</h5>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded border">
                            <span className="font-medium">Container Apps</span>
                            <Badge variant="outline">Serverless</Badge>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded border">
                            <span className="font-medium">Application Gateway</span>
                            <Badge variant="outline">Layer 7 LB</Badge>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded border">
                            <span className="font-medium">KEDA Auto-scaling</span>
                            <Badge variant="outline">Event-driven</Badge>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded border">
                            <span className="font-medium">Dapr Integration</span>
                            <Badge variant="outline">Service Mesh</Badge>
                          </div>
                        </div>
                        <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/20 rounded border border-green-200 dark:border-green-800">
                          <h6 className="font-medium text-green-900 dark:text-green-100 mb-2">Scaling Parameters</h6>
                          <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                            <li>• CPU utilization &gt; 70%</li>
                            <li>• Memory usage &gt; 80%</li>
                            <li>• HTTP queue length &gt; 100</li>
                            <li>• Custom metrics via Application Insights</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Network Architecture */}
                  <div className="border border-purple-200 dark:border-purple-800 rounded-lg p-6 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-950/10 dark:to-pink-950/10">
                    <h4 className="text-lg font-semibold mb-4 text-purple-900 dark:text-purple-100 flex items-center">
                      <Network className="h-4 w-4 mr-2" />
                      Virtual Network & Hybrid Connectivity
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <Card className="bg-white/50 dark:bg-slate-800/50">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">Public Subnet</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0 space-y-2">
                          <div className="text-xs text-slate-600 dark:text-slate-400">
                            • Application Gateway<br/>
                            • Load Balancers<br/>
                            • NAT Gateway<br/>
                            • Public IP addresses
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-white/50 dark:bg-slate-800/50">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">Private Subnet</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0 space-y-2">
                          <div className="text-xs text-slate-600 dark:text-slate-400">
                            • Container Apps<br/>
                            • Function Apps<br/>
                            • Private Endpoints<br/>
                            • Service Bus
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-white/50 dark:bg-slate-800/50">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">Data Subnet</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0 space-y-2">
                          <div className="text-xs text-slate-600 dark:text-slate-400">
                            • PostgreSQL Database<br/>
                            • Cosmos DB<br/>
                            • Redis Cache<br/>
                            • Private connectivity only
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded border border-blue-200 dark:border-blue-800">
                      <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-3">Hybrid Cloud Connectivity</h5>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm">
                        <div>
                          <h6 className="font-medium text-slate-900 dark:text-white mb-2">Azure ExpressRoute</h6>
                          <ul className="text-blue-700 dark:text-blue-300 space-y-1">
                            <li>• Dedicated private connectivity</li>
                            <li>• Up to 100 Gbps bandwidth</li>
                            <li>• 99.95% availability SLA</li>
                            <li>• Microsoft peering for Office 365</li>
                          </ul>
                        </div>
                        <div>
                          <h6 className="font-medium text-slate-900 dark:text-white mb-2">VPN Gateway</h6>
                          <ul className="text-blue-700 dark:text-blue-300 space-y-1">
                            <li>• Site-to-site VPN connections</li>
                            <li>• Point-to-site for remote users</li>
                            <li>• IPsec/IKE protocols</li>
                            <li>• Active-active configuration</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Data Architecture */}
            <TabsContent value="data" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Database className="h-5 w-5 mr-2 text-indigo-600" />
                    Enterprise Data Platform
                  </CardTitle>
                  <CardDescription>
                    Multi-modal data architecture combining relational, NoSQL, and analytics with enterprise governance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* Primary Database */}
                  <div className="border border-indigo-200 dark:border-indigo-800 rounded-lg p-6 bg-gradient-to-r from-indigo-50/50 to-blue-50/50 dark:from-indigo-950/10 dark:to-blue-950/10">
                    <h4 className="text-lg font-semibold mb-4 text-indigo-900 dark:text-indigo-100 flex items-center">
                      <Database className="h-4 w-4 mr-2" />
                      Azure Database for PostgreSQL - Flexible Server
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="p-4 bg-white dark:bg-slate-800 rounded border">
                          <h5 className="font-medium mb-3 text-slate-900 dark:text-white">Enterprise Data Models</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Architecture Models &amp; Metadata</span>
                              <Badge variant="outline" className="text-xs">JSONB</Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>User &amp; Organization Management</span>
                              <Badge variant="outline" className="text-xs">Relational</Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Project &amp; Workspace Data</span>
                              <Badge variant="outline" className="text-xs">Structured</Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Audit Logs &amp; Compliance</span>
                              <Badge variant="outline" className="text-xs">Time-series</Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-white dark:bg-slate-800 rounded border">
                          <h5 className="font-medium mb-3 text-slate-900 dark:text-white">Enterprise Features</h5>
                          <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                            <li>• Zone-redundant high availability</li>
                            <li>• Read replicas for global scale</li>
                            <li>• Automated backups with PITR</li>
                            <li>• Azure AD authentication integration</li>
                            <li>• Advanced Threat Protection</li>
                            <li>• Intelligent Performance insights</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="p-4 bg-white dark:bg-slate-800 rounded border">
                          <h5 className="font-medium mb-3 text-slate-900 dark:text-white">Configuration Specifications</h5>
                          <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                              <span className="text-slate-600 dark:text-slate-400">Compute Tier</span>
                              <span className="font-medium">General Purpose</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600 dark:text-slate-400">Instance Size</span>
                              <span className="font-medium">D8s v3 (8 vCores)</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600 dark:text-slate-400">Storage</span>
                              <span className="font-medium">1TB Premium SSD</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600 dark:text-slate-400">IOPS</span>
                              <span className="font-medium">3,000 baseline + burst</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600 dark:text-slate-400">Backup Retention</span>
                              <span className="font-medium">35 days</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded border border-green-200 dark:border-green-800">
                          <h5 className="font-medium mb-2 text-green-900 dark:text-green-100">High Availability</h5>
                          <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                            <li>• Zone-redundant deployment</li>
                            <li>• Automatic failover in 60-120s</li>
                            <li>• Read replica in secondary region</li>
                            <li>• 99.99% availability SLA</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* NoSQL Database */}
                  <div className="border border-purple-200 dark:border-purple-800 rounded-lg p-6 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-950/10 dark:to-pink-950/10">
                    <h4 className="text-lg font-semibold mb-4 text-purple-900 dark:text-purple-100 flex items-center">
                      <CloudDrizzle className="h-4 w-4 mr-2" />
                      Azure Cosmos DB - Global Distribution
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <div className="space-y-3">
                        <h5 className="font-medium text-slate-900 dark:text-white">Real-time Collaboration</h5>
                        <div className="p-3 bg-white dark:bg-slate-800 rounded border text-sm">
                          <div className="space-y-2">
                            <div>• Live cursor tracking</div>
                            <div>• Real-time diagram updates</div>
                            <div>• Presence indicators</div>
                            <div>• Comment synchronization</div>
                            <div>• Teams activity feeds</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h5 className="font-medium text-slate-900 dark:text-white">Session Management</h5>
                        <div className="p-3 bg-white dark:bg-slate-800 rounded border text-sm">
                          <div className="space-y-2">
                            <div>• User session state</div>
                            <div>• Workspace preferences</div>
                            <div>• Recent activity tracking</div>
                            <div>• Cache layer for frequently accessed data</div>
                            <div>• Global session replication</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h5 className="font-medium text-slate-900 dark:text-white">Global Distribution</h5>
                        <div className="p-3 bg-white dark:bg-slate-800 rounded border text-sm">
                          <div className="space-y-2">
                            <div>• Multi-region write capability</div>
                            <div>• &lt; 10ms read latency</div>
                            <div>• Automatic conflict resolution</div>
                            <div>• 99.999% availability SLA</div>
                            <div>• Elastic scaling</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Storage & Analytics */}
                  <div className="border border-green-200 dark:border-green-800 rounded-lg p-6 bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-950/10 dark:to-emerald-950/10">
                    <h4 className="text-lg font-semibold mb-4 text-green-900 dark:text-green-100 flex items-center">
                      <HardDrive className="h-4 w-4 mr-2" />
                      Azure Storage &amp; Data Lake Analytics
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                      <Card className="bg-white/50 dark:bg-slate-800/50">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">Blob Storage</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                            <div>• Static web hosting</div>
                            <div>• Component libraries</div>
                            <div>• Template repositories</div>
                            <div>• CDN optimized</div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-white/50 dark:bg-slate-800/50">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">Files Premium</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                            <div>• Enterprise file shares</div>
                            <div>• SharePoint integration</div>
                            <div>• OneDrive sync</div>
                            <div>• AD authentication</div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-white/50 dark:bg-slate-800/50">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">Data Lake Gen2</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                            <div>• Analytics data warehouse</div>
                            <div>• Usage pattern analysis</div>
                            <div>• Architecture insights</div>
                            <div>• Power BI integration</div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-white/50 dark:bg-slate-800/50">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">Queue Storage</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                            <div>• Event processing</div>
                            <div>• Export job queues</div>
                            <div>• Notification delivery</div>
                            <div>• Service Bus integration</div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded border border-blue-200 dark:border-blue-800">
                      <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-3">Enterprise Integration</h5>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm">
                        <div>
                          <h6 className="font-medium text-slate-900 dark:text-white mb-2">Microsoft 365 Integration</h6>
                          <ul className="text-blue-700 dark:text-blue-300 space-y-1">
                            <li>• Teams app integration</li>
                            <li>• SharePoint document libraries</li>
                            <li>• OneDrive for Business sync</li>
                            <li>• Outlook calendar integration</li>
                          </ul>
                        </div>
                        <div>
                          <h6 className="font-medium text-slate-900 dark:text-white mb-2">Power Platform Integration</h6>
                          <ul className="text-blue-700 dark:text-blue-300 space-y-1">
                            <li>• Power BI dashboards</li>
                            <li>• Power Automate workflows</li>
                            <li>• Power Apps mobile clients</li>
                            <li>• Common Data Service</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Architecture */}
            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-blue-600" />
                    Zero Trust Security with Azure AD
                  </CardTitle>
                  <CardDescription>
                    Enterprise identity-first security model with advanced threat protection and compliance automation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* Identity & Access Management */}
                  <div className="border border-blue-200 dark:border-blue-800 rounded-lg p-6 bg-gradient-to-r from-blue-50/50 to-cyan-50/50 dark:from-blue-950/10 dark:to-cyan-950/10">
                    <h4 className="text-lg font-semibold mb-4 text-blue-900 dark:text-blue-100 flex items-center">
                      <Key className="h-4 w-4 mr-2" />
                      Azure Active Directory Premium P2
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="p-4 bg-white dark:bg-slate-800 rounded border">
                          <h5 className="font-medium mb-3 text-slate-900 dark:text-white">Enterprise Authentication</h5>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span className="text-sm">Azure AD SSO</span>
                              <Badge variant="secondary">Enterprise</Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span className="text-sm">Multi-Factor Authentication</span>
                              <Badge variant="secondary">Required</Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span className="text-sm">Conditional Access</span>
                              <Badge variant="secondary">AI-powered</Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span className="text-sm">Privileged Identity Management</span>
                              <Badge variant="secondary">Just-in-time</Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-white dark:bg-slate-800 rounded border">
                          <h5 className="font-medium mb-3 text-slate-900 dark:text-white">Advanced Security Features</h5>
                          <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                            <li>• Identity Protection with ML</li>
                            <li>• Risk-based conditional access</li>
                            <li>• Access reviews and governance</li>
                            <li>• Entitlement management</li>
                            <li>• Azure AD Connect for hybrid identity</li>
                            <li>• B2B guest access controls</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="p-4 bg-white dark:bg-slate-800 rounded border">
                          <h5 className="font-medium mb-3 text-slate-900 dark:text-white">Enterprise Role Model</h5>
                          <div className="space-y-2 text-sm">
                            <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded border border-blue-200 dark:border-blue-800">
                              <div className="font-medium text-blue-900 dark:text-blue-100">Global Administrator</div>
                              <div className="text-blue-700 dark:text-blue-300">Full tenant access, user provisioning, security configuration</div>
                            </div>
                            <div className="p-2 bg-green-50 dark:bg-green-950/30 rounded border border-green-200 dark:border-green-800">
                              <div className="font-medium text-green-900 dark:text-green-100">Enterprise Architect</div>
                              <div className="text-green-700 dark:text-green-300">Full architecture modeling, template creation, team collaboration</div>
                            </div>
                            <div className="p-2 bg-orange-50 dark:bg-orange-950/30 rounded border border-orange-200 dark:border-orange-800">
                              <div className="font-medium text-orange-900 dark:text-orange-100">Solution Architect</div>
                              <div className="text-orange-700 dark:text-orange-300">Project-level access, modeling, integration capabilities</div>
                            </div>
                            <div className="p-2 bg-purple-50 dark:bg-purple-950/30 rounded border border-purple-200 dark:border-purple-800">
                              <div className="font-medium text-purple-900 dark:text-purple-100">Business Analyst</div>
                              <div className="text-purple-700 dark:text-purple-300">View and comment access, requirement gathering</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded border border-red-200 dark:border-red-800">
                          <h5 className="font-medium mb-2 text-red-900 dark:text-red-100">Conditional Access Policies</h5>
                          <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                            <li>• Geographic location restrictions</li>
                            <li>• Device compliance requirements</li>
                            <li>• Sign-in risk evaluation</li>
                            <li>• Application protection policies</li>
                            <li>• Session timeout controls</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Network Security */}
                  <div className="border border-indigo-200 dark:border-indigo-800 rounded-lg p-6 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/10 dark:to-purple-950/10">
                    <h4 className="text-lg font-semibold mb-4 text-indigo-900 dark:text-indigo-100 flex items-center">
                      <Network className="h-4 w-4 mr-2" />
                      Network Security &amp; Application Protection
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <div className="space-y-3">
                        <h5 className="font-medium text-slate-900 dark:text-white">Azure Firewall Premium</h5>
                        <div className="p-3 bg-white dark:bg-slate-800 rounded border text-sm space-y-2">
                          <div>• IDPS (Intrusion Detection)</div>
                          <div>• URL filtering &amp; web categories</div>
                          <div>• TLS inspection</div>
                          <div>• Threat intelligence feeds</div>
                          <div>• DNS proxy capabilities</div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h5 className="font-medium text-slate-900 dark:text-white">Application Gateway WAF</h5>
                        <div className="p-3 bg-white dark:bg-slate-800 rounded border text-sm space-y-2">
                          <div>• OWASP Top 10 protection</div>
                          <div>• Custom rule sets</div>
                          <div>• Bot protection</div>
                          <div>• Rate limiting per client</div>
                          <div>• Geo-filtering capabilities</div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h5 className="font-medium text-slate-900 dark:text-white">DDoS Protection</h5>
                        <div className="p-3 bg-white dark:bg-slate-800 rounded border text-sm space-y-2">
                          <div>• Always-on traffic monitoring</div>
                          <div>• Automatic attack mitigation</div>
                          <div>• Real-time metrics &amp; alerts</div>
                          <div>• Application layer protection</div>
                          <div>• Cost protection guarantee</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Data Protection & Compliance */}
                  <div className="border border-green-200 dark:border-green-800 rounded-lg p-6 bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-950/10 dark:to-emerald-950/10">
                    <h4 className="text-lg font-semibold mb-4 text-green-900 dark:text-green-100 flex items-center">
                      <Lock className="h-4 w-4 mr-2" />
                      Data Protection &amp; Compliance
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="p-4 bg-white dark:bg-slate-800 rounded border">
                          <h5 className="font-medium mb-3 text-slate-900 dark:text-white">Azure Key Vault Premium</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Customer-managed keys</span>
                              <Badge variant="outline">HSM-backed</Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Automatic key rotation</span>
                              <Badge variant="outline">Policy-driven</Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>VNet service endpoints</span>
                              <Badge variant="outline">Private access</Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Audit logging</span>
                              <Badge variant="outline">Monitor integration</Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-white dark:bg-slate-800 rounded border">
                          <h5 className="font-medium mb-3 text-slate-900 dark:text-white">Data Encryption</h5>
                          <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                            <li>• Database encryption at rest (TDE)</li>
                            <li>• Blob storage encryption (SSE)</li>
                            <li>• Disk encryption for VMs</li>
                            <li>• In-transit encryption (TLS 1.3)</li>
                            <li>• Column-level encryption for sensitive data</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="p-4 bg-white dark:bg-slate-800 rounded border">
                          <h5 className="font-medium mb-3 text-slate-900 dark:text-white">Compliance &amp; Governance</h5>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <Badge variant="outline" className="justify-center p-2">SOC 1/2/3</Badge>
                            <Badge variant="outline" className="justify-center p-2">ISO 27001/18</Badge>
                            <Badge variant="outline" className="justify-center p-2">GDPR Ready</Badge>
                            <Badge variant="outline" className="justify-center p-2">HIPAA BAA</Badge>
                            <Badge variant="outline" className="justify-center p-2">FedRAMP High</Badge>
                            <Badge variant="outline" className="justify-center p-2">PCI DSS</Badge>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded border border-amber-200 dark:border-amber-800">
                          <h5 className="font-medium mb-2 text-amber-900 dark:text-amber-100">Microsoft Purview Integration</h5>
                          <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                            <li>• Data classification &amp; labeling</li>
                            <li>• Data loss prevention (DLP)</li>
                            <li>• Information protection policies</li>
                            <li>• Insider risk management</li>
                            <li>• eDiscovery &amp; content search</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* AI/ML Services */}
            <TabsContent value="ai" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-indigo-600" />
                    Enterprise AI with Azure OpenAI Service
                  </CardTitle>
                  <CardDescription>
                    Microsoft's enterprise-grade AI platform with data residency, compliance, and advanced cognitive capabilities
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* Azure OpenAI Service */}
                  <div className="border border-indigo-200 dark:border-indigo-800 rounded-lg p-6 bg-gradient-to-r from-indigo-50/50 to-blue-50/50 dark:from-indigo-950/10 dark:to-blue-950/10">
                    <h4 className="text-lg font-semibold mb-4 text-indigo-900 dark:text-indigo-100 flex items-center">
                      <Zap className="h-4 w-4 mr-2" />
                      Azure OpenAI Service - Enterprise AI Platform
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="p-4 bg-white dark:bg-slate-800 rounded border">
                          <h5 className="font-medium mb-3 text-slate-900 dark:text-white">AI Model Capabilities</h5>
                          <div className="space-y-3">
                            <div className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded border border-blue-200 dark:border-blue-800">
                              <div className="font-medium text-blue-900 dark:text-blue-100">GPT-4 Turbo</div>
                              <div className="text-sm text-blue-700 dark:text-blue-300 mt-1">Advanced reasoning for architecture analysis and recommendations</div>
                            </div>
                            <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded border border-green-200 dark:border-green-800">
                              <div className="font-medium text-green-900 dark:text-green-100">GPT-3.5 Turbo</div>
                              <div className="text-sm text-green-700 dark:text-green-300 mt-1">Fast responses for real-time assistance and code generation</div>
                            </div>
                            <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded border border-purple-200 dark:border-purple-800">
                              <div className="font-medium text-purple-900 dark:text-purple-100">DALL-E 3</div>
                              <div className="text-sm text-purple-700 dark:text-purple-300 mt-1">Generate custom icons and visual elements for diagrams</div>
                            </div>
                            <div className="p-3 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 rounded border border-orange-200 dark:border-orange-800">
                              <div className="font-medium text-orange-900 dark:text-orange-100">Embeddings Ada-002</div>
                              <div className="text-sm text-orange-700 dark:text-orange-300 mt-1">Semantic search and similarity matching for templates</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-white dark:bg-slate-800 rounded border">
                          <h5 className="font-medium mb-3 text-slate-900 dark:text-white">Enterprise Features</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Data Residency</span>
                              <Badge variant="outline">Your tenant</Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Microsoft SLA</span>
                              <Badge variant="outline">99.9%</Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Content Filtering</span>
                              <Badge variant="outline">Configurable</Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Azure AD Integration</span>
                              <Badge variant="outline">Native</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="p-4 bg-white dark:bg-slate-800 rounded border">
                          <h5 className="font-medium mb-3 text-slate-900 dark:text-white">Architecture Use Cases</h5>
                          <div className="space-y-3 text-sm">
                            <div className="border-l-4 border-blue-500 pl-3">
                              <div className="font-medium text-slate-900 dark:text-white">Intelligent Assistance</div>
                              <div className="text-slate-600 dark:text-slate-400">"Design a microservices architecture for healthcare with HIPAA compliance"</div>
                            </div>
                            <div className="border-l-4 border-green-500 pl-3">
                              <div className="font-medium text-slate-900 dark:text-white">Enterprise Integration</div>
                              <div className="text-slate-600 dark:text-slate-400">Analyze existing Azure resources and generate architecture diagrams</div>
                            </div>
                            <div className="border-l-4 border-purple-500 pl-3">
                              <div className="font-medium text-slate-900 dark:text-white">Compliance Review</div>
                              <div className="text-slate-600 dark:text-slate-400">Validate architectures against enterprise governance policies</div>
                            </div>
                            <div className="border-l-4 border-orange-500 pl-3">
                              <div className="font-medium text-slate-900 dark:text-white">Documentation Generation</div>
                              <div className="text-slate-600 dark:text-slate-400">Auto-generate technical documentation from diagrams</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded border border-green-200 dark:border-green-800">
                          <h5 className="font-medium mb-2 text-green-900 dark:text-green-100">Enterprise Compliance</h5>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="text-center p-2 bg-white dark:bg-slate-800 rounded">
                              <div className="text-2xl font-bold text-green-600 dark:text-green-400">100%</div>
                              <div className="text-green-700 dark:text-green-300">Data Privacy</div>
                            </div>
                            <div className="text-center p-2 bg-white dark:bg-slate-800 rounded">
                              <div className="text-2xl font-bold text-green-600 dark:text-green-400">EU</div>
                              <div className="text-green-700 dark:text-green-300">Data Residency</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Azure Cognitive Services */}
                  <div className="border border-purple-200 dark:border-purple-800 rounded-lg p-6 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-950/10 dark:to-pink-950/10">
                    <h4 className="text-lg font-semibold mb-4 text-purple-900 dark:text-purple-100 flex items-center">
                      <Cpu className="h-4 w-4 mr-2" />
                      Cognitive Services &amp; Custom Intelligence
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                      <Card className="bg-white/50 dark:bg-slate-800/50">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm flex items-center">
                            <FileText className="h-3 w-3 mr-1" />
                            Document Intelligence
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                            <div>• Architecture document analysis</div>
                            <div>• Requirements extraction</div>
                            <div>• PDF to diagram conversion</div>
                            <div>• Form processing</div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-white/50 dark:bg-slate-800/50">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm flex items-center">
                            <Activity className="h-3 w-3 mr-1" />
                            Custom Vision
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                            <div>• Diagram element recognition</div>
                            <div>• Custom symbol detection</div>
                            <div>• Image classification</div>
                            <div>• Pattern identification</div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-white/50 dark:bg-slate-800/50">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm flex items-center">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Anomaly Detector
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                            <div>• Usage pattern analysis</div>
                            <div>• Performance anomaly detection</div>
                            <div>• User behavior insights</div>
                            <div>• Predictive maintenance</div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-white/50 dark:bg-slate-800/50">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm flex items-center">
                            <Code className="h-3 w-3 mr-1" />
                            Language Understanding
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                            <div>• Natural language queries</div>
                            <div>• Intent recognition</div>
                            <div>• Entity extraction</div>
                            <div>• Conversational AI</div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Enterprise AI Governance */}
                  <div className="border border-blue-200 dark:border-blue-800 rounded-lg p-6 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/10 dark:to-indigo-950/10">
                    <h4 className="text-lg font-semibold mb-4 text-blue-900 dark:text-blue-100 flex items-center">
                      <Settings className="h-4 w-4 mr-2" />
                      AI Governance &amp; Responsible AI
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="p-4 bg-white dark:bg-slate-800 rounded border">
                          <h5 className="font-medium mb-3 text-slate-900 dark:text-white">Content Safety &amp; Filtering</h5>
                          <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                            <li>• Hate speech detection</li>
                            <li>• Violence content filtering</li>
                            <li>• Self-harm prevention</li>
                            <li>• Sexual content blocking</li>
                            <li>• Custom filter policies</li>
                            <li>• Real-time content moderation</li>
                          </ul>
                        </div>
                        
                        <div className="p-4 bg-white dark:bg-slate-800 rounded border">
                          <h5 className="font-medium mb-3 text-slate-900 dark:text-white">Data Protection</h5>
                          <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                            <li>• No data used for model training</li>
                            <li>• Data residency guarantees</li>
                            <li>• Encryption in transit and at rest</li>
                            <li>• Azure Private Link support</li>
                            <li>• VNet service endpoint integration</li>
                            <li>• Customer-managed key encryption</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="p-4 bg-white dark:bg-slate-800 rounded border">
                          <h5 className="font-medium mb-3 text-slate-900 dark:text-white">Enterprise Controls</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Rate Limiting</span>
                              <Badge variant="outline">Configurable</Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Usage Monitoring</span>
                              <Badge variant="outline">Real-time</Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Cost Controls</span>
                              <Badge variant="outline">Budget alerts</Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Audit Logging</span>
                              <Badge variant="outline">Comprehensive</Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded border border-amber-200 dark:border-amber-800">
                          <h5 className="font-medium mb-2 text-amber-900 dark:text-amber-100">Responsible AI Framework</h5>
                          <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                            <li>• Fairness assessment tools</li>
                            <li>• Explainability features</li>
                            <li>• Reliability monitoring</li>
                            <li>• Safety guardrails</li>
                            <li>• Privacy protection measures</li>
                            <li>• Inclusiveness validation</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* DevOps & Deployment */}
            <TabsContent value="devops" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <GitBranch className="h-5 w-5 mr-2 text-blue-600" />
                    Azure DevOps &amp; Deployment Pipeline
                  </CardTitle>
                  <CardDescription>
                    Enterprise DevOps with Azure Pipelines, comprehensive testing, and blue-green deployment strategies
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* Azure DevOps Pipeline */}
                  <div className="border border-blue-200 dark:border-blue-800 rounded-lg p-6 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/10 dark:to-indigo-950/10">
                    <h4 className="text-lg font-semibold mb-4 text-blue-900 dark:text-blue-100 flex items-center">
                      <GitBranch className="h-4 w-4 mr-2" />
                      Azure Pipelines - Enterprise CI/CD
                    </h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
                        <div className="p-4 bg-white dark:bg-slate-800 rounded border text-center">
                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                            <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">1</span>
                          </div>
                          <h5 className="font-medium text-slate-900 dark:text-white mb-1">Source</h5>
                          <p className="text-xs text-slate-600 dark:text-slate-400">Azure Repos Git with branch policies</p>
                        </div>
                        
                        <div className="p-4 bg-white dark:bg-slate-800 rounded border text-center">
                          <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                            <span className="text-green-600 dark:text-green-400 font-semibold text-sm">2</span>
                          </div>
                          <h5 className="font-medium text-slate-900 dark:text-white mb-1">Build</h5>
                          <p className="text-xs text-slate-600 dark:text-slate-400">Multi-stage builds with container registry</p>
                        </div>
                        
                        <div className="p-4 bg-white dark:bg-slate-800 rounded border text-center">
                          <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                            <span className="text-orange-600 dark:text-orange-400 font-semibold text-sm">3</span>
                          </div>
                          <h5 className="font-medium text-slate-900 dark:text-white mb-1">Test</h5>
                          <p className="text-xs text-slate-600 dark:text-slate-400">Comprehensive testing with coverage reports</p>
                        </div>
                        
                        <div className="p-4 bg-white dark:bg-slate-800 rounded border text-center">
                          <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                            <span className="text-purple-600 dark:text-purple-400 font-semibold text-sm">4</span>
                          </div>
                          <h5 className="font-medium text-slate-900 dark:text-white mb-1">Security</h5>
                          <p className="text-xs text-slate-600 dark:text-slate-400">Microsoft Defender for DevOps scanning</p>
                        </div>
                        
                        <div className="p-4 bg-white dark:bg-slate-800 rounded border text-center">
                          <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                            <span className="text-indigo-600 dark:text-indigo-400 font-semibold text-sm">5</span>
                          </div>
                          <h5 className="font-medium text-slate-900 dark:text-white mb-1">Deploy</h5>
                          <p className="text-xs text-slate-600 dark:text-slate-400">Blue-green deployment to Container Apps</p>
                        </div>
                        
                        <div className="p-4 bg-white dark:bg-slate-800 rounded border text-center">
                          <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                            <span className="text-red-600 dark:text-red-400 font-semibold text-sm">6</span>
                          </div>
                          <h5 className="font-medium text-slate-900 dark:text-white mb-1">Monitor</h5>
                          <p className="text-xs text-slate-600 dark:text-slate-400">Application Insights monitoring</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
                        <div className="p-4 bg-white dark:bg-slate-800 rounded border">
                          <h5 className="font-medium mb-3 text-slate-900 dark:text-white">Testing Strategy</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Unit Tests (Jest/Vitest)</span>
                              <Badge variant="outline">95% Coverage</Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Integration Tests</span>
                              <Badge variant="outline">API &amp; Services</Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>E2E Tests (Playwright)</span>
                              <Badge variant="outline">User Journeys</Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Load Tests (Azure Load Testing)</span>
                              <Badge variant="outline">JMeter-based</Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-white dark:bg-slate-800 rounded border">
                          <h5 className="font-medium mb-3 text-slate-900 dark:text-white">Security &amp; Quality Gates</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Dependency Scanning</span>
                              <Badge variant="outline">GitHub Dependabot</Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Container Scanning</span>
                              <Badge variant="outline">Defender for Containers</Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Code Quality</span>
                              <Badge variant="outline">SonarCloud</Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Secret Scanning</span>
                              <Badge variant="outline">Advanced Security</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Blue-Green Deployment */}
                  <div className="border border-green-200 dark:border-green-800 rounded-lg p-6 bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-950/10 dark:to-emerald-950/10">
                    <h4 className="text-lg font-semibold mb-4 text-green-900 dark:text-green-100 flex items-center">
                      <Server className="h-4 w-4 mr-2" />
                      Azure Container Apps - Blue-Green Deployment
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded border border-blue-200 dark:border-blue-800">
                          <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-3 flex items-center">
                            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                            Blue Revision (Active)
                          </h5>
                          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                            <li>• Current production traffic</li>
                            <li>• Stable application version</li>
                            <li>• Application Insights monitoring</li>
                            <li>• Traffic distribution: 100%</li>
                          </ul>
                        </div>
                        
                        <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded border border-green-200 dark:border-green-800">
                          <h5 className="font-medium text-green-900 dark:text-green-100 mb-3 flex items-center">
                            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                            Green Revision (Staging)
                          </h5>
                          <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                            <li>• New application version</li>
                            <li>• Health probe validation</li>
                            <li>• Smoke tests execution</li>
                            <li>• Ready for traffic migration</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="p-4 bg-white dark:bg-slate-800 rounded border">
                          <h5 className="font-medium mb-3 text-slate-900 dark:text-white">Deployment Process</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-start">
                              <div className="w-6 h-6 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mr-3 mt-0.5">
                                <span className="text-orange-600 dark:text-orange-400 text-xs font-semibold">1</span>
                              </div>
                              <div>
                                <div className="font-medium text-slate-900 dark:text-white">Deploy Green Revision</div>
                                <div className="text-slate-600 dark:text-slate-400">New container deployed alongside blue</div>
                              </div>
                            </div>
                            <div className="flex items-start">
                              <div className="w-6 h-6 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mr-3 mt-0.5">
                                <span className="text-orange-600 dark:text-orange-400 text-xs font-semibold">2</span>
                              </div>
                              <div>
                                <div className="font-medium text-slate-900 dark:text-white">Health Validation</div>
                                <div className="text-slate-600 dark:text-slate-400">Automated health checks and smoke tests</div>
                              </div>
                            </div>
                            <div className="flex items-start">
                              <div className="w-6 h-6 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mr-3 mt-0.5">
                                <span className="text-orange-600 dark:text-orange-400 text-xs font-semibold">3</span>
                              </div>
                              <div>
                                <div className="font-medium text-slate-900 dark:text-white">Traffic Split</div>
                                <div className="text-slate-600 dark:text-slate-400">Gradual traffic migration: 10% → 50% → 100%</div>
                              </div>
                            </div>
                            <div className="flex items-start">
                              <div className="w-6 h-6 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mr-3 mt-0.5">
                                <span className="text-orange-600 dark:text-orange-400 text-xs font-semibold">4</span>
                              </div>
                              <div>
                                <div className="font-medium text-slate-900 dark:text-white">Monitor &amp; Validate</div>
                                <div className="text-slate-600 dark:text-slate-400">Application Insights monitoring for anomalies</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded border border-red-200 dark:border-red-800">
                          <h5 className="font-medium mb-2 text-red-900 dark:text-red-100">Rollback Strategy</h5>
                          <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                            <li>• Instant traffic revert to blue revision</li>
                            <li>• Automated rollback on health check failure</li>
                            <li>• Database transaction rollback support</li>
                            <li>• Zero-downtime rollback guarantee</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Enterprise Integration */}
                  <div className="border border-purple-200 dark:border-purple-800 rounded-lg p-6 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-950/10 dark:to-pink-950/10">
                    <h4 className="text-lg font-semibold mb-4 text-purple-900 dark:text-purple-100 flex items-center">
                      <Building className="h-4 w-4 mr-2" />
                      Enterprise Integration &amp; Governance
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="p-4 bg-white dark:bg-slate-800 rounded border">
                          <h5 className="font-medium mb-3 text-slate-900 dark:text-white">Azure DevOps Integration</h5>
                          <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                            <li>• Azure Boards for work item tracking</li>
                            <li>• Azure Artifacts for package management</li>
                            <li>• Azure Test Plans for manual testing</li>
                            <li>• Integration with Azure AD for access control</li>
                            <li>• Branch policies and pull request workflows</li>
                            <li>• Automated work item linking</li>
                          </ul>
                        </div>
                        
                        <div className="p-4 bg-white dark:bg-slate-800 rounded border">
                          <h5 className="font-medium mb-3 text-slate-900 dark:text-white">Microsoft 365 Integration</h5>
                          <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                            <li>• Teams notifications for deployments</li>
                            <li>• SharePoint document management</li>
                            <li>• Outlook calendar integration</li>
                            <li>• Power Automate workflow triggers</li>
                            <li>• OneDrive for Business storage</li>
                            <li>• Unified enterprise identity</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="p-4 bg-white dark:bg-slate-800 rounded border">
                          <h5 className="font-medium mb-3 text-slate-900 dark:text-white">Governance &amp; Compliance</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Azure Policy</span>
                              <Badge variant="outline">Compliance</Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Azure Blueprints</span>
                              <Badge variant="outline">Standards</Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Cost Management</span>
                              <Badge variant="outline">Budget alerts</Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Resource Tags</span>
                              <Badge variant="outline">Governance</Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded border border-blue-200 dark:border-blue-800">
                          <h5 className="font-medium mb-2 text-blue-900 dark:text-blue-100">Environment Management</h5>
                          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                            <li>• Development: Single region, basic monitoring</li>
                            <li>• Staging: Production-like, full testing</li>
                            <li>• Production: Multi-region, enterprise support</li>
                            <li>• DR: Automated failover capabilities</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Cost Model */}
            <TabsContent value="costs" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="h-5 w-5 mr-2 text-blue-600" />
                    Azure Cost Model &amp; Enterprise Value
                  </CardTitle>
                  <CardDescription>
                    Comprehensive cost analysis with Microsoft enterprise agreement benefits and hybrid savings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* Monthly Cost Breakdown */}
                  <div className="border border-blue-200 dark:border-blue-800 rounded-lg p-6 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/10 dark:to-indigo-950/10">
                    <h4 className="text-lg font-semibold mb-4 text-blue-900 dark:text-blue-100 flex items-center">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Monthly Cost Breakdown (10,000 Users)
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="p-4 bg-white dark:bg-slate-800 rounded border">
                          <h5 className="font-medium mb-3 text-slate-900 dark:text-white">Compute &amp; Application Services</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Container Apps (10 instances)</span>
                              <span className="font-medium">$1,100</span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Application Gateway</span>
                              <span className="font-medium">$240</span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Azure Front Door</span>
                              <span className="font-medium">$180</span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Function Apps</span>
                              <span className="font-medium">$80</span>
                            </div>
                            <div className="border-t pt-2 mt-2">
                              <div className="flex items-center justify-between font-medium">
                                <span>Compute Subtotal</span>
                                <span className="text-blue-600 dark:text-blue-400">$1,600</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-white dark:bg-slate-800 rounded border">
                          <h5 className="font-medium mb-3 text-slate-900 dark:text-white">Data &amp; Storage Services</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>PostgreSQL Flexible Server</span>
                              <span className="font-medium">$850</span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Cosmos DB (Multi-region)</span>
                              <span className="font-medium">$400</span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Azure Storage (Blob + Files)</span>
                              <span className="font-medium">$150</span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Redis Cache</span>
                              <span className="font-medium">$200</span>
                            </div>
                            <div className="border-t pt-2 mt-2">
                              <div className="flex items-center justify-between font-medium">
                                <span>Data Subtotal</span>
                                <span className="text-blue-600 dark:text-blue-400">$1,600</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="p-4 bg-white dark:bg-slate-800 rounded border">
                          <h5 className="font-medium mb-3 text-slate-900 dark:text-white">AI &amp; Cognitive Services</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Azure OpenAI Service</span>
                              <span className="font-medium">$800</span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Cognitive Services</span>
                              <span className="font-medium">$150</span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Document Intelligence</span>
                              <span className="font-medium">$100</span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Custom Vision</span>
                              <span className="font-medium">$50</span>
                            </div>
                            <div className="border-t pt-2 mt-2">
                              <div className="flex items-center justify-between font-medium">
                                <span>AI Subtotal</span>
                                <span className="text-blue-600 dark:text-blue-400">$1,100</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-white dark:bg-slate-800 rounded border">
                          <h5 className="font-medium mb-3 text-slate-900 dark:text-white">Security &amp; Management</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Azure AD Premium P2</span>
                              <span className="font-medium">$900</span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Key Vault Premium</span>
                              <span className="font-medium">$50</span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Application Insights</span>
                              <span className="font-medium">$200</span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Azure Monitor</span>
                              <span className="font-medium">$150</span>
                            </div>
                            <div className="border-t pt-2 mt-2">
                              <div className="flex items-center justify-between font-medium">
                                <span>Security Subtotal</span>
                                <span className="text-blue-600 dark:text-blue-400">$1,300</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 p-6 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                      <h5 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-2">Total Monthly Cost</h5>
                      <div className="flex items-center justify-between">
                        <span className="text-lg text-blue-800 dark:text-blue-200">Enterprise Environment (10,000 users)</span>
                        <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">$5,600/month</span>
                      </div>
                      <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                        Includes: Multi-region deployment, enterprise identity, AI services, and Premier Support
                      </div>
                    </div>
                  </div>

                  {/* Enterprise Agreement Benefits */}
                  <div className="border border-green-200 dark:border-green-800 rounded-lg p-6 bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-950/10 dark:to-emerald-950/10">
                    <h4 className="text-lg font-semibold mb-4 text-green-900 dark:text-green-100 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Enterprise Agreement &amp; Hybrid Benefits
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="space-y-3">
                        <h5 className="font-medium text-slate-900 dark:text-white">Azure Hybrid Benefit</h5>
                        <div className="p-3 bg-white dark:bg-slate-800 rounded border">
                          <div className="text-sm space-y-2">
                            <div className="flex justify-between">
                              <span className="text-slate-600 dark:text-slate-400">Windows Server licenses</span>
                              <span className="font-medium text-green-600 dark:text-green-400">-40%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600 dark:text-slate-400">SQL Server licenses</span>
                              <span className="font-medium text-green-600 dark:text-green-400">-55%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600 dark:text-slate-400">Azure AD Premium included</span>
                              <span className="font-medium text-green-600 dark:text-green-400">-$900</span>
                            </div>
                            <div className="pt-2 border-t">
                              <div className="flex justify-between font-medium">
                                <span>Monthly Savings</span>
                                <span className="text-green-600 dark:text-green-400">$1,200</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h5 className="font-medium text-slate-900 dark:text-white">Enterprise Agreement</h5>
                        <div className="p-3 bg-white dark:bg-slate-800 rounded border">
                          <div className="text-sm space-y-2">
                            <div className="flex justify-between">
                              <span className="text-slate-600 dark:text-slate-400">3-year commitment</span>
                              <span className="font-medium text-green-600 dark:text-green-400">-20%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600 dark:text-slate-400">Volume discounts</span>
                              <span className="font-medium text-green-600 dark:text-green-400">-15%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600 dark:text-slate-400">Prepaid consumption</span>
                              <span className="font-medium text-green-600 dark:text-green-400">-25%</span>
                            </div>
                            <div className="pt-2 border-t">
                              <div className="flex justify-between font-medium">
                                <span>Avg Savings</span>
                                <span className="text-green-600 dark:text-green-400">$1,800</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h5 className="font-medium text-slate-900 dark:text-white">Microsoft 365 Integration</h5>
                        <div className="p-3 bg-white dark:bg-slate-800 rounded border">
                          <div className="text-sm space-y-2">
                            <div className="flex justify-between">
                              <span className="text-slate-600 dark:text-slate-400">Teams included</span>
                              <span className="font-medium text-green-600 dark:text-green-400">-$300</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600 dark:text-slate-400">SharePoint storage</span>
                              <span className="font-medium text-green-600 dark:text-green-400">-$100</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600 dark:text-slate-400">Power Platform</span>
                              <span className="font-medium text-green-600 dark:text-green-400">-$200</span>
                            </div>
                            <div className="pt-2 border-t">
                              <div className="flex justify-between font-medium">
                                <span>Integration Savings</span>
                                <span className="text-green-600 dark:text-green-400">$600</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-950/20 rounded border border-orange-200 dark:border-orange-800">
                      <h5 className="font-medium text-orange-900 dark:text-orange-100 mb-2">Enterprise Optimized Cost</h5>
                      <div className="flex items-center justify-between">
                        <span className="text-orange-800 dark:text-orange-200">With all enterprise benefits applied:</span>
                        <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">$2,000/month</span>
                      </div>
                      <div className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                        64% cost reduction with enterprise agreement and hybrid benefits
                      </div>
                    </div>
                  </div>

                  {/* Total Cost of Ownership */}
                  <div className="border border-purple-200 dark:border-purple-800 rounded-lg p-6 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-950/10 dark:to-pink-950/10">
                    <h4 className="text-lg font-semibold mb-4 text-purple-900 dark:text-purple-100 flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      Total Cost of Ownership &amp; Enterprise Value
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                      <Card className="bg-white/50 dark:bg-slate-800/50 text-center">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">1,000 Users</CardTitle>
                          <CardDescription>Small Enterprise</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">$400</div>
                          <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                            <div>• Single region deployment</div>
                            <div>• Basic AI services</div>
                            <div>• Standard support</div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-white/50 dark:bg-slate-800/50 text-center">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">5,000 Users</CardTitle>
                          <CardDescription>Medium Enterprise</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">$1,200</div>
                          <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                            <div>• Multi-region setup</div>
                            <div>• Advanced AI &amp; analytics</div>
                            <div>• Professional support</div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-white/50 dark:bg-slate-800/50 text-center border-2 border-purple-300 dark:border-purple-700">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">10,000 Users</CardTitle>
                          <CardDescription className="text-purple-600 dark:text-purple-400 font-medium">Large Enterprise</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">$2,000</div>
                          <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                            <div>• Global deployment</div>
                            <div>• Full AI &amp; enterprise features</div>
                            <div>• Premier support included</div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-white/50 dark:bg-slate-800/50 text-center">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">50,000 Users</CardTitle>
                          <CardDescription>Enterprise Scale</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">$6,500</div>
                          <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                            <div>• Multi-tenant architecture</div>
                            <div>• Custom AI models</div>
                            <div>• Dedicated support team</div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded border border-blue-200 dark:border-blue-800">
                      <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-3">Enterprise Value Proposition</h5>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-sm">
                        <div>
                          <h6 className="font-medium text-slate-900 dark:text-white mb-2">Productivity Gains</h6>
                          <ul className="text-blue-700 dark:text-blue-300 space-y-1">
                            <li>• 40% faster architecture delivery</li>
                            <li>• 60% reduction in documentation time</li>
                            <li>• 80% improvement in collaboration</li>
                            <li>• 50% faster onboarding of new architects</li>
                          </ul>
                        </div>
                        <div>
                          <h6 className="font-medium text-slate-900 dark:text-white mb-2">Cost Avoidance</h6>
                          <ul className="text-blue-700 dark:text-blue-300 space-y-1">
                            <li>• Reduced architecture review cycles</li>
                            <li>• Eliminated redundant tool licensing</li>
                            <li>• Decreased training and adoption costs</li>
                            <li>• Minimized technical debt accumulation</li>
                          </ul>
                        </div>
                        <div>
                          <h6 className="font-medium text-slate-900 dark:text-white mb-2">Strategic Benefits</h6>
                          <ul className="text-blue-700 dark:text-blue-300 space-y-1">
                            <li>• Enhanced enterprise governance</li>
                            <li>• Improved compliance posture</li>
                            <li>• Accelerated digital transformation</li>
                            <li>• Better architecture decision tracking</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Call to Action */}
          <div className="mt-12 text-center">
            <Card className="max-w-4xl mx-auto bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
              <CardContent className="pt-8 pb-8">
                <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
                  Ready to Deploy ARKHITEKTON on Azure?
                </h3>
                <p className="text-lg text-slate-600 dark:text-slate-300 mb-6 max-w-2xl mx-auto">
                  This enterprise-first Azure architecture provides seamless Microsoft ecosystem integration, 
                  advanced hybrid cloud capabilities, and enterprise-grade AI services for your architecture platform.
                </p>
                <div className="flex items-center justify-center space-x-4">
                  <Link href="/arkhitekton-architecture">
                    <Button variant="outline" size="lg">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Compare All Options
                    </Button>
                  </Link>
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                    Start Azure Deployment
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}