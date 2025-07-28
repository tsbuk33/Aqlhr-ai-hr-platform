import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { useAPITranslations } from '@/hooks/useAPITranslations';

interface EsgCardProps {
  icon: LucideIcon;
  titleKey: string;
  descKey: string;
  bulletsKey: string;
  color?: string;
}

const EsgCard: React.FC<EsgCardProps> = ({ 
  icon: Icon, 
  titleKey, 
  descKey,
  bulletsKey, 
  color = 'text-primary' 
}) => {
  const { t } = useAPITranslations();
  
  // Get bullets array from translations
  const bulletsData = t(bulletsKey);
  const bullets = Array.isArray(bulletsData) ? bulletsData : [];

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-300 bg-card dark:bg-card border border-border">
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-3">
          <div className="p-3 rounded-full bg-background border border-border">
            <Icon className={`h-8 w-8 ${color}`} />
          </div>
        </div>
        <CardTitle className="text-xl font-bold text-foreground mb-2">
          {t(titleKey)}
        </CardTitle>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {t(descKey)}
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        <ul className="space-y-3 text-center">
          {bullets.map((bullet, index) => (
            <li 
              key={index} 
              className="flex items-center justify-center text-muted-foreground"
            >
              <span className={`w-2 h-2 rounded-full ${color.replace('text-', 'bg-')} mr-3 flex-shrink-0`} />
              <span className="text-sm leading-relaxed">{bullet}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default EsgCard;