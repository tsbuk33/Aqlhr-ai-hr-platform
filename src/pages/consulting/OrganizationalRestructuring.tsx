import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const OrganizationalRestructuring = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Organizational Restructuring</h1>
        <p className="text-muted-foreground">Strategic reorganization and efficiency optimization</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Efficiency Gain</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">+23%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Cost Savings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">SAR 2.3M</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Roles Optimized</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">456</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Project ROI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">340%</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrganizationalRestructuring;