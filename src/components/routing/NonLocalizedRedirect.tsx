import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { resolveLang } from '@/lib/i18n/localePath';

export default function NonLocalizedRedirect() {
  const { pathname, search } = useLocation();
  
  // If user is on root path, redirect to localized system-overview
  if (pathname === '/') {
    const lang = resolveLang();
    return <Navigate to={`/${lang}/system-overview${search || ''}`} replace />;
  }
  
  if (pathname.startsWith('/en') || pathname.startsWith('/ar')) {
    // Already localized; do not redirect again (prevents loops)
    return null;
  }
  const lang = resolveLang();
  return <Navigate to={`/${lang}${pathname}${search || ''}`} replace />;
}