import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Shield, Users, FileText, CheckCircle, Settings, Plus, Search } from "lucide-react";
import EduBox from "@/components/EduBox";

const GovernanceFramework = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Shield className="h-8 w-8 text-brand-primary" />
            Governance Framework
            <EduBox
              title="Corporate Governance"
              description="Comprehensive governance framework ensuring accountability, transparency, and strategic oversight"
              howToUse="Monitor governance structures, track board activities, and ensure compliance with corporate governance standards"
              linkedFeatures={['Committee Management', 'Policy Management', 'Audit Trails']}
              userLevel="system_admin"
            >
              <></>
            </EduBox>
          </h1>
          <p className="text-muted-foreground">Structured governance and accountability framework</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search
          </Button>
          <Button className="bg-brand-primary hover:bg-brand-primary/90 text-white flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Framework
          </Button>
        </div>
      </div>

      {/* Governance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-brand-success">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-brand-success" />
              Framework Coverage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">100%</div>
            <Progress value={100} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="border-brand-primary">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-brand-primary" />
              Board Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">12</div>
            <p className="text-sm text-muted-foreground">Active members</p>
          </CardContent>
        </Card>

        <Card className="border-brand-accent">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-brand-accent" />
              Governance Policies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">28</div>
            <p className="text-sm text-muted-foreground">Active policies</p>
          </CardContent>
        </Card>

        <Card className="border-brand-warning">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Settings className="h-5 w-5 text-brand-warning" />
              Compliance Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">AAA</div>
            <p className="text-sm text-muted-foreground">Highest grade</p>
          </CardContent>
        </Card>
      </div>

      {/* Governance Structure */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-brand-primary" />
              Board of Directors
            </CardTitle>
            <CardDescription>Executive oversight and strategic direction</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 border border-border rounded-md">
                <div>
                  <div className="font-medium text-foreground">Board of Directors</div>
                  <div className="text-sm text-muted-foreground">7 members • Monthly meetings</div>
                </div>
                <Badge className="bg-brand-success text-white">Active</Badge>
              </div>
              
              <div className="flex justify-between items-center p-3 border border-border rounded-md">
                <div>
                  <div className="font-medium text-foreground">Audit Committee</div>
                  <div className="text-sm text-muted-foreground">3 members • Quarterly meetings</div>
                </div>
                <Badge className="bg-brand-success text-white">Active</Badge>
              </div>
              
              <div className="flex justify-between items-center p-3 border border-border rounded-md">
                <div>
                  <div className="font-medium text-foreground">Risk Committee</div>
                  <div className="text-sm text-muted-foreground">4 members • Bi-monthly meetings</div>
                </div>
                <Badge className="bg-brand-success text-white">Active</Badge>
              </div>
              
              <div className="flex justify-between items-center p-3 border border-border rounded-md">
                <div>
                  <div className="font-medium text-foreground">Remuneration Committee</div>
                  <div className="text-sm text-muted-foreground">3 members • Annual meetings</div>
                </div>
                <Badge className="bg-brand-primary text-white">Scheduled</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-brand-accent" />
              Executive Management
            </CardTitle>
            <CardDescription>Operational leadership and execution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 border border-border rounded-md">
                <div>
                  <div className="font-medium text-foreground">Executive Committee</div>
                  <div className="text-sm text-muted-foreground">5 members • Weekly meetings</div>
                </div>
                <Badge className="bg-brand-success text-white">Active</Badge>
              </div>
              
              <div className="flex justify-between items-center p-3 border border-border rounded-md">
                <div>
                  <div className="font-medium text-foreground">HR Leadership Team</div>
                  <div className="text-sm text-muted-foreground">8 members • Bi-weekly meetings</div>
                </div>
                <Badge className="bg-brand-success text-white">Active</Badge>
              </div>
              
              <div className="flex justify-between items-center p-3 border border-border rounded-md">
                <div>
                  <div className="font-medium text-foreground">Strategic Planning Committee</div>
                  <div className="text-sm text-muted-foreground">6 members • Monthly meetings</div>
                </div>
                <Badge className="bg-brand-success text-white">Active</Badge>
              </div>
              
              <div className="flex justify-between items-center p-3 border border-border rounded-md">
                <div>
                  <div className="font-medium text-foreground">Compliance Officer</div>
                  <div className="text-sm text-muted-foreground">1 officer • Daily oversight</div>
                </div>
                <Badge className="bg-brand-success text-white">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Governance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-brand-primary" />
            Governance Performance Metrics
          </CardTitle>
          <CardDescription>Key governance indicators and performance tracking</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 border rounded-lg bg-surface-secondary">
              <div className="text-2xl font-bold text-brand-success">96%</div>
              <div className="text-sm text-muted-foreground">Board Meeting Attendance</div>
            </div>
            <div className="text-center p-4 border rounded-lg bg-surface-secondary">
              <div className="text-2xl font-bold text-brand-primary">100%</div>
              <div className="text-sm text-muted-foreground">Policy Compliance Rate</div>
            </div>
            <div className="text-center p-4 border rounded-lg bg-surface-secondary">
              <div className="text-2xl font-bold text-brand-accent">24</div>
              <div className="text-sm text-muted-foreground">Board Meetings This Year</div>
            </div>
            <div className="text-center p-4 border rounded-lg bg-surface-secondary">
              <div className="text-2xl font-bold text-brand-warning">7</div>
              <div className="text-sm text-muted-foreground">Strategic Initiatives</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Governance Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Governance Activities</CardTitle>
          <CardDescription>Latest board decisions and governance updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border border-border rounded-md hover:bg-surface-secondary transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-brand-success rounded-full"></div>
                <div>
                  <div className="font-medium text-foreground">Board Resolution 2025-001 Approved</div>
                  <div className="text-sm text-muted-foreground">Strategic HR transformation initiative approved</div>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">2 days ago</div>
            </div>
            
            <div className="flex items-center justify-between p-3 border border-border rounded-md hover:bg-surface-secondary transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-brand-primary rounded-full"></div>
                <div>
                  <div className="font-medium text-foreground">Annual Governance Review Completed</div>
                  <div className="text-sm text-muted-foreground">All committees reviewed and approved</div>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">1 week ago</div>
            </div>
            
            <div className="flex items-center justify-between p-3 border border-border rounded-md hover:bg-surface-secondary transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-brand-accent rounded-full"></div>
                <div>
                  <div className="font-medium text-foreground">New Independent Director Appointed</div>
                  <div className="text-sm text-muted-foreground">Ms. Sarah Al-Fahad joins the board</div>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">2 weeks ago</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GovernanceFramework;