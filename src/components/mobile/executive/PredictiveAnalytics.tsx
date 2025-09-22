import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Brain, 
  Target,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Zap,
  Eye,
  RefreshCw,
  Sparkles,
  Activity,
  Users,
  DollarSign
} from 'lucide-react';
import { CurrencyIcon } from '@/components/shared/CurrencyIcon';

interface Prediction {
  id: string;
  title: string;
  titleAr: string;
  category: 'financial' | 'hr' | 'operational' | 'market' | 'compliance';
  prediction: string;
  predictionAr: string;
  confidence: number;
  timeframe: '1month' | '3months' | '6months' | '1year';
  trend: 'positive' | 'negative' | 'neutral';
  impact: 'high' | 'medium' | 'low';
  likelihood: number;
  factors: string[];
  recommendations: string[];
  recommendationsAr: string[];
  lastUpdated: string;
}

interface AnalyticsModel {
  id: string;
  name: string;
  nameAr: string;
  type: 'regression' | 'classification' | 'clustering' | 'neural_network';
  accuracy: number;
  lastTrained: string;
  status: 'active' | 'training' | 'outdated';
  dataPoints: number;
}

interface PredictiveAnalyticsProps {
  isArabic: boolean;
  expanded?: boolean;
}

export const PredictiveAnalytics: React.FC<PredictiveAnalyticsProps> = ({ 
  isArabic, 
  expanded = false 
}) => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [models, setModels] = useState<AnalyticsModel[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('all');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    loadPredictions();
    loadModels();
  }, []);

  const loadPredictions = () => {
    const predictionsData: Prediction[] = [
      {
        id: 'pred_001',
        title: 'Revenue Growth Forecast',
        titleAr: 'توقع نمو الإيرادات',
        category: 'financial',
        prediction: 'Revenue expected to grow by 18-22% in Q2 2025 based on current market trends and expansion plans',
        predictionAr: 'من المتوقع أن تنمو الإيرادات بنسبة 18-22% في الربع الثاني من 2025 بناءً على اتجاهات السوق الحالية وخطط التوسع',
        confidence: 87,
        timeframe: '3months',
        trend: 'positive',
        impact: 'high',
        likelihood: 84,
        factors: ['Market expansion', 'New product launches', 'Customer retention rate', 'Economic indicators'],
        recommendations: [
          'Increase marketing budget by 15%',
          'Accelerate product development timeline',
          'Expand sales team in key regions'
        ],
        recommendationsAr: [
          'زيادة ميزانية التسويق بنسبة 15%',
          'تسريع جدول تطوير المنتجات',
          'توسيع فريق المبيعات في المناطق الرئيسية'
        ],
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'pred_002',
        title: 'Employee Turnover Risk',
        titleAr: 'مخاطر دوران الموظفين',
        category: 'hr',
        prediction: 'High turnover risk detected in IT department with 35% probability of losing 3-5 senior developers within 6 months',
        predictionAr: 'تم اكتشاف مخاطر عالية لدوران الموظفين في قسم تقنية المعلومات مع احتمالية 35% لفقدان 3-5 مطورين كبار خلال 6 أشهر',
        confidence: 92,
        timeframe: '6months',
        trend: 'negative',
        impact: 'high',
        likelihood: 78,
        factors: ['Salary benchmarking', 'Work-life balance scores', 'Market demand for skills', 'Recent performance reviews'],
        recommendations: [
          'Conduct salary review for IT department',
          'Implement flexible work arrangements',
          'Create career development programs',
          'Improve manager-employee relationships'
        ],
        recommendationsAr: [
          'إجراء مراجعة الرواتب لقسم تقنية المعلومات',
          'تنفيذ ترتيبات عمل مرنة',
          'إنشاء برامج تطوير المهن',
          'تحسين العلاقات بين المديرين والموظفين'
        ],
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'pred_003',
        title: 'Saudization Compliance Outlook',
        titleAr: 'نظرة امتثال السعودة',
        category: 'compliance',
        prediction: 'Current trajectory suggests 85% Saudization rate achievement by Q4 2025, exceeding regulatory requirements',
        predictionAr: 'يشير المسار الحالي إلى تحقيق معدل سعودة 85% بحلول الربع الرابع من 2025، متجاوزاً المتطلبات التنظيمية',
        confidence: 91,
        timeframe: '1year',
        trend: 'positive',
        impact: 'medium',
        likelihood: 89,
        factors: ['Hiring trends', 'Training program effectiveness', 'Government incentives', 'Local talent availability'],
        recommendations: [
          'Continue current hiring strategy',
          'Expand training programs',
          'Partner with local universities',
          'Document compliance progress'
        ],
        recommendationsAr: [
          'الاستمرار في استراتيجية التوظيف الحالية',
          'توسيع برامج التدريب',
          'الشراكة مع الجامعات المحلية',
          'توثيق تقدم الامتثال'
        ],
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'pred_004',
        title: 'Market Share Expansion',
        titleAr: 'توسع الحصة السوقية',
        category: 'market',
        prediction: 'Potential to capture additional 2-3% market share in fintech sector within 12 months through strategic partnerships',
        predictionAr: 'إمكانية الحصول على 2-3% إضافية من الحصة السوقية في قطاع التكنولوجيا المالية خلال 12 شهرًا من خلال الشراكات الاستراتيجية',
        confidence: 76,
        timeframe: '1year',
        trend: 'positive',
        impact: 'high',
        likelihood: 72,
        factors: ['Competitor analysis', 'Partnership opportunities', 'Product differentiation', 'Customer acquisition costs'],
        recommendations: [
          'Identify key strategic partners',
          'Develop differentiated offerings',
          'Increase competitive intelligence',
          'Optimize customer acquisition funnel'
        ],
        recommendationsAr: [
          'تحديد الشركاء الاستراتيجيين الرئيسيين',
          'تطوير عروض متميزة',
          'زيادة الذكاء التنافسي',
          'تحسين قمع اكتساب العملاء'
        ],
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'pred_005',
        title: 'Operational Efficiency Forecast',
        titleAr: 'توقع الكفاءة التشغيلية',
        category: 'operational',
        prediction: 'AI automation implementation could improve operational efficiency by 25-30% within 9 months',
        predictionAr: 'يمكن لتنفيذ أتمتة الذكاء الاصطناعي تحسين الكفاءة التشغيلية بنسبة 25-30% خلال 9 أشهر',
        confidence: 83,
        timeframe: '6months',
        trend: 'positive',
        impact: 'high',
        likelihood: 81,
        factors: ['Current process analysis', 'AI readiness assessment', 'Employee training capacity', 'Technology infrastructure'],
        recommendations: [
          'Prioritize high-impact processes for automation',
          'Invest in employee AI training',
          'Upgrade technology infrastructure',
          'Establish change management program'
        ],
        recommendationsAr: [
          'إعطاء الأولوية للعمليات عالية التأثير للأتمتة',
          'الاستثمار في تدريب الموظفين على الذكاء الاصطناعي',
          'ترقية البنية التحتية التكنولوجية',
          'إنشاء برنامج إدارة التغيير'
        ],
        lastUpdated: new Date().toISOString()
      }
    ];

    setPredictions(predictionsData);
  };

  const loadModels = () => {
    const modelsData: AnalyticsModel[] = [
      {
        id: 'model_001',
        name: 'Revenue Prediction Engine',
        nameAr: 'محرك توقع الإيرادات',
        type: 'regression',
        accuracy: 87.3,
        lastTrained: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        dataPoints: 156789
      },
      {
        id: 'model_002',
        name: 'Employee Retention Classifier',
        nameAr: 'مصنف الاحتفاظ بالموظفين',
        type: 'classification',
        accuracy: 92.1,
        lastTrained: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        dataPoints: 45632
      },
      {
        id: 'model_003',
        name: 'Market Sentiment Neural Network',
        nameAr: 'شبعة عصبية لمشاعر السوق',
        type: 'neural_network',
        accuracy: 89.7,
        lastTrained: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'training',
        dataPoints: 892341
      }
    ];

    setModels(modelsData);
  };

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 4000));
    loadPredictions();
    setIsAnalyzing(false);
  };

  const getTrendIcon = (trend: Prediction['trend']) => {
    switch (trend) {
      case 'positive':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'negative':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'neutral':
        return <Activity className="h-4 w-4 text-blue-500" />;
    }
  };

  const getTrendColor = (trend: Prediction['trend']) => {
    switch (trend) {
      case 'positive':
        return 'text-green-500';
      case 'negative':
        return 'text-red-500';
      case 'neutral':
        return 'text-blue-500';
    }
  };

  const getImpactColor = (impact: Prediction['impact']) => {
    switch (impact) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'low':
        return 'bg-green-100 text-green-700';
    }
  };

  const getCategoryIcon = (category: Prediction['category']) => {
    switch (category) {
      case 'financial':
        return <CurrencyIcon className="h-4 w-4" />;
      case 'hr':
        return <Users className="h-4 w-4" />;
      case 'operational':
        return <BarChart3 className="h-4 w-4" />;
      case 'market':
        return <Target className="h-4 w-4" />;
      case 'compliance':
        return <CheckCircle className="h-4 w-4" />;
    }
  };

  const getTimeframeLabel = (timeframe: Prediction['timeframe']) => {
    const labels = {
      '1month': isArabic ? 'شهر واحد' : '1 Month',
      '3months': isArabic ? '3 أشهر' : '3 Months',
      '6months': isArabic ? '6 أشهر' : '6 Months',
      '1year': isArabic ? 'سنة واحدة' : '1 Year'
    };
    return labels[timeframe];
  };

  const getModelStatusColor = (status: AnalyticsModel['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'training':
        return 'bg-blue-100 text-blue-700';
      case 'outdated':
        return 'bg-red-100 text-red-700';
    }
  };

  const filteredPredictions = predictions.filter(pred => {
    const matchesCategory = selectedCategory === 'all' || pred.category === selectedCategory;
    const matchesTimeframe = selectedTimeframe === 'all' || pred.timeframe === selectedTimeframe;
    return matchesCategory && matchesTimeframe;
  });

  const categories = [
    { key: 'all', label: isArabic ? 'الكل' : 'All' },
    { key: 'financial', label: isArabic ? 'مالي' : 'Financial' },
    { key: 'hr', label: isArabic ? 'موارد بشرية' : 'HR' },
    { key: 'operational', label: isArabic ? 'تشغيلي' : 'Operational' },
    { key: 'market', label: isArabic ? 'السوق' : 'Market' },
    { key: 'compliance', label: isArabic ? 'امتثال' : 'Compliance' }
  ];

  const timeframes = [
    { key: 'all', label: isArabic ? 'جميع الفترات' : 'All Timeframes' },
    { key: '1month', label: isArabic ? 'شهر واحد' : '1 Month' },
    { key: '3months', label: isArabic ? '3 أشهر' : '3 Months' },
    { key: '6months', label: isArabic ? '6 أشهر' : '6 Months' },
    { key: '1year', label: isArabic ? 'سنة واحدة' : '1 Year' }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            {isArabic ? 'التحليلات التنبؤية' : 'Predictive Analytics'}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={runAnalysis}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="space-y-3">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category.key}
                variant={selectedCategory === category.key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.key)}
                className="whitespace-nowrap"
              >
                {category.label}
              </Button>
            ))}
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {timeframes.map((timeframe) => (
              <Button
                key={timeframe.key}
                variant={selectedTimeframe === timeframe.key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTimeframe(timeframe.key)}
                className="whitespace-nowrap"
              >
                {timeframe.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Predictions */}
        <div className="space-y-3">
          {filteredPredictions.map((prediction) => (
            <Card key={prediction.id} className="border">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      {getCategoryIcon(prediction.category)}
                      <div className="min-w-0 flex-1">
                        <h5 className="font-medium text-sm">
                          {isArabic ? prediction.titleAr : prediction.title}
                        </h5>
                        <p className="text-xs text-muted-foreground mt-1">
                          {isArabic ? prediction.predictionAr : prediction.prediction}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getTrendIcon(prediction.trend)}
                      <Badge className={getImpactColor(prediction.impact)}>
                        {prediction.impact.toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <span className="text-xs font-medium">
                        {isArabic ? 'الثقة' : 'Confidence'}
                      </span>
                      <div className="space-y-1">
                        <Progress value={prediction.confidence} className="h-2" />
                        <span className="text-xs text-muted-foreground">
                          {prediction.confidence}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <span className="text-xs font-medium">
                        {isArabic ? 'الاحتمالية' : 'Likelihood'}
                      </span>
                      <div className="space-y-1">
                        <Progress value={prediction.likelihood} className="h-2" />
                        <span className="text-xs text-muted-foreground">
                          {prediction.likelihood}%
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-xs font-medium">
                        {isArabic ? 'الإطار الزمني' : 'Timeframe'}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        <Calendar className="h-3 w-3 mr-1" />
                        {getTimeframeLabel(prediction.timeframe)}
                      </Badge>
                    </div>
                  </div>

                  {expanded && (
                    <>
                      {/* Key Factors */}
                      <div className="space-y-2">
                        <span className="text-xs font-medium">
                          {isArabic ? 'العوامل الرئيسية:' : 'Key Factors:'}
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {prediction.factors.slice(0, 4).map((factor, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {factor}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Recommendations */}
                      <div className="space-y-2">
                        <span className="text-xs font-medium">
                          {isArabic ? 'التوصيات:' : 'Recommendations:'}
                        </span>
                        <div className="space-y-1">
                          {(isArabic ? prediction.recommendationsAr : prediction.recommendations).slice(0, 3).map((rec, index) => (
                            <div key={index} className="flex items-center gap-2 text-xs">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              <span>{rec}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {isArabic ? 'آخر تحديث' : 'Last updated'}: {
                        new Date(prediction.lastUpdated).toLocaleDateString()
                      }
                    </span>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-3 w-3 mr-1" />
                      {isArabic ? 'عرض التفاصيل' : 'View Details'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Models Status */}
        {expanded && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <Zap className="h-4 w-4" />
              {isArabic ? 'نماذج التحليل' : 'Analytics Models'}
            </h4>
            
            <div className="grid grid-cols-1 gap-2">
              {models.map((model) => (
                <Card key={model.id} className="border">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h6 className="font-medium text-sm">
                          {isArabic ? model.nameAr : model.name}
                        </h6>
                        <p className="text-xs text-muted-foreground">
                          {isArabic ? 'الدقة' : 'Accuracy'}: {model.accuracy}% | {
                            isArabic ? 'نقاط البيانات' : 'Data Points'
                          }: {model.dataPoints.toLocaleString()}
                        </p>
                      </div>
                      <Badge className={getModelStatusColor(model.status)}>
                        {model.status.toUpperCase()}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* AI Status */}
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-800">
                  {isArabic ? 'محرك التحليلات التنبؤية' : 'Predictive Analytics Engine'}
                </span>
              </div>
              <Badge variant="outline" className="text-purple-700 border-purple-300">
                {isAnalyzing ? (isArabic ? 'جاري التحليل' : 'Analyzing') : (isArabic ? 'نشط' : 'Active')}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};