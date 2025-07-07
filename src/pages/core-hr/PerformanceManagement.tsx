import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const PerformanceManagement = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Performance Management</h1>
        <p className="text-muted-foreground">360-degree evaluations and goal tracking</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Reviews Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">2,456</div>
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
            <CardTitle>Goals Achieved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">87%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top Performers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">234</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PerformanceManagement;