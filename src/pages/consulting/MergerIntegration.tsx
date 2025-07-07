import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const MergerIntegration = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Merger & Acquisition Integration</h1>
        <p className="text-muted-foreground">HR integration for M&A transactions</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Integration Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">94%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Synergy Achieved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">SAR 12M</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Retention Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">91%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Time to Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">6 months</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MergerIntegration;