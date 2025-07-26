import React, { createContext, useContext, useState, useEffect } from 'react';

interface SimpleLanguageContextType {
  isArabic: boolean;
  toggleLanguage: () => void;
  language: 'ar' | 'en';
}

const SimpleLanguageContext = createContext<SimpleLanguageContextType | undefined>(undefined);

export const SimpleLanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Fix: Check localStorage immediately for initial state
  const [isArabic, setIsArabic] = useState(() => {
    const savedLang = localStorage.getItem('sanadhr_language');
    return savedLang ? savedLang === 'ar' : false; // Default to English if no preference
  });

  useEffect(() => {
    // Set document direction whenever language changes
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
    document.documentElement.lang = isArabic ? 'ar' : 'en';
  }, [isArabic]);

  const toggleLanguage = () => {
    const newIsArabic = !isArabic;
    setIsArabic(newIsArabic);
    localStorage.setItem('sanadhr_language', newIsArabic ? 'ar' : 'en');
  };

  return (
    <SimpleLanguageContext.Provider value={{ 
      isArabic, 
      toggleLanguage, 
      language: isArabic ? 'ar' : 'en' 
    }}>
      {children}
    </SimpleLanguageContext.Provider>
  );
};

export const useSimpleLanguage = () => {
  const context = useContext(SimpleLanguageContext);
  if (!context) {
    throw new Error('useSimpleLanguage must be used within SimpleLanguageProvider');
  }
  return context;
};
