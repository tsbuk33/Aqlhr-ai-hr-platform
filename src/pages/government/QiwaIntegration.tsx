import { useLanguage } from "@/contexts/LanguageContext";
import { usePerformantLocalization } from "@/hooks/usePerformantLocalization";
import { MemoizedMetricCard } from "@/components/performance/MemoizedMetricCard";
import { FocusManager } from "@/components/accessibility/FocusManager";
import { ScreenReaderText } from "@/components/accessibility/ScreenReaderText";
import { UnifiedGovernmentInterface } from "@/components/government/UnifiedGovernmentInterface";
import { Activity, CheckCircle, Clock, Shield, Building2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const QiwaIntegration = () => {
  const { t, isRTL } = useLanguage();
  const { formatters } = usePerformantLocalization();

  const handleTestConnection = async () => {
    toast({
      title: isRTL ? "اختبار اتصال قوى" : "Testing Qiwa Connection",
      description: isRTL ? "جاري فحص الاتصال..." : "Testing connection..."
    });
    // Simulate API test
    await new Promise(resolve => setTimeout(resolve, 2000));
  };

  const handleSyncNow = async () => {
    toast({
      title: isRTL ? "مزامنة قوى" : "Qiwa Sync",
      description: isRTL ? "جاري مزامنة البيانات..." : "Syncing data..."
    });
    // Simulate sync
    await new Promise(resolve => setTimeout(resolve, 1500));
  };

  return (
    <FocusManager autoFocus restoreFocus>
      <UnifiedGovernmentInterface
        platformName="Qiwa Integration"
        platformNameAr="تكامل قوى"
        description="Employment contracts and work permits management"
        descriptionAr="إدارة عقود العمل وتصاريح العمل"
        icon={Building2}
        connectionStatus={{
          status: 'connected',
          lastSync: '2024-01-15T10:30:00Z',
          responseTime: 145
        }}
        onTestConnection={handleTestConnection}
        onSyncNow={handleSyncNow}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <MemoizedMetricCard
            title={t('government.active_contracts')}
            value={2847}
            description={`+${formatters.number(12)} ${t('common.this_month')}`}
            icon={<Activity className="h-6 w-6" />}
            type="number"
            variant="primary"
            trend={{
              value: 12,
              isPositive: true
            }}
          />
          <MemoizedMetricCard
            title={t('government.processing_success')}
            value={98.1}
            description={t('government.successful_api_calls')}
            icon={<CheckCircle className="h-6 w-6" />}
            type="percentage"
            variant="success"
          />
          <MemoizedMetricCard
            title={t('government.monthly_transfers')}
            value={45}
            description={`-${formatters.number(3)} ${t('common.last_month')}`}
            icon={<Clock className="h-6 w-6" />}
            type="number"
            variant="accent"
            trend={{
              value: 3,
              isPositive: false
            }}
          />
          <MemoizedMetricCard
            title={t('government.compliance_score')}
            value={100}
            description={t('government.overall_compliance')}
            icon={<Shield className="h-6 w-6" />}
            type="percentage"
            variant="warning"
          />
        </div>
      </UnifiedGovernmentInterface>
    </FocusManager>
  );
};

export default QiwaIntegration;