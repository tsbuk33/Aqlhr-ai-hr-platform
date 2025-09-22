import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BarChart3,
  Calendar,
  TrendingUp,
  Target,
  Users,
  Clock,
  Award,
  Star,
  CheckSquare,
  Smartphone,
  Tablet,
  Monitor
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

// Mobile Analytics Components
import { TeamPerformanceMetrics } from '@/components/mobile/analytics/TeamPerformanceMetrics';
import { AttendancePatternAnalysis } from '@/components/mobile/analytics/AttendancePatternAnalysis';
import { ProductivityTrends } from '@/components/mobile/analytics/ProductivityTrends';
import { GoalAchievementRates } from '@/components/mobile/analytics/GoalAchievementRates';
import { WorkloadDistribution } from '@/components/mobile/analytics/WorkloadDistribution';
import { TimeUtilizationAnalysis } from '@/components/mobile/analytics/TimeUtilizationAnalysis';
import { TeamEngagementScores } from '@/components/mobile/analytics/TeamEngagementScores';
import { TopPerformerIdentification } from '@/components/mobile/analytics/TopPerformerIdentification';
import { ActionItemRecommendations } from '@/components/mobile/analytics/ActionItemRecommendations';

const TeamAnalyticsMobile: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('performance');
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

  const analyticsFeatures = [
    {
      id: 'performance',
      title: t('analytics.team_performance_metrics'),
      icon: BarChart3,
      component: TeamPerformanceMetrics,
      color: 'bg-blue-500'
    },
    {
      id: 'attendance',
      title: t('analytics.attendance_pattern_analysis'),
      icon: Calendar,
      component: AttendancePatternAnalysis,
      color: 'bg-green-500'
    },
    {
      id: 'productivity', 
      title: t('analytics.productivity_trends'),
      icon: TrendingUp,
      component: ProductivityTrends,
      color: 'bg-purple-500'
    },
    {
      id: 'goals',
      title: t('analytics.goal_achievement_rates'),
      icon: Target,
      component: GoalAchievementRates,
      color: 'bg-orange-500'
    },
    {
      id: 'workload',
      title: t('analytics.workload_distribution'),
      icon: Users,
      component: WorkloadDistribution,
      color: 'bg-indigo-500'
    },
    {
      id: 'time',
      title: t('analytics.time_utilization_analysis'),
      icon: Clock,
      component: TimeUtilizationAnalysis,
      color: 'bg-yellow-500'
    },
    {
      id: 'engagement',
      title: t('analytics.team_engagement_scores'),
      icon: Award,
      component: TeamEngagementScores,
      color: 'bg-pink-500'
    },
    {
      id: 'performers',
      title: t('analytics.top_performer_identification'),
      icon: Star,
      component: TopPerformerIdentification,
      color: 'bg-emerald-500'
    },
    {
      id: 'actions',
      title: t('analytics.action_item_recommendations'),
      icon: CheckSquare,
      component: ActionItemRecommendations,
      color: 'bg-red-500'
    }
  ];

  const getScreenIcon = () => {
    switch (screenSize) {
      case 'mobile': return <Smartphone className="h-4 w-4" />;
      case 'tablet': return <Tablet className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {t('analytics.team_analytics_mobile')}
            </h1>
            <p className="text-muted-foreground mt-1">
              {t('analytics.comprehensive_mobile_insights')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              {getScreenIcon()}
              <span className="capitalize">{screenSize}</span>
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">{t('analytics.active_teams')}</p>
                  <p className="text-xl font-bold">12</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">{t('analytics.avg_performance')}</p>
                  <p className="text-xl font-bold">87%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm text-muted-foreground">{t('analytics.goals_achieved')}</p>
                  <p className="text-xl font-bold">94%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm text-muted-foreground">{t('analytics.engagement_score')}</p>
                  <p className="text-xl font-bold">4.6/5</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Mobile-Optimized Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className={`grid w-full ${screenSize === 'mobile' ? 'grid-cols-3' : 'grid-cols-5'} mb-6`}>
          {analyticsFeatures.slice(0, screenSize === 'mobile' ? 3 : 5).map((feature) => {
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
            {analyticsFeatures.slice(3).map((feature) => {
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
                </Button>
              );
            })}
          </div>
        )}

        {/* Analytics Content */}
        {analyticsFeatures.map((feature) => {
          const Component = feature.component;
          return (
            <TabsContent key={feature.id} value={feature.id} className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <feature.icon className="h-5 w-5" />
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Component screenSize={screenSize} />
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
};

export default TeamAnalyticsMobile;