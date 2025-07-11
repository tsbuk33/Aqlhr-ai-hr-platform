import React from 'react';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';

const LanguageToggle: React.FC = () => {
  const { isArabic, toggleLanguage } = useSimpleLanguage();
  const language = isArabic ? 'ar' : 'en';
  const isRTL = isArabic;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-2 h-8 px-3"
    >
      <Globe className="h-4 w-4" />
      <span className="text-sm font-medium">
        {language === 'ar' ? 'العربية' : 'English'}
      </span>
      <span className="text-xs text-muted-foreground">
        {language === 'ar' ? '(ع)' : '(EN)'}
      </span>
    </Button>
  );
};

export default LanguageToggle;