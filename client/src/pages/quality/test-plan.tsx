import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tantml:react-query';
import { QualityLayout } from '@/components/quality/quality-layout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, FolderPlus, Play } from 'lucide-react';
import { TestSuiteTree } from '@/components/quality/test-suite-tree';
import { TestCaseList } from '@/components/quality/test-case-list';
import { TestSuiteDialog } from '@/components/quality/test-suite-dialog';
import { TestCaseDialog } from '@/components/quality/test-case-dialog';
import { TestRunDialog } from '@/components/quality/test-run-dialog';
import { TestRunList } from '@/components/quality/test-run-list';
import { TestExecution } from '@/components/quality/test-execution';
import type { TestSuite, TestCase, TestRun } from '@shared/schema';

export default function TestPlanPage() {
  const [selectedSuiteId, setSelectedSuiteId] = useState<string | null>(null);
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);
  const [suiteDialogOpen, setSuiteDialogOpen] = useState(false);
  const [caseDialogOpen, setCaseDialogOpen] = useState(false);
  const [runDialogOpen, setRunDialogOpen] = useState(false);
  const [editingSuite, setEditingSuite] = useState<TestSuite | null>(null);
  const [editingCase, setEditingCase] = useState<TestCase | null>(null);

  const queryClient = useQueryClient();

  // Fetch test suites
  const { data: suites = [] } = useQuery<TestSuite[]>({
    queryKey: ['/api/test-suites'],
  });

  // Fetch test cases for selected suite
  const { data: testCases = [] } = useQuery<TestCase[]>({
    queryKey: ['/api/test-cases', { suiteId: selectedSuiteId }],
    enabled: !!selectedSuiteId,
  });

  const handleCreateSuite = () => {
    setEditingSuite(null);
    setSuiteDialogOpen(true);
  };

  const handleCreateCase = () => {
    if (!selectedSuiteId) {
      alert('Please select a test suite first');
      return;
    }
    setEditingCase(null);
    setCaseDialogOpen(true);
  };

  const handleCreateRun = () => {
    if (!selectedSuiteId) {
      alert('Please select a test suite first');
      return;
    }
    setRunDialogOpen(true);
  };

  const handleEditSuite = (suite: TestSuite) => {
    setEditingSuite(suite);
    setSuiteDialogOpen(true);
  };

  const handleEditCase = (testCase: TestCase) => {
    setEditingCase(testCase);
    setCaseDialogOpen(true);
  };

  const handleSelectRun = (run: TestRun) => {
    setSelectedRunId(run.id);
  };

  return (
    <QualityLayout>
      <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Test Plan
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Organize test suites and define test cases
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleCreateSuite} variant="outline">
            <FolderPlus className="w-4 h-4 mr-2" />
            New Suite
          </Button>
          <Button onClick={handleCreateCase} disabled={!selectedSuiteId} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            New Test Case
          </Button>
          <Button onClick={handleCreateRun} disabled={!selectedSuiteId}>
            <Play className="w-4 h-4 mr-2" />
            New Test Run
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-12 gap-6 overflow-hidden">
        {/* Left: Test Suite Tree (3 columns) */}
        <div className="col-span-3 bg-white dark:bg-gray-900 rounded-lg border overflow-auto">
          <div className="p-4 border-b">
            <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300">
              Test Suites
            </h3>
          </div>
          <TestSuiteTree
            suites={suites}
            selectedSuiteId={selectedSuiteId}
            onSelectSuite={setSelectedSuiteId}
            onEditSuite={handleEditSuite}
          />
        </div>

        {/* Right: Test Cases & Test Runs (9 columns) */}
        <div className="col-span-9 bg-white dark:bg-gray-900 rounded-lg border overflow-auto">
          {selectedSuiteId ? (
            <Tabs defaultValue="cases" className="h-full flex flex-col">
              <div className="px-4 pt-4 border-b">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="cases">Test Cases</TabsTrigger>
                  <TabsTrigger value="runs">Test Runs</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="cases" className="flex-1 overflow-auto m-0">
                <TestCaseList
                  suiteId={selectedSuiteId}
                  testCases={testCases}
                  onEditCase={handleEditCase}
                />
              </TabsContent>

              <TabsContent value="runs" className="flex-1 overflow-auto m-0 p-4">
                {selectedRunId ? (
                  <div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setSelectedRunId(null)}
                      className="mb-4"
                    >
                      ← Back to Test Runs
                    </Button>
                    <TestExecution runId={selectedRunId} />
                  </div>
                ) : (
                  <TestRunList 
                    suiteId={selectedSuiteId}
                    onSelectRun={handleSelectRun}
                    selectedRunId={selectedRunId || undefined}
                  />
                )}
              </TabsContent>
            </Tabs>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center">
                <FolderPlus className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Select a test suite to view test cases and runs</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dialogs */}
      <TestSuiteDialog
        open={suiteDialogOpen}
        onOpenChange={setSuiteDialogOpen}
        suite={editingSuite}
        parentSuiteId={selectedSuiteId}
      />
      
      <TestCaseDialog
        open={caseDialogOpen}
        onOpenChange={setCaseDialogOpen}
        testCase={editingCase}
        suiteId={selectedSuiteId!}
      />
      
      <TestRunDialog
        open={runDialogOpen}
        onOpenChange={setRunDialogOpen}
        suiteId={selectedSuiteId || ''}
      />
      </div>
    </QualityLayout>
  );
}

