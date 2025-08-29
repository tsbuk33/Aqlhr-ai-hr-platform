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
            <div 
              dir={isRTL ? 'rtl' : 'ltr'}
              className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-6"
            >
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};