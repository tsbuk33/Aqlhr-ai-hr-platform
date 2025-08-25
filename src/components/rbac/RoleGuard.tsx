import React from 'react';
import { useUserProfile, UserRole } from '@/hooks/useUserProfile';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShieldOff } from 'lucide-react';

interface RoleGuardProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
  showError?: boolean;
}

export function RoleGuard({ 
  children, 
  requiredRoles = [], 
  requireAll = false,
  fallback,
  showError = true
}: RoleGuardProps) {
  const { profile, loading } = useUserProfile();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profile) {
    if (showError) {
      return (
        <Alert variant="destructive">
          <ShieldOff className="h-4 w-4" />
          <AlertDescription>
            Authentication required to access this content.
          </AlertDescription>
        </Alert>
      );
    }
    return fallback || null;
  }

  if (requiredRoles.length === 0) {
    return <>{children}</>;
  }

  const hasAccess = requireAll 
    ? requiredRoles.every(role => profile.role === role)
    : requiredRoles.some(role => profile.role === role);

  if (!hasAccess) {
    if (showError) {
      return (
        <Alert variant="destructive">
          <ShieldOff className="h-4 w-4" />
          <AlertDescription>
            You don't have permission to access this content. Required roles: {requiredRoles.join(', ')}
          </AlertDescription>
        </Alert>
      );
    }
    return fallback || null;
  }

  return <>{children}</>;
}