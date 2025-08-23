import { Navigate, Outlet, useParams } from 'react-router-dom';
import { localeDriver } from '@/lib/i18n/localeDriver';
import DevModeGuard from '@/lib/dev/DevModeGuard';

export default function LanguageLayout() {
  const { lang } = useParams();
  if (lang !== 'en' && lang !== 'ar') return <Navigate to="/en" replace />;

  // apply language + direction
  localeDriver.setLang(lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

  return (
    <DevModeGuard>
      <div className="min-h-screen bg-background text-foreground">
        <Outlet />
      </div>
    </DevModeGuard>
  );
}