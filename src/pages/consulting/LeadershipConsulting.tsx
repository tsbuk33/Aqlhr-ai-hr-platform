import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const LeadershipConsulting = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Leadership Consulting</h1>
        <p className="text-muted-foreground">Executive coaching and leadership development</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Leaders Coached</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">156</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Leadership Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">8.7/10</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Performance Lift</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">+34%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>ROI on Coaching</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">520%</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LeadershipConsulting;