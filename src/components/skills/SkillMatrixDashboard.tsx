import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Target, TrendingUp, Users, Award, Search, Filter, BarChart3, Zap } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguageCompat';

interface TechnicalSkill {
  id: string;
  name: string;
  nameAr: string;
  category: string;
  proficiencyLevels: string[];
  industryRelevance: string;
  employeesWithSkill: number;
  averageLevel: number;
}

interface BehavioralSkill {
  id: string;
  name: string;
  nameAr: string;
  competencyArea: string;
  assessmentCriteria: string[];
  culturalContext: string;
  employeesAssessed: number;
  averageScore: number;
}

interface SkillGap {
  skillName: string;
  currentLevel: number;
  requiredLevel: number;
  priority: 'High' | 'Medium' | 'Low';
  affectedPositions: number;
}

export const SkillMatrixDashboard: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Mock data - replace with actual API calls
  const [skillStats, setSkillStats] = useState({
    totalTechnicalSkills: 847,
    totalBehavioralSkills: 623,
    trackedCertifications: 234,
    skillGapsIdentified: 89,
    employeesAssessed: 1250,
    skillMatrixCompletion: 85
  });

  const [recentUpdates] = useState([
    { type: 'technical', skill: 'Python Programming', action: 'added', position: 'Software Engineer', time: '2 hours ago' },
    { type: 'behavioral', skill: 'Leadership Skills', action: 'updated', position: 'Manager positions', time: '4 hours ago' },
    { type: 'certification', skill: 'AWS Certification', action: 'requirement added', position: 'DevOps Engineer', time: '1 day ago' },
    { type: 'gap', skill: 'Data Analysis', action: 'gap identified', position: 'Multiple positions', time: '2 days ago' }
  ]);

  const [criticalSkillGaps] = useState<SkillGap[]>([
    { skillName: 'Cloud Architecture', currentLevel: 2.1, requiredLevel: 4.0, priority: 'High', affectedPositions: 12 },
    { skillName: 'AI/ML Expertise', currentLevel: 1.8, requiredLevel: 3.5, priority: 'High', affectedPositions: 8 },
    { skillName: 'Leadership Skills', currentLevel: 2.5, requiredLevel: 4.0, priority: 'Medium', affectedPositions: 15 },
    { skillName: 'Arabic Communication', currentLevel: 3.2, requiredLevel: 4.5, priority: 'Medium', affectedPositions: 6 }
  ]);

  const skillCategories = [
    { id: 'programming', name: 'Programming', nameAr: 'البرمجة', count: 156 },
    { id: 'cloud', name: 'Cloud Technologies', nameAr: 'تقنيات السحابة', count: 89 },
    { id: 'data', name: 'Data & Analytics', nameAr: 'البيانات والتحليلات', count: 134 },
    { id: 'leadership', name: 'Leadership', nameAr: 'القيادة', count: 78 },
    { id: 'communication', name: 'Communication', nameAr: 'التواصل', count: 92 },
    { id: 'cultural', name: 'Cultural Competency', nameAr: 'الكفاءة الثقافية', count: 45 }
  ];

  return (
    <div className="space-y-6 p-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {language === 'ar' ? 'مصفوفة المهارات التقنية والسلوكية' : 'Technical & Behavioral Skill Matrix'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {language === 'ar' 
              ? 'إدارة شاملة للمهارات مع تحليل الفجوات وتخطيط التطوير'
              : 'Comprehensive skill management with gap analysis and development planning'
            }
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => {
              console.log('Gap Analysis clicked');
              // Add gap analysis functionality here
            }}
          >
            <BarChart3 className="h-4 w-4" />
            {language === 'ar' ? 'تحليل الفجوات' : 'Gap Analysis'}
          </Button>
          <Button 
            className="gap-2"
            onClick={() => {
              console.log('Add New Skill clicked');
              // Add new skill functionality here
            }}
          >
            <Plus className="h-4 w-4" />
            {language === 'ar' ? 'إضافة مهارة جديدة' : 'Add New Skill'}
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {language === 'ar' ? 'المهارات التقنية' : 'Technical Skills'}
                </p>
                <p className="text-2xl font-bold text-primary">{skillStats.totalTechnicalSkills}</p>
              </div>
              <Target className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {language === 'ar' ? 'المهارات السلوكية' : 'Behavioral Skills'}
                </p>
                <p className="text-2xl font-bold text-secondary">{skillStats.totalBehavioralSkills}</p>
              </div>
              <Users className="h-8 w-8 text-secondary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {language === 'ar' ? 'الشهادات المتتبعة' : 'Tracked Certifications'}
                </p>
                <p className="text-2xl font-bold text-accent">{skillStats.trackedCertifications}</p>
              </div>
              <Award className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {language === 'ar' ? 'فجوات المهارات' : 'Skill Gaps'}
                </p>
                <p className="text-2xl font-bold text-destructive">{skillStats.skillGapsIdentified}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            {language === 'ar' ? 'نظرة عامة' : 'Overview'}
          </TabsTrigger>
          <TabsTrigger value="technical" className="gap-2">
            <Target className="h-4 w-4" />
            {language === 'ar' ? 'المهارات التقنية' : 'Technical Skills'}
          </TabsTrigger>
          <TabsTrigger value="behavioral" className="gap-2">
            <Users className="h-4 w-4" />
            {language === 'ar' ? 'المهارات السلوكية' : 'Behavioral Skills'}
          </TabsTrigger>
          <TabsTrigger value="gaps" className="gap-2">
            <Zap className="h-4 w-4" />
            {language === 'ar' ? 'تحليل الفجوات' : 'Gap Analysis'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Skill Matrix Completion */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                {language === 'ar' ? 'اكتمال مصفوفة المهارات' : 'Skill Matrix Completion'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">
                    {language === 'ar' ? 'نسبة الاكتمال الإجمالية' : 'Overall Completion Rate'}
                  </span>
                  <Badge variant="secondary">{skillStats.skillMatrixCompletion}%</Badge>
                </div>
                <Progress value={skillStats.skillMatrixCompletion} className="h-2" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  {skillCategories.map((category) => (
                    <div key={category.id} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-xs text-muted-foreground">
                          {language === 'ar' ? category.nameAr : category.name}
                        </span>
                        <span className="text-xs font-medium">{category.count}</span>
                      </div>
                      <Progress value={Math.random() * 100} className="h-1" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Updates */}
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'ar' ? 'التحديثات الأخيرة' : 'Recent Updates'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentUpdates.map((update, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant={
                        update.type === 'technical' ? 'default' :
                        update.type === 'behavioral' ? 'secondary' :
                        update.type === 'certification' ? 'outline' : 'destructive'
                      }>
                        {update.type}
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">{update.skill}</p>
                        <p className="text-xs text-muted-foreground">
                          {update.action} for {update.position}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{update.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gaps" className="space-y-6">
          {/* Critical Skill Gaps */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                {language === 'ar' ? 'فجوات المهارات الحرجة' : 'Critical Skill Gaps'}
              </CardTitle>
              <CardDescription>
                {language === 'ar' 
                  ? 'المهارات التي تحتاج إلى اهتمام فوري للوصول إلى مستويات الأداء المطلوبة'
                  : 'Skills requiring immediate attention to meet required performance levels'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {criticalSkillGaps.map((gap, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{gap.skillName}</h4>
                        <p className="text-sm text-muted-foreground">
                          {gap.affectedPositions} {language === 'ar' ? 'منصب متأثر' : 'positions affected'}
                        </p>
                      </div>
                      <Badge variant={
                        gap.priority === 'High' ? 'destructive' : 
                        gap.priority === 'Medium' ? 'secondary' : 'outline'
                      }>
                        {gap.priority} Priority
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{language === 'ar' ? 'المستوى الحالي' : 'Current Level'}</span>
                        <span className="font-medium">{gap.currentLevel}/5.0</span>
                      </div>
                      <Progress value={(gap.currentLevel / 5) * 100} className="h-2" />
                      
                      <div className="flex justify-between text-sm">
                        <span>{language === 'ar' ? 'المستوى المطلوب' : 'Required Level'}</span>
                        <span className="font-medium">{gap.requiredLevel}/5.0</span>
                      </div>
                      <Progress value={(gap.requiredLevel / 5) * 100} className="h-2" />
                    </div>
                    
                    <Button variant="outline" size="sm" className="w-full">
                      {language === 'ar' ? 'إنشاء خطة تطوير' : 'Create Development Plan'}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="technical" className="space-y-6">
          {/* Search and Filter */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={language === 'ar' ? 'البحث في المهارات التقنية...' : 'Search technical skills...'}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder={language === 'ar' ? 'اختر الفئة' : 'Select Category'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {language === 'ar' ? 'جميع الفئات' : 'All Categories'}
                    </SelectItem>
                    {skillCategories.slice(0, 3).map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {language === 'ar' ? category.nameAr : category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Technical Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {skillCategories.slice(0, 3).map((category) => (
              <Card key={category.id}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {language === 'ar' ? category.nameAr : category.name}
                  </CardTitle>
                  <CardDescription>
                    {category.count} {language === 'ar' ? 'مهارة' : 'skills'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Progress value={Math.random() * 100} className="h-2" />
                    <div className="flex justify-between text-sm">
                      <span>{language === 'ar' ? 'متوسط المستوى' : 'Avg. Level'}</span>
                      <span className="font-medium">3.2/5.0</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      {language === 'ar' ? 'إدارة المهارات' : 'Manage Skills'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="behavioral" className="space-y-6">
          {/* Behavioral Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {skillCategories.slice(3).map((category) => (
              <Card key={category.id}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {language === 'ar' ? category.nameAr : category.name}
                  </CardTitle>
                  <CardDescription>
                    {category.count} {language === 'ar' ? 'مهارة' : 'skills'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Progress value={Math.random() * 100} className="h-2" />
                    <div className="flex justify-between text-sm">
                      <span>{language === 'ar' ? 'متوسط النتيجة' : 'Avg. Score'}</span>
                      <span className="font-medium">3.8/5.0</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      {language === 'ar' ? 'إدارة المهارات' : 'Manage Skills'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};