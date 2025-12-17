import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  TrendingUp, 
  Target, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Zap,
  BarChart3,
  Users,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

interface Sprint {
  id: string;
  name: string;
  goal?: string;
  status: string;
  startDate: string;
  endDate: string;
  teamVelocity: number;
  committedPoints: number;
  completedPoints: number;
}

interface Story {
  id: string;
  title: string;
  status: string;
  priority: string;
  storyPoints: number;
  assignee?: string;
}

export default function PlanDashboard() {
  // Fetch active sprint
  const { data: activeSprint, isLoading: sprintLoading } = useQuery<Sprint>({
    queryKey: ['/api/sprints/active'],
    retry: false,
  });

  // Fetch stories
  const { data: storiesResponse } = useQuery<{ items: Story[]; total: number }>({
    queryKey: ['/api/user-stories?pageSize=500'],
  });

  const stories = storiesResponse?.items || [];
  const totalStories = storiesResponse?.total || 0;

  // Calculate metrics
  const completedStories = stories.filter(s => s.status === 'done').length;
  const inProgressStories = stories.filter(s => s.status === 'in-progress').length;
  const reviewStories = stories.filter(s => s.status === 'review').length;
  const backlogStories = stories.filter(s => s.status === 'backlog').length;

  const totalPoints = stories.reduce((sum, s) => sum + (s.storyPoints || 0), 0);
  const completedPoints = stories.filter(s => s.status === 'done').reduce((sum, s) => sum + (s.storyPoints || 0), 0);

  const sprintProgress = activeSprint 
    ? Math.round((activeSprint.completedPoints / activeSprint.committedPoints) * 100) || 0
    : 0;

  // Days remaining in sprint
  const daysRemaining = activeSprint 
    ? Math.max(0, Math.ceil((new Date(activeSprint.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

  return (
    <div className="space-y-6">
      {/* Sprint Overview Banner */}
      {activeSprint ? (
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5" />
                <span className="text-sm font-medium opacity-90">Active Sprint</span>
              </div>
              <h2 className="text-2xl font-bold mb-1">{activeSprint.name}</h2>
              {activeSprint.goal && (
                <p className="text-white/80 text-sm max-w-xl">{activeSprint.goal}</p>
              )}
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{sprintProgress}%</div>
              <div className="text-sm opacity-80">{daysRemaining} days left</div>
            </div>
          </div>
          
          {/* Sprint Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span>{activeSprint.completedPoints} pts completed</span>
              <span>{activeSprint.committedPoints} pts committed</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white rounded-full transition-all"
                style={{ width: `${Math.min(sprintProgress, 100)}%` }}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-100 dark:bg-amber-900/40 rounded-lg">
              <AlertCircle className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-amber-800 dark:text-amber-200">No Active Sprint</h3>
              <p className="text-sm text-amber-600 dark:text-amber-400">
                Create and start a sprint to begin tracking your work.
              </p>
            </div>
            <Button className="ml-auto" variant="outline">
              Create Sprint
            </Button>
          </div>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Stories</p>
                <p className="text-2xl font-bold">{totalStories}</p>
              </div>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
              <span>{totalPoints} total points</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{completedStories}</p>
              </div>
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
              <ArrowUpRight className="w-3 h-3" />
              <span>{completedPoints} pts delivered</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold">{inProgressStories}</p>
              </div>
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
              <span>{reviewStories} in review</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-gray-400">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Backlog</p>
                <p className="text-2xl font-bold">{backlogStories}</p>
              </div>
              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <Target className="w-5 h-5 text-gray-600" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
              <span>Ready for sprint</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Work Distribution</CardTitle>
            <CardDescription>Stories by status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: 'Done', count: completedStories, color: 'bg-green-500', pct: (completedStories / totalStories * 100) || 0 },
                { label: 'In Progress', count: inProgressStories, color: 'bg-blue-500', pct: (inProgressStories / totalStories * 100) || 0 },
                { label: 'Review', count: reviewStories, color: 'bg-purple-500', pct: (reviewStories / totalStories * 100) || 0 },
                { label: 'Backlog', count: backlogStories, color: 'bg-gray-400', pct: (backlogStories / totalStories * 100) || 0 },
              ].map((item) => (
                <div key={item.label} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-medium">{item.count}</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${item.color} rounded-full transition-all`}
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
            <CardDescription>Jump to common tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/plan/backlog">
                <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                  <Target className="w-5 h-5 text-indigo-500" />
                  <span>Sprint Planning</span>
                </Button>
              </Link>
              <Link href="/plan/board">
                <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-500" />
                  <span>Kanban Board</span>
                </Button>
              </Link>
              <Link href="/plan/stories">
                <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                  <Users className="w-5 h-5 text-green-500" />
                  <span>View All Stories</span>
                </Button>
              </Link>
              <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2" disabled>
                <Calendar className="w-5 h-5 text-purple-500" />
                <span>Roadmap</span>
                <Badge variant="secondary" className="text-[10px]">Soon</Badge>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity / Priority Items could go here */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">High Priority Items</CardTitle>
          <CardDescription>Stories that need attention</CardDescription>
        </CardHeader>
        <CardContent>
          {stories.filter(s => s.priority === 'high' && s.status !== 'done').slice(0, 5).length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No high priority items pending</p>
            </div>
          ) : (
            <div className="space-y-2">
              {stories
                .filter(s => s.priority === 'high' && s.status !== 'done')
                .slice(0, 5)
                .map((story) => (
                  <div 
                    key={story.id}
                    className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200">
                        High
                      </Badge>
                      <span className="text-sm font-medium truncate max-w-md">{story.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{story.storyPoints} pts</Badge>
                      <Badge variant="outline">{story.status}</Badge>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

