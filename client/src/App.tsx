import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Layout from "@/components/layout";
import Home from "@/pages/home";
import Devlogs from "@/pages/devlogs";
import DevlogPost from "@/pages/devlog-post";
import SystemsArchivePage from "@/pages/systems";
import Lore from "@/pages/lore";
import LoreDetail from "@/pages/lore-detail";
import Gallery from "@/pages/gallery";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/devlogs" component={Devlogs} />
        <Route path="/devlogs/:id" component={DevlogPost} />
        <Route path="/systems" component={SystemsArchivePage} />
        <Route path="/systems/*" component={SystemsArchivePage} />
        <Route path="/lore" component={Lore} />
        <Route path="/lore/:id" component={LoreDetail} />
        <Route path="/gallery" component={Gallery} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
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
