import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Users, FileText, Clock, Settings, Plus } from "lucide-react";

const CommitteeManagement = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Committee Management System</h1>
          <p className="text-muted-foreground">Comprehensive governance and oversight committees</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Committee
        </Button>
      </div>
      
      {/* Committee Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Active Committees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">18</div>
            <p className="text-sm text-muted-foreground">All functional</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Committee Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">127</div>
            <p className="text-sm text-muted-foreground">Across all committees</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Meetings This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">34</div>
            <p className="text-sm text-muted-foreground">96% attendance rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Action Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-warning">23</div>
            <p className="text-sm text-muted-foreground">Pending completion</p>
          </CardContent>
        </Card>
      </div>

      {/* Committee Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Board Committees
            </CardTitle>
            <CardDescription>Executive oversight and governance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Executive Committee</span>
                <Badge variant="secondary" className="bg-status-success text-white">Active</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Board of Directors</span>
                <Badge variant="secondary" className="bg-status-success text-white">Active</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Nomination Committee</span>
                <Badge variant="secondary" className="bg-status-success text-white">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-success" />
              HR Committees
            </CardTitle>
            <CardDescription>Strategic HR decision-making</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">HR Strategic Committee</span>
                <Badge variant="secondary" className="bg-status-success text-white">Active</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Compensation Committee</span>
                <Badge variant="secondary" className="bg-status-success text-white">Active</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Employee Relations</span>
                <Badge variant="secondary" className="bg-primary text-white">Meeting</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-accent" />
              Compliance Committees
            </CardTitle>
            <CardDescription>Regulatory oversight and monitoring</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Compliance Oversight</span>
                <Badge variant="secondary" className="bg-status-success text-white">Active</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Risk Management</span>
                <Badge variant="secondary" className="bg-status-success text-white">Active</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Ethics Committee</span>
                <Badge variant="secondary" className="bg-status-success text-white">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-warning" />
              Audit Committees
            </CardTitle>
            <CardDescription>Internal and external audit coordination</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Internal Audit</span>
                <Badge variant="secondary" className="bg-status-success text-white">Active</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">External Audit</span>
                <Badge variant="secondary" className="bg-primary text-white">Scheduled</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">IT Audit</span>
                <Badge variant="secondary" className="bg-status-success text-white">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Safety Committees
            </CardTitle>
            <CardDescription>Workplace safety and health compliance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Health & Safety</span>
                <Badge variant="secondary" className="bg-status-success text-white">Active</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Emergency Response</span>
                <Badge variant="secondary" className="bg-status-success text-white">Active</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Environmental</span>
                <Badge variant="secondary" className="bg-status-success text-white">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-accent" />
              Meeting Management
            </CardTitle>
            <CardDescription>Scheduling, agendas, and action tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Scheduled Meetings</span>
                <span className="text-sm font-medium">15</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Completed Actions</span>
                <span className="text-sm font-medium">89%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Average Attendance</span>
                <span className="text-sm font-medium">96%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Committee Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Recent Committee Activity
          </CardTitle>
          <CardDescription>Latest committee meetings and decisions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-medium">HR Strategic Committee Meeting</div>
                <div className="text-sm text-muted-foreground">Discussed Q1 2025 hiring targets and Saudization goals</div>
              </div>
              <Badge variant="secondary" className="bg-status-success text-white">Completed</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-medium">Compliance Oversight Review</div>
                <div className="text-sm text-muted-foreground">Monthly compliance metrics and government integration updates</div>
              </div>
              <Badge variant="secondary" className="bg-primary text-white">In Progress</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-medium">Board of Directors Session</div>
                <div className="text-sm text-muted-foreground">Strategic direction and PIF partnership planning</div>
              </div>
              <Badge variant="secondary" className="bg-accent text-white">Scheduled</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommitteeManagement;