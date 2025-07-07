import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const PayrollAnalytics = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Payroll Analytics</h1>
        <p className="text-muted-foreground">Payroll insights and cost analysis</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Cost Per Employee</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">SAR 21,300</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>YoY Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">+12.3%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Overtime Ratio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">8.9%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Cost Savings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">SAR 145K</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PayrollAnalytics;