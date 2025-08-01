import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { DashboardLayout } from './DashboardLayout';

interface LayoutShellProps {
  children: React.ReactNode;
}

export const LayoutShell: React.FC<LayoutShellProps> = ({ children }) => {
  const { user, isLoading } = useAuth();

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

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Welcome to AqlHR Platform</h1>
          <p className="text-muted-foreground">Please sign in to access your HR dashboard</p>
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