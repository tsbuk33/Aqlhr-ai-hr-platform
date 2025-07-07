import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const EmployeeExperience = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Employee Experience</h1>
        <p className="text-muted-foreground">Journey mapping and experience optimization</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Experience Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">8.3/10</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Satisfaction Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">89%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Retention Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">94%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Touchpoints</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">45</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeExperience;