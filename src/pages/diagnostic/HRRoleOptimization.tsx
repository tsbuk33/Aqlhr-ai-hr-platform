import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AqlHRAIAssistant } from '@/components/ai/AqlHRAIAssistant';

const HRRoleOptimization = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">HR Role Optimization Engine</h1>
        <p className="text-muted-foreground">Strategic HR role design and optimization</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Roles Analyzed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">234</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Optimization Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">8.9/10</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">67</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Efficiency Gain</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">34%</div>
          </CardContent>
        </Card>
      </div>
      
      <AqlHRAIAssistant moduleContext="diagnostic.hrRoleOptimization" />
    </div>
  );
};

export default HRRoleOptimization;