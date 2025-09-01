import React, { useState, useRef, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ArchitecturalObject, ObjectConnection } from '@shared/schema';

interface ViewportState {
  x: number;
  y: number;
  zoom: number;
  width: number;
  height: number;
}

interface TouchState {
  isActive: boolean;
  startX: number;
  startY: number;
  startDistance?: number;
  startZoom?: number;
}

interface ModelingCanvasProps {
  modelId?: string;
  objects: ArchitecturalObject[];
  connections: ObjectConnection[];
  viewMode?: 'detailed' | 'overview' | 'executive' | 'presentation';
  readOnly?: boolean;
  onObjectCreate?: (object: Partial<ArchitecturalObject>) => void;
  onObjectUpdate?: (objectId: string, updates: Partial<ArchitecturalObject>) => void;
  onObjectDelete?: (objectId: string) => void;
  onConnectionCreate?: (connection: Partial<ObjectConnection>) => void;
  className?: string;
}

export function ModelingCanvas({
  modelId,
  objects = [],
  connections = [],
  viewMode = 'detailed',
  readOnly = false,
  onObjectCreate,
  onObjectUpdate,
  onObjectDelete,
  onConnectionCreate,
  className
}: ModelingCanvasProps) {
  const canvasRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Viewport and interaction state
  const [viewport, setViewport] = useState<ViewportState>({
    x: 0,
    y: 0,
    zoom: 1,
    width: 1200,
    height: 800
  });
  
  const [selectedObjects, setSelectedObjects] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [touchState, setTouchState] = useState<TouchState>({
    isActive: false,
    startX: 0,
    startY: 0
  });

  // Touch and gesture handling
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (readOnly) return;
    
    e.preventDefault();
    const touches = e.touches;
    
    if (touches.length === 1) {
      // Single touch - pan or select
      const touch = touches[0];
      setTouchState({
        isActive: true,
        startX: touch.clientX,
        startY: touch.clientY
      });
    } else if (touches.length === 2) {
      // Multi-touch - zoom
      const touch1 = touches[0];
      const touch2 = touches[1];
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) + 
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      
      setTouchState({
        isActive: true,
        startX: (touch1.clientX + touch2.clientX) / 2,
        startY: (touch1.clientY + touch2.clientY) / 2,
        startDistance: distance,
        startZoom: viewport.zoom
      });
    }
  }, [readOnly, viewport.zoom]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchState.isActive) return;
    
    e.preventDefault();
    const touches = e.touches;
    
    if (touches.length === 1 && !touchState.startDistance) {
      // Single touch pan
      const touch = touches[0];
      const deltaX = touch.clientX - touchState.startX;
      const deltaY = touch.clientY - touchState.startY;
      
      setViewport(prev => ({
        ...prev,
        x: prev.x - deltaX / prev.zoom,
        y: prev.y - deltaY / prev.zoom
      }));
      
      setTouchState(prev => ({
        ...prev,
        startX: touch.clientX,
        startY: touch.clientY
      }));
      
    } else if (touches.length === 2 && touchState.startDistance) {
      // Multi-touch zoom
      const touch1 = touches[0];
      const touch2 = touches[1];
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) + 
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      
      const scale = distance / touchState.startDistance!;
      const newZoom = Math.max(0.1, Math.min(5, touchState.startZoom! * scale));
      
      setViewport(prev => ({
        ...prev,
        zoom: newZoom
      }));
    }
  }, [touchState]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    setTouchState({
      isActive: false,
      startX: 0,
      startY: 0
    });
  }, []);

  // Mouse handlers for desktop
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (readOnly) return;
    
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      // Middle click or Alt+click for panning
      setIsDragging(true);
      setTouchState({
        isActive: true,
        startX: e.clientX,
        startY: e.clientY
      });
    }
  }, [readOnly]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging && touchState.isActive) {
      const deltaX = e.clientX - touchState.startX;
      const deltaY = e.clientY - touchState.startY;
      
      setViewport(prev => ({
        ...prev,
        x: prev.x - deltaX / prev.zoom,
        y: prev.y - deltaY / prev.zoom
      }));
      
      setTouchState(prev => ({
        ...prev,
        startX: e.clientX,
        startY: e.clientY
      }));
    }
  }, [isDragging, touchState]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setTouchState({
      isActive: false,
      startX: 0,
      startY: 0
    });
  }, []);

  // Zoom with mouse wheel
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.1, Math.min(5, viewport.zoom * delta));
    
    // Zoom towards mouse cursor
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      // Convert mouse position to world coordinates
      const worldX = (mouseX / viewport.zoom) + viewport.x;
      const worldY = (mouseY / viewport.zoom) + viewport.y;
      
      // Adjust viewport to keep mouse position consistent
      const newX = worldX - (mouseX / newZoom);
      const newY = worldY - (mouseY / newZoom);
      
      setViewport(prev => ({
        ...prev,
        x: newX,
        y: newY,
        zoom: newZoom
      }));
    }
  }, [viewport]);

  // Object selection handling
  const handleObjectClick = useCallback((objectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (e.ctrlKey || e.metaKey) {
      // Multi-select
      setSelectedObjects(prev => 
        prev.includes(objectId)
          ? prev.filter(id => id !== objectId)
          : [...prev, objectId]
      );
    } else {
      // Single select
      setSelectedObjects([objectId]);
    }
  }, []);

  // Clear selection on canvas click
  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedObjects([]);
    }
  }, []);

  // Fit to content
  const fitToContent = useCallback(() => {
    if (objects.length === 0) return;
    
    // Calculate bounding box of all objects
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    
    objects.forEach(obj => {
      const x = obj.visual.position.x;
      const y = obj.visual.position.y;
      const w = obj.visual.size.width;
      const h = obj.visual.size.height;
      
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x + w);
      maxY = Math.max(maxY, y + h);
    });
    
    const padding = 50;
    const contentWidth = maxX - minX + padding * 2;
    const contentHeight = maxY - minY + padding * 2;
    
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const scaleX = rect.width / contentWidth;
      const scaleY = rect.height / contentHeight;
      const scale = Math.min(scaleX, scaleY, 1);
      
      setViewport({
        x: minX - padding,
        y: minY - padding,
        zoom: scale,
        width: rect.width,
        height: rect.height
      });
    }
  }, [objects]);

  // Responsive viewport adjustment
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setViewport(prev => ({
          ...prev,
          width: rect.width,
          height: rect.height
        }));
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Render architectural object
  const renderObject = (obj: ArchitecturalObject) => {
    const isSelected = selectedObjects.includes(obj.id);
    const position = obj.visual.position;
    const size = obj.visual.size;
    
    return (
      <g
        key={obj.id}
        transform={`translate(${position.x}, ${position.y})`}
        onClick={(e) => handleObjectClick(obj.id, e)}
        className={cn(
          "cursor-pointer transition-all duration-200",
          isSelected && "drop-shadow-lg"
        )}
        data-testid={`architectural-object-${obj.id}`}
      >
        {/* Object background */}
        <rect
          width={size.width}
          height={size.height}
          rx={8}
          className={cn(
            "fill-white dark:fill-slate-800 stroke-2 transition-all",
            isSelected 
              ? "stroke-emerald-500 dark:stroke-emerald-400" 
              : "stroke-slate-300 dark:stroke-slate-600 hover:stroke-emerald-300"
          )}
        />
        
        {/* Object icon/shape */}
        <rect
          x={8}
          y={8}
          width={32}
          height={32}
          rx={4}
          className="fill-emerald-100 dark:fill-emerald-900/50 stroke-emerald-500 dark:stroke-emerald-400"
        />
        
        {/* Object label */}
        <text
          x={48}
          y={20}
          className="fill-slate-900 dark:fill-white text-sm font-medium"
          dominantBaseline="middle"
        >
          {obj.name}
        </text>
        
        {/* Object type/domain */}
        <text
          x={48}
          y={34}
          className="fill-slate-500 dark:fill-slate-400 text-xs"
          dominantBaseline="middle"
        >
          {obj.domain} · {obj.category}
        </text>
        
        {/* Executive view metrics */}
        {viewMode === 'executive' && obj.metrics && (
          <g transform={`translate(${size.width - 40}, 8)`}>
            <circle
              r={6}
              className={cn(
                "fill-current",
                obj.metrics.businessValue && Object.values(obj.metrics.businessValue).some(v => v > 80)
                  ? "text-green-500"
                  : obj.metrics.businessValue && Object.values(obj.metrics.businessValue).some(v => v < 40)
                  ? "text-red-500"
                  : "text-yellow-500"
              )}
            />
          </g>
        )}
        
        {/* Selection indicator */}
        {isSelected && (
          <rect
            width={size.width + 4}
            height={size.height + 4}
            x={-2}
            y={-2}
            rx={10}
            className="fill-none stroke-2 stroke-emerald-500 dark:stroke-emerald-400 stroke-dasharray-[8,4]"
            style={{ animation: 'dash 1s linear infinite' }}
          />
        )}
      </g>
    );
  };

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative w-full h-full overflow-hidden bg-slate-50 dark:bg-slate-900",
        className
      )}
      data-testid="modeling-canvas-container"
    >
      {/* Canvas SVG */}
      <svg
        ref={canvasRef}
        className="w-full h-full touch-none select-none cursor-grab active:cursor-grabbing"
        viewBox={`${viewport.x} ${viewport.y} ${viewport.width / viewport.zoom} ${viewport.height / viewport.zoom}`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        onClick={handleCanvasClick}
        data-testid="modeling-canvas"
      >
        {/* Grid background */}
        <defs>
          <pattern 
            id="grid" 
            width="50" 
            height="50" 
            patternUnits="userSpaceOnUse"
          >
            <path 
              d="M 50 0 L 0 0 0 50" 
              fill="none" 
              stroke="currentColor" 
              className="text-slate-200 dark:text-slate-700"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        
        <rect 
          x={viewport.x} 
          y={viewport.y} 
          width={viewport.width / viewport.zoom} 
          height={viewport.height / viewport.zoom}
          fill="url(#grid)" 
        />
        
        {/* Render connections first (behind objects) */}
        {connections.map(connection => (
          <g key={connection.id}>
            {/* Simple line for now - will be enhanced */}
            <line
              x1={0} y1={0} x2={100} y2={100}
              className="stroke-slate-400 dark:stroke-slate-500 stroke-2"
              markerEnd="url(#arrowhead)"
            />
          </g>
        ))}
        
        {/* Arrow marker definition */}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3.5, 0 7"
              className="fill-slate-400 dark:fill-slate-500"
            />
          </marker>
        </defs>
        
        {/* Render objects */}
        {objects.map(renderObject)}
      </svg>
      
      {/* Canvas controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button
          onClick={fitToContent}
          className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          title="Fit to content"
          data-testid="button-fit-to-content"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 20h16v2H4v-2zm0-18h16v2H4V2zm9 12h-2v-2h2v2zm0-4h-2V8h2v2z"/>
          </svg>
        </button>
      </div>
      
      {/* Zoom indicator */}
      <div className="absolute bottom-4 left-4 px-3 py-1 bg-white dark:bg-slate-800 rounded-full shadow-lg border border-slate-200 dark:border-slate-700 text-sm font-medium">
        {Math.round(viewport.zoom * 100)}%
      </div>
      
      {/* Mobile-specific touch hints */}
      {viewMode === 'executive' && (
        <div className="absolute bottom-4 right-4 text-xs text-slate-500 dark:text-slate-400 bg-white/80 dark:bg-slate-800/80 px-2 py-1 rounded">
          Pinch to zoom • Drag to pan • Tap to select
        </div>
      )}
      
      <style>
        {`
          @keyframes dash {
            to {
              stroke-dashoffset: -12;
            }
          }
        `}
      </style>
    </div>
  );
}