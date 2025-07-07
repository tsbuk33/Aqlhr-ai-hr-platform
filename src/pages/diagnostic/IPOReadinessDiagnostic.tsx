import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const IPOReadinessDiagnostic = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">CMA IPO Readiness Diagnostic</h1>
        <p className="text-muted-foreground">Capital market authority IPO compliance assessment</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Readiness Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">78.3%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Compliance Areas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">45</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Gap Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">12</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Target Date</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">Q3 2024</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IPOReadinessDiagnostic;