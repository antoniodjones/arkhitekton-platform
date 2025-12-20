import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Initiative, InsertInitiative } from '@shared/schema';

interface InitiativeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: InsertInitiative) => void;
  defaultValues?: Initiative;
  isLoading?: boolean;
}

export function InitiativeForm({ open, onOpenChange, onSubmit, defaultValues, isLoading }: InitiativeFormProps) {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<InsertInitiative>({
    defaultValues: {
      name: '',
      description: '',
      status: 'planning',
      priority: 'medium',
      healthStatus: 'green',
      riskLevel: 'medium',
      type: 'technology_modernization',
      sponsor: '',
      programManager: '',
      startDate: '',
      targetDate: '',
      budget: undefined,
      businessValue: undefined,
      progressPercent: 0,
    },
  });

  useEffect(() => {
    if (defaultValues) {
      reset({
        name: defaultValues.name,
        description: defaultValues.description || '',
        status: defaultValues.status as any,
        priority: defaultValues.priority as any,
        healthStatus: defaultValues.healthStatus as any,
        riskLevel: defaultValues.riskLevel as any,
        type: defaultValues.type as any,
        sponsor: defaultValues.sponsor || '',
        programManager: defaultValues.programManager || '',
        startDate: defaultValues.startDate || '',
        targetDate: defaultValues.targetDate || '',
        budget: defaultValues.budget || undefined,
        spentBudget: defaultValues.spentBudget || undefined,
        businessValue: defaultValues.businessValue || undefined,
        progressPercent: defaultValues.progressPercent || 0,
      });
    } else {
      reset({
        name: '',
        description: '',
        status: 'planning',
        priority: 'medium',
        healthStatus: 'green',
        riskLevel: 'medium',
        type: 'technology_modernization',
        sponsor: '',
        programManager: '',
        startDate: '',
        targetDate: '',
        budget: undefined,
        businessValue: undefined,
        progressPercent: 0,
      });
    }
  }, [defaultValues, reset]);

  const handleFormSubmit = (data: InsertInitiative) => {
    onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{defaultValues ? 'Edit Initiative' : 'Create Initiative'}</DialogTitle>
          <DialogDescription>
            {defaultValues ? 'Update the initiative details.' : 'Add a new strategic initiative to your portfolio.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="name">Initiative Name *</Label>
              <Input
                id="name"
                {...register('name', { required: 'Name is required' })}
                placeholder="Customer Experience Modernization"
              />
              {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
            </div>

            <div className="col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Describe the initiative goals and scope..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="type">Type</Label>
              <Select
                value={watch('type')}
                onValueChange={(value) => setValue('type', value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="digital_transformation">Digital Transformation</SelectItem>
                  <SelectItem value="process_improvement">Process Improvement</SelectItem>
                  <SelectItem value="technology_modernization">Technology Modernization</SelectItem>
                  <SelectItem value="organizational_change">Organizational Change</SelectItem>
                  <SelectItem value="infrastructure_upgrade">Infrastructure Upgrade</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={watch('status')}
                onValueChange={(value) => setValue('status', value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="on_hold">On Hold</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={watch('priority')}
                onValueChange={(value) => setValue('priority', value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="healthStatus">Health Status</Label>
              <Select
                value={watch('healthStatus')}
                onValueChange={(value) => setValue('healthStatus', value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select health" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="green">Green</SelectItem>
                  <SelectItem value="yellow">Yellow</SelectItem>
                  <SelectItem value="red">Red</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="riskLevel">Risk Level</Label>
              <Select
                value={watch('riskLevel')}
                onValueChange={(value) => setValue('riskLevel', value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select risk" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="sponsor">Sponsor</Label>
              <Input
                id="sponsor"
                {...register('sponsor')}
                placeholder="Executive Sponsor"
              />
            </div>

            <div>
              <Label htmlFor="programManager">Program Manager</Label>
              <Input
                id="programManager"
                {...register('programManager')}
                placeholder="Program Manager"
              />
            </div>

            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                {...register('startDate')}
              />
            </div>

            <div>
              <Label htmlFor="targetDate">Target Date</Label>
              <Input
                id="targetDate"
                type="date"
                {...register('targetDate')}
              />
            </div>

            <div>
              <Label htmlFor="budget">Budget ($)</Label>
              <Input
                id="budget"
                type="number"
                {...register('budget', { valueAsNumber: true })}
                placeholder="2500000"
              />
            </div>

            <div>
              <Label htmlFor="spentBudget">Spent Budget ($)</Label>
              <Input
                id="spentBudget"
                type="number"
                {...register('spentBudget', { valueAsNumber: true })}
                placeholder="0"
              />
            </div>

            <div>
              <Label htmlFor="businessValue">Expected Business Value ($)</Label>
              <Input
                id="businessValue"
                type="number"
                {...register('businessValue', { valueAsNumber: true })}
                placeholder="15000000"
              />
            </div>

            <div>
              <Label htmlFor="progressPercent">Progress (%)</Label>
              <Input
                id="progressPercent"
                type="number"
                min="0"
                max="100"
                {...register('progressPercent', { valueAsNumber: true })}
                placeholder="0"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : defaultValues ? 'Update Initiative' : 'Create Initiative'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


