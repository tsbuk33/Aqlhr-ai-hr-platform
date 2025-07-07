import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const MobileAppFeature = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Mobile App</h1>
        <p className="text-muted-foreground">Offline mode supported mobile application</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">1,847</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>App Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">4.6/5</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Offline Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">23.4%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Sync Success</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">99.8%</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MobileAppFeature;