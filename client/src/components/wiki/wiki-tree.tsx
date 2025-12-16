'use client';

import React, { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ChevronRight,
  ChevronDown,
  File,
  FileText,
  FolderOpen,
  Folder,
  Plus,
  Trash2,
  Copy,
  Edit,
  MoveRight,
  MoreHorizontal,
  FileCode,
  FileQuestion,
  BookOpen,
  Shield,
  Layers,
  Settings
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WikiPage {
  id: string;
  title: string;
  parentId: string | null;
  category: string | null;
  status: string;
  template: string | null;
  sortOrder: number;
  children?: WikiPage[];
}

interface WikiTreeProps {
  onPageSelect?: (page: WikiPage) => void;
  selectedPageId?: string | null;
  onCreatePage?: (parentId?: string) => void;
  onEditPage?: (page: WikiPage) => void;
  onDeletePage?: (page: WikiPage) => void;
  onDuplicatePage?: (page: WikiPage) => void;
}

// Icon mapping based on template or category
const getPageIcon = (page: WikiPage) => {
  if (page.template) {
    switch (page.template) {
      case 'ADR':
        return <FileCode className="h-4 w-4 text-purple-500" />;
      case 'Design':
        return <Layers className="h-4 w-4 text-blue-500" />;
      case 'Requirement':
        return <FileQuestion className="h-4 w-4 text-green-500" />;
      case 'RFC':
        return <BookOpen className="h-4 w-4 text-orange-500" />;
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />;
    }
  }
  
  if (page.category) {
    switch (page.category) {
      case 'Governance':
        return <Shield className="h-4 w-4 text-amber-500" />;
      case 'Architecture':
        return <Layers className="h-4 w-4 text-blue-500" />;
      case 'Standards':
        return <Settings className="h-4 w-4 text-gray-500" />;
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />;
    }
  }
  
  return <File className="h-4 w-4 text-muted-foreground" />;
};

// Tree Item Component
function WikiTreeItem({
  page,
  level = 0,
  selectedPageId,
  onPageSelect,
  onCreatePage,
  onEditPage,
  onDeletePage,
  onDuplicatePage,
}: {
  page: WikiPage;
  level?: number;
  selectedPageId?: string | null;
  onPageSelect?: (page: WikiPage) => void;
  onCreatePage?: (parentId?: string) => void;
  onEditPage?: (page: WikiPage) => void;
  onDeletePage?: (page: WikiPage) => void;
  onDuplicatePage?: (page: WikiPage) => void;
}) {
  const [isOpen, setIsOpen] = useState(level === 0);
  const hasChildren = page.children && page.children.length > 0;
  const isSelected = selectedPageId === page.id;

  return (
    <div>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div
            className={cn(
              'group flex items-center gap-1 py-1.5 px-2 rounded-md cursor-pointer transition-colors',
              'hover:bg-muted/50',
              isSelected && 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
              !isSelected && 'text-muted-foreground hover:text-foreground'
            )}
            style={{ paddingLeft: `${level * 16 + 8}px` }}
            onClick={() => onPageSelect?.(page)}
          >
            {/* Expand/Collapse Toggle */}
            {hasChildren ? (
              <button
                className="h-5 w-5 flex items-center justify-center rounded hover:bg-muted"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(!isOpen);
                }}
              >
                {isOpen ? (
                  <ChevronDown className="h-3.5 w-3.5" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5" />
                )}
              </button>
            ) : (
              <div className="w-5" />
            )}

            {/* Page Icon */}
            {hasChildren ? (
              isOpen ? (
                <FolderOpen className="h-4 w-4 text-amber-500 shrink-0" />
              ) : (
                <Folder className="h-4 w-4 text-amber-500 shrink-0" />
              )
            ) : (
              getPageIcon(page)
            )}

            {/* Page Title */}
            <span className="truncate text-sm flex-1">{page.title}</span>

            {/* Status indicator */}
            {page.status === 'draft' && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                Draft
              </span>
            )}

            {/* Quick Actions (visible on hover) */}
            <div className="hidden group-hover:flex items-center gap-0.5">
              <button
                className="h-5 w-5 flex items-center justify-center rounded hover:bg-muted"
                onClick={(e) => {
                  e.stopPropagation();
                  onCreatePage?.(page.id);
                }}
                title="Add child page"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-48">
          <ContextMenuItem onClick={() => onEditPage?.(page)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Page
          </ContextMenuItem>
          <ContextMenuItem onClick={() => onCreatePage?.(page.id)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Child Page
          </ContextMenuItem>
          <ContextMenuItem onClick={() => onDuplicatePage?.(page)}>
            <Copy className="mr-2 h-4 w-4" />
            Duplicate
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem onClick={() => {}}>
            <MoveRight className="mr-2 h-4 w-4" />
            Move To...
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem
            onClick={() => onDeletePage?.(page)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {/* Children */}
      {hasChildren && isOpen && (
        <div>
          {page.children!.map((child) => (
            <WikiTreeItem
              key={child.id}
              page={child}
              level={level + 1}
              selectedPageId={selectedPageId}
              onPageSelect={onPageSelect}
              onCreatePage={onCreatePage}
              onEditPage={onEditPage}
              onDeletePage={onDeletePage}
              onDuplicatePage={onDuplicatePage}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Build tree structure from flat list
function buildTree(pages: WikiPage[]): WikiPage[] {
  const pageMap = new Map<string, WikiPage>();
  const rootPages: WikiPage[] = [];

  // First pass: create map of all pages
  pages.forEach((page) => {
    pageMap.set(page.id, { ...page, children: [] });
  });

  // Second pass: build tree structure
  pages.forEach((page) => {
    const node = pageMap.get(page.id)!;
    if (page.parentId && pageMap.has(page.parentId)) {
      const parent = pageMap.get(page.parentId)!;
      if (!parent.children) parent.children = [];
      parent.children.push(node);
    } else {
      rootPages.push(node);
    }
  });

  // Sort children by sortOrder
  const sortChildren = (nodes: WikiPage[]) => {
    nodes.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    nodes.forEach((node) => {
      if (node.children && node.children.length > 0) {
        sortChildren(node.children);
      }
    });
  };

  sortChildren(rootPages);
  return rootPages;
}

// Main Tree Component
export function WikiTree({
  onPageSelect,
  selectedPageId,
  onCreatePage,
  onEditPage,
  onDeletePage,
  onDuplicatePage,
}: WikiTreeProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all wiki pages
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/wiki'],
    queryFn: async () => {
      const response = await fetch('/api/wiki');
      if (!response.ok) throw new Error('Failed to fetch wiki pages');
      const result = await response.json();
      return result.data as WikiPage[];
    },
  });

  // Build tree from flat data
  const tree = data ? buildTree(data) : [];

  if (isLoading) {
    return (
      <div className="space-y-2 p-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-2 px-2">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 flex-1 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <p className="text-sm">Failed to load pages</p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/wiki'] })}
          className="mt-2"
        >
          Retry
        </Button>
      </div>
    );
  }

  if (tree.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No pages yet</p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onCreatePage?.()}
          className="mt-2"
        >
          <Plus className="h-4 w-4 mr-1" />
          Create First Page
        </Button>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1">
      <div className="py-2">
        {tree.map((page) => (
          <WikiTreeItem
            key={page.id}
            page={page}
            selectedPageId={selectedPageId}
            onPageSelect={onPageSelect}
            onCreatePage={onCreatePage}
            onEditPage={onEditPage}
            onDeletePage={onDeletePage}
            onDuplicatePage={onDuplicatePage}
          />
        ))}
      </div>
    </ScrollArea>
  );
}

export default WikiTree;

