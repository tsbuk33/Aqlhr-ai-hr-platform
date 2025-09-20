import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/components/layout/UniversalLanguageProvider';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Plus, 
  Video, 
  FileText, 
  Headphones, 
  Image, 
  ExternalLink,
  Star,
  Clock,
  Users,
  Award,
  Globe,
  Zap,
  Play,
  Download
} from 'lucide-react';

export const ContentManagementSystem: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  const courseCatalog = [
    {
      id: 1,
      title: 'Advanced Data Analytics',
      titleAr: 'تحليل البيانات المتقدم',
      category: 'Technical Skills',
      level: 'Advanced',
      duration: '6h 30m',
      modules: 12,
      rating: 4.8,
      enrollments: 1247,
      languages: ['en', 'ar'],
      thumbnail: '/api/placeholder/300/200',
      tags: ['SQL', 'Python', 'Visualization', 'Statistics']
    },
    {
      id: 2,
      title: 'Leadership in Digital Age',
      titleAr: 'القيادة في العصر الرقمي',
      category: 'Leadership',
      level: 'Intermediate',
      duration: '4h 15m',
      modules: 8,
      rating: 4.9,
      enrollments: 2156,
      languages: ['en', 'ar'],
      thumbnail: '/api/placeholder/300/200',
      tags: ['Digital Leadership', 'Change Management', 'Innovation']
    },
    {
      id: 3,
      title: 'Saudi Vision 2030 Implementation',
      titleAr: 'تطبيق رؤية السعودية 2030',
      category: 'Compliance',
      level: 'Beginner',
      duration: '2h 45m',
      modules: 5,
      rating: 4.7,
      enrollments: 3421,
      languages: ['ar', 'en'],
      thumbnail: '/api/placeholder/300/200',
      tags: ['Vision 2030', 'Compliance', 'Strategy']
    }
  ];

  const contentLibrary = [
    {
      type: 'Video',
      count: 1247,
      icon: <Video className="h-5 w-5" />,
      color: 'bg-red-500',
      examples: ['Interactive Tutorials', 'Expert Interviews', 'Case Studies']
    },
    {
      type: 'Audio',
      count: 832,
      icon: <Headphones className="h-5 w-5" />,
      color: 'bg-green-500',
      examples: ['Podcasts', 'Audio Books', 'Language Learning']
    },
    {
      type: 'Interactive',
      count: 654,
      icon: <Zap className="h-5 w-5" />,
      color: 'bg-blue-500',
      examples: ['Simulations', 'Quizzes', 'Virtual Labs']
    },
    {
      type: 'Documents',
      count: 2103,
      icon: <FileText className="h-5 w-5" />,
      color: 'bg-purple-500',
      examples: ['Manuals', 'Research Papers', 'Guidelines']
    }
  ];

  const externalIntegrations = [
    {
      name: 'LinkedIn Learning',
      courses: 16547,
      logo: '/api/placeholder/40/40',
      status: 'Connected',
      sync: 'Auto'
    },
    {
      name: 'Coursera',
      courses: 5200,
      logo: '/api/placeholder/40/40',
      status: 'Connected',
      sync: 'Manual'
    },
    {
      name: 'Udemy Business',
      courses: 8900,
      logo: '/api/placeholder/40/40',
      status: 'Pending',
      sync: 'N/A'
    },
    {
      name: 'Saudi Digital Academy',
      courses: 890,
      logo: '/api/placeholder/40/40',
      status: 'Connected',
      sync: 'Auto'
    }
  ];

  const assessmentEngine = [
    {
      type: 'Multiple Choice',
      count: 1456,
      accuracy: 92,
      avgTime: '45s'
    },
    {
      type: 'Scenario-based',
      count: 789,
      accuracy: 88,
      avgTime: '3m 20s'
    },
    {
      type: 'Practical Tasks',
      count: 234,
      accuracy: 94,
      avgTime: '12m 15s'
    },
    {
      type: 'Peer Assessment',
      count: 167,
      accuracy: 86,
      avgTime: '8m 30s'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BookOpen className="h-8 w-8 text-primary" />
          <div>
            <h2 className="text-2xl font-bold">{t('leo.content_management_title', 'Content Management System')}</h2>
            <p className="text-muted-foreground">
              {t('leo.content_management_desc', 'Comprehensive learning content library and course catalog')}
            </p>
          </div>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          {t('leo.add_content', 'Add Content')}
        </Button>
      </div>

      <Tabs defaultValue="course-catalog" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="course-catalog">{t('leo.course_catalog', 'Course Catalog')}</TabsTrigger>
          <TabsTrigger value="content-library">{t('leo.content_library', 'Content Library')}</TabsTrigger>
          <TabsTrigger value="assessment-engine">{t('leo.assessment_engine', 'Assessment Engine')}</TabsTrigger>
          <TabsTrigger value="integrations">{t('leo.integrations', 'Integrations')}</TabsTrigger>
        </TabsList>

        {/* Course Catalog */}
        <TabsContent value="course-catalog" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{t('leo.bilingual_catalog', 'Bilingual Course Catalog')}</CardTitle>
                  <CardDescription>
                    {t('leo.catalog_desc', 'Arabic and English courses with cultural adaptation')}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    {t('leo.filter', 'Filter')}
                  </Button>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={t('leo.search_courses', 'Search courses...')}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {courseCatalog.map((course) => (
                  <Card key={course.id} className="hover:bg-muted/50 transition-colors">
                    <div className="aspect-video bg-muted rounded-t-lg flex items-center justify-center">
                      <Play className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <CardContent className="p-4 space-y-3">
                      <div>
                        <h4 className="font-semibold">{course.title}</h4>
                        <p className="text-sm text-muted-foreground" style={{ direction: 'rtl' }}>
                          {course.titleAr}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{course.category}</Badge>
                        <Badge variant={course.level === 'Beginner' ? 'default' : 
                                      course.level === 'Intermediate' ? 'secondary' : 'destructive'}>
                          {course.level}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {course.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          {course.modules} modules
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{course.rating}</span>
                          <span className="text-sm text-muted-foreground">
                            ({course.enrollments})
                          </span>
                        </div>
                        <div className="flex gap-1">
                          {course.languages.map((lang) => (
                            <Badge key={lang} variant="outline" className="text-xs">
                              {lang.toUpperCase()}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {course.tags.slice(0, 3).map((tag, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <Button className="w-full">
                        <Play className="h-4 w-4 mr-2" />
                        {t('leo.start_course', 'Start Course')}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Library */}
        <TabsContent value="content-library" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('leo.multimedia_library', 'Multimedia Content Library')}</CardTitle>
              <CardDescription>
                {t('leo.library_desc', 'Diverse content formats for optimal learning experiences')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {contentLibrary.map((content, index) => (
                  <div key={index} className="text-center p-6 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className={`inline-flex p-3 rounded-full ${content.color} text-white mb-4`}>
                      {content.icon}
                    </div>
                    <h4 className="font-semibold mb-2">{content.type}</h4>
                    <p className="text-3xl font-bold text-primary mb-2">{content.count.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground mb-4">Available items</p>
                    
                    <div className="space-y-2">
                      {content.examples.map((example, i) => (
                        <div key={i} className="text-xs p-2 bg-muted rounded">
                          {example}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <Card className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Globe className="h-5 w-5 text-blue-500" />
                    <h4 className="font-semibold">{t('leo.multilingual_support', 'Multilingual Support')}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Content available in Arabic and English with automatic translation capabilities
                  </p>
                </Card>
                
                <Card className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Award className="h-5 w-5 text-green-500" />
                    <h4 className="font-semibold">{t('leo.quality_assured', 'Quality Assured')}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    All content reviewed by subject matter experts and pedagogy specialists
                  </p>
                </Card>
                
                <Card className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Download className="h-5 w-5 text-purple-500" />
                    <h4 className="font-semibold">{t('leo.offline_access', 'Offline Access')}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Download content for offline learning and mobile accessibility
                  </p>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Assessment Engine */}
        <TabsContent value="assessment-engine" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('leo.quiz_assessment_engine', 'Assessment & Quiz Engine')}</CardTitle>
              <CardDescription>
                {t('leo.assessment_desc', 'Comprehensive assessment tools with advanced analytics')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {assessmentEngine.map((assessment, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-3">{assessment.type}</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Questions</span>
                        <span className="font-medium">{assessment.count}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Accuracy</span>
                        <span className="font-medium">{assessment.accuracy}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Avg Time</span>
                        <span className="font-medium">{assessment.avgTime}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-4">
                <h4 className="font-semibold">{t('leo.certification_tracking', 'Certification Tracking')}</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-medium">Internal Certifications</h5>
                      <Badge>247 Active</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Company-specific certifications with automated tracking and renewal reminders
                    </p>
                  </Card>
                  
                  <Card className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-medium">External Certifications</h5>
                      <Badge variant="secondary">89 Tracked</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Integration with external certification bodies for comprehensive tracking
                    </p>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* External Integrations */}
        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('leo.external_integrations', 'External Content Integration')}</CardTitle>
              <CardDescription>
                {t('leo.integration_desc', 'Seamless integration with leading learning platforms')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {externalIntegrations.map((integration, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                        <ExternalLink className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{integration.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {integration.courses.toLocaleString()} courses available
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Badge variant={integration.status === 'Connected' ? 'default' : 
                                    integration.status === 'Pending' ? 'secondary' : 'destructive'}>
                        {integration.status}
                      </Badge>
                      {integration.sync !== 'N/A' && (
                        <Badge variant="outline">
                          {integration.sync} Sync
                        </Badge>
                      )}
                      <Button size="sm" variant="outline">
                        {integration.status === 'Connected' ? 'Configure' : 'Connect'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">
                  {t('leo.integration_benefits', 'Integration Benefits')}
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Single sign-on access to all platforms</li>
                  <li>• Unified progress tracking and analytics</li>
                  <li>• Automated content synchronization</li>
                  <li>• Consolidated certification management</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};