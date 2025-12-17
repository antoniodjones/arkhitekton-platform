import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, differenceInDays, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, isWithinInterval, parseISO, addDays } from 'date-fns';
import { PlanLayout } from '@/components/plan/plan-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown,
  ChevronUp,
  Calendar,
  Layers,
  Sparkles,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Story {
  id: string;
  title: string;
  status: string;
  priority: string;
  storyPoints: number;
  epicId?: string;
  feature?: string; // Sprint label like "Sprint W1"
  targetDate?: string;
  startedAt?: string;
  completedAt?: string;
  labels?: string[];
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

// Vibrant color palette for swimlanes
const SWIMLANE_COLORS = [
  { bg: 'bg-gradient-to-r from-rose-500 to-pink-500', light: 'bg-rose-100 dark:bg-rose-900/30', border: 'border-rose-400', text: 'text-rose-700 dark:text-rose-300' },
  { bg: 'bg-gradient-to-r from-orange-500 to-amber-500', light: 'bg-orange-100 dark:bg-orange-900/30', border: 'border-orange-400', text: 'text-orange-700 dark:text-orange-300' },
  { bg: 'bg-gradient-to-r from-emerald-500 to-teal-500', light: 'bg-emerald-100 dark:bg-emerald-900/30', border: 'border-emerald-400', text: 'text-emerald-700 dark:text-emerald-300' },
  { bg: 'bg-gradient-to-r from-blue-500 to-cyan-500', light: 'bg-blue-100 dark:bg-blue-900/30', border: 'border-blue-400', text: 'text-blue-700 dark:text-blue-300' },
  { bg: 'bg-gradient-to-r from-violet-500 to-purple-500', light: 'bg-violet-100 dark:bg-violet-900/30', border: 'border-violet-400', text: 'text-violet-700 dark:text-violet-300' },
  { bg: 'bg-gradient-to-r from-fuchsia-500 to-pink-500', light: 'bg-fuchsia-100 dark:bg-fuchsia-900/30', border: 'border-fuchsia-400', text: 'text-fuchsia-700 dark:text-fuchsia-300' },
  { bg: 'bg-gradient-to-r from-lime-500 to-green-500', light: 'bg-lime-100 dark:bg-lime-900/30', border: 'border-lime-400', text: 'text-lime-700 dark:text-lime-300' },
  { bg: 'bg-gradient-to-r from-sky-500 to-indigo-500', light: 'bg-sky-100 dark:bg-sky-900/30', border: 'border-sky-400', text: 'text-sky-700 dark:text-sky-300' },
  { bg: 'bg-gradient-to-r from-red-500 to-rose-500', light: 'bg-red-100 dark:bg-red-900/30', border: 'border-red-400', text: 'text-red-700 dark:text-red-300' },
  { bg: 'bg-gradient-to-r from-yellow-500 to-orange-500', light: 'bg-yellow-100 dark:bg-yellow-900/30', border: 'border-yellow-400', text: 'text-yellow-700 dark:text-yellow-300' },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'done': return '✓';
    case 'in-progress': return '▶';
    case 'review': return '◎';
    default: return '○';
  }
};

type GroupMode = 'epic' | 'sprint' | 'none';

export default function PlanRoadmap() {
  const [currentDate, setCurrentDate] = useState(new Date('2026-01-15')); // Start at Jan 2026 for Wiki stories
  const [viewMode, setViewMode] = useState<'month' | 'quarter' | 'half'>('quarter');
  const [groupMode, setGroupMode] = useState<GroupMode>('sprint');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['all']));

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
    if (viewMode === 'half') {
      const start = startOfMonth(subMonths(currentDate, 2));
      const end = endOfMonth(addMonths(currentDate, 3));
      return { start, end };
    }
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
  const storiesWithDates = useMemo(() => 
    stories.filter(s => s.targetDate || s.startedAt || s.completedAt),
    [stories]
  );

  // Group stories by selected mode
  const groupedData = useMemo(() => {
    if (groupMode === 'sprint') {
      // Group by Sprint (feature field contains "Sprint W1", etc.)
      const groups = new Map<string, Story[]>();
      storiesWithDates.forEach(story => {
        const sprint = story.feature || 'Unplanned';
        const existing = groups.get(sprint) || [];
        groups.set(sprint, [...existing, story]);
      });
      
      // Sort sprints by name
      return Array.from(groups.entries())
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([name, items], index) => ({
          id: name,
          name,
          type: 'sprint' as const,
          stories: items,
          color: SWIMLANE_COLORS[index % SWIMLANE_COLORS.length],
          startDate: items.reduce((min, s) => {
            const d = s.startedAt || s.targetDate;
            return d && (!min || d < min) ? d : min;
          }, null as string | null),
          endDate: items.reduce((max, s) => {
            const d = s.completedAt || s.targetDate;
            return d && (!max || d > max) ? d : max;
          }, null as string | null),
          totalPoints: items.reduce((sum, s) => sum + (s.storyPoints || 0), 0),
          completedPoints: items.filter(s => s.status === 'done').reduce((sum, s) => sum + (s.storyPoints || 0), 0),
        }));
    } else if (groupMode === 'epic') {
      // Group by Epic
      const groups = new Map<string, Story[]>();
      const orphans: Story[] = [];
      
      storiesWithDates.forEach(story => {
        if (story.epicId) {
          const existing = groups.get(story.epicId) || [];
          groups.set(story.epicId, [...existing, story]);
        } else {
          orphans.push(story);
        }
      });
      
      const epicGroups = Array.from(groups.entries()).map(([epicId, items], index) => {
        const epic = epics.find(e => e.id === epicId);
        return {
          id: epicId,
          name: epic?.name || epicId,
          type: 'epic' as const,
          stories: items,
          color: SWIMLANE_COLORS[index % SWIMLANE_COLORS.length],
          startDate: epic?.startDate || items.reduce((min, s) => {
            const d = s.startedAt || s.targetDate;
            return d && (!min || d < min) ? d : min;
          }, null as string | null),
          endDate: epic?.endDate || items.reduce((max, s) => {
            const d = s.completedAt || s.targetDate;
            return d && (!max || d > max) ? d : max;
          }, null as string | null),
          totalPoints: items.reduce((sum, s) => sum + (s.storyPoints || 0), 0),
          completedPoints: items.filter(s => s.status === 'done').reduce((sum, s) => sum + (s.storyPoints || 0), 0),
        };
      });
      
      if (orphans.length > 0) {
        epicGroups.push({
          id: 'independent',
          name: 'Independent Stories',
          type: 'epic' as const,
          stories: orphans,
          color: SWIMLANE_COLORS[epicGroups.length % SWIMLANE_COLORS.length],
          startDate: null,
          endDate: null,
          totalPoints: orphans.reduce((sum, s) => sum + (s.storyPoints || 0), 0),
          completedPoints: orphans.filter(s => s.status === 'done').reduce((sum, s) => sum + (s.storyPoints || 0), 0),
        });
      }
      
      return epicGroups;
    } else {
      // No grouping - flat list
      return [{
        id: 'all',
        name: 'All Stories',
        type: 'none' as const,
        stories: storiesWithDates,
        color: SWIMLANE_COLORS[0],
        startDate: null,
        endDate: null,
        totalPoints: storiesWithDates.reduce((sum, s) => sum + (s.storyPoints || 0), 0),
        completedPoints: storiesWithDates.filter(s => s.status === 'done').reduce((sum, s) => sum + (s.storyPoints || 0), 0),
      }];
    }
  }, [storiesWithDates, groupMode, epics]);

  // Calculate bar position for a story
  const getBarStyle = (story: Story) => {
    const startDate = story.startedAt ? parseISO(story.startedAt) : 
                      story.targetDate ? parseISO(story.targetDate) : null;
    // If no completedAt, assume 3-day duration from target
    const endDate = story.completedAt ? parseISO(story.completedAt) : 
                    story.targetDate ? addDays(parseISO(story.targetDate), 3) : null;

    if (!startDate && !endDate) return null;

    const effectiveStart = startDate || endDate!;
    const effectiveEnd = endDate || addDays(startDate!, 3);

    const startOffset = Math.max(0, differenceInDays(effectiveStart, rangeStart));
    const duration = Math.max(1, differenceInDays(effectiveEnd, effectiveStart) + 1);
    
    const left = (startOffset / totalDays) * 100;
    const width = Math.min((duration / totalDays) * 100, 100 - left);

    if (left > 100 || left + width < 0) return null;

    return { left: `${Math.max(0, left)}%`, width: `${Math.max(width, 1.5)}%` };
  };

  // Calculate bar position for a group
  const getGroupBarStyle = (group: { startDate: string | null, endDate: string | null }) => {
    if (!group.startDate || !group.endDate) return null;
    
    const startDate = parseISO(group.startDate);
    const endDate = parseISO(group.endDate);
    
    const startOffset = differenceInDays(startDate, rangeStart);
    const duration = differenceInDays(endDate, startDate) + 1;
    
    const left = (startOffset / totalDays) * 100;
    const width = (duration / totalDays) * 100;

    if (left > 100 || left + width < 0) return null;

    return { left: `${Math.max(0, left)}%`, width: `${Math.min(width, 100 - Math.max(0, left))}%` };
  };

  const toggleGroup = (groupId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

  const expandAll = () => {
    setExpandedGroups(new Set(groupedData.map(g => g.id)));
  };

  const collapseAll = () => {
    setExpandedGroups(new Set());
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const months = viewMode === 'half' ? 6 : viewMode === 'quarter' ? 3 : 1;
    setCurrentDate(prev => 
      direction === 'prev' ? subMonths(prev, months) : addMonths(prev, months)
    );
  };

  // Generate day labels
  const days = eachDayOfInterval({ start: rangeStart, end: rangeEnd });
  const weekLabels = days.filter((_, i) => i % 7 === 0);

  return (
    <PlanLayout>
      <TooltipProvider>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-amber-500" />
                Roadmap
              </h2>
              <p className="text-muted-foreground">
                {storiesWithDates.length} stories with dates • {groupedData.length} {groupMode === 'sprint' ? 'sprints' : 'groups'}
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Group Mode */}
              <Select value={groupMode} onValueChange={(v: GroupMode) => setGroupMode(v)}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sprint">By Sprint</SelectItem>
                  <SelectItem value="epic">By Epic</SelectItem>
                  <SelectItem value="none">Flat List</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode */}
              <Select value={viewMode} onValueChange={(v: 'month' | 'quarter' | 'half') => setViewMode(v)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Month</SelectItem>
                  <SelectItem value="quarter">Quarter</SelectItem>
                  <SelectItem value="half">6 Months</SelectItem>
                </SelectContent>
              </Select>

              {/* Navigation */}
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => navigateMonth('prev')}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="min-w-40 text-center font-medium text-sm">
                  {format(rangeStart, 'MMM yyyy')} - {format(rangeEnd, 'MMM yyyy')}
                </span>
                <Button variant="outline" size="icon" onClick={() => navigateMonth('next')}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                Today
              </Button>
            </div>
          </div>

          {/* Expand/Collapse Controls */}
          {groupMode !== 'none' && (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={expandAll}>
                <ChevronDown className="w-4 h-4 mr-1" />
                Expand All
              </Button>
              <Button variant="ghost" size="sm" onClick={collapseAll}>
                <ChevronUp className="w-4 h-4 mr-1" />
                Collapse All
              </Button>
            </div>
          )}

          {/* Timeline */}
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              {/* Date Header */}
              <div className="border-b bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 px-4 py-3 sticky top-0 z-20">
                <div className="flex">
                  <div className="w-72 shrink-0 font-semibold text-sm text-muted-foreground flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    {groupMode === 'sprint' ? 'Sprint / Story' : groupMode === 'epic' ? 'Epic / Story' : 'Story'}
                  </div>
                  <div className="flex-1 relative h-8">
                    {weekLabels.map((date, i) => (
                      <div 
                        key={i}
                        className="absolute text-xs text-muted-foreground font-medium"
                        style={{ left: `${(differenceInDays(date, rangeStart) / totalDays) * 100}%` }}
                      >
                        {format(date, 'MMM d')}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Timeline Content */}
              <div className="relative">
                {/* Today line indicator */}
                {isWithinInterval(new Date(), { start: rangeStart, end: rangeEnd }) && (
                  <div 
                    className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-30"
                    style={{ left: `calc(288px + ${(differenceInDays(new Date(), rangeStart) / totalDays) * 100}% * (100% - 288px) / 100%)` }}
                  >
                    <div className="absolute -top-1 -left-2 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  </div>
                )}

                {/* Groups */}
                {groupedData.map((group, groupIndex) => {
                  const isExpanded = expandedGroups.has(group.id);
                  const groupBarStyle = getGroupBarStyle(group);
                  const completionPct = group.totalPoints > 0 
                    ? Math.round((group.completedPoints / group.totalPoints) * 100) 
                    : 0;

                  return (
                    <div 
                      key={group.id} 
                      className={cn(
                        "border-b last:border-0",
                        group.color.light
                      )}
                    >
                      {/* Group Header Row */}
                      <div 
                        className={cn(
                          "flex items-center cursor-pointer hover:opacity-90 transition-opacity",
                          group.color.light
                        )}
                        onClick={() => toggleGroup(group.id)}
                      >
                        <div className="w-72 shrink-0 px-4 py-3 flex items-center gap-3">
                          {groupMode !== 'none' && (
                            <button className="p-0.5 hover:bg-white/50 rounded">
                              {isExpanded ? (
                                <ChevronDown className="w-4 h-4" />
                              ) : (
                                <ChevronRight className="w-4 h-4" />
                              )}
                            </button>
                          )}
                          <div className={cn("w-3 h-3 rounded-full", group.color.bg)} />
                          <span className={cn("font-semibold truncate", group.color.text)}>
                            {group.name}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {group.stories.length} stories
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {group.totalPoints} pts
                          </Badge>
                          {completionPct > 0 && (
                            <Badge 
                              variant="outline" 
                              className={cn(
                                "text-xs",
                                completionPct === 100 ? "bg-green-100 text-green-700" : ""
                              )}
                            >
                              {completionPct}%
                            </Badge>
                          )}
                        </div>
                        <div className="flex-1 h-12 relative">
                          {groupBarStyle && (
                            <div 
                              className={cn(
                                "absolute top-3 h-6 rounded-lg shadow-sm flex items-center justify-center text-white text-xs font-medium",
                                group.color.bg
                              )}
                              style={groupBarStyle}
                            >
                              {group.startDate && group.endDate && (
                                <span className="truncate px-2">
                                  {format(parseISO(group.startDate), 'MMM d')} → {format(parseISO(group.endDate), 'MMM d')}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Stories within Group */}
                      {isExpanded && group.stories.map((story, storyIndex) => {
                        const barStyle = getBarStyle(story);
                        const storyColor = SWIMLANE_COLORS[(groupIndex * 3 + storyIndex) % SWIMLANE_COLORS.length];
                        const lineType = storyIndex % 3; // 0: straight, 1: zigzag, 2: dotted
                        
                        // Calculate line start position (end of bar)
                        const barEnd = barStyle ? parseFloat(barStyle.left) + parseFloat(barStyle.width) : 0;
                        
                        return (
                          <div 
                            key={story.id} 
                            className="flex items-center hover:bg-white/50 dark:hover:bg-black/20 transition-colors pl-8"
                          >
                            <div className="w-64 shrink-0 px-4 py-2 flex items-center gap-2">
                              <span className="text-xs w-4 text-center opacity-70">
                                {getStatusIcon(story.status)}
                              </span>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="text-sm truncate max-w-40 cursor-help">
                                    {story.title}
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent side="right" className="max-w-xs">
                                  <div className="space-y-1">
                                    <p className="font-semibold">{story.id}</p>
                                    <p>{story.title}</p>
                                    <div className="flex gap-2 text-xs">
                                      <Badge variant="outline">{story.storyPoints} pts</Badge>
                                      <Badge variant="outline">{story.status}</Badge>
                                    </div>
                                    {story.targetDate && (
                                      <p className="text-xs text-muted-foreground">
                                        Target: {format(parseISO(story.targetDate), 'MMM d, yyyy')}
                                      </p>
                                    )}
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                              <Badge variant="secondary" className="text-[10px] px-1">
                                {story.storyPoints}
                              </Badge>
                            </div>
                            <div className="flex-1 h-8 relative overflow-visible">
                              {barStyle && (
                                <>
                                  {/* Story Bar */}
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div 
                                        className={cn(
                                          "absolute top-1.5 h-5 rounded-md shadow-sm text-xs flex items-center px-2 text-white font-medium cursor-pointer hover:scale-105 transition-transform z-10",
                                          storyColor.bg
                                        )}
                                        style={barStyle}
                                      >
                                        <span className="truncate">{story.id}</span>
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <div className="text-xs space-y-1">
                                        <p className="font-semibold">{story.title}</p>
                                        {story.targetDate && (
                                          <p>Target: {format(parseISO(story.targetDate), 'MMM d, yyyy')}</p>
                                        )}
                                        {story.startedAt && (
                                          <p>Started: {format(parseISO(story.startedAt), 'MMM d, yyyy')}</p>
                                        )}
                                        {story.completedAt && (
                                          <p>Completed: {format(parseISO(story.completedAt), 'MMM d, yyyy')}</p>
                                        )}
                                      </div>
                                    </TooltipContent>
                                  </Tooltip>

                                  {/* Connection Line to Right Edge */}
                                  <svg 
                                    className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-visible"
                                    style={{ zIndex: 5 }}
                                    preserveAspectRatio="none"
                                  >
                                    <defs>
                                      {/* Gradient matching the story color */}
                                      <linearGradient id={`line-gradient-${story.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="currentColor" stopOpacity="0.8" />
                                        <stop offset="100%" stopColor="currentColor" stopOpacity="0.3" />
                                      </linearGradient>
                                    </defs>
                                    
                                    {/* Line Path - varies by type */}
                                    {lineType === 0 && (
                                      /* Straight solid line */
                                      <line
                                        x1={`${barEnd}%`}
                                        y1="50%"
                                        x2="98%"
                                        y2="50%"
                                        className={storyColor.text}
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeOpacity="0.6"
                                      />
                                    )}
                                    
                                    {lineType === 1 && (
                                      /* Zig-zag (sawtooth) line */
                                      <path
                                        d={`M ${barEnd}% 50% ${Array.from({ length: Math.ceil((98 - barEnd) / 3) }, (_, i) => {
                                          const x = barEnd + (i * 3);
                                          const y = i % 2 === 0 ? 25 : 75;
                                          return `L ${Math.min(x + 1.5, 98)}% ${y}%`;
                                        }).join(' ')} L 98% 50%`}
                                        className={storyColor.text}
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeOpacity="0.6"
                                        fill="none"
                                        strokeLinejoin="round"
                                      />
                                    )}
                                    
                                    {lineType === 2 && (
                                      /* Dotted/dashed line */
                                      <line
                                        x1={`${barEnd}%`}
                                        y1="50%"
                                        x2="98%"
                                        y2="50%"
                                        className={storyColor.text}
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeOpacity="0.6"
                                        strokeDasharray="6 4"
                                      />
                                    )}
                                    
                                    {/* End Circle Marker */}
                                    <circle
                                      cx="98%"
                                      cy="50%"
                                      r="4"
                                      className={storyColor.text}
                                      fill="currentColor"
                                      fillOpacity="0.8"
                                    />
                                  </svg>
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}

                {/* Empty State */}
                {storiesWithDates.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                    <Calendar className="w-16 h-16 mb-4 opacity-30" />
                    <p className="text-lg font-medium">No stories with dates</p>
                    <p className="text-sm">Add target dates to your stories to see them on the roadmap</p>
                    <p className="text-xs mt-2 text-muted-foreground">
                      Run: npx tsx scripts/seed-wiki-sprint-stories.ts
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Legend */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                Color Legend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3 text-sm">
                {SWIMLANE_COLORS.slice(0, 7).map((color, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className={cn("w-4 h-4 rounded", color.bg)} />
                    <span className="text-xs text-muted-foreground">Sprint/Epic {i + 1}</span>
                  </div>
                ))}
                <div className="flex items-center gap-2 ml-4 border-l pl-4">
                  <div className="w-6 h-0.5 bg-red-500" />
                  <span className="text-xs">Today</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3 text-sm mt-3 pt-3 border-t">
                <div className="flex items-center gap-1">
                  <span className="text-xs">○</span>
                  <span className="text-xs text-muted-foreground">Backlog</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs">▶</span>
                  <span className="text-xs text-muted-foreground">In Progress</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs">◎</span>
                  <span className="text-xs text-muted-foreground">Review</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs">✓</span>
                  <span className="text-xs text-muted-foreground">Done</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TooltipProvider>
    </PlanLayout>
  );
}
