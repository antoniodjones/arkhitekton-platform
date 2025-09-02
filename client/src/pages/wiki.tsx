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
  Zap
} from 'lucide-react';
import { AppLayout } from '@/components/layout/app-layout';
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
    <div className="h-full overflow-y-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-emerald-800 dark:from-white dark:via-slate-200 dark:to-emerald-200 bg-clip-text text-transparent">
              Knowledge Base
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mt-2">
              Centralized governance documentation and enterprise architecture knowledge
            </p>
          </div>
          <Button 
            onClick={() => {
              setIsCreatingNewPage(true);
              setSelectedPageId('new-page');
              setShowTreeView(true);
            }}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
            data-testid="button-create-page"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Page
          </Button>
        </div>

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

        {/* Knowledge Base Tree View or Content Grid */}
        <Tabs value={showTreeView ? "tree" : "overview"} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger 
              value="overview" 
              onClick={handleBackToOverview}
              data-testid="tab-overview"
            >
              <FileText className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="tree" 
              onClick={() => setShowTreeView(true)}
              data-testid="tab-tree-view"
            >
              <Folder className="h-4 w-4 mr-2" />
              Tree View
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

          <TabsContent value="tree" className="h-full">
            <ResizablePanelGroup direction="horizontal" className="h-full">
              {/* Tree Navigation Sidebar */}
              <ResizablePanel defaultSize={25} minSize={15} maxSize={40}>
                <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50 h-full">
                  <TreeNavigation 
                    onPageSelect={handlePageSelect}
                    selectedPageId={selectedPageId}
                    isCreatingNewPage={isCreatingNewPage}
                    onCreateNewPage={() => {
                      setIsCreatingNewPage(true);
                      setSelectedPageId('new-page');
                      setShowTreeView(true);
                    }}
                    className="h-full"
                  />
                </Card>
              </ResizablePanel>
              
              <ResizableHandle withHandle />
              
              {/* Page Content */}
              <ResizablePanel defaultSize={75} minSize={60}>
                <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50 h-full ml-2">
                  {selectedPageId === 'new-page' && isCreatingNewPage ? (
                    <PageEditor 
                      onSave={(savedPage) => {
                        setIsCreatingNewPage(false);
                        setSelectedPageId(savedPage.id);
                      }}
                      onCancel={() => {
                        setIsCreatingNewPage(false);
                        setSelectedPageId(undefined);
                      }}
                      autoFocus={true}
                      inline={true}
                      className="h-full p-6"
                    />
                  ) : (
                    <KnowledgeBasePage 
                      pageId={selectedPageId}
                      onBack={handleBackToOverview}
                      className="h-full"
                    />
                  )}
                </Card>
              </ResizablePanel>
            </ResizablePanelGroup>
          </TabsContent>
        </Tabs>
        
        {/* Remove old modal editor - now using inline */}
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