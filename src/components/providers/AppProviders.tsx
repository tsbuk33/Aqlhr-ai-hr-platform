import React, { useRef } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/toaster';
import { SimpleLanguageProvider } from '@/contexts/SimpleLanguageContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/hooks/useAuth';

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
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <SimpleLanguageProvider>
          <AuthProvider>
            <TooltipProvider>
              <BrowserRouter>
                <SidebarProvider>
                  <Toaster />
                  {children}
                </SidebarProvider>
              </BrowserRouter>
            </TooltipProvider>
          </AuthProvider>
        </SimpleLanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};