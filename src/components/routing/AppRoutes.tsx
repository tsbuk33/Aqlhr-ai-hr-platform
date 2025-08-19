import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ROUTES } from '@/config/routes';
import NotFound from '@/pages/NotFound';
import AuthPage from '@/pages/AuthPage';
import AuthCallback from '@/pages/auth/AuthCallback';


export const AppRoutes: React.FC = () => {
  
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
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