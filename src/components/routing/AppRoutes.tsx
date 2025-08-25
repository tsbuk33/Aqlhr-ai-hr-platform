import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LanguageLayout from './LanguageLayout';
import { SetupGuard } from '@/components/setup/SetupGuard';
import AuthPage from '@/pages/AuthPage';
import AuthCallback from '@/pages/AuthCallback';
import DashboardPage from '@/pages/Dashboard';
import { OSIOverview } from '@/components/diagnostic/OSIOverview';
import RetentionPage from '@/pages/diagnostic/Retention';
import DiagnosticHub from '@/pages/diagnostic/Hub';
import RouteAudit from '@/pages/_/RouteAudit';
import EmployeeMasterDataPage from '@/pages/employees/EmployeeMasterDataPage';
import RecruitmentPage from '@/pages/RecruitmentPage';
import EmployeeList from '@/pages/people/EmployeeList';
import EmployeeProfile from '@/pages/people/EmployeeProfile';
import ExecutiveIntelligenceCenter from '@/pages/ExecutiveIntelligenceCenter';
import ProfilePage from '@/pages/ProfilePage';
import UsersPage from '@/pages/admin/UsersPage';
import CompanySettingsPage from '@/pages/admin/CompanySettingsPage';

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
  return (
    <Routes>
      {/* root → lang root */}
      <Route path="/" element={<Navigate to={`/${currentLang()}`} replace />} />

      {/* auth callback (global) */}
      <Route path="/auth/callback" element={<AuthCallback />} />

      {/* legacy (no lang prefix) redirects */}
      <Route path="/dashboard" element={<Navigate to={`/${currentLang()}/dashboard`} replace />} />
      <Route path="/diagnostic/retention/*" element={<Navigate to={`/${currentLang()}/diagnostic/retention`} replace />} />
      <Route path="/diagnostic/osi/*" element={<Navigate to={`/${currentLang()}/diagnostic/osi`} replace />} />
      <Route path="/diagnostic/hub" element={<Navigate to={`/${currentLang()}/diagnostic/hub`} replace />} />

      {/* localized tree */}
      <Route path=":lang" element={<LanguageLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="auth" element={<AuthPage />} />
        <Route path="dashboard" element={<SetupGuard><DashboardPage /></SetupGuard>} />

        {/* smoke / health */}
        <Route path="_/ping" element={<Ping />} />
        <Route path="_/route-audit" element={<RouteAudit />} />

        {/* employees */}
        <Route path="employees" element={<SetupGuard><EmployeeMasterDataPage /></SetupGuard>} />

        {/* legacy/alternate people paths */}
        <Route path="people">
          <Route path="employees" element={<SetupGuard><EmployeeList /></SetupGuard>} />
          <Route path="employees/:id" element={<SetupGuard><EmployeeProfile /></SetupGuard>} />
        </Route>

        {/* recruitment */}
        <Route path="recruitment" element={<SetupGuard><RecruitmentPage /></SetupGuard>} />

        {/* diagnostic */}
        <Route path="diagnostic">
          <Route path="hub" element={<SetupGuard><DiagnosticHub /></SetupGuard>} />
          <Route path="retention" element={<SetupGuard><RetentionPage /></SetupGuard>} />
          <Route path="osi" element={<SetupGuard><OSIOverview /></SetupGuard>} />
        </Route>

        {/* executive intelligence center */}
        <Route path="executive-center" element={<SetupGuard><ExecutiveIntelligenceCenter /></SetupGuard>} />
        
        {/* profile & admin */}
        <Route path="profile" element={<SetupGuard><ProfilePage /></SetupGuard>} />
        <Route path="admin/users" element={<SetupGuard><UsersPage /></SetupGuard>} />
        <Route path="admin/company" element={<SetupGuard><CompanySettingsPage /></SetupGuard>} />
        
        {/* compatibility redirects (localized) */}
        <Route path="executive/mobile" element={<Navigate to="dashboard" replace />} />
        <Route path="core-hr">
          <Route index element={<Navigate to="../employees" replace />} />
          <Route path="master-data" element={<Navigate to="../employees" replace />} />
        </Route>
        <Route path="analytics/*" element={<Navigate to="dashboard" replace />} />
        <Route path="cci">
          <Route path="survey" element={<Navigate to="../diagnostic/hub" replace />} />
          <Route path="playbook" element={<Navigate to="../diagnostic/hub" replace />} />
        </Route>

        {/* 404 for localized space */}
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* global 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}