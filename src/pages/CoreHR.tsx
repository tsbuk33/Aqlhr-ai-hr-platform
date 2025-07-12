import { EnhancedPageLayout } from "@/components/enhanced/EnhancedPageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguageCompat";
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

  const stats = [
    {
      title: language === 'ar' ? 'الموظفون السعوديون' : 'Saudi Employees',
      value: 1913,
      icon: Users,
      variant: "primary" as const,
      trend: { value: "45 this quarter", isPositive: true }
    },
    {
      title: language === 'ar' ? 'حالة نطاقات' : 'Nitaqat Status',
      value: language === 'ar' ? 'أخضر' : 'Green',
      icon: Shield,
      variant: "success" as const,
      trend: { value: "maintained", isPositive: true }
    },
    {
      title: language === 'ar' ? 'عقود قيوى نشطة' : 'Active Qiwa Contracts',
      value: 2801,
      icon: Clock,
      variant: "accent" as const,
      trend: { value: "23 pending", isPositive: true }
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
      onClick: () => console.log('Navigate to employee master data')
    },
    {
      title: language === 'ar' ? 'الوقت والحضور' : 'Time & Attendance',
      description: language === 'ar' ? 'تتبع الحضور والإجازات' : 'Track attendance and leave',
      icon: Clock,
      color: "bg-green-500",
      onClick: () => console.log('Navigate to time attendance')
    },
    {
      title: language === 'ar' ? 'إدارة الأداء' : 'Performance Management',
      description: language === 'ar' ? 'تقييمات ومراجعات الأداء' : 'Performance reviews and evaluations',
      icon: Star,
      color: "bg-purple-500",
      onClick: () => console.log('Navigate to performance')
    },
    {
      title: language === 'ar' ? 'الخدمة الذاتية للموظفين' : 'Employee Self Service',
      description: language === 'ar' ? 'خدمات ذاتية للموظفين' : 'Self-service portal for employees',
      icon: UserCheck,
      color: "bg-orange-500",
      onClick: () => console.log('Navigate to self service')
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary" />
                  {t('core_hr.employee_master_data')}
                </CardTitle>
                <CardDescription>{t('core_hr.employee_master_data_desc')}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">2,847 {t('core_hr.employees_managed')}</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-success" />
                  {t('core_hr.organizational_structure')}
                </CardTitle>
                <CardDescription>{t('core_hr.organizational_structure_desc')}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">67% {t('core_hr.saudization_rate')}</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-accent" />
                  {t('core_hr.employee_self_service')}
                </CardTitle>
                <CardDescription>{t('core_hr.employee_self_service_desc')}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">1,847 {t('core_hr.active_users')}</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-warning" />
                  {t('core_hr.document_management')}
                </CardTitle>
                <CardDescription>{t('core_hr.document_management_desc')}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">15,678 {t('core_hr.documents_processed')}</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-secondary" />
                  {t('core_hr.time_attendance')}
                </CardTitle>
                <CardDescription>{t('core_hr.time_attendance_desc')}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">98.2% {t('core_hr.attendance_rate')}</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary" />
                  {t('core_hr.performance_management')}
                </CardTitle>
                <CardDescription>{t('core_hr.performance_management_desc')}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">2,456 {t('core_hr.reviews_completed')}</p>
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
  );
};

export default CoreHR;