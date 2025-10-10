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
  FileText,
  Lightbulb,
  BarChart3
} from "lucide-react";
import { GovernanceHeader } from "@/components/layout/governance-header";

export default function ArkhitektonArchitectureGCP() {
  return (
    <AppLayout>
      <div className="h-full overflow-hidden flex flex-col">
        <GovernanceHeader 
          moduleTitle="GCP Architecture" 
          moduleIcon={Cloud} 
        />
        
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-6 py-8">
          
          {/* Architecture Overview */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">Architecture Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Lightbulb className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">AI-First Innovation</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Industry-leading ML with Vertex AI and advanced language models</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-200 dark:border-blue-800">
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Advanced Analytics</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">BigQuery for enterprise data analytics and architecture insights</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800">
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Server className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Kubernetes Native</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Google Kubernetes Engine with advanced container orchestration</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border-orange-200 dark:border-orange-800">
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Globe className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Global Scale</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Google-grade global infrastructure with edge computing capabilities</p>
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
                <span className="text-xs">Data Platform</span>
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
                    <Server className="h-5 w-5 mr-2 text-green-600" />
                    Cloud-Native Infrastructure &amp; Orchestration
                  </CardTitle>
                  <CardDescription>
                    Kubernetes-native architecture with Google's innovative serverless and container technologies
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* Frontend Tier */}
                  <div className="border border-green-200 dark:border-green-800 rounded-lg p-6 bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-950/10 dark:to-emerald-950/10">
                    <h4 className="text-lg font-semibold mb-4 text-green-900 dark:text-green-100 flex items-center">
                      <Globe className="h-4 w-4 mr-2" />
                      Frontend Tier - Cloud CDN &amp; Global Load Balancing
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded border">
                          <span className="font-medium">Cloud CDN</span>
                          <Badge variant="outline">Global Edge</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded border">
                          <span className="font-medium">React 18 SPA (Cloud Storage)</span>
                          <Badge variant="outline">Static Hosting</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded border">
                          <span className="font-medium">Cloud DNS</span>
                          <Badge variant="outline">100% SLA</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded border">
                          <span className="font-medium">Global Load Balancer</span>
                          <Badge variant="outline">Anycast IP</Badge>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h5 className="font-medium text-slate-900 dark:text-white">Google-Grade Features:</h5>
                        <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                          <li>• 140+ global edge locations</li>
                          <li>• Intelligent routing with machine learning</li>
                          <li>• HTTP/3 and QUIC protocol support</li>
                          <li>• Auto-scaling with global capacity</li>
                          <li>• Edge Security with Cloud Armor</li>
                          <li>• Sub-second cache invalidation</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Application Tier */}
                  <div className="border border-blue-200 dark:border-blue-800 rounded-lg p-6 bg-gradient-to-r from-blue-50/50 to-cyan-50/50 dark:from-blue-950/10 dark:to-cyan-950/10">
                    <h4 className="text-lg font-semibold mb-4 text-blue-900 dark:text-blue-100 flex items-center">
                      <Layers className="h-4 w-4 mr-2" />
                      Application Tier - Cloud Run &amp; GKE Autopilot
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h5 className="font-medium text-slate-900 dark:text-white">Serverless Microservices</h5>
                        <div className="space-y-2">
                          <div className="p-3 bg-white dark:bg-slate-800 rounded border">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">API Gateway (Cloud Run)</span>
                              <Badge variant="secondary">Serverless</Badge>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Auto-scaling Express.js API with zero server management</p>
                          </div>
                          <div className="p-3 bg-white dark:bg-slate-800 rounded border">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">Architecture Engine</span>
                              <Badge variant="secondary">Knative</Badge>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Intelligent diagram processing with custom ML models</p>
                          </div>
                          <div className="p-3 bg-white dark:bg-slate-800 rounded border">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">Real-time Hub</span>
                              <Badge variant="secondary">WebSocket</Badge>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Global real-time collaboration with Firebase integration</p>
                          </div>
                          <div className="p-3 bg-white dark:bg-slate-800 rounded border">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">Analytics Engine</span>
                              <Badge variant="secondary">BigQuery ML</Badge>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Architecture pattern analysis and usage insights</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h5 className="font-medium text-slate-900 dark:text-white">Container Orchestration</h5>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded border">
                            <span className="font-medium">GKE Autopilot</span>
                            <Badge variant="outline">Fully Managed</Badge>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded border">
                            <span className="font-medium">Cloud Load Balancing</span>
                            <Badge variant="outline">Global L7</Badge>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded border">
                            <span className="font-medium">Horizontal Pod Autoscaler</span>
                            <Badge variant="outline">ML-powered</Badge>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded border">
                            <span className="font-medium">Istio Service Mesh</span>
                            <Badge variant="outline">Built-in</Badge>
                          </div>
                        </div>
                        <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/20 rounded border border-green-200 dark:border-green-800">
                          <h6 className="font-medium text-green-900 dark:text-green-100 mb-2">Auto-scaling Intelligence</h6>
                          <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                            <li>• Predictive scaling with ML</li>
                            <li>• CPU &amp; memory optimization</li>
                            <li>• Request-based scaling</li>
                            <li>• Custom metrics with Cloud Monitoring</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Network Architecture */}
                  <div className="border border-purple-200 dark:border-purple-800 rounded-lg p-6 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-950/10 dark:to-pink-950/10">
                    <h4 className="text-lg font-semibold mb-4 text-purple-900 dark:text-purple-100 flex items-center">
                      <Network className="h-4 w-4 mr-2" />
                      VPC Network &amp; Global Connectivity
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <Card className="bg-white/50 dark:bg-slate-800/50">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">Public Subnet</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0 space-y-2">
                          <div className="text-xs text-slate-600 dark:text-slate-400">
                            • External Load Balancers<br/>
                            • NAT Gateway instances<br/>
                            • Public IP addresses<br/>
                            • Cloud Router for BGP
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-white/50 dark:bg-slate-800/50">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">Private Subnet</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0 space-y-2">
                          <div className="text-xs text-slate-600 dark:text-slate-400">
                            • GKE cluster nodes<br/>
                            • Cloud Run services<br/>
                            • Internal Load Balancers<br/>
                            • Private Google Access
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-white/50 dark:bg-slate-800/50">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">Data Subnet</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0 space-y-2">
                          <div className="text-xs text-slate-600 dark:text-slate-400">
                            • Cloud SQL instances<br/>
                            • Firestore databases<br/>
                            • Memorystore clusters<br/>
                            • Private service connect
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded border border-blue-200 dark:border-blue-800">
                      <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-3">Global Network Infrastructure</h5>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm">
                        <div>
                          <h6 className="font-medium text-slate-900 dark:text-white mb-2">Google's Private Network</h6>
                          <ul className="text-blue-700 dark:text-blue-300 space-y-1">
                            <li>• 100,000+ miles of fiber optic cables</li>
                            <li>• 165+ network edge locations</li>
                            <li>• Premium Tier routing optimization</li>
                            <li>• Dedicated Interconnect options</li>
                          </ul>
                        </div>
                        <div>
                          <h6 className="font-medium text-slate-900 dark:text-white mb-2">Advanced Networking</h6>
                          <ul className="text-blue-700 dark:text-blue-300 space-y-1">
                            <li>• Software-defined networking (Andromeda)</li>
                            <li>• Global VPC with regional subnets</li>
                            <li>• Private service networking</li>
                            <li>• Shared VPC for multi-project setups</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Data Platform */}
            <TabsContent value="data" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Database className="h-5 w-5 mr-2 text-blue-600" />
                    Advanced Data Platform &amp; Analytics
                  </CardTitle>
                  <CardDescription>
                    Multi-modal data architecture combining traditional databases with advanced analytics and ML capabilities
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* Primary Database */}
                  <div className="border border-blue-200 dark:border-blue-800 rounded-lg p-6 bg-gradient-to-r from-blue-50/50 to-cyan-50/50 dark:from-blue-950/10 dark:to-cyan-950/10">
                    <h4 className="text-lg font-semibold mb-4 text-blue-900 dark:text-blue-100 flex items-center">
                      <Database className="h-4 w-4 mr-2" />
                      Cloud SQL for PostgreSQL - High Availability
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="p-4 bg-white dark:bg-slate-800 rounded border">
                          <h5 className="font-medium mb-3 text-slate-900 dark:text-white">Enterprise Data Models</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Architecture Models &amp; Diagrams</span>
                              <Badge variant="outline" className="text-xs">JSONB</Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>User &amp; Team Management</span>
                              <Badge variant="outline" className="text-xs">Relational</Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Project &amp; Workspace Data</span>
                              <Badge variant="outline" className="text-xs">Structured</Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Version Control &amp; Analytics</span>
                              <Badge variant="outline" className="text-xs">Time-series</Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-white dark:bg-slate-800 rounded border">
                          <h5 className="font-medium mb-3 text-slate-900 dark:text-white">Google Cloud Features</h5>
                          <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                            <li>• Regional persistent disks with snapshots</li>
                            <li>• Read replicas for global read scaling</li>
                            <li>• Automated backups with PITR</li>
                            <li>• Cloud IAM integration</li>
                            <li>• Advanced security with encryption</li>
                            <li>• Query Insights for optimization</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="p-4 bg-white dark:bg-slate-800 rounded border">
                          <h5 className="font-medium mb-3 text-slate-900 dark:text-white">Instance Specifications</h5>
                          <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                              <span className="text-slate-600 dark:text-slate-400">Machine Type</span>
                              <span className="font-medium">db-custom-8-32768</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600 dark:text-slate-400">Storage</span>
                              <span className="font-medium">1TB SSD Persistent Disk</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600 dark:text-slate-400">Network Throughput</span>
                              <span className="font-medium">16 Gbps</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600 dark:text-slate-400">Connections</span>
                              <span className="font-medium">500 max concurrent</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600 dark:text-slate-400">Backup Retention</span>
                              <span className="font-medium">365 days</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded border border-green-200 dark:border-green-800">
                          <h5 className="font-medium mb-2 text-green-900 dark:text-green-100">High Availability</h5>
                          <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                            <li>• Regional persistent disk for HA</li>
                            <li>• Automatic failover in 60-90 seconds</li>
                            <li>• Cross-region read replicas</li>
                            <li>• 99.95% availability SLA</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* NoSQL & Real-time */}
                  <div className="border border-purple-200 dark:border-purple-800 rounded-lg p-6 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-950/10 dark:to-pink-950/10">
                    <h4 className="text-lg font-semibold mb-4 text-purple-900 dark:text-purple-100 flex items-center">
                      <CloudDrizzle className="h-4 w-4 mr-2" />
                      Firestore &amp; Firebase - Real-time NoSQL
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <div className="space-y-3">
                        <h5 className="font-medium text-slate-900 dark:text-white">Real-time Collaboration</h5>
                        <div className="p-3 bg-white dark:bg-slate-800 rounded border text-sm">
                          <div className="space-y-2">
                            <div>• Live cursor synchronization</div>
                            <div>• Real-time diagram updates</div>
                            <div>• Presence awareness</div>
                            <div>• Collaborative comments</div>
                            <div>• Offline-first capabilities</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h5 className="font-medium text-slate-900 dark:text-white">Session &amp; Cache</h5>
                        <div className="p-3 bg-white dark:bg-slate-800 rounded border text-sm">
                          <div className="space-y-2">
                            <div>• User session management</div>
                            <div>• Workspace state caching</div>
                            <div>• Recent activity tracking</div>
                            <div>• Personalized recommendations</div>
                            <div>• Multi-device synchronization</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h5 className="font-medium text-slate-900 dark:text-white">Performance Features</h5>
                        <div className="p-3 bg-white dark:bg-slate-800 rounded border text-sm">
                          <div className="space-y-2">
                            <div>• Multi-region replication</div>
                            <div>• Strong consistency guarantees</div>
                            <div>• Automatic scaling</div>
                            <div>• 99.999% availability</div>
                            <div>• Mobile &amp; web SDKs</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* BigQuery Analytics */}
                  <div className="border border-green-200 dark:border-green-800 rounded-lg p-6 bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-950/10 dark:to-emerald-950/10">
                    <h4 className="text-lg font-semibold mb-4 text-green-900 dark:text-green-100 flex items-center">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      BigQuery - Enterprise Data Warehouse &amp; ML
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                      <Card className="bg-white/50 dark:bg-slate-800/50">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">Usage Analytics</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                            <div>• User behavior patterns</div>
                            <div>• Feature adoption metrics</div>
                            <div>• Performance analytics</div>
                            <div>• Collaboration insights</div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-white/50 dark:bg-slate-800/50">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">Architecture Intelligence</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                            <div>• Pattern recognition ML</div>
                            <div>• Complexity analysis</div>
                            <div>• Best practice recommendations</div>
                            <div>• Trend identification</div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-white/50 dark:bg-slate-800/50">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">Real-time Streaming</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                            <div>• Live data ingestion</div>
                            <div>• Event stream processing</div>
                            <div>• Real-time dashboards</div>
                            <div>• Pub/Sub integration</div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-white/50 dark:bg-slate-800/50">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">Data Lake</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                            <div>• Unlimited data storage</div>
                            <div>• Multi-format support</div>
                            <div>• Data lineage tracking</div>
                            <div>• Looker Studio integration</div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded border border-blue-200 dark:border-blue-800">
                      <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-3">BigQuery ML Capabilities</h5>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm">
                        <div>
                          <h6 className="font-medium text-slate-900 dark:text-white mb-2">Built-in ML Models</h6>
                          <ul className="text-blue-700 dark:text-blue-300 space-y-1">
                            <li>• Linear regression for performance prediction</li>
                            <li>• Classification for pattern recognition</li>
                            <li>• Clustering for user behavior analysis</li>
                            <li>• Time series forecasting for capacity planning</li>
                          </ul>
                        </div>
                        <div>
                          <h6 className="font-medium text-slate-900 dark:text-white mb-2">Advanced Analytics</h6>
                          <ul className="text-blue-700 dark:text-blue-300 space-y-1">
                            <li>• Architecture complexity scoring</li>
                            <li>• Automated anomaly detection</li>
                            <li>• Recommendation engine for improvements</li>
                            <li>• Predictive maintenance alerts</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Storage & Caching */}
                  <div className="border border-orange-200 dark:border-orange-800 rounded-lg p-6 bg-gradient-to-r from-orange-50/50 to-red-50/50 dark:from-orange-950/10 dark:to-red-950/10">
                    <h4 className="text-lg font-semibold mb-4 text-orange-900 dark:text-orange-100 flex items-center">
                      <HardDrive className="h-4 w-4 mr-2" />
                      Cloud Storage &amp; Memorystore
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                      <Card className="bg-white/50 dark:bg-slate-800/50">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">Cloud Storage</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                            <div>• Static website hosting</div>
                            <div>• Component libraries</div>
                            <div>• Template repositories</div>
                            <div>• Global CDN integration</div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-white/50 dark:bg-slate-800/50">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">Memorystore Redis</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                            <div>• Session state management</div>
                            <div>• Real-time caching</div>
                            <div>• Pub/Sub messaging</div>
                            <div>• High availability clusters</div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-white/50 dark:bg-slate-800/50">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">Cloud Filestore</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                            <div>• NFS file sharing</div>
                            <div>• Template collaboration</div>
                            <div>• Large file processing</div>
                            <div>• Container persistent volumes</div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-white/50 dark:bg-slate-800/50">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">Archive &amp; Backup</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                            <div>• Nearline &amp; Coldline storage</div>
                            <div>• Automated lifecycle policies</div>
                            <div>• Cross-region replication</div>
                            <div>• Disaster recovery</div>
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
                    Google-Grade Security &amp; Identity
                  </CardTitle>
                  <CardDescription>
                    BeyondCorp Zero Trust security model with advanced threat detection and enterprise identity management
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* Identity & Access Management */}
                  <div className="border border-green-200 dark:border-green-800 rounded-lg p-6 bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-950/10 dark:to-emerald-950/10">
                    <h4 className="text-lg font-semibold mb-4 text-green-900 dark:text-green-100 flex items-center">
                      <Key className="h-4 w-4 mr-2" />
                      Cloud Identity &amp; Access Management
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="p-4 bg-white dark:bg-slate-800 rounded border">
                          <h5 className="font-medium mb-3 text-slate-900 dark:text-white">Enterprise Identity</h5>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span className="text-sm">Google Workspace SSO</span>
                              <Badge variant="secondary">Native</Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span className="text-sm">Multi-Factor Authentication</span>
                              <Badge variant="secondary">2FA/FIDO2</Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span className="text-sm">SAML 2.0 Federation</span>
                              <Badge variant="secondary">Enterprise</Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span className="text-sm">BeyondCorp Enterprise</span>
                              <Badge variant="secondary">Zero Trust</Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-white dark:bg-slate-800 rounded border">
                          <h5 className="font-medium mb-3 text-slate-900 dark:text-white">Advanced Security Features</h5>
                          <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                            <li>• Context-aware access policies</li>
                            <li>• Device certificate management</li>
                            <li>• Security key enforcement</li>
                            <li>• Risk-based authentication</li>
                            <li>• Identity-aware proxy</li>
                            <li>• Admin audit logs</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="p-4 bg-white dark:bg-slate-800 rounded border">
                          <h5 className="font-medium mb-3 text-slate-900 dark:text-white">Enterprise Role Model</h5>
                          <div className="space-y-2 text-sm">
                            <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded border border-blue-200 dark:border-blue-800">
                              <div className="font-medium text-blue-900 dark:text-blue-100">Organization Admin</div>
                              <div className="text-blue-700 dark:text-blue-300">Full organization control, policy management, billing</div>
                            </div>
                            <div className="p-2 bg-green-50 dark:bg-green-950/30 rounded border border-green-200 dark:border-green-800">
                              <div className="font-medium text-green-900 dark:text-green-100">Chief Architect</div>
                              <div className="text-green-700 dark:text-green-300">Enterprise architecture governance, standards definition</div>
                            </div>
                            <div className="p-2 bg-orange-50 dark:bg-orange-950/30 rounded border border-orange-200 dark:border-orange-800">
                              <div className="font-medium text-orange-900 dark:text-orange-100">Senior Architect</div>
                              <div className="text-orange-700 dark:text-orange-300">Full modeling capabilities, team leadership</div>
                            </div>
                            <div className="p-2 bg-purple-50 dark:bg-purple-950/30 rounded border border-purple-200 dark:border-purple-800">
                              <div className="font-medium text-purple-900 dark:text-purple-100">Architect</div>
                              <div className="text-purple-700 dark:text-purple-300">Project-level architecture modeling and collaboration</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded border border-red-200 dark:border-red-800">
                          <h5 className="font-medium mb-2 text-red-900 dark:text-red-100">Zero Trust Principles</h5>
                          <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                            <li>• Never trust, always verify</li>
                            <li>• Least privilege access model</li>
                            <li>• Device-aware access controls</li>
                            <li>• Continuous security monitoring</li>
                            <li>• Encrypted communication always</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Network Security */}
                  <div className="border border-blue-200 dark:border-blue-800 rounded-lg p-6 bg-gradient-to-r from-blue-50/50 to-cyan-50/50 dark:from-blue-950/10 dark:to-cyan-950/10">
                    <h4 className="text-lg font-semibold mb-4 text-blue-900 dark:text-blue-100 flex items-center">
                      <Network className="h-4 w-4 mr-2" />
                      Cloud Armor &amp; Network Security
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <div className="space-y-3">
                        <h5 className="font-medium text-slate-900 dark:text-white">Cloud Armor Security</h5>
                        <div className="p-3 bg-white dark:bg-slate-800 rounded border text-sm space-y-2">
                          <div>• DDoS protection at edge</div>
                          <div>• WAF with OWASP rules</div>
                          <div>• Bot management &amp; mitigation</div>
                          <div>• Adaptive protection with ML</div>
                          <div>• Geographic access controls</div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h5 className="font-medium text-slate-900 dark:text-white">VPC Security</h5>
                        <div className="p-3 bg-white dark:bg-slate-800 rounded border text-sm space-y-2">
                          <div>• Private Google Access</div>
                          <div>• VPC Service Controls</div>
                          <div>• Firewall rules with ML insights</div>
                          <div>• Packet mirroring for analysis</div>
                          <div>• Network Intelligence Center</div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h5 className="font-medium text-slate-900 dark:text-white">Binary Authorization</h5>
                        <div className="p-3 bg-white dark:bg-slate-800 rounded border text-sm space-y-2">
                          <div>• Container image verification</div>
                          <div>• Attestation-based deployment</div>
                          <div>• Supply chain security</div>
                          <div>• Vulnerability scanning</div>
                          <div>• Policy enforcement</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Data Protection & Encryption */}
                  <div className="border border-purple-200 dark:border-purple-800 rounded-lg p-6 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-950/10 dark:to-pink-950/10">
                    <h4 className="text-lg font-semibold mb-4 text-purple-900 dark:text-purple-100 flex items-center">
                      <Lock className="h-4 w-4 mr-2" />
                      Data Protection &amp; Encryption
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="p-4 bg-white dark:bg-slate-800 rounded border">
                          <h5 className="font-medium mb-3 text-slate-900 dark:text-white">Cloud KMS &amp; HSM</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Customer-managed encryption</span>
                              <Badge variant="outline">FIPS 140-2 L3</Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Automatic key rotation</span>
                              <Badge variant="outline">Policy-driven</Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>External Key Manager (EKM)</span>
                              <Badge variant="outline">BYOK</Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Cloud HSM integration</span>
                              <Badge variant="outline">Hardware security</Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-white dark:bg-slate-800 rounded border">
                          <h5 className="font-medium mb-3 text-slate-900 dark:text-white">Encryption Standards</h5>
                          <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                            <li>• AES-256 encryption at rest (default)</li>
                            <li>• TLS 1.3 for data in transit</li>
                            <li>• Application-layer encryption</li>
                            <li>• Client-side encryption options</li>
                            <li>• Confidential Computing with TEEs</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="p-4 bg-white dark:bg-slate-800 rounded border">
                          <h5 className="font-medium mb-3 text-slate-900 dark:text-white">Compliance &amp; Governance</h5>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <Badge variant="outline" className="justify-center p-2">SOC 2 Type II</Badge>
                            <Badge variant="outline" className="justify-center p-2">ISO 27001</Badge>
                            <Badge variant="outline" className="justify-center p-2">GDPR Compliant</Badge>
                            <Badge variant="outline" className="justify-center p-2">HIPAA BAA</Badge>
                            <Badge variant="outline" className="justify-center p-2">FedRAMP Moderate</Badge>
                            <Badge variant="outline" className="justify-center p-2">PCI DSS Level 1</Badge>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded border border-amber-200 dark:border-amber-800">
                          <h5 className="font-medium mb-2 text-amber-900 dark:text-amber-100">Google Cloud Security</h5>
                          <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                            <li>• Shielded VMs with Secure Boot</li>
                            <li>• Confidential VMs for data in use</li>
                            <li>• Chronicle SIEM for threat detection</li>
                            <li>• Security Command Center</li>
                            <li>• Event Threat Detection</li>
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
                    <Zap className="h-5 w-5 mr-2 text-green-600" />
                    Vertex AI &amp; Machine Learning Platform
                  </CardTitle>
                  <CardDescription>
                    Google's industry-leading AI platform with custom models, AutoML, and integrated ML workflows
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* Vertex AI Platform */}
                  <div className="border border-green-200 dark:border-green-800 rounded-lg p-6 bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-950/10 dark:to-emerald-950/10">
                    <h4 className="text-lg font-semibold mb-4 text-green-900 dark:text-green-100 flex items-center">
                      <Zap className="h-4 w-4 mr-2" />
                      Vertex AI - Unified ML Platform
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="p-4 bg-white dark:bg-slate-800 rounded border">
                          <h5 className="font-medium mb-3 text-slate-900 dark:text-white">Generative AI Models</h5>
                          <div className="space-y-3">
                            <div className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded border border-blue-200 dark:border-blue-800">
                              <div className="font-medium text-blue-900 dark:text-blue-100">PaLM 2 &amp; Gemini</div>
                              <div className="text-sm text-blue-700 dark:text-blue-300 mt-1">Advanced reasoning and code generation for architecture analysis</div>
                            </div>
                            <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded border border-green-200 dark:border-green-800">
                              <div className="font-medium text-green-900 dark:text-green-100">Anthropic Claude (Model Garden)</div>
                              <div className="text-sm text-green-700 dark:text-green-300 mt-1">Third-party model integration for specialized tasks</div>
                            </div>
                            <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded border border-purple-200 dark:border-purple-800">
                              <div className="font-medium text-purple-900 dark:text-purple-100">Imagen &amp; Parti</div>
                              <div className="text-sm text-purple-700 dark:text-purple-300 mt-1">Text-to-image generation for custom icons and diagrams</div>
                            </div>
                            <div className="p-3 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 rounded border border-orange-200 dark:border-orange-800">
                              <div className="font-medium text-orange-900 dark:text-orange-100">Embedding API</div>
                              <div className="text-sm text-orange-700 dark:text-orange-300 mt-1">Multimodal embeddings for semantic search and similarity</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-white dark:bg-slate-800 rounded border">
                          <h5 className="font-medium mb-3 text-slate-900 dark:text-white">Enterprise Features</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Private endpoints</span>
                              <Badge variant="outline">VPC-native</Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Model versioning</span>
                              <Badge variant="outline">MLOps</Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>A/B testing</span>
                              <Badge variant="outline">Traffic splitting</Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Auto-scaling</span>
                              <Badge variant="outline">Serverless</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="p-4 bg-white dark:bg-slate-800 rounded border">
                          <h5 className="font-medium mb-3 text-slate-900 dark:text-white">Architecture AI Use Cases</h5>
                          <div className="space-y-3 text-sm">
                            <div className="border-l-4 border-blue-500 pl-3">
                              <div className="font-medium text-slate-900 dark:text-white">Intelligent Design Assistant</div>
                              <div className="text-slate-600 dark:text-slate-400">"Create a cloud-native architecture for financial services with regulatory compliance"</div>
                            </div>
                            <div className="border-l-4 border-green-500 pl-3">
                              <div className="font-medium text-slate-900 dark:text-white">Pattern Recognition</div>
                              <div className="text-slate-600 dark:text-slate-400">Automatically identify architectural patterns and anti-patterns in existing diagrams</div>
                            </div>
                            <div className="border-l-4 border-purple-500 pl-3">
                              <div className="font-medium text-slate-900 dark:text-white">Smart Recommendations</div>
                              <div className="text-slate-600 dark:text-slate-400">AI-powered suggestions for architecture improvements and optimization</div>
                            </div>
                            <div className="border-l-4 border-orange-500 pl-3">
                              <div className="font-medium text-slate-900 dark:text-white">Natural Language Queries</div>
                              <div className="text-slate-600 dark:text-slate-400">Ask questions about architecture in plain English and get intelligent responses</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded border border-green-200 dark:border-green-800">
                          <h5 className="font-medium mb-2 text-green-900 dark:text-green-100">Model Performance</h5>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="text-center p-2 bg-white dark:bg-slate-800 rounded">
                              <div className="text-2xl font-bold text-green-600 dark:text-green-400">97%</div>
                              <div className="text-green-700 dark:text-green-300">Accuracy</div>
                            </div>
                            <div className="text-center p-2 bg-white dark:bg-slate-800 rounded">
                              <div className="text-2xl font-bold text-green-600 dark:text-green-400">&lt;2s</div>
                              <div className="text-green-700 dark:text-green-300">Response Time</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AutoML & Custom Models */}
                  <div className="border border-blue-200 dark:border-blue-800 rounded-lg p-6 bg-gradient-to-r from-blue-50/50 to-cyan-50/50 dark:from-blue-950/10 dark:to-cyan-950/10">
                    <h4 className="text-lg font-semibold mb-4 text-blue-900 dark:text-blue-100 flex items-center">
                      <Cpu className="h-4 w-4 mr-2" />
                      AutoML &amp; Custom Intelligence
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                      <Card className="bg-white/50 dark:bg-slate-800/50">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm flex items-center">
                            <FileText className="h-3 w-3 mr-1" />
                            Document AI
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                            <div>• Architecture document parsing</div>
                            <div>• Requirements extraction</div>
                            <div>• Diagram text recognition</div>
                            <div>• Multi-language support</div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-white/50 dark:bg-slate-800/50">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm flex items-center">
                            <Activity className="h-3 w-3 mr-1" />
                            Vision AI
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                            <div>• Diagram component detection</div>
                            <div>• AutoML custom vision models</div>
                            <div>• Image classification</div>
                            <div>• Object detection &amp; labeling</div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-white/50 dark:bg-slate-800/50">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm flex items-center">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Time Series AI
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                            <div>• Usage pattern forecasting</div>
                            <div>• Capacity planning ML</div>
                            <div>• Anomaly detection</div>
                            <div>• Performance prediction</div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-white/50 dark:bg-slate-800/50">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm flex items-center">
                            <Code className="h-3 w-3 mr-1" />
                            Natural Language AI
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                            <div>• Architecture description analysis</div>
                            <div>• Sentiment analysis on feedback</div>
                            <div>• Multi-language translation</div>
                            <div>• AutoML text classification</div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* MLOps & Model Management */}
                  <div className="border border-purple-200 dark:border-purple-800 rounded-lg p-6 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-950/10 dark:to-pink-950/10">
                    <h4 className="text-lg font-semibold mb-4 text-purple-900 dark:text-purple-100 flex items-center">
                      <Settings className="h-4 w-4 mr-2" />
                      MLOps &amp; Responsible AI
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="p-4 bg-white dark:bg-slate-800 rounded border">
                          <h5 className="font-medium mb-3 text-slate-900 dark:text-white">Model Lifecycle Management</h5>
                          <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                            <li>• Vertex ML Metadata for lineage tracking</li>
                            <li>• Model Registry with versioning</li>
                            <li>• Automated model deployment pipelines</li>
                            <li>• Continuous monitoring &amp; drift detection</li>
                            <li>• A/B testing for model comparison</li>
                            <li>• Rollback capabilities for model versions</li>
                          </ul>
                        </div>
                        
                        <div className="p-4 bg-white dark:bg-slate-800 rounded border">
                          <h5 className="font-medium mb-3 text-slate-900 dark:text-white">Model Training &amp; Tuning</h5>
                          <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                            <li>• Vertex AI Training with custom containers</li>
                            <li>• Hyperparameter tuning with Vizier</li>
                            <li>• Distributed training on TPUs/GPUs</li>
                            <li>• Neural Architecture Search (NAS)</li>
                            <li>• Model compression &amp; quantization</li>
                            <li>• Transfer learning capabilities</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="p-4 bg-white dark:bg-slate-800 rounded border">
                          <h5 className="font-medium mb-3 text-slate-900 dark:text-white">AI Governance &amp; Ethics</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Explainable AI</span>
                              <Badge variant="outline">Built-in</Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Fairness indicators</span>
                              <Badge variant="outline">TensorFlow</Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Model cards</span>
                              <Badge variant="outline">Documentation</Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Bias detection</span>
                              <Badge variant="outline">Automated</Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded border border-amber-200 dark:border-amber-800">
                          <h5 className="font-medium mb-2 text-amber-900 dark:text-amber-100">Google AI Principles</h5>
                          <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                            <li>• Be socially beneficial</li>
                            <li>• Avoid creating or reinforcing bias</li>
                            <li>• Be built &amp; tested for safety</li>
                            <li>• Be accountable to people</li>
                            <li>• Incorporate privacy design principles</li>
                            <li>• Uphold high standards of scientific excellence</li>
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
                    <GitBranch className="h-5 w-5 mr-2 text-green-600" />
                    Cloud Build &amp; Deployment Pipeline
                  </CardTitle>
                  <CardDescription>
                    Google-native CI/CD with Cloud Build, comprehensive testing, and progressive deployment strategies
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* Cloud Build Pipeline */}
                  <div className="border border-green-200 dark:border-green-800 rounded-lg p-6 bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-950/10 dark:to-emerald-950/10">
                    <h4 className="text-lg font-semibold mb-4 text-green-900 dark:text-green-100 flex items-center">
                      <GitBranch className="h-4 w-4 mr-2" />
                      Cloud Build - Serverless CI/CD
                    </h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                        <div className="p-4 bg-white dark:bg-slate-800 rounded border text-center">
                          <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                            <span className="text-green-600 dark:text-green-400 font-semibold text-sm">1</span>
                          </div>
                          <h5 className="font-medium text-slate-900 dark:text-white mb-1">Source</h5>
                          <p className="text-xs text-slate-600 dark:text-slate-400">Cloud Source Repositories or GitHub</p>
                        </div>
                        
                        <div className="p-4 bg-white dark:bg-slate-800 rounded border text-center">
                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                            <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">2</span>
                          </div>
                          <h5 className="font-medium text-slate-900 dark:text-white mb-1">Build</h5>
                          <p className="text-xs text-slate-600 dark:text-slate-400">Serverless builds with Buildpacks</p>
                        </div>
                        
                        <div className="p-4 bg-white dark:bg-slate-800 rounded border text-center">
                          <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                            <span className="text-orange-600 dark:text-orange-400 font-semibold text-sm">3</span>
                          </div>
                          <h5 className="font-medium text-slate-900 dark:text-white mb-1">Test</h5>
                          <p className="text-xs text-slate-600 dark:text-slate-400">Parallel testing with Cloud Build</p>
                        </div>
                        
                        <div className="p-4 bg-white dark:bg-slate-800 rounded border text-center">
                          <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                            <span className="text-purple-600 dark:text-purple-400 font-semibold text-sm">4</span>
                          </div>
                          <h5 className="font-medium text-slate-900 dark:text-white mb-1">Security</h5>
                          <p className="text-xs text-slate-600 dark:text-slate-400">Binary Authorization &amp; vulnerability scanning</p>
                        </div>
                        
                        <div className="p-4 bg-white dark:bg-slate-800 rounded border text-center">
                          <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                            <span className="text-red-600 dark:text-red-400 font-semibold text-sm">5</span>
                          </div>
                          <h5 className="font-medium text-slate-900 dark:text-white mb-1">Deploy</h5>
                          <p className="text-xs text-slate-600 dark:text-slate-400">Progressive rollout to Cloud Run</p>
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
                              <Badge variant="outline">Cloud Testing</Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>E2E Tests (Playwright)</span>
                              <Badge variant="outline">Cloud infrastructure</Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Load Tests</span>
                              <Badge variant="outline">Cloud Load Testing</Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-white dark:bg-slate-800 rounded border">
                          <h5 className="font-medium mb-3 text-slate-900 dark:text-white">Security &amp; Quality</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Container Analysis API</span>
                              <Badge variant="outline">Vulnerability scanning</Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Binary Authorization</span>
                              <Badge variant="outline">Policy enforcement</Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Cloud Code Quality</span>
                              <Badge variant="outline">SonarQube integration</Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Artifact Registry</span>
                              <Badge variant="outline">Secure storage</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progressive Deployment */}
                  <div className="border border-blue-200 dark:border-blue-800 rounded-lg p-6 bg-gradient-to-r from-blue-50/50 to-cyan-50/50 dark:from-blue-950/10 dark:to-cyan-950/10">
                    <h4 className="text-lg font-semibold mb-4 text-blue-900 dark:text-blue-100 flex items-center">
                      <Server className="h-4 w-4 mr-2" />
                      Cloud Run - Progressive Deployment
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded border border-blue-200 dark:border-blue-800">
                          <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-3 flex items-center">
                            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                            Current Revision (Stable)
                          </h5>
                          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                            <li>• Production traffic serving</li>
                            <li>• Proven stable performance</li>
                            <li>• Full monitoring active</li>
                            <li>• Traffic allocation: 100% → gradual reduction</li>
                          </ul>
                        </div>
                        
                        <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded border border-green-200 dark:border-green-800">
                          <h5 className="font-medium text-green-900 dark:text-green-100 mb-3 flex items-center">
                            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                            New Revision (Canary)
                          </h5>
                          <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                            <li>• New application version</li>
                            <li>• Health check validation</li>
                            <li>• Gradual traffic ramp-up</li>
                            <li>• Real-time performance monitoring</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="p-4 bg-white dark:bg-slate-800 rounded border">
                          <h5 className="font-medium mb-3 text-slate-900 dark:text-white">Progressive Rollout Strategy</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-start">
                              <div className="w-6 h-6 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mr-3 mt-0.5">
                                <span className="text-orange-600 dark:text-orange-400 text-xs font-semibold">1</span>
                              </div>
                              <div>
                                <div className="font-medium text-slate-900 dark:text-white">Canary Release (5%)</div>
                                <div className="text-slate-600 dark:text-slate-400">Deploy to 5% of traffic for initial validation</div>
                              </div>
                            </div>
                            <div className="flex items-start">
                              <div className="w-6 h-6 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mr-3 mt-0.5">
                                <span className="text-orange-600 dark:text-orange-400 text-xs font-semibold">2</span>
                              </div>
                              <div>
                                <div className="font-medium text-slate-900 dark:text-white">Gradual Increase (25%)</div>
                                <div className="text-slate-600 dark:text-slate-400">Monitor metrics and increase traffic allocation</div>
                              </div>
                            </div>
                            <div className="flex items-start">
                              <div className="w-6 h-6 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mr-3 mt-0.5">
                                <span className="text-orange-600 dark:text-orange-400 text-xs font-semibold">3</span>
                              </div>
                              <div>
                                <div className="font-medium text-slate-900 dark:text-white">Full Rollout (100%)</div>
                                <div className="text-slate-600 dark:text-slate-400">Complete migration to new revision</div>
                              </div>
                            </div>
                            <div className="flex items-start">
                              <div className="w-6 h-6 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mr-3 mt-0.5">
                                <span className="text-orange-600 dark:text-orange-400 text-xs font-semibold">4</span>
                              </div>
                              <div>
                                <div className="font-medium text-slate-900 dark:text-white">Cleanup</div>
                                <div className="text-slate-600 dark:text-slate-400">Remove old revision after successful deployment</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded border border-red-200 dark:border-red-800">
                          <h5 className="font-medium mb-2 text-red-900 dark:text-red-100">Automated Rollback</h5>
                          <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                            <li>• Error rate threshold monitoring</li>
                            <li>• Latency degradation detection</li>
                            <li>• Instant traffic redirection</li>
                            <li>• Zero-downtime rollback guarantee</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Google Cloud DevOps */}
                  <div className="border border-purple-200 dark:border-purple-800 rounded-lg p-6 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-950/10 dark:to-pink-950/10">
                    <h4 className="text-lg font-semibold mb-4 text-purple-900 dark:text-purple-100 flex items-center">
                      <Building className="h-4 w-4 mr-2" />
                      Enterprise DevOps &amp; Monitoring
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="p-4 bg-white dark:bg-slate-800 rounded border">
                          <h5 className="font-medium mb-3 text-slate-900 dark:text-white">Observability Stack</h5>
                          <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                            <li>• Cloud Monitoring for metrics &amp; alerting</li>
                            <li>• Cloud Logging for centralized log analysis</li>
                            <li>• Cloud Trace for distributed tracing</li>
                            <li>• Cloud Profiler for application performance</li>
                            <li>• Error Reporting for exception tracking</li>
                            <li>• Cloud Debugger for live debugging</li>
                          </ul>
                        </div>
                        
                        <div className="p-4 bg-white dark:bg-slate-800 rounded border">
                          <h5 className="font-medium mb-3 text-slate-900 dark:text-white">Collaboration Tools</h5>
                          <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                            <li>• Google Workspace integration</li>
                            <li>• Shared VPC for cross-project resources</li>
                            <li>• IAM hierarchy for team management</li>
                            <li>• Cloud Asset Inventory for tracking</li>
                            <li>• Cloud Deployment Manager templates</li>
                            <li>• Anthos for hybrid deployments</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="p-4 bg-white dark:bg-slate-800 rounded border">
                          <h5 className="font-medium mb-3 text-slate-900 dark:text-white">Enterprise Governance</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Organization Policies</span>
                              <Badge variant="outline">Compliance</Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Cloud Billing</span>
                              <Badge variant="outline">Cost control</Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Security Command Center</span>
                              <Badge variant="outline">Threat detection</Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Forseti Security</span>
                              <Badge variant="outline">Policy monitoring</Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded border border-blue-200 dark:border-blue-800">
                          <h5 className="font-medium mb-2 text-blue-900 dark:text-blue-100">Environment Strategy</h5>
                          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                            <li>• Development: Single region, shared resources</li>
                            <li>• Staging: Production-like environment</li>
                            <li>• Production: Multi-region, high availability</li>
                            <li>• DR: Cross-region replication &amp; failover</li>
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
                    GCP Cost Model &amp; Innovation Value
                  </CardTitle>
                  <CardDescription>
                    Google Cloud's competitive pricing with sustained use discounts, preemptible instances, and per-second billing
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
                          <h5 className="font-medium mb-3 text-slate-900 dark:text-white">Compute &amp; Container Services</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Cloud Run (10 services)</span>
                              <span className="font-medium">$800</span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>GKE Autopilot cluster</span>
                              <span className="font-medium">$400</span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Cloud Load Balancing</span>
                              <span className="font-medium">$150</span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Cloud CDN</span>
                              <span className="font-medium">$120</span>
                            </div>
                            <div className="border-t pt-2 mt-2">
                              <div className="flex items-center justify-between font-medium">
                                <span>Compute Subtotal</span>
                                <span className="text-green-600 dark:text-green-400">$1,470</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-white dark:bg-slate-800 rounded border">
                          <h5 className="font-medium mb-3 text-slate-900 dark:text-white">Data &amp; Analytics Services</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Cloud SQL PostgreSQL</span>
                              <span className="font-medium">$600</span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Firestore (multi-region)</span>
                              <span className="font-medium">$300</span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>BigQuery (analytics)</span>
                              <span className="font-medium">$250</span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Cloud Storage &amp; Memorystore</span>
                              <span className="font-medium">$200</span>
                            </div>
                            <div className="border-t pt-2 mt-2">
                              <div className="flex items-center justify-between font-medium">
                                <span>Data Subtotal</span>
                                <span className="text-green-600 dark:text-green-400">$1,350</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="p-4 bg-white dark:bg-slate-800 rounded border">
                          <h5 className="font-medium mb-3 text-slate-900 dark:text-white">AI/ML &amp; Innovation Services</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Vertex AI (PaLM, Gemini)</span>
                              <span className="font-medium">$600</span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Document AI &amp; Vision API</span>
                              <span className="font-medium">$150</span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>AutoML &amp; Custom Models</span>
                              <span className="font-medium">$200</span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>BigQuery ML</span>
                              <span className="font-medium">$100</span>
                            </div>
                            <div className="border-t pt-2 mt-2">
                              <div className="flex items-center justify-between font-medium">
                                <span>AI/ML Subtotal</span>
                                <span className="text-green-600 dark:text-green-400">$1,050</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-white dark:bg-slate-800 rounded border">
                          <h5 className="font-medium mb-3 text-slate-900 dark:text-white">Security &amp; Operations</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Cloud Identity &amp; IAM</span>
                              <span className="font-medium">$300</span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Cloud KMS &amp; Security</span>
                              <span className="font-medium">$100</span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Cloud Monitoring &amp; Logging</span>
                              <span className="font-medium">$200</span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <span>Cloud Build &amp; DevOps</span>
                              <span className="font-medium">$150</span>
                            </div>
                            <div className="border-t pt-2 mt-2">
                              <div className="flex items-center justify-between font-medium">
                                <span>Security &amp; Ops Subtotal</span>
                                <span className="text-green-600 dark:text-green-400">$750</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 p-6 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-950/30 dark:to-emerald-950/30 rounded-lg border border-green-200 dark:border-green-800">
                      <h5 className="text-xl font-bold text-green-900 dark:text-green-100 mb-2">Total Monthly Cost</h5>
                      <div className="flex items-center justify-between">
                        <span className="text-lg text-green-800 dark:text-green-200">Innovation Environment (10,000 users)</span>
                        <span className="text-3xl font-bold text-green-600 dark:text-green-400">$4,620/month</span>
                      </div>
                      <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                        Includes: AI-first platform, advanced analytics, global CDN, and enterprise support
                      </div>
                    </div>
                  </div>

                  {/* Google Cloud Pricing Benefits */}
                  <div className="border border-blue-200 dark:border-blue-800 rounded-lg p-6 bg-gradient-to-r from-blue-50/50 to-cyan-50/50 dark:from-blue-950/10 dark:to-cyan-950/10">
                    <h4 className="text-lg font-semibold mb-4 text-blue-900 dark:text-blue-100 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Google Cloud Pricing Advantages
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="space-y-3">
                        <h5 className="font-medium text-slate-900 dark:text-white">Sustained Use Discounts</h5>
                        <div className="p-3 bg-white dark:bg-slate-800 rounded border">
                          <div className="text-sm space-y-2">
                            <div className="flex justify-between">
                              <span className="text-slate-600 dark:text-slate-400">Automatic discounts</span>
                              <span className="font-medium text-blue-600 dark:text-blue-400">-30%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600 dark:text-slate-400">No upfront commitment</span>
                              <span className="font-medium text-blue-600 dark:text-blue-400">-20%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600 dark:text-slate-400">Per-second billing</span>
                              <span className="font-medium text-blue-600 dark:text-blue-400">-15%</span>
                            </div>
                            <div className="pt-2 border-t">
                              <div className="flex justify-between font-medium">
                                <span>Monthly Savings</span>
                                <span className="text-blue-600 dark:text-blue-400">$1,200</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h5 className="font-medium text-slate-900 dark:text-white">Preemptible &amp; Spot</h5>
                        <div className="p-3 bg-white dark:bg-slate-800 rounded border">
                          <div className="text-sm space-y-2">
                            <div className="flex justify-between">
                              <span className="text-slate-600 dark:text-slate-400">Preemptible VMs</span>
                              <span className="font-medium text-blue-600 dark:text-blue-400">-80%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600 dark:text-slate-400">Spot instances</span>
                              <span className="font-medium text-blue-600 dark:text-blue-400">-70%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600 dark:text-slate-400">Batch workloads</span>
                              <span className="font-medium text-blue-600 dark:text-blue-400">-60%</span>
                            </div>
                            <div className="pt-2 border-t">
                              <div className="flex justify-between font-medium">
                                <span>Potential Savings</span>
                                <span className="text-blue-600 dark:text-blue-400">$800</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h5 className="font-medium text-slate-900 dark:text-white">Committed Use Discounts</h5>
                        <div className="p-3 bg-white dark:bg-slate-800 rounded border">
                          <div className="text-sm space-y-2">
                            <div className="flex justify-between">
                              <span className="text-slate-600 dark:text-slate-400">1-year commitment</span>
                              <span className="font-medium text-blue-600 dark:text-blue-400">-25%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600 dark:text-slate-400">3-year commitment</span>
                              <span className="font-medium text-blue-600 dark:text-blue-400">-57%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600 dark:text-slate-400">Flexible usage</span>
                              <span className="font-medium text-blue-600 dark:text-blue-400">-35%</span>
                            </div>
                            <div className="pt-2 border-t">
                              <div className="flex justify-between font-medium">
                                <span>Avg Savings</span>
                                <span className="text-blue-600 dark:text-blue-400">$1,500</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-950/20 rounded border border-orange-200 dark:border-orange-800">
                      <h5 className="font-medium text-orange-900 dark:text-orange-100 mb-2">Optimized Monthly Cost</h5>
                      <div className="flex items-center justify-between">
                        <span className="text-orange-800 dark:text-orange-200">With Google Cloud pricing benefits:</span>
                        <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">$1,120/month</span>
                      </div>
                      <div className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                        76% cost reduction with automatic discounts and intelligent pricing
                      </div>
                    </div>
                  </div>

                  {/* Innovation ROI */}
                  <div className="border border-purple-200 dark:border-purple-800 rounded-lg p-6 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-950/10 dark:to-pink-950/10">
                    <h4 className="text-lg font-semibold mb-4 text-purple-900 dark:text-purple-100 flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      Innovation ROI &amp; Scaling Model
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                      <Card className="bg-white/50 dark:bg-slate-800/50 text-center">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">1,000 Users</CardTitle>
                          <CardDescription>Innovation Startup</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">$280</div>
                          <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                            <div>• Single region deployment</div>
                            <div>• Basic AI capabilities</div>
                            <div>• Standard support</div>
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
                            <div>• Multi-region setup</div>
                            <div>• Advanced ML features</div>
                            <div>• Enhanced analytics</div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-white/50 dark:bg-slate-800/50 text-center border-2 border-purple-300 dark:border-purple-700">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">10,000 Users</CardTitle>
                          <CardDescription className="text-purple-600 dark:text-purple-400 font-medium">Enterprise Innovation</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">$1,120</div>
                          <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                            <div>• Global deployment</div>
                            <div>• Full AI platform</div>
                            <div>• Premium support</div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-white/50 dark:bg-slate-800/50 text-center">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">50,000 Users</CardTitle>
                          <CardDescription>Global Innovation</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">$3,800</div>
                          <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                            <div>• Multi-tenant architecture</div>
                            <div>• Custom AI models</div>
                            <div>• Dedicated support</div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded border border-blue-200 dark:border-blue-800">
                      <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-3">Innovation Acceleration Value</h5>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-sm">
                        <div>
                          <h6 className="font-medium text-slate-900 dark:text-white mb-2">AI-Powered Productivity</h6>
                          <ul className="text-blue-700 dark:text-blue-300 space-y-1">
                            <li>• 70% faster architecture design</li>
                            <li>• 80% reduction in analysis time</li>
                            <li>• 90% improvement in pattern recognition</li>
                            <li>• 60% faster decision making</li>
                          </ul>
                        </div>
                        <div>
                          <h6 className="font-medium text-slate-900 dark:text-white mb-2">Innovation Benefits</h6>
                          <ul className="text-blue-700 dark:text-blue-300 space-y-1">
                            <li>• Real-time analytics and insights</li>
                            <li>• Predictive architecture recommendations</li>
                            <li>• Automated compliance checking</li>
                            <li>• Intelligent pattern discovery</li>
                          </ul>
                        </div>
                        <div>
                          <h6 className="font-medium text-slate-900 dark:text-white mb-2">Competitive Advantage</h6>
                          <ul className="text-blue-700 dark:text-blue-300 space-y-1">
                            <li>• First-mover advantage in AI architecture</li>
                            <li>• Continuous model improvement</li>
                            <li>• Future-proof technology stack</li>
                            <li>• Innovation leadership positioning</li>
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
            <Card className="max-w-4xl mx-auto bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
              <CardContent className="pt-8 pb-8">
                <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
                  Ready to Deploy ARKHITEKTON on Google Cloud?
                </h3>
                <p className="text-lg text-slate-600 dark:text-slate-300 mb-6 max-w-2xl mx-auto">
                  This innovation-first GCP architecture provides industry-leading AI/ML capabilities, 
                  advanced data analytics, and Google-grade global infrastructure for next-generation architecture platforms.
                </p>
                <div className="flex items-center justify-center space-x-4">
                  <Link href="/arkhitekton-architecture">
                    <Button variant="outline" size="lg">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Compare All Options
                    </Button>
                  </Link>
                  <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                    Start GCP Deployment
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