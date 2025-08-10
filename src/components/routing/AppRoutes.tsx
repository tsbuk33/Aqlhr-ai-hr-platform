import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ROUTES } from '@/config/routes';
import NotFound from '@/pages/NotFound';
import AuthPage from '@/pages/AuthPage';
import ProtectedRoute from '@/components/ProtectedRoute';

const RequireAuth: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({ 
  children, 
  adminOnly = false 
}) => {
  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  );
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      {ROUTES.map((route) => {
        const Component = route.element;
        const element = route.auth ? (
          <RequireAuth adminOnly={route.adminOnly}>
            <Component />
          </RequireAuth>
        ) : (
          <Component />
        );

        return (
          <Route
            key={route.path}
            path={route.path}
            element={element}
          />
        );
      })}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};