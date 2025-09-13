import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardHeader } from '../DashboardHeader';
import { useUserRole } from '@/hooks/useUserRole';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';
import { SuperAdminSidebar } from '@/components/sidebars/SuperAdminSidebar';
import { AdminSidebar } from '@/components/sidebars/AdminSidebar';
import { HRManagerSidebar } from '@/components/sidebars/HRManagerSidebar';
import { ManagerSidebar } from '@/components/sidebars/ManagerSidebar';
import { EmployeeSidebar } from '@/components/sidebars/EmployeeSidebar';

const RoleBasedSidebar: React.FC = () => {
  const { userRole } = useUserRole();
  
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

export const DashboardLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { isRTL } = useUnifiedLocale();
  
  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex bg-background">
        <RoleBasedSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader />
          <main className="flex-1 overflow-auto">
            <div 
              dir={isRTL ? 'rtl' : 'ltr'}
              className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-6"
            >
              {children || <Outlet />}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};