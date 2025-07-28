import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ModuleDocumentUploader from '@/components/universal/ModuleDocumentUploader';
import { AqlHRAIAssistant } from '@/components/ai/AqlHRAIAssistant';

const LeadershipDevelopment = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Leadership Development</h1>
        <p className="text-muted-foreground">Executive and manager development programs</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Leaders in Program</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">234</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">91%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Leadership Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">7.8/10</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Program ROI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">280%</div>
          </CardContent>
        </Card>
      </div>
      
      <ModuleDocumentUploader moduleKey="strategic.leadershipDevelopment" />
      <AqlHRAIAssistant moduleContext="strategic.leadershipDevelopment" />
    </div>
  );
};

export default LeadershipDevelopment;