import { BrowserRouter } from 'react-router-dom';
import { AppProviders } from '@/components/providers/AppProviders';
import UnifiedLanguageRouter from '@/components/routing/UnifiedLanguageRouter';
import { RootErrorBoundary } from '@/components/system/RootErrorBoundary';
import { UniversalLanguageProvider } from '@/components/layout/UniversalLanguageProvider';
import '@/styles/universal-language-support.css';

export default function App() {
  return (
    <RootErrorBoundary>
      <UniversalLanguageProvider>
        <BrowserRouter>
          <AppProviders>
            <UnifiedLanguageRouter />
          </AppProviders>
        </BrowserRouter>
      </UniversalLanguageProvider>
    </RootErrorBoundary>
  );
}
