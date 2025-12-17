import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TestTube2, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp,
  FileText,
  ExternalLink
} from 'lucide-react';
import { Link } from 'wouter';

interface CoverageData {
  totalStories: number;
  coveredStories: number;
  uncoveredStories: number;
  coveragePercent: number;
  totalTestCases: number;
}

export function TestCoverageDashboard() {
  const { data: coverage } = useQuery<CoverageData>({
    queryKey: ['/api/test-coverage/dashboard'],
  });

  if (!coverage) {
    return <div className="p-8 text-center text-muted-foreground">Loading coverage data...</div>;
  }

  const { totalStories, coveredStories, uncoveredStories, coveragePercent, totalTestCases } = coverage;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Test Coverage Dashboard
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Track test coverage across user stories
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stories</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStories}</div>
            <p className="text-xs text-muted-foreground">
              User stories in backlog
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Test Cases</CardTitle>
            <TestTube2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTestCases}</div>
            <p className="text-xs text-muted-foreground">
              Total test cases created
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Covered Stories</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{coveredStories}</div>
            <p className="text-xs text-muted-foreground">
              Have linked test cases
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uncovered Stories</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{uncoveredStories}</div>
            <p className="text-xs text-muted-foreground">
              Need test cases
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Coverage Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            Overall Test Coverage
          </CardTitle>
          <CardDescription>
            Percentage of user stories with at least one test case
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Coverage</span>
              <span className="text-2xl font-bold text-indigo-600">{coveragePercent}%</span>
            </div>
            <Progress value={coveragePercent} className="h-3" />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{coveredStories} covered</span>
              <span>{uncoveredStories} uncovered</span>
            </div>
          </div>

          {coveragePercent < 50 && (
            <div className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-900">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5" />
                <div className="text-sm text-orange-700 dark:text-orange-300">
                  <strong>Low Coverage</strong>
                  <p className="mt-1">
                    Consider adding test cases to increase coverage above 50%
                  </p>
                </div>
              </div>
            </div>
          )}

          {coveragePercent >= 80 && (
            <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-900">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                <div className="text-sm text-green-700 dark:text-green-300">
                  <strong>Excellent Coverage!</strong>
                  <p className="mt-1">
                    You have strong test coverage across your user stories
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Manage test coverage and execution
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Link href="/quality/test-plan">
            <Button className="w-full justify-between" variant="outline">
              <span className="flex items-center gap-2">
                <TestTube2 className="w-4 h-4" />
                Open Test Plan
              </span>
              <ExternalLink className="w-4 h-4" />
            </Button>
          </Link>

          <Link href="/plan/stories">
            <Button className="w-full justify-between" variant="outline">
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                View User Stories
              </span>
              <ExternalLink className="w-4 h-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Coverage by Module (Future Enhancement) */}
      <Card>
        <CardHeader>
          <CardTitle>Coverage by Module</CardTitle>
          <CardDescription>
            Test coverage breakdown by application module
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {['Plan', 'Wiki', 'Quality', 'Design'].map((module) => (
              <div key={module} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{module}</span>
                  <Badge variant="outline">Coming Soon</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

