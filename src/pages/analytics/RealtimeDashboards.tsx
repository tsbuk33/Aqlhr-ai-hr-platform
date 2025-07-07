import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const RealtimeDashboards = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Real-time Dashboards</h1>
        <p className="text-muted-foreground">Live KPI monitoring and real-time insights</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Active Dashboards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">18</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Data Refresh Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">30 sec</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Daily Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">2,456</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>User Satisfaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">9.1/10</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RealtimeDashboards;