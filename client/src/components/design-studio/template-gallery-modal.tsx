import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Boxes, X } from 'lucide-react';

interface TemplateGalleryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedFramework?: string;
}

interface Template {
  id: string;
  name: string;
  description: string;
  framework: string;
  thumbnail: string | null;
  complexity: 'basic' | 'intermediate' | 'advanced';
}

// Mock templates - TODO: Replace with real API data
const mockTemplates: Template[] = [
  {
    id: 'aws-3-tier',
    name: 'AWS 3-Tier Architecture',
    description: 'Classic 3-tier web application with load balancer, app servers, and RDS database',
    framework: 'aws',
    thumbnail: null,
    complexity: 'intermediate',
  },
  {
    id: 'aws-serverless',
    name: 'AWS Serverless API',
    description: 'Serverless API using API Gateway, Lambda, and DynamoDB',
    framework: 'aws',
    thumbnail: null,
    complexity: 'basic',
  },
  {
    id: 'aws-microservices',
    name: 'AWS Microservices',
    description: 'Containerized microservices with ECS, ALB, and service mesh',
    framework: 'aws',
    thumbnail: null,
    complexity: 'advanced',
  },
  {
    id: 'archimate-business',
    name: 'Business Capability Map',
    description: 'Enterprise business capabilities and organizational structure',
    framework: 'archimate',
    thumbnail: null,
    complexity: 'intermediate',
  },
  {
    id: 'archimate-application',
    name: 'Application Landscape',
    description: 'Application portfolio and dependencies across the enterprise',
    framework: 'archimate',
    thumbnail: null,
    complexity: 'intermediate',
  },
  {
    id: 'bpmn-order',
    name: 'Order Fulfillment Process',
    description: 'End-to-end order processing workflow with decision points',
    framework: 'bpmn',
    thumbnail: null,
    complexity: 'basic',
  },
  {
    id: 'azure-web-app',
    name: 'Azure Web Application',
    description: 'Web app with App Service, Azure SQL, and Application Insights',
    framework: 'azure',
    thumbnail: null,
    complexity: 'intermediate',
  },
  {
    id: 'gcp-data-pipeline',
    name: 'GCP Data Pipeline',
    description: 'Data ingestion and processing with Dataflow and BigQuery',
    framework: 'gcp',
    thumbnail: null,
    complexity: 'advanced',
  },
];

const frameworks = [
  { id: 'all', name: 'All Templates' },
  { id: 'aws', name: 'AWS' },
  { id: 'azure', name: 'Azure' },
  { id: 'archimate', name: 'ArchiMate' },
  { id: 'bpmn', name: 'BPMN' },
  { id: 'togaf', name: 'TOGAF' },
  { id: 'gcp', name: 'GCP' },
  { id: 'data', name: 'Data Model' },
];

export function TemplateGalleryModal({ open, onOpenChange, selectedFramework = 'all' }: TemplateGalleryModalProps) {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFramework, setActiveFramework] = useState(selectedFramework);

  // Sync activeFramework when selectedFramework prop changes
  useEffect(() => {
    setActiveFramework(selectedFramework);
  }, [selectedFramework]);

  // Filter templates
  const filteredTemplates = mockTemplates.filter(template => {
    const matchesSearch = searchQuery === '' ||
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFramework = activeFramework === 'all' || template.framework === activeFramework;
    return matchesSearch && matchesFramework;
  });

  const handleUseTemplate = (templateId: string) => {
    setLocation(`/studio/canvas?template=${templateId}`);
    onOpenChange(false);
  };

  const handleClose = () => {
    onOpenChange(false);
    setSearchQuery('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl">Template Gallery</DialogTitle>
              <DialogDescription className="mt-1">
                Choose a template to start your architecture diagram
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              data-testid="button-close-gallery"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              data-testid="input-search-templates"
            />
          </div>
        </DialogHeader>

        {/* Framework Tabs */}
        <div className="px-6 pt-4 border-b">
          <Tabs value={activeFramework} onValueChange={setActiveFramework}>
            <TabsList className="bg-transparent h-auto p-0 gap-2">
              {frameworks.map((framework) => (
                <TabsTrigger
                  key={framework.id}
                  value={framework.id}
                  className="data-[state=active]:bg-orange-500 data-[state=active]:text-white rounded-full px-4 py-1.5"
                  data-testid={`tab-framework-${framework.id}`}
                >
                  {framework.name}
                  {framework.id !== 'all' && (
                    <Badge variant="secondary" className="ml-2">
                      {mockTemplates.filter(t => t.framework === framework.id).length}
                    </Badge>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Template Grid */}
        <div className="flex-1 overflow-auto p-6">
          {filteredTemplates.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Boxes className="h-16 w-16 text-muted-foreground opacity-50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No templates found</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                {searchQuery
                  ? `No templates match "${searchQuery}". Try a different search term.`
                  : 'No templates available for this framework yet.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((template) => (
                <Card
                  key={template.id}
                  className="group cursor-pointer hover:shadow-lg transition-all"
                  onClick={() => handleUseTemplate(template.id)}
                  data-testid={`card-template-${template.id}`}
                >
                  <CardContent className="p-0">
                    {/* Template Thumbnail */}
                    <div className="h-32 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center border-b">
                      <Boxes className="h-10 w-10 text-muted-foreground opacity-50" />
                    </div>

                    {/* Template Info */}
                    <div className="p-4 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-sm leading-tight flex-1">
                          {template.name}
                        </h3>
                        <Badge
                          variant={
                            template.complexity === 'basic'
                              ? 'outline'
                              : template.complexity === 'intermediate'
                              ? 'secondary'
                              : 'default'
                          }
                          className="text-xs shrink-0"
                        >
                          {template.complexity}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {template.description}
                      </p>
                      <div className="pt-2">
                        <Button
                          size="sm"
                          className="w-full opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUseTemplate(template.id);
                          }}
                          data-testid={`button-use-template-${template.id}`}
                        >
                          Use Template
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
