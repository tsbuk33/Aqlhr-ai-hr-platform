import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

const EmployeeMasterData = () => {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('core_hr.employee_master_data')}</h1>
        <p className="text-muted-foreground">{t('core_hr.employee_master_data_desc')}</p>
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
            <CardTitle>{t('core_hr.active_records')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">2,798</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('core_hr.data_accuracy')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">99.2%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('core_hr.recent_updates')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">127</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeMasterData;