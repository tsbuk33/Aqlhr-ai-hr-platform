import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const WorkflowAutomation = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Workflow Automation</h1>
        <p className="text-muted-foreground">Automated processes and approval workflows</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Active Workflows</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">34</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Automated Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">1,234</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Time Saved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">456 hrs</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">98.7%</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WorkflowAutomation;