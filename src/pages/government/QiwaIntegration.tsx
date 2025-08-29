import { useLanguage } from "@/hooks/useLanguageCompat";
import { usePerformantLocalization } from "@/hooks/usePerformantLocalization";
import { MemoizedMetricCard } from "@/components/performance/MemoizedMetricCard";
import { FocusManager } from "@/components/accessibility/FocusManager";
import { ScreenReaderText } from "@/components/accessibility/ScreenReaderText";
import { UnifiedGovernmentInterface } from "@/components/government/UnifiedGovernmentInterface";
import { AqlAIFileProcessor } from "@/components/aql/AqlAIFileProcessor";
import { Activity, CheckCircle, Clock, Shield, Building2, Users, FileText, TrendingUp } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const QiwaIntegration = () => {
  const { t, isRTL } = useLanguage();
  const { formatters } = usePerformantLocalization();
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleTestConnection = async () => {
    toast({
      title: isRTL ? "اختبار اتصال قوى" : "Testing Qiwa Connection",
      description: isRTL ? "جاري فحص الاتصال مع منصة قوى..." : "Testing connection with Qiwa platform..."
    });
    // Simulate API test with SanadHR integration
    await new Promise(resolve => setTimeout(resolve, 2000));
    toast({
      title: isRTL ? "تم الاتصال بنجاح" : "Connection Successful",
      description: isRTL ? "تم ربط منصة قوى مع عقل الموارد البشرية بنجاح" : "Qiwa platform successfully connected with AqlHR"
    });
  };

  const handleSyncNow = async () => {
    toast({
      title: isRTL ? "مزامنة قوى مع عقل" : "Qiwa-AqlHR Sync",
      description: isRTL ? "جاري مزامنة بيانات الموظفين وعقود العمل..." : "Syncing employee data and work contracts..."
    });
    // Simulate comprehensive sync with SanadHR
    await new Promise(resolve => setTimeout(resolve, 2500));
    toast({
      title: isRTL ? "اكتملت المزامنة" : "Sync Completed",
      description: isRTL ? "تم تحديث جميع البيانات في عقل الموارد البشرية" : "All data updated in AqlHR system"
    });
  };

  return (
    <FocusManager autoFocus restoreFocus>
      <UnifiedGovernmentInterface
        platformName="Qiwa Platform Integration"
        platformNameAr="تكامل منصة قوى"
        description="Employment services, work permits, and Nitaqat compliance management"
        descriptionAr="خدمات التوظيف وتصاريح العمل وإدارة امتثال النطاقات"
        icon={Building2}
        connectionStatus={{
          status: 'connected',
          lastSync: '2024-01-15T10:30:00Z',
          responseTime: 145
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <MemoizedMetricCard
            title={isRTL ? "الموظفين النشطين" : "Active Employees"}
            value="2,847"
            description={`+12 ${isRTL ? 'هذا الشهر' : 'this month'}`}
            icon={<Users className="h-6 w-6" />}
            variant="primary"
            trend={{
              value: "12",
              isPositive: true
            }}
          />
          <MemoizedMetricCard
            title={isRTL ? "نسبة نجاح العمليات" : "Process Success Rate"}
            value="98.1%"
            description={isRTL ? "معاملات ناجحة عبر الواجهة البرمجية" : "Successful API transactions"}
            icon={<CheckCircle className="h-6 w-6" />}
            variant="success"
          />
          <MemoizedMetricCard
            title={isRTL ? "تصاريح العمل المعلقة" : "Pending Work Permits"}
            value="45"
            description={`-3 ${isRTL ? 'الشهر الماضي' : 'last month'}`}
            icon={<FileText className="h-6 w-6" />}
            variant="accent"
            trend={{
              value: "3",
              isPositive: true
            }}
          />
          <MemoizedMetricCard
            title={isRTL ? "درجة امتثال النطاقات" : "Nitaqat Compliance Score"}
            value="87.5%"
            description={isRTL ? "مستوى الامتثال الإجمالي" : "Overall compliance level"}
            icon={<TrendingUp className="h-6 w-6" />}
            variant="warning"
          />
        </div>

        {/* Additional SanadHR Integration Features */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 border rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5" />
              {isRTL ? "خدمات قوى المتصلة بعقل" : "Qiwa Services Connected to AqlHR"}
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                {isRTL ? "نقل الموظفين بين المنشآت" : "Employee Transfer Between Establishments"}
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                {isRTL ? "إصدار تأشيرات العمل الدائمة" : "Permanent Work Visa Issuance"}
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                {isRTL ? "حاسبة النطاقات" : "Nitaqat Calculator"}
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                {isRTL ? "توظيف الموظفين غير السعوديين" : "Non-Saudi Employee Hiring"}
              </li>
            </ul>
          </div>
          
          <div className="p-6 border rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5" />
              {isRTL ? "مزايا التكامل مع عقل" : "AqlHR Integration Benefits"}
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                {isRTL ? "مزامنة تلقائية للبيانات" : "Automated Data Synchronization"}
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                {isRTL ? "تحديث فوري لحالة التصاريح" : "Real-time Permit Status Updates"}
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                {isRTL ? "تقارير امتثال النطاقات" : "Nitaqat Compliance Reports"}
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                {isRTL ? "إدارة متكاملة للموارد البشرية" : "Integrated HR Management"}
              </li>
            </ul>
          </div>
        </div>
          </TabsContent>
          
          <TabsContent value="upload" className="space-y-6">
            <AqlAIFileProcessor
              platform="qiwa"
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

export default QiwaIntegration;