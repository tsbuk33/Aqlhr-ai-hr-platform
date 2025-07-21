import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { PageLayout } from "@/components/layout/PageLayout";

const SmartKPITool = () => {
  return (
    <PageLayout
      title="Smart KPI Tool"
      description="Advanced KPI management and analytics tool"
    >
      <div>
        <h1 className="text-3xl font-bold text-foreground">Smart KPI & Performance Agreement Tool</h1>
        <p className="text-muted-foreground">Mutual employee-manager goal setting and tracking</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Active KPIs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">1,234</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Achievement Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">87.6%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Performance Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">456</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Career Progression</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">234</div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default SmartKPITool;