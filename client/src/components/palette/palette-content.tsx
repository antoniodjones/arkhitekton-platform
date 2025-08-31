import { ArchimateElement } from "@/data/archimate-elements";
import { ElementCard } from "./element-card";
import { Building, Box, Database, Server, ALargeSmall, List } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaletteContentProps {
  selectedCategory: string;
  selectedFramework: string;
  filteredElements: ArchimateElement[];
  searchQuery: string;
  onElementSelect?: (element: ArchimateElement) => void;
  selectedElement?: ArchimateElement;
}

export function PaletteContent({ 
  selectedCategory, 
  selectedFramework,
  filteredElements, 
  searchQuery,
  onElementSelect,
  selectedElement
}: PaletteContentProps) {
  const getCategoryInfo = (category: string) => {
    switch (category) {
      case 'business':
        return {
          title: 'Business Architecture Elements',
          description: 'Organizational structure elements, process flows, capability models, and value streams for business architecture modeling.',
          icon: Building,
          color: 'hsl(142 76% 36%)'
        };
      case 'application':
        return {
          title: 'Application & Integration Elements',
          description: 'Application components, interfaces, services, and integration patterns for application architecture modeling.',
          icon: Box,
          color: 'hsl(199 89% 48%)'
        };
      case 'data':
        return {
          title: 'Data & Information Elements',
          description: 'Data entities, flows, stores, and information concepts for data architecture modeling.',
          icon: Database,
          color: 'hsl(262 83% 58%)'
        };
      case 'technology':
        return {
          title: 'Technology & Security Elements',
          description: 'Infrastructure components, platforms, devices, and security elements for technology architecture modeling.',
          icon: Server,
          color: 'hsl(48 96% 53%)'
        };
      default:
        return {
          title: 'Architecture Elements',
          description: 'Enterprise architecture modeling elements.',
          icon: Building,
          color: 'hsl(142 76% 36%)'
        };
    }
  };

  const categoryInfo = getCategoryInfo(selectedCategory);
  const IconComponent = categoryInfo.icon;

  // Group elements by type
  const groupedElements = filteredElements.reduce((acc, element) => {
    const type = element.type;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(element);
    return acc;
  }, {} as Record<string, ArchimateElement[]>);

  const getTypeInfo = (type: string) => {
    switch (type) {
      case 'structural':
        return { title: 'Active Structure Elements', label: 'Structural', color: categoryInfo.color };
      case 'behavioral':
        return { title: 'Behavior Elements', label: 'Behavioral', color: 'hsl(173 58% 39%)' };
      case 'passive':
        return { title: 'Passive Structure Elements', label: 'Passive', color: 'hsl(197 37% 24%)' };
      case 'motivational':
        return { title: 'Motivational Elements', label: 'Motivational', color: 'hsl(43 74% 66%)' };
      default:
        return { title: 'Other Elements', label: 'Other', color: categoryInfo.color };
    }
  };

  if (filteredElements.length === 0) {
    return (
      <main className="flex-1 bg-background overflow-y-auto flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-4xl text-muted-foreground">🔍</div>
          <h3 className="text-lg font-medium text-foreground">No elements found</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            {searchQuery 
              ? `No elements match "${searchQuery}". Try adjusting your search terms.`
              : `No elements available for ${selectedFramework.toUpperCase()} framework in ${selectedCategory} category.`
            }
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-background overflow-y-auto archmodel-grid">
      <div className="p-6">
        {/* Section Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold text-foreground flex items-center">
              <IconComponent 
                className="mr-3 h-5 w-5" 
                style={{ color: categoryInfo.color }} 
              />
              {categoryInfo.title}
            </h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground" data-testid="text-element-count">
                {filteredElements.length} elements
              </span>
              <Button variant="ghost" size="icon">
                <ALargeSmall className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{categoryInfo.description}</p>
        </div>

        {/* Element Groups */}
        {Object.entries(groupedElements).map(([type, elements]) => {
          const typeInfo = getTypeInfo(type);
          
          return (
            <div key={type} className="mb-8">
              <div className="flex items-center mb-4">
                <div 
                  className="w-4 h-4 mr-3 rounded-sm"
                  style={{ backgroundColor: typeInfo.color }}
                />
                <h3 className="text-lg font-medium text-foreground">{typeInfo.title}</h3>
                <span className="ml-2 px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                  {typeInfo.label}
                </span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {elements.map((element) => (
                  <ElementCard
                    key={element.id}
                    element={element}
                    onSelect={onElementSelect}
                    isSelected={selectedElement?.id === element.id}
                  />
                ))}
              </div>
            </div>
          );
        })}

        {/* Relationships Section for ArchiMate */}
        {selectedFramework === 'archimate' && (
          <div className="mt-8">
            <div className="flex items-center mb-4">
              <div className="w-4 h-4 bg-muted-foreground mr-3 rounded-full" />
              <h3 className="text-lg font-medium text-foreground">Relationships & Connectors</h3>
              <span className="ml-2 px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                Connectors
              </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {/* Relationship examples */}
              <div className="p-4 bg-card border border-border rounded-lg hover:shadow-md transition-all duration-200 cursor-grab">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-2 bg-muted-foreground mb-3 relative">
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-muted-foreground border-t-2 border-t-transparent border-b-2 border-b-transparent"></div>
                  </div>
                  <span className="text-sm font-medium text-foreground mb-1">Association</span>
                  <span className="text-xs text-muted-foreground">Unspecified relation</span>
                </div>
              </div>
              
              <div className="p-4 bg-card border border-border rounded-lg hover:shadow-md transition-all duration-200 cursor-grab">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-2 mb-3 relative" style={{ backgroundColor: 'hsl(12 76% 61%)' }}>
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-t-2 border-t-transparent border-b-2 border-b-transparent" style={{ borderLeftColor: 'hsl(12 76% 61%)' }}></div>
                  </div>
                  <span className="text-sm font-medium text-foreground mb-1">Assignment</span>
                  <span className="text-xs text-muted-foreground">Allocation link</span>
                </div>
              </div>

              <div className="p-4 bg-card border border-border rounded-lg hover:shadow-md transition-all duration-200 cursor-grab">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-2 mb-3 relative" style={{ backgroundColor: 'hsl(173 58% 39%)' }}>
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-t-2 border-t-transparent border-b-2 border-b-transparent" style={{ borderLeftColor: 'hsl(173 58% 39%)' }}></div>
                  </div>
                  <span className="text-sm font-medium text-foreground mb-1">Realization</span>
                  <span className="text-xs text-muted-foreground">Fulfillment link</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
