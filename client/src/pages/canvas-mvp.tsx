import { useState, useCallback } from 'react';
import { useLocation } from 'wouter';
import { AppLayout } from '@/components/layout/app-layout';
import { DesignCanvasMVP } from '@/components/canvas/design-canvas-mvp';
import { ShapePalette, ShapeType } from '@/components/canvas/shape-palette';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Download } from 'lucide-react';

/**
 * Canvas MVP Page
 * 
 * Minimal viable canvas with basic shapes and connections
 * Sprint Goal: 41 points (6 stories)
 * 
 * Stories Implemented:
 * - US-CVS-001: Infinite Canvas Pan/Zoom ✅
 * - US-CVS-010: Basic Shape Library (in progress)
 * - US-CVS-004: Shape Drag & Drop (pending)
 * - US-CVS-006: Connection Creation (pending)
 * - US-CVS-011: Connection Routing (pending)
 * - US-CVS-008: Multi-Selection (pending)
 */

export default function CanvasMVPPage() {
  const [, setLocation] = useLocation();
  const [modelName] = useState('Untitled Diagram');
  const [isDirty, setIsDirty] = useState(false);

  const handleSave = () => {
    // TODO: Implement save to database (US-CVS-004)
    console.log('Saving diagram...');
    setIsDirty(false);
  };

  const handleExport = () => {
    // TODO: Implement PNG export (US-CVS-009 - Phase 2)
    console.log('Exporting diagram...');
  };

  const handleShapeSelect = useCallback((shapeType: ShapeType, defaultSize: { width: number; height: number }) => {
    // Call the canvas's addShape method via window global (temporary bridge)
    if ((window as any).__canvasAddShape) {
      (window as any).__canvasAddShape(shapeType, defaultSize);
      setIsDirty(true);
    }
  }, []);

  return (
    <AppLayout>
      <div className="flex flex-col h-screen">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-3 border-b border-border bg-card">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation('/studio')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Studio
            </Button>
            
            <div className="h-6 w-px bg-border" />
            
            <div>
              <h1 className="text-lg font-semibold">{modelName}</h1>
              <p className="text-xs text-muted-foreground">
                Canvas MVP (Option C) - Basic Shapes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            
            <Button
              size="sm"
              onClick={handleSave}
              disabled={!isDirty}
            >
              <Save className="h-4 w-4 mr-2" />
              {isDirty ? 'Save Changes' : 'Saved'}
            </Button>
          </div>
        </header>

        {/* Canvas + Shape Palette */}
        <div className="flex-1 flex overflow-hidden">
          {/* Shape Palette (left sidebar) - US-CVS-010 ✅ */}
          <ShapePalette onShapeSelect={handleShapeSelect} />

          {/* Canvas Area */}
          <main className="flex-1 relative">
            <DesignCanvasMVP
              onShapeAdd={(shapeType, position, size) => {
                console.log('Shape added:', shapeType, position, size);
                setIsDirty(true);
              }}
            />
          </main>
        </div>
      </div>
    </AppLayout>
  );
}

