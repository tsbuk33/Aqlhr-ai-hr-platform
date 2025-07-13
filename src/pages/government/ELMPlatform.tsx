import { useLanguage } from "@/hooks/useLanguageCompat";
import { UnifiedGovernmentInterface } from "@/components/government/UnifiedGovernmentInterface";
import { Users, Building, Shield, FileText, TrendingUp, CheckCircle, CreditCard, UserCheck, Database, Monitor } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ELMPlatform = () => {
  const { t, isRTL } = useLanguage();

  const handleTestConnection = async () => {
    toast({
      title: isRTL ? "اختبار اتصال منصة عِلم" : "Testing ELM Platform Connection",
      description: isRTL ? "جاري فحص الاتصال مع منصة عِلم..." : "Testing connection with ELM platform..."
    });
    await new Promise(resolve => setTimeout(resolve, 2000));
  };

  const handleSyncNow = async () => {
    toast({
      title: isRTL ? "مزامنة منصة عِلم" : "ELM Platform Sync",
      description: isRTL ? "جاري مزامنة البيانات والخدمات..." : "Syncing data and services..."
    });
    await new Promise(resolve => setTimeout(resolve, 1500));
  };

  return (
    <UnifiedGovernmentInterface
      platformName="ELM Platform Integration"
      platformNameAr="تكامل منصة عِلم"
      description="Saudi Digital Learning and Human Capital Platform"
      descriptionAr="منصة التعلم الرقمي والرأسمال البشري السعودية"
      icon={Database}
      connectionStatus={{
        status: 'connected',
        lastSync: '2024-01-15T16:25:00Z',
        responseTime: 160
      }}
      onTestConnection={handleTestConnection}
      onSyncNow={handleSyncNow}
    >
      {/* Platform Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="p-6 border rounded-lg bg-card">
          <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
            <Database className="h-5 w-5" />
            {isRTL ? 'العمليات المنجزة' : 'Completed Transactions'}
          </h3>
          <div className="text-3xl font-bold text-brand-primary">2B+</div>
          <p className="text-sm text-muted-foreground mt-2">{isRTL ? 'مليار عملية إلكترونية' : 'billion electronic transactions'}</p>
        </div>
        
        <div className="p-6 border rounded-lg bg-card">
          <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
            <Users className="h-5 w-5" />
            {isRTL ? 'المستخدمون المسجلون' : 'Registered Users'}
          </h3>
          <div className="text-3xl font-bold text-brand-success">29M+</div>
          <p className="text-sm text-muted-foreground mt-2">{isRTL ? 'مليون مستخدم نشط' : 'million active users'}</p>
        </div>
        
        <div className="p-6 border rounded-lg bg-card">
          <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
            <Building className="h-5 w-5" />
            {isRTL ? 'العملاء المؤسسيون' : 'Corporate Clients'}
          </h3>
          <div className="text-3xl font-bold text-brand-accent">3K+</div>
          <p className="text-sm text-muted-foreground mt-2">{isRTL ? 'ألف عميل مؤسسي' : 'thousand corporate clients'}</p>
        </div>
        
        <div className="p-6 border rounded-lg bg-card">
          <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            {isRTL ? 'الخدمات الإلكترونية' : 'Electronic Services'}
          </h3>
          <div className="text-3xl font-bold text-brand-warning">350+</div>
          <p className="text-sm text-muted-foreground mt-2">{isRTL ? 'خدمة إلكترونية متاحة' : 'electronic services available'}</p>
        </div>
      </div>

      {/* SanadHR Integration Section */}
      <Card className="border-2 border-dashed border-primary/20 bg-gradient-to-r from-primary/5 to-success/5 mb-6">
        <CardHeader>
          <CardTitle className="text-primary flex items-center gap-2">
            <Database className="h-6 w-6" />
            {isRTL ? 'التكامل المباشر مع سند الموارد البشرية - منصة عِلم' : 'Direct SanadHR Integration - ELM Platform'}
          </CardTitle>
          <CardDescription>
            {isRTL ? 
              'تزامن تلقائي مع خدمات التعلم الرقمي وتطوير الموارد البشرية والامتثال الحكومي الكامل' :
              'Automatic sync with digital learning services and human capital development with complete government compliance'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-primary flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
                {isRTL ? 'خدمات التعلم والتطوير' : 'Learning & Development Services'}
              </h4>
              
              <div className="space-y-3">
                <div className="p-3 bg-primary/5 rounded-lg border-l-4 border-l-primary">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {isRTL ? 'التعلم الإلكتروني المؤسسي' : 'Corporate E-Learning'}
                    </span>
                    <Badge className="bg-primary text-white">
                      {isRTL ? 'نشط' : 'Active'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isRTL ? 
                      'منصة تعلم متكاملة لتطوير مهارات الموظفين وبرامج التدريب المؤسسية' : 
                      'Integrated learning platform for employee skill development and corporate training programs'
                    }
                  </p>
                </div>

                <div className="p-3 bg-success/5 rounded-lg border-l-4 border-l-success">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {isRTL ? 'إدارة المواهب والكفاءات' : 'Talent & Competency Management'}
                    </span>
                    <Badge className="bg-primary text-white">
                      {isRTL ? 'نشط' : 'Active'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isRTL ? 
                      'نظام متقدم لتحديد وتطوير المواهب وقياس الكفاءات المهنية' : 
                      'Advanced system for talent identification, development and professional competency assessment'
                    }
                  </p>
                </div>

                <div className="p-3 bg-warning/5 rounded-lg border-l-4 border-l-warning">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {isRTL ? 'التقييم والاعتماد المهني' : 'Professional Assessment & Certification'}
                    </span>
                    <Badge className="bg-status-success text-white">
                      {isRTL ? 'متاح' : 'Available'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isRTL ? 
                      'برامج تقييم واعتماد المهارات المهنية والشهادات المعترف بها' : 
                      'Professional skills assessment and certification programs with recognized credentials'
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-success flex items-center gap-2">
                <FileText className="h-4 w-4" />
                {isRTL ? 'التقارير والتحليلات' : 'Reports & Analytics'}
              </h4>
              
              <div className="p-4 bg-success/10 rounded-lg border border-success/20">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {isRTL ? 'تقارير الأداء التعليمي' : 'Learning Performance Reports'}
                    </span>
                    <Badge className="bg-primary text-white">
                      {isRTL ? 'نشط' : 'Active'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {isRTL ? 'تحليل احتياجات التدريب' : 'Training Needs Analysis'}
                    </span>
                    <Badge className="bg-primary text-white">
                      {isRTL ? 'نشط' : 'Active'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {isRTL ? 'قياس عائد الاستثمار التدريبي' : 'Training ROI Measurement'}
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
                    <span className="font-mono text-primary">32</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isRTL ? 'استعلامات فورية:' : 'Instant Inquiries:'}</span>
                    <span className="font-mono text-success">956/يوم</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isRTL ? 'معدل الاستجابة:' : 'Response Rate:'}</span>
                    <span className="font-mono text-accent">0.5s</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isRTL ? 'آخر تحديث:' : 'Last Update:'}</span>
                    <span className="font-mono text-warning">{isRTL ? 'منذ 45 دقيقة' : '45 minutes ago'}</span>
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
                  {isRTL ? 'منصة التعلم الإلكتروني' : 'E-Learning Platform'}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {isRTL ? 'زمن الاستجابة: 0.3 ثانية' : 'Response time: 0.3 seconds'}
                </div>
                <Badge className="mt-2 bg-status-success text-white text-xs">
                  {isRTL ? 'متاح' : 'Available'}
                </Badge>
              </div>

              <div className="p-3 bg-white rounded border border-success/20 hover:border-success/40 transition-colors">
                <div className="text-sm font-medium text-success">
                  {isRTL ? 'نظام إدارة المواهب' : 'Talent Management System'}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {isRTL ? 'زمن الاستجابة: 0.7 ثانية' : 'Response time: 0.7 seconds'}
                </div>
                <Badge className="mt-2 bg-status-success text-white text-xs">
                  {isRTL ? 'نشط' : 'Active'}
                </Badge>
              </div>

              <div className="p-3 bg-white rounded border border-accent/20 hover:border-accent/40 transition-colors">
                <div className="text-sm font-medium text-accent">
                  {isRTL ? 'نظام التقييم والاعتماد' : 'Assessment & Certification System'}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {isRTL ? 'زمن الاستجابة: 0.9 ثانية' : 'Response time: 0.9 seconds'}
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

export default ELMPlatform;