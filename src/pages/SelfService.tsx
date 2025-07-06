import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const SelfService = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Employee Self-Service</h1>
        <p className="text-muted-foreground">Personal portal with mobile access</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">1,847</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mobile Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-success">78%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Requests Processed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-accent">5,678</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Satisfaction Score</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">4.8/5</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Leave Management</CardTitle>
            <CardDescription>Request and track leave balances</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">234 pending requests</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payslip Access</CardTitle>
            <CardDescription>Download and view payslips</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">100% digital access</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profile Management</CardTitle>
            <CardDescription>Update personal information</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Real-time updates</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SelfService;