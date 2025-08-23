import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { resolveLang } from '@/lib/i18n/localePath';

export default function NonLocalizedRedirect() {
  const loc = useLocation();
  const { pathname, search } = loc;
  // If already /en or /ar, do nothing
  if (pathname.startsWith('/en/') || pathname === '/en' || pathname.startsWith('/ar/') || pathname === '/ar') {
    return <Navigate to={pathname + (search || '')} replace />;
  }
  const lang = resolveLang();
  const fixed = `/${lang}${pathname}${search || ''}`;
  return <Navigate to={fixed} replace />;
}