import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/components/layout/UniversalLanguageProvider';
import { 
  Brain, 
  User, 
  Target, 
  Clock, 
  BookOpen, 
  Video, 
  FileText, 
  Headphones,
  Play,
  Pause,
  SkipForward,
  Settings,
  TrendingUp,
  Award
} from 'lucide-react';

export const AdaptiveLearningEngine: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);

  const learningStyles = [
    { type: 'Visual', score: 85, icon: <Video className="h-5 w-5" />, color: 'bg-blue-500' },
    { type: 'Auditory', score: 72, icon: <Headphones className="h-5 w-5" />, color: 'bg-green-500' },
    { type: 'Kinesthetic', score: 68, icon: <Target className="h-5 w-5" />, color: 'bg-orange-500' },
    { type: 'Reading/Writing', score: 79, icon: <FileText className="h-5 w-5" />, color: 'bg-purple-500' }
  ];

  const personalizedPaths = [
    {
      title: 'Data Analytics Mastery',
      progress: 65,
      nextModule: 'Advanced SQL Queries',
      estimatedTime: '3h 20m',
      adaptations: ['Visual examples added', 'Shorter sessions', 'Practice exercises'],
      difficulty: 'Intermediate'
    },
    {
      title: 'Leadership Fundamentals',
      progress: 45,
      nextModule: 'Emotional Intelligence',
      estimatedTime: '2h 15m',
      adaptations: ['Case studies', 'Interactive scenarios', 'Peer discussions'],
      difficulty: 'Beginner'
    },
    {
      title: 'Arabic Business Communication',
      progress: 82,
      nextModule: 'Professional Presentations',
      estimatedTime: '1h 45m',
      adaptations: ['Cultural context', 'Real-world examples', 'Audio practice'],
      difficulty: 'Advanced'
    }
  ];

  const contentTypes = [
    { type: 'Video', count: 45, engagement: 92, icon: <Video className="h-5 w-5" /> },
    { type: 'Interactive', count: 32, engagement: 88, icon: <Target className="h-5 w-5" /> },
    { type: 'Text', count: 28, engagement: 76, icon: <FileText className="h-5 w-5" /> },
    { type: 'Audio', count: 18, engagement: 81, icon: <Headphones className="h-5 w-5" /> }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Brain className="h-8 w-8 text-primary" />
          <div>
            <h2 className="text-2xl font-bold">{t('leo.adaptive_engine_title')}</h2>
            <p className="text-muted-foreground">
              {t('leo.adaptive_engine_desc')}
            </p>
          </div>
        </div>
        <Button>
          <Settings className="h-4 w-4 mr-2" />
          {t('leo.configure')}
        </Button>
      </div>

      <Tabs defaultValue="learning-styles" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="learning-styles">{t('leo.learning_styles')}</TabsTrigger>
          <TabsTrigger value="personalized-paths">{t('leo.personalized_paths')}</TabsTrigger>
          <TabsTrigger value="content-delivery">{t('leo.content_delivery')}</TabsTrigger>
          <TabsTrigger value="pacing-algorithm">{t('leo.pacing_algorithm')}</TabsTrigger>
        </TabsList>

        {/* Learning Styles Assessment */}
        <TabsContent value="learning-styles" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {t('leo.individual_assessment')}
              </CardTitle>
              <CardDescription>
                {t('leo.assessment_desc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {learningStyles.map((style, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${style.color} text-white`}>
                        {style.icon}
                      </div>
                      <div>
                        <p className="font-medium">{style.type}</p>
                        <p className="text-sm text-muted-foreground">Preference Score</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{style.score}%</p>
                      <Progress value={style.score} className="w-20 mt-1" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">{t('leo.ai_recommendation')}</h4>
                <p className="text-sm text-muted-foreground">
                  Based on your learning style analysis, we recommend a <strong>visual-first approach</strong> with 
                  interactive elements and supplementary reading materials. Content should be delivered in 
                  20-minute focused sessions with visual summaries.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Personalized Learning Paths */}
        <TabsContent value="personalized-paths" className="space-y-6">
          <div className="grid gap-6">
            {personalizedPaths.map((path, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        {path.title}
                      </CardTitle>
                      <CardDescription>
                        Next: {path.nextModule} • {path.estimatedTime} remaining
                      </CardDescription>
                    </div>
                    <Badge variant={path.difficulty === 'Beginner' ? 'secondary' : 
                                  path.difficulty === 'Intermediate' ? 'default' : 'destructive'}>
                      {path.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm text-muted-foreground">{path.progress}%</span>
                      </div>
                      <Progress value={path.progress} />
                    </div>

                    <div>
                      <h5 className="font-semibold mb-2">{t('leo.ai_adaptations')}</h5>
                      <div className="flex flex-wrap gap-2">
                        {path.adaptations.map((adaptation, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {adaptation}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button>
                        <Play className="h-4 w-4 mr-2" />
                        {t('leo.continue_learning')}
                      </Button>
                      <Button variant="outline">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        {t('leo.view_analytics')}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Multi-modal Content Delivery */}
        <TabsContent value="content-delivery" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('leo.multimodal_delivery')}</CardTitle>
              <CardDescription>
                {t('leo.delivery_desc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {contentTypes.map((content, index) => (
                  <div key={index} className="text-center p-4 border rounded-lg">
                    <div className="flex justify-center mb-3">
                      {content.icon}
                    </div>
                    <h4 className="font-semibold">{content.type}</h4>
                    <p className="text-2xl font-bold text-primary">{content.count}</p>
                    <p className="text-sm text-muted-foreground">Available modules</p>
                    <div className="mt-2">
                      <Badge variant="secondary">{content.engagement}% engagement</Badge>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  {t('leo.smart_content_selection')}
                </h4>
                <p className="text-sm text-muted-foreground">
                  AI automatically selects the optimal content format for each learning session based on your 
                  preferences, time availability, current energy level, and historical engagement patterns.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Adaptive Pacing Algorithm */}
        <TabsContent value="pacing-algorithm" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                {t('leo.adaptive_pacing')}
              </CardTitle>
              <CardDescription>
                {t('leo.pacing_desc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="font-semibold">{t('leo.current_metrics')}</h4>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{t('leo.learning_velocity')}</span>
                      <span className="font-semibold">1.3x optimal</span>
                    </div>
                    <Progress value={78} />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{t('leo.retention_rate')}</span>
                      <span className="font-semibold">89%</span>
                    </div>
                    <Progress value={89} />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{t('leo.engagement_score')}</span>
                      <span className="font-semibold">94%</span>
                    </div>
                    <Progress value={94} />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">{t('leo.ai_adjustments')}</h4>
                  
                  <div className="space-y-3">
                    <div className="p-3 bg-green-50 border-l-4 border-green-500 rounded">
                      <p className="text-sm font-medium text-green-800">Accelerated Pace</p>
                      <p className="text-xs text-green-600">High comprehension detected - increasing content complexity</p>
                    </div>
                    
                    <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
                      <p className="text-sm font-medium text-blue-800">Extended Practice</p>
                      <p className="text-xs text-blue-600">Adding reinforcement exercises for better retention</p>
                    </div>
                    
                    <div className="p-3 bg-orange-50 border-l-4 border-orange-500 rounded">
                      <p className="text-sm font-medium text-orange-800">Micro-breaks</p>
                      <p className="text-xs text-orange-600">Optimizing session length based on attention patterns</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Button className="flex-1">
                  <Play className="h-4 w-4 mr-2" />
                  {t('leo.start_optimized_session')}
                </Button>
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  {t('leo.customize_pacing')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};