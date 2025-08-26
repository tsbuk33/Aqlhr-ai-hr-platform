import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";
import { AqlHRAIAssistant } from '@/components/ai';

const SupplierDevelopmentMonitor = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Supplier Development Monitor</h1>
        <p className="text-muted-foreground">Local supplier development and monitoring system</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Local Suppliers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">89</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Development Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">8.4/10</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Local Spend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">72.6%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Certified Suppliers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">67</div>
          </CardContent>
        </Card>
      </div>
      
      <UniversalAIIntegrator 
        pageType="strategic" 
        moduleName="supplier-development-monitor" 
        companyId="demo-company" 
        enabledFeatures={['supplier-management', 'development-tracking', 'local-content', 'performance-monitoring']}
      />
      
      <AqlHRAIAssistant 
        moduleContext="local-content.supplier-development" 
        companyId="demo-company"
      />
    </div>
  );
};

export default SupplierDevelopmentMonitor;