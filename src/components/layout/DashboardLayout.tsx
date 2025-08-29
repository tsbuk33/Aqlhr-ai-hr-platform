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
  
  const centerStyle = {
    textAlign: 'center' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '100%',
    maxWidth: '1400px',
    padding: '20px'
  };
  
  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex bg-background">
        <RoleBasedSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader />
          <main className="flex-1 overflow-auto" style={centerStyle}>
            <div 
              style={centerStyle} 
              dir={isRTL ? 'rtl' : 'ltr'}
              className="force-center"
            >
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};