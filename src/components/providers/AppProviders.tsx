import React, { useRef, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/toaster';
import { UnifiedLocaleProvider } from '@/lib/i18n/unifiedLocaleSystem';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/hooks/useAuth.tsx';
import { ensureDevTenant } from '@/lib/dev/DevModeGuard';

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
  }, []);

  return (
    <UnifiedLocaleProvider>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            {children}
          </AuthProvider>
          <Toaster />
        </QueryClientProvider>
      </ThemeProvider>
    </UnifiedLocaleProvider>
  );
};