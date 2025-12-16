'use client';

import React from 'react';
import { Link } from 'wouter';
import { ChevronRight, Home, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  id: string;
  title: string;
  path?: string;
}

interface WikiBreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function WikiBreadcrumb({ items, className }: WikiBreadcrumbProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <nav
      className={cn(
        'flex items-center gap-1 text-sm text-muted-foreground',
        className
      )}
      aria-label="Breadcrumb"
    >
      <Link href="/wiki-v2">
        <span className="flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer">
          <Home className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Wiki</span>
        </span>
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={item.id}>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
            {isLast ? (
              <span className="flex items-center gap-1 text-foreground font-medium truncate max-w-[200px]">
                <FileText className="h-3.5 w-3.5 hidden sm:block" />
                {item.title}
              </span>
            ) : (
              <Link href={`/wiki-v2/${item.id}`}>
                <span className="flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer truncate max-w-[150px]">
                  {item.title}
                </span>
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

export default WikiBreadcrumb;

