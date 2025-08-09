import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AqlHRAIAssistant from '@/components/ai/AqlHRAIAssistant';

const OrgStructureAssessment = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Org Structure Assessment Tool</h1>
        <p className="text-muted-foreground">Organizational design and effectiveness analysis</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Structure Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">7.8/10</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Departments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">23</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Reporting Lines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">156</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Efficiency Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">82.4%</div>
          </CardContent>
        </Card>
      </div>
      
      <AqlHRAIAssistant moduleContext="diagnostic.orgStructureAssessment" />
    </div>
  );
};

export default OrgStructureAssessment;