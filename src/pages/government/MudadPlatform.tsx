import { useLanguage } from "@/hooks/useLanguageCompat";
import { UnifiedGovernmentInterface } from "@/components/government/UnifiedGovernmentInterface";
import { Users, Building, Shield, FileText, TrendingUp, CheckCircle, CreditCard, UserCheck, Banknote, Calculator } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const MudadPlatform = () => {
  const { t, isRTL } = useLanguage();

  const handleTestConnection = async () => {
    toast({
      title: isRTL ? "اختبار اتصال منصة مُدد" : "Testing Mudad Platform Connection",
      description: isRTL ? "جاري فحص الاتصال مع منصة مُدد..." : "Testing connection with Mudad platform..."
    });
    await new Promise(resolve => setTimeout(resolve, 2000));
  };

  const handleSyncNow = async () => {
    toast({
      title: isRTL ? "مزامنة منصة مُدد" : "Mudad Platform Sync",
      description: isRTL ? "جاري مزامنة البيانات والخدمات..." : "Syncing data and services..."
    });
    await new Promise(resolve => setTimeout(resolve, 1500));
  };

  return (
    <UnifiedGovernmentInterface
      platformName="Mudad Platform Integration"
      platformNameAr="تكامل منصة مُدد"
      description="Saudi Wage Protection System & Payroll Management Platform"
      descriptionAr="منصة نظام حماية الأجور وإدارة الرواتب السعودية"
      icon={CreditCard}
      connectionStatus={{
        status: 'connected',
        lastSync: '2024-01-15T16:30:00Z',
        responseTime: 140
      }}
      onTestConnection={handleTestConnection}
      onSyncNow={handleSyncNow}
    >
      {/* Platform Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="p-6 border rounded-lg bg-card">
          <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
            <Banknote className="h-5 w-5" />
            {isRTL ? 'إجمالي الرواتب المعالجة' : 'Total Processed Salaries'}
          </h3>
          <div className="text-3xl font-bold text-brand-primary">89.7B</div>
          <p className="text-sm text-muted-foreground mt-2">{isRTL ? 'مليار ريال سعودي سنوياً' : 'billion SAR annually'}</p>
        </div>
        
        <div className="p-6 border rounded-lg bg-card">
          <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
            <Building className="h-5 w-5" />
            {isRTL ? 'المنشآت المسجلة' : 'Registered Establishments'}
          </h3>
          <div className="text-3xl font-bold text-brand-success">180K+</div>
          <p className="text-sm text-muted-foreground mt-2">{isRTL ? 'ألف منشأة في النظام' : 'thousand establishments in system'}</p>
        </div>
        
        <div className="p-6 border rounded-lg bg-card">
          <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
            <Users className="h-5 w-5" />
            {isRTL ? 'الموظفون المحميون' : 'Protected Employees'}
          </h3>
          <div className="text-3xl font-bold text-brand-accent">8.5M</div>
          <p className="text-sm text-muted-foreground mt-2">{isRTL ? 'مليون موظف محمي بالنظام' : 'million employees protected by system'}</p>
        </div>
        
        <div className="p-6 border rounded-lg bg-card">
          <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            {isRTL ? 'معدل الامتثال' : 'Compliance Rate'}
          </h3>
          <div className="text-3xl font-bold text-brand-warning">97.8%</div>
          <p className="text-sm text-muted-foreground mt-2">{isRTL ? 'معدل امتثال المنشآت' : 'establishment compliance rate'}</p>
        </div>
      </div>

      {/* SanadHR Integration Section */}
      <Card className="border-2 border-dashed border-primary/20 bg-gradient-to-r from-primary/5 to-success/5 mb-6">
        <CardHeader>
          <CardTitle className="text-primary flex items-center gap-2">
            <CreditCard className="h-6 w-6" />
            {isRTL ? 'التكامل المباشر مع سند الموارد البشرية - منصة مُدد' : 'Direct SanadHR Integration - Mudad Platform'}
          </CardTitle>
          <CardDescription>
            {isRTL ? 
              'تزامن تلقائي مع نظام حماية الأجور وإدارة الرواتب والامتثال الحكومي الكامل' :
              'Automatic sync with Wage Protection System and payroll management with complete government compliance'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-primary flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
                {isRTL ? 'خدمات حماية الأجور' : 'Wage Protection Services'}
              </h4>
              
              <div className="space-y-3">
                <div className="p-3 bg-primary/5 rounded-lg border-l-4 border-l-primary">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {isRTL ? 'تحويل الرواتب الآمن' : 'Secure Salary Transfer'}
                    </span>
                    <Badge className="bg-primary text-white">
                      {isRTL ? 'نشط' : 'Active'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isRTL ? 
                      'تحويل آمن ومضمون للرواتب مع ضمان حقوق الموظفين والمنشآت' : 
                      'Secure and guaranteed salary transfers ensuring employee and establishment rights'
                    }
                  </p>
                </div>

                <div className="p-3 bg-success/5 rounded-lg border-l-4 border-l-success">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {isRTL ? 'نظام إدارة الرواتب' : 'Payroll Management System'}
                    </span>
                    <Badge className="bg-primary text-white">
                      {isRTL ? 'نشط' : 'Active'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isRTL ? 
                      'نظام متكامل لإدارة الرواتب مع الربط المباشر مع التأمينات الاجتماعية' : 
                      'Integrated payroll management system with direct GOSI integration'
                    }
                  </p>
                </div>

                <div className="p-3 bg-warning/5 rounded-lg border-l-4 border-l-warning">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {isRTL ? 'إدارة التبريرات والمطالبات' : 'Justifications & Claims Management'}
                    </span>
                    <Badge className="bg-status-success text-white">
                      {isRTL ? 'متاح' : 'Available'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isRTL ? 
                      'معالجة تبريرات الموظفين والمطالبات بشفافية ووضوح كامل' : 
                      'Processing employee justifications and claims with full transparency and clarity'
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-success flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                {isRTL ? 'التقارير والتحليلات المالية' : 'Financial Reports & Analytics'}
              </h4>
              
              <div className="p-4 bg-success/10 rounded-lg border border-success/20">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {isRTL ? 'تقارير الامتثال المالي' : 'Financial Compliance Reports'}
                    </span>
                    <Badge className="bg-primary text-white">
                      {isRTL ? 'نشط' : 'Active'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {isRTL ? 'تحليل أداء الرواتب' : 'Payroll Performance Analysis'}
                    </span>
                    <Badge className="bg-primary text-white">
                      {isRTL ? 'نشط' : 'Active'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {isRTL ? 'مراقبة التزام المنشآت' : 'Establishment Compliance Monitoring'}
                    </span>
                    <Badge className="bg-accent text-white">
                      {isRTL ? 'مستمر' : 'Ongoing'}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                <h5 className="font-medium text-primary mb-2">
                  {isRTL ? 'إحصائيات التكامل المباشر' : 'Direct Integration Statistics'}
                </h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>{isRTL ? 'الخدمات المدمجة:' : 'Integrated Services:'}</span>
                    <span className="font-mono text-primary">24</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isRTL ? 'عمليات يومية:' : 'Daily Operations:'}</span>
                    <span className="font-mono text-success">45,726</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isRTL ? 'معدل الاستجابة:' : 'Response Rate:'}</span>
                    <span className="font-mono text-accent">0.4s</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isRTL ? 'آخر تحديث:' : 'Last Update:'}</span>
                    <span className="font-mono text-warning">{isRTL ? 'منذ 15 دقيقة' : '15 minutes ago'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Real-time Service Status */}
          <div className="mt-6 p-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border border-primary/10">
            <h5 className="font-medium mb-3 text-primary flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              {isRTL ? 'حالة الخدمات الحية' : 'Live Service Status'}
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 bg-white rounded border border-primary/20 hover:border-primary/40 transition-colors">
                <div className="text-sm font-medium text-primary">
                  {isRTL ? 'نظام تحويل الرواتب' : 'Salary Transfer System'}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {isRTL ? 'زمن الاستجابة: 0.2 ثانية' : 'Response time: 0.2 seconds'}
                </div>
                <Badge className="mt-2 bg-status-success text-white text-xs">
                  {isRTL ? 'متاح' : 'Available'}
                </Badge>
              </div>

              <div className="p-3 bg-white rounded border border-success/20 hover:border-success/40 transition-colors">
                <div className="text-sm font-medium text-success">
                  {isRTL ? 'نظام إدارة الرواتب' : 'Payroll Management System'}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {isRTL ? 'زمن الاستجابة: 0.6 ثانية' : 'Response time: 0.6 seconds'}
                </div>
                <Badge className="mt-2 bg-status-success text-white text-xs">
                  {isRTL ? 'نشط' : 'Active'}
                </Badge>
              </div>

              <div className="p-3 bg-white rounded border border-accent/20 hover:border-accent/40 transition-colors">
                <div className="text-sm font-medium text-accent">
                  {isRTL ? 'نظام التبريرات والمطالبات' : 'Justifications & Claims System'}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {isRTL ? 'زمن الاستجابة: 0.8 ثانية' : 'Response time: 0.8 seconds'}
                </div>
                <Badge className="mt-2 bg-status-info text-white text-xs">
                  {isRTL ? 'متاح' : 'Available'}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </UnifiedGovernmentInterface>
  );
};

export default MudadPlatform;