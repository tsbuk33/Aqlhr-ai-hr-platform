import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ROUTES } from '@/config/routes';
import NotFound from '@/pages/NotFound';
import AuthPage from '@/pages/AuthPage';
import AuthCallback from '@/pages/auth/AuthCallback';
import Survey from '@/pages/cci/Survey';
import SurveyThanks from '@/pages/cci/SurveyThanks';


export const AppRoutes: React.FC = () => {
  console.log('[AppRoutes] rendering routes:', ROUTES.length);
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/cci/survey" element={<Survey />} />
      <Route path="/cci/survey/thanks" element={<SurveyThanks />} />
      {ROUTES.map((route) => {
        const Component = route.element;
        return (
          <Route
            key={route.path}
            path={route.path}
            element={<Component />}
          />
        );
      })}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};