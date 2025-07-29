import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AqlHRAIAssistant } from '@/components/ai/AqlHRAIAssistant';
import { useAPITranslations } from "@/hooks/useAPITranslations";
import { PageLayout } from "@/components/layout/PageLayout";

const SmartKPITool = () => {
  const { t } = useAPITranslations();

  return (
    <PageLayout
      title={t('additional.smart_kpi_tool')}
      description={t('additional.smart_kpi_desc')}
    >
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('additional.smart_kpi_tool')}</h1>
        <p className="text-muted-foreground">{t('additional.smart_kpi_desc')}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Active KPIs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">1,234</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Achievement Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">87.6%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Performance Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">456</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Career Progression</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">234</div>
          </CardContent>
        </Card>
      </div>
      
      <AqlHRAIAssistant moduleContext="additional.smartKPITool" />
    </PageLayout>
  );
};

export default SmartKPITool;