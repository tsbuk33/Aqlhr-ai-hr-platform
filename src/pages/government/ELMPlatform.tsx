import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ELMPlatform = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">ELM Platform</h1>
        <p className="text-muted-foreground">Elm company for digital solutions integration</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>API Calls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">45,678</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">99.3%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">0.8 sec</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Data Synced</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">2,847</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ELMPlatform;