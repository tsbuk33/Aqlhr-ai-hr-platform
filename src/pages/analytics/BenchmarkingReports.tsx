import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AqlHRAIAssistant } from "@/components/ai/AqlHRAIAssistant";
import { useAPITranslations } from "@/hooks/useAPITranslations";

const BenchmarkingReports = () => {
  const { t } = useAPITranslations();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('consulting.benchmarking_reports')}</h1>
        <p className="text-muted-foreground">{t('consulting.benchmarking_analysis_desc')}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('consulting.market_position')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">Top 20%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('consulting.peer_companies')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">156</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('consulting.benchmarks_tracked')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">89</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('consulting.improvement_areas')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">12</div>
          </CardContent>
        </Card>
      </div>

      <AqlHRAIAssistant 
        moduleContext="analytics.benchmarking" 
        companyId="demo-company"
      />
    </div>
  );
};

export default BenchmarkingReports;