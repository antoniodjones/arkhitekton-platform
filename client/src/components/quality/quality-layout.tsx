import React from 'react';
import { useLocation, Link } from 'wouter';
import { AppLayout } from '@/components/layout/app-layout';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Bug, 
  TestTube2, 
  FileBarChart,
  Shield
} from 'lucide-react';

interface QualityLayoutProps {
  children: React.ReactNode;
}

const tabs = [
  { id: 'dashboard', label: 'Dashboard', href: '/quality/dashboard', icon: LayoutDashboard },
  { id: 'defects', label: 'Defects', href: '/quality/defects', icon: Bug },
  { id: 'test-plan', label: 'Test Plan', href: '/quality/test-plan', icon: TestTube2 },
  { id: 'reports', label: 'Reports', href: '/quality/reports', icon: FileBarChart },
];

export function QualityLayout({ children }: QualityLayoutProps) {
  const [location] = useLocation();

  const getActiveTab = () => {
    if (location.includes('/quality/defects')) return 'defects';
    if (location.includes('/quality/test-plan')) return 'test-plan';
    if (location.includes('/quality/reports')) return 'reports';
    return 'dashboard';
  };

  const activeTab = getActiveTab();

  return (
    <AppLayout>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20">
          <div className="px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <Shield className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Quality Center
                </h1>
                <p className="text-sm text-muted-foreground">
                  Defect tracking, test management, and quality metrics
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="px-6">
            <nav className="flex gap-1" aria-label="Quality Center Navigation">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                const isDisabled = tab.disabled;

                if (isDisabled) {
                  return (
                    <div
                      key={tab.id}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-muted-foreground/50 cursor-not-allowed"
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                      <span className="text-xs bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded">Soon</span>
                    </div>
                  );
                }

                return (
                  <Link key={tab.id} href={tab.href}>
                    <a
                      className={cn(
                        "flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors border-b-2",
                        isActive
                          ? "bg-white dark:bg-gray-900 text-red-600 dark:text-red-400 border-red-500"
                          : "text-muted-foreground hover:text-foreground hover:bg-white/50 dark:hover:bg-gray-800/50 border-transparent"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </a>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 bg-gray-50 dark:bg-gray-950">
          {children}
        </div>
      </div>
    </AppLayout>
  );
}

