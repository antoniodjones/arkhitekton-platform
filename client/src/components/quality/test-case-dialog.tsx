import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import type { TestCase, InsertTestCase } from '@shared/schema';

interface TestCaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  testCase: TestCase | null;
  suiteId: string;
}

type TestStep = {
  step: string;
  expected: string;
};

export function TestCaseDialog({ 
  open, 
  onOpenChange, 
  testCase,
  suiteId 
}: TestCaseDialogProps) {
  const [title, setTitle] = useState('');
  const [preconditions, setPreconditions] = useState('');
  const [priority, setPriority] = useState<string>('medium');
  const [testType, setTestType] = useState<string>('functional');
  const [steps, setSteps] = useState<TestStep[]>([
    { step: '', expected: '' }
  ]);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (testCase) {
      setTitle(testCase.title);
      setPreconditions(testCase.preconditions || '');
      setPriority(testCase.priority);
      setTestType(testCase.testType);
      setSteps(testCase.steps.length > 0 ? testCase.steps : [{ step: '', expected: '' }]);
    } else {
      setTitle('');
      setPreconditions('');
      setPriority('medium');
      setTestType('functional');
      setSteps([{ step: '', expected: '' }]);
    }
  }, [testCase, open]);

  const createMutation = useMutation({
    mutationFn: async (data: InsertTestCase) => {
      const res = await fetch('/api/test-cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create test case');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/test-cases'] });
      onOpenChange(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<TestCase>) => {
      const res = await fetch(`/api/test-cases/${testCase!.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update test case');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/test-cases'] });
      onOpenChange(false);
    },
  });

  const addStep = () => {
    setSteps([...steps, { step: '', expected: '' }]);
  };

  const removeStep = (index: number) => {
    if (steps.length > 1) {
      setSteps(steps.filter((_, i) => i !== index));
    }
  };

  const updateStep = (index: number, field: 'step' | 'expected', value: string) => {
    const newSteps = [...steps];
    newSteps[index][field] = value;
    setSteps(newSteps);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Filter out empty steps
    const validSteps = steps.filter(s => s.step.trim() && s.expected.trim());
    
    if (validSteps.length === 0) {
      alert('Please add at least one test step');
      return;
    }

    const data: InsertTestCase = {
      suiteId,
      title,
      preconditions: preconditions || undefined,
      steps: validSteps,
      priority,
      testType,
      tags: [],
    };

    if (testCase) {
      await updateMutation.mutateAsync(data);
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {testCase ? 'Edit Test Case' : 'Create Test Case'}
          </DialogTitle>
          <DialogDescription>
            {testCase 
              ? 'Update the test case details and steps' 
              : 'Define a new test case with detailed steps'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., User can create a new user story"
              required
            />
          </div>

          {/* Priority & Type Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority *</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger id="priority">
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

            <div className="space-y-2">
              <Label htmlFor="testType">Test Type *</Label>
              <Select value={testType} onValueChange={setTestType}>
                <SelectTrigger id="testType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="functional">Functional</SelectItem>
                  <SelectItem value="regression">Regression</SelectItem>
                  <SelectItem value="smoke">Smoke</SelectItem>
                  <SelectItem value="integration">Integration</SelectItem>
                  <SelectItem value="e2e">E2E</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Preconditions */}
          <div className="space-y-2">
            <Label htmlFor="preconditions">Preconditions</Label>
            <Textarea
              id="preconditions"
              value={preconditions}
              onChange={(e) => setPreconditions(e.target.value)}
              placeholder="e.g., User must be logged in as an admin"
              rows={2}
            />
          </div>

          {/* Test Steps */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Test Steps *</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addStep}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Step
              </Button>
            </div>

            <div className="space-y-3">
              {steps.map((step, index) => (
                <div key={index} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center gap-2 mt-2">
                      <GripVertical className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-muted-foreground">
                        {index + 1}
                      </span>
                    </div>

                    <div className="flex-1 space-y-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Action</Label>
                        <Textarea
                          value={step.step}
                          onChange={(e) => updateStep(index, 'step', e.target.value)}
                          placeholder="Describe the action to perform..."
                          rows={2}
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Expected Result</Label>
                        <Textarea
                          value={step.expected}
                          onChange={(e) => updateStep(index, 'expected', e.target.value)}
                          placeholder="What should happen?"
                          rows={2}
                          required
                        />
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeStep(index)}
                      disabled={steps.length === 1}
                      className="mt-2"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : testCase ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

