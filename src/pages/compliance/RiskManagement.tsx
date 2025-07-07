import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Shield, TrendingDown, TrendingUp, Plus, Search, Filter } from "lucide-react";
import EduBox from "@/components/EduBox";

const RiskManagement = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <AlertTriangle className="h-8 w-8 text-brand-warning" />
            Risk Management Framework
            <EduBox
              title="HR Risk Management"
              description="Comprehensive risk identification, assessment, and mitigation framework for HR operations"
              howToUse="Monitor risk indicators, create mitigation plans, and track risk reduction over time"
              linkedFeatures={['Compliance Monitoring', 'Audit Trails', 'Policy Management']}
              userLevel="hr_admin"
            >
              <></>
            </EduBox>
          </h1>
          <p className="text-muted-foreground">Systematic risk identification and mitigation strategies</p>
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
          <Button className="bg-brand-warning hover:bg-brand-warning/90 text-white flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Risk Assessment
          </Button>
        </div>
      </div>

      {/* Risk Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-brand-success">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-brand-success" />
              Overall Risk Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">Low</div>
            <p className="text-sm text-muted-foreground">Well managed</p>
          </CardContent>
        </Card>

        <Card className="border-brand-primary">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-brand-primary" />
              Active Risks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">23</div>
            <p className="text-sm text-muted-foreground">Being monitored</p>
          </CardContent>
        </Card>

        <Card className="border-brand-accent">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-brand-accent" />
              Mitigation Strategies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">18</div>
            <p className="text-sm text-muted-foreground">Implemented</p>
          </CardContent>
        </Card>

        <Card className="border-brand-warning">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-brand-warning" />
              Risk Score Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">-12%</div>
            <p className="text-sm text-muted-foreground">Improvement</p>
          </CardContent>
        </Card>
      </div>

      {/* Risk Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-brand-danger" />
              Legal & Compliance Risks
            </CardTitle>
            <CardDescription>Regulatory and legal compliance risks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Saudi Labor Law Violations</span>
                <Badge className="bg-brand-success text-white">Low</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">PDPL Non-compliance</span>
                <Badge className="bg-brand-success text-white">Low</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Contract Disputes</span>
                <Badge className="bg-brand-warning text-white">Medium</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Discrimination Claims</span>
                <Badge className="bg-brand-success text-white">Low</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-brand-warning" />
              Operational Risks
            </CardTitle>
            <CardDescription>Day-to-day operational risks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">High Employee Turnover</span>
                <Badge className="bg-brand-warning text-white">Medium</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Skills Gap</span>
                <Badge className="bg-brand-primary text-white">Medium</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Succession Planning</span>
                <Badge className="bg-brand-success text-white">Low</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Performance Issues</span>
                <Badge className="bg-brand-success text-white">Low</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-brand-accent" />
              Financial Risks
            </CardTitle>
            <CardDescription>Financial and budget-related risks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Payroll Errors</span>
                <Badge className="bg-brand-success text-white">Low</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Budget Overruns</span>
                <Badge className="bg-brand-warning text-white">Medium</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">EOSB Liability</span>
                <Badge className="bg-brand-primary text-white">Monitored</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Benefits Cost Inflation</span>
                <Badge className="bg-brand-warning text-white">Medium</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Heat Map */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-brand-primary" />
            Risk Heat Map
          </CardTitle>
          <CardDescription>Visual representation of risk probability vs impact</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2 max-w-lg">
            {/* High Impact Row */}
            <div className="text-center text-sm font-medium p-2">High Impact</div>
            <div className="bg-brand-warning/20 border-2 border-brand-warning p-4 rounded text-center text-sm">
              <div className="font-medium">Medium</div>
              <div className="text-xs">2 risks</div>
            </div>
            <div className="bg-brand-danger/20 border-2 border-brand-danger p-4 rounded text-center text-sm">
              <div className="font-medium">High</div>
              <div className="text-xs">0 risks</div>
            </div>
            
            {/* Medium Impact Row */}
            <div className="text-center text-sm font-medium p-2">Medium Impact</div>
            <div className="bg-brand-success/20 border-2 border-brand-success p-4 rounded text-center text-sm">
              <div className="font-medium">Low</div>
              <div className="text-xs">8 risks</div>
            </div>
            <div className="bg-brand-warning/20 border-2 border-brand-warning p-4 rounded text-center text-sm">
              <div className="font-medium">Medium</div>
              <div className="text-xs">4 risks</div>
            </div>
            
            {/* Low Impact Row */}
            <div className="text-center text-sm font-medium p-2">Low Impact</div>
            <div className="bg-brand-success/20 border-2 border-brand-success p-4 rounded text-center text-sm">
              <div className="font-medium">Low</div>
              <div className="text-xs">9 risks</div>
            </div>
            <div className="bg-brand-success/20 border-2 border-brand-success p-4 rounded text-center text-sm">
              <div className="font-medium">Low</div>
              <div className="text-xs">0 risks</div>
            </div>
            
            {/* Column headers */}
            <div></div>
            <div className="text-center text-sm font-medium p-2">Low Probability</div>
            <div className="text-center text-sm font-medium p-2">High Probability</div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Mitigation Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Active Risk Mitigation Plans</CardTitle>
          <CardDescription>Current strategies and action items</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-border rounded-md hover:bg-surface-secondary transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-brand-warning rounded-full"></div>
                <div>
                  <div className="font-medium text-foreground">Employee Turnover Reduction Program</div>
                  <div className="text-sm text-muted-foreground">Target: Reduce turnover by 15% by Q2 2025</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={67} className="w-24" />
                <span className="text-sm text-muted-foreground">67%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-border rounded-md hover:bg-surface-secondary transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-brand-primary rounded-full"></div>
                <div>
                  <div className="font-medium text-foreground">Skills Development Initiative</div>
                  <div className="text-sm text-muted-foreground">Addressing critical skills gaps identified</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={43} className="w-24" />
                <span className="text-sm text-muted-foreground">43%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-border rounded-md hover:bg-surface-secondary transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-brand-success rounded-full"></div>
                <div>
                  <div className="font-medium text-foreground">Compliance Training Program</div>
                  <div className="text-sm text-muted-foreground">Ongoing Saudi Labor Law education</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={89} className="w-24" />
                <span className="text-sm text-muted-foreground">89%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskManagement;