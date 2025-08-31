import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Save, 
  Send, 
  Plus, 
  X,
  Building, 
  Users, 
  FileText, 
  GitBranch,
  Calendar,
  AlertTriangle,
  Target,
  Clock,
  User,
  Tag,
  Link,
  XCircle,
  Wrench
} from 'lucide-react';
import { detectTechnicalDebtRisk, TechnicalDebtRiskIndicators } from '@/utils/technical-debt-detection';
import { TechnicalDebtPrompt } from '@/components/dialogs/technical-debt-prompt';
import { PortfolioAssociationForm } from '@/components/portfolio/portfolio-association-form';
import { AppLayout } from '@/components/layout/app-layout';

interface TicketFormData {
  type: 'architecture_review' | 'architect_request' | 'adr' | 'change_request' | 'technical_debt' | '';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical' | 'urgent' | '';
  severity?: 'minor' | 'major' | 'critical' | 'blocker' | '';
  businessJustification: string;
  technicalImpact: string;
  riskAssessment: 'low' | 'medium' | 'high' | 'critical' | '';
  estimatedEffort: string;
  dueDate: string;
  targetResolution: string;
  assignee: string;
  reviewers: string[];
  watchers: string[];
  labels: string[];
  linkedObjects: Array<{
    type: string;
    id: string;
    name: string;
    linkType: string;
  }>;

  // Portfolio association
  portfolioAssociation?: {
    level1: {
      id: string;
      name: string;
      type: 'portfolio' | 'division' | 'business_unit';
    };
    level2: {
      id: string;
      name: string;
      type: 'product' | 'program' | 'project' | 'initiative';
    };
    level3?: {
      id: string;
      name: string;
      type: 'product' | 'program' | 'project' | 'initiative';
    };
    externalRef?: {
      system: string;
      projectKey: string;
      projectName: string;
      url?: string;
    };
  };
  
  // Architecture Review specific fields
  projectName?: string;
  businessDomain?: string;
  stakeholders?: string[];
  proposedSolution?: string;
  alternativesConsidered?: string[];
  architecturalConcerns?: string[];
  complianceRequirements?: string[];
  performanceRequirements?: string;
  securityRequirements?: string;
  scalabilityRequirements?: string;
  integrationPoints?: string[];
  dataFlows?: string[];
  deploymentModel?: string;
  technologyStack?: string[];
  budgetConstraints?: string;
  timelineConstraints?: string;
  expectedOutcomes?: string[];
  
  // Architect Request specific fields
  projectDescription?: string;
  businessObjectives?: string[];
  projectDuration?: string;
  teamSize?: number;
  budgetRange?: string;
  requiredSkills?: string[];
  preferredArchitect?: string;
  urgency?: string;
  projectPhase?: 'planning' | 'design' | 'implementation' | 'maintenance' | '';
  technologyDomains?: string[];
  complexityLevel?: 'low' | 'medium' | 'high' | 'expert' | '';
  deliverables?: string[];
  successCriteria?: string[];
  riskFactors?: string[];
  
  // ADR specific fields
  decisionCategory?: 'strategic' | 'technical' | 'security' | 'data' | 'infrastructure' | '';
  architecturalLayer?: 'business' | 'application' | 'data' | 'technology' | 'security' | '';
  scope?: 'enterprise' | 'domain' | 'application' | 'component' | '';
  context?: string;
  decision?: string;
  alternatives?: Array<{
    option: string;
    pros: string[];
    cons: string[];
    effort: string;
    risk: string;
  }>;
  consequences?: Array<{
    type: 'positive' | 'negative' | 'neutral';
    description: string;
    impact: 'low' | 'medium' | 'high';
    timeframe: 'immediate' | 'short_term' | 'long_term';
  }>;
  technicalDebtScore?: number;
  maintenanceImpact?: string;
  operationalImpact?: string;
  affectedSystems?: string[];
  reviewCriteria?: string[];

  // Technical Debt specific fields
  debtType?: 'code_quality' | 'architecture' | 'documentation' | 'testing' | 'security' | 'performance' | 'maintenance' | '';
  debtSeverity?: 'low' | 'medium' | 'high' | 'critical' | '';
  debtScore?: number;
  currentProblem?: string;
  businessImpact?: string;
}

function CreateTicketContent() {
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState<TicketFormData>({
    type: '',
    title: '',
    description: '',
    priority: '',
    businessJustification: '',
    technicalImpact: '',
    riskAssessment: 'medium',
    estimatedEffort: '',
    dueDate: '',
    targetResolution: '',
    assignee: '',
    reviewers: [],
    watchers: [],
    labels: [],
    linkedObjects: []
  });

  const [currentReviewer, setCurrentReviewer] = useState('');
  const [currentWatcher, setCurrentWatcher] = useState('');
  const [currentLabel, setCurrentLabel] = useState('');
  const [activeTab, setActiveTab] = useState('basic');
  const [showDebtPrompt, setShowDebtPrompt] = useState(false);
  const [debtRiskIndicators, setDebtRiskIndicators] = useState<TechnicalDebtRiskIndicators | null>(null);

  // Load pre-populated debt ticket data if coming from ADR
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('from') === 'adr' && searchParams.get('type') === 'technical_debt') {
      const draftData = localStorage.getItem('debt-ticket-draft');
      if (draftData) {
        const draft = JSON.parse(draftData);
        setFormData(prev => ({ ...prev, ...draft }));
        localStorage.removeItem('debt-ticket-draft'); // Clean up
      }
    }
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'architecture_review': return Building;
      case 'architect_request': return Users;
      case 'adr': return FileText;
      case 'change_request': return GitBranch;
      case 'technical_debt': return Wrench;
      default: return FileText;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'architecture_review': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'architect_request': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      case 'adr': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300';
      case 'change_request': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300';
      case 'technical_debt': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-300';
    }
  };

  const handleInputChange = (field: keyof TicketFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addToArray = (field: 'reviewers' | 'watchers' | 'labels', value: string) => {
    if (value && !formData[field].includes(value)) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value]
      }));
    }
  };

  const removeFromArray = (field: 'reviewers' | 'watchers' | 'labels', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter(item => item !== value)
    }));
  };

  const handleSave = (asDraft: boolean = true) => {
    // Generate ticket number
    const typePrefix = formData.type ? {
      'architecture_review': 'ARR',
      'architect_request': 'ARCH',
      'adr': 'ADR',
      'change_request': 'CHG',
      'technical_debt': 'DEBT'
    }[formData.type] : 'TKT';
    
    const ticketNumber = `${typePrefix}-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
    
    const ticketData = {
      ...formData,
      id: `TKT-${Date.now()}`,
      ticketNumber,
      status: asDraft ? 'open' : 'in_progress',
      reporter: 'Current User', // Would be actual user in real app
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Check for technical debt risk if this is an ADR
    if (formData.type === 'adr' && !asDraft) {
      const riskIndicators = detectTechnicalDebtRisk({
        technicalDebtScore: formData.technicalDebtScore,
        riskAssessment: formData.riskAssessment,
        decisionCategory: formData.decisionCategory,
        consequences: formData.consequences,
        maintenanceImpact: formData.maintenanceImpact,
        operationalImpact: formData.operationalImpact,
        affectedSystems: formData.affectedSystems,
        context: formData.context,
        decision: formData.decision,
        title: formData.title
      });

      if (riskIndicators.highRisk) {
        // Save the ADR first
        localStorage.setItem(`ticket-${ticketData.id}`, JSON.stringify(ticketData));
        
        // Then show the technical debt prompt
        setDebtRiskIndicators(riskIndicators);
        setShowDebtPrompt(true);
        return; // Don't navigate yet, wait for debt ticket decision
      }
    }

    console.log('Saving ticket:', ticketData);
    
    // In real app, this would save to backend
    localStorage.setItem(`ticket-${ticketData.id}`, JSON.stringify(ticketData));
    
    navigate('/tickets');
  };

  const handleCreateDebtTicket = (autoPopulate: boolean) => {
    if (!debtRiskIndicators) return;

    const debtTicketData = {
      type: 'technical_debt',
      title: autoPopulate ? debtRiskIndicators.autoGeneratedTitle : '',
      description: autoPopulate ? 'Technical debt ticket auto-generated from ADR' : '',
      priority: 'medium' as const,
      businessJustification: '',
      technicalImpact: '',
      riskAssessment: 'medium' as const,
      estimatedEffort: '',
      dueDate: '',
      targetResolution: '',
      assignee: '',
      reviewers: [],
      watchers: [],
      labels: autoPopulate ? ['auto-generated', 'adr-derived'] : [],
      linkedObjects: autoPopulate ? [{
        id: '',
        type: 'adr',
        title: formData.title,
        ticketNumber: '',
        relationship: 'derived_from'
      }] : [],
      
      // Technical Debt specific fields
      debtType: debtRiskIndicators.suggestedDebtType,
      debtSeverity: debtRiskIndicators.suggestedSeverity,
      debtScore: Math.floor(debtRiskIndicators.riskScore / 10), // Convert to 1-10 scale
      currentProblem: autoPopulate ? debtRiskIndicators.autoGeneratedProblem : '',
      proposedSolution: autoPopulate ? debtRiskIndicators.autoGeneratedSolution : '',
      businessImpact: autoPopulate ? 'Impact analysis needed based on ADR consequences' : ''
    };

    if (autoPopulate) {
      // Auto-generate and save the technical debt ticket
      const debtTicketNumber = `DEBT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
      const fullDebtTicket = {
        ...debtTicketData,
        id: `TKT-${Date.now() + 1}`, // Ensure unique ID
        ticketNumber: debtTicketNumber,
        status: 'open',
        reporter: 'ARKITEKTON System Agent',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Save the technical debt ticket
      localStorage.setItem(`ticket-${fullDebtTicket.id}`, JSON.stringify(fullDebtTicket));
      
      // Update the original ADR ticket to link back to the debt ticket
      const adrTicketData = JSON.parse(localStorage.getItem(`ticket-${ticketData.id}`) || '{}');
      if (adrTicketData.id) {
        adrTicketData.linkedObjects = adrTicketData.linkedObjects || [];
        adrTicketData.linkedObjects.push({
          id: fullDebtTicket.id,
          type: 'technical_debt',
          title: fullDebtTicket.title,
          ticketNumber: fullDebtTicket.ticketNumber,
          relationship: 'generates'
        });
        localStorage.setItem(`ticket-${adrTicketData.id}`, JSON.stringify(adrTicketData));
      }
      
      navigate('/tickets');
    } else {
      // Navigate to creation form with pre-populated data
      localStorage.setItem('debt-ticket-draft', JSON.stringify(debtTicketData));
      navigate('/tickets/new?type=technical_debt&from=adr');
    }
  };

  const TypeIcon = getTypeIcon(formData.type);

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/tickets')}
              className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tickets
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-emerald-800 dark:from-white dark:via-slate-200 dark:to-emerald-200 bg-clip-text text-transparent">
                Create New Ticket
              </h1>
              <p className="text-slate-600 dark:text-slate-300 mt-2">
                Create a new architecture ticket for review, assignment, or decision tracking
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={() => navigate('/tickets')}
              className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-red-200 hover:border-red-300 text-red-600 hover:text-red-700"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSave(true)}
              className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            <Button
              onClick={() => handleSave(false)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
              disabled={!formData.type || !formData.title}
            >
              <Send className="h-4 w-4 mr-2" />
              Create Ticket
            </Button>
          </div>
        </div>

        {/* Ticket Type Selection */}
        {!formData.type && (
          <Card className="mb-8 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
            <CardHeader>
              <CardTitle>Select Ticket Type</CardTitle>
              <p className="text-slate-600 dark:text-slate-300">
                Choose the type of ticket you want to create
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    type: 'architecture_review',
                    title: 'Architecture Review Request',
                    description: 'Request review of architectural decisions and designs',
                    icon: Building
                  },
                  {
                    type: 'architect_request',
                    title: 'Architect Assignment Request',
                    description: 'Request architect assignment for projects',
                    icon: Users
                  },
                  {
                    type: 'adr',
                    title: 'Architecture Decision Record',
                    description: 'Document and track architectural decisions',
                    icon: FileText
                  },
                  {
                    type: 'change_request',
                    title: 'Change Request',
                    description: 'Request changes to existing architecture',
                    icon: GitBranch
                  },
                  {
                    type: 'technical_debt',
                    title: 'Technical Debt',
                    description: 'Track and manage technical debt items',
                    icon: Wrench
                  }
                ].map((ticketType) => {
                  const Icon = ticketType.icon;
                  return (
                    <Card
                      key={ticketType.type}
                      className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-emerald-200 dark:hover:border-emerald-700 bg-white dark:bg-slate-800"
                      onClick={() => handleInputChange('type', ticketType.type)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-lg flex items-center justify-center">
                            <Icon className="h-6 w-6 text-emerald-600" />
                          </div>
                          <div>
                            <h3 className="font-black text-xl text-slate-900 dark:text-white mb-2">
                              {ticketType.title}
                            </h3>
                            <p className="text-base font-bold text-slate-700 dark:text-slate-100">
                              {ticketType.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Form */}
        {formData.type && (
          <div className="space-y-8">
            {/* Ticket Type Header */}
            <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-lg flex items-center justify-center">
                      <TypeIcon className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <Badge className={getTypeColor(formData.type)} variant="outline">
                        {formData.type.replace('_', ' ')}
                      </Badge>
                      <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-1">
                        {formData.type === 'architecture_review' && <span className="font-bold text-black dark:text-white">Architecture Review Request</span>}
                        {formData.type === 'architect_request' && <span className="font-bold text-black dark:text-white">Architect Assignment Request</span>}
                        {formData.type === 'adr' && <span className="font-bold text-black dark:text-white">Architecture Decision Record</span>}
                        {formData.type === 'change_request' && <span className="font-bold text-black dark:text-white">Change Request</span>}
                        {formData.type === 'technical_debt' && <span className="font-bold text-black dark:text-white">Technical Debt</span>}
                      </h2>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleInputChange('type', '')}
                  >
                    Change Type
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Form Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Overview</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="assignments">Assignments</TabsTrigger>
                <TabsTrigger value="metadata">Metadata</TabsTrigger>
              </TabsList>

              {/* Basic Information Tab */}
              <TabsContent value="basic" className="mt-6">
                <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
                  <CardHeader>
                    <CardTitle>Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title *</Label>
                        <Input
                          id="title"
                          placeholder="Enter ticket title"
                          value={formData.title}
                          onChange={(e) => handleInputChange('title', e.target.value)}
                          className="bg-white/70 dark:bg-slate-800/70"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="priority">Priority *</Label>
                        <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                          <SelectTrigger className="bg-white/70 dark:bg-slate-800/70">
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        placeholder="Provide detailed description"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        rows={4}
                        className="bg-white/70 dark:bg-slate-800/70"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="riskAssessment">Risk Assessment</Label>
                        <Select value={formData.riskAssessment} onValueChange={(value) => handleInputChange('riskAssessment', value)}>
                          <SelectTrigger className="bg-white/70 dark:bg-slate-800/70">
                            <SelectValue placeholder="Select risk level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low Risk</SelectItem>
                            <SelectItem value="medium">Medium Risk</SelectItem>
                            <SelectItem value="high">High Risk</SelectItem>
                            <SelectItem value="critical">Critical Risk</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="estimatedEffort">Estimated Effort</Label>
                        <Input
                          id="estimatedEffort"
                          placeholder="e.g., 2-3 weeks"
                          value={formData.estimatedEffort}
                          onChange={(e) => handleInputChange('estimatedEffort', e.target.value)}
                          className="bg-white/70 dark:bg-slate-800/70"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Details Tab */}
              <TabsContent value="details" className="mt-6">
                <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
                  <CardHeader>
                    <CardTitle>Detailed Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="businessJustification">Business Justification</Label>
                      <Textarea
                        id="businessJustification"
                        placeholder="Explain the business rationale"
                        value={formData.businessJustification}
                        onChange={(e) => handleInputChange('businessJustification', e.target.value)}
                        rows={3}
                        className="bg-white/70 dark:bg-slate-800/70"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="technicalImpact">Technical Impact</Label>
                      <Textarea
                        id="technicalImpact"
                        placeholder="Describe technical implications"
                        value={formData.technicalImpact}
                        onChange={(e) => handleInputChange('technicalImpact', e.target.value)}
                        rows={3}
                        className="bg-white/70 dark:bg-slate-800/70"
                      />
                    </div>

                    {/* Type-specific fields */}
                    {formData.type === 'architecture_review' && (
                      <div className="space-y-6 pt-6 border-t border-slate-200/50 dark:border-slate-700/50">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Architecture Review Details</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="projectName">Project Name</Label>
                            <Input
                              id="projectName"
                              placeholder="Enter project name"
                              value={formData.projectName || ''}
                              onChange={(e) => handleInputChange('projectName', e.target.value)}
                              className="bg-white/70 dark:bg-slate-800/70"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="businessDomain">Business Domain</Label>
                            <Input
                              id="businessDomain"
                              placeholder="e.g., Customer Experience"
                              value={formData.businessDomain || ''}
                              onChange={(e) => handleInputChange('businessDomain', e.target.value)}
                              className="bg-white/70 dark:bg-slate-800/70"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="proposedSolution">Proposed Solution</Label>
                          <Textarea
                            id="proposedSolution"
                            placeholder="Describe the proposed architectural solution"
                            value={formData.proposedSolution || ''}
                            onChange={(e) => handleInputChange('proposedSolution', e.target.value)}
                            rows={4}
                            className="bg-white/70 dark:bg-slate-800/70"
                          />
                        </div>
                      </div>
                    )}

                    {formData.type === 'architect_request' && (
                      <div className="space-y-6 pt-6 border-t border-slate-200/50 dark:border-slate-700/50">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Architect Request Details</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="projectDuration">Project Duration</Label>
                            <Input
                              id="projectDuration"
                              placeholder="e.g., 6 months"
                              value={formData.projectDuration || ''}
                              onChange={(e) => handleInputChange('projectDuration', e.target.value)}
                              className="bg-white/70 dark:bg-slate-800/70"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="teamSize">Team Size</Label>
                            <Input
                              id="teamSize"
                              type="number"
                              placeholder="8"
                              value={formData.teamSize || ''}
                              onChange={(e) => handleInputChange('teamSize', parseInt(e.target.value))}
                              className="bg-white/70 dark:bg-slate-800/70"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="complexityLevel">Complexity Level</Label>
                            <Select value={formData.complexityLevel} onValueChange={(value) => handleInputChange('complexityLevel', value)}>
                              <SelectTrigger className="bg-white/70 dark:bg-slate-800/70">
                                <SelectValue placeholder="Select complexity" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="expert">Expert</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="projectDescription">Project Description</Label>
                          <Textarea
                            id="projectDescription"
                            placeholder="Describe the project requirements"
                            value={formData.projectDescription || ''}
                            onChange={(e) => handleInputChange('projectDescription', e.target.value)}
                            rows={4}
                            className="bg-white/70 dark:bg-slate-800/70"
                          />
                        </div>
                      </div>
                    )}

                    {formData.type === 'adr' && (
                      <div className="space-y-6 pt-6 border-t border-slate-200/50 dark:border-slate-700/50">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Decision Record Details</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="decisionCategory">Decision Category</Label>
                            <Select value={formData.decisionCategory} onValueChange={(value) => handleInputChange('decisionCategory', value)}>
                              <SelectTrigger className="bg-white/70 dark:bg-slate-800/70">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="strategic">Strategic</SelectItem>
                                <SelectItem value="technical">Technical</SelectItem>
                                <SelectItem value="security">Security</SelectItem>
                                <SelectItem value="data">Data</SelectItem>
                                <SelectItem value="infrastructure">Infrastructure</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="architecturalLayer">Architectural Layer</Label>
                            <Select value={formData.architecturalLayer} onValueChange={(value) => handleInputChange('architecturalLayer', value)}>
                              <SelectTrigger className="bg-white/70 dark:bg-slate-800/70">
                                <SelectValue placeholder="Select layer" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="business">Business</SelectItem>
                                <SelectItem value="application">Application</SelectItem>
                                <SelectItem value="data">Data</SelectItem>
                                <SelectItem value="technology">Technology</SelectItem>
                                <SelectItem value="security">Security</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="scope">Scope</Label>
                            <Select value={formData.scope} onValueChange={(value) => handleInputChange('scope', value)}>
                              <SelectTrigger className="bg-white/70 dark:bg-slate-800/70">
                                <SelectValue placeholder="Select scope" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="enterprise">Enterprise</SelectItem>
                                <SelectItem value="domain">Domain</SelectItem>
                                <SelectItem value="application">Application</SelectItem>
                                <SelectItem value="component">Component</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="context">Context</Label>
                          <Textarea
                            id="context"
                            placeholder="Describe the decision context"
                            value={formData.context || ''}
                            onChange={(e) => handleInputChange('context', e.target.value)}
                            rows={3}
                            className="bg-white/70 dark:bg-slate-800/70"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="decision">Decision</Label>
                          <Textarea
                            id="decision"
                            placeholder="State the architectural decision"
                            value={formData.decision || ''}
                            onChange={(e) => handleInputChange('decision', e.target.value)}
                            rows={3}
                            className="bg-white/70 dark:bg-slate-800/70"
                          />
                        </div>
                      </div>
                    )}

                    {formData.type === 'technical_debt' && (
                      <div className="space-y-6 pt-6 border-t border-slate-200/50 dark:border-slate-700/50">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Technical Debt Details</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="debtType">Debt Type</Label>
                            <Select value={formData.debtType} onValueChange={(value) => handleInputChange('debtType', value)}>
                              <SelectTrigger className="bg-white/70 dark:bg-slate-800/70">
                                <SelectValue placeholder="Select debt type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="code_quality">Code Quality</SelectItem>
                                <SelectItem value="architecture">Architecture</SelectItem>
                                <SelectItem value="documentation">Documentation</SelectItem>
                                <SelectItem value="testing">Testing</SelectItem>
                                <SelectItem value="security">Security</SelectItem>
                                <SelectItem value="performance">Performance</SelectItem>
                                <SelectItem value="maintenance">Maintenance</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="debtSeverity">Debt Severity</Label>
                            <Select value={formData.debtSeverity} onValueChange={(value) => handleInputChange('debtSeverity', value)}>
                              <SelectTrigger className="bg-white/70 dark:bg-slate-800/70">
                                <SelectValue placeholder="Select severity" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="critical">Critical</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="debtScore">Debt Score (1-10)</Label>
                            <Input
                              id="debtScore"
                              type="number"
                              min="1"
                              max="10"
                              placeholder="8"
                              value={formData.debtScore || ''}
                              onChange={(e) => handleInputChange('debtScore', parseInt(e.target.value))}
                              className="bg-white/70 dark:bg-slate-800/70"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="currentProblem">Current Problem</Label>
                          <Textarea
                            id="currentProblem"
                            placeholder="Describe the current technical debt issue"
                            value={formData.currentProblem || ''}
                            onChange={(e) => handleInputChange('currentProblem', e.target.value)}
                            rows={3}
                            className="bg-white/70 dark:bg-slate-800/70"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="proposedSolution">Proposed Solution</Label>
                          <Textarea
                            id="proposedSolution"
                            placeholder="Describe how to resolve this technical debt"
                            value={formData.proposedSolution || ''}
                            onChange={(e) => handleInputChange('proposedSolution', e.target.value)}
                            rows={3}
                            className="bg-white/70 dark:bg-slate-800/70"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="affectedSystems">Affected Systems</Label>
                            <Input
                              id="affectedSystems"
                              placeholder="e.g., Payment Service, User API"
                              value={formData.affectedSystems || ''}
                              onChange={(e) => handleInputChange('affectedSystems', e.target.value)}
                              className="bg-white/70 dark:bg-slate-800/70"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="businessImpact">Business Impact</Label>
                            <Input
                              id="businessImpact"
                              placeholder="How does this affect business operations?"
                              value={formData.businessImpact || ''}
                              onChange={(e) => handleInputChange('businessImpact', e.target.value)}
                              className="bg-white/70 dark:bg-slate-800/70"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Assignments Tab */}
              <TabsContent value="assignments" className="mt-6">
                <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
                  <CardHeader>
                    <CardTitle>Assignments & Timeline</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="assignee">Assignee</Label>
                        <Input
                          id="assignee"
                          placeholder="Enter assignee name"
                          value={formData.assignee}
                          onChange={(e) => handleInputChange('assignee', e.target.value)}
                          className="bg-white/70 dark:bg-slate-800/70"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dueDate">Due Date</Label>
                        <Input
                          id="dueDate"
                          type="date"
                          value={formData.dueDate}
                          onChange={(e) => handleInputChange('dueDate', e.target.value)}
                          className="bg-white/70 dark:bg-slate-800/70"
                        />
                      </div>
                    </div>

                    {/* Reviewers */}
                    <div className="space-y-4">
                      <Label>Reviewers</Label>
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Add reviewer"
                          value={currentReviewer}
                          onChange={(e) => setCurrentReviewer(e.target.value)}
                          className="bg-white/70 dark:bg-slate-800/70"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              addToArray('reviewers', currentReviewer);
                              setCurrentReviewer('');
                            }
                          }}
                        />
                        <Button
                          type="button"
                          onClick={() => {
                            addToArray('reviewers', currentReviewer);
                            setCurrentReviewer('');
                          }}
                          disabled={!currentReviewer}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.reviewers.map((reviewer, index) => (
                          <Badge key={index} variant="outline" className="flex items-center space-x-1">
                            <User className="h-3 w-3" />
                            <span>{reviewer}</span>
                            <X
                              className="h-3 w-3 cursor-pointer hover:text-red-500"
                              onClick={() => removeFromArray('reviewers', reviewer)}
                            />
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Watchers */}
                    <div className="space-y-4">
                      <Label>Watchers</Label>
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Add watcher"
                          value={currentWatcher}
                          onChange={(e) => setCurrentWatcher(e.target.value)}
                          className="bg-white/70 dark:bg-slate-800/70"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              addToArray('watchers', currentWatcher);
                              setCurrentWatcher('');
                            }
                          }}
                        />
                        <Button
                          type="button"
                          onClick={() => {
                            addToArray('watchers', currentWatcher);
                            setCurrentWatcher('');
                          }}
                          disabled={!currentWatcher}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.watchers.map((watcher, index) => (
                          <Badge key={index} variant="outline" className="flex items-center space-x-1">
                            <User className="h-3 w-3" />
                            <span>{watcher}</span>
                            <X
                              className="h-3 w-3 cursor-pointer hover:text-red-500"
                              onClick={() => removeFromArray('watchers', watcher)}
                            />
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Metadata Tab */}
              <TabsContent value="metadata" className="mt-6">
                <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
                  <CardHeader>
                    <CardTitle>Labels & Links</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Labels */}
                    <div className="space-y-4">
                      <Label>Labels</Label>
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Add label"
                          value={currentLabel}
                          onChange={(e) => setCurrentLabel(e.target.value)}
                          className="bg-white/70 dark:bg-slate-800/70"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              addToArray('labels', currentLabel);
                              setCurrentLabel('');
                            }
                          }}
                        />
                        <Button
                          type="button"
                          onClick={() => {
                            addToArray('labels', currentLabel);
                            setCurrentLabel('');
                          }}
                          disabled={!currentLabel}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.labels.map((label, index) => (
                          <Badge key={index} variant="outline" className="flex items-center space-x-1">
                            <Tag className="h-3 w-3" />
                            <span>{label}</span>
                            <X
                              className="h-3 w-3 cursor-pointer hover:text-red-500"
                              onClick={() => removeFromArray('labels', label)}
                            />
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Portfolio Association */}
                    <div className="space-y-4">
                      <PortfolioAssociationForm
                        value={formData.portfolioAssociation}
                        onChange={(value) => handleInputChange('portfolioAssociation', value)}
                      />
                    </div>

                    {/* Linked Objects */}
                    <div className="space-y-4">
                      <Label>Linked Objects</Label>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        Link this ticket to relevant architecture components, decisions, or capabilities
                      </p>
                      <Button variant="outline" className="w-full">
                        <Link className="h-4 w-4 mr-2" />
                        Add Linked Object
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Technical Debt Risk Prompt */}
        {showDebtPrompt && debtRiskIndicators && (
          <TechnicalDebtPrompt
            isOpen={showDebtPrompt}
            onClose={() => {
              setShowDebtPrompt(false);
              navigate('/tickets');
            }}
            riskIndicators={debtRiskIndicators}
            adrData={{
              title: formData.title,
              ticketNumber: `ADR-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`
            }}
            onCreateDebtTicket={handleCreateDebtTicket}
          />
        )}
      </div>
    </div>
  );
}

export function CreateTicketPage() {
  return (
    <AppLayout>
      <CreateTicketContent />
    </AppLayout>
  );
}

export default CreateTicketPage;