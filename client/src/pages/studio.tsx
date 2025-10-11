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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [frameworkFilter, setFrameworkFilter] = useState<string>('all');
  const [shapeFilter, setShapeFilter] = useState<string>('all');
  const [vendorFilter, setVendorFilter] = useState<string>('all');
  
  // Column widths for resizable table
  const [columnWidths, setColumnWidths] = useState({
    visual: 100,
    name: 200,
    purpose: 400,
    category: 150,
    type: 150,
    framework: 150,
    vendor: 150,
    pattern: 250,
    shape: 150
  });
  
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

  // Get unique values for filters
  const uniqueCategories = useMemo(() => {
    return Array.from(new Set(archimateElements.map(e => e.category))).sort();
  }, []);

  const uniqueTypes = useMemo(() => {
    return Array.from(new Set(archimateElements.map(e => e.type))).sort();
  }, []);

  const uniqueFrameworks = useMemo(() => {
    return Array.from(new Set(archimateElements.map(e => e.framework))).sort();
  }, []);

  const uniqueShapes = useMemo(() => {
    return Array.from(new Set(archimateElements.map(e => e.shape))).sort();
  }, []);

  const uniqueVendors = useMemo(() => {
    return Array.from(new Set(archimateElements.map(e => e.vendor).filter(Boolean))).sort();
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
        element.type.toLowerCase().includes(auditSearchQuery.toLowerCase()) ||
        (element.vendor && element.vendor.toLowerCase().includes(auditSearchQuery.toLowerCase()));
      
      const matchesCategory = categoryFilter === 'all' || element.category === categoryFilter;
      const matchesType = typeFilter === 'all' || element.type === typeFilter;
      const matchesFramework = frameworkFilter === 'all' || element.framework === frameworkFilter;
      const matchesShape = shapeFilter === 'all' || element.shape === shapeFilter;
      const matchesVendor = vendorFilter === 'all' || element.vendor === vendorFilter;
      
      return matchesSearch && matchesCategory && matchesType && matchesFramework && matchesShape && matchesVendor;
    });
  }, [auditSearchQuery, categoryFilter, typeFilter, frameworkFilter, shapeFilter, vendorFilter]);

  // Helper to render shape icon
  const renderShapeIcon = (element: ArchimateElement) => {
    const iconProps = {
      className: "h-6 w-6",
      style: { 
        color: element.color,
        filter: 'none',
        transform: 'none'
      }
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

  // Column resize handler
  const handleColumnResize = (column: keyof typeof columnWidths, delta: number) => {
    setColumnWidths(prev => ({
      ...prev,
      [column]: Math.max(80, prev[column] + delta)
    }));
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
            <div className="border rounded-lg overflow-x-auto overflow-y-auto max-h-[calc(100vh-320px)] relative">
              <Table>
                <TableHeader className="sticky top-0 bg-background z-20 border-b shadow-sm">
                  <TableRow className="bg-background">
                    <TableHead className="bg-background" style={{ width: `${columnWidths.visual}px`, minWidth: `${columnWidths.visual}px` }}>
                      <div className="flex items-center justify-between">
                        <span>Visual</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0"
                          onClick={() => setColumnWidths(prev => ({ ...prev, visual: prev.visual + 50 }))}
                          data-testid="expand-visual"
                        >
                          +
                        </Button>
                      </div>
                    </TableHead>
                    <TableHead className="bg-background" style={{ width: `${columnWidths.name}px`, minWidth: `${columnWidths.name}px` }}>
                      <div className="flex items-center justify-between">
                        <span>Name</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0"
                          onClick={() => setColumnWidths(prev => ({ ...prev, name: prev.name + 50 }))}
                          data-testid="expand-name"
                        >
                          +
                        </Button>
                      </div>
                    </TableHead>
                    <TableHead className="bg-background" style={{ width: `${columnWidths.purpose}px`, minWidth: `${columnWidths.purpose}px` }}>
                      <div className="flex items-center justify-between">
                        <span>Purpose & Usage</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0"
                          onClick={() => setColumnWidths(prev => ({ ...prev, purpose: prev.purpose + 100 }))}
                          data-testid="expand-purpose"
                        >
                          +
                        </Button>
                      </div>
                    </TableHead>
                    <TableHead className="bg-background" style={{ width: `${columnWidths.category}px`, minWidth: `${columnWidths.category}px` }}>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span>Category</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 w-6 p-0"
                            onClick={() => setColumnWidths(prev => ({ ...prev, category: prev.category + 50 }))}
                            data-testid="expand-category"
                          >
                            +
                          </Button>
                        </div>
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                          <SelectTrigger className="h-8 text-xs" data-testid="filter-category">
                            <SelectValue placeholder="All" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {uniqueCategories.map(cat => (
                              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </TableHead>
                    <TableHead className="bg-background" style={{ width: `${columnWidths.type}px`, minWidth: `${columnWidths.type}px` }}>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span>Type</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 w-6 p-0"
                            onClick={() => setColumnWidths(prev => ({ ...prev, type: prev.type + 50 }))}
                            data-testid="expand-type"
                          >
                            +
                          </Button>
                        </div>
                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                          <SelectTrigger className="h-8 text-xs" data-testid="filter-type">
                            <SelectValue placeholder="All" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            {uniqueTypes.map(type => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </TableHead>
                    <TableHead className="bg-background" style={{ width: `${columnWidths.framework}px`, minWidth: `${columnWidths.framework}px` }}>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span>Framework</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 w-6 p-0"
                            onClick={() => setColumnWidths(prev => ({ ...prev, framework: prev.framework + 50 }))}
                            data-testid="expand-framework"
                          >
                            +
                          </Button>
                        </div>
                        <Select value={frameworkFilter} onValueChange={setFrameworkFilter}>
                          <SelectTrigger className="h-8 text-xs" data-testid="filter-framework">
                            <SelectValue placeholder="All" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Frameworks</SelectItem>
                            {uniqueFrameworks.map(fw => (
                              <SelectItem key={fw} value={fw}>{fw}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </TableHead>
                    <TableHead className="bg-background" style={{ width: `${columnWidths.vendor}px`, minWidth: `${columnWidths.vendor}px` }}>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span>Vendor</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 w-6 p-0"
                            onClick={() => setColumnWidths(prev => ({ ...prev, vendor: prev.vendor + 50 }))}
                            data-testid="expand-vendor"
                          >
                            +
                          </Button>
                        </div>
                        <Select value={vendorFilter} onValueChange={setVendorFilter}>
                          <SelectTrigger className="h-8 text-xs" data-testid="filter-vendor">
                            <SelectValue placeholder="All" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Vendors</SelectItem>
                            {uniqueVendors.map(vendor => (
                              <SelectItem key={vendor} value={vendor!}>{vendor}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </TableHead>
                    <TableHead className="bg-background" style={{ width: `${columnWidths.pattern}px`, minWidth: `${columnWidths.pattern}px` }}>
                      <div className="flex items-center justify-between">
                        <span>Pattern</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0"
                          onClick={() => setColumnWidths(prev => ({ ...prev, pattern: prev.pattern + 50 }))}
                          data-testid="expand-pattern"
                        >
                          +
                        </Button>
                      </div>
                    </TableHead>
                    <TableHead className="bg-background" style={{ width: `${columnWidths.shape}px`, minWidth: `${columnWidths.shape}px` }}>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span>Shape</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 w-6 p-0"
                            onClick={() => setColumnWidths(prev => ({ ...prev, shape: prev.shape + 50 }))}
                            data-testid="expand-shape"
                          >
                            +
                          </Button>
                        </div>
                        <Select value={shapeFilter} onValueChange={setShapeFilter}>
                          <SelectTrigger className="h-8 text-xs" data-testid="filter-shape">
                            <SelectValue placeholder="All" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Shapes</SelectItem>
                            {uniqueShapes.map(shape => (
                              <SelectItem key={shape} value={shape}>{shape}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditFilteredElements.map((element) => (
                    <TableRow key={element.id} data-testid={`row-object-${element.id}`}>
                      <TableCell style={{ width: `${columnWidths.visual}px`, minWidth: `${columnWidths.visual}px` }}>
                        <div 
                          className="flex items-center justify-center p-2 rounded" 
                          style={{ 
                            background: `linear-gradient(135deg, ${element.color}40 0%, ${element.color}20 50%, ${element.color}60 100%)`,
                            boxShadow: `
                              inset -2px -2px 4px rgba(0, 0, 0, 0.2),
                              inset 2px 2px 4px rgba(255, 255, 255, 0.3),
                              4px 4px 8px rgba(0, 0, 0, 0.15),
                              -2px -2px 6px rgba(255, 255, 255, 0.1)
                            `,
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            transform: 'perspective(100px) rotateX(5deg) rotateY(-5deg)',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          {renderShapeIcon(element)}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium" style={{ width: `${columnWidths.name}px`, minWidth: `${columnWidths.name}px` }}>{element.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground" style={{ width: `${columnWidths.purpose}px`, minWidth: `${columnWidths.purpose}px` }}>
                        <div>{element.usageGuidelines}</div>
                      </TableCell>
                      <TableCell style={{ width: `${columnWidths.category}px`, minWidth: `${columnWidths.category}px` }}>
                        <Badge variant="outline">{element.category}</Badge>
                      </TableCell>
                      <TableCell style={{ width: `${columnWidths.type}px`, minWidth: `${columnWidths.type}px` }}>
                        <Badge variant="secondary">{element.type}</Badge>
                      </TableCell>
                      <TableCell style={{ width: `${columnWidths.framework}px`, minWidth: `${columnWidths.framework}px` }}>
                        <Badge>{element.framework}</Badge>
                      </TableCell>
                      <TableCell style={{ width: `${columnWidths.vendor}px`, minWidth: `${columnWidths.vendor}px` }}>
                        <Badge variant="outline">{element.vendor || 'N/A'}</Badge>
                      </TableCell>
                      <TableCell className="text-xs" style={{ width: `${columnWidths.pattern}px`, minWidth: `${columnWidths.pattern}px` }}>
                        <div title={element.relationships.join(', ')}>
                          {element.relationships.slice(0, 2).join(', ')}
                          {element.relationships.length > 2 && '...'}
                        </div>
                      </TableCell>
                      <TableCell className="capitalize text-sm" style={{ width: `${columnWidths.shape}px`, minWidth: `${columnWidths.shape}px` }}>{element.shape}</TableCell>
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
