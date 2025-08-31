import React, { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Link, MessageSquare, Copy, Trash2 } from 'lucide-react';
import { getIcon } from '@/components/palette/element-card';
import type { WorkspaceObjectInstance } from './workspace';

interface WorkspaceObjectProps {
  object: WorkspaceObjectInstance;
  isSelected: boolean;
  onMove: (objectId: string, position: { x: number; y: number }) => void;
  onSelect: (objectId: string, multiSelect?: boolean) => void;
  readonly?: boolean;
  zoom: number;
}

export function WorkspaceObject({
  object,
  isSelected,
  onMove,
  onSelect,
  readonly = false,
  zoom
}: WorkspaceObjectProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showActions, setShowActions] = useState(false);

  const Icon = getIcon(object.element.iconName);

  // Handle dragging
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (readonly) return;
    
    e.stopPropagation();
    
    if (e.button === 0) { // Left click only
      setIsDragging(true);
      setDragStart({
        x: e.clientX - object.position.x * zoom,
        y: e.clientY - object.position.y * zoom
      });
      
      // Select object if not already selected
      if (!isSelected) {
        onSelect(object.id, e.ctrlKey || e.metaKey);
      }
    }
  }, [object.position, object.id, isSelected, onSelect, readonly, zoom]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging && !readonly) {
      const newPosition = {
        x: (e.clientX - dragStart.x) / zoom,
        y: (e.clientY - dragStart.y) / zoom
      };
      onMove(object.id, newPosition);
    }
  }, [isDragging, dragStart, object.id, onMove, readonly, zoom]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Handle click (selection)
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!readonly) {
      onSelect(object.id, e.ctrlKey || e.metaKey);
    }
  }, [object.id, onSelect, readonly]);

  // State-based styling
  const getStateStyle = () => {
    switch (object.state) {
      case 'planned':
        return 'border-dashed border-blue-400 bg-blue-50/50 dark:bg-blue-950/20';
      case 'deprecated':
        return 'border-dashed border-red-400 bg-red-50/50 dark:bg-red-950/20 opacity-60';
      default:
        return 'border-solid';
    }
  };

  return (
    <div
      className="absolute group"
      style={{
        left: object.position.x,
        top: object.position.y,
        width: object.size.width,
        height: object.size.height
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => {
        handleMouseUp();
        setShowActions(false);
      }}
      onClick={handleClick}
      onMouseEnter={() => setShowActions(true)}
      data-testid={`workspace-object-${object.id}`}
    >
      <Card
        className={`
          relative w-full h-full p-3 cursor-move transition-all duration-200
          ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}
          ${getStateStyle()}
          ${isDragging ? 'shadow-lg scale-105 z-50' : 'hover:shadow-md'}
        `}
        style={{
          backgroundColor: `${object.element.color}15`,
          borderColor: object.element.color
        }}
      >
        {/* Element Icon and Name */}
        <div className="flex items-start gap-2 h-full">
          <div
            className="flex-shrink-0 w-6 h-6 rounded flex items-center justify-center"
            style={{ backgroundColor: object.element.color }}
          >
            <Icon className="w-4 h-4 text-white" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">
              {object.element.name}
            </div>
            <div className="text-xs text-muted-foreground truncate">
              {object.element.framework}
            </div>
          </div>
        </div>

        {/* State Badge */}
        {object.state !== 'current' && (
          <Badge
            variant="outline"
            className="absolute top-1 right-1 text-xs"
            style={{
              borderColor: object.state === 'planned' ? '#3b82f6' : '#ef4444',
              color: object.state === 'planned' ? '#3b82f6' : '#ef4444'
            }}
          >
            {object.state}
          </Badge>
        )}

        {/* Connection Points */}
        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Action Buttons */}
        {showActions && !readonly && (
          <div className="absolute -top-8 right-0 flex items-center gap-1 bg-background border rounded shadow-md p-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              data-testid={`button-connect-${object.id}`}
            >
              <Link className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              data-testid={`button-annotate-${object.id}`}
            >
              <MessageSquare className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              data-testid={`button-more-${object.id}`}
            >
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </div>
        )}

        {/* Annotations */}
        {object.annotations.length > 0 && (
          <div className="absolute -bottom-6 left-0 right-0">
            <div className="text-xs bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded px-2 py-1 truncate">
              {object.annotations[0]}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}