import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Building, 
  Shield, 
  BookOpen, 
  Users, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  Target,
  TrendingUp,
  FileText,
  Workflow,
  Database,
  GitBranch,
  Ticket
} from 'lucide-react';

interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  badge?: string;
}

interface MainSidebarProps {
  className?: string;
}

export function MainSidebar({ className }: MainSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [location] = useLocation();

  const navigationItems: NavigationItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      href: '/',
      icon: Home,
      description: 'Strategic overview and insights'
    },
    {
      id: 'workspace',
      label: 'Architecture Workspace',
      href: '/workspace',
      icon: Building,
      description: 'Design and model architectures'
    },
    {
      id: 'governance',
      label: 'Governance',
      href: '/governance',
      icon: Shield,
      description: 'Compliance and risk management'
    },
    {
      id: 'capabilities',
      label: 'Capability Assessment',
      href: '/capabilities',
      icon: Target,
      description: 'Evaluate business capabilities'
    },
    {
      id: 'decisions',
      label: 'Decision Records',
      href: '/decisions',
      icon: FileText,
      description: 'Architecture Decision Records'
    },
    {
      id: 'portfolio',
      label: 'Portfolio Management',
      href: '/portfolio',
      icon: TrendingUp,
      description: 'Track transformation initiatives'
    },
    {
      id: 'workflows',
      label: 'Review Workflows',
      href: '/workflows',
      icon: Workflow,
      description: 'Architecture review processes'
    },
    {
      id: 'tickets',
      label: 'Architecture Tickets',
      href: '/tickets',
      icon: Ticket,
      description: 'Review requests and architect assignments'
    },
    {
      id: 'wiki',
      label: 'Knowledge Base',
      href: '/wiki',
      icon: BookOpen,
      description: 'Governance documentation'
    }
  ];

  const bottomItems: NavigationItem[] = [
    {
      id: 'team',
      label: 'Team',
      href: '/team',
      icon: Users,
      description: 'Manage team access'
    },
    {
      id: 'settings',
      label: 'Settings',
      href: '/settings',
      icon: Settings,
      description: 'Configure ARKITEKTON'
    }
  ];

  const isActiveRoute = (href: string) => {
    if (href === '/') {
      return location === '/';
    }
    return location.startsWith(href);
  };

  return (
    <aside 
      className={cn(
        "h-screen bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-r border-slate-200/50 dark:border-slate-700/50 flex flex-col transition-all duration-300 shadow-xl",
        isCollapsed ? "w-16" : "w-72",
        className
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                  <div className="w-5 h-5 bg-white/90 rounded-lg transform rotate-45" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full" />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-800 dark:from-white dark:via-slate-200 dark:to-slate-300 bg-clip-text text-transparent tracking-tight">
                  ARKITEKTON
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium tracking-wide">MASTER BUILDER</p>
              </div>
            </div>
          )}
          {isCollapsed && (
            <div className="mx-auto">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                  <div className="w-4 h-4 bg-white/90 rounded-md transform rotate-45" />
                </div>
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full" />
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white p-1"
            data-testid="button-toggle-sidebar"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navigationItems.map((item) => {
          const isActive = isActiveRoute(item.href);
          const IconComponent = item.icon;
          
          return (
            <Link key={item.id} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start h-auto p-3 text-left transition-all duration-200",
                  isActive 
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25" 
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800",
                  isCollapsed && "justify-center px-0"
                )}
                data-testid={`nav-${item.id}`}
              >
                <div className={cn("flex items-center", isCollapsed ? "justify-center" : "space-x-3")}>
                  <IconComponent className={cn("h-5 w-5 flex-shrink-0", isCollapsed && "mx-auto")} />
                  {!isCollapsed && (
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium truncate">{item.label}</p>
                        {item.badge && (
                          <span className="ml-2 px-2 py-0.5 text-xs bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className={cn(
                        "text-sm truncate mt-0.5",
                        isActive ? "text-white/80" : "text-slate-500 dark:text-slate-400"
                      )}>
                        {item.description}
                      </p>
                    </div>
                  )}
                </div>
              </Button>
            </Link>
          );
        })}
      </div>

      {/* Bottom Navigation */}
      <div className="p-3 border-t border-slate-200/50 dark:border-slate-700/50 space-y-1">
        {bottomItems.map((item) => {
          const isActive = isActiveRoute(item.href);
          const IconComponent = item.icon;
          
          return (
            <Link key={item.id} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start h-auto p-3 text-left transition-all duration-200",
                  isActive 
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25" 
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800",
                  isCollapsed && "justify-center px-0"
                )}
                data-testid={`nav-${item.id}`}
              >
                <div className={cn("flex items-center", isCollapsed ? "justify-center" : "space-x-3")}>
                  <IconComponent className={cn("h-5 w-5 flex-shrink-0", isCollapsed && "mx-auto")} />
                  {!isCollapsed && (
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.label}</p>
                      <p className={cn(
                        "text-sm truncate mt-0.5",
                        isActive ? "text-white/80" : "text-slate-500 dark:text-slate-400"
                      )}>
                        {item.description}
                      </p>
                    </div>
                  )}
                </div>
              </Button>
            </Link>
          );
        })}
      </div>

      {/* AI Assistant Indicator */}
      {!isCollapsed && (
        <div className="p-3 border-t border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-lg">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-slate-900 dark:text-white text-sm">AI Assistant</p>
              <p className="text-xs text-slate-600 dark:text-slate-300">Available in workspace</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}