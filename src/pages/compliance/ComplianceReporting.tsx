import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FileText, Download, Calendar, TrendingUp, Plus, Search, Filter } from "lucide-react";
import EduBox from "@/components/EduBox";
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";

const ComplianceReporting = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <FileText className="h-8 w-8 text-brand-primary" />
            Compliance Reporting
            <EduBox
              title="Compliance Reporting Suite"
              description="Comprehensive reporting dashboard for regulatory compliance, audit preparation, and executive summaries"
              howToUse="Generate automated compliance reports, schedule regular reporting, and export data for audits"
              linkedFeatures={['Regulatory Compliance', 'Audit Trails', 'Risk Management']}
              userLevel="hr_admin"
            >
              <></>
            </EduBox>
          </h1>
          <p className="text-muted-foreground">Comprehensive compliance reporting and analytics</p>
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
            New Report
          </Button>
        </div>
      </div>

      {/* Reporting Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-brand-primary">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-brand-primary" />
              Reports Generated
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">156</div>
            <p className="text-sm text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card className="border-brand-success">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-brand-success" />
              Compliance Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">96.8%</div>
            <Progress value={96.8} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="border-brand-accent">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-brand-accent" />
              Scheduled Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">12</div>
            <p className="text-sm text-muted-foreground">Auto-generated</p>
          </CardContent>
        </Card>

        <Card className="border-brand-warning">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Download className="h-5 w-5 text-brand-warning" />
              Downloads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">2,847</div>
            <p className="text-sm text-muted-foreground">This quarter</p>
          </CardContent>
        </Card>
      </div>

      {/* Standard Reports */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-brand-primary" />
              Regulatory Compliance Reports
            </CardTitle>
            <CardDescription>Saudi Labor Law and PDPL compliance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Monthly Labor Law Report</span>
                <div className="flex items-center gap-2">
                  <Badge className="bg-brand-success text-white">Ready</Badge>
                  <Button size="sm" variant="outline">
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">PDPL Compliance Summary</span>
                <div className="flex items-center gap-2">
                  <Badge className="bg-brand-success text-white">Ready</Badge>
                  <Button size="sm" variant="outline">
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Saudization Report</span>
                <div className="flex items-center gap-2">
                  <Badge className="bg-brand-primary text-white">Processing</Badge>
                  <Button size="sm" variant="outline" disabled>
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-brand-success" />
              Executive Dashboards
            </CardTitle>
            <CardDescription>High-level compliance summaries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">CEO Compliance Dashboard</span>
                <div className="flex items-center gap-2">
                  <Badge className="bg-brand-success text-white">Daily</Badge>
                  <Button size="sm" variant="outline">
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Board Report Summary</span>
                <div className="flex items-center gap-2">
                  <Badge className="bg-brand-accent text-white">Monthly</Badge>
                  <Button size="sm" variant="outline">
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Risk Committee Report</span>
                <div className="flex items-center gap-2">
                  <Badge className="bg-brand-warning text-white">Quarterly</Badge>
                  <Button size="sm" variant="outline">
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-brand-accent" />
              Audit Reports
            </CardTitle>
            <CardDescription>Internal and external audit preparation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Internal Audit Report</span>
                <div className="flex items-center gap-2">
                  <Badge className="bg-brand-success text-white">Complete</Badge>
                  <Button size="sm" variant="outline">
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">External Audit Package</span>
                <div className="flex items-center gap-2">
                  <Badge className="bg-brand-primary text-white">Preparing</Badge>
                  <Button size="sm" variant="outline">
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Compliance Checklist</span>
                <div className="flex items-center gap-2">
                  <Badge className="bg-brand-success text-white">Ready</Badge>
                  <Button size="sm" variant="outline">
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Custom Reports Builder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-brand-primary" />
            Custom Report Builder
          </CardTitle>
          <CardDescription>Create tailored reports based on specific requirements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 border rounded-lg hover:bg-surface-secondary transition-colors cursor-pointer">
              <div className="font-medium text-foreground mb-2">Employee Data Report</div>
              <div className="text-sm text-muted-foreground mb-3">Comprehensive employee information export</div>
              <Button size="sm" className="bg-brand-primary hover:bg-brand-primary/90 text-white">
                Build Report
              </Button>
            </div>
            
            <div className="p-4 border rounded-lg hover:bg-surface-secondary transition-colors cursor-pointer">
              <div className="font-medium text-foreground mb-2">Compliance Metrics</div>
              <div className="text-sm text-muted-foreground mb-3">Custom compliance KPI dashboard</div>
              <Button size="sm" className="bg-brand-primary hover:bg-brand-primary/90 text-white">
                Build Report
              </Button>
            </div>
            
            <div className="p-4 border rounded-lg hover:bg-surface-secondary transition-colors cursor-pointer">
              <div className="font-medium text-foreground mb-2">Risk Analysis</div>
              <div className="text-sm text-muted-foreground mb-3">Detailed risk assessment reporting</div>
              <Button size="sm" className="bg-brand-primary hover:bg-brand-primary/90 text-white">
                Build Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>Latest generated compliance reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border border-border rounded-md hover:bg-surface-secondary transition-colors">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-brand-primary" />
                <div>
                  <div className="font-medium text-foreground">December 2024 Compliance Summary</div>
                  <div className="text-sm text-muted-foreground">Monthly regulatory compliance report</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-brand-success text-white">Complete</Badge>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 border border-border rounded-md hover:bg-surface-secondary transition-colors">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-brand-accent" />
                <div>
                  <div className="font-medium text-foreground">Q4 2024 Risk Assessment</div>
                  <div className="text-sm text-muted-foreground">Quarterly risk management analysis</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-brand-success text-white">Complete</Badge>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 border border-border rounded-md hover:bg-surface-secondary transition-colors">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-brand-warning" />
                <div>
                  <div className="font-medium text-foreground">PDPL Annual Report 2024</div>
                  <div className="text-sm text-muted-foreground">Data protection compliance summary</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-brand-primary text-white">Processing</Badge>
                <Button size="sm" variant="outline" disabled>
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* AI Integration for Compliance Reporting */}
      <UniversalAIIntegrator 
        pageType="compliance" 
        moduleName="compliance-reporting" 
        companyId="demo-company" 
        enabledFeatures={['report-generation', 'compliance-analytics', 'regulatory-reporting', 'data-analysis']}
      />
    </div>
  );
};

export default ComplianceReporting;