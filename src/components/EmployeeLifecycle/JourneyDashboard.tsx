import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  TrendingUp,
  Users,
  Calendar,
  Target,
  BookOpen,
  Globe
} from "lucide-react";
import { useLocale } from '../LocaleDriver';
import { EmployeeJourney, LifecycleStage, LifecycleTask } from '../../types/employee-lifecycle';
import { EmployeeJourneyService } from '../../services/employee-journey.service';

export const JourneyDashboard: React.FC = () => {
  const { t, isRTL } = useLocale();
  const [journeys, setJourneys] = useState<EmployeeJourney[]>([]);
  const [selectedJourney, setSelectedJourney] = useState<EmployeeJourney | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for demonstration
  useEffect(() => {
    const mockJourneys: EmployeeJourney[] = [
      {
        id: 'journey_1',
        employeeId: 'emp_001',
        companyId: 'company_1',
        currentStage: 'onboarding',
        stages: [
          {
            stage: 'onboarding',
            status: 'in-progress',
            startDate: new Date('2024-01-15'),
            assignedTo: ['hr-manager', 'direct-manager'],
            tasks: [
              {
                id: 'task_1',
                title: 'Complete Employee Documentation',
                titleAr: 'إكمال وثائق الموظف',
                description: 'Fill out all required forms and documentation',
                descriptionAr: 'املأ جميع النماذج والوثائق المطلوبة',
                assignedTo: 'emp_001',
                assignedToRole: 'employee',
                dueDate: new Date('2024-01-20'),
                priority: 'high',
                status: 'completed',
                dependencies: [],
                estimatedHours: 2,
                notes: '',
                notesAr: '',
                category: 'administrative',
                completedAt: new Date('2024-01-18')
              },
              {
                id: 'task_2',
                title: 'Saudi Cultural Orientation',
                titleAr: 'التوجيه الثقافي السعودي',
                description: 'Attend cultural orientation session',
                descriptionAr: 'حضور جلسة التوجيه الثقافي',
                assignedTo: 'emp_001',
                assignedToRole: 'employee',
                dueDate: new Date('2024-01-25'),
                priority: 'high',
                status: 'in-progress',
                dependencies: [],
                estimatedHours: 8,
                notes: '',
                notesAr: '',
                category: 'cultural'
              }
            ],
            documents: [],
            milestones: [],
            feedback: [],
            aiInsights: [
              {
                id: 'insight_1',
                type: 'recommendation',
                title: 'Accelerated Cultural Integration',
                titleAr: 'التكامل الثقافي المعجل',
                description: 'Employee shows strong cultural adaptation. Consider advanced integration activities.',
                descriptionAr: 'يظهر الموظف تكيفاً ثقافياً قوياً. فكر في أنشطة التكامل المتقدمة.',
                confidence: 85,
                impact: 'medium',
                actionable: true,
                actions: ['Schedule mentorship sessions', 'Introduce to cultural ambassadors'],
                actionsAr: ['جدولة جلسات الإرشاد', 'التعريف بسفراء الثقافة'],
                generatedAt: new Date('2024-01-16'),
                aiModel: 'manus'
              }
            ],
            completionPercentage: 65
          }
        ],
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-18'),
        personalizedPlan: {
          learningStyle: 'visual',
          culturalBackground: 'International',
          languagePreference: 'bilingual',
          experienceLevel: 'mid',
          skillGaps: [
            {
              skill: 'Arabic Business Communication',
              skillAr: 'التواصل التجاري بالعربية',
              currentLevel: 4,
              targetLevel: 7,
              priority: 'high',
              developmentPlan: 'Intensive Arabic business course',
              developmentPlanAr: 'دورة مكثفة في العربية التجارية',
              estimatedTimeframe: '6 months'
            }
          ],
          careerAspirations: ['Team Lead', 'Regional Manager'],
          careerAspirationsAr: ['قائد الفريق', 'مدير إقليمي'],
          mentorshipPreferences: {
            preferredMentorProfile: 'Senior manager with multicultural experience',
            preferredMentorProfileAr: 'مدير أول بخبرة متعددة الثقافات',
            meetingFrequency: 'biweekly',
            communicationStyle: 'mixed',
            focusAreas: ['Leadership', 'Cultural Integration'],
            focusAreasAr: ['القيادة', 'التكامل الثقافي']
          },
          developmentGoals: []
        },
        culturalIntegration: {
          saudiCultureOrientation: [
            {
              id: 'culture_101',
              title: 'Saudi Culture Fundamentals',
              titleAr: 'أساسيات الثقافة السعودية',
              description: 'Basic understanding of Saudi culture and values',
              descriptionAr: 'فهم أساسي للثقافة والقيم السعودية',
              duration: '4 hours',
              completed: true,
              completedDate: new Date('2024-01-17')
            }
          ],
          islamicWorkplaceEtiquette: [
            {
              category: 'prayer_times',
              guidelines: ['Respect prayer schedules', 'Provide prayer facilities'],
              guidelinesAr: ['احترام مواعيد الصلاة', 'توفير مرافق الصلاة'],
              importance: 'high',
              understood: true,
              acknowledgedAt: new Date('2024-01-16')
            }
          ],
          localCustomsTraining: [],
          languageDevelopment: {
            currentLevel: { arabic: 'intermediate', english: 'advanced' },
            targetLevel: { arabic: 'advanced', english: 'native' },
            learningPlan: [],
            progress: []
          },
          socialIntegration: {
            teamIntroductions: [],
            networkingOpportunities: [],
            culturalEvents: [],
            buddySystem: {
              buddy: {
                id: 'buddy_1',
                name: 'Ahmed Al-Rashid',
                role: 'Senior Analyst',
                department: 'Finance',
                experience: '5 years'
              },
              matchingCriteria: ['Same department', 'Cultural bridge', 'Language skills'],
              matchingCriteriaAr: ['نفس القسم', 'جسر ثقافي', 'مهارات لغوية'],
              meetings: [
                {
                  date: new Date('2024-01-16'),
                  duration: 60,
                  topics: ['Office culture', 'Team dynamics'],
                  topicsAr: ['ثقافة المكتب', 'ديناميكيات الفريق'],
                  outcomes: ['Good rapport established', 'Next meeting scheduled'],
                  outcomesAr: ['تم إنشاء علاقة جيدة', 'تم جدولة الاجتماع التالي'],
                  nextMeeting: new Date('2024-01-23')
                }
              ],
              relationship: 'active',
              feedback: []
            },
            communityInvolvement: []
          }
        }
      }
    ];
    
    setJourneys(mockJourneys);
    setSelectedJourney(mockJourneys[0]);
    setLoading(false);
  }, []);

  const getStageProgress = (journey: EmployeeJourney): number => {
    const currentStageData = journey.stages.find(s => s.stage === journey.currentStage);
    return currentStageData?.completionPercentage || 0;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'secondary', icon: Clock, label: t('journey.status.pending') },
      'in-progress': { color: 'default', icon: TrendingUp, label: t('journey.status.inProgress') },
      completed: { color: 'default', icon: CheckCircle, label: t('journey.status.completed') },
      overdue: { color: 'destructive', icon: AlertCircle, label: t('journey.status.overdue') }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.color as any} className="flex items-center space-x-1">
        <Icon className="h-3 w-3" />
        <span>{config.label}</span>
      </Badge>
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`journey-dashboard space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {t('journey.dashboard.title')}
        </h1>
        <p className="text-muted-foreground mt-2">
          {t('journey.dashboard.description')}
        </p>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t('journey.metrics.activeJourneys')}
                </p>
                <p className="text-2xl font-bold">{journeys.length}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t('journey.metrics.avgProgress')}
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {Math.round(journeys.reduce((sum, j) => sum + getStageProgress(j), 0) / journeys.length)}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t('journey.metrics.onboarding')}
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {journeys.filter(j => j.currentStage === 'onboarding').length}
                </p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t('journey.metrics.cultural')}
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {journeys.filter(j => 
                    j.culturalIntegration.saudiCultureOrientation.some(m => m.completed)
                  ).length}
                </p>
              </div>
              <Globe className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">{t('journey.tabs.overview')}</TabsTrigger>
          <TabsTrigger value="tasks">{t('journey.tabs.tasks')}</TabsTrigger>
          <TabsTrigger value="cultural">{t('journey.tabs.cultural')}</TabsTrigger>
          <TabsTrigger value="insights">{t('journey.tabs.insights')}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Journey List */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>{t('journey.overview.activeJourneys')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {journeys.map((journey) => (
                      <div
                        key={journey.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-accent/50 ${
                          selectedJourney?.id === journey.id ? 'border-primary bg-accent/30' : ''
                        }`}
                        onClick={() => setSelectedJourney(journey)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <User className="h-5 w-5 text-primary" />
                            <span className="font-medium">{journey.employeeId}</span>
                          </div>
                          {getStatusBadge(journey.stages.find(s => s.stage === journey.currentStage)?.status || 'pending')}
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{t('journey.currentStage')}</span>
                            <span className="capitalize">{journey.currentStage}</span>
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>{t('journey.progress')}</span>
                              <span>{getStageProgress(journey)}%</span>
                            </div>
                            <Progress value={getStageProgress(journey)} className="h-2" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Journey Details */}
            <div className="lg:col-span-2">
              {selectedJourney && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <User className="h-5 w-5" />
                      <span>{t('journey.details.title')} - {selectedJourney.employeeId}</span>
                    </CardTitle>
                    <CardDescription>
                      {t('journey.details.currentStage')}: {selectedJourney.currentStage}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Stage Progress */}
                      <div>
                        <h3 className="font-semibold mb-4">{t('journey.details.stageProgress')}</h3>
                        <div className="space-y-3">
                          {selectedJourney.stages.map((stage) => (
                            <div key={stage.stage} className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className={`w-3 h-3 rounded-full ${
                                  stage.status === 'completed' ? 'bg-green-500' :
                                  stage.status === 'in-progress' ? 'bg-blue-500' :
                                  'bg-gray-300'
                                }`} />
                                <span className="capitalize">{stage.stage}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-muted-foreground">
                                  {stage.completionPercentage}%
                                </span>
                                {getStatusBadge(stage.status)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Cultural Integration Status */}
                      <div>
                        <h3 className="font-semibold mb-4">{t('journey.details.culturalIntegration')}</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 bg-accent/50 rounded-lg">
                            <div className="text-sm font-medium">{t('journey.cultural.orientation')}</div>
                            <div className="text-sm text-muted-foreground">
                              {selectedJourney.culturalIntegration.saudiCultureOrientation.filter(m => m.completed).length}/
                              {selectedJourney.culturalIntegration.saudiCultureOrientation.length} {t('journey.cultural.completed')}
                            </div>
                          </div>
                          <div className="p-3 bg-accent/50 rounded-lg">
                            <div className="text-sm font-medium">{t('journey.cultural.buddy')}</div>
                            <div className="text-sm text-muted-foreground">
                              {selectedJourney.culturalIntegration.socialIntegration.buddySystem.buddy.name}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6">
          {selectedJourney && (
            <Card>
              <CardHeader>
                <CardTitle>{t('journey.tasks.title')}</CardTitle>
                <CardDescription>
                  {t('journey.tasks.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedJourney.stages
                    .find(s => s.stage === selectedJourney.currentStage)
                    ?.tasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-4 h-4 rounded-full ${
                          task.status === 'completed' ? 'bg-green-500' :
                          task.status === 'in-progress' ? 'bg-blue-500' :
                          task.status === 'overdue' ? 'bg-red-500' :
                          'bg-gray-300'
                        }`} />
                        <div>
                          <h4 className="font-medium">{task.title}</h4>
                          <p className="text-sm text-muted-foreground">{task.description}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-xs text-muted-foreground">
                              {t('journey.tasks.due')}: {task.dueDate.toLocaleDateString()}
                            </span>
                            <span className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
                              {task.priority} {t('journey.tasks.priority')}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(task.status)}
                        {task.status !== 'completed' && (
                          <Button size="sm" variant="outline">
                            {t('journey.tasks.complete')}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="cultural" className="space-y-6">
          {selectedJourney && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('journey.cultural.orientationModules')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedJourney.culturalIntegration.saudiCultureOrientation.map((module) => (
                      <div key={module.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{module.title}</h4>
                          <p className="text-sm text-muted-foreground">{module.duration}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {module.completed ? (
                            <Badge variant="default">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              {t('journey.cultural.completed')}
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              <Clock className="h-3 w-3 mr-1" />
                              {t('journey.cultural.pending')}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('journey.cultural.buddySystem')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <User className="h-8 w-8 text-primary" />
                      <div>
                        <h4 className="font-medium">
                          {selectedJourney.culturalIntegration.socialIntegration.buddySystem.buddy.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {selectedJourney.culturalIntegration.socialIntegration.buddySystem.buddy.role}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="font-medium mb-2">{t('journey.cultural.recentMeetings')}</h5>
                      {selectedJourney.culturalIntegration.socialIntegration.buddySystem.meetings.map((meeting, index) => (
                        <div key={index} className="p-3 bg-accent/50 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-sm font-medium">
                              {meeting.date.toLocaleDateString()}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {meeting.duration} {t('journey.cultural.minutes')}
                            </span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {t('journey.cultural.topics')}: {meeting.topics.join(', ')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          {selectedJourney && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
                    <span className="text-white text-sm font-bold">AI</span>
                  </div>
                  <span>{t('journey.insights.title')}</span>
                </CardTitle>
                <CardDescription>
                  {t('journey.insights.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedJourney.stages
                    .find(s => s.stage === selectedJourney.currentStage)
                    ?.aiInsights.map((insight) => (
                    <div key={insight.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium">{insight.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
                        </div>
                        <Badge variant={insight.impact === 'high' ? 'destructive' : 'secondary'}>
                          {insight.impact} {t('journey.insights.impact')}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                        <span>{t('journey.insights.confidence')}: {insight.confidence}%</span>
                        <span>{t('journey.insights.model')}: {insight.aiModel}</span>
                        <span>{insight.generatedAt.toLocaleDateString()}</span>
                      </div>

                      {insight.actionable && insight.actions && (
                        <div>
                          <h5 className="font-medium text-sm mb-2">{t('journey.insights.actions')}</h5>
                          <div className="space-y-1">
                            {insight.actions.map((action, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <Target className="h-3 w-3 text-primary" />
                                <span className="text-sm">{action}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};