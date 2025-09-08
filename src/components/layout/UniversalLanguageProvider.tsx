import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, detectLanguage, setLanguage } from '@/utils/comprehensive-translations';

interface LanguageContextType {
  language: 'ar' | 'en';
  setLanguage: (lang: 'ar' | 'en') => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface UniversalLanguageProviderProps {
  children: ReactNode;
}

export const UniversalLanguageProvider: React.FC<UniversalLanguageProviderProps> = ({ children }) => {
  const [language, setCurrentLanguage] = useState<'ar' | 'en'>('ar');

  useEffect(() => {
    const detectedLang = detectLanguage();
    setCurrentLanguage(detectedLang);
    applyLanguageSettings(detectedLang);
  }, []);

  const applyLanguageSettings = (lang: 'ar' | 'en') => {
    // Set document direction and language
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    
    // Apply comprehensive CSS classes
    document.body.className = `${lang}-language ${lang === 'ar' ? 'rtl-layout' : 'ltr-layout'}`;
    
    // Store in localStorage
    setLanguage(lang);
  };

  const handleLanguageChange = (newLang: 'ar' | 'en') => {
    setCurrentLanguage(newLang);
    applyLanguageSettings(newLang);
    
    // Force page reload to apply all changes
    window.location.reload();
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  const contextValue: LanguageContextType = {
    language,
    setLanguage: handleLanguageChange,
    t,
    isRTL: language === 'ar'
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      <div className={`universal-language-wrapper ${language}-layout`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a UniversalLanguageProvider');
  }
  return context;
};

// HOC for automatic translation
export const withTranslation = <P extends object>(Component: React.ComponentType<P>) => {
  return (props: P) => {
    const { t, language, isRTL } = useLanguage();
    return <Component {...props} t={t} language={language} isRTL={isRTL} />;
  };
};

