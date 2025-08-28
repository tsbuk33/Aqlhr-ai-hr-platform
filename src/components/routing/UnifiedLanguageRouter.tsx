/**
 * AqlHR Unified Language Router - Phase 1A
 * Route-first language system with proper state synchronization
 */
import React, { useEffect } from 'react';
import { Routes, Route, useParams, Navigate } from 'react-router-dom';
import { unifiedLocaleDriver, useRouteLangSync } from '@/lib/i18n/unifiedLocaleSystem';
import AppRoutes from './AppRoutes';
import Welcome from '@/pages/Welcome';

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
  const currentPath = rawPath.replace(/\/{2,}/g, '/');
  
  console.log('[UnifiedLanguageRouter] Handling non-localized path:', rawPath, '→ normalized:', currentPath);
  
  // Root path shows welcome page
  if (currentPath === '/') {
    return <Welcome />;
  }
  
  // Already localized paths should not redirect
  if (currentPath.startsWith('/en') || currentPath.startsWith('/ar')) {
    return null;
  }
  
  // Get current language preference and redirect
  const currentLang = unifiedLocaleDriver.getLang();
  const redirectPath = `/${currentLang}${currentPath}${search}`;
  
  console.log('[UnifiedLanguageRouter] Redirecting to:', redirectPath);
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
      
      {/* Non-localized fallback routes */}
      <Route path="*" element={<NonLocalizedRedirect />} />
    </Routes>
  );
}