import { useState, useMemo } from "react";
import { PaletteSidebar } from "@/components/palette/palette-sidebar";
import { PaletteContent } from "@/components/palette/palette-content";
import { PropertiesPanel } from "@/components/palette/properties-panel";
import { archimateElements, ArchimateElement } from "@/data/archimate-elements";
import { GovernanceHeader } from "@/components/layout/governance-header";
import { AppLayout } from "@/components/layout/app-layout";
import { Palette } from "lucide-react";

export default function DesignPalette() {
  const [selectedCategory, setSelectedCategory] = useState('technology');
  const [selectedFramework, setSelectedFramework] = useState('aws');
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

  return (
    <AppLayout>
      <div className="h-full overflow-hidden flex flex-col" data-testid="design-palette-page">
        <GovernanceHeader 
          moduleTitle="Design Palette" 
          moduleIcon={Palette} 
        />
      
      <div className="flex flex-1 overflow-hidden">
        <PaletteSidebar
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedFramework={selectedFramework}
          onFrameworkChange={setSelectedFramework}
          recentElements={recentElements}
          onElementSelect={handleElementSelect}
        />
        
        <PaletteContent
          selectedCategory={selectedCategory}
          selectedFramework={selectedFramework}
          filteredElements={filteredElements}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onElementSelect={handleElementSelect}
          selectedElement={selectedElement}
        />
        
        <PropertiesPanel selectedElement={selectedElement} />
      </div>

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
          <span>Ready for drag & drop</span>
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        </div>
      </footer>
    </div>
    </AppLayout>
  );
}
