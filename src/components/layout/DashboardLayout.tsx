import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardHeader } from '../DashboardHeader';
import { SuperAdminSidebar } from '@/components/sidebars/SuperAdminSidebar';
interface DashboardLayoutProps {
  children: React.ReactNode;
}

const RoleBasedSidebar: React.FC = () => {
  return <SuperAdminSidebar />;
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