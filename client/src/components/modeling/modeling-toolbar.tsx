import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Trash2, 
  Copy, 
  Link, 
  Group, 
  Ungroup,
  AlignLeft,
  AlignCenter,
  AlignRight,
  RotateCcw,
  Move,
  MousePointer2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModelingToolbarProps {
  selectedObjects: string[];
  viewMode: 'detailed' | 'overview' | 'executive' | 'presentation';
  onObjectDelete: (objectId: string) => void;
  className?: string;
}

export function ModelingToolbar({
  selectedObjects,
  viewMode,
  onObjectDelete,
  className
}: ModelingToolbarProps) {
  const hasSelection = selectedObjects.length > 0;
  const hasMultipleSelection = selectedObjects.length > 1;

  const handleDelete = () => {
    selectedObjects.forEach(id => onObjectDelete(id));
  };

  const handleCopy = () => {
    // TODO: Implement copy functionality
    console.log('Copy objects:', selectedObjects);
  };

  const handleGroup = () => {
    // TODO: Implement grouping functionality
    console.log('Group objects:', selectedObjects);
  };

  const handleAlign = (alignment: 'left' | 'center' | 'right') => {
    // TODO: Implement alignment functionality
    console.log('Align objects:', alignment, selectedObjects);
  };

  return (
    <div className={cn("bg-card border-t border-border px-4 py-2 flex items-center justify-between", className)}>
      {/* Tool selection */}
      <div className="flex items-center space-x-1">
        <Button 
          variant="ghost" 
          size="sm" 
          className="bg-muted"
          data-testid="tool-select"
        >
          <MousePointer2 className="h-4 w-4 mr-2" />
          Select
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          data-testid="tool-move"
        >
          <Move className="h-4 w-4 mr-2" />
          Move
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          data-testid="tool-connect"
        >
          <Link className="h-4 w-4 mr-2" />
          Connect
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Object actions */}
      <div className="flex items-center space-x-1">
        <Button 
          variant="ghost" 
          size="sm" 
          disabled={!hasSelection}
          onClick={handleCopy}
          data-testid="button-copy"
        >
          <Copy className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          disabled={!hasSelection}
          onClick={handleDelete}
          data-testid="button-delete"
        >
          <Trash2 className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-4 mx-2" />

        {/* Grouping */}
        <Button 
          variant="ghost" 
          size="sm" 
          disabled={!hasMultipleSelection}
          onClick={handleGroup}
          data-testid="button-group"
        >
          <Group className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          disabled={!hasSelection}
          data-testid="button-ungroup"
        >
          <Ungroup className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-4 mx-2" />

        {/* Alignment */}
        <Button 
          variant="ghost" 
          size="sm" 
          disabled={!hasMultipleSelection}
          onClick={() => handleAlign('left')}
          data-testid="button-align-left"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          disabled={!hasMultipleSelection}
          onClick={() => handleAlign('center')}
          data-testid="button-align-center"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          disabled={!hasMultipleSelection}
          onClick={() => handleAlign('right')}
          data-testid="button-align-right"
        >
          <AlignRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Status and info */}
      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
        {hasSelection && (
          <span data-testid="selection-count">
            {selectedObjects.length} object{selectedObjects.length !== 1 ? 's' : ''} selected
          </span>
        )}
        
        <div className="flex items-center space-x-2">
          <span>View:</span>
          <span className="font-medium capitalize text-foreground">{viewMode}</span>
        </div>
      </div>
    </div>
  );
}