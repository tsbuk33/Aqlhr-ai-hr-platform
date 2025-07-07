import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Shield, Users, FileText, AlertTriangle, CheckCircle, Eye } from "lucide-react";

const ComplianceOverview = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Compliance & Governance Overview</h1>
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
            <CardTitle className="text-lg">Active Committees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">18</div>
            <p className="text-sm text-muted-foreground">All functional</p>
          </CardContent>
        </Card>

        <Card className="border-accent">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Audit Trails</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">15,678+</div>
            <p className="text-sm text-muted-foreground">Complete logs</p>
          </CardContent>
        </Card>

        <Card className="border-warning">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Risk Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-warning">Low</div>
            <p className="text-sm text-muted-foreground">Proactive management</p>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Regulatory Compliance Management
            </CardTitle>
            <CardDescription>Saudi Labor Law & PDPL compliance monitoring</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Saudi Labor Law</span>
                <Badge variant="secondary" className="bg-status-success text-white">98.2%</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">PDPL Compliance</span>
                <Badge variant="secondary" className="bg-primary text-white">95.4%</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Real-time Monitoring</span>
                <Badge variant="secondary" className="bg-status-success text-white">24/7</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-success" />
              Committee Management System
            </CardTitle>
            <CardDescription>Comprehensive governance oversight</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Board Committees</span>
                <Badge variant="secondary" className="bg-status-success text-white">3 Active</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">HR Committees</span>
                <Badge variant="secondary" className="bg-primary text-white">4 Active</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Meeting Attendance</span>
                <Badge variant="secondary" className="bg-accent text-white">96%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-accent" />
              Audit Trail Management
            </CardTitle>
            <CardDescription>Complete activity logging & tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Daily Compliance Checks</span>
                <Badge variant="secondary" className="bg-status-success text-white">156</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">User Activities Logged</span>
                <Badge variant="secondary" className="bg-primary text-white">15,678+</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Data Integrity</span>
                <Badge variant="secondary" className="bg-accent text-white">99.8%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Risk Management Framework
            </CardTitle>
            <CardDescription>Systematic risk identification & mitigation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Active Risk Assessments</span>
                <Badge variant="secondary" className="bg-status-success text-white">23</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Mitigation Strategies</span>
                <Badge variant="secondary" className="bg-primary text-white">18</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Risk Level</span>
                <Badge variant="secondary" className="bg-status-success text-white">Low</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Compliance Modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Policy Management
            </CardTitle>
            <CardDescription>47 active policies with 98.7% acknowledgments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">47</div>
              <div className="text-sm text-muted-foreground">Active Policies</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-success" />
              Governance Framework
            </CardTitle>
            <CardDescription>Structured governance and accountability</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">100%</div>
              <div className="text-sm text-muted-foreground">Framework Coverage</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-accent" />
              Legal Document Tracking
            </CardTitle>
            <CardDescription>Contract and legal document management</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">2,847</div>
              <div className="text-sm text-muted-foreground">Active Contracts</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* PIF Partnership Readiness */}
      <Card className="border-primary bg-gradient-to-r from-primary/5 to-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            PIF Partnership Compliance Readiness
          </CardTitle>
          <CardDescription>Saudi Arabia's most compliant HR platform prepared for strategic partnerships</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg bg-white/50">
              <div className="text-2xl font-bold text-status-success">96.8%</div>
              <div className="text-sm text-muted-foreground">Overall Compliance Score</div>
            </div>
            <div className="text-center p-4 border rounded-lg bg-white/50">
              <div className="text-2xl font-bold text-primary">10</div>
              <div className="text-sm text-muted-foreground">Core Compliance Modules</div>
            </div>
            <div className="text-center p-4 border rounded-lg bg-white/50">
              <div className="text-2xl font-bold text-accent">25+</div>
              <div className="text-sm text-muted-foreground">Compliance Features</div>
            </div>
            <div className="text-center p-4 border rounded-lg bg-white/50">
              <div className="text-2xl font-bold text-warning">Enterprise</div>
              <div className="text-sm text-muted-foreground">Security Grade</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplianceOverview;