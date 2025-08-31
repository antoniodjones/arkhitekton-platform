import { ReactNode } from 'react';
import { MainSidebar } from '@/components/navigation/main-sidebar';

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
      <MainSidebar />
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}