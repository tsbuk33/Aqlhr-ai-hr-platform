import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AutomatedWorkflowEngine = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Automated Workflow Engine</h1>
        <p className="text-muted-foreground">Intelligent process automation and alerts</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Active Workflows</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">127</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Automation Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">78.3%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Time Saved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">2,456h</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Error Reduction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">67%</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AutomatedWorkflowEngine;