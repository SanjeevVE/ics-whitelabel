import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { TenantProvider } from "@/contexts/TenantContext";
import Index from "./pages/Index";
import EventHome from "./pages/EventHome";
import Event from "./pages/Event";
import Registration from "./pages/Registration";
import Success from "./pages/Success";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <TenantProvider>
            <Routes>
              {/* Main platform routes */}
              <Route path="/" element={<Index />} />
              
              {/* Event-specific routes for subdomain or path-based routing */}
              <Route path="/:slug" element={<EventHome />} />
              <Route path="/:slug/details" element={<Event />} />
              <Route path="/:slug/registration" element={<Registration />} />
              <Route path="/:slug/success" element={<Success />} />
              
              {/* Legacy routes - keep for backward compatibility */}
              <Route path="/event/:id" element={<Event />} />
              <Route path="/registration/:id" element={<Registration />} />
              <Route path="/success" element={<Success />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TenantProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
