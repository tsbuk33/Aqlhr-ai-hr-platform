/**
 * AqlHR Language Layout - Updated for Unified Locale System
 * Professional HR platform layout with proper Arabic RTL support
 */
import { Navigate, Outlet, useParams, useLocation } from 'react-router-dom';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';
import DevModeGuard from '@/lib/dev/DevModeGuard';
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
  }, [isRTL]);
  
  // Validate language parameter
  if (!routeLang) {
    console.log('[LanguageLayout] Invalid/missing language, redirecting to /en');
    return <Navigate to="/en" replace />;
  }

  // Page type detection  
  const isWelcomePage = location.pathname === `/${routeLang}` || location.pathname === `/${routeLang}/`;

  // Early return for WELCOME pages → let CenteredLayout control layout
  if (isWelcomePage) {
    return (
      <DevModeGuard>
        <Outlet />
      </DevModeGuard>
    );
  }

  return (
    <DevModeGuard>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background text-foreground" dir={isRTL ? 'rtl' : 'ltr'}>
          <AppSidebar />
          <main className="flex-1 flex flex-col">
            <DashboardHeader />
            <div className="flex-1 p-6">
              <Outlet />
            </div>
          </main>
        </div>
      </SidebarProvider>
    </DevModeGuard>
  );
}