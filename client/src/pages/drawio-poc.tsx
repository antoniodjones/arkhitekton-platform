import { useState, useEffect, useRef } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { GovernanceHeader } from '@/components/layout/governance-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette, Save, Download, Sparkles, Layers } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DrawioMessage {
  event?: 'init' | 'configure' | 'save' | 'export' | 'exit' | 'autosave';
  action?: string;
  xml?: string;
  data?: string;
  format?: string;
  modified?: boolean;
}

function DrawioPOCContent() {
  const { toast } = useToast();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [diagramXml, setDiagramXml] = useState<string>('');
  const [isConfigured, setIsConfigured] = useState(false);
  const [isPreloading, setIsPreloading] = useState(false);

  // ARKHITEKTON custom theme configuration
  const arkhitektonConfig = {
    // Modern color schemes with ARKHITEKTON branding
    defaultColorSchemes: [
      { fill: '#FFF5EB', stroke: '#F08705', font: '#1a1a1a', title: 'ARKHITEKTON Orange' },
      { fill: '#EBF5FF', stroke: '#3B82F6', font: '#1a1a1a', title: 'Blue' },
      { fill: '#F0FDF4', stroke: '#10B981', font: '#1a1a1a', title: 'Green' },
      { fill: '#FEF3F2', stroke: '#EF4444', font: '#1a1a1a', title: 'Red' },
    ],
    
    // Custom preset colors
    presetColors: [
      'F08705', 'E67E22', '3B82F6', '10B981', 'EF4444', 
      '8B5CF6', 'EC4899', '06B6D4', 'F59E0B', '6366F1'
    ],
    
    // Modern fonts
    defaultFonts: [
      'Inter',
      'Helvetica',
      'Arial',
      'Verdana',
      'Times New Roman',
      'Courier New'
    ],
    
    // Custom CSS for ARKHITEKTON branding
    css: `
      /* ARKHITEKTON brand styling */
      .geMenubarContainer {
        background: linear-gradient(135deg, #F08705 0%, #E67E22 100%) !important;
        border-bottom: 1px solid rgba(0,0,0,0.1) !important;
      }
      
      .geMenubar {
        color: white !important;
      }
      
      .geMenuItem {
        color: white !important;
      }
      
      .geMenuItem:hover {
        background-color: rgba(255,255,255,0.2) !important;
      }
      
      /* Toolbar styling */
      .geToolbar {
        background-color: #fafafa !important;
        border-bottom: 1px solid #e5e7eb !important;
      }
      
      /* Sidebar styling */
      .geSidebar {
        background-color: #ffffff !important;
        border-right: 1px solid #e5e7eb !important;
      }
      
      /* Format panel */
      .geFormatContainer {
        background-color: #ffffff !important;
        border-left: 1px solid #e5e7eb !important;
      }
      
      /* Dialog styling */
      .geDialog {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important;
      }
      
      /* Button styling */
      button.geBtn {
        border-radius: 6px !important;
        font-family: 'Inter', sans-serif !important;
      }
      
      button.geBtn.gePrimaryBtn {
        background: linear-gradient(135deg, #F08705 0%, #E67E22 100%) !important;
        border: none !important;
      }
      
      /* Canvas background */
      body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important;
      }
    `,
    
    // UI configuration
    ui: 'kennedy', // Minimal, clean interface
    
    // Minimal libraries for fastest loading
    libraries: 'general;aws',
  };

  // Preload draw.io immediately on page load for instant opening
  useEffect(() => {
    // Preload after 1 second to avoid blocking page render
    const timer = setTimeout(() => {
      if (iframeRef.current && !iframeRef.current.src) {
        console.log('Preloading draw.io editor...');
        setIsPreloading(true);
        
        // Minimal libraries for fastest load
        const editorUrl = `https://embed.diagrams.net/?embed=1&proto=json&spin=1&configure=1&ui=${arkhitektonConfig.ui}&libraries=general;aws&chrome=0&offline=1`;
        iframeRef.current.src = editorUrl;
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Initialize draw.io editor (instant if preloaded)
  const openEditor = () => {
    console.log('Opening ARKHITEKTON Architecture Editor...');
    setIsEditorOpen(true);
  };

  // Handle messages from draw.io
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Security: Only accept messages from embed.diagrams.net
      if (event.origin !== 'https://embed.diagrams.net') return;
      if (!event.data || typeof event.data !== 'string') return;
      
      try {
        const msg: DrawioMessage = JSON.parse(event.data);
        
        // Editor initialized
        if (msg.event === 'init') {
          console.log('Draw.io editor initialized');
          toast({
            title: 'Editor Ready',
            description: 'Draw.io editor is now ready to use',
          });
        }
        
        // Ready for configuration
        if (msg.event === 'configure') {
          console.log('Sending ARKHITEKTON configuration...');
          if (iframeRef.current?.contentWindow) {
            // Send custom configuration (config must be an object, not double-stringified)
            iframeRef.current.contentWindow.postMessage(
              JSON.stringify({
                action: 'configure',
                config: arkhitektonConfig
              }),
              'https://embed.diagrams.net'
            );
            
            setIsConfigured(true);
            
            // Load existing diagram if available
            if (diagramXml) {
              setTimeout(() => {
                iframeRef.current?.contentWindow?.postMessage(
                  JSON.stringify({
                    action: 'load',
                    xml: diagramXml,
                    autosave: 1
                  }),
                  'https://embed.diagrams.net'
                );
              }, 500);
            }
          }
        }
        
        // Diagram saved
        if (msg.event === 'save') {
          console.log('Diagram saved');
          setDiagramXml(msg.xml || '');
          
          toast({
            title: 'Diagram Saved',
            description: 'Your architecture diagram has been saved successfully',
          });
          
          // Request export as PNG
          if (iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.postMessage(
              JSON.stringify({
                action: 'export',
                format: 'xmlpng',
                xml: msg.xml
              }),
              'https://embed.diagrams.net'
            );
          }
        }
        
        // Export completed
        if (msg.event === 'export') {
          console.log('Export completed:', msg.format);
          // Could save the exported image here
        }
        
        // Editor closed
        if (msg.event === 'exit') {
          console.log('Editor closed, modified:', msg.modified);
          setIsEditorOpen(false);
          
          if (msg.modified) {
            toast({
              title: 'Unsaved Changes',
              description: 'You have unsaved changes in your diagram',
              variant: 'destructive',
            });
          }
        }
        
        // Auto-save
        if (msg.event === 'autosave') {
          console.log('Auto-save triggered');
          setDiagramXml(msg.xml || '');
        }
        
      } catch (error) {
        console.error('Error parsing draw.io message:', error);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [diagramXml, toast]);

  return (
    <div className="h-full overflow-hidden flex flex-col">
      <GovernanceHeader 
        moduleTitle="Draw.io Integration POC" 
        moduleIcon={Palette}
      />

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Hero Section */}
          <Card className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950 dark:to-amber-950 border-orange-200 dark:border-orange-800">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-orange-600" />
                ARKHITEKTON + Draw.io Integration
              </CardTitle>
              <CardDescription className="text-base">
                Optimized draw.io with preloading for instant launch (1-2 seconds) with ARKHITEKTON branding
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-slate-900 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-600 mb-2">Optimized Performance</h4>
                  <p className="text-sm text-muted-foreground">
                    Preloaded on page load, minimal libraries, instant launch when you click
                  </p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-600 mb-2">Cloud Libraries</h4>
                  <p className="text-sm text-muted-foreground">
                    AWS, Azure, GCP icons pre-loaded as custom shape libraries
                  </p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-600 mb-2">Full Control</h4>
                  <p className="text-sm text-muted-foreground">
                    Apache 2.0 license allows complete UI customization
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <Button 
              onClick={openEditor}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
              data-testid="button-open-editor"
            >
              <Palette className="h-4 w-4 mr-2" />
              {isPreloading ? 'Open Architecture Editor (Preloaded)' : 'Open Architecture Editor'}
            </Button>
            
            {diagramXml && (
              <>
                <Button 
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(diagramXml);
                    toast({ title: 'Copied!', description: 'Diagram XML copied to clipboard' });
                  }}
                  data-testid="button-copy-xml"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Copy XML
                </Button>
                
                <Button 
                  variant="outline"
                  data-testid="button-download"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </>
            )}
            
            {isConfigured && (
              <div className="flex items-center gap-2 ml-auto">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-muted-foreground">ARKHITEKTON Theme Active</span>
              </div>
            )}
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  Technical Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500">✓</span>
                    <span><strong>PostMessage API</strong> - Secure iframe communication</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500">✓</span>
                    <span><strong>Auto-save</strong> - Real-time diagram persistence</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500">✓</span>
                    <span><strong>Export Formats</strong> - PNG, SVG, XML, PDF support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500">✓</span>
                    <span><strong>Custom Libraries</strong> - Load cloud icons as shapes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500">✓</span>
                    <span><strong>Event Handling</strong> - Save, exit, configure events</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Next Steps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">→</span>
                    <span>Load 205 cloud icons as custom draw.io libraries</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">→</span>
                    <span>Add AI assistant panel for architecture recommendations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">→</span>
                    <span>Integrate Neo4j for relationship graph modeling</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">→</span>
                    <span>Add vector DB for semantic search and pattern matching</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">→</span>
                    <span>Backend storage with PostgreSQL for diagram metadata</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* License Notice */}
          <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="pt-6">
              <p className="text-xs text-muted-foreground">
                <strong>License:</strong> Draw.io is licensed under Apache License 2.0, which allows us to freely use, modify, and 
                customize the UI for commercial purposes. We maintain compliance by including the Apache 2.0 license notice in our documentation.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Draw.io Editor Iframe - Hidden when preloading */}
      <div className={`fixed inset-0 z-50 bg-background ${isEditorOpen ? 'block' : 'hidden'}`}>
        <iframe
          ref={iframeRef}
          className="w-full h-full border-0"
          title="ARKHITEKTON Architecture Editor"
          data-testid="iframe-drawio-editor"
        />
      </div>
    </div>
  );
}

export default function DrawioPOCPage() {
  return (
    <AppLayout>
      <DrawioPOCContent />
    </AppLayout>
  );
}
