import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { ThemeProvider } from "next-themes";

import { AuthProvider, useAuth } from "@/contexts/AuthContext";


import Config from "./pages/Config";
import Dashboard from "./pages/Dashboard";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ProfilePage from "@/pages/ProfilePage";

import DashboardLayout from "./layouts/DashboardLayout";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import { LoginScreen } from "./components/auth/LoginScreen";
import { ChatHeader } from "./components/chat/ChatHeader";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// 🔐 Proteção geral (exige login ou visitante)
const ProtectedRouteWrapper = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, isGuest, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Carregando...
      </div>
    );
  }

  if (!isAuthenticated && !isGuest) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// 👑 Proteção específica para Admin
const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const { user } = useAuth();

  if (user?.role !== "admin") {
    return <Navigate to="/home" replace />;
  }

  return children;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Redireciona raiz para login */}
                <Route path="/" element={<Navigate to="/login" replace />} />

                {/* Layout público */}
                <Route element={<AuthLayout />}>
                  <Route path="/login" element={<LoginScreen />} />
                </Route>

                {/* 🔐 Home (Chat) protegido */}
                <Route
                  path="/home"
                  element={
                    <ProtectedRouteWrapper>
                      <MainLayout />
                    </ProtectedRouteWrapper>
                  }
                >
                  <Route index element={<Index />} />
              </Route>

                  {/* 🔐 Perfil  protegido */}
                  <Route 
                    path="/perfil" 
                    element={
                     <ProtectedRouteWrapper>
                       <ProfilePage />
                     </ProtectedRouteWrapper>
                    } />


                {/* 🔐 Config protegido (qualquer usuário logado ou visitante) */}
                <Route
                  path="/config"
                  element={
                    <ProtectedRouteWrapper>
                      <Config />
                    </ProtectedRouteWrapper>
                  }
                />

                {/* 👑 Dashboard somente admin */}
                <Route
                 path="/dashboard"
                 element={
                 <ProtectedRouteWrapper>
                  <AdminRoute>
                     <DashboardLayout />
                  </AdminRoute>
                 </ProtectedRouteWrapper>
                  }
                >
  <Route index element={<Dashboard />} />
</Route>

                {/* Fallback */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;