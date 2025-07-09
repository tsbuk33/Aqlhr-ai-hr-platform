import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

const ELMPlatform = () => {
  const { t } = useLanguage();
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('government.elm_platform')}</h1>
        <p className="text-muted-foreground">{t('government.elm_desc')}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('government.api_calls')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">45,678</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('government.success_rate')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">99.3%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('government.response_time')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">0.8 sec</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('government.data_synced')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">2,847</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ELMPlatform;