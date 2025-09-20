import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown,
  Users, 
  Clock, 
  Target,
  Activity,
  BarChart3,
  PieChart,
  AlertCircle,
  Calendar,
  Award,
  Zap
} from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  nameAr: string;
  status: 'present' | 'absent' | 'late' | 'on_leave';
  checkInTime?: string;
  location?: string;
}

interface TeamMetric {
  id: string;
  title: string;
  titleAr: string;
  value: number;
  target?: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
  period: string;
  color: string;
}

interface TeamAnalyticsProps {
  isArabic: boolean;
  teamMembers: TeamMember[];
}

export const TeamAnalytics: React.FC<TeamAnalyticsProps> = ({ isArabic, teamMembers }) => {
  const [metrics, setMetrics] = useState<TeamMetric[]>([]);
  const [realTimeData, setRealTimeData] = useState({
    activeMembers: 0,
    productivity: 0,
    satisfaction: 0,
    efficiency: 0
  });

  useEffect(() => {
    loadTeamMetrics();
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      updateRealTimeData();
    }, 5000);

    return () => clearInterval(interval);
  }, [teamMembers]);

  const loadTeamMetrics = () => {
    const currentMetrics: TeamMetric[] = [
      {
        id: 'attendance_rate',
        title: 'Attendance Rate',
        titleAr: 'معدل الحضور',
        value: 94,
        target: 95,
        unit: '%',
        trend: 'up',
        change: 2.1,
        period: 'vs last month',
        color: 'text-green-500'
      },
      {
        id: 'productivity_score',
        title: 'Productivity Score',
        titleAr: 'نقاط الإنتاجية',
        value: 87,
        target: 90,
        unit: '/100',
        trend: 'up',
        change: 5.3,
        period: 'vs last week',
        color: 'text-blue-500'
      },
      {
        id: 'task_completion',
        title: 'Task Completion',
        titleAr: 'إنجاز المهام',
        value: 92,
        target: 95,
        unit: '%',
        trend: 'down',
        change: -1.2,
        period: 'vs last week',
        color: 'text-yellow-500'
      },
      {
        id: 'overtime_hours',
        title: 'Overtime Hours',
        titleAr: 'ساعات إضافية',
        value: 45,
        target: 40,
        unit: 'hrs',
        trend: 'up',
        change: 12.5,
        period: 'this month',
        color: 'text-red-500'
      },
      {
        id: 'satisfaction_score',
        title: 'Team Satisfaction',
        titleAr: 'رضا الفريق',
        value: 4.2,
        target: 4.5,
        unit: '/5',
        trend: 'stable',
        change: 0.1,
        period: 'vs last survey',
        color: 'text-purple-500'
      },
      {
        id: 'response_time',
        title: 'Avg Response Time',
        titleAr: 'متوسط وقت الاستجابة',
        value: 2.3,
        target: 2.0,
        unit: 'hrs',
        trend: 'down',
        change: -8.7,
        period: 'vs last month',
        color: 'text-indigo-500'
      }
    ];

    setMetrics(currentMetrics);
  };

  const updateRealTimeData = () => {
    // Simulate real-time data updates
    const presentMembers = teamMembers.filter(m => m.status === 'present').length;
    
    setRealTimeData(prev => ({
      activeMembers: presentMembers,
      productivity: Math.max(70, Math.min(100, prev.productivity + (Math.random() - 0.5) * 5)),
      satisfaction: Math.max(3.0, Math.min(5.0, prev.satisfaction + (Math.random() - 0.5) * 0.2)),
      efficiency: Math.max(60, Math.min(100, prev.efficiency + (Math.random() - 0.5) * 8))
    }));
  };

  const getTrendIcon = (trend: TeamMetric['trend']) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-3 w-3 text-red-500" />;
      case 'stable':
        return <Activity className="h-3 w-3 text-blue-500" />;
    }
  };

  const getProgressColor = (value: number, target?: number) => {
    if (!target) return 'bg-blue-500';
    
    const percentage = (value / target) * 100;
    if (percentage >= 95) return 'bg-green-500';
    if (percentage >= 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getTeamStatusSummary = () => {
    const present = teamMembers.filter(m => m.status === 'present').length;
    const absent = teamMembers.filter(m => m.status === 'absent').length;
    const late = teamMembers.filter(m => m.status === 'late').length;
    const onLeave = teamMembers.filter(m => m.status === 'on_leave').length;
    
    return { present, absent, late, onLeave, total: teamMembers.length };
  };

  const statusSummary = getTeamStatusSummary();

  return (
    <div className="space-y-4">
      {/* Real-time Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            {isArabic ? 'لوحة المعلومات المباشرة' : 'Real-time Dashboard'}
            <Badge variant="secondary" className="animate-pulse">
              {isArabic ? 'مباشر' : 'LIVE'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">
                  {isArabic ? 'الأعضاء النشطون' : 'Active Members'}
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-green-500">
                  {realTimeData.activeMembers}
                </span>
                <span className="text-sm text-muted-foreground">
                  /{statusSummary.total}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">
                  {isArabic ? 'الكفاءة المباشرة' : 'Live Efficiency'}
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-blue-500">
                  {realTimeData.efficiency.toFixed(0)}
                </span>
                <span className="text-sm text-muted-foreground">%</span>
              </div>
            </div>
          </div>

          {/* Team Status Bar */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>{isArabic ? 'حالة الفريق' : 'Team Status'}</span>
              <span>{statusSummary.present}/{statusSummary.total} {isArabic ? 'حاضر' : 'present'}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div className="h-full flex">
                <div 
                  className="bg-green-500" 
                  style={{ width: `${(statusSummary.present / statusSummary.total) * 100}%` }}
                />
                <div 
                  className="bg-yellow-500" 
                  style={{ width: `${(statusSummary.late / statusSummary.total) * 100}%` }}
                />
                <div 
                  className="bg-blue-500" 
                  style={{ width: `${(statusSummary.onLeave / statusSummary.total) * 100}%` }}
                />
                <div 
                  className="bg-red-500" 
                  style={{ width: `${(statusSummary.absent / statusSummary.total) * 100}%` }}
                />
              </div>
            </div>
            <div className="flex gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>{isArabic ? 'حاضر' : 'Present'} ({statusSummary.present})</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                <span>{isArabic ? 'متأخر' : 'Late'} ({statusSummary.late})</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                <span>{isArabic ? 'غائب' : 'Absent'} ({statusSummary.absent})</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            {isArabic ? 'مقاييس الأداء الرئيسية' : 'Key Performance Metrics'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            {metrics.map((metric) => (
              <div key={metric.id} className="p-4 border rounded-lg">
                <div className="space-y-3">
                  {/* Metric Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm">
                        {isArabic ? metric.titleAr : metric.title}
                      </h4>
                      {getTrendIcon(metric.trend)}
                    </div>
                    <div className="text-right">
                      <div className="flex items-baseline gap-1">
                        <span className={`text-lg font-bold ${metric.color}`}>
                          {metric.value}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {metric.unit}
                        </span>
                      </div>
                      {metric.target && (
                        <div className="text-xs text-muted-foreground">
                          {isArabic ? 'الهدف: ' : 'Target: '}{metric.target}{metric.unit}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {metric.target && (
                    <div className="space-y-1">
                      <Progress 
                        value={(metric.value / metric.target) * 100} 
                        className="h-2"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>0</span>
                        <span>{metric.target}{metric.unit}</span>
                      </div>
                    </div>
                  )}

                  {/* Change Indicator */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{metric.period}</span>
                    <div className={`flex items-center gap-1 ${
                      metric.change > 0 ? 'text-green-500' : metric.change < 0 ? 'text-red-500' : 'text-blue-500'
                    }`}>
                      {metric.change > 0 && '+'}
                      {metric.change.toFixed(1)}%
                      {getTrendIcon(metric.trend)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            {isArabic ? 'رؤى الأداء' : 'Performance Insights'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-800">
                  {isArabic ? 'أداء متميز' : 'Excellent Performance'}
                </span>
              </div>
              <p className="text-sm text-green-700">
                {isArabic 
                  ? 'الفريق يحقق معدل حضور 94% مع زيادة في الإنتاجية بنسبة 5.3%'
                  : 'Team achieving 94% attendance with 5.3% productivity increase'
                }
              </p>
            </div>
            
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <span className="font-medium text-yellow-800">
                  {isArabic ? 'يتطلب انتباه' : 'Needs Attention'}
                </span>
              </div>
              <p className="text-sm text-yellow-700">
                {isArabic 
                  ? 'الساعات الإضافية زادت 12.5% هذا الشهر - قد نحتاج لمراجعة توزيع العمل'
                  : 'Overtime hours increased 12.5% this month - may need workload review'
                }
              </p>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-800">
                  {isArabic ? 'فرصة تحسين' : 'Improvement Opportunity'}
                </span>
              </div>
              <p className="text-sm text-blue-700">
                {isArabic 
                  ? 'تحسين وقت الاستجابة بنسبة 8.7% - نحو هدف 2.0 ساعة'
                  : 'Response time improved by 8.7% - moving towards 2.0 hour target'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};