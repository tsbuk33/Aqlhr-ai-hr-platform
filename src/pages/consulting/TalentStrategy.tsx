import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAPITranslations } from "@/hooks/useAPITranslations";
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";
import { AqlHRAIAssistant } from '@/components/ai';

const TalentStrategy = () => {
  const { t } = useAPITranslations();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('consulting.talent_strategy')}</h1>
        <p className="text-muted-foreground">{t('consulting.talent_strategy_desc')}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Talent Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">1,234</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quality Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">9.1/10</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Time to Hire</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">18 days</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Cost per Hire</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">SAR 8,900</div>
          </CardContent>
        </Card>
      </div>
      
      <UniversalAIIntegrator 
        pageType="core-hr" 
        moduleName="talent-strategy" 
        companyId="demo-company" 
        enabledFeatures={['talent-management', 'workforce-planning', 'recruitment-optimization', 'pipeline-development']}
      />
      
      <AqlHRAIAssistant 
        moduleContext="consulting.talent-strategy" 
        companyId="demo-company"
      />
    </div>
  );
};

export default TalentStrategy;