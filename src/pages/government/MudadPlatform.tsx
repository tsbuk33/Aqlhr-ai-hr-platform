import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const MudadPlatform = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Mudad Platform</h1>
        <p className="text-muted-foreground">Wage Protection System integration</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Reports</CardTitle>
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
            <CardTitle>Processing Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">45 min</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Protected Wages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">SAR 5.47M</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MudadPlatform;