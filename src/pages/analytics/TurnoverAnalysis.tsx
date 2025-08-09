import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AqlHRAIAssistant } from '@/components/ai';

const TurnoverAnalysis = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Turnover Analysis</h1>
        <p className="text-muted-foreground">Employee retention and turnover insights</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Turnover Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">8.9%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Retention Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">91.1%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Cost of Turnover</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">SAR 890K</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Risk Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-danger">23</div>
          </CardContent>
        </Card>
      </div>

      <AqlHRAIAssistant 
        moduleContext="analytics.turnover" 
        companyId="demo-company"
      />
    </div>
  );
};

export default TurnoverAnalysis;