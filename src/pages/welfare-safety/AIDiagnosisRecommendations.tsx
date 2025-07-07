import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AIDiagnosisRecommendations = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">AI Diagnosis & Recommendations</h1>
        <p className="text-muted-foreground">12 ML models for welfare insights</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>ML Models</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">12</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">287</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Accuracy Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">89.4%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Implementation Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">76.8%</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIDiagnosisRecommendations;