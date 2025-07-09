import { useLanguage } from "@/contexts/LanguageContext";
import { UnifiedGovernmentInterface } from "@/components/government/UnifiedGovernmentInterface";
import { GraduationCap } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const TVTCIntegration = () => {
  const { t, isRTL } = useLanguage();

  const handleTestConnection = async () => {
    toast({
      title: isRTL ? "اختبار اتصال التدريب التقني" : "Testing TVTC Connection",
      description: isRTL ? "جاري فحص الاتصال..." : "Testing connection..."
    });
    await new Promise(resolve => setTimeout(resolve, 2000));
  };

  const handleSyncNow = async () => {
    toast({
      title: isRTL ? "مزامنة التدريب التقني" : "TVTC Sync",
      description: isRTL ? "جاري مزامنة البيانات..." : "Syncing data..."
    });
    await new Promise(resolve => setTimeout(resolve, 1500));
  };

  return (
    <UnifiedGovernmentInterface
      platformName="TVTC/Doroob Training Platform"
      platformNameAr="منصة التدريب التقني والمهني / دروب"
      description="Technical and vocational training certification"
      descriptionAr="شهادات التدريب التقني والمهني"
      icon={GraduationCap}
      connectionStatus={{
        status: 'connected',
        lastSync: '2024-01-15T06:10:00Z',
        responseTime: 180
      }}
      onTestConnection={handleTestConnection}
      onSyncNow={handleSyncNow}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 border rounded-lg bg-card">
          <h3 className="font-semibold text-lg mb-2">{t('government.certified_employees')}</h3>
          <div className="text-3xl font-bold text-brand-primary">1,247</div>
          <p className="text-sm text-muted-foreground mt-2">{isRTL ? 'موظف معتمد' : 'certified employees'}</p>
        </div>
        
        <div className="p-6 border rounded-lg bg-card">
          <h3 className="font-semibold text-lg mb-2">{t('government.active_programs')}</h3>
          <div className="text-3xl font-bold text-brand-success">45</div>
          <p className="text-sm text-muted-foreground mt-2">{isRTL ? 'برنامج تدريبي نشط' : 'active training programs'}</p>
        </div>
        
        <div className="p-6 border rounded-lg bg-card">
          <h3 className="font-semibold text-lg mb-2">{t('government.completion_rate')}</h3>
          <div className="text-3xl font-bold text-brand-accent">87.3%</div>
          <p className="text-sm text-muted-foreground mt-2">{isRTL ? 'معدل إكمال البرامج' : 'program completion rate'}</p>
        </div>
        
        <div className="p-6 border rounded-lg bg-card">
          <h3 className="font-semibold text-lg mb-2">{t('government.training_hours')}</h3>
          <div className="text-3xl font-bold text-brand-warning">12,456</div>
          <p className="text-sm text-muted-foreground mt-2">{isRTL ? 'ساعة تدريبية مكتملة' : 'training hours completed'}</p>
        </div>
      </div>
    </UnifiedGovernmentInterface>
  );
};

export default TVTCIntegration;