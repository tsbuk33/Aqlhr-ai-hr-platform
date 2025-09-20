import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/components/layout/UniversalLanguageProvider';
import { 
  Sparkles, 
  Bot, 
  Users, 
  Trophy, 
  Gamepad2, 
  Zap,
  Network,
  Share2,
  MessageCircle,
  Star,
  Gift,
  Target,
  Brain,
  Eye,
  Headphones,
  Video,
  TrendingUp,
  Settings,
  Play,
  Pause
} from 'lucide-react';

export const AILearningFeatures: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const [aiContentEnabled, setAiContentEnabled] = useState(true);
  const [peerNetworksEnabled, setPeerNetworksEnabled] = useState(true);
  const [gamificationEnabled, setGamificationEnabled] = useState(true);

  const aiContentCreation = [
    {
      type: 'Video Tutorials',
      generated: 234,
      quality: 94,
      engagement: 89,
      time_saved: '120 hours',
      icon: <Video className="h-5 w-5" />
    },
    {
      type: 'Interactive Quizzes',
      generated: 567,
      quality: 91,
      engagement: 95,
      time_saved: '85 hours',
      icon: <Target className="h-5 w-5" />
    },
    {
      type: 'Audio Narrations',
      generated: 189,
      quality: 96,
      engagement: 87,
      time_saved: '67 hours',
      icon: <Headphones className="h-5 w-5" />
    },
    {
      type: 'Scenarios & Simulations',
      generated: 89,
      quality: 88,
      engagement: 93,
      time_saved: '156 hours',
      icon: <Eye className="h-5 w-5" />
    }
  ];

  const peerNetworks = [
    {
      network: 'Data Analytics Community',
      members: 234,
      activeDiscussions: 45,
      knowledgeShared: 123,
      expertMentors: 12,
      avgRating: 4.8
    },
    {
      network: 'Leadership Circle',
      members: 156,
      activeDiscussions: 28,
      knowledgeShared: 89,
      expertMentors: 8,
      avgRating: 4.9
    },
    {
      network: 'Arabic Speakers Hub',
      members: 189,
      activeDiscussions: 34,
      knowledgeShared: 156,
      expertMentors: 15,
      avgRating: 4.7
    },
    {
      network: 'Technical Skills Forum',
      members: 298,
      activeDiscussions: 67,
      knowledgeShared: 234,
      expertMentors: 18,
      avgRating: 4.6
    }
  ];

  const gamificationElements = [
    {
      element: 'Achievement Badges',
      participants: 1247,
      engagement: '+23%',
      completion: '+18%',
      icon: <Trophy className="h-5 w-5" />
    },
    {
      element: 'Learning Streaks',
      participants: 892,
      engagement: '+31%',
      completion: '+25%',
      icon: <Zap className="h-5 w-5" />
    },
    {
      element: 'Leaderboards',
      participants: 567,
      engagement: '+19%',
      completion: '+15%',
      icon: <TrendingUp className="h-5 w-5" />
    },
    {
      element: 'Points & Rewards',
      participants: 1456,
      engagement: '+27%',
      completion: '+22%',
      icon: <Gift className="h-5 w-5" />
    }
  ];

  const vrArModules = [
    {
      title: 'Virtual Office Environment',
      category: 'Soft Skills',
      participants: 89,
      effectiveness: 92,
      immersionLevel: 'High',
      platform: 'VR Headset',
      duration: '15 minutes'
    },
    {
      title: 'Equipment Safety Training',
      category: 'Safety',
      participants: 156,
      effectiveness: 96,
      immersionLevel: 'High',
      platform: 'VR Headset',
      duration: '20 minutes'
    },
    {
      title: 'Customer Interaction Scenarios',
      category: 'Customer Service',
      participants: 234,
      effectiveness: 89,
      immersionLevel: 'Medium',
      platform: 'AR Mobile',
      duration: '12 minutes'
    },
    {
      title: 'Data Visualization Workshop',
      category: 'Technical',
      participants: 67,
      effectiveness: 94,
      immersionLevel: 'High',
      platform: 'Mixed Reality',
      duration: '25 minutes'
    }
  ];

  const predictiveModeling = [
    {
      metric: 'Learning Completion',
      accuracy: 94,
      prediction: 'High completion probability for 89% of enrolled learners',
      impact: 'Positive',
      confidence: 92
    },
    {
      metric: 'Skill Acquisition',
      accuracy: 87,
      prediction: 'Data analysis skills will improve by 23% on average',
      impact: 'Positive',
      confidence: 89
    },
    {
      metric: 'Knowledge Retention',
      accuracy: 91,
      prediction: '30-day retention rate predicted at 84%',
      impact: 'Stable',
      confidence: 91
    },
    {
      metric: 'Engagement Patterns',
      accuracy: 88,
      prediction: 'Peak engagement times: 9-11 AM and 7-9 PM',
      impact: 'Insight',
      confidence: 86
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Sparkles className="h-8 w-8 text-primary" />
          <div>
        <h2 className="text-2xl font-bold">{t('leo.ai_learning_features_title')}</h2>
        <p className="text-muted-foreground">
          {t('leo.ai_features_desc')}
        </p>
          </div>
        </div>
        <Button>
          <Settings className="h-4 w-4 mr-2" />
          {t('leo.configure_ai', 'Configure AI')}
        </Button>
      </div>

      <Tabs defaultValue="ai-content-creation" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="ai-content-creation">{t('leo.ai_content_creation', 'AI Content')}</TabsTrigger>
          <TabsTrigger value="peer-networks">{t('leo.peer_networks', 'Peer Networks')}</TabsTrigger>
          <TabsTrigger value="gamification">{t('leo.gamification', 'Gamification')}</TabsTrigger>
          <TabsTrigger value="vr-ar-training">{t('leo.vr_ar_training', 'VR/AR Training')}</TabsTrigger>
          <TabsTrigger value="predictive-modeling">{t('leo.predictive_modeling', 'Predictive Analytics')}</TabsTrigger>
        </TabsList>

        {/* AI-powered Content Creation */}
        <TabsContent value="ai-content-creation" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5" />
                    {t('leo.ai_powered_content_creation', 'AI-Powered Content Creation')}
                  </CardTitle>
                  <CardDescription>
                    {t('leo.ai_content_desc', 'Automated generation of high-quality learning materials')}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={aiContentEnabled} 
                    onCheckedChange={setAiContentEnabled}
                  />
                  <span className="text-sm">
                    {aiContentEnabled ? t('leo.enabled', 'Enabled') : t('leo.disabled', 'Disabled')}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {aiContentCreation.map((content, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-primary/10 rounded-full text-primary">
                        {content.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold">{content.type}</h4>
                        <p className="text-sm text-muted-foreground">{content.generated} generated</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Quality Score</span>
                          <span>{content.quality}%</span>
                        </div>
                        <Progress value={content.quality} />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Engagement Rate</span>
                          <span>{content.engagement}%</span>
                        </div>
                        <Progress value={content.engagement} />
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Time Saved</span>
                        <Badge variant="secondary">{content.time_saved}</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Brain className="h-5 w-5 text-blue-600" />
                  {t('leo.ai_capabilities', 'AI Content Generation Capabilities')}
                </h4>
                <ul className="text-sm space-y-1">
                  <li>• Automatic video script generation from text materials</li>
                  <li>• AI-powered quiz creation with adaptive difficulty</li>
                  <li>• Multi-language content translation and localization</li>
                  <li>• Voice synthesis for audio content in Arabic and English</li>
                  <li>• Interactive scenario generation based on job roles</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Peer-to-Peer Learning Networks */}
        <TabsContent value="peer-networks" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Network className="h-5 w-5" />
                    {t('leo.peer_to_peer_networks', 'Peer-to-Peer Learning Networks')}
                  </CardTitle>
                  <CardDescription>
                    {t('leo.peer_networks_desc', 'Collaborative learning communities with expert mentorship')}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={peerNetworksEnabled} 
                    onCheckedChange={setPeerNetworksEnabled}
                  />
                  <span className="text-sm">
                    {peerNetworksEnabled ? t('leo.active', 'Active') : t('leo.inactive', 'Inactive')}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {peerNetworks.map((network, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Users className="h-6 w-6 text-primary" />
                        <div>
                          <h4 className="font-semibold">{network.network}</h4>
                          <p className="text-sm text-muted-foreground">
                            {network.members} members • {network.expertMentors} expert mentors
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{network.avgRating}</span>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3 mb-4">
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <MessageCircle className="h-5 w-5 mx-auto mb-2 text-blue-600" />
                        <p className="text-lg font-bold">{network.activeDiscussions}</p>
                        <p className="text-sm text-muted-foreground">Active Discussions</p>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <Share2 className="h-5 w-5 mx-auto mb-2 text-green-600" />
                        <p className="text-lg font-bold">{network.knowledgeShared}</p>
                        <p className="text-sm text-muted-foreground">Knowledge Shared</p>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <Brain className="h-5 w-5 mx-auto mb-2 text-purple-600" />
                        <p className="text-lg font-bold">{network.expertMentors}</p>
                        <p className="text-sm text-muted-foreground">Expert Mentors</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm">
                        <Users className="h-4 w-4 mr-2" />
                        {t('leo.join_network', 'Join Network')}
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        {t('leo.view_discussions', 'View Discussions')}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">
                  {t('leo.network_benefits', 'Peer Learning Benefits')}
                </h4>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• 67% faster problem resolution through peer support</li>
                  <li>• 89% of learners report increased motivation</li>
                  <li>• Expert mentorship available 24/7</li>
                  <li>• Cross-cultural knowledge exchange</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gamification Elements */}
        <TabsContent value="gamification" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Gamepad2 className="h-5 w-5" />
                    {t('leo.gamification_elements', 'Gamification Elements')}
                  </CardTitle>
                  <CardDescription>
                    {t('leo.gamification_desc', 'Game mechanics to boost engagement and motivation')}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={gamificationEnabled} 
                    onCheckedChange={setGamificationEnabled}
                  />
                  <span className="text-sm">
                    {gamificationEnabled ? t('leo.enabled', 'Enabled') : t('leo.disabled', 'Disabled')}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {gamificationElements.map((element, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-primary/10 rounded-full text-primary">
                        {element.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold">{element.element}</h4>
                        <p className="text-sm text-muted-foreground">
                          {element.participants} participants
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-lg font-bold text-green-600">{element.engagement}</p>
                        <p className="text-sm text-green-800">Engagement Boost</p>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-lg font-bold text-blue-600">{element.completion}</p>
                        <p className="text-sm text-blue-800">Completion Boost</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <Card className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    <h4 className="font-semibold">Achievements</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Fast Learner</span>
                      <Badge variant="secondary">234 earned</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Knowledge Master</span>
                      <Badge variant="secondary">156 earned</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Team Player</span>
                      <Badge variant="secondary">89 earned</Badge>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <TrendingUp className="h-5 w-5 text-blue-500" />
                    <h4 className="font-semibold">Leaderboard</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>1. Ahmed Al-Rashid</span>
                      <span className="font-medium">2,847 pts</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>2. Sarah Hassan</span>
                      <span className="font-medium">2,634 pts</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>3. Mohammed Ali</span>
                      <span className="font-medium">2,521 pts</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Gift className="h-5 w-5 text-purple-500" />
                    <h4 className="font-semibold">Rewards</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Course Credits</span>
                      <Badge>Active</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Digital Certificates</span>
                      <Badge>Active</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Learning Vouchers</span>
                      <Badge variant="secondary">Coming Soon</Badge>
                    </div>
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* VR/AR Training Modules */}
        <TabsContent value="vr-ar-training" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                {t('leo.vr_ar_training_modules', 'VR/AR Training Modules')}
              </CardTitle>
              <CardDescription>
                {t('leo.vr_ar_desc', 'Immersive virtual and augmented reality learning experiences')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vrArModules.map((module, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-semibold">{module.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {module.category} • {module.platform} • {module.duration}
                        </p>
                      </div>
                      <Badge variant={module.immersionLevel === 'High' ? 'default' : 'secondary'}>
                        {module.immersionLevel} Immersion
                      </Badge>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3 mb-4">
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <Users className="h-5 w-5 mx-auto mb-2" />
                        <p className="text-lg font-bold">{module.participants}</p>
                        <p className="text-sm text-muted-foreground">Participants</p>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <Target className="h-5 w-5 mx-auto mb-2" />
                        <p className="text-lg font-bold">{module.effectiveness}%</p>
                        <p className="text-sm text-muted-foreground">Effectiveness</p>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <Eye className="h-5 w-5 mx-auto mb-2" />
                        <p className="text-lg font-bold">{module.immersionLevel}</p>
                        <p className="text-sm text-muted-foreground">Immersion</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm">
                        <Play className="h-4 w-4 mr-2" />
                        {t('leo.start_experience', 'Start Experience')}
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        {t('leo.preview', 'Preview')}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <h4 className="font-semibold text-purple-900 mb-2">
                  {t('leo.vr_ar_benefits', 'VR/AR Training Benefits')}
                </h4>
                <ul className="text-sm text-purple-800 space-y-1">
                  <li>• 89% higher retention rates compared to traditional training</li>
                  <li>• Safe environment for practicing high-risk scenarios</li>
                  <li>• Immersive cultural and language learning experiences</li>
                  <li>• Real-time performance analytics and feedback</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Learning Analytics Predictive Modeling */}
        <TabsContent value="predictive-modeling" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                {t('leo.predictive_modeling', 'Learning Analytics Predictive Modeling')}
              </CardTitle>
              <CardDescription>
                {t('leo.predictive_desc', 'AI-powered predictions for learning outcomes and behavior patterns')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {predictiveModeling.map((model, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{model.metric}</h4>
                      <div className="flex items-center gap-2">
                        <Badge variant={model.impact === 'Positive' ? 'default' : 
                                      model.impact === 'Stable' ? 'secondary' : 'outline'}>
                          {model.impact}
                        </Badge>
                        <Badge variant="outline">{model.accuracy}% accurate</Badge>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3">{model.prediction}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Confidence Level</span>
                        <Progress value={model.confidence} className="w-20" />
                        <span className="text-sm font-medium">{model.confidence}%</span>
                      </div>
                      <Button size="sm" variant="outline">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        {t('leo.view_analysis', 'View Analysis')}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <Card className="p-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    {t('leo.ai_recommendations', 'AI Recommendations')}
                  </h4>
                  <ul className="text-sm space-y-2">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      Optimize learning paths for 23% better retention
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      Schedule complex topics during peak engagement hours
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full" />
                      Implement micro-learning for busy professionals
                    </li>
                  </ul>
                </Card>

                <Card className="p-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-500" />
                    {t('leo.prediction_accuracy', 'Prediction Accuracy')}
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Learning Outcomes</span>
                        <span>91%</span>
                      </div>
                      <Progress value={91} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Engagement Patterns</span>
                        <span>88%</span>
                      </div>
                      <Progress value={88} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Skill Development</span>
                        <span>87%</span>
                      </div>
                      <Progress value={87} />
                    </div>
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};