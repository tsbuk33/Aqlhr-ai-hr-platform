import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

const Organization = () => {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('organization.structure')}</h1>
        <p className="text-muted-foreground">{t('organization.dynamic_chart')}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('organization.total_departments')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-brand-primary">28</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('organization.management_levels')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-brand-success">5</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('core_hr.saudization_rate')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-brand-accent">67.2%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('organization.open_positions')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-brand-warning">23</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('organization.org_chart')}</CardTitle>
          <CardDescription>{t('organization.visual_representation')}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">{t('organization.interactive_chart')}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Organization;