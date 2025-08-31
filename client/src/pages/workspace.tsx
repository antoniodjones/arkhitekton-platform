import React, { useState, useMemo } from 'react';
import { Workspace } from '@/components/workspace/workspace';
import { PaletteSidebar } from '@/components/palette/palette-sidebar';
import { PaletteContent } from '@/components/palette/palette-content';
import { PropertiesPanel } from '@/components/palette/properties-panel';
import { Separator } from '@/components/ui/separator';
import { ResizableSplitter } from '@/components/workspace/resizable-splitter';
import { RightResizableSplitter } from '@/components/workspace/right-resizable-splitter';
import { Button } from '@/components/ui/button';
import { PanelLeftOpen, PanelLeftClose, Home, Save, Users, Search } from 'lucide-react';
import { Link } from 'wouter';
import { archimateElements, ArchimateElement } from '@/data/archimate-elements';
import type { WorkspaceState } from '@/components/workspace/workspace';

export function WorkspacePage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [propertiesOpen, setPropertiesOpen] = useState(true);
  const [paletteWidth, setPaletteWidth] = useState(320); // Default palette width
  const [propertiesWidth, setPropertiesWidth] = useState(300); // Default properties width
  const [selectedCategory, setSelectedCategory] = useState<string>('business');
  const [selectedFramework, setSelectedFramework] = useState<string>('archimate');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedElement, setSelectedElement] = useState<ArchimateElement>();

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

  return (
    <div className="h-screen flex bg-background">
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
                onElementSelect={handleElementSelect}
                selectedElement={selectedElement}
              />
            </div>
          </div>
          <ResizableSplitter
            leftWidth={paletteWidth}
            onResize={setPaletteWidth}
            minWidth={250}
            maxWidth={600}
          />
        </>
      )}

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-14 border-b flex items-center justify-between px-4 bg-card">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              data-testid="button-toggle-sidebar"
            >
              {sidebarOpen ? (
                <PanelLeftClose className="h-4 w-4" />
              ) : (
                <PanelLeftOpen className="h-4 w-4" />
              )}
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center">
                <div className="w-3 h-3 bg-background rounded-sm" />
              </div>
              <h1 className="text-lg font-semibold">ArchModel Pro</h1>
            </div>
            <div className="h-4 w-px bg-border mx-2" />
            <Link href="/">
              <Button variant="ghost" size="sm" data-testid="button-dashboard">
                <Home className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" data-testid="button-save">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" size="sm" data-testid="button-share">
              <Users className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm" data-testid="button-search">
              <Search className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPropertiesOpen(!propertiesOpen)}
              data-testid="button-toggle-properties"
            >
              Properties
            </Button>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Draft Model</span>
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
              <RightResizableSplitter
                rightWidth={propertiesWidth}
                onResize={setPropertiesWidth}
                minWidth={250}
                maxWidth={500}
              />
              <div 
                className="border-l flex flex-col bg-card"
                style={{ width: propertiesWidth }}
              >
                <PropertiesPanel selectedElement={selectedElement} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}