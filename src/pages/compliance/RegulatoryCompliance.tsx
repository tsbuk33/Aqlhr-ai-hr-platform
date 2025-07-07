import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle, Clock, Shield } from "lucide-react";

const RegulatoryCompliance = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Regulatory Compliance Management</h1>
        <p className="text-muted-foreground">Saudi Arabia's most comprehensive HR compliance platform</p>
      </div>
      
      {/* Key Compliance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-status-success">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-status-success" />
              Overall Compliance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-status-success">96.8%</div>
            <Progress value={96.8} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="border-primary">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Saudi Labor Law</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">98.2%</div>
            <Progress value={98.2} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="border-accent">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">PDPL Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">95.4%</div>
            <Progress value={95.4} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="border-warning">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Active Monitoring</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-warning">24/7</div>
            <p className="text-sm text-muted-foreground mt-1">Real-time tracking</p>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-status-success" />
              Labor Law Compliance
            </CardTitle>
            <CardDescription>Saudi Arabia Labor Law adherence</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Working Hours</span>
                <Badge variant="secondary" className="bg-status-success text-white">Compliant</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Leave Policies</span>
                <Badge variant="secondary" className="bg-status-success text-white">Compliant</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">End of Service</span>
                <Badge variant="secondary" className="bg-status-success text-white">Compliant</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Data Protection (PDPL)
            </CardTitle>
            <CardDescription>Personal Data Protection Law compliance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Data Encryption</span>
                <Badge variant="secondary" className="bg-status-success text-white">Active</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Consent Management</span>
                <Badge variant="secondary" className="bg-status-success text-white">Tracking</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Right to Erasure</span>
                <Badge variant="secondary" className="bg-primary text-white">Implemented</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Violation Alerts
            </CardTitle>
            <CardDescription>Immediate compliance issue flagging</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Critical Alerts</span>
                <Badge variant="outline" className="border-status-success text-status-success">0</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Warning Alerts</span>
                <Badge variant="outline" className="border-warning text-warning">2</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Info Alerts</span>
                <Badge variant="outline" className="border-primary text-primary">5</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Monitoring */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Real-time Compliance Monitoring
          </CardTitle>
          <CardDescription>Continuous compliance tracking and regulatory updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-status-success">156</div>
              <div className="text-sm text-muted-foreground">Compliance Checks Today</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-primary">3</div>
              <div className="text-sm text-muted-foreground">Regulatory Updates This Week</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-accent">12</div>
              <div className="text-sm text-muted-foreground">Auto-corrections Applied</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegulatoryCompliance;