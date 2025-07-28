import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ModuleDocumentUploader from '@/components/universal/ModuleDocumentUploader';
import ModuleAIChat from '@/components/universal/ModuleAIChat';

const PerformanceStrategy = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Performance Strategy</h1>
        <p className="text-muted-foreground">Strategic performance management and optimization</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>High Performers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">567</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">4.2/5</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Goal Achievement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">89%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Performance ROI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">23%</div>
          </CardContent>
        </Card>
      </div>
      
      <ModuleDocumentUploader moduleKey="strategic.performanceStrategy" />
      <ModuleAIChat moduleKey="strategic.performanceStrategy" />
    </div>
  );
};

export default PerformanceStrategy;