import { EnhancedPageLayout } from "@/components/enhanced/EnhancedPageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguageCompat";
import { UniversalDocumentManager } from "@/components/common/UniversalDocumentManager";
import AutomationWorkflowEngine from "@/components/ai/AutomationWorkflowEngine";
import { AqlHRAIAssistant } from '@/components/ai';
import { AITestDemo } from '@/components/AITestDemo';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatArabicNumber } from '@/lib/utils';
import { 
  Users, 
  FileText, 
  Clock, 
  Star,
  Building,
  UserCheck,
  Database,
  Settings,
  Calendar,
  TrendingUp,
  Shield,
  Award
} from "lucide-react";

const CoreHR = () => {
  const { t, language } = useLanguage();
  const isArabic = language === 'ar';

  const stats = [
    {
      title: language === 'ar' ? 'الموظفون السعوديون' : 'Saudi Employees',
      value: language === 'ar' ? formatArabicNumber(1913, 'ar') : 1913,
      icon: Users,
      variant: "primary" as const,
      trend: { value: language === 'ar' ? `${formatArabicNumber(45, 'ar')} هذا الربع` : "45 this quarter", isPositive: true }
    },
    {
      title: language === 'ar' ? 'حالة نطاقات' : 'Nitaqat Status',
      value: language === 'ar' ? 'أخضر' : 'Green',
      icon: Shield,
      variant: "success" as const,
      trend: { value: language === 'ar' ? 'مستقر' : "maintained", isPositive: true }
    },
    {
      title: language === 'ar' ? 'عقود قيوى نشطة' : 'Active Qiwa Contracts',
      value: language === 'ar' ? formatArabicNumber(2801, 'ar') : 2801,
      icon: Clock,
      variant: "accent" as const,
      trend: { value: language === 'ar' ? `${formatArabicNumber(23, 'ar')} معلق` : "23 pending", isPositive: true }
    },
    {
      title: language === 'ar' ? 'امتثال قانون العمل' : 'Labor Law Compliance',
      value: '96.8%',
      icon: FileText,
      variant: "warning" as const,
      trend: { value: "1.2%", isPositive: true }
    }
  ];

  const quickActions = [
    {
      title: language === 'ar' ? 'البيانات الأساسية للموظفين' : 'Employee Master Data',
      description: language === 'ar' ? 'إدارة شاملة لمعلومات الموظفين' : 'Comprehensive employee information management',
      icon: Database,
      color: "bg-blue-500",
      onClick: () => window.location.href = `/core-hr/master-data`
    },
    {
      title: language === 'ar' ? 'معالجة الرواتب' : 'Payroll Processing',
      description: language === 'ar' ? 'معالجة وإدارة الرواتب' : 'Process and manage payroll',
      icon: FileText,
      color: "bg-emerald-500",
      onClick: () => window.location.href = `/payroll`
    },
    {
      title: language === 'ar' ? 'إدارة المزايا' : 'Benefits Administration',
      description: language === 'ar' ? 'إدارة مزايا الموظفين' : 'Manage employee benefits',
      icon: Award,
      color: "bg-indigo-500",
      onClick: () => window.location.href = `/core-hr/benefits-administration`
    },
    {
      title: language === 'ar' ? 'إدارة الأداء' : 'Performance Management',
      description: language === 'ar' ? 'تقييمات ومراجعات الأداء' : 'Performance reviews and evaluations',
      icon: Star,
      color: "bg-purple-500",
      onClick: () => window.location.href = `/core-hr/performance-management`
    },
    {
      title: language === 'ar' ? 'التوظيف والإلحاق' : 'Recruitment & Hiring',
      description: language === 'ar' ? 'عمليات التوظيف والإلحاق' : 'Recruitment and onboarding processes',
      icon: UserCheck,
      color: "bg-cyan-500",
      onClick: () => window.location.href = `/core-hr/recruitment-onboarding`
    },
    {
      title: language === 'ar' ? 'التدريب والتطوير' : 'Training & Development',
      description: language === 'ar' ? 'برامج التدريب والتطوير' : 'Training and development programs',
      icon: Users,
      color: "bg-orange-500",
      onClick: () => window.location.href = `/core-hr/training-development`
    },
    {
      title: language === 'ar' ? 'الوقت والحضور' : 'Time & Attendance',
      description: language === 'ar' ? 'تتبع الحضور والإجازات' : 'Track attendance and leave',
      icon: Clock,
      color: "bg-green-500",
      onClick: () => window.location.href = `/core-hr/time-attendance`
    },
    {
      title: language === 'ar' ? 'إدارة الإجازات' : 'Leave Management',
      description: language === 'ar' ? 'إدارة طلبات الإجازات' : 'Manage leave requests',
      icon: Calendar,
      color: "bg-rose-500",
      onClick: () => window.location.href = `/core-hr/leave-management`
    },
    {
      title: language === 'ar' ? 'تخطيط التعاقب' : 'Succession Planning',
      description: language === 'ar' ? 'تخطيط التعاقب الوظيفي' : 'Career succession planning',
      icon: TrendingUp,
      color: "bg-violet-500",
      onClick: () => window.location.href = `/core-hr/succession-planning`
    },
    {
      title: language === 'ar' ? 'إدارة التعويضات' : 'Compensation Management',
      description: language === 'ar' ? 'إدارة التعويضات والأجور' : 'Manage compensation and wages',
      icon: Database,
      color: "bg-amber-500",
      onClick: () => window.location.href = `/core-hr/compensation-management`
    },
    {
      title: language === 'ar' ? 'الخدمة الذاتية للموظفين' : 'Employee Self Service',
      description: language === 'ar' ? 'خدمات ذاتية للموظفين' : 'Self-service portal for employees',
      icon: UserCheck,
      color: "bg-teal-500",
      onClick: () => window.location.href = `/self-service`
    },
    {
      title: language === 'ar' ? 'لوحة تحكم المدير' : 'Manager Dashboard',
      description: language === 'ar' ? 'لوحة تحكم إدارية للمدراء' : 'Management dashboard for managers',
      icon: Settings,
      color: "bg-slate-500",
      onClick: () => window.location.href = `/dashboards/manager`
    }
  ];

  const documents = [
    {
      name: language === 'ar' ? 'دليل_السياسات_الموارد_البشرية.pdf' : 'hr_policies_handbook.pdf',
      type: language === 'ar' ? 'دليل السياسات' : 'Policy Handbook',
      date: '2024-12-15',
      size: '4.2 MB'
    },
    {
      name: language === 'ar' ? 'قالب_تقييم_الأداء.docx' : 'performance_evaluation_template.docx',
      type: language === 'ar' ? 'قالب تقييم' : 'Evaluation Template',
      date: '2024-12-10',
      size: '890 KB'
    },
    {
      name: language === 'ar' ? 'تقرير_الحضور_الشهري.xlsx' : 'monthly_attendance_report.xlsx',
      type: language === 'ar' ? 'تقرير حضور' : 'Attendance Report',
      date: '2024-12-30',
      size: '2.1 MB'
    }
  ];

  const tabs = [
    {
      id: 'modules',
      label: language === 'ar' ? 'الوحدات' : 'Modules',
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.location.href = `/core-hr/master-data`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary" />
                  {isArabic ? 'البيانات الأساسية للموظفين' : 'Employee Master Data'}
                </CardTitle>
                <CardDescription>
                  {isArabic ? 'إدارة شاملة لملفات الموظفين وبياناتهم' : 'Comprehensive employee profile and data management'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  2,847 {isArabic ? 'موظف مُدار' : 'employees managed'}
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.location.href = `/payroll`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-success" />
                  {isArabic ? 'معالجة الرواتب' : 'Payroll Processing'}
                </CardTitle>
                <CardDescription>
                  {isArabic ? 'معالجة وإدارة الرواتب والمكافآت' : 'Process and manage payroll and bonuses'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {isArabic ? `${formatArabicNumber(2.4, 'ar')} مليون ريال معالج شهرياً` : '₹2.4M processed monthly'}
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.location.href = `/core-hr/benefits-administration`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-accent" />
                  {isArabic ? 'إدارة المزايا' : 'Benefits Administration'}
                </CardTitle>
                <CardDescription>
                  {isArabic ? 'إدارة مزايا وتأمينات الموظفين' : 'Manage employee benefits and insurance'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {isArabic ? `${formatArabicNumber(1847, 'ar')} مشترك نشط` : '1,847 active enrollees'}
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.location.href = `/core-hr/performance-management`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-warning" />
                  {isArabic ? 'إدارة الأداء' : 'Performance Management'}
                </CardTitle>
                <CardDescription>
                  {isArabic ? 'تقييمات ومراجعات الأداء الدورية' : 'Performance reviews and evaluations'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {isArabic ? `${formatArabicNumber(2456, 'ar')} مراجعة مكتملة` : '2,456 reviews completed'}
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.location.href = `/core-hr/recruitment-onboarding`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-secondary" />
                  {isArabic ? 'التوظيف والإلحاق' : 'Recruitment & Hiring'}
                </CardTitle>
                <CardDescription>
                  {isArabic ? 'عمليات التوظيف والإلحاق الجديد' : 'Recruitment and onboarding processes'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  156 {isArabic ? 'مرشح نشط' : 'active candidates'}
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.location.href = `/core-hr/training-development`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  {isArabic ? 'التدريب والتطوير' : 'Training & Development'}
                </CardTitle>
                <CardDescription>
                  {isArabic ? 'برامج التدريب وتطوير المهارات' : 'Training programs and skill development'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  89% {isArabic ? 'معدل الإكمال' : 'completion rate'}
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.location.href = `/core-hr/time-attendance`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-success" />
                  {isArabic ? 'الوقت والحضور' : 'Time & Attendance'}
                </CardTitle>
                <CardDescription>
                  {isArabic ? 'تتبع الحضور وساعات العمل' : 'Track attendance and work hours'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  98.2% {isArabic ? 'معدل الحضور' : 'attendance rate'}
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.location.href = `/core-hr/leave-management`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-accent" />
                  {isArabic ? 'إدارة الإجازات' : 'Leave Management'}
                </CardTitle>
                <CardDescription>
                  {isArabic ? 'إدارة طلبات وأرصدة الإجازات' : 'Manage leave requests and balances'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  234 {isArabic ? 'طلب معلق' : 'pending requests'}
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.location.href = `/core-hr/succession-planning`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-warning" />
                  {isArabic ? 'تخطيط التعاقب' : 'Succession Planning'}
                </CardTitle>
                <CardDescription>
                  {isArabic ? 'تخطيط التعاقب الوظيفي والمهني' : 'Career succession and planning'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  67% {isArabic ? 'تغطية المناصب' : 'position coverage'}
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.location.href = `/core-hr/compensation-management`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-secondary" />
                  {isArabic ? 'إدارة التعويضات' : 'Compensation Management'}
                </CardTitle>
                <CardDescription>
                  {isArabic ? 'إدارة التعويضات والهياكل الوظيفية' : 'Manage compensation and job structures'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  ₹18.2M {isArabic ? 'إجمالي التعويضات' : 'total compensation'}
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.location.href = `/self-service`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-primary" />
                  {isArabic ? 'الخدمة الذاتية للموظفين' : 'Employee Self Service'}
                </CardTitle>
                <CardDescription>
                  {isArabic ? 'بوابة ذاتية للموظفين لإدارة بياناتهم' : 'Self-service portal for employees'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  1,847 {isArabic ? 'مستخدم نشط' : 'active users'}
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.location.href = `/dashboards/manager`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-accent" />
                  {isArabic ? 'لوحة تحكم المدير' : 'Manager Dashboard'}
                </CardTitle>
                <CardDescription>
                  {isArabic ? 'لوحة تحكم إدارية للمدراء والمشرفين' : 'Management dashboard for managers and supervisors'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  43 {isArabic ? 'مدير نشط' : 'active managers'}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 'workflow',
      label: language === 'ar' ? 'سير العمل' : 'Workflow',
      content: (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'ar' ? 'سير العمل الآلي' : 'Automated Workflows'}</CardTitle>
              <CardDescription>
                {language === 'ar' ? 'أتمتة العمليات الأساسية للموارد البشرية' : 'Automate core HR processes'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 border rounded-lg text-center hover:bg-muted/50 cursor-pointer">
                  <UserCheck className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <p className="text-sm font-medium">
                    {language === 'ar' ? 'إدخال الموظفين' : 'Employee Onboarding'}
                  </p>
                </div>
                <div className="p-4 border rounded-lg text-center hover:bg-muted/50 cursor-pointer">
                  <Calendar className="h-8 w-8 mx-auto mb-2 text-success" />
                  <p className="text-sm font-medium">
                    {language === 'ar' ? 'طلبات الإجازة' : 'Leave Requests'}
                  </p>
                </div>
                <div className="p-4 border rounded-lg text-center hover:bg-muted/50 cursor-pointer">
                  <Star className="h-8 w-8 mx-auto mb-2 text-warning" />
                  <p className="text-sm font-medium">
                    {language === 'ar' ? 'تقييمات الأداء' : 'Performance Reviews'}
                  </p>
                </div>
                <div className="p-4 border rounded-lg text-center hover:bg-muted/50 cursor-pointer">
                  <Settings className="h-8 w-8 mx-auto mb-2 text-accent" />
                  <p className="text-sm font-medium">
                    {language === 'ar' ? 'تحديث البيانات' : 'Data Updates'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }
  ];

  return (
    <div className={`container mx-auto p-6 space-y-6 max-w-7xl ${isArabic ? 'rtl' : 'ltr'}`} dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="w-full max-w-7xl mx-auto space-y-6 p-4 sm:p-6">
      <AITestDemo />
      
      <EnhancedPageLayout
        title={language === 'ar' ? 'وحدات الموارد البشرية الأساسية' : 'Core HR Modules'}
        description={language === 'ar' ? 'الإدارة الشاملة لجميع عمليات الموارد البشرية' : 'Comprehensive management of all HR processes'}
        showUserInfo={true}
        showQuickActions={true}
        showTabs={true}
        stats={stats}
        quickActions={quickActions}
        documents={documents}
        tabs={tabs}
      />
      
      {/* AI-Enhanced Core HR Management */}
      <Tabs defaultValue="automation" className="w-full mt-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="automation">
            {language === 'ar' ? 'الأتمتة الذكية' : 'AI Automation'}
          </TabsTrigger>
          <TabsTrigger value="documents">
            {language === 'ar' ? 'إدارة الوثائق' : 'Document Management'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="automation">
          <AutomationWorkflowEngine />
        </TabsContent>

        <TabsContent value="documents">
          <UniversalDocumentManager
            moduleName="Core HR Operations"
            moduleNameAr="عمليات الموارد البشرية الأساسية"
            description="Upload HR policies, procedures, forms, and operational documents"
            descriptionAr="رفع سياسات الموارد البشرية والإجراءات والنماذج والمستندات التشغيلية"
            platform="core-hr"
            moduleType="hr"
            acceptedTypes={['.pdf', '.docx', '.xlsx', '.pptx', '.jpg', '.png']}
            maxFileSize={50 * 1024 * 1024}
            maxFiles={25}
          />
        </TabsContent>
      </Tabs>
      
      {/* AI Integration for Core HR */}
      <UniversalAIIntegrator 
        pageType="core-hr" 
        moduleName="core-hr-management" 
        companyId="demo-company" 
        enabledFeatures={['employee-management', 'hr-processes', 'organizational-structure', 'workflow-automation']}
      />
      </div>
    </div>
  );
};

export default CoreHR;