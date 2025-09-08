import { BrowserRouter } from 'react-router-dom';
import { AppProviders } from '@/components/providers/AppProviders';
import UnifiedLanguageRouter from '@/components/routing/UnifiedLanguageRouter';
import { RootErrorBoundary } from '@/components/system/RootErrorBoundary';
import { ComprehensiveLanguageProvider } from '@/components/layout/ComprehensiveLanguageProvider';
import '@/styles/comprehensive-arabic-rtl.css';

export default function App() {
  return (
    <RootErrorBoundary>
      <ComprehensiveLanguageProvider>
        <BrowserRouter>
          <AppProviders>
            <UnifiedLanguageRouter />
          </AppProviders>
        </BrowserRouter>
      </ComprehensiveLanguageProvider>
    </RootErrorBoundary>
  );
}
