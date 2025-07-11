import React from 'react';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';

const SimpleLanguageToggle: React.FC = () => {
  const { isArabic, toggleLanguage } = useSimpleLanguage();

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleLanguage}
        className="flex items-center gap-2 h-8 px-3"
      >
        <Globe className="h-4 w-4" />
        {isArabic ? (
          <>
            <span className="text-sm font-medium">العربية</span>
            <span className="text-xs text-muted-foreground">(ع)</span>
          </>
        ) : (
          <>
            <span className="text-sm font-medium">English</span>
            <span className="text-xs text-muted-foreground">(EN)</span>
          </>
        )}
      </Button>
    </div>
  );
};

export default SimpleLanguageToggle;