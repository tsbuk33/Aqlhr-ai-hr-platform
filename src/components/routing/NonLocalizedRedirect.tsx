import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { resolveLang } from '@/lib/i18n/localePath';

export default function NonLocalizedRedirect() {
  const { pathname, search } = useLocation();
  if (pathname.startsWith('/en') || pathname.startsWith('/ar')) {
    // Already localized; do not redirect again (prevents loops)
    return null;
  }
  const lang = resolveLang();
  return <Navigate to={`/${lang}${pathname}${search || ''}`} replace />;
}