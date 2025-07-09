import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";

const MedicalInsurancePlatform = () => {
  const { t } = useLanguage();
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('government.medical_insurance')}</h1>
          <p className="text-muted-foreground">{t('government.medical_insurance_desc')}</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-status-success text-white">{t('common.active')}</Badge>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('government.coverage_rate')}</CardTitle>
            <CardDescription>{t('government.employee_coverage_percentage')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">97.2%</div>
            <Progress value={97.2} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('government.active_policies')}</CardTitle>
            <CardDescription>{t('government.current_insurance_policies')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">1,247</div>
            <p className="text-xs text-muted-foreground mt-2">+15 {t('common.this_month')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('government.monthly_premium')}</CardTitle>
            <CardDescription>{t('government.average_monthly_cost')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">3,450 {t('common.sar')}</div>
            <Badge className="mt-2 bg-status-info text-white">{t('government.per_employee')}</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('government.claims_processed')}</CardTitle>
            <CardDescription>{t('government.monthly_claims_handled')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">156</div>
            <p className="text-xs text-muted-foreground mt-2">98.5% {t('government.approved')}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('government.insurance_providers')}</CardTitle>
            <CardDescription>{t('government.contracted_insurance_companies')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>{t('government.provider_a')}</span>
                <Badge className="bg-status-success text-white">45% {t('government.coverage')}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>{t('government.provider_b')}</span>
                <Badge className="bg-status-success text-white">35% {t('government.coverage')}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>{t('government.provider_c')}</span>
                <Badge className="bg-status-success text-white">20% {t('government.coverage')}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('government.coverage_types')}</CardTitle>
            <CardDescription>{t('government.insurance_coverage_breakdown')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>{t('government.basic_coverage')}</span>
                <span className="font-bold">856 {t('government.employees')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>{t('government.comprehensive_coverage')}</span>
                <span className="font-bold">341 {t('government.employees')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>{t('government.family_coverage')}</span>
                <span className="font-bold">50 {t('government.employees')}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MedicalInsurancePlatform;