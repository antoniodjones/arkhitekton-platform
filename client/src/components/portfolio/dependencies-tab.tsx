import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  GitBranch, 
  Plus, 
  Search, 
  ArrowRight,
  Trash2,
  Link2,
  Package,
  Briefcase
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Application, Initiative, InitiativeApplicationLink, InsertInitiativeApplicationLink } from '@shared/schema';

const IMPACT_TYPE_COLORS: Record<string, string> = {
  impacted: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
  modernized: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
  replaced: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300',
  created: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
  retired: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
};

export function DependenciesTab() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newLink, setNewLink] = useState<Partial<InsertInitiativeApplicationLink>>({
    impactType: 'impacted',
  });

  // Fetch all data
  const { data: links = [], isLoading: linksLoading } = useQuery<InitiativeApplicationLink[]>({
    queryKey: ['/api/initiative-application-links'],
  });

  const { data: applications = [] } = useQuery<Application[]>({
    queryKey: ['/api/applications'],
  });

  const { data: initiatives = [] } = useQuery<Initiative[]>({
    queryKey: ['/api/initiatives'],
  });

  // Create link mutation
  const createMutation = useMutation({
    mutationFn: async (data: InsertInitiativeApplicationLink) => {
      return await apiRequest('POST', '/api/initiative-application-links', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/initiative-application-links'] });
      setDialogOpen(false);
      setNewLink({ impactType: 'impacted' });
      toast({
        title: 'Link created',
        description: 'The initiative-application link has been created.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to create link. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Delete link mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest('DELETE', `/api/initiative-application-links/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/initiative-application-links'] });
      toast({
        title: 'Link deleted',
        description: 'The link has been removed.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete link. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Create lookup maps
  const appMap = new Map(applications.map(a => [a.id, a]));
  const initMap = new Map(initiatives.map(i => [i.id, i]));

  // Enrich links with names
  const enrichedLinks = links.map(link => ({
    ...link,
    initiative: initMap.get(link.initiativeId),
    application: appMap.get(link.applicationId),
  })).filter(link => link.initiative && link.application);

  // Filter links
  const filteredLinks = enrichedLinks.filter(link => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    return (
      link.initiative?.name.toLowerCase().includes(searchLower) ||
      link.application?.name.toLowerCase().includes(searchLower)
    );
  });

  const handleCreateLink = () => {
    if (!newLink.initiativeId || !newLink.applicationId) {
      toast({
        title: 'Missing fields',
        description: 'Please select both an initiative and an application.',
        variant: 'destructive',
      });
      return;
    }
    createMutation.mutate(newLink as InsertInitiativeApplicationLink);
  };

  const handleDeleteLink = (link: InitiativeApplicationLink) => {
    if (window.confirm('Are you sure you want to remove this link?')) {
      deleteMutation.mutate(link.id);
    }
  };

  // Stats
  const stats = {
    totalLinks: links.length,
    initiativesWithLinks: new Set(links.map(l => l.initiativeId)).size,
    applicationsWithLinks: new Set(links.map(l => l.applicationId)).size,
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-300">Total Links</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">{stats.totalLinks}</p>
              </div>
              <Link2 className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-300">Linked Initiatives</p>
                <p className="text-xl font-bold text-purple-600">{stats.initiativesWithLinks}</p>
              </div>
              <Briefcase className="h-6 w-6 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-300">Linked Applications</p>
                <p className="text-xl font-bold text-orange-600">{stats.applicationsWithLinks}</p>
              </div>
              <Package className="h-6 w-6 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Add */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by initiative or application name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50"
          />
        </div>
        <Button 
          onClick={() => setDialogOpen(true)}
          className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Link
        </Button>
      </div>

      {/* Links List */}
      {linksLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : filteredLinks.length === 0 ? (
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
          <CardContent className="p-12 text-center">
            <GitBranch className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No dependencies found</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              {searchQuery 
                ? 'No links match your search.'
                : 'Create links between initiatives and applications to track dependencies.'}
            </p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create First Link
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredLinks.map((link) => (
            <Card key={link.id} className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    {/* Initiative */}
                    <div className="flex items-center space-x-2 min-w-0">
                      <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/20">
                        <Briefcase className="h-4 w-4 text-purple-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-slate-900 dark:text-white truncate">
                          {link.initiative?.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Initiative</p>
                      </div>
                    </div>

                    {/* Arrow with impact type */}
                    <div className="flex items-center space-x-2">
                      <ArrowRight className="h-4 w-4 text-slate-400" />
                      <Badge className={IMPACT_TYPE_COLORS[link.impactType]}>
                        {link.impactType}
                      </Badge>
                      <ArrowRight className="h-4 w-4 text-slate-400" />
                    </div>

                    {/* Application */}
                    <div className="flex items-center space-x-2 min-w-0">
                      <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/20">
                        <Package className="h-4 w-4 text-orange-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-slate-900 dark:text-white truncate">
                          {link.application?.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Application</p>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteLink(link)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {link.notes && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 pl-12">
                    {link.notes}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Link Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Initiative-Application Link</DialogTitle>
            <DialogDescription>
              Link an initiative to an application to track dependencies and impact.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label>Initiative *</Label>
              <Select
                value={newLink.initiativeId}
                onValueChange={(value) => setNewLink(prev => ({ ...prev, initiativeId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select initiative" />
                </SelectTrigger>
                <SelectContent>
                  {initiatives.map((init) => (
                    <SelectItem key={init.id} value={init.id}>
                      {init.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Application *</Label>
              <Select
                value={newLink.applicationId}
                onValueChange={(value) => setNewLink(prev => ({ ...prev, applicationId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select application" />
                </SelectTrigger>
                <SelectContent>
                  {applications.map((app) => (
                    <SelectItem key={app.id} value={app.id}>
                      {app.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Impact Type</Label>
              <Select
                value={newLink.impactType}
                onValueChange={(value) => setNewLink(prev => ({ ...prev, impactType: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select impact type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="impacted">Impacted</SelectItem>
                  <SelectItem value="modernized">Modernized</SelectItem>
                  <SelectItem value="replaced">Replaced</SelectItem>
                  <SelectItem value="created">Created</SelectItem>
                  <SelectItem value="retired">Retired</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Notes</Label>
              <Textarea
                placeholder="Optional notes about this dependency..."
                value={newLink.notes || ''}
                onChange={(e) => setNewLink(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateLink} disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Creating...' : 'Create Link'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


