import { BrowserRouter } from 'react-router-dom';
import { AppProviders } from '@/components/providers/AppProviders';
import UnifiedLanguageRouter from '@/components/routing/UnifiedLanguageRouter';
import { RootErrorBoundary } from '@/components/system/RootErrorBoundary';
import { RTLLanguageProvider } from '@/contexts/RTLLanguageContext';
import '@/styles/arabic-rtl-professional.css';

export default function App() {
  return (
    <RootErrorBoundary>
      <RTLLanguageProvider>
        <BrowserRouter>
          <AppProviders>
            <UnifiedLanguageRouter />
          </AppProviders>
        </BrowserRouter>
      </RTLLanguageProvider>
    </RootErrorBoundary>
  );
}
