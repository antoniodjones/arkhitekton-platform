import { useRef, useState, useCallback, useEffect } from 'react';
import { Stage, Layer, Circle, Transformer } from 'react-konva';
import Konva from 'konva';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { ZoomIn, ZoomOut, Maximize2, Grid3x3, Link as LinkIcon, ChevronDown } from 'lucide-react';
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
  const transformerRef = useRef<Konva.Transformer>(null);
  const shapeRefs = useRef<Map<string, Konva.Group>>(new Map());
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
  const [connectionRoutingType, setConnectionRoutingType] = useState<'straight' | 'orthogonal'>('straight');
  const [connectionArrowType, setConnectionArrowType] = useState<'single' | 'bidirectional' | 'none'>('single');
  const [editingShapeId, setEditingShapeId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);
  const [history, setHistory] = useState<{ shapes: CanvasShapeData[]; connections: CanvasConnectionData[] }[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [clipboard, setClipboard] = useState<CanvasShapeData[]>([]);

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

  // Update connections when shapes move - takes updated shapes array to avoid nested setState
  const updateConnectionsForShape = useCallback((updatedShapes: CanvasShapeData[], shapeId: string) => {
    setConnections(currentConns =>
      currentConns.map(conn => {
        if (conn.sourceShapeId === shapeId || conn.targetShapeId === shapeId) {
          const sourceShape = updatedShapes.find(s => s.id === conn.sourceShapeId);
          const targetShape = updatedShapes.find(s => s.id === conn.targetShapeId);
          
          if (sourceShape && targetShape) {
            const points = calculateConnectionPoints(
              sourceShape,
              targetShape,
              conn.routingType
            );
            
            console.log('🔄 Updated connection points:', { shapeId, routing: conn.routingType });
            
            return { ...conn, points };
          }
        }
        return conn;
      })
    );
  }, []);

  // Update shape position after drag
  const handleShapeDragEnd = useCallback((shapeId: string, e: Konva.KonvaEventObject<DragEvent>) => {
    const newX = e.target.x();
    const newY = e.target.y();
    
    console.log('🔄 Shape dragged:', shapeId, 'to', newX, newY);
    
    setShapes(prev => {
      const updated = prev.map(shape =>
        shape.id === shapeId
          ? { ...shape, x: newX, y: newY }
          : shape
      );
      
      // Update any connections involving this shape with the updated shapes array
      updateConnectionsForShape(updated, shapeId);
      
      return updated;
    });
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
            console.log('🔗 Creating connection between:', {
              source: { id: sourceShape.id, x: sourceShape.x, y: sourceShape.y, w: sourceShape.width, h: sourceShape.height },
              target: { id: targetShape.id, x: targetShape.x, y: targetShape.y, w: targetShape.width, h: targetShape.height }
            });
            
            const points = calculateConnectionPoints(
              sourceShape,
              targetShape,
              connectionRoutingType
            );
            
            console.log('✅ Connection points:', points, `(routing: ${connectionRoutingType}, arrow: ${connectionArrowType})`);
            
            const newConnection: CanvasConnectionData = {
              id: `conn-${Date.now()}`,
              sourceShapeId: connectionSource,
              targetShapeId: shapeId,
              routingType: connectionRoutingType,
              lineStyle: 'solid',
              arrowType: connectionArrowType,
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

  // Attach transformer to selected shape
  useEffect(() => {
    if (!transformerRef.current) return;
    
    if (selectedShapeId && shapeRefs.current.has(selectedShapeId)) {
      const node = shapeRefs.current.get(selectedShapeId);
      if (node) {
        transformerRef.current.nodes([node]);
        transformerRef.current.getLayer()?.batchDraw();
      }
    } else if (selectedShapeIds.size > 0) {
      // Multi-selection transformer
      const nodes: Konva.Group[] = [];
      selectedShapeIds.forEach(id => {
        const node = shapeRefs.current.get(id);
        if (node) nodes.push(node);
      });
      transformerRef.current.nodes(nodes);
      transformerRef.current.getLayer()?.batchDraw();
    } else {
      transformerRef.current.nodes([]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [selectedShapeId, selectedShapeIds]);

  // Handle shape transform (resize/rotate)
  const handleShapeTransformEnd = useCallback((shapeId: string) => {
    const node = shapeRefs.current.get(shapeId);
    if (!node) return;

    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    
    // Reset scale and apply to width/height
    node.scaleX(1);
    node.scaleY(1);
    
    setShapes(prev => {
      const updated = prev.map(shape =>
        shape.id === shapeId
          ? {
              ...shape,
              x: node.x(),
              y: node.y(),
              width: Math.max(5, node.width() * scaleX),
              height: Math.max(5, node.height() * scaleY),
              rotation: node.rotation(),
            }
          : shape
      );
      
      // Update connections for the transformed shape with updated shapes array
      updateConnectionsForShape(updated, shapeId);
      
      return updated;
    });
  }, [updateConnectionsForShape]);

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
      setShapes(prev =>
        prev.map(shape =>
          shape.id === editingShapeId
            ? { ...shape, text: editingText }
            : shape
        )
      );
    }
    setEditingShapeId(null);
    setEditingText('');
  }, [editingShapeId, editingText]);

  // Expose handleAddShape for parent component
  useEffect(() => {
    (window as any).__canvasAddShape = handleAddShape;
    return () => {
      delete (window as any).__canvasAddShape;
    };
  }, [handleAddShape]);

  // Save current state to history
  const saveToHistory = useCallback(() => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push({ shapes: [...shapes], connections: [...connections] });
      // Limit history to 50 states
      return newHistory.slice(-50);
    });
    setHistoryIndex(prev => Math.min(prev + 1, 49));
  }, [shapes, connections, historyIndex]);

  // Undo
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setShapes(prevState.shapes);
      setConnections(prevState.connections);
      setHistoryIndex(prev => prev - 1);
    }
  }, [history, historyIndex]);

  // Redo
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setShapes(nextState.shapes);
      setConnections(nextState.connections);
      setHistoryIndex(prev => prev + 1);
    }
  }, [history, historyIndex]);

  // Copy selected shapes
  const handleCopy = useCallback(() => {
    const selectedShapes = shapes.filter(s => 
      s.id === selectedShapeId || selectedShapeIds.has(s.id)
    );
    if (selectedShapes.length > 0) {
      setClipboard(selectedShapes);
      console.log(`📋 Copied ${selectedShapes.length} shape(s)`);
    }
  }, [shapes, selectedShapeId, selectedShapeIds]);

  // Paste shapes from clipboard
  const handlePaste = useCallback(() => {
    if (clipboard.length === 0) return;
    
    const newShapes = clipboard.map(shape => ({
      ...shape,
      id: `shape-${Date.now()}-${Math.random()}`,
      x: shape.x + 20,
      y: shape.y + 20,
    }));
    
    setShapes(prev => [...prev, ...newShapes]);
    setSelectedShapeIds(new Set(newShapes.map(s => s.id)));
    setSelectedShapeId(null);
    console.log(`📋 Pasted ${newShapes.length} shape(s)`);
  }, [clipboard]);

  // Handle keyboard events (Delete key for US-CVS-008)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if editing text
      if (editingShapeId) return;
      
      const isMod = e.ctrlKey || e.metaKey;
      
      // Copy (Ctrl+C / Cmd+C)
      if (isMod && e.key === 'c') {
        e.preventDefault();
        handleCopy();
        return;
      }
      
      // Paste (Ctrl+V / Cmd+V)
      if (isMod && e.key === 'v') {
        e.preventDefault();
        handlePaste();
        return;
      }
      
      // Undo (Ctrl+Z / Cmd+Z)
      if (isMod && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
        return;
      }
      
      // Redo (Ctrl+Shift+Z / Cmd+Shift+Z or Ctrl+Y / Cmd+Y)
      if ((isMod && e.key === 'z' && e.shiftKey) || (isMod && e.key === 'y')) {
        e.preventDefault();
        handleRedo();
        return;
      }
      
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
  }, [selectedShapeId, selectedShapeIds, selectedConnectionId, editingShapeId, handleCopy, handlePaste, handleUndo, handleRedo]);

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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              title="Connection Options"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Routing Type</div>
            <DropdownMenuItem
              onClick={() => setConnectionRoutingType('straight')}
              className={connectionRoutingType === 'straight' ? 'bg-accent' : ''}
            >
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 flex items-center justify-center">
                  {connectionRoutingType === 'straight' && '✓'}
                </div>
                Straight Line
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setConnectionRoutingType('orthogonal')}
              className={connectionRoutingType === 'orthogonal' ? 'bg-accent' : ''}
            >
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 flex items-center justify-center">
                  {connectionRoutingType === 'orthogonal' && '✓'}
                </div>
                Orthogonal (Elbow)
              </div>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Arrow Style</div>
            <DropdownMenuItem
              onClick={() => setConnectionArrowType('single')}
              className={connectionArrowType === 'single' ? 'bg-accent' : ''}
            >
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 flex items-center justify-center">
                  {connectionArrowType === 'single' && '✓'}
                </div>
                Single Arrow
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setConnectionArrowType('bidirectional')}
              className={connectionArrowType === 'bidirectional' ? 'bg-accent' : ''}
            >
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 flex items-center justify-center">
                  {connectionArrowType === 'bidirectional' && '✓'}
                </div>
                Bidirectional
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setConnectionArrowType('none')}
              className={connectionArrowType === 'none' ? 'bg-accent' : ''}
            >
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 flex items-center justify-center">
                  {connectionArrowType === 'none' && '✓'}
                </div>
                No Arrow (Line Only)
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
          <strong>Edit Text:</strong> Double-click shape<br />
          <strong>Multi-Select:</strong> Shift+Click shapes<br />
          <strong>Copy/Paste:</strong> Ctrl+C / Ctrl+V<br />
          <strong>Undo/Redo:</strong> Ctrl+Z / Ctrl+Shift+Z<br />
          <strong>Delete:</strong> Select shape(s) and press Delete<br />
          {connectionMode === 'creating' && (
            <span className="text-primary font-semibold block mt-1">
              <strong>Connection Mode:</strong> Click source → target shape
            </span>
          )}
        </p>
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
                onChange={(newAttrs) => {
                  setShapes(prev =>
                    prev.map(s =>
                      s.id === shape.id ? { ...s, ...newAttrs } : s
                    )
                  );
                }}
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
              // Limit resize to minimum size
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

