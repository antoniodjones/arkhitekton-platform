import { useRoute } from "wouter";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AppLayout } from "@/components/layout/app-layout";

// Logo components (reusing from original design-options page)
function Option1Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-slate-600 rounded-full"></div>
      <div className="w-6 h-6 bg-slate-500 rounded"></div>
      <div className="w-5 h-5 bg-slate-400 rounded-full"></div>
      <div className="w-4 h-4 bg-slate-300 rounded"></div>
      <div className="flex gap-1">
        <div className="w-2 h-2 bg-slate-200 rounded-full"></div>
        <div className="w-2 h-2 bg-slate-200 rounded-full"></div>
        <div className="w-2 h-2 bg-slate-200 rounded-full"></div>
      </div>
    </div>
  );
}

function Option2Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-blue-600" style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}></div>
      <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
      <div className="w-5 h-5 bg-blue-400" style={{ clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)" }}></div>
      <div className="w-4 h-4 bg-blue-300 rounded"></div>
      <div className="flex gap-1">
        <div className="w-2 h-2 bg-blue-200 rounded-full"></div>
        <div className="w-2 h-2 bg-blue-200 rounded-full"></div>
        <div className="w-2 h-2 bg-blue-200 rounded-full"></div>
      </div>
    </div>
  );
}

function DeltaColorPalette() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-6 h-6 rounded" style={{ backgroundColor: "#003268" }}></div>
      <div className="w-6 h-6 rounded" style={{ backgroundColor: "#e3132c" }}></div>
      <div className="w-6 h-6 rounded" style={{ backgroundColor: "#9b1631" }}></div>
      <div className="w-6 h-6 bg-white border rounded"></div>
      <span className="text-sm font-medium ml-2">Delta Airlines</span>
    </div>
  );
}

function DesignOptionDetailContent() {
  const [, params] = useRoute("/design-options/:id");
  const optionId = params?.id;

  const getDetailContent = () => {
    switch (optionId) {
      case "logo-concepts":
        return {
          title: "Logo Design Concepts",
          description: "Architectural logo variations showing complexity to simplicity transformation",
          items: [
            {
              id: "ARKDD-00001",
              title: "Mixed Geometric Cascade",
              description: "Diverse architectural shapes (hexagon, circle, triangle, square) flowing from complex to simple. Shows systematic thinking and architectural diversity.",
              concept: "Architectural Diversity & System Organization",
              component: <Option1Logo />,
              pros: ["Clear shape variety", "Professional look", "Shows systematic approach"],
              cons: ["Might be too busy", "Complex to reproduce at small sizes"],
              status: "Proposed"
            },
            {
              id: "ARKDD-00002", 
              title: "Primary Geometric Flow",
              description: "Using triangle, circle, hexagon, and square in refined sequence with trailing dots",
              concept: "Geometric Harmony & Flow",
              component: <Option2Logo />,
              pros: ["Strong geometric foundation", "Clear progression", "Scalable design"],
              cons: ["More conventional approach", "Less distinctive"],
              status: "Active"
            }
          ]
        };
      
      case "color-palettes":
        return {
          title: "Color Palette Options",
          description: "Professional color schemes for strong American enterprise branding",
          items: [
            {
              id: "ARKCP-00001",
              title: "Delta Airlines Inspired",
              description: "Strong American branding with Delta Blue (#003268), Delta Red (#e3132c), and Burgundy (#9b1631). Conveys reliability, strength, and premium positioning.",
              concept: "American Enterprise Strength",
              component: <DeltaColorPalette />,
              pros: ["Strong American identity", "Premium positioning", "High contrast", "Professional reliability"],
              cons: ["Might be too bold for some contexts", "Strong brand association"],
              status: "New"
            },
            {
              id: "ARKCP-00002",
              title: "Corporate Blue Slate", 
              description: "Professional blue-gray palette with enterprise sophistication",
              concept: "Enterprise Sophistication",
              component: (
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-slate-700 rounded"></div>
                  <div className="w-6 h-6 bg-slate-500 rounded"></div>
                  <div className="w-6 h-6 bg-slate-300 rounded"></div>
                  <div className="w-6 h-6 bg-slate-100 border rounded"></div>
                  <span className="text-sm font-medium ml-2">Corporate Blue</span>
                </div>
              ),
              pros: ["Safe corporate choice", "Widely accepted", "Good accessibility"],
              cons: ["Less distinctive", "Common in tech industry"],
              status: "Proposed"
            }
          ]
        };
        
      case "typography":
        return {
          title: "Typography Systems",
          description: "Font hierarchy and text styling for enterprise architecture tools",
          items: [
            {
              id: "ARKTY-00001",
              title: "Inter + JetBrains Mono",
              description: "Modern sans-serif with technical monospace for code and data",
              concept: "Modern Technical Precision",
              component: (
                <div className="space-y-2">
                  <div style={{ fontFamily: "Inter, sans-serif" }} className="text-lg font-bold">Inter Heading</div>
                  <div style={{ fontFamily: "JetBrains Mono, monospace" }} className="text-sm">JetBrains Mono Code</div>
                </div>
              ),
              pros: ["Excellent readability", "Technical credibility", "Modern appearance"],
              cons: ["Requires font loading", "More complex setup"],
              status: "Proposed"
            }
          ]
        };
      
      default:
        return null;
    }
  };

  const content = getDetailContent();
  
  if (!content) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/design-options">
              <Button variant="ghost" size="sm" data-testid="back-to-options">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Design Options
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Option Not Found</h1>
              <p className="text-muted-foreground mt-2">The requested design option could not be found.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/design-options">
            <Button variant="ghost" size="sm" data-testid="back-to-options">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Design Options
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{content.title}</h1>
            <p className="text-muted-foreground mt-2">{content.description}</p>
          </div>
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-8">
          <p className="text-blue-800 dark:text-blue-200 text-sm">
            <strong>ARKHITEKTON Design Philosophy:</strong> Every design decision reflects our commitment to transforming 
            architectural complexity into elegant, understandable models that empower enterprise architects.
          </p>
        </div>
      </div>

      {/* Options Grid */}
      <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-1 lg:grid-cols-3">
        {content.items.map((item) => (
          <Card key={item.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <Badge variant="secondary" className="mb-2">
                  {item.id}
                </Badge>
              </div>
              
              {/* Design Display */}
              <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-6 mb-4 border-2 border-dashed border-slate-200 dark:border-slate-700">
                <div className="flex justify-center">
                  {item.component}
                </div>
              </div>
              
              <CardTitle className="text-xl">{item.title}</CardTitle>
              <CardDescription className="text-center">
                {item.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="bg-primary/5 rounded-lg p-3">
                <h4 className="font-medium text-primary mb-1">Core Concept</h4>
                <p className="text-sm text-muted-foreground">{item.concept}</p>
              </div>
              
              <div className="grid gap-3">
                <div>
                  <h4 className="font-medium text-green-600 dark:text-green-400 mb-1 text-sm">Strengths</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {item.pros.map((pro, index) => (
                      <li key={index} className="flex items-start gap-1">
                        <span className="text-green-500 mt-0.5">•</span>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-orange-600 dark:text-orange-400 mb-1 text-sm">Considerations</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {item.cons.map((con, index) => (
                      <li key={index} className="flex items-start gap-1">
                        <span className="text-orange-500 mt-0.5">•</span>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <Badge variant="outline" className={
                  item.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                  item.status === 'New' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                  'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                }>
                  {item.status}
                </Badge>
                
                <Button 
                  size="sm"
                  onClick={() => {
                    alert(`Selected ${item.id}: ${item.title}\\n\\nThis design option will be implemented!`);
                  }}
                  data-testid={`select-${item.id}`}
                >
                  Select Option
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="max-w-6xl mx-auto mt-12 text-center">
        <p className="text-muted-foreground text-sm">
          Click "Select Option" on your preferred choice to implement it throughout ARKHITEKTON
        </p>
      </div>
    </div>
  );
}

export default function DesignOptionDetailPage() {
  return (
    <AppLayout>
      <DesignOptionDetailContent />
    </AppLayout>
  );
}