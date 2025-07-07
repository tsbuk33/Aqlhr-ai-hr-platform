import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const TVTCIntegration = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">TVTC Integration</h1>
        <p className="text-muted-foreground">Technical and Vocational Training Corporation</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Certified Trainees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">1,234</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Programs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">34</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">94.2%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Training Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">15,678</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TVTCIntegration;