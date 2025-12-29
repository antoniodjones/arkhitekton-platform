import { Switch, Route, useLocation } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme/theme-provider";
import NotFound from "@/pages/not-found";
import StudioPage from "@/pages/studio";
import DesignStudioHome from "@/pages/design-studio-home";
import Dashboard from "@/pages/dashboard";
import { GovernancePage } from "@/pages/governance";
import { DecisionsPage } from "@/pages/decisions";
import { CapabilitiesPage } from "@/pages/capabilities";
import { PortfolioPage } from "@/pages/portfolio";
import { WorkflowsPage } from "@/pages/workflows";
import { WikiPage } from "@/pages/wiki";
import { TicketsPage } from "@/pages/tickets";
import { CreateTicketPage } from "@/pages/create-ticket";
import { EditTicketPage } from "@/pages/edit-ticket";
import { ViewTicketPage } from "@/pages/view-ticket";
import DesignOptionsPage from "@/pages/design-options";
import DesignOptionDetailPage from "@/pages/design-option-detail";
import DesignOptionPrototypePage from "@/pages/design-option-prototype";
import LogoDesignOptions from "@/pages/logo-design-options";
import PlanPage from "@/pages/plan";
import { PlanLayout } from "@/components/plan/plan-layout";
import PlanDashboard from "@/pages/plan/dashboard";
import PlanBacklog from "@/pages/plan/backlog";
import PlanBoard from "@/pages/plan/board";
import PlanStories from "@/pages/plan/stories";
import PlanStoryDetail from "@/pages/plan/story-detail-page";
import PlanRoadmap from "@/pages/plan/roadmap";
import PlanEnhancements from "@/pages/plan/enhancements";
import QualityDashboard from "@/pages/quality/dashboard";
import QualityDefectsPage from "@/pages/quality/defects";
import QualityDefectDetailPage from "@/pages/quality/defect-detail";
import QualityTestPlanPage from "@/pages/quality/test-plan";
import QualityReportsPage from "@/pages/quality/reports";
import ArkhitektonArchitecture from "@/pages/arkhitekton-architecture";
import ArkhitektonArchitectureAWS from "@/pages/arkhitekton-architecture-aws";
import ArkhitektonArchitectureAzure from "@/pages/arkhitekton-architecture-azure";
import ArkhitektonArchitectureGCP from "@/pages/arkhitekton-architecture-gcp";
import ArkhitektonArchitectureOracle from "@/pages/arkhitekton-architecture-oracle";
import ArkhitektonSystemsIntegration from "@/pages/arkhitekton-systems-integration";
import PitchDeck from "@/pages/pitch-deck";
import SettingsPage from "@/pages/settings";
// APM functionality consolidated into Portfolio Management
import CloudIconsPage from "@/pages/cloud-icons";
import DrawioPOCPage from "@/pages/drawio-poc";
import CanvasPOCPage from "@/pages/canvas-poc";
import InstantCanvasPage from "@/pages/instant-canvas";
import CanvasSimple from "@/pages/canvas-simple";
import CanvasMVPPage from "@/pages/canvas-mvp";
import WikiV2Page from "@/pages/wiki-v2";


// Redirect component for deprecated routes
function Redirect({ to }: { to: string }) {
  const [, setLocation] = useLocation();

  useEffect(() => {
    setLocation(to);
  }, [to, setLocation]);

  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/studio" component={DesignStudioHome} />
      <Route path="/studio/canvas-mvp" component={CanvasMVPPage} />
      <Route path="/studio/canvas" component={CanvasSimple} />
      <Route path="/studio/canvas-advanced" component={StudioPage} />
      <Route path="/design-palette">{() => <Redirect to="/studio" />}</Route>
      <Route path="/workspace">{() => <Redirect to="/studio" />}</Route>
      <Route path="/modeling">{() => <Redirect to="/studio" />}</Route>
      <Route path="/governance" component={GovernancePage} />
      <Route path="/decisions" component={DecisionsPage} />
      <Route path="/capabilities" component={CapabilitiesPage} />
      <Route path="/portfolio" component={PortfolioPage} />
      <Route path="/workflows" component={WorkflowsPage} />
      <Route path="/wiki" component={WikiPage} />
      <Route path="/wiki-v2" component={WikiV2Page} />
      <Route path="/wiki-v2/:id" component={WikiV2Page} />
      <Route path="/tickets" component={TicketsPage} />
      <Route path="/tickets/new" component={CreateTicketPage} />
      <Route path="/tickets/:id/edit" component={EditTicketPage} />
      <Route path="/tickets/:id" component={ViewTicketPage} />
      <Route path="/design-options" component={DesignOptionsPage} />
      <Route path="/design-options/logo-concepts" component={LogoDesignOptions} />
      <Route path="/design-options/:id" component={DesignOptionDetailPage} />
      <Route path="/design-options/:id/prototype/:protoId" component={DesignOptionPrototypePage} />
      {/* Plan Module Routes */}
      <Route path="/plan">{() => <Redirect to="/plan/dashboard" />}</Route>
      <Route path="/plan/dashboard">
        {() => (
          <PlanLayout>
            <PlanDashboard />
          </PlanLayout>
        )}
      </Route>
      <Route path="/plan/backlog">
        {() => (
          <PlanLayout>
            <PlanBacklog />
          </PlanLayout>
        )}
      </Route>
      <Route path="/plan/board">
        {() => (
          <PlanLayout>
            <PlanBoard />
          </PlanLayout>
        )}
      </Route>
      <Route path="/plan/stories/:id" component={PlanStoryDetail} />
      <Route path="/plan/stories">
        {() => (
          <PlanLayout>
            <PlanStories />
          </PlanLayout>
        )}
      </Route>
      <Route path="/plan/roadmap" component={PlanRoadmap} />
      <Route path="/plan/enhancements" component={PlanEnhancements} />
      <Route path="/plan-legacy" component={PlanPage} />
      
      {/* Quality Center Routes */}
      <Route path="/quality">{() => <Redirect to="/quality/dashboard" />}</Route>
      <Route path="/quality/dashboard" component={QualityDashboard} />
      <Route path="/quality/defects" component={QualityDefectsPage} />
      <Route path="/quality/defects/:id" component={QualityDefectDetailPage} />
      <Route path="/quality/test-plan" component={QualityTestPlanPage} />
      <Route path="/quality/reports" component={QualityReportsPage} />
      {/* Legacy defects route - redirect to Quality Center */}
      <Route path="/defects">{() => <Redirect to="/quality/defects" />}</Route>
      <Route path="/defects/:id">{({ id }) => <Redirect to={`/quality/defects/${id}`} />}</Route>
      {/* APM consolidated into Portfolio Management */}
      <Route path="/apm">{() => <Redirect to="/portfolio?tab=applications" />}</Route>
      <Route path="/cloud-icons" component={CloudIconsPage} />
      <Route path="/gcp-icons">{() => <Redirect to="/cloud-icons" />}</Route>
      <Route path="/drawio-poc" component={DrawioPOCPage} />
      <Route path="/canvas-poc" component={CanvasPOCPage} />
      <Route path="/instant-canvas" component={InstantCanvasPage} />

      <Route path="/settings" component={SettingsPage} />
      <Route path="/arkhitekton-architecture" component={ArkhitektonArchitecture} />
      <Route path="/arkhitekton-architecture/aws" component={ArkhitektonArchitectureAWS} />
      <Route path="/arkhitekton-architecture/azure" component={ArkhitektonArchitectureAzure} />
      <Route path="/arkhitekton-architecture/gcp" component={ArkhitektonArchitectureGCP} />
      <Route path="/arkhitekton-architecture/oracle" component={ArkhitektonArchitectureOracle} />
      <Route path="/arkhitekton-systems-integration" component={ArkhitektonSystemsIntegration} />
      <Route path="/pitch-deck" component={PitchDeck} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="auto" storageKey="arkhitekton-theme">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
