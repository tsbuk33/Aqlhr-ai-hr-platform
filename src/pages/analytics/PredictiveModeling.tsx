import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AqlHRAIAssistant } from "@/components/ai/AqlHRAIAssistant";

const PredictiveModeling = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Predictive Modeling</h1>
        <p className="text-muted-foreground">AI-powered workforce predictions and forecasting</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Prediction Accuracy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">94.7%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Models Deployed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">18</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Predictions Made</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">15,678</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Business Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">SAR 5.2M</div>
          </CardContent>
        </Card>
      </div>

      <AqlHRAIAssistant 
        moduleContext="analytics.predictive" 
        companyId="demo-company"
      />
    </div>
  );
};

export default PredictiveModeling;