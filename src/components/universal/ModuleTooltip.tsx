import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';
import { useAPITranslations } from '@/hooks/useAPITranslations';
import { useLanguage } from '@/hooks/useLanguageCompat';

interface ModuleTooltipProps {
  moduleKey: string;
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  showIcon?: boolean;
  className?: string;
}

const ModuleTooltip: React.FC<ModuleTooltipProps> = ({ 
  moduleKey, 
  children, 
  side = 'top',
  showIcon = false,
  className = ""
}) => {
  const { t } = useAPITranslations();
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  const tooltipText = t(`${moduleKey}.tooltip`);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`relative inline-flex items-center gap-1 ${className}`}>
            {children}
            {showIcon && (
              <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors cursor-help" />
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent 
          side={side} 
          className={`max-w-xs ${isArabic ? 'text-right' : 'text-left'}`}
        >
          <p className="text-sm">{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ModuleTooltip;