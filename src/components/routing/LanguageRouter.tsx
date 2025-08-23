import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useParams, useLocation } from 'react-router-dom';
import { localeDriver, Lang } from '@/lib/i18n/localeDriver';
import { AppRoutes } from './AppRoutes';

/**
 * Component that handles the language parameter from URL and syncs with localeDriver
 */
const LanguageSync: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { lang } = useParams<{ lang: string }>();
  const location = useLocation();

  useEffect(() => {
    if (lang && (lang === 'ar' || lang === 'en')) {
      localeDriver.setLang(lang as Lang);
    }
  }, [lang]);

  // If we have an invalid language in the URL, redirect to resolved language
  useEffect(() => {
    if (lang && lang !== 'ar' && lang !== 'en') {
      const resolvedLang = localeDriver.resolveLang();
      const newPath = location.pathname.replace(`/${lang}`, `/${resolvedLang}`);
      window.history.replaceState(null, '', newPath + location.search);
    }
  }, [lang, location]);

  return <>{children}</>;
};

/**
 * Root redirect component that determines the default language
 */
const RootRedirect: React.FC = () => {
  const resolvedLang = localeDriver.resolveLang();
  const location = useLocation();
  
  // Redirect to the resolved language with current search params
  return <Navigate to={`/${resolvedLang}${location.search}`} replace />;
};

/**
 * Main language router component that handles prefixed routes
 */
export const LanguageRouter: React.FC = () => {
  return (
    <Routes>
      {/* Catch-all redirect from root to language-prefixed route */}
      <Route path="/" element={<RootRedirect />} />
      
      {/* Language-prefixed routes */}
      <Route 
        path="/:lang/*" 
        element={
          <LanguageSync>
            <AppRoutes />
          </LanguageSync>
        } 
      />
      
      {/* Fallback for any other routes - redirect to resolved language */}
      <Route path="*" element={<RootRedirect />} />
    </Routes>
  );
};