import React from 'react';
import { MobileAppShell } from '@/components/mobile/MobileAppShell';
import { useLanguage } from '@/hooks/useLanguage';

export const NativeMobileApps: React.FC = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  return (
    <div className="min-h-screen" dir={isArabic ? 'rtl' : 'ltr'}>
      <MobileAppShell />
    </div>
  );
};

export default NativeMobileApps;