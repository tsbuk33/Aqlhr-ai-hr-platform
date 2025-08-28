/**
 * AqlHR Language Layout - Updated for Unified Locale System
 * Professional HR platform layout with proper Arabic RTL support
 */
import { Navigate, Outlet, useParams, useLocation } from 'react-router-dom';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';
import DevModeGuard from '@/lib/dev/DevModeGuard';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useEffect } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from '@/components/AppSidebar';
import { DashboardHeader } from '@/components/DashboardHeader';
import { useEnsureDemoSeed } from '@/hooks/useEnsureDemoSeed';

export default function LanguageLayout() {
  const { lang } = useParams();
  const location = useLocation();
  const demoReady = useEnsureDemoSeed();
  const { setLang, isRTL } = useUnifiedLocale();
  
  // Sync route language with unified locale system
  useEffect(() => {
    if (lang === 'en' || lang === 'ar') {
      console.log('[LanguageLayout] Syncing route language:', lang);
      setLang(lang);
    }
  }, [lang, setLang]);
  
  // Validate language parameter
  if (lang !== 'en' && lang !== 'ar') {
    console.log('[LanguageLayout] Invalid language, redirecting to /en');
    return <Navigate to="/en" replace />;
  }

  // Don't protect the auth page itself and allow public welcome page
  const isAuthPage = location.pathname.includes('/auth') || location.pathname.includes('/welcome');

  const content = (
    <DevModeGuard>
      <SidebarProvider>
        <div 
          className={`min-h-screen flex w-full bg-background text-foreground ${isRTL ? 'rtl-container' : 'ltr-container'}`}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          {!isAuthPage && <AppSidebar />}
          <main className={`flex-1 flex flex-col ${isAuthPage ? 'items-center justify-center' : ''}`}>
            {!isAuthPage && <DashboardHeader />}
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