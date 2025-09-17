/**
 * AqlHR Language Layout - Simplified for AqlHR Design System
 * Sets dir attribute and renders Outlet
 */
import { Navigate, Outlet, useParams, useLocation } from 'react-router-dom';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';
import DevModeGuard from '@/lib/dev/DevModeGuard';
import { useEffect } from 'react';

export default function LanguageLayout() {
  const { lang: paramLang } = useParams();
  const location = useLocation();
  const { setLang, isRTL } = useUnifiedLocale();

  // Derive language from param OR path segment fallback
  const seg = location.pathname.split('/')[1];
  const routeLang = (paramLang === 'en' || paramLang === 'ar')
    ? (paramLang as 'en' | 'ar')
    : (seg === 'en' || seg === 'ar' ? (seg as 'en' | 'ar') : undefined);
  
  // Sync route language with unified locale system
  useEffect(() => {
    if (routeLang) {
      setLang(routeLang);
    }
  }, [routeLang, setLang]);
  
  // Set dir attribute for proper RTL/LTR layout
  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
    html.setAttribute('lang', isRTL ? 'ar' : 'en');
  }, [isRTL]);
  
  // Validate language parameter
  if (!routeLang) {
    return <Navigate to="/en" replace />;
  }

  return (
    <DevModeGuard>
      <Outlet />
    </DevModeGuard>
  );
}