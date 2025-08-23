import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '@/config/routes';
import NotFound from '@/pages/NotFound';
import AuthPage from '@/pages/AuthPage';
import AuthCallback from '@/pages/auth/AuthCallback';
import Survey from '@/pages/cci/Survey';
import SurveyThanks from '@/pages/cci/SurveyThanks';
import Respond from '@/pages/cci/Respond';
import CCIAdminLinks from '@/pages/cci/admin/Links';

export const AppRoutes: React.FC = () => {  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Routes>
        {/* Dashboard redirect */}
        <Route path="/" element={<Navigate to="dashboard" replace />} />
        
        {/* Public routes without authentication - no auth prefix needed */}
        <Route path="auth" element={<AuthPage />} />
        <Route path="auth/callback" element={<AuthCallback />} />
        <Route path="cci/survey" element={<Survey />} />
        <Route path="cci/survey/thanks" element={<SurveyThanks />} />
        <Route path="cci/respond" element={<Respond />} />
        <Route path="cci/admin/links" element={<CCIAdminLinks />} />
        
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
        
        {/* Catch-all 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};