import { BrowserRouter } from 'react-router-dom';
import { AppProviders } from '@/components/providers/AppProviders';
import AppRoutes from '@/components/routing/AppRoutes';
import { RootErrorBoundary } from '@/components/system/RootErrorBoundary';

export default function App() {
  return (
    <RootErrorBoundary>
      <BrowserRouter>
        <AppProviders>
          <AppRoutes />
        </AppProviders>
      </BrowserRouter>
    </RootErrorBoundary>
  );
}
