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
import type { TestSuite, InsertTestSuite } from '@shared/schema';

interface TestSuiteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  suite: TestSuite | null;
  parentSuiteId?: string | null;
}

export function TestSuiteDialog({ 
  open, 
  onOpenChange, 
  suite,
  parentSuiteId 
}: TestSuiteDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [module, setModule] = useState<string>('none');

  const queryClient = useQueryClient();

  useEffect(() => {
    if (suite) {
      setName(suite.name);
      setDescription(suite.description || '');
      setModule(suite.module || 'none');
    } else {
      setName('');
      setDescription('');
      setModule('none');
    }
  }, [suite, open]);

  const createMutation = useMutation({
    mutationFn: async (data: InsertTestSuite) => {
      const res = await fetch('/api/test-suites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create test suite');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/test-suites'] });
      onOpenChange(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<TestSuite>) => {
      const res = await fetch(`/api/test-suites/${suite!.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update test suite');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/test-suites'] });
      onOpenChange(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data: InsertTestSuite = {
      name,
      description: description || undefined,
      module: module === 'none' ? undefined : module,
      parentSuiteId: parentSuiteId || undefined,
    };

    if (suite) {
      await updateMutation.mutateAsync(data);
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {suite ? 'Edit Test Suite' : 'Create Test Suite'}
          </DialogTitle>
          <DialogDescription>
            {suite 
              ? 'Update the test suite details below' 
              : 'Create a new test suite to organize your test cases'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Plan Module Tests"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this test suite covers..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="module">Module</Label>
            <Select value={module} onValueChange={setModule}>
              <SelectTrigger id="module">
                <SelectValue placeholder="Select a module" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="plan">Plan</SelectItem>
                <SelectItem value="wiki">Wiki</SelectItem>
                <SelectItem value="quality">Quality Center</SelectItem>
                <SelectItem value="design">Design Studio</SelectItem>
                <SelectItem value="canvas">Canvas</SelectItem>
                <SelectItem value="agent">Agent</SelectItem>
              </SelectContent>
            </Select>
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
              {isLoading ? 'Saving...' : suite ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

