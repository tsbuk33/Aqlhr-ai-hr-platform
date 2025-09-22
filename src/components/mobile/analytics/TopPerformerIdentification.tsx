import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Star, Trophy, TrendingUp, Award, Target, Zap } from 'lucide-react';

interface TopPerformerIdentificationProps {
  screenSize: 'mobile' | 'tablet' | 'desktop';
}

export const TopPerformerIdentification: React.FC<TopPerformerIdentificationProps> = ({ screenSize }) => {
  const { t } = useTranslation();

  // Dummy top performers data
  const topPerformers = [
    {
      id: 1,
      name: 'Ahmed Al-Rashid',
      position: 'Senior Engineer',
      team: 'Engineering',
      score: 96,
      achievements: 12,
      goalsCompleted: 18,
      efficiency: 94,
      collaboration: 92,
      innovation: 88,
      reliability: 96,
      avatar: '/api/placeholder/40/40',
      trend: 'up',
      rank: 1
    },
    {
      id: 2,
      name: 'Sara Hassan',
      position: 'Sales Manager',
      team: 'Sales',
      score: 94,
      achievements: 15,
      goalsCompleted: 16,
      efficiency: 91,
      collaboration: 95,
      innovation: 85,
      reliability: 93,
      avatar: '/api/placeholder/40/40',
      trend: 'up',
      rank: 2
    },
    {
      id: 3,
      name: 'Omar Khalil',
      position: 'Marketing Lead',
      team: 'Marketing',
      score: 92,
      achievements: 10,
      goalsCompleted: 14,
      efficiency: 89,
      collaboration: 90,
      innovation: 94,
      reliability: 88,
      avatar: '/api/placeholder/40/40',
      trend: 'stable',
      rank: 3
    },
    {
      id: 4,
      name: 'Fatima Al-Zahra',
      position: 'Support Specialist',
      team: 'Support',
      score: 90,
      achievements: 8,
      goalsCompleted: 15,
      efficiency: 92,
      collaboration: 88,
      innovation: 82,
      reliability: 95,
      avatar: '/api/placeholder/40/40',
      trend: 'up',
      rank: 4
    },
    {
      id: 5,
      name: 'Mohamed Farid',
      position: 'HR Coordinator',
      team: 'HR',
      score: 89,
      achievements: 9,
      goalsCompleted: 13,
      efficiency: 87,
      collaboration: 93,
      innovation: 80,
      reliability: 91,
      avatar: '/api/placeholder/40/40',
      trend: 'up',
      rank: 5
    }
  ];

  const performanceMetrics = [
    { metric: 'Quality of Work', score: 94 },
    { metric: 'Efficiency', score: 91 },
    { metric: 'Collaboration', score: 92 },
    { metric: 'Innovation', score: 87 },
    { metric: 'Reliability', score: 93 },
    { metric: 'Leadership', score: 85 }
  ];

  const teamLeaders = [
    { team: 'Engineering', leader: 'Ahmed Al-Rashid', score: 96, members: 12 },
    { team: 'Sales', leader: 'Sara Hassan', score: 94, members: 8 },
    { team: 'Marketing', leader: 'Omar Khalil', score: 92, members: 6 },
    { team: 'Support', leader: 'Fatima Al-Zahra', score: 90, members: 5 },
    { team: 'HR', leader: 'Mohamed Farid', score: 89, members: 4 }
  ];

  const recognitionData = [
    { month: 'Jan', performers: 8 },
    { month: 'Feb', performers: 12 },
    { month: 'Mar', performers: 10 },
    { month: 'Apr', performers: 15 },
    { month: 'May', performers: 18 },
    { month: 'Jun', performers: 20 }
  ];

  const achievementCategories = [
    { category: 'Goal Achievement', count: 45, color: '#22c55e' },
    { category: 'Innovation', count: 23, color: '#3b82f6' },
    { category: 'Team Leadership', count: 18, color: '#f59e0b' },
    { category: 'Client Satisfaction', count: 32, color: '#8b5cf6' },
    { category: 'Process Improvement', count: 15, color: '#ef4444' }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
      default: return <div className="h-4 w-4" />;
    }
  };

  const getRankBadge = (rank: number) => {
    const colors = {
      1: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      2: 'bg-gray-100 text-gray-800 border-gray-300',
      3: 'bg-orange-100 text-orange-800 border-orange-300'
    };
    return colors[rank as keyof typeof colors] || 'bg-blue-100 text-blue-800 border-blue-300';
  };

  const getScoreColor = (score: number) => {
    if (score >= 95) return 'text-green-600';
    if (score >= 90) return 'text-blue-600';
    if (score >= 85) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">{t('analytics.top_performers')}</p>
                <p className="text-xl font-bold">20</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">{t('analytics.avg_performance')}</p>
                <p className="text-xl font-bold text-blue-600">92%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">{t('analytics.achievements')}</p>
                <p className="text-xl font-bold text-purple-600">133</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">{t('analytics.goals_exceeded')}</p>
                <p className="text-xl font-bold text-green-600">76</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top 5 Performers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            {t('analytics.top_5_performers')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topPerformers.map((performer) => (
              <div key={performer.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge className={`${getRankBadge(performer.rank)} border font-bold`}>
                    #{performer.rank}
                  </Badge>
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={performer.avatar} alt={performer.name} />
                    <AvatarFallback>{performer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{performer.name}</h4>
                    <p className="text-sm text-muted-foreground">{performer.position}</p>
                    <p className="text-xs text-muted-foreground">{performer.team}</p>
                  </div>
                </div>
                
                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="text-center">
                    <p className="text-muted-foreground">{t('analytics.score')}</p>
                    <p className={`font-bold ${getScoreColor(performer.score)}`}>{performer.score}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground">{t('analytics.achievements')}</p>
                    <p className="font-bold">{performer.achievements}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground">{t('analytics.goals')}</p>
                    <p className="font-bold">{performer.goalsCompleted}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground">{t('analytics.trend')}</p>
                    <div className="flex justify-center">
                      {getTrendIcon(performer.trend)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Radar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{t('analytics.top_performer_analysis')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`${screenSize === 'mobile' ? 'h-48' : 'h-64'}`}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={performanceMetrics}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12 }} />
                <PolarRadiusAxis domain={[0, 100]} />
                <Radar
                  name="Average Score"
                  dataKey="score"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Team Leaders */}
      <Card>
        <CardHeader>
          <CardTitle>{t('analytics.team_leaders_performance')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamLeaders.map((leader, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">{leader.team}</span>
                    <span className="text-sm text-muted-foreground">- {leader.leader}</span>
                    <Badge variant="outline" className="text-xs">
                      {leader.members} {t('analytics.members')}
                    </Badge>
                  </div>
                  <span className={`font-bold ${getScoreColor(leader.score)}`}>
                    {leader.score}%
                  </span>
                </div>
                <Progress value={leader.score} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recognition Trend */}
      <Card>
        <CardHeader>
          <CardTitle>{t('analytics.monthly_recognition_trend')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`${screenSize === 'mobile' ? 'h-48' : 'h-64'}`}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={recognitionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar 
                  dataKey="performers" 
                  fill="#22c55e"
                  radius={[4, 4, 0, 0]}
                  name={t('analytics.recognized_performers')}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Achievement Categories */}
      <Card>
        <CardHeader>
          <CardTitle>{t('analytics.achievement_categories')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {achievementCategories.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-sm font-medium">{category.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div 
                    className="h-2 rounded"
                    style={{ 
                      width: `${Math.max(category.count / 50 * 100, 20)}px`,
                      backgroundColor: category.color
                    }}
                  />
                  <span className="text-sm font-bold min-w-[2rem]">{category.count}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle>{t('analytics.performance_insights')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-green-900">{t('analytics.exceptional_performers')}</p>
                <p className="text-sm text-green-700">
                  {t('analytics.exceptional_performers_insight')}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-blue-900">{t('analytics.consistent_excellence')}</p>
                <p className="text-sm text-blue-700">
                  {t('analytics.consistent_excellence_insight')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-purple-900">{t('analytics.recognition_program')}</p>
                <p className="text-sm text-purple-700">
                  {t('analytics.recognition_program_insight')}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};