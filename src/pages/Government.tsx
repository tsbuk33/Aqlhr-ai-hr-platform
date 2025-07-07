import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Government = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Government Integrations</h1>
        <p className="text-muted-foreground">Seamless integration with Saudi government platforms</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Qiwa Integration</CardTitle>
            <CardDescription>Employment contracts and transfers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-sm text-muted-foreground">98.1% health</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>GOSI Integration</CardTitle>
            <CardDescription>Insurance and payroll submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-sm text-muted-foreground">99.2% health</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Absher Platform</CardTitle>
            <CardDescription>Identity verification and validation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-sm text-muted-foreground">97.8% health</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mudad Platform</CardTitle>
            <CardDescription>Wage protection system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-sm text-muted-foreground">100% compliance</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Government;