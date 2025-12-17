import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2, ExternalLink, TestTube2, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TestCase, TestSuite } from '@shared/schema';

interface TestCasesTabProps {
  storyId: string;
}

export function TestCasesTab({ storyId }: TestCasesTabProps) {
  const [selectedSuiteId, setSelectedSuiteId] = useState<string>('');
  const [selectedCaseId, setSelectedCaseId] = useState<string>('');
  const queryClient = useQueryClient();

  // Fetch all test suites
  const { data: suites = [] } = useQuery<TestSuite[]>({
    queryKey: ['/api/test-suites'],
  });

  // Fetch test cases for selected suite
  const { data: availableCases = [] } = useQuery<TestCase[]>({
    queryKey: ['/api/test-cases', { suiteId: selectedSuiteId }],
    enabled: !!selectedSuiteId,
  });

  // Fetch linked test cases for this story
  const { data: linkedCases = [] } = useQuery<TestCase[]>({
    queryKey: ['/api/test-cases', { storyId }],
  });

  // Link test case to story
  const linkMutation = useMutation({
    mutationFn: async ({ testCaseId }: { testCaseId: string }) => {
      const res = await fetch(`/api/test-cases/${testCaseId}/stories/${storyId}`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to link test case');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/test-cases', { storyId }] });
      setSelectedCaseId('');
    },
  });

  // Unlink test case from story
  const unlinkMutation = useMutation({
    mutationFn: async (testCaseId: string) => {
      const res = await fetch(`/api/test-cases/${testCaseId}/stories/${storyId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to unlink test case');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/test-cases', { storyId }] });
    },
  });

  const handleLinkCase = () => {
    if (!selectedCaseId) return;
    linkMutation.mutate({ testCaseId: selectedCaseId });
  };

  const handleUnlink = (testCaseId: string) => {
    if (confirm('Remove this test case link?')) {
      unlinkMutation.mutate(testCaseId);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'high': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      case 'medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'low': return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const getTestTypeColor = (type: string) => {
    switch (type) {
      case 'smoke': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'regression': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'integration': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'e2e': return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  // Filter out already linked cases
  const unlinkedCases = availableCases.filter(
    ac => !linkedCases.some(lc => lc.id === ac.id)
  );

  return (
    <div className="space-y-6">
      {/* Link New Test Case */}
      <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg space-y-3">
        <h4 className="font-semibold text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Link Test Case
        </h4>

        <div className="grid grid-cols-2 gap-3">
          <Select value={selectedSuiteId} onValueChange={setSelectedSuiteId}>
            <SelectTrigger>
              <SelectValue placeholder="Select test suite..." />
            </SelectTrigger>
            <SelectContent>
              {suites.map(suite => (
                <SelectItem key={suite.id} value={suite.id}>
                  {suite.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select 
            value={selectedCaseId} 
            onValueChange={setSelectedCaseId}
            disabled={!selectedSuiteId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select test case..." />
            </SelectTrigger>
            <SelectContent>
              {unlinkedCases.length === 0 ? (
                <div className="p-2 text-sm text-muted-foreground text-center">
                  No available test cases
                </div>
              ) : (
                unlinkedCases.map(testCase => (
                  <SelectItem key={testCase.id} value={testCase.id}>
                    {testCase.id} - {testCase.title}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={handleLinkCase}
          disabled={!selectedCaseId || linkMutation.isPending}
          size="sm"
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          {linkMutation.isPending ? 'Linking...' : 'Link Test Case'}
        </Button>
      </div>

      {/* Linked Test Cases */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <TestTube2 className="w-4 h-4" />
            Linked Test Cases
            <Badge variant="outline" className="ml-2">
              {linkedCases.length}
            </Badge>
          </h4>
          {linkedCases.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open('/quality/test-plan', '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              Open Test Plan
            </Button>
          )}
        </div>

        {linkedCases.length === 0 ? (
          <div className="p-8 text-center border border-dashed rounded-lg">
            <TestTube2 className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
            <p className="text-sm text-muted-foreground">
              No test cases linked to this story yet
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Link test cases to track test coverage
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {linkedCases.map(testCase => (
              <div
                key={testCase.id}
                className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono text-muted-foreground">
                        {testCase.id}
                      </span>
                      <Badge variant="outline" className={cn('text-xs', getPriorityColor(testCase.priority))}>
                        {testCase.priority}
                      </Badge>
                      <Badge variant="outline" className={cn('text-xs', getTestTypeColor(testCase.testType))}>
                        {testCase.testType}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium">{testCase.title}</p>
                    {testCase.preconditions && (
                      <p className="text-xs text-muted-foreground">
                        <span className="font-semibold">Preconditions:</span> {testCase.preconditions}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {testCase.steps.length} test {testCase.steps.length === 1 ? 'step' : 'steps'}
                    </p>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleUnlink(testCase.id)}
                    disabled={unlinkMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Test Coverage Summary */}
      {linkedCases.length > 0 && (
        <div className="p-4 bg-indigo-50 dark:bg-indigo-950/20 rounded-lg border border-indigo-200 dark:border-indigo-900">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5" />
            <div>
              <h4 className="font-semibold text-sm text-indigo-900 dark:text-indigo-100">
                Test Coverage Active
              </h4>
              <p className="text-xs text-indigo-700 dark:text-indigo-300 mt-1">
                This story has {linkedCases.length} test {linkedCases.length === 1 ? 'case' : 'cases'} linked. 
                Execute these tests in a Test Run to verify acceptance criteria.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

