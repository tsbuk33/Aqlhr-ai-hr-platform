import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import enTranslations from './locales/en.json';
import arTranslations from './locales/ar.json';

// Define resources with proper typing
const resources = {
  en: {
    translation: enTranslations
  },
  ar: {
    translation: arTranslations
  }
} as const;

// Initialize i18next
i18n
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    // Namespace configuration
    defaultNS: 'translation',
    ns: ['translation'],

    // Key separator
    keySeparator: '.',
    nsSeparator: ':',

    // React options
    react: {
      useSuspense: false,
    },

    // Ensure all keys are loaded
    load: 'languageOnly',
    preload: ['en', 'ar'],
    
    // Missing key handler
    missingKeyHandler: (lng, ns, key, fallbackValue) => {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Missing translation key: ${key} for language: ${lng}`);
      }
      return fallbackValue || key;
    }
  });

// Function to change language and update HTML direction
export const changeLanguage = (lng: string) => {
  i18n.changeLanguage(lng);
  
  // Update HTML direction
  const htmlElement = document.documentElement;
  if (lng === 'ar') {
    htmlElement.setAttribute('dir', 'rtl');
    htmlElement.setAttribute('lang', 'ar');
  } else {
    htmlElement.setAttribute('dir', 'ltr');
    htmlElement.setAttribute('lang', 'en');
  }
  
  // Store language preference
  localStorage.setItem('i18nextLng', lng);
};

// Function to get current direction
export const getCurrentDirection = () => {
  return i18n.language === 'ar' ? 'rtl' : 'ltr';
};

// Function to check if current language is RTL
export const isRTL = () => {
  return i18n.language === 'ar';
};

// Key validation function for development
export const validateTranslationKey = (key: string, namespace?: string) => {
  const fullKey = namespace ? `${namespace}.${key}` : key;
  const exists = i18n.exists(fullKey);
  
  if (!exists && process.env.NODE_ENV === 'development') {
    console.error(`Translation key not found: ${fullKey}`);
    throw new Error(`Missing translation key: ${fullKey}`);
  }
  
  return exists;
};

// Export i18n instance
export default i18n;

