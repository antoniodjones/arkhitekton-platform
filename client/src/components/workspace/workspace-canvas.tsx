import React, { forwardRef, useCallback, useState } from 'react';
import { WorkspaceObject } from './workspace-object';
import type { WorkspaceState, WorkspaceObjectInstance } from './workspace';

interface WorkspaceCanvasProps {
  state: WorkspaceState;
  onStateChange: (state: WorkspaceState) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  readonly?: boolean;
}

export const WorkspaceCanvas = forwardRef<HTMLDivElement, WorkspaceCanvasProps>(
  ({ state, onStateChange, onDrop, onDragOver, readonly = false }, ref) => {
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    // Handle object position updates
    const handleObjectMove = useCallback((objectId: string, newPosition: { x: number; y: number }) => {
      onStateChange({
        ...state,
        objects: state.objects.map(obj =>
          obj.id === objectId
            ? { ...obj, position: newPosition, updatedAt: new Date() }
            : obj
        )
      });
    }, [state, onStateChange]);

    // Handle object selection
    const handleObjectSelect = useCallback((objectId: string, multiSelect = false) => {
      if (readonly) return;
      
      onStateChange({
        ...state,
        selectedObjects: multiSelect
          ? state.selectedObjects.includes(objectId)
            ? state.selectedObjects.filter(id => id !== objectId)
            : [...state.selectedObjects, objectId]
          : [objectId]
      });
    }, [state, onStateChange, readonly]);

    // Handle canvas panning
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
      if (state.mode === 'pan' || (e.ctrlKey && e.button === 0)) {
        setIsDragging(true);
        setDragStart({ x: e.clientX, y: e.clientY });
        e.preventDefault();
      }
    }, [state.mode]);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;
        
        onStateChange({
          ...state,
          viewport: {
            ...state.viewport,
            x: state.viewport.x + deltaX,
            y: state.viewport.y + deltaY
          }
        });
        
        setDragStart({ x: e.clientX, y: e.clientY });
      }
    }, [isDragging, dragStart, state, onStateChange]);

    const handleMouseUp = useCallback(() => {
      setIsDragging(false);
    }, []);

    // Handle canvas click (deselect all)
    const handleCanvasClick = useCallback((e: React.MouseEvent) => {
      if (e.target === e.currentTarget && !readonly) {
        onStateChange({
          ...state,
          selectedObjects: []
        });
      }
    }, [state, onStateChange, readonly]);

    // Generate grid pattern
    const gridSize = 20;
    const gridOpacity = Math.min(0.3, state.viewport.zoom * 0.3);

    return (
      <div
        ref={ref}
        className="relative w-full h-full overflow-hidden bg-background cursor-crosshair"
        onDrop={onDrop}
        onDragOver={onDragOver}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleCanvasClick}
        data-testid="workspace-canvas"
      >
        {/* Grid Background */}
        <svg
          className="absolute inset-0 pointer-events-none"
          style={{
            transform: `translate(${state.viewport.x % (gridSize * state.viewport.zoom)}px, ${state.viewport.y % (gridSize * state.viewport.zoom)}px)`
          }}
        >
          <defs>
            <pattern
              id="grid"
              width={gridSize * state.viewport.zoom}
              height={gridSize * state.viewport.zoom}
              patternUnits="userSpaceOnUse"
            >
              <path
                d={`M ${gridSize * state.viewport.zoom} 0 L 0 0 0 ${gridSize * state.viewport.zoom}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                opacity={gridOpacity}
                className="text-muted-foreground"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Workspace Objects */}
        <div
          className="relative w-full h-full"
          style={{
            transform: `translate(${state.viewport.x}px, ${state.viewport.y}px) scale(${state.viewport.zoom})`
          }}
        >
          {state.objects.map((obj) => (
            <WorkspaceObject
              key={obj.id}
              object={obj}
              isSelected={state.selectedObjects.includes(obj.id)}
              onMove={handleObjectMove}
              onSelect={handleObjectSelect}
              readonly={readonly}
              zoom={state.viewport.zoom}
            />
          ))}

          {/* Connection Lines - Placeholder for now */}
          <svg className="absolute inset-0 pointer-events-none">
            {state.connections.map((connection) => {
              const fromObj = state.objects.find(obj => obj.id === connection.from);
              const toObj = state.objects.find(obj => obj.id === connection.to);
              
              if (!fromObj || !toObj) return null;
              
              const fromCenter = {
                x: fromObj.position.x + fromObj.size.width / 2,
                y: fromObj.position.y + fromObj.size.height / 2
              };
              const toCenter = {
                x: toObj.position.x + toObj.size.width / 2,
                y: toObj.position.y + toObj.size.height / 2
              };
              
              return (
                <line
                  key={connection.id}
                  x1={fromCenter.x}
                  y1={fromCenter.y}
                  x2={toCenter.x}
                  y2={toCenter.y}
                  stroke="hsl(var(--primary))"
                  strokeWidth="2"
                  strokeDasharray={connection.style === 'dashed' ? '5,5' : undefined}
                />
              );
            })}
          </svg>
        </div>

        {/* Drop Zone Indicator */}
        {isDragging && (
          <div className="absolute inset-0 bg-primary/10 border-2 border-dashed border-primary pointer-events-none" />
        )}
      </div>
    );
  }
);