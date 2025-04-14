
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { useEffect } from "react";
import { logToMonitoring } from "@/integrations/supabase/client";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import Notices from "./pages/Notices";
import Performance from "./pages/Performance";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Messages from "./pages/Messages";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";

// Create a new QueryClient instance with improved error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      meta: {
        errorHandler: (error: Error) => {
          console.error('Query error:', error);
          logToMonitoring('queryError', { error: String(error) });
        }
      }
    },
  },
});

const App = () => {
  // Log application startup for monitoring
  useEffect(() => {
    logToMonitoring('appInitialized');
    
    // Log page navigation
    const handleRouteChange = () => {
      logToMonitoring('pageView', { path: window.location.pathname });
    };
    
    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* App Routes */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/notices" element={<Notices />} />
              <Route path="/performance" element={<Performance />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/help" element={<Help />} />
              
              {/* Handle redirects for common misspellings */}
              <Route path="/course" element={<Navigate to="/courses" replace />} />
              <Route path="/notice" element={<Navigate to="/notices" replace />} />
              <Route path="/setting" element={<Navigate to="/settings" replace />} />
              <Route path="/message" element={<Navigate to="/messages" replace />} />
              
              {/* 404 Route - Must be last */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
