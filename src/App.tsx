import React, { Suspense } from 'react';
import { AppProviders } from '@/components/providers/AppProviders';
import { LayoutShell } from '@/components/layout/LayoutShell';
import { AppRoutes } from '@/components/routing/AppRoutes';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { RootErrorBoundary } from '@/components/system/RootErrorBoundary';

const App: React.FC = () => {
  return (
    <AppProviders>
      <RootErrorBoundary>
        <LayoutShell>
          <Suspense fallback={<LoadingScreen />}>
            <AppRoutes />
          </Suspense>
        </LayoutShell>
      </RootErrorBoundary>
    </AppProviders>
  );
};

export default App;
