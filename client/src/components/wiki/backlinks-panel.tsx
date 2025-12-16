'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Link2,
  FileText,
  ExternalLink,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

interface Backlink {
  pageId: string;
  pageTitle: string;
  pageCategory: string | null;
  mentionText: string;
  createdAt: string;
}

interface BacklinksPanelProps {
  entityType: string;
  entityId: string;
  entityTitle?: string;
  className?: string;
}

export function BacklinksPanel({ 
  entityType, 
  entityId, 
  entityTitle,
  className 
}: BacklinksPanelProps) {
  // Fetch backlinks for this entity
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/wiki/backlinks', entityType, entityId],
    queryFn: async () => {
      const response = await fetch(`/api/wiki/backlinks/${entityType}/${entityId}`);
      if (!response.ok) throw new Error('Failed to fetch backlinks');
      const result = await response.json();
      return result.data as Backlink[];
    },
    enabled: !!entityType && !!entityId,
  });

  const backlinks = data || [];

  if (isLoading) {
    return (
      <div className={cn('space-y-2', className)}>
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Link2 className="h-4 w-4" />
          Backlinks
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-2 p-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 flex-1" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn('', className)}>
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
          <Link2 className="h-4 w-4" />
          Backlinks
        </div>
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          Failed to load backlinks
        </div>
      </div>
    );
  }

  if (backlinks.length === 0) {
    return (
      <div className={cn('', className)}>
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
          <Link2 className="h-4 w-4" />
          Backlinks
        </div>
        <p className="text-sm text-muted-foreground">
          No pages link to this {entityType.replace('_', ' ')}.
        </p>
      </div>
    );
  }

  return (
    <div className={cn('', className)}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Link2 className="h-4 w-4 text-amber-500" />
          Backlinks
          <Badge variant="secondary" className="text-xs">
            {backlinks.length}
          </Badge>
        </div>
      </div>

      <ScrollArea className="max-h-[200px]">
        <div className="space-y-1">
          {backlinks.map((backlink, index) => (
            <Link 
              key={`${backlink.pageId}-${index}`}
              href={`/wiki-v2/${backlink.pageId}`}
            >
              <div className="group flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 transition-colors cursor-pointer">
                <FileText className="h-4 w-4 text-muted-foreground group-hover:text-amber-500 transition-colors" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate group-hover:text-amber-600 transition-colors">
                    {backlink.pageTitle}
                  </p>
                  {backlink.pageCategory && (
                    <p className="text-xs text-muted-foreground">
                      {backlink.pageCategory}
                    </p>
                  )}
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

// Compact version for sidebar
export function BacklinksCompact({
  entityType,
  entityId,
  className,
}: Omit<BacklinksPanelProps, 'entityTitle'>) {
  const { data, isLoading } = useQuery({
    queryKey: ['/api/wiki/backlinks', entityType, entityId],
    queryFn: async () => {
      const response = await fetch(`/api/wiki/backlinks/${entityType}/${entityId}`);
      if (!response.ok) throw new Error('Failed to fetch backlinks');
      const result = await response.json();
      return result.data as Backlink[];
    },
    enabled: !!entityType && !!entityId,
  });

  const count = data?.length || 0;

  if (isLoading) {
    return <Skeleton className="h-5 w-16" />;
  }

  if (count === 0) {
    return null;
  }

  return (
    <div className={cn('flex items-center gap-1 text-xs text-muted-foreground', className)}>
      <Link2 className="h-3 w-3" />
      {count} backlink{count !== 1 ? 's' : ''}
    </div>
  );
}

export default BacklinksPanel;

