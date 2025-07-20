import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ChangeManagement = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Change Management</h1>
        <p className="text-muted-foreground">Strategic organizational change and transformation</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Active Changes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">12</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">78%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Employee Readiness</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">85%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Timeline Adherence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">92%</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChangeManagement;