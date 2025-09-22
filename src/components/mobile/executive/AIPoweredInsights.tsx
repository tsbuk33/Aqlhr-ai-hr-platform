import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  Lightbulb, 
  Target,
  Users,
  Calendar,
  RefreshCw,
  Sparkles,
  BarChart3,
  Eye
} from 'lucide-react';
import { CurrencyIcon } from '@/components/shared/CurrencyIcon';

interface AIInsight {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  type: 'trend' | 'anomaly' | 'recommendation' | 'prediction' | 'risk';
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  category: 'financial' | 'operational' | 'strategic' | 'hr';
  actionable: boolean;
  timestamp: string;
  dataPoints?: string[];
}

interface AIPoweredInsightsProps {
  isArabic: boolean;
  expanded?: boolean;
}

export const AIPoweredInsights: React.FC<AIPoweredInsightsProps> = ({ 
  isArabic, 
  expanded = false 
}) => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('all');

  useEffect(() => {
    loadAIInsights();
  }, []);

  const loadAIInsights = () => {
    // AI-generated insights - would come from AI service
    const aiInsights: AIInsight[] = [
      {
        id: 'trend_001',
        title: 'Rising Employee Satisfaction Trend',
        titleAr: 'اتجاه تصاعدي في رضا الموظفين',
        description: 'Employee satisfaction has increased by 12% over the last quarter, particularly in remote work flexibility and training opportunities.',
        descriptionAr: 'ارتفع رضا الموظفين بنسبة 12% خلال الربع الماضي، خاصة في مرونة العمل عن بُعد وفرص التدريب.',
        type: 'trend',
        confidence: 94,
        impact: 'high',
        category: 'hr',
        actionable: true,
        timestamp: new Date().toISOString(),
        dataPoints: ['Remote work policy', 'Training budget increase', 'Flexible hours']
      },
      {
        id: 'anomaly_001',
        title: 'Unusual Turnover Pattern Detected',
        titleAr: 'نمط غير عادي في دوران الموظفين',
        description: 'AI detected a 300% increase in resignations among mid-level managers in the IT department over the past 2 months.',
        descriptionAr: 'اكتشفت الذكاء الاصطناعي زيادة بنسبة 300% في الاستقالات بين المديرين المتوسطين في قسم تقنية المعلومات خلال الشهرين الماضيين.',
        type: 'anomaly',
        confidence: 87,
        impact: 'high',
        category: 'hr',
        actionable: true,
        timestamp: new Date().toISOString(),
        dataPoints: ['IT department', 'Mid-level managers', 'Recent policy changes']
      },
      {
        id: 'prediction_001',
        title: 'Revenue Growth Forecast',
        titleAr: 'توقعات نمو الإيرادات',
        description: 'Based on current trends, revenue is projected to grow by 22% in the next quarter, exceeding target by 2%.',
        descriptionAr: 'بناءً على الاتجاهات الحالية، من المتوقع أن تنمو الإيرادات بنسبة 22% في الربع القادم، متجاوزة الهدف بنسبة 2%.',
        type: 'prediction',
        confidence: 91,
        impact: 'high',
        category: 'financial',
        actionable: false,
        timestamp: new Date().toISOString(),
        dataPoints: ['Market expansion', 'New product launches', 'Customer acquisition']
      },
      {
        id: 'recommendation_001',
        title: 'Optimize Training Budget Allocation',
        titleAr: 'تحسين تخصيص ميزانية التدريب',
        description: 'AI recommends reallocating 30% of training budget to digital skills development based on industry trends and skill gaps.',
        descriptionAr: 'توصي الذكاء الاصطناعي بإعادة تخصيص 30% من ميزانية التدريب لتطوير المهارات الرقمية بناءً على اتجاهات الصناعة والثغرات في المهارات.',
        type: 'recommendation',
        confidence: 89,
        impact: 'medium',
        category: 'strategic',
        actionable: true,
        timestamp: new Date().toISOString(),
        dataPoints: ['Skill gap analysis', 'Industry benchmarks', 'ROI projections']
      },
      {
        id: 'risk_001',
        title: 'Compliance Risk Alert',
        titleAr: 'تنبيه مخاطر الامتثال',
        description: 'High risk detected for missing Saudization targets in Q4. Immediate action required to avoid penalties.',
        descriptionAr: 'تم اكتشاف مخاطر عالية لعدم تحقيق أهداف السعودة في الربع الرابع. مطلوب اتخاذ إجراء فوري لتجنب الغرامات.',
        type: 'risk',
        confidence: 96,
        impact: 'high',
        category: 'strategic',
        actionable: true,
        timestamp: new Date().toISOString(),
        dataPoints: ['Current Saudization rate', 'Hiring projections', 'Regulatory requirements']
      }
    ];

    setInsights(aiInsights);
  };

  const generateNewInsights = async () => {
    setIsGenerating(true);
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    loadAIInsights();
    setIsGenerating(false);
  };

  const getTypeIcon = (type: AIInsight['type']) => {
    switch (type) {
      case 'trend':
        return <TrendingUp className="h-4 w-4 text-blue-500" />;
      case 'anomaly':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'recommendation':
        return <Lightbulb className="h-4 w-4 text-green-500" />;
      case 'prediction':
        return <Eye className="h-4 w-4 text-purple-500" />;
      case 'risk':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
  };

  const getTypeColor = (type: AIInsight['type']) => {
    switch (type) {
      case 'trend':
        return 'border-blue-500 bg-blue-50';
      case 'anomaly':
        return 'border-orange-500 bg-orange-50';
      case 'recommendation':
        return 'border-green-500 bg-green-50';
      case 'prediction':
        return 'border-purple-500 bg-purple-50';
      case 'risk':
        return 'border-red-500 bg-red-50';
    }
  };

  const getImpactBadge = (impact: AIInsight['impact']) => {
    switch (impact) {
      case 'high':
        return <Badge variant="destructive">{isArabic ? 'عالي' : 'High'}</Badge>;
      case 'medium':
        return <Badge variant="default">{isArabic ? 'متوسط' : 'Medium'}</Badge>;
      case 'low':
        return <Badge variant="secondary">{isArabic ? 'منخفض' : 'Low'}</Badge>;
    }
  };

  const getCategoryIcon = (category: AIInsight['category']) => {
    switch (category) {
      case 'financial':
        return <CurrencyIcon className="h-3 w-3" />;
      case 'operational':
        return <BarChart3 className="h-3 w-3" />;
      case 'strategic':
        return <Target className="h-3 w-3" />;
      case 'hr':
        return <Users className="h-3 w-3" />;
    }
  };

  const filteredInsights = selectedType === 'all' 
    ? insights 
    : insights.filter(i => i.type === selectedType);

  const insightTypes = [
    { key: 'all', label: isArabic ? 'الكل' : 'All' },
    { key: 'trend', label: isArabic ? 'اتجاهات' : 'Trends' },
    { key: 'anomaly', label: isArabic ? 'شذوذ' : 'Anomalies' },
    { key: 'recommendation', label: isArabic ? 'توصيات' : 'Recommendations' },
    { key: 'prediction', label: isArabic ? 'توقعات' : 'Predictions' },
    { key: 'risk', label: isArabic ? 'مخاطر' : 'Risks' }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            {isArabic ? 'رؤى مدعومة بالذكاء الاصطناعي' : 'AI-Powered Insights'}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={generateNewInsights}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Type Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {insightTypes.map((type) => (
            <Button
              key={type.key}
              variant={selectedType === type.key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedType(type.key)}
              className="whitespace-nowrap"
            >
              {type.label}
            </Button>
          ))}
        </div>

        {/* Insights List */}
        <div className="space-y-3">
          {filteredInsights.map((insight) => (
            <Card key={insight.id} className={`${getTypeColor(insight.type)} border-l-4`}>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(insight.type)}
                      <span className="font-medium text-sm">
                        {isArabic ? insight.titleAr : insight.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getImpactBadge(insight.impact)}
                      <Badge variant="outline" className="text-xs">
                        {insight.confidence}%
                      </Badge>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {isArabic ? insight.descriptionAr : insight.description}
                  </p>

                  {expanded && insight.dataPoints && (
                    <div className="space-y-2">
                      <span className="text-xs font-medium">
                        {isArabic ? 'نقاط البيانات:' : 'Data Points:'}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {insight.dataPoints.map((point, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {point}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(insight.category)}
                      <span className="text-muted-foreground">
                        {insight.category.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {insight.actionable && (
                        <Badge variant="outline" className="text-xs text-green-600">
                          {isArabic ? 'قابل للتنفيذ' : 'Actionable'}
                        </Badge>
                      )}
                      <span className="text-muted-foreground">
                        {new Date(insight.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Status */}
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">
                  {isArabic ? 'الذكاء الاصطناعي نشط' : 'AI Engine Active'}
                </span>
              </div>
              <Badge variant="secondary">
                {isArabic ? 'آخر تحليل: منذ 5 دقائق' : 'Last Analysis: 5min ago'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};