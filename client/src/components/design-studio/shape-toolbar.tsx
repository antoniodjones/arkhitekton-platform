import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  MousePointer2, 
  Shapes, 
  Type, 
  Table2, 
  MoveHorizontal,
  GitBranch,
  StickyNote,
  Image,
  Undo,
  Redo
} from 'lucide-react';
import { ShapePopover } from './shape-popover';

interface ShapeToolbarProps {
  onShapeSelect?: (shapeType: string) => void;
}

export function ShapeToolbar({ onShapeSelect }: ShapeToolbarProps) {
  const [activePopover, setActivePopover] = useState<string | null>(null);
  const [selectedTool, setSelectedTool] = useState('cursor');

  const tools = [
    { id: 'cursor', icon: MousePointer2, label: 'Select', hasPopover: false },
    { id: 'shapes', icon: Shapes, label: 'Shapes & Lines', hasPopover: true },
    { id: 'text', icon: Type, label: 'Text', hasPopover: false },
    { id: 'table', icon: Table2, label: 'Table', hasPopover: false },
    { id: 'connector', icon: MoveHorizontal, label: 'Connector', hasPopover: true },
    { id: 'flowchart', icon: GitBranch, label: 'Flowchart', hasPopover: true },
    { id: 'sticky', icon: StickyNote, label: 'Sticky Note', hasPopover: false },
    { id: 'image', icon: Image, label: 'Image', hasPopover: false },
  ];

  const handleToolClick = (toolId: string, hasPopover: boolean) => {
    setSelectedTool(toolId);
    if (hasPopover) {
      setActivePopover(activePopover === toolId ? null : toolId);
    } else {
      setActivePopover(null);
      onShapeSelect?.(toolId);
    }
  };

  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 z-50">
      <div className="bg-background border rounded-lg shadow-lg p-2 space-y-1">
        <TooltipProvider>
          {/* Main Tools */}
          {tools.map((tool) => (
            <div key={tool.id} className="relative">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={selectedTool === tool.id ? 'default' : 'ghost'}
                    size="icon"
                    className="w-10 h-10"
                    onClick={() => handleToolClick(tool.id, tool.hasPopover)}
                    data-testid={`button-tool-${tool.id}`}
                  >
                    <tool.icon className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="ml-2">
                  <p>{tool.label}</p>
                </TooltipContent>
              </Tooltip>

              {/* Shape Popover */}
              {tool.hasPopover && activePopover === tool.id && (
                <ShapePopover
                  category={tool.id}
                  onShapeSelect={(shape: string) => {
                    onShapeSelect?.(shape);
                    setActivePopover(null);
                  }}
                  onClose={() => setActivePopover(null)}
                />
              )}
            </div>
          ))}

          {/* Separator */}
          <div className="h-px bg-border my-2" />

          {/* Undo/Redo */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10"
                data-testid="button-undo"
              >
                <Undo className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="ml-2">
              <p>Undo</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10"
                data-testid="button-redo"
              >
                <Redo className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="ml-2">
              <p>Redo</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
