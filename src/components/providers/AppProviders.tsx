import React, { useRef } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/toaster';
import { LocaleProvider } from '@/i18n/locale';
import { SimpleLanguageProvider } from '@/contexts/SimpleLanguageContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/hooks/useAuth.tsx';

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

  return (
    <LocaleProvider>
      <SimpleLanguageProvider>
        <ThemeProvider>
          <TooltipProvider>
            <QueryClientProvider client={queryClient}>
              <BrowserRouter>
                <AuthProvider>
                  <Toaster />
                  {children}
                </AuthProvider>
              </BrowserRouter>
            </QueryClientProvider>
          </TooltipProvider>
        </ThemeProvider>
      </SimpleLanguageProvider>
    </LocaleProvider>
  );
};