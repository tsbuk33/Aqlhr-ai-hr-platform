import { useLanguage } from "@/contexts/LanguageContext";
import { UnifiedGovernmentInterface } from "@/components/government/UnifiedGovernmentInterface";
import { CreditCard } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const MudadPlatform = () => {
  const { t, isRTL } = useLanguage();

  const handleTestConnection = async () => {
    toast({
      title: isRTL ? "اختبار اتصال مداد" : "Testing Mudad Connection",
      description: isRTL ? "جاري فحص الاتصال..." : "Testing connection..."
    });
    await new Promise(resolve => setTimeout(resolve, 2000));
  };

  const handleSyncNow = async () => {
    toast({
      title: isRTL ? "مزامنة مداد" : "Mudad Sync", 
      description: isRTL ? "جاري مزامنة البيانات..." : "Syncing data..."
    });
    await new Promise(resolve => setTimeout(resolve, 1500));
  };

  return (
    <UnifiedGovernmentInterface
      platformName="Mudad (WPS) Platform"
      platformNameAr="منصة مداد لحماية الأجور"
      description="Wage Protection System for salary management"
      descriptionAr="نظام حماية الأجور لإدارة الرواتب"
      icon={CreditCard}
      connectionStatus={{
        status: 'connected',
        lastSync: '2024-01-15T08:30:00Z',
        responseTime: 230
      }}
      onTestConnection={handleTestConnection}
      onSyncNow={handleSyncNow}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 border rounded-lg bg-card">
          <h3 className="font-semibold text-lg mb-2">{t('government.monthly_salaries')}</h3>
          <div className="text-3xl font-bold text-brand-primary">247 {isRTL ? 'مليون ريال' : 'Million SAR'}</div>
          <p className="text-sm text-muted-foreground mt-2">{isRTL ? 'إجمالي الرواتب المحولة' : 'Total salaries transferred'}</p>
        </div>
        
        <div className="p-6 border rounded-lg bg-card">
          <h3 className="font-semibold text-lg mb-2">{t('government.active_employees')}</h3>
          <div className="text-3xl font-bold text-brand-success">2,847</div>
          <p className="text-sm text-muted-foreground mt-2">{isRTL ? 'موظف مسجل في النظام' : 'employees registered in system'}</p>
        </div>
        
        <div className="p-6 border rounded-lg bg-card">
          <h3 className="font-semibold text-lg mb-2">{t('government.compliance_rate')}</h3>
          <div className="text-3xl font-bold text-brand-accent">100%</div>
          <p className="text-sm text-muted-foreground mt-2">{isRTL ? 'معدل الامتثال لمداد' : 'WPS compliance rate'}</p>
        </div>
        
        <div className="p-6 border rounded-lg bg-card">
          <h3 className="font-semibold text-lg mb-2">{t('government.transfer_status')}</h3>
          <div className="text-3xl font-bold text-brand-warning">{isRTL ? 'نشط' : 'Active'}</div>
          <p className="text-sm text-muted-foreground mt-2">{isRTL ? 'حالة التحويلات الحالية' : 'Current transfer status'}</p>
        </div>
      </div>
    </UnifiedGovernmentInterface>
  );
};

export default MudadPlatform;