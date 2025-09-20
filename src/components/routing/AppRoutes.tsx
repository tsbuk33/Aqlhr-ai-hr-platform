import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LanguageLayout from './LanguageLayout';
import CenteredLayout from '../layout/CenteredLayout';
import { LayoutShell } from '../layout/LayoutShell';
import AuthPage from '@/pages/AuthPage';
import AuthCallback from '@/pages/AuthCallback';
import Dashboard from '@/pages/Dashboard';
import AqlHRLanding from '@/pages/AqlHRLanding';
import SystemOverview from '@/pages/SystemOverview';
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
import SmartKPIPublic from '@/pages/SmartKPIPublic';
import ExecutiveIntelligence from '@/pages/ExecutiveIntelligence';
import SkillsIntelligence from '@/pages/SkillsIntelligence';
import LearningExperienceOptimization from '@/pages/learning/LearningExperienceOptimization';
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
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

export default function AppRoutes() {
  // Localized child routes under ":lang/*" from UnifiedLanguageRouter
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/system-overview" replace />} />
      <Route element={<LanguageLayout />}>
        {/* Index route for /en and /ar - redirect to system-overview */}
        <Route index element={<Navigate to="system-overview" replace />} />
        
        {/* Direct system-overview route */}
        <Route path="system-overview" element={
          <LayoutShell>
            <Suspense fallback={<RouteLoading />}>
              <SystemOverview />
            </Suspense>
          </LayoutShell>
        } />

        {/* Auth Routes */}
        <Route element={<CenteredLayout />}>
          <Route path="auth" element={<AuthPage />} />
          <Route path="auth/callback" element={<AuthCallback />} />
        </Route>

        {/* Protected Dashboard Routes - Wrap with LayoutShell */}
        <Route path="dashboard" element={
          <ProtectedRoute>
            <LayoutShell>
              <Dashboard />
            </LayoutShell>
          </ProtectedRoute>
        } />
        <Route path="main-dashboard" element={
          <ProtectedRoute>
            <LayoutShell>
              <Dashboard />
            </LayoutShell>
          </ProtectedRoute>
        } />

        {/* Executive Intelligence Center - Premium Module */}
        <Route path="executive-center" element={
          <ProtectedRoute>
            <LayoutShell>
              <Suspense fallback={<RouteLoading />}>
                <ExecutiveIntelligence />
              </Suspense>
            </LayoutShell>
          </ProtectedRoute>
        } />

        {/* Skills Intelligence - NEW Module */}
        <Route path="skills-intelligence" element={
          <ProtectedRoute>
            <LayoutShell>
              <Suspense fallback={<RouteLoading />}>
                <SkillsIntelligence />
              </Suspense>
            </LayoutShell>
          </ProtectedRoute>
        } />
        
        {/* Test Routes */}
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
        
        {/* Public Smart KPI Routes */}
        <Route path="tools/smart-kpi" element={
          <LayoutShell>
            <Suspense fallback={<RouteLoading />}>
              <SmartKPIPublic />
            </Suspense>
          </LayoutShell>
        } />
        <Route path="additional/smart-kpi" element={
          <LayoutShell>
            <Suspense fallback={<RouteLoading />}>
              <SmartKPIPublic />
            </Suspense>
          </LayoutShell>
        } />
        
        {/* All AqlHR Platform Routes - Wrap with LayoutShell for proper dashboard layout */}
        {ROUTES.map((route, index) => {
          const RouteComponent = route.element;
          
          return (
            <Route 
              key={`${route.path}-${index}`}
              path={route.path === '/' ? 'home' : route.path.startsWith('/') ? route.path.slice(1) : route.path}
              element={
                route.auth !== false ? (
                  <ProtectedRoute requireAuth={true} adminOnly={route.adminOnly}>
                    <LayoutShell>
                      <Suspense fallback={<RouteLoading />}>
                        <RouteComponent />
                      </Suspense>
                    </LayoutShell>
                  </ProtectedRoute>
                ) : (
                  <LayoutShell>
                    <Suspense fallback={<RouteLoading />}>
                      <RouteComponent />
                    </Suspense>
                  </LayoutShell>
                )
              }
            />
          );
        })}

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/system-overview" replace />} />
      </Route>
    </Routes>
  );
}
