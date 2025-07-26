import { useState, useEffect } from 'react';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';

interface Translations {
  [key: string]: any;
}

export const useAPITranslations = () => {
  const { language } = useSimpleLanguage();
  const [translations, setTranslations] = useState<Translations>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const response = await fetch(`/api/translations/${language}.json`);
        const data = await response.json();
        setTranslations(data);
      } catch (error) {
        console.error('Failed to load translations:', error);
        // Fallback to empty object to prevent crashes
        setTranslations({});
      } finally {
        setLoading(false);
      }
    };

    loadTranslations();
  }, [language]);

  const t = (key: string): string => {
    const keys = key.split('.');
    let value = translations;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Return the key itself as fallback to prevent showing undefined
        return key;
      }
    }

    return typeof value === 'string' ? value : key;
  };

  return { t, loading, language };
};