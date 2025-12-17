import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tantml:react-query';
import { QualityLayout } from '@/components/quality/quality-layout';
import { Button } from '@/components/ui/button';
import { Plus, FolderPlus } from 'lucide-react';
import { TestSuiteTree } from '@/components/quality/test-suite-tree';
import { TestCaseList } from '@/components/quality/test-case-list';
import { TestSuiteDialog } from '@/components/quality/test-suite-dialog';
import { TestCaseDialog } from '@/components/quality/test-case-dialog';
import type { TestSuite, TestCase } from '@shared/schema';

export default function TestPlanPage() {
  const [selectedSuiteId, setSelectedSuiteId] = useState<string | null>(null);
  const [suiteDialogOpen, setSuiteDialogOpen] = useState(false);
  const [caseDialogOpen, setCaseDialogOpen] = useState(false);
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

  const handleEditSuite = (suite: TestSuite) => {
    setEditingSuite(suite);
    setSuiteDialogOpen(true);
  };

  const handleEditCase = (testCase: TestCase) => {
    setEditingCase(testCase);
    setCaseDialogOpen(true);
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
          <Button onClick={handleCreateCase} disabled={!selectedSuiteId}>
            <Plus className="w-4 h-4 mr-2" />
            New Test Case
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

        {/* Right: Test Case List (9 columns) */}
        <div className="col-span-9 bg-white dark:bg-gray-900 rounded-lg border overflow-auto">
          {selectedSuiteId ? (
            <TestCaseList
              suiteId={selectedSuiteId}
              testCases={testCases}
              onEditCase={handleEditCase}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center">
                <FolderPlus className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Select a test suite to view test cases</p>
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
      </div>
    </QualityLayout>
  );
}

