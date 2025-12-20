import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Search, 
  Filter, 
  Database, 
  Globe, 
  Server, 
  Smartphone,
  Package,
  Cloud,
  MoreVertical,
  Edit,
  Trash2,
  ExternalLink,
  LayoutGrid,
  List
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Toggle } from "@/components/ui/toggle";
import type { Application, InsertApplication } from '@shared/schema';
import { ApplicationForm } from '@/components/application-form';

const APP_TYPE_ICONS: Record<string, any> = {
  web_application: Globe,
  mobile_app: Smartphone,
  api_service: Server,
  database: Database,
  infrastructure: Cloud,
  saas_tool: Package,
  custom: Server,
};

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-500/10 text-green-700 dark:text-green-400',
  deprecated: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
  retired: 'bg-gray-500/10 text-gray-700 dark:text-gray-400',
  planned: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  development: 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
};

const CRITICALITY_COLORS: Record<string, string> = {
  low: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  medium: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
  high: 'bg-orange-500/10 text-orange-700 dark:text-orange-400',
  critical: 'bg-red-500/10 text-red-700 dark:text-red-400',
};

type ViewMode = 'grid' | 'list';

export function ApplicationsTab() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<Application | undefined>(undefined);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Fetch applications
  const { data: applications = [], isLoading } = useQuery<Application[]>({
    queryKey: ['/api/applications'],
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: InsertApplication) => {
      return await apiRequest('POST', '/api/applications', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/applications'] });
      setDialogOpen(false);
      setEditingApp(undefined);
      toast({
        title: 'Application created',
        description: 'The application has been added to your portfolio.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to create application. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: InsertApplication }) => {
      return await apiRequest('PATCH', `/api/applications/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/applications'] });
      setDialogOpen(false);
      setEditingApp(undefined);
      toast({
        title: 'Application updated',
        description: 'The application has been updated successfully.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update application. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest('DELETE', `/api/applications/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/applications'] });
      toast({
        title: 'Application deleted',
        description: 'The application has been removed from the portfolio.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete application. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Filter applications
  const filteredApplications = applications.filter((app) => {
    const matchesSearch = searchQuery === '' || 
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.description && app.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (app.owner && app.owner.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesType = typeFilter === 'all' || app.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleDelete = (app: Application) => {
    if (window.confirm(`Are you sure you want to delete "${app.name}"?`)) {
      deleteMutation.mutate(app.id);
    }
  };

  const handleCreate = () => {
    setEditingApp(undefined);
    setDialogOpen(true);
  };

  const handleEdit = (app: Application) => {
    setEditingApp(app);
    setDialogOpen(true);
  };

  const handleFormSubmit = (data: InsertApplication) => {
    if (editingApp) {
      updateMutation.mutate({ id: editingApp.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDialogChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setEditingApp(undefined);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search applications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search-applications"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-[180px]" data-testid="select-status-filter">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="development">Development</SelectItem>
                <SelectItem value="deprecated">Deprecated</SelectItem>
                <SelectItem value="retired">Retired</SelectItem>
                <SelectItem value="planned">Planned</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full lg:w-[180px]" data-testid="select-type-filter">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="web_application">Web Application</SelectItem>
                <SelectItem value="mobile_app">Mobile App</SelectItem>
                <SelectItem value="api_service">API Service</SelectItem>
                <SelectItem value="database">Database</SelectItem>
                <SelectItem value="infrastructure">Infrastructure</SelectItem>
                <SelectItem value="saas_tool">SaaS Tool</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>

            {/* View Toggle */}
            <div className="flex items-center gap-1 border rounded-md p-1 bg-slate-50 dark:bg-slate-800">
              <Toggle
                pressed={viewMode === 'grid'}
                onPressedChange={() => setViewMode('grid')}
                size="sm"
                aria-label="Grid view"
              >
                <LayoutGrid className="h-4 w-4" />
              </Toggle>
              <Toggle
                pressed={viewMode === 'list'}
                onPressedChange={() => setViewMode('list')}
                size="sm"
                aria-label="List view"
              >
                <List className="h-4 w-4" />
              </Toggle>
            </div>

            <Button 
              onClick={handleCreate}
              className="w-full lg:w-auto bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700"
              data-testid="button-create-application"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Application
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-4 flex gap-6 text-sm text-slate-600 dark:text-slate-400">
            <span data-testid="text-total-count">
              <strong className="text-slate-900 dark:text-white">{filteredApplications.length}</strong> applications
            </span>
            <span>
              <strong className="text-green-600 dark:text-green-400">
                {applications.filter(a => a.status === 'active').length}
              </strong> active
            </span>
            <span>
              <strong className="text-yellow-600 dark:text-yellow-400">
                {applications.filter(a => a.status === 'deprecated').length}
              </strong> deprecated
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Applications Display */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mt-2"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : filteredApplications.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="w-12 h-12 mx-auto mb-4 text-slate-300 dark:text-slate-700" />
            <p className="text-slate-600 dark:text-slate-400" data-testid="text-no-applications">
              {searchQuery || statusFilter !== 'all' || typeFilter !== 'all'
                ? 'No applications match your filters'
                : 'No applications yet. Create your first one to get started.'}
            </p>
          </CardContent>
        </Card>
      ) : viewMode === 'list' ? (
        /* List View */
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Criticality</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Team</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplications.map((app) => {
                const IconComponent = APP_TYPE_ICONS[app.type] || Server;
                return (
                  <TableRow key={app.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded bg-gradient-to-br from-orange-500/10 to-amber-500/10">
                          <IconComponent className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                          <p className="font-medium">{app.name}</p>
                          {app.description && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[200px]">
                              {app.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm capitalize">{app.type.replace('_', ' ')}</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={STATUS_COLORS[app.status]}>{app.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={CRITICALITY_COLORS[app.criticality]}>{app.criticality}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-slate-600 dark:text-slate-400">{app.owner || '-'}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-slate-600 dark:text-slate-400">{app.team || '-'}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(app)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          {app.repositoryUrl && (
                            <DropdownMenuItem asChild>
                              <a href={app.repositoryUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-4 h-4 mr-2" />
                                View Repository
                              </a>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            onClick={() => handleDelete(app)}
                            className="text-red-600 dark:text-red-400"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredApplications.map((app) => {
            const IconComponent = APP_TYPE_ICONS[app.type] || Server;
            
            return (
              <Card 
                key={app.id} 
                className="hover:shadow-lg transition-all duration-200 border-slate-200 dark:border-slate-800"
                data-testid={`card-application-${app.id}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500/10 to-amber-500/10">
                        <IconComponent className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg truncate" data-testid={`text-app-name-${app.id}`}>
                          {app.name}
                        </CardTitle>
                        <CardDescription className="text-xs" data-testid={`text-app-type-${app.id}`}>
                          {app.type.replace('_', ' ')}
                        </CardDescription>
                      </div>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" data-testid={`button-menu-${app.id}`}>
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          onClick={() => handleEdit(app)}
                          data-testid={`button-edit-${app.id}`}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(app)}
                          className="text-red-600 dark:text-red-400"
                          data-testid={`button-delete-${app.id}`}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  {app.description && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2" data-testid={`text-app-description-${app.id}`}>
                      {app.description}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2">
                    <Badge className={STATUS_COLORS[app.status]} data-testid={`badge-status-${app.id}`}>
                      {app.status}
                    </Badge>
                    <Badge className={CRITICALITY_COLORS[app.criticality]} data-testid={`badge-criticality-${app.id}`}>
                      {app.criticality}
                    </Badge>
                  </div>

                  {(app.owner || app.team) && (
                    <div className="text-sm space-y-1">
                      {app.owner && (
                        <div className="text-slate-600 dark:text-slate-400" data-testid={`text-app-owner-${app.id}`}>
                          <span className="font-medium">Owner:</span> {app.owner}
                        </div>
                      )}
                      {app.team && (
                        <div className="text-slate-600 dark:text-slate-400" data-testid={`text-app-team-${app.id}`}>
                          <span className="font-medium">Team:</span> {app.team}
                        </div>
                      )}
                    </div>
                  )}

                  {app.repositoryUrl && (
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                      <a 
                        href={app.repositoryUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1"
                        data-testid={`link-repository-${app.id}`}
                      >
                        <ExternalLink className="w-3 h-3" />
                        View Repository
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Application Form Dialog */}
      <ApplicationForm
        open={dialogOpen}
        onOpenChange={handleDialogChange}
        onSubmit={handleFormSubmit}
        defaultValues={editingApp}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}
