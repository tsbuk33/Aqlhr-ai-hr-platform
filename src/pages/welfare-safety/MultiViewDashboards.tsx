import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const MultiViewDashboards = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Multi-View Dashboards</h1>
        <p className="text-muted-foreground">HR Admin, Worker, Site Manager, and ExCom views</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Dashboard Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">4</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">1,234</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Widgets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">67</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Customization Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">82.4%</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MultiViewDashboards;