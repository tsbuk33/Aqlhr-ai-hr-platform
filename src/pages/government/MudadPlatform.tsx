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

      {/* SanadHR Payroll Integration */}
      <Card className="border-2 border-dashed border-primary/20 bg-gradient-to-r from-primary/5 to-success/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-primary rounded-lg">
              <Database className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-primary">
                {language === 'ar' ? 'الربط المباشر مع نظام الرواتب - سند الموارد البشرية' : 'Direct Payroll Integration - SanadHR'}
              </CardTitle>
              <CardDescription>
                {language === 'ar' 
                  ? 'تزامن تلقائي ثنائي الاتجاه مع نظام الرواتب لضمان الامتثال الكامل لبرنامج حماية الأجور' 
                  : 'Bi-directional automatic sync with payroll system ensuring full WPP compliance'
                }
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Payroll Data Flow */}
            <div className="space-y-4">
              <h4 className="font-semibold text-primary flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                {language === 'ar' ? 'تدفق بيانات الرواتب' : 'Payroll Data Flow'}
              </h4>
              
              <div className="space-y-3">
                <div className="p-3 bg-primary/5 rounded-lg border-l-4 border-l-primary">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {language === 'ar' ? 'الرواتب الأساسية والبدلات' : 'Basic Salaries & Allowances'}
                    </span>
                    <div className="flex items-center gap-2">
                      <Activity className="h-3 w-3 text-success animate-pulse" />
                      <span className="text-xs text-success">{language === 'ar' ? 'مزامن' : 'Synced'}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {language === 'ar' 
                      ? 'تحديث مباشر من نظام الرواتب كل 5 دقائق' 
                      : 'Real-time updates from payroll system every 5 minutes'
                    }
                  </p>
                </div>

                <div className="p-3 bg-success/5 rounded-lg border-l-4 border-l-success">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {language === 'ar' ? 'الاستقطاعات والضرائب' : 'Deductions & Taxes'}
                    </span>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-success" />
                      <span className="text-xs text-success">{language === 'ar' ? 'محدث' : 'Updated'}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {language === 'ar' 
                      ? 'تطبيق تلقائي لقواعد الاستقطاع والضرائب' 
                      : 'Automatic application of deduction and tax rules'
                    }
                  </p>
                </div>

                <div className="p-3 bg-warning/5 rounded-lg border-l-4 border-l-warning">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {language === 'ar' ? 'تقارير الامتثال الشهرية' : 'Monthly Compliance Reports'}
                    </span>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-warning" />
                      <span className="text-xs text-warning">{language === 'ar' ? 'مجدول' : 'Scheduled'}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {language === 'ar' 
                      ? 'توليد وإرسال تقارير الامتثال تلقائياً في نهاية كل شهر' 
                      : 'Auto-generation and submission of compliance reports monthly'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Integration Status */}
            <div className="space-y-4">
              <h4 className="font-semibold text-success flex items-center gap-2">
                <Monitor className="h-4 w-4" />
                {language === 'ar' ? 'حالة التكامل المباشر' : 'Live Integration Status'}
              </h4>
              
              <div className="p-4 bg-success/10 rounded-lg border border-success/20">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-success">
                    {language === 'ar' ? 'اتصال نظام الرواتب' : 'Payroll System Connection'}
                  </span>
                  <Badge className="bg-success text-white">
                    <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
                    {language === 'ar' ? 'متصل' : 'Connected'}
                  </Badge>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>{language === 'ar' ? 'آخر مزامنة:' : 'Last Sync:'}</span>
                    <span className="font-mono">
                      {language === 'ar' ? 'منذ 2 دقيقة' : '2 min ago'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>{language === 'ar' ? 'معاملات اليوم:' : 'Today\'s Transactions:'}</span>
                    <span className="font-mono text-primary">247</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>{language === 'ar' ? 'نسبة نجاح المزامنة:' : 'Sync Success Rate:'}</span>
                    <span className="font-mono text-success">99.8%</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                <h5 className="font-medium text-primary mb-2">
                  {language === 'ar' ? 'الميزات النشطة' : 'Active Features'}
                </h5>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-success" />
                    <span className="text-sm">
                      {language === 'ar' ? 'المراقبة المباشرة للمدفوعات' : 'Real-time Payment Monitoring'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-success" />
                    <span className="text-sm">
                      {language === 'ar' ? 'التحقق التلقائي من الامتثال' : 'Automated Compliance Verification'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-success" />
                    <span className="text-sm">
                      {language === 'ar' ? 'إشعارات المخالفات الفورية' : 'Instant Violation Alerts'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-success" />
                    <span className="text-sm">
                      {language === 'ar' ? 'تقارير الامتثال الآلية' : 'Automated Compliance Reports'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions for Payroll Integration */}
          <div className="mt-6 p-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border border-primary/10">
            <h5 className="font-medium mb-3 text-primary">
              {language === 'ar' ? 'إجراءات سريعة للرواتب' : 'Payroll Quick Actions'}
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <button className="p-3 bg-white rounded border border-primary/20 hover:border-primary/40 transition-colors text-left">
                <div className="font-medium text-sm text-primary">
                  {language === 'ar' ? 'مزامنة فورية' : 'Instant Sync'}
                </div>
                <div className="text-xs text-muted-foreground">
                  {language === 'ar' ? 'تحديث البيانات الآن' : 'Update data now'}
                </div>
              </button>
              
              <button className="p-3 bg-white rounded border border-success/20 hover:border-success/40 transition-colors text-left">
                <div className="font-medium text-sm text-success">
                  {language === 'ar' ? 'تقرير الامتثال' : 'Compliance Report'}
                </div>
                <div className="text-xs text-muted-foreground">
                  {language === 'ar' ? 'عرض التقرير الحالي' : 'View current report'}
                </div>
              </button>
              
              <button className="p-3 bg-white rounded border border-warning/20 hover:border-warning/40 transition-colors text-left">
                <div className="font-medium text-sm text-warning">
                  {language === 'ar' ? 'سجل المعاملات' : 'Transaction Log'}
                </div>
                <div className="text-xs text-muted-foreground">
                  {language === 'ar' ? 'عرض السجل الكامل' : 'View full log'}
                </div>
              </button>
              
              <button className="p-3 bg-white rounded border border-accent/20 hover:border-accent/40 transition-colors text-left">
                <div className="font-medium text-sm text-accent">
                  {language === 'ar' ? 'إعدادات التكامل' : 'Integration Settings'}
                </div>
                <div className="text-xs text-muted-foreground">
                  {language === 'ar' ? 'تخصيص الإعدادات' : 'Customize settings'}
                </div>
              </button>
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