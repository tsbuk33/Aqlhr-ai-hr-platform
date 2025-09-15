/**
 * AqlHR Unified Language Router - Phase 1A
 * Route-first language system with proper state synchronization
 */
import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { unifiedLocaleDriver, useRouteLangSync } from '@/lib/i18n/unifiedLocaleSystem';
import AppRoutes from './AppRoutes';
/**
 * Localized App Wrapper - handles language synchronization
 */
function LocalizedApp() {
  const { pathname } = useLocation();
  const seg = pathname.split('/')[1];
  const lang = seg === 'en' || seg === 'ar' ? (seg as 'en' | 'ar') : undefined;
  
  // Sync route language with locale system
  useRouteLangSync(lang);
  
  return <AppRoutes />;
}

/**
 * Non-localized Route Handler
 */
function NonLocalizedRedirect() {
  const rawPath = window.location.pathname || '/';
  const search = window.location.search || '';

  // Normalize multiple slashes
  const normalized = rawPath.replace(/\/{2,}/g, '/');

  console.log('AqlHR: [UnifiedLanguageRouter] Handling non-localized path:', rawPath, '→ normalized:', normalized);

  // Special routes that should work without language prefix
  const directRoutes = ['/dashboard', '/auth'];
  if (directRoutes.some(route => normalized.startsWith(route))) {
    console.log('AqlHR: [UnifiedLanguageRouter] Direct route access allowed:', normalized);
    return <AppRoutes />;
  }

  // Root → send to dashboard
  if (normalized === '/') {
    console.log('AqlHR: [UnifiedLanguageRouter] Redirecting root to dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  // If the path contains a language anywhere (including malformed prefixes), sanitize it
  const langMatch = normalized.match(/\/?(en|ar)(\/[A-Za-z0-9_\-\/]+)?/);
  if (langMatch) {
    const lang = langMatch[1] as 'en' | 'ar';
    const rest = langMatch[2] || '/dashboard';
    const redirectPath = `/${lang}${rest}${search}`;
    console.log('AqlHR: [UnifiedLanguageRouter] Sanitizing to localized path:', redirectPath);
    return <Navigate to={redirectPath} replace />;
  }

  // Fallback: prefix current preference to whatever path remains
  const currentLang = unifiedLocaleDriver.getLang();
  const redirectPath = `/${currentLang}${normalized}${search}`;
  console.log('AqlHR: [UnifiedLanguageRouter] Redirecting to:', redirectPath);
  return <Navigate to={redirectPath} replace />;
}

/**
 * Main Language Router Component
 */
export default function UnifiedLanguageRouter() {
  useEffect(() => {
    console.log('[UnifiedLanguageRouter] Router mounted');
    // Ensure locale driver is initialized
    unifiedLocaleDriver.initialize();
  }, []);

  return (
    <Routes>
      {/* Localized routes - MUST come first for proper matching */}
      <Route path="/en/*" element={<LocalizedApp />} />
      <Route path="/ar/*" element={<LocalizedApp />} />
      
      {/* Non-localized root and fallback routes */}
      <Route path="/" element={<NonLocalizedRedirect />} />
      <Route path="*" element={<NonLocalizedRedirect />} />
    </Routes>
  );
}