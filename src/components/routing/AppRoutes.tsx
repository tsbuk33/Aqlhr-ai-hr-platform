import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ROUTES } from '@/config/routes';
import NotFound from '@/pages/NotFound';
import AuthPage from '@/pages/AuthPage';
import AuthCallback from '@/pages/auth/AuthCallback';
import Survey from '@/pages/cci/Survey';
import SurveyThanks from '@/pages/cci/SurveyThanks';
import Respond from '@/pages/cci/Respond';
import CCIAdminLinks from '@/pages/cci/admin/Links';


export const AppRoutes: React.FC = () => {
  const location = useLocation();
  
  console.log('[AppRoutes] Current pathname:', location.pathname, 'Routes count:', ROUTES.length);
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Routes>
        {/* Public routes without authentication - no auth prefix needed */}
        <Route path="auth" element={<AuthPage />} />
        <Route path="auth/callback" element={<AuthCallback />} />
        <Route path="cci/survey" element={<Survey />} />
        <Route path="cci/survey/thanks" element={<SurveyThanks />} />
        <Route path="cci/respond" element={<Respond />} />
        <Route path="cci/admin/links" element={<CCIAdminLinks />} />
        
        {/* Main application routes - remove leading slash for nested routing */}
        {ROUTES.map((route) => {
          const Component = route.element;
          // Remove leading slash from route paths for nested routing
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