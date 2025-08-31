import React, { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface RightResizableSplitterProps {
  rightWidth: number;
  onResize: (width: number) => void;
  minWidth?: number;
  maxWidth?: number;
  className?: string;
}

export function RightResizableSplitter({
  rightWidth,
  onResize,
  minWidth = 200,
  maxWidth = 600,
  className
}: RightResizableSplitterProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);

    const startX = e.clientX;
    const startWidth = rightWidth;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = startX - e.clientX; // Inverted for right panel
      const newWidth = Math.min(maxWidth, Math.max(minWidth, startWidth + deltaX));
      onResize(newWidth);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [rightWidth, onResize, minWidth, maxWidth]);

  return (
    <div
      className={cn(
        "relative w-1 bg-border hover:bg-primary/50 transition-colors cursor-col-resize group",
        isDragging && "bg-primary",
        className
      )}
      onMouseDown={handleMouseDown}
      data-testid="right-resizable-splitter"
    >
      {/* Visual indicator */}
      <div className="absolute inset-y-0 -left-1 -right-1 flex items-center justify-center">
        <div className="w-1 h-8 bg-border group-hover:bg-primary/70 rounded-full transition-colors" />
      </div>
      
      {/* Dragging overlay */}
      {isDragging && (
        <div className="fixed inset-0 z-50 cursor-col-resize" />
      )}
    </div>
  );
}