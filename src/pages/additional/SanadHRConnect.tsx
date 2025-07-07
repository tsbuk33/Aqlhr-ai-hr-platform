import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const SanadHRConnect = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">SanadHR Connect</h1>
        <p className="text-muted-foreground">Email & Ticket Communication Tool</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">2,847</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">2.3h</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Resolution Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">94.8%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Satisfaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">4.7/5</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SanadHRConnect;