import { Switch, Route, useLocation } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme/theme-provider";
import NotFound from "@/pages/not-found";
import StudioPage from "@/pages/studio";
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
import PlanPage from "@/pages/plan";
import ArkhitektonArchitecture from "@/pages/arkhitekton-architecture";
import ArkhitektonArchitectureAWS from "@/pages/arkhitekton-architecture-aws";
import ArkhitektonArchitectureAzure from "@/pages/arkhitekton-architecture-azure";
import ArkhitektonArchitectureGCP from "@/pages/arkhitekton-architecture-gcp";
import ArkhitektonArchitectureOracle from "@/pages/arkhitekton-architecture-oracle";
import ArkhitektonSystemsIntegration from "@/pages/arkhitekton-systems-integration";
import PitchDeck from "@/pages/pitch-deck";
import SettingsPage from "@/pages/settings";
import APMPage from "@/pages/apm";
import CloudIconsPage from "@/pages/cloud-icons";
import DrawioPOCPage from "@/pages/drawio-poc";
import CanvasPOCPage from "@/pages/canvas-poc";
import InstantCanvasPage from "@/pages/instant-canvas";

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
      <Route path="/studio" component={StudioPage} />
      <Route path="/design-palette">{() => <Redirect to="/studio" />}</Route>
      <Route path="/workspace">{() => <Redirect to="/studio" />}</Route>
      <Route path="/modeling">{() => <Redirect to="/studio" />}</Route>
      <Route path="/governance" component={GovernancePage} />
      <Route path="/decisions" component={DecisionsPage} />
      <Route path="/capabilities" component={CapabilitiesPage} />
      <Route path="/portfolio" component={PortfolioPage} />
      <Route path="/workflows" component={WorkflowsPage} />
      <Route path="/wiki" component={WikiPage} />
      <Route path="/tickets" component={TicketsPage} />
      <Route path="/tickets/new" component={CreateTicketPage} />
      <Route path="/tickets/:id/edit" component={EditTicketPage} />
      <Route path="/tickets/:id" component={ViewTicketPage} />
      <Route path="/design-options" component={DesignOptionsPage} />
      <Route path="/design-options/:id" component={DesignOptionDetailPage} />
      <Route path="/plan" component={PlanPage} />
      <Route path="/apm" component={APMPage} />
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
