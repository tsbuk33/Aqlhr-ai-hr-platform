// Compatibility shim for useAPITranslations
import { useLocale } from '@/i18n/locale';

export const useAPITranslations = () => {
  const { t } = useLocale();
  
  const resolve = (key: string, ns?: string) => {
    if (ns) return t(ns, key);
    // Support dot-notation like "dashboard.trends.title"
    const firstDot = key.indexOf('.');
    if (firstDot > 0) {
      const namespace = key.slice(0, firstDot);
      const rest = key.slice(firstDot + 1);
      return t(namespace, rest) || rest;
    }
    return t('common', key) || key;
  };
  
  return {
    t: (key: string, namespace?: string) => resolve(key, namespace),
    translate: (key: string, namespace?: string) => resolve(key, namespace),
  };
};