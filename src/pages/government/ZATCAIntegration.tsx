import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ZATCAIntegration = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">ZATCA Integration</h1>
        <p className="text-muted-foreground">Zakat, Tax and Customs Authority compliance</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>VAT Returns Filed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">12/12</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Compliance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">100%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Tax Collected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">SAR 45.6K</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Penalties Avoided</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">SAR 23K</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ZATCAIntegration;