import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Palette } from 'lucide-react';
import { Link } from 'wouter';
import { GovernanceHeader } from '@/components/layout/governance-header';
import { AppLayout } from '@/components/layout/app-layout';

// Logo Option Components
function Option1Logo() {
  return (
    <div className="relative w-32 h-20 flex items-center justify-center">
      {/* Left side - Mixed geometric shapes */}
      <div className="absolute left-0 flex items-center space-x-1">
        {/* Large hexagon */}
        <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 transform rotate-45 rounded-lg"></div>
        {/* Circle */}
        <div className="w-7 h-7 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full"></div>
        {/* Triangle approximation */}
        <div className="w-6 h-6 bg-gradient-to-br from-orange-400 to-amber-500 transform rotate-45 rounded-sm"></div>
      </div>

      {/* Right side - Trailing smaller shapes */}
      <div className="absolute right-0 flex items-center space-x-1 opacity-60">
        <div className="w-4 h-4 bg-orange-400 rounded-full"></div>
        <div className="w-3 h-3 bg-orange-300 rounded-full"></div>
        <div className="w-2 h-2 bg-orange-200 rounded-full"></div>
        <div className="flex space-x-1">
          <div className="w-1 h-1 bg-orange-200 rounded-full"></div>
          <div className="w-1 h-1 bg-orange-200 rounded-full"></div>
          <div className="w-1 h-1 bg-orange-200 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

function Option2Logo() {
  return (
    <div className="relative w-32 h-20 flex items-center justify-center">
      {/* Left side - 3D architectural blocks */}
      <div className="absolute left-0 flex items-center space-x-1">
        {/* Cube */}
        <div className="relative">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-600 to-orange-700 rounded-lg"></div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-orange-400 to-orange-500 rounded-lg transform rotate-12"></div>
        </div>
        {/* Cone approximation */}
        <div className="w-7 h-7 bg-gradient-to-t from-orange-500 to-amber-400 rounded-full relative">
          <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-1 h-4 bg-gradient-to-t from-orange-600 to-amber-300 rounded-full"></div>
        </div>
      </div>

      {/* Right side - Flattening shapes */}
      <div className="absolute right-0 flex items-center space-x-1">
        <div className="w-5 h-3 bg-orange-400 rounded-lg"></div>
        <div className="w-4 h-2 bg-orange-300 rounded"></div>
        <div className="w-3 h-1 bg-orange-200 rounded"></div>
        <div className="flex space-x-1">
          <div className="w-1 h-1 bg-orange-200 rounded-full"></div>
          <div className="w-1 h-1 bg-orange-200 rounded-full"></div>
          <div className="w-1 h-1 bg-orange-200 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

function Option3Logo() {
  return (
    <div className="relative w-32 h-20 flex items-center justify-center">
      {/* Left side - Overlapping dynamic shapes */}
      <div className="absolute left-0 flex items-center">
        <div className="relative">
          {/* Base circle */}
          <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full"></div>
          {/* Overlapping triangle */}
          <div className="absolute -top-1 -right-2 w-6 h-6 bg-gradient-to-br from-amber-400 to-orange-400 transform rotate-45 rounded-sm"></div>
          {/* Small hexagon */}
          <div className="absolute -bottom-1 -left-1 w-5 h-5 bg-gradient-to-br from-orange-600 to-orange-700 transform rotate-12 rounded-lg"></div>
        </div>
      </div>

      {/* Right side - Progressive abstraction */}
      <div className="absolute right-0 flex items-center space-x-1">
        <div className="w-5 h-5 bg-gradient-to-br from-orange-400 to-amber-400 rounded-full opacity-80"></div>
        <div className="w-4 h-4 bg-orange-300 rounded-full opacity-60"></div>
        <div className="w-3 h-3 bg-orange-200 rounded-full opacity-40"></div>
        <div className="flex space-x-1 opacity-30">
          <div className="w-1 h-1 bg-orange-200 rounded-full"></div>
          <div className="w-1 h-1 bg-orange-200 rounded-full"></div>
          <div className="w-1 h-1 bg-orange-200 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

function Option4Logo() {
  return (
    <div className="relative w-32 h-20 flex items-center justify-center">
      {/* Left side - Orange rounded square with diamond center and flame */}
      <div className="absolute left-0 flex items-center">
        <div className="relative">
          {/* Main orange rounded square base */}
          <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl"></div>

          {/* Center diamond shape */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-gradient-to-br from-orange-100 to-orange-200 transform rotate-45 rounded-sm"></div>

          {/* Flame element positioned quarter way down from top, just above center */}
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
            {/* Main flame body */}
            <div className="w-2.5 h-3 bg-gradient-to-t from-red-500 via-orange-400 to-yellow-300 rounded-full transform scale-y-125"></div>
            {/* Flame tip */}
            <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-gradient-to-t from-yellow-400 to-yellow-200 rounded-full"></div>
            {/* Inner flame glow */}
            <div className="absolute top-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1.5 bg-gradient-to-t from-orange-300 to-yellow-100 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Right side - Transitioning shapes */}
      <div className="absolute right-0 flex items-center space-x-1">
        <div className="w-5 h-5 bg-gradient-to-br from-orange-400 to-orange-500 rounded-lg opacity-80"></div>
        <div className="w-4 h-4 bg-orange-300 rounded-lg opacity-60"></div>
        <div className="w-3 h-3 bg-orange-200 rounded-full opacity-40"></div>
        <div className="flex space-x-1 opacity-30">
          <div className="w-1 h-1 bg-orange-200 rounded-full"></div>
          <div className="w-1 h-1 bg-orange-200 rounded-full"></div>
          <div className="w-1 h-1 bg-orange-200 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

function Option5Logo() {
  return (
    <div className="relative w-32 h-20 flex items-center justify-center">
      {/* Left side - Architect with drafting easel */}
      <div className="absolute left-0 flex items-center">
        <div className="relative">
          {/* Easel/Drawing board */}
          <div className="w-9 h-7 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-sm border border-slate-300 dark:border-slate-600"></div>

          {/* Blueprint/Plans on easel */}
          <div className="absolute top-0.5 left-0.5 w-8 h-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-sm">
            {/* Blueprint lines */}
            <div className="absolute top-1 left-1 w-6 h-0.5 bg-blue-300 dark:bg-blue-600 rounded-full"></div>
            <div className="absolute top-2 left-1 w-4 h-0.5 bg-blue-300 dark:bg-blue-600 rounded-full"></div>
            <div className="absolute top-3 left-1 w-5 h-0.5 bg-blue-300 dark:bg-blue-600 rounded-full"></div>
          </div>

          {/* Architect figure */}
          <div className="absolute -bottom-1 -right-2">
            {/* Head */}
            <div className="w-2 h-2 bg-gradient-to-br from-amber-200 to-amber-300 rounded-full"></div>
            {/* Body */}
            <div className="w-2.5 h-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-sm mt-0.5"></div>
          </div>
        </div>
      </div>

      {/* Right side - Transitioning elements */}
      <div className="absolute right-0 flex items-center space-x-1">
        <div className="w-5 h-4 bg-gradient-to-br from-blue-300 to-orange-400 rounded-lg opacity-80"></div>
        <div className="w-4 h-3 bg-orange-300 rounded-lg opacity-60"></div>
        <div className="w-3 h-3 bg-orange-200 rounded-full opacity-40"></div>
        <div className="flex space-x-1 opacity-30">
          <div className="w-1 h-1 bg-orange-200 rounded-full"></div>
          <div className="w-1 h-1 bg-orange-200 rounded-full"></div>
          <div className="w-1 h-1 bg-orange-200 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

function Option6Logo() {
  return (
    <div className="relative w-32 h-20 flex items-center justify-center">
      {/* Left side - Hybrid: Orange box + Architect */}
      <div className="absolute left-0 flex items-center">
        <div className="relative">
          {/* Orange diamond box background */}
          <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-gradient-to-br from-orange-100 to-orange-200 transform rotate-45 rounded-sm"></div>

          {/* Mini architect figure inside */}
          <div className="absolute top-2 left-2">
            {/* Simplified easel */}
            <div className="w-4 h-3 bg-white/80 dark:bg-slate-100 rounded-sm border border-orange-300"></div>
            {/* Blueprint lines */}
            <div className="absolute top-0.5 left-0.5 w-3 h-0.5 bg-blue-400 rounded-full"></div>
            <div className="absolute top-1.5 left-0.5 w-2 h-0.5 bg-blue-400 rounded-full"></div>
          </div>

          {/* Mini architect */}
          <div className="absolute bottom-2 right-2">
            <div className="w-1.5 h-1.5 bg-amber-300 rounded-full"></div>
            <div className="w-2 h-3 bg-slate-600 rounded-sm mt-0.5"></div>
          </div>
        </div>
      </div>

      {/* Right side - Flowing transition */}
      <div className="absolute right-0 flex items-center space-x-1">
        <div className="w-5 h-5 bg-gradient-to-br from-orange-400 to-blue-400 rounded-lg opacity-80"></div>
        <div className="w-4 h-4 bg-orange-300 rounded-lg opacity-60"></div>
        <div className="w-3 h-3 bg-orange-200 rounded-full opacity-40"></div>
        <div className="flex space-x-1 opacity-30">
          <div className="w-1 h-1 bg-orange-200 rounded-full"></div>
          <div className="w-1 h-1 bg-orange-200 rounded-full"></div>
          <div className="w-1 h-1 bg-orange-200 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

function Option7Logo() {
  return (
    <div className="relative w-32 h-20 flex items-center justify-center">
      {/* Left side - Modern minimalist architect */}
      <div className="absolute left-0 flex items-center">
        <div className="relative">
          {/* Modern drafting table */}
          <div className="w-9 h-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg transform -rotate-6"></div>

          {/* Digital blueprint/screen effect */}
          <div className="absolute top-0.5 left-1 w-7 h-4 bg-gradient-to-br from-blue-100 to-orange-100 dark:from-blue-900 dark:to-orange-900 rounded transform -rotate-6 border border-orange-300">
            {/* Grid pattern */}
            <div className="absolute inset-1 grid grid-cols-3 gap-0.5">
              <div className="bg-orange-400/40 rounded-sm"></div>
              <div className="bg-blue-400/40 rounded-sm"></div>
              <div className="bg-orange-400/40 rounded-sm"></div>
              <div className="bg-blue-400/40 rounded-sm"></div>
              <div className="bg-orange-400/40 rounded-sm"></div>
              <div className="bg-blue-400/40 rounded-sm"></div>
            </div>
          </div>

          {/* Stylized architect icon */}
          <div className="absolute -bottom-0.5 -right-1">
            <div className="w-2 h-6 bg-gradient-to-b from-orange-400 to-orange-600 rounded-full"></div>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gradient-to-br from-amber-300 to-orange-400 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Right side - Digital transformation trail */}
      <div className="absolute right-0 flex items-center space-x-1">
        <div className="w-5 h-4 bg-gradient-to-br from-orange-400 to-blue-400 rounded-lg opacity-80 transform rotate-3"></div>
        <div className="w-4 h-3 bg-gradient-to-br from-orange-300 to-blue-300 rounded-lg opacity-60"></div>
        <div className="w-3 h-3 bg-orange-200 rounded-full opacity-40"></div>
        <div className="flex space-x-1 opacity-30">
          <div className="w-1 h-1 bg-orange-200 rounded-full"></div>
          <div className="w-1 h-1 bg-orange-200 rounded-full"></div>
          <div className="w-1 h-1 bg-orange-200 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

function DesignOptionsContent() {
  const designCategories = [
    {
      id: "logo-concepts",
      title: "Logo Design Concepts",
      description: "Architectural logo variations showing complexity to simplicity transformation",
      category: "Logo Design",
      priority: "High",
      dateCreated: "2025-09-02",
      itemCount: 7,
      status: "Active"
    },
    {
      id: "color-palettes",
      title: "Color Palette Options",
      description: "Professional color schemes including Delta Airlines inspired American strength branding",
      category: "Color Design",
      priority: "Critical",
      dateCreated: "2025-09-23",
      itemCount: 3,
      status: "New"
    },
    {
      id: "typography",
      title: "Typography Systems",
      description: "Font hierarchy and text styling for enterprise architecture tools",
      category: "Typography",
      priority: "Medium",
      dateCreated: "2025-09-02",
      itemCount: 3,
      status: "Proposed"
    },
    {
      id: "print-formats",
      title: "Print Story as PDF",
      description: "Professional PDF export formats for user stories with elegant layouts optimized for printing and presentations",
      category: "Print Design",
      priority: "High",
      dateCreated: "2025-10-14",
      itemCount: 3,
      status: "Active"
    },
    {
      id: "canvas-dashboard-layouts",
      title: "Canvas Dashboard Layouts",
      description: "Proposed landing page layouts inspired by industry leaders (Figma, Miro, Mural) to balance B2B complexity with B2C usability",
      category: "UX Layout",
      priority: "Critical",
      dateCreated: "2025-12-09",
      itemCount: 5,
      status: "New"
    },
    {
      id: "wiki-landing-pages",
      title: "Wiki Module Landing Page Prototypes",
      description: "Six distinct visual styles for the Wiki Knowledge Core landing page - from brutalist to minimalist, magazine-style to geometric patterns",
      category: "UX Design",
      priority: "High",
      dateCreated: "2025-12-17",
      itemCount: 6,
      status: "New",
      htmlPrototypes: [
        { name: "Option 1: Brutalist", file: "docs/Wiki_files_001/Wiki_Landing_Option_1_Brutalist.html" },
        { name: "Option 2: Organic", file: "docs/Wiki_files_001/Wiki_Landing_Option_2_Organic.html" },
        { name: "Option 3: Minimal", file: "docs/Wiki_files_001/Wiki_Landing_Option_3_Minimal.html" },
        { name: "Option 4: Retro-Futuristic", file: "docs/Wiki_files_002/Wiki_Landing_Option_4_RetroFuturistic.html" },
        { name: "Option 5: Magazine", file: "docs/Wiki_files_002/Wiki_Landing_Option_5_Magazine.html" },
        { name: "Option 6: Geometric", file: "docs/Wiki_files_002/Wiki_Landing_Option_6_Geometric.html" }
      ]
    }
  ];

  const getTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'High': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'New': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Proposed': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const designDecisions = [
    {
      id: "ARKDD-00001",
      dateProposed: "2025-09-02",
      title: "Mixed Geometric Cascade",
      description: "Diverse architectural shapes (hexagon, circle, triangle, square) flowing from complex to simple. Shows systematic thinking and architectural diversity.",
      concept: "Architectural Diversity & System Organization",
      logo: <Option1Logo />,
      pros: ["Clear shape variety", "Professional look", "Shows systematic approach"],
      cons: ["Might be too busy", "Complex to reproduce at small sizes"],
      status: "Proposed"
    },
    {
      id: "ARKDD-00002",
      dateProposed: "2025-09-02",
      title: "Architectural Building Blocks",
      description: "3D geometric forms (cube, cone, cylinder, pyramid) transforming into 2D shapes and dots. Represents the journey from complex architecture to documentation.",
      concept: "3D Architecture → 2D Documentation",
      logo: <Option2Logo />,
      pros: ["Strong 3D architectural feel", "Clear transformation story", "Unique depth"],
      cons: ["More complex to implement", "Might not scale well"],
      status: "Proposed"
    },
    {
      id: "ARKDD-00003",
      dateProposed: "2025-09-02",
      title: "Dynamic Shape Flow",
      description: "Overlapping organic shapes (circles, triangles, hexagons) that progressively abstract into dots. Emphasizes the master builder organizing complexity into elegance.",
      concept: "Complexity → Elegant Simplicity",
      logo: <Option3Logo />,
      pros: ["Organic, flowing feel", "Great scalability", "Clean abstraction"],
      cons: ["Less architectural", "Might be too abstract"],
      status: "Proposed"
    },
    {
      id: "ARKDD-00004",
      dateProposed: "2025-09-02",
      title: "Orange Icon with Flame",
      description: "Clean orange rounded square with diamond center and flame positioned quarter-way down from the top. The flame represents the creative spark and passion of master builders transforming complexity into simplicity.",
      concept: "Creative Spark → Architectural Excellence",
      logo: <Option4Logo />,
      pros: ["Clean, professional look", "Flame adds energy/creativity", "Great scalability", "Matches orange theme", "Unique identity"],
      cons: ["Simpler than other options", "Flame details at small sizes"],
      status: "Proposed"
    },
    {
      id: "ARKDD-00005",
      dateProposed: "2025-09-02",
      title: "Architect with Drafting Easel",
      description: "Classic professional architect at drafting easel with blueprints, representing the traditional master builder concept. Shows the human element of architecture and design thinking.",
      concept: "Master Builder at Work → Digital Excellence",
      logo: <Option5Logo />,
      pros: ["Instantly recognizable", "Human-centered design", "Professional credibility", "Storytelling power", "Clear architectural connection"],
      cons: ["More complex to reproduce", "May feel traditional vs. modern", "Detailed elements at small sizes"],
      status: "Proposed"
    },
    {
      id: "ARKDD-00006",
      dateProposed: "2025-09-02",
      title: "Hybrid: Orange Box + Architect",
      description: "Combines the clean orange diamond box with a mini architect figure and easel inside. Best of both worlds - modern simplicity with human architectural storytelling.",
      concept: "Traditional Architecture → Modern Digital Tools",
      logo: <Option6Logo />,
      pros: ["Combines both concepts", "Unique hybrid approach", "Modern yet human", "Scalable base with story", "Brand differentiation"],
      cons: ["Complex internal details", "May be busy at small sizes", "Two concepts competing"],
      status: "Proposed"
    },
    {
      id: "ARKDD-00007",
      dateProposed: "2025-09-02",
      title: "Modern Architectural Professional",
      description: "Minimalist, stylized architect with digital drafting table showing grid/blueprint patterns. Clean, contemporary interpretation of the master builder working with modern tools.",
      concept: "Digital Architecture Mastery → Simple Excellence",
      logo: <Option7Logo />,
      pros: ["Modern and clean", "Digital-first approach", "Great scalability", "Contemporary feel", "Tech-forward identity"],
      cons: ["Less traditional", "May be too abstract", "Could lose human element"]
    }
  ];

  return (
    <div className="h-full overflow-hidden flex flex-col">
      <GovernanceHeader
        moduleTitle="Design Options"
        moduleIcon={Palette}
      />

      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Design Categories Grid */}
          <div className="space-y-4">
            {designCategories.map((category) => (
              <Card
                key={category.id}
                className="group hover:shadow-md transition-all duration-200 cursor-pointer"
                onDoubleClick={() => {
                  // Navigate to category details
                  window.location.href = `/design-options/${category.id}`;
                }}
                data-testid={`design-category-${category.id}`}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-xl">{category.title}</CardTitle>
                        <Badge variant="outline" className={getStatusColor(category.status)}>
                          {category.status}
                        </Badge>
                        <Badge variant="outline" className={getPriorityColor(category.priority)}>
                          {category.priority}
                        </Badge>
                      </div>
                      <CardDescription className="mb-3">
                        {category.description}
                      </CardDescription>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{getTimeAgo(category.dateCreated)}</span>
                        <span>•</span>
                        <span>{category.itemCount} options</span>
                        <span>•</span>
                        <Badge variant="secondary" className="text-xs">
                          {category.id.toUpperCase()}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `/design-options/${category.id}`;
                        }}
                        data-testid={`view-${category.id}`}
                      >
                        View Options
                      </Button>
                      <Button variant="ghost" size="sm">
                        ⋯
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground text-sm">
              Double-click a category or use the View Options button to see detailed design options
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Design Options Page Component
export default function DesignOptionsPage() {
  return (
    <AppLayout>
      <DesignOptionsContent />
    </AppLayout>
  );
}