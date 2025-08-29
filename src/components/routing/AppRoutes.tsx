import { Routes, Route, Navigate } from 'react-router-dom';
import LanguageLayout from './LanguageLayout';
import CenteredLayout from '../layout/CenteredLayout';
import { DashboardLayout } from '../layout/DashboardLayout';
import AuthPage from '@/pages/AuthPage';
import AuthCallback from '@/pages/AuthCallback';
import Dashboard from '@/pages/Dashboard';
import Welcome from '@/pages/Welcome';

export default function AppRoutes() {
  // Localized child routes under ":lang/*" from UnifiedLanguageRouter
  return (
    <Routes>
      <Route element={<LanguageLayout />}>
        {/* Routes that need CENTERED layout */}
        <Route element={<CenteredLayout />}>
          <Route path="welcome" element={<Welcome />} />
          <Route path="auth" element={<AuthPage />} />
          <Route path="auth/callback" element={<AuthCallback />} />
          <Route index element={<Welcome />} />
        </Route>

        {/* Routes that need DASHBOARD layout */}
        <Route element={<DashboardLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="welcome" replace />} />
      </Route>
    </Routes>
  );
}
