import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AqlHRConnect = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">AqlHR Connect</h1>
        <p className="text-muted-foreground mt-2">
          Advanced integration and connectivity solutions for AqlHR platform
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>API Integration</CardTitle>
            <CardDescription>Connect with third-party systems</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Seamlessly integrate AqlHR with your existing enterprise systems through our robust API framework.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Government Systems</CardTitle>
            <CardDescription>Saudi government platform connections</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Direct integration with 22+ Saudi government platforms for compliance and data synchronization.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Sync</CardTitle>
            <CardDescription>Real-time data synchronization</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Keep all your systems in perfect sync with real-time data updates and intelligent conflict resolution.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AqlHRConnect;