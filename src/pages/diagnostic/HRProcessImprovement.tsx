import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const HRProcessImprovement = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">HR Process Improvement Framework</h1>
        <p className="text-muted-foreground">Systematic HR process optimization and enhancement</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Process Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">87.3%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Improvements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">45</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Time Saved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">342h</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Cost Reduction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">23%</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HRProcessImprovement;