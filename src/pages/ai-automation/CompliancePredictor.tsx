import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Shield, AlertTriangle, TrendingDown, CheckCircle, Brain, Activity } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import EduBox from "@/components/EduBox";

const CompliancePredictor = () => {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            AI Compliance Predictor
          </h1>
          <p className="text-muted-foreground mt-2">
            Forecast compliance risks using historical audit data and predictive analytics
          </p>
        </div>
        <EduBox
          title="AI Compliance Predictor"
          description="Advanced AI system that analyzes historical audit patterns to predict potential compliance risks and prevent violations before they occur"
          howToUse="Review risk predictions and implement suggested preventive measures to maintain compliance"
          linkedFeatures={['Risk Assessment', 'Audit History', 'Compliance Monitoring']}
          userLevel="hr_admin"
        >
          <Shield className="h-5 w-5" />
        </EduBox>
      </div>

      {/* AI Tool Configuration */}
      <Card className="border-brand-warning/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-brand-warning" />
            ChatGPT Configuration
          </CardTitle>
          <CardDescription>AI parameters for compliance risk prediction</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Model</div>
              <Badge variant="outline" className="bg-blue-50 text-blue-700">gpt-4-turbo-instruct</Badge>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Temperature</div>
              <Badge variant="outline" className="bg-green-50 text-green-700">0.0</Badge>
            </div>
          </div>
          <div className="pt-4 border-t">
            <div className="text-sm font-medium text-muted-foreground mb-2">Prompt Template</div>
            <div className="p-3 bg-muted rounded-md text-sm font-mono">
              "Analyze compliance risk patterns from historical data: &#123;&#123; audit_history &#125;&#125;. Current status: &#123;&#123; current_metrics &#125;&#125;. Predict potential violations and recommend preventive actions."
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risk Prediction Precision</CardTitle>
            <Shield className="h-4 w-4 text-brand-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-success">91.8%</div>
            <p className="text-xs text-muted-foreground">Accuracy in identifying actual risks</p>
            <Progress value={91.8} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">False Positive Rate</CardTitle>
            <TrendingDown className="h-4 w-4 text-brand-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-accent">4.2%</div>
            <p className="text-xs text-muted-foreground">Lower is better - target &lt;5%</p>
            <Progress value={4.2} className="h-2 mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Risk Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-brand-danger" />
              High-Risk Areas
            </CardTitle>
            <CardDescription>Areas requiring immediate attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { 
                  area: "GOSI Contribution Delays",
                  riskLevel: "High",
                  probability: "78%",
                  impact: "Financial Penalty",
                  timeline: "Next 15 days"
                },
                {
                  area: "Nitaqat Compliance",
                  riskLevel: "Medium", 
                  probability: "45%",
                  impact: "License Suspension",
                  timeline: "Next 30 days"
                },
                {
                  area: "Labor Law Documentation",
                  riskLevel: "High",
                  probability: "82%",
                  impact: "Audit Violation",
                  timeline: "Next 7 days"
                },
              ].map((risk, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium text-foreground">{risk.area}</div>
                      <div className="text-sm text-muted-foreground">Expected impact: {risk.impact}</div>
                    </div>
                    <Badge 
                      variant={risk.riskLevel === 'High' ? 'destructive' : 'secondary'}
                      className="text-xs"
                    >
                      {risk.riskLevel} Risk
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Probability</div>
                      <div className="font-medium text-brand-danger">{risk.probability}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Timeline</div>
                      <div className="font-medium">{risk.timeline}</div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="w-full">
                    View Recommendations
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-brand-success" />
              Preventive Actions
            </CardTitle>
            <CardDescription>AI-recommended compliance measures</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  action: "Update GOSI Payment Schedule",
                  priority: "Urgent",
                  effort: "Low",
                  impact: "High",
                  deadline: "3 days"
                },
                {
                  action: "Review Saudization Targets",
                  priority: "High",
                  effort: "Medium", 
                  impact: "High",
                  deadline: "1 week"
                },
                {
                  action: "Complete Employment Contract Audit",
                  priority: "Critical",
                  effort: "High",
                  impact: "Very High", 
                  deadline: "2 days"
                },
              ].map((action, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium text-foreground">{action.action}</div>
                      <div className="text-sm text-muted-foreground">Due in {action.deadline}</div>
                    </div>
                    <Badge 
                      variant={action.priority === 'Critical' ? 'destructive' : action.priority === 'Urgent' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {action.priority}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Effort Required</div>
                      <div className="font-medium">{action.effort}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Expected Impact</div>
                      <div className="font-medium text-brand-success">{action.impact}</div>
                    </div>
                  </div>
                  <Button size="sm" className="w-full">
                    Start Action
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Trend Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-brand-primary" />
            Compliance Trend Analysis
          </CardTitle>
          <CardDescription>Historical patterns and future projections</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-brand-success">96.8%</div>
              <div className="text-sm text-muted-foreground">Current Compliance Score</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-brand-warning">3</div>
              <div className="text-sm text-muted-foreground">Predicted Risks This Month</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-brand-accent">12</div>
              <div className="text-sm text-muted-foreground">Preventive Actions Taken</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-brand-primary">99.2%</div>
              <div className="text-sm text-muted-foreground">Projected Score (Next Month)</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompliancePredictor;