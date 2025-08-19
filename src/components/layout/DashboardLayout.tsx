import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardHeader } from '../DashboardHeader';
import { useUserRole } from '@/hooks/useUserRole';
import { SuperAdminSidebar } from '@/components/sidebars/SuperAdminSidebar';
import { AdminSidebar } from '@/components/sidebars/AdminSidebar';
import { HRManagerSidebar } from '@/components/sidebars/HRManagerSidebar';
import { ManagerSidebar } from '@/components/sidebars/ManagerSidebar';
import { EmployeeSidebar } from '@/components/sidebars/EmployeeSidebar';
import { useLocation } from 'react-router-dom';
interface DashboardLayoutProps {
  children: React.ReactNode;
}

const RoleBasedSidebar: React.FC = () => {
  const { userRole, isLoading } = useUserRole();

  if (isLoading) {
    return <div className="w-14 bg-sidebar border-r" />;
  }

  switch (userRole) {
    case 'super_admin':
      return <SuperAdminSidebar />;
    case 'admin':
      return <AdminSidebar />;
    case 'hr_manager':
      return <HRManagerSidebar />;
    case 'manager':
      return <ManagerSidebar />;
    case 'employee':
    default:
      return <EmployeeSidebar />;
  }
};

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex bg-background">
        <RoleBasedSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader />
          <main className="flex-1 overflow-auto">
            <div className="p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};