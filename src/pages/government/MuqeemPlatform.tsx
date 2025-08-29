import { useLanguage } from "@/hooks/useLanguageCompat";
import { UnifiedGovernmentInterface } from "@/components/government/UnifiedGovernmentInterface";
import { UniversalDocumentManager } from "@/components/common/UniversalDocumentManager";
import { Users, Building, Shield, FileText, TrendingUp, CheckCircle, CreditCard, UserCheck, MapPin, Plane } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";

const MuqeemPlatform = () => {
  const { t, isRTL } = useLanguage();
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleTestConnection = async () => {
    toast({
      title: isRTL ? "اختبار اتصال منصة مقيم" : "Testing Muqeem Platform Connection",
      description: isRTL ? "جاري فحص الاتصال مع منصة مقيم..." : "Testing connection with Muqeem platform..."
    });
    await new Promise(resolve => setTimeout(resolve, 2000));
  };

  const handleSyncNow = async () => {
    toast({
      title: isRTL ? "مزامنة منصة مقيم" : "Muqeem Platform Sync",
      description: isRTL ? "جاري مزامنة البيانات والخدمات..." : "Syncing data and services..."
    });
    await new Promise(resolve => setTimeout(resolve, 1500));
  };

  return (
    <UnifiedGovernmentInterface
      platformName="Muqeem Platform Integration"
      platformNameAr="تكامل منصة مقيم"
      description="Saudi Passport Services Platform for Resident Affairs"
      descriptionAr="منصة خدمات الجوازات السعودية لشؤون المقيمين"
      icon={Plane}
      connectionStatus={{
        status: 'connected',
        lastSync: '2024-01-15T16:15:00Z',
        responseTime: 180
      }}
      onTestConnection={handleTestConnection}
      onSyncNow={handleSyncNow}
    >
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">{isRTL ? 'نظرة عامة' : 'Overview'}</TabsTrigger>
          <TabsTrigger value="upload">{isRTL ? 'رفع الملفات' : 'File Upload'}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          {/* Platform Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="p-6 border rounded-lg bg-card">
          <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {isRTL ? 'العمليات التفاعلية' : 'Interactive Operations'}
          </h3>
          <div className="text-3xl font-bold text-brand-primary">120M+</div>
          <p className="text-sm text-muted-foreground mt-2">{isRTL ? 'عملية تفاعلية منجزة' : 'interactive operations completed'}</p>
        </div>
        
        <div className="p-6 border rounded-lg bg-card">
          <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {isRTL ? 'التقارير التفصيلية' : 'Detailed Reports'}
          </h3>
          <div className="text-3xl font-bold text-brand-success">34+</div>
          <p className="text-sm text-muted-foreground mt-2">{isRTL ? 'تقرير بمعلومات تفصيلية' : 'reports with detailed information'}</p>
        </div>
        
        <div className="p-6 border rounded-lg bg-card">
          <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            {isRTL ? 'خطوات التسجيل' : 'Registration Steps'}
          </h3>
          <div className="text-3xl font-bold text-brand-accent">4</div>
          <p className="text-sm text-muted-foreground mt-2">{isRTL ? 'خطوات بسيطة للتسجيل الذاتي' : 'simple steps for self-registration'}</p>
        </div>
        
        <div className="p-6 border rounded-lg bg-card">
          <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
            <Users className="h-5 w-5" />
            {isRTL ? 'المؤسسات المسجلة' : 'Registered Organizations'}
          </h3>
          <div className="text-3xl font-bold text-brand-warning">85K+</div>
          <p className="text-sm text-muted-foreground mt-2">{isRTL ? 'مؤسسة مسجلة في المنصة' : 'organizations registered on the platform'}</p>
        </div>
      </div>

      {/* SanadHR Integration Section */}
      <Card className="border-2 border-dashed border-primary/20 bg-gradient-to-r from-primary/5 to-success/5 mb-6">
        <CardHeader>
          <CardTitle className="text-primary flex items-center gap-2">
            <Plane className="h-6 w-6" />
            {isRTL ? 'التكامل المباشر مع عقل للموارد البشرية - منصة مقيم' : 'Direct AqlHR Integration - Muqeem Platform'}
          </CardTitle>
          <CardDescription>
            {isRTL ? 
              'تزامن تلقائي مع خدمات الجوازات ومعاملات الإقامات للموظفين المقيمين والامتثال الحكومي الكامل' :
              'Automatic sync with passport services and residence transactions for resident employees and complete government compliance'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-primary flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
                {isRTL ? 'خدمات المقيمين والجوازات' : 'Residents & Passport Services'}
              </h4>
              
              <div className="space-y-3">
                <div className="p-3 bg-primary/5 rounded-lg border-l-4 border-l-primary">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {isRTL ? 'استعلام عن بيانات الإقامة' : 'Residence Data Inquiry'}
                    </span>
                    <Badge className="bg-primary text-white">
                      {isRTL ? 'نشط' : 'Active'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isRTL ? 
                      'الاستعلام الفوري عن حالة وبيانات الإقامة للموظفين المقيمين' : 
                      'Instant inquiry about residence status and data for resident employees'
                    }
                  </p>
                </div>

                <div className="p-3 bg-success/5 rounded-lg border-l-4 border-l-success">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {isRTL ? 'تجديد الإقامات والتأشيرات' : 'Residence & Visa Renewal'}
                    </span>
                    <Badge className="bg-primary text-white">
                      {isRTL ? 'نشط' : 'Active'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isRTL ? 
                      'معالجة وتجديد الإقامات والتأشيرات إلكترونياً دون مراجعة الجوازات' : 
                      'Electronic processing and renewal of residences and visas without visiting passport offices'
                    }
                  </p>
                </div>

                <div className="p-3 bg-warning/5 rounded-lg border-l-4 border-l-warning">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {isRTL ? 'تصاريح الدخول والسفر' : 'Entry & Travel Permits'}
                    </span>
                    <Badge className="bg-status-success text-white">
                      {isRTL ? 'متاح' : 'Available'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isRTL ? 
                      'إصدار تصاريح دخول مكة وتصاريح السفر للموظفين' : 
                      'Issue Makkah entry permits and travel permits for employees'
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-success flex items-center gap-2">
                <FileText className="h-4 w-4" />
                {isRTL ? 'التقارير والخدمات الإضافية' : 'Reports & Additional Services'}
              </h4>
              
              <div className="p-4 bg-success/10 rounded-lg border border-success/20">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {isRTL ? 'تقرير المقيمين الشامل' : 'Comprehensive Residents Report'}
                    </span>
                    <Badge className="bg-primary text-white">
                      {isRTL ? 'نشط' : 'Active'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {isRTL ? 'تقرير الزوار' : 'Visitors Report'}
                    </span>
                    <Badge className="bg-primary text-white">
                      {isRTL ? 'نشط' : 'Active'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {isRTL ? 'التحقق من التأشيرات' : 'Visa Verification'}
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
                    <span className="font-mono text-primary">26</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isRTL ? 'استعلامات فورية:' : 'Instant Inquiries:'}</span>
                    <span className="font-mono text-success">1,247/يوم</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isRTL ? 'معدل الاستجابة:' : 'Response Rate:'}</span>
                    <span className="font-mono text-accent">0.6s</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isRTL ? 'آخر تحديث:' : 'Last Update:'}</span>
                    <span className="font-mono text-warning">{isRTL ? 'منذ 30 دقيقة' : '30 minutes ago'}</span>
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
                  {isRTL ? 'خدمة استعلام الإقامة' : 'Residence Inquiry Service'}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {isRTL ? 'زمن الاستجابة: 0.4 ثانية' : 'Response time: 0.4 seconds'}
                </div>
                <Badge className="mt-2 bg-status-success text-white text-xs">
                  {isRTL ? 'متاح' : 'Available'}
                </Badge>
              </div>

              <div className="p-3 bg-white rounded border border-success/20 hover:border-success/40 transition-colors">
                <div className="text-sm font-medium text-success">
                  {isRTL ? 'خدمة تجديد التأشيرات' : 'Visa Renewal Service'}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {isRTL ? 'زمن الاستجابة: 0.8 ثانية' : 'Response time: 0.8 seconds'}
                </div>
                <Badge className="mt-2 bg-status-success text-white text-xs">
                  {isRTL ? 'نشط' : 'Active'}
                </Badge>
              </div>

              <div className="p-3 bg-white rounded border border-accent/20 hover:border-accent/40 transition-colors">
                <div className="text-sm font-medium text-accent">
                  {isRTL ? 'خدمة تصاريح مكة' : 'Makkah Permits Service'}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {isRTL ? 'زمن الاستجابة: 1.1 ثانية' : 'Response time: 1.1 seconds'}
                </div>
                <Badge className="mt-2 bg-status-info text-white text-xs">
                  {isRTL ? 'متاح' : 'Available'}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
        </TabsContent>
        
        <TabsContent value="upload" className="space-y-6">
          <UniversalDocumentManager
            moduleName="Muqeem Residence Platform"
            moduleNameAr="منصة مقيم للإقامة"
            description="Upload residence permit documents, renewal applications, and residence status verification files"
            descriptionAr="رفع وثائق تصاريح الإقامة وطلبات التجديد وملفات التحقق من حالة الإقامة"
            platform="muqeem"
            moduleType="government"
            acceptedTypes={['.pdf', '.xlsx', '.xls', '.doc', '.docx', '.jpg', '.jpeg', '.png']}
            maxFileSize={25 * 1024 * 1024}
            maxFiles={30}
          />
        </TabsContent>
      </Tabs>
      
      {/* AI Integration for Muqeem Platform */}
      <UniversalAIIntegrator 
        pageType="government" 
        moduleName="muqeem-platform" 
        companyId="demo-company" 
        enabledFeatures={['government-integration', 'passport-services', 'resident-affairs', 'muqeem-compliance']}
      />
    </UnifiedGovernmentInterface>
  );
};

export default MuqeemPlatform;