import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

const SelfService = () => {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('core_hr.employee_self_service')}</h1>
        <p className="text-muted-foreground">{t('core_hr.employee_self_service_desc')}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('core_hr.active_users')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-brand-primary">1,847</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('core_hr.mobile_usage')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-brand-success">78%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('core_hr.requests_processed')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-brand-accent">5,678</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('core_hr.satisfaction_score')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-brand-primary">4.8/5</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('core_hr.leave_management_service')}</CardTitle>
            <CardDescription>{t('core_hr.leave_management_service_desc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">234 {t('core_hr.pending_requests')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('core_hr.payslip_access')}</CardTitle>
            <CardDescription>{t('core_hr.payslip_access_desc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">100% {t('core_hr.digital_access')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('core_hr.profile_management')}</CardTitle>
            <CardDescription>{t('core_hr.profile_management_desc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{t('core_hr.realtime_updates')}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SelfService;