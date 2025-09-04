import React from 'react';
import { ModelingWorkspace } from '@/components/modeling/modeling-workspace';
import { ArchitecturalModel } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shapes } from 'lucide-react';
import { Link } from 'wouter';

export default function ModelingPage() {
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

  const handleModelSave = (model: ArchitecturalModel) => {
    console.log('Saving model:', model);
    // TODO: Implement actual save functionality with API call
  };

  const handleModelUpdate = (updates: Partial<ArchitecturalModel>) => {
    console.log('Updating model:', updates);
    // TODO: Implement actual update functionality with API call
  };

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Page Header */}
      <div className="flex items-center justify-between p-6 border-b bg-white dark:bg-slate-900">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm" data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Shapes className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">ARCHITECTURE MODELING</h1>
              <p className="text-muted-foreground">Create and design architectural models with visual components and intelligent connections</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <ModelingWorkspace
          model={mockModel}
          onModelSave={handleModelSave}
          onModelUpdate={handleModelUpdate}
        />
      </div>
    </div>
  );
}