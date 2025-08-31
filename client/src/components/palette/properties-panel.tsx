import { ArchimateElement } from "@/data/archimate-elements";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import * as LucideIcons from "lucide-react";

interface PropertiesPanelProps {
  selectedElement?: ArchimateElement;
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

  const relatedElements = [
    { name: 'Business Role', description: 'Assigned responsibility', icon: 'Users', color: 'hsl(12 76% 61%)', type: 'structural' },
    { name: 'Business Process', description: 'Performed behavior', icon: 'Cog', color: 'hsl(173 58% 39%)', type: 'behavioral' },
    { name: 'Business Object', description: 'Accessed information', icon: 'FileText', color: 'hsl(197 37% 24%)', type: 'passive' },
  ];

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
      </div>
    </aside>
  );
}
