import { Routes, Route, Navigate } from 'react-router-dom';
import LanguageLayout from './LanguageLayout';
import AuthPage from '@/pages/AuthPage';
import AuthCallback from '@/pages/AuthCallback';
import Dashboard from '@/pages/Dashboard';
import Welcome from '@/pages/Welcome';
export default function AppRoutes() {
  // Localized child routes under ":lang/*" from UnifiedLanguageRouter
  return (
    <Routes>
      <Route element={<LanguageLayout />}>
        {/* Default dashboard */}
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />

        {/* Welcome (localized) */}
        <Route path="welcome" element={<Welcome />} />

        {/* Authentication */}
        <Route path="auth" element={<AuthPage />} />
        <Route path="auth/callback" element={<AuthCallback />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>
    </Routes>
  );
}
