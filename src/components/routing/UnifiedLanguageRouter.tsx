/**
 * AqlHR Unified Language Router - Phase 1A
 * Route-first language system with proper state synchronization
 */
import React, { useEffect } from 'react';
import { Routes, Route, useParams, Navigate } from 'react-router-dom';
import { unifiedLocaleDriver, useRouteLangSync } from '@/lib/i18n/unifiedLocaleSystem';
import AppRoutes from './AppRoutes';
/**
 * Localized App Wrapper - handles language synchronization
 */
function LocalizedApp() {
  const { lang } = useParams();
  
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

  // Root → send to localized welcome
  if (normalized === '/') {
    const currentLang = unifiedLocaleDriver.getLang();
    const redirectPath = `/${currentLang}/welcome${search}`;
    console.log('AqlHR: [UnifiedLanguageRouter] Redirecting root to:', redirectPath);
    return <Navigate to={redirectPath} replace />;
  }

  // If the path contains a language anywhere (including malformed prefixes), sanitize it
  const langMatch = normalized.match(/\/?(en|ar)(\/[A-Za-z0-9_\-\/]+)?/);
  if (langMatch) {
    const lang = langMatch[1] as 'en' | 'ar';
    const rest = langMatch[2] || '/welcome';
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
      <Route path=":lang(en|ar)/*" element={<LocalizedApp />} />
      
      {/* Non-localized root and fallback routes */}
      <Route path="/" element={<NonLocalizedRedirect />} />
      <Route path="*" element={<NonLocalizedRedirect />} />
    </Routes>
  );
}