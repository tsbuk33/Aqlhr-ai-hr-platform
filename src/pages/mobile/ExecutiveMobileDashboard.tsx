import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Crown,
  TrendingUp,
  Building2,
  Globe,
  DollarSign,
  Target,
  AlertTriangle,
  Gem,
  Shield,
  BarChart3,
  Brain,
  Eye,
  Zap,
  Smartphone,
  Tablet,
  Monitor
} from 'lucide-react';

// Executive Mobile Components
import { StrategicKPIWidgets } from '@/components/mobile/executive/StrategicKPIWidgets';
import { AIPoweredInsights } from '@/components/mobile/executive/AIPoweredInsights';
import { PredictiveAnalyticsVisualization } from '@/components/mobile/executive/PredictiveAnalyticsVisualization';
import { CrossCompanyPerformance } from '@/components/mobile/executive/CrossCompanyPerformance';
import { GeographicPerformanceDistribution } from '@/components/mobile/executive/GeographicPerformanceDistribution';
import { FinancialPerformanceMetrics } from '@/components/mobile/executive/FinancialPerformanceMetrics';
import { StrategicGoalProgress } from '@/components/mobile/executive/StrategicGoalProgress';
import { RiskAssessmentDashboard } from '@/components/mobile/executive/RiskAssessmentDashboard';
import { WorkforceForecasting } from '@/components/mobile/executive/WorkforceForecasting';
import { ComplianceRiskMatrix } from '@/components/mobile/executive/ComplianceRiskMatrix';

const ExecutiveMobileDashboard: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('kpis');
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');

  // Detect screen size for responsive design
  useEffect(() => {
    const detectScreenSize = () => {
      const width = window.innerWidth;
      if (width < 768) setScreenSize('mobile');
      else if (width < 1024) setScreenSize('tablet');
      else setScreenSize('desktop');
    };

    detectScreenSize();
    window.addEventListener('resize', detectScreenSize);
    return () => window.removeEventListener('resize', detectScreenSize);
  }, []);

  const executiveFeatures = [
    {
      id: 'kpis',
      title: t('executive.strategic_kpi_widgets'),
      icon: BarChart3,
      component: StrategicKPIWidgets,
      color: 'bg-blue-500',
      priority: 'critical'
    },
    {
      id: 'ai-insights',
      title: t('executive.ai_powered_insights'),
      icon: Brain,
      component: AIPoweredInsights,
      color: 'bg-purple-500',
      priority: 'high'
    },
    {
      id: 'predictive',
      title: t('executive.predictive_analytics'),
      icon: Gem,
      component: PredictiveAnalyticsVisualization,
      color: 'bg-indigo-500',
      priority: 'high'
    },
    {
      id: 'cross-company',
      title: t('executive.cross_company_performance'),
      icon: Building2,
      component: CrossCompanyPerformance,
      color: 'bg-emerald-500',
      priority: 'medium'
    },
    {
      id: 'geographic',
      title: t('executive.geographic_performance'),
      icon: Globe,
      component: GeographicPerformanceDistribution,
      color: 'bg-cyan-500',
      priority: 'medium'
    },
    {
      id: 'financial',
      title: t('executive.financial_performance'),
      icon: DollarSign,
      component: FinancialPerformanceMetrics,
      color: 'bg-green-500',
      priority: 'critical'
    },
    {
      id: 'goals',
      title: t('executive.strategic_goal_progress'),
      icon: Target,
      component: StrategicGoalProgress,
      color: 'bg-orange-500',
      priority: 'high'
    },
    {
      id: 'risk',
      title: t('executive.risk_assessment'),
      icon: AlertTriangle,
      component: RiskAssessmentDashboard,
      color: 'bg-red-500',
      priority: 'critical'
    },
    {
      id: 'forecasting',
      title: t('executive.workforce_forecasting'),
      icon: TrendingUp,
      component: WorkforceForecasting,
      color: 'bg-yellow-500',
      priority: 'high'
    },
    {
      id: 'compliance',
      title: t('executive.compliance_risk_matrix'),
      icon: Shield,
      component: ComplianceRiskMatrix,
      color: 'bg-pink-500',
      priority: 'critical'
    }
  ];

  const getScreenIcon = () => {
    switch (screenSize) {
      case 'mobile': return <Smartphone className="h-4 w-4" />;
      case 'tablet': return <Tablet className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      {/* Executive Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary via-accent to-secondary rounded-xl flex items-center justify-center">
              <Crown className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                {t('executive.mobile_dashboard')}
              </h1>
              <p className="text-muted-foreground mt-1">
                {t('executive.c_level_intelligence_center')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              {getScreenIcon()}
              <span className="capitalize">{screenSize}</span>
            </Badge>
            <Badge className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
              C-LEVEL
            </Badge>
          </div>
        </div>

        {/* Executive Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">{t('executive.revenue_growth')}</p>
                  <p className="text-xl font-bold text-green-600">+18.5%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">{t('executive.productivity_index')}</p>
                  <p className="text-xl font-bold text-blue-600">94.2</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm text-muted-foreground">{t('executive.risk_level')}</p>
                  <p className="text-xl font-bold text-orange-600">LOW</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm text-muted-foreground">{t('executive.ai_insights')}</p>
                  <p className="text-xl font-bold text-purple-600">47</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Executive Intelligence Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className={`grid w-full ${screenSize === 'mobile' ? 'grid-cols-3' : 'grid-cols-5'} mb-6`}>
          {executiveFeatures.slice(0, screenSize === 'mobile' ? 3 : 5).map((feature) => {
            const Icon = feature.icon;
            return (
              <TabsTrigger 
                key={feature.id} 
                value={feature.id}
                className="flex items-center gap-1 text-xs md:text-sm"
              >
                <Icon className="h-4 w-4" />
                <span className="hidden md:inline">{feature.title}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* Additional tabs for mobile (swipeable) */}
        {screenSize === 'mobile' && (
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {executiveFeatures.slice(3).map((feature) => {
              const Icon = feature.icon;
              return (
                <Button
                  key={feature.id}
                  variant={activeTab === feature.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveTab(feature.id)}
                  className="flex items-center gap-2 whitespace-nowrap"
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-xs">{feature.title}</span>
                  <Badge 
                    className={`ml-1 text-xs ${getPriorityColor(feature.priority)} text-white`}
                  >
                    {feature.priority.toUpperCase()}
                  </Badge>
                </Button>
              );
            })}
          </div>
        )}

        {/* Executive Content */}
        {executiveFeatures.map((feature) => {
          const Component = feature.component;
          return (
            <TabsContent key={feature.id} value={feature.id} className="mt-0">
              <Card className="border-2 border-primary/20">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
                  <CardTitle className="flex items-center gap-2">
                    <feature.icon className="h-5 w-5" />
                    {feature.title}
                    <Badge 
                      className={`ml-auto text-xs ${getPriorityColor(feature.priority)} text-white`}
                    >
                      {feature.priority.toUpperCase()}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <Component screenSize={screenSize} />
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>

      {/* AI Assistant Quick Access */}
      <div className="fixed bottom-4 right-4">
        <Button
          size="lg"
          className="rounded-full w-14 h-14 shadow-lg bg-gradient-to-r from-primary to-accent hover:from-primary/80 hover:to-accent/80"
        >
          <Zap className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default ExecutiveMobileDashboard;