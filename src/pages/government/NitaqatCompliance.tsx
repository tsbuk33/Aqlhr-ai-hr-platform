import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const NitaqatCompliance = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Nitaqat Compliance</h1>
        <p className="text-muted-foreground">Saudization monitoring and compliance tracking</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">67.2%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Target Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">65%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Green Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">✓</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Saudi Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">1,913</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NitaqatCompliance;