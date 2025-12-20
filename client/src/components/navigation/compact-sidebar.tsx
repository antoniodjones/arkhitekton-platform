import { Link, useLocation } from 'wouter';
import { useState, useRef, useCallback } from 'react';
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
  GitBranch,
  GripVertical,
  Cloud,
  Presentation,
  Palette,
  Plug,
  Bug
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
    description: 'Applications, initiatives, and dependencies'
  },
  {
    id: 'studio',
    label: 'Design Studio',
    href: '/studio',
    icon: Palette,
    description: 'Unified modeling and design workspace'
  },
  {
    id: 'cloud-icons',
    label: 'Cloud Icons',
    href: '/cloud-icons',
    icon: Cloud,
    description: 'Cloud architecture icons for AWS, Azure, GCP, and IBM'
  },
  {
    id: 'drawio-poc',
    label: 'Draw.io POC',
    href: '/drawio-poc',
    icon: Palette,
    description: 'Draw.io integration proof of concept with ARKHITEKTON branding'
  },
  {
    id: 'design-options',
    label: 'Design Options',
    href: '/design-options',
    icon: Wrench,
    description: 'Review ARKHITEKTON design decisions (ARKDD)'
  },
  {
    id: 'architecture-showcase',
    label: 'Cloud Architecture',
    href: '/arkhitekton-architecture',
    icon: Cloud,
    description: 'Enterprise cloud deployment architectures'
  },
  {
    id: 'systems-integration',
    label: 'Systems Integration',
    href: '/arkhitekton-systems-integration',
    icon: Plug,
    description: 'Enterprise systems integration architecture'
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
    label: 'Plan',
    href: '/plan',
    icon: GitBranch,
    description: 'Development roadmap and task tracking'
  },
  {
    id: 'quality',
    label: 'Quality Center',
    href: '/quality/dashboard',
    icon: Bug,
    description: 'Defect tracking and quality management'
  },
  {
    id: 'pitch-deck',
    label: 'VC Pitch Deck',
    href: '/pitch-deck',
    icon: Presentation,
    description: 'Investor presentation & platform overview',
    badge: 'New'
  },
  {
    id: 'wiki',
    label: 'Knowledge Core',
    href: '/wiki-v2',
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
  const [sidebarWidth, setSidebarWidth] = useState(48); // Start at 48px (3rem)
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);
  
  const minWidth = 48; // 3rem minimum
  const maxWidth = 320; // 20rem maximum
  
  const startResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      if (sidebarRef.current) {
        const newWidth = Math.min(Math.max(e.clientX, minWidth), maxWidth);
        setSidebarWidth(newWidth);
      }
    };
    
    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, []);
  
  const showLabels = sidebarWidth > 80; // Show labels when width > 80px

  const isActiveRoute = (href: string) => {
    if (href === '/') {
      return location === '/';
    }
    return location.startsWith(href);
  };

  return (
    <aside 
      ref={sidebarRef}
      className="h-screen bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-r border-slate-200/50 dark:border-slate-700/50 flex shadow-xl relative"
      style={{ width: `${sidebarWidth}px` }}
    >
      {/* Main sidebar content */}
      <div className="flex flex-col flex-1">
        {/* Header - Matches dashboard header height */}
        <div className={cn(
          "flex items-center border-b border-slate-200/50 dark:border-slate-700/50 px-2 py-4",
          showLabels ? "justify-start" : "justify-center"
        )}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center cursor-pointer">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 via-orange-400 to-amber-500 flex-shrink-0 shadow-lg shadow-orange-500/25">
                    <div className="w-5 h-5 bg-white/90 rounded-lg transform rotate-45" />
                  </div>
                  {showLabels && (
                    <div className="ml-3 overflow-hidden">
                      <p className="text-base font-bold text-slate-900 dark:text-slate-100 truncate tracking-tight">ARKHITEKTON</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium tracking-wide">MASTER BUILDER</p>
                    </div>
                  )}
                </div>
              </TooltipTrigger>
              {!showLabels && (
                <TooltipContent side="right" className="bg-slate-900 dark:bg-slate-50">
                  <div className="text-xs">
                    <p className="font-semibold text-white dark:text-slate-900">ARKHITEKTON</p>
                    <p className="text-slate-300 dark:text-slate-600">Master Builder</p>
                  </div>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Navigation */}
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
                          'relative flex items-center gap-2 h-10 p-0',
                          showLabels ? 'w-full px-2 justify-start' : 'w-10 justify-center',
                          isActive
                            ? 'bg-orange-600 text-white hover:bg-orange-700 shadow-lg shadow-orange-500/25'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'
                        )}
                      >
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        {showLabels && (
                          <span className="text-sm truncate">{item.label}</span>
                        )}
                        {item.badge && (
                          <Badge 
                            variant="secondary" 
                            className={cn(
                              "h-4 w-4 p-0 text-xs flex items-center justify-center min-w-4 bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
                              showLabels ? "ml-auto" : "absolute -top-1 -right-1"
                            )}
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  {!showLabels && (
                    <TooltipContent side="right" className="bg-slate-900 dark:bg-slate-50">
                      <div className="text-xs">
                        <p className="font-medium text-white dark:text-slate-900">{item.label}</p>
                        <p className="text-slate-300 dark:text-slate-600">{item.description}</p>
                      </div>
                    </TooltipContent>
                  )}
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
                          'flex items-center gap-2 h-10 p-0',
                          showLabels ? 'w-full px-2 justify-start' : 'w-10 justify-center',
                          isActive
                            ? 'bg-orange-600 text-white hover:bg-orange-700 shadow-lg shadow-orange-500/25'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'
                        )}
                      >
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        {showLabels && (
                          <span className="text-sm truncate">{item.label}</span>
                        )}
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  {!showLabels && (
                    <TooltipContent side="right" className="bg-slate-900 dark:bg-slate-50">
                      <div className="text-xs">
                        <p className="font-medium text-white dark:text-slate-900">{item.label}</p>
                        <p className="text-slate-300 dark:text-slate-600">{item.description}</p>
                      </div>
                    </TooltipContent>
                  )}
                </Tooltip>
              );
            })}
          </TooltipProvider>
        </div>
      </div>
      
      {/* Resize Handle */}
      <div 
        className={cn(
          "absolute top-0 right-0 w-1 h-full cursor-col-resize bg-transparent hover:bg-orange-400/50 transition-colors group",
          isResizing && "bg-orange-400/50"
        )}
        onMouseDown={startResize}
      >
        <div className="absolute top-1/2 -translate-y-1/2 right-0 w-3 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <GripVertical className="h-4 w-4 text-slate-400" />
        </div>
      </div>
    </aside>
  );
}