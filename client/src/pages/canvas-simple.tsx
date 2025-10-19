import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Tldraw, Editor, createShapeId } from 'tldraw';
import 'tldraw/tldraw.css';
import { GovernanceHeader } from '@/components/layout/governance-header';
import { Button } from '@/components/ui/button';
import { Palette, ArrowLeft, Download, Save, Undo2, Redo2, Shapes, X } from 'lucide-react';
import { archiMateShapeUtils } from '@/lib/archimate-shapes';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

// Shape definitions organized by ArchiMate layer
const ARCHIMATE_SHAPES = {
  business: [
    { type: 'business-actor', label: 'Business Actor', color: '#FFFFCC' },
    { type: 'business-role', label: 'Business Role', color: '#FFFFCC' },
    { type: 'business-process', label: 'Business Process', color: '#FFFFCC' },
    { type: 'business-service', label: 'Business Service', color: '#FFFFCC' },
    { type: 'business-object', label: 'Business Object', color: '#FFFFCC' },
  ],
  application: [
    { type: 'app-component', label: 'Application Component', color: '#B3E0FF' },
    { type: 'app-service', label: 'Application Service', color: '#B3E0FF' },
    { type: 'data-object', label: 'Data Object', color: '#B3E0FF' },
  ],
  technology: [
    { type: 'tech-node', label: 'Technology Node', color: '#C1E1C1' },
    { type: 'device', label: 'Device', color: '#C1E1C1' },
    { type: 'tech-service', label: 'Technology Service', color: '#C1E1C1' },
    { type: 'artifact', label: 'Artifact', color: '#C1E1C1' },
  ],
};

export default function CanvasSimple() {
  const [, setLocation] = useLocation();
  const [editor, setEditor] = useState<Editor | null>(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [shapesModalOpen, setShapesModalOpen] = useState(false);
  const [draggedShape, setDraggedShape] = useState<string | null>(null);
  const { toast } = useToast();

  // Handle editor mount
  const handleMount = (editorInstance: Editor) => {
    setEditor(editorInstance);
    console.log('tldraw editor mounted successfully');
  };

  // Subscribe to history changes for undo/redo state
  useEffect(() => {
    if (!editor) return;

    const updateHistoryState = () => {
      setCanUndo(editor.getCanUndo());
      setCanRedo(editor.getCanRedo());
    };

    // Initial state
    updateHistoryState();

    // Subscribe to history changes
    const unsubscribe = editor.store.listen(() => {
      updateHistoryState();
    });

    return () => {
      unsubscribe();
    };
  }, [editor]);

  // Save diagram
  const handleSave = () => {
    if (!editor) return;

    const snapshot = editor.store.getStoreSnapshot();
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `arkhitekton-diagram-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: 'Diagram saved',
      description: 'Your architecture diagram has been downloaded.',
    });
  };

  // Export as SVG
  const handleExportPNG = async () => {
    if (!editor) return;

    try {
      const shapeIds = editor.getCurrentPageShapeIds();
      if (shapeIds.size === 0) {
        toast({
          title: 'Nothing to export',
          description: 'Add some shapes to the canvas first.',
          variant: 'destructive',
        });
        return;
      }

      const shapeIdsArray = Array.from(shapeIds);
      const svgResult = await editor.getSvgString(shapeIdsArray, {
        background: true,
      });

      if (!svgResult) {
        toast({
          title: 'Export failed',
          description: 'Could not generate SVG.',
          variant: 'destructive',
        });
        return;
      }

      // Create download link
      const url = URL.createObjectURL(new Blob([svgResult.svg], { type: 'image/svg+xml' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `arkhitekton-diagram-${Date.now()}.svg`;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: 'Diagram exported',
        description: 'Your architecture diagram has been exported as SVG.',
      });
    } catch (error) {
      toast({
        title: 'Export failed',
        description: 'Could not export the diagram.',
        variant: 'destructive',
      });
    }
  };

  // Add shape to canvas (double-click handler)
  const handleAddShape = (shapeType: string) => {
    if (!editor) return;

    const viewportCenter = editor.getViewportScreenCenter();
    const pagePoint = editor.screenToPage(viewportCenter);
    const shapeId = createShapeId();

    editor.createShape({
      id: shapeId,
      type: shapeType,
      x: pagePoint.x - 70,
      y: pagePoint.y - 40,
    });

    editor.select(shapeId);
    setShapesModalOpen(false);

    toast({
      title: 'Shape added',
      description: 'Click and drag to reposition the shape.',
    });
  };

  // Handle drag start
  const handleDragStart = (e: React.DragEvent, shapeType: string) => {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('text/plain', shapeType);
    setDraggedShape(shapeType);
  };

  // Handle drag end
  const handleDragEnd = () => {
    setDraggedShape(null);
  };

  // Handle drop on canvas
  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!editor || !draggedShape) return;

    const shapeType = e.dataTransfer.getData('text/plain');
    if (!shapeType) return;

    // Get canvas coordinates from mouse position
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Convert screen coordinates to page coordinates
    const pagePoint = editor.screenToPage({ x, y });

    const shapeId = createShapeId();
    editor.createShape({
      id: shapeId,
      type: shapeType,
      x: pagePoint.x - 70,
      y: pagePoint.y - 40,
    });

    editor.select(shapeId);
    setDraggedShape(null);
    setShapesModalOpen(false);

    toast({
      title: 'Shape added',
      description: 'Shape dropped on canvas.',
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  // Undo/Redo shortcuts
  useEffect(() => {
    if (!editor) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        editor.undo();
      } else if ((e.metaKey || e.ctrlKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        editor.redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editor]);

  return (
    <div className="h-full overflow-hidden flex flex-col">
      <GovernanceHeader 
        moduleTitle="Design Studio - Canvas" 
        moduleIcon={Palette} 
      >
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShapesModalOpen(true)}
            className="text-slate-300 hover:text-white hover:bg-slate-800 border-0"
            data-testid="button-open-shapes"
          >
            <Shapes className="h-4 w-4 mr-2" />
            Shapes
          </Button>
          <div className="w-px h-4 bg-slate-700" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor?.undo()}
            disabled={!canUndo}
            className="text-slate-300 hover:text-white hover:bg-slate-800 border-0"
            data-testid="button-undo"
          >
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor?.redo()}
            disabled={!canRedo}
            className="text-slate-300 hover:text-white hover:bg-slate-800 border-0"
            data-testid="button-redo"
          >
            <Redo2 className="h-4 w-4" />
          </Button>
          <div className="w-px h-4 bg-slate-700" />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSave}
            disabled={!editor}
            className="text-slate-300 hover:text-white hover:bg-slate-800 border-0"
            data-testid="button-save"
          >
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleExportPNG}
            disabled={!editor}
            className="text-slate-300 hover:text-white hover:bg-slate-800 border-0"
            data-testid="button-export"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <div className="w-px h-4 bg-slate-700" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation('/studio')}
            className="text-slate-300 hover:text-white hover:bg-slate-800 border-0"
            data-testid="button-back-to-studio"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Design Studio
          </Button>
        </div>
      </GovernanceHeader>

      <div className="flex-1 relative">
        {/* Shapes Modal */}
        <Dialog open={shapesModalOpen} onOpenChange={setShapesModalOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-orange-500" />
                ArchiMate Shapes
              </DialogTitle>
            </DialogHeader>
            
            <ScrollArea className="h-[60vh] pr-4">
              <div className="space-y-6">
                {/* Business Layer */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: '#FFFFCC' }} />
                    Business Layer
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {ARCHIMATE_SHAPES.business.map((shape) => (
                      <div
                        key={shape.type}
                        draggable
                        onDragStart={(e) => handleDragStart(e, shape.type)}
                        onDragEnd={handleDragEnd}
                        onDoubleClick={() => handleAddShape(shape.type)}
                        className="p-4 rounded-lg border-2 border-slate-200 dark:border-slate-700 hover:border-orange-500 dark:hover:border-orange-500 cursor-move transition-all hover:shadow-md"
                        data-testid={`shape-${shape.type}`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-12 h-12 rounded border border-black flex items-center justify-center text-xs font-normal"
                            style={{ backgroundColor: shape.color }}
                          >
                            {shape.label.split(' ')[0]}
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                              {shape.label}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                              Double-click or drag
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Application Layer */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: '#B3E0FF' }} />
                    Application Layer
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {ARCHIMATE_SHAPES.application.map((shape) => (
                      <div
                        key={shape.type}
                        draggable
                        onDragStart={(e) => handleDragStart(e, shape.type)}
                        onDragEnd={handleDragEnd}
                        onDoubleClick={() => handleAddShape(shape.type)}
                        className="p-4 rounded-lg border-2 border-slate-200 dark:border-slate-700 hover:border-orange-500 dark:hover:border-orange-500 cursor-move transition-all hover:shadow-md"
                        data-testid={`shape-${shape.type}`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-12 h-12 rounded border border-black flex items-center justify-center text-xs font-normal"
                            style={{ backgroundColor: shape.color }}
                          >
                            {shape.label.split(' ')[0]}
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                              {shape.label}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                              Double-click or drag
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Technology Layer */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: '#C1E1C1' }} />
                    Technology Layer
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {ARCHIMATE_SHAPES.technology.map((shape) => (
                      <div
                        key={shape.type}
                        draggable
                        onDragStart={(e) => handleDragStart(e, shape.type)}
                        onDragEnd={handleDragEnd}
                        onDoubleClick={() => handleAddShape(shape.type)}
                        className="p-4 rounded-lg border-2 border-slate-200 dark:border-slate-700 hover:border-orange-500 dark:hover:border-orange-500 cursor-move transition-all hover:shadow-md"
                        data-testid={`shape-${shape.type}`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-12 h-12 rounded border border-black flex items-center justify-center text-xs font-normal"
                            style={{ backgroundColor: shape.color }}
                          >
                            {shape.label.split(' ')[0]}
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                              {shape.label}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                              Double-click or drag
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>

        {/* tldraw Canvas with ArchiMate shapes */}
        <div
          onDrop={handleCanvasDrop}
          onDragOver={handleDragOver}
          className="h-full w-full"
        >
          <Tldraw
            onMount={handleMount}
            shapeUtils={archiMateShapeUtils}
          />
        </div>
      </div>
    </div>
  );
}
