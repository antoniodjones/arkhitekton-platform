import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Lightbulb, 
  ChevronDown, 
  ChevronRight, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Zap,
  Shield,
  Layers,
  Wrench,
  Sparkles,
  Target,
  ArrowRight,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ArchitecturalRecommendation {
  id: string;
  title: string;
  description: string;
  category: 'structural' | 'performance' | 'security' | 'scalability' | 'maintainability' | 'simplification';
  priority: 'critical' | 'high' | 'medium' | 'low';
  impact: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
  rationale: string;
  suggestions: ArchitecturalSuggestion[];
  tradeoffs: string[];
  risks: string[];
  benefits: string[];
  implementationSteps: string[];
  estimatedTimeline: string;
  dependsOn?: string[];
  conflictsWith?: string[];
}

interface ArchitecturalSuggestion {
  type: 'add_object' | 'remove_object' | 'modify_object' | 'add_connection' | 'remove_connection' | 'refactor_pattern';
  targetId?: string;
  details: Record<string, any>;
  explanation: string;
}

interface AIRecommendationsPanelProps {
  recommendations: ArchitecturalRecommendation[];
  onApplyRecommendation: (recommendationId: string) => void;
  onRefreshRecommendations: () => void;
  isLoading?: boolean;
  className?: string;
}

export function AIRecommendationsPanel({
  recommendations,
  onApplyRecommendation,
  onRefreshRecommendations,
  isLoading = false,
  className
}: AIRecommendationsPanelProps) {
  const [expandedRecommendations, setExpandedRecommendations] = useState<Set<string>>(new Set());
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedRecommendations);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRecommendations(newExpanded);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'structural': return <Layers className="w-4 h-4" />;
      case 'performance': return <Zap className="w-4 h-4" />;
      case 'security': return <Shield className="w-4 h-4" />;
      case 'scalability': return <TrendingUp className="w-4 h-4" />;
      case 'maintainability': return <Wrench className="w-4 h-4" />;
      case 'simplification': return <Sparkles className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'structural': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'performance': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'security': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'scalability': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'maintainability': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'simplification': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'high': return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      case 'medium': return <Info className="w-4 h-4 text-blue-600" />;
      case 'low': return <Info className="w-4 h-4 text-gray-600" />;
      default: return <Info className="w-4 h-4 text-gray-600" />;
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-emerald-600';
      case 'medium': return 'text-blue-600';
      case 'low': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const filteredRecommendations = recommendations.filter(rec => {
    if (activeFilter === 'all') return true;
    return rec.category === activeFilter;
  });

  const categories = ['all', 'simplification', 'structural', 'performance', 'security', 'scalability', 'maintainability'];

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-emerald-500" />
            AI Recommendations
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRefreshRecommendations}
            disabled={isLoading}
            data-testid="button-refresh-recommendations"
          >
            {isLoading ? 'Analyzing...' : 'Refresh'}
          </Button>
        </div>
        
        {/* Category filters */}
        <div className="flex flex-wrap gap-1 mt-3">
          {categories.map(category => (
            <Button
              key={category}
              variant={activeFilter === category ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveFilter(category)}
              className="text-xs capitalize"
              data-testid={`button-filter-${category}`}
            >
              {category === 'all' ? 'All' : category}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        {filteredRecommendations.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Lightbulb className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
            <p>No recommendations available.</p>
            <p className="text-sm mt-1">Add more context to get AI-powered suggestions.</p>
          </div>
        ) : (
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {filteredRecommendations.map((recommendation) => (
                <Card key={recommendation.id} className="border-l-4 border-l-emerald-500">
                  <CardContent className="p-4">
                    <Collapsible>
                      <CollapsibleTrigger 
                        className="w-full"
                        onClick={() => toggleExpanded(recommendation.id)}
                        data-testid={`button-expand-recommendation-${recommendation.id}`}
                      >
                        <div className="flex items-start justify-between w-full">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="flex-shrink-0 mt-0.5">
                              {getPriorityIcon(recommendation.priority)}
                            </div>
                            <div className="flex-1 text-left">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-medium">{recommendation.title}</h4>
                                <Badge className={getCategoryColor(recommendation.category)}>
                                  {getCategoryIcon(recommendation.category)}
                                  <span className="ml-1 capitalize">{recommendation.category}</span>
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {recommendation.description}
                              </p>
                              <div className="flex items-center gap-4 text-xs">
                                <span className="flex items-center gap-1">
                                  <span className="font-medium">Impact:</span>
                                  <span className={getImpactColor(recommendation.impact)}>
                                    {recommendation.impact}
                                  </span>
                                </span>
                                <span className="flex items-center gap-1">
                                  <span className="font-medium">Effort:</span>
                                  <span className={getEffortColor(recommendation.effort)}>
                                    {recommendation.effort}
                                  </span>
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {recommendation.estimatedTimeline}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                onApplyRecommendation(recommendation.id);
                              }}
                              data-testid={`button-apply-recommendation-${recommendation.id}`}
                            >
                              Apply
                            </Button>
                            {expandedRecommendations.has(recommendation.id) ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                          </div>
                        </div>
                      </CollapsibleTrigger>

                      <CollapsibleContent className="mt-4">
                        <div className="space-y-4 border-t pt-4">
                          {/* Rationale */}
                          <div>
                            <h5 className="font-medium mb-2">Rationale</h5>
                            <p className="text-sm text-muted-foreground">{recommendation.rationale}</p>
                          </div>

                          {/* Implementation Steps */}
                          <div>
                            <h5 className="font-medium mb-2">Implementation Steps</h5>
                            <ol className="text-sm space-y-1">
                              {recommendation.implementationSteps.map((step, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <span className="flex-shrink-0 w-5 h-5 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center text-xs font-medium">
                                    {index + 1}
                                  </span>
                                  <span>{step}</span>
                                </li>
                              ))}
                            </ol>
                          </div>

                          {/* Benefits and Risks */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h5 className="font-medium mb-2 flex items-center gap-1">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                Benefits
                              </h5>
                              <ul className="text-sm space-y-1">
                                {recommendation.benefits.map((benefit, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <span className="text-green-600 mt-1">•</span>
                                    <span>{benefit}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div>
                              <h5 className="font-medium mb-2 flex items-center gap-1">
                                <AlertTriangle className="w-4 h-4 text-amber-600" />
                                Risks & Tradeoffs
                              </h5>
                              <ul className="text-sm space-y-1">
                                {recommendation.risks.map((risk, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <span className="text-amber-600 mt-1">•</span>
                                    <span>{risk}</span>
                                  </li>
                                ))}
                                {recommendation.tradeoffs.map((tradeoff, index) => (
                                  <li key={`tradeoff-${index}`} className="flex items-start gap-2">
                                    <span className="text-amber-600 mt-1">•</span>
                                    <span>{tradeoff}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          {/* Suggested Changes */}
                          {recommendation.suggestions.length > 0 && (
                            <div>
                              <h5 className="font-medium mb-2">Suggested Changes</h5>
                              <div className="space-y-2">
                                {recommendation.suggestions.map((suggestion, index) => (
                                  <div 
                                    key={index} 
                                    className="p-3 bg-muted rounded-lg text-sm"
                                  >
                                    <div className="flex items-center gap-2 mb-1">
                                      <ArrowRight className="w-3 h-3 text-emerald-600" />
                                      <span className="font-medium capitalize">
                                        {suggestion.type.replace('_', ' ')}
                                      </span>
                                    </div>
                                    <p>{suggestion.explanation}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Dependencies and Conflicts */}
                          {(recommendation.dependsOn?.length || recommendation.conflictsWith?.length) && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {recommendation.dependsOn && recommendation.dependsOn.length > 0 && (
                                <div>
                                  <h5 className="font-medium mb-2">Dependencies</h5>
                                  <ul className="text-sm space-y-1">
                                    {recommendation.dependsOn.map((dep, index) => (
                                      <li key={index} className="text-muted-foreground">
                                        • {dep}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {recommendation.conflictsWith && recommendation.conflictsWith.length > 0 && (
                                <div>
                                  <h5 className="font-medium mb-2">Conflicts With</h5>
                                  <ul className="text-sm space-y-1">
                                    {recommendation.conflictsWith.map((conflict, index) => (
                                      <li key={index} className="text-red-600">
                                        • {conflict}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}