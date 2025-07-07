import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const SmartRecommendations = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Smart Recommendations</h1>
        <p className="text-muted-foreground">AI-driven talent recommendations for transfers and promotions</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">342</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Accuracy Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">87.6%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Implemented</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">289</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">94.1%</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SmartRecommendations;