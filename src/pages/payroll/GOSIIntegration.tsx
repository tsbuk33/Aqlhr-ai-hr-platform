import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const GOSIIntegration = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">GOSI Integration</h1>
        <p className="text-muted-foreground">Automated GOSI contributions and reporting</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Contributions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">SAR 45,600</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Employee Share</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">SAR 22,800</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Employer Share</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">SAR 22,800</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Compliance Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">100%</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GOSIIntegration;