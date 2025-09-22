import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area, BarChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, Activity, Target, Clock, Zap } from 'lucide-react';

interface ProductivityTrendsProps {
  screenSize: 'mobile' | 'tablet' | 'desktop';
}

export const ProductivityTrends: React.FC<ProductivityTrendsProps> = ({ screenSize }) => {
  const { t } = useTranslation();

  // Dummy productivity data
  const productivityTrend = [
    { week: 'W1', productivity: 78, efficiency: 82, output: 85 },
    { week: 'W2', productivity: 82, efficiency: 85, output: 88 },
    { week: 'W3', productivity: 79, efficiency: 83, output: 86 },
    { week: 'W4', productivity: 88, efficiency: 90, output: 92 },
    { week: 'W5', productivity: 85, efficiency: 87, output: 89 },
    { week: 'W6', productivity: 91, efficiency: 93, output: 95 }
  ];

  const hourlyProductivity = [
    { hour: '8AM', productivity: 65 },
    { hour: '9AM', productivity: 78 },
    { hour: '10AM', productivity: 92 },
    { hour: '11AM', productivity: 95 },
    { hour: '12PM', productivity: 88 },
    { hour: '1PM', productivity: 72 },
    { hour: '2PM', productivity: 85 },
    { hour: '3PM', productivity: 90 },
    { hour: '4PM', productivity: 88 },
    { hour: '5PM', productivity: 75 }
  ];

  const teamProductivity = [
    { team: 'Engineering', current: 94, previous: 89, trend: 'up', tasks: 127 },
    { team: 'Sales', current: 91, previous: 88, trend: 'up', tasks: 89 },
    { team: 'Marketing', current: 87, previous: 90, trend: 'down', tasks: 76 },
    { team: 'Support', current: 89, previous: 85, trend: 'up', tasks: 142 },
    { team: 'HR', current: 85, previous: 83, trend: 'up', tasks: 45 }
  ];

  const productivityFactors = [
    { factor: 'Task Completion Rate', impact: 92, color: '#22c55e' },
    { factor: 'Time Management', impact: 88, color: '#3b82f6' },
    { factor: 'Collaboration', impact: 85, color: '#f59e0b' },
    { factor: 'Resource Availability', impact: 91, color: '#8b5cf6' },
    { factor: 'Work Environment', impact: 87, color: '#ef4444' }
  ];

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (current < previous) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <div className="h-4 w-4" />;
  };

  const getTrendColor = (current: number, previous: number) => {
    if (current > previous) return 'text-green-600';
    if (current < previous) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Productivity Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">{t('analytics.overall_productivity')}</p>
                <p className="text-xl font-bold text-blue-600">87%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">{t('analytics.efficiency_rate')}</p>
                <p className="text-xl font-bold text-yellow-600">92%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">{t('analytics.output_quality')}</p>
                <p className="text-xl font-bold text-green-600">89%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">{t('analytics.time_utilization')}</p>
                <p className="text-xl font-bold text-purple-600">94%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Productivity Trend Over Time */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {t('analytics.productivity_trends_over_time')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`${screenSize === 'mobile' ? 'h-48' : 'h-64'}`}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={productivityTrend}>
                <defs>
                  <linearGradient id="colorProductivity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorEfficiency" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis domain={[70, 100]} />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="productivity" 
                  stroke="#3b82f6" 
                  fillOpacity={1} 
                  fill="url(#colorProductivity)"
                  strokeWidth={2}
                  name={t('analytics.productivity')}
                />
                <Area 
                  type="monotone" 
                  dataKey="efficiency" 
                  stroke="#22c55e" 
                  fillOpacity={1} 
                  fill="url(#colorEfficiency)"
                  strokeWidth={2}
                  name={t('analytics.efficiency')}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Hourly Productivity Pattern */}
      <Card>
        <CardHeader>
          <CardTitle>{t('analytics.hourly_productivity_pattern')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`${screenSize === 'mobile' ? 'h-48' : 'h-64'}`}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyProductivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis domain={[60, 100]} />
                <Tooltip />
                <Bar 
                  dataKey="productivity" 
                  fill="#8b5cf6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Team Productivity Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>{t('analytics.team_productivity_breakdown')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamProductivity.map((team) => (
              <div key={team.team} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{team.team}</span>
                    {getTrendIcon(team.current, team.previous)}
                    <Badge variant="outline" className="text-xs">
                      {team.tasks} {t('analytics.tasks')}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <span className={`font-bold ${getTrendColor(team.current, team.previous)}`}>
                      {team.current}%
                    </span>
                    <span className="text-sm text-muted-foreground ml-2">
                      ({team.current - team.previous > 0 ? '+' : ''}{team.current - team.previous}%)
                    </span>
                  </div>
                </div>
                <Progress value={team.current} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Productivity Factors */}
      <Card>
        <CardHeader>
          <CardTitle>{t('analytics.productivity_factors')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {productivityFactors.map((factor, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{factor.factor}</span>
                  <span className="text-sm font-bold">{factor.impact}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${factor.impact}%`,
                      backgroundColor: factor.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Productivity Insights */}
      <Card>
        <CardHeader>
          <CardTitle>{t('analytics.productivity_insights')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-green-900">{t('analytics.peak_productivity_hours')}</p>
                <p className="text-sm text-green-700">
                  {t('analytics.peak_productivity_insight')}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-blue-900">{t('analytics.improvement_trend')}</p>
                <p className="text-sm text-blue-700">
                  {t('analytics.improvement_trend_insight')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-purple-900">{t('analytics.collaboration_impact')}</p>
                <p className="text-sm text-purple-700">
                  {t('analytics.collaboration_impact_insight')}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};