import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link } from 'wouter';
import { QualityLayout } from '@/components/quality/quality-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  ArrowLeft, 
  Edit2, 
  Save, 
  X,
  Bug,
  Link2,
  Clock,
  User,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { format } from 'date-fns';

interface Defect {
  id: string;
  userStoryId: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  type: 'bug' | 'regression' | 'performance' | 'security' | 'usability';
  status: 'open' | 'in-progress' | 'resolved' | 'closed' | 'rejected';
  discoveredBy: string | null;
  assignedTo: string | null;
  stepsToReproduce: string | null;
  expectedBehavior: string | null;
  actualBehavior: string | null;
  rootCause: string | null;
  resolution: string | null;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
}

export default function QualityDefectDetailPage() {
  const params = useParams<{ id: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editedDefect, setEditedDefect] = useState<Partial<Defect>>({});

  const { data: defect, isLoading } = useQuery<Defect>({
    queryKey: [`/api/defects/${params.id}`],
    queryFn: async () => {
      const response = await fetch(`/api/defects/${params.id}`);
      if (!response.ok) throw new Error('Failed to fetch defect');
      const result = await response.json();
      return result.data || result; // Unwrap data property from API response
    },
    enabled: !!params.id
  });

  useEffect(() => {
    if (defect) {
      setEditedDefect(defect);
    }
  }, [defect]);

  const updateMutation = useMutation({
    mutationFn: async (updates: Partial<Defect>) => {
      const response = await apiRequest('PATCH', `/api/defects/${params.id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/defects/${params.id}`] });
      queryClient.invalidateQueries({ queryKey: ['/api/defects'] });
      setIsEditing(false);
      toast({ title: 'Defect updated successfully' });
    },
    onError: () => {
      toast({ title: 'Failed to update defect', variant: 'destructive' });
    }
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-700';
      case 'in-progress': return 'bg-blue-100 text-blue-700';
      case 'resolved': return 'bg-green-100 text-green-700';
      case 'closed': return 'bg-gray-100 text-gray-700';
      case 'rejected': return 'bg-gray-100 text-gray-500';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (isLoading) {
    return (
      <QualityLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading defect...</p>
        </div>
      </QualityLayout>
    );
  }

  if (!defect) {
    return (
      <QualityLayout>
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <p className="text-muted-foreground">Defect not found</p>
          <Link href="/quality/defects">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Defects
            </Button>
          </Link>
        </div>
      </QualityLayout>
    );
  }

  return (
    <QualityLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Link href="/quality/defects">
              <a className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" />
                Back to Defects
              </a>
            </Link>
            <div className="flex items-center gap-3">
              <Bug className="w-6 h-6 text-red-500" />
              {isEditing ? (
                <Input
                  value={editedDefect.title || ''}
                  onChange={(e) => setEditedDefect({ ...editedDefect, title: e.target.value })}
                  className="text-xl font-bold max-w-lg"
                />
              ) : (
                <h1 className="text-2xl font-bold">{defect.title}</h1>
              )}
            </div>
            <p className="text-sm text-muted-foreground font-mono">{defect.id}</p>
          </div>

          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button variant="ghost" onClick={() => { setEditedDefect(defect); setIsEditing(false); }}>
                  <X className="w-4 h-4 mr-1" />
                  Cancel
                </Button>
                <Button onClick={() => updateMutation.mutate(editedDefect)} disabled={updateMutation.isPending}>
                  <Save className="w-4 h-4 mr-1" />
                  Save
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit2 className="w-4 h-4 mr-1" />
                Edit
              </Button>
            )}
          </div>
        </div>

        {/* Status & Severity */}
        <div className="flex items-center gap-3">
          {isEditing ? (
            <>
              <Select 
                value={editedDefect.status} 
                onValueChange={(v: any) => setEditedDefect({ ...editedDefect, status: v })}
              >
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Select 
                value={editedDefect.severity} 
                onValueChange={(v: any) => setEditedDefect({ ...editedDefect, severity: v })}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </>
          ) : (
            <>
              <Badge className={getStatusColor(defect.status)}>
                {defect.status === 'open' && <AlertCircle className="w-3 h-3 mr-1" />}
                {defect.status === 'resolved' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                {defect.status}
              </Badge>
              <Badge variant="outline" className={getSeverityColor(defect.severity)}>
                {defect.severity}
              </Badge>
              <Badge variant="secondary">{defect.type}</Badge>
            </>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Description */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Description</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  value={editedDefect.description || ''}
                  onChange={(e) => setEditedDefect({ ...editedDefect, description: e.target.value })}
                  rows={6}
                  placeholder="Describe the defect, steps to reproduce, expected vs actual behavior..."
                />
              ) : (
                <p className="text-sm whitespace-pre-wrap">
                  {defect.description || <span className="text-muted-foreground italic">No description</span>}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Linked Story */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Link2 className="w-4 h-4" />
                  Linked Story
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Link href={`/plan/stories`}>
                  <a className="text-sm font-mono text-blue-600 hover:underline">
                    {defect.userStoryId}
                  </a>
                </Link>
              </CardContent>
            </Card>

            {/* People */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <User className="w-4 h-4" />
                  People
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Discovered By</Label>
                  {isEditing ? (
                    <Input
                      value={editedDefect.discoveredBy || ''}
                      onChange={(e) => setEditedDefect({ ...editedDefect, discoveredBy: e.target.value })}
                      placeholder="Who found this?"
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-sm">{defect.discoveredBy || '—'}</p>
                  )}
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Assigned To</Label>
                  {isEditing ? (
                    <Input
                      value={editedDefect.assignedTo || ''}
                      onChange={(e) => setEditedDefect({ ...editedDefect, assignedTo: e.target.value })}
                      placeholder="Who is fixing this?"
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-sm">{defect.assignedTo || '—'}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Dates */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span>{defect.createdAt ? format(new Date(defect.createdAt), 'MMM d, yyyy') : '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Updated</span>
                  <span>{defect.updatedAt ? format(new Date(defect.updatedAt), 'MMM d, yyyy') : '—'}</span>
                </div>
                {defect.resolvedAt && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Resolved</span>
                    <span>{format(new Date(defect.resolvedAt), 'MMM d, yyyy')}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Steps to Reproduce & Expected vs Actual Behavior */}
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Steps to Reproduce</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  value={editedDefect.stepsToReproduce || ''}
                  onChange={(e) => setEditedDefect({ ...editedDefect, stepsToReproduce: e.target.value })}
                  rows={5}
                  placeholder="1. Navigate to...\n2. Click on...\n3. Observe..."
                />
              ) : (
                <p className="text-sm whitespace-pre-wrap">
                  {defect.stepsToReproduce || <span className="text-muted-foreground italic">No steps provided</span>}
                </p>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Expected Behavior</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea
                    value={editedDefect.expectedBehavior || ''}
                    onChange={(e) => setEditedDefect({ ...editedDefect, expectedBehavior: e.target.value })}
                    rows={4}
                    placeholder="What should happen..."
                  />
                ) : (
                  <p className="text-sm whitespace-pre-wrap">
                    {defect.expectedBehavior || <span className="text-muted-foreground italic">Not specified</span>}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actual Behavior</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea
                    value={editedDefect.actualBehavior || ''}
                    onChange={(e) => setEditedDefect({ ...editedDefect, actualBehavior: e.target.value })}
                    rows={4}
                    placeholder="What actually happens..."
                  />
                ) : (
                  <p className="text-sm whitespace-pre-wrap">
                    {defect.actualBehavior || <span className="text-muted-foreground italic">Not specified</span>}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Root Cause & Resolution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Root Cause</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  value={editedDefect.rootCause || ''}
                  onChange={(e) => setEditedDefect({ ...editedDefect, rootCause: e.target.value })}
                  rows={4}
                  placeholder="What caused this defect?"
                />
              ) : (
                <p className="text-sm whitespace-pre-wrap">
                  {defect.rootCause || <span className="text-muted-foreground italic">Not analyzed yet</span>}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resolution</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  value={editedDefect.resolution || ''}
                  onChange={(e) => setEditedDefect({ ...editedDefect, resolution: e.target.value })}
                  rows={4}
                  placeholder="How was this fixed?"
                />
              ) : (
                <p className="text-sm whitespace-pre-wrap">
                  {defect.resolution || <span className="text-muted-foreground italic">Not resolved yet</span>}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </QualityLayout>
  );
}

