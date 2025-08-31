import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, X, Building2, Target, Briefcase, Lightbulb, ExternalLink, RefreshCw } from 'lucide-react';
import { externalIntegrationService, ExternalProject } from '@/services/external-integrations';

interface SearchableSelectProps {
  label: string;
  placeholder: string;
  value?: string;
  onChange: (value: string) => void;
  onProjectSelect?: (projectData: {
    businessJustification: string;
    businessDomain: string;
    additionalContext: any;
  }) => void;
  disabled?: boolean;
}

export function SearchableSelect({ 
  label, 
  placeholder, 
  value = '', 
  onChange, 
  onProjectSelect,
  disabled = false 
}: SearchableSelectProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredItems, setFilteredItems] = useState<ExternalProject[]>([]);
  const [selectedItem, setSelectedItem] = useState<ExternalProject | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [allProjects, setAllProjects] = useState<ExternalProject[]>([]);

  // Load external projects on component mount
  useEffect(() => {
    loadExternalProjects();
  }, []);

  useEffect(() => {
    if (value) {
      const item = allProjects.find(item => item.name === value);
      setSelectedItem(item || null);
      setSearchTerm(value);
    }
  }, [value, allProjects]);

  useEffect(() => {
    if (searchTerm.length > 0) {
      const filtered = allProjects.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.businessDomain && item.businessDomain.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredItems(filtered);
      setIsOpen(true);
    } else {
      setFilteredItems([]);
      setIsOpen(false);
    }
  }, [searchTerm, allProjects]);

  const loadExternalProjects = async () => {
    setIsLoading(true);
    try {
      const projects = await externalIntegrationService.fetchProjectsFromExternal();
      setAllProjects(projects);
    } catch (error) {
      console.error('Failed to load external projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'product': return Target;
      case 'program': return Briefcase;
      case 'project': return Building2;
      default: return Lightbulb;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'product': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300';
      case 'program': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'project': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-300';
    }
  };

  const handleInputChange = (inputValue: string) => {
    setSearchTerm(inputValue);
    if (!inputValue) {
      setSelectedItem(null);
      onChange('');
    }
  };

  const handleItemSelect = async (item: ExternalProject) => {
    setSelectedItem(item);
    setSearchTerm(item.name);
    onChange(item.name);
    setIsOpen(false);

    // Auto-populate business justification and domain if callback provided
    if (onProjectSelect) {
      try {
        const projectData = await externalIntegrationService.syncAndPopulateProject(item.id);
        if (projectData) {
          onProjectSelect(projectData);
        }
      } catch (error) {
        console.error('Failed to sync project data:', error);
      }
    }
  };

  const handleClear = () => {
    setSelectedItem(null);
    setSearchTerm('');
    onChange('');
    setIsOpen(false);
  };

  const handleFocus = () => {
    if (searchTerm.length > 0) {
      setIsOpen(true);
    }
  };

  const handleBlur = () => {
    // Delay closing to allow for item selection
    setTimeout(() => setIsOpen(false), 150);
  };

  return (
    <div className="space-y-2 relative">
      <Label htmlFor={label}>{label}</Label>
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input
            id={label}
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled || isLoading}
            className="pl-10 pr-16 bg-white/70 dark:bg-slate-800/70"
          />
          <div className="absolute right-3 top-3 flex items-center space-x-1">
            {isLoading && <RefreshCw className="h-4 w-4 text-slate-400 animate-spin" />}
            {searchTerm && !isLoading && (
              <button
                onClick={handleClear}
                className="h-4 w-4 text-slate-400 hover:text-slate-600"
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Selected Item Display */}
        {selectedItem && (
          <div className="mt-2 space-y-2">
            <div className="flex items-center space-x-2">
              <Badge className={getTypeColor(selectedItem.type)} variant="outline">
                {React.createElement(getTypeIcon(selectedItem.type), { className: "h-3 w-3 mr-1" })}
                {selectedItem.name}
                <span className="ml-1 text-xs opacity-75">({selectedItem.type})</span>
              </Badge>
              {selectedItem.externalSystemType && (
                <Badge variant="outline" className="text-xs">
                  <ExternalLink className="h-2 w-2 mr-1" />
                  {selectedItem.externalSystemType.toUpperCase()}
                </Badge>
              )}
            </div>
            {selectedItem.businessJustification && (
              <div className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 p-2 rounded">
                <span className="font-medium">Business Justification:</span> {selectedItem.businessJustification}
              </div>
            )}
          </div>
        )}

        {/* Dropdown Results */}
        {isOpen && filteredItems.length > 0 && (
          <Card className="absolute top-full left-0 right-0 mt-1 z-50 shadow-lg border border-slate-200 dark:border-slate-700">
            <CardContent className="p-0 max-h-60 overflow-y-auto">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleItemSelect(item)}
                  className="p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 border-b border-slate-100 dark:border-slate-700 last:border-b-0"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getTypeColor(item.type)}`}>
                          {React.createElement(getTypeIcon(item.type), { className: "h-4 w-4" })}
                        </div>
                        <div>
                          <div className="font-medium text-slate-900 dark:text-white">
                            {item.name}
                          </div>
                          {item.description && (
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              {item.description}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Badge variant="outline" className="text-xs">
                          {item.type}
                        </Badge>
                        {item.externalSystemType && (
                          <Badge variant="outline" className="text-xs">
                            <ExternalLink className="h-2 w-2 mr-1" />
                            {item.externalSystemType.toUpperCase()}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {item.businessJustification && (
                      <div className="text-xs text-slate-600 dark:text-slate-400 pl-11">
                        <span className="font-medium">Justification:</span> {item.businessJustification.substring(0, 100)}...
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* No Results */}
        {isOpen && searchTerm.length > 0 && filteredItems.length === 0 && (
          <Card className="absolute top-full left-0 right-0 mt-1 z-50 shadow-lg border border-slate-200 dark:border-slate-700">
            <CardContent className="p-4 text-center text-slate-500 dark:text-slate-400">
              <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No programs, projects, or products found</p>
              <p className="text-xs mt-1">Try adjusting your search terms</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}