'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  GitBranch,
  GitCommit,
  GitPullRequest,
  GitMerge,
  ExternalLink,
  Check,
  Clock,
  XCircle,
  FileCode
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface CodeChange {
  id: string;
  entityType: string;
  entityId: string;
  changeType: 'pull_request' | 'commit' | 'branch';
  provider: string;
  repository: string;
  prNumber?: number;
  prTitle?: string;
  prState?: 'open' | 'closed' | 'merged' | 'draft';
  prUrl?: string;
  prBaseBranch?: string;
  prHeadBranch?: string;
  commitSha?: string;
  commitMessage?: string;
  commitUrl?: string;
  branchName?: string;
  branchUrl?: string;
  authorUsername?: string;
  authorAvatarUrl?: string;
  eventTimestamp: string;
}

interface CodeChangesBadgeProps {
  entityType: 'user_story' | 'defect' | 'epic';
  entityId: string;
  compact?: boolean;
  className?: string;
}

export function CodeChangesBadge({
  entityType,
  entityId,
  compact = false,
  className,
}: CodeChangesBadgeProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['/api/code-changes', entityType, entityId],
    queryFn: async () => {
      const response = await fetch(`/api/code-changes/${entityType}/${entityId}`);
      if (!response.ok) throw new Error('Failed to fetch code changes');
      const result = await response.json();
      return result.data as CodeChange[];
    },
  });

  const changes = data || [];
  const prs = changes.filter(c => c.changeType === 'pull_request');
  const commits = changes.filter(c => c.changeType === 'commit');
  const branches = changes.filter(c => c.changeType === 'branch');

  const mergedPRs = prs.filter(p => p.prState === 'merged');
  const openPRs = prs.filter(p => p.prState === 'open');

  if (isLoading) {
    return <Skeleton className="h-5 w-16" />;
  }

  if (changes.length === 0) {
    return null;
  }

  // Compact mode just shows icons with counts
  if (compact) {
    return (
      <div className={cn('flex items-center gap-1', className)}>
        {prs.length > 0 && (
          <Badge variant="outline" className="text-xs px-1.5 gap-1">
            <GitPullRequest className="h-3 w-3" />
            {prs.length}
          </Badge>
        )}
        {commits.length > 0 && (
          <Badge variant="outline" className="text-xs px-1.5 gap-1">
            <GitCommit className="h-3 w-3" />
            {commits.length}
          </Badge>
        )}
      </div>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            'h-7 gap-1.5 text-xs font-normal',
            mergedPRs.length > 0 && 'border-purple-500/30 text-purple-600',
            openPRs.length > 0 && !mergedPRs.length && 'border-green-500/30 text-green-600',
            className
          )}
        >
          <FileCode className="h-3.5 w-3.5" />
          {prs.length > 0 && (
            <span className="flex items-center gap-0.5">
              <GitPullRequest className="h-3 w-3" />
              {prs.length}
            </span>
          )}
          {commits.length > 0 && (
            <span className="flex items-center gap-0.5">
              <GitCommit className="h-3 w-3" />
              {commits.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="p-3 border-b">
          <h4 className="font-semibold text-sm">Code Changes</h4>
          <p className="text-xs text-muted-foreground">
            {changes.length} change{changes.length !== 1 ? 's' : ''} linked to {entityId}
          </p>
        </div>
        <ScrollArea className="max-h-[300px]">
          <div className="p-2 space-y-1">
            {/* Pull Requests */}
            {prs.length > 0 && (
              <>
                <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
                  Pull Requests
                </div>
                {prs.map((pr) => (
                  <a
                    key={pr.id}
                    href={pr.prUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-2 p-2 rounded-md hover:bg-muted/50 transition-colors group"
                  >
                    <PRStateIcon state={pr.prState} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate group-hover:text-primary">
                        #{pr.prNumber} {pr.prTitle}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {pr.prHeadBranch} → {pr.prBaseBranch}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {pr.authorUsername} • {formatDistanceToNow(new Date(pr.eventTimestamp), { addSuffix: true })}
                      </p>
                    </div>
                    <ExternalLink className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 text-muted-foreground" />
                  </a>
                ))}
              </>
            )}

            {/* Commits */}
            {commits.length > 0 && (
              <>
                {prs.length > 0 && <Separator className="my-2" />}
                <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
                  Commits
                </div>
                {commits.slice(0, 5).map((commit) => (
                  <a
                    key={commit.id}
                    href={commit.commitUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-2 p-2 rounded-md hover:bg-muted/50 transition-colors group"
                  >
                    <GitCommit className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate group-hover:text-primary">
                        {commit.commitMessage}
                      </p>
                      <p className="text-xs text-muted-foreground font-mono">
                        {commit.commitSha?.substring(0, 7)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {commit.authorUsername} • {formatDistanceToNow(new Date(commit.eventTimestamp), { addSuffix: true })}
                      </p>
                    </div>
                    <ExternalLink className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 text-muted-foreground" />
                  </a>
                ))}
                {commits.length > 5 && (
                  <p className="text-xs text-muted-foreground px-2 py-1">
                    +{commits.length - 5} more commits
                  </p>
                )}
              </>
            )}

            {/* Branches */}
            {branches.length > 0 && (
              <>
                {(prs.length > 0 || commits.length > 0) && <Separator className="my-2" />}
                <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
                  Branches
                </div>
                {branches.map((branch) => (
                  <a
                    key={branch.id}
                    href={branch.branchUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 transition-colors group"
                  >
                    <GitBranch className="h-4 w-4 text-cyan-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-mono truncate group-hover:text-primary">
                        {branch.branchName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(branch.eventTimestamp), { addSuffix: true })}
                      </p>
                    </div>
                    <ExternalLink className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 text-muted-foreground" />
                  </a>
                ))}
              </>
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

function PRStateIcon({ state }: { state?: string }) {
  switch (state) {
    case 'merged':
      return <GitMerge className="h-4 w-4 text-purple-500 mt-0.5 shrink-0" />;
    case 'open':
      return <GitPullRequest className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />;
    case 'closed':
      return <XCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />;
    case 'draft':
      return <Clock className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />;
    default:
      return <GitPullRequest className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />;
  }
}

export default CodeChangesBadge;

