import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, Users, Target, Clock, Award } from 'lucide-react';

interface TeamPerformanceMetricsProps {
  screenSize: 'mobile' | 'tablet' | 'desktop';
}

export const TeamPerformanceMetrics: React.FC<TeamPerformanceMetricsProps> = ({ screenSize }) => {
  const { t } = useTranslation();

  // Dummy data for team performance
  const performanceData = [
    { team: 'Sales', performance: 92, target: 90, members: 8, trend: 'up' },
    { team: 'Marketing', performance: 88, target: 85, members: 6, trend: 'up' },
    { team: 'Engineering', performance: 94, target: 90, members: 12, trend: 'up' },
    { team: 'Support', performance: 85, target: 88, members: 5, trend: 'down' },
    { team: 'HR', performance: 91, target: 85, members: 4, trend: 'up' },
    { team: 'Finance', performance: 89, target: 90, members: 3, trend: 'stable' }
  ];

  const weeklyTrend = [
    { week: 'W1', performance: 85 },
    { week: 'W2', performance: 87 },
    { week: 'W3', performance: 89 },
    { week: 'W4', performance: 91 },
    { week: 'W5', performance: 89 },
    { week: 'W6', performance: 92 }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <div className="h-4 w-4" />;
    }
  };

  const getTrendColor = (current: number, target: number) => {
    if (current >= target) return 'text-green-600';
    if (current >= target * 0.9) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Overall Performance Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">{t('analytics.avg_performance')}</p>
                <p className="text-xl font-bold">89.8%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">{t('analytics.active_teams')}</p>
                <p className="text-xl font-bold">6</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">{t('analytics.top_performers')}</p>
                <p className="text-xl font-bold">4</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">{t('analytics.efficiency')}</p>
                <p className="text-xl font-bold">94%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Performance List */}
      <Card>
        <CardHeader>
          <CardTitle>{t('analytics.team_breakdown')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {performanceData.map((team) => (
              <div key={team.team} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{team.team}</span>
                    {getTrendIcon(team.trend)}
                    <Badge variant="outline" className="text-xs">
                      {team.members} {t('analytics.members')}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <span className={`font-bold ${getTrendColor(team.performance, team.target)}`}>
                      {team.performance}%
                    </span>
                    <span className="text-sm text-muted-foreground ml-2">
                      / {team.target}%
                    </span>
                  </div>
                </div>
                <Progress value={team.performance} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{t('analytics.performance_trend')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`${screenSize === 'mobile' ? 'h-48' : 'h-64'}`}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis domain={[80, 100]} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="performance" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  dot={{ fill: '#8884d8', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Team Comparison Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{t('analytics.team_comparison')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`${screenSize === 'mobile' ? 'h-48' : 'h-64'}`}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="team" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="performance" fill="#8884d8" />
                <Bar dataKey="target" fill="#82ca9d" opacity={0.6} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};