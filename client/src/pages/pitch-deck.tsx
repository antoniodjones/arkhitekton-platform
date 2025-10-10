import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  Printer,
  Download,
  Home,
  Building,
  Shapes,
  Shield,
  Target,
  FileText,
  Workflow,
  Ticket,
  GitBranch,
  BookOpen,
  TrendingUp,
  Users,
  Sparkles,
  Globe,
  Zap,
  BarChart3,
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';

export default function PitchDeck() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    // Cover
    {
      id: 'cover',
      type: 'cover',
      title: 'ARKHITEKTON',
      subtitle: 'The Master Builder Platform',
      tagline: 'AI-First Enterprise Architecture & Design Platform',
      content: ''
    },
    // Problem
    {
      id: 'problem',
      type: 'content',
      title: 'The Problem',
      subtitle: 'Enterprise Architecture is Broken',
      content: '',
      points: [
        'Traditional tools (Sparx EA, Visio) are outdated and disconnected from modern workflows',
        'Design tools (Figma, Miro) lack enterprise architecture rigor and governance',
        'No unified platform bridges strategy, design, and implementation',
        'Change detection and impact analysis are manual, error-prone processes',
        'Collaboration between architects, designers, and developers is fragmented'
      ]
    },
    // Solution
    {
      id: 'solution',
      type: 'content',
      title: 'The Solution',
      subtitle: 'ARKHITEKTON: AI-First Universal Design Platform',
      content: '',
      points: [
        'Combines the expressiveness of code with intuitive visual representation',
        'AI-powered guidance and automated change detection',
        'Object-oriented model design with intelligent connections',
        'End-to-end traceability from strategy to deployment',
        'Native integration with enterprise tools (Jira, Confluence, Figma, IDEs)'
      ]
    },
    // Market Opportunity
    {
      id: 'market',
      type: 'content',
      title: 'Market Opportunity',
      subtitle: '$15B+ Enterprise Architecture & Design Market',
      content: '',
      points: [
        'Enterprise Architecture Tools: $5B market (Sparx, IBM, Mega)',
        'Collaborative Design: $8B market (Figma, Miro, Mural)',
        'Developer Tools Integration: $2B+ opportunity',
        'TAM: Every enterprise with 500+ employees needs architecture governance',
        'Growing demand for AI-assisted design and automated compliance'
      ]
    },
    // Product Features
    {
      id: 'features',
      type: 'features',
      title: 'Product Features',
      subtitle: 'Comprehensive Platform Capabilities',
      content: '',
      features: [
        {
          icon: Building,
          title: 'Architecture Workspace',
          description: 'Comprehensive design palette with AWS, Azure, GCP, Oracle, ArchiMate, TOGAF, BPMN support'
        },
        {
          icon: Sparkles,
          title: 'AI Assistant',
          description: 'Contextual guidance, pattern recognition, and architectural best practices powered by AI'
        },
        {
          icon: Zap,
          title: 'Change Detection',
          description: 'Automated impact analysis, real-time alerts, and intelligent change tracking'
        },
        {
          icon: Shield,
          title: 'Governance & Compliance',
          description: 'Architecture review workflows, ADRs, and compliance management'
        },
        {
          icon: Target,
          title: 'Capability Assessment',
          description: 'Business capability modeling and maturity assessment'
        },
        {
          icon: GitBranch,
          title: 'Version Control',
          description: 'Git-like versioning for models with checkpoints and merging'
        }
      ]
    },
    // Technology
    {
      id: 'technology',
      type: 'content',
      title: 'Technology Stack',
      subtitle: 'Modern, Scalable, AI-Powered',
      content: '',
      points: [
        'Cloud-Native Architecture on GCP (Vertex AI, BigQuery)',
        'React + TypeScript frontend with real-time collaboration',
        'PostgreSQL for data persistence with object storage',
        'Anthropic Claude for AI capabilities',
        'Plugin architecture for IDE integration (VS Code, IntelliJ)',
        'API-first design for enterprise integrations'
      ]
    },
    // Competitive Advantage
    {
      id: 'competitive',
      type: 'content',
      title: 'Competitive Advantage',
      subtitle: 'What Sets Us Apart',
      content: '',
      points: [
        'Only platform combining EA rigor with modern design collaboration',
        'AI-first approach vs. legacy tools adding AI as afterthought',
        'Bidirectional sync with code (forward & reverse engineering)',
        'Universal object model works across all frameworks and cloud providers',
        'Built-in governance and compliance from day one'
      ]
    },
    // Business Model
    {
      id: 'business',
      type: 'content',
      title: 'Business Model',
      subtitle: 'SaaS Subscription with Enterprise Pricing',
      content: '',
      points: [
        'Professional: $49/user/month - Individual architects and small teams',
        'Team: $99/user/month - Architecture teams with collaboration',
        'Enterprise: Custom pricing - Full platform with integrations, SSO, SLA',
        'Add-ons: AI credits, advanced analytics, custom integrations',
        'Target: $100K+ ACV for mid-market, $500K+ for enterprise'
      ]
    },
    // Traction
    {
      id: 'traction',
      type: 'content',
      title: 'Traction & Roadmap',
      subtitle: 'Current Status & Next Steps',
      content: '',
      points: [
        'MVP Platform: Core architecture workspace and AI capabilities complete',
        'Q1 2025: Beta launch with design partners (target: 10 enterprise pilots)',
        'Q2 2025: IDE plugin suite and code integration',
        'Q3 2025: Advanced AI features and automated compliance',
        'Q4 2025: Marketplace for templates, patterns, and integrations'
      ]
    },
    // Team
    {
      id: 'team',
      type: 'content',
      title: 'The Team',
      subtitle: 'Master Builders',
      content: '',
      points: [
        'Experienced enterprise architects and product leaders',
        'Deep expertise in cloud platforms and AI/ML',
        'Track record building developer tools and SaaS platforms',
        'Advisors from leading architecture practices and tech companies',
        'Passionate about democratizing enterprise architecture'
      ]
    },
    // Ask
    {
      id: 'ask',
      type: 'content',
      title: 'The Ask',
      subtitle: 'Series A Funding',
      content: '',
      points: [
        'Raising: $8M Series A',
        'Use of Funds: Product development (40%), Sales & Marketing (35%), Operations (25%)',
        'Go-to-Market: Enterprise sales with PLG motion for individual architects',
        'Key Hires: VP Engineering, VP Sales, Solutions Architects',
        '18-month runway to reach $10M ARR'
      ]
    },
    // Contact
    {
      id: 'contact',
      type: 'contact',
      title: 'Let\'s Build the Future of Architecture Together',
      subtitle: '',
      content: 'ARKHITEKTON - The Master Builder Platform',
      contact: {
        email: 'hello@arkhitekton.com',
        web: 'www.arkhitekton.com'
      }
    }
  ];

  const appPages = [
    { name: 'Dashboard', route: '/', icon: Home, description: 'Strategic overview and insights' },
    { name: 'Portfolio Management', route: '/portfolio', icon: TrendingUp, description: 'Track transformation initiatives' },
    { name: 'Architecture Workspace', route: '/workspace', icon: Building, description: 'Comprehensive design & modeling workspace' },
    { name: 'Architecture Modeling', route: '/modeling', icon: Shapes, description: 'Universal modeling engine' },
    { name: 'Governance', route: '/governance', icon: Shield, description: 'Compliance and risk management' },
    { name: 'Capability Assessment', route: '/capabilities', icon: Target, description: 'Evaluate business capabilities' },
    { name: 'Decision Records', route: '/decisions', icon: FileText, description: 'Architecture Decision Records' },
    { name: 'Review Workflows', route: '/workflows', icon: Workflow, description: 'Architecture review processes' },
    { name: 'Architecture Tickets', route: '/tickets', icon: Ticket, description: 'Review requests and assignments' },
    { name: 'Plan', route: '/plan', icon: GitBranch, description: 'Development roadmap and tasks' },
    { name: 'Knowledge Base', route: '/wiki', icon: BookOpen, description: 'Implementation documentation' }
  ];

  const handlePrint = () => {
    window.print();
  };

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const slide = slides[currentSlide];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Navigation Header - Hidden when printing */}
      <div className="print:hidden fixed top-4 left-4 right-4 z-50 flex items-center justify-between">
        <Link href="/">
          <Button
            variant="outline"
            className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-slate-200 dark:border-slate-700 shadow-lg"
            data-testid="button-back-dashboard"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        
        <Button
          onClick={handlePrint}
          className="bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg"
          data-testid="button-print"
        >
          <Printer className="h-4 w-4 mr-2" />
          Print/PDF
        </Button>
      </div>

      {/* Navigation Controls - Hidden when printing */}
      <div className="print:hidden fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-4 bg-white dark:bg-slate-800 px-6 py-3 rounded-full shadow-xl border border-slate-200 dark:border-slate-700">
        <Button
          variant="ghost"
          size="sm"
          onClick={prevSlide}
          disabled={currentSlide === 0}
          data-testid="button-prev-slide"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
          {currentSlide + 1} / {slides.length}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
          data-testid="button-next-slide"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Slide Content */}
      <div className="print:block">
        {slides.map((s, index) => (
          <div
            key={s.id}
            className={`min-h-screen flex items-center justify-center p-12 ${
              index === currentSlide ? 'block' : 'print:block hidden'
            } print:page-break-after-always`}
          >
            {/* Cover Slide */}
            {s.type === 'cover' && (
              <div className="text-center max-w-5xl">
                <div className="mb-8 flex justify-center">
                  <div className="relative">
                    <div className="w-32 h-32 bg-gradient-to-br from-orange-500 via-orange-400 to-amber-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-orange-500/50">
                      <div className="w-16 h-16 bg-white/90 rounded-2xl transform rotate-45" />
                    </div>
                    <div className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full" />
                  </div>
                </div>
                <h1 className="text-8xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-800 dark:from-white dark:via-slate-200 dark:to-slate-300 bg-clip-text text-transparent mb-4">
                  {s.title}
                </h1>
                <p className="text-2xl text-slate-600 dark:text-slate-400 font-medium mb-6">
                  {s.subtitle}
                </p>
                <p className="text-xl text-slate-500 dark:text-slate-500">
                  {s.tagline}
                </p>
              </div>
            )}

            {/* Content Slide */}
            {s.type === 'content' && (
              <div className="max-w-5xl w-full">
                <h2 className="text-6xl font-bold text-slate-900 dark:text-white mb-4">
                  {s.title}
                </h2>
                <p className="text-2xl text-orange-500 font-medium mb-12">
                  {s.subtitle}
                </p>
                <div className="space-y-6">
                  {s.points?.map((point, idx) => (
                    <div key={idx} className="flex items-start gap-4">
                      <CheckCircle2 className="h-8 w-8 text-orange-500 flex-shrink-0 mt-1" />
                      <p className="text-xl text-slate-700 dark:text-slate-300 leading-relaxed">
                        {point}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Features Slide */}
            {s.type === 'features' && (
              <div className="max-w-6xl w-full">
                <h2 className="text-6xl font-bold text-slate-900 dark:text-white mb-4">
                  {s.title}
                </h2>
                <p className="text-2xl text-orange-500 font-medium mb-12">
                  {s.subtitle}
                </p>
                <div className="grid grid-cols-2 gap-6">
                  {s.features?.map((feature, idx) => {
                    const Icon = feature.icon;
                    return (
                      <Card key={idx} className="p-6 hover:shadow-xl transition-shadow">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                              {feature.title}
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Contact Slide */}
            {s.type === 'contact' && (
              <div className="text-center max-w-5xl">
                <h2 className="text-6xl font-bold text-slate-900 dark:text-white mb-8">
                  {s.title}
                </h2>
                <p className="text-3xl font-medium bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent mb-12">
                  {s.content}
                </p>
                <div className="space-y-4">
                  <p className="text-2xl text-slate-600 dark:text-slate-400">
                    {s.contact?.email}
                  </p>
                  <p className="text-2xl text-slate-600 dark:text-slate-400">
                    {s.contact?.web}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Appendix Section */}
        <div className="print:block hidden">
          <div className="min-h-screen flex items-center justify-center p-12 print:page-break-after-always">
            <div className="max-w-6xl w-full">
              <h2 className="text-6xl font-bold text-slate-900 dark:text-white mb-8 text-center">
                Appendix
              </h2>
              <p className="text-2xl text-orange-500 font-medium mb-12 text-center">
                Platform Screenshots & Features
              </p>
            </div>
          </div>

          {/* App Pages Screenshots */}
          {appPages.map((page, index) => {
            const Icon = page.icon;
            
            // Page-specific content details
            const pageDetails: Record<string, { features: string[]; highlights: string }> = {
              '/': {
                features: ['Real-time architecture health metrics', 'Active projects overview', 'Recent activities feed', 'Team collaboration status', 'AI-powered insights'],
                highlights: 'Strategic command center with executive dashboards and key performance indicators'
              },
              '/portfolio': {
                features: ['Transformation initiative tracking', 'Investment prioritization', 'ROI analytics', 'Roadmap visualization', 'Stakeholder management'],
                highlights: 'Portfolio-level view for managing multiple architecture initiatives and measuring business value'
              },
              '/workspace': {
                features: ['Comprehensive design palette (AWS, Azure, GCP, Oracle)', 'ArchiMate 3.0, TOGAF, BPMN support', 'Resizable panels for palette and properties', 'AI Assistant integration', 'Change Detection system'],
                highlights: 'Professional modeling workspace with enterprise-grade architecture frameworks and cloud provider support'
              },
              '/modeling': {
                features: ['Universal modeling engine', 'Pre-configured architecture templates', 'Intelligent object connections', 'Version control for models', 'Export capabilities'],
                highlights: 'Specialized modeling environment with curated shapes and sophisticated architectural patterns'
              },
              '/governance': {
                features: ['Compliance tracking', 'Risk assessment', 'Policy management', 'Audit trails', 'Regulatory reporting'],
                highlights: 'Enterprise governance framework ensuring architectural compliance and risk management'
              },
              '/capabilities': {
                features: ['Business capability modeling', 'Maturity assessment', 'Gap analysis', 'Heat mapping', 'Capability roadmapping'],
                highlights: 'Strategic capability assessment tools for evaluating business architecture maturity'
              },
              '/decisions': {
                features: ['Architecture Decision Records (ADRs)', 'Decision tracking and history', 'Impact analysis', 'Stakeholder approval workflows', 'Template library'],
                highlights: 'Comprehensive ADR system for documenting and managing architectural decisions'
              },
              '/workflows': {
                features: ['Architecture review processes', 'Approval workflows', 'Review request management', 'Status tracking', 'Automated notifications'],
                highlights: 'Structured review workflows ensuring architectural governance and quality assurance'
              },
              '/tickets': {
                features: ['Architecture review requests', 'Architect assignment system', 'Priority management', 'Ticket lifecycle tracking', 'Integration with Jira'],
                highlights: 'JIRA-like ticketing system specifically designed for architecture governance'
              },
              '/plan': {
                features: ['Development roadmap', 'Task management', 'Sprint planning', 'Dependency tracking', 'Team coordination'],
                highlights: 'Integrated planning tools connecting architecture decisions to development execution'
              },
              '/wiki': {
                features: ['Implementation guides', 'Best practices documentation', 'Pattern library', 'Team knowledge base', 'Search and discovery'],
                highlights: 'Collaborative knowledge management for architectural standards and implementation guidance'
              }
            };
            
            const details = pageDetails[page.route] || { features: [], highlights: '' };
            
            return (
              <div key={page.route} className="min-h-screen flex flex-col p-12 print:page-break-after-always">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-4xl font-bold text-slate-900 dark:text-white">
                      {page.name}
                    </h3>
                    <p className="text-xl text-slate-600 dark:text-slate-400">
                      {page.description}
                    </p>
                  </div>
                  <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 text-sm px-3 py-1">
                    {page.route}
                  </Badge>
                </div>
                
                {/* Page Mockup */}
                <Card className="flex-1 p-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-2 border-slate-200 dark:border-slate-700 shadow-xl">
                  <div className="space-y-6">
                    {/* Header representation */}
                    <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-3">
                        <Icon className="h-6 w-6 text-orange-500" />
                        <span className="font-semibold text-slate-900 dark:text-white">{page.name}</span>
                      </div>
                      <div className="flex gap-2">
                        <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded"></div>
                        <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded"></div>
                        <div className="w-8 h-8 bg-orange-500 rounded"></div>
                      </div>
                    </div>
                    
                    {/* Content representation */}
                    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
                      <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                        Key Features:
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        {details.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-slate-700 dark:text-slate-300">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Highlights */}
                    <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 rounded-lg border border-orange-200 dark:border-orange-800 p-6">
                      <h4 className="text-sm font-semibold text-orange-700 dark:text-orange-400 mb-2">
                        Platform Highlight
                      </h4>
                      <p className="text-slate-700 dark:text-slate-300">
                        {details.highlights}
                      </p>
                    </div>
                    
                    {/* Visual mockup elements */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="aspect-video bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                        <Icon className="h-12 w-12 text-slate-400 dark:text-slate-600" />
                      </div>
                      <div className="aspect-video bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                        <BarChart3 className="h-12 w-12 text-slate-400 dark:text-slate-600" />
                      </div>
                      <div className="aspect-video bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                        <Globe className="h-12 w-12 text-slate-400 dark:text-slate-600" />
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          @page {
            size: A4 landscape;
            margin: 0;
          }
          
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          
          .print\\:page-break-after-always {
            page-break-after: always;
          }
          
          .print\\:hidden {
            display: none !important;
          }
          
          .print\\:block {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}
