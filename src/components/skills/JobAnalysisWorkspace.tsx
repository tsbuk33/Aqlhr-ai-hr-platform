import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  FileText, 
  Briefcase, 
  TrendingUp, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw,
  Plus,
  Edit,
  Eye,
  Award,
  Users,
  Target
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguageCompat';
import { useToast } from '@/hooks/use-toast';
import { useDepartments } from '@/hooks/useDepartments';
import { usePositions } from '@/hooks/usePositions';

interface JobPosition {
  id: string;
  title: string;
  titleAr: string;
  department: string;
  level: string;
  status: 'active' | 'draft' | 'pending' | 'archived';
  jobDescriptionStatus: 'complete' | 'partial' | 'missing';
  jobSpecificationStatus: 'complete' | 'partial' | 'missing';
  evaluationStatus: 'complete' | 'in_progress' | 'pending';
  lastUpdated: string;
  skillsRequired: number;
  skillsMatched: number;
}

interface JobAnalysisMetrics {
  totalPositions: number;
  pendingAnalysis: number;
  completedDescriptions: number;
  definedSpecifications: number;
  completedEvaluations: number;
  complianceScore: number;
}

interface AIRecommendation {
  id: string;
  type: 'update' | 'review' | 'align' | 'create';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  positionId?: string;
  actionRequired: string;
}

export const JobAnalysisWorkspace: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const { toast } = useToast();
  const { departments, loading: departmentsLoading } = useDepartments();
  const { positions: existingPositions, loading: positionsLoading } = usePositions();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);
  const [isCreatePositionOpen, setIsCreatePositionOpen] = useState(false);
  const [newPosition, setNewPosition] = useState({
    title: '',
    titleAr: '',
    department: '',
    level: '',
    employmentType: 'full_time',
    location: '',
    directReports: 0,
    reportsTo: '',
    salaryGrade: '',
    minSalary: '',
    maxSalary: '',
    currency: 'SAR',
    jobFamily: '',
    careerLevel: '',
    educationRequired: '',
    experienceYears: '',
    description: '',
    responsibilities: '',
    qualifications: '',
    skills: [] as string[],
    certifications: [] as string[],
    languages: [] as string[],
    travelRequired: false,
    workSchedule: 'standard',
    effectiveDate: '',
    recruitmentPriority: 'medium',
    targetHireDate: '',
    hiringManager: '',
    recruiter: '',
    budgetApproved: false,
    complianceChecked: false
  });
  
  // Mock data - replace with actual API calls
  const [metrics, setMetrics] = useState<JobAnalysisMetrics>({
    totalPositions: 156,
    pendingAnalysis: 23,
    completedDescriptions: 134,
    definedSpecifications: 156,
    completedEvaluations: 89,
    complianceScore: 94
  });

  const [positions] = useState<JobPosition[]>([
    {
      id: '1',
      title: 'Software Engineer',
      titleAr: 'مهندس برمجيات',
      department: 'Technology',
      level: 'Senior',
      status: 'active',
      jobDescriptionStatus: 'complete',
      jobSpecificationStatus: 'complete',
      evaluationStatus: 'complete',
      lastUpdated: '2024-01-15',
      skillsRequired: 12,
      skillsMatched: 10
    },
    {
      id: '2',
      title: 'HR Manager',
      titleAr: 'مدير الموارد البشرية',
      department: 'Human Resources',
      level: 'Manager',
      status: 'active',
      jobDescriptionStatus: 'complete',
      jobSpecificationStatus: 'complete',
      evaluationStatus: 'in_progress',
      lastUpdated: '2024-01-14',
      skillsRequired: 8,
      skillsMatched: 8
    },
    {
      id: '3',
      title: 'Data Analyst',
      titleAr: 'محلل البيانات',
      department: 'Analytics',
      level: 'Mid',
      status: 'draft',
      jobDescriptionStatus: 'partial',
      jobSpecificationStatus: 'missing',
      evaluationStatus: 'pending',
      lastUpdated: '2024-01-13',
      skillsRequired: 10,
      skillsMatched: 6
    }
  ]);

  const [aiRecommendations] = useState<AIRecommendation[]>([
    {
      id: '1',
      type: 'update',
      priority: 'high',
      title: 'Update Software Engineer JD',
      description: 'Job description needs updating with new tech stack requirements including React 18 and TypeScript 5.0',
      positionId: '1',
      actionRequired: 'Add new technical requirements'
    },
    {
      id: '2',
      type: 'review',
      priority: 'medium',
      title: 'Review Manager Positions',
      description: 'Leadership skills requirements need review for compliance with Saudi leadership development standards',
      actionRequired: 'Update leadership competencies'
    },
    {
      id: '3',
      type: 'align',
      priority: 'medium',
      title: 'Align HR Specialist with HRSD',
      description: 'HR Specialist job requirements should align with latest HRSD professional standards',
      actionRequired: 'Update qualification requirements'
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in_progress':
      case 'partial':
        return <RefreshCw className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      complete: 'default',
      partial: 'secondary',
      in_progress: 'secondary',
      missing: 'destructive',
      pending: 'outline'
    };
    return variants[status] || 'outline';
  };

  return (
    <div className="space-y-6 p-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {language === 'ar' ? 'مساحة عمل تحليل الوظائف' : 'Job Analysis Workspace'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {language === 'ar' 
              ? 'إدارة أوصاف الوظائف ومواصفاتها وتقييمها بذكاء اصطناعي'
              : 'AI-powered job description, specification, and evaluation management'
            }
          </p>
        </div>
        
        {/* Existing Positions Section */}
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">
              {language === 'ar' ? 'اختر من المناصب الموجودة' : 'Select from Existing Positions'}
            </label>
            <Select disabled={positionsLoading} onValueChange={(value) => {
              console.log('Position selected:', value); // Debug log
              const selectedPos = existingPositions.find(pos => pos.title === value);
              if (selectedPos) {
                toast({
                  title: language === 'ar' ? 'تم اختيار المنصب' : 'Position Selected',
                  description: language === 'ar' 
                    ? `تم اختيار منصب "${selectedPos.title}" للتحليل`
                    : `Position "${selectedPos.title}" selected for analysis`,
                });
                setSelectedPosition(value);
              }
            }}>
              <SelectTrigger className="bg-background border border-input hover:bg-accent hover:text-accent-foreground min-w-[250px] relative z-10">
                <SelectValue placeholder={
                  positionsLoading 
                    ? (language === 'ar' ? 'جاري تحميل المناصب...' : 'Loading positions...') 
                    : (language === 'ar' ? 'اختر منصب موجود...' : 'Select existing position...')
                } />
              </SelectTrigger>
              <SelectContent 
                className="bg-popover border border-border shadow-lg z-[100] max-h-[300px] overflow-y-auto w-full min-w-[400px]" 
                position="popper"
                sideOffset={4}
              >
                {positionsLoading ? (
                  <SelectItem value="loading" disabled className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                    {language === 'ar' ? 'جاري تحميل المناصب...' : 'Loading positions...'}
                  </SelectItem>
                ) : existingPositions.length > 0 ? (
                  existingPositions.map((position, index) => (
                    <SelectItem 
                      key={`${position.title}-${index}`} 
                      value={position.title} 
                      className="cursor-pointer hover:bg-accent focus:bg-accent py-3 px-4"
                    >
                      <div className="flex justify-between items-center w-full min-w-0">
                        <div className="flex flex-col items-start min-w-0 flex-1">
                          <span className="font-medium text-foreground truncate max-w-full">
                            {language === 'ar' && position.titleAr ? position.titleAr : position.title}
                          </span>
                          {position.title !== (position.titleAr || position.title) && (
                            <span className="text-xs text-muted-foreground truncate max-w-full">
                              {position.title}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground flex-shrink-0 ml-2">
                          {position.department && (
                            <Badge variant="outline" className="text-xs px-1 py-0">
                              {position.department}
                            </Badge>
                          )}
                          <span className="whitespace-nowrap">({position.count})</span>
                        </div>
                      </div>
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-positions" disabled className="text-center py-6">
                    <div className="flex flex-col items-center gap-2">
                      <div className="text-muted-foreground text-sm">
                        {language === 'ar' ? 'لا توجد مناصب متاحة' : 'No positions available'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {language === 'ar' ? 'تأكد من وجود بيانات موظفين في النظام' : 'Make sure employee data exists in the system'}
                      </div>
                    </div>
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="text-center lg:text-left">
            <div className="text-sm text-muted-foreground mb-2">
              {language === 'ar' ? 'أو' : 'OR'}
            </div>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => {
              toast({
                title: language === 'ar' ? 'تحليل شامل' : 'Bulk Analysis',
                description: language === 'ar' ? 'بدء التحليل الشامل لجميع المناصب...' : 'Starting bulk analysis for all positions...',
              });
              // In a real app, this would start the bulk analysis process
            }}
          >
            <Target className="h-4 w-4" />
            {language === 'ar' ? 'تحليل شامل' : 'Bulk Analysis'}
          </Button>
          <Dialog open={isCreatePositionOpen} onOpenChange={setIsCreatePositionOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                {language === 'ar' ? 'إنشاء وظيفة جديدة' : 'Create New Position'}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {language === 'ar' ? 'إنشاء وظيفة جديدة - متصل بالتوظيف والبيانات الرئيسية' : 'Create New Position - Connected to Recruitment & Master Data'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg border-b pb-2">
                    {language === 'ar' ? 'المعلومات الأساسية' : 'Basic Information'}
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="position-title">
                        {language === 'ar' ? 'المسمى الوظيفي (الإنجليزية)' : 'Position Title (English)'}
                      </Label>
                      <Select
                        value={newPosition.title}
                        onValueChange={(value) => {
                          const selectedPos = existingPositions.find(pos => pos.title === value);
                          setNewPosition({
                            ...newPosition, 
                            title: value,
                            titleAr: selectedPos?.titleAr || '',
                            department: selectedPos?.department || newPosition.department
                          });
                        }}
                      >
                        <SelectTrigger className="bg-background border border-input hover:bg-accent hover:text-accent-foreground">
                          <SelectValue placeholder={language === 'ar' ? 'اختر أو أدخل المسمى الوظيفي' : 'Select or enter position title'} />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border border-border shadow-md max-h-[200px] overflow-y-auto z-[100]">
                          {existingPositions.length > 0 ? existingPositions.map((position) => (
                            <SelectItem key={position.title} value={position.title} className="cursor-pointer hover:bg-accent">
                              <div className="flex justify-between items-center w-full">
                                <span>{position.title}</span>
                                {position.department && (
                                  <Badge variant="outline" className="text-xs ml-2">
                                    {position.department}
                                  </Badge>
                                )}
                              </div>
                            </SelectItem>
                          )) : (
                            <SelectItem value="no-data" disabled className="text-center text-muted-foreground">
                              {language === 'ar' ? 'لا توجد مناصب متاحة' : 'No positions available'}
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <Input
                        className="mt-2"
                        value={newPosition.title}
                        onChange={(e) => setNewPosition({...newPosition, title: e.target.value})}
                        placeholder={language === 'ar' ? 'أو أدخل مسمى جديد' : 'Or enter new title'}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="position-title-ar">
                        {language === 'ar' ? 'المسمى الوظيفي (العربية)' : 'Position Title (Arabic)'}
                      </Label>
                      <Select
                        value={newPosition.titleAr}
                        onValueChange={(value) => {
                          const selectedPos = existingPositions.find(pos => pos.titleAr === value);
                          setNewPosition({
                            ...newPosition, 
                            titleAr: value,
                            title: selectedPos?.title || newPosition.title,
                            department: selectedPos?.department || newPosition.department
                          });
                        }}
                      >
                        <SelectTrigger className="bg-background border border-input hover:bg-accent hover:text-accent-foreground">
                          <SelectValue placeholder={language === 'ar' ? 'اختر أو أدخل المسمى الوظيفي بالعربية' : 'Select or enter position title in Arabic'} />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border border-border shadow-md max-h-[200px] overflow-y-auto z-[100]">
                          {existingPositions.filter(pos => pos.titleAr).length > 0 ? existingPositions.filter(pos => pos.titleAr).map((position) => (
                            <SelectItem key={position.titleAr} value={position.titleAr!} className="cursor-pointer hover:bg-accent">
                              <div className="flex justify-between items-center w-full">
                                <span>{position.titleAr}</span>
                                {position.department && (
                                  <Badge variant="outline" className="text-xs ml-2">
                                    {position.department}
                                  </Badge>
                                )}
                              </div>
                            </SelectItem>
                          )) : (
                            <SelectItem value="no-data" disabled className="text-center text-muted-foreground">
                              {language === 'ar' ? 'لا توجد أسماء مناصب عربية متاحة' : 'No Arabic position titles available'}
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <Input
                        className="mt-2"
                        value={newPosition.titleAr}
                        onChange={(e) => setNewPosition({...newPosition, titleAr: e.target.value})}
                        placeholder={language === 'ar' ? 'أو أدخل مسمى جديد بالعربية' : 'Or enter new title in Arabic'}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="department">
                        {language === 'ar' ? 'القسم' : 'Department'}
                      </Label>
                      <Select value={newPosition.department} onValueChange={(value) => setNewPosition({...newPosition, department: value})} disabled={departmentsLoading}>
                        <SelectTrigger className="bg-background border border-input hover:bg-accent hover:text-accent-foreground z-50">
                          <SelectValue placeholder={
                            departmentsLoading 
                              ? (language === 'ar' ? 'جاري التحميل...' : 'Loading...') 
                              : (language === 'ar' ? 'اختر القسم' : 'Select department')
                          } />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border border-border shadow-md z-50 max-h-[200px] overflow-y-auto">
                          {departmentsLoading ? (
                            <SelectItem value="loading" disabled>
                              {language === 'ar' ? 'جاري تحميل الأقسام...' : 'Loading departments...'}
                            </SelectItem>
                          ) : departments.length > 0 ? (
                            departments.map((dept) => (
                              <SelectItem key={dept} value={dept} className="cursor-pointer hover:bg-accent">
                                {dept}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="no-departments" disabled>
                              {language === 'ar' ? 'لا توجد أقسام متاحة' : 'No departments available'}
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="level">
                        {language === 'ar' ? 'المستوى' : 'Level'}
                      </Label>
                      <Select value={newPosition.level} onValueChange={(value) => setNewPosition({...newPosition, level: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder={language === 'ar' ? 'اختر المستوى' : 'Select level'} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="entry">{language === 'ar' ? 'مبتدئ' : 'Entry Level'}</SelectItem>
                          <SelectItem value="junior">{language === 'ar' ? 'مبتدئ متقدم' : 'Junior'}</SelectItem>
                          <SelectItem value="mid">{language === 'ar' ? 'متوسط' : 'Mid Level'}</SelectItem>
                          <SelectItem value="senior">{language === 'ar' ? 'أول' : 'Senior'}</SelectItem>
                          <SelectItem value="lead">{language === 'ar' ? 'قائد' : 'Lead'}</SelectItem>
                          <SelectItem value="manager">{language === 'ar' ? 'مدير' : 'Manager'}</SelectItem>
                          <SelectItem value="director">{language === 'ar' ? 'مدير عام' : 'Director'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="employment-type">
                        {language === 'ar' ? 'نوع التوظيف' : 'Employment Type'}
                      </Label>
                      <Select value={newPosition.employmentType} onValueChange={(value) => setNewPosition({...newPosition, employmentType: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full_time">{language === 'ar' ? 'دوام كامل' : 'Full Time'}</SelectItem>
                          <SelectItem value="part_time">{language === 'ar' ? 'دوام جزئي' : 'Part Time'}</SelectItem>
                          <SelectItem value="contract">{language === 'ar' ? 'عقد مؤقت' : 'Contract'}</SelectItem>
                          <SelectItem value="consultant">{language === 'ar' ? 'استشاري' : 'Consultant'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Recruitment Connection */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg border-b pb-2 text-primary">
                    {language === 'ar' ? 'ربط بنظام التوظيف' : 'Recruitment System Connection'}
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="recruitment-priority">
                        {language === 'ar' ? 'أولوية التوظيف' : 'Recruitment Priority'}
                      </Label>
                      <Select value={newPosition.recruitmentPriority} onValueChange={(value) => setNewPosition({...newPosition, recruitmentPriority: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="urgent">{language === 'ar' ? 'عاجل' : 'Urgent'}</SelectItem>
                          <SelectItem value="high">{language === 'ar' ? 'عالي' : 'High'}</SelectItem>
                          <SelectItem value="medium">{language === 'ar' ? 'متوسط' : 'Medium'}</SelectItem>
                          <SelectItem value="low">{language === 'ar' ? 'منخفض' : 'Low'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="target-hire-date">
                        {language === 'ar' ? 'تاريخ التوظيف المستهدف' : 'Target Hire Date'}
                      </Label>
                      <Input
                        id="target-hire-date"
                        type="date"
                        value={newPosition.targetHireDate}
                        onChange={(e) => setNewPosition({...newPosition, targetHireDate: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="hiring-manager">
                        {language === 'ar' ? 'مدير التوظيف' : 'Hiring Manager'}
                      </Label>
                      <Select value={newPosition.hiringManager} onValueChange={(value) => setNewPosition({...newPosition, hiringManager: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder={language === 'ar' ? 'اختر مدير التوظيف' : 'Select hiring manager'} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="manager1">{language === 'ar' ? 'أحمد محمد - مدير الموارد البشرية' : 'Ahmed Mohammed - HR Manager'}</SelectItem>
                          <SelectItem value="manager2">{language === 'ar' ? 'سارة علي - مديرة التقنية' : 'Sarah Ali - Technology Manager'}</SelectItem>
                          <SelectItem value="manager3">{language === 'ar' ? 'خالد أحمد - مدير العمليات' : 'Khalid Ahmed - Operations Manager'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="recruiter">
                        {language === 'ar' ? 'المُوظِف' : 'Recruiter'}
                      </Label>
                      <Select value={newPosition.recruiter} onValueChange={(value) => setNewPosition({...newPosition, recruiter: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder={language === 'ar' ? 'اختر المُوظِف' : 'Select recruiter'} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="recruiter1">{language === 'ar' ? 'منى السالم - مُوظِفة أولى' : 'Mona Al-Salem - Senior Recruiter'}</SelectItem>
                          <SelectItem value="recruiter2">{language === 'ar' ? 'عبدالله العتيبي - مُوظِف' : 'Abdullah Al-Otaibi - Recruiter'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Compensation */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg border-b pb-2">
                    {language === 'ar' ? 'التعويضات' : 'Compensation'}
                  </h4>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="salary-grade">
                        {language === 'ar' ? 'درجة الراتب' : 'Salary Grade'}
                      </Label>
                      <Select value={newPosition.salaryGrade} onValueChange={(value) => {
                        // Auto-populate salary band based on grade
                        const gradeBands: Record<string, { min: string; max: string }> = {
                          'grade-1': { min: '3000', max: '4500' },
                          'grade-2': { min: '4000', max: '6000' },
                          'grade-3': { min: '5500', max: '8000' },
                          'grade-4': { min: '7000', max: '10500' },
                          'grade-5': { min: '9000', max: '13500' },
                          'grade-6': { min: '11500', max: '17000' },
                          'grade-7': { min: '14500', max: '21500' },
                          'grade-8': { min: '18000', max: '27000' },
                          'grade-9': { min: '22500', max: '33500' },
                          'grade-10': { min: '28000', max: '42000' },
                          'grade-11': { min: '35000', max: '52500' },
                          'grade-12': { min: '43500', max: '65000' },
                          'grade-13': { min: '54000', max: '81000' },
                          'grade-14': { min: '67500', max: '101000' },
                          'grade-15': { min: '84000', max: '126000' }
                        };
                        
                        const band = gradeBands[value];
                        setNewPosition({
                          ...newPosition, 
                          salaryGrade: value,
                          minSalary: band?.min || '',
                          maxSalary: band?.max || ''
                        });
                      }}>
                        <SelectTrigger>
                          <SelectValue placeholder={language === 'ar' ? 'اختر الدرجة' : 'Select grade'} />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 15 }, (_, i) => i + 1).map(grade => (
                            <SelectItem key={grade} value={`grade-${grade}`}>
                              {language === 'ar' ? `الدرجة ${grade}` : `Grade ${grade}`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="min-salary">
                        {language === 'ar' ? 'الحد الأدنى للراتب' : 'Minimum Salary'}
                      </Label>
                      <Input
                        id="min-salary"
                        type="number"
                        value={newPosition.minSalary}
                        onChange={(e) => setNewPosition({...newPosition, minSalary: e.target.value})}
                        placeholder="5000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="max-salary">
                        {language === 'ar' ? 'الحد الأقصى للراتب' : 'Maximum Salary'}
                      </Label>
                      <Input
                        id="max-salary"
                        type="number"
                        value={newPosition.maxSalary}
                        onChange={(e) => setNewPosition({...newPosition, maxSalary: e.target.value})}
                        placeholder="15000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency">
                        {language === 'ar' ? 'العملة' : 'Currency'}
                      </Label>
                      <Select value={newPosition.currency} onValueChange={(value) => setNewPosition({...newPosition, currency: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SAR">SAR - ريال سعودي</SelectItem>
                          <SelectItem value="USD">USD - دولار أمريكي</SelectItem>
                          <SelectItem value="EUR">EUR - يورو</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Job Requirements */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg border-b pb-2">
                    {language === 'ar' ? 'متطلبات الوظيفة' : 'Job Requirements'}
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="education-required">
                        {language === 'ar' ? 'التعليم المطلوب' : 'Education Required'}
                      </Label>
                      <Select value={newPosition.educationRequired} onValueChange={(value) => setNewPosition({...newPosition, educationRequired: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder={language === 'ar' ? 'اختر المؤهل' : 'Select education'} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high_school">{language === 'ar' ? 'الثانوية العامة' : 'High School'}</SelectItem>
                          <SelectItem value="diploma">{language === 'ar' ? 'دبلوم' : 'Diploma'}</SelectItem>
                          <SelectItem value="bachelor">{language === 'ar' ? 'بكالوريوس' : 'Bachelor\'s Degree'}</SelectItem>
                          <SelectItem value="master">{language === 'ar' ? 'ماجستير' : 'Master\'s Degree'}</SelectItem>
                          <SelectItem value="phd">{language === 'ar' ? 'دكتوراه' : 'PhD'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="experience-years">
                        {language === 'ar' ? 'سنوات الخبرة المطلوبة' : 'Years of Experience Required'}
                      </Label>
                      <Input
                        id="experience-years"
                        type="number"
                        value={newPosition.experienceYears}
                        onChange={(e) => setNewPosition({...newPosition, experienceYears: e.target.value})}
                        placeholder="3"
                      />
                    </div>
                  </div>
                </div>

                {/* Approval Workflow */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg border-b pb-2 text-green-600">
                    {language === 'ar' ? 'سير عمل الموافقة' : 'Approval Workflow'}
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="budget-approved"
                        checked={newPosition.budgetApproved}
                        onChange={(e) => setNewPosition({...newPosition, budgetApproved: e.target.checked})}
                        className="rounded"
                      />
                      <Label htmlFor="budget-approved" className="text-sm">
                        {language === 'ar' ? 'موافقة الميزانية' : 'Budget Approved'}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="compliance-checked"
                        checked={newPosition.complianceChecked}
                        onChange={(e) => setNewPosition({...newPosition, complianceChecked: e.target.checked})}
                        className="rounded"
                      />
                      <Label htmlFor="compliance-checked" className="text-sm">
                        {language === 'ar' ? 'فحص الامتثال' : 'Compliance Checked'}
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t">
                  <Button variant="outline" onClick={() => setIsCreatePositionOpen(false)}>
                    {language === 'ar' ? 'إلغاء' : 'Cancel'}
                  </Button>
                  <Button variant="outline">
                    {language === 'ar' ? 'حفظ كمسودة' : 'Save as Draft'}
                  </Button>
                  <Button onClick={() => {
                    toast({
                      title: language === 'ar' ? 'تم إنشاء الوظيفة' : 'Position Created',
                      description: language === 'ar' 
                        ? `تم إنشاء منصب "${newPosition.title}" وربطه بنظام التوظيف بنجاح`
                        : `Position "${newPosition.title}" has been created and linked to recruitment system successfully`,
                    });
                    setIsCreatePositionOpen(false);
                    // In a real app, this would save to database and trigger recruitment workflow
                  }}>
                    {language === 'ar' ? 'إنشاء الوظيفة' : 'Create Position'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Key Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            {language === 'ar' ? 'مركز ذكاء تحليل الوظائف' : 'Job Analysis Intelligence Center'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{metrics.totalPositions}</div>
              <div className="text-xs text-muted-foreground">
                {language === 'ar' ? 'إجمالي المناصب' : 'Total Positions'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{metrics.pendingAnalysis}</div>
              <div className="text-xs text-muted-foreground">
                {language === 'ar' ? 'تحليل معلق' : 'Pending Analysis'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{metrics.completedDescriptions}</div>
              <div className="text-xs text-muted-foreground">
                {language === 'ar' ? 'أوصاف مكتملة' : 'Descriptions Complete'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{metrics.definedSpecifications}</div>
              <div className="text-xs text-muted-foreground">
                {language === 'ar' ? 'مواصفات محددة' : 'Specs Defined'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{metrics.completedEvaluations}</div>
              <div className="text-xs text-muted-foreground">
                {language === 'ar' ? 'تقييمات مكتملة' : 'Evaluations Complete'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">{metrics.complianceScore}%</div>
              <div className="text-xs text-muted-foreground">
                {language === 'ar' ? 'نتيجة الامتثال' : 'Compliance Score'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {language === 'ar' ? 'توصيات الذكاء الاصطناعي' : 'AI Recommendations'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {aiRecommendations.map((recommendation) => (
              <div key={recommendation.id} className="flex items-start justify-between p-3 border rounded-lg">
                <div className="flex items-start gap-3">
                  <Badge variant={
                    recommendation.priority === 'high' ? 'destructive' : 
                    recommendation.priority === 'medium' ? 'secondary' : 'outline'
                  }>
                    {recommendation.priority}
                  </Badge>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{recommendation.title}</p>
                    <p className="text-xs text-muted-foreground">{recommendation.description}</p>
                    <p className="text-xs text-primary">{recommendation.actionRequired}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  {language === 'ar' ? 'تطبيق' : 'Apply'}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="gap-2">
            <Briefcase className="h-4 w-4" />
            {language === 'ar' ? 'نظرة عامة' : 'Overview'}
          </TabsTrigger>
          <TabsTrigger value="descriptions" className="gap-2">
            <FileText className="h-4 w-4" />
            {language === 'ar' ? 'أوصاف الوظائف' : 'Job Descriptions'}
          </TabsTrigger>
          <TabsTrigger value="specifications" className="gap-2">
            <Target className="h-4 w-4" />
            {language === 'ar' ? 'مواصفات الوظائف' : 'Job Specifications'}
          </TabsTrigger>
          <TabsTrigger value="evaluation" className="gap-2">
            <Award className="h-4 w-4" />
            {language === 'ar' ? 'تقييم الوظائف' : 'Job Evaluation'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Position Status Grid */}
          <div className="space-y-4">
            {positions.map((position) => (
              <Card key={position.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    {/* Position Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">
                          {language === 'ar' ? position.titleAr : position.title}
                        </h3>
                        <Badge variant={position.status === 'active' ? 'default' : 'secondary'}>
                          {position.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{position.department}</span>
                        <span>•</span>
                        <span>{position.level} Level</span>
                        <span>•</span>
                        <span>{language === 'ar' ? 'آخر تحديث:' : 'Updated:'} {position.lastUpdated}</span>
                      </div>
                    </div>

                    {/* Status Indicators */}
                    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                      <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(position.jobDescriptionStatus)}
                          <span className="text-xs">
                            {language === 'ar' ? 'الوصف' : 'Description'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(position.jobSpecificationStatus)}
                          <span className="text-xs">
                            {language === 'ar' ? 'المواصفات' : 'Specs'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(position.evaluationStatus)}
                          <span className="text-xs">
                            {language === 'ar' ? 'التقييم' : 'Evaluation'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="gap-1">
                          <Eye className="h-3 w-3" />
                          {language === 'ar' ? 'عرض' : 'View'}
                        </Button>
                        <Button variant="outline" size="sm" className="gap-1">
                          <Edit className="h-3 w-3" />
                          {language === 'ar' ? 'تحرير' : 'Edit'}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Skills Match Progress */}
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">
                        {language === 'ar' ? 'تطابق المهارات' : 'Skills Match'}
                      </span>
                      <span className="text-sm">
                        {position.skillsMatched}/{position.skillsRequired} {language === 'ar' ? 'مهارات' : 'skills'}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(position.skillsMatched / position.skillsRequired) * 100}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="descriptions" className="space-y-6">
          {/* Job Description Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {language === 'ar' ? 'مولد أوصاف الوظائف بالذكاء الاصطناعي' : 'AI-Powered Job Description Generator'}
              </CardTitle>
              <CardDescription>
                {language === 'ar' 
                  ? 'إنشاء أوصاف وظائف شاملة بالعربية والإنجليزية مع الامتثال للقوانين السعودية'
                  : 'Generate comprehensive job descriptions in Arabic and English with Saudi compliance'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    {language === 'ar' ? 'اختر المنصب' : 'Select Position'}
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder={language === 'ar' ? 'اختر منصب...' : 'Select position...'} />
                    </SelectTrigger>
                    <SelectContent>
                      {positions.map((position) => (
                        <SelectItem key={position.id} value={position.id}>
                          {language === 'ar' ? position.titleAr : position.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    {language === 'ar' ? 'القسم' : 'Department'}
                  </label>
                  <Input placeholder={language === 'ar' ? 'أدخل القسم...' : 'Enter department...'} />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  {language === 'ar' ? 'ملخص الوظيفة' : 'Job Summary'}
                </label>
                <Textarea 
                  placeholder={language === 'ar' 
                    ? 'أدخل ملخص مختصر للوظيفة...'
                    : 'Enter a brief job summary...'
                  }
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <Button className="gap-2">
                  <TrendingUp className="h-4 w-4" />
                  {language === 'ar' ? 'إنشاء بالذكاء الاصطناعي' : 'Generate with AI'}
                </Button>
                <Button variant="outline" className="gap-2">
                  <FileText className="h-4 w-4" />
                  {language === 'ar' ? 'استخدام نموذج' : 'Use Template'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="specifications" className="space-y-6">
          {/* Job Specification Builder */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                {language === 'ar' ? 'محرك مواصفات الوظائف' : 'Job Specification Engine'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Education Requirements */}
                <div>
                  <h4 className="font-semibold mb-3">
                    {language === 'ar' ? 'متطلبات التعليم' : 'Education Requirements'}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder={language === 'ar' ? 'الحد الأدنى للتعليم' : 'Minimum Education'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high_school">{language === 'ar' ? 'الثانوية العامة' : 'High School'}</SelectItem>
                        <SelectItem value="bachelor">{language === 'ar' ? 'بكالوريوس' : 'Bachelor\'s Degree'}</SelectItem>
                        <SelectItem value="master">{language === 'ar' ? 'ماجستير' : 'Master\'s Degree'}</SelectItem>
                        <SelectItem value="phd">{language === 'ar' ? 'دكتوراه' : 'PhD'}</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Input placeholder={language === 'ar' ? 'التخصص المطلوب' : 'Required Field of Study'} />
                  </div>
                </div>

                {/* Experience Requirements */}
                <div>
                  <h4 className="font-semibold mb-3">
                    {language === 'ar' ? 'متطلبات الخبرة' : 'Experience Requirements'}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input placeholder={language === 'ar' ? 'سنوات الخبرة الدنيا' : 'Min Years Experience'} type="number" />
                    <Input placeholder={language === 'ar' ? 'سنوات الخبرة المفضلة' : 'Preferred Years'} type="number" />
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder={language === 'ar' ? 'نوع الخبرة' : 'Experience Type'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="relevant">{language === 'ar' ? 'خبرة ذات صلة' : 'Relevant Experience'}</SelectItem>
                        <SelectItem value="leadership">{language === 'ar' ? 'خبرة قيادية' : 'Leadership Experience'}</SelectItem>
                        <SelectItem value="technical">{language === 'ar' ? 'خبرة تقنية' : 'Technical Experience'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Skills Requirements */}
                <div>
                  <h4 className="font-semibold mb-3">
                    {language === 'ar' ? 'متطلبات المهارات' : 'Skills Requirements'}
                  </h4>
                  <Button variant="outline" className="gap-2">
                    <Plus className="h-4 w-4" />
                    {language === 'ar' ? 'ربط بمصفوفة المهارات' : 'Link to Skill Matrix'}
                  </Button>
                </div>

                <div className="flex gap-3">
                  <Button>
                    {language === 'ar' ? 'حفظ المواصفات' : 'Save Specifications'}
                  </Button>
                  <Button variant="outline">
                    {language === 'ar' ? 'معاينة' : 'Preview'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evaluation" className="space-y-6">
          {/* Job Evaluation Framework */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                {language === 'ar' ? 'إطار تقييم الوظائف' : 'Job Evaluation Framework'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Grading System */}
                <div>
                  <h4 className="font-semibold mb-3">
                    {language === 'ar' ? 'نظام التدرج' : 'Position Grading System'}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-600">Grade 12</div>
                      <div className="text-sm text-muted-foreground">Current Assessment</div>
                    </div>
                    <div className="p-4 border rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-600">85%</div>
                      <div className="text-sm text-muted-foreground">Market Alignment</div>
                    </div>
                    <div className="p-4 border rounded-lg text-center">
                      <div className="text-2xl font-bold text-purple-600">12,500 SAR</div>
                      <div className="text-sm text-muted-foreground">Salary Range</div>
                    </div>
                  </div>
                </div>

                {/* Evaluation Criteria */}
                <div>
                  <h4 className="font-semibold mb-3">
                    {language === 'ar' ? 'معايير التقييم' : 'Evaluation Criteria'}
                  </h4>
                  <div className="space-y-3">
                    {[
                      { criteria: 'Complexity', value: 4.2, weight: 30 },
                      { criteria: 'Responsibility', value: 3.8, weight: 25 },
                      { criteria: 'Skills Required', value: 4.0, weight: 20 },
                      { criteria: 'Impact', value: 3.5, weight: 15 },
                      { criteria: 'Working Conditions', value: 4.5, weight: 10 }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{item.criteria}</span>
                          <Badge variant="outline">{item.weight}% weight</Badge>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-24 bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full"
                              style={{ width: `${(item.value / 5) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{item.value}/5.0</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Button className="w-full">
                  {language === 'ar' ? 'إكمال التقييم' : 'Complete Evaluation'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};