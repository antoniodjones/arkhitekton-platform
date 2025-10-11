import { useState, useMemo, useEffect } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { GovernanceHeader } from '@/components/layout/governance-header';
import { Cloud, Search, Download, Server } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface VendorData {
  name: string;
  icons: string[];
  count: number;
}

interface IconManifest {
  vendors: {
    [key: string]: VendorData;
  };
  downloadedAt: string;
  sources: {
    [key: string]: string;
  };
}

function formatIconName(filename: string): string {
  return filename
    .replace(/-512-color(-rgb)?\.svg$/, '')
    .replace(/Arch_|_16\.svg$/, '')
    .replace(/_/g, ' ')
    .replace(/-/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .trim();
}

function getVendorColor(vendor: string) {
  const colors = {
    gcp: 'from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900',
    aws: 'from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900',
    azure: 'from-sky-50 to-sky-100 dark:from-sky-950 dark:to-sky-900',
    ibm: 'from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900',
    oracle: 'from-red-50 to-red-100 dark:from-red-950 dark:to-red-900'
  };
  return colors[vendor as keyof typeof colors] || 'from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900';
}

function getVendorIcon(vendor: string) {
  // Use simple cloud/server icons for now
  return <Cloud className="h-3 w-3" />;
}

function CloudIconsContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeVendor, setActiveVendor] = useState('all');
  const [manifest, setManifest] = useState<IconManifest | null>(null);

  useEffect(() => {
    fetch('/icons/cloud/manifest.json')
      .then(res => res.json())
      .then(data => setManifest(data))
      .catch(err => {
        console.error('Failed to load icon manifest:', err);
        setManifest({ vendors: {}, downloadedAt: '', sources: {} });
      });
  }, []);

  const filteredIcons = useMemo(() => {
    if (!manifest) return [];
    
    const result: Array<{ vendor: string; vendorName: string; icon: string }> = [];
    
    Object.entries(manifest.vendors).forEach(([vendorKey, vendorData]) => {
      if (activeVendor !== 'all' && activeVendor !== vendorKey) return;
      
      vendorData.icons.forEach(icon => {
        if (!searchQuery || formatIconName(icon).toLowerCase().includes(searchQuery.toLowerCase())) {
          result.push({
            vendor: vendorKey,
            vendorName: vendorData.name,
            icon
          });
        }
      });
    });
    
    return result;
  }, [manifest, searchQuery, activeVendor]);

  const IconCard = ({ vendor, icon }: { vendor: string; icon: string }) => (
    <div className="flex flex-col items-center p-4 border rounded-lg hover:shadow-lg transition-shadow bg-card group" data-testid={`icon-card-${vendor}-${icon}`}>
      <div className={`w-24 h-24 flex items-center justify-center mb-3 bg-gradient-to-br ${getVendorColor(vendor)} rounded-lg p-4 group-hover:scale-110 transition-transform`}>
        <img 
          src={`/icons/cloud/${vendor}/${icon}`} 
          alt={formatIconName(icon)}
          className="w-full h-full object-contain"
        />
      </div>
      <p className="text-sm font-medium text-center text-foreground mb-1">{formatIconName(icon)}</p>
      <Badge variant="outline" className="flex items-center gap-1 text-xs">
        {getVendorIcon(vendor)}
        <span>{manifest?.vendors[vendor]?.name}</span>
      </Badge>
    </div>
  );

  if (!manifest) {
    return (
      <div className="h-full overflow-hidden flex flex-col">
        <GovernanceHeader 
          moduleTitle="Cloud Icons" 
          moduleIcon={Cloud} 
        />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading icons...</p>
        </div>
      </div>
    );
  }

  const totalIcons = Object.values(manifest.vendors).reduce((sum, v) => sum + v.count, 0);

  return (
    <div className="h-full overflow-hidden flex flex-col">
      <GovernanceHeader 
        moduleTitle="Cloud Icons" 
        moduleIcon={Cloud} 
      />

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Cloud Architecture Icons</h1>
                <p className="text-muted-foreground">
                  Official architecture icons from AWS, Azure, Google Cloud, and IBM Cloud
                </p>
                {manifest.downloadedAt && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Last updated: {new Date(manifest.downloadedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>

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

          <Tabs value={activeVendor} onValueChange={setActiveVendor}>
            <TabsList>
              <TabsTrigger value="all" data-testid="tab-all-vendors">
                All ({filteredIcons.length})
              </TabsTrigger>
              {Object.entries(manifest.vendors).map(([key, data]) => (
                <TabsTrigger key={key} value={key} data-testid={`tab-vendor-${key}`}>
                  <span className="flex items-center gap-2">
                    {getVendorIcon(key)}
                    {data.name} ({activeVendor === key ? filteredIcons.length : data.count})
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={activeVendor} className="mt-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {filteredIcons.map(({ vendor, icon }, index) => (
                  <IconCard key={`${vendor}-${icon}-${index}`} vendor={vendor} icon={icon} />
                ))}
              </div>
              {filteredIcons.length === 0 && (
                <p className="text-center text-muted-foreground py-12">
                  No icons found matching "{searchQuery}"
                </p>
              )}
            </TabsContent>
          </Tabs>

          <div className="flex gap-6 pt-6 border-t">
            {Object.entries(manifest.vendors).map(([key, data]) => (
              <div key={key}>
                <div className="flex items-center gap-2 mb-1">
                  {getVendorIcon(key)}
                  <p className="text-2xl font-bold text-foreground">{data.count}</p>
                </div>
                <p className="text-sm text-muted-foreground">{data.name} Icons</p>
              </div>
            ))}
            <div className="border-l pl-6">
              <p className="text-2xl font-bold text-foreground">{totalIcons}</p>
              <p className="text-sm text-muted-foreground">Total Icons</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CloudIconsPage() {
  return (
    <AppLayout>
      <CloudIconsContent />
    </AppLayout>
  );
}
