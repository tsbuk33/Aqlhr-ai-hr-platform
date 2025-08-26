import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAPITranslations } from "@/hooks/useAPITranslations";
import { AqlHRAIAssistant } from '@/components/ai';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";

const AqlHRConnect = () => {
  const { t } = useAPITranslations();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('additional.aqlhr_connect')}</h1>
        <p className="text-muted-foreground mt-2">
          {t('additional.aqlhr_connect_desc')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('additional.api_integration')}</CardTitle>
            <CardDescription>{t('additional.api_integration_desc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {t('additional.api_integration_content')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('additional.government_systems')}</CardTitle>
            <CardDescription>{t('additional.government_systems_desc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {t('additional.government_systems_content')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('additional.data_sync')}</CardTitle>
            <CardDescription>{t('additional.data_sync_desc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {t('additional.data_sync_content')}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <AqlHRAIAssistant moduleContext="additional.aqlhrConnect" />
      
      {/* AI Integration for AqlHR Connect */}
      <UniversalAIIntegrator 
        pageType="platform" 
        moduleName="aqlhr-connect" 
        companyId="demo-company" 
        enabledFeatures={['integration-management', 'system-connectivity', 'workflow-automation', 'api-intelligence']}
      />
    </div>
  );
};

export default AqlHRConnect;