import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Activity,
  Target
} from 'lucide-react';
import { useLocale } from '@/i18n/locale';
import { Score, formatRiskScore, getRiskColor, getRiskLevel } from '../api/analyzePolicy';

interface RiskScoreCardProps {
  title: string;
  score: Score;
  subtitle?: string;
  variant?: 'default' | 'overall' | 'compact';
  className?: string;
}

const RiskScoreCard: React.FC<RiskScoreCardProps> = ({
  title,
  score,
  subtitle,
  variant = 'default',
  className = ''
}) => {
  const { locale, t } = useLocale();
  const isArabic = locale === 'ar';
  
  // Format score for display
  const displayScore = formatRiskScore(score, locale);
  const riskLevel = getRiskLevel(score.value, isArabic);
  const colorClasses = getRiskColor(score.value);
  
  // Get appropriate icon based on risk level
  const getIcon = () => {
    if (score.value <= 0.3) return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (score.value <= 0.6) return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
    return <Shield className="h-5 w-5 text-red-600" />;
  };
  
  // Format confidence percentage
  const confidenceText = React.useMemo(() => {
    const percent = Math.round(score.confidence * 100);
    if (isArabic) {
      const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
      return percent.toString().replace(/[0-9]/g, digit => arabicNumerals[parseInt(digit)]) + '٪';
    }
    return `${percent}%`;
  }, [score.confidence, isArabic]);

  if (variant === 'compact') {
    return (
      <div className={`p-3 rounded-lg border ${colorClasses} ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getIcon()}
            <span className="font-medium text-sm">{title}</span>
          </div>
          <div className="text-right">
            <div className="font-bold text-lg">{displayScore}</div>
            <div className="text-xs opacity-75">{riskLevel}</div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'overall') {
    return (
      <Card className={`${className} border-2`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-6 w-6 text-primary" />
              <CardTitle className="text-lg">{title}</CardTitle>
            </div>
            <Badge variant="secondary" className="text-xs">
              {isArabic ? 'إجمالي' : 'Overall'}
            </Badge>
          </div>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${colorClasses} border-4`}>
                <span className="text-2xl font-bold">{displayScore}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {isArabic ? 'مستوى المخاطر:' : 'Risk Level:'}
                </span>
                <Badge variant="outline" className={colorClasses}>
                  {riskLevel}
                </Badge>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {isArabic ? 'الثقة:' : 'Confidence:'}
                  </span>
                  <span className="font-medium">{confidenceText}</span>
                </div>
                <Progress 
                  value={score.confidence * 100} 
                  className="h-2"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            {getIcon()}
            {title}
          </CardTitle>
          <Badge variant="outline" className={`${colorClasses} text-xs`}>
            {riskLevel}
          </Badge>
        </div>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">{displayScore}</span>
            <div className="text-right text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Activity className="h-3 w-3" />
                {confidenceText}
              </div>
            </div>
          </div>
          
          <Progress 
            value={score.value * 100} 
            className="h-2"
          />
          
          <div className="text-xs text-muted-foreground text-center">
            {score.value <= 0.3 ? (
              isArabic ? 'مخاطر منخفضة - مقبول' : 'Low Risk - Acceptable'
            ) : score.value <= 0.6 ? (
              isArabic ? 'مخاطر متوسطة - يحتاج مراجعة' : 'Medium Risk - Needs Review'
            ) : (
              isArabic ? 'مخاطر عالية - يتطلب إجراء فوري' : 'High Risk - Immediate Action Required'
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RiskScoreCard;