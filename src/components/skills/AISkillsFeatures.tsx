import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Map, 
  BookOpen, 
  Users,
  Lightbulb,
  ArrowUp,
  ArrowDown,
  Activity,
  Calendar,
  Award,
  Zap
} from 'lucide-react';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

// AI Skills data
const skillsGapAnalysis = [
  {
    skill: 'Cloud Architecture',
    currentLevel: 65,
    requiredLevel: 90,
    gap: -25,
    demandForecast: 95,
    trainingROI: 340,
    priority: 'High',
    timeToClose: '6 months'
  },
  {
    skill: 'AI/Machine Learning',
    currentLevel: 40,
    requiredLevel: 80,
    gap: -40,
    demandForecast: 88,
    trainingROI: 450,
    priority: 'Critical',
    timeToClose: '12 months'
  },
  {
    skill: 'Data Science',
    currentLevel: 55,
    requiredLevel: 75,
    gap: -20,
    demandForecast: 82,
    trainingROI: 280,
    priority: 'Medium',
    timeToClose: '4 months'
  },
  {
    skill: 'Cybersecurity',
    currentLevel: 70,
    requiredLevel: 85,
    gap: -15,
    demandForecast: 90,
    trainingROI: 320,
    priority: 'High',
    timeToClose: '3 months'
  }
];

const careerPathwaysData = [
  {
    employee: 'Ahmed Al-Mansouri',
    currentRole: 'Senior Developer',
    nextRole: 'Tech Lead',
    pathType: 'Technical Leadership',
    skillsRequired: ['Team Management', 'Architecture Design', 'Mentoring'],
    currentSkillMatch: 75,
    estimatedTimeframe: '8-12 months',
    recommendedActions: [
      'Complete Leadership Development Program',
      'Lead 2 major projects',
      'Mentor junior developers'
    ]
  },
  {
    employee: 'Fatima Al-Zahra',
    currentRole: 'Marketing Specialist',
    nextRole: 'Marketing Manager',
    pathType: 'Management Track',
    skillsRequired: ['Budget Management', 'Team Leadership', 'Strategic Planning'],
    currentSkillMatch: 68,
    estimatedTimeframe: '6-10 months',
    recommendedActions: [
      'MBA or Management Certificate',
      'Cross-functional project leadership',
      'Budget planning experience'
    ]
  }
];

const learningRecommendations = [
  {
    type: 'Adaptive Learning',
    title: 'Personalized Cloud Architecture Path',
    description: 'AI-curated learning journey based on current skills and career goals',
    duration: '3 months',
    completion: 65,
    modules: 12,
    priority: 'High'
  },
  {
    type: 'Micro-Learning',
    title: 'Daily AI/ML Concepts',
    description: '15-minute daily sessions on machine learning fundamentals',
    duration: '6 weeks',
    completion: 40,
    modules: 42,
    priority: 'Medium'
  },
  {
    type: 'Project-Based',
    title: 'Real-World Data Science Projects',
    description: 'Hands-on projects with actual company datasets',
    duration: '4 months',
    completion: 25,
    modules: 8,
    priority: 'High'
  }
];

const mentorshipMatches = [
  {
    mentee: 'Omar Hassan',
    mentor: 'Dr. Sarah Al-Ahmad',
    skillFocus: 'Machine Learning',
    matchScore: 94,
    sessionCount: 8,
    progress: 78
  },
  {
    mentee: 'Laila Mahmoud',
    mentor: 'Mohammed Al-Rashid',
    skillFocus: 'Leadership',
    matchScore: 89,
    sessionCount: 6,
    progress: 65
  }
];

const skillsDemandForecast = [
  { month: 'Jan 2024', cloudArchitecture: 85, aiml: 75, dataScience: 70, cybersecurity: 80 },
  { month: 'Apr 2024', cloudArchitecture: 88, aiml: 82, dataScience: 75, cybersecurity: 85 },
  { month: 'Jul 2024', cloudArchitecture: 92, aiml: 88, dataScience: 80, cybersecurity: 88 },
  { month: 'Oct 2024', cloudArchitecture: 95, aiml: 95, dataScience: 85, cybersecurity: 92 },
  { month: 'Jan 2025', cloudArchitecture: 98, aiml: 98, dataScience: 90, cybersecurity: 95 }
];

export const AISkillsFeatures: React.FC = () => {
  const { isArabic } = useSimpleLanguage();
  const [selectedAnalysis, setSelectedAnalysis] = useState('gap-analysis');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* AI Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-800">
                {isArabic ? 'دقة التنبؤ بالمهارات' : 'Skills Prediction Accuracy'}
              </span>
            </div>
            <div className="text-2xl font-bold text-blue-600">94.2%</div>
            <div className="text-sm text-blue-600/70">
              {isArabic ? 'تحسن بنسبة 12% هذا الشهر' : '↑ 12% improvement this month'}
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-800">
                {isArabic ? 'نجاح خطط التطوير' : 'Development Plans Success'}
              </span>
            </div>
            <div className="text-2xl font-bold text-green-600">87%</div>
            <div className="text-sm text-green-600/70">
              {isArabic ? 'من الخطط المكتملة بنجاح' : 'of plans completed successfully'}
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Map className="w-5 h-5 text-purple-600" />
              <span className="font-medium text-purple-800">
                {isArabic ? 'مسارات مهنية نشطة' : 'Active Career Pathways'}
              </span>
            </div>
            <div className="text-2xl font-bold text-purple-600">156</div>
            <div className="text-sm text-purple-600/70">
              {isArabic ? 'مسار مخصص للموظفين' : 'personalized employee pathways'}
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-5 h-5 text-orange-600" />
              <span className="font-medium text-orange-800">
                {isArabic ? 'عائد تدريب المهارات' : 'Skills Training ROI'}
              </span>
            </div>
            <div className="text-2xl font-bold text-orange-600">340%</div>
            <div className="text-sm text-orange-600/70">
              {isArabic ? 'متوسط العائد على الاستثمار' : 'average return on investment'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Features Tabs */}
      <Tabs value={selectedAnalysis} onValueChange={setSelectedAnalysis} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="gap-analysis">
            {isArabic ? 'تحليل الفجوات' : 'Gap Analysis'}
          </TabsTrigger>
          <TabsTrigger value="career-pathways">
            {isArabic ? 'المسارات المهنية' : 'Career Pathways'}
          </TabsTrigger>
          <TabsTrigger value="development-engine">
            {isArabic ? 'محرك التطوير' : 'Development Engine'}
          </TabsTrigger>
        </TabsList>

        {/* Skills Gap Analysis */}
        <TabsContent value="gap-analysis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                {isArabic ? 'تحليل فجوات المهارات المدعوم بالذكاء الاصطناعي' : 'AI-Powered Skills Gap Analysis'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Future Skills Demand Forecast */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">
                    {isArabic ? 'توقع الطلب على المهارات المستقبلية' : 'Future Skills Demand Forecast'}
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={skillsDemandForecast}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="cloudArchitecture" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                      <Area type="monotone" dataKey="aiml" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                      <Area type="monotone" dataKey="dataScience" stackId="3" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
                      <Area type="monotone" dataKey="cybersecurity" stackId="4" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Skills Gap Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {skillsGapAnalysis.map((skill, index) => (
                    <Card key={index} className="border-l-4 border-l-red-400">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-lg">{skill.skill}</h4>
                          <Badge className={`${getPriorityColor(skill.priority)} border`}>
                            {isArabic 
                              ? skill.priority === 'Critical' ? 'حرج'
                                : skill.priority === 'High' ? 'عالي'
                                : skill.priority === 'Medium' ? 'متوسط' : skill.priority
                              : skill.priority
                            }
                          </Badge>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>{isArabic ? 'المستوى الحالي:' : 'Current Level:'}</span>
                              <span>{skill.currentLevel}%</span>
                            </div>
                            <Progress value={skill.currentLevel} className="h-2 mb-1" />
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">{isArabic ? 'المطلوب:' : 'Required:'} {skill.requiredLevel}%</span>
                              <span className="text-red-600 font-medium">{isArabic ? 'الفجوة:' : 'Gap:'} {skill.gap}%</span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">{isArabic ? 'توقع الطلب:' : 'Demand Forecast:'}</span>
                              <div className="font-semibold text-blue-600">{skill.demandForecast}%</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">{isArabic ? 'عائد التدريب:' : 'Training ROI:'}</span>
                              <div className="font-semibold text-green-600">{skill.trainingROI}%</div>
                            </div>
                          </div>
                          
                          <div className="pt-2 border-t">
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="w-4 h-4 text-muted-foreground" />
                              <span className="text-muted-foreground">
                                {isArabic ? 'وقت سد الفجوة:' : 'Time to close gap:'} {skill.timeToClose}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Skills-based Hiring Recommendations */}
                <Card className="border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-800">
                      <Users className="w-5 h-5" />
                      {isArabic ? 'توصيات التوظيف القائم على المهارات' : 'Skills-based Hiring Recommendations'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Alert>
                        <ArrowUp className="h-4 w-4" />
                        <AlertDescription>
                          {isArabic 
                            ? 'أولوية عالية: توظيف 3 مهندسين AI/ML'
                            : 'High Priority: Hire 3 AI/ML Engineers'
                          }
                        </AlertDescription>
                      </Alert>
                      <Alert>
                        <ArrowUp className="h-4 w-4" />
                        <AlertDescription>
                          {isArabic 
                            ? 'أولوية متوسطة: توظيف 2 معماريين سحابيين'
                            : 'Medium Priority: Hire 2 Cloud Architects'
                          }
                        </AlertDescription>
                      </Alert>
                      <Alert className="border-blue-200 bg-blue-50">
                        <Lightbulb className="h-4 w-4" />
                        <AlertDescription>
                          {isArabic 
                            ? 'اقتراح: برنامج تدريب داخلي للأمن السيبراني'
                            : 'Suggestion: Internal Cybersecurity Training Program'
                          }
                        </AlertDescription>
                      </Alert>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Career Pathway Intelligence */}
        <TabsContent value="career-pathways" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Map className="w-5 h-5" />
                {isArabic ? 'ذكاء المسارات المهنية' : 'Career Pathway Intelligence'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {careerPathwaysData.map((pathway, index) => (
                  <Card key={index} className="border-purple-200 bg-purple-50">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-semibold text-lg">{pathway.employee}</h4>
                          <p className="text-muted-foreground">{pathway.currentRole} → {pathway.nextRole}</p>
                        </div>
                        <Badge variant="outline" className="bg-white">
                          {pathway.pathType}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h5 className="font-medium mb-3">
                            {isArabic ? 'المهارات المطلوبة:' : 'Skills Required:'}
                          </h5>
                          <div className="space-y-2">
                            {pathway.skillsRequired.map((skill, skillIndex) => (
                              <div key={skillIndex} className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                <span className="text-sm">{skill}</span>
                              </div>
                            ))}
                          </div>
                          
                          <div className="mt-4">
                            <div className="flex justify-between text-sm mb-1">
                              <span>{isArabic ? 'مطابقة المهارات الحالية:' : 'Current Skills Match:'}</span>
                              <span>{pathway.currentSkillMatch}%</span>
                            </div>
                            <Progress value={pathway.currentSkillMatch} className="h-2" />
                          </div>
                        </div>
                        
                        <div>
                          <h5 className="font-medium mb-3">
                            {isArabic ? 'الإجراءات الموصى بها:' : 'Recommended Actions:'}
                          </h5>
                          <div className="space-y-2">
                            {pathway.recommendedActions.map((action, actionIndex) => (
                              <div key={actionIndex} className="flex items-start gap-2">
                                <Activity className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">{action}</span>
                              </div>
                            ))}
                          </div>
                          
                          <div className="mt-4 p-3 bg-white rounded-lg border">
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="w-4 h-4 text-muted-foreground" />
                              <span className="text-muted-foreground">
                                {isArabic ? 'الإطار الزمني المتوقع:' : 'Estimated Timeframe:'} {pathway.estimatedTimeframe}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {/* Internal Mobility Recommendations */}
                <Card className="border-blue-200 bg-blue-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-800">
                      <ArrowUp className="w-5 h-5" />
                      {isArabic ? 'توصيات التنقل الداخلي' : 'Internal Mobility Recommendations'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-white rounded-lg border">
                        <h4 className="font-medium mb-2">
                          {isArabic ? 'الفرص عبر الوظائف' : 'Cross-functional Opportunities'}
                        </h4>
                        <div className="text-2xl font-bold text-blue-600">23</div>
                        <p className="text-sm text-muted-foreground">
                          {isArabic ? 'فرصة متاحة هذا الربع' : 'opportunities available this quarter'}
                        </p>
                      </div>
                      <div className="p-4 bg-white rounded-lg border">
                        <h4 className="font-medium mb-2">
                          {isArabic ? 'معدل نجاح التنقل' : 'Mobility Success Rate'}
                        </h4>
                        <div className="text-2xl font-bold text-green-600">84%</div>
                        <p className="text-sm text-muted-foreground">
                          {isArabic ? 'للمرشحين المطابقين لمعايير الذكاء الاصطناعي' : 'for AI-matched candidates'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Skills Development Engine */}
        <TabsContent value="development-engine" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                {isArabic ? 'محرك تطوير المهارات' : 'Skills Development Engine'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Learning Recommendations */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    {isArabic ? 'توصيات التعلم التكيفي' : 'Adaptive Learning Recommendations'}
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {learningRecommendations.map((rec, index) => (
                      <Card key={index} className="border-l-4 border-l-green-500">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-3">
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              {rec.type}
                            </Badge>
                            <Badge className={`${getPriorityColor(rec.priority)} border`}>
                              {isArabic 
                                ? rec.priority === 'High' ? 'عالي' : rec.priority === 'Medium' ? 'متوسط' : rec.priority
                                : rec.priority
                              }
                            </Badge>
                          </div>
                          
                          <h4 className="font-medium mb-2">{rec.title}</h4>
                          <p className="text-sm text-muted-foreground mb-4">{rec.description}</p>
                          
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>{isArabic ? 'التقدم:' : 'Progress:'}</span>
                                <span>{rec.completion}%</span>
                              </div>
                              <Progress value={rec.completion} className="h-2" />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="text-muted-foreground">{isArabic ? 'المدة:' : 'Duration:'}</span>
                                <div className="font-medium">{rec.duration}</div>
                              </div>
                              <div>
                                <span className="text-muted-foreground">{isArabic ? 'الوحدات:' : 'Modules:'}</span>
                                <div className="font-medium">{rec.modules}</div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Mentorship Matching */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      {isArabic ? 'مطابقة الإرشاد' : 'Mentorship Matching'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mentorshipMatches.map((match, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-4">
                              <div>
                                <h4 className="font-medium">{match.mentee}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {isArabic ? 'تحت إرشاد:' : 'Mentored by:'} {match.mentor}
                                </p>
                              </div>
                              <Badge variant="outline">{match.skillFocus}</Badge>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-6">
                            <div className="text-center">
                              <div className="text-sm text-muted-foreground">{isArabic ? 'نقاط التطابق' : 'Match Score'}</div>
                              <div className="font-bold text-green-600">{match.matchScore}%</div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm text-muted-foreground">{isArabic ? 'الجلسات' : 'Sessions'}</div>
                              <div className="font-bold">{match.sessionCount}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm text-muted-foreground">{isArabic ? 'التقدم' : 'Progress'}</div>
                              <div className="font-bold text-blue-600">{match.progress}%</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Project-based Skill Building */}
                <Card className="border-orange-200 bg-orange-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-orange-800">
                      <Activity className="w-5 h-5" />
                      {isArabic ? 'بناء المهارات القائم على المشاريع' : 'Project-based Skill Building'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-white rounded-lg border">
                        <div className="text-2xl font-bold text-orange-600">18</div>
                        <div className="text-sm text-muted-foreground">
                          {isArabic ? 'مشاريع نشطة لبناء المهارات' : 'Active skill-building projects'}
                        </div>
                      </div>
                      <div className="text-center p-4 bg-white rounded-lg border">
                        <div className="text-2xl font-bold text-blue-600">76%</div>
                        <div className="text-sm text-muted-foreground">
                          {isArabic ? 'معدل إنجاز المشاريع' : 'Project completion rate'}
                        </div>
                      </div>
                      <div className="text-center p-4 bg-white rounded-lg border">
                        <div className="text-2xl font-bold text-green-600">4.2</div>
                        <div className="text-sm text-muted-foreground">
                          {isArabic ? 'متوسط تحسن مستوى المهارات' : 'Avg. skill level improvement'}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};