import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Building, 
  Shield, 
  BookOpen, 
  Users, 
  Settings, 
  Sparkles,
  Target,
  TrendingUp,
  FileText,
  Workflow,
  Ticket,
  Shapes,
  Wrench,
  GitBranch
} from 'lucide-react';

interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  badge?: string;
}

const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/',
    icon: Home,
    description: 'Strategic overview and insights'
  },
  {
    id: 'portfolio',
    label: 'Portfolio Management',
    href: '/portfolio',
    icon: TrendingUp,
    description: 'Track transformation initiatives'
  },
  {
    id: 'modeling',
    label: 'Architecture Modeling',
    href: '/modeling',
    icon: Shapes,
    description: 'Universal modeling engine for architects'
  },
  {
    id: 'workspace',
    label: 'Architecture Workspace',
    href: '/workspace',
    icon: Building,
    description: 'Design and model architectures'
  },
  {
    id: 'design-options',
    label: 'ARKHITEKTON Design Options',
    href: '/decisions',
    icon: Wrench,
    description: 'Review ARKHITEKTON design decisions (ARKDD)'
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
    description: 'Review requests and architect assignments',
    badge: '3'
  },
  {
    id: 'plan',
    label: 'ARKHITEKTON Plan',
    href: '/plan',
    icon: GitBranch,
    description: 'Development roadmap and task tracking'
  },
  {
    id: 'wiki',
    label: 'Knowledge Base',
    href: '/wiki',
    icon: BookOpen,
    description: 'Documentation and knowledge repository',
    badge: 'New'
  }
];

const bottomItems: NavigationItem[] = [
  {
    id: 'ai-assistant',
    label: 'AI Assistant',
    href: '/ai-assistant',
    icon: Sparkles,
    description: 'Architecture guidance and insights'
  },
  {
    id: 'team',
    label: 'Team Collaboration',
    href: '/team',
    icon: Users,
    description: 'Team management and collaboration'
  },
  {
    id: 'settings',
    label: 'Settings',
    href: '/settings',
    icon: Settings,
    description: 'Application preferences and configuration'
  }
];

export function CompactSidebar() {
  const [location] = useLocation();

  const isActiveRoute = (href: string) => {
    if (href === '/') {
      return location === '/';
    }
    return location.startsWith(href);
  };

  return (
    <aside className="h-screen w-12 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-r border-slate-200/50 dark:border-slate-700/50 flex flex-col shadow-xl">
      {/* Compact Header - Icon Only */}
      <div className="flex h-10 items-center justify-center border-b border-slate-200/50 dark:border-slate-700/50 p-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 cursor-pointer">
                <span className="text-xs font-bold text-white">A</span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-slate-900 dark:bg-slate-50">
              <div className="text-xs">
                <p className="font-semibold text-white dark:text-slate-900">ARKHITEKTON</p>
                <p className="text-slate-300 dark:text-slate-600">Enterprise Architecture</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Compact Navigation - Icons Only */}
      <div className="flex-1 p-1 space-y-1 overflow-y-auto">
        <TooltipProvider>
          {navigationItems.map((item) => {
            const isActive = isActiveRoute(item.href);
            
            return (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <Link href={item.href}>
                    <Button
                      variant={isActive ? 'default' : 'ghost'}
                      size="sm"
                      className={cn(
                        'w-10 h-10 p-0 relative',
                        isActive
                          ? 'bg-orange-600 text-white hover:bg-orange-700 shadow-lg shadow-orange-500/25'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.badge && (
                        <Badge 
                          variant="secondary" 
                          className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs flex items-center justify-center min-w-4 bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-slate-900 dark:bg-slate-50">
                  <div className="text-xs">
                    <p className="font-medium text-white dark:text-slate-900">{item.label}</p>
                    <p className="text-slate-300 dark:text-slate-600">{item.description}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </div>

      {/* Bottom Navigation */}
      <div className="border-t border-slate-200/50 dark:border-slate-700/50 p-1 space-y-1">
        <TooltipProvider>
          {bottomItems.map((item) => {
            const isActive = isActiveRoute(item.href);
            
            return (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <Link href={item.href}>
                    <Button
                      variant={isActive ? 'default' : 'ghost'}
                      size="sm"
                      className={cn(
                        'w-10 h-10 p-0',
                        isActive
                          ? 'bg-orange-600 text-white hover:bg-orange-700 shadow-lg shadow-orange-500/25'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-slate-900 dark:bg-slate-50">
                  <div className="text-xs">
                    <p className="font-medium text-white dark:text-slate-900">{item.label}</p>
                    <p className="text-slate-300 dark:text-slate-600">{item.description}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </div>
    </aside>
  );
}