import React from 'react';
import { MobileAppShell } from '@/components/mobile/MobileAppShell';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';

export const NativeMobileApps: React.FC = () => {
  const { lang } = useUnifiedLocale();
  const isArabic = lang === 'ar';

  return (
    <div className="min-h-screen" dir={isArabic ? 'rtl' : 'ltr'}>
      <MobileAppShell />
    </div>
  );
};

export default NativeMobileApps;