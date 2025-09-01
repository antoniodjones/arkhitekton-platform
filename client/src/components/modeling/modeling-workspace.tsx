import React, { useState, useCallback } from 'react';
import { ModelingCanvas } from './modeling-canvas';
import { ArchitecturalObjectPalette } from './architectural-object-palette';
import { PropertiesPanel } from './properties-panel';
import { ModelingToolbar } from './modeling-toolbar';
import { ResizableSplitter } from '../workspace/resizable-splitter';
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
  Eye
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
  
  // E-commerce architecture demo - ARKITEKTON universal objects vs AWS-specific shapes
  const [objects, setObjects] = useState<ArchitecturalObject[]>([
    // DNS & CDN Layer (Route 53 + CloudFront equivalent)
    {
      id: 'dns-service-1',
      modelId: model?.id || 'ecommerce-model',
      name: 'Global DNS Service',
      objectType: 'standard',
      domain: 'infrastructure',
      category: 'networking',
      visual: {
        shape: 'hexagon',
        position: { x: 100, y: 50 },
        size: { width: 140, height: 70 },
        styling: { color: '#8b5cf6', borderWidth: 2 },
        ports: [],
        annotations: []
      },
      semantics: {
        purpose: 'Highly available DNS service routing customer requests globally',
        responsibilities: ['DNS resolution', 'Health-based routing', 'Geolocation routing'],
        constraints: ['Sub-second response time', '99.99% availability'],
        patterns: ['Global Load Balancing', 'Failover']
      },
      lifecycle: {
        state: 'implemented',
        milestones: [],
        decisions: [],
        changes: []
      },
      metrics: {
        performance: { latency: 5, throughput: 50000 },
        reliability: { uptime: 99.99, errorRate: 0.001 },
        businessValue: { revenueImpact: 95, userSatisfaction: 88 }
      },
      implementation: {
        infrastructure: ['dns-load-balancer'],
        apis: ['DNS queries', 'Health checks']
      },
      metadata: { awsEquivalent: 'Route 53' },
      createdAt: new Date(),
      updatedAt: new Date()
    } as ArchitecturalObject,
    {
      id: 'cdn-service-1',
      modelId: model?.id || 'ecommerce-model',
      name: 'Content Distribution Network',
      objectType: 'standard',
      domain: 'infrastructure',
      category: 'caching',
      visual: {
        shape: 'octagon',
        position: { x: 300, y: 50 },
        size: { width: 160, height: 70 },
        styling: { color: '#06b6d4', borderWidth: 2 },
        ports: [],
        annotations: []
      },
      semantics: {
        purpose: 'Global CDN delivering static content with low latency',
        responsibilities: ['Static content delivery', 'Dynamic content acceleration', 'DDoS protection'],
        constraints: ['Global presence', 'Cache invalidation under 5min'],
        patterns: ['Edge Computing', 'Content Caching']
      },
      lifecycle: {
        state: 'implemented',
        milestones: [],
        decisions: [],
        changes: []
      },
      metrics: {
        performance: { latency: 20, throughput: 100000 },
        reliability: { uptime: 99.95, cacheHitRatio: 92 },
        businessValue: { revenueImpact: 80, userSatisfaction: 95 }
      },
      implementation: {
        infrastructure: ['edge-cache-network'],
        apis: ['HTTPS', 'HTTP/2', 'WebSocket']
      },
      metadata: { awsEquivalent: 'CloudFront' },
      createdAt: new Date(),
      updatedAt: new Date()
    } as ArchitecturalObject,
    // Frontend Applications Layer
    {
      id: 'ecommerce-frontend-1',
      modelId: model?.id || 'ecommerce-model',
      name: 'E-commerce Frontend',
      objectType: 'standard',
      domain: 'software',
      category: 'application',
      visual: {
        shape: 'rectangle',
        position: { x: 150, y: 150 },
        size: { width: 180, height: 80 },
        styling: { color: '#10b981', borderWidth: 2 },
        ports: [],
        annotations: []
      },
      semantics: {
        purpose: 'Customer-facing e-commerce web application with auto-scaling',
        responsibilities: ['Product catalog UI', 'Shopping cart', 'Checkout process', 'User authentication'],
        constraints: ['Mobile-first', 'WCAG 2.1 compliance', 'Sub-3s load time'],
        patterns: ['SPA', 'Responsive Design', 'Auto-scaling']
      },
      lifecycle: {
        state: 'implemented',
        milestones: [],
        decisions: [],
        changes: []
      },
      metrics: {
        performance: { latency: 1200, throughput: 5000 },
        reliability: { uptime: 99.9, errorRate: 0.5 },
        businessValue: { revenueImpact: 100, userSatisfaction: 87 }
      },
      implementation: {
        codeRepositories: ['ecommerce-frontend-repo'],
        apis: ['REST API', 'GraphQL', 'WebSocket']
      },
      metadata: { awsEquivalent: 'EC2 Auto Scaling frontend app' },
      createdAt: new Date(),
      updatedAt: new Date()
    } as ArchitecturalObject,
    {
      id: 'backoffice-frontend-1',
      modelId: model?.id || 'ecommerce-model',
      name: 'Back Office Frontend',
      objectType: 'standard',
      domain: 'software',
      category: 'application',
      visual: {
        shape: 'rectangle',
        position: { x: 350, y: 150 },
        size: { width: 180, height: 80 },
        styling: { color: '#f59e0b', borderWidth: 2 },
        ports: [],
        annotations: []
      },
      semantics: {
        purpose: 'Administrative interface for catalog and order management',
        responsibilities: ['Catalog management', 'Order processing', 'User administration', 'Analytics dashboard'],
        constraints: ['Role-based access', 'Audit logging', 'GDPR compliance'],
        patterns: ['Admin Panel', 'RBAC', 'Auto-scaling']
      },
      lifecycle: {
        state: 'implemented',
        milestones: [],
        decisions: [],
        changes: []
      },
      metrics: {
        performance: { latency: 800, throughput: 500 },
        reliability: { uptime: 99.8, errorRate: 0.2 },
        businessValue: { revenueImpact: 60, userSatisfaction: 82 }
      },
      implementation: {
        codeRepositories: ['backoffice-frontend-repo'],
        apis: ['REST API', 'SSO Integration']
      },
      metadata: { awsEquivalent: 'EC2 Auto Scaling back office app' },
      createdAt: new Date(),
      updatedAt: new Date()
    } as ArchitecturalObject,
    // Microservices Layer (Polyglot services)
    {
      id: 'product-service-1',
      modelId: model?.id || 'ecommerce-model',
      name: 'Product Catalog Service',
      objectType: 'standard',
      domain: 'software',
      category: 'microservice',
      visual: {
        shape: 'circle',
        position: { x: 100, y: 280 },
        size: { width: 120, height: 120 },
        styling: { color: '#ec4899', borderWidth: 2 },
        ports: [],
        annotations: []
      },
      semantics: {
        purpose: 'Domain service managing product catalog with rich metadata',
        responsibilities: ['Product CRUD operations', 'Catalog search', 'Category management', 'Pricing logic'],
        constraints: ['Stateless design', 'Schema evolution support', 'Multi-tenant'],
        patterns: ['Microservice', 'Domain-Driven Design', 'Event Sourcing']
      },
      lifecycle: {
        state: 'implemented',
        milestones: [],
        decisions: [],
        changes: []
      },
      metrics: {
        performance: { latency: 200, throughput: 2000 },
        reliability: { uptime: 99.9, errorRate: 0.1 },
        businessValue: { revenueImpact: 90, userSatisfaction: 85 }
      },
      implementation: {
        codeRepositories: ['product-service-repo'],
        apis: ['REST API', 'Event Bus', 'GraphQL']
      },
      metadata: { awsEquivalent: 'ECS Fargate microservice' },
      createdAt: new Date(),
      updatedAt: new Date()
    } as ArchitecturalObject,
    {
      id: 'cart-service-1',
      modelId: model?.id || 'ecommerce-model',
      name: 'Shopping Cart Service',
      objectType: 'standard',
      domain: 'software',
      category: 'microservice',
      visual: {
        shape: 'circle',
        position: { x: 250, y: 280 },
        size: { width: 120, height: 120 },
        styling: { color: '#8b5cf6', borderWidth: 2 },
        ports: [],
        annotations: []
      },
      semantics: {
        purpose: 'Session-aware shopping cart with persistence',
        responsibilities: ['Cart state management', 'Session persistence', 'Price calculation', 'Inventory validation'],
        constraints: ['Session affinity', 'Real-time updates', 'Abandoned cart recovery'],
        patterns: ['Microservice', 'Session Management', 'Event-Driven']
      },
      lifecycle: {
        state: 'implemented',
        milestones: [],
        decisions: [],
        changes: []
      },
      metrics: {
        performance: { latency: 150, throughput: 3000 },
        reliability: { uptime: 99.8, errorRate: 0.2 },
        businessValue: { revenueImpact: 85, userSatisfaction: 90 }
      },
      implementation: {
        codeRepositories: ['cart-service-repo'],
        apis: ['REST API', 'WebSocket', 'Event Bus']
      },
      metadata: { awsEquivalent: 'ECS Fargate microservice' },
      createdAt: new Date(),
      updatedAt: new Date()
    } as ArchitecturalObject,
    {
      id: 'order-service-1',
      modelId: model?.id || 'ecommerce-model',
      name: 'Order Management Service',
      objectType: 'standard',
      domain: 'software',
      category: 'microservice',
      visual: {
        shape: 'circle',
        position: { x: 400, y: 280 },
        size: { width: 120, height: 120 },
        styling: { color: '#ef4444', borderWidth: 2 },
        ports: [],
        annotations: []
      },
      semantics: {
        purpose: 'Order lifecycle management with payment integration',
        responsibilities: ['Order processing', 'Payment coordination', 'Fulfillment tracking', 'Order history'],
        constraints: ['ACID compliance', 'Payment security', 'Order traceability'],
        patterns: ['Microservice', 'Saga Pattern', 'Compensating Transactions']
      },
      lifecycle: {
        state: 'implemented',
        milestones: [],
        decisions: [],
        changes: []
      },
      metrics: {
        performance: { latency: 300, throughput: 1000 },
        reliability: { uptime: 99.95, errorRate: 0.05 },
        businessValue: { revenueImpact: 100, userSatisfaction: 88 }
      },
      implementation: {
        codeRepositories: ['order-service-repo'],
        apis: ['REST API', 'Payment Gateway API', 'Event Bus']
      },
      metadata: { awsEquivalent: 'ECS Fargate microservice' },
      createdAt: new Date(),
      updatedAt: new Date()
    } as ArchitecturalObject,
    // Data Layer
    {
      id: 'product-database-1',
      modelId: model?.id || 'ecommerce-model',
      name: 'Product Catalog Database',
      objectType: 'standard',
      domain: 'data',
      category: 'database',
      visual: {
        shape: 'cylinder',
        position: { x: 100, y: 450 },
        size: { width: 140, height: 80 },
        styling: { color: '#3b82f6', borderWidth: 2 },
        ports: [],
        annotations: []
      },
      semantics: {
        purpose: 'NoSQL database for flexible product catalog with schema evolution',
        responsibilities: ['Product metadata storage', 'Flexible schema support', 'Category hierarchies'],
        constraints: ['Global distribution', 'Eventual consistency', 'Flexible indexing'],
        patterns: ['Document Store', 'Schema-less', 'Auto-scaling']
      },
      lifecycle: {
        state: 'implemented',
        milestones: [],
        decisions: [],
        changes: []
      },
      metrics: {
        performance: { queryTime: 25, storageSize: 50000 },
        reliability: { availability: 99.99, backupFrequency: 6 },
        businessValue: { revenueImpact: 95, dataQuality: 92 }
      },
      implementation: {
        infrastructure: ['dynamodb-cluster'],
        apis: ['NoSQL API', 'REST API', 'Bulk operations']
      },
      metadata: { awsEquivalent: 'DynamoDB' },
      createdAt: new Date(),
      updatedAt: new Date()
    } as ArchitecturalObject,
    {
      id: 'user-database-1',
      modelId: model?.id || 'ecommerce-model',
      name: 'User & Orders Database',
      objectType: 'standard',
      domain: 'data',
      category: 'database',
      visual: {
        shape: 'cylinder',
        position: { x: 400, y: 450 },
        size: { width: 140, height: 80 },
        styling: { color: '#06b6d4', borderWidth: 2 },
        ports: [],
        annotations: []
      },
      semantics: {
        purpose: 'ACID-compliant relational database for user profiles and order history',
        responsibilities: ['User profile storage', 'Order transaction history', 'Authentication data'],
        constraints: ['ACID compliance', 'High availability', 'Data encryption'],
        patterns: ['RDBMS', 'Multi-AZ', 'Master-Slave Replication']
      },
      lifecycle: {
        state: 'implemented',
        milestones: [],
        decisions: [],
        changes: []
      },
      metrics: {
        performance: { queryTime: 15, storageSize: 25000 },
        reliability: { availability: 99.99, backupFrequency: 24 },
        businessValue: { revenueImpact: 90, dataQuality: 95 }
      },
      implementation: {
        infrastructure: ['rds-multi-az'],
        apis: ['SQL', 'Connection pooling', 'Read replicas']
      },
      metadata: { awsEquivalent: 'RDS Multi-AZ' },
      createdAt: new Date(),
      updatedAt: new Date()
    } as ArchitecturalObject,
    // Cache Layer
    {
      id: 'session-cache-1',
      modelId: model?.id || 'ecommerce-model',
      name: 'Session & Catalog Cache',
      objectType: 'standard',
      domain: 'data',
      category: 'cache',
      visual: {
        shape: 'diamond',
        position: { x: 250, y: 380 },
        size: { width: 140, height: 80 },
        styling: { color: '#f59e0b', borderWidth: 2 },
        ports: [],
        annotations: []
      },
      semantics: {
        purpose: 'In-memory cache for session data and frequently accessed catalog items',
        responsibilities: ['Session storage', 'Catalog caching', 'Performance optimization', 'Cart persistence'],
        constraints: ['Sub-millisecond response', 'High availability', 'Memory optimization'],
        patterns: ['Distributed Cache', 'TTL Management', 'Cache-Aside']
      },
      lifecycle: {
        state: 'implemented',
        milestones: [],
        decisions: [],
        changes: []
      },
      metrics: {
        performance: { latency: 1, throughput: 10000 },
        reliability: { availability: 99.9, cacheHitRatio: 85 },
        businessValue: { revenueImpact: 70, userSatisfaction: 88 }
      },
      implementation: {
        infrastructure: ['redis-cluster'],
        apis: ['Redis Protocol', 'Pub/Sub', 'Clustering']
      },
      metadata: { awsEquivalent: 'ElastiCache' },
      createdAt: new Date(),
      updatedAt: new Date()
    } as ArchitecturalObject,
    // Search & AI Services Layer
    {
      id: 'search-service-1',
      modelId: model?.id || 'ecommerce-model',
      name: 'Product Search Engine',
      objectType: 'standard',
      domain: 'software',
      category: 'search',
      visual: {
        shape: 'hexagon',
        position: { x: 50, y: 580 },
        size: { width: 140, height: 70 },
        styling: { color: '#7c3aed', borderWidth: 2 },
        ports: [],
        annotations: []
      },
      semantics: {
        purpose: 'Fast and highly scalable product catalog search with relevance scoring',
        responsibilities: ['Full-text search', 'Faceted search', 'Auto-completion', 'Search analytics'],
        constraints: ['Sub-100ms search response', 'Real-time indexing', 'Multi-language support'],
        patterns: ['Search Engine', 'Inverted Index', 'Relevance Scoring']
      },
      lifecycle: {
        state: 'implemented',
        milestones: [],
        decisions: [],
        changes: []
      },
      metrics: {
        performance: { queryLatency: 45, indexSize: 500000 },
        reliability: { availability: 99.9, searchAccuracy: 94 },
        businessValue: { revenueImpact: 75, userSatisfaction: 89 }
      },
      implementation: {
        infrastructure: ['elasticsearch-cluster'],
        apis: ['Search API', 'Index API', 'Analytics API']
      },
      metadata: { awsEquivalent: 'Amazon Elasticsearch Service' },
      createdAt: new Date(),
      updatedAt: new Date()
    } as ArchitecturalObject,
    {
      id: 'personalization-service-1',
      modelId: model?.id || 'ecommerce-model',
      name: 'AI Personalization Engine',
      objectType: 'standard',
      domain: 'software',
      category: 'ai-service',
      visual: {
        shape: 'star',
        position: { x: 220, y: 580 },
        size: { width: 120, height: 120 },
        styling: { color: '#f97316', borderWidth: 2 },
        ports: [],
        annotations: []
      },
      semantics: {
        purpose: 'ML-powered personalization for product recommendations and search re-ranking',
        responsibilities: ['Similar item recommendations', 'User preference learning', 'Search re-ranking', 'Real-time personalization'],
        constraints: ['Real-time inference', 'Privacy compliance', 'Model freshness'],
        patterns: ['Machine Learning', 'Recommendation Engine', 'Real-time Inference']
      },
      lifecycle: {
        state: 'implemented',
        milestones: [],
        decisions: [],
        changes: []
      },
      metrics: {
        performance: { inferenceLatency: 50, modelAccuracy: 87 },
        reliability: { availability: 99.5, predictionQuality: 85 },
        businessValue: { revenueImpact: 82, conversionLift: 15 }
      },
      implementation: {
        infrastructure: ['ml-inference-cluster'],
        apis: ['Recommendation API', 'Personalization API']
      },
      metadata: { awsEquivalent: 'Amazon Personalize' },
      createdAt: new Date(),
      updatedAt: new Date()
    } as ArchitecturalObject,
    {
      id: 'messaging-service-1',
      modelId: model?.id || 'ecommerce-model',
      name: 'Customer Messaging Service',
      objectType: 'standard',
      domain: 'software',
      category: 'messaging',
      visual: {
        shape: 'pentagon',
        position: { x: 390, y: 580 },
        size: { width: 140, height: 70 },
        styling: { color: '#22c55e', borderWidth: 2 },
        ports: [],
        annotations: []
      },
      semantics: {
        purpose: 'Multi-channel customer messaging with personalization and automation',
        responsibilities: ['Welcome messages', 'Abandoned cart recovery', 'Personalized promotions', 'Multi-channel delivery'],
        constraints: ['Real-time delivery', 'Personalization context', 'Compliance with CAN-SPAM'],
        patterns: ['Event-Driven Messaging', 'Multi-channel', 'Template Engine']
      },
      lifecycle: {
        state: 'implemented',
        milestones: [],
        decisions: [],
        changes: []
      },
      metrics: {
        performance: { deliveryLatency: 200, throughput: 50000 },
        reliability: { deliveryRate: 98.5, availability: 99.8 },
        businessValue: { revenueImpact: 65, customerEngagement: 78 }
      },
      implementation: {
        infrastructure: ['messaging-platform'],
        apis: ['Messaging API', 'Template API', 'Analytics API']
      },
      metadata: { awsEquivalent: 'Amazon Pinpoint' },
      createdAt: new Date(),
      updatedAt: new Date()
    } as ArchitecturalObject,
    // Static Assets Storage
    {
      id: 'static-storage-1',
      modelId: model?.id || 'ecommerce-model',
      name: 'Static Assets Storage',
      objectType: 'standard',
      domain: 'data',
      category: 'storage',
      visual: {
        shape: 'cylinder',
        position: { x: 550, y: 350 },
        size: { width: 120, height: 80 },
        styling: { color: '#64748b', borderWidth: 2 },
        ports: [],
        annotations: []
      },
      semantics: {
        purpose: 'Cloud object storage for product images, manuals, videos, and application logs',
        responsibilities: ['Static content storage', 'Media file delivery', 'Log file archiving', 'Backup storage'],
        constraints: ['99.999% durability', 'Global accessibility', 'Cost optimization'],
        patterns: ['Object Storage', 'Content Delivery', 'Lifecycle Management']
      },
      lifecycle: {
        state: 'implemented',
        milestones: [],
        decisions: [],
        changes: []
      },
      metrics: {
        performance: { accessLatency: 100, storageSize: 500000 },
        reliability: { durability: 99.999, availability: 99.9 },
        businessValue: { revenueImpact: 40, costEfficiency: 90 }
      },
      implementation: {
        infrastructure: ['object-storage-buckets'],
        apis: ['S3-compatible API', 'CDN integration']
      },
      metadata: { awsEquivalent: 'Amazon S3' },
      createdAt: new Date(),
      updatedAt: new Date()
    } as ArchitecturalObject
  ]);
  
  const [connections, setConnections] = useState<ObjectConnection[]>([]);

  // Object management handlers
  const handleObjectCreate = useCallback((objectData: Partial<ArchitecturalObject>) => {
    const newObject: ArchitecturalObject = {
      id: `obj-${Date.now()}`,
      modelId: model?.id || 'model-1',
      name: objectData.name || 'New Object',
      objectType: objectData.objectType || 'custom',
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
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setObjects(prev => [...prev, newObject]);
  }, [model?.id]);

  const handleObjectUpdate = useCallback((objectId: string, updates: Partial<ArchitecturalObject>) => {
    setObjects(prev => prev.map(obj => 
      obj.id === objectId 
        ? { ...obj, ...updates, updatedAt: new Date() }
        : obj
    ));
  }, []);

  const handleObjectDelete = useCallback((objectId: string) => {
    setObjects(prev => prev.filter(obj => obj.id !== objectId));
    setSelectedObjects(prev => prev.filter(id => id !== objectId));
  }, []);

  const handleConnectionCreate = useCallback((connectionData: Partial<ObjectConnection>) => {
    const newConnection: ObjectConnection = {
      id: `conn-${Date.now()}`,
      sourceObjectId: connectionData.sourceObjectId || '',
      targetObjectId: connectionData.targetObjectId || '',
      relationshipType: connectionData.relationshipType || 'depends_on',
      direction: connectionData.direction || 'directed',
      visual: connectionData.visual || {
        path: [],
        styling: { strokeWidth: 2, color: '#64748b' },
        labels: []
      },
      properties: {},
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setConnections(prev => [...prev, newConnection]);
  }, []);

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
          connections: connections,
          viewport: { x: 0, y: 0, zoom: 1 }, // This should come from canvas
          layouts: []
        },
        updatedAt: new Date()
      };
      onModelSave(updatedModel);
    }
  }, [model, objects, connections, onModelSave]);

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
          
          <ModelingCanvas
            modelId={model?.id}
            objects={objects}
            connections={connections}
            viewMode={viewMode}
            onObjectCreate={handleObjectCreate}
            onObjectUpdate={handleObjectUpdate}
            onObjectDelete={handleObjectDelete}
            onConnectionCreate={handleConnectionCreate}
            className="flex-1"
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
    </div>
  );
}