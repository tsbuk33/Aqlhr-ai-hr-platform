import { useLanguage } from "@/contexts/LanguageContext";
import { usePerformantLocalization } from "@/hooks/usePerformantLocalization";
import { MemoizedMetricCard } from "@/components/performance/MemoizedMetricCard";
import { FocusManager } from "@/components/accessibility/FocusManager";
import { ScreenReaderText } from "@/components/accessibility/ScreenReaderText";
import { UnifiedGovernmentInterface } from "@/components/government/UnifiedGovernmentInterface";
import { Activity, CheckCircle, Clock, Shield, FileText, Users, TrendingUp, Building, UserCheck, ClipboardCheck } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const CHIPlatform = () => {
  const { t, isRTL } = useLanguage();
  const { formatters, dateFormatters } = usePerformantLocalization();

  const handleTestConnection = async () => {
    toast({
      title: isRTL ? "اختبار اتصال مجلس الضمان الصحي" : "Testing CHI Connection",
      description: isRTL ? "جاري فحص الاتصال مع مجلس الضمان الصحي..." : "Testing connection with CHI platform..."
    });
    // Simulate API test with SanadHR integration
    await new Promise(resolve => setTimeout(resolve, 2000));
    toast({
      title: isRTL ? "تم الاتصال بنجاح" : "Connection Successful",
      description: isRTL ? "تم ربط مجلس الضمان الصحي مع سند الموارد البشرية بنجاح" : "CHI platform successfully connected with SanadHR"
    });
  };

  const handleSyncNow = async () => {
    toast({
      title: isRTL ? "مزامنة مجلس الضمان الصحي مع سند" : "CHI-SanadHR Sync",
      description: isRTL ? "جاري مزامنة بيانات التأمين الصحي والامتثال..." : "Syncing health insurance data and compliance information..."
    });
    // Simulate comprehensive sync with SanadHR
    await new Promise(resolve => setTimeout(resolve, 2500));
    toast({
      title: isRTL ? "اكتملت المزامنة" : "Sync Completed",
      description: isRTL ? "تم تحديث جميع بيانات التأمين الصحي في سند الموارد البشرية" : "All health insurance data updated in SanadHR system"
    });
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
                {isRTL ? "خدمات التأمين الصحي" : "Health Insurance Services"}
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                <span className="text-sm font-medium">
                  {isRTL ? "التحقق من التأمين" : "Insurance Verification"}
                </span>
                <span className="text-sm text-muted-foreground">15,678</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                <span className="text-sm font-medium">
                  {isRTL ? "استعلامات المطالبات" : "Claims Inquiries"}
                </span>
                <span className="text-sm text-muted-foreground">8,456</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                <span className="text-sm font-medium">
                  {isRTL ? "تقارير الامتثال" : "Compliance Reports"}
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
                <span className="text-sm text-success">98.7%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">{isRTL ? "السجلات المزامنة" : "Records Synchronized"}</span>
                <span className="text-sm text-muted-foreground">15,678</span>
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
      </UnifiedGovernmentInterface>
    </FocusManager>
  );
};

export default CHIPlatform;