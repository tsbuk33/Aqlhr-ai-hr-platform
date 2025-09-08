import { BrowserRouter } from 'react-router-dom';
import { AppProviders } from '@/components/providers/AppProviders';
import UnifiedLanguageRouter from '@/components/routing/UnifiedLanguageRouter';
import { RootErrorBoundary } from '@/components/system/RootErrorBoundary';
import { RTLLanguageProvider } from '@/contexts/RTLLanguageContext';
import { LanguageConsistencyProvider } from '@/components/layout/LanguageConsistencyProvider';
import LanguageEnforcer from '@/components/layout/LanguageEnforcer';
import '@/styles/arabic-rtl-professional.css';
import '@/styles/language-consistency.css';

export default function App() {
  return (
    <RootErrorBoundary>
      <RTLLanguageProvider>
        <LanguageConsistencyProvider>
          <BrowserRouter>
            <AppProviders>
              <LanguageEnforcer />
              <UnifiedLanguageRouter />
            </AppProviders>
          </BrowserRouter>
        </LanguageConsistencyProvider>
      </RTLLanguageProvider>
    </RootErrorBoundary>
  );
}
