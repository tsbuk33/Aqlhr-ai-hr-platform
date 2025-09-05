import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { EmployeeSidebar } from '@/components/sidebars/EmployeeSidebar';
import { EmployeeHeader } from '@/components/headers/EmployeeHeader';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';

export const EmployeeLayout: React.FC = () => {
  const { isRTL } = useUnifiedLocale();
  
  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex bg-gradient-to-br from-muted/10 via-background to-accent/10">
        <EmployeeSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <EmployeeHeader />
          <main className="flex-1 overflow-auto">
            <div 
              dir={isRTL ? 'rtl' : 'ltr'}
              className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-6"
            >
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};