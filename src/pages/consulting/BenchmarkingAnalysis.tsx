import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAPITranslations } from "@/hooks/useAPITranslations";
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";
import { AqlHRAIAssistant } from '@/components/ai';

const BenchmarkingAnalysis = () => {
  const { t } = useAPITranslations();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('consulting.benchmarking_analysis')}</h1>
        <p className="text-muted-foreground">{t('consulting.benchmarking_analysis_desc')}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('consulting.market_position')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">Top 25%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('consulting.peer_companies')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">156</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('consulting.data_points')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">2,847</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('consulting.accuracy_score')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">96.8%</div>
          </CardContent>
        </Card>
      </div>
      
      <UniversalAIIntegrator 
        pageType="strategic" 
        moduleName="benchmarking-analysis" 
        companyId="demo-company" 
        enabledFeatures={['benchmarking', 'market-analysis', 'competitive-intelligence', 'data-visualization']}
      />
      
      {/* AI Integration for Benchmarking Analysis */}
      <UniversalAIIntegrator 
        pageType="consulting" 
        moduleName="benchmarking-analysis" 
        companyId="demo-company" 
        enabledFeatures={['market-analysis', 'competitive-benchmarking', 'strategic-insights', 'performance-comparison']}
      />
      
      <AqlHRAIAssistant 
        moduleContext="consulting.benchmarking-analysis" 
        companyId="demo-company"
      />
    </div>
  );
};

export default BenchmarkingAnalysis;