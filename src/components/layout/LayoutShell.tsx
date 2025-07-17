import React from 'react';
import { AppSidebar } from '@/components/AppSidebar';
import { DashboardHeader } from '@/components/DashboardHeader';
import { GlobalFooter } from '@/components/GlobalFooter';

interface LayoutShellProps {
  children: React.ReactNode;
}

export const LayoutShell: React.FC<LayoutShellProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-background via-background-subtle to-surface-subtle">
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 overflow-auto relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface-subtle/20 to-transparent pointer-events-none"></div>
          <div className="relative z-10">
            {children}
          </div>
        </main>
        <GlobalFooter />
      </div>
    </div>
  );
};