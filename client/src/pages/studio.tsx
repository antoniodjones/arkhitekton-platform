import React, { useState, useMemo } from 'react';
import { ModelingWorkspace } from '@/components/modeling/modeling-workspace';
import { PaletteSidebar } from '@/components/palette/palette-sidebar';
import { PaletteContent } from '@/components/palette/palette-content';
import { PropertiesPanel } from '@/components/palette/properties-panel';
import { ResizableSplitter } from '@/components/workspace/resizable-splitter';
import { AIAssistant } from '@/components/ai/ai-assistant';
import { ChangeDetectionPanel } from '@/components/workspace/change-detection-panel';
import { ArchitecturalModel } from '@shared/schema';
import { archimateElements, ArchimateElement } from '@/data/archimate-elements';
import { AppLayout } from '@/components/layout/app-layout';
import { GovernanceHeader } from '@/components/layout/governance-header';
import { Button } from '@/components/ui/button';
import { 
  Palette, 
  PanelLeftOpen, 
  PanelLeftClose, 
  Save, 
  Users, 
  Search, 
  Sparkles, 
  Bot 
} from 'lucide-react';

function StudioContent() {
  // Panel state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [propertiesOpen, setPropertiesOpen] = useState(true);
  const [paletteWidth, setPaletteWidth] = useState(320);
  const [rightPanelWidth, setRightPanelWidth] = useState(300);
  
  // Palette state
  const [selectedCategory, setSelectedCategory] = useState<string>('business');
  const [selectedFramework, setSelectedFramework] = useState<string>('archimate');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedElement, setSelectedElement] = useState<ArchimateElement>();
  
  // AI and change detection state
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [aiAssistantMinimized, setAiAssistantMinimized] = useState(false);
  const [changeDetectionOpen, setChangeDetectionOpen] = useState(false);

  // Mock model data for development
  const mockModel: ArchitecturalModel = {
    id: 'model-1',
    name: 'E-commerce Platform Architecture',
    description: 'Core architecture for our e-commerce platform including payment processing, user management, and inventory systems',
    domain: 'software',
    type: 'system',
    version: '2.1.0',
    state: 'master',
    parentModelId: null,
    ownerId: 'user-1',
    stakeholders: ['user-1', 'user-2'],
    canvasData: {
      objects: [],
      connections: [],
      viewport: { x: 0, y: 0, zoom: 1 },
      layouts: []
    },
    documentationPages: [],
    metrics: {
      complexity: 'medium',
      maintainability: 85,
      testCoverage: 78
    },
    externalRefs: {
      confluence: ['ARCH-123', 'ARCH-124'],
      custom: {}
    },
    status: 'active',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date()
  };

  // Filter elements based on category, framework, and search query
  const filteredElements = useMemo(() => {
    return archimateElements.filter(element => {
      const matchesCategory = element.category === selectedCategory;
      const matchesFramework = element.framework === selectedFramework;
      const matchesSearch = searchQuery === '' || 
        element.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        element.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        element.type.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesCategory && matchesFramework && matchesSearch;
    });
  }, [selectedCategory, selectedFramework, searchQuery]);

  // Get recent elements (mock data for now)
  const recentElements = useMemo(() => {
    return archimateElements.slice(0, 4);
  }, []);

  const handleElementSelect = (element: ArchimateElement) => {
    setSelectedElement(element);
  };

  const handleModelSave = (model: ArchitecturalModel) => {
    console.log('Saving model:', model);
    // TODO: Implement actual save functionality with API call
    localStorage.setItem('design-studio-model', JSON.stringify(model));
  };

  const handleModelUpdate = (updates: Partial<ArchitecturalModel>) => {
    console.log('Updating model:', updates);
    // TODO: Implement actual update functionality with API call
  };

  const handleCreateTicket = (change: any) => {
    console.log('Creating ticket for change:', change);
    // TODO: Navigate to tickets page or open ticket creation modal
  };

  return (
    <div className="h-full overflow-hidden flex flex-col">
      <GovernanceHeader 
        moduleTitle="Design Studio" 
        moduleIcon={Palette} 
      />

      <div className="flex-1 overflow-hidden flex">
        {/* Palette Sidebar with Resizable Splitter */}
        {sidebarOpen && (
          <>
            <div 
              className="border-r flex flex-col"
              style={{ width: paletteWidth }}
            >
              <PaletteSidebar
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                selectedFramework={selectedFramework}
                onFrameworkChange={setSelectedFramework}
                recentElements={recentElements}
                onElementSelect={handleElementSelect}
              />
              <div className="flex-1">
                <PaletteContent
                  selectedCategory={selectedCategory}
                  selectedFramework={selectedFramework}
                  filteredElements={filteredElements}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  onElementSelect={handleElementSelect}
                  selectedElement={selectedElement}
                />
              </div>
            </div>
            <ResizableSplitter
              width={paletteWidth}
              onResize={setPaletteWidth}
              minWidth={250}
              maxWidth={600}
            />
          </>
        )}

        {/* Main Workspace Area */}
        <div className="flex-1 flex flex-col">
          {/* Workspace Actions Bar */}
          <div className="h-12 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                data-testid="button-toggle-sidebar"
              >
                {sidebarOpen ? (
                  <PanelLeftClose className="h-4 w-4" />
                ) : (
                  <PanelLeftOpen className="h-4 w-4" />
                )}
              </Button>
              <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
              <Button 
                size="sm" 
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-0 shadow-lg shadow-orange-500/25"
                data-testid="button-save"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Model
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-slate-200 dark:border-slate-700 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                data-testid="button-share"
              >
                <Users className="h-4 w-4 mr-2" />
                Collaborate
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                data-testid="button-search"
              >
                <Search className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  setAiAssistantOpen(true);
                  setAiAssistantMinimized(false);
                }}
                className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                data-testid="button-ai-assistant"
              >
                <Sparkles className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setChangeDetectionOpen(true)}
                className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white relative"
                data-testid="button-change-detection"
              >
                <Bot className="h-4 w-4" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">2</span>
                </div>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPropertiesOpen(!propertiesOpen)}
                data-testid="button-toggle-properties"
              >
                Properties
              </Button>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Draft Model</span>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex overflow-hidden">
            {/* Modeling Canvas */}
            <div className="flex-1">
              <ModelingWorkspace
                model={mockModel}
                onModelSave={handleModelSave}
                onModelUpdate={handleModelUpdate}
              />
            </div>
            
            {/* Properties Panel with Resizable Splitter */}
            {propertiesOpen && (
              <>
                <ResizableSplitter
                  width={rightPanelWidth}
                  onResize={setRightPanelWidth}
                  direction="right"
                  minWidth={250}
                  maxWidth={500}
                />
                <div 
                  className="border-l flex flex-col bg-card"
                  style={{ width: rightPanelWidth }}
                >
                  <PropertiesPanel selectedElement={selectedElement} />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* AI Assistant */}
      {aiAssistantOpen && (
        <AIAssistant
          context={selectedElement ? `Analyzing ${selectedElement.name} (${selectedElement.type}) from ${selectedElement.framework}` : 'Design Studio'}
          elementType={selectedElement?.type}
          framework={selectedElement?.framework}
          isMinimized={aiAssistantMinimized}
          onMinimize={() => setAiAssistantMinimized(!aiAssistantMinimized)}
          onClose={() => {
            setAiAssistantOpen(false);
            setAiAssistantMinimized(false);
          }}
        />
      )}

      {/* Change Detection Panel */}
      <ChangeDetectionPanel
        isOpen={changeDetectionOpen}
        onClose={() => setChangeDetectionOpen(false)}
        onCreateTicket={handleCreateTicket}
      />

      {/* Status Bar */}
      <footer className="bg-card border-t border-border px-6 py-2 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center space-x-4">
          <span>ArchiMate 3.0 Compliant</span>
          <span>•</span>
          <span>TOGAF Framework Integrated</span>
          <span>•</span>
          <span data-testid="text-total-elements">{archimateElements.length} Elements Available</span>
        </div>
        <div className="flex items-center space-x-4">
          <span>Ready for design</span>
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        </div>
      </footer>
    </div>
  );
}

export default function StudioPage() {
  return (
    <AppLayout>
      <StudioContent />
    </AppLayout>
  );
}
