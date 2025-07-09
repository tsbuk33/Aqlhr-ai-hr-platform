import { useLanguage } from "@/contexts/LanguageContext";
import { UnifiedGovernmentInterface } from "@/components/government/UnifiedGovernmentInterface";
import { CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const AbsherPlatform = () => {
  const { t, isRTL } = useLanguage();

  const handleTestConnection = async () => {
    toast({
      title: isRTL ? "اختبار اتصال أبشر" : "Testing Absher Connection",
      description: isRTL ? "جاري فحص الاتصال..." : "Testing connection..."
    });
    await new Promise(resolve => setTimeout(resolve, 2000));
  };

  const handleSyncNow = async () => {
    toast({
      title: isRTL ? "مزامنة أبشر" : "Absher Sync",
      description: isRTL ? "جاري مزامنة البيانات..." : "Syncing data..."
    });
    await new Promise(resolve => setTimeout(resolve, 1500));
  };

  return (
    <UnifiedGovernmentInterface
      platformName="Absher Identity Platform"
      platformNameAr="منصة أبشر للهوية"
      description="National identity verification and digital services"
      descriptionAr="التحقق من الهوية الوطنية والخدمات الرقمية"
      icon={CheckCircle}
      connectionStatus={{
        status: 'connected',
        lastSync: '2024-01-15T11:15:00Z',
        responseTime: 95
      }}
      onTestConnection={handleTestConnection}
      onSyncNow={handleSyncNow}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 border rounded-lg bg-card">
          <h3 className="font-semibold text-lg mb-2">{t('government.verified_identities')}</h3>
          <div className="text-3xl font-bold text-brand-primary">2,847</div>
          <p className="text-sm text-muted-foreground mt-2">{isRTL ? 'هوية محققة' : 'verified identities'}</p>
        </div>
        
        <div className="p-6 border rounded-lg bg-card">
          <h3 className="font-semibold text-lg mb-2">{t('government.verification_rate')}</h3>
          <div className="text-3xl font-bold text-brand-success">99.7%</div>
          <p className="text-sm text-muted-foreground mt-2">{isRTL ? 'معدل نجاح التحقق' : 'verification success rate'}</p>
        </div>
        
        <div className="p-6 border rounded-lg bg-card">
          <h3 className="font-semibold text-lg mb-2">{t('government.api_calls')}</h3>
          <div className="text-3xl font-bold text-brand-accent">156,324</div>
          <p className="text-sm text-muted-foreground mt-2">{isRTL ? 'استعلام هذا الشهر' : 'API calls this month'}</p>
        </div>
        
        <div className="p-6 border rounded-lg bg-card">
          <h3 className="font-semibold text-lg mb-2">{t('government.response_time')}</h3>
          <div className="text-3xl font-bold text-brand-warning">95ms</div>
          <p className="text-sm text-muted-foreground mt-2">{isRTL ? 'متوسط زمن الاستجابة' : 'average response time'}</p>
        </div>
      </div>
    </UnifiedGovernmentInterface>
  );
};

export default AbsherPlatform;