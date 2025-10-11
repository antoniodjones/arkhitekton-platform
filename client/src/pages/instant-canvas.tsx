import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GovernanceHeader } from '@/components/layout/governance-header';
import { Palette, Square, Circle, Type, Download, Zap, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Shape {
  id: string;
  type: 'rect' | 'circle' | 'text';
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  text?: string;
  color: string;
}

interface Connector {
  id: string;
  from: string;
  to: string;
  type: 'arrow' | 'line';
}

export default function InstantCanvasPage() {
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [connectors, setConnectors] = useState<Connector[]>([]);
  const [dragging, setDragging] = useState<{ id: string; offsetX: number; offsetY: number } | null>(null);
  const [connectMode, setConnectMode] = useState(false);
  const [connectFrom, setConnectFrom] = useState<string | null>(null);

  // Draw all shapes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < canvas.width; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 20) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // Draw connectors first (behind shapes)
    connectors.forEach((connector) => {
      const fromShape = shapes.find(s => s.id === connector.from);
      const toShape = shapes.find(s => s.id === connector.to);
      if (!fromShape || !toShape) return;

      // Calculate center points for all shape types
      const getShapeCenter = (shape: Shape): { x: number; y: number } => {
        if (shape.type === 'circle') {
          return { x: shape.x, y: shape.y };
        } else if (shape.type === 'rect') {
          return { x: shape.x + (shape.width! / 2), y: shape.y + (shape.height! / 2) };
        } else { // text
          return { x: shape.x + 50, y: shape.y - 10 }; // Approximate text center
        }
      };

      const fromCenter = getShapeCenter(fromShape);
      const toCenter = getShapeCenter(toShape);
      const fromX = fromCenter.x;
      const fromY = fromCenter.y;
      const toX = toCenter.x;
      const toY = toCenter.y;

      // Draw line
      ctx.strokeStyle = '#F97316';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(fromX, fromY);
      ctx.lineTo(toX, toY);
      ctx.stroke();

      // Draw arrow head
      if (connector.type === 'arrow') {
        const angle = Math.atan2(toY - fromY, toX - fromX);
        const arrowSize = 15;
        ctx.fillStyle = '#F97316';
        ctx.beginPath();
        ctx.moveTo(toX, toY);
        ctx.lineTo(
          toX - arrowSize * Math.cos(angle - Math.PI / 6),
          toY - arrowSize * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(
          toX - arrowSize * Math.cos(angle + Math.PI / 6),
          toY - arrowSize * Math.sin(angle + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fill();
      }
    });

    // Draw shapes
    shapes.forEach((shape) => {
      if (shape.type === 'rect') {
        ctx.fillStyle = shape.color;
        ctx.strokeStyle = connectFrom === shape.id ? '#10B981' : '#F97316';
        ctx.lineWidth = connectFrom === shape.id ? 4 : 2;
        ctx.fillRect(shape.x, shape.y, shape.width!, shape.height!);
        ctx.strokeRect(shape.x, shape.y, shape.width!, shape.height!);
      } else if (shape.type === 'circle') {
        ctx.fillStyle = shape.color;
        ctx.strokeStyle = connectFrom === shape.id ? '#10B981' : '#F59E0B';
        ctx.lineWidth = connectFrom === shape.id ? 4 : 2;
        ctx.beginPath();
        ctx.arc(shape.x, shape.y, shape.radius!, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
      } else if (shape.type === 'text') {
        ctx.fillStyle = '#1F2937';
        ctx.font = '16px Inter, sans-serif';
        ctx.fillText(shape.text || '', shape.x, shape.y);
      }
    });
  }, [shapes, connectors, connectFrom]);

  // Add shapes
  const addRect = () => {
    const newShape: Shape = {
      id: `rect-${Date.now()}`,
      type: 'rect',
      x: Math.random() * 400 + 100,
      y: Math.random() * 200 + 100,
      width: 120,
      height: 80,
      color: '#FED7AA',
    };
    setShapes([...shapes, newShape]);
    toast({ title: 'Service Added', description: 'Click and drag to move' });
  };

  const addCircle = () => {
    const newShape: Shape = {
      id: `circle-${Date.now()}`,
      type: 'circle',
      x: Math.random() * 400 + 150,
      y: Math.random() * 200 + 150,
      radius: 50,
      color: '#FBBF24',
    };
    setShapes([...shapes, newShape]);
    toast({ title: 'Database Added', description: 'Click and drag to move' });
  };

  const addText = () => {
    const newShape: Shape = {
      id: `text-${Date.now()}`,
      type: 'text',
      x: Math.random() * 400 + 100,
      y: Math.random() * 200 + 100,
      text: 'Label',
      color: '#1F2937',
    };
    setShapes([...shapes, newShape]);
  };

  // Mouse handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Find clicked shape (reverse order to get topmost)
    for (let i = shapes.length - 1; i >= 0; i--) {
      const shape = shapes[i];
      let hit = false;

      if (shape.type === 'rect') {
        hit = x >= shape.x && x <= shape.x + shape.width! && y >= shape.y && y <= shape.y + shape.height!;
      } else if (shape.type === 'circle') {
        const dx = x - shape.x;
        const dy = y - shape.y;
        hit = Math.sqrt(dx * dx + dy * dy) <= shape.radius!;
      } else if (shape.type === 'text') {
        hit = x >= shape.x && x <= shape.x + 100 && y >= shape.y - 20 && y <= shape.y;
      }

      if (hit) {
        // Connect mode: create connector
        if (connectMode) {
          if (!connectFrom) {
            setConnectFrom(shape.id);
            toast({ title: 'Select target', description: 'Click another shape to connect' });
          } else if (connectFrom !== shape.id) {
            const newConnector: Connector = {
              id: `conn-${Date.now()}`,
              from: connectFrom,
              to: shape.id,
              type: 'arrow',
            };
            setConnectors([...connectors, newConnector]);
            setConnectFrom(null);
            setConnectMode(false);
            toast({ title: 'Connected!', description: 'Shapes are now linked' });
          }
        } else {
          // Drag mode
          setDragging({ id: shape.id, offsetX: x - shape.x, offsetY: y - shape.y });
        }
        break;
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!dragging) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setShapes(shapes.map(shape =>
      shape.id === dragging.id
        ? { ...shape, x: x - dragging.offsetX, y: y - dragging.offsetY }
        : shape
    ));
  };

  const handleMouseUp = () => {
    setDragging(null);
  };

  // Export
  const exportCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'architecture-diagram.png';
    link.href = dataURL;
    link.click();

    toast({ title: 'Diagram Exported', description: 'Downloaded as PNG' });
  };

  return (
    <div className="h-full overflow-hidden flex flex-col">
      <GovernanceHeader moduleTitle="Instant Canvas" moduleIcon={Palette} />

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <Card className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950 dark:to-amber-950 border-orange-200 dark:border-orange-800">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Zap className="h-6 w-6 text-orange-600" />
                ARKHITEKTON Instant Canvas
              </CardTitle>
              <CardDescription className="text-base">
                Native HTML5 Canvas - **loads in &lt;100ms** with zero external dependencies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-slate-900 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-600 mb-2">⚡ Lightning Fast</h4>
                  <p className="text-sm text-muted-foreground">
                    Native browser API, no libraries, instant rendering
                  </p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-600 mb-2">🎨 Full Control</h4>
                  <p className="text-sm text-muted-foreground">
                    Pure JavaScript, custom interactions, ARKHITEKTON branding
                  </p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-600 mb-2">💾 Export Ready</h4>
                  <p className="text-sm text-muted-foreground">
                    Download as PNG, no external processing needed
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shape Tools</CardTitle>
              <CardDescription>Add and drag shapes on the canvas</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              <Button onClick={addRect} variant="outline" className="gap-2" data-testid="button-add-rect">
                <Square className="h-4 w-4" />
                Add Service
              </Button>
              <Button onClick={addCircle} variant="outline" className="gap-2" data-testid="button-add-circle">
                <Circle className="h-4 w-4" />
                Add Database
              </Button>
              <Button onClick={addText} variant="outline" className="gap-2" data-testid="button-add-text">
                <Type className="h-4 w-4" />
                Add Label
              </Button>
              <Button 
                onClick={() => {
                  setConnectMode(!connectMode);
                  setConnectFrom(null);
                  if (!connectMode) {
                    toast({ title: 'Connect Mode', description: 'Click two shapes to connect them' });
                  }
                }}
                variant={connectMode ? "default" : "outline"}
                className={connectMode ? "gap-2 bg-green-600 hover:bg-green-700" : "gap-2"}
                data-testid="button-connect"
              >
                <ArrowRight className="h-4 w-4" />
                {connectMode ? 'Connecting...' : 'Connect Shapes'}
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

          <Card className="border-2 border-orange-200 dark:border-orange-800">
            <CardContent className="p-4">
              <canvas
                ref={canvasRef}
                width={1200}
                height={600}
                className="border border-gray-200 dark:border-gray-700 rounded-lg cursor-move bg-white"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                data-testid="canvas-drawing"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
