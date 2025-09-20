import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LanguageLayout from './LanguageLayout';
import CenteredLayout from '../layout/CenteredLayout';
import { LayoutShell } from '../layout/LayoutShell';
import { PublicLayoutShell } from '../layout/PublicLayoutShell';
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
import ModulePlaceholder from '@/pages/ModulePlaceholder';
import BenefitsManagement from '@/pages/modules/BenefitsManagement';
import ExpenseManagement from '@/pages/modules/ExpenseManagement';
import FinancialPlanning from '@/pages/modules/FinancialPlanning';
import NativeMobileApps from '@/pages/mobile/NativeMobileApps';
import GOSIIntegration from '@/pages/modules/GOSIIntegration';
import MOLIntegration from '@/pages/modules/MOLIntegration';
import NitaqatManagement from '@/pages/modules/NitaqatManagement';
import VisaManagement from '@/pages/modules/VisaManagement';
import WPSIntegration from '@/pages/modules/WPSIntegration';
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
          <PublicLayoutShell>
            <Suspense fallback={<RouteLoading />}>
              <SystemOverview />
            </Suspense>
          </PublicLayoutShell>
        } />

        {/* Public preview pages for key modules */}
        <Route path="core-hr" element={
          <PublicLayoutShell>
            <Suspense fallback={<RouteLoading />}>
              <CoreHRPublic />
            </Suspense>
          </PublicLayoutShell>
        } />
        <Route path="recruitment" element={
          <PublicLayoutShell>
            <Suspense fallback={<RouteLoading />}>
              <RecruitmentPublic />
            </Suspense>
          </PublicLayoutShell>
        } />
        <Route path="analytics" element={
          <PublicLayoutShell>
            <Suspense fallback={<RouteLoading />}>
              <AnalyticsPublic />
            </Suspense>
          </PublicLayoutShell>
        } />
        <Route path="compliance" element={
          <PublicLayoutShell>
            <Suspense fallback={<RouteLoading />}>
              <CompliancePublic />
            </Suspense>
          </PublicLayoutShell>
        } />
        <Route path="government" element={
          <PublicLayoutShell>
            <Suspense fallback={<RouteLoading />}>
              <GovernmentPublic />
            </Suspense>
          </PublicLayoutShell>
        } />
        <Route path="ai-automation" element={
          <PublicLayoutShell>
            <Suspense fallback={<RouteLoading />}>
              <AIAutomationPublic />
            </Suspense>
          </PublicLayoutShell>
        } />
        <Route path="executive-center" element={
          <PublicLayoutShell>
            <Suspense fallback={<RouteLoading />}>
              <ExecutiveCenterPublic />
            </Suspense>
          </PublicLayoutShell>
        } />
        <Route path="leo" element={
          <PublicLayoutShell>
            <Suspense fallback={<RouteLoading />}>
              <LEOPublic />
            </Suspense>
          </PublicLayoutShell>
        } />
        <Route path="geo" element={
          <PublicLayoutShell>
            <Suspense fallback={<RouteLoading />}>
              <GEOPublic />
            </Suspense>
          </PublicLayoutShell>
        } />
        <Route path="skills-intelligence" element={
          <PublicLayoutShell>
            <Suspense fallback={<RouteLoading />}>
              <SkillsIntelligencePublic />
            </Suspense>
          </PublicLayoutShell>
        } />
        <Route path="welfare-consultancy" element={
          <PublicLayoutShell>
            <Suspense fallback={<RouteLoading />}>
              <WelfareConsultancyPublic />
            </Suspense>
          </PublicLayoutShell>
        } />
        <Route path="legal-consultant" element={
          <PublicLayoutShell>
            <Suspense fallback={<RouteLoading />}>
              <LegalConsultantPublic />
            </Suspense>
          </PublicLayoutShell>
        } />
        <Route path="performance" element={
          <PublicLayoutShell>
            <Suspense fallback={<RouteLoading />}>
              <PerformancePublic />
            </Suspense>
          </PublicLayoutShell>
        } />
        <Route path="attendance" element={
          <PublicLayoutShell>
            <Suspense fallback={<RouteLoading />}>
              <AttendancePublic />
            </Suspense>
          </PublicLayoutShell>
        } />
        <Route path="leave" element={
          <PublicLayoutShell>
            <Suspense fallback={<RouteLoading />}>
              <LeavePublic />
            </Suspense>
          </PublicLayoutShell>
        } />
        <Route path="payroll" element={
          <PublicLayoutShell>
            <Suspense fallback={<RouteLoading />}>
              <PayrollPublic />
            </Suspense>
          </PublicLayoutShell>
        } />
        <Route path="tools" element={
          <PublicLayoutShell>
            <Suspense fallback={<RouteLoading />}>
              <ToolsPublic />
            </Suspense>
          </PublicLayoutShell>
        } />
        <Route path="help" element={
          <PublicLayoutShell>
            <Suspense fallback={<RouteLoading />}>
              <HelpPublic />
            </Suspense>
          </PublicLayoutShell>
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
        
        {/* Module Pages */}
        <Route path="benefits" element={
          <PublicLayoutShell>
            <Suspense fallback={<RouteLoading />}>
              <BenefitsManagement />
            </Suspense>
          </PublicLayoutShell>
        } />
        <Route path="expense-management" element={
          <PublicLayoutShell>
            <Suspense fallback={<RouteLoading />}>
              <ExpenseManagement />
            </Suspense>
          </PublicLayoutShell>
        } />
        <Route path="financial-planning" element={
          <PublicLayoutShell>
            <Suspense fallback={<RouteLoading />}>
              <FinancialPlanning />
            </Suspense>
          </PublicLayoutShell>
        } />
        <Route path="gosi-integration" element={
          <PublicLayoutShell>
            <Suspense fallback={<RouteLoading />}>
              <GOSIIntegration />
            </Suspense>
          </PublicLayoutShell>
        } />
        <Route path="mol-integration" element={
          <PublicLayoutShell>
            <Suspense fallback={<RouteLoading />}>
              <MOLIntegration />
            </Suspense>
          </PublicLayoutShell>
        } />
        <Route path="nitaqat-management" element={
          <PublicLayoutShell>
            <Suspense fallback={<RouteLoading />}>
              <NitaqatManagement />
            </Suspense>
          </PublicLayoutShell>
        } />
        <Route path="visa-management" element={
          <PublicLayoutShell>
            <Suspense fallback={<RouteLoading />}>
              <VisaManagement />
            </Suspense>
          </PublicLayoutShell>
        } />
        <Route path="wps-integration" element={
          <PublicLayoutShell>
            <Suspense fallback={<RouteLoading />}>
              <WPSIntegration />
            </Suspense>
          </PublicLayoutShell>
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

        {/* Mobile Native Apps */}
        <Route path="mobile" element={
          <Suspense fallback={<RouteLoading />}>
            <NativeMobileApps />
          </Suspense>
        } />

        {/* Generic Module Placeholder */}
        <Route path="m/:moduleId" element={
          <PublicLayoutShell>
            <Suspense fallback={<RouteLoading />}>
              <ModulePlaceholder />
            </Suspense>
          </PublicLayoutShell>
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
