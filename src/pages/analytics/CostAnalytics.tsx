import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const CostAnalytics = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Cost Analytics</h1>
        <p className="text-muted-foreground">HR cost analysis and optimization insights</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Cost per Employee</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">SAR 21,300</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Cost per Hire</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">SAR 12,500</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Cost Savings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">SAR 2.3M</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>ROI Achievement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">340%</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CostAnalytics;