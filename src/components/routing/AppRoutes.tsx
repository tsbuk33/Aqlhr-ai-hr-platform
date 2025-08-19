import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ROUTES } from '@/config/routes';
import NotFound from '@/pages/NotFound';
import AuthPage from '@/pages/AuthPage';
import AuthCallback from '@/pages/auth/AuthCallback';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';

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
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      {ROUTES.map((route) => {
        const Component = route.element;
        // In preview mode (no authenticated user), bypass auth for all routes
        const element = route.auth && user ? (
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