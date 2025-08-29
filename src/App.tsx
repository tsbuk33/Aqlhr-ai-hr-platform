import { BrowserRouter } from 'react-router-dom';
import { AppProviders } from '@/components/providers/AppProviders';
import UnifiedLanguageRouter from '@/components/routing/UnifiedLanguageRouter';
import { RootErrorBoundary } from '@/components/system/RootErrorBoundary';
import { centerStyleObject } from '@/hooks/useForceCenterStyle';

export default function App() {
  return (
    <RootErrorBoundary>
      <BrowserRouter>
        <AppProviders>
          <div style={centerStyleObject} className="force-center">
            <UnifiedLanguageRouter />
          </div>
        </AppProviders>
      </BrowserRouter>
    </RootErrorBoundary>
  );
}
