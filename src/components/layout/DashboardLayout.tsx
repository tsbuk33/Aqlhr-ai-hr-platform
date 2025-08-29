import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardHeader } from '../DashboardHeader';
import { SuperAdminSidebar } from '@/components/sidebars/SuperAdminSidebar';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';
interface DashboardLayoutProps {
  children: React.ReactNode;
}

const RoleBasedSidebar: React.FC = () => {
  return <SuperAdminSidebar />;
};

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { isRTL } = useUnifiedLocale();
  
  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex bg-background">
        <RoleBasedSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader />
          <main className="flex-1 overflow-auto">
            <div className={isRTL ? 'page-container-centered rtl' : 'container mx-auto max-w-7xl p-6'} dir={isRTL ? 'rtl' : 'ltr'}>
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};