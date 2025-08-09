import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AqlHRAIAssistant } from '@/components/ai';

const ComplianceReporting = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Compliance Reporting</h1>
        <p className="text-muted-foreground">Automated compliance tracking and reporting</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Compliance Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">96.8%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Reports Generated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">156</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Violations Prevented</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">89</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Cost Avoidance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">SAR 1.2M</div>
          </CardContent>
        </Card>
      </div>

      <AqlHRAIAssistant 
        moduleContext="analytics.compliance" 
        companyId="demo-company"
      />
    </div>
  );
};

export default ComplianceReporting;