import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const CompensationBenefits = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Compensation & Benefits</h1>
        <p className="text-muted-foreground">Salary structure and benefits management</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Average Salary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">SAR 18,500</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Benefits Enrolled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">2,456</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Bonus Distributed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">SAR 2.3M</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>EOSB Liability</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">SAR 4.5M</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompensationBenefits;