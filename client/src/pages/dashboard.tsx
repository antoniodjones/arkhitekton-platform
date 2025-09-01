import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
    }
  ];

  const quickLinks = [
    {
      title: "Create Architecture Model",
      description: "Design your enterprise architecture",
      icon: Sparkles,
      color: "text-emerald-600",
      href: "/workspace"
    },
    {
      title: "Governance Dashboard", 
      description: "Monitor compliance and risk assessment",
      icon: Shield,
      color: "text-blue-600",
      href: "/governance"
    },
    {
      title: "Innovation Portfolio",
      description: "Track transformation initiatives", 
      icon: Zap,
      color: "text-purple-600",
      href: "/innovation"
    },
    {
      title: "Strategic Planning",
      description: "Define architectural roadmaps",
      icon: TrendingUp,
      color: "text-amber-600", 
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
    { label: "Active Initiatives", value: "32", icon: Sparkles, color: "text-orange-600" },
    { label: "Architecture Models", value: "127", icon: Building, color: "text-blue-600" },
    { label: "Capabilities Mapped", value: "89", icon: Target, color: "text-purple-600" },
    { label: "Stakeholders", value: "24", icon: Users, color: "text-amber-600" }
  ];

  return (
    <div className="h-full overflow-y-auto">
      {/* Sophisticated Header */}
      <header className="backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/50 dark:border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 via-orange-400 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/25">
                    <div className="w-5 h-5 bg-white/90 rounded-lg transform rotate-45" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-800 dark:from-white dark:via-slate-200 dark:to-slate-300 bg-clip-text text-transparent tracking-tight">
                    ARKHITEKTON
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium tracking-wide">MASTER BUILDER</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
        {/* Hero Section */}
        <div className="text-center space-y-8">
          <div className="relative inline-block">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-500 via-orange-400 to-amber-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-orange-500/25 transform hover:scale-105 transition-transform duration-300">
              <div className="w-12 h-12 bg-white/90 rounded-xl transform rotate-45" />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full animate-pulse" />
          </div>
          <div className="space-y-4">
            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-orange-800 dark:from-white dark:via-slate-200 dark:to-orange-200 bg-clip-text text-transparent leading-tight">
              Welcome to ARKHITEKTON
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed font-light">
              The master builder's platform for visionary architecture, strategic design, and intelligent modeling
            </p>
          </div>
        </div>

        {/* Elegant Search */}
        <div className="max-w-3xl mx-auto relative">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-orange-400/20 to-amber-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300" />
            <div className="relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-3xl shadow-2xl">
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
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full mx-auto mb-3 animate-pulse" />
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
                            <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full" />
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
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-orange-400/10 to-amber-500/10 rounded-2xl transform group-hover:scale-105 transition-transform duration-300" />
              <div className="relative bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-6 shadow-lg">
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center justify-between">
                    <stat.icon className={`h-6 w-6 ${stat.color} opacity-80`} />
                    <div className="w-8 h-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full" />
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Strategic Tasks */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center">
              <Clock className="h-5 w-5 mr-3 text-orange-600" />
              Strategic Priorities
            </h3>
            <div className="space-y-4">
              {recentTasks.map((task, index) => (
                <div key={index} className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-amber-500/5 rounded-xl group-hover:from-orange-500/10 group-hover:to-amber-500/10 transition-all duration-200" />
                  <div className="relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl p-5 shadow-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-1">{task.title}</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-300">{task.description}</p>
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-400">{task.timeAgo}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">{task.type}</Badge>
                      {task.priority === 'high' && (
                        <Badge className="text-xs bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300">Critical</Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center">
              <Zap className="h-5 w-5 mr-3 text-orange-600" />
              Quick Actions
            </h3>
            <div className="space-y-4">
              {quickLinks.map((link, index) => (
                <Link key={index} href={link.href}>
                  <div className="group relative cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-amber-500/5 rounded-xl group-hover:from-orange-500/10 group-hover:to-amber-500/10 transition-all duration-200" />
                    <div className="relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl p-5 shadow-lg">
                      <div className="flex items-center">
                        <link.icon className={`h-6 w-6 mr-4 ${link.color}`} />
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-white">{link.title}</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-300">{link.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Models */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center">
              <Building className="h-5 w-5 mr-3 text-orange-600" />
              Architecture Models
            </h3>
            <div className="space-y-4">
              {recentModels.map((model, index) => (
                <Link key={index} href="/workspace">
                  <div className="group relative cursor-pointer" data-testid={`card-recent-model-${index}`}>
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-amber-500/5 rounded-xl group-hover:from-orange-500/10 group-hover:to-amber-500/10 transition-all duration-200" />
                    <div className="relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl p-5 shadow-lg">
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-1">{model.title}</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">{model.description}</p>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">{model.type}</Badge>
                          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <Users className="h-3 w-3" />
                            <span>{model.collaborators}</span>
                            <span>•</span>
                            <span>{model.modified}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
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