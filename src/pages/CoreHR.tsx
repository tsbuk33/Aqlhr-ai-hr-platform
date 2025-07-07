import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const CoreHR = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Core HR Modules</h1>
        <p className="text-muted-foreground">Manage your HR operations efficiently</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Employee Master Data</CardTitle>
            <CardDescription>Complete profile management with Saudi compliance</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">2,847 employees managed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Organizational Structure</CardTitle>
            <CardDescription>Dynamic org chart with Saudization tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">67% Saudization rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Employee Self-Service</CardTitle>
            <CardDescription>Personal portal with mobile access</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">1,847 active users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Document Management</CardTitle>
            <CardDescription>Automated collection and verification</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">15,678 documents processed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Time & Attendance</CardTitle>
            <CardDescription>Absher integration with mobile</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">98.2% attendance rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Management</CardTitle>
            <CardDescription>360-degree evaluations and goals</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">2,456 reviews completed</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CoreHR;