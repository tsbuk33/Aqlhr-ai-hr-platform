import { useLanguage } from "@/contexts/LanguageContext";
import { UnifiedGovernmentInterface } from "@/components/government/UnifiedGovernmentInterface";
import { Calculator } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const ZATCAIntegration = () => {
  const { t, isRTL } = useLanguage();

  const handleTestConnection = async () => {
    toast({
      title: isRTL ? "اختبار اتصال الزكاة والضريبة" : "Testing ZATCA Connection",
      description: isRTL ? "جاري فحص الاتصال..." : "Testing connection..."
    });
    await new Promise(resolve => setTimeout(resolve, 2000));
  };

  const handleSyncNow = async () => {
    toast({
      title: isRTL ? "مزامنة الزكاة والضريبة" : "ZATCA Sync",
      description: isRTL ? "جاري مزامنة البيانات..." : "Syncing data..."
    });
    await new Promise(resolve => setTimeout(resolve, 1500));
  };

  return (
    <UnifiedGovernmentInterface
      platformName="ZATCA Tax Integration"
      platformNameAr="تكامل هيئة الزكاة والضريبة"
      description="Tax compliance and e-invoicing system"
      descriptionAr="نظام الامتثال الضريبي والفوترة الإلكترونية"
      icon={Calculator}
      connectionStatus={{
        status: 'testing',
        lastSync: undefined,
        responseTime: undefined
      }}
      onTestConnection={handleTestConnection}
      onSyncNow={handleSyncNow}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 border rounded-lg bg-card">
          <h3 className="font-semibold text-lg mb-2">{t('government.tax_compliance')}</h3>
          <div className="text-3xl font-bold text-brand-primary">98.5%</div>
          <p className="text-sm text-muted-foreground mt-2">{isRTL ? 'معدل الامتثال الضريبي' : 'tax compliance rate'}</p>
        </div>
        
        <div className="p-6 border rounded-lg bg-card">
          <h3 className="font-semibold text-lg mb-2">{t('government.e_invoices')}</h3>
          <div className="text-3xl font-bold text-brand-success">156,324</div>
          <p className="text-sm text-muted-foreground mt-2">{isRTL ? 'فاتورة إلكترونية مرسلة' : 'e-invoices submitted'}</p>
        </div>
        
        <div className="p-6 border rounded-lg bg-card">
          <h3 className="font-semibold text-lg mb-2">{t('government.vat_returns')}</h3>
          <div className="text-3xl font-bold text-brand-accent">12</div>
          <p className="text-sm text-muted-foreground mt-2">{isRTL ? 'إقرار ضريبي مقدم' : 'VAT returns filed'}</p>
        </div>
        
        <div className="p-6 border rounded-lg bg-card">
          <h3 className="font-semibold text-lg mb-2">{t('government.tax_amount')}</h3>
          <div className="text-3xl font-bold text-brand-warning">2.4M {isRTL ? 'ريال' : 'SAR'}</div>
          <p className="text-sm text-muted-foreground mt-2">{isRTL ? 'إجمالي الضرائب المحصلة' : 'total tax collected'}</p>
        </div>
      </div>
    </UnifiedGovernmentInterface>
  );
};

export default ZATCAIntegration;