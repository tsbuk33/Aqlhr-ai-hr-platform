import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const CompensationManagementCore = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Compensation Management</h1>
        <p className="text-muted-foreground">Strategic compensation planning and administration</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Compensation Bands</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">47</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Merit Increase</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">8.5%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Market Alignment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">92%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Budget Variance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">-2.1%</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompensationManagementCore;