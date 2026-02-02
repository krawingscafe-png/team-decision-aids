import { useEffect, useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Protected } from "@/components/Protected";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { fetchTenantConfig, applyTenantTheme, TenantConfig } from "@/lib/api";

// Pages
import Home from "./pages/Home";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import Login from "./pages/Login";
import Charts from "./pages/Charts";
import ChartDetail from "./pages/ChartDetail";
import TreatmentDetail from "./pages/TreatmentDetail";
import TreatmentComparison from "./pages/TreatmentComparison";
import AllTreatments from "./pages/AllTreatments";
import Profile from "./pages/Profile";
import Billing from "./pages/Billing";
import Checkout from "./pages/Checkout";
import NotFound from "./pages/NotFound";

// Admin Pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminTenants from "./pages/admin/AdminTenants";
import AdminAnalytics from "./pages/admin/AdminAnalytics";

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
      <ThemeProvider defaultTheme="system">
        <AuthProvider>
          <AdminAuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Admin Routes - No Navbar/Footer */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="payments" element={<AdminPayments />} />
                  <Route path="tenants" element={<AdminTenants />} />
                  <Route path="analytics" element={<AdminAnalytics />} />
                </Route>

                {/* Main App Routes */}
                <Route
                  path="*"
                  element={
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
                            path="/charts/:chartSlug/treatment/:treatmentSlug"
                            element={
                              <Protected>
                                <TreatmentDetail />
                              </Protected>
                            }
                          />
                          <Route
                            path="/charts/:chartSlug/compare"
                            element={
                              <Protected>
                                <TreatmentComparison />
                              </Protected>
                            }
                          />
                          <Route
                            path="/charts/:chartSlug/treatments"
                            element={
                              <Protected>
                                <AllTreatments />
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
                  }
                />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AdminAuthProvider>
      </AuthProvider>
    </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
