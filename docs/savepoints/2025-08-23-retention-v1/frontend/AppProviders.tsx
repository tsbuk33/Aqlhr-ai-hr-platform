// AppProviders.tsx Component Snapshot
// Date: 2025-08-23
// Application context providers setup with dev tenant initialization

import React, { useRef, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/toaster';
import { LocaleProvider } from '@/i18n/locale';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/hooks/useAuth.tsx';
import { ensureDevTenant } from '@/lib/dev/DevModeGuard';
import { localeDriver } from '@/lib/i18n/localeDriver';

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  // Use ref to ensure QueryClient is created only once
  const queryClient = useRef(new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 1,
      },
    },
  })).current;

  // Initialize dev tenant on mount
  useEffect(() => {
    ensureDevTenant();
    // Initialize locale driver
    localeDriver.resolveLang();
  }, []);

  return (
    <LocaleProvider>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            {children}
          </AuthProvider>
          <Toaster />
        </QueryClientProvider>
      </ThemeProvider>
    </LocaleProvider>
  );
};