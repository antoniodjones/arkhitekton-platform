import React from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Inbox, 
  Columns3, 
  List, 
  Map,
  Plus,
  Settings,
  Zap,
  Bug
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';

interface Sprint {
  id: string;
  name: string;
  status: string;
  committedPoints: number;
  completedPoints: number;
  teamVelocity: number;
}

const tabs = [
  { 
    id: 'dashboard', 
    label: 'Dashboard', 
    path: '/plan/dashboard', 
    icon: LayoutDashboard,
    description: 'Sprint overview & metrics'
  },
  { 
    id: 'backlog', 
    label: 'Backlog', 
    path: '/plan/backlog', 
    icon: Inbox,
    description: 'Sprint planning'
  },
  { 
    id: 'board', 
    label: 'Board', 
    path: '/plan/board', 
    icon: Columns3,
    description: 'Kanban view'
  },
  { 
    id: 'stories', 
    label: 'Stories', 
    path: '/plan/stories', 
    icon: List,
    description: 'All user stories'
  },
  { 
    id: 'quality', 
    label: 'Quality', 
    path: '/quality/dashboard', 
    icon: Bug,
    description: 'Defects & QA',
    external: true // Links to Quality Center
  },
  { 
    id: 'roadmap', 
    label: 'Roadmap', 
    path: '/plan/roadmap', 
    icon: Map,
    description: 'Epic timeline',
    disabled: true // Coming soon
  },
];

interface PlanLayoutProps {
  children: React.ReactNode;
}

export function PlanLayout({ children }: PlanLayoutProps) {
  const [location] = useLocation();
  
  // Fetch active sprint for header display
  const { data: activeSprint } = useQuery<Sprint>({
    queryKey: ['/api/sprints/active'],
    retry: false,
  });

  // Determine active tab
  const activeTab = tabs.find(tab => location.startsWith(tab.path))?.id || 'dashboard';

  return (
    <div className="flex flex-col h-full">
      {/* Plan Header */}
      <div className="border-b bg-white dark:bg-gray-900 sticky top-0 z-20">
        {/* Top Bar with Sprint Info */}
        <div className="px-6 py-3 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Development Plan
              </h1>
              
              {/* Active Sprint Badge */}
              {activeSprint && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 rounded-full">
                  <Zap className="w-4 h-4 text-indigo-500" />
                  <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                    {activeSprint.name}
                  </span>
                  <span className="text-xs text-indigo-500 dark:text-indigo-400">
                    {activeSprint.completedPoints}/{activeSprint.committedPoints} pts
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                <Plus className="w-4 h-4 mr-2" />
                New Story
              </Button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="px-6">
          <div className="flex gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const isDisabled = tab.disabled;

              return (
                <Link key={tab.id} href={isDisabled ? '#' : tab.path}>
                  <button
                    className={cn(
                      "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all relative",
                      "hover:text-gray-900 dark:hover:text-white",
                      isActive 
                        ? "text-indigo-600 dark:text-indigo-400" 
                        : "text-gray-500 dark:text-gray-400",
                      isDisabled && "opacity-50 cursor-not-allowed"
                    )}
                    disabled={isDisabled}
                    title={tab.description}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                    {isDisabled && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-gray-500">
                        Soon
                      </span>
                    )}
                    
                    {/* Active Indicator */}
                    {isActive && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-t-full" />
                    )}
                  </button>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Page Content */}
      <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-950">
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

