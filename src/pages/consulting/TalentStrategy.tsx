import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const TalentStrategy = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Talent Strategy Consulting</h1>
        <p className="text-muted-foreground">Strategic talent planning and optimization</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Talent Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">1,234</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quality Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">9.1/10</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Time to Hire</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">18 days</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Cost per Hire</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">SAR 8,900</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TalentStrategy;