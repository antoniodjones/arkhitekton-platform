/**
 * StepManager Component - US-QC-IMPL-012
 * Manages structured reproduction steps with drag-and-drop, add/remove, and inline editing
 */

import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { StepReferencesPopover } from '@/components/quality/step-references-popover';
import {
  GripVertical,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Copy,
  Check,
  Pencil,
  X,
  Link2,
} from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export interface ReproductionStep {
  id: string;
  defectId: string;
  stepId: string; // e.g., "S001", "S002"
  sequence: number;
  description: string;
  expectedResult?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

interface StepManagerProps {
  defectId: string;
  editable?: boolean;
}

interface SortableStepProps {
  step: ReproductionStep;
  index: number;
  total: number;
  editable: boolean;
  onEdit: (step: ReproductionStep) => void;
  onDelete: (step: ReproductionStep) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onCopyId: (fullId: string) => void;
}

function SortableStep({
  step,
  index,
  total,
  editable,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  onCopyId,
}: SortableStepProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: step.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const fullStepId = `${step.defectId}-${step.stepId}`;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-start gap-3 p-3 border rounded-lg bg-card ${
        isDragging ? 'shadow-lg' : ''
      }`}
    >
      {/* Drag Handle */}
      {editable && (
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing pt-1"
        >
          <GripVertical className="w-5 h-5 text-muted-foreground" />
        </div>
      )}

      {/* Sequence Number */}
      <div className="flex-shrink-0 w-8 pt-1">
        <span className="text-sm font-semibold text-muted-foreground">
          {step.sequence}.
        </span>
      </div>

      {/* Step Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <Badge
            variant="outline"
            className="cursor-pointer hover:bg-accent"
            onClick={() => onCopyId(fullStepId)}
            title="Click to copy step ID"
          >
            {step.stepId}
          </Badge>
          {/* References Badge with Popover */}
          <StepReferencesPopover stepUuid={step.id} fullStepId={fullStepId}>
            <Badge
              variant="secondary"
              className="cursor-pointer hover:bg-secondary/80 text-xs gap-1"
              title="View references"
            >
              <Link2 className="w-3 h-3" />
              Referenced
            </Badge>
          </StepReferencesPopover>
        </div>
        <p className="text-sm whitespace-pre-wrap">{step.description}</p>
        {step.expectedResult && (
          <p className="text-xs text-muted-foreground mt-2">
            <span className="font-medium">Expected: </span>
            {step.expectedResult}
          </p>
        )}
      </div>

      {/* Actions */}
      {editable && (
        <div className="flex items-center gap-1">
          {/* Up Arrow */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onMoveUp(index)}
            disabled={index === 0}
            title="Move up"
          >
            <ChevronUp className="w-4 h-4" />
          </Button>

          {/* Down Arrow */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onMoveDown(index)}
            disabled={index === total - 1}
            title="Move down"
          >
            <ChevronDown className="w-4 h-4" />
          </Button>

          {/* Edit */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onEdit(step)}
            title="Edit step"
          >
            <Pencil className="w-4 h-4" />
          </Button>

          {/* Delete */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={() => onDelete(step)}
            title="Remove step"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

export function StepManager({ defectId, editable = false }: StepManagerProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deleteStep, setDeleteStep] = useState<ReproductionStep | null>(null);
  const [editingStep, setEditingStep] = useState<ReproductionStep | null>(null);
  const [editDescription, setEditDescription] = useState('');
  const [editExpectedResult, setEditExpectedResult] = useState('');
  const [newStepDescription, setNewStepDescription] = useState('');
  const [newStepExpectedResult, setNewStepExpectedResult] = useState('');
  const [isAddingStep, setIsAddingStep] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Fetch steps
  const { data: stepsData, isLoading } = useQuery<{ data: ReproductionStep[] }>({
    queryKey: [`/api/defects/${defectId}/steps`],
    queryFn: async () => {
      const response = await fetch(`/api/defects/${defectId}/steps`);
      if (!response.ok) throw new Error('Failed to fetch steps');
      return response.json();
    },
  });

  const steps = stepsData?.data || [];

  // Create step mutation
  const createStepMutation = useMutation({
    mutationFn: async (data: { description: string; expectedResult?: string }) => {
      const response = await fetch(`/api/defects/${defectId}/steps`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create step');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/defects/${defectId}/steps`] });
      setNewStepDescription('');
      setNewStepExpectedResult('');
      setIsAddingStep(false);
      toast({ title: 'Step added successfully' });
    },
    onError: () => {
      toast({ title: 'Failed to add step', variant: 'destructive' });
    },
  });

  // Update step mutation
  const updateStepMutation = useMutation({
    mutationFn: async ({ stepId, data }: { stepId: string; data: Partial<ReproductionStep> }) => {
      const response = await fetch(`/api/defects/${defectId}/steps/${stepId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update step');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/defects/${defectId}/steps`] });
      setEditingStep(null);
      toast({ title: 'Step updated successfully' });
    },
    onError: () => {
      toast({ title: 'Failed to update step', variant: 'destructive' });
    },
  });

  // Delete step mutation
  const deleteStepMutation = useMutation({
    mutationFn: async (stepId: string) => {
      const response = await fetch(`/api/defects/${defectId}/steps/${stepId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete step');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/defects/${defectId}/steps`] });
      setDeleteStep(null);
      toast({ title: 'Step removed successfully' });
    },
    onError: (error: Error) => {
      toast({ title: error.message, variant: 'destructive' });
    },
  });

  // Reorder steps mutation
  const reorderStepsMutation = useMutation({
    mutationFn: async (reorderedSteps: ReproductionStep[]) => {
      const stepOrders = reorderedSteps.map((step, index) => ({
        stepId: step.stepId,
        sequence: index + 1,
      }));
      const response = await fetch(`/api/defects/${defectId}/steps/reorder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ steps: stepOrders }),
      });
      if (!response.ok) throw new Error('Failed to reorder steps');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/defects/${defectId}/steps`] });
    },
    onError: () => {
      toast({ title: 'Failed to reorder steps', variant: 'destructive' });
    },
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = steps.findIndex((s) => s.id === active.id);
      const newIndex = steps.findIndex((s) => s.id === over.id);

      const reorderedSteps = arrayMove(steps, oldIndex, newIndex);
      reorderStepsMutation.mutate(reorderedSteps);
    }
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const reorderedSteps = arrayMove(steps, index, index - 1);
    reorderStepsMutation.mutate(reorderedSteps);
  };

  const handleMoveDown = (index: number) => {
    if (index === steps.length - 1) return;
    const reorderedSteps = arrayMove(steps, index, index + 1);
    reorderStepsMutation.mutate(reorderedSteps);
  };

  const handleCopyId = (fullId: string) => {
    navigator.clipboard.writeText(fullId);
    setCopiedId(fullId);
    toast({ title: `Step ID copied: ${fullId}` });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleEdit = (step: ReproductionStep) => {
    setEditingStep(step);
    setEditDescription(step.description);
    setEditExpectedResult(step.expectedResult || '');
  };

  const handleSaveEdit = () => {
    if (!editingStep) return;
    updateStepMutation.mutate({
      stepId: editingStep.stepId,
      data: {
        description: editDescription,
        expectedResult: editExpectedResult || null,
      },
    });
  };

  const handleAddStep = () => {
    if (!newStepDescription.trim()) {
      toast({ title: 'Description is required', variant: 'destructive' });
      return;
    }
    createStepMutation.mutate({
      description: newStepDescription,
      expectedResult: newStepExpectedResult || undefined,
    });
  };

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading steps...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Steps List */}
      {steps.length > 0 ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={steps.map((s) => s.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {steps.map((step, index) => (
                <SortableStep
                  key={step.id}
                  step={step}
                  index={index}
                  total={steps.length}
                  editable={editable}
                  onEdit={handleEdit}
                  onDelete={setDeleteStep}
                  onMoveUp={handleMoveUp}
                  onMoveDown={handleMoveDown}
                  onCopyId={handleCopyId}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="text-sm text-muted-foreground italic p-4 border border-dashed rounded-lg text-center">
          No reproduction steps yet. Click "+Add Step" to create one.
        </div>
      )}

      {/* Add Step Button/Form */}
      {editable && (
        <div>
          {isAddingStep ? (
            <div className="border rounded-lg p-4 space-y-3 bg-card">
              <div>
                <label className="text-sm font-medium">Step Description *</label>
                <Textarea
                  value={newStepDescription}
                  onChange={(e) => setNewStepDescription(e.target.value)}
                  placeholder="Describe what to do in this step..."
                  rows={3}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Expected Result (Optional)</label>
                <Input
                  value={newStepExpectedResult}
                  onChange={(e) => setNewStepExpectedResult(e.target.value)}
                  placeholder="What should happen after this step?"
                  className="mt-1"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleAddStep}
                  disabled={createStepMutation.isPending}
                  size="sm"
                >
                  <Check className="w-4 h-4 mr-1" />
                  Save Step
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddingStep(false);
                    setNewStepDescription('');
                    setNewStepExpectedResult('');
                  }}
                  size="sm"
                >
                  <X className="w-4 h-4 mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button onClick={() => setIsAddingStep(true)} variant="outline" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Step
            </Button>
          )}
        </div>
      )}

      {/* Edit Step Dialog */}
      {editingStep && (
        <AlertDialog open={!!editingStep} onOpenChange={() => setEditingStep(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Edit Step {editingStep.stepId}</AlertDialogTitle>
              <AlertDialogDescription>
                Update the step description and expected result.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Description *</label>
                <Textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={4}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Expected Result</label>
                <Input
                  value={editExpectedResult}
                  onChange={(e) => setEditExpectedResult(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleSaveEdit} disabled={updateStepMutation.isPending}>
                Save Changes
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteStep && (
        <AlertDialog open={!!deleteStep} onOpenChange={() => setDeleteStep(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove Step {deleteStep.stepId}?</AlertDialogTitle>
              <AlertDialogDescription>
                {steps.length === 1
                  ? 'This is the last step. Remove anyway?'
                  : 'This action cannot be undone. The step will be removed from the list.'}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteStepMutation.mutate(deleteStep.stepId)}
                disabled={deleteStepMutation.isPending}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Remove Step
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}

