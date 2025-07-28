import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AqlHRAIAssistant } from "@/components/ai/AqlHRAIAssistant";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Activity, TrendingUp, Users, Brain, Zap, Heart, RefreshCw } from "lucide-react";
import EduBox from "@/components/EduBox";

const RealtimeDashboards = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Real-time AI Dashboards
          </h1>
          <p className="text-muted-foreground mt-2">
            Live KPI monitoring and real-time insights across all 10 AI tools and 21 government integrations
          </p>
        </div>
        <EduBox
          title="Real-time AI Dashboards"
          description="Comprehensive monitoring system for all AI tools and government integrations with live metrics and performance analytics"
          howToUse="Monitor real-time performance metrics, view AI tool status, and track government integration health"
          linkedFeatures={['AI Tools', 'Government Integrations', 'Performance Monitoring']}
          userLevel="system_admin"
        >
          <Activity className="h-5 w-5" />
        </EduBox>
      </div>

      {/* AI Tools Overview */}
      <Card className="border-brand-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-brand-primary" />
            AI Tools Performance
          </CardTitle>
          <CardDescription>Real-time metrics for all 10 ChatGPT-powered AI tools</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-brand-primary">10</div>
              <div className="text-sm text-muted-foreground">AI Tools Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-brand-success">99.8%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-brand-accent">234ms</div>
              <div className="text-sm text-muted-foreground">Avg Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-brand-warning">15,847</div>
              <div className="text-sm text-muted-foreground">Daily Requests</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-brand-secondary">4.8/5</div>
              <div className="text-sm text-muted-foreground">User Satisfaction</div>
            </div>
          </div>

          <div className="space-y-3">
            {[
              { name: "Smart Recommendations", model: "gpt-4-turbo", temp: "0.2", requests: "2,341", accuracy: "94.2%", status: "optimal" },
              { name: "Predictive Analytics", model: "gpt-4-turbo-instruct", temp: "0.0", requests: "1,892", accuracy: "91.8%", status: "optimal" },
              { name: "Document Intelligence", model: "gpt-3.5-embeddings", temp: "0.1", requests: "3,567", accuracy: "89.7%", status: "optimal" },
              { name: "Arabic-English NLP", model: "gpt-4-turbo", temp: "0.0", requests: "1,234", accuracy: "95.1%", status: "optimal" },
              { name: "Automated Workflows", model: "gpt-3.5-command", temp: "0.1", requests: "4,123", accuracy: "92.4%", status: "optimal" },
              { name: "Onboarding Assistant", model: "gpt-4-turbo", temp: "0.3", requests: "567", accuracy: "89.7%", status: "optimal" },
              { name: "Skills Gap Analyzer", model: "gpt-4-turbo", temp: "0.2", requests: "892", accuracy: "94.2%", status: "optimal" },
              { name: "Compliance Predictor", model: "gpt-4-turbo-instruct", temp: "0.0", requests: "234", accuracy: "91.8%", status: "optimal" },
              { name: "Sentiment Analyzer", model: "gpt-3.5-turbo", temp: "0.0", requests: "1,456", accuracy: "89.7%", status: "optimal" },
              { name: "Content Generator", model: "gpt-4-turbo", temp: "0.7", requests: "445", accuracy: "86.3%", status: "optimal" },
            ].map((tool, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${tool.status === 'optimal' ? 'bg-brand-success' : 'bg-brand-warning'}`}></div>
                  <div>
                    <div className="font-medium">{tool.name}</div>
                    <div className="text-xs text-muted-foreground">{tool.model} • temp: {tool.temp}</div>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <div className="font-medium">{tool.requests}</div>
                    <div className="text-xs text-muted-foreground">Requests/day</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-brand-success">{tool.accuracy}</div>
                    <div className="text-xs text-muted-foreground">Accuracy</div>
                  </div>
                  <Badge variant={tool.status === 'optimal' ? 'default' : 'secondary'}>
                    {tool.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Government Integrations */}
      <Card className="border-brand-accent/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-brand-accent" />
            Government Integrations Status
          </CardTitle>
          <CardDescription>Real-time monitoring of all 21 government platform connections</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-brand-accent">21</div>
              <div className="text-sm text-muted-foreground">Active Integrations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-brand-success">100%</div>
              <div className="text-sm text-muted-foreground">Online Status</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-brand-primary">567ms</div>
              <div className="text-sm text-muted-foreground">Avg Sync Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-brand-warning">4,892</div>
              <div className="text-sm text-muted-foreground">Daily Syncs</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              // Core Government Platforms
              { name: "Qiwa Platform", category: "Employment", status: "connected", lastSync: "2 min ago", syncCount: "234" },
              { name: "GOSI Integration", category: "Social Insurance", status: "connected", lastSync: "1 min ago", syncCount: "189" },
              { name: "Mudad Platform", category: "Labor", status: "connected", lastSync: "3 min ago", syncCount: "156" },
              { name: "ELM Platform", category: "Education", status: "connected", lastSync: "5 min ago", syncCount: "78" },
              { name: "Absher Services", category: "Government ID", status: "connected", lastSync: "4 min ago", syncCount: "123" },
              { name: "Muqeem Platform", category: "Residence", status: "connected", lastSync: "2 min ago", syncCount: "89" },
              { name: "Seha Platform", category: "Health", status: "connected", lastSync: "6 min ago", syncCount: "67" },
              
              // Additional Integrations
              { name: "CHI Platform", category: "Health Insurance", status: "connected", lastSync: "3 min ago", syncCount: "45" },
              { name: "HRSD Services", category: "Social Development", status: "connected", lastSync: "7 min ago", syncCount: "34" },
              { name: "TVTC/Doroob", category: "Training", status: "connected", lastSync: "4 min ago", syncCount: "56" },
              
              { name: "Qiyas Assessment", category: "Assessment", status: "connected", lastSync: "5 min ago", syncCount: "19" },
              { name: "NCAAA Platform", category: "Accreditation", status: "connected", lastSync: "9 min ago", syncCount: "12" },
              { name: "Ministry of Education", category: "Education", status: "connected", lastSync: "6 min ago", syncCount: "15" },
              { name: "TAQAT/HRDF", category: "HR Development", status: "connected", lastSync: "4 min ago", syncCount: "27" },
              { name: "NCEI Employment", category: "Employment", status: "connected", lastSync: "7 min ago", syncCount: "18" },
              { name: "Ministry of Interior", category: "Interior", status: "connected", lastSync: "5 min ago", syncCount: "21" },
              { name: "ESNAD Notarization", category: "Legal", status: "connected", lastSync: "8 min ago", syncCount: "9" },
              { name: "Saudi Post Verification", category: "Postal", status: "connected", lastSync: "6 min ago", syncCount: "14" },
              { name: "Tawakkalna Compliance", category: "Health", status: "connected", lastSync: "3 min ago", syncCount: "31" },
              { name: "Umm Al-Qura Calendar", category: "Calendar", status: "connected", lastSync: "2 min ago", syncCount: "7" },
            ].map((integration, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${integration.status === 'connected' ? 'bg-brand-success' : 'bg-brand-danger'}`}></div>
                    <span className="font-medium text-sm">{integration.name}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">{integration.category}</Badge>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Last sync: {integration.lastSync}</span>
                  <span>{integration.syncCount} today</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dashboard Metrics Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-brand-primary" />
            Updated Dashboard Metrics
          </CardTitle>
          <CardDescription>Reflecting all AI tools and government integrations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-brand-primary">10</div>
              <div className="text-sm text-muted-foreground">AI Tools Active</div>
              <div className="text-xs text-brand-success">+5 new tools added</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-brand-accent">21</div>
              <div className="text-sm text-muted-foreground">Government Integrations</div>
              <div className="text-xs text-brand-success">+13 integrations added</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-brand-secondary">85</div>
              <div className="text-sm text-muted-foreground">Active Workflows</div>
              <div className="text-xs text-brand-success">+38 workflows enhanced</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-brand-warning">25,847</div>
              <div className="text-sm text-muted-foreground">AI-Powered Verifications</div>
              <div className="text-xs text-brand-success">+10,169 this month</div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gradient-to-r from-brand-primary/10 to-brand-accent/10 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-foreground">System Health Score</div>
                <div className="text-sm text-muted-foreground">Overall platform performance</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-brand-success">98.7%</div>
                <div className="text-xs text-brand-success">+2.1% improvement</div>
              </div>
            </div>
            <Progress value={98.7} className="h-2 mt-3" />
          </div>
        </CardContent>
      </Card>

      <AqlHRAIAssistant 
        moduleContext="analytics.realtime" 
        companyId="demo-company"
      />
    </div>
  );
};

export default RealtimeDashboards;