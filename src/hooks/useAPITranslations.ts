// Compatibility shim for useAPITranslations
import { useLocale } from '@/i18n/locale';

export const useAPITranslations = () => {
  const { t } = useLocale();
  
  // Return a compatible interface for legacy components
  return {
    t: (key: string, namespace?: string) => {
      // If namespace provided, use it; otherwise try 'common' fallback
      if (namespace) return t(namespace, key);
      return t('common', key) || key;
    },
    // Additional compatibility methods if needed
    translate: (key: string, namespace = 'common') => t(namespace, key) || key,
  };
};