import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAPITranslations } from "@/hooks/useAPITranslations";

const MergerIntegration = () => {
  const { t } = useAPITranslations();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('consulting.merger_integration')}</h1>
        <p className="text-muted-foreground">{t('consulting.merger_integration_desc')}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Integration Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">94%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Synergy Achieved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">SAR 12M</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Retention Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">91%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Time to Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">6 months</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MergerIntegration;