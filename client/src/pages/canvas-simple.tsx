import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Tldraw, Editor } from 'tldraw';
import 'tldraw/tldraw.css';
import { GovernanceHeader } from '@/components/layout/governance-header';
import { Button } from '@/components/ui/button';
import { Palette, ArrowLeft, Download, Save, Undo2, Redo2 } from 'lucide-react';
import { archiMateShapeUtils } from '@/lib/archimate-shapes';
import { useToast } from '@/hooks/use-toast';

export default function CanvasSimple() {
  const [, setLocation] = useLocation();
  const [editor, setEditor] = useState<Editor | null>(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
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
        {/* tldraw Canvas with ArchiMate shapes */}
        <Tldraw
          onMount={handleMount}
          shapeUtils={archiMateShapeUtils}
        />
      </div>
    </div>
  );
}
