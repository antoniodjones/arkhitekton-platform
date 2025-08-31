import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import DesignPalette from "@/pages/design-palette";
import { WorkspacePage } from "@/pages/workspace";
import Dashboard from "@/pages/dashboard";
import { GovernancePage } from "@/pages/governance";
import { DecisionsPage } from "@/pages/decisions";
import { CapabilitiesPage } from "@/pages/capabilities";
import { PortfolioPage } from "@/pages/portfolio";
import { WorkflowsPage } from "@/pages/workflows";
import { WikiPage } from "@/pages/wiki";
import { TicketsPage } from "@/pages/tickets";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/design-palette" component={DesignPalette} />
      <Route path="/workspace" component={WorkspacePage} />
      <Route path="/governance" component={GovernancePage} />
      <Route path="/decisions" component={DecisionsPage} />
      <Route path="/capabilities" component={CapabilitiesPage} />
      <Route path="/portfolio" component={PortfolioPage} />
      <Route path="/workflows" component={WorkflowsPage} />
      <Route path="/wiki" component={WikiPage} />
      <Route path="/tickets" component={TicketsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
