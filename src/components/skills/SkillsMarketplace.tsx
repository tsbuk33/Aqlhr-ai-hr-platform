import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Store, 
  Users, 
  ThumbsUp, 
  Star, 
  Search, 
  Filter,
  Briefcase,
  Clock,
  Award,
  TrendingUp,
  Target,
  CheckCircle,
  Globe,
  BarChart3
} from 'lucide-react';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';

// Skills marketplace data
const skillsMarketplaceProjects = [
  {
    id: '1',
    title: 'AI-Powered Customer Analytics Dashboard',
    title_ar: 'لوحة تحليلات العملاء المدعومة بالذكاء الاصطناعي',
    department: 'Marketing',
    requiredSkills: ['Machine Learning', 'Python', 'Data Visualization', 'SQL'],
    duration: '3 months',
    workload: '20% time allocation',
    skillLevel: 'Intermediate',
    postedBy: 'Sarah Al-Ahmad',
    applicants: 8,
    matchScore: 94,
    description: 'Build an advanced analytics dashboard using AI to predict customer behavior and optimize marketing campaigns.',
    description_ar: 'بناء لوحة تحليلات متقدمة باستخدام الذكاء الاصطناعي لتوقع سلوك العملاء وتحسين الحملات التسويقية.'
  },
  {
    id: '2',
    title: 'Cloud Migration Strategy Implementation',
    title_ar: 'تنفيذ استراتيجية الترحيل السحابي',
    department: 'IT Infrastructure',
    requiredSkills: ['AWS', 'Cloud Architecture', 'DevOps', 'Security'],
    duration: '4 months',
    workload: '30% time allocation',
    skillLevel: 'Advanced',
    postedBy: 'Mohammed Al-Rashid',
    applicants: 12,
    matchScore: 87,
    description: 'Lead the migration of legacy systems to cloud infrastructure with emphasis on security and scalability.',
    description_ar: 'قيادة ترحيل الأنظمة القديمة إلى البنية التحتية السحابية مع التركيز على الأمان وقابلية التوسع.'
  },
  {
    id: '3',
    title: 'Employee Engagement Mobile App',
    title_ar: 'تطبيق جوال لمشاركة الموظفين',
    department: 'HR Technology',
    requiredSkills: ['React Native', 'UX Design', 'Mobile Development', 'API Integration'],
    duration: '6 months',
    workload: '25% time allocation',
    skillLevel: 'Intermediate',
    postedBy: 'Fatima Al-Zahra',
    applicants: 15,
    matchScore: 91,
    description: 'Develop a mobile application to enhance employee engagement and streamline HR processes.',
    description_ar: 'تطوير تطبيق جوال لتعزيز مشاركة الموظفين وتبسيط عمليات الموارد البشرية.'
  }
];

const peerEndorsements = [
  {
    skill: 'Machine Learning',
    endorsedBy: [
      { name: 'Dr. Ahmed Hassan', department: 'Data Science', title: 'Senior Data Scientist' },
      { name: 'Sarah Al-Ahmad', department: 'Analytics', title: 'Analytics Manager' },
      { name: 'Omar Al-Mansouri', department: 'Engineering', title: 'ML Engineer' }
    ],
    totalEndorsements: 23,
    recentGrowth: '+8 this month'
  },
  {
    skill: 'Cloud Architecture',
    endorsedBy: [
      { name: 'Mohammed Al-Rashid', department: 'Infrastructure', title: 'Cloud Architect' },
      { name: 'Laila Mahmoud', department: 'DevOps', title: 'DevOps Lead' },
      { name: 'Hassan Al-Zahrani', department: 'Security', title: 'Security Engineer' }
    ],
    totalEndorsements: 18,
    recentGrowth: '+5 this month'
  },
  {
    skill: 'Leadership',
    endorsedBy: [
      { name: 'Fatima Al-Zahra', department: 'Management', title: 'Project Manager' },
      { name: 'Abdullah Al-Saud', department: 'Operations', title: 'Operations Director' },
      { name: 'Nour Al-Din', department: 'Strategy', title: 'Strategy Consultant' }
    ],
    totalEndorsements: 31,
    recentGrowth: '+12 this month'
  }
];

const industryBenchmarks = [
  {
    skill: 'Data Science',
    ourAverage: 7.2,
    industryAverage: 6.8,
    topQuartile: 8.5,
    benchmark: 'Above Industry Average',
    trend: '+0.4 vs last quarter'
  },
  {
    skill: 'Cloud Computing',
    ourAverage: 6.9,
    industryAverage: 7.3,
    topQuartile: 8.2,
    benchmark: 'Below Industry Average',
    trend: '+0.2 vs last quarter'
  },
  {
    skill: 'Cybersecurity',
    ourAverage: 8.1,
    industryAverage: 7.1,
    topQuartile: 8.4,
    benchmark: 'Top Performer',
    trend: '+0.6 vs last quarter'
  },
  {
    skill: 'Digital Marketing',
    ourAverage: 7.8,
    industryAverage: 7.2,
    topQuartile: 8.6,
    benchmark: 'Above Industry Average',
    trend: '+0.3 vs last quarter'
  }
];

export const SkillsMarketplace: React.FC = () => {
  const { isArabic } = useSimpleLanguage();
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSection, setActiveSection] = useState('marketplace');

  const getBenchmarkColor = (benchmark: string) => {
    switch (benchmark) {
      case 'Top Performer': return 'bg-green-100 text-green-700 border-green-200';
      case 'Above Industry Average': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Below Industry Average': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-gray-100 text-gray-700';
      case 'Intermediate': return 'bg-blue-100 text-blue-700';
      case 'Advanced': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Skills Marketplace Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Store className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-800">
                {isArabic ? 'المشاريع النشطة' : 'Active Projects'}
              </span>
            </div>
            <div className="text-2xl font-bold text-green-600">47</div>
            <div className="text-sm text-green-600/70">
              {isArabic ? 'فرص تطوير المهارات' : 'skill development opportunities'}
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-800">
                {isArabic ? 'المشاركات النشطة' : 'Active Participants'}
              </span>
            </div>
            <div className="text-2xl font-bold text-blue-600">234</div>
            <div className="text-sm text-blue-600/70">
              {isArabic ? 'موظف في السوق الداخلي' : 'employees in internal marketplace'}
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <ThumbsUp className="w-5 h-5 text-purple-600" />
              <span className="font-medium text-purple-800">
                {isArabic ? 'تأييدات الأقران' : 'Peer Endorsements'}
              </span>
            </div>
            <div className="text-2xl font-bold text-purple-600">1,287</div>
            <div className="text-sm text-purple-600/70">
              {isArabic ? 'تأييد نشط للمهارات' : 'active skills endorsements'}
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              <span className="font-medium text-orange-800">
                {isArabic ? 'معدل نجاح المطابقة' : 'Matching Success Rate'}
              </span>
            </div>
            <div className="text-2xl font-bold text-orange-600">89%</div>
            <div className="text-sm text-orange-600/70">
              {isArabic ? 'للمشاريع المطابقة بالذكاء الاصطناعي' : 'for AI-matched projects'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Skills Marketplace Tabs */}
      <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="marketplace">
            {isArabic ? 'سوق المهارات الداخلي' : 'Internal Skills Marketplace'}
          </TabsTrigger>
          <TabsTrigger value="endorsements">
            {isArabic ? 'تأييدات الأقران' : 'Peer Endorsements'}
          </TabsTrigger>
          <TabsTrigger value="benchmarking">
            {isArabic ? 'المعايير الصناعية' : 'Industry Benchmarking'}
          </TabsTrigger>
        </TabsList>

        {/* Internal Skills Marketplace */}
        <TabsContent value="marketplace" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="w-5 h-5" />
                {isArabic ? 'سوق المهارات الداخلي (اقتصاد العمل المؤقت)' : 'Internal Skills Marketplace (Internal Gig Economy)'}
              </CardTitle>
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder={isArabic ? 'البحث في المشاريع...' : 'Search projects...'}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  {isArabic ? 'تصفية' : 'Filter'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {skillsMarketplaceProjects.map((project) => (
                  <Card 
                    key={project.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedProject === project.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedProject(project.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg mb-2">
                            {isArabic ? project.title_ar : project.title}
                          </h4>
                          <p className="text-muted-foreground mb-3">
                            {isArabic ? project.description_ar : project.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Briefcase className="w-4 h-4" />
                              {project.department}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {project.duration}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {project.applicants} {isArabic ? 'متقدم' : 'applicants'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end gap-2">
                          <div className="flex items-center gap-2">
                            <Badge className={`${getSkillLevelColor(project.skillLevel)} border`}>
                              {isArabic && project.skillLevel === 'Beginner' ? 'مبتدئ' :
                               isArabic && project.skillLevel === 'Intermediate' ? 'متوسط' :
                               isArabic && project.skillLevel === 'Advanced' ? 'متقدم' :
                               project.skillLevel}
                            </Badge>
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              {project.matchScore}% {isArabic ? 'تطابق' : 'match'}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {isArabic ? 'نشرت بواسطة:' : 'Posted by:'} {project.postedBy}
                          </div>
                          <div className="text-sm font-medium">
                            {project.workload}
                          </div>
                        </div>
                      </div>
                      
                      {/* Required Skills */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.requiredSkills.map((skill, index) => (
                          <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      
                      {selectedProject === project.id && (
                        <div className="pt-4 border-t">
                          <div className="flex gap-2">
                            <Button className="flex-1">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              {isArabic ? 'التقديم للمشروع' : 'Apply to Project'}
                            </Button>
                            <Button variant="outline">
                              {isArabic ? 'حفظ للاحقاً' : 'Save for Later'}
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Skills-based Project Matching */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <Target className="w-5 h-5" />
                {isArabic ? 'مطابقة المشاريع القائمة على المهارات' : 'Skills-based Project Matching'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert className="border-blue-200 bg-white mb-4">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  {isArabic 
                    ? 'تم العثور على 8 مشاريع مطابقة لملفك الشخصي للمهارات بدقة 85%+'
                    : 'Found 8 projects matching your skills profile with 85%+ accuracy'
                  }
                </AlertDescription>
              </Alert>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-center p-4 bg-white rounded-lg border">
                  <div className="text-2xl font-bold text-blue-600">92%</div>
                  <div className="text-sm text-muted-foreground">
                    {isArabic ? 'دقة خوارزمية المطابقة' : 'Matching algorithm accuracy'}
                  </div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg border">
                  <div className="text-2xl font-bold text-green-600">76%</div>
                  <div className="text-sm text-muted-foreground">
                    {isArabic ? 'معدل إنجاز المشاريع المطابقة' : 'Matched project completion rate'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Peer Skills Endorsement System */}
        <TabsContent value="endorsements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ThumbsUp className="w-5 h-5" />
                {isArabic ? 'نظام تأييد مهارات الأقران' : 'Peer Skills Endorsement System'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {peerEndorsements.map((endorsement, index) => (
                  <Card key={index} className="border-purple-200 bg-purple-50">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <Star className="w-6 h-6 text-purple-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-lg">{endorsement.skill}</h4>
                            <p className="text-sm text-muted-foreground">
                              {endorsement.totalEndorsements} {isArabic ? 'تأييد إجمالي' : 'total endorsements'}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          {endorsement.recentGrowth}
                        </Badge>
                      </div>
                      
                      <div className="space-y-3">
                        <h5 className="font-medium text-sm text-muted-foreground">
                          {isArabic ? 'أحدث التأييدات من:' : 'Recent endorsements from:'}
                        </h5>
                        {endorsement.endorsedBy.map((endorser, endorserIndex) => (
                          <div key={endorserIndex} className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                              {endorser.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">{endorser.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {endorser.title} • {endorser.department}
                              </div>
                            </div>
                            <Badge variant="outline">
                              <Award className="w-3 h-3 mr-1" />
                              {isArabic ? 'مؤيد' : 'Endorsed'}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Endorsement Analytics */}
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <BarChart3 className="w-5 h-5" />
                {isArabic ? 'تحليلات التأييد' : 'Endorsement Analytics'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-white rounded-lg border">
                  <div className="text-2xl font-bold text-green-600">1,287</div>
                  <div className="text-sm text-muted-foreground">
                    {isArabic ? 'إجمالي التأييدات' : 'Total Endorsements'}
                  </div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg border">
                  <div className="text-2xl font-bold text-blue-600">89%</div>
                  <div className="text-sm text-muted-foreground">
                    {isArabic ? 'معدل المشاركة' : 'Participation Rate'}
                  </div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg border">
                  <div className="text-2xl font-bold text-purple-600">156</div>
                  <div className="text-sm text-muted-foreground">
                    {isArabic ? 'مهارات مؤيدة' : 'Skills Endorsed'}
                  </div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg border">
                  <div className="text-2xl font-bold text-orange-600">+23%</div>
                  <div className="text-sm text-muted-foreground">
                    {isArabic ? 'نمو شهري' : 'Monthly Growth'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Industry Skills Benchmarking */}
        <TabsContent value="benchmarking" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                {isArabic ? 'معايير المهارات الصناعية' : 'Industry Skills Benchmarking'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {industryBenchmarks.map((benchmark, index) => (
                  <Card key={index} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-lg">{benchmark.skill}</h4>
                        <Badge className={`${getBenchmarkColor(benchmark.benchmark)} border`}>
                          {isArabic && benchmark.benchmark === 'Top Performer' ? 'أداء متميز' :
                           isArabic && benchmark.benchmark === 'Above Industry Average' ? 'فوق المتوسط الصناعي' :
                           isArabic && benchmark.benchmark === 'Below Industry Average' ? 'تحت المتوسط الصناعي' :
                           benchmark.benchmark}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <div className="text-sm text-muted-foreground">
                            {isArabic ? 'متوسطنا' : 'Our Average'}
                          </div>
                          <div className="text-2xl font-bold text-blue-600">{benchmark.ourAverage}/10</div>
                          <Progress value={benchmark.ourAverage * 10} className="h-2" />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="text-sm text-muted-foreground">
                            {isArabic ? 'المتوسط الصناعي' : 'Industry Average'}
                          </div>
                          <div className="text-2xl font-bold text-gray-600">{benchmark.industryAverage}/10</div>
                          <Progress value={benchmark.industryAverage * 10} className="h-2" />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="text-sm text-muted-foreground">
                            {isArabic ? 'الربع الأعلى' : 'Top Quartile'}
                          </div>
                          <div className="text-2xl font-bold text-green-600">{benchmark.topQuartile}/10</div>
                          <Progress value={benchmark.topQuartile * 10} className="h-2" />
                        </div>
                      </div>
                      
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 text-sm">
                          <TrendingUp className="w-4 h-4 text-green-500" />
                          <span className="text-muted-foreground">
                            {isArabic ? 'الاتجاه:' : 'Trend:'} {benchmark.trend}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Competitive Analysis */}
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800">
                <Target className="w-5 h-5" />
                {isArabic ? 'التحليل التنافسي' : 'Competitive Analysis'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert className="border-orange-200 bg-white mb-4">
                <TrendingUp className="h-4 w-4" />
                <AlertDescription>
                  {isArabic 
                    ? 'نحن في الربع الثاني من الأداء في 3 من 4 مهارات أساسية مقارنة بالصناعة'
                    : 'We rank in the 2nd quartile for 3 out of 4 core skills compared to industry peers'
                  }
                </AlertDescription>
              </Alert>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-center p-4 bg-white rounded-lg border">
                  <div className="text-2xl font-bold text-green-600">2</div>
                  <div className="text-sm text-muted-foreground">
                    {isArabic ? 'مهارات فوق المتوسط الصناعي' : 'Skills above industry average'}
                  </div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg border">
                  <div className="text-2xl font-bold text-orange-600">1</div>
                  <div className="text-sm text-muted-foreground">
                    {isArabic ? 'مهارات تحتاج تحسين' : 'Skills needing improvement'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};