import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Plus, 
  Trash2, 
  Target, 
  Users, 
  Lightbulb, 
  AlertTriangle,
  Clock,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface BusinessStrategyInput {
  objectives: string[];
  constraints: string[];
  timeline: string;
  budget?: string;
  scalabilityTargets?: string[];
  complianceRequirements?: string[];
}

interface FunctionalRequirement {
  id: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
}

interface NonFunctionalRequirement {
  id: string;
  type: 'performance' | 'security' | 'scalability' | 'usability' | 'reliability' | 'maintainability';
  description: string;
  target: string;
  priority: 'high' | 'medium' | 'low';
}

interface RequirementsInput {
  functionalRequirements: FunctionalRequirement[];
  nonFunctionalRequirements: NonFunctionalRequirement[];
  userStories?: string[];
  acceptanceCriteria?: string[];
}

interface UserJourney {
  id: string;
  persona: string;
  steps: string[];
  touchpoints: string[];
  painPoints?: string[];
}

interface UXDesignInput {
  userJourneys: UserJourney[];
  wireframes?: string[];
  designPatterns?: string[];
  accessibilityRequirements?: string[];
  deviceTargets?: string[];
}

interface ProposedChangesInput {
  goals: string[];
  constraints: string[];
  timeline: string;
  riskTolerance: 'low' | 'medium' | 'high';
}

interface ArchitecturalContext {
  businessStrategy?: BusinessStrategyInput;
  requirements?: RequirementsInput;
  uxDesign?: UXDesignInput;
  proposedChanges?: ProposedChangesInput;
}

interface ContextInputDialogProps {
  onSubmit: (context: ArchitecturalContext) => void;
  isLoading?: boolean;
  trigger?: React.ReactNode;
}

export function ContextInputDialog({ onSubmit, isLoading = false, trigger }: ContextInputDialogProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('business');
  
  // Business Strategy State
  const [objectives, setObjectives] = useState<string[]>(['']);
  const [constraints, setConstraints] = useState<string[]>(['']);
  const [timeline, setTimeline] = useState('');
  const [budget, setBudget] = useState('');
  const [scalabilityTargets, setScalabilityTargets] = useState<string[]>(['']);
  const [complianceRequirements, setComplianceRequirements] = useState<string[]>(['']);

  // Requirements State
  const [functionalReqs, setFunctionalReqs] = useState<FunctionalRequirement[]>([
    { id: '1', description: '', priority: 'medium', category: '' }
  ]);
  const [nonFunctionalReqs, setNonFunctionalReqs] = useState<NonFunctionalRequirement[]>([
    { id: '1', type: 'performance', description: '', target: '', priority: 'medium' }
  ]);
  const [userStories, setUserStories] = useState<string[]>(['']);
  const [acceptanceCriteria, setAcceptanceCriteria] = useState<string[]>(['']);

  // UX Design State
  const [userJourneys, setUserJourneys] = useState<UserJourney[]>([
    { id: '1', persona: '', steps: [''], touchpoints: [''], painPoints: [''] }
  ]);
  const [designPatterns, setDesignPatterns] = useState<string[]>(['']);
  const [accessibilityReqs, setAccessibilityReqs] = useState<string[]>(['']);
  const [deviceTargets, setDeviceTargets] = useState<string[]>(['']);

  // Proposed Changes State
  const [changeGoals, setChangeGoals] = useState<string[]>(['']);
  const [changeConstraints, setChangeConstraints] = useState<string[]>(['']);
  const [changeTimeline, setChangeTimeline] = useState('');
  const [riskTolerance, setRiskTolerance] = useState<'low' | 'medium' | 'high'>('medium');

  const handleSubmit = () => {
    const context: ArchitecturalContext = {
      businessStrategy: {
        objectives: objectives.filter(obj => obj.trim()),
        constraints: constraints.filter(con => con.trim()),
        timeline,
        budget: budget || undefined,
        scalabilityTargets: scalabilityTargets.filter(target => target.trim()),
        complianceRequirements: complianceRequirements.filter(req => req.trim())
      },
      requirements: {
        functionalRequirements: functionalReqs.filter(req => req.description.trim()),
        nonFunctionalRequirements: nonFunctionalReqs.filter(req => req.description.trim()),
        userStories: userStories.filter(story => story.trim()),
        acceptanceCriteria: acceptanceCriteria.filter(criteria => criteria.trim())
      },
      uxDesign: {
        userJourneys: userJourneys.filter(journey => journey.persona.trim()),
        designPatterns: designPatterns.filter(pattern => pattern.trim()),
        accessibilityRequirements: accessibilityReqs.filter(req => req.trim()),
        deviceTargets: deviceTargets.filter(target => target.trim())
      },
      proposedChanges: {
        goals: changeGoals.filter(goal => goal.trim()),
        constraints: changeConstraints.filter(con => con.trim()),
        timeline: changeTimeline,
        riskTolerance
      }
    };

    onSubmit(context);
    setOpen(false);
  };

  const addToArray = (setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter(prev => [...prev, '']);
  };

  const updateArrayItem = (
    setter: React.Dispatch<React.SetStateAction<string[]>>, 
    index: number, 
    value: string
  ) => {
    setter(prev => prev.map((item, i) => i === index ? value : item));
  };

  const removeFromArray = (
    setter: React.Dispatch<React.SetStateAction<string[]>>, 
    index: number
  ) => {
    setter(prev => prev.filter((_, i) => i !== index));
  };

  const defaultTrigger = (
    <Button variant="outline" className="gap-2">
      <Lightbulb className="w-4 h-4" />
      Add Context for AI Analysis
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-500" />
            Architectural Context for AI Analysis
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="business">Business Strategy</TabsTrigger>
            <TabsTrigger value="requirements">Requirements</TabsTrigger>
            <TabsTrigger value="ux">UX Design</TabsTrigger>
            <TabsTrigger value="changes">Proposed Changes</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[600px] w-full">
            <div className="p-1">
              <TabsContent value="business" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Business Strategy & Objectives</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Objectives */}
                    <div>
                      <Label className="text-sm font-medium">Business Objectives</Label>
                      {objectives.map((objective, index) => (
                        <div key={index} className="flex items-center gap-2 mt-2">
                          <Input
                            value={objective}
                            onChange={(e) => updateArrayItem(setObjectives, index, e.target.value)}
                            placeholder="Enter business objective..."
                            data-testid={`input-objective-${index}`}
                          />
                          {objectives.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFromArray(setObjectives, index)}
                              data-testid={`button-remove-objective-${index}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => addToArray(setObjectives)}
                        className="mt-2"
                        data-testid="button-add-objective"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Objective
                      </Button>
                    </div>

                    {/* Constraints */}
                    <div>
                      <Label className="text-sm font-medium">Constraints</Label>
                      {constraints.map((constraint, index) => (
                        <div key={index} className="flex items-center gap-2 mt-2">
                          <Input
                            value={constraint}
                            onChange={(e) => updateArrayItem(setConstraints, index, e.target.value)}
                            placeholder="Enter constraint..."
                            data-testid={`input-constraint-${index}`}
                          />
                          {constraints.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFromArray(setConstraints, index)}
                              data-testid={`button-remove-constraint-${index}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => addToArray(setConstraints)}
                        className="mt-2"
                        data-testid="button-add-constraint"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Constraint
                      </Button>
                    </div>

                    {/* Timeline and Budget */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="timeline">Timeline</Label>
                        <Input
                          id="timeline"
                          value={timeline}
                          onChange={(e) => setTimeline(e.target.value)}
                          placeholder="e.g., 6 months, Q2 2024"
                          data-testid="input-timeline"
                        />
                      </div>
                      <div>
                        <Label htmlFor="budget">Budget (Optional)</Label>
                        <Input
                          id="budget"
                          value={budget}
                          onChange={(e) => setBudget(e.target.value)}
                          placeholder="e.g., $500K, Limited budget"
                          data-testid="input-budget"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="requirements" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Functional Requirements</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {functionalReqs.map((req, index) => (
                      <div key={req.id} className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Requirement #{index + 1}</span>
                          {functionalReqs.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setFunctionalReqs(prev => prev.filter((_, i) => i !== index))}
                              data-testid={`button-remove-functional-req-${index}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="md:col-span-2">
                            <Label>Description</Label>
                            <Textarea
                              value={req.description}
                              onChange={(e) => setFunctionalReqs(prev => 
                                prev.map((r, i) => i === index ? { ...r, description: e.target.value } : r)
                              )}
                              placeholder="Describe the functional requirement..."
                              data-testid={`textarea-functional-req-description-${index}`}
                            />
                          </div>
                          <div className="space-y-3">
                            <div>
                              <Label>Priority</Label>
                              <Select
                                value={req.priority}
                                onValueChange={(value: 'high' | 'medium' | 'low') => 
                                  setFunctionalReqs(prev => 
                                    prev.map((r, i) => i === index ? { ...r, priority: value } : r)
                                  )
                                }
                              >
                                <SelectTrigger data-testid={`select-functional-req-priority-${index}`}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="high">High</SelectItem>
                                  <SelectItem value="medium">Medium</SelectItem>
                                  <SelectItem value="low">Low</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label>Category</Label>
                              <Input
                                value={req.category}
                                onChange={(e) => setFunctionalReqs(prev => 
                                  prev.map((r, i) => i === index ? { ...r, category: e.target.value } : r)
                                )}
                                placeholder="e.g., User Management"
                                data-testid={`input-functional-req-category-${index}`}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button
                      variant="ghost"
                      onClick={() => setFunctionalReqs(prev => [...prev, {
                        id: String(prev.length + 1),
                        description: '',
                        priority: 'medium',
                        category: ''
                      }])}
                      data-testid="button-add-functional-req"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Functional Requirement
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="ux" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">User Experience Design</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">User Journeys</Label>
                      {userJourneys.map((journey, index) => (
                        <div key={journey.id} className="p-4 border rounded-lg space-y-3 mt-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Journey #{index + 1}</span>
                            {userJourneys.length > 1 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setUserJourneys(prev => prev.filter((_, i) => i !== index))}
                                data-testid={`button-remove-user-journey-${index}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                          <div>
                            <Label>Persona</Label>
                            <Input
                              value={journey.persona}
                              onChange={(e) => setUserJourneys(prev => 
                                prev.map((j, i) => i === index ? { ...j, persona: e.target.value } : j)
                              )}
                              placeholder="e.g., Admin User, Customer, Manager"
                              data-testid={`input-user-journey-persona-${index}`}
                            />
                          </div>
                          <div>
                            <Label>Journey Steps</Label>
                            <Textarea
                              value={journey.steps.join('\n')}
                              onChange={(e) => setUserJourneys(prev => 
                                prev.map((j, i) => i === index ? { 
                                  ...j, 
                                  steps: e.target.value.split('\n').filter(step => step.trim()) 
                                } : j)
                              )}
                              placeholder="Enter each step on a new line..."
                              data-testid={`textarea-user-journey-steps-${index}`}
                            />
                          </div>
                        </div>
                      ))}
                      <Button
                        variant="ghost"
                        onClick={() => setUserJourneys(prev => [...prev, {
                          id: String(prev.length + 1),
                          persona: '',
                          steps: [''],
                          touchpoints: [''],
                          painPoints: ['']
                        }])}
                        className="mt-2"
                        data-testid="button-add-user-journey"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add User Journey
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="changes" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Proposed Changes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Change Goals */}
                    <div>
                      <Label className="text-sm font-medium">Change Goals</Label>
                      {changeGoals.map((goal, index) => (
                        <div key={index} className="flex items-center gap-2 mt-2">
                          <Input
                            value={goal}
                            onChange={(e) => updateArrayItem(setChangeGoals, index, e.target.value)}
                            placeholder="Enter change goal..."
                            data-testid={`input-change-goal-${index}`}
                          />
                          {changeGoals.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFromArray(setChangeGoals, index)}
                              data-testid={`button-remove-change-goal-${index}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => addToArray(setChangeGoals)}
                        className="mt-2"
                        data-testid="button-add-change-goal"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Goal
                      </Button>
                    </div>

                    {/* Timeline and Risk Tolerance */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="change-timeline">Timeline</Label>
                        <Input
                          id="change-timeline"
                          value={changeTimeline}
                          onChange={(e) => setChangeTimeline(e.target.value)}
                          placeholder="e.g., 3 months, End of Q1"
                          data-testid="input-change-timeline"
                        />
                      </div>
                      <div>
                        <Label>Risk Tolerance</Label>
                        <Select value={riskTolerance} onValueChange={setRiskTolerance}>
                          <SelectTrigger data-testid="select-risk-tolerance">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low Risk</SelectItem>
                            <SelectItem value="medium">Medium Risk</SelectItem>
                            <SelectItem value="high">High Risk</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </ScrollArea>

          <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isLoading}
              data-testid="button-submit-context"
            >
              {isLoading ? 'Analyzing...' : 'Generate AI Recommendations'}
            </Button>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}