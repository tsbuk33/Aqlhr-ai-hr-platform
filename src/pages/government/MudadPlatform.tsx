import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Shield, 
  CreditCard, 
  CheckCircle, 
  FileText,
  Building,
  Users,
  TrendingUp,
  Clock,
  AlertTriangle,
  Monitor,
  Database,
  Activity
} from "lucide-react";

const MudadPlatform = () => {
  const { t, language } = useLanguage();
  
  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">
          {language === 'ar' ? 'منصة مُدد - برنامج حماية الأجور' : 'Mudad Platform - Wage Protection Program'}
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          {language === 'ar' 
            ? 'منصة رسمية لبرنامج حماية الأجور التابع لوزارة الموارد البشرية والتنمية الاجتماعية لحفظ حقوق المنشآت والموظفين'
            : 'Official platform for the Wage Protection Program by MHRSD to protect the rights of establishments and employees'
          }
        </p>
      </div>

      {/* Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Shield className="h-4 w-4" />
              {language === 'ar' ? 'الأجور المحمية' : 'Protected Wages'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">SAR 5.47M</div>
            <p className="text-xs text-muted-foreground mt-1">
              {language === 'ar' ? 'هذا الشهر' : 'This month'}
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-success">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <CheckCircle className="h-4 w-4" />
              {language === 'ar' ? 'معدل الامتثال' : 'Compliance Rate'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">100%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {language === 'ar' ? 'جميع المتطلبات' : 'All requirements'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-warning">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Clock className="h-4 w-4" />
              {language === 'ar' ? 'وقت المعالجة' : 'Processing Time'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-warning">45 min</div>
            <p className="text-xs text-muted-foreground mt-1">
              {language === 'ar' ? 'متوسط الوقت' : 'Average time'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-accent">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <TrendingUp className="h-4 w-4" />
              {language === 'ar' ? 'المعاملات الشهرية' : 'Monthly Transactions'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">2,847</div>
            <p className="text-xs text-muted-foreground mt-1">
              {language === 'ar' ? '+12% من الشهر الماضي' : '+12% from last month'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Wage Protection Program */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>
                  {language === 'ar' ? 'برنامج حماية الأجور (WPP)' : 'Wage Protection Program (WPP)'}
                </CardTitle>
                <CardDescription>
                  {language === 'ar' 
                    ? 'نظام شامل لمراقبة وحماية أجور الموظفين' 
                    : 'Comprehensive system for monitoring and protecting employee wages'
                  }
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="font-medium">
                  {language === 'ar' ? 'مراقبة الرواتب المباشرة' : 'Real-time Salary Monitoring'}
                </span>
                <Badge variant="outline" className="bg-success/10 text-success">
                  {language === 'ar' ? 'نشط' : 'Active'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="font-medium">
                  {language === 'ar' ? 'التبريرات والاعتراضات' : 'Justifications & Objections'}
                </span>
                <Badge variant="outline" className="bg-primary/10 text-primary">
                  {language === 'ar' ? 'متاح' : 'Available'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="font-medium">
                  {language === 'ar' ? 'تقارير الامتثال' : 'Compliance Reports'}
                </span>
                <Badge variant="outline" className="bg-accent/10 text-accent">
                  {language === 'ar' ? 'تلقائي' : 'Automated'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payroll Management System */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <CreditCard className="h-6 w-6 text-success" />
              </div>
              <div>
                <CardTitle>
                  {language === 'ar' ? 'نظام إدارة الرواتب (PMS)' : 'Payroll Management System (PMS)'}
                </CardTitle>
                <CardDescription>
                  {language === 'ar' 
                    ? 'إدارة شاملة للرواتب مع الربط المباشر بالتأمينات' 
                    : 'Comprehensive payroll management with direct GOSI integration'
                  }
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="font-medium">
                  {language === 'ar' ? 'الربط مع التأمينات الاجتماعية' : 'GOSI Integration'}
                </span>
                <Badge variant="outline" className="bg-success/10 text-success">
                  {language === 'ar' ? 'متصل' : 'Connected'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="font-medium">
                  {language === 'ar' ? 'معالجة الرواتب التلقائية' : 'Automated Payroll Processing'}
                </span>
                <Badge variant="outline" className="bg-primary/10 text-primary">
                  {language === 'ar' ? 'مجدول' : 'Scheduled'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="font-medium">
                  {language === 'ar' ? 'التقارير المالية' : 'Financial Reports'}
                </span>
                <Badge variant="outline" className="bg-accent/10 text-accent">
                  {language === 'ar' ? 'شهري' : 'Monthly'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SanadHR Integration */}
      <Card className="border-2 border-dashed border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-primary rounded-lg">
              <Database className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-primary">
                {language === 'ar' ? 'التكامل مع سند الموارد البشرية' : 'SanadHR Integration'}
              </CardTitle>
              <CardDescription>
                {language === 'ar' 
                  ? 'ربط مباشر مع منصة سند لإدارة الموارد البشرية' 
                  : 'Direct integration with SanadHR platform'
                }
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-primary" />
                <span className="font-medium text-primary">
                  {language === 'ar' ? 'بيانات الموظفين' : 'Employee Data'}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {language === 'ar' 
                  ? 'مزامنة تلقائية لبيانات الموظفين والرواتب' 
                  : 'Automatic sync of employee data and salaries'
                }
              </p>
            </div>
            
            <div className="p-4 bg-success/5 rounded-lg border border-success/10">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-4 w-4 text-success" />
                <span className="font-medium text-success">
                  {language === 'ar' ? 'المراقبة المباشرة' : 'Real-time Monitoring'}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {language === 'ar' 
                  ? 'مراقبة مباشرة لحالة الامتثال والمدفوعات' 
                  : 'Real-time monitoring of compliance and payments'
                }
              </p>
            </div>
            
            <div className="p-4 bg-warning/5 rounded-lg border border-warning/10">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-warning" />
                <span className="font-medium text-warning">
                  {language === 'ar' ? 'التقارير الآلية' : 'Automated Reports'}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {language === 'ar' 
                  ? 'توليد تقارير الامتثال والمدفوعات تلقائياً' 
                  : 'Automatic generation of compliance and payment reports'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              {language === 'ar' ? 'حالة النظام' : 'System Status'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>{language === 'ar' ? 'واجهة برمجة التطبيقات' : 'API Connection'}</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span className="text-sm text-success">{language === 'ar' ? 'متصل' : 'Connected'}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span>{language === 'ar' ? 'آخر مزامنة' : 'Last Sync'}</span>
                <span className="text-sm text-muted-foreground">
                  {language === 'ar' ? '5 دقائق مضت' : '5 minutes ago'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span>{language === 'ar' ? 'حالة الخدمة' : 'Service Status'}</span>
                <Badge className="bg-success text-white">
                  {language === 'ar' ? 'تعمل' : 'Operational'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              {language === 'ar' ? 'معلومات المنشأة' : 'Establishment Info'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>{language === 'ar' ? 'رقم السجل التجاري' : 'CR Number'}</span>
                <span className="text-sm font-mono">1010123456</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span>{language === 'ar' ? 'تصنيف المنشأة' : 'Establishment Category'}</span>
                <Badge variant="outline">
                  {language === 'ar' ? 'كبيرة' : 'Large'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span>{language === 'ar' ? 'عدد الموظفين' : 'Employee Count'}</span>
                <span className="text-sm font-medium">247</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MudadPlatform;