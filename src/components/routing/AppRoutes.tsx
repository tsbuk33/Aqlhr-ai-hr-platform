import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LanguageLayout from './LanguageLayout';
import CenteredLayout from '../layout/CenteredLayout';
import { DashboardLayout } from '../layout/DashboardLayout';
import { LayoutShell } from '../layout/LayoutShell';
import AuthPage from '@/pages/AuthPage';
import AuthCallback from '@/pages/AuthCallback';
import Dashboard from '@/pages/Dashboard';
import Welcome from '@/pages/Welcome';
import AqlHRWelcome from '@/pages/AqlHRWelcome';
import { TestAI } from '@/pages/TestAI';
import DataFoundationTest from '@/pages/DataFoundationTest';
import { ROUTES } from '@/config/routes';
import { useAuth } from '@/hooks/useAuth';

// Loading component for lazy-loaded routes
const RouteLoading = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      <p className="mt-4 text-muted-foreground">Loading...</p>
    </div>
  </div>
);

// Protected Route Component
const ProtectedRoute: React.FC<{ 
  children: React.ReactNode; 
  requireAuth?: boolean; 
  adminOnly?: boolean;
}> = ({ children, requireAuth = false, adminOnly = false }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <RouteLoading />;
  }

  // Check authentication requirement
  if (requireAuth && !user) {
    return <Navigate to="/auth" replace />;
  }

  // Check admin requirement (assuming user has role property)
  if (adminOnly && (!user || (user as any)?.role !== 'admin')) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default function AppRoutes() {
  // Localized child routes under ":lang/*" from UnifiedLanguageRouter
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/en/" replace />} />
      <Route element={<LanguageLayout />}>
        {/* Welcome pages with their own layout */}
        <Route path="welcome" element={<Welcome />} />
        <Route index element={<AqlHRWelcome />} />

        {/* Routes that need CENTERED layout */}
        <Route element={<CenteredLayout />}>
          <Route path="auth" element={<AuthPage />} />
          <Route path="auth/callback" element={<AuthCallback />} />
        </Route>

        {/* Routes that need DASHBOARD layout */}
        <Route element={<DashboardLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="main-dashboard" element={<Dashboard />} />
          <Route path="test-ai" element={<TestAI />} />
          <Route path="data-foundation-test" element={<DataFoundationTest />} />
          
          {/* All AqlHR Platform Routes */}
          {ROUTES.map((route, index) => {
            const RouteComponent = route.element;
            
            return (
              <Route 
                key={`${route.path}-${index}`}
                path={route.path === '/' ? 'home' : route.path.startsWith('/') ? route.path.slice(1) : route.path}
                element={
                  <ProtectedRoute requireAuth={route.auth} adminOnly={route.adminOnly}>
                    <Suspense fallback={<RouteLoading />}>
                      <RouteComponent />
                    </Suspense>
                  </ProtectedRoute>
                }
              />
            );
          })}
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
