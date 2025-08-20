import { useContext } from 'react';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';
import { t as translate, Lang } from '@/i18n/strings';

export const useTranslation = () => {
  const { isArabic, language } = useSimpleLanguage();
  
  const t = (key: keyof typeof import('@/i18n/strings').STRINGS): string => {
    return translate(key, language as Lang);
  };
  
  return {
    t,
    lang: language as Lang,
    isRTL: isArabic
  };
};