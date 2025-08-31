import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Building2, Target, Briefcase, Lightbulb, ExternalLink } from 'lucide-react';

interface PortfolioAssociation {
  level1: {
    id: string;
    name: string;
    type: 'portfolio' | 'division' | 'business_unit';
  };
  level2: {
    id: string;
    name: string;
    type: 'product' | 'program' | 'project' | 'initiative';
  };
  level3?: {
    id: string;
    name: string;
    type: 'product' | 'program' | 'project' | 'initiative';
  };
  externalRef?: {
    system: string;
    projectKey: string;
    projectName: string;
    url?: string;
  };
}

interface PortfolioAssociationFormProps {
  value?: PortfolioAssociation;
  onChange: (value: PortfolioAssociation | undefined) => void;
  disabled?: boolean;
}

export function PortfolioAssociationForm({ value, onChange, disabled }: PortfolioAssociationFormProps) {
  const [showExternalRef, setShowExternalRef] = useState(!!value?.externalRef);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'portfolio':
      case 'division':
      case 'business_unit':
        return Building2;
      case 'product':
        return Target;
      case 'program':
        return Briefcase;
      case 'project':
        return Target;
      case 'initiative':
        return Lightbulb;
      default:
        return Building2;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'portfolio':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      case 'division':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300';
      case 'business_unit':
        return 'bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-300';
      case 'product':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300';
      case 'program':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'project':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300';
      case 'initiative':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-300';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-300';
    }
  };

  const updateLevel1 = (field: string, fieldValue: string) => {
    const newValue = {
      ...value,
      level1: {
        ...value?.level1,
        [field]: fieldValue,
        id: field === 'name' ? fieldValue.toLowerCase().replace(/\s+/g, '-') : value?.level1?.id || '',
        name: field === 'name' ? fieldValue : value?.level1?.name || '',
        type: field === 'type' ? fieldValue as any : value?.level1?.type || 'portfolio'
      },
      level2: value?.level2 || { id: '', name: '', type: 'project' as const }
    };
    onChange(newValue);
  };

  const updateLevel2 = (field: string, fieldValue: string) => {
    if (!value?.level1) return;
    
    const newValue = {
      ...value,
      level2: {
        ...value?.level2,
        [field]: fieldValue,
        id: field === 'name' ? fieldValue.toLowerCase().replace(/\s+/g, '-') : value?.level2?.id || '',
        name: field === 'name' ? fieldValue : value?.level2?.name || '',
        type: field === 'type' ? fieldValue as any : value?.level2?.type || 'project'
      }
    };
    onChange(newValue);
  };

  const updateLevel3 = (field: string, fieldValue: string) => {
    if (!value?.level1 || !value?.level2) return;
    
    const newValue = {
      ...value,
      level3: {
        ...value?.level3,
        [field]: fieldValue,
        id: field === 'name' ? fieldValue.toLowerCase().replace(/\s+/g, '-') : value?.level3?.id || '',
        name: field === 'name' ? fieldValue : value?.level3?.name || '',
        type: field === 'type' ? fieldValue as any : value?.level3?.type || 'project'
      }
    };
    onChange(newValue);
  };

  const removeLevel3 = () => {
    if (!value) return;
    const newValue = { ...value };
    delete newValue.level3;
    onChange(newValue);
  };

  const addLevel3 = () => {
    if (!value?.level1 || !value?.level2) return;
    const newValue = {
      ...value,
      level3: { id: '', name: '', type: 'project' as const }
    };
    onChange(newValue);
  };

  const updateExternalRef = (field: string, fieldValue: string) => {
    if (!value) return;
    
    const newValue = {
      ...value,
      externalRef: {
        ...value?.externalRef,
        [field]: fieldValue,
        system: field === 'system' ? fieldValue : value?.externalRef?.system || '',
        projectKey: field === 'projectKey' ? fieldValue : value?.externalRef?.projectKey || '',
        projectName: field === 'projectName' ? fieldValue : value?.externalRef?.projectName || ''
      }
    };
    onChange(newValue);
  };

  const removeExternalRef = () => {
    if (!value) return;
    const newValue = { ...value };
    delete newValue.externalRef;
    setShowExternalRef(false);
    onChange(newValue);
  };

  const clearAssociation = () => {
    onChange(undefined);
  };

  if (!value) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Portfolio Association</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
            Associate this ticket with your organizational hierarchy for better governance and reporting.
          </p>
          <Button 
            onClick={() => onChange({ 
              level1: { id: '', name: '', type: 'portfolio' }, 
              level2: { id: '', name: '', type: 'project' } 
            })}
            disabled={disabled}
            variant="outline"
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Portfolio Association
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-sm font-medium">Portfolio Association</CardTitle>
        <Button
          onClick={clearAssociation}
          disabled={disabled}
          variant="ghost"
          size="sm"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Level 1 - Portfolio/Division */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-slate-600 dark:text-slate-300">
            Level 1: Portfolio/Division
          </Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Input
                placeholder="Portfolio name"
                value={value.level1?.name || ''}
                onChange={(e) => updateLevel1('name', e.target.value)}
                disabled={disabled}
                className="bg-white/70 dark:bg-slate-800/70"
              />
            </div>
            <div>
              <Select
                value={value.level1?.type}
                onValueChange={(val) => updateLevel1('type', val)}
                disabled={disabled}
              >
                <SelectTrigger className="bg-white/70 dark:bg-slate-800/70">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="portfolio">Portfolio</SelectItem>
                  <SelectItem value="division">Division</SelectItem>
                  <SelectItem value="business_unit">Business Unit</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {value.level1?.name && (
            <Badge className={getTypeColor(value.level1.type)} variant="outline">
              {React.createElement(getTypeIcon(value.level1.type), { className: "h-3 w-3 mr-1" })}
              {value.level1.name}
            </Badge>
          )}
        </div>

        <Separator />

        {/* Level 2 - Product/Program/Project/Initiative */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-slate-600 dark:text-slate-300">
            Level 2: Product/Program/Project/Initiative
          </Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Input
                placeholder="Name"
                value={value.level2?.name || ''}
                onChange={(e) => updateLevel2('name', e.target.value)}
                disabled={disabled}
                className="bg-white/70 dark:bg-slate-800/70"
              />
            </div>
            <div>
              <Select
                value={value.level2?.type}
                onValueChange={(val) => updateLevel2('type', val)}
                disabled={disabled}
              >
                <SelectTrigger className="bg-white/70 dark:bg-slate-800/70">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="product">Product</SelectItem>
                  <SelectItem value="program">Program</SelectItem>
                  <SelectItem value="project">Project</SelectItem>
                  <SelectItem value="initiative">Initiative</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {value.level2?.name && (
            <Badge className={getTypeColor(value.level2.type)} variant="outline">
              {React.createElement(getTypeIcon(value.level2.type), { className: "h-3 w-3 mr-1" })}
              {value.level2.name}
            </Badge>
          )}
        </div>

        {/* Level 3 - Optional */}
        {value.level3 ? (
          <>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                  Level 3: Sub-component (Optional)
                </Label>
                <Button
                  onClick={removeLevel3}
                  disabled={disabled}
                  variant="ghost"
                  size="sm"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Input
                    placeholder="Name"
                    value={value.level3?.name || ''}
                    onChange={(e) => updateLevel3('name', e.target.value)}
                    disabled={disabled}
                    className="bg-white/70 dark:bg-slate-800/70"
                  />
                </div>
                <div>
                  <Select
                    value={value.level3?.type}
                    onValueChange={(val) => updateLevel3('type', val)}
                    disabled={disabled}
                  >
                    <SelectTrigger className="bg-white/70 dark:bg-slate-800/70">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="product">Product</SelectItem>
                      <SelectItem value="program">Program</SelectItem>
                      <SelectItem value="project">Project</SelectItem>
                      <SelectItem value="initiative">Initiative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {value.level3?.name && (
                <Badge className={getTypeColor(value.level3.type)} variant="outline">
                  {React.createElement(getTypeIcon(value.level3.type), { className: "h-3 w-3 mr-1" })}
                  {value.level3.name}
                </Badge>
              )}
            </div>
          </>
        ) : (
          <Button
            onClick={addLevel3}
            disabled={disabled}
            variant="outline"
            size="sm"
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Level 3
          </Button>
        )}

        {/* External Reference */}
        {showExternalRef && value.externalRef ? (
          <>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                  External Project Reference
                </Label>
                <Button
                  onClick={removeExternalRef}
                  disabled={disabled}
                  variant="ghost"
                  size="sm"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Input
                    placeholder="System (e.g., Jira)"
                    value={value.externalRef?.system || ''}
                    onChange={(e) => updateExternalRef('system', e.target.value)}
                    disabled={disabled}
                    className="bg-white/70 dark:bg-slate-800/70"
                  />
                </div>
                <div>
                  <Input
                    placeholder="Project Key"
                    value={value.externalRef?.projectKey || ''}
                    onChange={(e) => updateExternalRef('projectKey', e.target.value)}
                    disabled={disabled}
                    className="bg-white/70 dark:bg-slate-800/70"
                  />
                </div>
                <div>
                  <Input
                    placeholder="Project Name"
                    value={value.externalRef?.projectName || ''}
                    onChange={(e) => updateExternalRef('projectName', e.target.value)}
                    disabled={disabled}
                    className="bg-white/70 dark:bg-slate-800/70"
                  />
                </div>
              </div>
              <div>
                <Input
                  placeholder="URL (optional)"
                  value={value.externalRef?.url || ''}
                  onChange={(e) => updateExternalRef('url', e.target.value)}
                  disabled={disabled}
                  className="bg-white/70 dark:bg-slate-800/70"
                />
              </div>
              {value.externalRef?.system && value.externalRef?.projectKey && (
                <Badge variant="outline" className="w-fit">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  {value.externalRef.system}: {value.externalRef.projectKey}
                </Badge>
              )}
            </div>
          </>
        ) : (
          <Button
            onClick={() => setShowExternalRef(true)}
            disabled={disabled}
            variant="outline"
            size="sm"
            className="w-full"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Add External Reference
          </Button>
        )}
      </CardContent>
    </Card>
  );
}