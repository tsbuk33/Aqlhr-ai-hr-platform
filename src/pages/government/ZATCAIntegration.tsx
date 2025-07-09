import { useLanguage } from "@/contexts/LanguageContext";
import { UnifiedGovernmentInterface } from "@/components/government/UnifiedGovernmentInterface";
import { Calculator, FileText, CreditCard, Building, CheckCircle, Activity } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ZATCAIntegration = () => {
  const { t, isRTL } = useLanguage();

  const handleTestConnection = async () => {
    toast({
      title: isRTL ? "اختبار اتصال هيئة الزكاة والضريبة والجمارك" : "Testing ZATCA Connection",
      description: isRTL ? "جاري فحص الاتصال مع الأنظمة الضريبية..." : "Testing connection with tax systems..."
    });
    await new Promise(resolve => setTimeout(resolve, 2000));
  };

  const handleSyncNow = async () => {
    toast({
      title: isRTL ? "مزامنة هيئة الزكاة والضريبة والجمارك" : "ZATCA Sync",
      description: isRTL ? "جاري مزامنة البيانات الضريبية والزكوية..." : "Syncing tax and zakat data..."
    });
    await new Promise(resolve => setTimeout(resolve, 1500));
  };

  return (
    <UnifiedGovernmentInterface
      platformName="ZATCA Integration"
      platformNameAr="تكامل هيئة الزكاة والضريبة والجمارك"
      description="Zakat, Tax and Customs Authority Integration"
      descriptionAr="التكامل مع هيئة الزكاة والضريبة والجمارك"
      icon={Calculator}
      connectionStatus={{
        status: 'connected',
        lastSync: '2024-01-15T14:30:00Z',
        responseTime: 120
      }}
      onTestConnection={handleTestConnection}
      onSyncNow={handleSyncNow}
    >
      {/* Main KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="p-6 border rounded-lg bg-card">
          <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {isRTL ? 'ضريبة القيمة المضافة' : 'VAT Compliance'}
          </h3>
          <div className="text-3xl font-bold text-brand-primary">98.5%</div>
          <p className="text-sm text-muted-foreground mt-2">{isRTL ? 'معدل الامتثال لضريبة القيمة المضافة' : 'VAT compliance rate'}</p>
        </div>
        
        <div className="p-6 border rounded-lg bg-card">
          <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            {isRTL ? 'الفوترة الإلكترونية' : 'E-Invoicing'}
          </h3>
          <div className="text-3xl font-bold text-brand-success">156,324</div>
          <p className="text-sm text-muted-foreground mt-2">{isRTL ? 'فاتورة إلكترونية مرسلة' : 'e-invoices submitted'}</p>
        </div>
        
        <div className="p-6 border rounded-lg bg-card">
          <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            {isRTL ? 'ضريبة الاستقطاع' : 'Withholding Tax'}
          </h3>
          <div className="text-3xl font-bold text-brand-accent">12,456</div>
          <p className="text-sm text-muted-foreground mt-2">{isRTL ? 'إقرار ضريبة استقطاع' : 'withholding tax returns'}</p>
        </div>
        
        <div className="p-6 border rounded-lg bg-card">
          <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
            <Building className="h-5 w-5" />
            {isRTL ? 'الزكاة المؤسسية' : 'Corporate Zakat'}
          </h3>
          <div className="text-3xl font-bold text-brand-warning">2.4M {isRTL ? 'ريال' : 'SAR'}</div>
          <p className="text-sm text-muted-foreground mt-2">{isRTL ? 'إجمالي الزكاة المحصلة' : 'total zakat collected'}</p>
        </div>
      </div>

      {/* SanadHR Integration Section */}
      <Card className="border-2 border-dashed border-primary/20 bg-gradient-to-r from-primary/5 to-success/5 mb-6">
        <CardHeader>
          <CardTitle className="text-primary flex items-center gap-2">
            <Calculator className="h-6 w-6" />
            {isRTL ? 'التكامل المباشر مع سند الموارد البشرية - النظام الضريبي' : 'Direct SanadHR Integration - Tax System'}
          </CardTitle>
          <CardDescription>
            {isRTL ? 
              'تزامن تلقائي ثنائي الاتجاه مع نظام الرواتب لضمان الامتثال الكامل للأنظمة الضريبية والزكوية' :
              'Bi-directional automatic sync with payroll system ensuring full tax and zakat compliance'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-primary flex items-center gap-2">
                <Activity className="h-4 w-4" />
                {isRTL ? 'الخدمات الضريبية المتكاملة' : 'Integrated Tax Services'}
              </h4>
              
              <div className="space-y-3">
                <div className="p-3 bg-primary/5 rounded-lg border-l-4 border-l-primary">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {isRTL ? 'ضريبة القيمة المضافة (VAT)' : 'Value Added Tax (VAT)'}
                    </span>
                    <Badge className="bg-status-success text-white">
                      {isRTL ? 'متصل' : 'Connected'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isRTL ? 
                      'تطبيق تلقائي لضريبة القيمة المضافة على الفواتير والمدفوعات' : 
                      'Automatic VAT application on invoices and payments'
                    }
                  </p>
                </div>

                <div className="p-3 bg-success/5 rounded-lg border-l-4 border-l-success">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {isRTL ? 'ضريبة الاستقطاع (WHT)' : 'Withholding Tax (WHT)'}
                    </span>
                    <Badge className="bg-status-success text-white">
                      {isRTL ? 'نشط' : 'Active'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isRTL ? 
                      'حساب واستقطاع الضرائب تلقائياً من المدفوعات للموردين' : 
                      'Automatic tax calculation and withholding from supplier payments'
                    }
                  </p>
                </div>

                <div className="p-3 bg-warning/5 rounded-lg border-l-4 border-l-warning">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {isRTL ? 'الفوترة الإلكترونية (E-Invoicing)' : 'E-Invoicing Integration'}
                    </span>
                    <Badge className="bg-status-warning text-white">
                      {isRTL ? 'مجدول' : 'Scheduled'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isRTL ? 
                      'إرسال الفواتير الإلكترونية تلقائياً إلى منصة فاتورة' : 
                      'Automatic e-invoice submission to Fatoorah platform'
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-success flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                {isRTL ? 'الخدمات الزكوية والجمركية' : 'Zakat & Customs Services'}
              </h4>
              
              <div className="p-4 bg-success/10 rounded-lg border border-success/20">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {isRTL ? 'الزكاة الشركات' : 'Corporate Zakat'}
                    </span>
                    <Badge className="bg-success text-white">
                      {isRTL ? 'محسوب تلقائياً' : 'Auto-calculated'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {isRTL ? 'ضريبة التصرفات العقارية' : 'Real Estate Transaction Tax'}
                    </span>
                    <Badge className="bg-primary text-white">
                      {isRTL ? 'متاح' : 'Available'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {isRTL ? 'الضريبة الانتقائية' : 'Excise Tax'}
                    </span>
                    <Badge className="bg-accent text-white">
                      {isRTL ? 'مطبق' : 'Applied'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </UnifiedGovernmentInterface>
  );
};

export default ZATCAIntegration;