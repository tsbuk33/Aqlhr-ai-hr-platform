import { BrowserRouter } from 'react-router-dom';
import { AppProviders } from '@/components/providers/AppProviders';
import UnifiedLanguageRouter from '@/components/routing/UnifiedLanguageRouter';
import { RootErrorBoundary } from '@/components/system/RootErrorBoundary';

export default function App() {
  return (
    <RootErrorBoundary>
      <BrowserRouter>
        <AppProviders>
          <UnifiedLanguageRouter />
        </AppProviders>
      </BrowserRouter>
    </RootErrorBoundary>
  );
}
