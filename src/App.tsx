import { useEffect, useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Protected } from "@/components/Protected";
import { fetchTenantConfig, applyTenantTheme, TenantConfig } from "@/lib/api";

// Pages
import Home from "./pages/Home";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import Login from "./pages/Login";
import Charts from "./pages/Charts";
import ChartDetail from "./pages/ChartDetail";
import Profile from "./pages/Profile";
import Billing from "./pages/Billing";
import Checkout from "./pages/Checkout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [tenantConfig, setTenantConfig] = useState<TenantConfig | null>(null);

  useEffect(() => {
    // Fetch and apply tenant theming on mount
    fetchTenantConfig().then((config) => {
      if (config) {
        setTenantConfig(config);
        applyTenantTheme(config);
      }
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="flex min-h-screen flex-col">
              <Navbar tenantLogo={tenantConfig?.logo} />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/features" element={<Features />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/login" element={<Login />} />
                  <Route
                    path="/charts"
                    element={
                      <Protected>
                        <Charts />
                      </Protected>
                    }
                  />
                  <Route
                    path="/charts/:slug"
                    element={
                      <Protected>
                        <ChartDetail />
                      </Protected>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <Protected>
                        <Profile />
                      </Protected>
                    }
                  />
                  <Route
                    path="/billing"
                    element={
                      <Protected>
                        <Billing />
                      </Protected>
                    }
                  />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
