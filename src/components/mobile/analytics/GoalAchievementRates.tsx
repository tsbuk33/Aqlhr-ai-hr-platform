import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from 'recharts';
import { Target, TrendingUp, Award, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

interface GoalAchievementRatesProps {
  screenSize: 'mobile' | 'tablet' | 'desktop';
}

export const GoalAchievementRates: React.FC<GoalAchievementRatesProps> = ({ screenSize }) => {
  const { t } = useTranslation();

  // Dummy goal achievement data
  const goalsByStatus = [
    { name: 'Completed', value: 45, color: '#22c55e' },
    { name: 'In Progress', value: 28, color: '#3b82f6' },
    { name: 'Overdue', value: 12, color: '#ef4444' },
    { name: 'Not Started', value: 15, color: '#6b7280' }
  ];

  const monthlyAchievement = [
    { month: 'Jan', rate: 78, goals: 23 },
    { month: 'Feb', rate: 82, goals: 28 },
    { month: 'Mar', rate: 75, goals: 32 },
    { month: 'Apr', rate: 88, goals: 25 },
    { month: 'May', rate: 91, goals: 30 },
    { month: 'Jun', rate: 94, goals: 27 }
  ];

  const teamGoals = [
    { 
      team: 'Sales', 
      completed: 18, 
      total: 20, 
      rate: 90, 
      trend: 'up',
      priority: 'high'
    },
    { 
      team: 'Marketing', 
      completed: 14, 
      total: 18, 
      rate: 78, 
      trend: 'stable',
      priority: 'medium'
    },
    { 
      team: 'Engineering', 
      completed: 22, 
      total: 25, 
      rate: 88, 
      trend: 'up',
      priority: 'high'
    },
    { 
      team: 'Support', 
      completed: 11, 
      total: 15, 
      rate: 73, 
      trend: 'down',
      priority: 'low'
    },
    { 
      team: 'HR', 
      completed: 8, 
      total: 10, 
      rate: 80, 
      trend: 'up',
      priority: 'medium'
    }
  ];

  const goalCategories = [
    { category: 'Revenue', achieved: 92, target: 100, color: '#22c55e' },
    { category: 'Customer Satisfaction', achieved: 87, target: 90, color: '#3b82f6' },
    { category: 'Process Improvement', achieved: 78, target: 85, color: '#f59e0b' },
    { category: 'Team Development', achieved: 95, target: 80, color: '#8b5cf6' },
    { category: 'Innovation', achieved: 82, target: 90, color: '#ef4444' }
  ];

  const upcomingDeadlines = [
    { goal: 'Q2 Sales Target', deadline: '3 days', progress: 85, priority: 'high' },
    { goal: 'Product Launch', deadline: '1 week', progress: 72, priority: 'high' },
    { goal: 'Training Program', deadline: '2 weeks', progress: 45, priority: 'medium' },
    { goal: 'System Upgrade', deadline: '1 month', progress: 30, priority: 'low' }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <div className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 90) return 'text-green-600';
    if (progress >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Goal Achievement Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">{t('analytics.total_goals')}</p>
                <p className="text-xl font-bold">100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">{t('analytics.completed')}</p>
                <p className="text-xl font-bold text-green-600">45</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">{t('analytics.in_progress')}</p>
                <p className="text-xl font-bold text-yellow-600">28</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">{t('analytics.success_rate')}</p>
                <p className="text-xl font-bold text-purple-600">87%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goals by Status */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('analytics.goals_by_status')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`${screenSize === 'mobile' ? 'h-48' : 'h-64'}`}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={goalsByStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={screenSize === 'mobile' ? 60 : 80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {goalsByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('analytics.monthly_achievement_trend')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`${screenSize === 'mobile' ? 'h-48' : 'h-64'}`}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyAchievement}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[70, 100]} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="rate" 
                    stroke="#22c55e" 
                    strokeWidth={3}
                    dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                    name={t('analytics.achievement_rate')}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Goal Performance */}
      <Card>
        <CardHeader>
          <CardTitle>{t('analytics.team_goal_performance')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamGoals.map((team) => (
              <div key={team.team} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{team.team}</span>
                    {getTrendIcon(team.trend)}
                    <Badge className={getPriorityColor(team.priority)}>
                      {team.priority}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <span className={`font-bold ${getProgressColor(team.rate)}`}>
                      {team.completed}/{team.total}
                    </span>
                    <span className="text-sm text-muted-foreground ml-2">
                      ({team.rate}%)
                    </span>
                  </div>
                </div>
                <Progress value={team.rate} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Goal Categories */}
      <Card>
        <CardHeader>
          <CardTitle>{t('analytics.goal_categories_performance')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`${screenSize === 'mobile' ? 'h-48' : 'h-64'}`}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={goalCategories}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="achieved" fill="#22c55e" name={t('analytics.achieved')} />
                <Bar dataKey="target" fill="#e5e7eb" name={t('analytics.target')} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Deadlines */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            {t('analytics.upcoming_deadlines')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingDeadlines.map((item, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{item.goal}</span>
                    <Badge className={getPriorityColor(item.priority)}>
                      {item.priority}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {item.deadline}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={item.progress} className="flex-1 h-2" />
                  <span className={`text-sm font-medium ${getProgressColor(item.progress)}`}>
                    {item.progress}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Goal Insights */}
      <Card>
        <CardHeader>
          <CardTitle>{t('analytics.goal_insights')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-green-900">{t('analytics.high_performing_teams')}</p>
                <p className="text-sm text-green-700">
                  {t('analytics.high_performing_teams_insight')}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-yellow-900">{t('analytics.attention_needed')}</p>
                <p className="text-sm text-yellow-700">
                  {t('analytics.attention_needed_insight')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-blue-900">{t('analytics.achievement_trend')}</p>
                <p className="text-sm text-blue-700">
                  {t('analytics.achievement_trend_insight')}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};