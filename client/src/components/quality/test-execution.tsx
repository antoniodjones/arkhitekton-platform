import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  MinusCircle,
  Clock,
  ChevronRight,
  ChevronDown,
  Bug,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import type { TestResult, TestCase } from '@shared/schema';

interface TestRunDetails {
  id: string;
  suiteId: string;
  name: string;
  status: string;
  environment: string | null;
  startedAt: Date | null;
  results: TestResult[];
  summary: {
    total: number;
    passed: number;
    failed: number;
    blocked: number;
    skipped: number;
    notRun: number;
  };
}

interface TestExecutionProps {
  runId: string;
}

export function TestExecution({ runId }: TestExecutionProps) {
  const [expandedResults, setExpandedResults] = useState<Set<string>>(new Set());
  const [isCreateDefectOpen, setIsCreateDefectOpen] = useState(false);
  const [selectedFailedResult, setSelectedFailedResult] = useState<TestResult | null>(null);
  const [newDefect, setNewDefect] = useState({ title: '', description: '', severity: 'medium' });

  const queryClient = useQueryClient();

  // Fetch run details with results
  const { data: runDetails } = useQuery<TestRunDetails>({
    queryKey: [`/api/test-runs/${runId}`],
  });

  // Fetch test cases for details
  const { data: testCases = [] } = useQuery<TestCase[]>({
    queryKey: ['/api/test-cases', { suiteId: runDetails?.suiteId }],
    enabled: !!runDetails?.suiteId,
  });

  // Update test result mutation
  const updateResultMutation = useMutation({
    mutationFn: async ({ resultId, status, notes }: { resultId: string; status: string; notes?: string }) => {
      const res = await fetch(`/api/test-results/${resultId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes, executedBy: 'Current User' }),
      });
      if (!res.ok) throw new Error('Failed to update test result');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/test-runs/${runId}`] });
    },
  });

  // Complete test run mutation
  const completeRunMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/test-runs/${runId}/complete`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to complete test run');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/test-runs/${runId}`] });
      queryClient.invalidateQueries({ queryKey: ['/api/test-runs'] });
    },
  });

  // Create defect mutation
  const createDefectMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch('/api/defects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create defect');
      const defect = await res.json();
      
      // Link defect to test result
      if (selectedFailedResult) {
        await fetch(`/api/test-results/${selectedFailedResult.id}/defects/${defect.id}`, {
          method: 'POST',
        });
      }
      
      return defect;
    },
    onSuccess: () => {
      setIsCreateDefectOpen(false);
      setSelectedFailedResult(null);
      setNewDefect({ title: '', description: '', severity: 'medium' });
    },
  });

  const toggleExpanded = (resultId: string) => {
    const newExpanded = new Set(expandedResults);
    if (newExpanded.has(resultId)) {
      newExpanded.delete(resultId);
    } else {
      newExpanded.add(resultId);
    }
    setExpandedResults(newExpanded);
  };

  const handleStatusChange = (resultId: string, status: string) => {
    updateResultMutation.mutate({ resultId, status });
  };

  const handleCreateDefect = (result: TestResult) => {
    const testCase = testCases.find(tc => tc.id === result.caseId);
    setSelectedFailedResult(result);
    setNewDefect({
      title: `Failed Test: ${testCase?.title || result.caseId}`,
      description: `Test case ${result.caseId} failed in test run ${runDetails?.name}\n\nNotes: ${result.notes || 'None'}`,
      severity: 'medium',
    });
    setIsCreateDefectOpen(true);
  };

  const handleCompleteRun = () => {
    const hasNotRun = runDetails?.summary.notRun || 0;
    if (hasNotRun > 0) {
      if (!confirm(`${hasNotRun} test(s) are still not executed. Complete anyway?`)) {
        return;
      }
    }
    completeRunMutation.mutate();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'blocked': return <AlertCircle className="w-4 h-4 text-orange-600" />;
      case 'skipped': return <MinusCircle className="w-4 h-4 text-gray-600" />;
      case 'not-run': return <Clock className="w-4 h-4 text-gray-400" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'failed': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'blocked': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      case 'skipped': return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
      case 'not-run': return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  if (!runDetails) {
    return <div className="p-8 text-center text-muted-foreground">Loading test run...</div>;
  }

  const { summary } = runDetails;
  const progressPercent = summary.total > 0 
    ? Math.round(((summary.total - summary.notRun) / summary.total) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Summary Header */}
      <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Test Execution Progress</h3>
          <Badge variant="outline" className={cn(getStatusColor(runDetails.status))}>
            {runDetails.status}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Executed</span>
            <span className="font-medium">{summary.total - summary.notRun} / {summary.total}</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>

        <div className="grid grid-cols-5 gap-2 text-center text-xs">
          <div className="p-2 bg-green-50 dark:bg-green-950/20 rounded">
            <div className="font-semibold text-green-700 dark:text-green-400">{summary.passed}</div>
            <div className="text-muted-foreground">Passed</div>
          </div>
          <div className="p-2 bg-red-50 dark:bg-red-950/20 rounded">
            <div className="font-semibold text-red-700 dark:text-red-400">{summary.failed}</div>
            <div className="text-muted-foreground">Failed</div>
          </div>
          <div className="p-2 bg-orange-50 dark:bg-orange-950/20 rounded">
            <div className="font-semibold text-orange-700 dark:text-orange-400">{summary.blocked}</div>
            <div className="text-muted-foreground">Blocked</div>
          </div>
          <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded">
            <div className="font-semibold text-gray-700 dark:text-gray-400">{summary.skipped}</div>
            <div className="text-muted-foreground">Skipped</div>
          </div>
          <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded">
            <div className="font-semibold text-gray-700 dark:text-gray-400">{summary.notRun}</div>
            <div className="text-muted-foreground">Not Run</div>
          </div>
        </div>

        {runDetails.status === 'in-progress' && (
          <Button 
            onClick={handleCompleteRun}
            disabled={completeRunMutation.isPending}
            className="w-full"
          >
            {completeRunMutation.isPending ? 'Completing...' : 'Complete Test Run'}
          </Button>
        )}
      </div>

      {/* Test Results List */}
      <div className="space-y-2">
        {runDetails.results.map((result) => {
          const testCase = testCases.find(tc => tc.id === result.caseId);
          const isExpanded = expandedResults.has(result.id);

          return (
            <div key={result.id} className="border rounded-lg overflow-hidden">
              {/* Result Header */}
              <div className="p-3 flex items-center gap-3 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <button
                  onClick={() => toggleExpanded(result.id)}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                >
                  {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>

                {getStatusIcon(result.status)}

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-muted-foreground">{result.caseId}</span>
                    <span className="text-sm font-medium">{testCase?.title || 'Unknown Test'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {result.status === 'failed' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCreateDefect(result);
                      }}
                    >
                      <Bug className="w-4 h-4 text-red-600 mr-1" />
                      Report Bug
                    </Button>
                  )}
                  <Select 
                    value={result.status} 
                    onValueChange={(v) => handleStatusChange(result.id, v)}
                    disabled={runDetails.status === 'completed'}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="not-run">Not Run</SelectItem>
                      <SelectItem value="passed">Passed</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="blocked">Blocked</SelectItem>
                      <SelectItem value="skipped">Skipped</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && testCase && (
                <div className="p-4 border-t bg-gray-50 dark:bg-gray-900/50 space-y-3">
                  {testCase.preconditions && (
                    <div>
                      <Label className="text-xs font-semibold text-muted-foreground">Preconditions</Label>
                      <p className="text-sm mt-1">{testCase.preconditions}</p>
                    </div>
                  )}

                  <div>
                    <Label className="text-xs font-semibold text-muted-foreground">Test Steps</Label>
                    <div className="mt-2 space-y-2">
                      {testCase.steps.map((step, idx) => (
                        <div key={idx} className="p-2 bg-white dark:bg-gray-900 rounded text-sm">
                          <div className="font-medium">
                            <span className="text-muted-foreground mr-2">{idx + 1}.</span>
                            {step.step}
                          </div>
                          <div className="text-xs text-green-700 dark:text-green-400 mt-1 ml-6">
                            ✓ Expected: {step.expected}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {runDetails.status === 'in-progress' && (
                    <div>
                      <Label className="text-xs font-semibold text-muted-foreground">Notes</Label>
                      <Textarea
                        placeholder="Add notes about the test execution..."
                        rows={2}
                        className="mt-1"
                        defaultValue={result.notes || ''}
                        onBlur={(e) => {
                          if (e.target.value !== result.notes) {
                            updateResultMutation.mutate({ 
                              resultId: result.id, 
                              status: result.status, 
                              notes: e.target.value 
                            });
                          }
                        }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Create Defect Dialog */}
      <Dialog open={isCreateDefectOpen} onOpenChange={setIsCreateDefectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bug className="w-5 h-5 text-red-500" />
              Report Bug from Failed Test
            </DialogTitle>
            <DialogDescription>
              Create a defect linked to this failed test result
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="defect-title">Title *</Label>
              <Input
                id="defect-title"
                value={newDefect.title}
                onChange={(e) => setNewDefect({ ...newDefect, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="defect-description">Description</Label>
              <Textarea
                id="defect-description"
                value={newDefect.description}
                onChange={(e) => setNewDefect({ ...newDefect, description: e.target.value })}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>Severity</Label>
              <Select 
                value={newDefect.severity} 
                onValueChange={(v: any) => setNewDefect({ ...newDefect, severity: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDefectOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={() => createDefectMutation.mutate({
                ...newDefect,
                userStoryId: 'US-UNKNOWN', // Will need to get from test case linkage
                type: 'bug',
                status: 'open',
              })}
              disabled={!newDefect.title || createDefectMutation.isPending}
            >
              {createDefectMutation.isPending ? 'Creating...' : 'Create Defect'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

