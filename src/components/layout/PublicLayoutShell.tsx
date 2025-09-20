import React from 'react';
import { DashboardLayout } from './DashboardLayout';

interface PublicLayoutShellProps {
  children: React.ReactNode;
}

export const PublicLayoutShell: React.FC<PublicLayoutShellProps> = ({ children }) => {
  // No authentication checks - always show the dashboard layout with sidebar
  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
};