import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { PlanLayout } from '@/components/plan/plan-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowRight,
  Link2,
  Search,
  Filter,
  Layers,
  GitBranch,
  Zap,
  Bug,
  Palette,
  Gauge,
  RefreshCw,
  Shield,
  Accessibility,
  Wrench
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Story {
  id: string;
  title: string;
  status: string;
  priority: string;
  storyPoints: number;
  enhances?: string[];
  enhancementType?: string;
  rationale?: string;
}

const ENHANCEMENT_TYPES = [
  { value: 'feature-evolution', label: 'Feature Evolution', icon: Zap, color: 'bg-purple-100 text-purple-700 border-purple-300' },
  { value: 'bug-fix', label: 'Bug Fix', icon: Bug, color: 'bg-red-100 text-red-700 border-red-300' },
  { value: 'ux-improvement', label: 'UX Improvement', icon: Palette, color: 'bg-pink-100 text-pink-700 border-pink-300' },
  { value: 'performance', label: 'Performance', icon: Gauge, color: 'bg-amber-100 text-amber-700 border-amber-300' },
  { value: 'refactoring', label: 'Refactoring', icon: RefreshCw, color: 'bg-blue-100 text-blue-700 border-blue-300' },
  { value: 'security', label: 'Security', icon: Shield, color: 'bg-green-100 text-green-700 border-green-300' },
  { value: 'accessibility', label: 'Accessibility', icon: Accessibility, color: 'bg-indigo-100 text-indigo-700 border-indigo-300' },
  { value: 'technical-debt', label: 'Technical Debt', icon: Wrench, color: 'bg-gray-100 text-gray-700 border-gray-300' },
];

const getTypeInfo = (type?: string) => {
  return ENHANCEMENT_TYPES.find(t => t.value === type) || { 
    value: 'unknown', 
    label: 'Unknown', 
    icon: Link2, 
    color: 'bg-gray-100 text-gray-500 border-gray-200' 
  };
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'done': return 'bg-green-100 text-green-700';
    case 'in-progress': return 'bg-blue-100 text-blue-700';
    case 'review': return 'bg-purple-100 text-purple-700';
    case 'sprint': return 'bg-indigo-100 text-indigo-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

export default function PlanEnhancements() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Fetch all stories
  const { data: storiesResponse, isLoading } = useQuery<{ items: Story[] }>({
    queryKey: ['/api/user-stories', { pageSize: 500 }],
    queryFn: async () => {
      const response = await fetch('/api/user-stories?pageSize=500');
      return response.json();
    },
  });

  const stories = storiesResponse?.items || [];

  // Filter to only enhancement stories (those with enhances array populated)
  const enhancementStories = stories.filter(s => s.enhances && s.enhances.length > 0);

  // Apply filters
  const filteredStories = enhancementStories.filter(story => {
    if (searchQuery && !story.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !story.id.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (typeFilter !== 'all' && story.enhancementType !== typeFilter) {
      return false;
    }
    return true;
  });

  // Group by what they enhance
  const enhancedStoriesMap = new Map<string, Story[]>();
  filteredStories.forEach(story => {
    story.enhances?.forEach(enhancedId => {
      const existing = enhancedStoriesMap.get(enhancedId) || [];
      enhancedStoriesMap.set(enhancedId, [...existing, story]);
    });
  });

  // Get details of enhanced stories
  const enhancedStoryIds = Array.from(enhancedStoriesMap.keys());
  const enhancedStoriesDetails = stories.filter(s => enhancedStoryIds.includes(s.id));

  // Stats
  const totalEnhancements = enhancementStories.length;
  const byType = ENHANCEMENT_TYPES.map(type => ({
    ...type,
    count: enhancementStories.filter(s => s.enhancementType === type.value).length
  })).filter(t => t.count > 0);

  return (
    <PlanLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <GitBranch className="w-6 h-6 text-purple-500" />
              Enhancement Report
            </h2>
            <p className="text-muted-foreground">
              View all enhancement stories grouped by what they improve
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search enhancements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-64"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {ENHANCEMENT_TYPES.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <Card className="bg-purple-50 dark:bg-purple-950/20 border-purple-200">
            <CardContent className="pt-4">
              <div className="text-3xl font-bold text-purple-700">{totalEnhancements}</div>
              <div className="text-sm text-purple-600">Total Enhancements</div>
            </CardContent>
          </Card>
          {byType.slice(0, 5).map(type => {
            const Icon = type.icon;
            return (
              <Card key={type.value} className={cn("border", type.color.split(' ')[0])}>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5" />
                    <span className="text-2xl font-bold">{type.count}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">{type.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Enhancement List by Original Story */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Grouped by Enhanced Story</h3>
          
          {isLoading ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Loading enhancements...
              </CardContent>
            </Card>
          ) : enhancedStoryIds.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Link2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-lg font-medium text-muted-foreground">No enhancement stories found</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Create stories with the "Enhances" field populated to see them here
                </p>
              </CardContent>
            </Card>
          ) : (
            enhancedStoriesDetails.map(originalStory => {
              const enhancements = enhancedStoriesMap.get(originalStory.id) || [];
              
              return (
                <Card key={originalStory.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2 text-base">
                          <Layers className="w-4 h-4 text-muted-foreground" />
                          <span className="font-mono text-sm text-muted-foreground">{originalStory.id}</span>
                        </CardTitle>
                        <CardDescription className="text-foreground font-medium">
                          {originalStory.title}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className={getStatusColor(originalStory.status)}>
                        {originalStory.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground mb-3">
                      {enhancements.length} enhancement{enhancements.length !== 1 ? 's' : ''}
                    </div>
                    <div className="space-y-2">
                      {enhancements.map(enhancement => {
                        const typeInfo = getTypeInfo(enhancement.enhancementType);
                        const TypeIcon = typeInfo.icon;
                        
                        return (
                          <div 
                            key={enhancement.id}
                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <Badge variant="outline" className={cn("gap-1", typeInfo.color)}>
                                <TypeIcon className="w-3 h-3" />
                                {typeInfo.label}
                              </Badge>
                              <div>
                                <span className="font-mono text-xs text-muted-foreground mr-2">
                                  {enhancement.id}
                                </span>
                                <span className="text-sm">{enhancement.title}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">{enhancement.storyPoints} pts</Badge>
                              <Badge className={getStatusColor(enhancement.status)}>
                                {enhancement.status}
                              </Badge>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Rationale preview */}
                    {enhancements.some(e => e.rationale) && (
                      <div className="mt-4 pt-3 border-t">
                        <div className="text-xs text-muted-foreground mb-2">Rationales:</div>
                        {enhancements.filter(e => e.rationale).map(e => (
                          <div key={e.id} className="text-sm italic text-muted-foreground mb-1">
                            <span className="font-mono text-xs not-italic">{e.id}:</span> "{e.rationale?.substring(0, 100)}..."
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* All Enhancements Flat List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">All Enhancement Stories</h3>
          <Card>
            <CardContent className="p-0">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800 border-b">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">ID</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Title</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Type</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Enhances</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredStories.map(story => {
                    const typeInfo = getTypeInfo(story.enhancementType);
                    const TypeIcon = typeInfo.icon;
                    
                    return (
                      <tr key={story.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="px-4 py-3">
                          <span className="font-mono text-xs">{story.id}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm truncate max-w-md block">{story.title}</span>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="outline" className={cn("gap-1", typeInfo.color)}>
                            <TypeIcon className="w-3 h-3" />
                            {typeInfo.label}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {story.enhances?.map(id => (
                              <Badge key={id} variant="secondary" className="font-mono text-xs">
                                {id}
                              </Badge>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge className={getStatusColor(story.status)}>{story.status}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="outline">{story.storyPoints}</Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </div>
    </PlanLayout>
  );
}

