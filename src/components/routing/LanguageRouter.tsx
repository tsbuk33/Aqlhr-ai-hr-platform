import React, { useEffect } from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import NonLocalizedRedirect from './NonLocalizedRedirect';
import { AppRoutes } from './AppRoutes';
import { setLang } from '@/lib/i18n/localePath';

function LocalizedApp() {
  const { lang } = useParams();
  useEffect(() => {
    if (lang === 'en' || lang === 'ar') setLang(lang);
  }, [lang]);
  return <AppRoutes />;
}

// Mount this once in App.tsx
export default function LanguageRouter() {
  return (
    <Routes>
      {/* catch any non-localized path and redirect to /{lang}/... */}
      <Route path="*" element={<NonLocalizedRedirect />} />
      {/* localized subtree */}
      <Route path=":lang(en|ar)/*" element={<LocalizedApp />} />
    </Routes>
  );
}