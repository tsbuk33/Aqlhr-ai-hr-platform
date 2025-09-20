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
import CoreHRPublic from '@/pages/CoreHRPublic';
import RecruitmentPublic from '@/pages/RecruitmentPublic';
import AnalyticsPublic from '@/pages/AnalyticsPublic';
import CompliancePublic from '@/pages/CompliancePublic';
import GovernmentPublic from '@/pages/GovernmentPublic';
import AIAutomationPublic from '@/pages/AIAutomationPublic';
import ExecutiveCenterPublic from '@/pages/ExecutiveCenterPublic';
import LEOPublic from '@/pages/LEOPublic';
import GEOPublic from '@/pages/GEOPublic';
import SkillsIntelligencePublic from '@/pages/SkillsIntelligencePublic';
import WelfareConsultancyPublic from '@/pages/WelfareConsultancyPublic';
import LegalConsultantPublic from '@/pages/LegalConsultantPublic';
import PerformancePublic from '@/pages/PerformancePublic';
import AttendancePublic from '@/pages/AttendancePublic';
import LeavePublic from '@/pages/LeavePublic';
import PayrollPublic from '@/pages/PayrollPublic';
import ToolsPublic from '@/pages/ToolsPublic';
import HelpPublic from '@/pages/HelpPublic';
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
import GenerativeEngagementOptimization from '@/pages/engagement/GenerativeEngagementOptimization';
import LegalConsultant from '@/pages/LegalConsultant';
import NRCManagement from '@/pages/NRCManagement';
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
        
        {/* Direct system-overview route - accessible without authentication */}
        <Route path="system-overview" element={
          <LayoutShell>
            <Suspense fallback={<RouteLoading />}>
              <SystemOverview />
            </Suspense>
          </LayoutShell>
        } />

        {/* Public preview pages for key modules */}
        <Route path="core-hr" element={
          <LayoutShell>
            <Suspense fallback={<RouteLoading />}>
              <CoreHRPublic />
            </Suspense>
          </LayoutShell>
        } />
        <Route path="recruitment" element={
          <LayoutShell>
            <Suspense fallback={<RouteLoading />}>
              <RecruitmentPublic />
            </Suspense>
          </LayoutShell>
        } />
        <Route path="analytics" element={
          <LayoutShell>
            <Suspense fallback={<RouteLoading />}>
              <AnalyticsPublic />
            </Suspense>
          </LayoutShell>
        } />
        <Route path="compliance" element={
          <LayoutShell>
            <Suspense fallback={<RouteLoading />}>
              <CompliancePublic />
            </Suspense>
          </LayoutShell>
        } />
        <Route path="government" element={
          <LayoutShell>
            <Suspense fallback={<RouteLoading />}>
              <GovernmentPublic />
            </Suspense>
          </LayoutShell>
        } />
        <Route path="ai-automation" element={
          <LayoutShell>
            <Suspense fallback={<RouteLoading />}>
              <AIAutomationPublic />
            </Suspense>
          </LayoutShell>
        } />
        <Route path="executive-center" element={
          <LayoutShell>
            <Suspense fallback={<RouteLoading />}>
              <ExecutiveCenterPublic />
            </Suspense>
          </LayoutShell>
        } />
        <Route path="leo" element={
          <LayoutShell>
            <Suspense fallback={<RouteLoading />}>
              <LEOPublic />
            </Suspense>
          </LayoutShell>
        } />
        <Route path="geo" element={
          <LayoutShell>
            <Suspense fallback={<RouteLoading />}>
              <GEOPublic />
            </Suspense>
          </LayoutShell>
        } />
        <Route path="skills-intelligence" element={
          <LayoutShell>
            <Suspense fallback={<RouteLoading />}>
              <SkillsIntelligencePublic />
            </Suspense>
          </LayoutShell>
        } />
        <Route path="welfare-consultancy" element={
          <LayoutShell>
            <Suspense fallback={<RouteLoading />}>
              <WelfareConsultancyPublic />
            </Suspense>
          </LayoutShell>
        } />
        <Route path="legal-consultant" element={
          <LayoutShell>
            <Suspense fallback={<RouteLoading />}>
              <LegalConsultantPublic />
            </Suspense>
          </LayoutShell>
        } />
        <Route path="performance" element={
          <LayoutShell>
            <Suspense fallback={<RouteLoading />}>
              <PerformancePublic />
            </Suspense>
          </LayoutShell>
        } />
        <Route path="attendance" element={
          <LayoutShell>
            <Suspense fallback={<RouteLoading />}>
              <AttendancePublic />
            </Suspense>
          </LayoutShell>
        } />
        <Route path="leave" element={
          <LayoutShell>
            <Suspense fallback={<RouteLoading />}>
              <LeavePublic />
            </Suspense>
          </LayoutShell>
        } />
        <Route path="payroll" element={
          <LayoutShell>
            <Suspense fallback={<RouteLoading />}>
              <PayrollPublic />
            </Suspense>
          </LayoutShell>
        } />
        <Route path="tools" element={
          <LayoutShell>
            <Suspense fallback={<RouteLoading />}>
              <ToolsPublic />
            </Suspense>
          </LayoutShell>
        } />
        <Route path="help" element={
          <LayoutShell>
            <Suspense fallback={<RouteLoading />}>
              <HelpPublic />
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

        {/* Learning Experience Optimization - NEW Module */}
        <Route path="learning-experience-optimization" element={
          <ProtectedRoute>
            <LayoutShell>
              <Suspense fallback={<RouteLoading />}>
                <LearningExperienceOptimization />
              </Suspense>
            </LayoutShell>
          </ProtectedRoute>
        } />

        {/* Generative Engagement Optimization - NEW Module */}
        <Route path="geo" element={
          <ProtectedRoute>
            <LayoutShell>
              <Suspense fallback={<RouteLoading />}>
                <GenerativeEngagementOptimization />
              </Suspense>
            </LayoutShell>
          </ProtectedRoute>
        } />

        {/* Legal Consultant AI - NEW Module */}
        <Route path="legal-consultant" element={
          <ProtectedRoute>
            <LayoutShell>
              <Suspense fallback={<RouteLoading />}>
                <LegalConsultant />
              </Suspense>
            </LayoutShell>
          </ProtectedRoute>
        } />

        {/* NRC Management (AI) - Nitaqat & Saudization - NEW Module */}
        <Route path="nrc-management" element={
          <ProtectedRoute>
            <LayoutShell>
              <Suspense fallback={<RouteLoading />}>
                <NRCManagement />
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
