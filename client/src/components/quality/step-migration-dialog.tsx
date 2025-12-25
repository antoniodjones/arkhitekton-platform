/**
 * StepMigrationDialog Component - US-QC-IMPL-014
 * Dialog to convert textarea steps to structured format with preview
 */

import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface ParsedStep {
  sequence: number;
  description: string;
}

interface MigrationPreview {
  steps: ParsedStep[];
  validation: {
    isValid: boolean;
    errors: string[];
  };
}

interface StepMigrationDialogProps {
  defectId: string;
  originalText: string;
  trigger?: React.ReactNode;
}

export function StepMigrationDialog({
  defectId,
  originalText,
  trigger,
}: StepMigrationDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [previewData, setPreviewData] = useState<MigrationPreview | null>(null);
  const [editedSteps, setEditedSteps] = useState<ParsedStep[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Preview mutation
  const previewMutation = useMutation({
    mutationFn: async (text: string) => {
      const response = await fetch(`/api/defects/${defectId}/steps/preview-migration`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (!response.ok) throw new Error('Failed to preview migration');
      return response.json();
    },
    onSuccess: (data) => {
      setPreviewData(data.data);
      setEditedSteps(data.data.steps);
    },
    onError: () => {
      toast({ title: 'Failed to preview migration', variant: 'destructive' });
    },
  });

  // Execute migration mutation
  const executeMutation = useMutation({
    mutationFn: async (steps: ParsedStep[]) => {
      const response = await fetch(`/api/defects/${defectId}/steps/execute-migration`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ steps, originalText }),
      });
      if (!response.ok) throw new Error('Failed to execute migration');
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [`/api/defects/${defectId}/steps`] });
      toast({ title: data.message || 'Migration successful!' });
      setOpen(false);
      setPreviewData(null);
      setEditedSteps([]);
    },
    onError: () => {
      toast({ title: 'Failed to execute migration', variant: 'destructive' });
    },
  });

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen && originalText && !previewData) {
      // Auto-preview when opening
      previewMutation.mutate(originalText);
    }
    if (!newOpen) {
      // Reset on close
      setPreviewData(null);
      setEditedSteps([]);
    }
  };

  const handleStepEdit = (index: number, newDescription: string) => {
    const updated = [...editedSteps];
    updated[index] = { ...updated[index], description: newDescription };
    setEditedSteps(updated);
  };

  const handleExecute = () => {
    if (!previewData) return;
    executeMutation.mutate(editedSteps);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Sparkles className="w-4 h-4 mr-2" />
            Convert to Structured Steps
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Convert to Structured Steps</DialogTitle>
          <DialogDescription>
            Preview and edit the automatically parsed steps before converting.
          </DialogDescription>
        </DialogHeader>

        {previewMutation.isPending && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-sm text-muted-foreground">Parsing steps...</p>
          </div>
        )}

        {previewData && (
          <div className="space-y-4">
            {/* Validation Status */}
            {previewData.validation.isValid ? (
              <Alert>
                <CheckCircle2 className="w-4 h-4" />
                <AlertDescription>
                  Successfully parsed {previewData.steps.length} step(s). Review and edit below before converting.
                </AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive">
                <AlertTriangle className="w-4 h-4" />
                <AlertDescription>
                  <div className="font-medium mb-1">Validation Warnings:</div>
                  <ul className="list-disc list-inside text-xs space-y-1">
                    {previewData.validation.errors.map((error, i) => (
                      <li key={i}>{error}</li>
                    ))}
                  </ul>
                  <div className="mt-2 text-xs">
                    You can still proceed, but please review and edit the steps below.
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Steps Preview & Edit */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Parsed Steps</h4>
                <Badge variant="secondary">
                  {editedSteps.length} step{editedSteps.length !== 1 ? 's' : ''}
                </Badge>
              </div>

              <div className="space-y-3 border rounded-lg p-4 bg-muted/30">
                {editedSteps.map((step, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        Step {step.sequence}
                      </Badge>
                      <ArrowRight className="w-3 h-3 text-muted-foreground" />
                      <Badge variant="outline" className="text-xs">
                        S{step.sequence.toString().padStart(3, '0')}
                      </Badge>
                    </div>
                    <Textarea
                      value={step.description}
                      onChange={(e) => handleStepEdit(index, e.target.value)}
                      rows={2}
                      className="text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Original Text Reference */}
            <details className="text-xs">
              <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                Show original text
              </summary>
              <div className="mt-2 p-3 bg-muted rounded border">
                <pre className="whitespace-pre-wrap font-mono text-xs">
                  {originalText}
                </pre>
              </div>
            </details>
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={executeMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleExecute}
            disabled={!previewData || editedSteps.length === 0 || executeMutation.isPending}
          >
            {executeMutation.isPending ? 'Converting...' : `Convert ${editedSteps.length} Step(s)`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

