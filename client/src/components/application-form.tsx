import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { insertApplicationSchema, type Application, type InsertApplication } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface ApplicationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: InsertApplication) => void;
  defaultValues?: Partial<Application>;
  isLoading?: boolean;
}

export function ApplicationForm({ 
  open, 
  onOpenChange, 
  onSubmit, 
  defaultValues,
  isLoading = false 
}: ApplicationFormProps) {
  const form = useForm<InsertApplication>({
    resolver: zodResolver(insertApplicationSchema),
    defaultValues: {
      name: defaultValues?.name || '',
      description: defaultValues?.description || '',
      type: defaultValues?.type || 'web_application',
      category: defaultValues?.category || 'business',
      criticality: defaultValues?.criticality || 'medium',
      status: defaultValues?.status || 'active',
      owner: defaultValues?.owner || '',
      team: defaultValues?.team || '',
      hostingEnvironment: defaultValues?.hostingEnvironment || '',
      architecture: defaultValues?.architecture || '',
      version: defaultValues?.version || '1.0.0',
      repositoryUrl: defaultValues?.repositoryUrl || '',
      documentationUrl: defaultValues?.documentationUrl || '',
      monitoringUrl: defaultValues?.monitoringUrl || '',
      businessValue: defaultValues?.businessValue || '',
      costCenter: defaultValues?.costCenter || '',
      deployedDate: defaultValues?.deployedDate || '',
      retirementDate: defaultValues?.retirementDate || '',
    },
  });

  // Reset form when defaultValues change (for edit mode)
  useEffect(() => {
    form.reset({
      name: defaultValues?.name || '',
      description: defaultValues?.description || '',
      type: defaultValues?.type || 'web_application',
      category: defaultValues?.category || 'business',
      criticality: defaultValues?.criticality || 'medium',
      status: defaultValues?.status || 'active',
      owner: defaultValues?.owner || '',
      team: defaultValues?.team || '',
      hostingEnvironment: defaultValues?.hostingEnvironment || '',
      architecture: defaultValues?.architecture || '',
      version: defaultValues?.version || '1.0.0',
      repositoryUrl: defaultValues?.repositoryUrl || '',
      documentationUrl: defaultValues?.documentationUrl || '',
      monitoringUrl: defaultValues?.monitoringUrl || '',
      businessValue: defaultValues?.businessValue || '',
      costCenter: defaultValues?.costCenter || '',
      deployedDate: defaultValues?.deployedDate || '',
      retirementDate: defaultValues?.retirementDate || '',
    });
  }, [defaultValues, form]);

  const handleSubmit = (data: InsertApplication) => {
    onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" data-testid="dialog-application-form">
        <DialogHeader>
          <DialogTitle data-testid="heading-form-title">
            {defaultValues?.id ? 'Edit Application' : 'Create New Application'}
          </DialogTitle>
          <DialogDescription>
            {defaultValues?.id 
              ? 'Update the application information below.' 
              : 'Add a new application to your portfolio.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Basic Information</h3>
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Application Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Customer Portal" {...field} data-testid="input-app-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Brief description of the application..." 
                        {...field}
                        value={field.value || ''}
                        data-testid="input-app-description"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Classification */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Classification</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-app-type">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="web_application">Web Application</SelectItem>
                          <SelectItem value="mobile_app">Mobile App</SelectItem>
                          <SelectItem value="api_service">API Service</SelectItem>
                          <SelectItem value="database">Database</SelectItem>
                          <SelectItem value="infrastructure">Infrastructure</SelectItem>
                          <SelectItem value="saas_tool">SaaS Tool</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-app-category">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="business">Business</SelectItem>
                          <SelectItem value="technical">Technical</SelectItem>
                          <SelectItem value="infrastructure">Infrastructure</SelectItem>
                          <SelectItem value="integration">Integration</SelectItem>
                          <SelectItem value="data">Data</SelectItem>
                          <SelectItem value="security">Security</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="criticality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Criticality *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-app-criticality">
                            <SelectValue placeholder="Select criticality" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-app-status">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="development">Development</SelectItem>
                          <SelectItem value="deprecated">Deprecated</SelectItem>
                          <SelectItem value="retired">Retired</SelectItem>
                          <SelectItem value="planned">Planned</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Ownership */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Ownership</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="owner"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Owner</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., John Doe" {...field} value={field.value || ''} data-testid="input-app-owner" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="team"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Team</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Platform Team" {...field} value={field.value || ''} data-testid="input-app-team" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Technical Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Technical Details</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="hostingEnvironment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hosting Environment</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., AWS, Azure, GCP" {...field} value={field.value || ''} data-testid="input-app-hosting" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="architecture"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Architecture</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., microservices, monolithic" {...field} value={field.value || ''} data-testid="input-app-architecture" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* External Links */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">External Links</h3>
              
              <FormField
                control={form.control}
                name="repositoryUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Repository URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://github.com/org/repo" {...field} value={field.value || ''} data-testid="input-app-repo" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="documentationUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Documentation URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://docs.example.com" {...field} value={field.value || ''} data-testid="input-app-docs" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="monitoringUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monitoring URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://monitoring.example.com" {...field} value={field.value || ''} data-testid="input-app-monitoring" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700"
                data-testid="button-submit"
              >
                {isLoading ? 'Saving...' : defaultValues?.id ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
