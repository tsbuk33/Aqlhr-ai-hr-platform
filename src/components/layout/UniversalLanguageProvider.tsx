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
    // Complete translation system with all LEO keys
    const translations: Record<string, Record<string, string>> = {
      ar: {
        // LEO Module Translations
        'leo.title': 'ليو - تحسين تجربة التعلم',
        'leo.subtitle': 'التعلم المصغر المدعوم بالذكاء الاصطناعي، المسارات التكيفية وتطوير المهارات الشخصية',
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
        
        // LEO Metrics
        'leo.engagement_score': 'نقاط المشاركة',
        'leo.learning_hours': 'ساعات التعلم',
        'leo.day_streak': 'سلسلة الأيام',
        'leo.skills_acquired': 'المهارات المكتسبة',
        'leo.modules_completed': 'الوحدات المكتملة',
        
        // LEO Demo
        'leo.demo_title': 'بيانات العرض التوضيحي النشطة',
        'leo.demo_description': 'عرض 5 وحدات تدريبية، 5 سجلات تعلم، و 6 ملفات شخصية للموظفين مع تتبع التقدم في الوقت الفعلي',
        'leo.data_loaded': 'تم تحميل البيانات',
        
        // LEO Modules
        'leo.active_modules': 'وحدات التدريب النشطة (5 إجمالي)',
        'leo.leadership_excellence': 'التميز في القيادة',
        'leo.digital_transformation': 'التحول الرقمي',
        'leo.safety_protocols': 'بروتوكولات السلامة',
        'leo.customer_service': 'التميز في خدمة العملاء',
        'leo.cultural_awareness': 'الوعي الثقافي',
        'leo.required': 'مطلوب',
        'leo.active': 'نشط',
        'leo.continue': 'متابعة',
        
        // Auth translations
        'auth.title': 'أقل للموارد البشرية',
        'auth.welcome': 'أهلاً بعودتك',
        'auth.signInSubtext': 'سجل الدخول للمتابعة إلى لوحة التحكم',
        'auth.signUpSubtext': 'سجل للوصول إلى منصة الموارد البشرية',
        'auth.signIn': 'تسجيل الدخول',
        'auth.signUp': 'إنشاء حساب',
        'auth.email': 'عنوان البريد الإلكتروني',
        'auth.password': 'كلمة المرور',
        'auth.confirmPassword': 'تأكيد كلمة المرور',
        'auth.forgotPassword': 'نسيت كلمة المرور؟',
        'auth.resetPassword': 'إعادة تعيين كلمة المرور',
        'auth.sendResetLink': 'إرسال رابط إعادة التعيين',
        'auth.backToSignIn': 'العودة لتسجيل الدخول',
        'auth.resetEmailSent': 'تم إرسال بريد إعادة تعيين كلمة المرور! تحقق من صندوق الوارد.',
        'auth.createAccount': 'إنشاء حساب',
        'auth.alreadyHaveAccount': 'لديك حساب بالفعل؟',
        'auth.dontHaveAccount': 'ليس لديك حساب؟',
        'auth.switchToSignUp': 'سجل هنا',
        'auth.switchToSignIn': 'سجل الدخول هنا',
        
        // Common
        'common.loading': 'جاري التحميل...',
        'common.next': 'التالي',
        'common.continue': 'متابعة',
        'common.start': 'ابدأ',
        'common.view': 'عرض',
        'common.edit': 'تحرير',
        'common.save': 'حفظ',
        'common.cancel': 'إلغاء',
        
        // GEO Module
        'geo.title': 'جيو - تحسين المشاركة التوليدية',
        'geo.subtitle': 'منصة المشاركة المدعومة بالذكاء الاصطناعي لتحسين تجربة الموظفين',
        
        // Analytics
        'analytics.title': 'التحليلات',
        'analytics.description': 'تحليلات شاملة ورؤى للأداء',
        
        // Recruitment
        'recruitment.title': 'التوظيف والإدماج',
        'recruitment.dashboard': 'لوحة تحكم التوظيف'
      },
      en: {
        // LEO Module Translations
        'leo.title': 'ليو - تحسين تجربة التعلم',
        'leo.subtitle': 'AI-Powered Micro-Learning, Adaptive Pathways & Personalized Skill Development',
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
        
        // LEO Metrics
        'leo.engagement_score': 'Engagement Score',
        'leo.learning_hours': 'Learning Hours',
        'leo.day_streak': 'Day Streak',
        'leo.skills_acquired': 'Skills Acquired',
        'leo.modules_completed': 'Modules Completed',
        
        // LEO Demo
        'leo.demo_title': 'Live Demo Data Active',
        'leo.demo_description': 'Viewing 5 training modules, 5 learning records, and 6 employee profiles with real-time progress tracking',
        'leo.data_loaded': 'Data Loaded',
        
        // LEO Modules
        'leo.active_modules': 'Active Training Modules (5 total)',
        'leo.leadership_excellence': 'Leadership Excellence',
        'leo.digital_transformation': 'Digital Transformation',
        'leo.safety_protocols': 'Safety Protocols',
        'leo.customer_service': 'Customer Service Excellence',
        'leo.cultural_awareness': 'Cultural Awareness',
        'leo.required': 'Required',
        'leo.active': 'active',
        'leo.continue': 'Continue',
        
        // Auth translations
        'auth.title': 'AqlHR',
        'auth.welcome': 'Welcome Back',
        'auth.signInSubtext': 'Sign in to continue to your dashboard',
        'auth.signUpSubtext': 'Sign up to access your HR platform',
        'auth.signIn': 'Sign In',
        'auth.signUp': 'Sign Up',
        'auth.email': 'Email address',
        'auth.password': 'Password',
        'auth.confirmPassword': 'Confirm Password',
        'auth.forgotPassword': 'Forgot Password?',
        'auth.resetPassword': 'Reset Password',
        'auth.sendResetLink': 'Send Reset Link',
        'auth.backToSignIn': 'Back to Sign In',
        'auth.resetEmailSent': 'Password reset email sent! Check your inbox.',
        'auth.createAccount': 'Create Account',
        'auth.alreadyHaveAccount': 'Already have an account?',
        'auth.dontHaveAccount': 'Don\'t have an account?',
        'auth.switchToSignUp': 'Sign up here',
        'auth.switchToSignIn': 'Sign in here',
        
        // Common
        'common.loading': 'Loading...',
        'common.next': 'Next',
        'common.continue': 'Continue',
        'common.start': 'Start',
        'common.view': 'View',
        'common.edit': 'Edit',
        'common.save': 'Save',
        'common.cancel': 'Cancel',
        
        // GEO Module
        'geo.title': 'جيو - تحسين المشاركة التوليدية',
        'geo.subtitle': 'AI-Powered Engagement Platform for Enhanced Employee Experience',
        
        // Analytics
        'analytics.title': 'Analytics',
        'analytics.description': 'Comprehensive analytics and performance insights',
        
        // Recruitment
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

