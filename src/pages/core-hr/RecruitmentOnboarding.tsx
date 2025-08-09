import { useState } from "react";
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
  FileText
} from "lucide-react";
import { JobOfferManagement } from "@/components/job-offer/JobOfferManagement";
import ModuleDocumentUploader from '@/components/universal/ModuleDocumentUploader';
import { AqlHRAIAssistant } from '@/components/ai';

const RecruitmentOnboarding = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  
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

  const stats = [
    {
      title: language === 'ar' ? 'المرشحون النشطون' : 'Active Candidates',
      value: 1247,
      icon: Users,
      variant: "primary" as const,
      trend: { value: "+12%", isPositive: true }
    },
    {
      title: language === 'ar' ? 'الوظائف المفتوحة' : 'Open Positions',
      value: 89,
      icon: Briefcase,
      variant: "accent" as const,
      trend: { value: "+5", isPositive: true }
    },
    {
      title: language === 'ar' ? 'عمليات التوظيف هذا الشهر' : 'Hires This Month',
      value: 34,
      icon: UserPlus,
      variant: "success" as const,
      trend: { value: "+8", isPositive: true }
    },
    {
      title: language === 'ar' ? 'متوسط وقت التوظيف' : 'Average Time to Hire',
      value: '18 ' + (language === 'ar' ? 'يوم' : 'days'),
      icon: Clock,
      variant: "warning" as const,
      trend: { value: "-3 days", isPositive: true }
    }
  ];

  const quickActions = [
    {
      title: language === 'ar' ? 'إضافة وظيفة جديدة' : 'Add New Position',
      description: language === 'ar' ? 'إنشاء وظيفة جديدة مع التكامل مع قوى' : 'Create new position with Qiwa integration',
      icon: UserPlus,
      color: "bg-blue-500",
      onClick: () => console.log('Add position')
    },
    {
      title: language === 'ar' ? 'مراجعة السير الذاتية' : 'Review CVs',
      description: language === 'ar' ? 'مراجعة السير الذاتية المقدمة' : 'Review submitted CVs',
      icon: FileCheck,
      color: "bg-green-500",
      onClick: () => console.log('Review CVs')
    },
    {
      title: language === 'ar' ? 'إعداد موظف جديد' : 'Onboard Employee',
      description: language === 'ar' ? 'بدء عملية إعداد موظف جديد' : 'Start new employee onboarding',
      icon: Users,
      color: "bg-purple-500",
      onClick: () => console.log('Onboard employee')
    },
    {
      title: language === 'ar' ? 'إنشاء عرض عمل' : 'Create Job Offer',
      description: language === 'ar' ? 'إنشاء عرض عمل شامل مع سير الموافقات' : 'Create comprehensive job offer with approval workflow',
      icon: FileText,
      color: "bg-emerald-500",
      onClick: () => console.log('Create job offer')
    },
    {
      title: language === 'ar' ? 'تقارير التوظيف' : 'Recruitment Reports',
      description: language === 'ar' ? 'عرض تقارير التوظيف والتحليلات' : 'View recruitment reports and analytics',
      icon: Target,
      color: "bg-orange-500",
      onClick: () => console.log('View reports')
    }
  ];

  const documents = [
    {
      name: language === 'ar' ? 'دليل_عمليات_التوظيف.pdf' : 'recruitment_process_guide.pdf',
      type: language === 'ar' ? 'دليل العمليات' : 'Process Guide',
      date: '2024-12-28',
      size: '2.4 MB'
    },
    {
      name: language === 'ar' ? 'نماذج_التوظيف.docx' : 'recruitment_forms.docx',
      type: language === 'ar' ? 'النماذج' : 'Forms',
      date: '2024-12-25',
      size: '856 KB'
    },
    {
      name: language === 'ar' ? 'تقرير_حالة_التوظيف.xlsx' : 'recruitment_status_report.xlsx',
      type: language === 'ar' ? 'تقرير الحالة' : 'Status Report',
      date: '2024-12-30',
      size: '1.8 MB'
    }
  ];

  const tabs = [
    {
      id: 'dashboard',
      label: language === 'ar' ? 'لوحة التحكم' : 'Dashboard',
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-success" />
                    {language === 'ar' ? 'التوظيف النشط' : 'Active Recruitment'}
                  </div>
                  <Badge variant="outline" className="bg-success/10 text-success">
                    {language === 'ar' ? 'جاري' : 'Ongoing'}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  {language === 'ar' ? 'عمليات التوظيف الجارية' : 'Ongoing recruitment processes'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span className="text-sm text-muted-foreground">
                    {language === 'ar' ? '89 وظيفة مفتوحة' : '89 open positions'}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    {language === 'ar' ? 'بنك المواهب' : 'Talent Pool'}
                  </div>
                  <Badge variant="outline" className="bg-primary/10 text-primary">
                    {language === 'ar' ? 'نشط' : 'Active'}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  {language === 'ar' ? 'قاعدة بيانات المرشحين' : 'Candidate database'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm text-muted-foreground">
                    {language === 'ar' ? '1,247 مرشح' : '1,247 candidates'}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCheck className="h-5 w-5 text-accent" />
                    {language === 'ar' ? 'الإعداد والتهيئة' : 'Onboarding'}
                  </div>
                  <Badge variant="outline" className="bg-accent/10 text-accent">
                    {language === 'ar' ? 'متقدم' : 'Advanced'}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  {language === 'ar' ? 'عملية إعداد الموظفين الجدد' : 'New employee onboarding process'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span className="text-sm text-muted-foreground">
                    {language === 'ar' ? '12 موظف في الإعداد' : '12 employees onboarding'}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-warning" />
                    {language === 'ar' ? 'أهداف التوطين' : 'Saudization Goals'}
                  </div>
                  <Badge variant="outline" className="bg-warning/10 text-warning">
                    {language === 'ar' ? 'في المسار' : 'On Track'}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  {language === 'ar' ? 'تحقيق أهداف التوطين' : 'Meeting Saudization targets'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-warning rounded-full"></div>
                  <span className="text-sm text-muted-foreground">
                    {language === 'ar' ? '67% نسبة التوطين' : '67% Saudization rate'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 'documents',
      label: language === 'ar' ? 'المستندات' : 'Documents',
      content: (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                {language === 'ar' ? 'رفع المستندات' : 'Upload Documents'}
              </CardTitle>
              <CardDescription>
                {language === 'ar' ? 
                  'ارفع ملفات التوظيف والإعداد للمعالجة بالذكاء الاصطناعي' : 
                  'Upload recruitment and onboarding files for AI processing'
                }
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
      label: language === 'ar' ? 'إضافة وظيفة' : 'Add Position',
      content: (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                {language === 'ar' ? 'إنشاء وظيفة جديدة' : 'Create New Position'}
              </CardTitle>
              <CardDescription>
                {language === 'ar' ? 
                  'استخدم قاعدة البيانات المرجعية السعودية لتحديد الموقع والقطاع' : 
                  'Use Saudi reference database to specify location and sector'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Location Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  {language === 'ar' ? 'الموقع' : 'Location'}
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
                  {language === 'ar' ? 'القطاع والنشاط' : 'Sector & Activity'}
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
                  {language === 'ar' ? 'الشركة' : 'Company'}
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
                    {language === 'ar' ? 'المسمى الوظيفي' : 'Position Title'}
                  </Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) => setFormData(prev => ({...prev, position: e.target.value}))}
                    placeholder={language === 'ar' ? 'أدخل المسمى الوظيفي' : 'Enter position title'}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  {language === 'ar' ? 'وصف الوظيفة' : 'Job Description'}
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                  placeholder={language === 'ar' ? 'أدخل وصف الوظيفة' : 'Enter job description'}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">
                  {language === 'ar' ? 'المتطلبات' : 'Requirements'}
                </Label>
                <Textarea
                  id="requirements"
                  value={formData.requirements}
                  onChange={(e) => setFormData(prev => ({...prev, requirements: e.target.value}))}
                  placeholder={language === 'ar' ? 'أدخل متطلبات الوظيفة' : 'Enter job requirements'}
                  rows={4}
                />
              </div>

              <div className="flex gap-4">
                <Button className="flex-1">
                  {language === 'ar' ? 'إنشاء الوظيفة' : 'Create Position'}
                </Button>
                <Button variant="outline" onClick={() => setFormData({
                  region: '', city: '', sector: '', activity: '', company: '', position: '', description: '', requirements: ''
                })}>
                  {language === 'ar' ? 'إعادة تعيين' : 'Reset'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: 'job-offers',
      label: language === 'ar' ? 'عروض العمل' : 'Job Offers',
      content: <JobOfferManagement />
    }
  ];

  return (
    <>
      <EnhancedPageLayout
        title={language === 'ar' ? 'التوظيف والإعداد' : 'Recruitment & Onboarding'}
        description={language === 'ar' ? 
          'إدارة شاملة لعمليات التوظيف والإعداد مع التكامل مع المراجع السعودية' : 
          'Comprehensive recruitment and onboarding management with Saudi reference integration'
        }
        showUserInfo={true}
        showQuickActions={true}
        showTabs={true}
        stats={stats}
        quickActions={quickActions}
        documents={documents}
        tabs={tabs}
      />
      
      <ModuleDocumentUploader moduleKey="core-hr.recruitmentOnboarding" />
      <AqlHRAIAssistant moduleContext="core-hr.recruitmentOnboarding" />
    </>
  );
};

export default RecruitmentOnboarding;