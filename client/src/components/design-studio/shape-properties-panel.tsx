import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from '@/components/ui/collapsible';
import { 
  Search, 
  X, 
  ChevronDown, 
  Square, 
  Circle, 
  Triangle, 
  Diamond,
  ArrowRight,
  Star,
  Cloud,
  Database,
  Server
} from 'lucide-react';

interface ShapePropertiesPanelProps {
  selectedShape: string | null;
  onClose: () => void;
  onShapeSelect: (shape: string) => void;
}

export function ShapePropertiesPanel({ selectedShape, onClose, onShapeSelect }: ShapePropertiesPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [openSections, setOpenSections] = useState<string[]>(['basic-shapes']);

  const shapeCategories = [
    {
      id: 'basic-shapes',
      title: 'Basic Shapes',
      shapes: [
        { id: 'rectangle', icon: Square, label: 'Rectangle' },
        { id: 'circle', icon: Circle, label: 'Circle' },
        { id: 'triangle', icon: Triangle, label: 'Triangle' },
        { id: 'diamond', icon: Diamond, label: 'Diamond' },
        { id: 'arrow', icon: ArrowRight, label: 'Arrow' },
        { id: 'star', icon: Star, label: 'Star' },
      ],
    },
    {
      id: 'flowchart',
      title: 'Flowchart',
      shapes: [
        { id: 'process', icon: Square, label: 'Process' },
        { id: 'decision', icon: Diamond, label: 'Decision' },
        { id: 'terminator', icon: Circle, label: 'Terminator' },
      ],
    },
    {
      id: 'aws',
      title: 'AWS',
      shapes: [
        { id: 'ec2', icon: Server, label: 'EC2 Instance' },
        { id: 's3', icon: Database, label: 'S3 Bucket' },
        { id: 'lambda', icon: Cloud, label: 'Lambda Function' },
      ],
    },
    {
      id: 'azure',
      title: 'Azure',
      shapes: [
        { id: 'vm', icon: Server, label: 'Virtual Machine' },
        { id: 'storage', icon: Database, label: 'Storage Account' },
        { id: 'function', icon: Cloud, label: 'Azure Function' },
      ],
    },
    {
      id: 'archimate',
      title: 'ArchiMate',
      shapes: [
        { id: 'business-actor', icon: Circle, label: 'Business Actor' },
        { id: 'application', icon: Square, label: 'Application' },
        { id: 'technology', icon: Server, label: 'Technology' },
      ],
    },
  ];

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const filteredCategories = shapeCategories.map(category => ({
    ...category,
    shapes: category.shapes.filter(shape =>
      shape.label.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(category => category.shapes.length > 0);

  if (!selectedShape) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-background border-l shadow-xl z-50 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Shape Properties</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            data-testid="button-close-properties"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search shapes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            data-testid="input-search-shapes"
          />
        </div>
      </div>

      {/* Shape Categories */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {filteredCategories.map((category) => (
            <Collapsible
              key={category.id}
              open={openSections.includes(category.id)}
              onOpenChange={() => toggleSection(category.id)}
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-muted rounded-md transition-colors">
                <span className="font-medium text-sm">{category.title}</span>
                <ChevronDown 
                  className={`h-4 w-4 transition-transform ${
                    openSections.includes(category.id) ? 'rotate-180' : ''
                  }`} 
                />
              </CollapsibleTrigger>
              
              <CollapsibleContent className="pt-2">
                <div className="grid grid-cols-4 gap-2 px-2">
                  {category.shapes.map((shape) => (
                    <Button
                      key={shape.id}
                      variant="ghost"
                      size="icon"
                      className="h-14 w-14 flex flex-col gap-1 hover:bg-orange-50 dark:hover:bg-orange-950/20"
                      onClick={() => onShapeSelect(shape.id)}
                      data-testid={`property-shape-${shape.id}`}
                    >
                      <shape.icon className="h-5 w-5" />
                      <span className="text-[10px] leading-none">{shape.label}</span>
                    </Button>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t">
        <Button 
          className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
          data-testid="button-add-to-canvas"
        >
          Add to Canvas
        </Button>
      </div>
    </div>
  );
}
