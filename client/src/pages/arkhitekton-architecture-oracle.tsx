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
          <Tabs defaultValue="architecture" className="space-y-8">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="architecture">Architecture Layers</TabsTrigger>
              <TabsTrigger value="operations">Operations</TabsTrigger>
              <TabsTrigger value="governance">Governance</TabsTrigger>
              <TabsTrigger value="migration">Migration</TabsTrigger>
            </TabsList>
            
            <TabsContent value="architecture" className="space-y-8">
              
              {/* Architecture Diagram */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Layers className="h-5 w-5 mr-2 text-red-600 dark:text-red-400" />
                    Oracle Cloud Enterprise Architecture
                  </CardTitle>
                  <CardDescription>
                    Autonomous database-driven architecture with enterprise application integration
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    
                    {/* Presentation Layer */}
                    <div className="p-6 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 rounded-lg border border-red-200 dark:border-red-800">
                      <h4 className="font-semibold mb-4 text-red-800 dark:text-red-200 flex items-center">
                        <Globe className="h-4 w-4 mr-2" />
                        Presentation Layer
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white dark:bg-slate-900 p-4 rounded border">
                          <div className="font-medium text-sm mb-2">Web Application</div>
                          <div className="text-xs text-slate-600 dark:text-slate-300">React + OCI CDN</div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-4 rounded border">
                          <div className="font-medium text-sm mb-2">Mobile Apps</div>
                          <div className="text-xs text-slate-600 dark:text-slate-300">Native + API Gateway</div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-4 rounded border">
                          <div className="font-medium text-sm mb-2">Enterprise Portal</div>
                          <div className="text-xs text-slate-600 dark:text-slate-300">Oracle APEX</div>
                        </div>
                      </div>
                    </div>

                    {/* Application Layer */}
                    <div className="p-6 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                      <h4 className="font-semibold mb-4 text-orange-800 dark:text-orange-200 flex items-center">
                        <Code className="h-4 w-4 mr-2" />
                        Application & Business Logic
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white dark:bg-slate-900 p-4 rounded border">
                          <div className="font-medium text-sm mb-2">API Services</div>
                          <div className="text-xs text-slate-600 dark:text-slate-300">Container Engine + Functions</div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-4 rounded border">
                          <div className="font-medium text-sm mb-2">Business Apps</div>
                          <div className="text-xs text-slate-600 dark:text-slate-300">Oracle Fusion Cloud</div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-4 rounded border">
                          <div className="font-medium text-sm mb-2">Integration</div>
                          <div className="text-xs text-slate-600 dark:text-slate-300">OIC + SOA Suite</div>
                        </div>
                      </div>
                    </div>

                    {/* Data Layer */}
                    <div className="p-6 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                      <h4 className="font-semibold mb-4 text-amber-800 dark:text-amber-200 flex items-center">
                        <Database className="h-4 w-4 mr-2" />
                        Autonomous Data Platform
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white dark:bg-slate-900 p-4 rounded border">
                          <div className="font-medium text-sm mb-2">Autonomous Database</div>
                          <div className="text-xs text-slate-600 dark:text-slate-300">Self-managing, Self-securing</div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-4 rounded border">
                          <div className="font-medium text-sm mb-2">Analytics</div>
                          <div className="text-xs text-slate-600 dark:text-slate-300">Oracle Analytics Cloud</div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-4 rounded border">
                          <div className="font-medium text-sm mb-2">Data Lake</div>
                          <div className="text-xs text-slate-600 dark:text-slate-300">Object Storage + Big Data</div>
                        </div>
                      </div>
                    </div>

                    {/* Infrastructure Layer */}
                    <div className="p-6 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-950/20 dark:to-slate-950/20 rounded-lg border border-gray-200 dark:border-gray-800">
                      <h4 className="font-semibold mb-4 text-gray-800 dark:text-gray-200 flex items-center">
                        <Server className="h-4 w-4 mr-2" />
                        High-Performance Infrastructure
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white dark:bg-slate-900 p-4 rounded border">
                          <div className="font-medium text-sm mb-2">Compute</div>
                          <div className="text-xs text-slate-600 dark:text-slate-300">Bare Metal + VM Instances</div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-4 rounded border">
                          <div className="font-medium text-sm mb-2">Networking</div>
                          <div className="text-xs text-slate-600 dark:text-slate-300">VCN + FastConnect</div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-4 rounded border">
                          <div className="font-medium text-sm mb-2">Storage</div>
                          <div className="text-xs text-slate-600 dark:text-slate-300">Block + Object + Archive</div>
                        </div>
                      </div>
                    </div>

                  </div>
                </CardContent>
              </Card>

              {/* Data Flow Architecture */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <GitBranch className="h-5 w-5 mr-2 text-red-600 dark:text-red-400" />
                    Enterprise Data Flow Architecture
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      
                      <div className="text-center">
                        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Users className="h-8 w-8 text-red-600 dark:text-red-400" />
                        </div>
                        <h4 className="font-medium mb-2">User Interface</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-300">APEX + React Components</p>
                      </div>
                      
                      <div className="text-center">
                        <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Network className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                        </div>
                        <h4 className="font-medium mb-2">API Gateway</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-300">Request routing & security</p>
                      </div>
                      
                      <div className="text-center">
                        <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Cpu className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                        </div>
                        <h4 className="font-medium mb-2">Business Logic</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-300">Container services</p>
                      </div>
                      
                      <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Database className="h-8 w-8 text-green-600 dark:text-green-400" />
                        </div>
                        <h4 className="font-medium mb-2">Autonomous DB</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-300">Self-managing data tier</p>
                      </div>
                      
                    </div>
                  </div>
                </CardContent>
              </Card>

            </TabsContent>
            
            <TabsContent value="operations" className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Security & Compliance */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Shield className="h-5 w-5 mr-2 text-red-600 dark:text-red-400" />
                      Enterprise Security
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <div className="font-medium">Identity & Access Management</div>
                        <div className="text-sm text-slate-600 dark:text-slate-300">Oracle IDCS with federated authentication</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <div className="font-medium">Data Encryption</div>
                        <div className="text-sm text-slate-600 dark:text-slate-300">Transparent Data Encryption (TDE) + Cloud Guard</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <div className="font-medium">Database Security</div>
                        <div className="text-sm text-slate-600 dark:text-slate-300">Database Vault + Data Safe monitoring</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <div className="font-medium">Compliance</div>
                        <div className="text-sm text-slate-600 dark:text-slate-300">SOC 2, ISO 27001, PCI DSS certified</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Monitoring & Operations */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Monitor className="h-5 w-5 mr-2 text-red-600 dark:text-red-400" />
                      Autonomous Operations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Activity className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <div className="font-medium">Application Performance Monitoring</div>
                        <div className="text-sm text-slate-600 dark:text-slate-300">OCI Monitoring + Logging Analytics</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Activity className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <div className="font-medium">Database Self-Management</div>
                        <div className="text-sm text-slate-600 dark:text-slate-300">Autonomous tuning, patching, and scaling</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Activity className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <div className="font-medium">Predictive Analytics</div>
                        <div className="text-sm text-slate-600 dark:text-slate-300">ML-driven capacity planning</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Activity className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <div className="font-medium">Disaster Recovery</div>
                        <div className="text-sm text-slate-600 dark:text-slate-300">Autonomous Data Guard + automated failover</div>
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
            
            <TabsContent value="governance" className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Lock className="h-5 w-5 mr-2 text-red-600 dark:text-red-400" />
                      Enterprise Compliance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded border border-green-200 dark:border-green-800">
                        <div className="font-medium text-green-800 dark:text-green-200">SOC 2 Type II</div>
                        <div className="text-xs text-green-600 dark:text-green-400">Certified</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded border border-green-200 dark:border-green-800">
                        <div className="font-medium text-green-800 dark:text-green-200">ISO 27001</div>
                        <div className="text-xs text-green-600 dark:text-green-400">Certified</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded border border-green-200 dark:border-green-800">
                        <div className="font-medium text-green-800 dark:text-green-200">PCI DSS</div>
                        <div className="text-xs text-green-600 dark:text-green-400">Level 1</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded border border-green-200 dark:border-green-800">
                        <div className="font-medium text-green-800 dark:text-green-200">HIPAA</div>
                        <div className="text-xs text-green-600 dark:text-green-400">Compliant</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Settings className="h-5 w-5 mr-2 text-red-600 dark:text-red-400" />
                      Cost Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950/20 rounded">
                      <div>
                        <div className="font-medium">License Optimization</div>
                        <div className="text-sm text-slate-600 dark:text-slate-300">BYOL savings up to 50%</div>
                      </div>
                      <DollarSign className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950/20 rounded">
                      <div>
                        <div className="font-medium">Resource Efficiency</div>
                        <div className="text-sm text-slate-600 dark:text-slate-300">Autonomous scaling reduces waste</div>
                      </div>
                      <TrendingUp className="h-5 w-5 text-green-500" />
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