import { useLanguage } from "@/hooks/useLanguageCompat";
import { usePerformantLocalization } from "@/hooks/usePerformantLocalization";
import { MemoizedMetricCard } from "@/components/performance/MemoizedMetricCard";
import { FocusManager } from "@/components/accessibility/FocusManager";
import { ScreenReaderText } from "@/components/accessibility/ScreenReaderText";
import { UnifiedGovernmentInterface } from "@/components/government/UnifiedGovernmentInterface";
import { FileUploadSystem } from "@/components/government/FileUploadSystem";
import { Activity, CheckCircle, Clock, Shield, Settings, Users, FileText, TrendingUp, Zap, Award } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SaudiEngineeringBody = () => {
  const { t, isRTL } = useLanguage();
  const { formatters, dateFormatters } = usePerformantLocalization();
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleTestConnection = async () => {
    toast({
      title: isRTL ? "اختبار اتصال هيئة المهندسين السعوديين" : "Testing Saudi Engineering Body Connection",
      description: isRTL ? "جاري فحص الاتصال مع هيئة المهندسين السعوديين..." : "Testing connection with Saudi Engineering Body platform..."
    });
    
    try {
      // Call Saudi Engineering Body integration edge function
      const { data, error } = await supabase.functions.invoke('saudi-engineering-integration');
      
      if (error) throw error;
      
      toast({
        title: isRTL ? "تم الاتصال بنجاح" : "Connection Successful", 
        description: isRTL ? "تم ربط هيئة المهندسين السعوديين مع سند الموارد البشرية بنجاح" : "Saudi Engineering Body successfully connected with SanadHR"
      });
    } catch (error) {
      toast({
        title: isRTL ? "فشل في الاتصال" : "Connection Failed",
        description: isRTL ? "حدث خطأ أثناء الاتصال بهيئة المهندسين السعوديين" : "Error connecting to Saudi Engineering Body platform"
      });
    }
  };

  const handleSyncNow = async () => {
    toast({
      title: isRTL ? "مزامنة هيئة المهندسين مع سند" : "Saudi Engineering-SanadHR Sync",
      description: isRTL ? "جاري مزامنة أرقام المهندسين وبيانات الاعتماد المهني..." : "Syncing engineer numbers and professional accreditation data..."
    });
    
    try {
      // Call Saudi Engineering Body integration for engineer data sync
      const { data, error } = await supabase.functions.invoke('saudi-engineering-integration', {
        body: { 
          action: 'sync_engineer_data',
          employee_id: 'sample-employee-id',
          engineer_data: { sync_type: 'full_sync' }
        }
      });
      
      if (error) throw error;
      
      toast({
        title: isRTL ? "اكتملت المزامنة" : "Sync Completed",
        description: isRTL ? "تم تحديث جميع بيانات المهندسين في سند الموارد البشرية" : "All engineer data updated in SanadHR system"
      });
    } catch (error) {
      toast({
        title: isRTL ? "فشل في المزامنة" : "Sync Failed", 
        description: isRTL ? "حدث خطأ أثناء مزامنة البيانات" : "Error during data synchronization"
      });
    }
  };

  return (
    <FocusManager autoFocus restoreFocus>
      <UnifiedGovernmentInterface
        platformName="Saudi Engineering Body Integration"
        platformNameAr="تكامل هيئة المهندسين السعوديين"
        description="Engineer registration, professional accreditation, and certification management"
        descriptionAr="تسجيل المهندسين والاعتماد المهني وإدارة الشهادات"
        icon={Settings}
        connectionStatus={{
          status: 'connected',
          lastSync: '2024-01-15T10:30:00Z',
          responseTime: 245
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
            <ScreenReaderText>{isRTL ? "إحصائيات تكامل هيئة المهندسين السعوديين" : "Saudi Engineering Body platform integration statistics"}</ScreenReaderText>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <MemoizedMetricCard
            title={isRTL ? "المهندسون المسجلون" : "Registered Engineers"}
            value="1,847"
            description={`+12 ${isRTL ? 'هذا الشهر' : 'this month'}`}
            icon={<Users className="h-6 w-6" />}
            variant="primary"
            trend={{
              value: "12",
              isPositive: true
            }}
          />
          <MemoizedMetricCard
            title={isRTL ? "نسبة نجاح التحقق" : "Verification Success Rate"}
            value="98.9%"
            description={isRTL ? "معاملات ناجحة عبر الواجهة البرمجية" : "Successful API verification"}
            icon={<CheckCircle className="h-6 w-6" />}
            variant="success"
          />
          <MemoizedMetricCard
            title={isRTL ? "الشهادات المهنية النشطة" : "Active Professional Certificates"}
            value="2,134"
            description={`+43 ${isRTL ? 'الشهر الماضي' : 'last month'}`}
            icon={<Award className="h-6 w-6" />}
            variant="accent"
            trend={{
              value: "43",
              isPositive: true
            }}
          />
          <MemoizedMetricCard
            title={isRTL ? "معدل الامتثال" : "Compliance Rate"}
            value="97.2%"
            description={isRTL ? "نسبة المهندسين المتوافقين" : "Engineer compliance rate"}
            icon={<Shield className="h-6 w-6" />}
            variant="warning"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <div className="bg-card p-6 rounded-lg border">
            <div className="flex items-center gap-3 mb-4">
              <Settings className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-semibold">
                {isRTL ? "خدمات التسجيل المهني" : "Professional Registration Services"}
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                <span className="text-sm font-medium">
                  {isRTL ? "طلبات التسجيل المعالجة" : "Registration Applications Processed"}
                </span>
                <span className="text-sm text-muted-foreground">1,847</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                <span className="text-sm font-medium">
                  {isRTL ? "الشهادات المهنية المجددة" : "Professional Certificates Renewed"}
                </span>
                <span className="text-sm text-muted-foreground">567</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                <span className="text-sm font-medium">
                  {isRTL ? "التقييمات المهنية المكتملة" : "Professional Assessments Completed"}
                </span>
                <span className="text-sm text-muted-foreground">234</span>
              </div>
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg border">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="h-6 w-6 text-success" />
              <h3 className="text-lg font-semibold">
                {isRTL ? "حالة التكامل مع سند" : "SanadHR Integration Status"}
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">{isRTL ? "مزامنة البيانات" : "Data Synchronization"}</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span className="text-sm text-success">{isRTL ? "نشط" : "Active"}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">{isRTL ? "آخر مزامنة" : "Last Sync"}</span>
                <span className="text-sm text-muted-foreground">
                  {dateFormatters.date(new Date())}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">{isRTL ? "معدل نجاح المزامنة" : "Sync Success Rate"}</span>
                <span className="text-sm text-success">98.9%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">{isRTL ? "السجلات المزامنة" : "Records Synchronized"}</span>
                <span className="text-sm text-muted-foreground">1,847</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border mt-8">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="h-6 w-6 text-accent" />
            <h3 className="text-lg font-semibold">
              {isRTL ? "تقارير الاعتماد المهني" : "Professional Accreditation Reports"}
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded">
              <div className="text-2xl font-bold text-primary">1,847</div>
              <div className="text-sm text-muted-foreground">
                {isRTL ? "مهندسون مسجلون" : "Registered Engineers"}
              </div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded">
              <div className="text-2xl font-bold text-success">2,134</div>
              <div className="text-sm text-muted-foreground">
                {isRTL ? "شهادات نشطة" : "Active Certificates"}
              </div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded">
              <div className="text-2xl font-bold text-warning">23</div>
              <div className="text-sm text-muted-foreground">
                {isRTL ? "طلبات معلقة" : "Pending Applications"}
              </div>
            </div>
          </div>
        </div>
          </TabsContent>
          
          <TabsContent value="upload" className="space-y-6">
            <FileUploadSystem
              platform="saudi-engineering"
              moduleType="government"
              onFileProcessed={(file) => {
                setUploadedFiles(prev => [...prev, file]);
                toast({
                  title: isRTL ? "تم رفع الملف بنجاح" : "File uploaded successfully",
                  description: isRTL ? `تم رفع ${file.name} بنجاح` : `${file.name} uploaded successfully`
                });
              }}
              acceptedTypes={['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']}
              maxFileSize={10}
            />
          </TabsContent>
        </Tabs>
      </UnifiedGovernmentInterface>
    </FocusManager>
  );
};

export default SaudiEngineeringBody;