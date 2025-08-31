import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Plus, Save, Undo, Redo, ZoomIn, ZoomOut, Move, Hand } from 'lucide-react';
import { WorkspaceCanvas } from './workspace-canvas';
import { WorkspaceToolbar } from './workspace-toolbar';
import { WorkspaceObject } from './workspace-object';
import type { ArchimateElement } from '@/data/archimate-elements';

export interface WorkspaceObjectInstance {
  id: string;
  element: ArchimateElement;
  position: { x: number; y: number };
  size: { width: number; height: number };
  connections: string[]; // IDs of connected objects
  annotations: string[];
  state: 'current' | 'planned' | 'deprecated';
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkspaceConnection {
  id: string;
  from: string; // Object ID
  to: string; // Object ID
  type: 'association' | 'composition' | 'aggregation' | 'realization' | 'flow';
  label?: string;
  style: 'solid' | 'dashed' | 'dotted';
  metadata: Record<string, any>;
}

export interface WorkspaceState {
  objects: WorkspaceObjectInstance[];
  connections: WorkspaceConnection[];
  viewport: {
    x: number;
    y: number;
    zoom: number;
  };
  selectedObjects: string[];
  mode: 'select' | 'pan' | 'connect' | 'annotate';
}

interface WorkspaceProps {
  className?: string;
  onSave?: (state: WorkspaceState) => void;
  onLoad?: () => WorkspaceState | null;
  readonly?: boolean;
}

export function Workspace({ className, onSave, onLoad, readonly = false }: WorkspaceProps) {
  const [workspaceState, setWorkspaceState] = useState<WorkspaceState>({
    objects: [],
    connections: [],
    viewport: { x: 0, y: 0, zoom: 1 },
    selectedObjects: [],
    mode: 'select'
  });

  const [history, setHistory] = useState<WorkspaceState[]>([workspaceState]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Add object to workspace
  const addObject = useCallback((element: ArchimateElement, position: { x: number; y: number }) => {
    const newObject: WorkspaceObjectInstance = {
      id: `obj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      element,
      position,
      size: { width: 120, height: 80 },
      connections: [],
      annotations: [],
      state: 'current',
      metadata: {},
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setWorkspaceState(prev => {
      const newState = {
        ...prev,
        objects: [...prev.objects, newObject]
      };
      
      // Add to history
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newState);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      
      return newState;
    });
  }, [history, historyIndex]);

  // Handle drag and drop from palette
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    
    try {
      const elementData = JSON.parse(e.dataTransfer.getData('application/json'));
      const rect = canvasRef.current?.getBoundingClientRect();
      
      if (rect && elementData) {
        const position = {
          x: (e.clientX - rect.left - workspaceState.viewport.x) / workspaceState.viewport.zoom,
          y: (e.clientY - rect.top - workspaceState.viewport.y) / workspaceState.viewport.zoom
        };
        
        addObject(elementData, position);
      }
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  }, [addObject, workspaceState.viewport]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  // Undo/Redo functionality
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setWorkspaceState(history[historyIndex - 1]);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setWorkspaceState(history[historyIndex + 1]);
    }
  }, [history, historyIndex]);

  // Zoom functionality
  const zoomIn = useCallback(() => {
    setWorkspaceState(prev => ({
      ...prev,
      viewport: {
        ...prev.viewport,
        zoom: Math.min(prev.viewport.zoom * 1.2, 3)
      }
    }));
  }, []);

  const zoomOut = useCallback(() => {
    setWorkspaceState(prev => ({
      ...prev,
      viewport: {
        ...prev.viewport,
        zoom: Math.max(prev.viewport.zoom / 1.2, 0.1)
      }
    }));
  }, []);

  // Save workspace
  const handleSave = useCallback(() => {
    if (onSave) {
      onSave(workspaceState);
    }
  }, [workspaceState, onSave]);

  return (
    <div className={`flex flex-col h-full bg-background ${className || ''}`}>
      {/* Workspace Toolbar */}
      <WorkspaceToolbar
        mode={workspaceState.mode}
        onModeChange={(mode) => setWorkspaceState(prev => ({ ...prev, mode }))}
        onUndo={undo}
        onRedo={redo}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onSave={handleSave}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        readonly={readonly}
        zoom={workspaceState.viewport.zoom}
      />
      
      <Separator />
      
      {/* Workspace Canvas */}
      <div className="flex-1 relative overflow-hidden">
        <WorkspaceCanvas
          ref={canvasRef}
          state={workspaceState}
          onStateChange={setWorkspaceState}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          readonly={readonly}
        />
      </div>
      
      {/* Status Bar */}
      <div className="h-8 bg-muted/30 border-t flex items-center justify-between px-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>{workspaceState.objects.length} objects</span>
          <span>{workspaceState.connections.length} connections</span>
          <span>Mode: {workspaceState.mode}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Zoom: {Math.round(workspaceState.viewport.zoom * 100)}%</span>
        </div>
      </div>
    </div>
  );
}