import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

const QiwaIntegration = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Qiwa Integration</h1>
          <p className="text-muted-foreground">Employment contracts and work permits management</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-status-success text-white">Connected</Badge>
          <Button variant="outline">Sync Now</Button>
        </div>
      </div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="contracts">Contracts</TabsTrigger>
          <TabsTrigger value="permits">Work Permits</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Contracts</CardTitle>
                <CardDescription>Total employment contracts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-brand-primary">2,847</div>
                <p className="text-xs text-muted-foreground mt-2">+12 this month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Processing Success</CardTitle>
                <CardDescription>Successful API calls</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-brand-success">98.1%</div>
                <Progress value={98.1} className="mt-2" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Monthly Transfers</CardTitle>
                <CardDescription>Employee transfers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-brand-accent">45</div>
                <p className="text-xs text-muted-foreground mt-2">-3 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Compliance Score</CardTitle>
                <CardDescription>Overall compliance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-brand-warning">100%</div>
                <Badge variant="outline" className="mt-2 bg-status-success text-white">Excellent</Badge>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="contracts">
          <Card>
            <CardHeader>
              <CardTitle>Contract Management</CardTitle>
              <CardDescription>Manage employment contracts through Qiwa</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Pending Contracts</h4>
                  <p className="text-2xl font-bold text-brand-warning">23</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Active Contracts</h4>
                  <p className="text-2xl font-bold text-brand-success">2,801</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Expired Contracts</h4>
                  <p className="text-2xl font-bold text-brand-accent">23</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="permits">
          <Card>
            <CardHeader>
              <CardTitle>Work Permits Status</CardTitle>
              <CardDescription>Monitor work permit applications and renewals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Active Permits</h4>
                  <p className="text-2xl font-bold text-brand-primary">1,234</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Renewal Due (30 days)</h4>
                  <p className="text-2xl font-bold text-brand-warning">45</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="compliance">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Status</CardTitle>
              <CardDescription>Qiwa compliance requirements and status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Contract Registration</span>
                  <Badge className="bg-status-success text-white">Compliant</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Work Permit Validity</span>
                  <Badge className="bg-status-success text-white">Compliant</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Data Synchronization</span>
                  <Badge className="bg-status-success text-white">Up to Date</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QiwaIntegration;