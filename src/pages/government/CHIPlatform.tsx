import { useLanguage } from "@/hooks/useLanguageCompat";
import { usePerformantLocalization } from "@/hooks/usePerformantLocalization";
import { MemoizedMetricCard } from "@/components/performance/MemoizedMetricCard";
import { FocusManager } from "@/components/accessibility/FocusManager";
import { ScreenReaderText } from "@/components/accessibility/ScreenReaderText";
import { UnifiedGovernmentInterface } from "@/components/government/UnifiedGovernmentInterface";
import { UniversalDocumentManager } from "@/components/common/UniversalDocumentManager";
import { Activity, CheckCircle, Clock, Shield, FileText, Users, TrendingUp, Building, UserCheck, ClipboardCheck } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CHIPlatform = () => {
  const { t, isRTL } = useLanguage();
  const { formatters, dateFormatters } = usePerformantLocalization();
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleTestConnection = async () => {
    toast({
      title: isRTL ? "اختبار اتصال مجلس الضمان الصحي" : "Testing CHI Connection",
      description: isRTL ? "جاري فحص الاتصال مع مجلس الضمان الصحي..." : "Testing connection with CHI platform..."
    });
    
    try {
      // Call CHI integration edge function
      const { data, error } = await supabase.functions.invoke('chi-integration');
      
      if (error) throw error;
      
      toast({
        title: isRTL ? "تم الاتصال بنجاح" : "Connection Successful",
        description: isRTL ? "تم ربط مجلس الضمان الصحي مع سند الموارد البشرية بنجاح" : "CHI platform successfully connected with SanadHR"
      });
    } catch (error) {
      toast({
        title: isRTL ? "فشل في الاتصال" : "Connection Failed",
        description: isRTL ? "حدث خطأ أثناء الاتصال بمجلس الضمان الصحي" : "Error connecting to CHI platform"
      });
    }
  };

  const handleSyncNow = async () => {
    toast({
      title: isRTL ? "مزامنة مجلس الضمان الصحي مع سند" : "CHI-SanadHR Sync",
      description: isRTL ? "جاري مزامنة بيانات التأمين الصحي والامتثال..." : "Syncing health insurance data and compliance information..."
    });
    
    try {
      // Call CHI integration for compliance check
      const { data, error } = await supabase.functions.invoke('chi-integration', {
        body: { 
          action: 'compliance_check',
          company_id: 'sample-company-id',
          check_type: 'full_audit'
        }
      });
      
      if (error) throw error;
      
      toast({
        title: isRTL ? "اكتملت المزامنة" : "Sync Completed",
        description: isRTL ? "تم تحديث جميع بيانات التأمين الصحي في سند الموارد البشرية" : "All health insurance data updated in SanadHR system"
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
        platformName="CHI Platform Integration"
        platformNameAr="تكامل مجلس الضمان الصحي"
        description="Health insurance regulation, compliance monitoring, and digital transformation"
        descriptionAr="تنظيم التأمين الصحي ومراقبة الامتثال والتحول الرقمي"
        icon={Shield}
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
            <ScreenReaderText>{isRTL ? "إحصائيات تكامل مجلس الضمان الصحي" : "CHI health insurance platform integration statistics"}</ScreenReaderText>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <MemoizedMetricCard
            title={isRTL ? "شركات التأمين المسجلة" : "Registered Insurance Companies"}
            value="34"
            description={`+2 ${isRTL ? 'هذا الشهر' : 'this month'}`}
            icon={<Building className="h-6 w-6" />}
            variant="primary"
            trend={{
              value: "2",
              isPositive: true
            }}
          />
          <MemoizedMetricCard
            title={isRTL ? "نسبة نجاح العمليات" : "Process Success Rate"}
            value="98.7%"
            description={isRTL ? "معاملات ناجحة عبر الواجهة البرمجية" : "Successful API transactions"}
            icon={<CheckCircle className="h-6 w-6" />}
            variant="success"
          />
          <MemoizedMetricCard
            title={isRTL ? "المطالبات المعالجة" : "Claims Processed"}
            value="15,678"
            description={`+1,234 ${isRTL ? 'الشهر الماضي' : 'last month'}`}
            icon={<ClipboardCheck className="h-6 w-6" />}
            variant="accent"
            trend={{
              value: "1,234",
              isPositive: true
            }}
          />
          <MemoizedMetricCard
            title={isRTL ? "معدل الامتثال" : "Compliance Rate"}
            value="94.2%"
            description={isRTL ? "نسبة الامتثال العامة" : "Overall compliance percentage"}
            icon={<UserCheck className="h-6 w-6" />}
            variant="warning"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <div className="bg-card p-6 rounded-lg border">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-semibold">
                {isRTL ? "خدمات CHI الرئيسية" : "Core CHI Services"}
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {isRTL ? "الاستعلام عن معلومات التأمين" : "Insurance Information Inquiry"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {isRTL ? "التحقق من تفاصيل التأمين للموظفين" : "Verify employee insurance details"}
                  </span>
                </div>
                <span className="text-sm text-success">{isRTL ? "نشط" : "Active"}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {isRTL ? "إدارة المطالبات الصحية" : "Claims Processing Management"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {isRTL ? "معالجة ومتابعة المطالبات الطبية" : "Process and track medical claims"}
                  </span>
                </div>
                <span className="text-sm text-success">{isRTL ? "نشط" : "Active"}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {isRTL ? "شبكة مقدمي الخدمة" : "Provider Network Management"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {isRTL ? "إدارة شبكة مقدمي الرعاية الصحية" : "Manage healthcare provider network"}
                  </span>
                </div>
                <span className="text-sm text-success">{isRTL ? "نشط" : "Active"}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {isRTL ? "مراقبة الامتثال التنظيمي" : "Regulatory Compliance Monitoring"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {isRTL ? "ضمان الامتثال للوائح التأمين الصحي" : "Ensure health insurance regulatory compliance"}
                  </span>
                </div>
                <span className="text-sm text-success">{isRTL ? "نشط" : "Active"}</span>
              </div>
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg border">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="h-6 w-6 text-success" />
              <h3 className="text-lg font-semibold">
                {isRTL ? "تكامل CHI مع سند الموارد البشرية" : "CHI-SanadHR Integration"}
              </h3>
            </div>
            <div className="space-y-4">
              <div className="p-3 bg-primary/5 border border-primary/20 rounded">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">
                    {isRTL ? "بيانات الموظفين" : "Employee Data"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {isRTL ? "مزامنة تلقائية لبيانات التأمين الصحي مع ملفات الموظفين" : "Auto-sync health insurance data with employee profiles"}
                </p>
              </div>
              <div className="p-3 bg-success/5 border border-success/20 rounded">
                <div className="flex items-center gap-2 mb-2">
                  <ClipboardCheck className="h-4 w-4 text-success" />
                  <span className="text-sm font-medium text-success">
                    {isRTL ? "إدارة المزايا" : "Benefits Administration"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {isRTL ? "حساب تلقائي لأقساط التأمين في كشوف المرتبات" : "Automatic insurance premium calculations in payroll"}
                </p>
              </div>
              <div className="p-3 bg-accent/5 border border-accent/20 rounded">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-accent" />
                  <span className="text-sm font-medium text-accent">
                    {isRTL ? "تقارير الامتثال" : "Compliance Reporting"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {isRTL ? "تقارير آلية لحالة الامتثال التنظيمي" : "Automated regulatory compliance status reports"}
                </p>
              </div>
              <div className="p-3 bg-warning/5 border border-warning/20 rounded">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-warning" />
                  <span className="text-sm font-medium text-warning">
                    {isRTL ? "تحليلات التكلفة" : "Cost Analytics"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {isRTL ? "مراقبة تكاليف الرعاية الصحية واتجاهاتها" : "Monitor healthcare costs and trends"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border mt-8">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="h-6 w-6 text-accent" />
            <h3 className="text-lg font-semibold">
              {isRTL ? "تقارير التنظيم والامتثال" : "Regulatory & Compliance Reports"}
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded">
              <div className="text-2xl font-bold text-primary">34</div>
              <div className="text-sm text-muted-foreground">
                {isRTL ? "شركات التأمين" : "Insurance Companies"}
              </div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded">
              <div className="text-2xl font-bold text-success">15,678</div>
              <div className="text-sm text-muted-foreground">
                {isRTL ? "مطالبات معالجة" : "Claims Processed"}
              </div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded">
              <div className="text-2xl font-bold text-warning">94.2%</div>
              <div className="text-sm text-muted-foreground">
                {isRTL ? "معدل الامتثال" : "Compliance Rate"}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border mt-8">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="h-6 w-6 text-success" />
            <h3 className="text-lg font-semibold">
              {isRTL ? "الأداء والإحصائيات" : "Performance & Statistics"}
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-muted/30 rounded">
              <div className="text-xl font-semibold text-accent">2.3M</div>
              <div className="text-xs text-muted-foreground">
                {isRTL ? "مستفيدين مسجلين" : "Registered Beneficiaries"}
              </div>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded">
              <div className="text-xl font-semibold text-primary">876</div>
              <div className="text-xs text-muted-foreground">
                {isRTL ? "مقدمو خدمات" : "Service Providers"}
              </div>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded">
              <div className="text-xl font-semibold text-success">99.1%</div>
              <div className="text-xs text-muted-foreground">
                {isRTL ? "وقت التشغيل" : "Uptime"}
              </div>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded">
              <div className="text-xl font-semibold text-warning">156ms</div>
              <div className="text-xs text-muted-foreground">
                {isRTL ? "زمن الاستجابة" : "Response Time"}
              </div>
            </div>
          </div>
        </div>
          </TabsContent>
          
          <TabsContent value="upload" className="space-y-6">
            <UniversalDocumentManager
              moduleName="CHI Health Insurance Platform"
              moduleNameAr="منصة مجلس الضمان الصحي"
              description="Upload health insurance documents, claims, policy documents, and compliance files"
              descriptionAr="رفع وثائق التأمين الصحي والمطالبات ووثائق السياسات وملفات الامتثال"
              platform="chi"
              moduleType="government"
              acceptedTypes={['.pdf', '.xlsx', '.xls', '.doc', '.docx', '.jpg', '.jpeg', '.png']}
              maxFileSize={25 * 1024 * 1024}
              maxFiles={35}
            />
          </TabsContent>
        </Tabs>
      </UnifiedGovernmentInterface>
    </FocusManager>
  );
};

export default CHIPlatform;