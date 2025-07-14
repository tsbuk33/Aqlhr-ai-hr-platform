import { EnhancedPageLayout } from "@/components/enhanced/EnhancedPageLayout";
import { SanadAIFileProcessor } from "@/components/sanad/SanadAIFileProcessor";
import { useLanguage } from "@/hooks/useLanguageCompat";
import { useToast } from "@/hooks/use-toast";
import { 
  Clock, 
  Smartphone, 
  CheckCircle, 
  AlertTriangle,
  Calendar,
  MapPin,
  Users,
  Timer,
  Activity,
  Shield,
  FileText,
  Settings,
  Upload
} from "lucide-react";

const TimeAttendance = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();

  const stats = [
    {
      title: language === 'ar' ? 'ساعات العمل السعودية' : 'Saudi Working Hours',
      value: '8h/day',
      icon: CheckCircle,
      variant: "success" as const,
      trend: { value: "Labor law compliant", isPositive: true }
    },
    {
      title: language === 'ar' ? 'تكامل أبشر' : 'Absher Integration',
      value: language === 'ar' ? 'نشط ومتزامن' : 'Active & Synced',
      icon: Shield,
      variant: "primary" as const
    },
    {
      title: language === 'ar' ? 'الإجازات الرسمية السعودية' : 'Saudi National Holidays',
      value: language === 'ar' ? '13 إجازة' : '13 Holidays',
      icon: Smartphone,
      variant: "accent" as const,
      trend: { value: "Auto-applied", isPositive: true }
    },
    {
      title: language === 'ar' ? 'امتثال قانون العمل' : 'Labor Law Compliance',
      value: '100%',
      icon: Timer,
      variant: "warning" as const,
      trend: { value: "Overtime rules applied", isPositive: true }
    }
  ];

  const quickActions = [
    {
      title: language === 'ar' ? 'تطبيق الحضور المحمول' : 'Mobile Attendance App',
      description: language === 'ar' ? 'تسجيل الحضور عبر الهاتف المحمول' : 'Mobile check-in and check-out',
      icon: Smartphone,
      color: "bg-blue-500",
      onClick: () => console.log('Navigate to mobile app')
    },
    {
      title: language === 'ar' ? 'إدارة الإجازات' : 'Leave Management',
      description: language === 'ar' ? 'طلبات الإجازات والموافقات' : 'Leave requests and approvals',
      icon: Calendar,
      color: "bg-green-500",
      onClick: () => console.log('Navigate to leave management')
    },
    {
      title: language === 'ar' ? 'مواقع الحضور' : 'Attendance Locations',
      description: language === 'ar' ? 'إدارة مواقع تسجيل الحضور' : 'Manage attendance check-in locations',
      icon: MapPin,
      color: "bg-purple-500",
      onClick: () => console.log('Navigate to locations')
    },
    {
      title: language === 'ar' ? 'تقارير الحضور' : 'Attendance Reports',
      description: language === 'ar' ? 'تقارير شاملة للحضور والغياب' : 'Comprehensive attendance and absence reports',
      icon: FileText,
      color: "bg-orange-500",
      onClick: () => console.log('Navigate to reports')
    }
  ];

  const documents = [
    {
      name: language === 'ar' ? 'تقرير_الحضور_ديسمبر_2024.xlsx' : 'attendance_report_december_2024.xlsx',
      type: language === 'ar' ? 'تقرير الحضور' : 'Attendance Report',
      date: '2024-12-30',
      size: '2.1 MB'
    },
    {
      name: language === 'ar' ? 'سياسة_الحضور_والغياب.pdf' : 'attendance_policy.pdf',
      type: language === 'ar' ? 'سياسة الحضور' : 'Attendance Policy',
      date: '2024-12-15',
      size: '890 KB'
    },
    {
      name: language === 'ar' ? 'دليل_استخدام_التطبيق_المحمول.pdf' : 'mobile_app_user_guide.pdf',
      type: language === 'ar' ? 'دليل المستخدم' : 'User Guide',
      date: '2024-12-10',
      size: '1.5 MB'
    }
  ];

  const tabs = [
    {
      id: 'today',
      label: language === 'ar' ? 'اليوم' : 'Today',
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-success/10 rounded-lg border">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="h-8 w-8 text-success" />
                <div>
                  <h3 className="font-semibold text-success">
                    {language === 'ar' ? 'الحاضرون اليوم' : 'Present Today'}
                  </h3>
                  <p className="text-2xl font-bold">2,794</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {language === 'ar' ? 'من إجمالي 2,847 موظف' : 'Out of 2,847 total employees'}
              </p>
            </div>

            <div className="p-6 bg-warning/10 rounded-lg border">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="h-8 w-8 text-warning" />
                <div>
                  <h3 className="font-semibold text-warning">
                    {language === 'ar' ? 'المتأخرون' : 'Late Arrivals'}
                  </h3>
                  <p className="text-2xl font-bold">23</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {language === 'ar' ? 'متأخر أكثر من 15 دقيقة' : 'More than 15 minutes late'}
              </p>
            </div>

            <div className="p-6 bg-destructive/10 rounded-lg border">
              <div className="flex items-center gap-3 mb-4">
                <Users className="h-8 w-8 text-destructive" />
                <div>
                  <h3 className="font-semibold text-destructive">
                    {language === 'ar' ? 'الغائبون' : 'Absent'}
                  </h3>
                  <p className="text-2xl font-bold">30</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {language === 'ar' ? 'غياب غير مبرر أو مرضي' : 'Unexcused or sick leave'}
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'mobile',
      label: language === 'ar' ? 'التطبيق المحمول' : 'Mobile App',
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg border">
              <div className="flex items-center gap-3 mb-4">
                <Smartphone className="h-8 w-8 text-blue-600" />
                <div>
                  <h3 className="font-semibold">
                    {language === 'ar' ? 'تسجيل الدخول عبر الهاتف' : 'Mobile Check-in'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'تسجيل الحضور بسهولة' : 'Easy attendance tracking'}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-success">2,456</p>
                  <p className="text-xs text-muted-foreground">
                    {language === 'ar' ? 'تسجيلات اليوم' : "Today's check-ins"}
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">89%</p>
                  <p className="text-xs text-muted-foreground">
                    {language === 'ar' ? 'معدل الاستخدام' : 'Usage rate'}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg border">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="h-8 w-8 text-green-600" />
                <div>
                  <h3 className="font-semibold">
                    {language === 'ar' ? 'مواقع الحضور' : 'Attendance Locations'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'مواقع معتمدة للتسجيل' : 'Authorized check-in locations'}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-primary">12</p>
                  <p className="text-xs text-muted-foreground">
                    {language === 'ar' ? 'مواقع نشطة' : 'Active locations'}
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-success">100%</p>
                  <p className="text-xs text-muted-foreground">
                    {language === 'ar' ? 'معدل الدقة' : 'Accuracy rate'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <EnhancedPageLayout
      title={language === 'ar' ? 'الوقت والحضور' : 'Time & Attendance'}
      description={language === 'ar' ? 'تتبع الحضور والغياب وإدارة الإجازات' : 'Track attendance, absence, and manage leave'}
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

export default TimeAttendance;