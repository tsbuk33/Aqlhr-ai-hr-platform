import { useLanguage } from "@/contexts/LanguageContext";
import { UnifiedGovernmentInterface } from "@/components/government/UnifiedGovernmentInterface";
import { Users, Building, Shield, FileText, TrendingUp, CheckCircle, CreditCard, UserCheck } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const AbsherPlatform = () => {
  const { t, isRTL } = useLanguage();

  const handleTestConnection = async () => {
    toast({
      title: isRTL ? "اختبار اتصال منصة أبشر أعمال" : "Testing Absher Business Connection",
      description: isRTL ? "جاري فحص الاتصال مع منصة أبشر أعمال..." : "Testing connection with Absher Business platform..."
    });
    await new Promise(resolve => setTimeout(resolve, 2000));
  };

  const handleSyncNow = async () => {
    toast({
      title: isRTL ? "مزامنة أبشر أعمال" : "Absher Business Sync",
      description: isRTL ? "جاري مزامنة البيانات والخدمات..." : "Syncing data and services..."
    });
    await new Promise(resolve => setTimeout(resolve, 1500));
  };

  return (
    <UnifiedGovernmentInterface
      platformName="Absher Business Integration"
      platformNameAr="تكامل منصة أبشر أعمال"
      description="Saudi Digital Government Platform for Business Services"
      descriptionAr="منصة الحكومة الرقمية السعودية للخدمات التجارية"
      icon={Shield}
      connectionStatus={{
        status: 'connected',
        lastSync: '2024-01-15T16:20:00Z',
        responseTime: 220
      }}
      onTestConnection={handleTestConnection}
      onSyncNow={handleSyncNow}
    >
      {/* Platform Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="p-6 border rounded-lg bg-card">
          <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
            <Building className="h-5 w-5" />
            {isRTL ? 'الخدمات المؤسسية' : 'Business Services'}
          </h3>
          <div className="text-3xl font-bold text-brand-primary">450+</div>
          <p className="text-sm text-muted-foreground mt-2">{isRTL ? 'خدمة رقمية للمؤسسات والشركات' : 'digital services for organizations and companies'}</p>
        </div>
        
        <div className="p-6 border rounded-lg bg-card">
          <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
            <Users className="h-5 w-5" />
            {isRTL ? 'المؤسسات المسجلة' : 'Registered Organizations'}
          </h3>
          <div className="text-3xl font-bold text-brand-success">2.8M</div>
          <p className="text-sm text-muted-foreground mt-2">{isRTL ? 'مليون مؤسسة مسجلة في المنصة' : 'million organizations registered on the platform'}</p>
        </div>
        
        <div className="p-6 border rounded-lg bg-card">
          <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {isRTL ? 'معدل الأمان' : 'Security Rate'}
          </h3>
          <div className="text-3xl font-bold text-brand-accent">99.9%</div>
          <p className="text-sm text-muted-foreground mt-2">{isRTL ? 'مستوى الحماية والأمان الرقمي' : 'digital protection and security level'}</p>
        </div>
        
        <div className="p-6 border rounded-lg bg-card">
          <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {isRTL ? 'المعاملات الشهرية' : 'Monthly Transactions'}
          </h3>
          <div className="text-3xl font-bold text-brand-warning">15.6M</div>
          <p className="text-sm text-muted-foreground mt-2">{isRTL ? 'مليون معاملة شهرياً' : 'million transactions per month'}</p>
        </div>
      </div>

      {/* SanadHR Integration Section */}
      <Card className="border-2 border-dashed border-primary/20 bg-gradient-to-r from-primary/5 to-success/5 mb-6">
        <CardHeader>
          <CardTitle className="text-primary flex items-center gap-2">
            <Shield className="h-6 w-6" />
            {isRTL ? 'التكامل المباشر مع سند الموارد البشرية - منصة أبشر أعمال' : 'Direct SanadHR Integration - Absher Business Platform'}
          </CardTitle>
          <CardDescription>
            {isRTL ? 
              'تزامن تلقائي مع خدمات أبشر أعمال الرقمية لإدارة شؤون الموظفين والامتثال الحكومي الكامل' :
              'Automatic sync with Absher Business digital services for employee management and complete government compliance'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-primary flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
                {isRTL ? 'خدمات الهوية والأفراد' : 'Identity & Individual Services'}
              </h4>
              
              <div className="space-y-3">
                <div className="p-3 bg-primary/5 rounded-lg border-l-4 border-l-primary">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {isRTL ? 'التحقق من هوية الموظفين' : 'Employee Identity Verification'}
                    </span>
                    <Badge className="bg-status-success text-white">
                      {isRTL ? 'نشط' : 'Active'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isRTL ? 
                      'التحقق التلقائي من صحة بيانات الهوية الوطنية للموظفين' : 
                      'Automatic verification of national ID authenticity for employees'
                    }
                  </p>
                </div>

                <div className="p-3 bg-success/5 rounded-lg border-l-4 border-l-success">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {isRTL ? 'حالة الإقامة والجوازات' : 'Residence & Passport Status'}
                    </span>
                    <Badge className="bg-status-success text-white">
                      {isRTL ? 'متاح' : 'Available'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isRTL ? 
                      'فحص صحة وحالة الإقامة وانتهاء الجوازات للموظفين الوافدين' : 
                      'Check validity and status of residence permits and passport expiry for expat employees'
                    }
                  </p>
                </div>

                <div className="p-3 bg-warning/5 rounded-lg border-l-4 border-l-warning">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {isRTL ? 'تجديد الهويات والوثائق' : 'ID & Document Renewal'}
                    </span>
                    <Badge className="bg-status-warning text-white">
                      {isRTL ? 'تحت التطوير' : 'In Development'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isRTL ? 
                      'إشعارات تلقائية لتجديد الهويات والوثائق قبل انتهائها' : 
                      'Automatic notifications for ID and document renewal before expiry'
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-success flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                {isRTL ? 'الخدمات المالية والتجارية' : 'Financial & Commercial Services'}
              </h4>
              
              <div className="p-4 bg-success/10 rounded-lg border border-success/20">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {isRTL ? 'شهادة السجل التجاري' : 'Commercial Registration Certificate'}
                    </span>
                    <Badge className="bg-success text-white">
                      {isRTL ? 'متاح' : 'Available'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {isRTL ? 'شهادة السعودة' : 'Saudization Certificate'}
                    </span>
                    <Badge className="bg-primary text-white">
                      {isRTL ? 'نشط' : 'Active'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {isRTL ? 'خدمات الأحوال المدنية' : 'Civil Affairs Services'}
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
                    <span className="font-mono text-primary">28</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isRTL ? 'استعلامات فورية:' : 'Instant Inquiries:'}</span>
                    <span className="font-mono text-success">847/يوم</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isRTL ? 'معدل الاستجابة:' : 'Response Rate:'}</span>
                    <span className="font-mono text-accent">0.8s</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isRTL ? 'آخر تحديث:' : 'Last Update:'}</span>
                    <span className="font-mono text-warning">{isRTL ? 'منذ ساعة' : '1 hour ago'}</span>
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
                  {isRTL ? 'خدمة التحقق من الهوية' : 'Identity Verification Service'}
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
                  {isRTL ? 'خدمة استعلام الإقامة' : 'Residence Inquiry Service'}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {isRTL ? 'زمن الاستجابة: 0.5 ثانية' : 'Response time: 0.5 seconds'}
                </div>
                <Badge className="mt-2 bg-status-success text-white text-xs">
                  {isRTL ? 'نشط' : 'Active'}
                </Badge>
              </div>

              <div className="p-3 bg-white rounded border border-accent/20 hover:border-accent/40 transition-colors">
                <div className="text-sm font-medium text-accent">
                  {isRTL ? 'خدمة السجل التجاري' : 'Commercial Registry Service'}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {isRTL ? 'زمن الاستجابة: 1.2 ثانية' : 'Response time: 1.2 seconds'}
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

export default AbsherPlatform;