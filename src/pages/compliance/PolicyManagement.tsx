import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FileText, Users, Clock, CheckCircle, AlertTriangle, Plus, Search, Filter } from "lucide-react";
import EduBox from "@/components/EduBox";

const PolicyManagement = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <FileText className="h-8 w-8 text-brand-primary" />
            Policy Management
            <EduBox
              title="HR Policy Management"
              description="Comprehensive policy lifecycle management with automated compliance tracking and employee acknowledgment"
              howToUse="Create, update, and track policies with automated distribution and acknowledgment collection"
              linkedFeatures={['Compliance Monitoring', 'Employee Communications', 'Legal Document Tracking']}
              userLevel="hr_admin"
            >
              <></>
            </EduBox>
          </h1>
          <p className="text-muted-foreground">Complete policy lifecycle management with compliance tracking</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button className="bg-brand-primary hover:bg-brand-primary/90 text-white flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Policy
          </Button>
        </div>
      </div>

      {/* Policy Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-brand-primary">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-brand-primary" />
              Active Policies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">47</div>
            <p className="text-sm text-muted-foreground">Across all departments</p>
          </CardContent>
        </Card>

        <Card className="border-brand-success">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-brand-success" />
              Acknowledgment Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">98.7%</div>
            <Progress value={98.7} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="border-brand-warning">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-brand-warning" />
              Pending Reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">3</div>
            <p className="text-sm text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>

        <Card className="border-brand-accent">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-brand-accent" />
              Compliance Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">96.4%</div>
            <Progress value={96.4} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Policy Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-brand-primary" />
              HR Core Policies
            </CardTitle>
            <CardDescription>Essential HR policies and procedures</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Employee Handbook</span>
                <Badge className="bg-brand-success text-white">Current</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Code of Conduct</span>
                <Badge className="bg-brand-success text-white">Current</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Leave Policy</span>
                <Badge className="bg-brand-warning text-white">Review Due</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Performance Management</span>
                <Badge className="bg-brand-success text-white">Current</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-brand-warning" />
              Compliance Policies
            </CardTitle>
            <CardDescription>Regulatory and legal compliance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Saudi Labor Law</span>
                <Badge className="bg-brand-success text-white">Current</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">PDPL Privacy Policy</span>
                <Badge className="bg-brand-success text-white">Current</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Anti-Harassment</span>
                <Badge className="bg-brand-success text-white">Current</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Grievance Procedure</span>
                <Badge className="bg-brand-primary text-white">Updated</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-brand-accent" />
              Safety & Security
            </CardTitle>
            <CardDescription>Workplace safety and security policies</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Workplace Safety</span>
                <Badge className="bg-brand-success text-white">Current</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">IT Security Policy</span>
                <Badge className="bg-brand-success text-white">Current</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Remote Work Policy</span>
                <Badge className="bg-brand-warning text-white">Review Due</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Emergency Procedures</span>
                <Badge className="bg-brand-success text-white">Current</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Policy Lifecycle Tracking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-brand-primary" />
            Policy Lifecycle Dashboard
          </CardTitle>
          <CardDescription>Track policy creation, updates, and acknowledgments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 border rounded-lg bg-surface-secondary">
              <div className="text-2xl font-bold text-brand-primary">12</div>
              <div className="text-sm text-muted-foreground">Policies Created This Month</div>
            </div>
            <div className="text-center p-4 border rounded-lg bg-surface-secondary">
              <div className="text-2xl font-bold text-brand-success">2,847</div>
              <div className="text-sm text-muted-foreground">Employee Acknowledgments</div>
            </div>
            <div className="text-center p-4 border rounded-lg bg-surface-secondary">
              <div className="text-2xl font-bold text-brand-warning">7</div>
              <div className="text-sm text-muted-foreground">Policies Pending Review</div>
            </div>
            <div className="text-center p-4 border rounded-lg bg-surface-secondary">
              <div className="text-2xl font-bold text-brand-accent">99.2%</div>
              <div className="text-sm text-muted-foreground">Digital Signature Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Policy Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Policy Activity</CardTitle>
          <CardDescription>Latest policy updates and acknowledgments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border border-border rounded-md hover:bg-surface-secondary transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-brand-success rounded-full"></div>
                <div>
                  <div className="font-medium text-foreground">Employee Handbook v2.1 Published</div>
                  <div className="text-sm text-muted-foreground">Updated workplace safety guidelines</div>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">2 hours ago</div>
            </div>
            
            <div className="flex items-center justify-between p-3 border border-border rounded-md hover:bg-surface-secondary transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-brand-primary rounded-full"></div>
                <div>
                  <div className="font-medium text-foreground">PDPL Privacy Policy Acknowledged</div>
                  <div className="text-sm text-muted-foreground">156 employees completed acknowledgment</div>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">4 hours ago</div>
            </div>
            
            <div className="flex items-center justify-between p-3 border border-border rounded-md hover:bg-surface-secondary transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-brand-warning rounded-full"></div>
                <div>
                  <div className="font-medium text-foreground">Leave Policy Review Scheduled</div>
                  <div className="text-sm text-muted-foreground">Annual review meeting set for next week</div>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">1 day ago</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PolicyManagement;