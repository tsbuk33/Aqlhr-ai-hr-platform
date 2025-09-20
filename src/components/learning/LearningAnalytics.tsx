import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/components/layout/UniversalLanguageProvider';
import { 
  BarChart, 
  TrendingUp, 
  Clock, 
  Brain, 
  Target, 
  Users, 
  Award,
  Zap,
  Eye,
  CheckCircle,
  AlertTriangle,
  Download,
  RefreshCw
} from 'lucide-react';

export const LearningAnalytics: React.FC = () => {
  const { t, isRTL } = useLanguage();

  const individualMetrics = [
    {
      title: 'Learning Velocity',
      value: '1.3x',
      change: '+15%',
      trend: 'up',
      description: 'Above optimal pace',
      icon: <Zap className="h-5 w-5" />
    },
    {
      title: 'Knowledge Retention',
      value: '89%',
      change: '+7%',
      trend: 'up',
      description: '30-day retention rate',
      icon: <Brain className="h-5 w-5" />
    },
    {
      title: 'Engagement Score',
      value: '94%',
      change: '+12%',
      trend: 'up',
      description: 'Session participation',
      icon: <Eye className="h-5 w-5" />
    },
    {
      title: 'Completion Rate',
      value: '76%',
      change: '-3%',
      trend: 'down',
      description: 'Course completion',
      icon: <CheckCircle className="h-5 w-5" />
    }
  ];

  const learningPaths = [
    {
      name: 'Data Analytics Mastery',
      progress: 68,
      velocity: 1.2,
      retention: 91,
      engagement: 95,
      timeInvested: '24h 15m',
      nextMilestone: 'Advanced SQL',
      risk: 'low'
    },
    {
      name: 'Leadership Development',
      progress: 45,
      velocity: 0.8,
      retention: 87,
      engagement: 82,
      timeInvested: '18h 30m',
      nextMilestone: 'Team Management',
      risk: 'medium'
    },
    {
      name: 'Arabic Business Communication',
      progress: 89,
      velocity: 1.5,
      retention: 93,
      engagement: 97,
      timeInvested: '31h 45m',
      nextMilestone: 'Certification',
      risk: 'low'
    }
  ];

  const engagementPatterns = [
    { time: '09:00', engagement: 92, focus: 'high' },
    { time: '11:00', engagement: 88, focus: 'high' },
    { time: '14:00', engagement: 65, focus: 'medium' },
    { time: '16:00', engagement: 78, focus: 'medium' },
    { time: '19:00', engagement: 85, focus: 'high' }
  ];

  const performanceCorrelation = [
    {
      skill: 'Data Analysis',
      learningScore: 94,
      performanceImprovement: 23,
      correlation: 0.87
    },
    {
      skill: 'Communication',
      learningScore: 89,
      performanceImprovement: 18,
      correlation: 0.79
    },
    {
      skill: 'Leadership',
      learningScore: 76,
      performanceImprovement: 12,
      correlation: 0.72
    },
    {
      skill: 'Problem Solving',
      learningScore: 82,
      performanceImprovement: 16,
      correlation: 0.83
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart className="h-8 w-8 text-primary" />
          <div>
            <h2 className="text-2xl font-bold">{t('leo.learning_analytics_title')}</h2>
            <p className="text-muted-foreground">
              {t('leo.analytics_desc')}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            {t('leo.refresh')}
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            {t('leo.export')}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="individual-tracking" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="individual-tracking">{t('leo.individual_tracking')}</TabsTrigger>
          <TabsTrigger value="engagement-patterns">{t('leo.engagement_patterns')}</TabsTrigger>
          <TabsTrigger value="completion-optimization">{t('leo.completion_optimization')}</TabsTrigger>
          <TabsTrigger value="performance-correlation">{t('leo.performance_correlation')}</TabsTrigger>
        </TabsList>

        {/* Individual Progress Tracking */}
        <TabsContent value="individual-tracking" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {individualMetrics.map((metric, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      {metric.icon}
                      <span className="text-sm font-medium">{metric.title}</span>
                    </div>
                    <Badge variant={metric.trend === 'up' ? 'default' : 'secondary'}>
                      {metric.change}
                    </Badge>
                  </div>
                  <div className="mt-2">
                    <div className="text-2xl font-bold">{metric.value}</div>
                    <p className="text-xs text-muted-foreground mt-1">{metric.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Learning Paths Progress */}
          <Card>
            <CardHeader>
              <CardTitle>{t('leo.learning_paths_progress')}</CardTitle>
              <CardDescription>
                {t('leo.paths_desc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {learningPaths.map((path, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-semibold">{path.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Next: {path.nextMilestone} • {path.timeInvested} invested
                        </p>
                      </div>
                      <Badge variant={path.risk === 'low' ? 'default' : 
                                    path.risk === 'medium' ? 'secondary' : 'destructive'}>
                        {path.risk} risk
                      </Badge>
                    </div>

                    <div className="grid gap-4 md:grid-cols-4 mb-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{path.progress}%</span>
                        </div>
                        <Progress value={path.progress} />
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Velocity</p>
                        <p className="text-lg font-semibold">{path.velocity}x</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Retention</p>
                        <p className="text-lg font-semibold">{path.retention}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Engagement</p>
                        <p className="text-lg font-semibold">{path.engagement}%</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm">
                        <Target className="h-4 w-4 mr-2" />
                        {t('leo.view_details')}
                      </Button>
                      <Button size="sm" variant="outline">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        {t('leo.optimize')}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Engagement Patterns */}
        <TabsContent value="engagement-patterns" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('leo.engagement_patterns_title')}</CardTitle>
              <CardDescription>
                {t('leo.patterns_desc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {engagementPatterns.map((pattern, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <Clock className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                        <span className="font-medium">{pattern.time}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Engagement Score</span>
                          <span>{pattern.engagement}%</span>
                        </div>
                        <Progress value={pattern.engagement} />
                      </div>
                    </div>
                    <Badge variant={pattern.focus === 'high' ? 'default' : 'secondary'}>
                      {pattern.focus} focus
                    </Badge>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">
                  {t('leo.ai_recommendations')}
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Best learning times: 9:00 AM and 7:00 PM (high engagement)</li>
                  <li>• Avoid complex topics during 2:00 PM slot (low focus period)</li>
                  <li>• Schedule reviews during evening high-engagement periods</li>
                  <li>• Consider micro-learning during afternoon sessions</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Completion Rate Optimization */}
        <TabsContent value="completion-optimization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('leo.completion_optimization_title')}</CardTitle>
              <CardDescription>
                {t('leo.optimization_desc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="font-semibold">{t('leo.completion_factors')}</h4>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 border rounded">
                      <span className="text-sm">Course Length</span>
                      <div className="flex items-center gap-2">
                        <Progress value={85} className="w-20" />
                        <span className="text-sm font-medium">85%</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 border rounded">
                      <span className="text-sm">Content Engagement</span>
                      <div className="flex items-center gap-2">
                        <Progress value={92} className="w-20" />
                        <span className="text-sm font-medium">92%</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 border rounded">
                      <span className="text-sm">Learning Path Clarity</span>
                      <div className="flex items-center gap-2">
                        <Progress value={78} className="w-20" />
                        <span className="text-sm font-medium">78%</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 border rounded">
                      <span className="text-sm">Peer Support</span>
                      <div className="flex items-center gap-2">
                        <Progress value={65} className="w-20" />
                        <span className="text-sm font-medium">65%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">{t('leo.optimization_strategies')}</h4>
                  
                  <div className="space-y-3">
                    <div className="p-3 bg-green-50 border-l-4 border-green-500 rounded">
                      <p className="text-sm font-medium text-green-800">Break Long Courses</p>
                      <p className="text-xs text-green-600">Split courses longer than 4 hours into modules</p>
                    </div>
                    
                    <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
                      <p className="text-sm font-medium text-blue-800">Gamification</p>
                      <p className="text-xs text-blue-600">Add achievement badges and progress rewards</p>
                    </div>
                    
                    <div className="p-3 bg-orange-50 border-l-4 border-orange-500 rounded">
                      <p className="text-sm font-medium text-orange-800">Social Learning</p>
                      <p className="text-xs text-orange-600">Enable peer discussions and study groups</p>
                    </div>
                    
                    <div className="p-3 bg-purple-50 border-l-4 border-purple-500 rounded">
                      <p className="text-sm font-medium text-purple-800">Personalized Reminders</p>
                      <p className="text-xs text-purple-600">AI-timed notifications based on engagement patterns</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Button>
                  <Target className="h-4 w-4 mr-2" />
                  {t('leo.apply_optimizations')}
                </Button>
                <Button variant="outline">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  {t('leo.track_improvements')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Correlation Analysis */}
        <TabsContent value="performance-correlation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('leo.performance_correlation_title')}</CardTitle>
              <CardDescription>
                {t('leo.correlation_desc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performanceCorrelation.map((item, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{item.skill}</h4>
                      <div className="flex items-center gap-2">
                        <Badge variant={item.correlation > 0.8 ? 'default' : 
                                      item.correlation > 0.7 ? 'secondary' : 'outline'}>
                          {(item.correlation * 100).toFixed(0)}% correlation
                        </Badge>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Learning Score</p>
                        <div className="flex items-center gap-2">
                          <Progress value={item.learningScore} className="flex-1" />
                          <span className="font-medium">{item.learningScore}%</span>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Performance Improvement</p>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          <span className="font-medium text-green-600">+{item.performanceImprovement}%</span>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Correlation Strength</p>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${
                            item.correlation > 0.8 ? 'bg-green-500' : 
                            item.correlation > 0.7 ? 'bg-yellow-500' : 'bg-red-500'
                          }`} />
                          <span className="font-medium">
                            {item.correlation > 0.8 ? 'Strong' : 
                             item.correlation > 0.7 ? 'Moderate' : 'Weak'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 border rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Award className="h-5 w-5 text-green-600" />
                  {t('leo.key_insights')}
                </h4>
                <ul className="text-sm space-y-1">
                  <li>• Data analysis training shows strongest correlation with job performance (87%)</li>
                  <li>• Average performance improvement of 17% across all skills</li>
                  <li>• Communication skills training has immediate impact (visible within 2 weeks)</li>
                  <li>• Leadership development requires longer timeframe for measurable results</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};