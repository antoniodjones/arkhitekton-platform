import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Home, Settings } from 'lucide-react';

interface GovernanceHeaderProps {
  moduleTitle: string;
  moduleIcon: React.ComponentType<{ className?: string }>;
}

export function GovernanceHeader({ moduleTitle, moduleIcon: ModuleIcon }: GovernanceHeaderProps) {
  return (
    <header className="bg-slate-900 dark:bg-slate-900 border-b border-slate-700/50">
      <div className="px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Left Section - ARKHITEKTON Branding + Module Info */}
          <div className="flex items-center space-x-6">
            {/* ARKHITEKTON Logo */}
            <Link href="/">
              <div className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <div>
                  <div className="text-white font-bold text-lg tracking-tight">ARKHITEKTON</div>
                  <div className="text-slate-400 text-xs font-medium tracking-wide">GOVERNANCE</div>
                </div>
              </div>
            </Link>
            
            {/* Module Info */}
            <div className="flex items-center space-x-3 pl-6 border-l border-slate-700">
              <div className="w-6 h-6 text-slate-300">
                <ModuleIcon className="w-6 h-6" />
              </div>
              <span className="text-slate-200 font-medium text-sm tracking-wide uppercase">{moduleTitle}</span>
            </div>
          </div>

          {/* Right Section - Navigation */}
          <div className="flex items-center space-x-3">
            <Link href="/">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-slate-300 hover:text-white hover:bg-slate-800 border-0"
              >
                <Home className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-slate-300 hover:text-white hover:bg-slate-800 border-0 px-2"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}