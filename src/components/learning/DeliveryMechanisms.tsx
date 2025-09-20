import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/components/layout/UniversalLanguageProvider';
import { 
  Smartphone, 
  Wifi, 
  WifiOff, 
  Video, 
  Users, 
  Download, 
  Clock,
  Play,
  Pause,
  Volume2,
  BookOpen,
  MessageCircle,
  Star,
  Trophy,
  Zap,
  Share2,
  Settings,
  Globe,
  Headphones,
  Calendar
} from 'lucide-react';

export const DeliveryMechanisms: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const [mobileAppEnabled, setMobileAppEnabled] = useState(true);
  const [offlineSyncEnabled, setOfflineSyncEnabled] = useState(true);
  const [socialLearningEnabled, setSocialLearningEnabled] = useState(true);

  const mobileStats = [
    { metric: 'Active Users', value: '2,847', change: '+12%', icon: <Users className="h-5 w-5" /> },
    { metric: 'Daily Sessions', value: '1,234', change: '+8%', icon: <Play className="h-5 w-5" /> },
    { metric: 'Content Downloaded', value: '89GB', change: '+23%', icon: <Download className="h-5 w-5" /> },
    { metric: 'Offline Completions', value: '456', change: '+18%', icon: <WifiOff className="h-5 w-5" /> }
  ];

  const microlearningModules = [
    {
      title: 'Excel Formula Mastery',
      duration: '5 minutes',
      completions: 1247,
      rating: 4.8,
      category: 'Technical',
      format: 'Interactive'
    },
    {
      title: 'Effective Communication',
      duration: '3 minutes',
      completions: 2156,
      rating: 4.9,
      category: 'Soft Skills',
      format: 'Video'
    },
    {
      title: 'Saudi Business Etiquette',
      duration: '4 minutes',
      completions: 987,
      rating: 4.7,
      category: 'Cultural',
      format: 'Scenario'
    },
    {
      title: 'Time Management Tips',
      duration: '6 minutes',
      completions: 1834,
      rating: 4.6,
      category: 'Productivity',
      format: 'Audio'
    }
  ];

  const virtualClassrooms = [
    {
      title: 'Advanced Data Analytics Workshop',
      instructor: 'Dr. Sarah Ahmed',
      date: 'Today, 2:00 PM',
      duration: '2 hours',
      participants: 45,
      maxCapacity: 50,
      status: 'live',
      language: 'English'
    },
    {
      title: 'Arabic Leadership Fundamentals',
      instructor: 'Prof. Mohammed Al-Rashid',
      date: 'Tomorrow, 10:00 AM',
      duration: '1.5 hours',
      participants: 32,
      maxCapacity: 40,
      status: 'scheduled',
      language: 'Arabic'
    },
    {
      title: 'Digital Marketing Strategies',
      instructor: 'Lisa Chen',
      date: 'Dec 23, 3:00 PM',
      duration: '3 hours',
      participants: 28,
      maxCapacity: 35,
      status: 'upcoming',
      language: 'English'
    }
  ];

  const socialFeatures = [
    {
      feature: 'Discussion Forums',
      activeUsers: 1247,
      posts: 3456,
      engagement: 87,
      icon: <MessageCircle className="h-5 w-5" />
    },
    {
      feature: 'Peer Reviews',
      activeUsers: 892,
      posts: 1234,
      engagement: 92,
      icon: <Star className="h-5 w-5" />
    },
    {
      feature: 'Study Groups',
      activeUsers: 567,
      posts: 891,
      engagement: 89,
      icon: <Users className="h-5 w-5" />
    },
    {
      feature: 'Knowledge Sharing',
      activeUsers: 1456,
      posts: 2345,
      engagement: 84,
      icon: <Share2 className="h-5 w-5" />
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Smartphone className="h-8 w-8 text-primary" />
          <div>
            <h2 className="text-2xl font-bold">{t('leo.delivery_mechanisms_title')}</h2>
            <p className="text-muted-foreground">
              {t('leo.delivery_desc')}
            </p>
          </div>
        </div>
        <Button>
          <Settings className="h-4 w-4 mr-2" />
          {t('leo.configure_delivery')}
        </Button>
      </div>

      <Tabs defaultValue="mobile-learning" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="mobile-learning">{t('leo.mobile_learning')}</TabsTrigger>
          <TabsTrigger value="microlearning">{t('leo.microlearning')}</TabsTrigger>
          <TabsTrigger value="virtual-classroom">{t('leo.virtual_classroom')}</TabsTrigger>
          <TabsTrigger value="offline-sync">{t('leo.offline_sync')}</TabsTrigger>
          <TabsTrigger value="social-learning">{t('leo.social_learning')}</TabsTrigger>
        </TabsList>

        {/* Mobile Learning App */}
        <TabsContent value="mobile-learning" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5" />
                    {t('leo.mobile_learning_app')}
                  </CardTitle>
                  <CardDescription>
                    {t('leo.mobile_app_desc')}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={mobileAppEnabled} 
                    onCheckedChange={setMobileAppEnabled}
                  />
                  <span className="text-sm">
                    {mobileAppEnabled ? t('leo.enabled') : t('leo.disabled')}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
                {mobileStats.map((stat, index) => (
                  <div key={index} className="text-center p-4 border rounded-lg">
                    <div className="flex justify-center mb-2">
                      {stat.icon}
                    </div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.metric}</p>
                    <Badge variant="secondary" className="mt-2">
                      {stat.change}
                    </Badge>
                  </div>
                ))}
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold mb-3">{t('leo.app_features')}</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-2">
                        <Download className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Offline Content</span>
                      </div>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">Push Notifications</span>
                      </div>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm">Progress Tracking</span>
                      </div>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-purple-600" />
                        <span className="text-sm">Multi-language</span>
                      </div>
                      <Badge variant="default">Active</Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">{t('leo.usage_analytics')}</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>iOS Users</span>
                        <span>67%</span>
                      </div>
                      <Progress value={67} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Android Users</span>
                        <span>33%</span>
                      </div>
                      <Progress value={33} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Daily Active Users</span>
                        <span>84%</span>
                      </div>
                      <Progress value={84} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Course Completion Rate</span>
                        <span>78%</span>
                      </div>
                      <Progress value={78} />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Microlearning Modules */}
        <TabsContent value="microlearning" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('leo.microlearning_modules')}</CardTitle>
              <CardDescription>
                {t('leo.microlearning_desc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {microlearningModules.map((module, index) => (
                  <Card key={index} className="hover:bg-muted/50 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="outline">{module.category}</Badge>
                        <Badge variant="secondary">{module.format}</Badge>
                      </div>
                      
                      <h4 className="font-semibold mb-2">{module.title}</h4>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {module.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {module.completions}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          {module.rating}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">
                          <Play className="h-4 w-4 mr-2" />
                          {t('leo.start_module')}
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">
                  {t('leo.microlearning_benefits')}
                </h4>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Higher engagement rates (+45% vs traditional courses)</li>
                  <li>• Better knowledge retention (87% after 30 days)</li>
                  <li>• Fits into busy schedules (average 4 minutes per session)</li>
                  <li>• Mobile-optimized for learning on-the-go</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Virtual Classroom Integration */}
        <TabsContent value="virtual-classroom" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('leo.virtual_classroom_integration')}</CardTitle>
              <CardDescription>
                {t('leo.virtual_classroom_desc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {virtualClassrooms.map((classroom, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${
                          classroom.status === 'live' ? 'bg-red-100 text-red-600' :
                          classroom.status === 'scheduled' ? 'bg-blue-100 text-blue-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          <Video className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{classroom.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {classroom.instructor} • {classroom.date}
                          </p>
                        </div>
                      </div>
                      <Badge variant={
                        classroom.status === 'live' ? 'destructive' :
                        classroom.status === 'scheduled' ? 'default' : 'secondary'
                      }>
                        {classroom.status === 'live' ? 'LIVE' : 
                         classroom.status === 'scheduled' ? 'Scheduled' : 'Upcoming'}
                      </Badge>
                    </div>

                    <div className="grid gap-4 md:grid-cols-4 mb-4">
                      <div className="text-center p-2 bg-muted rounded">
                        <Clock className="h-4 w-4 mx-auto mb-1" />
                        <p className="text-sm font-medium">{classroom.duration}</p>
                        <p className="text-xs text-muted-foreground">Duration</p>
                      </div>
                      <div className="text-center p-2 bg-muted rounded">
                        <Users className="h-4 w-4 mx-auto mb-1" />
                        <p className="text-sm font-medium">{classroom.participants}/{classroom.maxCapacity}</p>
                        <p className="text-xs text-muted-foreground">Participants</p>
                      </div>
                      <div className="text-center p-2 bg-muted rounded">
                        <Globe className="h-4 w-4 mx-auto mb-1" />
                        <p className="text-sm font-medium">{classroom.language}</p>
                        <p className="text-xs text-muted-foreground">Language</p>
                      </div>
                      <div className="text-center p-2 bg-muted rounded">
                        <div className="w-4 h-4 mx-auto mb-1 bg-green-500 rounded-full" />
                        <p className="text-sm font-medium">
                          {Math.round((classroom.participants / classroom.maxCapacity) * 100)}%
                        </p>
                        <p className="text-xs text-muted-foreground">Capacity</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">
                        {classroom.status === 'live' ? (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            {t('leo.join_now')}
                          </>
                        ) : (
                          <>
                            <Calendar className="h-4 w-4 mr-2" />
                            {t('leo.register')}
                          </>
                        )}
                      </Button>
                      <Button size="sm" variant="outline">
                        <BookOpen className="h-4 w-4 mr-2" />
                        {t('leo.materials')}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Offline Content Sync */}
        <TabsContent value="offline-sync" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <WifiOff className="h-5 w-5" />
                    {t('leo.offline_content_sync')}
                  </CardTitle>
                  <CardDescription>
                    {t('leo.offline_desc')}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={offlineSyncEnabled} 
                    onCheckedChange={setOfflineSyncEnabled}
                  />
                  <span className="text-sm">
                    {offlineSyncEnabled ? t('leo.auto_sync') : t('leo.manual_sync')}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold mb-3">{t('leo.sync_status')}</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-2">
                        <Video className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">Video Content</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">2.3GB</p>
                        <Badge variant="default">Synced</Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-2">
                        <Headphones className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Audio Content</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">856MB</p>
                        <Badge variant="default">Synced</Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-purple-600" />
                        <span className="text-sm">Documents</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">245MB</p>
                        <Badge variant="secondary">Syncing...</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">{t('leo.offline_usage')}</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Offline Sessions</span>
                        <span>34% of total</span>
                      </div>
                      <Progress value={34} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Completion Rate</span>
                        <span>89% offline</span>
                      </div>
                      <Progress value={89} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Content Downloaded</span>
                        <span>3.4GB total</span>
                      </div>
                      <Progress value={76} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">
                  {t('leo.offline_benefits')}
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Learn during commute or travel without connectivity</li>
                  <li>• Reduced data usage and costs</li>
                  <li>• Consistent learning experience regardless of connection quality</li>
                  <li>• Automatic progress sync when back online</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Learning Features */}
        <TabsContent value="social-learning" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    {t('leo.social_learning_features')}
                  </CardTitle>
                  <CardDescription>
                    {t('leo.social_desc')}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={socialLearningEnabled} 
                    onCheckedChange={setSocialLearningEnabled}
                  />
                  <span className="text-sm">
                    {socialLearningEnabled ? t('leo.enabled') : t('leo.disabled')}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
                {socialFeatures.map((feature, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      {feature.icon}
                      <h4 className="font-semibold">{feature.feature}</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Active Users</span>
                        <span>{feature.activeUsers}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Posts/Reviews</span>
                        <span>{feature.posts}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Engagement</span>
                        <span>{feature.engagement}%</span>
                      </div>
                      <Progress value={feature.engagement} className="mt-2" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Card className="p-4">
                  <h4 className="font-semibold mb-3">{t('leo.recent_discussions')}</h4>
                  <div className="space-y-3">
                    <div className="p-3 border rounded">
                      <p className="text-sm font-medium">Excel Advanced Functions</p>
                      <p className="text-xs text-muted-foreground">23 replies • 2 hours ago</p>
                    </div>
                    <div className="p-3 border rounded">
                      <p className="text-sm font-medium">Leadership Challenges</p>
                      <p className="text-xs text-muted-foreground">45 replies • 5 hours ago</p>
                    </div>
                    <div className="p-3 border rounded">
                      <p className="text-sm font-medium">Arabic Business Terms</p>
                      <p className="text-xs text-muted-foreground">12 replies • 1 day ago</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <h4 className="font-semibold mb-3">{t('leo.top_contributors')}</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm">
                          SA
                        </div>
                        <div>
                          <p className="text-sm font-medium">Sarah Ahmed</p>
                          <p className="text-xs text-muted-foreground">234 contributions</p>
                        </div>
                      </div>
                      <Badge>Expert</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-white text-sm">
                          MA
                        </div>
                        <div>
                          <p className="text-sm font-medium">Mohammed Ali</p>
                          <p className="text-xs text-muted-foreground">187 contributions</p>
                        </div>
                      </div>
                      <Badge variant="secondary">Mentor</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-sm">
                          LH
                        </div>
                        <div>
                          <p className="text-sm font-medium">Layla Hassan</p>
                          <p className="text-xs text-muted-foreground">156 contributions</p>
                        </div>
                      </div>
                      <Badge variant="outline">Active</Badge>
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