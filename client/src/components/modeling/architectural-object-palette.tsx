import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Database, Server, Globe, Shield, Users, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ArchitecturalObject } from '@shared/schema';

interface ObjectTemplate {
  id: string;
  name: string;
  domain: string;
  category: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  defaultSize: { width: number; height: number };
  semantics: {
    purpose: string;
    responsibilities: string[];
    patterns: string[];
  };
}

const objectTemplates: ObjectTemplate[] = [
  // Software domain
  {
    id: 'microservice',
    name: 'Microservice',
    domain: 'software',
    category: 'service',
    description: 'Independent service with single responsibility',
    icon: Server,
    color: '#10b981',
    defaultSize: { width: 180, height: 80 },
    semantics: {
      purpose: 'Provide specific business capability',
      responsibilities: ['Handle business logic', 'Manage state', 'Expose API'],
      patterns: ['Microservices', 'API Gateway', 'Circuit Breaker']
    }
  },
  {
    id: 'api-gateway',
    name: 'API Gateway',
    domain: 'software',
    category: 'service',
    description: 'Entry point for API requests',
    icon: Globe,
    color: '#3b82f6',
    defaultSize: { width: 160, height: 80 },
    semantics: {
      purpose: 'Route and manage API requests',
      responsibilities: ['Request routing', 'Authentication', 'Rate limiting'],
      patterns: ['Gateway Pattern', 'Authentication Proxy']
    }
  },
  {
    id: 'web-app',
    name: 'Web Application',
    domain: 'software',
    category: 'application',
    description: 'User-facing web application',
    icon: Globe,
    color: '#8b5cf6',
    defaultSize: { width: 200, height: 80 },
    semantics: {
      purpose: 'Provide user interface and experience',
      responsibilities: ['User interaction', 'Data presentation', 'Client logic'],
      patterns: ['MVC', 'SPA', 'Progressive Web App']
    }
  },
  
  // Data domain
  {
    id: 'database',
    name: 'Database',
    domain: 'data',
    category: 'store',
    description: 'Persistent data storage',
    icon: Database,
    color: '#ef4444',
    defaultSize: { width: 160, height: 80 },
    semantics: {
      purpose: 'Store and manage data',
      responsibilities: ['Data persistence', 'Query processing', 'ACID compliance'],
      patterns: ['Repository', 'Unit of Work']
    }
  },
  {
    id: 'data-lake',
    name: 'Data Lake',
    domain: 'data',
    category: 'store',
    description: 'Raw data storage for analytics',
    icon: Database,
    color: '#f59e0b',
    defaultSize: { width: 180, height: 80 },
    semantics: {
      purpose: 'Store large volumes of raw data',
      responsibilities: ['Data ingestion', 'Schema flexibility', 'Analytics support'],
      patterns: ['Data Lake', 'Lambda Architecture']
    }
  },
  
  // Infrastructure domain
  {
    id: 'load-balancer',
    name: 'Load Balancer',
    domain: 'infrastructure',
    category: 'network',
    description: 'Distribute traffic across services',
    icon: Zap,
    color: '#06b6d4',
    defaultSize: { width: 140, height: 80 },
    semantics: {
      purpose: 'Distribute incoming requests',
      responsibilities: ['Traffic distribution', 'Health checks', 'SSL termination'],
      patterns: ['Load Balancing', 'Health Check']
    }
  },
  
  // Security domain
  {
    id: 'identity-provider',
    name: 'Identity Provider',
    domain: 'security',
    category: 'service',
    description: 'Authentication and authorization service',
    icon: Shield,
    color: '#dc2626',
    defaultSize: { width: 180, height: 80 },
    semantics: {
      purpose: 'Manage user identities and access',
      responsibilities: ['Authentication', 'Authorization', 'Token management'],
      patterns: ['OAuth 2.0', 'OpenID Connect', 'SAML']
    }
  },
  
  // Business domain
  {
    id: 'business-capability',
    name: 'Business Capability',
    domain: 'business',
    category: 'capability',
    description: 'Core business function or ability',
    icon: Users,
    color: '#7c3aed',
    defaultSize: { width: 200, height: 80 },
    semantics: {
      purpose: 'Represent business capability',
      responsibilities: ['Business function', 'Value delivery', 'Outcome achievement'],
      patterns: ['Capability Map', 'Value Stream']
    }
  }
];

interface ArchitecturalObjectPaletteProps {
  domain?: string;
  onObjectCreate: (object: Partial<ArchitecturalObject>) => void;
  className?: string;
}

export function ArchitecturalObjectPalette({
  domain = 'software',
  onObjectCreate,
  className
}: ArchitecturalObjectPaletteProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState(domain);

  const domains = ['software', 'data', 'infrastructure', 'security', 'business', 'integration'];
  
  const filteredTemplates = objectTemplates.filter(template => {
    const matchesDomain = selectedDomain === 'all' || template.domain === selectedDomain;
    const matchesSearch = searchQuery === '' || 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesDomain && matchesSearch;
  });

  const handleCreateObject = (template: ObjectTemplate) => {
    const newObject: Partial<ArchitecturalObject> = {
      name: template.name,
      objectType: 'standard',
      domain: template.domain as any,
      category: template.category,
      visual: {
        shape: 'rectangle',
        position: { x: 200 + Math.random() * 100, y: 200 + Math.random() * 100 },
        size: template.defaultSize,
        styling: { 
          color: template.color, 
          borderWidth: 2,
          backgroundColor: template.color + '10'
        },
        ports: [],
        annotations: []
      },
      semantics: template.semantics,
      lifecycle: {
        state: 'planned',
        milestones: [],
        decisions: [],
        changes: []
      },
      metrics: {},
      implementation: {},
      metadata: {
        templateId: template.id
      }
    };
    
    onObjectCreate(newObject);
  };

  const getDomainIcon = (domainName: string) => {
    switch (domainName) {
      case 'software': return Server;
      case 'data': return Database;
      case 'infrastructure': return Zap;
      case 'security': return Shield;
      case 'business': return Users;
      case 'integration': return Globe;
      default: return Server;
    }
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search objects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="input-search-objects"
          />
        </div>
      </div>

      {/* Domain selection */}
      <div className="px-4 pb-2">
        <div className="grid grid-cols-3 gap-1 mb-2">
          {['software', 'data', 'infrastructure'].map((domainName) => {
            const Icon = getDomainIcon(domainName);
            return (
              <Button
                key={domainName}
                variant={selectedDomain === domainName ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedDomain(domainName)}
                className="text-xs py-2"
              >
                <Icon className="h-3 w-3 mr-1" />
                {domainName === 'infrastructure' ? 'Infra' : domainName.charAt(0).toUpperCase() + domainName.slice(1)}
              </Button>
            );
          })}
        </div>
        <div className="grid grid-cols-3 gap-1">
          {['security', 'business', 'integration'].map((domainName) => {
            const Icon = getDomainIcon(domainName);
            return (
              <Button
                key={domainName}
                variant={selectedDomain === domainName ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedDomain(domainName)}
                className="text-xs py-2"
              >
                <Icon className="h-3 w-3 mr-1" />
                {domainName.charAt(0).toUpperCase() + domainName.slice(1)}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Object templates */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-3 pb-4">
            {filteredTemplates.map((template) => {
              const IconComponent = template.icon;
              
              return (
                <div
                  key={template.id}
                  className="group relative border border-border rounded-lg p-3 hover:border-emerald-300 dark:hover:border-emerald-600 transition-colors cursor-pointer bg-card hover:bg-accent/50"
                  onClick={() => handleCreateObject(template)}
                  data-testid={`object-template-${template.id}`}
                >
                  <div className="flex items-start space-x-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                      style={{ backgroundColor: template.color }}
                    >
                      <IconComponent className="h-5 w-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-foreground text-sm truncate">
                          {template.name}
                        </h4>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCreateObject(template);
                          }}
                          data-testid={`button-create-${template.id}`}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {template.description}
                      </p>
                      
                      <div className="flex items-center gap-1 mt-2 flex-wrap">
                        <Badge variant="secondary" className="text-xs px-2 py-0">
                          {template.category}
                        </Badge>
                        {template.semantics.patterns.slice(0, 2).map(pattern => (
                          <Badge 
                            key={pattern} 
                            variant="outline" 
                            className="text-xs px-2 py-0"
                          >
                            {pattern}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Custom object creation */}
      <div className="p-4 border-t border-border">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={() => handleCreateObject({
            id: 'custom',
            name: 'Custom Object',
            domain: selectedDomain,
            category: 'component',
            description: 'Custom architectural component',
            icon: Server,
            color: '#64748b',
            defaultSize: { width: 180, height: 80 },
            semantics: {
              purpose: 'Custom purpose',
              responsibilities: [],
              patterns: []
            }
          })}
          data-testid="button-create-custom-object"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Custom Object
        </Button>
      </div>
    </div>
  );
}