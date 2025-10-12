import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLocation } from 'wouter';
import { Boxes, Rocket, Ruler, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  onTemplateClick?: (frameworkId: string) => void;
}

export function DesignStudioEmptyState({ onTemplateClick }: EmptyStateProps) {
  const [, setLocation] = useLocation();

  const handleBlankCanvas = () => {
    setLocation('/studio/canvas?new=true');
  };

  const handleTemplateClick = (frameworkId: string) => {
    if (onTemplateClick) {
      onTemplateClick(frameworkId);
    } else {
      console.log('Open template gallery for:', frameworkId);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] p-8">
      <div className="max-w-3xl w-full text-center space-y-8">
        {/* Hero Illustration */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            {/* Architecture diagram illustration */}
            <div className="w-64 h-48 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center">
              <div className="space-y-3">
                {/* Mock diagram elements */}
                <div className="flex items-center justify-center gap-3">
                  <div className="w-12 h-12 rounded bg-orange-500/20 border-2 border-orange-500 flex items-center justify-center">
                    <Boxes className="h-6 w-6 text-orange-500" />
                  </div>
                  <div className="h-0.5 w-8 bg-slate-400" />
                  <div className="w-12 h-12 rounded bg-blue-500/20 border-2 border-blue-500 flex items-center justify-center">
                    <Boxes className="h-6 w-6 text-blue-500" />
                  </div>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <div className="w-12 h-12 rounded bg-green-500/20 border-2 border-green-500 flex items-center justify-center">
                    <Boxes className="h-6 w-6 text-green-500" />
                  </div>
                  <div className="h-0.5 w-8 bg-slate-400" />
                  <div className="w-12 h-12 rounded bg-purple-500/20 border-2 border-purple-500 flex items-center justify-center">
                    <Boxes className="h-6 w-6 text-purple-500" />
                  </div>
                </div>
              </div>
            </div>
            {/* Sparkle accent */}
            <div className="absolute -top-2 -right-2 bg-orange-500 rounded-full p-2">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="space-y-3">
          <h2 className="text-3xl font-bold text-foreground">Welcome to Design Studio</h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Create enterprise architecture diagrams with AI-powered guidance. Start from a template or build from scratch.
          </p>
        </div>

        {/* Primary Actions */}
        <div className="flex items-center justify-center gap-4 pt-4">
          <Card 
            className="group cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all border-2 hover:border-orange-500"
            onClick={() => handleTemplateClick('aws')}
            data-testid="button-empty-aws-template"
          >
            <CardContent className="p-6 text-center space-y-3">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 group-hover:scale-110 transition-transform">
                <Rocket className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Start with AWS Template</h3>
                <p className="text-xs text-muted-foreground mt-1">45 cloud templates</p>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="group cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all border-2 hover:border-purple-500"
            onClick={() => handleTemplateClick('archimate')}
            data-testid="button-empty-archimate-template"
          >
            <CardContent className="p-6 text-center space-y-3">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 group-hover:scale-110 transition-transform">
                <Ruler className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Start with ArchiMate</h3>
                <p className="text-xs text-muted-foreground mt-1">27 EA templates</p>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="group cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all border-2 hover:border-pink-500"
            onClick={handleBlankCanvas}
            data-testid="button-empty-blank-canvas"
          >
            <CardContent className="p-6 text-center space-y-3">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 group-hover:scale-110 transition-transform">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Blank Canvas</h3>
                <p className="text-xs text-muted-foreground mt-1">Start fresh</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Info */}
        <div className="pt-6 border-t">
          <p className="text-sm text-muted-foreground">
            New to enterprise architecture? Check out our{' '}
            <Button variant="link" className="p-0 h-auto text-sm text-orange-500 hover:text-orange-600" data-testid="link-getting-started">
              getting started guide
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}
