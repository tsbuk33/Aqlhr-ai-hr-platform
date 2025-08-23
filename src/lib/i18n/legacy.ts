// Legacy compatibility layer for existing i18n hooks
import { getCurrentLang, localeDriver, Lang } from './localeDriver';

// Update useLanguageCompat to work with new system
export const useLanguageCompat = () => {
  const [currentLang, setCurrentLang] = React.useState<Lang>(getCurrentLang());

  React.useEffect(() => {
    const cleanup = localeDriver.onLangChange((lang) => {
      setCurrentLang(lang);
    });
    return cleanup;
  }, []);

  const t = (key: string): string => {
    // Simple fallback - return key as-is
    // This maintains compatibility while components migrate
    return key;
  };

  const setLanguage = (lang: 'ar' | 'en') => {
    localeDriver.setLang(lang);
  };

  return {
    language: currentLang,
    setLanguage,
    toggleLanguage: () => {
      const nextLang = currentLang === 'ar' ? 'en' : 'ar';
      localeDriver.setLang(nextLang);
    },
    t,
    isRTL: currentLang === 'ar',
  };
};

// Re-export React for the hook
import React from 'react';