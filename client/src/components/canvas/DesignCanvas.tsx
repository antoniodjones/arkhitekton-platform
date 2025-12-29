import { useRef, useState, useCallback, useEffect } from 'react';
import { Stage, Layer, Circle, Transformer } from 'react-konva';
import Konva from 'konva';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { ZoomIn, ZoomOut, Maximize2, Grid3x3, Link as LinkIcon, ChevronDown } from 'lucide-react';
import { CanvasShape, CanvasShapeData } from './canvas-shape';
import { CanvasConnection, CanvasConnectionData, calculateConnectionPoints } from './canvas-connection';
import { ArchitecturalObject } from '@shared/schema';

/**
 * Design Canvas - Studio Version
 * 
 * Uses the same canvas engine as MVP but adapted for ArchitecturalObject type
 * Supports all features: pan/zoom, resize, connections, text editing, etc.
 */

interface CanvasState {
  scale: number;
  x: number;
  y: number;
}

interface DesignCanvasProps {
  objects: ArchitecturalObject[];
  selectedIds: string[];
  onObjectSelect: (ids: string[]) => void;
  onObjectChange: (id: string, newAttrs: { x: number; y: number }) => void;
  isLoading?: boolean;
}

export function DesignCanvas({ objects, selectedIds, onObjectSelect, onObjectChange, isLoading }: DesignCanvasProps) {
  const stageRef = useRef<Konva.Stage>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const shapeRefs = useRef<Map<string, Konva.Group>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 });
  const [canvasState, setCanvasState] = useState<CanvasState>({
    scale: 1,
    x: 0,
    y: 0,
  });
  const [gridVisible, setGridVisible] = useState(true);
  const [connections, setConnections] = useState<CanvasConnectionData[]>([]);
  const [selectedConnectionId, setSelectedConnectionId] = useState<string | null>(null);
  const [connectionMode, setConnectionMode] = useState<'none' | 'creating'>('none');
  const [connectionSource, setConnectionSource] = useState<string | null>(null);
  const [connectionRoutingType, setConnectionRoutingType] = useState<'straight' | 'orthogonal'>('straight');
  const [connectionArrowType, setConnectionArrowType] = useState<'single' | 'bidirectional' | 'none'>('single');
  const [editingShapeId, setEditingShapeId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);

  // Convert ArchitecturalObject to CanvasShapeData
  const shapes: CanvasShapeData[] = objects.map(obj => {
    const visual = obj.visual as any;
    // Map ArchiMate shapes or use default
    const shapeType = (visual?.shape || 'rectangle') as any;
    
    return {
      id: obj.id,
      type: shapeType,
      x: visual?.position?.x || 0,
      y: visual?.position?.y || 0,
      width: visual?.size?.width || 180,
      height: visual?.size?.height || 80,
      rotation: 0,
      text: obj.name,
      fill: visual?.styling?.color || '#f0f0f0',
      stroke: '#333333',
      strokeWidth: 2,
    };
  });

  // Update connections when shapes move
  const updateConnectionsForShape = useCallback((shapeId: string, newX: number, newY: number) => {
    setConnections(currentConns =>
      currentConns.map(conn => {
        if (conn.sourceShapeId === shapeId || conn.targetShapeId === shapeId) {
          const sourceShape = shapes.find(s => s.id === conn.sourceShapeId);
          const targetShape = shapes.find(s => s.id === conn.targetShapeId);
          
          if (sourceShape && targetShape) {
            const updatedSource = conn.sourceShapeId === shapeId
              ? { ...sourceShape, x: newX, y: newY }
              : sourceShape;
            const updatedTarget = conn.targetShapeId === shapeId
              ? { ...targetShape, x: newX, y: newY }
              : targetShape;
            
            const points = calculateConnectionPoints(
              updatedSource,
              updatedTarget,
              conn.routingType
            );
            
            return { ...conn, points };
          }
        }
        return conn;
      })
    );
  }, [shapes]);

  // Handle shape drag end
  const handleShapeDragEnd = useCallback((shapeId: string, e: Konva.KonvaEventObject<DragEvent>) => {
    const newX = e.target.x();
    const newY = e.target.y();
    
    onObjectChange(shapeId, { x: newX, y: newY });
    updateConnectionsForShape(shapeId, newX, newY);
  }, [onObjectChange, updateConnectionsForShape]);

  // Handle shape selection
  const handleShapeSelect = useCallback((shapeId: string, isShiftKey: boolean = false) => {
    if (connectionMode === 'creating') {
      if (!connectionSource) {
        setConnectionSource(shapeId);
        onObjectSelect([shapeId]);
      } else if (connectionSource !== shapeId) {
        const sourceShape = shapes.find(s => s.id === connectionSource);
        const targetShape = shapes.find(s => s.id === shapeId);
        
        if (sourceShape && targetShape) {
          const points = calculateConnectionPoints(
            sourceShape,
            targetShape,
            connectionRoutingType
          );
          
          const newConnection: CanvasConnectionData = {
            id: `conn-${Date.now()}`,
            sourceShapeId: connectionSource,
            targetShapeId: shapeId,
            routingType: connectionRoutingType,
            lineStyle: 'solid',
            arrowType: connectionArrowType,
            points,
          };
          
          setConnections(prev => [...prev, newConnection]);
        }
        
        setConnectionMode('none');
        setConnectionSource(null);
        onObjectSelect([]);
      }
    } else {
      if (isShiftKey) {
        const currentIds = new Set(selectedIds);
        if (currentIds.has(shapeId)) {
          currentIds.delete(shapeId);
        } else {
          currentIds.add(shapeId);
        }
        onObjectSelect(Array.from(currentIds));
      } else {
        onObjectSelect([shapeId]);
        setSelectedConnectionId(null);
      }
    }
  }, [connectionMode, connectionSource, shapes, selectedIds, onObjectSelect, connectionRoutingType, connectionArrowType]);

  // Deselect when clicking empty space
  const handleStageClick = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.target === e.target.getStage()) {
      onObjectSelect([]);
      setSelectedConnectionId(null);
      
      if (connectionMode === 'creating') {
        setConnectionMode('none');
        setConnectionSource(null);
      }
    }
  }, [connectionMode, onObjectSelect]);

  // Toggle connection mode
  const toggleConnectionMode = useCallback(() => {
    if (connectionMode === 'creating') {
      setConnectionMode('none');
      setConnectionSource(null);
    } else {
      setConnectionMode('creating');
      onObjectSelect([]);
    }
  }, [connectionMode, onObjectSelect]);

  // Attach transformer to selected shapes
  useEffect(() => {
    if (!transformerRef.current) return;
    
    if (selectedIds.length > 0) {
      const nodes: Konva.Group[] = [];
      selectedIds.forEach(id => {
        const node = shapeRefs.current.get(id);
        if (node) nodes.push(node);
      });
      transformerRef.current.nodes(nodes);
      transformerRef.current.getLayer()?.batchDraw();
    } else {
      transformerRef.current.nodes([]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [selectedIds]);

  // Handle shape transform (resize/rotate)
  const handleShapeTransformEnd = useCallback((shapeId: string) => {
    const node = shapeRefs.current.get(shapeId);
    if (!node) return;

    const newX = node.x();
    const newY = node.y();
    
    onObjectChange(shapeId, { x: newX, y: newY });
    updateConnectionsForShape(shapeId, newX, newY);
  }, [onObjectChange, updateConnectionsForShape]);

  // Handle double-click to edit text
  const handleShapeDoubleClick = useCallback((shapeId: string) => {
    const shape = shapes.find(s => s.id === shapeId);
    if (shape) {
      setEditingShapeId(shapeId);
      setEditingText(shape.text || '');
    }
  }, [shapes]);

  // Save edited text
  const handleTextEditComplete = useCallback(() => {
    if (editingShapeId) {
      // Update the object name in parent
      const obj = objects.find(o => o.id === editingShapeId);
      if (obj) {
        // This would need a new callback prop to update the object name
        console.log('Text edited:', editingText);
      }
    }
    setEditingShapeId(null);
    setEditingText('');
  }, [editingShapeId, editingText, objects]);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (editingShapeId) return;
      
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        // Would need a delete callback from parent
      }
      
      if (e.key === 'Escape') {
        onObjectSelect([]);
        setSelectedConnectionId(null);
        setConnectionMode('none');
        setConnectionSource(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editingShapeId, onObjectSelect]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setStageSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Zoom controls
  const handleZoom = useCallback((delta: number) => {
    setCanvasState(prev => {
      const newScale = Math.min(Math.max(prev.scale + delta, 0.1), 5);
      return { ...prev, scale: newScale };
    });
  }, []);

  const handleZoomIn = () => handleZoom(0.1);
  const handleZoomOut = () => handleZoom(-0.1);
  const handleZoomReset = () => setCanvasState(prev => ({ ...prev, scale: 1 }));

  // Handle wheel zoom (Ctrl+Scroll)
  const handleWheel = useCallback((e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    
    const stage = stageRef.current;
    if (!stage) return;

    if (!e.evt.ctrlKey && !e.evt.metaKey) return;

    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const newScale = e.evt.deltaY < 0 ? oldScale * 1.1 : oldScale / 1.1;
    const clampedScale = Math.min(Math.max(newScale, 0.1), 5);

    setCanvasState({
      scale: clampedScale,
      x: pointer.x - mousePointTo.x * clampedScale,
      y: pointer.y - mousePointTo.y * clampedScale,
    });
  }, []);

  // Generate grid dots
  const renderGrid = () => {
    if (!gridVisible) return null;

    const gridSpacing = 20 * canvasState.scale;
    const dots: JSX.Element[] = [];
    const padding = 100;

    const startX = Math.floor((-canvasState.x - padding) / gridSpacing) * gridSpacing;
    const endX = startX + stageSize.width + padding * 2;
    const startY = Math.floor((-canvasState.y - padding) / gridSpacing) * gridSpacing;
    const endY = startY + stageSize.height + padding * 2;

    for (let x = startX; x < endX; x += gridSpacing) {
      for (let y = startY; y < endY; y += gridSpacing) {
        dots.push(
          <Circle
            key={`grid-${x}-${y}`}
            x={x}
            y={y}
            radius={1}
            fill="#cbd5e0"
            listening={false}
          />
        );
      }
    }

    return dots;
  };

  const zoomPercentage = Math.round(canvasState.scale * 100);

  return (
    <div ref={containerRef} className="relative w-full h-full bg-background">
      {/* Canvas Toolbar */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-card border border-border rounded-lg shadow-lg p-2">
        <Button variant="ghost" size="icon" onClick={handleZoomOut} disabled={canvasState.scale <= 0.1} title="Zoom Out">
          <ZoomOut className="h-4 w-4" />
        </Button>
        
        <Button variant="ghost" size="sm" onClick={handleZoomReset} className="min-w-[60px] font-mono text-xs" title="Reset Zoom">
          {zoomPercentage}%
        </Button>
        
        <Button variant="ghost" size="icon" onClick={handleZoomIn} disabled={canvasState.scale >= 5} title="Zoom In">
          <ZoomIn className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        <Button variant="ghost" size="icon" onClick={handleZoomReset} title="Fit to Screen">
          <Maximize2 className="h-4 w-4" />
        </Button>

        <Button variant={gridVisible ? "default" : "ghost"} size="icon" onClick={() => setGridVisible(!gridVisible)} title="Toggle Grid">
          <Grid3x3 className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        <Button
          variant={connectionMode === 'creating' ? "default" : "ghost"}
          size="icon"
          onClick={toggleConnectionMode}
          title={connectionMode === 'creating' ? "Cancel Connection" : "Create Connection"}
        >
          <LinkIcon className="h-4 w-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" title="Connection Options">
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Routing Type</div>
            <DropdownMenuItem onClick={() => setConnectionRoutingType('straight')} className={connectionRoutingType === 'straight' ? 'bg-accent' : ''}>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 flex items-center justify-center">{connectionRoutingType === 'straight' && '✓'}</div>
                Straight Line
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setConnectionRoutingType('orthogonal')} className={connectionRoutingType === 'orthogonal' ? 'bg-accent' : ''}>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 flex items-center justify-center">{connectionRoutingType === 'orthogonal' && '✓'}</div>
                Orthogonal (Elbow)
              </div>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Arrow Style</div>
            <DropdownMenuItem onClick={() => setConnectionArrowType('single')} className={connectionArrowType === 'single' ? 'bg-accent' : ''}>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 flex items-center justify-center">{connectionArrowType === 'single' && '✓'}</div>
                Single Arrow
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setConnectionArrowType('bidirectional')} className={connectionArrowType === 'bidirectional' ? 'bg-accent' : ''}>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 flex items-center justify-center">{connectionArrowType === 'bidirectional' && '✓'}</div>
                Bidirectional
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setConnectionArrowType('none')} className={connectionArrowType === 'none' ? 'bg-accent' : ''}>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 flex items-center justify-center">{connectionArrowType === 'none' && '✓'}</div>
                No Arrow
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Text Editing Overlay */}
      {editingShapeId && (() => {
        const shape = shapes.find(s => s.id === editingShapeId);
        if (!shape) return null;
        
        const screenX = shape.x * canvasState.scale + canvasState.x;
        const screenY = shape.y * canvasState.scale + canvasState.y;
        const screenWidth = shape.width * canvasState.scale;
        const screenHeight = shape.height * canvasState.scale;
        
        return (
          <input
            type="text"
            value={editingText}
            onChange={(e) => setEditingText(e.target.value)}
            onBlur={handleTextEditComplete}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleTextEditComplete();
              } else if (e.key === 'Escape') {
                setEditingShapeId(null);
                setEditingText('');
              }
            }}
            autoFocus
            className="absolute border-2 border-blue-500 rounded px-2 text-center bg-white dark:bg-gray-800 outline-none"
            style={{
              left: `${screenX}px`,
              top: `${screenY + screenHeight / 2 - 15}px`,
              width: `${screenWidth}px`,
              fontSize: `${(shape.fontSize || 14) * canvasState.scale}px`,
            }}
          />
        );
      })()}

      {/* Loading Indicator */}
      {isLoading && (
        <div className="absolute top-4 left-4 z-10 bg-card border border-border rounded-lg shadow-lg px-4 py-2">
          <p className="text-xs text-muted-foreground">Loading canvas objects...</p>
        </div>
      )}

      {/* Konva Canvas */}
      <Stage
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        scaleX={canvasState.scale}
        scaleY={canvasState.scale}
        x={canvasState.x}
        y={canvasState.y}
        draggable={false}
        onWheel={handleWheel}
        onClick={handleStageClick}
        onMouseMove={(e) => {
          if (connectionMode === 'creating' && connectionSource) {
            const stage = stageRef.current;
            if (stage) {
              const pointer = stage.getPointerPosition();
              if (pointer) {
                setMousePosition({
                  x: (pointer.x - canvasState.x) / canvasState.scale,
                  y: (pointer.y - canvasState.y) / canvasState.scale,
                });
              }
            }
          }
        }}
        className="cursor-default"
      >
        {/* Grid Layer */}
        <Layer listening={false}>
          {renderGrid()}
        </Layer>

        {/* Connections Layer */}
        <Layer>
          {connections.map(conn => (
            <CanvasConnection
              key={conn.id}
              connection={conn}
              isSelected={conn.id === selectedConnectionId}
              onSelect={() => {
                setSelectedConnectionId(conn.id);
                onObjectSelect([]);
              }}
            />
          ))}
          
          {/* Connection Preview Line */}
          {connectionMode === 'creating' && connectionSource && mousePosition && (() => {
            const sourceShape = shapes.find(s => s.id === connectionSource);
            if (!sourceShape) return null;
            
            const sourceCenter = {
              x: sourceShape.x + sourceShape.width / 2,
              y: sourceShape.y + sourceShape.height / 2,
            };
            
            return (
              <CanvasConnection
                connection={{
                  id: 'preview',
                  sourceShapeId: connectionSource,
                  targetShapeId: 'temp',
                  routingType: 'straight',
                  lineStyle: 'dashed',
                  arrowType: connectionArrowType,
                  color: '#0ea5e9',
                  thickness: 2,
                  points: [sourceCenter.x, sourceCenter.y, mousePosition.x, mousePosition.y],
                }}
                isSelected={false}
              />
            );
          })()}
        </Layer>

        {/* Shapes Layer */}
        <Layer>
          {shapes.map(shape => {
            const isSelected = selectedIds.includes(shape.id) || (connectionMode === 'creating' && shape.id === connectionSource);
            
            return (
              <CanvasShape
                key={shape.id}
                shape={shape}
                isSelected={isSelected}
                onSelect={(e?: any) => {
                  const isShiftKey = e?.evt?.shiftKey || false;
                  handleShapeSelect(shape.id, isShiftKey);
                }}
                onDragEnd={(e) => handleShapeDragEnd(shape.id, e)}
                shapeRef={(node) => {
                  if (node) {
                    shapeRefs.current.set(shape.id, node);
                  } else {
                    shapeRefs.current.delete(shape.id);
                  }
                }}
                onTransformEnd={() => handleShapeTransformEnd(shape.id)}
                onDoubleClick={() => handleShapeDoubleClick(shape.id)}
              />
            );
          })}
          <Transformer
            ref={transformerRef}
            boundBoxFunc={(oldBox, newBox) => {
              if (newBox.width < 5 || newBox.height < 5) {
                return oldBox;
              }
              return newBox;
            }}
          />
        </Layer>
      </Stage>
    </div>
  );
}
