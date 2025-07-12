import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguageCompat";

const PerformanceManagement = () => {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('core_hr.performance_management')}</h1>
        <p className="text-muted-foreground">{t('core_hr.performance_management_desc')}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('core_hr.total_employees')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">2,847</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('core_hr.reviews_completed')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">2,234</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('core_hr.satisfaction_rate')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">94.7%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('core_hr.performance_evaluations')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">178</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PerformanceManagement;