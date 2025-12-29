import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  MoreHorizontal, 
  Layout, 
  Pin, 
  Copy, 
  Trash2, 
  ExternalLink,
  Edit3 
} from 'lucide-react';
import { 
  getRecencyCategory, 
  getRecencyColorClass, 
  getRecencyLabel, 
  formatRelativeTime 
} from '@/lib/recency-utils';

export interface ModelData {
  id: string | number;
  title: string;
  updatedAt: string;
  author: string;
  type: string;
  isPinned?: boolean;
  thumbnail?: string;
}

interface ModelCardProps {
  model: ModelData;
  view: 'grid' | 'list';
  onClick: (model: ModelData) => void;
  onPin?: (model: ModelData) => void;
  onDuplicate?: (model: ModelData) => void;
  onDelete?: (model: ModelData) => void;
  onOpenInNewTab?: (model: ModelData) => void;
  onRename?: (model: ModelData) => void;
}

/**
 * Model Card Component
 * Implements HLR-DSH-009, HLR-DSH-014, HLR-DSH-024
 * - Card and list view presentation
 * - Recency indicators with color coding
 * - Context menu for quick actions
 * - Pinned state with visual indicator
 */
export function ModelCard({ 
  model, 
  view, 
  onClick, 
  onPin, 
  onDuplicate, 
  onDelete,
  onOpenInNewTab,
  onRename 
}: ModelCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const recency = getRecencyCategory(model.updatedAt);
  const recencyColor = getRecencyColorClass(recency);
  const recencyLabel = getRecencyLabel(recency);
  const relativeTime = formatRelativeTime(model.updatedAt);

  // Get author initials
  const authorInitials = model.author
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  // Determine type color
  const typeColors: Record<string, string> = {
    'System': 'bg-blue-400',
    'Process': 'bg-green-400',
    'Security': 'bg-red-400',
    'Infra': 'bg-purple-400',
    'Product': 'bg-amber-400',
    'Strategy': 'bg-pink-400',
    'Data': 'bg-cyan-400',
  };
  const typeColor = typeColors[model.type] || 'bg-muted-foreground/50';

  // Context menu handler
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMenuOpen(true);
  };

  if (view === 'list') {
    // List View
    return (
      <div
        className={cn(
          'flex items-center gap-4 p-4 bg-card border border-border rounded-xl cursor-pointer',
          'hover:shadow-md hover:border-muted-foreground/30 hover:-translate-y-0.5 transition-all duration-200',
          model.isPinned && 'ring-2 ring-orange-100 border-orange-200'
        )}
        onClick={() => onClick(model)}
        onContextMenu={handleContextMenu}
      >
        {/* Thumbnail */}
        <div className={cn(
          'w-14 h-14 rounded-lg flex items-center justify-center shrink-0 relative overflow-hidden',
          'bg-muted'
        )}>
          <Layout className="w-6 h-6 text-muted-foreground" />
          {model.isPinned && (
            <div className="absolute top-1 right-1">
              <Pin className="w-3 h-3 text-orange-500 fill-orange-500" />
            </div>
          )}
        </div>

        {/* Title & Meta */}
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-foreground truncate">{model.title}</div>
          <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className={cn('w-2 h-2 rounded-full', recencyColor)} title={recencyLabel} />
              {relativeTime}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <span className={cn('w-2 h-2 rounded-full', typeColor)} />
              {model.type}
            </span>
          </div>
        </div>

        {/* Author */}
        <Avatar className="w-7 h-7 ring-2 ring-background border border-border">
          <AvatarFallback className="text-xs bg-muted text-muted-foreground">
            {authorInitials}
          </AvatarFallback>
        </Avatar>

        {/* Actions */}
        <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <DropdownMenuTrigger asChild>
            <button
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => onOpenInNewTab?.(model)}>
              <ExternalLink className="w-4 h-4 mr-2" />
              Open in new tab
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onRename?.(model)}>
              <Edit3 className="w-4 h-4 mr-2" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onPin?.(model)}>
              <Pin className="w-4 h-4 mr-2" />
              {model.isPinned ? 'Unpin' : 'Pin to top'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDuplicate?.(model)}>
              <Copy className="w-4 h-4 mr-2" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-red-600 focus:text-red-600"
              onClick={() => onDelete?.(model)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  // Grid View
  return (
    <div
      className={cn(
        'group cursor-pointer',
        model.isPinned && 'ring-2 ring-orange-200 rounded-2xl'
      )}
      onClick={() => onClick(model)}
      onContextMenu={handleContextMenu}
    >
      <div className={cn(
        'aspect-[16/10] bg-card rounded-2xl shadow-sm border border-border overflow-hidden relative mb-4',
        'group-hover:shadow-xl group-hover:shadow-muted/80 group-hover:-translate-y-1',
        'transition-all duration-300'
      )}>
        {/* Decorative Gradient based on type */}
        <div className={cn(
          'absolute inset-0 opacity-10',
          model.type === 'System' && 'bg-gradient-to-br from-blue-400 to-indigo-600',
          model.type === 'Process' && 'bg-gradient-to-br from-emerald-400 to-teal-600',
          model.type === 'Security' && 'bg-gradient-to-br from-red-400 to-rose-600',
          model.type === 'Infra' && 'bg-gradient-to-br from-purple-400 to-violet-600',
          model.type === 'Product' && 'bg-gradient-to-br from-amber-400 to-orange-600',
          model.type === 'Strategy' && 'bg-gradient-to-br from-pink-400 to-rose-600',
          !['System', 'Process', 'Security', 'Infra', 'Product', 'Strategy'].includes(model.type) && 
            'bg-gradient-to-br from-slate-400 to-slate-600'
        )} />

        {/* Content Mockup */}
        <div className="absolute inset-6 bg-card/80 rounded-lg shadow-sm backdrop-blur-sm border border-border/50 flex items-center justify-center">
          <Layout className="w-12 h-12 text-muted-foreground" />
        </div>

        {/* Pinned Badge */}
        {model.isPinned && (
          <div className="absolute top-3 left-3 z-10">
            <div className="flex items-center gap-1 px-2 py-1 bg-orange-500 rounded-full text-white text-xs font-medium shadow-sm">
              <Pin className="w-3 h-3 fill-current" />
              Pinned
            </div>
          </div>
        )}

        {/* Hover Menu */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <DropdownMenuTrigger asChild>
              <button
                className="w-8 h-8 bg-card/90 backdrop-blur rounded-full flex items-center justify-center shadow-sm hover:bg-card"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onOpenInNewTab?.(model)}>
                <ExternalLink className="w-4 h-4 mr-2" />
                Open in new tab
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onRename?.(model)}>
                <Edit3 className="w-4 h-4 mr-2" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onPin?.(model)}>
                <Pin className="w-4 h-4 mr-2" />
                {model.isPinned ? 'Unpin' : 'Pin to top'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDuplicate?.(model)}>
                <Copy className="w-4 h-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-red-600 focus:text-red-600"
                onClick={() => onDelete?.(model)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Recency Indicator */}
        <div className="absolute bottom-3 left-3 z-10" title={recencyLabel}>
          <div className={cn('w-2.5 h-2.5 rounded-full shadow-sm', recencyColor)} />
        </div>
      </div>

      {/* Meta Info */}
      <div className="flex items-start justify-between px-1">
        <div>
          <div className="font-semibold text-foreground mb-1 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
            {model.title}
          </div>
          <div className="text-xs text-muted-foreground font-medium flex items-center gap-2">
            <span className={cn('w-2 h-2 rounded-full', typeColor)} />
            {model.type} • {relativeTime}
          </div>
        </div>
        <Avatar className="w-6 h-6 border ring-1 ring-background">
          <AvatarFallback className="text-[10px] bg-muted text-muted-foreground">
            {authorInitials}
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}

export default ModelCard;


