import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { QualityLayout } from '@/components/quality/quality-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Bug, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  TrendingDown,
  ArrowRight,
  AlertCircle,
  XCircle,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Defect {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'in-progress' | 'resolved' | 'closed' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export default function QualityDashboard() {
  const { data: defectsResponse, isLoading } = useQuery<{ data: Defect[] }>({
    queryKey: ['/api/defects'],
    queryFn: async () => {
      const response = await fetch('/api/defects');
      if (!response.ok) throw new Error('Failed to fetch defects');
      return response.json();
    },
  });

  const defects = defectsResponse?.data || [];

  // Calculate metrics
  const totalDefects = defects.length;
  const openDefects = defects.filter(d => d.status === 'open').length;
  const inProgressDefects = defects.filter(d => d.status === 'in-progress').length;
  const resolvedDefects = defects.filter(d => d.status === 'resolved' || d.status === 'closed').length;
  
  const criticalDefects = defects.filter(d => d.severity === 'critical' && d.status !== 'resolved' && d.status !== 'closed');
  const highDefects = defects.filter(d => d.severity === 'high' && d.status !== 'resolved' && d.status !== 'closed');

  const resolutionRate = totalDefects > 0 ? Math.round((resolvedDefects / totalDefects) * 100) : 0;

  // Recent defects (last 5)
  const recentDefects = [...defects]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      case 'low': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'in-progress': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'resolved': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'closed': return <CheckCircle2 className="w-4 h-4 text-gray-500" />;
      case 'rejected': return <XCircle className="w-4 h-4 text-gray-400" />;
      default: return null;
    }
  };

  return (
    <QualityLayout>
      <div className="space-y-6">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Defects */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Defects
              </CardTitle>
              <Bug className="w-5 h-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalDefects}</div>
              <p className="text-xs text-muted-foreground mt-1">
                All time tracked issues
              </p>
            </CardContent>
          </Card>

          {/* Open Defects */}
          <Card className="border-red-200 dark:border-red-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Open
              </CardTitle>
              <AlertCircle className="w-5 h-5 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{openDefects}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Awaiting triage or assignment
              </p>
            </CardContent>
          </Card>

          {/* In Progress */}
          <Card className="border-blue-200 dark:border-blue-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                In Progress
              </CardTitle>
              <Clock className="w-5 h-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{inProgressDefects}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Currently being worked on
              </p>
            </CardContent>
          </Card>

          {/* Resolution Rate */}
          <Card className="border-green-200 dark:border-green-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Resolution Rate
              </CardTitle>
              <Activity className="w-5 h-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{resolutionRate}%</div>
              <Progress value={resolutionRate} className="mt-2 h-2" />
            </CardContent>
          </Card>
        </div>

        {/* Alerts & Recent */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Critical & High Priority */}
          <Card className={cn(
            "border-2",
            criticalDefects.length > 0 ? "border-red-300 dark:border-red-700" : "border-transparent"
          )}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Priority Alerts
              </CardTitle>
              <CardDescription>
                Critical and high severity issues requiring immediate attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              {criticalDefects.length === 0 && highDefects.length === 0 ? (
                <div className="flex items-center gap-2 text-green-600 py-4">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>No critical or high priority defects! 🎉</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {[...criticalDefects, ...highDefects].slice(0, 5).map(defect => (
                    <Link key={defect.id} href={`/quality/defects/${defect.id}`}>
                      <a className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <div className="flex items-center gap-3">
                          <Badge className={getSeverityColor(defect.severity)}>
                            {defect.severity}
                          </Badge>
                          <span className="text-sm font-medium truncate max-w-xs">
                            {defect.title}
                          </span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      </a>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Defects */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                    Recent Defects
                  </CardTitle>
                  <CardDescription>
                    Latest reported issues
                  </CardDescription>
                </div>
                <Link href="/quality/defects">
                  <Button variant="outline" size="sm">
                    View All
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {recentDefects.length === 0 ? (
                <p className="text-muted-foreground py-4">No defects reported yet</p>
              ) : (
                <div className="space-y-3">
                  {recentDefects.map(defect => (
                    <Link key={defect.id} href={`/quality/defects/${defect.id}`}>
                      <a className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(defect.status)}
                          <div>
                            <p className="text-sm font-medium truncate max-w-xs">
                              {defect.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(defect.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline" className={getSeverityColor(defect.severity)}>
                          {defect.severity}
                        </Badge>
                      </a>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Link href="/quality/defects?create=true">
                <Button>
                  <Bug className="w-4 h-4 mr-2" />
                  Report New Defect
                </Button>
              </Link>
              <Button variant="outline" disabled>
                <TrendingUp className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
              <Button variant="outline" disabled>
                Export to CSV
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </QualityLayout>
  );
}

