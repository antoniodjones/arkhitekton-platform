import { ArchimateElement } from "@/data/archimate-elements";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import * as LucideIcons from "lucide-react";
import { DollarSign, Calendar, Users, AlertTriangle, TrendingUp, Link2, Edit3, Save } from "lucide-react";

interface PropertiesPanelProps {
  selectedElement?: ArchimateElement;
}

interface ElementMetadata {
  cost?: string;
  owner?: string;
  lastModified?: string;
  status?: 'active' | 'deprecated' | 'planned';
  riskLevel?: 'low' | 'medium' | 'high';
  businessValue?: 'low' | 'medium' | 'high';
  technicalDebt?: 'low' | 'medium' | 'high';
  dependencies?: string[];
  tags?: string[];
}

export function PropertiesPanel({ selectedElement }: PropertiesPanelProps) {
  if (!selectedElement) {
    return (
      <aside className="w-96 bg-card border-l border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <h3 className="text-sm font-medium text-foreground mb-2">Element Properties</h3>
          <div className="text-xs text-muted-foreground">
            Select an element to view properties and usage guidelines
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center space-y-4">
            <div className="text-4xl text-muted-foreground">📋</div>
            <p className="text-sm text-muted-foreground">
              Click on any element to view its details, properties, and usage guidelines.
            </p>
          </div>
        </div>
      </aside>
    );
  }

  const IconComponent = LucideIcons[selectedElement.iconName as keyof typeof LucideIcons] as any;
  
  const getShapeClass = (shape: string, type: string) => {
    if (type === 'behavioral') return 'rounded-full';
    if (type === 'motivational') return 'clip-path-diamond';
    return 'rounded-sm';
  };

  // Mock metadata based on element type
  const getElementMetadata = (element: ArchimateElement): ElementMetadata => {
    if (element.category === 'application') {
      return {
        cost: '$45,000/year',
        owner: 'IT Department',
        lastModified: '2 days ago',
        status: 'active',
        riskLevel: 'medium',
        businessValue: 'high',
        technicalDebt: 'low',
        dependencies: ['Database Server', 'API Gateway', 'Load Balancer'],
        tags: ['Core System', 'Customer Facing', 'High Availability']
      };
    } else if (element.category === 'business') {
      return {
        owner: 'Business Operations',
        lastModified: '1 week ago',
        status: 'active',
        riskLevel: 'low',
        businessValue: 'high',
        dependencies: ['Customer Service', 'Sales Team', 'Finance'],
        tags: ['Strategic', 'Customer Journey', 'Revenue Impact']
      };
    } else if (element.category === 'technology') {
      return {
        cost: '$12,000/year',
        owner: 'Infrastructure Team',
        lastModified: '3 days ago',
        status: 'active',
        riskLevel: 'high',
        technicalDebt: 'medium',
        dependencies: ['Network Infrastructure', 'Security Policies'],
        tags: ['Critical Infrastructure', 'Security', 'Compliance']
      };
    }
    return {
      owner: 'Architecture Team',
      lastModified: '5 days ago',
      status: 'active',
      riskLevel: 'low'
    };
  };

  const metadata = getElementMetadata(selectedElement);
  
  const relatedElements = [
    { name: 'Business Role', description: 'Assigned responsibility', icon: 'Users', color: 'hsl(12 76% 61%)', type: 'structural' },
    { name: 'Business Process', description: 'Performed behavior', icon: 'Cog', color: 'hsl(173 58% 39%)', type: 'behavioral' },
    { name: 'Business Object', description: 'Accessed information', icon: 'FileText', color: 'hsl(197 37% 24%)', type: 'passive' },
  ];
  
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50';
      case 'deprecated': return 'text-red-600 bg-red-50';
      case 'planned': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <aside className="w-96 bg-card border-l border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <h3 className="text-sm font-medium text-foreground mb-2">Element Properties</h3>
        <div className="text-xs text-muted-foreground">
          Detailed information and usage guidelines
        </div>
      </div>

      {/* Element Preview */}
      <div className="p-4 border-b border-border">
        <Card className="bg-muted">
          <CardContent className="p-4 text-center">
            <div 
              className={cn(
                "w-16 h-12 mx-auto mb-3 flex items-center justify-center text-white",
                getShapeClass(selectedElement.shape, selectedElement.type)
              )}
              style={{ backgroundColor: selectedElement.color }}
            >
              {IconComponent && <IconComponent size={20} />}
            </div>
            <h4 className="font-medium text-foreground mb-1" data-testid="text-element-name">
              {selectedElement.name}
            </h4>
            <p className="text-xs text-muted-foreground mb-3">
              {selectedElement.description}
            </p>
            
            <div className="flex items-center justify-center space-x-4 text-xs">
              <div className="flex items-center">
                <div 
                  className={cn(
                    "w-3 h-3 mr-1",
                    getShapeClass(selectedElement.shape, selectedElement.type)
                  )}
                  style={{ backgroundColor: selectedElement.color }}
                />
                <span className="capitalize">{selectedElement.type} Element</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {selectedElement.framework.toUpperCase()}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage Guidelines */}
      <div className="p-4 border-b border-border">
        <h4 className="text-sm font-medium text-foreground mb-3">Usage Guidelines</h4>
        <div className="space-y-3 text-xs text-muted-foreground">
          <div>
            <strong className="text-foreground">Description:</strong>{' '}
            {selectedElement.description}
          </div>
          <div>
            <strong className="text-foreground">When to use:</strong>{' '}
            {selectedElement.usageGuidelines}
          </div>
          <div>
            <strong className="text-foreground">Element type:</strong>{' '}
            <span className="capitalize">{selectedElement.type}</span> element in the{' '}
            <span className="capitalize">{selectedElement.category}</span> architecture domain
          </div>
          <div>
            <strong className="text-foreground">Framework:</strong>{' '}
            {selectedElement.framework.toUpperCase()} compliant
          </div>
        </div>
      </div>

      {/* Business Context & Metadata */}
      <div className="p-4 border-b border-border">
        <h4 className="text-sm font-medium text-foreground mb-3">Business Context</h4>
        <div className="space-y-4">
          {/* Status and Risk */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground">Status</Label>
              <Badge className={cn("mt-1 capitalize", getStatusColor(metadata.status!))}>
                {metadata.status}
              </Badge>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Risk Level</Label>
              <Badge className={cn("mt-1 capitalize", getRiskColor(metadata.riskLevel!))}>
                {metadata.riskLevel}
              </Badge>
            </div>
          </div>
          
          {/* Business Metrics */}
          {metadata.businessValue && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">Business Value</Label>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                  <span className="text-sm capitalize">{metadata.businessValue}</span>
                </div>
              </div>
              {metadata.technicalDebt && (
                <div>
                  <Label className="text-xs text-muted-foreground">Technical Debt</Label>
                  <div className="flex items-center mt-1">
                    <AlertTriangle className={cn("h-3 w-3 mr-1", 
                      metadata.technicalDebt === 'high' ? 'text-red-600' : 
                      metadata.technicalDebt === 'medium' ? 'text-yellow-600' : 'text-green-600'
                    )} />
                    <span className="text-sm capitalize">{metadata.technicalDebt}</span>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Owner and Cost */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">Owner</Label>
              <div className="flex items-center text-sm">
                <Users className="h-3 w-3 mr-1" />
                {metadata.owner}
              </div>
            </div>
            {metadata.cost && (
              <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground">Annual Cost</Label>
                <div className="flex items-center text-sm font-medium">
                  <DollarSign className="h-3 w-3 mr-1" />
                  {metadata.cost}
                </div>
              </div>
            )}
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">Last Modified</Label>
              <div className="flex items-center text-sm">
                <Calendar className="h-3 w-3 mr-1" />
                {metadata.lastModified}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Dependencies */}
      {metadata.dependencies && metadata.dependencies.length > 0 && (
        <div className="p-4 border-b border-border">
          <h4 className="text-sm font-medium text-foreground mb-3">Dependencies</h4>
          <div className="space-y-2">
            {metadata.dependencies.map((dep, index) => (
              <div key={index} className="flex items-center p-2 bg-muted rounded-md">
                <Link2 className="h-3 w-3 mr-2 text-muted-foreground" />
                <span className="text-sm">{dep}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Tags */}
      {metadata.tags && metadata.tags.length > 0 && (
        <div className="p-4 border-b border-border">
          <h4 className="text-sm font-medium text-foreground mb-3">Tags</h4>
          <div className="flex flex-wrap gap-1">
            {metadata.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      {/* Related Elements */}
      <div className="p-4 flex-1">
        <h4 className="text-sm font-medium text-foreground mb-3">Related Elements</h4>
        <div className="space-y-2">
          {relatedElements.map((element, index) => {
            const RelatedIconComponent = LucideIcons[element.icon as keyof typeof LucideIcons] as any;
            
            return (
              <div 
                key={index}
                className="flex items-center p-2 hover:bg-muted rounded-md cursor-pointer transition-colors"
                data-testid={`related-element-${index}`}
              >
                <div 
                  className={cn(
                    "w-6 h-6 mr-3 flex items-center justify-center text-white text-xs",
                    getShapeClass('rectangular', element.type)
                  )}
                  style={{ backgroundColor: element.color }}
                >
                  {RelatedIconComponent && <RelatedIconComponent size={12} />}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-foreground">{element.name}</div>
                  <div className="text-xs text-muted-foreground">{element.description}</div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Quick Actions */}
        <Separator className="my-4" />
        <div className="space-y-2">
          <Button variant="outline" size="sm" className="w-full justify-start">
            <Edit3 className="h-3 w-3 mr-2" />
            Edit Properties
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start">
            <Link2 className="h-3 w-3 mr-2" />
            Add Relationship
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start">
            <Save className="h-3 w-3 mr-2" />
            Save to Library
          </Button>
        </div>
      </div>
    </aside>
  );
}
