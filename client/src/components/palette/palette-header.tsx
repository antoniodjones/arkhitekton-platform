import { Search, Settings, HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PaletteHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function PaletteHeader({ searchQuery, onSearchChange }: PaletteHeaderProps) {
  return (
    <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <i className="fas fa-project-diagram text-primary-foreground text-sm"></i>
          </div>
          <h1 className="text-lg font-semibold text-foreground">ArchModel Pro</h1>
        </div>
        <div className="text-sm text-muted-foreground px-3 py-1 bg-muted rounded-md">
          Design Palette
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Input
            type="search"
            placeholder="Search elements..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 w-64"
            data-testid="search-input"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        </div>
        <Button variant="ghost" size="icon" title="View Options" data-testid="button-settings">
          <Settings className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" title="Help" data-testid="button-help">
          <HelpCircle className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
