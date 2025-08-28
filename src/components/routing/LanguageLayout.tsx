import { Navigate, Outlet, useParams, useLocation } from 'react-router-dom';
import { localeDriver } from '@/lib/i18n/localeDriver';
import DevModeGuard from '@/lib/dev/DevModeGuard';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useEffect } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from '@/components/AppSidebar';
import { DashboardHeader } from '@/components/DashboardHeader';
import { useEnsureDemoSeed } from '@/hooks/useEnsureDemoSeed';

export default function LanguageLayout() {
  const { lang } = useParams();
  const location = useLocation();
  const demoReady = useEnsureDemoSeed();
  
  // Apply language settings in useEffect to avoid setState during render - force rebuild
  useEffect(() => {
    if (lang === 'en' || lang === 'ar') {
      localeDriver.setLang(lang);
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    }
  }, [lang]);
  
  if (lang !== 'en' && lang !== 'ar') return <Navigate to="/en" replace />;

  // Don't protect the auth page itself
  const isAuthPage = location.pathname.includes('/auth');

  const content = (
    <DevModeGuard>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background text-foreground">
          <AppSidebar />
          <main className={`flex-1 flex flex-col ${isAuthPage ? 'items-center justify-center' : ''}`}>
            <DashboardHeader />
            <div className={`flex-1 ${isAuthPage ? 'flex items-center justify-center' : 'p-6'}`}>
              <Outlet />
            </div>
          </main>
        </div>
      </SidebarProvider>
    </DevModeGuard>
  );

  // Wrap non-auth pages with ProtectedRoute
  return isAuthPage ? content : <ProtectedRoute>{content}</ProtectedRoute>;
}