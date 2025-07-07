import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ROUTES } from '@/config/routes';
import NotFound from '@/pages/NotFound';

// Mock auth guard component - replace with actual implementation
const RequireAuth: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({ 
  children, 
  adminOnly = false 
}) => {
  // TODO: Implement actual auth logic
  // For now, just render children
  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
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