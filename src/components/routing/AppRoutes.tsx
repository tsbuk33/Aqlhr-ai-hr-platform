import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LanguageLayout from './LanguageLayout';
import CenteredLayout from '../layout/CenteredLayout';
import { DashboardLayout } from '../layout/DashboardLayout';
import AuthPage from '@/pages/AuthPage';
import AuthCallback from '@/pages/AuthCallback';
import Dashboard from '@/pages/Dashboard';
import Welcome from '@/pages/Welcome';
import AqlHRWelcome from '@/pages/AqlHRWelcome';

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
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
