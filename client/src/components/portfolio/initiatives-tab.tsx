import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Briefcase, 
  Plus, 
  Search, 
  Clock,
  DollarSign,
  Users,
  Calendar,
  Target,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  GitBranch,
  Building,
  MoreVertical,
  Edit,
  Trash2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Initiative, InsertInitiative } from '@shared/schema';
import { InitiativeForm } from './initiative-form';

export function InitiativesTab() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingInitiative, setEditingInitiative] = useState<Initiative | undefined>(undefined);

  // Fetch initiatives from API
  const { data: initiatives = [], isLoading } = useQuery<Initiative[]>({
    queryKey: ['/api/initiatives'],
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: InsertInitiative) => {
      return await apiRequest('POST', '/api/initiatives', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/initiatives'] });
      setDialogOpen(false);
      setEditingInitiative(undefined);
      toast({
        title: 'Initiative created',
        description: 'The initiative has been added to your portfolio.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to create initiative. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: InsertInitiative }) => {
      return await apiRequest('PATCH', `/api/initiatives/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/initiatives'] });
      setDialogOpen(false);
      setEditingInitiative(undefined);
      toast({
        title: 'Initiative updated',
        description: 'The initiative has been updated successfully.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update initiative. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest('DELETE', `/api/initiatives/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/initiatives'] });
      toast({
        title: 'Initiative deleted',
        description: 'The initiative has been removed from the portfolio.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete initiative. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const filteredInitiatives = initiatives.filter(initiative => {
    const matchesSearch = searchQuery === '' || 
      initiative.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (initiative.description && initiative.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = selectedStatus === 'all' || initiative.status === selectedStatus;
    const matchesType = selectedType === 'all' || initiative.type === selectedType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'in_progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'planning': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      case 'on_hold': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      case 'medium': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-300';
    }
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'green': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'yellow': return <Clock className="h-4 w-4 text-amber-600" />;
      case 'red': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <BarChart3 className="h-4 w-4 text-slate-600" />;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      case 'medium': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-300';
    }
  };

  const formatCurrency = (amount: number | null) => {
    if (!amount) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleDelete = (initiative: Initiative) => {
    if (window.confirm(`Are you sure you want to delete "${initiative.name}"?`)) {
      deleteMutation.mutate(initiative.id);
    }
  };

  const handleCreate = () => {
    setEditingInitiative(undefined);
    setDialogOpen(true);
  };

  const handleEdit = (initiative: Initiative) => {
    setEditingInitiative(initiative);
    setDialogOpen(true);
  };

  const handleFormSubmit = (data: InsertInitiative) => {
    if (editingInitiative) {
      updateMutation.mutate({ id: editingInitiative.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDialogChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setEditingInitiative(undefined);
    }
  };

  const overallStats = {
    totalInitiatives: initiatives.length,
    activeInitiatives: initiatives.filter(i => i.status === 'in_progress' || i.status === 'planning').length,
    completedInitiatives: initiatives.filter(i => i.status === 'completed').length,
    totalInvestment: initiatives.reduce((sum, i) => sum + (i.budget || 0), 0),
    totalBusinessValue: initiatives.reduce((sum, i) => sum + (i.businessValue || 0), 0),
    avgProgress: initiatives.length > 0 ? Math.round(initiatives.reduce((sum, i) => sum + (i.progressPercent || 0), 0) / initiatives.length) : 0,
    atRiskInitiatives: initiatives.filter(i => i.healthStatus === 'red' || i.healthStatus === 'yellow').length
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-300">Total</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">{overallStats.totalInitiatives}</p>
              </div>
              <Briefcase className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-300">Active</p>
                <p className="text-xl font-bold text-blue-600">{overallStats.activeInitiatives}</p>
              </div>
              <Target className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-300">Completed</p>
                <p className="text-xl font-bold text-green-600">{overallStats.completedInitiatives}</p>
              </div>
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-300">At Risk</p>
                <p className="text-xl font-bold text-amber-600">{overallStats.atRiskInitiatives}</p>
              </div>
              <AlertTriangle className="h-6 w-6 text-amber-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-300">Investment</p>
                <p className="text-lg font-bold text-purple-600">{formatCurrency(overallStats.totalInvestment / 1000000)}M</p>
              </div>
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-300">Value</p>
                <p className="text-lg font-bold text-emerald-600">{formatCurrency(overallStats.totalBusinessValue / 1000000)}M</p>
              </div>
              <Target className="h-6 w-6 text-emerald-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-300">Avg Progress</p>
                <p className="text-xl font-bold text-teal-600">{overallStats.avgProgress}%</p>
              </div>
              <BarChart3 className="h-6 w-6 text-teal-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search initiatives by name, description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50"
            data-testid="input-search-initiatives"
          />
        </div>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-48 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="planning">Planning</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="on_hold">On Hold</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-56 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="digital_transformation">Digital Transformation</SelectItem>
            <SelectItem value="process_improvement">Process Improvement</SelectItem>
            <SelectItem value="technology_modernization">Technology Modernization</SelectItem>
            <SelectItem value="organizational_change">Organizational Change</SelectItem>
            <SelectItem value="infrastructure_upgrade">Infrastructure Upgrade</SelectItem>
          </SelectContent>
        </Select>
        <Button 
          onClick={handleCreate}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Initiative
        </Button>
      </div>

      {/* Initiatives List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mt-2"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : filteredInitiatives.length === 0 ? (
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
          <CardContent className="p-12 text-center">
            <Briefcase className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No initiatives found</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              {searchQuery || selectedStatus !== 'all' || selectedType !== 'all'
                ? 'No transformation initiatives match your current filters.'
                : 'No initiatives yet. Create your first one to get started.'}
            </p>
            <Button variant="outline" onClick={() => { setSearchQuery(''); setSelectedStatus('all'); setSelectedType('all'); }}>
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredInitiatives.map((initiative) => (
            <Card key={initiative.id} className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        {initiative.name}
                      </h3>
                      <Badge className={getStatusColor(initiative.status)}>{initiative.status.replace('_', ' ')}</Badge>
                      <Badge className={getPriorityColor(initiative.priority)} variant="outline">
                        {initiative.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                      {initiative.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
                      <span className="flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        {initiative.programManager || 'Unassigned'}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {initiative.startDate || 'TBD'} - {initiative.targetDate || 'TBD'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    {getHealthIcon(initiative.healthStatus)}
                    <span className="text-sm font-medium text-slate-900 dark:text-white capitalize">
                      {initiative.healthStatus}
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(initiative)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(initiative)}
                          className="text-red-600 dark:text-red-400"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-600 dark:text-slate-300">Progress</span>
                        <span className="font-medium">{initiative.progressPercent || 0}%</span>
                      </div>
                      <Progress value={initiative.progressPercent || 0} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-600 dark:text-slate-300">Budget Utilization</span>
                        <span className="font-medium">
                          {initiative.budget ? Math.round(((initiative.spentBudget || 0) / initiative.budget) * 100) : 0}%
                        </span>
                      </div>
                      <Progress 
                        value={initiative.budget ? ((initiative.spentBudget || 0) / initiative.budget) * 100 : 0} 
                        className="h-2" 
                      />
                      <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
                        <span>Spent: {formatCurrency(initiative.spentBudget)}</span>
                        <span>Budget: {formatCurrency(initiative.budget)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-white text-sm mb-2">Business Impact</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600 dark:text-slate-300">Expected Value</span>
                          <span className="font-medium text-emerald-600">
                            {formatCurrency(initiative.businessValue)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600 dark:text-slate-300">ROI</span>
                          <span className="font-medium">
                            {initiative.budget && initiative.businessValue ? Math.round((initiative.businessValue / initiative.budget - 1) * 100) : 0}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600 dark:text-slate-300">Risk Level</span>
                          <Badge className={getRiskColor(initiative.riskLevel)} variant="outline">
                            {initiative.riskLevel}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200/50 dark:border-slate-700/50 mt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center">
                        <Building className="h-3 w-3 mr-1" />
                        {(initiative.stakeholders as string[] || []).length} stakeholders
                      </span>
                      {(initiative.dependencies as string[] || []).length > 0 && (
                        <span className="flex items-center">
                          <GitBranch className="h-3 w-3 mr-1" />
                          {(initiative.dependencies as string[]).length} dependencies
                        </span>
                      )}
                      {(initiative.capabilities as string[] || []).length > 0 && (
                        <span className="flex items-center">
                          <Target className="h-3 w-3 mr-1" />
                          {(initiative.capabilities as string[]).length} capabilities
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-1">
                      {(initiative.tags as string[] || []).map((tag: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Initiative Form Dialog */}
      <InitiativeForm
        open={dialogOpen}
        onOpenChange={handleDialogChange}
        onSubmit={handleFormSubmit}
        defaultValues={editingInitiative}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}


