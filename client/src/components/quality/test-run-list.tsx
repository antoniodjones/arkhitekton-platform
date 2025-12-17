import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Play, CheckCircle2, XCircle, Clock, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import type { TestRun } from '@shared/schema';

interface TestRunListProps {
  suiteId: string;
  onSelectRun: (run: TestRun) => void;
  selectedRunId?: string;
}

export function TestRunList({ suiteId, onSelectRun, selectedRunId }: TestRunListProps) {
  const { data: runs = [] } = useQuery<TestRun[]>({
    queryKey: ['/api/test-runs', { suiteId }],
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'in-progress': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'cancelled': return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const getEnvironmentColor = (env: string | null | undefined) => {
    switch (env) {
      case 'production': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'staging': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'local': return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-3">
      {runs.length === 0 ? (
        <div className="p-8 text-center border border-dashed rounded-lg">
          <Play className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
          <p className="text-sm text-muted-foreground">
            No test runs for this suite yet
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Create a test run to start executing tests
          </p>
        </div>
      ) : (
        runs.map((run) => {
          const isSelected = selectedRunId === run.id;
          
          return (
            <div
              key={run.id}
              className={cn(
                "p-4 border rounded-lg cursor-pointer transition-all",
                isSelected 
                  ? "bg-indigo-50 dark:bg-indigo-950/30 border-indigo-300 dark:border-indigo-800"
                  : "hover:bg-gray-50 dark:hover:bg-gray-900"
              )}
              onClick={() => onSelectRun(run)}
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{run.name}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      ID: <span className="font-mono">{run.id}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={cn('text-xs', getStatusColor(run.status))}>
                      {run.status}
                    </Badge>
                    <Badge variant="outline" className={cn('text-xs', getEnvironmentColor(run.environment))}>
                      {run.environment || 'staging'}
                    </Badge>
                  </div>
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Started: {run.startedAt ? format(new Date(run.startedAt), 'MMM d, h:mm a') : '—'}
                  </div>
                  {run.assignedTo && (
                    <div>
                      Assigned: {run.assignedTo}
                    </div>
                  )}
                </div>

                {/* Quick Stats - Will be populated when we fetch run details */}
                <div className="text-xs text-muted-foreground">
                  Click to view results
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

