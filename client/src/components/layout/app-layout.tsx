import { ReactNode } from 'react';
import { CompactSidebar } from '@/components/navigation/compact-sidebar';

interface AppLayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
}

export function AppLayout({ children, showSidebar = true }: AppLayoutProps) {
  if (!showSidebar) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <CompactSidebar />
      <main className="flex-1 overflow-hidden min-w-0">
        {children}
      </main>
    </div>
  );
}