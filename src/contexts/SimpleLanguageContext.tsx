// Compatibility shim that bridges legacy SimpleLanguageContext to new LocaleProvider
import React from 'react';
import { useLocale, type Locale } from '@/i18n/locale';

type LegacyCtx = {
  isArabic: boolean;
  locale: Locale;
  setLocale: (l: Locale) => void;
  toggleLanguage: () => void;
  language: 'en' | 'ar'; // alias for locale
};

export const SimpleLanguageContext = React.createContext<LegacyCtx>({
  isArabic: false,
  locale: 'en',
  language: 'en',
  setLocale: () => {},
  toggleLanguage: () => {},
});

// Provider that bridges old context to the new LocaleProvider
export const SimpleLanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { locale, setLocale } = useLocale();
  const value: LegacyCtx = {
    isArabic: locale === 'ar',
    locale,
    language: locale, // alias
    setLocale,
    toggleLanguage: () => setLocale(locale === 'ar' ? 'en' : 'ar'),
  };
  return <SimpleLanguageContext.Provider value={value}>{children}</SimpleLanguageContext.Provider>;
};

// Legacy hooks used around the app
export const useSimpleLanguage = () => React.useContext(SimpleLanguageContext);
export const useLanguage = useSimpleLanguage; // alias
export default useSimpleLanguage;

// Helper for legacy code to access new translation system
export const useLegacyT = () => {
  const { t } = useLocale();
  return t;
};