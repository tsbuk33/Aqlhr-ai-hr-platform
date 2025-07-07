import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Payroll = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Payroll & Financial</h1>
        <p className="text-muted-foreground">WPS payroll processing and financial management</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>December 2024 Payroll</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">SAR 456,000</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Employees Processed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-success">2,847</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>GOSI Contributions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-accent">SAR 45,600</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Salary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">SAR 18,500</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>WPS Payroll Processing</CardTitle>
            <CardDescription>Automated salary calculations and bank file generation</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">100% compliance status</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>End of Service Benefits</CardTitle>
            <CardDescription>EOSB calculations and liability management</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Total liability: SAR 2,340,000</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Payroll;