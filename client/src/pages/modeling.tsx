import React from 'react';
import { ModelingWorkspace } from '@/components/modeling/modeling-workspace';
import { ArchitecturalModel } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Shapes, Home, Settings, Plus } from 'lucide-react';
import { Link } from 'wouter';
import { AppLayout } from '@/components/layout/app-layout';
import { GovernanceHeader } from '@/components/layout/governance-header';

function ModelingContent() {
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
    <div className="h-full overflow-hidden flex flex-col">
      <GovernanceHeader 
        moduleTitle="Architecture Modeling" 
        moduleIcon={Shapes} 
      />

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <ModelingWorkspace
          model={mockModel}
          onModelSave={handleModelSave}
          onModelUpdate={handleModelUpdate}
        />
      </div>
    </div>
  );
}

export default function ModelingPage() {
  return (
    <AppLayout>
      <ModelingContent />
    </AppLayout>
  );
}