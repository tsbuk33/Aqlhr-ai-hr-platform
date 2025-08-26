import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";
import { AqlHRAIAssistant } from '@/components/ai';

const InvestmentTrackingSystem = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Investment Tracking System</h1>
        <p className="text-muted-foreground">Local investment monitoring and reporting</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Investment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">SAR 2.4B</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Local Investment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">SAR 1.8B</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Investment Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">75.3%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">23</div>
          </CardContent>
        </Card>
      </div>
      
      <UniversalAIIntegrator 
        pageType="strategic" 
        moduleName="investment-tracking-system" 
        companyId="demo-company" 
        enabledFeatures={['strategic-planning', 'financial-tracking', 'investment-analysis', 'data-visualization']}
      />
      
      <AqlHRAIAssistant 
        moduleContext="local-content.investment-tracking" 
        companyId="demo-company"
      />
    </div>
  );
};

export default InvestmentTrackingSystem;