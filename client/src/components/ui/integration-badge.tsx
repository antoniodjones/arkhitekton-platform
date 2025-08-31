import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, RefreshCw, CheckCircle } from 'lucide-react';

interface IntegrationBadgeProps {
  system: string;
  status: 'syncing' | 'synced' | 'available';
  className?: string;
}

export function IntegrationBadge({ system, status, className = '' }: IntegrationBadgeProps) {
  const getStatusIcon = () => {
    switch (status) {
      case 'syncing':
        return <RefreshCw className="h-2 w-2 animate-spin" />;
      case 'synced':
        return <CheckCircle className="h-2 w-2" />;
      case 'available':
        return <ExternalLink className="h-2 w-2" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'syncing':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300';
      case 'synced':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300';
      case 'available':
        return 'bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-300';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'syncing':
        return 'Syncing';
      case 'synced':
        return 'Auto-populated';
      case 'available':
        return 'Available';
    }
  };

  return (
    <Badge variant="outline" className={`text-xs ${getStatusColor()} ${className}`}>
      {getStatusIcon()}
      <span className="ml-1">{system.toUpperCase()}</span>
      <span className="ml-1 opacity-75">({getStatusText()})</span>
    </Badge>
  );
}