import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LanguageLayout from './LanguageLayout';
import CenteredLayout from '../layout/CenteredLayout';
import { DashboardLayout } from '../layout/DashboardLayout';
import AuthPage from '@/pages/AuthPage';
import AuthCallback from '@/pages/AuthCallback';
import Dashboard from '@/pages/Dashboard';
import Welcome from '@/pages/Welcome';
import AccessibleWelcome from '@/pages/AccessibleWelcome';

export default function AppRoutes() {
  // Localized child routes under ":lang/*" from UnifiedLanguageRouter
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/en/welcome-accessible" replace />} />
      <Route element={<LanguageLayout />}>
        {/* Welcome pages with their own layout */}
        <Route path="welcome" element={<Welcome />} />
        <Route index element={<AccessibleWelcome />} />

        {/* Routes that need CENTERED layout */}
        <Route element={<CenteredLayout />}>
          <Route path="auth" element={<AuthPage />} />
          <Route path="auth/callback" element={<AuthCallback />} />
        </Route>

        {/* New accessible welcome page (independent layout) */}
        <Route path="welcome-accessible" element={<AccessibleWelcome />} />

        {/* Routes that need DASHBOARD layout */}
        <Route element={<DashboardLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="welcome-accessible" replace />} />
      </Route>
    </Routes>
  );
}
