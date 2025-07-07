import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const WPSProcessing = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">WPS Payroll Processing</h1>
        <p className="text-muted-foreground">Automated WPS bank file generation and processing</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>This Month's Payroll</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">SAR 456,000</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>WPS Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">100%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Processing Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">2.3 min</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Bank Files Generated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">12</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WPSProcessing;