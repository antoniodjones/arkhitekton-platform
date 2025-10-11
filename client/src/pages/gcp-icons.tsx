import { useState, useMemo, useEffect } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { GovernanceHeader } from '@/components/layout/governance-header';
import { Cloud, Search, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface IconManifest {
  core: string[];
  category: string[];
  downloadedAt: string;
  source: string;
}

function formatIconName(filename: string): string {
  return filename
    .replace(/-512-color(-rgb)?\.svg$/, '')
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .trim();
}

function GCPIconsContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('core');
  const [manifest, setManifest] = useState<IconManifest | null>(null);

  // Load icon manifest
  useEffect(() => {
    fetch('/icons/gcp/manifest.json')
      .then(res => res.json())
      .then(data => setManifest(data))
      .catch(err => {
        console.error('Failed to load icon manifest:', err);
        // Fallback to empty manifest
        setManifest({ core: [], category: [], downloadedAt: '', source: '' });
      });
  }, []);

  const filteredCoreIcons = useMemo(() => {
    if (!manifest) return [];
    if (!searchQuery) return manifest.core;
    return manifest.core.filter(icon =>
      formatIconName(icon).toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [manifest, searchQuery]);

  const filteredCategoryIcons = useMemo(() => {
    if (!manifest) return [];
    if (!searchQuery) return manifest.category;
    return manifest.category.filter(icon =>
      formatIconName(icon).toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [manifest, searchQuery]);

  const IconCard = ({ filename, type }: { filename: string; type: 'core' | 'category' }) => (
    <div className="flex flex-col items-center p-4 border rounded-lg hover:shadow-lg transition-shadow bg-card group" data-testid={`icon-card-${filename}`}>
      <div className="w-24 h-24 flex items-center justify-center mb-3 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-lg p-4 group-hover:scale-110 transition-transform">
        <img 
          src={`/icons/gcp/${type}/${filename}`} 
          alt={formatIconName(filename)}
          className="w-full h-full object-contain"
        />
      </div>
      <p className="text-sm font-medium text-center text-foreground">{formatIconName(filename)}</p>
      <Badge variant="outline" className="mt-2 text-xs">
        {type === 'core' ? 'Product' : 'Category'}
      </Badge>
    </div>
  );

  if (!manifest) {
    return (
      <div className="h-full overflow-hidden flex flex-col">
        <GovernanceHeader 
          moduleTitle="Google Cloud Icons" 
          moduleIcon={Cloud} 
        />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading icons...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-hidden flex flex-col">
      <GovernanceHeader 
        moduleTitle="Google Cloud Icons" 
        moduleIcon={Cloud} 
      />

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Google Cloud Platform Icons</h1>
                <p className="text-muted-foreground">
                  Official Google Cloud SVG icons from{' '}
                  <a href={manifest.source} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    cloud.google.com/icons
                  </a>
                </p>
                {manifest.downloadedAt && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Last updated: {new Date(manifest.downloadedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
              <Button variant="outline" size="sm" asChild>
                <a href="https://cloud.google.com/icons" target="_blank" rel="noopener noreferrer">
                  <Download className="h-4 w-4 mr-2" />
                  Download More
                </a>
              </Button>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search icons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-icon-search"
              />
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="core" data-testid="tab-core-icons">
                Core Products ({filteredCoreIcons.length})
              </TabsTrigger>
              <TabsTrigger value="category" data-testid="tab-category-icons">
                Categories ({filteredCategoryIcons.length})
              </TabsTrigger>
              <TabsTrigger value="all" data-testid="tab-all-icons">
                All ({filteredCoreIcons.length + filteredCategoryIcons.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="core" className="mt-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {filteredCoreIcons.map((icon) => (
                  <IconCard key={icon} filename={icon} type="core" />
                ))}
              </div>
              {filteredCoreIcons.length === 0 && (
                <p className="text-center text-muted-foreground py-12">No icons found matching "{searchQuery}"</p>
              )}
            </TabsContent>

            <TabsContent value="category" className="mt-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {filteredCategoryIcons.map((icon) => (
                  <IconCard key={icon} filename={icon} type="category" />
                ))}
              </div>
              {filteredCategoryIcons.length === 0 && (
                <p className="text-center text-muted-foreground py-12">No icons found matching "{searchQuery}"</p>
              )}
            </TabsContent>

            <TabsContent value="all" className="mt-6">
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Core Products</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                    {filteredCoreIcons.map((icon) => (
                      <IconCard key={icon} filename={icon} type="core" />
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Categories</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                    {filteredCategoryIcons.map((icon) => (
                      <IconCard key={icon} filename={icon} type="category" />
                    ))}
                  </div>
                </div>
              </div>
              {(filteredCoreIcons.length + filteredCategoryIcons.length) === 0 && (
                <p className="text-center text-muted-foreground py-12">No icons found matching "{searchQuery}"</p>
              )}
            </TabsContent>
          </Tabs>

          {/* Stats */}
          <div className="flex gap-6 pt-6 border-t">
            <div>
              <p className="text-2xl font-bold text-foreground">{manifest.core.length}</p>
              <p className="text-sm text-muted-foreground">Core Product Icons</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{manifest.category.length}</p>
              <p className="text-sm text-muted-foreground">Category Icons</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{manifest.core.length + manifest.category.length}</p>
              <p className="text-sm text-muted-foreground">Total Icons</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GCPIconsPage() {
  return (
    <AppLayout>
      <GCPIconsContent />
    </AppLayout>
  );
}
