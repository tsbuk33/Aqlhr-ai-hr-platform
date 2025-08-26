import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";
import { AqlHRAIAssistant } from '@/components/ai';

const RegulatoryComplianceMonitor = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Regulatory Compliance Monitor</h1>
        <p className="text-muted-foreground">Local content regulatory compliance tracking</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Compliance Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">94.7%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Regulations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">34</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Violations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">3</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Remediation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">100%</div>
          </CardContent>
        </Card>
      </div>
      
      <UniversalAIIntegrator 
        pageType="compliance" 
        moduleName="regulatory-compliance-monitor" 
        companyId="demo-company" 
        enabledFeatures={['compliance-monitoring', 'regulatory-compliance', 'saudi-regulations', 'audit-trails']}
      />
      
      <AqlHRAIAssistant 
        moduleContext="local-content.regulatory-compliance" 
        companyId="demo-company"
      />
    </div>
  );
};

export default RegulatoryComplianceMonitor;