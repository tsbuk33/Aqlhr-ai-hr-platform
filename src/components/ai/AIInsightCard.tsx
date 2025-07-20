import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/hooks/useLanguageCompat';
import { useAICore } from '@/hooks/useAICore';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Zap,
  Target,
  Users,
  DollarSign,
  Calendar,
  ArrowRight
} from 'lucide-react';

interface AIInsightCardProps {
  moduleContext: string;
  companyId?: string;
  className?: string;
}

const AIInsightCard: React.FC<AIInsightCardProps> = ({
  moduleContext,
  companyId = 'demo-company',
  className = ''
}) => {
  const { language, isRTL } = useLanguage();
  const { getWorkforceAnalytics, loading } = useAICore();
  const [insights, setInsights] = useState<any[]>([]);

  const isArabic = language === 'ar';

  useEffect(() => {
    generateInsights();
  }, [moduleContext, companyId]);

  const generateInsights = async () => {
    try {
      // Generate contextual insights based on module
      const contextualInsights = getContextualInsights();
      setInsights(contextualInsights);
    } catch (error) {
      console.error('Error generating insights:', error);
    }
  };

  const getContextualInsights = () => {
    const insightTemplates: Record<string, any[]> = {
      'executive': [
        {
          id: 1,
          type: 'prediction',
          title: isArabic ? 'توقع الأداء التنفيذي' : 'Executive Performance Forecast',
          value: '92%',
          trend: 'up',
          confidence: 0.94,
          description: isArabic 
            ? 'توقع تحسن الأداء التنفيذي بنسبة 8% خلال الربع القادم'
            : 'Executive performance expected to improve by 8% next quarter',
          action: isArabic ? 'عرض التفاصيل' : 'View Details',
          priority: 'high',
          impact: {
            metric: isArabic ? 'الكفاءة التشغيلية' : 'Operational Efficiency',
            value: 8,
            timeline: isArabic ? '3 أشهر' : '3 months'
          }
        },
        {
          id: 2,
          type: 'risk',
          title: isArabic ? 'تحليل المخاطر الاستراتيجية' : 'Strategic Risk Analysis',
          value: 'متوسط',
          trend: 'stable',
          confidence: 0.87,
          description: isArabic 
            ? 'مخاطر متوسطة في التوسع الجغرافي، يوصى بتدابير وقائية'
            : 'Medium risk in geographical expansion, preventive measures recommended',
          action: isArabic ? 'خطة التخفيف' : 'Mitigation Plan',
          priority: 'medium'
        }
      ],
      'workforce_planning': [
        {
          id: 3,
          type: 'demand',
          title: isArabic ? 'توقع الطلب على العمالة' : 'Workforce Demand Forecast',
          value: '+15',
          trend: 'up',
          confidence: 0.91,
          description: isArabic 
            ? 'الحاجة لتوظيف 15 موظف جديد خلال 6 أشهر'
            : 'Need to hire 15 new employees within 6 months',
          action: isArabic ? 'بدء التوظيف' : 'Start Recruitment',
          priority: 'high',
          impact: {
            metric: isArabic ? 'الإنتاجية' : 'Productivity',
            value: 20,
            timeline: isArabic ? '6 أشهر' : '6 months'
          }
        },
        {
          id: 4,
          type: 'skills',
          title: isArabic ? 'فجوات المهارات' : 'Skills Gap Analysis',
          value: '23%',
          trend: 'down',
          confidence: 0.89,
          description: isArabic 
            ? 'فجوة في المهارات التقنية، يحتاج تدريب 23% من الفريق'
            : 'Technical skills gap identified, 23% of team needs training',
          action: isArabic ? 'برنامج التدريب' : 'Training Program',
          priority: 'medium'
        }
      ],
      'recruitment': [
        {
          id: 5,
          type: 'success',
          title: isArabic ? 'معدل نجاح التوظيف' : 'Hiring Success Rate',
          value: '87%',
          trend: 'up',
          confidence: 0.93,
          description: isArabic 
            ? 'معدل نجاح عالي في التوظيف مع تحسن 12% عن الشهر الماضي'
            : 'High hiring success rate with 12% improvement from last month',
          action: isArabic ? 'تحسين العملية' : 'Optimize Process',
          priority: 'low'
        },
        {
          id: 6,
          type: 'cultural_fit',
          title: isArabic ? 'التوافق الثقافي' : 'Cultural Fit Analysis',
          value: '95%',
          trend: 'up',
          confidence: 0.96,
          description: isArabic 
            ? 'توافق ثقافي ممتاز للمرشحين الجدد'
            : 'Excellent cultural fit for new candidates',
          action: isArabic ? 'مراجعة المعايير' : 'Review Criteria',
          priority: 'low'
        }
      ],
      'performance': [
        {
          id: 7,
          type: 'performance',
          title: isArabic ? 'توقع الأداء' : 'Performance Prediction',
          value: '94%',
          trend: 'up',
          confidence: 0.88,
          description: isArabic 
            ? 'توقع تحسن أداء الفريق بنسبة 6% خلال الشهرين القادمين'
            : 'Team performance expected to improve by 6% in next 2 months',
          action: isArabic ? 'خطة التطوير' : 'Development Plan',
          priority: 'medium'
        },
        {
          id: 8,
          type: 'risk',
          title: isArabic ? 'مخاطر الأداء' : 'Performance Risk',
          value: '3',
          trend: 'stable',
          confidence: 0.85,
          description: isArabic 
            ? '3 موظفين معرضون لخطر انخفاض الأداء'
            : '3 employees at risk of performance decline',
          action: isArabic ? 'تدخل فوري' : 'Immediate Intervention',
          priority: 'high'
        }
      ],
      'health_safety': [
        {
          id: 9,
          type: 'safety',
          title: isArabic ? 'مؤشر السلامة' : 'Safety Score',
          value: '96%',
          trend: 'up',
          confidence: 0.92,
          description: isArabic 
            ? 'مستوى سلامة ممتاز مع تحسن 4% هذا الشهر'
            : 'Excellent safety level with 4% improvement this month',
          action: isArabic ? 'الحفاظ على المعايير' : 'Maintain Standards',
          priority: 'low'
        },
        {
          id: 10,
          type: 'compliance',
          title: isArabic ? 'الامتثال للوائح' : 'Regulatory Compliance',
          value: '98%',
          trend: 'stable',
          confidence: 0.97,
          description: isArabic 
            ? 'امتثال ممتاز للوائح السلامة المهنية'
            : 'Excellent compliance with occupational safety regulations',
          action: isArabic ? 'مراجعة دورية' : 'Regular Review',
          priority: 'low'
        }
      ]
    };

    return insightTemplates[moduleContext] || [
      {
        id: 11,
        type: 'general',
        title: isArabic ? 'نظرة عامة' : 'General Overview',
        value: '85%',
        trend: 'up',
        confidence: 0.80,
        description: isArabic 
          ? 'أداء عام جيد عبر جميع المقاييس'
          : 'Good overall performance across all metrics',
        action: isArabic ? 'عرض التفاصيل' : 'View Details',
        priority: 'medium'
      }
    ];
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <TrendingUp className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-500 border-red-500';
      case 'medium':
        return 'text-yellow-500 border-yellow-500';
      default:
        return 'text-green-500 border-green-500';
    }
  };

  const getPriorityNameArabic = (priority: string) => {
    const priorities: Record<string, string> = {
      'high': 'عالي',
      'medium': 'متوسط',
      'low': 'منخفض'
    };
    return priorities[priority] || priority;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'prediction':
        return <Brain className="h-4 w-4" />;
      case 'risk':
        return <AlertTriangle className="h-4 w-4" />;
      case 'success':
        return <CheckCircle className="h-4 w-4" />;
      case 'demand':
        return <Users className="h-4 w-4" />;
      case 'performance':
        return <Target className="h-4 w-4" />;
      default:
        return <Zap className="h-4 w-4" />;
    }
  };

  return (
    <div className={`space-y-4 ${className}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {insights.map((insight) => (
        <Card key={insight.id} className={`border-l-4 border-l-primary ${isRTL ? 'border-r-4 border-r-primary border-l-0' : ''}`}>
          <CardHeader className="pb-3">
            <div className={`flex items-start justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                {getTypeIcon(insight.type)}
                <CardTitle className="text-base">{insight.title}</CardTitle>
                <Badge variant="outline" className={getPriorityColor(insight.priority)}>
                  {isArabic ? getPriorityNameArabic(insight.priority) : insight.priority}
                </Badge>
              </div>
              {getTrendIcon(insight.trend)}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Main Value */}
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="text-2xl font-bold text-primary">
                {insight.value}
              </div>
              <Badge variant="secondary">
                {Math.round(insight.confidence * 100)}% {isArabic ? 'ثقة' : 'confidence'}
              </Badge>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground">
              {insight.description}
            </p>

            {/* Impact Metrics */}
            {insight.impact && (
              <div className="bg-primary/5 p-3 rounded-md">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">
                    {isArabic ? 'التأثير المتوقع:' : 'Expected Impact:'}
                  </span>
                  <span className="text-primary font-bold">
                    +{insight.impact.value}% {insight.impact.metric}
                  </span>
                </div>
                <Progress 
                  value={insight.confidence * 100} 
                  className="mt-2 h-2"
                />
                <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                  <span>{isArabic ? 'الإطار الزمني:' : 'Timeline:'}</span>
                  <span>{insight.impact.timeline}</span>
                </div>
              </div>
            )}

            {/* Action Button */}
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full group"
              onClick={() => {
                // Handle action based on insight type
                console.log('AI Insight Action:', insight);
              }}
            >
              {insight.action}
              <ArrowRight className="h-3 w-3 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </CardContent>
        </Card>
      ))}

      {/* AI Processing Status */}
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Brain className="h-6 w-6 text-primary" />
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full animate-pulse" />
              </div>
              <div>
                <p className="font-medium text-sm">
                  {isArabic ? 'مانوس يعمل' : 'Manus is Active'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isArabic ? 'تحليل مستمر للبيانات' : 'Continuously analyzing data'}
                </p>
              </div>
            </div>
            <Badge variant="default" className="bg-green-500">
              {isArabic ? 'نشط' : 'Active'}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIInsightCard;