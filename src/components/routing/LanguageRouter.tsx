import React, { useEffect } from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import NonLocalizedRedirect from './NonLocalizedRedirect';
import AppRoutes from './AppRoutes';
import { setLang } from '@/lib/i18n/localePath';

function LocalizedApp() {
  const { lang } = useParams();
  useEffect(() => {
    if (lang === 'en' || lang === 'ar') setLang(lang);
  }, [lang]);
  return <AppRoutes />;
}

export default function LanguageRouter() {
  return (
    <Routes>
      {/* 1) Localized subtree FIRST */}
      <Route path=":lang(en|ar)/*" element={<LocalizedApp />} />
      {/* 2) Fallback: any non-localized path */}
      <Route path="*" element={<NonLocalizedRedirect />} />
    </Routes>
  );
}