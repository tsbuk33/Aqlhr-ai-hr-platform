import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAPITranslations } from "@/hooks/useAPITranslations";
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";
import { AqlHRAIAssistant } from '@/components/ai';

const StrategicPlanning = () => {
  const { t } = useAPITranslations();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('consulting.strategic_planning')}</h1>
        <p className="text-muted-foreground">{t('consulting.strategic_planning_desc')}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('consulting.strategic_goals')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">23</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('consulting.achievement_rate')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">87%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('consulting.planning_horizon')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">5 {t('consulting.years_value')}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('consulting.strategic_roi')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">450%</div>
          </CardContent>
        </Card>
      </div>
      
      <UniversalAIIntegrator 
        pageType="strategic" 
        moduleName="strategic-planning" 
        companyId="demo-company" 
        enabledFeatures={['strategic-planning', 'goal-setting', 'performance-tracking', 'roi-analysis']}
      />
      
      <AqlHRAIAssistant 
        moduleContext="consulting.strategic-planning" 
        companyId="demo-company"
      />
    </div>
  );
};

export default StrategicPlanning;