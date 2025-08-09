import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguageCompat";
import { Brain, TrendingUp, AlertTriangle, Star, BarChart3, Target, Users, Activity } from "lucide-react";
import ModuleDocumentUploader from '@/components/universal/ModuleDocumentUploader';
import { AqlHRAIAssistant } from '@/components/ai';

const PredictiveAnalyticsEngine = () => {
  const { language } = useLanguage();

  // Embedded translations
  const translations = {
    en: {
      title: "Predictive Analytics Engine",
      description: "AI-powered predictive analytics for workforce planning and employee performance forecasting",
      ml_models: "ML Models",
      prediction_accuracy: "Prediction Accuracy",
      at_risk_employees: "At-Risk Employees",
      high_performers: "High Performers",
      turnover_prediction: "Turnover Prediction",
      performance_forecast: "Performance Forecast",
      risk_analysis: "Risk Analysis",
      talent_insights: "Talent Insights",
      models_active: "Active Models",
      predictions_today: "Predictions Today",
      accuracy_rate: "Accuracy Rate",
      insights_generated: "Insights Generated"
    },
    ar: {
      title: "محرك التحليلات التنبؤية",
      description: "تحليلات تنبؤية مدعومة بالذكاء الاصطناعي لتخطيط القوى العاملة والتنبؤ بأداء الموظفين",
      ml_models: "نماذج التعلم الآلي",
      prediction_accuracy: "دقة التنبؤات",
      at_risk_employees: "الموظفون المعرضون للخطر",
      high_performers: "أصحاب الأداء العالي",
      turnover_prediction: "التنبؤ بدوران الموظفين",
      performance_forecast: "توقعات الأداء",
      risk_analysis: "تحليل المخاطر",
      talent_insights: "رؤى المواهب",
      models_active: "النماذج النشطة",
      predictions_today: "التنبؤات اليوم",
      accuracy_rate: "معدل الدقة",
      insights_generated: "الرؤى المُولدة"
    }
  };

  const t = (key: string) => translations[language as keyof typeof translations][key as keyof typeof translations.en] || key;
  
  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          {t('title')}
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {t('description')}
        </p>
      </div>

      {/* Main Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('models_active')}</CardTitle>
            <Brain className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">12</div>
            <p className="text-xs text-muted-foreground">
              +2 new this month
            </p>
          </CardContent>
        </Card>

        <Card className="border-success/20 bg-gradient-to-br from-success/5 to-success/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('accuracy_rate')}</CardTitle>
            <Target className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">94.2%</div>
            <p className="text-xs text-muted-foreground">
              +2.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-warning/20 bg-gradient-to-br from-warning/5 to-warning/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('at_risk_employees')}</CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-warning">47</div>
            <p className="text-xs text-muted-foreground">
              -3 from last week
            </p>
          </CardContent>
        </Card>

        <Card className="border-accent/20 bg-gradient-to-br from-accent/5 to-accent/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('high_performers')}</CardTitle>
            <Star className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">234</div>
            <p className="text-xs text-muted-foreground">
              +12 identified this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              {t('turnover_prediction')}
            </CardTitle>
            <CardDescription>
              AI-powered employee turnover risk assessment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Low Risk</span>
                <span className="text-sm font-medium">78%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Medium Risk</span>
                <span className="text-sm font-medium">15%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">High Risk</span>
                <span className="text-sm font-medium">7%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-success" />
              {t('performance_forecast')}
            </CardTitle>
            <CardDescription>
              Future performance predictions based on current trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Exceeds Expectations</span>
                <span className="text-sm font-medium">23%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Meets Expectations</span>
                <span className="text-sm font-medium">65%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Below Expectations</span>
                <span className="text-sm font-medium">12%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-warning" />
              {t('risk_analysis')}
            </CardTitle>
            <CardDescription>
              Comprehensive risk assessment across all employees
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Performance Risk</span>
                <span className="text-sm font-medium">14%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Engagement Risk</span>
                <span className="text-sm font-medium">8%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Retention Risk</span>
                <span className="text-sm font-medium">11%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-accent" />
              {t('talent_insights')}
            </CardTitle>
            <CardDescription>
              Strategic talent management recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Ready for Promotion</span>
                <span className="text-sm font-medium">45</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Skill Development</span>
                <span className="text-sm font-medium">128</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Leadership Potential</span>
                <span className="text-sm font-medium">67</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <ModuleDocumentUploader moduleKey="ai-automation.predictiveAnalyticsEngine" />
      <AqlHRAIAssistant moduleContext="ai-automation.predictiveAnalyticsEngine" />
    </div>
  );
};

export default PredictiveAnalyticsEngine;