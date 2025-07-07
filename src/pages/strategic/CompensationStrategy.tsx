import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const CompensationStrategy = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Compensation Strategy</h1>
        <p className="text-muted-foreground">Strategic salary planning and market positioning</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Market Position</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">75th %ile</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pay Equity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">94.2%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Budget Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">87%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>ROI on Comp</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">156%</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompensationStrategy;