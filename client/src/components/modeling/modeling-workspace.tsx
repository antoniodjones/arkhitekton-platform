import React, { useState, useCallback } from 'react';
import { DesignCanvas } from '../canvas/DesignCanvas';
import {
  useArchitecturalObjects,
  useCreateArchitecturalObject,
  useUpdateArchitecturalObject,
  useUpdateArchitecturalObjectVisuals,
  useDeleteArchitecturalObject
} from '../canvas/hooks/useArchitecturalObjects';
import { ArchitecturalObjectPalette } from './architectural-object-palette';
import { PropertiesPanel } from './properties-panel';
import { ModelingToolbar } from './modeling-toolbar';
import { ResizableSplitter } from '../workspace/resizable-splitter';
import { AchievementTracker } from '../achievements/achievement-tracker';
import { AchievementCelebration } from '../achievements/achievement-celebration';
import { AIAssistant } from '../ai/ai-assistant';
import { ChangeDetectionPanel } from '../workspace/change-detection-panel';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  PanelLeftOpen,
  PanelLeftClose,
  PanelRightOpen,
  PanelRightClose,
  Save,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Grid,
  Eye,
  Trophy,
  Sparkles,
  Bot
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ArchitecturalModel, ArchitecturalObject, ObjectConnection } from '@shared/schema';

interface ModelingWorkspaceProps {
  model?: ArchitecturalModel;
  onModelSave?: (model: ArchitecturalModel) => void;
  onModelUpdate?: (updates: Partial<ArchitecturalModel>) => void;
  className?: string;
}

export function ModelingWorkspace({
  model,
  onModelSave,
  onModelUpdate,
  className
}: ModelingWorkspaceProps) {
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [leftPanelWidth, setLeftPanelWidth] = useState(320);
  const [rightPanelWidth, setRightPanelWidth] = useState(320);

  const [viewMode, setViewMode] = useState<'detailed' | 'overview' | 'executive' | 'presentation'>('detailed');
  const [selectedObjects, setSelectedObjects] = useState<string[]>([]);
  const [showGrid, setShowGrid] = useState(true);

  // Achievement system state
  const [celebrationVisible, setCelebrationVisible] = useState(false);
  const [celebrationAchievements, setCelebrationAchievements] = useState<any[]>([]);
  const [levelUpData, setLevelUpData] = useState<any>(null);
  const [showAchievementDashboard, setShowAchievementDashboard] = useState(false);

  // AI Assistant and Change Detection state
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [aiAssistantMinimized, setAiAssistantMinimized] = useState(false);
  const [changeDetectionOpen, setChangeDetectionOpen] = useState(false);
  const [changeLog, setChangeLog] = useState<Array<{
    id: string;
    type: 'created' | 'updated' | 'deleted' | 'connected' | 'disconnected';
    objectId?: string;
    objectName?: string;
    timestamp: Date;
    details: string;
  }>>([]);

  // Mock user achievement data for demo
  const mockUserLevel = 8;
  const mockUserExp = 1250;
  const mockNextLevelExp = 1600;
  const mockCurrentStreak = 12;

  const mockAchievementProgress = [
    {
      id: 'semantic-master',
      name: 'Semantic Master',
      currentProgress: 6.8,
      maxProgress: 7,
      category: 'quality' as const,
      pointsToEarn: 500,
      isClose: true
    },
    {
      id: 'connected-thinking',
      name: 'Connected Thinking',
      currentProgress: 1.9,
      maxProgress: 2,
      category: 'complexity' as const,
      pointsToEarn: 200,
      isClose: true
    },
    {
      id: 'pattern-virtuoso',
      name: 'Pattern Virtuoso',
      currentProgress: 6,
      maxProgress: 8,
      category: 'quality' as const,
      pointsToEarn: 600,
      isClose: false
    },
    {
      id: 'multi-domain-expert',
      name: 'Multi-Domain Expert',
      currentProgress: 7.5,
      maxProgress: 8,
      category: 'consistency' as const,
      pointsToEarn: 300,
      isClose: true
    }
  ];

  // Change logging function
  const logChange = useCallback((type: 'created' | 'updated' | 'deleted' | 'connected' | 'disconnected', objectId?: string, objectName?: string, details?: string) => {
    const newChange = {
      id: `change-${Date.now()}`,
      type,
      objectId,
      objectName,
      timestamp: new Date(),
      details: details || `Object ${objectId ? `${objectName || objectId}` : ''} was ${type}`
    };
    setChangeLog(prev => [newChange, ...prev.slice(0, 49)]); // Keep last 50 changes
  }, []);

  // API Hooks
  const { data: objects = [], isLoading: isLoadingObjects } = useArchitecturalObjects(model?.id || 'ecommerce-model');
  const createObjectMutation = useCreateArchitecturalObject();
  const updateObjectMutation = useUpdateArchitecturalObject();
  const updateVisualsMutation = useUpdateArchitecturalObjectVisuals();
  const deleteObjectMutation = useDeleteArchitecturalObject();

  // Removed mock objects initialization





  // Object management handlers
  const handleObjectCreate = useCallback((objectData: Partial<ArchitecturalObject>) => {
    // Use mutation
    createObjectMutation.mutate({
      modelId: model?.id || 'model-1',
      name: objectData.name || 'New Object',
      objectType: objectData.objectType || 'standard',
      domain: objectData.domain || 'software',
      category: objectData.category || 'component',
      visual: objectData.visual || {
        shape: 'rectangle',
        position: { x: 200, y: 200 },
        size: { width: 180, height: 80 },
        styling: { color: '#64748b', borderWidth: 2 },
        ports: [],
        annotations: []
      },
      semantics: objectData.semantics || {
        purpose: '',
        responsibilities: [],
        constraints: [],
        patterns: []
      },
      lifecycle: {
        state: 'planned',
        milestones: [],
        decisions: [],
        changes: []
      },
      metrics: {},
      implementation: {},
      metadata: {},
    });
    // logChange handled implicitly or we can do it in onSuccess
  }, [model?.id, createObjectMutation]);

  const handleObjectUpdate = useCallback((objectId: string, updates: Partial<ArchitecturalObject>) => {
    updateObjectMutation.mutate({ id: objectId, updates });
    logChange('updated', objectId, 'Object', `Updated object ${objectId}`);
  }, [updateObjectMutation, logChange]);

  const handleVisualChange = useCallback((id: string, newAttrs: { x: number; y: number }) => {
    const obj = objects.find(o => o.id === id);
    if (obj) {
      updateVisualsMutation.mutate({
        id,
        visual: {
          ...obj.visual,
          position: newAttrs
        }
      });
    }
  }, [objects, updateVisualsMutation]);

  const handleObjectDelete = useCallback((objectId: string) => {
    deleteObjectMutation.mutate(objectId);
    setSelectedObjects(prev => prev.filter(id => id !== objectId));
    logChange('deleted', objectId, 'Object', `Deleted object ${objectId}`);
  }, [deleteObjectMutation, logChange]);

  // Achievement celebration handler
  const triggerAchievementCelebration = useCallback(() => {
    // Simulate achieving the "Connected Thinking" achievement
    const mockAchievement = {
      id: 'connected-thinking',
      name: 'Connected Thinking',
      description: 'Create a model with high connection density (2+ connections per object)',
      category: 'complexity' as const,
      tier: 'silver' as const,
      iconName: 'network',
      color: '#c0c0c0',
      pointsEarned: 200,
      isNew: true
    };

    setCelebrationAchievements([mockAchievement]);
    setCelebrationVisible(true);
  }, []);

  const handleCelebrationDismiss = useCallback(() => {
    setCelebrationVisible(false);
    setCelebrationAchievements([]);
    setLevelUpData(null);
  }, []);

  const handleCreateTicket = (change: any) => {
    // In a real app, this would create a ticket via API
    console.log('Creating ticket for change:', change);
    // Navigate to tickets page or open ticket creation modal
  };




  // View mode switching
  const handleViewModeChange = useCallback((mode: typeof viewMode) => {
    setViewMode(mode);
  }, []);

  // Save functionality
  const handleSave = useCallback(() => {
    if (model && onModelSave) {
      const updatedModel: ArchitecturalModel = {
        ...model,
        canvasData: {
          objects: objects,
          connections: [],
          viewport: { x: 0, y: 0, zoom: 1 }, // This should come from canvas
          layouts: []
        },
        updatedAt: new Date()
      };
      onModelSave(updatedModel);
    }
  }, [model, objects, onModelSave]);

  return (
    <div className={cn("flex flex-col h-full bg-background", className)}>
      {/* Header toolbar */}
      <header className="bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white/90 rounded transform rotate-45" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">
                {model?.name || 'New Architecture Model'}
              </h1>
              <p className="text-xs text-muted-foreground">
                {model?.domain || 'software'} · {model?.type || 'system'}
              </p>
            </div>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* View mode selector */}
          <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
            {(['detailed', 'overview', 'executive', 'presentation'] as const).map((mode) => (
              <Button
                key={mode}
                variant={viewMode === mode ? "default" : "ghost"}
                size="sm"
                onClick={() => handleViewModeChange(mode)}
                className="text-xs capitalize"
                data-testid={`button-view-${mode}`}
              >
                {mode}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Achievement Tracker */}
          <AchievementTracker
            achievements={mockAchievementProgress}
            userLevel={mockUserLevel}
            userExp={mockUserExp}
            nextLevelExp={mockNextLevelExp}
            currentStreak={mockCurrentStreak}
            onViewDashboard={() => setShowAchievementDashboard(true)}
            className="mr-4"
          />

          <Separator orientation="vertical" className="h-6" />

          <Button variant="ghost" size="sm" title="Undo" data-testid="button-undo">
            <Undo className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" title="Redo" data-testid="button-redo">
            <Redo className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="h-6" />

          <Button
            variant="ghost"
            size="sm"
            title="AI Assistant"
            onClick={() => {
              setAiAssistantOpen(true);
              setAiAssistantMinimized(false);
            }}
            data-testid="button-ai-assistant"
          >
            <Sparkles className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            title="Change Detection"
            onClick={() => setChangeDetectionOpen(true)}
            className="relative"
            data-testid="button-change-detection"
          >
            <Bot className="h-4 w-4" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-bold">2</span>
            </div>
          </Button>

          <Separator orientation="vertical" className="h-6" />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowGrid(!showGrid)}
            title="Toggle Grid"
            data-testid="button-toggle-grid"
          >
            <Grid className={cn("h-4 w-4", showGrid && "text-emerald-500")} />
          </Button>

          <Button variant="ghost" size="sm" title="Zoom In" data-testid="button-zoom-in">
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" title="Zoom Out" data-testid="button-zoom-out">
            <ZoomOut className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="h-6" />

          <Button
            variant="default"
            size="sm"
            onClick={handleSave}
            data-testid="button-save-model"
          >
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </header>

      {/* Main workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel - Object palette */}
        {leftPanelOpen && (
          <>
            <div
              className="bg-card border-r border-border flex flex-col"
              style={{ width: leftPanelWidth }}
            >
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h3 className="font-medium text-foreground">Object Palette</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLeftPanelOpen(false)}
                  data-testid="button-close-left-panel"
                >
                  <PanelLeftClose className="h-4 w-4" />
                </Button>
              </div>
              <ArchitecturalObjectPalette
                domain={model?.domain || 'software'}
                onObjectCreate={handleObjectCreate}
              />
            </div>
            <ResizableSplitter
              width={leftPanelWidth}
              onResize={setLeftPanelWidth}
              minWidth={200}
              maxWidth={500}
            />
          </>
        )}

        {/* Center panel - Canvas */}
        <div className="flex-1 flex flex-col">
          {!leftPanelOpen && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLeftPanelOpen(true)}
              className="absolute top-16 left-4 z-10"
              data-testid="button-open-left-panel"
            >
              <PanelLeftOpen className="h-4 w-4" />
            </Button>
          )}

          <DesignCanvas
            objects={objects}
            selectedIds={selectedObjects}
            onObjectSelect={setSelectedObjects}
            onObjectChange={handleVisualChange}
            isLoading={isLoadingObjects}
          />

          <ModelingToolbar
            selectedObjects={selectedObjects}
            viewMode={viewMode}
            onObjectDelete={handleObjectDelete}
            className="border-t border-border"
          />
        </div>

        {/* Right panel - Properties */}
        {rightPanelOpen && (
          <>
            <ResizableSplitter
              width={rightPanelWidth}
              onResize={setRightPanelWidth}
              minWidth={250}
              maxWidth={500}
              direction="right"
            />
            <div
              className="bg-card border-l border-border flex flex-col"
              style={{ width: rightPanelWidth }}
            >
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h3 className="font-medium text-foreground">Properties</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setRightPanelOpen(false)}
                  data-testid="button-close-right-panel"
                >
                  <PanelRightClose className="h-4 w-4" />
                </Button>
              </div>
              <PropertiesPanel
                selectedObjects={selectedObjects.map(id =>
                  objects.find(obj => obj.id === id)
                ).filter(Boolean) as ArchitecturalObject[]}
                onObjectUpdate={handleObjectUpdate}
              />
            </div>
          </>
        )}

        {!rightPanelOpen && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setRightPanelOpen(true)}
            className="absolute top-16 right-4 z-10"
            data-testid="button-open-right-panel"
          >
            <PanelRightOpen className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Achievement Celebration Modal */}
      <AchievementCelebration
        achievements={celebrationAchievements}
        levelUp={levelUpData}
        onDismiss={handleCelebrationDismiss}
        visible={celebrationVisible}
      />

      {/* AI Assistant */}
      {aiAssistantOpen && (
        <AIAssistant
          context={selectedObjects.length > 0
            ? `Analyzing ${selectedObjects.length} selected objects in ${model?.name || 'architecture model'}`
            : `Architecture modeling - ${model?.name || 'New Model'}`}
          elementType={selectedObjects.length === 1 ? objects.find(obj => obj.id === selectedObjects[0])?.category : undefined}
          framework="ARKHITEKTON"
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
  );
}