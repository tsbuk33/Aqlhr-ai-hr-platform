import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const BudgetForecasting = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Budget Forecasting</h1>
        <p className="text-muted-foreground">Payroll budgeting and financial planning</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Annual Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">SAR 5.47M</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Budget Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">78.9%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Forecast Accuracy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">94.2%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Variance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">-2.1%</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BudgetForecasting;