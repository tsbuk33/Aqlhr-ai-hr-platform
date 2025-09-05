import React from 'react';
import { useUserRole, UserRole } from '@/hooks/useUserRole';
import { SuperAdminLayout } from '@/layouts/SuperAdminLayout';
import { AdminLayout } from '@/layouts/AdminLayout';
import { HRManagerLayout } from '@/layouts/HRManagerLayout';
import { ManagerLayout } from '@/layouts/ManagerLayout';
import { EmployeeLayout } from '@/layouts/EmployeeLayout';
import { Loader2 } from 'lucide-react';

interface RoleBasedLayoutWrapperProps {
  children: React.ReactNode;
}

export const RoleBasedLayoutWrapper: React.FC<RoleBasedLayoutWrapperProps> = ({ children }) => {
  const { userRole, isLoading } = useUserRole();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading interface...</p>
        </div>
      </div>
    );
  }

  // Route to appropriate layout based on user role
  switch (userRole) {
    case 'super_admin':
      return <SuperAdminLayout />;
    case 'admin':
      return <AdminLayout />;
    case 'hr_manager':
      return <HRManagerLayout />;
    case 'manager':
      return <ManagerLayout />;
    case 'employee':
    default:
      return <EmployeeLayout />;
  }
};