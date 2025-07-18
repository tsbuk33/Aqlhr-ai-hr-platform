import { useLanguage } from "@/hooks/useLanguageCompat";
import { usePerformantLocalization } from "@/hooks/usePerformantLocalization";
import { MemoizedMetricCard } from "@/components/performance/MemoizedMetricCard";
import { FocusManager } from "@/components/accessibility/FocusManager";
import { ScreenReaderText } from "@/components/accessibility/ScreenReaderText";
import { UnifiedGovernmentInterface } from "@/components/government/UnifiedGovernmentInterface";
import { AqlAIFileProcessor } from "@/components/aql/AqlAIFileProcessor";
import { Activity, CheckCircle, Clock, Shield, GraduationCap, Users, FileText, TrendingUp, Award, BookOpen } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const QiyasAssessment = () => {
  const { t, isRTL } = useLanguage();
  const { formatters, dateFormatters } = usePerformantLocalization();
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleTestConnection = async () => {
    toast({
      title: isRTL ? "اختبار اتصال قياس" : "Testing Qiyas Connection",
      description: isRTL ? "جاري فحص الاتصال مع منصة قياس..." : "Testing connection with Qiyas platform..."
    });
    
    try {
      // Call Qiyas integration edge function
      const { data, error } = await supabase.functions.invoke('qiyas-integration');
      
      if (error) throw error;
      
      toast({
        title: isRTL ? "تم الاتصال بنجاح" : "Connection Successful",
        description: isRTL ? "تم ربط منصة قياس مع سند الموارد البشرية بنجاح" : "Qiyas platform successfully connected with SanadHR"
      });
    } catch (error) {
      toast({
        title: isRTL ? "فشل في الاتصال" : "Connection Failed",
        description: isRTL ? "حدث خطأ أثناء الاتصال بمنصة قياس" : "Error connecting to Qiyas platform"
      });
    }
  };

  const handleSyncNow = async () => {
    toast({
      title: isRTL ? "مزامنة قياس مع سند" : "Qiyas-SanadHR Sync",
      description: isRTL ? "جاري مزامنة نتائج التقييمات والشهادات..." : "Syncing assessment results and certificates..."
    });
    
    try {
      // Call Qiyas integration for assessment sync
      const { data, error } = await supabase.functions.invoke('qiyas-integration', {
        body: { 
          action: 'sync_assessments',
          employee_id: 'sample-employee-id',
          assessment_type: 'professional_certification'
        }
      });
      
      if (error) throw error;
      
      toast({
        title: isRTL ? "اكتملت المزامنة" : "Sync Completed",
        description: isRTL ? "تم تحديث جميع بيانات التقييمات في سند الموارد البشرية" : "All assessment data updated in SanadHR system"
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
        platformName="Qiyas Assessment Platform Integration"
        platformNameAr="تكامل منصة قياس للتقييم"
        description="Professional assessments, certification programs, and skills evaluation"
        descriptionAr="التقييمات المهنية وبرامج الشهادات وتقييم المهارات"
        icon={GraduationCap}
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
            <ScreenReaderText>{isRTL ? "إحصائيات تكامل منصة قياس للتقييم" : "Qiyas assessment platform integration statistics"}</ScreenReaderText>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <MemoizedMetricCard
            title={isRTL ? "التقييمات المكتملة" : "Completed Assessments"}
            value="2,847"
            description={`+123 ${isRTL ? 'هذا الشهر' : 'this month'}`}
            icon={<BookOpen className="h-6 w-6" />}
            variant="primary"
            trend={{
              value: "123",
              isPositive: true
            }}
          />
          <MemoizedMetricCard
            title={isRTL ? "نسبة نجاح العمليات" : "Process Success Rate"}
            value="98.9%"
            description={isRTL ? "معاملات ناجحة عبر الواجهة البرمجية" : "Successful API transactions"}
            icon={<CheckCircle className="h-6 w-6" />}
            variant="success"
          />
          <MemoizedMetricCard
            title={isRTL ? "الشهادات الصادرة" : "Certificates Issued"}
            value="1,923"
            description={`+89 ${isRTL ? 'الشهر الماضي' : 'last month'}`}
            icon={<Award className="h-6 w-6" />}
            variant="accent"
            trend={{
              value: "89",
              isPositive: true
            }}
          />
          <MemoizedMetricCard
            title={isRTL ? "معدل النجاح" : "Success Rate"}
            value="87.3%"
            description={isRTL ? "نسبة نجاح التقييمات" : "Assessment success rate"}
            icon={<TrendingUp className="h-6 w-6" />}
            variant="warning"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <div className="bg-card p-6 rounded-lg border">
            <div className="flex items-center gap-3 mb-4">
              <GraduationCap className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-semibold">
                {isRTL ? "خدمات التقييم المهني" : "Professional Assessment Services"}
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                <span className="text-sm font-medium">
                  {isRTL ? "تقييمات الكفاءة المهنية" : "Professional Competency Assessments"}
                </span>
                <span className="text-sm text-muted-foreground">1,234</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                <span className="text-sm font-medium">
                  {isRTL ? "الاختبارات التخصصية" : "Specialized Examinations"}
                </span>
                <span className="text-sm text-muted-foreground">892</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                <span className="text-sm font-medium">
                  {isRTL ? "شهادات معتمدة" : "Certified Credentials"}
                </span>
                <span className="text-sm text-muted-foreground">1,923</span>
              </div>
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg border">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="h-6 w-6 text-success" />
              <h3 className="text-lg font-semibold">
                {isRTL ? "تكامل قياس مع سند الموارد البشرية" : "Qiyas-SanadHR Integration"}
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
                <span className="text-sm text-muted-foreground">2,847</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border mt-8">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="h-6 w-6 text-accent" />
            <h3 className="text-lg font-semibold">
              {isRTL ? "تقارير التقييم والشهادات" : "Assessment & Certificate Reports"}
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded">
              <div className="text-2xl font-bold text-primary">2,847</div>
              <div className="text-sm text-muted-foreground">
                {isRTL ? "تقييمات مكتملة" : "Completed Assessments"}
              </div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded">
              <div className="text-2xl font-bold text-success">1,923</div>
              <div className="text-sm text-muted-foreground">
                {isRTL ? "شهادات صادرة" : "Certificates Issued"}
              </div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded">
              <div className="text-2xl font-bold text-warning">87.3%</div>
              <div className="text-sm text-muted-foreground">
                {isRTL ? "معدل النجاح" : "Success Rate"}
              </div>
            </div>
          </div>
        </div>
          </TabsContent>
          
          <TabsContent value="upload" className="space-y-6">
            <AqlAIFileProcessor
              platform="qiyas"
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

export default QiyasAssessment;