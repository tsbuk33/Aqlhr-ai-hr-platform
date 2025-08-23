import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthOptional } from '@/lib/auth/useAuthOptional';
import { useTenantResolver } from '@/hooks/useTenantResolver';

export default function RequireTenant({ children }: { children: ReactNode }) {
  const loc = useLocation();
  const { user, isLoading } = useAuthOptional();
  const { tenantId, loading: tenantLoading } = useTenantResolver();
  const dev = new URLSearchParams(loc.search).get('dev') === '1';

  // DEV MODE: allow rendering even if not logged in; use demo tenant
  if (dev) return <>{children}</>;

  if (isLoading || tenantLoading) return null; // or a small spinner
  if (!user || !tenantId) {
    // send to localized login keeping current path
    const base = loc.pathname.replace(/^\/(en|ar)/, '');
    const lang = loc.pathname.split('/')[1] || 'en';
    return <Navigate to={`/${lang}/auth?next=/${lang}${base}${loc.search}`} replace />;
  }
  return <>{children}</>;
}
