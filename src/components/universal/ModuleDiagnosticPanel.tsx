import React, { useState, useEffect } from 'react';
import { RefreshCw, TrendingUp, AlertTriangle, CheckCircle, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAPITranslations } from '@/hooks/useAPITranslations';
import { useLanguage } from '@/hooks/useLanguageCompat';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface DiagnosticResult {
  score: number;
  category: string;
  issues: Array<{
    severity: 'low' | 'medium' | 'high' | 'critical';
    title: string;
    description: string;
    recommendation: string;
  }>;
  recommendations: Array<{
    priority: 'low' | 'medium' | 'high';
    title: string;
    description: string;
    estimatedImpact: string;
  }>;
  lastUpdated: Date;
}

interface ModuleDiagnosticPanelProps {
  moduleKey: string;
  contextData?: any;
  autoRefresh?: boolean;
  refreshInterval?: number; // in seconds
  className?: string;
}

const ModuleDiagnosticPanel: React.FC<ModuleDiagnosticPanelProps> = ({
  moduleKey,
  contextData,
  autoRefresh = false,
  refreshInterval = 300,
  className = ""
}) => {
  const [diagnostic, setDiagnostic] = useState<DiagnosticResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useAPITranslations();
  const { language } = useLanguage();
  const { toast } = useToast();
  const isArabic = language === 'ar';

  const getLocalizedText = (key: string, fallback: string) => {
    const translation = t(key);
    return translation === key ? fallback : translation;
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'high':
        return isArabic ? 'عالي' : 'High';
      case 'medium':
        return isArabic ? 'متوسط' : 'Medium';
      case 'low':
        return isArabic ? 'منخفض' : 'Low';
      default:
        return severity;
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high':
        return isArabic ? 'عالي' : 'High';
      case 'medium':
        return isArabic ? 'متوسط' : 'Medium';
      case 'low':
        return isArabic ? 'منخفض' : 'Low';
      default:
        return priority;
    }
  };

  useEffect(() => {
    runDiagnostic();
    
    if (autoRefresh && refreshInterval > 0) {
      const interval = setInterval(runDiagnostic, refreshInterval * 1000);
      return () => clearInterval(interval);
    }
  }, [moduleKey, contextData, autoRefresh, refreshInterval]);

  const runDiagnostic = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke(`diagnose-${moduleKey.toLowerCase()}`, {
        body: {
          context: contextData,
          language,
        },
      });

      if (error) {
        // Fallback to mock data for demo
        setDiagnostic(generateMockDiagnostic());
      } else {
        setDiagnostic(data);
      }
    } catch (error) {
      console.error('Diagnostic error:', error);
      setDiagnostic(generateMockDiagnostic());
      
      toast({
        title: t('diagnostic.error'),
        description: t('diagnostic.errorMessage'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockDiagnostic = (): DiagnosticResult => {
    const scores = [75, 82, 68, 91, 59];
    const score = scores[Math.floor(Math.random() * scores.length)];
    
    return {
      score,
      category: score >= 80 ? 'excellent' : score >= 60 ? 'good' : score >= 40 ? 'needs_improvement' : 'critical',
      issues: [
        {
          severity: 'medium',
          title: getLocalizedText(
            isArabic ? 'البيانات غير مكتملة' : 'Data Incomplete',
            isArabic ? 'بيانات غير مكتملة' : 'Data Incomplete'
          ),
          description: getLocalizedText(
            isArabic ? 'توجد حقول مفقودة في البيانات المطلوبة' : 'Required data fields are missing or incomplete',
            isArabic ? 'بعض البيانات المطلوبة مفقودة أو غير مكتملة' : 'Some required data is missing or incomplete'
          ),
          recommendation: getLocalizedText(
            isArabic ? 'قم بإكمال الحقول المفقودة وتحديث البيانات' : 'Complete missing fields and update data sources',
            isArabic ? 'قم بتحديث البيانات المفقودة لتحسين دقة التحليلات' : 'Update missing data to improve analytics accuracy'
          ),
        },
        {
          severity: 'low',
          title: getLocalizedText(
            isArabic ? 'تحسين العمليات' : 'Process Optimization',
            isArabic ? 'تحسين العمليات' : 'Process Optimization'
          ),
          description: getLocalizedText(
            isArabic ? 'يمكن تحسين كفاءة العمليات الحالية' : 'Current processes can be optimized for better efficiency',
            isArabic ? 'يمكن تحسين كفاءة العمليات الحالية' : 'Current processes can be optimized for better efficiency'
          ),
          recommendation: getLocalizedText(
            isArabic ? 'راجع العمليات وحدد نقاط التحسين' : 'Review processes and identify improvement areas',
            isArabic ? 'قم بمراجعة وتحسين العمليات الحالية' : 'Review and optimize current processes'
          ),
        },
      ],
      recommendations: [
        {
          priority: 'high',
          title: getLocalizedText(
            isArabic ? 'أتمتة العمليات' : 'Automate Processes',
            isArabic ? 'أتمتة العمليات' : 'Automate Processes'
          ),
          description: getLocalizedText(
            isArabic ? 'تنفيذ حلول الأتمتة لتحسين الكفاءة' : 'Implement automation solutions to improve efficiency',
            isArabic ? 'أتمتة العمليات اليدوية لتوفير الوقت وتقليل الأخطاء' : 'Automate manual processes to save time and reduce errors'
          ),
          estimatedImpact: isArabic ? '+15% كفاءة' : '+15% efficiency',
        },
        {
          priority: 'medium',
          title: getLocalizedText(
            isArabic ? 'تحسين جودة البيانات' : 'Improve Data Quality',
            isArabic ? 'تحسين جودة البيانات' : 'Improve Data Quality'
          ),
          description: getLocalizedText(
            isArabic ? 'تنفيذ ضوابط جودة البيانات والتحقق من صحتها' : 'Implement data quality controls and validation',
            isArabic ? 'تحسين جودة البيانات ودقتها للحصول على نتائج أفضل' : 'Improve data quality and accuracy for better results'
          ),
          estimatedImpact: isArabic ? '+10% دقة' : '+10% accuracy',
        },
      ],
      lastUpdated: new Date(),
    };
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-500';
      case 'high': return 'text-orange-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  if (!diagnostic) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            {getLocalizedText(
              `${moduleKey}.diagnostic.title`,
              isArabic ? `تشخيصات ${moduleKey}` : `${moduleKey} Diagnostics`
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <Button onClick={runDiagnostic} disabled={isLoading} className="gap-2">
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              {getLocalizedText('diagnostic.runDiagnostic', isArabic ? 'تشغيل التشخيص' : 'Run Diagnostic')}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            {getLocalizedText(
              `${moduleKey}.diagnostic.title`,
              isArabic ? `تشخيصات ${moduleKey}` : `${moduleKey} Diagnostics`
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={runDiagnostic}
            disabled={isLoading}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            {getLocalizedText('diagnostic.refresh', isArabic ? 'تحديث' : 'Refresh')}
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Overall Score */}
        <div className="text-center space-y-2">
          <div className={`text-3xl font-bold ${getScoreColor(diagnostic.score)}`}>
            {diagnostic.score}%
          </div>
          <Progress value={diagnostic.score} className="w-full" />
          <Badge variant={diagnostic.category === 'excellent' ? 'default' : 'secondary'}>
            {t(`diagnostic.categories.${diagnostic.category}`)}
          </Badge>
        </div>

        <Separator />

        {/* Issues */}
        {diagnostic.issues.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              {getLocalizedText('diagnostic.issues', isArabic ? 'المشاكل' : 'Issues')} ({diagnostic.issues.length})
            </h4>
            
            <div className="space-y-2">
              {diagnostic.issues.map((issue, index) => (
                <div key={index} className="p-3 bg-muted/30 rounded-lg space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h5 className="font-medium text-sm">{issue.title}</h5>
                     <Badge variant="outline" className={getSeverityColor(issue.severity)}>
                       {getSeverityText(issue.severity)}
                     </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{issue.description}</p>
                   <div className="text-xs">
                     <span className="font-medium">{getLocalizedText('diagnostic.recommendation', isArabic ? 'التوصية' : 'Recommendation')}: </span>
                     <span className="text-muted-foreground">{issue.recommendation}</span>
                   </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {diagnostic.recommendations.length > 0 && (
          <div className="space-y-3">
             <h4 className="font-semibold flex items-center gap-2">
               <TrendingUp className="h-4 w-4" />
               {getLocalizedText('diagnostic.recommendations', isArabic ? 'التوصيات' : 'Recommendations')}
             </h4>
            
            <div className="space-y-2">
              {diagnostic.recommendations.map((rec, index) => (
                <div key={index} className="p-3 bg-muted/30 rounded-lg space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h5 className="font-medium text-sm">{rec.title}</h5>
                     <Badge variant={getPriorityVariant(rec.priority)}>
                       {getPriorityText(rec.priority)}
                     </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{rec.description}</p>
                  <div className="flex items-center gap-2 text-xs">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span className="font-medium">{getLocalizedText('diagnostic.estimatedImpact', isArabic ? 'التأثير المتوقع' : 'Estimated Impact')}: </span>
                    <span className="text-green-600 font-medium">{rec.estimatedImpact}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Last Updated */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            {t('diagnostic.lastUpdated')}: {diagnostic.lastUpdated.toLocaleString(
              isArabic ? 'ar-SA' : 'en-US'
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModuleDiagnosticPanel;