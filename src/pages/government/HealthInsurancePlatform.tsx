import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

const HealthInsurancePlatform = () => {
  const { t } = useLanguage();
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('government.health_insurance')}</h1>
        <p className="text-muted-foreground">{t('government.health_insurance_desc')}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('government.coverage_rate')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">97.2%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('government.active_policies')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">1,247</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('government.monthly_premium')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">3,450 ريال</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('government.claims_processed')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">156</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HealthInsurancePlatform;