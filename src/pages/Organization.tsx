import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Organization = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Organizational Structure</h1>
        <p className="text-muted-foreground">Dynamic org chart with Saudization tracking</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Departments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">28</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Management Levels</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-success">5</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Saudization Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-accent">67.2%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Open Positions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-warning">23</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Organizational Chart</CardTitle>
          <CardDescription>Visual representation of company structure</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">Interactive org chart will be displayed here</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Organization;