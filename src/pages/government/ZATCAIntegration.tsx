import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

const ZATCAIntegration = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">ZATCA Integration</h1>
          <p className="text-muted-foreground">Zakat, Tax and Customs Authority compliance</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-status-success text-white">Compliant</Badge>
          <Button variant="outline">File Return</Button>
        </div>
      </div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="returns">Tax Returns</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>VAT Returns Filed</CardTitle>
                <CardDescription>Annual compliance record</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-brand-primary">12/12</div>
                <Progress value={100} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-2">100% on time</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Compliance Rate</CardTitle>
                <CardDescription>Overall tax compliance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-brand-success">100%</div>
                <Badge className="mt-2 bg-status-success text-white">Excellent</Badge>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Tax Collected</CardTitle>
                <CardDescription>VAT collected this year</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-brand-accent">SAR 45.6K</div>
                <p className="text-xs text-muted-foreground mt-2">+12% vs last year</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Penalties Avoided</CardTitle>
                <CardDescription>Savings from compliance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-brand-warning">SAR 23K</div>
                <Badge className="mt-2 bg-status-success text-white">Zero Penalties</Badge>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="returns">
          <Card>
            <CardHeader>
              <CardTitle>VAT Return History</CardTitle>
              <CardDescription>Track all submitted tax returns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Q4 2023</h4>
                  <p className="text-lg font-bold text-brand-success">Filed</p>
                  <p className="text-sm text-muted-foreground">SAR 12.4K</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Q3 2023</h4>
                  <p className="text-lg font-bold text-brand-success">Filed</p>
                  <p className="text-sm text-muted-foreground">SAR 11.8K</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Q2 2023</h4>
                  <p className="text-lg font-bold text-brand-success">Filed</p>
                  <p className="text-sm text-muted-foreground">SAR 10.9K</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Tax Payments</CardTitle>
              <CardDescription>Payment history and status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>VAT Payments</span>
                  <Badge className="bg-status-success text-white">Up to Date</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Withholding Tax</span>
                  <Badge className="bg-status-success text-white">Current</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Zakat Obligations</span>
                  <Badge className="bg-status-success text-white">Compliant</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="compliance">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Status</CardTitle>
              <CardDescription>ZATCA regulatory compliance overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Registration Status</span>
                  <Badge className="bg-status-success text-white">Active</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Filing Requirements</span>
                  <Badge className="bg-status-success text-white">Met</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Payment Obligations</span>
                  <Badge className="bg-status-success text-white">Current</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Record Keeping</span>
                  <Badge className="bg-status-success text-white">Compliant</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ZATCAIntegration;