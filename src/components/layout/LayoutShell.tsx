import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { DashboardLayout } from './DashboardLayout';
import { Button } from '@/components/ui/button';
interface LayoutShellProps {
  children: React.ReactNode;
}

export const LayoutShell: React.FC<LayoutShellProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

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

  // Public routes allowed without authentication (for development/preview)
  const PUBLIC_ROUTES = ['/', '/dashboard'];
  const isPublicRoute = PUBLIC_ROUTES.some((p) => location.pathname === p || location.pathname.startsWith(p + '/'));

  if (!user && !isPublicRoute) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="text-center space-y-6 max-w-md mx-auto p-6">
          <div className="space-y-3">
            <h1 className="text-4xl font-bold text-foreground">Welcome to AqlHR Platform</h1>
            <p className="text-muted-foreground text-lg">Please sign in to access your HR dashboard</p>
          </div>
          <div className="space-y-4">
            <Button 
              asChild 
              size="lg" 
              className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white"
            >
              <Link to="/auth" className="inline-flex items-center justify-center">
                Sign In to Dashboard
              </Link>
            </Button>
            <p className="text-sm text-muted-foreground">
              New to AqlHR? You can create an account on the next page.
            </p>
          </div>
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