import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Download, Filter, Shield, Eye, Clock } from "lucide-react";
import { AqlHRAIAssistant } from '@/components/ai';

const AuditTrails = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Audit Trail Management</h1>
          <p className="text-muted-foreground">Complete activity logging and compliance tracking</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search Logs
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      
      {/* Audit Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-primary">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Total Audit Trails
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">15,678+</div>
            <p className="text-sm text-muted-foreground">Complete activity logs</p>
          </CardContent>
        </Card>

        <Card className="border-status-success">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Daily Compliance Checks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-status-success">156</div>
            <p className="text-sm text-muted-foreground">Automated verifications</p>
          </CardContent>
        </Card>

        <Card className="border-accent">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Risk Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">Low</div>
            <p className="text-sm text-muted-foreground">Proactive identification</p>
          </CardContent>
        </Card>

        <Card className="border-warning">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Data Integrity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-warning">99.8%</div>
            <p className="text-sm text-muted-foreground">Historical accuracy</p>
          </CardContent>
        </Card>
      </div>

      {/* Audit Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              User Activity Logs
            </CardTitle>
            <CardDescription>Detailed user action tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Login/Logout Events</span>
                <Badge variant="secondary" className="bg-status-success text-white">2,847</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Data Access Events</span>
                <Badge variant="secondary" className="bg-primary text-white">12,456</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Permission Changes</span>
                <Badge variant="secondary" className="bg-accent text-white">234</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-success" />
              Data Change Logs
            </CardTitle>
            <CardDescription>All data modification tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Employee Records</span>
                <Badge variant="secondary" className="bg-status-success text-white">5,678</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Payroll Changes</span>
                <Badge variant="secondary" className="bg-primary text-white">1,234</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Policy Updates</span>
                <Badge variant="secondary" className="bg-accent text-white">89</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-accent" />
              Access Logs
            </CardTitle>
            <CardDescription>Login and system access monitoring</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Successful Logins</span>
                <Badge variant="secondary" className="bg-status-success text-white">8,456</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Failed Attempts</span>
                <Badge variant="secondary" className="bg-warning text-white">12</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Session Timeouts</span>
                <Badge variant="secondary" className="bg-primary text-white">234</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Audit Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Recent Audit Activity
          </CardTitle>
          <CardDescription>Latest system activities and changes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="border-status-success text-status-success">LOGIN</Badge>
                <div>
                  <div className="font-medium">HR Manager logged in</div>
                  <div className="text-sm text-muted-foreground">Ahmed Al-Rashid • 10:34 AM • IP: 192.168.1.45</div>
                </div>
              </div>
              <span className="text-sm text-muted-foreground">2 minutes ago</span>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="border-primary text-primary">UPDATE</Badge>
                <div>
                  <div className="font-medium">Employee salary updated</div>
                  <div className="text-sm text-muted-foreground">Employee ID: EMP-2847 • Salary: SAR 18,500 → SAR 19,000</div>
                </div>
              </div>
              <span className="text-sm text-muted-foreground">15 minutes ago</span>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="border-accent text-accent">ACCESS</Badge>
                <div>
                  <div className="font-medium">Compliance report generated</div>
                  <div className="text-sm text-muted-foreground">Monthly compliance dashboard • Export to PDF</div>
                </div>
              </div>
              <span className="text-sm text-muted-foreground">32 minutes ago</span>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="border-warning text-warning">ALERT</Badge>
                <div>
                  <div className="font-medium">Policy acknowledgment reminder</div>
                  <div className="text-sm text-muted-foreground">15 employees pending policy acknowledgment</div>
                </div>
              </div>
              <span className="text-sm text-muted-foreground">1 hour ago</span>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="border-primary text-primary">SYNC</Badge>
                <div>
                  <div className="font-medium">Government data sync completed</div>
                  <div className="text-sm text-muted-foreground">GOSI data synchronization • 2,847 employee records</div>
                </div>
              </div>
              <span className="text-sm text-muted-foreground">2 hours ago</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>System Performance</CardTitle>
            <CardDescription>Audit system health metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Log Capture Rate</span>
                <span className="text-sm font-medium">100%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Data Retention</span>
                <span className="text-sm font-medium">7 Years</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Storage Used</span>
                <span className="text-sm font-medium">2.3 TB</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Compliance Metrics</CardTitle>
            <CardDescription>Regulatory compliance tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Saudi Labor Law</span>
                <span className="text-sm font-medium">98.2%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">PDPL Compliance</span>
                <span className="text-sm font-medium">95.4%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Internal Policies</span>
                <span className="text-sm font-medium">99.1%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security Metrics</CardTitle>
            <CardDescription>Security and access control</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Failed Login Rate</span>
                <span className="text-sm font-medium">0.14%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Unauthorized Access</span>
                <span className="text-sm font-medium">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Data Breaches</span>
                <span className="text-sm font-medium">0</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <AqlHRAIAssistant moduleContext="compliance.auditTrails" />
    </div>
  );
};

export default AuditTrails;