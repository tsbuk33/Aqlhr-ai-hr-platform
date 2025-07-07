import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const TrainingDevelopment = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Training & Development</h1>
        <p className="text-muted-foreground">Skills development and TVTC integration</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Active Programs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">34</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>TVTC Certified</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">1,234</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Training Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">15,678</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">94%</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TrainingDevelopment;