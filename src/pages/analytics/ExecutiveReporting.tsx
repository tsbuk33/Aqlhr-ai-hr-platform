import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AqlHRAIAssistant } from "@/components/ai/AqlHRAIAssistant";

const ExecutiveReporting = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Executive Reporting</h1>
        <p className="text-muted-foreground">C-level dashboards and executive insights</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Executive Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">23</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>KPIs Tracked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">45</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Monthly Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">12</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Decision Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">94%</div>
          </CardContent>
        </Card>
      </div>

      <AqlHRAIAssistant 
        moduleContext="analytics.executive" 
        companyId="demo-company"
      />
    </div>
  );
};

export default ExecutiveReporting;