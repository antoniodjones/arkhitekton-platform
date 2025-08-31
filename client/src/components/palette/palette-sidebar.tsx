import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Building, Box, Database, Server, Clock, Filter, ChevronDown, ChevronRight } from "lucide-react";
import { ArchimateElement } from "@/data/archimate-elements";
import { ElementCard } from "./element-card";

interface PaletteSidebarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedFramework: string;
  onFrameworkChange: (framework: string) => void;
  recentElements: ArchimateElement[];
  onElementSelect?: (element: ArchimateElement) => void;
}

export function PaletteSidebar({ 
  selectedCategory, 
  onCategoryChange, 
  selectedFramework,
  onFrameworkChange,
  recentElements,
  onElementSelect
}: PaletteSidebarProps) {
  const categories = [
    { id: 'business', name: 'Business Architecture', icon: Building },
    { id: 'application', name: 'Application & Integration', icon: Box },
    { id: 'data', name: 'Data & Information', icon: Database },
    { id: 'technology', name: 'Technology & Security', icon: Server },
  ];

  const frameworks = [
    { id: 'archimate', name: 'ArchiMate 3.0' },
    { id: 'togaf', name: 'TOGAF' },
    { id: 'bpmn', name: 'BPMN' },
  ];

  return (
    <aside className="w-80 bg-card border-r border-border flex flex-col">
      {/* Recently Used Section */}
      <div className="p-4 border-b border-border">
        <h3 className="text-sm font-medium text-foreground mb-3 flex items-center">
          <Clock className="h-4 w-4 text-muted-foreground mr-2" />
          Recently Used
        </h3>
        <div className="grid grid-cols-4 gap-2">
          {recentElements.slice(0, 4).map((element) => (
            <div key={element.id} className="aspect-square">
              <ElementCard 
                element={element} 
                onSelect={onElementSelect}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Framework Selection */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-2 mb-3">
          {frameworks.map((framework) => (
            <Button
              key={framework.id}
              variant={selectedFramework === framework.id ? "default" : "secondary"}
              size="sm"
              onClick={() => onFrameworkChange(framework.id)}
              className="text-xs"
              data-testid={`framework-${framework.id}`}
            >
              {framework.name}
            </Button>
          ))}
        </div>
        <div className="flex items-center text-xs text-muted-foreground">
          <Filter className="h-3 w-3 mr-2" />
          <span>Show: All Elements</span>
          <ChevronDown className="h-3 w-3 ml-auto" />
        </div>
      </div>

      {/* Category Navigation */}
      <nav className="flex-1 overflow-y-auto">
        <div className="p-2">
          <div className="space-y-1">
            {categories.map((category) => {
              const IconComponent = category.icon;
              const isSelected = selectedCategory === category.id;
              
              return (
                <Button
                  key={category.id}
                  variant={isSelected ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => onCategoryChange(category.id)}
                  data-testid={`category-${category.id}`}
                >
                  <IconComponent className="h-4 w-4 mr-3" />
                  {category.name}
                  {isSelected ? (
                    <ChevronDown className="h-4 w-4 ml-auto" />
                  ) : (
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  )}
                </Button>
              );
            })}
          </div>
        </div>
      </nav>
    </aside>
  );
}
