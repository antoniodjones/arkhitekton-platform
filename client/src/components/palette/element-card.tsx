import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ArchimateElement } from "@/data/archimate-elements";
import { cn } from "@/lib/utils";
import * as LucideIcons from "lucide-react";

interface ElementCardProps {
  element: ArchimateElement;
  onSelect?: (element: ArchimateElement) => void;
  isSelected?: boolean;
  isDraggable?: boolean;
}

// Export the icon getter function for use in other components
export function getIcon(iconName: string) {
  return LucideIcons[iconName as keyof typeof LucideIcons] as any;
}

export function ElementCard({ element, onSelect, isSelected = false, isDraggable = true }: ElementCardProps) {
  const IconComponent = getIcon(element.iconName);

  const getShapeClass = (shape: string, type: string) => {
    if (type === 'behavioral') return 'rounded-full';
    if (type === 'motivational') return 'clip-path-diamond';
    return 'rounded-lg';
  };

  const getFrameworkIndicator = (framework: string) => {
    switch (framework) {
      case 'aws': return 'border-l-4 border-l-orange-500';
      case 'azure': return 'border-l-4 border-l-blue-500';
      case 'gcp': return 'border-l-4 border-l-blue-600';
      case 'patterns': return 'border-l-4 border-l-purple-500';
      case 'archimate': return 'border-l-4 border-l-primary';
      default: return 'border-l-4 border-l-muted-foreground';
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    if (isDraggable) {
      e.dataTransfer.setData('application/json', JSON.stringify(element));
      e.dataTransfer.effectAllowed = 'copy';
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Card 
          className={cn(
            "archmodel-card transition-all duration-200 group draggable-element",
            isDraggable ? "cursor-grab active:cursor-grabbing" : "cursor-pointer",
            getFrameworkIndicator(element.framework),
            isSelected && "ring-2 ring-primary shadow-lg shadow-primary/20"
          )}
          onClick={() => onSelect?.(element)}
          draggable={isDraggable}
          onDragStart={handleDragStart}
          data-testid={`element-card-${element.id}`}
        >
          <CardContent className="p-4">
            <div className="flex flex-col items-center text-center">
              <div 
                className={cn(
                  "w-12 h-8 mb-2 flex items-center justify-center text-white text-xs",
                  getShapeClass(element.shape, element.type)
                )}
                style={{ backgroundColor: element.color }}
              >
                {IconComponent && <IconComponent size={16} />}
              </div>
              <span className="text-sm font-medium text-foreground mb-1 line-clamp-2">
                {element.name}
              </span>
              <span className="text-xs text-muted-foreground line-clamp-2">
                {element.description.split('.')[0]}
              </span>
            </div>
          </CardContent>
        </Card>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="max-w-xs">
        <div className="space-y-2">
          <div className="font-medium">{element.name}</div>
          <div className="text-sm text-muted-foreground">{element.description}</div>
          <div className="flex items-center gap-2 text-xs">
            <div 
              className={cn(
                "w-3 h-3",
                getShapeClass(element.shape, element.type)
              )}
              style={{ backgroundColor: element.color }}
            />
            <span className="capitalize">{element.type} Element</span>
            <span>•</span>
            <span>{element.framework.toUpperCase()}</span>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
