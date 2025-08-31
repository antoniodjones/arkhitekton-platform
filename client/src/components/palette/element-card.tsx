import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ArchimateElement } from "@/data/archimate-elements";
import { cn } from "@/lib/utils";
import * as LucideIcons from "lucide-react";

interface ElementCardProps {
  element: ArchimateElement;
  onSelect?: (element: ArchimateElement) => void;
  isSelected?: boolean;
}

export function ElementCard({ element, onSelect, isSelected = false }: ElementCardProps) {
  const IconComponent = LucideIcons[element.iconName as keyof typeof LucideIcons] as any;

  const getShapeClass = (shape: string, type: string) => {
    if (type === 'behavioral') return 'rounded-full';
    if (type === 'motivational') return 'clip-path-diamond';
    return 'rounded-sm';
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Card 
          className={cn(
            "cursor-grab hover:shadow-md transition-all duration-200 group",
            "hover:-translate-y-1 active:scale-95 active:cursor-grabbing",
            isSelected && "ring-2 ring-primary"
          )}
          onClick={() => onSelect?.(element)}
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
