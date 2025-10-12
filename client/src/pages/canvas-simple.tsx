import { useState } from 'react';
import { GovernanceHeader } from '@/components/layout/governance-header';
import { ShapeToolbar } from '@/components/design-studio/shape-toolbar';
import { ShapePropertiesPanel } from '@/components/design-studio/shape-properties-panel';
import { Palette } from 'lucide-react';

export default function CanvasSimple() {
  const [selectedShape, setSelectedShape] = useState<string | null>(null);
  const [propertiesPanelOpen, setPropertiesPanelOpen] = useState(false);

  const handleShapeSelect = (shapeType: string) => {
    setSelectedShape(shapeType);
    setPropertiesPanelOpen(true);
  };

  const handlePropertiesClose = () => {
    setPropertiesPanelOpen(false);
    setSelectedShape(null);
  };

  return (
    <div className="h-full overflow-hidden flex flex-col">
      <GovernanceHeader 
        moduleTitle="Design Studio - Canvas" 
        moduleIcon={Palette} 
      />

      <div className="flex-1 relative bg-slate-50 dark:bg-slate-950">
        {/* Grid Background */}
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        
        {/* Canvas Area */}
        <div className="relative h-full w-full flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-950 dark:to-amber-950">
              <Palette className="h-10 w-10 text-orange-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Select a shape to begin</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Click the shapes icon on the left toolbar to choose from basic shapes,
                flowcharts, AWS, Azure, and ArchiMate elements
              </p>
            </div>
          </div>
        </div>

        {/* Left Toolbar */}
        <ShapeToolbar onShapeSelect={handleShapeSelect} />

        {/* Right Properties Panel */}
        {propertiesPanelOpen && (
          <ShapePropertiesPanel
            selectedShape={selectedShape}
            onClose={handlePropertiesClose}
            onShapeSelect={handleShapeSelect}
          />
        )}
      </div>

      {/* Grid Pattern CSS */}
      <style>{`
        .bg-grid-pattern {
          background-image: 
            linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px);
          background-size: 24px 24px;
        }
        
        .dark .bg-grid-pattern {
          background-image: 
            linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px);
        }
      `}</style>
    </div>
  );
}
