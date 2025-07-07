import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const EmployeeMasterData = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Employee Master Data Management</h1>
        <p className="text-muted-foreground">Centralized employee data management system</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">2,847</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">2,798</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Data Accuracy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">99.2%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">127</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeMasterData;