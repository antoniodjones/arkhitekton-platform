import React, { useState, useEffect } from 'react';
import { useDebouncedValue } from '@/hooks/use-debounce';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit2, 
  Trash2,
  ChevronLeft,
  ChevronRight,
  User,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { StoryDetailSheet } from '@/components/plan/story-detail-sheet';

interface Story {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  storyPoints: number;
  assignee?: string;
  epicId?: string;
}

interface Epic {
  id: string;
  name: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'done': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
    case 'in-progress': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
    case 'review': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
    case 'sprint': return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300';
    default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority.toLowerCase()) {
    case 'high': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 border-red-200';
    case 'medium': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200';
    case 'low': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200';
    default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200';
  }
};

export default function PlanStories() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(25);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);
  
  // Debounce search to avoid too many API calls
  const debouncedSearch = useDebouncedValue(search, 300);
  
  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter, priorityFilter]);

  // Fetch stories with server-side search and filtering
  const { data: storiesResponse, isLoading } = useQuery<{ items: Story[]; total: number; totalPages: number }>({
    queryKey: [`/api/user-stories?page=${page}&pageSize=${pageSize}${debouncedSearch ? `&search=${encodeURIComponent(debouncedSearch)}` : ''}${statusFilter !== 'all' ? `&status=${statusFilter}` : ''}${priorityFilter !== 'all' ? `&priority=${priorityFilter}` : ''}`],
  });

  // Fetch epics
  const { data: epicsResponse } = useQuery<{ data: Epic[] }>({
    queryKey: ['/api/epics'],
  });

  const stories = storiesResponse?.items || [];
  const total = storiesResponse?.total || 0;
  const totalPages = storiesResponse?.totalPages || 1;
  const epics = epicsResponse?.data || [];

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 bg-white dark:bg-gray-900 p-4 rounded-lg border">
        <div className="flex items-center gap-3 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search stories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="backlog">Backlog</SelectItem>
              <SelectItem value="sprint">Sprint</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="review">Review</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>

          {/* Priority Filter */}
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {total} stories
          </span>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Story
          </Button>
        </div>
      </div>

      {/* Stories Table */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800 border-b">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">ID</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Title</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Priority</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Points</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Assignee</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                  Loading stories...
                </td>
              </tr>
            ) : stories.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                  No stories found
                </td>
              </tr>
            ) : (
              stories.map((story) => (
                <tr 
                  key={story.id} 
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
                  onClick={() => setSelectedStoryId(story.id)}
                >
                  <td className="px-4 py-3">
                    <span className="text-xs font-mono text-purple-600 dark:text-purple-400 font-medium">
                      {story.id}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium truncate max-w-md">{story.title}</p>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary" className={cn("text-xs", getStatusColor(story.status))}>
                      {story.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className={cn("text-xs", getPriorityColor(story.priority))}>
                      {story.priority}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline">{story.storyPoints} pts</Badge>
                  </td>
                  <td className="px-4 py-3">
                    {story.assignee ? (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <User className="w-3 h-3" />
                        <span className="truncate max-w-24">{story.assignee.split(' ')[0]}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setSelectedStoryId(story.id)}
                        title="View story"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, total)} of {total}
        </span>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>
          <span className="text-sm px-3">
            Page {page} of {totalPages}
          </span>
          <Button 
            variant="outline" 
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage(p => p + 1)}
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <StoryDetailSheet
        storyId={selectedStoryId}
        open={!!selectedStoryId}
        onOpenChange={(open) => !open && setSelectedStoryId(null)}
      />
    </div>
  );
}

