import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import UnifiedLanguageRouter from './UnifiedLanguageRouter';
import { SetupGuard } from '@/components/setup/SetupGuard';
import AuthPage from '@/pages/AuthPage';
import AuthCallback from '@/pages/AuthCallback';
import DashboardPage from '@/pages/Dashboard';
import { OSIOverview } from '@/components/diagnostic/OSIOverview';
import RetentionPage from '@/pages/diagnostic/Retention';
import DiagnosticHub from '@/pages/diagnostic/Hub';
import RouteAudit from '@/pages/_/RouteAudit';
import SmokeTest from '@/pages/_/SmokeTest';
import DemoDataPanel from '@/pages/admin/DemoDataPanel';
import EmployeeMasterDataPage from '@/pages/employees/EmployeeMasterDataPage';
import RecruitmentPage from '@/pages/RecruitmentPage';
import PayrollPage from '@/pages/PayrollPage';
import PerformancePage from '@/pages/PerformancePage';
import TrainingPage from '@/pages/TrainingPage';
import AnalyticsPage from '@/pages/Analytics';
import CompanyPage from '@/pages/Company';
import EmployeeList from '@/pages/people/EmployeeList';
import EmployeeProfile from '@/pages/people/EmployeeProfile';
import ExecutiveIntelligenceCenter from '@/pages/ExecutiveIntelligenceCenter';
import ProfilePage from '@/pages/ProfilePage';
import UsersPage from '@/pages/admin/UsersPage';
import CompanySettingsPage from '@/pages/admin/CompanySettingsPage';
import AISystemTestPage from '@/pages/AISystemTestPage';
import ToolsPage from '@/pages/Tools';
import GovernmentPage from '@/pages/Government';
import IntegrationsPage from '@/pages/integrations/IntegrationsPage';
import { SuperIntelligentWorkforceOptimizer } from '@/components/ai-ecosystem/SuperIntelligentWorkforceOptimizer';
import AIIntegrationDashboard from '@/pages/admin/AIIntegrationDashboard';
import { EnterpriseAIReportingEngine } from '@/components/ai-ecosystem/EnterpriseAIReportingEngine';
import HelpPage from '@/pages/HelpPage';
import Auth from '@/pages/Auth';

// Tiny utilities (inline to avoid extra files)
function Ping() { return <div style={{padding:16}}>OK — routing alive.</div>; }
function NotFound() {
  const { pathname } = useLocation();
  return <div style={{padding:16}}>404 — No route for <b>{pathname}</b></div>;
}

// Helper to infer current lang for legacy redirects
function currentLang(): 'en'|'ar' {
  const seg = window.location.pathname.split('/')[1];
  return seg === 'ar' ? 'ar' : 'en';
}

export default function AppRoutes() {
  return <UnifiedLanguageRouter />;
}