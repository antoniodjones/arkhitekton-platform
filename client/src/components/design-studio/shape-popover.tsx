import { Button } from '@/components/ui/button';
import { Square, Circle, Triangle, Diamond, ArrowRight, Star, Pentagon, Hexagon } from 'lucide-react';

interface ShapePopoverProps {
  category: string;
  onShapeSelect: (shape: string) => void;
  onClose: () => void;
}

const shapesByCategory = {
  shapes: [
    { id: 'rectangle', icon: Square, label: 'Rectangle' },
    { id: 'circle', icon: Circle, label: 'Circle' },
    { id: 'triangle', icon: Triangle, label: 'Triangle' },
    { id: 'diamond', icon: Diamond, label: 'Diamond' },
    { id: 'arrow', icon: ArrowRight, label: 'Arrow' },
    { id: 'star', icon: Star, label: 'Star' },
    { id: 'pentagon', icon: Pentagon, label: 'Pentagon' },
    { id: 'hexagon', icon: Hexagon, label: 'Hexagon' },
  ],
  connector: [
    { id: 'straight', icon: ArrowRight, label: 'Straight' },
    { id: 'curved', icon: ArrowRight, label: 'Curved' },
    { id: 'elbow', icon: ArrowRight, label: 'Elbow' },
  ],
  flowchart: [
    { id: 'process', icon: Square, label: 'Process' },
    { id: 'decision', icon: Diamond, label: 'Decision' },
    { id: 'terminator', icon: Circle, label: 'Terminator' },
  ],
};

export function ShapePopover({ category, onShapeSelect, onClose }: ShapePopoverProps) {
  const shapes = shapesByCategory[category as keyof typeof shapesByCategory] || shapesByCategory.shapes;

  return (
    <>
      {/* Backdrop to close on outside click */}
      <div 
        className="fixed inset-0 z-40" 
        onClick={onClose}
        data-testid="popover-backdrop"
      />
      
      {/* Popover Panel */}
      <div className="absolute left-full ml-2 top-0 z-50 bg-background border rounded-lg shadow-xl p-3 min-w-[240px]">
        <div className="space-y-2">
          {/* Drawing tools - only for shapes category */}
          {category === 'shapes' && (
            <div className="flex items-center gap-1 pb-2 border-b">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 14L14 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 8C2 8 4 2 8 2C12 2 14 8 14 8C14 8 12 14 8 14C4 14 2 8 2 8Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                </svg>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Shape Grid */}
          <div className="grid grid-cols-4 gap-1">
            {shapes.map((shape) => (
              <Button
                key={shape.id}
                variant="ghost"
                size="icon"
                className="h-12 w-12 hover:bg-orange-50 dark:hover:bg-orange-950/20"
                onClick={() => onShapeSelect(shape.id)}
                data-testid={`shape-${shape.id}`}
              >
                <shape.icon className="h-6 w-6" />
              </Button>
            ))}
          </div>

          {/* More Shapes Button */}
          {category === 'shapes' && (
            <Button 
              variant="outline" 
              className="w-full mt-2" 
              size="sm"
              data-testid="button-more-shapes"
            >
              More shapes
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
