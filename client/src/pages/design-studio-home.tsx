import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { AppLayout } from '@/components/layout/app-layout';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Plus, 
  Grid, 
  List, 
  Filter, 
  SortAsc,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

import { AISparkleIcon } from '@/components/ui/ai-sparkle-icon';
import { CommandBar } from '@/components/design-studio/command-bar';
import { ModelCard, type ModelData } from '@/components/design-studio/model-card';
import { Footer } from '@/components/design-studio/footer';
import { getRecencyCategory } from '@/lib/recency-utils';

/**
 * Design Studio Home Page
 * Implements EPIC-DSH-01: Home Page Shell & Navigation
 * 
 * Features:
 * - Hero section with search bar and AI integration
 * - Model/diagram cards with grid/list view toggle
 * - Command bar with CMD+K shortcut
 * - Recency indicators and filtering
 * - Quick actions (new model, new diagram)
 */

// Mock data - replace with API call
const MOCK_MODELS: ModelData[] = [
  { 
    id: '1', 
    title: 'Payer Platform Architecture', 
    updatedAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(), // 2 mins ago
    author: 'Antonio Jones', 
    type: 'System',
    isPinned: true
  },
  { 
    id: '2', 
    title: 'Claims Processing Flow', 
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    author: 'Sarah Chen', 
    type: 'Process' 
  },
  { 
    id: '3', 
    title: 'Identity Management', 
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    author: 'Mike Ross', 
    type: 'Security' 
  },
  { 
    id: '4', 
    title: 'AWS Infrastructure', 
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    author: 'Antonio Jones', 
    type: 'Infra' 
  },
  { 
    id: '5', 
    title: 'Member Portal UX', 
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
    author: 'Jessica Pearson', 
    type: 'Product' 
  },
  { 
    id: '6', 
    title: 'Legacy System Migration', 
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 1 week ago
    author: 'Harvey Specter', 
    type: 'Strategy' 
  },
  { 
    id: '7', 
    title: 'Data Pipeline Architecture', 
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(), // 2 weeks ago
    author: 'Louis Litt', 
    type: 'Data' 
  },
  { 
    id: '8', 
    title: 'API Gateway Design', 
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString(), // 45 days ago
    author: 'Donna Paulsen', 
    type: 'System' 
  },
];

type SortOption = 'recent' | 'alphabetical' | 'type';
type FilterOption = 'all' | 'pinned' | '24h' | '7d' | '30d';

export default function DesignStudioHome() {
  const [, setLocation] = useLocation();
  
  // UI State
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [commandBarOpen, setCommandBarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [activeTab, setActiveTab] = useState<'all' | 'models' | 'diagrams'>('all');

  // Model state
  const [models, setModels] = useState<ModelData[]>(MOCK_MODELS);

  // CMD+K / Ctrl+K handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandBarOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Navigation handlers
  const handleNewModel = useCallback(() => {
    setLocation('/studio/canvas?new=true&type=model');
  }, [setLocation]);

  const handleNewDiagram = useCallback(() => {
    setLocation('/studio/canvas?new=true&type=diagram');
  }, [setLocation]);

  const handleModelClick = useCallback((model: ModelData) => {
    setLocation(`/studio/canvas?id=${model.id}`);
  }, [setLocation]);

  const handleModelSelect = useCallback((model: { id: string | number }) => {
    setLocation(`/studio/canvas?id=${model.id}`);
  }, [setLocation]);

  // Action handlers
  const handlePin = useCallback((model: ModelData) => {
    setModels(prev => prev.map(m => 
      m.id === model.id ? { ...m, isPinned: !m.isPinned } : m
    ));
  }, []);

  const handleDuplicate = useCallback((model: ModelData) => {
    const newModel: ModelData = {
      ...model,
      id: `${model.id}-copy-${Date.now()}`,
      title: `${model.title} (Copy)`,
      updatedAt: new Date().toISOString(),
    };
    setModels(prev => [newModel, ...prev]);
  }, []);

  const handleDelete = useCallback((model: ModelData) => {
    if (confirm(`Are you sure you want to delete "${model.title}"?`)) {
      setModels(prev => prev.filter(m => m.id !== model.id));
    }
  }, []);

  const handleOpenInNewTab = useCallback((model: ModelData) => {
    window.open(`/studio/canvas?id=${model.id}`, '_blank');
  }, []);

  const handleRename = useCallback((model: ModelData) => {
    const newTitle = prompt('Enter new name:', model.title);
    if (newTitle && newTitle !== model.title) {
      setModels(prev => prev.map(m => 
        m.id === model.id ? { ...m, title: newTitle } : m
      ));
    }
  }, []);

  const handleAIQuery = useCallback((query: string) => {
    console.log('AI Query:', query);
    // TODO: Implement AI integration
  }, []);

  // Filter and sort models
  const filteredModels = models
    .filter(model => {
      // Search filter
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!model.title.toLowerCase().includes(q) && 
            !model.author.toLowerCase().includes(q) &&
            !model.type.toLowerCase().includes(q)) {
          return false;
        }
      }
      // Tab filter
      if (activeTab !== 'all') {
        // For now, treat all as diagrams since we don't have type distinction
        // This would be model.category === activeTab in real implementation
      }
      // Recency/pinned filter
      if (filterBy === 'pinned') return model.isPinned;
      if (filterBy === '24h') return getRecencyCategory(model.updatedAt) === '24h';
      if (filterBy === '7d') return ['24h', '7d'].includes(getRecencyCategory(model.updatedAt));
      if (filterBy === '30d') return ['24h', '7d', '30d'].includes(getRecencyCategory(model.updatedAt));
      return true;
    })
    .sort((a, b) => {
      // Pinned items always first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      
      // Then apply sort
      switch (sortBy) {
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        case 'type':
          return a.type.localeCompare(b.type);
        case 'recent':
        default:
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
    });

  const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;

  return (
    <AppLayout>
      <div className="flex flex-col h-full bg-[#f9f9fa] text-slate-900 font-sans">
      {/* Hero Header */}
      <header className="bg-white border-b pb-8 pt-6 px-8 sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto w-full">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
              <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-lg shadow-lg shadow-indigo-200" />
              Arkhitekton
            </div>
            <div className="flex items-center gap-4">
              {/* Quick Create Buttons */}
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={handleNewModel}
              >
                <Plus className="w-4 h-4" />
                New Model
              </Button>
              <Button
                size="sm"
                className="gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                onClick={handleNewDiagram}
              >
                <Plus className="w-4 h-4" />
                New Diagram
              </Button>
              <Avatar className="w-9 h-9 border-2 border-white shadow-sm ring-1 ring-slate-100 cursor-pointer">
                <AvatarFallback className="bg-gradient-to-br from-orange-400 to-orange-600 text-white">
                  AJ
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* Hero Section */}
          <div className="flex flex-col items-center justify-center py-8">
            <h1 className="text-4xl font-semibold mb-6 tracking-tight text-slate-800">
              What are you building today?
            </h1>
            
            {/* Search Bar */}
            <div 
              className="relative w-full max-w-2xl group cursor-text"
              onClick={() => setCommandBarOpen(true)}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-green-400/20 to-blue-400/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-white shadow-xl shadow-slate-200/60 rounded-full h-14 flex items-center px-6 border border-slate-100 ring-1 ring-slate-50 transition-shadow group-hover:shadow-2xl group-hover:shadow-orange-100/40">
                <Search className="w-5 h-5 text-slate-400 mr-4" />
                <span className="flex-1 text-lg text-slate-400">
                  Search diagrams, objects, or type <span className="text-orange-500 font-medium">/</span> for AI...
                </span>
                <div className="flex items-center gap-2 pl-4 border-l border-slate-200">
                  <AISparkleIcon size={18} state="idle" className="opacity-60" />
                  <kbd className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded">
                    {isMac ? '⌘K' : 'Ctrl+K'}
                  </kbd>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-8 py-8">
        <div className="max-w-6xl mx-auto w-full">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6 gap-4">
            {/* Left: Tabs */}
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
              <TabsList className="bg-white border shadow-sm">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="models">Models</TabsTrigger>
                <TabsTrigger value="diagrams">Diagrams</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Right: View Controls */}
            <div className="flex items-center gap-3">
              {/* Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Filter className="w-4 h-4" />
                    {filterBy === 'all' ? 'All' : 
                     filterBy === 'pinned' ? 'Pinned' :
                     filterBy === '24h' ? 'Today' :
                     filterBy === '7d' ? 'This Week' : 'This Month'}
                    <ChevronDown className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setFilterBy('all')}>All</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterBy('pinned')}>Pinned</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterBy('24h')}>Updated Today</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterBy('7d')}>This Week</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterBy('30d')}>This Month</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Sort */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <SortAsc className="w-4 h-4" />
                    {sortBy === 'recent' ? 'Recent' : 
                     sortBy === 'alphabetical' ? 'A-Z' : 'Type'}
                    <ChevronDown className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setSortBy('recent')}>Most Recent</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('alphabetical')}>Alphabetical</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('type')}>By Type</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* View Toggle */}
              <div className="flex bg-white p-1 rounded-lg border shadow-sm">
                <button
                  className={cn(
                    'p-1.5 rounded cursor-pointer transition-colors',
                    viewMode === 'grid' 
                      ? 'bg-slate-100 text-slate-700 shadow-sm' 
                      : 'text-slate-400 hover:text-slate-600'
                  )}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  className={cn(
                    'p-1.5 ml-1 rounded cursor-pointer transition-colors',
                    viewMode === 'list' 
                      ? 'bg-slate-100 text-slate-700 shadow-sm' 
                      : 'text-slate-400 hover:text-slate-600'
                  )}
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Content Grid/List */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Create New Card */}
              <div
                className="aspect-[16/10] rounded-2xl border-2 border-dashed border-slate-200 hover:border-orange-400 hover:bg-orange-50/30 transition-all cursor-pointer flex flex-col items-center justify-center group shadow-sm hover:shadow-md"
                onClick={handleNewDiagram}
              >
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Plus className="w-8 h-8 text-orange-500" />
                </div>
                <span className="font-medium text-slate-600 group-hover:text-orange-600">
                  Create new diagram
                </span>
              </div>

              {/* Model Cards */}
              {filteredModels.map((model) => (
                <ModelCard
                  key={model.id}
                  model={model}
                  view="grid"
                  onClick={handleModelClick}
                  onPin={handlePin}
                  onDuplicate={handleDuplicate}
                  onDelete={handleDelete}
                  onOpenInNewTab={handleOpenInNewTab}
                  onRename={handleRename}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredModels.map((model) => (
                <ModelCard
                  key={model.id}
                  model={model}
                  view="list"
                  onClick={handleModelClick}
                  onPin={handlePin}
                  onDuplicate={handleDuplicate}
                  onDelete={handleDelete}
                  onOpenInNewTab={handleOpenInNewTab}
                  onRename={handleRename}
                />
              ))}

              {filteredModels.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Search className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-700 mb-2">No models found</h3>
                  <p className="text-slate-500 mb-4">
                    {filterBy !== 'all' 
                      ? 'Try adjusting your filters' 
                      : 'Create your first model to get started'}
                  </p>
                  <Button onClick={handleNewModel} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Create Model
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Command Bar */}
      <CommandBar
        open={commandBarOpen}
        onOpenChange={setCommandBarOpen}
        recentModels={models.slice(0, 5)}
        onSelectModel={handleModelSelect}
        onAIQuery={handleAIQuery}
      />
      </div>
    </AppLayout>
  );
}
