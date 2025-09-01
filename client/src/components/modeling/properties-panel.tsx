import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Settings, 
  Info, 
  BarChart3, 
  GitBranch, 
  Code, 
  Plus, 
  Trash2,
  Edit,
  Save
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ArchitecturalObject } from '@shared/schema';

interface PropertiesPanelProps {
  selectedObjects: ArchitecturalObject[];
  onObjectUpdate: (objectId: string, updates: Partial<ArchitecturalObject>) => void;
  className?: string;
}

export function PropertiesPanel({
  selectedObjects,
  onObjectUpdate,
  className
}: PropertiesPanelProps) {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<string>('');

  const selectedObject = selectedObjects.length === 1 ? selectedObjects[0] : null;

  const handleFieldEdit = (field: string, currentValue: string) => {
    setEditingField(field);
    setEditingValue(currentValue);
  };

  const handleFieldSave = (field: string) => {
    if (selectedObject) {
      const keys = field.split('.');
      const updates: any = {};
      let current = updates;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = {};
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = editingValue;
      
      onObjectUpdate(selectedObject.id, updates);
    }
    setEditingField(null);
    setEditingValue('');
  };

  const handleFieldCancel = () => {
    setEditingField(null);
    setEditingValue('');
  };

  const addResponsibility = () => {
    if (selectedObject) {
      const newResponsibilities = [
        ...(selectedObject.semantics?.responsibilities || []),
        'New responsibility'
      ];
      onObjectUpdate(selectedObject.id, {
        semantics: {
          ...selectedObject.semantics,
          responsibilities: newResponsibilities
        }
      });
    }
  };

  const removeResponsibility = (index: number) => {
    if (selectedObject) {
      const newResponsibilities = selectedObject.semantics?.responsibilities?.filter((_, i) => i !== index) || [];
      onObjectUpdate(selectedObject.id, {
        semantics: {
          ...selectedObject.semantics,
          responsibilities: newResponsibilities
        }
      });
    }
  };

  const renderEditableField = (
    field: string, 
    value: string, 
    label: string,
    multiline: boolean = false
  ) => {
    const isEditing = editingField === field;
    
    if (isEditing) {
      return (
        <div className="space-y-2">
          <Label htmlFor={field}>{label}</Label>
          {multiline ? (
            <Textarea
              id={field}
              value={editingValue}
              onChange={(e) => setEditingValue(e.target.value)}
              className="min-h-[80px]"
              autoFocus
            />
          ) : (
            <Input
              id={field}
              value={editingValue}
              onChange={(e) => setEditingValue(e.target.value)}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleFieldSave(field);
                if (e.key === 'Escape') handleFieldCancel();
              }}
            />
          )}
          <div className="flex gap-2">
            <Button size="sm" onClick={() => handleFieldSave(field)}>
              <Save className="h-3 w-3 mr-1" />
              Save
            </Button>
            <Button size="sm" variant="outline" onClick={handleFieldCancel}>
              Cancel
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>{label}</Label>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleFieldEdit(field, value)}
            className="h-6 w-6 p-0"
          >
            <Edit className="h-3 w-3" />
          </Button>
        </div>
        <p className={cn(
          "text-sm p-2 rounded border min-h-[32px] flex items-center",
          !value && "text-muted-foreground italic"
        )}>
          {value || 'Click to add...'}
        </p>
      </div>
    );
  };

  if (selectedObjects.length === 0) {
    return (
      <div className={cn("flex flex-col h-full", className)}>
        <div className="flex-1 flex items-center justify-center p-8 text-center">
          <div className="space-y-3">
            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mx-auto">
              <Settings className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-foreground">No Object Selected</p>
              <p className="text-sm text-muted-foreground">
                Select an architectural object to view and edit its properties
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedObjects.length > 1) {
    return (
      <div className={cn("flex flex-col h-full", className)}>
        <div className="flex-1 flex items-center justify-center p-8 text-center">
          <div className="space-y-3">
            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mx-auto">
              <Settings className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-foreground">Multiple Objects Selected</p>
              <p className="text-sm text-muted-foreground">
                {selectedObjects.length} objects selected. Multi-edit coming soon.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Object header */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                style={{ backgroundColor: selectedObject?.visual?.styling?.color || '#64748b' }}
              >
                <div className="w-5 h-5 bg-white/80 rounded transform rotate-45" />
              </div>
              <div className="flex-1">
                {renderEditableField('name', selectedObject?.name || '', 'Object Name')}
              </div>
            </div>
            
            <div className="flex gap-2">
              <Badge variant="secondary">
                {selectedObject?.domain}
              </Badge>
              <Badge variant="outline">
                {selectedObject?.category}
              </Badge>
              <Badge 
                variant={selectedObject?.lifecycle?.state === 'implemented' ? 'default' : 'secondary'}
              >
                {selectedObject?.lifecycle?.state}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Properties tabs */}
          <Tabs defaultValue="basic" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic" className="text-xs">
                <Info className="h-3 w-3 mr-1" />
                Basic
              </TabsTrigger>
              <TabsTrigger value="metrics" className="text-xs">
                <BarChart3 className="h-3 w-3 mr-1" />
                Metrics
              </TabsTrigger>
              <TabsTrigger value="lifecycle" className="text-xs">
                <GitBranch className="h-3 w-3 mr-1" />
                Lifecycle
              </TabsTrigger>
              <TabsTrigger value="implementation" className="text-xs">
                <Code className="h-3 w-3 mr-1" />
                Implementation
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              {/* Purpose and semantics */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Architectural Semantics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {renderEditableField(
                    'semantics.purpose', 
                    selectedObject?.semantics?.purpose || '', 
                    'Purpose',
                    true
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Responsibilities</Label>
                      <Button size="sm" variant="outline" onClick={addResponsibility}>
                        <Plus className="h-3 w-3 mr-1" />
                        Add
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {selectedObject?.semantics?.responsibilities?.map((responsibility, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input 
                            value={responsibility}
                            onChange={(e) => {
                              const newResponsibilities = [...(selectedObject.semantics?.responsibilities || [])];
                              newResponsibilities[index] = e.target.value;
                              onObjectUpdate(selectedObject.id, {
                                semantics: {
                                  ...selectedObject.semantics,
                                  responsibilities: newResponsibilities
                                }
                              });
                            }}
                            className="flex-1"
                          />
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => removeResponsibility(index)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Visual properties */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Visual Properties</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Width</Label>
                      <Input 
                        type="number"
                        value={selectedObject?.visual?.size?.width || 0}
                        onChange={(e) => {
                          onObjectUpdate(selectedObject!.id, {
                            visual: {
                              ...selectedObject!.visual,
                              size: {
                                ...selectedObject!.visual.size,
                                width: parseInt(e.target.value) || 0
                              }
                            }
                          });
                        }}
                      />
                    </div>
                    <div>
                      <Label>Height</Label>
                      <Input 
                        type="number"
                        value={selectedObject?.visual?.size?.height || 0}
                        onChange={(e) => {
                          onObjectUpdate(selectedObject!.id, {
                            visual: {
                              ...selectedObject!.visual,
                              size: {
                                ...selectedObject!.visual.size,
                                height: parseInt(e.target.value) || 0
                              }
                            }
                          });
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="metrics" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedObject?.metrics?.performance ? (
                    <div className="space-y-3">
                      {Object.entries(selectedObject.metrics.performance).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center">
                          <Label className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</Label>
                          <Badge variant="secondary">{value}</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No performance metrics available</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Business Value</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedObject?.metrics?.businessValue ? (
                    <div className="space-y-3">
                      {Object.entries(selectedObject.metrics.businessValue).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center">
                          <Label className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</Label>
                          <Badge variant="default">{value}%</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No business value metrics available</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="lifecycle" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Lifecycle State</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label>Current State</Label>
                      <p className="text-sm p-2 rounded border mt-1">
                        <Badge>{selectedObject?.lifecycle?.state}</Badge>
                      </p>
                    </div>
                    
                    {selectedObject?.lifecycle?.changes && selectedObject.lifecycle.changes.length > 0 && (
                      <div>
                        <Label>Recent Changes</Label>
                        <div className="space-y-2 mt-2">
                          {selectedObject.lifecycle.changes.slice(0, 3).map((change, index) => (
                            <div key={index} className="text-sm p-2 bg-muted rounded">
                              Change record {index + 1}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="implementation" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Implementation Links</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedObject?.implementation?.codeRepositories && (
                      <div>
                        <Label>Code Repositories</Label>
                        <div className="space-y-1 mt-1">
                          {selectedObject.implementation.codeRepositories.map((repo, index) => (
                            <div key={index} className="text-sm p-2 bg-muted rounded font-mono">
                              {repo}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {selectedObject?.implementation?.apis && (
                      <div>
                        <Label>API Endpoints</Label>
                        <div className="space-y-1 mt-1">
                          {selectedObject.implementation.apis.map((api, index) => (
                            <div key={index} className="text-sm p-2 bg-muted rounded font-mono">
                              {api}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {(!selectedObject?.implementation?.codeRepositories?.length && 
                      !selectedObject?.implementation?.apis?.length) && (
                      <p className="text-sm text-muted-foreground">
                        No implementation links available
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
}