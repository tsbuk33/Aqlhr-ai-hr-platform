import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardHeader } from '../DashboardHeader';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';
import { AppSidebar } from '@/components/AppSidebar';


export const DashboardLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { isRTL } = useUnifiedLocale();
  
  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex bg-background text-foreground">
        <AppSidebar />
        <div className="flex-1 flex flex-col relative z-0">
          <DashboardHeader />
          <main className="flex-1 overflow-auto bg-background">
            <section 
              dir={isRTL ? 'rtl' : 'ltr'}
              className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 min-h-[calc(100vh-5rem)]"
            >
              {children || <Outlet />}
            </section>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};