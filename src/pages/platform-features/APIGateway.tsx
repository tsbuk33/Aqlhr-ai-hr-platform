import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Database, Globe, Plug, Zap, Shield, Clock, CheckCircle2 } from "lucide-react";

const APIGateway = () => {
  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          RESTful API Gateway + ERP Integration Hub
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Connect SanadHR with any ERP system, attendance tool, or enterprise application through our robust API gateway
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-primary opacity-10 rounded-full -translate-y-12 translate-x-12"></div>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-muted-foreground">API Endpoints</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-brand-primary">247</div>
              <div className="flex items-center gap-2 text-sm">
                <Globe className="h-4 w-4 text-brand-primary" />
                <span className="text-muted-foreground">Active integrations</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-secondary opacity-10 rounded-full -translate-y-12 translate-x-12"></div>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-muted-foreground">Daily Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-brand-success">89.3K</div>
              <div className="flex items-center gap-2 text-sm">
                <Database className="h-4 w-4 text-brand-success" />
                <span className="text-muted-foreground">Data exchanges</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-accent opacity-10 rounded-full -translate-y-12 translate-x-12"></div>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-muted-foreground">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-brand-accent">99.97%</div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-brand-accent" />
                <span className="text-muted-foreground">Reliability</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-hero opacity-10 rounded-full -translate-y-12 translate-x-12"></div>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-muted-foreground">Avg Response</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-brand-warning">0.3s</div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-brand-warning" />
                <span className="text-muted-foreground">Lightning fast</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ERP Integration Flow */}
      <Card className="p-8">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <Plug className="h-6 w-6 text-brand-primary" />
            Universal ERP Integration Architecture
          </CardTitle>
          <CardDescription>How SanadHR connects with any ERP system or attendance tool</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
                <Database className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg">Data Mapping</h3>
              <p className="text-sm text-muted-foreground">
                Intelligent field mapping between your ERP system and SanadHR data structures
              </p>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                Auto-Detection
              </Badge>
            </div>

            <ArrowRight className="hidden md:block h-6 w-6 text-muted-foreground self-center justify-self-center" />

            {/* Step 2 */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg">Secure Tunnel</h3>
              <p className="text-sm text-muted-foreground">
                Encrypted data transmission with OAuth 2.0, API keys, and webhook verification
              </p>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                SSL/TLS Encrypted
              </Badge>
            </div>

            <ArrowRight className="hidden md:block h-6 w-6 text-muted-foreground self-center justify-self-center" />

            {/* Step 3 */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center mx-auto">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg">Real-Time Sync</h3>
              <p className="text-sm text-muted-foreground">
                Bidirectional data synchronization with conflict resolution and error handling
              </p>
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                Instant Updates
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Integration Tabs */}
      <Tabs defaultValue="erp-systems" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="erp-systems">ERP Systems</TabsTrigger>
          <TabsTrigger value="attendance">Attendance Tools</TabsTrigger>
          <TabsTrigger value="api-docs">API Documentation</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
        </TabsList>
        
        <TabsContent value="erp-systems" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Supported ERP Systems</CardTitle>
              <CardDescription>Pre-built connectors for major ERP platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { name: "SAP Business One", status: "Active", integrations: 45 },
                  { name: "Oracle NetSuite", status: "Active", integrations: 32 },
                  { name: "Microsoft Dynamics", status: "Active", integrations: 28 },
                  { name: "Odoo ERP", status: "Active", integrations: 67 },
                  { name: "QuickBooks Enterprise", status: "Active", integrations: 89 },
                  { name: "Sage X3", status: "Active", integrations: 23 }
                ].map((erp, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{erp.name}</h4>
                      <Badge variant="secondary" className="bg-green-50 text-green-700">
                        {erp.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{erp.integrations} active connections</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Attendance System Connectors</CardTitle>
              <CardDescription>Connect any attendance hardware or software</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Biometric Devices", types: "Fingerprint, Face Recognition, Iris Scanners", count: "1,247 devices" },
                  { name: "Card Readers", types: "RFID, Magnetic Stripe, Smart Cards", count: "892 readers" },
                  { name: "Mobile Apps", types: "iOS, Android, Web-based Apps", count: "156 apps" },
                  { name: "Time Clocks", types: "Traditional Punch Clocks, Digital Terminals", count: "445 clocks" }
                ].map((system, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <h4 className="font-medium">{system.name}</h4>
                      <p className="text-sm text-muted-foreground">{system.types}</p>
                    </div>
                    <Badge variant="outline">{system.count}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api-docs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Endpoints</CardTitle>
              <CardDescription>RESTful APIs for seamless integration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { endpoint: "POST /api/attendance/sync", description: "Sync attendance data from external systems", rate: "1000/hour" },
                  { endpoint: "GET /api/employees/export", description: "Export employee data to ERP systems", rate: "500/hour" },
                  { endpoint: "POST /api/payroll/import", description: "Import payroll data from external systems", rate: "200/hour" },
                  { endpoint: "PUT /api/schedules/update", description: "Update work schedules from ERP", rate: "300/hour" }
                ].map((api, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded">{api.endpoint}</code>
                      <Badge variant="outline">{api.rate}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{api.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Webhook Management</CardTitle>
              <CardDescription>Real-time event notifications to your systems</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { event: "employee.checkin", description: "Employee check-in event", subscribers: 67 },
                  { event: "employee.checkout", description: "Employee check-out event", subscribers: 67 },
                  { event: "payroll.processed", description: "Payroll calculation completed", subscribers: 23 },
                  { event: "schedule.updated", description: "Work schedule changes", subscribers: 45 }
                ].map((webhook, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <code className="text-sm font-mono">{webhook.event}</code>
                      <p className="text-sm text-muted-foreground">{webhook.description}</p>
                    </div>
                    <Badge variant="secondary">{webhook.subscribers} subscribers</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Center */}
      <Card>
        <CardHeader>
          <CardTitle>Integration Control Center</CardTitle>
          <CardDescription>Manage your ERP and attendance system connections</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button className="bg-gradient-primary hover:opacity-90">
              <Plug className="h-4 w-4 mr-2" />
              Add New Integration
            </Button>
            <Button variant="outline">
              <Database className="h-4 w-4 mr-2" />
              View API Documentation
            </Button>
            <Button variant="outline">
              <Shield className="h-4 w-4 mr-2" />
              Security Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default APIGateway;