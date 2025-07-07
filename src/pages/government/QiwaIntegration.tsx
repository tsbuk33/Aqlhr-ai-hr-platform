import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const QiwaIntegration = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Qiwa Integration</h1>
        <p className="text-muted-foreground">Employment contracts and work permits management</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Active Contracts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">2,847</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Processing Success</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">98.1%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Monthly Transfers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">45</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Compliance Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">100%</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QiwaIntegration;