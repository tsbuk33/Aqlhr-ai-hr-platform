import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const GrievanceReporting = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Grievance & Harassment Reporting</h1>
        <p className="text-muted-foreground">Anonymous 24/7 reporting system</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">89</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Anonymous Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">67</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Resolved Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">82</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">4.2h</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GrievanceReporting;