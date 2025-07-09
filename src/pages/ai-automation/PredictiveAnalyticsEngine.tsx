import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

const PredictiveAnalyticsEngine = () => {
  const { t } = useLanguage();
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('ai.predictive_analytics_engine')}</h1>
        <p className="text-muted-foreground">{t('ai.predictive_analytics_desc')}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('ai.ml_models')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">12</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('ai.prediction_accuracy')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">91.4%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('ai.at_risk_employees')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">47</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('ai.high_performers')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">234</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PredictiveAnalyticsEngine;