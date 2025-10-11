import { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Rect, Circle, Text, Line, Image as KonvaImage } from 'react-konva';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GovernanceHeader } from '@/components/layout/governance-header';
import { Palette, Square, Circle as CircleIcon, Type, ArrowRight, Download, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Konva from 'konva';

interface Shape {
  id: string;
  type: 'rect' | 'circle' | 'text';
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  text?: string;
  fill: string;
  stroke: string;
}

function CanvasPOCContent() {
  const { toast } = useToast();
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const stageRef = useRef<Konva.Stage>(null);

  // Add a rectangle
  const addRect = () => {
    const newShape: Shape = {
      id: `rect-${Date.now()}`,
      type: 'rect',
      x: Math.random() * 400 + 100,
      y: Math.random() * 300 + 100,
      width: 120,
      height: 80,
      fill: '#FED7AA',
      stroke: '#F97316',
    };
    setShapes([...shapes, newShape]);
    toast({
      title: 'Service Added',
      description: 'Drag to reposition',
    });
  };

  // Add a circle
  const addCircle = () => {
    const newShape: Shape = {
      id: `circle-${Date.now()}`,
      type: 'circle',
      x: Math.random() * 400 + 150,
      y: Math.random() * 300 + 150,
      radius: 50,
      fill: '#FBBF24',
      stroke: '#F59E0B',
    };
    setShapes([...shapes, newShape]);
    toast({
      title: 'Database Added',
      description: 'Drag to reposition',
    });
  };

  // Add text
  const addText = () => {
    const newShape: Shape = {
      id: `text-${Date.now()}`,
      type: 'text',
      x: Math.random() * 400 + 100,
      y: Math.random() * 300 + 100,
      text: 'Label',
      fill: '#1F2937',
      stroke: 'transparent',
    };
    setShapes([...shapes, newShape]);
  };

  // Handle drag
  const handleDragEnd = (id: string, e: any) => {
    setShapes(shapes.map(shape => 
      shape.id === id 
        ? { ...shape, x: e.target.x(), y: e.target.y() }
        : shape
    ));
  };

  // Export as PNG
  const exportCanvas = () => {
    if (stageRef.current) {
      const dataURL = stageRef.current.toDataURL({ pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = 'architecture-diagram.png';
      link.href = dataURL;
      link.click();
      
      toast({
        title: 'Diagram Exported',
        description: 'Downloaded as PNG',
      });
    }
  };

  return (
    <div className="h-full overflow-hidden flex flex-col">
      <GovernanceHeader 
        moduleTitle="ARKHITEKTON Canvas" 
        moduleIcon={Palette}
      />

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Hero Section */}
          <Card className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950 dark:to-amber-950 border-orange-200 dark:border-orange-800">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Zap className="h-6 w-6 text-orange-600" />
                ARKHITEKTON Canvas - Instant Load
              </CardTitle>
              <CardDescription className="text-base">
                Custom Konva-based canvas - loads in under 1 second with full control
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-slate-900 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-600 mb-2">Instant Performance</h4>
                  <p className="text-sm text-muted-foreground">
                    Loads in &lt;1 second, no external dependencies, fully responsive
                  </p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-600 mb-2">Full Control</h4>
                  <p className="text-sm text-muted-foreground">
                    Custom shapes, branding, interactions - everything under our control
                  </p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-600 mb-2">Export Ready</h4>
                  <p className="text-sm text-muted-foreground">
                    Download as PNG, save to database, version control
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tools */}
          <Card>
            <CardHeader>
              <CardTitle>Shape Tools</CardTitle>
              <CardDescription>Add shapes to your architecture diagram</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              <Button 
                onClick={addRect}
                variant="outline"
                className="gap-2"
                data-testid="button-add-rect"
              >
                <Square className="h-4 w-4" />
                Add Service
              </Button>
              <Button 
                onClick={addCircle}
                variant="outline"
                className="gap-2"
                data-testid="button-add-circle"
              >
                <CircleIcon className="h-4 w-4" />
                Add Database
              </Button>
              <Button 
                onClick={addText}
                variant="outline"
                className="gap-2"
                data-testid="button-add-text"
              >
                <Type className="h-4 w-4" />
                Add Label
              </Button>
              <Button 
                onClick={exportCanvas}
                className="gap-2 ml-auto bg-gradient-to-r from-orange-500 to-amber-500"
                data-testid="button-export"
              >
                <Download className="h-4 w-4" />
                Export PNG
              </Button>
            </CardContent>
          </Card>

          {/* Canvas */}
          <Card className="border-2 border-orange-200 dark:border-orange-800">
            <CardContent className="p-0">
              <div className="bg-white dark:bg-slate-950 rounded-lg overflow-hidden">
                <Stage
                  ref={stageRef}
                  width={1200}
                  height={600}
                  className="cursor-move"
                  data-testid="konva-stage"
                >
                  <Layer>
                    {/* Grid background */}
                    {Array.from({ length: 60 }).map((_, i) => (
                      <Line
                        key={`h-${i}`}
                        points={[0, i * 20, 1200, i * 20]}
                        stroke="#E5E7EB"
                        strokeWidth={0.5}
                      />
                    ))}
                    {Array.from({ length: 60 }).map((_, i) => (
                      <Line
                        key={`v-${i}`}
                        points={[i * 20, 0, i * 20, 600]}
                        stroke="#E5E7EB"
                        strokeWidth={0.5}
                      />
                    ))}

                    {/* Shapes */}
                    {shapes.map((shape) => {
                      if (shape.type === 'rect') {
                        return (
                          <Rect
                            key={shape.id}
                            x={shape.x}
                            y={shape.y}
                            width={shape.width}
                            height={shape.height}
                            fill={shape.fill}
                            stroke={shape.stroke}
                            strokeWidth={2}
                            draggable
                            onDragEnd={(e) => handleDragEnd(shape.id, e)}
                            onClick={() => setSelectedId(shape.id)}
                            shadowColor={selectedId === shape.id ? '#F97316' : 'transparent'}
                            shadowBlur={selectedId === shape.id ? 10 : 0}
                          />
                        );
                      }
                      
                      if (shape.type === 'circle') {
                        return (
                          <Circle
                            key={shape.id}
                            x={shape.x}
                            y={shape.y}
                            radius={shape.radius}
                            fill={shape.fill}
                            stroke={shape.stroke}
                            strokeWidth={2}
                            draggable
                            onDragEnd={(e) => handleDragEnd(shape.id, e)}
                            onClick={() => setSelectedId(shape.id)}
                            shadowColor={selectedId === shape.id ? '#F97316' : 'transparent'}
                            shadowBlur={selectedId === shape.id ? 10 : 0}
                          />
                        );
                      }
                      
                      if (shape.type === 'text') {
                        return (
                          <Text
                            key={shape.id}
                            x={shape.x}
                            y={shape.y}
                            text={shape.text}
                            fontSize={16}
                            fontFamily="Inter"
                            fill={shape.fill}
                            draggable
                            onDragEnd={(e) => handleDragEnd(shape.id, e)}
                            onClick={() => setSelectedId(shape.id)}
                          />
                        );
                      }
                      
                      return null;
                    })}
                  </Layer>
                </Stage>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function CanvasPOCPage() {
  return <CanvasPOCContent />;
}
