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
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import * as Icons from 'lucide-react';
import { 
  Palette, 
  PanelLeftOpen, 
  PanelLeftClose, 
  Save, 
  Users, 
  Search, 
  Sparkles, 
  Bot,
  ClipboardList,
  Pencil
} from 'lucide-react';

function StudioContent() {
  // View state
  const [activeView, setActiveView] = useState<'canvas' | 'audit'>('canvas');
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
  
  // Audit view state
  const [auditSearchQuery, setAuditSearchQuery] = useState('');
  
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

  // Filter elements for audit view
  const auditFilteredElements = useMemo(() => {
    return archimateElements.filter(element => {
      const matchesSearch = auditSearchQuery === '' || 
        element.name.toLowerCase().includes(auditSearchQuery.toLowerCase()) ||
        element.description.toLowerCase().includes(auditSearchQuery.toLowerCase()) ||
        element.usageGuidelines.toLowerCase().includes(auditSearchQuery.toLowerCase()) ||
        element.category.toLowerCase().includes(auditSearchQuery.toLowerCase()) ||
        element.framework.toLowerCase().includes(auditSearchQuery.toLowerCase()) ||
        element.type.toLowerCase().includes(auditSearchQuery.toLowerCase());
      
      return matchesSearch;
    });
  }, [auditSearchQuery]);

  // Helper to render shape icon
  const renderShapeIcon = (element: ArchimateElement) => {
    const iconProps = {
      className: "h-6 w-6",
      style: { color: element.color }
    };
    
    const IconComponent = (Icons as any)[element.iconName] || Palette;
    
    return <IconComponent {...iconProps} />;
  };

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

      {/* Sub-navigation Tabs */}
      <div className="border-b bg-background px-6">
        <Tabs value={activeView} onValueChange={(v) => setActiveView(v as 'canvas' | 'audit')} className="w-full">
          <TabsList className="bg-transparent border-b-0 h-12">
            <TabsTrigger 
              value="canvas" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-orange-500 rounded-none"
              data-testid="tab-canvas"
            >
              <Pencil className="h-4 w-4 mr-2" />
              Design Canvas
            </TabsTrigger>
            <TabsTrigger 
              value="audit" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-orange-500 rounded-none"
              data-testid="tab-audit"
            >
              <ClipboardList className="h-4 w-4 mr-2" />
              Object Audit
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex-1 overflow-auto flex">
        {/* Canvas View */}
        {activeView === 'canvas' && (
          <>
            {/* Palette Sidebar with Resizable Splitter */}
            {sidebarOpen && (
              <>
                <div 
                  className="border-r flex flex-col overflow-hidden"
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
                  <div className="flex-1 overflow-auto">
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
          <div className="flex-1 flex overflow-auto">
            {/* Modeling Canvas */}
            <div className="flex-1 overflow-auto">
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
                  className="border-l flex flex-col bg-card overflow-auto"
                  style={{ width: rightPanelWidth }}
                >
                  <PropertiesPanel selectedElement={selectedElement} />
                </div>
              </>
            )}
          </div>
        </div>
          </>
        )}

        {/* Object Audit View */}
        {activeView === 'audit' && (
          <div className="flex-1 flex flex-col p-6 overflow-auto">
            {/* Search and Filter Bar */}
            <div className="mb-6 flex items-center gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search shapes and objects by name, category, framework, purpose..."
                  value={auditSearchQuery}
                  onChange={(e) => setAuditSearchQuery(e.target.value)}
                  className="max-w-2xl"
                  data-testid="input-audit-search"
                />
              </div>
              <div className="text-sm text-muted-foreground">
                {auditFilteredElements.length} of {archimateElements.length} objects
              </div>
            </div>

            {/* Audit Table */}
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">Visual</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="w-80">Purpose & Usage</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Framework</TableHead>
                    <TableHead>Pattern</TableHead>
                    <TableHead>Shape</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditFilteredElements.map((element) => (
                    <TableRow key={element.id} data-testid={`row-object-${element.id}`}>
                      <TableCell>
                        <div className="flex items-center justify-center p-2 rounded" style={{ backgroundColor: `${element.color}20` }}>
                          {renderShapeIcon(element)}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{element.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        <div className="line-clamp-2">{element.usageGuidelines}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{element.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{element.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge>{element.framework}</Badge>
                      </TableCell>
                      <TableCell className="text-xs">
                        <div className="max-w-32 truncate" title={element.relationships.join(', ')}>
                          {element.relationships.slice(0, 2).join(', ')}
                          {element.relationships.length > 2 && '...'}
                        </div>
                      </TableCell>
                      <TableCell className="capitalize text-sm">{element.shape}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
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
