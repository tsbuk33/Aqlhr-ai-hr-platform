import { useState, useEffect } from "react";
import { useLanguage } from "@/hooks/useLanguageCompat";
import { useToast } from "@/hooks/use-toast";
import { EnhancedPageLayout } from "@/components/enhanced/EnhancedPageLayout";
import { UniversalDocumentManager } from "@/components/common/UniversalDocumentManager";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LocationForm, 
  SectorActivityForm, 
  CompanySelect 
} from "@/components/forms/SaudiReferenceSelects";
import { 
  Users, 
  UserPlus, 
  FileCheck, 
  Clock,
  Target,
  CheckCircle,
  AlertCircle,
  Briefcase,
  MapPin,
  Building,
  Upload,
  FileText,
  Globe,
  MessageSquare,
  Shield,
  BarChart3,
  ExternalLink,
  Star,
  Search,
  Filter,
  Send,
  Phone,
  Mail,
  Calendar,
  TrendingUp,
  Award,
  Zap
} from "lucide-react";
import { JobOfferManagement } from "@/components/job-offer/JobOfferManagement";
import ModuleDocumentUploader from '@/components/universal/ModuleDocumentUploader';
import { AqlHRAIAssistant } from '@/components/ai';

const RecruitmentOnboarding = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Form state for demonstration
  const [formData, setFormData] = useState({
    region: '',
    city: '',
    sector: '',
    activity: '',
    company: '',
    position: '',
    description: '',
    requirements: ''
  });

  // Translation helper
  const t = (arText: string, enText: string) => language === 'ar' ? arText : enText;

  // Local Saudi Recruitment Platforms Data
  const localPlatforms = [
    {
      id: 'qiwa',
      name: 'Qiwa',
      nameAr: 'قوى',
      url: 'https://qiwa.sa',
      status: 'active',
      category: 'Government',
      categoryAr: 'حكومي',
      activeJobs: 2450,
      lastSync: new Date('2024-01-15T14:30:00'),
      candidates: 15420,
      description: 'Ministry of Labor platform',
      descriptionAr: 'منصة وزارة العمل'
    },
    {
      id: 'gosi',
      name: 'GOSI',
      nameAr: 'التأمينات الاجتماعية',
      url: 'https://gosi.gov.sa',
      status: 'active',
      category: 'Government',
      categoryAr: 'حكومي',
      activeJobs: 890,
      lastSync: new Date('2024-01-15T13:45:00'),
      candidates: 8750,
      description: 'Social Insurance platform',
      descriptionAr: 'منصة التأمينات الاجتماعية'
    },
    {
      id: 'mol',
      name: 'MOL',
      nameAr: 'وزارة العمل',
      url: 'https://mol.gov.sa',
      status: 'active',
      category: 'Government',
      categoryAr: 'حكومي',
      activeJobs: 1650,
      lastSync: new Date('2024-01-15T12:20:00'),
      candidates: 12300,
      description: 'Ministry of Labor',
      descriptionAr: 'وزارة العمل والتنمية الاجتماعية'
    },
    {
      id: 'hrsd',
      name: 'HRSD',
      nameAr: 'الموارد البشرية والتنمية الاجتماعية',
      url: 'https://hrsd.gov.sa',
      status: 'active',
      category: 'Government',
      categoryAr: 'حكومي',
      activeJobs: 780,
      lastSync: new Date('2024-01-15T11:15:00'),
      candidates: 6890,
      description: 'Human Resources Development',
      descriptionAr: 'تنمية الموارد البشرية'
    },
    {
      id: 'bayt_sa',
      name: 'Bayt.com Saudi',
      nameAr: 'بيت.كوم السعودية',
      url: 'https://www.bayt.com/en/saudi-arabia/',
      status: 'active',
      category: 'Commercial',
      categoryAr: 'تجاري',
      activeJobs: 3200,
      lastSync: new Date('2024-01-15T10:30:00'),
      candidates: 18500,
      description: 'Leading job portal in MENA',
      descriptionAr: 'بوابة الوظائف الرائدة في المنطقة'
    },
    {
      id: 'linkedin_sa',
      name: 'LinkedIn Saudi Arabia',
      nameAr: 'لينكد إن السعودية',
      url: 'https://www.linkedin.com/jobs/search/?location=Saudi%20Arabia',
      status: 'active',
      category: 'International',
      categoryAr: 'دولي',
      activeJobs: 2800,
      lastSync: new Date('2024-01-15T09:45:00'),
      candidates: 22100,
      description: 'Professional networking platform',
      descriptionAr: 'منصة الشبكات المهنية'
    },
    {
      id: 'gulftalent_sa',
      name: 'GulfTalent Saudi',
      nameAr: 'جلف تالنت السعودية',
      url: 'https://www.gulftalent.com/saudi-arabia',
      status: 'active',
      category: 'Regional',
      categoryAr: 'إقليمي',
      activeJobs: 1450,
      lastSync: new Date('2024-01-15T08:20:00'),
      candidates: 9800,
      description: 'Gulf region recruitment',
      descriptionAr: 'توظيف منطقة الخليج'
    },
    {
      id: 'naukrigulf_sa',
      name: 'Naukrigulf Saudi',
      nameAr: 'نوكري جلف السعودية',
      url: 'https://www.naukrigulf.com/saudi-arabia-jobs',
      status: 'active',
      category: 'International',
      categoryAr: 'دولي',
      activeJobs: 1890,
      lastSync: new Date('2024-01-15T07:30:00'),
      candidates: 14200,
      description: 'Gulf job opportunities',
      descriptionAr: 'فرص العمل في الخليج'
    },
    {
      id: 'indeed_sa',
      name: 'Indeed Saudi Arabia',
      nameAr: 'إنديد السعودية',
      url: 'https://sa.indeed.com/',
      status: 'active',
      category: 'International',
      categoryAr: 'دولي',
      activeJobs: 2100,
      lastSync: new Date('2024-01-15T06:15:00'),
      candidates: 16700,
      description: 'Global job search engine',
      descriptionAr: 'محرك البحث العالمي للوظائف'
    },
    {
      id: 'monster_sa',
      name: 'Monster Saudi Arabia',
      nameAr: 'مونستر السعودية',
      url: 'https://www.monster.com.sa/',
      status: 'active',
      category: 'International',
      categoryAr: 'دولي',
      activeJobs: 1320,
      lastSync: new Date('2024-01-15T05:45:00'),
      candidates: 11200,
      description: 'Career advancement platform',
      descriptionAr: 'منصة تطوير المهن'
    },
    {
      id: 'tanqeeb',
      name: 'Tanqeeb',
      nameAr: 'تنقيب',
      url: 'https://www.tanqeeb.com/saudi-arabia',
      status: 'active',
      category: 'Regional',
      categoryAr: 'إقليمي',
      activeJobs: 980,
      lastSync: new Date('2024-01-15T04:30:00'),
      candidates: 7600,
      description: 'MENA job search',
      descriptionAr: 'البحث عن الوظائف في المنطقة'
    },
    {
      id: 'akhtaboot',
      name: 'Akhtaboot',
      nameAr: 'أختبوط',
      url: 'https://www.akhtaboot.com/saudi-arabia',
      status: 'active',
      category: 'Regional',
      categoryAr: 'إقليمي',
      activeJobs: 750,
      lastSync: new Date('2024-01-15T03:20:00'),
      candidates: 5800,
      description: 'Regional recruitment platform',
      descriptionAr: 'منصة التوظيف الإقليمية'
    },
    {
      id: 'mihnati',
      name: 'Mihnati',
      nameAr: 'مهنتي',
      url: 'https://www.mihnati.com/',
      status: 'maintenance',
      category: 'Local',
      categoryAr: 'محلي',
      activeJobs: 0,
      lastSync: new Date('2024-01-14T20:00:00'),
      candidates: 3200,
      description: 'Local career platform',
      descriptionAr: 'منصة المهن المحلية'
    },
    {
      id: 'jadara',
      name: 'Jadara',
      nameAr: 'جدارة',
      url: 'https://www.jadara.gov.sa/',
      status: 'maintenance',
      category: 'Government',
      categoryAr: 'حكومي',
      activeJobs: 0,
      lastSync: new Date('2024-01-14T18:30:00'),
      candidates: 4500,
      description: 'Government jobs platform',
      descriptionAr: 'منصة الوظائف الحكومية'
    }
  ];

  // International Recruitment Agents Data with Functional Links
  const internationalAgents = [
    {
      id: 'gcc_cluster',
      name: 'GCC Recruitment Cluster',
      nameAr: 'مجموعة التوظيف الخليجية',
      region: 'GCC',
      agents: 25,
      activeCandidates: 450,
      responseTime: '2.5 hours',
      rating: 4.8,
      specializations: ['Executive', 'Engineering', 'Healthcare', 'Finance'],
      countries: ['UAE', 'Kuwait', 'Bahrain', 'Qatar', 'Oman'],
      platforms: [
        { name: 'Bayt.com UAE', url: 'https://www.bayt.com/en/uae/', active: true },
        { name: 'GulfTalent UAE', url: 'https://www.gulftalent.com/uae', active: true },
        { name: 'Naukrigulf UAE', url: 'https://www.naukrigulf.com/uae-jobs', active: true },
        { name: 'LinkedIn UAE', url: 'https://www.linkedin.com/jobs/search/?location=United%20Arab%20Emirates', active: true },
        { name: 'Indeed UAE', url: 'https://ae.indeed.com/', active: true }
      ]
    },
    {
      id: 'south_asian_cluster',
      name: 'South Asian Recruitment Network',
      nameAr: 'شبكة التوظيف لجنوب آسيا',
      region: 'South Asia',
      agents: 40,
      activeCandidates: 1200,
      responseTime: '1.8 hours',
      rating: 4.6,
      specializations: ['IT', 'Engineering', 'Healthcare', 'Manufacturing'],
      countries: ['India', 'Pakistan', 'Bangladesh', 'Sri Lanka', 'Nepal'],
      platforms: [
        { name: 'Naukri.com', url: 'https://www.naukri.com/', active: true },
        { name: 'Monster India', url: 'https://www.monsterindia.com/', active: true },
        { name: 'Rozee.pk', url: 'https://www.rozee.pk/', active: true },
        { name: 'BDJobs.com', url: 'https://www.bdjobs.com/', active: true },
        { name: 'TopJobs.lk', url: 'https://www.topjobs.lk/', active: true }
      ]
    },
    {
      id: 'western_cluster',
      name: 'Western Talent Acquisition',
      nameAr: 'استقطاب المواهب الغربية',
      region: 'Western',
      agents: 15,
      activeCandidates: 180,
      responseTime: '4.2 hours',
      rating: 4.9,
      specializations: ['Executive', 'Consulting', 'Technology', 'Research'],
      countries: ['USA', 'Canada', 'UK', 'Germany', 'Australia'],
      platforms: [
        { name: 'LinkedIn USA', url: 'https://www.linkedin.com/jobs/search/?location=United%20States', active: true },
        { name: 'Indeed USA', url: 'https://www.indeed.com/', active: true },
        { name: 'Monster USA', url: 'https://www.monster.com/', active: true },
        { name: 'Reed.co.uk', url: 'https://www.reed.co.uk/', active: true },
        { name: 'Seek.com.au', url: 'https://www.seek.com.au/', active: true }
      ]
    },
    {
      id: 'african_cluster',
      name: 'African Recruitment Alliance',
      nameAr: 'تحالف التوظيف الأفريقي',
      region: 'Africa',
      agents: 30,
      activeCandidates: 680,
      responseTime: '3.1 hours',
      rating: 4.5,
      specializations: ['Healthcare', 'Education', 'Engineering', 'Agriculture'],
      countries: ['Egypt', 'Morocco', 'Tunisia', 'Sudan', 'Nigeria'],
      platforms: [
        { name: 'Wuzzuf Egypt', url: 'https://wuzzuf.net/jobs/egypt', active: true },
        { name: 'Rekrute.com', url: 'https://www.rekrute.com/', active: true },
        { name: 'Jobberman', url: 'https://www.jobberman.com/', active: true },
        { name: 'Tanitjobs', url: 'https://www.tanitjobs.com/', active: true },
        { name: 'Bayt Egypt', url: 'https://www.bayt.com/en/egypt/', active: true }
      ]
    }
  ];

  // Saudi Compliance Services Data
  const complianceServices = [
    {
      id: 'gosi',
      name: 'GOSI',
      nameAr: 'التأمينات الاجتماعية',
      description: 'General Organization for Social Insurance',
      descriptionAr: 'المؤسسة العامة للتأمينات الاجتماعية',
      score: 95,
      status: 'compliant',
      lastCheck: new Date('2024-01-15T14:00:00'),
      issues: 0,
      url: 'https://gosi.gov.sa'
    },
    {
      id: 'qiwa',
      name: 'Qiwa',
      nameAr: 'قوى',
      description: 'Ministry of Labor Platform',
      descriptionAr: 'منصة وزارة العمل',
      score: 92,
      status: 'compliant',
      lastCheck: new Date('2024-01-15T13:30:00'),
      issues: 1,
      url: 'https://qiwa.sa'
    },
    {
      id: 'mol',
      name: 'MOL',
      nameAr: 'وزارة العمل',
      description: 'Ministry of Labor',
      descriptionAr: 'وزارة العمل والتنمية الاجتماعية',
      score: 88,
      status: 'compliant',
      lastCheck: new Date('2024-01-15T12:45:00'),
      issues: 2,
      url: 'https://mol.gov.sa'
    },
    {
      id: 'hrsd',
      name: 'HRSD',
      nameAr: 'الموارد البشرية',
      description: 'Human Resources Development',
      descriptionAr: 'تنمية الموارد البشرية والتنمية الاجتماعية',
      score: 90,
      status: 'compliant',
      lastCheck: new Date('2024-01-15T11:20:00'),
      issues: 1,
      url: 'https://hrsd.gov.sa'
    },
    {
      id: 'absher',
      name: 'Absher',
      nameAr: 'أبشر',
      description: 'Digital Government Platform',
      descriptionAr: 'منصة الحكومة الرقمية',
      score: 94,
      status: 'compliant',
      lastCheck: new Date('2024-01-15T10:15:00'),
      issues: 0,
      url: 'https://absher.sa'
    },
    {
      id: 'wps',
      name: 'WPS',
      nameAr: 'نظام حماية الأجور',
      description: 'Wage Protection System',
      descriptionAr: 'نظام حماية الأجور',
      score: 87,
      status: 'warning',
      lastCheck: new Date('2024-01-15T09:30:00'),
      issues: 3,
      url: 'https://wps.mol.gov.sa'
    },
    {
      id: 'nitaqat',
      name: 'Nitaqat',
      nameAr: 'نطاقات',
      description: 'Saudization Program',
      descriptionAr: 'برنامج التوطين',
      score: 85,
      status: 'warning',
      lastCheck: new Date('2024-01-15T08:45:00'),
      issues: 4,
      url: 'https://nitaqat.mol.gov.sa'
    }
  ];

  const stats = [
    {
      title: t('المرشحون النشطون', 'Active Candidates'),
      value: 1247,
      icon: Users,
      variant: "primary" as const,
      trend: { value: "+12%", isPositive: true }
    },
    {
      title: t('الوظائف المفتوحة', 'Open Positions'),
      value: 89,
      icon: Briefcase,
      variant: "accent" as const,
      trend: { value: "+5", isPositive: true }
    },
    {
      title: t('عمليات التوظيف هذا الشهر', 'Hires This Month'),
      value: 34,
      icon: UserPlus,
      variant: "success" as const,
      trend: { value: "+8", isPositive: true }
    },
    {
      title: t('متوسط وقت التوظيف', 'Average Time to Hire'),
      value: '18 ' + t('يوم', 'days'),
      icon: Clock,
      variant: "warning" as const,
      trend: { value: "-3 days", isPositive: true }
    }
  ];

  // Dashboard Tab Component
  const DashboardTab = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs ${stat.trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {stat.trend.value} {t('من الشهر الماضي', 'from last month')}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>{t('الإجراءات السريعة', 'Quick Actions')}</CardTitle>
          <CardDescription>
            {t('الإجراءات الأكثر استخداماً في التوظيف', 'Most used recruitment actions')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button className="h-20 flex flex-col gap-2" variant="outline">
              <UserPlus className="h-6 w-6" />
              {t('إضافة وظيفة جديدة', 'Add New Position')}
            </Button>
            <Button className="h-20 flex flex-col gap-2" variant="outline">
              <FileCheck className="h-6 w-6" />
              {t('مراجعة السير الذاتية', 'Review CVs')}
            </Button>
            <Button className="h-20 flex flex-col gap-2" variant="outline">
              <Users className="h-6 w-6" />
              {t('إعداد موظف جديد', 'Onboard Employee')}
            </Button>
            <Button className="h-20 flex flex-col gap-2" variant="outline">
              <FileText className="h-6 w-6" />
              {t('إنشاء عرض عمل', 'Create Job Offer')}
            </Button>
            <Button className="h-20 flex flex-col gap-2" variant="outline">
              <BarChart3 className="h-6 w-6" />
              {t('تقارير التوظيف', 'Recruitment Reports')}
            </Button>
            <Button className="h-20 flex flex-col gap-2" variant="outline">
              <MessageSquare className="h-6 w-6" />
              {t('مركز التواصل', 'Communication Hub')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-success" />
                {t('التوظيف النشط', 'Active Recruitment')}
              </div>
              <Badge variant="outline" className="bg-success/10 text-success">
                {t('جاري', 'Ongoing')}
              </Badge>
            </CardTitle>
            <CardDescription>
              {t('عمليات التوظيف الجارية', 'Ongoing recruitment processes')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-sm text-muted-foreground">
                {t('89 وظيفة مفتوحة', '89 open positions')}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                {t('بنك المواهب', 'Talent Pool')}
              </div>
              <Badge variant="outline" className="bg-primary/10 text-primary">
                {t('نشط', 'Active')}
              </Badge>
            </CardTitle>
            <CardDescription>
              {t('قاعدة بيانات المرشحين', 'Candidate database')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-sm text-muted-foreground">
                {t('1,247 مرشح', '1,247 candidates')}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-accent" />
                {t('الإعداد والتهيئة', 'Onboarding')}
              </div>
              <Badge variant="outline" className="bg-accent/10 text-accent">
                {t('متقدم', 'Advanced')}
              </Badge>
            </CardTitle>
            <CardDescription>
              {t('عملية إعداد الموظفين الجدد', 'New employee onboarding process')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span className="text-sm text-muted-foreground">
                {t('12 موظف في الإعداد', '12 employees onboarding')}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-warning" />
                {t('أهداف التوطين', 'Saudization Goals')}
              </div>
              <Badge variant="outline" className="bg-warning/10 text-warning">
                {t('في المسار', 'On Track')}
              </Badge>
            </CardTitle>
            <CardDescription>
              {t('تحقيق أهداف التوطين', 'Meeting Saudization targets')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-warning rounded-full"></div>
              <span className="text-sm text-muted-foreground">
                {t('67% نسبة التوطين', '67% Saudization rate')}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Local Platforms Tab Component
  const LocalPlatformsTab = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">
            {t('منصات التوظيف السعودية المحلية', 'Local Saudi Recruitment Platforms')}
          </h3>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-green-100 text-green-800">
              {t('12 منصة نشطة', '12 Active Platforms')}
            </Badge>
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
              {t('2 في الصيانة', '2 Under Maintenance')}
            </Badge>
          </div>
        </div>

        {/* Platform Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">14</div>
            <div className="text-sm text-gray-600">
              {t('إجمالي المنصات', 'Total Platforms')}
            </div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">18,450</div>
            <div className="text-sm text-gray-600">
              {t('الوظائف النشطة', 'Active Jobs')}
            </div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">137,260</div>
            <div className="text-sm text-gray-600">
              {t('إجمالي المرشحين', 'Total Candidates')}
            </div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">85.7%</div>
            <div className="text-sm text-gray-600">
              {t('معدل التشغيل', 'Uptime Rate')}
            </div>
          </div>
        </div>

        {/* Platforms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {localPlatforms.map((platform) => (
            <div key={platform.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {language === 'ar' ? platform.nameAr : platform.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {language === 'ar' ? platform.categoryAr : platform.category}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    platform.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'
                  }`}></div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    platform.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {platform.status === 'active' ? t('نشط', 'Active') : t('صيانة', 'Maintenance')}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('الوظائف النشطة', 'Active Jobs')}:</span>
                  <span className="font-medium">{platform.activeJobs.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('المرشحين', 'Candidates')}:</span>
                  <span className="font-medium">{platform.candidates.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('آخر مزامنة', 'Last Sync')}:</span>
                  <span className="font-medium">{platform.lastSync.toLocaleTimeString()}</span>
                </div>
              </div>
              
              <p className="text-xs text-gray-500 mb-3">
                {language === 'ar' ? platform.descriptionAr : platform.description}
              </p>
              
              <div className="flex gap-2">
                <a 
                  href={platform.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 flex items-center justify-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  {t('زيارة المنصة', 'Visit Platform')}
                </a>
                <Button variant="outline" size="sm" className="px-3">
                  {t('مزامنة', 'Sync')}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // International Agents Tab Component
  const InternationalAgentsTab = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">
            {t('الوكلاء الدوليون للتوظيف', 'International Recruitment Agents')}
          </h3>
          <Button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
            {t('إضافة وكيل', 'Add Agent')}
          </Button>
        </div>

        {/* International Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">4</div>
            <div className="text-sm text-gray-600">
              {t('المجموعات الإقليمية', 'Regional Clusters')}
            </div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">110</div>
            <div className="text-sm text-gray-600">
              {t('إجمالي الوكلاء', 'Total Agents')}
            </div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">2,510</div>
            <div className="text-sm text-gray-600">
              {t('المرشحين النشطين', 'Active Candidates')}
            </div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">2.8h</div>
            <div className="text-sm text-gray-600">
              {t('متوسط وقت الاستجابة', 'Avg Response Time')}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {internationalAgents.map((cluster) => (
            <div key={cluster.id} className="border rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {language === 'ar' ? cluster.nameAr : cluster.name}
                  </h4>
                  <p className="text-sm text-gray-600">{cluster.region}</p>
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-500 mr-1" />
                  <span className="text-sm font-medium">{cluster.rating}</span>
                </div>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {t('الوكلاء', 'Agents')}:
                  </span>
                  <span className="font-medium">{cluster.agents}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {t('المرشحين النشطين', 'Active Candidates')}:
                  </span>
                  <span className="font-medium">{cluster.activeCandidates.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {t('وقت الاستجابة', 'Response Time')}:
                  </span>
                  <span className="font-medium">{cluster.responseTime}</span>
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">
                  {t('التخصصات', 'Specializations')}:
                </p>
                <div className="flex flex-wrap gap-1">
                  {cluster.specializations.map((spec) => (
                    <span key={spec} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Platform Links */}
              {cluster.platforms && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">
                    {t('منصات التوظيف', 'Recruitment Platforms')}:
                  </p>
                  <div className="space-y-1">
                    {cluster.platforms.map((platform, index) => (
                      <div key={index} className="flex items-center justify-between text-xs">
                        <a 
                          href={platform.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 hover:underline flex items-center"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          {platform.name}
                        </a>
                        <span className={`px-1 py-0.5 rounded text-xs ${
                          platform.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {platform.active ? '✓' : '✗'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-4 flex space-x-2">
                <Button className="flex-1 bg-purple-600 text-white py-2 px-3 rounded text-sm hover:bg-purple-700">
                  {t('التواصل مع الوكلاء', 'Contact Agents')}
                </Button>
                <Button variant="outline" className="flex-1 border border-gray-300 py-2 px-3 rounded text-sm hover:bg-gray-50">
                  {t('عرض المرشحين', 'View Candidates')}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Communication Hub Tab Component
  const CommunicationHubTab = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">
            {t('مركز التواصل المركزي', 'Centralized Communication Hub')}
          </h3>
          <Button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
            {t('رسالة جديدة', 'New Message')}
          </Button>
        </div>

        {/* Communication Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">24</div>
            <div className="text-sm text-gray-600">
              {t('المحادثات النشطة', 'Active Conversations')}
            </div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">94%</div>
            <div className="text-sm text-gray-600">
              {t('معدل الاستجابة', 'Response Rate')}
            </div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">2.1h</div>
            <div className="text-sm text-gray-600">
              {t('متوسط وقت الاستجابة', 'Avg Response Time')}
            </div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">98%</div>
            <div className="text-sm text-gray-600">
              {t('نقاط الامتثال', 'Compliance Score')}
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex space-x-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder={t('البحث في المحادثات...', 'Search conversations...')}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            {t('تصفية', 'Filter')}
          </Button>
        </div>

        {/* Active Conversations */}
        <div className="space-y-4">
          <h4 className="font-medium">{t('المحادثات النشطة', 'Active Conversations')}</h4>
          
          {/* Sample conversations */}
          {[
            {
              id: 1,
              contact: 'Ahmed Al-Rashid',
              contactAr: 'أحمد الراشد',
              platform: 'LinkedIn UAE',
              lastMessage: 'Interested in the Senior Developer position',
              lastMessageAr: 'مهتم بوظيفة مطور أول',
              time: '2 min ago',
              timeAr: 'منذ دقيقتين',
              unread: 2,
              status: 'online'
            },
            {
              id: 2,
              contact: 'Sarah Johnson',
              contactAr: 'سارة جونسون',
              platform: 'Indeed USA',
              lastMessage: 'Can you provide more details about the role?',
              lastMessageAr: 'هل يمكنك تقديم المزيد من التفاصيل حول الدور؟',
              time: '15 min ago',
              timeAr: 'منذ 15 دقيقة',
              unread: 0,
              status: 'away'
            },
            {
              id: 3,
              contact: 'Mohamed Hassan',
              contactAr: 'محمد حسن',
              platform: 'Wuzzuf Egypt',
              lastMessage: 'Thank you for considering my application',
              lastMessageAr: 'شكراً لك على النظر في طلبي',
              time: '1 hour ago',
              timeAr: 'منذ ساعة',
              unread: 1,
              status: 'offline'
            }
          ].map((conversation) => (
            <div key={conversation.id} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium">
                        {(language === 'ar' ? conversation.contactAr : conversation.contact).charAt(0)}
                      </span>
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                      conversation.status === 'online' ? 'bg-green-500' : 
                      conversation.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                    }`}></div>
                  </div>
                  <div>
                    <h5 className="font-medium">
                      {language === 'ar' ? conversation.contactAr : conversation.contact}
                    </h5>
                    <p className="text-xs text-gray-500">{conversation.platform}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    {language === 'ar' ? conversation.timeAr : conversation.time}
                  </p>
                  {conversation.unread > 0 && (
                    <span className="inline-block bg-blue-600 text-white text-xs rounded-full px-2 py-1 mt-1">
                      {conversation.unread}
                    </span>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-600 truncate">
                {language === 'ar' ? conversation.lastMessageAr : conversation.lastMessage}
              </p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-6 flex gap-4">
          <Button className="flex items-center gap-2">
            <Send className="w-4 h-4" />
            {t('إرسال رسالة جماعية', 'Send Bulk Message')}
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            {t('جدولة مكالمة', 'Schedule Call')}
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {t('حجز مقابلة', 'Book Interview')}
          </Button>
        </div>
      </div>
    </div>
  );

  // Compliance Tab Component
  const ComplianceTab = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">
            {t('مراقبة الامتثال السعودي', 'Saudi Compliance Monitoring')}
          </h3>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-green-100 text-green-800">
              {t('89.3% نقاط الامتثال الإجمالية', '89.3% Overall Compliance Score')}
            </Badge>
          </div>
        </div>

        {/* Compliance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">5</div>
            <div className="text-sm text-gray-600">
              {t('خدمات متوافقة', 'Compliant Services')}
            </div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">2</div>
            <div className="text-sm text-gray-600">
              {t('تحذيرات', 'Warnings')}
            </div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">10</div>
            <div className="text-sm text-gray-600">
              {t('إجمالي المشاكل', 'Total Issues')}
            </div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">24/7</div>
            <div className="text-sm text-gray-600">
              {t('المراقبة المستمرة', 'Continuous Monitoring')}
            </div>
          </div>
        </div>

        {/* Compliance Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {complianceServices.map((service) => (
            <div key={service.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {language === 'ar' ? service.nameAr : service.name}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {language === 'ar' ? service.descriptionAr : service.description}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    service.status === 'compliant' ? 'bg-green-500' : 'bg-yellow-500'
                  }`}></div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    service.status === 'compliant' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {service.status === 'compliant' ? t('متوافق', 'Compliant') : t('تحذير', 'Warning')}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('النقاط', 'Score')}:</span>
                  <span className="font-medium">{service.score}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('المشاكل', 'Issues')}:</span>
                  <span className={`font-medium ${service.issues === 0 ? 'text-green-600' : 'text-yellow-600'}`}>
                    {service.issues}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('آخر فحص', 'Last Check')}:</span>
                  <span className="font-medium">{service.lastCheck.toLocaleTimeString()}</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <a 
                  href={service.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 flex items-center justify-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  {t('زيارة الخدمة', 'Visit Service')}
                </a>
                <Button variant="outline" size="sm" className="px-3">
                  {t('فحص', 'Check')}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Analytics Tab Component
  const AnalyticsTab = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">
            {t('تحليلات التوظيف المتقدمة', 'Advanced Recruitment Analytics')}
          </h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              {t('تصدير التقرير', 'Export Report')}
            </Button>
            <Button variant="outline" size="sm">
              {t('جدولة التقرير', 'Schedule Report')}
            </Button>
          </div>
        </div>

        {/* Analytics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">342</div>
            <div className="text-sm text-gray-600">
              {t('إجمالي التوظيفات', 'Total Hires')}
            </div>
            <div className="text-xs text-green-600 mt-1">
              <TrendingUp className="w-3 h-3 inline mr-1" />
              +15% {t('هذا الشهر', 'this month')}
            </div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">18.5</div>
            <div className="text-sm text-gray-600">
              {t('متوسط أيام التوظيف', 'Avg Days to Hire')}
            </div>
            <div className="text-xs text-green-600 mt-1">
              <TrendingUp className="w-3 h-3 inline mr-1" />
              -3 {t('أيام تحسن', 'days improved')}
            </div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">$2,450</div>
            <div className="text-sm text-gray-600">
              {t('متوسط تكلفة التوظيف', 'Avg Cost per Hire')}
            </div>
            <div className="text-xs text-green-600 mt-1">
              <TrendingUp className="w-3 h-3 inline mr-1" />
              -12% {t('انخفاض', 'reduction')}
            </div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">87%</div>
            <div className="text-sm text-gray-600">
              {t('معدل نجاح التوظيف', 'Hire Success Rate')}
            </div>
            <div className="text-xs text-green-600 mt-1">
              <TrendingUp className="w-3 h-3 inline mr-1" />
              +5% {t('تحسن', 'improvement')}
            </div>
          </div>
        </div>

        {/* Performance by Platform */}
        <div className="mb-6">
          <h4 className="font-medium mb-4">{t('الأداء حسب المنصة', 'Performance by Platform')}</h4>
          <div className="space-y-3">
            {[
              { name: 'LinkedIn Saudi', nameAr: 'لينكد إن السعودية', hires: 89, cost: '$2,100', quality: 92 },
              { name: 'Bayt.com Saudi', nameAr: 'بيت.كوم السعودية', hires: 76, cost: '$1,800', quality: 88 },
              { name: 'Qiwa Platform', nameAr: 'منصة قوى', hires: 65, cost: '$1,200', quality: 85 },
              { name: 'GulfTalent', nameAr: 'جلف تالنت', hires: 54, cost: '$2,800', quality: 94 },
              { name: 'Indeed Saudi', nameAr: 'إنديد السعودية', hires: 43, cost: '$1,950', quality: 82 }
            ].map((platform, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium">{index + 1}</span>
                  </div>
                  <div>
                    <h5 className="font-medium">
                      {language === 'ar' ? platform.nameAr : platform.name}
                    </h5>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <div className="font-medium">{platform.hires}</div>
                    <div className="text-gray-500">{t('توظيف', 'Hires')}</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{platform.cost}</div>
                    <div className="text-gray-500">{t('التكلفة', 'Cost')}</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{platform.quality}%</div>
                    <div className="text-gray-500">{t('الجودة', 'Quality')}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing Agents */}
        <div>
          <h4 className="font-medium mb-4">{t('أفضل الوكلاء أداءً', 'Top Performing Agents')}</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: 'Ahmed Al-Rashid', nameAr: 'أحمد الراشد', region: 'GCC', hires: 23, rating: 4.9 },
              { name: 'Sarah Johnson', nameAr: 'سارة جونسون', region: 'Western', hires: 18, rating: 4.8 },
              { name: 'Rajesh Kumar', nameAr: 'راجيش كومار', region: 'South Asia', hires: 31, rating: 4.7 }
            ].map((agent, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h5 className="font-medium">
                      {language === 'ar' ? agent.nameAr : agent.name}
                    </h5>
                    <p className="text-sm text-gray-500">{agent.region}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>{t('التوظيفات', 'Hires')}:</span>
                    <span className="font-medium">{agent.hires}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('التقييم', 'Rating')}:</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500" />
                      <span className="font-medium">{agent.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    {
      id: 'dashboard',
      label: t('لوحة التحكم', 'Dashboard'),
      icon: BarChart3,
      content: <DashboardTab />
    },
    {
      id: 'local-platforms',
      label: t('المنصات المحلية', 'Local Platforms'),
      icon: MapPin,
      content: <LocalPlatformsTab />
    },
    {
      id: 'international-agents',
      label: t('الوكلاء الدوليون', 'International Agents'),
      icon: Globe,
      content: <InternationalAgentsTab />
    },
    {
      id: 'communication-hub',
      label: t('مركز التواصل', 'Communication Hub'),
      icon: MessageSquare,
      content: <CommunicationHubTab />
    },
    {
      id: 'compliance',
      label: t('الامتثال', 'Compliance'),
      icon: Shield,
      content: <ComplianceTab />
    },
    {
      id: 'analytics',
      label: t('التحليلات', 'Analytics'),
      icon: BarChart3,
      content: <AnalyticsTab />
    },
    {
      id: 'documents',
      label: t('المستندات', 'Documents'),
      icon: FileText,
      content: (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                {t('رفع المستندات', 'Upload Documents')}
              </CardTitle>
              <CardDescription>
                {t('ارفع ملفات التوظيف والإعداد للمعالجة بالذكاء الاصطناعي', 'Upload recruitment and onboarding files for AI processing')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UniversalDocumentManager
                moduleName="Recruitment & Onboarding"
                moduleNameAr="التوظيف والإعداد"
                description="Upload CVs, job descriptions, interview notes, offer letters, and onboarding documents"
                descriptionAr="رفع السير الذاتية ووصف الوظائف وملاحظات المقابلات وخطابات العروض ووثائق الإعداد"
                platform="recruitment-onboarding"
                moduleType="hr"
                acceptedTypes={['.pdf', '.doc', '.docx', '.xlsx', '.csv', '.jpg', '.jpeg', '.png']}
                maxFileSize={20 * 1024 * 1024}
                maxFiles={40}
                showAsCard={false}
              />
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: 'position-form',
      label: t('إضافة وظيفة', 'Add Position'),
      icon: UserPlus,
      content: (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                {t('إنشاء وظيفة جديدة', 'Create New Position')}
              </CardTitle>
              <CardDescription>
                {t('استخدم قاعدة البيانات المرجعية السعودية لتحديد الموقع والقطاع', 'Use Saudi reference database to specify location and sector')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Location Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  {t('الموقع', 'Location')}
                </h3>
                <LocationForm
                  regionValue={formData.region}
                  cityValue={formData.city}
                  onRegionChange={(value) => setFormData(prev => ({...prev, region: value}))}
                  onCityChange={(value) => setFormData(prev => ({...prev, city: value}))}
                />
              </div>

              {/* Sector & Activity Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  {t('القطاع والنشاط', 'Sector & Activity')}
                </h3>
                <SectorActivityForm
                  sectorValue={formData.sector}
                  activityValue={formData.activity}
                  onSectorChange={(value) => setFormData(prev => ({...prev, sector: value}))}
                  onActivityChange={(value) => setFormData(prev => ({...prev, activity: value}))}
                />
              </div>

              {/* Company Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  {t('الشركة', 'Company')}
                </h3>
                <CompanySelect
                  value={formData.company}
                  onValueChange={(value) => setFormData(prev => ({...prev, company: value}))}
                  showDetails={true}
                />
              </div>

              {/* Position Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="position">
                    {t('المسمى الوظيفي', 'Position Title')}
                  </Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) => setFormData(prev => ({...prev, position: e.target.value}))}
                    placeholder={t('أدخل المسمى الوظيفي', 'Enter position title')}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  {t('وصف الوظيفة', 'Job Description')}
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                  placeholder={t('أدخل وصف الوظيفة', 'Enter job description')}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">
                  {t('المتطلبات', 'Requirements')}
                </Label>
                <Textarea
                  id="requirements"
                  value={formData.requirements}
                  onChange={(e) => setFormData(prev => ({...prev, requirements: e.target.value}))}
                  placeholder={t('أدخل متطلبات الوظيفة', 'Enter job requirements')}
                  rows={4}
                />
              </div>

              <div className="flex gap-4">
                <Button className="flex-1">
                  {t('إنشاء الوظيفة', 'Create Position')}
                </Button>
                <Button variant="outline" onClick={() => setFormData({
                  region: '', city: '', sector: '', activity: '', company: '', position: '', description: '', requirements: ''
                })}>
                  {t('إعادة تعيين', 'Reset')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: 'job-offers',
      label: t('عروض العمل', 'Job Offers'),
      icon: FileText,
      content: <JobOfferManagement />
    }
  ];

  return (
    <>
      <EnhancedPageLayout
        title={t('التوظيف والإعداد المحسن', 'Enhanced Recruitment & Onboarding')}
        description={t('إدارة شاملة لعمليات التوظيف والإعداد مع التكامل مع المراجع السعودية والمنصات الدولية', 'Comprehensive recruitment and onboarding management with Saudi reference integration and international platforms')}
        stats={stats}
        quickActions={[]}
        showQuickActions={false}
      >
        <div className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10">
              {tabs.map((tab) => (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id}
                  className="flex items-center gap-2 text-xs lg:text-sm"
                >
                  <tab.icon className="h-4 w-4" />
                  <span className="hidden lg:inline">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            
            {tabs.map((tab) => (
              <TabsContent key={tab.id} value={tab.id} className="mt-6">
                {tab.content}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </EnhancedPageLayout>
      
      <AqlHRAIAssistant />
    </>
  );
};

export default RecruitmentOnboarding;

