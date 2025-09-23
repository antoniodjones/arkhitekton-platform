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

export default function ArkhitektonArchitectureOracle() {
  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-red-50/30 via-orange-50/20 to-amber-50/30 dark:from-red-950/10 dark:via-orange-950/5 dark:to-amber-950/10">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-orange-600 text-white">
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
            
            <h1 className="text-4xl font-bold mb-4">ARKHITEKTON on Oracle Cloud</h1>
            <p className="text-xl text-red-100 max-w-4xl">
              Enterprise architecture leveraging Oracle's autonomous database technology and business applications platform. 
              Designed for mission-critical workloads with superior database performance and enterprise application integration.
            </p>
            
            <div className="flex items-center mt-6 space-x-6">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                Autonomous Database
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                99.995% SLA Available
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                Enterprise Apps Ready
              </Badge>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-12">
          
          {/* Enterprise Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <Card className="text-center border-red-200 dark:border-red-800">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">99.995%</div>
                <div className="text-sm text-slate-600 dark:text-slate-300">Database Uptime SLA</div>
              </CardContent>
            </Card>
            
            <Card className="text-center border-red-200 dark:border-red-800">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">75%</div>
                <div className="text-sm text-slate-600 dark:text-slate-300">Cost Reduction vs On-Premise</div>
              </CardContent>
            </Card>
            
            <Card className="text-center border-red-200 dark:border-red-800">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">2x</div>
                <div className="text-sm text-slate-600 dark:text-slate-300">Faster Oracle Workloads</div>
              </CardContent>
            </Card>
            
            <Card className="text-center border-red-200 dark:border-red-800">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">100%</div>
                <div className="text-sm text-slate-600 dark:text-slate-300">License Compatibility</div>
              </CardContent>
            </Card>
          </div>

          {/* Architecture Overview */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">Architecture Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 border-red-200 dark:border-red-800">
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Database className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Autonomous DB</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Self-managing, self-securing database with 99.995% uptime SLA</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 border-orange-200 dark:border-orange-800">
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Enterprise Security</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Zero-trust security with Database Vault and Cloud Guard protection</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 border-amber-200 dark:border-amber-800">
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Cpu className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">High Performance</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Bare metal compute with Exadata optimization for 100x faster analytics</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Settings className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Enterprise Apps</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Native Oracle Fusion Cloud integration for business applications</p>
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
                    <Server className="h-5 w-5 mr-2 text-red-600" />
                    Compute & Networking Infrastructure
                  </CardTitle>
                  <CardDescription>
                    High-performance bare metal and container architecture with autonomous management capabilities
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* Frontend Tier */}
                  <div className="border border-red-200 dark:border-red-800 rounded-lg p-6 bg-gradient-to-r from-red-50/50 to-orange-50/50 dark:from-red-950/10 dark:to-orange-950/10">
                    <h4 className="text-lg font-semibold mb-4 text-red-900 dark:text-red-100 flex items-center">
                      <Globe className="h-4 w-4 mr-2" />
                      Frontend Tier - Oracle Content Delivery
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded border">
                          <span className="font-medium">OCI CDN</span>
                          <Badge variant="outline">Global</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded border">
                          <span className="font-medium">Oracle APEX + React</span>
                          <Badge variant="outline">Hybrid</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded border">
                          <span className="font-medium">DNS & Load Balancer</span>
                          <Badge variant="outline">99.99% SLA</Badge>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h5 className="font-medium text-slate-900 dark:text-white">Key Features:</h5>
                        <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                          <li>• Global edge caching network</li>
                          <li>• Auto-scaling load balancers</li>
                          <li>• SSL/TLS termination</li>
                          <li>• Web Application Firewall</li>
                          <li>• Real-time monitoring</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Application Tier */}
                  <div className="border border-orange-200 dark:border-orange-800 rounded-lg p-6 bg-gradient-to-r from-orange-50/50 to-amber-50/50 dark:from-orange-950/10 dark:to-amber-950/10">
                    <h4 className="text-lg font-semibold mb-4 text-orange-900 dark:text-orange-100 flex items-center">
                      <Layers className="h-4 w-4 mr-2" />
                      Application Tier - Container Engine Services
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h5 className="font-medium text-slate-900 dark:text-white">OCI Container Engine (OKE)</h5>
                        <div className="space-y-2">
                          <div className="p-3 bg-white dark:bg-slate-800 rounded border">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">API Gateway</span>
                              <Badge variant="secondary">Node.js</Badge>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">RESTful API with Oracle Functions integration</p>
                          </div>
                          <div className="p-3 bg-white dark:bg-slate-800 rounded border">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">Business Logic</span>
                              <Badge variant="secondary">Java/Node.js</Badge>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Microservices with Oracle Integration Cloud</p>
                          </div>
                          <div className="p-3 bg-white dark:bg-slate-800 rounded border">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">Enterprise Apps</span>
                              <Badge variant="secondary">Oracle Fusion</Badge>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Native Oracle Cloud Applications integration</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h5 className="font-medium text-slate-900 dark:text-white">Scaling & Performance</h5>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-950/20 rounded">
                            <div>
                              <div className="font-medium">Auto-scaling</div>
                              <div className="text-sm text-slate-600 dark:text-slate-300">Kubernetes HPA + VPA</div>
                            </div>
                            <TrendingUp className="h-5 w-5 text-amber-600" />
                          </div>
                          <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-950/20 rounded">
                            <div>
                              <div className="font-medium">Performance</div>
                              <div className="text-sm text-slate-600 dark:text-slate-300">Bare metal compute optimization</div>
                            </div>
                            <Zap className="h-5 w-5 text-amber-600" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Networking */}
                  <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6 bg-gradient-to-r from-gray-50/50 to-slate-50/50 dark:from-gray-950/10 dark:to-slate-950/10">
                    <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100 flex items-center">
                      <Network className="h-4 w-4 mr-2" />
                      Virtual Cloud Networks & Connectivity
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
                        <Globe className="h-8 w-8 text-red-600 dark:text-red-400 mx-auto mb-3" />
                        <h4 className="font-medium mb-2">Global Connectivity</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-300">FastConnect for dedicated network paths</p>
                      </div>
                      <div className="text-center p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
                        <Shield className="h-8 w-8 text-red-600 dark:text-red-400 mx-auto mb-3" />
                        <h4 className="font-medium mb-2">Security Groups</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-300">Micro-segmentation with network security lists</p>
                      </div>
                      <div className="text-center p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
                        <Monitor className="h-8 w-8 text-red-600 dark:text-red-400 mx-auto mb-3" />
                        <h4 className="font-medium mb-2">Traffic Management</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-300">Intelligent load balancing and routing</p>
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
                    <Database className="h-5 w-5 mr-2 text-red-600" />
                    Autonomous Database Platform
                  </CardTitle>
                  <CardDescription>
                    Self-managing, self-securing database with machine learning optimization and enterprise integration
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* Autonomous Database */}
                  <div className="border border-red-200 dark:border-red-800 rounded-lg p-6 bg-gradient-to-r from-red-50/50 to-orange-50/50 dark:from-red-950/10 dark:to-orange-950/10">
                    <h4 className="text-lg font-semibold mb-4 text-red-900 dark:text-red-100 flex items-center">
                      <Database className="h-4 w-4 mr-2" />
                      Oracle Autonomous Database - Core Data Engine
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded border">
                          <span className="font-medium">Autonomous Transaction Processing</span>
                          <Badge variant="outline">OLTP</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded border">
                          <span className="font-medium">Autonomous Data Warehouse</span>
                          <Badge variant="outline">OLAP</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded border">
                          <span className="font-medium">JSON Database</span>
                          <Badge variant="outline">NoSQL</Badge>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h5 className="font-medium text-slate-900 dark:text-white">Autonomous Features:</h5>
                        <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                          <li>• Self-provisioning and scaling</li>
                          <li>• Automatic security patching</li>
                          <li>• AI-driven performance tuning</li>
                          <li>• Autonomous backup and recovery</li>
                          <li>• 99.995% availability SLA</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Data Integration */}
                  <div className="border border-orange-200 dark:border-orange-800 rounded-lg p-6 bg-gradient-to-r from-orange-50/50 to-amber-50/50 dark:from-orange-950/10 dark:to-amber-950/10">
                    <h4 className="text-lg font-semibold mb-4 text-orange-900 dark:text-orange-100 flex items-center">
                      <GitBranch className="h-4 w-4 mr-2" />
                      Data Integration & Analytics
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <div className="p-3 bg-white dark:bg-slate-800 rounded border">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Oracle Integration Cloud</span>
                          <Badge variant="secondary">ETL</Badge>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Real-time data integration and transformation</p>
                      </div>
                      <div className="p-3 bg-white dark:bg-slate-800 rounded border">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Oracle Analytics Cloud</span>
                          <Badge variant="secondary">BI</Badge>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Enterprise business intelligence and visualization</p>
                      </div>
                      <div className="p-3 bg-white dark:bg-slate-800 rounded border">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Big Data Service</span>
                          <Badge variant="secondary">Hadoop</Badge>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Managed Hadoop and Spark for big data processing</p>
                      </div>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                      <div className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">100x</div>
                      <div className="text-sm text-slate-600 dark:text-slate-300">Faster Analytics with Exadata</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                      <div className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">99.995%</div>
                      <div className="text-sm text-slate-600 dark:text-slate-300">Database Uptime SLA</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                      <div className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">80%</div>
                      <div className="text-sm text-slate-600 dark:text-slate-300">Reduced Database Admin Tasks</div>
                    </div>
                  </div>

                </CardContent>
              </Card>
            </TabsContent>

            {/* Security */}
            <TabsContent value="security" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Security & Compliance */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Shield className="h-5 w-5 mr-2 text-red-600 dark:text-red-400" />
                      Identity & Access Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <div className="font-medium">Oracle Identity Cloud Service</div>
                        <div className="text-sm text-slate-600 dark:text-slate-300">Enterprise SSO with multi-factor authentication</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <div className="font-medium">Privileged Access Management</div>
                        <div className="text-sm text-slate-600 dark:text-slate-300">Role-based access with approval workflows</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <div className="font-medium">Federation & Integration</div>
                        <div className="text-sm text-slate-600 dark:text-slate-300">SAML/OAuth integration with enterprise directories</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <div className="font-medium">Risk-based Authentication</div>
                        <div className="text-sm text-slate-600 dark:text-slate-300">AI-powered adaptive authentication</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Monitoring & Operations */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Lock className="h-5 w-5 mr-2 text-red-600 dark:text-red-400" />
                      Data Protection & Encryption
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Lock className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <div className="font-medium">Transparent Data Encryption</div>
                        <div className="text-sm text-slate-600 dark:text-slate-300">AES-256 encryption for data at rest and in transit</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Lock className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <div className="font-medium">Database Vault</div>
                        <div className="text-sm text-slate-600 dark:text-slate-300">Real-time database activity monitoring and protection</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Lock className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <div className="font-medium">Key Management</div>
                        <div className="text-sm text-slate-600 dark:text-slate-300">OCI Vault for centralized encryption key management</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Lock className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <div className="font-medium">Data Masking & Subsetting</div>
                        <div className="text-sm text-slate-600 dark:text-slate-300">Production data protection for non-production environments</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

              </div>

              {/* Performance Optimization */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-red-600 dark:text-red-400" />
                    Performance & Scalability
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
                      <Zap className="h-8 w-8 text-red-600 dark:text-red-400 mx-auto mb-3" />
                      <h4 className="font-medium mb-2">Database Performance</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300">Exadata optimizations with 100x faster analytics</p>
                    </div>
                    <div className="text-center p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
                      <Cpu className="h-8 w-8 text-red-600 dark:text-red-400 mx-auto mb-3" />
                      <h4 className="font-medium mb-2">Compute Scaling</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300">Auto-scaling instances with bare metal performance</p>
                    </div>
                    <div className="text-center p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
                      <Globe className="h-8 w-8 text-red-600 dark:text-red-400 mx-auto mb-3" />
                      <h4 className="font-medium mb-2">Global Distribution</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300">Multi-region deployment with FastConnect</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

            </TabsContent>

            {/* AI/ML */}
            <TabsContent value="ai" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-red-600" />
                    Oracle AI & Machine Learning Platform
                  </CardTitle>
                  <CardDescription>
                    Enterprise AI services with autonomous capabilities and Oracle Database machine learning integration
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* AI Services */}
                  <div className="border border-red-200 dark:border-red-800 rounded-lg p-6 bg-gradient-to-r from-red-50/50 to-orange-50/50 dark:from-red-950/10 dark:to-orange-950/10">
                    <h4 className="text-lg font-semibold mb-4 text-red-900 dark:text-red-100 flex items-center">
                      <Zap className="h-4 w-4 mr-2" />
                      Oracle AI Services
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded border">
                          <span className="font-medium">OCI AI Language</span>
                          <Badge variant="outline">NLP</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded border">
                          <span className="font-medium">OCI Vision</span>
                          <Badge variant="outline">Computer Vision</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded border">
                          <span className="font-medium">OCI Speech</span>
                          <Badge variant="outline">STT/TTS</Badge>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h5 className="font-medium text-slate-900 dark:text-white">AI Capabilities:</h5>
                        <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                          <li>• Pre-trained models for common use cases</li>
                          <li>• Custom model training and deployment</li>
                          <li>• Real-time inference APIs</li>
                          <li>• Multi-language support</li>
                          <li>• Enterprise security and compliance</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* ML Platform */}
                  <div className="border border-orange-200 dark:border-orange-800 rounded-lg p-6 bg-gradient-to-r from-orange-50/50 to-amber-50/50 dark:from-orange-950/10 dark:to-amber-950/10">
                    <h4 className="text-lg font-semibold mb-4 text-orange-900 dark:text-orange-100 flex items-center">
                      <Cpu className="h-4 w-4 mr-2" />
                      Oracle Machine Learning Platform
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <div className="p-3 bg-white dark:bg-slate-800 rounded border">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">OML in Database</span>
                          <Badge variant="secondary">In-DB ML</Badge>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Machine learning algorithms directly in Autonomous Database</p>
                      </div>
                      <div className="p-3 bg-white dark:bg-slate-800 rounded border">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">OCI Data Science</span>
                          <Badge variant="secondary">Notebooks</Badge>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Collaborative platform for data scientists</p>
                      </div>
                      <div className="p-3 bg-white dark:bg-slate-800 rounded border">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Model Deployment</span>
                          <Badge variant="secondary">MLOps</Badge>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Automated model deployment and monitoring</p>
                      </div>
                    </div>
                  </div>

                  {/* ARKHITEKTON AI Integration */}
                  <div className="border border-green-200 dark:border-green-800 rounded-lg p-6 bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-950/10 dark:to-emerald-950/10">
                    <h4 className="text-lg font-semibold mb-4 text-green-900 dark:text-green-100 flex items-center">
                      <Settings className="h-4 w-4 mr-2" />
                      ARKHITEKTON AI Architecture Assistant
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded">
                          <div>
                            <div className="font-medium">Architecture Pattern Recognition</div>
                            <div className="text-sm text-slate-600 dark:text-slate-300">ML-powered architecture analysis</div>
                          </div>
                          <Zap className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded">
                          <div>
                            <div className="font-medium">Intelligent Recommendations</div>
                            <div className="text-sm text-slate-600 dark:text-slate-300">AI-driven design suggestions</div>
                          </div>
                          <Zap className="h-5 w-5 text-green-600" />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded">
                          <div>
                            <div className="font-medium">Compliance Validation</div>
                            <div className="text-sm text-slate-600 dark:text-slate-300">Automated compliance checking</div>
                          </div>
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded">
                          <div>
                            <div className="font-medium">Performance Optimization</div>
                            <div className="text-sm text-slate-600 dark:text-slate-300">AI-powered performance tuning</div>
                          </div>
                          <TrendingUp className="h-5 w-5 text-green-600" />
                        </div>
                      </div>
                    </div>
                  </div>

                </CardContent>
              </Card>
            </TabsContent>

            {/* DevOps */}
            <TabsContent value="devops" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <GitBranch className="h-5 w-5 mr-2 text-red-600" />
                    Oracle DevOps & CI/CD Platform
                  </CardTitle>
                  <CardDescription>
                    Enterprise-grade DevOps with Oracle Integration Cloud and autonomous deployment capabilities
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* CI/CD Pipeline */}
                  <div className="border border-red-200 dark:border-red-800 rounded-lg p-6 bg-gradient-to-r from-red-50/50 to-orange-50/50 dark:from-red-950/10 dark:to-orange-950/10">
                    <h4 className="text-lg font-semibold mb-4 text-red-900 dark:text-red-100 flex items-center">
                      <GitBranch className="h-4 w-4 mr-2" />
                      Oracle DevOps Service
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded border">
                          <span className="font-medium">Build Automation</span>
                          <Badge variant="outline">CI</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded border">
                          <span className="font-medium">Deployment Pipelines</span>
                          <Badge variant="outline">CD</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded border">
                          <span className="font-medium">Code Repository</span>
                          <Badge variant="outline">Git</Badge>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h5 className="font-medium text-slate-900 dark:text-white">DevOps Features:</h5>
                        <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                          <li>• Automated testing and validation</li>
                          <li>• Blue-green deployments</li>
                          <li>• Infrastructure as Code</li>
                          <li>• Automated rollback capabilities</li>
                          <li>• Enterprise security scanning</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Monitoring & Observability */}
                  <div className="border border-orange-200 dark:border-orange-800 rounded-lg p-6 bg-gradient-to-r from-orange-50/50 to-amber-50/50 dark:from-orange-950/10 dark:to-amber-950/10">
                    <h4 className="text-lg font-semibold mb-4 text-orange-900 dark:text-orange-100 flex items-center">
                      <Monitor className="h-4 w-4 mr-2" />
                      Monitoring & Observability Stack
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <div className="p-3 bg-white dark:bg-slate-800 rounded border">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">OCI Monitoring</span>
                          <Badge variant="secondary">Metrics</Badge>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Real-time metrics and alerting</p>
                      </div>
                      <div className="p-3 bg-white dark:bg-slate-800 rounded border">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Logging Analytics</span>
                          <Badge variant="secondary">Logs</Badge>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Centralized log aggregation and analysis</p>
                      </div>
                      <div className="p-3 bg-white dark:bg-slate-800 rounded border">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">APM & Tracing</span>
                          <Badge variant="secondary">Traces</Badge>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Application performance monitoring</p>
                      </div>
                    </div>
                  </div>

                  {/* ARKHITEKTON DevOps Integration */}
                  <div className="border border-green-200 dark:border-green-800 rounded-lg p-6 bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-950/10 dark:to-emerald-950/10">
                    <h4 className="text-lg font-semibold mb-4 text-green-900 dark:text-green-100 flex items-center">
                      <Code className="h-4 w-4 mr-2" />
                      ARKHITEKTON DevOps Workflows
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded">
                          <div>
                            <div className="font-medium">Architecture-as-Code</div>
                            <div className="text-sm text-slate-600 dark:text-slate-300">Version-controlled architecture definitions</div>
                          </div>
                          <GitBranch className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded">
                          <div>
                            <div className="font-medium">Automated Deployment</div>
                            <div className="text-sm text-slate-600 dark:text-slate-300">Container and function deployment</div>
                          </div>
                          <Zap className="h-5 w-5 text-green-600" />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded">
                          <div>
                            <div className="font-medium">Quality Gates</div>
                            <div className="text-sm text-slate-600 dark:text-slate-300">Architecture compliance validation</div>
                          </div>
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded">
                          <div>
                            <div className="font-medium">Performance Testing</div>
                            <div className="text-sm text-slate-600 dark:text-slate-300">Automated performance validation</div>
                          </div>
                          <Activity className="h-5 w-5 text-green-600" />
                        </div>
                      </div>
                    </div>
                  </div>

                </CardContent>
              </Card>
            </TabsContent>

            {/* Cost Model */}
            <TabsContent value="costs" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <DollarSign className="h-5 w-5 mr-2 text-red-600 dark:text-red-400" />
                      Oracle Cloud Pricing Model
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950/20 rounded">
                        <div>
                          <div className="font-medium">Universal Credits</div>
                          <div className="text-sm text-slate-600 dark:text-slate-300">Pay-as-you-consume with predictable pricing</div>
                        </div>
                        <DollarSign className="h-5 w-5 text-red-600" />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950/20 rounded">
                        <div>
                          <div className="font-medium">Bring Your Own License</div>
                          <div className="text-sm text-slate-600 dark:text-slate-300">Up to 50% savings on existing Oracle licenses</div>
                        </div>
                        <Badge variant="secondary">BYOL</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950/20 rounded">
                        <div>
                          <div className="font-medium">Always Free Tier</div>
                          <div className="text-sm text-slate-600 dark:text-slate-300">Autonomous Database and compute included</div>
                        </div>
                        <Badge variant="secondary">Free</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2 text-red-600 dark:text-red-400" />
                      ARKHITEKTON Cost Optimization
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950/20 rounded">
                      <div>
                        <div className="font-medium">Autonomous Database Savings</div>
                        <div className="text-sm text-slate-600 dark:text-slate-300">Self-managing reduces admin costs by 80%</div>
                      </div>
                      <TrendingUp className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950/20 rounded">
                      <div>
                        <div className="font-medium">Resource Optimization</div>
                        <div className="text-sm text-slate-600 dark:text-slate-300">Auto-scaling prevents over-provisioning</div>
                      </div>
                      <TrendingUp className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950/20 rounded">
                      <div>
                        <div className="font-medium">Enterprise Integration</div>
                        <div className="text-sm text-slate-600 dark:text-slate-300">Native Oracle Fusion reduces licensing costs</div>
                      </div>
                      <Settings className="h-5 w-5 text-green-500" />
                    </div>
                  </CardContent>
                </Card>

              </div>

              {/* Enterprise Support */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-red-600 dark:text-red-400" />
                    Enterprise Support & Services
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 border border-red-200 dark:border-red-800 rounded-lg">
                      <Clock className="h-8 w-8 text-red-600 dark:text-red-400 mx-auto mb-3" />
                      <h4 className="font-medium mb-2">24/7 Support</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300">Premier Support with Enterprise Architect</p>
                    </div>
                    <div className="text-center p-4 border border-red-200 dark:border-red-800 rounded-lg">
                      <Users className="h-8 w-8 text-red-600 dark:text-red-400 mx-auto mb-3" />
                      <h4 className="font-medium mb-2">Professional Services</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300">Oracle Consulting for implementation</p>
                    </div>
                    <div className="text-center p-4 border border-red-200 dark:border-red-800 rounded-lg">
                      <Monitor className="h-8 w-8 text-red-600 dark:text-red-400 mx-auto mb-3" />
                      <h4 className="font-medium mb-2">Health Checks</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300">Regular architecture reviews and optimization</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

            </TabsContent>
            
            <TabsContent value="migration" className="space-y-6">
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <GitBranch className="h-5 w-5 mr-2 text-red-600 dark:text-red-400" />
                    Enterprise Migration Strategy
                  </CardTitle>
                  <CardDescription>
                    Comprehensive approach for migrating ARKHITEKTON to Oracle Cloud Infrastructure
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    
                    {/* Migration Phases */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                        <div className="flex items-center mb-3">
                          <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">1</div>
                          <h4 className="font-medium">Assessment</h4>
                        </div>
                        <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                          <li>• Current Oracle license inventory</li>
                          <li>• Application dependency mapping</li>
                          <li>• Performance baseline</li>
                          <li>• Security requirements review</li>
                        </ul>
                      </div>
                      
                      <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                        <div className="flex items-center mb-3">
                          <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">2</div>
                          <h4 className="font-medium">Pilot Migration</h4>
                        </div>
                        <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                          <li>• Non-production environment setup</li>
                          <li>• Database migration testing</li>
                          <li>• Application compatibility validation</li>
                          <li>• Performance optimization</li>
                        </ul>
                      </div>
                      
                      <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                        <div className="flex items-center mb-3">
                          <div className="w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">3</div>
                          <h4 className="font-medium">Production Rollout</h4>
                        </div>
                        <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                          <li>• Phased production migration</li>
                          <li>• Zero-downtime database switch</li>
                          <li>• User acceptance testing</li>
                          <li>• Go-live support</li>
                        </ul>
                      </div>
                    </div>

                    {/* Migration Tools */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-medium text-slate-900 dark:text-white">Migration Tools & Services</h4>
                        <div className="space-y-3">
                          <div className="flex items-start space-x-3">
                            <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                            <div>
                              <div className="font-medium">Oracle Cloud Migrations</div>
                              <div className="text-sm text-slate-600 dark:text-slate-300">Automated database and application migration</div>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3">
                            <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                            <div>
                              <div className="font-medium">Data Transfer Service</div>
                              <div className="text-sm text-slate-600 dark:text-slate-300">Secure, high-speed data transfer appliances</div>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3">
                            <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                            <div>
                              <div className="font-medium">Application Express Migration</div>
                              <div className="text-sm text-slate-600 dark:text-slate-300">APEX application modernization</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="font-medium text-slate-900 dark:text-white">Risk Mitigation</h4>
                        <div className="space-y-3">
                          <div className="flex items-start space-x-3">
                            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                            <div>
                              <div className="font-medium">Rollback Strategy</div>
                              <div className="text-sm text-slate-600 dark:text-slate-300">Complete rollback plan for each phase</div>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3">
                            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                            <div>
                              <div className="font-medium">Performance Monitoring</div>
                              <div className="text-sm text-slate-600 dark:text-slate-300">Real-time migration progress tracking</div>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3">
                            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                            <div>
                              <div className="font-medium">Business Continuity</div>
                              <div className="text-sm text-slate-600 dark:text-slate-300">Minimal disruption to operations</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </CardContent>
              </Card>

            </TabsContent>
          </Tabs>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
            <Link href="/arkhitekton-architecture">
              <Button variant="outline" className="flex items-center">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Overview
              </Button>
            </Link>
            
            <div className="flex space-x-4">
              <Link href="/arkhitekton-architecture/aws">
                <Button variant="ghost" size="sm">AWS Architecture</Button>
              </Link>
              <Link href="/arkhitekton-architecture/azure">
                <Button variant="ghost" size="sm">Azure Architecture</Button>
              </Link>
              <Link href="/arkhitekton-architecture/gcp">
                <Button variant="ghost" size="sm">GCP Architecture</Button>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </AppLayout>
  );
}