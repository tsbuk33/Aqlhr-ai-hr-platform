import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AbsherPlatform = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Absher Platform</h1>
        <p className="text-muted-foreground">Identity verification and document validation</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Verified IDs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">2,456</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Verification Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">97.8%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">1.2 sec</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Daily Checks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">234</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AbsherPlatform;