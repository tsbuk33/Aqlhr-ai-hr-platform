import React, { Suspense } from 'react';
import { AppProviders } from '@/components/providers/AppProviders';
import { LayoutShell } from '@/components/layout/LayoutShell';
import { AppRoutes } from '@/components/routing/AppRoutes';
import { LoadingScreen } from '@/components/common/LoadingScreen';

const App: React.FC = () => {
  return (
    <AppProviders>
      <LayoutShell>
        <Suspense fallback={<LoadingScreen />}>
          <AppRoutes />
        </Suspense>
      </LayoutShell>
    </AppProviders>
  );
};

export default App;
