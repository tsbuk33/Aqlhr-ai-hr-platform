import { useState } from 'react';

export type Language = 'en' | 'ar';

export const useLanguage = () => {
  const [language, setLanguage] = useState<Language>('en');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ar' : 'en');
  };

  const t = (english: string, arabic: string): string => {
    return language === 'ar' ? arabic : english;
  };

  return {
    language,
    toggleLanguage,
    t
  };
};