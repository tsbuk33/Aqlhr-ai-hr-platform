import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Clock, Activity, TrendingUp, Pause, Play, Timer } from 'lucide-react';

interface TimeUtilizationAnalysisProps {
  screenSize: 'mobile' | 'tablet' | 'desktop';
}

export const TimeUtilizationAnalysis: React.FC<TimeUtilizationAnalysisProps> = ({ screenSize }) => {
  const { t } = useTranslation();

  // Dummy time utilization data
  const dailyTimeBreakdown = [
    { activity: 'Productive Work', hours: 6.2, percentage: 77.5, color: '#22c55e' },
    { activity: 'Meetings', hours: 1.8, percentage: 22.5, color: '#3b82f6' },
    { activity: 'Breaks', hours: 0.8, percentage: 10, color: '#f59e0b' },
    { activity: 'Admin Tasks', hours: 0.6, percentage: 7.5, color: '#8b5cf6' },
    { activity: 'Training', hours: 0.4, percentage: 5, color: '#ef4444' },
    { activity: 'Idle Time', hours: 0.2, percentage: 2.5, color: '#6b7280' }
  ];

  const weeklyTrend = [
    { day: 'Mon', productive: 7.2, meetings: 1.5, breaks: 0.8, admin: 0.5 },
    { day: 'Tue', productive: 6.8, meetings: 2.0, breaks: 0.7, admin: 0.5 },
    { day: 'Wed', productive: 6.5, meetings: 2.2, breaks: 0.8, admin: 0.5 },
    { day: 'Thu', productive: 7.0, meetings: 1.8, breaks: 0.7, admin: 0.5 },
    { day: 'Fri', productive: 5.9, meetings: 2.5, breaks: 1.0, admin: 0.6 },
    { day: 'Sat', productive: 4.2, meetings: 1.0, breaks: 0.5, admin: 0.3 },
    { day: 'Sun', productive: 3.8, meetings: 0.8, breaks: 0.4, admin: 0.2 }
  ];

  const teamTimeUtilization = [
    { team: 'Engineering', productive: 78, meetings: 15, admin: 7, efficiency: 85 },
    { team: 'Sales', productive: 65, meetings: 25, admin: 10, efficiency: 82 },
    { team: 'Marketing', productive: 70, meetings: 20, admin: 10, efficiency: 79 },
    { team: 'Support', productive: 82, meetings: 12, admin: 6, efficiency: 88 },
    { team: 'HR', productive: 68, meetings: 22, admin: 10, efficiency: 75 }
  ];

  const hourlyProductivity = [
    { hour: '8AM', productivity: 65, focus: 70 },
    { hour: '9AM', productivity: 78, focus: 82 },
    { hour: '10AM', productivity: 92, focus: 95 },
    { hour: '11AM', productivity: 95, focus: 97 },
    { hour: '12PM', productivity: 88, focus: 85 },
    { hour: '1PM', productivity: 72, focus: 68 },
    { hour: '2PM', productivity: 85, focus: 88 },
    { hour: '3PM', productivity: 90, focus: 92 },
    { hour: '4PM', productivity: 88, focus: 90 },
    { hour: '5PM', productivity: 75, focus: 78 }
  ];

  const timeWasters = [
    { category: 'Unnecessary Meetings', time: 2.5, impact: 'high' },
    { category: 'Email Overload', time: 1.8, impact: 'medium' },
    { category: 'System Delays', time: 1.2, impact: 'medium' },
    { category: 'Context Switching', time: 1.0, impact: 'high' },
    { category: 'Social Media', time: 0.5, impact: 'low' }
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 85) return 'text-green-600';
    if (efficiency >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Time Utilization Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">{t('analytics.productive_time')}</p>
                <p className="text-xl font-bold text-green-600">6.2h</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">{t('analytics.meeting_time')}</p>
                <p className="text-xl font-bold text-blue-600">1.8h</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Timer className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">{t('analytics.efficiency_rate')}</p>
                <p className="text-xl font-bold text-purple-600">82%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Pause className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">{t('analytics.break_time')}</p>
                <p className="text-xl font-bold text-orange-600">0.8h</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Time Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            {t('analytics.daily_time_breakdown')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className={`${screenSize === 'mobile' ? 'h-48' : 'h-64'}`}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dailyTimeBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ activity, percentage }) => `${activity}: ${percentage}%`}
                    outerRadius={screenSize === 'mobile' ? 60 : 80}
                    fill="#8884d8"
                    dataKey="hours"
                  >
                    {dailyTimeBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-3">
              {dailyTimeBreakdown.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm font-medium">{item.activity}</span>
                  </div>
                  <div className="text-right text-sm">
                    <div className="font-bold">{item.hours}h</div>
                    <div className="text-muted-foreground">{item.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Time Trend */}
      <Card>
        <CardHeader>
          <CardTitle>{t('analytics.weekly_time_utilization_trend')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`${screenSize === 'mobile' ? 'h-48' : 'h-64'}`}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyTrend}>
                <defs>
                  <linearGradient id="colorProductive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorMeetings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="productive" 
                  stackId="1"
                  stroke="#22c55e" 
                  fill="url(#colorProductive)"
                  name={t('analytics.productive_work')}
                />
                <Area 
                  type="monotone" 
                  dataKey="meetings" 
                  stackId="1"
                  stroke="#3b82f6" 
                  fill="url(#colorMeetings)"
                  name={t('analytics.meetings')}
                />
                <Area 
                  type="monotone" 
                  dataKey="breaks" 
                  stackId="1"
                  stroke="#f59e0b" 
                  fill="#f59e0b"
                  fillOpacity={0.6}
                  name={t('analytics.breaks')}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Team Time Utilization */}
      <Card>
        <CardHeader>
          <CardTitle>{t('analytics.team_time_utilization')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamTimeUtilization.map((team) => (
              <div key={team.team} className="space-y-3 p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{team.team}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {t('analytics.efficiency')}:
                    </span>
                    <span className={`font-bold ${getEfficiencyColor(team.efficiency)}`}>
                      {team.efficiency}%
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">{t('analytics.productive')}</p>
                    <Progress value={team.productive} className="h-2 mt-1" />
                    <p className="font-medium mt-1">{team.productive}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t('analytics.meetings')}</p>
                    <Progress value={team.meetings} className="h-2 mt-1" />
                    <p className="font-medium mt-1">{team.meetings}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t('analytics.admin')}</p>
                    <Progress value={team.admin} className="h-2 mt-1" />
                    <p className="font-medium mt-1">{team.admin}%</p>
                  </div>
                </div>
              </div>
            ))}
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
              <LineChart data={hourlyProductivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis domain={[60, 100]} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="productivity" 
                  stroke="#22c55e" 
                  strokeWidth={3}
                  dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                  name={t('analytics.productivity')}
                />
                <Line 
                  type="monotone" 
                  dataKey="focus" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
                  name={t('analytics.focus_level')}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Time Wasters Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>{t('analytics.time_wasters_analysis')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {timeWasters.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="font-medium">{item.category}</span>
                  <Badge className={getImpactColor(item.impact)}>
                    {item.impact} impact
                  </Badge>
                </div>
                <div className="text-right">
                  <span className="font-bold text-red-600">{item.time}h</span>
                  <p className="text-xs text-muted-foreground">per day</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Time Utilization Insights */}
      <Card>
        <CardHeader>
          <CardTitle>{t('analytics.time_utilization_insights')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-green-900">{t('analytics.peak_productivity_window')}</p>
                <p className="text-sm text-green-700">
                  {t('analytics.peak_productivity_window_insight')}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-red-900">{t('analytics.meeting_overload')}</p>
                <p className="text-sm text-red-700">
                  {t('analytics.meeting_overload_insight')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-blue-900">{t('analytics.optimization_opportunity')}</p>
                <p className="text-sm text-blue-700">
                  {t('analytics.optimization_opportunity_insight')}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};