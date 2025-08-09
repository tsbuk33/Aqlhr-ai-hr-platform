import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AqlHRAIAssistant } from '@/components/ai';

const DataVisualization = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Data Visualization</h1>
        <p className="text-muted-foreground">Interactive charts and visual analytics</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Visualizations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">456</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Interactive Charts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">234</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Daily Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">3,456</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Insight Generation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">89%</div>
          </CardContent>
        </Card>
      </div>

      <AqlHRAIAssistant 
        moduleContext="analytics.visualization" 
        companyId="demo-company"
      />
    </div>
  );
};

export default DataVisualization;