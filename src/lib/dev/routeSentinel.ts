import React from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { NAVIGABLE_ROUTES, RouteInfo } from './routesIndex';
import { logUiEvent } from '@/lib/observability/logUiEvent';
import { AppProviders } from '@/components/providers/AppProviders';
import { RootErrorBoundary } from '@/components/system/RootErrorBoundary';
import AppRoutes from '@/components/routing/AppRoutes';

export interface RouteAuditResult {
  route: string;
  lang: string;
  status: 'ok' | 'error' | 'timeout';
  mountMs: number;
  errorMessage?: string;
  i18nMissingCount: number;
  rtlOk: boolean;
}

/**
 * Test a single route by mounting it off-screen
 */
async function testRoute(routeInfo: RouteInfo, lang: 'en' | 'ar'): Promise<RouteAuditResult> {
  const startTime = performance.now();
  let errorMessage: string | undefined;
  let i18nMissingCount = 0;
  let status: 'ok' | 'error' | 'timeout' = 'ok';

  // Create off-screen container
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-99999px';
  container.style.top = '-99999px';
  container.style.width = '1px';
  container.style.height = '1px';
  container.style.overflow = 'hidden';
  document.body.appendChild(container);

  // Intercept console errors and i18n warnings
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;
  
  console.error = (...args) => {
    const message = args.join(' ');
    if (!errorMessage) {
      errorMessage = message;
      status = 'error';
    }
    originalConsoleError(...args);
  };

  console.warn = (...args) => {
    const message = args.join(' ');
    if (message.includes('i18n') || message.includes('missing') || message.includes('translation')) {
      i18nMissingCount++;
    }
    originalConsoleWarn(...args);
  };

  try {
    // Set language and direction
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    const root = createRoot(container);
    
    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        status = 'timeout';
        errorMessage = 'Component mount timeout (5s)';
        reject(new Error('Timeout'));
      }, 5000);

      try {
        root.render(
          React.createElement(RootErrorBoundary, { children: 
            React.createElement(AppProviders, { children:
              React.createElement(MemoryRouter, { 
                initialEntries: [`/${lang}${routeInfo.path}`],
                children: React.createElement(AppRoutes)
              })
            })
          })
        );

        // Give component time to mount and render
        setTimeout(() => {
          clearTimeout(timeout);
          resolve();
        }, 1000);
      } catch (error) {
        clearTimeout(timeout);
        status = 'error';
        errorMessage = error instanceof Error ? error.message : 'Unknown error';
        reject(error);
      }
    });

    root.unmount();
  } catch (error) {
    // Error already handled above
  } finally {
    // Restore console methods
    console.error = originalConsoleError;
    console.warn = originalConsoleWarn;
    
    // Clean up container
    document.body.removeChild(container);
  }

  const mountMs = Math.round(performance.now() - startTime);
  const rtlOk = lang === 'ar' ? document.documentElement.dir === 'rtl' : true;

  return {
    route: routeInfo.path,
    lang,
    status,
    mountMs,
    errorMessage,
    i18nMissingCount,
    rtlOk
  };
}

/**
 * Run route audit for specified language
 */
export async function runRouteAudit(options: { lang: 'en' | 'ar' }): Promise<RouteAuditResult[]> {
  const results: RouteAuditResult[] = [];
  
  console.log(`🔍 Starting route audit for ${options.lang.toUpperCase()}...`);
  
  for (const routeInfo of NAVIGABLE_ROUTES) {
    try {
      console.log(`Testing ${routeInfo.path} (${routeInfo.module})...`);
      
      const result = await testRoute(routeInfo, options.lang);
      results.push(result);
      
      // Log result to ui_events
      const { logUiEvent } = await import('@/lib/observability/logUiEvent');
      await logUiEvent({
        page: 'route_audit',
        level: result.status === 'ok' ? 'info' : result.status === 'error' ? 'error' : 'warn',
        message: `Route audit: ${routeInfo.path} (${options.lang}) - ${result.status}`,
        details: {
          route: result.route,
          lang: result.lang,
          module: routeInfo.module,
          mountMs: result.mountMs,
          status: result.status,
          errorMessage: result.errorMessage,
          i18nMissingCount: result.i18nMissingCount,
          rtlOk: result.rtlOk,
          auditTimestamp: new Date().toISOString()
        }
      });
      
      // Small delay between tests to prevent overload
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error(`Failed to test route ${routeInfo.path}:`, error);
      
      const errorResult: RouteAuditResult = {
        route: routeInfo.path,
        lang: options.lang,
        status: 'error',
        mountMs: 0,
        errorMessage: error instanceof Error ? error.message : 'Test failure',
        i18nMissingCount: 0,
        rtlOk: false
      };
      
      results.push(errorResult);
    }
  }
  
  console.log(`✅ Route audit complete: ${results.length} routes tested`);
  return results;
}

/**
 * Test a single route (for quick re-check)
 */
export async function testSingleRoute(routeInfo: RouteInfo, lang: 'en' | 'ar'): Promise<RouteAuditResult> {
  const result = await testRoute(routeInfo, lang);
  
  // Log single test result
  const { logUiEvent } = await import('@/lib/observability/logUiEvent');
  await logUiEvent({
    page: 'route_audit',
    level: result.status === 'ok' ? 'info' : result.status === 'error' ? 'error' : 'warn',
    message: `Single route test: ${routeInfo.path} (${lang}) - ${result.status}`,
    details: {
      route: result.route,
      lang: result.lang,
      module: routeInfo.module,
      mountMs: result.mountMs,
      status: result.status,
      errorMessage: result.errorMessage,
      i18nMissingCount: result.i18nMissingCount,
      rtlOk: result.rtlOk,
      auditTimestamp: new Date().toISOString(),
      testType: 'single_route'
    }
  });
  
  return result;
}