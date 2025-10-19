import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Tldraw, Editor, createShapeId } from 'tldraw';
import 'tldraw/tldraw.css';
import { GovernanceHeader } from '@/components/layout/governance-header';
import { Button } from '@/components/ui/button';
import { Palette, ArrowLeft, Download, Save, Undo2, Redo2, ChevronDown, ChevronRight } from 'lucide-react';
import { archiMateShapeUtils } from '@/lib/archimate-shapes';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';

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
  const [expandedLayers, setExpandedLayers] = useState({
    business: true,
    application: true,
    technology: true,
  });
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

  // Add shape to canvas
  const handleAddShape = (shapeType: string) => {
    if (!editor) return;

    const viewportCenter = editor.getViewportPageCenter();
    const shapeId = createShapeId();

    editor.createShape({
      id: shapeId,
      type: shapeType,
      x: viewportCenter.x - 70,
      y: viewportCenter.y - 40,
    });

    editor.select(shapeId);

    toast({
      title: 'Shape added',
      description: 'Click and drag to reposition the shape.',
    });
  };

  // Toggle layer expansion
  const toggleLayer = (layer: keyof typeof expandedLayers) => {
    setExpandedLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
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
        {/* Shape Palette Panel */}
        <Card className="absolute left-4 top-4 z-10 w-64 bg-slate-900/95 border-slate-700 shadow-xl">
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <Palette className="h-5 w-5 text-orange-500" />
              <h3 className="font-semibold text-white">ArchiMate Shapes</h3>
            </div>

            {/* Business Layer */}
            <div>
              <button
                onClick={() => toggleLayer('business')}
                className="w-full flex items-center justify-between text-left py-2 px-2 rounded hover:bg-slate-800 transition-colors"
                data-testid="toggle-business-layer"
              >
                <span className="text-sm font-medium text-slate-200">Business Layer</span>
                {expandedLayers.business ? (
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                )}
              </button>
              {expandedLayers.business && (
                <div className="mt-2 space-y-1 pl-2">
                  {ARCHIMATE_SHAPES.business.map((shape) => (
                    <button
                      key={shape.type}
                      onClick={() => handleAddShape(shape.type)}
                      className="w-full text-left py-2 px-3 rounded text-sm text-slate-300 hover:bg-slate-800 transition-colors flex items-center gap-2"
                      data-testid={`shape-${shape.type}`}
                    >
                      <div
                        className="w-4 h-4 rounded border border-black"
                        style={{ backgroundColor: shape.color }}
                      />
                      {shape.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Application Layer */}
            <div>
              <button
                onClick={() => toggleLayer('application')}
                className="w-full flex items-center justify-between text-left py-2 px-2 rounded hover:bg-slate-800 transition-colors"
                data-testid="toggle-application-layer"
              >
                <span className="text-sm font-medium text-slate-200">Application Layer</span>
                {expandedLayers.application ? (
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                )}
              </button>
              {expandedLayers.application && (
                <div className="mt-2 space-y-1 pl-2">
                  {ARCHIMATE_SHAPES.application.map((shape) => (
                    <button
                      key={shape.type}
                      onClick={() => handleAddShape(shape.type)}
                      className="w-full text-left py-2 px-3 rounded text-sm text-slate-300 hover:bg-slate-800 transition-colors flex items-center gap-2"
                      data-testid={`shape-${shape.type}`}
                    >
                      <div
                        className="w-4 h-4 rounded border border-black"
                        style={{ backgroundColor: shape.color }}
                      />
                      {shape.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Technology Layer */}
            <div>
              <button
                onClick={() => toggleLayer('technology')}
                className="w-full flex items-center justify-between text-left py-2 px-2 rounded hover:bg-slate-800 transition-colors"
                data-testid="toggle-technology-layer"
              >
                <span className="text-sm font-medium text-slate-200">Technology Layer</span>
                {expandedLayers.technology ? (
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                )}
              </button>
              {expandedLayers.technology && (
                <div className="mt-2 space-y-1 pl-2">
                  {ARCHIMATE_SHAPES.technology.map((shape) => (
                    <button
                      key={shape.type}
                      onClick={() => handleAddShape(shape.type)}
                      className="w-full text-left py-2 px-3 rounded text-sm text-slate-300 hover:bg-slate-800 transition-colors flex items-center gap-2"
                      data-testid={`shape-${shape.type}`}
                    >
                      <div
                        className="w-4 h-4 rounded border border-black"
                        style={{ backgroundColor: shape.color }}
                      />
                      {shape.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* tldraw Canvas with ArchiMate shapes */}
        <Tldraw
          onMount={handleMount}
          shapeUtils={archiMateShapeUtils}
        />
      </div>
    </div>
  );
}
