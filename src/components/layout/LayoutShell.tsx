import React from 'react';
import { AppSidebar } from '@/components/AppSidebar';
import { DashboardHeader } from '@/components/DashboardHeader';
import { ExecutiveFloatingButton } from '@/components/executive/ExecutiveFloatingButton';
import { GlobalFooter } from '@/components/GlobalFooter';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/layout/Header';

interface LayoutShellProps {
  children: React.ReactNode;
}

export const LayoutShell: React.FC<LayoutShellProps> = ({ children }) => {
  const { isArabic } = useSimpleLanguage();
  const { user } = useAuth();
  
  // For unauthenticated users, show a minimal layout
  if (!user) {
    return (
      <div className="min-h-screen w-full bg-background">
        {children}
      </div>
    );
  }
  
  return (
    <div className={`flex min-h-screen w-full max-w-full bg-gradient-to-br from-background via-background-subtle to-surface-subtle ${isArabic ? 'flex-row-reverse' : ''}`} dir={isArabic ? 'rtl' : 'ltr'}>
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0 max-w-full overflow-hidden">
        <Header />
        <DashboardHeader />
        <main className="flex-1 overflow-auto relative w-full">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface-subtle/20 to-transparent pointer-events-none"></div>
          <div className="relative z-10 p-4 sm:p-6 lg:p-8 w-full max-w-full">
            <div className="w-full max-w-full">
              {children}
            </div>
          </div>
        </main>
        <GlobalFooter />
      </div>
    </div>
  );
};