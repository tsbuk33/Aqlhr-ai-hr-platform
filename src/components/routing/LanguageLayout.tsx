import { Navigate, Outlet, useParams } from 'react-router-dom';
import { localeDriver } from '@/lib/i18n/localeDriver';
import DevModeGuard from '@/lib/dev/DevModeGuard';
import { useEffect } from 'react';

export default function LanguageLayout() {
  const { lang } = useParams();
  
  // Apply language settings in useEffect to avoid setState during render
  useEffect(() => {
    if (lang === 'en' || lang === 'ar') {
      localeDriver.setLang(lang);
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    }
  }, [lang]);
  
  if (lang !== 'en' && lang !== 'ar') return <Navigate to="/en" replace />;

  return (
    <DevModeGuard>
      <div className="min-h-screen bg-background text-foreground">
        <Outlet />
      </div>
    </DevModeGuard>
  );
}