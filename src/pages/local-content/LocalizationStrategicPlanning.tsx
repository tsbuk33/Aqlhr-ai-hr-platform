import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";
import { AqlHRAIAssistant } from '@/components/ai';

const LocalizationStrategicPlanning = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Localization Strategic Planning Suite</h1>
        <p className="text-muted-foreground">Comprehensive localization strategy and planning</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Strategic Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">8.9/10</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Milestones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">23</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">78.6%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Target Year</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">2030</div>
          </CardContent>
        </Card>
      </div>
      
      <UniversalAIIntegrator 
        pageType="strategic" 
        moduleName="localization-strategic-planning" 
        companyId="demo-company" 
        enabledFeatures={['strategic-planning', 'localization', 'workforce-planning', 'milestone-tracking']}
      />
      
      <AqlHRAIAssistant 
        moduleContext="local-content.localization-planning" 
        companyId="demo-company"
      />
    </div>
  );
};

export default LocalizationStrategicPlanning;