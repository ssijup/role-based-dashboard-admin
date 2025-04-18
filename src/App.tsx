
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { UserRole } from "@/lib/types";

// Pages
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import UsersPage from "./pages/UsersPage";
import WarehousesPage from "./pages/WarehousesPage";
import AnnouncementsPage from "./pages/AnnouncementsPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            
            {/* Dashboard - All Admin Roles */}
            <Route path="/" element={<ProtectedRoute />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
            </Route>
            
            {/* Users - Platform Admin Only */}
            <Route 
              path="/" 
              element={<ProtectedRoute requiredRoles={[UserRole.PLATFORM_ADMIN]} />}
            >
              <Route path="/users" element={<UsersPage />} />
            </Route>
            
            {/* Warehouses & Announcements - All Admin Roles */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute 
                  requiredRoles={[
                    UserRole.PLATFORM_ADMIN, 
                    UserRole.SUPPORT_STAFF, 
                    UserRole.WAREHOUSE_ADMIN
                  ]} 
                />
              }
            >
              <Route path="/warehouses" element={<WarehousesPage />} />
              <Route path="/announcements" element={<AnnouncementsPage />} />
            </Route>

            {/* Catch-all Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
