import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FileText, Calendar, AlertTriangle, CheckCircle, Plus, Search, Filter, Upload } from "lucide-react";
import EduBox from "@/components/EduBox";

const LegalDocumentTracking = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <FileText className="h-8 w-8 text-brand-primary" />
            Legal Document Tracking
            <EduBox
              title="Legal Document Management"
              description="Comprehensive legal document tracking with automated expiry alerts and compliance monitoring"
              howToUse="Upload, categorize, and monitor legal documents with automated renewal reminders"
              linkedFeatures={['Contract Management', 'Compliance Monitoring', 'Document Intelligence']}
              userLevel="hr_admin"
            >
              <></>
            </EduBox>
          </h1>
          <p className="text-muted-foreground">Contract and legal document management system</p>
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
          <Button variant="outline" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload
          </Button>
          <Button className="bg-brand-primary hover:bg-brand-primary/90 text-white flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Document
          </Button>
        </div>
      </div>

      {/* Document Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-brand-primary">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-brand-primary" />
              Active Contracts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">2,847</div>
            <p className="text-sm text-muted-foreground">Employee contracts</p>
          </CardContent>
        </Card>

        <Card className="border-brand-warning">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-brand-warning" />
              Expiring Soon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">23</div>
            <p className="text-sm text-muted-foreground">Next 30 days</p>
          </CardContent>
        </Card>

        <Card className="border-brand-success">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-brand-success" />
              Compliance Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">98.7%</div>
            <Progress value={98.7} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="border-brand-danger">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-brand-danger" />
              Urgent Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-danger">5</div>
            <p className="text-sm text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Document Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-brand-primary" />
              Employment Contracts
            </CardTitle>
            <CardDescription>Employee contract management</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Permanent Contracts</span>
                <div className="flex items-center gap-2">
                  <Badge className="bg-brand-success text-white">2,156</Badge>
                  <Badge className="bg-brand-success text-white">Active</Badge>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Temporary Contracts</span>
                <div className="flex items-center gap-2">
                  <Badge className="bg-brand-primary text-white">345</Badge>
                  <Badge className="bg-brand-primary text-white">Active</Badge>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Expiring This Month</span>
                <div className="flex items-center gap-2">
                  <Badge className="bg-brand-warning text-white">12</Badge>
                  <Badge className="bg-brand-warning text-white">Alert</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-brand-accent" />
              Legal Agreements
            </CardTitle>
            <CardDescription>Non-disclosure and legal documents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">NDA Agreements</span>
                <div className="flex items-center gap-2">
                  <Badge className="bg-brand-success text-white">2,847</Badge>
                  <Badge className="bg-brand-success text-white">Signed</Badge>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Non-Compete Clauses</span>
                <div className="flex items-center gap-2">
                  <Badge className="bg-brand-primary text-white">1,456</Badge>
                  <Badge className="bg-brand-primary text-white">Active</Badge>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Settlement Agreements</span>
                <div className="flex items-center gap-2">
                  <Badge className="bg-brand-accent text-white">23</Badge>
                  <Badge className="bg-brand-accent text-white">Closed</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-brand-success" />
              Compliance Documents
            </CardTitle>
            <CardDescription>Regulatory compliance documentation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Work Permits</span>
                <div className="flex items-center gap-2">
                  <Badge className="bg-brand-success text-white">891</Badge>
                  <Badge className="bg-brand-success text-white">Valid</Badge>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Iqama Documents</span>
                <div className="flex items-center gap-2">
                  <Badge className="bg-brand-primary text-white">934</Badge>
                  <Badge className="bg-brand-primary text-white">Current</Badge>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Medical Certificates</span>
                <div className="flex items-center gap-2">
                  <Badge className="bg-brand-warning text-white">67</Badge>
                  <Badge className="bg-brand-warning text-white">Renewing</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Expiry Tracking Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-brand-warning" />
            Document Expiry Tracking
          </CardTitle>
          <CardDescription>Automated monitoring of document expiration dates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 border rounded-lg bg-brand-danger/10 border-brand-danger">
              <div className="text-2xl font-bold text-brand-danger">5</div>
              <div className="text-sm text-muted-foreground">Expired</div>
            </div>
            <div className="text-center p-4 border rounded-lg bg-brand-warning/10 border-brand-warning">
              <div className="text-2xl font-bold text-brand-warning">18</div>
              <div className="text-sm text-muted-foreground">Expiring This Week</div>
            </div>
            <div className="text-center p-4 border rounded-lg bg-brand-primary/10 border-brand-primary">
              <div className="text-2xl font-bold text-brand-primary">45</div>
              <div className="text-sm text-muted-foreground">Expiring This Month</div>
            </div>
            <div className="text-center p-4 border rounded-lg bg-brand-success/10 border-brand-success">
              <div className="text-2xl font-bold text-brand-success">2,779</div>
              <div className="text-sm text-muted-foreground">Current & Valid</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document Status Tracking */}
      <Card>
        <CardHeader>
          <CardTitle>Document Status Overview</CardTitle>
          <CardDescription>Real-time tracking of document processing and approvals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-border rounded-md hover:bg-surface-secondary transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-brand-danger rounded-full"></div>
                <div>
                  <div className="font-medium text-foreground">Ahmed Al-Rashid - Work Permit Renewal</div>
                  <div className="text-sm text-muted-foreground">Expired 3 days ago • Requires immediate action</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-brand-danger text-white">Urgent</Badge>
                <Button size="sm" variant="outline">Review</Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-border rounded-md hover:bg-surface-secondary transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-brand-warning rounded-full"></div>
                <div>
                  <div className="font-medium text-foreground">Sarah Al-Mansouri - Employment Contract</div>
                  <div className="text-sm text-muted-foreground">Expires in 5 days • Renewal in progress</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-brand-warning text-white">Processing</Badge>
                <Button size="sm" variant="outline">View</Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-border rounded-md hover:bg-surface-secondary transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-brand-success rounded-full"></div>
                <div>
                  <div className="font-medium text-foreground">Mohammed Al-Otaibi - NDA Agreement</div>
                  <div className="text-sm text-muted-foreground">Signed and filed • No action required</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-brand-success text-white">Complete</Badge>
                <Button size="sm" variant="outline">Archive</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LegalDocumentTracking;