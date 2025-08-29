import { BrowserRouter, useLocation } from 'react-router-dom';
import { AppProviders } from '@/components/providers/AppProviders';
import UnifiedLanguageRouter from '@/components/routing/UnifiedLanguageRouter';
import { RootErrorBoundary } from '@/components/system/RootErrorBoundary';
import { centerStyleObject } from '@/hooks/useForceCenterStyle';

function AppContent() {
  const location = useLocation();
  const isAuthRoute = location.pathname.includes('/auth');
  
  if (isAuthRoute) {
    return <UnifiedLanguageRouter />;
  }
  
  return (
    <div style={centerStyleObject} className="force-center">
      <UnifiedLanguageRouter />
    </div>
  );
}

export default function App() {
  return (
    <RootErrorBoundary>
      <BrowserRouter>
        <AppProviders>
          <AppContent />
        </AppProviders>
      </BrowserRouter>
    </RootErrorBoundary>
  );
}
