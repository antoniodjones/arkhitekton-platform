import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme/theme-provider";
import NotFound from "@/pages/not-found";
import DesignPalette from "@/pages/design-palette";
import ModelingPage from "@/pages/modeling";
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
import { WorkspacePage } from "@/pages/workspace";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/design-palette" component={DesignPalette} />
      <Route path="/workspace" component={WorkspacePage} />
      <Route path="/modeling" component={ModelingPage} />
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
      <Route path="/arkhitekton-architecture" component={ArkhitektonArchitecture} />
      <Route path="/arkhitekton-architecture/aws" component={ArkhitektonArchitectureAWS} />
      <Route path="/arkhitekton-architecture/azure" component={ArkhitektonArchitectureAzure} />
      <Route path="/arkhitekton-architecture/gcp" component={ArkhitektonArchitectureGCP} />
      <Route path="/arkhitekton-architecture/oracle" component={ArkhitektonArchitectureOracle} />
      <Route path="/arkhitekton-systems-integration" component={ArkhitektonSystemsIntegration} />
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
