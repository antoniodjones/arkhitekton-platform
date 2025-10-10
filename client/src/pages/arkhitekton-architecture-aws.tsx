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
  Settings
} from "lucide-react";
import { GovernanceHeader } from "@/components/layout/governance-header";

export default function ArkhitektonArchitectureAWS() {
  return (
    <AppLayout>
      <div className="h-full overflow-hidden flex flex-col">
        <GovernanceHeader 
          moduleTitle="AWS Architecture" 
          moduleIcon={Cloud} 
        />
        
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-6 py-8">
          
          {/* Architecture Overview */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">Architecture Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 border-orange-200 dark:border-orange-800">
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Globe className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Global Scale</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Multi-region deployment across 99 AZs for global enterprise reach</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Security First</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Zero-trust architecture with AWS IAM, WAF, and Shield protection</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Zap className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">AI-Powered</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">AWS Bedrock with Anthropic Claude for intelligent architecture assistance</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800">
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Auto-scaling</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Elastic infrastructure scaling from 10 to 10,000+ concurrent users</p>
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
                    <Server className="h-5 w-5 mr-2 text-orange-600" />
                    Compute & Networking Infrastructure
                  </CardTitle>
                  <CardDescription>
                    Containerized microservices architecture with global load balancing and auto-scaling capabilities
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* Frontend Tier */}
                  <div className="border border-orange-200 dark:border-orange-800 rounded-lg p-6 bg-gradient-to-r from-orange-50/50 to-amber-50/50 dark:from-orange-950/10 dark:to-amber-950/10">
                    <h4 className="text-lg font-semibold mb-4 text-orange-900 dark:text-orange-100 flex items-center">
                      <Globe className="h-4 w-4 mr-2" />
                      Frontend Tier - Global Edge Distribution
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded border">
                          <span className="font-medium">AWS CloudFront CDN</span>
                          <Badge variant="outline">Global</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded border">
                          <span className="font-medium">React 18 SPA (S3)</span>
                          <Badge variant="outline">Static</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded border">
                          <span className="font-medium">Route 53 DNS</span>
                          <Badge variant="outline">99.99% SLA</Badge>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h5 className="font-medium text-slate-900 dark:text-white">Key Features:</h5>
                        <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                          <li>• 410+ global edge locations</li>
                          <li>• Automatic HTTPS/TLS 1.3</li>
                          <li>• Real-time cache invalidation</li>
                          <li>• Gzip/Brotli compression</li>
                          <li>• Custom domain support</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Application Tier */}
                  <div className="border border-blue-200 dark:border-blue-800 rounded-lg p-6 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/10 dark:to-indigo-950/10">
                    <h4 className="text-lg font-semibold mb-4 text-blue-900 dark:text-blue-100 flex items-center">
                      <Layers className="h-4 w-4 mr-2" />
                      Application Tier - Containerized Services
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h5 className="font-medium text-slate-900 dark:text-white">ECS Fargate Clusters</h5>
                        <div className="space-y-2">
                          <div className="p-3 bg-white dark:bg-slate-800 rounded border">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">API Gateway Service</span>
                              <Badge variant="secondary">Express.js</Badge>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">RESTful API endpoints, authentication, and request routing</p>
                          </div>
                          <div className="p-3 bg-white dark:bg-slate-800 rounded border">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">Architecture Engine</span>
                              <Badge variant="secondary">Node.js</Badge>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Diagram processing, model validation, and template management</p>
                          </div>
                          <div className="p-3 bg-white dark:bg-slate-800 rounded border">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">Collaboration Service</span>
                              <Badge variant="secondary">WebSocket</Badge>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Real-time multi-user collaboration and live cursors</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h5 className="font-medium text-slate-900 dark:text-white">Load Balancing & Scaling</h5>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded border">
                            <span className="font-medium">Application Load Balancer</span>
                            <Badge variant="outline">Layer 7</Badge>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded border">
                            <span className="font-medium">Auto Scaling Groups</span>
                            <Badge variant="outline">2-20 instances</Badge>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded border">
                            <span className="font-medium">Target Groups</span>
                            <Badge variant="outline">Health Checks</Badge>
                          </div>
                        </div>
                        <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/20 rounded border border-green-200 dark:border-green-800">
                          <h6 className="font-medium text-green-900 dark:text-green-100 mb-2">Auto-scaling Triggers</h6>
                          <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                            <li>• CPU &gt; 70% for 5 minutes</li>
                            <li>• Memory &gt; 80% for 3 minutes</li>
                            <li>• Request count &gt; 1000/min</li>
                            <li>• Response time &gt; 500ms average</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Network Architecture */}
                  <div className="border border-purple-200 dark:border-purple-800 rounded-lg p-6 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-950/10 dark:to-pink-950/10">
                    <h4 className="text-lg font-semibold mb-4 text-purple-900 dark:text-purple-100 flex items-center">
                      <Network className="h-4 w-4 mr-2" />
                      Network Architecture & VPC Design
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <Card className="bg-white/50 dark:bg-slate-800/50">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">Public Subnets</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0 space-y-2">
                          <div className="text-xs text-slate-600 dark:text-slate-400">
                            • Load Balancers<br/>
                            • NAT Gateways<br/>
                            • Bastion Hosts<br/>
                            • Internet Gateway access
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-white/50 dark:bg-slate-800/50">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">Private Subnets</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0 space-y-2">
                          <div className="text-xs text-slate-600 dark:text-slate-400">
                            • ECS Services<br/>
                            • Application Servers<br/>
                            • Lambda Functions<br/>
                            • NAT Gateway outbound only
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-white/50 dark:bg-slate-800/50">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">Database Subnets</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0 space-y-2">
                          <div className="text-xs text-slate-600 dark:text-slate-400">
                            • RDS Instances<br/>
                            • ElastiCache Clusters<br/>
                            • No internet access<br/>
                            • Private connections only
                          </div>
                        </CardContent>
                      </Card>
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
                    <Database className="h-5 w-5 mr-2 text-blue-600" />
                    Multi-Database Data Architecture
                  </CardTitle>
                  <CardDescription>
                    Hybrid data strategy combining ACID compliance with NoSQL flexibility and distributed caching
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* Primary Database */}
                  <div className="border border-blue-200 dark:border-blue-800 rounded-lg p-6 bg-gradient-to-r from-blue-50/50 to-cyan-50/50 dark:from-blue-950/10 dark:to-cyan-950/10">
                    <h4 className="text-lg font-semibold mb-4 text-blue-900 dark:text-blue-100 flex items-center">
                      <Database className="h-4 w-4 mr-2" />
                      AWS RDS PostgreSQL - Primary Data Store
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="p-4 bg-white dark:bg-slate-800 rounded border">
                          <h5 className="font-medium mb-3 text-slate-900 dark:text-white">Core Data Models</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Architecture Models & Metadata</span>
                              <Badge variant="outline" className="text-xs">JSONB</Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>User Management & Profiles</span>
                              <Badge variant="outline" className="text-xs">Relational</Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Project & Workspace Data</span>
                              <Badge variant="outline" className="text-xs">Structured</Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Version Control & History</span>
                              <Badge variant="outline" className="text-xs">Time-series</Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-white dark:bg-slate-800 rounded border">
                          <h5 className="font-medium mb-3 text-slate-900 dark:text-white">Performance Features</h5>
                          <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                            <li>• Multi-AZ deployment for HA</li>
                            <li>• Read replicas for query scaling</li>
                            <li>• Automated backups & point-in-time recovery</li>
                            <li>• Connection pooling with RDS Proxy</li>
                            <li>• Performance Insights monitoring</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="p-4 bg-white dark:bg-slate-800 rounded border">
                          <h5 className="font-medium mb-3 text-slate-900 dark:text-white">Specifications</h5>
                          <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                              <span className="text-slate-600 dark:text-slate-400">Instance Type</span>
                              <span className="font-medium">db.r6g.2xlarge</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600 dark:text-slate-400">Storage</span>
                              <span className="font-medium">1TB gp3 SSD</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600 dark:text-slate-400">IOPS</span>
                              <span className="font-medium">12,000 provisioned</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600 dark:text-slate-400">Connections</span>
                              <span className="font-medium">500 max concurrent</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600 dark:text-slate-400">Backup Retention</span>
                              <span className="font-medium">30 days</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded border border-green-200 dark:border-green-800">
                          <h5 className="font-medium mb-2 text-green-900 dark:text-green-100">High Availability Setup</h5>
                          <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                            <li>• Primary: us-east-1a</li>
                            <li>• Standby: us-east-1b</li>
                            <li>• Read Replica: us-west-2</li>
                            <li>• Auto-failover: 60-120 seconds</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* NoSQL Database */}
                  <div className="border border-green-200 dark:border-green-800 rounded-lg p-6 bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-950/10 dark:to-emerald-950/10">
                    <h4 className="text-lg font-semibold mb-4 text-green-900 dark:text-green-100 flex items-center">
                      <CloudDrizzle className="h-4 w-4 mr-2" />
                      AWS DynamoDB - Real-time & Session Data
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <div className="space-y-3">
                        <h5 className="font-medium text-slate-900 dark:text-white">Collaboration Events</h5>
                        <div className="p-3 bg-white dark:bg-slate-800 rounded border text-sm">
                          <div className="space-y-2">
                            <div>• Real-time cursor positions</div>
                            <div>• Live diagram updates</div>
                            <div>• User presence indicators</div>
                            <div>• Comment threads</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h5 className="font-medium text-slate-900 dark:text-white">Activity Streams</h5>
                        <div className="p-3 bg-white dark:bg-slate-800 rounded border text-sm">
                          <div className="space-y-2">
                            <div>• User activity logs</div>
                            <div>• Element access patterns</div>
                            <div>• Search query tracking</div>
                            <div>• Feature usage analytics</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h5 className="font-medium text-slate-900 dark:text-white">Performance</h5>
                        <div className="p-3 bg-white dark:bg-slate-800 rounded border text-sm">
                          <div className="space-y-2">
                            <div>• Single-digit ms latency</div>
                            <div>• Auto-scaling on demand</div>
                            <div>• Global secondary indexes</div>
                            <div>• DynamoDB Streams</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Storage */}
                  <div className="border border-purple-200 dark:border-purple-800 rounded-lg p-6 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-950/10 dark:to-pink-950/10">
                    <h4 className="text-lg font-semibold mb-4 text-purple-900 dark:text-purple-100 flex items-center">
                      <HardDrive className="h-4 w-4 mr-2" />
                      AWS S3 - Object Storage & Assets
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                      <Card className="bg-white/50 dark:bg-slate-800/50">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">Static Assets</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                            <div>• Component icons</div>
                            <div>• Template files</div>
                            <div>• System images</div>
                            <div>• CDN optimized</div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-white/50 dark:bg-slate-800/50">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">User Content</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                            <div>• Uploaded images</div>
                            <div>• Custom icons</div>
                            <div>• Profile avatars</div>
                            <div>• Private buckets</div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-white/50 dark:bg-slate-800/50">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">Export Files</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                            <div>• PDF diagrams</div>
                            <div>• PNG/SVG exports</div>
                            <div>• Documentation</div>
                            <div>• Temporary access</div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-white/50 dark:bg-slate-800/50">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">Backup & Archive</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                            <div>• Database backups</div>
                            <div>• System snapshots</div>
                            <div>• Compliance archives</div>
                            <div>• Glacier storage</div>
                          </div>
                        </CardContent>
                      </Card>
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
                    <Shield className="h-5 w-5 mr-2 text-green-600" />
                    Zero-Trust Security Architecture
                  </CardTitle>
                  <CardDescription>
                    Enterprise-grade security with defense in depth, compliance automation, and continuous monitoring
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* Identity & Access Management */}
                  <div className="border border-green-200 dark:border-green-800 rounded-lg p-6 bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-950/10 dark:to-emerald-950/10">
                    <h4 className="text-lg font-semibold mb-4 text-green-900 dark:text-green-100 flex items-center">
                      <Lock className="h-4 w-4 mr-2" />
                      Identity & Access Management (IAM)
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="p-4 bg-white dark:bg-slate-800 rounded border">
                          <h5 className="font-medium mb-3 text-slate-900 dark:text-white">Authentication Methods</h5>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span className="text-sm">Multi-Factor Authentication</span>
                              <Badge variant="secondary">Required</Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span className="text-sm">SAML 2.0 SSO</span>
                              <Badge variant="secondary">Enterprise</Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span className="text-sm">OIDC Integration</span>
                              <Badge variant="secondary">OAuth 2.0</Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span className="text-sm">AWS Cognito</span>
                              <Badge variant="secondary">Managed</Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-white dark:bg-slate-800 rounded border">
                          <h5 className="font-medium mb-3 text-slate-900 dark:text-white">Authorization Roles</h5>
                          <div className="space-y-2 text-sm">
                            <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded border border-blue-200 dark:border-blue-800">
                              <div className="font-medium text-blue-900 dark:text-blue-100">System Administrator</div>
                              <div className="text-blue-700 dark:text-blue-300">Full system access, user management, configuration</div>
                            </div>
                            <div className="p-2 bg-green-50 dark:bg-green-950/30 rounded border border-green-200 dark:border-green-800">
                              <div className="font-medium text-green-900 dark:text-green-100">Enterprise Architect</div>
                              <div className="text-green-700 dark:text-green-300">Create, edit, share models, template management</div>
                            </div>
                            <div className="p-2 bg-orange-50 dark:bg-orange-950/30 rounded border border-orange-200 dark:border-orange-800">
                              <div className="font-medium text-orange-900 dark:text-orange-100">Collaborator</div>
                              <div className="text-orange-700 dark:text-orange-300">View, comment, limited editing permissions</div>
                            </div>
                            <div className="p-2 bg-gray-50 dark:bg-gray-950/30 rounded border border-gray-200 dark:border-gray-800">
                              <div className="font-medium text-gray-900 dark:text-gray-100">Viewer</div>
                              <div className="text-gray-700 dark:text-gray-300">Read-only access to shared diagrams</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="p-4 bg-white dark:bg-slate-800 rounded border">
                          <h5 className="font-medium mb-3 text-slate-900 dark:text-white">Service-to-Service Security</h5>
                          <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-2">
                            <li>• IAM roles for ECS tasks</li>
                            <li>• Least privilege access policies</li>
                            <li>• Cross-service authentication</li>
                            <li>• API Gateway with API keys</li>
                            <li>• VPC endpoints for AWS services</li>
                            <li>• Private subnet isolation</li>
                          </ul>
                        </div>
                        
                        <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded border border-red-200 dark:border-red-800">
                          <h5 className="font-medium mb-2 text-red-900 dark:text-red-100">Security Policies</h5>
                          <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                            <li>• Session timeout: 8 hours</li>
                            <li>• Password complexity requirements</li>
                            <li>• Account lockout after 5 failed attempts</li>
                            <li>• Mandatory security training</li>
                            <li>• Regular access reviews</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Network Security */}
                  <div className="border border-blue-200 dark:border-blue-800 rounded-lg p-6 bg-gradient-to-r from-blue-50/50 to-cyan-50/50 dark:from-blue-950/10 dark:to-cyan-950/10">
                    <h4 className="text-lg font-semibold mb-4 text-blue-900 dark:text-blue-100 flex items-center">
                      <Network className="h-4 w-4 mr-2" />
                      Network Security & Protection
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <div className="space-y-3">
                        <h5 className="font-medium text-slate-900 dark:text-white">AWS WAF</h5>
                        <div className="p-3 bg-white dark:bg-slate-800 rounded border text-sm space-y-2">
                          <div>• SQL injection protection</div>
                          <div>• Cross-site scripting (XSS) prevention</div>
                          <div>• Rate limiting by IP/user</div>
                          <div>• Geo-blocking capabilities</div>
                          <div>• Custom rule sets</div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h5 className="font-medium text-slate-900 dark:text-white">AWS Shield</h5>
                        <div className="p-3 bg-white dark:bg-slate-800 rounded border text-sm space-y-2">
                          <div>• DDoS attack mitigation</div>
                          <div>• Always-on detection</div>
                          <div>• Automatic response</div>
                          <div>• 24/7 DRT support</div>
                          <div>• Cost protection</div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h5 className="font-medium text-slate-900 dark:text-white">VPC Security</h5>
                        <div className="p-3 bg-white dark:bg-slate-800 rounded border text-sm space-y-2">
                          <div>• Network ACLs</div>
                          <div>• Security groups</div>
                          <div>• Private subnets</div>
                          <div>• VPC Flow Logs</div>
                          <div>• NAT Gateway isolation</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Data Protection */}
                  <div className="border border-purple-200 dark:border-purple-800 rounded-lg p-6 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-950/10 dark:to-pink-950/10">
                    <h4 className="text-lg font-semibold mb-4 text-purple-900 dark:text-purple-100 flex items-center">
                      <Database className="h-4 w-4 mr-2" />
                      Data Protection & Encryption
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="p-4 bg-white dark:bg-slate-800 rounded border">
                          <h5 className="font-medium mb-3 text-slate-900 dark:text-white">Encryption at Rest</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>RDS Database</span>
                              <Badge variant="outline">AES-256</Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>S3 Buckets</span>
                              <Badge variant="outline">SSE-KMS</Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>DynamoDB</span>
                              <Badge variant="outline">AWS Managed</Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>EBS Volumes</span>
                              <Badge variant="outline">KMS Keys</Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-white dark:bg-slate-800 rounded border">
                          <h5 className="font-medium mb-3 text-slate-900 dark:text-white">Key Management</h5>
                          <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                            <li>• AWS Key Management Service (KMS)</li>
                            <li>• Customer-managed keys (CMK)</li>
                            <li>• Automatic key rotation</li>
                            <li>• Hardware security modules (HSM)</li>
                            <li>• Cross-region key replication</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="p-4 bg-white dark:bg-slate-800 rounded border">
                          <h5 className="font-medium mb-3 text-slate-900 dark:text-white">Encryption in Transit</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>HTTPS/TLS 1.3</span>
                              <Badge variant="outline">All Traffic</Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Database Connections</span>
                              <Badge variant="outline">SSL/TLS</Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>API Gateway</span>
                              <Badge variant="outline">TLS Only</Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Internal Services</span>
                              <Badge variant="outline">mTLS</Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded border border-amber-200 dark:border-amber-800">
                          <h5 className="font-medium mb-2 text-amber-900 dark:text-amber-100">Backup Strategy</h5>
                          <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                            <li>• Automated daily backups</li>
                            <li>• Point-in-time recovery (PITR)</li>
                            <li>• Cross-region replication</li>
                            <li>• 30-day retention policy</li>
                            <li>• Encrypted backup storage</li>
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
                    <Zap className="h-5 w-5 mr-2 text-purple-600" />
                    AI-Powered Intelligence Layer
                  </CardTitle>
                  <CardDescription>
                    Advanced AI services for intelligent architecture assistance, automated analysis, and smart recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* AWS Bedrock Integration */}
                  <div className="border border-purple-200 dark:border-purple-800 rounded-lg p-6 bg-gradient-to-r from-purple-50/50 to-indigo-50/50 dark:from-purple-950/10 dark:to-indigo-950/10">
                    <h4 className="text-lg font-semibold mb-4 text-purple-900 dark:text-purple-100 flex items-center">
                      <Zap className="h-4 w-4 mr-2" />
                      AWS Bedrock with Anthropic Claude
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="p-4 bg-white dark:bg-slate-800 rounded border">
                          <h5 className="font-medium mb-3 text-slate-900 dark:text-white">Core AI Capabilities</h5>
                          <div className="space-y-3">
                            <div className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded border border-blue-200 dark:border-blue-800">
                              <div className="font-medium text-blue-900 dark:text-blue-100">Natural Language Processing</div>
                              <div className="text-sm text-blue-700 dark:text-blue-300 mt-1">Convert text descriptions to architecture diagrams</div>
                            </div>
                            <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded border border-green-200 dark:border-green-800">
                              <div className="font-medium text-green-900 dark:text-green-100">Pattern Recognition</div>
                              <div className="text-sm text-green-700 dark:text-green-300 mt-1">Identify architectural patterns and anti-patterns</div>
                            </div>
                            <div className="p-3 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 rounded border border-orange-200 dark:border-orange-800">
                              <div className="font-medium text-orange-900 dark:text-orange-100">Smart Recommendations</div>
                              <div className="text-sm text-orange-700 dark:text-orange-300 mt-1">Suggest components and connections based on context</div>
                            </div>
                            <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded border border-purple-200 dark:border-purple-800">
                              <div className="font-medium text-purple-900 dark:text-purple-100">Compliance Validation</div>
                              <div className="text-sm text-purple-700 dark:text-purple-300 mt-1">Automated checking against enterprise standards</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-white dark:bg-slate-800 rounded border">
                          <h5 className="font-medium mb-3 text-slate-900 dark:text-white">Model Configuration</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Claude 3.5 Sonnet</span>
                              <Badge variant="outline">Primary Model</Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Context Window</span>
                              <Badge variant="outline">200K tokens</Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Response Time</span>
                              <Badge variant="outline">&lt; 3 seconds</Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Availability</span>
                              <Badge variant="outline">99.9% SLA</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="p-4 bg-white dark:bg-slate-800 rounded border">
                          <h5 className="font-medium mb-3 text-slate-900 dark:text-white">Use Cases</h5>
                          <div className="space-y-3 text-sm">
                            <div className="border-l-4 border-blue-500 pl-3">
                              <div className="font-medium text-slate-900 dark:text-white">Architecture Assistant</div>
                              <div className="text-slate-600 dark:text-slate-400">"Create a microservices architecture for e-commerce with payment processing"</div>
                            </div>
                            <div className="border-l-4 border-green-500 pl-3">
                              <div className="font-medium text-slate-900 dark:text-white">Code Analysis</div>
                              <div className="text-slate-600 dark:text-slate-400">Analyze existing codebases and generate architecture diagrams automatically</div>
                            </div>
                            <div className="border-l-4 border-orange-500 pl-3">
                              <div className="font-medium text-slate-900 dark:text-white">Best Practices</div>
                              <div className="text-slate-600 dark:text-slate-400">Suggest improvements based on industry standards and patterns</div>
                            </div>
                            <div className="border-l-4 border-purple-500 pl-3">
                              <div className="font-medium text-slate-900 dark:text-white">Documentation</div>
                              <div className="text-slate-600 dark:text-slate-400">Auto-generate technical documentation from diagrams</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded border border-green-200 dark:border-green-800">
                          <h5 className="font-medium mb-2 text-green-900 dark:text-green-100">Performance Metrics</h5>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="text-center p-2 bg-white dark:bg-slate-800 rounded">
                              <div className="text-2xl font-bold text-green-600 dark:text-green-400">95%</div>
                              <div className="text-green-700 dark:text-green-300">Accuracy</div>
                            </div>
                            <div className="text-center p-2 bg-white dark:bg-slate-800 rounded">
                              <div className="text-2xl font-bold text-green-600 dark:text-green-400">2.3s</div>
                              <div className="text-green-700 dark:text-green-300">Avg Response</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Custom AI Services */}
                  <div className="border border-blue-200 dark:border-blue-800 rounded-lg p-6 bg-gradient-to-r from-blue-50/50 to-cyan-50/50 dark:from-blue-950/10 dark:to-cyan-950/10">
                    <h4 className="text-lg font-semibold mb-4 text-blue-900 dark:text-blue-100 flex items-center">
                      <Cpu className="h-4 w-4 mr-2" />
                      Custom AI Services (ECS Containers)
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                      <Card className="bg-white/50 dark:bg-slate-800/50">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm flex items-center">
                            <Code className="h-3 w-3 mr-1" />
                            Code Sync Engine
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                            <div>• Bidirectional sync</div>
                            <div>• AST analysis</div>
                            <div>• Dependency mapping</div>
                            <div>• Change detection</div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-white/50 dark:bg-slate-800/50">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm flex items-center">
                            <Activity className="h-3 w-3 mr-1" />
                            Impact Analysis
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                            <div>• Change propagation</div>
                            <div>• Dependency analysis</div>
                            <div>• Risk assessment</div>
                            <div>• Impact scoring</div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-white/50 dark:bg-slate-800/50">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm flex items-center">
                            <Settings className="h-3 w-3 mr-1" />
                            Template Generator
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                            <div>• Pattern extraction</div>
                            <div>• Template creation</div>
                            <div>• Customization rules</div>
                            <div>• Version management</div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-white/50 dark:bg-slate-800/50">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm flex items-center">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Evolution AI
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                            <div>• Architecture evolution</div>
                            <div>• Modernization paths</div>
                            <div>• Technology roadmaps</div>
                            <div>• Migration planning</div>
                          </div>
                        </CardContent>
                      </Card>
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
                    <GitBranch className="h-5 w-5 mr-2 text-indigo-600" />
                    DevOps & Deployment Pipeline
                  </CardTitle>
                  <CardDescription>
                    Automated CI/CD pipeline with blue-green deployments, comprehensive testing, and monitoring
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* CI/CD Pipeline */}
                  <div className="border border-indigo-200 dark:border-indigo-800 rounded-lg p-6 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/10 dark:to-purple-950/10">
                    <h4 className="text-lg font-semibold mb-4 text-indigo-900 dark:text-indigo-100 flex items-center">
                      <GitBranch className="h-4 w-4 mr-2" />
                      AWS CodePipeline - Automated CI/CD
                    </h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                        <div className="p-4 bg-white dark:bg-slate-800 rounded border text-center">
                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                            <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">1</span>
                          </div>
                          <h5 className="font-medium text-slate-900 dark:text-white mb-1">Source</h5>
                          <p className="text-xs text-slate-600 dark:text-slate-400">GitHub integration with webhook triggers</p>
                        </div>
                        
                        <div className="p-4 bg-white dark:bg-slate-800 rounded border text-center">
                          <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                            <span className="text-green-600 dark:text-green-400 font-semibold text-sm">2</span>
                          </div>
                          <h5 className="font-medium text-slate-900 dark:text-white mb-1">Build</h5>
                          <p className="text-xs text-slate-600 dark:text-slate-400">CodeBuild with Docker container builds</p>
                        </div>
                        
                        <div className="p-4 bg-white dark:bg-slate-800 rounded border text-center">
                          <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                            <span className="text-orange-600 dark:text-orange-400 font-semibold text-sm">3</span>
                          </div>
                          <h5 className="font-medium text-slate-900 dark:text-white mb-1">Test</h5>
                          <p className="text-xs text-slate-600 dark:text-slate-400">Automated testing with Jest & Playwright</p>
                        </div>
                        
                        <div className="p-4 bg-white dark:bg-slate-800 rounded border text-center">
                          <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                            <span className="text-purple-600 dark:text-purple-400 font-semibold text-sm">4</span>
                          </div>
                          <h5 className="font-medium text-slate-900 dark:text-white mb-1">Security</h5>
                          <p className="text-xs text-slate-600 dark:text-slate-400">SAST/DAST scanning with CodeGuru</p>
                        </div>
                        
                        <div className="p-4 bg-white dark:bg-slate-800 rounded border text-center">
                          <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                            <span className="text-red-600 dark:text-red-400 font-semibold text-sm">5</span>
                          </div>
                          <h5 className="font-medium text-slate-900 dark:text-white mb-1">Deploy</h5>
                          <p className="text-xs text-slate-600 dark:text-slate-400">Blue-green deployment to ECS</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
                        <div className="p-4 bg-white dark:bg-slate-800 rounded border">
                          <h5 className="font-medium mb-3 text-slate-900 dark:text-white">Automated Testing</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Unit Tests (Jest)</span>
                              <Badge variant="outline">95% Coverage</Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Integration Tests</span>
                              <Badge variant="outline">API & DB</Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>E2E Tests (Playwright)</span>
                              <Badge variant="outline">Critical Paths</Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Performance Tests</span>
                              <Badge variant="outline">Load Testing</Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-white dark:bg-slate-800 rounded border">
                          <h5 className="font-medium mb-3 text-slate-900 dark:text-white">Security Scanning</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Dependency Scanning</span>
                              <Badge variant="outline">Snyk/OWASP</Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Container Scanning</span>
                              <Badge variant="outline">ECR Image Scan</Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Code Quality</span>
                              <Badge variant="outline">SonarQube</Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Secret Detection</span>
                              <Badge variant="outline">GitGuardian</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Deployment Strategy */}
                  <div className="border border-green-200 dark:border-green-800 rounded-lg p-6 bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-950/10 dark:to-emerald-950/10">
                    <h4 className="text-lg font-semibold mb-4 text-green-900 dark:text-green-100 flex items-center">
                      <Server className="h-4 w-4 mr-2" />
                      Blue-Green Deployment Strategy
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded border border-blue-200 dark:border-blue-800">
                          <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-3 flex items-center">
                            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                            Blue Environment (Current)
                          </h5>
                          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                            <li>• Active production traffic</li>
                            <li>• Stable application version</li>
                            <li>• Full monitoring enabled</li>
                            <li>• Load balancer routing 100%</li>
                          </ul>
                        </div>
                        
                        <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded border border-green-200 dark:border-green-800">
                          <h5 className="font-medium text-green-900 dark:text-green-100 mb-3 flex items-center">
                            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                            Green Environment (Staging)
                          </h5>
                          <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                            <li>• New application version</li>
                            <li>• Pre-production testing</li>
                            <li>• Health checks running</li>
                            <li>• Ready for traffic switch</li>
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
                                <div className="font-medium text-slate-900 dark:text-white">Deploy to Green</div>
                                <div className="text-slate-600 dark:text-slate-400">New version deployed to green environment</div>
                              </div>
                            </div>
                            <div className="flex items-start">
                              <div className="w-6 h-6 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mr-3 mt-0.5">
                                <span className="text-orange-600 dark:text-orange-400 text-xs font-semibold">2</span>
                              </div>
                              <div>
                                <div className="font-medium text-slate-900 dark:text-white">Health Checks</div>
                                <div className="text-slate-600 dark:text-slate-400">Automated testing and validation</div>
                              </div>
                            </div>
                            <div className="flex items-start">
                              <div className="w-6 h-6 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mr-3 mt-0.5">
                                <span className="text-orange-600 dark:text-orange-400 text-xs font-semibold">3</span>
                              </div>
                              <div>
                                <div className="font-medium text-slate-900 dark:text-white">Traffic Switch</div>
                                <div className="text-slate-600 dark:text-slate-400">Load balancer routes to green</div>
                              </div>
                            </div>
                            <div className="flex items-start">
                              <div className="w-6 h-6 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mr-3 mt-0.5">
                                <span className="text-orange-600 dark:text-orange-400 text-xs font-semibold">4</span>
                              </div>
                              <div>
                                <div className="font-medium text-slate-900 dark:text-white">Monitor</div>
                                <div className="text-slate-600 dark:text-slate-400">Real-time monitoring for issues</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded border border-red-200 dark:border-red-800">
                          <h5 className="font-medium mb-2 text-red-900 dark:text-red-100">Rollback Strategy</h5>
                          <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                            <li>• Automatic rollback on health check failure</li>
                            <li>• Manual rollback within 30 seconds</li>
                            <li>• Database rollback with backup restoration</li>
                            <li>• Zero-downtime rollback process</li>
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
                    <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                    AWS Cost Model & Optimization
                  </CardTitle>
                  <CardDescription>
                    Detailed cost breakdown with optimization strategies for enterprise-scale deployment
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* Monthly Cost Breakdown */}
                  <div className="border border-green-200 dark:border-green-800 rounded-lg p-6 bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-950/10 dark:to-emerald-950/10">
                    <h4 className="text-lg font-semibold mb-4 text-green-900 dark:text-green-100 flex items-center">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Monthly Cost Breakdown (10,000 Users)
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="p-4 bg-white dark:bg-slate-800 rounded border">
                          <h5 className="font-medium mb-3 text-slate-900 dark:text-white">Compute & Infrastructure</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>ECS Fargate (10 tasks)</span>
                              <span className="font-medium">$1,200</span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Application Load Balancer</span>
                              <span className="font-medium">$25</span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>CloudFront CDN</span>
                              <span className="font-medium">$150</span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>NAT Gateways (2)</span>
                              <span className="font-medium">$90</span>
                            </div>
                            <div className="border-t pt-2 mt-2">
                              <div className="flex items-center justify-between font-medium">
                                <span>Compute Subtotal</span>
                                <span className="text-green-600 dark:text-green-400">$1,465</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-white dark:bg-slate-800 rounded border">
                          <h5 className="font-medium mb-3 text-slate-900 dark:text-white">Data & Storage</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>RDS PostgreSQL (Multi-AZ)</span>
                              <span className="font-medium">$800</span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>DynamoDB (On-demand)</span>
                              <span className="font-medium">$200</span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>S3 Storage & Requests</span>
                              <span className="font-medium">$100</span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>ElastiCache Redis</span>
                              <span className="font-medium">$120</span>
                            </div>
                            <div className="border-t pt-2 mt-2">
                              <div className="flex items-center justify-between font-medium">
                                <span>Data Subtotal</span>
                                <span className="text-green-600 dark:text-green-400">$1,220</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="p-4 bg-white dark:bg-slate-800 rounded border">
                          <h5 className="font-medium mb-3 text-slate-900 dark:text-white">AI & ML Services</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>AWS Bedrock (Claude)</span>
                              <span className="font-medium">$500</span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>API Gateway</span>
                              <span className="font-medium">$75</span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Lambda Functions</span>
                              <span className="font-medium">$50</span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>EventBridge</span>
                              <span className="font-medium">$25</span>
                            </div>
                            <div className="border-t pt-2 mt-2">
                              <div className="flex items-center justify-between font-medium">
                                <span>AI/ML Subtotal</span>
                                <span className="text-green-600 dark:text-green-400">$650</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-white dark:bg-slate-800 rounded border">
                          <h5 className="font-medium mb-3 text-slate-900 dark:text-white">Security & Monitoring</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>AWS WAF & Shield</span>
                              <span className="font-medium">$100</span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>CloudWatch & X-Ray</span>
                              <span className="font-medium">$150</span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Secrets Manager</span>
                              <span className="font-medium">$20</span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>KMS Key Usage</span>
                              <span className="font-medium">$15</span>
                            </div>
                            <div className="border-t pt-2 mt-2">
                              <div className="flex items-center justify-between font-medium">
                                <span>Security Subtotal</span>
                                <span className="text-green-600 dark:text-green-400">$285</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 p-6 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-950/30 dark:to-emerald-950/30 rounded-lg border border-green-200 dark:border-green-800">
                      <h5 className="text-xl font-bold text-green-900 dark:text-green-100 mb-2">Total Monthly Cost</h5>
                      <div className="flex items-center justify-between">
                        <span className="text-lg text-green-800 dark:text-green-200">Production Environment (10,000 users)</span>
                        <span className="text-3xl font-bold text-green-600 dark:text-green-400">$3,620/month</span>
                      </div>
                      <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                        Includes: Multi-AZ deployment, auto-scaling, enterprise support, and 99.99% SLA
                      </div>
                    </div>
                  </div>

                  {/* Cost Optimization */}
                  <div className="border border-blue-200 dark:border-blue-800 rounded-lg p-6 bg-gradient-to-r from-blue-50/50 to-cyan-50/50 dark:from-blue-950/10 dark:to-cyan-950/10">
                    <h4 className="text-lg font-semibold mb-4 text-blue-900 dark:text-blue-100 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Cost Optimization Strategies
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="space-y-3">
                        <h5 className="font-medium text-slate-900 dark:text-white">Reserved Instances</h5>
                        <div className="p-3 bg-white dark:bg-slate-800 rounded border">
                          <div className="text-sm space-y-2">
                            <div className="flex justify-between">
                              <span className="text-slate-600 dark:text-slate-400">3-Year Reserved</span>
                              <span className="font-medium text-green-600 dark:text-green-400">-60%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600 dark:text-slate-400">1-Year Reserved</span>
                              <span className="font-medium text-green-600 dark:text-green-400">-40%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600 dark:text-slate-400">Savings Plans</span>
                              <span className="font-medium text-green-600 dark:text-green-400">-50%</span>
                            </div>
                            <div className="pt-2 border-t">
                              <div className="flex justify-between font-medium">
                                <span>Potential Savings</span>
                                <span className="text-green-600 dark:text-green-400">$1,500/mo</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h5 className="font-medium text-slate-900 dark:text-white">Auto-scaling Benefits</h5>
                        <div className="p-3 bg-white dark:bg-slate-800 rounded border">
                          <div className="text-sm space-y-2">
                            <div className="flex justify-between">
                              <span className="text-slate-600 dark:text-slate-400">Off-peak (60%)</span>
                              <span className="font-medium text-green-600 dark:text-green-400">-30%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600 dark:text-slate-400">Weekend scaling</span>
                              <span className="font-medium text-green-600 dark:text-green-400">-25%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600 dark:text-slate-400">Spot instances</span>
                              <span className="font-medium text-green-600 dark:text-green-400">-70%</span>
                            </div>
                            <div className="pt-2 border-t">
                              <div className="flex justify-between font-medium">
                                <span>Avg Savings</span>
                                <span className="text-green-600 dark:text-green-400">$800/mo</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h5 className="font-medium text-slate-900 dark:text-white">Resource Optimization</h5>
                        <div className="p-3 bg-white dark:bg-slate-800 rounded border">
                          <div className="text-sm space-y-2">
                            <div className="flex justify-between">
                              <span className="text-slate-600 dark:text-slate-400">S3 Intelligent Tiering</span>
                              <span className="font-medium text-green-600 dark:text-green-400">-40%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600 dark:text-slate-400">Data transfer optimization</span>
                              <span className="font-medium text-green-600 dark:text-green-400">-20%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600 dark:text-slate-400">CloudWatch optimization</span>
                              <span className="font-medium text-green-600 dark:text-green-400">-30%</span>
                            </div>
                            <div className="pt-2 border-t">
                              <div className="flex justify-between font-medium">
                                <span>Monthly Savings</span>
                                <span className="text-green-600 dark:text-green-400">$300/mo</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-950/20 rounded border border-orange-200 dark:border-orange-800">
                      <h5 className="font-medium text-orange-900 dark:text-orange-100 mb-2">Optimized Monthly Cost</h5>
                      <div className="flex items-center justify-between">
                        <span className="text-orange-800 dark:text-orange-200">With all optimizations applied:</span>
                        <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">$1,020/month</span>
                      </div>
                      <div className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                        72% cost reduction while maintaining enterprise-grade performance and reliability
                      </div>
                    </div>
                  </div>

                  {/* Scaling Cost Model */}
                  <div className="border border-purple-200 dark:border-purple-800 rounded-lg p-6 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-950/10 dark:to-pink-950/10">
                    <h4 className="text-lg font-semibold mb-4 text-purple-900 dark:text-purple-100 flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      Scaling Cost Model
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                      <Card className="bg-white/50 dark:bg-slate-800/50 text-center">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">1,000 Users</CardTitle>
                          <CardDescription>Startup Scale</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">$320</div>
                          <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                            <div>• 2 ECS tasks</div>
                            <div>• Single AZ RDS</div>
                            <div>• Basic monitoring</div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-white/50 dark:bg-slate-800/50 text-center">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">5,000 Users</CardTitle>
                          <CardDescription>Growth Scale</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">$680</div>
                          <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                            <div>• 5 ECS tasks</div>
                            <div>• Multi-AZ RDS</div>
                            <div>• Enhanced monitoring</div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-white/50 dark:bg-slate-800/50 text-center border-2 border-purple-300 dark:border-purple-700">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">10,000 Users</CardTitle>
                          <CardDescription className="text-purple-600 dark:text-purple-400 font-medium">Enterprise Scale</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">$1,020</div>
                          <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                            <div>• 10 ECS tasks</div>
                            <div>• Multi-region setup</div>
                            <div>• Full monitoring</div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-white/50 dark:bg-slate-800/50 text-center">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">50,000 Users</CardTitle>
                          <CardDescription>Global Scale</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">$3,200</div>
                          <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                            <div>• 50 ECS tasks</div>
                            <div>• Global deployment</div>
                            <div>• Enterprise support</div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Call to Action */}
          <div className="mt-12 text-center">
            <Card className="max-w-4xl mx-auto bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 border-orange-200 dark:border-orange-800">
              <CardContent className="pt-8 pb-8">
                <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
                  Ready to Deploy ARKHITEKTON on AWS?
                </h3>
                <p className="text-lg text-slate-600 dark:text-slate-300 mb-6 max-w-2xl mx-auto">
                  This comprehensive AWS architecture provides enterprise-grade scalability, security, and performance 
                  for your architecture modeling platform with intelligent AI assistance.
                </p>
                <div className="flex items-center justify-center space-x-4">
                  <Link href="/arkhitekton-architecture">
                    <Button variant="outline" size="lg">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Compare All Options
                    </Button>
                  </Link>
                  <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white">
                    Start AWS Deployment
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
    </AppLayout>
  );
}