import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';

// Compatibility hook to bridge the gap between old useLanguage and new SimpleLanguageProvider
export const useLanguage = () => {
  const { isArabic, toggleLanguage, language } = useSimpleLanguage();
  
  // Simple translation function fallback
  const t = (key: string): string => {
    // For now, return the key itself as fallback
    // This prevents errors while maintaining functionality
    return key;
  };

  // Set language function
  const setLanguage = (lang: 'ar' | 'en') => {
    if ((lang === 'ar') !== isArabic) {
      toggleLanguage();
    }
  };

  return {
    language,
    setLanguage,
    toggleLanguage,
    t,
    isRTL: isArabic,
  };
};