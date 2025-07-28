import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ModuleDocumentUploader from '@/components/universal/ModuleDocumentUploader';
import { AqlHRAIAssistant } from '@/components/ai/AqlHRAIAssistant';

const OrganizationalDevelopment = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Organizational Development</h1>
        <p className="text-muted-foreground">Culture transformation and change management</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Change Initiatives</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">12</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Culture Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">8.4/10</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Engagement Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">87%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>ROI on Changes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">340%</div>
          </CardContent>
        </Card>
      </div>
      
      <ModuleDocumentUploader moduleKey="strategic.organizationalDevelopment" />
      <AqlHRAIAssistant moduleContext="strategic.organizationalDevelopment" />
    </div>
  );
};

export default OrganizationalDevelopment;