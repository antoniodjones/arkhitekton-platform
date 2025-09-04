import React, { useState, useMemo } from 'react';
import { Workspace } from '@/components/workspace/workspace';
import { PaletteSidebar } from '@/components/palette/palette-sidebar';
import { PaletteContent } from '@/components/palette/palette-content';
import { PropertiesPanel } from '@/components/palette/properties-panel';
import { Separator } from '@/components/ui/separator';
import { ResizableSplitter } from '@/components/workspace/resizable-splitter';
import { Button } from '@/components/ui/button';
import { PanelLeftOpen, PanelLeftClose, Home, Save, Users, Search, Sparkles, Bot, AlertTriangle, ArrowLeft, Building, Settings } from 'lucide-react';
import { GovernanceHeader } from '@/components/layout/governance-header';
import { Link } from 'wouter';
import { archimateElements, ArchimateElement } from '@/data/archimate-elements';
import type { WorkspaceState } from '@/components/workspace/workspace';
import { AIAssistant } from '@/components/ai/ai-assistant';
import { ChangeDetectionPanel } from '@/components/workspace/change-detection-panel';
import { AppLayout } from '@/components/layout/app-layout';

function WorkspaceContent() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [propertiesOpen, setPropertiesOpen] = useState(true);
  const [paletteWidth, setPaletteWidth] = useState(320); // Default palette width
  const [rightPanelWidth, setRightPanelWidth] = useState(300); // Default properties width
  const [selectedCategory, setSelectedCategory] = useState<string>('business');
  const [selectedFramework, setSelectedFramework] = useState<string>('archimate');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedElement, setSelectedElement] = useState<ArchimateElement>();
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [aiAssistantMinimized, setAiAssistantMinimized] = useState(false);
  const [changeDetectionOpen, setChangeDetectionOpen] = useState(false);

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

  const handleSave = (state: WorkspaceState) => {
    console.log('Saving workspace state:', state);
    // Here we would save to backend or localStorage
    localStorage.setItem('workspace-state', JSON.stringify(state));
  };

  const handleLoad = (): WorkspaceState | null => {
    try {
      const saved = localStorage.getItem('workspace-state');
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Error loading workspace state:', error);
      return null;
    }
  };

  const handleCreateTicket = (change: any) => {
    // In a real app, this would create a ticket via API
    console.log('Creating ticket for change:', change);
    // Navigate to tickets page or open ticket creation modal
  };

  return (
    <div className="h-full overflow-hidden flex flex-col">
      <GovernanceHeader 
        moduleTitle="Architecture Workspace" 
        moduleIcon={Building} 
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
        <div className="flex-1 flex">
          {/* Workspace */}
          <div className="flex-1">
            <Workspace
              onSave={handleSave}
              onLoad={handleLoad}
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

      {/* AI Assistant */}
      {aiAssistantOpen && (
        <AIAssistant
          context={selectedElement ? `Analyzing ${selectedElement.name} (${selectedElement.type}) from ${selectedElement.framework}` : 'Architecture workspace'}
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
      </div>
    </div>
  );
}

export function WorkspacePage() {
  return (
    <AppLayout>
      <WorkspaceContent />
    </AppLayout>
  );
}