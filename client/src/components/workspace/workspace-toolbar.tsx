import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Save, 
  Undo, 
  Redo, 
  ZoomIn, 
  ZoomOut, 
  MousePointer2, 
  Hand, 
  Link, 
  MessageSquare,
  Grid3X3,
  Settings
} from 'lucide-react';

interface WorkspaceToolbarProps {
  mode: 'select' | 'pan' | 'connect' | 'annotate';
  onModeChange: (mode: 'select' | 'pan' | 'connect' | 'annotate') => void;
  onUndo: () => void;
  onRedo: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onSave: () => void;
  canUndo: boolean;
  canRedo: boolean;
  readonly?: boolean;
  zoom: number;
}

export function WorkspaceToolbar({
  mode,
  onModeChange,
  onUndo,
  onRedo,
  onZoomIn,
  onZoomOut,
  onSave,
  canUndo,
  canRedo,
  readonly = false,
  zoom
}: WorkspaceToolbarProps) {
  const modeButtons = [
    { mode: 'select' as const, icon: MousePointer2, label: 'Select' },
    { mode: 'pan' as const, icon: Hand, label: 'Pan' },
    { mode: 'connect' as const, icon: Link, label: 'Connect' },
    { mode: 'annotate' as const, icon: MessageSquare, label: 'Annotate' }
  ];

  return (
    <div className="h-12 bg-muted/30 border-b flex items-center justify-between px-4">
      {/* Left Section - Mode Tools */}
      <div className="flex items-center gap-1">
        {modeButtons.map(({ mode: buttonMode, icon: Icon, label }) => (
          <Button
            key={buttonMode}
            variant={mode === buttonMode ? "default" : "ghost"}
            size="sm"
            onClick={() => onModeChange(buttonMode)}
            disabled={readonly}
            className="h-8 px-3"
            data-testid={`mode-${buttonMode}`}
          >
            <Icon className="h-4 w-4 mr-1" />
            {label}
          </Button>
        ))}
        
        <Separator orientation="vertical" className="h-6 mx-2" />
        
        {/* Undo/Redo */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onUndo}
          disabled={!canUndo || readonly}
          className="h-8 px-2"
          data-testid="button-undo"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRedo}
          disabled={!canRedo || readonly}
          className="h-8 px-2"
          data-testid="button-redo"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Center Section - View Controls */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onZoomOut}
          className="h-8 px-2"
          data-testid="button-zoom-out"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        
        <Badge variant="outline" className="font-mono text-xs">
          {Math.round(zoom * 100)}%
        </Badge>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onZoomIn}
          className="h-8 px-2"
          data-testid="button-zoom-in"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        
        <Separator orientation="vertical" className="h-6 mx-2" />
        
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2"
          data-testid="button-grid"
        >
          <Grid3X3 className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Right Section - Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2"
          data-testid="button-settings"
        >
          <Settings className="h-4 w-4" />
        </Button>
        
        <Separator orientation="vertical" className="h-6 mx-2" />
        
        <Button
          variant="default"
          size="sm"
          onClick={onSave}
          disabled={readonly}
          className="h-8 px-3"
          data-testid="button-save"
        >
          <Save className="h-4 w-4 mr-1" />
          Save
        </Button>
      </div>
    </div>
  );
}