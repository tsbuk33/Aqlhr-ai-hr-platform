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
  const { lang: paramLang } = useParams();
  const location = useLocation();
  const demoReady = useEnsureDemoSeed();
  const { setLang, isRTL } = useUnifiedLocale();

  // Derive language from param OR path segment fallback
  const seg = location.pathname.split('/')[1];
  const routeLang = (paramLang === 'en' || paramLang === 'ar')
    ? (paramLang as 'en' | 'ar')
    : (seg === 'en' || seg === 'ar' ? (seg as 'en' | 'ar') : undefined);
  
  // Sync route language with unified locale system
  useEffect(() => {
    if (routeLang) {
      console.log('[LanguageLayout] Syncing route language:', routeLang);
      setLang(routeLang);
    }
  }, [routeLang, setLang]);
  
  // Validate language parameter
  if (!routeLang) {
    console.log('[LanguageLayout] Invalid/missing language, redirecting to /en');
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
              {isAuthPage ? (
                <Outlet />
              ) : (
                <div className={isRTL ? 'container mx-auto max-w-7xl space-y-6' : ''}>
                  <Outlet />
                </div>
              )}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </DevModeGuard>
  );

  // Wrap non-auth pages with ProtectedRoute
  return isAuthPage ? content : <ProtectedRoute>{content}</ProtectedRoute>;
}