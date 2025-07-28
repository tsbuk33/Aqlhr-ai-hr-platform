import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useLanguage } from '@/hooks/useLanguageCompat';
import { useAPITranslations } from '@/hooks/useAPITranslations';

interface HowToUsePanelProps {
  moduleKey: string;
  className?: string;
}

const HowToUsePanel: React.FC<HowToUsePanelProps> = ({ 
  moduleKey, 
  className = "" 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useLanguage();
  const { t } = useAPITranslations();
  const isArabic = language === 'ar';

  const stepsKey = `${moduleKey}.howToUse.steps`;
  const steps = t(stepsKey);
  const stepsArray = Array.isArray(steps) ? steps : [];

  return (
    <Card className={`w-full bg-muted/30 border-primary/20 ${className}`}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <CardTitle className="flex items-center justify-between text-lg">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-primary" />
                <span>{t(`${moduleKey}.howToUse.title`)}</span>
              </div>
              <Button variant="ghost" size="sm" className="p-1">
                {isOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className={`space-y-4 ${isArabic ? 'text-right' : 'text-left'}`}>
              <p className="text-muted-foreground">
                {t(`${moduleKey}.howToUse.description`)}
              </p>
              
              {stepsArray.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">
                    {t('common.steps')}:
                  </h4>
                  <ol className={`space-y-2 ${isArabic ? 'list-decimal list-inside' : 'list-decimal list-inside'}`}>
                    {stepsArray.map((step: string, index: number) => (
                      <li 
                        key={index}
                        className="text-sm text-muted-foreground leading-relaxed"
                      >
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
              
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline">
                  {t('common.watchVideo')}
                </Button>
                <Button size="sm" variant="outline">
                  {t('common.downloadGuide')}
                </Button>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default HowToUsePanel;