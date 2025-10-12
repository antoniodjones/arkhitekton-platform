import { useState } from 'react';
import { useLocation } from 'wouter';
import { GovernanceHeader } from '@/components/layout/governance-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Palette,
  Search,
  Plus,
  Upload,
  Boxes,
  LayoutGrid,
  List,
  Star,
  Copy,
  Share2,
  Trash2,
  Users,
  Clock,
  ChevronRight,
  Cloud,
  Database,
  Workflow,
  Building2,
  Sparkles,
} from 'lucide-react';
import { SiAmazon, SiGooglecloud, SiOracle } from 'react-icons/si';

// Mock data for diagrams
const mockDiagrams = [
  {
    id: 'diagram-1',
    name: 'Healthcare System',
    framework: 'ArchiMate',
    thumbnail: null,
    lastModified: '2 hours ago',
    owner: 'Antonio Jones',
    collaborators: [
      { id: '1', name: 'Antonio Jones', online: true },
      { id: '2', name: 'Sarah Chen', online: false },
      { id: '3', name: 'Mike Wilson', online: true },
    ],
  },
  {
    id: 'diagram-2',
    name: 'AWS Cloud Architecture',
    framework: 'AWS',
    thumbnail: null,
    lastModified: 'Yesterday',
    owner: 'You',
    collaborators: [{ id: '1', name: 'You', online: true }],
  },
  {
    id: 'diagram-3',
    name: 'Digital Transformation BPMN',
    framework: 'BPMN',
    thumbnail: null,
    lastModified: '3 days ago',
    owner: 'Sarah Chen',
    collaborators: [
      { id: '1', name: 'Sarah Chen', online: false },
      { id: '2', name: 'John Doe', online: false },
      { id: '3', name: 'Jane Smith', online: true },
      { id: '4', name: 'Bob Johnson', online: false },
      { id: '5', name: 'Alice Brown', online: true },
    ],
  },
];

// Framework categories with template counts
const frameworkCategories = [
  { 
    id: 'aws', 
    name: 'AWS Cloud', 
    icon: SiAmazon, 
    color: 'from-orange-500 to-orange-600',
    templates: 45 
  },
  { 
    id: 'azure', 
    name: 'Azure', 
    icon: Cloud, 
    color: 'from-blue-500 to-blue-600',
    templates: 38 
  },
  { 
    id: 'archimate', 
    name: 'ArchiMate', 
    icon: Building2, 
    color: 'from-purple-500 to-purple-600',
    templates: 27 
  },
  { 
    id: 'bpmn', 
    name: 'BPMN', 
    icon: Workflow, 
    color: 'from-green-500 to-green-600',
    templates: 32 
  },
  { 
    id: 'togaf', 
    name: 'TOGAF', 
    icon: Building2, 
    color: 'from-teal-500 to-teal-600',
    templates: 19 
  },
  { 
    id: 'gcp', 
    name: 'GCP', 
    icon: SiGooglecloud, 
    color: 'from-green-500 to-green-600',
    templates: 41 
  },
  { 
    id: 'data', 
    name: 'Data Model', 
    icon: Database, 
    color: 'from-gray-500 to-gray-600',
    templates: 15 
  },
  { 
    id: 'custom', 
    name: 'Custom', 
    icon: Sparkles, 
    color: 'from-pink-500 to-purple-600',
    templates: 0 
  },
];

export default function DesignStudioHome() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [frameworkFilter, setFrameworkFilter] = useState('all');
  const [ownerFilter, setOwnerFilter] = useState('anyone');
  const [sortBy, setSortBy] = useState('last-opened');

  // Filter and sort diagrams
  const filteredDiagrams = mockDiagrams.filter(diagram => {
    const matchesSearch = diagram.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         diagram.framework.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFramework = frameworkFilter === 'all' || diagram.framework === frameworkFilter;
    const matchesOwner = ownerFilter === 'anyone' || 
                        (ownerFilter === 'me' && diagram.owner === 'You');
    return matchesSearch && matchesFramework && matchesOwner;
  });

  const handleDiagramClick = (diagramId: string) => {
    setLocation(`/studio/canvas?diagram=${diagramId}`);
  };

  const handleTemplateClick = (frameworkId: string) => {
    console.log('Open template gallery for:', frameworkId);
    // TODO: Open template gallery modal
  };

  const handleNewDiagram = () => {
    setLocation('/studio/canvas?new=true');
  };

  return (
    <div className="h-full overflow-hidden flex flex-col">
      <GovernanceHeader 
        moduleTitle="Design Studio" 
        moduleIcon={Palette} 
      />

      {/* Header Actions */}
      <div className="border-b bg-background px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Find diagrams, templates, frameworks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                data-testid="input-search-diagrams"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm"
              data-testid="button-templates"
            >
              Templates
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              data-testid="button-import"
            >
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button 
              size="sm"
              onClick={handleNewDiagram}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
              data-testid="button-new-diagram"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Diagram
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-8">
          {/* Recently Opened Diagrams */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Recently Opened Diagrams</h2>
              <Button variant="ghost" size="sm" data-testid="button-view-all-recent">
                View all <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockDiagrams.slice(0, 3).map((diagram) => (
                <Card 
                  key={diagram.id}
                  className="group cursor-pointer hover:shadow-lg transition-all"
                  onClick={() => handleDiagramClick(diagram.id)}
                  data-testid={`card-diagram-${diagram.id}`}
                >
                  <CardContent className="p-0">
                    {/* Thumbnail */}
                    <div className="h-40 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center border-b">
                      <Palette className="h-12 w-12 text-muted-foreground opacity-50" />
                    </div>
                    {/* Metadata */}
                    <div className="p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-sm mb-1">{diagram.name}</h3>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{diagram.lastModified}</span>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {diagram.framework}
                        </Badge>
                      </div>
                      {/* Collaborators */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center -space-x-2">
                          {diagram.collaborators.slice(0, 3).map((collab) => (
                            <Avatar key={collab.id} className="h-6 w-6 border-2 border-background">
                              <AvatarFallback className="text-xs">
                                {collab.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                              {collab.online && (
                                <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border border-background" />
                              )}
                            </Avatar>
                          ))}
                          {diagram.collaborators.length > 3 && (
                            <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                              <span className="text-xs text-muted-foreground">
                                +{diagram.collaborators.length - 3}
                              </span>
                            </div>
                          )}
                        </div>
                        {/* Quick Actions */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 w-7 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log('Star diagram');
                            }}
                            data-testid={`button-star-${diagram.id}`}
                          >
                            <Star className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 w-7 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log('Duplicate diagram');
                            }}
                            data-testid={`button-duplicate-${diagram.id}`}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Framework Templates */}
          <section>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-foreground mb-1">Start with a Framework</h2>
              <p className="text-sm text-muted-foreground">Choose a framework to browse templates or start fresh</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {frameworkCategories.map((framework) => {
                const IconComponent = framework.icon;
                return (
                  <Card 
                    key={framework.id}
                    className="group cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all"
                    onClick={() => handleTemplateClick(framework.id)}
                    data-testid={`card-framework-${framework.id}`}
                  >
                    <CardContent className="p-6 text-center">
                      <div className={`inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${framework.color} mb-3`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-medium text-sm mb-1">{framework.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {framework.templates === 0 ? 'Start fresh' : `${framework.templates} templates`} →
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* My Diagrams Table/Grid */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">My Diagrams</h2>
              <div className="flex items-center gap-3">
                {/* Filters */}
                <Select value={frameworkFilter} onValueChange={setFrameworkFilter}>
                  <SelectTrigger className="w-[160px] h-9" data-testid="filter-framework">
                    <SelectValue placeholder="All Frameworks" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Frameworks</SelectItem>
                    <SelectItem value="AWS">AWS</SelectItem>
                    <SelectItem value="Azure">Azure</SelectItem>
                    <SelectItem value="ArchiMate">ArchiMate</SelectItem>
                    <SelectItem value="BPMN">BPMN</SelectItem>
                    <SelectItem value="TOGAF">TOGAF</SelectItem>
                    <SelectItem value="GCP">GCP</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={ownerFilter} onValueChange={setOwnerFilter}>
                  <SelectTrigger className="w-[140px] h-9" data-testid="filter-owner">
                    <SelectValue placeholder="Owner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="anyone">Owned by anyone</SelectItem>
                    <SelectItem value="me">Owned by me</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[140px] h-9" data-testid="select-sort">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last-opened">Last opened</SelectItem>
                    <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                    <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                    <SelectItem value="framework">Framework</SelectItem>
                  </SelectContent>
                </Select>
                {/* View Toggle */}
                <div className="flex items-center gap-1 border rounded-md p-1">
                  <Button
                    variant={viewMode === 'cards' ? 'secondary' : 'ghost'}
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => setViewMode('cards')}
                    data-testid="button-view-cards"
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'table' ? 'secondary' : 'ghost'}
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => setViewMode('table')}
                    data-testid="button-view-table"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Table View */}
            {viewMode === 'table' && (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Framework</TableHead>
                      <TableHead>Last Modified</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Collaborators</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDiagrams.map((diagram) => (
                      <TableRow 
                        key={diagram.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleDiagramClick(diagram.id)}
                        data-testid={`row-diagram-${diagram.id}`}
                      >
                        <TableCell className="font-medium">{diagram.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{diagram.framework}</Badge>
                        </TableCell>
                        <TableCell>{diagram.lastModified}</TableCell>
                        <TableCell>{diagram.owner}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center -space-x-2">
                              {diagram.collaborators.slice(0, 3).map((collab) => (
                                <Avatar key={collab.id} className="h-6 w-6 border-2 border-background">
                                  <AvatarFallback className="text-xs">
                                    {collab.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                  {collab.online && (
                                    <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border border-background" />
                                  )}
                                </Avatar>
                              ))}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              ({diagram.collaborators.length})
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                console.log('Star');
                              }}
                              data-testid={`button-star-table-${diagram.id}`}
                            >
                              <Star className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                console.log('Duplicate');
                              }}
                              data-testid={`button-duplicate-table-${diagram.id}`}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                console.log('Share');
                              }}
                              data-testid={`button-share-table-${diagram.id}`}
                            >
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Cards View */}
            {viewMode === 'cards' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDiagrams.map((diagram) => (
                  <Card 
                    key={diagram.id}
                    className="group cursor-pointer hover:shadow-lg transition-all"
                    onClick={() => handleDiagramClick(diagram.id)}
                    data-testid={`card-my-diagram-${diagram.id}`}
                  >
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-sm mb-1">{diagram.name}</h3>
                          <p className="text-xs text-muted-foreground">{diagram.owner} • {diagram.lastModified}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {diagram.framework}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center -space-x-2">
                          {diagram.collaborators.slice(0, 3).map((collab) => (
                            <Avatar key={collab.id} className="h-6 w-6 border-2 border-background">
                              <AvatarFallback className="text-xs">
                                {collab.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                              {collab.online && (
                                <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border border-background" />
                              )}
                            </Avatar>
                          ))}
                          {diagram.collaborators.length > 3 && (
                            <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                              <span className="text-xs text-muted-foreground">
                                +{diagram.collaborators.length - 3}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 w-7 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            data-testid={`button-star-grid-${diagram.id}`}
                          >
                            <Star className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 w-7 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            data-testid={`button-duplicate-grid-${diagram.id}`}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
