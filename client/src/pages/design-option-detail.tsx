import { useRoute } from "wouter";
import { useState } from "react";
import { FileText, Monitor } from "lucide-react";
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

// Layout Option Wireframes
function FigmaStyleLayout() {
  return (
    <div className="w-full h-40 bg-white border rounded-lg flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-50 border-r p-2 flex flex-col gap-2">
        <div className="h-4 w-4 bg-gray-300 rounded mb-2"></div>
        <div className="h-2 w-3/4 bg-gray-200 rounded"></div>
        <div className="h-2 w-1/2 bg-gray-200 rounded"></div>
        <div className="mt-auto h-2 w-full bg-gray-200 rounded"></div>
      </div>
      {/* Main Content */}
      <div className="flex-1 p-3">
        <div className="flex justify-between mb-4">
          <div className="h-3 w-1/3 bg-gray-200 rounded"></div>
          <div className="h-6 w-20 bg-orange-100 rounded"></div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="h-16 border rounded bg-gray-50"></div>
          <div className="h-16 border rounded bg-gray-50"></div>
          <div className="h-16 border rounded bg-gray-50"></div>
        </div>
      </div>
    </div>
  );
}

function MuralStyleLayout() {
  return (
    <div className="w-full h-40 bg-white border rounded-lg flex overflow-hidden">
      {/* Left Nav */}
      <div className="w-12 bg-gray-800 flex flex-col items-center py-2 gap-2">
        <div className="w-6 h-6 bg-white/20 rounded"></div>
        <div className="w-6 h-6 bg-white/20 rounded"></div>
        <div className="w-6 h-6 bg-white/20 rounded"></div>
      </div>
      {/* Main Content - Card Grid */}
      <div className="flex-1 p-4 bg-gray-50">
        <div className="h-8 w-full bg-white rounded border mb-4 flex items-center px-2">
          <div className="w-4 h-4 bg-gray-200 rounded"></div>
        </div>
        <div className="flex gap-3 overflow-x-auto">
          <div className="w-24 h-20 bg-white border rounded shadow-sm shrink-0"></div>
          <div className="w-24 h-20 bg-white border rounded shadow-sm shrink-0"></div>
          <div className="w-24 h-20 bg-white border rounded shadow-sm shrink-0"></div>
        </div>
      </div>
    </div>
  );
}

function MiroStyleLayout() {
  return (
    <div className="w-full h-40 bg-white border rounded-lg flex overflow-hidden">
      {/* Team Sidebar */}
      <div className="w-10 bg-indigo-900 flex flex-col items-center py-2 gap-2">
        <div className="w-6 h-6 bg-white/20 rounded"></div>
      </div>
      {/* Project Sidebar */}
      <div className="w-32 bg-gray-50 border-r p-2">
        <div className="h-3 w-full bg-gray-200 rounded mb-2"></div>
        <div className="h-2 w-3/4 bg-gray-200 rounded mb-1"></div>
        <div className="h-2 w-3/4 bg-gray-200 rounded mb-1"></div>
      </div>
      {/* Content */}
      <div className="flex-1 p-3">
        <div className="flex justify-between items-center mb-3">
          <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
          <div className="h-5 w-16 bg-blue-100 rounded"></div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="h-12 border bg-yellow-50 rounded"></div>
          <div className="h-12 border bg-blue-50 rounded"></div>
          <div className="h-12 border bg-green-50 rounded"></div>
          <div className="h-12 border bg-purple-50 rounded"></div>
        </div>
      </div>
    </div>
  );
}

function EnterpriseLayout() {
  return (
    <div className="w-full h-40 bg-gray-50 border rounded-lg flex flex-col overflow-hidden">
      {/* Top Nav */}
      <div className="h-8 bg-white border-b flex items-center px-3 justify-between">
        <div className="w-20 h-3 bg-gray-200 rounded"></div>
        <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
      </div>
      {/* Dashboard Content */}
      <div className="flex-1 p-3 grid grid-cols-2 gap-3">
        {/* Widget 1 */}
        <div className="bg-white border rounded p-2">
          <div className="h-2 w-1/2 bg-gray-200 rounded mb-2"></div>
          <div className="h-8 w-full bg-blue-50 rounded"></div>
        </div>
        {/* Widget 2 */}
        <div className="bg-white border rounded p-2">
          <div className="h-2 w-1/2 bg-gray-200 rounded mb-2"></div>
          <div className="space-y-1">
            <div className="h-2 w-full bg-gray-100 rounded"></div>
            <div className="h-2 w-full bg-gray-100 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HybridLayout() {
  return (
    <div className="w-full h-40 bg-white border rounded-lg flex flex-col overflow-hidden">
      {/* Hero Search */}
      <div className="h-16 bg-gradient-to-r from-orange-50 to-amber-50 flex items-center justify-center border-b">
        <div className="w-1/2 h-6 bg-white border rounded shadow-sm"></div>
      </div>
      {/* Visual Grid */}
      <div className="p-3">
        <div className="h-2 w-1/4 bg-gray-200 rounded mb-2"></div>
        <div className="flex gap-3">
          <div className="w-24 h-16 bg-white border rounded-lg shadow-md hover:scale-105 transition-transform"></div>
          <div className="w-24 h-16 bg-white border rounded-lg shadow-md hover:scale-105 transition-transform"></div>
          <div className="w-24 h-16 bg-white border rounded-lg shadow-md hover:scale-105 transition-transform"></div>
        </div>
      </div>
    </div>
  );
}

function IdeStyleLayout() {
  return (
    <div className="w-full h-40 bg-gray-900 border rounded-lg flex overflow-hidden">
      {/* Activity Bar */}
      <div className="w-10 bg-gray-800 flex flex-col items-center py-2 gap-3 border-r border-gray-700">
        <div className="w-5 h-5 bg-blue-500 rounded"></div>
        <div className="w-5 h-5 bg-gray-600 rounded"></div>
        <div className="w-5 h-5 bg-gray-600 rounded"></div>
      </div>
      {/* Explorer Sidebar */}
      <div className="w-32 bg-gray-800 border-r border-gray-700 p-2 flex flex-col">
        <div className="h-3 w-16 bg-gray-600 rounded mb-2"></div>
        <div className="space-y-1">
          <div className="h-2 w-full bg-blue-500/20 rounded"></div>
          <div className="h-2 w-3/4 bg-gray-700 rounded ml-2"></div>
          <div className="h-2 w-3/4 bg-gray-700 rounded ml-2"></div>
        </div>
      </div>
      {/* Editor Area */}
      <div className="flex-1 flex flex-col bg-gray-900">
        <div className="h-6 bg-gray-800 border-b border-gray-700 flex px-1 gap-1 items-end">
          <div className="h-5 w-24 bg-gray-900 rounded-t border-t border-x border-gray-700"></div>
          <div className="h-5 w-24 bg-gray-800 rounded-t border-t border-x border-transparent opacity-50"></div>
        </div>
        <div className="flex-1 p-2 grid grid-cols-2 gap-2">
          <div className="border border-gray-700 rounded bg-gray-800/50"></div>
          <div className="border border-gray-700 rounded bg-gray-800/50"></div>
        </div>
        {/* Terminal/Lower Panel */}
        <div className="h-10 border-t border-gray-700 bg-gray-800 p-1">
          <div className="h-2 w-full bg-gray-700 rounded mb-1"></div>
          <div className="h-2 w-1/2 bg-gray-700 rounded"></div>
        </div>
      </div>
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

      case "canvas-dashboard-layouts":
        return {
          title: "Canvas Dashboard Layouts",
          description: "Proposed landing page layouts inspired by industry leaders to balance B2B complexity with B2C usability",
          items: [
            {
              id: "ARKDL-00001",
              title: "The 'File & Community' Hub",
              description: "Inspired by Figma. Prioritizes a clean grid of recent files while giving equal weight to 'Community' and 'Templates' in the sidebar.",
              concept: "Figma-Style: File Centric + Community",
              component: <FigmaStyleLayout />,
              pros: [
                "Familiar to designers",
                "Great for managing many files",
                "Promotes template reuse (Community)",
                "Scales for Enterprise (Teams in sidebar)"
              ],
              cons: ["Can feel like a file system", "Less emphasis on 'Quick Start'"],
              status: "Proposed"
            },
            {
              id: "ARKDL-00002",
              title: "The 'Infinite Start'",
              description: "Inspired by Mural. A clean, spacious landing page that emphasizes immediate creation. Large 'Create' buttons and a horizontal scrolling list of templates.",
              concept: "Mural-Style: Action Oriented",
              component: <MuralStyleLayout />,
              pros: [
                "Extremely low barrier to entry",
                "Fun and inviting (B2C feel)",
                "Visual focus on templates",
                "Less clutter"
              ],
              cons: ["Might hide advanced enterprise features", "Browsing archives can be harder"],
              status: "Proposed"
            },
            {
              id: "ARKDL-00003",
              title: "The 'Workspace Commander'",
              description: "Inspired by Miro. A structured three-pane layout: Teams/Spaces on far left, Project/Folder tree in middle, and Board Grid on right.",
              concept: "Miro-Style: Structured Organization",
              component: <MiroStyleLayout />,
              pros: [
                "Perfect for complex organizational hierarchies (B2B)",
                "Separates 'Team' from 'Project'",
                "Very organized feel"
              ],
              cons: ["Higher cognitive load", "Requires navigating hierarchy to find files"],
              status: "Proposed"
            },
            {
              id: "ARKDL-00004",
              title: "The 'Enterprise Command Center'",
              description: "A traditional B2B dashboard approach. Instead of just files, it shows 'My Tasks', 'Pending Approvals', and 'Recent Activity' feeds alongside diagrams.",
              concept: "Enterprise Task-Based",
              component: <EnterpriseLayout />,
              pros: [
                "Integrates with Governance workflows",
                "Shows 'What needs my attention'",
                "Feels like a serious business tool"
              ],
              cons: ["Can feel cluttered", "Less inspiring for creativity", "Rigid structure"],
              status: "Proposed"
            },
            {
              id: "ARKDL-00005",
              title: "The 'Visual Curator' (Recommended)",
              description: "A hybrid approach. Features a large, centralized 'Hero Search' bar (Google style) above a beautiful, curated grid of diagrams. Hides folder complexity behind smart search.",
              concept: "Hybrid B2C/B2B: Search-First",
              component: <HybridLayout />,
              pros: [
                "Cleanest aesthetic (Apple-like)",
                "Search-first behavior suits power users",
                "Visual previews emphasize diagram beauty",
                "Hides 'Enterprise Bloat' until needed"
              ],
              cons: ["Relies heavily on good search", "Files might feel 'lost' without folder tree"],
              status: "Proposed"
            },
            {
              id: "ARKDL-00006",
              title: "The 'Architect's IDE'",
              description: "Inspired by VS Code. A dense, high-utility layout for power users. Features a dedicated file explorer sidebar, a tabbed interface for open diagrams, and a properties/terminal panel.",
              concept: "Developer-Centric: Dense & Functional",
              component: <IdeStyleLayout />,
              pros: [
                "Familiar to developers/engineers",
                "Maximal information density",
                "Multi-tab support for context switching",
                "Integrated terminal/logs view"
              ],
              cons: ["Steep learning curve", "Not welcoming to business users", "Busy interface"],
              status: "New"
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
                    Given user wants feature<br />
                    When action occurs<br />
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
                        Given...<br />When...<br />Then...
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

      case "wiki-landing-pages":
        return {
          title: "Wiki Landing Page Prototypes",
          description: "Twelve distinct visual styles for the Wiki Knowledge Core landing page - exploring different aesthetics from brutalist to geometric, and now including Gemini 3.5 AI-generated concepts.",
          items: [
            {
              id: "ARKWL-00001",
              title: "Option 1: Brutalist",
              description: "Bold, raw, and functional design with strong typography and clear hierarchy. Emphasizes content over decoration.",
              concept: "Functional Minimalism",
              source: "Claude Code",
              component: (
                <div className="w-full h-32 bg-white border-4 border-black rounded-none p-4 font-mono">
                  <div className="text-xl font-bold mb-2">WIKI</div>
                  <div className="space-y-1">
                    <div className="h-2 w-3/4 bg-black"></div>
                    <div className="h-2 w-1/2 bg-black"></div>
                    <div className="h-2 w-2/3 bg-black"></div>
                  </div>
                </div>
              ),
              pros: ["Strong visual impact", "Clear hierarchy", "Fast loading", "Distinctive identity"],
              cons: ["May feel too harsh", "Limited visual warmth"],
              status: "Proposed",
              htmlFile: "docs/Wiki_files_001/Wiki_Landing_Option_1_Brutalist.html"
            },
            {
              id: "ARKWL-00002",
              title: "Option 2: Organic",
              description: "Soft shapes, natural colors, and fluid layouts for a more inviting and approachable feel.",
              concept: "Natural & Approachable",
              source: "Claude Code",
              component: (
                <div className="w-full h-32 bg-gradient-to-br from-green-50 to-blue-50 rounded-3xl p-4">
                  <div className="text-lg font-semibold text-green-800 mb-2">Wiki</div>
                  <div className="space-y-2">
                    <div className="h-2 w-3/4 bg-green-200 rounded-full"></div>
                    <div className="h-2 w-1/2 bg-blue-200 rounded-full"></div>
                    <div className="h-2 w-2/3 bg-teal-200 rounded-full"></div>
                  </div>
                </div>
              ),
              pros: ["Welcoming feel", "Reduced cognitive load", "Pleasant aesthetics", "Modern curves"],
              cons: ["May seem less professional", "Harder to maintain consistency"],
              status: "Proposed",
              htmlFile: "docs/Wiki_files_001/Wiki_Landing_Option_2_Organic.html"
            },
            {
              id: "ARKWL-00003",
              title: "Option 3: Minimal",
              description: "Clean lines, ample whitespace, and essential elements for a focused and elegant experience.",
              concept: "Less is More",
              source: "Claude Code",
              component: (
                <div className="w-full h-32 bg-white border rounded-lg p-6">
                  <div className="text-sm font-light text-gray-400 mb-4">wiki</div>
                  <div className="space-y-3">
                    <div className="h-px w-1/2 bg-gray-200"></div>
                    <div className="h-px w-1/3 bg-gray-200"></div>
                  </div>
                </div>
              ),
              pros: ["Maximum focus", "Timeless design", "Fast performance", "Professional"],
              cons: ["May feel too sparse", "Requires perfect content"],
              status: "Proposed",
              htmlFile: "docs/Wiki_files_001/Wiki_Landing_Option_3_Minimal.html"
            },
            {
              id: "ARKWL-00004",
              title: "Option 4: Retro-Futuristic",
              description: "Inspired by classic sci-fi, blending vintage aesthetics with futuristic elements for a unique identity.",
              concept: "Nostalgic Innovation",
              source: "Claude Code",
              component: (
                <div className="w-full h-32 bg-gradient-to-r from-purple-900 via-pink-800 to-orange-700 rounded-lg p-4 border-2 border-yellow-400">
                  <div className="text-yellow-300 font-bold text-lg mb-2 tracking-wider">W I K I</div>
                  <div className="space-y-1">
                    <div className="h-2 w-3/4 bg-cyan-400 rounded"></div>
                    <div className="h-2 w-1/2 bg-pink-400 rounded"></div>
                  </div>
                </div>
              ),
              pros: ["Memorable design", "Distinctive brand", "Emotional connection", "Unique in market"],
              cons: ["Polarizing aesthetics", "May date quickly"],
              status: "Proposed",
              htmlFile: "docs/Wiki_files_002/Wiki_Landing_Option_4_RetroFuturistic.html"
            },
            {
              id: "ARKWL-00005",
              title: "Option 5: Magazine",
              description: "Layout reminiscent of a digital magazine, with rich imagery and curated content blocks for editorial feel.",
              concept: "Editorial Excellence",
              source: "Claude Code",
              component: (
                <div className="w-full h-32 bg-white rounded-lg overflow-hidden grid grid-cols-3 gap-1">
                  <div className="col-span-2 bg-gradient-to-br from-orange-100 to-pink-100 p-3">
                    <div className="text-xs font-bold mb-1">FEATURED</div>
                    <div className="h-1 w-3/4 bg-orange-400 mb-1"></div>
                    <div className="h-1 w-1/2 bg-orange-300"></div>
                  </div>
                  <div className="bg-gray-100 p-2 space-y-1">
                    <div className="h-1 w-full bg-gray-300"></div>
                    <div className="h-1 w-3/4 bg-gray-300"></div>
                  </div>
                </div>
              ),
              pros: ["Rich visual hierarchy", "Great for storytelling", "Engaging layouts", "Editorial credibility"],
              cons: ["Complex to maintain", "Slower loading"],
              status: "Proposed",
              htmlFile: "docs/Wiki_files_002/Wiki_Landing_Option_5_Magazine.html"
            },
            {
              id: "ARKWL-00006",
              title: "Option 6: Geometric",
              description: "Structured and precise, using geometric shapes and patterns for a modern, organized look with mathematical beauty.",
              concept: "Mathematical Precision",
              source: "Claude Code",
              component: (
                <div className="w-full h-32 bg-white rounded-lg p-4 grid grid-cols-4 gap-2">
                  <div className="col-span-2 bg-blue-500 rounded"></div>
                  <div className="bg-orange-500 rounded"></div>
                  <div className="bg-green-500 rounded"></div>
                  <div className="bg-purple-500 rounded"></div>
                  <div className="bg-red-500 rounded"></div>
                  <div className="col-span-2 bg-yellow-500 rounded"></div>
                </div>
              ),
              pros: ["Strong structure", "Modern aesthetic", "Scalable system", "Clear organization"],
              cons: ["Can feel rigid", "Requires careful balance"],
              status: "Proposed",
              htmlFile: "docs/Wiki_files_002/Wiki_Landing_Option_6_Geometric.html"
            },
            {
              id: "ARKWL-00007",
              title: "Option 7: The Knowledge Graph",
              description: "Visualizing connections with a force-directed graph background. Emphasizes semantic relationships and the network of knowledge.",
              concept: "Visualizing Connections",
              source: "Gemini 3.5",
              component: (
                <div className="w-full h-32 bg-slate-900 rounded-lg p-4 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-30">
                     <svg width="100%" height="100%">
                       <circle cx="20%" cy="30%" r="3" fill="#3b82f6"/>
                       <circle cx="80%" cy="70%" r="3" fill="#8b5cf6"/>
                       <circle cx="50%" cy="50%" r="5" fill="#3b82f6"/>
                       <line x1="20%" y1="30%" x2="50%" y2="50%" stroke="#475569" strokeWidth="1"/>
                       <line x1="50%" y1="50%" x2="80%" y2="70%" stroke="#475569" strokeWidth="1"/>
                     </svg>
                  </div>
                  <div className="relative z-10 flex items-center justify-center h-full">
                     <div className="bg-slate-800/80 border border-slate-700 rounded-full px-4 py-2 text-slate-200 text-xs shadow-xl backdrop-blur-sm">
                        Search Knowledge Graph...
                     </div>
                  </div>
                </div>
              ),
              pros: ["Highlights relationships", "Modern tech feel", "Encourages exploration", "Unique visualization"],
              cons: ["Can look cluttered", "High performance cost"],
              status: "Proposed",
              htmlFile: "docs/Wiki_files_003/Wiki_Landing_Option_7_KnowledgeGraph.html"
            },
            {
              id: "ARKWL-00008",
              title: "Option 8: The Architect's Blueprint",
              description: "Technical, grid-based layout mimicking CAD drawings. Emphasizes precision, structure, and the 'Master Builder' persona.",
              concept: "Technical Precision",
              source: "Gemini 3.5",
              component: (
                <div className="w-full h-32 bg-blue-900 rounded-lg p-4 font-mono relative overflow-hidden">
                   <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
                   <div className="relative border-2 border-white/50 h-full p-2 flex flex-col justify-between">
                      <div className="text-[8px] text-white uppercase tracking-widest border-b border-white/30 pb-1">Wiki Core Spec</div>
                      <div className="self-end border-l border-t border-white/50 pl-2 pt-1">
                         <div className="w-8 h-8 border border-dashed border-white/30 rounded-full"></div>
                      </div>
                   </div>
                </div>
              ),
              pros: ["Fits 'Arkhitekton' brand", "Distinctive identity", "Feels trustworthy/technical", "High contrast"],
              cons: ["Low readability for long text", "Very niche aesthetic"],
              status: "Proposed",
              htmlFile: "docs/Wiki_files_003/Wiki_Landing_Option_8_Blueprint.html"
            },
            {
              id: "ARKWL-00009",
              title: "Option 9: The Codex",
              description: "A timeline-based view focusing on the evolution of documentation. Feels like a living history book or digital scroll.",
              concept: "Living History",
              source: "Gemini 3.5",
              component: (
                <div className="w-full h-32 bg-[#f5f2eb] rounded-lg flex overflow-hidden">
                   <div className="w-1/3 border-r border-[#dcd6cc] bg-[#fdfbf7] p-3 flex flex-col gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#8c7355]"></div>
                      <div className="w-1 h-1 rounded-full bg-[#e2dcd0] ml-0.5"></div>
                      <div className="w-1 h-1 rounded-full bg-[#e2dcd0] ml-0.5"></div>
                   </div>
                   <div className="flex-1 p-3 font-serif">
                      <div className="h-1 w-1/2 bg-[#2c2925] mb-2"></div>
                      <div className="h-0.5 w-full bg-[#888] mb-1"></div>
                      <div className="h-0.5 w-3/4 bg-[#888]"></div>
                   </div>
                </div>
              ),
              pros: ["Great for versioning focus", "Classic academic feel", "Strong narrative", "Warm aesthetic"],
              cons: ["May feel dated", "Not standard for wikis"],
              status: "Proposed",
              htmlFile: "docs/Wiki_files_003/Wiki_Landing_Option_9_Codex.html"
            },
            {
              id: "ARKWL-00010",
              title: "Option 10: The Terminal",
              description: "CLI-inspired interface for developer efficiency. Features keyboard-first navigation and high information density.",
              concept: "Command Line Efficiency",
              source: "Gemini 3.5",
              component: (
                <div className="w-full h-32 bg-black rounded-lg p-3 font-mono text-xs">
                   <div className="text-green-500 mb-1">➜  wiki start</div>
                   <div className="text-gray-400 mb-2">Loading modules...</div>
                   <div className="grid grid-cols-2 gap-2">
                      <div className="border border-gray-700 p-1 text-[8px] text-gray-300">
                         [DIR] /architecture
                      </div>
                      <div className="border border-gray-700 p-1 text-[8px] text-gray-300">
                         [DIR] /api-docs
                      </div>
                   </div>
                   <div className="mt-2 text-green-500 animate-pulse">_</div>
                </div>
              ),
              pros: ["Developer favorite", "Fast navigation", "High contrast", "Cool factor"],
              cons: ["Intimidating to non-devs", "Poor discovery"],
              status: "Proposed",
              htmlFile: "docs/Wiki_files_004/Wiki_Landing_Option_10_Terminal.html"
            },
            {
              id: "ARKWL-00011",
              title: "Option 11: Glass Morphism",
              description: "Modern, spatial design using frosted glass, depth, and blurred layers. Feels premium, futuristic, and aligned with modern OS trends.",
              concept: "Spatial Computing",
              source: "Gemini 3.5",
              component: (
                <div className="w-full h-32 rounded-lg p-4 relative overflow-hidden bg-gradient-to-br from-pink-400 to-blue-400">
                   <div className="absolute top-2 left-2 w-8 h-8 bg-white/30 rounded-full blur-sm"></div>
                   <div className="absolute bottom-2 right-2 w-12 h-12 bg-purple-500/30 rounded-full blur-md"></div>
                   <div className="relative h-full w-full bg-white/20 backdrop-blur-md border border-white/30 rounded-xl flex items-center justify-center shadow-lg">
                      <div className="w-3/4 h-2 bg-white/40 rounded-full"></div>
                   </div>
                </div>
              ),
              pros: ["Trendy & Modern", "Premium feel", "Depth and hierarchy", "Visually stunning"],
              cons: ["Accessibility challenges", "Performance heavy"],
              status: "Proposed",
              htmlFile: "docs/Wiki_files_004/Wiki_Landing_Option_11_GlassMorphism.html"
            },
            {
              id: "ARKWL-00012",
              title: "Option 12: The Bento Box",
              description: "Modular, grid-based layout inspired by bento boxes and widgets. High information density with clear separation of concerns.",
              concept: "Modular Organization",
              source: "Gemini 3.5",
              component: (
                <div className="w-full h-32 bg-gray-100 rounded-lg p-2 gap-1 grid grid-cols-3 grid-rows-2">
                   <div className="bg-white rounded shadow-sm col-span-2 row-span-1"></div>
                   <div className="bg-blue-500 rounded shadow-sm col-span-1 row-span-1"></div>
                   <div className="bg-white rounded shadow-sm col-span-1 row-span-1"></div>
                   <div className="bg-white rounded shadow-sm col-span-2 row-span-1"></div>
                </div>
              ),
              pros: ["Organized & Clean", "Responsive", "Information dense", "Familiar UI pattern"],
              cons: ["Can feel rigid", "Boxy aesthetic"],
              status: "Proposed",
              htmlFile: "docs/Wiki_files_004/Wiki_Landing_Option_12_BentoBox.html"
            }
          ]
        };

      case "canvas-implementation":
        return {
          title: "Canvas Implementation Options",
          description: "Technical comparison of canvas rendering approaches for the Design Studio. Compare Static HTML/CSS mockup vs React Konva (HTML5 Canvas) with draggable shapes.",
          items: [
            {
              id: "ARKCI-00001",
              title: "Option A: Static HTML/CSS Mockup",
              description: "Uses styled HTML divs positioned absolutely. Shapes are visual only - they cannot be dragged. Connections are hardcoded SVG lines. Good for UI/UX design validation but not for production.",
              concept: "UI/UX Design Validation",
              component: (
                <div className="w-full h-40 bg-slate-100 rounded-lg relative overflow-hidden border-2 border-dashed border-slate-300">
                  <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, #CBD5E1 1px, transparent 1px)', backgroundSize: '12px 12px' }} />
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <line x1="100" y1="35" x2="60" y2="70" stroke="#94A3B8" strokeWidth="2" />
                    <line x1="100" y1="35" x2="100" y2="70" stroke="#94A3B8" strokeWidth="2" />
                    <line x1="100" y1="35" x2="140" y2="70" stroke="#94A3B8" strokeWidth="2" />
                  </svg>
                  <div className="absolute left-[70px] top-[15px] px-2 py-1 bg-orange-500 text-white text-[10px] rounded">API Gateway</div>
                  <div className="absolute left-[30px] top-[70px] px-2 py-1 bg-orange-500 text-white text-[10px] rounded">Orders</div>
                  <div className="absolute left-[75px] top-[70px] px-2 py-1 bg-orange-500 text-white text-[10px] rounded">Users</div>
                  <div className="absolute left-[120px] top-[70px] px-2 py-1 bg-orange-500 text-white text-[10px] rounded">Products</div>
                  <div className="absolute bottom-2 left-2 bg-white/90 px-1 py-0.5 rounded text-[8px] text-slate-600">HTML/CSS Divs (Static)</div>
                </div>
              ),
              pros: ["Fast to prototype", "Easy CSS styling", "Familiar web tech", "Matches design mockups"],
              cons: ["NOT actually draggable", "Connections are hardcoded", "Poor performance at scale", "No canvas export"],
              status: "Rejected",
              technicalDetails: {
                file: "canvas-simple.tsx",
                technology: "HTML, CSS, SVG",
                route: "/studio/canvas"
              }
            },
            {
              id: "ARKCI-00002",
              title: "Option B: React Konva Canvas (Recommended)",
              description: "Uses HTML5 Canvas via react-konva library. Shapes ARE truly draggable. Connections update dynamically when shapes move. Supports zoom/pan, shape selection, and proper performance at scale.",
              concept: "Production-Ready Canvas",
              component: (
                <div className="w-full h-40 bg-slate-50 rounded-lg relative overflow-hidden border-2 border-solid border-green-400">
                  <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, #CBD5E1 1px, transparent 1px)', backgroundSize: '12px 12px' }} />
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <line x1="100" y1="35" x2="60" y2="70" stroke="#10B981" strokeWidth="2" />
                    <line x1="100" y1="35" x2="100" y2="70" stroke="#10B981" strokeWidth="2" />
                    <line x1="100" y1="35" x2="140" y2="70" stroke="#10B981" strokeWidth="2" />
                    <line x1="100" y1="85" x2="100" y2="110" stroke="#10B981" strokeWidth="2" />
                  </svg>
                  <div className="absolute left-[70px] top-[15px] px-2 py-1 bg-orange-500 text-white text-[10px] rounded shadow-md cursor-move">API Gateway</div>
                  <div className="absolute left-[30px] top-[70px] px-2 py-1 bg-orange-500 text-white text-[10px] rounded shadow-md cursor-move ring-2 ring-green-500 ring-offset-1">Orders</div>
                  <div className="absolute left-[75px] top-[70px] px-2 py-1 bg-orange-500 text-white text-[10px] rounded shadow-md cursor-move">Users</div>
                  <div className="absolute left-[120px] top-[70px] px-2 py-1 bg-orange-500 text-white text-[10px] rounded shadow-md cursor-move">Products</div>
                  <div className="absolute left-[70px] top-[110px] px-2 py-1 bg-blue-500 text-white text-[10px] rounded shadow-md cursor-move">DynamoDB</div>
                  <div className="absolute bottom-2 left-2 bg-white/90 px-1 py-0.5 rounded text-[8px] text-green-600 font-medium">React Konva (Draggable)</div>
                </div>
              ),
              pros: ["Truly draggable shapes", "Dynamic connections", "Zoom & pan support", "Performance at scale (100+ shapes)", "Export to PNG/SVG", "Shape components"],
              cons: ["Slightly more complex setup", "Requires react-konva knowledge"],
              status: "Active",
              technicalDetails: {
                file: "DesignCanvas.tsx",
                technology: "React Konva (HTML5 Canvas)",
                route: "/studio/canvas-advanced"
              }
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
                  <div className="flex justify-center mb-4 gap-2">
                    <Badge variant="secondary" className="mb-2">
                      {item.id}
                    </Badge>
                    {(item as any).source && (
                      <Badge variant="outline" className="mb-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-none">
                        {(item as any).source}
                      </Badge>
                    )}
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

                  <div className="flex flex-col gap-2 pt-4">
                    <div className="flex items-center justify-between w-full">
                      <Badge variant="outline" className={
                        item.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          item.status === 'New' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                            'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                      }>
                        {item.status}
                      </Badge>
                    </div>

                    {item.id.startsWith('ARKDL') && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full bg-indigo-50 text-indigo-600 border-indigo-200 hover:bg-indigo-100 hover:text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-300 dark:border-indigo-800"
                        onClick={() => {
                          window.location.href = `/design-options/canvas-dashboard-layouts/prototype/${item.id}`;
                        }}
                      >
                        <Monitor className="w-4 h-4 mr-2" />
                        Launch Prototype
                      </Button>
                    )}
                    
                    {item.id.startsWith('ARKWL') && 'htmlFile' in item && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full bg-indigo-50 text-indigo-600 border-indigo-200 hover:bg-indigo-100 hover:text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-300 dark:border-indigo-800"
                        onClick={() => {
                          window.open(`/${(item as any).htmlFile}`, '_blank');
                        }}
                      >
                        <Monitor className="w-4 h-4 mr-2" />
                        View Prototype
                      </Button>
                    )}

                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        alert(`Selected ${item.id}: ${item.title}\n\nThis design option will be implemented!`);
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