import { Link } from 'wouter';
import { Badge } from '@/components/ui/badge';
import { getEntityTypeInfo, getStatusColor, type SearchResult } from '@/hooks/use-global-search';
import { cn } from '@/lib/utils';

interface SearchResultCardProps {
  result: SearchResult;
  onClick?: () => void;
  className?: string;
  highlighted?: boolean;
}

export function SearchResultCard({ result, onClick, className, highlighted }: SearchResultCardProps) {
  const typeInfo = getEntityTypeInfo(result.entityType);
  const statusColor = getStatusColor(result.status);

  const handleClick = (e: React.MouseEvent) => {
    // Allow Cmd/Ctrl+Click to open in new tab
    if (e.metaKey || e.ctrlKey) {
      return;
    }
    
    e.preventDefault();
    onClick?.();
    window.location.href = result.url;
  };

  return (
    <Link href={result.url}>
      <a
        onClick={handleClick}
        className={cn(
          'block p-3 rounded-lg border transition-all duration-200',
          'hover:bg-accent hover:border-accent-foreground/20 hover:shadow-md',
          'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
          highlighted && 'bg-accent border-accent-foreground/20',
          className
        )}
      >
        <div className="flex items-start gap-3">
          {/* Entity Icon */}
          <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-muted rounded-lg text-lg">
            {typeInfo.icon}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Title and ID */}
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium text-sm text-foreground truncate">
                {result.title}
              </h4>
              {result.id && (
                <span className="text-xs text-muted-foreground font-mono flex-shrink-0">
                  {result.id}
                </span>
              )}
            </div>

            {/* Description */}
            {result.description && (
              <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                {result.description}
              </p>
            )}

            {/* Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="text-xs">
                {typeInfo.label}
              </Badge>
              <Badge variant="secondary" className={cn('text-xs', statusColor)}>
                {result.status}
              </Badge>
              {result.metadata?.priority && (
                <Badge variant="outline" className="text-xs capitalize">
                  {result.metadata.priority}
                </Badge>
              )}
              {result.score !== undefined && result.score > 0 && (
                <span className="text-xs text-muted-foreground ml-auto">
                  Score: {result.score.toFixed(0)}
                </span>
              )}
            </div>
          </div>
        </div>
      </a>
    </Link>
  );
}

export function SearchResultSkeleton() {
  return (
    <div className="p-3 rounded-lg border border-border">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-8 h-8 bg-muted rounded-lg animate-pulse" />
        <div className="flex-1 min-w-0 space-y-2">
          <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
          <div className="h-3 bg-muted rounded animate-pulse w-full" />
          <div className="flex gap-2">
            <div className="h-5 w-16 bg-muted rounded animate-pulse" />
            <div className="h-5 w-16 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

