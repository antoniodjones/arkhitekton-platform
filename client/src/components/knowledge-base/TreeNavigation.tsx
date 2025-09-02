import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Folder, 
  FolderOpen, 
  FileText, 
  Plus, 
  Search, 
  ChevronRight, 
  ChevronDown,
  MoreHorizontal,
  Edit,
  Trash2,
  Move,
  Copy,
  Type
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { KnowledgeBasePage } from '@shared/schema';
import { cn } from '@/lib/utils';

interface TreeNavigationProps {
  onPageSelect?: (page: KnowledgeBasePage) => void;
  selectedPageId?: string;
  isCreatingNewPage?: boolean;
  className?: string;
}

interface TreeNode extends KnowledgeBasePage {
  children?: TreeNode[];
}

export function TreeNavigation({ onPageSelect, selectedPageId, isCreatingNewPage, className }: TreeNavigationProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const queryClient = useQueryClient();

  // Action handlers
  const handleRename = (page: KnowledgeBasePage) => {
    const newTitle = prompt('Enter new page title:', page.title);
    if (newTitle && newTitle !== page.title) {
      // TODO: Implement rename API call
      console.log('Rename page:', page.id, 'to:', newTitle);
    }
  };

  const handleCopyLink = (page: KnowledgeBasePage) => {
    const url = `${window.location.origin}/wiki/${page.slug || page.id}`;
    navigator.clipboard.writeText(url).then(() => {
      // TODO: Show toast notification
      console.log('Link copied to clipboard:', url);
    });
  };

  const handleMove = (page: KnowledgeBasePage) => {
    // TODO: Implement move dialog/functionality
    console.log('Move page:', page.id);
  };

  const handleDelete = (page: KnowledgeBasePage) => {
    if (confirm(`Are you sure you want to delete "${page.title}"?`)) {
      // TODO: Implement delete API call
      console.log('Delete page:', page.id);
    }
  };

  // Fetch all pages
  const { data: pages = [], isLoading } = useQuery<KnowledgeBasePage[]>({
    queryKey: ['/api/knowledge-base/pages'],
  });

  // Build tree structure from flat array
  const buildTree = (pages: KnowledgeBasePage[]): TreeNode[] => {
    const pageMap = new Map<string, TreeNode>();
    const rootNodes: TreeNode[] = [];

    // First pass: create all nodes
    pages.forEach(page => {
      pageMap.set(page.id, { ...page, children: [] });
    });

    // Second pass: build hierarchy
    pages.forEach(page => {
      const node = pageMap.get(page.id)!;
      if (!page.parentPageId) {
        rootNodes.push(node);
      } else {
        const parent = pageMap.get(page.parentPageId);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(node);
        } else {
          // Parent not found, treat as root
          rootNodes.push(node);
        }
      }
    });

    // Sort nodes by order
    const sortNodes = (nodes: TreeNode[]) => {
      nodes.sort((a, b) => (a.order || 0) - (b.order || 0));
      nodes.forEach(node => {
        if (node.children) {
          sortNodes(node.children);
        }
      });
    };

    sortNodes(rootNodes);
    return rootNodes;
  };

  // Filter pages based on search
  const filteredPages = searchQuery.trim()
    ? pages.filter(page => 
        page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (page.tags || []).some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : pages;

  const treeData = buildTree(filteredPages);

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const renderTreeNode = (node: TreeNode, depth: number = 0): React.ReactNode => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedFolders.has(node.id);
    const isSelected = selectedPageId === node.id;

    const handleNodeClick = () => {
      if (hasChildren) {
        toggleFolder(node.id);
      }
      onPageSelect?.(node);
    };

    const getStatusColor = (status: string) => {
      switch (status) {
        case 'published': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
        case 'draft': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
        case 'under_review': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400';
        default: return 'bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-400';
      }
    };

    return (
      <div key={node.id} className="relative">
        <div
          className={cn(
            "group flex items-center space-x-2 py-2 px-3 rounded-lg cursor-pointer transition-all duration-200",
            "hover:bg-orange-50 dark:hover:bg-orange-900/10",
            isSelected && "bg-orange-100 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800",
            depth > 0 && "ml-4"
          )}
          style={{ paddingLeft: `${12 + depth * 20}px` }}
          onClick={handleNodeClick}
          data-testid={`tree-node-${node.slug}`}
        >
          {/* Expand/Collapse Icon */}
          <div className="w-4 h-4 flex items-center justify-center">
            {hasChildren ? (
              isExpanded ? (
                <ChevronDown className="h-3 w-3 text-slate-600 dark:text-slate-400" />
              ) : (
                <ChevronRight className="h-3 w-3 text-slate-600 dark:text-slate-400" />
              )
            ) : null}
          </div>

          {/* Folder/File Icon */}
          <div className="w-4 h-4 flex items-center justify-center">
            {hasChildren ? (
              isExpanded ? (
                <FolderOpen className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              ) : (
                <Folder className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              )
            ) : (
              <FileText className="h-4 w-4 text-slate-600 dark:text-slate-400" />
            )}
          </div>

          {/* Page Title */}
          <span 
            className={cn(
              "flex-1 text-sm font-medium truncate",
              isSelected 
                ? "text-orange-900 dark:text-orange-100" 
                : "text-slate-700 dark:text-slate-200"
            )}
          >
            {node.title}
          </span>

          {/* Status Badge */}
          <Badge 
            variant="outline" 
            className={cn("text-xs px-1.5 py-0.5", getStatusColor(node.status || 'Draft'))}
          >
            {node.status === 'under_review' ? 'Review' : node.status}
          </Badge>

          {/* Actions Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0 opacity-60 hover:opacity-100 transition-opacity hover:bg-orange-200 dark:hover:bg-orange-800"
                onClick={(e) => e.stopPropagation()}
                data-testid={`tree-node-menu-${node.slug || node.id}`}
              >
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem 
                className="text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  onPageSelect?.(node);
                }}
                data-testid="menu-edit"
              >
                <Edit className="h-3 w-3 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRename(node);
                }}
                data-testid="menu-rename"
              >
                <Type className="h-3 w-3 mr-2" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopyLink(node);
                }}
                data-testid="menu-copy-link"
              >
                <Copy className="h-3 w-3 mr-2" />
                Copy link
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  handleMove(node);
                }}
                data-testid="menu-move"
              >
                <Move className="h-3 w-3 mr-2" />
                Move
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-xs text-red-600 dark:text-red-400"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(node);
                }}
                data-testid="menu-delete"
              >
                <Trash2 className="h-3 w-3 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Render Children */}
        {hasChildren && isExpanded && (
          <div className="ml-2">
            {node.children?.map(child => renderTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className={cn("flex items-center justify-center py-8", className)}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Search Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search pages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 text-sm bg-white dark:bg-slate-800"
            data-testid="input-search-pages"
          />
        </div>
        
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-slate-600 dark:text-slate-400">
            {pages.length} pages
          </span>
          <Button 
            size="sm" 
            variant="outline"
            className="h-7 px-2 text-xs bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0"
            data-testid="button-create-page"
          >
            <Plus className="h-3 w-3 mr-1" />
            New Page
          </Button>
        </div>
      </div>

      {/* Tree Content */}
      <ScrollArea className="flex-1 p-2">
        <div className="space-y-1 group">
          {treeData.length > 0 ? (
            treeData.map(node => renderTreeNode(node))
          ) : (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
              <FileText className="h-12 w-12 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
              <p className="text-sm font-medium">No pages found</p>
              <p className="text-xs mt-1">
                {searchQuery ? 'Try adjusting your search' : 'Create your first page to get started'}
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}