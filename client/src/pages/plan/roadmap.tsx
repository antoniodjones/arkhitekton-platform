import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, differenceInDays, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, isWithinInterval, parseISO } from 'date-fns';
import { PlanLayout } from '@/components/plan/plan-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar,
  Target,
  Clock,
  CheckCircle2,
  AlertCircle,
  Layers
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Story {
  id: string;
  title: string;
  status: string;
  priority: string;
  storyPoints: number;
  epicId?: string;
  targetDate?: string;
  startedAt?: string;
  completedAt?: string;
}

interface Epic {
  id: string;
  name: string;
  description?: string;
  status: string;
  startDate?: string;
  endDate?: string;
  completionPercentage: number;
  totalStoryPoints: number;
  completedStoryPoints: number;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'done':
    case 'completed': return 'bg-green-500';
    case 'in-progress': return 'bg-blue-500';
    case 'review': return 'bg-purple-500';
    case 'sprint': return 'bg-indigo-500';
    default: return 'bg-gray-400';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority?.toLowerCase()) {
    case 'high': return 'border-red-400';
    case 'medium': return 'border-amber-400';
    case 'low': return 'border-blue-400';
    default: return 'border-gray-300';
  }
};

export default function PlanRoadmap() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'quarter'>('month');

  // Fetch stories
  const { data: storiesResponse } = useQuery<{ items: Story[] }>({
    queryKey: ['/api/user-stories', { pageSize: 500 }],
    queryFn: async () => {
      const response = await fetch('/api/user-stories?pageSize=500');
      return response.json();
    },
  });

  // Fetch epics
  const { data: epicsResponse } = useQuery<{ data: Epic[] }>({
    queryKey: ['/api/epics'],
  });

  const stories = storiesResponse?.items || [];
  const epics = epicsResponse?.data || [];

  // Calculate date range based on view mode
  const getDateRange = () => {
    if (viewMode === 'quarter') {
      const start = startOfMonth(subMonths(currentDate, 1));
      const end = endOfMonth(addMonths(currentDate, 1));
      return { start, end };
    }
    return { start: startOfMonth(currentDate), end: endOfMonth(currentDate) };
  };

  const { start: rangeStart, end: rangeEnd } = getDateRange();
  const totalDays = differenceInDays(rangeEnd, rangeStart) + 1;

  // Filter stories with dates
  const storiesWithDates = stories.filter(s => s.targetDate || s.startedAt || s.completedAt);

  // Group stories by epic
  const storiesByEpic = new Map<string, Story[]>();
  const independentStories: Story[] = [];

  storiesWithDates.forEach(story => {
    if (story.epicId) {
      const existing = storiesByEpic.get(story.epicId) || [];
      storiesByEpic.set(story.epicId, [...existing, story]);
    } else {
      independentStories.push(story);
    }
  });

  // Calculate position and width for a story bar
  const getBarStyle = (story: Story) => {
    const startDate = story.startedAt ? parseISO(story.startedAt) : 
                      story.targetDate ? parseISO(story.targetDate) : null;
    const endDate = story.completedAt ? parseISO(story.completedAt) : 
                    story.targetDate ? parseISO(story.targetDate) : null;

    if (!startDate && !endDate) return null;

    const effectiveStart = startDate || endDate!;
    const effectiveEnd = endDate || startDate!;

    const startOffset = Math.max(0, differenceInDays(effectiveStart, rangeStart));
    const duration = Math.max(1, differenceInDays(effectiveEnd, effectiveStart) + 1);
    
    const left = (startOffset / totalDays) * 100;
    const width = Math.min((duration / totalDays) * 100, 100 - left);

    if (left > 100 || left + width < 0) return null;

    return { left: `${left}%`, width: `${Math.max(width, 2)}%` };
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => 
      direction === 'prev' ? subMonths(prev, viewMode === 'quarter' ? 3 : 1) 
                           : addMonths(prev, viewMode === 'quarter' ? 3 : 1)
    );
  };

  // Generate day labels
  const days = eachDayOfInterval({ start: rangeStart, end: rangeEnd });
  const weekLabels = days.filter((_, i) => i % 7 === 0);

  return (
    <PlanLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Roadmap</h2>
            <p className="text-muted-foreground">
              Timeline view of epics and stories with target dates
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Select value={viewMode} onValueChange={(v: 'month' | 'quarter') => setViewMode(v)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="quarter">Quarter</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => navigateMonth('prev')}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="min-w-32 text-center font-medium">
                {format(currentDate, viewMode === 'quarter' ? 'QQQ yyyy' : 'MMMM yyyy')}
              </span>
              <Button variant="outline" size="icon" onClick={() => navigateMonth('next')}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            <Button variant="outline" onClick={() => setCurrentDate(new Date())}>
              Today
            </Button>
          </div>
        </div>

        {/* Timeline */}
        <Card>
          <CardContent className="p-0">
            {/* Date Header */}
            <div className="border-b bg-gray-50 dark:bg-gray-800 px-4 py-2">
              <div className="flex">
                <div className="w-64 shrink-0 font-medium text-sm text-muted-foreground">
                  Item
                </div>
                <div className="flex-1 relative h-8">
                  {weekLabels.map((date, i) => (
                    <div 
                      key={i}
                      className="absolute text-xs text-muted-foreground"
                      style={{ left: `${(differenceInDays(date, rangeStart) / totalDays) * 100}%` }}
                    >
                      {format(date, 'MMM d')}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Today line indicator */}
            <div className="relative">
              {isWithinInterval(new Date(), { start: rangeStart, end: rangeEnd }) && (
                <div 
                  className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
                  style={{ left: `calc(256px + ${(differenceInDays(new Date(), rangeStart) / totalDays) * (100)}% * (100% - 256px) / 100%)` }}
                />
              )}

              {/* Epics */}
              {epics.map(epic => {
                const epicStories = storiesByEpic.get(epic.id) || [];
                
                return (
                  <div key={epic.id} className="border-b last:border-0">
                    {/* Epic Row */}
                    <div className="flex items-center hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <div className="w-64 shrink-0 px-4 py-3 flex items-center gap-2">
                        <Layers className="w-4 h-4 text-purple-500" />
                        <span className="font-medium truncate">{epic.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {epic.completionPercentage}%
                        </Badge>
                      </div>
                      <div className="flex-1 h-10 relative">
                        {epic.startDate && epic.endDate && (
                          <div 
                            className="absolute top-2 h-6 bg-purple-200 dark:bg-purple-900/50 rounded border border-purple-400"
                            style={{
                              left: `${Math.max(0, (differenceInDays(parseISO(epic.startDate), rangeStart) / totalDays) * 100)}%`,
                              width: `${(differenceInDays(parseISO(epic.endDate), parseISO(epic.startDate)) / totalDays) * 100}%`
                            }}
                          />
                        )}
                      </div>
                    </div>

                    {/* Stories under Epic */}
                    {epicStories.map(story => {
                      const barStyle = getBarStyle(story);
                      return (
                        <div key={story.id} className="flex items-center hover:bg-gray-50 dark:hover:bg-gray-800/50 pl-6">
                          <div className="w-58 shrink-0 px-4 py-2 flex items-center gap-2">
                            <div className={cn("w-2 h-2 rounded-full", getStatusColor(story.status))} />
                            <span className="text-sm truncate max-w-48">{story.title}</span>
                          </div>
                          <div className="flex-1 h-8 relative">
                            {barStyle && (
                              <div 
                                className={cn(
                                  "absolute top-1.5 h-5 rounded text-xs flex items-center px-2 text-white truncate",
                                  getStatusColor(story.status),
                                  getPriorityColor(story.priority)
                                )}
                                style={barStyle}
                                title={`${story.title} (${story.storyPoints} pts)`}
                              >
                                {story.id}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}

              {/* Independent Stories */}
              {independentStories.length > 0 && (
                <div className="border-t">
                  <div className="flex items-center bg-gray-50 dark:bg-gray-800">
                    <div className="w-64 shrink-0 px-4 py-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        Independent Stories ({independentStories.length})
                      </span>
                    </div>
                    <div className="flex-1" />
                  </div>
                  {independentStories.map(story => {
                    const barStyle = getBarStyle(story);
                    return (
                      <div key={story.id} className="flex items-center hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <div className="w-64 shrink-0 px-4 py-2 flex items-center gap-2">
                          <div className={cn("w-2 h-2 rounded-full", getStatusColor(story.status))} />
                          <span className="text-sm truncate">{story.title}</span>
                        </div>
                        <div className="flex-1 h-8 relative">
                          {barStyle && (
                            <div 
                              className={cn(
                                "absolute top-1.5 h-5 rounded text-xs flex items-center px-2 text-white truncate",
                                getStatusColor(story.status)
                              )}
                              style={barStyle}
                              title={story.title}
                            >
                              {story.id}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Empty State */}
              {storiesWithDates.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                  <Calendar className="w-12 h-12 mb-4 opacity-50" />
                  <p className="text-lg font-medium">No stories with dates</p>
                  <p className="text-sm">Add target dates to your stories to see them on the roadmap</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Legend */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Legend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-400" />
                <span>Backlog</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-500" />
                <span>Sprint</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span>In Progress</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500" />
                <span>Review</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span>Done</span>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <div className="w-6 h-0.5 bg-red-500" />
                <span>Today</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PlanLayout>
  );
}

