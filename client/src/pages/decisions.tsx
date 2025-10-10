import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter,
  Calendar,
  User,
  GitBranch,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Target,
  Code,
  Database,
  Shield,
  Zap
} from 'lucide-react';
import { AppLayout } from '@/components/layout/app-layout';
import { GovernanceHeader } from '@/components/layout/governance-header';

interface DecisionRecord {
  id: string;
  title: string;
  status: 'Proposed' | 'Accepted' | 'Rejected' | 'Superseded' | 'Under Review';
  impact: 'Low' | 'Medium' | 'High' | 'Critical';
  technicalDebt: 'None' | 'Low' | 'Medium' | 'High';
  category: 'Strategic' | 'Technical' | 'Security' | 'Data' | 'Infrastructure';
  architect: string;
  decidedDate: string;
  context: string;
  decision: string;
  consequences: string[];
  alternatives: string[];
  linkedModels: string[];
  debtScore: number;
  tags: string[];
}

function DecisionsContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedView, setSelectedView] = useState<'list' | 'timeline' | 'matrix'>('list');

  // Mock ADR data - would come from backend
  const decisions: DecisionRecord[] = [
    // ARKHITEKTON Design Decision Records (ARKDD)
    {
      id: 'ARKDD-00001',
      title: 'Visual Identity: Mixed Geometric Cascade',
      status: 'Under Review',
      impact: 'Medium',
      technicalDebt: 'Low',
      category: 'Strategic',
      architect: 'ARKHITEKTON Team',
      decidedDate: '2025-09-02',
      context: 'ARKHITEKTON requires a distinctive visual identity that conveys architectural mastery, system thinking, and professional credibility to differentiate from traditional EA tools.',
      decision: 'Adopt diverse architectural shapes (hexagon, circle, triangle, square) flowing from complex to simple, representing systematic thinking and architectural diversity.',
      consequences: [
        'Clear visual representation of architectural variety and methodology',
        'Professional appearance suitable for enterprise environments',
        'Demonstrates systematic approach to complexity management',
        'May appear visually busy in some contexts',
        'Complex reproduction requirements at smaller sizes'
      ],
      alternatives: [
        'Single geometric shape with variations',
        'Text-based logo approach', 
        'Minimalist abstract symbol'
      ],
      linkedModels: ['arkhitekton-brand-architecture'],
      debtScore: 20,
      tags: ['visual-identity', 'brand', 'design-system']
    },
    {
      id: 'ARKDD-00002',
      title: 'Visual Identity: Architectural Building Blocks',
      status: 'Under Review',
      impact: 'Medium',
      technicalDebt: 'Medium',
      category: 'Strategic',
      architect: 'ARKHITEKTON Team',
      decidedDate: '2025-09-02',
      context: 'Need visual identity that emphasizes the journey from 3D architectural thinking to 2D documentation and planning.',
      decision: 'Use 3D geometric forms (cube, cone, cylinder, pyramid) transforming into 2D shapes and dots to represent architecture-to-documentation workflow.',
      consequences: [
        'Strong 3D architectural feel connects to building/construction metaphors',
        'Clear transformation story from concept to implementation',
        'Unique depth and dimensionality in logo design',
        'Implementation complexity for web and print reproduction',
        'Potential scaling challenges for small format usage'
      ],
      alternatives: [
        'Flat 2D geometric approach',
        'Isometric architectural elements',
        'Blueprint-style line drawings'
      ],
      linkedModels: ['arkhitekton-brand-architecture'],
      debtScore: 45,
      tags: ['visual-identity', 'brand', 'architecture', '3d-design']
    },
    {
      id: 'ARKDD-00003',
      title: 'Visual Identity: Dynamic Shape Flow',
      status: 'Under Review',
      impact: 'High',
      technicalDebt: 'Low',
      category: 'Strategic',
      architect: 'ARKHITEKTON Team',
      decidedDate: '2025-09-02',
      context: 'Visual identity should embody the core ARKHITEKTON philosophy of organizing complexity into elegant simplicity.',
      decision: 'Implement overlapping organic shapes (circles, triangles, hexagons) that progressively abstract into dots, emphasizing master builder transformation of complexity.',
      consequences: [
        'Organic, flowing aesthetic appeals to modern design sensibilities',
        'Excellent scalability across different media and sizes',
        'Clean abstraction supports versatile brand applications',
        'May appear less architectural/building-focused than alternatives',
        'Risk of being too abstract for immediate recognition'
      ],
      alternatives: [
        'Rigid geometric progression',
        'Building-specific iconography',
        'Tool-based architectural symbols'
      ],
      linkedModels: ['arkhitekton-brand-architecture'],
      debtScore: 15,
      tags: ['visual-identity', 'brand', 'organic-design', 'scalability']
    },
    {
      id: 'ARKDD-00004',
      title: 'Visual Identity: Orange Icon with Creative Flame',
      status: 'Under Review',
      impact: 'High',
      technicalDebt: 'Low',
      category: 'Strategic',
      architect: 'ARKHITEKTON Team',
      decidedDate: '2025-09-02',
      context: 'Brand identity needs to convey both professional architectural expertise and the creative spark that drives innovation in system design.',
      decision: 'Clean orange rounded square with diamond center and flame element positioned to represent the creative spark of master builders.',
      consequences: [
        'Clean, professional appearance suitable for enterprise contexts',
        'Flame element adds energy and creativity to static geometric form',
        'Excellent scalability and reproduction across media',
        'Strong alignment with ARKHITEKTON orange theme and brand colors',
        'Unique identity that differentiates from generic architectural symbols',
        'Flame details may lose clarity at very small sizes'
      ],
      alternatives: [
        'Geometric forms without flame element',
        'Different creative symbols (lightbulb, spark, etc.)',
        'Tool-based architectural imagery'
      ],
      linkedModels: ['arkhitekton-brand-architecture', 'arkhitekton-design-system'],
      debtScore: 10,
      tags: ['visual-identity', 'brand', 'creativity', 'professional', 'scalable']
    },
    {
      id: 'ARKDD-00005',
      title: 'Visual Identity: Traditional Architect with Drafting Easel',
      status: 'Under Review',
      impact: 'High',
      technicalDebt: 'Medium',
      category: 'Strategic',
      architect: 'ARKHITEKTON Team',
      decidedDate: '2025-09-02',
      context: 'ARKHITEKTON name derives from ancient Greek for "master builder" - visual identity should honor this heritage while appealing to modern enterprise architects.',
      decision: 'Classic professional architect at drafting easel with blueprints, representing traditional master builder concept with human element of architectural design.',
      consequences: [
        'Instantly recognizable architectural profession imagery',
        'Human-centered design approach resonates with practitioners',
        'Strong professional credibility and trustworthiness',
        'Powerful storytelling element connects to ARKHITEKTON heritage',
        'Clear connection to architectural and design thinking processes',
        'Higher complexity may challenge reproduction at small sizes',
        'May appear traditional rather than modern/digital-first',
        'Detailed elements require careful implementation across media'
      ],
      alternatives: [
        'Modern digital designer at computer',
        'Abstract architectural tools',
        'Simplified geometric architect representation'
      ],
      linkedModels: ['arkhitekton-brand-architecture', 'arkhitekton-heritage-story'],
      debtScore: 35,
      tags: ['visual-identity', 'brand', 'traditional', 'human-centered', 'heritage']
    },
    {
      id: 'ARKDD-00006',
      title: 'UI Font Size and Spacing Customization System',
      status: 'Under Review',
      impact: 'Medium',
      technicalDebt: 'Low',
      category: 'Technical',
      architect: 'ARKHITEKTON Team',
      decidedDate: '2025-09-02',
      context: 'Enterprise architects require maximum screen real estate to view complex models and data. Current UI uses standard font sizes that limit information density and require excessive scrolling.',
      decision: 'Implement ultra-compact default UI with 12px base font size, reduced spacing, and user-customizable font size settings in application preferences.',
      consequences: [
        'Maximizes screen real estate for architecture modeling and complex data views',
        'Reduces scrolling requirements across all application pages',
        'Icons-only navigation sidebar (48px width) provides more space for content',
        'User preferences allow customization for accessibility needs',
        'May require user adjustment period for smaller default text',
        'Ensures consistency with enterprise tool expectations'
      ],
      alternatives: [
        'Keep standard font sizes with responsive scaling',
        'Adaptive font sizing based on screen resolution',
        'Multiple preset size themes (compact, standard, large)'
      ],
      linkedModels: ['arkhitekton-design-system', 'user-experience-architecture'],
      debtScore: 15,
      tags: ['ui-design', 'accessibility', 'user-experience', 'font-sizing', 'customization']
    },
    {
      id: 'ADR-001',
      title: 'Adopt Microservices Architecture for Customer Platform',
      status: 'Accepted',
      impact: 'High',
      technicalDebt: 'Medium',
      category: 'Strategic',
      architect: 'Sarah Chen',
      decidedDate: '2024-08-29',
      context: 'Current monolithic architecture is limiting development velocity and scalability for our growing customer base.',
      decision: 'Migrate to microservices architecture using containerized services with API gateway pattern.',
      consequences: [
        'Improved development velocity through independent service deployment',
        'Better scalability and fault isolation',
        'Increased operational complexity',
        'Technical debt in service communication patterns'
      ],
      alternatives: [
        'Modular monolith approach',
        'Service-oriented architecture (SOA)',
        'Serverless functions architecture'
      ],
      linkedModels: ['customer-platform-model', 'api-gateway-design'],
      debtScore: 65,
      tags: ['microservices', 'scalability', 'modernization']
    },
    {
      id: 'ADR-002',
      title: 'Implement Zero Trust Security Model',
      status: 'Under Review',
      impact: 'Critical',
      technicalDebt: 'Low',
      category: 'Security',
      architect: 'Michael Torres',
      decidedDate: '2024-08-28',
      context: 'Increasing security threats and remote work requirements necessitate enhanced security architecture.',
      decision: 'Implement comprehensive zero trust architecture with identity-based access controls.',
      consequences: [
        'Enhanced security posture across all systems',
        'Reduced risk of lateral movement in breaches',
        'Improved compliance with regulatory requirements',
        'Initial implementation complexity and user training'
      ],
      alternatives: [
        'Enhanced perimeter security approach',
        'Identity federation with existing systems',
        'Hybrid trust model implementation'
      ],
      linkedModels: ['security-architecture', 'identity-management'],
      debtScore: 25,
      tags: ['security', 'zero-trust', 'compliance']
    },
    {
      id: 'ADR-003',
      title: 'Consolidate Data Analytics Platforms',
      status: 'Accepted',
      impact: 'High',
      technicalDebt: 'High',
      category: 'Data',
      architect: 'Elena Rodriguez',
      decidedDate: '2024-08-27',
      context: 'Multiple analytics platforms creating data silos and increasing operational overhead.',
      decision: 'Migrate to unified data lakehouse architecture with standardized analytics tools.',
      consequences: [
        'Unified data access and analytics capabilities',
        'Reduced licensing and operational costs',
        'Significant migration effort and technical debt',
        'Temporary disruption to existing analytics workflows'
      ],
      alternatives: [
        'Data federation approach',
        'Incremental platform consolidation',
        'Cloud-native analytics migration'
      ],
      linkedModels: ['data-architecture', 'analytics-platform'],
      debtScore: 85,
      tags: ['data', 'analytics', 'consolidation']
    },
    {
      id: 'ADR-004',
      title: 'API-First Development Strategy',
      status: 'Proposed',
      impact: 'Medium',
      technicalDebt: 'Low',
      category: 'Technical',
      architect: 'David Kim',
      decidedDate: '2024-08-26',
      context: 'Need for better integration capabilities and developer experience across teams.',
      decision: 'Adopt API-first development approach with OpenAPI specifications and contract testing.',
      consequences: [
        'Improved developer productivity and system integration',
        'Better API documentation and governance',
        'Learning curve for development teams',
        'Initial tooling and process setup overhead'
      ],
      alternatives: [
        'Code-first API development',
        'GraphQL federation approach',
        'Event-driven integration pattern'
      ],
      linkedModels: ['api-architecture', 'integration-patterns'],
      debtScore: 20,
      tags: ['api', 'development', 'integration']
    }
  ];

  const filteredDecisions = decisions.filter(decision => {
    const matchesSearch = searchQuery === '' || 
      decision.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      decision.context.toLowerCase().includes(searchQuery.toLowerCase()) ||
      decision.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = selectedStatus === 'all' || decision.status === selectedStatus;
    const matchesCategory = selectedCategory === 'all' || decision.category === selectedCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Accepted': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'Rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'Under Review': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300';
      case 'Proposed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'Superseded': return 'bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-300';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-300';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'Critical': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'High': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      case 'Medium': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300';
      case 'Low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-300';
    }
  };

  const getDebtColor = (debt: string) => {
    switch (debt) {
      case 'High': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'Medium': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300';
      case 'Low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'None': return 'bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-300';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-300';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Strategic': return Target;
      case 'Technical': return Code;
      case 'Security': return Shield;
      case 'Data': return Database;
      case 'Infrastructure': return Zap;
      default: return FileText;
    }
  };

  const overallStats = {
    totalDecisions: decisions.length,
    acceptedDecisions: decisions.filter(d => d.status === 'Accepted').length,
    pendingDecisions: decisions.filter(d => d.status === 'Under Review' || d.status === 'Proposed').length,
    averageDebtScore: Math.round(decisions.reduce((sum, d) => sum + d.debtScore, 0) / decisions.length),
    highImpactDecisions: decisions.filter(d => d.impact === 'High' || d.impact === 'Critical').length
  };

  return (
    <div className="h-full overflow-hidden flex flex-col">
      <GovernanceHeader 
        moduleTitle="Architecture Decision Records" 
        moduleIcon={FileText} 
      />
      
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Total ADRs</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{overallStats.totalDecisions}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Accepted</p>
                  <p className="text-2xl font-bold text-green-600">{overallStats.acceptedDecisions}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Pending</p>
                  <p className="text-2xl font-bold text-amber-600">{overallStats.pendingDecisions}</p>
                </div>
                <Clock className="h-8 w-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Avg Debt Score</p>
                  <p className="text-2xl font-bold text-red-600">{overallStats.averageDebtScore}%</p>
                </div>
                <GitBranch className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">High Impact</p>
                  <p className="text-2xl font-bold text-purple-600">{overallStats.highImpactDecisions}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search decisions by title, context, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50"
              data-testid="input-search-decisions"
            />
          </div>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-48 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Proposed">Proposed</SelectItem>
              <SelectItem value="Under Review">Under Review</SelectItem>
              <SelectItem value="Accepted">Accepted</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
              <SelectItem value="Superseded">Superseded</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Strategic">Strategic</SelectItem>
              <SelectItem value="Technical">Technical</SelectItem>
              <SelectItem value="Security">Security</SelectItem>
              <SelectItem value="Data">Data</SelectItem>
              <SelectItem value="Infrastructure">Infrastructure</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* ADR List */}
        <div className="space-y-6">
          {filteredDecisions.map((decision) => {
            const CategoryIcon = getCategoryIcon(decision.category);
            return (
              <Card key={decision.id} className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-lg flex items-center justify-center">
                        <CategoryIcon className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white truncate">
                            {decision.title}
                          </h3>
                          <Badge className={getStatusColor(decision.status)}>{decision.status}</Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-300">
                          <span className="flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            {decision.architect}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {decision.decidedDate}
                          </span>
                          <span className="font-medium text-slate-900 dark:text-white">{decision.id}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Badge className={getImpactColor(decision.impact)} variant="outline">
                        Impact: {decision.impact}
                      </Badge>
                      <Badge className={getDebtColor(decision.technicalDebt)} variant="outline">
                        Debt: {decision.technicalDebt}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-white mb-2">Context</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300">{decision.context}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-white mb-2">Decision</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300">{decision.decision}</p>
                    </div>

                    {decision.consequences.length > 0 && (
                      <div>
                        <h4 className="font-medium text-slate-900 dark:text-white mb-2">Key Consequences</h4>
                        <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                          {decision.consequences.slice(0, 2).map((consequence, index) => (
                            <li key={index} className="flex items-start">
                              <span className="w-1 h-1 bg-emerald-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                              {consequence}
                            </li>
                          ))}
                          {decision.consequences.length > 2 && (
                            <li className="text-emerald-600 font-medium">+{decision.consequences.length - 2} more</li>
                          )}
                        </ul>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-slate-600 dark:text-slate-300">Technical Debt Score:</span>
                          <div className="w-20">
                            <Progress value={decision.debtScore} className="h-2" />
                          </div>
                          <span className="text-sm font-medium text-slate-900 dark:text-white">{decision.debtScore}%</span>
                        </div>
                        {decision.linkedModels.length > 0 && (
                          <div className="flex items-center space-x-1">
                            <GitBranch className="h-3 w-3 text-slate-400" />
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              {decision.linkedModels.length} linked models
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        {decision.tags.map((tag, index) => (
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

        {filteredDecisions.length === 0 && (
          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No decisions found</h3>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                No architecture decision records match your current filters.
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

export function DecisionsPage() {
  return (
    <AppLayout>
      <DecisionsContent />
    </AppLayout>
  );
}

export default DecisionsPage;