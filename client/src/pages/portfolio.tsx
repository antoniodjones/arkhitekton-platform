import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building,
  Package,
  Briefcase,
  GitBranch
} from 'lucide-react';
import { AppLayout } from '@/components/layout/app-layout';
import { GovernanceHeader } from '@/components/layout/governance-header';
import { ApplicationsTab } from '@/components/portfolio/applications-tab';
import { InitiativesTab } from '@/components/portfolio/initiatives-tab';
import { DependenciesTab } from '@/components/portfolio/dependencies-tab';

type TabValue = 'applications' | 'initiatives' | 'dependencies';

function PortfolioContent() {
  const [location, setLocation] = useLocation();
  
  // Parse tab from URL query param
  const getInitialTab = (): TabValue => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab === 'applications' || tab === 'initiatives' || tab === 'dependencies') {
      return tab;
    }
    return 'initiatives'; // Default to initiatives (analytical view)
  };

  const [activeTab, setActiveTab] = useState<TabValue>(getInitialTab);

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    const tab = value as TabValue;
    setActiveTab(tab);
    const newUrl = `/portfolio${tab !== 'initiatives' ? `?tab=${tab}` : ''}`;
    window.history.replaceState({}, '', newUrl);
  };

  // Listen for browser back/forward
  useEffect(() => {
    const handlePopState = () => {
      setActiveTab(getInitialTab());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <div className="h-full overflow-hidden flex flex-col">
      <GovernanceHeader 
        moduleTitle="Portfolio Management" 
        moduleIcon={Building} 
      />
      
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
            <TabsList className="grid w-full max-w-lg grid-cols-3 bg-slate-100 dark:bg-slate-800">
              <TabsTrigger value="initiatives" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                <span className="hidden sm:inline">Initiatives</span>
              </TabsTrigger>
              <TabsTrigger value="dependencies" className="flex items-center gap-2">
                <GitBranch className="h-4 w-4" />
                <span className="hidden sm:inline">Dependencies</span>
              </TabsTrigger>
              <TabsTrigger value="applications" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                <span className="hidden sm:inline">Applications</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="initiatives" className="mt-6">
              <InitiativesTab />
            </TabsContent>

            <TabsContent value="dependencies" className="mt-6">
              <DependenciesTab />
            </TabsContent>

            <TabsContent value="applications" className="mt-6">
              <ApplicationsTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export function PortfolioPage() {
  return (
    <AppLayout>
      <PortfolioContent />
    </AppLayout>
  );
}

export default PortfolioPage;
