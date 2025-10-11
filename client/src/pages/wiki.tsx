import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BookOpen, 
  Plus, 
  Search, 
  FileText,
  Folder,
  Star,
  Clock,
  Users,
  Calendar,
  Edit,
  Eye,
  Tag,
  GitBranch,
  Building,
  Shield,
  Target,
  Database,
  Code,
  Zap,
  BookOpenCheck,
  Compass,
  Link2
} from 'lucide-react';
import { AppLayout } from '@/components/layout/app-layout';
import { GovernanceHeader } from '@/components/layout/governance-header';
import { TreeNavigation } from '@/components/knowledge-base/TreeNavigation';
import { KnowledgeBasePage } from '@/components/knowledge-base/KnowledgeBasePage';
import { PageEditor } from '@/components/knowledge-base/PageEditor';
import type { KnowledgeBasePage as KBPage } from '@shared/schema';

interface WikiPage {
  id: string;
  title: string;
  content: string;
  category: 'Governance' | 'Standards' | 'Procedures' | 'Templates' | 'Best Practices' | 'Architecture Patterns';
  subcategory: string;
  author: string;
  lastModified: string;
  lastEditor: string;
  views: number;
  likes: number;
  status: 'Draft' | 'Published' | 'Under Review' | 'Archived';
  tags: string[];
  relatedPages: string[];
  linkedDecisions: string[];
  linkedCapabilities: string[];
  attachments: string[];
  version: string;
  contributors: string[];
}

function WikiContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');
  const [selectedPageId, setSelectedPageId] = useState<string | undefined>();
  const [showTreeView, setShowTreeView] = useState(false);
  const [showPageEditor, setShowPageEditor] = useState(false);
  const [isCreatingNewPage, setIsCreatingNewPage] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const handlePageSelect = (page: KBPage) => {
    setSelectedPageId(page.id);
    setShowTreeView(true);
  };

  const handleBackToOverview = () => {
    setSelectedPageId(undefined);
    setShowTreeView(false);
  };

  // Implementation documentation tracking what we've built
  const implementationDocs: WikiPage[] = [
    {
      id: 'IMPL-001',
      title: 'ARKHITEKTON Foundation Architecture',
      content: `
## Overview
Established the foundational architecture for ARKHITEKTON using modern React/TypeScript stack with emphasis on performance, maintainability, and user experience.

## Implementation Details
- **Frontend**: React 18 with TypeScript for type safety and modern development practices
- **Build System**: Vite for fast development and optimized production builds
- **UI Framework**: shadcn/ui + Radix UI primitives for accessible, customizable components
- **Styling**: Tailwind CSS with custom design tokens and warm orange architectural theme
- **State Management**: TanStack Query for server state, React hooks for local state
- **Routing**: Wouter for lightweight client-side routing

## Key Achievements
- Sub-second hot reload development experience
- Type-safe data layer with shared schema definitions
- Responsive design system that scales from mobile to desktop
- Consistent design language with sophisticated orange palette

## Impact
This foundation enables rapid feature development while maintaining code quality and user experience standards that exceed traditional enterprise software.
      `,
      category: 'Architecture Patterns',
      subcategory: 'Foundation',
      author: 'ARKHITEKTON Team',
      lastModified: '2025-09-02',
      lastEditor: 'Development Team',
      views: 1,
      likes: 0,
      status: 'Published',
      tags: ['react', 'typescript', 'foundation', 'architecture'],
      relatedPages: [],
      linkedDecisions: [],
      linkedCapabilities: [],
      attachments: [],
      version: '1.0',
      contributors: ['Development Team']
    },
    {
      id: 'IMPL-002',
      title: 'Orange Theme System Implementation',
      content: `
## Overview
Implemented a sophisticated warm orange color palette throughout ARKHITEKTON to differentiate from generic green EA tools and evoke architectural heritage.

## Design Philosophy
The orange theme represents:
- **Warmth & Creativity**: Inspiring architects to innovate
- **Architectural Heritage**: Connecting to traditional building materials (brick, wood, stone)
- **Differentiation**: Standing apart from the sea of green enterprise tools
- **Energy**: Dynamic and engaging user experience

## Implementation Details
- CSS custom properties for consistent color tokens across light/dark themes
- Gradient applications for depth and visual interest
- Accessibility-compliant color contrasts
- Apple-style theme switcher with Light/Dark/Auto modes

## Key Components
- Primary orange palette from 50-950 with warm undertones
- Accent colors for different interaction states
- Dark mode variants that maintain warmth while providing eye comfort
- Semantic color assignments for status, warnings, and success states

## Impact
Creates a distinctive, professional identity that architects associate with creativity and excellence rather than mundane enterprise bureaucracy.
      `,
      category: 'Best Practices',
      subcategory: 'Design System',
      author: 'ARKHITEKTON Team',
      lastModified: '2025-09-02',
      lastEditor: 'Development Team',
      views: 1,
      likes: 0,
      status: 'Published',
      tags: ['design', 'theme', 'orange', 'ui-ux'],
      relatedPages: ['IMPL-001'],
      linkedDecisions: [],
      linkedCapabilities: [],
      attachments: [],
      version: '1.0',
      contributors: ['Development Team']
    }
  ];

  // Mock wiki data - would come from backend
  const pages: WikiPage[] = [
    {
      id: 'WIKI-001',
      title: 'Enterprise Architecture Governance Framework',
      content: 'Comprehensive framework defining governance processes, roles, and responsibilities for enterprise architecture management...',
      category: 'Governance',
      subcategory: 'Framework',
      author: 'Sarah Chen',
      lastModified: '2024-08-29',
      lastEditor: 'Michael Torres',
      views: 245,
      likes: 18,
      status: 'Published',
      tags: ['governance', 'framework', 'process'],
      relatedPages: ['WIKI-002', 'WIKI-005'],
      linkedDecisions: ['ADR-001'],
      linkedCapabilities: ['Cybersecurity & Risk Management'],
      attachments: ['governance-framework.pdf', 'process-diagram.png'],
      version: '2.1',
      contributors: ['Sarah Chen', 'Michael Torres', 'Elena Rodriguez']
    },
    {
      id: 'WIKI-002',
      title: 'Architecture Decision Record Template',
      content: 'Standard template for documenting architectural decisions including context, decision, consequences, and alternatives...',
      category: 'Templates',
      subcategory: 'ADR',
      author: 'Michael Torres',
      lastModified: '2024-08-27',
      lastEditor: 'Michael Torres',
      views: 189,
      likes: 25,
      status: 'Published',
      tags: ['template', 'adr', 'documentation'],
      relatedPages: ['WIKI-001', 'WIKI-006'],
      linkedDecisions: ['ADR-002', 'ADR-003'],
      linkedCapabilities: [],
      attachments: ['adr-template.md'],
      version: '1.3',
      contributors: ['Michael Torres', 'David Kim']
    },
    {
      id: 'WIKI-003',
      title: 'Cloud Security Standards and Guidelines',
      content: 'Comprehensive security standards for cloud infrastructure including zero trust principles, identity management, and compliance requirements...',
      category: 'Standards',
      subcategory: 'Security',
      author: 'David Kim',
      lastModified: '2024-08-25',
      lastEditor: 'Lisa Wang',
      views: 156,
      likes: 12,
      status: 'Published',
      tags: ['security', 'cloud', 'standards', 'compliance'],
      relatedPages: ['WIKI-004', 'WIKI-007'],
      linkedDecisions: ['ADR-002'],
      linkedCapabilities: ['Cybersecurity & Risk Management', 'Cloud Infrastructure Management'],
      attachments: ['security-standards.pdf', 'compliance-checklist.xlsx'],
      version: '3.0',
      contributors: ['David Kim', 'Lisa Wang', 'Michael Torres']
    },
    {
      id: 'WIKI-004',
      title: 'Data Architecture Patterns and Best Practices',
      content: 'Collection of proven data architecture patterns including data lakehouse, event streaming, and analytics platforms...',
      category: 'Architecture Patterns',
      subcategory: 'Data',
      author: 'Elena Rodriguez',
      lastModified: '2024-08-24',
      lastEditor: 'Elena Rodriguez',
      views: 203,
      likes: 31,
      status: 'Published',
      tags: ['data', 'patterns', 'analytics', 'architecture'],
      relatedPages: ['WIKI-003', 'WIKI-008'],
      linkedDecisions: ['ADR-003'],
      linkedCapabilities: ['Data Analytics & Intelligence'],
      attachments: ['data-patterns.pdf', 'reference-architectures.png'],
      version: '2.2',
      contributors: ['Elena Rodriguez', 'Sarah Chen']
    },
    {
      id: 'WIKI-005',
      title: 'Architecture Review Process and Checklist',
      content: 'Step-by-step process for conducting architecture reviews including preparation, review criteria, and decision workflows...',
      category: 'Procedures',
      subcategory: 'Review Process',
      author: 'Sarah Chen',
      lastModified: '2024-08-22',
      lastEditor: 'David Kim',
      views: 167,
      likes: 14,
      status: 'Published',
      tags: ['process', 'review', 'checklist', 'quality'],
      relatedPages: ['WIKI-001', 'WIKI-002'],
      linkedDecisions: [],
      linkedCapabilities: [],
      attachments: ['review-checklist.pdf', 'process-flowchart.png'],
      version: '1.8',
      contributors: ['Sarah Chen', 'David Kim', 'Michael Torres']
    },
    {
      id: 'WIKI-006',
      title: 'Microservices Design Guidelines',
      content: 'Comprehensive guidelines for designing microservices including service boundaries, communication patterns, and deployment strategies...',
      category: 'Best Practices',
      subcategory: 'Microservices',
      author: 'Michael Torres',
      lastModified: '2024-08-20',
      lastEditor: 'Sarah Chen',
      views: 298,
      likes: 42,
      status: 'Published',
      tags: ['microservices', 'design', 'guidelines', 'patterns'],
      relatedPages: ['WIKI-004', 'WIKI-007'],
      linkedDecisions: ['ADR-001'],
      linkedCapabilities: ['Customer Experience Management'],
      attachments: ['microservices-guide.pdf', 'design-patterns.md'],
      version: '3.1',
      contributors: ['Michael Torres', 'Sarah Chen', 'Elena Rodriguez']
    },
    {
      id: 'WIKI-007',
      title: 'API Design and Governance Standards',
      content: 'Standards for API design including REST principles, GraphQL guidelines, versioning strategies, and governance processes...',
      category: 'Standards',
      subcategory: 'API',
      author: 'David Kim',
      lastModified: '2024-08-18',
      lastEditor: 'Elena Rodriguez',
      views: 134,
      likes: 19,
      status: 'Under Review',
      tags: ['api', 'standards', 'governance', 'design'],
      relatedPages: ['WIKI-003', 'WIKI-006'],
      linkedDecisions: ['ADR-004'],
      linkedCapabilities: [],
      attachments: ['api-standards.yaml', 'governance-model.md'],
      version: '2.0',
      contributors: ['David Kim', 'Elena Rodriguez']
    },
    {
      id: 'WIKI-008',
      title: 'Capability Mapping Methodology',
      content: 'Methodology for identifying, mapping, and assessing business capabilities including maturity models and improvement strategies...',
      category: 'Procedures',
      subcategory: 'Capability Management',
      author: 'Elena Rodriguez',
      lastModified: '2024-08-15',
      lastEditor: 'Sarah Chen',
      views: 89,
      likes: 8,
      status: 'Draft',
      tags: ['capability', 'methodology', 'assessment', 'maturity'],
      relatedPages: ['WIKI-004', 'WIKI-001'],
      linkedDecisions: [],
      linkedCapabilities: ['Customer Experience Management', 'Data Analytics & Intelligence'],
      attachments: ['capability-methodology.docx'],
      version: '0.9',
      contributors: ['Elena Rodriguez', 'Sarah Chen']
    }
  ];

  const allPages = [...implementationDocs, ...pages];
  const filteredPages = allPages.filter(page => {
    const matchesSearch = searchQuery === '' || 
      page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || page.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || page.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Published': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'Under Review': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300';
      case 'Draft': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'Archived': return 'bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-300';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-300';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Governance': return Shield;
      case 'Standards': return Target;
      case 'Procedures': return FileText;
      case 'Templates': return Code;
      case 'Best Practices': return Star;
      case 'Architecture Patterns': return Building;
      default: return BookOpen;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Governance': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      case 'Standards': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'Procedures': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'Templates': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300';
      case 'Best Practices': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300';
      case 'Architecture Patterns': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-300';
    }
  };

  // Group pages by category for sidebar navigation
  const pagesByCategory = pages.reduce((acc, page) => {
    if (!acc[page.category]) {
      acc[page.category] = [];
    }
    acc[page.category].push(page);
    return acc;
  }, {} as Record<string, WikiPage[]>);

  const overallStats = {
    totalPages: pages.length,
    publishedPages: pages.filter(p => p.status === 'Published').length,
    draftPages: pages.filter(p => p.status === 'Draft').length,
    totalViews: pages.reduce((sum, p) => sum + p.views, 0),
    totalLikes: pages.reduce((sum, p) => sum + p.likes, 0),
    activeContributors: Array.from(new Set(pages.flatMap(p => p.contributors))).length
  };

  return (
    <div className="h-full overflow-hidden flex flex-col">
      <GovernanceHeader 
        moduleTitle="Knowledge Base" 
        moduleIcon={BookOpen} 
      />
      
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Total Pages</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{overallStats.totalPages}</p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Published</p>
                  <p className="text-2xl font-bold text-green-600">{overallStats.publishedPages}</p>
                </div>
                <FileText className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Drafts</p>
                  <p className="text-2xl font-bold text-blue-600">{overallStats.draftPages}</p>
                </div>
                <Edit className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Total Views</p>
                  <p className="text-2xl font-bold text-purple-600">{overallStats.totalViews.toLocaleString()}</p>
                </div>
                <Eye className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Total Likes</p>
                  <p className="text-2xl font-bold text-emerald-600">{overallStats.totalLikes}</p>
                </div>
                <Star className="h-8 w-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Contributors</p>
                  <p className="text-2xl font-bold text-teal-600">{overallStats.activeContributors}</p>
                </div>
                <Users className="h-8 w-8 text-teal-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search knowledge base by title, content, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50"
              data-testid="input-search-wiki"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-56 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Governance">Governance</SelectItem>
              <SelectItem value="Standards">Standards</SelectItem>
              <SelectItem value="Procedures">Procedures</SelectItem>
              <SelectItem value="Templates">Templates</SelectItem>
              <SelectItem value="Best Practices">Best Practices</SelectItem>
              <SelectItem value="Architecture Patterns">Architecture Patterns</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-40 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Published">Published</SelectItem>
              <SelectItem value="Under Review">Under Review</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="Archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Knowledge Base Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger 
              value="overview" 
              data-testid="tab-overview"
            >
              <FileText className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="user-guide" 
              data-testid="tab-user-guide"
            >
              <BookOpenCheck className="h-4 w-4 mr-2" />
              User Guide
            </TabsTrigger>
            <TabsTrigger 
              value="technology-strategy" 
              data-testid="tab-technology-strategy"
            >
              <Compass className="h-4 w-4 mr-2" />
              Technology Strategy
            </TabsTrigger>
            <TabsTrigger 
              value="integration" 
              data-testid="tab-integration"
            >
              <Link2 className="h-4 w-4 mr-2" />
              Integration
            </TabsTrigger>
            <TabsTrigger 
              value="data" 
              data-testid="tab-data"
            >
              <Database className="h-4 w-4 mr-2" />
              Data
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {filteredPages.map((page) => {
            const CategoryIcon = getCategoryIcon(page.category);
            
            return (
              <Card key={page.id} className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-lg flex items-center justify-center">
                        <CategoryIcon className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 line-clamp-2">
                          {page.title}
                        </h3>
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge className={getCategoryColor(page.category)} variant="outline">
                            {page.category}
                          </Badge>
                          <Badge className={getStatusColor(page.status)} variant="outline">
                            {page.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3">
                      {page.content}
                    </p>
                    
                    <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          {page.author}
                        </span>
                        <span>v{page.version}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {page.lastModified}
                        </span>
                        <span className="flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          {page.views}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-200/50 dark:border-slate-700/50">
                      <div className="flex items-center space-x-3 text-xs text-slate-500 dark:text-slate-400">
                        {page.linkedDecisions.length > 0 && (
                          <span className="flex items-center">
                            <GitBranch className="h-3 w-3 mr-1" />
                            {page.linkedDecisions.length} ADRs
                          </span>
                        )}
                        {page.attachments.length > 0 && (
                          <span className="flex items-center">
                            <FileText className="h-3 w-3 mr-1" />
                            {page.attachments.length} files
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-amber-500" />
                        <span className="text-xs text-slate-600 dark:text-slate-300">{page.likes}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {page.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {page.tags.length > 3 && (
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          +{page.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
            </div>

            {filteredPages.length === 0 && (
              <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
                <CardContent className="p-12 text-center">
                  <BookOpen className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No pages found</h3>
                  <p className="text-slate-600 dark:text-slate-300 mb-4">
                    No knowledge base pages match your current filters.
                  </p>
                  <Button variant="outline">
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="user-guide">
            <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpenCheck className="h-5 w-5" />
                  User Guide
                </CardTitle>
                <CardDescription>Comprehensive guides and tutorials for using ARKHITEKTON</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">User guide content coming soon. This section will include tutorials, how-to guides, and best practices for working with ARKHITEKTON.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="technology-strategy">
            <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Compass className="h-5 w-5" />
                  Technology Strategy
                </CardTitle>
                <CardDescription>ARKHITEKTON's architectural vision, strategy, and technology roadmap</CardDescription>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <div className="space-y-8">
                  {/* Architecture Vision */}
                  <section>
                    <h2 className="text-2xl font-bold text-foreground mb-4">Architecture Vision</h2>
                    <p className="text-muted-foreground mb-4">
                      ARKHITEKTON envisions a revolutionary AI-first systems design platform that bridges the gap between technical architecture 
                      and creative design. Our platform transforms how enterprise architects work by combining:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      <li><strong>Code Expressiveness</strong>: Type-safe, developer-friendly architecture modeling</li>
                      <li><strong>Visual Intuitiveness</strong>: Drag-and-drop canvas with intelligent object connections</li>
                      <li><strong>AI Power</strong>: Contextual recommendations and automated impact analysis</li>
                      <li><strong>Enterprise Integration</strong>: Native connectivity with Jira, Confluence, GitHub, and development tools</li>
                    </ul>
                  </section>

                  {/* Strategic Approach */}
                  <section>
                    <h2 className="text-2xl font-bold text-foreground mb-4">Strategic Approach</h2>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">1. Object-Oriented Model Design</h3>
                        <p className="text-muted-foreground">
                          Components are intelligent objects with built-in connection capabilities, enabling intuitive linking and full traceability 
                          from strategy through deployment.
                        </p>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">2. State Management & Versioning</h3>
                        <p className="text-muted-foreground">
                          Single current state with multiple transition states, architect-defined checkpoints, Git-like merging, and complete traceability 
                          of architectural decisions.
                        </p>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">3. AI-Powered Guidance</h3>
                        <p className="text-muted-foreground">
                          Contextual suggestions based on architectural patterns, best practices, and real-time change detection for impact alerts.
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Technology Choices */}
                  <section>
                    <h2 className="text-2xl font-bold text-foreground mb-4">Technology Stack</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">Frontend Architecture</h3>
                        <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                          <li><strong>React 18</strong>: Modern component-based UI with TypeScript</li>
                          <li><strong>Vite</strong>: Lightning-fast development and optimized builds</li>
                          <li><strong>shadcn/ui + Radix UI</strong>: Accessible, customizable components</li>
                          <li><strong>Tailwind CSS</strong>: Utility-first styling with custom design system</li>
                          <li><strong>TanStack Query</strong>: Server state management</li>
                          <li><strong>Wouter</strong>: Lightweight routing</li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">Backend Architecture</h3>
                        <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                          <li><strong>Express.js</strong>: Fast, minimalist web framework</li>
                          <li><strong>TypeScript ESM</strong>: Type-safe server code</li>
                          <li><strong>Drizzle ORM</strong>: Type-safe database layer</li>
                          <li><strong>PostgreSQL (Neon)</strong>: Serverless database</li>
                          <li><strong>Google Cloud Storage</strong>: Object storage for assets</li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">AI & Intelligence</h3>
                        <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                          <li><strong>Anthropic Claude</strong>: Advanced AI reasoning and analysis</li>
                          <li><strong>Multi-Agent System</strong>: Specialized AI agents for different domains</li>
                          <li><strong>Change Detection</strong>: Real-time impact analysis</li>
                          <li><strong>Pattern Recognition</strong>: Architecture pattern suggestions</li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">Cloud & Integration</h3>
                        <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                          <li><strong>Google Cloud Platform</strong>: Primary cloud provider</li>
                          <li><strong>Multi-Cloud Icons</strong>: AWS, Azure, GCP, IBM support</li>
                          <li><strong>GitHub Integration</strong>: Bi-directional sync</li>
                          <li><strong>Enterprise Tools</strong>: Jira, Confluence, Azure DevOps</li>
                        </ul>
                      </div>
                    </div>
                  </section>

                  {/* Roadmap */}
                  <section>
                    <h2 className="text-2xl font-bold text-foreground mb-4">Technology Roadmap</h2>
                    <div className="space-y-4">
                      <div className="border-l-4 border-orange-500 pl-4">
                        <h3 className="text-lg font-semibold text-foreground">Phase 1: Foundation (Current)</h3>
                        <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground mt-2">
                          <li>Core modeling canvas with intelligent objects</li>
                          <li>Multi-vendor cloud icon library (AWS, Azure, GCP, IBM)</li>
                          <li>User story management with Gherkin validation</li>
                          <li>GitHub integration for commit traceability</li>
                          <li>Knowledge base with collaborative documentation</li>
                        </ul>
                      </div>
                      <div className="border-l-4 border-blue-500 pl-4">
                        <h3 className="text-lg font-semibold text-foreground">Phase 2: Intelligence Enhancement</h3>
                        <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground mt-2">
                          <li>AI-powered architecture recommendations</li>
                          <li>Automated impact analysis and change detection</li>
                          <li>Natural language architecture queries</li>
                          <li>Pattern recognition and suggestions</li>
                        </ul>
                      </div>
                      <div className="border-l-4 border-green-500 pl-4">
                        <h3 className="text-lg font-semibold text-foreground">Phase 3: Enterprise Scale</h3>
                        <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground mt-2">
                          <li>Real-time collaboration features</li>
                          <li>Advanced version control and branching</li>
                          <li>IDE plugin architecture</li>
                          <li>Forward/reverse engineering capabilities</li>
                        </ul>
                      </div>
                    </div>
                  </section>

                  {/* Strategic Decisions */}
                  <section>
                    <h2 className="text-2xl font-bold text-foreground mb-4">Key Strategic Decisions</h2>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-lg">
                        <h4 className="font-semibold text-foreground mb-2">🎯 GCP as Primary Platform</h4>
                        <p className="text-sm text-muted-foreground">
                          Leveraging Google's AI innovation (Vertex AI, BigQuery) while maintaining multi-cloud modeling support
                        </p>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                        <h4 className="font-semibold text-foreground mb-2">🧬 Type-Safe Full Stack</h4>
                        <p className="text-sm text-muted-foreground">
                          TypeScript across frontend and backend with shared schemas ensures consistency and developer productivity
                        </p>
                      </div>
                      <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
                        <h4 className="font-semibold text-foreground mb-2">🤖 AI-First Architecture</h4>
                        <p className="text-sm text-muted-foreground">
                          Claude-powered multi-agent system for intelligent recommendations and automated analysis
                        </p>
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-950/20 p-4 rounded-lg">
                        <h4 className="font-semibold text-foreground mb-2">📊 Object-Oriented Models</h4>
                        <p className="text-sm text-muted-foreground">
                          Intelligent architectural objects with semantic awareness and automated connection capabilities
                        </p>
                      </div>
                    </div>
                  </section>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integration">
            <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link2 className="h-5 w-5" />
                  Integration Documentation
                </CardTitle>
                <CardDescription>APIs, webhooks, and enterprise tool integrations</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Integration documentation coming soon. This section will cover GitHub Actions, Jira, Confluence, Azure DevOps, and custom API integrations.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data">
            <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Data Architecture
                </CardTitle>
                <CardDescription>Database schemas, data models, and storage architecture</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Data architecture documentation coming soon. This section will detail the database schema, data models, storage strategies, and data governance policies.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  </div>
  );
}

export function WikiPage() {
  return (
    <AppLayout>
      <WikiContent />
    </AppLayout>
  );
}

export default WikiPage;