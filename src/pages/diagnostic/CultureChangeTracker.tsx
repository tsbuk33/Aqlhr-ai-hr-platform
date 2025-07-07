import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const CultureChangeTracker = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Culture Change Tracker</h1>
        <p className="text-muted-foreground">Organizational culture transformation monitoring</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Culture Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">8.2/10</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Change Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">67%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Initiatives</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">23</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">84.7%</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CultureChangeTracker;