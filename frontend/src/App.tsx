import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Citizens from "./pages/Citizens";
import Utilities from "./pages/Utilities";
import Transport from "./pages/Transport";
import Emergency from "./pages/Emergency";
import Waste from "./pages/Waste";
import Complaints from "./pages/Complaints";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/citizens" element={<Citizens />} />
          <Route path="/utilities" element={<Utilities />} />
          <Route path="/transport" element={<Transport />} />
          <Route path="/emergency" element={<Emergency />} />
          <Route path="/waste" element={<Waste />} />
          <Route path="/complaints" element={<Complaints />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
