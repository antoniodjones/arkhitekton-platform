import { useRef, useState, useCallback, useEffect } from 'react';
import { Stage, Layer, Circle } from 'react-konva';
import Konva from 'konva';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Maximize2, Grid3x3, Link as LinkIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CanvasShape, CanvasShapeData } from './canvas-shape';
import { CanvasConnection, CanvasConnectionData, calculateConnectionPoints } from './canvas-connection';
import { ShapeType } from './shape-palette';

/**
 * Design Canvas MVP - Infinite Canvas with Pan & Zoom
 * 
 * User Story: US-CVS-001 (8 pts)
 * Epic: EPIC-IDE-02 (Modeling Canvas Engine)
 * 
 * Features:
 * - Pan: Click and drag empty space to move canvas
 * - Zoom: Ctrl+Scroll or zoom buttons
 * - Grid: Visual grid background (dots or lines)
 * - Smooth 60fps performance
 */

interface CanvasState {
  scale: number;
  x: number;
  y: number;
}

interface DesignCanvasMVPProps {
  onShapeAdd?: (shapeType: ShapeType, position: { x: number; y: number }, size: { width: number; height: number }) => void;
}

export function DesignCanvasMVP({ onShapeAdd }: DesignCanvasMVPProps) {
  const stageRef = useRef<Konva.Stage>(null);
  const [stageSize, setStageSize] = useState({ width: window.innerWidth - 300, height: window.innerHeight - 100 });
  const [canvasState, setCanvasState] = useState<CanvasState>({
    scale: 1,
    x: 0,
    y: 0,
  });
  const [gridVisible, setGridVisible] = useState(true);
  const [shapes, setShapes] = useState<CanvasShapeData[]>([]);
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
  const [selectedShapeIds, setSelectedShapeIds] = useState<Set<string>>(new Set());
  const [connections, setConnections] = useState<CanvasConnectionData[]>([]);
  const [selectedConnectionId, setSelectedConnectionId] = useState<string | null>(null);
  const [connectionMode, setConnectionMode] = useState<'none' | 'creating'>('none');
  const [connectionSource, setConnectionSource] = useState<string | null>(null);

  // Add shape to canvas (called from shape palette)
  const handleAddShape = useCallback((shapeType: ShapeType, size: { width: number; height: number }) => {
    const centerX = (stageSize.width / 2 - canvasState.x) / canvasState.scale;
    const centerY = (stageSize.height / 2 - canvasState.y) / canvasState.scale;
    
    const newShape: CanvasShapeData = {
      id: `shape-${Date.now()}`,
      type: shapeType,
      x: centerX - size.width / 2,
      y: centerY - size.height / 2,
      width: size.width,
      height: size.height,
    };

    console.log('✅ Adding shape:', shapeType, 'at', newShape.x, newShape.y);

    setShapes(prev => [...prev, newShape]);
    setSelectedShapeId(newShape.id);
    
    if (onShapeAdd) {
      onShapeAdd(shapeType, { x: newShape.x, y: newShape.y }, size);
    }
  }, [stageSize, canvasState, onShapeAdd]);

  // Update connections when shapes move - FIX: Use setShapes callback to get current state
  const updateConnectionsForShape = useCallback((shapeId: string, newX: number, newY: number) => {
    setShapes(currentShapes => {
      setConnections(currentConns =>
        currentConns.map(conn => {
          if (conn.sourceShapeId === shapeId || conn.targetShapeId === shapeId) {
            const sourceShape = currentShapes.find(s => s.id === conn.sourceShapeId);
            const targetShape = currentShapes.find(s => s.id === conn.targetShapeId);
            
            if (sourceShape && targetShape) {
              // Update the moved shape's position
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
      return currentShapes; // Don't modify shapes state here
    });
  }, []);

  // Update shape position after drag
  const handleShapeDragEnd = useCallback((shapeId: string, e: Konva.KonvaEventObject<DragEvent>) => {
    const newX = e.target.x();
    const newY = e.target.y();
    
    console.log('🔄 Shape dragged:', shapeId, 'to', newX, newY);
    
    setShapes(prev =>
      prev.map(shape =>
        shape.id === shapeId
          ? { ...shape, x: newX, y: newY }
          : shape
      )
    );
    
    // Update any connections involving this shape
    updateConnectionsForShape(shapeId, newX, newY);
  }, [updateConnectionsForShape]);

  // Select shape or create connection
  const handleShapeSelect = useCallback((shapeId: string, isShiftKey: boolean = false) => {
    if (connectionMode === 'creating') {
      if (!connectionSource) {
        // First click - set as source
        console.log('Connection source set:', shapeId);
        setConnectionSource(shapeId);
        setSelectedShapeId(shapeId);
      } else if (connectionSource !== shapeId) {
        // Second click - create connection
        setShapes(currentShapes => {
          const sourceShape = currentShapes.find(s => s.id === connectionSource);
          const targetShape = currentShapes.find(s => s.id === shapeId);
          
          console.log('Creating connection:', { sourceShape, targetShape });
          
          if (sourceShape && targetShape) {
            const points = calculateConnectionPoints(
              sourceShape,
              targetShape,
              'orthogonal'
            );
            
            console.log('Connection points calculated:', points);
            
            const newConnection: CanvasConnectionData = {
              id: `conn-${Date.now()}`,
              sourceShapeId: connectionSource,
              targetShapeId: shapeId,
              routingType: 'orthogonal',
              lineStyle: 'solid',
              arrowType: 'single',
              points,
            };
            
            setConnections(prev => {
              console.log('Adding connection to state:', newConnection);
              return [...prev, newConnection];
            });
          } else {
            console.error('Could not find shapes for connection:', { connectionSource, shapeId, currentShapes });
          }
          
          return currentShapes; // Don't modify shapes
        });
        
        // Reset connection mode
        setConnectionMode('none');
        setConnectionSource(null);
        setSelectedShapeId(null);
      }
    } else {
      // Multi-selection with Shift+Click (US-CVS-008)
      if (isShiftKey) {
        setSelectedShapeIds(prev => {
          const next = new Set(prev);
          if (next.has(shapeId)) {
            next.delete(shapeId);
          } else {
            next.add(shapeId);
          }
          return next;
        });
        setSelectedShapeId(null);
      } else {
        // Normal single selection
        setSelectedShapeId(shapeId);
        setSelectedShapeIds(new Set());
        setSelectedConnectionId(null);
      }
    }
  }, [connectionMode, connectionSource]);

  // Deselect when clicking empty space
  const handleStageClick = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.target === e.target.getStage()) {
      setSelectedShapeId(null);
      setSelectedConnectionId(null);
      
      // Cancel connection mode if clicking empty space
      if (connectionMode === 'creating') {
        setConnectionMode('none');
        setConnectionSource(null);
      }
    }
  }, [connectionMode]);

  // Toggle connection mode
  const toggleConnectionMode = useCallback(() => {
    if (connectionMode === 'creating') {
      setConnectionMode('none');
      setConnectionSource(null);
    } else {
      setConnectionMode('creating');
      setSelectedShapeId(null);
    }
  }, [connectionMode]);

  // Expose handleAddShape for parent component
  useEffect(() => {
    (window as any).__canvasAddShape = handleAddShape;
    return () => {
      delete (window as any).__canvasAddShape;
    };
  }, [handleAddShape]);

  // Handle keyboard events (Delete key for US-CVS-008)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        
        // Delete selected shapes
        if (selectedShapeIds.size > 0) {
          setShapes(prev => prev.filter(s => !selectedShapeIds.has(s.id)));
          setConnections(prev => prev.filter(c => 
            !selectedShapeIds.has(c.sourceShapeId) && !selectedShapeIds.has(c.targetShapeId)
          ));
          setSelectedShapeIds(new Set());
        } else if (selectedShapeId) {
          setShapes(prev => prev.filter(s => s.id !== selectedShapeId));
          setConnections(prev => prev.filter(c => 
            c.sourceShapeId !== selectedShapeId && c.targetShapeId !== selectedShapeId
          ));
          setSelectedShapeId(null);
        } else if (selectedConnectionId) {
          setConnections(prev => prev.filter(c => c.id !== selectedConnectionId));
          setSelectedConnectionId(null);
        }
      }
      
      // Escape key to deselect
      if (e.key === 'Escape') {
        setSelectedShapeId(null);
        setSelectedShapeIds(new Set());
        setSelectedConnectionId(null);
        setConnectionMode('none');
        setConnectionSource(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedShapeId, selectedShapeIds, selectedConnectionId]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setStageSize({
        width: window.innerWidth - 300, // Account for sidebar
        height: window.innerHeight - 100, // Account for header
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Zoom controls
  const handleZoom = useCallback((delta: number) => {
    setCanvasState(prev => {
      const newScale = Math.min(Math.max(prev.scale + delta, 0.1), 5); // Clamp between 10% and 500%
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

    // Only zoom with Ctrl/Cmd key
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

  // Pan removed - shapes now draggable without Stage drag interference
  // Canvas pan can be added later with Space+Drag if needed

  // Generate grid dots
  const renderGrid = () => {
    if (!gridVisible) return null;

    const gridSpacing = 20 * canvasState.scale; // Adjust grid spacing with zoom
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

  // Debug: Show zoom level
  const zoomPercentage = Math.round(canvasState.scale * 100);

  return (
    <div className="relative w-full h-full bg-background">
      {/* Canvas Toolbar */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-card border border-border rounded-lg shadow-lg p-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleZoomOut}
          disabled={canvasState.scale <= 0.1}
          title="Zoom Out"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleZoomReset}
          className="min-w-[60px] font-mono text-xs"
          title="Reset Zoom"
        >
          {zoomPercentage}%
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={handleZoomIn}
          disabled={canvasState.scale >= 5}
          title="Zoom In"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        <Button
          variant="ghost"
          size="icon"
          onClick={handleZoomReset}
          title="Fit to Screen"
        >
          <Maximize2 className="h-4 w-4" />
        </Button>

        <Button
          variant={gridVisible ? "default" : "ghost"}
          size="icon"
          onClick={() => setGridVisible(!gridVisible)}
          title="Toggle Grid"
        >
          <Grid3x3 className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        <Button
          variant={connectionMode === 'creating' ? "default" : "ghost"}
          size="icon"
          onClick={toggleConnectionMode}
          title={connectionMode === 'creating' ? "Cancel Connection (click shape → shape)" : "Create Connection"}
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
      </div>

      {/* Zoom Level Indicator (bottom right) */}
      <div className="absolute bottom-4 right-4 z-10 bg-card border border-border rounded-lg shadow-lg px-3 py-1.5">
        <span className="text-xs font-mono text-muted-foreground">
          {zoomPercentage}%
        </span>
      </div>

      {/* Canvas Instructions (bottom left) */}
      <div className="absolute bottom-4 left-4 z-10 bg-card border border-border rounded-lg shadow-lg px-4 py-2 max-w-md">
        <p className="text-xs text-muted-foreground">
          <strong>Pan:</strong> Click + drag empty space<br />
          <strong>Zoom:</strong> Ctrl+Scroll or use toolbar<br />
          <strong>Multi-Select:</strong> Shift+Click shapes<br />
          <strong>Delete:</strong> Select shape(s) and press Delete<br />
          {connectionMode === 'creating' && (
            <span className="text-primary font-semibold block mt-1">
              <strong>Connection Mode:</strong> Click source → target shape
            </span>
          )}
        </p>
      </div>

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
        className="cursor-default"
      >
        {/* Grid Layer */}
        <Layer listening={false}>
          {renderGrid()}
        </Layer>

        {/* Connections Layer (behind shapes) */}
        <Layer>
          {connections.map(conn => (
            <CanvasConnection
              key={conn.id}
              connection={conn}
              isSelected={conn.id === selectedConnectionId}
              onSelect={() => {
                setSelectedConnectionId(conn.id);
                setSelectedShapeId(null);
              }}
            />
          ))}
        </Layer>

        {/* Shapes Layer */}
        <Layer>
          {shapes.map(shape => {
            const isSelected = 
              shape.id === selectedShapeId || 
              selectedShapeIds.has(shape.id) ||
              (connectionMode === 'creating' && shape.id === connectionSource);
            
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
              />
            );
          })}
        </Layer>
      </Stage>
    </div>
  );
}

