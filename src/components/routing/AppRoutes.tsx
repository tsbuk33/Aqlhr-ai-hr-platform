import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ROUTES } from '@/config/routes';
import MainLayout from '@/components/layout/MainLayout';
import NotFound from '@/pages/NotFound';
import AuthPage from '@/pages/AuthPage';
import AuthCallback from '@/pages/auth/AuthCallback';
import Survey from '@/pages/cci/Survey';
import SurveyThanks from '@/pages/cci/SurveyThanks';
import Respond from '@/pages/cci/Respond';
import CCIAdminLinks from '@/pages/cci/admin/Links';
import DiagnosticHub from '@/pages/diagnostic/Hub';
import OSI from '@/pages/diagnostic/OSI';
import Retention from '@/pages/diagnostic/Retention';
import OrgStructureIntelligence from '@/pages/diagnostic/OrgStructureIntelligence';
import RequireTenant from '@/components/guards/RequireTenant';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Index under :lang/* */}
        <Route index element={<Navigate to="dashboard" replace />} />
        
        {/* Public routes without authentication */}
        <Route path="auth" element={<AuthPage />} />
        <Route path="auth/callback" element={<AuthCallback />} />
        <Route path="cci/survey" element={<Survey />} />
        <Route path="cci/survey/thanks" element={<SurveyThanks />} />
        <Route path="cci/respond" element={<Respond />} />
        <Route path="cci/admin/links" element={<CCIAdminLinks />} />
        
        {/* Diagnostic routes with tenant requirement */}
        <Route path="diagnostic" element={<RequireTenant><Outlet /></RequireTenant>}>
          <Route path="hub" element={<DiagnosticHub />} />
          <Route path="osi" element={<OSI />} />
          <Route path="retention" element={<Retention />} />
          <Route path="org-structure-intelligence" element={<OrgStructureIntelligence />} />
        </Route>
        
        {/* Main application routes - all relative paths */}
        {ROUTES.map((route) => {
          const Component = route.element;
          // Ensure all paths are relative (no leading slash)
          const nestedPath = route.path.startsWith('/') ? route.path.slice(1) : route.path;
          return (
            <Route
              key={route.path}
              path={nestedPath}
              element={<Component />}
            />
          );
        })}
        
        {/* Catch-all redirect to dashboard */}
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>
    </Routes>
  );
}