import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UniversalDocumentManager } from "@/components/common/UniversalDocumentManager";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLanguage } from "@/hooks/useLanguageCompat";
import { usePerformantLocalization } from "@/hooks/usePerformantLocalization";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  User, 
  FileText, 
  Download, 
  Upload, 
  Calendar, 
  Clock, 
  DollarSign,
  Settings,
  Bell,
  Shield,
  CheckCircle,
  AlertCircle,
  FileCheck,
  Briefcase
} from "lucide-react";

const SelfService = () => {
  const { t, language, isRTL } = useLanguage();
  const { formatters, directionClasses } = usePerformantLocalization();
  const isMobile = useIsMobile();

  // Mock employee data - in real app, fetch from Supabase
  const employee = {
    id: "emp-001",
    name: language === 'ar' ? "أحمد محمد العلي" : "Ahmed Mohammed Al Ali",
    position: language === 'ar' ? "مطور البرمجيات" : "Software Developer",
    department: language === 'ar' ? "تكنولوجيا المعلومات" : "Information Technology",
    employeeNumber: "EMP-2024-001",
    joinDate: "2023-01-15",
    salary: 12000,
    avatar: null
  };

  const quickStats = [
    {
      title: language === 'ar' ? "الراتب الشهري" : "Monthly Salary",
      value: formatters.salary(employee.salary),
      icon: DollarSign,
      variant: "default" as const
    },
    {
      title: language === 'ar' ? "الإجازات المتبقية" : "Leave Balance",
      value: "21",
      icon: Calendar,
      variant: "success" as const
    },
    {
      title: language === 'ar' ? "ساعات العمل هذا الشهر" : "Hours This Month",
      value: "168",
      icon: Clock,
      variant: "accent" as const
    },
    {
      title: language === 'ar' ? "الطلبات المعلقة" : "Pending Requests",
      value: "3",
      icon: AlertCircle,
      variant: "warning" as const
    }
  ];

  const recentDocuments = [
    {
      name: language === 'ar' ? "كشف_راتب_ديسمبر_2024.pdf" : "payslip_december_2024.pdf",
      type: language === 'ar' ? "كشف راتب" : "Payslip",
      date: "2024-12-30",
      size: "245 KB"
    },
    {
      name: language === 'ar' ? "شهادة_راتب_2024.pdf" : "salary_certificate_2024.pdf",
      type: language === 'ar' ? "شهادة راتب" : "Salary Certificate",
      date: "2024-12-15",
      size: "180 KB"
    },
    {
      name: language === 'ar' ? "طلب_إجازة_سنوية.pdf" : "annual_leave_request.pdf",
      type: language === 'ar' ? "طلب إجازة" : "Leave Request",
      date: "2024-12-10",
      size: "120 KB"
    }
  ];

  const quickActions = [
    {
      title: language === 'ar' ? "طلب إجازة" : "Request Leave",
      description: language === 'ar' ? "تقديم طلب إجازة جديد" : "Submit a new leave request",
      icon: Calendar,
      color: "bg-blue-500"
    },
    {
      title: language === 'ar' ? "تحديث البيانات" : "Update Profile",
      description: language === 'ar' ? "تحديث البيانات الشخصية" : "Update personal information",
      icon: User,
      color: "bg-green-500"
    },
    {
      title: language === 'ar' ? "رفع مستند" : "Upload Document",
      description: language === 'ar' ? "رفع مستندات جديدة" : "Upload new documents",
      icon: Upload,
      color: "bg-purple-500"
    },
    {
      title: language === 'ar' ? "تقرير الحضور" : "Attendance Report",
      description: language === 'ar' ? "عرض تقرير الحضور" : "View attendance report",
      icon: FileCheck,
      color: "bg-orange-500"
    }
  ];

  return (
    <div className={`container mx-auto p-4 space-y-6 ${directionClasses.container}`}>
      {/* Header with Employee Info */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className={`flex items-center gap-4 ${directionClasses.flex}`}>
          <Avatar className="h-16 w-16">
            <AvatarImage src={employee.avatar || ''} alt={employee.name} />
            <AvatarFallback className="text-lg font-bold">
              {employee.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className={directionClasses.text}>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
              {language === 'ar' ? `مرحباً، ${employee.name}` : `Welcome, ${employee.name}`}
            </h1>
            <p className="text-muted-foreground">
              {employee.position} • {employee.department}
            </p>
            <Badge variant="outline" className="mt-1">
              {employee.employeeNumber}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4" />
            {!isMobile && <span className="ml-2">{language === 'ar' ? 'الإعدادات' : 'Settings'}</span>}
          </Button>
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4" />
            {!isMobile && <span className="ml-2">{language === 'ar' ? 'الإشعارات' : 'Notifications'}</span>}
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className={`flex items-center gap-3 ${directionClasses.flex}`}>
                <div className={`p-2 rounded-lg bg-${stat.variant === 'default' ? 'primary' : stat.variant}/10`}>
                  <stat.icon className={`h-5 w-5 text-${stat.variant === 'default' ? 'primary' : stat.variant}`} />
                </div>
                <div className={directionClasses.text}>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-xl font-bold">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className={`grid w-full ${isMobile ? 'grid-cols-2' : 'grid-cols-4'}`}>
          <TabsTrigger value="dashboard">
            {language === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
          </TabsTrigger>
          <TabsTrigger value="documents">
            {language === 'ar' ? 'المستندات' : 'Documents'}
          </TabsTrigger>
          {!isMobile && (
            <>
              <TabsTrigger value="requests">
                {language === 'ar' ? 'الطلبات' : 'Requests'}
              </TabsTrigger>
              <TabsTrigger value="profile">
                {language === 'ar' ? 'الملف الشخصي' : 'Profile'}
              </TabsTrigger>
            </>
          )}
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className={directionClasses.text}>
                {language === 'ar' ? 'الإجراءات السريعة' : 'Quick Actions'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className={`h-auto p-4 flex flex-col items-center gap-2 hover:bg-muted/50 ${directionClasses.text}`}
                  >
                    <div className={`p-2 rounded-lg ${action.color} text-white`}>
                      <action.icon className="h-6 w-6" />
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-sm">{action.title}</p>
                      <p className="text-xs text-muted-foreground">{action.description}</p>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className={directionClasses.text}>
                  {language === 'ar' ? 'الأنشطة الأخيرة' : 'Recent Activity'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className={`flex items-center gap-3 ${directionClasses.flex}`}>
                  <CheckCircle className="h-5 w-5 text-success" />
                  <div className={directionClasses.text}>
                    <p className="text-sm font-medium">
                      {language === 'ar' ? 'تم الموافقة على طلب الإجازة' : 'Leave request approved'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {language === 'ar' ? 'منذ يومين' : '2 days ago'}
                    </p>
                  </div>
                </div>
                <div className={`flex items-center gap-3 ${directionClasses.flex}`}>
                  <FileText className="h-5 w-5 text-primary" />
                  <div className={directionClasses.text}>
                    <p className="text-sm font-medium">
                      {language === 'ar' ? 'تم إنشاء كشف راتب جديد' : 'New payslip generated'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {language === 'ar' ? 'منذ 3 أيام' : '3 days ago'}
                    </p>
                  </div>
                </div>
                <div className={`flex items-center gap-3 ${directionClasses.flex}`}>
                  <Briefcase className="h-5 w-5 text-accent" />
                  <div className={directionClasses.text}>
                    <p className="text-sm font-medium">
                      {language === 'ar' ? 'تم تحديث بيانات الوظيفة' : 'Job details updated'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {language === 'ar' ? 'منذ أسبوع' : '1 week ago'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className={directionClasses.text}>
                  {language === 'ar' ? 'المهام المعلقة' : 'Pending Tasks'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className={`flex items-center gap-3 ${directionClasses.flex}`}>
                  <AlertCircle className="h-5 w-5 text-warning" />
                  <div className={directionClasses.text}>
                    <p className="text-sm font-medium">
                      {language === 'ar' ? 'تحديث شهادة السلامة' : 'Update safety certificate'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {language === 'ar' ? 'مطلوب خلال 5 أيام' : 'Due in 5 days'}
                    </p>
                  </div>
                </div>
                <div className={`flex items-center gap-3 ${directionClasses.flex}`}>
                  <FileText className="h-5 w-5 text-warning" />
                  <div className={directionClasses.text}>
                    <p className="text-sm font-medium">
                      {language === 'ar' ? 'إكمال تقييم الأداء' : 'Complete performance review'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {language === 'ar' ? 'مطلوب خلال أسبوع' : 'Due in 1 week'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <UniversalDocumentManager
            moduleName={language === 'ar' ? "الخدمة الذاتية للموظفين" : "Employee Self Service"}
            description={language === 'ar' ? "إدارة مستنداتك الشخصية والطلبات" : "Manage your personal documents and requests"}
            platform="self_service"
            moduleType="hr"
            acceptedTypes={['.pdf', '.doc', '.docx', '.jpg', '.png']}
            maxFileSize={10}
            maxFiles={20}
          />
        </TabsContent>

        <TabsContent value="requests" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className={directionClasses.text}>
                {language === 'ar' ? 'طلباتي' : 'My Requests'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-muted-foreground ${directionClasses.text}`}>
                {language === 'ar' ? 'سيتم تطوير هذا القسم قريباً' : 'This section will be developed soon'}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className={directionClasses.text}>
                {language === 'ar' ? 'الملف الشخصي' : 'Profile Settings'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-muted-foreground ${directionClasses.text}`}>
                {language === 'ar' ? 'سيتم تطوير هذا القسم قريباً' : 'This section will be developed soon'}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SelfService;