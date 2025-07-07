import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const SuccessionPlanningCore = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Succession Planning</h1>
        <p className="text-muted-foreground">Strategic talent pipeline management</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Key Positions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">156</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Ready Successors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">89</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Succession Coverage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">57%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Risk Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">2.8/10</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SuccessionPlanningCore;