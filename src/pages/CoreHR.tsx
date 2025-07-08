import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

const CoreHR = () => {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('core_hr.core_hr_modules')}</h1>
        <p className="text-muted-foreground">{t('core_hr.core_hr_modules_desc')}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('core_hr.employee_master_data')}</CardTitle>
            <CardDescription>{t('core_hr.employee_master_data_desc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">2,847 {t('core_hr.employees_managed')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('core_hr.organizational_structure')}</CardTitle>
            <CardDescription>{t('core_hr.organizational_structure_desc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">67% {t('core_hr.saudization_rate')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('core_hr.employee_self_service')}</CardTitle>
            <CardDescription>{t('core_hr.employee_self_service_desc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">1,847 {t('core_hr.active_users')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('core_hr.document_management')}</CardTitle>
            <CardDescription>{t('core_hr.document_management_desc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">15,678 {t('core_hr.documents_processed')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('core_hr.time_attendance')}</CardTitle>
            <CardDescription>{t('core_hr.time_attendance_desc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">98.2% {t('core_hr.attendance_rate')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('core_hr.performance_management')}</CardTitle>
            <CardDescription>{t('core_hr.performance_management_desc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">2,456 {t('core_hr.reviews_completed')}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CoreHR;