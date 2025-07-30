import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AqlHRAIAssistant } from '@/components/ai/AqlHRAIAssistant';
import { useAPITranslations } from "@/hooks/useAPITranslations";
import { PageLayout } from "@/components/layout/PageLayout";
import { KPIOverviewCard } from "@/components/smart-kpi/KPIOverviewCard";
import { useSmartKPIs } from "@/hooks/useSmartKPIs";

const SmartKPITool = () => {
  const { t } = useAPITranslations();
  const { stats, loading } = useSmartKPIs();

  return (
    <PageLayout
      title={t('additional.smart_kpi_tool')}
      description={t('additional.smart_kpi_desc')}
    >
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('additional.smart_kpi_tool')}</h1>
        <p className="text-muted-foreground">{t('additional.smart_kpi_desc')}</p>
      </div>
      
      <KPIOverviewCard stats={stats} loading={loading} />
      
      <AqlHRAIAssistant moduleContext="additional.smartKPITool" />
    </PageLayout>
  );
};

export default SmartKPITool;