import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';

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

export default function DesignOptionsPage() {
  const options = [
    {
      id: 1,
      title: "Mixed Geometric Cascade",
      description: "Diverse architectural shapes (hexagon, circle, triangle, square) flowing from complex to simple. Shows systematic thinking and architectural diversity.",
      concept: "Architectural Diversity & System Organization",
      logo: <Option1Logo />,
      pros: ["Clear shape variety", "Professional look", "Shows systematic approach"],
      cons: ["Might be too busy", "Complex to reproduce at small sizes"]
    },
    {
      id: 2,
      title: "Architectural Building Blocks",
      description: "3D geometric forms (cube, cone, cylinder, pyramid) transforming into 2D shapes and dots. Represents the journey from complex architecture to documentation.",
      concept: "3D Architecture → 2D Documentation",
      logo: <Option2Logo />,
      pros: ["Strong 3D architectural feel", "Clear transformation story", "Unique depth"],
      cons: ["More complex to implement", "Might not scale well"]
    },
    {
      id: 3,
      title: "Dynamic Shape Flow",
      description: "Overlapping organic shapes (circles, triangles, hexagons) that progressively abstract into dots. Emphasizes the master builder organizing complexity into elegance.",
      concept: "Complexity → Elegant Simplicity",
      logo: <Option3Logo />,
      pros: ["Organic, flowing feel", "Great scalability", "Clean abstraction"],
      cons: ["Less architectural", "Might be too abstract"]
    }
  ];

  return (
    <div className="min-h-screen bg-background p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">ARKHITEKTON Logo Options</h1>
            <p className="text-muted-foreground mt-2">
              Three design concepts showing complexity flowing into elegant simplicity
            </p>
          </div>
        </div>
        
        <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 mb-8">
          <p className="text-orange-800 dark:text-orange-200 text-sm">
            <strong>Design Philosophy:</strong> All options follow your vision of having substantial shapes on the left 
            flowing into smaller, trailing elements on the right with dots (...) - representing ARKHITEKTON's ability 
            to transform architectural complexity into understandable models.
          </p>
        </div>
      </div>

      {/* Options Grid */}
      <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-1 lg:grid-cols-3">
        {options.map((option) => (
          <Card key={option.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <Badge variant="secondary" className="mb-2">
                  Option {option.id}
                </Badge>
              </div>
              
              {/* Logo Display */}
              <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-6 mb-4 border-2 border-dashed border-slate-200 dark:border-slate-700">
                <div className="flex justify-center">
                  {option.logo}
                </div>
              </div>
              
              <CardTitle className="text-xl">{option.title}</CardTitle>
              <CardDescription className="text-center">
                {option.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="bg-primary/5 rounded-lg p-3">
                <h4 className="font-medium text-primary mb-1">Core Concept</h4>
                <p className="text-sm text-muted-foreground">{option.concept}</p>
              </div>
              
              <div className="grid gap-3">
                <div>
                  <h4 className="font-medium text-green-600 dark:text-green-400 mb-1 text-sm">Strengths</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {option.pros.map((pro, index) => (
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
                    {option.cons.map((con, index) => (
                      <li key={index} className="flex items-start gap-1">
                        <span className="text-orange-500 mt-0.5">•</span>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <Button 
                className="w-full mt-4" 
                variant="outline"
                onClick={() => {
                  // You can click to select - we'll implement the actual selection later
                  alert(`Selected Option ${option.id}: ${option.title}\n\nLet me know and I'll implement this design!`);
                }}
                data-testid={`select-option-${option.id}`}
              >
                Select This Option
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="max-w-6xl mx-auto mt-12 text-center">
        <p className="text-muted-foreground text-sm">
          Click on your preferred option, and I'll implement the full logo design throughout ARKHITEKTON!
        </p>
      </div>
    </div>
  );
}