import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth.tsx';
import { DashboardLayout } from './DashboardLayout';
import { Button } from '@/components/ui/button';
interface LayoutShellProps {
  children: React.ReactNode;
}

export const LayoutShell: React.FC<LayoutShellProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  console.log('[LayoutShell] route=', location.pathname, 'user=', user?.id || null, 'isLoading=', isLoading);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Allow auth routes to render without the dashboard shell
  if (location.pathname.startsWith('/auth')) {
    return <>{children}</>;
  }

  // Authentication gating disabled: all routes are accessible
  // regardless of authentication status.

  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
};