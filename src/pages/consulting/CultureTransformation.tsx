import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const CultureTransformation = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Culture Transformation</h1>
        <p className="text-muted-foreground">Cultural assessment and transformation consulting</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Culture Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">8.4/10</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Engagement Lift</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">+32%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Change Readiness</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">87%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Transformation ROI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">420%</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CultureTransformation;