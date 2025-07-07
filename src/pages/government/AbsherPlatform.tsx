import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

const AbsherPlatform = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Absher Platform</h1>
          <p className="text-muted-foreground">Identity verification and document validation</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-status-success text-white">Online</Badge>
          <Button variant="outline">Test Connection</Button>
        </div>
      </div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="verification">Verification</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Verified IDs</CardTitle>
                <CardDescription>Total ID verifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-brand-primary">2,456</div>
                <p className="text-xs text-muted-foreground mt-2">+89 today</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Verification Rate</CardTitle>
                <CardDescription>Success percentage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-brand-success">97.8%</div>
                <Progress value={97.8} className="mt-2" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Response Time</CardTitle>
                <CardDescription>Average API response</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-brand-accent">1.2s</div>
                <Badge className="mt-2 bg-status-success text-white">Excellent</Badge>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Daily Checks</CardTitle>
                <CardDescription>Verifications today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-brand-warning">234</div>
                <p className="text-xs text-muted-foreground mt-2">Peak: 345 (last week)</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="verification">
          <Card>
            <CardHeader>
              <CardTitle>Identity Verification Process</CardTitle>
              <CardDescription>Real-time ID validation through Absher</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Saudi Nationals</h4>
                  <p className="text-2xl font-bold text-brand-success">1,876</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Residents</h4>
                  <p className="text-2xl font-bold text-brand-accent">580</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Failed Verifications</h4>
                  <p className="text-2xl font-bold text-brand-warning">12</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Document Validation</CardTitle>
              <CardDescription>Validate official documents through Absher</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>National ID Cards</span>
                  <Badge className="bg-status-success text-white">2,456 Validated</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Residence Permits</span>
                  <Badge className="bg-status-success text-white">580 Validated</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Passport Documents</span>
                  <Badge className="bg-status-success text-white">234 Validated</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security & Privacy</CardTitle>
              <CardDescription>Data protection and security measures</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Data Encryption</span>
                  <Badge className="bg-status-success text-white">AES-256</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>API Security</span>
                  <Badge className="bg-status-success text-white">OAuth 2.0</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Compliance Status</span>
                  <Badge className="bg-status-success text-white">PDPL Compliant</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AbsherPlatform;