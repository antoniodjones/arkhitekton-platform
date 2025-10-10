import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Search, 
  Settings, 
  Plus, 
  Clock, 
  Building, 
  Target, 
  TrendingUp, 
  AlertTriangle,
  FileText,
  Users,
  BarChart3,
  Database,
  Shield,
  Workflow,
  Sparkles,
  Zap
} from 'lucide-react';
import { AppLayout } from '@/components/layout/app-layout';

function DashboardContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [designOption, setDesignOption] = useState<1 | 2 | 3 | 4>(1);

  // Four Design Options System
  const palette = {
    1: { 
      // Current - Original ARKHITEKTON Design
      from: 'from-orange-500', 
      via: 'via-orange-400', 
      to: 'to-amber-500', 
      accent: 'text-orange-600',
      shadow: 'shadow-orange-500/25',
      name: 'Current',
      headerBg: 'backdrop-blur-md bg-white/80 dark:bg-slate-900/80',
      cardBg: 'bg-white/90 dark:bg-slate-800/90',
      cardBorder: 'border-slate-200/50 dark:border-slate-700/50',
      statBg: 'bg-white/70 dark:bg-slate-800/70',
      textPrimary: 'text-slate-900 dark:text-white',
      textSecondary: 'text-slate-600 dark:text-slate-300',
      headerText: 'text-slate-900 dark:text-white',
      headerSubtext: 'text-slate-500 dark:text-slate-400',
      headerIcon: 'text-slate-600 dark:text-slate-300'
    },
    2: { 
      // Elegant Sophistication - Warm & Rich
      from: 'from-orange-500', 
      via: 'via-orange-400', 
      to: 'to-amber-500', 
      accent: 'text-orange-600',
      shadow: 'shadow-orange-500/25',
      name: 'Elegant Sophistication',
      headerBg: 'bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20',
      cardBg: 'bg-gradient-to-br from-orange-25 to-amber-25 dark:bg-gradient-to-br dark:from-orange-950/10 dark:to-amber-950/10',
      cardBorder: 'border-orange-200 dark:border-orange-800',
      statBg: 'bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/20 dark:to-amber-900/20',
      textPrimary: 'text-orange-900 dark:text-orange-100',
      textSecondary: 'text-orange-700 dark:text-orange-300',
      headerText: 'text-slate-900 dark:text-white',
      headerSubtext: 'text-slate-700 dark:text-slate-300',
      headerIcon: 'text-slate-600 dark:text-slate-300'
    },
    3: { 
      // American Enterprise Strength - Bold Corporate  
      from: 'from-[#003268]', 
      via: 'via-[#e3132c]', 
      to: 'to-[#9b1631]', 
      accent: 'text-[#003268] dark:text-[#4a90e2]',
      shadow: 'shadow-[#003268]/25', 
      name: 'American Enterprise Strength',
      headerBg: 'bg-gradient-to-r from-blue-900 to-red-900 dark:from-blue-800 dark:to-red-800',
      cardBg: 'bg-gradient-to-br from-blue-50 to-red-50 dark:bg-gradient-to-br dark:from-blue-950/30 dark:to-red-950/30',
      cardBorder: 'border-blue-300 dark:border-blue-700',
      statBg: 'bg-gradient-to-br from-blue-100 to-red-100 dark:from-blue-900/30 dark:to-red-900/30',
      textPrimary: 'text-blue-900 dark:text-blue-100',
      textSecondary: 'text-blue-800 dark:text-blue-200',
      headerText: 'text-white',
      headerSubtext: 'text-white/90',
      headerIcon: 'text-white'
    },
    4: { 
      // Minimalist Professional - Clean with Subtle Color Accents
      from: 'from-slate-300', 
      via: 'via-blue-200', 
      to: 'to-red-300', 
      accent: 'text-blue-600 dark:text-blue-400',
      shadow: 'shadow-slate-500/25',
      name: 'Minimalist Professional',
      headerBg: 'bg-gradient-to-r from-slate-50 via-blue-50/30 to-red-50/30 dark:from-slate-950 dark:via-blue-950/20 dark:to-red-950/20',
      cardBg: 'bg-gradient-to-br from-white via-blue-25/20 to-red-25/20 dark:bg-gradient-to-br dark:from-slate-900 dark:via-blue-950/10 dark:to-red-950/10',
      cardBorder: 'border-slate-200 dark:border-slate-700',
      statBg: 'bg-gradient-to-br from-slate-50 via-blue-50/50 to-red-50/50 dark:from-slate-800 dark:via-blue-900/30 dark:to-red-900/30',
      textPrimary: 'text-slate-900 dark:text-slate-100',
      textSecondary: 'text-slate-600 dark:text-slate-400',
      headerText: 'text-slate-900 dark:text-white',
      headerSubtext: 'text-slate-700 dark:text-slate-300',
      headerIcon: 'text-slate-600 dark:text-slate-300'
    }
  }[designOption];

  const gradients = {
    logo: `bg-gradient-to-br ${palette.from} ${palette.via} ${palette.to}`,
    logoAccent: `bg-gradient-to-br ${palette.from} ${palette.to}`,
    title: designOption === 1 
      ? 'bg-gradient-to-r from-slate-900 via-slate-700 to-orange-800 dark:from-white dark:via-slate-200 dark:to-orange-200'
      : designOption === 2
      ? 'bg-gradient-to-r from-orange-800 via-orange-600 to-amber-600 dark:from-orange-200 dark:via-orange-100 dark:to-amber-200'
      : designOption === 3 
      ? 'bg-gradient-to-r from-[#003268] via-[#003268] to-[#e3132c] dark:from-[#4a90e2] dark:via-[#4a90e2] dark:to-[#ff4757]'
      : 'bg-gradient-to-r from-slate-800 via-slate-600 to-slate-700 dark:from-slate-200 dark:via-slate-300 dark:to-slate-100',
    search: designOption === 1
      ? 'bg-gradient-to-r from-orange-500/20 via-orange-400/20 to-amber-500/20'
      : designOption === 2
      ? 'bg-gradient-to-r from-orange-200/40 via-orange-100/40 to-amber-200/40 dark:from-orange-800/40 dark:via-orange-700/40 dark:to-amber-800/40'
      : designOption === 3
      ? 'bg-gradient-to-r from-blue-200/40 via-blue-100/40 to-red-200/40 dark:from-blue-800/40 dark:via-blue-700/40 dark:to-red-800/40'
      : 'bg-gradient-to-r from-slate-100/30 via-blue-100/30 to-red-100/30 dark:from-slate-700/30 dark:via-blue-800/30 dark:to-red-800/30',
    card: palette.cardBg,
    overlay: designOption === 1
      ? 'bg-gradient-to-r from-orange-500/5 to-amber-500/5 group-hover:from-orange-500/10 group-hover:to-amber-500/10'
      : designOption === 2
      ? 'bg-gradient-to-r from-orange-200/20 to-amber-200/20 group-hover:from-orange-200/30 group-hover:to-amber-200/30 dark:from-orange-800/20 dark:to-amber-800/20 dark:group-hover:from-orange-800/30 dark:group-hover:to-amber-800/30'
      : designOption === 3
      ? 'bg-gradient-to-r from-blue-200/20 to-red-200/20 group-hover:from-blue-200/30 group-hover:to-red-200/30 dark:from-blue-800/20 dark:to-red-800/20 dark:group-hover:from-blue-800/30 dark:group-hover:to-red-800/30'
      : 'bg-gradient-to-r from-blue-100/15 to-red-100/15 group-hover:from-blue-100/25 group-hover:to-red-100/25 dark:from-blue-800/15 dark:to-red-800/15 dark:group-hover:from-blue-800/25 dark:group-hover:to-red-800/25',
    accentBar: `bg-gradient-to-r ${palette.from} ${palette.to}`
  };

  const recentTasks = [
    {
      title: "Strategic Architecture Review",
      description: "Assess enterprise transformation roadmap",
      type: "Strategy",
      timeAgo: "2 hours ago",
      priority: "high"
    },
    {
      title: "Digital Capability Mapping", 
      description: "Map core digital capabilities and gaps",
      type: "Assessment",
      timeAgo: "1 day ago",
      priority: "medium"
    },
    {
      title: "Technology Modernization",
      description: "Define future-state technology vision", 
      type: "Planning",
      timeAgo: "3 days ago",
      priority: "low"
    },
    {
      title: "Model-driven Apps Rationalization",
      description: "Optimize and consolidate application portfolio",
      type: "Planning",
      timeAgo: "5 days ago",
      priority: "medium"
    }
  ];

  const quickLinks = [
    {
      title: "Create Architecture Model",
      description: "Design your enterprise architecture",
      icon: Sparkles,
      color: palette.accent,
      href: "/workspace"
    },
    {
      title: "Application Portfolio",
      description: "Manage enterprise applications and assets",
      icon: Package,
      color: palette.accent,
      href: "/apm"
    },
    {
      title: "Governance Dashboard", 
      description: "Monitor compliance and risk assessment",
      icon: Shield,
      color: palette.accent,
      href: "/governance"
    },
    {
      title: "Innovation Portfolio",
      description: "Track transformation initiatives", 
      icon: Zap,
      color: palette.accent,
      href: "/innovation"
    },
    {
      title: "Strategic Planning",
      description: "Define architectural roadmaps",
      icon: TrendingUp,
      color: palette.accent, 
      href: "/strategy"
    }
  ];

  const recentModels = [
    {
      title: "Digital Transformation Blueprint",
      description: "Enterprise-wide transformation architecture",
      type: "Strategic",
      modified: "2 hours ago",
      collaborators: 8
    },
    {
      title: "Cloud-Native Platform Design", 
      description: "Modern application platform architecture",
      type: "Technical",
      modified: "1 day ago",
      collaborators: 12
    },
    {
      title: "Customer Experience Journey",
      description: "End-to-end customer interaction model",
      type: "Business", 
      modified: "2 days ago",
      collaborators: 6
    }
  ];

  const stats = [
    { label: "Active Initiatives", value: "32", icon: Sparkles, color: palette.accent },
    { label: "Architecture Models", value: "127", icon: Building, color: palette.accent },
    { label: "Capabilities Mapped", value: "89", icon: Target, color: palette.accent },
    { label: "Stakeholders", value: "24", icon: Users, color: palette.accent }
  ];

  return (
    <div className={`h-full overflow-y-auto ${designOption === 1 ? 'bg-background' : designOption === 2 ? 'bg-gradient-to-br from-orange-25/50 to-amber-25/50 dark:from-orange-950/5 dark:to-amber-950/5' : designOption === 3 ? 'bg-gradient-to-br from-blue-50 to-red-50 dark:from-blue-950/10 dark:to-red-950/10' : 'bg-slate-25 dark:bg-slate-950'}`}>
      {/* Sophisticated Header */}
      <header className={`backdrop-blur-md ${palette.headerBg} ${palette.cardBorder} border-b sticky top-0 z-50`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className={`w-10 h-10 ${gradients.logo} rounded-2xl flex items-center justify-center shadow-lg ${palette.shadow}`}>
                    <div className="w-5 h-5 bg-white/90 rounded-lg transform rotate-45" />
                  </div>
                  <div className={`absolute -top-1 -right-1 w-3 h-3 ${gradients.logoAccent} rounded-full`} />
                </div>
                <div>
                  <h1 className={`text-2xl font-bold ${palette.headerText} tracking-tight`}>
                    ARKHITEKTON
                  </h1>
                  <p className={`text-xs ${palette.headerSubtext} font-medium tracking-wide`}>{palette.name.toUpperCase()}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Design Option Switcher */}
              <div className="flex items-center gap-1 bg-white/20 dark:bg-slate-800/20 rounded-lg p-1">
                <Button 
                  variant={designOption === 1 ? "secondary" : "ghost"} 
                  size="sm" 
                  onClick={() => setDesignOption(1)}
                  className="text-xs px-2 py-1 h-7"
                  data-testid="design-option-current"
                >
                  Current
                </Button>
                <Button 
                  variant={designOption === 2 ? "secondary" : "ghost"} 
                  size="sm" 
                  onClick={() => setDesignOption(2)}
                  className="text-xs px-2 py-1 h-7"
                  data-testid="design-option-elegant"
                >
                  Elegant
                </Button>
                <Button 
                  variant={designOption === 3 ? "secondary" : "ghost"} 
                  size="sm" 
                  onClick={() => setDesignOption(3)}
                  className="text-xs px-2 py-1 h-7"
                  data-testid="design-option-delta"
                >
                  Delta
                </Button>
                <Button 
                  variant={designOption === 4 ? "secondary" : "ghost"} 
                  size="sm" 
                  onClick={() => setDesignOption(4)}
                  className="text-xs px-2 py-1 h-7"
                  data-testid="design-option-minimal"
                >
                  Minimal
                </Button>
              </div>
              <ThemeToggle className={`w-9 h-9 px-0 ${palette.headerIcon} hover:opacity-80`} />
              <Button variant="ghost" size="sm" className={`${palette.headerIcon} hover:opacity-80`}>
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="space-y-4">
            <h2 className={`text-5xl md:text-6xl font-bold ${gradients.title} bg-clip-text text-transparent leading-tight welcome-title-preserve`}>
              Welcome to ARKHITEKTON
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed font-light mb-10">
              The master builder's platform for visionary architecture, strategic design, and intelligent modeling
            </p>
          </div>
        </div>

        {/* Elegant Search */}
        <div className="max-w-3xl mx-auto relative">
          <div className="relative group">
            <div className={`absolute inset-0 ${gradients.search} rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300`} />
            <div className={`relative ${palette.cardBg} backdrop-blur-sm border ${palette.cardBorder} rounded-3xl shadow-2xl`}>
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                placeholder="Discover architecture insights, capabilities, and strategic opportunities..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value.length > 0) {
                    setIsSearching(true);
                    setTimeout(() => {
                      setSearchResults([
                        { type: 'Capability', name: 'Digital Innovation', description: 'Strategic capability for digital transformation', category: 'Strategic' },
                        { type: 'Platform', name: 'Enterprise Data Hub', description: 'Centralized data architecture platform', category: 'Technical' },
                        { type: 'Journey', name: 'Customer Onboarding', description: 'End-to-end customer experience design', category: 'Business' },
                        { type: 'Initiative', name: 'Cloud Migration', description: 'Strategic technology modernization program', category: 'Transformation' }
                      ].filter(item => 
                        item.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
                        item.description.toLowerCase().includes(e.target.value.toLowerCase())
                      ));
                      setIsSearching(false);
                    }, 300);
                  } else {
                    setSearchResults([]);
                    setIsSearching(false);
                  }
                }}
                className="pl-14 pr-6 py-6 text-lg bg-transparent border-0 rounded-3xl placeholder:text-slate-400 focus:ring-0 focus:outline-none"
                data-testid="input-global-search"
              />
            </div>
          </div>
          
          {/* Search Results */}
          {(searchQuery.length > 0) && (
            <div className="absolute top-full mt-4 w-full bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 rounded-2xl shadow-2xl z-50 max-h-96 overflow-hidden">
              {isSearching ? (
                <div className="p-8 text-center">
                  <div className={`w-8 h-8 ${gradients.accentBar} rounded-full mx-auto mb-3 animate-pulse`} />
                  <p className="text-slate-600 dark:text-slate-300">Analyzing architecture...</p>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="p-3">
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-3 px-3 pt-2 font-medium tracking-wide">
                    DISCOVERED {searchResults.length} ELEMENTS
                  </div>
                  {searchResults.map((result, index) => (
                    <div key={index} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl cursor-pointer transition-all duration-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`w-2 h-2 ${gradients.accentBar} rounded-full`} />
                            <h4 className="font-semibold text-slate-900 dark:text-white">{result.name}</h4>
                            <Badge variant="outline" className="text-xs font-medium">
                              {result.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-300">{result.description}</p>
                        </div>
                        <Badge className="ml-4 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          {result.category}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Search className="h-6 w-6 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-600 dark:text-slate-300">No elements found for "{searchQuery}"</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Elegant Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="group relative">
              <div className={`absolute inset-0 ${palette.statBg} rounded-2xl transform group-hover:scale-105 transition-transform duration-300`} />
              <div className={`relative ${palette.cardBg} backdrop-blur-sm border ${palette.cardBorder} rounded-2xl p-6 shadow-lg`}>
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center justify-between">
                    <stat.icon className={`h-6 w-6 ${stat.color} opacity-80`} />
                    <div className={`w-8 h-1 ${gradients.accentBar} rounded-full`} />
                  </div>
                  <div>
                    <p className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                      {stat.value}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-300 font-medium tracking-wide">
                      {stat.label}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div>
          {/* Section Headers */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-6">
            <h3 className={`text-xl font-bold ${palette.textPrimary} flex items-center`}>
              <Clock className={`h-5 w-5 mr-3 ${palette.accent}`} />
              Strategic Priorities
            </h3>
            <h3 className={`text-xl font-bold ${palette.textPrimary} flex items-center`}>
              <Zap className={`h-5 w-5 mr-3 ${palette.accent}`} />
              Quick Actions
            </h3>
            <h3 className={`text-xl font-bold ${palette.textPrimary} flex items-center`}>
              <Building className={`h-5 w-5 mr-3 ${palette.accent}`} />
              Architecture Models
            </h3>
          </div>

          {/* Cards Grid - Aligned Horizontally */}
          <div className="space-y-4">
            {/* Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Strategic Priorities - Card 1 */}
              <div className="group relative h-[140px]">
                <div className={`absolute inset-0 ${gradients.overlay} rounded-xl transition-all duration-200`} />
                <div className={`relative ${palette.cardBg} backdrop-blur-sm border ${palette.cardBorder} rounded-xl p-5 shadow-lg h-full flex flex-col justify-between`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className={`font-semibold ${palette.textPrimary} mb-1`}>Strategic Architecture Review</h4>
                      <p className={`text-sm ${palette.textSecondary} line-clamp-2`}>Assess enterprise transformation roadmap</p>
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 ml-2 flex-shrink-0">2 hours ago</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">Strategy</Badge>
                    <Badge className="text-xs bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300">Critical</Badge>
                  </div>
                </div>
              </div>

              {/* Quick Actions - Card 1 */}
              <Link href="/workspace">
                <div className="group relative cursor-pointer h-[140px]">
                  <div className={`absolute inset-0 ${gradients.overlay} rounded-xl transition-all duration-200`} />
                  <div className={`relative ${palette.cardBg} backdrop-blur-sm border ${palette.cardBorder} rounded-xl p-5 shadow-lg h-full flex items-center`}>
                    <div className="flex items-center w-full">
                      <Sparkles className={`h-6 w-6 mr-4 ${palette.accent} flex-shrink-0`} />
                      <div className="flex-1">
                        <h4 className={`font-semibold ${palette.textPrimary}`}>Create Architecture Model</h4>
                        <p className={`text-sm ${palette.textSecondary}`}>Design your enterprise architecture</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Architecture Models - Card 1 */}
              <Link href="/workspace">
                <div className="group relative cursor-pointer h-[140px]" data-testid="card-recent-model-0">
                  <div className={`absolute inset-0 ${gradients.overlay} rounded-xl transition-all duration-200`} />
                  <div className={`relative ${palette.cardBg} backdrop-blur-sm border ${palette.cardBorder} rounded-xl p-5 shadow-lg h-full flex flex-col justify-between`}>
                    <div>
                      <h4 className={`font-semibold ${palette.textPrimary} mb-1`}>Digital Transformation Blueprint</h4>
                      <p className={`text-sm ${palette.textSecondary} mb-3 line-clamp-2`}>Enterprise-wide transformation architecture</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">Strategic</Badge>
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <Users className="h-3 w-3" />
                        <span>8</span>
                        <span>•</span>
                        <span>2 hours ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Strategic Priorities - Card 2 */}
              <div className="group relative h-[140px]">
                <div className={`absolute inset-0 ${gradients.overlay} rounded-xl transition-all duration-200`} />
                <div className={`relative ${palette.cardBg} backdrop-blur-sm border ${palette.cardBorder} rounded-xl p-5 shadow-lg h-full flex flex-col justify-between`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className={`font-semibold ${palette.textPrimary} mb-1`}>Digital Capability Mapping</h4>
                      <p className={`text-sm ${palette.textSecondary} line-clamp-2`}>Map core digital capabilities and gaps</p>
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 ml-2 flex-shrink-0">1 day ago</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">Assessment</Badge>
                  </div>
                </div>
              </div>

              {/* Quick Actions - Card 2 */}
              <Link href="/governance">
                <div className="group relative cursor-pointer h-[140px]">
                  <div className={`absolute inset-0 ${gradients.overlay} rounded-xl transition-all duration-200`} />
                  <div className={`relative ${palette.cardBg} backdrop-blur-sm border ${palette.cardBorder} rounded-xl p-5 shadow-lg h-full flex items-center`}>
                    <div className="flex items-center w-full">
                      <Shield className={`h-6 w-6 mr-4 ${palette.accent} flex-shrink-0`} />
                      <div className="flex-1">
                        <h4 className={`font-semibold ${palette.textPrimary}`}>Governance Dashboard</h4>
                        <p className={`text-sm ${palette.textSecondary}`}>Monitor compliance and risk assessment</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Architecture Models - Card 2 */}
              <Link href="/workspace">
                <div className="group relative cursor-pointer h-[140px]" data-testid="card-recent-model-1">
                  <div className={`absolute inset-0 ${gradients.overlay} rounded-xl transition-all duration-200`} />
                  <div className={`relative ${palette.cardBg} backdrop-blur-sm border ${palette.cardBorder} rounded-xl p-5 shadow-lg h-full flex flex-col justify-between`}>
                    <div>
                      <h4 className={`font-semibold ${palette.textPrimary} mb-1`}>Cloud-Native Platform Design</h4>
                      <p className={`text-sm ${palette.textSecondary} mb-3 line-clamp-2`}>Modern application platform architecture</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">Technical</Badge>
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <Users className="h-3 w-3" />
                        <span>12</span>
                        <span>•</span>
                        <span>1 day ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Strategic Priorities - Card 3 */}
              <div className="group relative h-[140px]">
                <div className={`absolute inset-0 ${gradients.overlay} rounded-xl transition-all duration-200`} />
                <div className={`relative ${palette.cardBg} backdrop-blur-sm border ${palette.cardBorder} rounded-xl p-5 shadow-lg h-full flex flex-col justify-between`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className={`font-semibold ${palette.textPrimary} mb-1`}>Technology Modernization</h4>
                      <p className={`text-sm ${palette.textSecondary} line-clamp-2`}>Define future-state technology vision</p>
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 ml-2 flex-shrink-0">3 days ago</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">Planning</Badge>
                  </div>
                </div>
              </div>

              {/* Quick Actions - Card 3 */}
              <Link href="/innovation">
                <div className="group relative cursor-pointer h-[140px]">
                  <div className={`absolute inset-0 ${gradients.overlay} rounded-xl transition-all duration-200`} />
                  <div className={`relative ${palette.cardBg} backdrop-blur-sm border ${palette.cardBorder} rounded-xl p-5 shadow-lg h-full flex items-center`}>
                    <div className="flex items-center w-full">
                      <Zap className={`h-6 w-6 mr-4 ${palette.accent} flex-shrink-0`} />
                      <div className="flex-1">
                        <h4 className={`font-semibold ${palette.textPrimary}`}>Innovation Portfolio</h4>
                        <p className={`text-sm ${palette.textSecondary}`}>Track transformation initiatives</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Architecture Models - Card 3 */}
              <Link href="/workspace">
                <div className="group relative cursor-pointer h-[140px]" data-testid="card-recent-model-2">
                  <div className={`absolute inset-0 ${gradients.overlay} rounded-xl transition-all duration-200`} />
                  <div className={`relative ${palette.cardBg} backdrop-blur-sm border ${palette.cardBorder} rounded-xl p-5 shadow-lg h-full flex flex-col justify-between`}>
                    <div>
                      <h4 className={`font-semibold ${palette.textPrimary} mb-1`}>Customer Experience Journey</h4>
                      <p className={`text-sm ${palette.textSecondary} mb-3 line-clamp-2`}>End-to-end customer interaction model</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">Business</Badge>
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <Users className="h-3 w-3" />
                        <span>6</span>
                        <span>•</span>
                        <span>2 days ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Row 4 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Strategic Priorities - Card 4 */}
              <div className="group relative h-[140px]">
                <div className={`absolute inset-0 ${gradients.overlay} rounded-xl transition-all duration-200`} />
                <div className={`relative ${palette.cardBg} backdrop-blur-sm border ${palette.cardBorder} rounded-xl p-5 shadow-lg h-full flex flex-col justify-between`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className={`font-semibold ${palette.textPrimary} mb-1`}>Model-driven Apps Rationalization</h4>
                      <p className={`text-sm ${palette.textSecondary} line-clamp-2`}>Optimize and consolidate application portfolio</p>
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 ml-2 flex-shrink-0">5 days ago</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">Planning</Badge>
                  </div>
                </div>
              </div>

              {/* Quick Actions - Card 4 */}
              <Link href="/strategy">
                <div className="group relative cursor-pointer h-[140px]">
                  <div className={`absolute inset-0 ${gradients.overlay} rounded-xl transition-all duration-200`} />
                  <div className={`relative ${palette.cardBg} backdrop-blur-sm border ${palette.cardBorder} rounded-xl p-5 shadow-lg h-full flex items-center`}>
                    <div className="flex items-center w-full">
                      <TrendingUp className={`h-6 w-6 mr-4 ${palette.accent} flex-shrink-0`} />
                      <div className="flex-1">
                        <h4 className={`font-semibold ${palette.textPrimary}`}>Strategic Planning</h4>
                        <p className={`text-sm ${palette.textSecondary}`}>Define architectural roadmaps</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Architecture Models - Empty space for alignment */}
              <div className="h-[140px]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Dashboard() {
  return (
    <AppLayout>
      <DashboardContent />
    </AppLayout>
  );
}

export default Dashboard;