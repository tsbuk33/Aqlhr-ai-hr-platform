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
  if (location.pathname.startsWith('/auth') || location.pathname.includes('/auth')) {
    return <>{children}</>;
  }

  // For non-authenticated users, redirect to auth page unless already there
  if (!user && !location.pathname.includes('/auth')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Redirecting to authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
};