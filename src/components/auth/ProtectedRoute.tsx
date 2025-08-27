import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthOptional } from '@/hooks/useAuthOptional';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = true 
}) => {
  const { user, isLoading } = useAuthOptional();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (requireAuth && !user) {
    // Redirect to auth page with return URL
    return <Navigate to="/en/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};