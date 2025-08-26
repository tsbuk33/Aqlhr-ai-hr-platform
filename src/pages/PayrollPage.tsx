import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign, 
  Brain, 
  TrendingUp, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  Zap, 
  Target,
  BarChart3,
  Calculator,
  Clock,
  Shield,
  FileText,
  Sparkles
} from 'lucide-react';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';
import { AqlHRAIAssistant } from '@/components/ai';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";

const PayrollPage = () => {
  const { isArabic } = useSimpleLanguage();

  const aiScenarios = [
    {
      id: 'payroll_automation',
      title: isArabic ? 'أتمتة الرواتب الذكية' : 'Intelligent Payroll Automation',
      description: isArabic ? 'معالجة آلية للرواتب مع كشف الأخطاء والتحسين التلقائي' : 'Automated payroll processing with error detection and optimization',
      icon: Calculator,
      scenario: isArabic 
        ? 'الذكاء الاصطناعي معالج 2,847 راتب في 12 دقيقة. اكتشف 15 خطأ محتمل ووفر SAR 45,000 شهرياً عبر التحسين التلقائي للضرائب والمزايا.'
        : 'AI processed 2,847 payrolls in 12 minutes. Detected 15 potential errors and saved SAR 45,000 monthly through automatic tax and benefit optimization.',
      metrics: {
        payrolls_processed: 2847,
        processing_time: '12 minutes',
        errors_prevented: 15,
        monthly_savings: 'SAR 45,000',
        accuracy_rate: '99.94%',
        time_saved: '87%'
      },
      aiPower: 'Auto-ML + Tax Optimization + Compliance Validation + Error Prevention'
    },
    {
      id: 'predictive_compensation',
      title: isArabic ? 'محرك التعويضات التنبؤي' : 'Predictive Compensation Engine',  
      description: isArabic ? 'تحليل واقتراح هياكل التعويضات المثلى والتنبؤ بالاتجاهات' : 'Analyze and suggest optimal compensation structures and predict trends',
      icon: TrendingUp,
      scenario: isArabic
        ? 'نماذج التنبؤ حللت 156 وظيفة وتوقعت زيادات الرواتب للعام القادم. حددت اختلالات في 23 منصب ووضعت خطة تحسين وفرت SAR 2.1M سنوياً.'
        : 'Predictive models analyzed 156 positions and forecasted next year salary increases. Identified misalignments in 23 roles and created optimization plan saving SAR 2.1M annually.',
      metrics: {
        positions_analyzed: 156,
        salary_forecasts: '94.2% accuracy',
        misalignments_found: 23,
        optimization_savings: 'SAR 2.1M',
        market_competitiveness: '91%',
        retention_improvement: '34%'
      },
      aiPower: 'Market Analysis + Predictive Modeling + Compensation Optimization + Retention Analytics'
    },
    {
      id: 'smart_benefits',
      title: isArabic ? 'إدارة المزايا الذكية' : 'Smart Benefits Management',
      description: isArabic ? 'تخصيص وتحسين المزايا باستخدام الذكاء الاصطناعي' : 'AI-powered benefits personalization and optimization',
      icon: Shield,
      scenario: isArabic
        ? 'محرك المزايا الذكي حلل تفضيلات 1,245 موظف ووضع خطط مخصصة. زاد الرضا عن المزايا بنسبة 67% ووفر SAR 890K عبر التحسين التلقائي.'
        : 'Smart benefits engine analyzed 1,245 employee preferences and created personalized plans. Increased benefits satisfaction by 67% and saved SAR 890K through automatic optimization.',
      metrics: {
        employees_analyzed: 1245,
        personalization_rate: '89%',
        satisfaction_increase: '67%',
        cost_optimization: 'SAR 890K',
        utilization_improvement: '45%',
        admin_time_saved: '78%'
      },
      aiPower: 'Preference Learning + Benefits Optimization + Cost Prediction + Satisfaction Modeling'
    },
    {
      id: 'compliance_monitoring',
      title: isArabic ? 'مراقبة الامتثال المالي' : 'Financial Compliance Monitoring',
      description: isArabic ? 'مراقبة فورية للامتثال الضريبي والقانوني' : 'Real-time tax and legal compliance monitoring',
      icon: FileText,
      scenario: isArabic
        ? 'نظام الامتثال راقب 15,678 معاملة مالية ومنع 8 مخالفات محتملة. ضمن الامتثال لـ47 قانون ووفر SAR 125K في الغرامات المحتملة.'
        : 'Compliance system monitored 15,678 financial transactions and prevented 8 potential violations. Ensured compliance with 47 regulations and saved SAR 125K in potential fines.',
      metrics: {
        transactions_monitored: 15678,
        violations_prevented: 8,
        regulations_tracked: 47,
        fine_prevention: 'SAR 125K',
        compliance_score: '98.7%',
        audit_readiness: '100%'
      },
      aiPower: 'Regulation Tracking + Violation Detection + Risk Assessment + Audit Preparation'
    },
    {
      id: 'workforce_budgeting',
      title: isArabic ? 'ميزانية القوى العاملة الذكية' : 'Intelligent Workforce Budgeting',
      description: isArabic ? 'تخطيط وإدارة ميزانيات الرواتب بذكاء اصطناعي' : 'AI-powered salary budget planning and management',
      icon: Target,
      scenario: isArabic
        ? 'نظام الميزانية الذكي خطط للعام المقبل وتوقع زيادة التكاليف بدقة 96%. حدد فرص توفير بقيمة SAR 3.4M وحسن توزيع الموارد عبر 12 قسم.'
        : 'Smart budgeting system planned next year and predicted cost increases with 96% accuracy. Identified SAR 3.4M in savings opportunities and optimized resource allocation across 12 departments.',
      metrics: {
        budget_accuracy: '96%',
        savings_identified: 'SAR 3.4M',
        departments_optimized: 12,
        forecast_reliability: '94.8%',
        resource_efficiency: '82%',
        planning_time_saved: '69%'
      },
      aiPower: 'Budget Forecasting + Resource Optimization + Scenario Planning + Cost Prediction'
    },
    {
      id: 'payroll_analytics',
      title: isArabic ? 'تحليلات الرواتب المتقدمة' : 'Advanced Payroll Analytics',
      description: isArabic ? 'رؤى عميقة وتحليلات تنبؤية لبيانات الرواتب' : 'Deep insights and predictive analytics for payroll data',
      icon: BarChart3,
      scenario: isArabic
        ? 'محرك التحليلات اكتشف 247 نمط في بيانات الرواتب وتوقع اتجاهات التكاليف للأشهر الـ18 القادمة. حدد فرص تحسين في 34 منطقة ووضع خطة توفير شاملة.'
        : 'Analytics engine discovered 247 patterns in payroll data and predicted cost trends for next 18 months. Identified optimization opportunities in 34 areas and created comprehensive savings plan.',
      metrics: {
        patterns_discovered: 247,
        forecast_horizon: '18 months',
        optimization_areas: 34,
        trend_accuracy: '93.5%',
        insights_generated: 156,
        decision_support: '91%'
      },
      aiPower: 'Pattern Recognition + Trend Analysis + Predictive Modeling + Decision Intelligence'
    }
  ];

  const realTimeStats = {
    aiAccuracy: 97.8,
    processingSpeed: 94.2,
    costOptimization: 91.6,
    complianceRate: 99.1
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4 mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-xl">
            <DollarSign className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {isArabic ? 'الرواتب والمالية بالذكاء الاصطناعي' : 'AI-Powered Payroll & Finance'}
          </h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          {isArabic ? 'نظام متطور للرواتب مدعوم بالذكاء الاصطناعي مع أتمتة شاملة وتحليلات تنبؤية' : 'Advanced AI-driven payroll system with comprehensive automation and predictive analytics'}
        </p>
        
        {/* Real-time AI Intelligence Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="text-2xl font-bold text-blue-600">{realTimeStats.aiAccuracy}%</div>
            <div className="text-sm text-blue-600/80">{isArabic ? 'دقة الذكاء الاصطناعي' : 'AI Accuracy'}</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
            <div className="text-2xl font-bold text-green-600">{realTimeStats.processingSpeed}%</div>
            <div className="text-sm text-green-600/80">{isArabic ? 'سرعة المعالجة' : 'Processing Speed'}</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="text-2xl font-bold text-purple-600">{realTimeStats.costOptimization}%</div>
            <div className="text-sm text-purple-600/80">{isArabic ? 'تحسين التكاليف' : 'Cost Optimization'}</div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
            <div className="text-2xl font-bold text-orange-600">{realTimeStats.complianceRate}%</div>
            <div className="text-sm text-orange-600/80">{isArabic ? 'معدل الامتثال' : 'Compliance Rate'}</div>
          </div>
        </div>
      </div>

      {/* AI Scenarios Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {aiScenarios.map((scenario) => {
          const IconComponent = scenario.icon;
          return (
            <Card key={scenario.id} className="relative overflow-hidden border-2 hover:shadow-xl transition-all duration-300 group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-600/5 group-hover:from-blue-500/10 group-hover:to-purple-600/10 transition-all duration-300" />
              
              <CardHeader className="relative">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl font-bold text-foreground group-hover:text-blue-600 transition-colors">
                      {scenario.title}
                    </CardTitle>
                    <CardDescription className="text-base mt-2">
                      {scenario.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="relative space-y-6">
                {/* AI Scenario */}
                <div className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10 p-4 rounded-lg border border-blue-200/50 dark:border-blue-800/30">
                  <div className="flex items-start gap-3">
                    <Brain className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">
                        {isArabic ? 'سيناريو الذكاء الاصطناعي' : 'AI Intelligence Scenario'}
                      </h4>
                      <p className="text-sm text-blue-600/80 dark:text-blue-400/80 leading-relaxed">
                        {scenario.scenario}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(scenario.metrics).slice(0, 6).map(([key, value]) => (
                    <div key={key} className="bg-surface/50 p-3 rounded-lg border border-border/50">
                      <div className="text-lg font-bold text-foreground">{value}</div>
                      <div className="text-xs text-muted-foreground capitalize">
                        {key.replace(/_/g, ' ')}
                      </div>
                    </div>
                  ))}
                </div>

                {/* AI Power Badge */}
                <div className="flex items-center gap-2 pt-2">
                  <Sparkles className="h-4 w-4 text-yellow-500" />
                  <Badge variant="secondary" className="text-xs">
                    {scenario.aiPower}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* AI Assistant */}
      <AqlHRAIAssistant 
        moduleContext="payroll" 
        companyId="demo-company"
      />
      
      {/* AI Integration for Payroll */}
      <UniversalAIIntegrator 
        pageType="core-hr" 
        moduleName="payroll-finance" 
        companyId="demo-company" 
        enabledFeatures={['payroll-processing', 'financial-analytics', 'compensation-insights', 'intelligent-automation']}
      />
    </div>
  );
};

export default PayrollPage;