import React, { createContext, useContext, useEffect, useState } from 'react';
import { translations } from '../locales';

interface LocaleContextType {
  language: 'en' | 'ar';
  t: (key: string, params?: Record<string, string>) => string;
  isRTL: boolean;
  switchLanguage: (lang: 'en' | 'ar') => void;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

interface LocaleDriverProps {
  language: 'en' | 'ar';
  children: React.ReactNode;
}

export const LocaleDriver: React.FC<LocaleDriverProps> = ({ language, children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'ar'>(language);
  const [isRTL, setIsRTL] = useState(language === 'ar');

  // CRITICAL: Sync with parent language changes
  useEffect(() => {
    if (language !== currentLanguage) {
      console.log(`LocaleDriver: Syncing language from ${currentLanguage} to ${language}`);
      setCurrentLanguage(language);
      setIsRTL(language === 'ar');
      
      // Update document attributes
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = language;
      
      // Update body class for CSS targeting
      document.body.className = document.body.className.replace(/\b(rtl|ltr)\b/g, '');
      document.body.classList.add(language === 'ar' ? 'rtl' : 'ltr');
    }
  }, [language, currentLanguage]);

  // Translation function with fallback
  const t = (key: string, params?: Record<string, string>): string => {
    try {
      const keys = key.split('.');
      let value: any = translations[currentLanguage];
      
      for (const k of keys) {
        value = value?.[k];
      }
      
      if (typeof value !== 'string') {
        console.warn(`Translation missing for key: ${key} in language: ${currentLanguage}`);
        // Fallback to English if Arabic translation missing
        if (currentLanguage === 'ar') {
          let fallbackValue: any = translations.en;
          for (const k of keys) {
            fallbackValue = fallbackValue?.[k];
          }
          if (typeof fallbackValue === 'string') {
            return fallbackValue;
          }
        }
        return key;
      }
      
      // Replace parameters
      if (params) {
        return Object.entries(params).reduce(
          (str, [param, replacement]) => str.replace(`{{${param}}}`, replacement),
          value
        );
      }
      
      return value;
    } catch (error) {
      console.error(`Translation error for key: ${key}`, error);
      return key;
    }
  };

  const switchLanguage = (lang: 'en' | 'ar') => {
    const currentPath = window.location.pathname;
    const pathWithoutLang = currentPath.replace(/^\/(en|ar)/, '');
    const newPath = `/${lang}${pathWithoutLang}`;
    
    localStorage.setItem('aqlhr-language', lang);
    window.location.href = newPath;
  };

  const contextValue: LocaleContextType = {
    language: currentLanguage,
    t,
    isRTL,
    switchLanguage
  };

  return (
    <LocaleContext.Provider value={contextValue}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = (): LocaleContextType => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within a LocaleDriver');
  }
  return context;
};