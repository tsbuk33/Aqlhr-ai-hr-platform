import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const MOLCompliance = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">MOL Compliance</h1>
        <p className="text-muted-foreground">Ministry of Labor regulations and compliance</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Compliance Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">98.7%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Violations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">0</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Resolved Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">23</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Inspection Ready</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">✓</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MOLCompliance;