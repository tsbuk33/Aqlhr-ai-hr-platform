import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getLang } from '@/lib/i18n/getLang';

// Simple language detection and setting functions
const detectLanguage = (): 'ar' | 'en' => {
  const saved = localStorage.getItem('aqlhr.locale');
  return (saved === 'ar' || saved === 'en') ? saved : 'en';
};

const setLanguage = (lang: 'ar' | 'en') => {
  localStorage.setItem('aqlhr.locale', lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
};

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
    // Simple translation fallback - in production this would connect to i18n system
    const translations: Record<string, Record<string, string>> = {
      ar: {
        'leo.title': 'ليو - تحسين تجربة التعلم',
        'leo.dashboard': 'لوحة التحكم',
        'leo.my_learning': 'تعلمي',
        'leo.skills_progress': 'تقدم المهارات',
        'leo.learning_paths': 'مسارات التعلم',
        'leo.smart_ai': 'الذكاء الذكي',
        'leo.analytics': 'التحليلات',
        'leo.overview': 'نظرة عامة',
        'leo.setting_up': 'جاري الإعداد...',
        'leo.upgrade_message': 'يتطلب هذا المحتوى ترقية الباقة للوصول إلى ميزات تحسين تجربة التعلم المتقدمة.',
        'leo.description': 'تحسين تجربة التعلم باستخدام الذكاء الاصطناعي والتحليلات المتقدمة',
        'recruitment.title': 'التوظيف والإدماج',
        'recruitment.dashboard': 'لوحة تحكم التوظيف'
      },
      en: {
        'leo.title': 'LEO - Learning Experience Optimization',
        'leo.dashboard': 'Dashboard',
        'leo.my_learning': 'My Learning',
        'leo.skills_progress': 'Skills Progress',
        'leo.learning_paths': 'Learning Paths',
        'leo.smart_ai': 'Smart AI',
        'leo.analytics': 'Analytics',
        'leo.overview': 'Overview',
        'leo.setting_up': 'Setting up...',
        'leo.upgrade_message': 'This content requires a plan upgrade to access advanced learning experience optimization features.',
        'leo.description': 'Optimize learning experience using AI and advanced analytics',
        'recruitment.title': 'Recruitment & Onboarding',
        'recruitment.dashboard': 'Recruitment Dashboard'
      }
    };
    
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

