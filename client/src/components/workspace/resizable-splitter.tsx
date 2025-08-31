import React, { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface ResizableSplitterProps {
  width: number;
  onResize: (width: number) => void;
  direction?: 'left' | 'right';
  minWidth?: number;
  maxWidth?: number;
  className?: string;
}

export function ResizableSplitter({
  width,
  onResize,
  direction = 'left',
  minWidth = 200,
  maxWidth = 600,
  className
}: ResizableSplitterProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);

    const startX = e.clientX;
    const startWidth = width;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = direction === 'left' ? e.clientX - startX : startX - e.clientX;
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
  }, [width, onResize, direction, minWidth, maxWidth]);

  return (
    <div
      className={cn(
        "relative w-1 bg-border hover:bg-primary/50 transition-colors cursor-col-resize group",
        isDragging && "bg-primary",
        className
      )}
      onMouseDown={handleMouseDown}
      data-testid={`${direction}-resizable-splitter`}
    >
      <div className="absolute inset-y-0 -left-1 -right-1 flex items-center justify-center">
        <div className="w-1 h-8 bg-border group-hover:bg-primary/70 rounded-full transition-colors" />
      </div>
      
      {isDragging && (
        <div className="fixed inset-0 z-50 cursor-col-resize" />
      )}
    </div>
  );
}