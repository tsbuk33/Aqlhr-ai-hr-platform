import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const BankIntegration = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Bank Integration</h1>
        <p className="text-muted-foreground">Multi-bank connectivity and file processing</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Connected Banks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">8</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Monthly Transfers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">2,847</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">99.8%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Processing Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">45 sec</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BankIntegration;