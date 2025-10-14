import { useRoute } from "wouter";
import { useState } from "react";
import { FileText } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GovernanceHeader } from "@/components/layout/governance-header";
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
      
      case "print-formats":
        return {
          title: "Print Story as PDF",
          description: "Professional PDF export formats for user stories with elegant layouts",
          items: [
            {
              id: "ARKPF-00001",
              title: "Executive Summary",
              description: "Clean, minimal layout emphasizing key information for leadership reviews and quick status updates",
              concept: "Essential Information Only",
              component: (
                <div className="w-full bg-white border rounded-lg p-3 text-xs">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded"></div>
                      <span className="font-bold text-[10px]">ARKHITEKTON</span>
                    </div>
                    <span className="font-mono text-[10px]">US-ABC123</span>
                  </div>
                  <div className="text-[9px] font-semibold mb-1 border-b pb-1">Story Title Here</div>
                  <div className="flex gap-1 mb-2">
                    <span className="bg-green-100 text-green-800 px-1 rounded text-[8px]">Done</span>
                    <span className="bg-orange-100 text-orange-800 px-1 rounded text-[8px]">High</span>
                    <span className="bg-blue-100 text-blue-800 px-1 rounded text-[8px]">5pts</span>
                  </div>
                  <div className="text-[8px] text-gray-600 leading-tight">
                    Given user wants feature<br/>
                    When action occurs<br/>
                    Then expected result
                  </div>
                </div>
              ),
              pros: ["Perfect for leadership", "Quick visual scan", "Minimal clutter", "Essential info only"],
              cons: ["Hides technical details", "Limited metadata"],
              status: "Active"
            },
            {
              id: "ARKPF-00002",
              title: "Technical Documentation",
              description: "Comprehensive layout showing all fields and details for developers and technical teams",
              concept: "Complete Information Archive",
              component: (
                <div className="w-full bg-white border rounded-lg p-3 text-xs">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-1 border-r pr-2 text-[8px]">
                      <div className="font-semibold mb-1">US-ABC123</div>
                      <div className="space-y-0.5 text-gray-600">
                        <div>Status: Done</div>
                        <div>Priority: High</div>
                        <div>Points: 5</div>
                        <div>Epic: E-001</div>
                      </div>
                    </div>
                    <div className="col-span-2 text-[8px]">
                      <div className="font-semibold mb-1">Description</div>
                      <div className="text-gray-600 mb-2">Story details here...</div>
                      <div className="font-semibold mb-1">Acceptance Criteria</div>
                      <div className="font-mono text-[7px] bg-gray-50 p-1 rounded">
                        Given...<br/>When...<br/>Then...
                      </div>
                    </div>
                  </div>
                </div>
              ),
              pros: ["All information visible", "Developer-friendly", "Audit trail included", "Code-ready format"],
              cons: ["Dense layout", "Longer print output"],
              status: "Active"
            },
            {
              id: "ARKPF-00003",
              title: "Presentation Format",
              description: "Visually striking design suitable for stakeholder presentations with large typography and strategic branding",
              concept: "Stakeholder Communication",
              component: (
                <div className="w-full bg-white border-2 border-orange-500 rounded-lg p-3">
                  <div className="border-l-4 border-orange-500 pl-2 mb-2">
                    <div className="text-[10px] font-bold">Story Title</div>
                    <div className="text-[8px] text-gray-600">US-ABC123</div>
                  </div>
                  <div className="bg-orange-50 rounded p-2 mb-2">
                    <div className="text-[8px] italic text-orange-900">
                      "As a user, I want feature, so that I can achieve value"
                    </div>
                  </div>
                  <div className="flex gap-2 text-[7px]">
                    <div className="bg-orange-500 text-white px-2 py-0.5 rounded">HIGH PRIORITY</div>
                    <div className="border border-orange-500 text-orange-600 px-2 py-0.5 rounded">5 POINTS</div>
                  </div>
                </div>
              ),
              pros: ["Visually impressive", "Great for presentations", "Clear narrative focus", "Strong branding"],
              cons: ["Less detailed", "Larger page count"],
              status: "Active"
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
      <div className="h-full overflow-hidden flex flex-col">
        <GovernanceHeader 
          moduleTitle="Design Option Detail" 
          moduleIcon={FileText} 
        />
        
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-2">Option Not Found</h2>
              <p className="text-muted-foreground">The requested design option could not be found.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-hidden flex flex-col">
      <GovernanceHeader 
        moduleTitle="Design Option Detail" 
        moduleIcon={FileText} 
      />
      
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-8">
            <p className="text-blue-800 dark:text-blue-200 text-sm">
              <strong>ARKHITEKTON Design Philosophy:</strong> Every design decision reflects our commitment to transforming 
              architectural complexity into elegant, understandable models that empower enterprise architects.
            </p>
          </div>

          {/* Options Grid */}
          <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-3">
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
          
          <div className="mt-12 text-center">
            <p className="text-muted-foreground text-sm">
              Click "Select Option" on your preferred choice to implement it throughout ARKHITEKTON
            </p>
          </div>
        </div>
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