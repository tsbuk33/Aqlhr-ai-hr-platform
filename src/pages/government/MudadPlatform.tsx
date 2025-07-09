import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

const MudadPlatform = () => {
  const { t } = useLanguage();
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('government.mudad_platform')}</h1>
        <p className="text-muted-foreground">{t('government.mudad_desc')}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('government.monthly_reports')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">12/12</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('government.compliance_rate')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">100%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('government.processing_time')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">45 min</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('government.protected_wages')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">SAR 5.47M</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MudadPlatform;