import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar } from 'recharts';
import { Heart, TrendingUp, Users, Star, MessageCircle, Award } from 'lucide-react';

interface TeamEngagementScoresProps {
  screenSize: 'mobile' | 'tablet' | 'desktop';
}

export const TeamEngagementScores: React.FC<TeamEngagementScoresProps> = ({ screenSize }) => {
  const { t } = useTranslation();

  // Dummy engagement data
  const engagementTrend = [
    { month: 'Jan', score: 7.2, satisfaction: 78, retention: 85 },
    { month: 'Feb', score: 7.5, satisfaction: 82, retention: 87 },
    { month: 'Mar', score: 7.1, satisfaction: 79, retention: 83 },
    { month: 'Apr', score: 7.8, satisfaction: 85, retention: 89 },
    { month: 'May', score: 8.2, satisfaction: 88, retention: 91 },
    { month: 'Jun', score: 8.5, satisfaction: 91, retention: 94 }
  ];

  const teamEngagement = [
    { 
      team: 'Engineering', 
      score: 8.7, 
      satisfaction: 92, 
      collaboration: 89,
      growth: 85,
      recognition: 88,
      trend: 'up'
    },
    { 
      team: 'Sales', 
      score: 8.2, 
      satisfaction: 87, 
      collaboration: 91,
      growth: 82,
      recognition: 85,
      trend: 'up'
    },
    { 
      team: 'Marketing', 
      score: 7.9, 
      satisfaction: 84, 
      collaboration: 86,
      growth: 79,
      recognition: 82,
      trend: 'stable'
    },
    { 
      team: 'Support', 
      score: 7.5, 
      satisfaction: 81, 
      collaboration: 83,
      growth: 76,
      recognition: 78,
      trend: 'down'
    },
    { 
      team: 'HR', 
      score: 8.1, 
      satisfaction: 86, 
      collaboration: 88,
      growth: 81,
      recognition: 84,
      trend: 'up'
    }
  ];

  const engagementFactors = [
    { factor: 'Job Satisfaction', score: 87, fullMark: 100 },
    { factor: 'Work-Life Balance', score: 82, fullMark: 100 },
    { factor: 'Career Growth', score: 79, fullMark: 100 },
    { factor: 'Recognition', score: 84, fullMark: 100 },
    { factor: 'Team Collaboration', score: 88, fullMark: 100 },
    { factor: 'Leadership Trust', score: 86, fullMark: 100 }
  ];

  const feedbackSentiment = [
    { category: 'Very Positive', count: 45, percentage: 35 },
    { category: 'Positive', count: 38, percentage: 30 },
    { category: 'Neutral', count: 25, percentage: 20 },
    { category: 'Negative', count: 12, percentage: 10 },
    { category: 'Very Negative', count: 8, percentage: 5 }
  ];

  const engagementDrivers = [
    { driver: 'Clear Communication', impact: 92, priority: 'high' },
    { driver: 'Fair Compensation', impact: 89, priority: 'high' },
    { driver: 'Growth Opportunities', impact: 85, priority: 'medium' },
    { driver: 'Flexible Schedule', impact: 83, priority: 'medium' },
    { driver: 'Team Events', impact: 76, priority: 'low' },
    { driver: 'Office Environment', impact: 72, priority: 'low' }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
      default: return <div className="h-4 w-4" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8.5) return 'text-green-600';
    if (score >= 7.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSentimentColor = (category: string) => {
    switch (category) {
      case 'Very Positive': return '#22c55e';
      case 'Positive': return '#84cc16';
      case 'Neutral': return '#eab308';
      case 'Negative': return '#f97316';
      case 'Very Negative': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div className="space-y-6">
      {/* Engagement Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">{t('analytics.overall_engagement')}</p>
                <p className="text-xl font-bold text-red-600">8.3/10</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">{t('analytics.satisfaction_rate')}</p>
                <p className="text-xl font-bold text-yellow-600">87%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">{t('analytics.retention_rate')}</p>
                <p className="text-xl font-bold text-blue-600">91%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">{t('analytics.feedback_score')}</p>
                <p className="text-xl font-bold text-green-600">4.3/5</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Engagement Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {t('analytics.engagement_trend_over_time')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`${screenSize === 'mobile' ? 'h-48' : 'h-64'}`}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={engagementTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[6, 10]} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#ef4444" 
                  strokeWidth={3}
                  dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                  name={t('analytics.engagement_score')}
                />
                <Line 
                  type="monotone" 
                  dataKey="satisfaction" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
                  name={t('analytics.satisfaction')}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Team Engagement Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>{t('analytics.team_engagement_breakdown')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamEngagement.map((team) => (
              <div key={team.team} className="space-y-3 p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{team.team}</span>
                    {getTrendIcon(team.trend)}
                  </div>
                  <div className="text-right">
                    <span className={`text-lg font-bold ${getScoreColor(team.score)}`}>
                      {team.score}/10
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">{t('analytics.satisfaction')}</p>
                    <Progress value={team.satisfaction} className="h-2 mt-1" />
                    <p className="font-medium mt-1">{team.satisfaction}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t('analytics.collaboration')}</p>
                    <Progress value={team.collaboration} className="h-2 mt-1" />
                    <p className="font-medium mt-1">{team.collaboration}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t('analytics.growth')}</p>
                    <Progress value={team.growth} className="h-2 mt-1" />
                    <p className="font-medium mt-1">{team.growth}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t('analytics.recognition')}</p>
                    <Progress value={team.recognition} className="h-2 mt-1" />
                    <p className="font-medium mt-1">{team.recognition}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Engagement Factors Radar */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('analytics.engagement_factors_analysis')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`${screenSize === 'mobile' ? 'h-48' : 'h-64'}`}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={engagementFactors}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="factor" tick={{ fontSize: 12 }} />
                  <PolarRadiusAxis domain={[0, 100]} />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke="#ef4444"
                    fill="#ef4444"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('analytics.feedback_sentiment_analysis')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {feedbackSentiment.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: getSentimentColor(item.category) }}
                    />
                    <span className="text-sm font-medium">{item.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div 
                      className="h-2 rounded"
                      style={{ 
                        width: `${item.percentage * 2}px`,
                        backgroundColor: getSentimentColor(item.category)
                      }}
                    />
                    <span className="text-sm font-bold min-w-[3rem]">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Engagement Drivers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            {t('analytics.key_engagement_drivers')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {engagementDrivers.map((driver, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="font-medium">{driver.driver}</span>
                  <Badge className={getPriorityColor(driver.priority)}>
                    {driver.priority}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={driver.impact} className="w-20 h-2" />
                  <span className="font-bold min-w-[3rem]">{driver.impact}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Engagement Action Items */}
      <Card>
        <CardHeader>
          <CardTitle>{t('analytics.engagement_insights')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-green-900">{t('analytics.positive_engagement_trend')}</p>
                <p className="text-sm text-green-700">
                  {t('analytics.positive_engagement_trend_insight')}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-yellow-900">{t('analytics.focus_areas')}</p>
                <p className="text-sm text-yellow-700">
                  {t('analytics.focus_areas_insight')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-blue-900">{t('analytics.engagement_opportunities')}</p>
                <p className="text-sm text-blue-700">
                  {t('analytics.engagement_opportunities_insight')}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};