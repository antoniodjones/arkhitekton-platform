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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { TestRun, InsertTestRun } from '@shared/schema';

interface TestRunDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  suiteId: string;
}

export function TestRunDialog({ 
  open, 
  onOpenChange, 
  suiteId 
}: TestRunDialogProps) {
  const [name, setName] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [environment, setEnvironment] = useState<string>('staging');

  const queryClient = useQueryClient();

  useEffect(() => {
    if (open) {
      // Reset form
      const timestamp = format(new Date(), 'MMM d, yyyy h:mm a');
      setName(`Test Run - ${timestamp}`);
      setAssignedTo('');
      setEnvironment('staging');
    }
  }, [open]);

  const createMutation = useMutation({
    mutationFn: async (data: InsertTestRun) => {
      const res = await fetch('/api/test-runs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create test run');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/test-runs'] });
      onOpenChange(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data: InsertTestRun = {
      suiteId,
      name,
      assignedTo: assignedTo || undefined,
      environment,
      status: 'in-progress',
    };

    await createMutation.mutateAsync(data);
  };

  const isLoading = createMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Test Run</DialogTitle>
          <DialogDescription>
            Create a new test execution session. Test results will be auto-generated for all cases in this suite.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Run Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Sprint 5 Regression Test"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="environment">Environment *</Label>
            <Select value={environment} onValueChange={setEnvironment}>
              <SelectTrigger id="environment">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="local">Local</SelectItem>
                <SelectItem value="staging">Staging</SelectItem>
                <SelectItem value="production">Production</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignedTo">Assigned To</Label>
            <Input
              id="assignedTo"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              placeholder="Tester name (optional)"
            />
          </div>

          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg text-sm text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
            💡 Test results will be auto-created for all test cases in this suite with status "not-run"
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
              {isLoading ? 'Creating...' : 'Create & Start'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Helper function
function format(date: Date, formatStr: string): string {
  // Simple date formatter - in production, use date-fns
  const month = date.toLocaleString('en-US', { month: 'short' });
  const day = date.getDate();
  const year = date.getFullYear();
  const hours = date.getHours() % 12 || 12;
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
  
  return `${month} ${day}, ${year} ${hours}:${minutes} ${ampm}`;
}

