import React from 'react';
import { MobileAppShell } from '@/components/mobile/MobileAppShell';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';
import { useAuthOptional } from '@/hooks/useAuthOptional';
import { AuthRoute } from '@/components/routing/AuthRoute';

export const NativeMobileApps: React.FC = () => {
  const { lang } = useUnifiedLocale();
  const { user } = useAuthOptional();
  const isArabic = lang === 'ar';

  return (
    <AuthRoute requireAuth={true} redirectTo="/en/auth/mobile">
      <div className="min-h-screen" dir={isArabic ? 'rtl' : 'ltr'}>
        <MobileAppShell user={user} />
      </div>
    </AuthRoute>
  );
};

export default NativeMobileApps;