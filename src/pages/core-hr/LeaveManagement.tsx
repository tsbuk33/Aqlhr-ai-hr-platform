import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const LeaveManagement = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Leave Management</h1>
        <p className="text-muted-foreground">Automated leave processing and approvals</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pending Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">23</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Approved This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">145</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Annual Leave Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">18.5</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Emergency Leaves</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-danger">12</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LeaveManagement;