import { useState, useEffect, useCallback } from 'react';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';
import yaml from 'js-yaml';

interface TranslationEntry {
  en: string;
  ar: string;
  context?: string;
  usage?: string;
}

interface TermBank {
  [category: string]: {
    [term: string]: TranslationEntry;
  };
}

/**
 * Governed Translations Hook
 * Enforces localization governance and ensures all translations come from approved term bank
 */
export const useGovernedTranslations = () => {
  const { language } = useSimpleLanguage();
  const [termBank, setTermBank] = useState<TermBank>({});
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);

  // Load term bank from YAML
  useEffect(() => {
    const loadTermBank = async () => {
      try {
        const response = await fetch('/localization/terms.yaml');
        const yamlContent = await response.text();
        const parsedTerms = yaml.load(yamlContent) as TermBank;
        setTermBank(parsedTerms);
        setErrors([]);
      } catch (error) {
        const errorMsg = `Failed to load term bank: ${error instanceof Error ? error.message : 'Unknown error'}`;
        setErrors([errorMsg]);
        console.error(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    loadTermBank();
  }, []);

  // Get translation with governance validation
  const t = useCallback((key: string): string => {
    if (loading) return key;

    // Parse key to find category and term
    const keyParts = key.split('.');
    if (keyParts.length < 2) {
      const error = `Invalid translation key format: ${key}. Use category.term format.`;
      setErrors(prev => [...prev, error]);
      return key;
    }

    const [category, ...termParts] = keyParts;
    const term = termParts.join('.');

    // Check if category exists
    if (!termBank[category]) {
      const error = `Translation category '${category}' not found in term bank`;
      setErrors(prev => [...prev, error]);
      return key;
    }

    // Check if term exists in category
    if (!termBank[category][term]) {
      const error = `Translation term '${term}' not found in category '${category}'`;
      setErrors(prev => [...prev, error]);
      return key;
    }

    const entry = termBank[category][term];
    const translation = language === 'ar' ? entry.ar : entry.en;

    if (!translation) {
      const error = `No ${language} translation found for ${key}`;
      setErrors(prev => [...prev, error]);
      return key;
    }

    return translation;
  }, [termBank, language, loading]);

  // Get all available keys for a category
  const getKeysForCategory = useCallback((category: string): string[] => {
    if (!termBank[category]) return [];
    return Object.keys(termBank[category]).map(term => `${category}.${term}`);
  }, [termBank]);

  // Validate translation key exists
  const validateKey = useCallback((key: string): boolean => {
    const keyParts = key.split('.');
    if (keyParts.length < 2) return false;

    const [category, ...termParts] = keyParts;
    const term = termParts.join('.');

    return !!(termBank[category] && termBank[category][term]);
  }, [termBank]);

  // Get translation metadata
  const getMetadata = useCallback((key: string): TranslationEntry | null => {
    const keyParts = key.split('.');
    if (keyParts.length < 2) return null;

    const [category, ...termParts] = keyParts;
    const term = termParts.join('.');

    if (!termBank[category] || !termBank[category][term]) return null;

    return termBank[category][term];
  }, [termBank]);

  // Get all categories
  const getCategories = useCallback((): string[] => {
    return Object.keys(termBank);
  }, [termBank]);

  // Format currency according to locale
  const formatCurrency = useCallback((amount: number, currency: 'SAR' | 'USD' = 'SAR'): string => {
    if (language === 'ar') {
      return currency === 'SAR' ? `${amount.toLocaleString('ar-SA')} ريال` : `${amount.toLocaleString('ar-SA')} دولار`;
    } else {
      return currency === 'SAR' ? `SAR ${amount.toLocaleString('en-US')}` : `USD ${amount.toLocaleString('en-US')}`;
    }
  }, [language]);

  // Format date according to locale
  const formatDate = useCallback((date: Date): string => {
    if (language === 'ar') {
      return date.toLocaleDateString('ar-SA-u-ca-islamic');
    } else {
      return date.toLocaleDateString('en-US');
    }
  }, [language]);

  // Format number according to locale
  const formatNumber = useCallback((number: number): string => {
    if (language === 'ar') {
      return number.toLocaleString('ar-SA');
    } else {
      return number.toLocaleString('en-US');
    }
  }, [language]);

  // Get text direction
  const getDirection = useCallback((): 'ltr' | 'rtl' => {
    return language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  // Clear errors
  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  return {
    // Core translation function
    t,
    
    // Validation functions
    validateKey,
    getMetadata,
    
    // Discovery functions
    getCategories,
    getKeysForCategory,
    
    // Formatting functions
    formatCurrency,
    formatDate,
    formatNumber,
    
    // Utility functions
    getDirection,
    
    // State
    loading,
    errors,
    clearErrors,
    
    // Language info
    language,
    isRTL: language === 'ar',
  };
};