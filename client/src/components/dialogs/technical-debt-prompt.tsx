import { useState } from 'react';
import { useLocation } from 'wouter';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  AlertTriangle, 
  Wrench, 
  TrendingUp, 
  Clock, 
  Users,
  ExternalLink,
  CheckCircle
} from 'lucide-react';
import { TechnicalDebtRiskIndicators } from '@/utils/technical-debt-detection';

interface TechnicalDebtPromptProps {
  isOpen: boolean;
  onClose: () => void;
  riskIndicators: TechnicalDebtRiskIndicators;
  adrData: {
    id?: string;
    title: string;
    ticketNumber?: string;
  };
  onCreateDebtTicket: (autoPopulate: boolean) => void;
}

export function TechnicalDebtPrompt({ 
  isOpen, 
  onClose, 
  riskIndicators, 
  adrData,
  onCreateDebtTicket 
}: TechnicalDebtPromptProps) {
  const [, navigate] = useLocation();
  const [isCreating, setIsCreating] = useState(false);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-300';
    }
  };

  const handleCreateTicket = async (autoPopulate: boolean) => {
    setIsCreating(true);
    try {
      await onCreateDebtTicket(autoPopulate);
      onClose();
    } catch (error) {
      console.error('Error creating technical debt ticket:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <DialogTitle>High Technical Debt Risk Detected</DialogTitle>
              <DialogDescription>
                This ADR introduces significant technical debt that should be tracked and managed.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Risk Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Risk Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-300">Risk Score</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(riskIndicators.riskScore, 100)}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{riskIndicators.riskScore}/100</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-300">Suggested Severity</span>
                <Badge className={getSeverityColor(riskIndicators.suggestedSeverity)}>
                  {riskIndicators.suggestedSeverity}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-300">Debt Type</span>
                <Badge variant="outline">
                  {riskIndicators.suggestedDebtType.replace('_', ' ')}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Risk Factors */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Risk Factors Identified</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {riskIndicators.riskFactors.map((factor, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">{factor}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recommended Action */}
          <Card className="border-emerald-200 dark:border-emerald-800">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <Wrench className="h-4 w-4 text-emerald-600" />
                <CardTitle className="text-sm font-medium">Recommended Action</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">
                Create a Technical Debt ticket to track and manage the debt introduced by this architectural decision. 
                The system can automatically populate the ticket with relevant details from your ADR.
              </p>
              
              <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-lg p-3">
                <h4 className="text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
                  Auto-Generated Content Preview:
                </h4>
                <div className="space-y-1 text-xs text-emerald-800 dark:text-emerald-200">
                  <div><strong>Title:</strong> {riskIndicators.autoGeneratedTitle}</div>
                  <div><strong>Problem:</strong> {riskIndicators.autoGeneratedProblem.substring(0, 100)}...</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator />

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 mb-2 sm:mb-0">
            <Clock className="h-3 w-3" />
            <span>This can be created later if needed</span>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose}>
              Skip for Now
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleCreateTicket(false)}
              disabled={isCreating}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Create Manually
            </Button>
            <Button 
              onClick={() => handleCreateTicket(true)}
              disabled={isCreating}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              {isCreating ? 'Creating...' : 'Auto-Create Ticket'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}