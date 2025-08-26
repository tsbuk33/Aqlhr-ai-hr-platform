import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAPITranslations } from "@/hooks/useAPITranslations";
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";
import { AqlHRAIAssistant } from '@/components/ai';

const DigitalTransformation = () => {
  const { t } = useAPITranslations();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('consulting.digital_transformation')}</h1>
        <p className="text-muted-foreground">{t('consulting.digital_transformation_desc')}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('consulting.digital_maturity')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">8.2/10</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('consulting.process_automation')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">89%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('consulting.efficiency_gain')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">+67%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('consulting.roi_achievement')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">280%</div>
          </CardContent>
        </Card>
      </div>
      
      <UniversalAIIntegrator 
        pageType="strategic" 
        moduleName="digital-transformation" 
        companyId="demo-company" 
        enabledFeatures={['digital-transformation', 'process-automation', 'technology-integration', 'efficiency-optimization']}
      />
      
      <AqlHRAIAssistant 
        moduleContext="consulting.digital-transformation" 
        companyId="demo-company"
      />
    </div>
  );
};

export default DigitalTransformation;