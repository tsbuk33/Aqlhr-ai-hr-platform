import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const MobileHR = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Mobile HR</h1>
        <p className="text-muted-foreground">Mobile app for employees and managers</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>App Downloads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">2,847</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Daily Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">1,856</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>App Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">4.8/5</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Mobile Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">567</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MobileHR;