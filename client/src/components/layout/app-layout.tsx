import { ReactNode, useState } from 'react';
import { CompactSidebar } from '@/components/navigation/compact-sidebar';
import { GlobalSearchModal } from '@/components/search/global-search-modal';
import { useSearchShortcut } from '@/hooks/use-search-shortcut';

interface AppLayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
}

export function AppLayout({ children, showSidebar = true }: AppLayoutProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  // Register global keyboard shortcut (CMD+K / CTRL+K)
  // Implements US-SEARCH-006, Fixes DEF-SEARCH-001
  useSearchShortcut({
    onOpen: () => setSearchOpen(true),
    onClose: () => setSearchOpen(false),
    enabled: true,
  });

  if (!showSidebar) {
    return (
      <>
        {children}
        <GlobalSearchModal open={searchOpen} onOpenChange={setSearchOpen} />
      </>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <CompactSidebar />
      <main className="flex-1 overflow-y-auto min-w-0">
        {children}
      </main>
      <GlobalSearchModal open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  );
}