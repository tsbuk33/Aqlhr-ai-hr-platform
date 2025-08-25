import React from 'react';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    // Redirect to auth page while preserving current path
    const currentPath = window.location.pathname;
    const segments = currentPath.split('/');
    const lang = segments[1] === 'en' || segments[1] === 'ar' ? segments[1] : 'en';
    window.location.href = `/${lang}/auth?next=${encodeURIComponent(currentPath)}`;
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;