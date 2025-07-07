import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ChangeManagement = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Change Management</h1>
        <p className="text-muted-foreground">Organizational change strategy and implementation</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Change Readiness</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">84%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Adoption Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">91%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">87%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Time to Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">4.2 months</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChangeManagement;