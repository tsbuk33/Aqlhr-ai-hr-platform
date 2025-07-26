import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAPITranslations } from "@/hooks/useAPITranslations";

const RiskAssessment = () => {
  const { t } = useAPITranslations();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('consulting.risk_assessment')}</h1>
        <p className="text-muted-foreground">{t('consulting.risk_assessment_desc')}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Risk Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">2.1/10</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Risks Mitigated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">89</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Compliance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">98.7%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Cost Avoidance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">SAR 1.2M</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RiskAssessment;