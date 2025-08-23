import React, { Suspense } from 'react';
import { AppProviders } from '@/components/providers/AppProviders';
import { LayoutShell } from '@/components/layout/LayoutShell';
import { LanguageRouter } from '@/components/routing/LanguageRouter';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { RootErrorBoundary } from '@/components/system/RootErrorBoundary';

const App: React.FC = () => {
  return (
    <AppProviders>
      <RootErrorBoundary>
        <LayoutShell>
          <Suspense fallback={<LoadingScreen />}>
            <LanguageRouter />
          </Suspense>
        </LayoutShell>
      </RootErrorBoundary>
    </AppProviders>
  );
};

export default App;
