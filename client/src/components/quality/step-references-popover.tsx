/**
 * StepReferencesPopover Component - US-QC-IMPL-013
 * Displays where a reproduction step is referenced (commits, test cases, etc.)
 */

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'wouter';
import {
  GitBranch,
  FileText,
  MessageSquare,
  ExternalLink,
  Link2,
} from 'lucide-react';

interface StepReference {
  id: string;
  stepId: string;
  referenceType: string;
  referenceId: string;
  referenceUrl?: string | null;
  referenceText?: string | null;
  createdAt: string;
  codeChange?: {
    prNumber?: number | null;
    commitSha?: string | null;
    branchName?: string | null;
    prState?: string | null;
    authorUsername?: string | null;
  };
  testCase?: {
    id: number;
    title: string;
    suiteId: number;
  };
}

interface StepReferencesPopoverProps {
  stepUuid: string;
  fullStepId: string; // e.g., "DEF-003-S002"
  children: React.ReactNode;
}

function getReferenceIcon(type: string) {
  switch (type) {
    case 'commit':
    case 'pull_request':
      return <GitBranch className="w-3 h-3" />;
    case 'test_case':
      return <FileText className="w-3 h-3" />;
    case 'comment':
      return <MessageSquare className="w-3 h-3" />;
    default:
      return <Link2 className="w-3 h-3" />;
  }
}

function getReferenceLabel(type: string): string {
  switch (type) {
    case 'commit':
      return 'Commit';
    case 'pull_request':
      return 'Pull Request';
    case 'test_case':
      return 'Test Case';
    case 'comment':
      return 'Comment';
    default:
      return 'Reference';
  }
}

function ReferenceItem({ reference }: { reference: StepReference }) {
  const icon = getReferenceIcon(reference.referenceType);
  const label = getReferenceLabel(reference.referenceType);

  if (reference.referenceType === 'commit' || reference.referenceType === 'pull_request') {
    const { codeChange } = reference;
    const displayText = codeChange?.commitSha
      ? `${codeChange.commitSha.substring(0, 7)}`
      : `PR #${codeChange?.prNumber}`;
    const author = codeChange?.authorUsername ? `by @${codeChange.authorUsername}` : '';
    const state = codeChange?.prState ? `(${codeChange.prState})` : '';

    return (
      <div className="flex items-start gap-2 p-2 hover:bg-accent rounded-sm group">
        <div className="flex-shrink-0 mt-0.5">{icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {label}
            </Badge>
            <span className="text-xs font-mono">{displayText}</span>
            {state && <span className="text-xs text-muted-foreground">{state}</span>}
          </div>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {reference.referenceText || 'No description'}
          </p>
          {author && <p className="text-xs text-muted-foreground mt-0.5">{author}</p>}
        </div>
        {reference.referenceUrl && (
          <a
            href={reference.referenceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="w-3 h-3 text-muted-foreground" />
          </a>
        )}
      </div>
    );
  }

  if (reference.referenceType === 'test_case' && reference.testCase) {
    return (
      <Link href={`/quality/test-cases/${reference.testCase.id}`}>
        <a
          className="flex items-start gap-2 p-2 hover:bg-accent rounded-sm group"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex-shrink-0 mt-0.5">{icon}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {label}
              </Badge>
              <span className="text-xs font-medium">TC-{reference.testCase.id}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {reference.testCase.title}
            </p>
          </div>
          <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </a>
      </Link>
    );
  }

  // Generic reference
  return (
    <div className="flex items-start gap-2 p-2 hover:bg-accent rounded-sm">
      <div className="flex-shrink-0 mt-0.5">{icon}</div>
      <div className="flex-1 min-w-0">
        <Badge variant="outline" className="text-xs mb-1">
          {label}
        </Badge>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {reference.referenceText || reference.referenceId}
        </p>
      </div>
    </div>
  );
}

export function StepReferencesPopover({
  stepUuid,
  fullStepId,
  children,
}: StepReferencesPopoverProps) {
  const { data, isLoading } = useQuery<{ data: StepReference[] }>({
    queryKey: [`/api/reproduction-steps/${stepUuid}/references/enriched`],
    queryFn: async () => {
      const response = await fetch(
        `/api/reproduction-steps/${stepUuid}/references/enriched`
      );
      if (!response.ok) throw new Error('Failed to fetch references');
      return response.json();
    },
  });

  const references = data?.data || [];
  const count = references.length;

  if (count === 0) {
    return <>{children}</>;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <span className="cursor-pointer">{children}</span>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="p-3 border-b">
          <h4 className="font-semibold text-sm">Referenced In</h4>
          <p className="text-xs text-muted-foreground mt-1">
            Step {fullStepId} is referenced in {count} place{count !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          {isLoading ? (
            <div className="p-3 space-y-2">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : (
            <div className="p-1">
              {references.map((ref) => (
                <ReferenceItem key={ref.id} reference={ref} />
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

