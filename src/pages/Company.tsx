import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Building, Users, Target, Award, MapPin, Calendar, Brain, Zap, 
  TrendingUp, Shield, Settings, Sparkles, Activity, AlertTriangle,
  BarChart3, Lightbulb, Rocket, Globe, Building2, CheckCircle2,
  Clock, DollarSign, UserCheck, Briefcase, LineChart, PieChart
} from 'lucide-react';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';
import { AqlHRAIAssistant } from '@/components/ai';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";

const Company: React.FC = () => {
  const { isArabic } = useSimpleLanguage();
  const [activeScenario, setActiveScenario] = useState('overview');
  const [aiInsights, setAIInsights] = useState({
    orgOptimization: 96.3,
    strategicAlignment: 94.7,
    riskPrediction: 98.1,
    growthPotential: 92.4
  });

  // Simulate real-time AI analysis
  useEffect(() => {
    const interval = setInterval(() => {
      setAIInsights(prev => ({
        orgOptimization: Math.min(100, prev.orgOptimization + (Math.random() * 0.3 - 0.1)),
        strategicAlignment: Math.min(100, prev.strategicAlignment + (Math.random() * 0.2 - 0.1)),
        riskPrediction: Math.min(100, prev.riskPrediction + (Math.random() * 0.1 - 0.05)),
        growthPotential: Math.min(100, prev.growthPotential + (Math.random() * 0.4 - 0.2))
      }));
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const aiScenarios = [
    {
      id: 'strategic_planning',
      title: isArabic ? 'التخطيط الاستراتيجي الذكي' : 'Smart Strategic Planning',
      description: isArabic ? 'تحليل أهداف الشركة وتحسين الاستراتيجيات بالذكاء الاصطناعي' : 'AI-powered company goal analysis and strategy optimization',
      icon: Target,
      scenario: 'AI analyzed 247 strategic initiatives across 12 departments. Identified 23% efficiency improvement through cross-departmental collaboration. Predicted ROI increase of 34% with recommended strategic alignment.',
      metrics: {
        strategic_goals_analyzed: 247,
        optimization_potential: '23%',
        predicted_roi_increase: '34%',
        departments_aligned: 12
      }
    },
    {
      id: 'org_intelligence',
      title: isArabic ? 'ذكاء الهيكل التنظيمي' : 'Organizational Intelligence',
      description: isArabic ? 'تحليل وتحسين الهيكل التنظيمي باستخدام الذكاء الاصطناعي' : 'AI-driven organizational structure analysis and optimization',
      icon: Users,
      scenario: 'Deep learning models identified 15 organizational bottlenecks. Recommended restructuring saved SAR 9M annually. Predicted 28% productivity increase through smart role alignment.',
      metrics: {
        bottlenecks_identified: 15,
        annual_savings: 'SAR 9M',
        productivity_increase: '28%',
        roles_optimized: 134
      }
    },
    {
      id: 'growth_prediction',
      title: isArabic ? 'توقع النمو والتوسع' : 'Growth & Expansion Prediction',
      description: isArabic ? 'تنبؤ أنماط النمو وفرص التوسع المستقبلية' : 'Predictive analysis for growth patterns and expansion opportunities',
      icon: TrendingUp,
      scenario: 'AI forecasted 45% revenue growth in next 18 months. Identified 8 new market opportunities. Recommended expansion strategy with 87% success probability.',
      metrics: {
        predicted_growth: '45%',
        market_opportunities: 8,
        success_probability: '87%',
        expansion_timeline: '18 months'
      }
    },
    {
      id: 'risk_management',
      title: isArabic ? 'إدارة المخاطر الذكية' : 'Intelligent Risk Management',
      description: isArabic ? 'تحديد وتحليل المخاطر المؤسسية بالذكاء الاصطناعي' : 'AI-powered enterprise risk identification and analysis',
      icon: Shield,
      scenario: 'Advanced AI detected 34 potential risks across operations. Implemented predictive mitigation reducing risk exposure by 67%. Real-time monitoring prevents 94% of incidents.',
      metrics: {
        risks_detected: 34,
        risk_reduction: '67%',
        incident_prevention: '94%',
        mitigation_strategies: 52
      }
    },
    {
      id: 'culture_analytics',
      title: isArabic ? 'تحليلات الثقافة المؤسسية' : 'Corporate Culture Analytics',
      description: isArabic ? 'قياس وتحسين الثقافة المؤسسية بالذكاء الاصطناعي' : 'AI-driven corporate culture measurement and enhancement',
      icon: Award,
      scenario: 'NLP analysis of 12,847 employee communications revealed culture strength of 89%. Identified 7 areas for improvement. Predicted 31% engagement increase with culture initiatives.',
      metrics: {
        communications_analyzed: '12,847',
        culture_strength: '89%',
        improvement_areas: 7,
        engagement_increase: '31%'
      }
    },
    {
      id: 'digital_transformation',
      title: isArabic ? 'التحول الرقمي الذكي' : 'Smart Digital Transformation',
      description: isArabic ? 'توجيه التحول الرقمي بالذكاء الاصطناعي' : 'AI-guided digital transformation roadmap',
      icon: Rocket,
      scenario: 'AI assessed digital maturity at 73%. Mapped transformation journey with 156 initiatives. Predicted SAR 21.75M cost savings through intelligent automation adoption.',
      metrics: {
        digital_maturity: '73%',
        transformation_initiatives: 156,
        predicted_savings: 'SAR 21.75M',
        automation_opportunities: 89
      }
    }
  ];

  const companyModules = [
    {
      title: isArabic ? 'معلومات الشركة الذكية' : 'Smart Company Information',
      description: isArabic ? 'إدارة البيانات الأساسية للشركة بالذكاء الاصطناعي' : 'AI-powered basic company data management',
      icon: Building,
      badge: 'AI Enhanced',
      aiFeatures: ['Auto-updating profiles', 'Smart data validation', 'Predictive insights']
    },
    {
      title: isArabic ? 'الهيكل التنظيمي الذكي' : 'Intelligent Org Structure',
      description: isArabic ? 'تصميم وإدارة الهيكل التنظيمي بالذكاء الاصطناعي' : 'AI-driven organizational structure design and management',
      icon: Users,
      badge: 'AI Optimized',
      aiFeatures: ['Smart role matching', 'Efficiency analysis', 'Auto-restructuring suggestions']
    },
    {
      title: isArabic ? 'الأهداف والمبادرات الذكية' : 'Smart Goals & Initiatives',
      description: isArabic ? 'تحديد وتتبع أهداف الشركة بالذكاء الاصطناعي' : 'AI-powered company objectives definition and tracking',
      icon: Target,
      badge: 'AI Tracked',
      aiFeatures: ['Goal optimization', 'Progress prediction', 'Success probability']
    },
    {
      title: isArabic ? 'الإنجازات والتقديرات الذكية' : 'Intelligent Recognition',
      description: isArabic ? 'توثيق إنجازات وتقديرات الشركة بالذكاء الاصطناعي' : 'AI-enhanced company achievements and recognition documentation',
      icon: Award,
      badge: 'AI Validated',
      aiFeatures: ['Achievement analysis', 'Impact measurement', 'Recognition patterns']
    },
    {
      title: isArabic ? 'المواقع والفروع الذكية' : 'Smart Locations & Branches',
      description: isArabic ? 'إدارة مواقع وفروع الشركة بالذكاء الاصطناعي' : 'AI-powered company locations and branches management',
      icon: MapPin,
      badge: 'AI Monitored',
      aiFeatures: ['Location optimization', 'Performance analysis', 'Expansion recommendations']
    },
    {
      title: isArabic ? 'تاريخ الشركة الذكي' : 'Intelligent Company History',
      description: isArabic ? 'معلومات تاريخية عن الشركة مع التحليل الذكي' : 'Historical company information with intelligent analysis',
      icon: Calendar,
      badge: 'AI Analyzed',
      aiFeatures: ['Pattern recognition', 'Trend analysis', 'Historical insights']
    }
  ];

  const aiStats = [
    { 
      label: isArabic ? 'الموظفين النشطين' : 'Active Employees', 
      value: '1,247', 
      color: 'text-blue-600',
      icon: Users,
      aiInsight: '+12% growth predicted',
      trend: 'up'
    },
    { 
      label: isArabic ? 'الأقسام المُحسَّنة' : 'Optimized Departments', 
      value: '12/12', 
      color: 'text-green-600',
      icon: Building2,
      aiInsight: '96% efficiency achieved',
      trend: 'stable'
    },
    { 
      label: isArabic ? 'المواقع الذكية' : 'Smart Locations', 
      value: '5', 
      color: 'text-yellow-600',
      icon: MapPin,
      aiInsight: '2 expansion opportunities',
      trend: 'up'
    },
    { 
      label: isArabic ? 'الخبرة المؤسسية' : 'Institutional Experience', 
      value: '25+', 
      color: 'text-purple-600',
      icon: Award,
      aiInsight: 'Knowledge base: 89% captured',
      trend: 'up'
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-7xl" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="flex flex-col space-y-2">
        <div className="flex items-center gap-3">
          <Brain className="h-8 w-8 text-primary animate-pulse" />
          <div>
            <h1 className="text-3xl font-bold">
              {isArabic ? 'ذكاء الشركة المؤسسي' : 'Corporate Intelligence Hub'}
            </h1>
            <p className="text-muted-foreground">
              {isArabic 
                ? 'نظام ذكي شامل لإدارة وتحليل معلومات الشركة بالذكاء الاصطناعي'
                : 'AI-powered comprehensive system for corporate information management and analysis'
              }
            </p>
          </div>
        </div>
      </div>

      {/* AI Intelligence Dashboard */}
      <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            {isArabic ? 'لوحة الذكاء المؤسسي' : 'Corporate AI Intelligence Dashboard'}
          </CardTitle>
          <CardDescription>
            {isArabic ? 'رؤى ذكية في الوقت الفعلي عن أداء الشركة' : 'Real-time intelligent insights about company performance'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {aiInsights.orgOptimization.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Org Optimization</div>
              <Progress value={aiInsights.orgOptimization} className="mt-2 h-2" />
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {aiInsights.strategicAlignment.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Strategic Alignment</div>
              <Progress value={aiInsights.strategicAlignment} className="mt-2 h-2" />
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {aiInsights.riskPrediction.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Risk Prediction</div>
              <Progress value={aiInsights.riskPrediction} className="mt-2 h-2" />
            </div>
            <div className="text-center p-4 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {aiInsights.growthPotential.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Growth Potential</div>
              <Progress value={aiInsights.growthPotential} className="mt-2 h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {aiStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-all group">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center gap-2">
                    <stat.icon className="h-5 w-5 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  <div className="flex items-center gap-1">
                    <TrendingUp className={`h-3 w-3 ${stat.trend === 'up' ? 'text-green-500' : 'text-blue-500'}`} />
                    <p className="text-xs text-muted-foreground">{stat.aiInsight}</p>
                  </div>
                </div>
                <Sparkles className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Scenarios Tabs */}
      <Tabs value={activeScenario} onValueChange={setActiveScenario}>
        <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="strategic_planning">Strategy</TabsTrigger>
          <TabsTrigger value="org_intelligence">Structure</TabsTrigger>
          <TabsTrigger value="growth_prediction">Growth</TabsTrigger>
          <TabsTrigger value="risk_management">Risk</TabsTrigger>
          <TabsTrigger value="culture_analytics">Culture</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* AI-Enhanced Company Modules */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companyModules.map((module, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow group">
                <CardHeader className="space-y-1">
                  <div className="flex items-center justify-between">
                    <module.icon className="h-8 w-8 text-primary" />
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                      {module.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{module.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <CardDescription className="text-sm leading-relaxed">
                    {module.description}
                  </CardDescription>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      AI Features:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {module.aiFeatures.map((feature, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {aiScenarios.map((scenario) => (
          <TabsContent key={scenario.id} value={scenario.id} className="space-y-6">
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <scenario.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{scenario.title}</CardTitle>
                      <CardDescription>{scenario.description}</CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/30">
                  <Brain className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800 dark:text-blue-200">
                    <strong>AI Scenario Analysis:</strong> {scenario.scenario}
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(scenario.metrics).map(([key, value]) => (
                    <div key={key} className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{value}</div>
                      <div className="text-sm text-muted-foreground capitalize">
                        {key.replace(/_/g, ' ')}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <Button className="flex-1">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Implement AI Recommendations
                  </Button>
                  <Button variant="outline">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Detailed Analysis
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
      
      <AqlHRAIAssistant moduleContext="company.intelligence" />
      
      {/* AI Integration for Company Management */}
      <UniversalAIIntegrator 
        pageType="general" 
        moduleName="company-management" 
        companyId="demo-company" 
        enabledFeatures={['organizational-insights', 'company-analytics', 'strategic-planning']}
      />
    </div>
  );
};

export default Company;