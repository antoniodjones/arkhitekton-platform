import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Link, useLocation, useRoute } from 'wouter';
import { AppLayout } from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  Bug, 
  ArrowLeft, 
  Save, 
  Download,
  Trash2,
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Calendar,
  User,
  FileText,
  Edit
} from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { queryClient, apiRequest } from '@/lib/queryClient';
import jsPDF from 'jspdf';

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
  rootCause: string | null;
  resolution: string | null;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
}

interface UserStory {
  id: string;
  title: string;
  feature: string | null;
}

export default function QualityDefectDetailPage() {
  const [, params] = useRoute('/defects/:id');
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const defectId = params?.id;

  const [isEditing, setIsEditing] = useState(defectId === 'new');
  const [formData, setFormData] = useState<Partial<Defect>>({
    title: '',
    description: '',
    severity: 'medium',
    type: 'bug',
    status: 'open',
    discoveredBy: '',
    assignedTo: '',
    rootCause: '',
    resolution: '',
  });

  // Fetch defect
  const { data: defect, isLoading } = useQuery<Defect>({
    queryKey: ['/api/defects', defectId],
    queryFn: async () => {
      if (defectId === 'new') return null as any;
      const response = await fetch(`/api/defects/${defectId}`);
      if (!response.ok) throw new Error('Failed to fetch defect');
      const result = await response.json();
      return result.data || result; // Handle both {data: defect} and defect directly
    },
    enabled: defectId !== 'new',
  });

  // Update form data when defect is loaded
  useEffect(() => {
    if (defect) {
      setFormData(defect);
    }
  }, [defect]);

  // Fetch user story
  const { data: story } = useQuery<UserStory>({
    queryKey: ['/api/user-stories', defect?.userStoryId],
    queryFn: async () => {
      if (!defect?.userStoryId) return null as any;
      const response = await fetch(`/api/user-stories/${defect.userStoryId}`);
      if (!response.ok) throw new Error('Failed to fetch user story');
      const result = await response.json();
      return result.data || result; // Handle both {data: story} and story directly
    },
    enabled: !!defect?.userStoryId,
  });

  // Fetch all stories for dropdown (when creating new defect)
  const { data: allStoriesResponse } = useQuery<{items: UserStory[]}>({
    queryKey: ['/api/user-stories'],
    queryFn: async () => {
      const response = await fetch('/api/user-stories');
      if (!response.ok) return { items: [] };
      return response.json();
    },
    enabled: defectId === 'new',
  });

  const allStories = allStoriesResponse?.items || [];

  // Create/Update mutation
  const saveMutation = useMutation({
    mutationFn: async (data: Partial<Defect>) => {
      if (defectId === 'new') {
        return apiRequest('POST', '/api/defects', data);
      } else {
        return apiRequest('PATCH', `/api/defects/${defectId}`, data);
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/defects'] });
      toast({
        title: defectId === 'new' ? 'Defect created' : 'Defect updated',
        description: 'Changes saved successfully',
      });
      setIsEditing(false);
      if (defectId === 'new') {
        navigate(`/defects/${data.id}`);
      }
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to save defect',
        variant: 'destructive',
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('DELETE', `/api/defects/${defectId}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/defects'] });
      toast({
        title: 'Defect deleted',
        description: 'Defect has been permanently removed',
      });
      navigate('/defects');
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete defect',
        variant: 'destructive',
      });
    },
  });

  const handleSave = () => {
    if (!formData.title || !formData.description) {
      toast({
        title: 'Validation error',
        description: 'Title and description are required',
        variant: 'destructive',
      });
      return;
    }
    saveMutation.mutate(formData);
  };

  const exportToPDF = () => {
    if (!defect) return;

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4',
    });

    const margin = 40;
    let yOffset = margin;
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFillColor(234, 88, 12);
    doc.rect(0, 0, pageWidth, 60, 'F');
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    const headerText = `${defect.title.substring(0, 60)} | ${defect.id} | ${defect.severity.toUpperCase()}`;
    doc.text(headerText, margin, 35);
    yOffset = 80;

    // Metadata
    doc.setFontSize(10);
    doc.setTextColor(51, 51, 51);
    doc.setFont('helvetica', 'normal');

    const metaData = [
      { label: 'Status', value: defect.status.toUpperCase() },
      { label: 'Severity', value: defect.severity.toUpperCase() },
      { label: 'Type', value: defect.type },
      { label: 'Story ID', value: defect.userStoryId },
      { label: 'Discovered By', value: defect.discoveredBy || 'N/A' },
      { label: 'Assigned To', value: defect.assignedTo || 'Unassigned' },
      { label: 'Created At', value: format(new Date(defect.createdAt), 'PPP') },
      { label: 'Updated At', value: format(new Date(defect.updatedAt), 'PPP') },
    ];

    doc.setFont('helvetica', 'bold');
    doc.text('Defect Details', margin, yOffset);
    yOffset += 15;

    doc.setFont('helvetica', 'normal');
    metaData.forEach((item) => {
      doc.text(`${item.label}:`, margin, yOffset);
      doc.text(item.value, margin + 100, yOffset);
      yOffset += 18;
    });
    yOffset += 10;

    // Description
    doc.setFont('helvetica', 'bold');
    doc.text('Description:', margin, yOffset);
    yOffset += 15;
    doc.setFont('helvetica', 'normal');
    const splitDescription = doc.splitTextToSize(defect.description, pageWidth - 2 * margin);
    doc.text(splitDescription, margin, yOffset);
    yOffset += splitDescription.length * 12 + 10;

    // Root Cause
    if (defect.rootCause) {
      doc.setFont('helvetica', 'bold');
      doc.text('Root Cause:', margin, yOffset);
      yOffset += 15;
      doc.setFont('helvetica', 'normal');
      const splitRootCause = doc.splitTextToSize(defect.rootCause, pageWidth - 2 * margin);
      doc.text(splitRootCause, margin, yOffset);
      yOffset += splitRootCause.length * 12 + 10;
    }

    // Resolution
    if (defect.resolution) {
      doc.setFont('helvetica', 'bold');
      doc.text('Resolution:', margin, yOffset);
      yOffset += 15;
      doc.setFont('helvetica', 'normal');
      const splitResolution = doc.splitTextToSize(defect.resolution, pageWidth - 2 * margin);
      doc.text(splitResolution, margin, yOffset);
    }

    doc.save(`${defect.id}_${defect.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);
  };

  const getSeverityBadge = (severity: Defect['severity']) => {
    const variants = {
      critical: { variant: 'destructive' as const, color: 'bg-red-600' },
      high: { variant: 'destructive' as const, color: 'bg-orange-600' },
      medium: { variant: 'default' as const, color: 'bg-yellow-600' },
      low: { variant: 'secondary' as const, color: 'bg-gray-500' },
    };
    return <Badge variant={variants[severity].variant}>{severity.toUpperCase()}</Badge>;
  };

  const getStatusIcon = (status: Defect['status']) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-amber-500" />;
      case 'resolved':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'closed':
        return <CheckCircle2 className="w-5 h-5 text-gray-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-screen">
          <Clock className="w-12 h-12 animate-spin text-muted-foreground" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="flex flex-col h-screen">
        <div className="flex-1 overflow-auto">
          <div className="container mx-auto py-8 px-6 max-w-4xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <Button variant="ghost" onClick={() => navigate('/defects')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Defects
              </Button>
              <div className="flex gap-2">
                {defectId !== 'new' && !isEditing && (
                  <>
                    <Button variant="outline" onClick={exportToPDF}>
                      <Download className="w-4 h-4 mr-2" />
                      Export PDF
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(true)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this defect?')) {
                          deleteMutation.mutate();
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </>
                )}
                {isEditing && (
                  <>
                    {defectId !== 'new' && (
                      <Button variant="outline" onClick={() => {
                        setIsEditing(false);
                        setFormData(defect as Partial<Defect>);
                      }}>
                        Cancel
                      </Button>
                    )}
                    <Button onClick={handleSave} disabled={saveMutation.isPending}>
                      <Save className="w-4 h-4 mr-2" />
                      {saveMutation.isPending ? 'Saving...' : 'Save'}
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Title Section */}
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 rounded-lg bg-amber-100 dark:bg-amber-950/30">
                <Bug className="w-8 h-8 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1">
                {isEditing ? (
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Defect title"
                    className="text-2xl font-bold mb-2"
                  />
                ) : (
                  <h1 className="text-3xl font-bold mb-2">{defect?.title}</h1>
                )}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {defect && (
                    <>
                      <span>{defect.id}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Created {format(new Date(defect.createdAt), 'PPP')}
                      </span>
                    </>
                  )}
                </div>
              </div>
              {defect && !isEditing && (
                <div className="flex gap-2">
                  {getSeverityBadge(defect.severity)}
                  {getStatusIcon(defect.status)}
                </div>
              )}
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left Column - Details */}
              <div className="md:col-span-2 space-y-6">
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Description</h3>
                  {isEditing ? (
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Detailed description, steps to reproduce, expected vs actual results..."
                      rows={6}
                    />
                  ) : (
                    <p className="text-sm whitespace-pre-wrap">{defect?.description}</p>
                  )}
                </Card>

                {(!isEditing && defect?.rootCause) || (isEditing && (formData.status === 'resolved' || formData.status === 'closed')) ? (
                  <Card className="p-6">
                    <h3 className="font-semibold mb-4">Root Cause Analysis</h3>
                    {isEditing ? (
                      <Textarea
                        value={formData.rootCause || ''}
                        onChange={(e) => setFormData({ ...formData, rootCause: e.target.value })}
                        placeholder="What caused this defect?"
                        rows={4}
                      />
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">{defect?.rootCause}</p>
                    )}
                  </Card>
                ) : null}

                {(!isEditing && defect?.resolution) || (isEditing && (formData.status === 'resolved' || formData.status === 'closed')) ? (
                  <Card className="p-6">
                    <h3 className="font-semibold mb-4">Resolution</h3>
                    {isEditing ? (
                      <Textarea
                        value={formData.resolution || ''}
                        onChange={(e) => setFormData({ ...formData, resolution: e.target.value })}
                        placeholder="How was this defect fixed?"
                        rows={4}
                      />
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">{defect?.resolution}</p>
                    )}
                  </Card>
                ) : null}
              </div>

              {/* Right Column - Metadata */}
              <div className="space-y-6">
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Properties</h3>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">Status</Label>
                      {isEditing ? (
                        <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v as any })}>
                          <SelectTrigger className="mt-1">
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
                      ) : (
                        <div className="mt-1">
                          <Badge variant="secondary">{defect?.status.replace('-', ' ').toUpperCase()}</Badge>
                        </div>
                      )}
                    </div>

                    <Separator />

                    <div>
                      <Label className="text-xs text-muted-foreground">Severity</Label>
                      {isEditing ? (
                        <Select value={formData.severity} onValueChange={(v) => setFormData({ ...formData, severity: v as any })}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="critical">Critical</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="mt-1">
                          {defect && getSeverityBadge(defect.severity)}
                        </div>
                      )}
                    </div>

                    <Separator />

                    <div>
                      <Label className="text-xs text-muted-foreground">Type</Label>
                      {isEditing ? (
                        <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v as any })}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bug">Bug</SelectItem>
                            <SelectItem value="regression">Regression</SelectItem>
                            <SelectItem value="performance">Performance</SelectItem>
                            <SelectItem value="security">Security</SelectItem>
                            <SelectItem value="usability">Usability</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="mt-1">
                          <Badge variant="outline">{defect?.type}</Badge>
                        </div>
                      )}
                    </div>

                    <Separator />

                    <div>
                      <Label className="text-xs text-muted-foreground">Linked User Story</Label>
                      {isEditing && defectId === 'new' ? (
                        <Select value={formData.userStoryId} onValueChange={(v) => setFormData({ ...formData, userStoryId: v })}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select story" />
                          </SelectTrigger>
                          <SelectContent>
                            {allStories.map((s) => (
                              <SelectItem key={s.id} value={s.id}>
                                {s.id} - {s.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : story ? (
                        <Link href={`/plan?story=${story.id}`}>
                          <div className="mt-1 text-sm text-blue-600 hover:underline cursor-pointer flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            {story.id}
                          </div>
                        </Link>
                      ) : (
                        <div className="mt-1 text-sm text-muted-foreground">None</div>
                      )}
                    </div>

                    <Separator />

                    <div>
                      <Label className="text-xs text-muted-foreground">Discovered By</Label>
                      {isEditing ? (
                        <Input
                          value={formData.discoveredBy || ''}
                          onChange={(e) => setFormData({ ...formData, discoveredBy: e.target.value })}
                          placeholder="Reporter name"
                          className="mt-1"
                        />
                      ) : (
                        <div className="mt-1 text-sm flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {defect?.discoveredBy || 'N/A'}
                        </div>
                      )}
                    </div>

                    <Separator />

                    <div>
                      <Label className="text-xs text-muted-foreground">Assigned To</Label>
                      {isEditing ? (
                        <Input
                          value={formData.assignedTo || ''}
                          onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                          placeholder="Assignee name"
                          className="mt-1"
                        />
                      ) : (
                        <div className="mt-1 text-sm flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {defect?.assignedTo || 'Unassigned'}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>

                {defect && (
                  <Card className="p-6">
                    <h3 className="font-semibold mb-4">Timeline</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground mt-0.5" />
                        <div>
                          <div className="font-medium">Created</div>
                          <div className="text-muted-foreground">{format(new Date(defect.createdAt), 'PPP p')}</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground mt-0.5" />
                        <div>
                          <div className="font-medium">Last Updated</div>
                          <div className="text-muted-foreground">{format(new Date(defect.updatedAt), 'PPP p')}</div>
                        </div>
                      </div>
                      {defect.resolvedAt && (
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                          <div>
                            <div className="font-medium">Resolved</div>
                            <div className="text-muted-foreground">{format(new Date(defect.resolvedAt), 'PPP p')}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

