import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LanguageLayout from './LanguageLayout';
import CenteredLayout from '../layout/CenteredLayout';
import AuthPage from '@/pages/AuthPage';
import AuthCallback from '@/pages/AuthCallback';
import Dashboard from '@/pages/Dashboard';
import AqlHRWelcome from '@/pages/AqlHRWelcome';
import { TestAI } from '@/pages/TestAI';
import DataFoundationTest from '@/pages/DataFoundationTest';
import CoreBusinessTest from '@/pages/CoreBusinessTest';
import ComprehensivePhaseTest from '@/pages/ComprehensivePhaseTest';
import AutonomousGOSITest from '@/pages/AutonomousGOSITest';
import IntelligentVisaTest from '@/pages/IntelligentVisaTest';
import SaudizationOptimizationTest from '@/pages/SaudizationOptimizationTest';
import WPSAutomationTest from '@/pages/WPSAutomationTest';
import PromptDrivenExecutionTest from '@/pages/PromptDrivenExecutionTest';
import AutonomousDashboardPage from '@/pages/autonomous/AutonomousDashboardPage';
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
}> = ({ children, requireAuth = true }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (requireAuth && !user) {
    return <Navigate to="/en/auth" replace />;
  }
  
  return <>{children}</>;
};

export default function AppRoutes() {
  // Localized child routes under ":lang/*" from UnifiedLanguageRouter
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/en/" replace />} />
      <Route element={<LanguageLayout />}>
        {/* Root welcome page */}
        <Route index element={<AqlHRWelcome />} />

        {/* Auth Routes */}
        <Route element={<CenteredLayout />}>
          <Route path="auth" element={<AuthPage />} />
          <Route path="auth/callback" element={<AuthCallback />} />
        </Route>

        {/* Routes */}
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="main-dashboard" element={<Dashboard />} />
        <Route path="test-ai" element={<TestAI />} />
        <Route path="data-foundation-test" element={<DataFoundationTest />} />
        <Route path="core-business-test" element={<CoreBusinessTest />} />
        <Route path="comprehensive-test" element={<ComprehensivePhaseTest />} />
        <Route path="autonomous-gosi-test" element={<AutonomousGOSITest />} />
        <Route path="intelligent-visa-test" element={<IntelligentVisaTest />} />
        <Route path="saudization-optimization-test" element={<SaudizationOptimizationTest />} />
        <Route path="wps-automation-test" element={<WPSAutomationTest />} />
        <Route path="prompt-driven-execution-test" element={<PromptDrivenExecutionTest />} />
        <Route path="autonomous" element={<AutonomousDashboardPage />} />
        
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

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
