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
  
  // Set body attributes for proper RTL layout
  useEffect(() => {
    const body = document.body;
    const html = document.documentElement;
    
    if (isRTL) {
      body.setAttribute('dir', 'rtl');
      body.classList.add('arabic-layout');
      html.setAttribute('dir', 'rtl');
      html.setAttribute('lang', 'ar');
    } else {
      body.setAttribute('dir', 'ltr');
      body.classList.remove('arabic-layout');
      html.setAttribute('dir', 'ltr');
      html.setAttribute('lang', 'en');
    }
    
    return () => {
      // Cleanup on unmount
      body.removeAttribute('dir');
      body.classList.remove('arabic-layout');
      html.removeAttribute('dir');
      html.removeAttribute('lang');
    };
  }, [isRTL]);
  
  // Validate language parameter
  if (!routeLang) {
    console.log('[LanguageLayout] Invalid/missing language, redirecting to /en');
    return <Navigate to="/en" replace />;
  }

  // Page type detection
  const isAuthPage = location.pathname.includes('/auth');
  const isWelcomePage = location.pathname.includes('/welcome') || location.pathname === `/${routeLang}` || location.pathname === `/${routeLang}/`;

  const content = (
    <DevModeGuard>
      <SidebarProvider>
        <div className={isRTL ? 'arabic-content' : 'english-content'}>
          <div 
            className={`min-h-screen flex w-full bg-background text-foreground ${isRTL ? 'rtl-container' : 'ltr-container'}`}
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            {!isAuthPage && !isWelcomePage && <AppSidebar />}
            <main className={`flex-1 flex flex-col ${isAuthPage ? 'items-center justify-center' : ''}`}>
              {!isAuthPage && !isWelcomePage && <DashboardHeader />}
              <div className={`flex-1 ${isAuthPage ? 'flex items-center justify-center' : ''}`}>
                {isAuthPage ? (
                  <Outlet />
                ) : isWelcomePage ? (
                  <Outlet />
                ) : (
                  <div className={isRTL ? 'page-container-centered rtl' : 'container mx-auto max-w-7xl p-6'} dir={isRTL ? 'rtl' : 'ltr'}>
                    <Outlet />
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </DevModeGuard>
  );

  // Wrap non-auth and non-welcome pages with ProtectedRoute
  return (isAuthPage || isWelcomePage) ? content : <ProtectedRoute>{content}</ProtectedRoute>;
}