import React from 'react';
import { useLanguage } from "@/hooks/useLanguageCompat";
import { useLocalization } from '@/hooks/useLocalization';
import { ScreenReaderText } from './ScreenReaderText';

interface AccessibleMetricsProps {
  title: string;
  value: number;
  trend?: {
    value: number;
    isPositive: boolean;
    period?: string;
  };
  type?: 'currency' | 'percentage' | 'number';
  unit?: string;
  description?: string;
}

export const AccessibleMetrics: React.FC<AccessibleMetricsProps> = ({
  title,
  value,
  trend,
  type = 'number',
  unit,
  description
}) => {
  const { t, language } = useLanguage();
  const { currency, percentage, number } = useLocalization();

  const formatValue = (val: number): string => {
    switch (type) {
      case 'currency':
        return currency(val);
      case 'percentage':
        return percentage(val);
      default:
        return number(val);
    }
  };

  const getAriaLabel = (): string => {
    const formattedValue = formatValue(value);
    const unitText = unit ? ` ${unit}` : '';
    const trendText = trend 
      ? `, ${trend.isPositive ? t('common.increased') : t('common.decreased')} by ${formatValue(trend.value)}${trend.period ? ` ${trend.period}` : ''}`
      : '';
    
    return `${title}: ${formattedValue}${unitText}${trendText}`;
  };

  return (
    <div 
      role="region" 
      aria-label={getAriaLabel()}
      className="metric-container"
    >
      <ScreenReaderText>
        {getAriaLabel()}
        {description && `. ${description}`}
      </ScreenReaderText>
      
      {/* Visual content is handled by the parent component */}
      <div aria-hidden="true">
        {/* Content will be rendered by parent components like MetricCard */}
      </div>
    </div>
  );
};