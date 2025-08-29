import { useLanguage } from "@/hooks/useLanguageCompat";
import { usePerformantLocalization } from "@/hooks/usePerformantLocalization";
import { MemoizedMetricCard } from "@/components/performance/MemoizedMetricCard";
import { FocusManager } from "@/components/accessibility/FocusManager";
import { ScreenReaderText } from "@/components/accessibility/ScreenReaderText";
import { UnifiedGovernmentInterface } from "@/components/government/UnifiedGovernmentInterface";
import { AqlAIFileProcessor } from "@/components/aql/AqlAIFileProcessor";
import { Activity, CheckCircle, Clock, Shield, Heart, Users, FileText, TrendingUp, Stethoscope, Pill } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SehaPlatform = () => {
  const { t, isRTL } = useLanguage();
  const { formatters, dateFormatters } = usePerformantLocalization();
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleTestConnection = async () => {
    toast({
      title: isRTL ? "اختبار اتصال صحة" : "Testing Seha Connection",
      description: isRTL ? "جاري فحص الاتصال مع منصة صحة..." : "Testing connection with Seha platform..."
    });
    
    try {
      // Call Seha integration edge function
      const { data, error } = await supabase.functions.invoke('seha-integration');
      
      if (error) throw error;
      
      toast({
        title: isRTL ? "تم الاتصال بنجاح" : "Connection Successful", 
        description: isRTL ? "تم ربط منصة صحة مع عقل الموارد البشرية بنجاح" : "Seha platform successfully connected with AqlHR"
      });
    } catch (error) {
      toast({
        title: isRTL ? "فشل في الاتصال" : "Connection Failed",
        description: isRTL ? "حدث خطأ أثناء الاتصال بمنصة صحة" : "Error connecting to Seha platform"
      });
    }
  };

  const handleSyncNow = async () => {
    toast({
      title: isRTL ? "مزامنة صحة مع عقل" : "Seha-AqlHR Sync",
      description: isRTL ? "جاري مزامنة بيانات التأمين الصحي والوصفات الطبية..." : "Syncing health insurance data and medical prescriptions..."
    });
    
    try {
      // Call Seha integration for health data sync
      const { data, error } = await supabase.functions.invoke('seha-integration', {
        body: { 
          action: 'sync_health_data',
          employee_id: 'sample-employee-id',
          health_data: { sync_type: 'full_sync' }
        }
      });
      
      if (error) throw error;
      
      toast({
        title: isRTL ? "اكتملت المزامنة" : "Sync Completed",
        description: isRTL ? "تم تحديث جميع البيانات الصحية في عقل الموارد البشرية" : "All health data updated in AqlHR system"
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
        platformName="Seha Platform Integration"
        platformNameAr="تكامل منصة صحة"
        description="Healthcare services, electronic prescriptions, and medical insurance management"
        descriptionAr="الخدمات الصحية والوصفات الإلكترونية وإدارة التأمين الطبي"
        icon={Heart}
        connectionStatus={{
          status: 'connected',
          lastSync: '2024-01-15T10:30:00Z'
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
            <ScreenReaderText>{isRTL ? "إحصائيات تكامل منصة صحة الصحية" : "Seha healthcare platform integration statistics"}</ScreenReaderText>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <MemoizedMetricCard
            title={isRTL ? "الموظفين المؤمنين" : "Insured Employees"}
            value="2,847"
            description={`+25 ${isRTL ? 'هذا الشهر' : 'this month'}`}
            icon={<Users className="h-6 w-6" />}
            variant="primary"
            trend={{
              value: "25",
              isPositive: true
            }}
          />
          <MemoizedMetricCard
            title={isRTL ? "نسبة نجاح العمليات" : "Process Success Rate"}
            value="99.2%"
            description={isRTL ? "معاملات ناجحة عبر الواجهة البرمجية" : "Successful API transactions"}
            icon={<CheckCircle className="h-6 w-6" />}
            variant="success"
          />
          <MemoizedMetricCard
            title={isRTL ? "الوصفات الإلكترونية" : "Electronic Prescriptions"}
            value="1,234"
            description={`+89 ${isRTL ? 'الشهر الماضي' : 'last month'}`}
            icon={<Pill className="h-6 w-6" />}
            variant="accent"
            trend={{
              value: "89",
              isPositive: true
            }}
          />
          <MemoizedMetricCard
            title={isRTL ? "تغطية التأمين الصحي" : "Health Insurance Coverage"}
            value="96.8%"
            description={isRTL ? "نسبة الموظفين المغطيين" : "Employee coverage rate"}
            icon={<Shield className="h-6 w-6" />}
            variant="warning"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <div className="bg-card p-6 rounded-lg border">
            <div className="flex items-center gap-3 mb-4">
              <Stethoscope className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-semibold">
                {isRTL ? "خدمات الرعاية الصحية" : "Healthcare Services"}
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                <span className="text-sm font-medium">
                  {isRTL ? "الوصفات الإلكترونية المعالجة" : "Electronic Prescriptions Processed"}
                </span>
                <span className="text-sm text-muted-foreground">1,234</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                <span className="text-sm font-medium">
                  {isRTL ? "الفحوصات الطبية المجدولة" : "Scheduled Medical Checkups"}
                </span>
                <span className="text-sm text-muted-foreground">87</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                <span className="text-sm font-medium">
                  {isRTL ? "تقارير طبية" : "Medical Reports"}
                </span>
                <span className="text-sm text-muted-foreground">456</span>
              </div>
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg border">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="h-6 w-6 text-success" />
              <h3 className="text-lg font-semibold">
                {isRTL ? "حالة التكامل مع عقل" : "AqlHR Integration Status"}
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
                <span className="text-sm text-success">99.2%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">{isRTL ? "السجلات المزامنة" : "Records Synchronized"}</span>
                <span className="text-sm text-muted-foreground">2,847</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border mt-8">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="h-6 w-6 text-accent" />
            <h3 className="text-lg font-semibold">
              {isRTL ? "تقارير التأمين الصحي" : "Health Insurance Reports"}
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded">
              <div className="text-2xl font-bold text-primary">96.8%</div>
              <div className="text-sm text-muted-foreground">
                {isRTL ? "تغطية التأمين" : "Insurance Coverage"}
              </div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded">
              <div className="text-2xl font-bold text-success">1,234</div>
              <div className="text-sm text-muted-foreground">
                {isRTL ? "مطالبات مقبولة" : "Approved Claims"}
              </div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded">
              <div className="text-2xl font-bold text-warning">45</div>
              <div className="text-sm text-muted-foreground">
                {isRTL ? "مطالبات معلقة" : "Pending Claims"}
              </div>
            </div>
          </div>
        </div>
          </TabsContent>
          
          <TabsContent value="upload" className="space-y-6">
            <AqlAIFileProcessor
              platform="seha"
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

export default SehaPlatform;