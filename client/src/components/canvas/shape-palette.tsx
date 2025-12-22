import { useState } from 'react';
import { Square, Circle as CircleIcon, Diamond, Hexagon, Cylinder, FileText, Database, Cloud, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Shape Palette Component
 * 
 * User Story: US-CVS-010 (5 pts)
 * Epic: EPIC-IDE-02
 * 
 * Provides 12 basic draw.io-style shapes for diagramming:
 * - Geometric: Rectangle, Rounded Rect, Circle, Ellipse, Diamond, Triangle, Hexagon, Cylinder
 * - Flowchart: Process, Decision, Database, Document
 * - Containers: Cloud, Frame
 * - Text: Text Box
 */

export type ShapeType = 
  | 'rectangle'
  | 'rounded-rectangle'
  | 'circle'
  | 'ellipse'
  | 'diamond'
  | 'triangle'
  | 'hexagon'
  | 'cylinder'
  | 'process'
  | 'decision'
  | 'database'
  | 'document'
  | 'cloud'
  | 'frame'
  | 'text';

interface ShapeDefinition {
  type: ShapeType;
  label: string;
  icon: React.ReactNode;
  category: 'geometric' | 'flowchart' | 'containers' | 'text';
  defaultWidth: number;
  defaultHeight: number;
}

const shapes: ShapeDefinition[] = [
  // Geometric
  { type: 'rectangle', label: 'Rectangle', icon: <Square className="h-5 w-5" />, category: 'geometric', defaultWidth: 120, defaultHeight: 80 },
  { type: 'rounded-rectangle', label: 'Rounded', icon: <Square className="h-5 w-5 rounded" />, category: 'geometric', defaultWidth: 120, defaultHeight: 80 },
  { type: 'circle', label: 'Circle', icon: <CircleIcon className="h-5 w-5" />, category: 'geometric', defaultWidth: 100, defaultHeight: 100 },
  { type: 'ellipse', label: 'Ellipse', icon: <CircleIcon className="h-5 w-5 scale-x-75" />, category: 'geometric', defaultWidth: 120, defaultHeight: 80 },
  { type: 'diamond', label: 'Diamond', icon: <Diamond className="h-5 w-5" />, category: 'geometric', defaultWidth: 100, defaultHeight: 100 },
  { type: 'hexagon', label: 'Hexagon', icon: <Hexagon className="h-5 w-5" />, category: 'geometric', defaultWidth: 100, defaultHeight: 100 },
  { type: 'cylinder', label: 'Cylinder', icon: <Cylinder className="h-5 w-5" />, category: 'geometric', defaultWidth: 100, defaultHeight: 120 },
  
  // Flowchart
  { type: 'process', label: 'Process', icon: <Square className="h-5 w-5" />, category: 'flowchart', defaultWidth: 120, defaultHeight: 60 },
  { type: 'decision', label: 'Decision', icon: <Diamond className="h-5 w-5" />, category: 'flowchart', defaultWidth: 100, defaultHeight: 100 },
  { type: 'database', label: 'Database', icon: <Database className="h-5 w-5" />, category: 'flowchart', defaultWidth: 100, defaultHeight: 120 },
  { type: 'document', label: 'Document', icon: <FileText className="h-5 w-5" />, category: 'flowchart', defaultWidth: 100, defaultHeight: 120 },
  
  // Containers
  { type: 'cloud', label: 'Cloud', icon: <Cloud className="h-5 w-5" />, category: 'containers', defaultWidth: 140, defaultHeight: 100 },
  { type: 'frame', label: 'Frame', icon: <Square className="h-5 w-5" strokeDasharray="4 4" />, category: 'containers', defaultWidth: 200, defaultHeight: 150 },
];

interface ShapePaletteProps {
  onShapeSelect: (shapeType: ShapeType, defaultSize: { width: number; height: number }) => void;
  className?: string;
}

export function ShapePalette({ onShapeSelect, className }: ShapePaletteProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['geometric', 'flowchart', 'containers'])
  );

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const groupedShapes = shapes.reduce((acc, shape) => {
    if (!acc[shape.category]) {
      acc[shape.category] = [];
    }
    acc[shape.category].push(shape);
    return acc;
  }, {} as Record<string, ShapeDefinition[]>);

  const categoryLabels: Record<string, string> = {
    geometric: 'Geometric',
    flowchart: 'Flowchart',
    containers: 'Containers',
    text: 'Text',
  };

  return (
    <div className={cn('w-64 border-r border-border bg-card flex flex-col', className)}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-sm font-semibold">Basic Shapes</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Click to add to canvas
        </p>
      </div>
      
      {/* Shape Categories */}
      <div className="flex-1 overflow-y-auto">
        {Object.entries(groupedShapes).map(([category, categoryShapes]) => (
          <div key={category} className="border-b border-border last:border-0">
            {/* Category Header */}
            <button
              onClick={() => toggleCategory(category)}
              className="w-full flex items-center justify-between p-3 hover:bg-muted transition-colors text-left"
            >
              <h3 className="text-xs font-semibold text-muted-foreground uppercase">
                {categoryLabels[category]}
              </h3>
              {expandedCategories.has(category) ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </button>

            {/* Category Shapes */}
            {expandedCategories.has(category) && (
              <div className="grid grid-cols-2 gap-2 p-3 pt-0">
                {categoryShapes.map(shape => (
                  <button
                    key={shape.type}
                    onClick={() => onShapeSelect(shape.type, { width: shape.defaultWidth, height: shape.defaultHeight })}
                    className="flex flex-col items-center justify-center p-3 border border-border rounded-lg hover:bg-muted hover:border-primary transition-colors cursor-pointer group"
                    title={`Add ${shape.label}`}
                  >
                    <div className="w-12 h-12 flex items-center justify-center mb-1 text-muted-foreground group-hover:text-primary transition-colors">
                      {shape.icon}
                    </div>
                    <span className="text-xs text-center">{shape.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer Hint */}
      <div className="p-3 border-t border-border bg-muted/50">
        <p className="text-xs text-muted-foreground">
          <strong>Tip:</strong> Click a shape to add it to the center of the canvas
        </p>
      </div>
    </div>
  );
}

